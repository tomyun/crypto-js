YUI.add('algo-seed-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'SEED',

        testEncrypt1: function () {
            Y.Assert.areEqual('5ebac6e0054e166819aff1cc6d346cdb', C.SEED.encrypt(C.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'), C.enc.Hex.parse('00000000000000000000000000000000'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext.toString());
        },

        testEncrypt2: function () {
            Y.Assert.areEqual('c11f22f20140505084483597e4370f43', C.SEED.encrypt(C.enc.Hex.parse('00000000000000000000000000000000'), C.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext.toString());
        },

        testDecrypt1: function () {
            Y.Assert.areEqual('000102030405060708090a0b0c0d0e0f', C.SEED.decrypt(C.lib.CipherParams.create({ ciphertext: C.enc.Hex.parse('5ebac6e0054e166819aff1cc6d346cdb') }), C.enc.Hex.parse('00000000000000000000000000000000'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).toString());
        },

        testDecrypt2: function () {
            Y.Assert.areEqual('00000000000000000000000000000000', C.SEED.decrypt(C.lib.CipherParams.create({ ciphertext: C.enc.Hex.parse('c11f22f20140505084483597e4370f43') }), C.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'), { mode: C.mode.ECB, padding: C.pad.NoPadding }).toString());
        }
    }));
}, '$Rev$');
