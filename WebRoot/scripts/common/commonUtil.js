var copyProperties = function(source, target, properties){
	return moveProperties(source, target, properties, false);
};
var moveProperties = function(source, target, properties, del){
	if(Ext.isString(properties)){
		if(source[properties] !== undefined && source[properties] !== null){
			target[properties] = source[properties];
			if(del !== false){
				delete source[properties];
			}
		}
	}else if(Ext.isArray(properties)){
		for(var i=0; i<properties.length; i++){
			moveProperties(source, target, properties[i], del);
		}
	}
};
function alertWarring(msg) {
	Notification.showNotification(msg);
	
//	Ext.MessageBox.show({
//		title : "Message",
//		msg : msg,
//		width : 250,
//		buttons : Ext.MessageBox.OK,
//		icon : Ext.MessageBox.WARNING
//	});
}

function alertInformation(msg) {
	Notification.showNotification(msg);
//	Ext.MessageBox.show({
//		title : "Message",
//		msg : msg,
//		width : 250,
//		buttons : Ext.MessageBox.OK,
//		icon : Ext.MessageBox.INFO
//	});
}
function alertSuccess(msg){
	Notification.showNotification(msg);
//	Ext.MessageBox.show({
//		title : "Message",
//		//msg : '<font style="color:green">'+msg+'</font>',
//		msg : msg,
//		width : 250,
//		buttons : Ext.MessageBox.OK,
//		icon : Ext.MessageBox.INFO
//	});
}

var downloadURL = function(url) {
    var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
};

function downloadFile(url, postData){
	var hiddenIFrameID = 'hiddenDownloader',
    iframe = document.getElementById(hiddenIFrameID);
	if (iframe === null) {
	    iframe = document.createElement('iframe');
	    iframe.id = hiddenIFrameID;
	    iframe.style.display = 'none';
	    document.body.appendChild(iframe);
	}
	
    var hiddenPostFormID = 'hiddenPostForm',
        form = document.getElementById(hiddenPostFormID);
    if (form === null) {
    	form = document.createElement('form');
    	form.id = hiddenPostFormID;
    	form.style.display = 'none';
    	form.target = "hiddenDownloader";
    	form.method = "POST";
    	form.action = url;
        document.body.appendChild(form);
    } else {
    	form.innerHTML = "";
    }
    if(postData){
    	for(var key in postData){
    		createEl(form, key, postData[key])
    	}
    }
    
    form.submit();
}

function createEl(form, name, value){
	var inputEl = document.createElement("input");
	inputEl.name = name;
	inputEl.value = value;
	inputEl.type = "hidden";
	form.appendChild(inputEl);
}

function alertError(msg) {
	Notification.showNotification(msg);
//	Ext.MessageBox.show({
//		title : "Message",
//		//msg : '<font style="color:red">'+msg+'</font>',
//		msg : msg,
//		width : 250,
//		buttons : Ext.MessageBox.OK,
//		icon : Ext.MessageBox.ERROR
//	});
}

function alertOkorCancel(msg, fn){
	Ext.MessageBox.show({
        title: 'Message',
        msg: msg,
        width : 250,
        buttons: Ext.MessageBox.YESNO,
        fn: fn,
        icon : Ext.MessageBox.QUESTION
    });
}

function promptDialog(title, msg, fn, scope, target, validator){
	Ext.MessageBox.prompt({
	    title: title,
	    scope: scope || window,
	    msg: msg,
	    buttons: Ext.MessageBox.OKCANCEL,
	    prompt : true,
	    fn: Ext.isFunction(validator) ? function(ok, text){
	    	if(ok === 'ok'){
		    	if(validator(text)){
		    		fn.apply(this, arguments);
		    	}else{
		    		promptDialog(title, msg, fn, scope, target, validator);
		    	}
	    	}
	    } : fn,
	    animateTarget: target || undefined
	});
}
promptTextAreaDialog = function(title, val, callback, readOnly, reg, allowBlank){
	var form = Ext.widget({
        xtype: 'form',
        frame: false,
        layout:'fit',
        border: false,
        items: [{
            xtype: 'textareafield',
            name: 'content',
            readOnly : readOnly,
            vtype : 'reg',
            reg : reg,
            fieldLabel: '',
            allowBlank: allowBlank !== false,
            msgTarget: 'side',
            value: val === 'N/A' ? '' : val
        }]
    });
	var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
		layout: 'fit',
        modal: true,
        width: 300,
        height: 250,
        padding : '0',
        title : title,
        closeAction: 'destroy',
        items: [form],
        maximizable : true,
        buttons: [{
            text: 'Commit',
            hidden : readOnly,
            handler: function() {
        		if(!form.getForm().isValid()){
        			return;
        		}
        		var content = form.getForm().getValues().content;
        		if(content != val && Ext.isFunction(callback)){
        			if(callback(content)!==false){
        				win.close();
        			}
        		}else{
        			win.close();
        		}
            }
        },{
            text: readOnly ? 'Close' : 'Cancel',
            handler: function() {
                win.close();
            }
        }]
	});
	win.show();
	return win;
}
function promptDateDialog(title, msg, fn, scope, target, validator){
	var win;
	var form = Ext.create('Ext.form.Panel', {
		anchor : '100% 70%',
    	frame : false,
    	items : [{
    	    margin :'5 50',
        	xtype: 'datefield',
        	allowBlank : false,
        	align:'center',
    		emptyText  : 'Please input date!',
    		format : 'Y-m-d',
    		name 	   : 'date'
    	}],
    	buttons:[{
    	    xtype:'button',
    	    text : 'OK',
    	    handler:function(){
    	        var date = form.getForm().getValues().date;
    	    	if(Ext.isFunction(validator)){
    	    		if(validator(date )){
    		    		fn.apply(this, ['ok', date ]);
    		    		win.close();
    		    	}
    	    	}else{
    	    		fn.apply(this, ['ok', date]);
		    		win.close();
    	    	}
    	    }
    	},{
    	    xtype:'button',
    	    text : 'Cancel',
    	    handler : function(){
	    		fn.apply(this, ['no', form.getForm().getValues().date]);
	    		win.close();
    	    }
    	}]
	});
	win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
		title : title,
		width:300,
		height:120,
		layout:'anchor',
		items:[{
			anchor : '100% 30%',
            xtype: 'component',
            html: msg,
            style: 'margin: 5px;'
        },form]
	});
	win.show();
}

ServerMessageProcess = function(message, successMsg, failMsg){
	  if(message.STATUS === 'error'){
		  alertError(message.customException || message.error.SYSTEM_ERROR)
	  }else if(message.BUSINESS_DATA && message.BUSINESS_DATA.successful === false){
//		  alertSuccess(successMsg || message.BUSINESS_DATA.message || 'Operation is successful.');
//		  return true;
		  alertError(failMsg || message.BUSINESS_DATA.message || 'Operation is fail.');
	  }else{
		  return true; 
	  }
	  return false;
}
DigiCompass.Web.app.checkResult = function(front, message, successMsg, failMsg){
	if(ServerMessageProcess(message, successMsg, failMsg)){
		return true;
	}else if(message.ERROR_CODE && (message.ERROR_CODE === 1001 || message.ERROR_CODE === 1002) && front.toBack){
		front.toBack();
	}
	return false;
}

var getBasePath = function(){
	return location.protocol + "//" + location.host + config.contextPath + "/";
}
DigiCompass.Web.app.validateCellEditor = function(cell, cellEditor){
    var errors = cellEditor.field.getErrors();
    var isValid = Ext.isEmpty(errors);
    DigiCompass.Web.app.cellValidateStyle(cell, isValid,errors.join('<br/>'));
	return isValid;
}
DigiCompass.Web.app.cellValidateStyle = function(cell,isValid, error){
	if(!isValid){
		cell.removeCls('grid-dirty-cell');
		cell.removeCls("cmp-grid-success-cell");							    		   
		cell.addCls("cmp-grid-error-cell");		
		cell.set({'data-errorqtip': error||''});
	}else{
		cell.removeCls('grid-dirty-cell');
		cell.removeCls("cmp-grid-error-cell");
	   	cell.addCls("cmp-grid-success-cell");
	   	cell.set({'data-errorqtip': ''});
	}
}

Ext.define('DigiCompass.Web.app.ReversalPanel',{
	extend : 'Ext.panel.Panel',
	cls : 'reversalPanel',
	width : '100%',
	border : false,
	collapsible : false,
	preventHeader: true,
	frame : false,
	layout: 'fit',
	style: 'background:transparent;',
	bodyStyle:'background: transparent;border:none;',
	//margins : '5 0 5 5',
	config : {
		front : null,
		back : null,
		panelTitle : null,
		showNavigation : false,
		canTurnover : true,
		_frontPanel : null,
		_backPanel : null,
		_toolbars : null,
		_oldHeight : 300
	},
	constructor : function(config) {
		var me = this;
		this.initConfig(config);
		this.superclass.constructor.call(this, config);
		this._toolbars = {};
		
		this.title = config.panelTitle || config.title || '';
		this._frontPanel = Ext.create('Ext.panel.Panel',{
			title : me.title,
			collapsible : true,
			layout: 'fit',
			cls : 'front',
			listeners:{
				beforecollapse : function(p,direction,animate,eOpts){
					/*var oldHeight = p.ownerCt.getHeight();
					p.ownerCt._oldHeight = oldHeight;
					p.ownerCt.setHeight(20);
					*/
					me.superclass.collapse.call(me);
					return false;
				},
				beforeexpand : function(p,animate,eOpts){
					//p.ownerCt.setHeight(p.ownerCt._oldHeight);
					me.superclass.expand.call(me);
					return false;
				}
			}
		});
		this.addListener('afterlayout', function(){
			if(this.header)
			this.header.hide();
		});
		this._backPanel = new Ext.panel.Panel({
			title : me.title,
			collapsible : true,
			layout: 'fit',
			cls : 'back',
			listeners:{
				beforecollapse : function(p,direction,animate,eOpts){
					me.superclass.collapse.call(me);
					return false;
				},
				beforeexpand : function(p,animate,eOpts){
					me.superclass.expand.call(me);
					return false;
				}
			}
		});
		
		this.addToolBar('navigation', Ext.create('Ext.toolbar.Toolbar', {
			width:'100%',
		    items: []
		}));
		
		this.add(this._backPanel);
		this.add(this._frontPanel);
		this._frontPanel.addListener('afterrender', this._initTitleSwitchStyleFunc, this);
		this._backPanel.addListener('afterrender', this._initTitleSwitchStyleFunc, this);
		if(this.front){
			this.initFront(this.front);
		}
		if(this.back){
			this.initBack(this.back);
		}
		if(!this.showNavigation){
			this.hiddenBar('navigation');
		}
//		this.normalModel()
	},
	addToolBar : function(key, tbar, target){
		if(!target){
			var copyItems = [];
			for(var key in tbar.items.items){
				var item = tbar.items.items[key];
				var copyItem = item.cloneConfig();
				if(item.getXType() === 'button'){
					copyItem.brothers = [item];
					item.brothers = [copyItem];
				}
				copyItems.push(copyItem);
			}
			var copyTbar = Ext.create('Ext.toolbar.Toolbar', {
				width:'100%',
			    items: copyItems
			});
			this._toolbars[key] = {
					tbar : tbar,
					tbar2 : copyTbar
			}
			tbar.brothers = [copyTbar];
			copyTbar.brothers = [tbar];
			this._frontPanel.addDocked(tbar);
			this._backPanel.addDocked(copyTbar);
		}else if(target instanceof Ext.toolbar.Toolbar){
			target.add(tbar);
		}else if(Ext.isString(target)){
			tbar.reversalPanel = this;
			var tg = this.getToolBar(target);
			tg.tbar.add(tbar);
			tg.tbar2.add(tbar);
		}else{
			console.error('error target!', target);
		}
	},
	setNavigation : function(path){
		var target = this._toolbars['navigation'];
		target.tbar.removeAll();
		target.tbar2.removeAll();
		target.tbar.add(path);
		target.tbar2.add(path);
	},
	getNavigation : function(){
		var t = this._toolbars['navigation'].tbar;
		for(var i = 0; i<t.items.getCount(); i++){
			var item = t.items.getAt(i);
			return item.text;
		}
		return null;
	},
	reSetSize : function(width, height){
		this.setWidth(width);
		this.setHeight(height);
		this._checkChildSize(this._frontPanel, width, height);
		this._checkChildSize(this._backPanel, width, height);
		if(this.front){
			this._checkChildSize(this.front, width, height);
		}
		if(this.back){
			this._checkChildSize(this.back, width, height);
		}
	},
	getToolBar : function(key){
		return this._toolbars[key];
	},
	hiddenBar : function(key){
		var target = this._toolbars[key];
		target.tbar.hide();
		target.tbar2.hide();
	},
	showBar : function(key){
		var target = this._toolbars[key];
		target.tbar.show();
		target.tbar2.show();
	},
	setTitle : function(title){
		if(this.getTitle().indexOf('Object Detail - ') >-1 && title.indexOf('Object Detail - ') === -1){
			title = 'Object Detail - ' + title;
		}
		this.callParent([title]);
		this._frontPanel.setTitle(title);
		this._backPanel.setTitle(title);
	},
	drallModel : function(title){
		this.showBar('navigation');
		this._normalTitle = this.getTitle();
		if(title.indexOf('Object Detail - ') === -1){
			this.setTitle('Object Detail - ' +title);
		}
	},
	getTitle : function(){
		return this._frontPanel.title;
	},
	normalModel : function(){
		this.hiddenBar('navigation');
		var title = this.getTitle().replace('Object Detail - ', '');
		this._frontPanel.setTitle(title);
		this._backPanel.setTitle(title);
	},
	_initTitleSwitchStyleFunc : function(own){
		if(!this.canTurnover){
			return ;
		}
		if(own.header){
			own.header.addListener('dblclick', this.toggle, this);
			own.header.addCls('pointer');
		}
	},
	initComponent : function(){
		this.callParent();
	},
	initFront : function(front){
//		this._checkChildSize(front, this.width, this.height - 50);
		this._checkChildSize(front, this.width, this.height - 50);
		front.reversalPanel = this;
		front.toBack = this._getToggleEvent(true);
		this._frontPanel.add(front);
		this.front = front;
		if(this.front.toolBar){
			this.addToolBar("frontBar", this.front.toolBar);
		}
	},
	initBack : function(back){
//		this._checkChildSize(back, this.width, this.height - 50);
		this._checkChildSize(back, this.width, this.height - 50);
		back.reversalPanel = this;
		back.toFront = this._getToggleEvent(false);
		this._backPanel.add(back);
		this.back = back;
		if(this.back.toolBar){
			this.addToolBar("backBar", this.back.toolBar);
		}
	},
	toFront : function(){
		if(!this.front){
			return;
		}
		this.removeCls('flip');
//		var _self = this;
//		for(var key in _self._toolbars){
//			_self._frontPanel.addDocked(_self._toolbars[key]);
//		}
		if(Ext.isFunction(this.back.onToggle)){
			this.back.onToggle();
		}
	},
	toBack : function(){
		if(!this.back){
			return;
		}
		this.addCls('flip');
//		var _self = this;
//		for(var key in _self._toolbars){
//			_self._backPanel.addDocked(_self._toolbars[key]);
//		}
		if(Ext.isFunction(this.front.onToggle)){
			this.front.onToggle();
		}
	},
	toggle : function(){
		if(this.isBack()){
			this.toFront();
		}else{
			this.toBack();
		}
	}, 
	isFront : function(){
		return !this.isBack();
	},
	isBack : function(){
		return this.hasCls('flip');
	},
	_checkChildSize : function(child, width, height){
		child.setWidth(width || this.width);
		child.setHeight(height || this.height);
	},
	_getToggleEvent : function(toBack){
		var _self = this;
		return function(){
			return toBack ? _self.toBack(arguments) : _self.toFront(arguments);
		}
	}, 
	destory : function(){
		for(var key in this._toolbars){
			this._toolbars[key].tbar.destory();
			this._toolbars[key].tbar2.destory();
		}
		this._toolbars = null;
		if(this.front){
			this.front.destory();
			this.font = null;
		}
		if(this.back){
			this.back.destory();
			this.back = null;
		}
		this._frontPanel.destory();
		this._backPanel.destory();
		this.callParent();
	}
});




Ext.define('DigiCompass.Web.app.VersionForm',{
	extend : 'Ext.form.Panel',
	border : false,
	collapsible : false,
	frame : false,
	width : '100%',
	layout : 'column',
	codeWidth : 180,
	codeHeight : 180,
	fieldDefaults : {
		labelAlign : 'right',
		msgTarget : 'side',
		labelWidth : 110
	},
	_saveBtnId : null,
	_save : false,
	_saveListener : null,
	bodyStyle: 'padding:5px;background-color:#fff;',
	buttonAlign : 'left',
	config:{
		qrCode : null,
		edit : true
	},
	onToggle : function(){
		this.cancelSave();
	},
	doSave : function(callback, scope){
		this._save = true;
		this._saveListener.listener = callback;
		this._saveListener.scope = scope;
	},
	cancelSave : function(){
		this._save = false;
		this._saveListener.listener = null;
		this._saveListener.scope = null;
	},
	constructor : function(config) {
		this.initConfig(config);
		this._saveListener = {
			listener : null,
			scope : null
		}
		
		var _saveBtnId = 'VERSION_FORM_SAVE_BTN_'+(Math.random()*1000);
		this._saveBtnId = _saveBtnId;
		var leftItems = [];
		if(this.edit){
			leftItems.push({
				xtype:"textfield",
				name : "versionName",
				allowBlank: false,
				fieldLabel : 'Version Name:',
				width : 400,
				maxLength : UiProperties.nameMaxLength
			});
		}
		leftItems.push({
			xtype:"textfield", 
			name : "versionId",
			fieldLabel : 'UUID:',
			readOnly : true,
			width : 400
		});
		if(this.edit){
			leftItems.push({
				xtype: 'textareafield',
				name : "comment",
				fieldLabel : "Comment",
				allowBlank: true,
				height:90,
				width : 400,
				maxLength : UiProperties.descMaxLength
			});
		}
		this.items =  [{
				columnWidth:.5,
				layout:'anchor',
				border:false,
				items:leftItems
			},this._codeImageFieldConfig()
		];
		this.superclass.constructor.apply(this, arguments);
	},
	getData : function(){
		return this.getForm().getValues();
	},
	isValid : function(){
		return this.getForm().isValid();
	},
	setValues : function(vals){
		this.getForm().setValues(vals);
		this.loadQrCode(vals.versionId);
	},
	_qrCodeId : null,
	_getQrCodeUrl : function(){
			return getBasePath()+'qrCode?code='+(this.qrCode || '')+'&width='+this.codeWidth+'&height='+this.codeHeight;;
	},
	_codeImageFieldConfig : function(){
		var _self = this;
		_self._qrCodeId = 'QR_CODE_'+Math.random();
		return {
//			columnWidth:.5,
			xtype: 'box',
			id : _self._qrCodeId,
			hideLabel:false,
			fieldLabel: 'Two-Dimensional Code:',
			autoEl : { 
				width:_self.codeWidth,
				height:_self.codeHeight,
				visible : !Ext.isEmpty(_self.qrCode),
				tag : 'img', 
				src : _self._getQrCodeUrl(),  
				style : 'filter:progid:dximagetransform.microsoft.alphaimageloader(sizingmethod=scale);position:absolute;right:-27px;top:-27px;'
			}
		}
	},
	loadQrCode : function(qrCode){
		var qrCodeBox = Ext.getCmp(this._qrCodeId);
		if(Ext.isEmpty(qrCode)){
			qrCodeBox.hide();
			return;
		}
		if(qrCode === this.qrCode){
	        return;
	    }
		this.qrCode = qrCode;
		try{
			qrCodeBox.getEl().dom.src = this._getQrCodeUrl();
			qrCodeBox.show();
		}catch(e){
			var _self = this;
			setTimeout(function(){
				qrCodeBox.getEl().dom.src = _self._getQrCodeUrl();
				qrCodeBox.show();
			},1000);
		}
		qrCodeBox.show();
	}
});




Ext.define('DigiCompass.Web.app.ObjectGrid',{
	extend : 'Ext.grid.Panel',
	width : '100%',
	border : false,
	collapsible : false,
	frame : false,
	viewConfig : {
		stripeRows : true
	},
	config:{
		tableName : null,
		defaultTitle : null,
		idPrefix : null,
		scenarioId : null,
		versionId : null,
		technologyId : null,
		siteGroupId : null,
		planningCycleId : null,
		siteGroupPlannedId : null,
		dragVersionId : null,
		versionName : null,
		moduleType : null,
		moduleCommand : null,
		dragModuleCommand : null,
		loadDataListener : function(data, msg){
			this.getStore().loadData(Ext.decode(data));
		},
		edit : false,
		cellEditor : true,
		onNew : null,
		onSave : null,
		onSaveAs : null,
		onDelete : null,
		onRemoveVersion : null
	},
	editing : null,
	isDrag : false,
	reversalPanel : null,
	_cometdListenerIndex : [],
	_concatArgs : function(ary, args){
		if(!Ext.isArray(ary)){
			ary = [ary];
		}
		for(var i=0; i<args.length ; i++){
			ary.push(args[i]);
		}
		return ary;
	},
	constructor : function(config) {
		this.initConfig(config);
		this.registerComtedListener();
		
		if(!this.features){
			this.features =  Ext.create('Ext.grid.feature.MultiGroupingSummary',{
				baseWidth:50,
		        groupHeaderTpl: '{disName}'
		      });
		}
		var _self = this;
		var tbar = [];
		if(Ext.isFunction(this.onNew)){
			tbar.push({
				text : 'New',
				handler : function() {
					var grid = _self;
					var versionForm = grid.reversalPanel.back;
					if(versionForm instanceof DigiCompass.Web.app.VersionForm){
						grid.onNew.apply(grid, grid._concatArgs(versionForm.getForm().getValues(), arguments));
					}else{
						grid.onNew.apply(grid, grid._concatArgs({}, arguments));
					}
				}
			});
		}
		
		if(Ext.isFunction(this.onSave)){
			tbar.push({
				text : 'Save',
				handler : function() {
					var grid = _self;
					if(grid.editing){
						var store = grid.getStore();
						var isValid = true;
						for(var rowIdx =0; rowIdx< store.getCount(); rowIdx++){
							for(var colIdx =0; colIdx< grid.columns.length; colIdx++){
								var cell = grid.getView().getCellByPosition({row:rowIdx, column:colIdx });
								
								//TODO
								/*if(!Ext.isBoolean(cell.isValid)){
									var cellEditor = grid.editing.getEditor(store.getAt(rowIdx), grid.columns[colIdx]);
									cell.isValid = DigiCompass.Web.app.validateCellEditor(cell, cellEditor);
								}*/
								if(cell.isValid === false){
									isValid = false;
								}
							}
						}
						if(!isValid){
							return;
						}
					}
					var versionForm = grid.reversalPanel.back;
					var result = false;
					if(versionForm instanceof DigiCompass.Web.app.VersionForm){
						if(versionForm.isValid()){
							grid.onSave.apply(grid, grid._concatArgs(versionForm.getForm().getValues(), arguments));
						}else if(grid.reversalPanel.isFront()){
							grid.toBack();
						}
					}else{
						grid.onSave.apply(grid, grid._concatArgs({}, arguments));
					}
					if(result){
						
					}
					
				}
			});
		}
		
		if(Ext.isFunction(this.onSaveAs)){
			tbar.push({
				text : 'Save As',
				handler : function() {
					var grid = _self;
					if(grid.editing){
						var store = grid.getStore();
						var isValid = true;
						for(var rowIdx =0; rowIdx< store.getCount(); rowIdx++){
							for(var colIdx =0; colIdx< grid.columns.length; colIdx++){
								var cell = grid.getView().getCellByPosition({row:rowIdx, column:colIdx });
								//TODO
								/*if(!Ext.isBoolean(cell.isValid)){
									var cellEditor = grid.editing.getEditor(store.getAt(rowIdx), grid.columns[colIdx]);
									cell.isValid = DigiCompass.Web.app.validateCellEditor(cell, cellEditor);
								}*/
								if(cell.isValid===false){
									isValid = false;
								}
							}
						}
						if(!isValid){
							return;
						}
					}
					var versionForm = grid.reversalPanel.back;
					if(versionForm instanceof DigiCompass.Web.app.VersionForm){
						if(versionForm.isValid()){
							grid.onSaveAs.apply(grid, grid._concatArgs(versionForm.getForm().getValues(), arguments));
						}else if(grid.reversalPanel.isFront()){
							grid.toBack();
						}
					}else{
						grid.onSaveAs.apply(grid, grid._concatArgs({}, arguments));
					}
				}
			});
		}
		
		if(Ext.isFunction(this.onDelete)){
			tbar.push({
				text : 'Delete',
				handler : function() {
					var grid = _self;
					var editor = grid.getPlugin();
					var sm = grid.getSelectionModel();
					var selection = sm.getSelection();
					if(selection.length == 0){
						alertSuccess('Plase select a record.');
						return;
					}
					if(editor){
						editor.cancelEdit();
					}
					var result;
					var versionForm = grid.reversalPanel.back;
					if(versionForm instanceof DigiCompass.Web.app.VersionForm){
						result = grid.onDelete.apply(grid, grid._concatArgs(versionForm.getForm().getValues(), arguments));
					}else{
						result = grid.onDelete.apply(grid, grid._concatArgs({}, arguments));
					}
					if(result!=false){
						grid.store.remove(selection[0]);
					}
				}
			});
		}
		
		if(Ext.isFunction(this.onRemoveVersion)){
			tbar.push({
				text : 'Remove',
				handler : function() {
					var grid = _self;
					if(grid.isDrag || !grid.versionId){
						alertError('You have not saved the version information, and can not be removed.');
						return ;
					}
					alertOkorCancel('Are you sure to remove this grid?',function(e){
						if(e==='yes'){
							var versionForm = grid.reversalPanel.back;
							if(versionForm instanceof DigiCompass.Web.app.VersionForm){
								grid.onRemoveVersion.apply(grid, grid._concatArgs(versionForm.getForm().getValues(), arguments));
							}else{
								grid.onRemoveVersion.apply(grid, grid._concatArgs({}, arguments));
							}
						}
					});
				}
			});
		}
		tbar.push({
			xtype : 'button',
			text : 'Reset',
			handler : function(){
				var grid = _self;
				grid.dragVersionId = null;
				grid.versionName = null;
				grid.refresh(grid.versionId, null);
			}
		});
//		if(this.tableName){
//			tbar.push({
//				xtype : 'button',
//				text : 'Versions',
//				handler : function(){
//					var grid = this.getBubbleParent().getBubbleParent();
//			    	DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(grid.tableName, grid.getParam());
//				}
//			});
//		}
		tbar.push({
			xtype : 'button',
			text : 'refresh',
			handler : function(){
				var grid = _self;
				grid.refresh(grid.versionId, grid.versionName);
			}
		});
		tbar.push({
			xtype : 'button',
			text:'Clear Grouping',
            handler : function(a,b,c,d) {
            	var grid = _self;
            	grid.features[0].cleanGrouping();
			}
		})
		tbar.push({
			text : 'Export',
			handler : function() {
				var grid = _self;
				var data = {    			
    					MODULE_TYPE : grid.moduleType,    				
						versionId: grid.versionId,
						planningCycleId: grid.planningCycleId,
						siteGroupPlannedId: grid.siteGroupPlannedId,
						technologyId: grid.technologyId,
						siteGroupId: grid.siteGroupId,
						scenarioId:grid.scenarioId,
						title : grid.defaultTitle
	            	};
	            var str = context.param(data);
	            window.location.href = "download?"+str;
			}
		});	
		if(!this.edit){
			tbar.push({
				xtype : 'button',
				text : 'Edit',
				handler : function(){
					var grid = _self;
					var mainTab = Ext.getCmp('outerTabPanelId'+grid.scenarioId);
			    	if(mainTab){
			    		mainTab.obj = {
			    				tableName : grid.tableName,
								scenarioId : grid.scenarioId,
								versionId : grid.versionId,
								planningCycleId : grid.planningCycleId,
								siteGroupId : grid.siteGroupId,
								technologyId : grid.technologyId,
								siteGroupPlannedId : grid.siteGroupPlannedId,
								dragVersionId : grid.dragVersionId
			    		}
			    		mainTab.removeAll(false);
			    		var oldReversePanel = Ext.getCmp(grid.reversalPanel.id);
			    		if(oldReversePanel){
			    			/**
			    			 * args:{objId:'1',type:'scenario',uuid:'1',swapPanel:'xxxId'}
			    			 */
			    			var args = {};
			    			args.objId = grid.scenarioId;
			    			args.type = grid.reversalPanel.getTitle();
			    			args.uuid = '';
			    			args.swapPanel = grid.reversalPanel.id;
			    			args.parentId = oldReversePanel.ownerCt.id;
			    			args.itemIndex = oldReversePanel.ownerCt.items.indexOf(oldReversePanel);
			    			args.eventBtnId = this.getId();
			    			
			    			DigiCompass.Web.app.navigationBar.setNavigationBar(args);
			    			var naviBarPath = DigiCompass.Web.app.navigationBar.generateNavigationBarPath(grid.scenarioId);
			    			oldReversePanel.setNavigation(naviBarPath);
			    			oldReversePanel.drallModel(grid.reversalPanel.getTitle());
			    			
			    			mainTab.add(oldReversePanel);
			    			oldReversePanel.setPosition(0,0);
			    			oldReversePanel.reSetSize(mainTab.getWidth()-10,mainTab.getHeight()-10);
			    			DigiCompass.Web.UI.CometdPublish.getVersionDataPublish(grid.tableName, grid.getParam(), false);
			    			this.hide();
			    			if(this.brothers){
			    				for(var key in this.brothers){
			    					this.brothers[key].hide();
			    				}
			    			}
			    		}
			    	}
			    	
				}
			});
		}
		this.toolBar = Ext.create('Ext.toolbar.Toolbar', {
			width:'100%',
		    items: this.tbar ? tbar.concat(this.tbar) : tbar
		});
		this.tbar = null;
		if(!this.plugins){
			this.plugins = [];
		}
		if(this.cellEditor){
			this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
				autoCancel : false,
				listeners : {
					'afteredit' : function(me, obj){
						var cell = obj.grid.getView().getCellByPosition({row:obj.rowIdx, column:obj.colIdx });
						var cellEditor = this.getEditor(obj.record, obj.column);
						cell.isValid = DigiCompass.Web.app.validateCellEditor(cell, cellEditor);
					},
					'beforeedit' : function(me, obj){
						var cell = obj.grid.getView().getCellByPosition({row:obj.rowIdx, column:obj.colIdx });
						var cellEditor = this.getEditor(obj.record, obj.column);
						cellEditor.field.setValue(obj.value);
						cell.isValid = DigiCompass.Web.app.validateCellEditor(cell, cellEditor);
					}
				}
			});
			this.plugins.push(this.editing);
		}
		this.superclass.constructor.apply(this, arguments);
	},
	initComponent: function(){
		this.callParent();
		this.loadData();
	},
	destory : function(){
		console.debug('grid destory:'+this.id);
		for(var i in this._cometdListenerIndex){
			cometdfn.removeListener(this._cometdListenerIndex[i]);
		}
		this._cometdListenerIndex = [];
		if(this.reversalPanel){
			this.reversalPanel.destory();
		}
		this.callParent();
	},
	isFirst : true,
	init : function(){
		var title = this.defaultTitle, oldTitle;
		oldTitle = this.reversalPanel.getTitle()
		if(oldTitle===title){
			oldTitle = null; 
		}
		if(this.versionName || this.versionId){
			title = title + ' ('+(this.versionName || ' ')+')'
		}
		if(this.reversalPanel){
			if(this.edit && title.indexOf('Object Detail - ') === -1){
				this.reversalPanel.setTitle('Object Detail - '+title);
			}else{
				this.reversalPanel.setTitle(title);
			}
			var navigation = this.reversalPanel.getNavigation();
			var nav = null;
			if(navigation){
				var tmp = navigation.split(DigiCompass.Web.app.navigationBar.SEPERATOR);
				if(tmp>0){
					tmp[tmp.length-1] = title;
					nav = tmp.join(DigiCompass.Web.app.navigationBar.SEPERATOR);
				}
			}
			if(this.isFirst){
				this.isFirst = false;
				this.reversalPanel.setNavigation(nav || title);
			}else if(oldTitle){
				this.reversalPanel.setNavigation(this.reversalPanel.getNavigation().replace(oldTitle.replace('Object Detail - ',''), title));
			}
		}else{
			this.setTitle(title);
		}
		this.isDrag = !Ext.isEmpty(this.dragVersionId);
	},
	loadData : function(config){
		if(config){
			for(var key in config){
				if(key in this ){
					if(key === 'versionId' && this.versionId){
						continue;
					}
					this[key] = config[key];
				}
			}
			this.init();
		}
		cometdfn.publish({
			MODULE_TYPE : this.moduleType,
			COMMAND : this.isDrag ? this.dragModuleCommand : this.moduleCommand ,
			scenarioId : this.scenarioId,
			versionId : this.versionId,
			technologyId : this.technologyId,
			siteGroupId : this.siteGroupId,
			dragVersionId : this.dragVersionId,
			planningCycleId : this.planningCycleId,
			siteGroupPlannedId : this.siteGroupPlannedId,
			versionName : this.versionName
		});
	},
	getParam : function(){
		return {
			scenarioId : this.scenarioId,
			versionId : this.versionId,
			technologyId : this.technologyId,
			siteGroupId : this.siteGroupId,
			dragVersionId : this.dragVersionId,
			planningCycleId : this.planningCycleId,
			siteGroupPlannedId : this.siteGroupPlannedId,
			versionName : this.versionName
		}
	},
	rendenerProperss : function(msg){
		var _self = this;
		if(msg.scenarioId == _self.scenarioId
				&& msg.versionId == _self.versionId
				&& msg.technologyId == _self.technologyId
				&& msg.siteGroupId == _self.siteGroupId
				&& msg.planningCycleId == _self.planningCycleId
				&& msg.siteGroupPlannedId == _self.siteGroupPlannedId
				&& msg.dragVersionId == _self.dragVersionId	
				&& Ext.isFunction(_self.loadDataListener)){
			var data = msg['BUSINESS_DATA'];
			if(data){
				_self.versionName = data.versionName || msg.versionName;
				_self.init();
				if(_self.reversalPanel){
					_self.reversalPanel.toFront();
				}
				_self.loadDataListener.apply(_self, [data, msg]);
			}
		}
	},
	registerComtedListener : function(){
		var _self = this;
		this._cometdListenerIndex.push(cometdfn.registFn({
			MODULE_TYPE : _self.moduleType,
			COMMAND : _self.moduleCommand,
			callbackfn : function(msg){
				_self.rendenerProperss(msg);
			}
		}));
		if(this.dragModuleCommand){
			this._cometdListenerIndex.push(cometdfn.registFn({
				MODULE_TYPE : _self.moduleType,
				COMMAND : _self.dragModuleCommand,
				callbackfn : function(msg){
					_self.rendenerProperss(msg);
				}
			}));
		}
	},
	refresh:function(versionId, versionName){
		if(Ext.isString(versionId)){
			this.loadData({
				versionId : versionId,
				versionName : versionName,
				dragVersoinId : null
			});
		}else if(Ext.isSimpleObject(config)){
			this.loadData(versionId);
		}else{
			this.loadData();
		}
	},
	removeVersion : function(){
		this.versionId = null;
		this.versionName = null;
		this.loadData({
			versionId : null,
			versionName : null,
			dragVersoinId : null
		});
	}
});


function recursiveTree(node){
	node.iconCls = 'drag';
	node.checked = false;
	if(node.children && node.children.length > 0){
		for(var i=0; i<node.children.length; i++){
			recursiveTree(node.children[i]);
		}
		node.leaf = false;
	}else{
		node.leaf = true;
	}
}

Ext.define('DigiCompass.Web.app.VersionView',{
	extend : 'Ext.panel.Panel',
	collapsible : false,
    frame : false,
//	height : 705,
	resizable: false,
	layout:'fit',
	config : {
		treeNode : null,
		tableName : null,
		versionId : null,
		scenarioId:null,
		technologyId:null,
		siteGroupId:null,
		planningCycleId:null,
		siteGroupPlannedId:null,
		selections : null,
		search  : null,
		viewListeners : null,
		queryType : 'LIST'
	},
	_bak : null,
	_tmp : null,
	_cometdListenerIndex : null,
	constructor : function(config) {
		this.selections = [];
		this.initConfig(config);
		this.superclass.constructor.apply(this, arguments);
	},
	onInitVersionView : null,
	initComponent : function(){
		var _self = this;
		this.callParent();
		this._bak = {};
		this._cometdListenerIndex = [];
		this.registerComtedListener();
		this.addDocked(Ext.create('Ext.toolbar.Toolbar',{
			width:200,
			items:['Search: ', ' ',Ext.create('Ext.ux.form.BtnSearchField',{
				width:150,
				onTrigger2Click : function(){
					var searchField = this,
					value = searchField.getValue();
					searchField.showCancelBtn();
					var param = {
						tableName : _self.tableName,
						versionId : _self.versionId,
						scenarioId : _self.scenarioId,
						technologyId : _self.technologyId,
						planningCycleId : _self.planningCycleId,
						siteGroupId : _self.siteGroupId,
						siteGroupPlannedId : _self.siteGroupPlannedId,
						name : value,
						search : true,
						queryType : _self.queryType
					}
					_self.loadData(param, function(){
						_self.showView(param);
					});
				}
			})]
		}));
	},
	loadData : function(config, callback){
		this.loadedCallback = callback;
		if(!config.load && config.tableName in this._bak && Ext.isEmpty(config.name)){
			
			var bak = this._bak[config.tableName];
			this.tableName = config.tableName;
			this.treeNode = bak.tree;
			this.versionId = config.versionId;
			this.scenarioId = config.scenarioId;
			this.technologyId = config.technologyId || bak.technologyId;
			this.planningCycleId = config.planningCycleId || bak.planningCycleId;
			this.siteGroupId = config.siteGroupId || bak.siteGroupId;
			this.siteGroupPlannedId = config.siteGroupPlannedId || bak.siteGroupPlannedId;
			this.search = null;
			this.queryType = config.queryType;
			 
			if(Ext.isFunction(this.loadedCallback)){
				this.loadedCallback.call(this);
				this.loadedCallback = null;
			}
			return;
		}
		cometdfn.publish({
			MODULE_TYPE : 'MOD_VERSION_MANAGER',
			COMMAND : 'COMMAND_QUERY_ALL_TREE',
			tableName : config.tableName || this.tableName,
			name : config.name || null,
			scenarioId : config.scenarioId,
			technologyId : config.technologyId,
			planningCycleId : config.planningCycleId,
			siteGroupPlannedId : config.siteGroupPlannedId,
			siteGroupId : config.siteGroupId,
			versionId : config.versionId,
			queryType : config.queryType || 'LIST'
		});
	},
	registerComtedListener : function(){
		var _self = this;
		this._cometdListenerIndex.push(cometdfn.registFn({
			MODULE_TYPE : 'MOD_VERSION_MANAGER',
			COMMAND : 'COMMAND_QUERY_ALL_TREE',
			callbackfn : function(data){
//				var tree = Ext.decode(data.BUSINESS_DATA.data);
//				if(Ext.isEmpty(data.name)){
//					_self._bak[data.tableName] = {
//						tree : tree,
//						scenarioId : data.scenarioId,
//						technologyId : data.technologyId,
//						planningCycleId : data.planningCycleId,
//						siteGroupId : data.siteGroupId,
//						siteGroupPlannedId : data.siteGroupPlannedId
//					};
//				}else{
//					_self.tmp = {
//							tableName : data.tableName,
//							tree : tree,
//							scenarioId : data.scenarioId,
//							technologyId : data.technologyId,
//							planningCycleId : data.planningCycleId,
//							siteGroupId : data.siteGroupId,
//							siteGroupPlannedId : data.siteGroupPlannedId,
//							search : data.name
//					}
//				}
//				if(Ext.isFunction(_self.loadedCallback)){
//					_self.loadedCallback.call(_self);
//					_self.loadedCallback=null;
//				}
				var tree = Ext.decode(data.BUSINESS_DATA.data);
				if(!_self.search){
					_self._bak[data.tableName] = {
						tree : tree,
						scenarioId : data.scenarioId,
						technologyId : data.technologyId,
						planningCycleId : data.planningCycleId,
						siteGroupId : data.siteGroupId,
						siteGroupPlannedId : data.siteGroupPlannedId,
						queryType : data.queryType
					};
				}
				_self.tableName = data.tableName;
				_self.treeNode = tree;
				_self.versionId = data.versionId;
				_self.scenarioId = data.scenarioId;
				_self.technologyId = data.technologyId;
				_self.planningCycleId = data.planningCycleId;
				_self.siteGroupPlannedId = data.siteGroupPlannedId;
				_self.siteGroupId = data.siteGroupId;
				_self.search = data.name;
				if(Ext.isFunction(_self.loadedCallback)){
					_self.loadedCallback.call(_self);
					_self.loadedCallback=null;
				}
			}
		}));
	},
    destroy : function(){
    	for(var i in this._cometdListenerIndex){
			cometdfn.removeListener(this._cometdListenerIndex[i]);
		}
    	if(this.versionView)
    		this.versionView.destroy();
    	this.callParent();
    },
    checkedAllFunc:function(e,self,id){
		var me = Ext.getCmp(id),
		rootNode = me.getRootNode();
		if(self.checked){
			rootNode.cascadeBy(function(n){
				n.set('checked',true);
				n.commit();
			})
		}
		else{
			rootNode.cascadeBy(function(n){
				n.set('checked',false);
				n.commit();
			})
		}
		e = e || window.event;
		e.stopPropagation();
	},
	showView : function(config){
//		if(config){
//			var tmp;
//			if(!config.name){
//				tmp = this._bak[config.tableName];
//			}else if(this.tmp && this.tmp.search === config.name){
//				tmp = this.tmp;
//			}else{
//				return;
//			}
//			this.tableName = config.tableName;
//			this.treeNode = tmp.tree;
//			this.versionId = config.versionId;
//			this.scenarioId = config.scenarioId;
//			this.technologyId = config.technologyId || tmp.technologyId;
//			this.planningCycleId = config.planningCycleId || tmp.planningCycleId;
//			this.siteGroupId = config.siteGroupId || tmp.siteGroupId;
//			this.siteGroupPlannedId = config.siteGroupPlannedId || tmp.siteGroupPlannedId;
//			this.search = tmp.search;
//		}
		var root = {children : [], checked : false, versionName:'Root',expanded:true, iconCls : 'not_drag'};
		var cls = {};
		var id = Ext.id();
		var columns;				
		if(this.tableName === 'PLANNED_SITE'){
			root.children = this.treeNode;
			recursiveTree(root);
			columns = [{
	       	 	xtype: 'treecolumn',
	            text: '<input type="checkbox" id='+checkedAllId+'  onclick="DigiCompass.Web.TreeUtil.checkedAllFunc(event,this,\''+id+'\')">&nbsp;'+ this.getVersionTitle(this.tableName),
	            flex: 2,
				width : 150,
	            dataIndex: 'version'
	        }];
		}else{
			this._fillTree(root, this.treeNode, cls)
			columns = [{
	       	 	xtype: 'treecolumn',
	            text: '<input type="checkbox" id='+checkedAllId+'  onclick="DigiCompass.Web.TreeUtil.checkedAllFunc(event,this,\''+id+'\')">&nbsp;'+ this.getVersionTitle(this.tableName),
	            flex: 2,
				width : 150,
	            dataIndex: 'versionName'
	        }];
			for(var key in cls){
				columns.push({
					flex: 1,
					text: key,
					width : 100,
					dataIndex : cls[key]
				});
			}
		}
		if(this.versionView){
//			if(this.versionView.tableName !== this.tableName || this.search || config.search){
				var rootNode = this.versionView.getRootNode();
				rootNode.removeAll();
				for(var key in root.children){
					rootNode.appendChild(root.children[key]);
				}
				this.versionView.tableName = this.tableName;
//			} 
		}else{
			var store;
			if(this.tableName === 'PLANNED_SITE'){
				store = Ext.create('Ext.data.TreeStore',{
					fields : ['id', 'name', 'address', 'reference', 'country',
								'description', 'latitude', 'longitude', 'properties', 'state',
								'streetName', 'streetNo', 'suburb', 'technology', 'version', 'comment', 'postal_code'],
					root: root
				});
			}else{
				store = Ext.create('Ext.data.TreeStore',{
					fields : ['id','current','versionId','versionName','technologyId','technologyName','siteGroupId',
					         'siteGroupName','planningCycleId','planningCycleName','siteGroupPlannedId','siteGroupPlannedName','tableName','canDrag','reference'],
					root: root
				});
			}
			var _self = this;
			this.versionView = Ext.create('Ext.tree.Panel', {
				id : id,
		        collapsible: false,
		        frame : false,
		        border : false,
//				width:'fit',
//				height:600,
		        useArrows: false,
//		        height : 647,
		        rootVisible: false,
		        store: store,
		        multiSelect: false,
		        columns: columns,
		        viewConfig : {
					 plugins: {
		                  ptype: 'treeviewdragdrop',
		                  enableDrag: true,
		                  enableDrop: false,
		                  dragGroup: 'gridDDGroup'
		            }
				},listeners : {
					checkchange : function(node, checked) {      
						DigiCompass.Web.TreeUtil.checkchild(node,checked);  
						DigiCompass.Web.TreeUtil.checkparent(node);  
				    }
				}
			});
			if(Ext.isFunction(this.onInitVersionView)){
				this.onInitVersionView.call(this,null);
			}
			this.versionView.parentPanel = this;
			this.add(this.versionView);
			this.versionView.tableName = this.tableName;
		}
		this.show();
		if(this.versionId){
			this.selections.push(this.versionId);
		}
		for(var i=0; i<this.selections.length;i++){
			DigiCompass.Web.TreeUtil.findAndExpandNode(this.versionView.getRootNode(), this.selections[i], 'versionId');
		}
	},
	_fillTree : function(target, nodes, cls){
		var _do = false;
		for(var i=0;i<nodes.length;i++){
			var node = nodes[i]
			var data = nodes[i].data;
			var canDrag = true;
			var leaf = false;
			var child = {};
			if(this.getTableName() !== 'SCENARIO' && data && !(
					(data.PlanningCycle ? data.PlanningCycle.id == this.planningCycleId : true)
					&& (data.SiteGroup ? data.SiteGroup.id == this.siteGroupId : true)
					&& (data.Technology ? data.Technology.id == this.technologyId : true)
					&& (data.SiteGroupPlanned ? data.SiteGroupPlanned.id=this.siteGroupPlannedId : true))){
				canDrag = false;
			}
			
			if (data.deleted){
				canDrag = false;
			}
			
			if(node.children && node.children.length>0){
				if(!this._fillTree(child, node.children, cls)){
					continue;
				}
			}else{
				if(!canDrag){
					continue;
				}
				leaf = true;
			}
			_do = true;
			child.id = child.versionId = node.dataId;
			child.versionName = node.text;
			child.sortable = true;
			child.tableName = this.getTableName();
			child.current = (this.versionId ? this.versionId==node.dataId : false);
			child.checked = false;
			child.canDrag = canDrag;
			child.leaf = leaf;
			
			child.iconCls = child.canDrag ? 'drag' : 'not_drag';
			if (data.deleted) {
				child.iconCls = 'deletedVersion';
			}
			
			if(data){
				if(data.Technology){
					child.technologyName = data.Technology.name;
					child.technologyId = data.Technology.id;
					cls.Technology = "technologyName";
				}
				if(data.SiteGroup){
					child.siteGroupName = data.SiteGroup.name;
					child.siteGroupId = data.SiteGroup.id;
					cls.State = "siteGroupName";
				}
				if(data.PlanningCycle){
					child.planningCycleName = data.PlanningCycle.name;
					child.planningCycleId = data.PlanningCycle.id;
					cls.PlanningCycle = "planningCycleName";
				}
				if(data.SiteGroupPlanned){
					child.siteGroupPlannedName = data.SiteGroupPlanned.name;
					child.siteGroupPlannedId = data.SiteGroupPlanned.id;
					cls.SiteGroupPlanned = "siteGroupPlannedName";
				}
			}
			if(!target.children){
				target.children = [];
			}
			target.children.push(child);
		}
		return _do;
	},
	_fillGrid : function(target, node, cls){
		var row = {id : node.dataId,versionId : node.dataId, versionName : node.text, sortable : true};
		row.tableName = this.getTableName();
		row.current = (this.versionId ? this.versionId==row.id : false);
		if(node.data){
			row.deleted = node.data.deleted;
			
			if(node.data.Technology){
				row.technologyName = node.data.Technology.name;
				row.technologyId = node.data.Technology.id;
				cls.Technology = "technologyName";
			}
			if(node.data.SiteGroup){
				row.siteGroupName = node.data.SiteGroup.name;
				row.siteGroupId = node.data.SiteGroup.id;
				cls.State = "siteGroupName";
			}
			if(node.data.PlanningCycle){
				row.planningCycleName = node.data.PlanningCycle.name;
				row.planningCycleId = node.data.PlanningCycle.id;
				cls.PlanningCycle = "planningCycleName";
			}
			if(data.SiteGroupPlanned){
				child.siteGroupPlannedName = data.SiteGroupPlanned.name;
				child.siteGroupPlannedId = data.SiteGroupPlanned.id;
				cls.SiteGroupPlanned = "siteGroupPlannedName";
			}
		}
		if(this.getTableName() == 'SCENARIO' || ( (row.planningCycleId ? row.planningCycleId == this.planningCycleId : true)
				&& (row.siteGroupId ? row.siteGroupId == this.siteGroupId : true)
				&& (row.technologyId ? row.technologyId == this.technologyId : true)
				&& (data.SiteGroupPlanned ? data.SiteGroupPlanned.id=this.siteGroupPlannedId : true))){
			row.canDrag = true;
		}else{
			row.canDrag = false;
		}
		if(node.children && node.children.length){
			for(var i = 0; i<node.children.length; i++){
				this._fillGrid(target, node.children[i], cls);
			}
		}
		if(row.current || row.canDrag){
			if(!row.deleted){
				target.push(row);
			}
		}
	},
	toGrid : function(config){
//		if(config && (this.tableName !== config.tableName || config.name || config.search)){
//			var tmp;
//			if(!config.name){
//				tmp = this._bak[config.tableName];
//			}else if(this.tmp && this.tmp.search === config.name){
//				tmp = this.tmp;
//			}else{
//				return {};
//			}
//			this.tableName = config.tableName;
//			this.treeNode = tmp.tree;
//			this.versionId = config.versionId;
//			this.scenarioId = config.scenarioId;
//			this.technologyId = config.technologyId || tmp.technologyId;
//			this.planningCycleId = config.planningCycleId || tmp.planningCycleId;
//			this.siteGroupId = config.siteGroupId || tmp.siteGroupId;
//			this.siteGroupPlannedId = config.siteGroupPlannedId || tmp.siteGroupPlannedId;
//			this.search = tmp.search;
//		}
		var data = [];
		var cls = {};
		for(var i=0; i<this.treeNode.length; i++){
			this._fillGrid(data, this.treeNode[i], cls);
		}
		var columns = [{
             text: this.getVersionTitle(this.tableName),
             flex: 2,
             dataIndex: 'versionName'
        }];
		for(var key in cls){
			columns.push({
				flex: 1,
				text: key,
				dataIndex : cls[key]
			});
		}
		return {
			data : data,
			columns : columns,
			fields : ['id','current','versionId','versionName','technologyId','technologyName','siteGroupId',
				         'siteGroupName','planningCycleId','planningCycleName','tableName','canDrag','reference']
		}
	},
	getVersionTitle : function(tableName){
		if(!tableName) tableName = this.tableName;
		if(!tableName || tableName === 'SCENARIO' && (tableName in DigiCompass.Web.app.ScenarioObjectUtil.map)){
			var temp = DigiCompass.Web.app.ScenarioObjectUtil.map[tableName];
			if (temp) {
				return temp.name;
			} else {
				return '';
			}
//			return DigiCompass.Web.app.ScenarioObjectUtil.map[tableName].name;
		}else{
			return 'Object';
		}
	}
});
Ext.namespace('DigiCompass.Web.app.ScenarioObjectUtil');
DigiCompass.Web.app.ScenarioObjectUtil.getGrid = function(arg){
	var tableName = arg.tableName || 'SCENARIO';
	if(tableName === 'SCENARIO') return;
	
	if(tableName === 'TB_STG_COST_BAND_UPGRADE'){
		Digicompass.web.cmp.cost.bandUpgrade.refresh(arg);
	}else if(tableName === 'TB_STG_COST_CAPACITY_BUILD'){
		Digicompass.web.cmp.cost.costCapacityBuild.refresh(arg);
	}else if(tableName === 'TB_STG_COST_COVERAGE_BUILD'){
		Digicompass.web.cmp.cost.costCoverageBuild.refresh(arg, true);
	}else if(tableName === 'TB_STG_COST_COVERAGE_UNPLANNED_BUILD'){
		Digicompass.web.cmp.cost.costCoverageBuild.refresh(arg, false);
	}else if(tableName === 'TB_STG_LAYER_DEFINITION'){
		Digicompass.web.cmp.layer.LayerDefainition.refreshLayerDefinitionGrid(arg);
	}else if(tableName === 'TB_STG_LAYER_PRIORITY'){
		Digicompass.web.cmp.layer.RegionLayer.refresh(arg);
	}else{
		var obj = DigiCompass.Web.app.ScenarioObjectUtil.map[tableName];
		DigiCompass.Web.app.assembleGrid.refreshGrid(obj.moduleType, 
				(obj.command.dragGrid && arg.dragVersionId) ? obj.command.dragGrid : obj.command.grid,
				arg);
	}
}
DigiCompass.Web.app.ScenarioObjectUtil.getTitle = function(tableName){
	var obj = DigiCompass.Web.app.ScenarioObjectUtil.map[tableName];
	return obj ? obj.title : '';
}
DigiCompass.Web.app.ScenarioObjectUtil.map = {
		'SCENARIO' : {
			moduleType : '',
			command : {
			},
			name : 'Scenario',
			title : ''
		},
		TB_STG_DATA_QTY : {
			moduleType : 'MOD_SUBSCRIBER_QUANTITY',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'Subscriber',
			title : 'Subscriber Quantity'
		},
		TB_STG_DATA_BH_KBPS : {
			moduleType : 'MOD_DEMAND_BHKBPS',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'BH kbps',
			title : 'BH Kbps per Subscriber'
		},
		TB_STG_DATA_BH_MERL : {
			moduleType : 'MOD_DEMAND_BHMERL',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'BH mErl',
			title : 'BH mErl per Subscriber'
		},
		TB_STG_SPEC_REGION_DIST : {
			moduleType : 'MOD_DEMAND_SPEC_REGION_DIST',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'SpecRegion',
			title : 'Spectrum Region Demand Distribution'
		},
		TB_STG_REGION_PROP : {
			moduleType : 'MOD_DEMAND_REGION',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'Region',
			title : 'Region Properties'
		},
		TB_STG_GLBOAL_PRO : {
			moduleType : 'MOD_DEMAND_GLOBAL',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'Global',
			title : 'Global Properties'
		},
		TB_STG_ACCE_OFFLOAD : {
			moduleType : 'MOD_DEMAND_WEB_ACCELERATOR_OFFLOAD',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'Offload',
			title : 'Web Accelerator Offload'
		},
		TB_STG_COV_SITE_BUILD_QTY : {
			moduleType : 'MOD_TRAFFIC_DEMAND_CALC',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'Calc',
			title : 'CMP - Strategic Model Calculations'
		},
		TB_STG_COVERAGE_REGION_PROP : {
			moduleType : 'MOD_COVERAGE_BUILD_REGION_PROPERTIES',
			command : {
				grid : 'COMMAND_QUERY_GRID',
				dragGrid : 'COMMAND_QUERY_DRAG_GRID'
			},
			name : 'CoverageRegion',
			title : 'Region Properties'
		},
		TB_STG_COST_BAND_UPGRADE : {
			moduleType : '',
			name : 'BandUpgrade',
			title : 'Cost Band Upgrade'
		},
		TB_STG_COST_CAPACITY_BUILD : {
			moduleType : '',
			name : 'Capacity',
			title : 'Cost Capacity Build'
		},
		TB_STG_COST_COVERAGE_BUILD : {
			moduleType : '',
			name : 'Coverage',
			title : 'Cost Coverage Build(planned)'
		},
		TB_STG_COST_COVERAGE_UNPLANNED_BUILD : {
			moduleType : '',
			name : 'Coverage',
			title : 'Cost Coverage Build(unplanned)'
		},
		TB_STG_LAYER_DEFINITION : {
			moduleType : '',
			name : 'LayerDefinition',
			title : 'Layer Definition'
		},
		TB_STG_LAYER_PRIORITY : {
			moduleType : '',
			name : 'LayerPriority',
			title : 'Region Layer Priority'
		},
		TRAFFIC_SITELOAD_CALCULATING_PERIOD : {
			moduleType : 'TRAFFIC_SITELOAD_CALCULATING_PERIOD',
			command : {
				grid : 'COMMAND_QUERY_GRID'
			},
			name : 'TrafficSiteLoadCalculatingPeriod',
			title : 'TrafficSiteLoadCalculatingPeriod'
		}
}

