YUI.add('sha256-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'SHA256',

        testVector1: function () {
            var expected = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

            var message = '';
            var actual = C.SHA256.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector2: function () {
            var expected = 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb';

            var message = 'a';
            var actual = C.SHA256.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector3: function () {
            var expected = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

            var message = 'abc';
            var actual = C.SHA256.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector4: function () {
            var expected = 'f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650';

            var message = 'message digest';
            var actual = C.SHA256.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector5: function () {
            var expected = '71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73';

            var message = 'abcdefghijklmnopqrstuvwxyz';
            var actual = C.SHA256.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector6: function () {
            var expected = 'db4bfcbd4da0cd85a60c3c37d3fbd8805c77f15fc6b1fdfe614ee0a7c8fdb4c0';

            var message = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var actual = C.SHA256.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector7: function () {
            var expected = 'f371bc4a311f2b009eef952dd83ca80e2b60026c8e935592d0f9c308453c813e';

            var message = '12345678901234567890123456789012345678901234567890123456789012345678901234567890';
            var actual = C.SHA256.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testLongMessage: function () {
            var expected = 'f8146961d9b73d8da49ccd526fca65439cdd5b402f76971556d5f52fd129843e';

            var sha256 = C.SHA256.create();
            for (var i = 0; i < 100; i++) {
                sha256.update('12345678901234567890123456789012345678901234567890');
            }
            var actual = sha256.compute();

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
