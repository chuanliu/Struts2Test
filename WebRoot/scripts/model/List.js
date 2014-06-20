// / <reference path="/scripts/ext/ext-base-debug-w-comments.js"/>
// / <reference path="/scripts/ext/ext-all-debug-w-comments.js"/>

Ext.require(['Ext.util.*' , 'Ext.state.*']);

Ext.namespace('DigiCompass.Model.List');

Ext.define("DigiCompass.Model.List", {
			extend : 'Ext.util.Observable',
			buildIndex : function() {
				this.index = {};

				var _this = this;
				Ext.each(this.objects, function(obj, index) {
							_this.index[obj.name] = index;
						});
			},

			buildIds : function() {
				this.ids = {};

				var _this = this;
				Ext.each(this.objects, function(obj) {
							_this.ids[obj.name] = obj;
						});
			},

			constructor : function(objects) {
				this.objects = objects;

				this.buildIndex();

				this.buildIds();

				this.cursor = 0;

				this.selected = {};

				this.addEvents({
							'selectionChanged' : true,
							'cursorChanged' : true
						});
				// 给当前对象动态指派constructor方法
				DigiCompass.Model.List.superclass.constructor.call(this);
			},

			getObjectByIndex : function(index) {
				return this.objects[index];
			},

			getIndexByObject : function(obj) {
				return this.index[obj.name];
			},

			getObjectById : function(id) {
				return this.ids[id];
			},

			getTotal : function() {
				return this.objects.length;
			},

			isSelected : function(obj) {
				return this.selected.hasOwnProperty(obj.name);
			},

			selectObjectByIndex : function(index) {
				var obj = this.getObjectByIndex(index);

				if (this.isSelected(obj)) {
					return false;
				}

				this.selected[obj.name] = obj;

				this.fireEvent('selectionChanged', index, true);

				return true;

			},

			deselectObjectByIndex : function(index) {
				var obj = this.getObjectByIndex(index);

				if (!this.isSelected(obj)) {
					return false;
				}

				delete this.selected[obj.name];

				this.fireEvent('selectionChanged', index, false);

				return true;
			},

			getSelectedIndex : function() {
				var selections = [];
				var start = null;

				var _this = this;
				Ext.each(this.objects, function(obj, index) {
							if (_this.isSelected(obj)) {
								if (start == null) {
									start = index;
								}
							} else if (start != null) {
								selections.push({
											start : start,
											end : index - 1,
											total : _this.getTotal()
										});
								start = null;
							}
						});
				if (start != null) {
					selections.push({
								start : start,
								end : this.getTotal() - 1,
								total : _this.getTotal()
							});
				}
				return selections;
			},

			getCursor : function() {
				return this.cursor;
			},

			setCursor : function(index) {
				if (this.cursor == index) {
					return false;
				}

				this.cursor = index;
				this.fireEvent('cursorChanged', index);
				return true;
			}
		});

/*
 * DigiCompass.Model.List = Ext.extend(Ext.util.Observable, {
 * 
 * 
 * 
 * buildIndex: function() { this.index = {};
 * 
 * var _this = this; Ext.each(this.objects, function(obj, index) {
 * _this.index[obj.name] = index; }); },
 * 
 * buildIds: function() { this.ids = {};
 * 
 * var _this = this; Ext.each(this.objects, function(obj) { _this.ids[obj.name] =
 * obj; }); },
 * 
 * constructor: function(objects) { this.objects = objects;
 * 
 * this.buildIndex();
 * 
 * this.buildIds();
 * 
 * this.cursor = 0;
 * 
 * this.selected = {};
 * 
 * this.addEvents({ 'selectionChanged': true, 'cursorChanged': true });
 * //给当前对象动态指派constructor方法
 * DigiCompass.Model.List.superclass.constructor.call(this); },
 * 
 * getObjectByIndex: function(index) { return this.objects[index]; },
 * 
 * getIndexByObject: function(obj) { return this.index[obj.name]; },
 * 
 * getObjectById: function(id) { return this.ids[id]; },
 * 
 * getTotal: function() { return this.objects.length; },
 * 
 * isSelected: function(obj) { return this.selected.hasOwnProperty(obj.name); },
 * 
 * selectObjectByIndex: function(index) { var obj =
 * this.getObjectByIndex(index);
 * 
 * if(this.isSelected(obj)) { return false; }
 * 
 * this.selected[obj.name] = obj;
 * 
 * this.fireEvent('selectionChanged', index, true);
 * 
 * return true;
 *  },
 * 
 * deselectObjectByIndex: function(index) { var obj =
 * this.getObjectByIndex(index);
 * 
 * if(!this.isSelected(obj)) { return false; }
 * 
 * delete this.selected[obj.name];
 * 
 * this.fireEvent('selectionChanged', index, false);
 * 
 * return true; },
 * 
 * getSelectedIndex: function() { var selections = []; var start = null;
 * 
 * var _this = this; Ext.each(this.objects, function(obj, index) {
 * if(_this.isSelected(obj)) { if(start == null) { start = index; } } else
 * if(start != null) { selections.push({ start: start, end: index - 1, total:
 * _this.getTotal() }); start = null; } }); if(start != null) {
 * selections.push({ start: start, end: this.getTotal() - 1, total:
 * _this.getTotal() }); } // alert("ok"); return selections; },
 * 
 * getCursor: function() { return this.cursor; },
 * 
 * setCursor: function(index) { if(this.cursor == index) { return false; }
 * 
 * this.cursor = index; this.fireEvent('cursorChanged', index); return true; }
 * });
 */
