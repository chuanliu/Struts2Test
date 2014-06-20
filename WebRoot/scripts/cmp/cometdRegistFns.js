Ext.namespace('DigiCompass.Web.UI.CometdRegistFns');

(function(){
	
	DigiCompass.Web.UI.CometdRegistFns.overrideCreateEditFunOfRegionLayer = function(){
		return {
			xtype: 'textfield',
//			allowBlank: false,
			listeners: {  
				blur: function(e,editor){
					//焦点移开后，会将更新的值放于全局变量中
					var tempValue = Ext.util.Format.trim(e.value);
//					if(Ext.isEmpty(tempValue)){
//						alertWarring("Please input a data!");
//						return;
//					}else 
					
//					if(!Ext.isEmpty(tempValue) && !DigiCompass.Web.app.assembleGrid.checkDoubleType(tempValue)){
//						alertWarring("Please input a valid data!");
//						e.setValue('');
//						return;
//					}
					var isValid = false;
					var layerId = '';
					//从Layer Define中获取已经存在的值
					var layerDefine = Ext.getCmp('layerDefinition');
					if(layerDefine){
						var layerDeefineStore = layerDefine.getStore();
						var count = layerDeefineStore.getCount();
						for(var i=0;i<count;i++){
							var record = layerDeefineStore.getAt(i);
							if(record){
								var id = record.get('id'); 
								var layerName = record.get('layerName');
								if(!Ext.isEmpty(tempValue) && tempValue == layerName){
									layerId = id;
									isValid = true;
									break;
								}
							}
						}
					}
					if(!Ext.isEmpty(tempValue) && (!isValid || Ext.isEmpty(layerId))){
						alertWarring("Please input a valid data,this data come from layer definition!");
						e.setValue('');
						return;
					}
					var temp = DigiCompass.Web.app.assembleGrid.getAssembleGridDataFromArray('MOD_REGION_LAYER_ID');
					if(temp != null){
						var rowData = temp.rowDatas[temp.yIndex];
						var cellData = rowData[temp.xIndex + 1];
						if(cellData && cellData.length > 4){
							//MOD_REGION_LAYER_ID
							//id,versionId,rowHeaderId,columnHeaderId,rowHeaderId2,valueRefId,value,editableTag,oldValue
							cellData[cellData.length-4] = layerId;
							cellData[cellData.length-2] = 1;
							cellData[cellData.length-1] = tempValue;
						}
					}
				}
			}				
		}
	}
	
	DigiCompass.Web.UI.CometdRegistFns.init = function(){
		//展示Scenario列表，回调函数
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SCENARIO",
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn : DigiCompass.Web.app.assembleListView.getListView,
			Conf : {}
		});
		//根据Scenario Id获取数据，回调函数
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SCENARIO",
			COMMAND : 'COMMAND_QUERY_INFO',
			callbackfn : DigiCompass.Web.app.assembleListView.scenarioPublishByScenarioIdCallback,
			Conf : {}
		});
		//-------------------------------------------------------------- Demand ---------------------------
		//注册查询方法
		cometdfn.registFn({MODULE_TYPE:"MOD_SUBSCRIBER_QUANTITY",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_SUBSCRIBER_QUANTITY_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_SUBSCRIBER_QUANTITY_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Subscriber Quantity', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:250,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_SUBSCRIBER_QUANTITY",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_SUBSCRIBER_QUANTITY",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_SUBSCRIBER_QUANTITY_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_SUBSCRIBER_QUANTITY_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Subscriber_QTYTechnology', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:250,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_SUBSCRIBER_QUANTITY",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
//		//Preview
//		cometdfn.registFn({MODULE_TYPE:"MOD_SUBSCRIBER_QUANTITY",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_SUBSCRIBER_QUANTITY_PREVIEW_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_SUBSCRIBER_QUANTITY_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Subscriber_QTYTechnology', //GridPanel 标题
//				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'Lod_Panel_ID_',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:250,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
//				},
//				queryType:'1'
//			}
//		});
		
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_SUBSCRIBER_QUANTITY",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_SUBSCRIBER_QUANTITY",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		//监听删除
		cometdfn.registFn({MODULE_TYPE:"MOD_VERSION_MANAGER",
			COMMAND:'COMMAND_DEL',
			callbackfn :DigiCompass.Web.app.assembleGrid.dropBtnHandlerCallBack,
			Conf:{}
		});
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHKBPS",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_DEMAND_BHKBPS_GRID_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_DEMAND_BHKBPS_GRID_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'BH Kbps per Subscriber', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:155,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_BHKBPS",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHKBPS",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_DEMAND_BHKBPS_GRID_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_DEMAND_BHKBPS_GRID_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'BH Kbps per Subscriber', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:155,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_BHKBPS",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
//		//Preview
//		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHKBPS",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_DEMAND_BHKBPS_PREVIEW_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_DEMAND_BHKBPS_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'BH Kbps per Subscriber', //GridPanel 标题
//				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'Lod_Panel_ID_',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:200,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,//是否支持GridPanel可编辑。默认为true
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision
//				},
//				queryType:'1'
//			}
//		});
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHKBPS",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_DEMAND_BHKBPS",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHMERL",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_DEMAND_BHMERL_GRID_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_DEMAND_BHMERL_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'BH mErl per Subscriber', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:135,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_BHMERL",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHMERL",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_DEMAND_BHMERL_GRID_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_DEMAND_BHMERL_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'BH mErl per Subscriber', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:135,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_BHMERL",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
//		//Preview
//		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHMERL",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_DEMAND_BHMERL_PREVIEW_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_DEMAND_BHMERL_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'BH mErl per Subscriber', //GridPanel 标题
//				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'Lod_Panel_ID_',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:200,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision
//				},
//				queryType:'1'
//			}
//		});
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_BHMERL",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_DEMAND_BHMERL",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_SPEC_REGION_DIST",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_DEMAND_SPEC_REGION_DIST_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_DEMAND_SPEC_REGION_DIST_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Spectrum Region Demand Distribution', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:135,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_SPEC_REGION_DIST",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_SPEC_REGION_DIST",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_DEMAND_SPEC_REGION_DIST_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_DEMAND_SPEC_REGION_DIST_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Spectrum Region Demand Distribution', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:135,//GridPanel高度,该高度根据数据列表自己调整
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_SPEC_REGION_DIST",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
//		cometdfn.registFn({
//			MODULE_TYPE : 'MOD_SITE_GROUP',
//			COMMAND : 'COMMAND_QUERY_TREE',
//			callbackfn : function(message) {
//				if(message.siteGroupId === DigiCompass.Web.app.sitegroup.currentSiteGroupId){
//					//TODO 效率低  未选中父节点
//					var siteTreeData = Ext.JSON.decode(message.BUSINESS_DATA.sites);
//					if(DigiCompass.Web.app.sitegroup.siteGroupId){
//						DigiCompass.Web.app.sitegroup.siteGridStoreLoadData(siteTreeData);
//					}
//				}
//			}
//		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_SITE_GROUP',
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST',
			callbackfn : function(message) {
				DigiCompass.Web.app.sitegroup.assembleComboData(message);
			}
		});
		
//		//Preview
//		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_SPEC_REGION_DIST",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_DEMAND_SPEC_REGION_DIST_PREVIEW_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_DEMAND_SPEC_REGION_DIST_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Spectrum Region Demand Distribution', //GridPanel 标题
//				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'Lod_Panel_ID_',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:200,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,//是否支持GridPanel可编辑。默认为true
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
//					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
//				},
//				queryType:'1'
//			}
//		});
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_SPEC_REGION_DIST",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_DEMAND_SPEC_REGION_DIST",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_REGION",
			COMMAND:'COMMAND_QUERY_GRID',
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
			Conf:{
				id:'MOD_DEMAND_REGION_ID',
				divId:'MOD_DEMAND_REGION_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Region Properties',
				renderCmp:'centerBottomTabOneId',
				categoryLen:1,
				gridHeight:175,
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_REGION",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer',
					rowFormat:[{rowIndex:3,rowFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision}]
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_REGION",
			COMMAND:'COMMAND_QUERY_DRAG_GRID',
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
			Conf:{
				id:'MOD_DEMAND_REGION_ID',
				divId:'MOD_DEMAND_REGION_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Region Properties',
				renderCmp:'centerBottomTabOneId',
				categoryLen:1,
				gridHeight:175,
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_REGION",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer',
					rowFormat:[{rowIndex:3,rowFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision}]
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_REGION",
//			COMMAND:'COMMAND_QUERY_GRID',
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
//			Conf:{
//				id:'MOD_DEMAND_REGION_PREVIEW_ID',
//				divId:'MOD_DEMAND_REGION_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Region Properties',
//				renderCmp:'Lod_Panel_ID_',
//				categoryLen:1,
//				gridHeight:250,
//				isEditable:false,//是否支持GridPanel可编辑。默认为true
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
//					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer',
//					rowFormat:[{rowIndex:1,rowFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision}]
//				},
//				queryType:'1'
//			}
//		});
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_REGION",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_DEMAND_REGION",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_GLOBAL",
			COMMAND:'COMMAND_QUERY_GRID',
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
			Conf:{
				id:'MOD_DEMAND_GLOBAL_ID',
				divId:'MOD_DEMAND_GLOBAL_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Global Properties', 
				renderCmp:'centerBottomTabOneId',
				categoryLen:1,
				gridHeight:155,
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_GLOBAL",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer',
					rowFormat:[{rowIndex:2,rowFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision}]
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_GLOBAL",
			COMMAND:'COMMAND_QUERY_DRAG_GRID',
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
			Conf:{
				id:'MOD_DEMAND_GLOBAL_ID',
				divId:'MOD_DEMAND_GLOBAL_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Global Properties', 
				renderCmp:'centerBottomTabOneId',
				categoryLen:1,
				gridHeight:155,
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_GLOBAL",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer',
					rowFormat:[{rowIndex:2,rowFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision}]
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_GLOBAL",
//			COMMAND:'COMMAND_QUERY_GRID',
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
//			Conf:{
//				id:'MOD_DEMAND_GLOBAL_PREVIEW_ID',
//				divId:'MOD_DEMAND_GLOBAL_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Global Properties', 
//				renderCmp:'Lod_Panel_ID_',
//				categoryLen:1,
//				gridHeight:200,
//				isEditable:false,//是否支持GridPanel可编辑。默认为true
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
//					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer',
//					rowFormat:[{rowIndex:2,rowFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigitsPrecision}]
//				},
//				queryType:'1'
//			}
//		});
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_GLOBAL",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_DEMAND_GLOBAL",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
			});
		
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",
			COMMAND:'COMMAND_QUERY_GRID',
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
			Conf:{
				id:'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID',
				divId:'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_DIV_ID',
				title:'Web Accelerator Offload', 
				renderCmp:'centerBottomTabOneId',
				categoryLen:1,
				gridHeight:100,
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",
			COMMAND:'COMMAND_QUERY_DRAG_GRID',
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
			Conf:{
				id:'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_ID',
				divId:'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_DIV_ID',
				title:'Web Accelerator Offload', 
				renderCmp:'centerBottomTabOneId',
				categoryLen:1,
				gridHeight:100,
				moduleTypeOfSaveOrUpdate:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				isEditable:true,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",
//			COMMAND:'COMMAND_QUERY_GRID',
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,
//			Conf:{
//				id:'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_PREVIEW_ID',
//				divId:'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD_PREVIEW_DIV_ID',
//				title:'Web Accelerator Offload', 
//				renderCmp:'Lod_Panel_ID_',
//				categoryLen:1,
//				gridHeight:200,
//				isEditable:false,//是否支持GridPanel可编辑。默认为true
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
//					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
//				},
//				queryType:'1'
//			}
//		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		
		
		cometdfn.registFn({MODULE_TYPE:"MOD_TRAFFIC_DEMAND_CALC",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_TRAFFIC_DEMAND_CALC_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_TRAFFIC_DEMAND_CALC_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'CMP - Strategic Model Calculations', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabOneId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:480,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:false,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		//-------------------------------------------------------------- Traffic ---------------------------
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_TRAFFIC_CALC",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_TRAFFIC_CALC_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_TRAFFIC_CALC_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'CMP - Strategic Model Calculations', //GridPanel 标题
//				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabTwoId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:300,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,//是否支持GridPanel可编辑。默认为true
//				useRender : true,
//				formatConfig:{
//					//tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
//				},isShowSiteTip : true
//			}
//		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_TRAFFIC_GROWTH",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_TRAFFIC_GROWTH_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_TRAFFIC_GROWTH_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Traffic Growth', //GridPanel 标题
//				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabTwoId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:300,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,//是否支持GridPanel可编辑。默认为true
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
//				},isShowSiteTip : true
//			}
//		});
		
		//-------------------------------------------------------------- Layers ---------------------------
		
		/*cometdfn.registFn({
			MODULE_TYPE : "MOD_LAYER_DEFINITION",
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn :Digicompass.web.cmp.layer.LayerDefainition.creatLayerDefinition,
			Conf : {}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_LAYER_DEFINITION",// 该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',// 该参数在publish时调用，指定查询方法
			callbackfn :Digicompass.web.cmp.layer.LayerDefainition.creatLayerDefinition,// 调用publish后，回调方法
			Conf:{// callbackfn回调方法对应的参数配置
			}
		});*/
//		
//		cometdfn.registFn({MODULE_TYPE:"MOD_REGION_LAYER",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_REGION_LAYER_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_REGION_LAYER_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Ragion Layer Priority', //GridPanel 标题
//				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabThreeId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:335,//GridPanel高度,该高度根据数据列表自己调整
//				moduleTypeOfSaveOrUpdate:"MOD_REGION_LAYER",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//				moduleTypeOfRemove:'MOD_REGION_LAYER',
//				commandOfRemove:'COMMAND_DEL',
//				isEditable:true,
//				overrideCreateEditFun:DigiCompass.Web.UI.CometdRegistFns.overrideCreateEditFunOfRegionLayer,
//				isSaveAs:"0"
//			}
//		});
		
		cometdfn.registFn({
			MODULE_TYPE : Digicompass.web.cmp.layer.RegionLayer.MODULE_TYPE,
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : Digicompass.web.cmp.layer.RegionLayer.loadGrid
		});
		cometdfn.registFn({MODULE_TYPE:Digicompass.web.cmp.layer.RegionLayer.MODULE_TYPE,// 该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',// 该参数在publish时调用，指定查询方法
			callbackfn :Digicompass.web.cmp.layer.RegionLayer.loadGrid,// 调用publish后，回调方法
			Conf:{// callbackfn回调方法对应的参数配置
			}
		});
		
//		
//		//监听删除
//		cometdfn.registFn({MODULE_TYPE:"MOD_REGION_LAYER",
//			COMMAND:'COMMAND_DEL',
//			callbackfn :DigiCompass.Web.app.assembleGrid.dropBtnHandlerCallBack,
//			Conf:{}
//		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_REGION_LAYER",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_DRAG_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_REGION_LAYER_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_REGION_LAYER_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Ragion Layer Priority', //GridPanel 标题
//				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabThreeId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:335,//GridPanel高度,该高度根据数据列表自己调整
//				moduleTypeOfSaveOrUpdate:"MOD_REGION_LAYER",//必需传值:该参数在编辑时，publish调用，指定特定的模块
//				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
//				isEditable:true,
//				overrideCreateEditFun:DigiCompass.Web.UI.CometdRegistFns.overrideCreateEditFunOfRegionLayer,
//				isSaveAs:"0"
//			}
//		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_REGION_LAYER",
//			COMMAND:'COMMAND_SAVE_BATCH',
//			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
//			Conf:{
//				moduleType:"MOD_REGION_LAYER",//必需传值
//				command:'COMMAND_QUERY_GRID'//必需传值
//			}
//		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_LAYER_BAND_COUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_LAYER_BAND_COUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_LAYER_BAND_COUNT_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Layer Frequency Allocation Priority', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabThreeId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:355,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:false//是否支持GridPanel可编辑。默认为true
				,formatConfig:{
					tableFormatFn: DigiCompass.Web.UI.Cmp.Format.builderCommaStr
				}
			}
		});
		
		//注册查询方法
		cometdfn.registFn({MODULE_TYPE:"MOD_LAYER_CAPACITY_BAND_COUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_LAYER_CAPACITY_BAND_COUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_LAYER_CAPACITY_BAND_COUNT_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:"Layer Frequency Allocation Capacity", //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabThreeId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:355,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:false,//是否支持GridPanel可编辑。默认为true
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
//		cometdfn.registFn({MODULE_TYPE:"COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_MOD",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_MOD_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				title:'Site Layer forecast', //GridPanel 标题
//				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabThreeId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:500,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				isShowSiteTip : true
//			}
//		});
		
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_SITE_LAYER_FORECAST",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_SITE_LAYER_FORECAST_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_SITE_LAYER_FORECAST_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Site Layer forecast', //GridPanel 标题
//				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabThreeId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:140,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				isShowSiteTip : true
//			}
//		});
		
//		cometdfn.registFn({MODULE_TYPE:"COMETD_MODULE_TYPE_SITE_LAYER_FORECAST_MOD",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'COMETD_MODULE_TYPE_SITE_LAYER_FORECAST_MOD_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				title:'Site Layer forecast', //GridPanel 标题
//				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabThreeId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:500,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				isShowSiteTip : true
//			}
//		});
		
		//-------------------------------------------------------------- Coverage Builde ---------------------------
		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_CALCULATIONS",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_COVERAGE_BUILD_CALCULATIONS_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_COVERAGE_BUILD_CALCULATIONS_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'CMP - Strategic Model Calculations', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabFourId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:330,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:false
			}
		});
		
		
//		cometdfn.registFn({MODULE_TYPE:"COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				title:'Site Layer forecast', //GridPanel 标题
//				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'centerBottomTabFourId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:140,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				useRender : true,
//				isShowSiteTip : true
//			}
//		});
//		
		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_QUANTITY",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_COVERAGE_BUILD_QUANTITY_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_COVERAGE_BUILD_QUANTITY_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Coverage(Unplanned) Build QTY Forecast', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabFourId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:250,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:true,
				moduleTypeOfSaveOrUpdate:"MOD_COVERAGE_BUILD_QUANTITY",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigits
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_QUANTITY",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_COVERAGE_BUILD_QUANTITY_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_COVERAGE_BUILD_QUANTITY_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Coverage(Unplanned) Build QTY Forecast', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabFourId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:250,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:true,
				moduleTypeOfSaveOrUpdate:"MOD_COVERAGE_BUILD_QUANTITY",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigits
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validateData
				}
			}
		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_QUANTITY",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_COVERAGE_BUILD_QUANTITY_PREVIEW_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_COVERAGE_BUILD_QUANTITY_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Coverage Build QTY Forecast', //GridPanel 标题
//				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'Lod_Panel_ID_',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:200,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatDigits
//				},
//				queryType:'1'
//			}
//		});
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_QUANTITY",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_COVERAGE_BUILD_QUANTITY",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_REGION_PROPERTIES",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_COVERAGE_BUILD_REGION_PROPERTIES_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_COVERAGE_BUILD_REGION_PROPERTIES_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Region Properties', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabFourId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:150,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:true,
				moduleTypeOfSaveOrUpdate:"MOD_COVERAGE_BUILD_REGION_PROPERTIES",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_REGION_PROPERTIES",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_COVERAGE_BUILD_REGION_PROPERTIES_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				divId:'MOD_COVERAGE_BUILD_REGION_PROPERTIES_DIV_ID',//该参数在测试的时候使用，渲染到指定div
				title:'Region Properties', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabFourId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:150,//GridPanel高度,该高度根据数据列表自己调整
				isEditable:true,
				moduleTypeOfSaveOrUpdate:"MOD_COVERAGE_BUILD_REGION_PROPERTIES",//必需传值:该参数在编辑时，publish调用，指定特定的模块
				commandOfSaveOrUpdate:'COMMAND_SAVE_BATCH',//必需传值:该参数在编辑时，publish调用，指定特定的方法
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
				},
				validateConfig:{
					tableValidateFn:DigiCompass.Web.UI.Cmp.Validate.validatePercent
				}
			}
		});
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_REGION_PROPERTIES",//该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
//			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
//			Conf:{//callbackfn回调方法对应的参数配置
//				id:'MOD_COVERAGE_BUILD_REGION_PROPERTIES_PREVIEW_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				divId:'MOD_COVERAGE_BUILD_REGION_PROPERTIES_PREVIEW_DIV_ID',//该参数在测试的时候使用，渲染到指定div
//				title:'Region Properties', //GridPanel 标题
//				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
//				renderCmp:'Lod_Panel_ID_',//渲染到哪个组件上，这个可以随便写，后面我统一集成
//				gridHeight:200,//GridPanel高度,该高度根据数据列表自己调整
//				isEditable:false,
//				formatConfig:{
//					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.percentageRenderer,
//					tableFormatFnName:'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'
//				},
//				queryType:'1'
//			}
//		});
		
		//监听更新
		cometdfn.registFn({MODULE_TYPE:"MOD_COVERAGE_BUILD_REGION_PROPERTIES",
			COMMAND:'COMMAND_SAVE_BATCH',
			callbackfn :DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback,
			Conf:{
				moduleType:"MOD_COVERAGE_BUILD_REGION_PROPERTIES",//必需传值
				command:'COMMAND_QUERY_GRID'//必需传值
			}
		});
		//-------------------------------------------------------------- Cost Example --------------------
		
		
		
		
		//-------------------------------------------------------------- Report ---------------------------
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Subscribers', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				useRender : true,
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		/**cometdfn.registFn({MODULE_TYPE:"MOD_REPORT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getChart,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_RE  PORT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'SubscribersChart', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				useRender : true,
				gridHeight:350,
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});*/
		
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_UPGRADE",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_UPGRADE_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH Upgrade', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		/*cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_UPGRADE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_UPGRADE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Report Upgrade Amount', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:300
			}
		});*/
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_CAPACITY_QTY",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_CAPACITY_QTY_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH New Capacity', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		/*cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_CAPACITY_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_CAPACITY_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Report Capacity Amount', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:250
			}
		});*/
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Unplanned)', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_AMOUNT_PLANNED",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_AMOUNT_PLANNED_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Planned)', //GridPanel 标题
				categoryLen:4,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_CAPEX_TOTAL",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_CAPEX_TOTAL_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Capex Total Amount', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSixId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:100,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		// OPEX
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_OPEX_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Subscribers', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				useRender : true,
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		/*cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_UPGRADE",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_UPGRADE_OPEX_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Report Upgrade QTY', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:200
			}
		});*/
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_UPGRADE_OPEX_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_UPGRADE_OPEX_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH Upgrade', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		/*cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_CAPACITY_QTY",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_CAPACITY_QTY_OPEX_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Report Capacity Qty', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:150
			}
		});*/
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_CAPACITY_OPEX_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_CAPACITY_OPEX_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH New Capacity', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_OPEX_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_OPEX_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Unplanned)', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_OPEX_AMOUNT_PLANNED",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_OPEX_AMOUNT_PLANNED_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Planned)', //GridPanel 标题
				categoryLen:4,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_OPEX_TOTAL",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_OPEX_TOTAL_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Opex Total Amount', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabSevenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:100,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		// INCOME
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_INCOME_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Subscribers', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabEightId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				useRender : true,
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_UPGRADE_INCOME_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_UPGRADE_INCOME_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH Upgrade', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabEightId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_CAPACITY_INCOME_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_CAPACITY_INCOME_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH New Capacity', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabEightId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_INCOME_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_INCOME_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Unplanned)', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabEightId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_INCOME_AMOUNT_PLANNED",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_INCOME_AMOUNT_PLANNED_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Planned)', //GridPanel 标题
				categoryLen:4,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabEightId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_INCOME_TOTAL",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_INCOME_TOTAL_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Income Total Amount', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabEightId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:100,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		// EXPENSE
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_EXPENSE_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Subscribers', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabNineId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				useRender : true,
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_UPGRADE_EXPENSE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_UPGRADE_EXPENSE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH Upgrade', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabNineId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_CAPACITY_EXPENSE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_CAPACITY_EXPENSE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH New Capacity', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabNineId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_EXPENSE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_EXPENSE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Unplanned)', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabNineId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_EXPENSE_AMOUNT_PLANNED",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_EXPENSE_AMOUNT_PLANNED_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Planned)', //GridPanel 标题
				categoryLen:4,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabNineId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_EXPENSE_TOTAL",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_EXPENSE_TOTAL_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Expense Total Amount', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabNineId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:100,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		// RECHARGE
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_RECHARGE_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Subscribers', //GridPanel 标题
				categoryLen:2,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabTenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				useRender : true,
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_UPGRADE_RECHARGE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_UPGRADE_RECHARGE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH Upgrade', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabTenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_GROWTH_CAPACITY_RECHARGE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_GROWTH_CAPACITY_RECHARGE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'GROWTH New Capacity', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabTenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_RECHARGE_AMOUNT",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_RECHARGE_AMOUNT_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Unplanned)', //GridPanel 标题
				categoryLen:3,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabTenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_COVERAGE_RECHARGE_AMOUNT_PLANNED",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_COVERAGE_RECHARGE_AMOUNT_PLANNED_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Coverage(Planned)', //GridPanel 标题
				categoryLen:4,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabTenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:350,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_SITE_GROUP',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : function(message) {
				DigiCompass.Web.app.sitegroup.saveSuccess(message);
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn : function(message) {
				DigiCompass.Web.app.equipmentType.getList(message);
			}
		});
//		cometdfn.registFn({
//			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
//			COMMAND : 'COMMAND_QUERY_LIST',
//			callbackfn : DigiCompass.Web.app.changeRequest.getList
//		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST',
			callbackfn : DigiCompass.Web.app.changeRequest.showPlannedSiteWin
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_DEL',
			callbackfn :function(message){
				DigiCompass.Web.app.changeRequest.deleteSuccess(message);
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_OBJECT_TREE',
			callbackfn : function(message) {
				var siteTreeData = Ext.JSON.decode(message.BUSINESS_DATA.sites);
				var panel = Ext.getCmp('plannedSiteGroupSiteObjectPanel');
				if(panel)
					panel.reconfigData(siteTreeData);
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST_APPROVE',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST_CANCEL',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST_RELEASE',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCPET_APPROVE',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST_RELEASE_OPERATION_APPROVE',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST_RELEASE_OPERATION',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : DigiCompass.Web.app.changeRequest.showNotificationDetail
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_FINANCIAL_CATEGORY_COMBO_DATA',
			callbackfn : DigiCompass.Web.app.changeRequest.configComboData
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_DRAG_GRID' ,
			callbackfn : DigiCompass.Web.app.changeRequest.configRegionComboData
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_SAVE_TEMP',
			callbackfn : DigiCompass.Web.app.changeRequest.requestGridData
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : DigiCompass.Web.app.changeRequest.saveSuccess
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_SITE_TYPE_COMBOX_LIST' ,
			callbackfn : DigiCompass.Web.app.changeRequest.configSiteTypeComboData
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : function(message) {
				DigiCompass.Web.app.equipmentType.saveSuccess(message);
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',
			COMMAND : 'COMMAND_DEL',
			callbackfn : function(message) {
				DigiCompass.Web.app.equipmentType.delSuccess(message);
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',
			COMMAND : 'COMMAND_QUERY_ALL_TREE',
			callbackfn : function(message) {
				DigiCompass.Web.app.equipmentType.assembleEquipmentTypeData(message);
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_TYPE',
			COMMAND : 'COMMAND_UPDATE',
			callbackfn : function(message) {
				DigiCompass.Web.app.equipmentType.saveSuccess(message);
			}
		});
		 
		cometdfn.registFn({MODULE_TYPE:"MOD_REPORT_RECHARGE_TOTAL",//该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_GRID',//该参数在publish时调用，指定查询方法
			callbackfn :DigiCompass.Web.app.assembleGrid.getGrid,//调用publish后，回调方法
			Conf:{//callbackfn回调方法对应的参数配置
				id:'MOD_REPORT_RECHARGE_TOTAL_ID',//必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Recharge Total Amount', //GridPanel 标题
				categoryLen:1,//目录列长度，如:Data,HandSet,2012,2013等这种效果分类长度即为2
				renderCmp:'centerBottomTabTenId',//渲染到哪个组件上，这个可以随便写，后面我统一集成
				gridHeight:100,
				ischart:true,//TODO 设置是图表
				formatConfig:{
					tableFormatFn:DigiCompass.Web.UI.Cmp.Format.formatShowCommaAndDigitsPrecision
				}
			}
		});
		
		//Tree
//		cometdfn.registFn({MODULE_TYPE:"MOD_SITE_GROUP",
//			COMMAND:'COMMAND_QUERY_TREE',
//			callbackfn :DigiCompass.Web.UI.Workspace.Cmp.Tree.createTree,
//			Conf:{
//				id:'DIGICOMPASS_WEB_UI_WORKSPACE_CMP_TREE_ID'
//			}
//		});
		//planningcycle获取listView
		cometdfn.registFn({MODULE_TYPE:"MOD_PLANNING_CYCLE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.planningCycle.getList,
			Config:{
			}
		});
		/**
		 * spectrumRegion
		 */
		cometdfn.registFn({MODULE_TYPE:"MOD_SPECTRUM_REGION",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.spectrumRegion.getList,
			Config:{
			}
		});
//		cometdfn.registFn({
//				MODULE_TYPE : 'MOD_SITE_GROUP',
//				COMMAND : 'COMMAND_OBJECT_TREE',
//				callbackfn : function(message) {
//						//TODO 效率低  未选中父节点
//						var siteTreeData = Ext.JSON.decode(message.BUSINESS_DATA.sites);
//						var panel = Ext.getCmp('siteGroupSiteObjectPanel');
//						if(panel)
//							panel.reconfigData(siteTreeData);
//				}
//		});
//		cometdfn.registFn({
//			MODULE_TYPE : 'MOD_SITE_GROUP',
//			COMMAND : 'COMMAND_CATALOGUE_TREE',
//			callbackfn : function(message) {
//					//TODO 效率低  未选中父节点
//					var catalogueData = Ext.JSON.decode(message.BUSINESS_DATA.catalogue);
//					var panel = Ext.getCmp('siteGroupSiteCataloguePanel');
//					if(panel && panel.isVisible())
//						panel.resetRootNode(catalogueData);
//			}
//		});
		//sitegroup 获取 object
		/*cometdfn.registFn({
			MODULE_TYPE:"MOD_SITE_GROUP",
			COMMAND:'COMMAND_OBJECT',
			callbackfn:DigiCompass.Web.app.sitegroup.getList,
			Config:{
			}
		});*/
		cometdfn.registFn({MODULE_TYPE:"MOD_SITE_GROUP",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.sitegroup.getList,
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_FINANCIAL_CATEGORY_TYPE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn: DigiCompass.Web.app.financialCategoryType.getList,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn: DigiCompass.Web.app.financialCategory.getList,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_TREE',
			callbackfn: DigiCompass.Web.app.financialCategory.financialCategoryTree,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST',
			callbackfn: DigiCompass.Web.app.financialCategory.loadComboData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_DEL',
			callbackfn: DigiCompass.Web.app.financialCategory.delSuccess,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_SAVE',
			callbackfn: DigiCompass.Web.app.financialCategory.saveSuccess,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_ALL_TREE',
			callbackfn: DigiCompass.Web.app.financialCategory.loadCategoryData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_COST_DISTRIBUTION',
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn: function(){},//DigiCompass.Web.app.financialCostDistribution.getList,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE:"MOD_FINANCIAL_CATEGORY_TYPE",
			COMMAND:'COMMAND_SAVE',
			callbackfn: DigiCompass.Web.app.financialCategoryType.saveSuccess,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY_TYPE',
			COMMAND : 'COMMAND_ITEM_TREE',
			callbackfn: DigiCompass.Web.app.financialCategoryType.loadGridData,
			Config:{
			}
		});
		
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_TECHNOLOGY_LIST',
			callbackfn: DigiCompass.Web.app.financialCategoryType.technologyData,
			Config:{
			}
		});
		//TODO
//		cometdfn.registFn({
//			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
//			COMMAND : 'COMMAND_QUERY_PORTFOLIO_LIST',
//			callbackfn: DigiCompass.Web.app.financialCategoryType.portfolioData,
//			Config:{
//			}
//		});
		
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_SITE_TYPE_LIST',
			callbackfn: DigiCompass.Web.app.financialCategoryType.siteTypeData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_REGION_LIST',
			callbackfn: DigiCompass.Web.app.financialCategoryType.regionData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_POLYGON_LIST',
			callbackfn: DigiCompass.Web.app.financialCategoryType.polygonData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_STATE_LIST',
			callbackfn: DigiCompass.Web.app.financialCategoryType.stateData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn: function(data){
				var workflowTemplateData =  Ext.JSON.decode(data.BUSINESS_DATA.list);
				for(var i = 0 ; i<workflowTemplateData.length ;i++){
					workflowTemplateData[i] = { 
							id : workflowTemplateData[i].id ,
							name : workflowTemplateData[i].name,
							description : workflowTemplateData[i].description,
							parentId : workflowTemplateData[i].parentId
						}
				}
				DigiCompass.Web.app.financialCategory.workflowTemplate = workflowTemplateData;
				DigiCompass.Web.app.wftemp.data = workflowTemplateData;
			},
			Config:{
			}
		});
//		cometdfn.registFn({
//			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',
//			COMMAND : 'COMMAND_QUERY_TEMPLATE_LIST',
//			callbackfn: DigiCompass.Web.app.financialCategoryType.templateData,
//			Config:{
//			}
//		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY_TYPE',
			COMMAND : 'COMMAND_DEL',
			callbackfn: DigiCompass.Web.app.financialCategoryType.delSuccess,
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_WORK_FLOW_CATEGORY_TYPE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn: DigiCompass.Web.app.workFlowCategoryType.getList,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE:"MOD_WORK_FLOW_CATEGORY_TYPE",
			COMMAND:'COMMAND_SAVE',
			callbackfn: DigiCompass.Web.app.workFlowCategoryType.saveSuccess,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW_CATEGORY_TYPE',
			COMMAND : 'COMMAND_ITEM_TREE',
			callbackfn: DigiCompass.Web.app.workFlowCategoryType.loadGridData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW_CATEGORY_TYPE',
			COMMAND : 'COMMAND_DEL',
			callbackfn: DigiCompass.Web.app.workFlowCategoryType.delSuccess,
			Config:{
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW',
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST',
			callbackfn: DigiCompass.Web.app.workFlow.loadComboData,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW',
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn: DigiCompass.Web.app.workFlow.getList,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW',
			COMMAND : 'COMMAND_QUERY_TREE',
			callbackfn: DigiCompass.Web.app.workFlow.workFlowTree,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW',
			COMMAND : 'COMMAND_DEL',
			callbackfn: DigiCompass.Web.app.workFlow.delSuccess,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW',
			COMMAND : 'COMMAND_QUERY_ALL_TREE',
			callbackfn: function(data){
				var treeData = data.BUSINESS_DATA.tree;
				treeData = Ext.decode(treeData);
				DigiCompass.Web.app.wftemp.categoryTypeData = treeData.children;
			},
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_WORK_FLOW',
			COMMAND : 'COMMAND_SAVE',
			callbackfn: DigiCompass.Web.app.workFlow.saveSuccess,
			Config:{
			}
		});
		//sitegroup 获取 catalogue
		/*cometdfn.registFn({
			MODULE_TYPE:"MOD_SITE_GROUP",
			COMMAND:'COMMAND_CATALOGUE',
			callbackfn:function(){
				//TODO 效率低  未选中父节点
				var catalogueData = Ext.JSON.decode(message.BUSINESS_DATA.catalogue);
				var panel = Ext.getCmp('siteGroupListCataloguePanel');
				if(panel && panel.isVisible())
					panel.resetRootNode(catalogueData);
			},
			Config:{
			}
		});*/
		
		
	cometdfn.registFn({
		MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
		COMMAND : 'COMMAND_OBJECT_TREE',
		callbackfn : function(message) {
				//TODO 效率低  未选中父节点
				var siteTreeData = Ext.JSON.decode(message.BUSINESS_DATA.sites);
				var panel = Ext.getCmp('plannedSiteGroupSiteObjectPanel');
				if(panel)
					panel.reconfigData(siteTreeData);
		}
	});
	cometdfn.registFn({
		MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
		COMMAND : 'COMMAND_CATALOGUE_TREE',
		callbackfn : function(message) {
				//TODO 效率低  未选中父节点
				var catalogueData = Ext.JSON.decode(message.BUSINESS_DATA.catalogue);
				var panel = Ext.getCmp('plannedSiteGroupSiteCataloguePanel');
				if(panel && panel.isVisible())
					panel.resetRootNode(catalogueData);
		}
	});
		/**
		 * 注册PlannedSiteGroup
		 */
		cometdfn.registFn({MODULE_TYPE:"MOD_PLANNED_SITE_GROUP",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.plannedSitegroup.getList,
			Config:{
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
			COMMAND : 'COMMAND_QUERY_ALL_TREE',
			callbackfn : function(message) {
					//TODO 效率低  未选中父节点
					var siteTreeData = Ext.JSON.decode(message.BUSINESS_DATA.plannedSites);
					var mainPanel=Ext.getCmp("plannedSiteSelectedMain");
					if(mainPanel)
						mainPanel.reconfigData(siteTreeData);
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
			COMMAND : 'COMMAND_QUERY_SITE_TYPE_COMBOX_LIST',
			callbackfn : function(message){
				DigiCompass.Web.app.plannedSitegroup.assembleSiteTypeComboStore(message);
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : function(message){
				DigiCompass.Web.app.plannedSitegroup.saveSuccess(message);
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
			COMMAND : 'COMMAND_DEL',
			callbackfn : function(message) {
				DigiCompass.Web.app.plannedSitegroup.deleteSuccess(message);
			}
		});
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
			COMMAND : 'COMMAND_QUERY_TREE',
			callbackfn : function(message) {
				var data = Ext.decode(message.BUSINESS_DATA.treeCheckList);
				DigiCompass.Web.app.plannedSitegroup.siteGridStoreLoadData(data, message.BUSINESS_DATA.sitePlannedGroupId);
			}
		});
		cometdfn.registFn({ 
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP', 
			COMMAND : 'COMMAND_QUERY_DRAG_GRID', 
			callbackfn : function(message) {
				DigiCompass.Web.app.plannedSitegroup.assembleSpectrumRegionComboData(message); 
			}
		}); 
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP', 
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST' , 
			callbackfn : function(message) {
				DigiCompass.Web.app.plannedSitegroup.assemblePlanningCycleItemData(message); 
			}
		});
		cometdfn.registFn({MODULE_TYPE:"PLANNED_SITE_MODULE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.plannedSite.getList,
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_SNAPSHOT_VERSION",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.UI.SnapshotVersion.init,
			Config:{
			}
		});
		
		//注册sitegroup 获取combobox数据方法
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SITE_GROUP_ADD",
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST',
			callbackfn : DigiCompass.Web.app.sitegroup.assembleGridStore,
			Conf : {}
		})
		//注册siteGroup新增方法
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SITE_GROUP_ADD",
			COMMAND : 'COMMAND_SAVE',
			callbackfn : DigiCompass.Web.app.sitegroup.saveSuccess,
			Conf : {}
		});
		//注册PlanningCycle新增方法
		cometdfn.registFn({
			MODULE_TYPE : "MOD_PLANNING_CYCLE",
			COMMAND : 'COMMAND_SAVE',
			callbackfn : DigiCompass.Web.app.planningCycle.saveSuccess,
			Conf : {}
		});
		//siteGroup 填充form
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SITE_GROUP",
			COMMAND : 'COMMAND_QUERY_FORM_INFO',
			callbackfn : DigiCompass.Web.app.sitegroup.refreshFormData,
			Conf : {}
		});
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SCENARIO",
			COMMAND : 'COMMAND_SAVE',
			callbackfn : DigiCompass.Web.app.assembleListView.scenarioAddCallback,
			Conf : {}
		});
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SCENARIO",
			COMMAND : 'COMMAND_UPDATE',
			callbackfn : DigiCompass.Web.app.assembleListView.scenarioAddCallback,
			Conf : {}
		});
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SCENARIO_COPY",
			COMMAND : 'COMMAND_SAVE_BATCH',
			callbackfn : DigiCompass.Web.app.assembleListView.scenarioSaveAsCallback,
			Conf : {}
		});
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SCENARIO",
			COMMAND : 'COMMAND_DEL',
			callbackfn : DigiCompass.Web.app.assembleListView.scenarioDelCallback,
			Conf : {}
		});
		/*cometdfn.registFn({
			MODULE_TYPE : "PLANNED_SITE_MODULE",
			COMMAND : 'COMMAND_DEL',
			callbackfn : DigiCompass.Web.app.plannedSite.deletePlannedSiteCallback,
			Conf : {}
		});*/
		//planningCycle 填充form
		cometdfn.registFn({
			MODULE_TYPE : "MOD_PLANNING_CYCLE",
			COMMAND : 'COMMAND_QUERY_FORM_INFO',
			callbackfn : DigiCompass.Web.app.planningCycle.refreshFormData,
			Conf : {}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : "MOD_SITE_GROUP",
			COMMAND : 'COMMAND_DEL',
			callbackfn : DigiCompass.Web.app.sitegroup.deleteSuccess,
			Conf : {}
		});
		cometdfn.registFn({
			MODULE_TYPE : "MOD_PLANNING_CYCLE",
			COMMAND : 'COMMAND_DEL',
			callbackfn : DigiCompass.Web.app.planningCycle.deleteSuccess,
			Conf : {}
		});
		
		cometdfn.registFn({MODULE_TYPE:"RESOURCE_TYPE_MODULE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.resourceType.getList,
			Config:{
			}
		});
		cometdfn.registFn({MODULE_TYPE:"RESOURCE_MODULE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.resource.getList,
			Config:{
			}
		});
		cometdfn.registFn({MODULE_TYPE:"SERVICE_TEMPLATE_MODULE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:function(message){
				if(message.dataType && message.dataType == 'TreeData'){
					DigiCompass.Web.app.wftemp.configWorkflowTemplateTree(message);		
				}else{
					DigiCompass.Web.app.wftemp.getList(message);
				}
			},
			Config:{
			}
		});
		cometdfn.registFn({MODULE_TYPE:"SERVICE_TEMPLATE_MODULE",
			COMMAND:'COMMAND_QUERY_GRID',
			callbackfn:DigiCompass.Web.app.wftemp.showNotification,
			Config:{
			}
		});
		cometdfn.registFn({MODULE_TYPE:"RESOURCE_MASTER_SERVICE_AGREEMENT",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.msa.getList,
			Config:{
			}
		});
		
		
		/*cometdfn.registFn({MODULE_TYPE:"MOD_BAND_UPGRADE_COST",// 该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_LIST',// 该参数在publish时调用，指定查询方法
			callbackfn :Digicompass.web.cmp.cost.bandUpgrade.loadGrid,// 调用publish后，回调方法
			Conf:{// callbackfn回调方法对应的参数配置
				id:'MOD_BAND_UPGRADE_COST_ID',// 必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Band Upgrade cost', // GridPanel
				renderCmp:'centerBottomTabFiveId'// 渲染到哪个组件上，这个可以随便写，后面我统一集成
			}
		});*/
		
		/*cometdfn.registFn({MODULE_TYPE:"MOD_BAND_UPGRADE_COST",// 该参数在publish时调用，指定某一个模块
			COMMAND:'COMMAND_QUERY_DRAG_GRID',// 该参数在publish时调用，指定查询方法
			callbackfn :Digicompass.web.cmp.cost.bandUpgrade.loadGrid,// 调用publish后，回调方法
			Conf:{// callbackfn回调方法对应的参数配置
				id:'MOD_BAND_UPGRADE_COST_ID',// 必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
				title:'Band Upgrade cost', // GridPanel
				renderCmp:'centerBottomTabFiveId'// 渲染到哪个组件上，这个可以随便写，后面我统一集成
			}
		});*/
		
//		cometdfn.registFn({MODULE_TYPE:"MOD_BAND_UPGRADE_COST",// 该参数在publish时调用，指定某一个模块
//			COMMAND:'COMMAND_QUERY_LIST',// 该参数在publish时调用，指定查询方法
//			type:'new',
//			callbackfn :Digicompass.web.cmp.cost.bandIntroduction.loadGrid,// 调用publish后，回调方法
//			Conf:{// callbackfn回调方法对应的参数配置
//				id:'MOD_BAND_UPGRADE_COST_NEW_ID',// 必需传一个不然在渲染时，每次都会新创建一个GridPanel，注意，命名时最好加上前面的模块名，以防重复
//				title:'New Band Introduction cost (for whole network or per state)', // GridPanel
//				renderCmp:'centerBottomTabFiveId'// 渲染到哪个组件上，这个可以随便写，后面我统一集成
//			}
//		});
		/*cometdfn.registFn({
			MODULE_TYPE : 'MOD_BAND_UPGRADE_COST',
			COMMAND : 'COMMAND_DEL',
			callbackfn : function(message) {
				if(ServerMessageProcess(message)){
					var config = Digicompass.web.cmp.cost.bandUpgrade.configs[message['scenarioId']];
					config = Digicompass.web.cmp.cost.bandUpgrade.initConfig(config);
					Digicompass.web.cmp.cost.bandUpgrade.refresh(config);
				}
			}
		});*/
		
		
		
		
		/*cometdfn.registFn({
			MODULE_TYPE : 'MOD_BAND_UPGRADE_COST',
			COMMAND : 'COMMAND_SAVE_BATCH',
			callbackfn : function(message) {
				if(ServerMessageProcess(message)){
					console.log(message)
					var scenarioId = message['scenarioId'];
					var config = Digicompass.web.cmp.cost.bandUpgrade.configs[scenarioId];
					config = Digicompass.web.cmp.cost.bandUpgrade.initConfig(config);
					var version = Ext.JSON.decode(message.BUSINESS_DATA.data);
					config.versionId = version.id;
					config.versionName = version.name;
					Digicompass.web.cmp.cost.bandUpgrade.refresh(config);
				}
			}
		});*/
//		cometdfn.registFn({
//				MODULE_TYPE : 'MOD_BAND_UPGRADE_COST',
//				COMMAND : 'COMMAND_SAVE_BATCH',
//				type:'new',
//				callbackfn : function(message) {
//					if(ServerMessageProcess(message)){
//						var version = Ext.JSON.decode(message.BUSINESS_DATA.data);
//						Digicompass.web.cmp.cost.bandIntroduction.versionId = version.id;
//						Digicompass.web.cmp.cost.bandIntroduction.versionName = version.name;
//						Digicompass.web.cmp.cost.bandIntroduction.refresh(Digicompass.web.cmp.cost.bandIntroduction);
//					}
//				}
//		});
//		cometdfn.registFn({
//			MODULE_TYPE : 'MOD_BAND_UPGRADE_COST',
//			COMMAND : 'COMMAND_DEL',
//			type:'new',
//			callbackfn : function(message) {
//				if(ServerMessageProcess(message)){
//					Digicompass.web.cmp.cost.bandIntroduction.refresh(Digicompass.web.cmp.cost.bandIntroduction);
//				}
//			}
//		});
		/*cometdfn.registFn({
			MODULE_TYPE : Digicompass.web.cmp.cost.costCapacityBuild.MODULE_TYPE,
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn : Digicompass.web.cmp.cost.costCapacityBuild.loadGrid
		});
		cometdfn.registFn({
			MODULE_TYPE : Digicompass.web.cmp.cost.costCapacityBuild.MODULE_TYPE,
			COMMAND : 'COMMAND_QUERY_DRAG_GRID',
			callbackfn : Digicompass.web.cmp.cost.costCapacityBuild.loadGrid
		});*/
		
		/*cometdfn.registFn({
			MODULE_TYPE : Digicompass.web.cmp.cost.costCoverageBuild.MODULE_TYPE,
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn : Digicompass.web.cmp.cost.costCoverageBuild.loadGrid
		});
		cometdfn.registFn({
			MODULE_TYPE : Digicompass.web.cmp.cost.costCoverageBuild.MODULE_TYPE,
			COMMAND : 'COMMAND_QUERY_DRAG_GRID',
			callbackfn : Digicompass.web.cmp.cost.costCoverageBuild.loadGrid
		});*/
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_BAND_FORMULA_PARAMETER',
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn :  DigiCompass.Web.app.cost.Grid.loadRTParameter
		});
		
//		cometdfn.registFn({
//			MODULE_TYPE : 'MOD_VERSION_MANAGER',
//			COMMAND : 'COMMAND_QUERY_ALL_TREE',
//			callbackfn :  DigiCompass.Web.UI.Scenario.scenarioDetailClickFn
//		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
			COMMAND : 'COMMAND_QUERY_GRID',
			callbackfn : Digicompass.web.cmp.demand.period.createPanel
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
			COMMAND : 'COMMAND_SAVE_BATCH',
			callbackfn : Digicompass.web.cmp.demand.period.savePeriodCallback
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
			COMMAND : 'COMMAND_DEL',
			callbackfn : Digicompass.web.cmp.demand.period.removePeriodCallback
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
			COMMAND : 'COMMAND_QUERY_DRAG_GRID',
			callbackfn : Digicompass.web.cmp.demand.period.createPanel
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'PLANNED_SITE_MODULE',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : function(message) {
				var data = message['BUSINESS_DATA'] || {};
				if(DigiCompass.Web.app.plannedSite.saveType){
					DigiCompass.Web.app.changeRequest.addPlannedSiteSuccess();
					DigiCompass.Web.app.plannedSite.saveType = null;
				} else {
					if (message.STATUS === 'success'
							&& data.status === 'success') {
						alertSuccess('save success.');
						var front = Ext.getCmp("plannedSiteDetailPanel");
						front.reversalPanel.toFront();
						front.reversalPanel.back.setValues({
							versionId : data.msg
						});
						var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
						DigiCompass.Web.UI.CometdPublish.plannedSitePublish(queryParam);
						var objExpPanel = Ext.getCmp('obj-details');
						if (objExpPanel) {
							// 移除组建
							objExpPanel.removeAll();
						}
						var versionview = Ext.getCmp('versionView');
						DigiCompass.Web.UI.CometdPublish.getPlannedSiteVersionDataPublish('PLANNED_SITE',{
							planningCycleId: versionview.planningCycleId,
			    			scenarioId:  versionview.scenarioId,
			    			siteGroupId:  versionview.siteGroupId,
			    			technologyId:  versionview.technologyId,
			    			siteGroupPlannedId:  versionview.siteGroupPlannedId,
			    			versionId:  versionview.versionId,
			    			queryType: 'DELETED_LIST'
						});
					}else if(message.customException){
						if(message.ERROR_CODE && (message.ERROR_CODE === 1001 || message.ERROR_CODE === 1002)){
							Ext.getCmp("plannedSiteDetailPanel").toBack();
						}
						alertError(message.customException);
					}
				}
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'RESOURCE_TYPE_MODULE',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : function(message) {
				var data = message['BUSINESS_DATA'] || {};
				if (message.STATUS === 'success'
						&& data.status === 'success') {
					alertSuccess('save success.');
					/*var front = Ext.getCmp("plannedSiteDetailPanel");
					front.reversalPanel.toFront();
					front.reversalPanel.back.setValues({
						versionId : data.msg
					});*/
					var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
					DigiCompass.Web.UI.CometdPublish.resourceTypePublish(queryParam);
					var objExpPanel = Ext.getCmp('obj-details');
					if (objExpPanel) {
						// 移除组建
						objExpPanel.removeAll();
					}
				}else{
					alertError('save fail');
				}
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'RESOURCE_MODULE',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : function(message) {
				var data = message['BUSINESS_DATA'] || {};
				if (message.STATUS === 'success'
						&& data.status === 'success') {
					alertSuccess('save success.');
					/*var front = Ext.getCmp("plannedSiteDetailPanel");
					front.reversalPanel.toFront();
					front.reversalPanel.back.setValues({
						versionId : data.msg
					});*/
					var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
					DigiCompass.Web.UI.CometdPublish.resourcePublish(queryParam);
					var objExpPanel = Ext.getCmp('obj-details');
					if (objExpPanel) {
						// 移除组建
						objExpPanel.removeAll();
					}
				}else{
					alertError('save fail');
				}
			}
		});
		
		
		cometdfn.registFn({
			MODULE_TYPE : 'RESOURCE_MASTER_SERVICE_AGREEMENT',
			COMMAND : 'COMMAND_SAVE',
			callbackfn : function(message) {
				var data = message['BUSINESS_DATA'] || {};
				if (message.STATUS === 'success'
						&& data.status === 'success') {
					alertSuccess('save success.');
					/*var front = Ext.getCmp("plannedSiteDetailPanel");
					front.reversalPanel.toFront();
					front.reversalPanel.back.setValues({
						versionId : data.msg
					});*/
					var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
					DigiCompass.Web.UI.CometdPublish.resourceMSA(queryParam);
					var objExpPanel = Ext.getCmp('obj-details');
					if (objExpPanel) {
						// 移除组建
						objExpPanel.removeAll();
					}
				}else{
					alertError('save fail');
				}
			}
		});
		
		/**
		 * Technology
		 */
		cometdfn.registFn({MODULE_TYPE:"MOD_TECHNOLOGY",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.technology.getList,
			Config:{
			}
		});
		cometdfn.registFn({MODULE_TYPE:"MOD_TECHNOLOGY",
			COMMAND:'COMMAND_QUERY_INFO',
			callbackfn : DigiCompass.Web.app.technology.queryInfoCallBack,
			Config:{
			}
		});
		/**
		 * Bug
		 */
		cometdfn.registFn({MODULE_TYPE:"MOD_BUG",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.bug.getList,
			Config:{
			}
		});
		cometdfn.registFn({MODULE_TYPE:"MOD_BUG",
			COMMAND:'COMMAND_QUERY_INFO',
			callbackfn : DigiCompass.Web.app.bug.queryInfoCallBack,
			Config:{
			}
		});
		/**
		 * Portfolio
		 */
		cometdfn.registFn({MODULE_TYPE:"MOD_PORTFOLIO",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.portfolio.getList,
			Config:{
			}
		});
		/*cometdfn.registFn({MODULE_TYPE:"MOD_PORTFOLIO",
			COMMAND:'COMMAND_QUERY_INFO',
			callbackfn : DigiCompass.Web.app.portfolio.queryInfoCallBack,
			Config:{
			}
		});*/
		cometdfn.registFn({MODULE_TYPE:"MOD_POLYGON",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:function(){},
			Config:{
			}
		});
//		cometdfn.registFn({MODULE_TYPE:"MOD_EQUIPMENT_TEMPLATE",
//			COMMAND:'COMMAND_QUERY_LIST',
//			callbackfn:DigiCompass.Web.app.equipmentTemplate.getList,
//			Config:{
//			}
//		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_EQUIPMENT_RELATION",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn:DigiCompass.Web.app.equipmentRelation.getList,
			Config:{
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST',
			callbackfn: DigiCompass.Web.app.equipmentRelation.loadComboData,
			Config:{
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',
			COMMAND : 'COMMAND_QUERY_ALL_TREE',
			callbackfn: DigiCompass.Web.app.equipmentRelation.loadEquipmentData,
			Config:{
			}
		});
		
		cometdfn.registFn({
			MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',
			COMMAND : 'COMMAND_SAVE',
			callbackfn: DigiCompass.Web.app.equipmentRelation.saveSuccess,
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_EQUIPMENT_RELATION",
			COMMAND:'COMMAND_DEL',
			callbackfn:DigiCompass.Web.app.equipmentRelation.delSuccess,
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_EQUIPMENT_RELATION",
			COMMAND:'COMMAND_EQUIPMENT_TEMPLATE_TREE',
			callbackfn:DigiCompass.Web.app.equipmentRelation.loadTemplateTree,
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_EQUIPMENT_RELATION",
			COMMAND:'COMMAND_EQUIPMENT_TYPE_TREE',
			callbackfn:DigiCompass.Web.app.equipmentRelation.loadTypeTree,
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"MOD_EQUIPMENT_TEMPLATEV2",
			COMMAND:'COMMAND_QUERY_TREE',
			callbackfn:function(message){
				Ext.create("DigiCompass.Web.app.equipmentTemplateV2").entry(message);
			},
			Config:{
			}
		});
		
		cometdfn.registFn({MODULE_TYPE:"PROFILE_MODULE",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn : DigiCompass.Web.app.userMgt.showPublicProfile,
			Config:{
			}
		});
		
		/*cometdfn.registFn({MODULE_TYPE:"MOD_TRIGGER_CHANGE_REQUEST",
			COMMAND:'COMMAND_QUERY_LIST',
			callbackfn :DigiCompass.Web.app.triggering.TriggerCr.showView,
			Config:{
			}
		});*/
		cometdfn.registFn({MODULE_TYPE:"MOD_TRIGGER_CHANGE_REQUEST",
			COMMAND:'COMMAND_QUERY_INFO',
			callbackfn :DigiCompass.Web.app.triggering.TriggerCr.showTriggerCr,
			Config:{
			}
		});
		
	}
	
	

})();