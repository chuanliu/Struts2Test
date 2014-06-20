(function() {
	function getNewRow(region, band, from, to, technologyId, siteGroupId, versionId, type) {
		return {
			id : null,
			// technology:{id:technologyId},
			// siteGroup : {id:siteGroupId},
			version : {
				id : versionId
			},
			spectrumRegion : {
				id : region.id,
				name : region.name
			},
			band : {
				id : band.id,
				name : band.name
			},
			fromBandCount : from,
			toBandCount : to,
			capex : null,
			opex : null,
			income : null,
			expense : null,
			recharge : null,
			opexParameter : [],
			incomeParameter : [],
			expenseParameter : [],
			rechargeParameter : [],
			type : type
		};
	}
	var space = Ext.namespace('Digicompass.web.cmp.cost.bandUpgrade');
	space.checkMaxDataByDataIndexInStore = function(store,
			checkDataIndexRegion, checkValueRegion, checkDataIndexBand,
			checkValueBand, returnDataIndex, type) {
		if (space.UPGRADE === type) {
			var tmpMax = 1;
			if (store.data) {
				if (store.getCount() != 0) {
					for ( var i = 0; i < store.getCount(); i++) {
						var region = store.getAt(i).data[checkDataIndexRegion].name;
						var band = store.getAt(i).data[checkDataIndexBand].name;
						var _type = store.getAt(i).data['type'];
						if (region == checkValueRegion
								&& band == checkValueBand && _type === type) {
							if (tmpMax < store.getAt(i).data[returnDataIndex]) {
								tmpMax = store.getAt(i).data[returnDataIndex];
							}
						}
					}
				}
			}
			return tmpMax;
		} else if (space.NEW === type) {
			var tmpMax = 0;
			if (store.getCount() != 0) {
				for ( var i = 0; i < store.getCount(); i++) {
					var region = store.getAt(i).data[checkDataIndexRegion].name;
					var band = store.getAt(i).data[checkDataIndexBand].name;
					var _type = store.getAt(i).data['type'];
					if (region == checkValueRegion && band == checkValueBand
							&& _type === type) {
						if (tmpMax < store.getAt(i).data[returnDataIndex]) {
							tmpMax = store.getAt(i).data[returnDataIndex];
						}
					}
				}
			}
			return tmpMax;
		}
	}
	space.NEW = 'New Band Introduction';
	space.UPGRADE = 'Same Band Upgrade';
	space.refresh = function(arg) {
		var id = 'BAND_UPGRADE_COST_GRID_'+(arg.scenarioId||'')+(arg.versionId||'');
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
			panelTitle : 'Same Band Upgrade',
			showNavigation : arg.showNavigation || false,
			front : new DigiCompass.Web.app.ObjectGrid({
				defaultTitle : 'Same Band Upgrade',
				moduleType : 'MOD_BAND_UPGRADE_COST',
				moduleCommand : 'COMMAND_QUERY_LIST',
				dragModuleCommand : 'COMMAND_QUERY_DRAG_GRID',
				scenarioId : arg.scenarioId,
				versionId : arg.versionId,
				technologyId : arg.technologyId,
				siteGroupId : arg.siteGroupId,
				dragVersionId : arg.dragVersionId,
				versionName : arg.versionName,
				planningCycleId : arg.planningCycleId,
				tableName : 'TB_STG_COST_BAND_UPGRADE',
				edit : arg.edit || false,
				loadDataListener : function(data, msg) {
					var gridData = Ext.JSON.decode(data['grid']);
					for ( var i in gridData) {
						gridData[i].type = gridData[i].fromBandCount === 0 ? space.NEW : space.UPGRADE;
					}
					 this.getStore().loadData(gridData);
										
					 var versionForm = this.reversalPanel.back;
					 versionForm.setValues({
						 versionId : msg.versionId,
						 versionName : data.versionName
					 });
					 this.versionName = data.versionName;
				},
				store : Ext.create('Ext.data.ArrayStore', {
					fields : [ 'id', "version", 'spectrumRegion', 'band',
								'fromBandCount', 'type', 'toBandCount', 'capex',
								'opex', 'income', 'expense', 'recharge',
								'incomeParameter', 'expenseParameter',
								'rechargeParameter', 'opexParameter' ],
					groupers : [ 'type' ],
					data : []
				}),
				features : Ext.create('Ext.grid.feature.MultiGroupingSummary',{
					baseWidth:50,
			        groupHeaderTpl: '{disName}'
			      }),
				columns : [/*{
					dataIndex : 'flag',
					hidden : true,
					width : 30,
					renderer : function() {
						return "<input type='radio' name = 'only'/>";
					}
				},*/{ 
					columnType:'summary', 
					menuDisabled: true 
				},{
					header : 'Type',
					sortable : false,
					width : 110,
					dataIndex : 'type'
				},{
					header : 'Spectrum Region',
					sortable : false,
					width : 110,
					dataIndex : 'spectrumRegion',
					renderer : function(value) {
						return value.name;
					}
				}, {
					header : 'Band',
					sortable : false,
					width : 80,
					dataIndex : 'band',
					renderer : function(value) {
						return value.name;
					}
				}, {
					header : 'From',
					dataIndex : 'fromBandCount',
					sortable : false
				}, {
					header : 'To',
					dataIndex : 'toBandCount',
					sortable : false
				}, {
					header : 'Capex',
					dataIndex : 'capex',
					sortable : false,
					width : 100,
					field : {
						xtype : 'numberfield',
						allowBlank : false,
						maxLength : 20,
						minValue : 0
					}
				}, {
					header : 'Opex',
					dataIndex : 'opex',
					sortable : false,
					width : 100
				/*
				 * , field : { xtype : 'numberfield',
				 * allowBlank : false }
				 */
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
				onNew : function(param, btn, event) {
					var grid = this;
					var formPosition = event.getPoint();
					if (Ext.getCmp('regionSelectWin'+ grid.scenarioId)) {
						Ext.getCmp('regionSelectWin'+ grid.scenarioId).colse();
					}
					var regionStore = Ext.create('Ext.data.ArrayStore',{
						fields : [ 'disp','val' ],
						data : [ [ 'Rural','2' ] ]
					});
					var bandStore = Ext.create('Ext.data.ArrayStore',{
						fields : [ 'disp','val' ],
						data : [ [ '2100','2' ] ]
					});
					var regionForm = Ext.create('Ext.form.Panel',{
						xtype : 'form',
						// id :
						// 'regionform',
						border : 0,
						height : 200,
						width : 350,
						buttonAlign : 'center',
						fieldDefaults : {
							labelAlign : 'right',
							msgTarget : 'side',
							margin : '10 0 0 0',
							allowBlank : false
						},
						items : [new DigiCompass.web.UI.ComboBox({
								id : 'regionCombo__' + grid.scenarioId,
								fieldLabel : 'Regions',
								moduleType : 'MOD_SPECTRUM_REGION',
								tableName : null,
								parameter : {
									scenarioId : grid.scenarioId
								},
								allowBlank : false,
								autoLoadByCometd : true
							}),
							new DigiCompass.web.UI.ComboBox({
								id : 'bandCombo__' + grid.scenarioId,
								fieldLabel : 'Bands',
								tableName : 'tb_stg_band',
								whereColumn : 'technology',
								whereValue : grid.technologyId,
								allowBlank : false,
								autoLoadByCometd : true
							}),
							new Ext.form.field.ComboBox({
								id : 'band_upgrade_type_'+ grid.scenarioId,
								store : Ext.create('Ext.data.ArrayStore',{
									fields : ['id','name' ],
									data : [[space.NEW,'New' ],[space.UPGRADE,'Upgrade' ] ]
								}),
								fieldLabel : 'Type',
								displayField : 'name',
								valueField : 'id',
								editable : false,
								emptyText : 'please select an item.',
								queryModel : 'local',
							}),
							{
								xtype : 'fieldcontainer',
								labelStyle : 'font-weight:bold;padding:0',
								layout : 'column',
								defaultType : 'numberfield',
								width : 350,
								fieldDefaults : {
									labelAlign : 'left',
									labelWidth : 30,
									msgTarget : 'side'
								}
							} ],
						buttons : [ {
							xtype : 'button',
							text : 'ok',
							handler : function() {
								var typeComb = Ext.getCmp('band_upgrade_type_'+ grid.scenarioId);
								var type = typeComb.getValue();
								if (!regionForm.getForm().isValid()) {
									return;
								}
								if (regionForm.getForm().getValues().from > regionForm.getForm().getValues().to) {
									alertError('From must < To');
									return;
								}
								var _region = {};
								var _regionCombo = Ext.getCmp('regionCombo__'+ grid.scenarioId);
								_region.id = _regionCombo.getValue();
								_region.name = _regionCombo.getRawValue();
								var _band = {};
								var _bandCombo = Ext.getCmp('bandCombo__'+ grid.scenarioId);
								_band.id = _bandCombo.getValue();
								_band.name = _bandCombo.getRawValue();

								var max = space.checkMaxDataByDataIndexInStore(
									grid.getStore(),'spectrumRegion',_regionCombo.getRawValue(),
									'band',_bandCombo.getRawValue(),'toBandCount',type);

								var from = 0, to = 0;
								if (space.UPGRADE === type) {
									from = Number(max);
									to = from + 1;
								} else {
									to = Number(max) + 1;
									from = 0;
								}
								var newRow = getNewRow(
										_region,
										_band,
										from,
										to,
										grid.technologyId,
										grid.siteGroupId,
										grid.versionId,
										type);
								var add = grid.getStore().add(newRow);
								regionSelectWin.close();
							}
						} ]
					});
					var regionSelectWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
						id : 'regionSelectWin'+ grid.scenarioId,
						x : formPosition.x,
						y : formPosition.y,
						title : 'Please Select Region',
						height : 180,
						width : 350,
						layout : 'fit',
						items : [ regionForm ]
									});
					regionSelectWin.show();
				
				},
				onSave : function(param) {
					var grid = this;
					var _datas = [];
					var headers = grid.getView().getHeaderCt();
					for ( var i = 0; i < grid.getStore().count(); i++) {
						var record = grid.getStore().getAt(i).data;
						for ( var j = 2; j < headers.getColumnCount(); j++) {
							var val = record[headers.getHeaderAtIndex(j).dataIndex];
							if (Ext.isEmpty(val)) {
								alertError('Grid has empty fields !');
								if(!grid.reversalPanel.isFront){
									grid.reversalPanel.toFront();
								}
								return;
							}
						}
						delete record['type'];
						_datas.push(record);
					}
					cometdfn.request({
						MODULE_TYPE : grid.moduleType,
						COMMAND : 'COMMAND_SAVE_BATCH',
						data : Ext.JSON.encode(_datas),
						versionId : grid.versionId,
						scenarioId : grid.scenarioId,
						siteGroupId : grid.siteGroupId,
						dragVersionId : grid.dragVersionId,
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
					var headers = grid.getView().getHeaderCt();
					for ( var i = 0; i < grid.getStore().count(); i++) {
						var record = grid.getStore().getAt(i).data;
						for ( var j = 2; j < headers.getColumnCount(); j++) {
							var val = record[headers.getHeaderAtIndex(j).dataIndex];
							if (Ext.isEmpty(val)) {
								alertError('Grid has empty fields !');
								if(!grid.reversalPanel.isFront){
									grid.reversalPanel.toFront();
								}
								return;
							}
						}
						delete record['type'];
						_datas.push(record);
					}
					cometdfn.request({
						MODULE_TYPE : grid.moduleType,
						COMMAND : 'COMMAND_SAVE_BATCH',
						data : Ext.JSON.encode(_datas),
						versionId : grid.versionId,
						siteGroupId : grid.siteGroupId,
						scenarioId : grid.scenarioId,
						dragVersionId : grid.dragVersionId,
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
				onDelete : function(param) {
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
							DigiCompass.Web.app.cellValidateStyle(grid.getCellByPosition({row:rowNum, column:columnNum }), false, 'Please input Formula!');
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
