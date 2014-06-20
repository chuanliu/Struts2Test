Ext.define('DigiCompass.Web.app.grid.column.Percent', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.percentcolumn'],
    requires: ['Ext.util.Format'],
    alternateClassName: 'DigiCompass.Web.app.grid.PercentColumn',

    //<locale>
    /**
     * @cfg {String} format
     * A formatting string as used by {@link Ext.util.Format#number} to format a numeric value for this Column.
     */
    format : '00.00',
    //</locale>

    /**
     * @cfg renderer
     * @hide
     */
    /**
     * @cfg scope
     * @hide
     */

    defaultRenderer: function(value, style, record){
    	if(record.get('groupindex')){
	        return '';
	    }
        return (Ext.util.Format.number(value, this.format) || 0)+"%";
    }
});
Ext.define('DigiCompass.Web.app.grid.column.PercentNotChange', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.percentcolumnnotchange'],
    requires: ['Ext.util.Format'],
    alternateClassName: 'DigiCompass.Web.app.grid.PercentColumnNotChange',
    format : '00.00',
    defaultRenderer: function(value, style, record){
    	if(record.get('groupindex')){
	        return '';
	    }
        return (Ext.util.Format.number(value * 100, this.format) || 0)+"%";
    }
});
Ext.define('DigiCompass.Web.app.grid.column.Integer', {
    extend: 'Ext.grid.column.Number',
    alias: ['widget.integercolumn'],
    requires: ['Ext.util.Format'],
    alternateClassName: 'DigiCompass.Web.app.grid.IntegerColumn',
    format : '0,0',
});
Ext.define('DigiCompass.Web.app.grid.column.Boolean', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.booleancolumn'],
    requires: ['Ext.util.Format'],
    alternateClassName: 'DigiCompass.Web.app.grid.BooleanColumn',

    //<locale>
    /**
     * @cfg {String} format
     * A formatting string as used by {@link Ext.util.Format#number} to format a numeric value for this Column.
     */
    //</locale>

    /**
     * @cfg renderer
     * @hide
     */
    /**
     * @cfg scope
     * @hide
     */

    defaultRenderer: function(value){
    	if(value==='N/A'){
    		return value;
    	}
        if(value === false){
        	return 'NO';
        }else if(value===true){
        	return 'Yes';
        }else if(Ext.isString(value)){
        	if(value.toUpperCase()==='TRUE'){
        		return 'Yes';
        	}else if(value.toUpperCase()==='FALSE'){
        		return 'No';
        	}
        }
    	return 'N/A';
    }
});
Ext.override(Ext.grid.column.Date, { 
	format : 'Y-m-d',
	defaultRenderer: function(value){
		if(!value || value==='N/A'){
			return 'N/A';
		}	
        return Ext.util.Format.date(value, this.format);
	}
});