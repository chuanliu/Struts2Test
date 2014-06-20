(function(){
	Ext.ns("DigiCompass.Web.app.triggering");
	
	function TriggerCr(){
		
	}


	TriggerCr.showView = function(){
		cometdfn.publish({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_FINANCIAL_CATEGORY_COMBO_DATA'
		});
	

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}
		
		var objectExplorer = Ext.create('DigiCompass.Web.app.grid.ObjectExplorer',{
			store:{
	            buffered: true,
	            pageSize: 100,
	            autoLoad: true,	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : "MOD_TRIGGER_CHANGE_REQUEST",
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_QUERY_LIST' 
	               		}
	                },
		            extraParams : {		            			            	
		            },
		            afterRequest : function(response, result){

	            	}	
	            }
			}, listeners : {
				itemclick : function(grid, record, item,
						index, event, eOpts){
				var isChecked = DigiCompass.Web.TreeUtil
						.isCheckChange(event);
					if (isChecked) {
						return;
					}
					if (Ext.isEmpty(record.data.id)) {
						return;
					}
					//TriggerCr.showDetailPanel(record.data);
					Ext.getCmp('obj-details').removeAll();
					DigiCompass.Web.UI.Wheel.showDetail();
					DigiCompass.Web.app.changeRequest.showEquipmentView(record.data.id, record.data.name);
				}
			}		
		});
		
		objectExplorer.target.addDocked(Ext
				.create(
						'Ext.toolbar.Toolbar',
						{
							width : 200,
							items : [
									{
										xtype : 'button',
										text : 'Delete',
										iconCls : 'icon-delete',
										handler : function() {
											var sm = objectExplorer.target.getSelectionModel();
											var records = sm.getSelection();
											var ids = new Array();
											if (records.length == 0) {
												Ext.Msg
														.alert('Warning',
																'Please select a record!');
											} else {
												for ( var i = 0; i < records.length; i++) {
													ids.push(records[i].get("id"));
												}
												alertOkorCancel(
														'Are you sure to delete selected trigger cr?',
														function(e) {
															if (e == 'yes') {
																var message = {};
																message.ids = ids;
																message.MODULE_TYPE = 'MOD_TRIGGER_CHANGE_REQUEST';
																message.COMMAND = 'COMMAND_DEL';
																cometdfn
																		.request(
																				message,
																				function(
																						data,
																						Conf) {
																					var status = data.STATUS;
																					if (status === "success") {
																						Ext
																								.getCmp(
																										'obj-details')
																								.removeAll();
																						objectExplorer.reload();
																						alertSuccess('Delete Data Successful!');
																					} else if (data.customException) {
																						alertError(data.customException);
																					}
																				});
															}
														});
											}
										}
									}]
						}));
		
		objExpPanel.add(objectExplorer);
	}
	
	TriggerCr.getObjExp = function(columns, fields, datas){
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
					id : 'tcrListView',
					module : 'MOD_TRIGGER_CHANGE_REQUEST',
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
		
		var tbar = TriggerCr.getTbar();
		objectExplorer.addDocked(tbar);

		objectExplorer.on('checkchange', function(node, checked) {
					objectExplorer.checkchild(node, checked);
					objectExplorer.checkparent(node);
				});

		objectExplorer.addListener('itemclick', function(grid, record, item,
						index, event, eOpts) {
					var isChecked = DigiCompass.Web.TreeUtil
							.isCheckChange(event);
					if (isChecked) {
						return;
					}
					if (Ext.isEmpty(record.data.id)) {
						return;
					}
					//TriggerCr.showDetailPanel(record.data);
					DigiCompass.Web.app.changeRequest.showEquipmentView(record.data.id, record.data.name);
				});

		if (Ext.getCmp('tcrListView')) {
			Ext.getCmp('tcrListView').reconfigData(datas);
		} else {
			mainPanel.reconfigData(datas);
		}

		return objectExplorer;
	}
	
	TriggerCr.showDetailPanel = function(obj) {

		var objDetailPanel = Ext.getCmp('obj-details');
		if (objDetailPanel) {
			// 移除组建
			objDetailPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var detailPanel = Ext.create('Ext.panel.Panel', {
					layout : {
						type : 'vbox',
						align : 'stretch'
					}
				});		
		var version = "";
		var obj_id = "";
		var tname = "Trigger CR ";
		var ptitle = "Object Detail - " + tname;
		if (obj) {
			version = obj.name;
			obj_id = obj.id;
			ptitle = ptitle + "(" + version + ")";
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
	};
	
	TriggerCr.showTriggerCr = function(data){
		TriggerCr.popRenderId = data.renderTo;
		Ext.getCmp(data.renderTo).on("close", function(){			
			TriggerCr.popRenderId = null;
		});
		cometdfn.publish({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_FINANCIAL_CATEGORY_COMBO_DATA'
		});
		DigiCompass.Web.app.changeRequest.showEquipmentView(data.BUSINESS_DATA.id, data.BUSINESS_DATA.name);		
	}
	
	DigiCompass.Web.app.triggering.TriggerCr = TriggerCr;
})()
