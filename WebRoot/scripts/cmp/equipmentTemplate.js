(function(){
	var ns = Ext.namespace('DigiCompass.Web.app.equipmentTemplate');

	
	ns.getList = function(data, config) {
		var fields = ['id', 'version', 'description'];
		var columns = [{
					xtype : 'treecolumn',
					header : 'Version',
					dataIndex : 'version',
					sortable : false,
					flex: 1
				}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		if (Ext.getCmp('equipmentTemplateListView')) {
			Ext.getCmp('equipmentTemplateListView').reconfigData(datas);
		} else {
			  var tbar = Ext.create('Ext.toolbar.Toolbar',{
				    width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							
						}
					},{
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							
						}
					}]
				});
			
			  var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
					columns: columns,
					fields: fields,
					width: 'fit',
					height: 735,
					data: [],
					tbar: tbar,
					listeners : {
						itemclick : ns.clickFunction
					}
				});
			  	objectExplorer.on('checkchange', function(node, checked) {      
					objectExplorer.checkchild(node, checked);  
					objectExplorer.checkparent(node);  
		    	});  
				var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
					width: 'fit',
					height: 722,
					data: [],
					collapsible: true,
					split: true,
					region: 'center',
					hidden: true
				});
				var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
					id : 'equipmentTemplateListView',
					module: 'MOD_SITE_GROUP',
					command: 'COMMAND_QUERY_LIST',
					region: 'west',
					otherParam: {},
					layout: 'border',
					width: 400,
					height: 530,
					objectExplorer: objectExplorer,
					catalogue: catalogue,
					hidden: true
				});
				mainPanel.reconfigData(datas);
				var objExpPanel = Ext.getCmp('obj-exp');
				if (objExpPanel) {
					objExpPanel.removeAll();
				}
				var cataloguePanel = Ext.getCmp('obj-cat');
				if (cataloguePanel) {
					cataloguePanel.removeAll();
				}
//				function getTbar(){
//					return 
//				}
//				objectExplorer.addDocked(getTbar());
				objExpPanel.add(objectExplorer);
				cataloguePanel.add(catalogue);
				catalogue.outerPanel = cataloguePanel;
				cataloguePanel.add(mainPanel);
			    // 展示右边面板
			    DigiCompass.Web.UI.Wheel.showDetail();
			    // 创建自己的Panel
//				DigiCompass.Web.app.sitegroup.leftPanel = DigiCompass.Web.app.sitegroup.rightPanel();
		}
	}
	
	ns.clickFunction = function(grid, record, rowEl){
		
	}
	
})()