(function (Math) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;
    var C_ALGO = C.algo;

    // Constants table
    var T = [];

    // Compute constants
    (function () {
        for (var i = 0; i < 64; i++) {
            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
        }
    }());

    /**
     * MD5 hash algorithm.
     */
    var MD5 = C_ALGO.MD5 = Hasher.extend({
        _doReset: function () {
            this._hash = WordArray.create([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
        },

        _doProcessBlock: function (M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var wordIndex = offset + i;
                var word = M[wordIndex];

                // Swap
                M[wordIndex] = (
                    (((word << 8)  | (word >>> 24)) & 0x00ff00ff) |
                    (((word << 24) | (word >>> 8))  & 0xff00ff00)
                );
            }

            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Rounds
            for (var round = 0; round < 64; round += 4) {
                if (round < 16) {
                    a = FF(a, b, c, d, M[offset + round],      7, T[round]);
                    d = FF(d, a, b, c, M[offset + round + 1], 12, T[round + 1]);
                    c = FF(c, d, a, b, M[offset + round + 2], 17, T[round + 2]);
                    b = FF(b, c, d, a, M[offset + round + 3], 22, T[round + 3]);
                } else if (round < 32) {
                    a = GG(a, b, c, d, M[offset + ((round + 1) % 16)],   5, T[round]);
                    d = GG(d, a, b, c, M[offset + ((round + 6) % 16)],   9, T[round + 1]);
                    c = GG(c, d, a, b, M[offset + ((round + 11) % 16)], 14, T[round + 2]);
                    b = GG(b, c, d, a, M[offset + (round % 16)],        20, T[round + 3]);
                } else if (round < 48) {
                    a = HH(a, b, c, d, M[offset + ((round * 3 + 5) % 16)],   4, T[round]);
                    d = HH(d, a, b, c, M[offset + ((round * 3 + 8) % 16)],  11, T[round + 1]);
                    c = HH(c, d, a, b, M[offset + ((round * 3 + 11) % 16)], 16, T[round + 2]);
                    b = HH(b, c, d, a, M[offset + ((round * 3 + 14) % 16)], 23, T[round + 3]);
                } else /* if (round < 64) */ {
                    a = II(a, b, c, d, M[offset + ((round * 3) % 16)],       6, T[round]);
                    d = II(d, a, b, c, M[offset + ((round * 3 + 7) % 16)],  10, T[round + 1]);
                    c = II(c, d, a, b, M[offset + ((round * 3 + 14) % 16)], 15, T[round + 2]);
                    b = II(b, c, d, a, M[offset + ((round * 3 + 5) % 16)],  21, T[round + 3]);
                }
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsLeft = data.sigBytes * 8;

            var nBitsTotalL = this._nDataBitsL;
            var nBitsTotalH = this._nDataBitsH;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var lengthStartIndex = (((nBitsLeft + 64) >>> 9) << 4) + 14;
            dataWords[lengthStartIndex] = (
                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
            );
            dataWords[lengthStartIndex + 1] = (
                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
            );

            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Shortcut
            var H = this._hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                // Shortcut
                var word = H[i];

                // Swap
                H[i] = (
                    (((word << 8)  | (word >>> 24)) & 0x00ff00ff) |
                    (((word << 24) | (word >>> 8))  & 0xff00ff00)
                );
            }
        }
    });

    // Auxiliary functions
    function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.MD5('message');
     *     var hash = CryptoJS.MD5(wordArray);
     */
    C.MD5 = Hasher._createHelper(MD5);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacMD5(message, key);
     */
    C.HmacMD5 = Hasher._createHmacHelper(MD5);
}(Math));
