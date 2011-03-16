(function (C) {
    var Base64 = C.enc.Base64 = C.oop.BaseObj.extend({
        encode: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this.map;

            // Clear excess bits
            wordArray.clamp();

            var base64Str = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var bite1 = (words[(i    ) >>> 2] >>> (24 - ((i    ) % 4) * 8)) & 0xff;
                var bite2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var bite3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (bite1 << 16) | (bite2 << 8) | bite3;

                for (var j = 0; (j < 4) && (i + j * 0.75 <= sigBytes); j++) {
                    base64Str.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            this.addPadding(base64Str);

            return base64Str.join('');
        },

        addPadding: function (base64Str) {
            // Shortcuts
            var map = this.map;

            while (base64Str.length % 4) {
                base64Str.push(map.charAt(64));
            }
        },

        decode: function (base64Str) {
            // Shortcuts
            var map = this.map;

            // Ignore padding
            var paddingStartPosition = base64Str.indexOf(map.charAt(64));
            if (paddingStartPosition != -1) {
                var base64StrLength = paddingStartPosition;
            } else {
                var base64StrLength = base64Str.length;
            }

            var words = [];
            var bites = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) <<  (    (i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i    )) >>> (6 - (i % 4) * 2);

                    words[bites >>> 2] |= (bits1 | bits2) << (24 - (bites % 4) * 8);
                    bites++;
                }
            }

            return C.lib.WordArray.create(words, bites);
        },

        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    });

    var Base64UrlSafe = Base64.UrlSafe = Base64.extend({
        // URL-safe alphabet
        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',

        // Skip padding
        addPadding: function () {
            // Do nothing
        }
    });
}(CryptoJS));
