(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var C_enc_Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {CryptoJS.lib.WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         */
        toString: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this.map;

            // Clear excess bits
            wordArray.clamp();

            // Convert
            var base64Str = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[(i    ) >>> 2] >>> (24 - ((i    ) % 4) * 8)) & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 <= sigBytes); j++) {
                    base64Str.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Str.length % 4) {
                    base64Str.push(paddingChar);
                }
            }

            return base64Str.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {CryptoJS.lib.WordArray} The word array.
         *
         * @static
         */
        fromString: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this.map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingStartIndex = base64Str.indexOf(paddingChar);
                if (paddingStartIndex != -1) {
                    base64StrLength = paddingStartIndex;
                }
            }

            // Convert
            var words = [], nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4 != 0) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) <<  (    (i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i    )) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return C_lib_WordArray.create(words, nBytes);
        },

        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
}());
