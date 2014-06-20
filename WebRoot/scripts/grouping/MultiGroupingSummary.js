/**
 * This feature adds an aggregate summary row at the bottom of each group that is provided
 * by the {@link Ext.grid.feature.Grouping} feature. There are two aspects to the summary:
 *
 * ## Calculation
 *
 * The summary value needs to be calculated for each column in the grid. This is controlled
 * by the summaryType option specified on the column. There are several built in summary types,
 * which can be specified as a string on the column configuration. These call underlying methods
 * on the store:
 *
 *  - {@link Ext.data.Store#count count}
 *  - {@link Ext.data.Store#sum sum}
 *  - {@link Ext.data.Store#min min}
 *  - {@link Ext.data.Store#max max}
 *  - {@link Ext.data.Store#average average}
 *
 * Alternatively, the summaryType can be a function definition. If this is the case,
 * the function is called with an array of records to calculate the summary value.
 *
 * ## Rendering
 *
 * Similar to a column, the summary also supports a summaryRenderer function. This
 * summaryRenderer is called before displaying a value. The function is optional, if
 * not specified the default calculated value is shown. The summaryRenderer is called with:
 *
 *  - value {Object} - The calculated value.
 *  - summaryData {Object} - Contains all raw summary values for the row.
 *  - field {String} - The name of the field we are calculating
 *
 * ## Example Usage
 *
 *     @example
 *     Ext.define('TestResult', {
 *         extend: 'Ext.data.Model',
 *         fields: ['student', 'subject', {
 *             name: 'mark',
 *             type: 'int'
 *         }]
 *     });
 *
 *     Ext.create('Ext.grid.Panel', {
 *         width: 200,
 *         height: 240,
 *         renderTo: document.body,
 *         features: [{
 *             groupHeaderTpl: 'Subject: {name}',
 *             ftype: 'groupingsummary'
 *         }],
 *         store: {
 *             model: 'TestResult',
 *             groupField: 'subject',
 *             data: [{
 *                 student: 'Student 1',
 *                 subject: 'Math',
 *                 mark: 84
 *             },{
 *                 student: 'Student 1',
 *                 subject: 'Science',
 *                 mark: 72
 *             },{
 *                 student: 'Student 2',
 *                 subject: 'Math',
 *                 mark: 96
 *             },{
 *                 student: 'Student 2',
 *                 subject: 'Science',
 *                 mark: 68
 *             }]
 *         },
 *         columns: [{
 *             dataIndex: 'student',
 *             text: 'Name',
 *             summaryType: 'count',
 *             summaryRenderer: function(value){
 *                 return Ext.String.format('{0} student{1}', value, value !== 1 ? 's' : '');
 *             }
 *         }, {
 *             dataIndex: 'mark',
 *             text: 'Mark',
 *             summaryType: 'average'
 *         }]
 *     });
 */
Ext.define('Ext.grid.feature.MultiGroupingSummary', {

	/* Begin Definitions */

	extend: 'Ext.grid.feature.MultiGrouping',

	alias: 'feature.multigroupingsummary',
	name : 'MultiGroupSummary',
	mixins: {
		summary: 'Ext.grid.feature.AbstractSummary'
	},

	/* End Definitions */

	init: function() {
		this.mixins.summary.init.call(this);
	},
	
	/**
	 * Gets any fragments needed for the template.
	 * @private
	 * @return {Object} The fragments
	 */
	getFragmentTpl: function() {
		var me = this,
			fragments = me.callParent();

		Ext.apply(fragments, me.getSummaryFragments());
		if (me.showSummaryRow && me.view.store.isGrouped()) {
			// this gets called before render, so we'll setup the data here.
			//me.summaryGroups = me.view.store.getGroups();
			me.summaryGroups = me.flattenGroups(me.view.store.getGroupData(false));
			me.summaryData = me.generateSummaryData();
		}
		return fragments;
	},

	/**
	 * Gets any fragments to be used in the tpl
	 * @private
	 * @return {Object} The fragments
	 */
	getSummaryFragments: function(){
		var fragments = {};
		if (this.showSummaryRow) {
			Ext.apply(fragments, {
				printGroupSummary: Ext.bind(this.printGroupSummary, this)
			});
		}
		return fragments;
	},
	getName:function(){
		var me = this;
		return me.name;
	},
	getGroupHeaderColumns: function() {
		return '{[this.printGroupSummary(xindex)]}';
	},
	indentByDepthNew: function(values) {
		return 'style="padding-left:'+ ((values || 0) * this.depthToIndent) + 'px;"';
	},
	/**
	 * Prints a summary row
	 * @private
	 * @param {Object} index The index in the template
	 * @return {String} The value of the summary row
	 */
	printGroupSummary: function(index) {
		var inner = this.view.getTableChunker().metaRowTpl.join('');

		inner = inner.replace(/.*(<tpl.*tpl>).*/, '$1');
		inner = inner.replace('style="','style="padding-left:{depth}px; ');
		inner = inner.replace('{{id}}', '<div class="' + Ext.baseCSSPrefix + 'grid-group-title">{collapsed}{disValue}{gridSummaryValue}</div>');
		inner = inner.replace(this.nestedIdRe, '{id$1}');
		inner = new Ext.XTemplate(inner, {
			firstOrLastCls: Ext.view.TableChunker.firstOrLastCls
		});
		var reVal = inner.applyTemplate({
			columns: this.getPrintData(index)
		})
		reVal = reVal.replace(/grid-group-title/g,'grid-group-no-title');
		reVal = reVal.replace('grid-group-no-title','grid-group-title');
		if(this.view.getSelectionModel().mode === "SINGLE"){
			return reVal;
		}
		var arr = reVal.split("</td>");
		for(var i in arr){
			if(i == 0){
				reVal = arr[i].replace('<td','<td colspan = 2');
			}
			if(i>1){
				reVal = reVal +'</td>'+arr[i];
			}
		}
		
		//reVal = reVal.replace('<td','<td colspan = "2"');
		return reVal;
	},

	/**
	 * Gets the data for printing a template row
	 * @private
	 * @param {Number} index The index in the template
	 * @return {Array} The template values
	 */
	getPrintData: function(index) {
		var me = this,
			columns = me.view.headerCt.getColumnsForTpl(),
			length = columns.length,
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
			column;
		var name = '';
		if (index) {
			name = me.summaryGroups[index - 1].name;
			active = active[name];
			if(me.summaryGroups[index - 1].hasOwnProperty('parent')){
				name = name.split(me.summaryGroups[index - 1].parent)[1];
			}
			
		}
		record = store.createModel(active);
		for (; colIdx < length; ++colIdx) {
			metaData = {
				tdCls: '',
				style: ''
			};
			column = columns[colIdx];
			header = Ext.getCmp(column.id);
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

			if (metaData.css) {
				// This warning attribute is used by the compat layer
				column.cssWarning = true;
				metaData.tdCls = metaData.css;
				delete metaData.css;
			}
			column["id-tdCls"] = metaData.tdCls;
			column["id-tdAttr"] = metaData.tdAttr;
			column["id-style"] = metaData.style;
			if (typeof value === 'undefined' || value === null || value === '') {
				value = header.emptyCellText;
			}
			column.gridSummaryValue = value;
			column.disValue = '';
			column.depth=0;
			if(colIdx==0){
				column.disValue = name;
				column.depth= (me.summaryGroups[index - 1].depth || 0) * this.depthToIndent;
			}
			data.push(column);
		}
		return data;
	},

	/**
	 * Generates all of the summary data to be used when processing the template
	 * @private
	 * @return {Object} The summary data
	 */
	generateSummaryData: function(){
		var me = this,
			data = {},
			remoteData = {},
			store = me.view.store,
			groupField = this.getGroupField(),
			reader = store.proxy.reader,
			groups = me.summaryGroups,
			columns = me.view.headerCt.getColumnsForTpl(),
			remote,
			i,
			length,
			fieldData,
			root,
			key,
			comp,
			summaryRows,
			s,
			sLen,
			convertedSummaryRow;

		for (i = 0, length = groups.length; i < length; ++i) {
			data[groups[i].name] = {};
		}

		/**
		 * @cfg {String} [remoteRoot=undefined]
		 * The name of the property which contains the Array of summary objects.
		 * It allows to use server-side calculated summaries.
		 */
		if (me.remoteRoot && reader.rawData) {
			// reset reader root and rebuild extractors to extract summaries data
			root = reader.root;
			reader.root = me.remoteRoot;
			reader.buildExtractors(true);
			summaryRows = reader.getRoot(reader.rawData);
			sLen	  = summaryRows.length;

			// Ensure the Reader has a data conversion function to convert a raw data row into a Record data hash
			if (!reader.convertRecordData) {
				reader.buildExtractors();
			}

			for (s = 0; s < sLen; s++) {
				convertedSummaryRow = {};

				// Convert a raw data row into a Record's hash object using the Reader
				reader.convertRecordData(convertedSummaryRow, summaryRows[s]);
				remoteData[convertedSummaryRow[groupField]] = convertedSummaryRow;
			}

			// restore initial reader configuration
			reader.root = root;
			reader.buildExtractors(true);
		}

		for (i = 0, length = columns.length; i < length; ++i) {
			comp = Ext.getCmp(columns[i].id);
			fieldData = me.getSummaryField(store, comp.summaryType, comp.dataIndex, true);

			for (key in fieldData) {
				if (fieldData.hasOwnProperty(key)) {
					data[key][comp.dataIndex] = fieldData[key];
				}
			}

			for (key in remoteData) {
				if (remoteData.hasOwnProperty(key)) {
					remote = remoteData[key][comp.dataIndex];
					if (remote !== undefined && data[key] !== undefined) {
						data[key][comp.dataIndex] = remote;
					}
				}
			}
		}
		return data;
	}
});