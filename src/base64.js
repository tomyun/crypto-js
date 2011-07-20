(function (C) {
    // Shortcuts
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;

    var Base64 = C.enc.Base64 = C_lib.BaseObj.extend({
        encode: function (wordArray) {
            // Clear excess bits
            wordArray.clamp();

            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this.map;

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
            this.pad(base64Str);

            return base64Str.join('');
        },

        pad: function (base64Str) {
            while (base64Str.length % 4) {
                base64Str.push(this.map.charAt(64));
            }
        },

        decode: function (base64Str) {
            // Shortcut
            var map = this.map;

            // Ignore padding
            var paddingStartIndex = base64Str.indexOf(map.charAt(64));
            if (paddingStartIndex != -1) {
                var base64StrLength = paddingStartIndex;
            } else {
                var base64StrLength = base64Str.length;
            }

            var words = [], nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) <<  (    (i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i    )) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray_Base64.create(words, nBytes);
        },

        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    });

    var Base64_UrlSafe = Base64.UrlSafe = Base64.extend({
        // Skip padding
        pad: function () {
            // Do nothing
        },

        decode: function () {
            // "Cast" as WordArray.Base64.UrlSafe
            return WordArray_Base64_UrlSafe.extend(
                Base64_UrlSafe.$super.decode.apply(this, arguments)
            );
        },

        // URL-safe alphabet
        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
    });

    // WordArray.Base64
    var WordArray_Base64 = WordArray.Base64 = WordArray.extend({
        encoder: Base64
    });

    // WordArray.Base64.UrlSafe
    var WordArray_Base64_UrlSafe = WordArray_Base64.UrlSafe = WordArray.extend({
        encoder: Base64_UrlSafe
    });
}(CryptoJS));
