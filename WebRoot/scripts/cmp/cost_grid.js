(function() {
	var space = Ext.namespace("DigiCompass.Web.app.cost.Grid");
	function getR() {
		return {
			id:'FormR',
			xtype : 'numberfield',
			fieldLabel : 'r(annual nominal interest rate)',
			name : 'R',
			minValue:0,
			maxLength : 20
		};
	}
	DigiCompass.Web.app.cost.Grid.getXYPosition = function(position,size){
		var x = 100;
		var y = 100;
		var newPosition =  { x:position.x , y:position.y};
		var fx = document.documentElement.clientWidth;
		var fy = document.documentElement.clientHeight;
		if((position.x + size.width + x) > fx){
			newPosition.x = fx - size.width - x;
		}
		if((position.y + size.height + y) > fy){
			newPosition.y = fy - size.height - y;
		}
		return newPosition;
	}
	
	//FarmulaParameter缓存  Key/Value --> FarmulaId/FarmulaParameter(id,name)
	space.parameters = {};
	
	DigiCompass.Web.app.cost.Grid.RTParameter = [];
	DigiCompass.Web.app.cost.Grid.loadRTParameter = function(data){
		var parameters = Ext.JSON.decode(data.BUSINESS_DATA);
		DigiCompass.Web.app.cost.Grid.RTParameter = parameters;
		
		/**
		 * 添加FarmulaParameter缓存对象  初始化操作    tao.zeng 2012-11-04  
		 */
		for(var i in parameters){
			var formula = space.parameters[parameters[i]['formulaID']];
			if(!formula){
				formula = [];
				space.parameters[parameters[i]['formulaID']] = formula;
			}
			formula.push({id:parameters[i]['id'], name : parameters[i]['name'], formula : {id : parameters[i]['formulaID']}});
		}
		
	}
	
	
	DigiCompass.Web.app.cost.Grid.getPTParameter = function(formulaId){
	  	var rtArr = new Array();
	  	var rtParameter = DigiCompass.Web.app.cost.Grid.RTParameter;
		if(Ext.isArray(rtParameter)){
			for(var i = 0 ; i< rtParameter.length ; i++){
				var parameter = rtParameter[i];
				if(parameter.formulaID == formulaId)
					rtArr.push(parameter);
			}
		}
		return rtArr;
	}
	
	space.staticFields = ['formula','P'];
	
	var initForm = function(form, formData){
		//生成表单
		var params = space.parameters[formData.formulaId];
		if(Ext.isArray(params)){
			for(var i in params){
				if(params[i].name == 'T'){
					form.add({
						xtype : 'numberfield',
						fieldLabel : params[i].name + (params[i].description ? '('+params[i].description+')' : ''),
						name : params[i].name,
						minValue:0,
						maxLength : 20,
						allowDecimals:false
					});
				}
				else{
					form.add({
						xtype : 'numberfield',
						fieldLabel : params[i].name + (params[i].description ? '('+params[i].description+')' : ''),
						name : params[i].name,
						minValue:0,
						maxLength : 20
					});
				}
			}
		}
		
		var formValues = {
				P : formData.pValue,
				formula : formData.formulaId
		};
		if(formData.values.length>0){
			//表单数据
			for(var i in formData.values){
				formValues[formData.values[i]['formulaParameter']['name']] = formData.values[i].value;
			}
		}
		form.getForm().setValues(formValues);
	}
	
	var clearForm  = function(form){
		var fields = form.getForm().getFields();
		for(var i = 0; i< fields.getCount(); i++){
			var f = fields.getAt(i);
			var des = true;
			for(var j = 0;j<space.staticFields.length; j++){
				if(space.staticFields[j] === f.getId()){
					des = false;
				}
			}
			if(des){
				f.destroy();
			}
		}
	}
	
	
	DigiCompass.Web.app.cost.Grid.getForm = function(callback, formData) {
		var combodata = [];
		for(var key in space.parameters){
			combodata.push([key, key]);
		}
		var formPanel = Ext.create('Ext.form.Panel', {
					xtype : 'form',
					id : 'RPTForm',
					border : 0,
					height : 240,
					width : 450,
					buttonAlign : 'center',
					fieldDefaults : {
						labelAlign : 'right',
						msgTarget : 'side',
						labelWidth : 200,
						margin : '10 0 0 0',
						allowBlank : false
					},
					items : [new DigiCompass.web.UI.ComboBox({
								name : 'formula',
								editable : false,
								id:'formula',
								fieldLabel : 'Computing Method',
								moduleType : 'MOD_BAND_FORMULA_PARAMETER',
								allowBlank : false,
								autoLoadByCometd :false,
								data : combodata,
								listeners : {
								select : function(combo, newValue) {
									clearForm(formPanel);
									initForm(formPanel,{
										values : formData.values,
										pValue : formData.pValue,
										formulaId : newValue[0].get('id')
									});
								}
							}
							}),{
								xtype : 'numberfield',
								fieldLabel : 'P(principal amount)',
								name : 'P',
								id : 'P',
								minValue:0,
								maxLength : 20
							}],
					buttons : [{
						xtype : 'button',
						text : 'save',
						iconCls : 'icon-save',
						handler : function() {
							if (formPanel.getForm().isValid()) {
								var formValues = formPanel.getForm().getValues();
								var params = space.parameters[formValues['formula']];
								var data = [];
								for(var i in params){
									data.push({formulaParameter : params[i], value : formValues[params[i]['name']]});
								}
								try{
									callback({values : data, pValue : formValues['P'], formulaId : formValues['formula']});
								}catch(e){
									console.error(e.message,e.stack)
								}
							} else {
								alertWarring('Every Field is required!');
							}
						}
					}]
				});
		initForm(formPanel, formData)
		return formPanel;
	}
	DigiCompass.Web.app.cost.Grid.closeWindow = function(windowId) {
		Ext.getCmp(windowId).colse();
	}
	DigiCompass.Web.app.cost.Grid.getWindow = function(position, formPanel) {
		var width = 450;
		var height = 240;
		var _position = DigiCompass.Web.app.cost.Grid.getXYPosition(
			{ x:position[0],
			  y:position[1]},
			{ 
			 width:width,
			 height:height});
		var window = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
					id : 'editWindows',
					x : _position.x,
					y : _position.y,
					title : 'Please input',
					height : height,
					width : width,
					layout : 'fit',
					items : formPanel
				});
		return window;
	}
})();