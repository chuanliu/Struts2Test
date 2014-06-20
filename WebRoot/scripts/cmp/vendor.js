(function() {
	Ext.ns("DigiCompass.Web.app.vendorMgt");

	cometdfn.registFn({
		MODULE_TYPE : "MOD_VENDOR_RESPONSE",
		COMMAND : 'COMMAND_QUERY_LIST',
		callbackfn : function(message, config) {
			if(message.renderTo){
				var renderPanel = Ext.getCmp(message.renderTo);
				var detailPanel = Ext.create('Ext.panel.Panel', {			
					layout: {
			            type:'vbox',	        
			            align:'stretch'
			        }							
				});
				renderPanel.add(detailPanel);
				detailAddPanel(detailPanel, message, message.id);						
			} else {
				DigiCompass.Web.app.vendorMgt.getListData(message, config);
			}
		},
		Config : {}
	});
	
	cometdfn.registFn({
		MODULE_TYPE : "MOD_VENDOR",
		COMMAND : 'COMMAND_QUERY_LIST',
		callbackfn : function(message, config) {			
			if(message.renderTo){
				var renderPanel = Ext.getCmp(message.renderTo);
				var detailPanel = Ext.create('Ext.panel.Panel', {			
					layout: {
			            type:'vbox',	        
			            align:'stretch'
			        }							
				});
				renderPanel.add(detailPanel);
				detailAddPanel(detailPanel, message, message.id);						
			} else {
				DigiCompass.Web.app.vendorMgt.getListData(message, config);
			}
			
		},
		Config : {}
	});

	DigiCompass.Web.app.vendorMgt.getListData = function(data, config) {
		DigiCompass.Web.app.vendorMgt.message = data;
		var fields = [ 'id', 'name', 'number', 'description', 'reference' ];
		var columns = [ {
			xtype : 'treecolumn',
			header : 'Change Request',
			dataIndex : 'name',
			//sortable : false,
			flex : 1
		}, {
			text : "Number",
			dataIndex : "number",
		}];
		var _data = data.BUSINESS_DATA.list;		 
		var datas = Ext.JSON.decode(_data);	
		var searchKeys = data.BUSINESS_DATA.searchKeys;
		DigiCompass.Web.app.vendorMgt.showObjExp(columns, fields, datas, searchKeys);
	};

	DigiCompass.Web.app.vendorMgt.showObjExp = function(columns, fields, datas, searchKeys) {

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}

		var objectExplorer = DigiCompass.Web.app.vendorMgt.getObjExp(columns,
				fields, datas, searchKeys);
		objExpPanel.add(objectExplorer);
	};

	DigiCompass.Web.app.vendorMgt.getObjExp = function(columns, fields, datas, searchKeys) {
		var cataloguePanel = Ext.getCmp("obj-cat");
		if (cataloguePanel) {
			// 移除组建
			cataloguePanel.removeAll();
		}

		var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer', {
			columns : columns,
			fields : fields,
			width : "fit",
			height : 700,
			searchKeys : searchKeys,
			data : []
		});

		var catalogue = Ext.create('DigiCompass.Web.ux.catalogue', {
			width : "fit",
			height : 730,
			data : [],
			collapsible : true,
			split : true,
			region : 'center',
			hidden : true
		});
		var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel', {
			id : 'userMgtListView',
			module : DigiCompass.Web.app.vendorMgt.message.MODULE_TYPE,
			command : 'COMMAND_QUERY_LIST',
			otherParam : {},
			region : 'west',
			layout : 'border',
			width : 50,
			height : 530,
			objectExplorer : objectExplorer,
			catalogue : catalogue,
			hidden : true
		});

		cataloguePanel.add(catalogue);
		catalogue.outerPanel = cataloguePanel;
		cataloguePanel.add(mainPanel);

		objectExplorer.on('checkchange', function(node, checked) {
			objectExplorer.checkchild(node, checked);
			objectExplorer.checkparent(node);
		});

		objectExplorer.addListener('itemclick', function(grid, record, item,
				index, event, eOpts) {
			var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
			if (isChecked) {
				return;
			}
			if (Ext.isEmpty(record.data.id)) {
				return;
			}
			DigiCompass.Web.app.vendorMgt.showDetailPanel(record.data);
		});

		if (Ext.getCmp('userMgtListView')) {
			Ext.getCmp('userMgtListView').reconfigData(datas);
		} else {
			mainPanel.reconfigData(datas);
		}

		return objectExplorer;
	};

	DigiCompass.Web.app.vendorMgt.showDetailPanel = function(obj) {

		var objDetailPanel = Ext.getCmp('obj-details');
		if (objDetailPanel) {
			// 移除组建
			objDetailPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var detailPanel = Ext.create('Ext.panel.Panel', {			
			layout: {
	            type:'vbox',	        
	            align:'stretch'
	        },			
			autoScroll : true
		});
		var groupData = [];
		var version = "";
		var obj_id = "";
		var message = DigiCompass.Web.app.vendorMgt.message;
		var ptitle;
		if (message.MODULE_TYPE == "MOD_VENDOR"&& message.COMMAND == "COMMAND_QUERY_LIST") {
			ptitle = "Object Detail - Work Assignment";
		}else{
			ptitle = "Object Detail - Work Acceptance";
		}
		if (obj) {
			version = obj.name;
			obj_id = obj.id;
			ptitle = ptitle + " (" + version + ")";
			if (obj.groups) {
				groupData = obj.groups;
			}
		}
		var ReversalPanel = new DigiCompass.Web.app.ReversalPanel({
			panelTitle : ptitle,
			height : 700,
			front : detailPanel,
			back : new DigiCompass.Web.app.VersionForm({
				qrCode : obj_id
			})
		});
		objDetailPanel.add(ReversalPanel);
		detailAddPanel(detailPanel, message, obj_id);
	};
	
	//var myLoadMask;
	function detailAddPanel(detailPanel, message, obj_id){
		//myLoadMask = new Ext.LoadMask(detailPanel, {msg:"Please wait..."});
		if (message.MODULE_TYPE == "MOD_VENDOR"&& message.COMMAND == "COMMAND_QUERY_LIST") {
				var tbar = Ext.create('Ext.toolbar.Toolbar', {
					width : 200,
					items : [ {
						xtype : 'button',
						text : 'Refresh',
						handler : function() {
							//loadPanelData(obj_id);
							selectedGridPanel.reload();
							gridPanel.reload();
							noVendorGridPanel.reload();
						}
					} ]
				});
				detailPanel.addDocked(tbar);
				var selectedGridPanel = getPanel(obj_id, "selectedVendorGridPanel",
						"Selected Vendor", 1);
				var tbar1 = Ext.create('Ext.toolbar.Toolbar', {
					width : 200,
					items : [ {
						xtype : 'button',
						text : 'Send To Vendor',
						handler : function() {
							var grid = selectedGridPanel.target;
							var sm = grid.getSelectionModel();
							var records = sm.getSelection();
							if(records.length == 0){
								return;
							}
							var u = {};
							var params = new Array();
							for(var i = 0; i < records.length; i++){
								var record = records[i];
								var status = record.get("status");
								if(status == null || status == "N/A" || status == 3){
									var soId = record.get("soId");
									if (!u.hasOwnProperty(soId)) {
										params.push({
											soId : soId,
											vendorInfoList : []
										})
										u[soId] = 1;
									}
								}
							}
							if(params.length == 0){
								return;
							}
							for (var i = 0; i < params.length; i++) {
								var soId = params[i].soId;
								for(var j = 0; j < records.length; j++){
									var record = records[j];
									var status = record.get("status");
									if(status == null || status == "N/A" || status == 3){
										var gridSoId = record.get("soId");
										var vendorId = record.get("vendorId");
										var msiId = record.get("msiId");
										if (soId == gridSoId) {
											params[i].vendorInfoList.push({
												vendorId : vendorId,
												msiId : msiId
											});
										}
									}
								}
							}
							var crInfo = new Array();
							var crInfoU = {};
							for(var i = 0; i < records.length; i++){
								var record = records[i];
								var status = record.get("status");
								if(status == null || status == "N/A" || status == 3){
									var crid = record.get("crid");
									if(!crInfoU.hasOwnProperty(crid)){
										crInfo.push({
											crid : crid,
											vendorids : []
										})
										crInfoU[crid] = 1;
									}
								}
							}
							for(var i=0; i<crInfo.length; i++){
								var cri = crInfo[i];																
								for(var j = 0; j < records.length; j++){
									var record = records[j];
									var status = record.get("status");
									if(status == null || status == "N/A" || status == 3){
										if(cri.crid == record.get("crid")){
											var vendorid = record.get("vendorId");
											if(cri.vendorids.indexOf(vendorid) == -1){
												cri.vendorids.push(vendorid);
											}
										}
									}
								}								
							}											
							cometdfn.request({
								MODULE_TYPE : 'MOD_VENDOR',
								COMMAND : 'SELECT_VENDOR',
								params : params,								
								crInfo : crInfo
							}, function(message) {
								var data = message['BUSINESS_DATA'] || {};
								if (message.STATUS === 'success') {
									selectedGridPanel.reload();
									alertSuccess('save success.');									
								} else if (message.customException) {
									alertError(message.customException);
								} else {
									alertError('save fail');
								}															
							});
						}
					}, {
						xtype : 'button',
						text : 'Assign To Vendor',
						handler : function() {
							var grid = this.up("mutigroupgrid");
							var sm = grid.target.getSelectionModel();
							var records = sm.getSelection();
							var assignVendorInfo = new Array();
							var crids = new Array();
							for ( var i = 0; i < records.length; i++) {
								var status = records[i].get("status");
								if(status == 2){
									var soId = records[i].get("soId");
									var vendorId = records[i].get("vendorId");
									if(assignVendorInfo.length > 0){
										for(var j = 0; j < assignVendorInfo.length; j++){
											if(soId == assignVendorInfo[j].soId){
												alertError("change request, site, service must select one vendor");
												return;
											}
										}
									}
									assignVendorInfo.push({
										soId : soId,
										vendorId : vendorId
									});
									crids.push(records[i].get("crid"));
								}
							}
							if(assignVendorInfo.length == 0){
								return;
							}
							crids = Ext.Array.unique(crids);
							cometdfn.request({
								MODULE_TYPE : 'MOD_VENDOR',
								COMMAND : 'ASSIGN_TO_VENDOR',
								assignVendorInfo : assignVendorInfo,
								crids : crids
							}, function(message) {
								
								if(message.STATUS === 'error'){
									  alertError(message.customException || message.error.SYSTEM_ERROR)
								  }else{
									  var ignore = message.BUSINESS_DATA.ignore;
									  if(Ext.isArray(ignore) && ignore.length>0){
											alertWarn('Ignore vendor[' + ingore.join(',') + '], have no user')
										}									
										alertSuccess('save success.');
										grid.reload();
								  }
								
							});
						}
					} ]
				});
				selectedGridPanel.addDocked(tbar1);
				var gridPanel = getPanel(obj_id, "vendorGridPanel", "Vendor",2);
				var tbar2 = Ext.create('Ext.toolbar.Toolbar', {
					width : 200,
					items : [ {
						xtype : 'button',
						text : 'Finish Select',
						handler : function() {
							var grid = gridPanel.target;
							var sm = grid.getSelectionModel();
							var records = sm.getSelection();
							grid.getStore().remove(records);
							Ext.getCmp("selectedVendorGridPanel").getStore().add(records);
						}
					} ]
				});
				gridPanel.addDocked(tbar2);
				var noVendorGridPanel = getPanel(obj_id, "noVendorGridPanel", "No Vendor",3);
				detailPanel.add(selectedGridPanel);
				detailPanel.add(gridPanel);
				detailPanel.add(noVendorGridPanel);
				//loadPanelData(obj_id);
			} else {
				/*var gridPanel = Ext.create('Ext.grid.Panel', {
					id : 'vendorGridPanel',
					title : 'Vendor',
					plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
		 				clicksToEdit : 1,
		 				autoCancel : false,
		 				listeners : {
		 					'beforeedit' : function(me, obj){
		 						return obj.record.get('status')===1;
							},'afteredit' : function(me, obj){
								var record = obj.record,
								oldVal = obj.originalValue;
								if(oldVal!==obj.value && obj.value){
									if(this.reqIdx){
										cometdfn.removeListener(this.reqIdx);
									}
									var param = {};
									if(obj.value instanceof Date){
										param[obj.field] = Ext.Date.format(obj.value, 'Y-m-d');
									}else{
										param[obj.field] = obj.value+'';
									}
									this.reqIdx = cometdfn.request({
										MODULE_TYPE : 'MOD_VENDOR_RESPONSE',
		                        		COMMAND : 'OVERRIDE_SERVICE_SETTING',
		                        		vendorId : record.get('id'),
		                        		param : param
									}, function(message){
										this.reqIdx = null;
										if(message.STATUS === 'error'){
											  alertError(message.customException || message.error.SYSTEM_ERROR)
										  }else{
											  
										  }
									}, function(){
										this.reqIdx = null;
									});
								}
							}
		 				}
		 			})],
					selModel : Ext.create('Ext.selection.CheckboxModel'),
					store : Ext.create('Ext.data.Store', {
						fields : ['crid','crname','site', 'sc', 'soId', 's', 'stName', 'vendorId', 'msiId',
									'vendor', 'capex', 'opex', 'vendorCapex', 'vendorOpex', 'vendorQuantity', 'crCapex', 'crOpex', 'crQuntity',
									'committedDate','requiredDate', 'vendorCommittedDate','status', 'statusText' ],
							data : []
						}),			
					columns : [{
						text : 'Change Request',
						dataIndex : 'crname'
					},{
						text : 'Site',
						dataIndex : 'site'
					}, {
						text : 'Service',
						dataIndex : 's'
					},{
						text : "Service Catalogue",
						dataIndex : "stName"
					}, {
						text : 'Vendor',
						dataIndex : 'vendor'
					}, {
						text : 'Capex',
						editor:{
							xtype : 'numberfield',
						},
						dataIndex : 'vendorCapex',
						renderer : function(val, style, model) {
							return (val && val!=='null') ? val : 'N/A';
						}
					}, {
						text : 'Opex',
						dataIndex : 'vendorOpex',
						editor:{
							xtype : 'numberfield',
						},
						renderer : function(val, style, model) {
							return (val && val!=='null') ? val : 'N/A';
						}
					}, {
						text : 'Quntity',
						dataIndex : 'vendorQuantity',
						editor:{
							xtype : 'numberfield',
						},
						renderer : function(val, style, model) {
							return (val && val!=='null') ? val : 'N/A';
						}
					}, {
						text : 'SA Capex',
						dataIndex : 'capex'
					}, {
						text : 'SA Opex',
						dataIndex : 'opex'
					}, {
						xtype:'datecolumn',
						text : 'Vendor Committed Date',
						dataIndex : 'vendorCommittedDate',
						format:'Y-m-d',
						editor : {
							xtype : 'datefield',
							format:'Y-m-d H:i:s',
							allowBlank : false
						}
					}, {
						xtype:'datecolumn',
						text : 'Approver Committed Date',
						dataIndex : 'committedDate',
					}, {
						xtype:'datecolumn',
						text : 'Required Date',
						dataIndex : 'requiredDate',
					}, {
						text : 'Status',
						dataIndex : 'statusText'
					} ],
					flex:1,
					features: [{ftype:'grouping'}]
				});*/
				
				var gridPanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
					store:{
			            buffered: true,
			            pageSize: 100,
			            autoLoad: true,	            
			            proxy: {
			                type: 'cometd.mutigroup',
			                moduleType : 'MOD_VENDOR_RESPONSE',
			                modules : {
			                	read : {
			               		 	command : 'VENDOR_SERVICE' 
			               		}
			                },
				            extraParams : {		          
				            	id : obj_id
				            },
				            afterRequest : function(response, result){

			            	}	
			            }
					},								
					title:'Vendor',
					id : "vendorGridPanel",
					flex:1,
					plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
		 				clicksToEdit : 1,
		 				autoCancel : false,
		 				listeners : {
		 					'beforeedit' : function(me, obj){
		 						return obj.record.get('changes.serviceOperation.vendorOperation.status')===1;
							},'afteredit' : function(me, obj){
								var record = obj.record,
								oldVal = obj.originalValue;
								if(oldVal!==obj.value && obj.value){
									if(this.reqIdx){
										cometdfn.removeListener(this.reqIdx);
									}
									var param = {};
									if(obj.value instanceof Date){
										param[obj.field] = Ext.Date.format(obj.value, 'Y-m-d');
									}else{
										param[obj.field] = obj.value+'';
									}
									this.reqIdx = cometdfn.request({
										MODULE_TYPE : 'MOD_VENDOR_RESPONSE',
		                        		COMMAND : 'OVERRIDE_SERVICE_SETTING',
		                        		vendorId : record.get('changes.serviceOperation.vendorOperation.id'),
		                        		param : param
									}, function(message){
										this.reqIdx = null;
										if(message.STATUS === 'error'){
											  alertError(message.customException || message.error.SYSTEM_ERROR)
										  }else{
											  
										  }
									}, function(){
										this.reqIdx = null;
									});
								}
							}
		 				}
		 			})]
				});
				
				var tbar = Ext.create('Ext.toolbar.Toolbar', {
					items : [ {
						xtype : 'button',
						text : 'Accept',
						handler : function() {
							/*var sm = gridPanel.getSelectionModel();
							var records = sm.getSelection();
							var soIds = new Array();
							var crids = new Array();
							for ( var i = 0; i < records.length; i++) {
								if(Ext.isEmpty(records[i].get("vendorCommittedDate"))){
									continue;
								}
								var soId = records[i].get("soId");
								var status = records[i].get("status");
								if(status == 1){
									soIds.push(soId);
									crids.push(records[i].get("crid"));
								}
							}
							crids = Ext.Array.unique(crids);
							if(soIds.length == 0){
								return;
							}*/
							cometdfn.request({
								MODULE_TYPE : 'MOD_VENDOR_RESPONSE',
								COMMAND : 'VENDOR_RESPONSE',
//								soIds : soIds,
								selection : gridPanel.getSelectionStatus(),
								id : obj_id,
								operation : "accept"
								//crids : crids
							}, function(message) {
								var data = message['BUSINESS_DATA'] || {};
								if (message.STATUS === 'success') {
									alertSuccess('save success.');
									gridPanel.reload();
								} else if (message.customException) {
									alertError(message.customException);
								} else {
									alertError('save fail');
								}
							});
						}
					}, {
						xtype : 'button',
						text : 'Deny',
						handler : function() {
							/*var sm = gridPanel.getSelectionModel();
							var records = sm.getSelection();
							var soIds = new Array();
							var crids = new Array();
							for ( var i = 0; i < records.length; i++) {
								if(Ext.isEmpty(records[i].get("vendorCommittedDate"))){
									continue;
								}
								var soId = records[i].get("soId");
								var status = records[i].get("status");
								if(status == 1){
									soIds.push(soId);
									crids.push(records[i].get("crid"));
								}
							}
							crids = Ext.Array.unique(crids);
							if(soIds.length == 0){
								return;
							}*/
							cometdfn.request({
								MODULE_TYPE : 'MOD_VENDOR_RESPONSE',
								COMMAND : 'VENDOR_RESPONSE',
								selection : gridPanel.getSelectionStatus(),
								id : obj_id,
								operation : "deny"
								//crids : crids
							}, function(message) {
								var data = message['BUSINESS_DATA'] || {};
								if (message.STATUS === 'success') {
									alertSuccess('save success.');
									gridPanel.reload();
								} else if (message.customException) {
									alertError(message.customException);
								} else {
									alertError('save fail');
								}															
							});
						}
					}, {
						xtype : 'button',
						text : 'Committed Date',
						handler : function() {
							promptDateDialog('Committed Date','Please enter the Committed Date:', function(ok, date){
								if(ok === 'ok'){
									/*var sm = gridPanel.getSelectionModel();
									var records = sm.getSelection();
									var ids = [];
									for ( var i = 0; i < records.length; i++) {
										ids.push(records[i].get('id'));
									}*/
									cometdfn.request({
										MODULE_TYPE : 'MOD_VENDOR_RESPONSE',
		                        		COMMAND : 'SETTING_SERVICE_COMMITTED_DATE',
		                        		selection : gridPanel.getSelectionStatus(),
		                        		id : obj_id,
		                        		committedDate:date
									}, function(message){
										//loadVerdorRespPanel(obj_id);
										gridPanel.reload();
									});
								}
							},this, null, function(date){
								return !!Ext.Date.parseDate(date, 'Y-m-d');
							});
							
//							var soIds = new Array();
//							var crids = new Array();
//							for ( var i = 0; i < records.length; i++) {
//								var soId = records[i].get("soId");
//								var status = records[i].get("status");
//								if(status == 1){
//									soIds.push(soId);
//									crids.push(records[i].get("crid"));
//								}
//							}
//							crids = Ext.Array.unique(crids);
//							if(soIds.length == 0){
//								return;
//							}
//							cometdfn.request({
//								MODULE_TYPE : 'MOD_VENDOR_RESPONSE',
//								COMMAND : 'VENDOR_RESPONSE',
//								soIds : soIds,
//								operation : "accept",
//								crids : crids
//							}, function() {
//								loadVerdorRespPanel(obj_id);
//							});
						}
					},{
						xtype : 'button',
						text : 'Clear Grouping',
						handler : function(){
							gridPanel.target.features[0].cleanGrouping();
						}
					}]
				});
				gridPanel.addDocked(tbar);
				detailPanel.add(gridPanel);
				//loadVerdorRespPanel(obj_id);
			}
	}

	function loadVerdorRespPanel(obj_id) {
		//myLoadMask.show();
		cometdfn.request({
			MODULE_TYPE : 'MOD_VENDOR_RESPONSE',
			COMMAND : 'VENDOR_SERVICE',
			id : obj_id
		}, function(data, Conf) {
			//myLoadMask.hide();
			var status = data.STATUS;
			if (status === "success") {
				var _data = data.BUSINESS_DATA.list;
				var datas = Ext.JSON.decode(_data);
				Ext.getCmp("vendorGridPanel").getStore().loadData(datas);
			} else if (data.customException) {
				alertError(data.customException);
			}
		});
	}

	function loadPanelData(objId) {
		//myLoadMask.show();
		cometdfn
				.request(
						{
							COMMAND : 'COMETD_COMMAND_CANDIDATE_VENDOR',
							MODULE_TYPE : 'MOD_VENDOR',
							id : objId
						},
						function(data, Conf) {
							//myLoadMask.hide();
							var status = data.STATUS;
							if (status === "success") {
								var _selectedVendorList = data.BUSINESS_DATA.selectedVendorList;
								var selectedVendorList = Ext.JSON
										.decode(_selectedVendorList);
								var _data = data.BUSINESS_DATA.vendorList;
								var datas = Ext.JSON.decode(_data);
								var _noVendorList = data.BUSINESS_DATA.noVendorList;
								var noVendorList = Ext.JSON
										.decode(_noVendorList);
								Ext.getCmp("vendorGridPanel").getStore()
										.loadData(datas);
								Ext.getCmp("noVendorGridPanel").getStore()
										.loadData(noVendorList);
								Ext.getCmp("selectedVendorGridPanel")
										.getStore()
										.loadData(selectedVendorList);
							} else if (data.customException) {
								alertError(data.customException);
							}
						});
	}

	function getPanel(obj_id, panelId, title, gno) {
		var gridPanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            pageSize: 100,
	            autoLoad: true,	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_VENDOR',
	                modules : {
	                	read : {
	               		 	command : 'COMETD_COMMAND_CANDIDATE_VENDOR' 
	               		}
	                },
		            extraParams : {		          
		            	id : obj_id,
		            	gno : gno
		            },
		            afterRequest : function(response, result){

	            	}	
	            }
			},		
			flex : 1,
			title : title,
			id : panelId
		});				
		
		/*var gridPanel = Ext.create('Ext.grid.Panel', {
			id : panelId,
			title : title,
			selModel : Ext.create('Ext.selection.CheckboxModel'),
			store : Ext.create('Ext.data.Store', {
				fields : ['crid','crname','site', 'sc', 'soId', 's', "stName", 'state', 'siteType', 'polygon', 'spectrumRegion', 'vendorId', 'msiId',
							'vendor', 'capex', 'opex', 'vendorCapex', 'vendorOpex', 'vendorQuantity', 'crCapex', 'crOpex', 'crQuntity',
							'committedDate','requiredDate', 'vendorCommittedDate','status', 'statusText', 'jvSiteNum', 'siteCode', 'crNo', 'crDesc'],
					data : []
				}),			
			columns : [{
				text : 'Site Number',
				dataIndex : 'siteNo'
			},{
				text : 'Site Name',
				dataIndex : 'site'
			}, {
				text : 'State',
				dataIndex : 'state'
			},{
				text : 'JV Site Number',
				dataIndex : 'jvSiteNum'
			},{
				text : 'Site Code',
				dataIndex : 'siteCode'
			},{
				text : 'Site Type',
				dataIndex : 'siteType'
			},{
				text : 'Spectrum Region',
				dataIndex : 'spectrumRegion'
			},{
				text : 'GNAF Polygon',
				dataIndex : 'polygon'
			},{
				text : 'CR No',
				dataIndex : 'crNo'
			},{
				text : 'CR Name',
				dataIndex : 'crname'
			},{
				text : 'CR Description',
				dataIndex : 'crDesc'
			}, {
				text : 'Service',
				dataIndex : 's'
			}, {
				text : "Service Catalogue",
				dataIndex : "stName"
			}, {
				text : 'Vendor',
				dataIndex : 'vendor'
			}, {
				text : 'Capex',
				dataIndex : 'vendorCapex',
				renderer : function(val) {
					return Ext.isNumber(val) ? val : 'N/A';
				},
				hidden : gno!==1
			}, {
				header : 'Opex',
				dataIndex : 'vendorOpex',
				renderer : function(val, style, model) {
					return Ext.isNumber(val) ? val : 'N/A';
				},
				hidden : gno!==1
			}, {
				text : 'Quantity',
				dataIndex : 'vendorQuantity',
				renderer : function(val, style, model) {
					return Ext.isNumber(val) ? val : 'N/A';
				},
				hidden : gno!==1
			}, {
				text : 'SA Capex',
				dataIndex : 'capex',
				hidden : gno===3
			}, {
				text : 'SA Opex',
				dataIndex : 'opex',
				hidden : gno===3
			}, {
				text : 'SC Capex',
				dataIndex : 'crCapex',
				hidden : gno===3
			}, {
				text : 'SC Opex',
				dataIndex : 'crOpex',
				hidden : gno===3
			}, {
				text : 'SC Quantity',
				dataIndex : 'crQuntity',
				hidden : gno===3
			}, {
				xtype:'datecolumn',
				text : 'Vendor Committed Date',
				dataIndex : 'vendorCommittedDate',
				hidden : gno===3
			}, {
				xtype:'datecolumn',
				text : 'Approver Committed Date',
				dataIndex : 'committedDate',
				hidden : gno===3
			}, {
				xtype:'datecolumn',
				text : 'Required Date',
				dataIndex : 'requiredDate',
				hidden : gno===3
			}, {
				text : 'Status',
				dataIndex : 'statusText',
				hidden : gno!==1
			}],
			flex:1,
			features: [{ftype:'grouping'}]
		});*/

		return gridPanel;
	}
})();
