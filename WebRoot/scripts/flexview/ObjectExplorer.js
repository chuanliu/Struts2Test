Ext.define('DigiCompass.Web.app.grid.ObjectExplorer', {
	extend: 'DigiCompass.Web.app.grid.MutiGroupGrid',
	SEARCH_KEY : 'search',
	constructor : function(config) {
		var me = this;
		delete config.title;
		config.collapsible = false;
		config.useSearch = true;
		config.tbar = [{
			xtype:'button',
			text:'clear grouping',
			handler:function(){
				me.target.features[0].cleanGrouping();
			}
		}];
		me.callParent([config]);
		me.addListener('catalogueshow', function(){
			var exp = Ext.getCmp('obj-exp');
			if(exp.getWidth()<300){
				exp.setWidth(500);
			}
		})
	},
	
	search : function(val){
		var param = {};
		param[this.SEARCH_KEY] = val;
		return this.reload(param, null, false);
	}
});