Ext.define('DigiCompass.Web.app.FlexViewCheckboxModel', {
    alias: 'selection.checkboxmodel',
    extend: 'Ext.selection.CheckboxModel',
    pk : [],
    mutiPkJoinKey : '&',
//    showHeaderCheckbox : false,
    groupChecked : [],
    checkedAll : false,
    constructor : function(config) {
		var me = this;
		this.initConfig(config);
		me.addEvents({
	      "groupheaderclick" : true, 
	      'selectgroup' : true,
	      'removegroup' : true,
	      'refreshSelModel': true,
	      'selectall' : true,
	      'deselectall' : true
	    });
		me.callParent(arguments);
		me.addListener('selectgroup', me.onSelectGroup, me)
		me.addListener('deselect', function(me, record){
			var store = me.store, j=0, k=0, tmp;
			if(store.groupers.getCount() > 0 && me.groupChecked){
        		outer : for(j = 0; j < me.groupChecked.length; j++){
            		for(k = 0; k < store.groupers.getCount(); k++){
            			group = store.groupers.getAt(k);
            			if(me.groupChecked[j].length < k + 1 || me.groupChecked[j][k] !== record.get(group.property)){
            				break outer;
            			}else if(me.groupChecked[j].length === k+1){
            				tmp = me.groupChecked[j];
            				me.groupChecked.splice(j, 1);
            				me.fireEvent('removegroup', me, tmp);
            				break outer;
            			}
            		}
            	}
            }
		})
	},
	isCheckbox : function(el){
		el = Ext.get(el);
		return el.hasCls(Ext.baseCSSPrefix + 'column-header-checkbox') || el.hasCls(Ext.baseCSSPrefix + 'grid-row-checker');
	},
	/**
	 * Overwrite
	 * @param {} view
	 */
	bindComponent: function(view) {
        var me = this;
        me.callParent(arguments);
        me.store.addListener('groupchanged', me.clearSelections, me);
        me.store.addListener('reloaded', me.clearSelections, me);
    },
    clearSelectionAndUI : function(){
    	this.clearSelections();
    	this.toggleUiHeader(this.checkedAll);
    },
    onSelectGroup : function(grouping, sel, values, depth){
    	var me = this, index = -1, isChecked;
		for(var i in me.groupChecked){
			isChecked = true;
			for(var j in values){
				if(values[j] !== me.groupChecked[i][j]){
					isChecked = false;
				}
			}
			if(isChecked){
				index = i;
				break;
			}
		}
		if(sel && index < 0){
			me.groupChecked.push(values);
		}else if(!sel && index > -1){
			me.groupChecked.splice(index, 1);
		}
		if(!sel && me.checkedAll){
			me.checkedAll = false;
			this.toggleUiHeader(this.checkedAll);
		}
    },
    getGroupSelection : function(){
    	return this.groupChecked;
    },
    getSelection : function(){
    	var records = [];
    	for(var i in this.selected.items){
    		if(Ext.isArray(this.selected.items[i])){
    			records = records.concat(this.selected.items[i]);
    		}
    	}
    	return records;
    },
    getSelectionPrimarys : function(){
    	return this.getSelectionIndex();
    },
	getSelectionIndex : function(){
		return this.selected.keys;
	},
	onHeaderClick: function(headerCt, header, e) {
		this.callParent(arguments);
		this.updateHeaderState()
    },
    getRecordsByPk : function(pk, searchCache){
    	var me = this, cachePage, records , rs = [];
    	pk = Ext.isArray(pk) ? pk : [pk];
    	if(searchCache !== true){
    		records = me.store.getRange();
	    	for(var i=0; i< records.length; i++){
	    		if(me.arrayHas(me.getPk(records[i]), pk)){
	    			rs.push(records[i]);
	    		}
	    	}
    	}else{
    		cachePage = this.store.pageMap.first;
			while(cachePage){
				for(var i=0;i< cachePage.value.length; i++){
					if(me.arrayHas(me.getPk(cachePage.value[i]), pk)){
						rs.push(cachePage.value[i]);
		    		}
				}
				cachePage = cachePage.next;
			}
    	}
    	return rs;
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
    arrayHas : function(source, target){
    	if(!Ext.isArray(source)){
    		source = [source];
    	}
    	if(!Ext.isArray(target)){
    		target = [target];
    	}
    	if(target.length === source.length){
    		for(var i=0; i<target.length; i++){
        		if(target[i]!==source[i]){
        			return false;
        		}
        	}
    		return true;
    	}
    	return false;
    },
    
    /**
     * @Overwrite
     */
    selectAll: function(suppressEvent) {
        var me = this;
        me.callParent(arguments);
        me.checkedAll = true;
        me.fireEvent('selectall', me);
    },

    /**
     * @Overwrite
     */
    deselectAll: function(suppressEvent) {
    	var me = this;
        me.callParent(arguments);
        me.checkedAll = false;
        me.fireEvent('deselectall', me);
    },
    
    /**
     * @Overwrite add select record by pk 
     */ 
    doSelect: function(records, keepExisting, suppressEvent) {
        var me = this,  pk;
        if(Ext.isString(records)){
        	pk = records;
        	records = me.getRecordsByPk(pk);
        	if(records.length == 0){
        		// debug
        		console.log('getRecordByPk not found. pk === '+pk);
        	}
        }else{
        	if(Ext.isNumber(records)){
            	records = this.store.getAt(records);
            }
        	var tmp = Ext.isArray(records) ? records : [records], tmp2={};
        	records = [];
        	for(var i=0; i<tmp.length; i++){
        		pk = me.getPk(tmp[i]);
        		if(!tmp2[pk]){
        			records = records.concat(me.getRecordsByPk(pk));
        			
        			tmp2[pk] = true;
        		}
        	}
        }
        me.callParent([records, keepExisting, suppressEvent]);
    },
    
    /**
     * @Rewrite selected add by pk
     */ 
    doMultiSelect: function(records, keepExisting, suppressEvent) {
        var me = this,
            change = false,
            i = 0,
            len, record;

        if (me.locked) {
            return;
        }
        records = !Ext.isArray(records) ? [records] : records;
        len = records.length;
        if (!keepExisting && me.selected.getCount() > 0) {
            if (me.doDeselect(me.getSelection(), suppressEvent) === false) {
                return;
            }
            // TODO - coalesce the selectionchange event in deselect w/the one below...
        }

        function commit () {
        	// Rewrite: selected add by pk
        	//selected.add(record);
        	var key  = me.getPk(record).join(me.mutiPkJoinKey), oldRs;
        	oldRs = me.selected.get(key);
        	if(oldRs){
        		for(var i in oldRs){
        			if(record === oldRs[i]){
        				return;
        			}
        		}
        		oldRs.push(record);
        	}else{
        		me.selected.add(key, [record]);
        	}
            change = true;
        }

        for (; i < len; i++) {
            record = records[i];
//            if (keepExisting && me.isSelected(record)) {
//                continue;
//            }
            me.lastSelected = record;

            me.onSelectChange(record, true, suppressEvent, commit);
        }
        if (!me.preventFocus) {
            me.setLastFocused(record, suppressEvent);
        }
        // fire selchange if there was a change and there is no suppressEvent flag
        me.maybeFireSelectionChange(change && !suppressEvent);
    },
    
    
    /**
     * @Rewrite selected remove by pk
     */ 
    doDeselect: function(records, suppressEvent) {
        var me = this,
            selected = me.selected,
            i = 0,
            len, record,
            attempted = 0,
            accepted = 0
            , pk;

        if (me.locked || !me.store) {
            return false;
        }

        if (typeof records === "number") {
            records = [me.store.getAt(records)];
        } else if (!Ext.isArray(records)) {
            records = [records];
        }
        // Rewrite: add select record by pk 
        else if(Ext.isString(records)){
        	pk = records;
        	records = me.getRecordsByPk(pk);
        	if(records.length==0){
        		// debug
        		console.log('getRecordByPk not found. pk === '+pk);
        	}
        }
        var tmp = [], tmpPk = {};
        for(i=0;i<records.length;i++){
        	var key  = me.getPk(records[i]).join(me.mutiPkJoinKey), oldRs;
        	if(tmpPk[key]){
        		continue;
        	}
        	tmpPk[key] = true;
        	if(Ext.isArray(me.selected.get(key))){
        		tmp = tmp.concat(me.selected.get(key));
        	}
        }
    	records = tmp;
        function commit () {
            ++accepted;
            // Rewrite: selected remove by pk
            //selected.remove(record);
            selected.removeAtKey(me.getPk(record).join(me.mutiPkJoinKey));
            me.checkedAll = false;
        }

        len = records.length;

        for (i=0; i < len; i++) {
            record = records[i];
            if (me.lastSelected == record) {
                me.lastSelected = null;
            }
            ++attempted;
            me.onSelectChange(record, false, suppressEvent, commit);
        }

        // fire selchange if there was a change and there is no suppressEvent flag
        me.maybeFireSelectionChange(accepted > 0 && !suppressEvent);
        return accepted === attempted;
    },
    /**
     * @Rewrite selected add by pk
     */ 
    doSingleSelect: function(record, suppressEvent) {
        var me = this,
            changed = false,
            selected = me.getSelection();

        if (me.locked) {
            return;
        }
        // already selected.
        // should we also check beforeselect?
        if (me.isSelected(record)) {
            return;
        }

        function commit () {
            me.bulkChange = true;
            if (selected.getCount() > 0 && me.doDeselect(me.lastSelected, suppressEvent) === false) {
                delete me.bulkChange;
                return false;
            }
            delete me.bulkChange;
            // Rewrite: selected add by pk
            //selected.add(record);
            selected.add(me.getPk(record).join(me.mutiPkJoinKey), record);
            me.lastSelected = record;
            changed = true;
        }

        me.onSelectChange(record, true, suppressEvent, commit);

        if (changed) {
            if (!suppressEvent) {
                me.setLastFocused(record);
            }
            me.maybeFireSelectionChange(!suppressEvent);
        }
    },
    /**
     * @Rewrite find selected index by pk
     */ 
    isSelected: function(record) {
        var me = this, pk;
        if(Ext.isNumber(record)){
        	record = this.store.getAt(record);
        	return me.isSelectByPk(me.getPk(record));
        }
        // Rewrite: add select record by pk 
        else if(Ext.isString(record)){
        	pk = record;
        	record = me.getRecordsByPk(pk);
        	if(record.length){
        		// debug
        		console.log('getRecordByPk not found. pk === '+pk);
        	}
        	for(var i=0; i<record.length; i++){
        		if(!me.isSelectByPk(me.getPk(record))){
        			return null;
        		}
        	}
        }else{
        	return me.isSelectByPk(me.getPk(record));
        }
    },
	isSelectByPk : function(pk){
		if(!Ext.isArray(pk)){
			pk = [pk];
		}
		return this.selected.indexOfKey(pk.join(this.mutiPkJoinKey)) !== -1;
	},
    /**
     * @Rewrite only clear selections when store.buffered, keep selected existing when store.buffered
     */ 
    refresh: function() {
        var me = this,
            store = me.store,
            toBeSelected = [],
            oldSelections = me.getSelection(),
            len = oldSelections.length,
            selection,
            change,
            i = 0,
            group,
            j = 0,
            k = 0,
            records,
            lastFocused = me.getLastFocused();
        if (!store) {
            return;
        }
        if(me.checkedAll === true){
        	toBeSelected = store.getRange();
        }else{
        	for (; i < len; i++) {
                selection = oldSelections[i];
                if (!me.pruneRemoved || store.indexOf(selection) !== -1) {
                    toBeSelected.push(selection);
                }
            }
        	if(store.groupers.getCount() > 0 && me.groupChecked){
            	records = store.getRange();
            	for(i = 0; i < records.length; i++){
            		outer : for(j = 0; j < me.groupChecked.length; j++){
                		for(k = 0; k < store.groupers.getCount(); k++){
                			group = store.groupers.getAt(k);
                			if(me.groupChecked[j].length < k + 1 || me.groupChecked[j][k] !== records[i].get(group.property)){
                				break ;
                			}else if(me.groupChecked[j].length === k+1){
                				toBeSelected.push(records[i]);
                				break outer;
                			}
                		}
                	}
            	}
            }
        }
        if (me.getSelection().length != toBeSelected.length) {
            change = true;
        }
        // Rewrite: only clear selections when store.buffered
        //me.clearSelections();
        if(!store.buffered){
        	me.clearSelections();
        }
        if (store.indexOf(lastFocused) !== -1) {
            me.setLastFocused(lastFocused, true);
        }
        if (toBeSelected.length) {
        	// Rewrite: keep selected existing when store.buffered
//        	me.doSelect(toBeSelected, false, true);
            me.doSelect(toBeSelected, store.buffered, true);
        }
        me.maybeFireSelectionChange(change);
        me.fireEvent('refreshSelModel', me);
    },
    /**
     * @Overwrite 
     */ 
    clearSelections: function() {
        // reset the entire selection to nothing
       	this.callParent(arguments);	
        this.groupChecked = [];
        this.checkedAll = false;
    },
    /**
     * @Rewrite 
     */ 
    updateHeaderState: function() {
        // check to see if all records are selected
    	var hdSelectStatus = true,cachePage, records;
//    	if(!this.checkedAll){
//    		records = this.store.getRange();
//	    	for(var i=0; i<records.length; i++){
//	    		if(!this.isSelectByPk(records[i].get(this.pk))){
//	    			hdSelectStatus = false;
//	    			break;
//	    		}
//	    	}
//    		cachePage = this.store.pageMap.first;
//    		while(cachePage){
//    			for(var i=0;i< cachePage.value.length; i++){
//    				if(!this.isSelectByPk(cachePage.value[i].get(this.pk))){
//	    				tmp = false;
//	    				break;
//	    			}
//    			}
//    			cachePage = cachePage.next;
//    		}
//    	}else{
//    		hdSelectStatus = true;
//    	}
        this.toggleUiHeader(this.checkedAll);
    }
    
});