Ext.define('DigiCompass.web.UI.ComboBox', {
	extend : 'Ext.form.field.ComboBox',
	_$id : null,
	_cometdRegisterIndex : null,
	timeout : 11000,
	reconnectCount : 10,
	statics : {
		publish : function(moduleType, command, param, id){
			cometdfn.publish({
				MODULE_TYPE : moduleType,
				COMMAND : command,
				PARAMETERS :param,
				$id : id
			});
		}
	},
	config : {
		moduleType : 'MOD_DICTIONARY_TABLE',
		moduleCommand : 'MOD_DICTIONARY_TABLE',
		tableName : null,
		whereColumn : null,
		whereValue : null,
		autoLoadByCometd : true,
		parameter : {}
	},
	displayField : 'name',
	valueField : 'id',
	editable : false,
	emptyText : 'please select an item.',
	constructor : function(config) {
		this._$id = Math.random() + new Date().getTime()+"";
		this.initConfig(config);
		if(!config.store){
			this.bindStore(new Ext.data.ArrayStore({
				fields : [ this.valueField, this.displayField ],
				data : config.data ? config.data : []
			}));
		}
		this.superclass.constructor.call(this, config);
		this._initForCometd();
		if (this.autoLoadByCometd) {
			this.loadByCometd();
		}
	},
	parseData : function(message){
		if(message['BUSINESS_DATA'] || !message['BUSINESS_DATA']['data']){
			return message['BUSINESS_DATA']['data'];
		}
		return null;
	},
	_initForCometd : function() {
		var _self = this;
		this._cometdRegisterIndex = cometdfn.registFn({
			MODULE_TYPE : _self.moduleType,
			COMMAND : _self.moduleCommand,
			callbackfn : function(message) {
				var param = message['PARAMETERS'], data;
				var isLoad = true;
				if(message.$id !== _self._$id){
					if((param['TABLE_NAME'] || null) !== _self.tableName){ 
						isLoad = false;
					}else if((param['WHERE_COLUMN'] || null) !== _self.whereColumn){ 
						isLoad = false;
					}else if((param['WHERE_VALUE'] || null) !== _self.whereValue){
						isLoad = false;
					}
					
					for(var key in _self.parameter){
						if(param[key] !== _self.parameter[key]){
							isLoad = false;
							break;
						}
					}
				}
				
				if(isLoad){
					if(!(data = _self.parseData(message))){
						console.error('refresh comboBox fail: ', message, ". config: ", _self.config);
					}else{
						data = Ext.isString(data) ? Ext.JSON.decode(data) : data;
						_self._onCallback.call(_self, data);
						console.log('refresh comboBox:',message);
					}
				}
			}
		});
	},
	_onCallback : function(data) {
		if (!this.store) {
			this.bindStore(new Ext.data.ArrayStore({
				fields : [ this.valueField, this.displayField ],
				data : data
			}));
		} else {
			this.bindStore(new Ext.data.ArrayStore({
				fields : [ this.valueField, this.displayField ],
				data : data
			}));
//			this.store.loadData(data);
		}
		this.setValue(this.getValue());
	},
	loadByCometd : function(whereValue) {
		if (this.whereColumn) {
			this.whereValue = whereValue || this.whereValue || '-1';
		}
		console.log('publish...', this.config);
		var param = {
			TABLE_NAME : this.tableName,
			WHERE_COLUMN : this.whereColumn,
			WHERE_VALUE : this.whereValue
		};
		if(this.parameter){
			for(var key in this.parameter){
				param[key] = this.parameter[key];
			}
		}
		//DigiCompass.web.UI.ComboBox.publish(this.moduleType, this.moduleCommand, param, this._$id);
		
		cometdfn.request({
			MODULE_TYPE : this.moduleType,
			COMMAND : this.moduleCommand,
			PARAMETERS :param,
			$id : this._$id
		}, Ext.emptyFn, Ext.emptyFn, this.timeout, this.reconnectCount);
	},
	destroy : function(){
		this.callParent();
		if(this._cometdRegisterIndex){
			cometdfn.removeListener(this._cometdRegisterIndex);
		}
	}

});