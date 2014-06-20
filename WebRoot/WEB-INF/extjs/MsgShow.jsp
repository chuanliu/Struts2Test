<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/extâbase.js"></script>
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>



</head>
<body>
	<script>
		stapler = function() {
			Ext.Msg.show({
				title : 'Milton',
				msg : 'Have you seen my stapler?',
				buttons : Ext.MessageBox.YESNOCANCEL,
				icon : 'milton‐icon',
				/* fn: function(btn) {
					Ext.Msg.alert('You Clicked', btn);
					} */
				fn : function(btn) {
					switch (btn) {
					case 'yes':
						Ext.Msg.prompt('Milton', 'Where is it?');
						break;
					case 'no':
						Ext.Msg.alert('Milton',
								'Im going to burn the building down!');
						break;
					case 'cancel':
						Ext.Msg.wait('Saving tables to disk...', 'File Copy');
						break;
					}
				}
			});
		}
		Ext.onReady(stapler);
	</script>

</body>
</html>