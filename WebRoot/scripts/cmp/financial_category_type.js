(function(){
	Ext.namespace('DigiCompass.Web.app.financialCategoryType');
	DigiCompass.Web.app.financialCategoryType.getList = function(data,config){
		var fields = ['id', 'name','description','reference'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Financial Catalogue Hierarchy',
						dataIndex : 'name',
						//sortable : false,
						flex : 1
					}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		DigiCompass.Web.app.financialCategoryType.cleanData();
		if (Ext.getCmp('financialCategoryTypeListView')) {
			Ext.getCmp('financialCategoryTypeListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				fields:fields,
				width:'fit',
				height:735,
				data:[],
				listeners : {
					itemclick : DigiCompass.Web.app.financialCategoryType.clickFunction
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
				id : 'financialCategoryTypeListView',
				module:'MOD_FINANCIAL_CATEGORY_TYPE',
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
							DigiCompass.Web.app.financialCategoryType.resetUI();
							// 创建自己的Panel
							if(!Ext.getCmp('financialCategoryTypeAdd')){
								var formPanel = DigiCompass.Web.app.financialCategoryType.addFormPanel(null);
								// 将Panel添加在右边Panel上
								Ext.getCmp('obj-details').removeAll();
								Ext.getCmp('obj-details').add(formPanel);
							}
							DigiCompass.Web.app.financialCategoryType.cleanData();
							UiFunction.setTitle('financialCategoryTypeAdd', 'Financial Catalogue Hierarchy');

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
								DigiCompass.Web.app.financialCategoryType.delChecked(checkeds);
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
	DigiCompass.Web.app.financialCategoryType.clickFunction = function(grid, record, rowEl){
		var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		if(isChecked){
			return;
		}
		if(Ext.isEmpty(record.data.id)){
			return;
		} 
		if(!Ext.getCmp('financialCategoryTypeAdd')){
			var form = DigiCompass.Web.app.financialCategoryType.addFormPanel(null); 
			Ext.getCmp('obj-details').removeAll();
			Ext.getCmp('obj-details').add(form);
		}
		if(record.data.reference > 0){
			DigiCompass.Web.app.financialCategoryType.emptyPro = null;
			DigiCompass.Web.app.financialCategoryType.emptyItem = null;
			DigiCompass.Web.app.financialCategoryType.setUIDisplay(true);
		}
		else{
			DigiCompass.Web.app.financialCategoryType.emptyItem = { id : '',  name : '', property : [] };
			DigiCompass.Web.app.financialCategoryType.emptyPro = { id : '', name : '', optional : '' };
			DigiCompass.Web.app.financialCategoryType.setUIDisplay(false);
		}
		Ext.getCmp('financialCategoryTypeAdd').getForm().setValues(record.data);
		UiFunction.setTitle('financialCategoryTypeAdd', 'Financial Catalogue Hierarchy', record.data.name)
		cometdfn.publish({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY_TYPE',
			COMMAND : 'COMMAND_ITEM_TREE',
			id : record.data.id
		});
	 }
	 DigiCompass.Web.app.financialCategoryType.loadGridData = function(data,config){
		 if(!Ext.isEmpty(data.BUSINESS_DATA.list)){
			 var data = Ext.decode(data.BUSINESS_DATA.list);
			 var grid = Ext.getCmp('financialCategoryTypeItemsGrid');
			 if(grid){
				 if(DigiCompass.Web.app.financialCategoryType.emptyItem){
					 data.push(DigiCompass.Web.app.financialCategoryType.emptyItem);
				 }
				 grid.getStore().loadData(data);
				 DigiCompass.Web.app.financialCategoryType.cleanPropertyGridData();
			 }
		 }
	 }
	 DigiCompass.Web.app.financialCategoryType.changeItemGrid = function(store,selected){
		var data = [];
		for(var i = 0 ; i<store.getCount() ; i++){
			if(!Ext.isEmpty(store.getAt(i).data.name) || !Ext.isEmpty(store.getAt(i).data.optional)){
				data.push(store.getAt(i).data);
			}
		}
		selected.set('property',data);
	 }
	 DigiCompass.Web.app.financialCategoryType.addFormPanel = function(id){
		var store = Ext.create('Ext.data.ArrayStore', {
			data : DigiCompass.Web.app.financialCategoryType.getEmptyProArray(),
			fields : ['id','name','optional'],
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
					if(flag && DigiCompass.Web.app.financialCategoryType.emptyPro){
						store.insert(store.getCount(),DigiCompass.Web.app.financialCategoryType.emptyPro);
					}
					var focused = DigiCompass.Web.app.financialCategoryType.focused;
					if(Ext.isEmpty(focused)){
						Notification.showNotification('Please select a record!');
						return;
					}
					DigiCompass.Web.app.financialCategoryType.changeItemGrid(store,focused);
					DigiCompass.Web.app.financialCategoryType.focused = null;
				}
			}
		});
		var itemStore = Ext.create('Ext.data.ArrayStore', {
			data : DigiCompass.Web.app.financialCategoryType.getEmptyItemArray(),
			fields : ['id', 'name','property'],
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
					if(flag && DigiCompass.Web.app.financialCategoryType.emptyPro){
						store.insert(store.getCount(),DigiCompass.Web.app.financialCategoryType.emptyPro);
					}
				}
			}
		});
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
		var cellEditing1 = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'financialCategoryTypeAdd',
			defaultType : 'textfield',
			title  : UiFunction.getTitle('Financial Category Settings'),
			border : false,
			width : '100%',
			frame : false,
			height : 'fit',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side'
			},
			tbar:[{
				xtype : 'button',
				text : 'save',
				iconCls : 'icon-save',
				handler : function(){
					if(!formPanel.getForm().isValid()){
						return;
					}
					var formData = formPanel.getForm().getValues();
					var gridData = DigiCompass.Web.app.financialCategoryType.getStoreDataByGridId('financialCategoryTypeItemsGrid');
					if(Ext.isEmpty(gridData)){
						return;
					}
					formData.property = gridData;
					formData.MODULE_TYPE = 'MOD_FINANCIAL_CATEGORY_TYPE';
					formData.COMMAND = 'COMMAND_SAVE';
					cometdfn.publish(formData);
				}
			}],
			items : [{
						id : 'financialCategoryTypeId',
						xtype : 'hidden',
						name : 'id'
					},{
						id : 'financialCategoryTypeReference',
						xtype : 'hidden',
						name : 'reference'
					},{
						id 		   : 'financialCategoryTypeName',
						margin 	   : '10px 5px 10px 10px',
						allowBlank : false,
						emptyText  : 'Please input data!',
						fieldLabel : 'Name ',
						maxLength  : UiProperties.nameMaxLength,
						width	   : 600,
						msgTarget  : 'side',
						name 	   : 'name'
							
					},{
						id 		   : 'financialCategoryTypeDes',
						margin 	   : '10px 5px 10px 10px',
						emptyText  : 'Please input data!',
						fieldLabel : 'Description ',
						maxLength  : UiProperties.descMaxLength,
						width	   : 600,
						msgTarget  : 'side',
						name       : 'description'
					}]
		});
		var panel = Ext.create('Ext.panel.Panel',{
			layout:'vbox',
			items :[
			        formPanel, {
				width  :'100%',
				flex   : 5,
				xtype  :'container',
				layout :'hbox',
				items:[{
						xtype : 'gridpanel',
						id : 'financialCategoryTypeItemsGrid',
						plugins : [cellEditing],
						margin : '10px 5px 8px 10px',
						flex : 1,
						height : '100%',
						selType : 'cellmodel',
						store : itemStore,
						title : 'Financial Catalogue Hierarchy',
						columns : [{
								flex 	  : 4,
								text 	  : 'Name',
								sortable  : false,
								dataIndex : 'name',
								editor 	  : {
									allowBlank : false,
									maxLength  : UiProperties.nameMaxLength
								}
						},{
							flex:1,
							width: 40,
				            menuDisabled: true,
				            xtype: 'actioncolumn',
				            tooltip: 'delete',
				            align: 'center',
				           // icon: './styles/cmp/images/delete.png',
				            items: [{
				                icon: './styles/cmp/images/delete.png',  
				                scope: this,
				                getClass: function(value,meta,record,rowIx,colIx, store) {            
				                    return 'x-hide-display';  //Hide the action icon
				                },
				                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
					            	if(Ext.isEmpty(record.data.name)){
					            		return;
					            	}
					                grid.getStore().removeAt(rowIndex);
					            }
				            }]
						}],
						listeners:{
							itemclick : DigiCompass.Web.app.financialCategoryType.click,
							itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
								DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
							},
							itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
								DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
							}
						}
					},{
						id : 'financialCategoryTypePropertyGrid',
						plugins : [cellEditing1],
						xtype : 'gridpanel',
						margin : '10px 5px 8px 5px',
						menuDisabled: true,
						flex : 1,
						height : '100%',
						selType : 'cellmodel',
						store : store,
						title : 'Financial Catalogue Hierarchy Properties',
						columns : [{
								flex 	  : 5,
								text 	  : 'Property',
								sortable  : false,
								dataIndex : 'name',
								editor    : {
									allowBlank : false,
									maxLength  : UiProperties.nameMaxLength,
									listeners  : DigiCompass.Web.app.financialCategoryType.getListeners()
								}
							}, {
								flex : 5,
								text : 'Required',
								sortable : false,
								dataIndex : 'optional',
								editor : {
									xtype		 : 'combo',
									allowBlank   : false,
									displayField : 'd',
									valueField	 : 'v',
									editable	 : false,
									store		 : {
										fields :['d','v'],
										data   :[ { d:'NO', v:true},
										          { d:'YES', v:false}]
									},
									listeners : DigiCompass.Web.app.financialCategoryType.getListeners()
								},
								renderer : function(value, metaData, record){
									if(value === ''){
										return '';
									}
									if(value == true){
										return 'NO';
									}else{
										return 'YES';
									}
								}
							},{
								flex:1,
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
						            	if(Ext.isEmpty(record.data.property)&&Ext.isEmpty(record.data.optional) ){
						            		return;
						            	}
						                grid.getStore().removeAt(rowIndex);
						                var focued = Ext.getCmp('financialCategoryTypeItemsGrid').getSelectionModel().getSelection();
						                if(focued.length == 0){
											Notification.showNotification('Please select a record!');
											return;
										}
						                DigiCompass.Web.app.financialCategoryType.changeItemGrid(grid.getStore(),focued[0]);
						            }
					            }]
						}],
						listeners : {
							itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
								DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
							},
							itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
								DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
							}
						}
				}]
			}]
		});
		return panel;
	 }
	 DigiCompass.Web.app.financialCategoryType.click = function(grid, record, rowEl){
		var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		if(isChecked){
			return;
		}
		var store = Ext.getCmp('financialCategoryTypePropertyGrid').getStore();
		var property = Ext.clone(record.data.property);
		if(Ext.isEmpty(property)){
			store.loadData(DigiCompass.Web.app.financialCategoryType.getEmptyProArray());
			return;
		}
		else{
			if(DigiCompass.Web.app.financialCategoryType.emptyPro){
				property.push(DigiCompass.Web.app.financialCategoryType.emptyPro);
			}
		}
		store.loadData(property);
	 }
	 DigiCompass.Web.app.financialCategoryType.getStoreDataByGridId = function(id){
		 var grid = Ext.getCmp(id);
		 var dataArr = [];
		 if(!grid){
			 return dataArr;
		 }
		 var flag = true;
		 var store = grid.getStore();
		 if(store.getCount() == 1){
			 Notification.showNotification('Category is required!');
			 return [];
		 }
		 store.each(function(record){
			 if(!Ext.isEmpty(record.data.name)){
				 if(!Ext.isEmpty(record.data.property)){
					 var pro = record.data.property;
					 for(var i in pro){
						 if(pro[i].optional === ''){
							 var errorMsg = DigiCompass.Web.app.financialCategoryType.showErrorProperty(pro[i].name , record.data.name);
							 Notification.showNotification(errorMsg);
							 flag = false;
							 return false;
						 }
					 }
					 dataArr.push(record.data);
				 }else{
					var data = record.data;
					data.property = [];
					dataArr.push(data);
				 }
			 }
		 });
		 if(!flag){
		 	return [];
		 }
		 return dataArr;
	 }
	 DigiCompass.Web.app.financialCategoryType.saveSuccess = function(message , config){
		 if(message.STATUS == 'success'){
			Notification.showNotification('Save category group Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.financialCategoryType(queryParam);
			//DigiCompass.Web.app.financialCategoryType.cleanData();
			DigiCompass.Web.app.financialCategoryType.resetUI();
			DigiCompass.Web.app.sitegroup.removeDetail();
		}else if(data.customException){
			alertError(data.customException);
		}
	 }
	 DigiCompass.Web.app.financialCategoryType.delSuccess = function(message , config){
		 if(message.STATUS == 'success'){
			Notification.showNotification('delete category group Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.financialCategoryType(queryParam);
			//DigiCompass.Web.app.financialCategoryType.cleanData();
			DigiCompass.Web.app.financialCategoryType.resetUI();
			DigiCompass.Web.app.sitegroup.removeDetail();
		} else if(data.customException){
			alertError(data.customException);
		}
	 }
	 DigiCompass.Web.app.financialCategoryType.cleanFormData = function(){
		 var form = Ext.getCmp('financialCategoryTypeAdd');
		 if(form){
			form.getForm().reset(); 
		 }
	 }
	 DigiCompass.Web.app.financialCategoryType.cleanItemGridData = function(){
		 var itemGrid = Ext.getCmp('financialCategoryTypeItemsGrid');
		 if(itemGrid && DigiCompass.Web.app.financialCategoryType.emptyItem){
			 itemGrid.getStore().loadData([DigiCompass.Web.app.financialCategoryType.emptyItem]);
		 }
	 }
	 DigiCompass.Web.app.financialCategoryType.cleanPropertyGridData = function(){
		 var propertyGrid = Ext.getCmp('financialCategoryTypePropertyGrid');
		 if(propertyGrid){
			 propertyGrid.getStore().loadData(DigiCompass.Web.app.financialCategoryType.getEmptyProArray());
		 }
	 }
	 DigiCompass.Web.app.financialCategoryType.delChecked = function(checked){
		 var param = {
				 ids : checked
		 }
		 param.MODULE_TYPE = 'MOD_FINANCIAL_CATEGORY_TYPE';
		 param.COMMAND = 'COMMAND_DEL';
		 cometdfn.publish(param);
	 }
	 DigiCompass.Web.app.financialCategoryType.getListeners = function(){
		 return { 
			 focus : function(){
				 var focused = Ext.getCmp('financialCategoryTypeItemsGrid').getSelectionModel().getSelection();
				 if(focused && focused.length>0){
					 DigiCompass.Web.app.financialCategoryType.focused = focused[0];
				 }
		 	 }
		 };
	 }
	 DigiCompass.Web.app.financialCategoryType.cleanData = function(){
		 DigiCompass.Web.app.financialCategoryType.cleanFormData();
		 DigiCompass.Web.app.financialCategoryType.cleanItemGridData();
		 DigiCompass.Web.app.financialCategoryType.cleanPropertyGridData();
	 }
	 DigiCompass.Web.app.financialCategoryType.setUIDisplay = function(flag){
		 var propertyGrid = Ext.getCmp('financialCategoryTypePropertyGrid');
		 var itemGrid = Ext.getCmp('financialCategoryTypeItemsGrid');
		 if(propertyGrid){
			 var headers = propertyGrid.headerCt.getGridColumns();
			 for(var key in headers){
				 if(headers[key].xtype == 'actioncolumn'){
					 headers[key].setVisible(!flag);
					 headers[key].setDisabled(flag);
				 }
			 }
		 }
		 if(itemGrid){
			 var headers = itemGrid.headerCt.getGridColumns();
			 for(var key in headers){
				 if(headers[key].xtype == 'actioncolumn'){
					 headers[key].setVisible(!flag);
					 headers[key].setDisabled(flag);
				 }
			 } 
		 }
	 }
	 DigiCompass.Web.app.financialCategoryType.resetUI = function(){
		DigiCompass.Web.app.financialCategoryType.setUIDisplay(false);
		DigiCompass.Web.app.financialCategoryType.emptyPro = { id : '', name : '', optional : '' };
		DigiCompass.Web.app.financialCategoryType.emptyItem = { id : '',  name : '', property : [] };
	}
	 DigiCompass.Web.app.financialCategoryType.emptyPro = { id : '', name : '', optional : '' };
	 DigiCompass.Web.app.financialCategoryType.getEmptyProArray = function(){
		 if(DigiCompass.Web.app.financialCategoryType.emptyPro){
			 return [DigiCompass.Web.app.financialCategoryType.emptyPro];
		 }
		 else{
			 return [];
		 }
	 }
	 DigiCompass.Web.app.financialCategoryType.emptyItem = { id : '',  name : '', property : [] };
	 DigiCompass.Web.app.financialCategoryType.getEmptyItemArray = function(){
		 if(DigiCompass.Web.app.financialCategoryType.emptyItem){
			 return [DigiCompass.Web.app.financialCategoryType.emptyItem];
		 }
		 else{
			 return [];
		 }
	 }
	 DigiCompass.Web.app.financialCategoryType.showErrorProperty = function(propertyName , categoryName){
		return propertyName + ' of Category ' + categoryName + ' must have a required property!';//pro[i].name + ' of Category '+ record.data.name  + 
	 }
})();