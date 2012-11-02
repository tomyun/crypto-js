(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;
    var C_ALGO = C.algo;

    // Reusable object
    var W = [];

    /**
     * SHA-1 hash algorithm.
     */
    var SHA1 = C_ALGO.SHA1 = Hasher.extend({
        _doReset: function () {
            this._hash = WordArray.create([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
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

            var nBitsLeft = data.sigBytes * 8;

            var nBitsTotalL = this._nDataBitsL;
            var nBitsTotalH = this._nDataBitsH;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var lengthStartIndex = (((nBitsLeft + 64) >>> 9) << 4) + 14;
            dataWords[lengthStartIndex] = nBitsTotalH;
            dataWords[lengthStartIndex + 1] = nBitsTotalL;

            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();
        }
    });

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
     *     var hash = CryptoJS.SHA1('message');
     *     var hash = CryptoJS.SHA1(wordArray);
     */
    C.SHA1 = Hasher._createHelper(SHA1);

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
     *     var hmac = CryptoJS.HmacSHA1(message, key);
     */
    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
}());
