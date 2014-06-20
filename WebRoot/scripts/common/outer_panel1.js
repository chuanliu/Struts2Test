Ext.define('DigiCompass.Web.ux.outerPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.outerPanel',
	module:'',
	command:'',
	otherParam:{},
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
			 * 鍙戦�璇锋眰锛屾嫾瑁呮暟鎹�
			 */
			catalogue.groupedFields = groupItems;
			var param = me.otherParam;
			param.MODULE_TYPE = me.module;
			param.COMMAND = me.command;
			cometdfn.publish(param);
			catalogue.getRootNode().removeAll();
			catalogue.setVisible(true);
			if(catalogue.outerPanel){
				catalogue.outerPanel.setVisible(true);
			}
		});
		me.addObjectExplorer(objectExplorer);
	},
	addObjectExplorer:function(panel){
		var me = this;
		panel.module = me.module;
		panel.command = me.command;
		panel.otherParam = me.otherParam;
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
		panel.module = me.module;
		panel.command = me.command;
		panel.otherParam = me.otherParam;
		
		catalogue = panel;
		if(catalogue.getId()!= me.catalogue.getId()){
			me.catalogue.destroy();
		}
		catalogue.on('checkchange', function(node, checked) {  
			DigiCompass.Web.TreeUtil.checkchild(node,checked);  
			DigiCompass.Web.TreeUtil.checkparent(node);  
			var checked = catalogue.getChecked();
			var data = new Array();
			for(var i in checked){
				if(Ext.isEmpty(checked[i].childNodes)){
					data = data.concat(checked[i].raw.childrenDataArray);
				}
			}
			var selected = objectExplorer.getSelectionModel().getSelection();
			var selectedData = new Array();
			for(var i = 0 ; i<selected.length ; i++){
				selectedData.push(selected[i].data);
			}
			objectExplorer.checkedData = selectedData;
			objectExplorer.reconfigData(data);
	    });
		me.catalogue = catalogue;
	},
	reconfigData : function(data){
		var me = this;
		me.catalogue.resetRootNode(Ext.clone(data));
		me.objectExplorer.reconfigData(Ext.clone(data));
	},
	reconfigure:function(data,column,fields){
		var me = this,
		catalogue = me.catalogue,
		objectExplorer = me.objectExplorer;
		objectExplorer.reconfigure(Ext.clone(data),column);
		catalogue.resetRootNode(Ext.clone(data));
	},
	setParameter:function(param){
		var me = this;
		me.module = param.module;
		me.command = param.command;
		me.otherParam = param.otherParam;
		var children = me.items ? me.items.items : [];
		for(var i = 0 ; i<children.length ; i++){
			children[i].setParameter(param);
		}
	},
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