(function() {
	var space = Ext.namespace('Digicompass.web.cmp.cost.costCapacityBuild');
	
	space.refresh = function(arg) {
		var id = 'COST_CAPACITY_BUILD_GRID_'+(arg.scenarioId||'')+(arg.versionId||'');
		var panel = Ext.getCmp(id);
		if (panel) {
			panel.front.refresh(arg);
			return;
		}
		var temp_cmp = Ext.getCmp(arg.renderCmp);
		var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
			margins : '5 0 5 5',
			height : 300,
			
			id : id,
			panelTitle : 'New Capacity Build',
			showNavigation : arg.showNavigation || false,
			front : new DigiCompass.Web.app.ObjectGrid({
				defaultTitle : 'New Capacity Build',
				moduleType : 'MOD_COST_CAPACITYBUILD',
				moduleCommand : 'COMMAND_QUERY_LIST',
				dragModuleCommand : 'COMMAND_QUERY_DRAG_GRID',
				scenarioId : arg.scenarioId,
				versionId : arg.versionId,
				technologyId : arg.technologyId,
				siteGroupId : arg.siteGroupId,
				dragVersionId : arg.dragVersionId,
				siteGroupPlannedId : arg.siteGroupPlannedId,
				versionName : arg.versionName,
				planningCycleId : arg.planningCycleId,
				tableName : 'TB_STG_COST_CAPACITY_BUILD',
				edit : arg.edit || false,
				loadDataListener : function(data, msg) {
					var gridData = Ext.JSON.decode(data['grid']);
					this.getStore().loadData(gridData);
					var versionForm = this.reversalPanel.back;
					 versionForm.setValues({
						 versionId : msg.versionId,
						 versionName : data.versionName
					 });
					 this.versionName = data.versionName;
				},
				store : Ext.create('Ext.data.ArrayStore', {
					fields : [ 'id',  "version",  'spectrumRegion', 'capex', 'opex', 'income', 'expense',
								'recharge', 'incomeParameter', 'expenseParameter','opexParameter',
								'rechargeParameter' ],
					data : []
				}),
				features : Ext.create(
					'Ext.grid.feature.MultiGroupingSummary', {
						groupHeaderTpl : '{name}'
				}),
				columns : [{ 
						columnType:'summary', 
						menuDisabled: true 
					},{
						header : 'Spectum Region',
						sortable : false,
						width : 110,
						dataIndex : 'spectrumRegion',
						
						renderer : function(value) {
							return value.name;
						}
					}, {
						header : 'Capex',
						dataIndex : 'capex',
						sortable : false,
						width : 100,
						field : {
							xtype : 'numberfield',
							allowBlank : false,
							minValue : 0,
							maxLength : 20
						}
					}, {
						header : 'Opex',
						dataIndex : 'opex',
						sortable : false,
						width : 100/*,
						field : {
							xtype : 'numberfield',
							allowBlank : false
						}*/
					}, {
						header : 'Income',
						dataIndex : 'income',
						sortable : false,
						width : 100
					}, {
						header : 'Expense',
						dataIndex : 'expense',
						sortable : false,
						width : 100
					}, {
						header : 'Recharge',
						dataIndex : 'recharge',
						sortable : false,
						width : 100
					} ],
				onSave : function(param) {
					var grid = this;
					var _datas = [];
					//便利store所有recorder
					for(var i = 0 ; i < grid.getStore().getCount() ; i++){
						var row = grid.getStore().getAt(i).data;
						if(Ext.isEmpty(row.capex) || Ext.isEmpty(row.expense)
								|| Ext.isEmpty(row.income)|| Ext.isEmpty(row.opex)
								|| Ext.isEmpty(row.recharge)  || Ext.isEmpty(row.expense)
								|| row.incomeParameter.length ==0
								|| row.expenseParameter.length ==0
								|| row.rechargeParameter.length ==0
								|| row.opexParameter.length ==0){
							alertWarring("Grid Can't be null")
							if(!grid.reversalPanel.isFront){
								grid.reversalPanel.toFront();
							}
							return ;
						}
						_datas.push(row);
					}
					cometdfn.request({
						MODULE_TYPE : grid.moduleType,
						COMMAND : 'COMMAND_SAVE_BATCH',
						data : Ext.JSON.encode(_datas),
						versionId : grid.versionId,
						scenarioId : grid.scenarioId,
						dragVersionId : grid.dragVersionId,
						siteGroupPlannedId : arg.siteGroupPlannedId,
						isDrag : grid.isDrag,
						saveType : 'SAVE',
						versionName : param.versionName,
						comment : param.comment
					}, function(message){
						if(DigiCompass.Web.app.checkResult(grid,message)){
							var version = Ext.JSON.decode(message.BUSINESS_DATA.data);
							grid.refresh(version.id, version.name);
							var mainTab = Ext.getCmp('outerTabPanelId'+grid.scenarioId);
							if(mainTab.obj && mainTab.obj.tableName === grid.tableName){
								DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(grid.tableName, grid.getParam(), false);
							}
						}
					});
				},
				onSaveAs : function(param) {
					grid = this;
					var _datas = [];
					//便利store所有recorder
					for(var i = 0 ; i < grid.getStore().getCount() ; i++){
						var row = grid.getStore().getAt(i).data;
						if(Ext.isEmpty(row.capex) || Ext.isEmpty(row.expense)
								|| Ext.isEmpty(row.income)|| Ext.isEmpty(row.opex)
								|| Ext.isEmpty(row.recharge)  || Ext.isEmpty(row.expense)
								|| row.incomeParameter.length ==0
								|| row.expenseParameter.length ==0
								|| row.rechargeParameter.length ==0
								|| row.opexParameter.length ==0){
							alertWarring("Grid Can't be null")
							if(!grid.reversalPanel.isFront){
								grid.reversalPanel.toFront();
							}
							return ;
						}
						_datas.push(row);
					}

					cometdfn.request({
						MODULE_TYPE : grid.moduleType,
						COMMAND : 'COMMAND_SAVE_BATCH',
						data : Ext.JSON.encode(_datas),
						versionId : grid.versionId,
						scenarioId : grid.scenarioId,
						dragVersionId : grid.dragVersionId,
						siteGroupPlannedId : arg.siteGroupPlannedId,
						isDrag : grid.isDrag,
						saveType : 'SAVE_AS',
						versionName : param.versionName,
						comment : param.comment
					}, function(message){
						if(DigiCompass.Web.app.checkResult(grid,message)){
							var version = Ext.JSON.decode(message.BUSINESS_DATA.data);
							grid.refresh(version.id, version.name);
							var mainTab = Ext.getCmp('outerTabPanelId'+grid.scenarioId);
							if(mainTab.obj && mainTab.obj.tableName === grid.tableName){
								DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(grid.tableName, grid.getParam(), false);
							}
						}
					});
				},
				onRemoveVersion : function(param) {
					var grid = this;
					cometdfn.request({
						MODULE_TYPE : 'MOD_VERSION_MANAGER',
						COMMAND : 'COMMAND_DEL',
						versionId : grid.versionId,
						scenarioId : grid.scenarioId
					}, function(message){
						var data = Ext.JSON.decode(message['BUSINESS_DATA'] || '{}');
						if (message.STATUS === 'error') {
							alertError(message.customException
									|| message.error.SYSTEM_ERROR)
						} else if (data.isSuccess) {
							alertSuccess(data.msg || 'Operation is successful.');
							grid.removeVersion();
						} else {
							alertError(data.result.msg || 'Operation is fail.');
						}
					});
				},
				listeners : {'cellclick' : function(grid, cellElement, columnNum, recorder,
							rowElement, rowNum, e) {
					var dataIndex = grid.getHeaderCt()
							.getHeaderAtIndex(columnNum).dataIndex;
					if (!(dataIndex === 'opex'
							|| dataIndex === 'income'
							|| dataIndex === 'expense' || dataIndex === 'recharge')) {
						return;
					}
					var cellId = grid.getHeaderCt()
							.getHeaderAtIndex(columnNum).id;
					var dataIndex = grid.getHeaderCt()
							.getHeaderAtIndex(columnNum).dataIndex;
					var parameter = recorder.data[dataIndex
							+ 'Parameter']
							|| [];
					var cellData = recorder.data[dataIndex];
					var win;
					var cell = grid.getCellByPosition({row:rowNum, column:columnNum });
					if(!cellData){
						DigiCompass.Web.app.cellValidateStyle(cell, false, 'Please input Formula!');
					}else{
						DigiCompass.Web.app.cellValidateStyle(cell, true);
					}
					
					var formData = {
						values : parameter,
						pValue : cellData,
						formulaId : (parameter.length == 0 ? null : parameter[0]['formulaParameter']['formula']['id'])
					};

					if (Ext.getCmp('editWindows')) {
						Ext.getCmp('editWindows').close();
					}
					var formPanel = DigiCompass.Web.app.cost.Grid.getForm(function (formData) {
						console.log(formData);
						var _store = grid.getStore();
						var rec = _store.getAt(rowNum);
						rec.set(dataIndex, formData.pValue);
						rec.set(dataIndex + 'Parameter',
								formData.values);
						DigiCompass.Web.app.cellValidateStyle(grid.getCellByPosition({row:rowNum, column:columnNum }), true);
						if (win) {
							win.close();
						}
					}, formData, dataIndex);
					win = DigiCompass.Web.app.cost.Grid.getWindow(e.getXY(), formPanel);
					win.show();
				}}	
			}),
			back : new DigiCompass.Web.app.VersionForm()
		});
		temp_cmp.add(reversalPanel);
	}
	space.dragRefresh = function(arg) {
		space.refresh(arg);
	}
})();