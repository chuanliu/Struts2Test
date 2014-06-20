(function(){
	Ext.ns("DigiCompass.Web.app");
	
	function CellReport(){
		
	}
	
	CellReport.prototype.render = function(){
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
    							me.getGrid(params);    						
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
    		         		   			    			
    		         		   			    		   me.getGrid(params);
    		         		                           win.close();       		                        	   	            		                        	   
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
//    	    			        					n.set('checked',false);
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
    	    			    			
    	    			    			me.getGrid(params);

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
    			]},{
    				xtype : "container",
    				layout : "hbox",
    				margin : "15 0 0 0",
    				items : [		
    				 Ext.create('DigiCompass.web.UI.ComboBox',{    					
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
											arr.push([_data[i].NAME,_data[i].NAME]);
										}
									}
									self.next().getStore().loadData(arr);
								});
    						}
    					}
    				}),{
    					xtype : "combo",
    					name : 'band',
    					labelWidth : 25,
    					fieldLabel : 'Band',
    					store : []
    				},{
    					xtype: 'button',
    					text : 'Select Service Catalogue',						
    					margin:'0 0 0 50',
    					handler : function(){
    						var panel = Ext.create('Ext.tree.Panel', {    					        			       
    					        width: 260,
    					        region : 'north',
    					        height : 300,
    					        autoScroll  : true,
    					        rootVisible: false,
    					        store: Ext.create('Ext.data.TreeStore', {
    						    	fields: [ 'name','description'],
    						        root: { },
    						        folderSort: true
    						    }),
    					        columns: [{
    					            xtype: 'treecolumn', //this is so we know which column will show the tree
    					            text: 'Name',
    					            flex: 3,
    					            sortable: false,
    					            dataIndex: 'name'
    					        },{
    					            text: 'Description',
    					            flex: 2,
    					            sortable: false,
    					            dataIndex: 'description'
    					        }]
    					    });
    						
    						cometdfn.request({MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
    							COMMAND : 'serviceTemplateTree'}, function(message){
    								var _data = Ext.JSON.decode(message.BUSINESS_DATA.list);    								
    								var treeData = DigiCompass.Web.app.wftemp.getWorkflowTempTree(_data);
    								panel.getRootNode().removeAll();
    								if(treeData.length > 0){
    									panel.getRootNode().appendChild(treeData);
    								}
    							});    						
    						
    	    				var win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
    	    					title : 'Service Catalogues', 
    	    					height : 600,
    	    					width : 800,
    	    					autoScroll : true,
    	    					layout : 'fit',
    	    					items : [ panel ],
    	    				    tbar : [{
    	    				    	xtype : 'button',
    	    				    	text : 'Finish',
    	    				    	iconCls : 'icon-save',
    	    				    	handler : function(){
    	    				    		var checks = [];
    	    			    			var checked = panel.getChecked();
    	    			    			for(var i=0; i<checked.length; i++){
    	    			    				checks.push(checked[i].raw.id)
    	    			    			}
    	    			    			var params = {
        			    					paramJson : Ext.apply({type : 'SCS'}, {selections : checks})
        								};
    	    			    			
    	    			    			me.getGrid(params);

    	    				    		win.close();
    	    				    	}
    	    				    }]
    	    				});
    	    				win.show();
    					}
    				}, {
    					margin:'0 0 0 50',
    					xtype : 'button',
    					text : 'Query',
    					handler : function(){
    						me.getGrid();
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
    	
    	var gridPanel = Ext.create("Ext.panel.Panel", {    		
            layout: {
                type:'vbox',                
                align:'stretch'
            },
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
    	    	
    	this.getGrid();
    }
	
	CellReport.prototype.getGrid = function(obj){
		var me = this;
		var formVal = this.form.getForm().getValues();
		var params = {
				MODULE_TYPE:'IvReportsPlannedCells',
				COMMAND:'getHierarchys'
			};
		Ext.apply(params, formVal);
		if(obj){
			Ext.apply(params, obj);
		}
		cometdfn.request(params, function(msg){
			me.hierarchys = msg.BUSINESS_DATA;
			me.createGrid(obj);
		});
	}
	
	CellReport.prototype.createGrid = function(obj){
		var me = this;
		if(Ext.isArray(me.hierarchys)){
			me.gridPanel.removeAll();
			for(var i=0; i<me.hierarchys.length; i++){
				var h = me.hierarchys[i];
				var title = h.financialHierarchyName + ' , '+ h.serviceCatalogueHierarchyName;
				var params = {
					type : "1"
				};
				var formVal = me.form.getForm().getValues();
				Ext.apply(params, me.hierarchys[i]);
				Ext.apply(params, formVal);
				if(obj){
					Ext.apply(params, obj);
				}
				var grid = new DigiCompass.Web.app.grid.MutiGroupGrid({
					store:{
			            buffered: true,
			            autoLoad : true,
			            pageSize: 100,	            	            
			            proxy: {
			                type: 'cometd.mutigroup',
			                moduleType : 'IvReportsPlannedCells',
			                modules : {
			                	read : {
			               		 	command : 'grid' 
			               		}
			                },
				            extraParams : params,
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
			    					MODULE_TYPE : "IvReportsPlannedCells",
			    					COMMAND : "grid",
			    					viewType : 'export',
									title : "Cell Report"						
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
					listeners : {
						cellclick : function(grid, cellElement, columnNum, record,
							rowElement, rowNum, e) {
							var header = grid.getHeaderCt().getHeaderAtIndex(columnNum);
				    		if(record.get('groupindex')){
						        return;
						    }
			    			var sowStuffPath = 'changes.serviceOperation.sowStuff';
							var dataIndex = header.dataIndex;
							if(dataIndex === sowStuffPath+".name"){
								var readOnly = true;
								var requipmentType = record.get(sowStuffPath+".type"),
									sowId = record.get(sowStuffPath+".id");
								cometdfn.request({
									MODULE_TYPE:'MOD_CHANGEREQUEST_WBS',
									COMMAND:'GET_CR_REQUIPMENT',
									crId : record.get('id'),
									sowId : sowId,
									status : null
								}, function(message){
									if(!ServerMessageProcess(message)){
										return;
									}
									DigiCompass.Web.app.changeRequest.getSowRequirementWindow(Ext.JSON.decode(message.BUSINESS_DATA), function(reqs, window){
									}, requipmentType, true).show();
								});
							}else if(dataIndex === 'changes.serviceOperation.approveComment' || dataIndex === 'changes.serviceOperation.releaseComment'){
								promptTextAreaDialog('Comment', record.get(dataIndex), function(comment){
					    		}, true, null, false);
							}
						}
					},
					title : title,
					useSearch : false,
					flex : 1
				});				
				me.gridPanel.add(grid)
			}
		}
	}
	
	CellReport.prototype.openExistObjectsWindow = function(title,module, param,callback){
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
	
	DigiCompass.Web.app.CellReport = CellReport;
	
	function ExcludedCellReport(){
		
	}
	
	ExcludedCellReport.prototype.render = function(){
    	var me = this;    	
        	
		var gridPanel = new DigiCompass.Web.app.grid.MutiGroupGrid({
			store:{
	            buffered: true,
	            autoLoad : true,
	            pageSize: 100,	            	            
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'IvReportsExcludedCells',
	                modules : {
	                	read : {
	               		 	command : 'grid' 
	               		}
	                },		            
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
	    					MODULE_TYPE : "IvReportsExcludedCells",
	    					COMMAND : "grid",
	    					retType : 'excel',
							title : "Excluded Cells Report"						
		            	};	    				
					var url = "download";
					downloadFile(url, data);
				}
			}],					
			title : "Excluded Cells Info",
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
    	    items: [gridPanel]
    	}).show();
    	
    }
	
	DigiCompass.Web.app.ExcludedCellReport = ExcludedCellReport;
})()