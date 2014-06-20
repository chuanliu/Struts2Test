(function() {

	Ext.namespace('DigiCompass.Web.UI');
	
	/*
	 * var config = { 
	 * MODULE_TYPE : "EFORM_MODULE", 
	 * COMMAND : "COMMAND", 
	 * fields : [], 
	 * columns : []
	 * title : "123",
	 * };
	 */

	function ObjectExplorer(config) {		
		this.MODULE_TYPE = config.MODULE_TYPE; 
		this.COMMAND = config.COMMAND; 
		this.fields = config.fields;
		this.columns = config.columns;
		this.title = config.title;
		this.gid = "objOutPanel" + Ext.id();
	}

	ObjectExplorer.prototype.show = function() {
		this.reqData();
	}

	ObjectExplorer.prototype.reqData = function() {
		var objExp = this;
		var message = {};
		message.MODULE_TYPE = objExp.MODULE_TYPE;
		message.COMMAND = objExp.COMMAND;
		cometdfn.request(message, function(data, Conf) {
			var status = data.STATUS;
			if (status === "success") {
				var _data = data.BUSINESS_DATA.list;
				var datas = Ext.JSON.decode(_data);
				objExp.showObjExp(datas);
			} else if (data.customException) {
				alertError(data.customException);
			}
		});
	}

	ObjectExplorer.prototype.showObjExp = function(datas) {

		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}

		var objectExplorer = this.getObjExp(datas);
		objExpPanel.add(objectExplorer);
	};

	ObjectExplorer.prototype.getTbar = function() {
		
		var objExp = this;

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
											objExp.showDetailPanel();
										}
									},
									{
										xtype : 'button',
										text : 'Delete',
										iconCls : 'icon-delete',
										handler : function() {
											var checked = Ext
													.getCmp(objExp.gid).objectExplorer
													.getChecked();
											var ids = new Array();
											if (checked.length == 0) {
												Ext.Msg
														.alert('Warning',
																'Please select a record!');
											} else {
												for ( var i = 0; i < checked.length; i++) {
													ids.push(checked[i].id);
												}
												alertOkorCancel(
														'Are you sure to delete selected records?',
														function(e) {
															if (e == 'yes') {
																var message = {};
																message.ids = ids;
																message.MODULE_TYPE = objExp.MODULE_TYPE;
																message.COMMAND = 'COMMAND_DEL';
																cometdfn
																		.request(
																				message,
																				function(
																						data,
																						Conf) {
																					var status = data.STATUS;
																					if (status === "success") {
																						Ext
																								.getCmp(
																										'obj-details')
																								.removeAll();
																						objExp.show();
																						alertSuccess('Delete Data Successful!');
																					} else if (data.customException) {
																						alertError(data.customException);
																					}
																				});
															}
														});
											}
										}
									} ]
						});
	};

	ObjectExplorer.prototype.getObjExp = function(datas) {
		var objExp = this;

		var cataloguePanel = Ext.getCmp("obj-cat");
		if (cataloguePanel) {
			// 移除组建
			cataloguePanel.removeAll();
		}

		var columns = Ext.clone(objExp.columns);
		var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer', {
			columns : columns,
			fields : objExp.fields,
			width : "fit",
			height : 700,
			data : []
		});

		var catalogue = Ext.create('DigiCompass.Web.ux.catalogue', {
			width : "fit",
			height : 730,
			data : [],
			collapsible : true,
			split : true,
			region : 'center',
			hidden : true
		});
		var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel', {
			id : objExp.gid,
			module : objExp.MODULE_TYPE,
			command : objExp.COMMAND,
			otherParam : {},
			region : 'west',
			layout : 'border',
			width : 50,
			height : 530,
			objectExplorer : objectExplorer,
			catalogue : catalogue,
			hidden : true
		});

		cataloguePanel.add(catalogue);
		catalogue.outerPanel = cataloguePanel;
		cataloguePanel.add(mainPanel);

		var tbar = objExp.getTbar();
		objectExplorer.addDocked(tbar);

		objectExplorer.on('checkchange', function(node, checked) {
			objectExplorer.checkchild(node, checked);
			objectExplorer.checkparent(node);
		});

		objectExplorer.addListener('itemclick', function(grid, record, item,
				index, event, eOpts) {
			var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
			if (isChecked) {
				return;
			}
			if (Ext.isEmpty(record.data.id)) {
				return;
			}
			objExp.showDetailPanel(record.data);
		});

		if(datas){
			if (Ext.getCmp(objExp.gid)) {
				Ext.getCmp(objExp.gid).reconfigData(datas);
			} else {
				mainPanel.reconfigData(datas);
			}
		}
		return objectExplorer;
	};

	ObjectExplorer.prototype.showDetailPanel = function(obj) {
		var objExp = this;

		var objDetailPanel = Ext.getCmp('obj-details');
		if (objDetailPanel) {
			// 移除组建
			objDetailPanel.removeAll();
		}
		// 展示右边面板
		DigiCompass.Web.UI.Wheel.showDetail();
		var detailPanel = Ext.create('Ext.panel.Panel', {
			layout : {
				type : 'vbox',
				align : 'stretch'
			}
		});
		var version = "";
		var obj_id = "";
		var tname = objExp.title;
		var ptitle = "Object Detail - " + tname;
		if (obj) {
			version = obj.name;
			obj_id = obj.id;
			ptitle = ptitle + "(" + version + ")";
		}
		var ReversalPanel = new DigiCompass.Web.app.ReversalPanel({
			panelTitle : ptitle,
			height : 700,
			front : detailPanel,
			back : new DigiCompass.Web.app.VersionForm({
				qrCode : obj_id
			})
		});
		objDetailPanel.add(ReversalPanel);
		obj = Ext.clone(obj);		
		if(objExp.detailPanelAddComponent){
			objExp.detailPanelAddComponent.apply(objExp, [detailPanel, obj]);
		}
	};
	
	DigiCompass.Web.UI.ObjectExplorer = ObjectExplorer;
})();