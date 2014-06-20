<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext‐base.js"></script>
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>
<script>
extjsProgress = function(){
	Ext.MessageBox.show({
	title: 'please wait',
	msg: 'init project...',
	progressText: 'init now...',width:300,
	progress:true, //this is a progress
	closable:false
	});
	var f = function(v){
	return function(){
	if(v == 12){
	Ext.MessageBox.hide();
	Ext.MessageBox.alert('finished', 'all progress finished!');
	}else{
	var i = v/11;
	Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% finished');
	}
	};
	};
	for(var i = 1; i < 13; i++){
	setTimeout(f(i), i*500);
	}
	}
		Ext.onReady(extjsProgress);
</script>
</head>
<body>
	<!‐‐ Nothing in the body ‐‐>
</body>
</html>