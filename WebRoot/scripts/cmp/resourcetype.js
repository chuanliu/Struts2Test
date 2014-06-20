(function() {
	Ext.namespace('DigiCompass.Web.app.resourceType');

	DigiCompass.Web.app.resourceType.getForm = function(data, workflowCategory, roles) {
		
		var obj_id = null;
		if (data && data.id) {
			obj_id = data.id;
		}

		var workflowCategoryStore = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name' ],
			data : workflowCategory
		});
		
		var rolesStore = Ext.create('Ext.data.Store', {
		    fields: ['id', 'name'],
		    data : roles
		});

		var detail = Ext
				.create(
						'Ext.form.Panel',
						{
							id : "resourceTypeFormDetail",
							region : 'north',
							heigth : 200,
							width : "100%",
							collapsible : true,
							bodyStyle : 'padding:5px',
							fieldDefaults : {
								labelAlign : 'left',
								msgTarget : 'side'
							},
							defaults : {
								anchor : '100%'
							},
							buttonAlign : 'left',
							items : [ {
								columnWidth : .5,
								border : false,
								layout : 'anchor',
								defaultType : 'textfield',
								//layout : 'column',
								border : false,
								items : [
										{
											xtype : 'hiddenfield',
											name : 'id'
										},
										{
											allowBlank : false,
											fieldLabel : 'Name',
											name : 'name'
										},
										{
											fieldLabel : 'Description',
											maxLength : 30,
											name : 'description'
										},{
											xtype : "boxselect",
										    fieldLabel: 'Role',
										    name : "roles",
										    store: rolesStore,
										    queryMode: 'local',
										    displayField: 'name',
										    valueField: 'id'
										}/*,{
											xtype : 'button',
											text : 'select role',
											handler : function() {
												var store = Ext.create('Ext.data.Store', {
													fields : [ 'id', 'name'],
													data : roles
												});

												var sm = Ext.create('Ext.selection.CheckboxModel');

												var roleGridPanel = Ext.create('Ext.grid.Panel', {
													selModel : sm,
													store : store,
													columns : [ {
														text : 'Role Name',
														dataIndex : 'name'
													}],
													height : 200,
													width : '100%',
													tbar : [ {
														xtype : 'button',
														text : 'Finish',
														handler : function() {
															var records = sm.getSelection();
															
															this.up("window").close();
														}
													} ]
												});

												Ext.create('DigiCompass.Web.app.AutosizeWindow', {
													title : 'Role',
													height : 800,
													width : 1000,
													layout : 'fit',
													border : false,
													items : roleGridPanel
												}).show();
											}
										} */,
										Ext
												.create(
														'Ext.form.ComboBox',
														{
															name : 'workflowCategory',
															store : workflowCategoryStore,
															fieldLabel : 'Service',
															displayField : 'name',
															valueField : 'id',
															allowBlank : false,
															listeners : {
																change : function(
																		field,
																		newValue,
																		oldValue,
																		eOpts) {
																	cometdfn.request({
																		MODULE_TYPE : 'RESOURCE_TYPE_MODULE',
																		COMMAND : 'COMETD_COMMAND_RESOURCE_TYPE_WORKFLOW_TREE',
																		resourceTypeId : obj_id,
																		categoryGroupId : newValue
																	}, DigiCompass.Web.app.resourceType.getWorkFlowInstanceTree);
																}
															}
														}),
										{
											xtype : 'button',
											text : 'select resource',
											handler : function() {
												cometdfn
														.request(
																{
																	MODULE_TYPE : 'RESOURCE_TYPE_MODULE',
																	COMMAND : 'COMETD_COMMAND_RESOURCE'
																},
																DigiCompass.Web.app.resourceType.resourceCallback);
											}
										} ]
							} ],
							tbar : [ {
								xtype : 'button',
								text : 'Save',
								iconCls:'icon-save',
								handler : function() {
									var form = this.up("form").getForm();
									if (form.isValid()) {
										var message = form.getValues();

										var panel = Ext
												.getCmp("GroupResourceGridPanel");
										var store = panel.getStore();
										var resourceIds = [];
										store.each(function(record) {
											var item = record.getData();
											resourceIds.push(item.id);
										});

										var categoryRightData = getCategoryRightData();

										message.categoryRightData = categoryRightData;
										message.resourceIds = resourceIds;
										message.MODULE_TYPE = 'RESOURCE_TYPE_MODULE';
										message.COMMAND = 'COMMAND_SAVE';
										cometdfn.publish(message);
									}
								}
							} ]
						});
		if (data) {
			var formData = Ext.clone(data);
			if(formData.workflowCategoryGroup){
				formData.workflowCategory = formData.workflowCategoryGroup.id;
				var rolesArr = new Array();
				var roles = formData.roles;
				if(roles){
					for(var i = 0; i < roles.length; i++){
						rolesArr.push(roles[i].id);
					}
					formData.roles = rolesArr;
				}
			}
			detail.getForm().setValues(formData);
		}
		return detail;
	};

	DigiCompass.Web.app.resourceType.resourceCallback = function(data, Conf,
			fnName, command) {
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		var resourceGridPanel = DigiCompass.Web.app.resourceType
				.getResourceGrid(datas);
		Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			title : 'Resource',
			height : 800,
			width : 1000,
			layout : 'fit',
			border : false,
			items : resourceGridPanel
		}).show();
	};

	function getCategoryRightData() {
		var categoryRightStore = Ext.getCmp("workflowCategoryTreePanel")
				.getStore();
		var rootNode = categoryRightStore.getRootNode();
		var obj = {
			maxdepth : 0
		};
		getMaxDepth(rootNode, obj);
		var result = [];
		getDepthData(result, rootNode, obj.maxdepth);
		return result;
	}

	function getDepthData(result, node, maxdepth) {
		var depth = node.getDepth();
		if (depth == maxdepth) {
			result.push({
				categoryId : node.get("categoryId"),
				right : node.get("right")
			});
		}
		if (node.hasChildNodes()) {
			node.eachChild(function(childnode) {
				getDepthData(result, childnode, maxdepth);
			});
		}
	}

	function getMaxDepth(node, obj) {
		var depth = node.getDepth();
		if (depth > obj.maxdepth) {
			obj.maxdepth = depth;
		}
		if (node.hasChildNodes()) {
			node.eachChild(function(childnode) {
				getMaxDepth(childnode, obj);
			});
		}
	}

	function changeChildren(node, newValue) {
		node.set("right", newValue);
		if (node.hasChildNodes()) {
			node.eachChild(function(childnode) {
				changeChildren(childnode, newValue);
			});
		}
	}

	function changeParent(node, newValue) {
		var childSame = true;
		if (!node.parentNode) {
			return;
		}
		node.parentNode.eachChild(function(childnode) {
			if (node != childnode) {
				if (newValue != childnode.get("right")) {
					childSame = false;
					return false;
				}
			}
		});
		if (childSame) {
			if (node.parentNode.get("right") != newValue) {
				node.parentNode.set("right", newValue);
			}
		} else {
			node.parentNode.set("right", "");
		}
		changeParent(node.parentNode);
	}

	DigiCompass.Web.app.resourceType.getWorkFlowInstanceTree = function(data,
			Conf, fnName, command) {
		var _data = data.BUSINESS_DATA.data;
		var datas = Ext.JSON.decode(_data);
		var _operationList = data.BUSINESS_DATA.operationList;
		var operationList = Ext.JSON.decode(_operationList);

		var rightData = [ {
			'id' : '0',
			'name' : 'approve by  manager'
		}, {
			'id' : '1',
			'name' : 'approver'
		}, {
			'id' : '2',
			'name' : 'Supplier'
		}, {
			'id' : '3',
			'name' : 'change approver'
		}, {
			'id' : '4',
			'name' : 'change supplier'
		} ];

		var selectedRecord;

		if(Ext.getCmp("workflowCategoryTreePanel")){
			Ext.getCmp('workflowCategoryTreePanel').setRootNode(datas);
		}else{
			
			var rightStore = Ext.create('Ext.data.Store', {
				fields : [ 'id', 'name' ],
				data : operationList
			});

			var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
			
			var store = Ext.create('Ext.data.TreeStore', {
				fields : [ 'categoryId', 'name', 'right' ],
				root : datas
			});
			
			var treePanel = Ext.create('Ext.tree.Panel', {
				id : 'workflowCategoryTreePanel',
				title : 'Workflow Category',
				width : '100%',
				height : 300,
				collapsible : true,
				useArrows : true,
				rootVisible : false,
				store : store,
				multiSelect : true,
				singleExpand : true,
				selModel : {
					selType : 'cellmodel'
				},
				// the 'columns' property is now 'headers'
				columns : [ {
					xtype : 'treecolumn', // this is so we know which column will
					// show the tree
					text : 'Name',
					flex : 2,
					sortable : true,
					dataIndex : 'name'
				}, {
					text : 'Right',
					flex : 1,
					sortable : true,
					editor : Ext.create('Ext.form.ComboBox', {
						name : 'right',
						store : rightStore,
						displayField : 'name',
						valueField : 'id',
						listeners : {
							change : function(field, newValue, oldValue, eOpts) {
								if (selectedRecord.hasChildNodes()) {
									selectedRecord.eachChild(function(childnode) {
										changeChildren(childnode, newValue);
									});
								}
								changeParent(selectedRecord, newValue);
							}
						}
					}),
					dataIndex : 'right',
					renderer : function(val) {
						for ( var i = 0; i < operationList.length; i++) {
							if (val == operationList[i].id) {
								val = operationList[i].name;
							}
						}
						return val;
					}
				} ],
				plugins : [ cellEditing ],
				listeners : {
					select : function(cell, record, row, column, eOpts) {
						selectedRecord = record;
					}
				}
			});
	
			Ext.getCmp('resourceTypeDetailPanel').add(treePanel);
		}

	};

	DigiCompass.Web.app.resourceType.getResourceGrid = function(data) {

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'contact' ],
			data : data
		});

		var sm = Ext.create('Ext.selection.CheckboxModel');

		var resourceGridPanel = Ext.create('Ext.grid.Panel', {
			selModel : sm,
			store : store,
			columns : [ {
				text : 'Resource Name',
				dataIndex : 'name'
			}, {
				text : 'Contact',
				dataIndex : 'contact',
			} ],
			height : 200,
			width : '100%',
			tbar : [ {
				xtype : 'button',
				text : 'Finish',
				handler : function() {
					var records = sm.getSelection();
					Ext.getCmp("GroupResourceGridPanel").getStore().loadData(
							records);
					this.up("window").close();
				}
			} ]
		});

		return resourceGridPanel;
	};

	DigiCompass.Web.app.resourceType.getGroupResourceGrid = function(data) {

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'contact' ],
			data : data
		});

		var groupResourceGridPanel = Ext.create('Ext.grid.Panel', {
			id : 'GroupResourceGridPanel',
			title : 'Resource',
			collapsible : true,
			store : store,
			columns : [ {
				text : 'Resource Name',
				dataIndex : 'name'
			}, {
				text : 'Contact',
				dataIndex : 'contact',
			} ],
			height : 200,
			width : '100%'
		});

		return groupResourceGridPanel;
	};

	DigiCompass.Web.app.resourceType.getList = function(data, config) {

		var fields = [ 'id', 'name', 'description', 'resources', 'workflowCategoryGroup', 'roles' ];
		var columns = [ {
			xtype : 'treecolumn',
			header : 'Name',
			dataIndex : 'name'
		} ];

		var _data = data.BUSINESS_DATA.list;
		var _operationList = data.BUSINESS_DATA.operationList;
		var datas = Ext.JSON.decode(_data);
		var operationList = Ext.JSON.decode(_operationList);
		var _workflowCategory = data.BUSINESS_DATA.workflowCategory;
		var workflowCategory = Ext.JSON.decode(_workflowCategory);
		var _roles = data.BUSINESS_DATA.roles;
		var roles = Ext.JSON.decode(_roles);

		var myStore = Ext.create('Ext.data.JsonStore', {
			fields : fields,
			data : datas
		});

		if (Ext.getCmp('resourceTypeListView')) {
			Ext.getCmp('resourceTypeListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create(
					'DigiCompass.Web.ux.objectExplorer', {
						columns : columns,
						id : "resourceTypeExplorer",
						fields : fields,
						width : "fit",
						height : 700,
						data : []
					});

			objectExplorer.on('checkchange', function(node, checked) {
				objectExplorer.checkchild(node, checked);
				objectExplorer.checkparent(node);
			});

			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue', {
				width : "fit",
				id : "resourceTypeCatalogue",
				height : 730,
				data : [],
				collapsible : true,
				split : true,
				region : 'center',
				hidden : true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel', {
				id : 'resourceTypeListView',
				module : 'RESOURCE_TYPE_MODULE',
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
			function getTbar() {
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
													DigiCompass.Web.app.resourceType
															.showDetailPanel(
																	null,
																	operationList,
																	workflowCategory, roles);
												}
											},
											{
												xtype : 'button',
												text : 'Delete',
												iconCls : 'icon-delete',
												handler : function() {
													var checked = Ext
															.getCmp("resourceTypeListView").objectExplorer
															.getChecked();
													var resourceGroupIds = new Array();
													if (checked.length == 0) {
														Ext.Msg
																.alert(
																		'Warning',
																		'Please select a record!');
													} else {
														for ( var i = 0; i < checked.length; i++) {
															resourceGroupIds
																	.push(checked[i].id);
														}
														alertOkorCancel(
																'Are you sure to delete selected resource group?',
																function(e) {
																	if (e == 'yes') {
																		DigiCompass.Web.app.resourceType
																				.deleteResrouceGroup(resourceGroupIds);
																	}
																});
													}
												}
											} ]
								});
			}
			objectExplorer.addDocked(getTbar());
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			objectExplorer.addListener('itemclick', function(grid, record,
					item, index, event, eOpts) {
				var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
				if (isChecked) {
					return;
				}
				if (Ext.isEmpty(record.data.id)) {
					return;
				}
				DigiCompass.Web.app.resourceType.showDetailPanel(record.data,
						operationList, workflowCategory, roles);
			});
		}
	};

	DigiCompass.Web.app.resourceType.deleteResrouceGroup = function(
			resourceGroupIDs) {
		var message = {};
		message.resourceGroupIDs = resourceGroupIDs;
		message.MODULE_TYPE = 'RESOURCE_TYPE_MODULE';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.request(message,
				DigiCompass.Web.app.resourceType.deleteResourceGroupCallback);
	}

	DigiCompass.Web.app.resourceType.deleteResourceGroupCallback = function(
			data, Conf, fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			Ext.getCmp('obj-details').removeAll();
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.resourceTypePublish(queryParam);
			// Ext.Msg.alert('Information', );
			alertSuccess('Delete Data Successful!');
		} else if (data.customException) {
			alertError(data.customException);
		}
	};

	DigiCompass.Web.app.resourceType.showDetailPanel = function(obj,
			operationList, workflowCategory, roles) {
		var objExpPanel = Ext.getCmp('obj-details');
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var resourceTypeDetailPanel = Ext.create('Ext.panel.Panel', {
			id : 'resourceTypeDetailPanel',
			// title:'Planned Site Detail',
			layout : 'vbox',
			autoScroll : true
		});
		var version = "";
		var obj_id = "";
		var ptitle = "Object Detail - Group Settings";
		if (obj) {
			version = obj.name;
			obj_id = obj.id;
			ptitle = ptitle + "(" + version + ")";
		}
		var ReversalPanel = new DigiCompass.Web.app.ReversalPanel({
			panelTitle : ptitle,
			height : 700,
			front : resourceTypeDetailPanel,
			back : new DigiCompass.Web.app.VersionForm({
				qrCode : obj_id
			})
		});
		/*
		 * ReversalPanel .addToolBar( 'tbar', new Ext.toolbar.Toolbar( { items : [ {
		 * xtype : 'button', text : 'Save', handler : function() { var detail =
		 * Ext .getCmp("plannedSiteFormDetail"); if (validateForm(detail)) { //
		 * formSubmit(detail, // 1); var versionForm = Ext
		 * .getCmp("plannedSiteDetailPanel").reversalPanel.back; if (versionForm
		 * .isValid()) { formSubmit( detail, 1, versionForm .getForm()
		 * .getValues()); } else if (Ext
		 * .getCmp("plannedSiteDetailPanel").reversalPanel .isFront()) { Ext
		 * .getCmp("plannedSiteDetailPanel").reversalPanel .toBack(); } } else
		 * if (Ext .getCmp("plannedSiteDetailPanel").reversalPanel .isBack()) {
		 * Ext .getCmp("plannedSiteDetailPanel").reversalPanel .toFront(); } } }, {
		 * xtype : 'button', text : 'Save As', handler : function() { var detail =
		 * Ext .getCmp("plannedSiteFormDetail"); if (validateForm(detail)) { //
		 * formSubmit(detail, // 1); var versionForm = Ext
		 * .getCmp("plannedSiteDetailPanel").reversalPanel.back; if (versionForm
		 * .isValid()) { formSubmit( detail, 2, versionForm .getForm()
		 * .getValues()); } else if (Ext
		 * .getCmp("plannedSiteDetailPanel").reversalPanel .isFront()) { Ext
		 * .getCmp("plannedSiteDetailPanel").reversalPanel .toBack(); } } else
		 * if (Ext .getCmp("plannedSiteDetailPanel").reversalPanel .isBack()) {
		 * Ext .getCmp("plannedSiteDetailPanel").reversalPanel .toFront(); } } } ]
		 * }));
		 */
		if (obj) {
			/*
			 * var versionForm = ReversalPanel.back; versionForm.setValues({
			 * versionId : obj.id, versionName : obj.version, comment :
			 * obj.comment });
			 */
		}
		objExpPanel.add(ReversalPanel);
		var formPanel = DigiCompass.Web.app.resourceType.getForm(obj,
				workflowCategory, roles);
		var resourcesData = [];
		var obj_id = null;
		if (obj && obj.resources) {
			resourcesData = obj.resources;
		}
		if (obj && obj.id) {
			obj_id = obj.id;
		}
		var groupResourceGrid = DigiCompass.Web.app.resourceType
				.getGroupResourceGrid(resourcesData);
		Ext.getCmp('resourceTypeDetailPanel').add(formPanel);
		Ext.getCmp('resourceTypeDetailPanel').add(groupResourceGrid);
	};

})();