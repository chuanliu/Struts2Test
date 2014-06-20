Ext.define('DigiCompass.Web.app.ui.CommonReport', {
	objectExplorer : null,
	objectDetail : null,
	config : {
		title : null,
		getTitle : null,
		/**
		 * explorerModuleCfg:
		 * 		moduleType	require
		 * 		command		require
		 * 		param 		option
		 */
		explorerModuleCfg : null,
		/**
		 * explorerModuleCfg:
		 * 		moduleType	require
		 * 		command		require
		 * 		param 		option
		 * 		getParam()	option
		 */
		detailModuleCfg : null
	},
	constructor : function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		if(!Ext.isFunction(this.getTitle)){
			this.getTitle = function(){
				return this.title;
			}
		}
		this.init();
		this.showObjectExplorer();
	},
	init : function(){
		var me = this;
		me.objectExplorer = Ext.create('DigiCompass.Web.app.grid.ObjectExplorer',{
	        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
	            buffered: true,
	            proxy: {
	                type: 'cometd.flexview',
	                moduleType : me.explorerModuleCfg.moduleType,
	                modules : {
	                	read : {
	               		 	command : me.explorerModuleCfg.command 
	               		}
	                },
	                extraParams : me.explorerModuleCfg.param || {}
	            }
	        }),
	        listeners : {
	        	itemclick : function(grid , record , item , index,event,eOpts){
	        		console.log(grid.getSelectionModel().isCheckbox(event.target));
	        		if(!grid.getSelectionModel().isCheckbox(event.target) && event.target.type !== 'button'){
	        			me.showDetail(record);
	        		}
	        	}
	        }
		});
	},
	showObjectExplorer : function(){
		var me = this;
		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			objExpPanel.removeAll();
			objExpPanel.add(me.objectExplorer);
			me.objectExplorer.target.loadStart();
		}
	},
	showDetail : function(record){
		var me = this, param;
		param = me.detailModuleCfg.param || {};
		if(Ext.isFunction(me.detailModuleCfg.getParam)){
			param = Ext.apply(param, me.detailModuleCfg.getParam(me.objectExplorer, record)||{});
		}else{
			param = Ext.apply(param, {id : me.objectExplorer.target.getSelectionModel().getPkString(record)});;
		}
		if(me.objectDetail){
			me.objectDetail.target.clearSearch();
			me.objectDetail.reload(param,{moduleType:me.detailModuleCfg.moduleType, command : me.detailModuleCfg.command }, true);
		}else{
			me.objectDetail = Ext.create('DigiCompass.Web.app.grid.FlexView',{
				useSearch : true,
				title : me.getTitle(record),
		        columns: [],
		        features: [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping',{
		    		baseWidth:50,
		            groupHeaderTpl: '{disName}'
		          })],
		        store: Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
		            buffered: true,
		            proxy: {
		                type: 'cometd.flexview',
		                moduleType : me.detailModuleCfg.moduleType,
		                modules : {
		                	read : {
		               		 	command : me.detailModuleCfg.command 
		               		}
		                },
		                extraParams : param
		            }
		        })
			});
			DigiCompass.Web.UI.Wheel.showDetail();
			Ext.getCmp('obj-details').add(me.objectDetail);
			me.objectDetail.target.loadStart();
		}
	},
	destory : function(){
		me.objectExplorer.remove(true);
		me.objectDetail.remove(true);
		me.objectExplorer = null;
		me.objectDetail = null;
	}
});
