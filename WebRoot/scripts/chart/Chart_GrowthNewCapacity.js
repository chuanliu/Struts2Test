function Chart_GrowthNewCapacity(jsondata,divId,configId){
	this.divid = divId;
	this.jsondata = jsondata;
	var GrowthNewCapacityDiv = divId;
	var div = d3.select("body").select("#"+divId)
	var GrowthNewCapacity_svg = div.append("svg")
		.attr("class","GrowthNewCapacity_svg"+divId)
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	GrowthNewCapacityFirst(jsondata,GrowthNewCapacity_svg,divId);
	
	GrowthNewCapacityWindow = function(){
		if(document.documentElement.clientWidth>1000){
			width = document.documentElement.clientWidth -365 - margin.left - margin.right;
			height = 250 - margin.top - margin.bottom;
			GrowthNewCapacityx0 = d3.scale.ordinal()
				.rangeRoundBands([0, width-370], .1);
			GrowthNewCapacityx1 = d3.scale.ordinal();
			GrowthNewCapacityLineX= d3.scale.linear();
			GrowthNewCapacityChartY = d3.scale.linear()
				.range([height, 0]);
			GrowthNewCapacityLineY = d3.scale.linear()
				.range([height, 0]);
			GrowthNewCapacityxAxis = d3.svg.axis()
				.scale(GrowthNewCapacityx0)
				.orient("bottom");
			GrowthNewCapacityyAxisLeft = d3.svg.axis()
				.scale(GrowthNewCapacityChartY)
				.orient("left")
				.tickFormat(d3.format(".2s"));
			GrowthNewCapacityyAxisRight = d3.svg.axis()
				.scale(GrowthNewCapacityLineY)
				.orient("right")
				.tickFormat(d3.format(".2s"));
			GrowthNewCapacityline = d3.svg.line()
				.x(function(d) { return GrowthNewCapacityLineX(d.time); })
				.y(function(d) { return GrowthNewCapacityLineY(d.money); });
			d3.selectAll(".GrowthNewCapacity_svg"+divId)
				.remove();
			div = d3.select("body").select("#"+divId)
			GrowthNewCapacity_svg = div.append("svg")
				.attr("class","GrowthNewCapacity_svg"+divId)
		       .attr("width", width + margin.left + margin.right)
		       .attr("height", height + margin.top + margin.bottom)
		       .append("g")
		       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			GrowthNewCapacityFirst(jsondata,GrowthNewCapacity_svg,divId);
		};
	
	}
}

/*
 * 解析JSON数据得到关于频段每年金钱总和的数据
 */
/*function getCapacityMoneyAllData(json){
	var columnHeader = json.BUSINESS_DATA.rawData.columnHeader;
	var data = json.BUSINESS_DATA.rawData.data;
	var rowHeader = json.BUSINESS_DATA.rawData.rowHeader;
	var TotalMoneyData=[];
	var TotalMoneyDatas=[];
	var TotalMoneyPlays_900=[];
	var TotalMoneyPlays_2100=[];
	var TotalMoneyPlays_BaseCost=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalMoneyPlace_900 = {};
		var TotalMoneyPlace_2100 = {};
		var TotalMoneyPlace_BaseCost = {};
		//TotalMoneyDatas[rowHeader[j][1]+"_"+rowHeader[j][2]]=columnHeader[i][1];
		//定义城市和郊区参数
		var money_900=0;
		var money_2100=0;
		var money_BaseCost=0;
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][3]==="Amount"){
				if (rowHeader[j][2]==="900") {
					money_900 += data[j][i][1];
				}else if(rowHeader[j][2]==="2100"){
					money_2100 += data[j][i][1];
				}else if(rowHeader[j][2]==="Base Cost"){
					money_BaseCost += data[j][i][1];
				}
					
			}
		}
		TotalMoneyPlace_900["time"] = "year"+(i+1);
		TotalMoneyPlace_900["money"] = money_900;
		
		TotalMoneyPlace_2100["time"] = "year"+(i+1);
		TotalMoneyPlace_2100["money"] = money_2100;
		
		TotalMoneyPlace_BaseCost["time"] = "year"+(i+1);
		TotalMoneyPlace_BaseCost["money"] = money_BaseCost;
		
		TotalMoneyPlays_900.push(TotalMoneyPlace_900);
		TotalMoneyPlays_2100.push(TotalMoneyPlace_2100);
		TotalMoneyPlays_BaseCost.push(TotalMoneyPlace_BaseCost);
		
	}
		TotalMoneyDatas["money_900"] = TotalMoneyPlays_900;
		TotalMoneyDatas["money_2100"] = TotalMoneyPlays_2100;
		TotalMoneyDatas["money_BaseCost"] = TotalMoneyPlays_BaseCost;
		TotalMoneyData.push(TotalMoneyDatas);
		console.log("zhejiushi qian",TotalMoneyData);
	return TotalMoneyData;
	
}*/
/*
 * 得到乡村和城市每一年的金钱总和
 */

function getGrowthNewCapacityTotalMoneyDatas(jsondata){
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
			if(rowHeader[k][3]==="Amount"){
				
			TotalMoneyDatas[trim(rowHeader[k][1])]=0;
			}
		}
		TotalMoneyDatas["time"]=(i+1);
		//TotalMoneyDatas["time"]=columnHeader[i][1];
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			//if(rowHeader[j][3]===""){
				//continue;//结束该循环
			//}
			if(rowHeader[j][3]==="Amount"){
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalMoneyDatas[trim(rowHeader[j][1])] += data[j][i][1];
				}
			}
		}
		TotalMOneyData.push(TotalMoneyDatas);
	}
	return TotalMOneyData;
}

function getGrowthNewCapacityTotalMoneyData(json){
	var TotalMOneyData = getGrowthNewCapacityTotalMoneyDatas(json);
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

/*function getTotalMoneyData(json){
	var columnHeader = json.BUSINESS_DATA.rawData.columnHeader;
	var data = json.BUSINESS_DATA.rawData.data;
	var rowHeader = json.BUSINESS_DATA.rawData.rowHeader;
	var TotalMoneyData = []
	var TotalMoneyDatas={};
	
	var TotalMoneyData_Metro=[];
	var TotalMoneyData_Regional=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalMoneyDatas_Metro={};
		var TotalMoneyDatas_Regional={};
		//定义城市和郊区参数
		var Metro=0;
		var Regional=0;
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][3]==="Amount"){
				if (rowHeader[j][1]=="Metro") {
					Metro +=data[j][i][1];
				}else if(rowHeader[j][1]=="Regional"){
					Regional+=data[j][i][1];
				}
			}
		}
		
		TotalMoneyDatas_Metro["money"]=Metro;
		TotalMoneyDatas_Metro["time"]="year"+(i+1);
		
		TotalMoneyDatas_Regional["money"]=Regional;
		TotalMoneyDatas_Regional["time"]="year"+(i+1);
		
		TotalMoneyData_Metro.push(TotalMoneyDatas_Metro);
		TotalMoneyData_Regional.push(TotalMoneyDatas_Regional);
		
	}
	TotalMoneyDatas["Metro"] = TotalMoneyData_Metro;
	TotalMoneyDatas["Regional"] = TotalMoneyData_Regional;
	TotalMoneyData.push(TotalMoneyDatas);
	return TotalMoneyData;
}*/

function GrowthNewCapacitySecond(jsondata,GrowthNewCapacitysvg,divId) {
	d3.selectAll(".GrowthNewCapacity_svg"+divId).attr("width",document.documentElement.clientWidth -365);
	//var dataLine=[{"time":"year1","money":180},{"time":"year2","money":1000}] ;
	var data = getChannelData(jsondata,1);
	var dataLine=getMoneyData(jsondata);
	//var data = getNOData(jsondata); 
	var datalinemoney = [];
	var placeNamesArray = d3.keys(data[0]).filter(function(key) { return key !== "time"; });
	var moneyNamesArray = d3.keys(dataLine[0]);
	for ( var i = 0; i < moneyNamesArray.length; i++) {
		var hhh = dataLine[0][moneyNamesArray[i]];
		datalinemoney = datalinemoney.concat(hhh);
		/*for ( var j = 0; j < dataLine[0][moneyNamesArray[i]].length; j++) {
			
			var tt =dataLine[0][moneyNamesArray[i]];
			var timevalue = tt[j]["time"];
			var timenum = timevalue.substring(4);
			//去掉前面四个剩下后面的
			//截取year1,year2只需要后面的数字
			timevalue=0;
			tt[j].time = parseInt(timenum);
		    //d.money = +d.money;
		}*/
	}
	/*data.forEach(function(d) {
		//合并两个对象的数组
		d.Metri_Regional = (d.Metro).concat(d.Regional);
	});
	var channel=[];
	data[0].Metri_Regional.forEach(function (d){
		
		channel.push(d.ChannelName);
	});*/
	data.forEach(function(d) {
		  d.count = placeNamesArray.map(function(name) { return {name: name, value: +d[name]}; });
		});
	  GrowthNewCapacityx0.domain(data.map(function(d) { return d.time; }));
	 // GrowthNewCapacityx1.domain(d3.keys(data[0].Metri_Regional)).rangeRoundBands([0, GrowthNewCapacityx0.rangeBand()]);
	  GrowthNewCapacityx1.domain(placeNamesArray).rangeRoundBands([0, GrowthNewCapacityx0.rangeBand()]);

	  GrowthNewCapacityLineX.domain(d3.extent(dataLine[0][moneyNamesArray[0]], function(d) { return d.time; }));
	  //设置y轴的值，由最大值范围平均分布
	  //GrowthNewCapacityChartY.domain([0, d3.max(data, function(d) { return d3.max(d.Metri_Regional, function(d) { return d.value; }); })+1000]);
	  GrowthNewCapacityChartY.domain([0, d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value*1.6; }); })]);
	  GrowthNewCapacityLineY.domain([-2*d3.max(datalinemoney,function(d) { return d.money; }),d3.max(datalinemoney,function(d) { return d.money; })]);

	//删除页面上的svg
	GrowthNewCapacitysvg.selectAll(".linelegend,.legend,.axis")
		.remove();
	GrowthNewCapacitysvg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",GrowthNewCapacityx0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	GrowthNewCapacitysvg.selectAll(".line")
		.transition()
		.duration(800)
		.style("stroke","#fff")
		.remove();
	GrowthNewCapacitysvg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();	
	  //重新绘制svg
	GrowthNewCapacitysvg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(GrowthNewCapacityxAxis);
	  
	  
	GrowthNewCapacitysvg.append("g")
		.attr("class", "y1 axis")
		.call(GrowthNewCapacityyAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Qty");
	GrowthNewCapacitysvg.append("g")
		.attr("class", "y2 axis")
		.attr("transform", "translate("+(width-370)+",0)")
		.call(GrowthNewCapacityyAxisRight)
		.append("text")
		.attr("transform", "rotate(270)")
		.attr("y", -12)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");

	var state = GrowthNewCapacitysvg.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + GrowthNewCapacityx0(d.time) + ",0)"; });

	state.selectAll("rect")
		.data(function(d) { return d.count; })
		.enter().append("rect")
		.attr("class","bar")
		.attr("title",function(d){return d.value;})
		.on("click",function(){GrowthNewCapacityFirst(jsondata,GrowthNewCapacitysvg,divId);})
		//.attr("x", function(d) { return GrowthNewCapacityx1(d.name); })
		.attr("y", function(d) { return height; })
		//.attr("height", function(d) { return height - GrowthNewCapacityChartY(d.value); })
		.style("fill", function(d) { return color(d.name); })
		.attr("x", GrowthNewCapacityx0.rangeBand()/2)
		.transition()
		.duration(1000)
		.attr("x", function(d) { return GrowthNewCapacityx1(d.name); })
		.attr("width", GrowthNewCapacityx1.rangeBand())
		.attr("y", function(d) { return GrowthNewCapacityChartY(d.value); })
		.attr("height", function(d) { return height - GrowthNewCapacityChartY(d.value); })
		;

	var legend = GrowthNewCapacitysvg.selectAll(".legend")
		.data(placeNamesArray.slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		 // .attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; })
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
		.attr("dy",function(d, i) { return i * 20+5 ; })
	    //.attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) { return d; });
	  
	var linelegend = GrowthNewCapacitysvg.selectAll(".linelegend")
		.data(moneyNamesArray)
		.enter().append("g")
		.attr("class", "linelegend")
		//.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
		;

	linelegend.append("line")
		.attr("x1",width - 10)
		.attr("x2",width - 10)
		.attr("y1",0)
		.attr("y2",18)
		.transition()
		.duration(1000)
		.attr("y1",function(d, i) { return i * 20 ; })
		//.attr("y1",0)
		.attr("x2",width)
		.attr("y2",function(d, i) { return i * 20+18 ; })
		.style("stroke", function(d,i) {
			return linecolor[i];
		});

	linelegend.append("text")
		.attr("x", width - 20)
		.attr("y", 9)
		.attr("dy", 0)
		.transition()
		.duration(1000)
		.attr("dy",function(d, i) { return i * 20+5 ; })
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	for ( var m = 0; m < moneyNamesArray.length; m++) {
		GrowthNewCapacitysvg.append("path")
			.datum(dataLine[0][moneyNamesArray[m]])
			.attr("class", "line")
			.attr("d", GrowthNewCapacityline)
			.style("stroke", "#fff")
			.transition()
			.duration(1000)
			.style("stroke", linecolor[m])
			//.style("stroke-width",1)
			.transition()
			.duration(1000)
			.style("stroke-width",2)
			;
		}
	 
}

function GrowthNewCapacityFirst(jsondata,GrowthNewCapacitysvg,divId){
	d3.selectAll(".GrowthNewCapacity_svg"+divId).attr("width",document.documentElement.clientWidth -365);
	//var TotalMoneyData = getCapacityMoneyAllData(jsondata); 
	var TotalMoneyData = getGrowthNewCapacityTotalMoneyData(jsondata); 
	var data = getTotalNODatas(jsondata,0);	
	//var data = getTotalNOData(jsondata); 
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
	
	GrowthNewCapacityx0.domain(data.map(function(d) { return d.time; }));
	
	GrowthNewCapacityx1.domain(placeNamesArray).rangeRoundBands([0, GrowthNewCapacityx0.rangeBand()]);
	GrowthNewCapacityLineX= d3.scale.linear().range([GrowthNewCapacityx0.rangeBand()/2+GrowthNewCapacityx0.rangeBand()/10+GrowthNewCapacityx0.rangeBand()/100, width-(GrowthNewCapacityx0.rangeBand()/2+GrowthNewCapacityx0.rangeBand()/10+GrowthNewCapacityx0.rangeBand()/100)-370]);
	GrowthNewCapacityLineX.domain(d3.extent(TotalMoneyData[0][moneyNamesArray[0]], function(d) { return d.time; }));
	GrowthNewCapacityChartY.domain([0, d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value*1.6; }); })]);
	GrowthNewCapacityLineY.domain([-2*d3.max(DataLineTotalMoney,function(d) { return d.money; }),d3.max(DataLineTotalMoney,function(d) { return d.money; })]);
	GrowthNewCapacitysvg.selectAll(".linelegend,.legend,.axis")
		.remove();
	GrowthNewCapacitysvg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",GrowthNewCapacityx0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	GrowthNewCapacitysvg.selectAll(".line")
		.transition()
		.duration(1000)
		.style("stroke","#fff")
		.remove();
	GrowthNewCapacitysvg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();	
	GrowthNewCapacitysvg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(GrowthNewCapacityxAxis);
	
	GrowthNewCapacitysvg.append("g")
		.attr("class", "y1 axis")
		.call(GrowthNewCapacityyAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Qty");
	GrowthNewCapacitysvg.append("g")
		.attr("class", "y2 axis")
		.attr("transform", "translate("+(width-370)+",0)")
		.call(GrowthNewCapacityyAxisRight)
		.append("text")
		.attr("transform", "rotate(270)")
		.attr("y", -12)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");
	var state = GrowthNewCapacitysvg.selectAll(".state")
	    .data(data)
	  	.enter().append("g")
	    .attr("class", "g")
	    .attr("transform", function(d) { return "translate(" + GrowthNewCapacityx0(d.time) + ",0)"; });
	
	state.selectAll("rect")
		.data(function(d) { return d.count; })
		.enter().append("rect")
		.attr("class","bar")
		.attr("title",function(d){return d.value;})
		.on("click",function(){GrowthNewCapacitySecond(jsondata,GrowthNewCapacitysvg,divId);})
		.attr("y", function(d) { return height; })
		//.attr("height", function(d) { return height - GrowthNewCapacityChartY(d.value); })
		.style("fill", function(d) { return color(d.name); })
		.attr("x",GrowthNewCapacityx0.rangeBand()/2)
		.transition()
		.duration(1000)
		.attr("x", function(d) { return GrowthNewCapacityx1(d.name); })
		.attr("width", GrowthNewCapacityx1.rangeBand())
		.attr("y", function(d) { return GrowthNewCapacityChartY(d.value); })
		.attr("height", function(d) { return height - GrowthNewCapacityChartY(d.value); })
		;
	var legend = GrowthNewCapacitysvg.selectAll(".legend")
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
		.attr("dy",function(d, i) { return i * 20+5; })
	    //.attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) { return d; });
	var linelegend = GrowthNewCapacitysvg.selectAll(".linelegend")
		.data(moneyNamesArray)
		.enter().append("g")
	    .attr("class", "linelegend")
	  //  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
	    ;
	
	linelegend.append("line")
		.attr("x1",width - 10)
		.attr("x2",width - 10)
		.attr("y1",0)
		.attr("y2",18)
		.transition()
		.duration(1000)
		.attr("y1",function(d, i) { return i * 20 ; })
		//.attr("y1",0)
		.attr("x2",width)
		.attr("y2",function(d, i) { return i * 20+18 ; })
		.style("stroke", function(d,i) {
			return linecolor[i];
		});
	
	linelegend.append("text")
		.attr("x", width - 20)
		.attr("y", 9)
		.attr("dy", 0)
		.transition()
		.duration(1000)
		.attr("dy",function(d, i) { return i * 20+5 ; })
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	
	for ( var m = 0; m < moneyNamesArray.length; m++) {
		GrowthNewCapacitysvg.append("path")
		    .datum(TotalMoneyData[0][moneyNamesArray[m]])
		    .attr("class", "line")
		    .attr("d", GrowthNewCapacityline)
		    .style("stroke", "#fff")
		    .transition()
		    .duration(1000)
		    .style("stroke", linecolor[m])
		    .style("stroke-width",2);
		}

}
