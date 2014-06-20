Ext.onReady(function() {
	Ext.get("a1").applyStyles({
		position : "absolute",
		top : 200,
		left : 200,
		backgroundColor : "red",
		width : 100,
		height : 100
	}).slideIn("tl", {
		duration : 1000
	});
});