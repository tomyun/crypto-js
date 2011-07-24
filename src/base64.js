(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var WordArrayHex = WordArray.Hex;
    var WordArrayLatin1 = WordArray.Latin1;
    var WordArrayUtf8 = WordArray.Utf8;
    var Event = C_lib.Event;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;

    var Base64 = C_enc.Base64 = Base.extend({
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

            return WordArrayBase64.create(words, nBytes);
        },

        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    });

    var Base64UrlSafe = Base64.UrlSafe = Base64.extend({
        // Skip padding
        pad: function () {
            // Do nothing
        },

        decode: function () {
            var wordArray = Base64UrlSafe.$super.decode.apply(this, arguments);

            // "Cast" as WordArray.Base64.UrlSafe
            return WordArrayBase64UrlSafe.extend(wordArray);
        },

        // URL-safe alphabet
        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_='
    });

    // WordArray.Base64
    var WordArrayBase64 = WordArray.Base64 = WordArray.extend({
        encoder: Base64
    });

    // WordArray.Base64.UrlSafe
    var WordArrayBase64UrlSafe = WordArrayBase64.UrlSafe = WordArray.extend({
        encoder: Base64UrlSafe
    });
}(CryptoJS));
