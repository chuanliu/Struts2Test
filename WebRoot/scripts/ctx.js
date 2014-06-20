(function(window, undefined) {
	window.context = {};
	context.param = function(a) {
		var rquery = /\?/, r20 = /%20/g;
		var s = [], add = function(key, value) {
			s[s.length] = encodeURIComponent(key) + "="
					+ encodeURIComponent(value);
		};
		for ( var prefix in a) {
			add(prefix, a[prefix]);
		}
		return s.join("&").replace("r20", "+");
	};
	
	context.codeLatLng = function(latStr, lngStr, fn){
		var lat = parseFloat(latStr);
	    var lng = parseFloat(lngStr);
	    var latlng = new google.maps.LatLng(lat, lng);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'latLng': latlng}, fn);
	};
	context.codeAddress = function(address, fn) {	  
		var geocoder = new google.maps.Geocoder();
	    geocoder.geocode({'address':address}, fn);
	};
})(window);