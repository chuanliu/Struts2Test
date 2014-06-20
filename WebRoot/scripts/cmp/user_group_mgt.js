(function() {
	Ext.ns("DigiCompass.Web.app.userGroupMgt");
	DigiCompass.Web.app.userGroupMgt.roles = null;

	DigiCompass.Web.app.userGroupMgt.getListData = function(data, config) {

		var fields = [ 'id', 'name', 'description', 'users', 'roles' ];
		var columns = [ {
			xtype : 'treecolumn',
			header : 'Name',
			dataIndex : 'name'
		}, {
			text : 'Description',
			dataIndex : 'description'
		}];
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		var _roles = data.BUSINESS_DATA.roles;
		var roles = Ext.JSON.decode(_roles);
		DigiCompass.Web.app.userGroupMgt.roles = roles;
		DigiCompass.Web.app.userGroupMgt.showObjExp(columns, fields, datas);
	};
	
	cometdfn.registFn({
		MODULE_TYPE : "USER_GROUP_MODULE",
		COMMAND : 'COMMAND_QUERY_LIST',
		callbackfn : DigiCompass.Web.app.userGroupMgt.getListData,
		Config : {}
	});

	DigiCompass.Web.app.userGroupMgt.showObjExp = function(columns, fields,
			datas) {

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}

		var objectExplorer = DigiCompass.Web.app.userGroupMgt.getObjExp(
				columns, fields, datas);
		objExpPanel.add(objectExplorer);
	};

	DigiCompass.Web.app.userGroupMgt.getTbar = function() {

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
											DigiCompass.Web.app.userGroupMgt
													.showDetailPanel();
										}
									},
									{
										xtype : 'button',
										text : 'Delete',
										iconCls : 'icon-delete',
										handler : function() {
											var checked = Ext
													.getCmp("userGroupMgtListView").objectExplorer
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
														'Are you sure to delete selected group?',
														function(e) {
															if (e == 'yes') {
																var message = {};
																message.ids = ids;
																message.MODULE_TYPE = 'USER_GROUP_MODULE';
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
																						var queryParam = Ext
																								.getCmp(
																										'objExtBtnSearchFieldId')
																								.getValue();
																						DigiCompass.Web.UI.CometdPublish
																								.userGroupMgtPublish(queryParam);
																						alertSuccess('Delete Data Successful!');
																					} else if (data.customException) {
																						alertError(data.customException);
																					}
																				});
															}
														});
											}
										}
									} ]
						});
	};

	DigiCompass.Web.app.userGroupMgt.getObjExp = function(columns, fields,
			datas) {
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
			id : 'userGroupMgtListView',
			module : 'USER_GROUP_MODULE',
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

		var tbar = DigiCompass.Web.app.userGroupMgt.getTbar();
		objectExplorer.addDocked(tbar);

		objectExplorer.addListener('itemclick', function(grid, record, item,
				index, event, eOpts) {
			var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
			if (isChecked) {
				return;
			}
			if (Ext.isEmpty(record.data.id)) {
				return;
			}
			DigiCompass.Web.app.userGroupMgt.showDetailPanel(record.data);
		});

		if (Ext.getCmp('userGroupMgtListView')) {
			Ext.getCmp('userGroupMgtListView').reconfigData(datas);
		} else {
			mainPanel.reconfigData(datas);
		}

		return objectExplorer;
	};

	DigiCompass.Web.app.userGroupMgt.showDetailPanel = function(obj) {

		var objDetailPanel = Ext.getCmp('obj-details');
		if (objDetailPanel) {
			// 移除组建
			objDetailPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var detailPanel = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
			autoScroll : true,
			genRolesPanel : function(data){
				var me = this;

				var store = Ext.create('Ext.data.Store', {
					fields : [ 'id', 'name', 'description' ],
					data : data
				});

				var gridPanel = Ext.create('Ext.grid.Panel', {
					id : 'groupRolesPanel',
					title : 'Roles',
					collapsible : true,					
					flex : 1,
					store : store,
					tbar : [{
						xtype : 'button',
						text : 'Select Roles',
						handler : function(){
							me.showRolesSelWin();
						}
					}],
					columns : [ {
						text : 'Name',
						dataIndex : 'name'
					},{
						text : 'Description',
						dataIndex : 'description'
					}]
				});

				return gridPanel;
			
			},
			createRolesGrid : function(selectedRoles){
				
				var searchField = Ext.create('Ext.ux.form.BtnSearchField',{
					width : 300,
					onTrigger2Click : function(){
						var searchField = this, value = searchField.getValue();
						searchField.showCancelBtn();
						var panel = this.up("gridpanel");
						if(value != ""){				
							panel.filterByText(value);
						} else {
							panel.clearFilter();
						}	
					},
					onTrigger1Click : function(){
						var searchField = this;
						searchField.hideCancelBtn();
						value = searchField.getValue();
						var panel = this.up("gridpanel");
						if(value != ""){				
							panel.filterByText(value);
						} else {
							panel.clearFilter();
						}						
					}
				});
				searchField.on("change", function(_this, newValue, oldValue, eOpts ){
					var panel = this.up("gridpanel");
					if(newValue != ""){				
						panel.filterByText(newValue);
					} else {
						panel.clearFilter();
					}
				});

				var store = Ext.create('Ext.data.Store', {
					fields : [ 'id', 'name', 'description'],
					data : data
				});

				var sm = Ext.create('Ext.selection.CheckboxModel');

				var gridPanel = Ext.create('Ext.grid.Panel', {
					selModel : sm,
					store : store,
					columns : [ {
						text : 'Name',
						dataIndex : 'name'
					},{
						text : 'Description',
						dataIndex : 'description'
					}],					
					tbar : ['Search: ', ' ', searchField, {
						xtype : 'button',
						text : 'Finish',
						handler : function() {
							var records = sm.getSelection();
							Ext.getCmp("groupRolesPanel").getStore().loadData(records);
							this.up("window").close();
						}
					} ],
					filterByText : function(searchValue){
						var searchRegExp = new RegExp(searchValue, 'gi');
						var view = this.getView();
						this.getStore().each(function(record){
							var uiNode = view.getNodeByRecord(record);
							 if(searchRegExp.test(record.get("name"))){
								 Ext.get(uiNode).setDisplayed('table-row');
							 } else {
								 Ext.get(uiNode).setDisplayed('none'); 
							 }					 					 
						}, this);
					},
					clearFilter : function(){
						var view = this.getView();
						this.getStore().each(function(record){
							var uiNode = view.getNodeByRecord(record);
							if(uiNode){
								Ext.get(uiNode).setDisplayed('table-row');
							}					
						});
					}
				});			
				
				var message = {
					MODULE_TYPE : 'USER_GROUP_MODULE',
					COMMAND : 'getRoles'
				};
				cometdfn.request(message, function(message, Conf) {
					var status = message.STATUS;
					if (status === "success") {
						var rolesData = Ext.JSON.decode(message.BUSINESS_DATA);
						store.loadData(rolesData);
						
						gridPanel.getStore().each(function(record){
							for(var i = 0 ; i<selectedRoles.length ; i++){
								if(record.data.id === selectedRoles[i]){
									gridPanel.getSelectionModel().select(record,true);
								}
							}
						})
					} else if (message.customException) {
						alertError(message.customException);
					}
				});

				return gridPanel;			
			},
			showRolesSelWin : function(){
				var groupRolesGridPanel = Ext.getCmp('groupRolesPanel');
				var selectedRoles = [];
				if(groupRolesGridPanel){
					var store = groupRolesGridPanel.getStore();
					store.each(function(record){
						selectedRoles.push(Ext.clone(record.data.id));
					});
				}
				var gridPanel = this.createRolesGrid(selectedRoles);
				Ext.create('DigiCompass.Web.app.AutosizeWindow', {
					title : 'Roles',
					height : 600,
					width : 800,
					layout : 'fit',
					border : false,
					items : gridPanel
				}).show();
			}
		});
		var userData = [];
		var groupRoles = [];
		var version = "";
		var obj_id = "";
		var ptitle = "Object Detail - User Group ";
		if (obj) {
			version = obj.name;
			obj_id = obj.id;
			ptitle = ptitle + "(" + version + ")";
			if(obj.users){
				userData = obj.users;
			}
			if(obj.roles){
				groupRoles = obj.roles;
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
		var formPanel = DigiCompass.Web.app.userGroupMgt.getFormPanel(obj);
		detailPanel.add(formPanel);
		var gridPanel = DigiCompass.Web.app.userGroupMgt.getGroupUserGrid(userData);
		detailPanel.add(gridPanel);
		detailPanel.add(detailPanel.genRolesPanel(groupRoles));
	};

	DigiCompass.Web.app.userGroupMgt.getFormPanel = function(obj) {
		
		var obj_id = null;
		if (obj && obj.id) {
			obj_id = obj.id;
		}

		var rolesStore = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name' ],
			data : DigiCompass.Web.app.userGroupMgt.roles
		});

		var detail = Ext
				.create(
						'Ext.form.Panel',
						{							
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
								// layout : 'column',
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
										},
										/*{
											xtype : "boxselect",
											fieldLabel : 'Roles',
											name : "roles",
											store : rolesStore,
											queryMode : 'local',
											displayField : 'name',
											valueField : 'id'
										},*/{
											xtype : "container",
										layout : "column",
										items : [{
											xtype : 'button',
											text : 'Select Users',
											handler : function() {
												cometdfn
														.request(
																{
																	MODULE_TYPE : 'USER_GROUP_MODULE',
																	COMMAND : 'QUERY_ALL_USERS'
																},
																	DigiCompass.Web.app.userGroupMgt.userCallback);
												}
										},{
											xtype : 'button',
											text : 'Effective Rights',
											handler : function() {
											cometdfn
													.request(
															{
																MODULE_TYPE : 'USER_GROUP_MODULE',
																COMMAND : 'QUERY_GROUP_ALL_PERMISSIONS',
																groupId : obj_id
															},
															DigiCompass.Web.app.userGroupMgt.groupAllPermissonsCallback);
											}
										}]
								}]
							} ],
							tbar : [ {
								xtype : 'button',
								text : 'Save',
								iconCls : 'icon-save',
								handler : function() {
									var form = this.up("form").getForm();
									if (form.isValid()) {
										var message = form.getValues();

										var panel = Ext
												.getCmp("GroupUserGridPanel");
										var store = panel.getStore();
										var userIds = [];
										store.each(function(record) {
											var item = record.getData();
											userIds.push(item.id);
										});
										
										var panel = Ext.getCmp("groupRolesPanel");
										var store = panel.getStore();
										var roleIds = [];
										store.each(function(record) {
											var item = record.getData();
											roleIds.push(item.id);
										});
																			
										message.userIds = userIds;
										message.roles = roleIds;
										message.MODULE_TYPE = 'USER_GROUP_MODULE';
										message.COMMAND = 'COMMAND_SAVE';
										cometdfn.request(message, function(message, conf) {
											var data = message['BUSINESS_DATA'] || {};
											if (message.STATUS === 'success'
													&& data.rv === 'success') {
												alertSuccess('save success.');
												var queryParam = Ext.getCmp(
														'objExtBtnSearchFieldId').getValue();
												DigiCompass.Web.UI.CometdPublish.userGroupMgtPublish(queryParam);
												var objExpPanel = Ext.getCmp('obj-details');
												if (objExpPanel) {
													// 移除组建
													objExpPanel.removeAll();
												}
											} else {
												alertError('save fail');
											}
										});
									}
								}
							} ]
						});
		if (obj) {
			var formData = Ext.clone(obj);
			var rolesArr = new Array();
			var roles = formData.roles;
			if (roles) {
				for ( var i = 0; i < roles.length; i++) {
					rolesArr.push(roles[i].id);
				}
				formData.roles = rolesArr;
			}
			detail.getForm().setValues(formData);
		}
		return detail;
	};
	
	DigiCompass.Web.app.userGroupMgt.getGroupUserGrid = function(data) {

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'username' ,'contact', 'email' ],
			data : data
		});

		var gridPanel = Ext.create('Ext.grid.Panel', {
			id : 'GroupUserGridPanel',
			title : 'Members',
			collapsible : true,
			store : store,
			columns : [ {
				text : 'Name',
				dataIndex : 'name'
			},{
				text : 'User Name',
				dataIndex : 'username'
			},{
				text : 'Contact',
				dataIndex : 'contact'
			}, {
				text : 'Email',
				dataIndex : 'email',
			} ],
			flex : 0.5
		});

		return gridPanel;
	};
	
	DigiCompass.Web.app.userGroupMgt.getUserGrid = function(data) {

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'username' ,'contact', 'email' ],
			data : data
		});

		var sm = Ext.create('Ext.selection.CheckboxModel');

		var gridPanel = Ext.create('Ext.grid.Panel', {
			selModel : sm,
			store : store,
			columns : [ {
				text : 'Name',
				dataIndex : 'name'
			},{
				text : 'User Name',
				dataIndex : 'username'
			},{
				text : 'Contact',
				dataIndex : 'contact'
			},{
				text : 'Email',
				dataIndex : 'email',
			} ],
			height : 200,
			width : '100%',
			tbar : [ {
				xtype : 'button',
				text : 'Finish',
				handler : function() {
					var records = sm.getSelection();
					Ext.getCmp("GroupUserGridPanel").getStore().loadData(records);
					this.up("window").close();
				}
			} ]
		});

		return gridPanel;
	};
	
	DigiCompass.Web.app.userGroupMgt.userCallback = function(data, Conf,
			fnName, command) {
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		var groupUserGridPanel = Ext.getCmp('GroupUserGridPanel');
		var selectedUser = [];
		if(groupUserGridPanel){
			var store = groupUserGridPanel.getStore();
			store.each(function(record){
				selectedUser.push(Ext.clone(record.data.id));
			});
		}
		var gridPanel = DigiCompass.Web.app.userGroupMgt
				.getUserGrid(datas);
		Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			title : 'User',
			height : 600,
			width : 800,
			layout : 'fit',
			border : false,
			items : gridPanel
		}).show();
		gridPanel.getStore().each(function(record){
			for(var i = 0 ; i<selectedUser.length ; i++){
				if(record.data.id === selectedUser[i]){
					gridPanel.getSelectionModel().select(record,true);
				}
			}
		})
	};

	DigiCompass.Web.app.userGroupMgt.groupAllPermissonsCallback = function(data, Conf,
			fnName, command) {
		var _data = data.BUSINESS_DATA.allPermissions;
		var datas = Ext.JSON.decode(_data);
		var gridPanel = DigiCompass.Web.app.userGroupMgt.getGroupAllPermissionsGridPanel(datas);
		Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			title : 'Effective Rights',
			height : 600,
			width : 800,
			modal : true,
			maximizable : true,
			autoScroll : true,
			layout : 'fit',
			border : false,
			items : gridPanel
		}).show();
	};
	
	DigiCompass.Web.app.userGroupMgt.getGroupAllPermissionsGridPanel = function(datas) {

		/*var store = Ext.create('Ext.data.Store',
				{
					fields : ['module', 'command', 'moduleName', 'commandName', 'condition', 'allow',
							'deny' ],
					groupField : 'moduleName',
					data : datas
				});*/
		var store = Ext.create('Ext.data.TreeStore', {
			fields : ['module', 'command', 'text', 'roleName', 'commandName', 'condition', 'allow', 'deny' ],
		    root: datas
		});

		var groupingFeature = Ext.create('Ext.grid.feature.Grouping');

		var gridPanel = Ext.create('Ext.tree.Panel', {			
			store : store,
			autoScroll : true,
			rootVisible : false,
			columns : [ {
				text : 'Condition',
				xtype : 'treecolumn',
				dataIndex : 'text',
				width : 300
			}, {
				text : 'Role',
				dataIndex : 'roleName',
			}, {
				text : 'Condition',
				dataIndex : 'condition'
			}, {
				xtype : "checkcolumn",
				text : 'Allow',				
				dataIndex : 'allow',
				processEvent: function () { return false; }
			}, {
				xtype : "checkcolumn",
				text : 'Deny',				
				dataIndex : 'deny',
				processEvent: function () { return false; }
			} ],
			width : '100%',
			features : [ groupingFeature ]
		});

		return gridPanel;

	};
})();