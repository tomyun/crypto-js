(function (C) {
    var HMAC = C.HMAC = C.oop.BaseFn.extend({
        init: function () {
            if (this instanceof HMAC)
            {
                /* New instance */

                // Arguments
                var hasher = arguments[0];
                var key = arguments[1];

                // Instantiate hasher
                this._hasher = new hasher();

                // Convert String to WordArray, else assume WordArray already
                if (typeof key == 'string') key = C.enc.Utf8Str.decode(key);

                // Shortcuts
                var blockSize = hasher.blockSize;
                var blockSizeBytes = blockSize * 4;

                // Allow arbitrary length keys
                if (key.getSigBytes() > blockSizeBytes) {
                    key = this._hasher.finalize(key);
                }

                // Copy key for inner and outer pads
                var oKey = this._oKey = key.clone();
                var iKey = this._iKey = key.clone();

                // Shortcuts
                var oKeyWords = oKey.words;
                var iKeyWords = iKey.words;

                // XOR keys with pad constants
                for (var i = 0; i < blockSize; i++) {
                    oKeyWords[i] ^= 0x5C5C5C5C;
                    iKeyWords[i] ^= 0x36363636;
                }
                oKey.setSigBytes(blockSizeBytes);
                iKey.setSigBytes(blockSizeBytes);

                // Initialize hasher
                this.reset();
            }
            else
            {
                /* Static call */

                var hasher = arguments[0];
                var message = arguments[1];
                var key = arguments[2];

                var hmac = new HMAC(hasher, key);
                return hmac.finalize(message);
            }
        },

        reset: function () {
            // Shortcuts
            var hasher = this._hasher;

            hasher.reset();
            hasher.update(this._iKey);
        },

        update: function (messageUpdate) {
            this._hasher.update(messageUpdate);
        },

        finalize: function (messageUpdate) {
            if (messageUpdate) this.update(messageUpdate);

            // Shortcuts
            var hasher = this._hasher;

            // Compute HMAC
            var hmac = hasher.finalize(this._oKey.clone().concat(hasher.finalize()));

            this.reset();

            return hmac;
        }
    });
})(CryptoJS);
