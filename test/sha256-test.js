YUI.add('algo-sha256-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.SHA256',

        testVector1: function () {
            Y.Assert.areEqual('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', C.SHA256(''));
        },

        testVector2: function () {
            Y.Assert.areEqual('ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', C.SHA256('a'));
        },

        testVector3: function () {
            Y.Assert.areEqual('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', C.SHA256('abc'));
        },

        testVector4: function () {
            var actual = C.SHA256('message digest');

            Y.Assert.areEqual('f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650', actual);
        },

        testVector5: function () {
            var actual = C.SHA256('abcdefghijklmnopqrstuvwxyz');

            Y.Assert.areEqual('71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73', actual);
        },

        testVector6: function () {
            var actual = C.SHA256('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');

            Y.Assert.areEqual('db4bfcbd4da0cd85a60c3c37d3fbd8805c77f15fc6b1fdfe614ee0a7c8fdb4c0', actual);
        },

        testVector7: function () {
            var actual = C.SHA256('12345678901234567890123456789012345678901234567890123456789012345678901234567890');

            Y.Assert.areEqual('f371bc4a311f2b009eef952dd83ca80e2b60026c8e935592d0f9c308453c813e', actual);
        },

        testLongMessage: function () {
            var sha256 = C.algo.SHA256.create();
            for (var i = 0; i < 100; i++) {
                sha256.update('12345678901234567890123456789012345678901234567890');
            }
            var actual = sha256.compute();

            Y.Assert.areEqual('f8146961d9b73d8da49ccd526fca65439cdd5b402f76971556d5f52fd129843e', actual);
        },

        testHelper: function () {
            Y.Assert.areEqual(C.algo.SHA256.create().compute('').toString(), C.SHA256(''));
        },

        testHmacHelper: function () {
            var key = C.enc.Hex.fromString('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b');
            var message = 'Hi There';

            var expected = C.algo.HMAC.create(C.algo.SHA256, key).compute(message).toString();

            Y.Assert.areEqual(expected, C.HMAC_SHA256(message, key));
        }
    }));
}, '$Rev$');
