(function() {
	Ext.namespace('Notification');
	var notification;
	var oQueue = new Queue();
	Notification.showNotification = function(message){
		if(!notification){
			var notificationConfig = {
				position: 'tl',
				cls: 'ux-notification-light',
				closable: false,
				html: message ,
				slideBackAnimation: 'bounceOut'							
			};
			notificationConfig.position = 'b';
			notification = Ext.create('widget.uxNotification', Ext.clone(notificationConfig)).show();
			function destroyFn(){
					if(!oQueue.IsEmpty()){
						var h =oQueue.DeQueue();
						notificationConfig.html =  message;
						notification = Ext.create('widget.uxNotification', notificationConfig).show();
						notification.addListener("destroy",destroyFn);
					}
					else{
						notification = null;
					}
				}
			notification.addListener("destroy",destroyFn);
		}
		else{
			oQueue.EnQueue(message);
		}
	}
})();