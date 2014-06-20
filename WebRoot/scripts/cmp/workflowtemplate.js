(function() {
	Ext.namespace('DigiCompass.Web.app.wftemp');
	var focusedWftItem;
	DigiCompass.Web.app.wftemp.categoryTypeData = [];
	DigiCompass.Web.app.wftemp.getFocusedNode = function(){
		return DigiCompass.Web.app.wftemp.focusedNode;
	}
	DigiCompass.Web.app.wftemp.showWorkflowSelectWindow = function(){
		
		var templateWin = Ext.getCmp('chooseTemplate');
		var store = Ext.create('Ext.data.TreeStore', {
			fields: [{name: 'name',     type: 'string'}],
			root: {
				text : 'root',
		        expanded: true
			},
		    folderSort: true
		});
		
		var tree = Ext.create('Ext.tree.Panel',{
			id : 'wftTree',
	        frame: true,
	        store: store,
	        columns: [{
	        	xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 1,
	            sortable: true,
	            dataIndex: 'name'
	        }],
	        rootVisible: false,
	        listeners : {
	        	checkchange : function(node, checked){
	        		if(checked){
	        			tree.getRootNode().cascadeBy(function(n){
	        				if(!n.isRoot() && n.data.checked && n.data.id != node.data.id ){
	        					n.set('checked',false);
	        				}
	        			})
	        		}
	        	}
	        }
	    });
		
		DigiCompass.Web.app.financialCategory.queryWftp();
		
		if(!templateWin){
			templateWin = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			    title: 'Select Parent Service Catalogue',
			    id : 'chooseTemplate',
			    modal : true,
			    height: 500,
			    width: 300,
			    layout: 'fit',
			    items: [tree],
			    tbar : [{
			    	xtype : 'button',
			    	text  : 'Finish',
			    	iconCls : 'icon-save',
			    	handler : function(){
			    		if(templateWin){
			    			var fieldId = Ext.getCmp('parentId');
			    			var fieldName = Ext.getCmp('parentName');
			    			var checked = tree.getChecked();
			    			if(checked.length > 0){
				    			if(fieldName && fieldId){
				    				fieldName.setValue(checked[0].data.name);
				    				fieldId.setValue(checked[0].data.id);
				    				templateWin.close();
				    			}
			    			}else{
			    				Notification.showNotification('No ServiceCatalogueTemplate is Selected!');
			    			}
			    		}
			    	}
			    }]
			}).show();
		}else{
			templateWin.show();
		}
	}
	DigiCompass.Web.app.wftemp.getWorkflowTempTree = function(data){
		var tmpData = {};
		for(var i = 0 ; i< data.length ; i++){
			tmpData[data[i]['id']] = data[i]; 
		}
		var treeData = [];
		for(var i = 0 ; i<data.length; i++){
			if(data[i]['parentId'] == data[i]['id'] || !tmpData[data[i]['parentId']]){
				treeData.push(data[i]);
			}else{
				if(tmpData[data[i]['parentId']]['children']){
					tmpData[data[i]['parentId']]['children'].push(data[i]);
				}else{
					tmpData[data[i]['parentId']]['children'] = [data[i]];
				}
			}
			data[i].checked = false;
		}
		for(var i = 0 ; i<data.length ; i++){
			if(data[i]['children']){
				data[i]['leaf'] = false;
				data[i]['expanded'] = true;
			}else{
				data[i]['leaf'] = true;
			}
		}
		return treeData;
	}
	//init Object Explorer
	DigiCompass.Web.app.wftemp.getList = function(data, config) {
		var fields = ['id', 'name', 'description', 'categories', 'categoryGroup', 'items'];
		var columns = [{
			xtype : 'treecolumn',
			header : 'Service Catalogue',
			flex : 2,
			dataIndex : 'name'
		},{			
			header : 'Description',
			flex : 1,
			dataIndex : 'description'
		}];

		var _data = Ext.JSON.decode(data.BUSINESS_DATA.list);
		DigiCompass.Web.app.wftemp.data = Ext.clone(_data);
		var treeData = DigiCompass.Web.app.wftemp.getWorkflowTempTree(_data);
		if (Ext.getCmp('wftempListView')) {
			Ext.getCmp('wftempListView').reconfigData(treeData);
		} 
		else {			
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer', {
				viewConfig: {
		            plugins: {
		                ddGroup: 'workflowTemplateDragDropGroup',
		                ptype: 'gridviewdragdrop',
		                enableDrop: false
		            }
		        },
				columns : columns,
				id : "wftempExplorer",
				fields : fields,
				width : "fit",
				height : 700,
				data : []
			});

			/*objectExplorer.on('checkchange', function(node, checked) {
				objectExplorer.checkchild(node, checked);
				objectExplorer.checkparent(node);
			});*/

			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue', {
				width : "fit",
				id : "wftempCatalogue",
				height : 730,
				data : [],
				collapsible : true,
				split : true,
				region : 'center',
				hidden : true
			});
			
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel', {
				id : 'wftempListView',
				module : 'SERVICE_TEMPLATE_MODULE',
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
			
			mainPanel.reconfigData(treeData);
			
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
			
			objectExplorer.addDocked(Ext.create('Ext.toolbar.Toolbar',{
				width : 200,
				items : [{
					xtype : 'button',
					text : 'New',
					iconCls : 'icon-add',
					handler : function() {
						DigiCompass.Web.app.wftemp.focusedNode = null;
						DigiCompass.Web.app.wftemp.showDetailPanel(null);
					}
				},{
					xtype : 'button',
					text : 'Delete',
					iconCls : 'icon-delete',
					handler : function() {
						var checked = Ext.getCmp("wftempListView").objectExplorer.getChecked();
						var wftempIds = new Array();
						if (checked.length == 0) {
							Ext.Msg.alert('Warning', 'Please select a record!');
						} else {
							for ( var i = 0; i < checked.length; i++) {
								wftempIds.push(checked[i].id);
							}
							alertOkorCancel('Are you sure to delete selected ServiceCatalogueTemplate?',
								function(e) {
									if (e == 'yes') {
										DigiCompass.Web.app.wftemp.deleteWorkflowTemplate(wftempIds);
									}
								});
						}
					}
				} ]
			}));
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			objectExplorer.addListener('itemclick', function(grid, record, item, index, event, eOpts) {
				var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
				if (isChecked) {
					return;
				}
				if (Ext.isEmpty(record.data.id)) {
					return;
				}
				DigiCompass.Web.app.wftemp.showDetailPanel(record.data);
			});
		}
	};
	//init Object Detail
	DigiCompass.Web.app.wftemp.initForm = function( id , flag ) {
		var isUpdate = !Ext.isEmpty(id);
		DigiCompass.Web.app.wftemp.focusedNode = null;
		var serviceData = Ext.clone(DigiCompass.Web.app.wftemp.data);
		if(id){
			for(var i in serviceData){
				if(serviceData[i] === id){
					serviceData.splice(i, 0);
					break;
				}
			}
		}
		var detail = Ext.create('Ext.form.Panel',{
			id : "wftempFormDetail",
			region : 'north',
			heigth : 'fit',
			width : "100%",
			collapsible : false,
			border : false,
			frame : false,
			bodyStyle : 'padding:5px',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side'
			},
			defaults : {
				anchor : '100%'
			},
			buttonAlign : 'left',
			items : [{
				border : false,
				layout : 'anchor',
				defaultType : 'textfield',
				defaults : {
					anchor : '50%',
					labelWidth : '30%',
				},
				border : false,
				items : [{
						xtype : 'hidden',
						name : 'id',
						id : 'wftId'
					},{
						allowBlank : false,
						fieldLabel : 'Name',
						id : 'wftName',
						name : 'name',
						listeners : {
							change : function(me, newValue, oldValue, Opts){
								DigiCompass.Web.app.financialCategory.rootNodeName('wftWorkflowTreePanel',newValue);
							}
						}
					},{
						fieldLabel : 'Description',
						maxLength : 30,
						name : 'description'
					},{
				        xtype: 'radiogroup',
				        fieldLabel: 'Pre-approved',
				        // Arrange radio buttons into two columns, distributed vertically
				        columns: 2,
				        vertical: true,
				        items: [
				            { id : 'preAprYesId', boxLabel: 'yes', name: 'preapprove', inputValue: true },
				            { id : 'preAprNoId',boxLabel: 'no', name: 'preapprove', inputValue: false, checked: true},
				        ]
				    },{
						fieldLabel : 'Parent',
						maxLength : 30,
						id : 'parentName',
						name : 'parentName',
						listeners : {
							focus : function(){
								DigiCompass.Web.app.wftemp.showWorkflowSelectWindow();
							}
						}
					},{
						xtype : 'hidden',
						id : 'parentId',
						name : 'parentId'
					},Ext.create('DigiCompass.web.UI.ComboBox',{
						name : 'categoryTypeId',
						id			 : 'categoryTypeGroupWftp',
						fieldLabel : 'ServiceCatalogue',
						moduleType : 'MOD_WORK_FLOW',
						labelWidth : '30%',
						moduleCommand : 'COMMAND_QUERY_COMBOX_LIST',
						fieldLabel   : 'Service Catelogue Hierarchy',
						allowBlank   : false,
						editable     : false,
						disable : isUpdate,
						parseData : function(message){
							var data = Ext.JSON.decode(message['BUSINESS_DATA']['comboList']);
							var d = [];
							for(var i in data){
								d.push([data[i].id, data[i].name]);
							}
							return d;
						},
						listeners : {
							change : function(field, newValue, oldValue, eOpts){
								if(Ext.isEmpty(this.value)){
									return;
								}
								DigiCompass.Web.app.wftemp.categoryTypeData = [];
								//load category type info
								cometdfn.publish({
									MODULE_TYPE : 'MOD_WORK_FLOW',
									COMMAND : 'COMMAND_QUERY_ALL_TREE',
									id : this.value
								});
								if(!Ext.getCmp('wftWorkflowTreePanel')){
									DigiCompass.Web.app.wftemp.initTemplateInfo([]);
								}else{
									Ext.getCmp('wftWorkflowTreePanel').getRootNode().removeAll();
								}
								var fchId = Ext.getCmp("fchId").getValue();
								cometdfn.publish({
									MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
									COMMAND : 'COMMAND_QUERY_LIST',
									dataType : 'TreeData',
									categoryTypeId : newValue,
									fchId : fchId 
								});
								adjustButtonED();
							},
							afterrender : function(){
								Ext.create('Ext.tip.ToolTip', {
								    target: 'preAprYesId',
								    html: 'Allow user to create catalogue when submitting new change request.'
								});
								Ext.create('Ext.tip.ToolTip', {
								    target: 'preAprNoId',
								    html: 'Disallow user to create catalogue when submitting new change request.'
								});								
							}
						}
					}),{
						id			 : 'fchId',						
						xtype		 : 'combo',
						name : "fchId",
						fieldLabel 	 : 'Financial Catalogue Hierarchy',
						emptyText : 'please select an item.',
						allowBlank 	 : false,
						labelWidth : '30%',
						displayField : 'name',
						valueField	 : 'id',
						editable	 : false,
						store	 	 : {
							fields : ['id','name'],
							data   : DigiCompass.Web.app.financialCategory.comboData
						},
						listeners : {
							change : function(field, newValue, oldValue, eOpts){
								if(Ext.isEmpty(this.value)){
									return;
								}
								var categoryTypeId = Ext.getCmp("categoryTypeGroupWftp").getValue();
								/*DigiCompass.Web.app.wftemp.categoryTypeData = [];								
								//load category type info
								cometdfn.publish({
									MODULE_TYPE : 'MOD_WORK_FLOW',
									COMMAND : 'COMMAND_QUERY_ALL_TREE',
									id : categoryTypeId
								});
								if(!Ext.getCmp('wftWorkflowTreePanel')){
									DigiCompass.Web.app.wftemp.initTemplateInfo([]);
								}else{
									Ext.getCmp('wftWorkflowTreePanel').getRootNode().removeAll();
								}*/								
								cometdfn.publish({
									MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
									COMMAND : 'COMMAND_QUERY_LIST',
									dataType : 'TreeData',
									categoryTypeId : categoryTypeId,
									fchId : newValue
								});
								adjustButtonED();
							}
						}
					}]
				}],
				tbar:[{
					xtype : 'button',
					text : 'Save',
					iconCls:'icon-save',
					handler : function() {		
						var saveBtn = this;
						var form = this.up("form").getForm();
						if(form.isValid()){
							
							var message = form.getValues();
							var root = Ext.getCmp('wftWorkflowTreePanel').getRootNode(); 
							
							if(root.childNodes.length == 0){
								Notification.showNotification('Item is empty!');
								return ;
							}
							
							message.categoryData = getCategorys(root.childNodes);
							if(message.categoryData == null){
								return;
							}
							
							message.MODULE_TYPE = 'SERVICE_TEMPLATE_MODULE';							
							if(flag){
								message.reUseable = false;
							}else{
								message.reUseable = true;
							}							
							console.log(message);
							if(Ext.getCmp("wftId").getValue() != ""){
								message.COMMAND = 'COMETD_COMMAND_RENEW_SC';
								cometdfn.request(message, function(message) {
									var data = message['BUSINESS_DATA'] || {};
									if (message.STATUS === 'success') {
										if(data.renew == true){
					   	                	Ext.MessageBox.confirm('','This service catalogue is used by some service agreement. To confirm the change, the service agreement will be automatically updated. The quantity, capex, and opex value in the service agreement will be updated according to the modified service catalogue. Would you like to proceed?',function(btn){
					   	        				if(btn=='yes'){
					   	        					saveSc(flag, saveBtn, message);
					   	        				}
					   	        			});
										} else {
											saveSc(flag, saveBtn, message);
										}
									}else{
										alertError('save fail');
									}
								});
							} else {
								saveSc(flag, saveBtn, message);
							}
						}
					}
				} ]
			});
		if (id) {
			cometdfn.request({
				MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
				COMMAND : 'COMMAND_QUERY_INFO',
				id : id
			}, function(message){
				var info = Ext.JSON.decode(message.BUSINESS_DATA);
				var wftData = Ext.clone(DigiCompass.Web.app.wftemp.data);
				detail.getForm().setValues(info);
				var capex = 0;
				var opex = 0;
				var quantity = 0;
				var children = info.categoryData;
				for(var i = 0 ; i < children.length ;  i++){
					capex = capex + children[i]['capex'];
					opex = opex + children[i]['opex'];
					quantity = quantity + children[i]['quantity'];
				}
				Ext.getCmp('wftWorkflowTreePanel').setRootNode({
					name : info.name ,
					expanded : true,
					capex : capex ,
					opex : opex ,
					quantity : quantity,
					children : info.categoryData
				});
				Ext.getCmp('wftWorkflowTreePanel').expandAll();
				
			});
		}
		return detail;
	};
	function saveSc(flag, saveBtn, message){		
		saveBtn.disable();
		message.COMMAND = 'COMMAND_SAVE';
		cometdfn.request(message, function(message) {
			saveBtn.enable();
			var data = message['BUSINESS_DATA'] || {};
			if (message.STATUS === 'success'
					&& data.status === 'success') {
				alertSuccess('save success.');
				if(flag){
					DigiCompass.Web.app.financialCategory.queryWftp();
				}else{
					var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
					DigiCompass.Web.UI.CometdPublish.workFlowTemplate(queryParam);
					var objExpPanel = Ext.getCmp('obj-details');
					if (objExpPanel) {
						// 移除组建
						objExpPanel.removeAll();
					}
				}
			}else{
				alertError('save fail');
			}
		});
	}
	function checkPropertyRequire(property){
		for(var key in property){
			if(property[key].optional == false && Ext.isEmpty(property[key].value)){
				return property[key].name;
			}
		}
	}
	function adjustButtonED(){
		var sch = Ext.getCmp("categoryTypeGroupWftp").getValue();
		var fch = Ext.getCmp("fchId").getValue();
		if(sch != null && fch != null){
			Ext.getCmp("importButtonId").enable();
		} else {
			Ext.getCmp("importButtonId").disable();
		}
	}
	var getCategorys = function(childNodes){
		var datas = [];
		for(var i = 0 ; i<childNodes.length ; i++){
			var checkedFlag = checkPropertyRequire(childNodes[i].raw.property);
			if(checkedFlag){
				var errorMsg = DigiCompass.Web.app.workFlow.showErrorProperty(checkedFlag, childNodes[i].data.name );
				Notification.showNotification(errorMsg);
				return null;
			}
			var data = {
					typeId : childNodes[i].raw.typeId ,
					currentId : childNodes[i].raw.currentId,
					name : childNodes[i].data.name || childNodes[i].data.text,
					property : childNodes[i].raw.property 
			};
			if(childNodes[i].isLeaf()){
				
				data.sowTree = childNodes[i].raw.sowTree;
				data.dependencys = childNodes[i].raw.dependencys;
				data.parentId = childNodes[i].raw.parentId;
				
				if(!data.dependencys){
					data.dependencys = [];
				}
				
				var capex = childNodes[i].data.capex;
				var opex = childNodes[i].data.opex;
				var quantity = childNodes[i].data.quantity;
				var project = childNodes[i].data.project;
				
				if(Ext.isEmpty(capex)){
					capex = 0;
				}
				
				if(Ext.isEmpty(opex)){
					opex = 0;
				}
				
				if(Ext.isEmpty(quantity)){
					quantity = 1;
				}
				
				data.capex = capex;
				data.opex = opex;
				data.quantity = quantity;
				data.project = project;				
				if(project == null || project == ""){					
					Notification.showNotification(childNodes[i].data.name + ' must have project !');
					return null;
				}
			}
			if(!childNodes[i].isLeaf() && childNodes[i].childNodes.length == 0){
				Notification.showNotification(childNodes[i].data.name + ' has no children !');
				return null;
			}
			if(childNodes[i].childNodes.length > 0){
				var childDatas = getCategorys(childNodes[i].childNodes);
				if(childDatas == null){
					return null;
				}
				data.children = childDatas;
			}
			datas.push(data);
		}
		return datas;
	}
	function iterChildNode(node){
		
		node.currentId = Ext.id();
		if(node.children && node.children.length > 0){
			for(var i = 0; i < node.children.length; i++){
				iterChildNode(node.children[i]);
			}
		}
	}
	
	DigiCompass.Web.app.wftemp.initTemplateInfo = function(categoryData) {
		var datas = categoryData;
		
		var msg = function(title, msg, error) {
	        Ext.Msg.show({
	            title: title,
	            msg: msg,
	            minWidth: 200,
	            modal: true,
	            icon: error == false ? Ext.Msg.INFO : Ext.Msg.ERROR,
	            buttons: Ext.Msg.OK
	        });
	    };
		
		countQtyCapexOpex(datas);
		var wftName;
		if(Ext.getCmp('wftName')){
			wftName = Ext.getCmp('wftName').getValue();
		}

		if(Ext.getCmp('wftWorkflowTreePanel')){
			Ext.getCmp('wftWorkflowTreePanel').setRootNode({
				name : wftName ? wftName : 'Service Catelogue' ,
				expanded : true,
				children : datas
			});
			if(Ext.getCmp('wftWorkFLowPropertyGrid')){
				Ext.getCmp('wftWorkFLowPropertyGrid').getStore().loadData([]);
			}
			if(Ext.getCmp('wftWorkFlowSowTree')){
				Ext.getCmp('wftWorkFlowSowTree').hide();
			}
			if(Ext.getCmp('dependencyPanel')){
				Ext.getCmp('dependencyPanel').hide();
			}
		}else{
			
			var searchField = Ext.create('Ext.ux.form.BtnSearchField',{
				width:150,
				onTrigger2Click : function(){
					var searchField = this,
						value = searchField.getValue();
					searchField.showCancelBtn();
					var panel = this.up("treepanel");
					var rootNode = panel.getRootNode();
					var records = new Array();
					rootNode.cascadeBy(function(node){
						if(node.data.name.toLowerCase().indexOf(value.toLowerCase()) != -1){
							records.push(node);							
						}
					});		
					panel.getSelectionModel().select(records, true, false);					
				},
				onTrigger1Click : function(){
					var searchField = this;
					searchField.hideCancelBtn();
					value = searchField.getValue();
					var panel = this.up("treepanel");
					var rootNode = panel.getRootNode();
					var records = new Array();
					rootNode.cascadeBy(function(node){
						if(node.data.name.indexOf(value) != -1){
							records.push(node);							
						}
					});		
					panel.getSelectionModel().select(records, true, false);						
				}
			});
			
			//category tree grid
			var treePanel = Ext.create('Ext.tree.Panel', {
				id : 'wftWorkflowTreePanel',
				height : 'fill',
				region : 'center',
				title : 'Service Catalogue',
				//margin : '0px 10px 5px 5px',
				selModel : Ext.create("Ext.selection.RowModel"),
				width : 400,
				plugins     : [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1,
		        	listeners : {
		        		beforeedit: function (me, e) {
		        			return e.record.isLeaf()/* && (e.record.raw.reference == 0 || Ext.isEmpty(e.record.raw.reference))*/ || e.colIdx == 0 && !e.record.isLeaf() ;
		        		},
		        		edit : function( editor, e, eOpts ){
		        			var record = e.record;
		        			if(record.isRoot()){
		        				Ext.getCmp('wftName').setValue(record.data.name);
		        			}
		        		}
		        	}
				})],
				rootVisible : true,
				store : Ext.create('Ext.data.TreeStore', {
					fields: ['categoryId','property','name','capex','opex','quantity','sowTree','dependencys', 'project'],
					root: {
						name : wftName ? wftName : 'Service Catelogue' ,
						expanded : true
					},
					folderSort : false,
				    listeners : {
			        	update : function( me, record, operation, changeItem){
			        		if(Ext.isEmpty(changeItem)){
			        			return;
			        		}
			        		me.suspendEvents();
			        		if(changeItem[0] == 'opex' || 
			        				changeItem[0] == 'capex' || 
			        				changeItem[0] == 'quantity'){
			        			record.commit();
			        			changeParentNodeValue(record, changeItem[0]);
			        		}
			        		me.resumeEvents();
			        	}
				    }
				}),
				tbar : ['Search: ', ' ', searchField,{
		        	xtype   : 'button',
		        	text    : 'Tree View',
		        	handler : function(){
		        		var data = DigiCompass.Web.TreeUtil.getTreeData(treePanel.getRootNode());
		        		//通过data画workflowCategory d3 效果 tree
		        		DigiCompass.Web.app.planningModelTree.showTree(data , 'workFlowItemD3Tree', 'Tree View');
		        	}
		        },{
					xtype : 'button',
					text : 'Export',
					handler : function(){
						Ext.MessageBox.confirm('Confirm', 'Do you want export Service Category Items with SOW?', function(btn){			
							if('cancel' == btn){
								return;
							}
							var wftId = Ext.getCmp("wftId").getValue();
							var title = 'Service Catalogue_' + Ext.getCmp("wftName").getValue();
							if(wftId){
			    				var data = {
			    					wftId : wftId,
			    					enableSow : btn,
			    					MODULE_TYPE : "SERVICE_TEMPLATE_MODULE",
			    					COMMAND : "COMMAND_EXPORT",
									title : title						
				            	};
				            	var str = context.param(data);
				            	window.location.href = "download?"+str;
							}
						});					
					}
				},{
					xtype : 'button',
					text : 'Import',
					id : "importButtonId",
					handler : function(){			
		            	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
		            		layout: 'fit',
            		        width: 500,
            		        height: 300,
            		        modal: true,
            		        closeAction: 'destroy',
            		        items: {
            		        	xtype : 'form',
            		            frame: true,
            		            defaults: {
            		            	anchor: '100%',
            		                allowBlank: false,
            		                msgTarget: 'side',
            		                labelWidth: 50
            		            },
            		            items: [{
            		            	xtype: 'filefield',
            		                id: 'form-file',
            		                emptyText: 'Select an file',
            		                fieldLabel: 'File',
            		                name: 'file-path',
            		                buttonText: '',
            		                buttonConfig: {
            		                   iconCls: 'upload-icon'
            		                },
            		                vtype: 'file'
            		            }],
            		            buttons: [{
            		            	text: 'Upload',
            		                handler: function(){
            		                	var form = this.up('form').getForm();
            		                    if(form.isValid()){
            		                    	Ext.MessageBox.confirm('Confirm', 'Do you want import Service Category Items with SOW?', function(btn){
            		                    		if('cancel' == btn){
	            									return;
	            								}
            		                	        var groupId = Ext.getCmp('categoryTypeGroupWftp').getValue();
	            		                        form.submit({
	            		                        	url: 'upload',
	            		                            params: {
	            		                            	groupId : groupId,
	            		                        	    enableSow : btn,
	            		                        	    MODULE_TYPE : "SERVICE_TEMPLATE_MODULE",
	            		                        	    COMMAND : "WORKFLOW_IMPORT"
	            		                            },
	            		                            waitMsg: 'Uploading your file...',
	            		                            success: function(fp, o) {
	            		                            	var data = o.result.categoryTree;
	            		                            	var childData = Ext.decode(data);
	            		                            	var child = [];
	            		                            	for(var key in childData){
	            		                            		child.push(childData[key]);			            		                    			
	            		                            	}
	            		                            	for(var i = 0; i < child.length; i++){
	            		                            		iterChildNode(child[i]);
	            		                            	}
	            		                            	var name = 'root';
	            		                            	var field = Ext.getCmp('wftName');
	            		                            	if(field && field.getValue()){
	            		                            		name = field.getValue();
	            		                            	}
	            		                            	var root = {
	            		                            			name:name,
	            		                            			children : child,
	            		                            			expanded : true
	            		                            	};
	            		                            	Ext.getCmp('wftWorkflowTreePanel').setRootNode(root);
	            		                            	Ext.getCmp('wftWorkflowTreePanel').expandAll();
	            		                            	win.close();
	            		                            },
	            		                            failure: function(form, action){
	            		                            	msg('Failure', 'Error processed file on the server', true);
	            		                            }
	            		                        });
            		                    	});
            		                    }
            		                }
            		            },{
            		            	text: 'Reset',
            		                handler: function() {
            		                	this.up('form').getForm().reset();
            		                }
            		            }]
            		        }
		            	});
		            	win.show();
					}
				}],
				columns: [{
		            xtype	  : 'treecolumn', //this is so we know which column will show the tree
		            text	  : 'Name',
		            flex	  : 6,
		            sortable  : false,
		            maxLength  : UiProperties.nameMaxLength ,
		            dataIndex : 'name',
		            editor:{
		            	maxLength  : UiProperties.nameMaxLength ,
		            	allowBlank : false
		            }
		        },{
		        	 text	  : 'Capex',
		             flex	  : 3,
		             xtype: 'numbercolumn',
			         format    : '0,000.00',
		             sortable  : false,
		             dataIndex : 'capex',
		             editor:{
						 xtype:'numberfield',
						 minValue : 0,
		            	 maxLength  : UiProperties.nameMaxLength 
		             }
		        },{
	        	 	text	  : 'Opex',
		            flex	  : 3,
		            xtype	  : 'numbercolumn',
		            format    : '0,000.00',
		            sortable  : false,
		            dataIndex : 'opex',
		             editor:{
						 xtype:'numberfield',
						 minValue : 0,
		            	 maxLength  : UiProperties.nameMaxLength 
		             }
		        },{
	        	 	text	  : 'Quantity',
		            flex	  : 2,
		            sortable  : false,
		            dataIndex : 'quantity',
		            editor:{
						xtype:'numberfield',
		            	allowBlank : false,
		            	minValue : 1
		            }
		        },{
					header : 'Project',
					dataIndex : 'project',
					flex : 1,					
					renderer:function(value,metaData,record){
						if(value){
							return value.name;
						}else{
							return value;
						}
					}
		        },{
					flex 		 : 1,
					width		 : 40,
		            menuDisabled : true,
		            xtype: 'actioncolumn',
		            align: 'center',
		            items: [{
			                icon: './styles/cmp/images/delete.png',  
			                scope: this,
			                getClass: function(value,meta,record,rowIx,colIx, store) {            
			                    return 'x-hide-display';  //Hide the action icon
			                },
			                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
				            	/*if(record.isRoot() || record.raw.reference > 0){
				            		return;
				            	}*/
				            	var parent = record.parentNode;
				            	record.remove();
			                }
		            	},{
			                icon: './styles/cmp/images/add.png',  
			                scope: this,
			                getClass: function(value,meta,record,rowIx,colIx, store) {            
			                    return 'x-hide-display';  //Hide the action icon
			                },
			                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
			                	var data = DigiCompass.Web.app.wftemp.categoryTypeData ;
			                	if(!data || data.length == 0){
			                		return;
			                	}
				            	if(record.isRoot()){
				            		record.appendChild(Ext.apply(Ext.clone(data[0]),{
				            			currentId:Ext.id(),
				            			text: data[0].name
				            		}));
				            	}else{
					            	var childNode;
					            	for(var i = 0 ; i< data.length ; i++){
					            		if(i+1 === record.data.depth){
					            			childNode = data[i + 1];
					            			break;
					            		}
					            	}
					            	record.appendChild(Ext.apply(Ext.clone(childNode), {
					            		currentId : Ext.id(),
					            		text:childNode.name
					            	}));
				            	}
				            	var children = record.childNodes;
				            	var rowIndex = grid.getStore().indexOf(children[children.length-1]);
				            	treePanel.plugins[0].cancelEdit();
				            	treePanel.plugins[0].startEditByPosition({
				        			row: rowIndex,
				        			column: 0
				        		});
				            	var node = children[children.length - 1];
				            	DigiCompass.Web.app.workFlow.leafNodeViewControl(node,'wftWorkFlowSowTree');
				        		//记录当前获取焦点的树节点，以便store Update时使用
				        		DigiCompass.Web.app.workFlow.focusedNode = node;
				        		var gridData = [];
				        		if(node.raw.property){
				        			gridData = node.raw.property;
				        		}
				        		
				        		Ext.getCmp('wftWorkFLowPropertyGrid').getStore().loadData(gridData);
				        		if(!node.isLeaf()){
				        			return;
				        		}
				        		var data = node.raw;
				        		var rootNode = { 
				        				name : 'SOW',
				        				leaf : true	
				        		};
				        		if(node.raw.sowTree){
				        			rootNode = Ext.clone(node.raw.sowTree);
				        		}
				        		//将root转换成tree所需要的数据格式
				        		DigiCompass.Web.app.workFlow.changeDataToTree(rootNode);
				        		var store = Ext.getCmp('wftWorkFlowSowTree').getStore();
				        		var flag = DigiCompass.Web.app.workFlow.validateEditing(node.raw.reference);
				        		//控制actionColumn的显示与隐藏
				        		DigiCompass.Web.app.workFlow.setActionColumnEditable(flag,'wftWorkFlowSowTree');
				        		store.setRootNode(rootNode);
			                }
		            	}]
				}],
				listeners : {
					checkchange : function(node, checked, eOpts) {
						DigiCompass.Web.TreeUtil.checkchild(node, checked);
						DigiCompass.Web.TreeUtil.checkparent(node);
						if(!checked){
							node.set('quantity',0);
							node.commit();
						}
					},
					cellclick : function(grid, cellHtml, colIndex, node , rowHtml, rowIndex){
						if(node.isLeaf() && colIndex == 4){
							var dataIndex = grid.getHeaderCt().getHeaderAtIndex(colIndex).dataIndex;							
			            	//var rowIdx = grid.getStore().indexOf(children[children.length-1]);
			            	//if(rowIdx == rowIndex){
			            		DigiCompass.Web.app.wftemp.selectProject(node, dataIndex);
			            	//}
							return;
						}
		        		if(colIndex == 3){
		        			return;
		        		}
		        		if(node.isRoot()) {
							Ext.getCmp('wftWorkFLowPropertyGrid').getStore().loadData([]);
							return;
						};
						
						var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
						if(isChecked){
							return;
						}
						                    	
						DigiCompass.Web.app.wftemp.focusedNode = node;
						DigiCompass.Web.app.workFlow.focusedNode = node;        						
						DigiCompass.Web.app.workFlow.leafNodeViewControl(node.isLeaf(),'wftWorkFlowSowTree');
						DigiCompass.Web.app.workFlow.leafNodeViewControl(node.isLeaf(),'dependencyPanel');
						
						/*if(node.raw.currentId && node.raw.currentId.indexOf("ext") == -1){
	                        var message = {};
	                        message.MODULE_TYPE = 'SERVICE_TEMPLATE_MODULE';
	                        message.COMMAND = "queryCatInfo";
	                        message.id = node.raw.currentId;
	                        cometdfn.request(message, function(message, Conf) {
	                            var status = message.STATUS;
	                            if (status === "success") {
	                            	var cats = JSON.parse(message.BUSINESS_DATA);
	                            	var serviceData = cats[0];
	                            	node.raw = serviceData;
	                            	setServiceData(node);
	                            } else if (message.customException) {
	                                alertError(message.customException);
	                            }
	                        });
						} else {*/
							setServiceData(node);
						//}						
					},itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
						focusedWftItem = record;
						DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
					},
					/**
					 * mouseleave隐藏actionColumn图标
					 */
					itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
						focusedWftItem = null;
						DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
					}
				}
			});
			
		//sow tree grid
		var sowTree = Ext.create('Ext.tree.Panel', {
			id : 'wftWorkFlowSowTree',
		    title: 'Scope of Work',
		    width : '100%',
		    flex : 1,
			minHeight : 300,
			hidden : true,
		    margin : '0px 0px 0px 0px',
		    collapsible: true,
		    useArrows: true,
		    rootVisible: true,
		    plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
	        		beforeedit: function (me, e) {
	        			//var record = DigiCompass.Web.app.wftemp.getFocusedNode();
	        			//return DigiCompass.Web.app.workFlow.validateEditing(record.raw.reference);
	        		}
				}
		    })],
		    store: Ext.create('Ext.data.TreeStore',{
		    	fields: [{ name : 'name' , type: 'string' },
		    	         { name : "id", type : 'string'},
		    	         { name : 'description' , type : 'string' },
		    	         { name : 'itemNo' , type : 'string' },
		    	         { name : 'requirement' }],
		        root: {	
		        	name:'SOW',
		            iconCls:'task-folder',
		            leaf : true,
		            expanded: true
		        },
		        folderSort: true,
			    listeners:{
			    	update : function(me, record, operation, changeItem){
			    		DigiCompass.Web.app.workFlow.changeItemTree(me);
			    	},
			    	remove : function(){
			    		DigiCompass.Web.app.workFlow.changeItemTree(sowTree.getStore());
			    	}
				}
		    }),
		    //the 'columns' property is now 'headers'
		    columns: [{
		        xtype: 'treecolumn', //this is so we know which column will show the tree
		        text: 'Name',
		        flex: 3,
		        sortable: false,
		        dataIndex: 'name',
		        editor : {
					allowBlank : false ,
					maxLength  : UiProperties.nameMaxLength  ,
					listeners  : {
						focus :function(){
							var selecteds = Ext.getCmp('wftWorkflowTreePanel').getSelectionModel().getSelection();
							DigiCompass.Web.app.workFlow.cellEditingFocusNode =selecteds[0];
						}
					}
				}
		    },{
		    	text: 'Description',
		        flex: 3,
		        sortable: false,
		        dataIndex: 'description',
				editor    : {
					allowBlank : false,
					maxLength  : UiProperties.descMaxLength  ,
					listeners  : {
						focus :function(){
							var selecteds = Ext.getCmp('wftWorkflowTreePanel').getSelectionModel().getSelection();
							DigiCompass.Web.app.workFlow.cellEditingFocusNode =selecteds[0];
						}
					}
				}
		    },{
		    	text	  : 'Requirement',
		        flex	  : 3,
		        sortable  : false,
		        dataIndex : 'requirement',
		        renderer  : function(value, metaData, record){
		        	var name = '';
		        	var reqs = record.data.requirement;
		        	var arr = new Array();
		        	if(reqs){		        		
		        		for(var i = 0; i < reqs.length; i++){
		        			arr.push(reqs[i].name + ' ('+reqs[i].type+')');		        			
		        		}
		        		name = arr.join(",");
		        	}
		        	return name;
		        }
		    },{
				flex 		 : 1,
				width		 : 40,
	            menuDisabled : true,
	            xtype: 'actioncolumn',
	            align: 'center',
	            items: [{
	            	icon: './styles/cmp/images/add.png',  
		            scope: this,
		            getClass: function(value,meta,record,rowIx,colIx, store) {            
		            	return 'x-hide-display';  //Hide the action icon
		            },
		            handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
		            	if(Ext.isEmpty(record.data.name)){
		            		return;
		            	}
	                    record.set('leaf',false);
	                    record.expand();
	                    record.set('requirement',{});
	                    record.appendChild({
	                    	leaf : true,
	                    	name : 'newNode',
	                    	requirement : {
	                    		name: ''}
	                    });
	                    var children = record.childNodes;
	                    var rowIndex = grid.getStore().indexOf(children[children.length-1]);
	                    sowTree.plugins[0].cancelEdit();
	                    sowTree.plugins[0].startEditByPosition({
		        			row: rowIndex,
		        			column: 0
		        		});
	                    record.commit();
		            }
	            },{
	            	icon: './styles/cmp/images/delete.png',  
		            scope: this,
		            getClass: function(value,meta,record,rowIx,colIx, store) {            
		            	return 'x-hide-display';  //Hide the action icon
		            },
		            handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
		            	if(record.isRoot() || record.get('reference')>0){
		            		return;
		            	}
		            	var parent = record.parentNode;
		            	record.remove();
		            	if( parent && Ext.isEmpty(parent.childNodes)){
		            		parent.set('leaf', true);
		            	}
		            }
	            }]
		    }],
		    listeners : {
				cellclick : function(grid, cellElement, columnNum, record, rowElement, rowNum, e) {
					var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
					if(dataIndex != 'requirement' || !record.isLeaf() || record.get('reference')>0){
						return;
					}
					var selecteds = Ext.getCmp('wftWorkflowTreePanel').getSelectionModel().getSelection();
					DigiCompass.Web.app.workFlow.cellEditingFocusNode =selecteds[0];
					DigiCompass.Web.app.workFlow.showSowRequirementWindow(record.data.requirement, function(reqs){
						record.data.requirement = reqs;
						record.commit();
					});
				},
				itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, true , true);
				},
				itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
				}
			},
			tbar : [{
	        	xtype   : 'button',
	        	text    : 'Indent View',
	        	handler : function(){
	        		//通过data画workflowCategory d3 效果 tree
	        		var tree = Ext.getCmp('wftWorkFlowSowTree').getRootNode();
	        		var data = DigiCompass.Web.TreeUtil.getTreeData(tree);
	        		DigiCompass.Web.app.planningModelTree.showChart(data , 'serviceCatalogueSowD3Chart', 'Sow Chart');
	        	}
	        },{
				xtype : 'button',
				text : 'Export',
				handler : function(){
	        		var store = Ext.getCmp('wftWorkFlowSowTree').getStore();
	        		var rootNode = store.getRootNode();		
	        		var sowTreeData = { name : rootNode.data.name , 
	   					 description : rootNode.data.description,
	   					 requirement : rootNode.data.requirement };
	        		sowTreeData.children = DigiCompass.Web.app.workFlow.getTreeDataByNode(rootNode.childNodes);
	        		var focusNode =  DigiCompass.Web.app.workFlow.focusedNode;
					var data = {
						sowTree : JSON.stringify(sowTreeData),
						MODULE_TYPE : "SERVICE_TEMPLATE_MODULE",  
						COMMAND : "COMMAND_EXPORT_SOW",
						title : 'Service Catalogue Sow_' + focusNode.get("name")						
		        	};
		        	var str = context.param(data);
		        	//window.location.href = "download?"+str;
		        	var form = document.createElement('form');
		        	document.body.appendChild(form);
		        	createNewFormElement(form, "sowTree", JSON.stringify(sowTreeData));
		        	createNewFormElement(form, "MODULE_TYPE", "SERVICE_TEMPLATE_MODULE");
		        	createNewFormElement(form, "COMMAND", "COMMAND_EXPORT_SOW");
		        	createNewFormElement(form, "title", focusNode.get("name"));			        	
		        	form.action = "download";
		        	form.method = "POST";
		        	form.submit();
				}
			},{
				xtype : 'button',
				text : 'Import',
				handler : function(){			
				    
			    	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			    		layout: 'fit',
			    		width: 500,
	    		        height: 300,
	    		        modal: true,
	    		        closeAction: 'destroy',
	    		        items: {	
	    		        	xtype : 'form',
	    		        	frame: true,
	    		        	defaults: {
	    		        		anchor: '100%',
	    		        		allowBlank: false,
	    		        		msgTarget: 'side',
	    		               	labelWidth: 50
	    		        	},
	    		        	items: [{
	    		        		xtype: 'filefield',
	    		        		id: 'form-file',
	    		        		emptyText: 'Select an file',
	    		        		fieldLabel: 'File',
	    		        		name: 'file-path',
	    		        		buttonText: '',
	    		        		buttonConfig: {
	    		        			iconCls: 'upload-icon'
	    		        		},
	    		        		vtype: 'file'
	    		        	}],
	    		        	buttons: [{
	    		        		text: 'Upload',
	    		        		handler: function(){
	    		        			var form = this.up('form').getForm();
	    		        			if(form.isValid()){				    		                	       
	    		        				form.submit({
	    		        					url: 'upload',
	    		        					params: {				        		                        	   
	    		        						MODULE_TYPE : "SERVICE_TEMPLATE_MODULE",
	    		        						COMMAND : "WORKFLOW_SOW_IMPORT"
	    		        					},
	    		        					waitMsg: 'Uploading your file...',
	    		        					success: function(fp, o) {				        		                       		
	    		        						var rootNode = { 
        		        		        			name : 'SOW',
        		        		        			leaf : true	
        		        		        		};
	    		        						if(o.result.sowTree){
	    		        							var sowTree = Ext.decode(o.result.sowTree);
	    		        							rootNode = Ext.clone(sowTree);
	    		        							processSowCallback(rootNode);
	    		        						}
	    		        						DigiCompass.Web.app.workFlow.changeDataToTree(rootNode);
	    		        						var store = Ext.getCmp('wftWorkFlowSowTree').getStore();
	    		        						store.setRootNode(rootNode);
	    		        						DigiCompass.Web.app.workFlow.changeItemTree(store);
	    		        						win.close();
	    		        					},
	    		        					failure: function(form, action){
	    		        						msg('Failure', 'Error processed file on the server', true);
	    		        					}
	    		        				});
	    		        			}
	    		        		}
	    		        	},{
	    		        		text: 'Reset',
	    		        		handler: function() {
	    		        			this.up('form').getForm().reset();
	    		        		}
	    		        	}]
	    		        }
			    	});
			    	win.show();
				}
			}]
		});
		//Dependency tree grid
		var workflowDependencyPanel = Ext.create('Ext.tree.Panel', {
			id : 'dependencyPanel',
	        title       : 'Dependency',
	        collapsible : true,
	        autoScroll  : true,       
	        hidden : true,
	        minHeight : 250,
	        width : '100%',
	        flex :1,
	        selType     : 'cellmodel',
	        rootVisible: false,
	        store :  Ext.create('Ext.data.TreeStore', {
				fields: ['currentId','categoryId','property','name','capex','opex','quantity','sow'],
				folderSort : false
			}),
			columns: [{
	            xtype	  : 'treecolumn', //this is so we know which column will show the tree
	            text	  : 'Name',
	            flex	  : 6,
	            sortable  : false,
	            maxLength  : UiProperties.nameMaxLength ,
	            dataIndex : 'name'
	        },{
	        	 text	  : 'Capex',
	             flex	  : 3,
	             xtype: 'numbercolumn',
		         format    : '0,000.00',
	             sortable  : false,
	             dataIndex : 'capex'
	        },{
        	 	text	  : 'Opex',
	            flex	  : 3,
	            xtype	  : 'numbercolumn',
	            format    : '0,000.00',
	            sortable  : false,
	            dataIndex : 'opex'
	        },{
        	 	text	  : 'Quantity',
	            flex	  : 2,
	            sortable  : false,
	            dataIndex : 'quantity',
	            editor:{
					xtype:'numberfield',
	            	allowBlank : false,
	            	minValue : 0
	            }
	        }],
			listeners : {
				checkchange : function(node, checked, eOpts) {
					var dependencyData = Ext.getCmp("dependencyPanel").getChecked();
					var checkedIds = [];
					for(var i = 0 ; i < dependencyData.length ; i++){
						checkedIds.push(dependencyData[i].data.currentId);
					}
					DigiCompass.Web.app.wftemp.focusedNode.raw.dependencys = checkedIds;
					console.log(checkedIds);
				}
			}
		});
		//category type tree panel
		var categoryTypeTree = Ext.create('Ext.tree.Panel', {
	        title : 'Details',
	        id : 'catalogueTree',
	        width: 260,
	        region : 'center',
	        autoScroll  : true,
	        collapsible: true,
			viewConfig: {
	            plugins: {
	                ddGroup: 'workflowTemplateDragDropGroup',
	                ptype: 'gridviewdragdrop',
	                enableDrop: false
	            }
	        },
	        rootVisible: true,
	        store: Ext.create('Ext.data.TreeStore', {
		    	fields: [ 'name', 'level', 'property','typeId','currentId','capex','opex','quantity' ],
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
	            dataIndex: 'capex'
	        },{
	            text: 'Opex',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'opex'
	        },{
	            text: 'Quantity',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'quantity'
	        }]
	    });
		var parentChildTree = Ext.create('Ext.tree.Panel', {
	        title : 'Existing Service Catalogues',
	        id : 'serviceCatalogueTemplate',
	        width: 260,
	        region : 'north',
	        height : 300,
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
						MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
						COMMAND : 'COMMAND_QUERY_INFO',
						id : record.data.id
					}, function(message){
						var info = Ext.JSON.decode(message.BUSINESS_DATA);
						var wftData = Ext.clone(DigiCompass.Web.app.wftemp.data);
						var capex = 0;
						var opex = 0;
						var quantity = 0;
						var children = info.categoryData;
						for(var i = 0 ; i < children.length ;  i++){
							capex = capex + children[i]['capex'];
							opex = opex + children[i]['opex'];
							quantity = quantity + children[i]['quantity'];
						}
						Ext.getCmp('catalogueTree').setRootNode({
							name : info.name ,
							expanded : true,
							capex : capex ,
							opex : opex ,
							quantity : quantity,
							children : info.categoryData
						});
						Ext.getCmp('catalogueTree').expandAll();
						
					});
				}
	        }
	    });
		//template info panel
		var panel = Ext.create('Ext.panel.Panel', {
			id : 'financialCategoryAdd',
			defaultType : 'textfield',
			border : false,
			width : '100%',
			frame : false,
//			height : 800,
			margin : '0 5 5 0',
			flex : 1,
			layout:'border',
			defaults : {
				split : true
			},
			items:[{
				xtype : 'panel',
				region : 'west',
				collapsible: true,
				width : 350,
				//margin : '0px 5px 5px 10px',
				height : 'fill',
				layout : 'border',
				items : [parentChildTree,categoryTypeTree]
			}, treePanel,{
				width : 350,
				xtype : 'panel',
				id : 'wftStandardCost',
				region : 'east',
				collapsible : true,
				layout : 'vbox',
				items:[{
			    	id : 'wftWorkFLowPropertyGrid',
					title : 'Properties',
					width : '100%',
					collapsible: true,
					minHeight : 250,
					flex : 1,
					plugins 	: [Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit : 1
					})],
					xtype:'grid',
					selType : 'cellmodel',
					store: Ext.create('Ext.data.JsonStore', {
					    fields: ['name','value','optional'],
					    data: [],
					    listeners:{
							update:function(store){
								var focus = DigiCompass.Web.app.workFlow.cellEditingFocusNode;
								if(Ext.isEmpty(focus)){
									Notification.showNotification('Please select a record!');
									return;
								}
								//当propertyStore数据改变时，修改选中的treeNode对应的property数据
								DigiCompass.Web.app.workFlow.changeItemGrid(store,focus);
							}
						}
					}),
					columns:[{
						header : 'Name',
						dataIndex : 'name',
						flex : 1
					},{
						header : 'Value',
						dataIndex : 'value',
						flex : 1,
						editor    : {
							allowBlank : false,
							maxLength  : UiProperties.stringValueMaxLength,
							listeners  : {
								focus :function(){
									var selecteds = Ext.getCmp('wftWorkflowTreePanel').getSelectionModel().getSelection();
									DigiCompass.Web.app.workFlow.cellEditingFocusNode =selecteds[0];
								}
							}
						}
					}]
				},sowTree, workflowDependencyPanel]
			}]
		});
		Ext.getCmp('wftempDetailPanel').add(panel);
		}	
		DigiCompass.Web.app.wftemp.setDropTarget('wftWorkflowTreePanel');
	};
	
	var cleanData = function(){
		Ext.getCmp('wftempFormDetail').getForm().reset();
		var workFlowItemTree = Ext.getCmp('wftWorkflowTreePanel');
		if(workFlowItemTree){
			workFlowItemTree.setRootNode({
				name : 'Service Catelogue' ,
				expanded : true
			});
		}
		var categoryTypeTree = Ext.getCmp('categoryTypeTree');
		if(categoryTypeTree){
			categoryTypeTree.setRootNode({});
		}
		var dependencyPanel = Ext.getCmp('dependencyPanel');
		if(dependencyPanel){
			dependencyPanel.setRootNode({});
		}
		DigiCompass.Web.app.workFlow.cleanWorkFlowPropertyTreeData();
		var sowTree = Ext.getCmp('wftWorkFlowSowTree');
		if(sowTree){
			sowTree.setRootNode({
				name:'SOW',
                iconCls:'task-folder',
                leaf : true,
                expanded: true
            });
		}
		var wftWorkFLowPropertyGrid = Ext.getCmp('wftWorkFLowPropertyGrid');
		if(wftWorkFLowPropertyGrid){
			wftWorkFLowPropertyGrid.getStore().loadData([]);
		}
	}
	function processDependency(node){
		var data = {};
		traverseNode(Ext.getCmp("wftWorkflowTreePanel").getRootNode(), node, data);
		Ext.getCmp("dependencyPanel").setRootNode(data);
		//Ext.getCmp("dependencyPanel").expandAll();
	}
	function traverseNode(node, clnode, data){
		data.currentId = node.data.currentId || node.raw.currentId ;
		data.typeId = node.data.typeId || node.raw.typeId ;
		data.name = node.data.name ||  node.raw.name;
		data.capex = node.data.capex || node.raw.capex;
		data.opex = node.data.opex || node.raw.opex;
		data.quantity = node.data.quantity || node.raw.quantity;
		data.expanded = true;
		var dependencys = clnode.raw.dependencys || clnode.data.dependencys;
		if(dependencys){
			for(var i = 0; i < dependencys.length; i++){
				if(dependencys[i] == data.currentId){
					data.checked = true;
				}
			}
		}						
		if(node.hasChildNodes()){
			data.children = [];
			var childNodes = node.childNodes;
			var nocheckel = true;
			for(var i = 0; i < childNodes.length; i++){
				var child = {};				
				traverseNode(childNodes[i], clnode, child/*, beDepArr*/);
				data.children.push(child);
			}
		}else{
			if(!data.checked){
				data.checked = false;
			}
			data.leaf = true;
			data.expanded  = false;
		}
				
		if(node == clnode || nocheckel){
			delete data.checked;
		}
	}
	
	function setServiceData(node){
    	Ext.getCmp('wftWorkFLowPropertyGrid').getStore().loadData(node.raw.property);
		var sowTree = Ext.getCmp('wftWorkFlowSowTree');
		if(sowTree){
			if(node.raw.sowTree){
				if(!Ext.isArray(node.raw.sowTree)){
					node.raw.sowTree = [node.raw.sowTree];
				}
				var data = Ext.clone(node.raw.sowTree);
				var rootNode = data[0];
				DigiCompass.Web.app.msa.changeRootArrToTree(rootNode);
				sowTree.setRootNode(rootNode);
			}else{
				sowTree.setRootNode({	
					name:'SOW',
	                iconCls:'task-folder',
	                leaf : true,
	                expanded: true
				});
			}
		}
		processDependency(node);
	}
	
	DigiCompass.Web.app.resourceType.getResourceGrid = function(data) {
		
		var store = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name', 'contact' ],
			data : data
		});
		var sm = Ext.create('Ext.selection.CheckboxModel');
		var resourceGridPanel = Ext.create('Ext.grid.Panel', {
			selModel : sm,
			store : store,
			columns : [{
				text : 'Resource Name',
				dataIndex : 'name'
			},{
				text : 'Contact',
				dataIndex : 'contact',
			}],
			height : 200,
			width : '100%',
			tbar : [{
				xtype : 'button',
				text : 'Finish',
				handler : function() {
					var records = sm.getSelection();
					Ext.getCmp("GroupResourceGridPanel").getStore().loadData(records);
					this.up("window").close();
				}
			}]
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

	

	DigiCompass.Web.app.wftemp.deleteWorkflowTemplate = function(wftempIDs) {
		var message = {};
		message.wftempIDs = wftempIDs;
		message.MODULE_TYPE = 'SERVICE_TEMPLATE_MODULE';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.request(message,DigiCompass.Web.app.wftemp.deleteWorkflowTemplateCallback);
	}

	DigiCompass.Web.app.wftemp.deleteWorkflowTemplateCallback = function(data,
			Conf, fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			Ext.getCmp('obj-details').removeAll();
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.workFlowTemplate(queryParam);
			alertSuccess('Delete Data Successful!');
		} else if (data.customException) {
			alertError(data.customException);
		}
	};

	DigiCompass.Web.app.wftemp.showDetailPanel = function(data) {
		var objExpPanel = Ext.getCmp('obj-details');
		var id = data ? data.id : null;
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		
		var wftempDetailPanel = Ext.create('Ext.panel.Panel', {
			id : 'wftempDetailPanel',
			layout : 'vbox',
			autoScroll : true
		});
		var ptitle = "Object Detail - Service Catalogues"+(data && data.name ? " ("+data.name+")" : '');
		var ReversalPanel = new DigiCompass.Web.app.ReversalPanel({
			panelTitle : ptitle,
			height : '100%',
			margin : '0 15 0 0',
			front : wftempDetailPanel,
			back : new DigiCompass.Web.app.VersionForm({
				qrCode : id
			})
		});
		objExpPanel.add(ReversalPanel);
		var formPanel = DigiCompass.Web.app.wftemp.initForm(id);
		Ext.getCmp('wftempDetailPanel').add(formPanel);
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

	function getCategoryData(cmpId) {
		
		var categoryStore = Ext.getCmp(cmpId).getStore();
		var rootNode = categoryStore.getRootNode();
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
			if (node.get("checked")) {
				result.push({
					categoryId : node.data.categoryId,
					quantity : node.data.quantity,
					dependencys : node.data.dependencys
				});
			}
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
	function changeParentNodeValue(node , dataIndex){
		var parentNode = node.parentNode;
		if(parentNode){
			var _childNodes = parentNode.childNodes;
			if(dataIndex == 'quantity'){
				var capex = 0;
				var opex = 0;
				var quantity = 0;
				for(var i = 0 ; i < _childNodes.length ; i++){
					if(_childNodes[i].isLeaf()){
						quantity = quantity + _childNodes[i].data.quantity;
						capex = capex + _childNodes[i].data.capex * _childNodes[i].data.quantity;
						opex = opex + _childNodes[i].data.opex * _childNodes[i].data.quantity;
					}else{
						capex = capex + _childNodes[i].data.capex;
						opex = opex + _childNodes[i].data.opex;
						quantity = quantity + _childNodes[i].data.quantity * 1;
					}
				}
				parentNode.data.capex = capex;
				parentNode.data.opex = opex;
				parentNode.data.quantity = quantity;
				
			}else{
				var data = 0;
				for(var i = 0 ; i < _childNodes.length ; i++){
					if(_childNodes[i].isLeaf()){
						var quantity = _childNodes[i].data['quantity'] || 1;
  				        data = data + _childNodes[i].data[dataIndex] * quantity;
  				    }else{
      					data = data + _childNodes[i].data[dataIndex];
  					}
				}
				parentNode.data[dataIndex] = data;
			}
			parentNode.commit();
			if(parentNode.parentNode){
				changeParentNodeValue(parentNode , dataIndex)
			}
		}
	}
	function lookIntoChildren(children){
		var data = { 
				capex : 0 ,
				opex : 0 ,
				quantity : 0 };
		for(var i = 0 ; i<children.length ; i++){
			if(children[i].children){
				var _data =	lookIntoChildren(children[i].children);
				children[i].capex = _data.capex ;
				data.capex = data.capex + _data.capex;
				children[i].opex = _data.opex; 
				data.opex = data.opex + _data.opex;
				children[i].quantity = _data.quantity;
				data.quantity = data.quantity + _data.quantity;
			}
			else{
				var capex = children[i].capex;
				var quantity = children[i].quantity;
				var opex = children[i].opex;
				if(Ext.isEmpty(capex)){
					capex = 0;
				}
				if(Ext.isEmpty(quantity)){
					quantity = 0;
				}
				if(Ext.isEmpty(opex)){
					opex = 0;
				}
				data.capex = data.capex + capex * quantity;
				data.opex = data.opex +  opex * quantity;
				data.quantity = data.quantity + quantity;
			}
		}
		return data;
	}
	function countQtyCapexOpex(datas){
		if(datas.children){
			var data = lookIntoChildren(datas.children);
			datas.capex = data.capex;
			datas.opex = data.opex;
			datas.quantity = data.quantity;
		}
	}
	DigiCompass.Web.app.wftemp.showNotification = function(data){
		var info = Ext.JSON.decode(data.BUSINESS_DATA);
		if(Ext.getCmp('approvalTemplate')){
			Ext.getCmp('approvalTemplate').close();
		}
		var store = Ext.create('Ext.data.TreeStore', {
			 fields: [{name : 'name',     type: 'string'},
			          {name : 'description' , type : 'string'},
			          {name : 'capex' , type : 'string'},
			          {name : 'opex' , type : 'string'},
			          {name : 'quantity',type : 'string'}],
			 root : {
				 text : 'Service Catelogue' ,
				 expanded : true,
				 children : info.categoryData
			 },
		     folderSort: true
		});
		var tree = Ext.create('Ext.tree.Panel',{
			 id : 'notificCategoryTree',
		 	 title: 'ServiceCatalogueTemplate Tree',
	         frame: true,
	         height : 340,
	         store: store,
	         columns: [{
	        	 xtype: 'treecolumn', //this is so we know which column will show the tree
	             text: 'Name',
	             flex: 2,
	             sortable: true,
	             dataIndex: 'name'
	         },{
	             text: 'Description',
	             flex: 2,
	             sortable: true,
	             dataIndex: 'description'
	         },{
	             text: 'Capex',
	             flex: 1,
	             sortable: true,
	             dataIndex: 'capex'
	         },{
	             text: 'Opex',
	             flex: 1,
	             sortable: true,
	             dataIndex: 'opex'
	         },{
	             text: 'Quantity',
	             flex: 1,
	             sortable: true,
	             dataIndex: 'quantity'
	         }],
	         rootVisible: false
		 });
		var win  = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			title: 'ServiceCatalogueTemplate Approval',
		    id : 'approvalTemplate',
		    height: 500,
		    width: 600,
		    modal : true,
		    layout : 'anchor',
			defaultType : 'textfield',
		    items : [{
				fieldLabel : 'Name',
				name : 'name',
				value : info.name
		    },{
				fieldLabel : 'Description',
				name : 'description',
				value : info.description ? info.description : ''
		    },{
				fieldLabel : 'preApprove',
				name : 'preapprove',
				value : info.preapprove
				
		    },Ext.create('DigiCompass.web.UI.ComboBox',{
				name : 'categoryTypeId',
				fieldLabel : 'ServiceCatalogue',
				moduleType : 'MOD_WORK_FLOW',
				labelWidth : '30%',
				moduleCommand : 'COMMAND_QUERY_COMBOX_LIST',
				fieldLabel   : 'Service Category Settings',
				editable     : false,
				value 		 : info.categoryTypeId,
				readOnly 	 : true,
				parseData : function(message){
					var data = Ext.JSON.decode(message['BUSINESS_DATA']['comboList']);
					var d = [];
					for(var i in data){
						d.push([data[i].id, data[i].name]);
					}
					return d;
				}
			}),tree],
			tbar : [{
		    	xtype : 'button',
		    	text  : 'Deny',
		    	handler : function(){
		    		var message = {
		    				id : info.id,
		    				approve : false,
		    				MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
							COMMAND : 'COMETD_COMMAND_COMPLETE_APPROVE',
		    		}
		    		cometdfn.request(message, function(message){
		    			if(message.STATUS == "success"){
							Notification.showNotification('Deny Success!');
							if(Ext.getCmp('approvalTemplate')){
								Ext.getCmp('approvalTemplate').close();
							}
		    			}
		    			else{
		    				Notification.showNotification('Deny Fail!');
		    			}
					});
		    	}
		    },{
		    	xtype : 'button',
		    	text  : 'Approve',
		    	handler : function(){
		    		var message = {
		    				id : info.id,
		    				MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
							COMMAND : 'COMETD_COMMAND_COMPLETE_APPROVE',
		    				approve : true,
		    		}
		    		cometdfn.request(message, function(message){
						if(message.STATUS == "success"){
							Notification.showNotification('Approve Success!');
							if(Ext.getCmp('approvalTemplate')){
								Ext.getCmp('approvalTemplate').close();
							}
						}else{
							Notification.showNotification('Approve Fail!');
						}
					});
		    	}
		    }]
		}).show();
		Ext.getCmp('notificCategoryTree').expandAll();
	}
	function getLevel(node,level){
		if(node.parentNode){
			level = level + 1;
			level = getLevel(node.parentNode,level);
		}
		return level;
	}
	function checkValidate(data , record){
		if(!record.raw.level){
			record.raw.level = getLevel(record,0);
		}
		if(record.isRoot() && data.records[0].raw.level == 1){
			return true;
		}else{
			return data.records[0].raw.level == Number(record.raw.level) + 1;
		}
	}
	function checkTreeValidate(data){
		var categoryTypeId = data.records[0].raw["hierarchy.id"];
		if(categoryTypeId){
			var category = Ext.getCmp('categoryTypeGroupWftp');
			if(category && categoryTypeId == category.getValue()){
				return true;
			}
		}
	}
	function reCountCapexOpexQuantity(node){
		var childNodes = node.childNodes;
		var capex = 0;
		var opex = 0;
		var quantity = 0;
		for(var i = 0 ; i<childNodes.length ; i++){
			capex = capex + childNodes[i].raw.capex ; 
			opex = opex + childNodes[i].raw.opex ; 
			quantity = quantity + childNodes[i].raw.quantity;
		}
		node.set('capex',capex);
		node.set('opex',opex);
		node.set('quantity',quantity);
		/*if(node.parentNode){
			reCountCapexOpexQuantity(node.parentNode);
		}*/
	}
	//控制CategoryType和Category拖拽
	DigiCompass.Web.app.wftemp.setDropTarget = function(id){
		var panel = Ext.getCmp(id);
		var el = panel.body.dom;
		var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', el , {
	        ddGroup: 'workflowTemplateDragDropGroup',
	        notifyEnter: function(ddSource, e, data,a,b,c,d) {
				var flag = false;
				if(focusedWftItem){
					flag = checkValidate(data , focusedWftItem);
				}
				if(!flag){
					flag = checkTreeValidate(data);
				}
				return flag ? this.dropAllowed : this.dropNotAllowed ;
	        },
			notifyOver: function(ddSource, e, data) {
				var flag = false;
				if(focusedWftItem){
					flag = checkValidate(data , focusedWftItem);
				}
				if(!flag){
					flag = checkTreeValidate(data);
				}
				return flag ? this.dropAllowed : this.dropNotAllowed ;
			},
			
	        notifyDrop  : function(ddSource, e, data){
	        	if(checkTreeValidate(data)){
	        		cometdfn.request({
	    				MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
	    				COMMAND : 'COMMAND_QUERY_INFO',
	    				id : data.records[0].raw.id
	    			}, function(message){
	    				var info = Ext.JSON.decode(message.BUSINESS_DATA);
	    				var root = Ext.getCmp('wftWorkflowTreePanel').getRootNode();
	    				var capex = root.raw.capex || 0;
	    				var opex = root.raw.opex || 0;
	    				var quantity = root.raw.quantity || 0;
	    				var children = info.categoryData;
	    				for(var i = 0 ; i < children.length ;  i++){
	    					capex = capex + children[i]['capex'];
	    					opex = opex + children[i]['opex'];
	    					quantity = quantity + children[i]['quantity'];
	    				}
	    				
	    				root.set('capex', capex);
	    				root.set('opex',opex);
	    				root.set('quantity',quantity);
	    				root.appendChild(info.categoryData);
	    				Ext.getCmp('wftWorkflowTreePanel').expandAll();
	    			});
	        		return true;
	        	}
				if(!focusedWftItem){
					return false;
				}else{
					if(!checkValidate(data , focusedWftItem)){
						return false;
					}
				}
				var children = DigiCompass.Web.TreeUtil.getChildrenByNode(ddSource.dragData.records[0]);
				var sourceData =  Ext.apply(
						Ext.clone(ddSource.dragData.records[0].raw),
						{text: ddSource.dragData.records[0].raw.name,
							expanded : true,
							children : children});
				var subTreeData = Ext.clone(sourceData);
				setParent(subTreeData);
	        	focusedWftItem.appendChild(subTreeData);
	        	reCountCapexOpexQuantity(focusedWftItem);
	            return true;
	        }
	    });
	}
	
	function setParent(subTreeData){
		if(subTreeData.children && subTreeData.children.length > 0){
			subTreeData.currentId = null;
			for(var i = 0; i < subTreeData.children.length; i++){
				setParent(subTreeData.children[i]);
			}
		} else {
			subTreeData.parentId = subTreeData.currentId;
			subTreeData.currentId = null;
		}
	}
	
	function findChildById(child, id){
		if(child.id === id){
			return true;
		}
		if(child.children){
			var children = child.children;
			for(var i = 0 ; i <children.length ; i++){
				if(findChildById(children[i],id)){
					return true;
				}
			}
		}
	}
	/**
	 * zengtao changeRequst use
	 */
	DigiCompass.Web.app.wftemp.showServiceTree = function( id, callBackFn ){
		if(!id || !callBackFn){
			return;
		}
		var categoryTypeTree = Ext.create('Ext.tree.Panel', {
	        title : 'Service Catalogue Hierarchy',
	        id : 'serviceCatalogueTree',
	        width: 260,
	        region : 'center',
	        autoScroll  : true,
	        rootVisible: false,
	        store: Ext.create('Ext.data.TreeStore', {
		    	fields: ['id', 'name', 'level', 'property','typeId','currentId','capex','opex','quantity' ],
		        root: { },
		        folderSort: true
		    }),
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 2,
	            sortable: false,
	            dataIndex: 'name'
	        }/*,{
	            text: 'Capex',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'capex'
	        },{
	            text: 'Opex',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'opex'
	        },{
	            text: 'Quantity',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'quantity'
	        }*/],
	        listeners : {
	        	checkchange : function(node, checked, opts){
	        		if(checked){
	        			categoryTypeTree.getRootNode().cascadeBy(function(n){
	        				if(!n.isRoot() && n.get('checked') && n.data.currentId != node.data.currentId ){
	        					n.set('checked',false);
	        				}
	        			})
	        		}
	        	}
	        }
	    });
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
		    title: 'ServiceCatalogueTemplate Select',
		    id : 'chooseTemplate',
		    modal : true,
		    height: 500,
		    width: 700,
		    layout: 'fit',
		    items: [categoryTypeTree],
		    tbar : [{
		    	xtype : 'button',
		    	text  : 'Finish Select',
		    	iconCls : 'icon-save',
		    	handler : function(){
		    		if(win){
		    			var id = categoryTypeTree.getChecked()[0].get('id');
		    			var name = categoryTypeTree.getChecked()[0].get('name');
		    			callBackFn({ 
		    				id : id,
		    				name : name
		    			});
		    			win.close();
	    			}else{
	    				Notification.showNotification('No ServiceCatalogue is Selected!');
	    			}
		    	}
		    }]
		}).show();
		cometdfn.request({
			MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
			COMMAND : 'COMMAND_WORKFLOW_CATEGORY',
			id : id
		}, function(message){
			var root = Ext.getCmp('serviceCatalogueTree').getRootNode();
			var children = message.BUSINESS_DATA.categoryData;
			children = DigiCompass.Web.app.wftemp.getWorkflowTempTree(children);
			var child;
			for(var i = 0 ; i<children.length ; i++){
				if(findChildById(children[i], id)){
					child = children[i];
				}
			}
			root.appendChild(child);
			root.cascadeBy(function(node){
				node.set('checked',false);
			});
			Ext.getCmp('serviceCatalogueTree').expandAll();
		});
	}
	/**
	 * private function used by DigiCompass.Web.app.wftemp.configWorkflowTemplateTree
	 */
	function setData(wftTree,treeData){
		wftTree.getRootNode().removeAll();
		if(treeData.length > 0){
			wftTree.getRootNode().appendChild(treeData);
		}
		var ct = Ext.getCmp('catalogueTree');
		if(ct){
			ct.setRootNode({});
		}
	}
	/**
	 * load workflowTree(FinancialCatalogue And ServiceCatalogue workflowTreeData) data
	 */
	DigiCompass.Web.app.wftemp.configWorkflowTemplateTree = function(message){
		var _data = Ext.JSON.decode(message.BUSINESS_DATA.list);
		var treeData = DigiCompass.Web.app.wftemp.getWorkflowTempTree(_data);
		var wftTree = Ext.getCmp('wftTree');
		if(wftTree){
			 setData(wftTree,treeData)
		}
		wftTree = Ext.getCmp('serviceCatalogueTemplate');
		if(wftTree){
			if(wftTree.selectedTpl){
				checkStpl(treeData, wftTree.selectedTpl);
			}
			 setData(wftTree,treeData)
		}
		wftTree =  Ext.getCmp('financialWftTree');
		if(wftTree){
			 setData(wftTree,treeData)
		}
	}
	
	function checkStpl(treeData, selectedTpl){
		for(var i = 0; i< treeData.length; i++){
			for(var j = 0; j < selectedTpl.length; j++){
				if(treeData[i].id == selectedTpl[j]){
					treeData[i].checked = true;
					break;
				}
			}
			if(treeData[i].children){				
				checkStpl(treeData[i].children, selectedTpl);				
			}
		}				
	}
	
	DigiCompass.Web.app.wftemp.selectProject = function(record, index){
		var win = Ext.getCmp("projectSectionWindow");
		if (!win) {
			var store = Ext.create('Ext.data.TreeStore', {				
				root : {}
			});

			var panel = Ext.create('Ext.tree.Panel', {
				id : 'projectSectionPanel',																
				rootVisible : false,
				store : store,
		        listeners : {
		        	checkchange : function(node, checked){
		        		if(checked){
		        			panel.getRootNode().cascadeBy(function(n){
		        				if(n.data.checked && n.raw.categoryId != node.raw.categoryId){
		        					n.set('checked',false);
		        				}
		        			})
		        		}
		        	}
		        }
			});
			
			win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
				id : "projectSectionWindow",
				title : "Financial Catalogue",
				height : 600,
				width : 800,
				autoScroll : true,
				items : [ panel ],
			    tbar : [{
			    	xtype : 'button',
			    	text : 'Finish',
			    	iconCls : 'icon-save',
			    	handler : function(){
		    			var checked = panel.getChecked();
		    			if(checked.length > 0){
		    				record.set(index,{
		    					id : checked[0].raw.categoryId,
		    					name : checked[0].data.text
		    				});
		    			}
			    		this.up("window").close();
			    	}
			    }]
			});
			win.show();
		}
		var fchId = Ext.getCmp("fchId").getValue();
		var selectedId;
		var projectData = record.get(index);
		if(projectData){
			selectedId = projectData.id;
		}
		var message = {
				MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
				COMMAND : 'COMMAND_QUERY_TREE',
				fchId : fchId,
				selectedId : selectedId};
		cometdfn.request(message, DigiCompass.Web.app.wftemp.loadFcData);
	}
	
	DigiCompass.Web.app.wftemp.loadFcData = function(data, Conf, fnName, command){
		var _data = data.BUSINESS_DATA.data;
		var datas = Ext.JSON.decode(_data);
		Ext.getCmp("projectSectionPanel").setRootNode(datas);
	}
	
		function createNewFormElement(inputForm, elementName, elementValue)
	  {
	    var newElement = document.createElement("input");
	    newElement.setAttribute("name",elementName);
	    newElement.setAttribute("type","hidden");
	    newElement.setAttribute("value",elementValue);
	    inputForm.appendChild(newElement);
	    return newElement;
	  }
		
		function processSowCallback(sowTree){
			if(sowTree){
				sowTree.requirement = sowTree.requirements;
				if(sowTree.children){
					for(var i = 0; i < sowTree.children.length; i++){
						processSowCallback(sowTree.children[i]);
					}
				}
			}
		}
})();