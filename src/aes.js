(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Cipher = C_lib.Cipher;
    var C_lib_Cipher_Block = C_lib_Cipher.Block;
    var C_algo = C.algo;

    // Multiplication in GF(2^8) lookup tables
    var SBOX = [];
    var INVSBOX = [];
    var MULT2 = [];
    var MULT3 = [];
    var MULT9 = [];
    var MULTB = [];
    var MULTD = [];
    var MULTE = [];
    var MULT2_SBOX = [];
    var MULT3_SBOX = [];

    // Compute lookup tables
    (function () {
        // Compute double table
        var d = [];
        for (var i = 0; i < 256; i++) {
            if (i < 128) {
                d[i] = i << 1;
            } else {
                d[i] = (i << 1) ^ 0x11b;
            }
        }

        // Walk GF(2^8)
        var x = 0, xi = 0;
        for (var i = 0; i < 256; i++) {
            // Compute sbox
            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
            SBOX[x] = sx;
            INVSBOX[sx] = x;

            // Compute multiplication
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];
            MULT2[x] = x2;
            MULT3[x] = x2 ^ x;
            MULT9[x] = x8 ^ x;
            MULTB[x] = x8 ^ x2 ^ x;
            MULTD[x] = x8 ^ x4 ^ x;
            MULTE[x] = x8 ^ x4 ^ x2;

            // Compute next counter
            if (x == 0) {
                x = xi = 1;
            } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
            }
        }

        // Shortcuts
        for (var i = 0; i < 256; i++) {
            MULT2_SBOX[i] = MULT2[SBOX[i]];
            MULT3_SBOX[i] = MULT3[SBOX[i]];
        }
    }());

    // Precomputed RCon lookup
    var RCON = [
        0x00000000, 0x01000000, 0x02000000, 0x04000000,
        0x08000000, 0x10000000, 0x20000000, 0x40000000,
        0x80000000, 0x1b000000, 0x36000000
    ];

    // Private static inner state
    var keySchedule = [];
    var keyLength;
    var nRounds;

    /**
     * AES block cipher algorithm.
     */
    var C_algo_AES = C_algo.AES = C_lib_Cipher_Block.extend({
        _init: function (key) {
            keyLength = key.sigBytes / 4;
            nRounds = keyLength + 6;

            computeKeySchedule(key.words);
        },

        _encryptBlock: function (data, offset) {
            // Set input, add round key
            var s0 = data[offset + 0] ^ keySchedule[0];
            var s1 = data[offset + 1] ^ keySchedule[1];
            var s2 = data[offset + 2] ^ keySchedule[2];
            var s3 = data[offset + 3] ^ keySchedule[3];

            // Key schedule row counter
            var ksRow = 4;

            // Rounds
            for (var round = 1; round < nRounds; round++) {
                // Shift rows, sub bytes, mix columns
                var t0 = (
                    ((MULT2_SBOX[s0 >>> 24] ^ MULT3_SBOX[(s1 >>> 16) & 0xff] ^ SBOX[(s2 >>> 8) & 0xff]       ^ SBOX[s3 & 0xff])       << 24) |
                    ((SBOX[s0 >>> 24]       ^ MULT2_SBOX[(s1 >>> 16) & 0xff] ^ MULT3_SBOX[(s2 >>> 8) & 0xff] ^ SBOX[s3 & 0xff])       << 16) |
                    ((SBOX[s0 >>> 24]       ^ SBOX[(s1 >>> 16) & 0xff]       ^ MULT2_SBOX[(s2 >>> 8) & 0xff] ^ MULT3_SBOX[s3 & 0xff]) << 8 ) |
                    ((MULT3_SBOX[s0 >>> 24] ^ SBOX[(s1 >>> 16) & 0xff]       ^ SBOX[(s2 >>> 8) & 0xff]       ^ MULT2_SBOX[s3 & 0xff])      )
                );
                var t1 = (
                    ((MULT2_SBOX[s1 >>> 24] ^ MULT3_SBOX[(s2 >>> 16) & 0xff] ^ SBOX[(s3 >>> 8) & 0xff]       ^ SBOX[s0 & 0xff])       << 24) |
                    ((SBOX[s1 >>> 24]       ^ MULT2_SBOX[(s2 >>> 16) & 0xff] ^ MULT3_SBOX[(s3 >>> 8) & 0xff] ^ SBOX[s0 & 0xff])       << 16) |
                    ((SBOX[s1 >>> 24]       ^ SBOX[(s2 >>> 16) & 0xff]       ^ MULT2_SBOX[(s3 >>> 8) & 0xff] ^ MULT3_SBOX[s0 & 0xff]) << 8 ) |
                    ((MULT3_SBOX[s1 >>> 24] ^ SBOX[(s2 >>> 16) & 0xff]       ^ SBOX[(s3 >>> 8) & 0xff]       ^ MULT2_SBOX[s0 & 0xff])      )
                );
                var t2 = (
                    ((MULT2_SBOX[s2 >>> 24] ^ MULT3_SBOX[(s3 >>> 16) & 0xff] ^ SBOX[(s0 >>> 8) & 0xff]       ^ SBOX[s1 & 0xff])       << 24) |
                    ((SBOX[s2 >>> 24]       ^ MULT2_SBOX[(s3 >>> 16) & 0xff] ^ MULT3_SBOX[(s0 >>> 8) & 0xff] ^ SBOX[s1 & 0xff])       << 16) |
                    ((SBOX[s2 >>> 24]       ^ SBOX[(s3 >>> 16) & 0xff]       ^ MULT2_SBOX[(s0 >>> 8) & 0xff] ^ MULT3_SBOX[s1 & 0xff]) << 8 ) |
                    ((MULT3_SBOX[s2 >>> 24] ^ SBOX[(s3 >>> 16) & 0xff]       ^ SBOX[(s0 >>> 8) & 0xff]       ^ MULT2_SBOX[s1 & 0xff])      )
                );
                var t3 = (
                    ((MULT2_SBOX[s3 >>> 24] ^ MULT3_SBOX[(s0 >>> 16) & 0xff] ^ SBOX[(s1 >>> 8) & 0xff]       ^ SBOX[s2 & 0xff])       << 24) |
                    ((SBOX[s3 >>> 24]       ^ MULT2_SBOX[(s0 >>> 16) & 0xff] ^ MULT3_SBOX[(s1 >>> 8) & 0xff] ^ SBOX[s2 & 0xff])       << 16) |
                    ((SBOX[s3 >>> 24]       ^ SBOX[(s0 >>> 16) & 0xff]       ^ MULT2_SBOX[(s1 >>> 8) & 0xff] ^ MULT3_SBOX[s2 & 0xff]) << 8 ) |
                    ((MULT3_SBOX[s3 >>> 24] ^ SBOX[(s0 >>> 16) & 0xff]       ^ SBOX[(s1 >>> 8) & 0xff]       ^ MULT2_SBOX[s2 & 0xff])      )
                );

                // Add round key
                s0 = t0 ^ keySchedule[ksRow++];
                s1 = t1 ^ keySchedule[ksRow++];
                s2 = t2 ^ keySchedule[ksRow++];
                s3 = t3 ^ keySchedule[ksRow++];
            }

            // Shift rows, sub bytes, add round key
            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

            // Set output
            data[offset + 0] = t0;
            data[offset + 1] = t1;
            data[offset + 2] = t2;
            data[offset + 3] = t3;

        },

        _decryptBlock: function (data, offset) {
            // Key schedule row counter
            var ksRow = (nRounds + 1) * 4;

            // Set input, add round key
            var s3 = data[offset + 3] ^ keySchedule[--ksRow];
            var s2 = data[offset + 2] ^ keySchedule[--ksRow];
            var s1 = data[offset + 1] ^ keySchedule[--ksRow];
            var s0 = data[offset + 0] ^ keySchedule[--ksRow];

            // Rounds
            for (var round = 1; round < nRounds; round++) {
                // Inv shift rows, inv sub bytes, add round key
                var t3 = ((INVSBOX[s3 >>> 24] << 24) | (INVSBOX[(s2 >>> 16) & 0xff] << 16) | (INVSBOX[(s1 >>> 8) & 0xff] << 8) | INVSBOX[s0 & 0xff]) ^ keySchedule[--ksRow];
                var t2 = ((INVSBOX[s2 >>> 24] << 24) | (INVSBOX[(s1 >>> 16) & 0xff] << 16) | (INVSBOX[(s0 >>> 8) & 0xff] << 8) | INVSBOX[s3 & 0xff]) ^ keySchedule[--ksRow];
                var t1 = ((INVSBOX[s1 >>> 24] << 24) | (INVSBOX[(s0 >>> 16) & 0xff] << 16) | (INVSBOX[(s3 >>> 8) & 0xff] << 8) | INVSBOX[s2 & 0xff]) ^ keySchedule[--ksRow];
                var t0 = ((INVSBOX[s0 >>> 24] << 24) | (INVSBOX[(s3 >>> 16) & 0xff] << 16) | (INVSBOX[(s2 >>> 8) & 0xff] << 8) | INVSBOX[s1 & 0xff]) ^ keySchedule[--ksRow];

                // Inv mix columns
                s0 = (
                    ((MULTE[t0 >>> 24] ^ MULTB[(t0 >>> 16) & 0xff] ^ MULTD[(t0 >>> 8) & 0xff] ^ MULT9[t0 & 0xff]) << 24) |
                    ((MULT9[t0 >>> 24] ^ MULTE[(t0 >>> 16) & 0xff] ^ MULTB[(t0 >>> 8) & 0xff] ^ MULTD[t0 & 0xff]) << 16) |
                    ((MULTD[t0 >>> 24] ^ MULT9[(t0 >>> 16) & 0xff] ^ MULTE[(t0 >>> 8) & 0xff] ^ MULTB[t0 & 0xff]) <<  8) |
                    ((MULTB[t0 >>> 24] ^ MULTD[(t0 >>> 16) & 0xff] ^ MULT9[(t0 >>> 8) & 0xff] ^ MULTE[t0 & 0xff])      )
                );
                s1 = (
                    ((MULTE[t1 >>> 24] ^ MULTB[(t1 >>> 16) & 0xff] ^ MULTD[(t1 >>> 8) & 0xff] ^ MULT9[t1 & 0xff]) << 24) |
                    ((MULT9[t1 >>> 24] ^ MULTE[(t1 >>> 16) & 0xff] ^ MULTB[(t1 >>> 8) & 0xff] ^ MULTD[t1 & 0xff]) << 16) |
                    ((MULTD[t1 >>> 24] ^ MULT9[(t1 >>> 16) & 0xff] ^ MULTE[(t1 >>> 8) & 0xff] ^ MULTB[t1 & 0xff]) <<  8) |
                    ((MULTB[t1 >>> 24] ^ MULTD[(t1 >>> 16) & 0xff] ^ MULT9[(t1 >>> 8) & 0xff] ^ MULTE[t1 & 0xff])      )
                );
                s2 = (
                    ((MULTE[t2 >>> 24] ^ MULTB[(t2 >>> 16) & 0xff] ^ MULTD[(t2 >>> 8) & 0xff] ^ MULT9[t2 & 0xff]) << 24) |
                    ((MULT9[t2 >>> 24] ^ MULTE[(t2 >>> 16) & 0xff] ^ MULTB[(t2 >>> 8) & 0xff] ^ MULTD[t2 & 0xff]) << 16) |
                    ((MULTD[t2 >>> 24] ^ MULT9[(t2 >>> 16) & 0xff] ^ MULTE[(t2 >>> 8) & 0xff] ^ MULTB[t2 & 0xff]) <<  8) |
                    ((MULTB[t2 >>> 24] ^ MULTD[(t2 >>> 16) & 0xff] ^ MULT9[(t2 >>> 8) & 0xff] ^ MULTE[t2 & 0xff])      )
                );
                s3 = (
                    ((MULTE[t3 >>> 24] ^ MULTB[(t3 >>> 16) & 0xff] ^ MULTD[(t3 >>> 8) & 0xff] ^ MULT9[t3 & 0xff]) << 24) |
                    ((MULT9[t3 >>> 24] ^ MULTE[(t3 >>> 16) & 0xff] ^ MULTB[(t3 >>> 8) & 0xff] ^ MULTD[t3 & 0xff]) << 16) |
                    ((MULTD[t3 >>> 24] ^ MULT9[(t3 >>> 16) & 0xff] ^ MULTE[(t3 >>> 8) & 0xff] ^ MULTB[t3 & 0xff]) <<  8) |
                    ((MULTB[t3 >>> 24] ^ MULTD[(t3 >>> 16) & 0xff] ^ MULT9[(t3 >>> 8) & 0xff] ^ MULTE[t3 & 0xff])      )
                );
            }

            // Inv shift rows, inv sub bytes, add round key
            var t3 = ((INVSBOX[s3 >>> 24] << 24) | (INVSBOX[(s2 >>> 16) & 0xff] << 16) | (INVSBOX[(s1 >>> 8) & 0xff] << 8) | INVSBOX[s0 & 0xff]) ^ keySchedule[--ksRow];
            var t2 = ((INVSBOX[s2 >>> 24] << 24) | (INVSBOX[(s1 >>> 16) & 0xff] << 16) | (INVSBOX[(s0 >>> 8) & 0xff] << 8) | INVSBOX[s3 & 0xff]) ^ keySchedule[--ksRow];
            var t1 = ((INVSBOX[s1 >>> 24] << 24) | (INVSBOX[(s0 >>> 16) & 0xff] << 16) | (INVSBOX[(s3 >>> 8) & 0xff] << 8) | INVSBOX[s2 & 0xff]) ^ keySchedule[--ksRow];
            var t0 = ((INVSBOX[s0 >>> 24] << 24) | (INVSBOX[(s3 >>> 16) & 0xff] << 16) | (INVSBOX[(s2 >>> 8) & 0xff] << 8) | INVSBOX[s1 & 0xff]) ^ keySchedule[--ksRow];

            // Set output
            data[offset + 0] = t0;
            data[offset + 1] = t1;
            data[offset + 2] = t2;
            data[offset + 3] = t3;
        },

        _keySize: 256/32
    });

    function computeKeySchedule(k) {
        var ksRows = (nRounds + 1) * 4;
        for (var ksRow = 0; ksRow < ksRows; ksRow++) {
            if (ksRow < keyLength) {
                keySchedule[ksRow] = k[ksRow];
            } else {
                var t = keySchedule[ksRow - 1];

                if (ksRow % keyLength == 0) {
                    // Rot word
                    t = (t << 8) | (t >>> 24);

                    // Sub word
                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                    // Mix Rcon
                    t ^= RCON[ksRow / keyLength];
                } else if (keyLength > 6 && ksRow % keyLength == 4) {
                    // Sub word
                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                }

                keySchedule[ksRow] = keySchedule[ksRow - keyLength] ^ t;
            }
        }
    }

    // Helper
    C.AES = C_lib_Cipher._createHelper(C_algo_AES);
}());
