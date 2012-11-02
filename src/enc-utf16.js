(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var C_ENC = C.enc;

    /**
     * UTF-16 BE encoding strategy.
     */
    C_ENC.Utf16 = C_ENC.Utf16BE = {
        /**
         * Converts a word array of UTF-16 BE bytes to a string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 BE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16Str = CryptoJS.enc.Utf16BE.stringify(wordArray);
         *     var utf16Str = CryptoJS.enc.Utf16.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
                utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
        },

        /**
         * Converts a string to a word array of UTF-16 BE bytes.
         *
         * @param {string} utf16Str The UTF-16 BE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf16BE.parse(utf16Str);
         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16Str);
         */
        parse: function (utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
            }

            return WordArray.create(words, utf16StrLength * 2);
        }
    };

    /**
     * UTF-16 LE encoding strategy.
     */
    C_ENC.Utf16LE = {
        /**
         * Converts a word array of UTF-16 LE bytes to a string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-16 LE string.
         *
         * @static
         *
         * @example
         *
         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;

                // Swap endian
                codePoint = ((codePoint << 8) & 0xff00) | ((codePoint >>> 8) & 0x00ff);

                utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
        },

        /**
         * Converts a string to a word array of UTF-16 LE bytes.
         *
         * @param {string} utf16Str The UTF-16 LE string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
         */
        parse: function (utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
                var codePoint = utf16Str.charCodeAt(i);

                // Swap endian
                codePoint = ((codePoint << 8) & 0xff00) | ((codePoint >>> 8) & 0x00ff);

                words[i >>> 1] |= codePoint << (16 - (i % 2) * 16);
            }

            return WordArray.create(words, utf16StrLength * 2);
        }
    };
}());
