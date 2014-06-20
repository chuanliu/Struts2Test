(function() {
	Ext.ns("DigiCompass.Web.app.roleDefinition");

	DigiCompass.Web.app.roleDefinition.getListData = function(data, config) {

		var fields = [ 'id', 'name', 'description'];
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

		DigiCompass.Web.app.roleDefinition.showObjExp(columns, fields, datas);
	};
	
	cometdfn.registFn({
		MODULE_TYPE : "ROLE_DEFINITION_MODULE",
		COMMAND : 'COMMAND_QUERY_LIST',
		callbackfn : DigiCompass.Web.app.roleDefinition.getListData,
		Config : {}
	});

	DigiCompass.Web.app.roleDefinition.showObjExp = function(columns, fields,
			datas) {

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}

		var objectExplorer = DigiCompass.Web.app.roleDefinition.getObjExp(
				columns, fields, datas);
		objExpPanel.add(objectExplorer);
	};

	DigiCompass.Web.app.roleDefinition.getTbar = function() {

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
											DigiCompass.Web.app.roleDefinition
													.showDetailPanel();
										}
									},
									{
										xtype : 'button',
										text : 'Delete',
										iconCls : 'icon-delete',
										handler : function() {
											var checked = Ext
													.getCmp("roleDefinitionListView").objectExplorer
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
														'Are you sure to delete selected role?',
														function(e) {
															if (e == 'yes') {
																var message = {};
																message.ids = ids;
																message.MODULE_TYPE = 'ROLE_DEFINITION_MODULE';
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
																								.rolePublish(queryParam);
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

	DigiCompass.Web.app.roleDefinition.getObjExp = function(columns, fields,
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
			id : 'roleDefinitionListView',
			module : 'ROLE_DEFINITION_MODULE',
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

		var tbar = DigiCompass.Web.app.roleDefinition.getTbar();
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
			DigiCompass.Web.app.roleDefinition.showDetailPanel(record.data);
		});

		if (Ext.getCmp('roleDefinitionListView')) {
			Ext.getCmp('roleDefinitionListView').reconfigData(datas);
		} else {
			mainPanel.reconfigData(datas);
		}

		return objectExplorer;
	};

	DigiCompass.Web.app.roleDefinition.showDetailPanel = function(obj) {

		var objExpPanel = Ext.getCmp('obj-details');
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var resourceTypeDetailPanel = Ext.create('Ext.panel.Panel', {
			layout : 'vbox'			
		});
		var version = "";
		var obj_id = "";
		var ptitle = "Object Detail - Role";
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
		objExpPanel.add(ReversalPanel);
		var formPanel = DigiCompass.Web.app.roleDefinition.getFormPanel(obj);
		//var gridPanel = DigiCompass.Web.app.roleDefinition.getGridPanel();
		resourceTypeDetailPanel.add(formPanel);
		//resourceTypeDetailPanel.add(gridPanel);
		DigiCompass.Web.app.roleDefinition.getPermissionsList(resourceTypeDetailPanel,obj_id);
	};

	DigiCompass.Web.app.roleDefinition.getFormPanel = function(obj){

		var fromPanel = Ext.create('Ext.form.Panel', {
			bodyPadding : 5,
			collapsible : true,
			width : '100%',
			height : 120,
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
				fieldLabel : 'Description',
				name : 'description'				
			} ],
			tbar : [ {
				xtype : 'button',
				text : 'Save',
				iconCls : 'icon-save',
				handler : function() {
					var form = this.up("form").getForm();
					if (form.isValid()) {
						var message = form.getValues();
						var records = new Array();
						var permissionsPanel = Ext.getCmp("permissionsPanel");
						if(permissionsPanel){
							var rootNode = permissionsPanel.getRootNode();
							getSelectedRightData(rootNode, records);				
						}						
						message.permissions = records;
						message.MODULE_TYPE = 'ROLE_DEFINITION_MODULE';
						message.COMMAND = 'COMMAND_SAVE';						
						cometdfn.request(message, function(message, conf) {
							var data = message['BUSINESS_DATA'] || {};
							if (message.STATUS === 'success'
									&& data.rv === 'success') {
								alertSuccess('save success.');
								var queryParam = Ext.getCmp(
										'objExtBtnSearchFieldId').getValue();
								DigiCompass.Web.UI.CometdPublish.rolePublish(queryParam);
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
		if(obj){
			fromPanel.getForm().setValues(obj);
		}
		return fromPanel;
	};
	
	function getSelectedRightData(node, records){
		if(node.hasChildNodes()){
			for(var i = 0; i < node.childNodes.length; i++){
				getSelectedRightData(node.childNodes[i], records);
			}
		} else {
			if(node.get("allow") != "" || node.get("deny") != ""){
				var data = {
					module : node.get("module"),
					command : node.get("command"),
					condition : node.get("condition"),
					allow : node.get("allow"),
					deny : node.get("deny")
				};
				records.push(data);
			}
		}
	}
	
	DigiCompass.Web.app.roleDefinition.checkchild = function(field, node){  
        node.eachChild(function(child) {
			if(child.childNodes.length>0){
				DigiCompass.Web.app.roleDefinition.checkchild(field, child);//递归  
		    }
			if(child.get(field) != null){
				child.set(field, node.get(field));				
			}
		});
    }  
	
	DigiCompass.Web.app.roleDefinition.checkparent = function(field, node){
		if(!node){
			return false;
		}
		var parentNode = node.parentNode;  
		if(parentNode !== null){
			var isall=true;  
		  	parentNode.eachChild(function(n){  
				if(!n.get(field)){
					isall=false;  
				}
			});
		  	parentNode.set(field , isall);		  	
		}
		DigiCompass.Web.app.roleDefinition.checkparent(field, parentNode);//递归  
	}
	
	function checkParentChild(field, node){
		if(node){
			DigiCompass.Web.app.roleDefinition.checkchild(field, node);
			DigiCompass.Web.app.roleDefinition.checkparent(field,  node);
			
			if(node.childNodes.length>0){
				node.eachChild(function(child){
					checkParentChild(field, child);//递归
				});				 
		    }
		}
	}
	
	function checkParent(node){
        var parent = node.parentNode;
        if(!parent){
            return;
        }
        var allow = true, deny = true;
        for(var i=0; i<parent.childNodes.length; i++){
            if(!parent.childNodes[i].get('allow')){
                allow = false;
            }
            if(!parent.childNodes[i].get('deny')){
                deny = false;
            }
        }
        parent.disableUpdateEvent = true;
        if(allow && parent.get('allow')!== true){
            parent.set('allow', true);
        }else if(!allow && parent.get('allow') === true){
            parent.set('allow', false);
        }
        if(deny && parent.get('deny')!==true){
            parent.set('deny', true);
        }else if(!deny && parent.get('deny') === true){
            parent.set('deny', false);
        }
        parent.disableUpdateEvent = false;
        checkParent(parent, allow, deny);
    }

	DigiCompass.Web.app.roleDefinition.getGridPanel = function(datas) {

		/*var store = Ext.create('Ext.data.Store',
				{
					fields : [ 'id', 'module', 'command', 'moduleName', 'commandName', 'condition', 'allow',
							'deny' ],
					groupField : 'moduleName',
					data : data
				});*/
		datas.text = "All";
		var store = Ext.create('Ext.data.TreeStore', {
			fields : ['module', 'command', 'text', 'commandName', 'condition', 'allow', 'deny' ],
		    root: datas,
		    listeners : {
		    	update : function(store,record,operation,modifiedFieldNames,eOpts ){
		    		if(record.disableUpdateEvent){
		    			return;
		    		}
		    		var fieldName = modifiedFieldNames ? modifiedFieldNames[0] : null;
                    if((fieldName && !(fieldName === 'allow' || fieldName ==='deny'))){
                        return;
                    }
                    var check = record.get(fieldName);
                    if(record.childNodes && record.childNodes.length>0){
                        for(var i=0; i<record.childNodes.length; i++){
                            record.childNodes[i].set(fieldName, check);
                        }
                    }
                    record.disableUpdateEvent = true;
                    if(fieldName === 'allow' && check && record.get('deny') === true){
                        record.set('deny', false);
                    }else if(fieldName === 'deny' && check && record.get('allow') === true){
                        record.set('allow', false);
                    }
                    record.disableUpdateEvent = false;
                    checkParent(record);
		    	}
		    }
		});

		var groupingFeature = Ext.create('Ext.grid.feature.Grouping');
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
		
		var searchField = Ext.create('Ext.ux.form.BtnSearchField',{
			width:500,
			onTrigger2Click : function(){
				var searchField = this,
					value = searchField.getValue();
				searchField.showCancelBtn();
				var panel = this.up("treepanel");
				/*var rootNode = panel.getRootNode();
				var records = new Array();
				rootNode.cascadeBy(function(node){
					if(node.data.kpiName.toLowerCase().indexOf(value.toLowerCase()) != -1){
						records.push(node);							
					}
				});		
				panel.getSelectionModel().select(records, true, false);*/
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
				var panel = this.up("treepanel");
				if(value != ""){				
					panel.filterByText(value);
				} else {
					panel.clearFilter();
				}						
			}
		});
		searchField.on("change", function(_this, newValue, oldValue, eOpts ){
			var panel = this.up("treepanel");
			if(newValue != ""){				
				panel.filterByText(newValue);
			} else {
				panel.clearFilter();
			}
		});

		var gridPanel = Ext.create('Ext.tree.Panel', {
			id : "permissionsPanel",
			title : "Rights",			
			store : store,
			flex : 1,
			cls: 'extra-alt',
			autoScroll : true,
			rootVisible : true,
			tbar : ['Search: ', ' ', searchField],
			viewConfig: {
			   stripeRows: true			   
			},
			columns : [ {
				text : 'Command',
				xtype : 'treecolumn',
				dataIndex : 'text',
				flex: 1
			}, {
				text : 'Condition',
				dataIndex : 'condition',
				editor : {				
					allowBlank : false
				},
				flex: 1,
				renderer : function(v, style, record){
					var t = DigiCompass.Web.app.roleDefinition.conditionS[record.get("module") + "_@_" + record.get("command")];
					if(v && v.length && v.length > 20){
						return "<font title='" + v + "'><a href='javascript:void(0)'>" + v + "</a></font>";
					} else if((v == null || v == "") && t){
						return '<a href="javascript:void(0)">Condition</a>';
					}
					return "<a href='javascript:void(0)'>" + v + "</a>";
				}
			}, {
				xtype : "checkcolumn",
				text : 'Allow',
				dataIndex : 'allow',
				flex: 1
			}, {
				xtype : "checkcolumn",
				text : 'Deny',
				dataIndex : 'deny',
				flex: 1
			} ],
			width : '100%',
			features : [ groupingFeature ],
			plugins : [ cellEditing ],
			listeners : {
				itemclick : function(view, record, item, index, e){
					
				}
				,beforeedit : function(editor, e, eOpts){
					var t = DigiCompass.Web.app.roleDefinition.conditionS[e.record.data.module + "_@_" + e.record.data.command];
					if(t && e.field == "condition"){
						var index = e.rowIdx;
						var sites = null;
						var services = null;
						var callback = function(str){
							e.record.store.getAt(index).set("condition", str)
						}
						var con = e.record.store.getAt(index).get("condition");
						switch(t){
						case 1: services = {condition : ""};
						case 2: sites = {condition : ""};
							break;
						case 3: services = {condition : ""};
							break;
						default:
						}
						var tmp = con.split(") AND (");
						if(t == 1 && tmp.length == 2){
							if(sites) sites.condition = tmp[0]
							if(services) services.condition = tmp[1]
						}else{
							if(t == 1){//all
								if(con.indexOf("changes.serviceOperation.serviceCatalogue.id") > -1){//service
									services.condition = con;
								}else{//site
									sites.condition = con;
								}
							}else if(t == 2){//site
								sites.condition = con;
							}else if(t == 3){//service
								services.condition = con;
							}
						}
						Ext.create('DigiCompass.Web.app.roleConditionS', callback, sites, services);						
					}
					return false;
				}
			},			
		    filterByText: function(text) {
		        this.filterBy(text, 'text');
		    },
		 
		 
		    /**
		     * Filter the tree on a string, hiding all nodes expect those which match and their parents.
		     * @param The term to filter on.
		     * @param The field to filter on (i.e. 'text').
		     */
		    filterBy: function(text, by) {
		 
		        this.clearFilter();
		 
		        var view = this.getView(),
		            me = this,
		            nodesAndParents = [];
		 
		        // Find the nodes which match the search term, expand them.
		        // Then add them and their parents to nodesAndParents.
		        this.getRootNode().cascadeBy(function(tree, view){
		            var currNode = this;
		            var _this = this;
		 
		            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
		                me.expandPath(currNode.getPath());
		 
		                while(currNode.parentNode) {
		                    nodesAndParents.push(currNode.id);
		                    currNode = currNode.parentNode;
		                }
		                
		                _this.cascadeBy(function(node){
		                	nodesAndParents.push(node.id);
		                });
		            }
		        }, null, [me, view]);
		 
		        // Hide all of the nodes which aren't in nodesAndParents
		        this.getRootNode().cascadeBy(function(tree, view){
		            var uiNode = view.getNodeByRecord(this);
		 
		            if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
		                Ext.get(uiNode).setDisplayed('none');
		            }
		        }, null, [me, view]);
		    },		 
		    clearFilter: function() {
		        var view = this.getView();
		        
		        this.getRootNode().cascadeBy(function(tree, view){
		            var uiNode = view.getNodeByRecord(this);
		 
		            if(uiNode) {
		                Ext.get(uiNode).setDisplayed('table-row');
		            }
		        }, null, [this, view]);
		    }	
		});

		return gridPanel;
	};
	DigiCompass.Web.app.roleDefinition.conditionS = {//1:all, 2:site, 3:service //module_@_command
		"MOD_CHANGE_REQUEST_APPROVE_@_COMMAND_QUERY_APPROVE" : 1,			//Approve
		"MOD_CHANGE_REQUEST_CANCEL_@_COMMAND_QUERY_CHANGE_CANCEL" : 1,		//Change Cancel
		"MOD_CHANGE_REQUEST_@_COMMAND_SITE_LIST_PRI" : 2,					//Change Requestor (Select Sites)
		"MOD_CHANGE_REQUEST_@_COMMAND_PannedSITE_LIST_PRI" : 2,				//Change Requestor (Select PlannedSites)
		"MOD_CHANGE_REQUEST_@_COMMAND_CHANGE_SUPPLIER_SERVICE" : 3,			//Change Requestor (Match Service)
		"MOD_CHANGE_REQUEST_@_COMMAND_CHANGE_SUPPLIER_CATELOGUE" : 3,		//Change Requestor (Match Service Catelogue)
		"MOD_CHANGE_REQUEST_RELEASE_@_COMMAND_QUERY_REALEASE" : 1,			//Realease
		"MOD_CHANGE_REQUEST_ACCPET_APPROVE_@_COMMAND_QUERY_COMPLETE_APPROVE" : 1,//Complete Approve
		"MOD_CHANGE_REQUEST_ACCEPT_@_COMMAND_QUERY_ACCEPT" : 1,				//Accept
		"MOD_CHANGE_REQUEST_RELEASE_OPERATION_APPROVE_@_COMMAND_QUERY_RELEASE_OPT_APPROVE" : 1,//Release Operation Approve
		"MOD_CHANGE_REQUEST_RELEASE_OPERATION_@_COMMAND_QUERY_RELEASEMANAGER" : 1,//Release Manager
		"MOD_VENDOR_@_ASSIGN_TO_VENDOR" : 1, //Assign to Vendor
		"IvReportsPlannedCells_@_grid" : 1, // Planned Cells
		"MOD_REPORT_CHANGE_REQUEST_@_cr_report" : 1, // Change Request
		"MOD_REPORT_CHANGE_REQUEST_@_eo_report" : 1,  // Engineering Orders
		"MOD_REPORT_CHANGE_REQUEST_@_mo_report" : 1,  // Material Orders
		"MOD_REPORT_CHANGE_REQUEST_@_po_report" : 1,  // Purchase Orders
		"MOD_REPORT_CHANGE_REQUEST_@_cm_report" : 1  // Commitment Tracking
	}
	
	function pagC(node, checked){
		node.set("allow", checked);
		if(checked){
			node.set("deny", !checked);
		}
		if(node.hasChildNodes()){
			for(var i = 0; i < node.childNodes.length; i++){
				pagC(node.childNodes[i], checked);
			}
		}
	}
	
	function iterNode(node, objIdx, rowIndex, objNode){
		if(objIdx.idx == rowIndex && objNode.node == null){
			objNode.node = node;			
		}
		if(node.hasChildNodes()){
			for(var i = 0; i < node.childNodes.length; i++){			
				++objIdx.idx;
				iterNode(node.childNodes[i], objIdx, rowIndex, objNode);				
			}
		}
	}

	DigiCompass.Web.app.roleDefinition.getPermissionsList = function(resourceTypeDetailPanel, obj_id) {
		var message = {};
		message.MODULE_TYPE = 'ROLE_DEFINITION_MODULE';
		message.COMMAND = 'COMETD_COMMAND_LIST_PERMISSION';
		message.roleId = obj_id;
		cometdfn.request(message, function(data, Conf) {
			var _data = data.BUSINESS_DATA.permissionsList;
			var datas = Ext.JSON.decode(_data);			
			if(data.BUSINESS_DATA.privilegeList){
				var _privilegeList = data.BUSINESS_DATA.privilegeList;
				var privilegeList = Ext.JSON.decode(_privilegeList);
				iterTree(datas, privilegeList);
			}			
			//Ext.getCmp("permissionsPanel").setRootNode(datas);
			var panel = DigiCompass.Web.app.roleDefinition.getGridPanel(datas);
			resourceTypeDetailPanel.add(panel);
		});
	};
	
	function iterTree(data, privilegeList){
		var children = data.children;
		if(children){
			for(var i = 0; i < children.length; i++){
				iterTree(children[i], privilegeList);
			}
		} else {
			DigiCompass.Web.app.roleDefinition.grantedInfo(data, privilegeList);
		}
	}
	
	DigiCompass.Web.app.roleDefinition.grantedInfo = function(data, privilegeList){		
		for(var i = 0; i < privilegeList.length; i++){
			var t = privilegeList[i];
			if(data.module == t.module && data.command == t.command){
				data.allow = t.allow;
				data.deny = t.deny;
				data.condition = t.condition;
			}
		}
	};

})();