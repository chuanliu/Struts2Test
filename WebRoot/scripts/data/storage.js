/*
*Storage 存储两类内容：1，对象(全局唯一标识符)。2，索引(包括集合，树，map等)
obj:{id:id,state:conected/unconected, 
	modify
}

key:uuid
{
	p1:p1,
	p2:p2
	
}
*/
Ext.namespace('Digicompass');

Digicompass.Storage = (function(){

	var returnObj={

		//保证能获取到
		get:function(id,callback){
			var me = this,
				params  = {
					id:id,
					MODULE_TYPE:'MOD_STORAGE',
					COMMAND:'GET'
				},
				onGet = fucntion(message){
					if (message.STATUS === 'success') {
						data = Ext.decode(response.BUSINESS_DATA);
						saveLocalObj(id,data);
						callback(data);
					} else {
						me.setException(operation, message.customException || 'error');
						me.fireEvent('exception', this, message);
					}
				};
			
			if(callback == undefined) return getLocalObj(id);
			
			if(needUpdate(id)){
				cometdfn.request(params,onGet,function(){}, timeout, reconnectCount);
			}else{
				return getLocalObj(id);
			}
		}
	};
	
	//@event - update
	
	//@private property
	var storage = window.localStorage,
		generation,
		prefix ='Storage_',
		timeout : 40000,
		reconnectCount : 10,
	
	//@init
	init();
	
	//@private method
	var	init = function(){
			//listen
			cometdfn.registFn({
				MODULE_TYPE:"MOD_STORAGE",
				COMMAND:'POST',
				callbackfn :onPost
			});
			
			cometdfn.registFn({
				MODULE_TYPE:"MOD_STORAGE",
				COMMAND:'PUT',
				callbackfn :onPut
			});
			
			cometdfn.registFn({
				MODULE_TYPE:"MOD_STORAGE",
				COMMAND:'DELETE',
				callbackfn :onDelete
			});
			
			//generation = storage.getItem(perfix+'generation');
		},
		
		onPost = function(data,conf,fname,command){
			var id = data.id,
				obj = data.data;
			
			saveLocalObj(id,obj);
		},
		
		onPut = function(data,conf,fname,command){
			var id = data.id,
				obj = data.data;
			
			saveLocalObj(id,obj);
		},
		
		onDelete = function(data,conf,fname,command){
			var id = data.id,
				obj = data.data;
			
			delLoaclObj(id);
		},
		
		needUpdate = function(id){
			return storage.getItem(prefix+id) == undefined;
		},
		
		getLocalObj=function(id){
			var s = storage.getItem(prefix+id),
				o;
			if(s) o = JSON.parse(s);
			else return null;
			return o;
		},
	
		saveLocalObj=function(id,o){
			var s = JSON.stringify(o);	
			storage.setItem(prefix+id,s);
		};
		
		delLoaclObj = function(id){
			storage.remove(prefix+id);
		};
	
	return returnObj;
})();

//init


/**********************************************************************************************/

