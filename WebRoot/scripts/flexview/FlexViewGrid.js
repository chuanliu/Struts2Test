Ext.define('DigiCompass.Web.app.grid.FlexViewGrid', {
	extend: 'Ext.grid.Panel',
	verticalScrollerType: 'paginggridscroller',
	invalidateScrollerOnRefresh: true,
	searchField : null,
	useSearch : false,
	columnLines: true,
	columns: [],
	search : null,
	viewConfig : {
		loadMask: false
	},
	constructor : function(config) {
		var me = this;
		this.initConfig(config);
		me.addEvents({
	      "group" : true,
	      "search" : true
	    });
		me.callParent(arguments);
		me.addListener('search', function(field, val){
			me.search = val;
			me.reload({page:1, search:val})
		}, me);
	},
	loadStart : function(start, end){
		start = start || 0;
		end = end || (this.store.pageSize -1);
		this.store.guaranteeRange(start, end);
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
	clearSearch : function(){
		var me = this;
		if(me.searchField){
			me.searchField.onTrigger1Click();
		}
	},
	initComponent : function(){
		var grid = this;
		grid.callParent(arguments);
		if(grid.useSearch){
			grid.searchField = Ext.create('Ext.ux.form.BtnSearchField',{
				margin : '0 5px',
				fieldLabel : 'Search:',
				labelWidth : 45,
				onTrigger2Click : function(){
					var searchField = this,
						value = searchField.getValue();
					searchField.showCancelBtn();
					grid.fireEvent('search', this, value);
				},
				onTrigger1Click : function(){
					var searchField = this;
					value = searchField.getValue();
					searchField.hideCancelBtn();
					grid.fireEvent('search', this, value);
				}
			});
			grid.addDocked(new Ext.toolbar.Toolbar({
				layout:'fit',
				items:[grid.searchField]
				}));
		}
		
		
		grid.getStore().addListener('groupchanged' , function(store, flexView){
			columns = flexView.extColumns;
			console.log('groupchanged...');
    		grid.view.reconfigColumns(columns);
    		grid.view.flexViewId = flexView.id;
    		grid.view.fireEvent('refreshview', grid.view, flexView);
		});
		grid.view.reconfigColumns = function(columns){
			console.log('reconfig columns....');
			var me = this,
				headerCt = me.getHeaderCt(),
				index = 0,
				i;
			if(me.selModel instanceof Ext.selection.CheckboxModel){
				index = 1;
			}
			for(i =0; i< headerCt.getColumnCount(); i++){
				if(headerCt.getHeaderAtIndex(i).columnType === 'summary'){
					index++;
				}
			}
			while(headerCt.getColumnCount() > index){
				headerCt.remove(index, true);
			}
			for(i in columns){
				headerCt.add(columns[i]);
			}
			me.setNewTemplate();
		}
		//@Rewrite
		grid.view.onMaskBeforeShow = function(){
	        var me = this,
	            loadingHeight = me.loadingHeight;
	
//	        me.getSelectionModel().deselectAll();
	        me.all.clear();
	        if (loadingHeight && loadingHeight > me.getHeight()) {
	            me.hasLoadingHeight = true;
	            me.oldMinHeight = me.minHeight;
	            me.minHeight = loadingHeight;
	            me.updateLayout();
	        }
	    },
		grid.view.addListener('beforerefresh', function(){
        	var me = this, columns = [],flexView;
        	console.log('beforerefresh...');
	    	if(me.store.flexView){
	    		flexView = me.store.flexView;
	    		var gridColumns = me.getGridColumns();
	    		for(var i=0; i<gridColumns.length; i++){
	    			if('@type' in gridColumns[i]){
	    				columns.push(gridColumns[i]);
	    			}
	    		}
	    		grid.selModel.pk = flexView.primary || ['id']; 
	    		if(flexView.id !== me.flexViewId && (!flexView.isSameHeader(columns))){
	        		columns = me.store.flexView.extColumns;
	        		me.reconfigColumns(columns);
	        		me.flexViewId = flexView.id;
	        		me.fireEvent('refreshview', me, flexView);
	    		}
	    	}
	    	
		});
	    grid.addListener('afterrender', function(grid){
	    	var loadMarsk = null;
	    	var store = grid.getStore();
	    	store.addListener('beforeload', function(){
	    		if(loadMarsk == null){
		    		loadMarsk = new Ext.LoadMask(grid.body, {
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
	    })
	}
});