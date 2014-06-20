(function(){
	Ext.namespace('DigiCompass.Web.app.workFlow');
	//用于唯一标识focus workflowCategory ，拖拽时以便查找
	var focusedWorkflowItem ;
	DigiCompass.Web.app.workFlow.changeDataToTree = function(rootNode){
		if(rootNode.children){
			rootNode.expanded = true;
			for(var i = 0 ; i <rootNode.children.length ; i++){
				DigiCompass.Web.app.workFlow.changeDataToTree(rootNode.children[i]);
			}
		}
		else{
			rootNode.leaf = true;
		}
	}
	/**
	 * workflow入口，右边的listView回调
	 */
	DigiCompass.Web.app.workFlow.getList = function(data){
		cometdfn.publish({
			MODULE_TYPE : 'MOD_WORK_FLOW',
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST'
		});
		var fields = ['id', 'name','groupId','description','reference'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Service Category ',
						dataIndex : 'name',
						sortable : false,
						flex : 1
					}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		DigiCompass.Web.app.workFlow.cleanData();
		if (Ext.getCmp('workFlowGroupListView')) {
			Ext.getCmp('workFlowGroupListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				fields:fields,
				width:'fit',
				height:735,
				data:[],
				listeners : {
					itemclick : DigiCompass.Web.app.workFlow.clickFunction
				}
			});
			objectExplorer.on('checkchange', function(node, checked) {      
				objectExplorer.checkchild(node,checked);  
				objectExplorer.checkparent(node);  
	    	}); 
			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
				width:'fit',
				height:722,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'workFlowGroupListView',
				module:'MOD_WORK_FLOW',
				command:'COMMAND_QUERY_LIST',
				otherParam:{},
				layout:'border',
				width:50,
				region:'west',
				height:530,
				objectExplorer:objectExplorer,
				catalogue:catalogue,
				hidden:true
			});
			mainPanel.reconfigData(datas);
			
			var objExpPanel = Ext.getCmp('obj-exp');
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}
			var cataloguePanel = Ext.getCmp('obj-cat');
			if (cataloguePanel) {
				// 移除组建
				cataloguePanel.removeAll();
			}
			function getTbar(){
				return Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							// 展示右边面板
							DigiCompass.Web.UI.Wheel.showDetail();
							// 创建自己的Panel
							if(!Ext.getCmp('workFlowAdd')){
								var formPanel = DigiCompass.Web.app.workFlow.addFormPanel(null);
								// 将Panel添加在右边Panel上
								Ext.getCmp('obj-details').removeAll();
								Ext.getCmp('obj-details').add(formPanel);
								//设置DragDropTarget，控制拖拽
								DigiCompass.Web.app.workFlow.setDropTarget('workFlowItemTree');
							}
							var group = Ext.getCmp('categoryTypeGroup');
							if(group){
								group.setReadOnly(false);
							}
							DigiCompass.Web.app.workFlow.cleanData();
							//设置panel title
							UiFunction.setTitle('workFlowAdd', 'Service Category');
							//DigiCompass.Web.app.finacialCategoryType.cleanFormData();

						}
					}, {
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							var checkeds = new Array();
							var selected = objectExplorer.getChecked();
							for(var i = 0 ; i <selected.length ; i++){
								checkeds.push(selected[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
							} else {
								DigiCompass.Web.app.workFlow.delChecked(checkeds);
							}
						}
					}]
				});
			}
			objectExplorer.addDocked(getTbar());
			objExpPanel.add(objectExplorer);
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
		}
	}
	//左边listView点击事件处理
	DigiCompass.Web.app.workFlow.clickFunction = function(grid, record, rowEl){
		/**
		 * 判断是点击checkbox，还是点击ListView Item
		 */
		 var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		 if(isChecked){
			 return;
		 }
		 if(Ext.isEmpty(record.data.id)){
			 return;
		 } 
		 if(!Ext.getCmp('workFlowAdd')){
			 var form = DigiCompass.Web.app.workFlow.addFormPanel(null); 
			 Ext.getCmp('obj-details').removeAll();
			 Ext.getCmp('obj-details').add(form);
			 DigiCompass.Web.app.workFlow.setDropTarget('workFlowItemTree');
		 }
		 Ext.getCmp('workFlowAdd').getForm().setValues(record.data);
		 var group = Ext.getCmp('categoryTypeGroup');
		 group.setValue(record.data.groupId);
		 if(record.data.reference>0){
			 group.setReadOnly(true);
		 }
		 else{
			 group.setReadOnly(false);
		 }
		 UiFunction.setTitle('workFlowAdd', 'Service Category', record.data.name);
		 /**
		  * 请求Object — detail数据
		  */
		 cometdfn.publish({
			 MODULE_TYPE : 'MOD_WORK_FLOW',
			 COMMAND : 'COMMAND_QUERY_TREE',
			 id : record.data.id
		 });
	 }
	/**
	 * 递归修改父级结点数据 'opex'或者'capex'
	 */
	function changeParentNodeValue(node , dataIndex){
		var parentNode = node.parentNode;
		if(parentNode){
			var _childNodes = parentNode.childNodes;
			var data = 0;
			for(var i = 0 ; i < _childNodes.length ; i++){
				var _data = _childNodes[i].data[dataIndex];
				if(!Ext.isEmpty(_data)){
					data = data + _data;
				}
			}
			parentNode.data[dataIndex] = data;
			parentNode.commit();
			if(parentNode.parentNode){
				changeParentNodeValue(parentNode , dataIndex)
			}
		}
	}
	DigiCompass.Web.app.workFlow.setFocused = function(node){
		//控制leaf节点页面展示，如：'sow'展示与隐藏
		DigiCompass.Web.app.workFlow.leafNodeViewControl(node.isLeaf(),'workFlowSowTree');
		//记录当前获取焦点的树节点，以便store Update时使用
		DigiCompass.Web.app.workFlow.focusedNode = node;
		var gridData = [];
		if(node.raw.property){
			gridData = node.raw.property;
		}
		Ext.getCmp('workFLowPropertyGrid').getStore().loadData(gridData);
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
		var store = Ext.getCmp('workFlowSowTree').getStore();
		var flag = DigiCompass.Web.app.workFlow.validateEditing(node.raw.reference);
		//控制actionColumn的显示与隐藏
		DigiCompass.Web.app.workFlow.setActionColumnEditable(flag,'workFlowSowTree');
		store.setRootNode(rootNode);
	}
	/**
	 * 画 object - detail 页面
	 */
	DigiCompass.Web.app.workFlow.addFormPanel = function(id){
		var store = Ext.create('Ext.data.TreeStore', {
	    	fields: [ 'name', 'level', 'property','typeId','currentId' ],
	        root: {
	        },
	        folderSort: true
	    });
	    var categoryTree = Ext.create('Ext.tree.Panel', {
	        title : 'Service Category',
	        id : 'categoryTypeTree',
	        margin : '0px 5px 5px 10px',
	        width: 260,
	        region : 'west',
	        autoScroll  : true,
	        collapsible: true,
			viewConfig: {
	            plugins: {
	                ddGroup: 'workflowDragDropGroup',
	                ptype: 'gridviewdragdrop',
	                enableDrop: false
	            }
	        },
	        rootVisible: false,
	        store: store,
	        //the 'columns' property is now 'headers'
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 2,
	            sortable: false,
	            dataIndex: 'name'
	        }]
	    });
	
	    var itemStore = Ext.create('Ext.data.TreeStore', {
	    	fields: ['name','typeId','capex','opex'],
	        root: {	
	        	name : 'Workflow',
                iconCls : 'task-folder',
                expanded : true
            },
	        folderSort : false,
	        listeners : {
	        	update : function( me, record, operation, changeItem){
	        		me.suspendEvents();
	        		if(changeItem[0] == 'opex' || changeItem[0] == 'capex'){
	        			record.commit();
	        			changeParentNodeValue(record, changeItem[0]);
	        		}
	        		me.resumeEvents();
	        		var name = me.getRootNode().data.name;
	        		DigiCompass.Web.app.financialCategory.setNameFieldValue('workFLowName', name);
	        	}
	        }
	    });
	    var cellEditing1 = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners : {
        		beforeedit: function (me, e) {
        			var record = DigiCompass.Web.app.workFlow.getFocusedNode();
        			return DigiCompass.Web.app.workFlow.validateEditing(record.raw.reference);
        		}
			}
		});
	    var cellEditing2 = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
        	listeners : {
        		beforeedit: function (me, e) {
        			return e.record.isLeaf() && (e.record.raw.reference == 0 || Ext.isEmpty(e.record.raw.reference)) || e.colIdx == 0 && !e.record.isLeaf() ;
        		}
        	}
		});
	    
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
	    var workFlowTree = Ext.create('Ext.tree.Panel', {
	    	id 			: 'workFlowItemTree',
	        title       : 'Item',
	        autoScroll  : true,
	        width       : 400,
	        selType     : 'cellmodel',
	        region      : 'west',
	        margin      : '0px 5px 5px 5px',
	        plugins     : [cellEditing2],
	        rootVisible : true,
	        tbar : [{
	        	xtype   : 'button',
	        	text    : 'Show Tree',
	        	handler : function(){
	        		var tree = Ext.getCmp('workFlowItemTree').getRootNode();
	        		var data = DigiCompass.Web.TreeUtil.getTreeData(tree);
	        		//通过data画workflowCategory d3 效果 tree
	        		DigiCompass.Web.app.planningModelTree.showTree(data , 'workFlowItemD3Tree', 'Service Category Tree');
	        	}
	        },{
				xtype : 'button',
				text : 'export',
				handler : function(){
					Ext.MessageBox.confirm('Confirm', 'Do you want export Service Category Items with SOW?', function(btn){			
						if('cancel' == btn){
							return;
						}
						var workFlowId = Ext.getCmp("workFlowId").getValue();
						var title = Ext.getCmp("workFLowName").getValue();
						if(workFlowId){
		    				var data = {
		    					workFlowId : workFlowId,
		    					enableSow : btn,
		    					MODULE_TYPE : "MOD_WORK_FLOW",
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
				text : 'import',
				handler : function(){			
				    
	            	var win = new Ext.Window(
	            		    {
	            		        layout: 'fit',
	            		        width: 500,
	            		        height: 300,
	            		        modal: true,
	            		        closeAction: 'destroy',
	            		        items: new Ext.form.Panel(
	            		        {	            	
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
	            		                	       var groupId = Ext.getCmp('categoryTypeGroup').getValue();
		            		                       form.submit({
		            		                           url: 'upload',
		            		                           params: {
		            		                        	   groupId : groupId,
		            		                        	   enableSow : btn,
		            		                        	   MODULE_TYPE : "MOD_WORK_FLOW",
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
		            		                    		var name = 'root';
		            		                    		var field = Ext.getCmp('workFLowName');
		            		                    		if(field){
		            		                    			name = field.getValue();
		            		                    		}
		            		                    		var root = {
		            		                    				name:name,
		            		                    				children : child,
		            		                    				expanded : true
		            		                    				};
		            		                    		Ext.getCmp('workFlowItemTree').setRootNode(root);
		            		                      		win.close();
		            		                        	   //msg('Success', 'Processed file on the server', false);	            		                        	   	            		                        	   
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
	            		        })
	            		    });
	            	win.show();
					}
			}],
	        store: itemStore,
	        //the 'columns' property is now 'headers'
	        columns: [{
	            xtype	  : 'treecolumn', //this is so we know which column will show the tree
	            text	  : 'Name',
	            flex	  : 4,
	            sortable  : false,
	            dataIndex : 'name',
	            editor:{
	            	maxLength  : UiProperties.nameMaxLength ,
	            	allowBlank : false
	            }
	        },{
	        	 text	  : 'Capex',
	             flex	  : 3,
	             sortable  : false,
	             dataIndex : 'capex',
	             xtype: 'numbercolumn',
	             format    : '0,000.00',
	             editor:{
					 xtype:'numberfield',
					 minValue : 0,
	            	 maxLength  : UiProperties.nameMaxLength 
	             }
	        },{
	        	 	text	  : 'Opex',
		            flex	  : 3,
		            sortable  : false,
		            dataIndex : 'opex',
		            xtype: 'numbercolumn',
		            format    : '0,000.00',
		            editor:{
		            	minValue : 0,
						xtype:'numberfield',
		            	maxLength  : UiProperties.nameMaxLength
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
			            	if(record.isRoot() || record.raw.reference > 0){
			            		return;
			            	}
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
		                	var root = Ext.getCmp('categoryTypeTree').getRootNode();
			            	if(record.isRoot()){
			            		if(root.childNodes.length > 0){
			            			record.appendChild(Ext.clone(root.childNodes[0].raw));
			            		}
			            	}else{
				            	var childNode;
				            	for(var i = 0 ; i< root.childNodes.length ; i++){
				            		if(root.childNodes[i].data.typeId == record.data.typeId){
				            			childNode = root.childNodes[i + 1];
				            			break;
				            		}
				            	}
				            	record.appendChild(Ext.clone(childNode.raw));
			            	}
			            	var children = record.childNodes;
			            	var rowIndex = grid.getStore().indexOf(children[children.length-1]);
			            	cellEditing2.cancelEdit();
			            	cellEditing2.startEditByPosition({
			        			row: rowIndex,
			        			column: 0
			        		});
			            	DigiCompass.Web.app.workFlow.setFocused(children[children.length - 1]);
		                }
	            }]
			}],
	        listeners : {
	        	cellclick : function(grid, cellHtml, colIndex, node , rowHtml, rowIndex){
	        		if(colIndex == 3){
	        			return;
	        		}
	        		DigiCompass.Web.app.workFlow.setFocused(node);
	        	},
	        	/**
	        	 * mouseenter显示actionColumn 图标
	        	 */
				itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
					focusedWorkflowItem = record;
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
				},
				/**
				 * mouseleave隐藏actionColumn图标
				 */
				itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
					focusedWorkflowItem = null;
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
				}
	        }
	    });
	    
	var propertyStore = Ext.create('Ext.data.JsonStore', {
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
	 });
	
	 var sowStore = Ext.create('Ext.data.TreeStore', {
	    	fields: [{ name : 'name' , type: 'string' },
	    	         { name : 'description' , type : 'string' },
	    	         { name : 'requirement'},
	    	         { name : 'itemNo' , type : 'string' }],
	        root: {	name:'SOW',
	                iconCls:'task-folder',
	                leaf : true,
	                expanded: true
	        },
	        folderSort: true,
		    listeners:{
				update:function(store){
					DigiCompass.Web.app.workFlow.changeItemTree(store);
				}
			}
	    });
	var sowTree = Ext.create('Ext.tree.Panel', {
		id 			: 'workFlowSowTree',
	    title		: 'Workflow SOW',
	    width 		: 'fill',
	    region 		: 'center',
		plugins 	: [cellEditing1],
		selType     : 'cellmodel',
	    margin 		: '0px 0px 0px 0px',
	    collapsible : true,
	    autoScroll  : true,
	    rootVisible : true,
	    store		: sowStore,
	    columns: [{
	        xtype: 'treecolumn', //this is so we know which column will show the tree
	        text: 'Name',
	        flex: 3,
	        sortable: false,
	        dataIndex: 'name',
			editor : {
				allowBlank : false ,
				maxLength  : UiProperties.nameMaxLength  ,
				listeners  : DigiCompass.Web.app.workFlow.getListeners()
			}
	    },{
	    	text	  : 'Description',
	        flex	  : 3,
	        sortable  : false,
	        dataIndex : 'description',
			editor    : {
				allowBlank : false,
				maxLength  : UiProperties.descMaxLength  ,
				listeners  : DigiCompass.Web.app.workFlow.getListeners()
			}
	    },{
	    	text	  : 'Requirement',
	        flex	  : 3,
	        sortable  : false,
	        dataIndex : 'requirement',
	        renderer  : function(value, metaData, record){
	        	var name = '';
	        	if(!Ext.isEmpty(value) && !Ext.isEmpty(value.name)){
	        		name = value.name + ' ('+value.type+')';
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
	                    record.set('requirement', null);
	                    record.appendChild({
	                    	leaf : true,
	                    	name : 'newNode',
	                    	requirement : null//{name: ''}
	                    });
	                    var children = record.childNodes;
	                    var rowIndex = grid.getStore().indexOf(children[children.length-1]);
		            	cellEditing1.cancelEdit();
		            	cellEditing1.startEditByPosition({
		        			row: rowIndex,
		        			column: 0
		        		});
	                }
            	},{
	                icon: './styles/cmp/images/delete.png',  
	                scope: this,
	                getClass: function(value,meta,record,rowIx,colIx, store) {            
	                    return 'x-hide-display';  //Hide the action icon
	                },
	                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
	                	if(record.isRoot()){
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
	    tbar : [
				{
					xtype : 'button',
					text : 'export',
					handler : function(){
		        		var store = Ext.getCmp('workFlowSowTree').getStore();
		        		var rootNode = store.getRootNode();		
		        		var sowTreeData = { name : rootNode.data.name , 
		   					 description : rootNode.data.description,
		   					 requirement : rootNode.data.requirement };
		        		sowTreeData.children = DigiCompass.Web.app.workFlow.getTreeDataByNode(rootNode.childNodes);
		        		var focusNode =  DigiCompass.Web.app.workFlow.focusedNode;
						var data = {
							sowTree : JSON.stringify(sowTreeData),
							MODULE_TYPE : "MOD_WORK_FLOW",  
							COMMAND : "COMMAND_EXPORT_SOW",
							title : focusNode.get("name")						
			        	};
			        	var str = context.param(data);
			        	window.location.href = "download?"+str;						
					}
				},{
					xtype : 'button',
					text : 'import',
					handler : function(){			
					    
				    	var win = new Ext.Window(
				    		    {
				    		        layout: 'fit',
				    		        width: 500,
				    		        height: 300,
				    		        modal: true,
				    		        closeAction: 'destroy',
				    		        items: new Ext.form.Panel(
				    		        {	            	
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
				        		                        	   MODULE_TYPE : "MOD_WORK_FLOW",
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
				        		        	    			}
				        		        	        		DigiCompass.Web.app.workFlow.changeDataToTree(rootNode);
				        		        	        		var store = Ext.getCmp('workFlowSowTree').getStore();
				        		        	        		store.setRootNode(rootNode);
				        		        	        		DigiCompass.Web.app.workFlow.changeItemTree(store);
				        		                      		win.close();
				        		                        	   //msg('Success', 'Processed file on the server', false);	            		                        	   	            		                        	   
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
				    		        })
				    		    });
				    	win.show();
						}
				},{
					xtype   : 'button',
					text    : 'Show Chart',
					handler : function(){
						var tree = Ext.getCmp('workFlowSowTree').getRootNode();
		        		var data = DigiCompass.Web.TreeUtil.getTreeData(tree);
		        		DigiCompass.Web.app.planningModelTree.showChart(data , 'workFlowItemD3Chart', 'Sow Tree');
					}
				}
	    ],
		listeners : {
			cellclick : function(grid, cellElement, columnNum, record, rowElement, rowNum, e) {
				var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
				if(dataIndex != 'requirement' || !record.isLeaf()){
					return;
				}
				var selecteds = Ext.getCmp('workFlowItemTree').getSelectionModel().getSelection();
				DigiCompass.Web.app.workFlow.cellEditingFocusNode =selecteds[0];
				DigiCompass.Web.app.workFlow.showSowRequirementWindow(record);
			},
			itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
				DigiCompass.Web.app.financialCategory.showActionImg(record, item, true , true);
			},
			itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
				DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
			}
		}
	});
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit : 1
	});
	var propertyForm = Ext.create('Ext.form.Panel' ,{
		id: 'workFlowPropertyForm',
		width  : 500,
	    region : 'center',
	    layout : 'border',
	    margin : '0px 5px 5px 5px',
	    defaultType : 'textfield',
	    fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'side',
			labelWidth : 70	
		},
	    items:[{
	    	id 			: 'workFLowPropertyGrid',
			title 		: 'Item Properties',
			width 		: 'fill',
			collapsible : true,
			autoScroll  : true,
			region 		: 'north',
			height 		: 319,
			xtype		: 'grid',
			selType 	: 'cellmodel',
			plugins 	: [cellEditing],
			store		: propertyStore,
			columns		: [{
				header 	  : 'Name',
				dataIndex : 'name',
				flex      : 1
			},{
				header    : 'Value',
				dataIndex : 'value',
				flex      : 1,
				editor    : {
					allowBlank : false,
					maxLength  : UiProperties.stringValueMaxLength,
					listeners  : DigiCompass.Web.app.workFlow.getListeners()
				}
			}]
	    }, sowTree]
	})
	var formPanel = Ext.create('Ext.form.Panel', {
		id : 'workFlowAdd',
		defaultType : 'textfield',
		title : UiFunction.getTitle('Service Category'),
		border : false,
		width : '100%',
		frame : false,
		height : 155,
		fieldDefaults : {
			labelAlign : 'left',
			msgTarget : 'side',
			labelWidth : 200	
		},
		tbar:[{
			xtype : 'button',
			text : 'save',
			iconCls : 'icon-save',
			handler : function(){
				var nameField = Ext.getCmp('workFLowName');
				if(!nameField.isValid()){
					return;
				}
				var _formData = formPanel.getForm().getValues();
				var formData = { 
						id : _formData.id,
						name : _formData.name,
						reference : _formData.reference,
						description : _formData.description,
						groupId : Ext.getCmp('categoryTypeGroup').getValue()
					};
				var gridData = DigiCompass.Web.app.workFlow.getTreeData('workFlowItemTree');
				if(!gridData){
					return;
				}
				formData.treeData = gridData;
				formData.MODULE_TYPE = 'MOD_WORK_FLOW';
				formData.COMMAND = 'COMMAND_SAVE';
				cometdfn.publish(formData);
			}
		}],
		items : [{
					id : 'workFlowId',
					xtype : 'hidden',
					name : 'id'
				},{
					id : 'workFlowReference',
					xtype : 'hidden',
					name : 'reference'
				},{
					id : 'workFLowName',
					margin : '10px 5px 10px 10px',
					allowBlank : false,
					emptyText  : 'Please input data!',
					fieldLabel : 'Name ',
					maxLength  : UiProperties.nameMaxLength,
					width	   : 800,
					msgTarget  : 'side',
					name 	   : 'name',
					listeners:{
						change : function(field, newValue, oldValue){
							DigiCompass.Web.app.financialCategory.rootNodeName('workFlowItemTree',newValue);
						}
					}
				},{
					id 		   : 'workFlowDes',
					margin     : '10px 5px 10px 10px',
					emptyText  : 'Please input data!',
					fieldLabel : 'Description ',
					maxLength  : UiProperties.descMaxLength,
					width	   : 800,
					msgTarget  : 'side',
					name 	   : 'description'
				},{
					id			 : 'categoryTypeGroup',
					margin 	     : '10px 5px 10px 10px',
					xtype	     : 'combo',
					fieldLabel   : 'Service Category Settings',
					allowBlank   : false,
					width 	     : 800,
					displayField : 'name',
					valueField   : 'id',
					editable     : false,
					store        : {
						fields : ['id','name'],
						data   : DigiCompass.Web.app.workFlow.comboData
					},
					listeners : {
						change : function(){
							if(Ext.isEmpty(this.value)){
								return;
							}
							cometdfn.publish({
								MODULE_TYPE : 'MOD_WORK_FLOW',
								COMMAND : 'COMMAND_QUERY_ALL_TREE',
								id : this.value
							});
							
						}
					}
				}]
		});
		var panel = Ext.create('Ext.panel.Panel',{
			layout:'vbox',
			items :[
			        formPanel, {
				width  :'100%',
				flex   : 5,
				xtype  :'container',
				layout :'border',
				items:[ categoryTree,
				        workFlowTree,
				        propertyForm
				      ]
			}]
		});
		return panel;
	}
	DigiCompass.Web.app.workFlow.loadComboData = function(data){
		var comboData = data.BUSINESS_DATA.comboList;
		DigiCompass.Web.app.workFlow.comboData = Ext.decode(comboData);
	}
	DigiCompass.Web.app.workFlow.loadCategoryData = function(data){
		var categoryTypeTree = Ext.getCmp('categoryTypeTree');
		if(categoryTypeTree){
			var treeData = data.BUSINESS_DATA.tree;
			treeData = Ext.decode(treeData);
			categoryTypeTree.setRootNode(treeData);
		}
	}
	DigiCompass.Web.app.workFlow.changeItemGrid = function(store , focusedNode){
		if(Ext.isEmpty(focusedNode)){
			return;
		}
		var data = [];
		for(var i = 0 ; i<store.getCount() ; i++){
			data.push(store.getAt(i).data);
		}
		focusedNode.raw.property = data;
	}	
	DigiCompass.Web.app.workFlow.getTreeDataByNode = function(childNodes){
		var dataArr = [];
		for(var i = 0 ; i < childNodes.length ; i++){
			var data = { name : childNodes[i].data.name ,
						 id : childNodes[i].data.id,
						 description : childNodes[i].data.description,
						 requirement : childNodes[i].data.requirement };
			if(!Ext.isEmpty(childNodes[i].childNodes))
				data.children = DigiCompass.Web.app.workFlow.getTreeDataByNode(childNodes[i].childNodes);
			dataArr.push(data);
		}
		return dataArr;
	}
	DigiCompass.Web.app.workFlow.changeItemTree = function(store){
		var focusedNode = DigiCompass.Web.app.workFlow.getFocusedNode();
		if(Ext.isEmpty(focusedNode)){
			return;
		}
		var rootNode = store.getRootNode();
		var data = { name : rootNode.data.name , 
					 id : rootNode.data.id,
					 description : rootNode.data.description,
					 requirement : rootNode.data.requirement };
		data.children = DigiCompass.Web.app.workFlow.getTreeDataByNode(rootNode.childNodes);
		focusedNode.raw.sowTree = [data] ; 
	}
	DigiCompass.Web.app.workFlow.getFocusedNode = function(){
		var focus = DigiCompass.Web.app.workFlow.focusedNode;
		if(Ext.isEmpty(focus)){
			//Notification.showNotification('No TreeNode Selected!');
		}
		else{
			return focus;
		}
	}
	DigiCompass.Web.app.workFlow.getListeners = function(){
		return {
				focus :function(){
					var selecteds = Ext.getCmp('workFlowItemTree').getSelectionModel().getSelection();
					DigiCompass.Web.app.workFlow.cellEditingFocusNode =selecteds[0];
				}
		};
	}
	function checkPropertyRequire(property){
		for(var key in property){
			if(property[key].optional == false && Ext.isEmpty(property[key].value)){
				return property[key].name;
			}
		}
	}
	function getTreeData(childNodes){
		var datas = [];
		for(var i = 0 ; i<childNodes.length ; i++){
			var checkedFlag = checkPropertyRequire(childNodes[i].raw.property);
			if(checkedFlag){
				var errorMsg = DigiCompass.Web.app.workFlow.showErrorProperty(checkedFlag, childNodes[i].data.name );
				Notification.showNotification(errorMsg);
				return null;
			}
			var data = { typeId : childNodes[i].raw.typeId ,
						 currentId : childNodes[i].raw.currentId,
						 name : childNodes[i].data.name || childNodes[i].data.text,
						 property : childNodes[i].raw.property };
			if(childNodes[i].isLeaf()){
				data.sowTree = childNodes[i].raw.sowTree;
				var capex = childNodes[i].data.capex;
				var opex = childNodes[i].data.opex;
				if(Ext.isEmpty(capex)){
					capex = 0;
				}
				if(Ext.isEmpty(opex)){
					opex = 0;
				}
				data.capex = capex;
				data.opex = opex;
			}
			if(!childNodes[i].isLeaf() && childNodes[i].childNodes.length == 0){
				Notification.showNotification(childNodes[i].data.name + ' has no children !');
				return null;
			}
			if(childNodes[i].childNodes.length > 0){
				var childDatas = getTreeData(childNodes[i].childNodes);
				if(childDatas == null){
					return null;
				}
				data.children = childDatas;
			}
			datas.push(data);
		}
		return datas;
	}
	DigiCompass.Web.app.workFlow.getTreeData = function(id){
		var tree = Ext.getCmp(id);
		var data;
		if(tree){
			var root = tree.getRootNode();
			if(root.childNodes.length == 0){
				Notification.showNotification('Item is empty!');
				return null;
			}
			data = getTreeData(root.childNodes);
			if(data == null || data.length == 0){
				data = null;
			}
		}
		return data;
	}
	DigiCompass.Web.app.workFlow.leafNodeViewControl = function(flag,id){
		var sowTree = Ext.getCmp(id);
		if(sowTree){
			sowTree.setVisible(flag);
		}
	}
	DigiCompass.Web.app.workFlow.delChecked = function(checked){
		 var param = {
				 categoryGroupIds : checked
		 };
		 param.MODULE_TYPE = 'MOD_WORK_FLOW';
		 param.COMMAND = 'COMMAND_DEL';
		 cometdfn.publish(param);
	}
	DigiCompass.Web.app.workFlow.workFlowTree = function(message){
		var data = message.BUSINESS_DATA.categoryTree;
		var childData = Ext.decode(data);
		var child = [];
		var capex = 0;
		var opex = 0;
		for(var i = 0 ; i< childData.length ; i++){
			child.push(childData[i]);
			capex = capex + childData[i].capex ;
			opex = opex + childData[i].opex;
		}
		var name = 'root';
		var field = Ext.getCmp('workFLowName');
		if(field){
			name = field.getValue();
		}
		var root = {
				name:name,
				capex : capex ,
				opex : opex ,
				children : child,
				expanded : true
				};
		Ext.getCmp('workFlowItemTree').setRootNode(root);
	}
	DigiCompass.Web.app.workFlow.delSuccess = function(data){
		 if(data.STATUS == 'success'){
			Notification.showNotification('delete category group Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			//DigiCompass.Web.app.workFlow.cleanData();
			DigiCompass.Web.app.sitegroup.removeDetail();
			DigiCompass.Web.UI.CometdPublish.workFlowCategory(queryParam);
		} else if(data.customException){
			Notification.showNotification(data.customException);
		}
	}
	DigiCompass.Web.app.workFlow.saveSuccess = function(data){
		 if(data.STATUS == 'success'){
				Notification.showNotification('Save category group Successfully!');
				var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
				//DigiCompass.Web.app.workFlow.cleanData();
				DigiCompass.Web.app.sitegroup.removeDetail();
				DigiCompass.Web.UI.CometdPublish.workFlowCategory(queryParam);
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	DigiCompass.Web.app.workFlow.cleanFormData = function(){
		var form = Ext.getCmp('workFlowAdd');
		if(form){
			form.getForm().reset();
		}
	}
	DigiCompass.Web.app.workFlow.cleanCategoryTypeTreeData = function(){
		var workFlowItemTree = Ext.getCmp('workFlowItemTree');
		if(workFlowItemTree){
			workFlowItemTree.setRootNode({
				name : 'ServiceCategory' ,
				expanded : true
			});
		}
	}
	DigiCompass.Web.app.workFlow.cleanWorkFlowTreeData = function(){
		var categoryTypeTree = Ext.getCmp('categoryTypeTree');
		if(categoryTypeTree){
			categoryTypeTree.setRootNode({
			});
		}
	}
	DigiCompass.Web.app.workFlow.cleanWorkFlowPropertyTreeData = function(){
		var sowTree = Ext.getCmp('workFlowSowTree');
		if(sowTree){
			sowTree.setRootNode({
				name:'SOW',
                iconCls:'task-folder',
                leaf : true,
                expanded: true
            });
		}
		var propertyGrid = Ext.getCmp('workFLowPropertyGrid');
		if(propertyGrid){
			propertyGrid.getStore().loadData([]);
		}
	}
	
	DigiCompass.Web.app.workFlow.getReqGrid = function(columns, gridStore){
		var gridPanel = Ext.create('Ext.grid.Panel', {
			id : 'reqGridPanel',
		    title: 'Items',		    
		    columns: columns,
		    store : gridStore,
		    selType: 'cellmodel',
		    plugins: [
		        Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1
		        })
		    ]
		});
		return gridPanel;
	}
	
	DigiCompass.Web.app.workFlow.showSowRequirementWindow = function(requirement, callback, equipement){
		var name = '',
			type = '',
			fileExtension = '',
			regex = '',
			//requirement = record.data.requirement,
			focusNode = DigiCompass.Web.app.workFlow.getFocusedNode();
		if(Ext.isEmpty(requirement)){
			return;
		}		
		if(!Ext.isEmpty(requirement)){
			if(requirement && typeof requirement[0] != "undefined"){
				type = requirement[0].type;
			}
		}
		
		var reqWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			width  : 800,
			height : 600,
			modal : true,
			layout : 'fit',
			title  : 'Requirement',
			items  : [{
				xtype : 'form',
				id 			: 'reqForm',
				buttonAlign : 'center',
			    items:[{
			    		id : "reqTypeId",
						xtype	     : 'combo',
						//readOnly	 : !editable,
						fieldLabel   : 'Type ',
						displayField : 'name',
						valueField   : 'id',
						allowBlank   : false,
						editable     : false,						
						name		 : 'type',
						store        : {
							fields : ['id','name'],
							data   : [{id:'Text',name:'Text'},
							          {id:'Document',name:'Document'},
							          {id:'Equipment',name:'Equipment'},
							          {id : "List", name : "List"}]
						},
						listeners : {
							change : function(){
								var type = this.getValue();
								/*var name = Ext.getCmp('sowReqName');
								var regex = Ext.getCmp('sowRegex');
								var fileExtension = Ext.getCmp('sowFileExtension');
								var selId = Ext.getCmp('selectedId');
								if(!name){
									return;
								}
								if(type == 'Text'){
									if(regex)
										regex.setVisible(true);
									if(fileExtension)
										fileExtension.setVisible(false);
									if(selId){
										selId.setVisible(false);
									}
									documentGridPanel.setVisible(false);
									name.setVisible(true);
								}
								else if(type == 'Document'){
									if(fileExtension){
										fileExtension.setVisible(true);
									}									
									documentGridPanel.setVisible(true);
									name.setVisible(false);
									name.allowBlank = true;
									if(regex)
										regex.setVisible(false);
									if(selId){
										selId.setVisible(false);
									}
								}
								else{
									if(fileExtension)
										fileExtension.setVisible(false);
									if(regex)
										regex.setVisible(false);
									if(selId){
										selId.setVisible(true);
									}
									documentGridPanel.setVisible(false);
									name.setVisible(true);
								}*/
								var storeFileds = ["id",'name','ext', 'quantity'];
								if(type == "Equipment"){
									storeFileds.push("description");
								}
								var gridStore = new Ext.data.JsonStore({ 
								    fields: storeFileds,
								    data : [],
									listeners:{
										update : function(store){
											var last = store.getAt(store.getCount()-1).data;
											var flag = false;
											for(var i in last){
												if(i != 'quantity' && !Ext.isEmpty(last[i])){
													flag = true;
													break;
												}
											}
											var emptyData = [{name : null, fileext : null, quantity : 1}];
											if(flag){
												store.insert(store.getCount(), emptyData);
											}				
										}
									}
								});													
								if(requirement && typeof requirement[0] != "undefined" && requirement[0].type == type){
									gridStore.loadData(requirement);
								} else {
									gridStore.loadData([]);
								}
								var count  = gridStore.getCount();
								var flag = false;
								if(count == 0){
									flag = true;
								}else{
									var last = gridStore.getAt(gridStore.getCount()-1).data;						
									for(var i in last){
										if(!Ext.isEmpty(last[i])){
											flag = true;
											break;
										}
									}
								}
								if(flag){							
									gridStore.insert(gridStore.getCount(), {name : null, fileext : null, quantity : 1});
								}
								
								var columns = [];		
								if(type == "Text"){
									columns.push(
											        { text: 'Name', dataIndex: 'name', editor: {
										                xtype: 'textfield',
										                allowBlank: false
										            }});
									columns.push(
											        { text: 'Regex ', dataIndex: 'ext', editor: {
										                xtype: 'textfield',
										                allowBlank: false
										            }});
								} else if(type == "Document"){
									columns.push(
								        { text: 'Name', dataIndex: 'name', editor: {
							                xtype: 'textfield',
							                allowBlank: false
							            }});
									columns.push(
								        { text: 'File Extension', dataIndex: 'ext', editor: {
							                xtype: 'textfield',
							                allowBlank: false
							            }});
								} else if(type == "Equipment"){
									columns.push(
											        { text: 'Name', dataIndex: 'name'});
									columns.push(
											        { text: 'Quantity', dataIndex: 'quantity', editor: {
														xtype : "numberfield",
														minValue: 1,														
										                allowBlank: false
										            }});
									columns.push(
									        { text: 'Description', dataIndex: 'description'});
								} else if(type == "List"){
									columns.push(
									        { text: 'Name', dataIndex: 'name', editor: {
								                xtype: 'textfield',
								                allowBlank: false
								            }});
									columns.push(
									        { text: 'Value', dataIndex: 'ext', editor: {
								                xtype: 'textfield',
								                allowBlank: false
								            }});
								}
								columns.push({
							                menuDisabled: true,
							                sortable: false,
							                xtype: 'actioncolumn',
							                width: 50,
							                items: [{
							                    icon   : './styles/cmp/images/delete.png',  // Use a URL in the icon config
							                    tooltip: 'Remove',
							                    handler: function(grid, rowIndex, colIndex) {	                    	
							                    	gridStore.removeAt(rowIndex);	                        
							                    }
							                }]
							            });
								var reqForm = Ext.getCmp("reqForm");
								var reqGridPanel = Ext.getCmp("reqGridPanel");
								if(reqGridPanel){
									reqGridPanel.reconfigure(gridStore, columns);
								} else {
									var gridPanel = DigiCompass.Web.app.workFlow.getReqGrid(columns, gridStore);
									gridPanel.addListener("cellclick", function(self, td, cellIndex, record, tr, rowIndex, e, eOpts){
										var reqType = Ext.getCmp("reqTypeId").getValue();
										if(reqType == "Equipment"){
											if(cellIndex == 0){
												Ext.create('DigiCompass.Web.app.equipmentTemplateV2').derivedFormWin(function(id,name,description){
					                				record.set("name", name);
					                				record.set("ext", id);
					                				record.set("description", description);
					                			},true)
											}
										}
									});
									reqForm.add(gridPanel);
								}
							}
						}
					}/*,
					{
		                xtype: 'container',		                		                
		                layout: 'hbox',
		                items: [{
						xtype 	   : 'textfield',
						id  	   : 'sowReqName',
						hidden : true,
						readOnly   : !editable,
						fieldLabel : 'Name ',
						value 	   : name,
						maxLength  : UiProperties.nameMaxLength,
						msgTarget  : 'side',
						name 	   : 'name',
					},{
	                	id: 'selectedId',
	                	xtype: 'button',
	                	margin: '0 0 0 5px',
	                	text: 'Select',
	                	hidden : type == 'Equipment'? false : true,
	                	listeners: {
	                		click : function(c, e, eOpts) {
//								DigiCompass.Web.app.equipmentRelation.derivedFormWin(null, DigiCompass.Web.app.equipmentRelation.equipmentTemplateTreeClickFunction, function(){
//									var sels = Ext.getCmp('deriedFormPanelId').getSelectionModel().getSelection()
//									if(sels.length>0){
////										Ext.getCmp('sowReqName').setValue(DigiCompass.Web.app.equipmentRelation.svg.a.selectedItem.name);
//										Ext.getCmp('sowReqName').setValue(sels[0].get('name'));
//										Ext.getCmp('sowFileExtension').setValue(sels[0].get('currentId'));
//										Ext.getCmp('derivedFormWinId').hide();
//									}
//								});	
//								DigiCompass.Web.UI.CometdPublish.equipmentTemplateTreePublish();
	                			Ext.create('DigiCompass.Web.app.equipmentTemplateV2').derivedFormWin(function(id,name){
	                				Ext.getCmp('sowReqName').setValue(name);
	                				Ext.getCmp('sowFileExtension').setValue(id);
	                			})
	                		}
	                	}
	                }]},{
						xtype : 'textfield',
						id  : 'sowRegex',
						fieldLabel : 'Regex ',
						readOnly   : !editable,
						value 	   : regex,	 
						hidden     : type == 'Text'? false : true,
						maxLength  : UiProperties.nameMaxLength,
						msgTarget  : 'side',
						name 	   : 'regex',
					},{
						xtype 	   : 'textfield',
						readOnly   : !editable,
						emptyText  :  '.xls | .xlsx' ,
						id  	   : 'sowFileExtension',
						value 	   : fileExtension,
						hidden 	   : type == 'Document'?false : true,
						fieldLabel : 'File Extension ',
						maxLength  : UiProperties.nameMaxLength,
						msgTarget  : 'side',
						name 	   : 'fileExtension',
					}*/],
					buttons : [{
						xtype : 'button',
						text  : 'OK',
						width : 30,
						handler : function(){
							var form = Ext.getCmp('reqForm').getForm();
							var valid = form.isValid();
							if(!valid){
								return;
							}else{
								var datas = {};
								fields = form.getFields()
								fields.each(function(field){
									if(field.isVisible()){
										datas[field.name] = field.getValue();
									}
								});
								var regex= Ext.getCmp('sowRegex');
								var fileExtension = Ext.getCmp('sowFileExtension');
								if(regex && !Ext.isEmpty(regex.getValue())){
									datas.ext = regex.getValue();
								}
								if(fileExtension &&  !Ext.isEmpty(fileExtension.getValue())){
									datas.ext = fileExtension.getValue();
								}								
								var reqs = new Array();
								var store = Ext.getCmp("reqGridPanel").getStore();
								var valid = true;
								store.each(function(record){
									var reqname = record.get("name");
									var reqext = record.get("ext");
									if(reqname){
										var data = record.getData();
										data.type = datas.type;
										reqs.push(data);
										if(data.type == "Equipment"){
											if(record.get("quantity") == ""){
												valid = false;
												return false;
											}
										}
									}
								});								
								if(valid){
									callback(reqs);
									reqWin.close();
								} else {
									Notification.showNotification('Quantity is empty!');
								}
							}							
						}
					}]
			}],
			listeners : {				
		        beforeclose: function(win) {
		        	var gridPanel = win.down("gridpanel");
		        	if(gridPanel){
		        		gridPanel.getPlugin().cancelEdit();
		        	}
		        }		    
			}
		});
		if(type != ""){
			Ext.getCmp("reqTypeId").setValue(type);
		}
		reqWin.show();
	}
	DigiCompass.Web.app.workFlow.cleanData = function(){
		DigiCompass.Web.app.workFlow.cleanFormData();
		DigiCompass.Web.app.workFlow.cleanCategoryTypeTreeData();
		DigiCompass.Web.app.workFlow.cleanWorkFlowTreeData();
		DigiCompass.Web.app.workFlow.cleanWorkFlowPropertyTreeData();
	}
	DigiCompass.Web.app.workFlow.setActionColumnEditable = function(flag , id){
		var panel = Ext.getCmp(id);
		if(!panel){
			return;
		}
		var headers = panel.headerCt.items.items;
		for(var i = 0 ; i<headers.length ; i++){
			if(headers[i].xtype == 'actioncolumn'){
				headers[i].setVisible(flag);
			}
		}
	}
	DigiCompass.Web.app.workFlow.validateEditing = function(reference){
		if(!Ext.isEmpty(reference) && reference > 0 ){
			return false;
		}
		else{
			return true;
		}
	}
	DigiCompass.Web.app.workFlow.showErrorProperty = function(propertyName , categoryName){
		return propertyName + ' of Item \'' + categoryName + '\' must have a required property!';
	}
	function checkValidate(data , record){
		if(record.isRoot() && data.records[0].raw.level == 1){
			return true;
		}else{
			return data.records[0].raw.level == Number(record.raw.level) + 1;
		}
	}
	//控制CategoryType和Category拖拽
	DigiCompass.Web.app.workFlow.setDropTarget = function(id){
		var panel = Ext.getCmp(id);
		var el = panel.body.dom;
		var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', el , {
	        ddGroup: 'workflowDragDropGroup',
	        notifyEnter: function(ddSource, e, data,a,b,c,d) {
				var flag = false;
				if(focusedWorkflowItem){
					flag = checkValidate(data , focusedWorkflowItem);
				}
				return flag ? this.dropAllowed : this.dropNotAllowed ;
	        },
			notifyOver: function(ddSource, e, data) {
				var flag = false;
				if(focusedWorkflowItem){
					flag = checkValidate(data , focusedWorkflowItem);
				}
				return flag ? this.dropAllowed : this.dropNotAllowed ;
			},
			
	        notifyDrop  : function(ddSource, e, data){
				if(!focusedWorkflowItem){
					return false;
				}else{
					if(!checkValidate(data , focusedWorkflowItem)){
						return false;
					}
				}
	        	var sourceData = ddSource.dragData.records[0].raw;
	        	focusedWorkflowItem.appendChild(Ext.clone(sourceData));
	            return true;
	        }
	    });
	}
	//categoryGroupCombox数据
	DigiCompass.Web.app.workFlow.comboData = [];
})();