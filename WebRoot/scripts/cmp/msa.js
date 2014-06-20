(function() {
	Ext.namespace('DigiCompass.Web.app.msa');
	DigiCompass.Web.app.msa.getFocusedNode = function(){
		return DigiCompass.Web.app.msa.focusedNode;
	}
	DigiCompass.Web.app.msa.setParentValue = function(parentNode, value, key){
		if(parentNode){
			parentNode.raw[key] = parentNode.raw[key] + value;
			if(parentNode.parentNode){
				DigiCompass.Web.app.msa.setParentValue(parentNode.parentNode, value, key);
			}
		}
	}
	DigiCompass.Web.app.msa.changeRootArrToTree = function(rootNode){
		var children = rootNode.children;
		if(!Ext.isArray(children)){
			rootNode.leaf = true;
		}
		else{
			rootNode.expanded = true;
			for(var key in children){
				DigiCompass.Web.app.msa.changeRootArrToTree(children[key]);
			}
		}
	}
	DigiCompass.Web.app.msa.getForm = function(data, resourceData) {

		var resourceStore = Ext.create('Ext.data.Store', {
			fields : [ 'id', 'name' ],
			data : resourceData
		});

		var detail = Ext
				.create(
						'Ext.form.Panel',
						{
							id : "msaFormDetail",							
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
								border : false,
								items : [
										{
											id : 'masIdEl',
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
										Ext.create('Ext.form.ComboBox', {
											name : 'resource',
											store : resourceStore,
											allowBlank : false,
											fieldLabel : 'Resource',
											displayField : 'name',
											valueField : 'id'
										}),
										Ext.create('DigiCompass.web.UI.ComboBox',{
											id : "categoryTypeId",
											name : 'categoryTypeId',											
											fieldLabel : 'ServiceCatalogue',
											moduleType : 'MOD_WORK_FLOW',											
											moduleCommand : 'COMMAND_QUERY_COMBOX_LIST',
											fieldLabel   : 'Service Catelogue Hierarchy',
											allowBlank   : false,
											editable     : false,											
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
													DigiCompass.Web.app.msa.getWorkFlowTemplateTree();
													cometdfn.publish({
														MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
														COMMAND : 'COMMAND_QUERY_LIST',
														dataType : 'TreeData',
														categoryTypeId : newValue
													});													
												}
											}
										})
										/*Ext
												.create(
														'Ext.form.ComboBox',
														{
															id:'workflowCategory',
															name : 'workflowCategory',
															store : workflowCategoryStore,
															allowBlank : false,
															fieldLabel : 'Service Category',
															displayField : 'name',
															valueField : 'id',
															listeners : {
																change : function(
																		field,
																		newValue,
																		oldValue,
																		eOpts) {
																	var message = {};
																	var checkedIds = [];
																	if (data
																			&& data.msaItems) {
																		for ( var i in data.msaItems) {
																			checkedIds
																					.push(data.msaItems[i].serviceCatalogue.id);
																		}
																	}
																	message.checkedIds = checkedIds;
																	message.workflowCategoryId = newValue;
//																	message.MODULE_TYPE = 'WORKFLOW_TEMPLATE_MODULE';
//																	message.COMMAND = 'COMMAND_OBJECT_TREE';
																	message.MODULE_TYPE = 'RESOURCE_MASTER_SERVICE_AGREEMENT';
																	message.COMMAND = 'COMMAND_QUERY_TREE';
																	cometdfn
																			.request(
																					message,
																					DigiCompass.Web.app.msa.getWorkFlowTemplateTree);
																}
															}
														})*/ ]
							} ],
							tbar : [ {
								xtype : 'button',
								text : 'Save',
								iconCls:'icon-save',
								handler : function() {
									var form = this.up("form").getForm();
									if (form.isValid()) {
										var message = form.getValues();

										//var categoryData = getCategoryData("workflowTreePanel");
										var serviceDatas = Ext.getCmp("workflowTreePanel").getService();
										var selectedTpl = Ext.getCmp("serviceCatalogueTemplate").selectedTpl;
										var categoryData = new Array();
										for(var prop in serviceDatas){
											categoryData.push(serviceDatas[prop]);
										}
										message.categoryData = categoryData;
										message.selectedTpl = selectedTpl;
										message.MODULE_TYPE = 'RESOURCE_MASTER_SERVICE_AGREEMENT';
										message.COMMAND = 'COMMAND_SAVE';
										cometdfn.publish(message);
									}
								}
							} ]
						});
		/*if (data) {
			var formData = Ext.clone(data);
			formData.resource = formData.provider.id;
			var categoryTypeId = formData.hierarchy.id;
			var categoryTypeIdComp = Ext.getCmp('categoryTypeId');
			if(categoryTypeIdComp){
				categoryTypeIdComp.suspendEvents();
				categoryTypeIdComp.setValue(categoryTypeId);
				categoryTypeIdComp.resumeEvents();
				categoryTypeIdComp.setReadOnly(true);
				DigiCompass.Web.app.msa.getWorkFlowTemplateTree();				
			}			
			detail.getForm().setValues(formData);
		}*/
		return detail;
	};
	
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
	DigiCompass.Web.app.msa.selectedServiceTpl;
	DigiCompass.Web.app.msa.getWorkFlowTemplateTree = function(serviceDatas) {		
		serviceDatas = serviceDatas || {};
		if(Ext.getCmp('workflowTreePanel')){
			Ext.getCmp('workflowTreePanel').setRootNode({});
		}else{
			
			var parentChildTree = Ext.create('Ext.tree.Panel', {
		        title : 'Existing Service Catalogues',
		        id : 'serviceCatalogueTemplate',		        		        		        
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
						
						var message = {};
						message.msaId = Ext.getCmp("masIdEl").getValue();
						message.categoryTempId = record.data.id;
						DigiCompass.Web.app.msa.selectedServiceTpl = record.data.id;
						message.MODULE_TYPE = 'RESOURCE_MASTER_SERVICE_AGREEMENT';
						message.COMMAND = 'COMMAND_WORKFLOW_CATEGORY';
						cometdfn
								.request(
										message,
										function(data){
											var _data = data.BUSINESS_DATA.data;
											var datas = Ext.JSON.decode(_data);											
											countQtyCapexOpex(datas);
											checkService(datas.children);
											if(Ext.getCmp('workflowTreePanel')){												
												Ext.suspendLayouts();
												Ext.getCmp('workflowTreePanel').setRootNode(datas);
												Ext.resumeLayouts(true);												
											}
										});
					}
		        }
		    });
			parentChildTree.selectedTpl = [];
			
			var checkService = function(nodes){
				for(var j=0; j<nodes.length; j++){
					var node = nodes[j];
					if(serviceDatas[node.categoryId]){
						data = serviceDatas[node.categoryId];
						node.checked = true;
						if(data.quantity){
							node.saquantity = data.quantity;
						}
						if(data.capex){
							node.sacapex = data.capex;
						}
						if(data.opex){
							node.saopex = data.opex;
						}
						if(data.trigger){
							node.trigger = data.trigger;
						}
					}
					if(node.children && node.children.length>0){
						checkService(node.children);
					}
				}
			}
			
			var checkServiceTpl = function(){
				var checkedNodes = new Array();
				var rootNode = Ext.getCmp("workflowTreePanel").getRootNode();
				getCheckedNodes(rootNode, checkedNodes);
				if(checkedNodes.length > 0){
					if(parentChildTree.selectedTpl.indexOf(DigiCompass.Web.app.msa.selectedServiceTpl) == -1){
						parentChildTree.selectedTpl.push(DigiCompass.Web.app.msa.selectedServiceTpl);			
						checkServiceTplInter(DigiCompass.Web.app.msa.selectedServiceTpl, true);
					}					
				}else {
					if(parentChildTree.selectedTpl.indexOf(DigiCompass.Web.app.msa.selectedServiceTpl) != -1){
						parentChildTree.selectedTpl.splice(parentChildTree.selectedTpl.indexOf(DigiCompass.Web.app.msa.selectedServiceTpl), 1);
						checkServiceTplInter(DigiCompass.Web.app.msa.selectedServiceTpl, false);
					}
				}				
			}
			
			function checkServiceTplInter(tplId, checked){
				var rootNode = Ext.getCmp("serviceCatalogueTemplate").getRootNode();
				checkTplNode(rootNode, tplId, checked);				
			}
			
			function checkTplNode(node, tplId, checked){
				if(node.get("id") == tplId){
					node.set("checked", checked);
				}
				if(node.childNodes){
					for(var i = 0; i < node.childNodes.length; i++){
						checkTplNode(node.childNodes[i], tplId, checked);
					}
				}
			}
			
			function getCheckedNodes(node, checkedNodes){
				if(node.isLeaf()){
					if(node.get("checked") == true){
						checkedNodes.push(node);
					} 
				} else {					
					for(var i = 0; i < node.childNodes.length; i++){
						getCheckedNodes(node.childNodes[i], checkedNodes);
					}
				}
			}
			
			var selectionService = function(node, checked){
				if(node.isLeaf()){
					var id = node.get('categoryId');
					if(!checked){
						delete serviceDatas[id];
					}else{
						serviceDatas[id] = {
							id : node.raw.categoryId,
							msiId : node.raw.msiId,
							categoryId : node.raw.categoryId,
							trigger : node.raw.trigger,
							text : node.get("text"),
							capex : node.data.sacapex,
							opex : node.data.saopex,
							quantity : node.data.saquantity						
						}
					}
				}else{
					node.eachChild(function(child) {
						selectionService(child,checked);
					});
				}
			}
			
			var store = Ext.create('Ext.data.TreeStore', {
				fields : ['text', 'capex', 'opex', 'quantity', 'sacapex', 'saopex', 'saquantity', 'categoryId', 'property','sow','trigger'],
				root : {}
			});
			var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit: function (me, e) {
	        			return e.record.isLeaf();
	        		},
	        		afteredit : function(me, obj){
						if(serviceDatas[obj.record.get('categoryId')]){
							if(obj.field == "saopex"){
								serviceDatas[obj.record.get('categoryId')]["opex"] = obj.value+'';
							} else if(obj.field == "sacapex"){
								serviceDatas[obj.record.get('categoryId')]["capex"] = obj.value+'';
							} else if(obj.field == "saquantity"){
								serviceDatas[obj.record.get('categoryId')]["quantity"] = obj.value+'';
							}
						}
					}
				}
			});
			var treePanel = Ext.create('Ext.tree.Panel', {
				id : 'workflowTreePanel',
				title : 'Item',				
				collapsible : true,
				autoScroll  : true,
				rootVisible : false,
				flex : 1,
				store : store,
				plugins : [ cellEditing ],
				columns : [ {
					text : 'Service',
					xtype : 'treecolumn',
					dataIndex : 'text',
					minWidth : 200
				},{
					text : 'Capex',
					dataIndex : 'capex'					
				},{
					text : 'Opex',
					dataIndex : 'opex'					
				},{
					text : 'Quantity',
					dataIndex : 'quantity'
				},{
					text : 'SA Capex',
					dataIndex : 'sacapex',
					editor : {
						 xtype:'numberfield',
						 minValue : 0,
		            	 maxLength  : UiProperties.nameMaxLength 
		             }
				},{
					text : 'SA Opex',
					dataIndex : 'saopex',
					editor : {
						 xtype:'numberfield',
						 minValue : 0,
		            	 maxLength  : UiProperties.nameMaxLength 
		             }
				},{
					text : 'SA Quantity',
					dataIndex : 'saquantity',
					editor : {
						xtype:'numberfield',		            	
		            	minValue : 1
		            }
				}],
				listeners : {
					checkchange : function(node, checked, eOpts) {
						DigiCompass.Web.TreeUtil.checkchild(node, checked);
						DigiCompass.Web.TreeUtil.checkparent(node);
						selectionService(node, checked);
						checkServiceTpl();
					},
					itemclick : function(grid, node, rowHtml, rowIndex){
						/**
						 * 编写代码，展示property，sow，以及cost
						 */
						DigiCompass.Web.app.msa.focusedNode = node;
						var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
						if(isChecked){
							return;
						}
						DigiCompass.Web.app.workFlow.leafNodeViewControl(node.isLeaf(),'msaWorkFlowSowTree');
						DigiCompass.Web.app.workFlow.leafNodeViewControl(node.isLeaf(),'triggerPanel');
						if(node.raw.categoryId){
	                        var message = {};
	                        message.MODULE_TYPE = 'RESOURCE_MASTER_SERVICE_AGREEMENT';
	                        message.COMMAND = "queryCatInfo";
	                        message.id = node.raw.categoryId;
	                        message.msiId = node.raw.msiId;
	                        cometdfn.request(message, function(message, Conf) {
	                            var status = message.STATUS;
	                            if (status === "success") {
	                            	var serviceData = JSON.parse(message.BUSINESS_DATA);	                            	
	                            	node.raw = serviceData;
	                            	setServiceData(node);
	                            } else if (message.customException) {
	                                alertError(message.customException);
	                            }
	                        });
						} else {
							setServiceData(node);
						}
					}
				}
			});
			treePanel.getService = function(){
				return serviceDatas;
			}
			
			
			var sowStore = Ext.create('Ext.data.TreeStore', {
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
		var sowTree = Ext.create('Ext.tree.Panel', {
			id : 'msaWorkFlowSowTree',
		    title: 'Workflow SOW',
		    width : 'fill',
			height : 300,			
		    margin : '0px 0px 0px 0px',
		    collapsible: true,
		    autoScroll : true,
		    useArrows: true,
		    rootVisible: true,
		    store: sowStore,
		    //the 'columns' property is now 'headers'
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
			tbar : [{
	        	xtype   : 'button',
	        	text    : 'Indent View',
	        	handler : function(){
	        		//通过data画workflowCategory d3 效果 tree
	        		var tree = Ext.getCmp('msaWorkFlowSowTree').getRootNode();
	        		var data = DigiCompass.Web.TreeUtil.getTreeData(tree);
	        		DigiCompass.Web.app.planningModelTree.showChart(data , 'msaSowD3Chart', 'Sow Chart');
	        	}
	        }]
		});
		
		var triggerStore = new Ext.data.JsonStore({ 
		    fields: ['type','payRatio','delay','serviceCatalogues', 'serviceNames'],
			listeners:{
				update : function(store){
					var last = store.getAt(store.getCount()-1).data;
					var flag = false;
					for(var i in last){
						if(!Ext.isEmpty(last[i])){
							flag = true;
							break;
						}
					}
					var triggerEmptyData = [{type : null, payRatio : null, delay : null, serviceCatalogues : null, serviceNames : null}];
					if(flag){
						store.insert(store.getCount(), triggerEmptyData);
					}
					var focused = DigiCompass.Web.app.msa.focusedNode;
					if(Ext.isEmpty(focused)){
						Notification.showNotification('Please select a record!');
						return;
					}
					var data = [];
					for(var i = 0 ; i<store.getCount() ; i++){
						if(!Ext.isEmpty(store.getAt(i).get("type")) || !Ext.isEmpty(store.getAt(i).get("payRatio"))
								|| !Ext.isEmpty(store.getAt(i).get("delay")) || !Ext.isEmpty(store.getAt(i).get("serviceNames"))){
							data.push(store.getAt(i).data);
						}
					}
					focused.raw.trigger = data;
					var serviceDatas = treePanel.getService();
					if(serviceDatas[focused.get("categoryId")]){
						serviceDatas[focused.get("categoryId")].trigger = data;
					}
				},
				remove : function(store){
					var focused = DigiCompass.Web.app.msa.focusedNode;
					if(Ext.isEmpty(focused)){
						Notification.showNotification('Please select a record!');
						return;
					}
					var data = [];
					for(var i = 0 ; i<store.getCount() ; i++){
						if(!Ext.isEmpty(store.getAt(i).get("type")) || !Ext.isEmpty(store.getAt(i).get("payRatio"))
								|| !Ext.isEmpty(store.getAt(i).get("delay")) || !Ext.isEmpty(store.getAt(i).get("serviceNames"))){
							data.push(store.getAt(i).data);
						}
					}
					focused.raw.trigger = data;
					var serviceDatas = treePanel.getService();
					if(serviceDatas[focused.get("categoryId")]){
						serviceDatas[focused.get("categoryId")].trigger = data;
					}
				}
			}
		});
		
		var servicesFocusRecord;
		
		var triggerComboData = [["Capex", "Capex"],["Opex","Opex"]];
		Ext.define('DigiCompass.Web.app.msa.ServiceSelTrigger', {
		    extend: 'Ext.form.field.Trigger',		 
		    alias : 'widget.serviceSelTrigger',
		    onTriggerClick: function() {
				var message = {};
				var checkedIds = [];
				var wcList = servicesFocusRecord.get("serviceCatalogues");
				if(wcList){
					for(var i = 0; i < wcList.length; i++){
						checkedIds.push(wcList[i].id);
					}
				}
				if(!DigiCompass.Web.app.msa.selectedServiceTpl){
					return;
				}
				message.checkedIds = checkedIds;
				message.workflowCategoryId = DigiCompass.Web.app.msa.selectedServiceTpl;
				message.MODULE_TYPE = 'RESOURCE_MASTER_SERVICE_AGREEMENT';
				message.COMMAND = 'COMMAND_QUERY_TREE';
				cometdfn.request(message, function(data, Conf,
						fnName, command){
					
					var _data = data.BUSINESS_DATA.data;
					var datas = Ext.JSON.decode(_data);
					
					var store = Ext.create('Ext.data.TreeStore', {
						root : datas
					});

					var treePanel = Ext.create('Ext.tree.Panel', {
						id : 'workflowCategoryTreePanel',
						flex : 1,
						rootVisible : false,
						store : store,
						listeners : {
							checkchange : function(node, checked, eOpts) {
								DigiCompass.Web.TreeUtil.checkchild(node, checked);
								DigiCompass.Web.TreeUtil.checkparent(node);
							}
						}
					});
					
					Ext.create('DigiCompass.Web.app.AutosizeWindow', {						
						title : 'Workflow Category',
						height : 800,
						width : 1000,
						layout : 'fit',
						border : false,
						items : treePanel,
						tbar : [ {
							xtype : 'button',
							text : 'Finish',
							handler : function() {
								var categoryData = getCategoryData("workflowCategoryTreePanel");
								var wcList = [];
								var serviceNames = [];
								for(var i = 0; i < categoryData.length; i++){
									var workflowCategory  = {
											id : categoryData[i].categoryId,
											name : categoryData[i].text
									};
									wcList.push(workflowCategory);
									serviceNames.push(categoryData[i].text);
								}												
								servicesFocusRecord.set("serviceCatalogues", wcList);
								servicesFocusRecord.set("serviceNames", serviceNames);
								this.up("window").close();
							}
						}]
					}).show();
				});
		    }
		});
		
		var triggerPanel = Ext.create('Ext.grid.Panel', {
			id : 'triggerPanel',
		    title: 'Trigger',
		    flex : 1,
		    columns: [
		        { text: 'Type',  dataIndex: 'type',  editor: Ext.create('Ext.form.ComboBox', {		            
		            store: triggerComboData,
		            queryMode: 'local'		            	            
		        }), renderer : function(val){
		        	for(var i = 0; i < triggerComboData.length; i++){
		        		if(triggerComboData[i][0] == val){
		        			return triggerComboData[i][1];
		        		}
		        	}
		        	return val;
		        }},
		        { text: 'Percentage', dataIndex: 'payRatio', editor: {
	                xtype: 'textfield',
	                allowBlank: false
	            }},
		        { text: 'Delay(Day)', dataIndex: 'delay', editor: {
	                xtype: 'textfield',
	                allowBlank: false
	            }},
		        { text : 'After Service Completion', dataIndex : 'serviceNames', editor: {
		        	xtype: 'serviceSelTrigger',		            
		            emptyText: 'Select Service',
		            editable : false,
	                allowBlank: false
	            }}, {
	                menuDisabled: true,
	                sortable: false,
	                xtype: 'actioncolumn',
	                width: 50,
	                items: [{
	                    icon   : './styles/cmp/images/delete.png',  // Use a URL in the icon config
	                    tooltip: 'Remove',
	                    handler: function(grid, rowIndex, colIndex) {	                    	
	                        triggerStore.removeAt(rowIndex);	                        
	                    }
	                }]
	            }
		    ],
		    store : triggerStore,
		    height: 200,
		    //width: 600,
		    selType: 'cellmodel',
		    plugins: [
		        Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1
		        })
		    ]
		});
		triggerPanel.on("beforeedit", function( editor, e, eOpts ){
			if(e.field == "serviceNames"){
				servicesFocusRecord = e.record;
			}
		});
		var propertyStore = Ext.create('Ext.data.JsonStore', {
		    	fields: ['name','value','optional'],
		    	data: []
		    });
			var panel = Ext.create('Ext.panel.Panel', {
				id : 'financialCategoryAdd',
				defaultType : 'textfield',				
				flex : 1,
				border : false,
				width : '100%',			
				frame : false,				
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items:[{
					xtype : 'container',
					flex : 1,
					layout : {
						type : 'vbox',
						align : 'stretch'
					},					
					items : [parentChildTree, treePanel]
				},{
					//width:500,
					xtype : 'container',
					id : 'msaStandardCost',					
					flex : 1,
					items:[{
				    	id : 'msaWorkFLowPropertyGrid',
						title : 'Item Properties',
						width : 'fill',
						collapsible: true,
						height : 250,
						xtype:'grid',
						selType : 'cellmodel',
						store: propertyStore,
						columns:[{
							header : 'Name',
							dataIndex : 'name',
							flex : 1
						},{
							header : 'Value',
							dataIndex : 'value',
							flex : 1
						}]}/*,{
					    	xtype : 'container',
					    	id:'msaStandardCostContainer',
					    	width : 475,
							height : 40 ,
							layout : 'column',
							defaultType : 'textfield',
					        fieldDefaults : {
								msgTarget : 'side',
								labelWidth : 30	
							},
							items:[{
								id:'msaCapex',
								xtype:'numericfield',
								labelAlign : 'right',
								useThousandSeparator: true,
								fieldLabel :'Capex ',
								name : 'capex',
								width : 220 ,
								allowBlank : false,
								margin : '5px 5px 10px 5px',
								minValue : 0,
								listeners : {
									change : function(){
										var focusNode = DigiCompass.Web.app.msa.getFocusedNode();
										if(Ext.isEmpty(focusNode)){
											return;
										}
										var checked = Ext.getCmp('workflowTreePanel').getSelectionModel().getSelection();
										var oldValue = checked[0].raw.capex;
										checked[0].raw.capex = this.value;
										DigiCompass.Web.app.msa.setParentValue(checked[0].parentNode,this.value - oldValue,'capex');
									}
								}
							},{
								id : 'msaOpex',
								labelAlign : 'right',
								useThousandSeparator: true,
								xtype:'numericfield',
								fieldLabel :'Opex ',
								allowBlank : false,
								name : 'opex',
								width : 220,
								margin : '5px 5px 10px 5px',
								minValue : 0,
								listeners : {
									change : function(){
										var focusNode = DigiCompass.Web.app.msa.getFocusedNode();
										if(Ext.isEmpty(focusNode)){
											return;
										}
										var checked = Ext.getCmp('workflowTreePanel').getSelectionModel().getSelection();
										var oldValue = checked[0].raw.opex;
										checked[0].raw.opex = this.value;
										DigiCompass.Web.app.msa.setParentValue(checked[0].parentNode,this.value - oldValue,'opex');
									}
								}
							}]
					    }*/,sowTree,triggerPanel]
				}]
			});
				
			Ext.getCmp('msaDetailPanel').add(panel);
		}
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
					msiId : node.raw.msiId,
					categoryId : node.raw.categoryId,
					trigger : node.raw.trigger,
					text : node.get("text"),
					capex : node.data.sacapex,
					opex : node.data.saopex,
					quantity : node.data.saquantity
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

	DigiCompass.Web.app.msa.getList = function(data, config) {
		DigiCompass.Web.app.msa.focusedNode = null;
		var fields = [ 'id', 'name', 'description', 'provider', 'serviceCatalogueTemplate', 'hierarchy', 'msaItems', 'stmlIds'];
		var columns = [ {
			xtype : 'treecolumn',
			header : 'Name',
			dataIndex : 'name'
		}, {
			header : 'Description',
			dataIndex : 'description'
		} ];

		var _data = data.BUSINESS_DATA.list;
		var datas = Ext.JSON.decode(_data);				
		
		var _resourceList = data.BUSINESS_DATA.resourceList;
		var resourceList = Ext.JSON.decode(_resourceList);
		

		var myStore = Ext.create('Ext.data.JsonStore', {
			fields : fields,
			data : datas
		});

		if (Ext.getCmp('msaListView')) {
			Ext.getCmp('msaListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create(
					'DigiCompass.Web.ux.objectExplorer', {
						columns : columns,
						id : "msaExplorer",
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
				id : "msaCatalogue",
				height : 730,
				data : [],
				collapsible : true,
				split : true,
				region : 'center',
				hidden : true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel', {
				id : 'msaListView',
				module : 'RESOURCE_MASTER_SERVICE_AGREEMENT',
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
													DigiCompass.Web.app.msa.focusedNode = null;													
													DigiCompass.Web.app.msa
															.showDetailPanel(null, resourceList);
												}
											},
											{
												xtype : 'button',
												text : 'Delete',
												iconCls : 'icon-delete',
												handler : function() {
													var checked = Ext
															.getCmp("msaListView").objectExplorer
															.getChecked();
													var msaIds = new Array();
													if (checked.length == 0) {
														Ext.Msg
																.alert(
																		'Warning',
																		'Please select a record!');
													} else {
														for ( var i = 0; i < checked.length; i++) {
															msaIds
																	.push(checked[i].id);
														}
														alertOkorCancel(
																'Are you sure to delete selected master service agreement?',
																function(e) {
																	if (e == 'yes') {
																		DigiCompass.Web.app.msa
																				.deleteMSA(msaIds);
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
				DigiCompass.Web.app.msa.showDetailPanel(record.data, resourceList);
			});
		}
	};
	
	function setServiceData(node){
		var triggerStoreData = [];
		if(node.raw.trigger){
			var triggerData = node.raw.trigger;
			for(var i = 0; i < triggerData.length; i++){
				var workflowCate = triggerData[i].serviceCatalogues;
				var serviceNames = []; 
				if(workflowCate){
					for(var j = 0; j < workflowCate.length; j++){
						serviceNames.push(workflowCate[j].name);
					}
				}
				triggerData[i].serviceNames = serviceNames.join(",");
			}
			triggerStoreData = node.raw.trigger;
		}				
		var triggerPanelStore = Ext.getCmp('triggerPanel').getStore();
		triggerPanelStore.loadData(triggerStoreData);
		var count  = triggerPanelStore.getCount();
		var flag = false;
		if(count == 0){
			flag = true;
		}else{
			var last = triggerPanelStore.getAt(triggerPanelStore.getCount()-1).data;						
			for(var i in last){
				if(!Ext.isEmpty(last[i])){
					flag = true;
					break;
				}
			}
		}
		if(flag){							
			triggerPanelStore.insert(triggerPanelStore.getCount(), {type : null, payRatio : null, delay : null, serviceCatalogues : null});
		}						
		Ext.getCmp('msaWorkFLowPropertyGrid').getStore().loadData(node.raw.property);
		if(!node.isLeaf()){
			var capexValue = 0;
			var opexValue = 0;
			node.cascadeBy(function(n){
				if(n.isLeaf()){
					capexValue = capexValue + n.raw.capex;
					opexValue = opexValue + n.raw.opex;
				}
			});
			return;
		}
		var sowTree = Ext.getCmp('msaWorkFlowSowTree');
		if(sowTree){
			var data = Ext.clone(node.raw.sow);
			if(data && data.length > 0){
				var rootNode = data[0];
				DigiCompass.Web.app.msa.changeRootArrToTree(rootNode);
				sowTree.setRootNode(rootNode);
			}
		}
	}

	DigiCompass.Web.app.msa.deleteMSA = function(msaIds) {
		var message = {};
		message.msaIds = msaIds;
		message.MODULE_TYPE = 'RESOURCE_MASTER_SERVICE_AGREEMENT';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.request(message, DigiCompass.Web.app.msa.deleteMSACallback);
	}

	DigiCompass.Web.app.msa.deleteMSACallback = function(data, Conf, fnName,
			command) {
		var status = data.STATUS;
		if (status === "success") {
			Ext.getCmp('obj-details').removeAll();
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.resourceMSA(queryParam);
			// Ext.Msg.alert('Information', );
			alertSuccess('Delete Data Successful!');
		} else if (data.customException) {
			alertError(data.customException);
		}
	};

	DigiCompass.Web.app.msa.showDetailPanel = function(obj, resourceList) {
		var objExpPanel = Ext.getCmp('obj-details');
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var msaDetailPanel = Ext.create('Ext.panel.Panel', {
			id : 'msaDetailPanel',
			// title:'Planned Site Detail',
			layout : 'vbox',
			autoScroll : true
		});
		var version = "";
		var obj_id = "";
		var ptitle = "Object Detail - Service Agreements";
		if (obj) {
			version = obj.name;
			obj_id = obj.id;
			ptitle = ptitle + "(" + version + ")";
		}
		var ReversalPanel = new DigiCompass.Web.app.ReversalPanel({
			panelTitle : ptitle,
			height : 700,
			front : msaDetailPanel,
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
		var formPanel = DigiCompass.Web.app.msa.getForm(obj, resourceList);
		var resourcesData = [];
		var obj_id = null;
		if (obj && obj.resources) {
			resourcesData = obj.resources;
		}
		if (obj && obj.id) {
			obj_id = obj.id;
		}
		Ext.getCmp('msaDetailPanel').add(formPanel);
		if (obj) {
			var formData = Ext.clone(obj);
			formData.resource = formData.provider.id;
			var categoryTypeId = formData.hierarchy.id;
			var categoryTypeIdComp = Ext.getCmp('categoryTypeId');
			if(categoryTypeIdComp){
				categoryTypeIdComp.suspendEvents();
				categoryTypeIdComp.setValue(categoryTypeId);
				categoryTypeIdComp.resumeEvents();
				categoryTypeIdComp.setReadOnly(true);
				cometdfn.publish({
					MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
					COMMAND : 'COMMAND_QUERY_LIST',
					dataType : 'TreeData',
					categoryTypeId : categoryTypeId
				});	
			}			
			formPanel.getForm().setValues(formData);
			var serviceDatas = {};
			if(obj.msaItems){
				for(var i = 0; i < obj.msaItems.length; i++){
					var item = obj.msaItems[i];				
					serviceDatas[item.serviceCatalogue.id] = {
						id : item.serviceCatalogue.id,
						msiId : item.id,
						categoryId : item.serviceCatalogue.id,
						trigger : item.triger,						
						capex : item.capex,
						opex : item.opex,
						quantity : item.quantity						
					}
				}
			}
			DigiCompass.Web.app.msa.getWorkFlowTemplateTree(serviceDatas);
			Ext.getCmp("serviceCatalogueTemplate").selectedTpl = obj.stmlIds;
		}
		/*
		 * cometdfn.request({ MODULE_TYPE : 'RESOURCE_TYPE_MODULE', COMMAND :
		 * 'COMETD_COMMAND_RESOURCE_TYPE_WORKFLOW_TREE', resourceTypeId : obj_id },
		 * DigiCompass.Web.app.resourceType.getWorkFlowInstanceTree);
		 */
	};
	
})();