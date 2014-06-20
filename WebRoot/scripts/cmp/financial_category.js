(function(){
	Ext.namespace('DigiCompass.Web.app.financialCategory');
	//用于唯一标识focus FinancialCategory ，拖拽时以便查找
	var focusedFinancialItem ;
	DigiCompass.Web.app.financialCategory.technology = [];
	DigiCompass.Web.app.financialCategory.siteType = [];
	DigiCompass.Web.app.financialCategory.region = [];
	DigiCompass.Web.app.financialCategory.Polygon = [];
	DigiCompass.Web.app.financialCategory.state = [];
	
	DigiCompass.Web.app.financialCategoryType.technologyData = function(data){
		DigiCompass.Web.app.financialCategory.technology = Ext.decode(data.BUSINESS_DATA.comboList);
	}
	//TODO
	DigiCompass.Web.app.financialCategoryType.portfolioData = function(data){
		DigiCompass.Web.app.financialCategory.portfolio = Ext.decode(data.BUSINESS_DATA.comboList);
	}
	
	DigiCompass.Web.app.financialCategoryType.siteTypeData = function(data){
		DigiCompass.Web.app.financialCategory.siteType = Ext.decode(data.BUSINESS_DATA.comboList);
	}
	DigiCompass.Web.app.financialCategoryType.regionData = function(data){
		DigiCompass.Web.app.financialCategory.region = Ext.decode(data.BUSINESS_DATA.comboList);
	}
	DigiCompass.Web.app.financialCategoryType.polygonData = function(data){
		DigiCompass.Web.app.financialCategory.Polygon = Ext.decode(data.BUSINESS_DATA.comboList);
	}
	DigiCompass.Web.app.financialCategoryType.stateData = function(data){
		DigiCompass.Web.app.financialCategory.state = Ext.decode(data.BUSINESS_DATA.comboList);
	}
	function checkedLastRecordEmpty(costArray){
		var flag = true;
		var data = costArray[costArray.length - 1];
		if(data &&
				!data.siteType &&
    			!data.region &&
    			!data.polygon &&
    			!data.state &&
    			!data.template &&
    			!data.technology){
			flag = false;			
		}
		return flag;
	}
	DigiCompass.Web.app.financialCategory.workflowTemplate;
	DigiCompass.Web.app.financialCategory.insertWftData = function(data){
		data = {
				id : data.id,
				name : data.name,
				description : data.description,
				parentId : data.parentId,
				leaf : true,
				checked : false
			};
		DigiCompass.Web.app.financialCategory.workflowTemplate.push(data);
		if(Ext.getCmp('financialWftTree')){
			var root = Ext.getCmp('financialWftTree').getRootNode();
			var flag = true;
			root.cascadeBy(function(node){
				if(node.data.id == data.parentId){
					node.appendChild(Ext.clone(data));
					node.set('leaf',false);
					node.expand();
					flag = false;
				}
			});
			if(flag){
				root.appendChild(Ext.clone(data));
			}
		}
	}
	DigiCompass.Web.app.financialCategory.selectWorkflowTemplate = function(record,index){
		DigiCompass.Web.app.financialCategory.queryWftp();
		var treeData = DigiCompass.Web.app.financialCategory.workflowTemplate ;
			treeData = DigiCompass.Web.app.wftemp.getWorkflowTempTree(Ext.clone(treeData));
		var store = Ext.create('Ext.data.TreeStore', {
			fields: [{name: 'id',     type: 'string'},
			         {name: 'name',       type: 'string'},
			         {name: 'description',type: 'string'},
			         {name: 'parentId',type : 'string'}],
			root: {
			 	text : 'root',
	            expanded: true,
	            	children : treeData ? treeData : [] 
	        	},
	        folderSort: true
	     });
		 var tree = Ext.create('Ext.tree.Panel',{
			 id : 'financialWftTree',
			 width : 500,
			 height : 720,
			 region : 'west',
	         frame: true,
	         store: store,
	         columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 1,
	            dataIndex: 'name'
	        },{
	        	text: 'Description',
	            flex: 1,
	            dataIndex: 'description'
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
		 var win = Ext.getCmp('wftWindow');
		 if(win){
			 win.show();
		 }else{
			 win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			    title: 'Service Catalogue',
			    id : 'wftWindow',
			    modal : true,
			    height: 720,
			    width: 500,
			    layout : 'border',
			    items : [tree] ,
			    tbar : [{
			    	xtype : 'button',
			    	text : 'Finish',
			    	iconCls : 'icon-save',
			    	handler : function(){
			    		if(Ext.getCmp('wftWindow')){
			    			var checked = tree.getChecked();
			    			if(checked.length > 0){
			    				record.set(index,checked[0].data.id);
			    			}
			    			Ext.getCmp('wftWindow').close();
			    		}
			    	}
			    },{
		    		xtype : 'button',
		    		text : 'New',
		    		iconCls : 'icon-add',
		    		handler : function(){
		    			if(win.getWidth()<1280){
			    			win.setWidth(1280);
			    			tree.setWidth(300);
			    			var position = win.getPosition();
			    			position[0] = position[0] - (1280 -500)/2;
			    			win.setPosition(position);
		    			}
		    			var wftempDetailPanel = Ext.create('Ext.panel.Panel', {
		    				id : 'wftempDetailPanel',
		    				region : 'center',
		    				height : 720,
		    				// title:'Planned Site Detail',
		    				layout : 'vbox',
		    				autoScroll : true
		    			}); 
		    			var formPanel = DigiCompass.Web.app.wftemp.initForm(null , true);
		    			wftempDetailPanel.add(formPanel);
		    			win.add(wftempDetailPanel);
		    		}
		    	}]
		    }).show();
		 }
	}
	DigiCompass.Web.app.financialCategory.changeDataToTree = function(rootNode){
		if(rootNode.children){
			rootNode.expanded = true;
			for(var i = 0 ; i <rootNode.children.length ; i++){
				DigiCompass.Web.app.financialCategory.changeDataToTree(rootNode.children[i]);
			}
		}
		else{
			rootNode.leaf = true;
		}
	}
	DigiCompass.Web.app.financialCategory.getList = function(data){
		 cometdfn.publish({
			 MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			 COMMAND : 'COMMAND_QUERY_GRID'
		 });
		var fields = ['id', 'name','groupId','description','reference'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Financial Catalogue',
						dataIndex : 'name',
						//sortable : false,
						flex : 1
					}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		if (Ext.getCmp('financialCategoryGroupListView')) {
			Ext.getCmp('financialCategoryGroupListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				fields:fields,
				width:'fit',
				height:735,
				data:[],
				listeners : {
					itemclick : DigiCompass.Web.app.financialCategory.clickFunction
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
				id : 'financialCategoryGroupListView',
				module:'MOD_FINANCIAL_CATEGORY',
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
							var formPanel = DigiCompass.Web.app.financialCategory.addFormPanel(null);
							// 将Panel添加在右边Panel上
							Ext.getCmp('obj-details').removeAll();
							Ext.getCmp('obj-details').add(formPanel);
							DigiCompass.Web.app.financialCategory.setDropTarget('financialCategoryItemTree');
							var group = Ext.getCmp('categoryTypeGroup');
							if(group){
								group.setReadOnly(false); 
							}
							UiFunction.setTitle('financialCategoryAdd', 'Financial Catalogue');
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
								DigiCompass.Web.app.financialCategory.delChecked(checkeds);
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
	var selectedRecord = null;
	DigiCompass.Web.app.financialCategory.clickFunction = function(grid, record, rowEl){
		 var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		 if(isChecked){
			 return;
		 }
		 if(Ext.isEmpty(record.data.id)){
			 return;
		 } 
		 var form = DigiCompass.Web.app.financialCategory.addFormPanel(null); 
		 Ext.getCmp('obj-details').removeAll();
		 Ext.getCmp('obj-details').add(form);
		 DigiCompass.Web.app.financialCategory.setDropTarget('financialCategoryItemTree');
		 Ext.getCmp('financialCategoryAdd').getForm().setValues(record.data);
		 selectedRecord = record.data;
		 var group = Ext.getCmp('categoryTypeGroup');
		 group.setValue(record.data.groupId);
		 if(record.data.reference > 0){
			 group.setReadOnly(true); 
		 }else{
			 group.setReadOnly(false); 
		 }		
		 UiFunction.setTitle('financialCategoryAdd', 'Financial Catalogue', record.data.name);
		 cometdfn.publish({
			 MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			 COMMAND : 'COMMAND_QUERY_TREE',
			 id : record.data.id
		 });
	 }
	DigiCompass.Web.app.financialCategory.setFocused = function(node){
		/**
		 * control sow tree show or hidden
		 */
		DigiCompass.Web.app.workFlow.focusedNode = node;
		var gridData = [];
		if(node.raw.property){
			gridData = node.raw.property;
		}
		Ext.getCmp('financialCategoryPropertyGrid').getStore().loadData(gridData);
		
		if(node.raw.cost){
			/*if(checkedLastRecordEmpty(node.raw.cost)){
				node.raw.cost.push(DigiCompass.Web.app.financialCategory.costEmpData);
			}*/
			var datas = [];
			var costData =  node.raw.cost ;
			for(var i = 0 ; i< costData.length ; i++ ){
				var flag = false;
				for(var key in costData[i]){
					if(!Ext.isEmpty(costData[i][key])){
						flag = true;
					}
				}
				if(flag){
					datas.push(costData[i]);
				}
			}
			datas.push(DigiCompass.Web.app.financialCategory.costEmpData);
			Ext.getCmp('financialCostDistribution').getStore().loadData(datas);
		}
		else{
			Ext.getCmp('financialCostDistribution').getStore().loadData([DigiCompass.Web.app.financialCategory.costEmpData]);
		}
		/*if(!node.isLeaf()){
			Ext.getCmp('financialCostDistribution').setVisible(false);
		}
		else{
			Ext.getCmp('financialCostDistribution').setVisible(true);
		}*/
	}
	
	function processImportData(root, rootNode){
		if(root && rootNode){
			if(root.name == rootNode.get("name")){
				root.currentId = rootNode.raw.currentId;
			}
			if(root.children && rootNode.childNodes){
				for(var i = 0; i < root.children.length; i++){
					processImportData(root.children[i], rootNode.childNodes[i]);
				}
			}
		}
	}
	
	DigiCompass.Web.app.financialCategory.addFormPanel = function(id){
		var store = Ext.create('Ext.data.TreeStore', {
	    	fields: [ 'name', 'level', 'property','typeId' ],
	        root: {
	        },
	        folderSort: true
	    });
	    var categoryTree = Ext.create('Ext.tree.Panel', {
	        title : 'Financial Catalogue Hierarchy',
	        id : 'financialCategoryTypeTree',
	        //margin : '0px 2px 8px 6px',
	        //width: 300,
	        flex:1,
	        autoScroll  : true,
//	        height: 'fit',
	        region : 'west',
	        collapsible: true,
	        collapseDirection: 'left',
	        viewConfig: {
	            plugins: {
	                ddGroup: 'financialDragDropGroup',
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
	    	fields: ['name','typeId'],
	        root: {	
	        	name : 'Financial Catalogue',
                iconCls : 'task-folder',
                expanded : true
            },
	        folderSort : false,
	        listeners : {
	        	update : function(store){
	        		var name = store.getRootNode().data.name;
	        		DigiCompass.Web.app.financialCategory.setNameFieldValue('financialCategoryName', name)
	        	}
	        }
	    });
	    var cellEditing2 = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
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
	    
	    var financialCategoryTree = Ext.create('Ext.tree.Panel', {
	    	id : 'financialCategoryItemTree',
	        title: ' Financial Catalogue',
	        region : 'center',
	        //margin : '0px 2px 8px 2px',
	        //width: 300,
	        flex:1,
	        height: 'fit',
	        selType : 'cellmodel',
	        selModel : Ext.create("Ext.selection.RowModel"),
	        plugins : [cellEditing2],
	        rootVisible: true,
	        collapsible: true,
	        collapseDirection: 'left',
	        autoScroll  : true,
	        tbar : ['Search: ', ' ', searchField,{
	        	xtype   : 'button',
	        	text    : 'Tree View',
	        	handler : function(){
	        		var tree = Ext.getCmp('financialCategoryItemTree').getRootNode();
	        		var data = DigiCompass.Web.TreeUtil.getTreeData(tree);
	        		DigiCompass.Web.app.planningModelTree.showTree(data , 'financialCategoryD3tree','Financial Catalogue Tree');
	        	}
	        },{
				xtype : 'button',
				text : 'Export',
				handler : function(){
					var financialCategoryId = Ext.getCmp("financialCategoryId").getValue();
					var title = Ext.getCmp("financialCategoryName").getValue();
					if(financialCategoryId){
	    				var data = {
	    					financialCategoryId : financialCategoryId,
	    					MODULE_TYPE : "MOD_FINANCIAL_CATEGORY", 
	    					COMMAND : "COMMAND_EXPORT",
							title : 'Financial Catalogue_' + title						
		            	};
		            	var str = context.param(data);
		            	window.location.href = "download?"+str;
					}
				}
			},{
				xtype : 'button',
				text : ' Import',
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
	            		                	   var groupId = Ext.getCmp('categoryTypeGroup').getValue();
		            		                       form.submit({
		            		                           url: 'upload',
		            		                           params: {		            		                     
		            		                        	   groupId : groupId,
		            		                        	   MODULE_TYPE : "MOD_FINANCIAL_CATEGORY"
		            		                           },
		            		                           waitMsg: 'Uploading your file...',
		            		                           success: function(fp, o) {
		            		                       		var data = o.result.categoryTree;
		            		                    		var childData = Ext.decode(data);
		            		                    		var child = [];
		            		                    		for(var key in childData){
		            		                    			child.push(childData[key]);
		            		                    		}
		            		                    		var name = 'Financial Catalogue';
		            		                    		var field = Ext.getCmp('financialCategoryName');
		            		                    		if(field){
		            		                    			name = field.getValue();
		            		                    		}
		            		                    		var root = {
		            		                    				name:name,
		            		                    				children : child,
		            		                    				expanded : true
		            		                    				};
		            		                    		var trePanel = Ext.getCmp('financialCategoryItemTree');
		            		                    		processImportData(root, trePanel.getRootNode());
		            		                    		trePanel.setRootNode(root);
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
			}],
	        viewConfig: {
	            plugins: {
	                ptype: 'treeviewdragdrop',
	                appendOnly: true
	            },
	            listeners : {
	            	//data.records[0]源节点，目标节点 overModel
					beforedrop : function(node, data, overModel, dropPosition, dropHandler, eOpts) {
						var level = data.records[0].data.level;
						var depth = overModel.getDepth();
						if( depth != level - 1 ){
							return false;
						}
					}
	            }
	        },
	        store: itemStore,
	        //the 'columns' property is now 'headers'
	        columns: [{
	            xtype 	  : 'treecolumn', //this is so we know which column will show the tree
	            text	  : 'Name',
	            flex	  : 5,
	            sortable  : false,
	            dataIndex : 'name',
	            editor	  : {
	            	allowBlank : false,
					maxLength  : UiProperties.nameMaxLength
	            }
	        },{
				flex : 1,
				width: 40,
	            menuDisabled: true,
	            xtype: 'actioncolumn',
	            tooltip: 'delete',
	            align: 'center',
	            items: [{
	                icon: './styles/cmp/images/delete.png',  
	                scope: this,
	                getClass: function(value,meta,record,rowIx,colIx, store) {            
	                    return 'x-hide-display';  //Hide the action icon
	                },
	                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
		            	if(record.isRoot() || record.raw.reference > 0 ){
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
	                	var root = Ext.getCmp('financialCategoryTypeTree').getRootNode();
		            	if(record.isRoot()){
		            		if(root.childNodes.length > 0){
		            			record.appendChild(Ext.clone(root.childNodes[0].raw));
		            		}
		            	}
		            	else{
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
		            	DigiCompass.Web.app.financialCategory.setFocused(children[children.length - 1]);
		            }
	            }]
			}],
	        listeners : {
	        	cellclick : function(grid, cellHtml, colIndex, node , rowHtml, rowIndex){
	        		if(colIndex != 0){
	        			return;
	        		}
	        		DigiCompass.Web.app.financialCategory.setFocused(node);
	        	},
	            itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
	            	focusedFinancialItem = record;
	            	DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
	            },
	            itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
	            	focusedFinancialItem = null;
	            	DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
	            }        
	        }
	    });
	var propertyStore = Ext.create('Ext.data.JsonStore', {
	    fields: ['name','value','optional'],
	    data: [],
	    listeners:{
			update:function(store){
				var focus = DigiCompass.Web.app.financialCategory.cellEditingFocusNode;
				if(Ext.isEmpty(focus)){
					Notification.showNotification('Please select a record!');
					return;
				}
				DigiCompass.Web.app.financialCategory.changeItemGrid(store,focus);
			}
		}
	 });
	
	var costStore = Ext.create('Ext.data.JsonStore', {
	    fields: ['technology','siteType','region','polygon','state','template'],
	    data: [DigiCompass.Web.app.financialCategory.costEmpData],
	    listeners:{
			update:function(store){
				var last = store.getAt(store.getCount()-1).data;
				var flag = false;
				for(var i in last){
					if(!Ext.isEmpty(last[i])){
						flag = true;
						break;
					}
				}
				if(flag){
					store.insert(store.getCount(),DigiCompass.Web.app.financialCategory.costEmpData);
				}
				var focusedNode = DigiCompass.Web.app.financialCategory.cellEditingFocusNode;
				DigiCompass.Web.app.financialCategory.changeCostGrid(store , focusedNode)
			}
		}
	 });
	
	
	 var cellEditing1 = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit : 1
	});
	var propertyForm = Ext.create('Ext.form.Panel' ,{
		id: 'financialCategoryPropertyForm',
		collapsible: true,
		collapseDirection: 'right',
		region : 'east',
		layout : 'vbox',
	    //margin : '0px 5px 8px 2px',
	    defaultType : 'textfield',
	    flex:1,
	    fieldDefaults : {
			labelAlign : 'left',
			msgTarget : 'side',
			labelWidth : 70	
		},
	    items:[{
	    	id : 'financialCategoryPropertyGrid',
			width : '100%',
			flex : 1,
			title : 'Financial Catalogue Properties',
			collapsible: true,
			border: false,
			height : 300,
			xtype:'grid',
			selType : 'cellmodel',
			plugins : [cellEditing],
			store: propertyStore,
			columns:[{
				header : 'Name',
				dataIndex : 'name',
				flex : 1
			},{
				header : 'Value',
				dataIndex : 'value',
				flex : 1,
				editor : {
					allowBlank : false,
					maxLength  : UiProperties.stringValueMaxLength,
					listeners  : DigiCompass.Web.app.financialCategory.getListeners()
				}
			}]
	    },{
	    	id : 'financialCostDistribution',
			title : 'Financial Cost Distribution',
			hidden : true,
			border : 'false',
			width : '100%',
			xtype  : 'grid',
			collapsible: true,
			flex : 1,
			selType : 'cellmodel',
			plugins : [cellEditing1],
			store: costStore,
			columns:[{
				header    : 'Technology',
				dataIndex : 'technology',
				flex      : 1.5,
				editor    : {
					xtype		 : 'combo',
					displayField : 'name',
					valueField	 : 'id',
					editable	 : false,
					store		 : {
						fields : ['id','name'],
						data   : DigiCompass.Web.app.financialCategory.technology
					},
					listeners : DigiCompass.Web.app.financialCategory.getListeners()
				},
				renderer : function(value,metaData,record){
					var data = DigiCompass.Web.app.financialCategory.technology;
					for(var i=0 ; i<data.length ;i++){
						if( data[i].id == value){
							return data[i].name;
						}
					}
				}
			},{
				header : 'Site Type',
				dataIndex : 'siteType',
				flex : 1.5,
				editor : {
					xtype		 : 'combo',
					displayField : 'name',
					valueField	 : 'id',
					editable	 : false,
					store		 : {
						fields : ['id','name'],
						data   : DigiCompass.Web.app.financialCategory.siteType
					},
					listeners : DigiCompass.Web.app.financialCategory.getListeners()
				},
				renderer:function(value,metaData,record){
					var data = DigiCompass.Web.app.financialCategory.siteType;
					for(var i=0 ; i<data.length ;i++){
						if( data[i].id == value){
							return data[i].name;
						}
					}
				}
			},{
				header : 'Spectrum Region',
				dataIndex : 'region',
				flex : 1.5,
				editor : {
					xtype		 : 'combo',
					displayField : 'name',
					valueField	 : 'id',
					editable	 : false,
					store	     : {
						fields : ['id','name'],
						data   : DigiCompass.Web.app.financialCategory.region
					},
					listeners : DigiCompass.Web.app.financialCategory.getListeners()
				},
				renderer:function(value,metaData,record){
					var data = DigiCompass.Web.app.financialCategory.region;
					for(var i=0 ; i<data.length ;i++){
						if( data[i].id == value){
							return data[i].name;
						}
					}
				}
			},{
				header : 'Polygon',
				dataIndex : 'polygon',
				flex : 1,
				editor : {
					xtype	     : 'combo',
					displayField : 'name',
					valueField   : 'id',
					editable     : false,
					store		 : {
						fields : ['id','name'],
						data   : DigiCompass.Web.app.financialCategory.Polygon
					},
					listeners : DigiCompass.Web.app.financialCategory.getListeners()
				},
				renderer:function(value,metaData,record){
				var data = DigiCompass.Web.app.financialCategory.Polygon;
				for(var i=0 ; i<data.length ;i++){
					if( data[i].id == value){
						return data[i].name;
					}
				}
			}
			},{
				
				header : 'State',
				dataIndex : 'state',
				flex : 1,
				editor : {
					xtype		 : 'combo',
					displayField : 'name',
					valueField	 : 'id',
					editable	 : false,
					store		 : {
						fields : ['id','name'],
						data   : DigiCompass.Web.app.financialCategory.state
					},
					listeners : DigiCompass.Web.app.financialCategory.getListeners()
				},
				renderer:function(value,metaData,record){
					var data = DigiCompass.Web.app.financialCategory.state;
					for(var i=0 ; i<data.length ;i++){
						if( data[i].id == value){
							return data[i].name;
						}
					}
				}
			},{
				header : 'Service Catalogue',
				dataIndex : 'template',
				flex : 1,
				/*editor : Ext.create('DigiCompass.web.UI.ComboBox',{
					moduleType : 'SERVICE_TEMPLATE_MODULE',
					moduleCommand : 'COMMAND_QUERY_COMBOX_LIST',
					allowBlank   : false,
					editable     : false,
					parseData : function(message){
						var data = Ext.JSON.decode(message['BUSINESS_DATA']['list']);
						var d = [];
						for(var i in data){
							d.push([data[i].id, data[i].name]);
						}
						DigiCompass.Web.app.financialCategory.template = data;
						return d;
					},
					editable	 : false,
					listeners : DigiCompass.Web.app.financialCategory.getListeners()
				}),*/
				renderer:function(value,metaData,record){
					var data = DigiCompass.Web.app.financialCategory.workflowTemplate;
					for(var i=0 ; i<data.length ;i++){
						if( data[i].id == value){
							return data[i].name;
						}
					}
				}
			},{
				flex : 0.5,
				width: 40,
	            menuDisabled: true,
	            xtype: 'actioncolumn',
	            tooltip: 'delete',
	            align: 'center',
	            items: [{
	                icon: './styles/cmp/images/delete.png',  
	                scope: this,
	                getClass: function(value,meta,record,rowIx,colIx, store) {            
	                    return 'x-hide-display';  //Hide the action icon
	                },
		            handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
		            	if(rowIndex == grid.getStore().getCount() - 1){
		            		return;
		            	}
		            	var store = grid.getStore();
		            	store.removeAt(rowIndex);
		            	var selecteds = Ext.getCmp('financialCategoryItemTree').getSelectionModel().getSelection();
						DigiCompass.Web.app.financialCategory.cellEditingFocusNode =selecteds[0];
		            	store.fireEvent('update', store);
		            }
	            }]
			}],
			listeners : {
				cellclick : function(grid, cellElement, columnNum, record,
					rowElement, rowNum, e) {
					var dataIndex = grid.getHeaderCt()
					.getHeaderAtIndex(columnNum).dataIndex;
					if (dataIndex !== 'template') {
						return;
					}
					var cellId = grid.getHeaderCt().getHeaderAtIndex(columnNum).id;
					var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
					DigiCompass.Web.app.financialCategory.selectWorkflowTemplate(record,dataIndex);
					
				},
				itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
				},
				itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
				}
			}
	    }]
	})
	var formPanel = Ext.create('Ext.form.Panel', {
		id : 'financialCategoryAdd',
		defaultType : 'textfield',
		title: UiFunction.getTitle('Financial Catalogue'),
		border : false,
		width : '100%',
		frame : false,
		height : 'fit',
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
				var nameField = Ext.getCmp('financialCategoryName');
				var groupField = Ext.getCmp('categoryTypeGroup');
				if(!nameField.isValid()){
					return;
				}
				if(!groupField.isValid()){
					return;
				}
				var _formData = formPanel.getForm().getValues();
				var formData = { 
						id : _formData.id,
						name : _formData.name,
						description : _formData.description,
						reference : _formData.reference,
						groupId : Ext.getCmp('categoryTypeGroup').getValue()
					};
				DigiCompass.Web.app.financialCategory.projects = new Array();
				var gridData = DigiCompass.Web.app.financialCategory.getTreeData('financialCategoryItemTree');
				if(!gridData){
					//Notification.showNotification('Item has error data please check it!');
					return;
				}
				var projects = DigiCompass.Web.app.financialCategory.projects;
				var newPrjs = Ext.Array.unique(projects);
				if(newPrjs.length != projects.length){
					Notification.showNotification('Project must unique!');
					return;
				}
				formData.treeData = gridData;
				formData.MODULE_TYPE = 'MOD_FINANCIAL_CATEGORY';
				formData.COMMAND = 'COMMAND_SAVE';
				cometdfn.publish(formData);
			}
		}],
		items : [{
					id : 'financialCategoryId',
					xtype : 'hidden',
					name : 'id'
				},{
					id : 'financialCategoryReference',
					xtype : 'hidden',
					name : 'reference'
				},{
					id 		   : 'financialCategoryName',
					margin 	   : '10px 5px 10px 10px',
					allowBlank : false,
					emptyText  : 'Please input data!',
					fieldLabel : 'Name ',
					maxLength  : UiProperties.nameMaxLength,
					width	   : 800,
					msgTarget  : 'side',
					name 	   : 'name',
					listeners  : {
						change : function(field, newValue, oldValue){
							DigiCompass.Web.app.financialCategory.rootNodeName('financialCategoryItemTree',newValue);
						}
					}
				},{
					id 		   : 'financialCategoryDes',
					margin 	   : '10px 5px 10px 10px',
					emptyText  : 'Please input data!',
					fieldLabel : 'Description ',
					maxLength  : UiProperties.descMaxLength,
					width 	   : 800,
					msgTarget  : 'side',
					name 	   : 'description'
				},{
					id			 : 'categoryTypeGroup',
					margin 		 : '10px 5px 10px 10px',
					xtype		 : 'combo',
					fieldLabel 	 : 'Financial Catalogue Hierarchy',
					allowBlank 	 : false,
					width 		 : 800,
					displayField : 'name',
					valueField	 : 'id',
					editable	 : false,
					store	 	 : {
						fields : ['id','name'],
						data   : DigiCompass.Web.app.financialCategory.comboData
					},
					listeners : {
						change : function(){
							if(Ext.isEmpty(this.value)){
								return;
							}
							if(financialCategoryTree){
								financialCategoryTree.getRootNode().removeAll();
							}
							cometdfn.publish({
								MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
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
		        layout: {
		            type: 'border',
		            pack: 'start',
		            align: 'stretch'
		         },
		        defaults : {
		        	split: true,
		        },
				items:[
					categoryTree,
					financialCategoryTree,
					propertyForm
				]
			}]
		});
		
		return panel;
	}
	DigiCompass.Web.app.financialCategory.loadComboData = function(data){
		var comboData = data.BUSINESS_DATA.comboList;
		DigiCompass.Web.app.financialCategory.comboData = Ext.decode(comboData);
	}
	DigiCompass.Web.app.financialCategory.loadCategoryData = function(data){
		var categoryTypeTree = Ext.getCmp('financialCategoryTypeTree');
		if(categoryTypeTree){
			var treeData = data.BUSINESS_DATA.tree;
			treeData = Ext.decode(treeData);
			categoryTypeTree.setRootNode(treeData);
		}
	}
	DigiCompass.Web.app.financialCategory.changeCostGrid = function(store , focusedNode){
		if(Ext.isEmpty(focusedNode)){
			return;
		}
		var datas = [];
		for(var i = 0 ; i<store.getCount() ; i++){
			var data = store.getAt(i).data;
			if(Ext.isEmpty(data.siteType) &&
	    			Ext.isEmpty(data.region)&&
	    			Ext.isEmpty(data.polygon)&&
	    			Ext.isEmpty(data.state)&&
	    			Ext.isEmpty(data.template)&&
	    			Ext.isEmpty(data.technology)){
				continue;
			}
			else{
				datas.push(store.getAt(i).data);
			}
		}
		focusedNode.raw.cost = datas;
	}
	DigiCompass.Web.app.financialCategory.changeItemGrid = function(store , focusedNode){
		if(Ext.isEmpty(focusedNode)){
			return;
		}
		var tmpDatas = [];
		for(var i = 0 ; i<store.getCount() ; i++){
			tmpDatas.push(store.getAt(i).data);
		}
		focusedNode.raw.property = tmpDatas;
	}	
	DigiCompass.Web.app.financialCategory.getTreeDataByNode = function(childNodes){
		var dataArr = [];
		for(var i = 0 ; i < childNodes.length ; i++){
			var data = { name : childNodes[i].data.name , 
						 description : childNodes[i].data.description };
			if(!Ext.isEmpty(childNodes[i].childNodes))
				data.children = DigiCompass.Web.app.financialCategory.getTreeDataByNode(childNodes[i].childNodes);
			dataArr.push(data);
		}
		return dataArr;
	}
	DigiCompass.Web.app.financialCategory.getFocusedNode = function(){
		var focus = DigiCompass.Web.app.financialCategory.focusedNode;
		if(Ext.isEmpty(focus)){
			//Notification.showNotification('No TreeNode Selected!');
		}
		else{
			return focus;
		}
	}
	DigiCompass.Web.app.financialCategory.getListeners = function(){
		return {
				focus :function(){
					var selecteds = Ext.getCmp('financialCategoryItemTree').getSelectionModel().getSelection();
					DigiCompass.Web.app.financialCategory.cellEditingFocusNode =selecteds[0];
				}
		};
	}
	
	DigiCompass.Web.app.financialCategory.delChecked = function(checked){
		 var param = {
				 categoryGroupIds : checked
		 };
		 param.MODULE_TYPE = 'MOD_FINANCIAL_CATEGORY';
		 param.COMMAND = 'COMMAND_DEL';
		 cometdfn.publish(param);
	}
	DigiCompass.Web.app.financialCategory.financialCategoryTree = function(message){
		var data = message.BUSINESS_DATA.categoryTree;
		var childData = Ext.decode(data);
		var child = [];
		for(var key in childData){
			child.push(childData[key]);
		}
		var name = 'Financial Catalogue';
		var field = Ext.getCmp('financialCategoryName');
		if(field){
			name = field.getValue();
		}
		var root = {
				name:name,
				children : child,
				expanded : true
				};
		Ext.getCmp('financialCategoryItemTree').setRootNode(root);
	}
	DigiCompass.Web.app.financialCategory.delSuccess = function(data){
		 if(data.STATUS == 'success'){
			Notification.showNotification('delete category group Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.financialCategory(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
		} else if(data.customException){
			Notification.showNotification(data.customException);
		}
	}
	DigiCompass.Web.app.financialCategory.saveSuccess = function(data){
		 if(data.STATUS == 'success'){
			Notification.showNotification('Save category group Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.financialCategory(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	DigiCompass.Web.app.financialCategory.cleanFormData = function(){
		var form = Ext.getCmp('financialCategoryAdd');
		if(form){
			form.getForm().reset();
		}
	}
	DigiCompass.Web.app.financialCategory.cleanCategoryTypeTreeData = function(){
		var financialCategoryItemTree = Ext.getCmp('financialCategoryItemTree');
		if(financialCategoryItemTree){
			financialCategoryItemTree.setRootNode({
				name : 'Financial Catalogue' ,
				expanded : true
			});
		}
	}
	DigiCompass.Web.app.financialCategory.cleanfinancialCategoryTreeData = function(){
		var categoryTypeTree = Ext.getCmp('financialCategoryTypeTree');
		if(categoryTypeTree){
			categoryTypeTree.setRootNode({
			});
		}
	}
	DigiCompass.Web.app.financialCategory.cleanfinancialCategoryPropertyTreeData = function(){
		var propertyGrid = Ext.getCmp('financialCategoryPropertyGrid');
		if(propertyGrid){
			propertyGrid.getStore().loadData([]);
		}
		var costGrid = Ext.getCmp('financialCostDistribution');
		if(costGrid){
			costGrid.getStore().loadData([DigiCompass.Web.app.financialCategory.costEmpData]);
		}
	}
	function checkPropertyRequire(property){
		for(var key in property){
			if(property[key].optional == false && Ext.isEmpty(property[key].value)){
				return property[key].name;
			}
		}
	}	
	DigiCompass.Web.app.financialCategory.lookInto = function(childNodes){
		var datas = [];
		for(var i = 0 ; i<childNodes.length ; i++){
			var checkedFlag = checkPropertyRequire(childNodes[i].raw.property);
			if(checkedFlag){
				var errorMsg = DigiCompass.Web.app.workFlow.showErrorProperty( checkedFlag, childNodes[i].data.name );
				Notification.showNotification(errorMsg);
				return null;
			}
			var costData = [];
			var tmpData = childNodes[i].raw.cost;
			if(!Ext.isEmpty(tmpData)){
				for(var j = 0 ; j < tmpData.length ; j++ ){
					var flag = false;
					for(var key in tmpData[j]){
						if(!Ext.isEmpty(tmpData[j][key])){
							flag = true;
						}
					}
					if(flag){
						costData.push(tmpData[j]);
					}
				}
			}
			var data = { typeId : childNodes[i].raw.typeId ,
						 currentId : childNodes[i].raw.currentId,
						 name : childNodes[i].data.name,
						 property : childNodes[i].raw.property,
						 cost :  costData,
						 reference : childNodes[i].raw.reference };
			if(!childNodes[i].isLeaf() && childNodes[i].childNodes.length == 0){
				Notification.showNotification(childNodes[i].data.name + ' has no children !');
				return null;
			}
			if(childNodes[i].childNodes.length > 0){
				var childDatas = DigiCompass.Web.app.financialCategory.lookInto(childNodes[i].childNodes);
				if(childDatas == null){
					return null;
				}
				data.children = childDatas;
			}
			datas.push(data);
			if(childNodes[i].isLeaf()){
				DigiCompass.Web.app.financialCategory.projects.push(childNodes[i].data.name);
			}
		}
		return datas;
	}
	DigiCompass.Web.app.financialCategory.getTreeData = function(id){
		var tree = Ext.getCmp(id);
		var data;
		if(tree){
			var root = tree.getRootNode();
			if(root.childNodes.length == 0){
				Notification.showNotification('Item is empty!');
				return null;
			}
			data = DigiCompass.Web.app.financialCategory.lookInto(root.childNodes);
			if(data == null || data.length == 0){
				data = null;
			}
		}
		return data;
	}

	DigiCompass.Web.app.financialCategory.setNameFieldValue = function(id, value){
		var categoryNameControl = Ext.getCmp(id);
		if(categoryNameControl){
			categoryNameControl.suspendEvents();
			categoryNameControl.setValue(value);
			categoryNameControl.resumeEvents();
		}
	}
	DigiCompass.Web.app.financialCategory.rootNodeName = function(id , value){
		var wfTree = Ext.getCmp(id);
		if(wfTree){
			wfTree.getStore().suspendEvents();
			wfTree.getRootNode().set('name',value);
			wfTree.getStore().resumeEvents();
		}
	}
	/**
	 * flag true show add action icon
	 */
	DigiCompass.Web.app.financialCategory.showActionImg = function(record, item, flag, leafAdd){
		if(flag){
			if(record.isNode){
				if(leafAdd || !record.isLeaf()){
					var _add = Ext.select('#' + Ext.get(item).id +' [src~="./styles/cmp/images/add.png"]');                                                    
			        _add.removeCls('x-hide-display');
			        _add.addCls('x-grid-center-icon');
				}
				if(!record.isRoot()){
					var _delete = Ext.select('#' + Ext.get(item).id +' [src~="./styles/cmp/images/delete.png"]');                                                    
			        _delete.removeCls('x-hide-display');
			        _delete.addCls('x-grid-center-icon');
		    	}	 
			}
			else{
				var _add = Ext.select('#' + Ext.get(item).id +' [src~="./styles/cmp/images/add.png"]');                                                    
		        _add.removeCls('x-hide-display');
		        _add.addCls('x-grid-center-icon');
				var _delete = Ext.select('#' + Ext.get(item).id +' [src~="./styles/cmp/images/delete.png"]');                                                    
		        _delete.removeCls('x-hide-display');
		        _delete.addCls('x-grid-center-icon');
			}
		}
		else{
			 var _delete = Ext.select('#' + Ext.get(item).id +' [src~="./styles/cmp/images/delete.png"]');                                              
			 _delete.removeCls('x-grid-center-icon');
			 _delete.addCls('x-hide-display');
			 var _add = Ext.select('#' + Ext.get(item).id +' [src~="./styles/cmp/images/add.png"]');                                              
			 _add.removeCls('x-grid-center-icon');
			 _add.addCls('x-hide-display');
		}
	}
	function checkValidate(data , record){
		if(record.isRoot() && data.records[0].raw.level == 1){
			return true;
		}else{
			return data.records[0].raw.level == Number(record.raw.level) + 1;
		}
	}
	DigiCompass.Web.app.financialCategory.setDropTarget = function(id){
		var panel = Ext.getCmp(id);
		var el = panel.body.dom;
		var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', el , {
	        ddGroup: 'financialDragDropGroup',
	        notifyEnter: function(ddSource, e, data,a,b,c,d) {
				var flag = false;
				if(focusedFinancialItem){
					flag = checkValidate(data , focusedFinancialItem);
				}
				return flag ? this.dropAllowed : this.dropNotAllowed ;
	        },
			notifyOver: function(ddSource, e, data) {
				var flag = false;
				if(focusedFinancialItem){
					flag = checkValidate(data , focusedFinancialItem);
				}
				return flag ? this.dropAllowed : this.dropNotAllowed ;
			},
			
	        notifyDrop  : function(ddSource, e, data){
				if(!focusedFinancialItem){
					return false;
				}else{
					if(!checkValidate(data , focusedFinancialItem)){
						return false;
					}
				}
	        	var sourceData = ddSource.dragData.records[0].raw;
	        	focusedFinancialItem.appendChild(Ext.clone(sourceData));
	            return true;
	        }
	    });
	}
	DigiCompass.Web.app.financialCategory.costEmpData = {siteType:'',region:'',polygon:'',state:'',template:''};
	DigiCompass.Web.app.financialCategory.comboData = [];
	DigiCompass.Web.app.financialCategory.queryWftp = function(){
		cometdfn.publish({
			MODULE_TYPE:"SERVICE_TEMPLATE_MODULE",
			COMMAND:'COMMAND_QUERY_LIST',
			dataType : 'TreeData'
				});
	}
})();