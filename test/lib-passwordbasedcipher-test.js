YUI.add('lib-passwordbasedcipher-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'PasswordBasedCipher',

        testEncrypt: function () {
            var passwordBased = C.AES.encrypt('Hello, World!', 'password');

            var aes = C.algo.AES.createEncryptor(passwordBased.key, { iv: passwordBased.iv });
            var lowLevelBased = aes.finalize('Hello, World!');

            Y.Assert.areEqual(lowLevelBased.toString(), passwordBased.ciphertext);
        },

        testDecrypt: function () {
            var ciphertext = C.AES.encrypt('Hello, World!', 'password');
            var plaintext = C.AES.decrypt(ciphertext, 'password');

            Y.Assert.areEqual('Hello, World!', plaintext.toString(C.enc.Utf8));
        }
    }));
}, '$Rev$');
