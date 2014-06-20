Ext.define('DigiCompass.Web.ux.objectExplorerExt',{
	extend : 'Ext.tree.Panel',
	groupByText : 'Group by this field',
	disabled:false,
	lastGroupIndex : [],
	data:[],
	fields:[],
	columns:[],
	rootVisible: false,
	enableNoGroups : true,
	hiddenHeader:[],
	module:'',
	command:'',
	viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            appendOnly: true
        }
    },
	groupBackLoad : false,
	otherParam:{},
	checkedAllId:'a_checkall', 
	initComponent : function() {
		var me = this;
		datas = me.data;
		fields = me.fields,
		children = new Array(),
		columns = me.columns,
		checkedAllId = me.checkedAllId;
		me.lastGroupIndex = [];
		//searchField;
		for(var i = 0 ; i< columns.length ; i++){
			var column = columns[i];
			if(column.xtype == "treecolumn"){
				var id = me.getId();
				if(column.text){
					column.text = '<input type="checkbox" id='+checkedAllId+'  onclick="DigiCompass.Web.TreeUtil.checkedAllFunc(event,this,\''+id+'\')">&nbsp;'+ column.text;
				}
				if(column.header){
					column.header = '<input type="checkbox" id='+checkedAllId+'  onclick="DigiCompass.Web.TreeUtil.checkedAllFunc(event,this,\''+id+'\')">&nbsp;'+ column.header;
				}
				me.treeColumn = column.dataIndex;
			}
		}
		for(var i = 0 ; i < datas.length ; i++){
			var data = datas[i];
			data.checked = false;
			data.leaf = true;
			children.push(data);
		}
		var store = Ext.create('Ext.data.TreeStore', {
			fields:fields,
	        root: {
				expanded: false,  
	            children: children
	        }
		});
		var searchField = Ext.create('Ext.ux.form.BtnSearchField',{
			width:150,
			onTrigger2Click : function(){
				var searchField = this,
					value = searchField.getValue();
				searchField.showCancelBtn();
				me.searchFn(value);
			},
			onTrigger1Click : function(){
				var searchField = this;
				searchField.hideCancelBtn();
				value = searchField.getValue();
				me.searchFn(value);
			}
		});
		me.tbar = ['Search: ', ' ', searchField];
		me.store = store;
		me.callParent(arguments);
		me.createHeaderMenu();
		this.headerCt.on('menucreate', function (cmp, menu, eOpts) {
	        menu.on('beforeshow', this.hideGroupMenuItem);
	    }, this);
		me.addEvents({
		      "group" : true
		   });
	},
	hideGroupMenuItem : function(menu){
		var me = this,
		treeColumn = me.treeColumn;
		var groupMenuItem = menu.down('#groupMenuItem');
		if(me.activeHeader.getXType() == "treecolumn"){
			groupMenuItem.setVisible(false);
		}
		else{
			groupMenuItem.setVisible(true);
		}
	},
	enableGroupingMenu : true,
	createHeaderMenu : function() {
		var me = this,
			enableGroupingMenu = me.enableGroupingMenu;
		if (enableGroupingMenu) {
			me.injectGroupingMenu();
		}
	},
	injectGroupingMenu : function() {
		var me = this, headerCt = me.view.headerCt;
		headerCt.showMenuBy = me.showMenuBy;
		headerCt.getMenuItems = me.getMenuItems();
	},
	showMenuBy : function(t, header) {
		var menu = this.getMenu(), 
		groupMenuItem = menu.down('#groupMenuItem'), 
		groupableMth = header.groupable === false ? 'disable' : 'enable';
		groupMenuItem[groupableMth]();
		Ext.grid.header.Container.prototype.showMenuBy.apply(this, arguments);
	},
	getMenuItems : function() {
		var me = this, 
		groupByText = me.groupByText, 
		disabled = me.disabled || !me.getGroupField(), 
		showGroupsText = me.showGroupsText, 
		enableNoGroups = me.enableNoGroups, 
		getMenuItems = me.view.headerCt.getMenuItems;

		// runs in the scope of headerCt
		return function() {
			// We cannot use the method from HeaderContainer's
			// prototype here
			// because other plugins or features may already
			// have injected an implementation
			var o = getMenuItems.call(this);
			o.push('-', {
				iconCls : Ext.baseCSSPrefix + 'group-by-icon',
				itemId : 'groupMenuItem',
				text : groupByText,
				handler : me.onGroupMenuItemClick,
				scope : me
			});
			return o;
		};
	},
	getGroupField: function(){
		var me = this,
			groupers = me.lastGroupIndex;
		return groupers;
	},
	onGroupMenuItemClick: function(menuItem, e) {
		var me = this,
		menu = menuItem.parentMenu,
		hdr  = menu.activeHeader,
		view = me.view,
		store = view.store;
		me.lastGroupIndex = me.lastGroupIndex || [];
		var flag = false;
		for (var i = 0; i < me.lastGroupIndex.length; i++) {
			if (me.lastGroupIndex[i] == hdr.dataIndex) {
				flag = true;
				break;
			}
		}
		if (!flag) {
			me.lastGroupIndex.push(hdr.dataIndex);
			//me.collapseAll();
			
			me.getStore().suspendEvents(); 
			//if(me.groupBackLoad)
			//me.resetTree(hdr.dataIndex);
			me.getStore().resumeEvents(); 
			//me.expandAll();
		}
		me.hiddenHeader.push(hdr);
		hdr.setVisible(false);
		//me.refreshView();
		me.fireEvent("group");
		//me.showHeaders();
		//me.pruneGroupedHeader();
	},
	showHeaders : function(){
		var me = this,
		 	headerCt = me.view.headerCt;
	},
	upCheckedAll:function(){
		var me = this;
		var checkeds = me.superclass.getChecked.call(me);
		for(var i = 0 ; i<checkeds.length ; i++){
			checkeds[i].set('checked',false);
		}
	},
	refreshView:function(){
		var me = this;
		me.getView().refresh();
	},
	resetTree : function(dataIndex){
		var me = this,
			rootNode = me.getRootNode(),
			childNodes = rootNode.childNodes;
		if(rootNode.isLeaf()){
			return;
		}
		if(childNodes.length > 0 && childNodes[0].isLeaf()){
			me.resetLeafNode(childNodes,rootNode ,dataIndex);
		}
		else{
			for(var i = 0 ; i<childNodes.length ; i++ ){
				me.lookIntoAndFindLeaf(childNodes[i],dataIndex);
			}
		}
	},
	lookIntoAndFindLeaf : function(node , dataIndex){
		var me = this,
		childNodes = node.childNodes;
		if(childNodes.length > 0 && childNodes[0].isLeaf()){
			me.resetLeafNode(childNodes , node , dataIndex);
		}
		else{
			for(var i = 0 ; i<childNodes.length ; i++ ){
				me.lookIntoAndFindLeaf(childNodes[i] , dataIndex);
			}
		}
	},
	resetLeafNode : function(childNodes , parentNode , dataIndex){
		var me = this,
		groupedNodes = me.groupLeafNodes(childNodes , dataIndex);
		var isExpanded = parentNode.isExpanded();
		//parentNode.removeAll(false);
		for(var i = 0 ; i<groupedNodes.length ; i++ ){
			parentNode.appendChild(groupedNodes[i]);
		}
	},
	groupLeafNodes : function(nodes , dataIndex){
		var me = this;
		var groupedNodes = new Array();
		for(var i = nodes.length - 1 ; i>=0 ; i--){
			var flag = true;
			for(var j = 0 ; j<groupedNodes.length ; j++){
				if(groupedNodes[j][me.treeColumn] == nodes[i].data[dataIndex]){
					groupedNodes[j].children.push(nodes[i].data);
					if(!nodes[i].data.checked){
						groupedNodes[j].checked = false;
					}
					nodes[i].remove();
					nodes.splice(i, 1);
					flag = false;
					break;
				}
			}
			if(flag){
				var checked = nodes[i].data.checked;
				var node = {
						iconCls : 'task-folder',
						checked : checked,
						expanded : nodes[i].parentNode.isExpanded(),
						children : [nodes[i].data]
					}
				node[me.treeColumn] = nodes[i].data[dataIndex];
				nodes[i].remove();
				nodes.splice(i, 1);
				groupedNodes.push(node);
			}
		}
		return groupedNodes;
	},
	cleanGrouping:function(){
		var me = this,
			hidenHeaders = me.hiddenHeader;
		if(Ext.isEmpty(me.lastGroupIndex)){
			return;
		}
		for(var i = hidenHeaders.length - 1; i >= 0  ; i--){
			hidenHeaders[i].setVisible(true);
		}
		var param = {};
		for(var key in me.otherParam){
			param[key] = me.otherParam[key];
		}
		param.MODULE_TYPE = me.module;
		param.COMMAND = me.command;
		param.groupFields = [];
		cometdfn.publish(param);
		me.setRootNode({});
		me.hiddenHeader = new Array();
		me.lastGroupIndex = new Array();
		//me.combineChecked(checked, leafNodes);
			
	},
	getAllLeafNode:function(rootNode){
		var childNodes = rootNode.childNodes;
		var allLeafs = new Array();
		rootNode.cascadeBy(function(node){
			if(node.isLeaf()){
				allLeafs.push(node.data);
			}
		});
		return allLeafs;
	},
	getChecked:function(){
		var me = this,
		checkeds = me.superclass.getChecked.call(me),
		rtnCheckeds = new Array(),
		columns = me.fields;
		for(var i = 0 ; i<checkeds.length ; i++){
			if(checkeds[i].isLeaf()){
				var checked = checkeds[i].data;
				var data = {};
				for(var j = 0 ; j <columns.length ; j++){
					var column = columns[j];
					if(Ext.isString(column)){
						data[column] = checked[column];
					}
					else{
						data[column.name] = checked[column.name];
					}
				}
				rtnCheckeds.push(data);
			}
		}
		return rtnCheckeds;
	},
	reconfigData:function(datas){
		var me = this,
		groupFields = me.lastGroupIndex;//,
		//checked = me.getChecked();
		me.setRootNode(datas);
		var d = new Date();
		//me.expandAll();
		console.log((new Date() - d)+'----object');
		/*me.getRootNode().removeAll();
		me.combineChecked(checked, datas);
		if(Ext.isArray(groupFields) && groupFields.length>0){
			var children = DigiCompass.Web.Util.convert(groupFields, false , datas , false , me.treeColumn ,true);
			var root = {
						expanded: true,  
						children: children
					};
			me.setRootNode(root);
		}
		else{
			for(var i = 0 ; i<datas.length ; i++){
				datas[i].leaf = true;
				datas[i].checked = false;
			}
			var root = {
						expanded: true,  
						children: datas
					}; 
			me.setRootNode(root);
		}*/
	},
	combineChecked:function(checked, datas){
		if(Ext.isEmpty(checked)){
			return;			
		}
		for(var i = 0 ; i<datas.length ; i ++){
			datas[i].checked = false;
			for(var j = checked.length -1 ; j>=0 ; j--){
				var checkedFlag = true;
				for(var key in checked[j]){
					if(Ext.isEmpty(datas[i][key]) && Ext.isEmpty(checked[j][key])){
						continue;
					}
					if(datas[i][key]!=checked[j][key]){
						checkedFlag = false;
						break;
					}
				}
				if(checkedFlag){
					datas[i].checked = true;
					checked.splice(j, 1);
				}
			}
		}
	},
	searchFn:function(name){
		if(Ext.isFunction(this.onSearch)){
			if(this.onSearch.call(this, name)===false){
				return;
			}
		}
		var me = this,
			param = {};
		for(var key in me.otherParam){
			param[key] = me.otherParam[key];
		}
		param.MODULE_TYPE = me.module;
		param.COMMAND = me.command;
		param.queryParam = name;
		param.treeNode = me.treeColumn;
		param.checked = me.getChecked();
		param.groupFields = me.getGroupField();
		cometdfn.publish(param);
	},
	setParameter:function(param){
		var me = this;
		me.module = param.module;
		me.command = param.command;
		me.otherParam = param.otherParam;
	}, 
	checkchild:function (node,checked){  
		var me = this;
        node.eachChild(function(child) {
			if(child.childNodes.length>0){
				me.checkchild(child,checked);//递归  
		    }  
		    child.data.checked = checked;
		    child.commit();
		});
    },
	checkparent: function(node){
		var me = this;
		if(!node){
			return false;
		}
		var parentNode = node.parentNode;  
		if(parentNode !== null) {
			var isall=true;  
		  	parentNode.eachChild(function(n){  
				if(!n.data.checked){
					isall=false;  
				}
			});
		  	parentNode.data.checked = isall;
		  	parentNode.commit();
		}
		me.checkparent(parentNode);//递归  
	},
	reconfigure:function(data,columns){
		var me = this,
		headerCt = me.headerCt,
		groupFields = me.groupedField;
		headerCt.removeAll();
		for(var i = 0 ; i<columns.length ; i++){
			if(i == 0){
				columns[0].xtype = "treecolumn";
				var id = me.getId();
				if(columns[0].text){
					columns[0].text = '<input type="checkbox" id='+checkedAllId+'  onclick="DigiCompass.Web.TreeUtil.checkedAllFunc(event,this,\''+id+'\')">&nbsp;'+ columns[0].text;
				}
				if(columns[0].header){
					columns[0].header = '<input type="checkbox" id='+checkedAllId+'  onclick="DigiCompass.Web.TreeUtil.checkedAllFunc(event,this,\''+id+'\')">&nbsp;'+ columns[0].header;
				}
				me.treeColumn = columns[0].dataIndex;
			}
			headerCt.insert(columns[i]);
		}
		me.reconfigData(data);
	}
});