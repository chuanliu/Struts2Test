Ext.define('DigiCompass.Web.ux.EquipmentTypeInputForm',{
	extend : 'Ext.form.Panel',
	alias: 'widget.equipmenttypeform',
	type   : {
		Date    : 'Date',
		List    : 'List',
		Regex   : 'Regex',
		Boolean : 'Boolean',
	    LAC_TAC : 'LAC_TAC', 
	    SAC : 'SAC', 
	    NodeId : 'NodeId',    
	    CellId : 'CellId',
	    Vcid : 'Vcid'
	},
	unit : {
		Week  : 'WEEK',
		Day   : 'DAY',
		Year  : 'YEAR',
		Month : 'MONTH'
	},
	getTypeData : function(){
		var me = this;
		var type = me.type;
		var typeData = [];
		for(var key in type){
			typeData.push({
				id   : type[key],
				name : type[key]
			});
		}
		return typeData;
	},
	getDefaultDateByStr : function(_date){
		var date1 = Ext.Date.parse(_date,'Y-m-d'),
			date2 = Ext.Date.parse(_date,'Y-m'),
			date = date1 || date2 || new Date();
		return date;
	},
	initComponent : function() {
		var me = this;
		var type = me.property.type;
		var unit = me.property.type == me.type.Date ?me.property.requirement:'';
		var optional = me.property.optional;
		var multiple = me.property.multiple;
		var regex = me.property.type == me.type.Regex ? me.property.requirement:'';
		var defaultValue = me.property.value;
		var list = me.property.list ? me.property.list : [];
		var inputType = me.inputType;
		var proStringDefaultValueInput = Ext.get("proStringDefaultValue");
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
		var tmpChecked = "";
		var tmpCheckIndex = 0;
		var tmpCheckFlag = 1;
		
		var isChildModify = me.property.isChildModify;
		
		//添加自增行的空行
		for(var g=0; g<list.length; g++){
			list[g].index = ++tmpCheckIndex;
		}
		var flag = DigiCompass.Web.app.equipmentType.checkedStoreEmptyRecord(list);
		if(list.length == 0 || flag) {
			list.push({name : '', index : ++tmpCheckIndex});
		}
		var listStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name','isDefault', 'index'],
		    data: list,
		    listeners : {
		    	update:function(store){
		    		if(inputType){
		    			var f = ++tmpCheckFlag;
		    			setTimeout(function(){
		    				if(f == tmpCheckFlag && Ext.getCmp("proMultiple")){
		    					tmpCheckFlag++;
								var mu = Ext.getCmp("proMultiple").getValue();
								var flagMu = !!(mu && mu == "NO");
								var tmpL = [];
						    	var needToRemove = [];
						    	var checkIsRepeatName = [];
						    	for(var a=0; a<store.getCount(); a++){
						    		var d = store.getAt(a).data;
						    		if(d.isDefault) tmpL.push(d.index)
									var flag = true;
						    		for(var b in d){
						    			if(b != 'index' && d[b]){
						    				flag = false;
						    				break;
						    			}
						    		}
						    		if(flag || d.name.indexOf(",") > -1 || checkIsRepeatName.indexOf(d.name) > -1){
						    			needToRemove.push(a);
						    		}else{
						    			checkIsRepeatName.push(d.name);
					    			}
						    	}
								for(var a=0; a<needToRemove.length; a++){
									store.removeAt(needToRemove[a] - a);
								}
								store.insert(store.getCount(),{ name : '' , index : ++tmpCheckIndex});
								if(flagMu){
									if(tmpL.length > 1){
										for(var a=0; a<tmpL.length; a++){
											if(tmpL[a] != tmpChecked){
												tmpChecked = tmpL[a];
												break;
											}
										}
									}else if(tmpL.length){
										tmpChecked = tmpL[0];
									}else{
										tmpChecked = "";
									}
									for(var a=0; a<store.getCount(); a++){
										var ss = store.getAt(a);
										ss.set("isDefault", !!(tmpChecked && ss.data.index == tmpChecked))
										tmpCheckFlag++;
									}
								}
		    				}
		    			},100)
		    		}
		    	},
		    	load : function(s){
		    		tmpChecked = "";
		    		if(Ext.getCmp("proMultiple")){
			    		var mu = Ext.getCmp("proMultiple").getValue();
						var flagMu = !!(mu && mu == "NO");
			    		if(flagMu){
				    		for(var a=0; a<s.getCount(); a++){
					    		if(s.getAt(a).data.isDefault){
					    			tmpChecked = s.getAt(a).data.index;
					    			break;
					    		}
				    		}
				    		for(var a=0; a<listStore.getCount(); a++){
								var s = listStore.getAt(a);
								s.set("isDefault", (tmpChecked && tmpChecked == s.data.index));
							}
			    		}
			    	}
		    	}
		    }
		 });
		var _defualtOptional = "NO";
		me.items = [{
			margin 	     : '5px 0px 5px 0px',
			xtype	     : 'combo',
			fieldLabel   : 'Type ',
			displayField : 'name',
			valueField   : 'id',
			allowBlank   : false,
			editable     : false,
			value 		 : type,
			readOnly	 : !inputType || isChildModify,
			name		 : 'type',
			store        : {
				fields : ['id','name'],
				data   : me.getTypeData()
			},
			listeners : {
				change : function(){
					var type = this.getValue();
					me.showFields(type);
				}
			}
		},{
			xtype 	     : 'combo',
			id  	     : 'proRequired',
			allowBlank   : false,
			fieldLabel   : 'Required ',
			readOnly	 : !inputType,
			value 	     : optional ? (optional == "YES" ? "YES" : (optional == "NO" ? "NO" : _defualtOptional)) : _defualtOptional,
			name 	     : 'optional',
			displayField : 'name',
			valueField   : 'name',
			editable     : false,
			msgTarget    : 'side',
			store : {
				fields : ['name'],
				data   : [{ name : 'YES'},
				          { name : 'NO'}]
			}
		},{
			xtype 	   : 'textfield',
			id  	   : 'proRegex',
			allowBlank : false,
			fieldLabel : 'Regex ',
			readOnly	 : !inputType || isChildModify,
			value 	   : regex,
			maxLength  : UiProperties.nameMaxLength,
			msgTarget  : 'side',
			name 	   : 'regex'
		},{
			xtype   : 'combo',
			id      : 'proUnit',
			value 	   : multiple,
			readOnly	 : !inputType || isChildModify,
			allowBlank : false,
			fieldLabel : 'Unit ',
			value 	   : unit,
			displayField : 'name',
			valueField   : 'name',
			editable     : false,
			msgTarget  : 'side',
			name 	   : 'unit',
			store : {
				fields : ['name'],
				data   : [{ name : 'YEAR'},
				          { name : 'MONTH'},
				          { name : 'DAY'},
				          { name : 'WEEK'}]
			},
			listeners : {
				change : function(){
					var value = this.getValue();
					me.showDateFields(value);
				}
			}
		},{
			xtype   : 'combo',
			id      : 'proMultiple',
			value 	   : multiple,
			allowBlank : false,
			fieldLabel : 'Multiple ',
			readOnly	 : !inputType,
			displayField : 'name',
			valueField   : 'name',
			editable     : false,
			msgTarget  : 'side',
			name 	   : 'multiple',
			store : {
				fields : ['name'],
				data   : [{ name : 'YES'},{name : 'NO'}]
			},
			listeners : {
				change : function(){
					var mu = this.getValue();
					if(mu && mu == "NO"){
						for(var a=0; a<listStore.getCount(); a++){
							var s = listStore.getAt(a);
							s.set("isDefault", false);
						}
					}
					
				}
			}
		},{
			xtype 	   : 'combo',
			id    	   : 'proBooleanDefaultValue',
			value 	   : type == me.type.Boolean ? defaultValue : 'NO',
			fieldLabel : inputType ? 'Value' : 'Value ',
			displayField : 'name',
			valueField   : 'name',
			allowBlank   : false,
			editable     : false,
			name 		 : 'defaultValue',
			store        : {
				fields : ['name','name'],
				data   : [{name : 'YES'},
				          {name : 'NO'}]
			}
		},{
			xtype 	   : 'textfield',
			id    	   : 'proStringDefaultValue',
			value 	   : type == me.type.Regex ? defaultValue : '',
			allowBlank : false,
			//hidden 	   : !showString,
			msgTarget    : 'side',
			fieldLabel : inputType ? 'Value' : 'Value ',
			name 		 : 'defaultValue',
			vtype		: 'proStringDefaultValueRegexCheck',
			vtypeText   : 'Do not conform to the regex'
		},{
			xtype 	   : 'datefield',
			hidden     : unit == 'DAY' ? false : true,
			id    	   : 'proDateDefaultValue',
			format	   : 'Y-m-d',
			value 	   : me.getDefaultDateByStr(defaultValue),
			fieldLabel : inputType ? 'Value' : 'Value ',
			name 	   : 'defaultValue'
		},{
			xtype 	   : 'monthfield',
			hidden     : unit == 'MONTH' ? false : true,
			id    	   : 'proMonthDefaultValue',
			format	   : 'Y,F', 
			value 	   : me.getDefaultDateByStr(defaultValue),
			// fieldLabel : inputType ? 'Default Value' : 'Value ',
			fieldLabel : inputType ? 'Value' : 'Value ',
			name 	   : 'defaultValue'
		},{
			xtype  : 'container',
			layout : 'column',
			width  : 350,
			items  : [{
				xtype 	   : 'numberfield',
				hidden     : (unit == 'YEAR' || unit == 'WEEK') ? false : true,
				id    	   : 'proYearValue',
				value 	   : me.getYearDefaultValue(defaultValue, unit),
				width  	   : 170,
				minValue   : 1000,
				maxValue   : 9999,
				allowDecimals : false,
				fieldLabel : 'Year ',
				name 	   : 'year',
				listeners  : {
					change : function(){
						var value = this.getValue();
						var weekField = Ext.getCmp('proWeekValue');
						var weeks = 53;
						if(!Ext.isEmpty(value)){
							weeks = DigiCompass.Web.Util.getWeeks(value);
						}
						weekField.setMaxValue(weeks);
					}
				}
			},{
				xtype 	   : 'numberfield',
				hidden     : unit == 'WEEK' ? false : true,
				id    	   : 'proWeekValue',
				value 	   : me.getWeekDefaultValue(defaultValue, unit),
				width  	   : 170,
				minValue   : 1,
				maxValue   : 54,
				allowDecimals : false,
				fieldLabel : 'Week ',
				name 	   : 'week'
			}]
		},{
			id : 'proList',
			title : 'Options',
			border : false,
			collapsible: true,
			height : 'fit',
			xtype : 'grid',
			autoScroll : true,
			height : 140,
			selType : 'cellmodel',
			plugins : [cellEditing],
			store: listStore,
			columns : me.getColumns(inputType),
			listeners : {
				itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
				},
				itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
				}
			}
		}];
		me.buttons = [{
				xtype : 'button',
				text  : 'OK',
				width : 30,
				handler : function(){
					var form = Ext.getCmp('proForm').getForm();
					var datas = {};
					fields = form.getFields();
					fields.each(function(field){
						if(field.isVisible()){
							if(field.name == 'regex' || field.name == 'unit' ){
								datas['requirement'] = field.getValue();
							}
							else if(field.name == 'defaultValue'){
								datas.defaultValue = field.getValue();
							}
							else{
								datas[field.name] = field.getValue();
							}
						}
					});
					switch (datas.type){
					case "Regex":
						if(!datas.requirement) return Ext.getCmp("proRegex").focus() && Ext.getCmp("proRegex").blur();
						var reg = new RegExp(datas.requirement);
						if(!datas.defaultValue){
							
						}else if(!reg.test(datas.defaultValue)){
							try{
								proStringDefaultValueInput.focus() && Ext.getCmp('proRegex').focus();
							}catch(e){
							}
							return;
						}
						break;
					case "Date":
						if(!datas.requirement) return Ext.getCmp("proUnit").setValue("") && Ext.getCmp("proUnit").blur();
						break;
					case "List":
						if(!datas.multiple) return Ext.getCmp("proMultiple").setValue("") && Ext.getCmp("proMultiple").blur();
						break;
					}
					var listControl = Ext.getCmp('proList');
					var list = [];
					var requirement = '';
					var defaultValue  = '';
					if(listControl && listControl.isVisible()){
						var store = listControl.getStore();
						var count = store.getCount();
						var checkIsRepeatName = [];
						for(var i =0 ; i < count ;i++){
							var data = store.getAt(i).data;
							var name = data.name;
							if(Ext.isEmpty(name) || checkIsRepeatName.indexOf(name) > -1 || name.indexOf(",") > -1){
								continue;
							}
							checkIsRepeatName.push(name);
							var isDefault = data.isDefault;
							list.push({name: name, isDefault : isDefault});
							if(isDefault){
								if(Ext.isEmpty(defaultValue)){
									defaultValue = name;
								}
								else{
									defaultValue = defaultValue + ',' + name;
								}
							}
							if(i == 0){
								requirement = name;
							}
							else{
								requirement = requirement + ',' + name;
							}
						}
						datas.list = list;
						datas.requirement = requirement;
						datas.defaultValue = defaultValue;
					}
					var yearControl = Ext.getCmp('proYearValue');
					var weekControl = Ext.getCmp('proWeekValue');
					var dateControl = Ext.getCmp('proDateDefaultValue');
					var monthControl = Ext.getCmp('proMonthDefaultValue');
					if(yearControl.isVisible()){
						defaultValue = yearControl.getValue();
						if(weekControl.isVisible()){
							defaultValue = defaultValue +','+weekControl.getValue(); 
						}
						datas.defaultValue = defaultValue;
					}
					if(dateControl.isVisible()){
						 var _date = dateControl.getValue();
						 var _year = _date.getFullYear();
						 var _month = _date.getMonth() + 1;
						 datas.defaultValue = _year + '-' + (_month < 10 ? '0':'' )+ _month + '-' + _date.getDate();
					}
					if(monthControl.isVisible()){
						var _date = monthControl.getValue();
						var _year = _date.getFullYear();
						var _month = _date.getMonth() + 1;
						datas.defaultValue = _year + '-' + (_month < 10 ? '0':'' )+ _month;
					}
					me.fireEvent('buttoncallback',datas);
				}
			}];
		me.addEvents('buttoncallback');
		me.callParent(arguments);
		me.showFields(type);
	},
	showFields : function(type){
		var me = this;
		var regex = Ext.getCmp('proRegex');
		var unit = Ext.getCmp('proUnit');
		var multiple = Ext.getCmp('proMultiple');
		var booleanDafault = Ext.getCmp('proBooleanDefaultValue');
		var stringDefault = Ext.getCmp('proStringDefaultValue');
		var list = Ext.getCmp('proList');
		
		if(type == me.type.List){
			me.showDateFields();
			if(regex)
				regex.setVisible(false);
			if(unit)
				unit.setVisible(false);
			if(multiple)
				multiple.setVisible(true);
			if(booleanDafault)
				booleanDafault.setVisible(false);
			if(stringDefault)
				stringDefault.setVisible(false);
			if(list)
				list.setVisible(true);
		}else if(type == me.type.Boolean){
			me.showDateFields();
			if(regex)
				regex.setVisible(false);
			if(unit)
				unit.setVisible(false);
			if(multiple)
				multiple.setVisible(false);
			if(booleanDafault)
				booleanDafault.setVisible(true);
			if(stringDefault)
				stringDefault.setVisible(false);
			if(list)
				list.setVisible(false);
		}else if(type == me.type.Regex){
			me.showDateFields();
			if(regex)
				regex.setVisible(true);
			if(unit)
				unit.setVisible(false);
			if(multiple)
				multiple.setVisible(false);
			if(booleanDafault)
				booleanDafault.setVisible(false);
			if(stringDefault)
				stringDefault.setVisible(true);
			if(list)
				list.setVisible(false);
		}else if(type == me.type.Date){
			me.showDateFields(unit.getValue());
			if(regex)
				regex.setVisible(false);
			if(unit)
				unit.setVisible(true);
			if(multiple)
				multiple.setVisible(false);
			if(booleanDafault)
				booleanDafault.setVisible(false);
			if(stringDefault)
				stringDefault.setVisible(false);
			if(list)
				list.setVisible(false);
		}else if(type == me.type.LAC_TAC || 
				type == me.type.SAC || type == me.type.NodeId 
				|| type == me.type.CellId || type == me.type.Vcid){
			var proReq = Ext.getCmp("proRequired");
			proReq.setValue('YES');
			proReq.setReadOnly(true);
			
			if(regex)
				regex.setVisible(false);
			if(unit)
				unit.setVisible(false);
			if(multiple)
				multiple.setVisible(false);
			if(booleanDafault)
				booleanDafault.setVisible(false);
			if(stringDefault)
				stringDefault.setVisible(true);
			if(list)
				list.setVisible(false);
		}else {
			//Other condition
		}
	},
	showDateFields : function(unit){
		var dateDefault = Ext.getCmp('proDateDefaultValue');
		var monthDefault = Ext.getCmp('proMonthDefaultValue');
		var week = Ext.getCmp('proWeekValue');
		var year = Ext.getCmp('proYearValue');
		if(dateDefault && unit == 'DAY')
			dateDefault.setVisible(true);
		else{
			dateDefault.setVisible(false);
		}
		if(monthDefault && unit == 'MONTH')
			monthDefault.setVisible(true);
		else{
			monthDefault.setVisible(false);
		}
		if(week && unit == 'WEEK'){
			week.setVisible(true);
		}else{
			week.setVisible(false);
		}
		if(year && unit == 'YEAR')
			year.setVisible(true);
		else if(year && unit == 'WEEK'){
			year.setVisible(true);
		}else
			year.setVisible(false);
	},
	getYearDefaultValue : function (defaultValue, unit){
		if(unit == 'YEAR')
			return defaultValue;
		else if(unit == 'WEEK'){
			if(Ext.isEmpty(defaultValue))
				return new Date().getFullYear();
			else
				return defaultValue.split(',')[0];
		}
		else
			return new Date().getFullYear();
	},
	getWeekDefaultValue : function(defaultValue, unit){
		if(unit == 'WEEK'){
			if(Ext.isEmpty(defaultValue))
				return DigiCompass.Web.Util.getWeekNumber(new Date().toString())[1];
			else
				return defaultValue.split(',')[1];
		}
		else
			return DigiCompass.Web.Util.getWeekNumber(new Date().toString())[1];
	},
	getColumns : function(inputType){
		var columns = [{
			header : 'Name',
			dataIndex : 'name',
			flex : 6,
			editor : {
				allowBlank : false,
				maxLength  : UiProperties.stringValueMaxLength
			}
		},{
			xtype: 'checkcolumn',
			header: 'Selected',
            dataIndex: 'isDefault',
			width : 75,
            stopSelection: false
		}];
		if(inputType){
			columns.push({
				flex : 1,
	            menuDisabled: true,
	            xtype: 'actioncolumn',
	            tooltip: 'delete',
	            align: 'center',
	            items: [{
	                icon: './styles/cmp/images/delete.png',  
	                scope: this,
	                getClass: function(value,meta,record,rowIx,colIx, store) {
	                    return 'x-hide-display';  //Hide the action icon
	                },
		            handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
		            	if(rowIndex == grid.getStore().getCount() - 1) return;
		            	var store = grid.getStore();
		            	store.removeAt(rowIndex);
		            }
	            }]
			});
	    }
		return columns;
	}
})
Ext.apply(Ext.form.VTypes,{
    proStringDefaultValueRegexCheck : function(val){
		if(Ext.getCmp("proRegex").getValue){
	        var reg = new RegExp(Ext.getCmp("proRegex").getValue());
	        if(reg){
	        	return reg.test(val);
	        }
		}
        return true;
    }
});  
