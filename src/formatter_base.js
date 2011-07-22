(function (C, undefined) {
    // Core shortcuts
    var C_lib = C.lib;
    var BaseObj = C_lib.BaseObj;
    var WordArray = C_lib.WordArray;
    var WordArray_Hex = WordArray.Hex;
    var WordArray_Latin1 = WordArray.Latin1;
    var WordArray_Utf8 = WordArray.Utf8;
    var Event = C_lib.Event;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;

    var Formatter = C_lib.Formatter = BaseObj.extend({
        init: function (rawData, salt) {
            this.rawData = rawData;
            this.salt = salt;
        },

        toString: function (encoder) {
            // Default encoder
            encoder = encoder || this.encoder;

            // Shortcuts
            var rawData = this.rawData;
            var salt = this.salt;

            if (salt) {
                // "Salted__" + salt + rawData
                return WordArray.create([0x53616c74, 0x65645f5f]).
                       concat(salt).concat(rawData).toString(encoder);
            } else {
                return rawData.toString(encoder);
            }
        },

        fromString: function (dataStr, encoder) {
            // Default encoder
            encoder = encoder || this.encoder;

            // Decode data string
            var rawData = encoder.decode(dataStr);

            // Shortcut
            var rawDataWords = rawData.words;

            // Test for salt
            if (rawDataWords[0] == 0x53616c74 && rawDataWords[1] == 0x65645f5f) {
                // Remove prefix
                rawDataWords.splice(0, 2);
                rawData.sigBytes -= 8;

                // Separate salt from raw data
                var salt = rawData.clone();
                salt.sigBytes = 8;
                salt.clamp();

                rawDataWords.splice(0, 2);
                rawData.sigBytes -= 8;
            }

            return this.create(rawData, salt);
        }
    });
}(CryptoJS));
