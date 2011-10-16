YUI.add('pbkdf2-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'PBKDF2',

        testVectorKeySize128: function () {
            var actual = C.PBKDF2.compute('password', 'ATHENA.MIT.EDUraeburn', { keySize: 128/32 });

            Y.Assert.areEqual('cdedb5281bb2f801565a1122b2563515', actual);
        },

        testVectorKeySize256: function () {
            var actual = C.PBKDF2.compute('password', 'ATHENA.MIT.EDUraeburn', { keySize: 256/32 });

            Y.Assert.areEqual('cdedb5281bb2f801565a1122b25635150ad1f7a04bb9f3a333ecc0e2e1f70837', actual);
        },

        testVectorKeySize128Iterations2: function () {
            var actual = C.PBKDF2.compute('password', 'ATHENA.MIT.EDUraeburn', { keySize: 128/32, iterations: 2 });

            Y.Assert.areEqual('01dbee7f4a9e243e988b62c73cda935d', actual);
        },

        testVectorKeySize256Iterations2: function () {
            var actual = C.PBKDF2.compute('password', 'ATHENA.MIT.EDUraeburn', { keySize: 256/32, iterations: 2 });

            Y.Assert.areEqual('01dbee7f4a9e243e988b62c73cda935da05378b93244ec8f48a99e61ad799d86', actual);
        },

        testVectorKeySize128Iterations1200: function () {
            var actual = C.PBKDF2.compute('password', 'ATHENA.MIT.EDUraeburn', { keySize: 128/32, iterations: 1200 });

            Y.Assert.areEqual('5c08eb61fdf71e4e4ec3cf6ba1f5512b', actual);
        },

        testVectorKeySize256Iterations1200: function () {
            var actual = C.PBKDF2.compute('password', 'ATHENA.MIT.EDUraeburn', { keySize: 256/32, iterations: 1200 });

            Y.Assert.areEqual('5c08eb61fdf71e4e4ec3cf6ba1f5512ba7e52ddbc5e5142f708a31e2e62b1e13', actual);
        },

        testVectorKeySize128Iterations5: function () {
            var salt = C.enc.Hex.fromString('1234567878563412');
            var actual = C.PBKDF2.compute('password', salt, { keySize: 128/32, iterations: 5 });

            Y.Assert.areEqual('d1daa78615f287e6a1c8b120d7062a49', actual);
        },

        testVectorKeySize256Iterations5: function () {
            var salt = C.enc.Hex.fromString('1234567878563412');
            var actual = C.PBKDF2.compute('password', salt, { keySize: 256/32, iterations: 5 });

            Y.Assert.areEqual('d1daa78615f287e6a1c8b120d7062a493f98d203e6be49a6adf4fa574b6e64ee', actual);
        },

        testVectorKeySize128Iterations1200PassPhraseEqualsBlockSize: function () {
            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase equals block size';
            var actual = C.PBKDF2.compute(password, salt, { keySize: 128/32, iterations: 1200 });

            Y.Assert.areEqual('139c30c0966bc32ba55fdbf212530ac9', actual);
        },

        testVectorKeySize256Iterations1200PassPhraseEqualsBlockSize: function () {
            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase equals block size';
            var actual = C.PBKDF2.compute(password, salt, { keySize: 256/32, iterations: 1200 });

            Y.Assert.areEqual('139c30c0966bc32ba55fdbf212530ac9c5ec59f1a452f5cc9ad940fea0598ed1', actual);
        },

        testVectorKeySize128Iterations1200PassPhraseExceedsBlockSize: function () {
            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase exceeds block size';
            var actual = C.PBKDF2.compute(password, salt, { keySize: 128/32, iterations: 1200 });

            Y.Assert.areEqual('9ccad6d468770cd51b10e6a68721be61', actual);
        },

        testVectorKeySize256Iterations1200PassPhraseExceedsBlockSize: function () {
            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase exceeds block size';
            var actual = C.PBKDF2.compute(password, salt, { keySize: 256/32, iterations: 1200 });

            Y.Assert.areEqual('9ccad6d468770cd51b10e6a68721be611a8b4d282601db3b36be9246915ec82a', actual);
        },

        testVectorKeySize128Iterations50: function () {
            var password = C.enc.Hex.fromString('f09d849e');
            var actual = C.PBKDF2.compute(password, 'EXAMPLE.COMpianist', { keySize: 128/32, iterations: 50 });

            Y.Assert.areEqual('6b9cf26d45455a43a5b8bb276a403b39', actual);
        },

        testVectorKeySize256Iterations50: function () {
            var password = C.enc.Hex.fromString('f09d849e');
            var actual = C.PBKDF2.compute(password, 'EXAMPLE.COMpianist', { keySize: 256/32, iterations: 50 });

            Y.Assert.areEqual('6b9cf26d45455a43a5b8bb276a403b39e7fe37a0c41e02c281ff3069e1e94f52', actual);
        },

        testInputIntegrity: function () {
            var password = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var salt = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expectedPassword = password.toString();
            var expectedSalt = salt.toString();

            C.PBKDF2.compute(password, salt);

            Y.Assert.areEqual(expectedPassword, password);
            Y.Assert.areEqual(expectedSalt, salt);
        }
    }));
}, '$Rev$');
