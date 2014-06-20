/*
 * 页面GridPanel实例:
 * 可以执行qty_template.jsp看效果。
 * */
Ext.require([ 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*' ]);
Ext.onReady(function() {
	//注册查询方法
	cometdfn.registFn({MODULE_TYPE:"MOD_SUBSCRIBER_QUANTITY",//该参数在publish时调用，指定某一个模块
		COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
		callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
		Conf:{//callbackfn回调方法对应的参数配置
			id:'MOD_SUBSCRIBER_QUANTITY_category',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
			divId:'grid-example',//该参数在测试的时候使用，渲染到指定div
			title:'Subscriber_QTYTechnology', //GridPanel 标题
			categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
			renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
			gridHeight:200,//GridPanel高度,该高度根据数据列表自己调整
			moduleTypeOfSaveOrUpdate:"MOD_SUBSCRIBER_QUANTITY",//必需传值:该参数在编辑时，publish调用，指定特定的模块
			commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
			isEditable:true,//是否支持GridPanel可编辑。默认为true
			formatConfig:{
				tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision,
				rowFormat:[{rowIndex:1,rowFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision}]
			}
		}
		});
	//监听更新
	cometdfn.registFn({MODULE_TYPE:"MOD_SUBSCRIBER_QUANTITY",
		COMMAND:'COMMAND_SAVE_BATCH',
		callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
		Conf:{
			moduleType:"MOD_SUBSCRIBER_QUANTITY",//必需传值
			command:'COMMAND_QUERY_GRID',//必需传值
		}
		});
	
	//监听删除
	cometdfn.registFn({MODULE_TYPE:"MOD_VERSION_MANAGER",
		COMMAND:'COMMAND_DEL',
		callbackfn :DigiCompass.Web.app.assembleGrid.dropBtnHandlerCallBack,
		Conf:{}
		});
	
	var datas = {};
	datas.versionId = '02';
//	DF62FD4F3D864131BBA8CB9BCC0AED06
	datas.planningCycleId = '02';
	datas.scenarioId = '02';
	datas.technologyId = '02';
	datas.siteGroupId = '01';
	
	DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_SUBSCRIBER_QUANTITY','COMMAND_QUERY_GRID',datas);	
	
	
	
	
//	/*彭国用*/
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHKBPS",//该参数在publish时调用，指定某一个模块
//		COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//		callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//		Conf:{//callbackfn回调方法对应的参数配置
//			id:'MOD_DEMAND_BHKBPS_GRID_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//			divId:'grid-example2',//该参数在测试的时候使用，渲染到指定div
//			title:'BH Kbps per Subscriber', //GridPanel 标题
//			categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//			renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//			gridHeight:155,//GridPanel高度,该高度根据数据列表自己调整
//			moduleTypeOfSaveOrUpdate:"MOD_DEMAND_BHKBPS",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//			commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//			isEditable:true//是否支持GridPanel可编辑。默认为true
//		}
//		});
//	
//	//监听更新
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHKBPS",
//		COMMAND:'COMMAND_SAVE_BATCH',
//		callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
//		Conf:{
//			moduleType:"MOD_DEMAND_BHKBPS",//必需传值
//			command:'COMMAND_QUERY_GRID',//必需传值
//		}
//		});
//	
//	
//	
//	var modDemandBHKBPS = {};
//	modDemandBHKBPS.versionId = '';
////	modDemandBHKBPS.versionId = '03';
//	modDemandBHKBPS.planningCycleId = '02';
//	modDemandBHKBPS.scenarioId = '02';
//	modDemandBHKBPS.technologyId = '02';
//	modDemandBHKBPS.siteGroupId = '02'; 
//	DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_BHKBPS','COMMAND_QUERY_GRID',modDemandBHKBPS);
//	
//	
//	
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHMERL",//该参数在publish时调用，指定某一个模块
//		COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//		callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//		Conf:{//callbackfn回调方法对应的参数配置
//			id:'MOD_DEMAND_BHMERL_GRID_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//			divId:'grid-example3',//该参数在测试的时候使用，渲染到指定div
//			title:'BH mErl per Subscriber', //GridPanel 标题
//			categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//			renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//			gridHeight:135,//GridPanel高度,该高度根据数据列表自己调整
//			moduleTypeOfSaveOrUpdate:"MOD_DEMAND_BHMERL",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//			commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//			isEditable:true//是否支持GridPanel可编辑。默认为true
//		}
//		});
//	
//	//监听更新
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHMERL",
//		COMMAND:'COMMAND_SAVE_BATCH',
//		callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
//		Conf:{
//			moduleType:"MOD_DEMAND_BHMERL",//必需传值
//			command:'COMMAND_QUERY_GRID',//必需传值
//		}
//		});
//	
//	var demandBHMERL = {};
//	demandBHMERL.versionId = '';
////	demandBHMERL.versionId = '02';
//	demandBHMERL.planningCycleId = '02';
//	demandBHMERL.scenarioId = '02';
//	demandBHMERL.technologyId = '02';
//	demandBHMERL.siteGroupId = '02';
//	DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_BHMERL','COMMAND_QUERY_GRID',demandBHMERL);
//	
//	
//	
//	
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_SPEC_REGION_DIST",//该参数在publish时调用，指定某一个模块
//		COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//		callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//		Conf:{//callbackfn回调方法对应的参数配置
//			id:'MOD_DEMAND_SPEC_REGION_DIST_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//			divId:'grid-example4',//该参数在测试的时候使用，渲染到指定div
//			title:'Spectrum Region Demand Distribution', //GridPanel 标题
//			categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//			renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//			gridHeight:135,//GridPanel高度,该高度根据数据列表自己调整
//			moduleTypeOfSaveOrUpdate:"MOD_DEMAND_SPEC_REGION_DIST",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//			commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//			isEditable:true//是否支持GridPanel可编辑。默认为true
//		}
//		});
//	//监听更新
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_SPEC_REGION_DIST",
//		COMMAND:'COMMAND_SAVE_BATCH',
//		callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
//		Conf:{
//			moduleType:"MOD_DEMAND_SPEC_REGION_DIST",//必需传值
//			command:'COMMAND_QUERY_GRID',//必需传值
//		}
//		});
//	
//	var demandSpecRegionDist = {};
//	demandSpecRegionDist.versionId = '';
////	demandSpecRegionDist.versionId = '04';
//	demandSpecRegionDist.planningCycleId = '02';
//	demandSpecRegionDist.scenarioId = '02';
//	demandSpecRegionDist.technologyId = '02';
//	demandSpecRegionDist.siteGroupId = '02'; 
//	DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_SPEC_REGION_DIST','COMMAND_QUERY_GRID',demandSpecRegionDist);
//	
//	
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_REGION",
//		COMMAND:'COMMAND_QUERY_GRID',
//		callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
//		Conf:{
//			id:'MOD_DEMAND_REGION_ID',
//			divId:'grid-example5',//该参数在测试的时候使用，渲染到指定div
//			title:'Region Properties',
//			renderCmp:'centerBottomTabOneId',
//			categoryLen:1,
//			gridHeight:175,
//			moduleTypeOfSaveOrUpdate:"MOD_DEMAND_REGION",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//			commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//			isEditable:true//是否支持GridPanel可编辑。默认为true
//		}
//		});
//	
//	//监听更新
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_REGION",
//		COMMAND:'COMMAND_SAVE_BATCH',
//		callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
//		Conf:{
//			moduleType:"MOD_DEMAND_REGION",//必需传值
//			command:'COMMAND_QUERY_GRID',//必需传值
//		}
//		});
//	
//	var demandRegion = {};
////	demandRegion.versionId = '39A2F3733C9F444FB6637F9731863C54';
//	demandRegion.versionId = '';
//	demandRegion.planningCycleId = '02';
//	demandRegion.scenarioId = '01';
//	demandRegion.technologyId = '05';
//	demandRegion.siteGroupId = '01';
//	
//	DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_REGION','COMMAND_QUERY_GRID',demandRegion);
//	
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_GLOBAL",
//		COMMAND:'COMMAND_QUERY_GRID',
//		callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
//		Conf:{
//			id:'MOD_DEMAND_GLOBAL_ID',
//			divId:'grid-example6',//该参数在测试的时候使用，渲染到指定div
//			title:'Global Properties', 
//			renderCmp:'centerBottomTabOneId',
//			categoryLen:1,
//			gridHeight:155,
//			moduleTypeOfSaveOrUpdate:"MOD_DEMAND_GLOBAL",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//			commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//			isEditable:true//是否支持GridPanel可编辑。默认为true
//		}
//		});
//	//监听更新
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_GLOBAL",
//		COMMAND:'COMMAND_SAVE_BATCH',
//		callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
//		Conf:{
//			moduleType:"MOD_DEMAND_GLOBAL",//必需传值
//			command:'COMMAND_QUERY_GRID',//必需传值
//		}
//		});
//	
//	
//	var demandGlobal = {};
//	 demandGlobal.versionId = '';
////	 demandGlobal.versionId = '06';
//	 demandGlobal.planningCycleId = '02';
//	 demandGlobal.scenarioId = '01';
//	 demandGlobal.technologyId = '01';
//	 demandGlobal.siteGroupId = '01';
//	DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_GLOBAL','COMMAND_QUERY_GRID',demandGlobal);
//	
//	
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",
//		COMMAND:'COMMAND_QUERY_GRID',
//		callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
//		Conf:{
//			id:'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID',
//			divId:'grid-example7',
//			title:'Web Accelerator Offload', 
//			renderCmp:'centerBottomTabOneId',
//			categoryLen:1,
//			gridHeight:100,
//			moduleTypeOfSaveOrUpdate:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//			commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//			isEditable:true//是否支持GridPanel可编辑。默认为true
//		}
//		});
//	
//	cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",
//		COMMAND:'COMMAND_SAVE_BATCH',
//		callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
//		Conf:{
//			moduleType:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",//必需传值
//			command:'COMMAND_QUERY_GRID',//必需传值
//		}
//		});
//	
//	var demandWebAcceleratorOffload = {};
//	demandWebAcceleratorOffload.versionId = '';
//	demandWebAcceleratorOffload.planningCycleId = '02';
//	demandWebAcceleratorOffload.scenarioId = '01';
//	demandWebAcceleratorOffload.technologyId = '01';
//	demandWebAcceleratorOffload.siteGroupId = '01';
//	DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD','COMMAND_QUERY_GRID',demandWebAcceleratorOffload);
});
