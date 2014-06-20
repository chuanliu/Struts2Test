(function() {
		Ext.namespace('DigiCompass.Web.app.assembleGrid');
		
		//定义全局参数用于保存GridData数据
		var assembleGridDataArry = new Array();
		//保存操作类型：SAVE_AS=直接保存为新版本，SAVE=直接保存当前版本信息。
		var SAVE_HANDLER = 'SAVE';
		var SAVE_AS_HANDLER = 'SAVE_AS';
		//chart回调方法
		/**DigiCompass.Web.app.assembleGrid.getChart = function(data, config,fnName,fnCommand){
			FirstChart();
		}*/
		//通用Grid回调方法
		DigiCompass.Web.app.assembleGrid.getGrid = function(data, config,fnName,fnCommand) {
			//Catalogue预览时会生成一个Grid，由于采用的时cometed所以此处必需有个标识不然，每次刷新都会同时被接收。
//			if(data.queryType && !config.queryType || !data.queryType && config.queryType){
//				return;
//			}
			//初始化配置属性refreshGrid
			var renderdiv = config.divId;
			var categoryLen = config.categoryLen;
			var gridHeight = config.gridHeight - 45;
			var moduleType = config.moduleTypeOfSaveOrUpdate;
			var command = config.commandOfSaveOrUpdate;
			var moduleTypeOfRemove = config.moduleTypeOfRemove;
			var commandOfRemove = config.commandOfRemove;
			var isEditable = config.isEditable;
			var overrideCreateEditFun = config.overrideCreateEditFun;
			var formatConfig = config.formatConfig;
			var isSaveAs = config.isSaveAs;//0=false,1=true
			var validateConfig = config.validateConfig;
			var isShowSiteTip = config.isShowSiteTip || false;
			
			var configId = config.id;
			//var ischart = false;
			var ischart = config.ischart;
			//给没有配置信息的添加初始值
			if(!categoryLen){
				categoryLen = 2;
			}
			if(isEditable === 'undefined'){
				isEditable = true;
			}
			if(!moduleTypeOfRemove){
				moduleTypeOfRemove = 'MOD_VERSION_MANAGER';
			}
			if(!commandOfRemove){
				commandOfRemove = 'COMMAND_DEL';
			}
			if(!isSaveAs){
				isSaveAs = "1";
			}
			if(ischart === "undefined"){
				ischart=false;	
			}
			//初始化配置信息
			var id = data.id;
			if(!id){
				id = config.id + (data.scenarioId||'');
			}
			
			var reversalPanel_id = 'reversalPanel_' + id;
			
			var vformPanel_Id = 'vformPanel_' + id;
			
			var obj_details_tbar_id = 'obj_details_tbar_' + id;
			
			var main_ReversalPanel_Id = 'main_ReversalPanel_Id' + data.scenarioId;
			
			//因为每一个Scenario一个Tab,此处必需用scenarioId区分，否则渲染时会出问题。
			var renderCmp = config.useRender ? (config.renderCmp+data.scenarioId) : data.renderCmp;
			var tempCmp = Ext.getCmp(renderCmp);
//			if(data.isSingleEdit){
//				renderCmp = data.dataEditPanel;
//			}else 
			/*if(data.queryType && config.queryType){
				renderCmp = config.renderCmp + data.versionId;
			}else{
				renderCmp = config.renderCmp + data.scenarioId;
			}*/
			
			//处理回调信息
			var oldData ;
			try {
				oldData = data.BUSINESS_DATA['grid'];
			} catch (e) {
				console.log('no grid data!');
				return ;
			}
//			var oldData = data.BUSINESS_DATA['grid'];
			var argumentDatas = {};
			argumentDatas = DigiCompass.Web.app.assembleGrid.createArgumentDatas(argumentDatas,data);
			
			//拖动参数配置
			var dragArgumentDatas = {};
			dragArgumentDatas = DigiCompass.Web.app.assembleGrid.createDragArgumentDatas(dragArgumentDatas,data);
			
			//给标题添加版本号
			var title =config.title;
//			if(config.isEditable || data.queryType && config.queryType){
			if(config.isEditable){
				if(oldData['versionName']){
					title += " ("+oldData['versionName']+")";
				}
			}
//			if(data.isSingleEdit){
//				title = '';
//			}
			
			//将回调信息中的json数据，转化为对象		
			data['columnHeader'] = Ext.JSON.decode(oldData['columnHeader']);
			data['rowHeader'] = Ext.JSON.decode(oldData['rowHeader']);
			data['data'] = Ext.JSON.decode(oldData['data']);
			
			//创建列表对应单个值属性
			var singleData = DigiCompass.Web.app.assembleGrid.assembleSingleData(data);
			
			//创建列表对应的多个值属性(一个值即为一个数组)
			var rowDatas = DigiCompass.Web.app.assembleGrid.assembleData(data);
			
			//从全局参数中获取当前id是否已经保存过了，如果存在修改即可，否则新增
			var tempGridData = getAssembleGridDataFromArry(id);
			if(tempGridData != null){
				tempGridData.categoryLen = categoryLen;
				tempGridData.oldDatas = data['data'];
				tempGridData.rowDatas = rowDatas;
				tempGridData.argumentDatas = argumentDatas;
				tempGridData.dragArgumentDatas = dragArgumentDatas;
				tempGridData.fnName = fnName;
				tempGridData.fnCommand = fnCommand;
				if(data.versionId && data.versionId != ''){
					tempGridData.isUpdate = true;
				}else{
					tempGridData.isUpdate = false;
				}
			}else{
				var data_obj = {};
				data_obj.gridId = id;
				data_obj.categoryLen = categoryLen;
				data_obj.oldDatas = data['data'];
				data_obj.rowDatas = rowDatas;
				data_obj.argumentDatas = argumentDatas;
				data_obj.dragArgumentDatas = dragArgumentDatas;
				data_obj.fnName = fnName;
				data_obj.fnCommand = fnCommand;
				if(data.versionId && data.versionId != ''){
					data_obj.isUpdate = true;
				}else{
					data_obj.isUpdate = false;
				}
				assembleGridDataArry.push(data_obj);
			}
			
			//创建列信息
			var columnsInfo = DigiCompass.Web.app.assembleGrid.assembleColumn(data,categoryLen,isEditable,overrideCreateEditFun,id,formatConfig,validateConfig);
			
			//构建列头
			var columns = columnsInfo.columns;
			var fields = columnsInfo.fields;
			
			//默认分组列
			var groupers = [];
			if(categoryLen > 1){
				groupers.push('category0');
			}
			
			//创建Store
			var store = Ext.create('Ext.data.ArrayStore', {
				fields : fields,
				groupers: groupers,
				data : singleData
			});
			
			//组建存在时重新配置，不存在时创建Grid
			var reversalPanelCmp = Ext.getCmp(reversalPanel_id);
			if (reversalPanelCmp) {
				
				reversalPanelCmp.setTitle(title);
				
//				reversalPanelCmp.panelTitle = title;
				
				
				
				var eventBtn = Ext.getCmp('edit_' + id);
				if(isEditable && eventBtn && !eventBtn.isVisible()){
					DigiCompass.Web.app.navigationBar.resetNavigationBarTitle(data.scenarioId,title)
	    			var naviBarPath = DigiCompass.Web.app.navigationBar.generateNavigationBarPath(data.scenarioId);
					reversalPanelCmp.setNavigation(naviBarPath);
				}
				
				
				
				
				var vformPanel = Ext.getCmp(vformPanel_Id);
				if(vformPanel){
					var formArguments = {};
					formArguments.versionName = oldData['versionName'];
					formArguments.versionId = oldData['versionId'];
					formArguments.comment = oldData['comment'];
					vformPanel.setValues(formArguments);
				}
				
//			if (Ext.getCmp(id)) {
				var temp_grid = Ext.getCmp(id);
				temp_grid.getStore().loadData(singleData);
				
				//更新Title
				if(config.isEditable){
//					temp_grid.setTitle(title);
				}
				
				//message
				if(fnCommand == 'COMMAND_QUERY_DRAG_GRID'){
					//当执行Drag时切换ActiveTab
					var dragGrid = DigiCompass.Web.app.assembleGrid.getAssembleGridDataFromArray(id);
		        	//获取对象，拿Scenario
		    		if(dragGrid){
		    			var _isDrag = dragGrid.dragArgumentDatas.isDrag;
			    		var _tableName = dragGrid.dragArgumentDatas.tableName;
			    		if(_isDrag && _tableName){
			    			var gridTabId = DigiCompass.Web.UI.Cmp.TableName.getGridTabIdByTableName(_tableName);
			    			if(gridTabId && Ext.getCmp(gridTabId)){
			    				Ext.getCmp('centerBottomPanelId').setActiveTab(gridTabId);
			    			}
			    		}
		    		}
					alertSuccess('The data has initialization into the grid!');
				}
				//2012-11-5 处理TabPanel被Remove后Grid没有被销毁不能重现展现问题
				var hasExist = false;
				if(tempCmp){
					var items = tempCmp.items.items;
					var len = items.length;
					if(len > 0){
						for(var i=0;i<len;i++){
//							if(items[i].id == id){
							if(items[i].id == reversalPanel_id){
								hasExist = true;
							}
						}
					}
				}
				if(!hasExist){
				}
			} else {
				//创建Grid可编辑支持插件
				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			        clicksToEdit: 1
			    });
				
				//Save
				var saveBtn = Ext.create('Ext.Button', {
				    text: 'Save',
//				    hidden:  data.isSingleEdit ? false : true,
				    tooltip:'Save or update current version!',
				    handler: function() {
//				    	DigiCompass.Web.app.assembleGrid.saveBtnHandler(id,moduleType,command);
				    	var error = false;
				    	var view = _grid.getView();				    	
				    	var store = _grid.getStore();
				    	var columnLength = _grid.columns.length;			    	 
				    	store.each(function(r,idx){			    	
					    	 for (var i = 0; i < columnLength; i++) {
						    	  cell = view.getCellByPosition({row: idx, column: i});			    	  					    	  
						    	  fieldName = _grid.columns[i].dataIndex;
						    	  if (fieldName && fieldName.indexOf("category") == -1) {
							    	   //Do your validation here
						    		   var value = r.get(fieldName);
						    		   var valid;
						    		   if(value == null || value.length ==0){
						    			   valid = false;
						    		   }else{
						    			   if(config && config.validateConfig && config.validateConfig.tableValidateF){
						    				   valid = config.validateConfig.tableValidateFn(value);
						    			   }else{
						    				   valid = true;
						    			   }
						    		   }
							    	   
						    		   if(!valid){ // 验证失败
						    			   cell.removeCls("cmp-grid-success-cell");							    		   
							    		   cell.addCls("cmp-grid-error-cell");		
							    		   cell.set({'data-errorqtip': 'invalid value'});
						    		   }else if(r.isModified(fieldName)){ // 修改
						    			   cell.removeCls("cmp-grid-error-cell");
								    	   cell.addCls("cmp-grid-success-cell");
								    	   cell.set({'data-errorqtip': ''});
						    		   }else{
						    			   cell.set({'data-errorqtip': ''});
						    		   }
						    	  }
					    	 } 			    		
				    	});
				    	if(!error){
				    		DigiCompass.Web.app.assembleGrid.saveBtnHandler(id,moduleType,command);
				    	}
				    }
				});
				
				//Save As
				var saveAsBtn = Ext.create('Ext.Button', {
				    text: 'Save As',
				    hidden: isSaveAs=="1" ? false : true,
//				    hidden:  data.isSingleEdit ? false : true,		
				    tooltip:'Save as a new version!',
				    handler: function() {
				    	DigiCompass.Web.app.assembleGrid.saveAsBtnHandler(id,moduleType,command);
				    }
				});
				
				//Edit
				var editBtn = Ext.create('Ext.Button', {
					id:'edit_' + id,
				    text: 'Edit',
//				    hidden: data.isSingleEdit ? true : false,
				    hidden:  data.edit ? true : false,
				    tooltip:'edit current version!',
				    handler: function() {
//				    	var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
//				    	if(scenarioCenterPanel){
//				    		scenarioCenterPanel.setVisible(false);
//				    	}
//				    	Ext.getCmp('obj-details').removeAll(false);
				    	
//				    	Ext.getCmp(main_ReversalPanel_Id).removeAll(false);
				    	
//				    	var mainTab = Ext.getCmp('main_tab').getActiveTab();
//				    	if(mainTab){
//				    		mainTab.removeAll(false);
//				    		
//				    		var oldReversePanel = Ext.getCmp(reversalPanel_id);
//				    		if(oldReversePanel){
//				    			
//				    			/**
//				    			 * args:{objId:'1',type:'scenario',uuid:'1',swapPanel:'xxxId'}
//				    			 */
//				    			var args = {};
//				    			args.objId = data.scenarioId;
//				    			args.type = title;
//				    			args.uuid = '';
//				    			args.swapPanel = reversalPanel_id;
//				    			DigiCompass.Web.app.navigationBar.setNavigationBar(args);
//				    			var naviBarPath = DigiCompass.Web.app.navigationBar.generateNavigationBarPath(data.scenarioId);
//				    			oldReversePanel.getToolBar('navigation').add(naviBarPath);
//				    			oldReversePanel.drallModel(title);
//				    			
//				    			mainTab.add(oldReversePanel);
//				    		}
//				    	}
				    	
				    	var mainTab = Ext.getCmp('outerTabPanelId'+data.scenarioId);
				    	if(mainTab){
				    		mainTab.obj = {
				    				tableName : data.tableName,
									scenarioId : data.scenarioId,
									versionId : data.versionId,
									planningCycleId : data.planningCycleId,
									siteGroupId : data.siteGroupId,
									technologyId : data.technologyId,
									siteGroupPlannedId : data.siteGroupPlannedId,
									dragVersionId : data.dragVersionId
				    		}
				    		
				    		var t1 = new Date().getTime();
				    		
				    		mainTab.removeAll(false);
				    		
				    		var t2 = new Date().getTime();
					    	console.log('remove >> :'+(t2-t1));
				    		
				    		var oldReversePanel = Ext.getCmp(reversalPanel_id);
				    		if(oldReversePanel){
				    			
				    			var title = oldReversePanel.getTitle();
				    			
				    			/**
				    			 * args:{objId:'1',type:'scenario',uuid:'1',swapPanel:'xxxId'}
				    			 */
				    			var args = {};
				    			args.objId = data.scenarioId;
				    			args.type = title;
				    			args.uuid = '';
				    			args.swapPanel = reversalPanel_id;
				    			args.parentId = oldReversePanel.ownerCt.id;
				    			args.itemIndex = oldReversePanel.ownerCt.items.indexOf(oldReversePanel);
				    			args.eventBtnId = 'edit_' + id;
//				    			args.oldWidth = oldReversePanel.getWidth();
//				    			args.oldHeight = oldReversePanel.getHeight();
				    			
				    			DigiCompass.Web.app.navigationBar.setNavigationBar(args);
				    			var naviBarPath = DigiCompass.Web.app.navigationBar.generateNavigationBarPath(data.scenarioId);
				    			oldReversePanel.setNavigation(naviBarPath);
				    			oldReversePanel.drallModel(title);
				    			oldReversePanel.toFront();
				    			
				    			mainTab.suspendEvents();
								mainTab.add(oldReversePanel);
								mainTab.resumeEvents();
								
								var t3 = new Date().getTime();
						    	console.log('add >> :'+(t3-t2));
								
				    			//设置Position
				    			oldReversePanel.setPosition(0,0);
				    			oldReversePanel.reSetSize(mainTab.getWidth()-10,mainTab.getHeight()-10);
				    			
				    			var t4 = new Date().getTime();
						    	console.log('resetsize >> :'+(t4-t3));
				    			
				    			/**
				    			 * hidden Edit
				    			 */
				    			var eventBtn = Ext.getCmp('edit_' + id);
								if(eventBtn){
									eventBtn.setVisible(false);
								}
								if(this.brothers){
				    				for(var key in this.brothers){
				    					this.brothers[key].hide();
				    				}
				    			}
				    			
				    			/**
				    			 * fire Versions
				    			 */
				    			var tableName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(id);
				    			DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(tableName,{
						    		planningCycleId: data.planningCycleId,
					    			scenarioId:  data.planningCycleId,
					    			siteGroupId:  data.siteGroupId,
					    			siteGroupPlannedId:  data.siteGroupPlannedId,
					    			technologyId:  data.technologyId,
					    			versionId:  data.versionId
						    	}, false);
				    			
//				    			Ext.getCmp('edit_' + id).setVisible(false);
				    		}
				    	}
				    	
				    	
				    	
				    	
//				    	DigiCompass.Web.app.assembleGrid.dataEditHandler(id,data.scenarioId);
				    }
				});
				
				//Remove
				var dropBtn = Ext.create('Ext.Button', {
					text: 'Remove',
//					hidden:  data.isSingleEdit ? false : true,
					handler: function(){
						//check current version is or not delete
						var temp = getAssembleGridDataFromArry(id);
						if(temp){
							if(temp.dragArgumentDatas.isDrag){
								alertError("Current version come from left grid,you cann't remove it!");
								return;
							}
						}
						Ext.MessageBox.show({
		                    title: 'Message',
					        msg: "Are you sure to remove the grid data?",
					        width:300,
					        buttons: Ext.MessageBox.YESNO,
					        fn: function(e) {
					        	if(e == 'yes') {
					        		DigiCompass.Web.app.assembleGrid.dropBtnHandler(id,moduleTypeOfRemove,commandOfRemove);
					        	}
					        },
					        icon : Ext.MessageBox.QUESTION
		              });
						
					}
				});
				
				//Reset
				var resetBtn = Ext.create('Ext.Button', {
					text: 'Reset',
//					hidden:  data.isSingleEdit ? false : true,
					handler: function(){
						Ext.MessageBox.show({
		                    title: 'Message',
					        msg: "Are you sure to reset the grid?",
					        width:300,
					        buttons: Ext.MessageBox.YESNO,
					        fn: function(e) {
					        	if(e == 'yes') {
					        		DigiCompass.Web.app.assembleGrid.resetBtnHandler(id,fnName,fnCommand);
					        	}
					        },
					        icon : Ext.MessageBox.QUESTION
		              });
					}
				});
				
				//refresh
				var refreshBtn = Ext.create('Ext.Button', {
				    text: 'Refresh',
				    handler: function() {
				    	DigiCompass.Web.app.assembleGrid.resetBtnHandler(id,fnName,fnCommand);
				    }
				});
				
				//从历史数据中采集
				var historyVersionBtn = Ext.create('Ext.Button', {
				    text: 'Versions',
				    hidden : true,
//				    hidden: data.isSingleEdit ? true : false,
				    handler: function() {
				    	var tableName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(id);
				    	DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(tableName,{
				    		planningCycleId: data.planningCycleId,
			    			scenarioId:  data.planningCycleId,
			    			siteGroupId:  data.siteGroupId,
			    			siteGroupPlannedId:  data.siteGroupPlannedId,
			    			technologyId:  data.technologyId,
			    			versionId:  data.versionId
				    	});
				    }
				});
				
				var returnBtn = Ext.create('Ext.Button', {
				    text: 'Return',
				    hidden: true,
				    handler: function() {
				    	
//				    	var main_ReversalPanel_Id = 'main_ReversalPanel_Id' + data.scenarioId;
//						var obj_details_tbar_id = 'obj_details_tbar_' + id;
//				    	
//				    	var tempPanel = Ext.getCmp(id);
//				    	var reversalPanel = Ext.getCmp(reversalPanel_id);
//				    	
//				    	var main_ReversalPanel = Ext.getCmp(main_ReversalPanel_Id);
//				    	var oldFront = main_ReversalPanel.bak.front;
//				    	
//				    	reversalPanel.switchFront(tempPanel);
//				    	main_ReversalPanel.switchFront(oldFront);
//				    	
//				    	
//				    	DigiCompass.Web.app.navigationBar.removeLastNavigationBarById(data.scenarioId);
//						var navigation = DigiCompass.Web.app.navigationBar.generateNavigationBarStr(data.scenarioId);
//						
////						var main_ReversalPanel = Ext.getCmp(main_ReversalPanel_Id);
//						main_ReversalPanel.setNavigation(navigation);
//						
//						var divTitle = DigiCompass.Web.app.navigationBar.setObjectDetail(navigation);
//						main_ReversalPanel.setTitle(divTitle);
//
//						Ext.getCmp(obj_details_tbar_id).removeAll();
//						Ext.getCmp(obj_details_tbar_id).setVisible(false);
//				    	
//				    	
//				    	var centerTitle = tempPanel.title;
//				    	//临时解决办法，后面再改
//				    	centerTitle = centerTitle.substring(36,centerTitle.length-6);
//				    	tempPanel.setTitle(centerTitle);
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
//				    	var tempPanel = Ext.getCmp(id);
//				    	var reversalPanel = Ext.getCmp(reversalPanel_id);
//				    	reversalPanel.switchFront(tempPanel);
//				    	
//						var main_ReversalPanel = Ext.getCmp(main_ReversalPanel_Id);
						
//						var title = tempPanel.title;
//						title = '<div align="center">Object Details---'+title+'</div>';
//						tempPanel.setTitle(title);
//						main_ReversalPanel.switchFront(main_ReversalPanel.bak.front);
//						main_ReversalPanel.setTitle(title);
				    	
				    	
				    	
				    	
				    	
				    	
////				    	Ext.getCmp('obj-details').add(Ext.getCmp(id));
//				    	Ext.getCmp('obj-details').removeAll(false);
//				    	
//				    	Ext.getCmp('obj-details').add(Ext.getCmp('scenarioCenterPanelId'));
//				    	
////				    	Ext.getCmp('centerBottomTabOneIdb95ace72-31d2-4fd6-995f-95846a871eff').insert(0,Ext.getCmp(id));
////				    	centerBottomTabOneIdb95ace72-31d2-4fd6-995f-95846a871eff
//				    	Ext.getCmp(reversalPanel_id).add(Ext.getCmp(id));
//				    	
////				    	DigiCompass.Web.app.assembleGrid.resetBtnHandler(id,fnName,fnCommand);
//				    	
//				    	
//				    	Ext.getCmp('obj_details_tbar').removeAll();
//				    	Ext.getCmp('obj_details_tbar').add(DigiCompass.Web.app.navigationBar.clearTheLastNavigation());
//				    	Ext.getCmp('obj-details').setTitle(DigiCompass.Web.app.navigationBar.setObjectDetail('Scenario'));
//				    	
////				    	var cmpId = 'DataEditPanel_'+data.scenarioId;
////				    	var tempCmp = Ext.getCmp(cmpId);
////				    	if(tempCmp){
////				    		tempCmp.destroy();
////				    	}
//				    	
//				    	var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
//				    	if(scenarioCenterPanel){
//				    		scenarioCenterPanel.setVisible(true);
//				    	}
//				    	DigiCompass.Web.UI.Scenario.groupPanelReturn();
				    	//刷新数据
				    	
				    	
				    }
				});
				
				var btn_clear = Ext.create('Ext.Button',{
					text:'Clear Grouping',
		            handler : function(a,b,c,d) {
		                features.cleanGrouping();
					}
				});
				
				var msg = function(title, msg, error) {
			        Ext.Msg.show({
			            title: title,
			            msg: msg,
			            minWidth: 200,
			            modal: true,
			            icon: error == false ? Ext.Msg.INFO : Ext.Msg.ERROR,
			            buttons: Ext.Msg.OK
			        });
			    };
			    
			    Ext.apply(Ext.form.field.VTypes, {
			        //  vtype validation function
			        file: function(val, field) {
			            return /\.(xlsx|xls|csv)$/i.test(val);
			        },
			        // vtype Text property: The error text to display when the validation function returns false
			        fileText: 'Not a valid file.  Must be "xlsx|xls|csv".'
			    });
				
				var btn_import = Ext.create('Ext.Button',{
					text:'Import',
//					hidden:  data.isSingleEdit ? false : true,
		            handler : function(a,b,c,d) {
	            	var win = new Ext.Window(
	            		    {
	            		        layout: 'fit',
	            		        width: 500,
	            		        height: 300,
	            		        modal: true,
	            		        closeAction: 'destroy',
	            		        items: new Ext.form.Panel(
	            		        {	            	
	            		           frame: true,
	            		           defaults: {
	            		               anchor: '100%',
	            		               allowBlank: false,
	            		               msgTarget: 'side',
	            		               labelWidth: 50
	            		           },
	            		           items: [{
	            		               xtype: 'textfield',
	            		               fieldLabel: 'Version',
	            		               name: 'versionName'
	            		           },{
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
	            		            	   var tableName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(id);
	            		                   var form = this.up('form').getForm();
	            		                   if(form.isValid()){
		            		           			/*datas.id = data.id;
		            		        			datas.versionId = data.versionId;
		            		        			datas.planningCycleId = data.planningCycleId;
		            		        			datas.scenarioId = data.scenarioId;
		            		        			datas.technologyId = data.technologyId;
		            		        			datas.siteGroupPlannedId = data.siteGroupPlannedId;
		            		        			datas.siteGroupId = data.siteGroupId;
		            		        			datas.renderCmp = data.renderCmp;*/
	            		                       form.submit({
	            		                           url: 'upload',
	            		                           params: {
	            		                        	   viewId : data.id,
	            		                        	   renderCmp : data.renderCmp,
	            		                        	   scenarioId : data.scenarioId,
	            		                        	   siteGroupId : data.siteGroupId,
	            		                        	   planningCycleId : data.planningCycleId,
	            		                        	   siteGroupPlannedId : data.siteGroupPlannedId,
	            		                        	   technologyId : data.technologyId,
	            		                        	   MODULE_TYPE : fnName,
	            		                        	   tableName : tableName,
	            		                        	   refreshCommand : fnCommand
	            		                           },
	            		                           waitMsg: 'Uploading your file...',
	            		                           success: function(fp, o) {	       
		            		                   		   var datas = {};
		            		                		   datas.id = o.result.viewId;
		            		                		   datas.versionId = o.result.id;
		            		                		   datas.planningCycleId = o.result.planningCycleId;
		            		                		   datas.scenarioId = o.result.scenarioId;
		            		                	       datas.technologyId = o.result.technologyId;
		            		                		   datas.siteGroupPlannedId = o.result.siteGroupPlannedId;
		            		                		   datas.siteGroupId = o.result.siteGroupId;
		            		                		   datas.renderCmp = o.result.renderCmp;
	            		                        	   DigiCompass.Web.app.assembleGrid.refreshGrid(o.result.MODULE_TYPE,o.result.refreshCommand,datas);
	            		                        	  // msg('Success', 'Processed file on the server', false);	 
	            		                        	   win.close();
	            		                           },
	            		                           failure: function(form, action){
	            		                        	   msg('Failure', 'Error processed file on the server', true);
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
	            		        })
	            		    });
	            	win.show();
					}				
				});
				
				var btn_export = Ext.create('Ext.Button',{
					text:'Export',
		            handler : function(a,b,c,d) {
		            	var tableName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(id);
		    			var temp = getAssembleGridDataFromArry(id);
		    			if(temp != null){
		    				var datas = temp.argumentDatas;
		    				var data = {
		    					tableName : tableName,
		    					MODULE_TYPE : fnName,
		    					COMMAND : fnCommand, 
	    						versionId: datas.versionId,
								planningCycleId: datas.planningCycleId,
								scenarioId:datas.scenarioId,
								technologyId:datas.technologyId,
								siteGroupId:datas.siteGroupId,
								siteGroupPlannedId:datas.siteGroupPlannedId,
//								queryType:datas.queryType,
								title : title
			            	};
			            	var str = context.param(data);
			            	//window.location.href = "download?"+str;
			            	downloadURL("download?"+str);
		    			}		            	
		            }				
				});
				
				var features;
				if(id.indexOf("COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_MOD") != -1){
					features =  Ext.create('Ext.grid.feature.MultiGroupingSummary',{baseWidth:50, groupHeaderTpl: '{disName}'});
				}else{
					features =  Ext.create('Ext.grid.feature.MultiGroupingSummary',{
						baseWidth:50,
				        groupHeaderTpl: '{disName}'
				      });
				}
				
				var obj_details_tbar = Ext.create('Ext.toolbar.Toolbar', {
				    id: obj_details_tbar_id,
				    hidden: true,
				    items: []
				});
				
				var btntbar = Ext.create('Ext.toolbar.Toolbar', {
				    items: isEditable == true ? [saveBtn,saveAsBtn,dropBtn,resetBtn,historyVersionBtn,refreshBtn,btn_clear, btn_import, btn_export,editBtn,returnBtn] : [refreshBtn,btn_clear, btn_export]
				});
				//TODO 创建Chart
				//var _chartHtmlDiv="<div id='"+configId+"'></div>";
				var _chartHtmlDiv="<div id='"+obj_details_tbar_id+"'></div>";	
				var _chart = Ext.create('Ext.panel.Panel', {
					height : 600,			
					width:'100%',
					collapsible : false,
					region: 'west',
					divId:obj_details_tbar_id,
				    html: _chartHtmlDiv,
				    autoScroll : true
				   /* initComponent : function() {
				       this.callParent(arguments);
			   			 },
				
				    onRender : function() {
				        var me = this;
				
				       // me.doc = Ext.getDoc();
				        me.callParent(arguments);
				        me.drawChart();
			   			 },
				
				    drawChart : function(){
					    d3.select(_chart.divId).selectAll("p")
								    .data([4, 8, 15, 16, 23, 42])
								  .enter().append("p")
								    .text(function(d) { return "I’m number " + d + "!"; });
				    }*/
				    //listeners:Chart_Subscribers(data,obj_details_tbar_id)
				});
				//Chart_Subscribers(data,obj_details_tbar_id);
				//创建Grid
				var _grid = Ext.create('Ext.grid.Panel', {
					id : id,
					selType: isEditable === true ? 'cellmodel' : 'rowmodel',
//					margins : '5 5 5 5',
					collapsible : false,
					border : false,
					columnLines : true,
					draggable : false,
					enableColumnHide : true,
					enableColumnMove : true,
					features:features,
					store : store,
					columns : columns,
					height : gridHeight,
					width : '100%',
					//renderTo : renderdiv,
//					contentEl : renderdiv,
//					title : title,
					plugins: [cellEditing],					
					viewConfig : {
						stripeRows : true,
						markDirty : false
					},
					listeners : {
						//( Ext.selection.CellModel this, Ext.data.Model record, Number row, Number column, Object eOpts )
						deselect : function(cell,record,row,column,eOpts){
							
//							console.log('deselect '+row+','+column+','+Ext.JSON.encode(record.raw));
						},
						select : function(cell,record,row,column,eOpts){
//							console.log('select'+row+','+column);
							var temp = getAssembleGridDataFromArry(id);
							if(temp != null){
								//指定点击cell对应的行列坐标
								temp.colIndex = column;
								temp.rowIndex = row;
							}
						},
						render : function(){
//							obj_details_tbar_2.render(_grid.tbar);
						}
						//,
//						beforerender : function(e,eOpts){
//							if(categoryLen > 1){
//								_grid.columns[0].hidden = true;
//							}
//						},
//						reconfigure : function(e,eOpts){
//							if(categoryLen > 1){
//								_grid.columns[0].hidden = true;
//							}
//						}
					},
//					tbar : {xtype: 'container',items: [obj_details_tbar,btntbar]},
//					tbar : isEditable == true ? [saveBtn,saveAsBtn,dropBtn,resetBtn,
//					                             historyVersionBtn,
//					                             refreshBtn,btn_clear, btn_import, btn_export, editBtn, returnBtn] : [refreshBtn,btn_clear],
					formatConfig : formatConfig,
					validateConfig : validateConfig
				});
				
				_grid.getStore().on("update", function( self, record, operation, modifiedFieldNames, eOpts ){
			    	var view = _grid.getView();			    	
			    	var columnLength = _grid.columns.length;			    	 
			    	self.each(function(r,idx){			    	
				    	 for (var i = 0; i < columnLength; i++) {
					    	  cell = view.getCellByPosition({row: idx, column: i});			    	  					    	  
					    	  fieldName = _grid.columns[i].dataIndex;
					    	  if (fieldName && fieldName.indexOf("category") == -1) {
						    	   //Do your validation here
					    		   var value = r.get(fieldName);						    		  
					    		   var valid;
					    		   if(value == null || value.length ==0){
					    			   valid = false;
					    		   }else{
					    			   valid = config.validateConfig.tableValidateFn(value);
					    		   }
					    		   
					    		   if(!valid){ // 验证失败
					    			   cell.removeCls("cmp-grid-success-cell");							    		   
						    		   cell.addCls("cmp-grid-error-cell");		
						    		   cell.set({'data-errorqtip': 'invalid value'});
					    		   }else if(r.isModified(fieldName)){ // 修改
					    			   cell.removeCls("cmp-grid-error-cell");
							    	   cell.addCls("cmp-grid-success-cell");
							    	   cell.set({'data-errorqtip': ''});
					    		   }					    		   						    	   
					    	  }
				    	 } 			    		
			    	});
				});
				
				 var bindData = function(data){
					if(!Ext.isEmpty(data.address)){
						return data.address;
					}
			    	return data.state+', '+data.suburb+', '+data.streetName+', '+ data.streetNo;
			    }
				if(isShowSiteTip){
					console.log(data) 
					//此处添加Tip代码
					_grid.getView().on('render', function(view){
						view.tip = Ext.create('Ext.tip.ToolTip', {  
							//title : 'Address:',
				            target: view.el,          // The overall target element.  
				            delegate: view.itemSelector, // Each grid row causes its own seperate show and hide.  
				            trackMouse: true,         // Moving within the row should not hide the tip.  
				            hideDelay : false,
				            dismissDelay : 0,
				            draggable : true,
				            maxWidth: 300,
							minWidth: 100,
							showDelay: 50,
				            renderTo: Ext.getBody(),  // Render immediately so that tip.body can be referenced prior to the first show.  
				            html : 'lodding...',
				            listeners: {              // Change content dynamically depending on which element triggered the show.  
				                beforeshow: function (tip) {
									var record = view.getRecord(tip.triggerElement);
									var id = rowDatas[record.index][0];
									if(record.bindData){
										tip.update(bindData(record.bindData));
									}else{
										tip.update('loading...');
					             		cometdfn.request({MODULE_TYPE : 'MOD_SNAPSHOT_SITE',COMMAND : 'COMMAND_QUERY_INFO',
					             			id : id}, 
						         			function(data){
						                 		record.bindData = Ext.JSON.decode(data.BUSINESS_DATA);
						                 		console.log(view.tip.triggerElement)
//						                 		console.log('load success, site id = '+ record.get('category0'), record.bindData);
						                 		if(view.tip.triggerElement){
						                 			var _rec = view.getRecord(view.tip.triggerElement);
						                 			if(_rec && _rec.index === record.index){
						                 				view.tip.update(bindData(record.bindData));
						                 			}
						                 		}
					                 	});
									}
									return true;
								} 
							}  
					    }); 
					});
					
					
					
				}
				
				
				
				
				
				
//				var _pos = DigiCompass.Web.UI.Cmp.TableName.getGridPanelRenderIndexByGridId(id);
//				Ext.getCmp(renderCmp).add(_grid,_pos);
//				if(Ext.getCmp(renderCmp)){
//					Ext.getCmp(renderCmp).add(_grid);
//				}
				
//				var obj_details_tbar = Ext.create('Ext.toolbar.Toolbar', {
//				    id: obj_details_tbar_id,
//				    hidden: false,
//				    items: ['test']
//				});
				
//				var obj_details_tbar = Ext.create('Ext.toolbar.Toolbar', {
//				    id: obj_details_tbar_id,
////				    hidden: false,
//				    renderTo : _grid.tbar,
//				    items: ['testdddddddd']
//				});
				
				var vformPanel = new DigiCompass.Web.app.VersionForm({
					id : vformPanel_Id,
					edit : config.isEditable || false
				});
				
				//TODO 创建chart pannel
				/**var ChartPanel = Ext.create('Ext.panel.Panel', {				
					height : 300,			
					width:'100%',
					margins : '5 0 5 5',
					panelTitle : (data.edit ? 'Object Detail - ' : '') +title,
					front : _grid,
					collapsible : true,
					dockedItems: [{
				        xtype: 'toolbar',
				        dock: 'top',
				        items: [{
				            text: 'popup',
				            handler : function(){		            			        		
				            	Ext.create('DigiCompass.Web.app.AutosizeWindow', {
				            		title: 'Network Map',
				            	    height: 800,
				            	    width: 1000,
				            	    layout: 'fit',
				            	    border: false,
				            	    items: Ext.create('Ext.panel.Panel', {		
					        		    html: "<div id='map_canvas_planned_site_pop' style='width:100%; height:100%'></div>"		    
					        		})
				            	}).show();
				            	if(data){
				        			createMap("map_canvas_planned_site_pop", data.name, data.latitude, data.longitude);
				        		}else{
				        			createMap("map_canvas_planned_site_pop", null, null, null);
				        		}
				            }
				        }]
				    }],
				    html: "<div id='map_canvas_planned_site' style='width:100%; height:100%'></div>"		    
				});
				var ChartPanel = new DigiCompass.Web.app.ChartPanel({	
					id : reversalPanel_id,
					panelTitle : (data.edit ? 'Object Detail - ' : '') +title,
					canTurnover : config.isEditable || false,
					margins : '5 0 5 5',
					front : _grid,
					height : 300,
					back : vformPanel,
					showNavigation : data.showNavigation || false,
					bodyDbClickNarrow : function(){
					},
					bodyDbClickMagnify : function(){
					},
					listeners:{
						afterrender : function(){
						}
					}
				});*/
				
				
				//TODO 创建pannel
				
				var reversalPanel = new DigiCompass.Web.app.ReversalPanel({	
					id : reversalPanel_id,
					panelTitle : (data.edit ? 'Object Detail - ' : '') +title,
					canTurnover : config.isEditable ||config.ischart ||false,
					margins : '5 0 5 5',
					back : ischart === true ? _grid : vformPanel,
					front : ischart === true ? _chart : _grid,
					height : 300,
					//back : vformPanel,
					showNavigation : data.showNavigation || false,
//					bodyDbClick : data.isSingleEdit ? false : true,
					bodyDbClickNarrow : function(){
//						Ext.getCmp('obj_details_tbar').removeAll();
//				    	Ext.getCmp('obj_details_tbar').add(DigiCompass.Web.app.navigationBar.clearTheLastNavigation());
//				    	
//				    	var cmpId = 'DataEditPanel_'+data.scenarioId;
//				    	var tempCmp = Ext.getCmp(cmpId);
//				    	if(tempCmp){
//				    		tempCmp.destroy();
//				    	}
//				    	
//				    	var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
//				    	if(scenarioCenterPanel){
//				    		scenarioCenterPanel.setVisible(true);
//				    	}
//				    	DigiCompass.Web.UI.Scenario.groupPanelReturn();
					},
					bodyDbClickMagnify : function(){
//						var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
//				    	if(scenarioCenterPanel){
//				    		scenarioCenterPanel.setVisible(false);
//				    	}
//				    	DigiCompass.Web.app.assembleGrid.dataEditHandler(id,data.scenarioId);
					},
					listeners:{
						afterrender : function(){
//							Ext.getCmp('obj-details').header.addCls('pointer');
//							Ext.getCmp(reversalPanel_id).setNavigation('testestestestesest12346');
//							Ext.getCmp(reversalPanel_id).setTitle(title);
						}
					}
				});
				
				reversalPanel.setNavigation(title);
				//alert(configId);
				//tempCmp.add(reversalPanel)；
				
				if(tempCmp){
					if(fnName == "MOD_LAYER_BAND_COUNT"){
						tempCmp.insert(2, reversalPanel);
					} else if(fnName == "MOD_LAYER_CAPACITY_BAND_COUNT"){
						tempCmp.insert(3, reversalPanel);
					}else {
						tempCmp.add(reversalPanel);
					}
					try{
						if(data.BUSINESS_DATA.rawData.data && data.BUSINESS_DATA.rawData.data.length){
							if(configId==="MOD_REPORT_ID"||configId==="MOD_REPORT_OPEX_ID"||configId==="MOD_REPORT_INCOME_ID"||configId==="MOD_REPORT_EXPENSE_ID"||configId==="MOD_REPORT_RECHARGE_ID"){
								//Chart_Subscribers(data,configId);
								
								SubscribersDivInfo[obj_details_tbar_id] = data; 
								if(configId==="MOD_REPORT_ID"){
									Chart_Subscribers(data,obj_details_tbar_id);
								}
	//							alert(1); 
								
							}else if(configId==="MOD_REPORT_GROWTH_UPGRADE_ID"||configId==="MOD_REPORT_GROWTH_UPGRADE_OPEX_AMOUNT_ID"||configId==="MOD_REPORT_GROWTH_UPGRADE_INCOME_AMOUNT_ID"||configId==="MOD_REPORT_GROWTH_UPGRADE_EXPENSE_AMOUNT_ID"||configId==="MOD_REPORT_GROWTH_UPGRADE_RECHARGE_AMOUNT_ID"){
								//Redow_Chart_Subscribers("MOD_REPORT_"+configId.substring(26,configId.length-10)+"_ID");
								for(key in SubscribersDivInfo){
									if(key.indexOf(configId.substring(26,configId.length-10)+"_ID") > 0){
										
										Chart_Subscribers(SubscribersDivInfo[key],key);
										//delete	SubscribersDivInfo[key];
									}
									
								}
								Chart_GrowthUpgrade(data,obj_details_tbar_id);
	//							Chart_GrowthUpgrade(data,configId,configId);
							}else if(configId==="MOD_REPORT_GROWTH_CAPACITY_QTY_ID"||configId==="MOD_REPORT_GROWTH_CAPACITY_OPEX_AMOUNT_ID"||configId==="MOD_REPORT_GROWTH_CAPACITY_INCOME_AMOUNT_ID"||configId==="MOD_REPORT_GROWTH_CAPACITY_EXPENSE_AMOUNT_ID"||configId==="MOD_REPORT_GROWTH_CAPACITY_RECHARGE_AMOUNT_ID"){
								//Redow_Chart_Subscribers("MOD_REPORT_INCOME_ID");
								Chart_GrowthNewCapacity(data,obj_details_tbar_id);
	//							Chart_GrowthNewCapacity(data,configId,configId);
							}else if(configId==="MOD_REPORT_COVERAGE_AMOUNT_ID"||configId==="MOD_REPORT_COVERAGE_OPEX_AMOUNT_ID"||configId==="MOD_REPORT_COVERAGE_INCOME_AMOUNT_ID"||configId==="MOD_REPORT_COVERAGE_EXPENSE_AMOUNT_ID"||configId==="MOD_REPORT_COVERAGE_RECHARGE_AMOUNT_ID"){
								Chart_CoverageUnplanned(data,obj_details_tbar_id);
	//							Chart_CoverageUnplanned(data,configId,configId);
								//Redow_Chart_Subscribers("MOD_REPORT_EXPENSE_ID");
							}else if(configId==="MOD_REPORT_COVERAGE_AMOUNT_PLANNED_ID"||configId==="MOD_REPORT_COVERAGE_OPEX_AMOUNT_PLANNED_ID"||configId==="MOD_REPORT_COVERAGE_INCOME_AMOUNT_PLANNED_ID"||configId==="MOD_REPORT_COVERAGE_EXPENSE_AMOUNT_PLANNED_ID"||configId==="MOD_REPORT_COVERAGE_RECHARGE_AMOUNT_PLANNED_ID"){
								Chart_CoveragePlanned(data,obj_details_tbar_id);
	//							Chart_CoveragePlanned(data,configId);
							}else if(configId==="MOD_REPORT_CAPEX_TOTAL_ID"||configId==="MOD_REPORT_OPEX_ID"||configId==="MOD_REPORT_OPEX_TOTAL_ID"||configId==="MOD_REPORT_INCOME_TOTAL_ID"||configId==="MOD_REPORT_EXPENSE_TOTAL_ID"||configId==="MOD_REPORT_RECHARGE_TOTAL_ID"){
								Chart_CapexTotalAmount(data,obj_details_tbar_id);
	//							Chart_CapexTotalAmount(data,configId);
								//Redow_Chart_Subscribers("MOD_REPORT_RECHARGE_ID");
							}else {
								
								//alert("configId has no match! ");
							}
						}
					}catch(e){
						console.error(e.message, e.stack);
					}
					
				}
				
				
				reversalPanel.addToolBar('toolbar', btntbar);
				
				
				var formArguments = {};
				formArguments.versionName = oldData['versionName'];
				formArguments.versionId = oldData['versionId'];
				formArguments.comment = oldData['comment'];
				vformPanel.setValues(formArguments);
				
			}
			
			
		}

		
		//删除函数
		DigiCompass.Web.app.assembleGrid.dropBtnHandler = function(id,moduleTypeOfRemove,commandOfRemove){
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				//数据验证
				var hasData = false;
				var formData = temp.rowDatas;
				for(var i = 0; i < formData.length; i++){
					var rowData = formData[i];
					for(var j = temp.categoryLen + 1; j < rowData.length; j++){
						var cellData = rowData[j];
						if(cellData.length > 1){
							var cellValue = cellData[0];
							if(!Ext.isEmpty(cellValue)){
								hasData = true;
								break;
							}
						}
					}
				}
				if(!hasData){
					alertWarring("There isn't data to remove in the grid!");
					return;
				}
//				if(!hasData && temp.argumentDatas.versionId && temp.oldDatas.length > 0){
//					alertWarring("There isn't data to remove in the grid!");
//					return;
//				}
				
				var temp = getAssembleGridDataFromArry(id);
				if(temp != null){
					cometdfn.publish({ MODULE_TYPE: moduleTypeOfRemove,COMMAND:commandOfRemove,
						id: id,
						versionId: temp.argumentDatas.versionId,
						planningCycleId: temp.argumentDatas.planningCycleId,
						scenarioId:temp.argumentDatas.scenarioId,
						technologyId:temp.argumentDatas.technologyId,
						siteGroupId:temp.argumentDatas.siteGroupId,
						gridData:temp.argumentDatas.gridData,
						renderCmp:temp.argumentDatas.renderCmp
					});
				}
			}
		}
		
		//删除函数回调操作
		DigiCompass.Web.app.assembleGrid.dropBtnHandlerCallBack = function(data){
			var datas = {};
			datas.id = data.id;
			datas.versionId = data.versionId;
			datas.planningCycleId = data.planningCycleId;
			datas.scenarioId = data.scenarioId;
			datas.technologyId = data.technologyId;
			datas.siteGroupPlannedId = data.siteGroupPlannedId;
			datas.siteGroupId = data.siteGroupId;
			datas.renderCmp = data.renderCmp;
			
			var result = Ext.JSON.decode(data.BUSINESS_DATA);
			if(data.STATUS === 'success'){
				if(result['isSuccess']){
					alertSuccess('Remove success!');
					//删除后，将全局参数中的版本信息设置为空
					datas.versionId = '';
					var temp = getAssembleGridDataFromArry(datas.id);
					if(temp != null){
						temp.argumentDatas.versionId =  '';
						DigiCompass.Web.app.assembleGrid.refreshGrid(temp.fnName,temp.fnCommand,datas);
						
						var reversalPanel_id = 'reversalPanel_' + datas.id;
						var tempGrid = Ext.getCmp(reversalPanel_id);
						var tempForm = tempGrid.back;
						tempForm.setValues({versionId:'',versionName:'',comment:''});
					}
					
					var versionView = Ext.getCmp('versionView');
					if (versionView) {
						versionView.versionId = '';
					}
				}else{
					alertError('Remove failure!'+result.msg);
				}
			}else if(data.customException){
				alertError(data.customException);
			}
		}
		

		
		//保存处理函数
		DigiCompass.Web.app.assembleGrid.saveBtnHandler = function(id,moduleType,command){
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				//数据验证
				var hasEdit = false;
				var formData = temp.rowDatas;
				for(var i = 0; i < formData.length; i++){
					var rowData = formData[i];
					for(var j = temp.categoryLen + 1; j < rowData.length; j++){
						var cellData = rowData[j];
						if(cellData.length > 2){
							if(cellData[cellData.length-2] == 1){
								hasEdit = true;
							}
							var cellValue = cellData[cellData.length-1];
							if(Ext.isEmpty(cellValue)){
								alertWarring("Grid Can't be null!");
								return;
							}
						}
					}
				}
				if(temp.oldDatas.length == 0){
					alertWarring("This is a invalid version,please select a another version!");
					return;
				}
				if(!hasEdit && !temp.dragArgumentDatas.isDrag){
					alertWarring("There isn't data edited!");
					return;
				}
				//拼装需要更新的值，并存于全局参数中
				var gridData = DigiCompass.Web.app.assembleGrid.createSaveOrUpdateArray(id);
				temp.argumentDatas.gridData = gridData;
				//保存数据
				DigiCompass.Web.app.assembleGrid.saveOrUpdateGrid(moduleType,command,id,SAVE_HANDLER);
			}
		}
		
		DigiCompass.Web.app.assembleGrid.saveAsBtnHandler = function(id,moduleType,command){
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				//数据验证
				var formData = temp.rowDatas;
				for(var i = 0; i < formData.length; i++){
					var rowData = formData[i];
					for(var j = temp.categoryLen + 1; j < rowData.length; j++){
						var cellData = rowData[j];
						if(cellData.length > 2){
							var cellValue = cellData[cellData.length-1];
							if(Ext.isEmpty(cellValue)){
								alertWarring("Grid Can't be null!");
								return;
							}
						}
					}
				}
				if(temp.oldDatas.length == 0){
					alertWarring("This is a invalid version,please select a another version!");
					return;
				}
				//拼装需要更新的值，并存于全局参数中
				var gridData = DigiCompass.Web.app.assembleGrid.createSaveAsArray(id);
				temp.argumentDatas.gridData = gridData;
				//保存数据
				DigiCompass.Web.app.assembleGrid.saveOrUpdateGrid(moduleType,command,id,SAVE_AS_HANDLER);
			}
		}
		
		//编辑处理函数
		DigiCompass.Web.app.assembleGrid.resetBtnHandler = function(id,moduleType,command){
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				DigiCompass.Web.app.assembleGrid.refreshGrid(moduleType,command,temp.argumentDatas);
			}
		}
		
		//初始化查询参数
		DigiCompass.Web.app.assembleGrid.createArgumentDatas = function(argumentDatas,data){
			if(data.versionId){
				argumentDatas.versionId = data.versionId;
			}else{
				argumentDatas.versionId = '';
			}
			if(data.planningCycleId){
				argumentDatas.planningCycleId = data.planningCycleId;
			}else{
				argumentDatas.planningCycleId = '';
			}
			if(data.scenarioId){
				argumentDatas.scenarioId = data.scenarioId;
			}else{
				argumentDatas.scenarioId = '';
			}
			if(data.technologyId){
				argumentDatas.technologyId = data.technologyId;
			}else{
				argumentDatas.technologyId = '';
			}
			if(data.siteGroupId){
				argumentDatas.siteGroupId = data.siteGroupId;
			}else{
				argumentDatas.siteGroupId = '';
			}
			if(data.siteGroupPlannedId){
				argumentDatas.siteGroupPlannedId = data.siteGroupPlannedId;
			}else{
				argumentDatas.siteGroupPlannedId = '';
			}
//			if(data.queryType){
//				argumentDatas.queryType = data.queryType;
//			}
			if(data.dataEditPanel){
				argumentDatas.dataEditPanel = data.dataEditPanel;
			}
//			if(data.isSingleEdit){
//				argumentDatas.isSingleEdit = data.isSingleEdit;
//			}
			if(data.renderCmp){
				argumentDatas.renderCmp = data.renderCmp;
			}
			return argumentDatas;
		}
		
		//初始化Drag参数配置
		DigiCompass.Web.app.assembleGrid.createDragArgumentDatas = function(dragArgumentDatas,data){
			if(data.dragArgumentDatas){
				if(data.dragArgumentDatas.isDrag){
					dragArgumentDatas.isDrag = data.dragArgumentDatas.isDrag;
				}else{
					dragArgumentDatas.isDrag = false;
				}
				if(data.dragArgumentDatas.dragVersionId){
					dragArgumentDatas.dragVersionId = data.dragArgumentDatas.dragVersionId;
				}else{
					dragArgumentDatas.dragVersionId = '';
				}
				if(data.dragArgumentDatas.tableName){
					dragArgumentDatas.tableName = data.dragArgumentDatas.tableName;
				}else{
					dragArgumentDatas.tableName = '';
				}
			}else{
				dragArgumentDatas.isDrag = false;
				dragArgumentDatas.dragVersionId = '';
				dragArgumentDatas.tableName = '';
			}
			
			return dragArgumentDatas;
		}
		
		
		//拼装数据,数据格式=[{"id":"","versionId":"","columnHeaderId":"01","rowHeaderId":"0103","value":1}]
		DigiCompass.Web.app.assembleGrid.createSaveOrUpdateArray = function(id){
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				var saveData = '[';
				var isUpdate = temp.isUpdate;
				var formData = temp.rowDatas;
				for(var i = 0; i < formData.length; i++){
					var rowData = formData[i];
					for(var j = temp.categoryLen + 1; j < rowData.length; j++){
						var cellData = rowData[j];
						if('MOD_REGION_LAYER_ID' == id){
							//id,versionId,rowHeaderId,columnHeaderId,rowHeaderId2,valueRefId,value,editableTag,oldValue
							if(cellData.length > 4){
//							if(cellData.length > 4 && cellData[cellData.length-3] != cellData[cellData.length-1]){
								saveData += DigiCompass.Web.app.assembleGrid.createJsonFromData(cellData[0],cellData[1],cellData[2],cellData[3],cellData[cellData.length-1],cellData[cellData.length-5],cellData[cellData.length-4]);
								saveData += ',';
							}
						}else{
							if(cellData.length > 2){
//							if(!isUpdate || isUpdate && cellData.length > 2 && cellData[cellData.length-3] != cellData[cellData.length-1]){
								saveData += DigiCompass.Web.app.assembleGrid.createJsonFromData(cellData[0],cellData[1],cellData[2],cellData[3],cellData[cellData.length-1]);
								saveData += ',';
							}
						}
					}
				}
				if(saveData.length > 1){
					saveData = saveData.substring(0,saveData.length-1);
				}
				saveData += "]";
				return saveData;
			}
		}
		
		DigiCompass.Web.app.assembleGrid.createSaveAsArray = function(id){
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				var saveData = '[';
				var formData = temp.rowDatas;
				for(var i = 0; i < formData.length; i++){
					var rowData = formData[i];
					for(var j = temp.categoryLen + 1; j < rowData.length; j++){
						var cellData = rowData[j];
						if('MOD_REGION_LAYER_ID' == id){
							saveData += DigiCompass.Web.app.assembleGrid.createJsonFromData(cellData[0],cellData[1],cellData[2],cellData[3],cellData[cellData.length-1],cellData[cellData.length-5],cellData[cellData.length-4]);
						}else{
							saveData += DigiCompass.Web.app.assembleGrid.createJsonFromData(cellData[0],cellData[1],cellData[2],cellData[3],cellData[cellData.length-1]);
						}
						saveData += ',';
					}
				}
				if(saveData.length > 1){
					saveData = saveData.substring(0,saveData.length-1);
				}
				saveData += "]";
				return saveData;
			}
		}
		
		//拼装数据
		DigiCompass.Web.app.assembleGrid.createJsonFromData = function(id,versionId,rowHeaderId,columnHeaderId,value,rowHeaderId2,valueRefId){
			var json = '{';
			json += '"id":"'+id+'",'
			json += '"versionId":"'+versionId+'",';
			json += '"rowHeaderId":"'+rowHeaderId+'",';
			json += '"columnHeaderItemId":"'+columnHeaderId+'",';
			json += '"value":"'+value+'",';
			json += '"rowHeaderId2":"'+rowHeaderId2+'",';
			json += '"valueRefId":"'+valueRefId+'"';
			json += '}';
			return json;
		}
		
		//创建列表对应单个值属性
		DigiCompass.Web.app.assembleGrid.assembleSingleData = function(jsonData){
			var singleData = new Array();
			var dataCategory = jsonData.rowHeader;
			var data = jsonData.data;
			if(dataCategory.length != data.length){
				console.log('assembleData:dataCategory.length != data.length');
			}
			if(data){
				for ( var i = 0; i < dataCategory.length; i++) {
					var tempAr = new Array();
					if(dataCategory[i]){
						for(var ii = 1 ; ii < dataCategory[i].length ; ii++){
							tempAr.push(dataCategory[i][ii]); 
						}
					}
					if(i < data.length && data[i]){
						for (var j = 0; j < data[i].length; j++) {
							var temp = data[i][j];
							if(temp){
								tempAr.push(data[i][j][temp.length - 1]);
							}
						}
					}
					singleData.push(tempAr);
				}
			}
			return singleData;
		}
		
		//创建列表对应的多个值属性(一个值即为一个数组)
		DigiCompass.Web.app.assembleGrid.assembleData = function(jsonData) {
			var allData = new Array();
			var dataCategory = jsonData.rowHeader;
			var data = jsonData.data;
			if(dataCategory.length != data.length){
				console.log('assembleData:dataCategory.length != data.length');
			}
			if(data){
				for ( var i = 0; i < dataCategory.length; i++) {
					var tempAr = new Array();
					if(dataCategory[i]){
						for(var ii = 0 ; ii < dataCategory[i].length ; ii++){
							tempAr.push(dataCategory[i][ii]); 
						}
					}
					if(i < data.length && data[i]){
						for (var j = 0; j < data[i].length; j++) {
							var addEditTag = new Array();
							for(var jj = 0; jj < data[i][j].length; jj++){
								addEditTag.push(data[i][j][jj]);
								if(jj == data[i][j].length - 1){
									addEditTag.push(0);
									addEditTag.push(data[i][j][jj]);
								}
							}
							tempAr.push(addEditTag);
						}
					}
					allData.push(tempAr);
				}
			}
			return allData;
		}
		
		var hasRenderer = false;
		//生成头部
		function getHeader(isEditable) {
			return {
				sortable : true,
				renderer: function(value,metaData,record,rowIndex,colIndex,store,view){
					hasRenderer = true;
					
//					console.log('renderer ----------------- value = ' + value);
					//解决Tab和Enter事件
					var raw = record.raw;
//					if(!Ext.isEmpty(value) && raw[colIndex] !== value && isEditable === true){
					//edit by yangjunping 由于GRID加入了空行，导致下标出错
					if(!Ext.isEmpty(value) && raw[colIndex-1] !== value && isEditable === true){
						
						//添加操作触发Versions
						
						var obj = {};
						obj.id = this.id;
						obj.value = value;
						obj.colIndex = colIndex;
						obj.rowIndex = rowIndex;
						obj.validateConfig = this.validateConfig;
						obj.formatConfig = this.formatConfig;
						
						var result = DigiCompass.Web.app.assembleGrid.handlerEditorData(obj);
						value = result.value;
					}
					if(!Ext.isEmpty(value)){
						/**
						 * 目前格式化配置，按表和行进行配置，当配置了行格式则使用行格式，否则就用表格式。以后可以扩展列格式化配置。
						 */
						//格式化配置信息
						var formatConfig = this.formatConfig;
						if(formatConfig){
							var hasFormat = false;
							//查看行格式
							var rowFormat = formatConfig.rowFormat;
							if(rowFormat){
								for(var i=0;i<rowFormat.length;i++){
									var rowFormatInfo = rowFormat[i];
									if(rowFormatInfo.rowIndex 
											&& rowFormatInfo.rowFormatFn 
											&& rowIndex == rowFormatInfo.rowIndex){
										value = rowFormatInfo.rowFormatFn(value);
										hasFormat = true;
										break;
									}
								}
							}
							//当不存在行格式时，直接使用表格式
							if(!hasFormat && formatConfig.tableFormatFn){
								value = formatConfig.tableFormatFn(value);
							}
						}
					}
					return value;
				}
			};
		}
		
		DigiCompass.Web.app.assembleGrid.handlerEditorData = function(obj){
			//初始化参数
			var id = obj.id;
			var validateConfig = obj.validateConfig;
			var formatConfig = obj.formatConfig;
			var value = obj.value;
			var colIndex = obj.colIndex;
			var rowIndex = obj.rowIndex;
			
			
			var result = {};
			result.value = '';
			
			//焦点移开后，会将更新的值放于全局变量中
			var tempValue =value;
			if(Ext.isString(value)){
				tempValue = Ext.util.Format.trim(value);
			}
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				//data validate
//				if(Ext.isEmpty(tempValue)){
//					alertWarring("Please input a data!");
//					return;
//				}else 
				if(!Ext.isEmpty(tempValue) && !DigiCompass.Web.app.assembleGrid.checkDoubleType(tempValue)){
					alertWarring("Please input a valid data!");
					tempValue = '';
				}
				//validate
				var validateResult = DigiCompass.Web.app.assembleGrid.dataValidateFun(id,tempValue,validateConfig,rowIndex);
				if(!validateResult){
					tempValue = '';
				}
				//处理百分数值
				tempValue = DigiCompass.Web.app.assembleGrid.rideOrBesidePercentFun(id,tempValue,formatConfig,0.01,rowIndex);
				
				var rowData = temp.rowDatas[rowIndex];
				var cellData = rowData[colIndex];
				if(cellData.length > 2){
					//id,versionId,rowHeaderId,columnHeaderId,value,editableTag,oldValue
					cellData[cellData.length-2] = 1;
					cellData[cellData.length-1] = tempValue;
				}
//				console.log('cellData = ' + Ext.JSON.encode(cellData));
				
				result.value = tempValue
			}
			
			return result;
		}
		
		//生成列
		DigiCompass.Web.app.assembleGrid.assembleColumn = function(jsonData,categoryLen,isEditable,overrideCreateEditFun,id,formatConfig,validateConfig) {
			var columnsInfo = {};
			var columns = [];
			var fields = [];
			for ( var i = 0; i < categoryLen; i++) {

				var column = {};
				column.sortable = true;
				column.header = '';
				column.dataIndex = 'category' + i;				
				columns.push(column);
				fields.push('category' + i);
			}
			for ( var i = 0; i < jsonData.columnHeader.length; i++) {
				var yearColumn = jsonData.columnHeader[i];
				for ( var j = 0; j < yearColumn.length; j++) {
					if (j != 0) {
						var column = getHeader(isEditable);
						column.header = yearColumn[j];
						column.dataIndex = yearColumn[j];
						column.align = "right";
						if(id.indexOf("COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_MOD") != -1){
							column.summaryType = "count";
						}
						if(isEditable){
							if(overrideCreateEditFun){
								column.field = overrideCreateEditFun();
							}else{
								column.field = DigiCompass.Web.app.assembleGrid.createEditFieldFun(id,formatConfig,validateConfig);
							}
						}						
						columns.push(column);
						fields.push(yearColumn[j]);
					}
				}
			}
			var _colums = [{ 
				columnType:'summary', 
				menuDisabled: true 
			}];
			columnsInfo.columns = _colums.concat(columns);
			columnsInfo.fields = fields;
			return columnsInfo;
		}
		//ride or beside percent
		DigiCompass.Web.app.assembleGrid.rideOrBesidePercentFun = function(id,value,formatConfig,percent,rowIndex){
			if(value && value.length == 0){
				return '';
			}
			var temp = getAssembleGridDataFromArry(id);
			//根据格式化配置信息处理百分数情况，百分数，得先乘以100再除以100
			if(temp && formatConfig){
				var hasFormat = false;
				//查看行格式
				var rowFormat = formatConfig.rowFormat;
				if(rowFormat){
					for(var i=0;i<rowFormat.length;i++){
						var rowFormatInfo = rowFormat[i];
						if(rowFormatInfo.rowIndex 
								&& rowFormatInfo.rowFormatFn 
								&& rowIndex == rowFormatInfo.rowIndex){
							hasFormat = true;
							if(rowFormatInfo.tableFormatFnName == 'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'){
//								value = Number(value) * percent;
								value = accMul(value,percent);
							}
							break;
						}
					}
				}
				//当不存在行格式时，直接使用表格式
				if(!hasFormat && formatConfig.tableFormatFn 
						&& formatConfig.tableFormatFnName == 'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'){
//					value = Number(value) * percent;
					value = accMul(value,percent);
				}
			}
			return value;
		}
		
		//validate
		DigiCompass.Web.app.assembleGrid.dataValidateFun = function(id,value,validateConfig,rowIndex){
			var result = true;
			var temp = getAssembleGridDataFromArry(id);
			if(temp && validateConfig){
				var hasFormat = false;
				
				var rowValidate = validateConfig.rowValidate;
				if(rowValidate){
					for(var i=0;i<rowValidate.length;i++){
						var rowValidateInfo = rowValidate[i];
						if(rowValidateInfo.rowIndex 
								&& rowValidateInfo.rowValidateFn 
								&& rowIndex == rowValidateInfo.rowIndex){
							hasFormat = true;
							result = rowValidateInfo.rowValidateFn(value);
							break;
						}
					}
				}
				//当不存在行格式时，直接使用表格式
				if(!hasFormat && validateConfig.tableValidateFn){
					result = validateConfig.tableValidateFn(value);
				}
			}
			return result;
		}
		
		
		DigiCompass.Web.app.assembleGrid.ridePercentFun = function(value,formatConfig){
			//根据格式化配置信息处理百分数情况，百分数，得先乘以100再除以100
			if(formatConfig){
				var hasFormat = false;
				//查看行格式
				var rowFormat = formatConfig.rowFormat;
				if(rowFormat){
					for(var i=0;i<rowFormat.length;i++){
						var rowFormatInfo = rowFormat[i];
						if(rowFormatInfo.rowIndex 
								&& rowFormatInfo.rowFormatFn 
								&& rowIndex == rowFormatInfo.rowIndex
								&& rowFormatInfo.tableFormatFnName == 'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'){
							value = Number(value) * 100;
							hasFormat = true;
							break;
						}
					}
				}
				//当不存在行格式时，直接使用表格式
				if(!hasFormat && formatConfig.tableFormatFn 
						&& formatConfig.tableFormatFnName == 'DigiCompass.Web.UI.Cmp.Format.percentageRenderer'){
					oldValue = Number(value) * 100;
				}
			}
			return value;
		}
		
		//编辑数据
		DigiCompass.Web.app.assembleGrid.createEditFieldFun = function(id,formatConfig,validateConfig){
			return {
					xtype: 'textfield',
					listeners: {
						focus:function(e,editor){
							e.setValue('');
							hasRenderer = false;
							
							var temp = getAssembleGridDataFromArry(id);
							var rowData = temp.rowDatas[temp.rowIndex];
							var cellData = rowData[temp.colIndex];
							var oldValue = cellData[cellData.length-1];
							
//							console.log('-------------------focus');
//							var oldValue = e.getValue();
							oldValue = DigiCompass.Web.app.assembleGrid.rideOrBesidePercentFun(id,oldValue,formatConfig,100,temp.rowIndex);
							if(oldValue === 0){
								oldValue = '';
							}
							e.setValue(oldValue);
							
							//操作Versions
//							var tableName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(id);
//							var oldName = getLastNavigationBarName();
//							if(oldName !== tableName){
//								changeTheLastNavigationBarName(tableName);
//								DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(tableName);
//							}
						},
						blur: function(e,editor){
							if(hasRenderer){
								e.setValue('');
							}
//							e.setValue('');
//							console.log('-------------------blur');
//							//焦点移开后，会将更新的值放于全局变量中
//							var tempValue = Ext.util.Format.trim(e.value);
//							var temp = getAssembleGridDataFromArry(id);
//							if(temp != null){
//								//data validate
////								if(Ext.isEmpty(tempValue)){
////									alertWarring("Please input a data!");
////									return;
////								}else 
//								if(!Ext.isEmpty(tempValue) && !DigiCompass.Web.app.assembleGrid.checkDoubleType(tempValue)){
//									alertWarring("Please input a valid data!");
//									tempValue = '';
//									e.setValue(tempValue);
//								}
//								//validate
//								var validateResult = DigiCompass.Web.app.assembleGrid.dataValidateFun(id,tempValue,validateConfig);
//								if(!validateResult){
//									e.setValue('');
//									return;
//								}
//								//处理百分数值
//								tempValue = DigiCompass.Web.app.assembleGrid.rideOrBesidePercentFun(id,tempValue,formatConfig,0.01);
//								
//								var rowData = temp.rowDatas[temp.rowIndex];
//								var cellData = rowData[temp.colIndex + 1];
//								if(cellData.length > 2){
//									//id,versionId,rowHeaderId,columnHeaderId,value,editableTag,oldValue
//									cellData[cellData.length-2] = 1;
//									cellData[cellData.length-1] = tempValue;
//								}
//								e.setValue(tempValue);
//							}
						}
					}				
	            };
		}
		
		//验证double类型数据
		DigiCompass.Web.app.assembleGrid.checkDoubleType = function(v){
			//科学计数法加数字验证
			var reg = /^[\+\-]?[\d]+([\.][\d]*)?([Ee][+-]?[\d]+)?$/;
			//var reg = /^(\-)?\d+(\.\d+)?$/;
			var result = reg.test(v);
			return result;
		}
		
		//执行查询
		DigiCompass.Web.app.assembleGrid.refreshGrid = function(moduleType,command,datas){
			cometdfn.publish({ MODULE_TYPE: moduleType,COMMAND:command,
										versionId: datas.versionId,
										planningCycleId: datas.planningCycleId,
										scenarioId:datas.scenarioId,
										technologyId:datas.technologyId,
										siteGroupId:datas.siteGroupId,
										siteGroupPlannedId:datas.siteGroupPlannedId,
//										queryType:datas.queryType,
										renderCmp : datas.renderCmp,
										showNavigation : datas.showNavigation || false,
										edit : datas.edit || false,
										tableName : datas.tableName,
										id : datas.id
//										,
//										isSingleEdit:datas.isSingleEdit,
//										dataEditPanel:datas.dataEditPanel
									});
		}
		
		//保存数据
		DigiCompass.Web.app.assembleGrid.saveOrUpdateGrid = function(moduleType,command,id,saveType){
			var temp = getAssembleGridDataFromArry(id);
			if(temp != null){
				
				var reversalPanel_id = 'reversalPanel_' + id;
				var tempGrid = Ext.getCmp(reversalPanel_id);
				var tempForm = tempGrid.back;
//				tempForm.doSave(function(formVals){
//					console.log(formVals);
//				});
//				tempGrid.toBack();
//				tempForm.toFront();
				
				var tempObj = tempForm.getForm().getValues();
//				if(tempForm.isValid()){
//					cometdfn.publish({ MODULE_TYPE: moduleType,COMMAND:command,
//						id: id,
//						versionId: temp.argumentDatas.versionId,
//						planningCycleId: temp.argumentDatas.planningCycleId,
//						scenarioId:temp.argumentDatas.scenarioId,
//						technologyId:temp.argumentDatas.technologyId,
//						siteGroupId:temp.argumentDatas.siteGroupId,
//						gridData:temp.argumentDatas.gridData,
//						isDrag:temp.dragArgumentDatas.isDrag,
//						dragVersionId:temp.dragArgumentDatas.dragVersionId,
//						saveType:saveType,
//						versionName : formVals.versionName,
//						comment : formVals.comment
////						,
////						dataEditPanel : temp.argumentDatas.dataEditPanel,
////						isSingleEdit : temp.argumentDatas.isSingleEdit
//					});
//				}else{
//					tempGrid.toBack();
//				}
				
				
				var condition = saveType === SAVE_AS_HANDLER || (saveType === SAVE_HANDLER && Ext.isEmpty(temp.argumentDatas.versionId) && temp.dragArgumentDatas.isDrag === false);
//				if(condition || !tempForm.isValid()){
				if(!tempForm.isValid()){
					tempGrid.toBack();
					temp.argumentDatas.toBack = true;
				}else{
					cometdfn.publish({ MODULE_TYPE: moduleType,COMMAND:command,
						id: id,
						versionId: temp.argumentDatas.versionId,
						planningCycleId: temp.argumentDatas.planningCycleId,
						scenarioId:temp.argumentDatas.scenarioId,
						technologyId:temp.argumentDatas.technologyId,
						siteGroupPlannedId:temp.argumentDatas.siteGroupPlannedId,
						siteGroupId:temp.argumentDatas.siteGroupId,
						gridData:temp.argumentDatas.gridData,
						isDrag:temp.dragArgumentDatas.isDrag,
						dragVersionId:temp.dragArgumentDatas.dragVersionId,
						saveType:saveType,
						versionName : tempObj.versionName,
						comment : tempObj.comment,
						renderCmp:temp.argumentDatas.renderCmp
//						,
//						dataEditPanel : temp.argumentDatas.dataEditPanel,
//						isSingleEdit : temp.argumentDatas.isSingleEdit
					});
				}
				
				
				
				
				
//				if(saveType === SAVE_AS_HANDLER || (saveType === SAVE_HANDLER && Ext.isEmpty(temp.argumentDatas.versionId) && temp.dragArgumentDatas.isDrag === false)){
//					promptDialog('Add Version','Please enter the version name:', function(ok, versionName){
//						if(ok === 'ok'){
//							cometdfn.publish({ MODULE_TYPE: moduleType,COMMAND:command,
//								id: id,
//								versionId: temp.argumentDatas.versionId,
//								planningCycleId: temp.argumentDatas.planningCycleId,
//								scenarioId:temp.argumentDatas.scenarioId,
//								technologyId:temp.argumentDatas.technologyId,
//								siteGroupId:temp.argumentDatas.siteGroupId,
//								gridData:temp.argumentDatas.gridData,
//								isDrag:temp.dragArgumentDatas.isDrag,
//								dragVersionId:temp.dragArgumentDatas.dragVersionId,
//								saveType:saveType,
//								versionName : versionName,
//								dataEditPanel : temp.argumentDatas.dataEditPanel,
//								isSingleEdit : temp.argumentDatas.isSingleEdit
//							});
//						}
//					},this, null);
//				}else{
//					cometdfn.publish({ MODULE_TYPE: moduleType,COMMAND:command,
//						id: id,
//						versionId: temp.argumentDatas.versionId,
//						planningCycleId: temp.argumentDatas.planningCycleId,
//						scenarioId:temp.argumentDatas.scenarioId,
//						technologyId:temp.argumentDatas.technologyId,
//						siteGroupId:temp.argumentDatas.siteGroupId,
//						gridData:temp.argumentDatas.gridData,
//						isDrag:temp.dragArgumentDatas.isDrag,
//						dragVersionId:temp.dragArgumentDatas.dragVersionId,
//						saveType:saveType,
//						dataEditPanel : temp.argumentDatas.dataEditPanel,
//						isSingleEdit : temp.argumentDatas.isSingleEdit
//					});
//				}
			}
		}
		
		
		//保存数据回调函数
		DigiCompass.Web.app.assembleGrid.saveOrUpdateGridCallback = function(data, config,fnName,command){
			var status = data.STATUS ;
			if(status === "success"){
				var datas = {};
				datas.id = data.id;
				datas.versionId = data.versionId;
				datas.planningCycleId = data.planningCycleId;
				datas.siteGroupPlannedId = data.siteGroupPlannedId;
				datas.scenarioId = data.scenarioId;
				datas.technologyId = data.technologyId;
				datas.siteGroupId = data.siteGroupId;
				datas.renderCmp = data.renderCmp;
				datas.id = data.id;
				
//				datas.dataEditPanel = data.dataEditPanel,
//				datas.isSingleEdit = data.isSingleEdit;
				
				var result = Ext.JSON.decode(data.BUSINESS_DATA.result);
				
				if(result['isSuccess']){
					alertSuccess('Save successful!');
					//当新增时，后台会传回保存后version值，此时需要将参数中和全局参数中的版本信息给更新
					datas.versionId = result['versionId'];
					var temp = getAssembleGridDataFromArry(datas.id);
					if(temp != null){
						//update versionId
						temp.argumentDatas.versionId =  result['versionId'];
						//reset drag tag
						if(temp.dragArgumentDatas.isDrag){
							temp.dragArgumentDatas.isDrag = false;
							temp.dragArgumentDatas.dragVersionId = '';
						}
						
						
						
						
						var reversalPanel_id = 'reversalPanel_' + datas.id;
						var tempGrid = Ext.getCmp(reversalPanel_id);
						var tempForm = tempGrid.back;
						if(temp.argumentDatas.toBack){
							tempForm.toFront();
						}
						tempForm.setValues({versionId:datas.versionId});
					}
					DigiCompass.Web.app.assembleGrid.refreshGrid(config.moduleType,config.command,datas);
					
					var versionView = Ext.getCmp('versionView');
					if (versionView) {
						versionView.versionId = datas.versionId;
					}
					var mainTab = Ext.getCmp('outerTabPanelId'+datas.scenarioId);
					var tbName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(datas.id);
					if(mainTab.obj && mainTab.obj.tableName === tbName){
						DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(tbName, datas, false);
					}
				}else{
					alertError(result.msg || '');
				}
			}else if(data.customException){
				if(data.ERROR_CODE && (data.ERROR_CODE === 1001 || data.ERROR_CODE === 1002)){
					Ext.getCmp('reversalPanel_'+data.id).toBack();
				}
				alertError(data.customException);
			}else{
				alertError('Save data failure!');
			}
		}
		
		//全局参数中获取指定的对象
		function getAssembleGridDataFromArry(id){
			for(var i = 0 ; i < assembleGridDataArry.length ; i++){
				if(assembleGridDataArry[i].gridId == id){
					return assembleGridDataArry[i];
				}
			}
			return null;
		}
		
		DigiCompass.Web.app.assembleGrid.getAssembleGridDataFromArray = function(id){
			return getAssembleGridDataFromArry(id);
		}
		
		function testABC(){
			console.log('123456');
		}
		
		DigiCompass.Web.app.assembleGrid.dataEditHandler = function(id,scenarioId){
			var tempCmp = Ext.getCmp(id);
			if(tempCmp){
				
//				var tempTitle = tempCmp.title;
//				var onlyTile = '';
//				var tempOlnyTitle = tempTitle.split("(");
//				if(tempOlnyTitle.length > 1){
//					onlyTile = tempOlnyTitle[0];
//				}
//				var args = {};
//				args.id = scenarioId;
//				args.name = onlyTile;
//				DigiCompass.Web.app.navigationBar.setNavigationBarArray(args);
//				var navigation = DigiCompass.Web.app.navigationBar.generateNavigationBarStr(scenarioId);
//				
//				var main_ReversalPanel_Id = 'main_ReversalPanel_Id' + scenarioId;
//				var obj_details_tbar_id = 'obj_details_tbar_' + id;
//				var main_ReversalPanel = Ext.getCmp(main_ReversalPanel_Id);
//				main_ReversalPanel.setNavigation(navigation);
//				
//				Ext.getCmp(obj_details_tbar_id).removeAll();
//				Ext.getCmp(obj_details_tbar_id).setVisible(true);
//				Ext.getCmp(obj_details_tbar_id).add(navigation);
//				
//				
//				var divTitle = DigiCompass.Web.app.navigationBar.setObjectDetail(tempTitle);
//				tempCmp.setTitle(divTitle);
//				Ext.getCmp(main_ReversalPanel_Id).setTitle(divTitle);
//				
//				main_ReversalPanel.switchFront(tempCmp);
			}
			
			
			
			
			
//			var main_ReversalPanel_Id = 'main_ReversalPanel_Id' + scenarioId;
//			var main_ReversalPanel = Ext.getCmp(main_ReversalPanel_Id);
//			if(main_ReversalPanel){
//				var tempPanel = Ext.getCmp(id);
//				if(tempPanel){
//					var title = tempPanel.title;
//					title = '<div align="center">Object Details---'+title+'</div>';
//					tempPanel.setTitle(title);
//					
//					main_ReversalPanel.setTitle(title);
//				}
//			}
			
			//重新设置Title,Navigation
			
			
//			Ext.getCmp('obj_details_tbar').removeAll();
//			
//			var tableName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(id);
//			var tempCmp = Ext.getCmp(id);
//			var tempTitle = tempCmp.title;
////			Ext.getCmp('obj-details').setTitle(DigiCompass.Web.app.navigationBar.setObjectDetail(tempTitle));
//			var tempOlnyTitle = tempTitle.split("(");
//			if(tempOlnyTitle.length > 1){
//				tempTitle = tempOlnyTitle[0];
//			}
//			
//			
////			Ext.getCmp('obj_details_tbar').add(DigiCompass.Web.app.navigationBar.setNavigationBar(tempTitle,false,testABC));
////	    	DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(tableName);
//	    	
//	    	var cmpId = 'obj-details';
//	    	
//	    	tempCmp.setTitle('');
	    	
	    	
	    	
	    	
	    	
	    	
	    	
	    	
	    	
	    	
//	    	Ext.getCmp('obj-details').add(tempCmp);
			
//			var cmpId = 'DataEditPanel_'+scenarioId;
//			var cmpEditPanel = Ext.getCmp(cmpId);
//			if(cmpEditPanel){
//				
//			}else{
//				cmpEditPanel = Ext.create('Ext.panel.Panel', {
//					id: cmpId,
//				    width: '100%',
//					autoScroll : true,
//					height : 700,
//					frame : false,
//					border : false,
//					layout:'vbox',
//					bodyStyle: 'background:white;',
//					items:[]
//				});
//				var objDetails = Ext.getCmp('obj-details');
//				if(objDetails){
//					objDetails.add(cmpEditPanel);
//				}
//			}
				
//			var temp = DigiCompass.Web.app.assembleListView.getScenarioDataArry(scenarioId);
//    		if(temp){
//    			var arguments = temp.arguments;
//    			arguments = DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,tableName,arguments);
//    			arguments.dataEditPanel = cmpId;
//    			arguments.isSingleEdit = true;
//    			var moduleType = DigiCompass.Web.UI.Cmp.TableName.getModuleTypeByTableName(tableName);
//    			DigiCompass.Web.app.assembleGrid.refreshGrid(moduleType,'COMMAND_QUERY_GRID',arguments);
//    		}
		}
		
	})();
