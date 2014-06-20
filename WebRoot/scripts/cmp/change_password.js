(function() {
	Ext.ns("DigiCompass.password");
	DigiCompass.password.changePassword = function(closable) {
		var changePwdWin = Ext.getCmp("changePasswordWindow");
		if (changePwdWin) {
			changePwdWin.show();
			return;
		}
		Ext.apply(Ext.form.VTypes, {
			repetition : function(val, field) {
				if (field.repetition) {
					var cmp = Ext.getCmp(field.repetition.targetCmpId);
					if (Ext.isEmpty(cmp)) {
						return false;
					}
					if (val == cmp.getValue()) {
						return true;
					} else {
						return false;
					}
				}
			},
			repetitionText : 're-enter password not same'
		});

		var panel = Ext.create("Ext.form.Panel", {
			height : 300,
			bodyPadding : 5,
			items : [ {
				id : "oldPassword",
				fieldLabel : 'Old Password',
				xtype : 'textfield',
				inputType : 'password',
				name : 'oldPassword',
				allowBlank : false
			}, {
				id : "newPassword",
				fieldLabel : 'New Password',
				xtype : 'ux.passwordmeterfield',
				name : 'newPassword',
				allowBlank : false
			}, {
				id : "reEnPassword",
				fieldLabel : 'Re-enter Password',
				name : 'reEnPassword',
				xtype : 'textfield',
				inputType : 'password',
				allowBlank : false,
				vtype : "repetition",
				repetition : {
					targetCmpId : 'newPassword'
				}
			} ],
			buttons : [ {
				formBind : true, // only enabled once the form is valid
				disabled : true,
				text : "Continue",
				handler : function() {					
					var form = this.up('form').getForm();
					if (form.isValid()) {
						var message = form.getValues();						
						message.MODULE_TYPE = 'USER_MANAGE_MODULE';
						message.COMMAND = 'COMETD_COMMAND_MODIFY_PASSWORD';
						cometdfn.request(message, function(data, Conf) {
							var status = data.STATUS;
							if (status === "success") {
								mustChangePassword = "";
								credentialsExpired = "";
								var rv = data.BUSINESS_DATA.rv;
								if(rv == 3){
									Notification.showNotification("cannot change password");
								} else if(rv == "2"){
									Notification.showNotification("old password not correct");
								}else if(rv == "1"){
									Notification.showNotification("user not login");
								}else if(rv == "0"){
									Notification.showNotification("modify password success");
									win.close();
								}
							} else if (data.customException) {
								alertError(data.customException);
							}
						});
					}
				}
			} ]
		});
		var win = Ext.create("DigiCompass.Web.app.AutosizeWindow", {
			id : "changePasswordWindow",
			height : 330,
			width : 520,
			closable : closable,
			modal : true,
			items : [ panel ]
		});
		win.show();
	}
})();