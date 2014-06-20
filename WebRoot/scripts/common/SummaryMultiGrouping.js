Ext.define('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping', {
    extend: 'Ext.grid.feature.MultiGrouping',
    alias : 'feature.SummaryMultiGrouping',
    alternateClassName: 'DigiCompass.Web.app.data.SummaryMultiGrouping',
    mixins: {
		summary: 'Ext.grid.feature.AbstractSummary'
	},
    _groupColumnDataIndexSuffix : '-GROUPING',
    showSummaryRow : true,
    fistColumnIndex : 0,
    groupHeaderCls : Ext.baseCSSPrefix + 'grid-group-hd',
	groupBodyCls : Ext.baseCSSPrefix + 'grid-group-body',
	selectionCls : Ext.baseCSSPrefix + 'grid-row-selected',
	groupHeaderTpl: '{disName}',
	init: function() {
		this.mixins.summary.init.call(this);
	},
	getFragmentTpl: function() {
		var me = this,
			fragments = me.callParent();

		Ext.apply(fragments, me.getSummaryFragments());
		if (me.showSummaryRow && me.view.store.isGrouped()) {
			// 不使用store的group方法
			// this gets called before render, so we'll setup the data here.
			/*
			me.summaryGroups = me.view.store.getGroups();
			me.summaryGroups = me.flattenGroups(me.getSummaryHeader());
			me.summaryData = me.generateSummaryData();
			*/
			me.summaryGroups = me.flattenGroups(me.getSummaryHeader());
		}
		return fragments;
	},
	getSummaryFragments: function(){
		var fragments = {};
		if (this.showSummaryRow) {
			Ext.apply(fragments, {
				printGroupHeader: Ext.bind(this.printGroupHeader, this)
			});
		}
		return fragments;
	},
    getGroupColumnDataIndex : function(grouping){
    	var me = this;
    	if(Ext.isString(grouping)){
    		return grouping + me._groupColumnDataIndexSuffix;
    	}
    },
    getGroupColumn : function(groupName){
    	//TODO
    	
    },
    getColumnByDataIndex : function(dataIndex){
    	var me = this;
    	for(var i = me.fistColumnIndex; i < me.grid.columns.length; i++){
			if(me.grid.columns[i].dataIndex === dataIndex){
				return me.grid.columns[i];
			}
		}
    },
    getGroupFieldArrayByDepth : function(depth){
    	var me = this,
			groupFields = me.getGroupFieldArray();
    	if(!Ext.isNumber(depth)){
    		depth = Number(depth);
    	}
    	return groupFields.slice(0, depth+1);
    },
    getGroupNameByRecord : function(groupFields, record){
    	var me = this,
    		tmpGroupName = '';
    	for(var k in groupFields){
    		tmpGroupName += me._buildGroupName(groupFields[k], record.get(groupFields[k]));;
    	}
    	return tmpGroupName;
    },
    getGroupHeaderElement : function(groupName){
    	var me = this,
			groupHeaderElement,
			headerId;
    	if(Ext.isString(groupName)){
    		groupHeaderElement = Ext.fly(me.getGroupHeaderId(groupName));
    	}else if(me.isGroupHeaderElement(groupName)){
    		groupHeaderElement = Ext.fly(groupName);
    	}
    	if(!groupHeaderElement){
    		throw new Error('can not find the group header[groupName : ' , groupName);
    	}
    	return groupHeaderElement;
    },
    getGroupElement : function(groupName){
    	var me = this,
			groupHeaderElement,
			headerId;
    	if(Ext.isString(groupName)){
    		groupHeaderElement = Ext.fly(me.getGroupHeaderId(groupName));
    	}else{
    		groupHeaderElement = Ext.fly(groupName);
    	}
    	return groupHeaderElement;
    },
    getGroupValues : function(groupName){
    	var me = this,
    		groupElement, array=[], tmp;
    	groupElement = me.getGroupHeaderElement(groupName);
		groupName = groupElement.getAttribute('groupName');
		tmp = groupName.split(me._NAME_KEY_GROUP);
		for(var i in tmp){
			if(!Ext.isEmpty(tmp[i])){
				array.push(tmp[i].split(me._NAME_KEY_GROUP_NAME)[1]);
			}
		}
		return array;
    },
    isGroupHeaderElement : function(header){
    	var me = this;
    	return me.isGroupElement(header, true);
    },
    isGroupBodyElement : function(header){
    	var me = this;
    	return me.isGroupElement(header, false);
    },
    isGroupElement : function(header, isHeader){
    	var me = this;
    	header = me.getGroupElement(header);
		if(header){
			return isHeader === false ? header.hasCls(me.groupBodyCls) : header.hasCls(me.groupHeaderCls) ;
		}
    	return false;
    },
    isSelected : function(groupName){
    	var me = this,
    		groupHeaderElement = me.getGroupHeaderElement(groupName);
    	return groupHeaderElement.hasCls(me.selectionCls);
    },
    _doSelectGroupRecord : function(groupName, sel){
    	var me = this,
		groupHeaderElement = me.getGroupHeaderElement(groupName),
		groups = me.getGroupFieldArrayByDepth(groupHeaderElement.getAttribute('depth')),
		allRecords = me.view.getRecords(me.view.getNodes()),
		selModel = me.view.getSelectionModel();
		groupName = groupHeaderElement.getAttribute('groupName');
		for(var i in allRecords){
			if(groupName === me.getGroupNameByRecord(groups ,allRecords[i])){
				if(sel)
					selModel.select(allRecords[i], true);
				else{
					selModel.deselect(allRecords[i]);
				}
			}
		}
    },
    selectGroupRecord : function(groupName){
    	var me = this;
    	return me._doSelectGroupRecord(groupName, true);
    },
    deSelectGroupRecord : function(groupName){
    	var me = this;
    	return me._doSelectGroupRecord(groupName, false);
    },
    _doSelectGroupHeader : function(groupName, sel){
    	var me = this,
			groupHeaderElement = me.getGroupHeaderElement(groupName),
			depth = Number(groupHeaderElement.getAttribute('depth')),
			tmpDepth;
		do{
			if(sel){
				groupHeaderElement.addCls(me.selectionCls);
			}else{
				groupHeaderElement.removeCls(me.selectionCls);
			}
			tmpDepth = groupHeaderElement.getAttribute('depth');
			if(depth <= tmpDepth){
				break;
			}
			groupHeaderElement = groupHeaderElement.next().next();
		}while(me.isGroupHeaderElement(groupHeaderElement));
		me.fireSelectGroupEvent(sel, me.getGroupValues(groupName), depth);
    },
    selectGroupHeader : function(groupName){
    	var me = this;
    	return me._doSelectGroupHeader(groupName, true);
    	
    },
    deSelectGroupHeader : function(groupName){
    	var me = this;
    	return me._doSelectGroupHeader(groupName, false);
    },
    selectGroup : function(groupName, expand){
    	var me = this;
    		me.selectGroupHeader(groupName);
		if(expand && me.collapsedState[groupName]){
			me.expand(groupName);
		}
    	me.selectGroupRecord(groupName);
    },
    deSelectGroup : function(groupName, collapse){
    	var me = this;
    		me.deSelectGroupHeader(groupName);
		if(collapse && !me.collapsedState[groupName]){
			me.collapse(groupName);
		}
    	me.deSelectGroupRecord(groupName);
    },
    expand: function(groupName){
    	var me = this,groupElement, array , unfolded, index;
    	if(me.isGroupHeaderElement(groupName)){
    		unfolded = me.view.store.groupUnfolded;
	    	array = me.getGroupValues(groupName);
	    	//no child expand
	    	if((index = me._getIndexInFolded(unfolded, array, true)).length> 0){
	    		for(var j in index){
					unfolded.splice(index[j],1);
				}
	    	}
	    	unfolded.push(array);
	    	if(array.length > 0){
	    		//remove parents
	    		for(var k = array.length-1; k >= 1; k--){
	    			if((index = me._getIndexInFolded(unfolded, array.slice(0, k), false)).length>0){
	    				for(var j in index){
	    					unfolded.splice(index[j],1);
	    					console.log('remove:', array.slice(0, k));
	    				}
	    			}
	    		}
	    	}
	    	console.log('unfolded:',unfolded);
	    	if(me.view.store.remoteGroup){
	    		me.block();
	    		me.group(me.lastGroupIndex);
	    		me.unblock();
	    		me.refreshIf();
	    		return;
	    	}
    	}
    	me.callParent(arguments);
    },
    groupField:function(index){
		var me = this,
		view = me.view,
		store = view.store;

		me.block();
		me.enable();
		//store.group(hdr.dataIndex);
		me.lastGroupIndex = me.lastGroupIndex || [];
		var flag = false;
		for (var i = 0; i < me.lastGroupIndex.length; i++) {
			if (me.lastGroupIndex[i] == index) {
				flag = true;
				break;
			}
		}
		if (!flag) {
			me.lastGroupIndex.push(index);
		}
		me.group(me.lastGroupIndex);
//		me.reconfigSummaryColumn();
//		me.pruneGroupedHeader();
		me.unblock();
		me.refreshIf();
	},
    group: function(index){
    	var me = this;
    	if(me.view.store.backUpGroupers){
    		me.view.store.backUpGroupers();
    	}
    	delete me.view.store.totalCount;
    	me.view.store.fireEvent('totalcountchange', me.view.store.totalCount);
    	me.view.store.group(index);
    },
    collapse: function(groupName){
    	var me = this, 
    		index,
    		groupElement, 
    		array ,
    		unfolded;
    	
    	if(me.isGroupHeaderElement(groupName)){
    		unfolded = me.view.store.groupUnfolded;
    		array = me.getGroupValues(groupName);
    		if((index = me._getIndexInFolded(unfolded, array, true)).length>0){
    			for(var j in index){
    				unfolded.splice(index[j],1);
    			}
    		}
    		
    		console.log('unfolded:',unfolded);
    		if(me.view.store.remoteGroup){
	    		me.block();
	    		me.group(me.lastGroupIndex);
	    		me.unblock();
	    		me.refreshIf();
	    		return;
	    	}
    	}
    	me.callParent(arguments);
    },
    _getIndexInFolded : function(unfolded, array, children){
    	var tmp = true, index = [];
    	for(var i = unfolded.length - 1; i>=0; i--){
			if((children ? array.length <= unfolded[i].length : array.length === unfolded[i].length)){
    			tmp = true;
    			for(var j in array){
    				if(array[j] !== unfolded[i][j]){
    					tmp = false;
						break;
    				}
    			}
    			if(tmp){
    				index.push(i);
    			}
    		}
    	}
    	return index;
    },
    onGroupMenuItemClick : function(menuItem, e){
		var me = this,
			menu = menuItem.parentMenu,
			hdr  = menu.activeHeader,
			view = me.view,
			store = view.store;
		me.summaryData = {};

		me.lastGroupIndex = me.lastGroupIndex || [];
		var flag = false;
		for (var i = 0; i < me.lastGroupIndex.length; i++) {
			if (me.lastGroupIndex[i] == hdr.dataIndex) {
				flag = true;
				break;
			}
		}
		if (!flag) {
			me.lastGroupIndex.push(hdr.dataIndex);
		}
		if(me.fireEvent("groupClick")!==false){
			me.block();
			me.enable();
			me.group(me.lastGroupIndex);
			//后台返回数据时才重新渲染Header
//			me.reconfigSummaryColumn();
//			me.pruneGroupedHeader();
			me.unblock();
			me.refreshIf();
		}else{
//			me.pruneGroupedHeader();
		}
    },
    onGroupClick: function(view, rowElement, groupName, e) {
		var me = this,
			selModel = me.view.getSelectionModel();
		if(Ext.fly(e.target).getAttribute('type') === 'selModel'){
			if(me.isSelected(rowElement)){
				me.deSelectGroup(rowElement);
			}else{
				me.selectGroup(rowElement, true);
			}
		}else{
			if (me.collapsible) {
				if (me.collapsedState[groupName]) {
					me.expand(groupName);
				} else {
					me.collapse(groupName);
				}
			}
		}
		me.grid.fireEvent('group', arguments);
	},
	fireSelectGroupEvent : function(sel, values, depth){
		var me = this, selModel;
		if((selModel = me.view.getSelectionModel())){
			selModel.fireEvent('selectgroup', me, sel, values, depth);
		}
	},
	onLoaded: function(){
		var me = this,
			field = me.getGroupField(),
			menuItem,
			visibleGridColumns,
			groupingByLastVisibleColumn;

		if (me.hideGroupedHeader) {
			if (me.lastGroupField) {
				menuItem = me.getMenuItem(me.lastGroupField);
				if (menuItem) {
					menuItem.setChecked(true);
				}
			}
			if (field) {
				visibleGridColumns = me.view.headerCt.getVisibleGridColumns();

				// See if we are being asked to group by the sole remaining visible column.
				// If so, then do not hide that column.
				groupingByLastVisibleColumn = ((visibleGridColumns.length === 1) && (visibleGridColumns[0].dataIndex == field));
				menuItem = me.getMenuItem(field);
				if (menuItem && !groupingByLastVisibleColumn) {
					menuItem.setChecked(false);
				}
			}
		}
		me.refreshIf();
		me.lastGroupField = field;
	},
    /**
     * Rewrite, clear old grouping columns and insert new copy of grouping columns
     * Grouping Column = Summary Column
     */
    reconfigSummaryColumn : function(){
    	var me = this;
    	var groupedHeaders = me.getGroupedHeaders(),
    		headerCt = me.grid.getView().getHeaderCt(),
    		groups = me.grid.store.groupers;
    	
    	if(me.view.selModel instanceof  Ext.selection.CheckboxModel && me.fistColumnIndex<1){
    		me.fistColumnIndex = 1;
    	}
    	
    	me.clearGroupColumn();
    	//clear old grouping columns
		if(Ext.isArray(groups.items)){
			for(var i = 0; i < groups.items.length;  i++){
				var dataIndex = groups.items[i].property;
				var column = me.getColumnByDataIndex(dataIndex);
				if(column){
					headerCt.insert(me.fistColumnIndex + i, {
						columnType:'summary', 
						menuDisabled: true ,
						header:column.text, 
						dataIndex : me.getGroupColumnDataIndex(dataIndex),
						renderer : column.renderer
					});
				}
			}
		}
    },
    onRefreshView : function(view, flexView){
    	var me = this;
    	if(flexView){
    		me.summaryData = flexView.summary;
    		me.summaryGroups = me.flattenGroups(me.getSummaryHeader());
    	}
		me.lastGroupIndex = me.getGroupFieldArray();
		me.reconfigSummaryColumn();
		me.pruneGroupedHeader();
    },
    attachEvents: function() {
		var me = this,
			view = me.view;
		view.on('refreshview', me.onRefreshView, me);
		if(view.selModel){
			view.selModel.addListener('refreshSelModel', function(selModel){
				var me = this,
					view = me.view, elements;
				if(selModel.groupChecked && view.store.groupers.getCount()>0){
					if(selModel.checkedAll){
						elements = Ext.query('.'+me.groupHeaderCls);
						for(var i=0; i<elements.length; i++){
							me.selectGroupHeader(elements[i]);
						}
					}else{
						for(var j = 0 ; j< selModel.groupChecked.length; j++){
							var groupName = '';
							for(var i=0; i<view.store.groupers.getCount(); i++){
								if(selModel.groupChecked[j].length< i+1){
									break;
								}
								groupName += me._buildGroupName(view.store.groupers.getAt(i).property, selModel.groupChecked[j][i]);
							}
							me.selectGroupHeader(groupName);
						}
					}
				}
			}, me);
			view.selModel.addListener('selectall', function(selModel){
				elements = Ext.query('.'+me.groupHeaderCls);
				for(var i=0; i<elements.length; i++){
					me.selectGroupHeader(elements[i]);
				}
			});
			view.selModel.addListener('deselectall', function(selModel){
				elements = Ext.query('.'+me.groupHeaderCls);
				for(var i=0; i<elements.length; i++){
					me.deSelectGroupHeader(elements[i]);
				}
			});
		}
		me.callParent(arguments);
	},
	getAdditionalData: function(data, idx, record, orig) {
		var me = this,
			view = this.view,
			hCt  = view.headerCt,
			o = {},
			col,
			tdAttrKey;
		var  groups = me.grid.store.groupers;
		if(Ext.isArray(groups.items)){
			for(var i = 0; i < groups.items.length;  i++){
				col = me.getColumnByDataIndex(me.getGroupColumnDataIndex(groups.items[i].property));
				if (col) {
					tdAttrKey = col.id + '-tdAttr';
					o[tdAttrKey] = this.indentByDepth(data) + " " + (orig[tdAttrKey] ? orig[tdAttrKey] : '');
					o.collapsed = 'true';
					o.data = record.getData();
				}
			}
		}
		return o;
	},
	getFeatureTpl: function(values, parent, x, xcount) {
		var me = this;
		tpl = [
			'<tpl if="typeof rows !== \'undefined\'">',
				// group row tpl
				'<tr id="{groupHeaderId}" class="' + me.groupHeaderCls + ' {hdCollapsedCls} {collapsibleClass} {selectionCls}' + me.groupDepthPrefix + '{depth}" depth="{depth}" groupName = "{name}">' + me.getGroupHeaderTpl(parent) + '</tr>',
				// this is the rowbody
				'<tr id="{groupBodyId}" class="' + me.groupBodyCls + ' {collapsedCls} ' + me.groupDepthPrefix + '{depth}"><td colspan="' + parent.columns.length + '" depth="{depth}" groupName = "{name}"><tpl if="rows.length &gt; 0">{%this.recursive = true%}{[this.recurse(values)]}</tpl></td></tr>',
			'</tpl>'
		].join('');
		return tpl;
	},
	getGroupHeaderTpl: function() {
		return '{[this.printGroupHeader(xindex)]}';
	},
	printGroupHeader: function(index) {
		var inner = this.view.getTableChunker().metaRowTpl.join('');
		inner = inner.replace(/.*(<tpl.*tpl>).*/, '$1');
		inner = inner.replace('{{id}}', '<div class="' + Ext.baseCSSPrefix + 'grid-group-title {cls}">{collapsed}{disValue}{gridSummaryValue}</div>');
		inner = inner.replace(this.nestedIdRe, '{id$1}');
		inner = new Ext.XTemplate(inner, {
			firstOrLastCls: Ext.view.TableChunker.firstOrLastCls
		});
		try{
			var data = this.getPrintData(index);
		}catch(e){
			console.log(e.message, e.stack);
			throw e;
		}
		var reVal = inner.applyTemplate({
			columns: data
		})
		return reVal;
	},
	getPrintData: function(index) {
		var me = this,
			columns = me.view.headerCt.getColumnsForTpl(),
			length = columns.length,
			remoteSummary = me.grid.getStore().remoteSummary,
			rowIdx = index - 1,
			colIdx = 0,
			header,
			renderer,
			value,
			metaData,
			view = me.view,
			store = view.store,
			record,
			data = [],
			active = me.summaryData,
			summarys = null,
			column;
		var name = '',disName = '';
		var checkModel = view.selModel instanceof Ext.selection.CheckboxModel;
		
		if (index) {
			name = me.summaryGroups[index - 1].name;
			disName = me.summaryGroups[index - 1].disName;
			active = me.summaryGroups[index - 1];
			summarys = me.summaryGroups[index - 1].summarys || {};
		}
		record = store.createModel(active);
		for (; colIdx < length; colIdx++) {
			metaData = {
				tdCls: '',
				style: ''
			};
			column = columns[colIdx];
			header = Ext.getCmp(column.id);
			
			if(checkModel && header.hasCls('x-column-header-checkbox')){
				if (metaData.css) {
					column.cssWarning = true;
					metaData.tdCls = metaData.css;
					delete metaData.css;
				}
				column["id-tdCls"] = metaData.tdCls +' '+ Ext.baseCSSPrefix + 'grid-group-no-title-td ' + Ext.baseCSSPrefix + 'grid-cell-row-checker ' + Ext.baseCSSPrefix + 'grid-group-cell-special';
				column["id-tdAttr"] = metaData.tdAttr;
				column["id-style"] = metaData.style;
				column.gridSummaryValue = '';
				column.disValue = '<div type="selModel" class="' + Ext.baseCSSPrefix + 'grid-row-checker">&nbsp;</div>';
				column.cls = '';
				column.depth=0;
				data.push(column);
				continue;
			}
			
			
			if (metaData.css) {
				// This warning attribute is used by the compat layer
				column.cssWarning = true;
				metaData.tdCls = metaData.css;
				delete metaData.css;
			}
			column["id-tdAttr"] = metaData.tdAttr;
			column["id-style"] = metaData.style;
			
			if(colIdx === (me.summaryGroups[index - 1].depth + me.fistColumnIndex)){
				column["id-tdCls"] = metaData.tdCls  +' '+ Ext.baseCSSPrefix + 'grid-group-title-td';
				if(header.renderer){
					name = header.renderer.call(
							header.scope || header,
							name,
							// metadata per cell passing an obj by reference so that
							// it can be manipulated inside the renderer
							metaData,
							record,
							rowIdx,
							colIdx,
							store,
							view
						);
				}
				column.disValue = disName;
				column.depth= (me.summaryGroups[index - 1].depth || 0) * this.depthToIndent;
			}else {
				if(remoteSummary){
					value = summarys ? summarys[header.dataIndex.replace(me._groupColumnDataIndexSuffix,'')] : value = header.emptyCellText;;
				}else{
					value = active[header.dataIndex];
					renderer = header.summaryRenderer;
					if (!renderer && header.summaryType) {
						renderer = header.renderer;
					}
					if (typeof renderer == "function") {
						value = renderer.call(
							header.scope || header,
							value,
							// metadata per cell passing an obj by reference so that
							// it can be manipulated inside the renderer
							metaData,
							record,
							rowIdx,
							colIdx,
							store,
							view
						);
					}
				}
				column["id-tdCls"] = metaData.tdCls  +' '+ Ext.baseCSSPrefix + 'grid-group-no-title-td';
				column.disValue = '&nbsp;';
				column.depth=0;
				column.gridSummaryValue = Ext.isString(value) ? value : header.emptyCellText;
			}
			data.push(column);
		}
		return data;
	},
	
	
	_NAME_KEY_GROUP : 'MUTIGROUPING.',
	_NAME_KEY_GROUP_NAME : 'MUTIGROUPING-NAME.',
	_buildGroupName : function(grouper, key){
		var me = this;
		return me._NAME_KEY_GROUP + grouper + me._NAME_KEY_GROUP_NAME + key;
	},
	
	_fillGroupHeader : function(parent, summary, depth){
		var me = this, tmp,
			unfolded = me.view.store.groupUnfolded,
			open;
		var start = new Date().getTime();
		if(!summary){
			return;
		}
		for(var key in summary){
			tmp = {depth:depth, name:key, disName : key,records:[] , grouper:me.view.store.groupers.getAt(depth), collapsed : true, allNames:[]};
			if(depth === 0){
				parent.push(tmp);
			}else{
				tmp.parent = parent;
				tmp.allNames = Ext.clone(parent.allNames);
				if(!parent.children){
					parent.children = [];
				}
				parent.children.push(tmp);
			}
			tmp.allNames.push(key);
			if(unfolded){
				for(var i in unfolded){
					if(unfolded[i].join().indexOf(tmp.allNames.join()) === 0){
						tmp.collapsed = false;
						break;
					}
				}
			}
			if(!tmp.collapsed){
				me._fillGroupHeader(tmp, summary[key], depth+1);
			}
		}
		if(!depth || depth===0){
			console.log('FillHeader Use:',new Date().getTime() - start, parent);
		}
	},
	getSummaryHeader : function(){
		var me = this,
			group=[];
		me._fillGroupHeader(group, me.summaryData, 0);
		return group;
	},
	_fillGroupRecord: function(group, records){
		var me = this,
			groupFields = me.getGroupFieldArray();
		if(group.collapsed){
			return ;
		}
		if(group.depth === groupFields.length-1){ //leaf node
			outter: for(var i in records){
				for(var j=0; j<groupFields.length; j++){
					if(records[i].get(groupFields[j]) !== group.allNames[j]){
						continue outter;
					}
				}
				group.records.push(records[i]);
			}
		}else if(group.children){
			for(var i in group.children){
				me._fillGroupRecord(group.children[i], records);
			}
		}
	},
	getSummaryGroups : function(records){
		var me = this, 
			group = me.getSummaryHeader();
		for(var i in group){
			if(!group[i].collapsed){
				me._fillGroupRecord(group[i], records);
			}
		}
		console.log('-->', group)
		return group;
	},
	// return matching preppedRecords
	collectData: function(records, preppedRecords, startIndex, fullWidth, o) {
		var me	= this,
			store = me.view.store,
			collapsedState = me.collapsedState,
			collapseGroups,
			g,
			groups, gLen, group, group2;
		var start = new Date();
		if (me.startCollapsed !== false) {
			collapseGroups = me.startCollapsed;
			me.startCollapsed = false;
		}

		if (!me.disabled && store.isGrouped()) {
			o.rows = groups = me.getSummaryGroups(records);
			
			for (g = 0; g < groups.length; g++) {
				group = groups[g];
				if(!group.ownName){
					group.ownName = group.name;
					group.name = me._buildGroupName(group.grouper.property, group.name);
				}
				if (collapseGroups === true || collapseGroups <= group.depth || group.collapsed) {
					collapsedState[group.name] = true;
				}else{
					collapsedState[group.name] = false;
				}

				if (group.children) {
					for (gLen = group.children.length - 1; gLen >= 0; gLen--) {
						var child = group.children[gLen];
						child.parent = group.name;
						if(!child.ownName){
							child.ownName = child.name;
							child.name = group.name + me._buildGroupName(child.grouper.property, child.name);
						}
						collapsedState[child.name] = collapsedState[group.name] || collapsedState[child.name];
						groups.splice(g + 1, 0, child);
					}
					me.getGroupRows(group, [], preppedRecords, fullWidth);
					
				} else {
					group.children = group.records;
					if (group.children.length == 0) {
                        group.noExpandCls = me.noExpandCls;
                        me.getGroupRows(group, [], preppedRecords, fullWidth);
                    } else {
                        me.getGroupRows(group, records, preppedRecords, fullWidth);
                    }
					/*if (group.children.length == 1) {
						me.getGroupRows(group, [], preppedRecords, fullWidth);
						group.collapsibleClass = '';
					} else {
						me.getGroupRows(group, records, preppedRecords, fullWidth);
					}*/
				}
				if (collapsedState[group.parent]) {
					group.hdCollapsedCls += ' ' + me.collapsedCls;
				}
			}
		}
		console.log('collectData:',new Date() - start);
		return o;
	},
	getGroupRows: function(group, records, preppedRecords, fullWidth) {
		var me = this,
			children = group.children,
			rows = group.rows = [],
			view = me.view,
			header = me.getGroupedHeader(),
			groupField = me.getGroupField(),
			groupFieldValueArray,
			groupFieldArray = me.getGroupFieldArray(),
			index = -1,
			r,
			tmpSumary,
			curGroupFields,
			rLen = records.length,
			remoteSummary = view.store.remoteSummary,
//			summarys = me.summaryData,
			record;
		
		if (view.store.buffered) {
//			me.collapsible = false;
		}

		group.viewId = view.id;

		for (r = 0; r < rLen; r++) {
			record = records[r];

			groupFieldValueArray = me.getGroupFieldValueArray(record);
			if (groupFieldValueArray.join('') == group.name) {
				index = r;
			}
			if (Ext.Array.indexOf(children, record) != -1) {
				rows.push(Ext.apply(preppedRecords[r], {
					depth : 1
				}));
			}
		}

		group.groupField = groupField,
		group.groupHeaderId = me.getGroupHeaderId(group.name);
		group.groupBodyId = me.getGroupBodyId(group.name);
		group.fullWidth = fullWidth;
		group.columnName = header ? header.text : groupField;
		group.groupValue = group.name;
//		if(remoteSummary){
//			tmpSummary = summarys;
//			curGroupFields = groupFieldArray.slice(0, group.depth+1);
//			for(var g in curGroupFields){
//				if(!tmpSummary){
//					break;
//				}
//				tmpSummary = tmpSummary[curGroupFields[g]]
//			}
//			group.summarys = (tmpSummary ? tmpSummary.summary : {}) || {};
//		}
		if (header && index > -1) {
			group.name = group.renderedValue = preppedRecords[index][header.id];
		}
		if (me.collapsedState[group.name]) {
			group.collapsedCls = me.collapsedCls;
			group.hdCollapsedCls = me.hdCollapsedCls;
		} else {
			group.collapsedCls = group.hdCollapsedCls = '';
		}

		if (me.collapsible) {
			group.collapsibleClass = me.hdCollapsibleCls;
		} else{
			group.collapsibleClass = '';
		}
		
		group.selectionCls = '';
		
//		if(!Ext.isEmpty(group.parent,true)){
//			group.disName = group.name.split(group.parent)[1];
//		}
//		else{
//			group.disName = group.name;
//		}
		return group;
	},
	clearGroupColumn : function(){
		var me = this;
		if(Ext.isArray(me.lastGroupIndex)){
			for(var i=0; i < me.lastGroupIndex.length; i++){
	    		var column = me.getColumnByDataIndex(me.getGroupColumnDataIndex(me.lastGroupIndex[i]));
	    		if(column){
	    			me.grid.getView().getHeaderCt().remove(column.getIndex());
	    		}
	    	}
		}
	},
    cleanGrouping:function(){
    	this.summaryData = {};
		var _store = this.view.getStore();
		this.showPrunedHeader();
		_store.clearGrouping();
		this.clearGroupColumn();
		this.lastGroupIndex = [];
	},
	/**
	 * 无缩进
	 */
	indentByDepth: function(values) {
		return '';
	}
});