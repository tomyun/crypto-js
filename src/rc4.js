(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Cipher = C_lib.Cipher;
    var C_lib_Cipher_Stream = C_lib_Cipher.Stream;

    /**
     * @property {number} keySize RC4's key size. Default 8
     * @property {number} ivSize RC4's IV size. Default 0
     */
    C.RC4 = C_lib_Cipher_Stream.extend({
        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        _cfg: C_lib_Cipher_Stream._cfg.extend({
            drop: 192
        }),

        _doEncrypt: function () {
            // Shortcuts
            var cfg = this._cfg;
            var dataWords = this._data.words;
            var dataWordsLength = dataWords.length;
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes;

            // Sbox
            var s = [];
            for (var i = 0; i < 256; i++) {
                s[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

                j = (j + s[i] + keyByte) % 256;

                // Swap
                var t = s[i];
                s[i] = s[j];
                s[j] = t;
            }

            // Encrypt
            var i = 0, j = 0;
            for (var n = -cfg.drop; n < dataWordsLength; n++) {
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

                // "n" will be negative until we're done dropping keystream
                if (n >= 0) {
                    // Encrypt
                    dataWords[n] ^= keystream;
                }
            }
        },

        keySize: 8,

        ivSize: 0
    });
}());
