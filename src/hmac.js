(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_enc = C.enc;
    var C_enc_Utf8 = C_enc.Utf8;

    var C_HMAC = C.HMAC = C_lib_Base.extend({
        init: function (hasher, key) {
            // Init hasher
            hasher = this.hasher = hasher.create({ salt: null });

            // Convert string to WordArray, else assume WordArray already
            if (typeof key == 'string') {
                key = C_enc_Utf8.fromString(key);
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
            return (this.hasher ? computeInstance : computeStatic).apply(this, arguments);
        }
    });

    function computeInstance(messageUpdate) {
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
    }

    function computeStatic(hasher, message, key) {
        return this.create(hasher, key).compute(message);
    }
}());
