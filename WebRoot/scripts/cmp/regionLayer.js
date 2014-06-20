(function() {
	var space = Ext.namespace('Digicompass.web.cmp.layer.RegionLayer');
	space.refreshLayerComboBox = function(scenarioId){
		DigiCompass.web.UI.ComboBox.publish('MOD_LAYER_DEFINITION','MOD_DICTIONARY_TABLE',{scenarioId : scenarioId});
	}
	function DataColumn(id, name, scenarioId,gid) {
		return new Ext.grid.Column({
			text : name,
			dataIndex : id,
			renderer : function(val, style, model) {
				return model.getData()[id + '_NAME'];
			},
			editor : new DigiCompass.web.UI.ComboBox({
				moduleType : 'MOD_LAYER_DEFINITION',
				parameter : {
					scenarioId : scenarioId
				},
				autoLoadByCometd : false,
				allowBlank : false,
				listeners : {
					change : function() {
						var grid = Ext.getCmp(gid).front;
						var row = grid.getSelectionModel().getSelection()[0].data;
						row[id + '_NAME'] = this.rawValue;
					}
				}
			})
		});
	}
	space.refresh = function(arg) {
		var id = 'Layer_RegionLayer_GRID_'+(arg.scenarioId||'')+(arg.versionId||'');
		var panel = Ext.getCmp(id);
		if(panel){
			panel.front.refresh(arg);
			return;
		}
		var columns = [{ 
			columnType:'summary', 
			menuDisabled: true ,
			hidden : true
		},{
			text : 'Spectrum Region',
			dataIndex : 'spectrumRegion',
			renderer : function(val, style, model) {
				return model.getData().specRegName;
			},
			editor : new DigiCompass.web.UI.ComboBox({
				allowBlank : false,
				moduleType : 'MOD_SPECTRUM_REGION',
				tableName : null,
				parameter : {
					scenarioId : arg.scenarioId
				},
				autoLoadByCometd : true,
				listeners : {
					beforeselect : function(self, newVal) {
						console.log(arguments)
						var grid = Ext.getCmp(id).front;
						var row = grid.getSelectionModel().getSelection()[0];
						if(newVal.get('id') && row.get('spectrumRegion') != newVal.get('id')){
							row.set('specRegName',newVal.get('name'));
							var s = grid.getStore()
							var no = 0;
							for(var i = 0; i< s.getCount(); i++){
								var r = s.getAt(i).data;
								if(newVal.get('id') === r.spectrumRegion && r.priorityNO>no){
									no = r.priorityNO;
								}
							}
							row.set('priorityNO', no+1);
						}
					},focus : function(){
						var grid = Ext.getCmp(id).front;
						var row = grid.getSelectionModel().getSelection()[0];
						if(!Ext.isEmpty(row.get('priorityNO'))){
							var s = grid.getStore()
							var no = 1;
							for(var i = 0; i< s.getCount(); i++){
								var r = s.getAt(i).data;
								if(this.getValue() === r.spectrumRegion && r.priorityNO>no){
									no = r.priorityNO;
								}
							}
							if(row.get('priorityNO')<no){
								this.disable();
							}
						}
					},blur : function(){
						this.enable();
					}
				}
			})
		}, {
			text : 'Priority',
			dataIndex : 'priorityNO',
			field : {
				xtype : 'numberfield',
				allowBlank : false,
				readOnly:true
			}
		} ];
		var fields = [ 'spectrumRegion', 'specRegName', 'priorityNO' ];
		var temp_cmp = Ext.getCmp(arg.renderCmp);
		var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
			margins : '5 0 5 5',
			height : 300,
			
			id : id,
			panelTitle : 'Region Layer Priority',
			showNavigation : arg.showNavigation || false,
			front : new DigiCompass.Web.app.ObjectGrid({
				defaultTitle : 'Region Layer Priority',
				moduleType : 'MOD_REGION_LAYER',
				moduleCommand : 'COMMAND_QUERY_GRID',
				dragModuleCommand : 'COMMAND_QUERY_DRAG_GRID',
				scenarioId : arg.scenarioId,
				versionId : arg.versionId,
				technologyId : arg.technologyId,
				siteGroupId : arg.siteGroupId,
				dragVersionId : arg.dragVersionId,
				siteGroupPlannedId : arg.siteGroupPlannedId,
				versionName : arg.versionName,
				planningCycleId : arg.planningCycleId,
				tableName : 'TB_STG_LAYER_PRIORITY',
				edit : arg.edit || false,
				loadDataListener : function(data, msg){
					console.log(this.defaultTitle,msg);
					var tmpData = Ext.JSON.decode(data.grid.data);
					var columnHeader = Ext.JSON.decode(data.grid.columnHeader);

					var gridData = [];
					for ( var i = 0; i < tmpData.length; i++) {
						var row = {};
						for ( var j = 0; j < tmpData[i].length; j++) {
							if (j === 0) {
								row['spectrumRegion'] = tmpData[i][j][0];
								row['specRegName'] = tmpData[i][j][1];
								row['priorityNO'] = tmpData[i][j][3];
							}
							row[tmpData[i][j][4]] = tmpData[i][j][5];
							row[tmpData[i][j][4] + '_NAME'] = tmpData[i][j][6];
							row[tmpData[i][j][4] + '_ID'] = tmpData[i][j][2];
						}
						gridData.push(row);
					}
					if(!this.isDataLoaded){
						for ( var o in columnHeader) {
							var cid = columnHeader[o].id
							var name = columnHeader[o].name
							columns.push(new DataColumn(cid, name, msg.scenarioId,id));
							fields.push(cid);
							fields.push(cid + '_NAME');
							fields.push(cid + '_ID');
						}
						
						var store = Ext.create('Ext.data.ArrayStore', {
							fields : fields,
							data : []
						});
						this.reconfigure(store, columns);
						this.isDataLoaded = true;
						space.refreshLayerComboBox(msg.scenarioId);
					}else{
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
					fields : fields,
					data : []
				}),
				features : Ext.create('Ext.grid.feature.MultiGroupingSummary',{
					baseWidth:50,
			        groupHeaderTpl: '{disName}'
			      }),
				columns :  [],
				onNew : function(param, btn){
					var grid = this;
					var rowEditing = grid.getPlugin();
					rowEditing.cancelEdit();
					var newRow = {
						'id' : null,
						'spectrumRegion' : null,
						'priorityNO' : null
					}
					for ( var i = 3; i < fields.length; i++) {
						newRow[fields[i]] = null;
					}
					grid.getStore().add(newRow);
					rowEditing.startEdit(grid.getStore().getCount()-1, 0);
				},
				onSave : function(param){
					var grid = this;
					var data = [];
					var s = grid.getStore();
					var valid = true;
					for(var r=0; r<s.getCount(); r++){
						var row = Ext.clone(s.getAt(r).data);
						for ( var i = 2; i < columns.length; i++) {
							var colIndex = columns[i]['dataIndex'];
							var cell = grid.getView().getCellByPosition({row:r, column:i });
							if(!row['spectrumRegion']){
								DigiCompass.Web.app.cellValidateStyle(cell, false, 'Please select a Region!');
								valid = false;
								continue;
							}
							if(!row[colIndex]){
								DigiCompass.Web.app.cellValidateStyle(cell, false, 'Please select a Layer!');
								valid = false;
								continue;
							}
							data.push({
								id : row[colIndex + '_ID'],
								priorityNo : row[colIndex + '_ID'] ? row.priorityNO : null,
								layerDefinition : {
									id : row[colIndex]
								},
								planningCycleItem : {
									id : colIndex
								},
								spectrumRegion : {
									id : row.spectrumRegion
								},
								siteGroup : {
									id : this.siteGroupId
								}
							});
						}
					}
					if(!valid){
						grid.reversalPanel.toFront();
						return;
					}
					cometdfn.request({
						MODULE_TYPE : grid.moduleType,
						COMMAND : 'COMMAND_SAVE_BATCH',
						data : Ext.JSON.encode(data),
						scenarioId : grid.scenarioId,
						varersionId : grid.versionId,
						dragVersionId : grid.dragVersionId,
						technologyId : grid.technologyId,
						change : grid.store.getModifiedRecords().length>0,
						siteGroupPlannedId : arg.siteGroupPlannedId,
						siteGroupId : grid.siteGroupId,
						planningCycleId : grid.planningCycleId,
						versionName : param.versionName,
						comment : param.comment
					},function(message) {
						if (DigiCompass.Web.app.checkResult(grid,message)) {
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
					for(var r=0; r<s.getCount(); r++){
						var row = Ext.clone(s.getAt(r).data);
						for ( var i = 2; i < columns.length; i++) {
							var colIndex = columns[i]['dataIndex'];
							var cell = grid.getView().getCellByPosition({row:r, column:i });
							if(!row['spectrumRegion']){
								DigiCompass.Web.app.cellValidateStyle(cell, false, 'Please select a Region!');
								valid = false;
								continue;
							}
							if(!row[colIndex]){
								DigiCompass.Web.app.cellValidateStyle(cell, false, 'Please select a Layer!');
								valid = false;
								continue;
							}
							data.push({
								id : row[colIndex + '_ID'],
								priorityNo : row[colIndex + '_ID'] ? row.priorityNO : null,
								layerDefinition : {
									id : row[colIndex]
								},
								planningCycleItem : {
									id : colIndex
								},
								spectrumRegion : {
									id : row.spectrumRegion
								},
								siteGroup : {
									id : this.siteGroupId
								}
							});
						}
					}
					if(!valid){
						grid.reversalPanel.toFront();
						return;
					}
					cometdfn.request({
						MODULE_TYPE : grid.moduleType,
						COMMAND : 'COMMAND_SAVE_BATCH',
						data : Ext.JSON.encode(data),
						scenarioId : grid.scenarioId,
						varersionId : grid.versionId,
						dragVersionId : grid.dragVersionId,
						change : grid.store.getModifiedRecords().length>0,
						technologyId : grid.technologyId,
						siteGroupPlannedId : arg.siteGroupPlannedId,
						siteGroupId : grid.siteGroupId,
						planningCycleId : grid.planningCycleId,
						versionName : param.versionName,
						comment : param.comment,
						saveType : 'SAVE_AS'
					}, function(message){
						if (DigiCompass.Web.app.checkResult(grid,message)) {
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
					var grid = this;
					var sm = grid.getSelectionModel();
					var selection = sm.getSelection();
					var row = selection[0].data;
					var s = grid.getStore();
					if(!Ext.isEmpty(row.priorityNO)){
						for(var i = 0; i< s.getCount(); i++){
							var r = s.getAt(i).data;
							if(row.spectrumRegion === r.spectrumRegion && r.priorityNO > row.priorityNO){
								return false;
							}
						}
					}
					return true;
				},
				onRemoveVersion : function(param){
					var grid = this;
					cometdfn.request({
						MODULE_TYPE : 'MOD_VERSION_MANAGER',
						COMMAND : 'COMMAND_DEL',
						versionId : arg.versionId,
						scenarioId : arg.scenarioId
					}, function(message){
						var result = Ext.JSON.decode(message.BUSINESS_DATA);
						if(result['isSuccess']){
							grid.removeVersion();
						}
					});
				}
			}),
			back : new DigiCompass.Web.app.VersionForm()
		});
		temp_cmp.insert(1, reversalPanel);
		space.refreshLayerComboBox(arg.scenarioId);
	}
})();

/*
	var space = Ext.namespace('Digicompass.web.cmp.layer.RegionLayer');
	space.refreshLayerComboBox = function(scenarioId){
		DigiCompass.web.UI.ComboBox.publish('MOD_LAYER_DEFINITION','MOD_DICTIONARY_TABLE',{scenarioId : scenarioId});
	}
	space.MODULE_TYPE = 'MOD_REGION_LAYER';
	space.GRID_ID = 'Layer_RegionLayer_GRID_';
	space.TITLE = 'Region Layer Priority';
	space.configs = {};
	space.initConfig = function(config){
		config.isDrag = false;
		config.dragVersionId = null;
		return config;
	}
	space.refreshDefinition = true;
	space.loadGrid = function(data) {
		var scenarioId = data['scenarioId'];
		var versionId = data['versionId'];
		var technologyId = data['technologyId'];
		var siteGroupId = data['siteGroupId'];
		var dragVersionId = data['dragVersionId'] || null;
		var isDrag = Ext.isString(dragVersionId);
		if(versionId){
			space.configs[scenarioId].versionId = versionId;
		}
		space.configs[scenarioId].dragVersionId =  dragVersionId;
		space.configs[scenarioId].isDrag =  isDrag;
			
		var config = space.configs[scenarioId];
			
		var gridId = space.GRID_ID + config.scenarioId;
		var renderCmp = config.renderCmp + config.scenarioId;
		
		var title = space.TITLE;
		var tempVersionName = data['BUSINESS_DATA']['grid']['versionName'];
		if(tempVersionName && !Ext.isEmpty(tempVersionName)){
			title += '('+ tempVersionName +')';
		}
		
		var tmpData = Ext.JSON.decode(data['BUSINESS_DATA'].grid.data);
		var columnHeader = Ext.JSON.decode(data['BUSINESS_DATA'].grid.columnHeader);

		var gridData = [];
		for ( var i = 0; i < tmpData.length; i++) {
			var row = {};
			for ( var j = 0; j < tmpData[i].length; j++) {
				if (j === 0) {
					row['spectrumRegion'] = tmpData[i][j][0];
					row['specRegName'] = tmpData[i][j][1];
					row['priorityNO'] = tmpData[i][j][3];
				}
				row[tmpData[i][j][4]] = tmpData[i][j][5];
				row[tmpData[i][j][4] + '_NAME'] = tmpData[i][j][6];
				row[tmpData[i][j][4] + '_ID'] = tmpData[i][j][2];
			}
			gridData.push(row);
		}

		var grid = Ext.getCmp(gridId);

		if (grid) {
			grid.setTitle(title);
			grid.getStore().loadData(gridData);
		} else {
			var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
				clicksToEdit : 1,
				autoCancel : false,
				listeners : {
					beforeedit : function(edit, erow){
						var row = erow.record.data;
						var s = grid.getStore();
						if(!Ext.isEmpty(row.priorityNO)){
							for(var i = 0; i< s.getCount(); i++){
								var r = s.getAt(i).data;
								if(row.spectrumRegion === r.spectrumRegion && r.priorityNO > row.priorityNO){
									this.getEditor().getForm().getFields().items[0].disable();
									return;
								}
							}
						}
						this.getEditor().getForm().getFields().items[0].enable();
					},
					afteredit :  function(edit, row) {
						var newValues = [];
						var r = row.record.data;
						for ( var i = 2; i < columns.length; i++) {
							var colIndex = columns[i]['dataIndex'];
							newValues.push({
								id : r[colIndex + '_ID'],
								priorityNo : r[colIndex + '_ID'] ? r.priorityNO : null,
								layerDefinition : {
									id : r[colIndex]
								},
								planningCycleItem : {
									id : colIndex
								},
								spectrumRegion : {
									id : r.spectrumRegion
								},
								siteGroup : {
									id : config.siteGroupId
								}
							});
						}
						if(!config.isDrag && Ext.isEmpty(config.versionId)){
							promptDialog('Add Version','Please enter the version name:', function(ok, versionName){
								if(ok === 'ok'){
									cometdfn.request({
										MODULE_TYPE : space.MODULE_TYPE,
										COMMAND : 'COMMAND_SAVE_BATCH',
										data : Ext.JSON.encode(newValues),
										scenarioId : config.scenarioId,
										versionName : versionName
									},function(message) {
										if (ServerMessageProcess(message)) {
											config.versionId = message.BUSINESS_DATA.message;
											space.refresh(config);
										}
									});
								}
							});
						}else{
							cometdfn.request({
								MODULE_TYPE : space.MODULE_TYPE,
								COMMAND : 'COMMAND_SAVE_BATCH',
								data : Ext.JSON.encode(newValues),
								scenarioId : config.scenarioId
							},function(message) {
								if (ServerMessageProcess(message)) {
									config.versionId = message.BUSINESS_DATA.message;
									space.refresh(config);
								}
							});
						}
					}
				}
			});


			var columns = [{
						text : 'Spectrum Region',
						dataIndex : 'spectrumRegion',
						renderer : function(val, style, model) {
							return model.getData().specRegName;
						},
						editor : new DigiCompass.web.UI.ComboBox({
							allowBlank : false,
							moduleType : 'MOD_SPECTRUM_REGION',
							tableName : null,
							parameter : {
								scenarioId : config.scenarioId
							},
							autoLoadByCometd : true,
							listeners : {
								change : function() {
									var row = grid.getSelectionModel().getSelection()[0].data;
									row.specRegName = this.rawValue;
									var s = grid.getStore()
									var no = 0;
									for(var i = 0; i< s.getCount(); i++){
										var r = s.getAt(i).data;
										if(this.getValue() === r.spectrumRegion && r.priorityNO>no){
											no = r.priorityNO;
										}
									}
									this.next().setValue(no+1);
								}
							}
						})
					}, {
						text : 'Priority',
						dataIndex : 'priorityNO',
						field : {
							xtype : 'numberfield',
							allowBlank : false,
							readOnly:true
						}
					} ];
			
			
			
			
			
			
			var fields = [ 'spectrumRegion', 'specRegName', 'priorityNO' ];
			for ( var o in columnHeader) {
				var id = columnHeader[o].id
				var name = columnHeader[o].name
				columns.push(new DataColumn(id, name));
				fields.push(id);
				fields.push(id + '_NAME');
				fields.push(id + '_ID');
			}
			
			var btn_clear = Ext.create('Ext.Button',{
				text:'Clear Grouping',
	            handler : function(a,b,c,d) {
	                features.cleanGrouping();
				}
			});
		
			var features =  Ext.create('Ext.grid.feature.MultiGroupingSummary',{
				baseWidth:50,
		        groupHeaderTpl: '{disName}'
		      });

			grid = Ext.create('Ext.grid.Panel',{
				id : gridId,
				title : title,
				store : Ext.create('Ext.data.JsonStore', {
					fields : fields,
					data : gridData
				}),
				columns : columns,
				collapsible : true,
				features : features,
				height : 280,
				width : '100%',
				margins : '5 0 5 5',
				plugins : [ rowEditing ],

				tbar : [{
						text : 'New',
						handler : function() {
							var newRow = {
								'id' : null,
								'spectrumRegion' : null,
								'priorityNO' : null
							}
							for ( var i = 3; i < fields.length; i++) {
								newRow[fields[i]] = null;
							}
							
							grid.getStore().insert(0, newRow);
						}
					},{
						text : 'Save',
						handler : function() {
							if(config.isDrag){
								cometdfn.request({
										MODULE_TYPE : space.MODULE_TYPE,
										COMMAND : 'COMMAND_SAVE_DRAG',
										scenarioId : config.scenarioId,
										dragVersionId : config.dragVersionId,
										saveType : 'SAVE'
									}, function(message){
										if (ServerMessageProcess(message)) {
											space.initConfig(config);
											config.versionId = message.BUSINESS_DATA.message;
											space.refresh(config);
										}
								});
							}
						}
					},{
						text : 'Save As',
						handler : function() {
							if(config.isDrag){
								promptDialog('Add Version','Please enter the version name:', function(ok, versionName){
									if(ok === 'ok'){
										cometdfn.request({
												MODULE_TYPE : space.MODULE_TYPE,
												COMMAND : 'COMMAND_SAVE_DRAG',
												scenarioId : config.scenarioId,
												dragVersionId : config.dragVersionId,
												saveType : 'SAVE_AS',
												versionName : versionName
											}, function(message){
												if (ServerMessageProcess(message)) {
													space.initConfig(config);
													config.versionId = message.BUSINESS_DATA.message;
													config.versionName = versionName;
													space.refresh(config);
												}
												
										});
									}
								},this, this);
							}
						}
					},{
						text : 'Delete',
						handler : function() {
							var sm = grid.getSelectionModel();
							if (sm.getSelection().length == 0) {
								alertWarring('Please select a record.')
								return;
							}
							var record = sm.getSelection()[0].data;
							if (!Ext.isEmpty(id)) {
								var s = grid.getStore();
								if(!Ext.isEmpty(record.priorityNO)){
									for(var i = 0; i< s.getCount(); i++){
										var r = s.getAt(i).data;
										if(row.spectrumRegion === r.spectrumRegion && r.priorityNO > record.priorityNO){
											alertWarring('Can not delete this record.');
											return;
										}
									}
								}
								
								alertOkorCancel('are sure remove this recored?', function(e) {
									if (e === 'yes') {
										rowEditing.cancelEdit();
										var ids = [];
										for ( var i = 2; i < columns.length; i++) {
											ids.push(record[columns[i]['dataIndex'] + '_ID']);
										}
										console.log(ids);
										cometdfn.request({
													MODULE_TYPE : space.MODULE_TYPE,
													COMMAND : 'COMMAND_DEL',
													ids : Ext.JSON.encode(ids),
													priorityNO : record.priorityNO
												}, function(message) {
													console.log(message);
													if (ServerMessageProcess(message)) {
														space.refresh(config);
													}
												});
									}
								});
							} else {
								rowEditing.cancelEdit();
								grid.store.remove(selection[0]);
							}
						}
					},{
						text : 'Remove',
						handler : function() {
							if(isDrag || !config.versionId){
								alertError('You have not saved the version information, and can not be removed.');
								return ;
							}
							alertOkorCancel('Are you sure to remove this grid?',function(e){
								if(e==='yes'){
									cometdfn.request({
										MODULE_TYPE : 'MOD_VERSION_MANAGER',
										COMMAND : 'COMMAND_DEL',
										versionId : config.versionId,
										scenarioId : config.scenarioId
									}, function(message){
										var result = Ext.JSON.decode(message.BUSINESS_DATA);
										if(result['isSuccess']){
											space.initConfig(config);
											config.versionId = null;
											space.refresh(config);
										}
									});
								}
							});
						}
					},{
						xtype : 'button',
						text : 'Reset',
//						iconCls : 'icon-refresh',
						handler : function(){
							space.refresh(config);
						}
					},{
						xtype : 'button',
						text : 'Versions',
						handler : function(self){
							//var tableName = DigiCompass.Web.UI.Cmp.TableName.getTableNameByGridId(id);					    	
					    	DigiCompass.Web.UI.CometdPublish.getVersionDataPublish("TB_STG_LAYER_PRIORITY");
						}
					} ,{
						xtype : 'button',
						text : 'refresh',
//						iconCls : 'icon-refresh',
						handler : function(){
							space.refresh(config);
						}
					} ,btn_clear],
			});
			space.refreshLayerComboBox(config.scenarioId);
			
			var temp_cmp = Ext.getCmp('centerBottomTabThreeId'+config.scenarioId);
			if(temp_cmp){
				temp_cmp.add(grid);
			}
		}
	}

	*//**
	 * 从后台刷新grid数据
	 * 
	 * @param {}
	 *            config
	 *//*
	space.refresh = function(arg, isDrag) {
		var config = space.configs[arg.scenarioId];
		if(!config){
			config = space.configs[arg.scenarioId] = arg;
		}
		config.versionName = arg.versionName;
		cometdfn.publish({
			MODULE_TYPE : space.MODULE_TYPE,
			COMMAND : isDrag ? 'COMMAND_QUERY_DRAG_GRID' : 'COMMAND_QUERY_GRID',
			versionId : arg.versionId,
			technologyId : arg.technologyId,
			siteGroupId : arg.siteGroupId,
			scenarioId : arg.scenarioId,
			dragVersionId : arg.dragVersionId,
			planningCycleId : arg.planningCycleId
		});
	}
})();
*/