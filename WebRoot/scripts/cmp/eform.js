(function() {
	Ext.ns("DigiCompass.Web.app.eform");
	
	DigiCompass.Web.app.eform.showEformView = function(){
		var message = {};						
		message.MODULE_TYPE = 'EFORM_MODULE';
		message.COMMAND = 'COMMAND_QUERY_GRID';	
		cometdfn.request(message, function(data, Conf) {
			var status = data.STATUS;
			if (status === "success") {							
				DigiCompass.Web.app.eform.getListData(data, Conf);
			} else if (data.customException) {
				alertError(data.customException);
			}
		});	
	}
	
	DigiCompass.Web.app.eform.getListData = function(data, config) {		
		var fields = ['id', 'name', 'description', 'schId', 'fchId', 'vendorId', 'services'];
		var columns = [{										
					xtype : 'treecolumn',
					header : 'Name',
					dataIndex : 'name'							
				}, {
					text : "Description",
					dataIndex : "description"
				}];
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		DigiCompass.Web.app.eform.showObjExp(columns, fields, datas);
	};
	
	DigiCompass.Web.app.eform.showObjExp = function(columns, fields, datas) {

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}

		var objectExplorer = DigiCompass.Web.app.eform.getObjExp(columns, fields,
				datas);
		objExpPanel.add(objectExplorer);
	};
	
	DigiCompass.Web.app.eform.getTbar = function() {

		return Ext
				.create(
						'Ext.toolbar.Toolbar',
						{
							width : 200,
							items : [
									{
										xtype : 'button',
										text : 'New',
										iconCls : 'icon-add',
										handler : function() {											
											DigiCompass.Web.app.eform
													.showDetailPanel();
										}
									},
									{
										xtype : 'button',
										text : 'Delete',
										iconCls : 'icon-delete',
										handler : function() {
											var checked = Ext
													.getCmp("eformListView").objectExplorer
													.getChecked();
											var ids = new Array();
											if (checked.length == 0) {
												Ext.Msg
														.alert('Warning',
																'Please select a record!');
											} else {
												for ( var i = 0; i < checked.length; i++) {
													ids.push(checked[i].id);
												}
												alertOkorCancel(
														'Are you sure to delete selected eform definition?',
														function(e) {
															if (e == 'yes') {
																var message = {};
																message.ids = ids;
																message.MODULE_TYPE = 'EFORM_MODULE';
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
																						DigiCompass.Web.app.eform.showEformView();
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
						});
	};
	
	DigiCompass.Web.app.eform.getObjExp = function(columns, fields, datas) {
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
					id : 'eformListView',
					module : '',
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
		
		var tbar = DigiCompass.Web.app.eform.getTbar();
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
					DigiCompass.Web.app.eform.showDetailPanel(record.data);
				});

		if (Ext.getCmp('eformListView')) {
			Ext.getCmp('eformListView').reconfigData(datas);
		} else {
			mainPanel.reconfigData(datas);
		}

		return objectExplorer;
	};
	
	DigiCompass.Web.app.eform.showDetailPanel = function(obj) {

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
		var tname = "eForm Definition";
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
		obj = Ext.clone(obj);
		detailPanelAddComponent(detailPanel, obj);
	};
	
	function detailPanelAddComponent(detailPanel, obj){			
		
		var basicForm = DigiCompass.Web.app.eform.getBasicForm(obj);
		detailPanel.add(basicForm);
		var tabPanel = Ext.create('Ext.tab.Panel', {
			activeTab: 0,
			//height : 300,
		    items: [],			    
		    listeners : {
		    	remove : function(_this, component, eOpts ){										    				    		
		    		delService(component.serviceId);
		    	}
		    }
		});
		var serviceChooseForm = DigiCompass.Web.app.eform.serviceFilterForm(tabPanel);
		detailPanel.add(serviceChooseForm);
		detailPanel.add(tabPanel);
		if(obj){
			addServicesPanel(tabPanel, obj.services);
		}
	}
	
	function hierarchyEvents(){
		
	}
	
	DigiCompass.Web.app.eform.getServicePanel = function(param){
		param = param || {}
		var serviceDatas = param.selectionService || {};
		var categoryTypeTree = Ext.create('Ext.tree.Panel', {
	        title : 'Service',
	        id : 'catalogueTree',
	        region : 'center',
	        //margin:'5 0 0 0',
	        autoScroll  : true,
	        collapsible: true,
	        rootVisible: false,
			viewConfig: {
	            plugins: {
	                ddGroup: 'workflowTemplateDragDropGroup',
	                ptype: 'gridviewdragdrop',
	                enableDrop: false
	            }
	        },
	        plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
 				clicksToEdit : 1,
 				autoCancel : false,
 				listeners : {
 					'beforeedit' : function(me, obj){
 						return true;
					},'afteredit' : function(me, obj){
						if(obj.record.get('id') in serviceDatas){
							serviceDatas[obj.record.get('id')][obj.field] = obj.value+'';
						}
					}
 				}
 			})],
	        rootVisible: true,
	        store: Ext.create('Ext.data.TreeStore', {
		    	fields: [ 'name', 'level', 'property','typeId','id','capex','opex','quantity' ],
		        root: { },
		        folderSort: true
		    }),
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 2,
	            sortable: false,
	            dataIndex: 'name'
	        },{
	            text: 'Capex',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'capex',
	            editor : {
	            	xtype : 'numberfield',
	            	allowBlank : false
	            }
	        },{
	            text: 'Opex',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'opex',
	            editor : {
	            	xtype : 'numberfield',
	            	allowBlank : false
	            }
	        },{
	            text: 'Quantity',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'quantity',
	            editor : {
	            	xtype : 'numberfield',
	            	allowBlank : false
	            }
	        }],
	        listeners : {
				checkchange : function(node, checked) {      
					DigiCompass.Web.TreeUtil.checkchild(node,checked);  
					DigiCompass.Web.TreeUtil.checkparent(node);
					selectionService(node, checked);
			    }
	        }
	    });
		var selectionService = function(node, checked){
			if(node.isLeaf()){
				var id = node.get('id');
				if(!checked){
					delete serviceDatas[id];
				}else{
					serviceDatas[id] = {
						id:id,
						name : node.get("name"),
						quantity:(node.get('quantity')||0)+'',
						capex : (node.get('capex')||0)+'',
						opex:(node.get('opex')||0)+''
					}
				}
			}else{
				node.eachChild(function(child) {
					selectionService(child,checked);
				});
			}
		}
		var parentChildTree = Ext.create('Ext.tree.Panel', {
	        title : 'Existing Service Catalogues',
	        id : 'serviceCatalogueTemplate',
	        region : 'west',
	        //margins: '5 5 0 0',
	        width : 180,
	        autoScroll  : true,
	        rootVisible: false,
	        store: Ext.create('Ext.data.TreeStore', {
		    	fields: [ 'name','description','reference'],
		        root: { },
		        folderSort: true
		    }),
	        //the 'columns' property is now 'headers'
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 3,
	            sortable: false,
	            dataIndex: 'name'
	        },{
	            text: 'Description',
	            flex: 2,
	            sortable: false,
	            dataIndex: 'description'
	        }],
	        listeners : {
	        	itemclick : function(grid, record, item, index, event, eOpts) {
					if (Ext.isEmpty(record.data.id)) {
						return;
					}
					cometdfn.request({
						MODULE_TYPE : 'MOD_CHANGE_REQUEST',
						COMMAND : 'COMMAND_QUERY_SERVICE',
						id : record.data.id
					}, function(message){
						var children = Ext.JSON.decode(message.BUSINESS_DATA);
						var capex = 0;
						var opex = 0;
						var quantity = 0;
						checkService(children);
						for(var i = 0 ; i < children.length ;  i++){
							capex = capex + children[i]['capex'];
							opex = opex + children[i]['opex'];
							quantity = quantity + children[i]['quantity'];
						}
						Ext.getCmp('catalogueTree').setRootNode({
							name : record.get('name') ,
							expanded : true,
							checked : false,
							capex : capex ,
							opex : opex ,
							quantity : quantity,
							children : children
						});
						console.log('show:', serviceDatas, children)
						Ext.getCmp('catalogueTree').expandAll();
					});
				}
	        }
	    });
		var checkService = function(nodes){
			for(var j=0; j<nodes.length; j++){
				var node = nodes[j];
				if(node.id in serviceDatas){
					data = serviceDatas[node.id];
					node.checked = true;
					if(data.quantity){
						node.quantity = data.quantity;
					}
					if(data.capex){
						node.capex = data.capex;
					}
					if(data.opex){
						node.opex = data.opex;
					}
				}
				if(node.children && node.children.length>0){
					checkService(node.children);
				}
			}
		}
		var panel = new Ext.panel.Panel({
			frame : false,
			border : false,
			layout: 'border',			
			defaults: {		
				collapsible: true,
			    split: true				    
			},
		    items: [parentChildTree,categoryTypeTree]
		});
		panel.getService = function(){
			return serviceDatas;
		}
		cometdfn.publish({
			MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
			COMMAND : 'COMMAND_QUERY_LIST',
			dataType : 'TreeData',
			categoryTypeId : param.serviceCatalogueHierarchyId,
			fchId:param.financialCategoryGroupId
		});
		return panel;
	}
	
	DigiCompass.Web.app.eform.serviceFilterForm = function(tabPanel){

		var formPanel = Ext.create('Ext.form.Panel', {		    
		    bodyPadding: 5,
		    
		    // Fields will be arranged vertically, stretched to full width
		    layout: 'anchor',
		    
		    // The fields
		    defaultType: 'textfield',
		    items: [{
				xtype : 'button',				
				text : 'Choose Service',
				handler : function() {
					var param = {
						serviceCatalogueHierarchyId : Ext.getCmp("serviceCatalogueHierarchyId").getValue(),
						financialCategoryGroupId : Ext.getCmp("financialCategoryGroupId").getValue()
					};
					var servicePanel = DigiCompass.Web.app.eform.getServicePanel(param);
					var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
					    title: 'Service',					    
					    modal : true,
					    height: 500,
					    width: 700,
					    layout: 'fit',
					    items: [servicePanel],
					    tbar : [{
					    	xtype : 'button',
					    	text  : 'Finish',
					    	iconCls : 'icon-save',
					    	handler : function(){
					    		var serviceDatas = servicePanel.getService();
					    		var empty = true;
					    		for(var i in serviceDatas){
					    			empty = false;
					    		}
					    		if(empty){
					    			Notification.showNotification('No Service Selected!');
					    		}					   
					    		var sdArr = new Array();
					    		for(var p in serviceDatas){
					    			var obj = serviceDatas[p];
					    			obj.serviceId = obj.id;
					    			sdArr.push(obj);
					    		}
					    		addServicesPanel(tabPanel, sdArr)
					    		win.close();
					    	}
					    }]
					});
					win.show();
			}}]	    
		});
		
		return formPanel;
	
	} 
	
	DigiCompass.Web.app.eform.getBasicForm = function(obj){
		var formPanel = Ext.create('Ext.form.Panel', {
			id : "eformDefPanel",
		    bodyPadding: 5,
		    
		    // Fields will be arranged vertically, stretched to full width
		    layout: 'anchor',
		    
		    // The fields
		    defaultType: 'textfield',
		    defaults : {
		    	labelWidth : 200
		    },
		    items: [{
		    	xtype : "hidden",
		    	name : "id"
		    },{
		        fieldLabel: 'Name',
		        name: 'name',
		        allowBlank: false		        
		    },{
		    	xtype : "textarea",		    	
		        fieldLabel: 'Description',
		        name: 'description',
		        anchor: '50%'
		    },Ext.create('DigiCompass.web.UI.ComboBox',{
				id : "serviceCatalogueHierarchyId",				
				name : 'serviceCatalogueHierarchyId',				
				moduleType : 'MOD_WORK_FLOW',				
				moduleCommand : 'COMMAND_QUERY_COMBOX_LIST',
				fieldLabel   : 'Service Catalogue Hierarchy',
				allowBlank   : false,
				editable     : false,
				labelWidth : 200,
				value : obj ? obj.schId : null,
				parseData : function(message){
					var data = Ext.JSON.decode(message['BUSINESS_DATA']['comboList']);
					var d = [];
					for(var i in data){
						d.push([data[i].id, data[i].name]);
					}
					return d;
				},
				listeners : hierarchyEvents
			}),Ext.create('DigiCompass.web.UI.ComboBox',{
				id : "financialCategoryGroupId",
				name 		 : 'financialCategoryGroupId',					
				fieldLabel   : 'Financial Catalogue Hierarchy',
				allowBlank   : false,
				labelWidth : 200,
				displayField : 'name',
				valueField   : 'id',
				moduleType : 'MOD_CHANGE_REQUEST',
				moduleCommand : 'COMMAND_FINANCIAL_CATEGORY_COMBO_DATA',
				value : obj ? obj.fchId : null,
				parseData : function(message){
					var data = Ext.JSON.decode(message['BUSINESS_DATA']['financialCategoryList']);
					var d = [];
					for(var i in data){
						d.push([data[i].id, data[i].name]);
					}
					return d;
				},				
				//value : param.financialCategoryGroupId,
				editable     : false,
				listeners : hierarchyEvents
			}),Ext.create('DigiCompass.web.UI.ComboBox',{				
				name 		 : 'vendor',					
				fieldLabel   : 'Vendor',
				allowBlank   : false,
				displayField : 'name',
				valueField   : 'id',
				labelWidth : 200,
				moduleType : 'USER_MANAGE_MODULE',
				moduleCommand : 'QUERY_ALL_GROUPS',
				value : obj ? obj.vendorId : null,
				parseData : function(message){
					var data = Ext.JSON.decode(message['BUSINESS_DATA']['list']);
					var d = [];
					for(var i in data){
						d.push([data[i].id, data[i].name]);
					}
					return d;
				},
				editable     : false				
			})],

		    // Reset and Submit buttons
		    tbar : [{
		        text: 'Save',
		        iconCls : 'icon-save',
		        handler: function() {
		        	processForm(this, "COMMAND_SAVE");
		        }
		    },{
		        text: 'Reset',
		        handler: function() {
		        	var objExpPanel = Ext.getCmp('obj-details');
					if (objExpPanel) {
						// 移除组建
						objExpPanel.removeAll();
					}
		        }
		    }]		    
		});
		formPanel.services = [];				
		if(obj){
			formPanel.getForm().setValues(obj);			
		}
		return formPanel;
	}
	
	function processForm(btn, command){
		var formPanel = btn.up('form');
        var form = formPanel.getForm();
        if (form.isValid()) {
        	var vals = form.getValues();
			var message = {};						
			message.MODULE_TYPE = 'EFORM_MODULE';
			message.COMMAND = command;
			message.id = vals.id;
			message.name = vals.name;
			message.description = vals.description;
			message.schId = vals.serviceCatalogueHierarchyId;						
			message.fchId = vals.financialCategoryGroupId;
			message.vendor = vals.vendor;
			message.services = formPanel.services;
			console.log(message);						
			cometdfn.request(message, function(message, Conf) {
				var status = message.STATUS;
				if (status === "success") {
					DigiCompass.Web.app.eform.showEformView();
					var objExpPanel = Ext.getCmp('obj-details');
					if (objExpPanel) {
						// 移除组建
						objExpPanel.removeAll();
					}
				} else if (message.customException) {
					alertError(message.customException);
				}
			});
        }
    }
	
	function myClone(obj) {
		if(obj == null || typeof(obj) != 'object') return obj;
		var temp = new obj.constructor();
		for(var key in obj) temp[key] = myClone(obj[key]);
		return temp;
	}
	
	function addServicesPanel(tabPanel, serviceDatas){
		var serviceIds = new Array();
		for(var i = 0; i < serviceDatas.length; i++){
			serviceIds.push(serviceDatas[i].serviceId);
		}
		var message = {};
		message.MODULE_TYPE = 'EFORM_MODULE';
		message.COMMAND = "COMMAND_QUERY_SERVICES";
		message.serviceIds = serviceIds;
		var obj;
		cometdfn.request(message, function(message, conf){
			var status = message.STATUS;
			if (status === "success") {
				var _data = message.BUSINESS_DATA.data;
				var data = Ext.decode(_data);
				for(var j = 0; j < data.length; j++){
					obj = data[j];
					console.log(obj);
					var store = Ext.create('Ext.data.TreeStore', {
				    	fields: [{ name : 'name' , type: 'string' },
				    	         { name : 'description' , type : 'string' },
				    	         { name : 'itemNo' , type : 'string' },
				    	         { name : 'requirements' }],
				        root: {	name:'SOW',
				                iconCls:'task-folder',
				                leaf : true,
				                expanded: true
				        },
				        folderSort: true
				    });
					var panel = Ext.create('Ext.tree.Panel', {
						title : obj.name,
						serviceId : obj.serviceId,
						closable : true,
					    store: store,
					    columns: [{
					        xtype: 'treecolumn', //this is so we know which column will show the tree
					        text: 'Name',
					        flex: 3,
					        sortable: false,
					        dataIndex: 'name'
					    },{
					    	text: 'Description',
					        flex: 3,
					        sortable: false,
					        dataIndex: 'description'
					    },{
					    	text	  : 'Requirement',
					        flex	  : 3,
					        sortable  : false,
					        dataIndex : 'requirements',
					        renderer  : function(value, metaData, record){
					        	var name = '';
					        	var reqs = record.data.requirements;
					        	var arr = new Array();
					        	if(reqs){		        		
					        		for(var i = 0; i < reqs.length; i++){
					        			arr.push(reqs[i].name + ' ('+reqs[i].type+')');		        			
					        		}
					        		name = arr.join(",");
					        	}
					        	return name;
					        }
					    }],
					    listeners : {
							cellclick : function(grid, cellElement, columnNum, record, rowElement, rowNum, e) {
								var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
								if(dataIndex != 'requirements' || !record.isLeaf()){
									return;
								}

								var requirements = record.data.requirements;
								var type = record.data.requirements[0].type;
								var mreqs = getMreqs(obj.serviceId);								
								for(var i = 0; i < requirements.length; i++){
									var reqId = requirements[i].id;									
									if(type == "Text"){
										var reg = requirements[i].ext;
										var content = "";
										if(mreqs[reqId]){
											reg = mreqs[reqId].reg;
											content = mreqs[reqId].content;
										}
										requirements[i].reg = reg; 	
										requirements[i].content = content;										
									} else if(type == "Document"){
										var fileReg = requirements[i].ext;
										var filePath = "";
										if(mreqs[reqId]){
											fileReg = mreqs[reqId].fileReg;
											filePath = mreqs[reqId].filePath;
										}
										requirements[i].fileReg = fileReg;
										requirements[i].filePath = filePath;
									} else if(type == "List"){
										var val = "";
										if(mreqs[reqId]){
											val = mreqs[reqId].value;											
										}
										requirements[i].list = requirements[i].ext.split(",");
										requirements[i].value = val;
									} else if(type == "Equipment"){
										var eqId = requirements[i].ext;
										requirements[i].from = eqId;
										if(mreqs[reqId]){
											var instances = mreqs[reqId].instances;											
											requirements[i].instances = instances;
											var qty = 0;
											for(var p in instances){
												qty += instances[p].length;
											}
											requirements[i].qty = qty;
										} else {
											requirements[i].qty = requirements[i].quantity;																						
											requirements[i].instances = {};
											requirements[i].instances[eqId] = []
											cometdfn.request({
												MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
												COMMAND : 'COMMAND_QUERY_INFO',
												BUSINESS_DATA : eqId
											},function(message){
												var data = Ext.JSON.decode(message.BUSINESS_DATA);											
												data.isInit = true;	
												for(var i = 0; i < requirements.length; i++){
													if(data.id == requirements[i].ext){
														var instanceArr = requirements[i].instances[requirements[i].ext];
														data.id = "";												
														instanceArr.push(data);
														for(var j = 1; j < requirements[i].qty; j++){
															instanceArr.push(myClone(data));
														}													
													}
												}
											});
										}
									}
								}								
								DigiCompass.Web.app.changeRequest.getSowRequirementWindow(record.data.requirements, function(eqs, window){
									if(!ServerMessageProcess(message)){
										return;
									}
									var mreqs = getMreqs(obj.serviceId);
									for(var m = 0; m < eqs.length; m++){
										eqs[m].type = this.getForm().getValues().type;
										mreqs[eqs[m].id] = eqs[m]; 
									}
									window.close();
								}, type, false).show();								
							}
						},
					    rootVisible: false					    			    
					});					
					var sows = Ext.clone(obj.sows);
					if(sows && sows.length > 0){
						var rootNode = sows[0];
						DigiCompass.Web.app.msa.changeRootArrToTree(rootNode);
						panel.setRootNode(rootNode);
					}
					tabPanel.add(panel).show();					
				}
			} else if (message.customException) {
				alertError(message.customException);
			}
		});		
		addServices(serviceDatas);
	}
	
	function getMreqs(serviceId){
		var services = Ext.getCmp("eformDefPanel").services;
		for(var j = 0; j < services.length; j++){
			if(services[j].serviceId == serviceId){
				return services[j].mreqs; 
			}
		}				
	}
	function addServices(serviceDatas){
		var services = Ext.getCmp("eformDefPanel").services;
		for(var j = 0; j < serviceDatas.length; j++){
			var data = serviceDatas[j];
			var mreqs = processReqs(data);					
			services.push({
				serviceId : data.serviceId,
				capex : data.capex,
				opex : data.opex,
				quantity : data.quantity,
				mreqs : mreqs,
				requiredDate : null
			});
		}
	}
	function processReqs(data){
		var mreqs = {};
		if(data.reqIds){
			var reqIds = data.reqIds;
			var requirements = data.requipments;		
			for(var i = 0; i < reqIds.length; i++){
				requirements[i].id = reqIds[i]; 
				if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$Text"){
					requirements[i].type = "Text";
				} else if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$Document"){
					requirements[i].type = "Document";
				} else if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$ListRequipment"){
					requirements[i].type = "List";
				} else if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$Equipment"){
					requirements[i].type = "Equipment";
					var eqId = requirements[i].eqId;
					var instances = requirements[i].instanceRefs; 
					var insObj = {};
					insObj[eqId] = [];
					for(var k = 0; k < instances.length; k++){																								
						insObj[eqId].push({"id" : instances[k].id});
					}
					requirements[i].instances = insObj;
				}
				mreqs[reqIds[i]] = requirements[i];
			}
		}
		return mreqs;
	}
	function delService(serviceId){
		var services = Ext.getCmp("eformDefPanel").services;
		for(var j = 0; j < services.length; j++){
			if(services[j].serviceId == serviceId){
				services.splice(j, 1);
				return;
			}
		}
	}
})();