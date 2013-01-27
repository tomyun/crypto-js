YUI.add('sha3-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA3',

        testBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4 (512)', function () {
                var hash = CryptoJS.SHA3.hash('abc') + '';
            });

            suite.add('CryptoJS 4 (256)', function () {
                var hash = CryptoJS.SHA3.hash('abc', { outputLength: 256 }) + '';
            });

            suite.add('CryptoJS 3 (256)', function () {
                var hash = Y.CryptoJS3.SHA3('abc', { outputLength: 256 }) + '';
            });

            suite.add('Drostie (256)', function () {
                var hash = Y.DrostieSHA3('abc') + '';
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
