Ext.define('DigiCompass.Web.app.data.MutiGroupStore', {
	extend: 'Ext.data.ArrayStore',
	
    

    
    constructor : function(config) {
		var me = this;
		
		//@private
		me.mutiGroupParams ={
		    	groupers : [],
		        filters : [],
		        expands : []
	    };
		me.dataType = config.dataType || 1;
		
		me.pageSize = 100;
		me.leadingBufferZone  =  100;
		me.autoLoad =  false;
		me.remoteGroup = true;
		me.remoteSort = true;
	    me.remoteFilter = true;
	    me.remoteSummary = true;
	    me.fields = [];
	    me.flexView = null;
	    me.buffered = true;

		me.leadingBufferZone = me.pageSize;
		this.callParent(arguments);
		
		//set store in proxy
		me.getProxy().store = this;
	},
	setModel:function(){
		//fix bug
	},
	
	clearGroupParams: function(){
		var me = this;
		
		me.mutiGroupParams.groupers.splice(0);
		me.mutiGroupParams.filters.splice(0);
		me.mutiGroupParams.expands.splice(0);
	},
	
	getMutiGroupParam : function(){
		var me = this,
	    	groupedProperties = [],
	    	meta = {
				unfolded : [],
				unSelected : [],

				dataType:me.dataType
			},
			i,
			lastMeta = me.getProxy().getReader().meta;
		
//		if(lastMeta){
//			meta = lastMeta;
//		}

		if(me.dataType == 2){
			meta.view = {
				"path":"",
				"id":null,
				"deleted":false,
				"updateProperties":null,
				"version":null,
				"comment":null,
				"description":null,
				"children":null,
				"columnHeader":[],
				"rowHeader":[],
				"groupByProperties":[],
				"groupedProperties":[],
				"columnHeaderHasNameUseProperty":false,
				"valueUseProperties":[],
				"nameUseProperties":[],
				"nonGroupByProperties":[],
				"allGroupByProperties":[]
			};
		}else{
			meta.view = me.metaView;
		}
		
		if(meta.view){
			meta.view.groupByProperties = [];
			for(i=0;i<me.mutiGroupParams.groupers.length; i++){
				if(me.mutiGroupParams.groupers[i]){
					meta.view.groupByProperties.push({
						'@type':'com.digicompass.ian.ui.json.GridView$Property',
						'name':me.mutiGroupParams.groupers[i]
					});
				}	
			}
			
			meta.unfolded = [];
			for(i=0;i<me.mutiGroupParams.expands.length; i++){
				meta.unfolded.push(me.mutiGroupParams.expands[i].split(','));
			}
			
			meta.unSelected = [];
			for(i=0;i<me.mutiGroupParams.filters.length; i++){
				meta.unSelected.push(me.mutiGroupParams.filters[i].split(','));
			}
			
			
			if(me.dataType == 1){
				meta.view.sortProperties=[];
				meta = me.getSorterParam(meta);
			}
			
		}
		
		
		return meta;
	},
	
	getSorterParam:function(meta){
		var me = this,
			headerCt = me.grid.getView().headerCt,
			headers = headerCt.getGridColumns(false),
			handle;
		
		handle= function(dr){
			if(dr =='DESC') return 'DESCENDING';
			if(dr =='ASC') return 'ASCENDING';
			if(dr == null) return 'UNSORTED';
		};
		
		Ext.Array.each(headers,function(d){
			if(d.sortValue){
				if(d.sortValue.direction !=null){
					meta.view.sortProperties.push({
						'@type':'com.digicompass.ian.ui.json.GridView$Property',
						'name':d.sortValue.property,
						'sort':handle(d.sortValue.direction)
					});
				}
			}	
		});
		
		return meta;
	},
	
    onProxyLoad: function(operation) {
        var me = this;
        me.callParent(arguments);
    },
    
    onProxyPrefetch: function(operation) {
        var me = this;
        me.callParent(arguments);
    }, 
    
    
    getPageFromRecordIndex: function(index) {
    	if(index > this.getTotalCount()){
    		index = this.getTotalCount()
    	}
        return Math.floor(index / this.pageSize) + 1;
    },
    loadPage: function(page, options) {
        var me = this;
        options = options || {};
        options.meta = me.getMutiGroupParam();
        return me.callParent([page, options]);
    },
    load: function(options) {
        var me = this;
        options = options || {};
    	options.meta = me.getMutiGroupParam();
        return me.callParent([options]);
    },
    prefetchPage: function(page, options) {
        var me = this;
        options = options || {};
        options.meta = me.getMutiGroupParam();
        return me.callParent([page, options]);
    },
    loadToPrefetch: function(options) {
        var me = this,
            i,
            records,

            // Get the requested record index range in the dataset
            startIdx = options.start,
            endIdx = options.start + options.limit - 1,

            // The end index to load into the store's live record collection
            loadEndIdx = Math.max(Math.min(options.start + (me.viewSize || options.limit) - 1, me.getTotalCount()), options.limit -1),
        
            // Calculate a page range which encompasses the requested range plus both buffer zones
            startPage = me.getPageFromRecordIndex(Math.max(startIdx - me.trailingBufferZone, 0)),
            endPage = me.getPageFromRecordIndex(endIdx + me.leadingBufferZone),

            // Wait for the viewable range to be available
            waitForRequestedRange = function() {
                if (me.rangeCached(startIdx, loadEndIdx)) {
                    me.loading = false;
                    records = me.pageMap.getRange(startIdx, loadEndIdx);
                    me.pageMap.un('pageAdded', waitForRequestedRange);

                    // If there is a listener for guranteedrange (PagingScroller uses this), then go through that event
                    if (me.hasListeners.guaranteedrange) {
                        me.guaranteeRange(startIdx, loadEndIdx, options.callback, options.scope);
                    }
                    // Otherwise load the records directly
                    else {
                        me.loadRecords(records, {
                            start: startIdx
                        });
                    }
                    me.fireEvent('load', me, records, true);
                }else{
                	
                }
            };
            
        if (me.fireEvent('beforeload', me, options) !== false) {

            // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
            delete me.totalCount;

            me.loading = true;

            // Wait for the requested range to become available in the page map
            me.pageMap.on('pageAdded', waitForRequestedRange);
            
            // Load the first page in the range, which will give us the initial total count.
            // Once it is loaded, go ahead and prefetch any subsequent pages, if necessary.
            // The prefetchPage has a check to prevent us loading more than the totalCount,
            // so we don't want to blindly load up <n> pages where it isn't required. 
            me.on('prefetch', function(){
                for (i = startPage + 1; i <= endPage; ++i) {
                    me.prefetchPage(i, options);
                }
            }, null, {single: true});
            
            me.prefetchPage(startPage, options);
        }
    },
    
    reload: function(options) {
        var me = this,
            startIdx,
            endIdx,
            startPage,
            endPage,
            i,
            waitForReload,
            bufferZone,
            records;
        

        if (!options) {
            options = {};
        }

        
        
        if (me.buffered) {

            
            delete me.totalCount;

            waitForReload = function(page,records) {
            	 me.loading = false;
            	 me.loadRecords(records, {
                   start: startIdx
                });
            	 me.pageMap.un('pageAdded', waitForReload);
            	 me.fireEvent('load', me, records, true);
//                if (me.rangeCached(startIdx, endIdx)) {
//                    me.loading = false;
//                    me.pageMap.un('pageAdded', waitForReload);
//                    records = me.pageMap.getRange(startIdx, endIdx);
//    
//                    me.loadRecords(records, {
//                        start: startIdx
//                    });
//                    me.fireEvent('load', me, records, true);
//                }
            };
            bufferZone = Math.ceil((me.leadingBufferZone + me.trailingBufferZone) / 2);

            
            if( me.getAt(0)){
            	startIdx = options.start || me.getAt(0).index;
            }else{
            	startIdx = 0;
            }
            
            endIdx = startIdx + (options.count || me.getCount()) - 1;

            
            startPage = me.getPageFromRecordIndex(Math.max(startIdx - bufferZone, 0));
            endPage = me.getPageFromRecordIndex(endIdx + bufferZone);

            
            me.pageMap.clear(true);

            if (me.fireEvent('beforeload', me, options) !== false) {
                me.loading = true;

                
                for (i = startPage; i <= endPage; i++) {
                    me.prefetchPage(i, options);
                }

                
                
                me.pageMap.on('pageAdded', waitForReload);
            }
        } else {
            return me.callParent(arguments);
        }
    }
});