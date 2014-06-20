(function() {
	Ext.ns("DigiCompass.Web.app.userMgt");
		
	DigiCompass.Web.app.userMgt.datas = null;			

	DigiCompass.Web.app.userMgt.getListData = function(data, config) {

		var fields = [ 'id', 'username', 'name', 'contact', 'email', 'accountExpires', 'accountNonLocked', 'expirationTime', 'mustChangePassword', 'cannotChangePassword', 'credentialsExpires', 'enabled', 'superior', 'groups'];
		var columns = [ {
			xtype : 'treecolumn',
			header : 'User Name',
			dataIndex : 'username'
		} ];
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		DigiCompass.Web.app.userMgt.datas = datas;		
		DigiCompass.Web.app.userMgt.showObjExp(columns, fields, datas);
	};
	
	cometdfn.registFn({
		MODULE_TYPE : "USER_MANAGE_MODULE",
		COMMAND : 'COMMAND_QUERY_LIST',
		callbackfn : DigiCompass.Web.app.userMgt.getListData,
		Config : {}
	});

	DigiCompass.Web.app.userMgt.showObjExp = function(columns, fields,
			datas) {

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}

		var objectExplorer = DigiCompass.Web.app.userMgt.getObjExp(
				columns, fields, datas);
		objExpPanel.add(objectExplorer);
	};

	DigiCompass.Web.app.userMgt.getTbar = function() {

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
											DigiCompass.Web.app.userMgt
													.showDetailPanel();
										}
									},
									{
										xtype : 'button',
										text : 'Delete',
										iconCls : 'icon-delete',
										handler : function() {
											var checked = Ext
													.getCmp("userMgtListView").objectExplorer
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
														'Are you sure to delete selected user?',
														function(e) {
															if (e == 'yes') {
																var message = {};
																message.ids = ids;
																message.MODULE_TYPE = 'USER_MANAGE_MODULE';
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
																								.userMgtPublish(queryParam);
																						alertSuccess('Delete Data Successful!');
																					} else if (data.customException) {
																						alertError(data.customException);
																					}
																				});
															}
														});
											}
										}
									},{										
										xtype : 'button',
										text : 'Online',									
										handler : function() {										
											cometdfn.request(
												{
													MODULE_TYPE : 'USER_MANAGE_MODULE',
													COMMAND : 'QUERY_ONLINE_USERS'
												},DigiCompass.Web.app.userMgt.OnlineUserCallback
											);										
										}
									}]
						});
	};
	
	DigiCompass.Web.app.userMgt.OnlineUserCallback = function(data, Conf,
			fnName, command) {
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'username'],
			data : datas
		});		

		var gridPanel = Ext.create('Ext.grid.Panel', {			
			store : store,
			columns : [ {
				text : 'Name',
				dataIndex : 'name'
			},{
				text : 'User Name',
				dataIndex : 'username',
			},{
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: './styles/cmp/images/delete.png',
                    tooltip: 'Session Expire Now',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex){
                    	var record = gridPanel.getStore().getAt(rowIndex);                    	
						cometdfn.request(
								{
									MODULE_TYPE : 'USER_MANAGE_MODULE',
									COMMAND : 'EXPIRE_USER_SESSION',
									userId : record.get("id") 
								},function(data, conf){
									
								}
							);	
                    }
                }]
			}]						
		});					

		Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			title : 'Online Users',
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

	DigiCompass.Web.app.userMgt.getObjExp = function(columns, fields,
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
			id : 'userMgtListView',
			module : 'USER_MANAGE_MODULE',
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

		var tbar = DigiCompass.Web.app.userMgt.getTbar();
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
			DigiCompass.Web.app.userMgt.showDetailPanel(record.data);
		});

		if (Ext.getCmp('userMgtListView')) {
			Ext.getCmp('userMgtListView').reconfigData(datas);
		} else {
			mainPanel.reconfigData(datas);
		}

		return objectExplorer;
	};

	DigiCompass.Web.app.userMgt.showDetailPanel = function(obj) {

		var objDetailPanel = Ext.getCmp('obj-details');
		if (objDetailPanel) {
			// 移除组建
			objDetailPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var detailPanel = Ext.create('Ext.panel.Panel', {
			layout : 'vbox',
			autoScroll : true
		});
		var groupData = [];
		var version = "";
		var obj_id = "";
		var ptitle = "Object Detail - User ";
		if (obj) {
			version = obj.name;
			obj_id = obj.id;
			ptitle = ptitle + "(" + version + ")";
			if(obj.groups){
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
		var formPanel = DigiCompass.Web.app.userMgt.getFormPanel(obj);		
		var gridPanel = DigiCompass.Web.app.userMgt.getSelectedGroupGrid(groupData);
		detailPanel.add(formPanel);
		detailPanel.add(gridPanel);
	};

	DigiCompass.Web.app.userMgt.getFormPanel = function(obj){
		
		var superiors = DigiCompass.Web.app.userMgt.datas;
		var username = obj?obj.username:null;
		
		function isancestor(data, superior, result){
			if(superior.superior == null){
				result.ancestor = false;
				return;
			}
			if(data.id == superior.superior.id){
				result.ancestor = true;
				return;
			}
			isancestor(data, superior.superior, result);
		}

		var superiorData = [];
		for ( var i = 0; i < superiors.length; i++) {

			var item = {};
			item.id = superiors[i].id;
			item.name = superiors[i].username;

			var ancestor = false;
			if (obj) {
				if (obj.id == superiors[i].id) {
					continue;
				}
				var result = {};
				isancestor(obj, superiors[i], result);
				ancestor = result.ancestor;
			}
			if (ancestor) {
				continue;
			}
			superiorData.push(item);
		}
		
		var superiorStore = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name' ],
			data : superiorData
		});

		var superiorComboBox = Ext.create('Ext.form.ComboBox', {
			fieldLabel : 'Manager',
			labelWidth : 120,
			name : 'superior',
			store : superiorStore,
			displayField : 'name',
			valueField : 'id'
		});

		var fromPanel = Ext.create('Ext.form.Panel', {
			id: 'baseForm', 
			bodyPadding : 5,
			collapsible : true,
			width : '100%',
			// The fields
			defaultType : 'textfield',
			defaults : {
				labelWidth : 120
			},
			items : [ {
				xtype : 'hiddenfield',
				name : 'id'
			}, {
				fieldLabel : 'User Name',
				name : 'username',
				allowBlank : false
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
			},{
				fieldLabel : 'Name',
				name : 'name',
				allowBlank : false,				
			},{
				fieldLabel : 'Contact',
				name : 'contact',
				allowBlank : false,				
			},{				
				fieldLabel : 'Email',
				name : 'email',
				allowBlank : false,
				vtype : "email"
			},superiorComboBox,{
				xtype : "displayfield",
				value : "Account options:"
			},{
			xtype : 'fieldset',						
			items : [
			{
        	   xtype : "checkboxfield",
        	   boxLabel  : 'User must change password at next logon',
	           name      : 'mustChangePassword',
	           inputValue: true,
	           uncheckedValue : false,
           },{
        	   xtype : "checkboxfield",
        	   boxLabel  : 'User cannot change password',
	           name      : 'cannotChangePassword',
	           inputValue: true,
	           uncheckedValue : false,
           },{
        	    id : "credentialsExpires",
				xtype : "checkboxfield",
				boxLabel  : 'Password never expires',
                name      : 'credentialsExpires',
                inputValue: false,
                uncheckedValue : true                
			},{
				id : "accountEnabled",
				xtype : "checkboxfield",
				boxLabel  : 'Account is disabled',
                name      : 'enabled',
                inputValue: false,
                uncheckedValue : true,                
                /*
				 * xtype : 'combo', allowBlank : false, name : 'enabled',
				 * fieldLabel: 'Enabled', displayField : 'name', valueField :
				 * 'value', value : true, store : { fields : [ 'value','name' ],
				 * data : [{ name:'YES', value:true },{ name:'NO', value:false }] }
				 */
			},{
				id : "chk_acct_lock",
				xtype : "checkboxfield",				
				boxLabel  : 'Account is locked out',
	            name      : 'accountNonLocked',
	            inputValue: false,
	            disabled : true,
	            uncheckedValue : true,
			}
			         ]
			},{
				xtype : 'fieldset',
				title : 'Account expires',				
				items : [
				         {xtype : "radio",boxLabel: 'Never', id : "neverRadio", name: 'accountExpires', inputValue: false, checked: true,listeners : {
			            		change : function(t, newValue, oldValue, eOpts ){
		                		if(newValue == true){		     
		                			var dateField = Ext.getCmp("accountExpirationTime");
		                			dateField.setReadOnly(true);
		                			dateField.allowBlank = true;
		                		}
		                	}
		            	}},
			            {
			            xtype : "container",
			            layout : "column",
			            items : [
			                  {xtype : "radio", id : "endofRadio",boxLabel: 'End of', name: 'accountExpires', inputValue: true,listeners : {
				            		change : function(t, newValue, oldValue, eOpts ){
			                		if(newValue == true){
			                			var dateField = Ext.getCmp("accountExpirationTime");
			                			dateField.setReadOnly(false);
			                			dateField.allowBlank = false;
			                		}
			                	}
			            	} },
			                  {
			                	id : "accountExpirationTime",
			      	           	xtype : "datefield",
			      	           	padding : "0 0 0 20",			      	           	
			      				name : 'expirationTime',                
			      				minValue: new Date(),
			      				readOnly : true
			      		    }
			            ]}			            			        			        			    
				]
			},{
				xtype : "container",
				layout : "column",
				items : [{
				xtype : 'button',
				text : 'Select User Groups',
				handler : function() {
					cometdfn
							.request(
									{
										MODULE_TYPE : 'USER_MANAGE_MODULE',
										COMMAND : 'QUERY_ALL_GROUPS'
									},
									DigiCompass.Web.app.userMgt.groupCallback);
					}
				},{
				xtype : 'button',
				text : 'Effective Rights',
				handler : function() {
					cometdfn
							.request(
									{
										MODULE_TYPE : 'USER_MANAGE_MODULE',
										COMMAND : 'QUERY_USER_ALL_PERMISSIONS',
										userName : username
									},
									DigiCompass.Web.app.userMgt.userAllPermissonsCallback);
					}
				}]
			}],
			tbar : [ {
				xtype : 'button',
				text : 'Save',
				iconCls : 'icon-save',
				handler : function() {
					var t_btn = this;
					var form = this.up("form").getForm();
					if (form.isValid()) {
						var message = form.getValues();
						var panel = Ext.getCmp("selectedGroupGridPanel");
						var store = panel.getStore();
						var groupIds = [];
						store.each(function(record) {
							var item = record.getData();
							groupIds.push(item.id);
						});
						message.groupIds = groupIds;
						message.MODULE_TYPE = 'USER_MANAGE_MODULE';
						message.COMMAND = 'COMMAND_SAVE';
						t_btn.disable();
						cometdfn.request(message, function(message, conf) {
							t_btn.enable();
							var data = message['BUSINESS_DATA'] || {};
							if (message.STATUS === 'success'
									&& data.rv === 'success') {
								alertSuccess('save success.');
								var queryParam = Ext.getCmp(
										'objExtBtnSearchFieldId').getValue();
								DigiCompass.Web.UI.CometdPublish.userMgtPublish(queryParam);
								var objExpPanel = Ext.getCmp('obj-details');
								if (objExpPanel) {
									// 移除组建
									objExpPanel.removeAll();
								}
							} else if(message.customException){
								alertError(message.customException);
							} else {
								alertError('save fail');
							}
						});
					}
				}
			} ]
		});
		if(obj){
			var formData = Ext.clone(obj);
			if(formData.superior){
				formData.superior = formData.superior.id;
			}			
			if(formData.expirationTime){
				formData.expirationTime = new Date(formData.expirationTime);
			}
			if(formData.accountNonLocked == false){
				Ext.getCmp("chk_acct_lock").setValue(true);
				Ext.getCmp("chk_acct_lock").enable();
			}
			delete formData.accountNonLocked;
			formData.credentialsExpires = !formData.credentialsExpires;			
			formData.enabled = !formData.enabled;			
			if(formData.accountExpires){
				Ext.getCmp("endofRadio").setValue(true);
			} else {
				Ext.getCmp("neverRadio").setValue(true);
			}
			delete formData.accountExpires;
			fromPanel.getForm().setValues(formData);			
			Ext.getCmp("password").allowBlank = true;
			Ext.getCmp("reEnPassword").allowBlank = true;			
		}
		return fromPanel;
	};
	
	DigiCompass.Web.app.userMgt.groupCallback = function(data, Conf,
			fnName, command) {
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		var selectedGroupPanel = Ext.getCmp('selectedGroupGridPanel');
		var selectedGroup = [];
		if(selectedGroupPanel){
			var store = selectedGroupPanel.getStore();
			store.each(function(record){
				selectedGroup.push(Ext.clone(record.data.id));
			});
		}
		var gridPanel = DigiCompass.Web.app.userMgt
				.getGroupGrid(datas);
		
		Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			title : 'User Groups',
			height : 600,
			width : 800,
			layout : 'fit',
			border : false,
			items : gridPanel
		}).show();
		gridPanel.getStore().each(function(record){
			for(var i = 0 ; i<selectedGroup.length ; i++){
				if(record.data.id === selectedGroup[i]){
					gridPanel.getSelectionModel().select(record,true);
				}
			}
		})
	};
	
	DigiCompass.Web.app.userMgt.userAllPermissonsCallback = function(data, Conf,
			fnName, command) {
		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);
		var gridPanel = DigiCompass.Web.app.userMgt.getUserAllPermissionsGridPanel(datas);
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
	
	DigiCompass.Web.app.userMgt.getUserAllPermissionsGridPanel = function(datas) {

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

	DigiCompass.Web.app.userMgt.getSelectedGroupGrid = function(data) {

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'description' ],
			data : data
		});

		var gridPanel = Ext.create('Ext.grid.Panel', {
			id : 'selectedGroupGridPanel',
			title : 'Member Of',
			collapsible : true,
			store : store,
			columns : [ {
				text : 'Group Name',
				dataIndex : 'name'
			}, {
				text : 'Description',
				dataIndex : 'description',
			} ],
			height : 200,
			width : '100%'
		});

		return gridPanel;
	};

	DigiCompass.Web.app.userMgt.getGroupGrid = function(data) {		
		
		var selectedRecords = Ext.getCmp('selectedGroupGridPanel').getStore().getRange();
		
		var sm = Ext.create('Ext.selection.CheckboxModel');
		
		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'description' ],
			data : data,
			listeners: {
		        load: function(t, records, successful, eOpts) {		        	
		        	//sm.select(selectedRecords);
		        	//Ext.getCmp('resourceGroupGridPanel').getSelectionModel().selectAll();
		        }
		    }
		});		
		
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

		var gridPanel = Ext.create('Ext.grid.Panel', {			
			selModel : sm,
			store : store,			
			columns : [ {
				text : 'Group Name',
				dataIndex : 'name'
			}, {
				text : 'Description',
				dataIndex : 'description',
			} ],
			height : 200,
			width : '100%',
			tbar : ['Search: ', ' ', searchField, {
				xtype : 'button',
				text : 'Finish',
				handler : function() {					
					var records = sm.getSelection();
					Ext.getCmp("selectedGroupGridPanel").getStore().loadData(records);
					this.up("window").close();
				}
			}],
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
		return gridPanel;
	};
	
	DigiCompass.Web.app.userMgt.showPublicProfile = function(message){
		var pubProfile = Ext.getCmp("pubProfileWindow");
		if (pubProfile) {
			pubProfile.show();
			return;
		}

		var panel = Ext.create("Ext.form.Panel", {
			height : 300,
			bodyPadding : 5,
			defaultType : 'textfield',
			items : [{
				fieldLabel : 'Name',
				name : 'name',
				allowBlank : false,				
			},{
				fieldLabel : 'Contact',
				name : 'contact',
				allowBlank : false,				
			},{				
				fieldLabel : 'Email',
				name : 'email',
				allowBlank : false,
				vtype : "email"
			}],
			buttons : [ {
				formBind : true, // only enabled once the form is valid
				disabled : true,
				text : "Continue",
				handler : function() {					
					var form = this.up('form').getForm();
					if (form.isValid()) {
						var message = form.getValues();						
						message.MODULE_TYPE = 'PROFILE_MODULE';
						message.COMMAND = 'COMMAND_SAVE';
						cometdfn.request(message, function(data, Conf) {
							var status = data.STATUS;
							if (status === "success") {							
								var rv = data.BUSINESS_DATA.rv;
								if(rv == 0){
									Notification.showNotification("save success");
									win.close();
								} else {
									Notification.showNotification("save fail");									
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});
					}
				}
			} ]
		});
		panel.getForm().setValues(message.BUSINESS_DATA);
		var win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
			id : "pubProfileWindow",
			height : 330,
			width : 520,			
			modal : true,
			items : [ panel ]
		});
		win.show();
	};

})();