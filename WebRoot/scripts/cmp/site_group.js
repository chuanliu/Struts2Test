(function() {
	
	var sgName;
	var sgDescription;
	var siteSnapshotId;
	var mapSiteArray;
	
	Ext.namespace('DigiCompass.Web.app.sitegroup');
	/**
	 * 获取form数据
	 * 返回json类型
	 */
	DigiCompass.Web.app.sitegroup.getFormData = function(form) {
		var datas = form.getValues();
		return datas;
	}
	DigiCompass.Web.app.sitegroup.removeDetail = function(){
		Ext.getCmp('obj-details').removeAll();
	}
	/**
	 * 获取store数据 
	 * 返回store 每行 recorder数组
	 */
	DigiCompass.Web.app.sitegroup.getStoreData = function(grid) {
		var datas = [],
		store = grid.getStore(),
		count = store.getCount();
		for (var i = 0; i < count; i++) {
			datas.push(store.getAt(i).data);
		}
		return datas;
	}
	/**
	 * 删除sitegroup
	 */
	DigiCompass.Web.app.sitegroup.delSiteGroup = function(siteGroupIds){
		var message = {};
		message.siteGroupIds = siteGroupIds;
		message.MODULE_TYPE = 'MOD_SITE_GROUP';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.publish(message);
	}
	/**
	 * 清除grid数据
	 */
	DigiCompass.Web.app.sitegroup.cleanGridData = function(grid){
		grid.target.getSelectionModel().deselectAll();
		grid.target.getStore().loadData([]);
	}
	/**
	 * 清空数据
	 */
	DigiCompass.Web.app.sitegroup.cleanData = function(){
		DigiCompass.Web.app.sitegroup.cleanGridData(Ext.getCmp('siteTree'));
		if(Ext.getCmp('siteGroupForm')){
			Ext.getCmp('siteGroupForm').getForm().reset();
		}
		if(Ext.getCmp('regionCombo')){
			Ext.getCmp('regionCombo').setValue('');
		}
	}
	/**
	 * 回调拼装数据
	 */
	DigiCompass.Web.app.sitegroup.siteGridStoreLoadData = function(data){
		var comboStore = Ext.getCmp('regionCombo').getStore();
		var region = {};
		for(var i = 0 ; i<comboStore.getCount(); i++){
			region[comboStore.getAt(i).data.spectrumRegionName] = comboStore.getAt(i).data.spectrumRegionId;
		}
		for(var i in data){
			 var  regionId = region[data[i].specRegName];
			 if(Ext.isEmpty(data[i].specReg) && Ext.isEmpty(regionId)){
				 data[i].specRegName = null;
			 }
			 else if(Ext.isEmpty(data[i].specReg) && !Ext.isEmpty(regionId)){
				 data[i].specReg = regionId;
			 }
		}
		Ext.getCmp("siteTree").getStore().loadData(data);
		var plannedSiteDataStore = Ext.getCmp("siteTree").getStore();
		var siteMapArr = new Array();
		plannedSiteDataStore.each(function(record){
			var info = {
				title : record.get("siteNum"),
				latStr : record.get("latitude"),
				lngStr : record.get("longitude")
			};			
			siteMapArr.push(info);
		});		
		createMapList("map_canvas_choice_site", siteMapArr);
	}
	/**
	 * 清空form数据
	 */
	DigiCompass.Web.app.sitegroup.resetSiteGroupDetail = function(){
		Ext.getCmp('siteGroupForm').getForm().reset();
	}
	DigiCompass.Web.app.sitegroup.siteGroupId = null;
	DigiCompass.Web.app.sitegroup.setTreeCheckedDataByCombox = function(dataIndexArr,dataArr){
		var grid = Ext.getCmp("siteTree");
		if(grid.getStore().getCount()==0){
			return;
		}
		var checked =grid.getSelectionModel().getSelection();
		if((null == checked || checked.length == 0) && !Ext.isEmpty(dataArr[0]) && !Ext.isEmpty(dataArr[1])){
			alertError('No grid item selected!');
			return;
		}
		var store = grid.getStore();
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
	DigiCompass.Web.app.sitegroup.checkValInStore = function (rawValue,dataIndex,store){
    	var bool = true;
    	for(var i = 0 ;i<store.getCount(); i++){
			if(store.getAt(i).data[dataIndex]==rawValue){
				return false;
			}
    	}
    	return bool;
    }
	 DigiCompass.Web.app.sitegroup.getChecked = function(tree){
		 var checkedNodes = tree.getChecked();
		 var _checkedNodes = new Array();
		 for(var i = 0 ; i<checkedNodes.length ; i++){
			 if(checkedNodes[i].childNodes.length==0){
				 if(Ext.isEmpty(checkedNodes[i].data.specReg)){
					 alertError('Has error data in site grid,Check spectrum region and planningCycleItem!');
					 return false;
				 }
				 _checkedNodes.push(checkedNodes[i].data);
			 }
		 }
		 return _checkedNodes;
	 }
	 DigiCompass.Web.app.sitegroup.getSpectrumRegionComboStore =function(data){ 
		 return Ext.create('Ext.data.ArrayStore', {
			fields : ['spectrumRegionId','spectrumRegionName'],
			data : data
		});
	 }
	 
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        file: function(val, field) {
            return /\.(xlsx|xls|csv)$/i.test(val);
        },
        // vtype Text property: The error text to display when the validation function returns false
        fileText: 'Not a valid file.  Must be "xlsx|xls|csv".'
    });
	 
	 /**
	  * 右边panel
	  */
	DigiCompass.Web.app.sitegroup.rightPanel =function(){
	    //grid 中的 combox
		

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
	   
		/*var siteTree = Ext.create('DigiCompass.Web.app.grid.FlexView',{
			id:'siteTree',
	        title: 'Sites',
	        width: 'fit',
	        height: 320,
	        autoScroll:true,
	        collapsible: true,
	        multiSelect: true,
	        columns: [],
	        features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping',{
	    		baseWidth:50,
	            groupHeaderTpl: '{disName}'
	          })],
	        selModel: Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'), 
	        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
	            buffered: true,
	            proxy: {
	                type: 'cometd.flexview',
	                moduleType : 'MOD_SITE_GROUP',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_QUERY_TREE' 
	               		}
	                },
		            extraParams : {
		            	first : true
		            },
		            afterRequest : function(response, result){
		            	var record;
		            	if(result && result.success){
							var siteMapArr = [];
							if(response.COMMAND === 'COMMAND_GET_SITES'){
								siteTree.param = {
				            		sitewindow_selections:response.selections,
				            		sitewindow_groups:response.groups,
				            		sitewindow_checkAll:response.checkAll,
				            		sitewindow_selectGroups:response.selectGroups
				            	}
							}
		            	}
		            	
		            }
	            }
	        }),
	        tbar:[{
				xtype : 'button',
				text : 'clear grouping',
				handler : function(){
					siteTree.target.features[0].cleanGrouping();
				}
			},{
	        	xtype:'button',
	        	id : 'siteDelete',
	        	text:'delete site',
	        	iconCls:'icon-delete',
	        	hidden : true,
	        	handler : function(){
	        		var rsm = siteTree.target.getSelectionModel();
	        		if(Ext.isEmpty(rsm.getSelection())){
						alertError("No item selected");
					}
	        		var	view = siteTree.target.getView(),
	        			store = siteTree.target.getStore(); 
	        		store.suspendEvents(); 
	        	    for (var i = store.getCount() - 1; i >= 0; i--) {  
	        	       if (rsm.isSelected(i)) {  
	        	          store.remove(store.getAt(i));  
	        	       }  
	        	    }  
	        	    store.resumeEvents();
	        	    view.refresh();  
	        	}
	        },{
				xtype : 'button',
				text : 'export',
				handler : function(){
					var siteGroupId = DigiCompass.Web.app.sitegroup.siteGroupId;
					if(siteGroupId){
	    				var data = {
	    					siteGroupId : siteGroupId,
	    					MODULE_TYPE : "MOD_SITE_GROUP",    					
							title : "Site Group"						
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
	            		                	   var siteGroupId = DigiCompass.Web.app.sitegroup.siteGroupId;
	            		                       form.submit({
	            		                           url: 'upload',
	            		                           params: {
	            		                        	   siteGroupId : siteGroupId,
	            		                        	   description : sgDescription,
	            		                        	   name : sgName,
	            		                        	   snapshotSiteInputEl : siteSnapshotId,
	            		                        	   MODULE_TYPE : "MOD_SITE_GROUP"
	            		                           },
	            		                           waitMsg: 'Uploading your file...',
	            		                           success: function(fp, o) {
		            		                   			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
		            		                			DigiCompass.Web.UI.CometdPublish.siteGroupPublish(queryParam);
		            		                			DigiCompass.Web.app.sitegroup.removeDetail();
		            		                			win.close();
	            		                        	   //msg('Success', 'Processed file on the server', false);	            		                        	   	            		                        	   
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
		
		});*/
	    var siteTree = new DigiCompass.Web.app.grid.MutiGroupGrid({			
	    	id:'siteTree',
	        title: 'Sites',
	        width: 'fit',
	        height: 320,
	        autoScroll:true,
	        collapsible: true,
	        multiSelect: true,
	        columns: [],
	        store: {
	            buffered: true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_SITE_GROUP',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_QUERY_TREE' 
	               		}
	                },
		            extraParams : {
		            	first : true
		            },
		            afterRequest : function(response, result){
		            	var record;
		            	if(result && result.success){
							var siteMapArr = [];
							if(response.COMMAND === 'COMMAND_GET_SITES'){
								siteTree.param = {
				            		sitewindow_selections:response.selection,
				            		snapshotSite : response.snapshotSite
				            	}
							}
		            	}
		            	
		            }
	            }
	        },
	        tbar:[{
				xtype : 'button',
				text : 'clear grouping',
				handler : function(){
					siteTree.target.features[0].cleanGrouping();
				}
			},{
	        	xtype:'button',
	        	id : 'siteDelete',
	        	text:'delete site',
	        	iconCls:'icon-delete',
	        	hidden : true,
	        	handler : function(){
	        		var rsm = siteTree.target.getSelectionModel();
	        		if(Ext.isEmpty(rsm.getSelection())){
						alertError("No item selected");
					}
	        		var	view = siteTree.target.getView(),
	        			store = siteTree.target.getStore(); 
	        		store.suspendEvents(); 
	        	    for (var i = store.getCount() - 1; i >= 0; i--) {  
	        	       if (rsm.isSelected(i)) {  
	        	          store.remove(store.getAt(i));  
	        	       }  
	        	    }  
	        	    store.resumeEvents();
	        	    view.refresh();  
	        	}
	        },{
				xtype : 'button',
				text : 'export',
				handler : function(){
					var siteGroupId = DigiCompass.Web.app.sitegroup.siteGroupId;
					if(siteGroupId){
	    				var data = {
	    					siteGroupId : siteGroupId,
	    					MODULE_TYPE : "MOD_SITE_GROUP",    					
							title : "Site Group"						
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
	            		                	   var siteGroupId = DigiCompass.Web.app.sitegroup.siteGroupId;
	            		                       form.submit({
	            		                           url: 'upload',
	            		                           params: {
	            		                        	   siteGroupId : siteGroupId,
	            		                        	   description : sgDescription,
	            		                        	   name : sgName,
	            		                        	   snapshotSiteInputEl : siteSnapshotId,
	            		                        	   MODULE_TYPE : "MOD_SITE_GROUP"
	            		                           },
	            		                           waitMsg: 'Uploading your file...',
	            		                           success: function(fp, o) {
		            		                   			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
		            		                			DigiCompass.Web.UI.CometdPublish.siteGroupPublish(queryParam);
		            		                			DigiCompass.Web.app.sitegroup.removeDetail();
		            		                			win.close();
	            		                        	   //msg('Success', 'Processed file on the server', false);	            		                        	   	            		                        	   
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
	    
		
		//store.guaranteeRange(0,29);
//	    var bindData = function(data){
//	    	return data.address+', '+data.streetName+', '+data.suburb+', '+data.state+', '
//	    		+(data.spectrumRegion ? data.spectrumRegion.name : data.region);
//	    }
	    
//	    siteTree.getView().on('render', function(view){
//			view.tip = Ext.create('Ext.tip.ToolTip', {  
//				//title : 'Address:',
//	            target: view.el,          // The overall target element.  
//	            delegate: view.itemSelector, // Each grid row causes its own seperate show and hide.  
//	            trackMouse: true,         // Moving within the row should not hide the tip.  
//	            hideDelay : false,
//	            dismissDelay : 0,
//	            draggable : true,
//	            maxWidth: 300,
//				minWidth: 100,
//				showDelay: 50,
//	            renderTo: Ext.getBody(),  // Render immediately so that tip.body can be referenced prior to the first show.  
//	            html : 'lodding...',
	            
	            
		/*此处为site提示，暂时注释掉，功能完善后恢复
	            
	            listeners: {              // Change content dynamically depending on which element triggered the show.  
	                beforeshow: function (tip) {
						var record = view.getRecord(tip.triggerElement);
						if(!record.get('leaf')){
							return false;
						}
						if(record.bindData){
							tip.update(bindData(record.bindData));
						}else{
							tip.update('loading...');
//							console.log('loadding...', record.get('siteId'));
		             		cometdfn.request({MODULE_TYPE : 'MOD_SNAPSHOT_SITE',COMMAND : 'COMMAND_QUERY_INFO',id: record.get('siteId')}, 
			         			function(data){
			                 		record.bindData = Ext.JSON.decode(data.BUSINESS_DATA);
//			                 		console.log('load success, site id = '+ record.get('siteId'), record.bindData);
			                 		if(view.tip.triggerElement && view.getRecord(view.tip.triggerElement)
			                 			&& record.bindData.id === view.getRecord(view.tip.triggerElement).get('siteId')){
			             				view.tip.update(bindData(record.bindData));
			                 		}
		                 	});
						}
						return true;
					} 
				} 
		    }); 
		});*/ 
		var comboBoxPanel = Ext.create('Ext.form.Panel',{
			id : 'comboBoxPanel',
			title : 'Choose Region',
			defaultType : 'combo',
			collapsible : true,
			layout : 'column',
			height : 90,
			width:'fit',
			buttonAlign : 'left',
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 110,
				msgTarget : 'side'
			},
			items:[{
				margin : '20 0 0 0',
				id:'regionCombo',
				editable : false,
				store:DigiCompass.Web.app.sitegroup.getSpectrumRegionComboStore(DigiCompass.Web.app.sitegroup.comboData),
				displayField:'spectrumRegionName',
				valueField:'spectrumRegionId',
				fieldLabel :'Region',
				listeners:{
					change:function(){
//						var dataIndex = ['specReg','specRegName'];
//						var dataValue = [this.getValue(),this.getRawValue()];
//						DigiCompass.Web.app.sitegroup.setTreeCheckedDataByCombox(dataIndex,dataValue);
						var siteTree = Ext.getCmp('siteTree');
						var sm = siteTree.target.getSelectionModel();
						var selections = sm.getSelection();
						if(!siteTree.changedRegions){
							siteTree.changedRegions = {};
						}
						for(var i=0; i<selections.length; i++){
							siteTree.changedRegions[selections[i].get(sm.pk)] = this.getRawValue();
							selections[i].set('spectrumRegion',this.getRawValue());
						}
						var groupSelections = sm.getGroupSelection();
						if(!siteTree.groupChangedRegions){
							siteTree.groupChangedRegions = {};
						}
						for(var i=0; i<groupSelections.length; i++){
							siteTree.groupChangedRegions[Ext.JSON.encode(groupSelections[i])] = this.getRawValue();
						}
					}
				}
			}]
		});
		
		var siteFormPanel = Ext.create('Ext.form.Panel',{
			id : 'siteGroupForm',
			title : 'Basic',
			defaultType : 'textfield',
			collapsible : true,
			layout : 'column',
			height : 90,
			width:'fit',
			buttonAlign : 'left',
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 110,
				msgTarget : 'side'
			},
			items : [{
						id 		   : 'sitegroupname',
						margin 	   : '20 0 0 0',
						allowBlank : false,
						emptyText  : "Please input group Version!",
						fieldLabel : 'Version',
						fieldWidth : '100%',
						msgTarget  : 'side',
						maxLength  : UiProperties.nameMaxLength,
						name 	   : 'name'
					},{
						id 		   : 'description',
						margin 	   : '20 0 0 0',
						allowBlank : true,
						fieldLabel : 'Description',
						fieldWidth : '100%',
						maxLength  : UiProperties.descMaxLength,
						msgTarget  : 'side',
						name 	   : 'description'
					},new DigiCompass.web.UI.ComboBox({
						margin : '20 0 0 0',
						id:'snapshotSite',
						fieldLabel:'Snapshot',
						tableName : 'TB_STG_SNAPSHOT_VERSION',
						allowBlank : false,
						autoLoadByCometd :true,
						listeners:{
							change:function(combo,value){
								if(Ext.isEmpty(value)){
									return;
								}
								DigiCompass.Web.app.sitegroup.cleanGridData(Ext.getCmp('siteTree'));
								if(value){
									cometdfn.publish({
										MODULE_TYPE : 'MOD_SITE_GROUP',
										COMMAND : 'COMMAND_QUERY_ALL_TREE',
										groupFields:[],
										checked:[],
										treeNode : 'siteNum',
										snapshotSite : value
									});
								}
							}
						}
					  }),{
						xtype: 'displayfield',
						margin : '20 0 0 0',
				        fieldLabel: 'Snapshot',
				        id : 'snapshotDisplay',
				        hidden:true

					},{
						id 		  : 'siteGroupSiteAllTreeButton',
						margin    : '20 0 0 20',
						xtype	  : 'button',
						text	  : 'Select site',
						msgTarget : 'side',
						name 	  : 'siteGroupSiteAllTreeButton',
						handler   : function(){
							if(Ext.isEmpty(Ext.getCmp("snapshotSite").getValue())){
								alertError('Please select a snapshot version!');
								return;
							}
							Ext.getCmp('regionCombo').setValue("");
							var snapshot = Ext.getCmp("snapshotSite").getValue();
							
							/*var flexView = Ext.create('DigiCompass.Web.app.grid.FlexView', {
						    	features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping')],
						        selModel : Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'),
						        useSearch : true,
						        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
						            buffered: true,
						            proxy: {
						                type: 'cometd.flexview',
						                moduleType : 'MOD_SITE_GROUP',
						                modules : {
						                	read : {
						               		 	command : 'COMMAND_OBJECT_TREE' 
						               		}
						                },
										extraParams: {
							                treeNode : 'siteNum',
							                snapshotSite : snapshot
							            }
						            }
						        }),
						        tbar:[{
									xtype : 'button',
									text : 'clear grouping',
									handler : function(){
										flexView.getTarget().features[0].cleanGrouping();
									}
								}]
						    });
							
							flexView.getTarget().getStore().guaranteeRange(0,29);*/
							var flexView = new DigiCompass.Web.app.grid.MutiGroupGrid({						    	
						        store: {
						            buffered: true,
						            pageSize: 100,
						            autoLoad: true,
						            proxy: {
						                type: 'cometd.mutigroup',
						                moduleType : 'MOD_SITE_GROUP',
						                modules : {
						                	read : {
						               		 	command : 'COMMAND_OBJECT_TREE' 
						               		}
						                },
							            extraParams : {
							            	treeNode : 'siteNum',
								            snapshotSite : snapshot
							            },
							            afterRequest : function(response, result){

						            	}	
						            }
						        },
						        tbar:[{
									xtype : 'button',
									text : 'clear grouping',
									handler : function(){
										flexView.getTarget().features[0].cleanGrouping();
									}
								}]
						    });
							
							//flexView.getTarget().getStore().guaranteeRange(0,29);
								    
							win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
								id : "siteSelectWindow",
								title:'SiteSelect',
								width:912,
								height:559,
								modal:true,
								layout:'fit',
								tbar:[{
									xtype:'button',
									text:"Finish",
									handler:function(){
//										if(flexView.getSelectionModel().checkedAll){
//											checkAll = true;
//										}else{
//											selections = Ext.JSON.encode(flexView.getSelectionModel().getSelectionIndex());
//											groups = Ext.JSON.encode(flexView.target.features[0].lastGroupIndex);
//											selectGroups = Ext.JSON.encode(flexView.getSelectionModel().getGroupSelection());
//										}
										var params = {
												selection : flexView.getSelectionStatus(),
												snapshotSite : snapshot
											};
										
										var message = Ext.clone(params);
										message.MODULE_TYPE = 'MOD_SITE_GROUP';
										message.COMMAND = 'COMMAND_GET_SITES_DATA'; 
										processMap(message);
										
										Ext.getCmp('siteTree').reload(params,{command : 'COMMAND_GET_SITES'}, true);
										flexView.remove(true);											
										win.close();
									}	
								}]
							});
							win.add(flexView);
							win.show();
						}
					}]
		});
		
		var mapPanel = Ext.create('Ext.panel.Panel', {				
			height : 450,			
			width:'100%',
			title: 'Map',
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
			        		    html: "<div id='map_canvas_choice_site_pop' style='width:100%; height:100%'></div>"		    
			        		})
		            	}).show();		        		
		        		if(mapSiteArray){
		        			createMapList("map_canvas_choice_site_pop", mapSiteArray);
		        		}
		            }
		        }]
		    }],
		    html: "<div id='map_canvas_choice_site' style='width:100%; height:100%'></div>"		    
		});
		
		var rightPanel = Ext.create('Ext.panel.Panel',{
			margin:'0 1 0 0',
			layout : 'anchor',
			width:'fit',
			height : 'fit',
			autoScroll:true,
			items: [siteFormPanel,comboBoxPanel,siteTree,mapPanel]
		});
		var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
			id : 'siteGroupDetail',
//			height : '722',
			front : rightPanel,
			back : new DigiCompass.Web.app.VersionForm({edit : false})
		});
		reversalPanel.addToolBar('spectrumRegion', new Ext.toolbar.Toolbar({
			items : [{
				columnWidth : .3,
//				margin : '10 0 0 10',
				xtype : 'button',
				text : 'save',
				iconCls:'icon-save',
				handler : function() {
					if (siteFormPanel.getForm().isValid()) {
						var formData = DigiCompass.Web.app.sitegroup.getFormData(siteFormPanel.getForm());
		            	var siteTree = Ext.getCmp('siteTree');
		            	if( siteTree.target.getStore().getTotalCount() === 0){
		        			alertError("No site selected !");
		        			return ;
		        		}
//		        		for(var i = 0 ; i<sites.length ; i++){
//		        			if(Ext.isEmpty(sites[i].specReg)){
//		        				alertError("Grid has error data!");
//		        				return ;
//		        			}
//		        		}
		        		formData.id = DigiCompass.Web.app.sitegroup.siteGroupId ;
						formData.MODULE_TYPE = 'MOD_SITE_GROUP';
						formData.COMMAND = 'COMMAND_SAVE';
						formData.changedRegions = siteTree.changedRegions || {};
						formData.groupChangedRegions = siteTree.groupChangedRegions || {};
						formData.siteGroupId = DigiCompass.Web.app.sitegroup.currentSiteGroupId,
						Ext.applyIf(formData, siteTree.param || {});
						cometdfn.publish(formData);
					}
				}
			}]
		}));

//		var centerPanel = Ext.create('Ext.panel.Panel',{
//			margin:'0 10 0 0',
////			height : 750,
//			layout: 'fit',
////			width:'fit',
//			items: [reversalPanel]
//		});
		return reversalPanel;
	}
	DigiCompass.Web.app.sitegroup.combineTwoTreeData = function(siteChecked , data){
		for(var i = 0 ; i<siteChecked.length ; i++){
			for(var j = 0 ; j<data.length ; j++){
				if(siteChecked[i].siteId = data[j].siteId ){
					data[j].checked = true;
					data[j].specReg = siteChecked[i].specReg;
					data[j].specRegName = siteChecked[i].specRegName;
				}
			}
		}
	}
	
	
	DigiCompass.Web.app.sitegroup.checkRow = [];
	DigiCompass.Web.app.sitegroup.chek_box = function(checkBox , event , id){
		DigiCompass.Web.app.sitegroup.uncheckedAll(Ext.getCmp('siteTree').getRootNode());
		if(checkBox.checked){
			DigiCompass.Web.app.sitegroup.checkRow.push(id);
		}else{
			var checkeds = DigiCompass.Web.app.sitegroup.checkRow.checkRow;
			for(var i = 0 ; i <checkeds.length ; i++){
				if(checkeds[i] == id){
					checkeds.splice(i,1);
				}
			}
		}
		event = event || window.event;
		event.stopPropagation();
	}
	DigiCompass.Web.app.sitegroup.comboData = null;
	DigiCompass.Web.app.sitegroup.assembleComboData = function(message){
		var comboDataJson = Ext.decode(message.BUSINESS_DATA.comboList);
		var comboData = [];
		if(Ext.isArray(comboDataJson)){
			for(var i = 0 ; i < comboDataJson.length ; i++){
				comboData.push([comboDataJson[i].id,comboDataJson[i].name]);
			}
		}
		DigiCompass.Web.app.sitegroup.comboData = comboData;
		//var store = DigiCompass.Web.app.sitegroup.getSpectrumRegionComboStore(comboData);
		//Ext.getCmp("regionCombo").bindStore(store);
	}
	DigiCompass.Web.app.sitegroup.getList = function(data, config) {
		DigiCompass.Web.app.sitegroup.checkRow = [];
		cometdfn.publish({
			MODULE_TYPE : 'MOD_SITE_GROUP',
			COMMAND : 'COMMAND_QUERY_COMBOX_LIST'
		});
		var fields = ['id', 'version','description','snapshotSite','snapshotName','reference'];
		var columns = [{
					xtype : 'treecolumn',
					header : 'Version',
					dataIndex : 'version',
					//sortable : false,
					flex: 1
				},{
					header : 'Reference',
					dataIndex : 'reference',
					//sortable : false,
					flex: 1
				}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		if (Ext.getCmp('siteGroupListView')) {
			Ext.getCmp('siteGroupListView').reconfigData(datas);
		} else {
			  var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
					columns:columns,
					fields:fields,
					width:"fit",
					height:735,
					data:[],
					listeners : {
						itemclick : DigiCompass.Web.app.sitegroup.clickFunction
					}
				});
			  	objectExplorer.on('checkchange', function(node, checked) {      
					objectExplorer.checkchild(node,checked);  
					objectExplorer.checkparent(node);  
		    	});  
				var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
					width:"fit",
					height:722,
					data:[],
					collapsible: true,
					split:true,
					region:'center',
					hidden:true
				});
				var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
					id : 'siteGroupListView',
					module:'MOD_SITE_GROUP',
					command:'COMMAND_QUERY_LIST',
					region:'west',
					otherParam:{},
					layout:'border',
					width:400,
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
				function getTbar(){
					return Ext.create('Ext.toolbar.Toolbar',{
						width:200,
						items:[{
							xtype : 'button',
							text : 'New',
							iconCls : 'icon-add',
							handler : function() {
								if(DigiCompass.Web.app.sitegroup.leftPanel){
									Ext.getCmp('obj-details').removeAll();
									Ext.getCmp('obj-details').add(DigiCompass.Web.app.sitegroup.leftPanel);
									DigiCompass.Web.app.sitegroup.leftPanel = null;
								}else{
									DigiCompass.Web.app.sitegroup.leftPanel = DigiCompass.Web.app.sitegroup.rightPanel();
									Ext.getCmp('obj-details').removeAll();
									Ext.getCmp('obj-details').add(DigiCompass.Web.app.sitegroup.leftPanel);
									DigiCompass.Web.app.sitegroup.leftPanel = null;
								}
								UiFunction.setTitle('siteGroupDetail', 'Site Group');
								Ext.getCmp('siteGroupDetail').back.setValues({versionId : ''});
								//TODO   新增SiteGroup
								Ext.getCmp("comboBoxPanel").show();
								Ext.getCmp("snapshotDisplay").setVisible(false);
								DigiCompass.Web.app.sitegroup.siteGroupId = null;
								DigiCompass.Web.app.sitegroup.cleanData();
								Ext.getCmp("comboBoxPanel").setVisible(true);
								Ext.getCmp("snapshotSite").setDisabled(false);
								Ext.getCmp("siteDelete").setDisabled(false);
								Ext.getCmp("siteGroupSiteAllTreeButton").setDisabled(false);
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
									DigiCompass.Web.app.sitegroup.delSiteGroup(siteGroupIds);
								}
							}
						}]
					})
				}
				objectExplorer.addDocked(getTbar());
				objExpPanel.add(objectExplorer);
				cataloguePanel.add(catalogue);
				catalogue.outerPanel = cataloguePanel;
				cataloguePanel.add(mainPanel);
			// 展示右边面板
			DigiCompass.Web.UI.Wheel.showDetail();
			// 创建自己的Panel
			DigiCompass.Web.app.sitegroup.leftPanel = DigiCompass.Web.app.sitegroup.rightPanel();
		}
	}
	DigiCompass.Web.app.sitegroup.clickFunction = function(grid, record, rowEl){
		var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		if(isChecked){
			return;
		}
		if(Ext.isEmpty(record.data.id)){
			return;
		}
		DigiCompass.Web.app.sitegroup.leftPanel = DigiCompass.Web.app.sitegroup.rightPanel();
		if(DigiCompass.Web.app.sitegroup.leftPanel){
			Ext.getCmp('obj-details').removeAll();
			Ext.getCmp('obj-details').add(DigiCompass.Web.app.sitegroup.leftPanel);
			DigiCompass.Web.app.sitegroup.leftPanel = null;
		}
		UiFunction.setTitle('siteGroupDetail', 'Site Group', record.data.version);
		DigiCompass.Web.app.sitegroup.cleanGridData(Ext.getCmp('siteTree'));
		//清理Detail面板数据
		DigiCompass.Web.app.sitegroup.resetSiteGroupDetail();
		DigiCompass.Web.app.sitegroup.siteGroupId = record.data.id;
		sgName = record.data.version;
		sgDescription = record.data.description;
		siteSnapshotId = record.data.snapshotSite;
		//设置选中的SiteGroup Basic Form数据
		Ext.getCmp('siteGroupForm').getForm().setValues({
			name : record.data.version,
			description : record.data.description,
			snapshotSite: record.data.snapshotSite
		});
		if(record.data.reference>0){
			/*Ext.getCmp("comboBoxPanel").hide();
			Ext.getCmp("snapshotDisplay").setValue(record.data.snapshotName);
			Ext.getCmp("snapshotDisplay").setVisible(true);
			Ext.getCmp("snapshotSite").setVisible(false);
			Ext.getCmp("siteDelete").setVisible(false);
			Ext.getCmp("siteGroupSiteAllTreeButton").setVisible(false);*/
			Ext.getCmp("comboBoxPanel").setVisible(false);
			Ext.getCmp("snapshotSite").setDisabled(true);
			Ext.getCmp("siteDelete").setDisabled(true);
			Ext.getCmp("siteGroupSiteAllTreeButton").setDisabled(true);
			
		}
		else{
			Ext.getCmp("comboBoxPanel").setVisible(true);
			Ext.getCmp("snapshotSite").setDisabled(false);
			Ext.getCmp("siteDelete").setDisabled(false);
			Ext.getCmp("siteGroupSiteAllTreeButton").setDisabled(false);
		}
		Ext.getCmp('siteGroupDetail').back.setValues({versionId : record.data.id});
		
		var message = {};
		message.siteGroupId = record.data.id;
		message.MODULE_TYPE = 'MOD_SITE_GROUP';
		message.COMMAND = 'COMMAND_QUERY_TREE_DATA';
		processMap(message);
		
		Ext.getCmp('siteTree').reload( {
			siteGroupId : record.data.id,
			snapshotSite : record.data.snapshotSite
		},{command : 'COMMAND_QUERY_TREE'}, true);
//		cometdfn.publish({
//			MODULE_TYPE : 'MOD_SITE_GROUP',
//			COMMAND : 'COMMAND_QUERY_TREE',
//			siteGroupId : record.data.id,
//			snapshotSite : record.data.snapshotSite
//		});				
		DigiCompass.Web.app.sitegroup.currentSiteGroupId = record.data.id;
	}
	DigiCompass.Web.app.sitegroup.currentSiteGroupId = null;
	DigiCompass.Web.app.sitegroup.saveSuccess = function(data, Conf, fnName,
			command) {
		var status = data.STATUS;
		if (status === "success") {
			Notification.showNotification('Save sitegroup Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.siteGroupPublish(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	DigiCompass.Web.app.sitegroup.deleteSuccess = function(data, Conf, fnName,
			command) {
		var status = data.STATUS;
		if (status === "success") {
			Notification.showNotification('Delete sitegroup successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.siteGroupPublish(queryParam);
			DigiCompass.Web.app.sitegroup.removeDetail();
			//DigiCompass.Web.app.sitegroup.cleanData();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	/**
	 * 树checked全取消
	 */
	DigiCompass.Web.app.sitegroup.uncheckedAll = function(treeNode){
		treeNode.eachChild(function(child) {
			if(child.childNodes.length>0){
				DigiCompass.Web.app.sitegroup.uncheckedAll(child);
			}
			 child.set("checked",false);
			 child.fireEvent('checkchange', child, false);
		});
        treeNode.set("checked",false);
        treeNode.fireEvent('checkchange', treeNode, false);
	}
	
	DigiCompass.Web.app.sitegroup.checkedNode = function(checked,allTree){
		var flag = false;
		for(var i = 0 ; i < allTree.length ; i++){
			if(allTree[i].isLeaf()){
				if(allTree[i].data.siteId == checked.data.siteId){
					allTree[i].set('checked',true);
					allTree[i].fireEvent('checkchange', allTree[i], true); 
					flag = true;
				}
			}else{
				var expand = DigiCompass.Web.app.sitegroup.checkedNode(checked,allTree[i].childNodes);
				if(expand){
					allTree[i].expand();
					flag = true;
				}
			}
		}
		return flag;
	}
	
	function createMapList(renderId, mapInfoList){
		if(mapInfoList && mapInfoList.length>0){
			var latlng = new google.maps.LatLng(mapInfoList[0].latStr, mapInfoList[0].lngStr);
			var myOptions = {
				zoom : 4,
				center : latlng,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				scaleControl: true,
				panControl : true,
				overviewMapControl : true
			};
			var map = new google.maps.Map(document.getElementById(renderId),
					myOptions);
			for(var i in mapInfoList){
				var info = mapInfoList[i];
				var sitePosition = new google.maps.LatLng(info.latStr, info.lngStr);
				var pinIcon = new google.maps.MarkerImage(
					    "styles/cmp/images/green.png",
					    null, /* size is determined at runtime */
					    null, /* origin is 0,0 */
					    null, /* anchor is bottom center of the scaled image */
					    new google.maps.Size(21, 43)
					);  
				var marker = new google.maps.Marker({
				    position: sitePosition,
				    //icon: pinIcon,
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
	
	function processMap(message){
		cometdfn.request(message, function(rmsg){
			var siteMapArr = new Array();
			var sites = JSON.parse(rmsg.BUSINESS_DATA);
			for(var i = 0; i < sites.length; i++){
				var info = {
						title : sites[i].name,
						latStr : sites[i].latitude,
						lngStr : sites[i].longitude
					};			
				siteMapArr.push(info);
			}								
			mapSiteArray = siteMapArr;
			createMapList("map_canvas_choice_site", siteMapArr);
		});
	}
})();