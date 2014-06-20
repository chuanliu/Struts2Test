<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/extâbase.js"></script>
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>
<script>
	/*  Ext.onReady(function() {
		//Ext.BLANK_IMAGE_URL = 'images/s.gif';
		Ext.Msg.show({
			title : 'Milton',
			msg : 'Have you seen my stapler?',
			buttons : {
				yes : true,
				no : true,
				cancel : true
			},
			icon: 'milton‐icon',
		});
	}); */

	Ext.onReady(function() {
		var movie_form = new Ext.FormPanel({
			url : 'movie‐form‐submit.php',
			renderTo : document.body,
			frame : true,
			title : 'Movie Information Form',
			width : 350,
			items : [ {
				xtype : 'textfield',
				fieldLabel : 'Title',
				name : 'title',
				allowBlank : false
			}, {
				xtype : 'textfield',
				fieldLabel : 'Director',
				name : 'director'
			}, {
				xtype : 'datefield',
				fieldLabel : 'Released',
				name : 'released',
				disabledDays: [0,6]
			}, {
				xtype : 'timefield',
				fieldLabel : 'time',
				name : 'time'
			} ]
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
	<!ââ Nothing in the body ââ>
</body>
</html>