YUI.add('kdf-openssl-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'kdf.OpenSSL',

        testVector: function () {
            var DummyCipher256 = C.lib.Cipher.extend({ _keySize: 256/32 });
            var cipherParams = C.lib.CipherParams.create({ salt: C.enc.Hex.fromString('0a9d8620cf7219f1') });
            var actual = C.kdf.OpenSSL.execute('password', DummyCipher256, cipherParams);

            Y.Assert.areEqual('50f32e0ec9408e02ff42364a52aac95c3694fc027256c6f488bf84b8e60effcd', actual.key);
            Y.Assert.areEqual('81381e39b94fd692dff7e2239a298cb6', actual.iv);
            Y.Assert.areEqual('0a9d8620cf7219f1', actual.salt);
        }
    }));
}, '$Rev$');
