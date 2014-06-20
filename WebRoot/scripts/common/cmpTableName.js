Ext.namespace('DigiCompass.Web.UI.Cmp.TableName');

(function(){
	
	DigiCompass.Web.UI.Cmp.TableName.getModuleTypeByTableName = function(tableName){
		switch(tableName){
			case 'TB_STG_DATA_QTY':return 'MOD_SUBSCRIBER_QUANTITY';
			case 'TB_STG_DATA_BH_KBPS':return 'MOD_DEMAND_BHKBPS';
			case 'TB_STG_DATA_BH_MERL':return 'MOD_DEMAND_BHMERL';
			case 'TB_STG_SPEC_REGION_DIST':return 'MOD_DEMAND_SPEC_REGION_DIST';
			case 'TB_STG_REGION_PROP':return 'MOD_DEMAND_REGION';
			case 'TB_STG_GLBOAL_PRO':return 'MOD_DEMAND_GLOBAL';
			case 'TB_STG_ACCE_OFFLOAD':return 'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD';
			case 'TB_STG_COV_SITE_BUILD_QTY':return 'MOD_COVERAGE_BUILD_QUANTITY';
			case 'TB_STG_COVERAGE_REGION_PROP':return 'MOD_COVERAGE_BUILD_REGION_PROPERTIES';
			default:return null;
		}
	}
	
	DigiCompass.Web.UI.Cmp.TableName.getGridIdByTableName = function(tableName){
		switch(tableName){
			case 'TB_STG_DATA_QTY':return 'MOD_SUBSCRIBER_QUANTITY_ID';
			case 'TB_STG_DATA_BH_KBPS':return 'MOD_DEMAND_BHKBPS_GRID_ID';
			case 'TB_STG_DATA_BH_MERL':return 'MOD_DEMAND_BHMERL_GRID_ID';
			case 'TB_STG_SPEC_REGION_DIST':return 'MOD_DEMAND_SPEC_REGION_DIST_ID';
			case 'TB_STG_REGION_PROP':return 'MOD_DEMAND_REGION_ID';
			case 'TB_STG_GLBOAL_PRO':return 'MOD_DEMAND_GLOBAL_ID';
			case 'TB_STG_ACCE_OFFLOAD':return 'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID';
			case 'TB_STG_COV_SITE_BUILD_QTY':return 'MOD_COVERAGE_BUILD_QUANTITY_ID';
			case 'TB_STG_COVERAGE_REGION_PROP':return 'MOD_COVERAGE_BUILD_REGION_PROPERTIES_ID';
			case 'TB_STG_COST_CAPACITY_BUILD':return 'MOD_COST_CAPACITYBUILD';
			case 'TB_STG_COST_COVERAGE_BUILD':return 'MOD_COST_COVERAGE_BUILD';
//			case 'TRAFFIC_SITELOAD_CALCULATING_PERIOD':return 'TRAFFIC_SITELOAD_CALCULATING_PERIOD';
			default:return null;
		}
	}
	
	DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId = function(id){
			var MOD_SUBSCRIBER_QUANTITY_ID = id.indexOf('MOD_SUBSCRIBER_QUANTITY_ID');
			var MOD_DEMAND_BHKBPS_GRID_ID = id.indexOf('MOD_DEMAND_BHKBPS_GRID_ID');
			var MOD_DEMAND_BHMERL_GRID_ID = id.indexOf('MOD_DEMAND_BHMERL_GRID_ID');
			var MOD_DEMAND_SPEC_REGION_DIST_ID = id.indexOf('MOD_DEMAND_SPEC_REGION_DIST_ID');
			var MOD_DEMAND_REGION_ID = id.indexOf('MOD_DEMAND_REGION_ID');
			var MOD_DEMAND_GLOBAL_ID = id.indexOf('MOD_DEMAND_GLOBAL_ID');
			var MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID = id.indexOf('MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID');
			var MOD_COVERAGE_BUILD_QUANTITY_ID = id.indexOf('MOD_COVERAGE_BUILD_QUANTITY_ID');
			var MOD_COVERAGE_BUILD_REGION_PROPERTIES_ID = id.indexOf('MOD_COVERAGE_BUILD_REGION_PROPERTIES_ID');
			if(MOD_SUBSCRIBER_QUANTITY_ID != -1){
				return 'TB_STG_DATA_QTY';
			}else if(MOD_DEMAND_BHKBPS_GRID_ID != -1){
				return 'TB_STG_DATA_BH_KBPS';
			}else if(MOD_DEMAND_BHMERL_GRID_ID != -1){
				return 'TB_STG_DATA_BH_MERL';
			}else if(MOD_DEMAND_SPEC_REGION_DIST_ID != -1){
				return 'TB_STG_SPEC_REGION_DIST';
			}else if(MOD_DEMAND_REGION_ID != -1){
				return 'TB_STG_REGION_PROP';
			}else if(MOD_DEMAND_GLOBAL_ID != -1){
				return 'TB_STG_GLBOAL_PRO';
			}else if(MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID != -1){
				return 'TB_STG_ACCE_OFFLOAD';
			}else if(MOD_COVERAGE_BUILD_QUANTITY_ID != -1){
				return 'TB_STG_COV_SITE_BUILD_QTY';
			}else if(MOD_COVERAGE_BUILD_REGION_PROPERTIES_ID != -1){
				return 'TB_STG_COVERAGE_REGION_PROP';
			}
			return '';
	}
	
	DigiCompass.Web.UI.Cmp.TableName.getGridTabIdByTableName = function(tableName){
		switch(tableName){
			case 'TB_STG_DATA_QTY':return 'centerBottomTabOneId';
			case 'TB_STG_DATA_BH_KBPS':return 'centerBottomTabOneId';
			case 'TB_STG_DATA_BH_MERL':return 'centerBottomTabOneId';
			case 'TB_STG_SPEC_REGION_DIST':return 'centerBottomTabOneId';
			case 'TB_STG_REGION_PROP':return 'centerBottomTabOneId';
			case 'TB_STG_GLBOAL_PRO':return 'centerBottomTabOneId';
			case 'TB_STG_ACCE_OFFLOAD':return 'centerBottomTabOneId';
			case 'TB_STG_COV_SITE_BUILD_QTY':return 'centerBottomTabFourId';
			case 'TB_STG_COVERAGE_REGION_PROP':return 'centerBottomTabFourId';
			default:return null;
		}
	}
	
	DigiCompass.Web.UI.Cmp.TableName.getGridPanelRenderIndexByGridId = function(gridId){
		switch(gridId){
			case 'MOD_SUBSCRIBER_QUANTITY_ID':return 0;
			case 'MOD_DEMAND_BHKBPS_GRID_ID':return 1;
			case 'MOD_DEMAND_BHMERL_GRID_ID':return 2;
			case 'MOD_DEMAND_SPEC_REGION_DIST_ID':return 3;
			case 'MOD_DEMAND_REGION_ID':return 4;
			case 'MOD_DEMAND_GLOBAL_ID':return 5;
			case 'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID':return 6;
			case 'MOD_COVERAGE_BUILD_QUANTITY_ID':return 1;
			case 'MOD_COVERAGE_BUILD_REGION_PROPERTIES_ID':return 2;
			default:return 0;
		}
	}
	
	DigiCompass.Web.UI.Cmp.TableName.checkPlanningCycle = function(tableName){
		switch(tableName){
			case 'TB_STG_DATA_QTY':return true;
			case 'TB_STG_DATA_BH_KBPS':return true;
			case 'TB_STG_DATA_BH_MERL':return true;
			case 'TB_STG_REGION_PROP':return true;
			case 'TB_STG_GLBOAL_PRO':return true;
			case 'TB_STG_ACCE_OFFLOAD':return true;
			default:return false;
		}
	}
	
	DigiCompass.Web.UI.Cmp.TableName.checkSiteGroup = function(tableName){
		switch(tableName){
			case 'TB_STG_COVERAGE_REGION_PROP':return true;
			case 'TB_STG_COST_BAND_UPGRADE':return true;
			case 'TB_STG_COST_CAPACITY_BUILD':return true;
			case 'TB_STG_COST_COVERAGE_BUILD':return true;
			default:return false;
		}
	}
		
	
})()