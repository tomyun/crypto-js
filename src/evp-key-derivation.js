// This implementation was written to conform with EVP_BytesToKey.
// www.openssl.org/docs/crypto/EVP_BytesToKey.html

(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_enc = C.enc;
    var C_enc_Hex = C_enc.Hex;
    var C_MD5 = C.MD5;

    var C_EvpKeyDerivation = C.EvpKeyDerivation = C_lib_Base.extend({
        // Config defaults
        cfg: C_lib_Base.extend({
            keySize: 4,
            hasher: C_MD5,
            iterations: 1
        }),

        compute: function (password, salt, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Init hasher
            var hasher = cfg.hasher.create({ salt: null });

            // Initial values
            var derivedKey = C_enc_Hex.create();

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                if (block) {
                    hasher.update(block);
                }
                var block = hasher.update(password).compute(salt).rawData;

                // Iterations
                for (var i = 1; i < iterations; i++) {
                    block = hasher.compute(block).rawData;
                }

                derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    });
}());
