(function(){
	Ext.namespace('DigiCompass.Web.app.autoFitSimpleGrid');
	DigiCompass.Web.app.autoFitSimpleGrid = function(dat, keySort, reportSort, config){
		var data = myClone(dat);
		var panelId = config.panelId || "defaultPanelId";
		var configSvgId = config.svgId || "defaultSvgId";
		var titleStr = {ALL_OF_CR_REPORT : 'Number of Change Requests'
						,CR_OF_SERVICE_REPORT : 'Number of Services per Change Request'
						,SERVICE_OF_SERVICE_REPORT : 'Number of Services'
						,SITE_OF_CR_REPORT : 'Number of Change Requests per Site'
						,SITE_OF_SERVICE_REPORT : 'Number of Services per Site'
						}
		var headerStr = {Total : 'Total'
						,Title : 'Title'
 						,Approved : 'Change Approved'
					 	,Rejected : 'Change Rejected'
					 	,Released : 'Change Released'
 						//,Canceled : 'Change Cancelled'
				 		,Accept : 'Work Assigned'
				 		,OnHold : 'Work On Hold'
				 		//,'Work Cancelled' : 'Work Cancelled'
				 		,Complete : 'Work Complete'
						,Completing : 'Work Accepted'
						,Canceled : 'Change Cancelled'
				 		,'Work Cancelled' : 'Work Cancelled'
						}
		var rectColor = {Approved: "#8bd2ee" 
						,Rejected: "#EBAA75"
						,Canceled: "#E4893F"
						,Released: "#24ABE0"
						,Accept: "#aaf3b4"
						,OnHold: "#5ee871"
						,Completing: "#148f25"
						,Complete: "#1dcd35"
						,'Work Cancelled': "#c96a1d"
						}
						
		if(data){
			for(var w=0; w<reportSort.length; w++){
				var tmpData = [];
				for(var u in data[reportSort[w]]){
					var tmpDa = data[reportSort[w]][u]
					var tmpU = u.split(",");
					var len = tmpU[tmpU.length - 1].length;
					tmpDa.Title = u.substring(0, u.length - (len == u.length ? 0 : len + 1));
					tmpData.push(tmpDa)
				}
				data[reportSort[w]] = tmpData.slice()
			}
			
		}
		
		//Tag switching chart, according to the position clicks into a diagram
		var count = reportSort.length;
		
		var fields = getFields(data[reportSort[0]]);

		//create model 
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
					//width: config.width,
					height: config.height - 50,
					autoScroll: true,
	    	        store: store, 
	    	        columns: getCms(fields),
	    		    listeners:{
						'viewready':{
							fn : function(grid) {
								Ext.getCmp(panelId).setTitle(titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length]);
							},
							scope : this
						},
						'itemclick' : function(){
							changeGridData()
						},
						'containerclick' : function(){
							changeGridData()
						}
					}
	            });
	            
//	get draw chart data			
	var chartData = changeGridDataToChartData(data);
/*
 *on pannel draw svg
 */
	var initBulletPanel = function(size){
		return Ext.create("Ext.panel.Panel",{
		//layout : 'fit',
		id: size ? (panelId+"showOut") : config.svgId,
		border: false,
	    height: size ? size : (config.height - 50),
	    autoScroll: true,
		drawChart:function(){
	        var target = d3.select("#" + this.id + "-body")
				.append("div")
				.style("overflow-y", 'auto');
	        //at every turn would delete all svg from "target",then  add svg		
			target.selectAll("svg").remove();
	        var targetsvg = target.append("svg")
      			.attr("class","targetsvg")
      			.style("overflow", "auto")
      			.style("margin-top", 20);
      		//draw chart	
  			chartdrow(chartData,targetsvg);
  			//draw  legend
  			//['Approved', 'Rejected', 'Released', 'Canceled', 'Accept', 'OnHold', 'Work Cancelled', 'Complete', 'Completing']
      		//var legendColor = ["#8bd2ee","#24ABE0","#aaf3b4","#5ee871","#1dcd35","#148f25","#EBAA75","#E4893F","#c96a1d"];
      		var legend = targetsvg.selectAll(".legend")
					.data(keySort.slice())
					.enter().append("g")
					.attr("class", "legend")
			
				legend.append("rect")
					.attr("x", config.width - 178)
					.attr("y", 0)
					.transition()
					.duration(1000)
					.attr("y",function(d, i) { return i * 20 ; })
					.attr("width", 18)
					.attr("height", 18)
					.style("fill", function(d, i) { return rectColor[keySort[i]] || "#000"; });
			
				legend.append("text")
					.attr("x", config.width - 184)
					.attr("y", 9)
					.attr("dy", 0)
					.transition()
					.duration(1000)
					.attr("dy",function(d, i) { return i * 20 ; })
					//.attr("dy", ".35em")
					.style("text-anchor", "end")
					.text(function(d) { return headerStr[d] || d; });  	
			},
			listeners:{
				render:function(){
					this.drawChart();
				}
			}
		});
	}
	//execute initBulletPanel()
	var bulletsvgpannel = initBulletPanel();
	
	//begin draw chart
	var chartdrow = function(chartData,mydiv) {
		var margin = {top: 5, right: 40, bottom: 20, left: 130},
		    width = config.width - margin.left - margin.right - 400,
		    height = 50 - margin.top - margin.bottom;

		var chartDatalength = chartData.length;
		var data=[];
		data = chartData[count%chartDatalength];
		var chart = d3.bullet()
		    .width(width)
		    .height(height);
		var time = data.length;
		mydiv.selectAll("svg").remove();
		//clone element
		/**function clonesvg(nodes){
		    nodes.each(function(d, i) {
		      nodes[0][i] = this.parentNode.insertBefore(this.cloneNode(true),
				this.nextSibling);
		    });
			return nodes;
		}*/
  		var div = mydiv.attr("height", time*75  > (config.height - 5) ? time*50 : (config.height - 5));
			var chartsvg = div.selectAll(".bullet")
			      	.data(data)
			      	.enter()
			      	.append("svg")
			      	.attr("class", function(d,i){return "bullet"+" bullet"+i + " tmp" + count+" bullsvg"})
			      	.on("click",function(){
		          		CountAdd(panelId);
		          		var selectbullet =  div.selectAll("svg");
						selectbullet.transition().duration(500).attr("height",0).attr("y",0).remove();
						selectbullet.selectAll("g").transition().duration(500).style("opacity", 1e-6).remove();
						div.transition().delay(500).each("end",function(){ chartdrow(chartData,div);});	
		          	})
				    .attr("y",0)
				    .attr("height", height + margin.top + margin.bottom)
				    .attr("width", width + margin.left + margin.right)
				    .append("g")
				    .attr("class","bullet_g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;
			  chart(chartsvg ,div,time);
	
			  var title = chartsvg.append("g")
			      .style("text-anchor", "end")
			      .attr("transform", "translate(-6," + height / 2 + ")");
				
			  title.append("text")
			      .attr("class", "title")
			      .style("fill","white")
			      .transition()
			      .duration(1000)
			      .style("fill","black")
			      .text(function(d) { return d.title; });
			
			  title.append("text")
			      .attr("class", "subtitle")
			      .attr("dy", "1em")
			      .style("fill","white")
			      .transition()
			      .duration(1000)
			      .style("fill","black")
			      .text(function(d) { return d.subtitle; });
	}
	
		var changeGridData = function(){
			CountAdd(panelId);
	        var target1 = d3.select("#" + panelId+"showOut-body").select(".targetsvg")
	        var target2 = d3.select("#" + configSvgId + "-body").select(".targetsvg")
	        if(target1){
	        	chartdrow(chartData,target1)
	        }
	        if(target2){
	        	chartdrow(chartData,target2)
	        }
		}
	

		var showTheChart = function(){
			showButton.setDisabled(true);
			if(window.parent["_dlg_" + panelId]){
				return 	window.parent["_dlg_" + panelId].show()
			}
			var child = initBulletPanel(600);
			child.setHeight(600)
			child.setBorder(false)
			var dlg = Ext.create('Ext.Window', {
					width: config.width, 
					modal: false, 
					closable: true, 
					plain: false, 
					resizable: false, 
					shadow: true,
					listeners : {
						'beforeclose' : function(){
							dlg.hide();
							showButton.setDisabled(false);
							return false;
						}
					}
				});
			dlg.add(child)
			dlg.show();
			window.parent["_dlg_" + panelId] = dlg;
		}
		
		var showButton = Ext.create('Ext.Button', {
			text : 'show the chart',
			margin : 5,
			handler : showTheChart
		});
		
		/*
		 * bullet chart,The method called draw diagrams cycle call
		 */

		d3.bullet = function() {
		  var orient = "left",
		      reverse = false,
		      duration = 0,
		      ranges = bulletRanges,
		      markers = bulletMarkers,
		      measures = bulletMeasures,
		      width = 380,
		      height = 30,
		      tickFormat = null;
		  // For each small multiple…
		  function bullet(g,target,time) {
		  		var durationtime = 100*time;
		    	if(durationtime>2000)durationtime = 2000;
		    g.each(function(d, i) {
	    	  target.selectAll(".bullet"+i)
				.style("opacity", 1e-4)
	          	.transition()
				.duration(durationtime)
	          	.attr("y",i*50)
	          	.attr("height", height + margin.top + margin.bottom)
	          	.style("opacity", 1);
		      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
		         markerz = markers.call(this, d, i).slice().sort(d3.descending),
		         measurez = measures.call(this, d, i).slice().sort(d3.descending),
		         g = d3.select(this);
	
		      // Compute the new x-scale.
		      var x1 = d3.scale.linear()
		         .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
		         .range(reverse ? [width, 0] : [0, width]);
	
		      // Retrieve the old x-scale, if this is an update.
		      var x0 = this.__chart__ || d3.scale.linear()
		         .domain([0, Infinity])
		         .range(x1.range());
	
		      // Stash the new scale.
		      this.__chart__ = x1;
	
		      // Derive width-scales from the x-scales.
		      var w0 = bulletWidth(x0),
		         w1 = bulletWidth(x1);
	
		      var rangesColor = d3.scale.linear().domain([0, 1]).range(['#eee', '#ccc']);
		          
		      // Update the range rects.
		      var range = g.selectAll("rect.range")
		         .data(rangez);
	
		      range.enter().append("rect")
		         .attr("class", function(d, i) { return "range s" + i; })
		         .style('fill', function(d, i){ return rangesColor(i); })
		         .attr("height", height)
		         ;
	
		      range.attr("x", reverse ? x1 : 0)
		         .attr("width", w1)
		         .attr("height", height);
		     
		    /*measureColor
			  var keySort = [ , 'Accept' "#aaf3b4", 'OnHold' "#5ee871", 'Complete' "#1dcd35", 'Completing' "#148f25", 'Work Cancelled' "#c96a1d"];
			  var keySort = ['Approved', 'Rejected', 'Canceled', 'Released', 'Accept', 'OnHold', 'Complete', 'Completing', 'Work Cancelled'];
			  var measureColor = ['Approved' "#8bd2ee" , 'Rejected' "#EBAA75", 'Canceled' "#E4893F",'Released' "#24ABE0",'Accept' "#aaf3b4", 'OnHold' "#5ee871",  'Completing' "#148f25",'Complete' "#1dcd35", 'Work Cancelled' "#c96a1d"];
			  measureColor = ["#8bd2ee","#36b2e2","#1984ae","#aaf3b4","#5ee871","#1dcd35","#148f25","#edb07e","#c96a1d"];*/
		     
		      // Update the measure rects.
		      var measure = g.selectAll("rect.measure")
		         .data(measurez);
		      measure.enter().append("rect")
		         .attr("class", function(d, i) { return "measure s" + i; })
		         .attr("height", height / 3)
		         .attr("y", height / 3)
		         .style("fill", function(d, i){ return rectColor[keySort[i]] || "#000"; })
		         .attr("width", w1)
		         .attr("x", reverse ? x1 : 0);
	
		      measure.attr("width", w1)
		         .attr("height", height / 3)
		         .attr("x", reverse ? x1 : 0)
		         .attr("y", height / 3);
	
		      // Update the marker lines.
		      var marker = g.selectAll("line.marker")
		         .data(markerz);
	
		      marker.enter().append("line")
		         .attr("class", "marker")
		         .style("stroke","black").style("stroke-width", '2px')
		         .attr("y1", height / 6)
		         .attr("y2", height * 5 / 6)
		         .attr("x1", x1)
		         .attr("x2", x1);
	
		      marker.attr("x1", x1)
		         .attr("x2", x1)
		         .attr("y1", height / 6)
		         .attr("y2", height * 5 / 6);
	
		      // Compute the tick format.
		      var format = tickFormat || x1.tickFormat(8);
	
		      // Update the tick groups.
		      var tick = g.selectAll("g.tick")
		         .data(x1.ticks(8), function(d) {
		            return this.textContent || format(d);
		          });
	
		      // Initialize the ticks with the old scale, x0.
		      var tickEnter = tick.enter().append("g")
		         .attr("class", "tick")
		         .attr("transform", bulletTranslate(x0))
		         .style("opacity", 1e-6);
	
		      tickEnter.append("line")
		      	 .style("stroke","black").style("stroke-width", '0.5px')
		         .attr("y1", height)
		         .attr("y2", height * 7 / 6);
	
		      tickEnter.append("text")
		         .attr("text-anchor", "middle")
		         .attr("dy", "1em")
		         .attr("y", height * 7 / 6)
		         .text(format);
	
		      // Transition the entering ticks to the new scale, x1.
		      tickEnter.attr("transform", bulletTranslate(x1))
		         .style("opacity", 1);
	
		      // Transition the exiting ticks to the new scale, x1.
		      tick.exit()
				.attr("transform", bulletTranslate(x1))
		        .style("opacity", 1e-6)
		        .remove();
		    });
		  //  d3.timer.flush();
		  }
	
		  // left, right, top, bottom
		  bullet.orient = function(x) {
		    if (!arguments.length) return orient;
		    orient = x;
		    reverse = orient == "right" || orient == "bottom";
		    return bullet;
		  };
	
		  // ranges (bad, satisfactory, good)
		  bullet.ranges = function(x) {
		    if (!arguments.length) return ranges;
		    ranges = x;
		    return bullet;
		  };
	
		  // markers (previous, goal)
		  bullet.markers = function(x) {
		    if (!arguments.length) return markers;
		    markers = x;
		    return bullet;
		  };
	
		  // measures (actual, forecast)
		  bullet.measures = function(x) {
		    if (!arguments.length) return measures;
		    measures = x;
		    return bullet;
		  };
	
		  bullet.width = function(x) {
		    if (!arguments.length) return width;
		    width = x;
		    return bullet;
		  };
	
		  bullet.height = function(x) {
		    if (!arguments.length) return height;
		    height = x;
		    return bullet;
		  };
	
		  bullet.tickFormat = function(x) {
		    if (!arguments.length) return tickFormat;
		    tickFormat = x;
		    return bullet;
		  };
	
		/**  bullet.duration = function(x) {
		    if (!arguments.length) return duration;
		    duration = x;
		    return bullet;
		  };*/
	
		  return bullet;
		}
	
		/*
		 * Parse data
		 */
		function changeGridDataToChartData(d){
			var re = []
			for(var i=0; i<reportSort.length; i++){
				var dd = d[reportSort[i]];
				var toBigNum = function(num){
					var p = ("" + num).length - 2
					return (Math.round(parseInt(num) / (Math.pow(10, p))) + 1) * Math.pow(10, p)
				}
				var maxN = -1
				for(var t in dd){
					if(maxN < dd[t].Total){
						maxN = dd[t].Total
					}
				}
				maxN = maxN > 0 ? toBigNum(maxN) : 0;
				var rr = [];
				for(var y in dd){
					var tmp = {}
					tmp.title = dd[y].Title;
					tmp.subtitle = ''
					tmp.ranges = [dd[y].Total, maxN]
					tmp.markers = [dd[y].Total]
					tmp.measures = []
					for(var q=0; keySort[q]; q++){
						tmp.measures.push(dd[y][keySort[q]] || 0)
					}
					rr.push(tmp)
				}
				re.push(rr)
			}
			return re
		}
	
		
		function getFields(data0){
			var f = [];
			for(var x in data0){
				if(typeof x == 'string'){
					f.push({name: 'Title'})
					f.push({name: 'Total'})
					for(var w=0; w<keySort.length; w++){
						f.push({name: keySort[w]})
					}
					for(var y in data0[x]){
						if(typeof y == "string" && y != 'Title' && y != 'Total' && keySort.indexOf(y) == -1){
							f.push({name: y})
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
				c.push({header: headerStr[f[a].name] || f[a].name, dataIndex: f[a].name, 
					align: f[a].name == "Title" ? 'left' : 'right', width: w, renderer: function(v){ return v || 0;}})
			}
			return c;
		}
		
		
		function CountAdd(id){
			count++;
			if(!showButton.isDisabled()){
				Ext.getCmp(id).setTitle(titleStr[reportSort[count % reportSort.length]] || reportSort[count % reportSort.length])
				grid.getStore().loadData(data[reportSort[count % reportSort.length]]);
			}
		}
		bulletsvgpannel.add(showButton)
		return {grid: grid, chart: bulletsvgpannel};
	}
	
	
	/*
	 * The following these methods,Deal with the parameters of the bullet.
	 */
	
	function bulletRanges(d) {
		return d.ranges;
	}

	function bulletMarkers(d) {
	    return d.markers;
	}

	function bulletMeasures(d) {
	    return d.measures;
	}

	function bulletMeasuresLen(d){
		return d.measures.length;
	}

	function bulletTranslate(x) {
		return function(d) {
		    return "translate(" + x(d) + ",0)";
		};
	}

	function bulletWidth(x) {
	  var x0 = x(0);
	  return function(d) {
	    return Math.abs(x(d) - x0);
	  };
	}
	
	
	Ext.namespace('DigiCompass.Web.app.autoFitSimpleGrid_createPanel');
	DigiCompass.Web.app.autoFitSimpleGrid_createPanel = function(data, keySort, reportSort, config){
		var tmp = Ext.create("DigiCompass.Web.app.autoFitSimpleGrid", data, keySort, reportSort, config);
		var tmpId = config.panelId;
		var tmpH = config.height;
		var tmpChart = tmp.chart;
		var tmpGrid = tmp.grid;
		var panel = Ext.create('DigiCompass.Web.app.ReversalPanel', {
			id: tmpId,
			height: tmpH,
			front : tmpChart,
			back : tmpGrid
		});
		return panel;
	}
	
})();