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
                }
            };

            this.data.mixins = {
                mixedMethod: function () {
                }
            };

            this.data.Obj = C.lib.Base.extend(this.data.overrides);

            this.data.Obj.mixIn(this.data.mixins);

            this.data.obj = this.data.Obj.create('arg_value');

            this.data.objClone = this.data.obj.clone();

        },

        testExtendInheritance: function () {
            Y.Assert.areEqual(C.lib.Base.extend, this.data.Obj.extend);
            Y.Assert.isFalse(this.data.Obj.hasOwnProperty('extend'));
        },

        testExtendSuper: function () {
            Y.Assert.areEqual(C.lib.Base, this.data.Obj.$super);
        },

        testExtendOverrideInit: function () {
            Y.Assert.areEqual(this.data.overrides.init, this.data.Obj.init);
            Y.Assert.isTrue(this.data.Obj.hasOwnProperty('init'));
        },

        testExtendOverrideToString: function () {
            Y.Assert.areEqual(this.data.overrides.toString, this.data.Obj.toString);
            Y.Assert.isTrue(this.data.Obj.hasOwnProperty('toString'));
        },

        testMixIn: function () {
            Y.Assert.areEqual(this.data.mixins.mixedMethod, this.data.Obj.mixedMethod);
            Y.Assert.isTrue(this.data.Obj.hasOwnProperty('mixedMethod'));
        },

        testCreateInheritanceFromObj: function () {
            Y.Assert.areEqual(this.data.Obj.init, this.data.obj.init);
            Y.Assert.isFalse(this.data.obj.hasOwnProperty('init'));
        },

        testCreateInheritanceFromBase: function () {
            Y.Assert.areEqual(C.lib.Base.extend, this.data.obj.extend);
            Y.Assert.isFalse(this.data.obj.hasOwnProperty('extend'));
        },

        testCreateSuper: function () {
            Y.Assert.areEqual(this.data.Obj, this.data.obj.$super);
        },

        testCreateInit: function () {
            Y.Assert.isTrue(this.data.obj.initFired);
            Y.Assert.areEqual('arg_value', this.data.obj.arg);
        },

        testIsa: function () {
            Y.Assert.isTrue(this.data.obj.isA(this.data.Obj));
            Y.Assert.isTrue(this.data.obj.isA(C.lib.Base));
            Y.Assert.isFalse(this.data.objClone.isA(this.data.obj));
        },

        testCloneDistinct: function () {
            Y.Assert.areNotEqual(this.data.obj, this.data.objClone);
        },

        testCloneCopy: function () {
            Y.Assert.areEqual(this.data.obj.arg, this.data.objClone.arg);
        },

        testCloneIndependent: function () {
            this.data.obj.arg = 'new_value';

            Y.Assert.areNotEqual(this.data.obj.arg, this.data.objClone.arg);
        }
    }));
}, '$Rev$');
