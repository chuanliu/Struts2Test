(function(){
	/*
	 * 验证时间格式“2012-04” 
	 */
	Ext.apply(Ext.form.field.VTypes, {
				YearMonth : function(v) {
					return /^(?!0000)[0-9]{4}-(0[1-9]|1[0-2])$/.test(v);
				},
				YearMonthText : 'must be year and month like 2012-01',
				YearMonthMask : /[\d\-]/i,

				//  vtype validation function
		        fileExt: function(val, field) {
		        	var reg = field.fileExt;
		        	if(Ext.isEmpty(reg)){
		        		return true;
		        	}else{
		        		this.fileExtText = 'invalid file.  Must be "'+ reg +'".';
		        		reg = reg.replace(/\s/g,'');
		        		var regs = reg.split('|');
		        		for(var i=0; i<regs.length; i++){
		        			r = regs[i];
			        		if(r.indexOf('.') == 0)
			        			regs[i] = r.replace('.', '[\\.]');
			        		else
			        			regs[i] = '[\\.]'+r;
		        		}
		        		console.log('-->' , regs.join('|'));
		        		return new RegExp('('+regs.join('|')+')$').test(val);
		        	}
		        },
		        // vtype Text property: The error text to display when the validation function returns false
		        fileExtText: 'invalid file.  Must be "xlsx|xls|csv".',

		        reg : function(val, field){
		    		var reg = field.reg;
		    		if(Ext.isEmpty(reg) || Ext.isEmpty(val)){
		    			return true;
		    		}else{
		    			this.regText = 'input value is invalid. Must be "'+reg+'".'
		    			try{
		    				return new RegExp(reg).test(val);
		    			}catch(e){
		    				return true;
		    			}
		    		}
		    	},
		    	regText : 'input value is invalid.',
		    	filePngIcon : function(val, field) {
		    		return /\.(png)$/i.test(val);
		    	},
		    	filePngIconText : 'Not a valid icon.  Must be "png".'
		    });
})();