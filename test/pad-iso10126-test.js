YUI.add('pad-iso10126-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'pad.Iso10126',

        setUp: function () {
            this.data = {};

            // Save original random method
            this.data.random_ = C.lib.WordArray.random;

            // Replace random method with one that returns a predictable value
            C.lib.WordArray.random = function (nBytes) {
                var words = [];
                for (var i = 0; i < nBytes; i += 4) {
                    words.push([0x11223344]);
                }

                return this.create(words, nBytes);
            };
        },

        tearDown: function () {
            // Restore random method
            C.lib.WordArray.random = this.data.random_;
        },

        testPad: function () {
            var data = C.lib.WordArray.create([0x666f7200], 3);
            C.pad.Iso10126.pad(data, 2);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7211, 0x22334405]).toString(), data);
        },

        testUnpad: function () {
            var data = C.lib.WordArray.create([0x666f7211, 0x22334405]);
            C.pad.Iso10126.unpad(data);

            Y.Assert.areEqual(C.lib.WordArray.create([0x666f7200], 3).toString(), data);
        }
    }));
}, '$Rev$');
