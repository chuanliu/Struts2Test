Ext.define('DigiCompass.Web.ux.catalogue', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.catalogue',
	groupedFields:[],
	checkedData:[],
	data :[],
	module:'',
	command:'',
	otherParam:{},
	viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            appendOnly: true
        }
    },
	searchFn:function(name){
		var me = this,
			param = me.otherParam;
		param.MODULE_TYPE = me.module;
		param.COMMAND = me.command;
		param.queryParam = name;
		cometdfn.publish(param);
	},
	initComponent : function() {
		var me = this,
			treeStore,
			searchField,
			treeNodes,
			groupedFields = me.groupedFields;
			data = Ext.clone(me.data),
			checkedData = me.checkedData;
		
		me.checkedDataFn(checkedData,data);
		treeNodes = DigiCompass.Web.Util.convertToFolderTree(groupedFields,null, data);
		treeStore = Ext.create('Ext.data.TreeStore', {    
			root: {
					expanded: true,  
					checked : false,
		            children: treeNodes
			},
			folderSort: true
	    });
		searchField = Ext.create('Ext.ux.form.BtnSearchField',{
			width:150,
			onTrigger2Click : function(){
				var searchField = this,
					value = searchField.getValue();
				
				searchField.showCancelBtn();
				me.searchFn(value);
			},
			onTrigger1Click : function(){
				var searchField = this;
				value = searchField.getValue();
				searchField.hideCancelBtn();
				me.searchFn(value);
			}
		});
		me.tbar = ['Search: ', ' ', searchField];
		me.store = treeStore;
		DigiCompass.Web.ux.catalogue.superclass.initComponent.apply(this, arguments);
	},
	checkedDataFn:function(checkedData,data){
		for(var i = 0 ; i<checkedData.length ; i++){
			for(var j = 0 ; j<data.length ; j++){
				var equlsflag = true;
				for(var key in data[j]){
					if(data[j][key]!=checkedData[i][key]){
						equlsflag = false;
						break;
					}
				}
				if(equlsflag){
					data[j].checked = true;
				}
			}
		}
	},
	resetRootNode:function(data){
		var me = this,
			groupedFields = me.groupedFields,
			treeNodes,
			treeData = data;
			checkedData = me.checkedData,
			rootNode = me.getRootNode();
		if(Ext.isEmpty(groupedFields)){
			return;
		}
		for(var i = 0 ; i <data.length ; i++){
			data[i].checked = true;
		}
		rootNode.removeAll();
		me.checkedDataFn(checkedData,treeData);
		treeNodes = DigiCompass.Web.Util.convertToFolderTree(groupedFields,null, data);
		var root = {
				expanded: true,  
				children: treeNodes
			};
		me.getStore().setRootNode(root);
	},
	setParameter:function(param){
		var me = this;
		me.module = param.module;
		me.command = param.command;
		me.otherParam = param.otherParam;
	}
});