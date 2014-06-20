(function() {
	Ext.namespace('DigiCompass.Web.app.resource');
	
	Ext.apply(Ext.form.VTypes, {
	    repetition: function(val, field) {    
	        if (field.repetition) {           
	            var cmp = Ext.getCmp(field.repetition.targetCmpId);
	            if (Ext.isEmpty(cmp)) { 	              
	                return false;
	            }
	            if (val == cmp.getValue()) {
	                return true;
	            } else {
	                return false;
	            }
	        }
	    },
	    repetitionText: 're-enter password not same'
	});

	DigiCompass.Web.app.resource.getForm = function(data, managers) {
		
		function isancestor(data, manager, result){
			if(manager.manager == null){
				result.ancestor = false;
				return;
			}
			if(data.id == manager.manager.id){
				result.ancestor = true;
				return;
			}
			isancestor(data, manager.manager, result);
		}

		var managerData = [];
		for ( var i = 0; i < managers.length; i++) {

			var item = {};
			item.id = managers[i].id;
			item.name = managers[i].name;

			var ancestor = false;
			if (data) {
				if (data.id == managers[i].id) {
					continue;
				}
				var result = {};
				isancestor(data, managers[i], result);
				ancestor = result.ancestor;
				/*while (managers[i].manager != null) {
					if (data.id == managers[i].manager.id) {
						ischild = true;
						break;
					}
					if (managers[i].manager.manager) {
						managers[i].manager = managers[i].manager.manager;
					} else {
						break;
					}
				}*/
			}
			if (ancestor) {
				continue;
			}
			managerData.push(item);
		}

		var managerStore = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name' ],
			data : managerData
		});

		var managerComboBox = Ext.create('Ext.form.ComboBox', {
			fieldLabel : 'Manager',
			name : 'manager',
			store : managerStore,
			displayField : 'name',
			valueField : 'id'
		});

		var detail = Ext.create('Ext.form.Panel', {
			bodyPadding : 5,
			collapsible : true,
			width : '100%',
			// The fields
			defaultType : 'textfield',
			items : [ {
				xtype : 'hiddenfield',
				name : 'id'
			}, {
				fieldLabel : 'Name',
				name : 'name',
				allowBlank : false
			}, {
				fieldLabel : 'Contact',
				name : 'contact',
				allowBlank : false
			},{				
				fieldLabel : 'User Name',
				name : 'username',
				allowBlank : false
			},{				
				fieldLabel : 'Email',
				name : 'email',
				allowBlank : false,
				vtype : "email"
			},{
				id : 'password',
				fieldLabel : 'Password',
				xtype : 'ux.passwordmeterfield',
				name : 'password',
				allowBlank : false
			}, {
				id : "reEnPassword",
				fieldLabel : 'Re-enter Password',
				name : 'reEnPassword',
				xtype : 'textfield',
				inputType : 'password',
				allowBlank : false,
				vtype : "repetition",
				repetition: { targetCmpId: 'password'}
			}, {
				xtype : 'container',
				layout : 'column',
				border : false,
				defaultType : 'textfield',
				items : [ managerComboBox, {
					xtype : 'button',
					text : 'select group',
					handler : function() {
						cometdfn.request({
							MODULE_TYPE : 'RESOURCE_MODULE',
							COMMAND : 'COMETD_COMMAND_RESOURCE_GROUP'
						}, DigiCompass.Web.app.resource.resourceGroupCallback);
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
								.getCmp("selectedResourceGroupGridPanel");
						var store = panel.getStore();
						var groupIds = [];
						store.each(function(record) {
							var item = record.getData();
							groupIds.push(item.id);
						});
						message.groupIds = groupIds;
						message.MODULE_TYPE = 'RESOURCE_MODULE';
						message.COMMAND = 'COMMAND_SAVE';
						cometdfn.publish(message);
					}
				}
			} ]
		});
		if (data) {
			var formData = Ext.clone(data);
			formData.username = formData.user.username;
			formData.email = formData.user.email;
			if (formData.manager) {
				formData.manager = formData.manager.id;
			}
			Ext.getCmp("password").allowBlank = true;
			Ext.getCmp("reEnPassword").allowBlank = true;			
			detail.getForm().setValues(formData);
		}
		return detail;
	};

	DigiCompass.Web.app.resource.resourceGroupCallback = function(data, Conf,
			fnName, command) {
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		var resourceGroupGridPanel = DigiCompass.Web.app.resource
				.getResourceGroupGrid(datas);
		Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			title : 'Resource Group',
			height : 800,
			width : 1000,
			layout : 'fit',
			border : false,
			items : resourceGroupGridPanel
		}).show();
	};

	DigiCompass.Web.app.resource.getSelectedGroupGrid = function(data) {

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'description' ],
			data : data
		});

		var selectedGroupGridPanel = Ext.create('Ext.grid.Panel', {
			id : 'selectedResourceGroupGridPanel',
			title : 'Selected Resource Group',
			collapsible : true,
			store : store,
			columns : [ {
				text : 'Resource Group Name',
				dataIndex : 'name'
			}, {
				text : 'Description',
				dataIndex : 'description',
			} ],
			height : 200,
			width : '100%'
		});

		return selectedGroupGridPanel;
	};

	DigiCompass.Web.app.resource.getResourceGroupGrid = function(data) {		
		
		var selectedRecords = Ext.getCmp('selectedResourceGroupGridPanel').getStore().getRange();
		
		var sm = Ext.create('Ext.selection.CheckboxModel');
		
		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'description' ],
			data : data,
			listeners: {
		        load: function() {		        	
		        	//sm.select(selectedRecords);
		        	//Ext.getCmp('resourceGroupGridPanel').getSelectionModel().selectAll();
		        }
		    }
		});		

		var resourceGroupGridPanel = Ext.create('Ext.grid.Panel', {
			id : 'resourceGroupGridPanel',
			selModel : sm,
			store : store,
			columns : [ {
				text : 'Resource Group Name',
				dataIndex : 'name'
			}, {
				text : 'Description',
				dataIndex : 'description',
			} ],
			height : 200,
			width : '100%',
			tbar : [ {
				xtype : 'button',
				text : 'Finish',
				handler : function() {					
					var records = sm.getSelection();
					Ext.getCmp("selectedResourceGroupGridPanel").getStore().loadData(records);
					this.up("window").close();
				}
			}]
		});

		return resourceGroupGridPanel;
	};
	var datas;
	DigiCompass.Web.app.resource.getList = function(data, config) {

		var fields = [ 'id', 'name', 'contact', 'user', 'description', 'manager',
				'types' ];
		var columns = [ {
			xtype : 'treecolumn',
			header : 'Name',
			dataIndex : 'name'
		}, {
			header : 'Contact',
			dataIndex : 'contact'
		} ];

		var _data = data.BUSINESS_DATA.list;
		datas = Ext.JSON.decode(_data);

		var myStore = Ext.create('Ext.data.JsonStore', {
			fields : fields,
			data : datas
		});

		if (Ext.getCmp('resourceListView')) {
			Ext.getCmp('resourceListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create(
					'DigiCompass.Web.ux.objectExplorer', {
						columns : columns,
						id : "resourceExplorer",
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
				id : "resourceCatalogue",
				height : 730,
				data : [],
				collapsible : true,
				split : true,
				region : 'center',
				hidden : true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel', {
				id : 'resourceListView',
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
													DigiCompass.Web.app.resource
															.showDetailPanel(null, datas);
												}
											},
											{
												xtype : 'button',
												text : 'Delete',
												iconCls : 'icon-delete',
												handler : function() {
													var checked = Ext
															.getCmp("resourceListView").objectExplorer
															.getChecked();
													var resourceIds = new Array();
													if (checked.length == 0) {
														Ext.Msg
																.alert(
																		'Warning',
																		'Please select a record!');
													} else {
														for ( var i = 0; i < checked.length; i++) {
															resourceIds
																	.push(checked[i].id);
														}
														alertOkorCancel(
																'Are you sure to delete selected resource?',
																function(e) {
																	if (e == 'yes') {
																		DigiCompass.Web.app.resource
																				.deleteResource(resourceIds);
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
				DigiCompass.Web.app.resource
						.showDetailPanel(record.data, datas);
			});
		}
	};

	DigiCompass.Web.app.resource.deleteResource = function(resourceIds) {
		var message = {};
		message.resourceIds = resourceIds;
		message.MODULE_TYPE = 'RESOURCE_MODULE';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.request(message,
				DigiCompass.Web.app.resource.deleteResourceCallback);
	}

	DigiCompass.Web.app.resource.deleteResourceCallback = function(data, Conf,
			fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			Ext.getCmp('obj-details').removeAll();
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.resourcePublish(queryParam);
			Ext.Msg.alert('Information', 'Delete Data Successful!');
		} else if (data.customException) {
			alertError(data.customException);
		}
	};

	DigiCompass.Web.app.resource.showDetailPanel = function(obj, managers) {
		var objExpPanel = Ext.getCmp('obj-details');
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var resourceTypeDetailPanel = Ext.create('Ext.panel.Panel', {
			id : 'resourceDetailPanel',
			// title:'Planned Site Detail',
			layout : 'vbox',
			autoScroll : true
		});
		var version = "";
		var obj_id = "";
		var ptitle = "Object Detail - Group Memebers";
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
		var formPanel = DigiCompass.Web.app.resource.getForm(obj, managers);
		var selectedGroupData = [];
		if (obj && obj.types) {
			selectedGroupData = obj.types;
		}
		var selectedGroupGridPanel = DigiCompass.Web.app.resource
				.getSelectedGroupGrid(selectedGroupData);
		resourceTypeDetailPanel.add(formPanel);
		resourceTypeDetailPanel.add(selectedGroupGridPanel);
	}

})();