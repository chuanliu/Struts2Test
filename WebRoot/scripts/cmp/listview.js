(function() {
	Ext.namespace('DigiCompass.Web.app.assembleListView');
	
	//瀹氫箟鍏ㄥ眬鍙傛暟鐢ㄤ簬淇濆瓨Scenario鏁版嵁
	var scenarioDataArry = new Array();
	
	//鍏ㄥ眬鍙傛暟涓幏鍙栨寚瀹氱殑瀵硅薄
	DigiCompass.Web.app.assembleListView.getScenarioDataArry = function(id){
		for(var i = 0 ; i < scenarioDataArry.length ; i++){
			if(scenarioDataArry[i].scenarioId == id){
				return scenarioDataArry[i];
			}
		}
		return null;
	}

	DigiCompass.Web.app.assembleListView.assembleData = function(data){
		return Ext.JSON.decode(data.BUSINESS_DATA);
	};
	DigiCompass.Web.app.assembleListView.checkbox_click = function(e){
		e = e || window.event;
		e.stopPropagation();
	};
	DigiCompass.Web.app.assembleListView.getListView = function(data, config) {
		
//		var scenarioId = data.scenarioId;
		var datas = Ext.decode(data.BUSINESS_DATA);
//		var fields = [ 'id', 'scenarioName', 'groupName', 'technologyName', 'planningCycleName', 'plannedSiteGroupName', 'reference'];
		var fields = ['id','current','versionId','versionName','technologyId','technologyName','siteGroupId',
         'siteGroupName','planningCycleId','planningCycleName','siteGroupPlannedId','siteGroupPlannedName','tableName','canDrag','reference'];
		for(var key in datas){
			datas[key].versionId = datas[key].id;
			datas[key].canDrag = false;
			datas[key].versionName = datas[key].scenarioName;
			datas[key].siteGroupName = datas[key].groupName;
		}
		var columns = [{
			xtype : 'treecolumn',
			header : 'Scenario',
			dataIndex : 'versionName',
			sortable : true
		} , {
			header : 'Site Group',
			dataIndex : 'siteGroupName',
			sortable : true
		} , {
			header : 'Technology',
			dataIndex : 'technologyName',
			sortable : true
		},{
			header : 'Planning Cycle',
			dataIndex : 'planningCycleName',
			sortable : true
		} , {
			header : 'Planned Site Group',
			dataIndex : 'siteGroupPlannedName',
			sortable : true
		} , {
			header : 'Reference',
			dataIndex : 'reference',
			sortable : true
		} ];
		
	    var store = Ext.create('Ext.data.ArrayStore', {
	        id: 'store',
	        pageSize: 100,
	        fields: fields,
	        remoteSort: true,
	        // allow the grid to interact with the paging scroller by buffering
	        buffered: true,
	        proxy: {
	            // load using script tags for cross domain, if the data in on the same domain as
	            // this page, an HttpProxy would be better
	            type: 'ajax',
	            url: 'AjaxDataServlet',
	            extraParams: {
	                total: 50000
	            },
	            reader: {
	            	type : "array",
	                root: 'result',
	                totalProperty: 'totalCount'
	            },
	            // sends single sort as multi parameter
	            simpleSortMode: true
	        },
	        sorters: [{
	            property: 'lastpost',
	            direction: 'DESC'
	        }]
	    });
	    
		if (Ext.getCmp('scenarioViewId')) {
//			Ext.getCmp('scenarioViewId').reconfigData(datas);
			Ext.getCmp('scenarioViewId').reconfigure(datas, columns);
			/*Ext.getCmp('scenarioViewId').reconfigure(datas, columns,fields);
			if(data.versionId){
				var scenarioExplorer = Ext.getCmp('scenarioExplorer');
				for(var i =0;i<datas.length; i++){
					if(datas[i].id === data.versionId){
						scenarioExplorer.getSelectionModel().select(i);
					}
				}
			}*/
//			Ext.getCmp('scenarioExplorer').show();
//			Ext.getCmp('versionView').hide();
			Ext.getCmp('versionView').tableName = data.tableName || 'SCENARIO';
		}else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				id:"scenarioExplorer",
				fields:fields,
				width:"fit",
				
//				height:700,
				/*store : store,
				verticalScrollerType: 'paginggridscroller',
		        loadMask: true,
		        disableSelection: true,
		        invalidateScrollerOnRefresh: false,
		        viewConfig: {
		            trackOver: false
		        },*/
				onSearch : function(name){
					var versionview = Ext.getCmp('versionView');
					var param = {
						planningCycleId: versionview.planningCycleId,
		    			scenarioId:  versionview.scenarioId,
		    			siteGroupId:  versionview.siteGroupId,
		    			technologyId:  versionview.technologyId,
		    			siteGroupPlannedId:  versionview.siteGroupPlannedId,
		    			versionId:  null,
		    			dragVersionId : null,
		    			name : name,
		    			tableName : versionview.tableName||'SCENARIO',
		    			search : true
					}
					versionview.loadData(param, function(){
						var tmp = versionview.toGrid(param);
						Ext.getCmp('scenarioViewId').reconfigure(tmp.data, tmp.columns);
					});
					return false;
				},
				data:[],
				viewConfig : {
					 plugins: {
		                  ptype: 'gridviewdragdrop',
		                  enableDrag: true,
		                  enableDrop: false,
		                  dragGroup: 'gridDDGroup'
		            }
				}
			});
			objectExplorer.on('checkchange', function(node, checked) {      
				objectExplorer.checkchild(node,checked);  
				objectExplorer.checkparent(node);  
	    	});  
			var versionview = new DigiCompass.Web.app.VersionView({
				id : 'versionView'
			});
			
			
			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
				width:"fit",
				id:"scenarioCatalogue",
				height:730,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'scenarioViewId',
				module:'MOD_SCENARIO',
				command:'COMMAND_QUERY_LIST',
				otherParam:{},
				region:'west',
				layout:'border',
				width:50,
				height:530,
				objectExplorer:objectExplorer,
				catalogue:catalogue,
				hidden:true
			});
			mainPanel.reconfigData(datas);
			var objExpPanel = Ext.getCmp("obj-exp");
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}
			var cataloguePanel = Ext.getCmp("obj-cat");
			if (cataloguePanel) {
				// 移除组建
				cataloguePanel.removeAll();
			}
			objExpPanel.add(objectExplorer);
			objExpPanel.add(versionview);
			function getTbar(type){
				var isVersinView = type==='versionView';
				var getSelection = function(){
					var sels = [];
					var selections;
					if(isVersinView){
						selections = versionview.versionView.getSelectionModel().getSelection();
					}else{
							var checked = objectExplorer.getChecked();
							selections = new Array();
							for(var i = 0 ; i<checked.length ; i++){
								selections.push({
									data:checked[i]
								});
							}
					}
					for(var key in selections){
//						sels.push(selections[key].getData());
						sels.push(selections[key].data);
					}
					return sels;
				}
				var items = [{
					xtype:'button',
					text: 'New',
					iconCls : 'icon-add',
					handler : function() {
						var tableName = versionview.tableName || 'SCENARIO';
						if(tableName === 'SCENARIO'){
							DigiCompass.Web.UI.Wheel.showDetail();						
							DigiCompass.Web.app.assembleListView.scenarioAdd();
							versionview.tableName = 'SCENARIO';
						}else{
							 var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
							 if(!scenarioCenterPanel){
								 Ext.getCmp('obj-details').removeAll();
							 }
							 DigiCompass.Web.UI.Wheel.showDetail();
							 
							 var data = {
								planningCycleId: versionview.planningCycleId,
				    			scenarioId:  versionview.scenarioId,
				    			siteGroupId:  versionview.siteGroupId,
				    			technologyId:  versionview.technologyId,
				    			siteGroupPlannedId:  versionview.siteGroupPlannedId,
				    			versionId:  null,
				    			dragVersionId : null,
				    			tableName : tableName,
				    			id : null,
				    			showNavigation : true,
				    			edit : true
							 }
							 var scenarioCenterPanel = DigiCompass.Web.UI.Scenario.createScenarioCenterPanel(data);
							 Ext.getCmp('obj-details').add(scenarioCenterPanel);
						}
					}
				},/*{
				    xtype:'button',
					text: 'Save As',
				    iconCls : 'icon-add',
				    tooltip:'Save as a new scenario!',
				    handler: function(){
				    	var sels = getSelection();
						if(sels.length===0){
							alertWarring('Please select a record!');
						}else{
							var id = sels.id;
							var scenarioName = sels.scenarioName || sels.versionName;
							promptDialog('Save as a new '+ versionview.getVersionTitle()+'?', 'Please enter the '+ versionview.getVersionTitle() +' name:',
									function(btn, text){
								 if(btn == "ok"){
									 if(!versionview.tableName || versionview.tableName === 'SCENARIO'){
										 cometdfn.publish({
											MODULE_TYPE : "MOD_SCENARIO_COPY",
											COMMAND : 'COMMAND_SAVE_BATCH',
											scenarioId : scenarioId,
											scenarioName: text
										});
									 }
								 }
							 }, this, this, function(text){
								 if(Ext.isEmpty(text)){
									 alertWarring(versionview.getVersionTitle()+' name can not null!');
									 return false;
								 }
								 return true;
							 });
						}
//				    	if(!versionview.tableName || versionview.tableName === 'SCENARIO'){
//				    		DigiCompass.Web.app.assembleListView.saveAsBtnHandler
//				    	}
				    }
				},*/{
					xtype:'button',
					text: 'Delete',
					iconCls : 'icon-delete',
					handler : function() {
						var sels = getSelection();
						if(sels.length===0){
							alertWarring('Please select a record!');
						}else{
							alertOkorCancel('Are you sure to delete selected '+versionview.getVersionTitle()+'?',function(e){
								if(e == 'yes'){
									if(!versionview.tableName || versionview.tableName === 'SCENARIO'){
										var ids = [];
										for(var key in sels){
											ids.push(sels[key].id);
										}
										DigiCompass.Web.app.assembleListView.scenarioDel(ids);
									}
								}
							});
						}
						
						/*if(!versionview.tableName || versionview.tableName === 'SCENARIO'){
							//var sledChk = Ext.select('.chk_cls:checked');
							//var count = sledChk.getCount();		
							var scenarioListView = Ext.getCmp("scenarioViewId").objectExplorer;
							var selModels = scenarioListView.getSelectionModel().getSelection();							
							if(selModels.length == 0){
								Ext.Msg.alert('Warning','Please select a record!');
							}else{
								var scenarioIds = new Array();
								for(var i in selModels){
									scenarioIds.push(selModels[i].get("id"));
								}
								alertOkorCancel('Are you sure to delete selected scenario?',function(e){
									if(e == 'yes'){
										DigiCompass.Web.app.assembleListView.scenarioDel(scenarioIds);
									}
								});
							}
						}*/
					}
				}];
				if(type === 'versionView'){
					items.push({
						text:'Back',
				        handler : function(){
				        	Ext.getCmp('scenarioExplorer').setRootNode({});
				        	Ext.getCmp('scenarioExplorer').show();
				        	Ext.getCmp('versionView').hide();
				        	if(Ext.getCmp('scenarioViewId').getCataloguePanelVisible()){
				        		Ext.getCmp('obj-cat').show();
				        	}
				        	
				        	DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(versionview.tableName || 'SCENARIO',{
								planningCycleId: versionview.planningCycleId,
				    			scenarioId:  versionview.scenarioId,
				    			siteGroupId:  versionview.siteGroupId,
				    			technologyId:  versionview.technologyId,
				    			siteGroupPlannedId:  versionview.siteGroupPlannedId,
				    			versionId:  versionview.versionId,
				    			load: true
							}, false);
				        }
					});
				}else{
					items.push({
						xtype:'button',
						text: 'Version',
						iconCls : 'icon-delete',
						handler : function() {
							DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(versionview.tableName || 'SCENARIO',{
								planningCycleId: versionview.planningCycleId,
				    			scenarioId:  versionview.scenarioId,
				    			siteGroupId:  versionview.siteGroupId,
				    			technologyId:  versionview.technologyId,
				    			siteGroupPlannedId:  versionview.siteGroupPlannedId,
				    			versionId:  versionview.versionId,
				    			load: true
							});
						}
					});
				}
				var tbar =  Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:items
				});
				
				return tbar;
			}
			versionview.hide();
			versionview.addDocked(getTbar('versionView'));
			objectExplorer.addDocked(getTbar());
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			objectExplorer.addListener('itemclick', function(grid , record , item , index, event ,eOpts){
				var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
				if(isChecked){
					return;
				}
				if(Ext.isEmpty(record.data.id)){
					return;
				}
				DigiCompass.Web.app.assembleListView.clickHandler(record.data);
			});
			versionview.onInitVersionView = function(){
				this.versionView.addListener('itemclick', function(grid , record , item , index,e,eOpts){
					DigiCompass.Web.app.assembleListView.clickHandler(record.data);
				});
			}
			/*
			var grid = Ext.create('Ext.grid.Panel', {
				id : 'scenarioViewId',
				title : 'Scenario',
				store : store,
				verticalScrollerType: 'paginggridscroller',
		        loadMask: true,
		        disableSelection: true,
		        invalidateScrollerOnRefresh: false,
		        viewConfig: {
		            trackOver: false
		        },
			//	selModel : sm,
				height : 705,
//				tbar : {xtype: 'container',items: [tbar,tbar2]},
				tbar : tbar2,
				columns : columns,
				listeners : {
					afterlayout : function(current,layout,eOps){
//						var t = data;
//						if(scenarioId){
//						grid.getSelectionModel().select(1,true);
//							clickHandler(scenarioId);
//						}
					} 
				}
			});
			grid.addListener('itemclick', function(grid , record , item , index,e,eOpts){
//				clickHandler(record.data);
				DigiCompass.Web.app.assembleListView.clickHandler(record.data);
			});
			*/
//			function clickHandler(data){}
//			DigiCompass.Web.app.assembleListView.clickHandler(data);
			
			/*var objExpPanel = Ext.getCmp('obj-exp');
			if(objExpPanel){
				objExpPanel.add(grid);
			}*/
		}
	};
	
	DigiCompass.Web.app.assembleListView.clickHandler = function(data){
		if(event.target.type == 'button'){
			return;
		}
		if(data.tableName && data.tableName != 'SCENARIO'){
			if(data.current){
				return;
			}
			var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
			if (!scenarioCenterPanel) {
				Ext.getCmp('obj-details').removeAll();
			}
			DigiCompass.Web.UI.Wheel.showDetail();
			var obj = {
				planningCycleId : data.planningCycleId,
				scenarioId : data.scenarioId,
				siteGroupId : data.siteGroupId,
				technologyId : data.technologyId,
				versionId : data.versionId,
    			siteGroupPlannedId:  data.siteGroupPlannedId,
				dragVersionId : null,
				tableName : data.tableName,
				id : data.id || data.versionId,
				showNavigation : true,
				edit : true,
				versionName : data.versionName
			}
			var scenarioCenterPanel = DigiCompass.Web.UI.Scenario.createScenarioCenterPanel(obj);
			Ext.getCmp('obj-details').add(scenarioCenterPanel);
		}else{
			data.scenarioId = data.id;
			data.scenarioName = data.versionName;
			
			
			
			var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
			if (!scenarioCenterPanel) {
				Ext.getCmp('obj-details').removeAll();
			}
			// 灞曠ず鍙宠竟闈㈡澘
			DigiCompass.Web.UI.Wheel.showDetail();
			// 灞曠幇鍙宠竟鐨凱anel
			// var scenarioCenterPanel =
			// DigiCompass.Web.UI.createRightPanelFunction();
			var scenarioCenterPanel = DigiCompass.Web.UI.Scenario.createScenarioCenterPanel(data);
			Ext.getCmp('obj-details').add(scenarioCenterPanel);
			// Ext.getCmp('obj-details').setTitle(DigiCompass.Web.app.navigationBar.setObjectDetail('Scenario'));
			// Ext.getCmp('obj_details_tbar').removeAll();
			// Ext.getCmp('obj_details_tbar').add(DigiCompass.Web.app.navigationBar.setNavigationBar('Scenario',true,setV,data));

			// 鍒涘缓鎷栧姩DropTarget
			DigiCompass.Web.app.assembleListView.createDropTarget(scenarioCenterPanel);

			// 鍒锋柊鏁版嵁
			DigiCompass.Web.UI.CometdPublish.scenarioPublishByScenarioId(data.scenarioId);
		}
	}
	
	function setV(){
		console.log('test');
	}
	
	DigiCompass.Web.app.assembleListView.createDropTarget = function(scenarioCenterPanel){
		var centerPanelDropTargetEl =  scenarioCenterPanel.body.dom;
	    Ext.create('Ext.dd.DropTarget', centerPanelDropTargetEl, {
	        ddGroup: 'gridDDGroup',
	        notifyEnter: function(){
	        	//楂樹寒鏁堟灉鏃犳晥锛屽洜涓虹粍寤鸿鍏跺畠缁勫缓缁欓伄浣忎簡
	        	scenarioCenterPanel.body.highlight();
	        },
	        notifyDrop: function(ddSource, e, data){
	        	var records = data.records;
	        	if(records && records.length > 0 && records[0]){
	        		var record = records[0];
	        		var raw = record.raw;
//	        		PlaningCycle:"NEXT 3 YEAR",planningCycleId:"02",Technology:"2G",technologyId:"02",Version:"TestByAray20121019",versionId:""
	        		
	        		if(!raw.canDrag){
	        			return false;
	        		}
	        		
	        		if(!raw.versionId){
	        			alertWarring('Please select a valid version!');
	        			return true;
	        		}
	        		
	        		var activeTab = Ext.getCmp('main_tab').getActiveTab();
	        		var scenarioId = '';
	        		var gridId = '';
	            	if(activeTab){
//	            		outerTabPanelIdb95ace72-31d2-4fd6-995f-95846a871eff
	            		scenarioId = activeTab.id.substr(15);
//	            		reversalPanel_MOD_SUBSCRIBER_QUANTITY_ID04acc5ce-38f6-454b-974d-a1c7df6ef2507d176831-abbf-4706-aea6-54da157f3197
//	            		var reversalPanel = activeTab.items.items[0];
//	            		if(reversalPanel){
//	            			gridId = reversalPanel.id.substr(14);
//	            		}
	            		if(activeTab.title.indexOf('Scenario')<0){
	            			return false;
	            		}
	            	}else{
	            		return false;
	            	}
	            	
	            	//Check
	            	var checkPassed = DigiCompass.Web.app.assembleListView.checkDrag(raw,scenarioId);
	            	if(!checkPassed){
	            		return false;
	            	}
	            	
	        		alertOkorCancel('Are you sure to use the vesion ?',function(e){
	    				if(e == 'yes'){
	    					DigiCompass.Web.UI.moveAndInitGrid(raw,scenarioId);
	    				}else{
	    					return false;
	    				}
	    			});
	        	}
	            return true;
	        }
	    });
	}
	
	DigiCompass.Web.app.assembleListView.checkDrag = function(raw,scenarioId){
		var gridId = DigiCompass.Web.UI.Cmp.TableName.getGridIdByTableName(raw.tableName);
    	gridId += scenarioId;
		var tempGridData = DigiCompass.Web.app.assembleGrid.getAssembleGridDataFromArray(gridId);

		//check planningCycle
		var checkPC = DigiCompass.Web.UI.Cmp.TableName.checkPlanningCycle(raw.tableName);
		var checkSG = DigiCompass.Web.UI.Cmp.TableName.checkSiteGroup(raw.tableName);
		if(raw.tableName === 'TRAFFIC_SITELOAD_CALCULATING_PERIOD'){
			return true;
		}
		if('TB_STG_SPEC_REGION_DIST' === raw.tableName || 'TB_STG_COV_SITE_BUILD_QTY' === raw.tableName){
			if(!tempGridData || !tempGridData.argumentDatas){
				return false;
			}
			if(raw.planningCycleId 
					&& tempGridData.argumentDatas.planningCycleId != raw.planningCycleId
					|| raw.siteGroupId 
					&& tempGridData.argumentDatas.siteGroupId != raw.siteGroupId){
				alertWarring('Only same planningCycle and same sitegroup version can be moved to scenario!');
				return false;
			}
		}else if(checkPC){
			if(!tempGridData || !tempGridData.argumentDatas){
				return false;
			}
			if(raw.planningCycleId && tempGridData.argumentDatas.planningCycleId != raw.planningCycleId){
				alertWarring('Only same planningCycle version can be moved to scenario!');
				return false;
			}
		}else if(checkSG){
			if(!tempGridData || !tempGridData.argumentDatas){
				return false;
			}
			if(raw.siteGroupId && tempGridData.argumentDatas.siteGroupId != raw.siteGroupId){
				alertWarring('Only same siteGroup version can be moved to scenario!');
				return false;
			}
		}	
		return true;
	}
	
	
	DigiCompass.Web.UI.moveAndInitGrid = function(raw,scenarioId){
    	var tableName = raw.tableName;
    	var panel = Ext.getCmp('main_tab').getActiveTab().items.getAt(0);
    	var id=panel.getId();
    	var oldVersionId = null;
    	if(id.split('-').length>=8){
    		oldVersionId = id.substring(id.length,id.length-36);
    	}
    	if(tableName == 'TB_STG_COST_BAND_UPGRADE'){
    		var arg = {};
    		arg.MODULE_TYPE = 'MOD_BAND_UPGRADE_COST';
    		arg.technologyId = raw.technologyId;
    		arg.siteGroupId = raw.siteGroupId;
    		arg.scenarioId = scenarioId;
    		arg.dragVersionId = raw.versionId;
    		arg.versionName = raw.Version;
    		arg.versionId=oldVersionId;
    		Digicompass.web.cmp.cost.bandUpgrade.dragRefresh(arg);
    	}else if(tableName == 'TB_STG_COST_CAPACITY_BUILD'){
    		//澶勭悊Cost鎷栨嫿
    		var arg = {};
    		arg.MODULE_TYPE = 'MOD_COST_CAPACITYBUILD';
    		arg.technologyId = raw.technologyId;
    		arg.siteGroupId = raw.siteGroupId;
    		arg.scenarioId = scenarioId;
    		arg.dragVersionId = raw.versionId;
    		arg.versionName = raw.Version;
    		arg.versionId=oldVersionId;
    		Digicompass.web.cmp.cost.costCapacityBuild.dragRefresh(arg);
    	}else if(tableName == "TB_STG_COST_COVERAGE_BUILD" || tableName == "TB_STG_COST_COVERAGE_UNPLANNED_BUILD"){
    		var arg = {};
    		arg.technologyId = raw.technologyId;
    		arg.siteGroupId = raw.siteGroupId;
    		arg.scenarioId = scenarioId;
    		arg.dragVersionId = raw.versionId;
    		arg.versionName = raw.Version;
    		arg.versionId=oldVersionId;
    		Digicompass.web.cmp.cost.costCoverageBuild.dragRefresh(arg, tableName === 'TB_STG_COST_COVERAGE_BUILD');
    	}else if(tableName == 'TB_STG_LAYER_DEFINITION'){
    		var arg = {};
    		arg.technologyId = raw.technologyId;
    		arg.scenarioId = scenarioId;
    		arg.dragVersionId = raw.versionId;
    		arg.versionName = raw.Version;
    		arg.versionId=oldVersionId;
    		Digicompass.web.cmp.layer.LayerDefainition.refreshLayerDefinitionGrid(arg, true);
    	}else if(tableName == 'TB_STG_LAYER_PRIORITY'){
    		var arg = {};
    		arg.technologyId = raw.technologyId;
    		arg.scenarioId = scenarioId;
    		arg.planningCycleId = raw.planningCycleId;
    		arg.dragVersionId = raw.versionId;
    		arg.versionName = raw.Version;
    		arg.versionId=oldVersionId;
    		Digicompass.web.cmp.layer.RegionLayer.refresh(arg, true);
    	}else if(tableName == 'TRAFFIC_SITELOAD_CALCULATING_PERIOD'){
    		var arg = {};
    		arg.scenarioId = scenarioId;
    		arg.dragVersionId = raw.versionId;
    		arg.versionId=oldVersionId;
    		DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodDragPublish(arg);
    	}else{
    		var gridId = DigiCompass.Web.UI.Cmp.TableName.getGridIdByTableName(tableName);
        	gridId += scenarioId;

        	if(gridId){
        		var tempGridData = DigiCompass.Web.app.assembleGrid.getAssembleGridDataFromArray(gridId);
            	//鑾峰彇瀵硅薄锛屾嬁Scenario
        		if(tempGridData){
        			//灏嗘嫋鍔ㄥ弬鏁伴厤缃埌鍏ㄥ眬鍙傛暟涓�
        			var dragVersionId = raw.versionId;
        			tempGridData.dragArgumentDatas.isDrag = true;
        			tempGridData.dragArgumentDatas.dragVersionId = dragVersionId;
        			tempGridData.dragArgumentDatas.tableName = tableName;
        			tempGridData.dragArgumentDatas.versionName = raw.Version;
        			//鎷栧姩鍚庢墽琛宲ublish
        			DigiCompass.Web.UI.CometdPublish.treeDragPublish(tableName,dragVersionId,tempGridData.argumentDatas,tempGridData.dragArgumentDatas);
        		}
        	}
    	}
    }
	
	
	//item click callback
	DigiCompass.Web.app.assembleListView.scenarioPublishByScenarioIdCallback = function(data){
//		var result = Ext.JSON.decode(data.BUSINESS_DATA);
//		var scenarioId = result.id;
//		var name = result.name;
//		var subject = result.subject;
//		var scenarioVersionLookups = result.scenarioVersionLookups;
//		//鏋勯�鍙傛暟瀵硅薄
//		var arguments = {};
//		arguments.scenarioId = scenarioId;
//		if(subject){
//			//鍒濆鍖栧彸杈硅緭鍏ユ
////			DigiCompass.Web.app.assembleListView.initNames(result);
//			arguments.planningCycleId = subject.planningCycle.id;
//			arguments.technologyId = subject.technology.id;
//			arguments.siteGroupId = subject.siteGroup.id;
//		}
//		
//		//灏哠cenario鐩稿叧淇℃伅瀛樹簬锛屽叏灞�彉閲弒cenarioDataArry涓�
//		var tempScenarioData = DigiCompass.Web.app.assembleListView.getScenarioDataArry(scenarioId);
//		if(tempScenarioData != null){
//			tempScenarioData.arguments = arguments;
//			tempScenarioData.scenarioVersionLookups = scenarioVersionLookups;
//		}else{
//			var scenario_obj = {};
//			scenario_obj.scenarioId = scenarioId;
//			scenario_obj.arguments = arguments;
//			scenario_obj.scenarioVersionLookups = scenarioVersionLookups;
//			scenarioDataArry.push(scenario_obj);
//		}
//		//鍒濆鍖栫偣鍑讳簨浠�
//		DigiCompass.Web.app.assembleListView.initClickHandlerEvent(scenarioId,arguments);
		
		
		var result = Ext.JSON.decode(data.BUSINESS_DATA);
		var scenarioId = result.id;
		var name = result.name;
//		var subject = result.subject;
//		var scenarioVersionLookups = result.scenarioVersionLookups;
		//鏋勯�鍙傛暟瀵硅薄
		var arguments = {};
		arguments.scenarioId = scenarioId;
//		if(subject){
			//鍒濆鍖栧彸杈硅緭鍏ユ
			arguments.planningCycleId = result.planningCycle.id;
			arguments.technologyId = result.technology.id;
			arguments.siteGroupId = result.siteGroup.id;
			arguments.siteGroupPlannedId = result.siteGroupPlanned ? result.siteGroupPlanned.id:null;
//		}
		
		//灏哠cenario鐩稿叧淇℃伅瀛樹簬锛屽叏灞�彉閲弒cenarioDataArry涓�
		var tempScenarioData = DigiCompass.Web.app.assembleListView.getScenarioDataArry(scenarioId);
		if(tempScenarioData != null){
			tempScenarioData.arguments = arguments;
			//update 2012-12-6 21:16
			tempScenarioData.scenario = result;
		}else{
			var scenario_obj = {};
			scenario_obj.scenarioId = scenarioId;
			scenario_obj.arguments = arguments;
			scenario_obj.scenario = result;
			scenarioDataArry.push(scenario_obj);
		}
		//鍒濆鍖栫偣鍑讳簨浠�
		DigiCompass.Web.app.assembleListView.initClickHandlerEvent(scenarioId,arguments);
	}
	
	DigiCompass.Web.app.assembleListView.initClickHandlerEvent = function(scenarioId,arguments){
//		var activeTabIdStr = 'centerBottomTabOneId' + scenarioId;
		var activeTabIdStr = 'centerBottomTabSixId' + scenarioId;
		var activeTab = Ext.getCmp('main_tab').getActiveTab();
		if(activeTab){
//			activeTabIdStr = activeTab.getActiveTab().id;
//			activeTabIdStr = activeTab.front.getActiveTab().id;
		}
		DigiCompass.Web.UI.Scenario.initGridDataByTab(activeTabIdStr,scenarioId,arguments);
	}
	
	
	DigiCompass.Web.app.assembleListView.initNames = function(scenario){
		var scenarioName = scenario.name;
		var subject = scenario.subject;
		var siteGroupName = subject.siteGroup.name;
		var planningCycleName = subject.planningCycle.name;
		var technologyName = subject.technology.name;
		Ext.getCmp("scenarioId").setValue(scenario.id);
		Ext.getCmp('scenarioNameId').setValue(scenarioName);
		Ext.getCmp('siteGroupNameId').setValue(siteGroupName);
		Ext.getCmp('planningCycleNameId').setValue(planningCycleName);
		Ext.getCmp('technologyNameId').setValue(technologyName);
	}
	
	DigiCompass.Web.app.assembleListView.cleanFormData = function(){
		if(Ext.getCmp('scenarioAddPanelId')){
			Ext.getCmp('scenarioAddPanelId').getForm().reset();
		}
	}
	
	// add a new scenario
	DigiCompass.Web.app.assembleListView.scenarioAdd = function(){
		var formPanel = Ext.getCmp('scenarioAddPanelId');
		if (formPanel) {
			DigiCompass.Web.app.assembleListView.cleanFormData();
			formPanel.show();
		} else {
			var saveBtn = Ext.create('Ext.Button',{
				text : 'save',
				iconCls:'icon-save',
				handler : function() {
					var form = formPanel.getForm();
					if (form.isValid()) {
						var formData = form.getValues();
						formData.MODULE_TYPE = 'MOD_SCENARIO';
						formData.COMMAND = 'COMMAND_SAVE';
						formData.SAVE_TYPE = 'SAVE';
						cometdfn.publish(formData);
						
					}
				}
			});
			
			var scenarioName = Ext.create('Ext.form.field.Text', {
				id : 'scenarioNameId',
				fieldLabel : 'Scenario Name',
				name : 'scenarioName',
				margin : '5 0 0 5',
				width : 450,
				allowBlank : false,
				maxLength : UiProperties.nameMaxLength
			});
			
			var siteGroupCombox = new DigiCompass.web.UI.ComboBox({
				tableName : 'tb_stg_site_group',
				id : 'siteGroupNameId',
				fieldLabel : 'SiteGroup',
				name : 'siteGroupId',
				margin : '5 0 0 5',
				width : 450,
				disabled : false,
				autoLoadByCometd : true,
				allowBlank : false
			});
			
			var technologyNameCombox = new DigiCompass.web.UI.ComboBox({
				tableName : 'tb_stg_technology',
				id : 'technologyNameId',
				fieldLabel : 'Technology',
				name : 'technologyId',
				margin : '5 0 0 5',
				width : 450,
				disabled : false,
				autoLoadByCometd : true,
				allowBlank : false,
				maxLength : 30
			});
			
			var planningCycleNameCombox = new DigiCompass.web.UI.ComboBox({
				tableName : 'tb_stg_planning_cycle',
				id : 'planningCycleNameId',
				fieldLabel : 'Planning Cycle',
				name : 'planningCycleId',
				margin : '5 0 0 5',
				width : 450,
				disabled : false,
				autoLoadByCometd : true,
				allowBlank : false
			});
			
			var plannedSiteGroupCOmbox = new DigiCompass.web.UI.ComboBox({
				tableName : 'TB_STG_PLANNED_SITE_GROUP',
				id : 'plannedSiteGroupId',
				fieldLabel : 'Panned Site Group',
				name : 'plannedSiteGroupId',
				margin : '5 0 0 5',
				width : 450,
				disabled : false,
				autoLoadByCometd : true,
				allowBlank : true,
				maxLength : 30
			});
			
			formPanel = Ext.create('Ext.form.Panel', {
				id : 'scenarioAddPanelId',
				defaultType : 'textfield',
				border : true,
				width : '100%',
				title : 'Object Detail - Scenario',
				frame : false,
				//layout : 'anchor',
				tbar : [saveBtn],
				fieldDefaults : {
					labelAlign : 'left',
					msgTarget : 'side',
					labelWidth : 120
				},
				items : [scenarioName, siteGroupCombox, technologyNameCombox, planningCycleNameCombox, plannedSiteGroupCOmbox]
			});
			
			Ext.getCmp("obj-details").removeAll();
			Ext.getCmp('obj-details').add(formPanel);
		}
	};
	DigiCompass.Web.app.assembleListView.scenarioDel = function(scenarioIds){
		var message = {};
		message.scenarioIds = scenarioIds;
		message.MODULE_TYPE = 'MOD_SCENARIO';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.publish(message);
	};
	DigiCompass.Web.app.assembleListView.scenarioDelCallback = function(data,Conf,fnName,command){
		var status = data.STATUS ;
		if(status === "success"){
			Ext.getCmp('obj-details').removeAll();
			
//			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
//			DigiCompass.Web.UI.CometdPublish.scenarioPublish(queryParam);
			alertSuccess('Delete Data Successful!');
			
			var versionView = Ext.getCmp('versionView');
			if (versionView.isVisible()) {
				DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(data.tableName || 'SCENARIO',{
	    			load: true
				});
			} else {
				var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
				DigiCompass.Web.UI.CometdPublish.scenarioPublish(queryParam);
			}
			
			
			
		}else if(data.customException){
			alertError(data.customException);
		}
	};
	DigiCompass.Web.app.assembleListView.scenarioAddCallback = function(data,Conf,fnName,command){
		var status = data.STATUS ;
		if(status === "success"){
			alertSuccess('Save data successful!');
			
			var result = Ext.JSON.decode(data.BUSINESS_DATA.result);
			var scenarioId = result.scenarioId;			
			//鏌ヨScenario
//			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
//			DigiCompass.Web.UI.CometdPublish.scenarioPublish(queryParam);	
			
//			DigiCompass.Web.app.assembleListView.cleanFormData();
			Ext.getCmp('obj-details').removeAll();
			
			
			var versionView = Ext.getCmp('versionView');
			if (versionView.isVisible()) {
				DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(data.tableName || 'SCENARIO',{
					planningCycleId: data.planningCycleId,
	    			scenarioId:  scenarioId,
	    			siteGroupId:  data.siteGroupId,
	    			technologyId:  data.technologyId,
	    			siteGroupPlannedId:  data.siteGroupPlannedId,
	    			versionId:  data.versionId,
	    			load: true
				});
			} else {
				var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
				DigiCompass.Web.UI.CometdPublish.scenarioPublish(queryParam);
			}
			
		}else if(data.customException){
			if(data.ERROR_CODE && (data.ERROR_CODE === 1001 || data.ERROR_CODE === 1002)){
				//TODO toback
//				Ext.getCmp("plannedSiteDetailPanel").toBack();
			}
			alertError(data.customException);
		}
			
	};
	DigiCompass.Web.app.assembleListView.scenarioSaveAsCallback = function(data,Conf,fnName,command){
		var status = data.STATUS ;
		if(status === "success"){
			Ext.getCmp('obj-details').removeAll();
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.scenarioPublish(queryParam);
			alertSuccess('Save As Data Successful!');
		}else if(data.customException){
			if(data.ERROR_CODE && (data.ERROR_CODE === 1001 || data.ERROR_CODE === 1002)){
				//TODO toback
//				Ext.getCmp("plannedSiteDetailPanel").toBack();
			}
			alertError(data.customException);
		}
	};
})();