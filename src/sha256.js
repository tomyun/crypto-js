(function (C) {
    var SHA256 = C.SHA256 = C.lib.Hasher.extend({
        _doReset: function () {
            // Shortcuts
            var H = this._hash.words;

            // Initial values
            H[0] = 0x6A09E667;
            H[1] = 0xBB67AE85;
            H[2] = 0x3C6EF372;
            H[3] = 0xA54FF53A;
            H[4] = 0x510E527F;
            H[5] = 0x9B05688C;
            H[6] = 0x1F83D9AB;
            H[7] = 0x5BE0CD19;
        },

        _hashBlock: function (offset) {
            // Shortcuts
            var m = this._message.words;
            var H = this._hash.words;

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            var w = [];

            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    w[i] = m[i + offset] >>> 0;
                } else {
                    var gamma0x = w[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                  ((gamma0x >>> 3)                   );

                    var gamma1x = w[i - 2];
                    var gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
                                  ((gamma1x <<  13) | (gamma1x >>> 19)) ^
                                  ((gamma1x >>> 10)                   );

                    w[i] = gamma0 + w[i - 7] + gamma1 + w[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>>  2)) ^
                             ((a << 19) | (a >>> 13)) ^
                             ((a << 10) | (a >>> 22));

                var sigma1 = ((e << 26) | (e >>>  6)) ^
                             ((e << 21) | (e >>> 11)) ^
                             ((e <<  7) | (e >>> 25));

                var t1 = (h + sigma1 + ch + K[i] + w[i]) >>> 0;
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = d + t1;
                d = c;
                c = b;
                b = a;
                a = t1 + t2;
            }

            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
            H[5] = (H[5] + f) >>> 0;
            H[6] = (H[6] + g) >>> 0;
            H[7] = (H[7] + h) >>> 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var message = this._message;
            var m = message.words;

            var nBitsTotal = this._length * 8;
            var nBitsLeft = message.getSigBytes() * 8;

            // Add padding
            m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            m[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            message.setSigBytes(m.length * 4);

            // Hash final blocks
            this._hashBlocks();
        }
    });

    // Static block size
    SHA256.blockSize = 16;

    // Constants
    var K = [
        0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
        0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
        0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
        0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
        0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
        0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ];
})(CryptoJS);
