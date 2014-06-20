Ext.define('DigiCompass.Web.app.data.proxy.FlexViewCometdProxy', {
    extend: 'DigiCompass.Web.app.data.proxy.CometdProxy',
    alias : 'proxy.cometd.flexview',
    alternateClassName: 'DigiCompass.Web.app.data.FlexViewCometdProxy',
    flexView : null,
    metaParamKey : 'meta',
    reader: {
    	type: 'arrayflexview',
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
        	params = {},
        	metaData = {},
        	params = me.callParent([operation]),
        	extGroups = Ext.JSON.decode(params.group),
        	groups = [],
        	unfolded,selected;
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
    	return Ext.decode(response.BUSINESS_DATA);
    }
});