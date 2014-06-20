(function() {
	Ext.namespace('DigiCompass.Web.app.plannedSitegroup');
	
	var psgId = null;
	var psgName = null;
	var psgDesc = null;
	var pcId = null;
	/**
	 * 拼装siteGrid数据
	 */
	DigiCompass.Web.app.plannedSitegroup.siteGridStoreLoadData= function(data, sitePlannedGroupId){
		psgId = sitePlannedGroupId;
		//siteGroupPlannedId
		var oldSites = DigiCompass.Web.app.plannedSitegroup.getAllSite(Ext.getCmp("plannedSite"));
		DigiCompass.Web.app.plannedSitegroup.combineTwoTreeData(data , oldSites);
		Ext.getCmp("plannedSite").getStore().loadData(data);
		var plannedSiteDataStore = Ext.getCmp("plannedSite").getStore();
		var siteMapArr = new Array();
		plannedSiteDataStore.each(function(record){
			var info = {
				title : record.get("version"),
				latStr : record.get("siteLatitude"),
				lngStr : record.get("siteLongitude")
			};			
			siteMapArr.push(info);
		});		
		createMapList("map_canvas_choice_planned_site", siteMapArr);
	}
	DigiCompass.Web.app.plannedSitegroup.combineTwoTreeData = function(data , siteChecked){
		 for(var i = 0 ; i<data.length ; i++){
			 for(var j = 0 ; j<siteChecked.length ; j++){
				 if(data[i].siteId == siteChecked[j].siteId ){
					 data[i] = siteChecked[j];
				 }
			 }
		 }
		 
	 }
	/**
	 * 清楚grid数据
	 */
	DigiCompass.Web.app.plannedSitegroup.cleanGridData = function(){
		var grid = Ext.getCmp("plannedSite");
		grid.getSelectionModel().deselectAll();
		grid.getStore().loadData([]);
	}
	/**
	 * 获取grid中所有数据
	 */
	DigiCompass.Web.app.plannedSitegroup.getAllSite = function(grid){
		var data = new Array(),
		store = grid.getStore(),
		count = store.getCount();
		for(var i = 0 ; i<count ; i++){
			data.push(store.getAt(i).data);
		}
		return data;
	}
	DigiCompass.Web.app.plannedSitegroup.getSpectrumRegionComboStore = function(dataArray){
		return Ext.create('Ext.data.ArrayStore',{
			fields : ['spectrumRegionId','spectrumRegionName'], 
			data : dataArray 
		}); 
	}
	DigiCompass.Web.app.plannedSitegroup.getPlanningCycleItemComboStore = function(dataArray){ 
		return Ext.create('Ext.data.ArrayStore', { 
			fields : ['planningCycleItemId','planningCycleItemName'], 
			data : dataArray 
		}); 
	}
	DigiCompass.Web.app.plannedSitegroup.getSiteTypeComboStore = function(dataArray){
		return Ext.create('Ext.data.ArrayStore', { 
			fields : ['siteTypeId','siteTypeName'], 
			data : dataArray 
		});
	}
	DigiCompass.Web.app.plannedSitegroup.spectrumRegionComboData = [];
	DigiCompass.Web.app.plannedSitegroup.assembleSpectrumRegionComboData = function(message){ 
		var data = Ext.decode(message.BUSINESS_DATA.list); 
		DigiCompass.Web.app.plannedSitegroup.spectrumRegionComboData = data;
		var region = Ext.getCmp("spectrumRegionCombo");
		if(region){
			var store = DigiCompass.Web.app.plannedSitegroup.getSpectrumRegionComboStore(data);
			region.bindStore(store); 
		}
		//Ext.getCmp("spectrumRegionCombo").bindStore(store); 
	}
	DigiCompass.Web.app.plannedSitegroup.assemblePlanningCycleItemData = function(message){ 
		var data = Ext.decode(message.BUSINESS_DATA.list); 
		var store = DigiCompass.Web.app.plannedSitegroup.getPlanningCycleItemComboStore(data);
		Ext.getCmp("planningCycleItemCombobox").bindStore(store); 
	}
	DigiCompass.Web.app.plannedSitegroup.assembleSiteTypeComboStore = function(message){
		var data = Ext.decode(message.BUSINESS_DATA.siteTypeList);
		var store = DigiCompass.Web.app.plannedSitegroup.getSiteTypeComboStore(data);
		Ext.getCmp("siteTypeCombo").bindStore(store); 
	}
	DigiCompass.Web.app.plannedSitegroup.setPlannedTreeCheckedDataByCombox = function(dataIndexArr, dataArr, id){
		var grid = Ext.getCmp(id);
		if(grid.getStore().getCount()==0){
			return;
		}
		var checked =grid.getSelectionModel().getSelection();
		if(null == checked || checked.length == 0){
			alertError('No grid item selected!');
		}
		var store = grid.getStore();
		var date = new Date();
		store.suspendEvents();  
		for(var i = 0 ; i<checked.length ; i++){
			checked[i].set(dataIndexArr[0],dataArr[0]);
			checked[i].set(dataIndexArr[1],dataArr[1]);	
			checked[i].commit();
		}
		store.resumeEvents();  
		grid.getView().refresh();
		store.fireEvent("datachanged",store); 
	}
	DigiCompass.Web.app.plannedSitegroup.getList = function(data, config) {
		cometdfn.publish({ 
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
			COMMAND : 'COMMAND_QUERY_DRAG_GRID' 
		}); 
		DigiCompass.Web.app.plannedSitegroup.checkRow = [];

		var fields = [ 'id', 'name', 'description', 'reference','planningCycleName', 'planningCycleId' ];
		var columns = [{  xtype: 'treecolumn', header : 'Version', dataIndex : 'name', flex:1
						}, { header : 'Reference', dataIndex : 'reference', flex:1 }];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		
		if (Ext.getCmp('plannedSiteGroupListView')) {
			Ext.getCmp('plannedSiteGroupListView').reconfigData(datas);
		} 
		else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
					columns:columns,
					fields:fields,
					width:"fit",
					height:735,
					data:[],
					listeners : {
						itemclick : DigiCompass.Web.app.plannedSitegroup.clickFunction
					}
				});
				objectExplorer.on('checkchange', function(node, checked) {      
					objectExplorer.checkchild(node,checked);  
					objectExplorer.checkparent(node);  
			    });  
				var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
					width:"fit",
					height:730,
					data:[],
					collapsible: true,
					split:true,
					region:'center',
					hidden:true
				});
				var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
					id : 'plannedSiteGroupListView',
					module:'MOD_PLANNED_SITE_GROUP',
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
				function getTbar(){
					return Ext.create('Ext.toolbar.Toolbar',{
						width:200,
						items:[{
							xtype : 'button',
							text : 'New',
							iconCls : 'icon-add',
							handler : function() {
								var panel = DigiCompass.Web.app.plannedSitegroup.rightPanel;
								if(panel){
									Ext.getCmp('obj-details').add(panel);
									DigiCompass.Web.app.plannedSitegroup.rightPanel = null;
								}
								UiFunction.setTitle('plannedSiteGroupDetail', 'Planned Site Group');
								Ext.getCmp('plannedSiteGroupDetail').back.setValues({versionId : ''});
								// TODO 新增SiteGroup
								//Ext.getCmp("regionAndSiteType").show();
								DigiCompass.Web.app.plannedSitegroup.cleanGridData();
								DigiCompass.Web.app.plannedSitegroup.resetSiteGroupDetail();
								DigiCompass.Web.app.plannedSitegroup.planedSiteGroupId = null;
								//Ext.getCmp("plannedSiteDelete").setVisible(true);
								//Ext.getCmp("planningCycle").setVisible(true);
								//Ext.getCmp("selectSiteButton").setVisible(true);
								//Ext.getCmp("siteGroupPlannedPlanningCycleName").setVisible(false);
								Ext.getCmp("regionAndSiteType").setVisible(true);
								Ext.getCmp("plannedSiteDelete").setDisabled(false);
								Ext.getCmp("selectSiteButton").setDisabled(false);
								Ext.getCmp("planningCycle").setDisabled(false);
							}
						},{
							xtype : 'button',
							text : 'Delete',
							iconCls : 'icon-delete',
							handler : function() {
								var siteGroupIds = new Array();
								var selected = objectExplorer.getChecked();
								for(var i = 0 ; i <selected.length ; i++){
									siteGroupIds.push(selected[i].id);
								}
								if (siteGroupIds.length == 0) {
									alertWarring('Please select a record!');
								} 
								else {
									DigiCompass.Web.app.plannedSitegroup.delSiteGroup(siteGroupIds);
								}
							}
						},{
							text : 'Import',
							handler : function(){
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
				            		                   var form = this.up('form').getForm();
				            		                   if(form.isValid()){
				            		                       form.submit({
				            		                           url: 'upload',
				            		                           params: {		            		                        	   
				            		                        	   MODULE_TYPE : "MOD_PLANNED_SITE_GROUP",
				            		                        	   COMMAND : "IMPORT_PLANNED_SITE_GROUP",
				            		                           },
				            		                           waitMsg: 'Uploading your file...',
				            		                           success: function(fp, o) {
				            		                        	   cometdfn.publish({MODULE_TYPE : "MOD_PLANNED_SITE_GROUP",COMMAND : 'COMMAND_QUERY_LIST',queryParam:null});
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
						},{
							text : 'Export',
							handler : function(){
								var siteGroupIds = new Array();
								var selected = objectExplorer.getChecked();
								for(var i = 0 ; i <selected.length ; i++){
									siteGroupIds.push(selected[i].id);
								}					
								if(siteGroupIds.length == 0){
									Ext.Msg.alert('Warning','Please select a record!');
								}else{									
				    				var data = {
				    					siteGroupIds : siteGroupIds.join(","),
				    					MODULE_TYPE : "MOD_PLANNED_SITE_GROUP",
				    					COMMAND : "EXPORT_PLANNED_SITE_GROUP",
										title : "Planned Site Group"						
					            	};
					            	var str = context.param(data);
					            	window.location.href = "download?"+str;
			
								}
							}
						}]
					});
				}
				objectExplorer.addDocked(getTbar());
				cataloguePanel.add(catalogue);
				catalogue.outerPanel = cataloguePanel;
				cataloguePanel.add(mainPanel);
				
			/*var feature = Ext.create('Ext.grid.feature.MultiGroupingSummary',{
				baseWidth:50,
		        groupHeaderTpl: '{disName}'
		      });
			/*var grid = Ext.create('Ext.grid.Panel',{
								id : 'plannedSiteGroupListView',
								title : 'PlannedSiteGroup',
								store : myStore,
								features: [feature],
								height : 700,
								columns : columns,
								tbar : [{
									xtype : 'button',
									text : 'clear grouping',
									handler : function(){
										feature.cleanGrouping();
									}
								},{
									xtype : 'button',
									text : 'New',
									iconCls : 'icon-add',
									handler : function() {
										// TODO 新增SiteGroup
										Ext.getCmp("regionAndSiteType").show();
										DigiCompass.Web.app.plannedSitegroup.cleanGridData();
										DigiCompass.Web.app.plannedSitegroup.resetSiteGroupDetail();
										DigiCompass.Web.app.plannedSitegroup.planedSiteGroupId = null;
										Ext.getCmp("plannedSiteDelete").setVisible(true);
										Ext.getCmp("planningCycle").setVisible(true);
										Ext.getCmp("selectSiteButton").setVisible(true);
										Ext.getCmp("siteGroupPlannedPlanningCycleName").setVisible(false);
									}
								},{
									xtype : 'button',
									text : 'Delete',
									iconCls : 'icon-delete',
									handler : function() {
										var siteGroupIds = DigiCompass.Web.app.plannedSitegroup.checkRow;
										if (siteGroupIds.length == 0) {
											alertWarring('Please select a record!');
										} 
										else {
											DigiCompass.Web.app.plannedSitegroup.delSiteGroup(siteGroupIds);
										}
									}
								}],
								listeners : {
									itemclick : function(grid, record, rowEl) {
										Ext.getCmp('obj-details').setTitle(DigiCompass.Web.app.navigationBar.setObjectDetail('PlannedSiteGroup'));
										
										DigiCompass.Web.app.plannedSitegroup.planedSiteGroupId = record.data.id;
										// 清理Detail面板数据
										DigiCompass.Web.app.plannedSitegroup.resetSiteGroupDetail();
										// 设置选中的SiteGroup Basic Form数据
										if(record.data.reference>0){
											Ext.getCmp("regionAndSiteType").hide();
											Ext.getCmp("plannedSiteDelete").setVisible(false);
											Ext.getCmp("siteGroupPlannedPlanningCycleName").setValue(record.data.planningCycleName);
											Ext.getCmp("siteGroupPlannedPlanningCycleName").setVisible(true);
											Ext.getCmp("selectSiteButton").setVisible(false);
											Ext.getCmp("planningCycle").setVisible(false);
											
										}
										else{
											Ext.getCmp("selectSiteButton").setVisible(true);
											Ext.getCmp("regionAndSiteType").show();
											Ext.getCmp("plannedSiteDelete").setVisible(true);
											Ext.getCmp("siteGroupPlannedPlanningCycleName").setVisible(false);
											Ext.getCmp("planningCycle").setVisible(true);
										}										
										Ext.getCmp('plannedSiteGroupForm').getForm().setValues({
											plannedSiteGroupName : record.data.name,
											description : record.data.description,
											planningCycle : record.data.planningCycleId
										});
										cometdfn.publish({
											MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
											COMMAND : 'COMMAND_QUERY_TREE',
											siteGroupPlannedId : record.data.id
										});
									}
								}
							});*/
		/*	var objExpPanel = Ext.getCmp('obj-details');
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}*/
			// 展示右边面板
			DigiCompass.Web.UI.Wheel.showDetail();
			// 创建自己的Panel
			DigiCompass.Web.app.plannedSitegroup.rightPanel = DigiCompass.Web.app.plannedSitegroup.formPanel();
			// 将Panel添加在右边Panel上
			//Ext.getCmp('obj-details').add(rightPanel);
			/*var objExpPanel = Ext.getCmp('obj-exp');
			if (objExpPanel) {
				objExpPanel.add(grid);
			}*/
		}
	}
	DigiCompass.Web.app.plannedSitegroup.clickFunction = function(grid, record, rowEl){
		var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		if(isChecked){
			return;
		}
		if(Ext.isEmpty(record.data.id)){
			return;
		}
		Ext.getCmp('obj-details').removeAll();
		DigiCompass.Web.app.plannedSitegroup.rightPanel = DigiCompass.Web.app.plannedSitegroup.formPanel();
		var panel = DigiCompass.Web.app.plannedSitegroup.rightPanel;
		if(panel){
			Ext.getCmp('obj-details').add(panel);
			DigiCompass.Web.app.plannedSitegroup.rightPanel = null;
		}
		DigiCompass.Web.app.plannedSitegroup.planedSiteGroupId = record.data.id;
		// 清理Detail面板数据
		DigiCompass.Web.app.plannedSitegroup.resetSiteGroupDetail();
		
		psgId = record.data.id;
		psgName = record.data.name;
		psgDesc = record.data.description;
		pcId = record.data.planningCycleId;
		
		Ext.getCmp('plannedSiteGroupForm').getForm().setValues({
			plannedSiteGroupName : record.data.name,
			description : record.data.description,
			planningCycle : record.data.planningCycleId
		});
		UiFunction.setTitle('plannedSiteGroupDetail', 'Planned Site Group', record.data.name);
		Ext.getCmp('plannedSiteGroupDetail').back.setValues({versionId : record.data.id});
		// 设置选中的SiteGroup Basic Form数据
		if(record.data.reference>0){
			Ext.getCmp("regionAndSiteType").setVisible(false);
			Ext.getCmp("plannedSiteDelete").setDisabled(true);
			Ext.getCmp("selectSiteButton").setDisabled(true);
			Ext.getCmp("planningCycle").setDisabled(true);
			
		}									
		
		cometdfn.publish({
			MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
			COMMAND : 'COMMAND_QUERY_TREE',
			siteGroupPlannedId : record.data.id
		});
	}
	DigiCompass.Web.app.plannedSitegroup.publish = function(){
		
	}
	/**
	 * 右边panel
	 */
	DigiCompass.Web.app.plannedSitegroup.formPanel = function() {
		DigiCompass.Web.app.plannedSitegroup.publish();
		Ext.define('site', {
			extend : 'Ext.data.Model',
			fields:[{ name : 'state', type : 'string' },
					{ name : 'siteId', type : 'string' },
					{ name : 'version', type : 'string' },
					{ name : 'comment', type : 'string' },
					{ name : 'regionId', type : 'string' }, 
					{ name : 'regionName', type : 'string' }, 
					{ name : 'planningCycleItemId', type : 'string' }, 
					{ name : 'planningCycleItemName', type : 'string' }, 
					{ name : 'siteTypeId', type : 'string' }, 
					{ name : 'siteTypeName', type : 'string' },
					{ name : 'siteDes', type : 'string' }, 
					{ name : 'siteName', type : 'string' }, 
					{ name : 'siteLongitude', type : 'string' }, 
					{ name : 'siteLatitude', type : 'string' },
					{ name : 'siteStatus', type : 'string'},
					{ name : 'siteType', type : 'string'},
					{ name : 'groupResp', type : 'string'},
					{ name : 'sitePolygon', type : 'string'}]
		});
		var feature = Ext.create('Ext.grid.feature.MultiGroupingSummary',{
			baseWidth:50,
	        groupHeaderTpl: '{disName}'
	      });
		var store = Ext.create('Ext.data.ArrayStore', {
			model: 'site',
			data:[]
		});
		var cm = [{ columnType:'summary', menuDisabled: true },
		          { text : 'Version', dataIndex : 'version', flex:1 ,sortable : true, summaryType: 'count' },
		          { text : 'Comment', dataIndex : 'comment', flex:1 , sortable : true, summaryType: 'count' },
		          { text : 'Spectrum Region', dataIndex : 'regionName', summaryType: 'count', flex:1 , sortable : true,
		        	renderer : function(value , metaData , record ){
		        			if(Ext.isEmpty(value)){
		        				return '<font color = "red">NO DATA</font>';
		        			}
		        			else{
		        				return value;
		        			}
		        	}}, 
		         { text : 'Planning Cycle Item', dataIndex : 'planningCycleItemName', flex:1 , sortable : true ,  summaryType: 'count',
		        		renderer : function(value , metaData , record ){
		        			if(Ext.isEmpty(value)){
		        				return '<font color = "red">NO DATA</font>';
		        			}
		        			else{
		        				return value;
		        			}
		        		} }, 
		        { text : 'Site Type', summaryType: 'count', dataIndex : 'siteTypeName', flex:1 , sortable : true , 
		        			renderer : function(value , metaData , record ){
		        				if(Ext.isEmpty(value)){
		        					return '<font color = "red">NO DATA</font>';
		        				}
		        				else{
		        					return value;
		        				}
			        			} }, 
			    { text : 'Site Number', dataIndex : 'siteName' , flex:1 , sortable : true, summaryType: 'count' }, 
			    { text : 'Description',
			dataIndex : 'siteDes',
			flex:1,
			sortable : true,
			summaryType: 'count'
		}, {
			text : 'Longitude',
			dataIndex : 'siteLongitude',
			summaryType: 'count', 
			flex:1,
			sortable : true
		}, {
			text : 'Latitude',
			summaryType: 'count',
			dataIndex : 'siteLatitude',
			flex:1,
			sortable : true
		}, {
			text : 'Site Status',
			summaryType: 'count',
			dataIndex : 'siteStatus',
			flex:1,
			sortable : true
		}, {
			text : 'Site Type',
			summaryType: 'count',
			dataIndex : 'siteType',
			flex:1,
			sortable : true
		}, {
			text : 'Group Resp',
			summaryType: 'count',
			dataIndex : 'groupResp',
			flex:1,
			sortable : true
		}, {
			text : 'Polygon',
			summaryType: 'count',
			dataIndex : 'sitePolygon',
			flex:1,
			sortable : true
		}];
		var plannedSiteGroupSM = Ext.create('Ext.selection.CheckboxModel'); 
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
		var plannedSite = Ext.create('Ext.grid.Panel', {
			features: [feature],
			id : 'plannedSite',
			title : 'Sites',
			width : 'fit',
			height : 323,
			selModel: plannedSiteGroupSM, 
			collapsible : true,
			useArrows : true,
			rootVisible : false,
			border : false,
			store : store,
			multiSelect : true,
			columns : cm,
			tbar:[{
	        	  xtype:'button',
	        	  text:'clear Grouping',
	        	  handler:function(){
	        		  feature.cleanGrouping();
	        	  }
	          },{
				xtype:'button',
				id : 'plannedSiteDelete',
				iconCls : 'icon-delete',
				text: 'delete site',
				handler:function(){
					var rsm = plannedSite.getSelectionModel();
					if(Ext.isEmpty(rsm.getSelection())){
						alertError("No item selected");
					}
					var	view = plannedSite.getView(),
						store = plannedSite.getStore();  
	        	    for (var i = store.getCount() - 1; i >= 0; i--) {  
	        	       if (rsm.isSelected(i)) {  
	        	          store.remove(store.getAt(i));  
	        	       }  
	        	    }
	        	    view.refresh();  
				}
			},{
				xtype : 'button',
				text : 'export',
				handler : function(){
					if(psgId){
	    				var data = {
	    					siteGroupPlannedId : psgId,
	    					MODULE_TYPE : "MOD_PLANNED_SITE_GROUP",    					
							title : "Planned Site Group"						
		            	};
		            	var str = context.param(data);
		            	window.location.href = "download?"+str;
					}
				}
			},{
				xtype : 'button',
				text : 'import',
				handler : function(){
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
	            		                   var form = this.up('form').getForm();
	            		                   if(form.isValid()){
	            		                       form.submit({
	            		                           url: 'upload',
	            		                           params: {
	            		                        	   plannedSiteGroupId : psgId,
	            		                        	   description : psgDesc,
	            		                        	   name : psgName,
	            		                        	   planningCycleInputEl : pcId,
	            		                        	   MODULE_TYPE : "MOD_PLANNED_SITE_GROUP"
	            		                           },
	            		                           waitMsg: 'Uploading your file...',
	            		                           success: function(fp, o) {
	            		                        	   //msg('Success', 'Processed file on the server', false);
		            		                   			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
		            		                			DigiCompass.Web.UI.CometdPublish
		            		                					.plannedSiteGroupPublish(queryParam);
		            		                			DigiCompass.Web.app.sitegroup.removeDetail();
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
			}]
		});    
		// var bindData = function(data){
		// return data.address+', '+data.streetName+', '+data.suburb+',
		// '+data.state+', '
		// +(data.spectrumRegion ? data.spectrumRegion.name : data.region);
		// }
		/**
		 * Site提示
		 */
		// plannedSite.getView().on('render', function(view){
		// view.tip = Ext.create('Ext.tip.ToolTip', {
		// //title : 'Address:',
		// target: view.el, // The overall target element.
		// delegate: view.itemSelector, // Each grid row causes its own seperate
		// show and hide.
		// trackMouse: true, // Moving within the row should not hide the tip.
		// hideDelay : false,
		// dismissDelay : 0,
		// draggable : true,
		// maxWidth: 300,
		// minWidth: 100,
		// showDelay: 50,
		// renderTo: Ext.getBody(), // Render immediately so that tip.body can
		// be referenced prior to the first show.
		// html : 'lodding...',
		// listeners: { // Change content dynamically depending on which element
		// triggered the show.
		// beforeshow: function (tip) {
		// var record = view.getRecord(tip.triggerElement);
		// if(!record.get('leaf')){
		// return false;
		// }
		// if(record.bindData){
		// tip.update(bindData(record.bindData));
		// }else{
		// tip.update('loading...');
		// console.log('loadding...', record.get('siteId'));
		// cometdfn.request({MODULE_TYPE : 'MOD_SNAPSHOT_SITE',COMMAND :
		// 'COMMAND_QUERY_INFO',id: record.get('siteId')},
		// function(data){
		// record.bindData = Ext.JSON.decode(data.BUSINESS_DATA);
		// console.log('load success, site id = '+ record.get('siteId'),
		// record.bindData);
		// if(view.tip.triggerElement && view.getRecord(view.tip.triggerElement)
		// && record.bindData.id ===
		// view.getRecord(view.tip.triggerElement).get('siteId')){
		// view.tip.update(bindData(record.bindData));
		// }
		// });
		// }
		// return true;
		// }
		// }
		// });
		// });
		//
		
		var siteFormPanel = Ext.create('Ext.form.Panel', {
			id : 'plannedSiteGroupForm',
			title : 'Basic',
			defaultType : 'textfield',
			border : false,
			collapsible : true,
			layout : 'column',
			width : 'fit',
			height : 90,
			//buttonAlign : 'left',
			fieldDefaults : {
				labelAlign : 'right',
				msgTarget : 'side',
				columnWidth:.25
			},
			items : [{
				id 		   : 'plannedSiteGroupName',
				margin 	   : '20 0 0 0',
				allowBlank : false,
				emptyText  : "Please input planned sitegroup Version!",
				fieldLabel : 'Version',
				fieldWidth : '100%',
				msgTarget  : 'side',
				maxLength  : UiProperties.nameMaxLength,
				name 	   : 'name'
			}, {
				id 		   : 'description',
				margin 	   : '20 0 0 0',
				allowBlank : true,
				fieldLabel : 'Description',
				fieldWidth : '100%',
				maxLength  : UiProperties.descMaxLength,
				msgTarget  : 'side',
				name 	   : 'description'
			}, new DigiCompass.web.UI.ComboBox({
				margin : '20 0 0 0',
				id : 'planningCycle',
				fieldLabel : 'Planning Cycle',
				tableName : 'TB_STG_PLANNING_CYCLE',
				allowBlank : false,
				autoLoadByCometd : true,
				listeners : {
					change : function() {
						if (!Ext.isEmpty(this.getValue())) {
							var itemCombo = Ext.getCmp('planningCycleItemCombobox');
							if(itemCombo){
								itemCombo.suspendEvents();
								itemCombo.reset();
								itemCombo.resumeEvents();
							}
							cometdfn.publish({
								MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
								COMMAND : 'COMMAND_QUERY_COMBOX_LIST',
								planningCycleId : this.getValue()
							});
						}
					}
				}
			}),{
				xtype: 'displayfield',
				margin : '20 0 0 0',
		        fieldLabel: 'Planning Cycle',
		        id : 'siteGroupPlannedPlanningCycleName',
		        hidden:true

			}, {
				xtype : 'button',
				margin : '20 0 0 80',
				id : 'selectSiteButton',
				text : 'Select site',
				handler : function(){
					var columns = [{ xtype: 'treecolumn', header : 'Version', flex:1 , dataIndex : 'version', sortable : true },
								   { header : 'Comment', flex:1 , dataIndex : 'comment', sortable : true },
								   { header : 'State', flex:1 , dataIndex : 'state', sortable : true },
						           { header : 'Site Number', flex:1 , dataIndex : 'siteName', sortable : true }, 
						           { header : 'Description', flex:1 , dataIndex : 'siteDes', sortable : true }, 
						           { header : 'Longitude', flex:1 , dataIndex : 'siteLongitude', sortable : true }, 
						           { header : 'Latitude', flex:1 , dataIndex : 'siteLatitude', sortable : true },
						           { header : 'Site Status', flex:1 , dataIndex : 'siteStatus', sortable : true }, 
						           { header : 'Site Type', flex:1 , dataIndex : 'siteType', sortable : true }, 
						           { header : 'Group Resp', flex:1 , dataIndex : 'groupResp', sortable : true }, 
						           { header : 'Polygon', flex:1 , dataIndex : 'sitePolygon', sortable : true }];
		            var fields = [{ name : 'version' , type : 'string' },
		    			          { name : 'comment' , type : 'string' },
		    			          { name : 'siteId', type : 'string' }, 
		    			          { name : 'state', type : 'string' },
		    			          { name : 'state', type : 'string' }, 
		    			          { name : 'siteDes', type : 'string' }, 
		    			          { name : 'siteName', type : 'string' }, 
		    			          { name : 'siteLongitude', type : 'string' }, 
		    			          { name : 'siteLatitude', type : 'string' },
		    			          { name : 'siteStatus', type : 'string'},
								  { name : 'siteType', type : 'string'},
								  { name : 'groupResp', type : 'string'},
								  { name : 'sitePolygon', type : 'string'}];
		            var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorerExt',{
					 	id:'plannedSiteGroupSiteObjectPanel',
					 	module:'MOD_PLANNED_SITE_GROUP',
						command:'COMMAND_OBJECT_TREE',
						otherParam:{},
						columns:columns,
						fields:fields,
						region:'center',
						width:"100%",
						data:[]
					});
				 	objectExplorer.on('checkchange', function(node, checked) {      
						objectExplorer.checkchild(node,checked);  
						objectExplorer.checkparent(node);  
			    	});  
				 
					var catalogue = Ext.create('DigiCompass.Web.ux.catalogueExt',{
						id:'plannedSiteGroupSiteCataloguePanel',
						module:'MOD_PLANNED_SITE_GROUP',
						command:'COMMAND_CATALOGUE_TREE',
						otherParam:{},
						width:"25%",
						data:[],
						collapsible: true,
						region:'west',
						hidden:true
					});
				    
					var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanelExt',{
						width:900,
						height:530,
						layout:"border",
						objectExplorer:objectExplorer,
						catalogue:catalogue,
						hidden:true
					});
					cometdfn.publish({
						MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
						COMMAND : 'COMMAND_OBJECT_TREE',
						groupFields:[],
						checked:[],
						treeNode : 'version'
					});
		           /*
		            var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
						columns:columns,
						fields:fields,
						width:"100%",
						region:'center',
						data:[]
					});
					objectExplorer.on('checkchange', function(node, checked) {      
						objectExplorer.checkchild(node,checked);  
						objectExplorer.checkparent(node); 
			    	});  
					var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
						width:"25%",
						data:[],
						collapsible: true,
						split:true,
						region:'west',
						hidden:true
					});
				    
					var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
						id:'plannedSiteSelectedMain',
						module:'MOD_PLANNED_SITE_GROUP',
						command:'COMMAND_QUERY_ALL_TREE',
						otherParam:{},
						layout:'border',
						width:900,
						height:530,
						objectExplorer:objectExplorer,
						catalogue:catalogue,
						hidden:true
					});
					cometdfn.publish({
							MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
							COMMAND : 'COMMAND_QUERY_ALL_TREE'
					});*/
					var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
						title:'Site Select',
						width:912,
						height:559,
						modal:true,
						layout:'border',
						tbar:[{
							xtype:'button',
							text:"Finish",
							handler:function(){
								var selectData = objectExplorer.getChecked();
								if(Ext.isEmpty(selectData)){
									alertError("Please selected a record at first!");
									return;
								}
								DigiCompass.Web.app.plannedSitegroup.siteGridStoreLoadData(selectData, null);
								win.close();
							}
						}]
					});
					win.add(mainPanel);
					win.add(catalogue);
					win.add(objectExplorer);
					win.show();
				}
			}]
		});
		var regionAndSiteTypeComboPanel = Ext.create('Ext.form.Panel', {
			id : 'regionAndSiteType',
			title : 'Region and SiteType Choose',
			defaultType : 'combo',
			collapsible : true,
			border : false,
			layout : 'column',
			width : 'fit',
			height : 90,
			buttonAlign : 'left',
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 120,
				msgTarget : 'side'
			},
			items : [{
				margin       : '20 0 0 0',
				editable     : false,
				id           : 'planningCycleItemCombobox',
				fieldLabel   : 'Planning Cycle Item',
				valueField   : 'planningCycleItemId',
				displayField : 'planningCycleItemName',
				store	     : DigiCompass.Web.app.plannedSitegroup.getPlanningCycleItemComboStore([]),
				listeners:{
					change:function(){
						var dataIndex = ['planningCycleItemId','planningCycleItemName'];
						var dataValue = [this.getValue(),this.getRawValue()];
						DigiCompass.Web.app.plannedSitegroup.setPlannedTreeCheckedDataByCombox(dataIndex,dataValue,"plannedSite");
					}
				}
			}, {
				margin       : '20 0 0 0',
				fieldLabel   : 'Region',
				id 		     : 'spectrumRegionCombo',
				editable     : false,
				valueField   : 'spectrumRegionId',
				displayField : 'spectrumRegionName',
				store		 : DigiCompass.Web.app.plannedSitegroup.getSpectrumRegionComboStore(DigiCompass.Web.app.plannedSitegroup.spectrumRegionComboData),
				listeners:{
					change:function(){
						if (!Ext.isEmpty(this.getValue())) {
							cometdfn.publish({
								MODULE_TYPE : 'MOD_PLANNED_SITE_GROUP',
								COMMAND : 'COMMAND_QUERY_SITE_TYPE_COMBOX_LIST',
								regionId : this.getValue()
							});
							var dataIndex = ['regionId','regionName'];
							var dataValue = [this.getValue(),this.getRawValue()];
							DigiCompass.Web.app.plannedSitegroup.setPlannedTreeCheckedDataByCombox(dataIndex,dataValue,"plannedSite");
						}
					}
				}
			}, {
				margin       : '20 0 0 0',
				fieldLabel   : 'SiteType',
				id           : 'siteTypeCombo',
				editable     : false,
				valueField   : 'siteTypeId',
				displayField : 'siteTypeName',
				store        : DigiCompass.Web.app.plannedSitegroup.getSiteTypeComboStore([]),
				listeners:{
					change:function(){
						var dataIndex = ['siteTypeId','siteTypeName'];
						var dataValue = [this.getValue(),this.getRawValue()];
						DigiCompass.Web.app.plannedSitegroup.setPlannedTreeCheckedDataByCombox(dataIndex,dataValue,"plannedSite");
					}
				}
			}]
		});
		
		var mapPanel = Ext.create('Ext.panel.Panel', {				
			height : 400,			
			width:'100%',
			title: 'Map',
			border : false,
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
		            	    	listeners : {
		            	    		afterlayout : function(){
		            	    			var el = this.body.dom;
		        		        		var plannedSiteDataStore = Ext.getCmp("plannedSite").getStore();
		        		        		var siteMapArr = new Array();
		        		        		plannedSiteDataStore.each(function(record){
		        		        			var info = {
		        		        				title : record.get("version"),
		        		        				latStr : record.get("siteLatitude"),
		        		        				lngStr : record.get("siteLongitude")
		        		        			};			
		        		        			siteMapArr.push(info);
		        		        		});		
		        		        		createMapList(el, siteMapArr);
		            	    		}
		            	    	}			        			    
			        		})
		            	}).show();
		            }
		        }]
		    }],
		    html: "<div id='map_canvas_choice_planned_site' style='width:100%; height:100%'></div>"		    
		});

		var rightPanel = Ext.create('Ext.panel.Panel', {
			margin : '0 1 0 0',
//			width : 'fit',
//			height : 'fit',			
			autoScroll:true,
			items : [ siteFormPanel,regionAndSiteTypeComboPanel, plannedSite, mapPanel]
		});
		var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
			id : 'plannedSiteGroupDetail',
//			height : '722',
			front : rightPanel,
			back : new DigiCompass.Web.app.VersionForm({edit : false})
		});
		reversalPanel.addToolBar('bar', new Ext.toolbar.Toolbar({
			items : [{
				columnWidth : .3,
//				margin : '10 0 0 10',
				xtype : 'button',
				text : 'save',
				iconCls:'icon-save',
				handler : function() {
					if (siteFormPanel.getForm().isValid()) {
						var formData = DigiCompass.Web.app.sitegroup.getFormData(siteFormPanel.getForm());
						var selectSites = DigiCompass.Web.app.plannedSitegroup.getAllSite(plannedSite);
						if (selectSites == false) {
							alertError('Has error data in site grid,Check spectrum region and planningCycleItem!');
							return;
						}
						if(DigiCompass.Web.app.plannedSitegroup.planedSiteGroupId){
							formData.plannedSiteGroupId = DigiCompass.Web.app.plannedSitegroup.planedSiteGroupId ;
						}
						formData.plannedSites = selectSites;
						formData.MODULE_TYPE = 'MOD_PLANNED_SITE_GROUP';
						formData.COMMAND = 'COMMAND_SAVE';
						cometdfn.publish(formData);
					}
				}
			}]
		}));
//		var centerPanel = Ext.create('Ext.panel.Panel', {
//			margin:'0 10 0 0',
//			layout : 'fit',
////			height : 750,
////			width : 'fit',			
//			items : [ reversalPanel ]
//		});
		return reversalPanel;
	}
	DigiCompass.Web.app.plannedSitegroup.checkRow = [];
	DigiCompass.Web.app.plannedSitegroup.chek_box = function(checkBox , event , id){
		DigiCompass.Web.app.plannedSitegroup.cleanData();
		if(checkBox.checked){
			DigiCompass.Web.app.plannedSitegroup.checkRow.push(id); 
		}
		else{ 
			var checkeds = DigiCompass.Web.app.plannedSitegroup.checkRow;
			for(var i = 0 ; i <checkeds.length ; i++){ 
				if(checkeds[i] == id){
					checkeds.splice(i,1); 
				} 
			} 
		} 
		event = event || window.event;
		event.stopPropagation(); 
	}
	 DigiCompass.Web.app.plannedSitegroup.resetSiteGroupDetail = function(){
		 Ext.getCmp('plannedSiteGroupForm').getForm().reset();
	 } 
	
	DigiCompass.Web.app.plannedSitegroup.cleanData = function(){
		DigiCompass.Web.app.plannedSitegroup.resetSiteGroupDetail();
		DigiCompass.Web.app.plannedSitegroup.cleanGridData();
		Ext.getCmp('regionAndSiteType').getForm().reset();
	}
	DigiCompass.Web.app.plannedSitegroup.saveSuccess = function(data, Conf,
			fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			Notification.showNotification('Save planned sitegroup Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish
					.plannedSiteGroupPublish(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
			//DigiCompass.Web.app.plannedSitegroup.cleanData();
		}else if(data.customException){
			alertError(data.customException);
		}
	}
	DigiCompass.Web.app.plannedSitegroup.deleteSuccess = function(data, Conf,
			fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			Notification.showNotification('Delete planned sitegroup successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.plannedSiteGroupPublish(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
			//DigiCompass.Web.app.plannedSitegroup.cleanData();
		}else if(data.customException){
			alertError(data.customException);
		}
	}
	/**
	 * 删除sitegroup
	 */
	DigiCompass.Web.app.plannedSitegroup.delSiteGroup = function(siteGroupIds) {
		var message = {};
		message.siteGroupIds = siteGroupIds;
		message.MODULE_TYPE = 'MOD_PLANNED_SITE_GROUP';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.publish(message);
	}
	
	function createMapList(renderId, mapInfoList){
		if(mapInfoList && mapInfoList.length != 0){
			var latlng = new google.maps.LatLng(mapInfoList[0].latStr, mapInfoList[0].lngStr);
			var myOptions = {
				zoom : 4,
				minZoom : 2,
				center : latlng,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				scaleControl: true,
				panControl : true,
				overviewMapControl : true
			};
			var rdObj;
			if(Ext.isString(renderId)){
				rdObj = document.getElementById(renderId);
			} else {
				rdObj = renderId;
			}
			var map = new google.maps.Map(rdObj,
					myOptions);
			for(var i in mapInfoList){
				var info = mapInfoList[i];
				var sitePosition = new google.maps.LatLng(info.latStr, info.lngStr);
				var pinIcon = new google.maps.MarkerImage(
					    "styles/cmp/images/new/planned_site_marker.jpg",
					    null, /* size is determined at runtime */
					    null, /* origin is 0,0 */
					    null, /* anchor is bottom center of the scaled image */
					    new google.maps.Size(21, 43)
					);  
				var marker = new google.maps.Marker({
				    position: sitePosition,
				    icon : pinIcon,
				    title:info.title
				});
				marker.setMap(map);
				if(info.contentString){
					var infowindow = new google.maps.InfoWindow({
					    content: info.contentString
					});
					google.maps.event.addListener(marker, 'click', function() {
					  infowindow.open(map,marker);
					});		
				}
			}
			
			var siteControlDiv = document.createElement('DIV');
			var siteControl = new SiteControl(siteControlDiv, map);
			siteControlDiv.index = 1;		
			map.controls[google.maps.ControlPosition.RIGHT_TOP]
					.push(siteControlDiv);	
		}
	}
})();