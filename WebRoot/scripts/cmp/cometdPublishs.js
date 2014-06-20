Ext.namespace('DigiCompass.Web.UI.CometdPublish');

(function(){

	DigiCompass.Web.UI.CometdPublish.scenarioPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_SCENARIO',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam});
	}
	
	DigiCompass.Web.UI.CometdPublish.scenarioPublishByScenarioId = function(scenarioId){
		cometdfn.publish({MODULE_TYPE : 'MOD_SCENARIO',COMMAND : 'COMMAND_QUERY_INFO',id : scenarioId});
	}
	//TODO portfolio
	DigiCompass.Web.UI.CometdPublish.portfolioPublishByPortfolioId = function(portfolioId){
		cometdfn.publish({MODULE_TYPE : 'MOD_PORTFOLIO',COMMAND : 'COMMAND_QUERY_INFO',id : portfolioId});
	}
	DigiCompass.Web.UI.CometdPublish.planningCyclePublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_PLANNING_CYCLE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.siteGroupPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_SITE_GROUP',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.equipmentTemplatePublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.equipmentRelationPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',COMMAND : 'COMMAND_QUERY_COMBOX_LIST'});
		cometdfn.publish({MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.equipmentTemplateTreePublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',COMMAND : 'COMMAND_EQUIPMENT_TEMPLATE_TREE',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.equipmentTypeTreePublish = function(args){
		cometdfn.publish({MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',COMMAND : 'COMMAND_EQUIPMENT_TYPE_TREE',
			id:args.id,
			parentId:args.parentId,
			HANDLER_TYPE:args.HANDLER_TYPE,
			_isNew:args._isNew,
			_defaultValue:args._defaultValue
		});
	}
	
	DigiCompass.Web.UI.CometdPublish.equipmentTemplateV2Publish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',COMMAND : 'COMMAND_QUERY_TREE',"SPACE":'enter',queryParam:queryParam });
	}
	
	DigiCompass.Web.UI.CometdPublish.plannedSiteGroupPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.plannedSitePublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'PLANNED_SITE_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.resourceTypePublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'RESOURCE_TYPE_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.resourcePublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'RESOURCE_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.workFlowTemplate = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.resourceMSA = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'RESOURCE_MASTER_SERVICE_AGREEMENT',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	};
	DigiCompass.Web.UI.CometdPublish.SnapshotVersioinPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_SNAPSHOT_VERSION',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.spectrumRegionPublish = function(queryParam){
		//TODO spectrumRegion
		cometdfn.publish({MODULE_TYPE : 'MOD_SPECTRUM_REGION',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.financialCategoryType = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY_TYPE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.financialCategory = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_COMBOX_LIST'});
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_TECHNOLOGY_LIST'});
		//cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_PORTFOLIO_LIST'});
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_SITE_TYPE_LIST'});
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_REGION_LIST'});
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_POLYGON_LIST'});
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_STATE_LIST'});
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.workFlowCategoryType = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_WORK_FLOW_CATEGORY_TYPE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.workFlowCategory = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_WORK_FLOW',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.financialCostDistribution = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_COST_DISTRIBUTION',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	
	DigiCompass.Web.UI.CometdPublish.changeRequest = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : null, queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.changeApprove = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : "STATUS_CHANGEREQUEST", queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.changeRelease = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : "STATUS_APPROVED", queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.changeAccept = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : "STATUS_VENDERED", queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.changeCancel = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : "STATUS_CHANGE_CANCEL", queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.releaseManager = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : "STATUS_CHANGE_RELEASEMANAGER", queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.releaseOperationApprove = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : "STATUS_CANCEL", queryParam:queryParam , reqType:'cancel'});
	}
	DigiCompass.Web.UI.CometdPublish.completeApprove = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',status : "STATUS_COMPLATED", queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.createCRReport = function(moduleType, command, getTitle, queryParam){
		new DigiCompass.Web.app.ui.CommonReport({
			getTitle : getTitle,
			explorerModuleCfg : {
				moduleType : moduleType,
				command : command,
				param : Ext.applyIf({report:false}, queryParam||{})
			},detailModuleCfg:{
				moduleType : moduleType,
				command : command,
				param : Ext.applyIf({report:true}, queryParam||{})
			}
		});
	}
	DigiCompass.Web.UI.CometdPublish.changeRequestCountReport = function(queryParam){
		new DigiCompass.Web.app.planning.grid.ChangeRequestReport({
			getTitle : function(record){
				return 'Change Request Report'+(record ? '('+record.get('name')+')' : '');
			},
			explorerModuleCfg : {
				moduleType : 'MOD_REPORT_CHANGE_REQUEST',
				command : 'REPORT_SNAPSHOT_LIST',
				reportKey : 'CHANGEREQUEST_COUNT',
				param : Ext.applyIf({reportKey : 'CHANGEREQUEST_COUNT'}, queryParam||{})
			},detailModuleCfg:{
				moduleType : 'MOD_REPORT_CHANGE_REQUEST',
				command : 'CHANGEREQUEST_COUNT_REPORT_SNAP',
				buildCommand : 'CHANGEREQUEST_COUNT_REPORT',
				saveCommand : 'SAVE_CHANGEREQUEST_COUNT_REPORT_SNAP'
			}
		});
	}
	DigiCompass.Web.UI.CometdPublish.serviceCountReport = function(queryParam){
		new DigiCompass.Web.app.planning.grid.ChangeRequestReport({
			getTitle : function(record){
				return 'Change Request Report'+(record ? '('+record.get('name')+')' : '');
			},
			explorerModuleCfg : {
				moduleType : 'MOD_REPORT_CHANGE_REQUEST',
				command : 'REPORT_SNAPSHOT_LIST',
				reportKey : 'SERVICE_COUNT',
				param : Ext.applyIf({reportKey : 'SERVICE_COUNT'}, queryParam||{})
			},detailModuleCfg:{
				moduleType : 'MOD_REPORT_CHANGE_REQUEST',
				command : 'SERVICE_COUNT_REPORT_SNAP',
				buildCommand : 'SERVICE_COUNT_REPORT',
				saveCommand : 'SAVE_SERVICE_COUNT_REPORT_SNAP'
			}
		});
	}
	DigiCompass.Web.UI.CometdPublish.crSiteHistoryReport = function(queryParam){
		DigiCompass.Web.UI.CometdPublish.createCRReport('MOD_REPORT_CHANGE_REQUEST','COMMAND_QUERY_SITE_REPORT', 
				function(record){
			return 'Site Change Request History Report'+'('+record.get('site.name')+')';
		}, queryParam);
	}
	DigiCompass.Web.UI.CometdPublish.crSiteActiveReport = function(queryParam){
		DigiCompass.Web.UI.CometdPublish.createCRReport('MOD_REPORT_CHANGE_REQUEST','COMMAND_QUERY_SITE_ACTIVE_REPORT', 
				function(record){
					return 'Site Change Request Active Report'+'('+record.get('site.name')+')';
				},  queryParam);
	}
	DigiCompass.Web.UI.CometdPublish.crProjectActiveReport = function(queryParam){
		DigiCompass.Web.UI.CometdPublish.createCRReport('MOD_REPORT_CHANGE_REQUEST','COMMAND_QUERY_PROJECT_ACTIVE_REPORT',
				function(record){
					return 'Project Change Request Active Report'+'('+record.get('name')+')';
				}, queryParam);
	}
	DigiCompass.Web.UI.CometdPublish.crProjectFinalcialReport = function(queryParam){
		DigiCompass.Web.UI.CometdPublish.createCRReport('MOD_REPORT_CHANGE_REQUEST','COMMAND_QUERY_PROJECT_FINANCIAL_REPORT', 
				function(record){
					return 'Project Change Request Financial Report'+'('+record.get('name')+')';
				}, queryParam);
	}
	
	DigiCompass.Web.UI.CometdPublish.equipmentType = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.treeDragPublish = function(tableName,dragVersionId,argumentDatas,dragArgumentDatas){
		var moduleType = DigiCompass.Web.UI.Cmp.TableName.getModuleTypeByTableName(tableName);
		if(moduleType){
			cometdfn.publish({MODULE_TYPE : moduleType ,COMMAND : 'COMMAND_QUERY_DRAG_GRID',
						  dragVersionId : dragVersionId,
						  versionId:argumentDatas.versionId,
						  planningCycleId: argumentDatas.planningCycleId,
						  scenarioId:argumentDatas.scenarioId,
						  technologyId:argumentDatas.technologyId,
						  siteGroupId:argumentDatas.siteGroupId,
						  dragArgumentDatas:dragArgumentDatas,
						  versionName: dragArgumentDatas.versionName
						  });
		}
	}
	
	DigiCompass.Web.UI.CometdPublish.getVersionDataPublish = function(tableName, param, toVersion){
		var versionView = Ext.getCmp('versionView');
		var oldTableName = versionView.tableName || 'SCENARIO';
		toVersion = (toVersion !== false);
		param = param || {};
		param.MODULE_TYPE = 'MOD_VERSION_MANAGER';
		param.COMMAND='COMMAND_QUERY_ALL_TREE';
		param.tableName = tableName;
		param.load = true;
		
		var scenarioExplorer = Ext.getCmp('scenarioExplorer');
		var selections = scenarioExplorer.getSelectionModel().getSelection();
		versionView.selections = [];
		for(var key in selections){
			versionView.selections.push(selections[key].getData().versionId || selections[key].getData().id);
		}
		versionView.loadData(param, function(){
			if(toVersion || versionView.isVisible()){
				this.showView(param);
				scenarioExplorer.hide();
				Ext.getCmp('obj-cat').hide();
//				if(param.tableName!=oldTableName){
					var tmp = this.toGrid(param);
					if(tmp){
						Ext.getCmp('scenarioViewId').reconfigure(tmp.data, tmp.columns);
					}
//				}
			}else{
				var tmp = this.toGrid(param);
				if(tmp){
					Ext.getCmp('scenarioViewId').reconfigure(tmp.data, tmp.columns);
				}
				scenarioExplorer.show();
			}
		});
		
	}
	
	DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodPublish = function(versionId,scenarioId,datas){
		cometdfn.publish({
				MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
				COMMAND : 'COMMAND_QUERY_GRID',
				versionId : versionId,
				scenarioId : scenarioId,
				renderCmp : datas.renderCmp,
				
				planningCycleId: datas.planningCycleId,
				technologyId:datas.technologyId,
				siteGroupId:datas.siteGroupId,
				siteGroupPlannedId:datas.siteGroupPlannedId,
				showNavigation : datas.showNavigation || false,
				tableName : datas.tableName,
				id : datas.id
			});
	}
	
	DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodRemovePublish = function(versionId,scenarioId){
		cometdfn.publish({
				MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
				COMMAND : 'COMMAND_DEL',
				versionId : versionId,
				scenarioId : scenarioId
			});
	}
	
	DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodDragPublish = function(args){
		cometdfn.publish({
				MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
				COMMAND : 'COMMAND_QUERY_DRAG_GRID',
				dragVersionId : args.dragVersionId,
				scenarioId : args.scenarioId
			});
	}
	
	DigiCompass.Web.UI.CometdPublish.technologyPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_TECHNOLOGY',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	//TODO portfolio
	DigiCompass.Web.UI.CometdPublish.portfolioPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_PORTFOLIO',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	//TODO Bug
	DigiCompass.Web.UI.CometdPublish.bugPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_BUG',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
//	DigiCompass.Web.UI.CometdPublish.bugPublish = function(queryParam){
//		cometdfn.publish({MODULE_TYPE : 'MOD_BUG',COMMAND : 'COMMAND_BUG_GETUSERNAME',queryParam:queryParam });
//	}
	
	DigiCompass.Web.UI.CometdPublish.polygonPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_POLYGON',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	
	DigiCompass.Web.UI.CometdPublish.statePublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_STATE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.rolePublish = function(queryParam){
		cometdfn.request({MODULE_TYPE : 'ROLE_DEFINITION_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam }, DigiCompass.Web.app.roleDefinition.getListData);
	}
	DigiCompass.Web.UI.CometdPublish.userMgtPublish = function(queryParam){
		cometdfn.request({MODULE_TYPE : 'USER_MANAGE_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam }, DigiCompass.Web.app.userMgt.getListData);
	}
	DigiCompass.Web.UI.CometdPublish.userGroupMgtPublish = function(queryParam){
		cometdfn.request({MODULE_TYPE : 'USER_GROUP_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam }, DigiCompass.Web.app.userGroupMgt.getListData);
	}
	DigiCompass.Web.UI.CometdPublish.vendorMgtPublish = function(queryParam){		
		cometdfn.publish({MODULE_TYPE : 'MOD_VENDOR',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.vendorOperationPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'MOD_VENDOR',COMMAND : 'QUERY_CHANGE_REQUEST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.sapOrderPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'SAP_ORDER_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	DigiCompass.Web.UI.CometdPublish.borisOrderPublish = function(queryParam){
		cometdfn.publish({MODULE_TYPE : 'BORIS_ORDER_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
	}
	
})();

