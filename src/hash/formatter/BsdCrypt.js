(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var WordArrayHex = WordArray.Hex;
    var WordArrayLatin1 = WordArray.Latin1;
    var WordArrayUtf8 = WordArray.Utf8;
    var WordArrayBase64 = WordArray.Base64;
    var WordArrayBase64UrlSafe = WordArrayBase64.UrlSafe;
    var Event = C_lib.Event;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var Base64UrlSafe = Base64.UrlSafe;

    var BsdCryptHashFormatter = C.hash.formatter.BsdCrypt = Base.extend({
        init: function (rawData, salt) {
            this.rawData = rawData;
            this.salt = salt;
        },

        toString: function () {
            // Shortcuts
            var rawData = this.rawData;
            var salt = this.salt;

            // $identifier$salt$rawData
            var hashStr = '$';
            switch (this.hasher) {
                case C.MD5:
                    hashStr += '1';
                    break;
                case C.SHA1:
                    hashStr += 'sha1';
                    break;
                case C.SHA256:
                    hashStr += '5';
                    break;
                default:
                    throw new Error('Unknown hasher.');
            }
            hashStr += '$';
            if (salt) {
                hashStr += salt.toString(Base64UrlSafe);
            }
            hashStr += '$' + rawData.toString(Base64UrlSafe);

            return hashStr;
        },

        fromString: function (dataStr) {
            throw new Error('Not implemented.');
        }
    });
}(CryptoJS));
