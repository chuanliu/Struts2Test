Ext.define('DigiCompass.Web.app.AutosizeWindow', {
    extend: 'Ext.window.Window',
    
    constructor: function(cfg){
    	var me = this,
			w = screen.width,
			h = screen.height,
			maxWidth = '90%',
			maxHeight = '80%',
			defaultWidth = '60%',
			defaultHeight = '70%',
			width,
			height;
		
		if(cfg.width){
			width = cfg.width;
			width = width+'';
			if(width.indexOf('%')>0){
				if(parseFloat(width) > parseFloat(maxWidth)){
					width = maxWidth;
				}
			}else{
				if(parseInt(width) > (parseFloat(maxWidth)/100)*w){
					width = (parseFloat(maxWidth))/100 * w;
				}
			}
		}else{
			width = defaultWidth;
		}
		
		if(cfg.height){
			height = cfg.height;
			height = height+'';
			if(height.indexOf('%')>0){
				if(parseFloat(height) > parseFloat(maxHeight)){
					height = maxHeight;
				}
			}else{
				if(parseInt(height) > (parseFloat(maxHeight)/100)*h){
					height = (parseFloat(maxHeight)/100) * h;
				}
			}
		}else{
			height = defaultHeight;
		}
		
		width = width+'';
		height = height+'';
		if(width.indexOf('%') < 0) width = parseInt(width);
		if(height.indexOf('%') < 0) height = parseInt(height);
		
		cfg.resizable = true;
		cfg.width = width;
		cfg.height = height;
		cfg.autoScroll = true;
		cfg.constrainHeader = true;
		me.callParent(arguments);
    }
});
