YUI.add('enc-latin1-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Latin1',

        testStringifyBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', (function () {
                var wordArray = CryptoJS.enc.Latin1.parse('\x12\x34\x56\x78\x12\x34\x56\x78');

                return function () {
                    CryptoJS.enc.Latin1.stringify(wordArray);
                };
            }()));

            suite.add('CryptoJS 3', (function () {
                var wordArray = Y.CryptoJS3.enc.Latin1.parse('\x12\x34\x56\x78\x12\x34\x56\x78');

                return function () {
                    Y.CryptoJS3.enc.Latin1.stringify(wordArray);
                }
            }()));

            suite.add('CryptoJS 2', (function () {
                var wordArray = Y.CryptoJS2.util.bytesToWords(Y.CryptoJS2.charenc.Binary.stringToBytes('\x12\x34\x56\x78\x12\x34\x56\x78'));

                return function () {
                    Y.CryptoJS2.charenc.Binary.bytesToString(Y.CryptoJS2.util.wordsToBytes(wordArray));
                };
            }()));

            suite.add('Forge', (function () {
                var byteBuffer = Y.Forge.util.createBuffer('\x12\x34\x56\x78\x12\x34\x56\x78');

                return function () {
                    byteBuffer.bytes();
                };
            }()));

            suite.on('cycle', function (e) {
                Y.log(e.target, 'info', 'TestRunner');
            });

            suite.on('complete', (function (testCase) {
                return function () {
                    testCase.resume(function () {
                        Y.Assert.areEqual('CryptoJS 4', suite.filter('fastest').pluck('name'));
                    });
                }
            }(this)));

            suite.run({ async: true });

            this.wait(1000000);
        },

        testParseBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', function () {
                CryptoJS.enc.Latin1.parse('\x12\x34\x56\x78\x12\x34\x56\x78');
            });

            suite.add('CryptoJS 3', function () {
                Y.CryptoJS3.enc.Latin1.parse('\x12\x34\x56\x78\x12\x34\x56\x78');
            });

            suite.add('CryptoJS 2', function () {
                Y.CryptoJS2.util.bytesToWords(Y.CryptoJS2.charenc.Binary.stringToBytes('\x12\x34\x56\x78\x12\x34\x56\x78'));
            });

            suite.add('Forge', function () {
                Y.Forge.util.createBuffer('\x12\x34\x56\x78\x12\x34\x56\x78');
            });

            suite.on('cycle', function (e) {
                Y.log(e.target, 'info', 'TestRunner');
            });

            suite.on('complete', (function (testCase) {
                return function () {
                    testCase.resume(function () {
                        Y.Assert.areEqual('CryptoJS 4', suite.filter('fastest').pluck('name'));
                    });
                }
            }(this)));

            suite.run({ async: true });

            this.wait(1000000);
        }
    }));
}, '$Rev$');
