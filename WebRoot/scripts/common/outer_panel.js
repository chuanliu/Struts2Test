Ext.define('DigiCompass.Web.ux.outerPanelExt', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.outerPanel',
	layout:"border",
	objectExplorer:null,
	catalogue:null,
	initComponent : function() {
		var me = this,
			//tbar = me.tbar,
			objectExplorer = me.objectExplorer,
			catalogue = me.catalogue,
			objectTbar = objectExplorer.tbar;
		
		if(Ext.isEmpty(objectTbar)){
			objectTbar = [];
		}
		
		objectExplorer.addDocked(
				Ext.create('Ext.toolbar.Toolbar',{
						width:200,
						items:[{
							xtype:'button',
							text:'clear grouping',
							handler:function(){
								catalogue.setVisible(false);
								if(catalogue.outerPanel){
									catalogue.outerPanel.setVisible(false);
								}
								objectExplorer.cleanGrouping();
							}
						}]
				})
		);
		DigiCompass.Web.ux.outerPanel.superclass.initComponent.apply(this, arguments);
		me.addCatalogue(catalogue);
		objectExplorer.addListener('group',function(){
			objectExplorer = me.getObjectExplorer();
			catalogue = me.getCatalogue();
			if(!objectExplorer|| !catalogue){
				return;
			}
			
			var groupItems = objectExplorer.getGroupField();
			var checkedData = objectExplorer.getChecked();
			catalogue.checkedData = checkedData;
			/**
			 * 发送请求，拼装数据
			 */
			catalogue.groupedFields = groupItems;
			var objParam = {};
			for(var key in objectExplorer.otherParam){
				objParam[key] = objectExplorer.otherParam[key];
			}
			objParam.MODULE_TYPE = objectExplorer.module;
			objParam.COMMAND = objectExplorer.command;
			objParam.treeNode = objectExplorer.treeColumn;
			objParam.checked = objectExplorer.getChecked();
			objParam.groupFields = objectExplorer.getGroupField();
			cometdfn.publish(objParam);
			
			var catalogueParam = {};
			for(var key in catalogue.otherParam){
				catalogueParam[key] = catalogue.otherParam[key];
			}
			catalogueParam.MODULE_TYPE = catalogue.module;
			catalogueParam.COMMAND = catalogue.command;
			catalogueParam.groupFields = objectExplorer.getGroupField();
			cometdfn.publish(catalogueParam);
			objectExplorer.setRootNode({});
			catalogue.setRootNode({});

			//catalogue.getRootNode().removeAll();
			catalogue.setVisible(true);
			if(catalogue.outerPanel){
				catalogue.outerPanel.setVisible(true);
			}
		});
		me.addObjectExplorer(objectExplorer);
	},
	addObjectExplorer:function(panel){
		var me = this;
		objectExplorer = panel;
		if(objectExplorer.getId()!= me.objectExplorer.getId()){
			me.objectExplorer.destroy();
		}
		//me.insert(0,panel);
		me.objectExplorer = objectExplorer;
	},
	addCatalogue:function(panel){
		var me = this,
		objectExplorer = me.objectExplorer;
		
		catalogue = panel;
		if(catalogue.getId()!= me.catalogue.getId()){
			me.catalogue.destroy();
		}
		catalogue.on('checkchange', function(node, checked) {  
			DigiCompass.Web.TreeUtil.checkchild(node,checked);  
			DigiCompass.Web.TreeUtil.checkparent(node);  
			var checked = catalogue.getChecked();
			var checkedArr = new Array();
			var checkedColumn;
			for(var key in checked){
				if(Ext.isEmpty(checked[key].childNodes)){
					if(Ext.isEmpty(checkedColumn)){
						checkedColumn = checked[key].raw.GroupColumn;
					}
					var text = checked[key].raw.text == null ? "" : checked[key].raw.text;
					checkedArr.push(text);
				}
			}
			var param = {};
			for(var key in objectExplorer.otherParam){
				param[key] = objectExplorer.otherParam[key];
			}
			if(!catalogue.getRootNode().data.checked){
				param.checkedColumn = checkedColumn;
				param.checkedParam = checkedArr;
			}
			param.MODULE_TYPE = objectExplorer.module;
			param.COMMAND = objectExplorer.command;
			param.treeNode = objectExplorer.treeColumn;
			param.checked = objectExplorer.getChecked();
			param.groupFields = objectExplorer.getGroupField();
			cometdfn.publish(param);
		});
		me.catalogue = catalogue;
	},
	reconfigData : function(cataData,objData){
		var me = this;
		me.catalogue.resetRootNode(Ext.clone(cataData));
		me.objectExplorer.reconfigData(Ext.clone(objData));
	},/*
	reconfigure:function(data,column,fields){
		var me = this,
		catalogue = me.catalogue,
		objectExplorer = me.objectExplorer;
		objectExplorer.reconfigure(Ext.clone(data),column);
		catalogue.resetRootNode(Ext.clone(data));
	},*/
	getCatalogue:function(){
		var me = this;
		return me.catalogue; 
	},
	getObjectExplorer:function(){
		var me = this;
		return me.objectExplorer;
	},
	getCataloguePanelVisible:function(){
		var me = this,
		objectExplorer = me.objectExplorer,
		groupers = objectExplorer.getGroupField();
		if(Ext.isEmpty(groupers)){
			return false;
		}
		else{
			return true;
		}
	}
});