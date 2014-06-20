(function() {
	Ext.namespace('DigiCompass.Web.app.plannedSite');

	DigiCompass.Web.app.plannedSite.checkbox_click = function(e) {
		e = e || window.event;
		e.stopPropagation();
	};

	DigiCompass.Web.app.plannedSite.getForm = function(data, technologys) {
		var firstload = true;
		var sitePropGrid = DigiCompass.Web.app.plannedSite.getGrid(Ext.clone(data), technologys);
		/*var tcns = new Array();
		for(var i = 0; i < technologys.length; i++){
			tcns.push({boxLabel : technologys[i].name, name : 'technology', inputValue : technologys[i].id, listeners : {
				change : function(self, newValue, oldValue, eOpts ){
					var tecId = self.inputValue;
					if(newValue){						
						if(!firstload){
							r = new DigiCompass.Web.app.plannedSite.PlannedSitePropModel();
							r.set("technology", tecId);
							console.log(r)
							sitePropGrid.getStore().add(r);
						}
						cellEditing
								.startEditByPosition({
									row : 0,
									column : 0
								});
					}else{
						var store = sitePropGrid.getStore();
						store.each(function(record){
							var technologyId = record.get("technology");
							if(tecId === technologyId){
								store.remove(record);
							}
						});						
					}
				}
			}});
		}*/
		Ext.apply(Ext.form.field.VTypes, {
		    //  vtype validation function
		    lat: function(val, field) {			
		       var v = Number(val);
		       if(isNaN(v)){
		    	   return false;
		       }else{
			       if(-90 <= v && v <= 90){
			    	   return true;
			       }else{
			    	   return false;
			       }
		       }
		    },
		    // vtype Text property: The error text to display when the validation function returns false
		    latText: 'Not a valid latitude.  Must be -180 to 180.'
		});
		Ext.apply(Ext.form.field.VTypes, {
		    //  vtype validation function
		    lng: function(val, field) {
		       var v = Number(val);
		       if(isNaN(v)){
		    	   return false;
		       }else{
			       if(-180 <= v && v <= 180){
			    	   return true;
			       }else{
			    	   return false;
			       }
		       }
		    },
		    // vtype Text property: The error text to display when the validation function returns false
		    lngText: 'Not a valid longitude.  Must be -90 to 90.'
		});
		var detail = Ext.create('Ext.form.Panel', {
			id : "plannedSiteFormDetail",
			region : 'north',
			heigth : 200,
			width : "100%",
			collapsible : true,
			bodyStyle : 'padding:5px',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side'
			},
			defaults : {
				anchor : '100%'
			},
			buttonAlign : 'left',
			items : [ {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .5,
					border : false,
					layout : 'anchor',
					defaultType : 'textfield',
					items : [  {
						xtype : 'hiddenfield',
						name : 'id'
					},	{
				    	xtype : "container",
				    	layout : "hbox",
				    	anchor : '95%',
				    	defaultType : 'textfield',
				    	items : [
		    	         {
								id : 'plannedSiteNameId',
								fieldLabel : 'Site Name',
								name : 'name',
								flex : 1,
								allowBlank : false,
								maxLength : UiProperties.nameMaxLength
							}, {
								name : 'code',
								margin : '0 0 0 10',
								flex : 1,
								fieldLabel : 'Site Code',								
								maxLength : UiProperties.nameMaxLength
							}
				    	]
				    }, {
				    	xtype : "container",
				    	layout : "hbox",
				    	anchor : '95%',
				    	defaultType : 'textfield',
				    	items : [
								Ext.create('DigiCompass.web.UI.ComboBox',{	
							id : "siteStateSel",
							moduleType : 'PLANNED_SITE_MODULE',								
							moduleCommand : 'getState',
							fieldLabel : 'State',			
							name : 'state',
							listeners : {
								change : function(self, newValue, oldValue, eOpts){									
				          			cometdfn.request({
				        				MODULE_TYPE : 'PLANNED_SITE_MODULE',
				        				COMMAND : 'genSiteNum',
				        				state : newValue
				        			}, function(message) {
				        				var data = message['BUSINESS_DATA'];								
				        				Ext.getCmp("siteNumField").setValue(data);
				        			});									
								}
							},
							parseData : function(message){
								var data = message['BUSINESS_DATA'];
								var d = [];
								for(var i in data){
									d.push([data[i].NAME, data[i].NAME]);
								}
								return d;
							},
							flex : 1
						}), {				
								id : "siteNumField",
						    	xtype : "textfield",
						    	margin : '0 0 0 10',
						    	fieldLabel : "Site Number",
						    	name : "number",
						    	//readOnly : true,
							    flex : 1
						    }
				    	]
				    },{
				    	xtype : "container",
				    	layout : "hbox",
				    	anchor : '95%',
				    	defaultType : 'textfield',
				    	items : [
							{
								name : 'jvSiteNum',
								fieldLabel : 'JV Site Number',
								flex : 1,
								maxLength : UiProperties.nameMaxLength
							}, {
								name : 'jvSiteName',
								margin : '0 0 0 10',
								flex : 1,
								fieldLabel : 'JV Site Name',								
								maxLength : UiProperties.nameMaxLength
							}
				    	]
				    }, {
				    	xtype : "container",
				    	layout : "hbox",
				    	anchor : '95%',				    	
				    	items : [
							Ext.create('DigiCompass.web.UI.ComboBox',{								
								name : 'siteType',								
								moduleType : 'PLANNED_SITE_MODULE',								
								moduleCommand : 'siteTypeList',
								fieldLabel : 'Site Type',
								flex : 1,
								parseData : function(message){
									var data = message['BUSINESS_DATA'];
									var d = [];
									for(var i in data){
										d.push([data[i].ID, data[i].NAME]);
									}
									return d;
								}
							}), {
								xtype: 'checkboxfield',
								name : 'roaming',
								margin : '0 0 0 40',
								flex : 1,
								inputValue : true,
								uncheckedValue : false,
								fieldLabel : '',
								boxLabel : 'Roaming Allowed'								
							}
				    	]
				    }, {
						xtype : 'container',
						layout : 'column',
						border : false,
						anchor : '95%',
						defaultType : 'textfield',
						items : [{
						id : 'plannedSiteLatitudeId',
						fieldLabel : 'Latitude',
						name : 'latitude',
						allowBlank : false,
						columnWidth : .8,
						maxLength : 30,
						vtype : "lat"
						},{
							columnWidth : .2,
							xtype : 'button',
							text : 'GpsToAddress',
							handler : function(){
								var latStr = Ext.getCmp("plannedSiteLatitudeId").getValue();
								var lngStr = Ext.getCmp("plannedSiteLongitudeId").getValue();								
								getAddressInfo(latStr, lngStr);		
							}
						}]
					}, {
						xtype : 'container',
						layout : 'column',
						border : false,
						anchor : '95%',
						defaultType : 'textfield',
						items : [{
							id : 'plannedSiteLongitudeId',
							fieldLabel : 'Longitude',
							name : 'longitude',
							allowBlank : false,
							columnWidth : .8,
							maxLength : 30,
							vtype : "lng"
						},{							
							columnWidth : .2,
							xtype : 'button',
							text : 'AddressToGps',
							handler : function(){
								var address = Ext.getCmp("plannedSiteAddressId").getValue();
								getGeoInfo(address);
							}
						}]
					},{
				    	xtype : "container",
				    	layout : "hbox",
				    	anchor : '95%',
				    	defaultType : 'displayfield',
				    	items : [
							{
								name : 'wgs84',
								fieldLabel : 'WGS84',
								flex : 1
							}, {
								name : 'agd66',
								margin : '0 0 0 10',
								flex : 1,
								fieldLabel : 'AGD66'
							}
				    	]
				    },{
						id : 'plannedSiteAddressId',
						fieldLabel : 'Address',
						name : 'address',
						anchor : '95%',
						allowBlank : false,
					}/*,{					
						id : "technologyId",
						xtype: 'checkboxgroup',
						allowBlank : false,
			            fieldLabel: 'Technology',
			            items: tcns			    
					},{
						id : 'versionNameId',
						fieldLabel : 'Version Name',
						name : 'version',
						anchor : '95%',
						allowBlank : false,
						maxLength : 30
					}*/,{
						xtype : "textarea",
						allowBlank : true,
						fieldLabel : 'Description',
						anchor : '95%',
						msgTarget : 'side',
						name : 'description',
						maxLength : UiProperties.descMaxLength
					} ]
				}, {
					columnWidth : .5,
					border : false,
					layout : 'anchor',
					defaultType : 'textfield',
					items : [{
						id : 'plannedSitePostalCodeId',
						fieldLabel : 'Postal Code',
						name : 'postal_code',
						anchor : '95%',
						allowBlank : false,
						maxLength : 30
					}, {
						id : 'plannedSiteStreetNoId',
						fieldLabel : 'Street No',
						name : 'streetNo',
						anchor : '95%',
						allowBlank : false,
						maxLength : 30
					}, {
						id : 'plannedSiteStreetNameId',
						fieldLabel : 'Street Name',
						name : 'streetName',
						anchor : '95%',
						allowBlank : false,
						maxLength : 30
					}, {
						id : 'plannedSiteSuburbId',
						fieldLabel : 'Suburb',
						name : 'suburb',
						anchor : '95%',
						allowBlank : false,
						maxLength : 30
					}, {
						id : 'plannedSiteCountryId',
						fieldLabel : 'Country',
						name : 'country',
						anchor : '95%',
						allowBlank : false,
						maxLength : 100
					}/*,{
						xtype : "textarea",
						margin : '15 0 20 0',
						allowBlank : true,
						fieldLabel : 'Comment',
						fieldWidth : '100%',
						msgTarget : 'side',
						name : 'comment',
						maxLength : 200
					} */ ]
				}]
			} ]/*,
			tbar : [ {
				xtype : 'button',
				text : 'Save',
				handler : function() {
					var detail = Ext.getCmp("plannedSiteFormDetail");
					if (validateForm(detail)) {
						Ext.getCmp("plannedSiteDetailPanel").toBack();					
						//formSubmit(detail, 1);
						var versionForm = Ext.getCmp("plannedSiteDetailPanel").reversalPanel.back;
						versionForm.doSave(function(formVal){							
							formSubmit(detail, 1, formVal);
						});		
					}
				}
			},{
				xtype : 'button',
				text : 'Save As',
				handler : function() {
					var detail = Ext.getCmp("plannedSiteFormDetail");
					if (validateForm(detail)) {
						Ext.getCmp("plannedSiteDetailPanel").toBack();
						var versionForm = Ext.getCmp("plannedSiteDetailPanel").reversalPanel.back;
						//formSubmit(detail, 2);
						versionForm.doSave(function(formVal){						
							formSubmit(detail, 2, formVal);							
						});		
					}
				}
			}]*/
		});
		if (data) {
			var formData = Ext.clone(data);
			if(data.technology){
				var tempTechnology = data.technology;
				var ids = new Array();
				for(var i=0; i<tempTechnology.length; i++){
					ids.push(tempTechnology[i].id);
				}
				formData.technology = ids;
			}
			formData.wgs84 = formData.wgs84x + " " + formData.wgs84y;
			formData.agd66 = formData.agd66x + " " + formData.agd66y;
			var siteStateSel = Ext.getCmp("siteStateSel");
			siteStateSel.suspendEvents()
			detail.getForm().setValues(formData);
			siteStateSel.resumeEvents()
		}
		// 将Panel添加在右边Panel上
		Ext.getCmp('plannedSiteDetailPanel').add(detail);		
		Ext.getCmp('plannedSiteDetailPanel').add(sitePropGrid);
		var mapPanel = Ext.create('Ext.panel.Panel', {				
			height : 600,			
			width:'100%',
			collapsible : true,
			dockedItems: [{
		        xtype: 'toolbar',
		        dock: 'top',
		        items: [{
		            text: 'popup',
		            handler : function(){		            			        		
		            	Ext.create('DigiCompass.Web.app.AutosizeWindow', {
		            		title: 'Network Map',
		            	    height: 800,
		            	    width: 1000,
		            	    layout: 'fit',
		            	    border: false,
		            	    items: Ext.create('Ext.panel.Panel', {		            	    	
		            	    	listeners : {
		            	    		afterlayout : function(){
		            	    			var el = this.body.dom;
			            	            if(data){
			    		        			createMap(el, data.name, data.latitude, data.longitude);
			    		        		}else{
			    		        			createMap(el, null, "-25.07711314540958", "137.32843924999997");
			    		        		}
		            	    		}
		            	    	}
			        		})
		            	}).show();		            	
		            }
		        }]
		    }],
		    html: "<div id='map_canvas_planned_site' style='width:100%; height:100%'></div>"		    
		});
		Ext.getCmp('plannedSiteDetailPanel').add(mapPanel);
		if(data){
			createMap("map_canvas_planned_site", data.name, data.latitude, data.longitude);
		}else{
			createMap("map_canvas_planned_site", null, "-25.07711314540958", "137.32843924999997");
		}
		firstload = false;
	};
	
	function validateForm(detail){
		var valid = false;
		if (detail.getForm().isValid()) {
			var records = new Array();						
			var plannedSitePropPanel = Ext.getCmp("plannedSiteProp");
			var repeat = false;
			var arr = new Array();				
			var store = plannedSitePropPanel.getStore();
			store.each(function(record) {
				var item = record.getData();					
				if(item.technology != ""){
					for(var i in arr){
						if(arr[i] == item.technology){
							repeat = true;
							return false;
						}
					}
					arr.push(item.technology);
					records.push(item);
				}				
			});							
			if(repeat){
				alertError("technology repeat");
				valid = false;
			}else{				
				valid = true;
			}
			store.each(function(record) {
				var item = record.getData();					
				if(item.technology !== ""){
					if(item.offloadFromOneSite === ''
						||item.radiusNewLoad === ''
						||item.ratioNewLoad === ''
						||item.radiusOffloadOuterMax === ''
						||item.radiusOffloadInnerMin === ''
						||item.radiusOffloadOuter === ''
						||item.radiusOffloadInner === ''
						||item.ratioOffloadMin === ''
						||item.ratioOffloadMax === ''){
						alertError("site properties data invalid");
						valid = false;
						return false;
					}
				}				
			});		
		}else{
			valid = false;
		}
		return valid;
	}
	
	function formSubmit(detail, type, formval){
			var formData = Ext.clone(detail.getForm().getValues());
			var records = new Array();						
			var plannedSitePropPanel = Ext.getCmp("plannedSiteProp");
			if(plannedSitePropPanel){		
				var store = plannedSitePropPanel.getStore();
				store.each(function(record) {
					var item = record.getData();					
					if(item.technology != ""){
						records.push(item);
					}				
				});				
			}
			
			formData.savetype = type;
			formData.props = records;
			formData.version = formval.versionName;
			formData.comment = formval.comment;
			formData.MODULE_TYPE = 'PLANNED_SITE_MODULE';
			formData.COMMAND = 'COMMAND_SAVE';
			cometdfn.publish(formData);
	}
	
	DigiCompass.Web.app.plannedSite.getTechnologyStore = function(technologys){
		var technologyData = [];			
		for(var i=0; i<technologys.length; i++){
			var item = {};
			item.id = technologys[i].id;
			item.name = technologys[i].name;
			technologyData.push(item);
		}
		var store = Ext.create('Ext.data.Store', {
		    fields: ['id', 'name'],
		    data : technologyData
		});
		return store;
	};
	
	DigiCompass.Web.app.plannedSite.getGrid = function(data, technologys) {
		Ext.define('DigiCompass.Web.app.plannedSite.PlannedSitePropModel',
				{
					extend : Ext.data.Model,
					fields : [ 'id', 'technology', 'offloadFromOneSite', 'radiusNewLoad',
							'ratioNewLoad', 'radiusOffloadOuterMax',
							'radiusOffloadInnerMin', 'radiusOffloadOuter',
							'radiusOffloadInner', 'ratioOffloadMin',
							'ratioOffloadMax']
				});
		
		var griddata = new Array();	
		if (data) {
			if(data.properties){
				griddata = data.properties;
				for(var i=0; i<griddata.length;i++){
					if(griddata[i].technology){
						var technologyId = griddata[i].technology.id;
						griddata[i].technology = technologyId;
					}
				}
			}
		}
		griddata.push(new DigiCompass.Web.app.plannedSite.PlannedSitePropModel());
	
		var plannedSitePropPanel = Ext.getCmp("plannedSiteProp");
		if (plannedSitePropPanel) {
			plannedSitePropPanel.getStore().loadData(griddata);
		} else {
			var columns = [ {
				header : "",
				dataIndex : 'id',
				hidden : true
			},{
				header : "Technology",
				dataIndex : 'technology',
				width : '10%',
				editor: new Ext.form.field.ComboBox({
					id : 'technologyCombox',
	                typeAhead: true,
	                triggerAction: 'all',
	                selectOnTab: true,
	                store : DigiCompass.Web.app.plannedSite.getTechnologyStore(technologys),
	                displayField: 'name',
	                valueField: 'id',
	                lazyRender: true,
	                listClass: 'x-combo-list-small',
	                listeners : {
	                	focus : function( self, The, eOpts ){
	                		var sitePropGrid = Ext.getCmp("plannedSiteProp");
	                		r = new DigiCompass.Web.app.plannedSite.PlannedSitePropModel();							
							console.log(r);
							sitePropGrid.getStore().add(r);
	                	}
	                },
	                allowBlank : false
	            }),renderer : function(val){	         
	            	for(var i=0; i<technologys.length; i++){
	            		if(val == technologys[i].id){
	            			val = technologys[i].name;
	            		}
	            	}
	            	return val;
	            }
			}, {
				header : "Offload",
				dataIndex : 'offloadFromOneSite',
				width : '10%',
				editor: new Ext.form.field.ComboBox({
	                typeAhead: true,
	                triggerAction: 'all',
	                selectOnTab: true,
	                store: [
	                    [false,'Area'],
	                    [true,'Nearest Site'],
	                ],
	                lazyRender: true,
	                listClass: 'x-combo-list-small',
	                allowBlank : false
	            }),renderer : function(val){
	            	if(val === true){
	            		return 'Nearest Site';
	            	}else if(val === false){
	            		return 'Area';
	            	}else{
	            		return val;
	            	}
	            }
			}, {
				header : "Load Area Radius",
				dataIndex : "radiusNewLoad",
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
				}
			}, {
				header : "Avg Area Load(%)",
				dataIndex : 'ratioNewLoad',
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
					,listeners : {
						focus : function(e){
							if(e.getValue() !== ''){
								var oldVal = e.getValue();
								e.setValue(oldVal * 100);
							}
						},
						blur : function(e){
							if(e.getValue() !== ''){
								var oldVal = e.getValue();
								e.setValue(oldVal / 100.0);
							}
						}
					}
				},renderer : DigiCompass.Web.UI.Cmp.Format.percentageRenderer				
			}, {
				header : "Max Offload Radius",
				dataIndex : 'radiusOffloadOuterMax',
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
				}
			}, {
				header : "Min Offload Radius",
				dataIndex : 'radiusOffloadInnerMin',
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
				}
			}, {
				header : "Max Offload Area Radius",
				dataIndex : 'radiusOffloadOuter',
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
				}
			}, {
				header : "Min Offload Area Radius",
				dataIndex : 'radiusOffloadInner',
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
				}
			}, {
				header : "Min Offload Ratio(%)",
				dataIndex : 'ratioOffloadMin',
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
					,listeners : {
						focus : function(e){
							if(e.getValue() !== ''){
								var oldVal = e.getValue();
								e.setValue(oldVal * 100);
							}
						},
						blur : function(e){
							if(e.getValue() !== ''){
								var oldVal = e.getValue();
								e.setValue(oldVal / 100.0);
							}
						}
					}
				}
				,renderer : DigiCompass.Web.UI.Cmp.Format.percentageRenderer
			}, {
				header : "Max Offload Ratio(%)",
				dataIndex : 'ratioOffloadMax',
				width : '10%',
				editor : {
					// defaults to textfield if no xtype is supplied
					allowBlank : false
					,listeners : {
						focus : function(e){
							if(e.getValue() !== ''){
								var oldVal = e.getValue();
								e.setValue(oldVal * 100);
							}
						},
						blur : function(e){
							if(e.getValue() !== ''){
								var oldVal = e.getValue();
								e.setValue(oldVal / 100.0);
							}
						}
					}
				}
				,renderer : DigiCompass.Web.UI.Cmp.Format.percentageRenderer
			}];

			var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});

			var grid = Ext
					.create(
							'Ext.grid.Panel',
							{
								id :"plannedSiteProp",								
								selModel : {
									selType : 'cellmodel'
								},
								collapsible : true,
								store : Ext
										.create(
												'Ext.data.JsonStore',
												{
													model : 'DigiCompass.Web.app.plannedSite.PlannedSitePropModel',
													data : griddata
												}),
								columnLines : true,
								columns : columns,
								height : 140,
								width : '100%',
								viewConfig : {
									stripeRows : true
								},
								frame: true,								
								plugins : [ cellEditing ]
							});

			return grid;
		}
	};

	DigiCompass.Web.app.plannedSite.getList = function(data, config) {

		var fields = [ 'id', 'name', 'number', 'code', 'jvSiteName', 'jvSiteNum', 'siteType', 'roaming', 'address', 'reference', 'country',
				'description', 'latitude', 'longitude', 'wgs84x', 'wgs84y', 'agd66x', 'agd66y', 'properties', 'state',
				'streetName', 'streetNo', 'suburb', 'technology', 'version', 'comment', 'postal_code'];
		var columns = [{
					xtype : 'treecolumn',
					header : 'Name',
					dataIndex : 'name'
				}, {
					header : 'Version Name',
					dataIndex : 'version'
				}, {
					header : 'Address',
					dataIndex : 'address'
				}];
		var _data = data.BUSINESS_DATA.list;
		var _technologys = data.BUSINESS_DATA.technologys;
		var datas = Ext.JSON.decode(_data);
		var technologys = Ext.JSON.decode(_technologys);
		var myStore = Ext.create('Ext.data.JsonStore', {
			fields : fields,
			data : datas
		});
		if (Ext.getCmp('plannedSiteListView')) {
			Ext.getCmp('plannedSiteListView').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				id:"plannedSiteExplorer",
				fields:fields,
				width:"fit",
				height:700,
				data:[]
			});
			objectExplorer.on('checkchange', function(node, checked) {      
				objectExplorer.checkchild(node,checked);  
				objectExplorer.checkparent(node);  
	    	});  
			
			var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
				width:"fit",
				id:"plannedSiteCatalogue",
				height:730,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'plannedSiteListView',
				module:'PLANNED_SITE_MODULE',
				command:'COMMAND_QUERY_LIST',
				otherParam:{},
				region:'west',
				layout:'border',
				width:50,
				height:530,
				objectExplorer:objectExplorer,
				catalogue:catalogue,
				hidden:true
			});
			mainPanel.reconfigData(datas);
			var objExpPanel = Ext.getCmp("obj-exp");
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}
			var cataloguePanel = Ext.getCmp("obj-cat");
			if (cataloguePanel) {
				// 移除组建
				cataloguePanel.removeAll();
			}
			objExpPanel.add(objectExplorer);
			var versionview = new DigiCompass.Web.app.VersionView({
				id : 'versionView'
			});
			versionview.hide();
			versionview.addDocked(getTbar('versionView'));
			versionview.onInitVersionView = function(){
				this.versionView.addListener('itemclick', function(grid , record , item , index, event ,eOpts){
					DigiCompass.Web.app.plannedSite.showDetailPanel(record.data, technologys);
				});
			}
			objExpPanel.add(versionview);
			function getTbar(type){
				
				var isVersinView = type==='versionView';
				var getSelection = function(){
					var sels = [];
					var selections;
					if(isVersinView){
						selections = versionview.versionView.getSelectionModel().getSelection();
					}else{
							var checked = Ext.getCmp("plannedSiteListView").objectExplorer.getChecked();
							selections = new Array();
							for(var i = 0 ; i<checked.length ; i++){
								selections.push({
									data:checked[i]
								});
							}
					}
					for(var key in selections){
//						sels.push(selections[key].getData());
						sels.push(selections[key].data);
					}
					return sels;
				}
				
				var items = [{
					xtype : 'button',
					text : 'New',
					iconCls : 'icon-add',
					handler : function() {
						DigiCompass.Web.app.plannedSite
								.showDetailPanel(null, technologys);
					}
				},
				{
					xtype : 'button',
					text : 'Delete',
					iconCls : 'icon-delete',
					handler : function() {
						//var checked = Ext.getCmp("plannedSiteListView").objectExplorer.getChecked();
						var checked = getSelection();
						var plannedSiteIds = new Array();							
						if(checked.length == 0){
							Ext.Msg.alert('Warning','Please select a record!');
						}else{
							for(var i = 0 ; i<checked.length ; i++){
								plannedSiteIds.push(checked[i].id);
							}
							alertOkorCancel(
									'Are you sure to delete selected planned site?',
									function(e) {
										if (e == 'yes') {
											DigiCompass.Web.app.plannedSite.deletePlannedSite(plannedSiteIds);
										}
									});
						}
					}
				}];
				if(type === 'versionView'){
					items.push({
						text:'Back',
				        handler : function(){
				        	Ext.getCmp('plannedSiteExplorer').show();
				        	Ext.getCmp('versionView').hide();
				        	if(Ext.getCmp('plannedSiteListView').getCataloguePanelVisible()){
				        		Ext.getCmp('obj-cat').show();
				        	}
				        }
					});
				}else{
					items.push({
						xtype:'button',
						text: 'Version',
						iconCls : 'icon-delete',
						handler : function() {
							DigiCompass.Web.UI.CometdPublish.getPlannedSiteVersionDataPublish('PLANNED_SITE',{
								planningCycleId: versionview.planningCycleId,
				    			scenarioId:  versionview.scenarioId,
				    			siteGroupId:  versionview.siteGroupId,
				    			technologyId:  versionview.technologyId,
				    			siteGroupPlannedId:  versionview.siteGroupPlannedId,
				    			versionId:  versionview.versionId,
				    			queryType: 'DELETED_LIST'
							});
						}
					});
				}
				items.push({
					text : 'Import',
					handler : function(){
						var msg = function(title, msg, error) {
					        Ext.Msg.show({
					            title: title,
					            msg: msg,
					            minWidth: 200,
					            modal: true,
					            icon: error == false ? Ext.Msg.INFO : Ext.Msg.ERROR,
					            buttons: Ext.Msg.OK
					        });
					    };
					    Ext.apply(Ext.form.field.VTypes, {
					        //  vtype validation function
					        file: function(val, field) {
					            return /\.(xlsx|xls|csv)$/i.test(val);
					        },
					        // vtype Text property: The error text to display when the validation function returns false
					        fileText: 'Not a valid file.  Must be "xlsx|xls|csv".'
					    });
		            	var win = new Ext.Window(
		            		    {
		            		        layout: 'fit',
		            		        width: 500,
		            		        height: 300,
		            		        modal: true,
		            		        closeAction: 'destroy',
		            		        items: new Ext.form.Panel(
		            		        {	            	
		            		           frame: true,
		            		           defaults: {
		            		               anchor: '100%',
		            		               allowBlank: false,
		            		               msgTarget: 'side',
		            		               labelWidth: 50
		            		           },
		            		           items: [{
		            		               xtype: 'filefield',
		            		               id: 'form-file',
		            		               emptyText: 'Select an file',
		            		               fieldLabel: 'File',
		            		               name: 'file-path',
		            		               buttonText: '',
		            		               buttonConfig: {
		            		                   iconCls: 'upload-icon'
		            		               },
		            		               vtype: 'file'
		            		           }],

		            		           buttons: [{
		            		               text: 'Upload',
		            		               handler: function(){
		            		                   var form = this.up('form').getForm();
		            		                   if(form.isValid()){
		            		                       form.submit({
		            		                           url: 'upload',
		            		                           params: {		            		                        	   
		            		                        	   MODULE_TYPE : "PLANNED_SITE_MODULE"
		            		                           },
		            		                           waitMsg: 'Uploading your file...',
		            		                           success: function(fp, o) {
		            		                        	   cometdfn.publish({MODULE_TYPE : "PLANNED_SITE_MODULE",COMMAND : 'COMMAND_QUERY_LIST',queryParam:null});
			            		                		   win.close();
		            		                           },
		            		                           failure: function(form, action){
		            		                        	   msg('Failure', 'Error processed file on the server', true);
		            		                           }
		            		                       });
		            		                   }
		            		               }
		            		           },{
		            		               text: 'Reset',
		            		               handler: function() {
		            		            	   this.up('form').getForm().reset();
		            		               }
		            		           }]
		            		        })
		            		    });
		            	win.show();
						}
				});
				items.push({
					text : 'Export',
					handler : function(){
						//var checked = Ext.getCmp("plannedSiteListView").objectExplorer.getChecked();
						var checked = getSelection();
						var plannedSiteIds = new Array();							
						if(checked.length == 0){
							Ext.Msg.alert('Warning','Please select a record!');
						}else{
							for(var i = 0 ; i<checked.length ; i++){
								plannedSiteIds.push(checked[i].id);
							}
							
		    				var data = {
		    					plannedSiteIds : plannedSiteIds.join(","),
		    					MODULE_TYPE : "PLANNED_SITE_MODULE",
		    					COMMAND : "COMMAND_EXPORT",
								title : "Planned Site"						
			            	};
			            	var str = context.param(data);
			            	window.location.href = "download?"+str;
	
						}
					}
				});
				return Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:items
				});
			}
			objectExplorer.addDocked(getTbar());
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			objectExplorer.addListener('itemclick', function(grid , record , item , index, event ,eOpts){	
				var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
				if(isChecked){
					return;
				}
				if(Ext.isEmpty(record.data.id)){
					return;
				}
				DigiCompass.Web.app.plannedSite.showDetailPanel(record.data, technologys);
			});
			
			/*var grid = Ext
					.create(
							'Ext.grid.Panel',
							{
								id : 'plannedSiteListView',
								title : 'PlannedSite',
								store : myStore,
								height : 700,
								columns : columns,
								tbar : [
										{
											xtype : 'button',
											text : 'New',
											iconCls : 'icon-add',
											handler : function() {
												DigiCompass.Web.app.plannedSite
														.showDetailPanel(null, technologys);
											}
										},
										{
											xtype : 'button',
											text : 'Delete',
											iconCls : 'icon-delete',
											handler : function() {
												var sledChk = Ext
														.select('.chk_cls:checked');
												var count = sledChk.getCount();
												if (count == 0) {
													Ext.Msg
															.alert('Warning',
																	'Please select a record!');
												} else {
													var plannedSiteIds = new Array();
													sledChk.each(function(el,
															e, index) {
														var dataId = el
																.getAttribute(
																		"id")
																.substring(4);
														plannedSiteIds
																.push(dataId);
													});
													alertOkorCancel(
															'Are you sure to delete selected planned site?',
															function(e) {
																if (e == 'yes') {
																	DigiCompass.Web.app.plannedSite.deletePlannedSite(plannedSiteIds);
																}
															});
												}
											}
										} ],
								listeners : {
									itemclick : function(grid, record, rowEl) {
										DigiCompass.Web.app.plannedSite
												.showDetailPanel(record.data, technologys);
									}
								}
							});*/
		}
		/*var objExpPanel = Ext.getCmp('obj-exp');
		if (objExpPanel) {
			objExpPanel.add(grid);
		}*/
	};
	
	DigiCompass.Web.UI.CometdPublish.getPlannedSiteVersionDataPublish = function(tableName, param, toVersion){
		var versionView = Ext.getCmp('versionView');
		versionView.tableName = tableName;
		toVersion = (toVersion !== false);
		param = param || {};
		param.MODULE_TYPE = 'MOD_VERSION_MANAGER';
		param.COMMAND='COMMAND_QUERY_ALL_TREE';
		param.tableName = tableName;
		param.load = true;
		var scenarioExplorer = Ext.getCmp('plannedSiteExplorer');
		var selections = scenarioExplorer.getSelectionModel().getSelection();
		versionView.selections = [];
		for(var key in selections){
			versionView.selections.push(selections[key].getData().versionId || selections[key].getData().id);
		}
		versionView.loadData(param, function(){
			if(toVersion || versionView.isVisible()){
				this.showView(param);
				scenarioExplorer.hide();
				Ext.getCmp('obj-cat').hide();
			}else{
				scenarioExplorer.show();
			}
		});
		
	}

	DigiCompass.Web.app.plannedSite.deletePlannedSite = function(plannedSiteIDs) {
		var message = {};
		message.plannedSiteIDs = plannedSiteIDs;
		message.MODULE_TYPE = 'PLANNED_SITE_MODULE';
		message.COMMAND = 'COMMAND_DEL';
		cometdfn.request(message,DigiCompass.Web.app.plannedSite.deletePlannedSiteCallback);
	}

	DigiCompass.Web.app.plannedSite.deletePlannedSiteCallback = function(data,
			Conf, fnName, command) {
		var status = data.STATUS;
		if (status === "success") {
			Ext.getCmp('obj-details').removeAll();
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.plannedSitePublish(queryParam);
			Ext.Msg.alert('Information', 'Delete Data Successful!');
		}else if(data.customException){
			alertError(data.customException);
		}
	};
	DigiCompass.Web.app.plannedSite.saveType = null;
	DigiCompass.Web.app.plannedSite.showDetailPanel = function(obj, technologys, detailPanel) {
		if(!detailPanel){
			var objExpPanel = Ext.getCmp('obj-details');
			if (objExpPanel) {
				// 移除组建
				objExpPanel.removeAll();
			}
			// 展示右边面板
			DigiCompass.Web.UI.Wheel.showDetail();
		}
	    var plannedSiteDetailPanel = Ext.create('Ext.panel.Panel',{
	    	id:'plannedSiteDetailPanel',
//	    	title:'Planned Site Detail',
	    	layout:'vbox',
	    	autoScroll:true
	    });
	    var version = "";
	    var obj_id = "";
	    var ptitle = "Object Detail - Planned Site";
	    if(obj){
	    	version = obj.version;
	    	obj_id = obj.id;
	    	ptitle = ptitle+"("+version+")";
	    }
	    var ReversalPanel= new DigiCompass.Web.app.ReversalPanel({
//			id : 'plannedSiteDetailPanel',
			panelTitle : ptitle,
			height:700,
			front : plannedSiteDetailPanel,
			back : new DigiCompass.Web.app.VersionForm({qrCode:obj_id})
		});
	    ReversalPanel.addToolBar('tbar', new Ext.toolbar.Toolbar({
	    	items : [ {
				xtype : 'button',
				text : 'Save',
				iconCls:'icon-save',
				handler : function() {
					var detail = Ext.getCmp("plannedSiteFormDetail");
					if (validateForm(detail)) {
						//formSubmit(detail, 1);
						var versionForm = Ext.getCmp("plannedSiteDetailPanel").reversalPanel.back;
						if(versionForm.isValid()){
							formSubmit(detail, 1, versionForm.getForm().getValues());
						}else if(Ext.getCmp("plannedSiteDetailPanel").reversalPanel.isFront()){
							Ext.getCmp("plannedSiteDetailPanel").reversalPanel.toBack();
						}
					}else if(Ext.getCmp("plannedSiteDetailPanel").reversalPanel.isBack()){
						Ext.getCmp("plannedSiteDetailPanel").reversalPanel.toFront();
					}
				}
			},{
				xtype : 'button',
				text : 'Save As',
				iconCls:'icon-save',
				handler : function() {
					var detail = Ext.getCmp("plannedSiteFormDetail");
					if (validateForm(detail)) {
						//formSubmit(detail, 1);
						var versionForm = Ext.getCmp("plannedSiteDetailPanel").reversalPanel.back;
						if(versionForm.isValid()){
							formSubmit(detail, 2, versionForm.getForm().getValues());
						}else if(Ext.getCmp("plannedSiteDetailPanel").reversalPanel.isFront()){
							Ext.getCmp("plannedSiteDetailPanel").reversalPanel.toBack();
						}
					}else if(Ext.getCmp("plannedSiteDetailPanel").reversalPanel.isBack()){
						Ext.getCmp("plannedSiteDetailPanel").reversalPanel.toFront();
					}
				}
			}]
	    }));
	    if(obj){
		    var versionForm = ReversalPanel.back;
			versionForm.setValues({
				 versionId : obj.id,
				 versionName : obj.version,
				 comment : obj.comment
			});
	    }
	    if(detailPanel){
	    	DigiCompass.Web.app.plannedSite.saveType = 'POPUP';
	    	detailPanel.add(ReversalPanel);
	    }else{
	    	objExpPanel.add(ReversalPanel);
	    }
		DigiCompass.Web.app.plannedSite.getForm(obj, technologys);				
	}

	DigiCompass.Web.app.plannedSite.refreshGrid = function(args) {
		args = args || {};

	};
	
	function getAddressInfo(latStr, lngStr){
		var lat = Number(latStr);
		var lng = Number(lngStr);
		if(isNaN(lat) || isNaN(lng)){
			return;
		}
		if(-90 <= lat && lat <= 90 && -180 <= lng && lng <= 180){
			context.codeLatLng(latStr, lngStr,function(results, status) {
			      if (status == google.maps.GeocoderStatus.OK) {
			    	  var address_components = results[0].address_components;
			    	  Ext.getCmp("plannedSiteAddressId").setValue(results[0].formatted_address);
			    	  for(var i=0; i<address_components.length;i++){
			    		  var address_component = address_components[i];
			    		  var types = address_component.types;
			    		  for(var j=0; j<types.length; j++){
			    			  if(types[j] === "country"){
			    				Ext.getCmp("plannedSiteCountryId").setValue(address_component.long_name);  
			    			  }
			    			  /*if(types[j] === "administrative_area_level_1"){
			    				Ext.getCmp("plannedSiteStateId").setValue(address_component.long_name); 
			    			  }*/
			    			  if(types[j] === "street_number"){								    				  
			    				  Ext.getCmp("plannedSiteStreetNoId").setValue(address_component.long_name);
			    			  }
			    			  if(types[j] === "route" || types[j] === "street_address"){								    				  
			    				  Ext.getCmp("plannedSiteStreetNameId").setValue(address_component.long_name);
			    			  }
			    			  if(types[j] === "sublocality"){								    				  
			    				  Ext.getCmp("plannedSiteSuburbId").setValue(address_component.long_name);
			    			  }else if(types[j] === "locality"){								    				  
			    				  Ext.getCmp("plannedSiteSuburbId").setValue(address_component.long_name);
			    			  }
			    			  if(types[j] === "postal_code"){								    				  
			    				  Ext.getCmp("plannedSitePostalCodeId").setValue(address_component.long_name);
			    			  }
			    		  }
			    	  }
				    } else {
				    	alertError("Geocoder failed due to: " + status);
				    }
				});
			
			var siteName = Ext.getCmp("plannedSiteNameId").getValue();
			setMarker(siteName, latStr, lngStr);
		}
	}
	
	function getGeoInfo(address){
		context.codeAddress(address, function(results, status){
			 if (status == google.maps.GeocoderStatus.OK) {
			     var location = results[0].geometry.location;
			     var lat = location.lat();
			     var lng = location.lng();
				 Ext.getCmp("plannedSiteLatitudeId").setValue(lat);
				 Ext.getCmp("plannedSiteLongitudeId").setValue(lng);
			 } else {
				 Ext.getCmp("plannedSiteLatitudeId").setValue("");
				 Ext.getCmp("plannedSiteLongitudeId").setValue("");
				 alertError("Geocode was not successful for the following reason: " + status);
			 }
		});
	}
	
	var map;
	var marker;
	var siteView;
	function createMap(renderId, title, latStr, lngStr, contentString){
		var latlng = new google.maps.LatLng(latStr, lngStr);
		var myOptions = {
			zoom : 4,
			minZoom : 2,
			center : latlng,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			scaleControl: true,
			panControl : true,
			overviewMapControl : true
		};
		var rdObj;
		if(Ext.isString(renderId)){
			rdObj = document.getElementById(renderId);
		} else {
			rdObj = renderId;
		}
		map = new google.maps.Map(rdObj,
				myOptions);
		var pinIcon = new google.maps.MarkerImage(
			    "styles/cmp/images/new/planned_site_marker.jpg",
			    null, /* size is determined at runtime */
			    null, /* origin is 0,0 */
			    null, /* anchor is bottom center of the scaled image */
			    new google.maps.Size(21, 43)
			);  
		marker = new google.maps.Marker({
		    position: latlng,
		    draggable:true,
		    icon : pinIcon,
		    title:title
		});
		marker.setMap(map);
		google.maps.event.addListener(marker, 'dragend', function() {
			  var position = marker.getPosition();
			  Ext.getCmp("plannedSiteLatitudeId").setValue(position.lat());
			  Ext.getCmp("plannedSiteLongitudeId").setValue(position.lng());
			  getAddressInfo(position.lat(), position.lng());
		});
		if(contentString){
			var infowindow = new google.maps.InfoWindow({
			    content: contentString
			});
			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});		
		}
		
		siteView = new SiteView(latlng, map);		
		var siteControlDiv = document.createElement('DIV');
		var siteControl = new SiteControl(siteControlDiv, map);
		siteControlDiv.index = 1;		
		map.controls[google.maps.ControlPosition.RIGHT_TOP]
				.push(siteControlDiv);		
	};
	
	function setMarker(title, latStr, lngStr, contentString){
		var latlng = new google.maps.LatLng(latStr, lngStr);
		marker.setTitle(title);
		marker.setPosition(latlng);
		map.setCenter(latlng);
		siteView.setLatlng(latlng);
		siteView.draw();
	}
	
	function SiteView(latlng, map){
		
		this.latlng = latlng;
		this.map  = map;		
		this.div = null;
		
		this.setMap(map);
		this.setLatlng = function(latlng){
			this.latlng = latlng;
		};
	}
	
	SiteView.prototype = new google.maps.OverlayView();
	SiteView.prototype.onAdd = function(){

		  // Create the DIV and set some basic attributes.
		  var div = document.createElement('DIV');
		  div.style.border = "none";
		  div.style.borderWidth = "0px";
		  div.style.position = "absolute";

		  var prog = document.createElement("progress");
		  prog.style.width = '100px';
		  prog.max = 100;
		  prog.value = 30;
		  div.appendChild(prog);
	
		  // Set the overlay's div_ property to this DIV
		  this.div = div;
	
		  // We add an overlay to a map via one of the map's panes.
		  // We'll add this overlay to the overlayImage pane.
		  var panes = this.getPanes();
		  panes.overlayLayer.appendChild(div);
	};
    SiteView.prototype.draw = function() {
    	
	    var overlayProjection = this.getProjection();
	    var latLngDivPixel = overlayProjection.fromLatLngToDivPixel(this.latlng);
    	  
        var div = this.div;
        div.style.zIndex = google.maps.Marker.MAX_ZINDEX;
        div.style.left = (latLngDivPixel.x -50) + 'px';
        div.style.top = (latLngDivPixel.y - 50) + 'px';
        div.style.width = '100px';
        div.style.height = '100px';
        
    };
     SiteView.prototype.onRemove = function() {
	    this.div.parentNode.removeChild(this.div);
	    this.div = null;
	 };
	 
})(); 