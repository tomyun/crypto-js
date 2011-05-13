(function (C) {
    var HMAC = C.HMAC = C.oop.BaseObj.extend({
        init: function (hasher, key) {
            // Init hasher
            hasher = this.hasher = hasher.create({ salt: null });

            // Convert String to WordArray, else assume WordArray already
            if (typeof key == 'string') {
                key = C.lib.WordArray.fromString(key);
            }

            // Shortcuts
            var blockSize = hasher.blockSize;

            // Allow arbitrary length keys
            if (key.words.length > blockSize) {
                key = hasher.compute(key).rawHash;
            }

            // Copy key for inner and outer pads
            var oKey = this.oKey = key.clone();
            var iKey = this.iKey = key.clone();

            // Shortcuts
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;

            // XOR keys with pad constants
            for (var i = 0; i < blockSize; i++) {
                oKeyWords[i] ^= 0x5c5c5c5c;
                iKeyWords[i] ^= 0x36363636;
            }
            oKey.sigBytes = iKey.sigBytes = blockSize * 4;

            // Set initial values
            this.reset();
        },

        reset: function () {
            // Shortcuts
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
            // Shortcuts
            var args = arguments;

            // "Static" call
            if ( ! this.hasher) {
                var hasher = args[0];
                var message = args[1];
                var key = args[2];

                return this.create(hasher, key).compute(message);
            }

            var messageUpdate = args[0];

            // Final message update
            if (messageUpdate) {
                this.update(messageUpdate);
            }

            // Shortcuts
            var hasher = this.hasher;

            // Compute HMAC
            var hmac = hasher.compute(this.oKey.clone().concat(hasher.compute().rawHash)).rawHash;

            this.reset();

            return hmac;
        }
    });
}(CryptoJS));
