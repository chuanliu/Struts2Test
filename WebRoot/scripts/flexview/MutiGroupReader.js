//Ext.define('DigiCompass.Web.app.data.FlexViewResultSet', {
//	extend: 'Ext.data.ResultSet',
//	flexView : null,
//	summarys : null
//});

Ext.define('DigiCompass.Web.app.data.reader.json.MutiGroupReader', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.mutigroup',
    requires: [],


    getTotal:function(data){
    	return data.meta.paging.rows;
    },
    
    extractData : function(root) {
        var me = this,
            records = [],
            Model   = me.model,
            data = root.data,
            unfoldedMap = {},
            unfolded = root.meta.unfolded,
            properties = root.properties,
            pks = root.primary,
            propertiesCount=0,
            convertedValues, node, record, i,j,k,
            nodeobj={},
            summaryProperties = root.meta.view.summaryProperties,
            summaryMap={},
            gnode;
        
       //if(me.meta.dataType = 1)me.meta = root.meta;
            
        for (i = 0; i < summaryProperties.length; i++) {
        	for(var p in properties){
            	if(p == summaryProperties[i].name){
            		summaryMap[p] = i;
            	}
            }
        }

        //unfoldedMap
        for(k = 0; k< unfolded.length;k++){
        	unfoldedMap[unfolded[k]] = true;
		}
        
        //propertiesCount
        for(var p in properties){
        	propertiesCount++;
        	
        	
        }
           
        for (i = 0; i < data.length; i++) {
            node = data[i];
            
            
            
            
            nodeobj={};
            
            if(!Array.isArray(node[0]))
        	{
            	var lastArr ;
                if(Ext.isArray(node[node.length - 1]))lastArr = node.pop();
            	nodeobj['recordid'] = [];
        		
        		for(j = 0; j < propertiesCount; j++){
        			for(var pki=0;pki<pks.length; pki++){
            			if(me.fields[j] == pks[pki]){
            				nodeobj['recordid'].push(node[j]);
            				break;
            			}
            		}
        			
        			nodeobj[me.fields[j]] = node[j]; 
        		}
        		
        		nodeobj['recordid'] = nodeobj['recordid'].join(',');
        		
        		if(lastArr) 
        			nodeobj['belongtogroup'] = lastArr.join(',');
        		else
        			nodeobj['belongtogroup'] = '';
        		
        		record = Ext.create(Model,nodeobj);
        	}else{
        		gnode = node[1];
        		node = node[0];
        		for(j = 0; j < propertiesCount; j++){
        			var sIndex = summaryMap[me.fields[j]];

        			if(sIndex != undefined){
        				nodeobj[me.fields[j]] = gnode[sIndex];
        			}else{
        				//nodeobj[me.fields[j]] = gnode[gnode.length - 1];
        			}
        		}
        		
        		Ext.Array.each(node,function(d){
        			if(nodeobj['groupuid']==undefined) 
        				nodeobj['groupuid'] =''
        			else
        				nodeobj['groupuid'] = nodeobj['groupuid']+',';
        			
        			nodeobj['groupuid'] = nodeobj['groupuid']+ d;
        		});
 
        		nodeobj['groupindex'] = me.proxy.store.mutiGroupParams.groupers[node.length-1];
        		nodeobj['groupexpand'] = unfoldedMap[nodeobj['groupuid']]==true?true:false;
        		
        		if(!nodeobj['groupexpand']){
        			Ext.Array.each(unfolded,function(d){
            			var id =','+nodeobj['groupuid']+',',
            				ufd = ','+d.join(',')+',';
            			if(ufd.indexOf(id)>=0){
            				nodeobj['groupexpand'] = true;
            				return false;
            			} 
            		});
        		}
        		
        		
        		
        		nodeobj['belongtogroup'] = node.length<=1?'':node.slice(0,node.length-1).join(',');
        		nodeobj[nodeobj['groupindex']] = node[node.length-1];
        		nodeobj['groupvalue'] = node[node.length-1];
        		nodeobj['groupcount'] = gnode[gnode.length - 1];
        		
        		//nodeobj[nodeobj['groupindex']] = nodeobj['groupvalue'] + ' (' + gnode[gnode.length - 1] + ')';
        		record = Ext.create(Model,nodeobj);
        	}

            record.phantom = false;

            
           // me.convertRecordData(convertedValues, nodeobj, record);

            records.push(record);
            
//            if (me.implicitIncludes) {
//                me.readAssociated(record, nodeobj);
//            }
           
        }

        
        me.proxy.store.fireEvent('dataload',root);
        return records;
    },

    
    setNewModel:function(data){
    	var me = this,
    		properties = data.properties,
    		displayColumns = [],
    		pks = data.primary,
    		fields = [],
    		flexViewObj = new DigiCompass.Web.app.data.FlexViewObject(data),
    		i;
    	
    	if(me.hasNewModel==undefined){
    		
    		displayColumns = flexViewObj.extColumns;
  
    		for(var property in properties)
			{
    			fields.push(property);
//    			if(!Ext.Array.contains(pks,property)){
//    				displayColumns.push({text:properties[property],dataIndex:property,sortable:false});
//				}
			}
    		
    		fields.push('recordid');
    		fields.push('groupuid');
    		fields.push('groupindex');
    		fields.push('groupexpand');
    		fields.push('belongtogroup');
    		fields.push('groupvalue');
    		fields.push('groupcount');
    		
    		
    		
    		me.setModel(Ext.define('Ext.data.Store.ImplicitModel-' + (Ext.id()), {
				extend: 'Ext.data.Model',
		        fields: fields
		    }), true);
    		
    		
    		
    		me.hasNewModel= true;
    		me.fields = fields;
    		
    		
    		//save me.metaView
    		
    		me.proxy.store.metaView = data.meta.view;
    		
    		me.proxy.store.mutiGroupParams.groupers=[];
    		for(i=0;i<data.meta.view.groupByProperties.length; i++){
    			me.proxy.store.mutiGroupParams.groupers.push(data.meta.view.groupByProperties[i].name);
    		}
    		
    		me.proxy.store.mutiGroupParams.expands=[];
    		for(i=0;i<data.meta.unfolded.length; i++){
    			me.proxy.store.mutiGroupParams.expands.push(data.meta.unfolded[i].join(','));
    		}
    		
    		
    		me.onFristRead(displayColumns,pks);
    	}
    	
    },
    
    //for event
    onFristRead:function(properties,pks){
    	
    },

    readRecords: function(data) {
    	var me = this,
        success,
        recordCount,
        records,
        root,
        total,
        value,
        message;
    
	    /*
	     * We check here whether fields collection has changed since the last read.
	     * This works around an issue when a Model is used for both a Tree and another
	     * source, because the tree decorates the model with extra fields and it causes
	     * issues because the readers aren't notified.
	     */
	    if (me.lastFieldGeneration !== me.model.prototype.fields.generation) {
	        me.buildExtractors(true);
	    }
	    
	    /**
	     * @property {Object} rawData
	     * The raw data object that was last passed to {@link #readRecords}. Stored for further processing if needed.
	     */
	    me.rawData = data;
	
	    data = me.getData(data);
	    
	    success = true;
	    recordCount = 0;
	    records = [];
	        
	    if (me.successProperty) {
	        value = me.getSuccess(data);
	        if (value === false || value === 'false') {
	            success = false;
	        }
	    }
	    
	    if (me.messageProperty) {
	        message = me.getMessage(data);
	    }
	
	    
	    // Only try and extract other data if call was successful
	    if (me.readRecordsOnFailure || success) {
	        // If we pass an array as the data, we dont use getRoot on the data.
	        // Instead the root equals to the data.
	        
	        total = me.getTotal(data);
	        me.setNewModel(data);
	        records = me.extractData(data);
	        recordCount = records.length;
	    }
	
	    return new Ext.data.ResultSet({
	        total  : total || recordCount,
	        count  : recordCount,
	        records: records,
	        success: success,
	        message: message
	    });
    }
});
//Ext.define('DigiCompass.Web.app.data.reader.array.FlexViewReader', {
//    extend: 'DigiCompass.Web.app.data.reader.json.FlexViewReader',
//    alias : 'reader.arrayflexview',
//    createFieldAccessExpression: function(field, fieldVarName, dataName) {
//            // In the absence of a mapping property, use the original ordinal position
//            // at which the Model inserted the field into its collection.
//        var index  = (field.mapping == null) ? field.originalIndex : field.mapping,
//            result;
//
//        if (typeof index === 'function') {
//            result = fieldVarName + '.mapping(' + dataName + ', this)';
//        } else {
//            if (isNaN(index)) {
//                index = '"' + index + '"';
//            }
//            result = dataName + "[" + index + "]";
//        }
//        return result;
//    }
//});