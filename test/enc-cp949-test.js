YUI.add('enc-cp949-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'CP949',

        testStringify1: function () {
            Y.Assert.areEqual('가나', C.enc.CP949.stringify(C.lib.WordArray.create([0xb0a1b3aa], 4)));
        },

        testStringify2: function () {
            Y.Assert.areEqual('뷁햏', C.enc.CP949.stringify(C.lib.WordArray.create([0x94eec164], 4)));
        },

        testStringify3: function () {
            Y.Assert.areEqual('暗號', C.enc.CP949.stringify(C.lib.WordArray.create([0xe4defbdc], 4)));
        },

        testStringify4: function () {
            Y.Assert.areEqual('♡♥', C.enc.CP949.stringify(C.lib.WordArray.create([0xa2bda2be], 4)));
        },

        testParse1: function () {
            Y.Assert.areEqual((C.lib.WordArray.create([0xb0a1b3aa], 4)).toString(), C.enc.CP949.parse('가나').toString());
        },

        testParse2: function () {
            Y.Assert.areEqual((C.lib.WordArray.create([0x94eec164], 4)).toString(), C.enc.CP949.parse('뷁햏').toString());
        },

        testParse3: function () {
            Y.Assert.areEqual((C.lib.WordArray.create([0xe4defbdc], 4)).toString(), C.enc.CP949.parse('暗號').toString());
        },

        testParse4: function () {
            Y.Assert.areEqual((C.lib.WordArray.create([0xa2bda2be], 4)).toString(), C.enc.CP949.parse('♡♥').toString());
        }
    }));
}, '$Rev$');
