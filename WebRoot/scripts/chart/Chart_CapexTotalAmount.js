//调用方法设置参数
function Chart_CapexTotalAmount(jsondata,divId){
	this.divid = divId;
	this.jsondata = jsondata;
	var CapexTotalAmountDiv = divId;
	div = d3.select("body").select("#"+CapexTotalAmountDiv);
	var CapexTotalAmount_svg = div.append("svg")
		.attr("class","CapexTotalAmount_svg"+CapexTotalAmountDiv)
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	CapexTotalAmountChart(jsondata,divId,CapexTotalAmount_svg);
	CapexTotalAmountWindow = function(){
		if(document.documentElement.clientWidth>1000){
			width = document.documentElement.clientWidth -365 - margin.left - margin.right;
			height = 250 - margin.top - margin.bottom;
			Capexx0 = d3.scale.ordinal()
			    .rangeRoundBands([0, width-370], .1);
			Capexx1 = d3.scale.ordinal();
			Capexy = d3.scale.linear()
				.range([height, 0]);
			CapexxAxis = d3.svg.axis()
			    .scale(Capexx0)
			    .orient("bottom");
			CapexyAxis = d3.svg.axis()
			    .scale(Capexy)
			    .orient("left")
			    .tickFormat(d3.format(".2s"));
			d3.selectAll(".CapexTotalAmount_svg"+CapexTotalAmountDiv)
				.remove();
			div = d3.select("body").select("#"+CapexTotalAmountDiv)
			CapexTotalAmount_svg = div.append("svg")
				.attr("class","CapexTotalAmount_svg"+CapexTotalAmountDiv)
		       .attr("width", width + margin.left + margin.right)
		       .attr("height", height + margin.top + margin.bottom)
			   .append("g")
		       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			CapexTotalAmountChart(jsondata,divId,CapexTotalAmount_svg);
		  				
	  			}
		};
	}
function getCapexData(jsondata){
	var jsontotal = [];
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalOption = {};
		TotalOption["Totadata"] = columnHeader[i][1];
		for ( var j = 0; j < rowHeader.length; j++) {
			TotalOption[trim(rowHeader[j][1])] = data[j][i][1];
		}
		jsontotal.push(TotalOption);
	}
	return jsontotal;
}

function CapexTotalAmountChart(jsondata,divId,svg){
	d3.selectAll(".CapexTotalAmount_svg"+divId).attr("width",document.documentElement.clientWidth -365);
  // var jsonq = typedata(jsondata);
	var data=getCapexData(jsondata);
	var rowHeader = d3.keys(data[0]).filter(function(key) { return key !== "Totadata"; });
  	var totalinfo=[];
 	data.forEach(function(d) {
	 	d.information =rowHeader.map(function(name) { 
	 	 
	    return {name:name,value:+d[name]};
	     });
  	});
  	Capexx0.domain(data.map(function(d) { return d.Totadata; }));
  	//x2.domain(totalinfo.map(function(d) { return d.value; }));
 	Capexx1.domain(rowHeader).rangeRoundBands([0, Capexx0.rangeBand()]);
  	Capexy.domain([0, d3.max(data, function(d) {
	  return d3.max(d.information, function(d) { 
	 	 return d.value; }); 
	 	 })
	  ]);
	  
	svg.selectAll(".axis,.legend")
		.remove();
	svg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",Capexx0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	svg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();
  	svg.append("g")
		.attr("class", "Capex axis")
		.attr("transform", "translate(0, 0)")
		.attr("transform", "translate(0," + height + ")")
		.call(CapexxAxis);
	svg.append("g")
		.attr("class", "Capexy axis")
		.call(CapexyAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");
	var state = svg.selectAll(".Totadata")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + Capexx0(d.Totadata) + ",0)"; });

	state.selectAll("rect")
		.data(function(d) { return d.information; })
		.enter()
		.append("rect")
		.attr("class","bar")
		.on("click",function(){CapexTotalAmountChart(jsondata,divId,svg);})
		.attr("title",function(d){return d.value;})
		.attr("y", function(d) { return height; })
		.style("fill", function(d) { return color(d.name); })
		.attr("x",Capexx0.rangeBand()/2)
		.transition()
		.duration(1000)
//		.attr("height", function(d) { return height - Capexy(d.value); })
//		.style("fill", function(d) { return color(d.name); })
		.attr("x", function(d) { return Capexx1(d.name); })
//		.transition()
//		.duration(1000)
//		.attr("x", function(d,i) { return Capexx1(d.name); })
		.attr("width", Capexx1.rangeBand())
		.attr("y", function(d) { return Capexy(d.value); })
//		.transition()
//		.duration(1000)
		.attr("height", function(d) { return height - Capexy(d.value); })
//		.attr("width", Capexx1.rangeBand())
	 	 ;
//	state.selectAll("rect")
//		.data(function(d) { return d.information; })
//		.enter().append("rect")
//		.attr("class","bar")
//		.attr("title",function(d){return d.value;})
//		.on("click",function(){SubcribersFirstChart(jsondata,divId,Subscribers_svg);})
//		.attr("y", function(d) { return height; })
//		//.attr("height", function(d) { return height - Subscribersy(d.value); })
//		.style("fill", function(d) { return color(d.name); })
//		.attr("x",Subscribersx0.rangeBand()/2)
//		.transition()
//		.duration(1000)
//		.attr("x", function(d) { return Subscribersx1(d.name); })
//		.attr("width", Subscribersx1.rangeBand())
//		.attr("y", function(d) { return Subscribersy(d.value); })
//		.attr("height", function(d) { return height - Subscribersy(d.value); })
//		; 	 

  	var legend = svg.selectAll(".legend")
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