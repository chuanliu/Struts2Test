(function(){
	Ext.ns("DigiCompass.Web.app.eform");
	
	DigiCompass.Web.app.eform.showEformCatExp = function(){
		
		var config = {
		  MODULE_TYPE : "EFORM_CATALOGUE_MODULE", 
		  COMMAND : "COMMAND_QUERY_GRID", 
		  fields : ['id', 'name', 'description','changes',"eformDefinition"], 
		  columns : [{										
				xtype : 'treecolumn',
				header : 'Name',
				dataIndex : 'name'							
			}, {
				text : "Description",
				dataIndex : "description"
			}],
		  title : "eForm Catalogue"	
		};
		
		var objExp = new DigiCompass.Web.UI.ObjectExplorer(config);
		objExp.detailPanelAddComponent = function(detailPanel, obj){
			
			var formPanel = Ext.create('Ext.form.Panel', {			
				id : "eformPanel",
			    bodyPadding: 5,
			    
			    // Fields will be arranged vertically, stretched to full width
			    layout: 'anchor',
			    
			    // The fields
			    defaultType: 'textfield',
			    defaults : {
			    	labelWidth : 200
			    },
			    items: [{
			    	xtype : "hidden",
			    	id : "eformId",
			    	name : "id"
			    },{
			        fieldLabel: 'Name',
			        name: 'name',
			        allowBlank: false		        
			    },{
			    	xtype : "textarea",		    	
			        fieldLabel: 'Description',
			        name: 'description',
			        anchor: '50%'
			    },Ext.create('DigiCompass.web.UI.ComboBox',{
			    	id : "eformDef",
					name 		 : 'eformDef',					
					fieldLabel   : 'eFrom Definition',
					allowBlank   : false,
					displayField : 'name',
					valueField   : 'id',
					value : obj ? obj.eformDefinition.id : null,
					labelWidth : 200,
					moduleType : 'EFORM_MODULE',
					moduleCommand : 'COMMAND_QUERY_GRID',					
					parseData : function(message){
						var data = Ext.JSON.decode(message['BUSINESS_DATA']['list']);
						var d = [];
						for(var i in data){
							d.push([data[i].id, data[i].name]);
						}
						return d;
					},
					editable     : false				
				})],

			    // Reset and Submit buttons
			    tbar : [{
			        text: 'Save',
			        iconCls : 'icon-save',
			        handler: function() {
			        	processForm(this, "COMMAND_SAVE");
			        }
			    },{
			        text: 'Submit',
			        formBind: true, //only enabled once the form is valid
			        disabled: true,
			        handler: function() {
			        	processForm(this, "COMMAND_SUBMIT");
			        }
			    },{
			        text: 'Reset',
			        handler: function() {
			        	var objExpPanel = Ext.getCmp('obj-details');
						if (objExpPanel) {
							// 移除组建
							objExpPanel.removeAll();
						}
			        }
			    }]		    
			});
			
			formPanel.changes = [];
			if(obj){
				formPanel.getForm().setValues(obj);			
			}
			detailPanel.add(formPanel);
			
			var siteTabPanel = DigiCompass.Web.app.eform.siteSelPanel();
			if(obj){
				var changes = obj.changes;
				var siteIds = new Array();
				for(var i = 0; i < changes.length; i++){
					siteIds.push(changes[i].siteId);
				}
				var message = {};						
				message.MODULE_TYPE = 'EFORM_CATALOGUE_MODULE';
				message.COMMAND = 'COMMAND_SITE_INFO';
				message.siteIds = siteIds;				
				cometdfn.request(message, function(message, Conf) {
					var status = message.STATUS;
					if (status === "success") {							
						var _data = message.BUSINESS_DATA.data;
						var data = Ext.decode(_data);
						var type = message.BUSINESS_DATA.type;
						addSites(siteTabPanel, data, changes, null);
					} else if (message.customException) {
						alertError(message.customException);
					}
				});
			}
			detailPanel.add(siteTabPanel);			
		}
		objExp.show();
	}
	
	function processForm(btn, command){
		var formPanel = btn.up('form');
        var form = formPanel.getForm();
        if (form.isValid()) {
        	var vals = form.getValues();
			var message = {};						
			message.MODULE_TYPE = 'EFORM_CATALOGUE_MODULE';
			message.COMMAND = command;
			message.id = vals.id;
			message.name = vals.name;
			message.description = vals.description;
			message.eformDef = vals.eformDef;
			message.changes = formPanel.changes;
			console.log(message);						
			cometdfn.request(message, function(message, Conf) {
				var status = message.STATUS;
				if (status === "success") {
					DigiCompass.Web.app.eform.showEformCatExp();
					var objExpPanel = Ext.getCmp('obj-details');
					if (objExpPanel) {
						// 移除组建
						objExpPanel.removeAll();
					}
				} else if (message.customException) {
					alertError(message.customException);
				}
			});
        }
    }
	
	function changeParentNodeValue(node , dataIndex){
		var parentNode = node.parentNode;
		if(parentNode){
			var _childNodes = parentNode.childNodes;
			if(dataIndex == 'quantity'){
				var capex = 0;
				var opex = 0;
				var quantity = 0;
				for(var i = 0 ; i < _childNodes.length ; i++){
					if(_childNodes[i].isLeaf()){
						quantity = quantity + _childNodes[i].data.quantity;
						capex = capex + _childNodes[i].data.capex * _childNodes[i].data.quantity;
						opex = opex + _childNodes[i].data.opex * _childNodes[i].data.quantity;
					}else{
						capex = capex + _childNodes[i].data.capex;
						opex = opex + _childNodes[i].data.opex;
						quantity = quantity + _childNodes[i].data.quantity * 1;
					}
				}
				parentNode.data.capex = capex;
				parentNode.data.opex = opex;
				parentNode.data.quantity = quantity;
				
			}else{
				var data = 0;
				for(var i = 0 ; i < _childNodes.length ; i++){
					if(_childNodes[i].isLeaf()){
						var quantity = _childNodes[i].data['quantity'] || 1;
  				        data = data + _childNodes[i].data[dataIndex] * quantity;
  				    }else{
      					data = data + _childNodes[i].data[dataIndex];
  					}
				}
				parentNode.data[dataIndex] = data;
			}
			parentNode.commit();
			if(parentNode.parentNode){
				changeParentNodeValue(parentNode , dataIndex)
			}
		}
	}
	
	DigiCompass.Web.app.eform.serviceListPanel = function(sowDetailPanel, siteId){
		
		var store = Ext.create('Ext.data.TreeStore', {
			fields: ['id','name','capex','opex','quantity','sows'],
			root: {},
		    listeners : {
	        	update : function( me, record, operation, changeItem){
	        		if(Ext.isEmpty(changeItem)){
	        			return;
	        		}
	        		me.suspendEvents();
	        		if(changeItem[0] == 'opex' || 
	        				changeItem[0] == 'capex' || 
	        				changeItem[0] == 'quantity'){
	        			record.commit();
	        			changeParentNodeValue(record, changeItem[0]);
	        		}
	        		updateServiceQty(siteId, record.get("id"), record.get("quantity"));
	        		me.resumeEvents();
	        	}
		    }
		});
		
		var panel = Ext.create('Ext.tree.Panel', {
		    title: "Service",
		    rootVisible : false,
		    width: 360,
		    store : store,
			plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
	        	listeners : {
	        		beforeedit: function (me, e) {
	        			return e.record.isLeaf()
	        		}
	        	}			
			})],
		    columns: [{
	            xtype	  : 'treecolumn',
	            text	  : 'Name',	            	            	            
	            dataIndex : 'name'	            
	        },{
	            xtype	  : 'numbercolumn',
	            text	  : 'Capex',	            	            	            
	            dataIndex : 'capex'	            
	        },{
	            xtype	  : 'numbercolumn',
	            text	  : 'Opex',	            	            	            
	            dataIndex : 'opex'	            
	        },{
	            xtype	  : 'numbercolumn',
	            text	  : 'Quantity',	            	            	            
	            dataIndex : 'quantity'
	        }],
	        listeners : {
	        	itemclick : function(_this, record, item, index, e, eOpts ){	        			        		
	        		DigiCompass.Web.app.eform.initServiceIns(siteId, record, sowDetailPanel);	        		
	        	}
	        }
		});
		
		return panel;
	}
	
	DigiCompass.Web.app.eform.initServiceIns = function(siteId, record, sowDetailPanel){
		var sows = record.get("sows");
		var quantity = record.get("quantity");
		var rootNode = {	
					name:'SOW',
	                iconCls:'task-folder',	                
	                expanded: true,
	                children : []
				};
		if(sows && sows.length > 0){
			var sow = sows[0];
			for(var i = 0; i < quantity; i++){
				var sowRootNode = Ext.clone(sow);				
				sowRootNode.name = (i + 1) + ".";
				sowRootNode.serviceNo = (i + 1);
				DigiCompass.Web.app.eform.processSow(siteId, record.get("id"), sowRootNode.serviceNo, sowRootNode);
				DigiCompass.Web.app.msa.changeRootArrToTree(sowRootNode);
				DigiCompass.Web.app.eform.changeIdField(sowRootNode);
				rootNode.children.push(sowRootNode);
			}
			sowDetailPanel.setRootNode(rootNode);
			sowDetailPanel.sow = sow;
			sowDetailPanel.serviceItem = record;
		}		
	}
	
	DigiCompass.Web.app.eform.processSow = function(siteId, serviceId, serviceNo, sow){
		var data = getData(siteId, serviceId);
		iteratorSow(siteId, serviceId, serviceNo, sow, data);
	}
	
	function iteratorSow(siteId, serviceId, serviceNo, sow, data){
		if(sow){
			if(sow.requirements){
				for(var i = 0; i < sow.requirements.length; i++){
					processRequirement(sow.requirements[i], serviceNo, data);
				}
			}
			if(sow.children){
				for(var i = 0; i < sow.children.length; i++){
					iteratorSow(siteId, serviceId, serviceNo, sow.children[i], data);
				}
			}
		}
	}
	
	function processRequirement(requirement, serviceNo, data){
		if(data.instances && data.instances.length > 0){
			var isfind = false;
			for(var i = 0; i < data.instances.length; i++){
				if(serviceNo == data.instances[i].serviceNo){
					var rtnVal = processReq(requirement, data.instances[i].reqIds, data.instances[i].requipments);
					if(rtnVal){
						isfind = true;
					}
					break;
				}
			}
			if(!isfind){
				processReq(requirement, data.reqIds, data.requipments);
			}
		} else {
			processReq(requirement, data.reqIds, data.requipments);			
		}
	}
	
	function processReq(requirement, reqids, requipments){
		var isfind = false;
		for(var i = 0; i < reqids.length; i++){
			if(requirement.id == reqids[i]){
				isfind = true;
				if(requirement.type == "Text"){
					requirement.content = requipments[i].content;
				} else if(requirement.type == "Document"){
					requirement.filePath = requipments[i].filePath;
				} else if(requirement.type == "List"){
					requirement.value = requipments[i].value;
				} else if(requirement.type == "Equipment"){
					requirement.instances = requipments[i].instances;
				}
				break;
			}
		}
		return isfind;
	}
	
	DigiCompass.Web.app.eform.changeIdField = function(node){
		if(node){
			if(node.id){
				node.objId = node.id;
				node.id = null;
			}
			if(node.children){
				for(var i = 0; i < node.children.length; i++){
					DigiCompass.Web.app.eform.changeIdField(node.children[i]);
				}
			}
		}
	}
	
	DigiCompass.Web.app.eform.serviceDetailPanel = function(siteId){
	
		var store = Ext.create('Ext.data.TreeStore', {
	    	fields: [{ name : 'name' , type: 'string' },
	    	         { name : 'description' , type : 'string' },
	    	         { name : 'itemNo' , type : 'string' },
	    	         { name : 'requirements' }],
	        root: {	name:'SOW',
	                iconCls:'task-folder',
	                leaf : true,
	                expanded: true
	        },
	        folderSort: true
	    });
		var panel = Ext.create('Ext.tree.Panel', {			
			flex : 1,						
		    store: store,
		    columns: [{
		        xtype: 'treecolumn', //this is so we know which column will show the tree
		        text: 'Name',
		        flex: 3,
		        sortable: false,
		        dataIndex: 'name'
		    },{
		    	text: 'Description',
		        flex: 3,
		        sortable: false,
		        dataIndex: 'description'
		    },{
		    	text	  : 'Requirement',
		        flex	  : 3,
		        sortable  : false,
		        dataIndex : 'requirements',
		        renderer  : function(value, metaData, record){
		        	var name = '';
		        	var reqs = record.data.requirements;
		        	var arr = new Array();
		        	if(reqs){		        		
		        		for(var i = 0; i < reqs.length; i++){
		        			arr.push(reqs[i].name + ' ('+reqs[i].type+')');		        			
		        		}
		        		name = arr.join(",");
		        	}
		        	return name;
		        }
		    },{				
				width		 : 40,
	            menuDisabled : true,
	            xtype: 'actioncolumn',
	            align: 'center',
	            items: [{
		                icon: './styles/cmp/images/delete.png',  
		                scope: this,
		                getClass: function(value,meta,record,rowIx,colIx, store) {            
		                	if(record.raw.serviceNo) return 'x-grid-center-icon';
    	                    return 'x-hide-display';
		                },
		                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
			            	/*if(record.isRoot() || record.raw.reference > 0){
			            		return;
			            	}*/
			            	var parent = record.parentNode;
			            	record.remove();
			            	var quantity = parent.childNodes.length;
			            	for(var i = 0; i < quantity; i++){
			            		var serviceNode = parent.childNodes[i];
			            		if(serviceNode.raw.serviceNo){
			            			serviceNode.set("name", i + 1);
			            			serviceNode.raw.serviceNo = i + 1;
			            		}
			            	}
			            	panel.serviceItem.set("quantity", quantity);
			            	processServiceInsRequirements(panel, siteId, store);
		                }
	            	}]
		    }], 
		    tbar : [
		       {
		    	   text : "Add Service Instance",
		    	   handler : function(){
						var serviceId;
						if(panel.serviceItem){
							serviceId = panel.serviceItem.get("id");
						} else {
							return;
						}
		    		   
		    		    var rootNode = panel.getRootNode();
						var sowRootNode = Ext.clone(panel.sow);
						var quantity = rootNode.childNodes.length;
						var no = (quantity + 1);
						sowRootNode.name = no + ".";
						sowRootNode.serviceNo = no;
						DigiCompass.Web.app.eform.processSow(siteId, serviceId, sowRootNode.serviceNo, sowRootNode);
						DigiCompass.Web.app.msa.changeRootArrToTree(sowRootNode);
						DigiCompass.Web.app.eform.changeIdField(sowRootNode);
						rootNode.appendChild(sowRootNode);
						panel.serviceItem.set("quantity", no);
						processServiceInsRequirements(panel, siteId, store);
		    	   }
		       }
		    ],
		    listeners : {
				cellclick : function(grid, cellElement, columnNum, record, rowElement, rowNum, e) {
					var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
					if(dataIndex != 'requirements' || !record.isLeaf()){
						return;
					}

					var requirements = record.data.requirements;
					var type = record.data.requirements[0].type;
					//var mreqs = getMreqs(siteId, serviceId);								
					for(var i = 0; i < requirements.length; i++){
						var reqId = requirements[i].id;									
						if(type == "Text"){
							var reg = requirements[i].ext;
							/*var content = "";
							if(mreqs[reqId]){
								reg = mreqs[reqId].reg;
								content = mreqs[reqId].content;
							}*/
							requirements[i].reg = reg; 	
							//requirements[i].content = content;										
						} else if(type == "Document"){
							var fileReg = requirements[i].ext;
							/*var filePath = "";
							if(mreqs[reqId]){
								fileReg = mreqs[reqId].fileReg;
								filePath = mreqs[reqId].filePath;
							}*/
							requirements[i].fileReg = fileReg;
							//requirements[i].filePath = filePath;
						} else if(type == "List"){
							/*var val = "";
							if(mreqs[reqId]){
								val = mreqs[reqId].value;											
							}*/
							requirements[i].list = requirements[i].ext.split(",");
							//requirements[i].value = val;
						} else if(type == "Equipment"){
							var eqId = requirements[i].ext;
							requirements[i].from = eqId;
							if(requirements[i].instances){
								var instances = requirements[i].instances;											
								//requirements[i].instances = instances;
								var qty = 0;
								for(var p in instances){
									qty += instances[p].length;
								}
								requirements[i].qty = qty;
							} else {
								requirements[i].qty = requirements[i].quantity;																						
								requirements[i].instances = {};
								requirements[i].instances[eqId] = []
								cometdfn.request({
									MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
									COMMAND : 'COMMAND_QUERY_INFO',
									BUSINESS_DATA : eqId
								},function(message){
									var data = Ext.JSON.decode(message.BUSINESS_DATA);											
									data.isInit = true;	
									for(var i = 0; i < requirements.length; i++){
										if(data.id == requirements[i].ext){
											var instanceArr = requirements[i].instances[requirements[i].ext];
											data.id = "";												
											instanceArr.push(data);
											for(var j = 1; j < requirements[i].qty; j++){
												instanceArr.push(myClone(data));
											}													
										}
									}
								});
							}
						}
					}								
					DigiCompass.Web.app.changeRequest.getSowRequirementWindow(record.data.requirements, function(eqs, window){
						//var mreqs = getMreqs(siteId, serviceId);
						for(var m = 0; m < eqs.length; m++){
							eqs[m].type = this.getForm().getValues().type;
							//mreqs[eqs[m].id] = eqs[m];
							for(var n = 0; n < requirements.length; n++){
								if(eqs[m].id == requirements[n].id){
									if(eqs[m].type == "Text"){
										requirements[n].content = eqs[m].content;
									} else if(eqs[m].type == "Document"){
										requirements[n].filePath = eqs[m].filePath;
									} else if(eqs[m].type == "List"){
										requirements[n].value = eqs[m].value;
									} else if(eqs[m].type == "Equipment"){
										requirements[n].instances = eqs[m].instances;
									}
								}
							}
						}
						processServiceInsRequirements(panel, siteId, store);		        		
						window.close();
					}, type, false).show();								
				}
			},
		    rootVisible: false					    			    
		});					
		/*var sows = Ext.clone(obj.sows);
		if(sows && sows.length > 0){
			var rootNode = sows[0];
			DigiCompass.Web.app.msa.changeRootArrToTree(rootNode);
			panel.setRootNode(rootNode);
		}*/
	
		return panel;
	}
	
	function processServiceInsRequirements(panel, siteId, store){
		var serviceId;
		if(panel.serviceItem){
			serviceId = panel.serviceItem.get("id");
		} else {
			return;
		}
		var mreqs = getMreqs(siteId, serviceId);
		var arr = [];
		store.getRootNode().eachChild(function(record){		        			
			if(record.raw.serviceNo){
				var serviceIns = {
					serviceNo:record.raw.serviceNo
				}
				var requirements = [];
				record.cascadeBy(function(r){
					if(r.isLeaf()){
						requirements.push({
							sowId : r.raw.objId,
							requirements : r.get("requirements")
						});
					}
				});
				serviceIns.requirements = requirements;
				arr.push(serviceIns);
			}		        			
		});	
		mreqs.splice(0, mreqs.length);
		for(var i = 0; i < arr.length; i++){
			mreqs.push(arr[i]);
		}
	}
	
	DigiCompass.Web.app.eform.getPlannedSite = function(){
		
		var flexView = new DigiCompass.Web.app.grid.MutiGroupGrid({				    	
	        useSearch : true,
	        title : "Planned Site",
	        store: {
	            buffered: true,
	            autoLoad : false,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_SITE_LIST' 
	               		}
	                },
					extraParams: {
		                treeNode : 'siteNum',
		                siteType : 'planned'
		            }
	            }
	        },
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					flexView.getTarget().features[0].cleanGrouping();
				}
			}]
	    });
		
		return flexView;
	}
	
	DigiCompass.Web.app.eform.getExistedSite = function(){
		
		var flexView = new DigiCompass.Web.app.grid.MutiGroupGrid({	    	
	        useSearch : true,
	        title : "Existed Site",
	        store: {
	        	autoLoad : true,
	            buffered: true,
	            proxy: {
	                type: 'cometd.mutigroup',
	                moduleType : 'MOD_CHANGE_REQUEST',
	                modules : {
	                	read : {
	               		 	command : 'COMMAND_SITE_LIST' 
	               		}
	                },
					extraParams: {
		                treeNode : 'siteNum'
		            }
	            }
	        },
	        tbar:[{
				xtype : 'button',
				text : 'Clear Grouping',
				handler : function(){
					flexView.getTarget().features[0].cleanGrouping();
				}
			}]
	    });					
			    
		return flexView;
	}
	
	DigiCompass.Web.app.eform.getSiteDetail = function(data, type){
		
		var items = [{
	        fieldLabel: 'Site',
	        value : data.name,	        	        
	    },{		    			    
	        fieldLabel: 'Latitude',
	        value : data.latitude	        
	    },{		    			    
	        fieldLabel: 'Longitude',
	        value : data.longitude	        
	    },{
	        fieldLabel: 'Status',
	        value : data.siteStatus	        
		},{
	        fieldLabel: 'Group Resp',
	        value : data.groupResp	        
		},{
	        fieldLabel: 'Polygon',
	        value : data.polygon	        
		}];
		
		if(type == 1){
			items.push({
		        fieldLabel: 'Code',
		        value : data.code		        
			});
			items.push({
		        fieldLabel: 'Number',
		        value : data.number		        
			});
			items.push({
		        fieldLabel: 'State',
		        value : data.state		        
			});
			items.push({
		        fieldLabel: 'Suburb',
		        value : data.suburb		        
			});
			items.push({
		        fieldLabel: 'Type',
		        value : data.siteType		        
			});
			items.push({
		        fieldLabel: 'Spectrum Region',
		        value : data.spectrumRegion
			});						
		} else if(type == 2){
			items.push({
				xtype : 'combo',
		        fieldLabel: 'Spectrum Region'		       		        
			});
			items.push({
		        fieldLabel: 'Comment',
		        value : data.comment		        
			});
			items.push({
		        fieldLabel: 'Description',
		        value : data.description		        
			});
		}

		var formPanel = Ext.create('Ext.form.Panel', {
			height : 220,
		    bodyPadding: 5,
		    
		    // Fields will be arranged vertically, stretched to full width
		    layout: 'anchor',
		    
		    // The fields
		    defaultType: 'displayfield',
		    items: items
		});
		
		return formPanel;
	}
	
	function addServices(siteId, serviceDatas){
		var changes = Ext.getCmp("eformPanel").changes;
		for(var i = 0; i < changes.length; i++){
			if(changes[i].siteId == siteId){
				for(var j = 0; j < serviceDatas.length; j++){
					var data = serviceDatas[j];
					var mreqs = processReqs(data);					
					changes[i].services.push({
						serviceId : data.serviceId,
						capex : data.capex,
						opex : data.opex,
						quantity : data.quantity,
						data : data,
						mreqs : mreqs,
						requiredDate : null
					});
				}
				break;
			}
		}
	}
	
	function processReqs(data){
		var mreqs = [];
		if(data.instances && data.instances.length > 0){
			for(var m = 0; m < data.instances.length; m++){
				var serviceNo = data.instances[m].serviceNo;
				var reqIds = data.instances[m].reqIds;
				var requirements = data.instances[m].requipments;		
				for(var i = 0; i < reqIds.length; i++){
					requirements[i].id = reqIds[i]; 
					if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$Text"){
						requirements[i].type = "Text";
					} else if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$Document"){
						requirements[i].type = "Document";
					} else if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$ListRequipment"){
						requirements[i].type = "List";
					} else if(requirements[i]['@type'] == "com.digicompass.cmp.jcr.bean.planning.SiteChange$SowStuff$Equipment"){
						requirements[i].type = "Equipment";
						var eqId = requirements[i].eqId;
						var instances = requirements[i].instanceRefs; 
						var insObj = {};
						insObj[eqId] = [];
						for(var k = 0; k < instances.length; k++){																								
							insObj[eqId].push({"id" : instances[k].id});
						}
						requirements[i].instances = insObj;
					}					
				}
				var serviceIns = {
    					serviceNo : serviceNo,
    					requirements : [{
    						requirements : requirements
    					}]
    			}
				mreqs.push(serviceIns);
			}
		}
		return mreqs;
	}
	
	function delService(siteId, serviceId){
		var changes = Ext.getCmp("eformPanel").changes;
		for(var i = 0; i < changes.length; i++){
			if(changes[i].siteId == siteId){
				var services = changes[i].services;
				for(var j = 0; j < services.length; j++){
					if(services[j].serviceId == serviceId){
						services.splice(j, 1);
						return;
					}
				}
			}
		}
	}
		
	function updateServiceQty(siteId, serviceId, quantity){
		var changes = Ext.getCmp("eformPanel").changes;
		for(var i = 0; i < changes.length; i++){
			if(changes[i].siteId == siteId){
				var services = changes[i].services;
				for(var j = 0; j < services.length; j++){
					if(services[j].serviceId == serviceId){
						services[j].quantity = quantity; 
					}
				}				
			}
		}
	}
	
	function getData(siteId, serviceId){
		var changes = Ext.getCmp("eformPanel").changes;
		for(var i = 0; i < changes.length; i++){
			if(changes[i].siteId == siteId){
				var services = changes[i].services;
				for(var j = 0; j < services.length; j++){
					if(services[j].serviceId == serviceId){
						return services[j].data; 
					}
				}				
			}
		}
	}
	
	function getMreqs(siteId, serviceId){
		var changes = Ext.getCmp("eformPanel").changes;
		for(var i = 0; i < changes.length; i++){
			if(changes[i].siteId == siteId){
				var services = changes[i].services;
				for(var j = 0; j < services.length; j++){
					if(services[j].serviceId == serviceId){
						return services[j].mreqs; 
					}
				}				
			}
		}
	}
	
	function addSite(param){
		var changes = Ext.getCmp("eformPanel").changes;
		changes.push(param);
	}
	
	function delSite(siteId){
		var changes = Ext.getCmp("eformPanel").changes;
		for(var i = 0; i < changes.length; i++){
			if(changes[i].siteId == siteId){
				changes.splice(i, 1);
				break;
			}
		}
	}
	
	function addSites(siteTabPanel, datas, changes, type){
		var siteServicePanelMap = new Object();
		var siteIds = new Array();
		console.log(new Date());
		Ext.suspendLayouts();
		for(var i = 0; i < datas.length; i++){
			var data = datas[i];
			siteIds.push(data.id);
			var ptype;
			if(type == null){
				if(data.path.indexOf("Exists") != -1){
					ptype = 1;
				} else if(data.path.indexOf("Planned") != -1){
					ptype = 2;
				}
			} else {
				ptype = type;
			}
			var siteDetail = DigiCompass.Web.app.eform.getSiteDetail(data, ptype);
			var panel = Ext.create('Ext.panel.Panel', {
			    title: data.name,
			    siteId : data.id,			    
			    closable : true,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
			    items : [siteDetail]
			});
			addSite({
				siteId : data.id,
				siteName : data.name,
				services : []
			});
			
			var serviceDetailPanel = DigiCompass.Web.app.eform.serviceDetailPanel(data.id);
			var serviceListPanel = DigiCompass.Web.app.eform.serviceListPanel(serviceDetailPanel, data.id);	
			
			var servicePanel = Ext.create('Ext.panel.Panel', {			    
			    flex : 1,
			    layout : {
			    	type: 'hbox',
			        align: 'stretch',
			    },
			    items : [serviceListPanel, serviceDetailPanel]
			});
			panel.add(servicePanel);
			siteTabPanel.insert(siteTabPanel.items.length - 1, panel).show();
			siteTabPanel.setActiveTab(panel);
			siteServicePanelMap[data.id] = serviceListPanel;
		}
		Ext.resumeLayouts(true);
		console.log(new Date());
		var message = {};		
		message.MODULE_TYPE = 'EFORM_CATALOGUE_MODULE';
		message.COMMAND = 'EFORM_SERVICE_TEMPL';
		message.eformId = Ext.getCmp("eformId").getValue();
		message.siteIds = siteIds;
		message.eformDef = Ext.getCmp("eformDef").getValue();
		cometdfn.request(message, function(msg){
			var siteService = msg.BUSINESS_DATA.siteService;
			for(var i in siteService){
				var serviceData = siteService[i];
				var data = Ext.JSON.decode(serviceData.list);
				var services = Ext.JSON.decode(serviceData.services);
				addServices(i, services);
				siteServicePanelMap[i].setRootNode(data);
			}
			siteServicePanelMap = null;
		});
	}
	
	DigiCompass.Web.app.eform.siteSelPanel = function(){
		var siteTabPanel = Ext.create('Ext.tab.Panel', {
			id : "siteTabPanel",
			flex : 1,
		    items: [{		    	
				title : 'Add Site',
				iconCls : 'icon-add',				
				closable : false
			}],		    
		    listeners : {
		    	remove : function(_this, component, eOpts ){
		    		delSite(component.siteId);
		    	},
		        render: function() {
		            this.items.each(function(i){
		                i.tab.on('click', function(){
							var existedSitePanel = DigiCompass.Web.app.eform.getExistedSite();
							var plannedSitePanel = DigiCompass.Web.app.eform.getPlannedSite();
							
							var tabPanel = Ext.create('Ext.tab.Panel', {
								activeTab: 0,
								layout: 'hbox',
							    items: [existedSitePanel, plannedSitePanel],
							    listeners : {
							    	tabchange : function(tabPanel, newCard, oldCard, eOpts ){
							    		if(newCard == plannedSitePanel){
							    			newCard.reload();
							    		}
							    	}
							    }
							});
							
							var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{						
								title:'Choose Site',
								width : 800,
								height : 600,
								modal:true,
								layout:'fit',
								items : [tabPanel],
								tbar:[{
									xtype : 'button',
									text : 'Finish',
									handler:function(){
										var selectionStatus;
										var type;
										if(tabPanel.getActiveTab() == existedSitePanel){
											var params = {
													selection:existedSitePanel.getSelectionStatus()
												};
											var message = Ext.clone(params);
											message.MODULE_TYPE = 'MOD_SITE_GROUP';
											message.COMMAND = 'COMMAND_GET_SITES_DATA'; 
											cometdfn.request(message, function(msg){
												var data = Ext.JSON.decode(msg.BUSINESS_DATA);
												addSites(siteTabPanel, data, null, 1);												
											});
											existedSitePanel.remove(true);											
										} else {											
											var status = plannedSitePanel.getSelectionStatus();
											var params = {
													checkAll : status.checkAll,
													selections : Ext.JSON.encode(status.selections),
													groups : Ext.JSON.encode(status.groups),
													selectGroups : Ext.JSON.encode(status.selectGroups)
												};											
											var message = Ext.clone(params);
											message.MODULE_TYPE = 'MOD_CHANGE_REQUEST';
											message.COMMAND = 'COMMAND_GET_SITES'; 
											cometdfn.request(message, function(msg){
												var data = Ext.JSON.decode(msg.BUSINESS_DATA);
												console.log(data);
												addSites(siteTabPanel, data, null, 2);											
											});											
											plannedSitePanel.remove(true);																						
										}
										win.close();
									}	
								}]
							});
							win.show();
						});
		            });
		        }
		    }
		});
		return siteTabPanel;
	}
})();