Ext.namespace('DigiCompass.Web.UI.Cmp.Format');

(function(){
	
	var FORMAT_DIGITS = '0';
	var FORMAT_DIGITS_PRECISION = '0.00';
	var FORMAT_SHOW_COMMA_AND_DIGITS_PRECISION = '0,000.00';
	
	//122
	DigiCompass.Web.UI.Cmp.Format.formatDigits = Ext.util.Format.numberRenderer(FORMAT_DIGITS);

	//1.22
	DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision = Ext.util.Format.numberRenderer(FORMAT_DIGITS_PRECISION);
	
	//1,222,222.22
	DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision = Ext.util.Format.numberRenderer(FORMAT_SHOW_COMMA_AND_DIGITS_PRECISION);
	
	//22%
	DigiCompass.Web.UI.Cmp.Format.percentageRenderer = function(value){
		if(value && value.length != 0){
			return accMul(value,100) + '%';
		}else{
			return '';
		}
	}
	
	//1,1,0,0,1,0
	DigiCompass.Web.UI.Cmp.Format.builderCommaStr = function(value, r){
		if(value){
			var vl = value.split(",").length
			if(vl){
				var tmpList = [];
				var tmpV = [];
				for(var a=0; a<vl; a++){
					var tmp = value.split(",")[a].split(":")
					if(tmp.length == 2){
						tmpList.push(tmp[1])
						tmpV.push(tmp[0] + ": " + tmp[1])
					}
				}
				return "<span title='" + tmpV.join(", ") + "'>" + tmpList.join(",") + "</span>";
			}
		}
		return '';
	}
	
	
})()