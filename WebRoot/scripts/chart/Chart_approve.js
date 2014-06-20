function Chart_Statement(jsondata,divId,dheight,dwidth){
//	dheight = dheight-200;
	this.divid = divId;
	//this.jsondata = jsondata;
	Statementx0 = d3.scale.ordinal()
		.rangeRoundBands([0, dwidth-370], 0.0);
	Statementx1 = d3.scale.ordinal();
	Statementy = d3.scale.linear()
		.range([dheight*0.8, 0]);
 	StatementxAxis = d3.svg.axis()
 		.scale(Statementx0)
 		.orient("bottom");
	StatementyAxis = d3.svg.axis()
		.scale(Statementy)
		.orient("left")
		.tickFormat(d3.format(".2s"));
	var StatementTotalAmountDiv = divId;
	d3.selectAll(".StatementTotalAmount_svg"+StatementTotalAmountDiv)
		.remove();
	div = d3.select("body").select("#"+StatementTotalAmountDiv);
	StatementTotalAmount_svg = div.append("svg")
		.attr("class","StatementTotalAmount_svg"+StatementTotalAmountDiv)
       .attr("width", dwidth + margin.left + margin.right)
       .attr("height", dheight + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	StatementTotalAmountChart(jsondata,divId,StatementTotalAmount_svg,dheight*0.8,dwidth);
	StatementTotalAmountWindow = function(){
		if(dwidth>800){
			//width = document.documentElement.clientWidth -365 - margin.left - margin.right;
			//height = 250 - margin.top - margin.bottom;
			Statementx0 = d3.scale.ordinal()
			    .rangeRoundBands([0, dwidth-370], .0);
			Statementx1 = d3.scale.ordinal();
			Statementy = d3.scale.linear()
				.range([dheight*0.8, 0]);
			StatementxAxis = d3.svg.axis()
			    .scale(Statementx0)
			    .orient("bottom");
			StatementyAxis = d3.svg.axis()
			    .scale(Statementy)
			    .orient("left")
			    .tickFormat(d3.format(".2s"));
			d3.selectAll(".StatementTotalAmount_svg"+StatementTotalAmountDiv)
				.remove();
			div = d3.select("body").select("#"+StatementTotalAmountDiv);
			StatementTotalAmount_svg = div.append("svg")
				.attr("class","StatementTotalAmount_svg"+StatementTotalAmountDiv)
		       .attr("width", dwidth + margin.left+ margin.right)
		       .attr("height", dheight+margin.top+ margin.bottom)
			   .append("g")
		       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			StatementTotalAmountChart(jsondata,divId,StatementTotalAmount_svg,dheight*0.8,dwidth);
		  				
	  			}
		};
	}
//function getCapexData(jsondata){
//	var jsontotal = [];
//	var data = jsondata.BUSINESS_DATA.rawData.data;
//	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
//	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
//	for ( var i = 0; i < columnHeader.length; i++) {
//		var TotalOption = {};
//		TotalOption["Totadata"] = columnHeader[i][1];
//		for ( var j = 0; j < rowHeader.length; j++) {
//			TotalOption[trim(rowHeader[j][1])] = data[j][i][1];
//		}
//		jsontotal.push(TotalOption);
//	}
//	return jsontotal;
//}
function StatementTotalAmountChart(jsondata,divId,Statement_svg,height,width){
	d3.selectAll(".StatementTotalAmount_svg"+divId)
		.attr("width", width + margin.left+ margin.right)
		.attr("height", height + margin.top+ margin.bottom);
	var data = [myClone(jsondata)];
//	var data = [Object.create(jsondata)];
//	data.push(jsondata);
	var rowHeader = d3.keys(data[0]);
 	data.forEach(function(d) {
// 		if(d.information){
// 			delete d.information;
// 		}
	 	d.information =rowHeader.map(function(name) { 
	 	   return {name:name,value:+d[name]};
	     });
  	});
  	
  	Statementx0.domain(data[0]["information"].map(function(d){return d["name"];}));
 	Statementx1.domain(rowHeader).rangeRoundBands([0, Statementx0.rangeBand()]);
  	Statementy.domain([0, d3.max(data, function(d) {
  		return d3.max(d.information,function(d){return d.value;});
	 	 })
	  ]);
	  
	Statement_svg.selectAll(".axis,.legend")
		.remove();
	Statement_svg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",Statementx0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	Statement_svg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();
  	Statement_svg.append("g")
		.attr("class", "Statementx axis")
		.attr("transform", "translate(0," + height + ")")
		.call(StatementxAxis);
	Statement_svg.append("g")
		.attr("class", "Statementy axis")
		.call(StatementyAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Population");
	var state = Statement_svg.selectAll(".Totadata")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("transform", function(d,i) { return "translate(" + Statementx0(d) + ",0)"; });

	state.selectAll("rect")
		.data(data[0].information)
		.enter()
		.append("rect")
		.attr("class","bar")
//		.on("click",function(){StatementTotalAmountChart(jsondata,divId,svg);})
		.attr("title",function(d){return d.value;})
		.attr("height",0)
		.attr("y", function(d) { return height; })
		.style("fill", function(d) { return color(d.name); })
//		.attr("x",Capexx0.rangeBand()/2)
		.transition()
		.duration(1000)
		.attr("x", function(d) { return Statementx0(d.name); })
		.attr("width", Statementx0.rangeBand())
		.attr("y", function(d) { return Statementy(d.value); })
		.attr("height", function(d) { return height - Statementy(d.value); })
	 	 ;

  	var legend = Statement_svg.selectAll(".legend")
		.data(rowHeader.slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		//.attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; })
		;//右上角显示的数据位置

	legend.append("rect")
		.attr("x", width - 178)
		.attr("y", 0)
		.transition()
		.duration(1000)
		.attr("y",function(d, i) { return i * 20 ; })
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 184)
		.attr("y", 9)
		.attr("dy", 0)
		.transition()
		.duration(1000)
		.attr("dy",function(d, i) { return i * 20 ; })
		//.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
}