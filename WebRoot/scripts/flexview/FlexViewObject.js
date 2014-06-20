Ext.define('DigiCompass.Web.app.data.FlexViewObject', {
	extend: 'Object',
	id : null,
	config : {
		primary : null,
		properties : null,
		data : null,
		meta : null,
		headerValues : null,
		summary : null
	},
	records : [],
	extColumns : [],
	dataFields : [],
	abstractSplit : '|',
	propertyValueSplit : '$',
	constructor : function(config) {
		var me = this;
		me.initConfig(config);
		me.id = me.id || Ext.id();
		me.superclass.constructor.call(this, config);
		if(!me.meta.view.columnHeader){
			me.meta.view.columnHeader = [];
		}
		if(!me.meta.view.rowHeader){
			me.meta.view.rowHeader = [];
		}
		me.parseGrid();
	},
	parseGrid : function(){
		var me = this;
		me.extColumns = [];
		me._extColumnsTmp = {};
		
		me._parseFields();
		me.records = me.data;
		
		me._fillRowHeaderColumnAndFields(me.extColumns, me.meta.view.rowHeader);
		me._fillColumnHeaderColumnAndFields(me.extColumns, me.meta.view.columnHeader);
		
		console.log('Flex View:', me)
//		me._createRowHeaderColumns(me.meta.view.rowHeader, me.extColumns, null, me.dataFields);
//        console.log(me.dataFields);
        
        // create columns
//        me._createColumns(me.headerValues, me.meta.view.columnHeader,me.extColumns, '', me.dataFields);
//        console.log(me.dataFields);
		
//		me._parseStoreData(me.storeData);
	},
	getMeta : function(){
		if(me.meta){
        	unfolded = me.meta.unfolded;
        	if(me.meta.view){
        		metaData.view  = Ext.clone(me.meta.view);
        		for(var k in extGroups){
        			var g = {name : extGroups[k].property, type : 'NAME'};
        			if(extGroups[k].direction){
        				g.sort = extGroups[k].direction != 'ASC' ? 'DESCENDING' : 'ASCENDING';
        			}
        			groups.push(g);
        		}
        		metaData.view.groupByProperties = groups;
        		params.columnHeader = Ext.JSON.encode(metaData.view.columnHeader || [])
        		params.rowHeader = Ext.JSON.encode(metaData.view.rowHeader || []);
        		delete metaData.view.columnHeader;
        		delete metaData.view.rowHeader;
        	}
        }
	},
	_parseFields : function(){
		var me = this;
		me.dataFields = [];
		for(var key in me.properties){
			me.dataFields.push(me.encodeDataIndex(me.properties[key]));
		}
	},
	encodeDataIndex : function(dataIndex){
		if(Ext.isString(dataIndex)){
			return dataIndex.replace(/\'/g,'_');
		}
	},
	//TODO
	_parseStoreData : function(){
		var me = this;
		var properties = me.properties;
		var datas = me.data;
		var headerValues = me.headerValues;
		var view = me.meta.view;
		var columnHeader = view.columnHeader;
		var rowHeader = view.rowHeader;
		
		if(true){
			me.storeData = me.data;
			return;
		}
//		me.storeData = [['Tao.Zeng','1000','2000','3000','4000'],
//		                ['Gouyong.Peng','10010','20100','30010','40100'],
//		                ['Aray','10020','20200','30020','40200'],
//		                ['Junping.Yang','10400','24000','30030','40400'],
//		                ['AA','10500','26000','36000','40500'],
//		                ['BB','10200','20400','33000','46000']
//		                ];
		
		
        var properties = ["name" , "year", "gender", "birthday", "in", "out"];
        
		// create datas
		
		if (!rowHeader){
			rowHeader = [];
		}
		if (!columnHeader){
			columnHeader = [];
		}
		
		
		var objDatas = me._createJsonDatas(headerValues, rowHeader, columnHeader, properties, datas);
//		console.log('objDatas = ');
//    	console.log(objDatas);
    	
		var arrayData = me._jsonDatasToArray(objDatas, null, null);
//		console.log('arrayData = ');
//    	console.log(arrayData);
    	
    	me.storeData = arrayData;
	},
	getColumnNum : function(){
		var me = this, i = 0;
		for(var key in me._extColumnsTmp){
			if(!me._extColumnsTmp[key].abstractColumn){
				i++;
			}
		}
		return i;
	},
	_buildEmptyRow : function(){
		var me = this,row = [];
		for(var i = 0; i<me.getColumnNum(); i++){
			row.push(null);
		}
		return row;
	},
	_getPropertyKeyByIndex : function(index){
		var me = this;
		return me.properties[index];
	},
	_getIndexByPropertyKey : function(key){
		var me = this;
		for(var i = 0; i < me.properties.length; i++){
			if(me.properties[i] === key){
				return i;
			}
		}
		return -1;
	},
	
	
	_fillRowHeaderColumnAndFields : function(columnArray, headers, level){
		var me = this,
			col,
			level = level || 0;
		if(headers.length === 0) return;
		if(columnArray.length === level){
			col = {dataIndex : headers[0].name, field : headers[0].name, text : headers.length === 1 ? (headers[0].displayName || ''): '' ,
				abstractColumn : false, 
				sortable : false};
			
			col['@type'] = header['@type'];
			col.dataIndex = me.encodeDataIndex(col.dataIndex);
			columnArray.push(col);
			me._extColumnsTmp[col.dataIndex] = {name : col.dataIndex, type : 'VALUE', abstractColumn : false, sortable:false};
		}
		for(var i in headers){
			if(Ext.isArray(headers[i].childHeaders)){
				me._fillRowHeaderColumnAndFields(columnArray, headers[i].childHeaders, level+1);
			}
		}
	},
	_fillColumnHeaderColumnAndFields : function(columnArray, headers, abstractColumnName){
		var me = this,
			col, header, vals;
		abstractColumnName = abstractColumnName || '';
		for(var i in headers){
			header = headers[i];
			if(header.type === 'VALUE'){
				vals = me.headerValues[header.name];
				for(var k in vals){
					col = {dataIndex : vals[k], 
							text : (vals[k].lastIndexOf(me.propertyValueSplit)>-1 ? vals[k].substring(vals[k].lastIndexOf(me.propertyValueSplit)+1) : vals[k])|| ''};
					if(Ext.isArray(header.childHeaders) && header.childHeaders.length>0){
						col.columns = [];
						col.abstractColumn = true;
						me._fillColumnHeaderColumnAndFields(col.columns, header.childHeaders, abstractColumnName + header.name + me.propertyValueSplit + vals[k] + me.abstractSplit);
					}else{
						col.abstractColumn = false;
					}
					columnArray.push(me._fillColumnHeader(col, header));
				}
			}else{
				col = {dataIndex : abstractColumnName + header.name};
				if(Ext.isArray(header.childHeaders) && header.childHeaders.length>0){
					col.columns = [];
					col.abstractColumn = true;
					me._fillColumnHeaderColumnAndFields(col.columns, header.childHeaders, abstractColumnName + header.name + me.abstractSplit);
				}else{
					col.text =  headers[i].displayName || '';
					col.abstractColumn = false;
				}
				columnArray.push(me._fillColumnHeader(col, header));
			}
		}
	},
	_fillColumnHeader : function(col, header){
		var me = this;
		col['@type'] = header['@type'];
		col.dataIndex = me.encodeDataIndex(col.dataIndex);
		col.type = header.type;
//		col.field = header.name;
		col.sortable = false;
		if(header.link){
			col.link = true;
			col.renderer = function(val, style, record){
				if(record.get('groupindex')){
			        return val;
			    }
			    if(!Ext.isEmpty(val) && val !== 'N/A'){
			    	return '<a href="javascript:void(0)">'+val+'</a>';
			    }
			    return val;
			}
		}
		me._extColumnsTmp[col.dataIndex] = {name : header.name, type : header.type, abstractColumn : col.abstractColumn};
		if(!Ext.isEmpty(header.formatType)){
			me._fillColumnHeaderFormat(col, header.formatType, header.format);
		}
		if(!Ext.isEmpty(header.editorFieldType)){
			me._fillColumnHeaderEditor(col, header.editorFieldType, header.format);
		}
		if(header.hidden === true){
			col.hidden = true;
			col.width = 50;
		}
		return col;
	},
	_fillColumnHeaderFormat : function(col, formatType, format){
		if(!Ext.isEmpty(formatType)){
			col.xtype = formatType;
			switch(formatType){
			case 'numbercolumn':
				col.format= format || '0,0.0000';
				col.align= 'right';
				break;
			case 'integercolumn':
				col.format= format || '0,0';
				col.align= 'right';
				break;
			case 'percentcolumn':
				col.format= format || '00.00';
				col.align= 'right';
				break;
			case 'percentcolumnnotchange':
				col.format = format || '00.00'
				col.align = 'right'
				break;
			case 'datecolumn':
				col.format = format || 'Y-m-d';
				break;
			
			}
		}
	},
	_fillColumnHeaderEditor : function(col, editorType, format){
		if(!Ext.isEmpty(editorType)){
			col.editor = {
				xtype : editorType,// NUMBER(5,2)
				allowBlank : false
			}
			if(editorType === 'datecolumn'){
				col.editor.format = 'Y-m-d H:i:s';
			}
		}
	},
	isSameDataModel : function(fields){
		var me = this;
		if(me.dataFields.length === fields.length){
			for(var i=0; i<me.dataFields.length; i++){
				if(me.dataFields[i] !== fields[i].name){
					return false;
				}
			}
		}else{
			return false;
		}
		return true;
	},
	isSameHeader : function(columns){
		var me = this;
		if(me.extColumns.length === columns.length){
			for(var i=0; i<me.extColumns.length; i++){
				if(me.extColumns[i].dataIndex !== columns[i].dataIndex){
					return false;
				}
			}
		}else{
			return false;
		}
		return true;
	},
	// create columns by recursion.
    _createColumns : function(headerValues, columnHeader, columns, prefix, dataFields){
    	var me = this;
    	if (!columns){
    		columns = [];
    	}
    	if (!dataFields){
    		dataFields = [];
    	}
    	for(var i=0, len=columnHeader.length; i<len; i++){
    		var header = columnHeader[i];
    		
    		// init arguments
        	var name = header.name;
        	var displayName = header.displayName;
        	var type = header.type;
        	var child = header.childHeaders;
        	var columnNames = [];
        	var isName = false;
       
        	// init columnNames
        	if (type === HeaderType.VALUE){
        		// get column value
        		columnNames = headerValues[name];
        		isName = false;
        	} else {
        		columnNames.push(displayName);
        		isName = true;
        	}
    		
        	for(var j=0, size=columnNames.length; j<size; j++){
        		var column = {};
        		var columnName = columnNames[j];
        		var dataIndex = '';
        		if(prefix){
        			dataIndex = prefix + '$$';
        		}
        		dataIndex += isName ? header.name : columnName;
        		
        		var args = {
        				header : header,
        				text : columnName,
        				dataIndex : dataIndex,
        				dataFields : dataFields
        			};
        		
        		if (child && child.length > 0){
        			args.hasChild = true;
        			column = me._createHeaderItem(args);
        			
        			me._createColumns(headerValues, child, column.columns, dataIndex, dataFields);
        		} else {
        			// direct create column
        			args.hasChild = false;
        			column = me._createHeaderItem(args);
        		}
        		//add column to columns
        		columns.push(column);
        	}
    	}
    	return columns;
    },
    _createHeaderItem : function(args){
    	var header = args.header;
    	var hasChild = args.hasChild;
    	var text = args.text;
    	var dataIndex = args.dataIndex;
    	
    	var column = {};
    	column.text = text;
    	if (hasChild){
    		column.columns = [];
    	}else{
    		column.sortable = true;
    		column.dataIndex = dataIndex;
    		
    		args.dataFields.push(dataIndex);
    	}
    	return column;
    },
    
	// create rowheader columns.
    _createRowHeaderColumns : function(rowHeader, columns, prefix, dataFields){
    	var me = this;
    	if (!columns){
    		columns = [];
    	}
    	if (!dataFields){
    		dataFields = [];
    	}
    	if (!rowHeader){
    		return columns;
    	}
    	for(var i=0, len=rowHeader.length; i<len; i++){
    		var header = rowHeader[i];
    		
    		// init arguments
        	var name = header.name;
        	var displayName = header.displayName;
        	var type = header.type;
        	var child = header.childHeaders;
        	
        	var dataIndex = '';
    		if(prefix){
    			dataIndex = prefix + '$$';
    		}
    		dataIndex += header.name;
       
        	var column = {};
    		var args = {
    				header : header,
    				text : displayName || '',
    				dataIndex : dataIndex,
    				dataFields : dataFields
    			};
    		dataFields.push(dataIndex);
    		if (child && child.length > 0){
    			column = me._createRowHeaderItem(args);
    			//add column to columns
        		columns.push(column);
        		
        		me._createRowHeaderColumns(child, columns, dataIndex, dataFields);
    		} else {
    			// direct create column
    			column = me._createRowHeaderItem(args);
    			//add column to columns
        		columns.push(column);
    		}
    		
    		if (i === 0){
    			break;
    		}
    	}
    	return columns;
    },
    _createRowHeaderItem : function(args){
    	var header = args.header;
    	var text = args.text;
    	var dataIndex = args.dataIndex;
    	
    	args.dataFields.push(dataIndex);
    	
    	var column = {};
    	column.text = text;
    	column.sortable = true;
    	column.dataIndex = dataIndex;
//    	column.renderer = rowHeaderRender;
    	return column;
    },
	// create json data
	_createJsonDatas : function(headerValues, rowHeader, columnHeader, properties, datas){
		var me = this;
    	var jsonDatas = [];
    	for(var i=0, len=datas.length; i<len; i++){
    		var data = datas[i];
    		
    		// create data object from array.
    		var dataObj = me._createObjectFromArray(properties, data);
    		
    		// handler rowHeader 
    		var record = me._handlerDataByRowHeader(headerValues, rowHeader, jsonDatas, dataObj);
    		
    		
    		var tempHeaderValues = me._createHeaderValuesByData(headerValues, dataObj);
    		var objDatas = me._createDataByHeaders(rowHeader, tempHeaderValues, null);
    		var args = {
   				 index : 0,
   				 rowData : objDatas
	   		};
	   		var childObj = me._getJsonDataChild([record], null, args);
    		
    		// handler columnHeader
	   		me._handlerDataByColumnHeader(rowHeader, columnHeader, childObj.jsonDatas, dataObj, childObj.propertyName);
    	}
    	return jsonDatas;
    },
    _createObjectFromArray : function(peroperties,data){
    	var obj = {};
    	for(var i=0, len=peroperties.length; i<len; i++){
    		var property = peroperties[i];
    		var value = data[i];
    		obj[property] = value;
    	}
    	return obj;
    },
    _handlerDataByRowHeader : function(headerValues, rowHeader, jsonDatas, dataObj){
    	var me = this;
    	var tempObj = {};
    	if (!rowHeader){
    		return tempObj;
    	}
    	for(var i=0, len=rowHeader.length; i<len; i++){
    		var header = rowHeader[i];
    		
    		// init arguments
        	var name = header.name;
        	var type = header.type;
        	var child = header.childHeaders;
        	var hasProperty = false;
        	var jsonData;
        	
        	var propertyValue;
        	if (type === HeaderType.VALUE){
        		propertyValue = dataObj[name];
        	} else {
        		propertyValue = name;
        	}
        	
        	for(var j=0, jLen=jsonDatas.length; j<jLen; j++){
        		jsonData = jsonDatas[j];
        		if (jsonData.name === propertyValue){
        			hasProperty = true;
        			break;
        		}
        	}
        	if (!hasProperty) {
        		jsonData = createDataObj({
        			name : propertyValue,
        			value : propertyValue,
        			type : type,
        			isRowEnd : (child && child.length > 0) ? false : true,
        			isRow : true
        		});
        		jsonDatas.push(jsonData);
        	}
        	
    		if (child && child.length > 0){
    			me._handlerDataByRowHeader(headerValues, header.childHeaders, jsonData.child, dataObj);
    		} else {
//    			  jsonData;
    		}
    		if (i === 0){
    			tempObj = jsonData;
    		}
    	}
    	return tempObj;
    },
    _createHeaderValuesByData : function(headerValues, obj){
    	var newHeaderValues = {};
		for(var t in headerValues){
			var temp = [];
			temp.push(obj[t]);
			newHeaderValues[t] = temp;
		}
    	return newHeaderValues;
    },
    _createDataByHeaders : function(headers, headerValules, datas){
    	var me = this;
    	if (!datas){
    		datas = [];
    	}
    	
    	for(var i=0, len=headers.length; i<len; i++){
    		var header = headers[i];
    		
    		// init arguments
        	var name = header.name;
        	var type = header.type;
        	var child = header.childHeaders;
        	var columnNames = [];
       
        	// init columnNames
        	if (type === HeaderType.VALUE){
        		// get column value
        		columnNames = headerValules[name];
        	}
    		
        	for(var j=0, size=columnNames.length; j<size; j++){
        		var columnName = columnNames[j];
        		
        		datas.push(columnName);
        		
        		if (child && child.length > 0){
        			me._createDataByHeaders(child, headerValules, datas);
        		}
        	}
    	}
    	return datas;
    },
    _getJsonDataChild : function(jsonDatas, propertyName, args){
    	var me = this;
    	var index = args.index;
    	var rowData = args.rowData;
    	
    	if (!propertyName){
    		propertyName = '';
    	}
    	for(var i=0, len=jsonDatas.length; i<len; i++){
    		var item = jsonDatas[i];
    		var name = item.name;
    		var type = item.type;
    		
    		if(type === HeaderType.NAME){
    			propertyName = name;
    		}
    		
    		if (item.isRow && name === rowData[index]){
    			args.index++;
    			return me._getJsonDataChild(item.child, propertyName, args);
    		} else {
//    			break;
    		}
    	}
    	
    	args.index--;
    	
    	return {
    		jsonDatas : jsonDatas,
    		propertyName : propertyName
    	};
    },
    _handlerDataByColumnHeader : function(rowHeader, columnHeader, jsonDatas, dataObj, propertyName){
    	var me = this;
    	for(var i=0, len=columnHeader.length; i<len; i++){
    		var header = columnHeader[i];
    		
    		// init arguments
        	var name = header.name;
        	var type = header.type;
        	var child = header.childHeaders;
        	var hasProperty = false;
        	var jsonData;
        	
        	var propertyValue;
        	if (type === HeaderType.VALUE){
        		propertyValue = dataObj[name];
        	} else {
        		propertyValue = name;
        		propertyName = name;
        	}
        	
        	for(var j=0, jLen=jsonDatas.length; j<jLen; j++){
        		jsonData = jsonDatas[j];
        		if (jsonData.name === propertyValue){
        			hasProperty = true;
        			break;
        		}
        	}
        	
    		if (child && child.length > 0){
            	if (!hasProperty) {
            		jsonData = createDataObj({
            			name : propertyValue,
            			value : propertyValue,
            			isRow : false
            		});
            		jsonDatas.push(jsonData);
            	}
            	
    			me._handlerDataByColumnHeader(rowHeader, header.childHeaders, jsonData.child, dataObj, propertyName);
    		} else {
    			var tempValue = dataObj[propertyName];
    			
    			if (!hasProperty) {
    				jsonData = createDataObj({
            			name : propertyValue,
            			value : tempValue,
            			isRow : false,
            			isValue : true
            		});
            		jsonDatas.push(jsonData);
    			}
    		}
    	}
    },
    _jsonDatasToArray : function(objDatas, preDatas, datas){
    	var me = this;
    	if (!datas){
    		datas = [];
    	}
    	if (!preDatas){
    		preDatas = [];
    	}

    	for(var i=0, len=objDatas.length; i<len; i++){
    		var obj = objDatas[i];
    		var child = obj.child;
    		
    		var tempDatas = [];
        	if (preDatas){
        		tempDatas = preDatas.slice(0);
        	}

    		if (obj.isRow || obj.isValue){
    			tempDatas.push(obj.value);
    		}
    		
    		if (child && child.length > 0){
    			if (obj.isRowEnd){
    				tempDatas = me._applyDatasToArray(child, tempDatas);
    				datas.push(tempDatas);
    			} else {
    				me._jsonDatasToArray(child, tempDatas, datas);
    			}
    		}else{
    			
    		}
    	}
    	return datas;
    },
    _applyDatasToArray : function(jsonDatas, preDatas){
    	var me = this;
    	if (!preDatas){
    		preDatas = [];
    	}
    	for(var i=0, len=jsonDatas.length; i<len; i++){
    		var obj = jsonDatas[i];
    		var child = obj.child;
    		
    		if (child && child.length > 0){
    			me._applyDatasToArray(child, preDatas);
    		} else {
    			preDatas.push(obj.value);
    		}
    	}
    	return preDatas;
    }
	
});
