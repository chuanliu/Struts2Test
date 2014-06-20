(function() {

	var namespace = Ext.namespace('DigiCompass.Web.app.bug');
	
	namespace.checkRow = [];
	namespace.chek_box = function(check,event,id){
		if(check.checked){
			namespace.checkRow.push(id);
		}else{
			var checkeds = namespace.checkRow;
			for(var i = 0 ; i <checkeds.length ; i++){
				if(checkeds[i] == id){
					checkeds.splice(i,1);
				}
			}
		}
		event = event || window.event;
		event.stopPropagation();
	}
	
	// Bug getList method
	namespace.getList = function(data, config) {
		namespace.checkRow = [];
		var fields = ['id', 'version','createDate','reference'];
		var columns = [{
			xtype : 'treecolumn',
			header : 'Name',
			dataIndex : 'version',
			sortable : false,
			width : 130
		},{
			header : 'createDate',
			dataIndex : 'createDate',
			sortable : false,
			width : 130
		}
//			{
//			header : 'Reference',
//			dataIndex : 'reference',
//			sortable : false,
//			width : 80,
//			renderer:function(value){
//				if(value>0){
//					return '<font color=red>'+value+'</font>';
//				}
//				else{
//					return '<font color=green>'+value+'</font>';
//				}
//			}
//		}
		];
		var _data = data.BUSINESS_DATA;
		//console.log("返回的数据",_data);
		var datas = Ext.JSON.decode(_data);
		if (Ext.getCmp('objExpPanel_bugID')) {
			Ext.getCmp('objExpPanel_bugID').reconfigData(datas);
		} else {
			var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				columns:columns,
				id:"bugExplorer",
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
				id:"bugCatalogue",
				height:730,
				data:[],
				collapsible: true,
				split:true,
				region:'center',
				hidden:true
			});
			var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
				id : 'objExpPanel_bugID',
				module:'MOD_BUG',
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
			function getTbar(){
				return Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							namespace.cleanFormData();
							var formPanel = namespace.addFormPanel();
							formPanel.back.setValues({versionId : ''});
							formPanel.setTitle('Object Detail - bug');
						}
					}, {
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							//var checkeds = namespace.checkRow;
							var checkeds = new Array();
							var checked = Ext.getCmp("bugExplorer").getChecked();
							for(var i = 0 ; i<checked.length ; i++){
								checkeds.push(checked[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
							} else {
								var _btn = this;
								_btn.disable();
								cometdfn.request({MODULE_TYPE:'MOD_BUG',COMMAND:'COMMAND_DEL', ids:checkeds},
										function(message){
									_btn.enable();
									
									namespace.deleteSuccess(message);
								});
							}
						}
					}]
				});
			}
			objectExplorer.addDocked(getTbar());
			cataloguePanel.add(catalogue);
			catalogue.outerPanel = cataloguePanel;
			cataloguePanel.add(mainPanel);
			objectExplorer.addListener('itemclick', function(grid , record , item , index,event,eOpts){
				console.log("record",record);
				var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
				if(isChecked){
					return;
				}
				if(Ext.isEmpty(record.data.id)){
					return;
				}
				var bugId = record.data.id;
				cometdfn.publish({
					MODULE_TYPE : "MOD_BUG",
					COMMAND : 'COMMAND_QUERY_INFO',
					id : bugId
				});
			});
		}
	};
	
	namespace.cleanFormData = function(){
		if(Ext.getCmp('bugAdd')){
			Ext.getCmp('bugAdd').getForm().reset();
		}
	}
	
	var FrequencyStore = Ext.create('Ext.data.Store', {
	    fields: ['abbr', 'name'],
	    data : [
	        {"abbr":"Always", "name":"Always"},
	        {"abbr":"Often", "name":"Often"},
	        {"abbr":"Occasionally", "name":"Occasionally"},
	        {"abbr":"Rarely", "name":"Rarely"}
	    ]
	});
	var RegressionStore = Ext.create('Ext.data.Store', {
	    fields: ['version', 'name'],
	    data : [
	        {"version":"Always", "name":"Always"},
	        {"version":"Often", "name":"Often"},
	        {"version":"Occasionally", "name":"Occasionally"},
	        {"version":"Rarely", "name":"Rarely"}
	    ]
	});
	namespace.addFormPanel = function(bugId, renderTo) {
		var formPanel = Ext.getCmp('bugAdd');
		if (formPanel) {
			namespace.cleanFormData();
			formPanel.show();
		}
		namespace.reference = 0;
		if(!formPanel){
			formPanel = Ext.create('Ext.form.Panel', {
				id : 'bugAdd',
				defaultType : 'textfield',
				border : false,
				width : '100%',
				frame : false,
				autoScroll : true,
				//layout : 'anchor',
				fieldDefaults : {
					labelAlign : 'left',
					msgTarget : 'side',
					labelWidth : 150,
					emptyText : "Please input data!",
					margin : '10 20 0 10'
				},
				items : [{
					id : "bugId",
					xtype : "hidden",
					name : "id"
				},
//					{
//					margin : '10 0 0 10',
//					columnWidth : .7,
//					//id : 'bugName',
//					allowBlank : false,
//					xtype:"datefield",
//					fieldLabel : 'createDate',
//					maxLength:30,
//					width:550,
//					msgTarget : 'side',
//					name : 'createDate'
//				},{
//					xtype : "displayfield",
//					value : "Please enter bug' name,is the version number."
//				},
				{
					xtype : "displayfield",
					value : "Enter a one line summary of your report. Please be specific."
				},{
	                xtype: 'textfield',
	                defaultType: 'textfield',
	        		fieldLabel: "<font size='2' style=' font-weight:bold'>Synopsis</font>",
	        		width:600,
	        		grow: true,
	                name:"synopsis",
	                margin : '10 0 30 10'
	            }, {
					xtype : "displayfield",
					value : "Include the full OS version here (use 'ver' for Windows, 'uname -a' for Solaris/Linux). List multiple OSes if applicable."
				},{
					xtype: 'textfield',
	        		fieldLabel: "<font size='2' style=' font-weight:bold'>Full OS version</font>",
	        		allowBlank : false,
	        		width:600,
	        		grow: true,
	        		margin : '10 0 30 10',
	        		value:navigator.userAgent,
	                name:"osVersion"
	                
	       		},{
					xtype : "displayfield",
					value : "Paste the output of 'java -version' here. For J2EE, please also include the output of 'j2ee -version' or 'asadmin version'."
				},{	
	                xtype: 'textfield',
	        		fieldLabel: "<font size='2' style=' font-weight:bold'>Browser Version</font>",
	        		border:"0 0 0 0",
	        		//emptyText : "Please input data!",
	                name:"browserVersion",
	                width:600,
	                grow: true,
	                margin : '10 0 30 10',
	                value:getBrowserInfo()
	                //width:1000
		        },{
					xtype : "displayfield",
					value : "Enter a detailed description of the problem. Please describe only one problem per report. For multiple problems, file a separate report for each one."
				},
		        {
	               	xtype: 'textareafield',
	        		fieldLabel: "<font size='2' style=' font-weight:bold'>Description</font>",
	        		border:"0 0 0 0",
	                name:"description",
	                width:600,
	                align: 'middle',
	                border:"0 0 0 0",
	               	flex: 1,
	                margin : '10 0 30 10',
	                grow: true,
	                //marginleft:150,
	                allowBlank: false
	       		 },{
					xtype : "displayfield",
					value : "How often does the bug occur?"
				}, {
		            xtype:'combobox',
		            fieldLabel:"<font size='2' style=' font-weight:bold'>Frequency</font>",
		            name: 'frequency',
		            //style: (!Ext.isIE6) ? 'opacity:.3' : '',
	      			//labelWidth: 150,
	               // width: 400,
	                store: FrequencyStore,
	                valueField: 'abbr',
	                displayField: 'abbr',
	                typeAhead: true,
	                margin : '10 0 30 10',
	                emptyText : "Please Select One!",
	                //queryMode: 'local',
	                //disabled: true,
	                allowBlank: false
	                //forceSelection: false
		        },
		        {
					xtype : "displayfield",
					value : "Was this working in a prior release?, If yes, which one?"
				},
		        {	
		        	xtype:'textfield',
		            fieldLabel: "<font size='2' style=' font-weight:bold'>Regression</font>",
		            name: 'regression',
		            width:600,
		            margin : '10 0 30 10',
		            grow: true,
		            allowBlank: false
//		        	xtype:'combobox',
//		            fieldLabel:"Regression",
//		            name: 'regression',
//		           // style: (!Ext.isIE6) ? 'opacity:.3' : '',
//	      			//labelWidth: 150,
//	               // width: 400,
//	               	store: RegressionStore,
//	                valueField: 'version',
//	                displayField: 'version',
//	                
//	                typeAhead: true,
//	                queryMode: 'local',
//	                //disabled: true,
//	                //allowBlank: false,
//	                forceSelection: false
		        },{
					xtype : "displayfield",
					value : "Describe the step-by-step process we can follow to reproduce this bug."
				},{
		        	xtype:'textareafield',
		            fieldLabel: "<font size='2' style=' font-weight:bold'>Steps to Reproduce</font>",
		            width:600,
		            grow: true,
		            margin : '10 0 30 10',
		            name: 'reproduce'
		        },{
					xtype : "displayfield",
					value : "Describe the results you were expecting when performing the above steps."
				},{
		        	xtype:'textfield',
		            fieldLabel: "<font size='2' style=' font-weight:bold'>Expected Result</font>",
		            width:600,
		            margin : '10 0 30 10',
		            grow: true,
		            name: 'expectedResult'
		        },{
					xtype : "displayfield",
					value : "Please report the actual results that you saw."
				},{
		        	xtype:'textfield',
		            fieldLabel: "<font size='2' style=' font-weight:bold'>Actual Result</font>",
		            width:600,
		            margin : '10 0 30 10',
		            grow: true,
		            name: 'actualResult'
		        },{
					xtype : "displayfield",
					value : "Exact text of any error message(s) that appeared or any trace information available. Please paste the contents of the message(s) as a result of this crash."
				},{
		        	xtype:'textareafield',
		            fieldLabel: "<font size='2' style=' font-weight:bold'>Error Message(s)</font>",
		            allowBlank : false,
		            width:600,
		            margin : '10 0 30 10',
		            grow: true,
		            name: 'errorMessage'
		        },{
					xtype : "displayfield",
					value : "Please provide a temporary method for bypassing this bug, if you have found one."
				},{
		        	xtype:'textareafield',
		            fieldLabel: "<font size='2' style=' font-weight:bold'>Workaround</font>",
		            width:600,
		            grow: true,
		            margin : '10 0 30 10',
		            name: 'workaround'
		        },{
					xtype : "displayfield",
					value : "Can not make any progress until this bug is resolved."
				},{
					xtype:'fieldset',
		            title: 'Severity',
		            //collapsible: true,
		            defaultType: 'textfield',
		            layout: 'anchor',
		            width:600,
		            margin : '10 0 30 10',
		            defaults: {
		               // anchor: '100%'
		            },
		            items :[{
		                xtype: 'radiofield',
		                name: 'severity',
		                inputValue: 'Fatal',
		                fieldLabel: "<font size='2' style=' font-weight:bold'>Severity</font>",
		                boxLabel: 'Difficult to make even minimal progress without resolving this bug.'
		            }, {
		                xtype: 'radiofield',
		                name: 'severity',
		                inputValue: 'Major',
		                fieldLabel: '',
		                labelSeparator: '',
		                hideEmptyLabel: false,
		                boxLabel: 'Some progress is possible without resolving this bug.'
		            }, {
		                xtype: 'radiofield',
		                name: 'severity',
		                inputValue: 'Minor',
		                fieldLabel: '',
		                labelSeparator: '',
		                hideEmptyLabel: false,
		                boxLabel: 'What impact does this issue have on using the software?'
		            }, {
		                xtype: 'radiofield',
		                name: 'severity',
		                inputValue: 'NoImpact',
		                fieldLabel: '',
		                labelSeparator: '',
		                checked:true,
		                hideEmptyLabel: false,
		                boxLabel: 'No Impact.'
		            }]
		        },{
					xtype : "displayfield",
					value : "Please give us some information about yourself. Be sure to include a valid email address. You will receive confirmation and subsequent updates regarding your report via email."
				},{
		            xtype:'fieldset',
		            title: 'Contact Info',
		            //collapsible: true,
		            defaultType: 'textfield',
		            layout: 'anchor',
		            width:600,
		            margin : '10 0 30 10',
		            defaults: {
		               // anchor: '100%'
		            },
		            items :[{
		                fieldLabel: "<font size='2' style=' font-weight:bold'>username</font>",
		                width:400,
		                allowBlank : false,
		                name: 'username',
		                readOnly:true,
		                value:userinfo["username"]
		            },{
		                fieldLabel: "<font size='2' style=' font-weight:bold'>email</font>",
		                width:400,
		                vtype:'email',
		                allowBlank : false,
		                value:userinfo["useremail"],
		                name: 'email'
		            }]
		        
		        }
//		        ,{
//					xtype : "displayfield",
//					value : "Please give us some information about yourself. Be sure to include a valid email address. You will receive confirmation and subsequent updates regarding your report via email."
//				}
				]
			});
			
			
			var reversalPanel = new DigiCompass.Web.app.ReversalPanel({
//				renderTo : renderTo,
				height : '722',
				front : formPanel,
				back : new DigiCompass.Web.app.VersionForm({edit : false})
			});
			reversalPanel.addToolBar('bug', new Ext.toolbar.Toolbar({
				items : [{
					columnWidth : .3,
//					margin : '10 0 0 10',
					xtype : 'button',
					text : 'save',
					iconCls:'icon-save',
					handler : function() {
						if (formPanel.getForm().isValid()) {
							var _btn = this;
							_btn.disable();
							var data = formPanel.getForm().getValues();
							//console.log("输入的数据",data);
							cometdfn.request({
									MODULE_TYPE : "MOD_BUG",
									COMMAND : 'COMMAND_SAVE',
									data : data
								},function(message){
									_btn.enable();
									if (DigiCompass.Web.app.checkResult(formPanel, message)) {
										namespace.cleanFormData();
										if(!renderTo){
											cometdfn.publish({MODULE_TYPE : 'MOD_BUG',COMMAND : 'COMMAND_QUERY_LIST'});
										}
										reversalPanel.hide();
									}
							});
						}
					}
				}]
			}));
			if(!renderTo){
				Ext.getCmp('obj-details').add(reversalPanel);
			}else{
				Ext.getCmp(renderTo).add(reversalPanel);
			}
		}
		formPanel.reversalPanel.show();
		return formPanel.reversalPanel;
	}
	namespace.queryInfoCallBack = function(message){
		if(message.BUSINESS_DATA){
			namespace.reference = message.BUSINESS_DATA.reference;
			var _info = Ext.JSON.decode(message.BUSINESS_DATA.data);
			console.log("rederto",message);
			var formPanel = namespace.addFormPanel(null, message.renderTo);
			formPanel.setTitle('Object Detail - bug ('+_info.name+')');
			namespace.cleanFormData();
			formPanel.front.getForm().setValues(_info);
			formPanel.back.setValues({versionId : _info.id});
		}
	}
	
	namespace.deleteSuccess = function(data, Conf, fnName,
			command) {
		var status = data.STATUS;
		if (status === "success") {
			alertSuccess('Delete Data Successful!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.bugPublish(queryParam);
			Ext.getCmp('obj-details').removeAll();
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	/*
	 * 判断浏览器版本
	 */
	 
	 function getBrowserInfo()
		{
			var agent = navigator.userAgent.toLowerCase() ;
			
			var regStr_ie = /msie [\d.]+;/gi ;
			var regStr_ff = /firefox\/[\d.]+/gi
			var regStr_chrome = /chrome\/[\d.]+/gi ;
			var regStr_saf = /safari\/[\d.]+/gi ;
			//IE
			if(agent.indexOf("msie") > 0)
			{
				return agent.match(regStr_ie) ;
			}
			
			//firefox
			if(agent.indexOf("firefox") > 0)
			{
				return agent.match(regStr_ff) ;
			}
			
			//Chrome
			if(agent.indexOf("chrome") > 0)
			{
				return agent.match(regStr_chrome) ;
			}
			
			//Safari
			if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
			{
				return agent.match(regStr_saf) ;
			}
		
		}
	var userinfo = {};
	getuserinfo();
	function getuserinfo(){
		
		cometdfn.request({MODULE_TYPE:'MOD_BUG',COMMAND:'COMMAND_BUG_GETUSERNAME'},
				function(message){
					userinfo = message.BUSINESS_DATA;
				});
	}
//	alert(getnamees);
//
//	var isStrict = document.compatMode == "CSS1Compat",
//		isOpera = ua.indexOf("opera") > -1,
//		isSafari = (/webkit|khtml/).test(ua),
//		isIE = !isOpera && ua.indexOf("msie") > -1,
//		isIE7 = !isOpera && ua.indexOf("msie 7") > -1,
//		isGecko = !isSafari && ua.indexOf("gecko") > -1,
//		isBorderBox = isIE && !isStrict,
//		isWindows = (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1),
//		isMac = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1),
//		isLinux = (ua.indexOf("linux") != -1),
//		isSecure = window.location.href.toLowerCase().indexOf("https") === 0;
	/*
	 * 获取操作系统版本
	 */
	  function getwindows(){
	  	var sUserAgent = navigator.userAgent;  
	  	//查看操作系统   
//        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");   
//        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC")    
//            || (navigator.platform == "Macintosh");   
//  
//        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;   
//        //先全部设为false   
//        var isWin95 = isWin98 = isWinNT4 = isWin2K = isWinME = isWinXP = false;   
//        var isMac68K = isMacPPC = false;   
//        var isSunOS = isMinSunOS4 = isMinSunOS5 = isMinSunOS5_5 = false;   
//           
//        if (isWin) {   
//            isWin95 = sUserAgent.indexOf("Win95") > -1    
//                      || sUserAgent.indexOf("Windows 95") > -1;   
//            isWin98 = sUserAgent.indexOf("Win98") > -1    
//                      || sUserAgent.indexOf("Windows 98") > -1;   
//            isWinME = sUserAgent.indexOf("Win 9x 4.90") > -1    
//                      || sUserAgent.indexOf("Windows ME") > -1;   
//            isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1    
//                      || sUserAgent.indexOf("Windows 2000") > -1;   
//            isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1    
//                      || sUserAgent.indexOf("Windows XP") > -1;   
//            isWinNT4 = sUserAgent.indexOf("WinNT") > -1    
//                      || sUserAgent.indexOf("Windows NT") > -1    
//                      || sUserAgent.indexOf("WinNT4.0") > -1    
//                      || sUserAgent.indexOf("Windows NT 4.0") > -1    
//                      && (!isWinME && !isWin2K && !isWinXP); 
//          return isWin95;
//        }    
//        //没玩过苹果机....   
//        if (isMac) {   
//            isMac68K = sUserAgent.indexOf("Mac_68000") > -1    
//                       || sUserAgent.indexOf("68K") > -1;   
//            isMacPPC = sUserAgent.indexOf("Mac_PowerPC") > -1    
//                       || sUserAgent.indexOf("PPC") > -1;
//                       
//                       return isMac68K;
//        }   
//  
//        if (isUnix) {   
//            isSunOS = sUserAgent.indexOf("SunOS") > -1;   
//           
//            if (isSunOS) {   
//                var reSunOS = new RegExp("SunOS (\\d+\\.\\d+(?:\\.\\d+)?)");   
//                reSunOS.test(sUserAgent);   
//                isMinSunOS4 = compareVersions(RegExp["$1"], "4.0") >= 0;   
//                isMinSunOS5 = compareVersions(RegExp["$1"], "5.0") >= 0;   
//                isMinSunOS5_5 = compareVersions(RegExp["$1"], "5.5") >= 0;   
//            } 
//            return isMinSunOS4;
//        }  
		var starW = sUserAgent.indexOf('(');
		var endW = sUserAgent.indexOf(')');
		//console.log("操作系统版本",sUserAgent);
  		return sUserAgent.substring(starW+1,endW);
	  }
})();