YUI.add('pad-iso97971-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'pad.Iso97971',

        testPad: function () {
            var data = C.lib.WordArray.create([0x666f7200], 3);
            C.pad.Iso97971.pad(data, 2);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7280, 0x00000000]).toString(), data);
        },

        testUnpad: function () {
            var data = C.lib.WordArray.create([0x666f7280, 0x00000000]);
            C.pad.Iso97971.unpad(data);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7200], 3).toString(), data);
        }
    }));
}, '$Rev$');
