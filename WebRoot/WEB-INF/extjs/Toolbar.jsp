<%@ page contentType="text/html; charset=gb2312" language="java"%>
<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all.js"></script>
</head>
<body>
	<script>
		Ext.onReady(function() {
			Ext.create('Ext.toolbar.Toolbar', {
				renderTo : document.body,
				width : 500,
				items : [ {
					// xtype: 'button', // default for Toolbars
					text : 'Button'
				}, {
					xtype : 'splitbutton',
					text : 'Split Button'
				},
				// begin using the right-justified button container
				'->', // same as { xtype: 'tbfill' }
				{
					xtype : 'textfield',
					name : 'field1',
					emptyText : 'enter search term'
				},
				// add a vertical separator bar between toolbar items
				'-', // same as {xtype: 'tbseparator'} to create Ext.toolbar.Separator
				'text 1', // same as {xtype: 'tbtext', text: 'text1'} to create Ext.toolbar.TextItem
				{
					xtype : 'tbspacer'
				},// same as ' ' to create Ext.toolbar.Spacer
				'text 2', {
					xtype : 'tbspacer',
					width : 50
				}, // add a 50px space
				'text 3' ]
			});
		});
	</script>

</body>
</html>