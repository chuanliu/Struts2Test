
//fix grid menu blackground bug
Ext.menu.Separator.prototype.text = '';
 Ext.override(Ext.menu.Menu, {
	  onBoxReady: function() {
	        var me = this;

	        me.callParent(arguments);
	        if (me.showSeparator) {
	        	me.iconSepEl.setHTML('');
        }
    },
});
 
//layout resize
Ext.layout.container.Border.prototype.split = true;


//time formate
Ext.define('Ext.grid.column.DateTime', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.datetimecolumn'],
    requires: ['Ext.Date'],
    alternateClassName: 'Ext.grid.DateTimeColumn',

    initComponent: function(){
        if (!this.format) {
            this.format = Ext.Date.defaultFormat;
        }
        this.callParent(arguments);
    },
    
    defaultRenderer: function(value){
        //return Ext.util.Format.date(value, this.format);
    	if(value){
    		return new Date(value).toLocaleString();
    	}else
    		return 'N/A';
    }
});

Ext.define('Ext.grid.column.Time', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.timecolumn'],
    requires: ['Ext.Date'],
    alternateClassName: 'Ext.grid.TimeColumn',

    initComponent: function(){
        if (!this.format) {
            this.format = Ext.Date.defaultFormat;
        }
        this.callParent(arguments);
    },
    
    defaultRenderer: function(value){
        //return Ext.util.Format.date(value, this.format);
    	if(value){
    		return new Date(value).toLocaleTimeString();
    	}else
    		return 'N/A';
    }
});

Ext.override(Ext.grid.column.Date, { 
	defaultRenderer: function(value){
		if(value){
    		return new Date(value).toLocaleDateString();
    	}else
    		return 'N/A';
	}
});

Ext.override(Ext.ux.CheckColumn, { 
	processEvent: function(type, view, cell, recordIndex, cellIndex, e, record, row) {
        var me = this,
            key = type === 'keydown' && e.getKey(),
            mousedown = type == 'mousedown';

        if (!me.disabled && (mousedown || (key == e.ENTER || key == e.SPACE))) {
            var dataIndex = me.dataIndex,
                checked = !record.get(dataIndex);

            // Allow apps to hook beforecheckchange
            if (me.fireEvent('beforecheckchange', me, recordIndex, checked) !== false) {
                record.set(dataIndex, checked);
                me.fireEvent('checkchange', me, recordIndex, checked);

                // Mousedown on the now nonexistent cell causes the view to blur, so stop it continuing.
                if (mousedown &&  e.button==1) {
                    e.stopEvent();
                }

                // Selection will not proceed after this because of the DOM update caused by the record modification
                // Invoke the SelectionModel unless configured not to do so
                if (!me.stopSelection) {
                    view.selModel.selectByPosition({
                        row: recordIndex,
                        column: cellIndex
                    });
                }

                // Prevent the view from propagating the event to the selection model - we have done that job.
                return false;
            } else {
                // Prevent the view from propagating the event to the selection model if configured to do so.
                return !me.stopSelection;
            }
        } else {
            return me.callParent(arguments);
        }
    }
});