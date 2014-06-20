(function() {
	Ext.namespace('DigiCompass.Web.UI.Workspace.Cmp.Tree');

	Ext.override('Ext.data.TreeStore', {
	     load : function(options) {
	         options = options || {};
	         options.params = options.params || {};
	 
	        var me = this, node = options.node || me.tree.getRootNode(), root;
	 
	        // If there is not a node it means the user hasnt defined a rootnode
	         // yet. In this case lets just
	         // create one for them.
	         if (!node) {
	             node = me.setRootNode( {
	                 expanded : true
	             });
	         }
	 
	        if (me.clearOnLoad) {
	             node.removeAll(false);
	         }
	 
	        Ext.applyIf(options, {
	             node : node
	         });
	         options.params[me.nodeParam] = node ? node.getId() : 'root';
	 
	        if (node) {
	             node.set('loading', true);
	         }
	         return me.callParent( [ options ]);
	     }
	 });
	
	DigiCompass.Web.UI.Workspace.Cmp.Tree.createTree = function(data, config) {
		var id =config.id;
		
		var treeData = data.BUSINESS_DATA.tree;
		var tree = Ext.JSON.decode(treeData);
		var treeStore = Ext.create('Ext.data.TreeStore', {
		    root: {
		        expanded: true,
		        children: tree
		    }
		});
		
		if (Ext.getCmp(id)) {
			//重新加载Tree
		}else {
			
			var leftTreePanel = Ext.create('Ext.tree.Panel', {
				id:id,
			    width: '200',
			    border : false,
			    bodyBorder : false,
			    height : Ext.getCmp('west-panel').getHeight() - 24 * 1.5,
			    autoScroll:true,
			    store: treeStore,
			    rootVisible: false,
				viewConfig : {
					 plugins: {
		                   ptype: 'treeviewdragdrop',
		                   enableDrag: true,
		                   enableDrop: false,
		                   dragGroup: 'treeDDGroup'
		             }
				}
			});
			Ext.getCmp('west-panel').add(leftTreePanel);
			Ext.QuickTips.init();
		}
	}
	
	DigiCompass.Web.UI.Workspace.Cmp.Tree.refreshTree = function(){
		cometdfn.publish({ MODULE_TYPE: 'MOD_SITE_GROUP',COMMAND:'COMMAND_QUERY_TREE'});
	}
	
	
})();