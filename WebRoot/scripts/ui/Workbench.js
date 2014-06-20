/// <reference path="/scripts/ext/ext-base-debug-w-comments.js"/>
/// <reference path="/scripts/ext/ext-all-debug-w-comments.js"/>

Ext.Loader.setConfig({enabled: true}); 
Ext.Loader.setPath('Ext.ux', '../../extjs4.1.1/ux'); 

Ext.namespace('DigiCompass.Web.UI');

Ext.require(['Ext.container.*' , 'Ext.data.*' , 'Ext.grid.*' , 'Ext.ux.form.*' , 'Ext.layout.container.*']);

Ext.define("DigiCompass.Web.UI.Workbench",{
	extend : 'Ext.container.Container',
	//注册
	alias : "widget.DigiCompass.Web.UI.Workbench",
	cls: 'ui-workbench',
	layout: 'border',
	//此处的高度设置不生效，当该容器加载完成后，会通过一个afterlayout事件，将该height修改为当前浏览器自适应大小，
	//此处必需设置height，否则border布局不生效.ext3中可以通过cls控制，此处不得行。
	height : 768,
	width : '100%',
//	style: {borderColor:'#fffff', borderStyle:'solid', borderWidth:'1px'},
	
//	height : '100%',

	//初始化组建
	initComponent: function() {
		
		var store = Ext.create('Ext.data.Store', {
				remoteFilter : false ,
			    storeId : 'obj_exp_store',
                fields : [ 'name', 'region', 'income', 'population', 'lifeExpectancy'],
                data : nations,
                proxy : {
                        type : 'memory',
                        reader : {
                                type : 'json',
                                root : 'rows'
                        }
                }
                
        });
		
		//加载store
		store.proxy.extraParams= {start: 0, limit: 20, query: ''}  
		store.load(); 
		
		var searchField = Ext.create('Ext.ux.form.BtnSearchField',{
			id:'objExtBtnSearchFieldId',
			width:'80%',
			onTrigger2Click : function(){
				this.showCancelBtn();
				console.log('click');
				var me = this,
	            	value = me.getValue();
				handlerSearch(value);
			},
			onTrigger1Click : function(){
				this.hideCancelBtn();
				console.log('cancel');
				handlerSearch('');
				
			}
		});
		
		function handlerSearch(value){
			var items = Ext.getCmp('obj-exp').items.items;
			if(items && items.length > 0){
				var id = items[0].id;
				if(!id){
					return;
				}
				if(id === 'scenarioViewId'){
					DigiCompass.Web.UI.CometdPublish.scenarioPublish(value);
				}else if(id === 'planningCycleListView'){
					DigiCompass.Web.UI.CometdPublish.planningCyclePublish(value);
				}else if(id === 'siteGroupListView'){
					DigiCompass.Web.UI.CometdPublish.siteGroupPublish(value);
				}else if(id === 'plannedSiteGroupListView'){
					DigiCompass.Web.UI.CometdPublish.plannedSiteGroupPublish(value);
				}else if(id === 'objExpPanel_snapshotVersionID'){
					DigiCompass.Web.UI.CometdPublish.SnapshotVersioinPublish(value);
				}else if(id === 'objExpPanel_spectrumRegionID'){
					DigiCompass.Web.UI.CometdPublish.spectrumRegionPublish(value);
				}
			}
		}
		
		
		
		
		
		var searchCatalogueField = Ext.create('Ext.ux.form.SearchField',{
			store: store,
			width:'80%'
		});
		
		
//		var listView = Ext.create('Ext.grid.Panel', {
//			loadMask: true,
//		    store: store,
//		    multiSelect: true,
//		    emptyText: 'No item to display',
//		    
//		    reserveScrollOffset: true,
//		    
//		    columns: [
//		        { header: 'Nation',  dataIndex: 'name' },
//		        { header: 'Region', dataIndex: 'region'}
//		    ]
//		   
//		});

		

//	//给listView添加selectionchange事件
//    listView.on('selectionchange', function(view, nodes){
//    	//参数:view = 当前对象，nodes = 选中节点总数
//    	//将Store中的数据，加载到自己定义的List中
//    	var list = Ext.create('DigiCompass.Model.List',nations.rows);
//    	
//    	DigiCompass.Web.UI.Wheel.setNavList(list);
//    	//获取选中的记录
//    	var s = view.getSelection();
//    	var data = [];
//    	var a =  0;
//    	Ext.each(s, function(v) {
//    		list.selectObjectByIndex(v.index);
//    		data.push(nations.rows[v.index]);
//    	});
//    	if(s.length > 0) {
//    		list.setCursor(s[s.length - 1]);
//    	}
//    	//绘制右边的fisheye
//    	DigiCompass.Web.UI.Wheel.showReport(data);
//    });
		
		/*var obj_details_tbar = Ext.create('Ext.toolbar.Toolbar', {
		    id: 'obj_details_tbar',
		    hidden: true,
		    items: []
		});
		
		var objDetailsPanel = Ext.create('Ext.panel.Panel', {
			id: 'obj-details',
			xtype: 'panel',
			title: '<div align="center">Object Detail</div>',
			frame: true,
			border: true,
			hide: true,
			width: '100%',
//			bodyStyle: 'background:white;',
			bodyStyle: 'background:transparent;',
			tbar:obj_details_tbar,
			listeners:{
				afterrender : function(){
					Ext.getCmp('obj-details').header.addCls('pointer');
//					Ext.getCmp('main_ReversalPanel_Id').setNavigation('testestestestesest12346');
					Ext.getCmp('main_ReversalPanel_Id').setTitle('<div align="center">Object Detail</div>');
				}
			}
		});
		
		objDetailsPanel.navigation = obj_details_tbar;
		
		var reversePanel = new DigiCompass.Web.app.ReversalPanel({
		    id : 'main_ReversalPanel_Id',
			height: 760,
			front : objDetailsPanel,
			back : new DigiCompass.Web.app.VersionForm()
		});*/
		
		var expTbar =  Ext.create('Ext.toolbar.Toolbar',{
			id:'expTbar',
			items:['Search: ', ' ', searchField]
		})
					
		this.items = [
			{
				id : 'obj-details',
				xtype: 'panel',
//				title: '<div align="center">Object Detail</div>',
				frame: false,
				margin: '0 0 0 5',
				border: false,
				bodyStyle: 'background:transparent; padding-right:15px;',
				//bodyStyle: 'background:yellow',
				//style: {borderColor:'green', borderStyle:'solid', borderWidth:'1px'},
				region: 'center',
				layout:'fit',
				hidden: false
//				tbar:obj_details_tbar,
//				items:[reversePanel]
			}
			,
			{
				id: 'obj-cat',
				xtype: 'panel',
				frame: true,
				border: true,
				bodyStyle: 'background:transparent;',
				region: 'west',
				title:'Catalogue',
				layout:'border',
				width: 250,
				minWidth:100,
				layout:'fit',
//				maxWidth:400,
				hidden:true,
				split:true,
				autoScroll:false,
				collapsible : true/*,
				tbar: [
						'Search: ', ' ', searchCatalogueField
					]*/
			}
			,
			{
				id: 'obj-exp',
				xtype: 'panel',
				frame: true,
				border: true,
				bodyStyle: 'background:transparent;',
				//style: {borderColor:'yellow', borderStyle:'solid', borderWidth:'1px'},
				region: 'west',
				title:'Object Explorer',
				width: 270,
//				split:true,
				minWidth:150,
				layout:'fit',
				resizable:true,
				maxWidth:500,
				hidden:false,
				autoScroll:false,
				collapsible : true//,
//				//items : listView,
				//tbar:expTbar
			}
			
			
		];
		
		//给当前对象动态指派initComponent方法
		DigiCompass.Web.UI.Workbench.superclass.initComponent.call(this);
	}
	
});

