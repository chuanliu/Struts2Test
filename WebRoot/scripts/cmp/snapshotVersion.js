Ext.namespace('DigiCompass.Web.UI.SnapshotVersion');

DigiCompass.Web.UI.SnapshotVersion.init = function(data) {
	if (data.BUSINESS_DATA && data.BUSINESS_DATA instanceof Object) {
		return;
	}
	var datas = Ext.JSON.decode(data.BUSINESS_DATA);
	var fields = ['id','name','date','description', 'reference'];
	var columns = [{ xtype : 'treecolumn', header : 'Name', dataIndex : 'name'		
		},
	               { header : 'Date', dataIndex : 'date'},
	               { header : 'Reference', dataIndex : 'reference'}];
	if(Ext.getCmp("objExpPanel_snapshotVersionID")){
		Ext.getCmp("objExpPanel_snapshotVersionID").reconfigData(datas);
	}
	else{
		var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
			columns:columns,
			id:"snapShotVersionExplorer",
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
			id:"snapShotVersionCatalogue",
			height:730,
			data:[],
			collapsible: true,
			split:true,
			region:'center',
			hidden:true
		});
		var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
			id : 'objExpPanel_snapshotVersionID',
			module:'MOD_SNAPSHOT_VERSION',
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
						DigiCompass.Web.UI.SnapshotVersion.getDetail('Object Detail - Snapshot');
					}
				},{
					xtype : 'button',
					text : 'Delete',
					iconCls : 'icon-delete',
					handler : function() {
						var _btn = this;
						var checked = Ext.getCmp("snapShotVersionExplorer").getChecked();
						var count = checked.length;				
						if(count == 0){
							Ext.Msg.alert('Warning','Please select a record!');
						}else{
							var snapshotVersionIDs = new Array();
							for(var i = 0 ; i <checked.length ; i++ ){
								snapshotVersionIDs.push(checked[i].id);
							}
							alertOkorCancel('Are you sure to delete selected snapshot version?',function(e){
								if(e == 'yes'){
									var formData = {};
									formData.snapshotVersionIDs = snapshotVersionIDs;
									formData.MODULE_TYPE = 'MOD_SNAPSHOT_VERSION';
									formData.COMMAND = 'COMMAND_DEL';
									_btn.disable();
									cometdfn.request(formData, function(data){
										_btn.enable();
										var status = data.STATUS ;
										if(status === "success"){
											var loadMask = Ext.create('Ext.LoadMask', document.body, {    
												msg: 'Data Processing...'
											});
											
											if (!data._end && data._confirm === 'ok') {
												loadMask.show();
										    } else {
										    	loadMask.hide();
										    	Ext.getCmp('obj-details').removeAll();
												var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
												DigiCompass.Web.UI.CometdPublish.SnapshotVersioinPublish(queryParam);
												alertSuccess('Delete Data Successful!');
										    }
										}else if(data.customException){
											alertError(data.customException);
										}
									});
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
			DigiCompass.Web.UI.SnapshotVersion.getDetail('Object Detail - Snapshot ('+record.get('name')+')', record.data);
		});
	}
}

DigiCompass.Web.UI.SnapshotVersion.getDetail = function(title, data){
	var detail = Ext.getCmp("objExpPanel_snapshotVersion_Detail_FORM_ID");
	if(detail){
		detail.reversalPanel.setTitle(title);
	}else{
		var objExpDetailsPanel = Ext.getCmp('obj-details');
		if (objExpDetailsPanel) {
			// 移除组建
			objExpDetailsPanel.removeAll();
			// 展示右边面板
			DigiCompass.Web.UI.Wheel.showDetail();
			
			// 创建自己的Panel
			detail = Ext.create('Ext.form.Panel', {
				id : 'objExpPanel_snapshotVersion_Detail_FORM_ID',
				defaultType : 'textfield',
				collapsible : false,
				border : false,
				width : '100%',
				frame : false,
	//			layout : 'anchor',
				buttonAlign : 'left',
				fieldDefaults : {
					labelAlign : 'right',
					labelWidth : 110,
					msgTarget : 'side'
				},
				items : [{
							xtype : "hidden",
							name : 'id'
						},{
							id : 'snapshotVersionNameId',
							margin : '15 0 0 0',
							allowBlank : false,
							emptyText : "Please input Version Name!",
							fieldLabel : 'Version Name',
							fieldWidth : '100%',
							msgTarget : 'side',
							name : 'name',
							maxLength : 30
						},{
							id : 'objExpPanel_snapshotVersion_Detail_Form_Date',
							xtype : "displayfield",
							margin : '15 0 0 0',
							allowBlank : true,
							fieldLabel : 'Date',
							fieldWidth : '100%',
							msgTarget : 'side',
							hidden : true,
							name : 'date'
						},{
							id : 'snapshotTextAreaId',
							xtype : "textarea",
							margin : '15 0 20 0',
							allowBlank : true,
							fieldLabel : 'Description',
							fieldWidth : '100%',
							msgTarget : 'side',
							name : 'description',
							maxLength : 200
						}]
			});
			
			
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
				height : '722',
				panelTitle : title,
				front : detail ,
				back : new DigiCompass.Web.app.VersionForm({edit : false})
			});
			reversalPanel.addToolBar('snapshot', new Ext.toolbar.Toolbar({
				items : [{
					columnWidth : .3,
//					margin : '10 0 0 10',
					xtype : 'button',
					text : 'save',
					iconCls:'icon-save',
					handler : function() {
						if (detail.getForm().isValid()) {
							var _btn = this;
							var formData = Ext.clone(detail.getForm().getValues());
							formData.MODULE_TYPE = 'MOD_SNAPSHOT_VERSION';
							formData.COMMAND = 'COMMAND_SAVE';
							_btn.disable();
							cometdfn.request(formData, function(data){
								
								var loadMask = Ext.create('Ext.LoadMask', document.body, {    
									msg: 'Data Processing...'
								}); 
								
								if (!data._end && data._confirm === 'ok') {
							        Ext.getCmp('snapshotVersionNameId').setReadOnly(true);
							        Ext.getCmp('snapshotTextAreaId').setReadOnly(true);
							        
							        loadMask.show();
							    } else {
							        _btn.enable();
    								if(DigiCompass.Web.app.checkResult(detail, data)){
    									alertSuccess('Save successful!');
    									Ext.getCmp('snapshotVersionNameId').setReadOnly(false);
    							        Ext.getCmp('snapshotTextAreaId').setReadOnly(false);
    							        loadMask.hide();
    									
    									var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
    									DigiCompass.Web.UI.CometdPublish.SnapshotVersioinPublish(queryParam);
    									reversalPanel.setTitle('Object Detail - Snapshot');
    									reversalPanel.hide();
    									
    									
    								}
							    }
								
							});
						}
					}
				}
				]
			}));
			objExpDetailsPanel.add(reversalPanel);
		}
	}
	if(data){
		detail.getForm().setValues(data);
		detail.reversalPanel.back.setValues({versionId : data.id});
		Ext.getCmp('objExpPanel_snapshotVersion_Detail_Form_Date').show();
	}else{
		detail.getForm().reset();
		detail.reversalPanel.back.setValues({versionId : ''});
		Ext.getCmp('objExpPanel_snapshotVersion_Detail_Form_Date').hide();
	}
	detail.reversalPanel.show();
}
