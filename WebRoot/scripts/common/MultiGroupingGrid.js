Ext.define('DigiCompass.Web.app.grid.MultiGroupingGrid', {
	extend: 'Ext.grid.Panel',
	features: [],
	pk : 'site.id',
	verticalScrollerType: 'paginggridscroller',
	invalidateScrollerOnRefresh: false,
	loadMask: true,
	columnLines: true,
	selection : true,
	selections : [],
	groupChecked : [],
	columns: [],
	cleanGrouping : function(){
		var me = this;
		me.multiGroupFeature.cleanGrouping();
	},
	getGroupField: function(){
		var me = this,
			groupers = me.multiGroupFeature.lastGroupIndex;
		return groupers;
	},
	getChecked : function(){
		return this.selections;
	},
	reset : function(){
		var me = this;
		me.groupChecked = [];
		me.selections = [];
		me.cleanGrouping();
	},
	setRootNode : function(){},
	constructor : function(config) {
		var me = this;
		this.initConfig(config);
		me.multiGroupFeature = Ext.create('DigiCompass.Web.app.grid.feature.SummaryMultiGrouping',{
			baseWidth:50,
		    groupHeaderTpl: '{disName}',
		    listeners : {
		    	selectgroup : function(scope, sel, values, depth){
		    		var index = -1,isChecked;
		    		for(var i in me.groupChecked){
		    			isChecked = true;
		    			for(var j in values){
		    				if(values[j] !== me.groupChecked[i][j]){
		    					isChecked = false;
		    				}
		    			}
		    			if(isChecked){
		    				index = i;
		    				break;
		    			}
		    		}
		    		if(sel && index < 0){
		    			me.groupChecked.push(values);
		    		}else if(!sel && index>0){
		    			me.groupChecked.splice(index, 1);
		    		}
		    	},
		    	groupclick : function(){
//		    		me.fireEvent('group', arguments);
		    	}
		    }
		});
		me.features.push(me.multiGroupFeature);
		if(!me.store){
			me.store = Ext.create('DigiCompass.Web.app.data.ArrayStore', {
			 	pageSize:30,
		        autoLoad : false,
		        remoteGroup : true,
		        remoteSort : true,
		        remoteFilter : true,
		        remoteSummary : true,
		        fields: [] ,
		        buffered: true,
		        proxy: {
		            type: 'cometd',
		            moduleType : config.moduleType,
		            modules : {
		            	read : {
		           		 	command : config.command
		           		}
		            },
		            extraParams: config.extraParams,
		            reader: new DigiCompass.Web.app.data.reader.GridArrayReader({
		                root: false,
		                totalProperty: config.totalProperty || 'meta.paging.rows',
		                flexViewProperty : config.flexViewProperty || 'meta'
		            })
		        }
			});
		}
		if(!me.selModel && me.selection){
			me.selModel = Ext.create('Ext.selection.CheckboxModel',{
				pk : config.pk,
				listeners : {
					select : function(scope, select){
						var add = true;
						if(!me.selections){
							me.selections = [];
						}
						for(var j in me.selections){
							if(me.selections[j][scope.pk] === select.data[scope.pk]){
								add = false;
								break;
							}
						}
						if(add){
							me.selections.push(select.data);
						}
					},
					deselect : function(scope, select){
						if(select.store){
							if(!me.selections){
								me.selections = []
							}
							for(var j in me.selections){
								if(me.selections[j][scope.pk] === select.data[scope.pk]){
									me.selections.splice(j, 1);
								}
							}
						}
					}
				}
			});
		}
		me.addEvents({
	      "group" : true
	    });
		this.superclass.constructor.apply(this, arguments);
	},
	initComponent : function(){
		var me = this;
		me.callParent(arguments);
		me.view.addListener('beforerefresh', function(){
        	var me = this, columns,flexView,
    		headerCt = me.getHeaderCt(),
    		index = 0,
    		i;
	    	if(me.store.proxy && me.store.flexView){
	    		flexView = me.store.flexView;
	    		if(flexView.id !== me.flexViewId || !flexView.isSameHeader()){
	        		columns = me.store.flexView.extColumns;
	        		if(me.selModel instanceof Ext.selection.CheckboxModel){
	        			index = 1;
	        		}
	        		for(i =0; i< headerCt.getColumnCount(); i++){
	        			if(headerCt.getHeaderAtIndex(i).columnType === 'summary'){
	        				index++;
	        			}
	        		}
	        		while(headerCt.getColumnCount() > index){
	    				headerCt.remove(index, true);
	    			}
	
	        		for(i in columns){
	        			headerCt.add(columns[i]);
	        		}
	        		me.fireEvent('refreshview', me.store.flexView);
	        		me.setNewTemplate();
	        		me.flexViewId = flexView.id;
	    		}
	    	}
		});
	}
	
});