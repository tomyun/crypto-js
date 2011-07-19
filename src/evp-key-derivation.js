// This implementation was written to conform with EVP_BytesToKey.
// www.openssl.org/docs/crypto/EVP_BytesToKey.html

(function (C) {
    // Shortcuts
    var C_lib = C.lib;
    var BaseObj = C_lib.BaseObj;

    var EvpKeyDerivation = C.EvpKeyDerivation = BaseObj.extend({
        // Config defaults
        cfg: BaseObj.extend({
            keySize: 4,
            hasher: C.MD5,
            iterations: 1
        }),

        compute: function (password, salt, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Init hasher
            var hasher = cfg.hasher.create({ salt: null });

            // Initial values
            var derivedKey = C_lib.WordArray.Hex.create();

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                var block;

                if (block) {
                    hasher.update(block);
                }
                block = hasher.update(password).compute(salt).rawHash;

                // Shortcuts
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;

                // Iterations
                for (var i = 1; i < iterations; i++) {
                    block = hasher.compute(block).rawHash;
                }

                derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    });
}(CryptoJS));
