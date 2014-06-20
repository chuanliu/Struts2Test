function WbsReport(){
}

WbsReport.prototype.render = function(){
	var me = this;
	
	var form = Ext.create('Ext.form.Panel', {
		height : 100,
		bodyPadding : 5,
		items : [{
			layout:'hbox',
			xtype  :'container',
			items : [
				{
					xtype: 'datefield',
					emptyText  : 'Please input from date!',
					format : 'Y-m-d',
					fieldLabel : 'From ',
					allowBlank : false,
					name 	   : 'start',
					listeners : {
						select : function(scope, newVal, val){
							
						}
					}
				},{
					xtype: 'datefield',
					labelAlign : 'right',
					emptyText  : 'Please input to date!',
					fieldLabel : 'To',
					labelWidth : 25,
					format : 'Y-m-d',
					allowBlank : false,
					name 	   : 'end',
					listeners : {
						select : function(scope, newVal, val){
							
						}
					}
				},{
					xtype: 'button',
					text : 'Select Sites',						
					margin:'0 0 0 50',
					handler : function(){
						me.openExistObjectsWindow('Existing Sites',{
							moduleType:'MOD_CHANGE_REQUEST',
							command:'COMMAND_SITE_LIST' 
						},{
							treeNode : 'siteNum'
						},function(status){
							var params = {
								paramJson : Ext.apply({type : 'SITES', selection : status})
							};
							Ext.apply(params, me.form.getForm().getValues());
							var p = {treeNode : 'siteNum'};
							Ext.apply(p, params.paramJson);
							                                                        
                            p.MODULE_TYPE = 'MOD_SITE_GROUP';
                            p.COMMAND = 'COMMAND_GET_SITES';
                            cometdfn.request(p, function(data,Conf) {
                            	var datas = JSON.parse(data.BUSINESS_DATA).data;
                            	var objIds = [];
                            	datas.forEach(function(d){
                            		objIds.push(d[0]);
                            	});
                            	
    							me.renderWbs(objIds, params);
                            });
						
						});
					}
				},{

			    	xtype: 'button',
			    	text : 'Import Sites', 			    	
			    	margin:'0 0 0 50',
			    	handler : function(){					
		            	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
		            		layout: 'fit',
	        		        width: 500,
	        		        height: 300,
	        		        modal: true,
	        		        closeAction: 'destroy',
	        		        items: {
	        		        	xtype : 'form',
	        		            frame: true,
	        		            defaults: {
	        		            	anchor: '100%',
	        		                allowBlank: false,
	        		                msgTarget: 'side',
	        		                labelWidth: 50
	        		            },
	        		            items: [{
	        		            	xtype: 'filefield',
	        		                id: 'form-file',
	        		                emptyText: 'Select an file',
	        		                fieldLabel: 'File',
	        		                name: 'file-path',
	        		                buttonText: '',
	        		                buttonConfig: {
	        		                   iconCls: 'upload-icon'
	        		                },
	        		                vtype: 'file'
	        		            }],
	        		            buttons: [{
	        		            	text: 'Upload',
	        		                handler: function(){
	        		                	var form = this.up('form').getForm();
	        		                    if(form.isValid()){
	        		                    	form.submit({
	         		                           url: 'upload',
	         		                           params: {         		                        	   
	         		                        	   MODULE_TYPE : "CR_SELECT_EXIST_SITE"
	         		                           },
	         		                           waitMsg: 'Uploading your file...',
	         		                           success: function(fp, o) {
	         		                        	   console.log(o.result.selections);
		         		   			    			var params = {
		         		   		    					paramJson : Ext.apply({type : 'SITES', 
		         		                        	   		selection :{
			         		         							checkAll : false,
			         		         							selections : Ext.JSON.encode(o.result.selections),
			         		         							groups : Ext.JSON.encode([]),
			         		         							selectGroups : Ext.JSON.encode([[]]),
			         		         							search : null
		         		                        	   		}
		         		         						})
		         		   							};
		         		   			    			
		         									Ext.apply(params, me.form.getForm().getValues());
		         									var p = {treeNode : 'siteNum'};
		         									Ext.apply(p, params.paramJson);
		         									                                                        
		         		                            p.MODULE_TYPE = 'MOD_SITE_GROUP';
		         		                            p.COMMAND = 'COMMAND_GET_SITES';
		         		                            cometdfn.request(p, function(data,Conf) {
		         		                            	var datas = JSON.parse(data.BUSINESS_DATA).data;
		         		                            	var objIds = [];
		         		                            	datas.forEach(function(d){
		         		                            		objIds.push(d[0]);
		         		                            	});
		         		                            	
		         		    							me.renderWbs(objIds, params);
		         		                            });
		         		                           win.close();
	         		                        	   //msg('Success', 'Processed file on the server', false);	            		                        	   	            		                        	   
	         		                           },
	         		                           failure: function(form, action){	         		                        	   
		         		                  	        Ext.Msg.show({
			         		               	            title: "Failure",
			         		               	            msg: "Error processed file on the server",
			         		               	            minWidth: 200,
			         		               	            modal: true,
			         		               	            icon: Ext.Msg.ERROR,
			         		               	            buttons: Ext.Msg.OK
			         		               	        });
	         		                           }
	         		                       });
	        		                    }
	        		                }
	        		            },{
	        		            	text: 'Reset',
	        		                handler: function() {
	        		                	this.up('form').getForm().reset();
	        		                }
	        		            }]
	        		        }
		            	});
		            	win.show();				
					}								
				},{
			    	xtype: 'button',
			    	text : 'Select Financial Catalogues',				    	
			    	margin:'0 0 0 50',
			    	handler : function(){
	    				var panel = Ext.create('Ext.tree.Panel', {
	    					rootVisible : false,
	    					store : Ext.create('Ext.data.TreeStore', {				
		    					root : {}
		    				}),
	    			        listeners : {
	    			        	checkchange : function(node, checked){
	    			        		if(checked){
	    			        			panel.getRootNode().cascadeBy(function(n){
	    			        				if(n.data.checked && n.raw.categoryId != node.raw.categoryId){
//	    			        					n.set('checked',false);
	    			        				}
	    			        			})
	    			        		}
	    			        	}
	    			        }
	    				});
	    				
	    				var win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
	    					title : "Financial Catalogue",
	    					height : 600,
	    					width : 800,
	    					autoScroll : true,
	    					items : [ panel ],
	    				    tbar : [{
	    				    	xtype : 'button',
	    				    	text : 'Finish',
	    				    	iconCls : 'icon-save',
	    				    	handler : function(){
	    				    		var checks = [];
	    			    			var checked = panel.getChecked();
	    			    			for(var i=0; i<checked.length; i++){
	    			    				checks.push(checked[i].raw.categoryId)
	    			    			}
	    			    			var params = {
    			    					paramJson : Ext.apply({type : 'FINANCIALS'}, {selections:checks, checkAll : false, groups:[], selectGroups:[]} ||{})
    								};
	    			    			
	    							var p = {};
	    							Ext.apply(p, params.paramJson);
	    							                                                        
	                                p.MODULE_TYPE = 'MOD_REPORT_CHANGE_REQUEST';
	                                p.COMMAND = 'COMMAND_QUERY_FINS';
	                                cometdfn.request(p, function(data,Conf) {
	                                	var datas = JSON.parse(data.BUSINESS_DATA).data;
	                                	var objIds = [];
	                                	datas.forEach(function(d){
	                                		objIds.push(d[0]);
	                                	});
	                                	
	        							me.renderWbs(objIds, params);
	                                });

	    				    		win.close();
	    				    	}
	    				    }]
	    				});
	    				win.show();
	    				
		    			var message = {
		    					MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
		    					COMMAND : 'COMMAND_QUERY_TREE'};
	    			
		    			cometdfn.request(message, function(data){
		    				var _data = data.BUSINESS_DATA.data;
			    			var datas = Ext.JSON.decode(_data);
			    			panel.setRootNode(datas);
		    			});				    	
			    	}
				}
			]}
			,{
				xtype : "container",
				layout : "hbox",
				margin : "10 0 0 0",
				items : [
					{						
						xtype : "textfield",
						fieldLabel : 'Project Number',
						name : "proj_num"
					},{
						margin : "0 0 0 15",
						xtype : "button",
						text : "Query",
						handler : function(){
							var form = me.form.getForm();
							if (form.isValid()) {
								var message = form.getValues();
								message.MODULE_TYPE = "FcReportsWbs";
								message.COMMAND = "queryCrIds";
								cometdfn.request(message,function(data,Conf) {
		                            var status = data.STATUS;
		                            if (status === "success") {
		                            	var objIds = data.BUSINESS_DATA;
		                            	me.wbsPanel.removeAll();
		                            	me.wbsPanel.add(new DigiCompass.Web.app.planning.WBS({objIds : objIds, name : 'All of CR', type : "sapwbs", paramJson : null}));
		                            } else if (data.customException) {
		                                alertError(data.customException);
		                            }
		                        });
							}
						}
					}]
			}
		]
	});
	
	var wbsPanel = Ext.create('Ext.panel.Panel', {
		flex : 1,
		layout : "fit"
	});
	
	this.form = form;
	this.wbsPanel = wbsPanel;	
	
	Ext.create('DigiCompass.Web.app.AutosizeWindow',{
		title : 'Sap WBS',
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
	    items: [form, wbsPanel]
	}).show();
};
WbsReport.prototype.renderWbs = function(objIds, params){
	var me = this;
	var paramJson = Ext.JSON.encode(params.paramJson);
	me.wbsPanel.removeAll();
	me.wbsPanel.add(new DigiCompass.Web.app.planning.WBS({objIds : objIds, name : 'All of CR', type : "sapwbs", queryCond : params,paramJson : paramJson}));
}
WbsReport.prototype.openExistObjectsWindow = function(title,module, param,callback){
	var flexView = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid', {
//    	features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping')],
//        selModel : Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'),
        useSearch : true,
        store: {
            buffered: true,
            autoLoad : true,
            proxy: {
                type: 'cometd.mutigroup',
                moduleType : module.moduleType,
                modules : {
                	read : {
               		 	command : module.command
               		}
                },
				extraParams: param
            }
        },
        tbar:[{
			xtype : 'button',
			text : 'Clear Grouping',
			handler : function(){
				flexView.getTarget().features[0].cleanGrouping();
			}
		}]
    });
//	flexView.getTarget().loadStart();
		    
	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
		id : "siteSelectWindow",
		title:title,
		width:800,
		height:600,
		modal:true,
		layout:'fit',
		tbar:[{
			xtype : 'button',
			text : 'Finish',
			handler:function(){
				var checkAll = false, selections=[], groups=[], selectGroups=[];
				var status = flexView.getSelectionStatus();
				if(Ext.isFunction(callback)){
					callback(status);
				}
				flexView.remove(true);											
				win.close();
			}	
		}]
	});
	win.add(flexView);
	win.show();
};