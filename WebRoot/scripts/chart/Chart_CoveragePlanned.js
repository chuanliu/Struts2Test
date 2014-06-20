
//调用方法设置参数
function Chart_CoveragePlanned(jsondata,divId){
	this.divid = divId;
	this.jsondata = jsondata;
	var CoveragePlannedDiv = divId;
	var div = d3.select("body").select("#"+CoveragePlannedDiv);
	var CoveragePlanned_svg = div.append("svg")
		.attr("class","CoveragePlanned_svg"+CoveragePlannedDiv)
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g") 
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	CoverAgeTotalChart(jsondata,CoveragePlanned_svg,divId);
	CoveragePlannedWindow = function(){
		if(document.documentElement.clientWidth>1000){
			width = document.documentElement.clientWidth -365 - margin.left - margin.right,
			height = 250 - margin.top - margin.bottom;
			Coverageplannedx0 = d3.scale.ordinal()
				.rangeRoundBands([0, width-370], .1);
			Coverageplannedx1 = d3.scale.ordinal();
			CoverageplannedLineX= d3.scale.linear();
			CoverageplannedChartY = d3.scale.linear()
				.range([height, 0]);
			CoverageplannedLineY = d3.scale.linear()
				.range([height, 0]);
			CoverageplannedxAxis = d3.svg.axis()
				.scale(Coverageplannedx0)
				.orient("bottom");
			CoverageplannedyAxisLeft = d3.svg.axis()
				.scale(CoverageplannedChartY)
				.orient("left")
				.tickFormat(d3.format(".2s"));
			CoverageplannedyAxisRight = d3.svg.axis()
				.scale(CoverageplannedLineY)
				.orient("right")
				.tickFormat(d3.format(".2s"));
			Coverageplannedline = d3.svg.line()
				.x(function(d) { return CoverageplannedLineX(d.time); })
				.y(function(d) { return CoverageplannedLineY(d.money); });
			d3.selectAll(".CoveragePlanned_svg"+CoveragePlannedDiv)
				.remove();
			div = d3.select("body").select("#"+CoveragePlannedDiv)
			CoveragePlanned_svg = div.append("svg")
				.attr("class","CoveragePlanned_svg"+CoveragePlannedDiv)
		       .attr("width", width + margin.left + margin.right)
		       .attr("height", height + margin.top + margin.bottom)
		       .append("g")
		       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			CoverAgeTotalChart(jsondata,CoveragePlanned_svg,divId);
		}
	
	}
	//CoverAgeThridTotalChart();
	
}
	
	
function CoverAgeTotalMoney(jsondata){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalMoney=[];
	var TotalMoneyAll = {};
	//从最后面算总金钱的行开始遍历，减去最后一行所有金钱的行
	for ( var j = 0; j < rowHeader.length; j++) {
		var TotalMoneys=[];
		if(trim(rowHeader[j][1])=="Total"){
			if(data[j]){
				for ( var i = 0; i < data[j].length; i++) {
					var TotalMoneyPlace = {};
					//TotalMoneyPlace["time"] = "year"+(i+1);
					TotalMoneyPlace["time"] = (i+1);
					if(data && data[j] && data[j][i] && data[j][i][1]){
						TotalMoneyPlace["money"] = data[j][i][1];
					}else{
						TotalMoneyPlace["money"] = 0;
					}
					TotalMoneys.push(TotalMoneyPlace);
				}
			}
			TotalMoneyAll[trim(rowHeader[j][1])+trim(rowHeader[j][2])] = TotalMoneys;	
			}
	}
	TotalMoney.push(TotalMoneyAll);
return TotalMoney;
}
/*
 * 解析JSON数据得到关于数量总和的数组
 */
function getCoverAgeTotalNOData(jsondata){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalNOData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalNODatas={};
		for(var n = 0;n<rowHeader.length;n++){
			if(rowHeader[n][3]===""){
				continue;//结束改循环
			}
			TotalNODatas[trim(rowHeader[n][1])]=0;
		}
		TotalNODatas["time"]=columnHeader[i][1];
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][4]=="Qty"){
				if(rowHeader[j][3]===""){
					continue;//结束该循环
				}
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalNODatas[trim(rowHeader[j][1])] += data[j][i][1];
				}
			}
		}
		TotalNOData.push(TotalNODatas);
	}
	return TotalNOData;
}	

/*
 * 解析JSON数据得到关于各个类型数量总和的数组
 */
function getCoverAgeTotalNODatas(jsondata){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalNOData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalNODatas={};
		for ( var k = 0; k < rowHeader.length; k++) {
			//if(rowHeader[k][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[k][4]==="Qty"){
				
			TotalNODatas[trim(rowHeader[k][2])]=0;
			}
		}
		TotalNODatas["time"]=columnHeader[i][1];
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			//if(rowHeader[j][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[j][4]==="Qty"){
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalNODatas[trim(rowHeader[j][2])] += data[j][i][1];
				}
			}
		}
		TotalNOData.push(TotalNODatas);
	}
	return TotalNOData;
}
/*
 * 解析JSON数据得到关于各个类型金钱总和的数组
 */
function getCoverAgeTotalMoneyDatas(jsondata){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalMOneyData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalMoneyDatas={};
		for ( var k = 0; k < rowHeader.length; k++) {
			//if(rowHeader[k][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[k][4]==="Amount"){
				
			TotalMoneyDatas[trim(rowHeader[k][2])]=0;
			}
		}
		TotalMoneyDatas["time"]=columnHeader[i][1];
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			//if(rowHeader[j][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[j][4]==="Amount"){
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalMoneyDatas[trim(rowHeader[j][2])] += data[j][i][1];
				}
			}
		}
		TotalMOneyData.push(TotalMoneyDatas);
	}
	return TotalMOneyData;
}
function getCoverAgeTotalMoneyTypeData(json){
	var TotalMOneyData = getCoverAgeTotalMoneyDatas(json);
	var MoneyType = d3.keys(TotalMOneyData[0]).filter(function(key) { return key !== "time"; });
	var type={};
	var types=[];
	MoneyType.map(function(name) {
		var typeData={};
		var typeDatas=[];
		TotalMOneyData.forEach(function(d) {
			typeData=  {money:d[name],time:d["time"]};
			typeDatas.push(typeData);
		});
			type[name]=typeDatas;
			
	});
	types.push(type);
	return types;
}
/*
 * 解析json关于各个分支频段的数量数组
 */
/*function getChannelData(json){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalNOData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalNODatas={};
		for ( var k = 0; k < rowHeader.length; k++) {
			//if(rowHeader[k][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[k][4]==="Qty"){
			TotalNODatas[trim(rowHeader[k][2])+rowHeader[k][3]]=0;
			}
		}
		TotalNODatas["time"]=columnHeader[i][1];
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			//if(rowHeader[j][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[j][4]==="Qty"){
				
			TotalNODatas[trim(rowHeader[j][2])+rowHeader[j][3]] =data[j][i][1];
			}
		}
		TotalNOData.push(TotalNODatas);
	console.log("channel",TotalNOData);
	}
	return TotalNOData;
}*/

/*
 * 解析JSON数据得到关于各个频段金钱总和的数组
 */
function getCoverAgeChannelMoneyDatas(jsondata){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalMOneyData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalMoneyDatas={};
		for ( var k = 0; k < rowHeader.length; k++) {
			//if(rowHeader[k][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[k][4]==="Amount"){
				
				TotalMoneyDatas[trim(rowHeader[k][2])+trim(rowHeader[k][3])]=0;
			}
		}
		TotalMoneyDatas["time"]=columnHeader[i][1];
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			//if(rowHeader[j][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[j][4]==="Amount"){
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalMoneyDatas[trim(rowHeader[j][2])+trim(rowHeader[j][3])] = data[j][i][1];
				}else{
					TotalMoneyDatas[trim(rowHeader[j][2])+trim(rowHeader[j][3])] = 0;
				}
			}
		}
		TotalMOneyData.push(TotalMoneyDatas);
	}
	return TotalMOneyData;
}

function getCoverAgeChannelMoneyTypeData(json){
	var TotalMOneyData = getCoverAgeChannelMoneyDatas(json);
	var MoneyType = d3.keys(TotalMOneyData[0]).filter(function(key) { return key !== "time"; });
	var type={};
	var types=[];
	MoneyType.map(function(name) {
		var typeData={};
		var typeDatas=[];
		TotalMOneyData.forEach(function(d) {
			typeData=  {money:d[name],time:d["time"]};
			typeDatas.push(typeData);
		});
			type[name]=typeDatas;
			
	});
	types.push(type);
	return types;
}

function CoverAgeTotalChart(jsondata,svg,divId){
	d3.selectAll(".CoveragePlanned_svg"+divId).attr("width",document.documentElement.clientWidth -365);
	//var data = getCoverAgeTotalNODatas(jsondata); 
	//var TotalMoneyData = getCoverAgeTotalMoneyTypeData(jsondata);
	var data = getCoverAgeTotalNOData(jsondata); 
	var TotalMoneyData = CoverAgeTotalMoney(jsondata); 
	var DataLineTotalMoney = [];
	var placeNamesArray = d3.keys(data[0]).filter(function(key) { return key !== "time"; });
	var moneyNamesArray = d3.keys(TotalMoneyData[0]);
	for ( var i = 0; i < moneyNamesArray.length; i++) {
		var hhh = TotalMoneyData[0][moneyNamesArray[i]];
		DataLineTotalMoney = DataLineTotalMoney.concat(hhh);
		/*for ( var j = 0; j < TotalMoneyData[0][moneyNamesArray[i]].length; j++) {
			var tt =TotalMoneyData[0][moneyNamesArray[i]];
			var timevalue = tt[j]["time"];
			var timenum = timevalue.substring(4);
			//去掉前面四个剩下后面的
			//截取year1,year2只需要后面的数字
			timevalue=0;
			tt[j].time = parseInt(timenum);
		    //d.money = +d.money;
		}*/
	}

	data.forEach(function(d) {
	  d.count = placeNamesArray.map(function(name) { return {name: name, value: +d[name]}; });
	});
	
	Coverageplannedx0.domain(data.map(function(d) { return d.time; }));
	Coverageplannedx1.domain(placeNamesArray).rangeRoundBands([0, Coverageplannedx0.rangeBand()]);
	CoverageplannedLineX= d3.scale.linear().range([Coverageplannedx0.rangeBand()/2+Coverageplannedx0.rangeBand()/10+Coverageplannedx0.rangeBand()/100, width-(Coverageplannedx0.rangeBand()/2+Coverageplannedx0.rangeBand()/10+Coverageplannedx0.rangeBand()/100)-370]);
	if(TotalMoneyData[0][moneyNamesArray[0]].length) CoverageplannedLineX.domain(d3.extent(TotalMoneyData[0][moneyNamesArray[0]], function(d) { return d.time; }));
	CoverageplannedChartY.domain([0, d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value*1.6; }); })]);
	if(DataLineTotalMoney.length) CoverageplannedLineY.domain([-2*d3.max(DataLineTotalMoney,function(d) { return d.money; }),d3.max(DataLineTotalMoney,function(d) { return d.money; })]);
	svg.selectAll(".linelegend,.legend,.axis")
		.remove();
	svg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",Coverageplannedx0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	svg.selectAll(".line")
		.transition()
		.duration(1000)
		.style("stroke","#fff")
		.remove();
	svg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();	
		
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(CoverageplannedxAxis);
	
	svg.append("g")
		.attr("class", "y1 axis")
		.call(CoverageplannedyAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Qty");
	svg.append("g")
		.attr("class", "y2 axis")
		.attr("transform", "translate("+(width-370)+",0)")
		.call(CoverageplannedyAxisRight)
		.append("text")
		.attr("transform", "rotate(270)")
		.attr("y", -12)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");
	var state = svg.selectAll(".state")
	    .data(data)
		.enter().append("g")
	    .attr("class", "g")
	    .attr("transform", function(d) { return "translate(" + Coverageplannedx0(d.time) + ",0)"; });
	
	state.selectAll("rect")
	    .data(function(d) { return d.count; })
		.enter().append("rect")
		.attr("class","bar")
		.attr("alt",function(d){return d.value;})
		.on("click",function(){CoverAgeSecondTotalChart(jsondata,svg,divId);})
	    .attr("y", function(d) { return CoverageplannedChartY(d.value); })
	    .attr("height", function(d) { return height - CoverageplannedChartY(d.value); })
	    .style("fill", function(d) { return color(d.name); })
	    .attr("x", Coverageplannedx0.rangeBand()/2-Coverageplannedx0.rangeBand()/(2*data[0]["count"].length))
	    .transition()
		.duration(1000)
	    .attr("x", function(d) { return Coverageplannedx1(d.name); })
	    .attr("width", Coverageplannedx1.rangeBand());
	var legend = svg.selectAll(".legend")
	    .data(placeNamesArray.slice().reverse())
		.enter().append("g")
	    .attr("class", "legend")
	    //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
	    ;
	
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
	var linelegend = svg.selectAll(".linelegend")
		.data(moneyNamesArray)
		.enter().append("g")
	    .attr("class", "linelegend")
	  //  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
	    ;
	
	linelegend.append("line")
		.attr("x1",width - 10)
		.attr("x2",width - 10)
		.attr("y1",0)
		.attr("y2",15)
		.transition()
		.duration(1000)
		.attr("y1",function(d, i) { return i * 20 ; })
		//.attr("y1",0)
		.attr("x2",width)
		.attr("y2",function(d, i) { return i * 20+15 ; })
		.style("stroke", function(d,i) {
			return linecolor[i];
		});
	
	linelegend.append("text")
		.attr("x", width - 20)
		.attr("y", 9)
		.attr("dy", 0)
		.transition()
		.duration(1000)
		.attr("dy",function(d, i) { return i * 20 ; })
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	
	for ( var m = 0; m < moneyNamesArray.length; m++) {
		svg.append("path")
		    .datum(TotalMoneyData[0][moneyNamesArray[m]])
		    .attr("class", "line")
		    .attr("d", Coverageplannedline)
		    .style("stroke", "#fff")
		    .transition()
		    .duration(1000)
		    .style("stroke", linecolor[m])
		    .style("stroke-width",2);
		}

	}
function CoverAgeSecondTotalChart(jsondata,svg,divId){
	d3.selectAll(".CoveragePlanned_svg"+divId).attr("width",document.documentElement.clientWidth -365);
	var data = getCoverAgeTotalNODatas(jsondata); 
	var TotalMoneyData = getCoverAgeTotalMoneyTypeData(jsondata);
	//var data = getCoverAgeTotalNOData(jsondata); 
	//var TotalMoneyData = CoverAgeTotalMoney(jsondata); 
	var DataLineTotalMoney = [];
	var placeNamesArray = d3.keys(data[0]).filter(function(key) { return key !== "time"; });
	var moneyNamesArray = d3.keys(TotalMoneyData[0]);
	for ( var i = 0; i < moneyNamesArray.length; i++) {
		var hhh = TotalMoneyData[0][moneyNamesArray[i]];
		DataLineTotalMoney = DataLineTotalMoney.concat(hhh);
		/*for ( var j = 0; j < TotalMoneyData[0][moneyNamesArray[i]].length; j++) {
			
			var tt =TotalMoneyData[0][moneyNamesArray[i]];
			var timevalue = tt[j]["time"];
			var timenum = timevalue.substring(4);
			//去掉前面四个剩下后面的
			//截取year1,year2只需要后面的数字
			timevalue=0;
			tt[j].time = parseInt(timenum);
		    //d.money = +d.money;
		}*/
	}

	data.forEach(function(d) {
	  d.count = placeNamesArray.map(function(name) { return {name: name, value: +d[name]}; });
	});
	
	Coverageplannedx0.domain(data.map(function(d) { return d.time; }));
	Coverageplannedx1.domain(placeNamesArray).rangeRoundBands([0, Coverageplannedx0.rangeBand()]);
	CoverageplannedLineX.domain(d3.extent(TotalMoneyData[0][moneyNamesArray[0]], function(d) { return d.time; }));
	CoverageplannedChartY.domain([0, d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value*1.6; }); })]);
	CoverageplannedLineY.domain([-2*d3.max(DataLineTotalMoney,function(d) { return d.money; }),d3.max(DataLineTotalMoney,function(d) { return d.money; })]);
	svg.selectAll(".linelegend,.legend,.axis")
		.remove();
	svg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",Coverageplannedx0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	svg.selectAll(".line")
		.transition()
		.duration(1000)
		.style("stroke","#fff")
		.remove();
	svg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();		
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(CoverageplannedxAxis);
	
	svg.append("g")
		.attr("class", "y1 axis")
		.call(CoverageplannedyAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Qty");
	svg.append("g")
		.attr("class", "y2 axis")
		.attr("transform", "translate("+(width-370)+",0)")
		.call(CoverageplannedyAxisRight)
		.append("text")
		.attr("transform", "rotate(270)")
		.attr("y", -12)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");
	var state = svg.selectAll(".state")
	    .data(data)
		.enter().append("g")
	    .attr("class", "g")
	    .attr("transform", function(d) { return "translate(" + Coverageplannedx0(d.time) + ",0)"; });
	
	state.selectAll("rect")
	    .data(function(d) { return d.count; })
		.enter().append("rect")
		.attr("class","bar")
		.attr("alt",function(d){return d.value;})
		.on("click",function(){CoverAgeThridTotalChart(jsondata,svg,divId);})
	    //.attr("x", function(d) { return x1(d.name); })
	    .attr("y", function(d) { return height; })
	    //.attr("height", function(d) { return height - ChartY(d.value); })
	    .style("fill", function(d) { return color(d.name); })
	    .attr("x", Coverageplannedx0.rangeBand()/2-Coverageplannedx0.rangeBand()/(2*data[0]["count"].length))
	    .transition()
	    .duration(1000)
	    .attr("x", function(d) { return Coverageplannedx1(d.name); })
	    .attr("width", Coverageplannedx1.rangeBand())
	    .attr("y", function(d) { return CoverageplannedChartY(d.value); })
	    .attr("height", function(d) { return height - CoverageplannedChartY(d.value); })
	    ;
	var legend = svg.selectAll(".legend")
	    .data(placeNamesArray.slice().reverse())
		.enter().append("g")
	    .attr("class", "legend")
	    //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
	    ;
	
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
	var linelegend = svg.selectAll(".linelegend")
		.data(moneyNamesArray)
		.enter().append("g")
	    .attr("class", "linelegend")
	  //  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
	    ;
	
	linelegend.append("line")
		.attr("x1",width - 10)
		.attr("x2",width - 10)
		.attr("y1",0)
		.attr("y2",15)
		.transition()
		.duration(1000)
		.attr("y1",function(d, i) { return i * 20 ; })
		//.attr("y1",0)
		.attr("x2",width)
		.attr("y2",function(d, i) { return i * 20+15 ; })
		.style("stroke", function(d,i) {
			return linecolor[i];
		});
	
	linelegend.append("text")
		.attr("x", width - 20)
		.attr("y", 9)
		.attr("dy", 0)
		.transition()
		.duration(1000)
		.attr("dy",function(d, i) { return i * 20 ; })
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	
	for ( var m = 0; m < moneyNamesArray.length; m++) {
		svg.append("path")
		    .datum(TotalMoneyData[0][moneyNamesArray[m]])
		    .attr("class", "line")
		    .attr("d", Coverageplannedline)
		    .style("stroke", "#fff")
		    .transition()
		    .duration(1000)
		    .style("stroke", linecolor[m])
		    .style("stroke-width",2);
		}

	}	
	
function CoverAgeThridTotalChart(jsondata,svg,divId){
	d3.selectAll(".CoveragePlanned_svg"+divId).attr("width",document.documentElement.clientWidth -365);
	var data = getChannelData(jsondata,2); 
	var TotalMoneyData = getCoverAgeChannelMoneyTypeData(jsondata);
	//var data = getCoverAgeTotalNOData(jsondata); 
	//var TotalMoneyData = CoverAgeTotalMoney(jsondata); 
	var DataLineTotalMoney = [];
	var placeNamesArray = d3.keys(data[0]).filter(function(key) { return key !== "time"; });
	var moneyNamesArray = d3.keys(TotalMoneyData[0]);
	for ( var i = 0; i < moneyNamesArray.length; i++) {
		var hhh = TotalMoneyData[0][moneyNamesArray[i]];
		DataLineTotalMoney = DataLineTotalMoney.concat(hhh);
		/*for ( var j = 0; j < TotalMoneyData[0][moneyNamesArray[i]].length; j++) {
			
			var tt =TotalMoneyData[0][moneyNamesArray[i]];
			var timevalue = tt[j]["time"];
			var timenum = timevalue.substring(4);
			//去掉前面四个剩下后面的
			//截取year1,year2只需要后面的数字
			timevalue=0;
			tt[j].time = parseInt(timenum);
		    //d.money = +d.money;
		}*/
	}

	data.forEach(function(d) {
	  d.count = placeNamesArray.map(function(name) { return {name: name, value: +d[name]}; });
	});
	
	Coverageplannedx0.domain(data.map(function(d) { return d.time; }));
	Coverageplannedx1.domain(placeNamesArray).rangeRoundBands([0, Coverageplannedx0.rangeBand()]);
	CoverageplannedLineX.domain(d3.extent(TotalMoneyData[0][moneyNamesArray[0]], function(d) { return d.time; }));
	CoverageplannedChartY.domain([0, d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value*1.6; }); })]);
	CoverageplannedLineY.domain([-2*d3.max(DataLineTotalMoney,function(d) { return d.money; }),d3.max(DataLineTotalMoney,function(d) { return d.money; })]);
	svg.selectAll(".linelegend,.legend,.axis")
		.remove();
	svg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",Coverageplannedx0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	svg.selectAll(".line")
		.transition()
		.duration(1000)
		.style("stroke","#fff")
		.remove();
	svg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();	
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(CoverageplannedxAxis);
	
	svg.append("g")
		.attr("class", "y1 axis")
		.call(CoverageplannedyAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Qty");
	svg.append("g")
		.attr("class", "y2 axis")
		.attr("transform", "translate("+(width-370)+",0)")
		.call(CoverageplannedyAxisRight)
		.append("text")
		.attr("transform", "rotate(270)")
		.attr("y", -12)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");
	var state = svg.selectAll(".state")
	    .data(data)
		.enter().append("g")
	    .attr("class", "g")
	    .attr("transform", function(d) { return "translate(" + Coverageplannedx0(d.time) + ",0)"; });
	
	state.selectAll("rect")
	    .data(function(d) { return d.count; })
		.enter().append("rect")
		.attr("class","bar")
		.attr("alt",function(d){return d.value;})
		.on("click",function(){CoverAgeTotalChart(jsondata,svg,divId);})
	    //.attr("x", function(d) { return x1(d.name); })
	    .attr("y", function(d) { return CoverageplannedChartY(d.value); })
	    .attr("height", function(d) { return height - CoverageplannedChartY(d.value); })
	    .style("fill", function(d) { return color(d.name); })
	    .attr("x", Coverageplannedx0.rangeBand()/2-Coverageplannedx0.rangeBand()/(2*data[0]["count"].length))
		.transition()
		.duration(1000)
		.attr("x", function(d) { return Coverageplannedx1(d.name); })
	    .attr("width", Coverageplannedx1.rangeBand())
	    ;
	var legend = svg.selectAll(".legend")
	    .data(placeNamesArray.slice().reverse())
		.enter().append("g")
	    .attr("class", "legend")
	    //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
	    ;
	
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
	var linelegend = svg.selectAll(".linelegend")
		.data(moneyNamesArray)
		.enter().append("g")
	    .attr("class", "linelegend")
	  //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
	    ;
	
	linelegend.append("line")
		.attr("x1",width - 10)
		.attr("x2",width - 10)
		.attr("y1",0)
		.attr("y2",15)
		.transition()
		.duration(1000)
		.attr("y1",function(d, i) { return i * 20 ; })
		//.attr("y1",0)
		.attr("x2",width)
		.attr("y2",function(d, i) { return i * 20+15 ; })
		.style("stroke", function(d,i) {
			return linecolor[i];
		});
	
	linelegend.append("text")
		.attr("x", width - 20)
		.attr("y", 9)
		.attr("dy", 0)
		.transition()
		.duration(1000)
		.attr("dy",function(d, i) { return i * 20 ; })
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	
	for ( var m = 0; m < moneyNamesArray.length; m++) {
		svg.append("path")
		    .datum(TotalMoneyData[0][moneyNamesArray[m]])
		    .attr("class", "line")
		    .attr("d", Coverageplannedline)
		    .style("stroke", "#fff")
		    .transition()
		    .duration(1000)
		    .style("stroke", linecolor[m])
		    .style("stroke-width",2);
		}

	}		
	
	