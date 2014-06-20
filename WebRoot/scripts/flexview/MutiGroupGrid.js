/****************************************************************************************
*There are multi classes in this file!
****************************************************************************************/


Ext.define('DigiCompass.Web.app.grid.MutiGroupGrid', {
	extend:'Ext.panel.Panel',
	alias: 'widget.mutigroupgrid',
	mixins: {
        observable: 'Ext.util.Observable'
    },

	layout : 'border',
	bodyStyle: 'background:transparent;',
	border : false,
	collapsible : false,
    frame : false,
    
	datagrid:undefined,
	filtergrid:undefined,
	
	feature1:undefined,
	feature2:undefined,
	
	target:undefined,
	seachField:undefined,

	
	constructor: function(cfg){
		var me = this,
		proxy;
		
		me.mixins.observable.constructor.call(this);
		
		moveProperties(cfg, me, ['renderTo','width','height', 'id', 'title', 'collapsible', 'margin','anchor','flex','region']);
		me.feature1 = Ext.create('Ext.grid.feature.MutiGrouping');
		me.feature1.panelCt=this; //hacker
		me.feature2 = Ext.create('Ext.grid.feature.MutiGroupingFilter');
		me.feature2.panelCt=this; //hacker
		
		me.initdatagrid(cfg);
		proxy = me.datagrid.getStore().getProxy();
		me.initfiltergrid(cfg,proxy.moduleType,proxy.getModules('read')['COMMAND'],proxy.extraParams);
		
		
		
		me.callParent([{items:[
		           			me.datagrid
		           			]}]);
	},
	
	initComponent:function(){
		var me = this,
			appendLoadMask;
		me.callParent(arguments);
		
		//bind event
		
		me.feature1.onChangeGroup = function (groupers){
			var expands = me.datagrid.store.mutiGroupParams.expands,
				extra = me.datagrid.store.proxy.extraParams;
			
			me.filtergrid.store.proxy.extraParams = extra;
			me.feature2.changeGroups(groupers,expands);
			
			if(me.feature1.groupers.length>0){
				if(me.isFiltergridShowed != true){
					me.add(me.filtergrid);
					me.isFiltergridShowed = true;
					me.fireEvent('catalogueshow');
				}	
			}else {
				me.remove(me.filtergrid,false);
				me.isFiltergridShowed = false;
				me.fireEvent('cataloguehide');
			}
			
			var selmodel1 = me.datagrid.getSelectionModel(),
		    	selmodel2 = me.filtergrid.getSelectionModel();
		
				if(selmodel1.clear) selmodel1.clear();
				if(selmodel2.clear) selmodel2.clear();
		};
		
		me.feature2.onChangeFilters = function (filters){
			me.feature1.changeFilters(filters);
		};
		
		
		me.datagrid.getStore().on('update',function(self, record, operation, modifiedFieldNames, eOpts ){
			me.selectionFix(record);
		});
		
		me.filtergrid.getStore().on('update',function(self, record, operation, modifiedFieldNames, eOpts ){
			me.selectionFix(record);
		});
		
		
		appendLoadMask = function(grid){
	    	var loadMarsk = null;
	    	var store = grid.getStore();
	    	store.addListener('beforeload', function(){
	    		if(loadMarsk == null){
		    		loadMarsk = new Ext.LoadMask(grid.getEl(), {
				    	msg : 'Loading...',
				    });
	    		}
	    		loadMarsk.show();
		    });
	    	store.addListener('beforeprefetch', function(){
	    		if(loadMarsk == null){
	    			loadMarsk = new Ext.LoadMask(grid.getEl(), {
	    				msg : 'Loading...',
	    			});
	    		}
	    		loadMarsk.show();
	    	});
	    	
		    store.addListener('load', function(){
		    	if(loadMarsk){
		    		loadMarsk.hide();
		    	}
		    });
		    store.addListener('prefetch', function(){
		    	if(loadMarsk){
		    		loadMarsk.hide();
		    	}
		    });			
	    };
		
		me.datagrid.addListener('afterrender', appendLoadMask);
		me.filtergrid.addListener('afterrender', appendLoadMask);
	},
	
	initdatagrid: function(o){
		var me = this,
			cfg = {},
			i;
		
		cfg.enableDragDrop = o.enableDragDrop;
		cfg.viewConfig = o.viewConfig;
		
		delete o.enableDragDrop;
		delete o.viewConfig;
		
		if(o.plugins){
			cfg.plugins = o.plugins;
			o.plugins = [];
			
			for(;i<cfg.plugins.length; i++){
				if(cfg.plugins[i] instanceof Ext.grid.plugin.Editing){
					cfg.plugins[i].addListener('beforeedit',function(editor, e, eOpts ){
						if(e.record.data.groupindex && e.record.data.groupindex!='') return false;
					});
				}
			}
		}
		if(o.listeners){
			cfg.listeners = o.listeners;
		}
		
		cfg.title = undefined;
		
		cfg.features = o.features;
		if(cfg.features == undefined) cfg.features =  [];	
		cfg.features.push(me.feature1);
		
		cfg.columns = o.columns || [];
		cfg.region = 'center';
		cfg.store = o.store;
		cfg.autoRender = true;
		
		cfg.tbar = o.tbar || [];
		
		if(cfg.viewConfig){
			cfg.viewConfig.loadMask = false;
		}else{
			cfg.viewConfig = {loadMask:false};
		} 
		
		//cfg.selModel =  me.selmodel = o.selModel||Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel',{mode:'MULTI'});
		
		
		if(o.autoCheckBox != false){
			cfg.selModel = o.selModel||Ext.create('DigiCompass.Web.app.MutiGroupCheckbox',{mode:'MULTI'});
		}
		
		
		//cfg.selModel = o.selModel||Ext.create('Ext.selection.CheckBoxModel',{mode:'MULTI'});
	
		if(! (cfg.store instanceof DigiCompass.Web.app.data.MutiGroupStore) ){

			cfg.store = Ext.create('DigiCompass.Web.app.data.MutiGroupStore',cfg.store);
			
		}
		
		me.datagrid = me.target = new Ext.grid.Panel(cfg);
		cfg.store.grid = me.datagrid;
		
		if(o.useSearch!==false){
			//search 
			me.searchField = Ext.create('Ext.ux.form.BtnSearchField',{
				margin : '0 3px',
				fieldLabel : 'Condition:',
				labelWidth : 56,
				onTrigger2Click : function(){
					var searchField = this,
						value = searchField.getValue();
					searchField.showCancelBtn();
					me.search(value);
				},
				onTrigger1Click : function(){
					var searchField = this;
					value = searchField.getValue();
					searchField.hideCancelBtn();
					me.search(value);
				}
			});
			me.datagrid.addDocked(new Ext.toolbar.Toolbar({
				layout:'fit',
				items:[me.searchField]
			}));
			var f = true;
			cfg.store.addListener('dataload', function(root){
				if(!f){ return;}
				jQuery("#"+me.searchField.getInputId()).atwho('@', {
					limit: 100,
				    data: root.searchFields
				});
				f = false;
			});
		}
		
		
		
		
		//set columns at frist read
		me.datagrid.getStore().getProxy().getReader().onFristRead = function(columns,pks){
			Ext.Array.each(columns,function(d){
				d.sortable = true;
				if(!d.width)d.width=100;
			});
			
        	me.datagrid.reconfigure(undefined,columns);
        	
        	me.initColumnSorter(me.datagrid.getView().headerCt,me.datagrid.getStore());
			
        	me.datagrid.selModel.pk = pks || ['id'];
        	
        	me.feature1.saveCols();
        
        	me.feature1.groupers = me.datagrid.store.mutiGroupParams.groupers;
        	me.feature1.expands = me.datagrid.store.mutiGroupParams.expands;
        	
        	me.feature1.pruneGroupedHeader();
        	
        	if(me.feature1.groupers.length>0){
        		var groupers = [];
        		var expands = [];
        		
        		Ext.Array.each(me.feature1.groupers,function(d){
        			groupers.push(d);
        		});
        		
        		Ext.Array.each(me.feature1.expands,function(d){
        			expands.push(d);
        		});
        		
        		me.feature2.expands = expands;
        		
        		me.feature1.onChangeGroup(groupers);
        	}      	
		};
	},
	
	initColumnSorter:function(headerCt,store){
		var headers = headerCt.getGridColumns(false);
		
		headerCt.setSortState=function(){};
		
		Ext.Array.each(headers,function(d){
			d.setSortState = function(state, skipClear, initial){
				if(skipClear==undefined) skipClear = true;
				if(initial==undefined) initial = false;
				Ext.grid.column.Column.prototype.setSortState.call(this,state, skipClear, initial);
				
				if(state==null) d.doSort(state);
			};
			
			d.possibleSortStates = ['ASC', 'DESC', null];
			
			d.doSort = function(state) {
				d.sortValue = {
			            property: this.getSortParam(),
			            direction: state
		        };
				store.reload();
		    };
		});
	},
	
	initfiltergrid: function(o,moduleType,command,extraParams){
		var me = this,
			cfg = {};
        
		cfg.features = o.features;
		if(cfg.features == undefined) cfg.features =  [];	
		cfg.features.push(me.feature2);
		
		cfg.title = 'Catalogue';
		
		cfg.columns = [{		
			text: "group",
			dataIndex: "value",
			minWidth:174
		}];
		cfg.viewConfig = {loadMask:false};
		cfg.region = 'west';
		cfg.width =  200;
		cfg.collapsible =  true,
		cfg.collapsed = false,
		cfg.store =new DigiCompass.Web.app.data.MutiGroupStore({
			dataType :2,
			buffered: true,
            pageSize: 100,
            proxy: {
                type: 'cometd.mutigroup',
                moduleType : moduleType,
                modules : {
                	read : {
               		 	command : command
               		}
                },
                extraParams:extraParams
            }
		});
		cfg.autoRender = true;
		cfg.selModel = Ext.create('DigiCompass.Web.app.MutiGroupFilterCheckbox',{mode:'MULTI'}),
		cfg.cls='d-grid-filter',
		
		
		me.filtergrid=new Ext.grid.Panel(cfg);
		me.filtergrid.getView().selectedItemCls+=' no-x-grid-row-selected';
		me.filtergrid.getView().headerCt.addCls('d-grid-group-header-hidden');
		

	},
	
	getStore: function(){
		return this.datagrid.getStore();
	},
	
	getTarget: function(){
		return this.target;
	},
	
	
	hasChecked:function(){
		var me = this,
		selmodel = me.datagrid.getSelectionModel(),
		store = me.getStore();
		
		if(store.getTotalCount()==0) return false;
		
		if(selmodel.checkedAll || selmodel.recordSelections.length>0 || selmodel.groupSelections.length>0) return true;
		
		return false;
	},
	
	selectionFix:function(record){
		var me = this,
			selmodel = me.datagrid.getSelectionModel();
		
		if(selmodel.isSelected(record)){
			selmodel.deselect(record,true);
			selmodel.select(record,true);
		} 
	},
	
	getSelectionStatus : function(){
		var me = this,
	        view = me.view,
			selmodel = me.datagrid.getSelectionModel(),
			store = me.getStore(),
			arr;
		
		arr=[];
		
		Ext.Array.each(selmodel.groupSelections,function(g){
			arr.push(g.split(','));
		});
		
		return {
			checkAll : selmodel.checkedAll,
			selections : selmodel.recordSelections,
			groups : store.mutiGroupParams.groupers,
			selectGroups : arr,
			search : me.searchField ? me.searchField.getValue() : null
		};
	},
	
	load : function(param, module, clearParam){
		var me = this,
			store1 = me.getStore(),
			selmodel1 = me.datagrid.getSelectionModel();
		if(selmodel1.clear) selmodel1.clear();
		me.reloadStore(param, module, clearParam,store1);
	},
	
	
	reload : function(param, module, clearParam){
		var me = this,
			store1 = me.getStore(),
			store2 = me.filtergrid.getStore(),
			selmodel1 = me.datagrid.getSelectionModel(),
		    selmodel2 = me.filtergrid.getSelectionModel();
		
		if(selmodel1.clear) selmodel1.clear();
		if(selmodel2.clear) selmodel2.clear();
		
		me.reloadStore(param, module, clearParam,store1);
		
		if(me.datagrid.store.mutiGroupParams.groupers.length>0){
			me.reloadStore(param, module, clearParam,store2);
		}
	},
	
	reloadStore:function(param, module, clearParam,store){

		
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
		
		//store.clearGroupParams();
		store.reload();
	},
	
	search:function(keywords){
		var me = this,
			store = me.getStore();
		
		Ext.apply(store.proxy.extraParams, {search:keywords});
		store.reload();
	}
	
});


/****************************************************************************************
*Ext.grid.feature.MutiGroupingFilter
****************************************************************************************/


Ext.define('Ext.grid.feature.MutiGroupingFilter', {
    extend: 'Ext.grid.feature.Grouping',

	grid:undefined,
	

	panelCt:undefined, //hacker, set in panelCt
	
	id:'id',
	
	reloading:false,
	
	refreshTimeout:undefined,
	
	 constructor : function() {
		 this.groupers=[];
		 this.expands=[];
		 this.filters=[];
		 
		 this.callParent(arguments);
	 },
	 
	
	attachEvents: function() {
        var me = this,
            view = me.view,
			selmodel = view.getSelectionModel(),
			store = me.view.store,
			refreshSel;

		//collapsed/expand
		view.addListener('beforeitemclick',function(view, record, item, index, e, eOpts){
			var classname=e.target.className;
			if(classname.indexOf('d-grid-group-collapsed')>0){
				me.expand(record.data.groupuid);
				return false;
			}else if(classname.indexOf('d-grid-group-expand')>0)
			{
				me.collapse(record.data.groupuid);
				return false;
			}else{
				return true;
			}
		});
		
		refreshSel = function(){
			store.each(function(record,index){
				var ancesstors = ',' + record.data.belongtogroup +',',
					isFilter = false;
				
				Ext.Array.each(me.filters,function(id,index) {
					if(ancesstors.indexOf(','+id+',') >= 0 || id == record.data.groupuid){
						isFilter=true;
						return false;
					}	
				});
				
				if(isFilter)
					selmodel.deselect(index,true,true);
				else
					selmodel.select(index,true,true);
			});
		}
		
		//filters
		view.addListener('refresh',function(view, opt){
			refreshSel();
		});
		
		selmodel.addListener('deselect',function(selModel, record, options){
			if(me.reloading) return; //hacker
			me.filters.push(record.data.groupuid);

			me.preChangeFilter();
			refreshSel();
		});
		
		selmodel.addListener('select',function(selModel, record, options){
			var ancesstors = ',' + record.data.belongtogroup +',';
			
			Ext.Array.each(me.filters,function(id,index) {
				if(id == record.data.groupuid || ancesstors.indexOf(','+id+',') >= 0 ){
					me.filters.splice(index,1);
				}
			});
			me.preChangeFilter();
			refreshSel();
		});
    },
	
	preChangeFilter: function(){
	
		var me = this;
		if(me.refreshTimeout) clearTimeout(me.refreshTimeout);
		
		me.refreshTimeout=setTimeout(function(){ me.onChangeFilters(me.filters);} , 600);
	},
	
	onChangeFilters:function(filters){
	
	},
	
	changeGroups:function(groupers,expands){
		var me = this,
			view = me.view;
			
		me.groupers = groupers;
		me.expands = expands || [];
		
		me.reloadStore();
	},
	
	reloadStore: function(){
		var me = this,
            view = me.view,
            store = view.store;
		
		
		store.mutiGroupParams.groupers = me.groupers;
		store.mutiGroupParams.expands = me.expands;
		

		store.reload();
	},
	
	collapse:function(groupuid){
		var me = this,
			index = me.expands.indexOf(groupuid);
			
		if(index >= 0){
			me.expands.splice(index,1);	
		}else{
			for(var i=0; i<me.expands.length;){
				var ans = ','+me.expands[i]+',';
				var uid = ','+groupuid+',';
				
				if(ans.indexOf(uid)>=0) me.expands.splice(i,1);
				else i++;
			}
		}
		
		me.reloadStore();
	},
	
	expand:function(groupuid){
		var me = this,
			index = me.expands.indexOf(groupuid);
			
		if(index < 0){
			me.expands.push(groupuid);
			
			me.reloadStore();
		}
	},
	
	collectData: function(records, preppedRecords, startIndex, fullWidth, o) {
        return o;
    },
	
	mutateMetaRowTpl:function(metaRowTpl)
	{
		metaRowTpl.unshift('{[this.if()]}');
		metaRowTpl.push('{[this.else()]}');
		
		metaRowTpl.push([
			'<tr class="' + Ext.baseCSSPrefix + 'grid-row " {[this.embedRowAttr()]}>',
				'<tpl for="columns">',
					'<td class="{cls} ' + Ext.baseCSSPrefix + 'grid-cell " {{id}-tdAttr} >',
						'<div class="' + Ext.baseCSSPrefix + 'grid-cell-inner {unselectableCls}  {[this.printIfGroupHeader(values,xindex)]}" style=" text-align: {align}; {{id}-style} margin-left:{[this.printMargin(values,xindex)]}px;">{[this.printGroupValue(values,xindex)]}</div>',
					'</td>',
					'{% if (xindex == 2) break; %}',
				'</tpl>',
			'</tr>'
		].join(''));
		metaRowTpl.push('{[this.endif()]}');
	},

	// Injects isRow and closeRow into the metaRowTpl.
    getMetaRowTplFragments: function() {
        return {
			if: function(){return [
				'<tpl if="false">'
			].join('')},
			else: function(){return [
				'<tpl else>'
			].join('')},
			endif: function(){return [
				'</tpl>'
			].join('')},
			printIfGroupHeader: function(values,xindex){
				if(xindex<=1) return '';
			return [	
				'{[this.ifGroupHeader(values,"'+values.dataIndex+'")]}'
			].join('')},
			printGroupValue: function(values,xindex){
				if(xindex<=1) return '{'+values.id+'}';
				return [
				'{[this.groupValue(values)]}'
			].join('')},
			printMargin: function(values,xindex){
				if(xindex<=1) return '';
				return [
				'{[this.margin(values)]}'
			].join('')}
			
			
		}
    },
	
	getFragmentTpl: function() {
		var me = this;
        return {
			margin:function(values){
				var index = me.groupers.indexOf(values.data.groupindex);

				return (index )*14;
			},
			groupValue:function(values){
				return values.data.groupvalue;
			},
			ifGroupHeader:function(values){
				var index = me.groupers.indexOf(values.data.groupindex);
				if(index == me.groupers.length - 1)
				{
					return 'd-grid-group-no-expand';
				}
				else if(values.data.groupexpand===true){
					return 'd-grid-group-expand';
				}else if(values.data.groupexpand===false){
					return 'd-grid-group-collapsed';
				}else{
					return 'd-grid-group-no-expand';
				}
				return '';
			}
        };
    },
	
});

/****************************************************************************************
*Ext.grid.feature.MutiGrouping
****************************************************************************************/

Ext.define('Ext.grid.feature.MutiGrouping', {
    extend: 'Ext.grid.feature.Grouping',
	
	grid:undefined,


	panelCt:undefined, //hacker, set in panelCt
	
	id:'groupuid',

    constructor: function(cfg) {
        var me = this;
		
		//@private
        me.groupers=[];
        me.expands=[];
        me.filters=[];
        me.widthMap={};

		me.cols=[];
		
		if(cfg && cfg.modelid) me.id = cfg.modelid;

        me.callParent(arguments);	
		
    },
    
    groupHeaderTpl: '{name}',

    groupByText : 'Group',
	ungroupByText: 'Ungroup',

    showGroupsText : 'Show in groups',
	
    
    

	
    // perhaps rename to afterViewRender
    attachEvents: function() {
        var me = this,
            view = me.view,
			selmodel = view.getSelectionModel(),
			store = me.view.store;

        me.injectGroupingMenu();
        
		//collapsed/expand
		view.addListener('beforeitemclick',function(view, record, item, index, e, eOpts){
			var classname=e.target.className;
			if(classname.indexOf('d-grid-group-collapsed')>0){
				me.expand(record.data.groupuid);
				return false;
			}else if(classname.indexOf('d-grid-group-expand')>0)
			{
				me.collapse(record.data.groupuid);
				return false;
			}else{
				return true;
			}
		});
		
		//persistedSelections
		
		if(selmodel instanceof DigiCompass.Web.app.MutiGroupCheckbox){
			me.addSelectionListeners();
		}
    },
    
    addSelectionListeners: function(){
    	 var me = this,
         	view = me.view,
			selmodel = view.getSelectionModel();
			
    	view.addListener('refresh',function(view, opt){
			me.refreshSelection();
		});
		
		
		view.headerCt.on('headerclick', function(headerCt, header, e){
			 if (header.isCheckerHd) {
				
				var me = this,
					selmodel = me.view.getSelectionModel(),
					hasCls = header.el.hasCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
					
				selmodel.checkedAll = !selmodel.checkedAll;
				if(selmodel.checkedAll)
				{
					selmodel.recordSelections.splice(0);
					selmodel.groupSelections.splice(0);
					if(!hasCls) header.el.addCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
				}else{
					header.el.removeCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
				}
				
				selmodel.allCheckEl = header.el;
				
				me.refreshSelection(true);
			}
		}, me);
		
		
		
		selmodel.addListener('select',function(selModel, rec, options){
			var selmodel = me.view.getSelectionModel(),
				recordid = '',
				ancesstors = '',
				index;
			
			if(rec.data.groupindex){
				Ext.Array.each(selmodel.groupSelections,function(gid,i){
					ancesstors = ',' + gid +',';
					index = ancesstors.indexOf(','+ rec.data.groupuid +',');
					if(index >= 0){
						selmodel.groupSelections.splice(index,1);
					}
				});
				
				store.each(function(r,i){
					ancesstors = ',' + r.data.belongtogroup +',';
					if(ancesstors.indexOf(','+ rec.data.groupuid +',')>=0){
						index = selmodel.recordSelections.indexOf(r.data.recordid);
						if(index >= 0){
							selmodel.recordSelections.splice(index,1);
						}
					}
				});
				
				selmodel.groupSelections.push(rec.data.groupuid);
				
				selmodel.checkedAll = false;
				me.refreshSelection();
			}else{
				selmodel.recordSelections.push(rec.data.recordid);
				selmodel.select(rec,true,true);
			}
		});
		
		selmodel.addListener('deselect',function(selModel, rec, options){
			var selmodel = me.view.getSelectionModel(),
			recordid = '',
			ancesstors = '',
			isVirtualSelect=true,
			isVirtualGroup=true;
			
			if(selmodel.checkedAll){
				selmodel.checkedAll = false;
				selmodel.recordSelections.splice(0);
				selmodel.groupSelections.splice(0);
				
				if(rec.data.groupindex){
					selmodel.groupSelections.push(rec.data.groupuid);
					selmodel.select(rec,true,true);
				}else{
					selmodel.recordSelections.push(rec.data.recordid);
					selmodel.select(rec,true,true);
				}		

				me.refreshSelection();
			}
			else if(rec.data.groupindex){
				
				Ext.Array.each(selmodel.groupSelections,function(id,i) {
					if(id == rec.data.groupuid){
						selmodel.groupSelections.splice(i,1);
						selmodel.deselect(rec,true,true);
						isVirtualGroup = false;
						return false;
					}
				});
				
				if(isVirtualGroup){
					
					Ext.Array.each(selmodel.groupSelections,function(g,i){
						ancesstors = ',' + rec.data.belongtogroup+',';
						if(ancesstors.indexOf(','+ g +',')>=0){
							selmodel.groupSelections.splice(i,1);
						}
					});
					
					selmodel.groupSelections.push(rec.data.groupuid);
					selmodel.select(rec,true,true);
				}
				
				me.refreshSelection();
			}else{
				
				Ext.Array.each(selmodel.recordSelections,function(id,i) {
					if(id == rec.data.recordid){
						selmodel.recordSelections.splice(i,1);
						selmodel.deselect(rec,true,true);
						isVirtualSelect = false;
						return false;
					}
				});
				
				if(isVirtualSelect){
					Ext.Array.each(selmodel.groupSelections,function(g,i){
						ancesstors = ',' + rec.data.belongtogroup+',';
						if(ancesstors.indexOf(','+ g +',')>=0){
							selmodel.groupSelections.splice(i,1);
						}
					});
					
					selmodel.recordSelections.push(rec.data.recordid);
					selmodel.select(rec,true,true);
					
					me.refreshSelection();
				}
			}
			
		});
    },
    
    refreshSelection : function(isDeselectAll){
		var me =this;
			view = me.view,
			selmodel = view.getSelectionModel(),
			store = me.view.store,
			selected = false;

		recordid = '',
		ancesstors = '';
		
		store.each(function(rec,index){
			selected = false;
			if(selmodel.checkedAll){
				selmodel.select(index,true,true);
			}else if(isDeselectAll){
				selmodel.deselect(index,true,true);
			}else if(selmodel.groupSelections.indexOf(rec.data.groupuid)>=0 || selmodel.recordSelections.indexOf(rec.data.recordid)>=0 ){
				selmodel.select(index,true,true);
			}else{
				ancesstors = ',' + rec.data.belongtogroup+',';
				
				Ext.Array.each(selmodel.groupSelections,function(d){
					if(ancesstors.indexOf(','+d+',')>=0)
					{
						selmodel.select(index,true,true);
						selected = true;
						return false;
					}
				});
				
				if(!selected) selmodel.deselect(index,true,true);
			}
			
			
		});

	},
	
	saveCols:function(){
		var me = this,
			view = me.view,
			headerCt = view.headerCt,
			columns = headerCt.getGridColumns(false);
			
		for(var i = 0; i<columns.length; i++){
			me.cols.push(columns[i]);
		}
	},
	
	
	
	injectGroupingMenu: function() {
        var me       = this,
            headerCt = me.view.headerCt;
			getMenuItems       = me.view.headerCt.getMenuItems,
			groupByText        = me.groupByText,
			ungroupByText        = me.ungroupByText;

			
		
        headerCt.showMenuBy = function(t, header) {
			var menu = this.getMenu(),
				groupMenuItem  = menu.down('#groupMenuItem');
				
			if(me.groupers.indexOf(header.dataIndex) >= 0){
				groupMenuItem.setText(ungroupByText);
			}else{
				groupMenuItem.setText(groupByText);
			}
			
			Ext.grid.header.Container.prototype.showMenuBy.apply(this, arguments);
		};
		
        headerCt.getMenuItems = function() {
			var o = getMenuItems.call(this),
				onCancelSort;
			
			onCancelSort = function() {
		        var menu = headerCt.getMenu(),
		            activeHeader = menu.activeHeader;

		        activeHeader.setSortState(null,true,false);
		    };

			
				// modify listener
			o.splice(2,0,{
				//iconCls: Ext.baseCSSPrefix + 'group-by-asc',
				itemId: 'cancelSortMenuItem',
				text: 'Remove Sort',
				handler: onCancelSort,
				scope: me
			});

			o.push('-', {
				iconCls: Ext.baseCSSPrefix + 'group-by-icon',
				itemId: 'groupMenuItem',
				text: groupByText,
				handler: me.onGroupMenuItemClick,
				scope: me
			});

			return o;
		};
		

		
    },
	
	reloadStore: function(){
		var me = this,
            view = me.view,
            store = view.store;
		
		store.mutiGroupParams.groupers= me.groupers;
		store.mutiGroupParams.filters= me.filters;
		store.mutiGroupParams.expands= me.expands;
		
		if(store.count()){
			store.reload();

		}else{
			view.refresh();
		}
	},
	
	collapse:function(groupuid){
		var me = this,
		index = me.expands.indexOf(groupuid);
		
		if(index >= 0){
			me.expands.splice(index,1);	
		}else{
			for(var i=0; i<me.expands.length;){
				var ans = ','+me.expands[i]+',';
				var uid = ','+groupuid+',';
				
				if(ans.indexOf(uid)>=0) me.expands.splice(i,1);
				else i++;
			}
		}
		
		me.reloadStore();
	},
	
	expand:function(groupuid){
		var me = this,
			index = me.expands.indexOf(groupuid);
			
		if(index < 0){
			me.expands.push(groupuid);
			
			me.reloadStore();
		}
	},
	
	changeFilters:function(filters){
		var me = this;
		me.filters= filters;
		me.reloadStore();
	},
	
	cleanGrouping:function(){
		var me = this,
        view = me.view,
        store = view.store;
		
		store.mutiGroupParams.groupers.splice(0);
		me.onChangeGroup([]);
		me.pruneGroupedHeader();
		
		me.reloadStore();
	},
	
	//for event
	onChangeGroup:function(groupers){
		
	},
	
	onCancelSort:function(menuItem, e){
		
	},
	
	onGroupMenuItemClick: function(menuItem, e){
		var me = this,
            menu = menuItem.parentMenu,
            hdr  = menu.activeHeader,
            view = me.view,
            store = view.store;

		if(me.groupers.indexOf(hdr.dataIndex) < 0){
			me.groupers.push(hdr.dataIndex);		
		}else{
			me.groupers.splice(me.groupers.indexOf(hdr.dataIndex),1);
		}
		
		
		if(!me.delayTaskMask) me.delayTaskMask= new Ext.LoadMask(view,{msg:'Rendering...'});
		
		//me.delayTaskMask.show();
		me.delayTask = setTimeout(function(){
			me.onChangeGroup(me.groupers);
			
			me.pruneGroupedHeader();
			
			//dont use store.group()
			me.reloadStore();
			
			//me.delayTaskMask.hide();
			clearTimeout(me.delayTask);
		},100);	
	},
	
	
	
	pruneGroupedHeader: function() {
        var me = this,
			view = me.view,
            headerCt = view.headerCt,
			bias = 0,
			cols = me.cols;
			i=0,
			j=0;
		
			
		Ext.suspendLayouts();
		
		
		

		for(j=0;j<cols.length;j++){
			if(cols[j].dataIndex==''){
				bias++;
			}
		}	
		
		for(i=0;i<me.groupers.length;i++){
			for(j=0;j<cols.length;j++){
				if(cols[j].dataIndex==me.groupers[i])
				{
					headerCt.remove(cols[j],false);
					
					if(cols[j] && cols[j].getWidth && cols[j].getWidth() > 14) {
						me.widthMap[cols[j].dataIndex] = cols[j].getWidth();
						cols[j].setWidth(14);
					}
					headerCt.insert(bias,cols[j]);				
					bias++;
					break;
				}
			}
		}
		
		for(j=0;j<cols.length;j++){
			if(me.groupers.indexOf(cols[j].dataIndex) < 0 && cols[j].dataIndex!=''){
				headerCt.remove(cols[j],false);
				
				if(me.widthMap[cols[j].dataIndex]){
					cols[j].setWidth(me.widthMap[cols[j].dataIndex]);
				}else if(cols[j].hidden){
					cols[j].setWidth(100);
				} else {
					headerCt.expandToFit(cols[j]);
				}
			
				headerCt.insert(bias,cols[j]);
				bias++;
			}
		}	
		
		Ext.resumeLayouts(true);
    },
	
	 collectData: function(records, preppedRecords, startIndex, fullWidth, o) {
        return o;
    },
	
	mutateMetaRowTpl:function(metaRowTpl)
	{
		metaRowTpl.unshift('{[this.if()]}');
		metaRowTpl.push('{[this.else()]}');

		metaRowTpl.push([
			'<tr class="' + Ext.baseCSSPrefix + 'grid-row {[this.embedRowCls()]}" {[this.embedRowAttr()]} style="height:20px;">',
				'<tpl for="columns">',
					'<td class="{cls} ' + Ext.baseCSSPrefix + 'grid-cell ' + Ext.baseCSSPrefix + 'grid-cell-{columnId} {{id}-modified} {{id}-tdCls} {[this.firstOrLastCls(xindex, xcount)]}" {{id}-tdAttr} ',
					'{[this.printColspan(values,xcount + 1 - xindex)]} style="">',
						'<div title="{[this.printTitle(values)]}" class="' + Ext.baseCSSPrefix + 'grid-cell-inner {unselectableCls} {[this.printIfGroupHeader(values)]}" style=" text-align: {align}; {{id}-style} {[this.printColumnStyle(values,xindex)]}">{[this.printColumnValue(values,xindex)]}</div>',
					'</td>',
				'</tpl>',
			'</tr>'
		].join(''));
		metaRowTpl.push('{[this.endif()]}');
	},
	
	getTableFragments:function(){
		return {
		};
	},

	// Injects isRow and closeRow into the metaRowTpl.
    getMetaRowTplFragments: function() {
        return {
			if: function(){return [
				'<tpl if="false">'
			].join('')},
			else: function(){return [
				'<tpl else>'
			].join('')},
			endif: function(){return [
				'</tpl>'
			].join('')},
			printColspan:function(values,xcount){return [
                '{[this.colspan(values,"'+values.dataIndex+'","'+values.id+'")]}'
			].join('')},
			printColumnStyle:function(values,xindex){return [
                 '{[this.columnStyle(values,"'+values.dataIndex+'","'+values.id+'")]}'
 			].join('')},
			printIfGroupHeader: function(values){return [
				'{[this.ifGroupHeader(values,"'+values.dataIndex+'")]}'
			].join('')},
			printTitle: function(values,xindex){return [
                '{[this.title(values,"'+values.dataIndex+'","'+values.id+'")]}'
			].join('')},
			printColumnValue: function(values,xindex){
				if(values.dataIndex=='') return '{'+values.id+'}';
				return [
				'{[this.columnValue(values,"'+values.dataIndex+'","'+values.id+'")]}'
			].join('')}
		}
    },

	
	getFeatureTpl: function(values, parent, x, xcount) {
		return [

        ].join('');
    },
	
	getFragmentTpl: function() {
		var me = this;
        return {
        	colspan:function(values,dataIndex,cid){
        		var gindex,cindex;
        		return 'colspan= "1"';
        		if(values.data.groupindex){
        			gindex=me.groupers.indexOf(values.data.groupindex);
        			cindex=me.groupers.indexOf(dataIndex);
        			if(cindex >= 0 && cindex < gindex)
        				return 'style="display:none;"';
        			else if(cindex == gindex)
        				return 'colspan= "1"';
        			else if(values[cid] !='&#160;' && values[cid] !='' && values[cid] != undefined)
        				return 'colspan= "1"';
        			else
        				return 'style="display:none;"';
        		}else
        			return 'colspan= "1"';
        	},
        	
        	columnStyle:function(values,dataIndex,cid){
        		var gindex,cindex;
        		if(values.data.groupindex){
        			gindex=me.groupers.indexOf(values.data.groupindex);
        			cindex=me.groupers.indexOf(dataIndex);
        			if(cindex >= 0 && cindex < gindex)
        				return ' display:none;';
        			else if(cindex >= 0 && cindex == gindex)
        				return '';
        			else if(values[cid] !='&#160;' 
        				&& values[cid] !='N/A' 
        					&& values[cid] !='' 
        						&& values[cid] != undefined){
        				return '';
        			}
    				else
        				return ' display:none;';
        		}else
        			return '';
        	},
        	
        	columnValue:function(values,dataIndex,cid){
        		var gindex,cindex;
        		if(values.data.groupindex){
        			//group
        			gindex=me.groupers.indexOf(values.data.groupindex);
        			cindex=me.groupers.indexOf(dataIndex);
        			
        			if(cindex>=0 && cindex< gindex)
        				return '&nbsp;';
        			else if(cindex == gindex){
        				if(me.panelCt.onGroupSumRender){
        					return '<span>' + values[cid] + '</span> <span style="font-weight:200">('+me.panelCt.onGroupSumRender(values) +')</span>';
        				}else{
        					return '<span>' +values[cid] + '</span> <span style="font-weight:200">('+values.data.groupcount +')</span>';
        				}
        			}else
        				return '<span>' +values[cid]+ '</span>';
        				
        		}else{
        			//data
        			gindex=me.groupers.length-1;
        			cindex=me.groupers.indexOf(dataIndex);
        			if(cindex >= 0 && cindex<= gindex){
        				return '&nbsp;';
        			}else{
        				return values[cid];
        			}
        			
        		}
			},
			
			title:function(values,dataIndex,cid){
				var gindex,cindex;
        		if(values.data.groupindex){
        			gindex=me.groupers.indexOf(values.data.groupindex);
        			cindex=me.groupers.indexOf(dataIndex);
        			if(cindex == gindex){
        				return '';
        			}else
        				return '';	
        		}
			},
			ifGroupHeader:function(values,dataIndex){
				if(dataIndex !='' && values.data.groupindex == dataIndex)
				{
					if(values.data.groupexpand===true){
						return 'd-grid-group-expand';
					}else if(values.data.groupexpand===false){
						return 'd-grid-group-collapsed';
					}else{
						return 'd-grid-group-no-expand';
					}
				}
				return '';
			}
        };
    },
});

/****************************************************************************************
*Ext.selection.MutiGroupCheckbox
****************************************************************************************/

Ext.define('DigiCompass.Web.app.MutiGroupCheckbox', {
    extend: 'Ext.selection.CheckboxModel',
    
    pk : [],
    mutiPkJoinKey : ',',
    
    
    constructor:function(){
    	var me = this;
        
    	me.checkedAll = false,
    	me.groupSelections = [],

    	me.recordSelections = [],
    	
    	me.callParent(arguments);
    },
    
    clear:function(){
		var me = this;
		
		me.checkedAll = false;
		me.groupSelections = [];
		me.recordSelections = [];
		
		if(me.allCheckEl) me.allCheckEl.removeCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');
	},
   
    getGroupSelection : function(){
    	return this.groupSelections;
    },

    getSelectionPrimarys : function(){
    	var sel = this.getSelection();
    	var pks = [];
    	for(var i=0; i<sel.length; i++){
    		pks.push(this.getPkString(sel[i]));
    	}
    	return pks;
    },
    
    //same as getSelectionPrimarys
	getSelectionIndex : function(){
		return this.getSelectionPrimarys();
	},
	
    
    getPk : function(record){
    	var me = this, val = [];
    	for(var i=0; i< me.pk.length; i++){
    		val.push(record.get(me.pk[i]));
    	}
    	return val; 
    },
    
    getPkString : function(record){
    	return this.getPk(record).join(this.mutiPkJoinKey);
    },

	
    
    getGroupSelection : function(){
    	return this.groupSelections;
    },

	/**
     * @Rewrite 
     */ 
    selectWithEvent: function(record, e, keepExisting) {
    	
        var me = this;
			classname=e.target.className;
			
		if(classname.indexOf('d-grid-group-expand')>=0 || classname.indexOf('d-grid-group-collapsed')>=0 || classname.indexOf('d-grid-group-no-expand')>=0){
			return ;
		}
		
        switch (me.selectionMode) {
            case 'MULTI':
                if (e.ctrlKey && me.isSelected(record)) {
                    me.doDeselect(record, false);
                } else if (e.shiftKey && me.lastFocused) {
                    me.selectRange(me.lastFocused, record, e.ctrlKey);
                } else if (e.ctrlKey) {
                    me.doSelect(record, true, false);
                } else if (me.isSelected(record) && !e.shiftKey && !e.ctrlKey && me.selected.getCount() > 1) {
                    me.doSelect(record, keepExisting, false);
                } else {
                    me.doSelect(record, true);
                }
                break;
            case 'SIMPLE':
                if (me.isSelected(record)) {
                    me.doDeselect(record);
                } else {
                    me.doSelect(record, true);
                }
                break;
            case 'SINGLE':
                
                if (me.allowDeselect && me.isSelected(record)) {
                    me.doDeselect(record);
                
                } else {
                    me.doSelect(record, false);
                }
                break;
        }
    },
    
    selectAll: function(suppressEvent) {

    },

    
    deselectAll: function(suppressEvent) {
        
    },
    updateHeaderState:function(){
    	
    }
});

Ext.define('DigiCompass.Web.app.MutiGroupFilterCheckbox', {
    extend: 'DigiCompass.Web.app.MutiGroupCheckbox',
	
	/**
	 * @Rewrite 
	 */ 
	selectWithEvent: function(record, e, keepExisting) {
		
	    var me = this;
			classname=e.target.className;
			
		if(classname != 'x-grid-row-checker'){
			return ;
		}
		
		if (me.isSelected(record)) {
            me.doDeselect(record, false);
        } else {
        	me.doSelect(record, true);
        }
	},

//	/deselectAll:function(){}
});