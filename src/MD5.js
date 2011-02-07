(function (C) {
    var MD5 = C.MD5 = C.lib.Hasher.extend({
        _doReset: function () {
            // Shortcuts
            var H = this._hash.words;

            // Initial values
            H[0] = 0x67452301;
            H[1] = 0xEFCDAB89;
            H[2] = 0x98BADCFE;
            H[3] = 0x10325476;
        },

        _hashBlock: function (offset) {
            // Shortcuts
            var m = this._message.words;
            var H = this._hash.words;

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Swap endian
            for (var i = 0; i < 16; i++) {
                var k = i + offset;
                m[k] = (((m[k] <<  8) | (m[k] >>> 24)) & 0x00FF00FF) |
                       (((m[k] << 24) | (m[k] >>>  8)) & 0xFF00FF00);
            }

            a = FF(a, b, c, d, m[0  + offset],  7, 0xD76AA478);
            d = FF(d, a, b, c, m[1  + offset], 12, 0xE8C7B756);
            c = FF(c, d, a, b, m[2  + offset], 17, 0x242070DB);
            b = FF(b, c, d, a, m[3  + offset], 22, 0xC1BDCEEE);
            a = FF(a, b, c, d, m[4  + offset],  7, 0xF57C0FAF);
            d = FF(d, a, b, c, m[5  + offset], 12, 0x4787C62A);
            c = FF(c, d, a, b, m[6  + offset], 17, 0xA8304613);
            b = FF(b, c, d, a, m[7  + offset], 22, 0xFD469501);
            a = FF(a, b, c, d, m[8  + offset],  7, 0x698098D8);
            d = FF(d, a, b, c, m[9  + offset], 12, 0x8B44F7AF);
            c = FF(c, d, a, b, m[10 + offset], 17, 0xFFFF5BB1);
            b = FF(b, c, d, a, m[11 + offset], 22, 0x895CD7BE);
            a = FF(a, b, c, d, m[12 + offset],  7, 0x6B901122);
            d = FF(d, a, b, c, m[13 + offset], 12, 0xFD987193);
            c = FF(c, d, a, b, m[14 + offset], 17, 0xA679438E);
            b = FF(b, c, d, a, m[15 + offset], 22, 0x49B40821);

            a = GG(a, b, c, d, m[1  + offset],  5, 0xF61E2562);
            d = GG(d, a, b, c, m[6  + offset],  9, 0xC040B340);
            c = GG(c, d, a, b, m[11 + offset], 14, 0x265E5A51);
            b = GG(b, c, d, a, m[0  + offset], 20, 0xE9B6C7AA);
            a = GG(a, b, c, d, m[5  + offset],  5, 0xD62F105D);
            d = GG(d, a, b, c, m[10 + offset],  9, 0x02441453);
            c = GG(c, d, a, b, m[15 + offset], 14, 0xD8A1E681);
            b = GG(b, c, d, a, m[4  + offset], 20, 0xE7D3FBC8);
            a = GG(a, b, c, d, m[9  + offset],  5, 0x21E1CDE6);
            d = GG(d, a, b, c, m[14 + offset],  9, 0xC33707D6);
            c = GG(c, d, a, b, m[3  + offset], 14, 0xF4D50D87);
            b = GG(b, c, d, a, m[8  + offset], 20, 0x455A14ED);
            a = GG(a, b, c, d, m[13 + offset],  5, 0xA9E3E905);
            d = GG(d, a, b, c, m[2  + offset],  9, 0xFCEFA3F8);
            c = GG(c, d, a, b, m[7  + offset], 14, 0x676F02D9);
            b = GG(b, c, d, a, m[12 + offset], 20, 0x8D2A4C8A);

            a = HH(a, b, c, d, m[5  + offset],  4, 0xFFFA3942);
            d = HH(d, a, b, c, m[8  + offset], 11, 0x8771F681);
            c = HH(c, d, a, b, m[11 + offset], 16, 0x6D9D6122);
            b = HH(b, c, d, a, m[14 + offset], 23, 0xFDE5380C);
            a = HH(a, b, c, d, m[1  + offset],  4, 0xA4BEEA44);
            d = HH(d, a, b, c, m[4  + offset], 11, 0x4BDECFA9);
            c = HH(c, d, a, b, m[7  + offset], 16, 0xF6BB4B60);
            b = HH(b, c, d, a, m[10 + offset], 23, 0xBEBFBC70);
            a = HH(a, b, c, d, m[13 + offset],  4, 0x289B7EC6);
            d = HH(d, a, b, c, m[0  + offset], 11, 0xEAA127FA);
            c = HH(c, d, a, b, m[3  + offset], 16, 0xD4EF3085);
            b = HH(b, c, d, a, m[6  + offset], 23, 0x04881D05);
            a = HH(a, b, c, d, m[9  + offset],  4, 0xD9D4D039);
            d = HH(d, a, b, c, m[12 + offset], 11, 0xE6DB99E5);
            c = HH(c, d, a, b, m[15 + offset], 16, 0x1FA27CF8);
            b = HH(b, c, d, a, m[2  + offset], 23, 0xC4AC5665);

            a = II(a, b, c, d, m[0  + offset],  6, 0xF4292244);
            d = II(d, a, b, c, m[7  + offset], 10, 0x432AFF97);
            c = II(c, d, a, b, m[14 + offset], 15, 0xAB9423A7);
            b = II(b, c, d, a, m[5  + offset], 21, 0xFC93A039);
            a = II(a, b, c, d, m[12 + offset],  6, 0x655B59C3);
            d = II(d, a, b, c, m[3  + offset], 10, 0x8F0CCC92);
            c = II(c, d, a, b, m[10 + offset], 15, 0xFFEFF47D);
            b = II(b, c, d, a, m[1  + offset], 21, 0x85845DD1);
            a = II(a, b, c, d, m[8  + offset],  6, 0x6FA87E4F);
            d = II(d, a, b, c, m[15 + offset], 10, 0xFE2CE6E0);
            c = II(c, d, a, b, m[6  + offset], 15, 0xA3014314);
            b = II(b, c, d, a, m[13 + offset], 21, 0x4E0811A1);
            a = II(a, b, c, d, m[4  + offset],  6, 0xF7537E82);
            d = II(d, a, b, c, m[11 + offset], 10, 0xBD3AF235);
            c = II(c, d, a, b, m[2  + offset], 15, 0x2AD7D2BB);
            b = II(b, c, d, a, m[9  + offset], 21, 0xEB86D391);

            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var message = this._message;
            var m = message.words;
            var H = this._hash.words;

            var nBitsTotal = this._length * 8;
            var nBitsLeft = message.getSigBytes() * 8;

            // Add padding
            m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotal <<  8) | (nBitsTotal >>> 24)) & 0x00FF00FF) |
                (((nBitsTotal << 24) | (nBitsTotal >>>  8)) & 0xFF00FF00)
            );
            message.setSigBytes((m.length + 1) * 4);

            // Hash final blocks
            this._hashBlocks();

            // Swap endian
            H[0] = (((H[0] <<  8) | (H[0] >>> 24)) & 0x00FF00FF) |
                   (((H[0] << 24) | (H[0] >>>  8)) & 0xFF00FF00);
            H[1] = (((H[1] <<  8) | (H[1] >>> 24)) & 0x00FF00FF) |
                   (((H[1] << 24) | (H[1] >>>  8)) & 0xFF00FF00);
            H[2] = (((H[2] <<  8) | (H[2] >>> 24)) & 0x00FF00FF) |
                   (((H[2] << 24) | (H[2] >>>  8)) & 0xFF00FF00);
            H[3] = (((H[3] <<  8) | (H[3] >>> 24)) & 0x00FF00FF) |
                   (((H[3] << 24) | (H[3] >>>  8)) & 0xFF00FF00);
        }
    });

    // Static block size
    MD5.blockSize = 16;

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
})(CryptoJS);
