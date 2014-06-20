Ext.namespace('DigiCompass.Web.UI.Cmp.Validate');

(function(){
	
	var REGX_PERCENT = /^[1-9][0-9]{1,2}(\.[0-9]{1,2})?|0$/;
	var REGX_DATA = /^[1-9][0-9]{1,10}(\.[0-9]{1,2})?|0$/;
	
	
	//validate percent 222.22
	DigiCompass.Web.UI.Cmp.Validate.validatePercent = function(value){
		if(!value || value.length == 0){
			return true;
		}
		var result = false;
	    //3,33,333
	     var p1 = /^[1-9][0-9]{0,2}$/
	    //33.33
	     var p2 = /^[1-9][0-9]{0,2}\.[0-9]{1,2}$/
		//0.33
	     var p3 = /^0\.[0-9]{1,2}$/
	    //0
	    var p4 = /^0$/;
	    if(p1.test(value) || p2.test(value) || p3.test(value) || p4.test(value)){
	    	result = true;
	    }
		if(!result){
			alertError('Please input a valid data,example 3 or 33.3 or 333.33 etc...');
			return false;
		}
		return true;
	}
	
	DigiCompass.Web.UI.Cmp.Validate.validateData = function(value){
		if(!value || value.length == 0){
			return true;
		}
		var result = false;
	    //3,33,333
	     var p1 = /^[1-9][0-9]{0,9}$/
	    //33.33
	     var p2 = /^[1-9][0-9]{0,9}\.[0-9]{1,2}$/
		//0.33
	     var p3 = /^0\.[0-9]{1,2}$/
	    //0
	    var p4 = /^0$/;
	    if(p1.test(value) || p2.test(value) || p3.test(value) || p4.test(value)){
	    	result = true;
	    }
		if(!result){
			alertError('Please input a valid data,example 3 or 33.3 or 333.33 etc...');
			return false;
		}
		return true;
	}
	
	
})()