(function(){
	Ext.namespace("DigiCompass.Web.Util");
	//传入年份，如：2012
	DigiCompass.Web.Util.getFullDateOfYear = function (d){
		var firstDateOfYear = new Date(d,0,1);
		var firstDateOfNextYear = new Date(firstDateOfYear.getFullYear() + 1,0,1);
		return (firstDateOfNextYear - firstDateOfYear)/(24*60*60*1000) ;
	}
	DigiCompass.Web.Util.getWeeks = function (d){
		var days = DigiCompass.Web.Util.getFullDateOfYear(d);
		var firstDateOfYear = new Date(d,0,1);
		if(days == 366 && firstDateOfYear.getDay() == 0){
		 	return 54;
		}
		else{
		      return 53;
		}
	}
	DigiCompass.Web.Util.getWeekNumber = function(d) {
	    // Copy date so don't modify original
	    d = new Date(d);
	    d.setHours(0,0,0);
	    // Set to nearest Thursday: current date + 4 - current day number
	    // Make Sunday's day number 7
	    d.setDate(d.getDate() + 4 - (d.getDay()||7));
	    // Get first day of year
	    var yearStart = new Date(d.getFullYear(),0,1);
	    // Calculate full weeks to nearest Thursday
	    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
	    // Return array of year and week number
	    return [d.getFullYear(), weekNo];
	}
	DigiCompass.Web.Util.getWeekNumber = function(d){ 
		var _date = new Date(d);
		var date = new Date(d); 
		date = new Date(date.getFullYear(),0,1); 
		var devDate = date.getDay(); 
		if(devDate != 0){
			date = new Date(date.getFullYear(),0,date.getDate()+(7 - devDate));
		}
		if((_date - date) < 0 || (date.getDate() == 1 &&  _date.getDate() ==1 )){
			return [ _date.getFullYear() , 1 ];
		}else{
			return [ _date.getFullYear() , Math.ceil(((_date - date )/(24*60*60*1000) + 1 )/7) + 1];
		}
	}
})();