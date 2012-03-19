YUI.add('pad-pkcs7-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'PKCS7',

        testPad: function () {
            var data = C.lib.WordArray.create([0xdddddd00], 3);
            C.pad.PKCS7.pad(data, 2);

            Y.Assert.areEqual(C.lib.WordArray.create([0xdddddd05, 0x05050505]).toString(), data);
        },

        testPadClamp: function () {
            var data = C.lib.WordArray.create([0xdddddddd, 0xdddddddd], 3);
            C.pad.PKCS7.pad(data, 2);

            Y.Assert.areEqual(C.lib.WordArray.create([0xdddddd05, 0x05050505]).toString(), data);
        },

        testUnpad: function () {
            var data = C.lib.WordArray.create([0xdddddd05, 0x05050505]);
            C.pad.PKCS7.unpad(data);

            Y.Assert.areEqual(C.lib.WordArray.create([0xdddddd00], 3).toString(), data);
        }
    }));
}, '$Rev$');
