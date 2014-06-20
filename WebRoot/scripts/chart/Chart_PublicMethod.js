/*
 * strip， Remove the blank space to replace '_'
 */
 function trim(s){   
//    str = str.replace(/\s/ig,'_');   
//    for(var i=str.length-1; i>=0; i--){   
//        if(/\S/.test(str.charAt(i))){   
//            str = str.substring(0, i+1);   
//            break;   
//        }   
//    }
   	  var count = s.length;
	  var st    = 0;       // start
	  var end   = count-1; // end
	
	  if (s == "") return s;
	  while (st < count) {
	    if (s.charAt(st) == " ")
	      st ++;
	    else
	      break;
	  }
	  while (end > st) {
	    if (s.charAt(end) == " ")
	      end --;
	    else
	      break;
	  }
	  return s.substring(st,end + 1).replace(/\s/ig,'_');
  
  
   // return str;   
} 


 function Mytooltip(value){
   	value.tip = Ext.create('Ext.tip.ToolTip', {
    target: value.el,
    html: value,
    trackMouse: true,
    renderTo: Ext.getBody(),
    listeners: {
        // Change content dynamically depending on which element triggered the show.
        beforeshow: function updateTipBody(tip) {
            tip.update(value);
        }
    }
});
   }
/*
 * The number of parsing json on the branches spectrum array
 */
function getChannelData(jsondata,row){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalNOData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalNODatas={};
		for ( var k = 0; k < rowHeader.length; k++) {
			if(rowHeader[k][row+2]==="Qty"){
			TotalNODatas[trim(rowHeader[k][row])+trim(rowHeader[k][row+1])]=0;
			}
		}
		TotalNODatas["time"]=columnHeader[i][1];
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][row+2 ]==="Qty"){
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalNODatas[trim(rowHeader[j][row])+trim(rowHeader[j][row+1])] += data[j][i][1];
				}
			}
		}
		TotalNOData.push(TotalNODatas);
	}
	return TotalNOData;
}
/*
 * 
 * Parsing the JSON data on urban and rural type combined array
 */
function getTotalNODatas(jsondata,row){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalNOData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalNODatas={};
		for ( var k = 0; k < rowHeader.length; k++) {
			if(rowHeader[k][row+3]==="Qty"){
				
			TotalNODatas[trim(rowHeader[k][row+1])]=0;
			}
		}
		TotalNODatas["time"]=columnHeader[i][1];
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][row+3]==="Qty"){
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalNODatas[trim(rowHeader[j][row+1])] += data[j][i][1];
				}
			}
		}
		TotalNOData.push(TotalNODatas);
	}
	return TotalNOData;
}
/*
 * Parsing the JSON data on an array of each spectrum was the sum of money
 */
function getChannelMoneyDatas(jsondata,row){
	var columnHeader = jsondata.BUSINESS_DATA.rawData.columnHeader;
	var data = jsondata.BUSINESS_DATA.rawData.data;
	var rowHeader = jsondata.BUSINESS_DATA.rawData.rowHeader;
	var TotalMOneyData=[];
	for ( var i = 0; i < columnHeader.length; i++) {
		var TotalMoneyDatas={};
		for ( var k = 0; k < rowHeader.length; k++) {
			if(rowHeader[k][4]==="Amount"){
				
				TotalMoneyDatas[trim(rowHeader[k][row])+trim(rowHeader[k][row+1])]=0;
			}
		}
		TotalMoneyDatas["time"]=columnHeader[i][1];
		for ( var j = 0; j < rowHeader.length; j++) {
			if(rowHeader[j][4]==="Amount"){
				if(data && data[j] && data[j][i] && data[j][i][1]){
					TotalMoneyDatas[trim(rowHeader[j][row])+trim(rowHeader[j][row+1])] += data[j][i][1];
				}
			}
		}
		TotalMOneyData.push(TotalMoneyDatas);
	}
	return TotalMOneyData;
}
/*
 * clone a object
 */
function myClone(obj) {
	if(obj == null || typeof(obj) != 'object') return obj;
	      var temp = new obj.constructor(); 
	      for(var key in obj) temp[key] = myClone(obj[key]);
	     	 return temp;
      
      } 
function changeWindowSizeRedrow(){
	//SubscribersWindowRedow();
	try{SubscribersWindow();}catch(e){}
	try{GrowthUpgradeWindow();}catch(e){}
	try{CoverageUnplannedWindow();}catch(e){}
	try{GrowthNewCapacityWindow();}catch(e){}
	try{CoveragePlannedWindow();}catch(e){}
	try{CapexTotalAmountWindow();}catch(e){}
	try{StatementTotalAmountWindow();}catch(e){}
	
}