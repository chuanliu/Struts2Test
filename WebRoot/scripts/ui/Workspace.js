/// <reference path="/scripts/ext/ext-base-debug-w-comments.js"/>
/// <reference path="/scripts/ext/ext-all-debug-w-comments.js"/>
/// <reference path="/scripts/ui/Wheel.js"/>

Ext.require(['Ext.container.*']);

Ext.namespace('DigiCompass.Web.UI');

Ext.define('DigiCompass.Web.UI.Workspace',{
	extend : 'Ext.container.Viewport',
	cls: 'ui-workspace',
	layout: 'absolute',
	alias : "widget.DigiCompass.Web.UI.Workspace",
	initComponent: function() {
		this.items = [
		    // show logo
			{
				xtype: 'component',
				cls: 'ui-logo'
			},
			// show workbench
			{
				id:'myWorkbenchId',
				xtype: 'DigiCompass.Web.UI.Workbench'
			},
			// show wheel menu
			{
				xtype: 'component',
				id: 'ui-wheel',
				cls: 'ui-wheel'
			}
		];

		// 将initComponent方法动态指派给当前对象
		DigiCompass.Web.UI.Workspace.superclass.initComponent.call(this);
		
		// 重置Fisheye的大小
		this.addListener('resize', function(me, adjWidth, adjHeight, rawWidth, rawHeight) {
			DigiCompass.Web.UI.Wheel.resize();
		});

		// 在Pad等设备上运行时，屏幕翻转时会触发
		window.onorientationchange = function(){
               if (window.orientation % 180 == 0){
                   d3.select("body").classed("-webkit-transform-origin", "")
                       .classed("-webkit-transform", "");               
               } 
               else {                   
                   if ( window.orientation > 0) { //clockwise
                     d3.select("body").classed("-webkit-transform-origin", "200px 190px")
                       .classed("-webkit-transform",  "rotate(-90deg)");  
                   }
                   else {
                     d3.select("body").classed("-webkit-transform-origin", "280px 190px")
                       .classed("-webkit-transform",  "rotate(90deg)"); 
                   }
               }
           };

//        //hammer主要用于处理事件
//		var hammer = new Hammer(document.body, {
//			//点击最大间隔 ms
//			tap_max_interval: 700 , // seems to bee needed for IE8
//			hold_undrag : true
//		});
//
//		//触发双击事件
//		hammer.onhold     = function(e) {
//			// hold position
//			var p = e.position[0];
//			//在双击位置展示Fisheye
//			DigiCompass.Web.UI.Wheel.show([p.x, p.y]);
//		};
		
        //触发鼠标右键
		document.body.onmousedown = function(e){
			if(e.button == 2){
				var p = mouseCoords(e);
				DigiCompass.Web.UI.Wheel.show([p.x, p.y]);
			}
		}
		
		function mouseCoords(ev){
			if(ev.pageX || ev.pageY){
				return {x:ev.pageX, y:ev.pageY};
			}
			return {x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,y:ev.clientY + document.body.scrollTop - document.body.clientTop};
		}
		
		//取消上下文中的右键事件
		this.getEl().on('contextmenu', function(e) {
			// prevent context menu globally
			e.preventDefault();
		});
		
	}
});

