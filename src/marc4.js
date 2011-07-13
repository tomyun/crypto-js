(function (C) {
    var ARC4 = C.ARC4 = C.lib.Cipher.extend({
        doEncrypt: function () {
            // Shortcuts
            var m = this.message.words;
            var key = this.key;
            var k = key.words
            var keySigBytes = key.sigBytes;

            // Sbox
            var s = [];
            for (var i = 0; i < 256; i++) {
                s[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
                var kByteIndex = i % keySigBytes;
                var kByte = (k[kByteIndex >>> 2] >>> (24 - (kByteIndex % 4) * 8)) & 0xff;

                j = (j + s[i] + kByte) % 256;

                // Swap
                var t = s[i];
                s[i] = s[j];
                s[j] = t;
            }

            // Encryption
            var i = 0, j = 0;

            var mLength = m.length;
            for (var n = -this.drop; n < mLength; n++) {
                // Accumulate 32 bits of keystream
                var keystream = 0;
                for (var q = 0; q < 4; q++) {
                    i = (i + 1) % 256;
                    j = (j + s[i]) % 256;

                    // Swap
                    var t = s[i];
                    s[i] = s[j];
                    s[j] = t;

                    keystream |= s[(s[i] + s[j]) % 256] << (24 - q * 8);
                }

                // n will be negative when we're dropping keystream
                if (n >= 0) {
                    // Encrypt
                    m[n] ^= keystream;
                }
            }
        },

        drop: 0,
        keySize: 8
    });

    var MARC4 = C.MARC4 = ARC4.extend({
        drop: 384
    });
}(CryptoJS));
