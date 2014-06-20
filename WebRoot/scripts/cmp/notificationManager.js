(function() {

	var namespace = Ext.namespace('DigiCompass.Web.app.notificationManager');
	
	// technology getList method
	namespace.show = function() {
		var objectExplorer = Ext.create('DigiCompass.Web.app.grid.ObjectExplorer',{
			id:'notificationManagerExplorer',
			store: {
	            buffered: true,
	            autoLoad:true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'NotificationModule',
	                modules : {
	                	read : {
	               		 	command :'notificationTypes' 
	               		}
	                }
	            }
	        },
	        listeners : {
	        	itemclick : function(grid , record , item , index,event,eOpts){
	    			cometdfn.request({
						MODULE_TYPE : "NotificationModule",
						COMMAND : 'COMMAND_QUERY_INFO',
						id : record.get('id')
					}, function(message){
						var formPanel = namespace.showDetail();
						var _info = Ext.JSON.decode(message.BUSINESS_DATA);
						formPanel.setTitle('Object Detail - Notification Manager ('+_info.name+')');
						formPanel.front.getForm().setValues(_info);
						formPanel.back.setValues({versionId : _info.id});
						if(!_info.operations){
							_info.operations = [];
						}
						_info.operations.push({period:null, operation:[]});
						Ext.getCmp('operationGrid').getStore().loadData(_info.operations);
					});
	        	}
	        }
		});
		var objExpPanel = Ext.getCmp("obj-exp");
		if (objExpPanel) {
			// 移除组建
			objExpPanel.removeAll();
		}
		objExpPanel.add(objectExplorer);
		
	};
	namespace.actions = [{"key":"SEND-EMAIL", "name":"Send Email"},
	                     {"key":"SEND-SMS", "name":"Send SMS"},
	                     {"key":"SEND_MANAGER", "name":"Send To Manager"}];
	namespace.showDetail = function(){
		
		DigiCompass.Web.UI.Wheel.showDetail();
		var formPanel = Ext.getCmp('notificationManagerDetailID');
		if (formPanel) {
			namespace.cleanDetailData();
			formPanel.show();
		}else{
			formPanel = Ext.create('Ext.form.Panel', {
				id : 'notificationManagerDetailID',
				defaultType : 'textfield',
				border : false,
				width : '100%',
				frame : false,
				fieldDefaults : {
					labelAlign : 'left',
					msgTarget : 'side',
					labelWidth : 100
				},
				items : [{
							xtype : "hidden",
							name : "id"
						},{
							xtype : "hidden",
							name : "key"
						},{
							margin : '10 0 0 10',
							columnWidth : .7,
							allowBlank : false,
							emptyText : "Please input type name!",
							fieldLabel : 'Notification Type',
							maxLength:30,
							msgTarget : 'side',
							readOnly : true,
							name : 'name'
						},{
							margin : '10 0 0 10',
							columnWidth : .7,
							allowBlank : true,
							fieldLabel : 'Description',
							maxLength:30,
							msgTarget : 'side',
							name : 'description'
						},  {
							id : 'operationGrid',
							selType : 'cellmodel',
							xtype : 'gridpanel',
							height : 563,
							store : Ext.create('Ext.data.ArrayStore', {
								data : [{period:null,operation:[]}],
								fields : ['period', 'operation']
							}),
							plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit : 1
							})],
							margin : '20 5 10 5',
							title : 'Operations',
							columns : [{
								width : 200,
								text : 'Period(days)',
								dataIndex : 'period',
								editor : {
									xtype:'numberfield',
									allowBlank : false
								}
							}, {
								width : 200,
								text : 'Operation',
								sortable : true,
								dataIndex : 'operation',
								renderer : function(val){
									var value = Ext.clone(val);
									for(var i in val){
										for(var j in namespace.actions){
											if(val[i] === namespace.actions[j].key){
												value[i] = namespace.actions[j].name;
											}
										}
									}
									return value.join(',');
								},
								editor : {
									xtype:'boxselect',
									displayField:'name',
									valueField : 'key',
									store:{
										fields: ['key', 'name'],
									    data : namespace.actions,
									},
									allowBlank : false,
									maxLength:30
								}
	
							}],
							tbar : [{
								text : 'remove',
								handler : function() {
									var grid = Ext.getCmp('operationGrid');
									var selection = grid.getSelectionModel().getSelection();
									if(selection.length>0){
										for(var i in selection){
											if(!Ext.isEmpty(selection[i].data.period) || !selection[i].data.operation.length>0){
												grid.store.remove(selection[i]);
											}
										}
									}
								}
							}], listeners : {
								itemClick : function(a,b,m,rindex){
									var store = this.getStore();
									if(rindex+1 === store.getCount()){
										store.add({period:null, operation:[]});
									}
								}
							}
						}]
			});
			
			
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
				front : formPanel,
				back : new DigiCompass.Web.app.VersionForm({edit : false})
			});
			reversalPanel.addToolBar('notificationManager', new Ext.toolbar.Toolbar({
				items : [{
					columnWidth : .3,
					xtype : 'button',
					text : 'Save',
					iconCls:'icon-save',
					handler : function() {
						if (formPanel.getForm().isValid()) {
							var _btn = this;
							var data = formPanel.getForm().getValues();
							var operations = DigiCompass.Web.app.sitegroup.getStoreData(Ext.getCmp('operationGrid'));
							var opers = [];
							for(var i=0; i<operations.length; i++){
								if(!Ext.isEmpty(operations[i].period) && operations[i].operation.length>0){
									opers.push(operations[i]);
								}
							}
							data.operations = opers;
							cometdfn.request({
									MODULE_TYPE : "NotificationModule",
									COMMAND : 'COMMAND_SAVE',
									data : Ext.JSON.encode(data)
								},function(message){
									_btn.enable();
									if (DigiCompass.Web.app.checkResult(formPanel, message)) {
										namespace.cleanDetailData();
										reversalPanel.hide();
									}
							});
							_btn.disable();
						}
					}
				}]
			}));
			Ext.getCmp('obj-details').add(reversalPanel);
		}
		formPanel.reversalPanel.show();
		return formPanel.reversalPanel;
	}
	
	namespace.cleanDetailData = function(){
		if(Ext.getCmp('notificationManagerDetailID')){
			Ext.getCmp('notificationManagerDetailID').getForm().reset();
		}
	}
})();