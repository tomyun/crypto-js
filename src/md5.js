(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Constants
    var K = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];

    /**
     * MD5 hash algorithm.
     */
    var MD5 = C_algo.MD5 = Hasher.extend({
        _doReset: function () {
            // Shortcut
            var H = this._hash.words;

            // Initial values
            H[0] = 0x67452301;
            H[1] = 0xefcdab89;
            H[2] = 0x98badcfe;
            H[3] = 0x10325476;
        },

        _doProcessBlock: function (offset) {
            // Shortcuts
            var M = this._data.words;
            var H = this._hash.words;

            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];

                M[offset_i] = (
                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
                );
            }

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Computation
            for (var i = 0; i < 64; i += 4) {
                if (i < 16) {
                    a = FF(a, b, c, d, M[offset + i],     7,  K[i]);
                    d = FF(d, a, b, c, M[offset + i + 1], 12, K[i + 1]);
                    c = FF(c, d, a, b, M[offset + i + 2], 17, K[i + 2]);
                    b = FF(b, c, d, a, M[offset + i + 3], 22, K[i + 3]);
                } else if (i < 32) {
                    a = GG(a, b, c, d, M[offset + ((i + 1) % 16)],  5,  K[i]);
                    d = GG(d, a, b, c, M[offset + ((i + 6) % 16)],  9,  K[i + 1]);
                    c = GG(c, d, a, b, M[offset + ((i + 11) % 16)], 14, K[i + 2]);
                    b = GG(b, c, d, a, M[offset + (i % 16)],        20, K[i + 3]);
                } else if (i < 48) {
                    a = HH(a, b, c, d, M[offset + ((i * 3 + 5) % 16)],  4,  K[i]);
                    d = HH(d, a, b, c, M[offset + ((i * 3 + 8) % 16)],  11, K[i + 1]);
                    c = HH(c, d, a, b, M[offset + ((i * 3 + 11) % 16)], 16, K[i + 2]);
                    b = HH(b, c, d, a, M[offset + ((i * 3 + 14) % 16)], 23, K[i + 3]);
                } else /* if (i < 64) */ {
                    a = II(a, b, c, d, M[offset + ((i * 3) % 16)],      6,  K[i]);
                    d = II(d, a, b, c, M[offset + ((i * 3 + 7) % 16)],  10, K[i + 1]);
                    c = II(c, d, a, b, M[offset + ((i * 3 + 14) % 16)], 15, K[i + 2]);
                    b = II(b, c, d, a, M[offset + ((i * 3 + 5) % 16)],  21, K[i + 3]);
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
            var m = this._data;
            var M = m.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = m.sigBytes * 8;

            // Add padding
            M[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            M[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
            );
            m.sigBytes = (M.length + 1) * 4;

            // Hash final blocks
            this._processData();

            // Shortcut
            var H = this._hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                // Shortcut
                var H_i = H[i];

                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
            }
        }
    });

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
     * @example
     *
     *     var hmac = CryptoJS.HmacMD5(message, key);
     */
    C.HmacMD5 = Hasher._createHmacHelper(MD5);
}());
