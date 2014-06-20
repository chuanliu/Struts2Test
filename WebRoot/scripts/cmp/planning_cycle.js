(function() {
	/**
	 * PlanningCycle js
	 */
	Ext.namespace('DigiCompass.Web.app.planningCycle');
	DigiCompass.Web.app.planningCycle.delPlanningCycle = function(
			planningCycleIds) {
		var message = {};
		message.planningCycleIds = planningCycleIds;
		message.MODULE_TYPE = 'MOD_PLANNING_CYCLE';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.publish(message);
	}
	DigiCompass.Web.app.planningCycle.checkRow = [];
	DigiCompass.Web.app.planningCycle.chek_box = function(check,event,id){
		if(check.checked){
			DigiCompass.Web.app.planningCycle.checkRow.push(id);
		}else{
			var checkeds = DigiCompass.Web.app.planningCycle.checkRow;
			for(var i = 0 ; i <checkeds.length ; i++){
				if(checkeds[i] == id){
					checkeds.splice(i,1);
				}
			}
		}
		event = event || window.event;
		event.stopPropagation();
	}
	DigiCompass.Web.app.planningCycle.getList = function(data, config) {
		DigiCompass.Web.app.planningCycle.checkRow = [];
		var fields = ['id', 'version','startDate','endDate','reference'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Version',
						dataIndex : 'version',
						//sortable : false,
						width : 130
					},{
						header : 'Start Date',
						dataIndex : 'startDate',
						renderer:Ext.util.Format.dateRenderer('Y-m-d'),
						//sortable : false,
						width : 130
					},{
						header : 'End Date',
						renderer:Ext.util.Format.dateRenderer('Y-m-d'),
						dataIndex : 'endDate',
						//sortable : false,
						width : 130
					},{
						header : 'Reference',
						dataIndex : 'reference',
						//sortable : false,
						width : 80
					}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		
		if (Ext.getCmp('planningCycleListView')) {
			Ext.getCmp('planningCycleListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				fields:fields,
				width:'fit',
				height:735,
				data:[],
				listeners : {
					itemclick : DigiCompass.Web.app.planningCycle.clickFunction
				}
			});
			objectExplorer.on('checkchange', function(node, checked) {      
				objectExplorer.checkchild(node,checked);  
				objectExplorer.checkparent(node);  
	    	}); 
			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
				width:'fit',
				height:722,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'planningCycleListView',
				module:'MOD_PLANNING_CYCLE',
				command:'COMMAND_QUERY_LIST',
				otherParam:{},
				layout:'border',
				width:50,
				region:'west',
				height:530,
				objectExplorer:objectExplorer,
				catalogue:catalogue,
				hidden:true
			});
			mainPanel.reconfigData(datas);
			
			var objExpPanel = Ext.getCmp('obj-exp');
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}
			var cataloguePanel = Ext.getCmp('obj-cat');
			if (cataloguePanel) {
				// 移除组建
				cataloguePanel.removeAll();
			}
			function getTbar(){
				return Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							// 展示右边面板
							DigiCompass.Web.UI.Wheel.showDetail();
							
							// 创建自己的Panel
							var formPanel = DigiCompass.Web.app.planningCycle
									.addFormPanel(null);
							// 将Panel添加在右边Panel上
							Ext.getCmp('obj-details').add(formPanel);
							//formPanel.setTitle('Object Detail - Planning Cycle');
							UiFunction.setTitle('planningCyclePanel', 'Planning Cycle');
							formPanel.back.setValues({versionId : ''});
							DigiCompass.Web.app.planningCycle.cleanFormData();

						}
					}, {
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							var checkeds = new Array();
							var selected = objectExplorer.getChecked();
							for(var i = 0 ; i <selected.length ; i++){
								checkeds.push(selected[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
							} else {
								DigiCompass.Web.app.planningCycle.delPlanningCycle(checkeds);
							}
						}
					}]
				});
			}
			objectExplorer.addDocked(getTbar());
			objExpPanel.add(objectExplorer);
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			/*var sm = Ext.create('Ext.selection.CheckboxModel', {
						checkOnly : false
					});
			var grid = Ext.create('Ext.grid.Panel', {
				id : 'planningCycleListView',
				title : 'PlanningCycle',
				tbar : [],
				//selModel : sm,
				store : myStore,
				height : 700,
				columns : columns,
				tbar : [{
					xtype : 'button',
					text : 'New',
					iconCls : 'icon-add',
					handler : function() {
						// 展示右边面板
						DigiCompass.Web.UI.Wheel.showDetail();
						
						// 创建自己的Panel
						var formPanel = DigiCompass.Web.app.planningCycle
								.addFormPanel(null);
						// 将Panel添加在右边Panel上
						Ext.getCmp('obj-details').add(formPanel);
						DigiCompass.Web.app.planningCycle.cleanFormData();

					}
				}, {
					xtype : 'button',
					text : 'Delete',
					iconCls : 'icon-delete',
					handler : function() {
						var checkeds = DigiCompass.Web.app.planningCycle.checkRow;
						if (checkeds.length == 0) {
							alertWarring('Please select a record!');
						} else {
							DigiCompass.Web.app.planningCycle.delPlanningCycle(checkeds);
						}
					}
				}]
			});
			*/
			// 展示右边面板
			DigiCompass.Web.UI.Wheel.showDetail();

			// 创建自己的Panel
			//var formPanel = DigiCompass.Web.app.planningCycle.addFormPanel();
			// 将Panel添加在右边Panel上
			//Ext.getCmp('obj-details').add(formPanel);
		}
	};
	DigiCompass.Web.app.planningCycle.clickFunction = function(grid, record, rowEl){
		var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		if(isChecked){
			return;
		}
		if(Ext.isEmpty(record.data.id)){
			return;
		}
		var planningCycleId = record.data.id;
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();

		// 创建自己的Panel
		var formPanel = DigiCompass.Web.app.planningCycle
				.addFormPanel(planningCycleId);
		//formPanel.setTitle('Object Detail - Planning Cycle ('+record.data.version+')');
		UiFunction.setTitle('planningCyclePanel', 'Planning Cycle', record.data.version);
		formPanel.back.setValues({versionId : record.data.id});
		// 将Panel添加在右边Panel上
		Ext.getCmp('obj-details').add(formPanel);
	}
	function formatDateYmd(date){
		 return Ext.util.Format.date(date,'Y-m-d') 
	}
	function getCurrentMonthDates(date){
		var nextMonth = Ext.clone(date);
		nextMonth.setDate(1);
		nextMonth.setMonth(nextMonth.getMonth() + 1);
		return (nextMonth - date)/(24*60*60*1000) + date.getDate() - 1;
	}
	DigiCompass.Web.app.planningCycle.assembleData = function(startValue,itemsCount, type) {
		var datas = [];
		var startDate = startValue;
		var endDate;
		if (type == 'Year') {
			var flag = false;
			var month = startDate.getMonth();
			for (var i = 1; i <= itemsCount; i++) {
				endDate = Ext.clone(startDate);
				endDate.setFullYear(endDate.getFullYear() + 1);
				if(flag || endDate.getDate() != startDate.getDate()){
					if(endDate.getDate() == startDate.getDate()){
						endDate.setDate(1);
						endDate.setMonth(endDate.getMonth() + 1);
					}
					flag = true;
					var currentMonthDates = getCurrentMonthDates(startDate);
					var devDate = currentMonthDates - startDate.getDate();
					endDate.setDate(1);
					endDate = new Date(endDate.getTime() - (2 + devDate)*24*60*60*1000);
				}
				else{
					endDate = new Date(endDate.getTime() - 24*60*60*1000);
				}
				datas.push(['',i.toString(), 'Year'+i.toString() , formatDateYmd(Ext.clone(startDate)) , formatDateYmd(Ext.clone(endDate))]);
				startDate = new Date(endDate.getTime() + 24*60*60*1000);
			}
		} 
		else if (type == 'Quarter') {
			var flag = false;
			var startDate = startValue;
			var endDate;
			for (var i = 1; i <= itemsCount; i++) {
				endDate = Ext.clone(startDate);
				var month = startDate.getMonth() + 3;
				var add = parseInt(month/12);
				var year = startDate.getFullYear() + (month%12 == 0 ? add - 1 : add);
				month = month % 12 == 0 ? 11 : month % 12;
				endDate.setFullYear(year);
				endDate.setMonth(month);
				if(flag || endDate.getDate() != startDate.getDate()){
					if(endDate.getDate() == startDate.getDate()){
						endDate.setDate(1);
						endDate.setMonth(endDate.getMonth() + 1);
					}
					flag = true;
					var currentMonthDates = getCurrentMonthDates(startDate);
					var devDate = currentMonthDates - startDate.getDate();
					endDate.setDate(1);
					endDate = new Date(endDate.getTime() - (2 + devDate)*24*60*60*1000);
					//endDate.setDate(1);
				}
				else{
					endDate = new Date(endDate.getTime() - 24*60*60*1000);
				}
				datas.push(['',i.toString(),'Quarter'+i.toString() , formatDateYmd(Ext.clone(startDate)), formatDateYmd(Ext.clone(endDate))]);
				startDate = new Date(endDate.getTime() + 24*60*60*1000);
			}
		} 
	else {
			var length = itemsCount-1;
			var startDate = startValue;
			var endDate;
			var flag = false
			for (var i = 1; i <= length + 1; i++) {
				endDate = Ext.clone(startDate);
				var month = startDate.getMonth() + 1;
				if(month == 12){
					endDate.setFullYear(startDate.getFullYear() + 1);
					endDate.setMonth(0);
				}
				else{
					endDate.setMonth(month);
				}
				if(flag || endDate.getDate() != startDate.getDate()){
					if(endDate.getDate() == startDate.getDate()){
						endDate.setDate(1);
						endDate.setMonth(endDate.getMonth() + 1);
					}
					flag = true;
					var currentMonthDates = getCurrentMonthDates(startDate);
					var devDate = currentMonthDates - startDate.getDate();
					endDate.setDate(1);
					endDate = new Date(endDate.getTime() - (2 + devDate)*24*60*60*1000);
					//endDate.setDate(1);
				}
				else{
					endDate = new Date(endDate.getTime() - 24*60*60*1000);
				}
				datas.push(['',i.toString(), 'Month' + i.toString(), formatDateYmd(Ext.clone(startDate)), formatDateYmd(Ext.clone(endDate))]);
				startDate = new Date(endDate.getTime() + 24*60*60*1000);
			}
		}
		return datas;
	}
	DigiCompass.Web.app.planningCycle.cleanFormData = function(){
		if(Ext.getCmp('planningCycleAdd')){
			Ext.getCmp('planningCycleAdd').getForm().reset();
		}
		if(Ext.getCmp('planningCycleItemsGrid')){
			Ext.getCmp('planningCycleItemsGrid').getStore().loadData([]);
		}
	}
	DigiCompass.Web.app.planningCycle.displayField = function(value,text,name){
		return Ext.creat('Ext.form.field.DisplayView',{
			fieldLabel: text,
			margin : '5px 5px 5px 5px',
	        name: 'dis'+name,
	        value: value
		});
	}
	DigiCompass.Web.app.planningCycle.refreshFormData = function(data, Conf) {
		var formData = data.BUSINESS_DATA;
		var gridData = Ext.JSON.decode(formData.planningCycleItemsGrid);
		formData.planningCycleItemsCountDis = formData.planningCycleItemsCount;
		formData.planningCycleStartDis=formData.planningCycleStart;
		formData.planningCycleTypeDis=formData.planningCycleType;
		var form = Ext.getCmp('planningCycleAdd').getForm();
		form.setValues(formData);
		var datas = [];
		for (var i = 0; i < gridData.length; i++) {
			datas.push(gridData[i]);
		}
		Ext.getCmp('planningCycleItemsGrid').getStore().loadData(datas);
	}
	DigiCompass.Web.app.planningCycle.addFormPanel = function(planningCycleId) {
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
		if (Ext.getCmp('planningCyclePanel')) {
			Ext.getCmp('planningCyclePanel').destroy();
		}
		var datas = [];
		var store = Ext.create('Ext.data.ArrayStore', {
			data : datas,
			fields : ['id','no', 'name','startDate','endDate']
		});
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'planningCycleAdd',
			defaultType : 'textfield',
			border : false,
			width : '100%',
			frame : false,
			height : 'fit',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side'
			},
			items : [{
						id : 'planningCycleId',
						xtype : 'hidden',
						name : 'planningCycleId'
					},{
						id 		   : 'planningCycleName',
						margin     : '5px 5px 5px 5px',
						allowBlank : false,
						emptyText  : 'Please input data!',
						fieldLabel : 'Version ',
						maxLength  : UiProperties.nameMaxLength,
						width	   : 600,
						msgTarget  : 'side',
						name 	   : 'planningcycleName'
							
					}, {
						id : 'planningCycleGroup',
						name : 'planningCycleGroup',
						xtype : 'radiogroup',
						margin : '5px 5px 5px 5px',
						fieldLabel : 'Unit ',
						width:600,
						columns : 3,
						vertical : true,
						listeners : {
							change : function(field, newValue, oldValue, eOpts) {
								var startField = Ext.getCmp('planningCycleStart');
								var itemCountField = Ext.getCmp('planningCycleItemsCount');
								if (startField.isValid() && itemCountField.getValue()) {
									var startValue = startField.getValue();
									var itemsCount = itemCountField.getValue();
									datas = DigiCompass.Web.app.planningCycle.assembleData(startValue,itemsCount,newValue.planningCycleType);
									store.loadData(datas);
								}

							}
						},
						items : [{
									boxLabel : 'Year',
									name : 'planningCycleType',
									inputValue : 'Year',
									checked : true
								}, {
									boxLabel : 'Quarter',
									name : 'planningCycleType',
									inputValue : 'Quarter'
								}, {
									boxLabel : 'Month',
									name : 'planningCycleType',
									inputValue : 'Month'
								}]
					},{
						id : 'planningCycleStart',
						allowBlank : false,
						fieldLabel : 'Start from ',
						format: 'Y-m-d',
						msgTarget : 'side',
						margin : '5px 5px 5px 5px',
						allowBlank : false,
						editable : false,
						width:600,
						xtype:'datefield',
						name : 'planningCycleStart',
						listeners : {
							change : function(textfield) {
								var itemsCount = Ext.getCmp('planningCycleItemsCount');
								if (!itemsCount.getValue() || !textfield.isValid()) {
									return;
								}
								var startValue = textfield.getValue();
								var itemsCount = itemsCount.getValue();
								var type = Ext.getCmp('planningCycleGroup').getValue().planningCycleType;
								if (startValue && itemsCount) {
									datas = DigiCompass.Web.app.planningCycle.assembleData(startValue,itemsCount, type);
									store.loadData(datas);
								}
							}
						}
					}, {
						id : 'planningCycleItemsCount',
						allowBlank : false,
						fieldLabel : 'Cycle count ',
						emptyText : '3',
						xtype:'numberfield',
						allowDecimals:false,
						minValue:1,
						width:600,
						margin : '5px 5px 5px 5px',
						msgTarget : 'side',
						allowBlank : false,
						name : 'planningCycleItemsCount',
						listeners : {
							change : function(textfield) {
								var startField = Ext.getCmp('planningCycleStart');
								if (!startField.isValid() || !textfield.getValue()) {
									return;
								}
								var numbers = textfield.getValue();
								var startValue = startField.getValue();
								var type = Ext.getCmp('planningCycleGroup').getValue().planningCycleType;
								if (startValue && numbers) {
									datas = DigiCompass.Web.app.planningCycle.assembleData(startValue,numbers, type);
									store.loadData(datas);
								}
							}
						}
					}]
		});
		
		var panel = Ext.create('Ext.panel.Panel',{
			layout:'vbox',
			items :[formPanel, {
				id : 'planningCycleItemsGrid',
				selType : 'cellmodel',
				plugins : [cellEditing],
				xtype : 'gridpanel',
				margin : '10 5',
				flex : 1,
				width : '100%',
				store : store,
				title : 'Planning Cycle Items',
				columns : [{
						flex : 1,
						text : 'No',
						sortable : true,
						dataIndex : 'no'
					}, {
						flex : 1,
						text 	  : 'Name',
						sortable  : true,
						dataIndex : 'name',
						editor 	  : {
							allowBlank : false,
							maxLength  : UiProperties.nameMaxLength
						}
					},{
						flex : 1,
						text : 'Start Date',
						renderer:Ext.util.Format.dateRenderer('Y-m-d'),
						sortable : true,
						dataIndex : 'startDate'
					},{
						flex : 1,
						text : 'End Date',
						sortable : true,
						renderer:Ext.util.Format.dateRenderer('Y-m-d'),
						dataIndex : 'endDate'
					}]
			}]
		});
		if (planningCycleId) {
			cometdfn.publish({
						MODULE_TYPE : 'MOD_PLANNING_CYCLE',
						COMMAND : 'COMMAND_QUERY_FORM_INFO',
						PlanningCycleId : planningCycleId
					});
		}
		if (planningCycleId) {
			Ext.getCmp('planningCycleGroup').setDisabled(true);
			Ext.getCmp('planningCycleStart').setDisabled(true);
			Ext.getCmp('planningCycleItemsCount').setDisabled(true);
		}
		var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
			id : 'planningCyclePanel',
			panelTitle : 'Object Detail - Planning Cycle',
			front : panel ,
			back : new DigiCompass.Web.app.VersionForm({edit : false})
		});
		reversalPanel.addToolBar('snapshot', new Ext.toolbar.Toolbar({
			items : [{
				columnWidth : .3,
				xtype : 'button',
				text : 'save',
				iconCls:'icon-save',
				handler : function() {
					if (formPanel.getForm().isValid()) {
						var data = DigiCompass.Web.app.sitegroup.getFormData(formPanel.getForm());
						var planningCycleItem = Ext.getCmp('planningCycleItemsGrid');
						var itemDatas = DigiCompass.Web.app.sitegroup
								.getStoreData(planningCycleItem);
						data.itemDatas = itemDatas;
						var group = Ext.getCmp('planningCycleGroup');
						var start = Ext.getCmp('planningCycleStart');
						var count = Ext.getCmp('planningCycleItemsCount');
						if(group.disabled){
							data.planningCycleStart = Ext.util.Format.date(start.getValue(),'Y-m-d');
							data.planningCycleItemsCount = count.getValue();
							var groupValue = group.getValue();
							for(var key in groupValue){
								data[key] = groupValue[key];
							}
						}
						cometdfn.publish({
							MODULE_TYPE : 'MOD_PLANNING_CYCLE',
							COMMAND : 'COMMAND_SAVE',
							'FORM_DATAS' : data
						});
					}
				}
			}]
		}));
		return reversalPanel;
	}
	DigiCompass.Web.app.planningCycle.saveSuccess = function(data, Conf,
			fnName, command) {
		var status = data.STATUS;
		if (status === 'success') {
			Notification.showNotification('Save PlanningCycle Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.planningCyclePublish(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
			//var formPanel = DigiCompass.Web.app.planningCycle.addFormPanel(null);
			//Ext.getCmp('obj-details').add(formPanel);
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	DigiCompass.Web.app.planningCycle.deleteSuccess = function(data, Conf, fnName,
			command) {
		var status = data.STATUS;
		if (status === 'success') {
			Notification.showNotification('Delete PlanningCycle Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.planningCyclePublish(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
			//var formPanel = DigiCompass.Web.app.planningCycle.addFormPanel(null);
			//Ext.getCmp('obj-details').add(formPanel);
		} else if(data.customException){
			alertError(data.customException);
		}
	}
})();