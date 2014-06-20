(function(){
	Ext.namespace("DigiCompass.Web.TreeUtil");
	/**
	 * private function get Children Data
	 */

	function getChildData(children){
		var childrenData = [];
		for(var i = 0 ; i< children.length ; i++){
			var data = {};
			var _data = children[i].raw;
			for(var key in _data){
				data[key] = _data[key];
			}
			data.name = children[i].data.name;
			data.description = children[i].data.description;
			if(!Ext.isEmpty(children[i].childNodes) && Ext.isArray(children[i].childNodes)){
				data.children = getChildData(children[i].childNodes);
			}
			childrenData.push(data);
		}
		return childrenData; 
	}
	/**
	 * get all tree data by tree
	 */
	DigiCompass.Web.TreeUtil.getTreeData = function (tree){
		var root = {};
		var data = tree.raw;
		for(var key in data){
			root[key] = data[key];
		}
		root.name = tree.data.name;
		root.description = tree.data.description;
		var child = tree.childNodes;
		root.children = getChildData(child);
		return root ;
	}
	/**
	 * all obj-exp event，if event is button return true,Because grid And tree checked is a button event
	 */
	DigiCompass.Web.TreeUtil.isCheckChange = function(event){
		if(event.target){
		   if(event.target.type == 'button')
			return true;
		}
		else if(event.srcElement){
			if(event.srcElement.type == 'button'){
				return true;
			}
		}
	}
	/**
	 * private function check or uncheck childNode
	 */
	function checked(node,flag){
		node.eachChild(function(childNode){
			childNode.set("checked",flag);
			checked(childNode,flag);
		});
	}
	DigiCompass.Web.TreeUtil.checkedAllFunc = function(e,self,id){
		var me = Ext.getCmp(id),
		rootNode = me.getRootNode(),
		store = me.getStore();
		store.suspendEvents(); 
		checked(rootNode , self.checked);
			
		/*if(self.checked){
			rootNode.cascadeBy(function(n){
				n.set('checked',true);
				//n.commit();
			})
		}
		else{
			rootNode.cascadeBy(function(n){
				n.set('checked',false);
				//n.commit();
			})
		}
		*/
		store.resumeEvents();  
		me.getView().refresh();
		store.fireEvent("datachanged",store);
		e = e || window.event;
		e.stopPropagation();
	}
	/**
	 * check or uncheck child by node and checked flag 
	 */
	DigiCompass.Web.TreeUtil.checkchild = function(node,checked){  
        node.eachChild(function(child) {
			if(child.childNodes.length>0){
				DigiCompass.Web.TreeUtil.checkchild(child,checked);//递归  
		    }  
			if(child.get("checked") != null){
				child.set("checked",checked);
				child.fireEvent('checkchange',child , checked);
				child.commit();
			}
		});
    }  
	/**
	 * check or uncheck parent; if the all children of node's parent are checked ,the parent must checked  
	 */
	DigiCompass.Web.TreeUtil.checkparent = function(node){
		if(!node){
			return false;
		}
		var parentNode = node.parentNode;  
		if(parentNode !== null){
			var isall=true;  
		  	parentNode.eachChild(function(n){  
				if(!n.data.checked){
					isall=false;  
				}
			});
		  	parentNode.set("checked" , isall);
		  	parentNode.fireEvent('checkchange',parentNode , isall);
		  	parentNode.commit();
		}
		DigiCompass.Web.TreeUtil.checkparent(parentNode);//递归  
	}
		/**
	 * parentNode [2,1] ['name','description'] ,find all children of parentNode has data name = 2 and description = 1  
	 */
	DigiCompass.Web.TreeUtil.findNode = function(parentNode, dataVal, findKey){
		if(parentNode.getData()[findKey]==dataVal){
			return parentNode;
		}else{
			for(var i=0; i<parentNode.childNodes.length; i++){
				var node = DigiCompass.Web.TreeUtil.findNode(parentNode.childNodes[i], dataVal, findKey);
				if(node){
					return node;
				}
			}
		}
	}
	
	
	DigiCompass.Web.TreeUtil.expandNode = function(node, expandOwn, checkOwn){
		if(expandOwn){
			node.expand();
		}
//		node.set("checked",true);
		while(node.parentNode && !node.parentNode.isRoot()){
			node = node.parentNode;
			node.expand();
//			if(checkOwn){
//				var isall=true;  
//				node.eachChild(function(n){  
//					if(!n.data.checked){
//						isall=false;  
//					}
//				});
//				node.set("checked" , isall);
//				node.fireEvent('checkchange',node , isall);
//			}
		}
	}
	/**
	 * parentNode [2,1] ['name','description'] ,expanded all children of parentNode has data name = 2 and description = 1  
	 */
	DigiCompass.Web.TreeUtil.findAndExpandNode = function(parentNode, dataVal, findKey){
		var node = DigiCompass.Web.TreeUtil.findNode(parentNode, dataVal, findKey);
		if(node){
			DigiCompass.Web.TreeUtil.expandNode(node, true, false);
		}
		return node;
	}
	
	/**
	 * common function is used by all obj-exp ,
	 * checked parent all children are checked
	 */
	DigiCompass.Web.TreeUtil.checkChange = function(node, checked) {
		node.set('checked', checked);
        node.fireEvent('checkchange', node , checked);
        node.commit();
	}
	
	DigiCompass.Web.TreeUtil.addChecked = function(node, id){  
    	if (node.currentId === id) {
    		node.checked = true;
			return;
    	}
    	var children = node.children;
    	if (!children) {
    		return;
    	}
    	var len = children.length;
		if (len > 0) {
			for (var i=0; i<len; i++) {
				DigiCompass.Web.TreeUtil.addChecked(children[i], id);//递归  
			}
	    }
    }
	/**
	 * getAllChildren from node ，get Children's raw data
	 */
	DigiCompass.Web.TreeUtil.getChildrenByNode = function(node){
		var children = [];
		var childNodes = node.childNodes; 
		for(var i = 0 ; i<childNodes.length ; i++){
			if(childNodes[i].childNodes && childNodes[i].childNodes.length > 0){
				children.push(Ext.apply(childNodes[i].raw,
					{ expanded: true,
					children : DigiCompass.Web.TreeUtil.getChildrenByNode(childNodes[i])}));
			}else{
				children.push(Ext.apply(childNodes[i].raw, {reference : 0}));
			}
		}
		return children;
	}
})();