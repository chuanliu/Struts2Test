var divid;
var jsondata;
var svg;
var mytestsss = 0;
var SubscribersDivInfo = {};
var SubscribersWindow,GrowthUpgradeWindow,CoverageUnplannedWindow,GrowthNewCapacityWindow,CoveragePlannedWindow,CapexTotalAmountWindow;
var color = d3.scale.ordinal()
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#ff8c00","#a05d56", "#d0743c", "#ff9666","#ffb080","#ffa64d","#fa5700","#DAA520"]);
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = document.documentElement.clientWidth -365 - margin.left - margin.right;
    height = 250 - margin.top - margin.bottom;
/*
 * 当改变浏览器尺寸的时候执行，延迟200毫秒执行，这样也可保证window.onresize在改变浏览器大小的时候只执行一次
 */ 
var timer;
window.onresize=function(){
	clearTimeout(timer);
	timer = setTimeout(changeWindowSizeRedrow,500);
  
   }

var Subscribersx0 = d3.scale.ordinal()
    .rangeRoundBands([0, width-370], .1);
var Subscribersx1 = d3.scale.ordinal();
var Subscribersy = d3.scale.linear()
	.range([height, 0]);
var SubscribersxAxis = d3.svg.axis()
    .scale(Subscribersx0)
    .orient("bottom");
var SubscribersyAxis = d3.svg.axis()
    .scale(Subscribersy)
    .orient("left")
	.tickFormat(d3.format(".2s"));   

	
var GrowthUpgradex0 = d3.scale.ordinal()
	.rangeRoundBands([0, width-370], .1);
var GrowthUpgradex1 = d3.scale.ordinal();
var GrowthUpgradeLineX= d3.scale.linear();
var GrowthUpgradeChartY = d3.scale.linear()
	.range([height, 0]);
var GrowthUpgradeLineY = d3.scale.linear()
	.range([height, 0]);
var linecolor = ["#ff1500", "#ffd900", "#cf0", "#51ff00", "#08f", "#0008ff", "#b300ff","#ff00bf","#ff000d","#ff9499","#ff00e1"];
var linecolor = [ "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78"," #2ca02c", "#98df8a", "#d62728"," #ff9896", "#9467bd", "#c5b0d5 ","#8c564b", "#c49c94"," #e377c2", "#f7b6d2"," #7f7f7f"," #c7c7c7", "#bcbd22", "#dbdb8d"," #17becf", "#9edae5"];
var GrowthUpgradexAxis = d3.svg.axis()
	.scale(GrowthUpgradex0)
	.orient("bottom");
var GrowthUpgradeyAxisLeft = d3.svg.axis()
	.scale(GrowthUpgradeChartY)
	.orient("left")
	.tickFormat(d3.format(".2s"));
var GrowthUpgradeyAxisRight = d3.svg.axis()
	.scale(GrowthUpgradeLineY)
	.orient("right")
	.tickFormat(d3.format(".2s"));
var GrowthUpgradeline = d3.svg.line()
	.x(function(d) { return GrowthUpgradeLineX(d.time); })
	.y(function(d) { return GrowthUpgradeLineY(d.money); });
	
	
var GrowthNewCapacityx0 = d3.scale.ordinal()
	.rangeRoundBands([0, width-370], .1);
var GrowthNewCapacityx1 = d3.scale.ordinal();
var GrowthNewCapacityLineX= d3.scale.linear();
var GrowthNewCapacityChartY = d3.scale.linear()
	.range([height, 0]);
var GrowthNewCapacityLineY = d3.scale.linear()
	.range([height, 0]);
var GrowthNewCapacityxAxis = d3.svg.axis()
	.scale(GrowthNewCapacityx0)
	.orient("bottom");
var GrowthNewCapacityyAxisLeft = d3.svg.axis()
	.scale(GrowthNewCapacityChartY)
	.orient("left")
	.tickFormat(d3.format(".2s"));
var GrowthNewCapacityyAxisRight = d3.svg.axis()
	.scale(GrowthNewCapacityLineY)
	.orient("right")
	.tickFormat(d3.format(".2s"));
var GrowthNewCapacityline = d3.svg.line()
	.x(function(d) { return GrowthNewCapacityLineX(d.time); })
	.y(function(d) { return GrowthNewCapacityLineY(d.money); });
	
	
var CoverageUnplannedx0 = d3.scale.ordinal()
	.rangeRoundBands([0, width-370], .1);
var CoverageUnplannedx1 = d3.scale.ordinal();
var CoverageUnplannedLineX= d3.scale.linear();
var CoverageUnplannedChartY = d3.scale.linear()
	.range([height, 0]);
var CoverageUnplannedLineY = d3.scale.linear()
	.range([height, 0]);
var CoverageUnplannedxAxis = d3.svg.axis()
	.scale(CoverageUnplannedx0)
	.orient("bottom");
var CoverageUnplannedyAxisLeft = d3.svg.axis()
	.scale(CoverageUnplannedChartY)
	.orient("left")
	.tickFormat(d3.format(".2s"));
var CoverageUnplannedyAxisRight = d3.svg.axis()
	.scale(CoverageUnplannedLineY)
	.orient("right")
	.tickFormat(d3.format(".2s"));
var CoverageUnplannedline = d3.svg.line()
	.x(function(d) { return CoverageUnplannedLineX(d.time); })
	.y(function(d) { return CoverageUnplannedLineY(d.money); });
	
	
var Coverageplannedx0 = d3.scale.ordinal()
	.rangeRoundBands([0, width-370], .1);
var Coverageplannedx1 = d3.scale.ordinal();
var CoverageplannedLineX= d3.scale.linear();
var CoverageplannedChartY = d3.scale.linear()
	.range([height, 0]);
var CoverageplannedLineY = d3.scale.linear()
	.range([height, 0]);
var CoverageplannedxAxis = d3.svg.axis()
	.scale(Coverageplannedx0)
	.orient("bottom");
var CoverageplannedyAxisLeft = d3.svg.axis()
	.scale(CoverageplannedChartY)
	.orient("left")
	.tickFormat(d3.format(".2s"));
var CoverageplannedyAxisRight = d3.svg.axis()
	.scale(CoverageplannedLineY)
	.orient("right")
	.tickFormat(d3.format(".2s"));
var Coverageplannedline = d3.svg.line()
	.x(function(d) { return CoverageplannedLineX(d.time); })
	.y(function(d) { return CoverageplannedLineY(d.money); });
	
	
var Capexx0 = d3.scale.ordinal()
    .rangeRoundBands([0, width-370], .1);
var Capexx1 = d3.scale.ordinal();
var Capexy = d3.scale.linear()
	.range([height, 0]);
var CapexxAxis = d3.svg.axis()
    .scale(Capexx0)
    .orient("bottom");
var CapexyAxis = d3.svg.axis()
    .scale(Capexy)
    .orient("left")
    .tickFormat(d3.format(".2s"));
    
    
var Statementx0 = d3.scale.ordinal()
    .rangeRoundBands([0, width-370], 0.0);
var Statementx1 = d3.scale.ordinal();
var Statementy = d3.scale.linear()
	.range([height, 0]);
var StatementxAxis = d3.svg.axis()
    .scale(Statementx0)
    .orient("bottom");
var StatementyAxis = d3.svg.axis()
    .scale(Statementy)
    .orient("left")
    .tickFormat(d3.format(".2s"));