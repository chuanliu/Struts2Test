Ext.define('DigiCompass.Web.app.data.proxy.MutiGroupProxy', {
    extend: 'DigiCompass.Web.app.data.proxy.CometdProxy',
    alias : 'proxy.cometd.mutigroup',
    alternateClassName: 'DigiCompass.Web.app.data.MutiGroupProxy',
    flexView : null,
    metaParamKey : 'meta',
    
    
    
    reader: {
    	type: 'mutigroup',
        totalProperty: 'meta.paging.rows'
    },
    
    onSuccessful : function(result, operation){
    	var me = this;
    	if(result.flexView){
	    	me.flexView = result.flexView;
	    	
	    	// debug
	    	console.log('result:',result.flexView.meta.paging.page ,result);
    	}
    },
    getParams: function(operation) {
        var me = this, 
        	metaData = {},
        	params = me.callParent([operation]);
        
        console.log('----------------->>>>>>> ',operation);
        metaData.paging = {
    		page : params.page,
    		count : params.limit
        }
        Ext.apply(metaData, operation.meta || {});
    	
        delete params.total;
        delete params.page;
        delete params.start;
        delete params.limit;
        delete params.group;
        
        params[me.metaParamKey] = Ext.JSON.encode(metaData);               
        return params;
    },
    extractResponseData: function(response){
    	var me = this;
    	var rs = Ext.decode(response.BUSINESS_DATA);
    	
    	return rs;
    }
});