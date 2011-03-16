(function (C) {
    var SHA1 = C.SHA1 = C.lib.Hasher.extend({
        _doReset: function () {
            // Shortcuts
            var H = this._hash.words;

            // Initial values
            H[0] = 0x67452301;
            H[1] = 0xEFCDAB89;
            H[2] = 0x98BADCFE;
            H[3] = 0x10325476;
            H[4] = 0xC3D2E1F0;
        },

        _hashBlock: function (offset) {
            // Shortcuts
            var m = this._message.words;
            var H = this._hash.words;

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];

            var w = [];

            for (var i = 0; i < 80; i++) {
                if (i < 16) {
                    w[i] = m[i + offset];
                } else {
                    var n = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
                    w[i] = (n << 1) | (n >>> 31);
                }

                var t = ((a << 5) | (a >>> 27)) + e + (w[i] >>> 0);
                if      (i < 20) t += ((b & c) | (~b & d)) + 0x5A827999;
                else if (i < 40) t += (b ^ c ^ d) + 0x6ED9EBA1;
                else if (i < 60) t += ((b & c) | (b & d) | (c & d)) - 0x70E44324;
                else             t += (b ^ c ^ d) - 0x359D3E2A;

                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = t;
            }

            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var message = this._message;
            var m = message.words;

            var nBitsTotal = this._length * 8;
            var nBitsLeft = message.getSigBytes() * 8;

            // Add padding
            m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            m[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            message.setSigBytes(m.length * 4);

            // Hash final blocks
            this._hashBlocks();
        }
    });

    // Static block size
    SHA1.blockSize = 16;
})(CryptoJS);
