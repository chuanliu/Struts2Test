(function() {

	var space = Ext.namespace('DigiCompass.Web.app.spectrumRegion');
	
	DigiCompass.Web.app.spectrumRegion.checkRow = [];
	DigiCompass.Web.app.spectrumRegion.chek_box = function(check,event,id){
		if(check.checked){
			DigiCompass.Web.app.spectrumRegion.checkRow.push(id);
		}else{
			var checkeds = DigiCompass.Web.app.spectrumRegion.checkRow;
			for(var i = 0 ; i <checkeds.length ; i++){
				if(checkeds[i] == id){
					checkeds.splice(i,1);
				}
			}
		}
		event = event || window.event;
		event.stopPropagation();
	}
	DigiCompass.Web.app.spectrumRegion.getList = function(data, config) {
		DigiCompass.Web.app.spectrumRegion.checkRow = [];
		var fields = ['id', 'version','reference'];
		var columns = [/*{
			header : '',
			dataIndex : 'reference',
			sortable : false,
			width : 30,
			renderer:function(value,metaData,record){
				return value>0 ? '<input id = chk_'+record.data.id+' type=checkbox disabled=true />':
					'<input id = chk_'+record.data.id+' type="checkbox" onclick = "DigiCompass.Web.app.spectrumRegion.chek_box(this,event,\''+record.data.id+'\')"/>';
			}
		},*/{
						xtype : 'treecolumn',
						header : 'Name',
						dataIndex : 'version',
						//sortable : false,
						width : 130
					},{
						header : 'Reference',
						dataIndex : 'reference',
						//sortable : false,
						width : 80,
						renderer:function(value){
							if(value>0){
								return '<font color=red>'+value+'</font>';
							}
							else{
								return '<font color=green>'+value+'</font>';
							}
						}
					}];
		var _data = data.BUSINESS_DATA;
		var datas = Ext.JSON.decode(_data);
		/*var myStore = Ext.create('Ext.data.JsonStore', {
					fields : fields,
					data : datas
				});*/
		if (Ext.getCmp('objExpPanel_spectrumRegionID')) {
			Ext.getCmp('objExpPanel_spectrumRegionID').reconfigData(datas);
		} else {
			
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				id:"spectrumRegionExplorer",
				fields:fields,
				width:"fit",
				height:700,
				data:[]
			});
			objectExplorer.on('checkchange', function(node, checked) {      
				objectExplorer.checkchild(node,checked);  
				objectExplorer.checkparent(node);  
	    	}); 
			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
				width:"fit",
				id:"spectrumRegionCatalogue",
				height:730,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'objExpPanel_spectrumRegionID',
				module:'MOD_SPECTRUM_REGION',
				command:'COMMAND_QUERY_LIST',
				otherParam:{},
				region:'west',
				layout:'border',
				width:50,
				height:530,
				objectExplorer:objectExplorer,
				catalogue:catalogue,
				hidden:true
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
			function getTbar(){
				return Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							DigiCompass.Web.app.spectrumRegion.cleanFormData();
							var formPanel = DigiCompass.Web.app.spectrumRegion.addFormPanel();
							formPanel.back.setValues({versionId : ''});
							formPanel.setTitle('Object Detail - Spectrum Region');
						}
					}, {
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							//var checkeds = DigiCompass.Web.app.spectrumRegion.checkRow;
							var checkeds = new Array();
							var checked = Ext.getCmp("spectrumRegionExplorer").getChecked();
							for(var i = 0 ; i<checked.length ; i++){
								checkeds.push(checked[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
							} else {
								var _btn = this;
								_btn.disable();
								cometdfn.request({MODULE_TYPE:'MOD_SPECTRUM_REGION',COMMAND:'COMMAND_DEL', ids:checkeds},
										function(message){
									_btn.enable();
									if (ServerMessageProcess(message)) {
										cometdfn.publish({MODULE_TYPE : 'MOD_SPECTRUM_REGION',COMMAND : 'COMMAND_QUERY_LIST'});
									}
								});
							}
						}
					}]
				});
			}
			objectExplorer.addDocked(getTbar());
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			objectExplorer.addListener('itemclick', function(grid , record , item , index,event,eOpts){
				var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
				if(isChecked){
					return;
				}
				if(Ext.isEmpty(record.data.id)){
					return;
				}
				var spectrumRegionId = record.data.id;
				cometdfn.request({
					MODULE_TYPE : "MOD_SPECTRUM_REGION",
					COMMAND : 'COMMAND_QUERY_INFO',
					id : spectrumRegionId
				},function(message){
					if(message.BUSINESS_DATA){
						DigiCompass.Web.app.spectrumRegion.reference = message.BUSINESS_DATA.reference;
						var _info = Ext.JSON.decode(message.BUSINESS_DATA.data);
						console.log("这是打开的信息",_info);
						
						var formPanel = DigiCompass.Web.app.spectrumRegion.addFormPanel();
						formPanel.setTitle('Object Detail - Spectrum Region ('+_info.name+')');
						DigiCompass.Web.app.spectrumRegion.cleanFormData();
						formPanel.front.getForm().setValues(_info);
						formPanel.back.setValues({versionId : _info.id});
						if(!_info.siteType){
							_info.siteType = [];
						}
						var i = 0;
						for(;i< _info.siteType.length;i++){
							_info.siteType[i].order = i+1;
						}
						_info.siteType.push({id:null, name:null,order:i+1,description:null});
						Ext.getCmp('siteTypeGrid').getStore().loadData(_info.siteType);
					}
				});
			});
		}
		/*
		var formPanel = DigiCompass.Web.app.spectrumRegion.addFormPanel();
		// 将Panel添加在右边Panel上
		Ext.getCmp('obj-details').add(formPanel);
		*/
			/*var sm = Ext.create('Ext.selection.CheckboxModel', {
						checkOnly : false
					});
			var grid = Ext.create('Ext.grid.Panel', {
				id : 'objExpPanel_spectrumRegionID',
				title : 'spectrumRegion',
				tbar : [],
				//selModel : sm,
				store : myStore,
				height : 700,
				columns : columns,
				tbar : [{
					xtype : 'button',
					text : 'New',
					iconCls : 'icon-add',
					handler : function() {
						// 展示右边面板
						DigiCompass.Web.UI.Wheel.showDetail();
						
						// 创建自己的Panel
						var formPanel = DigiCompass.Web.app.spectrumRegion
								.addFormPanel(null);
						// 将Panel添加在右边Panel上
						Ext.getCmp('obj-details').add(formPanel);
						DigiCompass.Web.app.spectrumRegion.cleanFormData();

					}
				}, {
					xtype : 'button',
					text : 'Delete',
					iconCls : 'icon-delete',
					handler : function() {
						var checkeds = DigiCompass.Web.app.spectrumRegion.checkRow;
						if (checkeds.length == 0) {
							alertWarring('Please select a record!');
						} else {
							var _btn = this;
							_btn.disable();
							cometdfn.request({MODULE_TYPE:'MOD_SPECTRUM_REGION',COMMAND:'COMMAND_DEL', ids:checkeds},
									function(message){
								_btn.enable();
								if (ServerMessageProcess(message)) {
									cometdfn.publish({MODULE_TYPE : 'MOD_SPECTRUM_REGION',COMMAND : 'COMMAND_QUERY_LIST'});
								}
							});
						}
					}
				}]
			});
			grid.addListener('itemclick', function(grid, record, item, index,
							e, eOpts) {

						var spectrumRegionId = record.data.id;
						// 展示右边面板
						DigiCompass.Web.UI.Wheel.showDetail();

						// 创建自己的Panel
						var formPanel = DigiCompass.Web.app.spectrumRegion
								.addFormPanel(spectrumRegionId);
						// 将Panel添加在右边Panel上
						Ext.getCmp('obj-details').add(formPanel);

					});

			var objExpPanel = Ext.getCmp('obj-exp');
			if (objExpPanel) {
				objExpPanel.add(grid);
			}
		}*/
	};
	
	DigiCompass.Web.app.spectrumRegion.cleanFormData = function(){
		if(Ext.getCmp('spectrumRegionAdd')){
			Ext.getCmp('spectrumRegionAdd').getForm().reset();
		}
		if(Ext.getCmp('siteTypeGrid')){
			Ext.getCmp('siteTypeGrid').getStore().loadData([{id:null, name:null,order:1,description:null}]);
		}
	}
	
	DigiCompass.Web.app.spectrumRegion.addFormPanel = function(spectrumRegionId) {
		
		var formPanel = Ext.getCmp('spectrumRegionAdd');
		if (formPanel) {
			DigiCompass.Web.app.spectrumRegion.cleanFormData();
			formPanel.show();
		}
		DigiCompass.Web.app.spectrumRegion.reference = 0;
		if(!formPanel){
			var datas = [];
			var store = Ext.create('Ext.data.ArrayStore', {
				data : [{id:null,order:null,name:null,description:null}],
				fields : ['id','order', 'name', 'description']
			});
			var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
			formPanel = Ext.create('Ext.form.Panel', {
				id : 'spectrumRegionAdd',
				defaultType : 'textfield',
				border : false,
				width : '100%',
				frame : false,
				//layout : 'anchor',
				fieldDefaults : {
					labelAlign : 'left',
					msgTarget : 'side',
					labelWidth : 100
				},
				items : [{
							id : "spectrumRegionId",
							xtype : "hidden",
							name : "id"
						},{
							margin : '10 0 0 10',
							columnWidth : .7,
							id : 'spectrumRegionName',
							allowBlank : false,
							emptyText : "Please input data!",
							fieldLabel : 'Name',
							maxLength:30,
							msgTarget : 'side',
							name : 'name'
						},{
							margin : '10 0 0 10',
							columnWidth : .7,
							id : 'spectrumRegionDescription',
							allowBlank : true,
							fieldLabel : 'Description',
							maxLength:30,
							msgTarget : 'side',
							name : 'description'
						},  {
							id : 'siteTypeGrid',
							selType : 'cellmodel',
							plugins : [cellEditing],
							xtype : 'gridpanel',
							height : 563,
//							width : '100%',
							store : store,
							margin : '20 5 10 5',
							title : 'Site Type',
							columns : [{
								width : 40,
								text : 'No',
								sortable : true,
								dataIndex : 'order'
							}, {
								width : 200,
								text : 'Name',
								sortable : true,
								dataIndex : 'name',
								editor : {
									allowBlank : false,
									maxLength:30
								}
	
							}, {
								width : 240,
								text : 'Description',
								sortable : true,
								dataIndex : 'description',
								editor : {
									allowBlank : false,
									maxLength:30
								}
							}],
							tbar : [/* {
								text : 'Add',
								handler : function() {
									var store = Ext.getCmp('siteTypeGrid').getStore();
									var maxOrder = 0;
									for(var i=0; i<store.getCount(); i++){
										var _data = store.getAt(i).getData();
										if(_data.order>maxOrder){
											maxOrder = _data.order;
										}
									}
									store.add({id:null, name:null,order:maxOrder+1,description:null});
								}
							},*/{
								text : 'remove',
								handler : function() {
									var grid = Ext.getCmp('siteTypeGrid');
									var selection = grid.getSelectionModel().getSelection();
									if(selection.length>0){
										for(var i in selection){
											if(Ext.isEmpty(selection[i].data.id) || DigiCompass.Web.app.spectrumRegion.reference==0){
												grid.store.remove(selection[i]);
											}else{
												alertWarring('Site Type has be used, can not be removed.');
											}
										}
									}
								}
							}], listeners : {
								itemClick : function(a,b,m,rindex){
									var store = this.getStore();
									if(rindex+1 === store.getCount()){
										store.add({id:null, name:null,order:store.getCount() + 1,description:null});
									}
								}
							}
						}]
			});
			
			
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
//				height : '722',
				front : formPanel,
				back : new DigiCompass.Web.app.VersionForm({edit : false})
			});
			reversalPanel.addToolBar('spectrumRegion', new Ext.toolbar.Toolbar({
				items : [{
					columnWidth : .3,
//					margin : '10 0 0 10',
					xtype : 'button',
					text : 'save',
					iconCls:'icon-save',
					handler : function() {
						if (formPanel.getForm().isValid()) {
							var _btn = this;
							_btn.disable();
							var data = formPanel.getForm().getValues();
							var siteTypes = DigiCompass.Web.app.sitegroup.getStoreData(Ext.getCmp('siteTypeGrid'));
							var st = [];
							for(var i=0; i<siteTypes.length; i++){
								if(!Ext.isEmpty(siteTypes[i].name) || (Ext.isEmpty(siteTypes[i].name) && !Ext.isEmpty(siteTypes[i].id))){
									st.push(siteTypes[i]);
								}else if(!Ext.isEmpty(siteTypes[i].id)){
									alertError('Please input the Site Type Name!');
									return;
								}
							}
							data.siteType = st;
							cometdfn.request({
									MODULE_TYPE : "MOD_SPECTRUM_REGION",
									COMMAND : 'COMMAND_SAVE',
									data : Ext.JSON.encode(data)
								},function(message){
									_btn.enable();
									if (DigiCompass.Web.app.checkResult(formPanel, message)) {
										DigiCompass.Web.app.spectrumRegion.cleanFormData();
										cometdfn.publish({MODULE_TYPE : 'MOD_SPECTRUM_REGION',COMMAND : 'COMMAND_QUERY_LIST'});
										reversalPanel.hide();
									}
							});
						}
					}
				}]
			}));
			Ext.getCmp('obj-details').add(reversalPanel);
		}
		formPanel.reversalPanel.show();
		return formPanel.reversalPanel;
	}
	DigiCompass.Web.app.spectrumRegion.saveSuccess = function(data, Conf,
			fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			alertSuccess('Save Data Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.spectrumRegionPublish(queryParam);
			var formPanel = DigiCompass.Web.app.spectrumRegion.addFormPanel(null);
			Ext.getCmp('obj-details').add(formPanel);
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	DigiCompass.Web.app.spectrumRegion.deleteSuccess = function(data, Conf, fnName,
			command) {
		var status = data.STATUS;
		if (status === "success") {
			alertSuccess('Delete Data Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.spectrumRegionPublish(queryParam);
			var formPanel = DigiCompass.Web.app.spectrumRegion.addFormPanel(null);
			Ext.getCmp('obj-details').add(formPanel);
		} else if(data.customException){
			alertError(data.customException);
		}
	}
})();