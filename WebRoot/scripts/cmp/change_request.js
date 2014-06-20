(function(){
	Ext.namespace('DigiCompass.Web.app.changeRequest');
	var _command = {};
	DigiCompass.Web.app.changeRequest.show = function(status, search, moduleType, command, reqType){
		command = command || 'COMMAND_QUERY_LIST';
//		cometdfn.request({MODULE_TYPE : moduleType,COMMAND : command,status : status, queryParam:search, reqType:reqType},DigiCompass.Web.app.changeRequest.getList);
		if(!_command[moduleType]){
			_command[moduleType] = {};
		}
		if(!_command[moduleType][command]){
			
//			_command[moduleType][command] = cometdfn.registFn({
//				MODULE_TYPE : moduleType,
//				COMMAND : command,
//				callbackfn : DigiCompass.Web.app.changeRequest.getList
//			});
		}
		DigiCompass.Web.app.changeRequest.init(moduleType, command, status, {reqType:reqType});
		cometdfn.publish({MODULE_TYPE : moduleType,COMMAND : command,status : status, queryParam:search, reqType:reqType});
	}
	var getSaveTitle = function(step, name){
		var stepTitle, title;
		switch(step){
			case 1:
				stepTitle = 'Sites';
				break;
			case 2:
				stepTitle = 'Service Catalogue';
				break;
			case 3:
				stepTitle = 'Equipment';
				break;
			case 4:
				stepTitle = 'Review';
		}
		title = 'Change Request';
		if(!Ext.isEmpty(name)){
			title +=' ('+name+')';
		}
		if(stepTitle){
			title +=' - '+stepTitle;
		}
		return UiFunction.getTitle(title);
	}
	DigiCompass.Web.app.changeRequest.saveCancel = function(){
		alertOkorCancel('After Change Request canceled is not saved, are you sure you want to do so?', function(val){
			if(val === 'yes'){
				if(DigiCompass.Web.app.triggering.TriggerCr.popRenderId){
					Ext.getCmp(DigiCompass.Web.app.triggering.TriggerCr.popRenderId).close();
				} else {
					Ext.getCmp('obj-details').removeAll();
				}
			}
		});
	}
	DigiCompass.Web.app.changeRequest.init = function(module, command, status, param){
		DigiCompass.Web.app.changeRequest.changeRequestId = null;
		var objectExplorer = Ext.create('DigiCompass.Web.app.grid.ObjectExplorer',{
			 id : 'objectExplorer',
			 store: {
	            buffered: true,
	            autoLoad:true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : module,
	                modules : {
	                	read : {
	               		 	command : command
	               		}
	                },
					extraParams: param
	            }
	        },
	        listeners : {
	        	itemclick : function(grid , record , item , index,event,eOpts){
	        		if(record.get('groupindex')){
	    		        return;
	    		    }
	        		DigiCompass.Web.app.changeRequest.clickFunction(record);
	        	}
	        }
		});
		objectExplorer.status = status;
		if(Ext.isEmpty(status)){
			objectExplorer.target.addDocked(Ext.create('Ext.toolbar.Toolbar',{
				width:200,
				items:[{
					xtype : 'button',
					text : 'New',
					iconCls : 'icon-add',
					handler : function() {
						// 展示右边面板
						DigiCompass.Web.UI.Wheel.showDetail();
						// 创建自己的Panel
						var formPanel = DigiCompass.Web.app.changeRequest.addFormPanel(null);
						// 将Panel添加在右边Panel上
						Ext.getCmp('obj-details').removeAll();
						Ext.getCmp('obj-details').add(formPanel);
					}
				},{
					xtype : 'button',
					text : 'Delete',
					iconCls : 'icon-add',
					handler : function() {
						var checkeds = new Array();
						checkeds = objectExplorer.getSelectionStatus().selections;
						if (checkeds.length == 0) {
							alertWarring('Please select a record!');
						} else {
							cometdfn.publish({
								MODULE_TYPE : 'MOD_CHANGE_REQUEST',
								COMMAND : 'COMMAND_DEL',
								deleteIds : checkeds
							});
						}
					}
				}]
			}));
		}
		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			objExpPanel.removeAll();
			objExpPanel.add(objectExplorer);
		}
		
		cometdfn.publish({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_FINANCIAL_CATEGORY_COMBO_DATA'
		});
		cometdfn.publish({ 
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_DRAG_GRID' 
		});
		cometdfn.publish({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_SITE_TYPE_COMBOX_LIST'
		});
	}
	
	DigiCompass.Web.app.changeRequest.getList = function(data){
		DigiCompass.Web.app.changeRequest.changeRequestId = null;
		cometdfn.publish({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_FINANCIAL_CATEGORY_COMBO_DATA'
		});
		cometdfn.publish({ 
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_DRAG_GRID' 
		});
		cometdfn.publish({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_SITE_TYPE_COMBOX_LIST'
		});
		var fields = ['id', 'name', 'number', 'description','reference', 'requestDate'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Change Request',
						dataIndex : 'name',
						sortable : false,
						flex : 1
					},{
						header : 'Number',
						dataIndex : 'number',
						sortable : false,
						flex : 1
					},{
						header : 'Submission Date',
						dataIndex : 'requestDate',
						sortable : false,
						flex : 1
					},{
						header : 'Description',
						dataIndex : 'description',
						sortable : false,
						flex : 1
					}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		var searchKeys = data.BUSINESS_DATA.searchKeys;
		var status = data.status;
		if (Ext.getCmp('changeRequestListView')) {
			Ext.getCmp('changeRequestListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				id : 'objectExplorer',
				status : status,
				columns:columns,
				fields:fields,
				width:'fit',
				height:735,
				searchKeys : searchKeys,
				data:[],
				listeners : {
					itemclick : DigiCompass.Web.app.changeRequest.clickFunction
				}
			});
			objectExplorer.on('checkchange', function(node, checked) {      
				objectExplorer.checkchild(node,checked);  
				objectExplorer.checkparent(node);  
	    	}); 
			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
				width:'fit',
				height:722,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'changeRequestListView',
				module:data.MODULE_TYPE,
				command:data.COMMAND,
				otherParam:{reqType : data.reqType, status : data.status},
				layout:'border',
				width:50,
				region:'west',
				height:530,
				objectExplorer:objectExplorer,
				catalogue:catalogue,
				hidden:true
			});
			mainPanel.reconfigData(datas);
			
			var objExpPanel = Ext.getCmp('obj-exp');
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}
			var cataloguePanel = Ext.getCmp('obj-cat');
			if (cataloguePanel) {
				// 移除组建
				cataloguePanel.removeAll();
			}
			if(Ext.isEmpty(status)){
				objectExplorer.addDocked(Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							// 展示右边面板
							DigiCompass.Web.UI.Wheel.showDetail();
							// 创建自己的Panel
							var formPanel = DigiCompass.Web.app.changeRequest.addFormPanel(null);
							// 将Panel添加在右边Panel上
							Ext.getCmp('obj-details').removeAll();
							Ext.getCmp('obj-details').add(formPanel);
						}
					},{
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-add',
						handler : function() {
							var checkeds = new Array();
							var selected = objectExplorer.getChecked();
							for(var i = 0 ; i <selected.length ; i++){
								checkeds.push(selected[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
							} else {
								cometdfn.publish({
									MODULE_TYPE : 'MOD_CHANGE_REQUEST',
									COMMAND : 'COMMAND_DEL',
									deleteIds : checkeds
								});
							}
						}
					}]
				}));
			}
			objExpPanel.add(objectExplorer);
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
		}
	}
	
	DigiCompass.Web.app.changeRequest.clickFunction = function(record){
		if(Ext.isEmpty(record.data.id)){
			return;
		} 
		Ext.getCmp('obj-details').removeAll();
		DigiCompass.Web.UI.Wheel.showDetail();
		var  changeRequestPanel = DigiCompass.Web.app.changeRequest.showDetail(record.data.id, Ext.getCmp('objectExplorer').status, record.data.name);
		Ext.getCmp('obj-details').add(changeRequestPanel);
		var datas = {
				id : record.data.id,
				name : record.data.name,
				description : record.data.description
			};
		Ext.getCmp('changeRequestDetail').getForm().setValues(datas);
		
	}
	DigiCompass.Web.app.changeRequest.createGrid = function(id, status, title, config, notification){
		var param = {
		        title: title,
				status : status,
				changeRequestId : id, 
				notification : notification
			};
		Ext.apply(param, config || {});
		var siteWorkflowEquipment = Ext.create('DigiCompass.Web.app.planning.grid.ChangeRequestGrid', param);
		setTimeout(function(){siteWorkflowEquipment.load({ id : id });},1000);
		return siteWorkflowEquipment;
	}
	DigiCompass.Web.app.changeRequest.showDetail = function(id, status, name){
		var title = null;
		if(status === 'STATUS_CHANGEREQUEST'){
			title = 'Change Approval';
    	}else if(status === 'STATUS_APPROVED'){
    		title = 'Change Release';
    	}else if(status === 'STATUS_CHANGE_CANCEL'){
    		title = 'Change Cancel';
    	} else if(status === 'STATUS_VENDERED'){
    		title = 'Fulfilment';
    	} else if(status === 'STATUS_COMPLATED'){
    		title = 'Fulfilment Approval';
    	}else if(status === 'STATUS_CHANGE_RELEASEMANAGER'){
    		title = 'Administration (Cancel / Hold / Resume)';
    	}else if(status === "STATUS_CANCEL" || status === "STATUS_ONHOLDED" || status === "STATUS_RESUME"){
    		title = 'Administration Approval (Cancel / Hold)';
    	}else {
    		title = 'Change Request'
    	}
		title = title+' ('+name+')';
		var  form = Ext.create('Ext.form.Panel', {
			id : 'changeRequestDetail',
			defaultType : 'textfield',
			title: UiFunction.getTitle(title),
			frame : false,
			height : 'fit',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 200	
			},
			defaults: {
	            anchor: '-15'
	        },
			items:[{
					id : 'changeRequestId',
					xtype : 'hidden',
					name : 'id'
				},{
					id 		   : 'changeRequestName',
					margin 	   : '10px 5px 10px 10px',
					fieldLabel : 'Name ',
					name 	   : 'name',
					readOnly   : true,
//					allowBlank : false,
//					emptyText  : 'Please input data!',
//					maxLength  : UiProperties.nameMaxLength,
//					msgTarget  : 'side',
					height : 25,
					anchor:'95%'
				},{
					id 		   : 'changeRequestDes',
					margin 	   : '10px 5px 10px 10px',
					fieldLabel : 'Description ',
					name 	   : 'description',
					readOnly   : true,
//					emptyText  : 'Please input data!',
//					maxLength  : UiProperties.descMaxLength,
//					msgTarget  : 'side',
					height : 25,
					anchor:'95%'
				}, DigiCompass.Web.app.changeRequest.createGrid(id, status, title, {anchor:'-15 -75'})
			]
		});
		return form;
	}
	DigiCompass.Web.app.changeRequest.addPlannedSiteSuccess = function(){
		var plannedSiteAdd = Ext.getCmp('plannedSiteAddWin');
		if(plannedSiteAdd){
			plannedSiteAdd.close();
		}
		Notification.showNotification('Save plannedSite success。');
	}
	DigiCompass.Web.app.changeRequest.showPlannedSiteWin = function(message){
		var technologys = Ext.decode(message.BUSINESS_DATA.technology);
		var plannedSite = Ext.create('Ext.panel.Panel',{
				id    : 'plannedSiteAdd'
		})
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			id    : 'plannedSiteAddWin',
			title : 'New Planned Site',
			width : 900,
			height : 800,
			modal:true,
			items:[plannedSite]
		});
		win.show();
		DigiCompass.Web.app.plannedSite.showDetailPanel(null, technologys, plannedSite);
		
	}
	/**
	 * @param param:
	 * id --changeRequestTempId
	 * name 
	 * descriptor
	 * step1Scope
	 * step2Scope
	 * step3Scope
	 */
	DigiCompass.Web.app.changeRequest.addFormPanel = function(param){
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
		
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'changeRequestAdd',
			defaultType : 'textfield',
			title: getSaveTitle(1, (param && param.name) ? param.name : null),
			border : false,
			width : '100%',
			frame : false,
			height : 'fit',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 200	
			},
			tbar:[{
				xtype : 'button',
				text  : 'Next',
				iconCls : 'icon-next',
				handler : function(){
					var form = formPanel.getForm();
					if(!form.isValid()){
						return;
					}
					var values = form.getValues();
					var siteTree = Ext.getCmp('siteSelectTree');
					var plannedSiteTree = Ext.getCmp('plannedSiteTree');
					if(siteTree.getStore().getTotalCount() == 0 && plannedSiteTree.getStore().getCount() == 0){
						Notification.showNotification('No Site Selected!');
						return ;
					}
					var param2 = {id : param ? param.id : null};
					if(siteTree && siteTree.param){
						param2 = siteTree.param;
					}
					Ext.apply(param2, values);
					if(plannedSiteTree){
						var store = Ext.getCmp('plannedSiteTree').getStore();
						var count = store.getCount();
						var datas = [];
						for(var i = 0 ; i<count ; i++){
							var data = store.getAt(i).data;
							if(/*Ext.isEmpty(data.siteTypeId) ||*/ Ext.isEmpty(data.regionId)){
								Notification.showNotification('Please set the plannedSite region And SiteType!');
								return;
							}
							datas.push(data);
						}
						param2.plannedSites = datas;
					}
					var workflowPanel = DigiCompass.Web.app.changeRequest.showNextWorkflowForm(param2);					
					DigiCompass.Web.app.changeRequest.renderDetailPanel(workflowPanel);
				}
			}, {
				xtype : 'button',
				text  : 'Cancel',
				iconCls : 'icon-next',
				handler : function(){
					DigiCompass.Web.app.changeRequest.saveCancel();
				}
			}],
			items : [{
						id 		   : 'changeRequestName',
						margin 	   : '10px 5px 10px 10px',
						allowBlank : false,
						emptyText  : 'Please input data!',
						fieldLabel : 'Name ',
						maxLength  : UiProperties.nameMaxLength,
						width	   : 800,
						msgTarget  : 'side',
						name 	   : 'name',
						listeners : {
							change : function(scope, newVal,val){
								formPanel.setTitle(getSaveTitle(1, newVal));
							}
						}
					},{
						id 		   : 'changeRequestDes',
						margin 	   : '10px 5px 10px 10px',
						emptyText  : 'Please input data!',
						fieldLabel : 'Description ',
						maxLength  : UiProperties.descMaxLength,
						width 	   : 800,
						msgTarget  : 'side',
						name 	   : 'description'
					}]
			});
		var store = {
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
									selection : response.selection
			            	}
						}						
	            	}
	            	
	            }
            }
        };
		var siteTree = new DigiCompass.Web.app.grid.MutiGroupGrid({
			margin  : '5 10 10 5',
			id:'siteSelectTree',
	        title: 'Existing Sites',
	        useSearch : false,
	        collapsible : true,
	        width: 'fit',
//	        height: 320,
	        anchor : '-10 50%-10',
	        autoScroll:true,
	        store: store,
	        multiSelect: true,
	        columns: [],
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					siteTree.getTarget().features[0].cleanGrouping();
				}
			},{
				xtype : 'button',
				text   : 'Select Existing Sites',
				handler : function(){
					DigiCompass.Web.app.changeRequest.showSiteSelectWindow();
				}
			},{
				xtype : 'button',
				text : 'Import',
				handler : function(){					
	            	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
	            		layout: 'fit',
        		        width: 500,
        		        height: 300,
        		        modal: true,
        		        closeAction: 'destroy',
        		        items: {
        		        	xtype : 'form',
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
         		                        	   MODULE_TYPE : "CR_SELECT_EXIST_SITE"
         		                           },
         		                           waitMsg: 'Uploading your file...',
         		                           success: function(fp, o) {
         		                        	   console.log(o.result.selections);
         		                        	   	var params = {
         		                        	   		selection :{
	         		         							checkAll : false,
	         		         							selections : Ext.JSON.encode(o.result.selections),
	         		         							groups : Ext.JSON.encode([]),
	         		         							selectGroups : Ext.JSON.encode([[]]),
	         		         							search : null
         		                        	   		}
         		         						};
	         		         					
	         		         					var message = Ext.clone(params);
	         		         					message.MODULE_TYPE = 'MOD_SITE_GROUP';
	         		         					message.COMMAND = 'COMMAND_GET_SITES_DATA'; 
	         		         					
	         		         					Ext.getCmp('siteSelectTree').reload(params,{command : 'COMMAND_GET_SITES'}, true);
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
        		        }
	            	});
	            	win.show();				
				}
			},{
				xtype : 'button',
				text : 'Export',
				handler : function(){
					if(siteTree.param){									
						var message = {
								selection : JSON.stringify(siteTree.param.selection)
							};												
						message.MODULE_TYPE = 'MOD_CHANGE_REQUEST';
						message.COMMAND = 'CR_EXIST_SITE_EXPORT'; 
						message.title = "Change Request Existing Sites";						    				
		            	var str = context.param(message);
		            	window.location.href = "download?"+str;
					}
				}
			}]
		});
		Ext.define('site', {
			extend : 'Ext.data.Model',
			fields:[{ name : 'state', type : 'string' },
					{ name : 'siteId', type : 'string' },
					{ name : 'version', type : 'string' },
					{ name : 'comment', type : 'string' },
					{ name : 'regionId', type : 'string' }, 
					{ name : 'regionName', type : 'string' }, 
				/*	{ name : 'siteTypeId', type : 'string' }, 
					{ name : 'siteTypeName', type : 'string' },*/
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
		var plannedStore = Ext.create('Ext.data.ArrayStore', {
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
		        	}
		         }, 
		       /* { text : 'Site Type', summaryType: 'count', dataIndex : 'siteTypeName', flex:1 , sortable : true , 
	    			renderer : function(value , metaData , record ){
	    				if(Ext.isEmpty(value)){
	    					return '<font color = "red">NO DATA</font>';
	    				}
	    				else{
	    					return value;
	    				}
	    			}
		        },*/ 
			    { text : 'Site Number', dataIndex : 'siteName' , flex:1 , sortable : true, summaryType: 'count' }, 
			    { text : 'Description', dataIndex : 'siteDes', flex:1, sortable : true, summaryType: 'count' }, 
			    { text : 'Longitude', dataIndex : 'siteLongitude', summaryType: 'count', flex:1, sortable : true }, 
			    { text : 'Latitude', summaryType: 'count', dataIndex : 'siteLatitude', flex:1, sortable : true }, 
			    { text : 'Site Status', summaryType: 'count', dataIndex : 'siteStatus', flex:1, sortable : true }, 
			    { text : 'Group Resp', summaryType: 'count', dataIndex : 'groupResp', flex:1, sortable : true }, 
			    { text : 'Polygon', summaryType: 'count', dataIndex : 'sitePolygon', flex:1, sortable : true }];
		var plannedSiteTree = Ext.create('Ext.grid.Panel', {
			margin  : '5 10 10 5',
			features: [feature],
			id : 'plannedSiteTree',
			title : 'Planned Sites',
//			height : 'fit',	
			anchor : '-10 50%-10',
			width:'100%',
			selModel: Ext.create('Ext.selection.CheckboxModel'), 
			collapsible : true,
			useArrows : true,
			rootVisible : false,
			store : plannedStore,
			multiSelect : true,
			columns : cm,
			tbar:[{
	        	  xtype:'button',
	        	  text:'Clear Grouping',
	        	  handler:function(){
	        		  feature.cleanGrouping();
	        	  }
	          },{
				xtype : 'button',
				text  : 'New Planned Site',
				iconCls : 'icon-add',
				handler :function(){
					cometdfn.publish({
						MODULE_TYPE : 'MOD_CHANGE_REQUEST',
						COMMAND : 'COMMAND_QUERY_COMBOX_LIST'
					});
				}
	          },{
				xtype : 'button',
				text  : 'Select Planned Sites',
				handler : function(){
					var flexView = new DigiCompass.Web.app.grid.MutiGroupGrid({				    	
				        useSearch : true,
				        store: {
				            buffered: true,
				            autoLoad : true,
				            proxy: {
				                type: 'cometd.mutigroup',
				                moduleType : 'MOD_CHANGE_REQUEST',
				                modules : {
				                	read : {
				               		 	command : 'COMMAND_SITE_LIST' 
				               		}
				                },
								extraParams: {
					                treeNode : 'siteNum',
					                siteType : 'planned'
					            }
				            }
				        },
				        tbar:[{
							xtype : 'button',
							text : 'Clear Grouping',
							handler : function(){
								flexView.getTarget().features[0].cleanGrouping();
							}
						}]
				    });
					
					//flexView.getTarget().loadStart();
						    
					var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
						id : "siteSelectWindow",
						title:'Planned Sites',
						width:912,
						height:559,
						modal:true,
						layout:'fit',
						tbar:[{
							xtype : 'button',
							text : 'Finish',
							handler:function(){
								var checkAll = false, selections=[], groups=[], selectGroups=[];
								var status = flexView.getSelectionStatus();
								var params = {
										checkAll : status.checkAll,
										selections : Ext.JSON.encode(status.selections),
										groups : Ext.JSON.encode(status.groups),
										selectGroups : Ext.JSON.encode(status.selectGroups)
									};
								
								var message = Ext.clone(params);
								message.MODULE_TYPE = 'MOD_CHANGE_REQUEST';
								message.COMMAND = 'COMMAND_GET_SITES'; 
								cometdfn.request(message, function(msg){
									var data = Ext.JSON.decode(msg.BUSINESS_DATA);
									for(var i in data){
										data[i].siteName = data[i].name;
										data[i].siteDes = data[i].description;
										data[i].siteId = data[i].id;
										data[i].siteLongitude = data[i].longitude;
										data[i].siteLatitude = data[i].latitude;
									}
									console.log(data);
									Ext.getCmp('plannedSiteTree').getStore().loadData(data);
								});
								
								flexView.remove(true);											
								win.close();
							}	
						}]
					});
					win.add(flexView);
					win.show();
				}
			},{
				margin 		 : '5 0 0 10',
				fieldLabel   : 'Region',
				xtype 		 : 'combo',
				labelAlign : 'right',
//				width        : 300,
//				id 		     : 'spectrumRegionCombo',
				editable     : false,
				valueField   : 'spectrumRegionId',
				displayField : 'spectrumRegionName',
				store		 : DigiCompass.Web.app.plannedSitegroup.getSpectrumRegionComboStore(DigiCompass.Web.app.changeRequest.regionComboData),
				listeners:{
					change:function(){
						if (!Ext.isEmpty(this.getValue())) {
							var dataIndex = ['regionId','regionName'];
							var dataValue = [this.getValue(),this.getRawValue()];
							DigiCompass.Web.app.plannedSitegroup.setPlannedTreeCheckedDataByCombox(dataIndex,dataValue,'plannedSiteTree');
						}
					}
				}
			}]
		}); 
		
		if(param){
			formPanel.getForm().setValues(param);
			var p , data;
			if(param.step1Scope){
				p = Ext.JSON.decode(param.step1Scope);
				cometdfn.request({
					MODULE_TYPE : 'MOD_CHANGE_REQUEST',
					COMMAND : 'COMMAND_PLANNEDSITEINCRT',
					changeRequestId : param.id
				}, function(message){
					var data = Ext.JSON.decode(message.BUSINESS_DATA);
					console.log(data);
					for(var i in data){
						data[i].siteName = data[i].name;
						data[i].siteDes = data[i].description;
						data[i].siteId = data[i].id;
						data[i].siteLongitude = data[i].longitude;
						data[i].siteLatitude = data[i].latitude;
					}
					Ext.getCmp('plannedSiteTree').getStore().loadData(data);
				})
			}else{
				p = {
					selection : param.selection,
				}
				Ext.getCmp('plannedSiteTree').getStore().loadData(param.plannedSites);
			}
			if(p){
				siteTree.reload(p,{command : 'COMMAND_GET_SITES'}, true);
			}
		}
		
		var panel = Ext.create('Ext.panel.Panel',{
				layout:'vbox',
				items : [formPanel, {
					width  :'100%',
					flex   : 5,
					xtype  :'container',
					layout : 'anchor',
					items:[siteTree,plannedSiteTree]
				}]
		});
		
		return panel;
	}
	DigiCompass.Web.app.changeRequest.showSiteSelectWindow  = function(){
		var flexView = new DigiCompass.Web.app.grid.MutiGroupGrid({	    	
	        useSearch : true,
	        store: {
	        	autoLoad : true,
	            buffered: true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_SITE_LIST' 
	               		}
	                },
					extraParams: {
		                treeNode : 'siteNum'
		            }
	            }
	        },
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					flexView.getTarget().features[0].cleanGrouping();
				}
			}]
	    });
		
		//flexView.getTarget().loadStart();
			    
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			id : "siteSelectWindow",
			title:'Existing Sites',
			width:912,
			height:559,
			modal:true,
			layout:'fit',
			tbar:[{
				xtype : 'button',
				text : 'Finish',
				handler:function(){
					var params = {
							selection:flexView.getSelectionStatus()
						};
					var message = Ext.clone(params);
					message.MODULE_TYPE = 'MOD_SITE_GROUP';
					message.COMMAND = 'COMMAND_GET_SITES_DATA'; 
					
					Ext.getCmp('siteSelectTree').reload(params,{command : 'COMMAND_GET_SITES'}, true);
					flexView.remove(true);
					win.close();
				}	
			}]
		});
		win.add(flexView);
		win.show();
	}
	
	
	var getSiteServiceRefGrid = function(param){
		var siteServiceRef= Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid',{
			margin  : '5 10 10 5',
			id:'siteWorkflowSelected',
	        title: 'Submissions',
	        collapsible : true,
	        anchor : '-10 48%-10',
//	        features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping')],
//	        selModel: Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'), 
//	        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
        	store:  {
	        	autoLoad : false,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_SITE_WORKFLOW' 
	               		}
	                },
		            extraParams : {
		            	first : true,
		            	option : 'SELECTED'
		            }
	            }
	        },
	        plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
 				clicksToEdit : 1,
 				autoCancel : false,
 				listeners : {
 					'beforeedit' : function(me, obj){
 						return true;
					},'afteredit' : function(me, obj){
						var record = obj.record,
							oldVal = obj.originalValue;
						if(oldVal!==obj.value){
							if(this.reqIdx){
								cometdfn.removeListener(this.reqIdx);
							}
							var param = {};
							if(obj.value instanceof Date){
								param[obj.field] = Ext.Date.format(obj.value, 'Y-m-d');
							}else{
								param[obj.field] = obj.value+'';
							}
							this.reqIdx = cometdfn.request({
								MODULE_TYPE : 'MOD_CHANGE_REQUEST',
                        		COMMAND : 'OVERRIDE_SERVICE_SETTING',
                        		tmpId : record.get('sites.services.id'),
                        		param : param
							}, function(message){
								this.reqIdx = null;
								console.log(message);
							}, function(){
								this.reqIdx = null;
							});
						}
					}
 				}
 			})],
	        multiSelect: true,
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					siteServiceRef.target.features[0].cleanGrouping();
				}
			},{
				xtype : 'button',
				text : 'Required Date',
				handler : function(){
					promptDateDialog('Required Date','Please enter the Required Date:', function(ok, date){
						if(ok === 'ok'){
							var sels = siteServiceRef.getSelectionStatus();
							cometdfn.request({
								MODULE_TYPE:'MOD_CHANGE_REQUEST',
								COMMAND:'SETTING_SERVICE_REQUIRED_DATE',
								selection : sels,
								requiredDate:date,
								tmpId : DigiCompass.Web.app.changeRequest.changeRequestId
							}, function(msg){
								if(msg.BUSINESS_DATA){
									siteServiceRef.reload();
								}
							});
						}
					},this, null, function(date){
						return !!Ext.Date.parseDate(date, 'Y-m-d');
					});
				}
			},{
				xtype : 'button',
				text  : ' Remove Submissions',
//				iconCls : 'icon-delete',
				handler : function(){
					var sels = siteServiceRef.getSelectionStatus();
					cometdfn.request({
						MODULE_TYPE:'MOD_CHANGE_REQUEST',
						COMMAND:'REMOVE_SERVICE',
						selection : sels,
						tmpId : DigiCompass.Web.app.changeRequest.changeRequestId
					}, function(){
						siteServiceRef.reload();
						Ext.getCmp('siteWorkflowUnRef').reload();
					});
				}
			}],listeners : {
				/*
				cellclick : function(grid, cellElement, columnNum, record,
						rowElement, rowNum, e) {
					var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
					if(dataIndex !== 'catalogueName'){
						return;
					}
					DigiCompass.Web.app.wftemp.showServiceTree( record.get('calculatedCatalogueId'), function(sel){
						cometdfn.request({
							MODULE_TYPE : 'MOD_CHANGE_REQUEST',
							COMMAND : 'COMMAND_SAVE_TEMP_SERVICECATALOGUE',
							id : record.get('id'),
							catalogueId : sel.id
						}, function(){
							record.set('catalogueId', sel.id);
							record.set('catalogueName', sel.name);
						})
					});
				}*/
			}
		});
		return siteServiceRef;
	}
	var getSelectionSitesGrid = function(param){
		var sites= new DigiCompass.Web.app.grid.MutiGroupGrid({
			margin  : '5 10 10 5',
			id:'siteWorkflowUnRef',
	        title: 'Sites without Applicable Service',
	        collapsible : true,
	        anchor : '-10 48%-10',
//	        features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping')],
//	        selModel: Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'), 
//	        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
	        store:  {
	        	autoLoad : false,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_SITE_WORKFLOW' 
	               		}
	                },
		            extraParams : {
		            	first : true,
		            	option : 'NOREF'
		            }
	            }
	        },
	        multiSelect: true,
	        columns: [],
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					sites.target.features[0].cleanGrouping();
				}
			},{
				xtype : 'button',
				text : 'Service',
				handler : function(){
					//TODO open window for select Service, the save site-service ref
					if(sites.target.getSelectionModel().getSelectionIndex().length === 0){
						Notification.showNotification('No Site Selected!');
						return ;
					}
					var panel = DigiCompass.Web.app.changeRequest.getServicePanel(param);
					var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
					    title: 'Service',
					    id : 'chooseTemplate',
					    modal : true,
					    height: 500,
					    width: 700,
					    layout: 'fit',
					    items: [panel],
					    tbar : [{
					    	xtype : 'button',
					    	text  : 'Finish',
					    	iconCls : 'icon-save',
					    	handler : function(){
					    		var serviceDatas = panel.getService();
					    		var empty = true;
					    		for(var i in serviceDatas){
					    			empty = false;
					    		}
					    		if(empty){
					    			Notification.showNotification('No Service Selected!');
					    		}
					    		cometdfn.request({
					    			MODULE_TYPE:'MOD_CHANGE_REQUEST',
					    			COMMAND:'COMMAND_SETTING_SITE_SERVICE',
					    			id : sites.getStore().getProxy().extraParams.changeRequestId,
					    			selection:sites.getSelectionStatus(),
					    			services:serviceDatas
					    		}, function(){
					    			sites.reload();
					    			Ext.getCmp('siteWorkflowSelected').reload();
					    			win.close();
					    		});
					    	}
					    }]
					});
					win.show();
				}
			}]
		});
		return sites;
	}
	DigiCompass.Web.app.changeRequest.getServicePanel = function(param, all){
		param = param || {}
		var serviceDatas = param.selectionService || {};
		var categoryTypeTree = Ext.create('Ext.tree.Panel', {
	        title : 'Service',
	        id : 'catalogueTree',
	        region : 'center',
	        //margin:'5 0 0 0',
	        autoScroll  : true,
	        collapsible: true,
	        rootVisible: false,
			viewConfig: {
	            plugins: {
	                ddGroup: 'workflowTemplateDragDropGroup',
	                ptype: 'gridviewdragdrop',
	                enableDrop: false
	            }
	        },
	        plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
 				clicksToEdit : 1,
 				autoCancel : false,
 				listeners : {
 					'beforeedit' : function(me, obj){
 						return true;
					},'afteredit' : function(me, obj){
						if(obj.record.get('id') in serviceDatas){
							serviceDatas[obj.record.get('id')][obj.field] = obj.value+'';
						}
					}
 				}
 			})],
	        rootVisible: true,
	        store: Ext.create('Ext.data.TreeStore', {
		    	fields: [ 'name', 'level', 'property','typeId','id','capex','opex','quantity' ],
		        root: { },
		        folderSort: true
		    }),
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 2,
	            sortable: false,
	            dataIndex: 'name'
	        },{
	            text: 'Capex',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'capex',
	            editor : {
	            	xtype : 'numberfield',
	            	allowBlank : false,
	            	minValue : 0
	            }
	        },{
	            text: 'Opex',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'opex',
	            editor : {
	            	xtype : 'numberfield',
	            	allowBlank : false,
	            	minValue : 0
	            }
	        },{
	            text: 'Quantity',
	            flex: 1,
	            sortable: false,
	            dataIndex: 'quantity',
	            editor : {
	            	xtype : 'numberfield',
	            	allowBlank : false,
	            	minValue : 1
	            }
	        }],
	        listeners : {
				checkchange : function(node, checked) {      
					DigiCompass.Web.TreeUtil.checkchild(node,checked);  
					DigiCompass.Web.TreeUtil.checkparent(node);
					selectionService(node, checked);
			    }
	        }
	    });
		var selectionService = function(node, checked){
			if(node.isLeaf()){
				var id = node.get('id');
				if(!checked){
					delete serviceDatas[id];
				}else{
					serviceDatas[id] = {
						id:id,
						quantity:(node.get('quantity')||0)+'',
						capex : (node.get('capex')||0)+'',
						opex:(node.get('opex')||0)+''
					}
				}
			}else{
				node.eachChild(function(child) {
					selectionService(child,checked);
				});
			}
		}
		var parentChildTree = Ext.create('Ext.tree.Panel', {
	        title : 'Existing Service Catalogues',
	        id : 'serviceCatalogueTemplate',
	        region : 'west',
	        //margins: '5 5 0 0',
	        width : 180,
	        autoScroll  : true,
	        rootVisible: false,
	        store: Ext.create('Ext.data.TreeStore', {
		    	fields: [ 'name','description','reference'],
		        root: { },
		        folderSort: true
		    }),
	        //the 'columns' property is now 'headers'
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 3,
	            sortable: false,
	            dataIndex: 'name'
	        },{
	            text: 'Description',
	            flex: 2,
	            sortable: false,
	            dataIndex: 'description'
	        }],
	        listeners : {
	        	itemclick : function(grid, record, item, index, event, eOpts) {
					if (Ext.isEmpty(record.data.id)) {
						return;
					}
					cometdfn.request({
						MODULE_TYPE : 'MOD_CHANGE_REQUEST',
						COMMAND : 'COMMAND_QUERY_SERVICE',
						all : all,
						id : record.data.id
					}, function(message){
						var children = Ext.JSON.decode(message.BUSINESS_DATA);
						var capex = 0;
						var opex = 0;
						var quantity = 0;
						checkService(children);
						for(var i = 0 ; i < children.length ;  i++){
							capex = capex + children[i]['capex'];
							opex = opex + children[i]['opex'];
							quantity = quantity + children[i]['quantity'];
						}
						Ext.getCmp('catalogueTree').setRootNode({
							name : record.get('name') ,
							expanded : true,
							checked : false,
							capex : capex ,
							opex : opex ,
							quantity : quantity,
							children : children
						});
						console.log('show:', serviceDatas, children)
						Ext.getCmp('catalogueTree').expandAll();
					});
				}
	        }
	    });
		var checkService = function(nodes){
			for(var j=0; j<nodes.length; j++){
				var node = nodes[j];
				if(node.id in serviceDatas){
					data = serviceDatas[node.id];
					node.checked = true;
					if(data.quantity){
						node.quantity = data.quantity;
					}
					if(data.capex){
						node.capex = data.capex;
					}
					if(data.opex){
						node.opex = data.opex;
					}
				}
				if(node.children && node.children.length>0){
					checkService(node.children);
				}
			}
		}
		var panel = new Ext.panel.Panel({
			frame : false,
			border : false,
			layout: 'border',			
			defaults: {		
				collapsible: true,
			    split: true				    
			},
		    items: [parentChildTree,categoryTypeTree]
		});
		panel.getService = function(){
			return serviceDatas;
		}
		function setData(wftTree,treeData){
			wftTree.getRootNode().removeAll();
			if(treeData.length > 0){
				wftTree.getRootNode().appendChild(treeData);
			}
			var ct = Ext.getCmp('catalogueTree');
			if(ct){
				ct.setRootNode({});
			}
		}
		cometdfn.request({
			MODULE_TYPE : 'MOD_CHANGE_REQUEST',
			COMMAND : 'COMMAND_QUERY_SERVICE_CATALOGUE',
			dataType : 'TreeData',
			categoryTypeId : param.serviceCatalogueHierarchyId,
			all : all,
			fchId:param.financialCategoryGroupId
		}, function(message){
			var _data = Ext.JSON.decode(message.BUSINESS_DATA.list);
			var treeData = DigiCompass.Web.app.wftemp.getWorkflowTempTree(_data);
			var wftTree = Ext.getCmp('wftTree');
			if(wftTree){
				 setData(wftTree,treeData)
			}
			wftTree = Ext.getCmp('serviceCatalogueTemplate');
			if(wftTree){
				if(wftTree.selectedTpl){
					checkStpl(treeData, wftTree.selectedTpl);
				}
				 setData(wftTree,treeData)
			}
			wftTree =  Ext.getCmp('financialWftTree');
			if(wftTree){
				 setData(wftTree,treeData)
			}
		});
		
		var serviceIds = new Array();
		for(var i in serviceDatas){
			serviceIds.push(i);
		}
		if(serviceIds.length > 0){
			cometdfn.request({
				MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',
				COMMAND : 'SERVICE_BELONG_SC',			
				serviceIds : serviceIds  			
			}, function(data){
				var list = data.BUSINESS_DATA.list;
				var sctTree = Ext.getCmp("serviceCatalogueTemplate");
				var rnode = sctTree.getRootNode();
				if(rnode.childNodes && rnode.childNodes.length > 0){
					rnode.cascadeBy(function(node){
						for(var i = 0; i < list.length; i++){
							if(list[i] == node.raw.id){
								node.set("checked", true);
							}
						}
					});
				} else {
					sctTree.selectedTpl = list;
				}
			});			
		}
		return panel;
	}
	DigiCompass.Web.app.changeRequest.showNextWorkflowForm = function(param){
		if(!DigiCompass.Web.app.changeRequest.changeRequestId){
			DigiCompass.Web.app.changeRequest.changeRequestId = param.id;
		}
		var siteServiceRef = getSiteServiceRefGrid(param);
		var sites = getSelectionSitesGrid();
		
		var hierarchyEvents = {
			change : function(field, newValue, oldValue, eOpts){
				if(panel.getForm().isValid()){
					var p = null;
					param = Ext.apply(param, panel.getForm().getValues());
					p = Ext.apply(param, {
						MODULE_TYPE:'MOD_CHANGE_REQUEST',
						COMMAND:'COMMAND_SAVE_TEMP',
						SAVE_TYPE:'SAVE_SITE_WORKFLOW_REF'
					});
					siteServiceRef.remove(true);
					sites.remove(true);
					
					siteServiceRef = getSiteServiceRefGrid(param);
					sites = getSelectionSitesGrid(param);
					panel.add(siteServiceRef);
					panel.add(sites);
					cometdfn.publish(p);
				}
			}
		}
		
		var panel = Ext.create('Ext.form.Panel',{
			title : getSaveTitle(2, param.name),
			layout : 'anchor',
			tbar  : [ {
				xtype : 'button',
				text  : 'Previous',
				iconCls : 'icon-prev',
				handler : function(){					
					DigiCompass.Web.app.changeRequest.renderDetailPanel(DigiCompass.Web.app.changeRequest.addFormPanel(param));
				}
			}, {
				xtype   : 'button',
				text    : 'Next',
				iconCls : 'icon-next',
				handler : function(){
					var params = siteServiceRef.target.store.proxy.extraParams;
					var id = params.changeRequestId;
					if(siteServiceRef.getStore().getTotalCount()===0){
						Notification.showNotification('No Site Submissions!');
						return;
					}
					window.myMask = new Ext.LoadMask(document.body, {msg:"Please wait..."});
					window.myMask.show();
					cometdfn.publish({
						changeRequestId : id,
						name : param.name,
						MODULE_TYPE : 'MOD_CHANGE_REQUEST',
						COMMAND : 'COMMAND_SAVE_TEMP',
						SAVE_TYPE : 'SAVE_SITE_EQUIPMENTTEMPLATE_REF'
					});
				}
			}, {
				xtype : 'button',
				text  : 'Cancel',
				iconCls : 'icon-next',
				handler : function(){
					DigiCompass.Web.app.changeRequest.saveCancel();
				}
			}],
			items : [Ext.create('DigiCompass.web.UI.ComboBox',{
				margin 	     : '10px 5px 10px 10px',
				name : 'serviceCatalogueHierarchyId',
				id			 : 'serviceCatalogueHierarchyId',
				moduleType : 'MOD_WORK_FLOW',
				labelWidth   : 200,
				moduleCommand : 'COMMAND_QUERY_COMBOX_LIST',
				fieldLabel   : 'Service Catalogue Hierarchy',
				allowBlank   : false,
				editable     : false,
				value : param.serviceCatalogueHierarchyId,
				parseData : function(message){
					var data = Ext.JSON.decode(message['BUSINESS_DATA']['comboList']);
					var d = [];
					for(var i in data){
						d.push([data[i].id, data[i].name]);
					}
					return d;
				},
				listeners : hierarchyEvents
			}),{
				id			 : 'financialCategoryGroup',
				name 		 : 'financialCategoryGroupId',
				margin 	     : '10px 5px 10px 10px',
				xtype	     : 'combo',
				fieldLabel   : 'Financial Catalogue Hierarchy',
				allowBlank   : false,
				displayField : 'name',
				valueField   : 'id',
				labelWidth   : 200,
				value : param.financialCategoryGroupId,
				editable     : false,
				store        : {
					fields : ['id','name'],
					data   : DigiCompass.Web.app.changeRequest.comboData
				},
				listeners : hierarchyEvents
			} ]
		});
		panel.add(siteServiceRef);
		panel.add(sites);
		
		
		if(param.financialCategoryGroupId && param.serviceCatalogueHierarchyId && param.id){
			var params = {
				changeRequestId : param.id
			};
			DigiCompass.Web.app.changeRequest.changeRequestId = param.id;
			siteServiceRef.load(params);
			sites.load(params);
		}
		return panel ;
	}
	
	
	var getGenericListener = function(callback, crId){
		return function(grid, cellElement, columnNum, record,
			rowElement, rowNum, e) {
			if(record.get('groupindex')){
		        return;
		    }
			var dataIndex = grid.getHeaderCt()
				.getHeaderAtIndex(columnNum).dataIndex;
			var tempId =  record.get('sites.services.sows.id');
			if(dataIndex === 'sites.services.sows.requirementName'){
				var readOnly = true;
				if(record.get('sites.services.sows.requirementType') === 'Equipment'){
					readOnly = false;
				}
				cometdfn.request({
					MODULE_TYPE:'MOD_CHANGE_REQUEST',
					COMMAND:'GET_PROCESS_REQUIPMENT',
					changeRequestTempId : crId,
					selection:{checkAll:false,groups:[],selectGroups:[],selections:[tempId]}, 
				}, function(message){
					DigiCompass.Web.app.changeRequest.getSowRequirementWindow(Ext.JSON.decode(message.BUSINESS_DATA), function(eqs, window){
						if(!ServerMessageProcess(message)){
							return;
						}
						var param = {
								MODULE_TYPE : 'MOD_CHANGE_REQUEST',
								COMMAND:'SETTING_PROCESS_EQUIPMENT',
								changeRequestTempId : crId,
								selection:{checkAll:false,groups:[],selectGroups:[],selections:[tempId]}, 
								eqs:eqs};
						cometdfn.request(param, function(msg){
							if(!ServerMessageProcess(msg)){
								return;
							}
							var data = msg.BUSINESS_DATA;
							if(data){
								if(record.get('sites.services.sows.generic') === data.generic){
									record.set('sites.services.sows.requirementName', data.name);
									record.set('sites.services.sows.capex', data.capex);
									record.set('sites.services.sows.opex', data.opex);
								}else{
									callback({});
								}
								window.close();
							}
						});
					}, record.get('sites.services.sows.requirementType'), readOnly, record.get('sites.siteNumber')).show();
					
				});
				
//				Ext.create('DigiCompass.Web.app.equipmentTemplateV2').changeTheEquipment(function(id,name){
//					var param = {
//							MODULE_TYPE : 'MOD_CHANGE_REQUEST',
//							COMMAND:'SETTING_EQUIPMENT',
//							changeRequestTempId : crId,
//							selection:{checkAll:false,groups:[],selectGroups:[],selections:[tempId]}, 
//							erId:id};
//					cometdfn.request(param, function(msg){
//						if(msg.BUSINESS_DATA)
//							callback({});
//					});
//    			})
			}
		};
	}
	
	DigiCompass.Web.app.changeRequest.showEquipmentView = function(id, name){		
//		var siteEquipmentRelFeature = Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping',{
//    		baseWidth:50,
//            groupHeaderTpl: '{disName}'
//          });
			
		var siteEquipmentRef = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid',{
			margin  : '5 10 5 5',
			id:'siteWorkflowRef',
			title : 'Specialised Submissions',
	        collapsible : true,
//	        features: [siteEquipmentRelFeature],
//	        selModel: Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel'), 
	        anchor : '-10 50%-10',
	        autoScroll:true,
//	        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
	        	store: {
	            buffered: true,
	            autoLoad : true,
            	proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_QUERY_ALL_TREE' 
	               		}
	                },
		            extraParams : {
		            	first : true,
		            	option : 'SELECTED',
		            	changeRequestTempId:id
		            },
		            afterRequest : function(response, result){
		            	var record;
		            	if(result && result.success){
							var siteMapArr = [];
							var siteTree = Ext.getCmp('siteWorkflowRef');
							siteTree.param = {
			            		selection:response.selection
			            	}
		            	}
		            }
	            }
	        },
	        multiSelect: true,
	        columns: [],
	        tbar:[{
				xtype : 'button',
				text : 'Equipment',
				handler : function(){
					if(siteEquipmentRef.hasChecked()){
						var sels = siteEquipmentRef.getSelectionStatus();
						cometdfn.request({
							MODULE_TYPE:'MOD_CHANGE_REQUEST',
							COMMAND:'GET_PROCESS_REQUIPMENT',
							changeRequestTempId : id,
							selection: sels, 
						}, function(message){
							if(!ServerMessageProcess(message)){
								return;
							}
							DigiCompass.Web.app.changeRequest.getSowRequirementWindow(Ext.JSON.decode(message.BUSINESS_DATA), function(eqs, window){
								var param = {
										MODULE_TYPE : 'MOD_CHANGE_REQUEST',
										COMMAND:'SETTING_PROCESS_EQUIPMENT',
										changeRequestTempId : id,
										selection: sels, 
										eqs:eqs};
								cometdfn.request(param, function(msg){
									if(!ServerMessageProcess(msg)){
										return;
									}
									if(msg.BUSINESS_DATA){
										siteEquipmentRef.reload({});
										siteEquipmentUnRef.reload({});
										window.close();
									}
								});
							}, 'Equipment').show();
						});
					}
				}
			},{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					siteEquipmentRef.getTarget().features[0].cleanGrouping();
				}
			},{
				xtype : 'button',
				text : 'Refresh',
				handler : function(){
					siteEquipmentRef.reload();
				}
			}], listeners : {
				'cellclick' : getGenericListener(function(param){
					siteEquipmentRef.reload(param);
					siteEquipmentUnRef.reload(param);
				}, id)
			}
		});
		siteEquipmentRef.onGroupSumRender = function(val){
        	var path = 'sites.services';
        	qty = val.data[path+'.quantity'];
        	return 'count='+val.data.groupcount+(Ext.isNumber(qty) ? ', quantity='+ qty : '') +', capex='+(val.data[path+'.capex'] || 0)+', opex='+(val.data[path+'.opex']||0);
        };
		var siteEquipmentUnRef = new DigiCompass.Web.app.grid.MutiGroupGrid({
			margin  : '5 10 5 5',
			id:'siteWorkflowUnRef',
			title : 'Generic Submissions',
	        collapsible : true, 
	        anchor : '-10 50%-10',
	        autoScroll:true,
	        store: {
            	autoLoad : true,
	            buffered: true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_QUERY_ALL_TREE' 
	               		}
	                },
		            extraParams : {
		            	first : true,
		            	option : 'UNSELECTED',
		            	changeRequestTempId:id
		            },
		            afterRequest : function(response, result){
		            	var record;
		            	if(result && result.success){
							var siteMapArr = [];
							var siteTree = Ext.getCmp('siteWorkflowUnRef');
							siteTree.param = {
			            		selection:response.selection
			            	}
		            	}
		            }
	            }
	        },
	        multiSelect: true,
	        columns: [],
	        tbar:[{
				xtype : 'button',
				text : 'Equipment',
				handler : function(){
					if(siteEquipmentUnRef.hasChecked()){
						var sels = siteEquipmentUnRef.getSelectionStatus();
						cometdfn.request({
							MODULE_TYPE:'MOD_CHANGE_REQUEST',
							COMMAND:'GET_PROCESS_REQUIPMENT',
							changeRequestTempId : id,
							selection: sels, 
						}, function(message){
							if(!ServerMessageProcess(message)){
								return;
							}
							DigiCompass.Web.app.changeRequest.getSowRequirementWindow(Ext.JSON.decode(message.BUSINESS_DATA), function(eqs, window){
								var param = {
										MODULE_TYPE : 'MOD_CHANGE_REQUEST',
										COMMAND:'SETTING_PROCESS_EQUIPMENT',
										changeRequestTempId : id,
										selection: sels, 
										eqs:eqs};
								cometdfn.request(param, function(msg){
									if(!ServerMessageProcess(msg)){
										return;
									}
									if(msg.BUSINESS_DATA){
										siteEquipmentRef.reload({});
										siteEquipmentUnRef.reload({});
										window.close();
									}
								});
							}, 'Equipment').show();
						});
					}
				}
			},{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					siteEquipmentUnRef.getTarget().features[0].cleanGrouping();
				}
			},{
				xtype : 'button',
				text : 'Refresh',
				handler : function(){
					siteEquipmentUnRef.reload();
				}
			}], listeners : {'cellclick' : getGenericListener(function(param){
					siteEquipmentRef.reload(param);
					siteEquipmentUnRef.reload(param);
				}, id)
			}
		});
        siteEquipmentUnRef.onGroupSumRender = function(val){
        	var path = 'sites.services';
        	qty = val.data[path+'.quantity'];
        	return 'count='+val.data.groupcount+(qty ? ', quantity='+ qty : '') +', capex='+(val.data[path+'.capex'] || 0)+', opex='+(val.data[path+'.opex']||0);
        };
		var panel = Ext.create('Ext.panel.Panel',{
			title : getSaveTitle(3, name),
			layout : 'anchor',
			items : [siteEquipmentRef,siteEquipmentUnRef],
			tbar  : [{
				xtype : 'button',
				text  : 'Previous',
				iconCls : 'icon-prev',
				handler : function(){
					cometdfn.request({COMMAND:'COMMAND_QUERY_INFO',MODULE_TYPE : 'MOD_CHANGE_REQUEST', tempId : id},
							function(msg){
						var info = Ext.JSON.decode(msg.BUSINESS_DATA);
						cometdfn.request({COMMAND:'COMMAND_PLANNEDSITEINCRT',MODULE_TYPE : 'MOD_CHANGE_REQUEST', changeRequestId : info.id}, 
								function(message){
							
							var param = {id : info.id, name:info.name, descriptor : info.descriptor,
									plannedSites : Ext.JSON.decode(message.BUSINESS_DATA),
									financialCategoryGroupId : info.financialCategoryGroupId,
									serviceCatalogueHierarchyId : info.serviceCatalogueHierarchyId};
							/*var tmp = Ext.JSON.decode(info.step1Scope);
							Ext.apply(param, {
			            		selection:tmp.selection
			            	});*/							
							DigiCompass.Web.app.changeRequest.renderDetailPanel(DigiCompass.Web.app.changeRequest.showNextWorkflowForm(param));
						});
					});
				}
			},{
				xtype : 'button',
				text  : 'Next',
				iconCls : 'icon-next',
				handler : function(){
					DigiCompass.Web.app.changeRequest.review(id, name);
				}
			}, {
				xtype : 'button',
				text  : 'Cancel',
				iconCls : 'icon-next',
				handler : function(){
					DigiCompass.Web.app.changeRequest.saveCancel();
				}
			}]
		});
		DigiCompass.Web.app.changeRequest.renderDetailPanel(panel);
	}
	
	DigiCompass.Web.app.changeRequest.renderDetailPanel = function(panel){
		if(DigiCompass.Web.app.triggering.TriggerCr.popRenderId){
			var renderToId = DigiCompass.Web.app.triggering.TriggerCr.popRenderId;
			Ext.getCmp(renderToId).removeAll();
			Ext.getCmp(renderToId).add(panel);
		} else {
			Ext.getCmp('obj-details').removeAll();
			Ext.getCmp('obj-details').add(panel);
		}
	}
	
	DigiCompass.Web.app.changeRequest.review = function(id, name){
			
		var reviewGrid = new DigiCompass.Web.app.grid.MutiGroupGrid({
			margin  : '5 10 5 5',
			id:'reviewGrid',
//			title : 'Specialised Submissions',
	        collapsible : false,
	        anchor : '-10 -10',
	        autoScroll:true,
	        store: {
	            buffered: true,
	            autoLoad : true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_QUERY_REVIEW' 
	               		}
	                },
		            extraParams : {
		            	changeRequestTempId:id,
		            	first : true
		            }
	            }
	        },
	        multiSelect: true,
	        columns: [],
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					reviewGrid.target.features[0].cleanGrouping();
				}
			},{
				xtype : 'button',
				text : 'Refresh',
				handler : function(){
					reviewGrid.reload();
				}
			}], listeners : {
				'cellclick' : getGenericListener(function(param){
					reviewGrid.reload(param);
				}, id)
			}
		});
		reviewGrid.onGroupSumRender = function(val){
        	var path = 'sites.services';
        	qty = val.data[path+'.quantity'];
        	return 'count='+val.data.groupcount+(Ext.isNumber(qty) ? ', quantity='+ qty : '') +', capex='+(val.data[path+'.capex'] || 0)+', opex='+(val.data[path+'.opex']||0);
        };
		var panel = Ext.create('Ext.panel.Panel',{
			title : getSaveTitle(4, name),
			layout : 'anchor',
			items : [reviewGrid],
			tbar  : [{
				xtype : 'button',
				text  : 'Previous',
				iconCls : 'icon-prev',
				handler : function(){
					DigiCompass.Web.app.changeRequest.showEquipmentView(id, name);
				}
			},{
				xtype : 'button',
				text  : 'Finish',
				iconCls : 'icon-save',
				handler : function(){
					var param = {
							changeRequestTempId : id
					};
					param.COMMAND = 'COMMAND_SAVE_TEMP';
					param.MODULE_TYPE = 'MOD_CHANGE_REQUEST';
					param.SAVE_TYPE = 'COMMAND_SAVE';
					cometdfn.publish(param);
				}
			}, {
				xtype : 'button',
				text  : 'Cancel',
				iconCls : 'icon-next',
				handler : function(){
					DigiCompass.Web.app.changeRequest.saveCancel();
				}
			}]
		});
		DigiCompass.Web.app.changeRequest.renderDetailPanel(panel);
	}
	DigiCompass.Web.app.changeRequest.changeRequestId = null;
	DigiCompass.Web.app.changeRequest.requestGridData = function(message){
		if(typeof window.myMask !== 'undefined'){
			window.myMask.hide();
		}
		if(!ServerMessageProcess(message)){
			return;
		}
		var saveType =  message.BUSINESS_DATA.SAVE_TYPE;
		if(saveType == "SAVE_SITE_EQUIPMENTTEMPLATE_REF"){
			DigiCompass.Web.app.changeRequest.showEquipmentView(message.BUSINESS_DATA.changeRequestTempId, message.name);
		}else if(saveType == 'SAVE_SITE_WORKFLOW_REF'){			
			var changeRequestId = message.BUSINESS_DATA.changeRequestId;
			var params = {
					changeRequestId : changeRequestId
					};
			DigiCompass.Web.app.changeRequest.changeRequestId = changeRequestId;
			Ext.getCmp('siteWorkflowSelected').load(params,{command : 'COMMAND_SITE_WORKFLOW'}, false);
			Ext.getCmp('siteWorkflowUnRef').load(params,{command : 'COMMAND_SITE_WORKFLOW'}, false);
		}else if(saveType == "SAVE_ALL"){
			DigiCompass.Web.app.changeRequest.saveSuccess();
		}
	}
	DigiCompass.Web.app.changeRequest.comboData = [];
	DigiCompass.Web.app.changeRequest.configComboData = function(message){
		var datas = Ext.decode(message.BUSINESS_DATA.financialCategoryList);
		var combo = Ext.getCmp('financialCategoryGroup');
		if(combo){
			combo.getStore().loadData(datas);
		}else{
			DigiCompass.Web.app.changeRequest.comboData = datas;
		}
	}
	DigiCompass.Web.app.changeRequest.regionComboData = [];
	DigiCompass.Web.app.changeRequest.configRegionComboData = function(message){
		var datas = Ext.decode(message.BUSINESS_DATA.list);
		var combo = Ext.getCmp('spectrumRegionCombo');
		if(combo){
			combo.bindStore(DigiCompass.Web.app.plannedSitegroup.getSpectrumRegionComboStore(datas));
		}else{
			DigiCompass.Web.app.changeRequest.regionComboData = datas;
		}
	}
	DigiCompass.Web.app.changeRequest.siteTypeComboData = [];
	DigiCompass.Web.app.changeRequest.configSiteTypeComboData = function(message){
		var datas = Ext.decode(message.BUSINESS_DATA.comboList);
		var combo = Ext.getCmp('siteTypeCombo');
		if(combo){
			combo.bindStore(DigiCompass.Web.app.plannedSitegroup.getSiteTypeComboStore(datas));
		}else{
			DigiCompass.Web.app.changeRequest.siteTypeComboData = datas;
		}
	}
	DigiCompass.Web.app.changeRequest.siteGridStoreLoadData = function(data){
		var oldSites = DigiCompass.Web.app.plannedSitegroup.getAllSite(Ext.getCmp("plannedSiteTree"));
		DigiCompass.Web.app.plannedSitegroup.combineTwoTreeData(data , oldSites);
		Ext.getCmp('plannedSiteTree').getStore().loadData(data);
	}
	DigiCompass.Web.app.changeRequest.saveSuccess = function(data){
		Notification.showNotification('Save Success!');
		if(DigiCompass.Web.app.triggering.TriggerCr.popRenderId){
			Ext.getCmp(DigiCompass.Web.app.triggering.TriggerCr.popRenderId).close();
		} else {
			Ext.getCmp('obj-details').removeAll();
			DigiCompass.Web.app.changeRequest.show(null, null, 'MOD_CHANGE_REQUEST');
		}
	}
	DigiCompass.Web.app.changeRequest.showNotificationDetail = function(message){
		var obj = DigiCompass.Web.app.changeRequest.createGrid(message.id, message.typeKey, message.msg, {}, true);
		if(message.renderTo){
			Ext.getCmp(message.renderTo).add(obj);
		}
	}
	DigiCompass.Web.app.changeRequest.deleteSuccess = function(message){
		var status = message.STATUS;
		if (status === "success") {
			Notification.showNotification('Delete changeRequest Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
//			DigiCompass.Web.UI.CometdPublish.changeRequest(queryParam);
			//cometdfn.request({MODULE_TYPE : "MOD_CHANGE_REQUEST",COMMAND : 'COMMAND_QUERY_LIST',status : null, queryParam:queryParam },DigiCompass.Web.app.changeRequest.getList);
			DigiCompass.Web.app.changeRequest.show(null, null, 'MOD_CHANGE_REQUEST');
			Ext.getCmp('obj-details').removeAll();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	DigiCompass.Web.app.changeRequest.getRequirementGrid = function(requirement, type, readOnly, site){
		var fields = ['name'],
			columns = [{ text: 'Name', 
				dataIndex: 'name', 
				width : 200
			}];
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
		if(type === 'Equipment'){
			for(var i=0; i<requirement.length; i++){
				var instances = requirement[i].instances;
				for(var from in instances){
	        		for(var j=0; j<instances[from].length; j++){
	        			if(Ext.isString(instances[from][j])){
	        				instances[from][j] = {id : instances[from][j]};
	        			}
	        		}
	        	}
			}
			fields.push('instances','qty','from');
			columns.push({ text: 'Quantity', 
				dataIndex: 'qty', 
				editor: {
    				xtype: 'numberfield',
	                allowBlank: false,
	                minValue : 1
	            }
			},{ text: '', 
				xtype : 'actioncolumn',
				align : 'center',
				items : [{
	                icon: 'styles/cmp/images/grid.png',
	                tooltip: 'Change Equipment',
	                handler: function(grid, rowIndex, colIndex, icon, btn,record) {
	                	Ext.create('DigiCompass.Web.app.equipmentTemplateV2').changeEquipmentV3(function(instances){
	                		if(!readOnly){
//		                		record.set('id', id);
//		                		record.set('name', name);
	                			var qty = 0;
	                			for(var i in instances){
	                				qty += instances[i].length;
	                			}
	                			record.set('qty', qty);
	                			record.set('instances', instances);
	                		}
	        			}, record.get('from'),  record.get('instances') || {}, null, site);
	                }
				}]
            });
		}else if(type === 'Text' ){
			fields.push('reg', 'content');
			columns.push({ text: 'Regexp', 
				dataIndex: 'reg'
			});
			if(readOnly){
				columns.push({ text: 'Content', 
					dataIndex: 'content' 
				});
			}else{
				columns.push({ text: 'Content', 
					dataIndex: 'content', 
					editor: {
	    				xtype: 'textfield'
		            }
				});
			}
			columns.push({ text: '', 
				xtype : 'actioncolumn',
                align : 'center',
				items : [{
					icon: 'styles/cmp/images/grid.png',
	                tooltip: 'View',
	                handler: function(grid, rowIndex, colIndex, icon, btn,record) {
	                	promptTextAreaDialog(record.get('name'), record.get('content'), function(content){
	                		record.set('content', content);
	                	}, readOnly, record.get('reg'));
	                }
				}]
            });
		}else if(type === 'Document'){
			fields.push('fileReg', 'filePath');
			columns.push({ text: 'File Type', 
				dataIndex: 'fileReg', 
			},{ text: 'File', 
				dataIndex: 'filePath', 
				renderer : function(val){
					if(val){
						return '<a href = "download?fileName='+val+'" target="_blank">'+val+'</a>';
					}
					return val;
				}
			});
			if(!readOnly){
				columns.push({ text: '', 
					xtype : 'actioncolumn',
	                align : 'center',
					items : [{
						icon: 'styles/cmp/images/image_add.png',
		                tooltip: 'Upload',
		                handler: function(grid, rowIndex, colIndex, icon, btn,record) {
		                	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			            		layout: 'fit',
	            		        width: 500,
	            		        height: 200,
	            		        modal: true,
	            		        closeAction: 'destroy',
	            		        items: {
	            		        	xtype : 'form',
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
	    	    		                fileExt : record.get('fileReg'),
	    	    		                buttonText: '',
	    	    		                vtype : 'fileExt',
	    	    		                buttonConfig: {
	    	    		                   iconCls: 'upload-icon'
	    	    		                }
	    	    		            }],
	            		            buttons: [{
	            		            	text: 'Upload',
	            		                handler: function(){
	            		                	var form = this.up('form').getForm();
	            		                    if(form.isValid()){
	            		                        form.submit({
	            		                        	url: 'upload',
	            		                        	params : { uploadSource : "changeRequest" },
	            		                            waitMsg: 'Uploading your file...',
	            		                            success: function(fp, o) {
	            		                            	record.set('filePath', o.result.fileName);
	            		                            	win.close();
	            		                            },
	            		                            failure: function(form, action){
	            		                            	console.log('upload failure.')
	            		                            }
	            		                        });
	            		                    }
	            		                }
	            		            },{
	            		            	text: 'Cancel',
	            		                handler: function() {
	            		                	win.close();
	            		                }
	            		            }]
	            		        }
			            	});
		                	win.show();
		                }
					}]
	            });
			}
		}else if(type === 'List'){
			var store = Ext.create('Ext.data.JsonStore', {
                fields: ['item'],
                data : [] 
            });
			fields.push('value', 'list');
			columns.push({ text: 'Value', 
				dataIndex: 'value', 
				editor : {
					 xtype: 'combobox',
					 editable : false,
                     store: store,
                     queryMode: 'local',
                     valueField: 'item',
                     displayField: 'item'
				}
			});
			cellEditing.addListener('beforeedit', function(editor, obj){
				var list = obj.record.get('list');
				store.removeAll();
				if(list){
					for(var i=0; i<list.length; i++){
						store.add({item:list[i]});
					}
				}
			});
		}
		var grid = Ext.create('Ext.grid.Panel', {
		    title: 'Items',	
		    anchor : '0 -40',
		    margin : '5px',
		    columns: columns,
		    store : new Ext.data.JsonStore({ 
			    fields: fields,
			    data : requirement
			}),
		    selType: 'cellmodel',
		    plugins: [cellEditing]
		});
		grid.getRequirements = function(){
			var reqs = [], store = grid.getStore();
			for(var i=0; i<store.getCount(); i++){
				reqs.push(store.getAt(i).data);
			}
			return reqs;
		}
		return grid;
	}
	
	DigiCompass.Web.app.changeRequest.getSowRequirementWindow = function(requirement, callback, type, view, site){
		var readOnly = view===true;
		var grid = DigiCompass.Web.app.changeRequest.getRequirementGrid(requirement, type, readOnly, site);
		var form = Ext.create('Ext.form.Panel', {
			items : [{
//				anchor 		 : '0 20%',
				xtype 		 : 'combo',
				fieldLabel   : 'Type ',
				displayField : 'name',
				valueField   : 'id',					
				name		 : 'type',
				readOnly	 : true,
				value		 : type,
				margin 		 : '10px 0px',
				labelAlign	 : 'right',
				store        : {
					fields : ['id','name'],
					data   : [{id:'Text',name:'Text'},
				          {id:'Document',name:'Document'},
				          {id:'Equipment',name:'Equipment'},
				          {id : "List", name : "List"}]
				}
			}, grid]
		});
		var window = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			title  : 'Requirement',
			layout : 'fit',
			width : 700,
			height : 450,
			modal	: true,
			tbar  : [{
				xtype : 'button',
				text  : 'Finish',
				disabled : readOnly,
				handler : function(){
					if(Ext.isFunction(callback)){
						var reqs = grid.getRequirements();
						for(var i=0; i<reqs.length;i++){
							if(type === 'Equipment'){
								var tmp = false, ins = reqs[i].instances;
							    if(ins){
							        for(var key in ins){
							            if(ins.hasOwnProperty(key) && ins[key].length>0){
							                tmp = true;
							                break;
							            }
							        }
    								if(!tmp){
    									console.log('please reselect the '+ (i+1)+' Equipment.');
    									return;
    								}
								}
							}
						}
						callback.apply(form, [reqs, window]);
					}else{
						window.close();
					}
				}
			}],
		});
		window.add(form);
		return window;
	}
})();