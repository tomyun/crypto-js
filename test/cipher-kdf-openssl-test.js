YUI.add('cipher-kdf-openssl-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'cipher.kdf.OpenSSL',

        testVector: function () {
            var expectedKey  = '50f32e0ec9408e02ff42364a52aac95c3694fc027256c6f488bf84b8e60effcd';
            var expectedIV   = '81381e39b94fd692dff7e2239a298cb6';
            var expectedSalt = '0a9d8620cf7219f1';

            var DummyCipher256 = C.cipher.Base.extend({ keySize: 256/32 });
            var actual = C.cipher.kdf.OpenSSL.execute(
                DummyCipher256,
                'password',
                C.lib.WordArray.create([0x0a9d8620, 0xcf7219f1])
            );

            Y.Assert.areEqual(expectedKey,  actual.key);
            Y.Assert.areEqual(expectedIV,   actual.iv);
            Y.Assert.areEqual(expectedSalt, actual.salt);
        }
    }));
});
