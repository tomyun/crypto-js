YUI.add('lib-base-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'lib.Base',

        setUp: function () {
            this.data = {};

            this.data.overrides = {
                init: function (arg) {
                    this.initFired = true;
                    this.arg = arg;
                },

                toString: function () {
                },

                abc: 'abc'
            };

            this.data.Obj = C.lib.Base.extend(this.data.overrides);

            this.data.obj = this.data.Obj.create('abc');

            this.data.objClone = this.data.obj.clone();

        },

        testExtendInheritance: function () {
            Y.Assert.areEqual(C.lib.Base.extend, this.data.Obj.extend);
            Y.Assert.isFalse(this.data.Obj.hasOwnProperty('extend'));
        },

        testExtendSuper: function () {
            Y.Assert.areEqual(C.lib.Base, this.data.Obj.$super);
        },

        testExtendOverrides: function () {
            // init
            Y.Assert.areEqual(this.data.overrides.init, this.data.Obj.init);
            Y.Assert.isTrue(this.data.Obj.hasOwnProperty('init'));

            // toString
            Y.Assert.areEqual(this.data.overrides.toString, this.data.Obj.toString);
            Y.Assert.isTrue(this.data.Obj.hasOwnProperty('toString'));

            // abc
            Y.Assert.areEqual(this.data.overrides.abc, this.data.Obj.abc);
            Y.Assert.isTrue(this.data.Obj.hasOwnProperty('abc'));
        },

        testCreateInheritance: function () {
            // from Obj
            Y.Assert.areEqual(this.data.Obj.init, this.data.obj.init);
            Y.Assert.isFalse(this.data.obj.hasOwnProperty('init'));

            // from Base
            Y.Assert.areEqual(C.lib.Base.extend, this.data.obj.extend);
            Y.Assert.isFalse(this.data.obj.hasOwnProperty('extend'));
        },

        testCreateSuper: function () {
            Y.Assert.areEqual(this.data.Obj, this.data.obj.$super);
        },

        testCreateInit: function () {
            Y.Assert.isTrue(this.data.obj.initFired);
            Y.Assert.areEqual('abc', this.data.obj.arg);
        },

        testCloneDistinct: function () {
            Y.Assert.areNotEqual(this.data.obj, this.data.objClone);
        },

        testCloneCopy: function () {
            Y.Assert.areEqual(this.data.obj.arg, this.data.objClone.arg);
        },

        testCloneIndependent: function () {
            this.data.obj.arg = 'xyz';

            Y.Assert.areNotEqual(this.data.obj.arg, this.data.objClone.arg);
        }
    }));
}, '$Rev$');
