
(function(){
	Ext.namespace('DigiCompass.Web.Cmp.TrafficCalc');
	
//	DigiCompass.Web.Cmp.TrafficCalc.createTrafficCalc = function(){
//		var dataObj =  Ext.JSON.decode(data["BUSINESS_DATA"].data);
//		var strategicModelCalcPanel = Ext.getCmp('strategicModelCalcId');
//		if(strategicModelCalcPanel){
//			strategicModelCalcPanel.getStore().loadData(dataObj);
//		}else{
//			var userStore = Ext.create('Ext.data.ArrayStore', {
//				fields:["siteId","state","spectrum","trafficShare"],
//				data: dataObj
//			});
//			
//			var btn_clear = Ext.create('Ext.Button',{
//				text:'Clear Grouping',
//	            handler : function(a,b,c,d) {
//	                features.cleanGrouping();
//				}
//			});
//			
//			var features =  Ext.create('Ext.grid.feature.MultiGroupingSummary',{
//				baseWidth:50,
//		        groupHeaderTpl: '{disName}'
//		      });
//			
//			var grid = Ext.create('Ext.grid.Panel', {
//				id : 'strategicModelCalcId',
//				store : userStore,
//				enableColumnHide : true,
//				enableColumnMove : true,
//				features : features,
//				margins : '5 0 5 5',
//				width : '100%',
//				collapsible : true,
////				renderTo : 'STRATEGIC_MODEL_CALCULATIONS_ID',
//				height : 300,
//				title : 'CMP - Strategic Model Calculations',
//				columns : [{ 
//					columnType:'summary', 
//					menuDisabled: true 
//				},{
//					text : 'Site ID',
//					width : 100,
//					sortable : true,
//					dataIndex : 'siteId'
//				}, {
//					text : 'State',
//					width : 150,
//					sortable : true,
//					dataIndex : 'state',
//				}, {
//					text : 'Spectrum',
//					width : 150,
//					sortable : true,
//					dataIndex : 'spectrum'
//				}, {
//					text : 'Traffic Share',
//					width : 150,
//					sortable : true,
//					dataIndex : 'trafficShare'
//				}  ],
//				tbar:[btn_clear]
//			});
//			
//			var bindData = function(data){
//		    	return data.address+', '+data.streetName+', '+data.suburb+', '+data.state+', '
//		    		+(data.spectrumRegion ? data.spectrumRegion.name : data.region);
//		    }
//		    
//		    grid.getView().on('render', function(view){
//				view.tip = Ext.create('Ext.tip.ToolTip', {  
//					//title : 'Address:',
//		            target: view.el,          // The overall target element.  
//		            delegate: view.itemSelector, // Each grid row causes its own seperate show and hide.  
//		            trackMouse: true,         // Moving within the row should not hide the tip.  
//		            hideDelay : false,
//		            dismissDelay : 0,
//		            draggable : true,
//		            maxWidth: 300,
//					minWidth: 100,
//					showDelay: 50,
//		            renderTo: Ext.getBody(),  // Render immediately so that tip.body can be referenced prior to the first show.  
//		            html : 'lodding...',
//		            listeners: {              // Change content dynamically depending on which element triggered the show.  
//		                beforeshow: function (tip) {
//							var record = view.getRecord(tip.triggerElement);
//							if(record.bindData){
//								tip.update(bindData(record.bindData));
//							}else{
//								tip.update('loading...');
////								console.log('loadding...', record.get('siteId'));
//								cometdfn.request({MODULE_TYPE : 'MOD_SNAPSHOT_SITE',COMMAND : 'COMMAND_QUERY_INFO',
//			             			siteNum: record.get('siteId'),siteGroupId: data.siteGroupId}, 
//				         			function(data){
//				                 		record.bindData = Ext.JSON.decode(data.BUSINESS_DATA);
////				                 		console.log('load success, site id = '+ record.get('category0'), record.bindData);
//				                 		if(view.tip.triggerElement && view.getRecord(view.tip.triggerElement) 
//				                 				&& record.bindData.siteNum === view.getRecord(view.tip.triggerElement).get('siteId')){
//				             				view.tip.update(bindData(record.bindData));
//				                 		}
//			                 	});
//							}
//							return true;
//						} 
//					}  
//			    }); 
//			});
//			
//			Ext.getCmp('centerBottomTabTwoId'+data.scenarioId).add(grid);
//		}
//	};
	
//	DigiCompass.Web.Cmp.TrafficCalc.refreshTrafficCalc = function(arg){
//		cometdfn.publish({
//			MODULE_TYPE : 'MOD_TRAFFIC_CALC',
//			COMMAND : 'COMMAND_QUERY_GRID',
//			siteGroupId:arg.siteGroupId,
//			versionId : arg.versionId,
//			planningCycleId : arg.planningCycleId,
//			scenarioId : arg.scenarioId,
//			technologyId: arg.technologyId
//		});
//	};
	
	DigiCompass.Web.Cmp.TrafficCalc.refreshFlexView = function(arg){
		arg = Ext.clone(arg);
		temp_cmp = Ext.getCmp(arg.renderCmp);
		var id = arg.renderCmp+"trafficCalcPanel"+arg.moduleType+arg.command;
		if(!Ext.getCmp(id)){
			var flexView = new DigiCompass.Web.app.grid.MutiGroupGrid({		
				id : id,
				collapsible : false,
		        store: {
		            buffered: true,
		            autoLoad: true,
		            pageSize: 100,
		            proxy: {
		                type: 'cometd.mutigroup',
		                moduleType : arg.moduleType,
		                modules : {
		                	read : {
		               		 	command : arg.command
		               		}
		                },
		                extraParams : {
			            	siteGroupId:arg.siteGroupId,
			    			versionId : arg.versionId,
			    			planningCycleId : arg.planningCycleId,
			    			scenarioId : arg.scenarioId,
			    			technologyId: arg.technologyId
			            }
		            }
		        },
	//		Ext.create('DigiCompass.Web.app.grid.FlexView', {
	//	    	features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping',{
	//	    		baseWidth:50,
	//	            groupHeaderTpl: '{disName}'
	//			})],
	//			id : id,
	//			border : false,
	//			collapsible : false,
	//			frame : false,
	//	        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
	//	            proxy: Ext.create('DigiCompass.Web.app.data.proxy.FlexViewCometdProxy', {
	//	                moduleType : arg.moduleType,
	//	                modules : {
	//	                	read : {
	//	               		 	command : arg.command
	//	               		}
	//	                },
	//		            extraParams : {
	//		            	siteGroupId:arg.siteGroupId,
	//		    			versionId : arg.versionId,
	//		    			planningCycleId : arg.planningCycleId,
	//		    			scenarioId : arg.scenarioId,
	//		    			technologyId: arg.technologyId
	//		            }
	//	            })
	//	        }),
		        tbar : [{
					xtype : 'button',
					text : 'Refresh',
					handler : function(){
						flexView.reload();
					}
				},{
					xtype : 'button',
					text : 'Clear Grouping',
					handler : function(){
						flexView.target.features[0].cleanGrouping();
					}
				},{
					xtype : 'button',
					text : 'Export',
					handler : function(){
						var data = {    			
		    					MODULE_TYPE : arg.moduleType,
		    					COMMAND : "COMMAND_EXPORT_DATA",
	//							versionId: grid.versionId,
								planningCycleId: arg.planningCycleId,
								siteGroupPlannedId: arg.siteGroupPlannedId,
								technologyId: arg.technologyId,
								siteGroupId: arg.siteGroupId,
								scenarioId:arg.scenarioId,
								title : arg.title
			            	};
			            var str = context.param(data);
			            window.location.href = "download?"+str;
					}
				}]
		    })
		    var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
					height : 300,
					margins : '5 0 5 5',
					panelTitle : arg.title,
					showNavigation : arg.showNavigation || false,
					front : flexView
				});
		    if(arg.moduleType == "COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_MOD"){
		    	temp_cmp.insert(4, reversalPanel);
		    } else {
				temp_cmp.add(reversalPanel);
		    }
//		flexView.getTarget().loadStart()
		}
	}
	
})();

