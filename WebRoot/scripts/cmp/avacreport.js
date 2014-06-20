(function() {
    Ext.ns("DigiCompass.Web.app");

    function AvacReport() {
    	
    }
    	
    AvacReport.prototype.render = function(){
    	var me = this;    	
    	
		var grid = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered : true,
	            autoLoad : true,
	            pageSize: 100,	            	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'FcReportsAvac',
	                modules : {
	                	read : {
	               		 	command : 'grid' 
	               		}
	                },
		            afterRequest : function(response, result){

	            	}	
	            }
			},/*		
			tbar : [{
				xtype : "button",
				text : "Export",
				handler : function(){
					
				}
			}],*/
			title:'Avac Info',
			useSearch : false,
			flex : 1
		});
    	
    	Ext.create('DigiCompass.Web.app.AutosizeWindow',{
    		title : 'Avac Report',
    	    width : 1000,
    		height : 800,
    		modal:true,
    	    maximizable : true,
            layout: {
                type:'vbox',
                padding:'5',
                align:'stretch'
            },
    	    closeAction: 'destroy',
    	    items: [grid]
    	}).show();
    }

    DigiCompass.Web.app.AvacReport = AvacReport;
})();
