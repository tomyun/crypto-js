(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Cipher = C_lib.Cipher;
    var C_lib_Cipher_Stream = C_lib_Cipher.Stream;
    var C_algo = C.algo;

    /**
     * RC4 stream cipher algorithm.
     */
    var C_algo_RC4 = C_algo.RC4 = C_lib_Cipher_Stream.extend({
        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        _cfg: C_lib_Cipher_Stream._cfg.extend({
            drop: 192
        }),

        _doEncrypt: function (data, key, cfg) {
            // Shortcuts
            var dataWords = data.words;
            var dataWordsLength = data.sigBytes / 4;
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

            // Encrypt each word
            var i = 0, j = 0;
            for (var offset = -cfg.drop; offset < dataWordsLength; offset++) {
                // Accumulate 32-bits of keystream
                var keystream = 0;
                for (var n = 0; n < 4; n++) {
                    i = (i + 1) % 256;
                    j = (j + s[i]) % 256;

                    // Swap
                    var t = s[i];
                    s[i] = s[j];
                    s[j] = t;

                    keystream |= s[(s[i] + s[j]) % 256] << (24 - n * 8);
                }

                // Offset will be negative until we're done dropping keystream
                if (offset < 0) {
                    continue;
                }

                // Encrypt
                dataWords[offset] ^= keystream;
            }
        },

        _keySize: 256/32,

        _ivSize: 0
    });

    // Helper
    C.RC4 = C_lib_Cipher._createHelper(C_algo_RC4);
}());
