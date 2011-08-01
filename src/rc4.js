(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_cipher = C.cipher;
    var C_cipher_Base = C_cipher.Base;

    var C_RC4 = C.RC4 = C_cipher_Base.extend({
        cfg: C_cipher_Base.cfg.extend({
            drop: 384
        }),

        doEncrypt: function () {
            // Shortcuts
            var m = this.data.words;
            var mLength = m.length;
            var key = this.key;
            var k = key.words;
            var kSigBytes = key.sigBytes;

            // Sbox
            var s = [];
            for (var i = 0; i < 256; i++) {
                s[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
                var kByteIndex = i % kSigBytes;
                var kByte = (k[kByteIndex >>> 2] >>> (24 - (kByteIndex % 4) * 8)) & 0xff;

                j = (j + s[i] + kByte) % 256;

                // Swap
                var t = s[i];
                s[i] = s[j];
                s[j] = t;
            }

            // Encryption
            var i = 0, j = 0;
            for (var n = - this.cfg.drop; n < mLength; n++) {
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

                // n will be negative until we're done dropping keystream
                if (n >= 0) {
                    // Encrypt
                    m[n] ^= keystream;
                }
            }
        },

        ivSize: null
    });

    C_RC4.doDecrypt = C_RC4.doEncrypt;
}());
