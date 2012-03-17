YUI.add('lib-cipherpbe-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'PasswordBasedCipher',

        testEncrypt: function () {
            var message = 'Hello, World!';
            var password = 'password';

            var passwordBased = C.AES.encrypt(message, password);

            var aes = C.algo.AES.createEncryptor(passwordBased.key, { iv: passwordBased.iv });
            var lowLevelBased = aes.finalize(message);

            Y.Assert.areEqual(lowLevelBased.toString(), passwordBased.ciphertext);
        },

        testDecrypt: function () {
            var message = 'Hello, World!';
            var password = 'password';

            var ciphertext = C.AES.encrypt(message, password);
            var plaintext = C.AES.decrypt(ciphertext, password);

            Y.Assert.areEqual(message, plaintext.toString(C.enc.Utf8));
        }
    }));
}, '$Rev$');
