test = function() {
	Ext.get("btn").on("click", function() {
		Ext.MessageBox.alert("Click", "I'm very happy to be clicked");
	});
}
Ext.onReady(test);

greeting = function() {
	Ext.get("btn2").on("click", function() {
		var name = Ext.get("name").dom.value;
		Ext.Msg.alert("Hello", "Hello " + name + " greeting from extjs!");
	});
}
Ext.onReady(greeting);