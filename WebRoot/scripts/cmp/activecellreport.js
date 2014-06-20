(function(){
	Ext.ns("DigiCompass.Web.app");
	
	function ActiveCellReport(){
		
	}
	
	ActiveCellReport.prototype.render = function(){
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
    							me.gridPanel.reload(params);    						
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
    		         		   			    			
    		         		   			    		   me.gridPanel.reload(params);
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
    				}
    			]},{
    				xtype : "container",
    				layout : "hbox",
    				margin : "15 0 0 0",
    				items : [		
    				 Ext.create('DigiCompass.web.UI.ComboBox',{
    					id : "techElId",
    					moduleType : 'TECH_MODULE',								
    					moduleCommand : 'queryAllTechnology',
    					fieldLabel : 'Technology',
    					name : 'technology',
    					parseData : function(message){
    						var data = message['BUSINESS_DATA'];
    						var d = [];
    						for(var i in data){
    							d.push([data[i].ID, data[i].NAME]);
    						}
    						return d;
    					},
    					listeners : {
    						change : function(self, newValue, oldValue, eOpts){
    							var message = {};
    	                        message.MODULE_TYPE = 'TECH_MODULE';
    	                        message.COMMAND = "queryBand";
    	                        message.technologyId = newValue;
								cometdfn.request(message, function(data) {
									var _data = data['BUSINESS_DATA'];
									var arr = new Array();
									for(var i = 0; i < _data.length; i++){
										if(_data[i].checked){
											arr.push({id : _data[i].ID, name : _data[i].NAME});
										}
									}
									self.next().getStore().loadData(arr);
								});
    						}
    					}
    				}),{
    					id : "bandElId",
    					xtype : "combo",
    					name : 'band',
    					labelWidth : 25,
    					valueField : 'id',
    					displayField: 'name',
    					queryMode: 'local',
    					fieldLabel : 'Band',    					
    					store : Ext.create('Ext.data.Store', {
    					    fields: ['id', 'name'],
    					    data : []
    					})
    				}, {
    					margin:'0 0 0 50',
    					xtype : 'button',
    					text : 'Query',
    					handler : function(){
    						var params = form.getForm().getValues();
    						var techStore = Ext.getCmp("techElId").getStore();
    						techStore.each(function(record){
    							if(record.get("id") == params.technology){
    								params.technology = record.get("name");
    								return false;
    							}
    						});
    						var bandStore = Ext.getCmp("bandElId").getStore();
    						bandStore.each(function(record){
    							if(record.get("id") == params.band){
    								params.band = record.get("name");
    								return false;
    							}
    						});
    						me.gridPanel.reload(params);
    					}
    				}, {
    					margin:'0 0 0 50',
    					xtype : "button",
    					text : "Reset",
    					handler : function(){
    						form.getForm().reset();
    					}
    				}]
    			}
    		]
    	});
    
    	this.form = form;
    	
		var gridPanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            //autoLoad : true,
	            pageSize: 100,	            	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'IvReportsActiveCells',
	                modules : {
	                	read : {
	               		 	command : 'grid' 
	               		}
	                },
		            extraParams : null,
		            afterRequest : function(response, result){

	            	}	
	            }
			},
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					this.up("mutigroupgrid").getTarget().features[0].cleanGrouping();
				}
			},{
				xtype : 'button',
				text : 'Export',
				handler : function(){
    				var data = {	    					
	    					MODULE_TYPE : "IvReportsActiveCells",
	    					COMMAND : "grid",
	    					viewType : 'export',
							title : "Active Cells Report"						
		            	};
    				var params = this.up("mutigroupgrid").getStore().getProxy().extraParams;
    				data = Ext.applyIf(data, params);		    	
    				if(data.paramJson instanceof Object){
    					data.paramJson = JSON.stringify(data.paramJson);
    				}
					var url = "download";
					downloadFile(url, data);
				}
			}],					
			title : "Active Cells Info",
			useSearch : false,
			flex : 1
		});	
    	
    	this.gridPanel = gridPanel;
    	
    	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
    		title : 'Cell Report',
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
    	    items: [form, gridPanel]
    	}).show();
    	
    }
	
	ActiveCellReport.prototype.openExistObjectsWindow = function(title,module, param,callback){
		var flexView = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid', {
//	    	features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping')],
//	        selModel : Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'),
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
//		flexView.getTarget().loadStart();
			    
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
	
	DigiCompass.Web.app.ActiveCellReport = ActiveCellReport;
})()