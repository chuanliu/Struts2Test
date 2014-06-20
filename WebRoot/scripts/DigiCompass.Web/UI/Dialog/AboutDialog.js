/// <reference path="/scripts/extjs4.1.1/ext-all-debug.js"/>

Ext.namespace('DigiCompass.Web.UI.Dialog');

Ext.define('DigiCompass.Web.UI.Dialog.AboutDialog',{
	extend: 'Object' ,
	prefix: 'digicompass-web-ui-dialog-aboutdialog-',
	dom:undefined,
	
	/*data:{name:name,version:version,logo:.png,tabs:[
	* 	{
	*		name:name,
	*		html:html
	*	}
	* ]}
	*/
	constructor: function(data) {
		var me=this;
		//@private
		me.data=data;
		me.idmap={};
		
		//@private
		me.btnclick=function(event,me){
			var extdom=new Ext.dom.Element(event.target),
				tab=Ext.get(me.idmap[extdom.getAttribute('id')]);
			
			if(!extdom.hasCls('bgc-2')){
				var current=extdom.parent().child('.bgc-2'),
					currenttab=Ext.get(me.idmap[current.getAttribute('id')]);
				current.removeCls('bgc-2');
				extdom.addCls('bgc-2');
				
				me.displaytab(tab);
				me.hidetab(currenttab);
			}
		},
		
		//@private
		me.displaytab=function(tab){
			tab.setStyle('display','block');
		},
		
		//@private
		me.hidetab=function(tab){
			tab.setStyle('display','none');
		},
		
		//@private
		me.renderIfNecessary=function(){
			var me=this;
			
			if(me.dom==undefined){
				var o={
					tag:'div',
					id:me.prefix+'ctn',
					cls:'layout-fill layout-ztop',
					children:[
						//backgroud,for bind click event
						{tag:'div',id:me.prefix+'bg',cls:'layout-fill'},
						//container,for shadow
						{tag:'div',cls:'effect-dropshadow',style:'position:absolute; top:50%; left:50%; margin-left:-300px; margin-top:-200px; width:600px; height:360px;',children:[
							{tag:'div',id:me.prefix+'logoctn',cls:'layout-noedge layout-relative',style:'width:20%;height:100%;float:left;',children:[
	                            {tag:'div',width:'100%',cls:'layout-fill bgc-1 ',style:'opacity:0.1;'},
							    {tag:'image',width:'80%',src:me.data.logo,style:'position:absolute; top:20px; left:10%;-webkit-filter: drop-shadow(0px 0px 7px rgba(0,0,0,0.3));filter: url(/assets/svg/shadow.svg#drop-shadow);'} //insert logo
							]},
							{tag:'div',id:me.prefix+'textctn',cls:'bgc-0 layout-noedge',style:'width:80%;height:100%;float:right;padding:20px; position:relative;',children:[
								{tag:'div',style:'font-size:21px; padding:10px 0; font-weight:800;',html:me.data.name},//insert name
								{tag:'div',style:'padding:5px 0;',html:me.data.version},//insert version
								{tag:'div',id:me.prefix+'tabs',
									style:'line-height:22px; padding:5px 0; width:auto; position:absolute; top:90px; bottom:52px; left:20px;right:20px; overflow-y:auto;',
								},
								{tag:'div',id:me.prefix+'btns',cls:'bdc-2',
									style:'font-size:12px; border-top:solid 1px; height:40px; position:absolute; bottom:0px; left:20px;right:20px;'}
							]}
						]}
					]
				};
	
				me.dom = Ext.DomHelper.createDom(o);
				var extdom=new Ext.dom.Element(me.dom);
				
				
				Ext.each(me.data.tabs,function(obj,i){
					//insert tabs
					var tab = Ext.DomHelper.createDom({
						tag:'div',id:me.prefix+'tab-'+obj.name,style:'display:none;',html:obj.html
					});
					
					//insert btns
					var btn=Ext.DomHelper.createDom({
						tag:'button',id:me.prefix+'btn-'+obj.name,type:'button',html:obj.name,cls:'layout-relative bgc-1',style:'top:-1px;float:right; height:20px; margin:0 10px; border:solid 1px; border-top:0px;'
					});
					btn.onclick=function(event){
						me.btnclick(event,me);
					};
					
					//display index 0
					if(i==me.data.tabs.length-1)
					{
						tab.style.display='block';
						btn.className+=' bgc-2';
					}
					
					//map id for click event
					me.idmap[me.prefix+'btn-'+obj.name]=me.prefix+'tab-'+obj.name
					
					extdom.getById(me.prefix+'tabs').appendChild(tab);
					extdom.getById(me.prefix+'btns').appendChild(btn);
				});
				
				//bind close event
				(new Ext.dom.Element(me.dom)).getById(me.prefix+'bg').dom.onclick=function(event){
					me.close();
				};
				
				//clear data
				me.data=null;
			}
		}
		
		//@init
		
	},
	
	//render once time,attach everytime
	open:function(){
		var me=this;
		
		me.renderIfNecessary();
		
		//if dom has fadeout
		me.dom.style.opacity=1; 
		me.dom.style.visibility='visible';
		
		document.body.appendChild(me.dom);
	},
	
	//unattach doms
	close:function(){
		var me=this;
		
		new Ext.dom.Element(me.dom).fadeOut({
			opacity: 0, //can be any value between 0 and 1 (e.g. .5)
			easing: 'easeOut',
			duration: 200,
			remove: true
		});
	}
});