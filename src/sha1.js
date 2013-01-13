(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Reusable object for expanded message
    var M = [];

    /**
     * SHA-1 hash algorithm.
     */
    var SHA1 = C.SHA1 = Hasher.extend({
        _doInit: function () {
        },

        _doReset: function () {
            this._state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
        },

        _doProcessBlock: function (m) {
            // Shortcuts
            var s = this._state;
            var s0 = s[0];
            var s1 = s[1];
            var s2 = s[2];
            var s3 = s[3];
            var s4 = s[4];

            // Rounds
            for (var round = 0; round < 80; round++) {
                if (round < 16) {
                    var MRound = m[round] | 0;
                } else {
                    var t = M[round - 3] ^ M[round - 8] ^ M[round - 14] ^ M[round - 16];
                    var MRound = (t << 1) | (t >>> 31);
                }
                M[round] = MRound;

                var t = ((s0 << 5) | (s0 >>> 27)) + s4 + MRound;
                if (round < 20) {
                    t += ((s1 & s2) | (~s1 & s3)) + 0x5a827999;
                } else if (round < 40) {
                    t += (s1 ^ s2 ^ s3) + 0x6ed9eba1;
                } else if (round < 60) {
                    t += ((s1 & s2) | (s1 & s3) | (s2 & s3)) - 0x70e44324;
                } else /* if (round < 80) */ {
                    t += (s1 ^ s2 ^ s3) - 0x359d3e2a;
                }

                s4 = s3;
                s3 = s2;
                s2 = (s1 << 30) | (s1 >>> 2);
                s1 = s0;
                s0 = t;
            }

            // Update state
            s[0] = (s[0] + s0) | 0;
            s[1] = (s[1] + s1) | 0;
            s[2] = (s[2] + s2) | 0;
            s[3] = (s[3] + s3) | 0;
            s[4] = (s[4] + s4) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsLeft = data.sigBytes * 8;
            var nBitsTotalLsw = this._nDataBitsLsw;
            var nBitsTotalMsw = this._nDataBitsMsw;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var lengthStartIndex = (((nBitsLeft + 64) >>> 9) << 4) + 14;
            dataWords[lengthStartIndex] = nBitsTotalMsw;
            dataWords[lengthStartIndex + 1] = nBitsTotalLsw;

            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final hash
            return new WordArray(this._state);
        },

        clone: function () {
            var clone = SHA1.$super.prototype.clone.call(this);
            clone._state = clone._state.slice(0);

            return clone;
        }
    });
}());
