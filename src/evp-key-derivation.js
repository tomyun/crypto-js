// This implementation was written to conform with EVP_BytesToKey.
// www.openssl.org/docs/crypto/EVP_BytesToKey.html

(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var WordArrayHex = WordArray.Hex;
    var WordArrayLatin1 = WordArray.Latin1;
    var WordArrayUtf8 = WordArray.Utf8;
    var Event = C_lib.Event;
    var Formatter = C_lib.Formatter;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;

    var EvpKeyDerivation = C.EvpKeyDerivation = Base.extend({
        // Config defaults
        cfg: Base.extend({
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
            var derivedKey = WordArrayHex.create();

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
