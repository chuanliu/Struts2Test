Ext.define('DigiCompass.Web.ux.catalogueExt', {
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
			param = {};
		for(var key in me.otherParam){
			param[key] = me.otherParam[key];
		}
		param.MODULE_TYPE = me.module;
		param.COMMAND = me.command;
		param.queryParam = name;
		param.groupFields = me.groupedFields;
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
		//me.tbar = ['Search: ', ' ', searchField];
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
		var me = this;//,
		data.checked = true;
		data.expanded = true;
		me.setRootNode(data);
		var d = new Date();
		console.log(d);
		me.expandAll();
		//me.getRootNode().expand(true);
		console.log((new Date()-d)+'-----catalogue');
	},
	setParameter:function(param){
		var me = this;
		me.module = param.module;
		me.command = param.command;
		me.otherParam = param.otherParam;
	}
});