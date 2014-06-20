(function() {

	var namespace = Ext.namespace('DigiCompass.Web.app.polygon');
	
	namespace.checkRow = [];
	namespace.chek_box = function(check,event,id){
		if(check.checked){
			namespace.checkRow.push(id);
		}else{
			var checkeds = namespace.checkRow;
			for(var i = 0 ; i <checkeds.length ; i++){
				if(checkeds[i] == id){
					checkeds.splice(i,1);
				}
			}
		}
		event = event || window.event;
		event.stopPropagation();
	}
	
	// polygon getList method
	namespace.getList = function(data, config) {
		namespace.checkRow = [];
		var fields = ['id', 'version','reference'];
		var columns = [{
			xtype : 'treecolumn',
			header : 'Name',
			dataIndex : 'version',
			sortable : false,
			width : 130
		},{
			header : 'Reference',
			dataIndex : 'reference',
			sortable : false,
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
		
		if (Ext.getCmp('objExpPanel_polygonID')) {
			Ext.getCmp('objExpPanel_polygonID').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				id:"polygonExplorer",
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
				id:"polygonCatalogue",
				height:730,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'objExpPanel_polygonID',
				module:'MOD_POLYGON',
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
							namespace.cleanFormData();
							var formPanel = namespace.addFormPanel();
							formPanel.back.setValues({versionId : ''});
							formPanel.setTitle('Object Detail - Polygon');
						}
					}, {
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							//var checkeds = namespace.checkRow;
							var checkeds = new Array();
							var checked = Ext.getCmp("polygonExplorer").getChecked();
							for(var i = 0 ; i<checked.length ; i++){
								checkeds.push(checked[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
							} else {
								var _btn = this;
								_btn.disable();
								cometdfn.request({MODULE_TYPE:'MOD_POLYGON',COMMAND:'COMMAND_DEL', ids:checkeds},
										function(message){
									_btn.enable();
									
									namespace.deleteSuccess(message);
//									if (ServerMessageProcess(message)) {
//										cometdfn.publish({MODULE_TYPE : 'MOD_POLYGON',COMMAND : 'COMMAND_QUERY_LIST'});
//									}
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
				var polygonId = record.data.id;
				cometdfn.request({
					MODULE_TYPE : "MOD_POLYGON",
					COMMAND : 'COMMAND_QUERY_INFO',
					id : polygonId
				},function(message){
					if(message.BUSINESS_DATA){
						namespace.reference = message.BUSINESS_DATA.reference;
						var _info = Ext.JSON.decode(message.BUSINESS_DATA.data);
						var formPanel = namespace.addFormPanel();
						formPanel.setTitle('Object Detail - Polygon ('+_info.name+')');
						namespace.cleanFormData();
						formPanel.front.getForm().setValues(_info);
						formPanel.back.setValues({versionId : _info.id});
					}
				});
			});
		}
	};
	
	namespace.cleanFormData = function(){
		if(Ext.getCmp('polygonAdd')){
			Ext.getCmp('polygonAdd').getForm().reset();
		}
	}
	
	namespace.addFormPanel = function(polygonId) {
		var formPanel = Ext.getCmp('polygonAdd');
		if (formPanel) {
			namespace.cleanFormData();
			formPanel.show();
		}
		namespace.reference = 0;
		if(!formPanel){
			formPanel = Ext.create('Ext.form.Panel', {
				id : 'polygonAdd',
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
					id : "polygonId",
					xtype : "hidden",
					name : "id"
				},{
					margin : '10 0 0 10',
					columnWidth : .7,
					id : 'polygonName',
					allowBlank : false,
					emptyText : "Please input data!",
					fieldLabel : 'Name',
					maxLength:30,
					msgTarget : 'side',
					name : 'name'
				},{
					margin : '10 0 0 10',
					columnWidth : .7,
					id : 'polygonDescription',
					allowBlank : true,
					fieldLabel : 'Description',
					maxLength:30,
					msgTarget : 'side',
					name : 'description'
				}]
			});
			
			
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
				height : '722',
				front : formPanel,
				back : new DigiCompass.Web.app.VersionForm({edit : false})
			});
			reversalPanel.addToolBar('polygon', new Ext.toolbar.Toolbar({
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
							cometdfn.request({
									MODULE_TYPE : "MOD_POLYGON",
									COMMAND : 'COMMAND_SAVE',
									data : Ext.JSON.encode(data)
								},function(message){
									_btn.enable();
									if (DigiCompass.Web.app.checkResult(formPanel, message)) {
										namespace.cleanFormData();
										cometdfn.publish({MODULE_TYPE : 'MOD_POLYGON',COMMAND : 'COMMAND_QUERY_LIST'});
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
	namespace.saveSuccess = function(data) {
		var status = data.STATUS;
		if (status === "success") {
			alertSuccess('Save Data Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.polygonPublish(queryParam);
			var formPanel = namespace.addFormPanel(null);
			Ext.getCmp('obj-details').add(formPanel);
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	namespace.deleteSuccess = function(data) {
		var status = data.STATUS;
		if (status === "success") {
			alertSuccess('Delete Data Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.polygonPublish(queryParam);
			var formPanel = namespace.addFormPanel(null);
//			Ext.getCmp('obj-details').add(formPanel);
			Ext.getCmp('obj-details').removeAll();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
})();