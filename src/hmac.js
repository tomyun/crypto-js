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

    var HMAC = C.HMAC = BaseObj.extend({
        init: function (hasher, key) {
            // Init hasher
            hasher = this.hasher = hasher.create({ salt: null });

            // Convert string to WordArray, else assume WordArray already
            if (typeof key == 'string') {
                key = Utf8.decode(key);
            }

            // Shortcut
            var hasherBlockSize = hasher.blockSize;

            // Allow arbitrary length keys
            if (key.words.length > hasherBlockSize) {
                key = hasher.compute(key).rawData;
            }

            // Clone key for inner and outer pads
            var oKey = this.oKey = key.clone();
            var iKey = this.iKey = key.clone();

            // Shortcuts
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;

            // XOR keys with pad constants
            for (var i = 0; i < hasherBlockSize; i++) {
                oKeyWords[i] ^= 0x5c5c5c5c;
                iKeyWords[i] ^= 0x36363636;
            }
            oKey.sigBytes = iKey.sigBytes = hasherBlockSize * 4;

            // Set initial values
            this.reset();
        },

        reset: function () {
            // Shortcut
            var hasher = this.hasher;

            hasher.reset();
            hasher.update(this.iKey);
        },

        update: function (messageUpdate) {
            this.hasher.update(messageUpdate);

            // Chainable
            return this;
        },

        compute: function () {
            if (this.hasher) {
                return this.computeInstance.apply(this, arguments);
            } else {
                return this.computeStatic.apply(this, arguments);
            }
        },

        computeInstance: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this.update(messageUpdate);
            }

            // Shortcut
            var hasher = this.hasher;

            // Compute HMAC
            var hmac = hasher.compute(this.oKey.clone().concat(hasher.compute().rawData)).rawData;

            this.reset();

            return hmac;
        },

        computeStatic: function (hasher, message, key) {
            return this.create(hasher, key).compute(message);
        }
    });
}(CryptoJS));
