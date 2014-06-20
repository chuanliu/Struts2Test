Ext.define('DigiCompass.Web.app.planning.WBS', {
	extend: 'Ext.panel.Panel',
	config : {
		objIds : null,
		name : null,
		/**
		 * [{financialHierarchyId:'fid', serviceCatalogueHierarchyId : 'scid'},...]
		 */
		hierarchys : [],
		paramJson : null,
		type : null,
		queryCond : null
	},
	layout: {
	    type: 'vbox',
	    align : 'stretch',
	    pack  : 'start'
	},
	initComponent : function(){
		var me = this;
		me.callParent(arguments);
		//TODO get the Finiancial/Service Catalogue Hierarchys by objId and type
		cometdfn.request({
			MODULE_TYPE:'MOD_CHANGEREQUEST_WBS',
			COMMAND:'COMMAND_GET_HIERARCHYS',
			objIds : me.objIds,
			paramJson : me.paramJson,
			queryCond : me.queryCond
		}, function(msg){
			me.hierarchys = msg.BUSINESS_DATA;
			me.load();
		});
	},
	load : function(){
		var me = this;
		if(Ext.isArray(me.hierarchys)){
			for(var i=0; i<me.hierarchys.length; i++){
				var param = Ext.apply({
					objIds : me.objIds,
					paramJson : me.paramJson,
					type : me.type
				}, me.hierarchys[i]);
				var grid = Ext.create('DigiCompass.Web.app.grid.MutiGroupGrid', {
					title : 'WBS ('+ param.financialHierarchyName + ' , '+ param.serviceCatalogueHierarchyName+")",
					flex : 1,
					collapsible : true,
					useSearch : true,
					autoCheckBox : false,
					store : {
						autoLoad : true,
			            buffered: true,
			            proxy: {
			                type: 'cometd.mutigroup',
			                moduleType : 'MOD_CHANGEREQUEST_WBS',
			                modules : {
			                	read : {
			               		 	command : 'COMMAND_QUERY_GRID' 
			               		}
			                },
				            extraParams : param
			            }
			        },
			        tbar:[{
						xtype : 'button',
						text : 'Clear Grouping',
						handler : function(){
							this.up("mutigroupgrid").getTarget().features[0].cleanGrouping();
						}
					},{
						xtype : 'button',
						text : 'Export',
						handler : function(){
		    				var data = {	    					
			    					MODULE_TYPE : "MOD_CHANGEREQUEST_WBS",
			    					COMMAND : "COMMAND_QUERY_GRID",
			    					retType : 'excel',
									title : "WBS"						
				            	};
		    				
		    				var params = this.up("mutigroupgrid").getStore().getProxy().extraParams;
		    				if(params.objIds instanceof Array){
		    					params.objIds = JSON.stringify(params.objIds);
		    				}
		    				data = Ext.applyIf(data, params);	
							var url = "download";
							downloadFile(url, data);
						}
					}],
					listeners : {
						cellclick : function(grid, cellElement, columnNum, record,
							rowElement, rowNum, e) {
							var header = grid.getHeaderCt().getHeaderAtIndex(columnNum);
				    		if(record.get('groupindex')){
						        return;
						    }
			    			var sowStuffPath = 'changes.serviceOperation.serviceAcceptOperation.acceptOperation.sowStuff';
							var dataIndex = header.dataIndex;
							if(dataIndex === sowStuffPath+".name"){
								var readOnly = true;
								var requipmentType = record.get(sowStuffPath+".type"),
									sowId = record.get(sowStuffPath+".id");
								cometdfn.request({
									MODULE_TYPE:'MOD_CHANGEREQUEST_WBS',
									COMMAND:'GET_CR_REQUIPMENT',
									crId : record.get('id'),
									sowId : sowId,
									status : null
								}, function(message){
									if(!ServerMessageProcess(message)){
										return;
									}
									DigiCompass.Web.app.changeRequest.getSowRequirementWindow(Ext.JSON.decode(message.BUSINESS_DATA), function(reqs, window){
									}, requipmentType, true).show();
								});
							}else if(dataIndex === 'changes.serviceOperation.approveComment' || dataIndex === 'changes.serviceOperation.releaseComment'){
								promptTextAreaDialog('Comment', record.get(dataIndex), function(comment){
					    		}, true, null, false);
							}
						}
					}
				});
				grid.onGroupSumRender = function(val){
		        	var path = 'changes.serviceOperation.serviceAcceptOperation';
		        	qty = val.data['changes.serviceOperation.quantity'];
		        	return 'count='+val.data.groupcount+(Ext.isNumber(qty) ? ', quantity='+ qty : '') +', capex='+(val.data[path+'.capex'] || 0)+', opex='+(val.data[path+'.opex']||0);
		        };
				me.add(grid);
			}
		}
	}
		
});