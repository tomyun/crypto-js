YUI.add('algo-rc2-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'RC2',

        testEncrypt2: function () {
            Y.Assert.areEqual('278b27e42e2f0d49', C.RC2.encrypt(C.enc.Hex.parse('ffffffffffffffff'), C.enc.Hex.parse('ffffffffffffffff'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext.toString());
        },

        testEncrypt3: function () {
            Y.Assert.areEqual('30649edf9be7d2c2', C.RC2.encrypt(C.enc.Hex.parse('1000000000000001'), C.enc.Hex.parse('3000000000000000'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext.toString());
        },

        testEncrypt4: function () {
            Y.Assert.areEqual('61a8a244adacccf0', C.RC2.encrypt(C.enc.Hex.parse('0000000000000000'), C.enc.Hex.parse('88'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext.toString());
        },

        testEncrypt5: function () {
            Y.Assert.areEqual('6ccf4308974c267f', C.RC2.encrypt(C.enc.Hex.parse('0000000000000000'), C.enc.Hex.parse('88bca90e90875a'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext.toString());
        },

        testEncrypt6: function () {
            Y.Assert.areEqual('1a807d272bbe5db1', C.RC2.encrypt(C.enc.Hex.parse('0000000000000000'), C.enc.Hex.parse('88bca90e90875a7f0f79c384627bafb2'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext.toString());
        },

        testDecrypt2: function () {
            Y.Assert.areEqual('ffffffffffffffff', C.RC2.decrypt(C.lib.CipherParams.create({ ciphertext: C.enc.Hex.parse('278b27e42e2f0d49') }), C.enc.Hex.parse('ffffffffffffffff'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).toString());
        },

        testDecrypt3: function () {
            Y.Assert.areEqual('1000000000000001', C.RC2.decrypt(C.lib.CipherParams.create({ ciphertext: C.enc.Hex.parse('30649edf9be7d2c2') }), C.enc.Hex.parse('3000000000000000'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).toString());
        },

        testDecrypt4: function () {
            Y.Assert.areEqual('0000000000000000', C.RC2.decrypt(C.lib.CipherParams.create({ ciphertext: C.enc.Hex.parse('61a8a244adacccf0') }), C.enc.Hex.parse('88'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).toString());
        },

        testDecrypt5: function () {
            Y.Assert.areEqual('0000000000000000', C.RC2.decrypt(C.lib.CipherParams.create({ ciphertext: C.enc.Hex.parse('6ccf4308974c267f') }), C.enc.Hex.parse('88bca90e90875a'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).toString());
        },

        testDecrypt6: function () {
            Y.Assert.areEqual('0000000000000000', C.RC2.decrypt(C.lib.CipherParams.create({ ciphertext: C.enc.Hex.parse('1a807d272bbe5db1') }), C.enc.Hex.parse('88bca90e90875a7f0f79c384627bafb2'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).toString());
        }
    }));
}, '$Rev$');
