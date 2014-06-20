(function() {
	Ext.ns("DigiCompass.Web.app.eo");
	
	Ext.define('DigiCompass.Web.app.eo.grid.column.EOLink', {
	    extend: 'Ext.grid.column.Column',
	    alias: ['widget.eolink'],
	    link : true,
	    defaultRenderer: function(value, style, record){
	    	this.link = true;
			if(record.get("status") != "N/A" || record.get("desc") != "N/A"){
		        myURL = '';
		        if(value !== ''){
		            myURL = '<a href="javascript:void(0)">' + value +'</a>';
		        }
		        return myURL;
			} else {
				return value;
			}
	    }
	});
	
	Ext.define('DigiCompass.Web.app.eo.grid.column.MOLink', {
	    extend: 'Ext.grid.column.Column',
	    alias: ['widget.molink'],
	    defaultRenderer: function(value, style, record){
			if(record.get("date_created") != "N/A"){
		        myURL = '';
		        if(value !== ''){
		            myURL = '<a href="javascript:void(0)">' + value +'</a>';
		        }
		        return myURL;
			} else {
				return value;
			}
	    }
	});
	
	Ext.define('DigiCompass.Web.app.eo.grid.column.POLink', {
	    extend: 'Ext.grid.column.Column',
	    alias: ['widget.polink'],
	    defaultRenderer: function(value, style, record){
			if(record.get("orderDate") != "N/A"){
		        myURL = '';
		        if(value !== ''){
		            myURL = '<a href="javascript:void(0)">' + value +'</a>';
		        }
		        return myURL;
			} else {
				return value;
			}
	    }
	});

	cometdfn.registFn({
				MODULE_TYPE : "SAP_ORDER_MODULE",
				COMMAND : 'COMMAND_QUERY_LIST',
				callbackfn : function(message, config) {
					if (message.renderTo) {

					} else {
						DigiCompass.Web.app.eo.getListData(message, config);
					}

				},
				Config : {}
			});

	cometdfn.registFn({
				MODULE_TYPE : "BORIS_ORDER_MODULE",
				COMMAND : 'COMMAND_QUERY_LIST',
				callbackfn : function(message, config) {
					if (message.renderTo) {

					} else {
						DigiCompass.Web.app.eo.getListData(message, config);
					}

				},
				Config : {}
			});
	
	cometdfn.registFn({
		MODULE_TYPE : "MATERIAL_ORDER_MODULE",
		COMMAND : 'COMMAND_QUERY_LIST',
		callbackfn : function(message, config) {
			if (message.renderTo) {

			} else {
				DigiCompass.Web.app.eo.getListData(message, config);
			}

		},
		Config : {}
	});

	DigiCompass.Web.app.eo.getListData = function(data, config) {
		DigiCompass.Web.app.eo.message = data;
		var fields = ['id', 'name', 'number', 'description', 'reference'];
		var columns = [{
					xtype : 'treecolumn',
					header : 'Change Request',
					dataIndex : 'name',
					sortable : false,
					flex : 1
				}, {
					text : "Number",
					dataIndex : "number"
				}];
		var _data = data.BUSINESS_DATA.list;		
		var datas = Ext.JSON.decode(_data);
		var searchKeys = data.BUSINESS_DATA.searchKeys;
		DigiCompass.Web.app.eo.showObjExp(columns, fields, datas, searchKeys);
	};

	DigiCompass.Web.app.eo.showObjExp = function(columns, fields, datas, searchKeys) {

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}

		var objectExplorer = DigiCompass.Web.app.eo.getObjExp(columns, fields,
				datas, searchKeys);
		objExpPanel.add(objectExplorer);
	};

	DigiCompass.Web.app.eo.getObjExp = function(columns, fields, datas, searchKeys) {
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
					id : 'eoListView',
					module : DigiCompass.Web.app.eo.message.MODULE_TYPE,
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
					var isChecked = DigiCompass.Web.TreeUtil
							.isCheckChange(event);
					if (isChecked) {
						return;
					}
					if (Ext.isEmpty(record.data.id)) {
						return;
					}
					DigiCompass.Web.app.eo.showDetailPanel(record.data);
				});

		if (Ext.getCmp('eoListView')) {
			Ext.getCmp('eoListView').reconfigData(datas);
		} else {
			mainPanel.reconfigData(datas);
		}

		return objectExplorer;
	};

	DigiCompass.Web.app.eo.showDetailPanel = function(obj) {

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
		var message = DigiCompass.Web.app.eo.message;
		var optype;
		if (message.MODULE_TYPE == "SAP_ORDER_MODULE") {
			optype = 1;
		} else if(message.MODULE_TYPE == "BORIS_ORDER_MODULE"){
			optype = 2;
		} else {
			optype = 3;
		}
		var version = "";
		var obj_id = "";
		var tname = "";
		if(optype == 1){
			tname = "Purchase Orders ";
		} else if(optype == 2){
			tname = "Engineering Orders ";
		} else if(optype == 3){
			tname = "Material Orders ";
		}
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
		detailAddPanel(optype, detailPanel, message, obj_id);
		//loadPanelData(optype, detailPanel, obj_id);
	};

	function detailAddPanel(optype, detailPanel, message, obj_id) {
		var fields = ['id', 'name', 'changes.site.name',
				'changes.serviceOperation.workflowTemplate.name',
				'changes.serviceOperation.id',
				'changes.serviceOperation.serviceCatalogue.name', 'no', 'vendorName'];
		var columns = [{
					text : 'Change Request',
					dataIndex : 'name'
				}, {
					text : 'Site',
					dataIndex : 'changes.site.name'
				}, {
					text : 'Service',
					dataIndex : 'changes.serviceOperation.serviceCatalogue.name'
				},{
					text : 'Assigned Supplier',
					dataIndex : 'vendorName'					
				}, {
					text : 'No',
					dataIndex : 'no'
				}];
		var rfields = Ext.clone(fields);
		rfields.push("odId");
		var rcolumns = Ext.clone(columns);

		if (optype == 2) {
			rfields.push("eoId");
			rfields.push("status");
			rfields.push("desc");
			rfields.push('lastSignedTask');
			rfields.push('signedDate');
			rcolumns.push({
						text : 'Engineering Order',
						dataIndex : 'eoId',
						menuDisabled : true,
						renderer : function(value, metaData, record){
							if(record.get("status") || record.get("desc")){
						        myURL = '';
						        if(value !== ''){
						            myURL = '<a href="javascript:void(0)">' + value +'</a>';
						        }
						        return myURL;
							} else {
								return value;
							}
					    }
					});
			rcolumns.push({
						text : 'Order Status',
						dataIndex : 'status',
						renderer : function(value, cellmeta, record, rowIndex,
								columnIndex, store) {
							if (value == null || value.length == 0) {
								return 'N/A'
							} else {
								return value;
							}
						}
					});
			rcolumns.push({
						text : 'Product Description',
						dataIndex : 'desc',
						renderer : function(value, cellmeta, record, rowIndex,
								columnIndex, store) {
							if (value == null || value.length == 0) {
								return 'N/A'
							} else {
								return value;
							}
						}
					});
			rcolumns.push({								
				text : "Last Signed Task",
				dataIndex : "lastSignedTask"				
			});
			rcolumns.push({				
				text : "Date",
				dataIndex : "signedDate"				
			});
		} else if(optype == 1){
			rfields.push("sapNo");
			rfields.push("orderNumber")
			rfields.push("orderDate")
			rfields.push("vendorNumber")
			rcolumns.push({
				text : 'Order Number',
				dataIndex : 'sapNo',
				renderer : function(value, metaData, record){
					if(record.get("orderDate")){
				        myURL = '';
				        if(value !== ''){
				            myURL = '<a href="javascript:void(0)">' + value +'</a>';
				        }
				        return myURL;
					} else {
						return value;
					}
			    }
			});
			rcolumns.push({
				text : 'Order Date',
				dataIndex : 'orderDate',
				renderer : function(value, cellmeta, record, rowIndex,
						columnIndex, store) {
					if (value == null || value.length == 0) {
						return 'N/A'
					} else {
						return value;
					}
				}
			});
			rcolumns.push({
				text : 'Vendor Number',
				dataIndex : 'vendorNumber',
				renderer : function(value, cellmeta, record, rowIndex,
						columnIndex, store) {
					if (value == null || value.length == 0) {
						return 'N/A'
					} else {
						return value;
					}
				}
			});
		} else if(optype == 3){
			rfields.push("materialNo");
			rfields.push("date_created");
			rcolumns.push({
				text : 'Order Number',
				dataIndex : 'materialNo',
				renderer : function(value, metaData, record){
					if(record.get("date_created")){
				        myURL = '';
				        if(value !== ''){
				            myURL = '<a href="javascript:void(0)">' + value +'</a>';
				        }
				        return myURL;
					} else {
						return value;
					}
			    }
			});
		}

		//var crPanel = DigiCompass.Web.app.eo.getPanel("referencedServicePanel", "Referenced", rfields, rcolumns);
		var crPanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            pageSize: 100,
	            autoLoad: true,	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'SAP_ORDER_MODULE',
	                modules : {
	                	read : {
	               		 	command : 'EQUIPMENT_ORDER' 
	               		}
	                },
		            extraParams : {		          
						changeRequestId : obj_id,
						optype : optype,
						gridType : 1
		            },
		            afterRequest : function(response, result){

	            	}	
	            }
			},			
			useSearch : false,
			title:'Referenced',
			id : "referencedServicePanel",
			flex : 1
		});
		var tbar1 = Ext.create('Ext.toolbar.Toolbar', {
			items : [{
				xtype : 'button',
				text : 'Edit',
				handler : function() {
					var grid = this.up("panel").datagrid;
					var sm = grid.getSelectionModel();
					var records = sm.getSelection();
					if (records.length != 1) {
						Notification
								.showNotification("please select one record");
						return;
					}

					var record = records[0];
					var soid = record.get("changes.serviceOperation.id");
					var selectNo = record.get("no");
					var odid = record.get("odId");
					var odName = record.get("eoId");

					var selectName = record.get("name");
					var changesSiteName = record.get("changes.site.name");
					var catalogueName = record
							.get("changes.serviceOperation.serviceCatalogue.name");

					var newDatas = new Array();
					var datas = grid.getStore().data.items;
					for (var i = 0; i < datas.length; i++) {
						var temp = datas[i].data;
						newDatas[i] = temp
					}

					var datas = [];
					for (var i = 0; i < newDatas.length; i++) {
						if (selectNo == newDatas[i].no
								&& selectName == newDatas[i].name
								&& changesSiteName == newDatas[i]['changes.site.name']
								&& catalogueName == newDatas[i]['changes.serviceOperation.serviceCatalogue.name']) {
							var orderno;
							if(optype == 2){
								orderno = newDatas[i].eoId;
							} else if(optype == 1) {
								orderno = newDatas[i].sapNo;
							} else if(optype == 3){
								orderno = newDatas[i].materialNo;
							}
							datas.push({
										name : orderno 
									});
						}
					}
					datas.push({
								name : null
							});
					var gridPanel = DigiCompass.Web.app.eo.getDataPanel(optype,
							datas, "Edit", detailPanel, message, obj_id);
					DigiCompass.Web.app.eo.showWin(gridPanel);
				}
			}, {
				xtype : 'button',
				text : 'Remove',
				handler : function() {
					var grid = this.up("panel");
					/*var sm = grid.datagrid.getSelectionModel();
					var records = sm.getSelection();
					if (records.length == 0) {
						return;
					}

					var datas = new Array();
					for (var i = 0; i < records.length; i++) {
						var record = records[i];
						var soid = record.get("changes.serviceOperation.id");
						var no = record.get("no");
						var odid = record.get("odId");
						datas.push({
									soid : soid,
									no : no,
									odid : odid
								});
					}*/
					cometdfn.request({
						MODULE_TYPE : DigiCompass.Web.app.eo.message.MODULE_TYPE,
						COMMAND : 'COMMAND_DEL',
						changeRequestId : obj_id,
						//datas : datas
						selection : grid.getSelectionStatus()
					}, function(message, conf) {
						var data = message['BUSINESS_DATA'] || {};
						if (message.STATUS === 'success'
								&& data.rv === 'success') {
							//loadPanelData(optype, detailPanel, obj_id);
							Ext.getCmp("servicePanel").reload();
							Ext.getCmp("referencedServicePanel").reload();
							alertSuccess('save success.');
						} else if (message.customException) {
							alertError(message.customException);
						} else {
							alertError('save fail');
						}
					});
				}
			}]
		});
		crPanel.addDocked(tbar1);
		if(optype == 2){
			crPanel.target.on("cellclick", function(grid, cellElement, columnNum, record,
					rowElement, rowNum, e) {
				var fieldName = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
				if(fieldName == 'eoId'){
						var status = record.get("status");
						var desc = record.get("desc");
						if (status != "N/A" || desc != "N/A") {
							cometdfn.request({
										MODULE_TYPE : "BORIS_ORDER_MODULE",
										COMMAND : 'COMMAND_QUERY_ORDER_INFO',
										eoId : record.get("eoId")
									}, function(data, Conf) {
										var status = data.STATUS;
										if (status === "success") {
											DigiCompass.Web.app.eo
													.showPoDetailPanel(Ext.JSON
															.decode(data.BUSINESS_DATA));
										} else if (data.customException) {
											alertError(data.customException);
										}
										grid.opening = false;
									});
						}
					}
			});
		} else if(optype == 1){
			crPanel.target.on("cellclick", function(self, td, cellIndex, record, tr, rowIndex, e, eOpts){
				var fieldName = self.getHeaderCt().getHeaderAtIndex(cellIndex).dataIndex;
				if(fieldName == 'sapNo'){
					var sapNo = record.get("sapNo");
					var orderDate = record.get("orderDate");
					if(orderDate != "N/A"){
						DigiCompass.Web.app.eo.showSapDetailPanel(sapNo);
					}
				}
			});
		} else if(optype == 3){
			crPanel.target.on("cellclick", function(self, td, cellIndex, record, tr, rowIndex, e, eOpts){
				var fieldName = self.getHeaderCt().getHeaderAtIndex(cellIndex).dataIndex;
				if(fieldName == 'materialNo'){
					var materialNo = record.get("materialNo");
					var date_created = record.get("date_created");
					if(date_created != "N/A"){					
						DigiCompass.Web.app.eo.showMaterialDetailPanel(materialNo);
					}
				}
			});			
		}
		detailPanel.add(crPanel);

		//var servicePanel = DigiCompass.Web.app.eo.getPanel("servicePanel", "Service", fields, columns);
		var servicePanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            pageSize: 100,
	            autoLoad: true,	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'SAP_ORDER_MODULE',
	                modules : {
	                	read : {
	               		 	command : 'EQUIPMENT_ORDER' 
	               		}
	                },
		            extraParams : {		          
						changeRequestId : obj_id,
						optype : optype,
						gridType : 2
		            },
		            afterRequest : function(response, result){

	            	}	
	            }
			},			
			useSearch : false,
			title:'Service',
			id : "servicePanel",
			flex : 1
		});
		var servicePanelTbar = Ext.create('Ext.toolbar.Toolbar', {
					items : [{
						xtype : 'button',
						text : 'Reference',
						handler : function() {							
							var records = servicePanel.datagrid.getSelectionModel().getSelection();
							if (records.length == 0) {
								Notification
										.showNotification("please select one record");
								return;
							}

							var datas = [{
										name : null
									}];
							var gridPanel = DigiCompass.Web.app.eo
									.getDataPanel(optype, datas, "New",
											detailPanel, message, obj_id);
							DigiCompass.Web.app.eo.showWin(gridPanel);
						}
					}]
				});
		servicePanel.addDocked(servicePanelTbar);
		detailPanel.add(servicePanel);
	}

	DigiCompass.Web.app.eo.showWin = function(panel) {
		Ext.create('DigiCompass.Web.app.AutosizeWindow', {
					title : 'Orders',
					height : 400,
					width : 600,
					layout : 'fit',
					border : false,
					items : panel,
				    listeners: {
				        beforeclose: function(win) {
				        	win.down("gridpanel").getPlugin().cancelEdit();				            
				        }
				    }
				}).show();
	}

	function loadPanelData(optype, detailPanel, objId) {
		// var myLoadMask = new Ext.LoadMask(detailPanel, {msg:"Please
		// wait..."});
		// myLoadMask.show();
		cometdfn.request({
					MODULE_TYPE : 'SAP_ORDER_MODULE',
					COMMAND : 'EQUIPMENT_ORDER',
					changeRequestId : objId,
					optype : optype
				}, function(data, Conf) {
					// myLoadMask.hide();
					var status = data.STATUS;
					if (status === "success") {
						var _data = data.BUSINESS_DATA.list;
						var datas = Ext.JSON.decode(_data);
						Ext.getCmp("servicePanel").getStore().loadData(datas);
						var _referencedList = data.BUSINESS_DATA.referencedList;
						var referencedList = Ext.JSON.decode(_referencedList);
						Ext.getCmp("referencedServicePanel").getStore()
								.loadData(referencedList);
					} else if (data.customException) {
						alertError(data.customException);
					}
				});
	}

	DigiCompass.Web.app.eo.getPanel = function(cmpId, title, fields, columns) {

		var store = Ext.create('Ext.data.Store', {
					fields : fields,
					data : []
				});

		var sm = Ext.create('Ext.selection.CheckboxModel', {
					checkOnly : true
				});

		var gridPanel = Ext.create('Ext.grid.Panel', {
					id : cmpId,
					title : title,
					selModel : sm,
					store : store,
					columns : columns,
					flex : 1,
					features : [{
								ftype : 'grouping'
							}]
				});

		return gridPanel;
	}

	DigiCompass.Web.app.eo.getDataPanel = function(optype, datas, action,
			detailPanel, message, obj_id) {

		var store = Ext.create('Ext.data.Store', {
					fields : ["name"],
					data : datas,
					listeners : {
						update : function(store) {
							var last = store.getAt(store.getCount() - 1).data;
							var flag = false;
							for (var i in last) {
								if (!Ext.isEmpty(last[i])) {
									flag = true;
									break;
								}
							}
							if (flag) {
								store.insert(store.getCount(), [{
													name : null
												}]);
							}
						}
					}
				});

		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				});

		var gridPanel = Ext.create('Ext.grid.Panel', {
			id : "orderInfoPanel",
			plugins : [cellEditing],
			store : store,
			columns : [{
						text : 'Name',
						dataIndex : 'name',
						width : 400,
						editor : {
							xtype : 'textfield'
						}
					}, {
						menuDisabled : true,
						sortable : false,
						xtype : 'actioncolumn',
						width : 50,
						items : [{
									icon : './styles/cmp/images/delete.png', // Use
									// a
									// URL
									// in
									// the
									// icon
									// config
									tooltip : 'Remove',
									handler : function(grid, rowIndex, colIndex) {
										store.removeAt(rowIndex);
									}
								}]
					}],
			flex : 1,
			features : [{
						ftype : 'grouping'
					}],
			tbar : [{
				xtype : 'button',
				text : 'Save',
				handler : function() {
					var grid;
					if (action == "New") {
						grid = Ext.getCmp("servicePanel");
					} else {
						grid = Ext.getCmp("referencedServicePanel");
					}
					/*var sm = grid.datagrid.getSelectionModel();					
					var records = sm.getSelection();
					if (records.length == 0) {
						return;
					}
					var data = new Array();
					var soids = new Array();
					for (var i = 0; i < records.length; i++) {
						var record = records[i];
						var soid = record.get("changes.serviceOperation.id");
						var no = record.get("no");
						soids.push({
									soid : soid,
									no : no
								});
					}*/

					var store = this.up("grid").getStore();
					var orderIds = new Array();
					store.each(function(record) {
								var name = record.get("name");
								if (name) {
									orderIds.push(name);
								}
							});
					if (orderIds.length == 0) {
						return;
					}
					cometdfn.request({
						MODULE_TYPE : DigiCompass.Web.app.eo.message.MODULE_TYPE,
						COMMAND : 'COMMAND_SAVE',
						changeRequestId : obj_id,
						selection : grid.getSelectionStatus(),
						orderIds : orderIds,
						optype : optype
					}, function(message, conf) {
						var data = message['BUSINESS_DATA'] || {};
						if (message.STATUS === 'success'
								&& data.rv === 'success') {
							//loadPanelData(optype, detailPanel, obj_id);
							Ext.getCmp("servicePanel").reload();
							Ext.getCmp("referencedServicePanel").reload();
							alertSuccess('save success.');
						} else if (message.customException) {
							alertError(message.customException);
						} else {
							alertError('save fail');
						}
					});
					this.up("window").close();
				}
			}]
		});

		return gridPanel;
	}

	DigiCompass.Web.app.eo.showPoDetailPanel = function(data) {
		var eoInfoForm = Ext.create('Ext.form.Panel', {
					id : 'orderInfo',
					width : 400,
					height : 300,
					autoScroll : true,
					layout : 'anchor',
					defaults : {
						anchor : '99%',
						margin : '3 0 0 3'
					},
					fieldDefaults : {
						labelWidth : 150
					},
					items : [{
								xtype : 'textfield',
								fieldLabel : 'Order Number',
								name : 'no',
								readOnly : true
							}, {
								xtype : 'textfield',
								fieldLabel : 'Order Status',
								name : 'status',
								readOnly : true
							}, {
								xtype : 'textfield',
								fieldLabel : 'Product Description',
								name : 'desc',
								readOnly : true
							}, {
								xtype : 'textareafield',
								fieldLabel : 'Service Screen Comments',
								name : 'comment',
								readOnly : true
							}]
				});
		eoInfoForm.getForm('orderInfo').setValues(data.EoInfo);

		var refOrderGrid = Ext.create('Ext.grid.Panel', {
					id : 'refOrderGrid',
					title : 'References Orders',
					width : 400,
					height : 300,
					autoScroll : true,
					store : {
						fields : ['refNo', 'status', 'desc', 'relation'],
						sorters : ['refNo'],
						data : data.RefOrder
					},
					columns : [{
								width : 'fit',
								text : 'References Order',
								dataIndex : 'refNo'
							}, {
								width : 'fit',
								text : 'Status',
								dataIndex : 'status'
							}, {
								width : 'fit',
								text : 'Product',
								dataIndex : 'desc'
							}, {
								width : 'fit',
								text : 'Relation',
								dataIndex : 'relation'
							}]
				});

		var attrGrid = Ext.create('Ext.grid.Panel', {
					id : 'attrGrid',
					title : 'Engineering Orders Attributes',
					width : 400,
					height : 300,
					autoScroll : true,
					store : {
						fields : ['name', 'value'],
						sorters : ['name'],
						data : data.Attr
					},
					columns : [{
								width : 'fit',
								text : 'Attribute Name',
								dataIndex : 'name'
							}, {
								width : 'fit',
								text : 'Value',
								dataIndex : 'value'
							}]
				});

		var taskGrid = Ext.create('Ext.grid.Panel', {
					id : 'taskGrid',
					title : 'Engineering Orders Tasks',
					width : 400,
					height : 300,
					autoScroll : true,
					store : {
						fields : ['name', 'revicedDate', 'signoffDate'],
						sorters : ['name'],
						data : data.Task
					},
					columns : [{
								width : 'fit',
								text : 'Task Name',
								dataIndex : 'name'
							}, {
								width : 'fit',
								text : 'Reviced Date',
								dataIndex : 'revicedDate',
								renderer : function(value, cellmeta, record,
										rowIndex, columnIndex, store) {
									return Ext.util.Format.date(value, 'Y-m-d');
								}
							}, {
								width : 'fit',
								text : 'Signoff Date',
								dataIndex : 'signoffDate',
								renderer : function(value, cellmeta, record,
										rowIndex, columnIndex, store) {
									return Ext.util.Format.date(value, 'Y-m-d');
								}
							}]
				});

		var mainWindow = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
					title : 'Engineering Orders Info',
					width : 830,
					height : 560,
					modal : true,
					resizable : false,
					layout : {
						type : 'table',
						columns : 2
					},
					items : [eoInfoForm, refOrderGrid, attrGrid, taskGrid]
				}).show();
	}
	
	DigiCompass.Web.app.eo.showSapDetailPanel = function(sapNo){
		var panel = Ext.create("Ext.form.Panel", {
			flex : 1,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Order Number',
				name : 'poNumber',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : 'Order Date',
				name : 'DOC_DATE',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : 'Vendor Number',
				name : 'VENDOR_NUM',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : 'Vendor Name',
				name : 'VEND_NAME',
				readOnly : true
			},{
				xtype : 'textfield',
				fieldLabel : 'Purchase Order Value',
				name : "POVALUE",
				readOnly : true
			},{
				xtype : 'textfield',
				fieldLabel : 'Accrued Amount',
				name : 'ACCRUED_AMOUNT',
				readOnly : true
			},{
				xtype : 'textfield',
				fieldLabel : 'Open Amount',
				name : 'OPEN_AMOUNT',
				readOnly : true
			}]
		});		
				
		/*var commitmentStore = Ext.create('Ext.data.Store', {
			fields : ['ITEM_NUM','WBS','COST_ELEM','COST_ELEM_DESC','TOT_VALUE','DEBIT_DATE'],
			data : []
		});		

		var commitmentGridPanel = Ext.create('Ext.grid.Panel', {
			id : "commitmentGridPanel",
			title : "Commitment",
			store : commitmentStore,
			columns : [{
				text : 'ITEM_NUM',
				dataIndex : 'ITEM_NUM'
			},{
				text : 'WBS',
				dataIndex : 'WBS'
			},{
				text : 'COST_ELEM',
				dataIndex : 'COST_ELEM'
			},{
				text : 'COST_ELEM_DESC',
				dataIndex : 'COST_ELEM_DESC'
			},{
				text : 'TOT_VALUE',
				dataIndex : 'TOT_VALUE'
			},{
				text : 'DEBIT_DATE',
				dataIndex : 'DEBIT_DATE'
			}]			
		});*/
		
		var commitmentGridPanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            pageSize: 100,
	            autoLoad: true,	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : "SAP_ORDER_MODULE",
	                modules : {
	                	read : {
	               		 	command : 'SAP_ORDER_COMMITMENT_INFO' 
	               		}
	                },
		            extraParams : {		            	
		            	sapNo : sapNo
		            },
		            afterRequest : function(response, result){

	            	}	
	            }
			},
			autoCheckBox: false,
			title:'Commitment'			
		});
		
		var actualtStore = Ext.create('Ext.data.Store', {
			fields : ['PONUMBER','PURCH_DOCITEM','PROJ_NUM','WBS','MAT_GROUP','MAT_NUM',"COST_ELEM","CE_DESC","COSTCTR","CCTR_DESC","MAT_DESC","CO_CURR_VALUE","INVVAL","POST_DATE"],
			data : []
		});														

		var actualGridPanel = Ext.create('Ext.grid.Panel', {
			id : "actualGridPanel",
			title : "Actual",
			store : actualtStore,
			columns : [{
				text : 'PO Number',
				dataIndex : 'PONUMBER'
			},{
				text : 'Item',
				dataIndex : "PURCH_DOCITEM"
			},{
				text : 'Project',
				dataIndex : "PROJ_NUM"
			},{
				text : 'WBS',
				dataIndex : 'WBS'
			},{
				text : 'Material Group',
				dataIndex : 'MAT_GROUP'
			},{
				text : 'Material',
				dataIndex : 'MAT_NUM'
			},{
				text : 'Cost Element',
				dataIndex : 'COST_ELEM'
			},{
				text : 'CE Description',
				dataIndex : 'CE_DESC'
			},{
				text : 'Cost Centre',
				dataIndex : 'COSTCTR'
			},{
				text : 'CC Description',
				dataIndex : 'CCTR_DESC'
			},{
				text : 'Short Text',
				dataIndex : 'MAT_DESC'
			},{
				text : 'Value',
				dataIndex : 'CO_CURR_VALUE'
			},{
				text : 'Invoice',
				dataIndex : 'INVVAL'
			},{
				text : 'Date',
				dataIndex : 'POST_DATE'
			}]			
		});
		
		var tabPanel = Ext.create('Ext.tab.Panel', {
			flex : 1,
		    activeTab: 0,
		    //bodyPadding: 10,
		    tabPosition: 'bottom',
		    items: [commitmentGridPanel,actualGridPanel]		    
		});
		
		var win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
			id : "sapOdDetailWindow",
			title : "SAP Order Detail",
			height : 600,
			width : 800,
			modal : true,
			//autoScroll : true,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ panel,tabPanel]
		});
		win.show();
		cometdfn.request({
			MODULE_TYPE : 'SAP_ORDER_MODULE',
			COMMAND : 'SAP_ORDER_INFO',
			sapNo : sapNo						
		}, function(data, Conf) {
			var status = data.STATUS;
			if (status === "success") {
				var _data = data.BUSINESS_DATA;										
				panel.getForm().setValues(_data);
			} else if (data.customException) {
				alertError(data.customException);
			}
		});	
		/*cometdfn.request({
			MODULE_TYPE : DigiCompass.Web.app.eo.message.MODULE_TYPE,
			COMMAND : 'SAP_ORDER_COMMITMENT_INFO',
			sapNo : sapNo
		}, function(message, conf) {
			var data = message['BUSINESS_DATA'] || {};
			if (message.STATUS === 'success') {
				var _data = message.BUSINESS_DATA.list;
				var datas = Ext.JSON.decode(_data);
				commitmentStore.loadData(datas);				
			} else if (message.customException) {
				alertError(message.customException);
			} else {
				alertError('query fail');
			}
		});*/
		cometdfn.request({
			MODULE_TYPE : "SAP_ORDER_MODULE",
			COMMAND : 'SAP_ORDER_ACTUAL_INFO',
			sapNo : sapNo
		}, function(message, conf) {
			var data = message['BUSINESS_DATA'] || {};
			if (message.STATUS === 'success') {
				var _data = message.BUSINESS_DATA.list;
				var datas = Ext.JSON.decode(_data);
				actualtStore.loadData(datas);				
			} else if (message.customException) {
				alertError(message.customException);
			} else {
				alertError('query fail');
			}
		});
	}
	
	DigiCompass.Web.app.eo.showMaterialDetailPanel = function(materialNo){
		var panel = Ext.create("Ext.form.Panel", {
			height : 180,
			items : [{
				xtype : 'textfield',
				fieldLabel : 'Order Number',
				value : materialNo,
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : 'Date Created',
				name : 'DATE_CREATED',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : 'Created By',
				name : 'CREATED_BY',
				readOnly : true
			}, {
				xtype : 'textfield',
				fieldLabel : 'Sold To Party',
				name : 'SOLDTOPARTY',
				readOnly : true
			},{
				xtype : 'textfield',
				fieldLabel : '% Complete',
				name : 'COMPLETE',
				readOnly : true
			}]
		});		
				
		var orderStore = Ext.create('Ext.data.Store', {
			fields : ['ITEM_NUM','WBS_EXT','MAT_NUM','ITM_SHORT_TXT','ORD_QTY','SCHED_DELIVDATE','USER_STATUS','STATUS'
			          ,'INSTOCK','BLOCKEDSTOCK','ONORDER'],
			data : []
		});		

		var orderGridPanel = Ext.create('Ext.grid.Panel', {
			id : "orderGridPanel",
			title : "Order",
			store : orderStore,
			columns : [{
				text : 'Item',
				dataIndex : 'ITEM_NUM'
			},{
				text : 'WBS',
				dataIndex : 'WBS_EXT'
			},{
				text : 'Material Number',
				dataIndex : 'MAT_NUM'
			},{
				text : 'Description',
				dataIndex : 'ITM_SHORT_TXT'
			},{
				text : 'QTY',
				dataIndex : 'ORD_QTY'
			},{
				text : 'Scheduled Delivery',
				dataIndex : 'SCHED_DELIVDATE'
			},{
				text : 'Order Status',
				dataIndex : 'USER_STATUS'
			},{
				text : 'Delivery Status',
				dataIndex : 'STATUS'
			},{
				text : 'In Stock',
				dataIndex : 'INSTOCK'
			},{
				text : 'In Stock (Blocked)',
				dataIndex : 'BLOCKEDSTOCK'
			},{
				text : 'On Order',
				dataIndex : 'ONORDER'
			}]			
		});
		
		var deliveryStore = Ext.create('Ext.data.Store', {
			fields : ['ITEM_NUM','DOC_NUM','MAT_NUM','SHORT_TXT','QTY_DELIV','DELIV_DATE',
			          'SPDETAIL','APWEIGHT','SPV','INSTOCK','BLOCKEDSTOCK','ONORDER'],
			data : []
		});			

		var deliveryGridPanel = Ext.create('Ext.grid.Panel', {
			id : "deliveryGridPanel",
			title : "Delivery",
			store : deliveryStore,
			columns : [{
				text : 'Item',
				dataIndex : 'ITEM_NUM'
			},{
				text : 'Delivery Docket',
				dataIndex : 'DOC_NUM'
			},{
				text : 'Material Number',
				dataIndex : 'MAT_NUM'
			},{
				text : 'Description',
				dataIndex : 'SHORT_TXT'
			},{
				text : 'QTY',
				dataIndex : 'QTY_DELIV'
			},{
				text : 'Delivery Date',
				dataIndex : 'DELIV_DATE'
			},{
				text : 'Shipping Details',
				dataIndex : 'SPDETAIL'
			},{
				text : 'Shipping Weight',
				dataIndex : 'APWEIGHT'
			},{
				text : 'Shipping Volume',
				dataIndex : 'SPV'
			},{
				text : 'In Stock',
				dataIndex : 'INSTOCK'
			},{
				text : 'in Stock (Blocked)',
				dataIndex : 'BLOCKEDSTOCK'
			},{
				text : 'On Order',
				dataIndex : 'ONORDER'
			}]			
		});
		
		var tabPanel = Ext.create('Ext.tab.Panel', {
			flex : 1,
		    activeTab: 0,
		    //bodyPadding: 10,
		    tabPosition: 'bottom',
		    items: [orderGridPanel,deliveryGridPanel]		    
		});
		
		var win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
			id : "sapOdDetailWindow",
			title : "Material Order Detail",
			height : 600,
			width : 800,
			modal : true,
			//autoScroll : true,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ panel,tabPanel]
		});
		win.show();
		cometdfn.request({
			MODULE_TYPE : "MATERIAL_ORDER_MODULE",
			COMMAND : 'MATERIAL_ORDER_INFO',
			materialNo : materialNo						
		}, function(data, Conf) {
			var status = data.STATUS;
			if (status === "success") {
				var _data = data.BUSINESS_DATA;
				if(_data.COMPLETE){
					_data.COMPLETE = (_data.COMPLETE * 100) + "%";
				}
				panel.getForm().setValues(_data);
			} else if (data.customException) {
				alertError(data.customException);
			}
		});	
		cometdfn.request({
			MODULE_TYPE : "MATERIAL_ORDER_MODULE",
			COMMAND : 'MATERIAL_ORDER_ORDER_INFO',
			materialNo : materialNo
		}, function(message, conf) {
			var data = message['BUSINESS_DATA'] || {};
			if (message.STATUS === 'success') {
				var _data = message.BUSINESS_DATA.list;
				var datas = Ext.JSON.decode(_data);
				orderStore.loadData(datas);				
			} else if (message.customException) {
				alertError(message.customException);
			} else {
				alertError('query fail');
			}
		});
		cometdfn.request({
			MODULE_TYPE : "MATERIAL_ORDER_MODULE",
			COMMAND : 'MATERIAL_ORDER_DELIVERY_INFO',
			materialNo : materialNo
		}, function(message, conf) {
			var data = message['BUSINESS_DATA'] || {};
			if (message.STATUS === 'success') {
				var _data = message.BUSINESS_DATA.list;
				var datas = Ext.JSON.decode(_data);
				deliveryStore.loadData(datas);				
			} else if (message.customException) {
				alertError(message.customException);
			} else {
				alertError('query fail');
			}
		});
	}

})();