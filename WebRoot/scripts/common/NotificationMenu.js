Ext.define('DigiCompass.Web.app.ui.NotifactionMenu', {
    extend: 'Ext.util.Observable',
    statics : {
    	cometdListener : function(message){
    		try{
        		if(!DigiCompass.Web.app.ui.NotifactionMenu.notification){
        			if(!document.body){
        				setTimeout(function(){
        					DigiCompass.Web.app.ui.NotifactionMenu.cometdListener(message);
        				}, 100);
        				return;
        			}
        			DigiCompass.Web.app.ui.NotifactionMenu.notification = new DigiCompass.Web.app.ui.NotifactionMenu({
        				title : 'Notification',
        				tooltip : 'Custom tooltip',
        				iconCls : 'icon-lightbox'
        			});
        		}
        		console.log('notification---------->', message)
        		DigiCompass.Web.app.ui.NotifactionMenu.notification.addJob(Ext.JSON.decode(message.data));
    		}catch(e){
    			console.log(e.message, e.stack);
    		}
    	}
    },
    config : {
    	title : null,
        tooltip : null,
        iconCls : 'notifactionmenu-icon',
        itemCls : 'notifactionmenu-item',
        renderTo : null,
        region : 'right',
        collapsedWidth : 38,
        hoverWidth : 43,
        itemWidth : 300,
        itemHeight  : 40,
        bodyMinHeight : 50,
        bodyMaxHeight : null
    },
    content : null,
    headerCls : 'notifactionmenu-item-header',
    bodyCls : 'notifactionmenu-item-body',
    showCls : 'notifactionmenu-show',
    currentAnimated : null,
    _addListeners : function(){
    	var me = this;
//    	me.addListener('hover', function(scope, target){
////    		scope.clearJump();
//    		scope.expand(target);
//    	}, me);
//    	
//    	me.addListener('hoverleave', function(scope, target){
//    		scope.collapse(target);
//    	}, me)
    	me.addListener('headerclick', function(scope, target){
    		if(this.isExpand()){
    			this.collapse();
    		}else{
    			this.expand();
    		}
    	}, me)
    },
    clearAnimated : function(){
    	var me = this;
    	if(me.currentAnimated && me.currentAnimated.anim && me.currentAnimated.anim.isAnimated()){
    		me.currentAnimated.anim.stop();
    	}
    	me.currentAnimated = null;
    },
    _getAnimatedOption : function(callback){
    	var me = this;
    	me.clearAnimated();
    	me.currentAnimated = {
    		duration : 500,
    		callback : callback,
    		scope : me
    	}
    	return me.currentAnimated;
    },
    expandHeader : function(callback){
    	var me = this, 
	    	target = me.el, 
	    	header = me.getHeader(),
	    	x = 0;
    	if(me.region === 'right'){
    		x = Ext.Element.getViewWidth() - me.itemWidth;
    	}
//        var current = this.el.child('.'+this.showCls);
//        if (current) {
//            current.setX(this.collapsedWidth - this.itemWidth, {
//                duration : 800
//            });
//        }
    	target.stopAnimation();
    	header.stopAnimation();
        target.setX(x, me._getAnimatedOption(callback));
        target.addCls('.' + me.showCls);
        header.setStyle('border-radius', '0px',{
            duration : 500})
    },
    expandBody : function(callback){
    	var me = this, 
    		target = me.getBody(), 
    		height = me.content.getHeight()+6,
    		viewHeight = Ext.Element.getViewHeight();

    	me.content.setHeight(null);
    	
    	if(Ext.isNumber(me.bodyMinHeight) && height < me.bodyMinHeight){
    		height = me.bodyMinHeight;
    	}
    	if(Ext.isNumber(me.bodyMaxHeight) && height > me.bodyMaxHeight){
    		height = me.bodyMaxHeight;
    	}else if(height > viewHeight - me.content.el.getLocalY() - 50){
    		height = viewHeight - me.content.el.getLocalY() - 50;
    		me.content.setHeight(height);    		
    		height = height+4;
    	}
    	target.show();
    	target.stopAnimation();
    	target.setHeight(height +'px', me._getAnimatedOption(callback));
    	me.el.setHeight(me.el.getHeight()+height);
    },
    
    expand : function(){
       this.expandHeader(this.expandBody);
       this.fireEvent('expand', this);
       this.resizer.enable();       
   },
   
   isExpand : function(){
	   return this.el.hasCls('.'+this.showCls);
   },
   
   collapseHeader : function(callback){
	   var me = this, 
	   		target = me.el,
	   		x = me.collapsedWidth - me.itemWidth;
	   if(me.region === 'right'){
		   x = Ext.Element.getViewWidth() - me.collapsedWidth;
	   }
	   target.stopAnimation();
       target.setX(x, me._getAnimatedOption(callback));
       me.getHeader().setStyle('border-radius', '5px',{
           duration : 300})
       target.removeCls('.'+me.showCls);
       me.fireEvent('collapse', me, target);
   },
   collapseBody : function(callback){
	   var me = this, target = me.getBody();
	   target.stopAnimation();
   		target.setHeight(0, me._getAnimatedOption(function(){
        	target.hide();
        	if(Ext.isFunction(callback)){
        		callback.call(this);
        	}
        }));
   },
   collapse : function(){
	   this.collapseBody(this.collapseHeader);
       this.fireEvent('collapse', this);
       this.resizer.disable();
       this.el.setWidth(null);
       this.el.setHeight(40);
       this.content.setWidth(254);
   },
   isCollapse : function(){
	  return !this.isExpand(); 
   },
   jump : function(){
	   var me = this;
	   if(me.isCollapse()){
		   var target = me.el,
		   		collapsedX = this.collapsedWidth - this.itemWidth,
		   		hoverX = this.hoverWidth - this.itemWidth;
		   
		   if(me.region === 'right'){
			   collapsedX = Ext.Element.getViewWidth() - this.collapsedWidth;
			   hoverX = Ext.Element.getViewWidth() - this.hoverWidth;
		   }
		   target.stopAnimation();
		   if (target.getX() === collapsedX){
	           target.setX(hoverX, {
	        	   easing: 'elasticIn',
	               duration : 10000
	           });
	       }else{
	    	   target.setX(collapsedX, {
	    		   easing: 'elasticIn',
	               duration : 10000
	          });
	       }
	   }
   },
   getHeader : function(){
	  return Ext.get( this.id + '_' + this.headerCls);
   },
   getBody : function(){
	   return Ext.get( this.id + '_' + this.bodyCls); 
   },
   addJob : function(data){
	   var me = this, d = [], records = me.content.store.getRange(), tmp;
	   if(!Ext.isArray(data)){
		   data = [data];
	   }
	   outer : for(var j=0; j<data.length; j++){
		   for(var i=0; i<records.length; i++){
			   if(records[i].get('id') === data[j].id){
				   if(data[j].status === 'Finished' || data[j].status === 'Cancel'){
					   me.content.store.remove(records[i], true);
				   }else{
					   records[i].set('status', data[j].status);
				   }
				   continue outer;
			   }
		   }
		   if(data[j].status!=='Finished' && data[j].status !== 'Cancel'){
			   d.push(data[j]);
		   }
	   }
	   if(d.length > 0){
		   me.content.store.insert(0, d);
		   if(me.isExpand()){
			   me.expand();
		   }else{
			   me.jump();
		   }
		   this.setHeaderPropVal(me.getUnreadCount());
		   me.el.show();
	   }
   },
   getUnreadCount : function(){
	   var me = this, records = me.content.store.getRange(), count = 0, status;
	   for(var i = 0; i<records.length; i++){
		   if(!(status = records[i].get('status')) || status === 'Unread'){
			   count++;
		   }
	   }
	   return count;
   },
   removeJob : function(data){
	   var me = this, records = me.content.store.getRange(), moveRecords = [],
	   count = me.content.store.getCount();
	   if(!Ext.isArray(data)){
		   data = [data];
	   }
	   for(var i=0; i<records.length; i++){
		   for(var j=0; j<data.length; j++){
			   if(records[i].get('id') === data[j]){
				   moveRecords.push(records[i]);
			   }
		   }
	   }
	   if(moveRecords.length > 0){
		   me.content.store.remove(moveRecords, true);
		   this.setHeaderPropVal(me.getUnreadCount());
		   if(me.isExpand()){
			   me.expand();
		   }
	   }
	   if(count === 0){
		   me.el.hide();
	   }
   },
   setHeaderPropVal : function(val){
	   var me = this;
	   Ext.get(me.id + '_' + me.headerCls+'_prop-panel').setHTML(val);
   },
   constructor : function(config) {
       var me = this,
       item,
       selected,
       i;
        
       me.initConfig(config);
        
       me.addEvents({
	      'itemclick' : true,
	      'hover' : true,
	      'hoverleave' : true,
	      'expand' : true,
	      'collapse' : true,
	      'headerclick' : true
	   });
       me.id = me.id || Ext.id();
       item = {
            id : me.id,
            cls : me.itemCls,
            style : {
//                width : this.itemWidth + 'px',
            	height : me.itemHeight + 'px',
                position : 'absolute',
                top : '0px'
            },
            tag: 'div', 
//            title : me.tooltip || me.title,
            children : [{
            		id : me.id + '_' + me.headerCls,
                    tag : 'div',
                    cls : me.headerCls,
                    children : [{
                    	tag : 'span',
                    	cls : 'title-panel  title-panel-'+me.region+' '+me.iconCls,
                    	html : me.title
                    }, {
                    	id : me.id + '_' + me.headerCls+'_prop-panel',
                    	tag : 'span',
                    	cls : 'prop-panel prop-panel-'+me.region,
                    	html : ''
                    }],
                }, {
                	id : me.id + '_' + me.bodyCls,
                	tag : 'div',
                	cls : me.bodyCls
                }
            ]
        };
        item.style[me.region] = (this.collapsedWidth - this.itemWidth) + 'px';
        me.el = Ext.DomHelper.append(this.renderTo || Ext.getBody(), item, true);
        me.content = Ext.create('Ext.grid.Panel', {
     	   renderTo : me.id + '_' + me.bodyCls,
		   width : me.itemWidth - 6 + 'px',
     	   animCollapse : true,
     	   margin : '2px',     	   
     	   bodyCls : 'grid-body',
		   viewConfig : {
			   overItemCls : 'grid-over',
			   selectedItemCls : 'grid-row-selected'
		   },
    	   columns : [
//		   {
//     		   dataIndex : 'id',
//     		   text : 'ID',
//     		   hidden : true,
////     		   cls : 'grid-header',
////    		   tdCls : 'grid-cell',
////     		   overCls : 'grid-over'
//     	   },
		   {
     		   dataIndex : 'message',
     		   text : 'Message',
     		   flex:0.4,
//     		   cls : 'grid-header',
//    		   tdCls : 'grid-cell',
//     		   overCls : 'grid-over',
     		   renderer : function(val, style, record) {
     			   if(!record.get('status') || record.get('status') === 'Unread'){
     				   return '<span style="color:#fff;font-weight: bold;" title="'+val+'">' + val + '</span>';
     			   }
     			   return '<span style="color:#ccc;" title="'+val+'">' + val + '</span>';
     		   }
     	   }, {
     		   dataIndex : 'create',
    		   text : 'Date',
    		   width : 80,
//     		   cls : 'grid-header',
//    		   tdCls : 'grid-cell',
//     		   overCls : 'grid-over',
    		   renderer : function(val, style, record) {
     			   return '<span title="'+val+'">' + val + '</span>';
     		   }
     	   },{
     		  xtype:'actioncolumn',
     		  menuDisabled: true,  
   		   	  sortable: false,  
   		   	  align:'center', 
              width:50,
//    		  cls : 'grid-header',
    		  tdCls : 'pointer',
              text : 'Options',
              items: [{
            	  icon: '../../styles/cmp/images/dd-insert-arrow-right.gif',
            	  cls : 'pointer',
                  tooltip: 'Action',
                  handler: function(grid, rowIndex, colIndex) {
                	  var record = grid.getStore().getAt(rowIndex), param = {notification : true};
                      
                      param.MODULE_TYPE = record.get('module');
                      param.COMMAND = record.get('command');
                      var type = record.get('type');
                      Ext.applyIf(param, {id : record.get('objectId'), typeKey : type ? type.key : null, msg : record.get('message')});
                      var window = Ext.create('DigiCompass.Web.app.ui.Window', {
							title:'Notification Details'
						});
                      param.renderTo = window.getId();
                      
                      cometdfn.publish(param);
                      if(record.get('status')==='Unread'){
	                      cometdfn.publish({
	                    	  MODULE_TYPE : 'NotificationModule',
	                    	  COMMAND : 'readNotification',
	                    	  id : record.get('id'),
	                      });
                      }
                  }
              }]
     	   }],
     	   store : {
     		  fields : ['id','message','module','command','objectId', 'create','status','type'],
     		  data : []
     	   }
        });
//        me.content.headerCt.setHeight(0);
        me.resizer = Ext.create('Ext.create', 'Ext.resizer.Resizer', {
	           target: me.id,
	           //width: 200,
	           //height: 100,
	           handles: 'all',
	           handles : 's w sw',
	           minWidth:100,
	           minHeight:50,	           
	           listeners : {
	        	   resize : function(self, width, height, e, eOpts ){
	        		   me.content.setWidth(width-260-6);
	        		   me.getBody().setHeight(height-40);	        		  
	        	   }
	           }
	   });
        me.resizer.disable();
        
        
        me.callParent(arguments);
        me.bindEvents();
        me._addListeners();
        me.getBody().hide();
        me.el.hide();
        Ext.get(window).addListener('resize', function(){
        	if(this.isExpand()){
        		this.expand();
        	}else{
        		this.collapse();
        	}
        }, me);
    },
    bindEvents: function(){
    	var me = this, item = me.el, header = me.getHeader();
    	
    	item.addListener('click', function(event, itemElement){
         	this.fireEvent('click', this, itemElement);
         }, me, { delegate: 'div' });
         
    	item.addListener('mouseenter', function(event, itemElement){
         	this.fireEvent('hover', this, itemElement);
         }, me);
         
    	item.addListener('mouseleave', function(event, itemElement){
        	 this.fireEvent('hoverleave', this, itemElement);
         }, this);
    	header.addListener('click', function(event, itemElement){
    		this.fireEvent('headerclick', this, itemElement);
    	}, me)
    }
});

Ext.define('DigiCompass.Web.app.ui.Window', {
    extend: 'Ext.window.Window',
    children : [],
    width:800,
	height:600,
	padding : '0',
	modal:true,
    maximizable : true,
    layout:'fit',
    initComponent : function(){
    	this.callParent(arguments);
    },
    add : function(cmp){
    	var me = this, compent;
    	compent = cmp;
    	if(Ext.isString(cmp)){
    		compent = Ext.getCmp(cmp);
    		if(!cmp){
    			compent = Ext.get(cmp);
    		}
    	}
    	me.children.push(compent);
    	compent.addListener('hide', me.onMoveChildren, me);
//    	compent.addListener('remove', me.onMoveChildren, me);
    	me.callParent(arguments);
    	compent
    	me.show();
    },
	
	onMoveChildren : function(target){
		this.children.splice(this.children.indexOf(target),1);
		target.removeListener('hide', this.onMoveChildren, this);
		target.removeListener('remove', this.onMoveChildren, this);
		if(this.children.length === 0){
			this.close();
		}
	}
});