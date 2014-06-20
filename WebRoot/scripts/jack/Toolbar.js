Toolbar=function() {
		new Ext.Toolbar({
			renderTo : document.body,
			items : [ {
				xtype : 'tbbutton',
				text : 'Button'
			}, {
				xtype : 'tbbutton',
				text : 'Menu Button',
				menu : [ {
					text : 'Better'
				}, {
					text : 'Good'
				}, {
					text : 'Best'
				} ]
			}, {
				xtype : 'tbsplit',
				text : 'Split Button',
				menu : [ {
					text : 'Item One'
				}, {
					text : 'Item Two'
				}, {
					text : 'Item Three'
				} ]
			} ]
		});
	}