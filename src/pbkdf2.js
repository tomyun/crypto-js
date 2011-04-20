(function (C) {
    // Shortcuts
    var C_algo = C.algo;
    var BaseObj = C.oop.BaseObj;
    var WordArray_Hex = C.lib.WordArray.Hex;

    var PBKDF2 = C_algo.PBKDF2 = BaseObj.extend({
        optionDefaults: BaseObj.extend({
            keySize: 4,
            hasher: C_algo.SHA1,
            iterations: 1
        }),

        compute: function (password, salt, options) {
            // Apply option defaults
            options = this.optionDefaults.extend(options);

            // Init HMAC
            var hmac = C_algo.HMAC.create(options.hasher, password);

            // Initial values
            var derivedKey = WordArray_Hex.create();
            var blockIndex = WordArray_Hex.create([1]);

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = options.keySize;
            var iterations = options.iterations;

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

                    // Shortcuts
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
