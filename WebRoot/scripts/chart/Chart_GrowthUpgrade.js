
//得到json数据
/*function setJsonData(datajson){
	this.jsondata = datajson;
	
}*/
/**
 * SVG的一些变量
 */
/*var divid="";
var jsondata;
var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 1400 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
	.rangeRoundBands([0, width-270], .1);

var x1 = d3.scale.ordinal();
//var x = d3.scale.linear().range([0, 600],1);
//var xLine= d3.time.scale().range([215, width-335]);
//var xLine= d3.scale.linear().range([215, width-555]);
var xLine= d3.scale.linear();
var ChartY = d3.scale.linear()
	.range([height, 0]);
	
var LineY = d3.scale.linear()
	.range([height, 0]);
//var color = d3.scale.ordinal()
	//.range(["#007ab8","#bdecff", "#149dff", "#38acff", "#57b9ff", "#85ccff", "#00acc7","#00d0f0", "#14e0ff", "#3de5ff", "#61eaff", "#61d2ff", "#80dbff", "#a3e5ff"]);	
	//.range(["#8DB6CD", "#6495ED", "#607B8B", "#575757", "#528B8B", "#483D8B", "#458B74","#00FFFF", "#009ACD", "#00868B", "#556B2F", "#8B0000", "#8B4789", "#8B8B00"]);
var linecolor = ["#ff1500", "#ffd900", "#cf0", "#51ff00", "#08f", "#0008ff", "#b300ff","#ff00bf","#ff000d","#ff9499","#ff00e1"];
var linecolor = [ "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78"," #2ca02c", "#98df8a", "#d62728"," #ff9896", "#9467bd", "#c5b0d5 ","#8c564b", "#c49c94"," #e377c2", "#f7b6d2"," #7f7f7f"," #c7c7c7", "#bcbd22", "#dbdb8d"," #17becf", "#9edae5"];
var xAxisGrowth = d3.svg.axis()
	.scale(x0)
	.orient("bottom");

//var xAxisLine = d3.svg.axis()
//	.scale(x0)
//	.orient("bottom");

var yAxisLeft = d3.svg.axis()
	.scale(ChartY)
	.orient("left")
	.tickFormat(d3.format(".2s"));

var yAxisRight = d3.svg.axis()
	.scale(LineY)
	.orient("right")
	.tickFormat(d3.format(".2s"));
//画折线
var line = d3.svg.line()
	.x(function(d) { return xLine(d.time); })
	.y(function(d) { return LineY(d.money); });
*/	   

/**
 * 解析json的一些变量
 */
function Chart_GrowthUpgrade(jsondata,divId){
	this.divid = divId;
	this.jsondata = jsondata;
	var GrowthUpgradeDiv = divId;
	div = d3.select("body").select("#"+GrowthUpgradeDiv)
	var GrowthUpgrade_svg = div.append("svg")
		.attr("class","GrowthUpgrade_svg"+divId)
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	GrowthUpgradeFirstChart(jsondata,GrowthUpgrade_svg,divId);
	
	GrowthUpgradeWindow=function(){
		if(document.documentElement.clientWidth>1000){
			width = document.documentElement.clientWidth -365 - margin.left - margin.right;
			height = 250 - margin.top - margin.bottom;
			GrowthUpgradex0 = d3.scale.ordinal()
				.rangeRoundBands([0, width-370], .1);
			GrowthUpgradex1 = d3.scale.ordinal();
			GrowthUpgradeLineX= d3.scale.linear();
			GrowthUpgradeChartY = d3.scale.linear()
				.range([height, 0]);
			GrowthUpgradeLineY = d3.scale.linear()
				.range([height, 0]);
			GrowthUpgradexAxis = d3.svg.axis()
				.scale(GrowthUpgradex0)
				.orient("bottom");
			GrowthUpgradeyAxisLeft = d3.svg.axis()
				.scale(GrowthUpgradeChartY)
				.orient("left")
				.tickFormat(d3.format(".2s"));
			GrowthUpgradeyAxisRight = d3.svg.axis()
				.scale(GrowthUpgradeLineY)
				.orient("right")
				.tickFormat(d3.format(".2s"));
			GrowthUpgradeline = d3.svg.line()
				.x(function(d) { return GrowthUpgradeLineX(d.time); })
				.y(function(d) { return GrowthUpgradeLineY(d.money); });
			d3.selectAll(".GrowthUpgrade_svg"+divId)
				.remove();
			div = d3.select("body").select("#"+GrowthUpgradeDiv)
			GrowthUpgrade_svg = div.append("svg")
				.attr("class","GrowthUpgrade_svg"+divId)
		       .attr("width", width + margin.left + margin.right)
		       .attr("height", height + margin.top + margin.bottom)
		       .append("g")
		       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			GrowthUpgradeFirstChart(jsondata,GrowthUpgrade_svg,divId);
		}
	}
}

/*function Chart_GrowthNewCapacity(jsondata,divId,configId){
	this.divid = divId;
	this.jsondata = jsondata;
	console.log("pppp",jsondata);
	div = d3.select("body").select("#"+divId)
	GrowthNewCapacitysvg = div.append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	redrowSecondChart(jsondata,GrowthNewCapacitysvg);
	
	
}*/
/*function Chart_CoverageUnplanned(jsondata,divId){
	this.divid = divId;
	this.jsondata = jsondata;
	var CoverageUnplannedDiv = divId;
	div = d3.select("body").select("#"+divId)
	var CoverageUnplanneds_svg = div.append("svg")
		.attr("class","CoverageUnplanned_svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	redrowSecondChart(jsondata,CoverageUnplanneds_svg,CoverageUnplannedx0,CoverageUnplannedx1,CoverageUnplannedLineX,CoverageUnplannedChartY,CoverageUnplannedLineY,CoverageUnplannedxAxis,CoverageUnplannedyAxisLeft,CoverageUnplannedyAxisRight,CoverageUnplannedline);
	 
	
	CoverageUnplannedWindow=function(){
		if(document.documentElement.clientWidth>900){
			width = document.documentElement.clientWidth -350 - margin.left - margin.right;
			height = 250 - margin.top - margin.bottom;
			CoverageUnplannedx0 = d3.scale.ordinal()
				.rangeRoundBands([0, width-270], .1);
			CoverageUnplannedx1 = d3.scale.ordinal();
			CoverageUnplannedLineX= d3.scale.linear();
			CoverageUnplannedChartY = d3.scale.linear()
				.range([height, 0]);
			CoverageUnplannedLineY = d3.scale.linear()
				.range([height, 0]);
			CoverageUnplannedxAxis = d3.svg.axis()
				.scale(CoverageUnplannedx0)
				.orient("bottom");
			CoverageUnplannedyAxisLeft = d3.svg.axis()
				.scale(CoverageUnplannedChartY)
				.orient("left")
				.tickFormat(d3.format(".2s"));
			CoverageUnplannedyAxisRight = d3.svg.axis()
				.scale(CoverageUnplannedLineY)
				.orient("right")
				.tickFormat(d3.format(".2s"));
			CoverageUnplannedline = d3.svg.line()
				.x(function(d) { return CoverageUnplannedLineX(d.time); })
				.y(function(d) { return CoverageUnplannedLineY(d.money); });
			d3.selectAll(".CoverageUnplanned_svg")
				.remove();
			div = d3.select("body").select("#"+divId)
			CoverageUnplanneds_svg = div.append("svg")
				.attr("class","CoverageUnplanned_svg")
		       .attr("width", width + margin.left + margin.right)
		       .attr("height", height + margin.top + margin.bottom)
		       .append("g")
		       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			redrowSecondChart(jsondata,CoverageUnplanneds_svg,CoverageUnplannedx0,CoverageUnplannedx1,CoverageUnplannedLineX,CoverageUnplannedChartY,CoverageUnplannedLineY,CoverageUnplannedxAxis,CoverageUnplannedyAxisLeft,CoverageUnplannedyAxisRight,CoverageUnplannedline);
		}
	}
	
}*/

//redrowChart(jsondata);
/*
 * 解析JSON数据得到关于数量的数组
 */
/*function getNOData(json){
	var columnHeader = json.BUSINESS_DATA.rawData.columnHeader;
	var data = json.BUSINESS_DATA.rawData.data;
	var rowHeader = json.BUSINESS_DATA.rawData.rowHeader;
	var NOData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var NODatas={};
		NODatas["time"]=columnHeader[i][1];
		//定义城市和郊区对象
		var Metro=[];
		var Regional=[];
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			var MetroValue={};
			var RegionalValue={};
			if(rowHeader[j][3]=="Qty"){
				if (rowHeader[j][1]=="Metro") {
					MetroValue["ChannelName"]="Metro"+rowHeader[j][2];
					//alert(rowHeader[j][2]);
					MetroValue["value"] = data[j][i][1];
					MetroValue["money"] = data[j+1][i][1];
					MetroValue["time"] = columnHeader[i][1];
					Metro.push(MetroValue);
				}else if(rowHeader[j][1]=="Regional"){
					RegionalValue["ChannelName"]="Regional"+rowHeader[j][2];
					RegionalValue["value"] = data[j][i][1];
					RegionalValue["money"] = data[j+1][i][1];
					RegionalValue["time"] = columnHeader[i][1];
					Regional.push(RegionalValue);
				}
			}
		}
	NODatas["Metro"]=Metro;
	NODatas["Regional"]=Regional;
	NOData.push(NODatas);
	console.log("NOData",NOData);
	}
	return NOData;
}*/
/*
 * 解析JSON数据得到关于数量总和的数组
 */
/*function getTotalNOData(json){
	var columnHeader = json.BUSINESS_DATA.rawData.columnHeader;
	var data = json.BUSINESS_DATA.rawData.data;
	var rowHeader = json.BUSINESS_DATA.rawData.rowHeader;
	var TotalNOData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalNODatas={};
		TotalNODatas["time"]=columnHeader[i][1];
		//定义城市和郊区参数
		var Metro=0;
		var Regional=0;
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][3]=="Qty"){
				if (rowHeader[j][1]=="Metro") {
					Metro +=data[j][i][1];
				}else if(rowHeader[j][1]=="Regional"){
					Regional+=data[j][i][1];
				}
			}
		}
		TotalNODatas["Metro"]=Metro;
		TotalNODatas["Regional"]=Regional;
		TotalNOData.push(TotalNODatas);
	console.log("TotalNOData",TotalNOData);
	}
	return TotalNOData;
	return getTotalNODatas(json,0);
}*/
/*
 * 得到关于金钱的数组
 */
function getMoneyData(json){
	//var columnHeader = json.BUSINESS_DATA.rawData.columnHeader;
	var data = json.BUSINESS_DATA.rawData.data;
	var rowHeader = json.BUSINESS_DATA.rawData.rowHeader;
	var MoneyData=[];
		//定义城市和郊区对象
		
		var MoneyNumAll={};
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][3]=="Amount"){
				var arrayNumAll = [];
				for ( var i = 0; i < data[j].length; i++) {
					var MoneyNum={};
					MoneyNum["time"] = "year"+(i+1);
					if(data && data[j] && data[j][i] && data[j][i][1]){
						MoneyNum["money"] = data[j][i][1];
					}else{
						MoneyNum["money"] = 0;
					}
					arrayNumAll.push(MoneyNum);
				}
				MoneyNumAll[trim(rowHeader[j][1])+trim(rowHeader[j][2])]=arrayNumAll;
			}
		}
	MoneyData.push(MoneyNumAll);
	return MoneyData;
}
/*
 * 解析JSON数据得到关于金钱的数组
 */
/*function getMoneyData(json){
	var columnHeader = json.BUSINESS_DATA.rawData.columnHeader;
	var data = json.BUSINESS_DATA.rawData.data;
	var rowHeader = json.BUSINESS_DATA.rawData.rowHeader;
	var MoneyData=[];
	var MoneyDatas={};
	for ( var i = 0; i < columnHeader.length; i++) {
		MoneyDatas["time"]=columnHeader[i][1];
		//定义城市和郊区对象
		var Metro={};
		var Regional={};
		//减去的三个是最后面算总金钱的行
		for ( var j = 0; j < rowHeader.length-3; j++) {
			if(rowHeader[j][3]=="Amount"){
				if (rowHeader[j][1]=="Metro") {
					Metro[rowHeader[j][2]]=data[j][i][1];
				}else if(rowHeader[j][1]=="Regional"){
					Regional[rowHeader[j][2]]=data[j][i][1];
				}
			}
		}
		MoneyDatas["Metro"]=Metro;
		MoneyDatas["Regional"]=Regional;
		MoneyData.push(MoneyDatas);
	}
	return MoneyData;
}*/
/*
 * 解析JSON数据得到关于郊区和城镇每一年总金钱的数组
 */
function getTotalMoney(jsondata){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalMoney=[];
	var TotalMoneyAll = {};
	//从最后面算总金钱的行开始遍历，减去最后一行所有金钱的行
	for ( var j = 0; j < rowHeader.length; j++) {
		var TotalMoneys=[];
		if(trim(rowHeader[j][1])=="Total"){
			for ( var i = 0; i < data[j].length; i++) {
				var TotalMoneyPlace = {};
				TotalMoneyPlace["time"] = (i+1);
				TotalMoneyPlace["money"] = data[j][i][1];
				TotalMoneys.push(TotalMoneyPlace);
			}
			TotalMoneyAll[trim(rowHeader[j][1])+trim(rowHeader[j][2])] = TotalMoneys;	

			}
	}
	TotalMoney.push(TotalMoneyAll);
	return TotalMoney;
}
/*
 * 解析JSON数据得到每一年总金钱的数组
 */
function getAllMoney(json) {
	var columnHeader = json.BUSINESS_DATA.rawData.columnHeader;
	var data = json.BUSINESS_DATA.rawData.data;
	var rowHeader = json.BUSINESS_DATA.rawData.rowHeader;
	var AllMoneys={};
	var AllMoney=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		//就取最后一行的值
		AllMoneys[trim(columnHeader[i][1])]=data[rowHeader.length-1][i][1];
	}
	AllMoney.push(AllMoneys);
	return AllMoney;
}
/*
 * 画第一个数量的柱形图
 */
function GrowthUpgradeScondChart(jsondata,GrowthUpgrade_svg,divId) {
	d3.selectAll(".GrowthUpgrade_svg"+divId).attr("width",document.documentElement.clientWidth -365);
	//var dataLine=[{"time":"year1","money":180},{"time":"year2","money":1000}] ;
	var dataLine=getMoneyData(jsondata);
	//var data = getNOData(jsondata); 
	var data = getChannelData(jsondata,1);
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
	});*/
	
	data.forEach(function(d) {
		  d.count = placeNamesArray.map(function(name) { return {name: name, value: +d[name]}; });
		});
	var channel=[];
	/*data[0].Metri_Regional.forEach(function (d){
		
		channel.push(d.ChannelName);
	});*/
	//alert(channel.length);
	//var channel = d3.keys(data[0].Metri_Regional);
	GrowthUpgradex0.domain(data.map(function(d) { return d.time; }));
	GrowthUpgradex1.domain(placeNamesArray).rangeRoundBands([0, GrowthUpgradex0.rangeBand()]);

	GrowthUpgradeLineX.domain(d3.extent(dataLine[0][moneyNamesArray[0]], function(d) { return d.time; }));
	  //设置y轴的值，由最大值范围平均分布
	GrowthUpgradeChartY.domain([0, d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value*1.6; }); })]);
	GrowthUpgradeLineY.domain([-2*d3.max(datalinemoney,function(d) { return d.money; }),d3.max(datalinemoney,function(d) { return d.money; })]);

	  //删除页面上的svg
	  //svg.
	GrowthUpgrade_svg.selectAll(".linelegend,.legend,.axis")
		.remove();
	GrowthUpgrade_svg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",GrowthUpgradex0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	GrowthUpgrade_svg.selectAll(".line")
		.transition()
		.duration(800)
		.style("stroke","#fff")
		.remove();
	GrowthUpgrade_svg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();	
	  //重新绘制svg
	GrowthUpgrade_svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(GrowthUpgradexAxis);
	  
	  
	GrowthUpgrade_svg.append("g")
		.attr("class", "y1 axis")
		.call(GrowthUpgradeyAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Qty");
	GrowthUpgrade_svg.append("g")
		.attr("class", "y2 axis")
		.attr("transform", "translate("+(width-370)+",0)")
		.call(GrowthUpgradeyAxisRight)
		.append("text")
		.attr("transform", "rotate(270)")
		.attr("y", -12)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");
	
	var state = GrowthUpgrade_svg.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + GrowthUpgradex0(d.time) + ",0)"; });
		
	state.selectAll("rect")
		.data(function(d) { return d.count; })
		.enter().append("rect")
		.attr("class","bar")
		.attr("title",function(d){return d.value;})
		.on("click",function(){GrowthUpgradeFirstChart(jsondata,GrowthUpgrade_svg,divId);})
		  
		// .attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return height; })
		//.attr("height", function(d) { return height - ChartY(d.value); })
		.style("fill", function(d) { return color(d.name); })
		 //  .attr("width", 0)
		// .transition()
		 //  .duration(1000)
		.attr("x", GrowthUpgradex0.rangeBand()/2)
		.transition()
		.duration(1000)
		.attr("x", function(d) { return GrowthUpgradex1(d.name); })
		.attr("width", GrowthUpgradex1.rangeBand())
		.attr("y", function(d) { return GrowthUpgradeChartY(d.value); })
		.attr("height", function(d) { return height - GrowthUpgradeChartY(d.value); })
	;
	
	var legend = GrowthUpgrade_svg.selectAll(".legend")
		.data(placeNamesArray.slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		//.attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; })
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
	  
	var linelegend = GrowthUpgrade_svg.selectAll(".linelegend")
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
	GrowthUpgrade_svg.append("path")
		.datum(dataLine[0][moneyNamesArray[m]])
		.attr("class", "line")
		.attr("d", GrowthUpgradeline)
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

function GrowthUpgradeFirstChart(jsondata,GrowthUpgrade_svg,divId){
	d3.selectAll(".GrowthUpgrade_svg"+divId).attr("width",document.documentElement.clientWidth -365);
	//var data = getTotalNOData(jsondata); 
	var data = getTotalNODatas(jsondata,0);
	var TotalMoneyData = getTotalMoney(jsondata); 
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
	//height = 250 - margin.top - margin.bottom;
	GrowthUpgradex0.domain(data.map(function(d) { return d.time; }));
	GrowthUpgradex1.domain(placeNamesArray).rangeRoundBands([0, GrowthUpgradex0.rangeBand()]);
	GrowthUpgradeLineX= d3.scale.linear().range([GrowthUpgradex0.rangeBand()/2+GrowthUpgradex0.rangeBand()/10+GrowthUpgradex0.rangeBand()/100, width-(GrowthUpgradex0.rangeBand()/2+GrowthUpgradex0.rangeBand()/10+GrowthUpgradex0.rangeBand()/100)-370]);
	GrowthUpgradeLineX.domain(d3.extent(TotalMoneyData[0][moneyNamesArray[0]], function(d) { return d.time; }));
	//ChartY = d3.scale.linear().range([height, 0]);
	GrowthUpgradeChartY.domain([0, d3.max(data, function(d) { return d3.max(d.count, function(d) { return d.value*1.6; }); })]);
	GrowthUpgradeLineY.domain([-2*d3.max(DataLineTotalMoney,function(d) { return d.money; }),d3.max(DataLineTotalMoney,function(d) { return d.money; })]);
	GrowthUpgrade_svg.selectAll(".linelegend,.legend,.axis")
		.remove();
	GrowthUpgrade_svg.selectAll(".bar")
		.transition()
		.duration(1000)
		.attr("x",GrowthUpgradex0.rangeBand()/2)
		.attr("width",0)
		.attr("y",height)
		.attr("height",0)
		.style("fill","#fff")
		.remove();
	GrowthUpgrade_svg.selectAll(".line")
		.transition()
		.duration(800)
		.style("stroke","#fff")
		.remove();
	GrowthUpgrade_svg.selectAll("g")
		.transition()
		.duration(1000)
		.remove();		
	GrowthUpgrade_svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(GrowthUpgradexAxis);
	
	GrowthUpgrade_svg.append("g")
		.attr("class", "y1 axis")
		.call(GrowthUpgradeyAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Qty");
	GrowthUpgrade_svg.append("g")
		.attr("class", "y2 axis")
		.attr("transform", "translate("+(width-370)+",0)")
		.call(GrowthUpgradeyAxisRight)
		.append("text")
		.attr("transform", "rotate(270)")
		.attr("y", -12)
		.attr("dy", "0.71em")
		.style("text-anchor", "end")
		.text("Amount");
	var state = GrowthUpgrade_svg.selectAll(".state")
	    .data(data)
	    .enter().append("g")
	    .attr("class", "g")
	    .attr("transform", function(d) { return "translate(" + GrowthUpgradex0(d.time) + ",0)"; });
	
	state.selectAll("rect")
	    .data(function(d) { return d.count; })
	    .enter().append("rect")
	    .attr("class","bar")
	    .attr("title",function(d){return d.value;})
	    .on("click",function(){GrowthUpgradeScondChart(jsondata,GrowthUpgrade_svg,divId);})
	  
	    .attr("x", function(d) { return GrowthUpgradex1(d.name); })
	    .attr("y", function(d) { return height; })
	   // .attr("height", function(d) { return height - ChartY(d.value); })
	    .style("fill", function(d) { return color(d.name); })
	   //  .attr("width", 0)
	   //.transition()
		//.duration(1000)
	    
	    .attr("x", GrowthUpgradex0.rangeBand()/2)
	    .transition()
	    .duration(1000)
	    .attr("x", function(d) { return GrowthUpgradex1(d.name); })
	    .attr("width", GrowthUpgradex1.rangeBand())
	    .attr("y", function(d) { return GrowthUpgradeChartY(d.value); })
	    .attr("height", function(d) { return height - GrowthUpgradeChartY(d.value); })
	    ;
	var legend = GrowthUpgrade_svg.selectAll(".legend")
	    .data(placeNamesArray.slice().reverse())
	    .enter().append("g")
	    .attr("class", "legend")
	   // .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
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
	var linelegend = GrowthUpgrade_svg.selectAll(".linelegend")
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
		GrowthUpgrade_svg.append("path")
		    .datum(TotalMoneyData[0][moneyNamesArray[m]])
		    .attr("class", "line")
		    .attr("d", GrowthUpgradeline)
		    .style("stroke", "#fff")
		    .transition() 
		    .duration(1000)
		    .style("stroke", linecolor[m])
		    .style("stroke-width",2);
		}

}


