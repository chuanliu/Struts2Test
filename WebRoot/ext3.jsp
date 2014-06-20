<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/extÃ¢ÂÂbase.js"></script>
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>
<script>
Ext.onReady(function(){
	var movie_form = new Ext.FormPanel({
	url: 'movie‐form‐submit.php',
	renderTo: document.body,
	frame: true,
	title: 'Movie Information Form',
	width: 300,
	items: [{
	xtype: 'textfield',
	fieldLabel: 'Title',
	name: 'title',
	allowBlank: false
	},{
	xtype: 'textfield',
	fieldLabel: 'Director',
	name: 'director',
	vtype: 'alpha'
	},{
	xtype: 'datefield',
	fieldLabel: 'Released',
	name: 'released',
	disabledDays: [1,2,3,4,5]
	}]
	});
	});
</script>
</head>
<body>
	<!-- Nothing in the body -->
</body>
</html>