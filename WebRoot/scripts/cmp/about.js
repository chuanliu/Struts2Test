Ext.require([
     'DigiCompass.Web.UI.Dialog.AboutDialog'
 ]);

Ext.ns("DigiCompass.sys.about");

DigiCompass.sys.about=function(){
	var data={
		name:'Core Mobile Platform',
		version:'Version 0.901',
		logo:'../../styles/ui/images/logo.png',
		tabs:[                                                                                           	 	
		{
			name:'Credits',
			html:cmp_copyright
		},
		{
			name:'Notice',
			html:cmp_aboutText
		}
			
	]};
   	var dialog=new DigiCompass.Web.UI.Dialog.AboutDialog(data);  	
   	dialog.open();
}