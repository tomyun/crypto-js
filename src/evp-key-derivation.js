// This implementation was written to conform with EVP_BytesToKey.
// www.openssl.org/docs/crypto/EVP_BytesToKey.html

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
            var derivedKey = WordArray_Hex.create();

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
}(CryptoJS));
