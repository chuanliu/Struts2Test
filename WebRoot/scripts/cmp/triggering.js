(function() {
	Ext.ns("DigiCompass.Web.app.triggering");		
	DigiCompass.Web.app.triggering.showGSBView = function() {
		var win = Ext.getCmp("triggeringGSBWindow");
		if (!win) {
			var gridPanel = DigiCompass.Web.app.triggering.createGSBGrid();
			var treeGrid = DigiCompass.Web.app.triggering.createKpiDefineTree("gsb");
			win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
				id : "triggeringGSBWindow",
				title : "Source Data",
				height : 700,
				width : 1100,
				modal : true,
				maximizable : true,
				autoScroll : true,
				layout: 'border',
				bodyBorder: false,
				defaults: {
				    collapsible: true,
				    split: true				    
				},
				items : [ gridPanel, treeGrid ],
			    listeners: {
			        beforeclose: function(win) {
			        	win.down("treepanel").getPlugin().cancelEdit();				            
			        }
			    }
			});
			loadPanelData(treeGrid);
		}
		win.show();
	}
	
	DigiCompass.Web.app.triggering.createTriggerConditionTree = function() {
		
		var store = Ext.create('Ext.data.TreeStore', {
			fields: ["id", "parent_id", 'name','description', 'tigger_times', 'evaluation_period', 'reqdelay', 'condition', 'services', 'serviceCatalogueHierarchyId', 'financialCategoryGroupId'],
			root: {},
	        folderSort: true
	     });
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
        	listeners : {
        		beforeedit: function (me, e) {        			
    				if(e.field == "name" && e.record.get("leaf") == false){
    					return true;
    				} else {
    					return false;
    				}        			        			
        		},
        		edit : function(editor, e) {
        			if(e.field == "name"){
        				if(e.value != e.originalValue){
        					
		        			var childNodes = e.record.parentNode.childNodes;		        			
		        			var arr = new Array();		        			
		        			for(var i = 0; i < childNodes.length; i++){
		        				console.log(childNodes[i].get(e.field));
		        				for(var j = 0; j < arr.length; j++){
		        					if(arr[j] == childNodes[i].get(e.field)){
		        						e.record.set(e.field, e.originalValue);
		        						e.record.commit();
										return;
									}
		        				}        				
		        				arr.push(childNodes[i].get(e.field));
		        			}
		        			
		        			var record = e.record;
		                	var data = {
		                			id  : record.raw.id,
			                		name : record.get("name"),
			                		description : record.get("descrption")	                		
			                	};    
							var message = {};						
							message.MODULE_TYPE = 'TRIGGER_CONDITION_MODULE';
							message.COMMAND = 'COMMAND_SAVE_FOLDER';
							message.data = data;
							cometdfn.request(message, function(data, Conf) {
								var status = data.STATUS;
								if (status === "success") {							
									var rv = data.BUSINESS_DATA.rv;    								
									if(rv == 0){
										
									} else {
										Notification.showNotification("save fail");									
									}
								} else if (data.customException) {
									alertError(data.customException);
								}
							});		
		        		    record.commit();
        				}
        			}        			
        		}
        	}
		});

		var panel = Ext.create('Ext.tree.Panel', {
			id : "triggerTreePanel",
			title : 'Triggers',			
			region : 'west',
			store : store,
			columns : [{
				xtype : 'treecolumn',
				text : 'Name',
				sortable : true,				
				dataIndex : 'name',
				width : 150,
			    editor	  : {
	            	allowBlank : false,
					maxLength  : UiProperties.nameMaxLength
		        }
			}, {
				text : 'Description',
				sortable : false,
				dataIndex : 'description',	
				flex : 1,
				editor : {
					allowBlank : false,
					maxLength : UiProperties.descMaxLength
				}
			},{
                xtype: 'actioncolumn',                 
                align: 'center',
                width:20,                
                items: [
                    {
                    	icon: './styles/cmp/images/add.png',                    	
                        getClass: function(value,meta,record,rowIx,ColIx, store) {                        	
                        	if(!record.get("leaf")) return 'x-grid-center-icon';
    	                    return 'x-hide-display';
    	                },
    	                handler:function(grid,rowIndex,rowIndex,item,e,record,row){
    	                	var children = record.childNodes;							
							var name = record.get("name")+"("+children.length+")";
							for(var i = 0; i < children.length; i++){
								if(children[i].get("name") == name){
									Notification.showNotification("exists " + name);
									return;
								}
							}
							
							var parent_id = record.raw.id;							
    	                	var emptyNode = {
    	                		name : name,
    	                		description : '',    	                		
    	                		parent_id : parent_id,
    	                		expanded : true
    	                	};    	                	
    						var message = {};						
    						message.MODULE_TYPE = 'TRIGGER_CONDITION_MODULE';
    						message.COMMAND = 'COMMAND_SAVE_FOLDER';
    						message.data = emptyNode;
    						cometdfn.request(message, function(data, Conf) {
    							var status = data.STATUS;
    							if (status === "success") {							
    								var rv = data.BUSINESS_DATA.rv;    								
    								if(rv == 0){
    									var id = data.BUSINESS_DATA.id;
    									record.appendChild(emptyNode);
    									var newRecord = children[children.length-1];
    									newRecord.raw.id = id;
    		    	                    var rowIndex = grid.getStore().indexOf(newRecord);
    		    		            	cellEditing.cancelEdit();
    		    		            	cellEditing.startEditByPosition({
    		    		        			row: rowIndex,
    		    		        			column: 0
    		    		        		});
    								} else {
    									Notification.showNotification("save fail");									
    								}
    							} else if (data.customException) {
    								alertError(data.customException);
    							}
    						});		    		            	
    	                }
                    }
                ]
            },{
                xtype: 'actioncolumn',                 
                align: 'center',
                width:20,                
                items: [
                   {

                   	icon: './styles/cmp/images/delete.png',                    	
                   	getClass: function(value,meta,record,rowIx,ColIx, store) {
                   		if(rowIx != 0) return 'x-grid-center-icon';
   	                    return 'x-hide-display';
   	                },
   	                handler:function(view,rowIndex,rowIndex,item,e,record,row){
   	                	Ext.MessageBox.confirm('','Delete?',function(btn){
   	        				if(btn=='yes'){
   	    						var message = {};						
   	    						message.MODULE_TYPE = 'TRIGGER_CONDITION_MODULE';
   	    						message.COMMAND = 'COMMAND_DEL';
   	    						message.id = record.raw.id;
   	    						message.leaf = record.get("leaf");
   	    						cometdfn.request(message, function(data, Conf) {
   	    							var form = Ext.getCmp("triggerConditionFormPanel").getForm();
   	    							form.reset();
   	    							var status = data.STATUS;
   	    							if (status === "success") {							
   	    								var rv = data.BUSINESS_DATA.rv;    								
   	    								if(rv == 0){
   	    									record.remove();	   	    									
   	    								} else {
   	    									Notification.showNotification("delete fail");									
   	    								}
   	    							} else if (data.customException) {
   	    								alertError(data.customException);
   	    							}
   	    						});   	        						
   	        				}
   	        			});
   	                }
                   
                   }
                ]
            }],
			//rootVisible : false,
			plugins : [cellEditing],
			listeners : {
				itemclick : function(_this, record, item, index, e, eOpts ){
					panel.clickItem = record;					
					if(record.get("leaf") == true){
						var form = Ext.getCmp("triggerConditionFormPanel").getForm();
						form.setValues(record.raw);
						serviceDatas = {};
						Ext.getCmp("catalogueTree").setRootNode({});
						if(record.raw.services){
							var services = record.raw.services;
							for(var i = 0; i < services.length; i++){
								serviceDatas[services[i].SERVICE_ID] = {};
							}
							
							var serviceIds = new Array();
							for(var i in serviceDatas){
								serviceIds.push(i);
							}
							if(serviceIds.length > 0){
								cometdfn.request({
									MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
									COMMAND : 'SERVICE_BELONG_SC',			
									serviceIds : serviceIds  			
								}, function(data){
									var list = data.BUSINESS_DATA.list;
									var sctTree = Ext.getCmp("serviceCatalogueTemplate");
									var rnode = sctTree.getRootNode();
									if(rnode.childNodes && rnode.childNodes.length > 0){
										rnode.cascadeBy(function(node){
											node.set("checked", false);
											for(var i = 0; i < list.length; i++){
												if(list[i] == node.raw.id){
													node.set("checked", true);
												}
											}
										});
									} else {
										sctTree.selectedTpl = list;
									}
								});			
							}
						}
					}					
				}
			}
		});
				
		panel.addDocked(Ext.create('Ext.toolbar.Toolbar',{
			width:200,
			items:[{
				xtype : 'button',
				text : 'Add Trigger',
				iconCls : 'icon-add',
				handler : function() {
					if(panel.clickItem){
						var children = panel.clickItem.childNodes;
						var name = panel.clickItem.get("name")+"("+children.length+")";
						var record = {
								id : "",
								name : name,
								folder_id : panel.clickItem.get("id"),
								description : "",
								tigger_times : "",
								evaluation_period : "",
								condition : "",
								leaf : true
							};
						panel.clickItem.appendChild(record);																																				
						var form = Ext.getCmp("triggerConditionFormPanel").getForm();
						form.setValues(record);	
						/*var obj = {
								folder_id : panel.clickItem.raw.id,									
								name : name									
							}
						var message = {};						
						message.MODULE_TYPE = 'TRIGGER_CONDITION_MODULE';
						message.COMMAND = 'COMMAND_SAVE';    						
						message.data = obj;
						cometdfn.request(message, function(data, Conf) {
							var status = data.STATUS;
							if (status === "success") {							
								var rv = data.BUSINESS_DATA.rv;    								
								if(rv == 0){
									var rtnObjStr = data.BUSINESS_DATA.rtnObj;
									var rtnObj = Ext.decode(rtnObjStr);	
									panel.getRootNode().cascadeBy(function(node){
										if(node.raw.id == rtnObj.folder_id){
											var record = {
													id : rtnObj.id,
													name : rtnObj.name,													
													description : "",
													tigger_times : "",
													evaluation_period : "",
													condition : "",
													leaf : true
												};
											node.appendChild(record);																																				
											var form = Ext.getCmp("triggerConditionFormPanel").getForm();
											form.setValues(record);											
											return false;
										}											
									});
								} else {
									Notification.showNotification("save fail");									
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});*/
					}
				}
			}]
		}));		
		
		return panel;
	}
	
	var serviceDatas = {};
	DigiCompass.Web.app.triggering.getServicePanel = function(param){
		param = param || {}		
		var categoryTypeTree = Ext.create('Ext.tree.Panel', {
	        title : 'Service',
	        region : 'center',
	        id : 'catalogueTree',	        
	        //margin:'5 0 0 0',
	        autoScroll  : true,
	        //collapsible: true,
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
			id : 'triggerServicePanel',
			frame : false,
			border : false,
			flex : 1,
			defaults: {		
				collapsible: true,
			    split: true				    
			},
			layout: 'border',
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
		
		var serviceIds = new Array();
		for(var i in serviceDatas){
			serviceIds.push(i);
		}
		if(serviceIds.length > 0){
			cometdfn.request({
				MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
				COMMAND : 'SERVICE_BELONG_SC',			
				serviceIds : serviceIds  			
			}, function(data){
				var list = data.BUSINESS_DATA.list;
				var sctTree = Ext.getCmp("serviceCatalogueTemplate");
				var rnode = sctTree.getRootNode();
				if(rnode.childNodes && rnode.childNodes.length > 0){
					rnode.cascadeBy(function(node){
						for(var i = 0; i < list.length; i++){
							if(list[i] == node.raw.id){
								node.set("checked", true);
							}
						}
					});
				} else {
					sctTree.selectedTpl = list;
				}
			});			
		}
		return panel;
	}
	
	DigiCompass.Web.app.triggering.createTriggerConditionDetail = function(){
		
		var hierarchyEvents = {
				change : function(field, newValue, oldValue, eOpts){
					var param = {};
					param.serviceCatalogueHierarchyId = Ext.getCmp("serviceCatalogueHierarchyId").getValue();
					param.financialCategoryGroupId = Ext.getCmp("financialCategoryGroupId").getValue();
					if(param.serviceCatalogueHierarchyId && param.financialCategoryGroupId){						
						if(Ext.getCmp("triggerServicePanel")){
							cometdfn.request({
								MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
								COMMAND : 'COMMAND_QUERY_LIST',
								dataType : 'TreeData',
								categoryTypeId : param.serviceCatalogueHierarchyId,
								fchId:param.financialCategoryGroupId
							}, function(data, Conf){														
								Ext.getCmp("catalogueTree").setRootNode({});
							});
						} else {
							var serviceTreePanel = DigiCompass.Web.app.triggering.getServicePanel(param);
							detailPanel.add(serviceTreePanel);
						}
					}
				}
			}
			
		var formPanel = Ext.create('Ext.form.Panel', {
			id : "triggerConditionFormPanel",
			border : false,				
			frame : false,			
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 100
			},
			defaultType : 'textfield',
			items : [{
				xtype : 'hiddenfield',
				name : 'id'
			},{
				xtype : 'hiddenfield',
				name : 'folder_id'
			},{				
				margin : '10 0 0 10',									
				allowBlank : false,				
				fieldLabel : 'Name',					
				msgTarget : 'side',
				name : 'name'					
			},{				
				margin : '10 0 0 10',																
				fieldLabel : 'Description',					
				msgTarget : 'side',
				name : 'description'					
			},{
			   margin : '10 0 0 10',									
			   allowBlank : false,
			   id : "cycleEl",
			   fieldLabel : 'Cycle',
			   xtype : "combo",
			   name : "cycle",
			   store : [[3600,"Hour"],[3600*24,"Day"],[3600*24*7,"Week"],[-1000,"Month"],[-2000,"Quarter"],[-3000,"Year"]],
			   displayField : 'name',
			   valueField : 'id'
		   },{				
				margin : '10 0 0 10',									
				allowBlank : false,				
				fieldLabel : 'Tigger Times',					
				msgTarget : 'side',
				name : 'tigger_times'					
			},{				
				margin : '10 0 0 10',									
				allowBlank : false,				
				fieldLabel : 'Evaluation Period',					
				msgTarget : 'side',
				name : 'evaluation_period'					
			},{
				margin : '10 0 0 10',
				allowBlank : false,	
				name : "reqdelay",
				fieldLabel : "Delay",
				minValue : 1,
				xtype : "numberfield"
			},{	
				id : "triggerConditionEl",
				margin : '10 0 0 10',
				fieldLabel : 'Condition',
				xtype : "textarea",
				name : 'condition',
				allowBlank : false,				
				anchor : '100%',
				enableKeyEvents : true,
				listeners : {
					keydown : function(_this, e, eOpts){
						if(e.keyCode == 45 || e.keyCode == 192){
							e.preventDefault();
							autoComp(function(val){
								_this.setValue(_this.getValue()+val+" ");
							}, Ext.getCmp("cycleEl").getValue());							
						}
			        }
				}
			},Ext.create('DigiCompass.web.UI.ComboBox',{
				id : "serviceCatalogueHierarchyId",
				margin 	     : '10px 5px 10px 10px',
				name : 'serviceCatalogueHierarchyId',				
				moduleType : 'MOD_WORK_FLOW',
				labelWidth   : 200,
				moduleCommand : 'COMMAND_QUERY_COMBOX_LIST',
				fieldLabel   : 'Service Catalogue Hierarchy',
				allowBlank   : false,
				editable     : false,
				//value : param.serviceCatalogueHierarchyId,
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
				margin 	     : '10px 5px 10px 10px',			
				fieldLabel   : 'Financial Catalogue Hierarchy',
				allowBlank   : false,
				displayField : 'name',
				valueField   : 'id',
				moduleType : 'MOD_CHANGE_REQUEST',
				moduleCommand : 'COMMAND_FINANCIAL_CATEGORY_COMBO_DATA',
				parseData : function(message){
					var data = Ext.JSON.decode(message['BUSINESS_DATA']['financialCategoryList']);
					var d = [];
					for(var i in data){
						d.push([data[i].id, data[i].name]);
					}
					return d;
				},
				labelWidth   : 200,
				//value : param.financialCategoryGroupId,
				editable     : false,
				listeners : hierarchyEvents
			})],
			tbar : [{
				xtype : 'button',
				text : 'Save',
				iconCls : 'icon-save',
				handler : function() {
					var form = this.up("form").getForm();
					if (form.isValid()) {
						var values = form.getValues();						
	                	var data = {
	                			id  : values.id,
	                			folderId : values.folder_id,
		                		name : values.name,		                		
		                		description : values.description,
		                		cycle : values.cycle,
		                		tigger_times : values.tigger_times,
		                		evaluation_period : values.evaluation_period,
		                		reqdelay : values.reqdelay,
		                		serviceCatalogueHierarchyId : values.serviceCatalogueHierarchyId,
		                		financialCategoryGroupId : values.financialCategoryGroupId,
		                		condition : values.condition
		                	};
	                	var message = {};
	                	var triggerServicePanel = Ext.getCmp("triggerServicePanel");
	                	if(triggerServicePanel){
	                		message.services = triggerServicePanel.getService();
	                	}												
						message.MODULE_TYPE = 'TRIGGER_CONDITION_MODULE';
						message.COMMAND = 'COMMAND_UPDATE';
						message.data = data;
						cometdfn.request(message, function(data, Conf) {
							form.reset();														
							var status = data.STATUS;
							if (status === "success") {							
								var rv = data.BUSINESS_DATA.rv;    								
								if(rv == 0){
									loadTriggerPanelData(Ext.getCmp("triggerTreePanel"));
									Notification.showNotification("save success");
								} else {
									Notification.showNotification("save fail");									
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});	
					}
				}
			}]/*,
			listeners : {
				afterrender : function(){
					var message = {
							MODULE_TYPE : 'KPI_DEFINE_MODULE',
							COMMAND : 'COMMAND_QUERY_KPI'					
						};	
					cometdfn.request(message, function(data, Conf) {
						var status = data.STATUS;
						if (status === "success") {
							var _list = data.BUSINESS_DATA.list;
							var datas = Ext.JSON.decode(_list);	
							var arrData = new Array();
							for(var i = 0; i < datas.length; i++){
								arrData.push(datas[i]["NAME"]);
							}
							jQuery("#triggerConditionEl textarea").atwho('@', {
							    data: arrData							    
							});
						} else if (data.customException) {
							alertError(data.customException);
						}
					});
				}
			}*/
		});
		
		var detailPanel = Ext.create('Ext.panel.Panel', {
			region : "center",
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			autoScroll : true,
			items : [formPanel]
		});
	
		return detailPanel;
	}
	
	function loadTriggerPanelData(panel){
		var message = {
				MODULE_TYPE : 'TRIGGER_CONDITION_MODULE',
				COMMAND : 'COMMAND_QUERY_TREE'					
			};			
		cometdfn.request(message, function(data, Conf) {
			var status = data.STATUS;
			if (status === "success") {
				var _data = data.BUSINESS_DATA.treeData;
				var datas = Ext.JSON.decode(_data);
				panel.setRootNode(datas);
			} else if (data.customException) {
				alertError(data.customException);
			}
		});
	}
	
	DigiCompass.Web.app.triggering.showTriggerConditionView = function(){

		var win = Ext.getCmp("triggerConditionWindow");
		if (!win) {			
			var treePanel = DigiCompass.Web.app.triggering.createTriggerConditionTree();
			var detailPanel = DigiCompass.Web.app.triggering.createTriggerConditionDetail();
			win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
				id : "triggerConditionWindow",
				title : "Trigger Condition",
				height : 700,
				width : 1000,
				maximizable : true,
				modal : true,
				autoScroll : true,
				layout: 'border',
				bodyBorder: false,
				defaults: {
				    collapsible: true,
				    split: true				    
				},
				items : [treePanel, detailPanel],
			    listeners: {
			        beforeclose: function(win) {
			        	win.down("treepanel").getPlugin().cancelEdit();				            
			        }
			    }
			});
			loadTriggerPanelData(treePanel);		
		}
		win.show();
	
	}
	
	DigiCompass.Web.app.triggering.createNohDiagram = function(){		
		var panel = Ext.create('Ext.panel.Panel', {
			id : "nohDiagramPanel",
		    html: '<div id="diagramContainer"></div>',
		    region : 'center',
		    listeners : {		    	
		    	afterlayout : function(){
		    		if(panel.isRendered){
		    			return;
		    		}
		    		var width = panel.getWidth();
		    		var height = panel.getHeight();
		    		panel.diagramObj = DigiCompass.Web.app.triggering.drawDiagram(width, height, panel.nodes, panel.links);
		    		panel.isRendered = true;
		    	}
		    }
		});
		panel.nodes = [];
		panel.links = [];
		return panel;
	}
	
	DigiCompass.Web.app.triggering.drawDiagram = function(width, height, nodes, links){// set up SVG for D3
	    colors = d3.scale.category10();

	var svg = d3.select('#diagramContainer')
	  .append('svg')
	  .attr('width', width)
	  .attr('height', height);

	// set up initial nodes and links
	//  - nodes are known by 'id', not by index in array.
	//  - reflexive edges are indicated on the node (as a bold black circle).
	//  - links are always source < target; edge directions are set by 'left' and 'right'.
	/*var nodes = [
	    {id: 0, reflexive: false},
	    {id: 1, reflexive: true },
	    {id: 2, reflexive: false}
	  ],
	  lastNodeId = 2,
	  links = [
	    {source: nodes[0], target: nodes[1], left: false, right: true },
	    {source: nodes[1], target: nodes[2], left: false, right: true }
	  ];*/

	// init D3 force layout
	var force = d3.layout.force()
	    .nodes(nodes)
	    .links(links)
	    .size([width, height])
	    .linkDistance(150)
	    .charge(-500)
	    .on('tick', tick)

	// define arrow markers for graph links
	svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'end-arrow')
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 6)
	    .attr('markerWidth', 3)
	    .attr('markerHeight', 3)
	    .attr('orient', 'auto')
	  .append('svg:path')
	    .attr('d', 'M0,-5L10,0L0,5')
	    .attr('fill', '#000');

	svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'start-arrow')
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 4)
	    .attr('markerWidth', 3)
	    .attr('markerHeight', 3)
	    .attr('orient', 'auto')
	  .append('svg:path')
	    .attr('d', 'M10,-5L0,0L10,5')
	    .attr('fill', '#000');

	// line displayed when dragging new nodes
	var drag_line = svg.append('svg:path')
	  .attr('class', 'link dragline hidden')
	  .attr('d', 'M0,0L0,0');

	// handles to link and node element groups
	var path = svg.append('svg:g').selectAll('path'),
	    circle = svg.append('svg:g').selectAll('g');

	// mouse event vars
	var selected_node = null,
	    selected_link = null,
	    mousedown_link = null,
	    mousedown_node = null,
	    mouseup_node = null;

	function resetMouseVars() {
	  mousedown_node = null;
	  mouseup_node = null;
	  mousedown_link = null;
	}

	// update force layout (called automatically each iteration)
	function tick() {
	  // draw directed edges with proper padding from node centers
	  path.attr('d', function(d) {
	    var deltaX = d.target.x - d.source.x,
	        deltaY = d.target.y - d.source.y,
	        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
	        normX = deltaX / dist,
	        normY = deltaY / dist,
	        sourcePadding = d.left ? 17 : 12,
	        targetPadding = d.right ? 17 : 12,
	        sourceX = d.source.x + (sourcePadding * normX),
	        sourceY = d.source.y + (sourcePadding * normY),
	        targetX = d.target.x - (targetPadding * normX),
	        targetY = d.target.y - (targetPadding * normY);
	    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	  });

	  circle.attr('transform', function(d) {
	    return 'translate(' + d.x + ',' + d.y + ')';
	  });
	}
	
	function parentNodes(links, source, arr){
		for(var i = 0; i < links.length; i++){
			if(links[i].target == source){
				arr.push(links[i].source);
				parentNodes(links, links[i].source, arr);
			}
		}
	}

	// update graph (called when needed)
	function restart() {
	  // path (link) group
	  path = path.data(links);

	  // update existing links
	  path.classed('selected', function(d) { return d === selected_link; })
	    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
	    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


	  // add new links
	  path.enter().append('svg:path')
	    .attr('class', 'link')
	    .classed('selected', function(d) { return d === selected_link; })
	    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
	    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
	    .on('mousedown', function(d) {
	      if(d3.event.ctrlKey) return;

	      // select link
	      mousedown_link = d;
	      if(mousedown_link === selected_link) selected_link = null;
	      else selected_link = mousedown_link;
	      selected_node = null;
	      restart();
	    });

	  // remove old links
	  path.exit().remove();


	  // circle (node) group
	  // NB: the function arg is crucial here! nodes are known by id, not by index!
	  circle = circle.data(nodes, function(d) { return d.id; });

	  // update existing nodes (reflexive & selected visual states)
	  circle.selectAll('circle')
	    .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
	    .classed('reflexive', function(d) { return d.reflexive; });

	  // add new nodes
	  var g = circle.enter().append('svg:g');

	  g.append('svg:circle')
	    .attr('class', 'node')
	    .attr('r', 12)
	    .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
	    .style('stroke', function(d) { return d3.rgb(colors(d.id)).darker().toString(); })
	    .classed('reflexive', function(d) { return d.reflexive; })
	    .on('mouseover', function(d) {
	      if(!mousedown_node || d === mousedown_node) return;
	      // enlarge target node
	      d3.select(this).attr('transform', 'scale(1.1)');
	    })
	    .on('mouseout', function(d) {
	      if(!mousedown_node || d === mousedown_node) return;
	      // unenlarge target node
	      d3.select(this).attr('transform', '');
	    })
	    .on('mousedown', function(d) {
	      if(d3.event.ctrlKey) return;

	      // select node
	      mousedown_node = d;
	      if(mousedown_node === selected_node) selected_node = null;
	      else selected_node = mousedown_node;
	      selected_link = null;

	      // reposition drag line
	      drag_line
	        .style('marker-end', 'url(#end-arrow)')
	        .classed('hidden', false)
	        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

	      restart();
	    })
	    .on('mouseup', function(d) {
	      if(!mousedown_node) return;

	      // needed by FF
	      drag_line
	        .classed('hidden', true)
	        .style('marker-end', '');

	      // check for drag-to-self
	      mouseup_node = d;
	      if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

	      // unenlarge target node
	      d3.select(this).attr('transform', '');

	      // add link to graph (update if exists)
	      // NB: links are strictly source < target; arrows separately specified by booleans
	      var source, target, direction;
	      /*if(mousedown_node.id < mouseup_node.id) {
	        source = mousedown_node;
	        target = mouseup_node;
	        direction = 'right';
	      } else {
	        source = mouseup_node;
	        target = mousedown_node;
	        direction = 'left';
	      }*/
	      source = mousedown_node;
	      target = mouseup_node;
	      direction = 'right';
	      
	      var pNodes = new Array();
	      parentNodes(links, source, pNodes);
	      var elink = pNodes.filter(function(node) {
		        return (node === target);
		      })[0];
	      if(elink){
	    	  return;
	      }

	      var link;
	      link = links.filter(function(l) {
	        return (l.source === source && l.target === target);
	      })[0];

	      if(link) {
	        link[direction] = true;
	      } else {
	        link = {source: source, target: target, left: false, right: false};
	        link[direction] = true;
	        links.push(link);
	      }

	      // select new link
	      selected_link = link;
	      selected_node = null;
	      restart();
	    });

	  // show node IDs
	  g.append("svg:g").attr("transform", "translate(0,25)")
	  	.append('svg:text')
	      .attr('x', 0)
	      .attr('y', 4)
	      .attr('class', 'id textClass')
	      .text(function(d) { return d.id; });
	  
	  if(nodes.length > 0){
		  d3.selectAll(".textClass").data(nodes).text(function(d){return d.id;});
	  }

	  // remove old nodes
	  circle.exit().remove();

	  // set the graph in motion
	  force.start();
	}

	function mousedown() {
	  // prevent I-bar on drag
	  //d3.event.preventDefault();
	  
	  // because :active only works in WebKit?
	  svg.classed('active', true);

	  if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;

	  restart();
	}
	
	function updateNodes(pnodes){
		  nodes.splice(0, nodes.length);
		  links.splice(0, links.length);
		  restart();
		  for(var i = 0; i < pnodes.length ;i++){
			  nodes.push(pnodes[i]);
		  }
		  restart();
	}
	
	function updateNode(fieldName, id){
		for(var i = 0; i < nodes.length; i++){
			if(nodes[i].fieldName == fieldName){
				nodes[i].id = id;
				break;
			}
		}
		restart();
	}
	
	function updateLinks(plinks){
		  links.splice(0, links.length);
		  restart();
		  for(var i = 0; i < plinks.length ;i++){
			  links.push(plinks[i]);
		  }
		  restart();		
	}

	function mousemove() {
	  if(!mousedown_node) return;

	  // update drag line
	  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

	  restart();
	}

	function mouseup() {
	  if(mousedown_node) {
	    // hide drag line
	    drag_line
	      .classed('hidden', true)
	      .style('marker-end', '');
	  }

	  // because :active only works in WebKit?
	  svg.classed('active', false);

	  // clear mouse event vars
	  resetMouseVars();
	}

	function spliceLinksForNode(node) {
	  var toSplice = links.filter(function(l) {
	    return (l.source === node || l.target === node);
	  });
	  toSplice.map(function(l) {
	    links.splice(links.indexOf(l), 1);
	  });
	}

	// only respond once per keydown
	var lastKeyDown = -1;

	function keydown() {
	  //d3.event.preventDefault();

	  if(lastKeyDown !== -1) return;
	  lastKeyDown = d3.event.keyCode;

	  // ctrl
	  if(d3.event.keyCode === 17) {
	    circle.call(force.drag);
	    svg.classed('ctrl', true);
	  }

	  if(!selected_node && !selected_link) return;
	  switch(d3.event.keyCode) {
	    case 8: // backspace
	    case 46: // delete
	      if(selected_node) {
	        nodes.splice(nodes.indexOf(selected_node), 1);
	        spliceLinksForNode(selected_node);
	      } else if(selected_link) {
	        links.splice(links.indexOf(selected_link), 1);
	      }
	      selected_link = null;
	      selected_node = null;
	      restart();
	      break;
	    case 66: // B
	      if(selected_link) {
	        // set link direction to both left and right
	        selected_link.left = true;
	        selected_link.right = true;
	      }
	      restart();
	      break;
	    case 76: // L
	      if(selected_link) {
	        // set link direction to left only
	        selected_link.left = true;
	        selected_link.right = false;
	      }
	      restart();
	      break;
	    case 82: // R
	      if(selected_node) {
	        // toggle node reflexivity
	        selected_node.reflexive = !selected_node.reflexive;
	      } else if(selected_link) {
	        // set link direction to right only
	        selected_link.left = false;
	        selected_link.right = true;
	      }
	      restart();
	      break;
	  }
	}

	function keyup() {
	  lastKeyDown = -1;

	  // ctrl
	  if(d3.event.keyCode === 17) {
	    circle
	      .on('mousedown.drag', null)
	      .on('touchstart.drag', null);
	    svg.classed('ctrl', false);
	  }
	}	
	// app starts here
	svg.on('mousedown', mousedown)
	  .on('mousemove', mousemove)
	  .on('mouseup', mouseup);
	d3.select(window)
	  .on('keydown', keydown)
	  .on('keyup', keyup);
	restart();
	
	return {updateNodes : updateNodes, updateNode : updateNode, updateLinks : updateLinks, rtnObj : {links : links, nodes : nodes}};
	}
	
	function getDiagramDatas(rtnObj){
		var nodes = rtnObj.nodes;
		var links = rtnObj.links;
		for(var i = 0; i < nodes.length; i++){
			nodes[i].isRoot = true;
			nodes[i].alias = getAlias(nodes[i].fieldName);
			for(var j = 0; j < links.length; j++){
				if(links[j].target === nodes[i]){
					nodes[i].isRoot = false;
				}
			}
		}
		var datas = new Array();
		for(var i = 0; i < nodes.length; i++){
			if(nodes[i].isRoot == true){				
				putChildren(nodes[i], links);
				datas.push(nodes[i]);
			}
		}				
		return datas;
	}
	
	function getAlias(field){
		var gridPanel = Ext.getCmp("filedsGridPanel");
		var alias = null;
		gridPanel.getStore().each(function(record){
			if(record.get("name") === field){
				alias = record.get("alias");
				return false;
			}
		});
		return alias;
	}
	
	function putChildren(node, links){		
		for(var i = 0; i < links.length; i++){
			if(links[i].source === node){
				if(node.children){
					node.children.push(links[i].target);
				} else {
					node.children = new Array();
					node.children.push(links[i].target);
				}
				putChildren(links[i].target, links);
			}
		}		
	}
	
	DigiCompass.Web.app.triggering.showNetworkObjHierarchyView = function(){

		var win = Ext.getCmp("nohWindow");
		if (!win) {						
			
			var formPanel = Ext.create('Ext.form.Panel', {								
				border : false,				
				frame : false,				
				height : 100,
				layout : 'form',
				fieldDefaults : {
					labelAlign : 'left',
					msgTarget : 'side',
					labelWidth : 100
				},
				items : [{
					xtype : 'textarea',
					margin : '10 0 0 10',									
					allowBlank : false,				
					fieldLabel : 'Sql',					
					msgTarget : 'side',
					name : 'sql'					
				}],
				tbar : [{
					xtype : 'button',
					text : 'Save',
					iconCls : 'icon-save',
					handler : function() {
						var form = this.up("form").getForm();
						if (form.isValid()) {
							var values = form.getValues();
							var datas = new Array();
							if(nohDiagramPanel.diagramObj){
								var rtnObj = nohDiagramPanel.diagramObj.rtnObj;
								datas = getDiagramDatas(rtnObj);
							}							
							var message = formPanel.getForm().getValues();			
							message.MODULE_TYPE = 'NETWORK_OBJECT_HIERARCHY_MODULE';
							message.COMMAND = 'COMMAND_SAVE';							
							message.datas = datas;
							cometdfn.request(message, function(data, Conf) {
								var status = data.STATUS;
								if (status === "success") {							
									var rv = data.BUSINESS_DATA.rv;    								
									if(rv == 0){
										
										
										Notification.showNotification("save success");
									} else {
										Notification.showNotification("save fail");									
									}
								} else if (data.customException) {
									alertError(data.customException);
								}
							});	
						}
					}
				},{
					xtype : 'button',
					text : 'Query',
					iconCls : 'icon-add',
					handler : function() {
						var message = formPanel.getForm().getValues();
						message.MODULE_TYPE = 'NETWORK_OBJECT_HIERARCHY_MODULE';
						message.COMMAND = 'COMMAND_QUERY';						
						cometdfn.request(message, function(data, Conf) {							
							var status = data.STATUS;
							if (status === "success") {							
								var rv = data.BUSINESS_DATA.rv;    								
								if(rv == 0){
									var _list = data.BUSINESS_DATA.list;
									var list = Ext.decode(_list);
									store.loadData(list);
									if(nohDiagramPanel.diagramObj){			
										var arr = new Array();
										for(var i = 0; i < list.length; i++){
											arr.push({
												id : list[i].name,
												fieldName : list[i].name
											})
										}
										nohDiagramPanel.diagramObj.updateNodes(arr);
										nohDiagramPanel.diagramObj.updateLinks([]);
									}
								} else {
									Notification.showNotification("query fail");									
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});	
					}
				}]
			});
			
			var store = Ext.create('Ext.data.Store', {
				fields : ['name','alias'],
				data : []
			});
			var editRecord;
			var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				listeners : {
					beforeedit : function( editor, e, eOpts ){
						editRecord = e.record;
					},
					edit : function( editor, e, eOpts ){
						editRecord = null;
					} 
				}
			});
			
			var gridPanel = Ext.create('Ext.grid.Panel', {
				id : "filedsGridPanel",				
				region:'west',
				store : store,
				width : 210,
				columns : [
					{
						text : 'Name',
						dataIndex : 'name'				
					},
					{
						text : 'Alias',
						dataIndex : 'alias',
						editor : {
							xtype : 'textfield',
							listeners : {
								change : function( _this, newValue, oldValue, eOpts ){
									if(nohDiagramPanel.diagramObj){
										nohDiagramPanel.diagramObj.updateNode(editRecord.get("name"), newValue);
									}
								}
							}
						}				
					}             
				],plugins : [cellEditing]				
			});	
			
			var nohDiagramPanel = DigiCompass.Web.app.triggering.createNohDiagram();
			
			var detailPanel = Ext.create('Ext.panel.Panel', {				
				layout: {
				    type: 'vbox',
				    align : 'stretch',
				    pack  : 'start',
				},
			    items: [formPanel , Ext.create('Ext.panel.Panel', {
			    	flex : 1,			    				    	
					autoScroll : true,
					layout: 'border',
					bodyBorder: false,
					defaults: {
					    collapsible: true,
					    split: true				    
					},
					items : [gridPanel, nohDiagramPanel]
				})]		    
			});
			
			
			win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
				id : "nohWindow",
				title : "Network Object Hierarchy",
				height : 700,
				width : 1000,
				modal : true,
				maximizable : true,
				autoScroll : true,				
				bodyBorder: false,
				layout : 'fit',
				defaults: {
				    collapsible: true,
				    split: true				    
				},
				items : [detailPanel],
			    listeners: {
			        beforeclose: function(win) {
			        	win.down("gridpanel").getPlugin().cancelEdit();				            
			        }
			    }
			});
			
			var message = {};
			message.MODULE_TYPE = 'NETWORK_OBJECT_HIERARCHY_MODULE';
			message.COMMAND = 'COMMAND_QUERY_GRID';						
			cometdfn.request(message, function(data, Conf) {							
				var status = data.STATUS;
				if (status === "success") {							
					var rv = data.BUSINESS_DATA.rv;    								
					if(rv == 0){
						var _datas = data.BUSINESS_DATA.datas;
						var datas = Ext.decode(_datas);
						store.loadData(datas.nodes);
						var arr = new Array();
						for(var i = 0; i < datas.nodes.length; i++){
							var fieldName = datas.nodes[i].name;
							var text;
							var alias = datas.nodes[i].alias;
							if(alias && alias != ""){
								text = alias;
							} else {
								text = fieldName;
							}
							arr.push({id : text, fieldName : fieldName});
						}
						nohDiagramPanel.diagramObj.updateNodes(arr);
						var links = datas.links;
						var newLinks = new Array();
						for(var i = 0; i < links.length; i++){
							var source = getLinksData(links[i].source.COLUME, arr);
							var target = getLinksData(links[i].target.COLUME, arr);
							if(source && target){
								newLinks.push({
									source : source,
									target : target,
									left : false,
									right : true
								});
							}
						}
						nohDiagramPanel.diagramObj.updateLinks(newLinks);
						formPanel.getForm().setValues({sql : data.BUSINESS_DATA.sql});						
					} else {
						Notification.showNotification("query fail");									
					}
				} else if (data.customException) {
					alertError(data.customException);
				}
			});	
		}
		win.show();
	 
	}
	
	function getLinksData(name, nodes){
		for(var i = 0; i < nodes.length; i++){
			if(nodes[i].fieldName == name){
				return nodes[i];
			}
		}		 
	}
	
	DigiCompass.Web.app.triggering.showKpiDefineView = function() {
		var win = Ext.getCmp("triggeringKpiDefineWindow");
		if (!win) {
			var treeGrid = DigiCompass.Web.app.triggering.createKpiDefineTree("userDefined");
			var formPanel = DigiCompass.Web.app.triggering.createKpiDefineDetail();
			win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
				id : "triggeringKpiDefineWindow",
				title : "KPI Definition",
				height : 600,
				width : 1200,
				maximizable : true,
				modal : true,
				autoScroll : true,
				layout: 'border',
				bodyBorder: false,
				defaults: {
				    collapsible: true,
				    split: true				    
				},
				items : [ treeGrid, formPanel ],
			    listeners: {
			        beforeclose: function(win) {
			        	win.down("treepanel").getPlugin().cancelEdit();				            
			        }
			    }
			});
			loadPanelData(treeGrid);
		}
		win.show();
	}	
	
	DigiCompass.Web.app.triggering.createKpiDefineDetail = function() {
		var editor;
		
		var editorPanel = Ext.create('Ext.panel.Panel', {			    			    
		    html: '<div style="width:500px;height:300px" id="editorContainer"></div>',
		    region : 'east',		    
		    listeners : {
		    	afterrender : function(){
		    		com.wiris.jsEditor.defaultServicePath="/eqeditor";
					editor = com.wiris.jsEditor.JsEditor.newInstance({
						'language': 'en',
                        //'language': 'pt_BR',
                        'reservedWords': 'sum,max,min,avg',
                        'forceReservedWords': true,
                        'checkSyntax': 'true',
                        'fontSize':'12px',
                        'basePath' : '/eqeditor/resources'
					});
                    editor.onKeyDown = function(e) {
                        if (e.keyCode == 45) {    //insert
                        	autoComp(editorAutoCallback);
                        } else { 
                        	com.wiris.jsEditor.JsEditor.prototype.onKeyDown.call(this,e);                            	
                        }
                    };	
                    var timeOutId;
                    Ext.select("#editorContainer").on("keyup", function(e, t, eOpts){
                    	if(e.keyCode == 8 || e.keyCode == 46){
                    		if(timeOutId){
                    			clearTimeout(timeOutId);
                    		}
                    		timeOutId = setTimeout(function(){
                    			var mathML = editor.getMathML();
                        		var xml;
                        		if (typeof DOMParser != 'undefined') {
                        			xml = (new DOMParser()).parseFromString(mathML, 'text/xml');
                        		}
                        		var arr = new Array();
                        		iterXmlNode(xml, arr);
                        		editor.kpiData = null;
                        		for(var i = 0; i < arr.length; i++){
                        			processKpiData(editor, arr[i]);
                        		}
                        		DigiCompass.Web.app.triggering.selectKpiTree(editor);
                    		}, 2000)
                    	}
                    });
		            editor.insertInto(document.getElementById('editorContainer'));
		            Ext.select("#editorContainer").on("keydown", function(e, t, eOpts){
		            	if(e.keyCode == 192){
		            		autoComp(editorAutoCallback);
		            		e.preventDefault();
		            	}
		            });
                    editor.editorModel.addValidator({
                        validate: function(e) {
                            var s = e.vJH[0].vJH;
                            var n = s.length;
                            if (n > 0 && s[n-1].text == '`') {
                            	autoComp(editorAutoCallback);
                            } else {
                                return true;
                            }
                        }
                    });
			    } 
		    }
		});
		
		var store = Ext.create('Ext.data.TreeStore', {
			fields: ["id", "parent_id", 'kpiName','description','vendor', 'editable'],
			root: {},
	        folderSort: true
	     });
		
		var treePanel = Ext.create('Ext.tree.Panel', {
			id : "kpiSelectedTreePanel",
			title : 'Kpi Tree',			
			region : 'center',			
			store : store,			
			columns : [{
				xtype : 'treecolumn',
				text : 'Kpi Name',
				sortable : true,				
				dataIndex : 'kpiName',
				flex : 3,
			    editor	  : {
	            	allowBlank : false,
					maxLength  : UiProperties.nameMaxLength
		        }
			}, {
				text : 'Description',
				sortable : false,
				dataIndex : 'description',	
				flex : 1,
				editor : {
					allowBlank : false,
					maxLength : UiProperties.descMaxLength
				}
			}, {
				text : 'Vendor',
				sortable : false,
				flex : 1,
				dataIndex : 'vendor'
			}]
		});		
		
		var formPanel = Ext.create('Ext.form.Panel', {
			id : "kpiDetailPanel",
			defaultType : 'textfield',
			border : false,
			height : 180,
			frame : false,
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 100
			},
			items : [{
				xtype : 'hiddenfield',
				name : 'id'
			},{
				xtype : 'hiddenfield',
				name : 'folder_id'
			},{
				margin : '5 0 0 10',
				columnWidth : .7,				
				allowBlank : false,				
				fieldLabel : 'Name',
				maxLength:30,
				msgTarget : 'side',
				name : 'kpiName'
			},{
				margin : '5 0 0 10',
				columnWidth : .7,				
				allowBlank : true,
				fieldLabel : 'Description',
				maxLength:30,
				msgTarget : 'side',
				name : 'description'
			},{	
				xtype : 'combo',
				margin : '5 0 0 10',
				columnWidth : .7,											
				fieldLabel : 'Vendor',
				store : [['HW', 'HW'],['NSN','NSN']],
				maxLength:30,
				msgTarget : 'side',
				name : 'vendor'
			},{
				xtype : 'combo',
				margin : '5 0 0 10',				
				fieldLabel : 'Period',			
				allowBlank : false,
				name : 'period',				
				store : [[3600,"Hour"],[3600*24,"Day"],[3600*24*7,"Week"],[-1000,"Month"],[-2000,"Quarter"],[-3000,"Year"]],
				displayField : 'name',
				valueField : 'id'
			},{
				xtype : 'combo',
				margin : '5 0 0 10',				
				fieldLabel : 'Object Type',
				allowBlank : false,
				name : 'objectType',
				editable : false,
				store : [["Cell","Cell"],["Sector","Sector"],["BTS","BTS"],["Site","Site"],["RNC","RNC"],["Technology","Technology"],["Band","Band"]],
				displayField : 'name',
				valueField : 'id'
			}],
			tbar : [{
				xtype : 'button',
				text : 'Save',
				iconCls : 'icon-save',
				handler : function() {
					var form = this.up("form").getForm();
					if (form.isValid()) {
						var values = form.getValues();
						var mathML = editor.getMathML();
	                	var data = {
	                			id  : values.id,
	                			folderId  : values.folder_id,
		                		kpiName : values.kpiName,
		                		vendor : values.vendor,
		                		description : values.description,
		                		period : values.period,
		                		objectType : values.objectType,
		                		formula : mathML
		                	};    
	                	if (!/^[a-z$_][\w$]*$/i.test(data.kpiName)){
	                		Notification.showNotification("Invalid Variable Name");
	                		return;
	                	} else {
	                		var arr = ["sum","max","min","avg"];
	                		for(var i = 0; i < arr.length; i++){
	                			if(data.kpiName.indexOf(arr[i]) != -1){
	    	                		Notification.showNotification("contain reserved word " + arr[i]);
	    	                		return;
	                			}
	                		}
	                	}
						var message = {};						
						message.MODULE_TYPE = 'KPI_DEFINE_MODULE';
						message.COMMAND = 'COMMAND_UPDATE';
						message.data = data;
						cometdfn.request(message, function(data, Conf) {
							form.reset();							
							setMathMLFun(editor, "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>");
							var status = data.STATUS;
							if (status === "success") {							
								var rv = data.BUSINESS_DATA.rv;    								
								if(rv == 0){
									var panel = Ext.getCmp("kpiTreePanel");
									if(panel.clickItem){										
										panel.clickItem.raw = message.data;
										panel.clickItem.set("kpiName", message.data.kpiName);
										panel.clickItem.set("description", message.data.description);
										panel.clickItem.set("vendor", message.data.vendor);
									} else {
										loadPanelData(panel);
									}
									Notification.showNotification("save success");
								} else {
									Notification.showNotification("save fail");									
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});	
					}
				}
			}]
		});							
		
		var detailPanel = Ext.create('Ext.panel.Panel', {
			width : 800,
			region : 'east',
			layout : 'anchor',
		    items: [formPanel , Ext.create('Ext.panel.Panel', {
		    	anchor: '0 -180',
				autoScroll : true,
				layout: 'border',
				bodyBorder: false,
				defaults: {
				    collapsible: true,
				    split: true				    
				},
				items : [treePanel, editorPanel]
			})]		    
		});
		
		return detailPanel;
	}
	
	function editorAutoCallback(val){
		var editor = com.wiris.jsEditor.JsEditor.getInstance(document.getElementById('editorContainer'));
		editor.getEditorModel().insertMathML(val);
		processKpiData(editor, val);
		DigiCompass.Web.app.triggering.selectKpiTree(editor);
	}
	
	function autoComp(callback, cycle){
		
		var searchField = Ext.create('Ext.ux.form.BtnSearchField',{
			width:350,
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
				panel.filterByText(value);
			},
			onTrigger1Click : function(){
				var searchField = this;
				searchField.hideCancelBtn();
				value = searchField.getValue();
				var panel = this.up("treepanel");
				panel.filterByText(value);						
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
		
		var store = Ext.create('Ext.data.TreeStore', {
			fields: ["id", "parent_id", 'kpiName','description','vendor', 'editable'],
			root: {},
	        folderSort: true
	     });
		
		var panel = Ext.create('Ext.tree.Panel', {			
			title : 'Kpi Tree',			
			region : 'center',
			selModel : Ext.create("Ext.selection.RowModel"),
			store : store,			
			columns : [{
				xtype : 'treecolumn',
				text : 'Kpi Name',
				sortable : true,				
				dataIndex : 'kpiName',
				flex : 2,
			    editor	  : {
	            	allowBlank : false,
					maxLength  : UiProperties.nameMaxLength
		        }
			}, {
				text : 'Description',
				sortable : false,
				dataIndex : 'description',	
				flex : 1,
				editor : {
					allowBlank : false,
					maxLength : UiProperties.descMaxLength
				}
			}, {
				text : 'Vendor',
				sortable : false,
				flex : 1,
				dataIndex : 'vendor'
			}],
			tbar : ['Search: ', ' ', searchField, {
				xtype : 'button',
				text : 'Finish',
				handler : function(){
					var records = panel.getSelectionModel().getSelection();
					if(records.length == 1 && records[0].get("leaf") == true){						
						callback(records[0].get("kpiName"));
						win.close();
					}
				}
			}],			
		    filterByText: function(text) {
		        this.filterBy(text, 'kpiName');
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
		 
		            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
		            	if(currNode.isLeaf() && !me.selectedNode){
		            		panel.getSelectionModel().select(currNode);
		            		me.selectedNode = currNode;
		            	}
		                me.expandPath(currNode.getPath());
		 
		                while(currNode.parentNode) {
		                    nodesAndParents.push(currNode.id);
		                    currNode = currNode.parentNode;
		                }
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
		    	this.selectedNode = null;
		        var view = this.getView();
		        
		        this.getRootNode().cascadeBy(function(tree, view){
		            var uiNode = view.getNodeByRecord(this);
		 
		            if(uiNode) {
		                Ext.get(uiNode).setDisplayed('table-row');
		            }
		        }, null, [this, view]);
		    }			
		});
		
		//loadPanelData(panel);

		var message = {
				MODULE_TYPE : 'TRIGGERING_MODULE',
				COMMAND : 'GSB_KPI_TREE'					
			};
		if(cycle){
			message.cycle = cycle;
		}
		cometdfn.request(message, function(data, Conf) {
					var status = data.STATUS;
					if (status === "success") {
						var _data = data.BUSINESS_DATA.treeData;
						var datas = Ext.JSON.decode(_data);
						panel.setRootNode(datas);
					} else if (data.customException) {
						alertError(data.customException);
					}
		});
	
		var win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {			        							        			
			modal : true,
			width : 500,
			height : 400,
			layout: 'fit',
			autoScroll : true,			        				
			items : [panel],
			listeners : {
				afterrender : function(_this, eOpts ){
					_this.getEl().addListener("keyup", function(e, t, eOpts){
						if(e.keyCode == 13){
							var records = panel.getSelectionModel().getSelection();
							if(records.length == 1 && records[0].get("leaf") == true){
								callback(records[0].get("kpiName"));
								win.close();
							}
						}
					});
				}
			}
		});
		win.show();
	}
	
	function processKpiData(editor, kpiName){
		if(editor.kpiData){
			var kpiData = editor.kpiData;
			if(kpiData[kpiName]){
				kpiData[kpiName] = kpiData[kpiName] + 1; 
			} else {
				kpiData[kpiName] = 1;
			}
		} else {
			var kpiData = {};
			kpiData[kpiName] = 1;
			editor.kpiData = kpiData;
		}
	}
	
	function setMathMLFun(editor, mathML){
		editor.setMathML(mathML);
		var xml;
		if (typeof DOMParser != 'undefined') {
			xml = (new DOMParser()).parseFromString(mathML, 'text/xml');
		}
		var arr = new Array();
		iterXmlNode(xml, arr);
		editor.kpiData = null;
		for(var i = 0; i < arr.length; i++){
			processKpiData(editor, arr[i]);
		}
		DigiCompass.Web.app.triggering.selectKpiTree(editor);
	}
	
	function iterXmlNode(node, arr){

	   if (!node) {
	     return;
	   }
	  
	   if(node.nodeType==3||node.nodeType==4||node.nodeType==2){
	      arr.push(node.nodeValue);
	   }else if(node.nodeType==1||node.nodeType==9||node.nodeType==11){
	      for(var i=0;i<node.childNodes.length;++i){
	    	  iterXmlNode(node.childNodes[i], arr);
	      }
	   }

	}
	
	DigiCompass.Web.app.triggering.selectKpiTree = function(editor){
		var treePanel = Ext.getCmp("kpiSelectedTreePanel");
		var params = null;
		if(editor.kpiData){
			params = editor.kpiData;
			loadPanelData(treePanel, params);
		} else {
			treePanel.setRootNode({});
		}		
	}

	DigiCompass.Web.app.triggering.createGSBGrid = function() {

		var gridPanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
			id : "kpiGrid",
			width : 400,
			store : {
				buffered : true,
				pageSize : 100,
				autoLoad : true,
				proxy : {
					type : 'cometd.mutigroup',
					moduleType : "TRIGGERING_MODULE",
					modules : {
						read : {
							command : 'VENDOR_KPI_LIST'
						}
					},
					extraParams : {},
					afterRequest : function(response, result) {

					}
				}
			},
			region : 'west',
			title : 'KPI Grid',
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					gridPanel.getTarget().features[0].cleanGrouping();
				}
			}],			
			enableDragDrop: true,
			viewConfig: {
                plugins: {
                    ddGroup: 'gsbTree',
                    ptype: 'gridviewdragdrop',
                    enableDrop: false
                }
            }
		});

		return gridPanel;
	}

	DigiCompass.Web.app.triggering.createKpiDefineTree = function(nodeId) {
		
		var store = Ext.create('Ext.data.TreeStore', {
			fields: ["id", "parent_id", 'kpiName','description','vendor', 'editable'],
			root: {},
	        folderSort: true
	     });
		
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
        	listeners : {
        		beforeedit: function (me, e) {        			
    				if(e.field == "kpiName" && e.record.get("leaf") == true){
    					return false;
    				}        			
        			return e.record.get("editable") != "false" && isTNode(panel, nodeId, e.record);
        		},
        		edit : function(editor, e) {
        			if(e.field == "kpiName"){
        				if(e.value != e.originalValue){
        					
		        			var childNodes = e.record.parentNode.childNodes;		        			
		        			var arr = new Array();		        			
		        			for(var i = 0; i < childNodes.length; i++){
		        				console.log(childNodes[i].get(e.field));
		        				for(var j = 0; j < arr.length; j++){
		        					if(arr[j] == childNodes[i].get(e.field)){
		        						e.record.set(e.field, e.originalValue);
		        						e.record.commit();
										return;
									}
		        				}        				
		        				arr.push(childNodes[i].get(e.field));
		        			}
		        			
		        			var record = e.record;
		                	var data = {
		                			id  : record.raw.id,
			                		kpiName : record.get("kpiName"),
			                		description : record.get("descrption")	                		
			                	};    
							var message = {};						
							message.MODULE_TYPE = 'TRIGGERING_MODULE';
							message.COMMAND = 'COMMAND_SAVE_KPI_FOLDER';
							message.data = data;
							cometdfn.request(message, function(data, Conf) {
								var status = data.STATUS;
								if (status === "success") {							
									var rv = data.BUSINESS_DATA.rv;    								
									if(rv == 0){
										
									} else {
										Notification.showNotification("save fail");									
									}
								} else if (data.customException) {
									alertError(data.customException);
								}
							});		
		        		    record.commit();
        				}
        			}        			
        		}
        	}
		});

		var panel = Ext.create('Ext.tree.Panel', {
			id : "kpiTreePanel",
			title : 'KPIs',			
			region : 'center',
			store : store,
			columns : [{
				xtype : 'treecolumn',
				text : 'Kpi Name',
				sortable : true,				
				dataIndex : 'kpiName',
				width : 150,
			    editor	  : {
	            	allowBlank : false,
					maxLength  : UiProperties.nameMaxLength
		        }
			}, {
				text : 'Description',
				sortable : false,
				dataIndex : 'description',	
				flex : 1,
				editor : {
					allowBlank : false,
					maxLength : UiProperties.descMaxLength
				}
			}, {
				text : 'Vendor',
				sortable : false,
				flex : 1,
				dataIndex : 'vendor'
			},{
                xtype: 'actioncolumn',                 
                align: 'center',
                width:20,                
                items: [
                    {
                    	icon: './styles/cmp/images/add.png',                    	
                        getClass: function(value,meta,record,rowIx,ColIx, store) {                        	
                        	if((rowIx!=0)&&!record.get("leaf") && isTNode(panel, nodeId, record)) return 'x-grid-center-icon';
    	                    return 'x-hide-display';
    	                },
    	                handler:function(grid,rowIndex,rowIndex,item,e,record,row){
    	                	var children = record.childNodes;							
							var kpiName = record.get("kpiName")+"("+children.length+")";
							for(var i = 0; i < children.length; i++){
								if(children[i].get("kpiName") == kpiName){
									Notification.showNotification("exists " + kpiName);
									return;
								}
							}
							var parent_id;
							if(record.raw.id == "gsb"){
								parent_id = '1';
							} else if(record.raw.id == "userDefined"){
								parent_id = '2';
							} else {
								parent_id = record.raw.id;
							}
    	                	var emptyNode = {
    	                		kpiName : kpiName,
    	                		description : '',
    	                		vendor	: '',
    	                		parent_id : parent_id,
    	                		expanded : true
    	                	};    	                	
    						var message = {};						
    						message.MODULE_TYPE = 'TRIGGERING_MODULE';
    						message.COMMAND = 'COMMAND_SAVE_KPI_FOLDER';
    						message.data = emptyNode;
    						cometdfn.request(message, function(data, Conf) {
    							var status = data.STATUS;
    							if (status === "success") {							
    								var rv = data.BUSINESS_DATA.rv;    								
    								if(rv == 0){
    									var id = data.BUSINESS_DATA.id;
    									record.appendChild(emptyNode);
    									var newRecord = children[children.length-1];
    									newRecord.raw.id = id;
    		    	                    var rowIndex = grid.getStore().indexOf(newRecord);
    		    		            	cellEditing.cancelEdit();
    		    		            	cellEditing.startEditByPosition({
    		    		        			row: rowIndex,
    		    		        			column: 0
    		    		        		});
    								} else {
    									Notification.showNotification("save fail");									
    								}
    							} else if (data.customException) {
    								alertError(data.customException);
    							}
    						});		    		            	
    	                }
                    }
                ]
            },{
                xtype: 'actioncolumn',                 
                align: 'center',
                width:20,                
                items: [
                   {

                   	icon: './styles/cmp/images/delete.png',                    	
                   	getClass: function(value,meta,record,rowIx,ColIx, store) {
                   		if(record.get("editable") != "false" && isTNode(panel, nodeId, record)) return 'x-grid-center-icon';
   	                    return 'x-hide-display';
   	                },
   	                handler:function(view,rowIndex,rowIndex,item,e,record,row){
   	                	Ext.MessageBox.confirm('','Delete?',function(btn){
   	        				if(btn=='yes'){
   	        					if(nodeId == "gsb"){
	   	    						var message = {};						
	   	    						message.MODULE_TYPE = 'TRIGGERING_MODULE';
	   	    						message.COMMAND = 'COMMAND_DELETE_KPI';
	   	    						message.id = record.raw.id;
	   	    						message.leaf = record.get("leaf");
	   	    						cometdfn.request(message, function(data, Conf) {
	   	    							var status = data.STATUS;
	   	    							if (status === "success") {							
	   	    								var rv = data.BUSINESS_DATA.rv;    								
	   	    								if(rv == 0){
	   	    									record.remove();
	   	    									Ext.getCmp("kpiGrid").reload();
	   	    								} else {
	   	    									Notification.showNotification("delete fail");									
	   	    								}
	   	    							} else if (data.customException) {
	   	    								alertError(data.customException);
	   	    							}
	   	    						});
   	        					} else if(nodeId == "userDefined"){
	   	    						var message = {};						
	   	    						message.MODULE_TYPE = 'KPI_DEFINE_MODULE';
	   	    						message.COMMAND = 'COMMAND_DELETE_KPI';
	   	    						message.id = record.raw.id;
	   	    						message.leaf = record.get("leaf");
	   	    						cometdfn.request(message, function(data, Conf) {
	   	    							var status = data.STATUS;
	   	    							if (status === "success") {							
	   	    								var rv = data.BUSINESS_DATA.rv;    								
	   	    								if(rv == 0){
	   	    									record.remove();	   	    									
	   	    								} else {
	   	    									Notification.showNotification("save fail");									
	   	    								}
	   	    							} else if (data.customException) {
	   	    								alertError(data.customException);
	   	    							}
	   	    						});   	        						
   	        					}
   	        				}
   	        			});
   	                }
                   
                   }
                ]
            }],
			//rootVisible : false,
			plugins : [cellEditing],
			listeners : {
				itemmouseenter : function(_this, record, item, index, e, eOpts ){
					panel.focusItem = record;
				},
				itemmouseleave : function(_this, record, item, index, e, eOpts ){
					panel.focusItem = null;
				},
				itemclick : function(_this, record, item, index, e, eOpts ){
					panel.clickItem = record;
					if(nodeId == "userDefined" && isTNode(panel, nodeId, record)){
						if(record.get("leaf") == true){
							var form = Ext.getCmp("kpiDetailPanel").getForm();
							form.setValues(record.raw);
							var editor = com.wiris.jsEditor.JsEditor.getInstance(document.getElementById('editorContainer'));
							if(record.raw.formula != ""){								
								//editor.setMathML(record.raw.formula);
								setMathMLFun(editor, record.raw.formula);
							}
						}
					}
				}
			}
		});
		
		if(nodeId == "userDefined"){
			panel.addDocked(Ext.create('Ext.toolbar.Toolbar',{
				width:200,
				items:[{
					xtype : 'button',
					text : 'Add Kpi',
					iconCls : 'icon-add',
					handler : function() {
						if(panel.clickItem && !panel.clickItem.isLeaf() && isTNode(panel, nodeId, panel.clickItem)){
							var children = panel.clickItem.childNodes;
							//var kpiFolderName = panel.clickItem.get("kpiName");
							//kpiFolderName = kpiFolderName.replace(/\s+/g, "");							
							var kpiName = "name"+children.length;																				
							for(var i = 0; i < children.length; i++){
								if(children[i].get("kpiName") == kpiName){
									Notification.showNotification("exists " + kpiName);
									return;
								}
							}
							var record = {				
									id : "",
									kpiName : kpiName,
									vendor : "",
									folder_id : panel.clickItem.get("id"),
									description : "",
									formula : "",
									leaf : true
								};
							panel.clickItem.appendChild(record);
							var form = Ext.getCmp("kpiDetailPanel").getForm();
							form.setValues(record);
							var editor = com.wiris.jsEditor.JsEditor.getInstance(document.getElementById('editorContainer'));
							setMathMLFun(editor, "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>");
							/*var obj = {
									folder_id : panel.clickItem.raw.id,									
									kpiName : kpiName									
								}
    						var message = {};						
    						message.MODULE_TYPE = 'KPI_DEFINE_MODULE';
    						message.COMMAND = 'COMMAND_SAVE_KPI';    						
    						message.data = obj;
    						cometdfn.request(message, function(data, Conf) {
    							var status = data.STATUS;
    							if (status === "success") {							
    								var rv = data.BUSINESS_DATA.rv;    								
    								if(rv == 0){
    									var rtnObjStr = data.BUSINESS_DATA.rtnObj;
    									var rtnObj = Ext.decode(rtnObjStr);	
										panel.getRootNode().cascadeBy(function(node){
											if(node.raw.id == rtnObj.folder_id){
												var record = {
														id : rtnObj.id,
														kpiName : rtnObj.kpiName,
														vendor : "",
														description : "",
														formula : "",
														leaf : true
													};
												node.appendChild(record);																																				
												var form = Ext.getCmp("kpiDetailPanel").getForm();
												form.setValues(record);
												var editor = com.wiris.jsEditor.JsEditor.getInstance(document.getElementById('editorContainer'));
												setMathMLFun(editor, "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>");
												return false;
											}											
										});
    								} else {
    									Notification.showNotification("save fail");									
    								}
    							} else if (data.customException) {
    								alertError(data.customException);
    							}
    						});*/
						}
					}
				}]
			}));
		}
		
		panel.on("render", function(_this, eOpts){
			var body = _this.body;
			var panelDropTarget = new Ext.dd.DropTarget(body, {
	            ddGroup: 'gsbTree',
	            notifyEnter: function(ddSource, e, data) {
	                //Add some flare to invite drop.
	                body.stopAnimation();
	                body.highlight();
	            },
	            notifyDrop: function(ddSource, e, data) {
	                var selectedRecords = ddSource.dragData.records;
	                var valid = validateDrop(panel.focusItem);
	                if(panel.focusItem && panel.focusItem.get("leaf") == false && valid){    					
						var message = {};						
						message.MODULE_TYPE = 'TRIGGERING_MODULE';
						message.COMMAND = 'COMMAND_SAVE_KPI';						
						var datas = new Array();
						for(var i = 0; i < selectedRecords.length; i++){
							var selectedRecord = selectedRecords[i];
							var obj = {
								folder_id : panel.focusItem.raw.id,
								kpi_id : selectedRecord.get("id"),
								kpiName : selectedRecord.get("kpiName"),
								vendor	: selectedRecord.get("vendor")
							}
							datas.push(obj);
						}
						message.datas = datas;
						cometdfn.request(message, function(data, Conf) {
							var status = data.STATUS;
							if (status === "success") {							
								var rv = data.BUSINESS_DATA.rv;    								
								if(rv == 0){
									var rtnListStr = data.BUSINESS_DATA.rtnList;
									var rtnList = Ext.decode(rtnListStr);									
									if(rtnList && rtnList.length > 0){
										var folder_id = rtnList[0].folder_id;	
										panel.getRootNode().cascadeBy(function(node){
											if(node.raw.id == folder_id){
												for(var i = 0; i < rtnList.length; i++){
													node.appendChild(rtnList[i]);
												}
												return false;
											}											
										});
					                	// Delete record from the source store.  not really required.
										for(var i = 0; i < selectedRecords.length; i++){
											ddSource.view.store.remove(selectedRecords[i]);
										}
									}
								} else {
									Notification.showNotification("save fail");											
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});
												
						return true;
	                } else {
	                	return false;
	                }	                
	            }
	        });
		});
		
		return panel;
	}
	
	function validateDrop(record){
		if(record.get("editable") == "false"){
			return false;
		}
		var obj = {
			rtnVal : false
		};
		iterNode(record, obj);
		return obj.rtnVal;
	}
	
	function isTNode(panel, nodeId, record){
		var rootNode;
		if(nodeId == "gsb"){
			rootNode = panel.getRootNode().childNodes[0];
		} else {
			rootNode = panel.getRootNode().childNodes[1];
		}
		if(rootNode == record || record.isAncestor(rootNode)){
			return true;
		} else {
			return false;
		}
	}
	
	function iterNode(record, obj){
		if(record.get("kpiName") == "Source KPIs"){
			obj.rtnVal = true;
		}
		if(record.parentNode != null){
			iterNode(record.parentNode, obj);
		}
	}
	
	function loadPanelData(panel, params) {
		var message = {
				MODULE_TYPE : 'TRIGGERING_MODULE',
				COMMAND : 'GSB_KPI_TREE'					
			};
		if(params){
			message.params = params;
		}
		cometdfn.request(message, function(data, Conf) {
					var status = data.STATUS;
					if (status === "success") {
						var _data = data.BUSINESS_DATA.treeData;
						var datas = Ext.JSON.decode(_data);
						panel.setRootNode(datas);
					} else if (data.customException) {
						alertError(data.customException);
					}
				});
	}
})();