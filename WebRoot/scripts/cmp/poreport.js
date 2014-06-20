(function() {
    Ext.ns("DigiCompass.Web.app");

    function PoReport() {
    	
    }
    	
    PoReport.prototype.render = function(){
    	var me = this;
    	var form = Ext.create('Ext.form.Panel', {
    		height : 100,
    		bodyPadding : 5,
    		items : [{
    			xtype : "container",
    			layout : "hbox",
    			items : [{
    				xtype : "textfield",
    				fieldLabel : "Project Number",
    				name : "proj_num"
    			},{
    				margin : "0 0 0 10",
    				xtype : "textfield",
    				fieldLabel : "Fiscal Year",
    				name : "fiscal_year"    				
    			}]
    		},{
    			margin : "10 0 0 0",
    			xtype : "container",
    			layout : "hbox",
    			items : [{
    				xtype : "textfield",
    				fieldLabel : "Fiscal Period",
    				name : "fiscal_period"
    			},{
    				margin : "0 0 0 10",
    				xtype : "textfield",
    				fieldLabel : "Cost Element",
    				name : "cost_ele"    				
    			},{
    				margin : "0 0 0 10",
    				xtype : "button",
    				text : "Query",
    				handler : function(){
    					var formVal = me.form.getForm().getValues();
    					var largeCond = true;
    					for(var name in formVal){
    						var val = formVal[name];
    						if(val.trim() != ""){
    							largeCond = false;
    							break;
    						}
    					}
    					if(largeCond){
    						Ext.MessageBox.confirm('Confirm', 'large processing time required?', function(btn){
    							if(btn === 'yes'){
    		    					me.commitsGrid.reload(formVal);
    		    					me.actualsGrid.reload(formVal);
    							}
    						});
    					} else {    					
	    					me.commitsGrid.reload(formVal);
	    					me.actualsGrid.reload(formVal);
    					}
    				}
    			}]
    		},{
    			margin : "10 0 0 0",
    			xtype : "container",
    			layout : "hbox",
    			items : [{
    				xtype : "textfield",
    				fieldLabel : "Vendor Number",
    				name : "vend_num"
    			},{
    				margin : "0 0 0 10",
    				xtype : "textfield",
    				fieldLabel : "Vendor Name",
    				name : "vend_name"    				
    			}]
    		}]
    	});
    	
		var actualsGrid = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            pageSize: 100,	            	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'FcReportsPo',
	                modules : {
	                	read : {
	               		 	command : 'grid' 
	               		}
	                },
		            extraParams : {
		            	type : '1'
		            },
		            afterRequest : function(response, result){

	            	}	
	            }
			},		
			tbar : [{
				xtype : "button",
				text : "Export",
				handler : function(){
					var formVal = me.form.getForm().getValues();
    				var data = {	    					
	    					MODULE_TYPE : "FcReportsPo",
	    					COMMAND : "export",
							title : "Actuals",
							type : "1"
		            	};
    				data = Ext.applyIf(data, formVal);
					var url = "download";
					downloadFile(url, data);
				}
			}],
			title:'PO Actuals Info',
			useSearch : false,
			flex : 1
		});
		
		var commitsGrid = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            pageSize: 100,	            	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'FcReportsPo',
	                modules : {
	                	read : {
	               		 	command : 'grid' 
	               		}
	                },
		            extraParams : {
		            	type : '2'
		            },
		            afterRequest : function(response, result){

	            	}	
	            }
			},						
			tbar : [{
				xtype : "button",
				text : "Export",
				handler : function(){
					var formVal = me.form.getForm().getValues();
    				var data = {	    					
	    					MODULE_TYPE : "FcReportsPo",
	    					COMMAND : "export",
							title : "Actuals",
							type : "2"
		            	};
    				data = Ext.applyIf(data, formVal);
					var url = "download";
					downloadFile(url, data);
				}
			}],
			title:'PO Commits Info',
			useSearch : false,
			flex : 1
		});
        
    	
    	this.form = form;
    	this.actualsGrid = actualsGrid;
    	this.commitsGrid = commitsGrid;
    	
    	Ext.create('DigiCompass.Web.app.AutosizeWindow',{
    		title : 'Po Report',
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
    	    items: [form, actualsGrid, commitsGrid]
    	}).show();
    }

    DigiCompass.Web.app.PoReport = PoReport;
})();
