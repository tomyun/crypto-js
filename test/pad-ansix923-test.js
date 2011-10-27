YUI.add('pad-ansix923-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'pad.AnsiX923',

        testPad: function () {
            var data = C.lib.WordArray.create([0x666f7200], 3);
            C.pad.AnsiX923.pad(data, 2);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7200, 0x00000005]).toString(), data);
        },

        testUnpad: function () {
            var data = C.lib.WordArray.create([0x666f7200, 0x00000005]);
            C.pad.AnsiX923.unpad(data);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7200], 3).toString(), data);
        }
    }));
}, '$Rev$');
