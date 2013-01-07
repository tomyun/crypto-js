(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Reusable object
    var W = [];

    /**
     * SHA-1 hash algorithm.
     */
    var SHA1 = C.SHA1 = Hasher.extend({
        _doInit: function () {
        },

        _doReset: function () {
            this._hash = new WordArray([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];

            // Rounds
            for (var round = 0; round < 80; round++) {
                if (round < 16) {
                    var Wr = M[offset + round] | 0;
                } else {
                    var n = W[round - 3] ^ W[round - 8] ^ W[round - 14] ^ W[round - 16];
                    var Wr = (n << 1) | (n >>> 31);
                }
                W[round] = Wr;

                var t = ((a << 5) | (a >>> 27)) + e + Wr;
                if (round < 20) {
                    t += ((b & c) | (~b & d)) + 0x5a827999;
                } else if (round < 40) {
                    t += (b ^ c ^ d) + 0x6ed9eba1;
                } else if (round < 60) {
                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                } else /* if (round < 80) */ {
                    t += (b ^ c ^ d) - 0x359d3e2a;
                }

                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = t;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsLeft = 8 * data.sigBytes;
            var nBitsTotalLsw = this._nDataBitsLsw;
            var nBitsTotalMsw = this._nDataBitsMsw;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var lengthStartIndex = (((nBitsLeft + 64) >>> 9) << 4) + 14;
            dataWords[lengthStartIndex] = nBitsTotalMsw;
            dataWords[lengthStartIndex + 1] = nBitsTotalLsw;

            data.sigBytes = 4 * dataWords.length;

            // Hash final blocks
            this._process();

            // Return final hash
            return this._hash;
        },

        clone: function () {
            var clone = SHA1.$super.prototype.clone.call(this);
            clone._hash = clone._hash.clone();

            return clone;
        }
    });
}());
