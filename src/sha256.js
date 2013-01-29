(function (Math) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Constants tables
    var STATE = [];
    var ROUND_CONSTANTS = [];

    // Compute constants
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (n % factor === 0) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2, nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    STATE[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                ROUND_CONSTANTS[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                nPrime++;
            }

            n++;
        }
    }());

    // Reusable object for expanded message
    var M = [];

    /**
     * SHA-256 hash algorithm.
     */
    var SHA256 = C.SHA256 = Hasher.extend({
        _doInit: function () {
        },

        _doReset: function () {
            this._state = STATE.slice(0);
        },

        _doProcessBlock: function (m) {
            // Shortcuts
            var s = this._state;
            var s0 = s[0];
            var s1 = s[1];
            var s2 = s[2];
            var s3 = s[3];
            var s4 = s[4];
            var s5 = s[5];
            var s6 = s[6];
            var s7 = s[7];
            var _s0 = s0;
            var _s1 = s1;
            var _s2 = s2;
            var _s3 = s3;
            var _s4 = s4;
            var _s5 = s5;
            var _s6 = s6;
            var _s7 = s7;

            // Rounds
            for (var round = 0; round < 64; round++) {
                // Expand message
                if (round < 16) {
                    var MRound = m[round];
                } else {
                    var gamma0x = M[round - 15];
                    var gamma1x = M[round - 2];
                    var MRound = (
                        M[round - 7] + M[round - 16] + (
                            ((gamma0x << 25) | (gamma0x >>> 7))  ^
                            ((gamma0x << 14) | (gamma0x >>> 18)) ^
                            (gamma0x >>> 3)
                        ) + (
                            ((gamma1x << 15) | (gamma1x >>> 17)) ^
                            ((gamma1x << 13) | (gamma1x >>> 19)) ^
                            (gamma1x >>> 10)
                        )
                    );
                }
                M[round] = MRound |= 0;

                // Computation
                var t1 = (
                    (((s4 << 26) | (s4 >>> 6)) ^ ((s4 << 21) | (s4 >>> 11)) ^ ((s4 << 7)  | (s4 >>> 25))) +
                    ((s4 & s5) ^ (~s4 & s6)) + s7 + MRound + ROUND_CONSTANTS[round]
                );
                var t2 = (
                    (((s0 << 30) | (s0 >>> 2)) ^ ((s0 << 19) | (s0 >>> 13)) ^ ((s0 << 10) | (s0 >>> 22))) +
                    ((s0 & s1) ^ (s0 & s2) ^ (s1 & s2))
                );

                // Update working state
                s7 = s6;
                s6 = s5;
                s5 = s4;
                s4 = (s3 + t1) | 0;
                s3 = s2;
                s2 = s1;
                s1 = s0;
                s0 = (t1 + t2) | 0;
            }

            // Update state
            s[0] = (_s0 + s0) | 0;
            s[1] = (_s1 + s1) | 0;
            s[2] = (_s2 + s2) | 0;
            s[3] = (_s3 + s3) | 0;
            s[4] = (_s4 + s4) | 0;
            s[5] = (_s5 + s5) | 0;
            s[6] = (_s6 + s6) | 0;
            s[7] = (_s7 + s7) | 0;
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
            var clone = SHA256.$super.prototype.clone.call(this);
            clone._state = clone._state.slice(0);

            return clone;
        }
    });
}(Math));
