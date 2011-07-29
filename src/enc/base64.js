(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    var C_enc_Base64 = C_enc.Base64 = C_lib_WordArray.extend({
        doToString: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;
            var map = this.map;

            // Clear excess bits
            this.clamp();

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
            while (base64Str.length % 4) {
                base64Str.push(map.charAt(64));
            }

            return base64Str.join('');
        },

        fromString: function (base64Str) {
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

            return this.create(words, nBytes);
        },

        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    });
}());
