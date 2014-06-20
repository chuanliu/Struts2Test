Ext.require([ 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.state.*' ]);
(function(){
	var renderer = {
			percent : function(val) {
				if (Ext.isEmpty(val) || val === 0) {
					return val;
				}
				return val + '%';
			}
		}
	var space = Ext.namespace('Digicompass.web.cmp.layer.LayerDefainition');

	Ext.define('Digicompass.web.cmp.layer.LayerDefainition.LayerDefinitionModel', {
		extend : Ext.data.Model,
		fields : [ 'id', 'layerName', 'technologyId', 'technologyName',
				'bandId', 'bandName', 'featureId', 'featureName',
				'bphzPerCell', 'mhz', 'cellEfficiency', 'cellsPerLayer',
				'layerEfficiency', 'pkSpeed', 'description', 'CELL_KBPS',
				'LAYER_KBPS' ]
	});
	space.refreshLayerDefinitionGrid = function(arg) {
		var id = 'LAYER_DEFINITION_'+(arg.scenarioId||'')+(arg.versionId||'');
		var panel = Ext.getCmp(id);
		if(panel){
			panel.front.refresh(arg);
			return;
		}
		var temp_cmp = Ext.getCmp(arg.renderCmp);
		var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
			margins : '5 0 5 5',
			height : 300,
			
			panelTitle : 'Layer Defainition',
			id : id,                          
			showNavigation : arg.showNavigation || false,
			front : new DigiCompass.Web.app.ObjectGrid({
				defaultTitle : 'Layer Defainition',
				moduleType : 'MOD_LAYER_DEFINITION',
				moduleCommand : 'COMMAND_QUERY_LIST',
				dragModuleCommand : 'COMMAND_QUERY_DRAG_GRID',
				scenarioId : arg.scenarioId,
				versionId : arg.versionId,
				technologyId : arg.technologyId,
				siteGroupId : arg.siteGroupId,
				dragVersionId : arg.dragVersionId,
				versionName : arg.versionName,
				tableName : 'TB_STG_LAYER_DEFINITION',
				edit : arg.edit || false,
				loadDataListener : function(data, msg){
					console.log(this.defaultTitle,msg);
					var d = data.data;
					for(var i in d){
						d[i][10] = accMul(d[i][10], 100);
						d[i][12] = accMul(d[i][12], 100);
					}
					this.getStore().loadData(d);
					var versionForm = this.reversalPanel.back;
					versionForm.setValues({
						versionId : msg.versionId,
						versionName : data.versionName
					});
					this.versionName = data.versionName;
				},
				store : Ext.create('Ext.data.ArrayStore', {
					model : 'Digicompass.web.cmp.layer.LayerDefainition.LayerDefinitionModel',
					data : []
				}),
				features : Ext.create('Ext.grid.feature.MultiGroupingSummary',{
					baseWidth:50,
			        groupHeaderTpl: '{disName}'
			      }),
				columns :  [{ 
					columnType:'summary', 
					menuDisabled: true 
				}, {
					header : "",
					dataIndex : 'id',
					hidden : true
				}, {
					header : "Layer Name",
					dataIndex : 'layerName',
					editor : {
						emptyText : 'Auto',
						maxLength : 30
					}
				}, {
					header : "Technology",
					dataIndex : "technologyId",
					renderer : function(val, style, model) {
						return model.getData().technologyName;
					}
				}, {
					header : "Band",
					dataIndex : 'bandId',
					renderer : function(val, style, model) {
						return model.getData().bandName;
					},
					editor : new DigiCompass.web.UI.ComboBox({
						tableName : 'tb_stg_band',
						whereColumn : 'technology',
						whereValue : arg.technologyId,
						allowBlank : false,
						autoLoadByCometd :true,
						listeners:{
							change:function(){
								var grid = Ext.getCmp(id).front;
								var row = grid.getSelectionModel().getSelection()[0].data;
								row.bandName = this.rawValue;
							}
						}
					})
				}, {
					header : "Feature",
					dataIndex : 'featureId',
					renderer : function(val, style, model) {
						return model.getData().featureName;
					},
					editor : new DigiCompass.web.UI.ComboBox({
						tableName : 'tb_stg_feature',
						whereColumn : 'technology',
						whereValue : arg.technologyId,
						allowBlank : false,
						autoLoadByCometd :true,
						listeners:{
							change:function(){
								var grid = Ext.getCmp(id).front;
								var row = grid.getSelectionModel().getSelection()[0].data;
								row.featureName = this.rawValue;
							}
						}
					})
				}, {
					header : "b/Hz Per Cell",
					dataIndex : 'bphzPerCell',
					editor : {
						xtype : 'numberfield',// NUMBER(4,2)
						allowBlank : false,
						decimalPrecision : 4,
						step : 0.1,
						maxLength : 15 , 
						minValue : 0
					}
				}, {
					header : "MHz",
					dataIndex : 'mhz',
					editor : {
						xtype : 'numberfield',// NUMBER(2)
						allowBlank : false,
						maxLength : 15,
						minValue:0
					}
				}, {
					header : "Cell Efficiency",
					width : 80,
					dataIndex : 'cellEfficiency',
					renderer : renderer.percent,
					editor : {
						xtype : 'numberfield',// CELL_EFFICIENCY
						allowBlank : false,
						decimalPrecision : 4,
						minValue : 0,
						maxLength :15
					}
				}, {
					header : "Cells Per Layer",
					dataIndex : 'cellsPerLayer',
					editor : {
						xtype : 'numberfield',// NUMBER(2)
						allowBlank : false,
						minValue : 0,
						maxLength :15
					}
				}, {
					header : "Layer Efficiency",
					dataIndex : 'layerEfficiency',
					renderer : renderer.percent,
					editor : {
						xtype : 'numberfield',// NUMBER(5,2)
						allowBlank : false,
						decimalPrecision : 4,
						minValue : 0,
						maxLength :15
					}
				}, {
					header : "PK Speed(Mbps)",
					dataIndex : 'pkSpeed',
					editor : {
						xtype : 'numberfield',// NUMBER(6,2)
						allowBlank : false,
						minValue : 0,
						maxLength :15,
						listeners:{
							change:function(){
							}
						}
					}
				}, {
					header : "Desc",
					dataIndex : 'description',
					editor : {
						xtype : 'textfield',// VARCHAR2(255)
						allowBlank : false,
						maxLength : 30
					}
				}, {
					header : "Cell KBPS",
					dataIndex : 'CELL_KBPS',
					renderer : function(val, style, model) {
						return  parseFloat(val).toFixed(2); ;
					}
				}, {
					header : "Layer(Kbps)",
					dataIndex : 'LAYER_KBPS',
					renderer : function(val, style, model) {
						return  parseFloat(val).toFixed(2);
					}
				} ],
				onNew : function(param, btn){
					var grid = this;
					var rowEditing = grid.getPlugin();
					rowEditing.cancelEdit();
					var r = new space.LayerDefinitionModel();
					r.data.technologyId = config.technologyId;
					console.log(r)
					grid.store.insert(0, r);
					rowEditing.startEdit(0, 0);
				},
				onSave : function(param){
					var grid = this;
					var data = [];
					var s = grid.getStore();
					var valid = true;
					for(var i=0; i<s.getCount(); i++){
						var row = Ext.clone(s.getAt(i).data);
						if(Ext.isEmpty(row.layerName) || row.layerName === 'Auto'){
							row.layerName = row.bandName+' ' + row.pkSpeed +'Mbps';
							s.getAt(i).set('layerName', 'Auto');
						}
						for ( var j = 4; j < grid.columns.length-2; j++) {
							if(!row[grid.columns[j]['dataIndex']]){
								var cell = grid.getView().getCellByPosition({row:i, column:j });
								DigiCompass.Web.app.cellValidateStyle(cell, false, 'this field is required!');
								valid = false;
								continue;
							}
						}
						delete row['CELL_KBPS'];
						delete row['LAYER_KBPS'];
						row.cellEfficiency = accDiv(row.cellEfficiency, 100);
						row.layerEfficiency = accDiv(row.layerEfficiency, 100);
						data.push(row);
					}
					if(!valid){
						grid.reversalPanel.toFront();
						return;
					}
					cometdfn.request({
						MODULE_TYPE : 'MOD_LAYER_DEFINITION',
						COMMAND : 'COMMAND_SAVE',
						data : Ext.JSON.encode(data),
						scenarioId : grid.scenarioId,
						versionId : grid.versionId,
						technologyId : grid.technologyId,
						siteGroupId : grid.siteGroupId,
						planningCycleId : grid.planningCycleId,
						change : grid.store.getModifiedRecords().length>0,
						dragVersionId : grid.dragVersionId,
						versionName : param.versionName,
						comment : param.comment
					}, function(message){
						if (DigiCompass.Web.app.checkResult(grid,message)) {
							Digicompass.web.cmp.layer.RegionLayer.refreshLayerComboBox(grid.scenarioId);
							
							grid.dragVersionId = null;
							grid.refresh(message.BUSINESS_DATA.message, message.versionName);
							var mainTab = Ext.getCmp('outerTabPanelId'+grid.scenarioId);
							if(mainTab.obj && mainTab.obj.tableName === grid.tableName){
								DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(grid.tableName, grid.getParam(), false);
							}
						}
					});
				},
				onSaveAs : function(param){
					var grid = this;
					var data = [];
					var s = grid.getStore();
					var valid = true;
					for(var i=0; i<s.getCount(); i++){
						var row = Ext.clone(s.getAt(i).data);
						if(Ext.isEmpty(row.layerName) || row.layerName === 'Auto'){
							row.layerName = row.bandName+' ' + row.pkSpeed +'Mbps';
							s.getAt(i).set('layerName', 'Auto');
						}
						for ( var j = 4; j < grid.columns.length-2; j++) {
							if(!row[grid.columns[j]['dataIndex']]){
								var cell = grid.getView().getCellByPosition({row:i, column:j });
								DigiCompass.Web.app.cellValidateStyle(cell, false, 'this field is required!');
								valid = false;
								continue;
							}
						}
						delete row['CELL_KBPS'];
						delete row['LAYER_KBPS'];
						row.cellEfficiency = accDiv(row.cellEfficiency, 100);
						row.layerEfficiency = accDiv(row.layerEfficiency, 100);
						data.push(row);
					}
					if(!valid){
						grid.reversalPanel.toFront();
						return;
					}
					cometdfn.request({
						MODULE_TYPE : 'MOD_LAYER_DEFINITION',
						COMMAND : 'COMMAND_SAVE',
						data : Ext.JSON.encode(data),
						scenarioId : grid.scenarioId,
						varersionId : grid.versionId,
						technologyId : grid.technologyId,
						siteGroupId : grid.siteGroupId,
						planningCycleId : grid.planningCycleId,
						change : grid.store.getModifiedRecords().length>0,
						dragVersionId : grid.dragVersionId,
						versionName : param.versionName,
						comment : param.comment,
						saveType : 'SAVE_AS'
					}, function(message){
						if (DigiCompass.Web.app.checkResult(grid,message)) {
							Digicompass.web.cmp.layer.RegionLayer.refreshLayerComboBox(grid.scenarioId);
							grid.dragVersionId = null;
							grid.refresh(message.BUSINESS_DATA.message, param.versionName);
							var mainTab = Ext.getCmp('outerTabPanelId'+grid.scenarioId);
							if(mainTab.obj && mainTab.obj.tableName === grid.tableName){
								DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(grid.tableName, grid.getParam(), false);
							}
						}
					});
				},
				onDelete : function(param){
				},
				onRemoveVersion : function(param){
					var grid = this;
					cometdfn.request({
						MODULE_TYPE : 'MOD_VERSION_MANAGER',
						COMMAND : 'COMMAND_DEL',
						versionId : grid.versionId,
						scenarioId : grid.scenarioId
					}, function(message){
						var result = Ext.JSON.decode(message.BUSINESS_DATA);
						Digicompass.web.cmp.layer.RegionLayer.refreshLayerComboBox(grid.scenarioId);
						if(result['isSuccess']){
							grid.removeVersion();
						}
						
					});
				}
			}),
			back : new DigiCompass.Web.app.VersionForm()
		});
		temp_cmp.insert(0, reversalPanel);
	}
})();
