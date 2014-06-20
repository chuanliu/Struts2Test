Ext.define('DigiCompass.Web.ux.EquipmentInputForm',{
	extend : 'Ext.form.Panel',
	alias: 'widget.equipmentform',
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
	}, getDefaultDateByStr : function(_date){
		var date1 = Ext.Date.parse(_date,'Y-m-d'),
			date2 = Ext.Date.parse(_date,'Y-m'),
			date = date1 || date2 || new Date();
		return date;
	}, initComponent : function() {		
		var me = this;
		var propGrid = Ext.getCmp('equipmentTypePropertyGrid');
		var store = propGrid.getStore();
		var siteNumber = propGrid.site;
		var technology;
		var band;
		var sectorNum;
		var groupId;
		var cellType;
		var lac_tac;
		var cellId;
		store.each(function(record){
			if(record.get("name") === 'Technology'){
				technology = record.get('value');				
			}
			if(record.get("name") === 'Band'){
				band = record.get('value');				
			}
			if(record.get("name") == 'Sector Number'){
				sectorNum = record.get('value');
			}
			if(record.get('name') == 'Group Id'){
				groupId = record.get('value');
			}
			if(record.get('name') === 'Cell Type'){
				cellType = record.get('value');
			}
			if(record.get('type') === 'LAC_TAC'){
				lac_tac = record.get('value');
			}
			if(record.get('type') === 'CellId'){
				cellId = record.get('value');
			}
		});
		
		var me = this;
		var data = me.property;
		var items = [];
		for(var i = 0 ; i< data.length ;i++){
			var type = data[i].type;
			var value = data[i].defaultValue || data[i].value;
			var control;
			if(data[i].name == 'Group Id'){
				control = me.getGroupIdField(technology, data[i].name, value, data[i].list);
			} else if(data[i].name === 'Cell Type'){
				control = me.getCellTypeField(technology, data[i].name, value, data[i].list);
			} else if(type == me.type.Boolean){
				control = me.getBooleanField(data[i].name,value);
			}else if(type == me.type.Regex){
				control = me.getRegexField(data[i].name,value);
			}else if(type == me.type.List){
				if(data[i].multiple && data[i].multiple == "NO"){
					control = me.getComboxField(data[i].name, value, data[i].list);
				}else{
					control = me.getBoxSelectField(data[i].name, value, data[i].list);
					me.height = 120;
				}
			}else if(type == me.type.Date){
				var unit = data[i].requirement;
				if(unit == me.unit.Year){
					control = me.getYearField(data[i].name,value);
				}else if(unit == me.unit.Day){
					control = me.getDayField(data[i].name,value);
				}else if (unit == me.unit.Month){
					control = me.getMonthField(data[i].name,value);
				}else if(unit == me.unit.Week){
					control = me.getWeekField(data[i].name,value,data[i].id);
				}
			}
			
			if(type == me.type.LAC_TAC){				
				control = me.getLacTacField(groupId, cellType, technology, band, data[i].name, value);
			} else if(type === me.type.SAC){
				control = me.getSACField(data[i].name, value, siteNumber, sectorNum, technology);
			} else if(type === me.type.NodeId){
				control = me.getNodeIdField(technology, groupId, cellType, band, siteNumber, data[i].name, value);
			} else if(type === me.type.CellId){				
				control = me.getCellIdField(technology, band, cellType, groupId, siteNumber, sectorNum, data[i].name, value);
			} else if(type === me.type.Vcid){
				control = me.getVcidField(lac_tac, cellId);
			}					
			if(control){
				control.allowBlank = me.getAllowBlank(data[i].optional || data[i].required);
				control.id = data[i].id || data[i].wid;
				items.push(control);
			}
		}
		var buttons = [{
			xtype : 'button',
			text  : 'OK',
			margin : '5 0 0 160',
			width : 75,
			height : 22,
			handler : function(){
				var form = me.getForm();
				if(!form.isValid()){
					return;
				}
				var datas = me.property;
				var fields = form.getFields().items;
				var values = {};
				for(var i = 0 ; i<fields.length ; i++){
					values[fields[i].getId()] = fields[i].getValue();
				}
				for(var i = 0 ; i<datas.length ; i++){
					if(datas[i].type == me.type.Date && datas[i].requirement == me.unit.Week){
						datas[i].defaultValue = values[(datas[i].id || datas[i].wid) + 'year'] + ',' + values[(datas[i].id || datas[i].wid) + 'week'];
					}else if(datas[i].type == me.type.Date && datas[i].requirement == me.unit.Month){
						datas[i].defaultValue = Ext.Date.format(values[datas[i].id || datas[i].wid] ,'Y-m');
					}else if(datas[i].type == me.type.Date && datas[i].requirement == me.unit.Day){
						datas[i].defaultValue = Ext.Date.format(values[datas[i].id || datas[i].wid] ,'Y-m-d');
					}else if(data[i].type == me.type.Regex){
						var reg = new RegExp(data[i].requirement);
						datas[i].defaultValue = values[datas[i].id || datas[i].wid];
						if(data[i].defaultValue && !reg.test(data[i].defaultValue)){
							fields[0].setValue("");
							return;
						}
					} else if(data[i].type == me.type.LAC_TAC){
						datas[i].defaultValue = Ext.getCmp("lacTacVal").getValue();
					} else if(data[i].type == me.type.CellId){
						datas[i].defaultValue = Ext.getCmp("cellIdVal").getValue();
					} else if(data[i].type == me.type.NodeId){
						datas[i].defaultValue = Ext.getCmp("nodeIdVal").getValue();						
					} else {
						datas[i].defaultValue = values[datas[i].id || datas[i].wid];
						if(datas[i].defaultValue.join) datas[i].defaultValue = datas[i].defaultValue.join(",");
						if(datas[i].type == me.type.List && data[i].multiple && data[i].multiple == "NO"){
							var tmpF = [];
							var _tmp = datas[i].list;
							for(var j=0; j<_tmp.length; j++){
								tmpF.push(_tmp[j].name);
							}
							if(tmpF.indexOf(datas[i].defaultValue) == -1) return;
						}
					}
				}
				me.fireEvent('buttoncallback',datas);
			}
		}];
		me.items = items.concat(buttons);
		me.addEvents('buttoncallback');
		me.callParent(arguments);
	},getAllowBlank : function(required){
		if(required && required == 'YES'){
			return false;
		}else{
			return true;
		}
	},
	getBooleanField : function(name,value){
		if(Ext.isEmpty(value)){
			value = 'NO';
		}
		return {
			margin     : '5 0 0 0',
			xtype 	   : 'combo',
			value 	   :  value,
			fieldLabel : name + '\'s Value',
			displayField : 'name',
			valueField   : 'name',
			allowBlank   : false,
			editable     : false,
			name 		 : name,
			store        : {
				fields : ['name','name'],
				data   : [{name : 'YES'},
				          {name : 'NO'}]
			}
		};
	},getRegexField : function(name ,value){
		return {
			margin     : '5 0 0 0',
			xtype 	   : 'textfield',
			allowBlank : false,
			fieldLabel : name + '\'s Value',
			value 	   : value,
			maxLength  : UiProperties.nameMaxLength,
			msgTarget  : 'side',
		}
	},getYearField : function(name ,value){
		var me = this;
		return {
			margin     : '5 0 0 0',
			xtype 	   : 'numberfield',
			value 	   : me.getYearDefaultValue(value, 'YEAR'),
			width  	   : 170,
			minValue   : 1000,
			maxValue   : 9999,
			allowDecimals : false,
			fieldLabel : name + '\'s Year',
			name 	   : name
		};
	},getWeekField : function(name , value, id){
		var me = this;
		return {
			id 		   : id,
			margin     : '5 0 0 0',
			xtype  : 'container',
			name   : name,
			layout : 'column',
			width  : 350,
			items  : [{
				xtype 	   : 'numberfield',
				value 	   : me.getYearDefaultValue(value, 'YEAR'),
				width  	   : 170,
				minValue   : 1000,
				maxValue   : 9999,
				allowDecimals : false,
				fieldLabel : name + '\'s Year ',
				id 		   : id + 'year',
				name 	   : 'yearAndMonth',
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
				id 		   : id + 'week',
				value 	   : me.getWeekDefaultValue(value, 'WEEK'),
				width  	   : 170,
				minValue   : 1,
				maxValue   : 54,
				allowDecimals : false,
				fieldLabel : name + '\'s Week ',
				name 	   : 'week'
			}]
		};
	},getMonthField : function(name ,value){
		var me = this;
		return {
			margin     : '5 0 0 0',
			xtype 	   : 'monthfield',
			format	   : 'Y,F', 
			value 	   : me.getDefaultDateByStr(value),
			fieldLabel : name + '\'s Month ' ,
			name 	   : name
		};
	},getDayField : function(name ,value){
		var me = this;
		return {
			margin     : '5 0 0 0',
			xtype 	   : 'datefield',
			format	   : 'Y-m-d',
			value 	   : me.getDefaultDateByStr(value),
			fieldLabel : name + '\'s Day ',
			name 	   : name
		};
	},getBoxSelectField : function(name ,value ,storeData){
		var datas = [];
		for(var i = 0 ; i<storeData.length ;i++){
			datas.push(storeData[i]);
		}
		if(!Ext.isArray(value)){
			value = value.split(",");
		}
        return {
        	margin     : '20 0 0 0',
        	xtype : 'boxselect',
        	fieldLabel : name + '\'s Value',
        	displayField: 'name',
        	valueField: 'name',
        	emptyText: 'Pick a record',
        	height : 65,
        	store: {
	    		fields : ['name'],
				data   : datas
        	},
        	queryMode: 'local',
        	value : value
        };
	},getComboxField : function(name ,value ,storeData){
		if(Ext.isArray(value)){
			value = value[0];
		}
		var datas = [];
		for(var i = 0 ; i<storeData.length ;i++){
			datas.push(storeData[i]);
		}
        return {
        	margin     : '5 0 0 0',
        	xtype : 'combo',
        	fieldLabel : name + '\'s Value',
        	displayField: 'name',
        	valueField: 'name',
        	store: {
	    		fields : ['name'],
				data   : datas
        	},
        	queryMode: 'local',
        	editable : false,
        	value : value
        };
	},getYearDefaultValue : function (defaultValue, unit){
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
	},getWeekDefaultValue : function(defaultValue, unit){
		if(unit == 'WEEK'){
			if(Ext.isEmpty(defaultValue))
				return DigiCompass.Web.Util.getWeekNumber(new Date().toString())[1];
			else
				return defaultValue.split(',')[1];
		}
		else
			return DigiCompass.Web.Util.getWeekNumber(new Date().toString())[1];
	},
	getLacTacField : function(groupId, cellType, technology, band, name, value){
		return {
			xtype : 'container',
			margin : '10 0 0 0',
			items : [{
						id : 'lacTacLast',
						xtype : 'container',
						layout : 'hbox',
						items : [
						    {
						    	id : 'last3x',
						    	xtype : 'numberfield',
						    	allowBlank : false,
						    	minLength : 3,
						    	maxLength : 3,
						    	fieldLabel : 'Last 3x'
						    },{
						    	xtype : 'button',
						    	margin : '0 0 5 20px',
						    	text : 'Assign',
						    	handler : function(){						    		
						    		var last3xEl = Ext.getCmp("last3x");
						    		if(last3xEl.validate()){				    		
										if(technology == null || technology == ""){
											Ext.Msg.alert('Failure', 'before this please select Technology');
											return;
										}			
										if(groupId == null || groupId == ""){
											Ext.Msg.alert('Failure', 'before this please select Group Id');
											return;
										}
										if(cellType == null || cellType == ""){
											Ext.Msg.alert('Failure', 'before this please select Cell Type');
											return;
										}
										if((technology == 'LTE') && (band == null || band == "")){
											Ext.Msg.alert('Failure', '4g please select Band');
											return;
										}
							    		var last3x = last3xEl.getValue();
										cometdfn.request({
											MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
											COMMAND : 'genLacTac',
											technology : technology,
											groupId : groupId,
											band : band,
											cellType : cellType,
											last3x : last3x
										}, function(message) {
											var data = message['BUSINESS_DATA'];
											Ext.getCmp("lacTacVal").setValue(data);
										});
						    		}
						    	}
						    }
						]
					},
			 		{
						id : 'lacTacVal',
						name : 'defaultValue',
						xtype : 'textfield',
						fieldLabel : 'Value',
						value : value,
						readOnly : true
					}
			]
		};
	},
	getSACField : function(name, value, siteNumber, sectorNum, technology){
		var sacField = Ext.widget({
			margin : '10 0 0 0',
			xtype : 'textfield',
			fieldLabel : name + '\'s Value',
			id : 'sacValId',
			name : 'defaultValue',
			value : value,
			allowBlank : false
		});
		if(value == null || value === ''){
			cometdfn.request({
				MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
				COMMAND : 'getSac',
				siteNumber : siteNumber,
				sectorNum : sectorNum,
				technology : technology
			}, function(message) {
				var data = message['BUSINESS_DATA'];								
				sacField.setValue(data);
			});									
		}
		return sacField;
	},
	getNodeIdField: function(technology, groupId, cellType, band, siteNumber, name, value){
		var items = [
					    Ext.create('DigiCompass.web.UI.ComboBox',{
					    	id : "nodeIdVal",
							moduleType : 'MOD_EQUIPMENT_TEMPLATEV2',								
							moduleCommand : 'getNodeIdList',
							fieldLabel : 'Value',
							value : value,
							editable : true,
							whereValue : {
								siteNumber : siteNumber,
								technology : technology
							},
							parseData : function(message){
								var data = message['BUSINESS_DATA'];
								var d = [];
								for(var i in data){
									d.push([data[i].NE_ID, data[i].NE_ID]);
								}
								return d;
							}
						})
					];
		if(technology != 'GSM'){
			items.push({
		    	xtype : 'button',
		    	margin : '0 0 5 5px',
		    	text : 'Assign',		    	
		    	handler : function(){
					if(technology == null || technology == ""){
						Ext.Msg.alert('Failure', 'before this please select Technology');
						return;
					}			
					if(groupId == null || groupId == ""){
						Ext.Msg.alert('Failure', 'before this please select Group Id');
						return;
					}
					if(technology == 'LTE'){
						if(cellType == null || cellType == ""){
							Ext.Msg.alert('Failure', '4g please select Cell Type');
							return;
						}
						if(band == null || band == ""){
							Ext.Msg.alert('Failure', '4g please select Band');
							return;
						}
					}
					cometdfn.request({
						MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
						COMMAND : 'genNodeId',
						technology : technology,
						groupId : groupId,
						celltype : cellType,
						band : band
					}, function(message) {
						var data = message['BUSINESS_DATA'];
						Ext.getCmp("nodeIdVal").setValue(data);
					});						    		
		    	}
		    });
		}
		return {
			id : 'nodeIdValPanel',
			xtype : 'container',
			layout : 'hbox',
			margin : '10 0 0 0',
			items : items	
		}
	},
	getCellIdField: function(technology, band, cellType, groupId, siteNumber, sector, name, value){
		var items = [			    
		 Ext.create('DigiCompass.web.UI.ComboBox',{
	    	id : "cellIdVal",
			moduleType : 'MOD_EQUIPMENT_TEMPLATEV2',								
			moduleCommand : 'getCellIdList',
			fieldLabel : 'Value',
			editable : true,
			value : value,
			whereValue : {
				siteNumber : siteNumber
			},
			parseData : function(message){
				var data = message['BUSINESS_DATA'];
				var d = [];
				for(var i in data){
					d.push([data[i].CELL_ID, data[i].CELL_ID]);
				}
				return d;
			}
		})];
		if(technology != 'GSM'){
			items.push({
		    	xtype : 'button',
		    	margin : '0 0 5 5px',
		    	text : 'Assign',
		    	handler : function(){
		    		if(technology == null || technology == ""){
						Ext.Msg.alert('Failure', 'before this please select Technology');
						return;
					}			    		
		    		if(groupId == null || groupId == ""){
						Ext.Msg.alert('Failure', 'before this please select Group Id');
						return;
					}
					if(technology == 'LTE'){
						if(cellType == null || cellType == ""){
							Ext.Msg.alert('Failure', '4g please select Cell Type');
							return;
						}
						if(band == null || band == ""){
							Ext.Msg.alert('Failure', '4g please select Band');
							return;
						}
						if(siteNumber == null || siteNumber == ""){
							Ext.Msg.alert('Failure', '4g please select Site Number');
							return;
						}
						if(sector == null || sector == ""){
							Ext.Msg.alert('Failure', '4g please select Sector');
							return;
						}
					}
					cometdfn.request({
						MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
						COMMAND : 'genCellId',
						technology : technology,
						groupId : groupId,
						celltype : cellType,
						band : band,
						site_id : siteNumber,
						sector_name : sector,
					}, function(message) {
						var data = message['BUSINESS_DATA'];
						Ext.getCmp("cellIdVal").setValue(data);
					});			    		
		    	}
		    });
		}
		// Cell Id
		return {
			id : 'cellIdValPanel',
			xtype : 'container',
			margin : '10 0 0 0',
			layout : 'hbox',
			items : items		
		}
	},
	getVcidField : function(lac_tac, cellId, value){
 		return {
 			margin : '10 0 0 0',
			id : 'vcIdVal',
			name : 'defaultValue',
			xtype : 'textfield',
			fieldLabel : 'Value',
			value : lac_tac + cellId,
			readOnly : true
		}
	},
	getGroupIdField : function(technology, name, value, storeData){
		if(Ext.isArray(value)){
			value = value[0];
		}
		var datas = [];
		for(var i = 0 ; i<storeData.length ;i++){
			datas.push(storeData[i]);
		}
		
		if(technology === "LTE"){
			datas.splice(datas.indexOf('Test'), 1);
			datas.splice(datas.indexOf('State Border'), 1);
		}
		
        return {
        	margin     : '5 0 0 0',
        	xtype : 'combo',
        	fieldLabel : name + '\'s Value',
        	displayField: 'name',
        	valueField: 'name',
        	store: {
	    		fields : ['name'],
				data   : datas
        	},
        	queryMode: 'local',
        	editable : false,
        	value : value
        };
	},	
	getCellTypeField : function(technology, name, value, storeData){
		if(Ext.isArray(value)){
			value = value[0];
		}
		var datas = [{name : "Small Cell"}];
		
		if(technology === "GSM"){
			datas.push({name : "GSM"});
		} else if(technology === "UMTS"){
			datas.push({name : "UMTS"});
		} else if(technology === "LTE"){
			datas.push({name : "Macro"});
		}
		
        return {
        	margin     : '5 0 0 0',
        	xtype : 'combo',
        	fieldLabel : name + '\'s Value',
        	displayField: 'name',
        	valueField: 'name',
        	store: {
	    		fields : ['name'],
				data   : datas
        	},
        	queryMode: 'local',
        	editable : false,
        	value : value
        };
	}
})