(function(){
	Ext.namespace("DigiCompass.Web.app.BoxPlots_ChartAndGrid")
	DigiCompass.Web.app.BoxPlots_ChartAndGrid = function(outPanel, dat, _tabName){
		var data = [];
		if(dat){
			data = myClone(dat)
		}
		var reportSort = data.reportSort[0];
		var count = reportSort.length;
		var DSort = [];
		var DrawSort = ["min", "downStddev", "mean", "upStddev", "max"];
		var tmpSortTmp = data.report[reportSort[0]].statusSort;
		data = data.report;
		for(var h=0; h<tmpSortTmp.length; h++){
			DSort.push(tmpSortTmp[h].name);
		}

		var totalHeight = outPanel.getHeight();
		var totalWidth = outPanel.getWidth();

		var gridData = [];
		var fields = {};
		var activeKey = null;
		gridData = initData(data);
		function initData(data){
			var res = {};
			for(var t=0; t<reportSort.length; t++){
				var re = [];
				for(var a in data[reportSort[t]].data){
					if(!activeKey){
						activeKey = a;
						for(var i in data[reportSort[t]].data[a]){
							fields[i] = [];
							for(var k in data[reportSort[t]].data[a][i]){
								if(DrawSort.indexOf(k) > -1) fields[i].push(k);
							}
						}
					}
					var tmp = {Title: a}
					for(var i in data[reportSort[t]].data[a]){
						for(var k in data[reportSort[t]].data[a][i]){
							tmp[i + "_" + k] = data[reportSort[t]].data[a][i][k]
						}
					}
					re.push(tmp);
				}
				res[reportSort[t]] = re;
			}
			return res;
		}
		function formatTitle(a){
			var tmpA = a.split(",");
			var len = tmpA[tmpA.length - 1].length;
			return a.substring(0, a.length - (len == a.length ? 0 : len + 1));
		}
		function formatDate(d){
			if(!d) return "N/A";
			var dd = new Date(d)
			return (dd.getMonth() + 1) + "/" + dd.getDate() + "/" + dd.getFullYear();
		}
		
		var grid = {
			getFields : function(f){
				var re = [{name: 'Title'}]
				for(var i=0; i<DSort.length; i++){
					for(var k=0; k<DrawSort.length; k++){
						re.push({name: DSort[i] + "_" + DrawSort[k]})
					}
				}
				return re;
			},
	        getCms : function(){
	        	var re = [{header: "Title", dataIndex: "Title", width: 80, align: 'left', renderer: formatTitle}];
	        	var tmpW = (totalWidth - 100) / (this.ff.length - 1);
	        	tmpW = tmpW < 60 ? 60 : tmpW;
	        	for(var i=0; i<DSort.length; i++){
	        		var items = []
	        		for(var k=0; k<DrawSort.length; k++){
	        			items.push({header: DrawSort[k], width: tmpW, dataIndex: DSort[i] + "_" + DrawSort[k], align: 'right', renderer: formatDate})
	        		}
	        		re.push({header: DSort[i], columns: items, align: 'center'});
	        	}
	        	return re;
	        },
	        ff : [],
			initGrid : function(){
				this.ff = this.getFields(fields);
				Ext.regModel('report', {
					fields: this.ff
				});
				var store = new Ext.data.JsonStore({
					model : 'report',
					data: {griddata: gridData[reportSort[count % reportSort.length]]},
					proxy: {
						type: 'memory',
						reader: {
							type: 'json',
							root: 'griddata'
						}
					}
		        });
				var gridPanel = Ext.create("Ext.grid.GridPanel", {
					border: false,
					layout: 'fit',
					region:'center',
					height: totalHeight,
					autoScroll: true,
			        store: store,
			        columns: this.getCms(),
				    listeners:{
						'viewready':function(g){
							if(gridData[reportSort[count % reportSort.length]].length) g.getSelectionModel().select(0)
						},
						'itemclick' : function(g, re, v){
							
						},
						'itemdblclick' : function(){
							countAdd(gridPanel)
						},
						'containerdblclick' : function(){
							countAdd(gridPanel)
						},
						'selectionchange' : function(g, s){
							if(s.length){
								activeKey = s[0].data.Title;
								chart.change();
								Ext.getCmp("boxPlotsReversalPanelId").setTitle(reportSort[count % reportSort.length] + " - " + formatTitle(s[0].data.Title))
							}
						},
						'containerclick' : function(){
							
						}
					}
				});
				var exportTbar = Ext.create('Ext.toolbar.Toolbar', {
					items : [ {
						xtype : 'button',
						text : 'Export',
						handler : function() {
							var title = reportSort[count % reportSort.length] + " - " + formatTitle(gridData[reportSort[count % reportSort.length]][0].Title);
							var columns = new Array();
							for(var i = 0; i < grid.ff.length; i++){
								columns.push(grid.ff[i].name);
							}
							var store = gridPanel.getStore();
							var datas = new Array();
							for(var i = 0; i < store.getCount(); i++){
								var record = store.getAt(i);
								var rowData = new Array();
								for(var j = 0; j < grid.ff.length; j++){
									rowData.push(record.get(grid.ff[j].name));
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
				gridPanel.addDocked(exportTbar);
				this.grid = gridPanel;
				return gridPanel;
			},
			grid : null
		};
		var chart = {
			margin : {top: 40, left: 90},
			svgH : 280,
			gWidth : 200,
			gSplice : 15,
			data : [],
			initChart : function(){
				var chartPanel = Ext.create("Ext.panel.Panel", {
					id : "boxPlotsPanelId",
					border: true,
			    	autoScroll: true,
			    	height: totalHeight,
			    	width: totalWidth,
			    	listeners : {
			    		'render' : function(){
			    			chart.init();
			    		}
			    	}
				})
				var exportButton = Ext.create('Ext.Button', {
					text : 'export',
					margin : 5,
					handler : function(){
						var svgEl = chartPanel.getEl().select("svg").elements[0];
						var s = new XMLSerializer();			
						var svgHtml = s.serializeToString(svgEl);
						var title = reportSort[count % reportSort.length] + " - " + formatTitle(gridData[reportSort[count % reportSort.length]][0].Title);
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
				chartPanel.add(exportButton);
				return chartPanel;
			},
			init : function(){
				var div = d3.select("#boxPlotsPanelId-body").append("div").style("overflow-y", 'auto')
	        	var s = div.append("svg").attr("class","svgBoxPlotsClass").style("margin-top", 20).attr("height", this.svgH + 100).attr("width", this.gWidth * DSort.length + 50)
	        	s.on("dblclick", function(){ countAdd(grid.grid); }).on("click", function(e){
	        		var g = grid.grid;
	        		var st = g.getStore();
	        		var num = st.indexOf(g.getSelectionModel().getSelection()[0]);
	        		num = num < 0 ? 0 : num;
	        		if(num + 2 > st.getCount()){
	        			num = 0;
	        		}else{
	        			num++;
	        		}
	        		g.getSelectionModel().select(num)
	        	});
	        	this.create(s);
			},
			create : function(s){
				this.data = data[reportSort[count % reportSort.length]].data[activeKey]
				for(var a=0; a<DSort.length; a++){
					var plot = s.append("g").attr("class", "plot plot" + a)
						.attr("transform", "translate(" + (this.margin.left + this.gWidth * a) + "," + (this.margin.top + this.svgH) + ")")
					var da = this.data[DSort[a]]
					plot.append("line").attr("x1", this.gWidth / (2*this.gSplice)).attr("x2", this.gWidth / (2*this.gSplice)).style("stroke","black").style("stroke-width", '1px')
						.attr("y1", this.yline(da[DrawSort[0]])).attr("y2", this.yline(da[DrawSort[4]])).style("stroke-dasharray", "4 4")
					plot.append("rect").attr("x", 0).attr("y", this.yline(da[DrawSort[3]])).style("stroke","#aaa").style("stroke-width", '1px')
						.attr("width", this.gWidth / this.gSplice).attr("height", this.yline(da[DrawSort[1]]) - this.yline(da[DrawSort[3]])).style("fill", "#fff")
					plot.selectAll(".line").data([da[DrawSort[0]] || 0, da[DrawSort[2]] || 0, da[DrawSort[4]] || 0]).enter().append("line")
						.attr("class", "line").style("stroke","#000").style("stroke-width", '1px')
						.attr("x1", function(d, i){ return (i & 1 ? 0 : chart.gWidth / (6*chart.gSplice)); })
						.attr("x2", function(d, i){ return (chart.gWidth / chart.gSplice) - (i & 1 ? 0 : chart.gWidth / (6*chart.gSplice)); })
						.attr("y1", function(d){ return chart.yline(d);}).attr("y2", function(d){ return chart.yline(d);})
					plot.selectAll(".text_boxPlot").data([da[DrawSort[0]] || 0, da[DrawSort[1]] || 0, da[DrawSort[2]] || 0, da[DrawSort[3]] || 0, da[DrawSort[4]] || 0]).enter()
						.append("text").attr("class", "text_boxPlot").attr("text-anchor", function(d, i){ return i & 1 ? "start" : "end";}).text(function(d){return formatDate(d);})
						.attr("x", function(d, i){ return i & 1 ? chart.gWidth / chart.gSplice + 5: -5; }).attr("y", function(d){ return chart.yline(d) + 3; })
					plot.append("text").attr("text-anchor", "middle").text(DSort[a]).attr("x", this.gWidth / (2*this.gSplice)).attr("y", -this.svgH - 25)
				}
			},
			change : function(){
				var s = d3.select(".svgBoxPlotsClass")
				s.selectAll(".plot").remove()
				this.create(s);
			},
			yline: function(v){
				var y = d3.scale.linear().domain([this.getMinAndMax(this.data)[0], this.getMinAndMax(this.data)[1]]).range([0, this.svgH]);
	        	return -y(v || 0);
			},
			getMinAndMax: function(d){
				var re = [-1, -1]
				for(var a=0; a<DSort.length; a++){
					for(var b=0; b<DrawSort.length; b++){
						var tmp = parseInt(this.data[DSort[a]][DrawSort[b]] || 0)
						if(!tmp) continue;
						if(re[0] > tmp || re[0] < 0) re[0] = tmp;
						if(re[1] < tmp || re[1] < 0) re[1] = tmp;
					}
				}
				if(re[0] < 0) re[0] = 0;
				if(re[1] < 0) re[1] = 0;
				return re;
			}
		};
		function countAdd(g){
			count++;
			g.getStore().loadData(gridData[reportSort[count % reportSort.length]]);
			if(gridData[reportSort[count % reportSort.length]].length) g.getSelectionModel().select(0)
			Ext.getCmp("boxPlotsReversalPanelId").setTitle(reportSort[count % reportSort.length] + " - " + formatTitle(gridData[reportSort[count % reportSort.length]][0].Title));
			chart.change()
		}

		var GRID_return = grid.initGrid()
		var CHART_return = chart.initChart()
		var reversalPanel = Ext.create('DigiCompass.Web.app.ReversalPanel', {
			border: false,
			id: "boxPlotsReversalPanelId",
//			width :totalWidth-2 ,
//			height: totalHeight - 25,
			front : GRID_return,
			back : CHART_return
		});
		return reversalPanel;
	}

})()