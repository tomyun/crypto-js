YUI.add('pad-pkcs5-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'pad.PKCS5',

        testPad: function () {
            var data = C.lib.WordArray.create([0x666f7200], 3);
            C.pad.PKCS5.pad(data, 2);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7205, 0x05050505]).toString(), data);
        },

        testUnpad: function () {
            var data = C.lib.WordArray.create([0x666f7205, 0x05050505]);
            C.pad.PKCS5.unpad(data);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7200], 3).toString(), data);
        }
    }));
}, '$Rev$');
