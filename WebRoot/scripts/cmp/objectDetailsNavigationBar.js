(function() {
	var navigationBar = Ext.namespace('DigiCompass.Web.app.navigationBar');
	
//	Ext.define('DigiCompass.Web.app.navigationBar.Item',{
//		extend : 'Object' ,
//		constructor: function(id,type,path) {
//			
//			this.id = id || null;
//			this.type = type || null;
//			this.path = path || null;
//
//			this.parent = parent;
//			this.children = [];
//		}
//	});

//	[{objId:'',type:'',path:[{uuid:'',type:'',swapPanel:''}]}]
	
	var _navigationBarArray = new Array();
	
	/**
	 * args:{objId:'1',type:'scenario',uuid:'1',swapPanel:'xxxId'}
	 */
	
	navigationBar.setNavigationBar = function(args){
		if(!args || !args.objId){
			throw new Error('erro navigationbar args!');
		}
		var naviBar = navigationBar.getNavigationBarById(args.objId);
//		console.log(naviBar);
//		console.log(args);
		if(naviBar){
			naviBar.type = args.type;
			
			var pathArr = naviBar.path;
			var pathItem = {};
			pathItem.uuid = args.uuid;
			pathItem.swapPanel = args.swapPanel;
			pathItem.type = args.type;
			pathItem.parentId = args.parentId;
			pathItem.itemIndex = args.itemIndex;
			pathItem.eventBtnId = args.eventBtnId;
//			pathItem.oldWidth = args.oldWidth;
//			pathItem.oldHeight = args.oldHeight;
			
			pathArr.push(pathItem);
		}else{
			var newNaviBar = {};
			newNaviBar.objId = args.objId;
			newNaviBar.type = args.type;
			
			var newPath = new Array();
			var pathItem = {};
			pathItem.uuid = args.uuid;
			pathItem.swapPanel = args.swapPanel;
			pathItem.type = args.type;
			pathItem.parentId = args.parentId;
			pathItem.itemIndex = args.itemIndex;
			pathItem.eventBtnId = args.eventBtnId;
//			pathItem.oldWidth = args.oldWidth;
//			pathItem.oldHeight = args.oldHeight;
			
			newPath.push(pathItem);
			
			newNaviBar.path = newPath;
			_navigationBarArray.push(newNaviBar);
		}
	}
	
	navigationBar.resetNavigationBarTitle = function(objId,type){
		var naviBar = navigationBar.getNavigationBarById(objId);
//		console.log(naviBar);
//		console.log(type);
		if(naviBar){
			var naviPath = naviBar.path;
			if(naviPath && naviPath.length > 0){
				var item = naviPath[naviPath.length - 1];
				item.type = type;
				naviBar.type = type;
			}
		}
	}
	
	
	navigationBar.getNavigationBarArray = function(){
		return _navigationBarArray;
	}
	
	navigationBar.getNavigationBarById = function(objId){
		for(var i=0,len=_navigationBarArray.length;i<len;i++){
			var naviBar = _navigationBarArray[i];
			if(naviBar.objId === objId){
				return naviBar;
			}
		}
		return null;
	}
	
	navigationBar.removeNavigationBarById = function(objId){
		var naviBar = navigationBar.getNavigationBarById(objId);
		if(naviBar){
			naviBar.type = '';
			naviBar.path = new Array();
		}
	}
	
	
	navigationBar.navigationBarClickEvent = function(objId,naviBarName){
		if(!objId || !naviBarName){
			throw new Erro('error objId or naviBarName!');
		}
		var naviBar = navigationBar.getNavigationBarById(objId);
		if(naviBar){
			var naviPath = naviBar.path;
			var naviPathItem = navigationBar.getNavigationBarPathItem(naviPath,naviBarName);
			if(naviPathItem){
				//此处切换致对应的Panel
				//Ext.getCmp('xxx').add(Ext.getCmp(swapPanel));
				var t1 = new Date().getTime();
				
		    	var mainTab = Ext.getCmp('outerTabPanelId'+objId);
		    	if(mainTab){
		    		mainTab.obj = null;
		    		mainTab.removeAll(false);
		    		var oldReversePanel = Ext.getCmp(naviPathItem.swapPanel);
		    		if(oldReversePanel){
		    			mainTab.suspendEvents();
		    			mainTab.add(oldReversePanel);
		    		}
		    	}
		    	var t2 = new Date().getTime();
		    	console.log('add mainTab:'+(t2-t1));
		    	
		    	//Version return
				if(naviBarName !== naviBar.type){
					//Version Return
					DigiCompass.Web.UI.Scenario.groupPanelReturn();
				}
				var t3 = new Date().getTime();
		    	console.log('version return:'+(t3-t2));
				
				//移除path中值
				navigationBar.removeNavigationBarPathItem(objId,naviBarName);
				
				var t4 = new Date().getTime();
		    	console.log('remove bar:'+(t4-t3));
		    	
		    	mainTab.resumeEvents();
			}
		}
	}
	
	navigationBar.getNavigationBarPathItem = function(naviPath,naviBarName){
		if(!naviPath || !naviBarName){
			throw new Error('error navigation path or name!');
		}
		for(var i=0,len=naviPath.length;i<len;i++){
			var item = naviPath[i];
			if(item.type === naviBarName){
				return item;
			}
		}
		return null;
	}
	
	navigationBar.removeNavigationBarPathItem = function(objId,naviBarName){
		if(!objId || !naviBarName){
			throw new Error('error navigation request!');
		}
		var naviBar = navigationBar.getNavigationBarById(objId);
		if(naviBar){
			var naviPath = naviBar.path;
			for(var i=naviPath.length-1;i>=0;i--){
				var item = naviPath[i];
				if(item.type != naviBarName){
					naviBar.type = item.type;
					
					var parentComponent = Ext.getCmp(item.parentId);
					var oldReversalPanel = Ext.getCmp(item.swapPanel);
					if(parentComponent && oldReversalPanel){
						
						oldReversalPanel.normalModel();
						
//						oldReversalPanel.reSetSize(item.oldWidth,item.oldHeight);
						
						//隐蔽事件
						var eventBtn = Ext.getCmp(item.eventBtnId);
						if(eventBtn){
							eventBtn.setVisible(true);
							if(eventBtn.brothers){
			    				for(var key in eventBtn.brothers){
			    					eventBtn.brothers[key].show();
			    				}
			    			}
						}
						
						oldReversalPanel.suspendEvents();
						oldReversalPanel.reSetSize(parentComponent.getWidth()-50,300);
						oldReversalPanel.resumeEvents();
						
						parentComponent.suspendEvents();
						parentComponent.insert(item.itemIndex,oldReversalPanel);
						parentComponent.resumeEvents();
						
						
						
						//TODO ...
						var versionView = Ext.getCmp('versionView');
						cometdfn.publish({MODULE_TYPE : 'MOD_SCENARIO',COMMAND : 'COMMAND_QUERY_LIST', versionId :objId});
						if(versionView.isVisible()){
							Ext.getCmp('scenarioExplorer').hide();
							DigiCompass.Web.UI.CometdPublish.getVersionDataPublish('SCENARIO',{versionId : objId},true);
						}else{
							Ext.getCmp('scenarioExplorer').show();
							versionView.hide();
						}
					}
					
					naviPath.pop();
				}else{
					naviBar.type = item.type;
					break;
				}
			}
		}
	}
	
	
	navigationBar.SEPERATOR = ' > ';
	navigationBar.generateNavigationBarPath = function(objId){
		var str = '';
		var naviBar = navigationBar.getNavigationBarById(objId);
		if(!naviBar || !naviBar.path){
			return str;
		}
		var naviBarPath = naviBar.path;
		for(var i=0,len=naviBarPath.length;i<len;i++){
			var temp = naviBarPath[i];
			
			if(naviBar.type != temp.type){
				str += navigationBar.addLinkToNavigationBar(objId,temp.type);
			}else{
				str += temp.type;
			}
			
			if(i !== len - 1){
				str += navigationBar.SEPERATOR;
			}
		}
		return str;
	}
	
	
	
	navigationBar.addLinkToNavigationBar = function(id,type){
		return '<a id="'+(id+'_'+type)+'" href="#" onclick="return DigiCompass.Web.app.navigationBar.navigationBarClickEvent(\''+id+'\',\''+type+'\')">'+type+'</a>';
	}
	
	
	
	
	
	
	
	
//	var naviBar = Ext.namespace('DigiCompass.Web.app.navigationBar');
//	
//	var SEPERATOR = ' --> ';
//	var navigationBarArray = new Array();
//	
//	naviBar.setNavigationBarArray = function(args){
//		if(!args || !args.id){
//			throw new Error('erro navigationbar args!');
//		}
//		var obj = naviBar.getNavigationBarArrayById(args.id);
//		if(obj){
//			obj.push(args);
//		}else{
//			var newBar = new Array();
//			newBar.push(args);
//			navigationBarArray[args.id] = newBar;
//		}
//	}
//	
//	naviBar.getNavigationBarArray = function(){
//		return navigationBarArray;
//	}
//	
//	naviBar.getNavigationBarArrayById = function(id){
//		return navigationBarArray[id];
//	}
//	
//	naviBar.removeLastNavigationBarById = function(id){
//		var objArr = naviBar.getNavigationBarArrayById(id);
//		objArr.pop();
//	}
//	
//	
//	naviBar.generateNavigationBarStr = function(id){
//		var str = '';
//		var obj = naviBar.getNavigationBarArrayById(id);
//		if(!obj || !obj.length || obj.length < 1){
//			return str;
//		}
//		for(var i=0,len=obj.length;i<len;i++){
//			var temp = obj[i];
//			str += temp.name;
//			if(i !== len - 1){
//				str += SEPERATOR;
//			}
//		}
//		return str;
//	}
//	
//	
//	
//	
//	
//	
//	var titlePrefix = 'Object Detail---';
//	naviBar.setObjectDetail = function(title){
//		var tit = '<div align="center">' + titlePrefix;
//		if (title) {
//			tit += title;
//		}
//		tit += '</div>';
//		return tit;
//	}
//	
//	naviBar.getTitlePrefix = function(){
//		return titlePrefix;
//	}
//
//	var navigationBar = '';
//	var navigationBarSplit = ' / ';
//	naviBar.setNavigationBar = function(barName, isFirst, clickFn){
//		if (isFirst) {
//			navigationBar = '';
//		}
//		if (navigationBar.length > 0) {
//			navigationBar += navigationBarSplit;
//		}
//		// navigationBar += '<a href="javascript:void(0)" onclick="return
//		// navigationBarClick('+clickFn+')">'+barName+'</a>';
//		navigationBar += barName;
//		return navigationBar;
//	}
//	
//	naviBar.clearTheLastNavigation = function(){
//		var newBar = '';
//		var arr = navigationBar.split(navigationBarSplit);
//		if (arr.length > 0) {
//			for(var i=0,len=arr.length-1;i<len;i++){
//				newBar += arr[i];
//				if(i != len-1){
//					newBar += navigationBarSplit;
//				}
//			}
//			navigationBar = newBar;
//			return navigationBar;
//		}
//	}
//	
//
//	naviBar.changeTheLastNavigationBarName = function(barName) {
//		var arr = navigationBar.split(navigationBarSplit);
//		if (arr.length > 0) {
//			var temp = arr[arr.length - 1];
//			navigationBar = navigationBar.substring(0, navigationBar.length
//					- temp.length);
//			if (navigationBar.indexOf(navigationBarSplit) === -1) {
//				navigationBar += navigationBarSplit;
//			}
//			navigationBar += barName;
//			return navigationBar;
//		}
//		return '';
//	}
//
//	naviBar.getLastNavigationBarName = function() {
//		var arr = navigationBar.split(navigationBarSplit);
//		if (arr.length > 0) {
//			var temp = arr[arr.length - 1];
//			return navigationBar.substring(navigationBar.length - 1,
//					temp.length);
//		}
//		return '';
//	}
//
//
//	naviBar.navigationBarClick = function(fn, parameter) {
//		if (fn) {
//			console.log(fn);
//			fn(parameter);
//		}
//	}
})();