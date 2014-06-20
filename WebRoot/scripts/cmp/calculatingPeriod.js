Ext.require([ 'Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.panel.*' ]);

(function(){
	var period = Ext.namespace('Digicompass.web.cmp.demand.period');
	
	var SAVE_HANDLER = 'SAVE';
	var SAVE_AS_HANDLER = 'SAVE_AS';
	
	var periodObjArray = new Array();
	period.getPeriodObjArray = function(id){
		for(var i = 0 ; i < periodObjArray.length ; i++){
			if(periodObjArray[i].id === id){
				return periodObjArray[i];
			}
		}
		return null;
	}
	
	period.setPeriodObj = function(id,start,end){
		var obj = period.getPeriodObjArray(id);
		if(obj){
			obj.start = start;
			obj.end = end;
		}
	}
	
	period.createPanel = function(data){
		if(data.STATUS === 'error'){
			console.log('trafficshare calculate period data STATUS is error!')
			return ;
		}
		
		var result = data.BUSINESS_DATA,
		    periodObj = Ext.isEmpty(result.period) ? null : Ext.JSON.decode(result.period),
		    technologies = Ext.JSON.decode(result.technologies),
		    techInfo = Ext.JSON.decode(result.techInfo),
		    versionId = data.versionId,
		    scenarioId = data.scenarioId,
		    dragVersionId = data.dragVersionId;
		
		if(techInfo && techInfo.length == 0){
			return;
		}
		
		var formatDate2 = d3.time.format("%Y-%m-%d %H:%M:%S");
		
		var dragObj = {};
		dragObj.start = periodObj != null ? formatDate2.parse(periodObj.start) : null;
		dragObj.end = periodObj != null ? formatDate2.parse(periodObj.end) : null;
		
		var tempPeriodObj = period.getPeriodObjArray(scenarioId);
		if(tempPeriodObj){
			tempPeriodObj.start = dragObj.start;
			tempPeriodObj.end = dragObj.end;
			tempPeriodObj.dragVersionId = dragVersionId;
			tempPeriodObj.isDrag = Ext.isEmpty(dragVersionId) ? false : true;
			if(!tempPeriodObj.isDrag){
				tempPeriodObj.versionId = versionId;
			}
		}else{
			tempPeriodObj = {};
			tempPeriodObj.id = scenarioId;
			tempPeriodObj.start = dragObj.start;
			tempPeriodObj.end = dragObj.end;
			tempPeriodObj.versionId = versionId;
//			tempPeriodObj.dragVersionId = dragVersionId;
//			tempPeriodObj.isDrag = Ext.isEmpty(dragVersionId) ? false : true;
			periodObjArray.push(tempPeriodObj);
		}
		
		var selectedTechName = createTechNameArr(periodObj,technologies);
		if(selectedTechName && selectedTechName.length === 0){
			selectedTechName = createTechNameArr(null,technologies);
		}
		
		var title = 'Traffic Site Load Calculating Period ';
		if(periodObj && periodObj.version) title += "(" + periodObj.version + ")"
		
		var renderCmp = data.renderCmp;
//		var renderCmp = 'centerBottomTabTwoId' + scenarioId;
		
//		var id = 'calculatingPeriodId' + scenarioId;
		var id = data.id;
		if(!id){
			id = 'calculatingPeriodId' + scenarioId;
		}
		
//		var svg_container_id = 'svg-container-' + scenarioId;
//		var vformPanel_Id = 'vformPanel_' + scenarioId;
		
		var svg_container_id = 'svg-container-' + id;
		var vformPanel_Id = 'vformPanel_' + id;
		var reversalPanel_id = 'reversalPanel_' + id;
		
		var calculatingPeriod = Ext.getCmp(id);
		if(calculatingPeriod){
			var reversalPanelCmp = Ext.getCmp(reversalPanel_id);
			reversalPanelCmp.setTitle(title);
			
			var eventBtn = Ext.getCmp('edit_' + id);
			if(eventBtn && !eventBtn.isVisible()){
				DigiCompass.Web.app.navigationBar.resetNavigationBarTitle(scenarioId,title)
    			var naviBarPath = DigiCompass.Web.app.navigationBar.generateNavigationBarPath(scenarioId);
				reversalPanelCmp.setNavigation(naviBarPath);
			}
			
			var vformPanel = Ext.getCmp(vformPanel_Id);
			if(vformPanel){
				var formArguments = {};
				formArguments.versionName = result['versionName'];
				formArguments.versionId = result['versionId'];
				formArguments.comment = result['comment'];
				vformPanel.setValues(formArguments);
			}
			
//			var temp_grid = Ext.getCmp(id);
//			temp_grid.setTitle(title);
			
			initTechnologies(svg_container_id,periodObj);
			
			dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,true);
			
			//处理TabPanel被Remove后Grid没有被销毁不能重现展现问题
			var hasExist = false;
			var tempCmp = Ext.getCmp(renderCmp);
			if(tempCmp){
				var items = tempCmp.items.items;
				var len = items.length;
				if(len > 0){
					for(var i=0;i<len;i++){
						if(items[i].id == id){
							hasExist = true;
						}
					}
				}
			}
			if(!hasExist){
				if(Ext.getCmp(renderCmp)){
//					Ext.getCmp(renderCmp).add(temp_grid);
				}
			}
		}else{
			//Save
			var saveBtn = Ext.create('Ext.Button', {
			    text: 'Save',
			    tooltip:'Save or update current version!',
			    handler: function() {
			    	var tempPeriod = period.getPeriodObjArray(scenarioId);
			    	if(!tempPeriod){
			    		return;
			    	}
			    	var techJson = getCheckedTechnologyJson(svg_container_id,technologies);
			    	var currentVersionId = '';
					if(tempPeriod.isDrag && tempPeriod.dragVersionId){
						currentVersionId = tempPeriod.dragVersionId;
					}else{
						currentVersionId = tempPeriod.versionId;
					}
					var formatDate_date = d3.time.format("%Y-%m-%d");
			    	period.savePeriod(SAVE_HANDLER,scenarioId,currentVersionId,formatDate_date(tempPeriod.start),formatDate_date(tempPeriod.end),techJson,id,renderCmp);
			    }
			});
			
			//Save As
			var saveAsBtn = Ext.create('Ext.Button', {
			    text: 'Save As',
			    tooltip:'Save as a new version!',
			    handler: function() {
			    	var tempPeriod = period.getPeriodObjArray(scenarioId);
			    	if(!tempPeriod) return;
			    	var techJson = getCheckedTechnologyJson(svg_container_id,technologies);
			    	var currentVersionId = '';
					if(tempPeriod.isDrag && tempPeriod.dragVersionId){
						currentVersionId = tempPeriod.dragVersionId;
					}else{
						currentVersionId = tempPeriod.versionId;
					}
			    	var formatDate_date = d3.time.format("%Y-%m-%d");
			    	period.savePeriod(SAVE_AS_HANDLER,scenarioId,currentVersionId,formatDate_date(tempPeriod.start),formatDate_date(tempPeriod.end),techJson,id,renderCmp);
			    }
			});
			
			//Remove
			var dropBtn = Ext.create('Ext.Button', {
				text: 'Remove',
				handler: function(){
					var tempPeriod = period.getPeriodObjArray(scenarioId);
					if(!tempPeriod) return;
					if(tempPeriod.isDrag && tempPeriod.dragVersionId){
						return alertWarring("Current version come from left grid,you cann't remove it!");
					}
					//check current version is or not delete
					Ext.MessageBox.show({
		                title: 'Message',
				        msg: "Are you sure to remove the data?",
				        width:300,
				        buttons: Ext.MessageBox.YESNO,
				        fn: function(e) {
				        	if(e == 'yes') {
				        		DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodRemovePublish(tempPeriod.versionId,scenarioId);
				        	}
				        },
				        icon : Ext.MessageBox.QUESTION
		          });
					
				}
			});
			
			//Reset
			var resetBtn = Ext.create('Ext.Button', {
				text: 'Reset',
				handler: function(){
					Ext.MessageBox.show({
		                title: 'Message',
				        msg: "Are you sure to reset the grid?",
				        width:300,
				        buttons: Ext.MessageBox.YESNO,
				        fn: function(e) {
				        	if(e == 'yes') {
				        		var tempPeriod = period.getPeriodObjArray(scenarioId);
						    	if(!tempPeriod) return;
						    	var datas = {};
								datas.versionId = data.versionId;
								datas.planningCycleId = data.planningCycleId;
								datas.siteGroupPlannedId = data.siteGroupPlannedId;
								datas.scenarioId = data.scenarioId;
								datas.technologyId = data.technologyId;
								datas.siteGroupId = data.siteGroupId;
								datas.renderCmp = data.renderCmp;
								datas.id = data.id;
								
				        		DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodPublish(tempPeriod.versionId,scenarioId,datas);
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
			    	var tempPeriod = period.getPeriodObjArray(scenarioId);
			    	if(!tempPeriod) return;
			    	var datas = {};
					datas.versionId = data.versionId;
					datas.planningCycleId = data.planningCycleId;
					datas.siteGroupPlannedId = data.siteGroupPlannedId;
					datas.scenarioId = data.scenarioId;
					datas.technologyId = data.technologyId;
					datas.siteGroupId = data.siteGroupId;
					datas.renderCmp = data.renderCmp;
					datas.id = data.id;
					
			    	DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodPublish(tempPeriod.versionId,scenarioId,datas);
			    }
			});
			
			//从历史数据中采集
//			var historyVersionBtn = Ext.create('Ext.Button', {
//			    text: 'Versions',
//			    handler: function() {
//			    	DigiCompass.Web.UI.CometdPublish.getVersionDataPublish('TRAFFIC_SITELOAD_CALCULATING_PERIOD',{
//			    		planningCycleId: data.planningCycleId,
//		    			scenarioId:  data.planningCycleId,
//		    			siteGroupId:  data.siteGroupId,
//		    			technologyId:  data.technologyId,
//		    			versionId:  data.versionId
//			    	});
//			    }
//			});
			
			//Edit
			var editBtn = Ext.create('Ext.Button', {
				id:'edit_' + id,
			    text: 'Edit',
			    tooltip:'edit current version!',
			    handler: function() {
			    	var mainTab = Ext.getCmp('outerTabPanelId'+scenarioId);
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
			    		
			    		mainTab.removeAll(false);
			    		
			    		var oldReversePanel = Ext.getCmp(reversalPanel_id);
			    		if(oldReversePanel){
			    			var args = {};
			    			args.objId = scenarioId;
			    			args.type = title;
			    			args.uuid = versionId;
			    			args.swapPanel = reversalPanel_id;
			    			args.parentId = oldReversePanel.ownerCt.id;
			    			args.itemIndex = oldReversePanel.ownerCt.items.indexOf(oldReversePanel);
			    			args.eventBtnId = 'edit_' + id;
//			    			args.oldWidth = oldReversePanel.getWidth();
//			    			args.oldHeight = oldReversePanel.getHeight();
			    			
			    			DigiCompass.Web.app.navigationBar.setNavigationBar(args);
			    			var naviBarPath = DigiCompass.Web.app.navigationBar.generateNavigationBarPath(scenarioId);
			    			oldReversePanel.setNavigation(naviBarPath);
			    			oldReversePanel.drallModel(title);
			    			oldReversePanel.toFront();
			    			
			    			//设置Position
//			    			oldReversePanel.doLayout();
//			    			oldReversePanel.setPosition(0,0);
			    			
			    			mainTab.add(oldReversePanel);
//			    			oldReversePanel.setPosition(0,0);
//			    			mainTab.doLayout();
			    			oldReversePanel.setPosition(0,0);
			    			oldReversePanel.reSetSize(mainTab.getWidth()-10,mainTab.getHeight()-10);
			    			
			    			/**
			    			 * hidden Edit
			    			 */
			    			var eventBtn = Ext.getCmp('edit_' + id);
							if(eventBtn) eventBtn.setVisible(false);
			    			
			    			/**
			    			 * fire Versions
			    			 */
							DigiCompass.Web.UI.CometdPublish.getVersionDataPublish('TRAFFIC_SITELOAD_CALCULATING_PERIOD',{
					    		planningCycleId: data.planningCycleId,
				    			scenarioId:  data.planningCycleId,
				    			siteGroupId:  data.siteGroupId,
				    			technologyId:  data.technologyId,
				    			versionId:  data.versionId
					    	});
			    		}
			    	}
			    }
			});
			
			var html = '<div id="'+svg_container_id+'">' + createTechnlogyForm(technologies,periodObj,scenarioId) + '</div>';
			
			var btntbar = Ext.create('Ext.toolbar.Toolbar', {
			    items: [saveBtn,saveAsBtn,dropBtn,resetBtn,refreshBtn,editBtn]
			});
			
			calculatingPeriod = Ext.create('Ext.panel.Panel', {
				id: id,
				width: '100%',
				height: 500,
				border: false,
				autoScroll: true,
				html: html,
			    listeners: {
			    	afterrender : function(a,b){
			    		if(d3.select("#selDateDiv" + scenarioId)) d3.select("#selDateDiv" + scenarioId).empty();
			    		if(Ext.getCmp("startDateDivSel" + scenarioId)) Ext.getCmp("startDateDivSel" + scenarioId).remove()
			    		if(Ext.getCmp("endDateDivSel" + scenarioId)) Ext.getCmp("endDateDivSel" + scenarioId).remove()
			    		if(Ext.getCmp("forStartEndPanelId" + scenarioId)) Ext.getCmp("forStartEndPanelId" + scenarioId).remove()
			    		
			    		var maxD = new Date(d3.max(techInfo, function(d){ return d.date; }))
			    		maxD = new Date(maxD.getTime() - 8*3600000)
			    		var minD = new Date(d3.min(techInfo, function(d){ return d.date; }))
			    		minD = new Date(minD.getTime() - 8*3600000)
			    		var formatDate = d3.time.format("%Y-%m-%d");
			    		
						Ext.create('Ext.panel.Panel', {
							id : 'forStartEndPanelId' + scenarioId,
							border: false,
							renderTo : "selDateDiv" + scenarioId,
							items : [{
								xtype: 'datefield',
								allowBlank : false,
								labelWidth: 70,
								fieldLabel : '<b>StratDate</b>',
								format : 'Y-m-d',
								id : 'startDateDivSel' + scenarioId,
								listeners : {
									select : function(scope, newVal, val){
										var tmp = newVal;
										if(newVal.getTime() < minD.getTime()){
											tmp = minD;
										}else if(dragObj.end && newVal.getTime() > dragObj.end.getTime()){
											if(newVal.getTime() > maxD.getTime()){
												tmp = dragObj.end;
											}else{
												dragObj.end = tmp;
												Ext.getCmp('endDateDivSel' + scenarioId).setValue(formatDate(tmp));
											}
										}
										dragObj.start = tmp;
										scope.setValue(formatDate(tmp));
										dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,false);
									}
									,change : function(s, v){
										if(dragObj.needChangeS && typeof v != "string"){
											if(v.getTime() > minD.getTime()-1 && dragObj.end && v.getTime() < dragObj.end.getTime()+1){
												dragObj.start = v;
												dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,false);
											}
										}
									}
									,blur : function(s){
										dragObj.needChangeS = false;
										var v = s.value;
										if(typeof v != "string" && v.getTime() > minD.getTime()-1 && dragObj.end && v.getTime() < dragObj.end.getTime()+1){
										
										}else if(dragObj.end && v.getTime() > dragObj.end.getTime() && v.getTime() < maxD.getTime()+1){
											dragObj.start = v;
											s.setValue(formatDate(v))
											dragObj.end = v;
											Ext.getCmp("endDateDivSel" + scenarioId).setValue(formatDate(v))
										}else if(s.defaultDateV && typeof s.defaultDateV != "string" && s.defaultDateV.getTime() > minD.getTime()-1 
												&& dragObj.end && s.defaultDateV.getTime() < dragObj.end.getTime()+1){
											dragObj.start = s.defaultDateV;
											s.setValue(formatDate(s.defaultDateV))
										}else{
											dragObj.start = minD;
											s.setValue(formatDate(minD))
										}
										dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,false);
									}
									,focus : function(s){
										s.defaultDateV = s.value;
										dragObj.needChangeS = true;
									}
								}
							},{
								xtype: 'datefield',
								allowBlank : false,
								labelWidth: 70,
								fieldLabel : '<b>EndDate</b>',
								format : 'Y-m-d',
								id : 'endDateDivSel' + scenarioId,
								listeners : {
									select : function(scope, newVal, val){
										var tmp = newVal;
										if(newVal.getTime() > maxD.getTime()){
											tmp = maxD;
										}else if(dragObj.start && newVal.getTime() < dragObj.start.getTime()){
											if(newVal.getTime() < minD.getTime()){
												tmp = dragObj.start;
											}else{
												dragObj.start = tmp;
												Ext.getCmp("startDateDivSel" + scenarioId).setValue(formatDate(tmp))
											}
										}
										dragObj.end = tmp;
										scope.setValue(formatDate(tmp));
										dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,false);
									}
									,change : function(s, v){
										if(dragObj.needChangeE && typeof v != "string"){
											if(v.getTime() < maxD.getTime()+1 && dragObj.start && v.getTime() > dragObj.start.getTime()-1){
												dragObj.end = v;
												dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,false);
											}
										}
									}
									,blur : function(s){
										dragObj.needChangeE = false;
										var v = s.value;
										if(typeof v != "string" && v.getTime() < maxD.getTime()+1 && dragObj.start && v.getTime() > dragObj.start.getTime()-1){
										
										}else if(dragObj.start && v.getTime() < dragObj.start.getTime() && v.getTime() > minD.getTime()-1){
											dragObj.end = v;
											s.setValue(formatDate(v));
											dragObj.start = v;
											Ext.getCmp("startDateDivSel" + scenarioId).setValue(formatDate(v));
										}else if(s.defaultDateV && typeof s.defaultDateV != "string" && s.defaultDateV.getTime() < maxD.getTime()+1 
												&& dragObj.start && s.defaultDateV.getTime() > dragObj.start.getTime()-1){
											dragObj.end = s.defaultDateV;
											s.setValue(formatDate(s.defaultDateV))
										}else{
											dragObj.end = maxD;
											s.setValue(formatDate(maxD))
										}
										dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,false);
									}
									,focus : function(s){
										s.defaultDateV = s.value;
										dragObj.needChangeE = true;
									}
								}
							}]
						})
						
						dragSvg(techInfo,id,scenarioId,dragObj,technologies,selectedTechName,true);
			    	}
			    }
			});
//			Ext.getCmp(renderCmp).add(calculatingPeriod);
			
			var vformPanel = new DigiCompass.Web.app.VersionForm({
				id : vformPanel_Id
			});
			
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
				id : reversalPanel_id,
				panelTitle : title,
				front : calculatingPeriod,
				showNavigation : data.showNavigation || false,
				width: '100%',
				margin: '0 0 0 5',
				height: 500,
				back : vformPanel
			});
			
			var temp_cmp = Ext.getCmp(renderCmp);
			if(temp_cmp){
				//temp_cmp.add(reversalPanel);
				temp_cmp.insert(0, reversalPanel);
			}
			reversalPanel.setNavigation(title);
			reversalPanel.addToolBar('toolbar', btntbar);
			
			
			var formArguments = {};
			formArguments.versionName = result['versionName'];
			formArguments.versionId = result['versionId'];
			formArguments.comment = result['comment'];
			vformPanel.setValues(formArguments);
		}
	}
	
	function dragSvg(data,id,scenarioId,dragObj,technologies,selectedTechName,isInit){
//		var svg_container_id = 'svg-container-' + scenarioId;
		var svg_container_id = 'svg-container-' + id;
		var resultsPanel = Ext.get(id);
//		var panelWidth = resultsPanel.getWidth();
		var panelWidth = 950;
//		var panelHeight = resultsPanel.getHeight();
		var panelHeight = 430;
		if(!panelWidth){
			panelWidth = 600;
		}else{
			panelWidth -= 200;
		}
		if(!panelHeight){
			panelHeight = 400;
		}else{
//			panelHeight -= 60;
		}
		
		var formatDate = d3.time.format("%Y-%m-%d");
		
		var parseDate = formatDate.parse;
		if(isInit){
			data.forEach(function(d) {
				d.date = parseDate(d.date);
			});
		}

		var margin = {
				top : 20,
				right : 20,
				bottom : 130,
				left : 100
			}, 
			width = panelWidth - margin.left - margin.right, 
			height = panelHeight - margin.top - margin.bottom;
		
		var margin2 = {
				top : 325,
				right : 10,
				bottom : 50,
				left : 100
			},
			height2 = panelHeight - margin2.top - margin2.bottom;
			width2 = width + 2;

		var x = d3.time.scale().range([ 0, width ]);
		
		var x2 = d3.time.scale().range([ 0, width2 - 3 ]);

		var y = d3.scale.linear().range([ height, 0 ]);
		
		var y2 = d3.scale.linear().range([ height2, 0 ]);

		var color = d3.scale.category10();

		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		
		var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");

		var yAxis = d3.svg.axis().scale(y).orient("left");
		
		var brushs = d3.svg.brush().x(x2).on("brush", brush);
		
		var brushs1 = d3.svg.brush().x(x).on("brush", onBrush)
						//.on("brushend", onBrushend);
		
		var techColorObj = {};
		for(var t=0,len=technologies.length;t<len;t++){
			var tempTech = technologies[t];
			techColorObj[tempTech.name] = color(tempTech.name);
		}

//		var area = d3.svg.area().interpolate("monotone").x(function(d) {
//			return x(d.date);
//		}).y0(function(d) {
//			return y(d.y0);
//		}).y1(function(d) {
//			return y(d.y0 + d.y);
//		});
		
		var line = d3.svg.line().interpolate("basis").x(function(d) { 
			return x(d.date); 
		}).y(function(d) { 
			return y(d.trafficLoad); 
		});
		
//		var stack = d3.layout.stack().values(function(d) {
//			return d.values;
//		});
		
		//创建svg标签
		var oldSvg = d3.select("#"+svg_container_id).select("svg");
		if(oldSvg){
			oldSvg.remove();
		}
		var svg = d3.select("#"+svg_container_id).append("svg").attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom).on("mousedown", function(){stopDateChange()})
		
		//获取属性值
//		color.domain(d3.keys(data[0]).filter(function(key) {
//			return checkSelectedTechName(key,selectedTechName);
//		}));
		
//		var browsers = color.domain().map(function(name) {
//			return {
//				name : name,
//				values : data.map(function(d) {
//					return {
//						date : d.date,
//						trafficLoad : Number(d[name])
//					};
//				})
//			};
//		});
		var browsers = [{
				name : createXText(selectedTechName),
				values : data.map(function(d) {
					return {
						date : d.date,
//						trafficLoad : Number(d[name])
						trafficLoad : createYData(d,selectedTechName)
					};
				})
			}];
		
		function createXText(selectedTechName){
			var result = '';
			for(var i=0,len=selectedTechName.length;i<len;i++){
				var name = selectedTechName[i];
				result += name;
				if(i != len - 1){
					result += '_';
				}
			}
			return result;
		}
		
		function createYData(d,selectedTechName){
			var result = 0;
			for(var i=0,len=selectedTechName.length;i<len;i++){
				var name = selectedTechName[i];
				if (d[name]) {
				    result += Number(d[name]);
				}
			}
			return result;
		}
		
		x.domain(d3.extent(data, function(d) {
			return d.date;
		}));
		
		y.domain([
          d3.min(browsers, function(c) { return d3.min(c.values, function(v) { return v.trafficLoad;  }); }),
          d3.max(browsers, function(c) { return d3.max(c.values, function(v) { return v.trafficLoad; }); })
        ]);
		
		x2.domain(x.domain());
		y2.domain(y.domain());

//		var browsers = stack(color.domain().map(function(name) {
//			return {
//				name : name,
//				values : data.map(function(d) {
//					return {
//						date : d.date,
//						y : Number(d[name])
//					};
//				})
//			};
//		}));
		
		for(var i=0;i<browsers.length;i++){
			svg.append("defs").append("clipPath").attr("id", "clip"+i).append("rect")
				.attr("width", width).attr("height", height)
		}
		
		var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").on("mousedown", function(){stopDateChange()});

		var context = svg.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")").on("mousedown", function(){stopDateChange()})
		
		var browser = focus.selectAll(".browser").data(browsers).enter().append("g").attr("class", "browser").on("mousedown", function(){stopDateChange()})

//		var tempI = 0;
//		browser.append("path").attr("class", "area").attr("clip-path", "url(#clip"+tempI+")").attr("d", function(d) {
//			tempI++;
//			return area(d.values);
//		}).style("fill", function(d) {
//			return color(d.name);
//		});
		
		var tempI = 0;
		browser.append("path").attr("class", "line").attr("clip-path", "url(#clip"+tempI+")").attr("d", function(d) {
			tempI++;
			return line(d.values);
		}).style("stroke", function(d) {
//			return color(d.name);
			return techColorObj['3G'];
		});

//		browser.append("text").datum(function(d) {
//			return {
//				name : d.name,
//				value : d.values[d.values.length - 1]
//			};
//		}).attr(
//				"transform",
//				function(d) {
//					return "translate(" + x(d.value.date) + ","
//							+ y(d.value.y0 + d.value.y / 2) + ")";
//				}).attr("x", -6).attr("dy", ".36em").text(function(d) {
//			return d.name;
//		});
		
		browser.append("text").datum(function(d) {
			return {
				name : d.name,
				value : d.values[d.values.length - 1]
			};
		}).attr(
				"transform",
				function(d) {
					return "translate(" + x(d.value.date) + ","
							+ y(d.value.trafficLoad) + ")";
				}).attr("x", 3).attr("dy", ".35em").text(function(d) {
			return d.name;
		});

		focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis)
		
		focus.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("TrafficLoad");
		
		
		document.body.onmousewheel = function(e){
			//console.log(e);
		}
		
		
		focus.append("g").attr("class", "x brush").attr("clip-path", "url(#clip0)").call(brushs1).selectAll("rect")
				.attr("y", -6).attr("height", height + 7).on("mousedown", function(){stopDateChange()})
		
		context.append("g").attr("class", "x axis").attr("transform", "translate(0," + height2 + ")").call(xAxis2);

		context.append("g").attr("class", "x brush").call(brushs).selectAll("rect").attr("y", -6).attr("height", height2 + 7)
						.on("mousedown", function(){stopDateChange()})
		
		var dragbarw = 2;
		var dragLeftWidth = 0;
		var dragRightWidth = width2 - dragbarw;
		var dragHeight = height2 + 6;
		var tempDate = d3.extent(data, function(d) {
			return d.date;
		});
		
//		var dragObj = {};
		if(dragObj.start != null){
//			var startDate = formatDate.parse(dragObj.start);
//			dragObj.start =  startDate;
			dragObj.startX = x2(dragObj.start);
		}else{
//			dragObj.start = formatDate(tempDate[0]);
			dragObj.start = tempDate[0];
			period.setPeriodObj(scenarioId,dragObj.start,dragObj.end);
			dragObj.startX = 0;
		}
		if(dragObj.end != null){
//			var endDate = formatDate.parse(dragObj.end);
//			dragObj.end = endDate;
			dragObj.endX = x2(dragObj.end);
		}else{
//			dragObj.end = formatDate(tempDate[1]);
			dragObj.end = tempDate[1];
			period.setPeriodObj(scenarioId,dragObj.start,dragObj.end);
			dragObj.endX = width2;
		}
		
		var dragleft = d3.behavior.drag().origin(Object).on("drag", ldragresize)
						//.on("dragend",onDragleftend);
		var dragright = d3.behavior.drag().origin(Object).on("drag", rdragresize)
						//.on("dragend",onDragrightend);
		
		var newlg = context.append("g").data([{x: dragLeftWidth, y: dragHeight}]);
		
		var newrg = context.append("g").data([{x: dragRightWidth, y: dragHeight}]);
		
		var dragbarleft = newlg.append("rect").on("mousedown", function(){stopDateChange()})
							.attr("x",0)
							.attr("y",-6)
							.attr("width",dragbarw)
							.attr("height",dragHeight)
							.attr("style","cursor: ew-resize;")
// 							.attr("fill", "lightblue")
	      					.attr("fill-opacity", .5)
	      					.call(dragleft);
		
		var dragbarright = newrg.append("rect").on("mousedown", function(){stopDateChange()})
							.attr("x",width-1)
							.attr("y",-6)
							.attr("width",dragbarw)
							.attr("height",dragHeight)
							.attr("style","cursor: ew-resize;")
// 							.attr("fill", "lightblue")
	      					.attr("fill-opacity", .5)
	      					.call(dragright);
		
		function ldragresize(d) {
			  if(d3.event.x < dragbarw){
		    	  d.x = dragbarw;
		      }else if(d3.event.x < dragRightWidth){
		    	  d.x = d3.event.x;
		      }else{
		    	  d.x = dragRightWidth - dragbarw;
		      }
			  handlerStartCooridate(d.x);
		}
		
		function handlerStartCooridate(x){
			dragbarleft.attr("x", function(d) { return d.x - (dragbarw / 2); });
			
			dragLeftWidth = x;
			dragObj.startX = x;
			dragObj.start = x2.invert(x);
			period.setPeriodObj(scenarioId,dragObj.start,dragObj.end);
			  
			reComputeExtent();
		}
		
		function handlerEndCooridate(x){
			dragbarright.attr("x", function(d) { return d.x - (dragbarw/2) });
			 
			dragRightWidth = x;
			dragObj.endX = x;
			dragObj.end = x2.invert(x);
			period.setPeriodObj(scenarioId,dragObj.start,dragObj.end);
			 
			reComputeExtent();
		}

		function rdragresize(d) {
			  if(d3.event.x < dragbarw * 2){
		    	  d.x = dragbarw;
		      }else if(d3.event.x > width2){
		    	  d.x = width2 - dragbarw;
		      }else if(d3.event.x > dragLeftWidth + dragbarw){
		    	  d.x = d3.event.x;
		      }else{
		    	  d.x = dragLeftWidth + dragbarw;
		      }
		     
		     handlerEndCooridate(d.x);
		}
		
		function reComputeExtent(){
			dragbarleft.data([{x: dragObj.startX, y: dragHeight}]);
			dragbarright.data([{x: dragObj.endX, y: dragHeight}]);
			
			var startDate = x2.invert(dragObj.startX);
			var endDate = x2.invert(dragObj.endX);
			brushs1.extent([startDate,endDate]);
			focus.select(".x.brush").call(brushs1);
			
			if(Ext.getCmp("startDateDivSel" + scenarioId) && Ext.getCmp("startDateDivSel" + scenarioId).setValue){
				Ext.getCmp("startDateDivSel" + scenarioId).setValue(formatDate(dragObj.start));
				Ext.getCmp("endDateDivSel" + scenarioId).setValue(formatDate(dragObj.end));
			}
		}
		
		function init(){
			dragbarleft.data([{x: dragObj.startX, y: dragHeight}]);
			dragbarright.data([{x: dragObj.endX, y: dragHeight}]);
			handlerStartCooridate(dragObj.startX);
			handlerEndCooridate(dragObj.endX);
		}
		
//		function brush() {
//			x.domain(brushs.empty() ? x2.domain() : brushs.extent());
//			focus.select(".x.axis").call(xAxis);
//			browser.select("path").attr("d", function(d) {
//				return area(d.values);
//			});
//			
//			reComputeExtent();
//		}
		
		function brush() {
			x.domain(brushs.empty() ? x2.domain() : brushs.extent());
			focus.select(".x.axis").call(xAxis);
			browser.select("path").attr("d", function(d) {
				return line(d.values);
			});
			
			reComputeExtent();
		}
		
		function onDragleftend(e){
			console.log("left end");
		}
		
		function onDragrightend(e){
			console.log("right end");
		}
		
		function onBrush(){
			var temp = brushs1.extent();
			var x0 = x(temp[0]);
			var x1 = x(temp[1]);
			if(x0 == x1){
				reComputeExtent();
				return;
			}
			dragObj.start = temp[0]; 
			dragObj.end = temp[1];
			
			var x2_0 = x2(temp[0]);
			var x2_1 = x2(temp[1]);
			
			handlerStartCooridate(x2_0);
			handlerEndCooridate(x2_1);
		}
		
		function onBrushend(){
			console.log('onBrushend');
		}
		
		function stopDateChange(){
			if(Ext.getCmp("forStartEndPanelId" + scenarioId)){
				Ext.getCmp("forStartEndPanelId" + scenarioId).focus();
				dragObj.needChangeS = false;
				dragObj.needChangeE = false;
			}
		}
		
		//初始化
		init();
		
//		context.append("text").attr("class", "instructions").attr("transform",
//				"translate(0," + (height2 + 30)+ ")").text('Click and drag above to zoom / pan the data');
		
		d3.select("#"+svg_container_id).selectAll("input[name=technology]").on("click", function(){
			if(!isCanCancelChecked(svg_container_id)){
				this.checked = true;
				return ;
			}
			var selectedTechName = getCheckedTechnologyName(svg_container_id,technologies);
			dragSvg(data,id,scenarioId,dragObj,technologies,selectedTechName,false);
		});
	}
//end of dragSvg
	
	function checkSelectedTechName(key,selectedTechName){
		var isShowable = false;
		for(var i=0;i<selectedTechName.length;i++){
			var temp = selectedTechName[i];
			if(key === temp){
				isShowable = true;
				break;
			}
		}
		return key != 'date' && isShowable ;
	}
	
	function createTechNameArr(periodObj,technologies){
		var temp = new Array();
		if(!periodObj){
			for(var i=0;i<technologies.length;i++){
				var tech = technologies[i];
				temp.push(tech.name);
			}
		}else{
			var periodTech = periodObj.technology;
			for(var j=0;j<periodTech.length;j++){
				var tech = periodTech[j];
				temp.push(tech.name);
			}
		}
		return temp;
	}
	
	function getTechName(techId,technologies){
		var tecnologyId = splitTechnologyId(techId);
		if(!tecnologyId){
			return "";
		}
		
		for(var i=0;i<technologies.length;i++){
			var tech = technologies[i];
			if(tecnologyId === tech.id){
				return tech.name;
			}
		}
		return "";
	}
	
	function createTechnlogyForm(technologies,periodObj,scenarioId){
		var html = "";
		if(!technologies){
			return html;
		}
		if(technologies.length > 0){
			html += '<div style="position: absolute;top: 20px;left: 800px;">';
			html += '<form>';
			html += '<h3>Technology</h3>';
			for(var i=0;i<technologies.length;i++){
				var tech = technologies[i];
				var techId = scenarioId+'||'+tech.id;
				var check = checkShouldChecked(techId,periodObj);
				if(check){
					html += '<input type="checkbox" name="technology" id="'+techId+'" checked = '+check+'>&nbsp;<label>'+tech.name+'</label><br>';
				}else{
					html += '<input type="checkbox" name="technology" id="'+techId+'" >&nbsp;<label>'+tech.name+'</label><br>';
				}
			}
			html += '</form><br><br><div id="selDateDiv'+ scenarioId +'"></div></div>';
		}
		return html;
	}
	
	function splitTechnologyId(techId){
		var temp = techId.split("||");
		if(temp.length == 2){
			return temp[1];
		}
		return null;
	}
	
	function checkShouldChecked(techId,periodObj){
		if(periodObj == null){
			return true;
		}
		var technologies = periodObj.technology;
		for(var i=0,len=technologies.length;i<len;i++){
			var technology = technologies[i];
			var tecnologyId = splitTechnologyId(techId);
			if(tecnologyId === technology.id){
				return true;
			}
		}
		return false;
	}
	
	function isCanCancelChecked(svg_container_id){
		var techInput = d3.select("#"+svg_container_id).selectAll("input[name=technology]")[0];
		for(var i=0,len=techInput.length;i<len;i++){
			var tech = techInput[i];
			if(tech.checked){
				return true;
			}
		}
		return false;
	}
	
	function initTechnologies(svg_container_id,periodObj){
		var techInput = d3.select("#"+svg_container_id).selectAll("input[name=technology]")[0];
		for(var i=0,len=techInput.length;i<len;i++){
			var tech = techInput[i];
			if(!periodObj){
				tech.checked = true;
			}else{
				var hasExists = false;
				var technologies = periodObj.technology;
				for(var j=0,len2=technologies.length;j<len2;j++){
					var technology = technologies[j];
					var tecnologyId = splitTechnologyId(tech.id);
					if(tecnologyId === technology.id){
						tech.checked = true;
						hasExists = true;
						break;
					}
				}
				if(!hasExists){
					tech.checked = false;
				}
			}
		}
	}
	
	function getCheckedTechnologyName(svg_container_id,technologies){
		var checkedTechName = new Array();
		var techInput = d3.select("#"+svg_container_id).selectAll("input[name=technology]")[0];
		for(var i=0,len=techInput.length;i<len;i++){
			var tech = techInput[i];
			if(tech.checked){
				var technologyName = getTechName(tech.id,technologies);
				checkedTechName.push(technologyName);
			}
		}
		return checkedTechName;
	}
	
	function getCheckedTechnologyJson(svg_container_id,technologies){
		var json = '[';
		var techInput = d3.select("#"+svg_container_id).selectAll("input[name=technology]")[0];
		for(var i=0,len=techInput.length;i<len;i++){
			var tech = techInput[i];
			if(tech.checked){
				json += '{"id":"' +splitTechnologyId(tech.id)+'","name":"'+getTechName(tech.id,technologies)+'"}'; 
				json += ',';
			}
		}
		if(json.length > 1){
			json = json.substring(0,json.length - 1);
		}
		json += ']';
		return json;
	}
	
	
	period.savePeriod = function(saveType,scenarioId,versionId,start,end,technologies,id,renderCmp){
		var reversalPanel_id = 'reversalPanel_' + id;
		var tempGrid = Ext.getCmp(reversalPanel_id);
		var tempForm = tempGrid.back;
		
		var tempObj = tempForm.getForm().getValues();
		
//		tempForm.doSave(function(formVals){
//			cometdfn.publish({
//				MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
//				COMMAND : 'COMMAND_SAVE_BATCH',
//				id : id,
//				start : start,
//				end : end,
//				technologies : technologies,
//				versionId : versionId,
//				scenarioId : scenarioId,
//				isDrag : false,
//				saveType:saveType,
//				versionName : tempObj.versionName,
//				comment : tempObj.comment
//			});
//		});
		
		
		var condition = saveType === SAVE_AS_HANDLER || (saveType === SAVE_HANDLER && Ext.isEmpty(versionId));
//		if(condition || !tempForm.isValid()){
		if(!tempForm.isValid()){
			tempGrid.toBack();
		}else{
			cometdfn.publish({
				MODULE_TYPE : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
				COMMAND : 'COMMAND_SAVE_BATCH',
				id : id,
				start : start,
				end : end,
				technologies : technologies,
				versionId : versionId,
				scenarioId : scenarioId,
				isDrag : false,
				saveType:saveType,
				versionName : tempObj.versionName,
				comment : tempObj.comment,
				renderCmp:renderCmp
			});
		}
		
	}
	
	period.savePeriodCallback = function(data){
		var status = data.STATUS ;
		if(status === "success"){
			var result = Ext.JSON.decode(data.BUSINESS_DATA.result);
			if(result['isSuccess']){
				alertSuccess('Save successful!');
				var versionId = result['versionId'];
				var scenarioId = data.scenarioId;
				
				var reversalPanel_id = 'reversalPanel_' + data.id;
				var tempGrid = Ext.getCmp(reversalPanel_id);
				var tempForm = tempGrid.back;
				tempForm.toFront();
				tempForm.setValues({versionId:result.versionId});
				
				var datas = {};
				datas.versionId = data.versionId;
				datas.planningCycleId = data.planningCycleId;
				datas.siteGroupPlannedId = data.siteGroupPlannedId;
				datas.scenarioId = data.scenarioId;
				datas.technologyId = data.technologyId;
				datas.siteGroupId = data.siteGroupId;
				datas.renderCmp = data.renderCmp;
				datas.id = data.id;
				
				DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodPublish(versionId,scenarioId,datas);
				
			}else{
				alertError(result.msg || '');
			}
		}else if(data.customException){
			alertError(data.customException);
		}
	}
	
	period.removePeriodCallback = function(data){
		var status = data.STATUS ;
		if(status === "success"){
			var result = Ext.JSON.decode(data.BUSINESS_DATA.result);
			if(result['isSuccess']){
				alertSuccess('Remove successful!');
				var scenarioId = data.scenarioId;
				var id = data.id;
//				var svg_container_id = 'svg-container-' + scenarioId;
				var svg_container_id = 'svg-container-' + id;
				initTechnologies(svg_container_id,null);
				
				var datas = {};
				datas.versionId = data.versionId;
				datas.planningCycleId = data.planningCycleId;
				datas.siteGroupPlannedId = data.siteGroupPlannedId;
				datas.scenarioId = data.scenarioId;
				datas.technologyId = data.technologyId;
				datas.siteGroupId = data.siteGroupId;
				datas.renderCmp = data.renderCmp;
				datas.id = data.id;
				
				DigiCompass.Web.UI.CometdPublish.trafficSiteLoadCalculatingPeriodPublish("",scenarioId,datas);
			}else{
				alertError(result.msg || '');
			}
		}else if(event.target.type == 'button'){
			return;
		}
	}
	
})()


