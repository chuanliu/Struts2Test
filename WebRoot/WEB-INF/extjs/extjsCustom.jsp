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
		extjsCustom = function(){
			var config = {
			title: "Coustom MessageBox",
			msg: "This is a coustom messageBox",
			width: 400,
			multiline: true,
			closable: false,
			buttons: Ext.MessageBox.YESNOCANCEL,
			icon: Ext.MessageBox.QUESTION,
			fn: function(btn, txt){
			Ext.MessageBox.alert("result", " You click 'Yes' button <br>, input value is " + txt);
			}
			};
			Ext.MessageBox.show(config);
			}
		Ext.onReady(extjsCustom);
</script>
</head>
<body>
	<!‐‐ Nothing in the body ‐‐>
</body>
</html>