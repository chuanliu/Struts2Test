dd = d3||function(){};

d3.selectedEl =function(arg){
	return d3.select(dd.el(arg));
}

/*********************************************************************
 * Core
 *********************************************************************/

dd.namespace=function(ns){
	
    var nsArray = ns.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++)
    {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
       
        sEval += "if (typeof(" + sNS + ") == 'undefined') {" + sNS + " = new Object();} else  {" + sNS + " =  " + sNS + " ;}"
    }
    if (sEval != "") return eval(sEval);
}

dd.observable=function(scope){

	scope.prototype.on=function(type, method, scope, context) {
        var listeners, handlers, scope;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])){
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : window);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    };
    
    scope.prototype.un=function(type, method) {
        var listeners, handlers, scope;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if(method){
        	if (!(handlers = listeners[type])){
                 handlers = listeners[type] || [];
            }
        	 
        	for(var i = 0; i< handlers.length; i++){
            	if(handlers[i].method == method){
            		handlers.splice(i,1);
            	}
            }
        }else{
        	delete listeners[type];
        }
        
    };
	    
	    
    scope.prototype.fire=function(type, args, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])){
            return;
        }
        
        var rs = true;
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (typeof(context)!=="undefined" && context !== handler.context) continue;
            var nrs = handler.method.apply(
                    handler.scope, args||[]
                );
            rs = rs && nrs;
        }
        return rs;
	};
}


dd.loop=function(arg,func){
	var i=0;
	if(dd.isArray(arg)){
		for(;i<arg.length;){
			var k =i;
			if(func(arg[i],k)==false){
				break;
			}
			i=i+1;
		}
	}else if(dd.isObject(arg)){
		for(var p in arg){
			if(func(arg[p],p)==false){
				break;
			}
		}
	}else if(dd.isInt(arg)){
		for(;i<arg;){
			var k =i;
			if(func(k)==false){
				break;
			}
			i=i+1;
		}
	}else if(dd.isFunction(arg)){
		
	}
}

dd.splice = function(array,value){
	for(var i = 0; i<array.length; i++){
		if(array[i] === value){
			array.splice(i,1);
			break;
		}
	}
}

dd.trim = function (str){ 
	if(!str) return str;
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

dd.ltrim = function (str){ 
	return str.replace(/(^\s*)/g,"");
}

dd.rtrim = function (str){ 
	return str.replace(/(\s*$)/g,"");
}

dd.apply = function(obj1,obj2){
	for(var p in obj2){
		obj1[p] = obj2[p];
	}	
	return obj1;
}

dd.applyIf = function(obj1,obj2){
	for(var p in obj2){
		if(obj1[p] === undefined) obj1[p] = obj2[p];
	}	
	return obj1;
}

dd.clone = function(obj) {
	// Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = dd.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = dd.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

dd.cloneJson = function(obj) {
	var newObject = JSON.parse(JSON.stringify(obj));
	
	return newObject;
}

dd.sub = function(obj,arr){
	var copy = {};
	
	for(var i = 0; i<arr.length; i++){
		copy[arr[i]] = obj[arr[i]];
	}
	
	return copy;
}


dd.guid = function() {
	var s4 = function() {
		  return Math.floor((1 + Math.random()) * 0x10000)
		             .toString(16)
		             .substring(1);
		};
		
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

dd.toDate = function(date){
	if(!date) return undefined;
	if(date instanceof Date) return date;
	return new Date(date);
}
	
/*********************************************************************
 * elements
 *********************************************************************/

dd.g=function(arg){
	var xmlns = "http://www.w3.org/2000/svg";
	if(!arg) arg = 'g';
	return dd.el(arg,xmlns);
};

dd.el=function(arg,ns,refParent){
	var createElement = function(tag){
		if(ns) return document.createElementNS(ns,tag); 
		else return document.createElement(tag);
	}
	
	var wrap = function(el){
		if(el.dd) return el;
		else el.dd = true;
		
		el.el=function(arg,ns){
			var child = dd.el(arg,ns);
			this.appendChild(child);
			return child;
		};
		
		el.g=function(arg){
			var child = dd.g(arg,ns);
			this.appendChild(child);
			return child;
		};
		
		el.addCls=function(cls){
			var clss = this.className.split(' ');
			for(var i = 0; i<clss.length; i++){
				if(clss[i] == cls) return false;
			}
			
			this.className = this.className+' '+cls;
			return this;
		};
		
		el.removeCls=function(cls){
			var clss = this.className.split(' ');
			for(var i = 0; i<clss.length; i++){
				if(clss[i] == cls) {
					 clss.splice(i,1);
					 this.className =clss.join(' ');
					return this;
				}
			}

			return this;
		};
		
		
		
		el.first=function(selector){
			return this.find(selector)[0];
		};
		
		el.find=function(selector){
			if(selector.indexOf('.')==0){
				return this.getElementsByClassName(selector.slice(1,selector.length-1));
			}	
		};
		
		el.css=function(key,value){
			if(value!=undefined){
				this.style[key] = value;
				return this;
			}else{
				return  this.style[key];
			}
		};
		
		el.float=function(lr){
			this.style.float=lr||'left';
			return this;
		};
		
		el.display=function(arg){
			if(!arg) arg='none';
			this.style.display=arg;
			return this;
		};
		
		el.html=function(html){
			if(html!== undefined){
				this.innerHTML=html;
				return this;
			}
			return this.innerHTML;
		};
		
		if(!el.width && !el.height){
			el.width=function(v){
				if(v!=undefined){
					this.style.width=dd.isString(v)?v:v+'px';
					return this;
				}
				return this.style.width;
			};
			
			el.height=function(v){
				if(v!=undefined){
					this.style.height=dd.isString(v)?v:v+'px';
					return this;
				}
				return this.style.height;
			};
		}
		
		
		el.fit=function(){
			this.width('100%');
			this.height('100%');
			return this;
		};
		
		el.absfit=function(){
			this.style.position = 'absolute';
			this.style.top=0;
			this.style.bottom=0;
			this.style.left=0;
			this.style.right=0;
			return this;
		};
		
		el.relative=function(){
			this.style.position = 'relative'; 
			return this;
		}
		
		el.absolute=function(){
			this.style.position = 'absolute';
			return this;
		}
		
		el.zindex=function(v){
			this.style.zIndex = v;
			return this;
		}
		
		el.top=function(v){
			if(v!=undefined){
				this.style.top = dd.isString(v)?v:v+'px';
				return this;
			}
			return this.style.top;
		}
		
		el.bottom=function(v){
			if(v!=undefined){
				this.style.bottom = dd.isString(v)?v:v+'px';
				return this;
			}
			return this.style.bottom;
		}
		
		el.left=function(v){
			if(v!=undefined){
				this.style.left = dd.isString(v)?v:v+'px';
				return this;
			}
			return this.style.left;
		}
		
		el.right=function(v){
			if(v!=undefined){
				this.style.right = dd.isString(v)?v:v+'px';
				return this;
			}
			return this.style.right;
		}
		
		el.attr = function(k,v){
			if(v!=undefined){
				this.setAttribute(k,v);
			}else{
				return this.getAttribute(k);
			}
			return this;
		};
		
		el.detach = function(k,v){
			if(this.parentNode) this.parentNode.removeChild(this);
			return this;
		};
	
		
		el.append=el.appendChild;
		
		return el;
	};
	
	if(arg == undefined){
		return wrap(createElement('div'));
	}else if(dd.isString(arg)){
		return wrap(createElement(arg));
	}else if(dd.isElement(arg)){
		if(!arg.warped){
			return wrap(arg);
		}else{
			return arg;
		}	
	}else if(dd.isObject(arg)){
		var el;
		if(arg.tag){
			el = wrap(createElement(arg.tag));
		}else{
			el = wrap(createElement('div'));
		}
		
		for(var p in arg){
			if(p == 'items'){
				var rp = refParent;
				if(!rp){
					rp = el;
				}
				if(dd.isArray(arg[p])){
					dd.loop(arg[p],function(d){
						if(dd.isElement(d)){
							el.appendChild(d);
							
							return;
						}
						
						var config = d;
						if(arg['defaults']){
							for(var o in arg['defaults']){
								if(!config[o]) config[o] = arg['defaults'][o];
							}
						}
						
						var child =  dd.el(d,undefined,rp);
						el.appendChild(child);
						if(d['ref']){
							if(!rp.items) rp.items = {};
							rp.items[d['ref']] = child;
						}
					});
				}
			}else if(p == 'html'){
				el.html(arg[p]);
			}else{
				if(p!='tag'&& p != 'ref'&& p != 'defaults') el.attr(p,arg[p]);
			}
		}
		
		return el;
	}
}

dd.reg = {
	name:/^[0-9a-zA-Z. _-]+$/,
}

/*********************************************************************
 * types
 *********************************************************************/
dd.isInt = function(n) {
   return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
} 

dd.isArray=function(obj){
	return Object.prototype.toString.call(obj) === '[object Array]';
}

dd.isObject=function(obj){
	return Object.prototype.toString.call(obj) === '[object Object]';
}

dd.isFunction=function(obj){
	return Object.prototype.toString.call(obj) === '[object Function]';
}

dd.isElement=function(obj){
	return obj instanceof HTMLElement;
}


dd.isString=function(obj){
	return toString.call(obj) == '[object String]';
}
