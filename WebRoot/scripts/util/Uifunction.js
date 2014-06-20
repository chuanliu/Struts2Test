(function(){
	Ext.namespace("UiFunction");
	UiFunction.setTitle = function(id , titleBase , detailName){
		var ui = Ext.getCmp(id);
		if(ui && !Ext.isEmpty(titleBase)){
			if(!Ext.isEmpty(detailName)){
				ui.setTitle('Object Details - ' + titleBase + ' ('+ detailName +')');
				
			}
			else{
				ui.setTitle('Object Details - ' + titleBase);
			}
			return true;
		}
		return false;
	}
	UiFunction.getTitle = function(titleBase , detailName){
		if(!Ext.isEmpty(detailName)){
			return 'Object Details - ' + titleBase + ' ('+ detailName +')' ;
			
		}
		else{
			return 'Object Details - ' + titleBase;
		}
	}
})();