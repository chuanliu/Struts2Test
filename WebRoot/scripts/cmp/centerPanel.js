Ext.require([ 'Ext.panel.*', 'Ext.tab.*', 'Ext.window.*', 'Ext.tip.*',
		'Ext.layout.container.Border' ]);
		
Ext.namespace('DigiCompass.Web.UI');		
DigiCompass.Web.UI.createRightPanelFunction = function(){
	var scenarioCenterPanel = Ext.getCmp('scenarioCenterPanelId');
	if(!scenarioCenterPanel){
		var leftPanel = Ext.create('Ext.panel.Panel', {
			id : 'west-panel',
			region : 'west',
			title : 'Existing Scenario Objects',
			split : false,
			width : 250,
			margins : '5 0 5 5',
			maxWidth : 300,
			minWidth : 150,
			autoScroll : true,
			collapsible : true,
			split : true
		});
		
		var centerTopPanel = Ext.create('Ext.form.Panel', {
			region: 'north',
			heigth: 200,
			margins : '0 0 10 0',
	        bodyStyle:'padding:5px',
	        fieldDefaults: {
	            labelAlign: 'left',
	            msgTarget: 'side'
	        },
	        defaults: {
	            anchor: '100%'
	        },
			buttonAlign : 'left',
	        items: [{
	            layout:'column',
	            border:false,
	            items:[{
	                columnWidth:.5,
	                border:false,
	                layout: 'anchor',
	                defaultType: 'textfield',
	                items: [{
	                	 id: "scenarioId",
	                	 xtype: 'hiddenfield',
	                     name: 'scenarioId'
	                },{
	                	id: 'scenarioNameId',
	                    fieldLabel: 'Scenario Name',
	                    name: 'scenarioName',
	                    anchor:'95%',
	                    allowBlank : false,
	                    maxLength : 30
	                }, {
	                	id: 'siteGroupNameId',
	                    fieldLabel: 'SiteGroup',
	                    name: 'siteGroupId',
	                    anchor:'95%',
	                    disabled: false,
	                    readOnly:true
	                }]
	            },{
	                columnWidth:.5,
	                border:false,
	                layout: 'anchor',
	                defaultType: 'textfield',
	                items: [{
	                	id : 'technologyNameId',
	                    fieldLabel: 'Technology',
	                    name: 'technologyId',
	                    anchor:'95%',
	                    disabled: false,
	                    readOnly:true
	                },{
	                	id: 'planningCycleNameId',
	                    fieldLabel: 'Planning Cycle',
	                    name: 'planningCycleId',
	                    anchor:'95%',
	                    disabled: false,
	                    readOnly:true
	                }]
	            }]
	        }],
	         buttons: [{
	         			text: 'Update',handler:function(){
	    					var form = centerTopPanel.getForm();
	    					if(form.isValid()){
	    						var formData = form.getValues();
	    						formData.MODULE_TYPE = 'MOD_SCENARIO';
	    						formData.COMMAND = 'COMMAND_SAVE';
	    						formData.SAVE_TYPE = 'UPDATE';
	    						cometdfn.publish(formData);
	    					}
	         			}	         			
		             }]
	    });
	    
		//-----------------------------------------------------------------------------------------------------Demand
		
	    var centerBottomTabOne = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabOneId',
	    	title:'Demand',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    //-----------------------------------------------------------------------------------------------------Traffic
		
	    var centerBottomTabTwo = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabTwoId',
	    	title:'Traffic',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    //-----------------------------------------------------------------------------------------------------Layers
	    
	    var centerBottomTabThree = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabThreeId',
	    	title:'Layers',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    //-----------------------------------------------------------------------------------------------------Coverage Build
		
	    var centerBottomTabFour = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabFourId',
	    	title:'Coverage Build',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	  //-----------------------------------------------------------------------------------------------------Cost example
	    var centerBottomTabFive = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabFiveId',
	    	title:'Cost',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	  //-----------------------------------------------------------------------------------------------------Output Format
	    var centerBottomTabSix = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabSixId',
	    	title:'Output Capex',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabSeven = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabSevenId',
	    	title:'Output Opex',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabEight = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabEightId',
	    	title:'Output Income',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabNine = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabNineId',
	    	title:'Output Expense',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomTabTen = Ext.create('Ext.panel.Panel',{
	    	id:'centerBottomTabTenId',
	    	title:'Output Recharge',
	    	layout:'vbox',
	    	autoScroll:true,
	    	items:[]
	    });
	    
	    var centerBottomPanel = Ext.create('Ext.tab.Panel',{
	    	id:'centerBottomPanelId',
	        activeTab: 0,
	        height:500,
	        region:'center',
	        defaults:{bodyStyle:'padding:10px'},
	        items:[centerBottomTabOne,centerBottomTabTwo,centerBottomTabThree,
	               centerBottomTabFour,centerBottomTabFive,centerBottomTabSix,
	               centerBottomTabSeven,centerBottomTabEight,centerBottomTabNine,centerBottomTabTen]
	    });
		
		
		var centerPanel = Ext.create('Ext.panel.Panel', {
			id : 'center_panel',
			height : 768,
			margins : '5 5 5 10',
			enableTabScroll : false,
			region : 'center',
			layout : 'border',
			autoScroll : true,
			autoShow : true,
			items : [centerTopPanel,centerBottomPanel]
			,
			listeners: {
	            render: DigiCompass.Web.UI.initializeDropZone
	        }
		});

		scenarioCenterPanel = Ext.create('Ext.panel.Panel', {
			id : 'scenarioCenterPanelId',
			layout : 'border',
			height : 768,
			items : [leftPanel,centerPanel]
		});
	}
	return scenarioCenterPanel;
}

//添加接受拖拽
DigiCompass.Web.UI.initializeDropZone = function(v){
	var centerPanelDropTargetEl =  v.body.dom;
    Ext.create('Ext.dd.DropTarget', centerPanelDropTargetEl, {
        ddGroup: 'treeDDGroup',
        overClass:'drag-target-hover',
        notifyOver: function(ddSource, e, data) {
//        	alert('t');
        	//在此处添加遮罩层，后面来完善
//        	Ext.fly(centerPanelDropTargetEl).addCls('drag-target-hover');
        },
        notifyDrop: function(ddSource, e, data){
        	var records = data.records;
        	if(records && records.length > 0 && records[0]){
        		var record = records[0];
//        		var parentNodeRaw = record.parentNode.raw;
        		var raw = record.raw;
//        		dataId,dataType,leaf,text,data[planningCycleId,siteGroupId,subjectId,tableName]
        		if(!raw.leaf){
        			alertWarring('Please select a valid version!');
        			return true;
        		}
        		//check planningCycle
        		var tempGridData = DigiCompass.Web.app.assembleGrid.getAssembleGridDataFromArray('MOD_SUBSCRIBER_QUANTITY_ID');
            	//获取对象，拿Scenario
        		if(tempGridData){
        			if(raw.data && raw.data.planningCycleId && tempGridData.argumentDatas.planningCycleId != raw.data.planningCycleId){
        				alertWarring('Only same planningCycle version can be moved to scenario!');
        				return true;
        			}
        		}
        		alertOkorCancel('Are you sure to use the vesion ?',function(e){
    				if(e == 'yes'){
    					DigiCompass.Web.UI.moveAndInitGrid(raw);
    				}else{
    					return false;
    				}
    			});
        	}
            return true;
        }
    });
    
    DigiCompass.Web.UI.moveAndInitGrid = function(raw){
    	var tableName = raw.data.tableName;
    	var gridId = DigiCompass.Web.UI.Cmp.TableName.getGridIdByTableName(tableName);
    	if(gridId){
    		var tempGridData = DigiCompass.Web.app.assembleGrid.getAssembleGridDataFromArray(gridId);
        	//获取对象，拿Scenario
    		if(tempGridData){
    			//将拖动参数配置到全局参数中
    			var dragVersionId = raw.dataId;
    			tempGridData.dragArgumentDatas.isDrag = true;
    			tempGridData.dragArgumentDatas.dragVersionId = dragVersionId;
    			tempGridData.dragArgumentDatas.tableName = tableName;
    			//拖动后执行publish
    			DigiCompass.Web.UI.CometdPublish.treeDragPublish(tableName,dragVersionId,tempGridData.argumentDatas,tempGridData.dragArgumentDatas);
    		}
    	}
    }
}