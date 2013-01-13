YUI.add('sha1-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA1',

        testBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', function () {
                var hash = CryptoJS.SHA1.hash('abc') + '';
            });

            suite.add('CryptoJS 3', function () {
                var hash = Y.CryptoJS3.SHA1('abc') + '';
            });

            suite.add('CryptoJS 2', function () {
                var hash = Y.CryptoJS2.SHA1('abc') + '';
            });

            suite.add('Paj', function () {
                var hash = Y.PajSHA1('abc') + '';
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
