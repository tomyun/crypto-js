(function (C) {
    // Shortcuts
    var C_lib = C.lib;
    var BaseObj = C_lib.BaseObj;
    var WordArray_Hex = C_lib.WordArray.Hex;

    var PBKDF2 = C.PBKDF2 = BaseObj.extend({
        // Config defaults
        cfg: BaseObj.extend({
            keySize: 4,
            hasher: C.SHA1,
            iterations: 1
        }),

        compute: function (password, salt, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Init HMAC
            var hmac = C.HMAC.create(cfg.hasher, password);

            // Initial values
            var derivedKey = WordArray_Hex.create();
            var blockIndex = WordArray_Hex.create([1]);

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                var block = hmac.update(salt).compute(blockIndex);

                // Shortcuts
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;

                // Iterations
                var intermediate = block;
                for (var i = 1; i < iterations; i++) {
                    intermediate = hmac.compute(intermediate);

                    // Shortcut
                    var intermediateWords = intermediate.words;

                    // XOR block with intermediate
                    for (var j = 0; j < blockWordsLength; j++) {
                        blockWords[j] ^= intermediateWords[j];
                    }
                }

                derivedKey.concat(block);
                blockIndexWords[0]++;
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    });
}(CryptoJS));
