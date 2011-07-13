(function (C) {
    var MD5 = C.MD5 = C.lib.Hasher.extend({
        doReset: function () {
            // Shortcut
            var H = this.hash.words;

            // Initial values
            H[0] = 0x67452301;
            H[1] = 0xefcdab89;
            H[2] = 0x98badcfe;
            H[3] = 0x10325476;
        },

        doHashBlock: function (offset) {
            // Shortcuts
            var m = this.message.words;
            var H = this.hash.words;

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Swap endian
            for (var i = 0; i < 16; i++) {
                var k = i + offset;
                m[k] = (((m[k] <<  8) | (m[k] >>> 24)) & 0x00ff00ff) |
                       (((m[k] << 24) | (m[k] >>>  8)) & 0xff00ff00);
            }

            a = FF(a, b, c, d, m[0  + offset],  7, 0xd76aa478);
            d = FF(d, a, b, c, m[1  + offset], 12, 0xe8c7b756);
            c = FF(c, d, a, b, m[2  + offset], 17, 0x242070db);
            b = FF(b, c, d, a, m[3  + offset], 22, 0xc1bdceee);
            a = FF(a, b, c, d, m[4  + offset],  7, 0xf57c0faf);
            d = FF(d, a, b, c, m[5  + offset], 12, 0x4787c62a);
            c = FF(c, d, a, b, m[6  + offset], 17, 0xa8304613);
            b = FF(b, c, d, a, m[7  + offset], 22, 0xfd469501);
            a = FF(a, b, c, d, m[8  + offset],  7, 0x698098d8);
            d = FF(d, a, b, c, m[9  + offset], 12, 0x8b44f7af);
            c = FF(c, d, a, b, m[10 + offset], 17, 0xffff5bb1);
            b = FF(b, c, d, a, m[11 + offset], 22, 0x895cd7be);
            a = FF(a, b, c, d, m[12 + offset],  7, 0x6b901122);
            d = FF(d, a, b, c, m[13 + offset], 12, 0xfd987193);
            c = FF(c, d, a, b, m[14 + offset], 17, 0xa679438e);
            b = FF(b, c, d, a, m[15 + offset], 22, 0x49b40821);

            a = GG(a, b, c, d, m[1  + offset],  5, 0xf61e2562);
            d = GG(d, a, b, c, m[6  + offset],  9, 0xc040b340);
            c = GG(c, d, a, b, m[11 + offset], 14, 0x265e5a51);
            b = GG(b, c, d, a, m[0  + offset], 20, 0xe9b6c7aa);
            a = GG(a, b, c, d, m[5  + offset],  5, 0xd62f105d);
            d = GG(d, a, b, c, m[10 + offset],  9, 0x02441453);
            c = GG(c, d, a, b, m[15 + offset], 14, 0xd8a1e681);
            b = GG(b, c, d, a, m[4  + offset], 20, 0xe7d3fbc8);
            a = GG(a, b, c, d, m[9  + offset],  5, 0x21e1cde6);
            d = GG(d, a, b, c, m[14 + offset],  9, 0xc33707d6);
            c = GG(c, d, a, b, m[3  + offset], 14, 0xf4d50d87);
            b = GG(b, c, d, a, m[8  + offset], 20, 0x455a14ed);
            a = GG(a, b, c, d, m[13 + offset],  5, 0xa9e3e905);
            d = GG(d, a, b, c, m[2  + offset],  9, 0xfcefa3f8);
            c = GG(c, d, a, b, m[7  + offset], 14, 0x676f02d9);
            b = GG(b, c, d, a, m[12 + offset], 20, 0x8d2a4c8a);

            a = HH(a, b, c, d, m[5  + offset],  4, 0xfffa3942);
            d = HH(d, a, b, c, m[8  + offset], 11, 0x8771f681);
            c = HH(c, d, a, b, m[11 + offset], 16, 0x6d9d6122);
            b = HH(b, c, d, a, m[14 + offset], 23, 0xfde5380c);
            a = HH(a, b, c, d, m[1  + offset],  4, 0xa4beea44);
            d = HH(d, a, b, c, m[4  + offset], 11, 0x4bdecfa9);
            c = HH(c, d, a, b, m[7  + offset], 16, 0xf6bb4b60);
            b = HH(b, c, d, a, m[10 + offset], 23, 0xbebfbc70);
            a = HH(a, b, c, d, m[13 + offset],  4, 0x289b7ec6);
            d = HH(d, a, b, c, m[0  + offset], 11, 0xeaa127fa);
            c = HH(c, d, a, b, m[3  + offset], 16, 0xd4ef3085);
            b = HH(b, c, d, a, m[6  + offset], 23, 0x04881d05);
            a = HH(a, b, c, d, m[9  + offset],  4, 0xd9d4d039);
            d = HH(d, a, b, c, m[12 + offset], 11, 0xe6db99e5);
            c = HH(c, d, a, b, m[15 + offset], 16, 0x1fa27cf8);
            b = HH(b, c, d, a, m[2  + offset], 23, 0xc4ac5665);

            a = II(a, b, c, d, m[0  + offset],  6, 0xf4292244);
            d = II(d, a, b, c, m[7  + offset], 10, 0x432aff97);
            c = II(c, d, a, b, m[14 + offset], 15, 0xab9423a7);
            b = II(b, c, d, a, m[5  + offset], 21, 0xfc93a039);
            a = II(a, b, c, d, m[12 + offset],  6, 0x655b59c3);
            d = II(d, a, b, c, m[3  + offset], 10, 0x8f0ccc92);
            c = II(c, d, a, b, m[10 + offset], 15, 0xffeff47d);
            b = II(b, c, d, a, m[1  + offset], 21, 0x85845dd1);
            a = II(a, b, c, d, m[8  + offset],  6, 0x6fa87e4f);
            d = II(d, a, b, c, m[15 + offset], 10, 0xfe2ce6e0);
            c = II(c, d, a, b, m[6  + offset], 15, 0xa3014314);
            b = II(b, c, d, a, m[13 + offset], 21, 0x4e0811a1);
            a = II(a, b, c, d, m[4  + offset],  6, 0xf7537e82);
            d = II(d, a, b, c, m[11 + offset], 10, 0xbd3af235);
            c = II(c, d, a, b, m[2  + offset], 15, 0x2ad7d2bb);
            b = II(b, c, d, a, m[9  + offset], 21, 0xeb86d391);

            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
        },

        doCompute: function () {
            // Shortcuts
            var message = this.message;
            var m = message.words;

            var nBitsTotal = this.length * 8;
            var nBitsLeft = message.sigBytes * 8;

            // Add padding
            m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotal <<  8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
                (((nBitsTotal << 24) | (nBitsTotal >>>  8)) & 0xff00ff00)
            );
            message.sigBytes = (m.length + 1) * 4;

            // Hash final blocks
            this.hashBlocks();

            // Shortcut
            var H = this.hash.words;

            // Swap endian
            H[0] = (((H[0] <<  8) | (H[0] >>> 24)) & 0x00ff00ff) |
                   (((H[0] << 24) | (H[0] >>>  8)) & 0xff00ff00);
            H[1] = (((H[1] <<  8) | (H[1] >>> 24)) & 0x00ff00ff) |
                   (((H[1] << 24) | (H[1] >>>  8)) & 0xff00ff00);
            H[2] = (((H[2] <<  8) | (H[2] >>> 24)) & 0x00ff00ff) |
                   (((H[2] << 24) | (H[2] >>>  8)) & 0xff00ff00);
            H[3] = (((H[3] <<  8) | (H[3] >>> 24)) & 0x00ff00ff) |
                   (((H[3] << 24) | (H[3] >>>  8)) & 0xff00ff00);
        }
    });

    // Auxiliary functions
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
}(CryptoJS));
