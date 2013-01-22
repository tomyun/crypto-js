(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Constants
    var ROUND_CONSTANT_0 = 0x5a827999;
    var ROUND_CONSTANT_1 = 0x6ed9eba1;
    var ROUND_CONSTANT_2 = 0x8f1bbcdc;
    var ROUND_CONSTANT_3 = 0xca62c1d6;

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
            var _s0 = s0;
            var _s1 = s1;
            var _s2 = s2;
            var _s3 = s3;
            var _s4 = s4;

            // Expand message
            var m0  = m[0]  | 0;
            var m1  = m[1]  | 0;
            var m2  = m[2]  | 0;
            var m3  = m[3]  | 0;
            var m4  = m[4]  | 0;
            var m5  = m[5]  | 0;
            var m6  = m[6]  | 0;
            var m7  = m[7]  | 0;
            var m8  = m[8]  | 0;
            var m9  = m[9]  | 0;
            var m10 = m[10] | 0;
            var m11 = m[11] | 0;
            var m12 = m[12] | 0;
            var m13 = m[13] | 0;
            var m14 = m[14] | 0;
            var m15 = m[15] | 0;
            var m16 = m13 ^ m8 ^ m2 ^ m0;
            m16 = (m16 << 1) | (m16 >>> 31);
            var m17 = m14 ^ m9 ^ m3 ^ m1;
            m17 = (m17 << 1) | (m17 >>> 31);
            var m18 = m15 ^ m10 ^ m4 ^ m2;
            m18 = (m18 << 1) | (m18 >>> 31);
            var m19 = m16 ^ m11 ^ m5 ^ m3;
            m19 = (m19 << 1) | (m19 >>> 31);
            var m20 = m17 ^ m12 ^ m6 ^ m4;
            m20 = (m20 << 1) | (m20 >>> 31);
            var m21 = m18 ^ m13 ^ m7 ^ m5;
            m21 = (m21 << 1) | (m21 >>> 31);
            var m22 = m19 ^ m14 ^ m8 ^ m6;
            m22 = (m22 << 1) | (m22 >>> 31);
            var m23 = m20 ^ m15 ^ m9 ^ m7;
            m23 = (m23 << 1) | (m23 >>> 31);
            var m24 = m21 ^ m16 ^ m10 ^ m8;
            m24 = (m24 << 1) | (m24 >>> 31);
            var m25 = m22 ^ m17 ^ m11 ^ m9;
            m25 = (m25 << 1) | (m25 >>> 31);
            var m26 = m23 ^ m18 ^ m12 ^ m10;
            m26 = (m26 << 1) | (m26 >>> 31);
            var m27 = m24 ^ m19 ^ m13 ^ m11;
            m27 = (m27 << 1) | (m27 >>> 31);
            var m28 = m25 ^ m20 ^ m14 ^ m12;
            m28 = (m28 << 1) | (m28 >>> 31);
            var m29 = m26 ^ m21 ^ m15 ^ m13;
            m29 = (m29 << 1) | (m29 >>> 31);
            var m30 = m27 ^ m22 ^ m16 ^ m14;
            m30 = (m30 << 1) | (m30 >>> 31);
            var m31 = m28 ^ m23 ^ m17 ^ m15;
            m31 = (m31 << 1) | (m31 >>> 31);
            var m32 = m29 ^ m24 ^ m18 ^ m16;
            m32 = (m32 << 1) | (m32 >>> 31);
            var m33 = m30 ^ m25 ^ m19 ^ m17;
            m33 = (m33 << 1) | (m33 >>> 31);
            var m34 = m31 ^ m26 ^ m20 ^ m18;
            m34 = (m34 << 1) | (m34 >>> 31);
            var m35 = m32 ^ m27 ^ m21 ^ m19;
            m35 = (m35 << 1) | (m35 >>> 31);
            var m36 = m33 ^ m28 ^ m22 ^ m20;
            m36 = (m36 << 1) | (m36 >>> 31);
            var m37 = m34 ^ m29 ^ m23 ^ m21;
            m37 = (m37 << 1) | (m37 >>> 31);
            var m38 = m35 ^ m30 ^ m24 ^ m22;
            m38 = (m38 << 1) | (m38 >>> 31);
            var m39 = m36 ^ m31 ^ m25 ^ m23;
            m39 = (m39 << 1) | (m39 >>> 31);
            var m40 = m37 ^ m32 ^ m26 ^ m24;
            m40 = (m40 << 1) | (m40 >>> 31);
            var m41 = m38 ^ m33 ^ m27 ^ m25;
            m41 = (m41 << 1) | (m41 >>> 31);
            var m42 = m39 ^ m34 ^ m28 ^ m26;
            m42 = (m42 << 1) | (m42 >>> 31);
            var m43 = m40 ^ m35 ^ m29 ^ m27;
            m43 = (m43 << 1) | (m43 >>> 31);
            var m44 = m41 ^ m36 ^ m30 ^ m28;
            m44 = (m44 << 1) | (m44 >>> 31);
            var m45 = m42 ^ m37 ^ m31 ^ m29;
            m45 = (m45 << 1) | (m45 >>> 31);
            var m46 = m43 ^ m38 ^ m32 ^ m30;
            m46 = (m46 << 1) | (m46 >>> 31);
            var m47 = m44 ^ m39 ^ m33 ^ m31;
            m47 = (m47 << 1) | (m47 >>> 31);
            var m48 = m45 ^ m40 ^ m34 ^ m32;
            m48 = (m48 << 1) | (m48 >>> 31);
            var m49 = m46 ^ m41 ^ m35 ^ m33;
            m49 = (m49 << 1) | (m49 >>> 31);
            var m50 = m47 ^ m42 ^ m36 ^ m34;
            m50 = (m50 << 1) | (m50 >>> 31);
            var m51 = m48 ^ m43 ^ m37 ^ m35;
            m51 = (m51 << 1) | (m51 >>> 31);
            var m52 = m49 ^ m44 ^ m38 ^ m36;
            m52 = (m52 << 1) | (m52 >>> 31);
            var m53 = m50 ^ m45 ^ m39 ^ m37;
            m53 = (m53 << 1) | (m53 >>> 31);
            var m54 = m51 ^ m46 ^ m40 ^ m38;
            m54 = (m54 << 1) | (m54 >>> 31);
            var m55 = m52 ^ m47 ^ m41 ^ m39;
            m55 = (m55 << 1) | (m55 >>> 31);
            var m56 = m53 ^ m48 ^ m42 ^ m40;
            m56 = (m56 << 1) | (m56 >>> 31);
            var m57 = m54 ^ m49 ^ m43 ^ m41;
            m57 = (m57 << 1) | (m57 >>> 31);
            var m58 = m55 ^ m50 ^ m44 ^ m42;
            m58 = (m58 << 1) | (m58 >>> 31);
            var m59 = m56 ^ m51 ^ m45 ^ m43;
            m59 = (m59 << 1) | (m59 >>> 31);
            var m60 = m57 ^ m52 ^ m46 ^ m44;
            m60 = (m60 << 1) | (m60 >>> 31);
            var m61 = m58 ^ m53 ^ m47 ^ m45;
            m61 = (m61 << 1) | (m61 >>> 31);
            var m62 = m59 ^ m54 ^ m48 ^ m46;
            m62 = (m62 << 1) | (m62 >>> 31);
            var m63 = m60 ^ m55 ^ m49 ^ m47;
            m63 = (m63 << 1) | (m63 >>> 31);
            var m64 = m61 ^ m56 ^ m50 ^ m48;
            m64 = (m64 << 1) | (m64 >>> 31);
            var m65 = m62 ^ m57 ^ m51 ^ m49;
            m65 = (m65 << 1) | (m65 >>> 31);
            var m66 = m63 ^ m58 ^ m52 ^ m50;
            m66 = (m66 << 1) | (m66 >>> 31);
            var m67 = m64 ^ m59 ^ m53 ^ m51;
            m67 = (m67 << 1) | (m67 >>> 31);
            var m68 = m65 ^ m60 ^ m54 ^ m52;
            m68 = (m68 << 1) | (m68 >>> 31);
            var m69 = m66 ^ m61 ^ m55 ^ m53;
            m69 = (m69 << 1) | (m69 >>> 31);
            var m70 = m67 ^ m62 ^ m56 ^ m54;
            m70 = (m70 << 1) | (m70 >>> 31);
            var m71 = m68 ^ m63 ^ m57 ^ m55;
            m71 = (m71 << 1) | (m71 >>> 31);
            var m72 = m69 ^ m64 ^ m58 ^ m56;
            m72 = (m72 << 1) | (m72 >>> 31);
            var m73 = m70 ^ m65 ^ m59 ^ m57;
            m73 = (m73 << 1) | (m73 >>> 31);
            var m74 = m71 ^ m66 ^ m60 ^ m58;
            m74 = (m74 << 1) | (m74 >>> 31);
            var m75 = m72 ^ m67 ^ m61 ^ m59;
            m75 = (m75 << 1) | (m75 >>> 31);
            var m76 = m73 ^ m68 ^ m62 ^ m60;
            m76 = (m76 << 1) | (m76 >>> 31);
            var m77 = m74 ^ m69 ^ m63 ^ m61;
            m77 = (m77 << 1) | (m77 >>> 31);
            var m78 = m75 ^ m70 ^ m64 ^ m62;
            m78 = (m78 << 1) | (m78 >>> 31);
            var m79 = m76 ^ m71 ^ m65 ^ m63;
            m79 = (m79 << 1) | (m79 >>> 31);

            // Inline round 1
            var f = (s1 & s2) | (~s1 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m0 + ROUND_CONSTANT_0;

            // Inline round 2
            var f = (s0 & s1) | (~s0 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m1 + ROUND_CONSTANT_0;

            // Inline round 3
            var f = (s4 & s0) | (~s4 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m2 + ROUND_CONSTANT_0;

            // Inline round 4
            var f = (s3 & s4) | (~s3 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m3 + ROUND_CONSTANT_0;

            // Inline round 5
            var f = (s2 & s3) | (~s2 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m4 + ROUND_CONSTANT_0;

            // Inline round 6
            var f = (s1 & s2) | (~s1 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m5 + ROUND_CONSTANT_0;

            // Inline round 7
            var f = (s0 & s1) | (~s0 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m6 + ROUND_CONSTANT_0;

            // Inline round 8
            var f = (s4 & s0) | (~s4 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m7 + ROUND_CONSTANT_0;

            // Inline round 9
            var f = (s3 & s4) | (~s3 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m8 + ROUND_CONSTANT_0;

            // Inline round 10
            var f = (s2 & s3) | (~s2 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m9 + ROUND_CONSTANT_0;

            // Inline round 11
            var f = (s1 & s2) | (~s1 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m10 + ROUND_CONSTANT_0;

            // Inline round 12
            var f = (s0 & s1) | (~s0 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m11 + ROUND_CONSTANT_0;

            // Inline round 13
            var f = (s4 & s0) | (~s4 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m12 + ROUND_CONSTANT_0;

            // Inline round 14
            var f = (s3 & s4) | (~s3 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m13 + ROUND_CONSTANT_0;

            // Inline round 15
            var f = (s2 & s3) | (~s2 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m14 + ROUND_CONSTANT_0;

            // Inline round 16
            var f = (s1 & s2) | (~s1 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m15 + ROUND_CONSTANT_0;

            // Inline round 17
            var f = (s0 & s1) | (~s0 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m16 + ROUND_CONSTANT_0;

            // Inline round 18
            var f = (s4 & s0) | (~s4 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m17 + ROUND_CONSTANT_0;

            // Inline round 19
            var f = (s3 & s4) | (~s3 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m18 + ROUND_CONSTANT_0;

            // Inline round 20
            var f = (s2 & s3) | (~s2 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m19 + ROUND_CONSTANT_0;

            // Inline round 21
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m20 + ROUND_CONSTANT_1;

            // Inline round 22
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m21 + ROUND_CONSTANT_1;

            // Inline round 23
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m22 + ROUND_CONSTANT_1;

            // Inline round 24
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m23 + ROUND_CONSTANT_1;

            // Inline round 25
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m24 + ROUND_CONSTANT_1;

            // Inline round 26
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m25 + ROUND_CONSTANT_1;

            // Inline round 27
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m26 + ROUND_CONSTANT_1;

            // Inline round 28
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m27 + ROUND_CONSTANT_1;

            // Inline round 29
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m28 + ROUND_CONSTANT_1;

            // Inline round 30
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m29 + ROUND_CONSTANT_1;

            // Inline round 31
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m30 + ROUND_CONSTANT_1;

            // Inline round 32
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m31 + ROUND_CONSTANT_1;

            // Inline round 33
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m32 + ROUND_CONSTANT_1;

            // Inline round 34
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m33 + ROUND_CONSTANT_1;

            // Inline round 35
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m34 + ROUND_CONSTANT_1;

            // Inline round 36
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m35 + ROUND_CONSTANT_1;

            // Inline round 37
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m36 + ROUND_CONSTANT_1;

            // Inline round 38
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m37 + ROUND_CONSTANT_1;

            // Inline round 39
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m38 + ROUND_CONSTANT_1;

            // Inline round 40
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m39 + ROUND_CONSTANT_1;

            // Inline round 41
            var f = (s1 & s2) | (s1 & s3) | (s2 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m40 + ROUND_CONSTANT_2;

            // Inline round 42
            var f = (s0 & s1) | (s0 & s2) | (s1 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m41 + ROUND_CONSTANT_2;

            // Inline round 43
            var f = (s4 & s0) | (s4 & s1) | (s0 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m42 + ROUND_CONSTANT_2;

            // Inline round 44
            var f = (s3 & s4) | (s3 & s0) | (s4 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m43 + ROUND_CONSTANT_2;

            // Inline round 45
            var f = (s2 & s3) | (s2 & s4) | (s3 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m44 + ROUND_CONSTANT_2;

            // Inline round 46
            var f = (s1 & s2) | (s1 & s3) | (s2 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m45 + ROUND_CONSTANT_2;

            // Inline round 47
            var f = (s0 & s1) | (s0 & s2) | (s1 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m46 + ROUND_CONSTANT_2;

            // Inline round 48
            var f = (s4 & s0) | (s4 & s1) | (s0 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m47 + ROUND_CONSTANT_2;

            // Inline round 49
            var f = (s3 & s4) | (s3 & s0) | (s4 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m48 + ROUND_CONSTANT_2;

            // Inline round 50
            var f = (s2 & s3) | (s2 & s4) | (s3 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m49 + ROUND_CONSTANT_2;

            // Inline round 51
            var f = (s1 & s2) | (s1 & s3) | (s2 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m50 + ROUND_CONSTANT_2;

            // Inline round 52
            var f = (s0 & s1) | (s0 & s2) | (s1 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m51 + ROUND_CONSTANT_2;

            // Inline round 53
            var f = (s4 & s0) | (s4 & s1) | (s0 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m52 + ROUND_CONSTANT_2;

            // Inline round 54
            var f = (s3 & s4) | (s3 & s0) | (s4 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m53 + ROUND_CONSTANT_2;

            // Inline round 55
            var f = (s2 & s3) | (s2 & s4) | (s3 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m54 + ROUND_CONSTANT_2;

            // Inline round 56
            var f = (s1 & s2) | (s1 & s3) | (s2 & s3);
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m55 + ROUND_CONSTANT_2;

            // Inline round 57
            var f = (s0 & s1) | (s0 & s2) | (s1 & s2);
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m56 + ROUND_CONSTANT_2;

            // Inline round 58
            var f = (s4 & s0) | (s4 & s1) | (s0 & s1);
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m57 + ROUND_CONSTANT_2;

            // Inline round 59
            var f = (s3 & s4) | (s3 & s0) | (s4 & s0);
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m58 + ROUND_CONSTANT_2;

            // Inline round 60
            var f = (s2 & s3) | (s2 & s4) | (s3 & s4);
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m59 + ROUND_CONSTANT_2;

            // Inline round 61
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m60 + ROUND_CONSTANT_3;

            // Inline round 62
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m61 + ROUND_CONSTANT_3;

            // Inline round 63
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m62 + ROUND_CONSTANT_3;

            // Inline round 64
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m63 + ROUND_CONSTANT_3;

            // Inline round 65
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m64 + ROUND_CONSTANT_3;

            // Inline round 66
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m65 + ROUND_CONSTANT_3;

            // Inline round 67
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m66 + ROUND_CONSTANT_3;

            // Inline round 68
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m67 + ROUND_CONSTANT_3;

            // Inline round 69
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m68 + ROUND_CONSTANT_3;

            // Inline round 70
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m69 + ROUND_CONSTANT_3;

            // Inline round 71
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m70 + ROUND_CONSTANT_3;

            // Inline round 72
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m71 + ROUND_CONSTANT_3;

            // Inline round 73
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m72 + ROUND_CONSTANT_3;

            // Inline round 74
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m73 + ROUND_CONSTANT_3;

            // Inline round 75
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m74 + ROUND_CONSTANT_3;

            // Inline round 76
            var f = s1 ^ s2 ^ s3;
            s1 = (s1 << 30) | (s1 >>> 2);
            s4 = f + s4 + ((s0 << 5) | (s0 >>> 27)) + m75 + ROUND_CONSTANT_3;

            // Inline round 77
            var f = s0 ^ s1 ^ s2;
            s0 = (s0 << 30) | (s0 >>> 2);
            s3 = f + s3 + ((s4 << 5) | (s4 >>> 27)) + m76 + ROUND_CONSTANT_3;

            // Inline round 78
            var f = s4 ^ s0 ^ s1;
            s4 = (s4 << 30) | (s4 >>> 2);
            s2 = f + s2 + ((s3 << 5) | (s3 >>> 27)) + m77 + ROUND_CONSTANT_3;

            // Inline round 79
            var f = s3 ^ s4 ^ s0;
            s3 = (s3 << 30) | (s3 >>> 2);
            s1 = f + s1 + ((s2 << 5) | (s2 >>> 27)) + m78 + ROUND_CONSTANT_3;

            // Inline round 80
            var f = s2 ^ s3 ^ s4;
            s2 = (s2 << 30) | (s2 >>> 2);
            s0 = f + s0 + ((s1 << 5) | (s1 >>> 27)) + m79 + ROUND_CONSTANT_3;

            // Update state
            s[0] = (_s0 + s0) | 0;
            s[1] = (_s1 + s1) | 0;
            s[2] = (_s2 + s2) | 0;
            s[3] = (_s3 + s3) | 0;
            s[4] = (_s4 + s4) | 0;
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
