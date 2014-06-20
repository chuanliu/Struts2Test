
Ext.require([ 'Ext.panel.*', 'Ext.tab.*', 'Ext.window.*', 'Ext.tip.*','Ext.data.*','Ext.grid.*','Ext.tree.*','Ext.ux.CheckColumn',
		'Ext.layout.container.Border' ]);

(function(){
	Ext.namespace('DigiCompass.Web.UI.Scenario');

	var EXPLOER_WIDTH = 270;

	var EXPLOER_GROUP_WIDTH = 270;

	var EXPLOER_SWITCH_WIDTH = 600;

	//创建Scenario右面面板
	DigiCompass.Web.UI.Scenario.createScenarioCenterPanel = function(obj){
		var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
		if(!scenarioCenterPanel){
			var centerPanel = Ext.create('Ext.tab.Panel', {
				id:'main_tab',
//			    height: 400,
			    frame : false,
				border : false,
			    region : 'center',
			    tabPosition: 'bottom',
			    items: [],
			    listeners:{
		        	beforetabchange : function(tabPanel,newCard,oldCard,eOpts){
		        		if(newCard.obj){
		        			DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(newCard.obj.tableName || 'SCENARIO',newCard.obj, false);
		        		}else{
		        			DigiCompass.Web.UI.CometdPublish.getVersionDataPublish('SCENARIO',{}, false);
		        		}
//		        		newCard = newCard.front;
//		        		
//		        		//从oldCard中获取活动的tab
//		        		var activeTabId = 'centerBottomTabOneId';
//		        		if(oldCard){
//		        			oldCard = oldCard.front;
//		        			
//		        			//centerBottomTabOneId84B18BA367884BDEAA9CE42FC624F1B6
//		        			var oldScenarioIdStr = oldCard.getActiveTab().id;
//		        			activeTabId = DigiCompass.Web.UI.Scenario.getActiveTabPreId(oldScenarioIdStr);
//		        		}
//		        		if(newCard && newCard.id){
//		        			//centerBottomPanelId84B18BA367884BDEAA9CE42FC624F1B6
//		        			var scenarioId = newCard.id.substr(19);
//		        			newCard.setActiveTab(activeTabId + scenarioId);
//		        		}
		        		
		        	},beforeremove : function(panel){
		        		if(panel.items.length===1){
		        			DigiCompass.Web.UI.CometdPublish.getVersionDataPublish('SCENARIO',{}, false);
		        		}
		        	}
			    }
			});
			
			//外层Contanier
			scenarioCenterPanel = Ext.create('Ext.panel.Panel', {
				id : 'scenarioCenterPanelId',
				layout : 'border',
//				height : 760,
				items : [centerPanel]
			});
		}
		var  tableName = obj.tableName || 'SCENARIO';
		scenarioCenterPanel.setVisible(true);
		//将Scenario添加到Tab标签上
		var tabPanel = Ext.getCmp('main_tab');
//		var tabPanelId = 'centerBottomPanelId'+obj.id;
		var tabPanelId = 'outerTabPanelId'+(tableName === 'SCENARIO' ? '' : tableName) +obj.id || '';
//		var tabPanelId = 'main_ReversalPanel_Id'+obj.id;
		
		var n = tabPanel.getComponent(tabPanelId);
		if(!n) {
			if(tableName!=='SCENARIO'){
				obj.renderCmp = tabPanelId;
				var outerTabPanel = Ext.create('Ext.panel.Panel', {
					id:tabPanelId,
					border : false,
					layout : 'fit',
					frame : true,
					title: DigiCompass.Web.app.ScenarioObjectUtil.getTitle(obj.tableName)+'('+obj.versionName+')',
//					layout : 'vBox',
					closable : true
				});
				outerTabPanel.obj = {
						tableName : obj.tableName,
						scenarioId : obj.scenarioId,
						versionId : obj.versionId,
						planningCycleId : obj.planningCycleId,
						siteGroupId : obj.siteGroupId,
						technologyId : obj.technologyId,
						dragVersionId : obj.dragVersionId,
						siteGroupPlannedId : obj.siteGroupPlannedId
				}
				tabPanel.add(outerTabPanel).show();
				obj.id = Ext.id();
				DigiCompass.Web.app.ScenarioObjectUtil.getGrid(obj);
			}else{
				DigiCompass.Web.UI.Scenario.addTab(tabPanel, obj);
			}
		}
		tabPanel.setActiveTab(tabPanelId);
		
		return scenarioCenterPanel;
	}

	//添加Tab
	DigiCompass.Web.UI.Scenario.addTab = function(tabPanel, obj){
		if(tabPanel.items.length > 10){
			tabPanel.remove(0);
		}
		var panel = DigiCompass.Web.UI.Scenario.createCenterBottomPanel(obj);
		if(panel){
			
//			var obj_details_tbar = Ext.create('Ext.toolbar.Toolbar', {
//			    id: 'obj_details_tbar' + obj.id,
//			    hidden: true,
//			    items: []
//			});
//			
//			var objDetailsPanel = Ext.create('Ext.panel.Panel', {
//				id: 'obj-details'+obj.id,
//				xtype: 'panel',
//				title: '<div align="center">Object Detail</div>',
//				frame: true,
//				border: true,
//				hide: true,
//				width: '100%',
////				bodyStyle: 'background:white;',
//				bodyStyle: 'background:transparent;',
//				tbar:obj_details_tbar,
//				listeners:{
//					afterrender : function(){
////						Ext.getCmp('obj-details').header.addCls('pointer');
////						Ext.getCmp('main_ReversalPanel_Id').setNavigation('testestestestesest12346');
////						Ext.getCmp('main_ReversalPanel_Id').setTitle('<div align="center">Object Detail</div>');
//					}
//				}
//			});
//			
//			objDetailsPanel.navigation = obj_details_tbar;
			
			var vformPanel = new DigiCompass.Web.app.VersionForm({
				edit : false
			});
			
			var reversePanel = new DigiCompass.Web.app.ReversalPanel({
			    id : 'main_ReversalPanel_Id'+obj.id,
//			    title : obj.scenarioName,
			    panelTitle : 'Object Detail - Scenario ('+obj.scenarioName+')',
//			    closable : true,
//				height: 750,
				front : panel,
				back : vformPanel
			});
			
			var args = {};
			args.objId = obj.id;
			args.type = 'Scenario('+obj.scenarioName+')';
			args.uuid = obj.id;
			args.swapPanel = 'main_ReversalPanel_Id'+obj.id;
			DigiCompass.Web.app.navigationBar.removeNavigationBarById(obj.id);
			DigiCompass.Web.app.navigationBar.setNavigationBar(args);
			console.log(args);
//			var naviBarPath = DigiCompass.Web.app.navigationBar.generateNavigationBarPath(obj.id);
//			oldReversePanel.getToolBar('navigation').add(naviBarPath);
//			oldReversePanel.drallModel(title);
//			mainTab.add(oldReversePanel);
			
			var outerTabPanel = Ext.create('Ext.panel.Panel', {
				id:'outerTabPanelId'+obj.id,
				border : false,
				frame : true,
				layout : 'fit',
				title:'Scenario('+obj.scenarioName+')',
				closable : true,
				items: [reversePanel]
			});
			outerTabPanel.obj = {
					tableName : 'SCENARIO',
					versionId : obj.id
			}
			tabPanel.add(outerTabPanel).show();
			
			
			var formArguments = {};
			formArguments.versionId = obj.versionId;
			vformPanel.setValues(formArguments);
			
			
			
//			tabPanel.add(panel).show();
		}
	}

	var isClosing = false;
	//创建单个Scenario Tab需要的容器
	DigiCompass.Web.UI.Scenario.createCenterBottomPanel = function(obj){
		var id = obj.id;
		var scenarioName = obj.scenarioName;
		var siteGroupName = obj.siteGroupName;
		var technologyName = obj.technologyName;
		var planningCycleName = obj.planningCycleName;
		var siteGroupPlannedName = obj.siteGroupPlannedName;
		
//		//-----------------------------------------------------------------------------------------------------Demand
	//
//		var centerBottomTabOne = Ext.create('Ext.panel.Panel',{
//	    	id:'centerBottomTabOneId'+id,
//	    	title:'Demand',
//	    	layout:'vbox',
//	    	autoScroll:true,
//	    	items:[]
//	    });
	//    
//	    //-----------------------------------------------------------------------------------------------------Traffic
	//	
//	    var centerBottomTabTwo = Ext.create('Ext.panel.Panel',{
//	    	id:'centerBottomTabTwoId'+id,
//	    	title:'Traffic',
//	    	layout:'vbox',
//	    	autoScroll:true,
//	    	items:[]
//	    });
	//    
//	    //-----------------------------------------------------------------------------------------------------Layers
	//    
//	    var centerBottomTabThree = Ext.create('Ext.panel.Panel',{
//	    	id:'centerBottomTabThreeId'+id,
//	    	title:'Layers',
//	    	layout:'vbox',
//	    	autoScroll:true,
//	    	items:[]
//	    });
	//    
//	    //-----------------------------------------------------------------------------------------------------Coverage Build
	//	
//	    var centerBottomTabFour = Ext.create('Ext.panel.Panel',{
//	    	id:'centerBottomTabFourId'+id,
//	    	title:'Coverage Build',
//	    	layout:'vbox',
//	    	autoScroll:true,
//	    	items:[]
//	    });
	//    
	//  //-----------------------------------------------------------------------------------------------------Cost example
//	    var centerBottomTabFive = Ext.create('Ext.panel.Panel',{
//	    	id:'centerBottomTabFiveId'+id,
//	    	title:'Cost',
//	    	layout:'vbox',
//	    	autoScroll:true,
//	    	items:[]
//	    });
	    
	  //-----------------------------------------------------------------------------------------------------Output Format
		
	    var centerBottomTabSix = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabSixId'+id,
	    	title:'Output Capex',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabSeven = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabSevenId'+id,
	    	title:'Output Opex',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabEight = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabEightId'+id,
	    	title:'Output Income',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabNine = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabNineId'+id,
	    	title:'Output Expense',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabTen = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabTenId'+id,
	    	title:'Output Recharge',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    
	    var scenarioEditBtn = Ext.create('Ext.Button',{
	    	id:'scenarioEditBtn'+id,
	    	text:'Edit',
	        handler : function() {
	        	Ext.getCmp('scenarioSaveBtn'+id).setDisabled(false);
	        	Ext.getCmp('scenarioEditBtn'+id).setDisabled(true);
	        	
	        	var scenarioSummary = Ext.getCmp('scenarioSummaryId'+id);
	        	if(scenarioSummary){
//	        		scenarioSummary.collapsed = true;
	        	}
	        	
	        	var centerBottomPanel = Ext.getCmp('centerBottomPanelId'+id);
	        	if(centerBottomPanel){
	        		//切换显示内容，Edit时只显示前面5个Tab，Save时只显示后面5个Tab
	        		//移除后面的5个Tab
	        		centerBottomPanel.removeAll();
	        		
	        		
//	        		var centerBottomTabSix = Ext.getCmp('centerBottomTabSixId'+id);
//	        		if(centerBottomTabSix){
//	        			centerBottomTabSix.close();
//	        		}
//	        		var centerBottomTabSeven = Ext.getCmp('centerBottomTabSevenId'+id);
//	        		if(centerBottomTabSeven){
//	        			centerBottomTabSeven.close();
//	        		}
//	        		var centerBottomTabEight = Ext.getCmp('centerBottomTabEightId'+id);
//	        		if(centerBottomTabEight){
//	        			centerBottomTabEight.close();
//	        		}
//	        		var centerBottomTabNine = Ext.getCmp('centerBottomTabNineId'+id);
//	        		if(centerBottomTabNine){
//	        			centerBottomTabNine.close();
//	        		}
//	        		var centerBottomTabTen = Ext.getCmp('centerBottomTabTenId'+id);
//	        		if(centerBottomTabTen){
//	        			centerBottomTabTen.close();
//	        		}
	        		
	        		
	        		
	        		
	        		
	        		//添加前面的5个Tab
	        		var _centerBottomTabOne = Ext.getCmp('centerBottomTabOneId'+id);
	        		if(!_centerBottomTabOne){
	        			var centerBottomTabOne_ = Ext.create('Ext.panel.Panel',{
	        		    	id:'centerBottomTabOneId'+id,
	        		    	title:'Demand',
	        		    	layout:'vbox',
	        		    	autoScroll:true,
	        		    	items:[]
	        		    });
	        			centerBottomPanel.insert(0,centerBottomTabOne_);
	        		}
	        		
	        		var _centerBottomTabTwo = Ext.getCmp('centerBottomTabTwoId'+id);
	        		if(!_centerBottomTabTwo){
	        			var centerBottomTabTwo_ = Ext.create('Ext.panel.Panel',{
	        		    	id:'centerBottomTabTwoId'+id,
	        		    	title:'Traffic',
	        		    	layout:'vbox',
	        		    	autoScroll:true,
	        		    	items:[]
	        		    });
	        			centerBottomPanel.insert(1,centerBottomTabTwo_);
	        		}
	        		
	        		var _centerBottomTabThree = Ext.getCmp('centerBottomTabThreeId'+id);
	        		if(!_centerBottomTabThree){
	        			var panel1 = Ext.create('Ext.panel.Panel');
	        			var panel2 = Ext.create('Ext.panel.Panel');
	        			var panel3 = Ext.create('Ext.panel.Panel');
	        			var panel4 = Ext.create('Ext.panel.Panel');
	        			var panel5 = Ext.create('Ext.panel.Panel');
	        			var centerBottomTabThree_ = Ext.create('Ext.panel.Panel',{
	        		    	id:'centerBottomTabThreeId'+id,
	        		    	title:'Layers',
	        		    	layout:'vbox',
	        		    	autoScroll:true,
	        		    	items:[panel1, panel2, panel3, panel4, panel5]
	        		    });
	        			centerBottomPanel.insert(2,centerBottomTabThree_);
	        		}
	        		
	        		var _centerBottomTabFour = Ext.getCmp('centerBottomTabFourId'+id);
	        		if(!_centerBottomTabFour){
	        			var centerBottomTabFour_ = Ext.create('Ext.panel.Panel',{
	        		    	id:'centerBottomTabFourId'+id,
	        		    	title:'Coverage Build',
	        		    	layout:'vbox',
	        		    	autoScroll:true,
	        		    	items:[]
	        		    });
	        			centerBottomPanel.insert(3,centerBottomTabFour_);
	        		}
	        		
	        		var _centerBottomTabFive = Ext.getCmp('centerBottomTabFiveId'+id);
	        		if(!_centerBottomTabFive){
	        			var centerBottomTabFive_ = Ext.create('Ext.panel.Panel',{
	        		    	id:'centerBottomTabFiveId'+id,
	        		    	title:'Cost',
	        		    	layout:'vbox',
	        		    	autoScroll:true,
	        		    	items:[]
	        		    });
	        			centerBottomPanel.insert(4,centerBottomTabFive_);
	        		}
	        		centerBottomPanel.setActiveTab(0);
	        	}
			}
		});
	    
	    var scenarioSaveBtn = Ext.create('Ext.Button',{
	    	id:'scenarioSaveBtn'+id,
	    	text:'Run',
	    	disabled:true,
	        handler : function() {
	        	//显示Scenario List View
//	        	DigiCompass.Web.UI.Scenario.switchPanelReturn();
//	        	DigiCompass.Web.UI.Scenario.groupPanelReturn();
	        	
	        	Ext.getCmp('obj-cat').setVisible(false);
//				Ext.getCmp('obj-cat').removeAll();
				var switchPanelCenter = Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID');
				if(switchPanelCenter){
					switchPanelCenter.setVisible(false);
//					switchPanelCenter.removeAll();
				}
				var groupGrid = Ext.getCmp('groupGridId');
				if(groupGrid){
					groupGrid.setVisible(false);
//					groupGrid.removeAll();
				}
				var objExp = Ext.getCmp('obj-exp');
				objExp.setWidth(EXPLOER_WIDTH);
				var scenarioView = Ext.getCmp('scenarioViewId');
				scenarioView.setVisible(true);
				
				
	        	
	        	Ext.getCmp('scenarioEditBtn'+id).setDisabled(false);
	        	Ext.getCmp('scenarioSaveBtn'+id).setDisabled(true);
	        	
	        	var scenarioSummary = Ext.getCmp('scenarioSummaryId'+id);
	        	if(scenarioSummary){
//	        		scenarioSummary.collapsed = false;
	        	}
	        	
	        	
	        	
	        	var centerBottomPanel = Ext.getCmp('centerBottomPanelId'+id);
	        	if(centerBottomPanel){
	        		//切换显示内容，Edit时只显示前面5个Tab，Save时只显示后面5个Tab
	        		centerBottomPanel.removeAll();
	        		
	        		
	        		
	        		
//	        		var centerBottomTabOne = Ext.getCmp('centerBottomTabOneId'+id);
//	        		if(centerBottomTabOne){
//	        			centerBottomTabOne.close();
//	        		}
//	        		
//	        		var centerBottomTabTwo = Ext.getCmp('centerBottomTabTwoId'+id);
//	        		if(centerBottomTabTwo){
//	        			centerBottomTabTwo.close();
//	        		}
//	        		
//	        		var centerBottomTabThree = Ext.getCmp('centerBottomTabThreeId'+id);
//	        		if(centerBottomTabThree){
//	        			centerBottomTabThree.close();
//	        		}
//	        		
//	        		var centerBottomTabFour = Ext.getCmp('centerBottomTabFourId'+id);
//	        		if(centerBottomTabFour){
//	        			centerBottomTabFour.close();
//	        		}
//	        		
//	        		var centerBottomTabFive = Ext.getCmp('centerBottomTabFiveId'+id);
//	        		if(centerBottomTabFive){
//	        			centerBottomTabFive.close();
//	        		}
	        		
	        		
	        		
	        		
	        		
	        		var _centerBottomTabSix = Ext.getCmp('centerBottomTabSixId'+id);
	            	if(!_centerBottomTabSix){
	            		var centerBottomTabSix_ = Ext.create('Ext.panel.Panel',{
	            	    	id:'centerBottomTabSixId'+id,
	            	    	title:'Output Capex',
	            	    	layout:'vbox',
	            	    	autoScroll:true,
	            	    	items:[]
	            	    });
	            		centerBottomPanel.insert(0,centerBottomTabSix_);
	            	}
	            	var _centerBottomTabSeven = Ext.getCmp('centerBottomTabSevenId'+id);
	            	if(!_centerBottomTabSeven){
	            		var centerBottomTabSeven_ = Ext.create('Ext.panel.Panel',{
	            	    	id:'centerBottomTabSevenId'+id,
	            	    	title:'Output Opex',
	            	    	layout:'vbox',
	            	    	autoScroll:true,
	            	    	items:[]
	            	    });
	            		centerBottomPanel.insert(1,centerBottomTabSeven_);
	            	}
	            	var _centerBottomTabEight = Ext.getCmp('centerBottomTabEightId'+id);
	            	if(!_centerBottomTabEight){
	            		var centerBottomTabEight_ = Ext.create('Ext.panel.Panel',{
	            	    	id:'centerBottomTabEightId'+id,
	            	    	title:'Output Income',
	            	    	layout:'vbox',
	            	    	autoScroll:true,
	            	    	items:[]
	            	    });
	            		centerBottomPanel.insert(2,centerBottomTabEight_);
	            	}
	            	var _centerBottomTabNine = Ext.getCmp('centerBottomTabNineId'+id);
	            	if(!_centerBottomTabNine){
	            		 var centerBottomTabNine_ = Ext.create('Ext.panel.Panel',{
	             	    	id:'centerBottomTabNineId'+id,
	             	    	title:'Output Expense',
	             	    	layout:'vbox',
	             	    	autoScroll:true,
	             	    	items:[]
	             	    });
	            		centerBottomPanel.insert(3,centerBottomTabNine_);
	            	}
	            	var _centerBottomTabTen = Ext.getCmp('centerBottomTabTenId'+id);
	        		if(!_centerBottomTabTen){
	        			 var centerBottomTabTen_ = Ext.create('Ext.panel.Panel',{
	              	    	id:'centerBottomTabTenId'+id,
	              	    	title:'Output Recharge',
	              	    	layout:'vbox',
	              	    	autoScroll:true,
	              	    	items:[]
	              	    });
	        			centerBottomPanel.insert(4,centerBottomTabTen_);
	        		}
	        		centerBottomPanel.setActiveTab(0);
	        	}
			}
		});
	    
	    var scenarioExportBtn = Ext.create('Ext.Button',{
	    	id:'scenarioExportBtn'+id,
	    	text:'Export',	    	
	        handler : function() {
	        	window.location.href = "download?exportType=0&scenarioId="+id;
	        }
		});
	    
	    var scenarioSummary = Ext.create('Ext.form.Panel', {
			id:'scenarioSummaryId'+id,
			heigth: 200,
			margins : '5 0 5 5',
			title : '<div align="center">Scenario Summary</div>',
	        bodyStyle:'padding:5px',
	        collapsible : true,
	        border : false,
	        fieldDefaults: {
	            labelAlign: 'left',
	            msgTarget: 'side'
	        },
	        defaults: {
	            anchor: '100%'
	        },
	        width : '100%',
	        items: [{
	        	border:false,
	            layout:'column',
	            items:[{
	                columnWidth:.5,
	                border:false,
	                layout: 'anchor',
	                defaultType: 'displayfield',
	                items: [{
	                	id: 'scenarioNameId'+id,
	                    fieldLabel: 'Scenario Name',
	                    name: 'scenarioName',
	                    allowBlank : false,
	                    value: scenarioName,
	                    anchor:'95%',
	                    xtype: 'textfield',
	                    maxLength : UiProperties.nameMaxLength,
	                    allowBlank : false
	                }, {
	                	id: 'siteGroupNameId'+id,
	                    fieldLabel: 'SiteGroup',
//	                    name: 'siteGroupId',
	                    value:siteGroupName,
	                    anchor:'95%',
	                    readOnly:true
	                },{id: 'plannedSiteGroupName'+id,
	                    fieldLabel: 'Planned SiteGroup Name',
//	                    name: 'siteGroupId',
	                    value:siteGroupPlannedName,
	                    anchor:'95%',
	                    readOnly:true}]
	            },{
	                columnWidth:.5,
	                border:false,
	                layout: 'anchor',
	                defaultType: 'displayfield',
	                items: [{
	                	id : 'technologyNameId'+id,
	                    fieldLabel: 'Technology',
//	                    name: 'technologyId',
	                    value:technologyName,
	                    anchor:'95%',
	                    readOnly:true
	                },{
	                	id: 'planningCycleNameId'+id,
	                    fieldLabel: 'Planning Cycle',
//	                    name: 'planningCycleId',
	                    value: planningCycleName,
	                    anchor:'95%',
	                    readOnly:true
	                }]
	            },{
	                xtype: 'hiddenfield',
	                name: 'scenarioId',
	                value: id
	            }]
	        }],buttons: [{
     			text: 'Update',handler:function(){
					var form = scenarioSummary.getForm();
					if(form.isValid()){
						var formData = form.getValues();
						formData.MODULE_TYPE = 'MOD_SCENARIO';
						formData.COMMAND = 'COMMAND_UPDATE';
						cometdfn.publish(formData);
					}
     			}	         			
             }]
	    });
	    
	    var tbar = Ext.create('Ext.toolbar.Toolbar',{
			items : [scenarioEditBtn,scenarioSaveBtn]
		});
	    
	    var obj_details_tbar = Ext.create('Ext.toolbar.Toolbar', {
		    id: 'obj_details_tbar' + obj.id,
		    hidden: true,
		    items: []
		});
	    
	    
	    var centerBottomPanel = Ext.create('Ext.tab.Panel',{
	    	id:'centerBottomPanelId'+id,
//	    	title:scenarioName,
//	    	title: '<div align="center">Object Details('+scenarioName+')</div>',
//	    	panelTitle : 'testest',
	        activeTab: 0,
	        tabPosition: 'bottom',
	        border: true,
//	        layout:'fit',
//	        region:'center',
	        width:'100%',
//	        height:500,
//	        closable:true,
	        defaults:{bodyStyle:'padding:10px'},
//	        tbar:[scenarioEditBtn,scenarioSaveBtn],
	        tbar : {xtype: 'container',items: [obj_details_tbar,scenarioSummary,tbar]},
	        items:[
//	               centerBottomTabOne,centerBottomTabTwo,centerBottomTabThree,
//	               centerBottomTabFour,centerBottomTabFive,
	               centerBottomTabSix,
	               centerBottomTabSeven,centerBottomTabEight,centerBottomTabNine,centerBottomTabTen],
	        listeners:{
	        	beforetabchange : function(tabPanel,newCard,oldCard,eOpts){
	        		var tabPanelId = tabPanel.id;
	        		if(tabPanelId){
	        			//centerBottomPanelId84B18BA367884BDEAA9CE42FC624F1B6
	        			var scenarioId = tabPanelId.substr(19);
	        			var temp = DigiCompass.Web.app.assembleListView.getScenarioDataArry(scenarioId);
	            		if(temp){
	            			var arguments = temp.arguments;
	            			var newCardId = newCard.id;
	            			DigiCompass.Web.UI.Scenario.initGridDataByTab(newCardId,scenarioId,arguments);
	            		}
	        		}
	        	},
	        	beforeremove : function(){
	    			isClosing = true;
	    		},
	    		afterrender : function(){
//					Ext.getCmp('obj-details').header.addCls('pointer');
//	    			var  main_ReversalPanel_Id = 'main_ReversalPanel_Id'+obj.id;
//	    			
//	    			var args = {};
//	    			args.id = obj.id;
//	    			args.name = 'scenario';
//	    			DigiCompass.Web.app.navigationBar.setNavigationBarArray(args);
//	    			var navigation = DigiCompass.Web.app.navigationBar.generateNavigationBarStr(obj.id);
//	    			
//					Ext.getCmp(main_ReversalPanel_Id).setNavigation(navigation);
//					
//					var newTitle = DigiCompass.Web.app.navigationBar.setObjectDetail('Scenario('+scenarioName+')');
//					Ext.getCmp(main_ReversalPanel_Id).setTitle(newTitle);
				}
	        }
	    });
	    
	    centerBottomPanel.navigation = obj_details_tbar;
	    
	    return centerBottomPanel;
	}


	DigiCompass.Web.UI.Scenario.getActiveTabPreId = function(idstr){
		var centerBottomTabOneId = idstr.indexOf('centerBottomTabOneId');
		var centerBottomTabTwoId = idstr.indexOf('centerBottomTabTwoId');
		var centerBottomTabThreeId = idstr.indexOf('centerBottomTabThreeId');
		var centerBottomTabFourId = idstr.indexOf('centerBottomTabFourId');
		var centerBottomTabFiveId = idstr.indexOf('centerBottomTabFiveId');
		var centerBottomTabSixId = idstr.indexOf('centerBottomTabSixId');
		var centerBottomTabSevenId = idstr.indexOf('centerBottomTabSevenId');
		var centerBottomTabEightId = idstr.indexOf('centerBottomTabEightId');
		var centerBottomTabNineId = idstr.indexOf('centerBottomTabNineId');
		var centerBottomTabTenId = idstr.indexOf('centerBottomTabTenId');
		if(centerBottomTabOneId != -1){
			return 'centerBottomTabOneId';
		}else if(centerBottomTabTwoId != -1){
			return 'centerBottomTabTwoId';
		}else if(centerBottomTabThreeId != -1){
			return 'centerBottomTabThreeId';
		}else if(centerBottomTabFourId != -1){
			return 'centerBottomTabFourId';
		}else if(centerBottomTabFiveId != -1){
			return 'centerBottomTabFiveId';
		}else if(centerBottomTabSixId != -1){
			return 'centerBottomTabSixId';
		}else if(centerBottomTabSevenId != -1){
			return 'centerBottomTabSevenId';
		}else if(centerBottomTabEightId != -1){
			return 'centerBottomTabEightId';
		}else if(centerBottomTabNineId != -1){
			return 'centerBottomTabNineId';
		}else if(centerBottomTabTenId != -1){
			return 'centerBottomTabTenId';
		}
		return 'centerBottomTabOneId';
	}

	DigiCompass.Web.UI.Scenario.initGridDataByTab = function(newCardId,scenarioId,arguments){
		var centerBottomTabOneId = newCardId.indexOf('centerBottomTabOneId');
		var centerBottomTabTwoId = newCardId.indexOf('centerBottomTabTwoId');
		var centerBottomTabThreeId = newCardId.indexOf('centerBottomTabThreeId');
		var centerBottomTabFourId = newCardId.indexOf('centerBottomTabFourId');
		var centerBottomTabFiveId = newCardId.indexOf('centerBottomTabFiveId');
		var centerBottomTabSixId = newCardId.indexOf('centerBottomTabSixId');
		var centerBottomTabSevenId = newCardId.indexOf('centerBottomTabSevenId');
		var centerBottomTabEightId = newCardId.indexOf('centerBottomTabEightId');
		var centerBottomTabNineId = newCardId.indexOf('centerBottomTabNineId');
		var centerBottomTabTenId = newCardId.indexOf('centerBottomTabTenId');
		
		
		if(centerBottomTabOneId != -1){
			arguments.renderCmp = "centerBottomTabOneId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initDemandGrids(scenarioId,arguments);
		}else if(centerBottomTabTwoId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabTwoId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initTrafficGrids(scenarioId,arguments);
		}else if(centerBottomTabThreeId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabThreeId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initLayersGrids(scenarioId,arguments);
		}else if(centerBottomTabFourId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabFourId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initCoverageBuildGrids(scenarioId,arguments);
		}else if(centerBottomTabFiveId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabFiveId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initCostGrids(scenarioId,arguments);
		}else if(centerBottomTabSixId != -1){
			arguments.renderCmp = "centerBottomTabSixId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initOutputCapexGrids(scenarioId,arguments);
		}else if(centerBottomTabSevenId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabSevenId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initOutputOpexGrids(arguments);
		}else if(centerBottomTabEightId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabEightId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initOutputIncomeGrids(arguments);
		}else if(centerBottomTabNineId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabNineId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initOutputExpenseGrids(arguments);
		}else if(centerBottomTabTenId != -1 && !isClosing){
			arguments.renderCmp = "centerBottomTabTenId"+arguments.scenarioId;
			DigiCompass.Web.app.assembleListView.initOutputRechargeGrids(arguments);
		}
		
		isClosing = false;
	}

	DigiCompass.Web.app.assembleListView.initDemandGrids = function(scenarioId,arguments){
		arguments = DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_DATA_QTY',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_SUBSCRIBER_QUANTITY','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_DATA_BH_KBPS',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_BHKBPS','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_DATA_BH_MERL',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_BHMERL','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_SPEC_REGION_DIST',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_SPEC_REGION_DIST','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_REGION_PROP',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_REGION','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_GLBOAL_PRO',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_GLOBAL','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_ACCE_OFFLOAD',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_TRAFFIC_DEMAND_CALC','COMMAND_QUERY_GRID',arguments);	
	}

	DigiCompass.Web.app.assembleListView.initTrafficGrids = function(scenarioId,arguments){
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TRAFFIC_SITELOAD_CALCULATING_PERIOD',arguments);
		DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodPublish(arguments.versionId,scenarioId,arguments);
		
		DigiCompass.Web.Cmp.TrafficCalc.refreshFlexView(Ext.apply(arguments, {title : 'CMP - Site Load Sharing Ratio', moduleType : 'MOD_TRAFFIC_CALC', command : 'COMMAND_QUERY_GRID'}));
		
		DigiCompass.Web.Cmp.TrafficCalc.refreshFlexView(Ext.apply(arguments, {title : 'Site BH Traffic Growth Forecast', moduleType : 'MOD_TRAFFIC_GROWTH', command : 'COMMAND_QUERY_GRID'}));
		
//		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_TRAFFIC_GROWTH','COMMAND_QUERY_GRID',arguments);
	}

	DigiCompass.Web.app.assembleListView.initLayersGrids = function(scenarioId,arguments){
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_LAYER_DEFINITION',arguments);
		Digicompass.web.cmp.layer.LayerDefainition.refreshLayerDefinitionGrid(arguments);
//		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REGION_LAYER','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_LAYER_PRIORITY',arguments);
		Digicompass.web.cmp.layer.RegionLayer.refresh(arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_LAYER_BAND_COUNT','COMMAND_QUERY_GRID',arguments);
		//DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_PRIORITY_BAND_COUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_LAYER_CAPACITY_BAND_COUNT','COMMAND_QUERY_GRID',arguments);
//		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_SITE_LAYER_FORECAST','COMMAND_QUERY_GRID',arguments);
//		DigiCompass.Web.app.assembleGrid.refreshGrid('COMETD_MODULE_TYPE_SITE_LAYER_FORECAST_MOD','COMMAND_QUERY_GRID',arguments);
//		DigiCompass.Web.app.assembleGrid.refreshGrid('COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_MOD','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.Cmp.TrafficCalc.refreshFlexView(Ext.apply(arguments, 
				{title : 'Site Layer forecast', moduleType : 'COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST_MOD', command : 'COMMAND_QUERY_GRID'}));
		
	}

	DigiCompass.Web.app.assembleListView.initCoverageBuildGrids = function(scenarioId,arguments){
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COV_SITE_BUILD_QTY',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_COVERAGE_BUILD_QUANTITY','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COVERAGE_REGION_PROP',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_COVERAGE_BUILD_REGION_PROPERTIES','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_COVERAGE_BUILD_CALCULATIONS','COMMAND_QUERY_GRID',arguments);
		
//		DigiCompass.Web.app.assembleGrid.refreshGrid('COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST','COMMAND_QUERY_GRID',arguments);		
		
		DigiCompass.Web.Cmp.TrafficCalc.refreshFlexView(Ext.apply(arguments, 
				{title : 'Site Layer forecast', moduleType : 'COMETD_MODULE_TYPE_COVERAGE_BUILD_FORECAST', command : 'COMMAND_QUERY_GRID'}));
	}

	DigiCompass.Web.app.assembleListView.initCostGrids = function(scenarioId,arguments){
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COST_BAND_UPGRADE',arguments);
		Digicompass.web.cmp.cost.bandUpgrade.refresh(arguments);
//		Digicompass.web.cmp.cost.bandIntroduction.refresh(arguments);
		arguments = Ext.clone(arguments);
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COST_CAPACITY_BUILD',arguments);
		Digicompass.web.cmp.cost.costCapacityBuild.refresh(arguments);
		arguments = Ext.clone(arguments);
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COST_COVERAGE_BUILD',arguments);
		Digicompass.web.cmp.cost.costCoverageBuild.refresh(arguments, true);
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COST_COVERAGE_UNPLANNED_BUILD',arguments);
		Digicompass.web.cmp.cost.costCoverageBuild.refresh(arguments, false);
	}

	DigiCompass.Web.app.assembleListView.initOutputCapexGrids = function(scenarioId,arguments){
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_DATA_QTY',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT','COMMAND_QUERY_GRID',arguments);
		
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_UPGRADE','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_UPGRADE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_CAPACITY_QTY','COMMAND_QUERY_GRID',arguments);		
		
		DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COV_SITE_BUILD_QTY',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_AMOUNT_PLANNED','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_CAPEX_TOTAL','COMMAND_QUERY_GRID',arguments);
	}

	DigiCompass.Web.app.assembleListView.initOutputOpexGrids = function(arguments){
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_UPGRADE_OPEX_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_CAPACITY_OPEX_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_OPEX_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_OPEX_AMOUNT_PLANNED','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_OPEX_TOTAL','COMMAND_QUERY_GRID',arguments);
	}

	DigiCompass.Web.app.assembleListView.initOutputIncomeGrids = function(arguments){
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_UPGRADE_INCOME_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_CAPACITY_INCOME_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_INCOME_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_INCOME_AMOUNT_PLANNED','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_INCOME_TOTAL','COMMAND_QUERY_GRID',arguments);
	}

	DigiCompass.Web.app.assembleListView.initOutputExpenseGrids = function(arguments){
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_UPGRADE_EXPENSE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_CAPACITY_EXPENSE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_EXPENSE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_EXPENSE_AMOUNT_PLANNED','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_EXPENSE_TOTAL','COMMAND_QUERY_GRID',arguments);
	}

	DigiCompass.Web.app.assembleListView.initOutputRechargeGrids = function(arguments){
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_UPGRADE_RECHARGE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_GROWTH_CAPACITY_RECHARGE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_RECHARGE_AMOUNT','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_RECHARGE_AMOUNT_PLANNED','COMMAND_QUERY_GRID',arguments);
		DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_RECHARGE_TOTAL','COMMAND_QUERY_GRID',arguments);
	}
	
	DigiCompass.Web.app.assembleListView.getVersionIdFromScenario = function(tableName,scenario){
		var versionId = '';
		if(tableName === 'TB_STG_DATA_QTY'){
			versionId = scenario.demandSubscriberQuantity ? scenario.demandSubscriberQuantity.id : '';
		}else if(tableName === 'TB_STG_DATA_BH_KBPS'){
			versionId = scenario.demandBusyHourKbps ? scenario.demandBusyHourKbps.id : '';
		}else if(tableName === 'TB_STG_DATA_BH_MERL'){
			versionId = scenario.demandBusyHourMillierlang ? scenario.demandBusyHourMillierlang.id : '';
		}else if(tableName === 'TB_STG_SPEC_REGION_DIST'){
			versionId = scenario.demandSpectrumRegionDistrabution ? scenario.demandSpectrumRegionDistrabution.id : '';
		}else if(tableName === 'TB_STG_REGION_PROP'){
			versionId = scenario.demandSpectrumRegionProperties ? scenario.demandSpectrumRegionProperties.id : '';
		}else if(tableName === 'TB_STG_GLBOAL_PRO'){
			versionId = scenario.demandGlobalProperties ? scenario.demandGlobalProperties.id : '';
		}else if(tableName === 'TB_STG_ACCE_OFFLOAD'){
			versionId = scenario.demandWebAcceleratorOffload ? scenario.demandWebAcceleratorOffload.id : '';
		}else if(tableName === 'TB_STG_COV_SITE_BUILD_QTY'){
			versionId = scenario.coverageBuildUnplannedQuantyForecast ? scenario.coverageBuildUnplannedQuantyForecast.id : '';
		}else if(tableName === 'TB_STG_COVERAGE_REGION_PROP'){
			versionId = scenario.coverageBuildSpectrumRegionProperties ? scenario.coverageBuildSpectrumRegionProperties.id : '';
		}else if(tableName === 'TB_STG_COST_BAND_UPGRADE'){
			versionId = scenario.costSameBandUpgrade ? scenario.costSameBandUpgrade.id : '';
		}else if(tableName === 'TB_STG_COST_CAPACITY_BUILD'){
			versionId = scenario.costNewCapacityBuild ? scenario.costNewCapacityBuild.id : '';
		}else if(tableName === 'TB_STG_COST_COVERAGE_BUILD'){
			versionId = scenario.costNewCoveragePlannedBuild ? scenario.costNewCoveragePlannedBuild.id : '';
		}else if(tableName === 'TB_STG_COST_COVERAGE_UNPLANNED_BUILD'){
			versionId = scenario.costNewCoverageUnplannedBuild ? scenario.costNewCoverageUnplannedBuild.id : '';
		}else if(tableName === 'TB_STG_LAYER_DEFINITION'){
			versionId = scenario.layerDefinition ? scenario.layerDefinition.id : '';
		}else if(tableName === 'TB_STG_LAYER_PRIORITY'){
			versionId = scenario.layerPriority ? scenario.layerPriority.id : '';
		}else if(tableName === 'TRAFFIC_SITELOAD_CALCULATING_PERIOD'){
			versionId = scenario.trafficSiteLoadCalculatingPeriod ? scenario.trafficSiteLoadCalculatingPeriod.id : '';
		}
		return versionId;
	}


	DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups = function(scenarioId,tableName,arguments){
		arguments.tableName = tableName;
		var tempScenarioData = DigiCompass.Web.app.assembleListView.getScenarioDataArry(scenarioId);
		if(tempScenarioData && tempScenarioData.scenario){
			var versionId = DigiCompass.Web.app.assembleListView.getVersionIdFromScenario(tableName,tempScenarioData.scenario);
			arguments.versionId = versionId;
			return arguments;
			
//			DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_DATA_QTY',arguments);
//			DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT','COMMAND_QUERY_GRID',arguments);
//			
//			DigiCompass.Web.app.assembleListView.getVerionIdFromScenarioVersionLookups(scenarioId,'TB_STG_COV_SITE_BUILD_QTY',arguments);
//			DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_COVERAGE_AMOUNT','COMMAND_QUERY_GRID',arguments);
//			DigiCompass.Web.app.assembleGrid.refreshGrid('MOD_REPORT_CAPEX_TOTAL','COMMAND_QUERY_GRID',arguments);
		}
		arguments.versionId = '';
		arguments.versionName = '';
		return arguments;
	}

	DigiCompass.Web.UI.Scenario.scenarioDetailClickFn = function(data){
		var tree = Ext.decode(data.BUSINESS_DATA.data);
		var tableName = data.tableName;
		
		//处理数据
		var columnHeader = ["version"];
		
		/**
		 * 当在Scenario Detail中执行编辑操作时，自动将Object Exploer中的Grid自动切换成相应的Group Detail
		 * 切换时，之前的Scenario ListView只是隐蔽不消毁，当切换回来时再重新展现出来。
		 */
		var objExp = Ext.getCmp('obj-exp');
//		var scenarioView = Ext.getCmp('scenarioViewId');
//		if(scenarioView){
			objExp.setWidth(EXPLOER_GROUP_WIDTH);
			//scenarioView.setVisible(false);          
			
//			var switchPanel = Ext.getCmp('group_switch_panel_id');
//			if(switchPanel){
//				switchPanel.setVisible(false);
//			}
			Ext.getCmp('obj-cat').setVisible(false);
			Ext.getCmp('obj-cat').removeAll();
			Ext.getCmp("scenarioExplorer").setVisible(false);
			Ext.getCmp("scenarioDetail").setVisible(false);
			if(Ext.getCmp("obj-cat")){
				Ext.getCmp("obj-cat").setVisible(false);
			}
			/*var switchPanelCenter = Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID');
			if(switchPanelCenter){
				switchPanelCenter.removeAll();
				switchPanelCenter.destroy();
			}*/
			
			var versionview = Ext.getCmp('groupGridId');
			if(versionview){
				versionview.destroy();
			}
			try{
				versionview = new DigiCompass.Web.app.VersionView({
					id : 'groupGridId',
					treeNode : tree, 
					tableName : data.tableName, 
					versionId : data.versionId || null,
					scenarioId : data.scenarioId || null,
					technologyId : data.technologyId || null,
					planningCycleId : data.planningCycleId || null,
					siteGroupPlannedId : data.siteGroupPlannedId || null,
					siteGroupId : data.siteGroupId || null});
				Ext.getCmp('obj-exp').add(versionview);
			}catch(e){
				console.log(e.message, e.stack, e);
			}
			
//			DigiCompass.Web.UI.Scenario.createScenarioGroupDragView(true);
//		}
	}

	/*DigiCompass.Web.UI.Scenario.createScenarioGroupDragView = function(isFresh){
		//创建列头信息
		var columnsInfo = DigiCompass.Web.UI.Scenario.assembleColumn(columnHeader);
		
		var restaurants = Ext.create('Ext.data.JsonStore', {
		    fields: columnsInfo.fields,
		    data: datas
		});
		
		var groupGrid = Ext.getCmp('groupGridId');
		if(groupGrid){
			groupGrid.destroy();
//			groupGrid.setVisible(true);
//			if(isFresh){
//				groupGrid.getStore().loadData(datas);
//			}
		}
		//else{
			var sm = Ext.create('Ext.selection.CheckboxModel', {
				checkOnly : false
			});
			
			var searchField = Ext.create('Ext.ux.form.SearchField',{
				store: restaurants,
				width: 200
			});
			
			var btn_clear = Ext.create('Ext.Button',{
				text:'Clear Grouping',
	            handler : function(a,b,c,d) {
	                features.cleanGrouping();
				}
			});
			
			var btn_switch = Ext.create('Ext.Button',{
				text:'Switch Style',
		        handler : function(){
		        	var grouperItems = features.grid.store.groupers.items;
		        	if(grouperItems.length == 0){
		        		alertWarring('Please select a group!')
		        		return;
		        	}
		        	//拼装信息
		        	var groupers = [];
		        	for(var i=0,num=grouperItems.length;i<num;i++){
		        		groupers.push(grouperItems[i].property);
		        	}
		        	DigiCompass.Web.UI.Scenario.switchPanel(groupers);
		        }
			});
			
			var btn_return = Ext.create('Ext.Button',{
				text:'Return',
		        handler : DigiCompass.Web.UI.Scenario.groupPanelReturn
			});
			
			var tbar = Ext.create('Ext.toolbar.Toolbar',{
				items : ['Search: ',' ', searchField]
			});
			
			var tbar2 = Ext.create('Ext.toolbar.Toolbar',{
				items : [btn_clear,btn_switch,btn_return]
			});
			
			var features =  Ext.create('Ext.grid.feature.MultiGroupingSummary',{
				baseWidth:50,
		        groupHeaderTpl: '{disName}'
		      });
			
			var groupGrid = Ext.create('Ext.grid.Panel', {
				id: 'groupGridId',
			    collapsible: false,
			//    iconCls: 'icon-grid',
			    frame: false,
				height : 705,
			    store: restaurants,
				features:features,
//				title : 'Object Explorer',
			    resizable: false,
//			    selModel : sm,
			    columns: columnsInfo.columns,
//				tbar : {xtype: 'container',items: [tbar,tbar2]},
				tbar : tbar2,
				viewConfig : {
					 plugins: {
		                  ptype: 'gridviewdragdrop',
		                  enableDrag: true,
		                  enableDrop: false,
		                  dragGroup: 'gridDDGroup'
		            }
				}
			});
			
			Ext.getCmp('obj-exp').add(groupGrid);
		//}
	}

	DigiCompass.Web.UI.Scenario.assembleColumn = function(columnHeader) {
		var columnsInfo = {};
		var columns = [];
		var fields = [];
		for (var i = 0; i < columnHeader.length; i++) {
			var column = {};
			column.sortable = true;
			column.header = columnHeader[i];
			column.dataIndex = columnHeader[i];
			columns.push(column);
			fields.push(columnHeader[i]);
		}
		columnsInfo.columns = columns;
		columnsInfo.fields = fields;
		return columnsInfo;
	}*/

	DigiCompass.Web.UI.Scenario.groupPanelReturn = function(){
		var objExp = Ext.getCmp('obj-exp');
		var scenarioView = Ext.getCmp('scenarioViewId');
		Ext.getCmp("scenarioExplorer").setVisible(true);
		var groupGrid = Ext.getCmp('groupGridId');
		if(groupGrid){
			groupGrid.setVisible(false);
		}
		if(scenarioView){
			
			
//			objExp.setWidth(EXPLOER_WIDTH);
			
//			scenarioView.setVisible(true);
		}
	}

	DigiCompass.Web.UI.Scenario.switchPanel = function(groupers){
		var groupGrid = Ext.getCmp('groupGridId');
		var objExp = Ext.getCmp('obj-exp');
		if(objExp && groupGrid){
			objExp.setWidth(EXPLOER_SWITCH_WIDTH);
			groupGrid.setVisible(false);
			
			DigiCompass.Web.UI.Scenario.switchPanelCreatePanel(columnHeader,groupers,datas);
		}
	}

	DigiCompass.Web.UI.Scenario.switchPanelReturn = function(){
		var objExp = Ext.getCmp('obj-exp');
		if(objExp){
//			var switchPanel = Ext.getCmp('group_switch_panel_id');
//			if(switchPanel){
//				switchPanel.setVisible(false);
//			}
			Ext.getCmp('obj-cat').setVisible(false);
			Ext.getCmp('obj-cat').removeAll();
			
			var switchPanelCenter = Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID');
			if(switchPanelCenter){
				switchPanelCenter.setVisible(false);
				switchPanelCenter.removeAll();
			}
			
			objExp.setWidth(EXPLOER_GROUP_WIDTH);
			
			DigiCompass.Web.UI.Scenario.createScenarioGroupDragView(false);
		}
	}

	DigiCompass.Web.UI.Scenario.switchPanelCreatePanel = function(columnHeader,groupers,datas){
		//创建列头信息
		var columnsInfo = DigiCompass.Web.UI.Scenario.assembleColumn(columnHeader);
		
		//克隆数据
		var cloneDatas = Ext.clone(datas);
		
		//将Grid数据转换为Tree
		var tempData = DigiCompass.Web.Util.convertToFolderTree(groupers,columnHeader[columnHeader.length-1], cloneDatas);
		
		//创建TreeStore
		var treeStore = Ext.create('Ext.data.TreeStore', {
//			fields: columnsInfo.fields,
	        root: {
				expanded: false,  
	            children: tempData
			},
			folderSort: true
	    });
		
//		var switchPanel = Ext.getCmp('group_switch_panel_id');
//		if(switchPanel){
//			switchPanel.removeAll();
//		}
		var switchPanelCenter = Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID');
		if(switchPanelCenter){
			switchPanelCenter.removeAll();
		}
		
//		if(switchPanel){
//			switchPanel.setVisible(true);
//			var switchPanelLeft = Ext.getCmp('group_switch_panel_left_id');
//			if(switchPanelLeft){
////				switchPanelLeft.reconfigure(treeStore, columnsInfo.columns);
//			}
//			Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID').removeAll();
//		}else{
		    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
		
		
		    var switchPanel_Left = Ext.create('Ext.tree.Panel', {
		    	id : 'group_switch_panel_left_id',
//		        title: 'Catalogue',
//		        region : 'west',
//		        useArrows: true,
		        rootVisible: false,
		        store: treeStore,
		        multiSelect: true,
//		        width : 250,
				maxWidth : 400,
				minWidth : 100,
				autoScroll : true,
				height: 700,
//				collapsible : true,
				frame : false,
				border : false,
//		        singleExpand: true,
//		        columns: columnsInfo.columns,
//		        viewConfig : {
//					 plugins: {
//		                  ptype: 'treeviewdragdrop',
//		                  enableDrag: true,
//		                  enableDrop: false,
//		                  dragGroup: 'gridDDGroup'
//		            }
//				},
		        listeners: {
		        	itemclick : function(view,record,item,index,e,eOpts){
		        		
//		        		var tempArr = record.raw.childrenDataArray;
//		        		for(var i=0;i<tempArr.length;i++){
//		        			var tempData = tempArr[i];
//		        			var obj = {};
//			        		obj.id = tempData.versionId;
//			        		obj.Lod_Panel_Title = tempData.Version;
//			        		obj.Lod_List_Panel_Data = tempData;
//			        		obj.Lod_List_Panel_Fields = columnsInfo.fields;
//			        		obj.Lod_List_Panel_Columns = columnsInfo.columns;
//			        		
//			        		DigiCompass.Web.UI.Scenario.createLodPanel(obj);
//		        		}
		        		
		        		
		        		
		        		
		        		//移除之前Panel中的Grid
//		        		Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID').removeAll();
		        		
		        		var raw = record.raw;
		        		
		        		//获取信息，执行publish方法
		        		var datas = {};
		        		datas.versionId = raw.versionId;
						datas.planningCycleId = raw.planningCycleId;
//						datas.scenarioId = raw.scenarioId;
						datas.technologyId = raw.technologyId;
						datas.siteGroupId = raw.siteGroupId;
						datas.queryType = "1";
						datas.versionName = raw.Version;
						
						var moduleType = DigiCompass.Web.UI.Cmp.TableName.getModuleTypeByTableName(raw.tableName);
						if(moduleType){
							//执行查询
							var command = 'COMMAND_QUERY_GRID';
							DigiCompass.Web.app.assembleGrid.refreshGrid(moduleType,command,datas);
						}
		        	}
		        }
		    }); 
		    switchPanel_Left.on('checkchange', function(node, checked) {      
				checkchild(node,checked);  
				checkparent(node); 
				
				//将选中的项添加剂到右边面板中
				var childrenDataArray = node.raw.childrenDataArray;
				if(childrenDataArray){
					for(var i=0;i<childrenDataArray.length;i++){
						var tempData = childrenDataArray[i];
						if(!checked){
							DigiCompass.Web.UI.Scenario.removeLodPanel(tempData.versionId);
						}else{
							var obj = {};
			        		obj.id = tempData.versionId;
			        		obj.Lod_Panel_Title = tempData.Version;
			        		obj.Lod_List_Panel_Data = tempData;
			        		obj.Lod_List_Panel_Fields = columnsInfo.fields;
			        		obj.Lod_List_Panel_Columns = columnsInfo.columns;
			        		obj.Lod_Panel_Directory_Series = 1;
			        		
			        		DigiCompass.Web.UI.Scenario.createLodPanel(obj);
						}
					}
				}
				
				
		    });  
		    function checkchild(node,checked){  
		        node.eachChild(function(child) {
					if(child.childNodes.length>0){
						checkchild(child,checked);//递归  
				    }  
				    child.data.checked = checked;
				    child.commit();
				});
		    }  
		    function checkparent(node){
				if(!node){
					return false;
				}
				var parentNode = node.parentNode;  
				if(parentNode !== null) {
					var isall=true;  
				  	parentNode.eachChild(function(n){  
						if(!n.data.checked){
							isall=false;  
						}
					});
				  	parentNode.data.checked = isall;
				  	parentNode.commit();
				}
			 	checkparent(parentNode);//递归  
			};  
			
			// 显示Catalogue
			Ext.getCmp('obj-cat').setVisible(true);
			Ext.getCmp('obj-cat').add(switchPanel_Left);
			
			
			var switchPanel_Center = Ext.create('Ext.panel.Panel', {
				id : 'GROUP_SWITCH_PANEL_CENTER_ID',
				title : 'Data Preview',
				autoScroll : true,
				height : 700,
				frame : false,
				border : false,
				layout:'vbox',
				bodyStyle: 'background:white;',
				items:[],
				tbar : [{
				        	text : 'Return',
				        	handler : function(){
				        		DigiCompass.Web.UI.Scenario.switchPanelReturn();	
				        	}
				        }]
			});
			
			Ext.getCmp('obj-exp').add(switchPanel_Center);
//		}
	}

	// 移除LOD
	DigiCompass.Web.UI.Scenario.removeLodPanel = function(id){
//		var cmpId = 'Lod_Panel_ID_'+id;
		var cmpId = 'Lod_List_Panel_ID_'+id;
		var Lod_Panel = Ext.getCmp(cmpId);
		if(Lod_Panel){
			Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID').remove(Lod_Panel,true);
		}
	}


	// 创建LOD
	DigiCompass.Web.UI.Scenario.createLodPanel = function(obj){
		var id = obj.id;
		var cmpId = 'Lod_Panel_ID_'+id;
		var moreBtnId = 'Lod_Panel_More_ID_'+id;
		var preBtnId = 'Lod_Panel_Pre_ID_'+id;
		var Lod_Panel_Title = obj.Lod_Panel_Title;
		var Lod_List_Panel_Fields = obj.Lod_List_Panel_Fields;
		var Lod_List_Panel_Columns = obj.Lod_List_Panel_Columns;
		var Lod_List_Panel_Data = obj.Lod_List_Panel_Data;
		var Lod_Panel_Directory_Series = obj.Lod_Panel_Directory_Series;
		var current_Directory_Series = 0;
		
		var Lod_Panel = Ext.getCmp(cmpId);
		
		var tempPanel = Ext.getCmp('Lod_List_Panel_ID_'+id);
		if(tempPanel){
			
			
			
		}else{
			
			var Lod_List_Panel_Store = Ext.create('Ext.data.JsonStore', {
				fields : Lod_List_Panel_Fields,
				data : Lod_List_Panel_Data
			});
			
			var preBtn = Ext.create('Ext.Button',{
				id:preBtnId,
				hidden:true,
				text:'<<',
				handler:function(){
					current_Directory_Series--;
					var lodPanel = Ext.getCmp(cmpId);
					if(lodPanel && lodPanel.items && lodPanel.items.items){
						var item = lodPanel.items.items;
						lodPanel.remove(item[item.length-1],true);
					}
					if(current_Directory_Series == 0){
						preBtn.setVisible(false);
					}
					if(current_Directory_Series < Lod_Panel_Directory_Series){
						moreBtn.setVisible(true);
					}
				}
			});
			
			var moreBtn = Ext.create('Ext.Button',{
				id:moreBtnId,
				text:'>>',
				handler:function(){
					current_Directory_Series++;
					if(current_Directory_Series == 1){
						var raw = Lod_List_Panel_Data;
		        		//获取信息，执行publish方法
		        		var datas = {};
		        		datas.versionId = raw.versionId;
						datas.planningCycleId = raw.planningCycleId;
//						datas.scenarioId = raw.scenarioId;
						datas.technologyId = raw.technologyId;
						datas.siteGroupId = raw.siteGroupId;
						datas.queryType = "1";
						datas.versionName = raw.Version;
						
						var moduleType = DigiCompass.Web.UI.Cmp.TableName.getModuleTypeByTableName(raw.tableName);
						if(moduleType){
							//执行查询
							var command = 'COMMAND_QUERY_GRID';
							DigiCompass.Web.app.assembleGrid.refreshGrid(moduleType,command,datas);
						}
					}
					if(current_Directory_Series > 0){
						preBtn.setVisible(true);
					}
					if(current_Directory_Series == Lod_Panel_Directory_Series){
						moreBtn.setVisible(false);
					}
				}
			});
			
			var Lod_List_Panel = Ext.create('Ext.grid.Panel', {
				id : 'Lod_List_Panel_ID_'+id,
			    title: Lod_Panel_Title,
			    store: Lod_List_Panel_Store,
			    columns: Lod_List_Panel_Columns,
			    margins : '5 5 5 5',
				width: '100%',
				viewConfig : {
					 plugins: {
		                  ptype: 'gridviewdragdrop',
		                  enableDrag: true,
		                  enableDrop: false,
		                  dragGroup: 'gridDDGroup'
		            }
				}
			});

//			Lod_Panel = Ext.create('Ext.panel.Panel', {
//				id : 'Lod_Panel_ID_'+id,
//				title : Lod_Panel_Title,
//				autoScroll : true,
//				frame : false,
//				collapsible : true,
//				margins : '10 10 10 10',
//				width: '100%',
//				border : true,
//				layout:'vbox',
//				closable:true,
//				bodyStyle: 'background:white;',
//				items:[Lod_List_Panel],
//				bbar : [{xtype:'tbfill'},preBtn,moreBtn]
//			});
			
			
//			Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID').add(Lod_Panel);
			Ext.getCmp('GROUP_SWITCH_PANEL_CENTER_ID').add(Lod_List_Panel);
		}
	}
})()


