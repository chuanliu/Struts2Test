Ext.ns("DigiCompass.sys.settings");
DigiCompass.sys.settings = function() {
	var win = Ext.getCmp("mailSettingsWindow");
	if (!win) {
		
		Ext.apply(Ext.form.field.VTypes, {
		    //  vtype validation function
		    nounpwd: function(val, field) {
				var username = Ext.getCmp("mail.username").getValue();
				var password = Ext.getCmp("mail.password").getValue();
				if(Ext.String.trim(username) == "" && Ext.String.trim(password) != ""){
					return false;
				} else {
					return true;
				}		        
		    },
		    // vtype Text property: The error text to display when the validation function returns false
		    nounpwdText: 'No username, but has password'		    
		});
		
		var panel = Ext
				.create(
						"Ext.form.Panel",
						{
							id : "mailSettingsPanel",
							bodyPadding : 5,
							items : [
									{
										// Fieldset in Column 1 - collapsible
										// via toggle button
										xtype : 'fieldset',
										title : 'Mail Setting(Restart to take effect)',
										collapsible : true,
										defaultType : 'textfield',
										defaults : {
											labelWidth : 150,
											anchor : '100%'
										},
										items : [ {
											fieldLabel : 'SMTP Server Host',
											name : 'mail.host',
											allowBlank : false
										},{
											fieldLabel : 'SMTP Server Port',
											name : 'mail.port',
											allowBlank : false
										}, {
											fieldLabel : 'User Name',
											id : "mail.username",
											name : 'mail.username',
											//allowBlank : false
											vtype : "nounpwd"
										}, {
											fieldLabel : 'Password',
											id : 'mail.password',
											name : 'mail.password',
											inputType : 'password',
											//allowBlank : false,
											vtype : "nounpwd"
										}, {
											fieldLabel : 'From Email',
											name : 'mail.from',
											allowBlank : false
										}, {
											xtype : "checkboxfield",
											boxLabel  : 'Use SSL',
								            name      : 'mail.use.ssl',
								            inputValue: true,
								            uncheckedValue : false,
								            checked   : true
										}]
									},{
										xtype : 'fieldset',
										title : 'Welcome Email',
										collapsible : true,
										items : [{
											xtype : "displayfield",
											value : "Available variables ${name}, ${username}, ${baseuri}, ${set_pwd_url}"
										},{											
											xtype : "textarea",
											name : 'mail.rstmplRs',
											allowBlank : false,
											grow : true,
											anchor : '100%'
										} ]
									},									
									{
										xtype : 'fieldset',
										title : 'Reset Password Email',
										collapsible : true,
										items : [{
												xtype : "displayfield",
												value : "Available variables ${name}, ${username}, ${baseuri}, ${set_pwd_url}"
											},{											
											xtype : "textarea",
											name : 'mail.rstmplFp',
											allowBlank : false,
											grow : true,
											anchor : '100%'											
										} ]
									},									
									{
										xtype : 'fieldset',
										title : 'Retrieve Username Email',
										collapsible : true,
										items : [{
												xtype : "displayfield",
												value : "Available variables ${name}, ${username}, ${baseuri}"
											},{											
											xtype : "textarea",
											name : 'mail.rstmplFun',
											allowBlank : false,
											grow : true,
											anchor : '100%'											
										} ]
									},{
										xtype : 'fieldset',
										title : 'Send Mail Succeeded',
										collapsible : true,
										items : [
										    {											
											xtype : "textarea",
											name : 'mail.send.successed',
											allowBlank : false,
											grow : true,
											anchor : '100%'											
										} ]
									},{
										xtype : 'fieldset',
										title : ' Send Mail Failed',
										collapsible : true,
										items : [
										    {											
											xtype : "textarea",
											name : 'mail.send.failed',
											allowBlank : false,
											grow : true,
											anchor : '100%'											
										} ]
									}],
							buttons : [ {
								formBind : true, // only enabled once the
								// form is valid
								disabled : true,
								text : "Submit",
								handler : function() {
									var form = this.up('form').getForm();
									if (form.isValid()) {
										var message = form.getValues();
										message.MODULE_TYPE = 'USER_SETTINGS_MODULE';
										message.COMMAND = 'COMETD_COMMAND_USER_SETTINGS';
										cometdfn
												.request(
														message,
														function(data, Conf) {
															var status = data.STATUS;
															if (status === "success") {
																var rv = data.BUSINESS_DATA.rv;
																if (rv == "0") {
																	Notification
																			.showNotification("save success");
																	win.close();
																}
															} else if (data.customException) {
																alertError(data.customException);
															}
														});
									}
								}
							} ]
						})

		win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
			id : "mailSettingsWindow",
			title : "Mail Settings",
			height : 600,
			width : 800,
			modal : true,
			autoScroll : true,
			items : [ panel ]
		});
		win.show();

	}

	var message = {};
	message.MODULE_TYPE = 'USER_SETTINGS_MODULE';
	message.COMMAND = 'COMMAND_QUERY_LIST';
	cometdfn.request(message, function(data, Conf) {
		var status = data.STATUS;
		if (status === "success") {
			var _data = data.BUSINESS_DATA.list;
			var datas = Ext.JSON.decode(_data);
			Ext.getCmp("mailSettingsPanel").getForm().setValues(datas);
		} else if (data.customException) {
			alertError(data.customException);
		}
	});
	
	var names = ["{name}","{username}","{baseuri}","{set_pwd_url}"];
	$("textarea[name='mail.rstmplRs']").atwho('$', {
	    data: names
	});
	var names = ["{name}","{username}","{baseuri}","{set_pwd_url}"];
	$("textarea[name='mail.rstmplFp']").atwho('$', {
	    data: names
	});
	var names = ["{name}","{username}","{baseuri}"];
	$("textarea[name='mail.rstmplFun']").atwho('$', {
	    data: names
	});
};

DigiCompass.sys.systemSettings = function() {
	var win = Ext.getCmp("systemSettingsWindow");
	if (!win) {

		var panel = Ext.create("Ext.form.Panel", {
			id : "systemSettingsPanel",
			bodyPadding : 5,			
			items : [ {
				// Fieldset in Column 1 - collapsible via toggle button
				xtype : 'fieldset',
				title : 'System',
				collapsible : true,
				defaultType : 'textfield',
				defaults : {
					labelWidth : 150,					
				},
				items : [ {
					fieldLabel : 'Base URI',
					name : 'base.uri',
					allowBlank : false,
					anchor : '100%'
				},{
					xtype : "textarea",
					fieldLabel : 'Welcome Message',
					name : 'base.welcome.message',
					allowBlank : false,
					anchor : '100%'
				}]
			}, {
				xtype : 'fieldset',
				title : 'User Management',
				collapsible : true,
				defaults : {
					labelWidth : 250,					
				},
				items : [ {
					fieldLabel : 'Maximum wrong password attempts',
					xtype : "textfield",
					name : 'user.allowed.login.attempts',
					allowBlank : false,
					grow : true,
					anchor : '100%'
				}, {
					fieldLabel : 'Passowrd expiry duration(day)',
					xtype : "textfield",
					name : 'user.password.expiry.duration',
					allowBlank : false,
					grow : true,
					anchor : '100%'
				}, {
					fieldLabel : 'Reset password token expiry(hour)',
					xtype : "textfield",
					name : 'user.forget.password.token.expiry',
					allowBlank : false,
					grow : true,
					anchor : '100%'
				}, {
					fieldLabel : 'New user create password token expiry(hour)',
					xtype : "textfield",
					name : 'user.newuser.create.password.token.expiry',
					allowBlank : false,
					grow : true,
					anchor : '100%'
				} ]
			}, {
				// Fieldset in Column 1 - collapsible via toggle button
				xtype : 'fieldset',
				title : 'Password Complexity',
				collapsible : true,
				defaultType : 'textfield',
				items : [{
						xtype : "checkboxfield",
						boxLabel  : 'Minimum 8 characters in length',
		                name      : 'password.require.length',
		                inputValue: true,
		                uncheckedValue : false,
		                checked   : true
					},{
						xtype : "checkboxfield",
						boxLabel  : 'Lowercase Letters',
		                name      : 'password.lowercase.letters',
		                inputValue: true,
		                uncheckedValue : false,
		                checked   : true
					},{
						xtype : "checkboxfield",
						boxLabel  : 'Uppercase Letters',
			            name      : 'password.uppercase.letters',
			            inputValue: true,
			            uncheckedValue : false,
			            checked   : true
					},{
						xtype : "checkboxfield",
						boxLabel  : 'Numbers',
			            name      : 'password.numbers',
			            inputValue: true,
			            uncheckedValue : false,
			            checked   : true
					},{
						xtype : "checkboxfield",
						boxLabel  : 'Symbols',
			            name      : 'password.symbols',
			            inputValue: true,
			            uncheckedValue : false,
			            checked   : true
				}]
			} ],
			buttons : [ {
				formBind : true, // only enabled once the form is valid
				disabled : true,
				text : "Submit",
				handler : function() {
					var form = this.up('form').getForm();
					if (form.isValid()) {
						var message = form.getValues();
						message.MODULE_TYPE = 'SYSTEM_SETTINGS_MODULE';
						message.COMMAND = 'COMETD_COMMAND_SYSTEM_SETTINGS';
						cometdfn.request(message, function(data, Conf) {
							var status = data.STATUS;
							if (status === "success") {
								var rv = data.BUSINESS_DATA.rv;
								if (rv == "0") {
									Notification
											.showNotification("save success");
									win.close();
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});
					}
				}
			} ]
		})

		win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
			id : "systemSettingsWindow",
			title : "System Settings",
			height : 600,
			width : 800,
			modal : true,
			autoScroll : true,
			layout : 'fit',
			items : [ panel ]
		});
		win.show();

	}

	var message = {};
	message.MODULE_TYPE = 'SYSTEM_SETTINGS_MODULE';
	message.COMMAND = 'COMMAND_QUERY_LIST';
	cometdfn.request(message, function(data, Conf) {
		var status = data.STATUS;
		if (status === "success") {
			var _data = data.BUSINESS_DATA.list;
			var datas = Ext.JSON.decode(_data);
			Ext.getCmp("systemSettingsPanel").getForm().setValues(datas);
		} else if (data.customException) {
			alertError(data.customException);
		}
	});
	var names = ["{baseuri}"];
	$("textarea[name='base.welcome.message']").atwho('$', {
	    data: names
	});
}