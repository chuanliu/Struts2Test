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
	Ext.onReady(function(){
		var cities = [
		[1, "长沙市"],
		[2, "株洲市"],
		[3, "湘潭市"],
		[4, "邵阳市"]
		];
		var proxy = new Ext.data.MemoryProxy(cities);
		var City = Ext.data.Record.create([
		{name: "cid", type: "int", mapping: 0},
		{name: "cname", type: "string", mapping: 1}
		]);
		//var reader = new Ext.data.ArrayReader({}, City);
		var reader = new Ext.data.ArrayReader({}, [
		{name: "cid", type: "int", mapping: 0},
		{name: "cname", type: "string", mapping: 1}
		]);
		
		var store = new Ext.data.Store({
			proxy: proxy,
			reader: reader,
			autoLoad: true //即时加载数据
			});
			//store.load();
			var combobox = new Ext.form.ComboBox({
			renderTo: Ext.getBody(),
			triggerAction: "all",
			store: store,
			displayField: "cname",
			valueField: "cid",
			mode: "local",
			emptyText: "请选择湖南城市"
			});
			var btn = new Ext.Button({
			text: "列表框的值",
			renderTo: Ext.getBody(),
			handler: function(){
			Ext.Msg.alert("值", "实际值：" + combobox.getValue() + "；显示值：" +
			combobox.getRawValue());
			}
			});
			})
	</script>

</body>
</html>