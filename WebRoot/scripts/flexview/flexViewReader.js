Ext.define('DigiCompass.Web.app.data.FlexViewResultSet', {
	extend: 'Ext.data.ResultSet',
	flexView : null,
	summarys : null
});

Ext.define('DigiCompass.Web.app.data.reader.json.FlexViewReader', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.jsonflexview',
    requires: ['DigiCompass.Web.app.data.FlexViewObject',
               'DigiCompass.Web.app.data.FlexViewResultSet'],
	flexView : null,
	summarys : null,
	totalProperty: 'meta.paging.rows',
    readRecords: function(data) {
    	var me = this,
			flexView,
	    	summarys=[],
	    	recordCount,
	    	records,
	    	success,
	    	message;
    	
    	if (me.lastFieldGeneration !== me.model.prototype.fields.generation) {
            me.buildExtractors(true);
        }
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
        if (me.readRecordsOnFailure || success) {
            if(me.flexViewProperty){
				flexView = new DigiCompass.Web.app.data.FlexViewObject(me.getFlexView(data));
            }else{
            	flexView = new DigiCompass.Web.app.data.FlexViewObject(data);
            }
            root = flexView.records;
            if(!flexView.isSameDataModel(me.model.getFields())){
				me.setModel(Ext.define('Ext.data.Store.ImplicitModel-' + (Ext.id()), {
					extend: 'Ext.data.Model',
			        fields: flexView.dataFields
			    }), true);
//            	me.model.setFields(flexView.dataFields);
			}
	        if(me.summarysProperty){
				summarys = me.getSummarys(data);
			}
            if (root) {
                total = root.length;
            }
            if (me.totalProperty) {
                value = parseInt(me.getTotal(data), 10);
                if (!isNaN(value)) {
                    total = value;
                }
            }
        }
        if (me.totalProperty) {
            value = parseInt(me.getTotal(data), 10);
            if (!isNaN(value)) {
                total = value;
            }
        }
        if (root) {
             records = me.extractData(root);
             recordCount = records.length;
        }
        return new DigiCompass.Web.app.data.FlexViewResultSet({
            total  : total,
            count  : recordCount,
            records: records,
            success: success,
            message: message,
            flexView: flexView
        });
    },
	buildExtractors: function(force) {
	    var me = this;
	    me.callParent(arguments);
	    
	    if (me.flexViewProperty) {
	    	me.getFlexView = me.createAccessor(me.flexViewProperty);
	    }
	    if (me.summarysProperty) {
	    	me.getSummarys = me.createAccessor( me.summarysProperty);
	    }
	}
});
Ext.define('DigiCompass.Web.app.data.reader.array.FlexViewReader', {
    extend: 'DigiCompass.Web.app.data.reader.json.FlexViewReader',
    alias : 'reader.arrayflexview',
    createFieldAccessExpression: function(field, fieldVarName, dataName) {
            // In the absence of a mapping property, use the original ordinal position
            // at which the Model inserted the field into its collection.
        var index  = (field.mapping == null) ? field.originalIndex : field.mapping,
            result;

        if (typeof index === 'function') {
            result = fieldVarName + '.mapping(' + dataName + ', this)';
        } else {
            if (isNaN(index)) {
                index = '"' + index + '"';
            }
            result = dataName + "[" + index + "]";
        }
        return result;
    }
});