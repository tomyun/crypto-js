(function (C, undefined) {
    // Core shortcuts
    var C_lib = C.lib;
    var BaseObj = C_lib.BaseObj;
    var WordArray = C_lib.WordArray;
    var WordArray_Hex = WordArray.Hex;
    var WordArray_Latin1 = WordArray.Latin1;
    var WordArray_Utf8 = WordArray.Utf8;
    var Event = C_lib.Event;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;

    // Cipher base shortcuts
    var C_cipher = C.cipher;
    var Formatter = C_cipher.Formatter;
    var Base = C_cipher.Base;

    var ARC4 = C.ARC4 = Base.extend({
        doEncrypt: function (message, key) {
            // Shortcuts
            var m = message.words;
            var mLength = m.length;
            var k = key.words
            var keySigBytes = key.sigBytes;

            // Sbox
            var s = [];
            for (var i = 0; i < 256; i++) {
                s[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = (k[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

                j = (j + s[i] + keyByte) % 256;

                // Swap
                var t = s[i];
                s[i] = s[j];
                s[j] = t;
            }

            // Encryption
            var i = 0, j = 0;
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

                // n will be negative until we're done dropping keystream
                if (n >= 0) {
                    // Encrypt
                    m[n] ^= keystream;
                }
            }
        },

        drop: 0,

        keySize: 8,
        ivSize: 0
    });

    var MARC4 = C.MARC4 = ARC4.extend({
        drop: 384
    });
}(CryptoJS));
