(function() {
    Ext.ns("DigiCompass.Web.app");

    function SiteType() {

        this.showObjExp = function() {
            var self = this;
            var objExpPanel = Ext.getCmp("obj-exp");
            if (objExpPanel) {
                // 移除组建
                objExpPanel.removeAll();
            }

            var objectExplorer = Ext.create('DigiCompass.Web.app.grid.ObjectExplorer', {
                store: {
                    buffered: true,
                    pageSize: 100,
                    autoLoad: true,
                    proxy: {
                        type: 'cometd.mutigroup',
                        moduleType: "SITE_TYPE",
                        modules: {
                            read: {
                                command: 'COMMAND_QUERY_LIST'
                            }
                        },
                        extraParams: {},
                        afterRequest: function(response, result) {

                        }
                    }
                },
                listeners: {
                    itemclick: function(grid, record, item,
                        index, event, eOpts) {
                        var isChecked = DigiCompass.Web.TreeUtil
                            .isCheckChange(event);
                        if (isChecked) {
                            return;
                        }
                        if (Ext.isEmpty(record.data.id)) {
                            return;
                        }

                        Ext.getCmp('obj-details').removeAll();
                        DigiCompass.Web.UI.Wheel.showDetail();

                        self.showDetailPanel(record.data);
                    }
                }
            });

            objectExplorer.target.addDocked(Ext
                .create(
                    'Ext.toolbar.Toolbar', {
                        width: 200,
                        items: [{							
							xtype : 'button',
							text : 'New',
							iconCls : 'icon-add',
							handler : function() {											
								self.showDetailPanel();
							}							
                        },{
                            xtype: 'button',
                            text: 'Delete',
                            iconCls: 'icon-delete',
                            handler: function() {
                                var sm = objectExplorer.target.getSelectionModel();
                                var records = sm.getSelection();
                                var ids = new Array();
                                if (records.length == 0) {
                                    Ext.Msg
                                        .alert('Warning',
                                            'Please select a record!');
                                } else {
                                    for (var i = 0; i < records.length; i++) {
                                        ids.push(records[i].get("id"));
                                    }
                                    alertOkorCancel(
                                        'Are you sure to delete selected site type?',
                                        function(e) {
                                            if (e == 'yes') {
                                                var message = {};
                                                message.ids = ids;
                                                message.MODULE_TYPE = 'SITE_TYPE';
                                                message.COMMAND = 'COMMAND_DEL';
                                                cometdfn
                                                    .request(
                                                        message,
                                                        function(
                                                            data,
                                                            Conf) {
                                                            var status = data.STATUS;
                                                            if (status === "success") {
                                                                Ext
                                                                    .getCmp(
                                                                        'obj-details')
                                                                    .removeAll();
                                                                objectExplorer.reload();
                                                                alertSuccess('Delete Data Successful!');
                                                            } else if (data.customException) {
                                                                alertError(data.customException);
                                                            }
                                                        });
                                            }
                                        });
                                }
                            }
                        }]
                    }));

            objExpPanel.add(objectExplorer);

            this.objectExplorer = objectExplorer;
        }

        
    this.showDetailPanel = function(obj) {

        var objExp = this;

        var objDetailPanel = Ext.getCmp('obj-details');
        if (objDetailPanel) {
            // 移除组建
            objDetailPanel.removeAll();
        }
        // 展示右边面板
        DigiCompass.Web.UI.Wheel.showDetail();
        var detailPanel = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        });
        var version = "";
        var obj_id = "";
        var tname = "Site Type";
        var ptitle = "Object Detail - " + tname;
        if (obj) {
            version = obj.name;
            obj_id = obj.id;
            ptitle = ptitle + "(" + version + ")";
        }
        var ReversalPanel = new DigiCompass.Web.app.ReversalPanel({
            panelTitle: ptitle,
            height: 700,
            front: detailPanel,
            back: new DigiCompass.Web.app.VersionForm({
                qrCode: obj_id
            })
        });
        objDetailPanel.add(ReversalPanel);
        obj = Ext.clone(obj);
        if (objExp.detailPanelAddComponent) {
            objExp.detailPanelAddComponent.apply(objExp, [detailPanel, obj]);
        }
    }

    this.detailPanelAddComponent = function(detailPanel, obj) {
    	var self = this;
        var formPanel = Ext.create('Ext.form.Panel', {
            bodyStyle: 'padding:15px',
            border: 0,
            items: [{
                xtype: "hidden",
                name: "id"
            }, {
                fieldLabel: 'Name',
                xtype: "textfield",
                name: 'name',
                allowBlank: false
            }, {
                xtype: "textarea",
                fieldLabel: 'Description',
                name: 'description'
            }],
            tbar: [{
                text: 'Save',
                iconCls: 'icon-save',
                handler: function() {
                    var formPanel = this.up('form');
                    var form = formPanel.getForm();
                    if (form.isValid()) {
                        var vals = form.getValues();
                        var message = {};
                        message.MODULE_TYPE = 'SITE_TYPE';
                        message.COMMAND = "COMMAND_SAVE";
                        message.id = vals.id;
                        message.name = vals.name;
                        message.description = vals.description;
                        cometdfn.request(message, function(message, Conf) {
                            var status = message.STATUS;
                            if (status === "success") {
                                self.objectExplorer.reload();
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
            }]
        });
        
        if(obj){
			formPanel.getForm().setValues(obj);			
		}
		detailPanel.add(formPanel);
    }
    }
    DigiCompass.Web.app.SiteType = SiteType;
})();
