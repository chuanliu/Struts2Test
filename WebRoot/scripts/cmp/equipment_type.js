(function(){
	Ext.namespace('DigiCompass.Web.app.equipmentType');
	
	DigiCompass.Web.app.equipmentType.Capex = 'Capex';
	DigiCompass.Web.app.equipmentType.Opex = 'Opex';
	
	DigiCompass.Web.app.equipmentType.checkedStoreEmptyRecord = function(list){
		var flag = false;
		for(var i = 0 ; i < list.length ; i++){
			var data = list[i];
			flag = false;
			for(var key in data){
				if(!Ext.isEmpty(data[key])){
					flag = true;
					break;
				}
			}
			if(!flag){
				break;
			}
		}
		return flag;
	}
	function getTreeData(childNodes){
		var datas = [];
		for(var i = 0 ; i<childNodes.length ; i++){
			var data = { 
						 id : childNodes[i].data.id ,
						 name : childNodes[i].data.name,
						 property : childNodes[i].raw.property };
			
			
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
	DigiCompass.Web.app.equipmentType.getTreeData = function(id){
		var tree = Ext.getCmp(id);
		var data;
		if(tree){
			var root = tree.getRootNode();
			if(root.childNodes.length == 0){
				Notification.showNotification('Item is empty!');
				return null;
			}
			data = { 
					 id : root.data.id ,
					 name : root.data.name,
					 property : root.raw.property };
			var childDatas = getTreeData(root.childNodes);
			if(childDatas == null){
				return null;
			}
			data.children = childDatas;
			if(data == null || data.length == 0){
				data = null;
			}
		}
		return data;
	}
	DigiCompass.Web.app.equipmentType.getList = function(data){
		DigiCompass.Web.app.equipmentType.focusedNode = null;
		var fields = ['id', 'name','description','reference'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Equipment Settings',
						dataIndex : 'name',
						sortable : false,
						flex : 1
					}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		if (Ext.getCmp('equipmentTypeListView')) {
			Ext.getCmp('equipmentTypeListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				fields:fields,
				width:'fit',
				height:735,
				data:[],
				listeners : {
					itemclick : DigiCompass.Web.app.equipmentType.clickFunction
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
				id : 'equipmentTypeListView',
				module:'MOD_EQUIPMENT_TYPE',
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
							var formPanel = DigiCompass.Web.app.equipmentType.addFormPanel(null);
							// 将Panel添加在右边Panel上
							Ext.getCmp('obj-details').removeAll();
							Ext.getCmp('obj-details').add(formPanel);
							UiFunction.setTitle('equipmentTypeAdd', 'Equipment Settings');

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
								DigiCompass.Web.app.equipmentType.delChecked(checkeds);
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
	DigiCompass.Web.app.equipmentType.delChecked = function(checkedIds){
		var param = {
				 equipmentGroupIds : checkedIds
		 };
		 param.MODULE_TYPE = 'MOD_EQUIPMENT_TYPE';
		 param.COMMAND = 'COMMAND_DEL';
		 cometdfn.publish(param);
	}
	DigiCompass.Web.app.equipmentType.getListeners = function(){
		return {
			change : function(combo, newValue, oldValue){
				var records = Ext.getCmp('equipmentTypePropertyGrid').getSelectionModel().getSelection();
				DigiCompass.Web.app.equipmentType.showPropertiesInputWindow({}, newValue,false);
			}
		};
	}
	DigiCompass.Web.app.equipmentType.setCapexAndOpex = function (gridData, isInit) {
		var hasExists = false;
		for (var i=0, len=gridData.length; i<len; i++) {
			var tempData = gridData[i];
			if (tempData.name === DigiCompass.Web.app.equipmentType.Capex) {
				tempData = DigiCompass.Web.app.equipmentType.createEmptyProperty(DigiCompass.Web.app.equipmentType.Capex, tempData.defaultValue);
				hasExists = true;
			} else if (tempData.name === DigiCompass.Web.app.equipmentType.Opex) {
				tempData = DigiCompass.Web.app.equipmentType.createEmptyProperty(DigiCompass.Web.app.equipmentType.Opex, tempData.defaultValue);
				hasExists = true;
			}
		}
		if (!hasExists || isInit) {
			var capex = DigiCompass.Web.app.equipmentType.createEmptyProperty(DigiCompass.Web.app.equipmentType.Capex, '');
			var opex = DigiCompass.Web.app.equipmentType.createEmptyProperty(DigiCompass.Web.app.equipmentType.Opex, '');
//			DigiCompass.Web.app.equipmentType.addCapexAndOpexToGridData(gridData, capex, opex);
			gridData.splice(gridData.length-1, 0, capex, opex);
		}
	}
	DigiCompass.Web.app.equipmentType.addCapexAndOpexToGridData = function(gridData, capex, opex) {
		var index = 0;
		for (var i=0, len=gridData.length; i<len; i++) {
			var temp = gridData[i];
			if (!temp.unEditable) {
				index = i;
				break;
			}
		}
		gridData.splice(index, 0, capex, opex);
	} 
	DigiCompass.Web.app.equipmentType.createEmptyProperty = function(name, defaultValue) {
		var p = {};
		p.name = name;
		p.prototype = '';
		p.defaultValue = defaultValue;
		p.list = '';
		p.multiple = '';
		p.optional = 'YES';
		p.type = 'Regex';
		p.unEditable = true;
		p.requirement = '';
		p.systemProperty = true;
		return p;
	}
	DigiCompass.Web.app.equipmentType.setFocused = function(node, isInitCapex){
		DigiCompass.Web.app.equipmentType.focusedNode = node;
		var gridData = [DigiCompass.Web.app.equipmentType.emptyProperty];
		if(node.raw.property){
			gridData = node.raw.property;
		}
		//添加capex,opex
		DigiCompass.Web.app.equipmentType.setCapexAndOpex(gridData, isInitCapex);
		//添加自增行的空行
		var flag = DigiCompass.Web.app.equipmentType.checkedStoreEmptyRecord(gridData);
		if(flag){
			gridData.push(DigiCompass.Web.app.equipmentType.emptyProperty);
		}
		Ext.getCmp('equipmentTypePropertyGrid').getStore().loadData(gridData);
	}
	DigiCompass.Web.app.equipmentType.addFormPanel =function (id){
	
	    var itemStore = Ext.create('Ext.data.TreeStore', {
	    	fields: ['name','typeId'],
	        root: {	
	        	name : 'Equipment Type',
                iconCls : 'task-folder',
                expanded : true
            },
	        folderSort : false,
	        listeners : {
	        	update : function(store){
	        		var name = store.getRootNode().data.name;
	        		DigiCompass.Web.app.financialCategory.setNameFieldValue('equipmentTypeName', name);
	        	}
	        }
	    });
	    var cellEditing2 = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
	    
	    var equipmentTypeTree = Ext.create('Ext.tree.Panel', {
	    	id : 'equipmentTypeTree',
	        title: 'Item',
	        region : 'west',
	        margin : '0px 5px 5px 10px',
	        width: 300,
	        height: 'fit',
	        selType : 'cellmodel',
	        plugins : [cellEditing2],
	        rootVisible: true,
	        autoScroll  : true,
	        tbar : [{
	        	xtype   : 'button',
	        	text    : 'Show Tree',
	        	handler : function(){
	        		var tree = Ext.getCmp('equipmentTypeTree').getRootNode();
	        		var data = DigiCompass.Web.TreeUtil.getTreeData(tree);
	        		DigiCompass.Web.app.planningModelTree.showTree(data , 'equipmentTypeD3tree','Financial Category Tree');
	        	}
	        }],
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
		            	if( parent && Ext.isEmpty(parent.childNodes)){
		            		parent.set('leaf', true);
		            	}
		            }
	            },{
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
	                    var property = record.raw.property;
	                    var newProperty = [];
	                    if(Ext.isArray(property)){
		                    for(var i = 0 ; i<property.length ; i++){
		                    	var flag = false;
		                    	var data = Ext.clone(property[i]);
		                    	
		                    	if (data.name === DigiCompass.Web.app.equipmentType.Capex 
		                    			|| data.name === DigiCompass.Web.app.equipmentType.Opex) {
		                    		continue;
		                    	}
		                    	
		                    	for(var key in data){
		                    		if(!Ext.isEmpty(data[key])){
		                    			flag = true;
		                    			break;
		                    		}
		                    	}
		                    	if(flag){
		                    		data.unEditable = true,
		                    		newProperty.push(data);
		                    	}
		                    }
	                    }
	                    record.appendChild({
	                    	leaf : true,
	                    	name : 'new Type',
	                    	property : newProperty,
	                    	requirement : {
	                    		name: ''}
	                    });
	                    var children = record.childNodes;
	                    var rowIndex = grid.getStore().indexOf(children[children.length-1]);
		            	cellEditing2.cancelEdit();
		            	cellEditing2.startEditByPosition({
		        			row: rowIndex,
		        			column: 0
		        		});
		            	DigiCompass.Web.app.equipmentType.setFocused(children[children.length - 1], true);
		            }
	            }]
			}],
	        listeners : {
	        	cellclick : function(grid, cellHtml, colIndex, node , rowHtml, rowIndex){
	        		if(colIndex != 0){
	        			return;
	        		}
	        		DigiCompass.Web.app.equipmentType.setFocused(node, false);
	        	},
	            itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
	            	//focusedEquipment = record;
	            	DigiCompass.Web.app.financialCategory.showActionImg(record, item, true , true);
	            },
	            itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
	            	//focusedEquipment = null;
	            	DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
	            }        
	        }
	    });
	    
	var propertyStore = Ext.create('Ext.data.JsonStore', {
	    fields: ['currentId','name','type','requirement','multiple','optional','list','defaultValue','unEditable','systemProperty'],
	    data: [DigiCompass.Web.app.equipmentType.emptyProperty],
	    listeners:{
			update:function(store, record, eventType, dataIndex){
				var focus = DigiCompass.Web.app.equipmentType.focusedNode;
				if(Ext.isEmpty(focus)){
					//Notification.showNotification('Please select a record!');
					return;
				}
				var index;
				var count = store.getCount();
				for(var i = 0 ; i<count ; i++){
					var _data = store.getAt(i).data;
					var data = record.data;
					var flag = true;
					for(var key in data){
						if(_data[key] !== data[key]){
							flag = false;
						}
					}
					if(flag)
						index = i;
				}
				DigiCompass.Web.app.equipmentType.changeItemGrid(store, focus, record, index);
				
				var last = store.getAt(store.getCount()-1).data;
				var flag = false;
				for(var i in last){
					if(!Ext.isEmpty(last[i])){
						flag = true;
						break;
					}
				}
				if(flag){
					store.insert(store.getCount(),{name : '', type : '', requirement: '', multiValue : '', optional : '', defaultValue :'' });
				}
			}
		}
	 });
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit : 1,
		listeners : {
			beforeedit: function (me, e) {
				var focused = Ext.getCmp('equipmentTypePropertyGrid').getSelectionModel().getSelection();
				var unEditable = focused[0].data.unEditable;
    			return !unEditable;
    		}
		}
	});
	
	var formPanel = Ext.create('Ext.form.Panel', {
		id : 'equipmentTypeAdd',
		defaultType : 'textfield',
		title: UiFunction.getTitle('Equipment Type'),
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
				var nameField = Ext.getCmp('equipmentTypeName');
				var desc = Ext.getCmp('equipmentTypeDes');
				if(!nameField.isValid()){
					return;
				}
				var _formData = formPanel.getForm().getValues();
				var formData = { 
						id : _formData.id,
						name : _formData.name,
						description : _formData.description,
						reference : _formData.reference
					};
				var gridData = DigiCompass.Web.app.equipmentType.getTreeData('equipmentTypeTree');
				if(!gridData){
					//Notification.showNotification('Item has error data please check it!');
					return;
				}
				formData.treeData = gridData;
				formData.MODULE_TYPE = 'MOD_EQUIPMENT_TYPE';
				formData.COMMAND = 'COMMAND_SAVE';
				cometdfn.publish(formData);
				
			}
		}],
		items : [{
					id : 'equipmentTypeId',
					xtype : 'hidden',
					name : 'id'
				},{
					id : 'equipmentTypeReference',
					xtype : 'hidden',
					name : 'reference'
				},{
					id 		   : 'equipmentTypeName',
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
							DigiCompass.Web.app.financialCategory.rootNodeName('equipmentTypeTree',newValue);
						}
					}
				},{
					id 		   : 'equipmentTypeDes',
					margin 	   : '10px 5px 10px 10px',
					emptyText  : 'Please input data!',
					fieldLabel : 'Description ',
					maxLength  : UiProperties.descMaxLength,
					width 	   : 800,
					msgTarget  : 'side',
					name 	   : 'description'
				}]
		});
	
		var panel = Ext.create('Ext.panel.Panel',{
			layout:'vbox',
			items :[formPanel, {
				width  :'100%',
				flex   : 5,
				xtype  :'container',
				layout :'border',
				items:[
					equipmentTypeTree , {
				    	id : 'equipmentTypePropertyGrid',
						title : 'Item Properties',
						margin : '0px 10px 5px 10px',
						region : 'center',
						collapsible: true,
						height : 'fit',
						xtype : 'grid',
						selType : 'cellmodel',
						plugins : [cellEditing],
						store: propertyStore,
						columns:[{
							header : 'PropertyName',
							dataIndex : 'name',
							flex : 3,
							editor : {
								allowBlank : false,
								maxLength  : UiProperties.stringValueMaxLength//,
								//listeners  : DigiCompass.Web.app.equipmentType.getListeners()
							}
						},{
							header : 'PropertyType',
							dataIndex : 'type',
							flex : 3,
							editor : {
								xtype : 'combo',
								allowBlank 	 : false,
								editable     : false,
								displayField : 'name',
								valueField	 : 'id',
								store : {
									fields : ['id','name'],
									data   :  DigiCompass.Web.app.equipmentType.getTypeData()
								},
								maxLength  : UiProperties.stringValueMaxLength,
								listeners  : DigiCompass.Web.app.equipmentType.getListeners()
							}
						},{
							header : 'Requirement',
							flex : 3,
							dataIndex : 'requirement'
						},{
							header : 'Multiple',
							dataIndex : 'multiple',
							flex : 3
						},{
							header : 'Required',
							dataIndex : 'optional',
							flex : 3
						},{
							header : 'DefaultValue',
							dataIndex : 'defaultValue',
							flex : 3
						},{
							flex : 1,
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
					            	var selecteds = Ext.getCmp('equipmentTypeTree').getSelectionModel().getSelection();
									DigiCompass.Web.app.equipmentType.cellEditingFocusNode =selecteds[0];
					            	store.fireEvent('update', store);
					            }
				            }]
						}],
						listeners : {	            
							itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
								if(record.data.unEditable){
				            		return;
				            	}
								DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
							},
							itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
								DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
							},
							cellclick : function(grid, cellElement, columnNum, record, rowElement, rowNum, e) {
								DigiCompass.Web.app.equipmentType.focusedPropertyRecord = record;
								var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
								if(dataIndex == 'name' || dataIndex == 'type' || Ext.isEmpty(record.data.type)){
									return;
								}
								if(dataIndex === 'defaultValue' && record.raw.systemProperty){
									DigiCompass.Web.app.equipmentType.inputNumberWindow(record.raw.name, record.data.defaultValue, function(v){
										record.data['defaultValue'] = v;
										record.commit();
									});
									return;
								}
								if(!Ext.isEmpty(dataIndex)){
									DigiCompass.Web.app.equipmentType.showPropertiesInputWindow(record, record.data.type,true);
								}
							}
						}
				    }]
			}]
		});
		if(id){
			cometdfn.publish({
				MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',
				COMMAND : 'COMMAND_QUERY_ALL_TREE',
				id : id
			});
		}
		return panel;
	}
	DigiCompass.Web.app.equipmentType.clickFunction = function(grid, record, rowEl){
		var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		if(isChecked){
			return;
		}
		if(Ext.isEmpty(record.data.id)){
			return;
		} 
		if(!Ext.getCmp('equipmentTypeAdd')){
			var formPanel = DigiCompass.Web.app.equipmentType.addFormPanel(record.data.id);
			// 将Panel添加在右边Panel上
			Ext.getCmp('obj-details').removeAll();
			Ext.getCmp('obj-details').add(formPanel);
		}
		else{
			if(record.data.id){
				cometdfn.publish({
					MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',
					COMMAND : 'COMMAND_QUERY_ALL_TREE',
					id : record.data.id
				});
				
				var temp = Ext.getCmp('equipmentTypePropertyGrid');
				if (temp) {
					temp.getStore().loadData([]);
				}
			}
		}
		var datas = {
				id : record.data.id,
				name : record.data.name,
				description : record.data.description,
				reference:record.data.reference
			};
		Ext.getCmp('equipmentTypeAdd').getForm().setValues(datas);
		
	}
	function getDefaultDateByStr(date){
		var date = Ext.Date.parse(date,'Y-m-d');
			date = Ext.Date.parse(date,'Y-m');
			if(!date){
				date = new Date();
			}
		return date;
	}
	DigiCompass.Web.app.equipmentType.inputNumberWindow = function(name ,defaultValue, callback) {
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'equipmentTypeAdd',
			defaultType : 'textfield',
			border : false,
			width : '100%',
			frame : false,
			height : 'fit',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 70	
			},
			items : [{
						id 		   : 'defaultValueId',
						xtype      : 'numberfield',
						margin 	   : '10px 5px 10px 10px',
						allowBlank : false,
						emptyText  : 'Please input data!',
						fieldLabel : name,
						maxLength  : UiProperties.nameMaxLength,
						minValue   : 1,
						maxValue   : 10000000000,
						width	   : 300,
						msgTarget  : 'side',
						name 	   : 'defaultValue',
						value      : defaultValue
					}],
			buttons: [{
	            text: 'Ok',
	            handler: function() {
	            	var _temp = Ext.getCmp('defaultValueId');
	            	if (!_temp.isValid()) {
	            		Notification.showNotification('Invalid data!');
	        			return;
	            	}
	            	var defaultValue = _temp.getValue();
	            	if (callback) {
	            		callback(defaultValue);
	            	}
	                Ext.getCmp('defaultValueWinId').close();
	            }
	        }],
	        buttonAlign: 'center'
			});
		
		var propertyWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			id: 'defaultValueWinId',
			width  : 400,
			height : 200,
			modal : true,
			layout : 'fit',
			title  : 'DefaultValueInput',
			items  : [formPanel]
		});
		propertyWin.show();
	}
	
	DigiCompass.Web.app.equipmentType.showPropertiesInputWindow = function(record,type,flag){
		var property = {
				type : type
				};
		if(record.data){
			property = record.data;
		}
		if(property.unEditable){
			return;
		}
		var focus = DigiCompass.Web.app.equipmentType.focusedNode;
		if(Ext.isEmpty(focus)){
			Notification.showNotification('Please select a record!');
			return;
		}
		var propertyWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			width  : 400,
			height : 300,
			modal : true,
			layout : 'fit',
			title  : 'PropertyInput',
			items  : [{
				xtype : 'equipmenttypeform',
				id 			: 'proForm',
				height      : 300,
				buttonAlign : 'center',
				fieldDefaults: {
                    labelAlign: 'right'
                },
                property : property,
                inputType : true,
                listeners : {
                	buttoncallback:function(datas){
                		var record = DigiCompass.Web.app.equipmentType.focusedPropertyRecord;
    					for(var key in datas){
    						record.data[key] = datas[key];
    					}
    					record.commit();
    					propertyWin.close();
                	}
                }
			}]
		});
		propertyWin.show();
	}
	DigiCompass.Web.app.equipmentType.assembleEquipmentTypeData = function(message){
		var data = Ext.decode(message.BUSINESS_DATA.list);
		var tree = Ext.getCmp('equipmentTypeTree');
		if(tree){
			tree.setRootNode(data);
		}
	}
	DigiCompass.Web.app.equipmentType.focusedNode = null;
	DigiCompass.Web.app.equipmentType.focusedPropertyRecord = null;
	
	DigiCompass.Web.app.equipmentType.getFocusedNode = function(){
		return DigiCompass.Web.app.equipmentType.focusedNode;
	}
	DigiCompass.Web.app.equipmentType.emptyProperty = ['','','','','',''];
	DigiCompass.Web.app.equipmentType.typeData = ['Regex','Date','Boolean','List'];
	DigiCompass.Web.app.equipmentType.getTypeData = function(){
		var data = [];
		var typeData = DigiCompass.Web.app.equipmentType.typeData;
		for(var i = 0 ; i < typeData.length ; i++){
			data.push({ id : typeData[i], 
			            name : typeData[i] });
		}
		return data;
	}
	DigiCompass.Web.app.equipmentType.cellEditingFocusNode = null;
	DigiCompass.Web.app.equipmentType.updateChildNodeProperty = function(focusedNode,record, index){
		if(Ext.isArray(focusedNode.childNodes)){
			for(var i = 0 ; i<focusedNode.childNodes.length ; i++){
				var childNode = focusedNode.childNodes[i];
				if(Ext.isArray(focusedNode.childNodes[i].raw.property)){
					var data = Ext.clone(record.data);
					data.unEditable = true;
					var unEditable = childNode.raw.property[index];
					if(Ext.isEmpty(unEditable) || !unEditable.unEditable){
						childNode.raw.property.splice(index, 0, data);
					}else{
						childNode.raw.property[index] = data;
					}
				}
				if(Ext.isArray(childNode.childNodes)){
					DigiCompass.Web.app.equipmentType.updateChildNodeProperty(childNode, record, index);
				}
			}
		}
	}
	DigiCompass.Web.app.equipmentType.changeItemGrid = function(store , focusedNode, record, index){
		if(Ext.isEmpty(focusedNode)){
			return;
		}
		var tmpDatas = [];
		for(var i = 0 ; i<store.getCount() ; i++){
			tmpDatas.push(store.getAt(i).data);
		}
		focusedNode.raw.property = tmpDatas;
		
		if (record.data.name !== DigiCompass.Web.app.equipmentType.Capex 
				&& record.data.name !== DigiCompass.Web.app.equipmentType.Opex) {
			DigiCompass.Web.app.equipmentType.updateChildNodeProperty(focusedNode, record, index);
		}
	}
	DigiCompass.Web.app.equipmentType.delSuccess = function(data){
		 if(data.STATUS == 'success'){
			Notification.showNotification('Delete equipment type group Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.equipmentType(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
		} else if(data.customException){
			Notification.showNotification(data.customException);
		}
	}
	DigiCompass.Web.app.equipmentType.saveSuccess = function(data){
		 if(data.STATUS == 'success'){
			Notification.showNotification('Save equipment type group Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.equipmentType(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
})();