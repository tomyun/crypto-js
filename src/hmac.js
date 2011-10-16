(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_enc = C.enc;
    var C_enc_Utf8 = C_enc.Utf8;

    C.HMAC = C_lib_Base.extend({
        /**
         * Initializes a newly created HMAC.
         *
         * @param {CryptoJS.lib.Hash} hasher The hash function to use.
         * @param {CryptoJS.lib.WordArray|UTF-8 string} key The secret key.
         */
        init: function (hasher, key) {
            // Init hasher
            hasher = this._hasher = hasher.create();

            // Convert string to WordArray, else assume WordArray already
            if (typeof key == 'string') {
                key = C_enc_Utf8.fromString(key);
            }

            // Shortcuts
            var hasherBlockSize = hasher.blockSize;
            var hasherBlockSizeBytes = hasherBlockSize * 4;

            // Allow arbitrary length keys
            if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.compute(key);
            }

            // Clone key for inner and outer pads
            var oKey = this._oKey = key.clone();
            var iKey = this._iKey = key.clone();

            // Shortcuts
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;

            // XOR keys with pad constants
            for (var i = 0; i < hasherBlockSize; i++) {
                oKeyWords[i] ^= 0x5c5c5c5c;
                iKeyWords[i] ^= 0x36363636;
            }
            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

            // Set initial values
            this.reset();
        },

        /**
         * Resets this HMAC to its initial state.
         */
        reset: function () {
            // Shortcut
            var hasher = this._hasher;

            hasher.reset();
            hasher.update(this._iKey);
        },

        /**
         * Updates this HMAC using the passed message.
         *
         * @param {CryptoJS.lib.WordArray|UTF-8 string} messageUpdate The message to append.
         *
         * @return {CryptoJS.HMAC} This HMAC.
         */
        update: function (messageUpdate) {
            this._hasher.update(messageUpdate);

            // Chainable
            return this;
        },

        /**
         * If called on an HMAC instance, completes the HMAC computation.
         * After compute is called, this HMAC is reset to its initial state.
         *
         *   @param {CryptoJS.lib.WordArray|UTF-8 string} messageUpdate (Optional) A final message update.
         *
         *   @return {CryptoJS.lib.WordArray} The HMAC.
         *
         * If called statically, creates a new HMAC instance and completes the entire computation.
         *
         *   @param {CryptoJS.lib.Hash} hasher The hash function to use.
         *   @param {CryptoJS.lib.WordArray|UTF-8 string} message The message to HMAC.
         *   @param {CryptoJS.lib.WordArray|UTF-8 string} key The secret key.
         *
         *   @return {CryptoJS.lib.WordArray} The HMAC.
         */
        compute: function () {
            return (this._hasher ? computeInstance : computeStatic).apply(this, arguments);
        }
    });

    function computeInstance(messageUpdate) {
        // Final message update
        if (messageUpdate) {
            this.update(messageUpdate);
        }

        // Shortcut
        var hasher = this._hasher;

        // Compute HMAC
        var hmac = hasher.compute(this._oKey.clone().concat(hasher.compute()));

        this.reset();

        return hmac;
    }

    function computeStatic(hasher, message, key) {
        return this.create(hasher, key).compute(message);
    }
}());
