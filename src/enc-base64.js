(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var C_ENC = C.enc;

    /**
     * Base64 encoding strategy.
     */
    C_ENC.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64Str = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j - 1 < sigBytes); j++) {
                    var base64Value = (triplet >>> (6 * (3 - j))) & 0x3f;
                    base64Chars.push(map.charAt(base64Value));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64Str);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

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
            for (var i = 0; i < base64StrLength; i += 4) {
                var base64Value1 = map.indexOf(base64Str.charAt(i));
                var base64Value2 = map.indexOf(base64Str.charAt(i + 1));
                var base64Value3 = map.indexOf(base64Str.charAt(i + 2));
                var base64Value4 = map.indexOf(base64Str.charAt(i + 3));

                // <?php if ($debug): ?>
                if (base64Value1 == -1 || base64Value2 == -1 || base64Value3 == -1 || base64Value4 == -1) {
                    throw Base64CharacterOutsideAlphabetError;
                }
                // <?php endif ?>

                var triplet = (base64Value1 << 18) | (base64Value2 << 12) | (base64Value3 << 6) | base64Value4;

                for (var j = 0; (j < 3) && (i + j + 1 < base64StrLength); j++) {
                    var bite = (triplet >>> (16 - j * 8)) & 0xff;
                    words[nBytes >>> 2] |= bite << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };

    // <?php if ($debug): ?>
    // Shortcuts
    var C_ERR = C.err;
    var Error = C_ERR.Error;

    var Base64CharacterOutsideAlphabetError = C_ERR.Base64CharacterOutsideAlphabetError = Error.extend({
        _message: 'Characters outside the Base64 alphabet are forbidden.'
    });
    // <?php endif ?>
}());
