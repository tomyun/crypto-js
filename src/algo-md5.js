(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Hash = C_lib.Hash;
    var C_algo = C.algo;

    var C_algo_MD5 = C_algo.MD5 = C_lib_Hash.extend({
        _doReset: function () {
            // Shortcut
            var H = this._hash.words;

            // Initial values
            H[0] = 0x67452301;
            H[1] = 0xefcdab89;
            H[2] = 0x98badcfe;
            H[3] = 0x10325476;
        },

        _doHashBlock: function (offset) {
            // Shortcuts
            var m = this._message.words;
            var H = this._hash.words;

            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var i_offset = i + offset;
                var m_i_offset = m[i_offset];

                m[i_offset] = (
                    (((m_i_offset <<  8) | (m_i_offset >>> 24)) & 0x00ff00ff) |
                    (((m_i_offset << 24) | (m_i_offset >>>  8)) & 0xff00ff00)
                );
            }

            // Shortcuts
            var m_0_offset  = m[0  + offset];
            var m_1_offset  = m[1  + offset];
            var m_2_offset  = m[2  + offset];
            var m_3_offset  = m[3  + offset];
            var m_4_offset  = m[4  + offset];
            var m_5_offset  = m[5  + offset];
            var m_6_offset  = m[6  + offset];
            var m_7_offset  = m[7  + offset];
            var m_8_offset  = m[8  + offset];
            var m_9_offset  = m[9  + offset];
            var m_10_offset = m[10 + offset];
            var m_11_offset = m[11 + offset];
            var m_12_offset = m[12 + offset];
            var m_13_offset = m[13 + offset];
            var m_14_offset = m[14 + offset];
            var m_15_offset = m[15 + offset];

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            a = FF(a, b, c, d, m_0_offset,   7, 0xd76aa478);
            d = FF(d, a, b, c, m_1_offset,  12, 0xe8c7b756);
            c = FF(c, d, a, b, m_2_offset,  17, 0x242070db);
            b = FF(b, c, d, a, m_3_offset,  22, 0xc1bdceee);
            a = FF(a, b, c, d, m_4_offset,   7, 0xf57c0faf);
            d = FF(d, a, b, c, m_5_offset,  12, 0x4787c62a);
            c = FF(c, d, a, b, m_6_offset,  17, 0xa8304613);
            b = FF(b, c, d, a, m_7_offset,  22, 0xfd469501);
            a = FF(a, b, c, d, m_8_offset,   7, 0x698098d8);
            d = FF(d, a, b, c, m_9_offset,  12, 0x8b44f7af);
            c = FF(c, d, a, b, m_10_offset, 17, 0xffff5bb1);
            b = FF(b, c, d, a, m_11_offset, 22, 0x895cd7be);
            a = FF(a, b, c, d, m_12_offset,  7, 0x6b901122);
            d = FF(d, a, b, c, m_13_offset, 12, 0xfd987193);
            c = FF(c, d, a, b, m_14_offset, 17, 0xa679438e);
            b = FF(b, c, d, a, m_15_offset, 22, 0x49b40821);

            a = GG(a, b, c, d, m_1_offset,   5, 0xf61e2562);
            d = GG(d, a, b, c, m_6_offset,   9, 0xc040b340);
            c = GG(c, d, a, b, m_11_offset, 14, 0x265e5a51);
            b = GG(b, c, d, a, m_0_offset,  20, 0xe9b6c7aa);
            a = GG(a, b, c, d, m_5_offset,   5, 0xd62f105d);
            d = GG(d, a, b, c, m_10_offset,  9, 0x02441453);
            c = GG(c, d, a, b, m_15_offset, 14, 0xd8a1e681);
            b = GG(b, c, d, a, m_4_offset,  20, 0xe7d3fbc8);
            a = GG(a, b, c, d, m_9_offset,   5, 0x21e1cde6);
            d = GG(d, a, b, c, m_14_offset,  9, 0xc33707d6);
            c = GG(c, d, a, b, m_3_offset,  14, 0xf4d50d87);
            b = GG(b, c, d, a, m_8_offset,  20, 0x455a14ed);
            a = GG(a, b, c, d, m_13_offset,  5, 0xa9e3e905);
            d = GG(d, a, b, c, m_2_offset,   9, 0xfcefa3f8);
            c = GG(c, d, a, b, m_7_offset,  14, 0x676f02d9);
            b = GG(b, c, d, a, m_12_offset, 20, 0x8d2a4c8a);

            a = HH(a, b, c, d, m_5_offset,   4, 0xfffa3942);
            d = HH(d, a, b, c, m_8_offset,  11, 0x8771f681);
            c = HH(c, d, a, b, m_11_offset, 16, 0x6d9d6122);
            b = HH(b, c, d, a, m_14_offset, 23, 0xfde5380c);
            a = HH(a, b, c, d, m_1_offset,   4, 0xa4beea44);
            d = HH(d, a, b, c, m_4_offset,  11, 0x4bdecfa9);
            c = HH(c, d, a, b, m_7_offset,  16, 0xf6bb4b60);
            b = HH(b, c, d, a, m_10_offset, 23, 0xbebfbc70);
            a = HH(a, b, c, d, m_13_offset,  4, 0x289b7ec6);
            d = HH(d, a, b, c, m_0_offset,  11, 0xeaa127fa);
            c = HH(c, d, a, b, m_3_offset,  16, 0xd4ef3085);
            b = HH(b, c, d, a, m_6_offset,  23, 0x04881d05);
            a = HH(a, b, c, d, m_9_offset,   4, 0xd9d4d039);
            d = HH(d, a, b, c, m_12_offset, 11, 0xe6db99e5);
            c = HH(c, d, a, b, m_15_offset, 16, 0x1fa27cf8);
            b = HH(b, c, d, a, m_2_offset,  23, 0xc4ac5665);

            a = II(a, b, c, d, m_0_offset,   6, 0xf4292244);
            d = II(d, a, b, c, m_7_offset,  10, 0x432aff97);
            c = II(c, d, a, b, m_14_offset, 15, 0xab9423a7);
            b = II(b, c, d, a, m_5_offset,  21, 0xfc93a039);
            a = II(a, b, c, d, m_12_offset,  6, 0x655b59c3);
            d = II(d, a, b, c, m_3_offset,  10, 0x8f0ccc92);
            c = II(c, d, a, b, m_10_offset, 15, 0xffeff47d);
            b = II(b, c, d, a, m_1_offset,  21, 0x85845dd1);
            a = II(a, b, c, d, m_8_offset,   6, 0x6fa87e4f);
            d = II(d, a, b, c, m_15_offset, 10, 0xfe2ce6e0);
            c = II(c, d, a, b, m_6_offset,  15, 0xa3014314);
            b = II(b, c, d, a, m_13_offset, 21, 0x4e0811a1);
            a = II(a, b, c, d, m_4_offset,   6, 0xf7537e82);
            d = II(d, a, b, c, m_11_offset, 10, 0xbd3af235);
            c = II(c, d, a, b, m_2_offset,  15, 0x2ad7d2bb);
            b = II(b, c, d, a, m_9_offset,  21, 0xeb86d391);

            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
        },

        _doCompute: function () {
            // Shortcuts
            var message = this._message;
            var messageWords = message.words;

            var nBitsTotal = this._length * 8;
            var nBitsLeft = message.sigBytes * 8;

            // Add padding
            messageWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            messageWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotal <<  8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
                (((nBitsTotal << 24) | (nBitsTotal >>>  8)) & 0xff00ff00)
            );
            message.sigBytes = (messageWords.length + 1) * 4;

            // Hash final blocks
            this._hashBlocks();

            // Shortcut
            var H = this._hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                // Shortcut
                var H_i = H[i];

                H[i] = (((H_i <<  8) | (H_i >>> 24)) & 0x00ff00ff) |
                       (((H_i << 24) | (H_i >>>  8)) & 0xff00ff00);
            }
        }
    });

    function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    /**
     * MD5 helper.
     */
    C.MD5 = function (message) {
        return C_algo_MD5.create().compute(message);
    };
}());
