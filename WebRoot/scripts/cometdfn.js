(function() {
	cometdfn = {};
	dojo.registerModulePath("org", "../org");
	dojo.require("dojox.cometd");
	dojo.require("dojox.cometd.reload");
	dojo.addOnUnload(dojox.cometd, "reload");
	// dojo.require("dojox.cometd.ack");
	// dojo.require("dojox.cometd.timesync");
	var index = 0;
	var fnMap = {};
	cometdfn.registFn = function(fnConf) {
		fnMap[++index] = fnConf;
		return index;
	};
	cometdfn.removeListener = function(index) {
		// console.debug('remove listener:', index, fnMap[index]);
		delete fnMap[index];
	}
	var _connected = false;
	function _metaConnect(message) {
		if (dojox.cometd.isDisconnected()) {
			_connected = false;
			_connectionClosed();
			return;
		}

		var wasConnected = _connected;
		_connected = message.successful === true;
		if (!wasConnected && _connected) {
			_connectionEstablished();
		} else if (wasConnected && !_connected) {
			_connectionBroken();
		}
	}

	// Function invoked when first contacting the server and
	// when the server has lost the state of this client
	// var _extgrid = grid.getGrid();
	function _metaHandshake(handshake) {
		if (handshake.successful === true) {
			dojox.cometd.batch(function() {
				dojox.cometd.subscribe('/service/exec', function(message) {
					// 正常处理
					var fnName = message.data.MODULE_TYPE;
					var command = message.data.COMMAND;
					var fn;
					for (var i in fnMap) {
						if (fnName == fnMap[i]["MODULE_TYPE"]
								&& command == fnMap[i]["COMMAND"]) {
							fn = fnMap[i];
							try {
								if(message.data.STATUS === 'NO_PRIVILLEGE'){
									alertError("No Privillege.");
									if(message.data.meta){
										message.data._end = true;
										fn.callbackfn(message.data, fn.Conf,
												fnName, command);
									}
									throw new Error('No Privillege.');
								}
								if(message.data['_$REQUEST_ID']){
									fn.callbackfn(message.data, fn.Conf,
											fnName, command);
								}else if(message.data._confirm === 'ok'){
									return; 
								}else if (fnMap[i]["type"]
										&& message.data.type
										&& fnMap[i]["type"] == message.data.type) {
									fn.callbackfn(message.data, fn.Conf,
											fnName, command);
								} else if (!fnMap[i]["type"]
										&& !message.data.type) {
									fn.callbackfn(message.data, fn.Conf,
											fnName, command);

									// console.log(message.data);
								}
							} catch (e) {
								console.log(e, e.message, e.stack);
							}
						}
					}
				});
				// Publish on a service channel since the message is for the
				// server only
				dojox.cometd.subscribe('/service/cache/exec',
						function(message) {
							var cacheTokenId = message.data.cacheTokenId;
							if (cacheTokenId) {
								setData(window.localStorage, 'cacheTokenId',
										cacheTokenId);
							}
						});

				dojox.cometd.subscribe('/service/cache/publish', function(
								message) {
							var data = message.data;
							var objectId = data.objectId;
							var cacheData = data.cacheData;
							console.log('objectId = ' + objectId
									+ ' , cacheData = ' + cacheData);
							if (objectId && cacheData) {
								if (window.localStorage) {
									setData(window.localStorage, objectId,
											cacheData);
								}
							}
						});

				dojox.cometd.subscribe('/service/notification',
						DigiCompass.Web.app.ui.NotifactionMenu.cometdListener);

				cometdfn.publish({}, '/service/notification');
				cometdfn.publishCacheService();
			});
			// 初始化缓存
		}
	}

	// Disconnect when the page unloads
	/*
	 * unloader.addOnUnload(function() { cometd.disconnect(true); });
	 */

	// dojox.cometd.ackEnabled = true;
	// dojox.cometd.cacheEnabled = true;
	// dojox.cometd.registerExtension('cache', new CacheExtension());
	var cometURL = location.protocol + "//" + location.host
			+ config.contextPath + "/cometd";
	// dojox.cometd.configure(cometURL);
	dojox.cometd.configure({
				url : cometURL,
				maxNetworkDelay : 30 * 1000
			});
	dojox.cometd.websocketEnabled = false;
	dojox.cometd.addListener('/meta/handshake', _metaHandshake);
	dojox.cometd.addListener('/meta/connect', _metaConnect);
	dojox.cometd.addListener('/meta/unsuccessful', function(message){
		if(message.failure.httpCode == 401){
			window.location.href="/";
		}
	});
	dojox.cometd.handshake();
	cometdfn.publish = function(config, channel) {
		var config = cometdfn.createCacheArguments(config);
		dojox.cometd.publish(channel || '/service/exec', config);
	};

	cometdfn.publishCacheService = function() {
		if (window.localStorage) {
			var cacheTokenId = getData(window.localStorage, 'cacheTokenId');
			dojox.cometd.publish('/service/cache/exec', {
						cacheTokenId : cacheTokenId
					});
		}
	};

	// -------------------------- 缓存处理 Begin
	// ----------------------------------------

	function getData(storageObj, key) {
		return storageObj.getItem(key);
	}

	function setData(storageObj, key, data) {
		storageObj.setItem(key, data);
	}

	cometdfn.createCacheArguments = function(config) {
		var objectId = config.objectId;
		if (!objectId) {
			return config;
		}
		var cacheObject = getData(window.localStorage, objectId);
		if (cacheObject) {
			config.hasCacheObject = true;
		} else {
			config.hasCacheObject = false;
		}
		return config;
	}

	// -------------------------- 缓存处理 End
	// -------------------------------------------

	/**
	 * Cometd 请求/回调
	 * 
	 * @author tao.zeng
	 * @param params
	 *            参数
	 * @param callBack
	 *            回调函数
	 * @param timeoutCallBack
	 *            超时回调函数
	 * @param timeout
	 *            超时时长 默认5分钟
	 */
	cometdfn.request = function(params, callBack, timeoutCallBack, timeout,
			reloadCount) {
		reloadCount = Ext.isNumber(reloadCount) ? reloadCount : 0;
		// request唯一标识
		var requestId = Math.random() + new Date().toISOString();
		var arg = arguments;
		// 绑定监听
		var listenerIndex = cometdfn.registFn({
					MODULE_TYPE : params.MODULE_TYPE,
					COMMAND : params.COMMAND,
					_$REQUEST_ID : requestId,
					callbackfn : function(data) {
						// callBack处理
						if (data['_$REQUEST_ID'] === requestId
								&& Ext.isFunction(callBack)) {
							// 取消超时处理
							clearTimeout(t);
							if(data._confirm == 'ok'){
								return;
							}
							// 移除监听
							if (data._end) {
								cometdfn.removeListener(listenerIndex);
							}
							
							if (!params['$loaded']) {
								try {
									params['$loaded'] = true;
									callBack.call(data, data);
								} catch (e) {
									console.error(e.message, e.stack);
								}
							}
						}
					}
				});
		// console.debug('request-> add listener, index = ', listenerIndex,
		// fnMap[listenerIndex]);
		// 超时处理定时器，长时间无响应时清除监听
		var t = setTimeout(function() {
					if(fnMap[listenerIndex]){
						cometdfn.removeListener(listenerIndex);
						if (Ext.isFunction(timeoutCallBack)) {
							timeoutCallBack.apply(window, arg);
						}
						params['$reloadCount'] = params['$reloadCount'] || 0;
	
						if (params['$reloadCount'] < reloadCount
								&& !params['$loaded']) {
							params['$reloadCount']++;
							cometdfn.request.apply(window, arg);
							console.error('timeout ---> reload', params);
						}
					}
				}, timeout || cometdfn.request.timeout)

		// 绑定Request唯一标识，callback只处理一次
		params['_$REQUEST_ID'] = requestId;
		// 发送数据
		cometdfn.publish(params);
		return listenerIndex;
	}
	// 超时时长 默认5分钟
	cometdfn.request.timeout = 300000;
})();