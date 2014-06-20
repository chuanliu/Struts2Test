Ext.define('DigiCompass.Web.app.data.FlexViewArrayStore', {
	extend: 'Ext.data.ArrayStore',
	pageSize:100,
	leadingBufferZone : 100,
    autoLoad : false,
    remoteGroup : true,
    remoteSort : true,
    remoteFilter : true,
    remoteSummary : true,
    fields: [] ,
    flexView : null,
    buffered: true,
    groupUnfolded : [],
    groupSelected : [],
    groupUnSelected : [],
    constructor : function(config) {
		var me = this;
		this.initConfig(config);
		me.addEvents({
	      "groupchanged" : true,
	      'reloaded' : true
	    });
		me.leadingBufferZone = me.pageSize;
		this.callParent(arguments);
	},
	getFlexViewParam : function(){
		var me = this,
	    	groupedProperties = [],
	    	meta = {
				unfolded : me.groupUnfolded,
				unSelected : me.groupUnSelected
			};
		if(me.flexView){
			meta.view  = Ext.clone(me.flexView.meta.view);
			for(var k in me.groupers.items){
				var g = {name : me.groupers.items[k].property, type : 'NAME', '@type' : 'com.digicompass.ian.ui.json.GridView$Property'};
				if(me.groupers.items[k].direction){
					g.sort = me.groupers.items[k].direction != 'ASC' ? 'DESCENDING' : 'ASCENDING';
				}
				groupedProperties.push(g);
			}
			meta.view.groupByProperties = groupedProperties;
		}
		return meta;
	},
    onProxyLoad: function(operation) {
        var me = this,
            resultSet = operation.getResultSet();
        if(resultSet.reload === true){
        	me.fireEvent('reloaded', me, resultSet);
        }
    	if (resultSet && resultSet.flexView) {
    		
            me.onFlexViewChange(resultSet.flexView);
        }
        me.callParent(arguments);
    },
    onProxyPrefetch: function(operation) {
        var me = this,
            resultSet = operation.getResultSet();
        if(resultSet.reload === true){
        	me.fireEvent('reloaded', me, resultSet);
        }
        // Only cache the data if the operation was invoked for the current generation of the page map.
        // If the generation has changed since the request was fired off, it will have been cancelled.
        if (operation.generation === me.pageMap.generation) {
            if (resultSet && resultSet.flexView) {
                me.onFlexViewChange(resultSet.flexView);
            }
        }
        me.callParent(arguments);
    }, 
    onFlexViewChange : function(flexView){
    	var me = this, groupByProperties, reload = false, oldFolded;
    	me.flexView = flexView;
    	oldFolded = me.groupUnfolded;
    	me.groupUnfolded = flexView.meta.unfolded || [];
    	me.groupSelected = flexView.meta.selected || [];
    	me.groupUnSelected = flexView.meta.unSelected || [];
    	
    	if((groupByProperties = flexView.meta.view.groupByProperties) && groupByProperties.length > 0){
    		if(me.isChangeGroup(groupByProperties)){
    			me.groupers.clear(groupByProperties);
	    		for(var i in groupByProperties){
	    			me.groupers.add(groupByProperties[i].name, 
	    					new Ext.util.Grouper({
	    						property : groupByProperties[i].name,
	    						direction: groupByProperties[i].sort}));
	    		}
	    		me.fireEvent('groupchanged', me, flexView);
	    		me.backUpGroupers();
    		}
    	}else if(me.groupers.getCount()>0 || (me.upGroupers && me.upGroupers.length>0)){
    		me.groupers.clear();
    		me.fireEvent('groupchanged', me, flexView);
    		me.backUpGroupers();
    	}
    	
    	/*
    	if(flexView.reload){
    		reload = true;
    	}else if(me.groupers.getCount()>0){
    		if(oldFolded.length != me.groupUnfolded.length){
    			reload = true;
    		}else{
    			for(var i=0; i<oldFolded.length; i++){
    				for(var j= 0; j<oldFolded[i].length; j++){
    					if(oldFolded[i][j]!==me.groupUnfolded[i][j]){
    						reload = true;
    						break;
    					}
    				}
    				if(reload){
    					break;
    				}
    			}
    		}
    	}
    	if(reload || true){
    		me.fireEvent('reloaded', me, flexView);
    	}*/
    },
    backUpGroupers : function(){
    	var me = this;
    	me.upGroupers = [];
    	for(var i=0; i<me.groupers.getCount(); i++){
    		me.upGroupers.push(me.groupers.getAt(i).property);
    	}
    },
    isChangeGroup : function(groupByProperties){
    	var me = this;
    	if(me.upGroupers && groupByProperties.length === me.upGroupers.length){
	    	for(var i=0; i<groupByProperties.length; i++){
	    		if(groupByProperties[i].name!== me.upGroupers[i]){
	    			return true;
	    		}
	    	}
    	}else{
    		return true;
    	}
    	return false;
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
        options.meta = me.getFlexViewParam();
        return me.callParent([page, options]);
    },
    load: function(options) {
        var me = this;
        options = options || {};
    	options.meta = me.getFlexViewParam();
        return me.callParent([options]);
    },
    prefetchPage: function(page, options) {
        var me = this;
        options = options || {};
        options.meta = me.getFlexViewParam();
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
                    if (options.groupChange) {
                        me.fireGroupChange();
                    }
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
});