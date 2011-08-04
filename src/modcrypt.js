(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Formatter = C_lib.Formatter;
    var C_enc = C.enc;
    var C_enc_Base64 = C_enc.Base64;
    var C_hash = C.hash;
    var C_hash_salter = C_hash.salter;
    var C_hash_formatter = C_hash.formatter;
    var C_MD5 = C.MD5;
    var C_SHA1 = C.SHA1;
    var C_SHA256 = C.SHA256;

    // Encoder
    var C_enc_Crypt = C_enc.Crypt = C_enc_Base64.extend({
        map: './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    });

    // Salter
    var C_hash_salter_ModCrypt = C_hash_salter.ModCrypt = {
        execute: function (hasher) {
            // Shortcuts
            var cfg = hasher.cfg;
            var salt = cfg.salt;

            // Determine max salt length
            var maxSaltBytes = 9;
            if (hasher.isA(C_MD5)) {
                maxSaltBytes = 6;
            }

            if (salt) {
                // Convert string to WordArray, else assume WordArray already
                if (typeof salt == 'string') {
                    salt = C_enc_Crypt.fromString(salt);
                }

                // Ignore anything after max
                salt.sigBytes = Math.min(salt.sigBytes, maxSaltBytes);
            } else {
                salt = C_enc_Crypt.random(maxSaltBytes);
            }

            // Update hasher with new salt
            cfg.salt = salt;

            // Add salt after reset, before any message updates
            hasher.afterReset.subscribe(function () {
                hasher.update(salt);
            });
        }
    };

    // Formatter
    var C_hash_formatter_ModCrypt = C_hash_formatter.ModCrypt = C_lib_Formatter.extend({
        toString: function () {
            // Shortcuts
            var rawData = this.rawData;
            var salt = this.salt;
            var hasher = this.hasher;

            // $identifier$salt$rawData
            var hashStr =
                    hasher == C_MD5 ? '$1$' :
                    hasher == C_SHA1 ? '$sha1$' :
                    hasher == C_SHA256 ? '$5$' :
                    null;

            if (salt) {
                hashStr += salt.toString(C_enc_Crypt);
            }

            hashStr += '$' + rawData.toString(C_enc_Crypt);

            return hashStr;
        },

        fromString: function (dataStr) {
            var identifierEndIndex = dataStr.indexOf('$', 1) + 1;
            var identifier = dataStr.substr(0, identifierEndIndex);

            var saltEndIndex = dataStr.indexOf('$', identifierEndIndex);
            var salt = C_enc_Crypt.fromString(dataStr.substring(identifierEndIndex, saltEndIndex));

            var rawData = C_enc_Crypt.fromString(dataStr.substr(saltEndIndex + 1));

            var hasher =
                    identifier == '$1$' ? C_MD5 :
                    identifier == '$sha1$' ? C_SHA1 :
                    identifier == '$5$' ? C_SHA256 :
                    null;

            var formatter = this.create(rawData, salt);
            formatter.hasher = hasher;

            return formatter;
        }
    });
}());
