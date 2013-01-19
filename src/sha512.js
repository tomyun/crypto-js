(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Constants
    var K = [
        0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
        0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
        0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
        0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
        0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
        0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
        0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
        0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
        0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
        0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
        0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
        0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
        0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
        0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
        0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
        0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
        0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
        0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
        0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
        0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
    ];

    // Reusable object for expanded message
    var M = [];

    /**
     * SHA-512 hash algorithm.
     */
    var SHA512 = C.SHA512 = Hasher.extend({
        _doInit: function () {
        },

        _doReset: function () {
            this._state = [
                0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b,
                0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
                0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f,
                0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179
            ];
        },

        _doProcessBlock: function (m) {
            // Shortcuts
            var s = this._state;
            var s0Msw = s[0];
            var s0Lsw = s[1];
            var s1Msw = s[2];
            var s1Lsw = s[3];
            var s2Msw = s[4];
            var s2Lsw = s[5];
            var s3Msw = s[6];
            var s3Lsw = s[7];
            var s4Msw = s[8];
            var s4Lsw = s[9];
            var s5Msw = s[10];
            var s5Lsw = s[11];
            var s6Msw = s[12];
            var s6Lsw = s[13];
            var s7Msw = s[14];
            var s7Lsw = s[15];
            var _s0Msw = s0Msw;
            var _s0Lsw = s0Lsw;
            var _s1Msw = s1Msw;
            var _s1Lsw = s1Lsw;
            var _s2Msw = s2Msw;
            var _s2Lsw = s2Lsw;
            var _s3Msw = s3Msw;
            var _s3Lsw = s3Lsw;
            var _s4Msw = s4Msw;
            var _s4Lsw = s4Lsw;
            var _s5Msw = s5Msw;
            var _s5Lsw = s5Lsw;
            var _s6Msw = s6Msw;
            var _s6Lsw = s6Lsw;
            var _s7Msw = s7Msw;
            var _s7Lsw = s7Lsw;

            // Expand message
            for (var round = 0; round < 160; round += 2) {
                if (round < 32) {
                    var MRoundMsw = m[round];
                    var MRoundLsw = m[round + 1];
                } else {
                    // Shortcuts
                    var MRound2Msw  = M[round - 4];
                    var MRound2Lsw  = M[round - 3];
                    var MRound7Msw  = M[round - 14];
                    var MRound7Lsw  = M[round - 13];
                    var MRound15Msw = M[round - 30];
                    var MRound15Lsw = M[round - 29];
                    var MRound16Msw = M[round - 32];
                    var MRound16Lsw = M[round - 31];

                    // M[round - 7] + gamma0
                    var t0Lsw = MRound7Lsw + (
                        ((MRound15Msw << 31) | (MRound15Lsw >>> 1)) ^
                        ((MRound15Msw << 24) | (MRound15Lsw >>> 8)) ^
                        ((MRound15Msw << 25) | (MRound15Lsw >>> 7))
                    );
                    var t0Msw = ((t0Lsw >>> 0) < (MRound7Lsw >>> 0) ? 1 : 0) + MRound7Msw + (
                        ((MRound15Lsw << 31) | (MRound15Msw >>> 1)) ^
                        ((MRound15Lsw << 24) | (MRound15Msw >>> 8)) ^
                        (MRound15Msw >>> 7)
                    );

                    // M[round - 16] + gamma1
                    var t1Lsw = MRound16Lsw + (
                        ((MRound2Msw << 13) | (MRound2Lsw >>> 19)) ^
                        ((MRound2Lsw << 3)  | (MRound2Msw >>> 29)) ^
                        ((MRound2Msw << 26) | (MRound2Lsw >>> 6))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (MRound16Lsw >>> 0) ? 1 : 0) + MRound16Msw + (
                        ((MRound2Lsw << 13) | (MRound2Msw >>> 19)) ^
                        ((MRound2Msw << 3)  | (MRound2Lsw >>> 29)) ^
                        (MRound2Msw >>> 6)
                    );

                    // (M[round - 7] + gamma0) + (M[round - 16] + gamma1)
                    var MRoundLsw = t0Lsw + t1Lsw;
                    var MRoundMsw = ((MRoundLsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;
                }

                // Set expanded message
                M[round]     = MRoundMsw |= 0;
                M[round + 1] = MRoundLsw |= 0;
            }

            // Rounds
            for (var round = 0; round < 160; round += 32) {
                // Inline round 1
                {
                    // Shortcuts
                    var MRoundMsw = M[round];
                    var MRoundLsw = M[round + 1];
                    var KRoundMsw = K[round];
                    var KRoundLsw = K[round + 1];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 2
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 2];
                    var MRoundLsw = M[round + 3];
                    var KRoundMsw = K[round + 2];
                    var KRoundLsw = K[round + 3];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 3
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 4];
                    var MRoundLsw = M[round + 5];
                    var KRoundMsw = K[round + 4];
                    var KRoundLsw = K[round + 5];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 4
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 6];
                    var MRoundLsw = M[round + 7];
                    var KRoundMsw = K[round + 6];
                    var KRoundLsw = K[round + 7];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 5
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 8];
                    var MRoundLsw = M[round + 9];
                    var KRoundMsw = K[round + 8];
                    var KRoundLsw = K[round + 9];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 6
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 10];
                    var MRoundLsw = M[round + 11];
                    var KRoundMsw = K[round + 10];
                    var KRoundLsw = K[round + 11];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 7
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 12];
                    var MRoundLsw = M[round + 13];
                    var KRoundMsw = K[round + 12];
                    var KRoundLsw = K[round + 13];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 8
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 14];
                    var MRoundLsw = M[round + 15];
                    var KRoundMsw = K[round + 14];
                    var KRoundLsw = K[round + 15];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 9
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 16];
                    var MRoundLsw = M[round + 17];
                    var KRoundMsw = K[round + 16];
                    var KRoundLsw = K[round + 17];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 10
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 18];
                    var MRoundLsw = M[round + 19];
                    var KRoundMsw = K[round + 18];
                    var KRoundLsw = K[round + 19];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 11
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 20];
                    var MRoundLsw = M[round + 21];
                    var KRoundMsw = K[round + 20];
                    var KRoundLsw = K[round + 21];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 12
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 22];
                    var MRoundLsw = M[round + 23];
                    var KRoundMsw = K[round + 22];
                    var KRoundLsw = K[round + 23];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 13
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 24];
                    var MRoundLsw = M[round + 25];
                    var KRoundMsw = K[round + 24];
                    var KRoundLsw = K[round + 25];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 14
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 26];
                    var MRoundLsw = M[round + 27];
                    var KRoundMsw = K[round + 26];
                    var KRoundLsw = K[round + 27];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 15
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 28];
                    var MRoundLsw = M[round + 29];
                    var KRoundMsw = K[round + 28];
                    var KRoundLsw = K[round + 29];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }

                // Inline round 16
                {
                    // Shortcuts
                    var MRoundMsw = M[round + 30];
                    var MRoundLsw = M[round + 31];
                    var KRoundMsw = K[round + 30];
                    var KRoundLsw = K[round + 31];

                    // M[round] + Ch
                    var t0Lsw = MRoundLsw + ((s4Lsw & s5Lsw) ^ (~s4Lsw & s6Lsw));
                    var t0Msw = ((t0Lsw >>> 0) < (MRoundLsw >>> 0) ? 1 : 0) + MRoundMsw + (
                        (s4Msw & s5Msw) ^ (~s4Msw & s6Msw)
                    );

                    // K[round] + sigma1
                    var t1Lsw = KRoundLsw + (
                        ((s4Msw << 18) | (s4Lsw >>> 14)) ^
                        ((s4Msw << 14) | (s4Lsw >>> 18)) ^
                        ((s4Lsw << 23) | (s4Msw >>> 9))
                    );
                    var t1Msw = ((t1Lsw >>> 0) < (KRoundLsw >>> 0) ? 1 : 0) + KRoundMsw + (
                        ((s4Lsw << 18) | (s4Msw >>> 14)) ^
                        ((s4Lsw << 14) | (s4Msw >>> 18)) ^
                        ((s4Msw << 23) | (s4Lsw >>> 9))
                    );

                    // (M[round] + Ch) + (K[round] + sigma1)
                    var t2Lsw = t0Lsw + t1Lsw;
                    var t2Msw = ((t2Lsw >>> 0) < (t0Lsw >>> 0) ? 1 : 0) + t0Msw + t1Msw;

                    // ((M[round] + Ch) + (K[round] + sigma1)) + s7
                    var t3Lsw = t2Lsw + s7Lsw;
                    var t3Msw = ((t3Lsw >>> 0) < (t2Lsw >>> 0) ? 1 : 0) + t2Msw + s7Msw;

                    // maj + sigma0
                    var majLsw = (s0Lsw & s1Lsw) ^ (s0Lsw & s2Lsw) ^ (s1Lsw & s2Lsw);
                    var t4Lsw = majLsw + (
                        ((s0Msw << 4)  | (s0Lsw >>> 28)) ^
                        ((s0Lsw << 30) | (s0Msw >>> 2))  ^
                        ((s0Lsw << 25) | (s0Msw >>> 7))
                    );
                    var t4Msw = (
                        ((t4Lsw >>> 0) < (majLsw >>> 0) ? 1 : 0) + (
                            (s0Msw & s1Msw) ^ (s0Msw & s2Msw) ^ (s1Msw & s2Msw)
                        ) + (
                            ((s0Lsw << 4)  | (s0Msw >>> 28)) ^
                            ((s0Msw << 30) | (s0Lsw >>> 2))  ^
                            ((s0Msw << 25) | (s0Lsw >>> 7))
                        )
                    );

                    // Update working state
                    s7Msw = s6Msw;
                    s7Lsw = s6Lsw;
                    s6Msw = s5Msw;
                    s6Lsw = s5Lsw;
                    s5Msw = s4Msw;
                    s5Lsw = s4Lsw;
                    s4Lsw = (s3Lsw + t3Lsw) | 0;
                    s4Msw = (s3Msw + t3Msw + ((s4Lsw >>> 0) < (s3Lsw >>> 0) ? 1 : 0)) | 0;
                    s3Msw = s2Msw;
                    s3Lsw = s2Lsw;
                    s2Msw = s1Msw;
                    s2Lsw = s1Lsw;
                    s1Msw = s0Msw;
                    s1Lsw = s0Lsw;
                    s0Lsw = (t3Lsw + t4Lsw) | 0;
                    s0Msw = (t3Msw + t4Msw + ((s0Lsw >>> 0) < (t3Lsw >>> 0) ? 1 : 0)) | 0;
                }
            }

            // Update state
            s0Lsw = s[1] = (_s0Lsw + s0Lsw) | 0;
            s[0] = (_s0Msw + s0Msw + ((s0Lsw >>> 0) < (_s0Lsw >>> 0) ? 1 : 0)) | 0;
            s1Lsw = s[3] = (_s1Lsw + s1Lsw) | 0;
            s[2] = (_s1Msw + s1Msw + ((s1Lsw >>> 0) < (_s1Lsw >>> 0) ? 1 : 0)) | 0;
            s2Lsw = s[5] = (_s2Lsw + s2Lsw) | 0;
            s[4] = (_s2Msw + s2Msw + ((s2Lsw >>> 0) < (_s2Lsw >>> 0) ? 1 : 0)) | 0;
            s3Lsw = s[7] = (_s3Lsw + s3Lsw) | 0;
            s[6] = (_s3Msw + s3Msw + ((s3Lsw >>> 0) < (_s3Lsw >>> 0) ? 1 : 0)) | 0;
            s4Lsw = s[9] = (_s4Lsw + s4Lsw) | 0;
            s[8] = (_s4Msw + s4Msw + ((s4Lsw >>> 0) < (_s4Lsw >>> 0) ? 1 : 0)) | 0;
            s5Lsw = s[11] = (_s5Lsw + s5Lsw) | 0;
            s[10] = (_s5Msw + s5Msw + ((s5Lsw >>> 0) < (_s5Lsw >>> 0) ? 1 : 0)) | 0;
            s6Lsw = s[13] = (_s6Lsw + s6Lsw) | 0;
            s[12] = (_s6Msw + s6Msw + ((s6Lsw >>> 0) < (_s6Lsw >>> 0) ? 1 : 0)) | 0;
            s7Lsw = s[15] = (_s7Lsw + s7Lsw) | 0;
            s[14] = (_s7Msw + s7Msw + ((s7Lsw >>> 0) < (_s7Lsw >>> 0) ? 1 : 0)) | 0;
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

            var lengthStartIndex = (((nBitsLeft + 128) >>> 10) << 5) + 30;
            dataWords[lengthStartIndex] = nBitsTotalMsw;
            dataWords[lengthStartIndex + 1] = nBitsTotalLsw;

            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final hash
            return new WordArray(this._state);
        },

        clone: function () {
            var clone = SHA512.$super.prototype.clone.call(this);
            clone._state = clone._state.slice(0);

            return clone;
        },

        blockSize: 1024 / 32
    });
}());
