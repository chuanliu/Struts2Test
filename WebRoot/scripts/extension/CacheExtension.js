var CacheExtension = function() {
	var _cometd;
	var _serverSupportsCaches = false;
	var _cacheId = -1;

	function _debug(text, args) {
		_cometd._debug(text, args);
	}

	this.registered = function(name, cometd) {
		_cometd = cometd;
		_debug('CacheExtension: executing registration callback');
	};

	this.unregistered = function() {
		_debug('CacheExtension: executing unregistration callback');
		_cometd = null;
	};

	this.incoming = function(message) {
		var channel = message.channel;
		if (channel == '/meta/handshake') {
			_serverSupportsCaches = message.ext && message.ext.cache;
			_debug('CacheExtension: server supports caches', _serverSupportsCaches);
		} else if (_serverSupportsCaches && channel == '/meta/connect'
				&& message.successful) {
			var ext = message.ext;
			if (ext && typeof ext.cache === 'number') {
				_cacheId = ext.cache;
				_debug('CacheExtension: server sent cache id', _cacheId);
			}
		}
		return message;
	};

	this.outgoing = function(message) {
		var channel = message.channel;
		if (channel == '/meta/handshake') {
			if (!message.ext) {
				message.ext = {};
			}
			message.ext.cache = _cometd && _cometd.cacheEnabled !== false;
			_cacheId = -1;
		} else if (_serverSupportsCaches && channel == '/meta/connect') {
			if (!message.ext) {
				message.ext = {};
			}
			message.ext.cache = _cacheId;
			_debug('CacheExtension: client sending cache id', _cacheId);
		}
		return message;
	};
};