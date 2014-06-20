Ext.define('DigiCompass.Web.app.planning.grid.ChangeRequestReport', {
	objectExplorer : null,
	statics :{
		buildSiteReport : function(){
			return new DigiCompass.Web.app.planning.grid.ChangeRequestReport({
				getTitle : function(record){
					return 'Site Details Report'+(record ? ' ('+record.get('name')+')' : '');
				},
				explorerModuleCfg : {
					moduleType : 'MOD_REPORT_CHANGE_REQUEST',
					command : 'COMMAND_QUERY_LIST',
					delCommand : 'COMMAND_DEL'
				},detailModuleCfg:{
					moduleType : 'MOD_REPORT_CHANGE_REQUEST',
					command : 'COMMAND_QUERY_INFO',
					saveCommand : 'COMMAND_SAVE_REPORT'
				}
			});
		}
	},
	objectDetail : null,
	config : {
		title : null,
		getTitle : null,
		/**
		 * explorerModuleCfg:
		 * 		moduleType	require
		 * 		command		require
		 * 		param 		option
		 */
		explorerModuleCfg : null,
		/**
		 * explorerModuleCfg:
		 * 		moduleType	require
		 * 		command		require
		 * 		param 		option
		 * 		getParam()	option
		 */
		detailModuleCfg : null
	},
	constructor : function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		if(!Ext.isFunction(this.getTitle)){
			this.getTitle = function(){
				return this.title;
			}
		}
		this.init();
		this.showObjectExplorer();
	},
	/**
	 * 	initialize object explorer
	 */
	init : function(){
		var me = this;
		me.objectExplorer = Ext.create('DigiCompass.Web.app.grid.ObjectExplorer',{
			 store: {
	            buffered: true,
	            autoLoad:true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : me.explorerModuleCfg.moduleType,
	                modules : {
	                	read : {
	               		 	command : me.explorerModuleCfg.command
	               		}
	                },
					extraParams: me.explorerModuleCfg.param || {}
	            }
	        },
	        listeners : {
	        	itemclick : function(grid , record , item , index,event,eOpts){
	        		if(record.get('groupindex')){
	    		        return;
	    		    }
//	        		console.log(grid.getSelectionModel().isCheckbox(event.target));
//	        		if(!grid.getSelectionModel().isCheckbox(event.target) && event.target.type !== 'button'){
	        			me.showDetail(record);
//	        		}
	        	}
	        }
		});
		var tbar = [{
			xtype : 'button',
			text : 'New',
			iconCls : 'icon-add',
			handler : function() {
				me.showDetail();
			}
		}];
		if(me.explorerModuleCfg.delCommand){
			tbar.push({
				xtype : 'button',
				text : 'Delete',
				iconCls : 'icon-delete',
				handler : function() {
					var selM = me.objectExplorer.target.getSelectionModel();
					var records = selM.getSelection();
					var ids = [];
					for(var i=0;i<records.length; i++){
						ids.push(selM.getPkString(records[i]));
					}
					cometdfn.request({
						MODULE_TYPE:me.explorerModuleCfg.moduleType,
						COMMAND:me.explorerModuleCfg.delCommand,
						ids : ids
					}, function(){
						Notification.showNotification('Save Success!');
						me.objectExplorer.reload();
						Ext.getCmp('obj-details').removeAll();
					});
				}
			});
		}
		me.objectExplorer.target.addDocked(new Ext.toolbar.Toolbar({
			layout:'hbox',
			items:tbar
		}));
	},
	/**
	 * add and show object explorer
	 */
	showObjectExplorer : function(){
		var me = this;
		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			objExpPanel.removeAll();
			objExpPanel.add(me.objectExplorer);
		}
	},
	/**
	 * initialize selection panel
	 * 	param:
	 * 		id			-- if id existing, load from report, else load by param[paramJson] 
	 * 		paramJson:
	 * 			type	--panel type:SITES/CRS/FINANCIALS
	 * 			{selection param}
	 */
	fillSelectionPanel : function(parent, param){
		var me = this;
		//TODO load data from report by type(site/cr/financial)
		var title, moduleType, command, p, type=param.paramJson.type;
		switch(type){
			case 'SITES':
				title = 'Sites';
				if(!param.id){
					moduleType = 'MOD_SITE_GROUP';
					command = 'COMMAND_GET_SITES';
					p = {treeNode : 'siteNum'};
					Ext.apply(p, param.paramJson);
					
				}
			break;
			case 'CRS':
				title = 'Change Request';
				moduleType = 'MOD_REPORT_CHANGE_REQUEST';
				command = 'COMMAND_QUERY_CRS';
				p = Ext.apply({}, param.paramJson);
			break;
			case 'FINANCIALS':
				title = 'Financial Catalogue';
				moduleType = 'MOD_REPORT_CHANGE_REQUEST';
				command = 'COMMAND_QUERY_FINS';
				p = Ext.apply({}, param.paramJson);
			break;
		}
		if(p)
			delete p.type;
		if(param.id){
			moduleType = 'MOD_REPORT_CHANGE_REQUEST';
			command = 'COMMAND_QUERY_SELECTIONS';
			p = {
					id : param.id
			}
		}
		var selection = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid', {
			anchor : '0 40%',
//			margin : '10 0',
			useSearch:false,
			border : false,
			frame : false,
			autoCheckBox : false,
			collapsible : false,
//	    	features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping')],
//	        selModel : Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'),
	        store: {
	            buffered: true,
	            autoLoad:true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : moduleType,
	                modules : {
	                	read : {
	               		 	command : command
	               		}
	                },
					extraParams: p || {}
	            }
	        },
	        listeners : {
	        	cellclick : function(grid, cellElement, columnNum, record,
						rowElement, rowNum, e) {
	        		if(record.get('groupindex')){
	    		        return;
	    		    }
	        		var id = record.get('id');
	        		Ext.create('DigiCompass.Web.app.AutosizeWindow',{
		            		title : 'WBS ('+ record.get('name')+')',
            		        width:800,
            		    	height:600,
            		    	modal:true,
            		        maximizable : true,
            		        layout:'fit',
            		        closeAction: 'destroy',
            		        items: [new DigiCompass.Web.app.planning.WBS({objIds:[id], name:record.get('name')})]
	        			}).show();
	        	}
	        },
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					selection.getTarget().features[0].cleanGrouping();
				}
			}]
	    });
		if(param.id){
			selection.target.getDockedItems('toolbar[dock="top"]')[0].add({
				xtype : 'button',
				text : 'Export',
				handler : function(){
    				var data = {	    					
	    					MODULE_TYPE : moduleType,
	    					COMMAND : command,
							title : title						
		            	};
    				data = Ext.applyIf(data, p);
					var url = "download";
					downloadFile(url, data);
				}
			});
		}
		parent.setTitle( title || '');
//		selection.target.loadStart();
		parent.add(selection);
	},
	/**
	 * add selection panel
	 * param: 
	 * 		id
	 * 		paramJson : 
	 * 			type	--selection type:SITES/CRS/FINANCIALS
	 * 			{selection param}
	 */
	selectionHandler : function(selection, param){
		var me = this;
		me.objectDetail.paramJson = Ext.JSON.encode(param.paramJson);
		selection.removeAll();
		me.fillSelectionPanel(selection, param);
	},
	/**
	 * load report data
	 * param: 
	 * 		id
	 * 		paramJson : 
	 * 			type	--selection type:SITES/CRS/FINANCIALS
	 * 			{selection param}
	 */
	reportHandler : function(report, param){
		var me = this;
		report.removeAll();
		var p = {
			MODULE_TYPE:me.detailModuleCfg.moduleType,
			COMMAND: me.detailModuleCfg.command
		};
		var paramJson;
		if(param.id){
			//exits report(后台获取Param)
			p.id = param.id;
		}else{
			//new report(根据paramJson查询)
			Ext.apply(p, param);
		}
		report.setLoading(true);
		cometdfn.request(p, function(msg){
			report.setLoading(false);
			var data = msg.BUSINESS_DATA;
			if(!data || !data.reportSort) return;
			var sort = data;
			console.log(data);
			
			var items = [];
			var sort = data.reportSort;
			var tab = Ext.create('Ext.tab.Panel', {
				id : "crReportTabPanelId",
				border: true,
				activeTab : 0,
				collapsible : false,
				height: 'fit',
				items : items
			});
			var addTabItems = function(tab, data, sort, activeNum){
				if(!activeNum) activeNum = 0;
				for(var i=0; i<sort.length; i++){
					var reportName = sort[i];
					try{
						tab.add({
							id : "crReportTabPanel_TabIdUseInGetTabNum_" + (Math.random() + "").split(".")[1] + "_" + i,
							title : reportName,
							collapsible : false,
							padding : '0px 3px 3px 3px',
							border : false,
							frame : false,
							layout : 'vbox',
							defaults : {
								flex : 1
							},
							items : me.buildReport(reportName, tab, data.reports[reportName], "tab"+i, !(data.reports[reportName].reportType === "STD"), 
									!!(reportName == "Gantt Chart"), me.getReportDetailListener(reportName, data.reports[reportName].report))
						})
					}catch(e){
						console.error(e, e.stack);
						continue;
					}
				}
				tab.setActiveTab(activeNum)
			}
			report.add(tab)
			report.addListener("resize", function(){
				if(!window.parent.changeRequestReport_reportTab_width || (window.parent.changeRequestReport_reportTab_width && 
						window.parent.changeRequestReport_reportTab_width != report.getWidth())){
					var num = Ext.getCmp("crReportTabPanelId").getActiveTab();
					if(num){
						num = parseInt(num.getId().split("_")[3])
						window.parent.changeRequestReport_reportTab_activeTab = num;
					}else if(window.parent.changeRequestReport_reportTab_activeTab){
						num = window.parent.changeRequestReport_reportTab_activeTab;
					}
					tab.removeAll()
					addTabItems(tab, data, sort, num)
				}
				window.parent.changeRequestReport_reportTab_width = report.getWidth()
			})
			addTabItems(tab, data, sort)
			window.parent.changeRequestReport_reportTab_width = report.getWidth() || 0;
		});
	},
	getReportDetailListener : function(reportName, report){
		var me = this;
		return function(key, gridName){
			if(reportName === 'Change Request'){
				var name , ids = [];
				if(key === '# of CRs'){
					name = key;
					var perCR = report['Number of Services per Change Request'].data;
					for(var k in perCR){
						ids.push(k.split(',')[1]);
					}
				}else{
					key = key.split(',');
					name = key[0];
					ids.push(key[1]);
				}
				Ext.create('DigiCompass.Web.app.AutosizeWindow',{
            		title : 'WBS ('+ name +')',
    		        width:800,
    		    	height:600,
    		    	modal:true,
    		        maximizable : true,
    		        layout:'fit',
    		        closeAction: 'destroy',
    		        items: [new DigiCompass.Web.app.planning.WBS({
    		                	objIds:ids,
    		                	name:name,
    		                	paramJson : me.objectDetail.paramJson
    		                })
    		         ]
    			}).show();
			}else if(reportName === 'Engineering Orders'){
				var name, ids = [];
				if(key === '# of Engineering Orders'){
					name = key;
					for(var k in report['Tasks per Engineering Order'].data){
						if(k.length === 1){
							continue;
						}
						ids.push(k.split(',')[1]);
					}
				}else{
					key = key.split(',');
					name = key[0];
					ids.push(key[1] || null);
				}
				
				var eoWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
            		title : 'Engineering Order ('+ name +')',
    		        width:800,
    		    	height:600,
    		    	modal:true,
    		        maximizable : true,
    		        layout:'fit',
    		        closeAction: 'destroy',
    		        items: []
    			}).show();
				
				cometdfn.request({
					MODULE_TYPE:'MOD_REPORT_CHANGE_REQUEST',
					COMMAND:'EO_INFO',
					retType : 'hierarchy',
					ids : ids,
					paramJson : me.objectDetail.paramJson
				}, function(msg){
					var hierarchys = msg.BUSINESS_DATA;
					if(Ext.isArray(hierarchys)){
						for(var i=0; i < hierarchys.length; i++){
							var param = Ext.apply({
								ids : ids,
								paramJson : me.objectDetail.paramJson
							},  hierarchys[i]);
							
							var eoGrid = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid', {
								useSearch:true,
								border : false,
								frame : false,
								autoCheckBox : false,
								collapsible : false,
								title : '('+ param.financialHierarchyName + ' , '+ param.serviceCatalogueHierarchyName+")",
						        store: {
						            buffered: true,
						            autoLoad:true,
						            proxy: {
						                type: 'cometd.mutigroup',
						                moduleType : 'MOD_REPORT_CHANGE_REQUEST',
						                modules : {
						                	read : {
						               		 	command : 'EO_INFO'
						               		}
						                },
										extraParams: param
						            }
						        },
						        tbar : [{
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
						    					MODULE_TYPE : "MOD_REPORT_CHANGE_REQUEST",
						    					COMMAND : "EO_INFO",
						    					retType : 'excel',
												title : 'Order ('+ name +')'						
							            	};
					    				var params = this.up("mutigroupgrid").getStore().getProxy().extraParams;
					    				if(params.ids instanceof Array){
					    					params.ids = JSON.stringify(params.ids);
					    				}
					    				data = Ext.applyIf(data, params);	
										var url = "download";
										downloadFile(url, data);
									}
								}],
			    		        listeners : {
			    		        	"cellclick" : function(grid, cellElement, columnNum, record,
										rowElement, rowNum, e) {
			    		        		var header = grid.getHeaderCt().getHeaderAtIndex(columnNum);
			    		        		if(e.target.className.indexOf('d-grid-group')>-1 || (!header.link && record.get('groupindex'))){
			    		    		        return;
			    		    		    }
			    		    			var dataIndex = header.dataIndex;
										if(dataIndex === 'orderno'){
											var eoId = record.get('groupindex') ? record.get("groupvalue") : record.get("orderno");
											cometdfn.request({
												MODULE_TYPE : "BORIS_ORDER_MODULE",
												COMMAND : 'COMMAND_QUERY_ORDER_INFO',
												eoId : eoId
											}, function(data, Conf) {
												var status = data.STATUS;
												if (status === "success") {
													DigiCompass.Web.app.eo.showPoDetailPanel(Ext.JSON.decode(data.BUSINESS_DATA));
												} else if (data.customException) {
													alertError(data.customException);
												}
												grid.opening = false;
											});
										}
			    		        	}
			    		        }
					        });
							eoWin.add(eoGrid);
						}
					}
				});				
			}else if(reportName === 'Material Orders'){
				var name, ids = [], type;
				var delivery = gridName.indexOf('Delivery')>-1;
				if(key === '# of Material Orders' || key === '# of M Orders'){
					name = key;
					var dt = 'Delivery Material Items per Material Order';
					var t = 'Material Items per Material Order';
					if(!dt in report){
						dt = 'Delivery Material Orders per Material Order';
					}
					if(!t in report){
						t = 'Material Orders per Material Order';
					}
					var d = delivery ? report[dt].data
							:report[t].data;
					for(var k in d){
						if(k.length === 1){
							continue;
						}
						ids.push(k.split(',')[1]);
					}
					type = 'order';
				}else{
					key = key.split(',');
					name = key[0];
					ids.push(key[1] || null);
					type = gridName.indexOf('per Material Order')>-1 ? 'order' : null;
				}
				
				var moWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
					title : 'Material Order ('+ name +')',
					width:800,
					height:600,
					modal:true,
					maximizable : true,
					layout:'fit',
					closeAction: 'destroy',
					items: []
				}).show();
				
				cometdfn.request({
					MODULE_TYPE:'MOD_REPORT_CHANGE_REQUEST',
					COMMAND:'MO_INFO',
					retType : 'hierarchy',
					ids : ids,
					delivery : delivery,
					per : type,
					paramJson : me.objectDetail.paramJson
				}, function(msg){
					var hierarchys = msg.BUSINESS_DATA;
					if(Ext.isArray(hierarchys)){
						for(var i=0; i < hierarchys.length; i++){
							var param = Ext.apply({
								ids : ids,
								delivery : delivery,
								per : type,
								paramJson : me.objectDetail.paramJson
							},  hierarchys[i]);
							
							var moGrid = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid', {
								useSearch:true,
								border : false,
								frame : false,
								autoCheckBox : false,
								collapsible : false,
								title : '('+ param.financialHierarchyName + ' , '+ param.serviceCatalogueHierarchyName+")",
								store: {
									buffered: true,
									autoLoad:true,
									proxy: {
										type: 'cometd.mutigroup',
										moduleType : 'MOD_REPORT_CHANGE_REQUEST',
										modules : {
											read : {
												command : 'MO_INFO'
											}
										},
										extraParams: param
									}
								},
						        tbar : [{
									xtype : 'button',
									text : 'Clear Grouping',
									handler : function(){
										this.up('mutigroupgrid').getTarget().features[0].cleanGrouping();
									}
								},{
									xtype : 'button',
									text : 'Export',
									handler : function(){
					    				var data = {	    					
						    					MODULE_TYPE : "MOD_REPORT_CHANGE_REQUEST",
						    					COMMAND : "MO_INFO",
						    					retType : 'excel',
												title : 'Material Order ('+ name +')'						
							            	};
					    				var params = this.up("mutigroupgrid").getStore().getProxy().extraParams;
					    				if(params.ids instanceof Array){
					    					params.ids = JSON.stringify(params.ids);
					    				}
					    				data = Ext.applyIf(data, params);	
										var url = "download";
										downloadFile(url, data);
									}
								}],
			    		        listeners : {
			    		        	"cellclick" : function(grid, cellElement, columnNum, record,
										rowElement, rowNum, e) {
			    		        		var header = grid.getHeaderCt().getHeaderAtIndex(columnNum);
			    		        		if(e.target.className.indexOf('d-grid-group')>-1 || (!header.link && record.get('groupindex'))){
			    		    		        return;
			    		    		    }
			    		    			var dataIndex = header.dataIndex;
										if(dataIndex === 'orderno'){
											var order = record.get('groupindex') ? record.get("groupvalue") : record.get("orderno");
											DigiCompass.Web.app.eo.showMaterialDetailPanel(order);
										}
			    		        	}
			    		        }
							});
							moWin.add(moGrid);
						}
					}
				});
				
			} else if(reportName == "Purchase Orders"){
				var name, ids = [], type;				
				if(key === '# of Purchase Orders'){
					name = key;					
					var t = 'Amount per Purchase Order';					
					var d = report[t].data;
					for(var k in d){
						if(k.length === 1){
							continue;
						}
						ids.push(k.split(',')[1]);
					}
					type = 'order';
				}else{
					key = key.split(',');
					name = key[0];
					ids.push(key[1] || null);
					type = gridName.indexOf('per Purchase Order')>-1 ? 'order' : null;
				}
				
				var poWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
					title : 'Purchase Order ('+ name +')',
					width:800,
					height:600,
					modal:true,
					maximizable : true,
					layout:'fit',
					closeAction: 'destroy',
					items: []
				}).show();
				
				cometdfn.request({
					MODULE_TYPE:'MOD_REPORT_CHANGE_REQUEST',
					COMMAND:'PO_INFO',
					retType : 'hierarchy',
					ids : ids,
					per : type,
					paramJson : me.objectDetail.paramJson
				}, function(msg){
					var hierarchys = msg.BUSINESS_DATA;
					if(Ext.isArray(hierarchys)){
						for(var i=0; i < hierarchys.length; i++){
							var param = Ext.apply({
								ids : ids,
								per : type,
								paramJson : me.objectDetail.paramJson
							},  hierarchys[i]);
							
							var poGrid = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid', {
								useSearch:true,
								border : false,
								frame : false,
								autoCheckBox : false,
								collapsible : false,
								title : '('+ param.financialHierarchyName + ' , '+ param.serviceCatalogueHierarchyName+")",
								store: {
									buffered: true,
									autoLoad:true,
									proxy: {
										type: 'cometd.mutigroup',
										moduleType : 'MOD_REPORT_CHANGE_REQUEST',
										modules : {
											read : {
												command : 'PO_INFO'
											}
										},
										extraParams: param
									}
								},
						        tbar : [{
									xtype : 'button',
									text : 'Clear Grouping',
									handler : function(){
										this.up('mutigroupgrid').getTarget().features[0].cleanGrouping();
									}
								},{
									xtype : 'button',
									text : 'Export',
									handler : function(){
					    				var data = {	    					
						    					MODULE_TYPE : "MOD_REPORT_CHANGE_REQUEST",
						    					COMMAND : "PO_INFO",		
						    					retType : 'excel',
												title : 'Purchase Order ('+ name +')'						
							            	};
					    				var params = this.up("mutigroupgrid").getStore().getProxy().extraParams;
					    				if(params.ids instanceof Array){
					    					params.ids = JSON.stringify(params.ids);
					    				}
					    				data = Ext.applyIf(data, params);
										var url = "download";
										downloadFile(url, data);
									}
								}],
			    		        listeners : {
			    		        	"cellclick" : function(grid, cellElement, columnNum, record,
										rowElement, rowNum, e) {
			    		        		var header = grid.getHeaderCt().getHeaderAtIndex(columnNum);
			    		        		if(e.target.className.indexOf('d-grid-group')>-1 || (!header.link && record.get('groupindex'))){
			    		    		        return;
			    		    		    }
			    		    			var dataIndex = header.dataIndex;
										if(dataIndex === 'orderno'){
											var order = record.get('groupindex') ? record.get("groupvalue") : record.get("orderno");
											DigiCompass.Web.app.eo.showSapDetailPanel(order);
										}
			    		        	}
			    		        }
							});
							
							poWin.add(poGrid);
						}
					}
				});			
			}else if( reportName == "Gantt Chart"){
				
			}
		}
	},
	/**
	 * load report(validte param)deliveryStatus
	 */
	loadReport : function(report, param){
		var me = this;
		if(param.id || me.objectDetail.paramJson){
			me.reportHandler(report, Ext.apply(param, {
				paramJson : me.objectDetail.paramJson
			}));
		}
	},
	/**
	 * initialize and show object detail
	 */
	showDetail : function(record){
		var me = this, 
			param = me.detailModuleCfg.param || {},
			selection = Ext.create('Ext.panel.Panel',{
				region : 'north',
				layout : 'fit',
				frame : false,
				height : 200,
				collapsible : true,
				split : true,
				border : false
			}),
			report = Ext.create('Ext.panel.Panel',{
				title : 'Reports',
				region : 'center',
				layout : 'fit',
				frame : false,
				collapsible : false,
				split : true,
				border : false
			}),
			main = Ext.create('Ext.panel.Panel',{
				margin : '5px',
				frame : false,
				border:false,
				anchor : '0 -120',
				layout : 'border',
				hidden : true,
				default : {
					width : '100%',
					collapsible : true,
					split : true
				},
				items : [selection, report]
			});
		
		me.objectDetail = Ext.create('Ext.form.Panel', {
			title: me.getTitle(record),
			defaultType : 'textfield',
			frame : false,
			width : '100%',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 100	
			},
			defaults: {
				msgTarget  : 'side',
				height : 25,
	            anchor: '-15',
	            margin 	   : '10px 5px 10px 10px'
	        },
			tbar:[{
				xtype : 'button',
				text  : 'Save',
				handler : function(){
					if(me.objectDetail.getForm().isValid() && me.objectDetail.paramJson){
						var param = me.objectDetail.getForm().getValues();
						param.paramJson = me.objectDetail.paramJson;
						Ext.apply(param, {MODULE_TYPE : me.detailModuleCfg.moduleType,
							COMMAND : me.detailModuleCfg.saveCommand});
						cometdfn.request(param, function(msg){
							var status = msg.STATUS;
							if (status === "success") {
								Notification.showNotification('Save Success!');
								Ext.getCmp('obj-details').removeAll();
								me.objectExplorer.reload();
							} else if(data.customException){
								alertError(data.customException);
							}
						});
					}
				}
			}],
			items : [{
				name 	   : 'id',
				xtype:'hidden',
				height : 0
			},{
				allowBlank : false,
				emptyText  : 'Please input data!',
				fieldLabel : 'Name',
				maxLength  : UiProperties.nameMaxLength,
				name 	   : 'name',
				listeners : {
					change : function(scope, newVal,val){
					}
				}
			},{
				emptyText  : 'Please input data!',
				fieldLabel : 'Description ',
				maxLength  : UiProperties.descMaxLength,
				name 	   : 'description'
			},{
				layout:'hbox',
				xtype  :'container',
				items : [{
			    	xtype: 'datefield',
//			    	allowBlank : false,
					emptyText  : 'Please input from date!',
					format : 'Y-m-d',
					fieldLabel : 'Insert Date Limit ',
					name 	   : 'start',
					listeners : {
						select : function(scope, newVal, val){
							if(!record)
								me.loadReport(report, me.objectDetail.getForm().getValues());
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
							if(!record)
								me.loadReport(report, me.objectDetail.getForm().getValues());
						}
					}
				},{
			    	xtype: 'button',
			    	text : 'Select Sites', 
			    	hidden : !!record,
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
			    			me.selectionHandler(selection, params);
		    				me.loadReport(report, Ext.apply(params,me.objectDetail.getForm().getValues()));
			    			
			    			main.show();
			    		});
			    	}
				}, {
			    	xtype: 'button',
			    	text : 'Import Sites', 
			    	hidden : !!record,
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
		         		   			    			me.selectionHandler(selection, params);
		         		   		    				me.loadReport(report, Ext.apply(params,me.objectDetail.getForm().getValues()));
		         		   			    			
		         		   			    			main.show();
	         		   			    			
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
			    	text : 'Select Change Requests', 
			    	hidden : !!record,
			    	margin:'0 0 0 50',
			    	handler : function(){
			    		me.openExistObjectsWindow('Existing Change Requests',{
			    			moduleType:'MOD_REPORT_CHANGE_REQUEST',
			    			command:'COMMAND_QUERY_CRS',
			    		},{
			    			checkAll : true
			    		},function(status){
			    			var params = {
		    					paramJson : Ext.apply({type : 'CRS'}, status ||{})
							};
			    			me.selectionHandler(selection, params);
			    			me.loadReport(report, Ext.apply(params,me.objectDetail.getForm().getValues()));
			    			
			    			main.show();
			    		});
			    	}
				},{
			    	xtype: 'button',
			    	text : 'Select Financial Catalogues', 
			    	hidden : !!record,
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
    				    			me.selectionHandler(selection, params);
    				    			me.loadReport(report, Ext.apply(params,me.objectDetail.getForm().getValues()));
    				    			
    				    			main.show();
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
			    		
//			    		
//			    		me.openExistObjectsWindow('Existing Financial Catalogues',{
//			    			moduleType:'MOD_REPORT_CHANGE_REQUEST',
//			    			command:'COMMAND_QUERY_FINS' 
//			    		},{},function(status){
//			    			var params = {
//		    					paramJson : Ext.apply({type : 'FINANCIALS'}, status ||{})
//							};
//			    			me.selectionHandler(selection, params);
//			    			me.loadReport(report, Ext.apply(params,me.objectDetail.getForm().getValues()));
//			    			
//			    			main.show();
//			    		});
			    	}
				}]
			}, main]
		});
		DigiCompass.Web.UI.Wheel.showDetail();
		Ext.getCmp('obj-details').removeAll();
		Ext.getCmp('obj-details').add(me.objectDetail);
		if(record){
			var param = {
				id : record.get('id'),
				name : record.get('name'),
				description : record.get('description') == "N/A"?"":record.get('description'),
				start : record.get('startTime').substr(0,10),
				end : record.get('endTime').substr(0,10),
				paramJson : Ext.JSON.decode(record.get('paramJson'))
			}
			
			me.objectDetail.getForm().setValues(param);
			me.selectionHandler(selection, param);
			me.reportHandler(report, {id : param.id});
			main.show();
		}else{
			main.hide();
		}
	},
	
	/**
	 * initialize CR report
	 */
	buildReport : function(_tabName, reportPanel, data, tab, flag, isGantt, callback){
		if(isGantt){
			return Ext.create("DigiCompass.Web.app.TabPanelsForGanttChart", reportPanel, data, tab, _tabName, callback);
		}else{
			if(flag){
				return Ext.create('DigiCompass.Web.app.CrReport_BulletSimpleFitGrid_InitPanel', reportPanel, data, tab, _tabName, callback);
			}else{
				return Ext.create('DigiCompass.Web.app.BoxPlots_ChartAndGrid', reportPanel, data, _tabName, callback);
			}
		}
		
	},
	openExistObjectsWindow : function(title,module, param,callback){
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
	},
	destory : function(){
		me.objectExplorer.remove(true);
		me.objectDetail.remove(true);
		me.objectExplorer = null;
		me.objectDetail = null;
	}
});
