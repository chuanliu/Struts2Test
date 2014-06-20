Ext.define('DigiCompass.Web.app.tree.Catalogue', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.catalogue',
	collapsible: true,
    frame : false,
    border : true,
    useArrows: false,
    rootVisible: true,
    multiSelect: true,
    groupers : null,
	viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            appendOnly: true
        }
    },
    _rootCfg : {
    	id : 'ROOT',
    	text : 'Root',
    	checked : true,
    	leaf : false,
    	groupDepth : -1,
    	children : []
    },
	constructor : function(config) {
		var me = this;
		if(!config.store){
			config.store = Ext.create('Ext.data.TreeStore', {    
				root: me._rootCfg,
				folderSort: true
		    });
		}
		me.addEvents({
	      "selectgroupchange" : true
	    });
		this.initConfig(config);
		me.callParent([config]);
		this.addListener('checkchange', function(node, sel){
			DigiCompass.Web.TreeUtil.checkchild(node, sel);
			DigiCompass.Web.TreeUtil.checkparent(node, sel);
			
			//延时处理
			if(me.timeouttmp){
				clearTimeout(me.timeouttmp);
				me.timeouttmp = null;
			}
			me.timeouttmp = setTimeout(function(){
				me.timeouttmp = null;
				me.fireEvent('selectgroupchange', me);
			}, 1000);
		});
	},
	getSelectedStatus : function(){
		var me = this, selectedStatus = {selected:[], unSelected:[]};
		root = me.getRootNode();
		me._fillSelectedStatus(root, selectedStatus);
		return selectedStatus;
	},
	_fillSelectedStatus : function(node, selectedStatus){
		var me = this, val, tmp = false;
		if(node.childNodes){
			for(var i=0; i<node.childNodes.length; i++){
				if(me._fillSelectedStatus(node.childNodes[i], selectedStatus)){
					tmp = true;
				}
			}
		}
		if(node.raw['groupDepth']>-1){
			val = me._getSelectedValue(node);
			if(node.get('checked')){
				selectedStatus.selected.push(val);
				return true;
			}else if(!tmp){
				selectedStatus.unSelected.push(val);
			}
		}
		return tmp;
	},
	_getSelectedValue : function(node){
		var val = [];
		while(node && node.raw['groupDepth'] > -1){
			val.splice(0,0, node.raw['groupVal']);
			node = node.parentNode;
		}
		return val;
	},
	_selectCatalogue : function(parent, catalogue, selected, depth){
		var has = false;
		for(var i =0; i<catalogue.length; i++){
			if(!catalogue['groupVal']){
				catalogue['checked'] = false;
			}else{
				catalogue['groupVals'] = parent ? parent[groupVals].concat([catalogue['groupVal']]) : [catalogue['groupVal']];
				if(selected.length>0){
					has = false;
					for(var j=0; j<selected.length; j++){
						if(selected.join('-') === catalogue['groupVals'].join('-')){
							has = true;
							break;
						}
					}
					catalogue['checked'] = has;
				}else{
					catalogue['checked'] = true;
				}
			}
		}
	},
	_checkCatalogue : function(catalogue, selected){
		var me = this;
		if(!Ext.isArray(catalogue)){
			catalogue = catalogue ? [catalogue] : [];
		}
		if(Ext.isArray(selected) && selected.length>0){
			me._selectCatalogue(parent, catalogue, selected, 0);
		}
		return catalogue;
	},
	loadCatalogue : function(catalogue, groupers, selected){
		var me = this, store = me.getStore(), root = me._rootCfg;
		me.groupers = groupers;
		me.checked = [];
		root.children = me._checkCatalogue(catalogue, selected);
		store.clearData();
		store.setRootNode(root);
		me.expandAll();
	},
	clear : function(){
		var me = this;
		me.checked = [];
		me.groupers = null;
		me.getStore().clearData();
	}
});

