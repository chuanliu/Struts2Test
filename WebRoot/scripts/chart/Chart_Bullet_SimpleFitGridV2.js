(function(){
	Ext.namespace('DigiCompass.Web.app.CrReport_BulletSimpleFitGrid');
	DigiCompass.Web.app.CrReport_BulletSimpleFitGrid = function(dat, statusSort, reportSort, config, displaySort, callback){
		//the data processing and static variable
		var data = myClone(dat);
		var oldData = myClone(dat);
		var panelId = config.panelId || "defaultPanelId";
		var configSvgId = config.svgId || "defaultSvgId";
		var _tabName = config.tabName || "";
		var count = reportSort.length;
		var keySort = [];//for chart
		var needShowUnknownKeyInGrid = false;
		var keySort_special_a = [];//for grid
		var keySort_special_b = [];//for only in grid
		var theTotalKey = null;
		var titleStr = {};
		for(var j=0; j<reportSort.length; j++){
			titleStr[reportSort[j]] = reportSort[j];
		}
		var headerStr = {}
		var rectColor = {}
		for(var j=0; j<statusSort.length; j++){
			var key = statusSort[j].key;
			headerStr[key] = statusSort[j].name || "";
			rectColor[key] = statusSort[j].color || "#000";
			//special: the first is totalKey, others are keys; special change: the first show!=grid is totalKey
			if(theTotalKey || (statusSort[j].show && statusSort[j].show == "grid")){
				if(statusSort[j].show){
					switch(statusSort[j].show){
						case 'all' :
							keySort.push(key);
							keySort_special_a.push(key);
							break;
						case 'grid' :
							keySort_special_a.push(key);
							keySort_special_b.push(key);
							break;
						case 'chart' :
							keySort.push(key);
							break;
						default :
					}
				}else{
					keySort.push(key);
					keySort_special_a.push(key);
				}
			}else{
				theTotalKey = key;
			}
		}
		if(!displaySort) displaySort = keySort.slice();
		var rangesColor = ["#eee", "#ccc"];
		var margin = {left:140, top: 20, right: 450};
		var bulletH = 50;
		
		if(data){
			for(var w=0; w<reportSort.length; w++){
				var tmpData = [];
				for(var u in data[reportSort[w]].data){
					var tmpDa = data[reportSort[w]].data[u];
					var tmpU = u.split(",");
					var len = tmpU[tmpU.length - 1].length;
					tmpDa.Title = u.substring(0, u.length - (len == u.length ? 0 : len + 1));
					tmpDa.idWithDou = u.substring(u.length - (len == u.length ? 0 : len + 1), u.length);
					tmpData.push(tmpDa);
				}
				data[reportSort[w]] = tmpData.slice()
			}
		}
		
		var chartData = changeGridDataToChartData(data);
		function changeGridDataToChartData(d){
			var re = []
			var toBigNum = function(num){
				var p = ("" + num).length - 2
				return (Math.round(parseInt(num) / (Math.pow(10, p))) + 1) * Math.pow(10, p)
			}
			for(var i=0; i<reportSort.length; i++){
				var dd = d[reportSort[i]];
				var maxN = -1
				for(var t in dd){
					if(maxN < dd[t][theTotalKey]){
						maxN = dd[t][theTotalKey]
					}
				}
				maxN = maxN > 0 ? toBigNum(maxN) : 0;
				var rr = [];
				for(var y in dd){
					var tmp = {}
					tmp.title = dd[y].Title;
					tmp.subtitle = ''
					tmp.ranges = [maxN, dd[y][theTotalKey]]
					tmp.markers = [dd[y][theTotalKey] || 0]
					tmp.measures = []
					for(var q=0; keySort[q]; q++){
						tmp.measures.push(dd[y][keySort[q]] || 0)
					}
					tmp.tmpIndex = y
					rr.push(tmp)
				}
				re.push(rr)
			}
			return re
		}

		//create grid
		var fields = getFields(data[reportSort[0]]);
		
		function getFields(data0){
			var f = [];
			for(var x in data0){
				if(typeof x == 'string'){
					f.push({name: 'Title'})
					if(theTotalKey){
						f.push({name: theTotalKey})
					}
					//for(var w=0; w<keySort.length; w++){
					//	f.push({name: keySort[w]})
					//}
					for(var w=0; w<keySort_special_a.length; w++){
						f.push({name: keySort_special_a[w]})
					}
					if(needShowUnknownKeyInGrid){
						for(var y in data0[x]){
							if(typeof y == "string" && y != 'Title' && y != theTotalKey && keySort_special_a.indexOf(y) == -1){
								f.push({name: y})
							}
						}
					}
					break;
				}
			}
			return f;
		}
		
		function getCms(f){
			var c = [];
			var w = parseInt((config.width - 20) / f.length);
			for(var a=0,n=f.length; a<n; a++){
				var theKey = f[a].name;
				c.push({header: headerStr[theKey] || theKey, dataIndex: theKey, align: theKey == "Title" ? 'left' : 'right', 
						width: w, renderer: function(v, obj, record, rIdx, cIdx){
					var dIndex = "";
					if(cIdx && this.columns.length){
						dIndex = this.columns[cIdx].dataIndex;
					}
					var tmpDefaultV = dIndex ? (keySort_special_b.indexOf(dIndex) == -1 ? 0 : "N/A") : 0;
					return v || tmpDefaultV;
				}})
			}
			return c;
		}

		Ext.regModel('report', {
			fields: fields
		})
		
		var store = new Ext.data.JsonStore({
			model : 'report',
			data: {griddata: data[reportSort[count % reportSort.length]]},
			proxy: {
				type: 'memory',
				reader: {
					type: 'json',
					root: 'griddata'
				}
			}
        });

		var grid = Ext.create('Ext.grid.GridPanel', {
			border: false,
			layout: 'fit',
			region:'center',
			autoScroll: true,
	        store: store, 
	        columns: getCms(fields),
	    	collapsible : false,
		    listeners:{
				'viewready':{
					fn : function(grid) {
						
					},
					scope : this
				},
				'itemclick' : function(){
					changeChart()
				},
				'containerclick' : function(){
					changeChart()
				}
			}
        });
		var exportTbar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				xtype : 'button',
				text : 'Export',
				handler : function() {
					var title = titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length];
					var columns = new Array();
					for(var i = 0; i < fields.length; i++){
						columns.push(fields[i].name);
					}
					var store = grid.getStore();
					var datas = new Array();
					for(var i = 0; i < store.getCount(); i++){
						var record = store.getAt(i);
						var rowData = new Array();
						for(var j = 0; j < fields.length; j++){
							rowData.push(record.get(fields[j].name));
						}
						datas.push(rowData);
					}
    				var data = {
    					columns : JSON.stringify(columns),
    					datas : JSON.stringify(datas),    					
						title : title						
		            };
		            //var str = context.param(data);
					var url = "download";
					downloadFile(url, data);
				}
			} ]
		});
		grid.addDocked(exportTbar);
        function randomString(n){
			if(!n) n = 15;
			var re = [];
			var l = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var le = l.length;
			for(var a=0; a<n; a++){
				re.push(l[Math.floor(Math.random() * le)])
			}
			return re.join("");
		}
		
		//create chart
		function xline(d, v){
			if(!v) return 0;
			var theMax =  Math.max(d3.max(d.ranges), d3.max(d.markers), d3.max(d.measures));
        	var x =  d3.scale.linear().domain([0,theMax]).range([0, config.width - margin.right]);
	        return x(v);
	    }
		
	    function xTick(d){
	    	var theMax =  Math.max(d3.max(d.ranges), d3.max(d.markers), d3.max(d.measures));
	    	var x = d3.scale.linear().domain([0, theMax]).range([0, config.width - margin.right]);
	    	var num = theMax > 8 ? 8 : (theMax > 0 ? theMax : 8);
	        return x.ticks(num);
	    }
	    
	    function getSvgHeight(dataLen){
	    	var minHeight = 25 * keySort.length;
	    	return bulletH * dataLen > minHeight ? bulletH * dataLen + 50 : minHeight + 50;
	    }

	    var toolTip = null;
	    function initChart(size){
	    	var aData = chartData[count % reportSort.length]
	    	var dataLen = aData.length
	    	var svgH = getSvgHeight(dataLen);
	    	d3.selectAll("div." + panelId + (size ? "_TheShow_" : "") + "DivClass").remove()
	    	var div = d3.select("#" + panelId + (size ? "_TheShow_": "") +"ChartPanel-body")
	    		.append("div").attr("class", panelId + (size ? "_TheShow_" : "") + "DivClass").style("overflow-y", 'auto');
	        var s = div.append("svg").attr("class","svgClass").attr("id", configSvgId + (size ? "_TheShow_" : ""));
	        s.attr("height", svgH).attr("width", config.width - 20).on('click', function(){ changeChart(size); });

	        var legend = s.selectAll(".legend").data(displaySort.slice()).enter().append("g").attr("class", "legend")
	        legend.append("rect").attr("x", config.width - 80).attr("y", function(d, i){ return i*20 + margin.top; }).attr("width", 18).attr("height", 18)
	        	.style("fill", function(d, i){ return rectColor[d] || "#000"; })
	        legend.append("text").attr("x", config.width - 87).attr("y", 12).attr("dy", function(d, i){ return i*20 + margin.top; })
	        	.style("text-anchor", "end").style("cursor", "default").text(function(d){ return headerStr[d] || d; })
	        
	        createBullet(s, 1000, aData, dataLen, count)
	        
	        if(!size){
	        	toolTip = Ext.create("Ext.tip.ToolTip", {
		        	id : configSvgId + "_toolTip_" + panelId + "_" + randomString(),
		        	html : "have no text"
		        })
	        }
	        document.onselectstart = new Function('event.returnValue=false;')
	    }

	    function changeChart(size){
	    	var theTmpCount = count;
	    	setTimeout(function(){
	    		if(theTmpCount < count) return;
		    	CountAdd()
		    	theTmpCount = count;
		    	var aData = chartData[count % reportSort.length]
		    	var dataLen = aData.length
		    	var svgH = getSvgHeight(dataLen);
		    	var s = d3.select("#" + configSvgId).attr("height", svgH)
		    	var duration = dataLen > 20 ? 1000 : dataLen < 6 ? 300 : dataLen * 50;

		    	s.selectAll(".bullet").transition().duration(duration).attr("transform", "translate(0," + margin.top + ")").style("opacity", 1e-4)
		    		.remove();
		    	createBullet(s, duration, aData, dataLen, theTmpCount);
		    	
		    	if(size || showButton.isDisabled()){
		    		var ss = d3.select("#" + configSvgId + "_TheShow_").attr("height", svgH)
		    		ss.selectAll(".bullet").transition().duration(duration).attr("transform", "translate(0," + margin.top + ")").style("opacity", 1e-4)
		    			.remove();
		    		createBullet(ss, duration, aData, dataLen, theTmpCount);
		    		if(dlg) dlg.setTitle(titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length])
		    	}
		    }, 50)
	    }
	    function CountAdd(){
			count++;
			Ext.getCmp(panelId).setTitle(titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length])
			grid.getStore().loadData(data[reportSort[count % reportSort.length]]);
		}
	    
		function formatTitleStr(str){
			if(str.length > 16){
				return str.substring(0, 13) + "...";
			}else{
				return str
			}
		}

	    function createBullet(s, duration, aData, dataLen, theTmpCount){
			for(var a=0; a<dataLen; a++){
				if(theTmpCount < count) break;
	    		var bullet = s.append("g").attr("class", "bullet").style("opacity", 0).attr("transform", "translate(0," + margin.top + ")");
	    		bullet.transition().delay(duration).style("opacity", 0)
	        		.transition().duration(duration).style("opacity", 1).attr("transform", "translate(0," + (margin.top + bulletH * a) + ")")
	        	
        		bullet.append("g").selectAll(".ranges").data(aData[a].ranges).enter().append("rect").attr("y", 0)
        			.attr("height", bulletH / 2).attr("class", "ranges")
        			.attr("x", margin.left).attr("width", function(d){ return xline(aData[a], d); })
        			.style("fill", function(d, i){ return rangesColor[i]; })
	        
        		bullet.append("g").selectAll(".measures").data(aData[a].measures).enter().append("rect").attr("class", "measures").attr("y", bulletH / 8).attr("height", bulletH / 4)
	        		.attr("x", function(d){ return margin.left; }).style("opacity", .5)
	        		.attr("width", function(d){ return xline(aData[a], d); }).style("fill", function(d, i) { return d ? rectColor[keySort[i]] : ""; })
	        	
        		bullet.append("g").selectAll(".markers").data(aData[a].markers).enter().append("line").style("stroke","black")
        			.style("stroke-width", '2px').attr("class", "markers").attr("y1", bulletH / 16).attr("y2", bulletH * 7 / 16)
	        		.attr("x1", function(d){ return margin.left + xline(aData[a], d); })
	        		.attr("x2", function(d){ return margin.left + xline(aData[a], d); })
	        	
	        	var title = bullet.append("g").attr("class", "titles").attr("title", aData[a].title || 'unknown').attr("num", a)
	        		.attr("tmpIndex", aData[a].tmpIndex)
	        		.on("click", function(){
	        			var t = d3.select(this)
	        			var tmpI = t.attr("tmpIndex");
	        			var tmpD = data[reportSort[count % reportSort.length]][tmpI];
	        			var tmpSS = "";
	        			if(tmpD.Title && tmpD.idWithDou){
	        				tmpSS = tmpD.Title + tmpD.idWithDou;
	        			}else if(tmpD.Title){
	        				tmpSS = tmpD.Title;
	        			}else if(tmpD.idWithDou){
	        				tmpSS = tmpD.idWithDou;
	        			}
	        			var tmpN = Ext.clone(reportSort[count % reportSort.length]);
	        			if(callback) callback(tmpSS, tmpN);
	        			event.cancelBubble = true;
			        	d3.event.preventDefault();
			        	return false;
	        		}).on("mouseover", function(){
        				var t = d3.select(this)
        				if(t.attr("title") != t.select("text").text()){
	        				toolTip.update(t.attr("title"))
	        				toolTip.showAt([d3.event.clientX, d3.event.clientY - 35])
        				}
	        		}).on("mouseout", function(e){
	        			toolTip.hide()
	        		}).append("text").attr("x", margin.left - 5).attr("y", bulletH / 3).style("font-size", 12).style("fill", "blue")
	        		.style("text-anchor", "end").style("cursor", "hand").text(formatTitleStr(aData[a].title || 'unknown'))

	        	var tt = bullet.append("g").attr("transform", "translate(" + margin.left + "," + bulletH / 2 + ")").selectAll(".tick")
	        				.data(xTick(aData[a])).enter().append("g").attr("class", "tick")
        		tt.append("line").style("stroke","black").style("stroke-width", '1px').style("opacity", .5).attr("y1", 1).attr("y2", 6)
        			.attr("x1", function(d){ return xline(aData[a], d); }).attr("x2", function(d){ return xline(aData[a], d); })
        		tt.append("text").attr("y", 15).style("font-size", 8).attr("x", function(d){ return xline(aData[a], d); })
        			.style("text-anchor", "middle").style("cursor", "default").text(function(d){ return d; })
	    	}
	    }
	    
		var chartPanel = initChartPanel();
		function initChartPanel(size){
			return Ext.create("Ext.panel.Panel", {
			    id: panelId + (size ? "_TheShow_": "") +"ChartPanel",
		    	border: false,
		    	autoScroll: true,
		    	height: size ? size : "",
//		    	width: config.width,
		    	collapsible : false,
		    	listeners : {
		    		'render' : function(){
		    			initChart(size);
		    		}
		    		,'beforedestroy' : function(){
		    			if(dlg){
		    				dlg.hide()
		    				dlg = null
		    			}
		    			if(toolTip){
		    				toolTip.remove()
		    				toolTip = null
		    			}
		    			document.onselectstart = null
		    		}
		    	}
		    });
		}
			
		//create show chart window
		var dlg = null;
		var showTheChart = function(){
			showButton.setDisabled(true);
			var child = initChartPanel(600);
			child.setBorder(false)
			dlg = Ext.create('Ext.Window', {
					width: config.width + 13,
					title: titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length],
					modal: false,
					closable: true,
					plain: false,
					resizable: false,
					shadow: true,
					y : window.innerHeight ? (window.innerHeight > 600 ? (window.innerHeight - 600) / 3 : 0) : "",
					listeners : {
						'beforeclose' : function(){
							try{
								dlg.hide();
								showButton.setDisabled(false);
								dlg = null;
							}catch(e){
								return true;
							}
							return false;
						}
					}
				});
			dlg.add(child)
			dlg.show();
		}
		
		var showButton = Ext.create('Ext.Button', {
			text : 'show the chart',
			margin : 5,
			handler : showTheChart
		});
		var exportButton = Ext.create('Ext.Button', {
			text : 'export',
			margin : 5,
			handler : function(){
				var svgEl = chartPanel.getEl().select("svg").elements[0];
				var s = new XMLSerializer();			
				var svgHtml = s.serializeToString(svgEl);
				var title = titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length];
				var data = {    					
    					svgHtml : svgHtml,    					
						title : title,
						exportType : 1
		            };
	            //var str = context.param(data);
				var url = "download";
				downloadFile(url, data);
			}
		});
		chartPanel.add(showButton);
		chartPanel.add(exportButton);
		
		return {grid: grid, chart: chartPanel, title : titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length]};
	}
	
	Ext.namespace('DigiCompass.Web.app.CrReport_BulletSimpleFitGrid_Panel');
	DigiCompass.Web.app.CrReport_BulletSimpleFitGrid_Panel = function(data, keySort, reportSort, config, displaySort, callback){
		var tmp = Ext.create("DigiCompass.Web.app.CrReport_BulletSimpleFitGrid", data, keySort, reportSort, config, displaySort, callback);
		var tmpId = config.panelId;
		var tmpH = config.height;
		var tmpChart = tmp.chart;
		var tmpGrid = tmp.grid;
		var title = tmp.title;
		var panel = Ext.create('DigiCompass.Web.app.ReversalPanel', {
			panelTitle : title,
			id: tmpId,
			flex : 1,
			margin : '3px 0px 0px 0px',
			front : tmpChart,
			back : tmpGrid
		});
		return panel;
	}
	
	Ext.namespace("DigiCompass.Web.app.CrReport_BulletSimpleFitGrid_InitPanel")
	DigiCompass.Web.app.CrReport_BulletSimpleFitGrid_InitPanel = function(tabPanel, data, tab, _tabName, callback){
		if(!tab) tab = "defaulteTab";
		var panel = [];
		var reportSortLen = data.reportSort.length
		for(var i=0; i<reportSortLen; i++){
			var config = {width: tabPanel.getWidth() < 1000 ? 1000 : tabPanel.getWidth() - 20, height: (tabPanel.getHeight() - 25) / reportSortLen,
							svgId: tab + "_panelSvg" + i, panelId: tab + "_rePanel" + i, tabName : _tabName} ;
			var reportSort = data.reportSort[i];
			var displaySort = data.report[reportSort[0]].displaySort;
			var keySort = data.report[reportSort[0]].statusSort;
			panel.push(Ext.create("DigiCompass.Web.app.CrReport_BulletSimpleFitGrid_Panel", data.report, keySort, reportSort, config, displaySort, callback))
		}
		return panel;
	}
	
	



//under is gantt chart
	Ext.namespace('DigiCompass.Web.app.GanttChart')
	DigiCompass.Web.app.GanttChart = function(data, reportSort, config, callback){
		var _idx = 0,
			mee = null,
			stats = ['day', 'week', 'month', 'quarter'],
			stat = 'week',
			oldObjs = {};
		
		var draw = function(me){
			var json = myClone(data[reportSort[_idx]]);
			window.g = new JSGantt.GanttChart('g', me.body.dom, stat);
			g.setShowRes(1); // Show/Hide Responsible (0/1)
			g.setShowDur(1); // Show/Hide Duration (0/1)
			g.setShowComp(1); // Show/Hide % Complete(0/1)
//			g.setCaptionType('Resource');  // Set to Show Caption
			g.setDateDisplayFormat('mm/dd/yyyy');
			
			for(var i=0; i<json.length; i++){
				var item = json[i];
				g.AddTaskItem(new JSGantt.TaskItem(item.pID, item.pName, item.pStart, item.pEnd, null, null, null, null, item.pComp*100, item.pGroup, item.pParent, item.pOpen, 0));
			}
			g.Draw();
		}
		
		var _change_ = function(st){
			if(st == stat) return;
			
			if(oldObjs[stat]) oldObjs[stat].setIcon('styles/cmp/images/unchecked.gif');
			
			stat = st;
			
			if(oldObjs[stat]) oldObjs[stat].setIcon('styles/cmp/images/checked.gif');
			
			JSGantt.changeFormat(stat, window.g);
		}
		
		
		var _items = ['->', {
			xtype : 'button',
			text : 'Day',
			icon : 'styles/cmp/images/unchecked.gif',
			handler : function(){
				_change_('day');
			},
			listeners : {
				render : function(){
					oldObjs.day = this;
				}
			},
		}, {
			xtype : 'button',
			text : 'Week',
			icon : 'styles/cmp/images/checked.gif',
			handler : function(){
				_change_('week');
			},
			listeners : {
				render : function(){
					oldObjs.week = this;
				}
			},
		}, {
			xtype : 'button',
			text : 'Month',
			icon : 'styles/cmp/images/unchecked.gif',
			handler : function(){
				_change_('month');
			},
			listeners : {
				render : function(){
					oldObjs.month = this;
				}
			},
		}, {
			xtype : 'button',
			text : 'Quarter',
			icon : 'styles/cmp/images/unchecked.gif',
			handler : function(){
				_change_('quarter');
			},
			listeners : {
				render : function(){
					oldObjs.quarter = this;
				}
			},
		}];
		
		for(var a=reportSort.length-1; a>-1; a--){
			_items.unshift({
				xtype : 'button',
				text : reportSort[a],
				//icon : 'styles/cmp/images/change_green.png',
				enableToggle : true,
				handler : function(){
					_idx = reportSort.indexOf(this.getText());
					
					for(var x in oldObjs._btns){
						oldObjs._btns[x].toggle(false);
					}
					
					this.toggle(true);
					
					if(mee){
						$(mee.body.dom).empty();
						draw(mee);
					}
				},
				listeners : {
					render : function(){
						if(!oldObjs._btns) oldObjs._btns = {};
						oldObjs._btns[this.getText()] = this;
						if(this.getText() == reportSort[0]) this.toggle(true);
					}
				},
			})
		}
		
		
		return Ext.create("Ext.panel.Panel", {
	    	border: false,
	    	autoScroll: true,
	    	width : config.width + 10,
	    	height: config.height,
	    	collapsible : false,
			dockedItems: [{
				xtype : 'toolbar',
				dock : 'top',
				displayInfo : true,
				items : _items,
			}],
	    	listeners : {
	    		'render' : function(){
	    			var me = this;
	    			mee = me;
	    			draw(me);
	    			
	    			if(callback) callback();
	    		}
	    	}
	    });
	}
	
	Ext.namespace('DigiCompass.Web.app.TabPanelsForGanttChart')
	DigiCompass.Web.app.TabPanelsForGanttChart = function(tabPanel, data, tab, _tabName, callback){
		if(!tab) tab = "defaulteTab";
		var panel = [];
		var reportSortLen = data.reportSort.length
		for(var i=0; i<reportSortLen; i++){
			var config = {width: tabPanel.getWidth() < 1000 ? 1000 : tabPanel.getWidth() - 20, height: (tabPanel.getHeight() - 25) / reportSortLen,
							panelId: tab + "_rePanel" + i, tabName : _tabName} ;
			var reportSort = data.reportSort[i];
			panel.push(Ext.create("DigiCompass.Web.app.GanttChart", data.report, reportSort, config, callback))
		}
		return panel;
	}
	
})();