TestSuite.add(new YAHOO.tool.TestCase({
	
	_compare: function(pad, cipher, a, b) {
		// verify required API is implemented
		Assert.isFunction(pad.pad);
		Assert.isFunction(pad.unpad);
		
		// perform padding
		var input = a.split(",");
		if( a=="" ) input = new Array(0);
		var output = input.slice(0);
		pad.pad(cipher, output);
		var check = b.split(",");
		if( b=="" ) check = new Array(0);
		
		// check result has expected length
		Assert.areEqual(output.length, check.length,
				"Expected padding length to be "+check.length+" but got "+output.length+" with input \""+a+"\"");
		
		// check input has been preserved
		for(var i=0;i<input.length;i++) {
			Assert.areEqual(output[i],input[i],
					"Input corrupted: value "+i+" was "+output[i]+" not "+input[i]+" with input \""+a+"\"");
		}
		
		// check padding matches expectations
		for(var i=input.length;i<output.length;i++) {
			if( check[i]!="*" ) {
				Assert.areEqual(output[i],check[i],
						"Padding byte "+i+" was "+output[i]+" not "+check[i]+" with input \""+a+"\"");
			}
		}
		
		var unpad = output.slice(0);
		pad.unpad(cipher, unpad);

		// check result has expected length
		Assert.areEqual(unpad.length, input.length);
		
		// check input has been preserved
		for(var i=0;i<input.length;i++) {
			Assert.areEqual(unpad[i],input[i]);
		}
	},

	test_zeropad: function() {
		// dummy cipher that simply specifies a block size
		var cipher = { _blocksize : 2 };
		var p = Crypto.pad.ZeroPadding;
		
		this._compare(p, cipher, "", "");
		// this._compare(p, cipher, "0,0", "0,0,0,0,0,0,0,0"); // this test *should* fail; the problem with zero padding
		this._compare(p, cipher, "1,2,3", "1,2,3,0,0,0,0,0");
		this._compare(p, cipher, "4,3,2,1,8,7,6,5", "4,3,2,1,8,7,6,5");
		this._compare(p, cipher, "5,4,3,2,1,5,4,3,2,1", "5,4,3,2,1,5,4,3,2,1,0,0,0,0,0,0");
		this._compare(p, cipher, "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f", "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f");

		// try different block size
		cipher = { _blocksize : 3 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,0,0,0,0,0,0,0,0,0");

		// try different block size
		cipher = { _blocksize : 4 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,0");
	},

	test_iso7816: function() {
		// dummy cipher that simply specifies a block size
		var cipher = { _blocksize : 2 };
		var p = Crypto.pad.iso7816;
		
		this._compare(p, cipher, "", "0x80,0,0,0,0,0,0,0");
		this._compare(p, cipher, "0,0", "0,0,0x80,0,0,0,0,0");
		this._compare(p, cipher, "1,2,3", "1,2,3,0x80,0,0,0,0");
		this._compare(p, cipher, "4,3,2,1,8,7,6,5", "4,3,2,1,8,7,6,5,0x80,0,0,0,0,0,0,0");
		this._compare(p, cipher, "5,4,3,2,1,5,4,3,2,1", "5,4,3,2,1,5,4,3,2,1,0x80,0,0,0,0,0");
		this._compare(p, cipher, "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f", "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,0x80,0,0,0,0,0,0,0");

		// try different block size
		cipher = { _blocksize : 3 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,0x80,0,0,0,0,0,0,0,0");

		// try different block size
		cipher = { _blocksize : 4 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,0x80");
	},
	
	test_ansix923: function() {
		// dummy cipher that simply specifies a block size
		var cipher = { _blocksize : 2 };
		var p = Crypto.pad.ansix923;
		
		this._compare(p, cipher, "", "0,0,0,0,0,0,0,8");
		this._compare(p, cipher, "0,0", "0,0,0,0,0,0,0,6");
		this._compare(p, cipher, "1,2,3", "1,2,3,0,0,0,0,5");
		this._compare(p, cipher, "4,3,2,1,8,7,6,5", "4,3,2,1,8,7,6,5,0,0,0,0,0,0,0,8");
		this._compare(p, cipher, "5,4,3,2,1,5,4,3,2,1", "5,4,3,2,1,5,4,3,2,1,0,0,0,0,0,6");
		this._compare(p, cipher, "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f", "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,0,0,0,0,0,0,0,8");

		// try different block size
		cipher = { _blocksize : 3 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,0,0,0,0,0,0,0,0,9");

		// try different block size
		cipher = { _blocksize : 4 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,1");
	},
	
	test_iso10126: function() {
		// dummy cipher that simply specifies a block size
		var cipher = { _blocksize : 2 };
		var p = Crypto.pad.iso10126;
		
		this._compare(p, cipher, "", "*,*,*,*,*,*,*,8");
		this._compare(p, cipher, "0,0", "0,0,*,*,*,*,*,6");
		this._compare(p, cipher, "1,2,3", "1,2,3,*,*,*,*,5");
		this._compare(p, cipher, "4,3,2,1,8,7,6,5", "4,3,2,1,8,7,6,5,*,*,*,*,*,*,*,8");
		this._compare(p, cipher, "5,4,3,2,1,5,4,3,2,1", "5,4,3,2,1,5,4,3,2,1,*,*,*,*,*,6");
		this._compare(p, cipher, "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f", "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,*,*,*,*,*,*,*,8");

		// try different block size
		cipher = { _blocksize : 3 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,*,*,*,*,*,*,*,*,9");

		// try different block size
		cipher = { _blocksize : 4 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,1");
	},
	
	test_pkcs7: function() {
		// dummy cipher that simply specifies a block size
		var cipher = { _blocksize : 2 };
		var p = Crypto.pad.pkcs7;
		
		this._compare(p, cipher, "", "8,8,8,8,8,8,8,8");
		this._compare(p, cipher, "0,0", "0,0,6,6,6,6,6,6");
		this._compare(p, cipher, "1,2,3", "1,2,3,5,5,5,5,5");
		this._compare(p, cipher, "4,3,2,1,8,7,6,5", "4,3,2,1,8,7,6,5,8,8,8,8,8,8,8,8");
		this._compare(p, cipher, "5,4,3,2,1,5,4,3,2,1", "5,4,3,2,1,5,4,3,2,1,6,6,6,6,6,6");
		this._compare(p, cipher, "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f", "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,8,8,8,8,8,8,8,8");

		// try different block size
		cipher = { _blocksize : 3 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,9,9,9,9,9,9,9,9,9");

		// try different block size
		cipher = { _blocksize : 4 };
		this._compare(p, cipher, "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3", "1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,1");
	}


}));