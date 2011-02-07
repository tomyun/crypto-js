(function (C) {
    // Shortcuts
    var WordArray = C.lib.WordArray;

    // Option defaults
    var optionDefaults = C.oop.BaseObj.extend({
        keySize: 4,
        hasher: C.SHA1,
        iterations: 1
    });

    var PBKDF2 = C.PBKDF2 = C.oop.BaseFn.extend({
        init: function (password, salt, options) {
            // Apply option defaults
            options = optionDefaults.extend(options);

            // Convert string to WordArray, else assume WordArray already
            if (typeof salt == 'string') salt = C.enc.Utf8Str.decode(salt);

            // Initial values
            var derivedKey = new WordArray();
            var blockIndex = new WordArray([1]);

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = options.keySize;
            var hasher = options.hasher;
            var iterations = options.iterations;

            // Init HMAC
            var hmac = new C.HMAC(hasher, password);

            // Generate key
            while (derivedKeyWords.length < keySize) {
                var block = hmac.finalize(salt.clone().concat(blockIndex));

                // Shortcuts
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;

                // Iterations
                var intermediate = block;
                for (var i = 1; i < iterations; i++) {
                    intermediate = hmac.finalize(intermediate);

                    // Shortcuts
                    var intermediateWords = intermediate.words;

                    // XOR intermediate with block
                    for (var j = 0; j < blockWordsLength; j++) {
                        blockWords[j] ^= intermediateWords[j];
                    }
                }

                derivedKey.concat(block);
                blockIndexWords[0]++;
            }
            derivedKey.setSigBytes(keySize * 4);

            return derivedKey;
        }
    });
})(CryptoJS);
