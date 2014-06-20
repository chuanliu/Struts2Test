Ext.define('DigiCompass.Web.app.grid.FlexView', {
	extend: 'Ext.panel.Panel',
	_catalogue : null,
	_flexViewCfg : null,
	target : null,
	_catalogueCfg : null,
	
	layout : 'border',
	bodyStyle: 'background:transparent;',
	border : false,
	collapsible : false,
    frame : false,
    useCatalogue : true,
	constructor : function(config) {
		var me = this, 
			catalogueCfg;
		config = config || {};
		
		catalogueCfg = {region:config.catalogueRegion || 'west', width : 200, hidden:true, title : 'Catalogue'}
		
		me._moveProperties(config, me, ['renderTo','width','height', 'id', 'title', 'collapsible', 'margin','anchor','flex']);
//		me._moveProperties(config, me, ['height']);
//		me._moveProperties(config, catalogueCfg, ['height']);
		
		
		if(catalogueCfg.region === 'west'){
			catalogueCfg.margin = '0 '+(config.catalogueSpacing || 0)+' 0 0';
		}else if(catalogueCfg.region === 'east'){
			catalogueCfg.margin = '0 0 0 '+(config.catalogueSpacing || 0);
		}
		
		me._catalogueCfg = catalogueCfg;
		me._flexViewCfg = Ext.applyIf(config, {region : 'center'});
		
		me.callParent([]);
	},
	initComponent : function(){
		var me = this;
		me.callParent(arguments);
		me.initFlexViewGrid(me._flexViewCfg);
	},
	initFlexViewGrid : function(cfg){
		var me = this;
		me.target = Ext.create('DigiCompass.Web.app.grid.FlexViewGrid', cfg);
		me.target.flexView = me;
		var store = me.target.getStore();
		store.mon(store, 'groupchanged' , me.onGroupChange, me);
		me.add(me.target);
	},
	initCatalogue : function(cfg){
		var me = this;
		me._catalogue = Ext.create('DigiCompass.Web.app.tree.Catalogue', cfg);
		me._catalogue.flexView = me;
		me._catalogue.addListener('selectgroupchange', me.onCatalogueSelect, me);
		me.add(me._catalogue);
	},
	getTarget : function(){
		return this.target;
	},
	onCatalogueSelect : function(catalogue){
		var me = this, selectedStatus, store = me.getStore();
		selectedStatus = catalogue.getSelectedStatus();
		me.target.store.groupSelected = selectedStatus.selected;
		me.target.store.groupUnSelected = selectedStatus.unSelected;
		me.reload(null, null, false);
//		if(store.buffered){
//			store.totalCount = 0;
//			store.pageMap.clear();
//			store.loadPage(1);
//		}else{
//			store.load();
//		}
	},
	
	onGroupChange : function(store, flexView){
		var me = this, tree = {}, summary, groupers;
		if(me.useCatalogue!==false){
			if(!me._catalogue){
				me.initCatalogue(me._catalogueCfg);
			}
			if(store.groupers.getCount()>0){
				groupers = [];
				store.groupers.each(function(group){
					groupers.push(group.property);
				});
				summary = Ext.clone(flexView.summary);
				me.paserCatalogueTree(tree, summary, -1);
				try{
					me._catalogue.show();
					me._catalogue.loadCatalogue(tree.children, groupers, me.target.store.groupSelected);
				}catch(e){
					console.log(e.message, e.stack)
				}
			}else{
				me._catalogue.hide();
				me._catalogue.clear();
			}
		}
	},
	getExtraParams : function(){
		var me = this,
		target = me.target;
		if(target && target.store && target.store.proxy && target.store.proxy.extraParams){
			return target.store.proxy.extraParams;
		}
	},
	paserCatalogueTree : function(parent, summarys, depth){
		var child , cNum = 0;
		if(!parent.children){
			parent.children = [];
		}
		if(!summarys){
			return 0;
		}
		for(var key in summarys){
			child = {text : key, checked : true, expanded:true, groupDepth : depth+1, groupVal : key, leaf:false};
			this.paserCatalogueTree(child, summarys[key], depth+1);
			parent.children.push(child);
			cNum ++;
		}
		return cNum;
	},
	_copyProperties : function(source, target, properties){
		return this._moveProperties(source, target, properties, false);
	},
	_moveProperties : function(source, target, properties, del){
		if(Ext.isString(properties)){
			if(source[properties] !== undefined && source[properties] !== null){
				target[properties] = source[properties];
				if(del !== false){
					delete source[properties];
				}
			}
		}else if(Ext.isArray(properties)){
			for(var i=0; i<properties.length; i++){
				this._moveProperties(source, target, properties[i], del);
			}
		}
	},
	destory : function(){
		var me = this;
		me._catalogue = null;
		me.target = null;
		me._flexViewCfg = null;
		me._catalogueCfg = null;
		
		me.callParent(arguments);
	},
	reload : function(param, module, clearParam){
		var store = this.getStore();
		if(clearParam === true){
			store.proxy.extraParams = param;
		}else{
			Ext.apply(store.proxy.extraParams, param || {});
		}
		Ext.apply(store.proxy.extraParams, {reload : true});
		if(module){
			if(module.moduleType){
				store.proxy.modules.read.moduleType = module.moduleType;
			}
			if(module.command){
				store.proxy.modules.read.command = module.command;
			}
		}
		if(store.buffered){
			store.totalCount = 0;
			store.pageMap.clear();
			store.loadPage(1);
		}else{
			store.load();
		}
	},
	getSelectionStatus : function(){
		var me = this, 
			checkAll = false, 
			selections=[], 
			groups=[], 
			selectGroups=[], 
			selModel = me.getSelectionModel(), 
			store = me.getStore(), 
			i = 0,
			catalogueStatus;
		for(i = 0; i < store.groupers.getCount(); i++){
			groups.push(store.groupers.getAt(i).property)
		}
		if(selModel.checkedAll === true){
			if(groups.length>0 && me._catalogue!=null && !me._catalogue.isHidden()){
				catalogueStatus = me._catalogue.getSelectedStatus();
				checkAll = catalogueStatus.unSelected.length === 0;
				if(!checkAll){
					selectGroups = catalogueStatus.selected;
				}
			}else{
				checkAll = true;
			}
		}else if(selModel.checkedAll === false){
			selections = selModel.getSelectionIndex();
			selectGroups = selModel.getGroupSelection();
		}
		return {
			checkAll : checkAll,
			selections : Ext.JSON.encode(selections),
			groups : Ext.JSON.encode(groups),
			groupSelections : Ext.JSON.encode(selectGroups)
		}
	},
	getSelectionModel : function(){
		return this.target.getSelectionModel();
	},
	getStore : function(){
		return this.target.getStore();
	},
    clearData : function(){
    	this.target.getStore().pageMap.clear();
    }
});