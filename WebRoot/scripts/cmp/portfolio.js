(function() {

	var namespace = Ext.namespace('DigiCompass.Web.app.portfolio');
	namespace.assembleGrid = {};
	
	namespace.checkRow = [];
	namespace.chek_box = function(check,event,id){
		if(check.checked){
			namespace.checkRow.push(id);
		}else{
			var checkeds = namespace.checkRow;
			for(var i = 0 ; i <checkeds.length ; i++){
				if(checkeds[i] == id){
					checkeds.splice(i,1);
				}
			}
		}
		event = event || window.event;
		event.stopPropagation();
	}
	
	// portfolio getList method
	namespace.getList = function(data, config) {
		namespace.checkRow = [];
		var fields = ['id', 'version','reference'];
		var columns = [{
			xtype : 'treecolumn',
			header : 'Name',
			dataIndex : 'version',
			//sortable : false,
			width : 130
		},{
			header : 'Reference',
			dataIndex : 'reference',
			//sortable : false,
			width : 80,
			renderer:function(value){
				if(value>0){
					return '<font color=red>'+value+'</font>';
				}
				else{
					return '<font color=green>'+value+'</font>';
				}
			}
		}];
		var _data = data.BUSINESS_DATA;
		var datas = Ext.JSON.decode(_data);
		
		if (Ext.getCmp('objExpPanel_portfolioID')) {
			Ext.getCmp('objExpPanel_portfolioID').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				id:"portfolioExplorer",
				fields:fields,
				width:"fit",
				height:700,
				data:[]
			});
			objectExplorer.on('checkchange', function(node, checked) {      
				objectExplorer.checkchild(node,checked);  
				objectExplorer.checkparent(node);  
	    	}); 
			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
				width:"fit",
				id:"portfolioCatalogue",
				height:730,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'objExpPanel_portfolioID',
				module:'MOD_PORTFOLIO',
				command:'COMMAND_QUERY_LIST',
				otherParam:{},
				region:'west',
				layout:'border',
				width:50,
				height:530,
				objectExplorer:objectExplorer,
				catalogue:catalogue,
				hidden:true
			});
			mainPanel.reconfigData(datas);
			var objExpPanel = Ext.getCmp("obj-exp");
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}
			var cataloguePanel = Ext.getCmp("obj-cat");
			if (cataloguePanel) {
				// 移除组建
				cataloguePanel.removeAll();
			}
			objExpPanel.add(objectExplorer);
			function getTbar(){
				return Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							var objDetailPanel = Ext.getCmp('obj-details');
							if (objDetailPanel) {
								// 移除组建
								objDetailPanel.removeAll();
							}
							namespace.selectedRecord = null;
							namespace.cleanFormData();
//							var checkeds = new Array();
//							var checked = Ext.getCmp("portfolioExplorer").getChecked();
//							for(var i = 0 ; i<checked.length ; i++){
//								checkeds.push(checked[i].id);
//							}
							
//								var _btn = this;
//								_btn.disable();
								cometdfn.request({
									MODULE_TYPE : "MOD_PORTFOLIO",
									COMMAND : 'COMMAND_QUERY_NEW'
								},function(message){
									if(message.BUSINESS_DATA){
										namespace.reference = message.BUSINESS_DATA.reference;
										var _info = Ext.JSON.decode(message.BUSINESS_DATA);
										//console.log("----------",_info);
										var formPanel = namespace.addFormPanel();
										formPanel.setTitle('Object Detail - Portfolio');
										namespace.cleanFormData();
										//var testinfo = [{id:1,siteGroup:3,scenarioName:2,technology:4,planningCycle:5}];
										//formPanel.front.getForm().setValues(testinfo);
										//formPanel.back.setValues({versionId : _info.id});
										if(!_info.scenarios){
											_info.scenarios = [];
										}
										//var i = 0;
										//_info.scenarios.push({id:null,scenarioName:null,siteGroup:null,technology:null,planningCycle:null,siteGroupPlanned:null});
										
//										Ext.getCmp('scenarioGrid').getStore().loadData(_info.scenarios);
										Ext.getCmp('scenarioGrid').getStore().loadData(_info);
									}
								});
							
							//var formPanel = namespace.addFormPanel();
							//formPanel.back.setValues({versionId : ''});
							//formPanel.setTitle('Object Detail - Portfolio');
						}
					}, {
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							//var checkeds = namespace.checkRow;
							var checkeds = new Array();
							var checked = Ext.getCmp("portfolioExplorer").getChecked();
							for(var i = 0 ; i<checked.length ; i++){
								checkeds.push(checked[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
							} else {
								var _btn = this;
								_btn.disable();
								cometdfn.request({
									MODULE_TYPE : "MOD_PORTFOLIO",
									COMMAND : 'COMMAND_DEL',
									ids:checkeds
								},function(message){
									_btn.enable();
									namespace.deleteSuccess(message);
//									if (ServerMessageProcess(message)) {
//										cometdfn.publish({MODULE_TYPE : 'MOD_TECHNOLOGY',COMMAND : 'COMMAND_QUERY_LIST'});
//									}
								});
							}
						}
					}]
				});
			}
			objectExplorer.addDocked(getTbar());
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			objectExplorer.addListener('itemclick', function(grid , record , item , index,event,eOpts){
				var objDetailPanel = Ext.getCmp('obj-details');
				if (objDetailPanel) {
					// 移除组建
					objDetailPanel.removeAll();
				}
				namespace.selectedRecord = record;
				var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
				if(isChecked){
					return;
				}
				if(Ext.isEmpty(record.data.id)){
					return;
				}
				var portfolioId = record.data.id;
				/*cometdfn.publish({
					MODULE_TYPE : "MOD_PORTFOLIO",
					COMMAND : 'COMMAND_QUERY_INFO',
					id : portfolioId
				});*/
				cometdfn.request({
					MODULE_TYPE : "MOD_PORTFOLIO",
					COMMAND : 'COMMAND_QUERY_INFO',
					id : portfolioId
				},function(message){
					if(message.BUSINESS_DATA){
						namespace.reference = message.BUSINESS_DATA.reference;
						var _info = message.BUSINESS_DATA;
						console.log("----------",_info);
						var formPanel = namespace.addFormPanel();
						formPanel.setTitle('Object Detail - Portfolio ('+_info.name+')');
						namespace.cleanFormData();
						Ext.getCmp("portfolioAdd").getForm().setValues(_info);
						formPanel.back.setValues({versionId : _info.id});
						if(!_info.scenarios){
							_info.scenarios = [];
						}
						var i = 0;
//						for(;i< _info.scenarios.length;i++){
//							_info.scenarios[i].order = i+1;
//						}
						
//						_info.scenarios.push({id:null, name:null,order:i+1,description:null});
						_info.scenarios.push({id:null,scenarioName:null,siteGroup:null,technology:null,planningCycle:null,siteGroupPlanned:null});
						
						cometdfn.request({
							MODULE_TYPE : "MOD_PORTFOLIO",
							COMMAND : 'COMMAND_QUERY_NEW'
						},function(message){
							if(message.BUSINESS_DATA){
								namespace.reference = message.BUSINESS_DATA.reference;
								var infoData = Ext.JSON.decode(message.BUSINESS_DATA);								
								Ext.getCmp('scenarioGrid').getStore().loadData(infoData);
								var _infoData = Ext.decode(_info.data);
								Ext.getCmp('scenarioGrid').getStore().each(function(record){
									for(var j = 0; j <_infoData.length ; j++){
										if(_infoData[j].id == record.data.id){
											Ext.getCmp('scenarioGrid').getSelectionModel().select(record, true);
											break;
										}
									}
									
								});
							}
						});
						
					}
				});
			});
		}
	};
	
	namespace.cleanFormData = function(){
		if(Ext.getCmp('portfolioAdd')){
			Ext.getCmp('portfolioAdd').getForm().reset();
		}
		if(Ext.getCmp('scenarioGrid')){
//			Ext.getCmp('scenarioGrid').getStore().loadData([{id:null, name:null,order:1,description:null}]);
			Ext.getCmp('scenarioGrid').getStore().loadData([{id:null,scenarioName:null,siteGroup:null,technology:null,planningCycle:null,siteGroupPlanned:null}]);
		}
	}
	namespace.addFormPanel = function(portfolioId) {
		var detailPanel = Ext.getCmp("portfolioDetailPanel");
		if(!detailPanel){
			detailPanel = Ext.create('Ext.panel.Panel', {
				id : "portfolioDetailPanel",
				layout: {
		            type:'vbox',	        
		            align:'stretch'
		        },			
				autoScroll : true
			});
		}
		var protfolioSM = Ext.create('Ext.selection.CheckboxModel');
		var formPanel = Ext.getCmp('portfolioAdd');
		if (formPanel) {
			namespace.cleanFormData();
			formPanel.show();
		}
		namespace.reference = 0;
		//没有grid就创建grid
		if(!formPanel){
			var datas = [];
			var store = Ext.create('Ext.data.ArrayStore', {
				data : [{id:null,scenarioName:null,siteGroup:null,technology:null,planningCycle:null,siteGroupPlanned:null}],
				fields : ['id', 'scenarios','scenarioName', 'siteGroup','technology','planningCycle','siteGroupPlanned']
			});
			var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
			formPanel = Ext.create('Ext.form.Panel', {
				id : 'portfolioAdd',
				defaultType : 'textfield',
				border : false,
				width : '100%',
				frame : false,
				flex:1,
				//layout : 'anchor',
				fieldDefaults : {
					labelAlign : 'left',
					msgTarget : 'side',
					labelWidth : 100
				},
				items : [{
							id : "portfolioId",
							xtype : "hidden",
							name : "id"
						},{
							margin : '10 0 0 10',
							columnWidth : .7,
							id : 'portfolioName',
							allowBlank : false,
							emptyText : "Please input portfolioName!",
							fieldLabel : 'Name',
							maxLength:30,
							msgTarget : 'side',
							name : 'name'
						},{
							margin : '10 0 0 10',
							columnWidth : .7,
							id : 'portfolioDescription',
							allowBlank : true,
							fieldLabel : 'Description',
							maxLength:30,
							msgTarget : 'side',
							name : 'description'
						},  {
							id : 'scenarioGrid',
							//selType : 'cellmodel',
							plugins : [cellEditing],
							xtype : 'gridpanel',
							//height : 300,
							selModel : protfolioSM,
//							width : '100%',
							store : store,
							margin : '20 5 10 5',
							title : 'scenarioGrid',
							columns : [ {
								width : 200,
								text : 'scenarioName',
								sortable : true,
								dataIndex : 'scenarioName',
								editor : {
									allowBlank : false,
									maxLength:30
								}
	
							}, {
								width : 200,
								text : 'SiteGroup',
								sortable : true,
								dataIndex : 'siteGroup',
								editor : {
									allowBlank : false,
									maxLength:30
								}
							}, {
								width : 200,
								text : 'Technology',
								sortable : true,
								dataIndex : 'technology',
								editor : {
									allowBlank : false,
									maxLength:30
								}
							}, {
								width : 200,
								text : 'PlanningCycle',
								sortable : true,
								dataIndex : 'planningCycle',
								editor : {
									allowBlank : false,
									maxLength:30
								}
							}, {
								width : 200,
								text : 'SiteGroupPlanned',
								sortable : true,
								dataIndex : 'siteGroupPlanned',
								editor : {
									allowBlank : false,
									maxLength:30
								}
							}],
//							tbar : [/* {
//								text : 'Add',
//								handler : function() {
//									var store = Ext.getCmp('siteTypeGrid').getStore();
//									var maxOrder = 0;
//									for(var i=0; i<store.getCount(); i++){
//										var _data = store.getAt(i).getData();
//										if(_data.order>maxOrder){
//											maxOrder = _data.order;
//										}
//									}
//									store.add({id:null, name:null,order:maxOrder+1,description:null});
//								}
//							},*/{
//								text : 'remove',
//								handler : function() {
//									var grid = Ext.getCmp('scenarioGrid');
//									var selection = grid.getSelectionModel().getSelection();
//									if(selection.length>0){
//										for(var i in selection){
//											if(Ext.isEmpty(selection[i].data.id) || namespace.reference==0){
//												grid.store.remove(selection[i]);
//											}else{
//												alertWarring('scenario has be used, can not be removed.');
//											}
//										}
//									}
//								}
//							}], 
							listeners : {
//								itemClick : function(a,b,m,rindex){
//									var store = this.getStore();
//									if(rindex+1 === store.getCount()){
//										store.add({id:null,scenarioName:null,siteGroup:null,technology:null,planningCycle:null,siteGroupPlanned:null});
//									}
//								}
							}
						}]
			});			
			
			detailPanel.add(formPanel);
			if(namespace.selectedRecord != null){
				detailPanel.add(namespace.getTabPanel());
			}
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
//				height : '722',
				front : detailPanel,
				back : new DigiCompass.Web.app.VersionForm({edit : false})
			});
			reversalPanel.addToolBar('portfolio', new Ext.toolbar.Toolbar({
				items : [{
					columnWidth : .3,
//					margin : '10 0 0 10',
					xtype : 'button',
					text : 'save',
					iconCls:'icon-save',
					handler : function() {
						if (formPanel.getForm().isValid()) {
							var _btn = this;
							_btn.disable();
							var data = formPanel.getForm().getValues();
							/*var scenarios = DigiCompass.Web.app.sitegroup.getStoreData(Ext.getCmp('scenarioGrid'));
							console.log("这是scenarios的值",scenarios);
							console.log("这是data的值",data);
							var st = [];
							for(var i=0; i<scenarios.length; i++){
								if(!Ext.isEmpty(scenarios[i].name) || (Ext.isEmpty(scenarios[i].name) && !Ext.isEmpty(scenarios[i].id))){
									st.push(scenarios[i]);
								}else if(!Ext.isEmpty(scenarios[i].id)){
									alertError('Please input the scenario Name!');
									return;
								}
							}*/							
							var sm = Ext.getCmp('scenarioGrid').getSelectionModel();
							var records = sm.getSelection();
							if(records.length  == 0){
								_btn.enable();
								Notification.showNotification("must select one scenario");
								return;
							}
							var scenarios = new Array();
							var oldPc;
							for(var i = 0; i < records.length; i++){
								var pc = records[i].get("planningCycle");
								if(oldPc != null && oldPc != pc){
									_btn.enable();
									Notification.showNotification("scenario planning cycle must same");
									return;
								}
								scenarios.push({
									id : records[i].get("id")
								});
								oldPc = pc;
							}
//							var scenariosdata = [];
//							for(var ints = 0;ints<scenarios.length;ints++){
//								
//								scenariosdata.push(scenarios[ints]["scenarios"]);
//							}
							data.scenarios = scenarios;
							cometdfn.request({
									MODULE_TYPE : "MOD_PORTFOLIO",
									COMMAND : 'COMMAND_SAVE',
									//data : Ext.JSON.encode(data)
									data : data
									
								},function(message){
									_btn.enable();
									if (DigiCompass.Web.app.checkResult(formPanel, message)) {
										namespace.cleanFormData();
										cometdfn.publish({MODULE_TYPE : 'MOD_PORTFOLIO',COMMAND : 'COMMAND_QUERY_LIST'});
										reversalPanel.hide();
									}
							});
						}
					}
				}]
			}));
			Ext.getCmp('obj-details').add(reversalPanel);
		}		
		detailPanel.reversalPanel.show();
//		var cbitems = Ext.getCmp("portfolioAdd").getSelectionModel().getSelection();
//		for (var i = 0; i < cbitems.length; i++) {    
//		    if (cbitems.itemAt(i).checked) {    
//		       alert(cbitems.itemAt(i).order);    
//		    }    
//		}		
		return detailPanel.reversalPanel;			
	}
//	namespace.addFormPanel = function(portfolioId, renderTo) {
//		var formPanel = Ext.getCmp('portfolioAdd');
//		if (formPanel) {
//			namespace.cleanFormData();
//			formPanel.show();
//		}
//		namespace.reference = 0;
//		if(!formPanel){
//			formPanel = Ext.create('Ext.form.Panel', {
//				id : 'portfolioAdd',
//				defaultType : 'textfield',
//				border : false,
//				width : '100%',
//				frame : false,
//				//layout : 'anchor',
//				fieldDefaults : {
//					labelAlign : 'left',
//					msgTarget : 'side',
//					labelWidth : 100
//				},
//				items : [{
//					id : "portfolioId",
//					xtype : "hidden",
//					name : "id"
//				},{
//					margin : '10 0 0 10',
//					columnWidth : .7,
//					id : 'portfolioName',
//					allowBlank : false,
//					emptyText : "Please input data!",
//					fieldLabel : 'Name',
//					maxLength:30,
//					msgTarget : 'side',
//					name : 'name'
//				},{
//					margin : '10 0 0 10',
//					columnWidth : .7,
//					id : 'portfolioDescription',
//					allowBlank : true,
//					fieldLabel : 'Description',
//					maxLength:30,
//					msgTarget : 'side',
//					name : 'description'
//				}]
//			});
//			
//			
//			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
////				renderTo : renderTo,
//				height : '722',
//				front : formPanel,
//				back : new DigiCompass.Web.app.VersionForm({edit : false})
//			});
//			reversalPanel.addToolBar('portfolio', new Ext.toolbar.Toolbar({
//				items : [{
//					columnWidth : .3,
////					margin : '10 0 0 10',
//					xtype : 'button',
//					text : 'save',
//					iconCls:'icon-save',
//					handler : function() {
//						if (formPanel.getForm().isValid()) {
//							var _btn = this;
//							_btn.disable();
//							var data = formPanel.getForm().getValues();
//							cometdfn.request({
//									MODULE_TYPE : "MOD_PORTFOLIO",
//									COMMAND : 'COMMAND_SAVE',
//									data : Ext.JSON.encode(data)
//								},function(message){
//									_btn.enable();
//									if (DigiCompass.Web.app.checkResult(formPanel, message)) {
//										namespace.cleanFormData();
//										if(!renderTo){
//											cometdfn.publish({MODULE_TYPE : 'MOD_PORTFOLIO',COMMAND : 'COMMAND_QUERY_LIST'});
//										}
//										reversalPanel.hide();
//									}
//							});
//						}
//					}
//				}]
//			}));
//			if(!renderTo){
//				Ext.getCmp('obj-details').add(reversalPanel);
//			}else{
//				Ext.getCmp(renderTo).add(reversalPanel);
//			}
//		}
//		formPanel.reversalPanel.show();
//		return formPanel.reversalPanel;
//	}
	/*namespace.queryInfoCallBack = function(message){
		if(message.BUSINESS_DATA){
			namespace.reference = message.BUSINESS_DATA.reference;
			var _info = Ext.JSON.decode(message.BUSINESS_DATA.data);
			var formPanel = namespace.addFormPanel(null, message.renderTo);
			formPanel.setTitle('Object Detail - portfolio ('+_info.name+')');
			namespace.cleanFormData();
			formPanel.front.getForm().setValues(_info);
			formPanel.back.setValues({versionId : _info.id});
		}
	}*/
	
	namespace.saveSuccess = function(data, Conf,
			fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			alertSuccess('Save Data Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.portfolioPublish(queryParam);;
			var formPanel = namespace.addFormPanel(null);
			Ext.getCmp('obj-details').add(formPanel);
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	
	namespace.deleteSuccess = function(data, Conf, fnName,
			command) {
		var status = data.STATUS;
		if (status === "success") {
			alertSuccess('Delete Data Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.portfolioPublish(queryParam);
			Ext.getCmp('obj-details').removeAll();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	
	namespace.initOutputGrids = function(renderId, mtype){		
		var portfolioId = namespace.selectedRecord.get("id");		
		cometdfn.publish({MODULE_TYPE : 'PORTFOLIO_UPGRADE',COMMAND : 'COMMAND_QUERY_GRID',portfolioId:portfolioId, mtype:mtype, renderId : renderId});
		cometdfn.publish({MODULE_TYPE : 'PORTFOLIO_CAPACITY',COMMAND : 'COMMAND_QUERY_GRID',portfolioId:portfolioId, mtype:mtype, renderId : renderId});			
		cometdfn.publish({MODULE_TYPE : 'PORTFOLIO_COVERAGE',COMMAND : 'COMMAND_QUERY_GRID',portfolioId:portfolioId, mtype:mtype, renderId : renderId});
		cometdfn.publish({MODULE_TYPE : 'PORTFOLIO_COVERAGE_PLANNED',COMMAND : 'COMMAND_QUERY_GRID',portfolioId:portfolioId, mtype:mtype, renderId : renderId});
		cometdfn.publish({MODULE_TYPE : 'PORTFOLIO_TOTAL',COMMAND : 'COMMAND_QUERY_GRID',portfolioId:portfolioId, mtype:mtype, renderId : renderId});		
	}
	
	cometdfn.registFn({MODULE_TYPE:"PORTFOLIO_UPGRADE",//该参数在publish时调用，指定某一个模块
	COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
	callbackfn : function(data, config,fnName,fnCommand){
		namespace.assembleGrid.getGrid(data, config,fnName,fnCommand);
	},//调用publish后，回调方法
	Conf:{//callbackfn回调方法对应的参数配置
		id:'MOD_REPORT_GROWTH_UPGRADE_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
		title:'GROWTH Upgrade', //GridPanel 标题
		categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
		renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
		gridHeight:350,
		ischart:true,//TODO 设置是图表
		formatConfig:{
			tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
		}
	}
	});
	cometdfn.registFn({MODULE_TYPE:"PORTFOLIO_CAPACITY",//该参数在publish时调用，指定某一个模块
	COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
	callbackfn :function(data, config,fnName,fnCommand){
		namespace.assembleGrid.getGrid(data, config,fnName,fnCommand);
	},//调用publish后，回调方法
	Conf:{//callbackfn回调方法对应的参数配置
		id:'MOD_REPORT_GROWTH_CAPACITY_QTY_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
		title:'GROWTH New Capacity', //GridPanel 标题
		categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
		renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
		gridHeight:350,
		ischart:true,//TODO 设置是图表
		formatConfig:{
			tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
		}
		}
	});
	cometdfn.registFn({MODULE_TYPE:"PORTFOLIO_COVERAGE",//该参数在publish时调用，指定某一个模块
	COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
	callbackfn :function(data, config,fnName,fnCommand){
		namespace.assembleGrid.getGrid(data, config,fnName,fnCommand);
	},//调用publish后，回调方法
	Conf:{//callbackfn回调方法对应的参数配置
		id:'MOD_REPORT_COVERAGE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
		title:'Coverage(Unplanned)', //GridPanel 标题
		categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
		renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
		gridHeight:350,
		ischart:true,//TODO 设置是图表
		formatConfig:{
			tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
		}
		}
	});
	cometdfn.registFn({MODULE_TYPE:"PORTFOLIO_COVERAGE_PLANNED",//该参数在publish时调用，指定某一个模块
		COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
		callbackfn :function(data, config,fnName,fnCommand){
			namespace.assembleGrid.getGrid(data, config,fnName,fnCommand);
		},//调用publish后，回调方法
		Conf:{//callbackfn回调方法对应的参数配置
			id:'MOD_REPORT_COVERAGE_AMOUNT_PLANNED_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
			title:'Coverage(Planned)', //GridPanel 标题
			categoryLen:4,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
			renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
			gridHeight:350,
			ischart:true,//TODO 设置是图表
			formatConfig:{
				tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
			}
		}
	});
	cometdfn.registFn({MODULE_TYPE:"PORTFOLIO_TOTAL",//该参数在publish时调用，指定某一个模块
		COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
		callbackfn :function(data, config,fnName,fnCommand){
			namespace.assembleGrid.getGrid(data, config,fnName,fnCommand);
		},//调用publish后，回调方法
		Conf:{//callbackfn回调方法对应的参数配置
			id:'MOD_REPORT_CAPEX_TOTAL_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
			title:'Capex Total Amount', //GridPanel 标题
			categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
			renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
			gridHeight:100,
			ischart:true,//TODO 设置是图表
			formatConfig:{
				tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
			}
		}
	});
	
	namespace.getTabPanel = function(){
				
		//centerBottomPanel.removeAll();
		
		var capexPanel = Ext.create('Ext.panel.Panel',{
			id : "portfolioCapex",
	    	title:'Output Capex',
	    	layout:'vbox',	    	
	    	autoScroll:true,
	    	items:[]
	    });
				
		var opexPanel = Ext.create('Ext.panel.Panel',{	    
			id : "portfolioOpex",
	    	title:'Output Opex',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
				
		var incomePanel = Ext.create('Ext.panel.Panel',{	
			id : "portfolioIncome",
	    	title:'Output Income',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
				
		 var expensePanel = Ext.create('Ext.panel.Panel',{		
			id : "portfolioExpense",
	    	title:'Output Expense',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
		});
		
		var rechargePanel = Ext.create('Ext.panel.Panel',{
			id : "portfolioRecharge",
	    	title:'Output Recharge',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
		});

	    var centerBottomPanel = Ext.create('Ext.tab.Panel',{	    	
	        activeTab: 0,
	        tabPosition: 'bottom',
	        border: true,
	        width:'100%',
	        defaults:{bodyStyle:'padding:10px'},
	        flex:3,
	        items:[
	               capexPanel,
	               opexPanel,incomePanel,expensePanel,rechargePanel],
	        listeners:{
	        	beforetabchange : function(tabPanel,newCard,oldCard,eOpts){
	        		if(newCard.id == "portfolioCapex"){
	        			namespace.initOutputGrids(newCard.id, "capex");
	        		} else if(newCard.id == "portfolioOpex"){
	        			namespace.initOutputGrids(newCard.id, "opex");
	        		} else if(newCard.id == "portfolioIncome"){
	        			namespace.initOutputGrids(newCard.id, "income");
	        		} else if(newCard.id == "portfolioExpense"){
	        			namespace.initOutputGrids(newCard.id, "expense");
	        		} else if(newCard.id == "portfolioRecharge"){
	        			namespace.initOutputGrids(newCard.id, "recharge");
	        		}
	        	},
	        	beforeremove : function(){
	    		
	    		},
	    		afterrender : function(){}
	        }
	    });
	    
	    namespace.initOutputGrids("portfolioCapex", "capex");
	    return centerBottomPanel;
	}
	
	namespace.assembleGrid.getGrid = function(data, config,fnName,fnCommand){
		
		var categoryLen = config.categoryLen;
		var overrideCreateEditFun = config.overrideCreateEditFun;
		var formatConfig = config.formatConfig;
		var validateConfig = config.validateConfig;
		var gridHeight = config.gridHeight - 45;
		var title =config.title;
		var isEditable = config.isEditable;
		var ischart = config.ischart;
		var tempCmp = Ext.getCmp(data.renderId);
		var cfgId = fnName+"_"+fnCommand+"_"+data.mtype;
		
		if(Ext.getCmp("reversalPanel_" + cfgId)){
			return;
		}
		
		var oldData = data.BUSINESS_DATA['grid'];
		
		data['columnHeader'] = Ext.JSON.decode(oldData['columnHeader']);
		data['rowHeader'] = Ext.JSON.decode(oldData['rowHeader']);
		data['data'] = Ext.JSON.decode(oldData['data']);
		
		var singleData = DigiCompass.Web.app.assembleGrid.assembleSingleData(data);
		
		//创建列信息
		var columnsInfo = DigiCompass.Web.app.assembleGrid.assembleColumn(data,categoryLen,false,overrideCreateEditFun,id,formatConfig,validateConfig);
		
		//构建列头
		var columns = columnsInfo.columns;
		var fields = columnsInfo.fields;
		
		//默认分组列
		var groupers = [];
		if(categoryLen > 1){
			groupers.push('category0');
		}
		
		//创建Store
		var store = Ext.create('Ext.data.ArrayStore', {
			fields : fields,
			groupers: groupers,
			data : singleData
		});
		
		var features = Ext.create('Ext.grid.feature.MultiGroupingSummary',{
						baseWidth:50,
				        groupHeaderTpl: '{disName}'
				      });
		
		var _grid = Ext.create('Ext.grid.Panel', {
			//id : id,
			selType: 'rowmodel',
//			margins : '5 5 5 5',
			collapsible : false,
			border : false,
			columnLines : true,
			draggable : false,
			enableColumnHide : true,
			enableColumnMove : true,
			features:features,
			store : store,
			columns : columns,
			height : gridHeight,
			width : '100%',
			//renderTo : renderdiv,
//			contentEl : renderdiv,
//			title : title,
//			plugins: [cellEditing],					
			viewConfig : {
				stripeRows : true,
				markDirty : false
			},
			listeners : {
				//( Ext.selection.CellModel this, Ext.data.Model record, Number row, Number column, Object eOpts )
				deselect : function(cell,record,row,column,eOpts){
					
//					console.log('deselect '+row+','+column+','+Ext.JSON.encode(record.raw));
				},
				select : function(cell,record,row,column,eOpts){
//					console.log('select'+row+','+column);
					var temp = getAssembleGridDataFromArry(id);
					if(temp != null){
						//指定点击cell对应的行列坐标
						temp.colIndex = column;
						temp.rowIndex = row;
					}
				},
				render : function(){
//					obj_details_tbar_2.render(_grid.tbar);
				}
				//,
//				beforerender : function(e,eOpts){
//					if(categoryLen > 1){
//						_grid.columns[0].hidden = true;
//					}
//				},
//				reconfigure : function(e,eOpts){
//					if(categoryLen > 1){
//						_grid.columns[0].hidden = true;
//					}
//				}
			},
//			tbar : {xtype: 'container',items: [obj_details_tbar,btntbar]},
//			tbar : isEditable == true ? [saveBtn,saveAsBtn,dropBtn,resetBtn,
//			                             historyVersionBtn,
//			                             refreshBtn,btn_clear, btn_import, btn_export, editBtn, returnBtn] : [refreshBtn,btn_clear],
			formatConfig : formatConfig,
			validateConfig : validateConfig
		});
		
		var _chartHtmlDiv="<div id='"+cfgId+"'></div>";	
		var _chart = Ext.create('Ext.panel.Panel', {
			height : 600,			
			width:'100%',
			collapsible : false,
			region: 'west',
			divId:cfgId,
		    html: _chartHtmlDiv,
		    autoScroll : true
		});
		
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({	
			id : "reversalPanel_" + cfgId,
			panelTitle : (data.edit ? 'Object Detail - ' : '') +title,
			canTurnover : config.isEditable ||config.ischart ||false,
			margins : '5 0 5 5',
			back : ischart === true ? _grid : vformPanel,
			front : ischart === true ? _chart : _grid,
			height : 300,
			//back : vformPanel,
			showNavigation : data.showNavigation || false,
//					bodyDbClick : data.isSingleEdit ? false : true,
			bodyDbClickNarrow : function(){
//						Ext.getCmp('obj_details_tbar').removeAll();
//				    	Ext.getCmp('obj_details_tbar').add(DigiCompass.Web.app.navigationBar.clearTheLastNavigation());
//				    	
//				    	var cmpId = 'DataEditPanel_'+data.scenarioId;
//				    	var tempCmp = Ext.getCmp(cmpId);
//				    	if(tempCmp){
//				    		tempCmp.destroy();
//				    	}
//				    	
//				    	var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
//				    	if(scenarioCenterPanel){
//				    		scenarioCenterPanel.setVisible(true);
//				    	}
//				    	DigiCompass.Web.UI.Scenario.groupPanelReturn();
			},
			bodyDbClickMagnify : function(){
//						var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
//				    	if(scenarioCenterPanel){
//				    		scenarioCenterPanel.setVisible(false);
//				    	}
//				    	DigiCompass.Web.app.assembleGrid.dataEditHandler(id,data.scenarioId);
			},
			listeners:{
				afterrender : function(){
//							Ext.getCmp('obj-details').header.addCls('pointer');
//							Ext.getCmp(reversalPanel_id).setNavigation('testestestestesest12346');
//							Ext.getCmp(reversalPanel_id).setTitle(title);
				}
			}
		});
			
		if(tempCmp){
				tempCmp.add(reversalPanel);
				if(fnName == "PORTFOLIO_UPGRADE"){
					Chart_GrowthUpgrade(data,cfgId);
				} else if(fnName == "PORTFOLIO_CAPACITY"){
					Chart_GrowthNewCapacity(data,cfgId);
				} else if(fnName == "PORTFOLIO_COVERAGE"){
					Chart_CoverageUnplanned(data,cfgId);
				} else if(fnName == "PORTFOLIO_COVERAGE_PLANNED"){
					Chart_CoveragePlanned(data,cfgId);
				} else if(fnName == "PORTFOLIO_TOTAL"){
					Chart_CapexTotalAmount(data,cfgId);
				}
		}
	}
})();