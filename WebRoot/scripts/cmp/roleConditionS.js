(function(){
	Ext.namespace("DigiCompass.Web.app.roleConditionS");
	
	DigiCompass.Web.app.roleConditionS = function(_callback, sites, services){
//static vars
		var	winWidth = 600,
			winHeight = 400,
			_margins_ = {h : 88, w : 15},
			_noLimit_ = "no limit",
			callback = _callback || null;
		
//dynamic vars
		var siteField = [];
		var siteFieldSort = [];
		var siteData = [];
		var siteGrid = null;
		var siteGridRowId = 1;
		
		var serviceData = [];
		var serviceTree = null;
		
		var resizeConfigFlag = 0;
		var isComboFocus = false;
		var conditionWin = null;
	
//init
		_init();
		function _init(){
			if(sites){
				if(window.parent.roleCondition_site_Types){
					_initSiteField(window.parent.roleCondition_site_Types.types);
					_init_();
				}else{
					var message = {};
					message.MODULE_TYPE = 'ROLE_DEFINITION_MODULE';
					message.COMMAND = 'COMMAND_QUERY_SITE_CONDITION_TYPE';
					cometdfn.request(message, function(message, conf) {
						var data = message['BUSINESS_DATA'] || {};
						if (message.STATUS === 'success') {
							window.parent.roleCondition_site_Types = {types : Ext.clone(data)};
							_initSiteField(data);
							_init_();
						} else {
							Notification.showNotification("Get sites condition failed!");
						}
					});
				}
			}else{
				_init_();
			}
		}
		function _init_(){
			initData();
			if(Ext.getCmp("_roleConditionSWinId")) Ext.getCmp("_roleConditionSTabPanelId").removeAll();
			conditionWin = initWin();
			conditionWin.show();
		}
		function _initSiteField(d){
			if(d.typeSort && d.typeSort.length){
				siteFieldSort = [];
				for(var o=0; o<d.typeSort.length; o++){
					siteFieldSort.push(d.typeSort[o].key);
				}
				siteField = [];
				for(var i=0; i<siteFieldSort.length; i++){
					if(d[siteFieldSort[i]]){
						var s = d[siteFieldSort[i]];
						if(s && s.length){
							siteField[i] = {key: d.typeSort[i].key, name: d.typeSort[i].name, sel: [{val: '', name: _noLimit_}]};
							for(var ss=0; ss<s.length; ss++){
								if(s[ss].id && s[ss].name){
									siteField[i].sel.push({val: s[ss].name, name: s[ss].name})
								}
							}
						}
					}
				}
			}
		}
		
//some function
		function initWin(){
			return Ext.create("Ext.Window", {
				id: "_roleConditionSWinId",
				title : 'Condition Builder',
				width: winWidth,
				height: winHeight,
				minWidth : 300,
				minHeight : 200,
				modal : true,
				bodyStyle : {
		        	background : 'white'
		        },
				resizable: true,
				shadow: true,
				y : window.innerHeight ? (window.innerHeight > winHeight ? (window.innerHeight - winHeight) / 3 : 0) : "",
				listeners : {
					'beforeclose' : function(){
						
					}
					,'render': function(){
						
					}
					,'beforeshow' : function(){
						
					}
					,'resize' : function(obj, width, height){
						var f = ++resizeConfigFlag;
						setTimeout(function(){
							if(f == resizeConfigFlag){
								winWidth = conditionWin.getWidth();
								winHeight = conditionWin.getHeight();
								if(siteGrid){
									siteGrid.setWidth(winWidth - _margins_.w);
									siteGrid.setHeight(winHeight - _margins_.h);
								}
								if(serviceTree){
									serviceTree.setHeight(winHeight - _margins_.h);
								}
							}
						}, 100)
					}
				},
				items : [initToolBar(), Ext.create('Ext.tab.Panel', {
					id : "_roleConditionSTabPanelId",
					border: false,
					activeTab : 0,
					collapsible : false,
					items : initTabItems()
				})]
			})
		}
		function initTabItems(){
			var tabItems = [];
			if(sites) tabItems.push({title: 'Site Condition', items: initSiteGrid()})
			if(services) tabItems.push({id: '_roleConditionServiceTabPanelId', title: 'Service Condition', items: initServiceTree()})
			return tabItems;
		}
		
		function initData(){
			if(sites) siteData = _initSiteData(sites.condition)
			if(services) serviceData = _initServiceData(services.condition);
		}
		function _initSiteData(s){
			var d = [];
			var tmp = s.split(" or ").join(" OR ").split(" OR ");
			if(tmp.length){
				for(var a in tmp){
					var tmpA = tmp[a].split(" and ").join(" AND ").split(" AND ")
					var _da = {};
					var tmpFlag = false;
					for(var b in tmpA){
						var tmpB = tmpA[b].split("=");
						if(tmpB.length == 2){
							_da[removeSpecial(tmpB[0])] = removeSpecial(tmpB[1])
							tmpFlag = true;
						}
					}
					if(tmpFlag){
						var tmpID = siteGridRowId++;
						_da.gridRowId = "gridRowId_" + tmpID;
						d.push(_da);
					}
				}
			}
			return d;
		}
		function _initServiceData(s){
			var d= [];
			var tmp = s.split(" or ").join(" OR ").split(" OR ");
			if(tmp.length){
				for(var a in tmp){
					var tmpA = tmp[a].split("=");
					if(tmpA.length == 2){
						d.push(removeSpecial(tmpA[1]))
					}
				}
			}
			return d;
		}
		
		function initSiteGrid(){
			var cols = [];
			var _siteField_ = [{name: 'gridRowId'}, {name: 'isEmptyRow'}];
			for(var u in siteField){
				_siteField_.push({name : siteField[u].key})
				//combox
				cols.push({header: siteField[u].name, dataIndex: siteField[u].key, align: 'center', flex : 3
					,editor : {
						xtype : 'combo',
						allowBlank 	 : false,
						editable     : false,
						displayField : 'name',
						valueField	 : 'val',
						store : {
							fields : ['val','name'],
							data   : siteField[u].sel
						},
						listeners  : {
							change : function(combo, newValue, oldValue){
								var se = siteGrid.getSelectionModel().lastSelected;
								var st = siteGrid.getStore();
								if(!oldValue && newValue && se && se.data && se.data.isEmptyRow){
									addNewEmptyRow(st);
									se.data.isEmptyRow = false;
								}
							}
							,blur : function(com){
								isComboFocus = false;
								setTimeout(function(){
									if(!isComboFocus){
										var st = siteGrid.getStore();
										removeAllEmptyRow(st);
										addNewEmptyRow(st);
									}
								},170)
							}
							,focus : function(){
								isComboFocus = true;
							}
						}
					}
        			,sortable : true, renderer : function(v, record){
        				return v;
        			}})
        			continue;
        			//input
    				cols.push({header: siteField[u].name, dataIndex: siteField[u].key, align: 'center', flex : 3
    					,editor : {
    						allowBlank : true
    						,listeners : {
    							change : function(combo, newValue, oldValue){
    								var se = siteGrid.getSelectionModel().lastSelected;
    								var st = siteGrid.getStore();
    								if(!oldValue && newValue && se && se.data && se.data.isEmptyRow){
    									addNewEmptyRow(st);
    									se.data.isEmptyRow = false;
    								}
    							}
    							,blur : function(com){
    								isComboFocus = false;
    								setTimeout(function(){
    									if(!isComboFocus){
    										var st = siteGrid.getStore();
    										removeAllEmptyRow(st);
    										addNewEmptyRow(st);
    									}
    								},170)
    							}
    							,focus : function(){
    								isComboFocus = true;
    							}
    						}
    					}
    					,sortable : true
    				})
			}
			cols.push({tooltip: 'delete', align: 'center', flex : 1, renderer: function(v, re, record){
				return "<img title='delete' src='../../styles/cmp/images/delete.png' onclick='DigiCompass.Web.app.roleConditionS.siteRowDelClick(\"" 
							+ record.data.gridRowId + "\")' />";
			}})
			Ext.regModel('roleConditionSiteGridModelFields', {
				fields: _siteField_
			})
			var store = new Ext.data.JsonStore({
				model : 'roleConditionSiteGridModelFields',
				data: {griddata: siteData},
				proxy: {
					type: 'memory',
					reader: {
						type: 'json',
						root: 'griddata'
					}
				}
	        });
			siteGrid = Ext.create("Ext.grid.Panel", {
				id : "roleConditionSiteGridId",
				border: false,
				height: winHeight - _margins_.h,
				width : winWidth - _margins_.w,
				autoScroll: true,
		        store: store,
		        selType : 'rowmodel',
		        padding : 0,
		        margin : 0,
		        bodyStyle: "background:white",
				plugins : [Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit : 1 })],
		        columns: cols,
			    listeners:{
					'viewready':{
						fn : function(grid) {
							var st = siteGrid.getStore();
							removeAllEmptyRow(st);
							addNewEmptyRow(st);
						},
						scope : this
					}
			    	,'render' : function(){
						
					}
					,'itemclick' : function(view, record, item, index){
						
					}
					,'containerclick' : function(){
						
					}
					,'edit' : function(editor, e){
						
			        }
					,'selectionchange' : function(view, selections){
						
					}
					,'beforeedit' : function(editor, e, eOpts){
						
					}
				}
			})
			return siteGrid;
		}
		function updateSiteGrid(){
			var st = siteGrid.getStore();
			if(st){
				st.loadData(siteData);
				addNewEmptyRow(st);
			}
		}
		
		function initServiceTree(){
			var tmp = {};
			for(var a=0; a<serviceData.length; a++){
				if(serviceData[a]){
					tmp[serviceData[a]] = {id: serviceData[a], 'name' : '', 'level' : '', 'property' : '','typeId' : '','capex' : '','opex' : '','quantity' : ''}
				}
			}
			serviceTree = DigiCompass.Web.app.changeRequest.getServicePanel({serviceCatalogueHierarchyId : "", selectionService : tmp}, true);
			serviceTree.height = winHeight - _margins_.h;
			serviceTree.border = false;
			return serviceTree;
		}
		function updateServiceTree(){
			if(Ext.getCmp("_roleConditionServiceTabPanelId")){
				Ext.getCmp("_roleConditionServiceTabPanelId").removeAll();
				Ext.getCmp("_roleConditionServiceTabPanelId").add(initServiceTree());
			}
		}
		
		function initToolBar(){
			var toolBar = Ext.create('Ext.toolbar.Toolbar',{
				items:[{
					xtype : 'button',
					text : 'Finish',
					iconCls : 'icon-save',
					handler : function() {
						finishBtClick();
					}
				},{
					xtype : 'button',
					text : 'Reset All',
					icon : '../../styles/cmp/images/yq_reset.png',
					handler : function(){
						if(sites) updateSiteGrid();
						if(services) updateServiceTree();
					}
				},{
					xtype : "button",
					text : 'Clear Service',
					handler : function(){
						serviceData = [];
						if(services) updateServiceTree();
					}
				}]
			})
			return toolBar;
		}
		function finishBtClick(){
			if(isComboFocus){
				setTimeout(function(){
					finishBtClick();
				}, 500)
				return;
			}
			var str = "",
				str1 = "",
				str2 = "";
			if(sites){
				var s = siteGrid.getStore();
				if(s && s.data && s.data.items){
					s = s.data.items;
					if(s.length){
						str1 = [];
						for(var a=0; a<s.length; a++){
							var tmp = [];
							for(var b=0; b<siteField.length; b++){
								if(s[a].data[siteField[b].key]){
									tmp.push(siteField[b].key + "=" + "\"" + s[a].data[siteField[b].key] + "\"")
								}
							}
							if(tmp.length > 1){
								str1.push("(" + tmp.join(" AND ") + ")");
							}else if(tmp.length){
								str1.push(tmp[0]);
							}
						}
						if(str1.length > 1){
							str1 = str1.join(" OR ");
						}else if(str1.length){
							str1 = str1[0];
						}else{
							str1 = "";
						}
					}
				}
			}
			if(services){
				var tmpsd = serviceTree.getService();
				if(tmpsd){
					str2 = [];
					for(var h in tmpsd){
						str2.push("changes.serviceOperation.serviceCatalogue.id=\"" + h + "\"");
					}
					if(str2.length > 1){
						str2 = str2.join(" OR ");
					}else if(str2.length){
						str2 = str2[0];
					}else{
						str2 = "";
					}
				}
			}
			if(str1){
				if(str2){
					str = "(" + str1 + ") AND (" + str2 + ")";
				}else{
					str = str1;
				}
			}else if(str2){
				str = str2;
			}
			if(callback){
				callback(str)
			}
			conditionWin.close();
		}
		
		//remove "" () ' ';
		function removeSpecial(s){
			return s.replace(/([\\\(\)\s""])/ig, "");
		}
		function addNewEmptyRow(st){
			var tmpID = siteGridRowId++;
			var n = {isEmptyRow : true, gridRowId: "gridRowId_" + tmpID}
			st.add(n);
		}
		function removeAllEmptyRow(st){
			var s = st.data.items;
			var needToRemove = [];
			for(var a=0; a<s.length; a++){
				var tmpFlag = true;
				for(var b=0; b<siteField.length; b++){
					if(s[a].data[siteField[b].key]){
						tmpFlag = false;
						break;
					}
				}
				if(tmpFlag){
					needToRemove.push(a);
				}
			}
			if(needToRemove.length){
				for(var i=0; i<needToRemove.length; i++){
					st.removeAt(needToRemove[i] - i);
				}
			}
		}
		return conditionWin;
	}
	
	DigiCompass.Web.app.roleConditionS.siteRowDelClick = function(gridRowId){
		var s = Ext.getCmp("roleConditionSiteGridId").getStore();
		if(s && s.data && s.data.items){
			var sto = s.data.items;
			if(sto.length){
				for(var a=0; a<sto.length; a++){
					if(sto[a].data.gridRowId == gridRowId && !sto[a].data.isEmptyRow){
						return s.removeAt(a);
					}
				}
			}
		}
	}
	
})()