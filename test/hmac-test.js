YUI.add('algo-hmac-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.HMAC',

        testVector1: function () {
            var key = C.enc.Hex.fromString('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b');
            var actual = C.algo.HMAC.create(C.algo.MD5, key).compute('Hi There');

            Y.Assert.areEqual('9294727a3638bb1c13f48ef8158bfc9d', actual);
        },

        testVector2: function () {
            var actual = C.algo.HMAC.create(C.algo.MD5, 'Jefe').compute('what do ya want for nothing?');

            Y.Assert.areEqual('750c783e6ab0b503eaa86e310a5db738', actual);
        },

        testVector3: function () {
            var message = C.enc.Hex.fromString('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
            var key = C.enc.Hex.fromString('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            var actual = C.algo.HMAC.create(C.algo.MD5, key).compute(message);

            Y.Assert.areEqual('56be34521d144c88dbb8c733f0e8b3f6', actual);
        },

        testUpdate: function () {
            var key = C.enc.Hex.fromString('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

            var message = C.enc.Hex.fromString('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
            var expected = C.algo.HMAC.create(C.algo.MD5, key).compute(message).toString();

            var messagePart1 = C.enc.Hex.fromString('dddddddddddddddddddddddddddddddddddd');
            var messagePart2 = C.enc.Hex.fromString('dddddddddddddddddddddddddddddddd');
            var messagePart3 = C.enc.Hex.fromString('dddddddddddddddddddddddddddddddd');
            var hmac = C.algo.HMAC.create(C.algo.MD5, key);
            hmac.update(messagePart1);
            hmac.update(messagePart2);
            var actual = hmac.compute(messagePart3);

            Y.Assert.areEqual(expected, actual);
        },

        testRepeatCompute: function () {
            var hmac = C.algo.HMAC.create(C.algo.MD5, 'Jefe');

            var expected = hmac.compute('what do ya want for nothing?').toString();
            var actual = hmac.compute('what do ya want for nothing?');

            Y.Assert.areEqual(expected, actual);
        },

        testInputIntegrity: function () {
            var message = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var key = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expectedMessage = message.toString();
            var expectedKey = key.toString();

            C.algo.HMAC.create(C.algo.MD5, key).compute(message);

            Y.Assert.areEqual(expectedMessage, message);
            Y.Assert.areEqual(expectedKey, key);
        }
    }));
}, '$Rev$');
