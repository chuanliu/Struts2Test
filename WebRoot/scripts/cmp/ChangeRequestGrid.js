Ext.define('DigiCompass.Web.app.planning.grid.ChangeRequestGrid', {
	extend: 'DigiCompass.Web.app.grid.MutiGroupGrid',
	margin  : '5px',
	config : {
		moduleType : 'MOD_CHANGE_REQUEST',
		moduleCommand : null,
    	status : null,
    	changeRequestId : null,
    	notification : false
    },
    collapsible : true,
    useSearch : true,
    columns: [],
    onGroupSumRender : function(val){
    	var path = 'changes.serviceOperation', qty;
    	if(!val.data['changes.serviceOperation.quantity']){
    		path = 'changes.serviceOperation.serviceAcceptOperation';
    	}
    	qty = val.data[path+'.quantity'];
    	return 'count='+val.data.groupcount+(Ext.isNumber(qty) ? ', quantity='+ qty : '') +', capex='+(val.data[path+'.capex'] || 0)+', opex='+(val.data[path+'.opex']||0);
    },
    constructor : function(config) {
    	var me = this;
    	me.changeRequestId = config.changeRequestId;
    	me.notification = config.notification;
    	config.useSearch = true;
    	config.autoScroll = true;
    	config.multiSelect = true;
    	if(!config.features){
//    		config.features = [Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping',{
//	    		baseWidth:50,
//	    	    groupHeaderTpl: '{disName}'
//	    	})];
    	}
    	var module = me.getModule(config.status);
    	me.moduleCommand = module.command;
    	me.moduleType = module.type;
    	me.status = config.status;
    	if(!config.store){
    		/*config.store = Ext.create('DigiCompass.Web.app.data.FlexViewArrayStore', {
    			pageSize : 200,
    	        buffered: true,
    	        proxy: {
    	            type: 'cometd.flexview',
    	            moduleType : me.moduleType,
    	            modules : {
    	            	read : {
    	           		 	command : me.moduleCommand
    	           		}
    	            },
    	            extraParams : {
    	            	first : true
    	            },
    	            afterRequest : me.responseHandler
    	        }
    	    });*/
    		config.store =  {
    			pageSize : 200,
    	        buffered: true,
    	        autoLoad : false,
    	        proxy: {
    	            type: 'cometd.mutigroup',
    	            moduleType : me.moduleType,
    	            modules : {
    	            	read : {
    	           		 	command : me.moduleCommand
    	           		}
    	            },
    	            extraParams : {
    	            	first : true,
    	            	notification : me.notification,
    	            	status : me.status
    	            },
    	            afterRequest : me.responseHandler
    	        }
    	    };
    	}
    	console.log(config);
		config.autoCheckBox = !Ext.isEmpty(config.status);
//    		config.selModel = Ext.create('DigiCompass.Web.app.FlexViewCheckboxModel');
    	config.tbar = [];
    	config.listeners = {};
    	var statusKey = 'changes.serviceOperation.status';
    	var sowStuffPath = "changes.serviceOperation.sowStuff",
    		changeRequipment = false,
    		changeApproveComment = false,
    		changeReleaseComment = false;
    	
    	if(config.status === 'STATUS_CHANGEREQUEST'){
    		changeApproveComment = true;
    		config.tbar.push({
        		xtype : 'button',
        		text  : 'Approve',
        		handler : me.approveHander(me, true)
        	},{
        		xtype : 'button',
        		text  : 'Deny',
        		handler : me.approveHander(me, false)
        	},{
				xtype : 'button',
				text : 'Committed Date',
				handler : function(){
					promptDateDialog('Committed Date','Please enter the Committed Date:', function(ok, date){
						if(ok === 'ok'){
							var sels = me.getSelectionStatus();
							cometdfn.request({
								MODULE_TYPE:'MOD_CHANGE_REQUEST_APPROVE',
								COMMAND:'SETTING_SERVICE_COMMITTED_DATE',
								selection : sels,
								committedDate:date,
								requestId : me.changeRequestId
							}, function(msg){
								if(msg.BUSINESS_DATA){
									me.reload();
								}
							});
						}
					},this, null, function(date){
						return !!Ext.Date.parseDate(date, 'Y-m-d');
					});
				}
			},{
				xtype : 'button',
				text : 'Comment',
				handler : function(){
					if(me.hasChecked()){
						promptTextAreaDialog('Comment', null, function(comment){
							cometdfn.request({
								COMMAND : 'SETTING_COMMENT',
								MODULE_TYPE : me.moduleType,
								crId : me.changeRequestId,
								selection : me.getSelectionStatus(),
								comment : comment
							}, function(message){
								var data = message.BUSINESS_DATA;
								if(data){
									me.getStore().each(function(rd){
										for(var i=0; i<data.length; i++){
											if(rd.get('changes.serviceOperation.id') === data[i]){
												rd.set('changes.serviceOperation.approveComment', comment);
											}
										}
									});
								}
							});
			    		}, false, null, false);
					}
				}
			});
    		config.plugins=[Ext.create('Ext.grid.plugin.CellEditing', {
 				clicksToEdit : 1,
 				autoCancel : false,
 				listeners : {
 					'beforeedit' : function(_self, obj){
 						return 'STATUS_CHANGEREQUEST' === obj.record.get('changes.serviceOperation.status');
					},'afteredit' : function(_self, obj){
						var record = obj.record,
						oldVal = obj.originalValue;
						var selModel = me.target.getSelectionModel();
						if(oldVal!==obj.value){
							if(this.reqIdx){
								cometdfn.removeListener(this.reqIdx);
							}
							var param = {};
							if(obj.value instanceof Date){
								param[obj.field] = Ext.Date.format(obj.value, 'Y-m-d');
							}else{
								param[obj.field] = obj.value+'';
							}
							this.reqIdx = cometdfn.request({
								MODULE_TYPE : 'MOD_CHANGE_REQUEST_APPROVE',
	                    		COMMAND : 'OVERRIDE_SERVICE_SETTING',
	                    		id : selModel.getPkString(record),
	                    		param : param
							}, function(message){
								console.log(obj)
								this.reqIdx = null;
								me.getStore().each(function(rd){
									if(rd.get('changes.serviceOperation.id') === record.get('changes.serviceOperation.id')){
										rd.set(obj.field, obj.value);
									}
								});
							}, function(){
								this.reqIdx = null;
							});
						}
					}
 				}
    		})];
    	}else if(config.status === 'STATUS_APPROVED'){
    		changeReleaseComment = true;
    		config.tbar.push({
        		xtype : 'button',
        		text  : 'Release',
        		handler : me.releaseHander(me)
        	},{
				xtype : 'button',
				text : 'Comment',
				handler : function(){
					if(me.hasChecked()){
						promptTextAreaDialog('Comment', null, function(comment){
							cometdfn.request({
								COMMAND : 'SETTING_COMMENT',
								MODULE_TYPE : me.moduleType,
								crId : me.changeRequestId,
								selection : me.getSelectionStatus(),
								comment : comment
							}, function(message){
								var data = message.BUSINESS_DATA;
								if(data){
									me.getStore().each(function(rd){
										for(var i=0; i<data.length; i++){
											if(rd.get('changes.serviceOperation.id') === data[i]){
												rd.set('changes.serviceOperation.releaseComment', comment);
											}
										}
									});
								}
							});
			    		}, false, null, false);
					}
				}
			});
    	}else if(config.status === 'STATUS_CHANGE_CANCEL'){
    		config.tbar.push({
        		xtype : 'button',
        		text  : 'Cancel',
        		handler : me.changeCancelHander(me)
        	});
    	} else if(config.status === 'STATUS_VENDERED'){
    		statusKey = 'changes.serviceOperation.serviceAcceptOperation.acceptOperation.currentStatus';
    		changeRequipment = true;
    		sowStuffPath = "changes.serviceOperation.serviceAcceptOperation.acceptOperation.sowStuff";
    		config.tbar.push({
        		xtype : 'button',
        		text  : 'Complete',
        		handler : me.complateHander(me)
        	},{
        		xtype : 'button',
        		text  : 'Omit',
        		handler : me.skipHander(me)
        	});
    		config.plugins=[Ext.create('Ext.grid.plugin.CellEditing', {
 				clicksToEdit : 1,
 				autoCancel : false,
 				listeners : {
 					'beforeedit' : function(_self, obj){
 						var status = obj.record.get('changes.serviceOperation.serviceAcceptOperation.acceptOperation.currentStatus');
 						if(status !== 'STATUS_VENDERED'){
 							return false;
 						}
 						if(obj.field === 'changes.serviceOperation.serviceAcceptOperation.acceptOperation.progress' && !me.beforeComplateCheck(obj.record)){
							return false;
 						}
						return true;
					},'afteredit' : function(_self, obj){
		    			var record = obj.record,
							oldVal = obj.originalValue,
							selModel = me.target.getSelectionModel();
		    			
						if(oldVal!==obj.value){
							if(obj.field === 'changes.serviceOperation.serviceAcceptOperation.acceptOperation.progress'){
								var id = record.get('id');
								if(this.reqIdx){
									cometdfn.removeListener(this.reqIdx);
								}
								var param = {};
								param[id] = {};
								param[id][selModel.getPkString(record)] = obj.value;
								cometdfn.request({
									COMMAND : 'COMMAND_CHANGE_ACCEPT_PROGRESS',
									MODULE_TYPE : me.moduleType,
									progress :	param,
									changeRequestId : me.changeRequestId || null
								}, function(message){
									if(message.STATUS == 'success'){
										 Notification.showNotification('Change Complate Success.');
	//									 me.reload();
										if(obj.value == 100){
											obj.record.set('changes.serviceOperation.serviceAcceptOperation.acceptOperation.currentStatus','STATUS_COMPLATED');
											obj.record.set('changes.serviceOperation.serviceAcceptOperation.acceptOperation.logicStatus','Completing');
										}
									 }else{
										 console.error(message);
										 record.set(obj.field, oldVal);
										 Notification.showNotification('Operation Fail.');
									 }
								}, function(){
									this.reqIdx = null;
								});
							}else{
								if(this.reqIdx2){
									cometdfn.removeListener(this.reqIdx2);
								}
								var param = {};
								if(obj.value instanceof Date){
									param[obj.field] = Ext.Date.format(obj.value, 'Y-m-d');
								}else{
									param[obj.field] = obj.value+'';
								}
								this.reqIdx2 = cometdfn.request({
									MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
	                        		COMMAND : 'OVERRIDE_SERVICE_SETTING',
	                        		id : record.get('changes.serviceOperation.serviceAcceptOperation.id'),
	                        		param : param
								}, function(message){
									this.reqIdx2 = null;
									console.log(message);
									me.reload();
								}, function(){
									this.reqIdx2 = null;
								});
							}
						}
					}
 				}
 			})];
    	} else if(config.status === 'STATUS_CHANGE_RELEASEMANAGER'){
    		config.tbar.push({
        		xtype : 'button',
        		text  : 'Cancel',
        		handler : me.releaseCancelHander(me)
        	},{
        		xtype : 'button',
        		text  : 'Hold',
        		handler : me.holdHander(me)
        	},{
        		xtype : 'button',
        		text  : 'Resume',
        		handler : me.resumeHander(me)
        	});
    	}else if(config.status === "STATUS_CANCEL" || config.status === "STATUS_ONHOLDED" || config.status === "STATUS_RESUME"){
    		config.tbar.push({
        		xtype : 'button',
        		text  : 'Approve',
        		handler : me.releaseApproveHander(me, true)
        	},{
        		xtype : 'button',
        		text  : 'Deny',
        		handler : me.releaseApproveHander(me, false)
        	});
    	} else if(config.status === 'STATUS_COMPLATING'||config.status === 'STATUS_COMPLATED'){
    		sowStuffPath = "changes.serviceOperation.serviceAcceptOperation.acceptOperation.sowStuff";
    		config.tbar.push({
        		xtype : 'button',
        		text  : 'Approve',
        		handler : me.completeApproveHander(me, true)
        	},{
        		xtype : 'button',
        		text  : 'Deny',
        		handler : me.completeApproveHander(me, false)
        	});
    	}
    	config.tbar.push({
    		xtype : 'button',
    		text : 'Clear grouping',
    		handler : function(){
    	    	me.target.features[0].cleanGrouping();
    	    }
    	},{
    		xtype : 'button',
    		text : 'Refresh',
    		handler : function(){
    	    	me.reload();
    	    }
    	});
    	me.status = config.status;
    	config.listeners['cellclick']= function(grid, cellElement, columnNum, record,
				rowElement, rowNum, e) {
    		if(record.get('groupindex')){
		        return;
		    }
			var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
			if(dataIndex === sowStuffPath+".name"){
				var readOnly = !changeRequipment;
				var requipmentType = record.get(sowStuffPath+".type"),
					selection = {checkAll:false,groups:[],selectGroups:[],selections:[record.get(me.target.selModel.pk[0])]},
					sowId = record.get(sowStuffPath+".id");
				if(!readOnly){
					if(record.get(statusKey) !== 'STATUS_VENDERED' && record.get(statusKey) !== 'STATUS_COMPLETE_REJECT'){
						readOnly = true;
					}
				}
				cometdfn.request({
					MODULE_TYPE:me.moduleType,
					COMMAND:'GET_CR_REQUIPMENT',
					crId : me.changeRequestId,
					sowId : sowId,
					selection:selection, 
					status : me.status
				}, function(message){
					if(!ServerMessageProcess(message)){
						return;
					}
					DigiCompass.Web.app.changeRequest.getSowRequirementWindow(Ext.JSON.decode(message.BUSINESS_DATA), function(reqs, window){
						var param = {
								MODULE_TYPE : me.moduleType,
								COMMAND:'SETTING_CR_REQUIPMENT',
								crId : me.changeRequestId,
								selection:selection, 
								sowId : sowId,
								status : me.status,
								reqType : requipmentType,
								reqs:reqs};
						cometdfn.request(param, function(msg){
							if(!ServerMessageProcess(msg)){
								return;
							}
							var data = msg.BUSINESS_DATA;
							if(data && requipmentType === 'Equipment'){
								record.set(sowStuffPath+".name", data.name);
								record.set(sowStuffPath+".generic", data.generic);
								record.set(sowStuffPath+".capex", data.capex);
								record.set(sowStuffPath+".opex", data.opex);
							}
							if(data){
								window.close();
							}
						});
					}, requipmentType, readOnly, record.get('changes.site.number')).show();
				});
			}else if(dataIndex === 'changes.serviceOperation.approveComment' || dataIndex === 'changes.serviceOperation.releaseComment'){
				var editor = false,
					comment = record.get(dataIndex),
					soId = record.get('changes.serviceOperation.id');
				if(dataIndex === 'changes.serviceOperation.approveComment'){
					editor = changeApproveComment && record.get('changes.serviceOperation.status') === 'STATUS_CHANGEREQUEST'
				} else{
					editor = changeReleaseComment && record.get('changes.serviceOperation.status') === 'STATUS_APPROVED'
				}
				promptTextAreaDialog('Comment', comment, function(comment){
					cometdfn.request({
						COMMAND : 'SETTING_COMMENT',
						MODULE_TYPE : me.moduleType,
						id : soId,
						comment : comment,
						crId : me.changeRequestId
					}, function(message){
						if(message.BUSINESS_DATA){
							me.getStore().each(function(rd){
								if(rd.get('changes.serviceOperation.id') === soId){
									rd.set(dataIndex, comment);
								}
							});
						}
					});
	    		}, !editor, null, false);
			}
		};
		me.callParent([config]);
    },
    completeApproveHander : function(me,approve){
    	return function(){
    		var approves = null, denieds=null;
	    	if(approve){
	    		approves = me.getSelectionStatus();
	    	}else{
	    		denieds = me.getSelectionStatus();
	    	}
			cometdfn.request({
				COMMAND : 'COMETD_COMMAND_COMPLETE_APPROVE',
				MODULE_TYPE : me.moduleType,
				approves :	approves,
				denieds : denieds,
				changeRequestId : me.changeRequestId || null
			}, function(message){
				 var renderId = message.renderTo;
				 if(message.STATUS == 'success'){
					 Notification.showNotification(''+(approve ? 'Approve' : 'Deny')+' Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification(''+(approve ? 'Approve' : 'Deny')+' fail.');
				 }
				
			});
    	}
    },
    releaseCancelHander : function(me){
    	return function(){
    		cometdfn.request({
				COMMAND : 'COMMAND_CHANGE_RELEASE_CANCEL',
				MODULE_TYPE : me.moduleType,
				cancels : me.getSelectionStatus(),
				changeRequestId : me.changeRequestId || null
			}, function(message){
				 var renderId = message.renderTo;
				 if(message.STATUS == 'success'){
					 Notification.showNotification('Change cancel Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification('Change cancel fail.');
				 }
				
			});
    	}
    },
    releaseApproveHander : function(me, approve){
    	return function(){
	    	var approves = null, denieds=null;
	    	if(approve){
	    		approves = me.getSelectionStatus();
	    	}else{
	    		denieds = me.getSelectionStatus();
	    	}
			cometdfn.request({
				COMMAND : 'COMMAND_RELEASE_OPERATION_APPROVE',
				MODULE_TYPE : me.moduleType,
				approves :	approves,
				denieds : denieds,
				changeRequestId : me.changeRequestId || null
			}, function(message){
				 var renderId = message.renderTo;
				 if(message.STATUS == 'success'){
					 Notification.showNotification(''+(approve ? 'Approve' : 'Deny')+' Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification(''+(approve ? 'Approve' : 'Deny')+' fail.');
				 }
				
			});
    	}
    },
    holdHander : function(me){
    	return function(){
    		cometdfn.request({
				COMMAND : 'COMMAND_CHANGE_ONHOLD',
				MODULE_TYPE : me.moduleType,
				onholds : me.getSelectionStatus(),
				changeRequestId : me.changeRequestId || null
			}, function(message){
				 var renderId = message.renderTo;
				 if(message.STATUS == 'success'){
					 Notification.showNotification('Change Onhold Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification('Change Onhold fail.');
				 }
				
			});
    	}
    },
    resumeHander : function(me){
    	return function(){
    		cometdfn.request({
				COMMAND : 'COMMAND_CHANGE_RESUME',
				MODULE_TYPE : me.moduleType,
				sesumes : me.getSelectionStatus(),
				changeRequestId : me.changeRequestId || null
			}, function(message){
				 var renderId = message.renderTo;
				 if(message.STATUS == 'success'){
					 Notification.showNotification('Change Resume Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification('Change resume fail.');
				 }
			});
    	}
    },
    beforeComplateCheck : function(record){
    	return record.get('changes.serviceOperation.serviceAcceptOperation.acceptOperation.sowStuff.valid');
    },
    progressHander : function(me){
    	return function(){
    		var selModel = me.target.getSelectionModel(),
    			records = me.target.store.getModifiedRecords(), 
    			i=0, param = {};
    		for(;i<records.length; i++){
    			var id = records[i].get('id');
    			var progress = records[i].get('changes.serviceOperation.serviceAcceptOperation.acceptOperation.progress');
    			if(progress >= 100 && !me.beforeComplateCheck(records[i])){
    				continue;
    			}
    			if(!param[id])
    				param[id] = {};
    			param[id][selModel.getPkString(records[i])] = progress;
    		}
    		cometdfn.request({
				COMMAND : 'COMMAND_CHANGE_ACCEPT_PROGRESS',
				MODULE_TYPE : me.moduleType,
				progress :	param,
				changeRequestId : me.changeRequestId || null
			}, function(message){
				if(message.STATUS == 'success'){
					 Notification.showNotification('Change Complete Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification('Change Complete fail.');
				 }
			});
    	}
    },
    complateHander : function(me){
    	return function(){
			cometdfn.request({
				COMMAND : 'COMMAND_CHANGE_ACCEPT_COMPLETE',
				MODULE_TYPE : me.moduleType,
				completes :	me.getSelectionStatus(),
				changeRequestId : me.changeRequestId || null
			}, function(message){
				if(message.STATUS == 'success'){
					 Notification.showNotification('Change Complate Success.');
					 me.reload();
				 }else if(message.customException){
					 Notification.showNotification(message.customException);
				 } else {
					 console.error(message);
					 Notification.showNotification('Change Complate fail.');
				 }
			});
    	}
    },
    skipHander : function(me){
    	return function(){
			cometdfn.request({
				COMMAND : 'COMMAND_CHANGE_ACCEPT_SKIP',
				MODULE_TYPE : me.moduleType,
				skips : me.getSelectionStatus(),
				changeRequestId : me.changeRequestId || null
			}, function(message){
				 var renderId = message.renderTo;
				 if(message.STATUS == 'success'){
					 Notification.showNotification('Change Omit Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification('Change Omit fail.');
				 }
				
			});
    	}
    },
    changeCancelHander : function(me){
    	return function(){
			cometdfn.request({
				COMMAND : 'COMMAND_CHANGE_CANCEL',
				MODULE_TYPE : me.moduleType,
				cancels : me.getSelectionStatus(),
				changeRequestId : me.changeRequestId || null
			}, function(message){
				 var renderId = message.renderTo;
				 if(message.STATUS == 'success'){
					 Notification.showNotification('Change Cancel Success.');
					 me.reload();
				 }else{
					 console.error(message);
					 Notification.showNotification('Change Cancel fail.');
				 }
				
			});
    	}
    }, 
    approveHander : function(me, approve){
    	return function(){
//    		promptTextAreaDialog('Comment', null, function(comment){
		    	var approves = null, denieds=null;
		    	if(approve){
		    		approves = me.getSelectionStatus();
		    	}else{
		    		denieds = me.getSelectionStatus();
		    	}
				cometdfn.request({
					COMMAND : 'COMMAND_CHANGE_APPROVE',
					MODULE_TYPE : me.moduleType,
					approves :	approves,
					denieds : denieds,
					changeRequestId : me.changeRequestId || null,
//					comment : comment
				}, function(message){
					 var renderId = message.renderTo;
					 if(message.STATUS == 'success'){
						 Notification.showNotification('Change '+(approve ? 'Approve' : 'Deny')+' Success.');
						 me.reload();
					 }else if(message.customException){
						 Notification.showNotification(message.customException);
					 } else {
						 console.error(message);
						 Notification.showNotification('Change '+(approve ? 'Approve' : 'Deny')+' fail.');
					 }
					
				});
//    		}, false, null, false);
    	}
    }, 
    releaseHander : function(me){
    	return function(){
//    		promptTextAreaDialog('Comment', null, function(comment){
				cometdfn.request({
					COMMAND : 'COMMAND_CHANGE_RELEASE',
					MODULE_TYPE : me.moduleType,
					releases :	me.getSelectionStatus(),
					changeRequestId : me.changeRequestId || null,
//					comment : comment
				}, function(message){
					if(message.STATUS == 'success'){
						 Notification.showNotification('Change Release Success.');
						 me.reload();
					 }else{
						 console.error(message);
						 Notification.showNotification('Change Release fail.');
					 }
				});
//    		}, false, null, false);
    	}
    },
    responseHandler : function(response, result){
//    	var record;
//    	if(result && result.success){
//			var siteMapArr = [];
//			me.param = {
//        		sitewindow_selections:response.selections,
//        		sitewindow_groups:response.groups,
//        		sitewindow_checkAll:response.checkAll,
//        		sitewindow_selectGroups:response.selectGroups
//        	}
//    	}
    },
    getModule : function(status){
    	var type, command;
    	switch(status){
	    	case "STATUS_CHANGEREQUEST":
	    		type = 'MOD_CHANGE_REQUEST_APPROVE';
	    		command = "COMMAND_QUERY_APPROVE";
	    		break;
	    	case "STATUS_APPROVED" :
	    		type = 'MOD_CHANGE_REQUEST_RELEASE';
	    		command = "COMMAND_QUERY_REALEASE";
	    		break;
	    	case 'STATUS_CHANGE_CANCEL':
	    		type = 'MOD_CHANGE_REQUEST_CANCEL';
	    		command = 'COMMAND_QUERY_CHANGE_CANCEL';
	    		break;
	    	case 'STATUS_COMPLETE_APPROVE':
	    	case 'STATUS_COMPLETE_REJECT':
	    	case "STATUS_VENDERED":
	    		type = 'MOD_CHANGE_REQUEST_ACCEPT';
	    		command = "COMMAND_QUERY_ACCEPT";
	    		break;
	    	case "STATUS_CHANGE_RELEASEMANAGER":
	    		type = 'MOD_CHANGE_REQUEST_RELEASE_OPERATION';
	    		command = "COMMAND_QUERY_RELEASEMANAGER";
	    		break;
	    	case "STATUS_CANCEL":
	    	case "STATUS_ONHOLDED":
	    	case "STATUS_RESUME":
	    		type = 'MOD_CHANGE_REQUEST_RELEASE_OPERATION_APPROVE';
	    		command = "COMMAND_QUERY_RELEASE_OPT_APPROVE";
	    		break;
	    	case "STATUS_COMPLATED":
	    	case "STATUS_COMPLATING":
	    		type = 'MOD_CHANGE_REQUEST_ACCPET_APPROVE';
	    		command = "COMMAND_QUERY_COMPLETE_APPROVE";
	    		break;
			default :
				type = 'MOD_CHANGE_REQUEST';
				command = "COMMAND_QUERY";
	    		break;
    	}
    	return {
			type : type,
			command : command
		}
    }
});