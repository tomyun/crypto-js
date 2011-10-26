YUI.add('pad-zeropadding-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'pad.ZeroPadding',

        testPad: function () {
            var data = C.lib.WordArray.create([0x666f7200], 3);
            C.pad.ZeroPadding.pad(data, 2);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7200, 0x00000000]).toString(), data);
        },

        testUnpad: function () {
            var data = C.lib.WordArray.create([0x666f7200, 0x00000000]);
            C.pad.ZeroPadding.unpad(data);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7200], 3).toString(), data);
        }
    }));
}, '$Rev$');
