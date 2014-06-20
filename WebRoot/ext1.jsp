<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/extâbase.js"></script>
<script	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>
	
<script>
	  Ext.onReady(function() {
		Ext.BLANK_IMAGE_URL = 'images/s.gif';
		Ext.Msg.show({
			title : 'Milton',
			msg : 'Have you seen my stapler?',
			buttons: Ext.MessageBox.YESNO,
			/* buttons : {
				yes : true,
				no : true,
				cancel : true
			}, */
			icon: 'milton‐icon',
		});
	}); 

	/* function stapler(){
		Ext.Msg.show({
		title: 'Milton',
		msg: 'Have you seen my stapler?',
		buttons: {
		yes: true,
		no: true,
		cancel: true
		}
		});
		}
		Ext.onReady(stapler()); */
</script>
</head>
<body>
	<!-- Nothing in the body � -->
</body>
</html>