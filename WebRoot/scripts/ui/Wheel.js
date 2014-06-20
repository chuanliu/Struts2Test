/// <reference path="/scripts/ext/ext-base-debug-w-comments.js"/>
/// <reference path="/scripts/ext/ext-all-debug-w-comments.js"/>
/// <reference path="/scripts/d3/d3.v2.js"/>
/// <reference path="/scripts/d3/fisheye.js"/>


Ext.namespace('DigiCompass.Web.UI');
Ext.namespace('DigiCompass.Web.UI.Wheel');

Ext.define('DigiCompass.Web.UI.Wheel.Item',{
	extend : 'Object' ,
	//定义构造函数
	constructor: function(children, id, nameTag, text, icon, data, actions, level, path, parent) {
		this.text = text || null;
		this.icon = icon || null;
		this.data = data || null;
		this.actions = actions || null;
		this.nameTag = nameTag || null;

		this.level = level || 0;

		if(path) {
			this.path = path + ' -> ' + this.text;
		}
		else {
			this.path = this.text;
		}

		this.parent = parent;
		this.children = [];

		var _this = this;
		Ext.each(children, function(child) {
			var item = new DigiCompass.Web.UI.Wheel.Item(child.children, id, child.nameTag, child.text, child.icon, child.data, child.actions, _this.level + 1, _this.path, _this);
			id = item.id + 1;
			_this.children.push(item);
		});

		this.id = id || 1;
	},

	getChildren: function(distance) {
		if(distance == 0) {
			return this.children;
		}
		return this.parent.getChildren(distance - 1);
	}
	
});

DigiCompass.Web.UI.Wheel.Item.Empty = Ext.create('DigiCompass.Web.UI.Wheel.Item',[]);

//将第二个参数中的配置，拷贝到Wheel中
Ext.apply(DigiCompass.Web.UI.Wheel, (function() {
	//生成一个fisheye
	var fisheye = d3.fisheye()
		.radius(200)
		.power(2);

	var r0 = 100;								// radius of ring 0
	var ri = 66;								// radius interval, i.e. distance between rings
	var rr = 0.8;

	var dt = 600;								// delta time, i.e. duration of animation per item
	var t1 = 0.99;
	var da1 = 150;								// max delta angle
	var da2 = 135; 								// delta angle when animation ends

	var a1 = -45;								// the end angle of the first item of ring 0
	var ai0 = 44;								// angle interval of the ring 0, i.e. angle between adjacent items in ring 0

	return {
		visible: false,

		load: function(config) {
			this.selection = new DigiCompass.Web.UI.Wheel.Item(config);
		},

		resize: function() {
			if(this.visible) {
				var el = Ext.get('ui-wheel');
				this.left = this.leftPerc * el.getWidth();
				this.top = this.topPerc * el.getHeight();
				d3.select('#ui-wheel-coordinate').attr('transform', 'translate(' + this.left + ',' + this.top + ')');
			}
		},

		init: function(xy) {
			var el = Ext.get('ui-wheel');
			var xy1 = el.getXY();
	
			this.left = xy[0] - xy1[0];
			this.top = xy[1] - xy1[1];

			this.leftPerc = this.left / el.getWidth();
			this.topPerc = this.top / el.getHeight();
	
			//配置标签
			//<svg id='ui-wheel-svg'><defs><filter id='ui-wheel-blur'><feGaussianBlur></feGaussianBlur></filter></defs></svg>
			this.config = {
				tag: 'svg',																// create the wheel svg
				attributes: {
					id: 'ui-wheel-svg'
				},
				els: [
					{
						tag: 'defs',
						els: [
							{
								tag: 'filter',
								attributes: {
									id: 'ui-wheel-blur'
								},
								els: [
									{
										tag: 'feGaussianBlur',
										attributes: {
											stdDeviation: 1
										}
									}
								]
							}
						]
					},
					{
						tag: 'g',																	// create the polar coordinate
						attributes: {
							id: 'ui-wheel-coordinate',
							transform: 'translate(' + this.left + ',' + this.top + ')'				// set the orgin of the coordinate to where the mouse was clicked
						},
						els: [
							{
								tag: 'g',															// create the center of the wheel
								els: [
									{
										tag: 'image',
										attributes: {
											id: 'ui-wheel-panel',
											x: -66,													// align the image to its center
											y: -66,
											width: 132,												// set image to its size
											height: 132,
											'xlink:href': 'styles/ui/images/wheel-background.png'
										},
										styles: {
											opacity: 0												// make it transparent initially so that the COW can fade in when shown
										}
									},
									{
										tag: 'g',
										attributes: {
											id: 'ui-wheel-notification'
										}
									},
									{
										tag: 'circle',
										attributes: {
											id: 'ui-wheel-nav-all',
											r: 0
										},
										styles: {
											fill: 'none',
											stroke: '#fff',
											'stroke-width': 5
										}
									},
									{
										tag: 'g',
										attributes: {
											id: 'ui-wheel-nav-selected'
										}
									},
									{
										tag: 'g',
										attributes: {
											id: 'ui-wheel-nav-cursor'
										}
									},
									{
										tag: 'circle',
										attributes: {
											id: 'ui-wheel-selection',
											r: 30
										},
										styles: {
											fill: 'none',
											'pointer-events': 'all'
										}
									}
								]
							},
							{
								tag: 'g',															// create the rings
								attributes: {
									id: 'ui-wheel-rings'
								}
							}
						]
					}
				]
			};
	
			this.wheel = d3.select('#ui-wheel');

			var _this = this;

			this.arcSelected = d3.svg.arc()
				.innerRadius(40)
				.outerRadius(44)
				.startAngle(function(d) { return _this.scale(d.start); })
				.endAngle(function(d) { return _this.scale(d.start + d.increment); });
			this.arcCursor = d3.svg.arc()
				.innerRadius(40.5)
				.outerRadius(43.5)
				.startAngle(function(d) { return _this.scale(d.start); })
				.endAngle(function(d) { return _this.scale(d.start + d.increment); });
		},
	
		create: function(parent, config) {
			var el = parent.append(config.tag);
			if(config.attributes) {
				for(var attr in config.attributes) {
					el.attr(attr, config.attributes[attr]);
				}
			}
			if(config.styles) {
				for(var style in config.styles) {
					el.style(style, config.styles[style]);
				}
			}
			if(config.els) {
				var _this = this;
				Ext.each(config.els, function(child) {
					_this.create(el, child);
				});
			}
		},

		hide: function() {
			d3.select('#ui-wheel-selection').on('click', null);	// disable click event

			this.updateRing(DigiCompass.Web.UI.Wheel.Item.Empty);

			d3.select('#ui-wheel-panel').transition().duration(50).style('opacity', 0);

			d3.select('#ui-wheel-nav-cursor').transition().delay(20).remove();
			d3.select('#ui-wheel-nav-selected').transition().remove();
			d3.select('#ui-wheel-nav-all').transition().delay(20).duration(100).attr('r', 50).transition()
				.delay(200).duration(50).ease('in-out'/* TODO */).attr('r', 30).style('stroke', '#666').transition()
				.delay(700).duration(50).ease('in-out'/* TODO */).attr('r', 15)

			d3.select('#ui-wheel-svg').transition().delay(700).remove();
		},
	
		show: function(xy) {
			if(!this.visible) {
				this.visible = true;
				d3.select('#ui-wheel-svg').remove();

				this.init(xy);
				this.create(this.wheel, this.config);

				var _this = this;

				d3.select('#ui-wheel-svg')
					.on('DOMNodeRemoved', function() {
						_this.visible = false;
					})
					.on('mousemove', function() {
//						fisheye.center(d3.mouse(this));
					});

				d3.select('#ui-wheel-selection').on('mousedown', function() {
					switch(d3.event.button) {
						case 2:
							_this.hide();
							_this.showExplode({x: d3.event.x, y: d3.event.y});
							break;
					}
				});

				var hammer = new Hammer(document.getElementById('ui-wheel-selection'), {
					tap_max_interval: 700 // seems to bee needed for IE8
				});

				hammer.ontap = function(e) {
					if(_this.selection.parent) {
						_this.selection = _this.selection.parent;
						_this.updateRing(_this.selection);
					}
					else {
						_this.hide();
					}
				};

				hammer.ontransformstart = function(e) {
					_this.hide();
					_this.showExplode({x: e.originalEvent.pageX, y: e.originalEvent.pageY});
				};
				//2012-10-30 yangjunping 注释 ondrag事件与split有冲突
				/*hammer.ondrag = function(e) {
					_this.left = e.originalEvent.pageX;
					_this.top = e.originalEvent.pageY;
					d3.select('#ui-wheel-coordinate').attr('transform', 'translate(' + _this.left + ',' + _this.top + ')');
				};*/

				d3.select('#ui-wheel-panel').transition().duration(50).ease('out-in'/* TODO */).style('opacity', 1);

				d3.select('#ui-wheel-nav-all').transition().duration(55).ease('out-in'/* TODO */).attr('r', 42);

				this.updateNav();

				this.updateRing(this.selection);
			}
		},

		updateNav: function() {
			if(this.list) {
				this.updateNavSelection();
				this.updateNavCursor(this.list.getCursor());
			}
		},

		updateNavSelection: function() {
			var _this = this;
			var total = this.list.getTotal();
			var selected = this.list.getSelectedIndex();
			var duration = 600 / total;
			var nav = d3.select('#ui-wheel-nav-selected').selectAll('path')
				.data(selected, function(d) { return 'ui-wheel-nav-selected-' + d.total + '-' + d.start + '-' + d.end; });
			nav.exit()
				.transition().duration(function(d) { return (d.end - d.start + 1) * duration; })
				.attrTween('d', function(d, i, a) {
					return function(t) {
						return _this.arcSelected({ start: d.start, increment: (d.end + 1 - d.start) * (1 - t) });
					}
				})
				.remove();
			nav.enter().append('path')
				.style('fill', '#999999')
				.transition().duration(function(d) { return (d.end - d.start + 1) * duration; })
				.attrTween('d', function(d, i, a) {
					return function(t) {
						return _this.arcSelected({ start: d.start, increment: (d.end + 1 - d.start) * t });
					}
				})
		},

		updateNavCursor: function(index) {
			var _this = this;
			var total = this.list.getTotal();
			var duration = 600 / total;
			var nav = d3.select('#ui-wheel-nav-cursor').selectAll('path')
				.data([{ start: index, total: total }], function(d) { return 'ui-wheel-nav-cursor-' + d.total + '-' + d.start; });
			nav.exit()
				.transition().duration(duration)
				.attrTween('d', function(d, i, a) {
					return function(t) {
						return _this.arcCursor({ start: d.start, increment: 1 - t });
					}
				}).remove();
			nav.enter().append('path')
				.style('fill', '#fdd97e')
				.transition().duration(duration)
				.attrTween('d', function(d, i, a) {
					return function(t) {
						return _this.arcCursor({ start: d.start, increment: t });
					}
				});

/*
			// alternative approach that represent the cursor as a dot in the middle of the arc
			var total = this.list.getTotal();
			var _this = this;
			var nav = d3.select('#ui-wheel-nav-cursor').selectAll('circle')
				.data([{ index: index, total: total }], function(d) { return 'ui-wheel-nav-cursor-' + d.total + '-' + d.index });
			nav.enter().append('circle')
				.style('fill', '#fdd97e')
				.attr('r', 2.5)
				.transition()
				.duration(20)
				.attr('transform', function(d) {
					var angle = (_this.scale(d.index) + _this.scale(d.index + 1)) / 2;
					var angle = _this.scale(d.index);
					var r = 42;
					var x = r * Math.sin(angle);
					var y = -r * Math.cos(angle);
					return 'translate(' + x + ',' + y + ')'; 
				});
			nav.exit().remove();
 */
		},

		setNavList: function(list) {
			this.list = list;
			this.scale = d3.scale.linear().domain([0, this.list.getTotal()]).range([0, Math.PI * 2]);

			this.updateNav();

			var _this = this;
			list.addListener('selectionChanged', function() { _this.updateNavSelection(); });
			list.addListener('cursorChanged', function(index) { _this.updateNavCursor(index); });
		},

		interpolateAngle: function(t) {
			return t <= t1 ? da1 / t1 * t : (da2 - da1) / (1 - t1) * t + da2 * (1 + (da1 / da2 - 1) / (1 - t1));
		},

		interpolateRadius: function(t, r) {
			return t <= t1 ? r * (1 - rr) / t1 * t + r * rr : r;
		},

		removeItems: function(items) {
			var _this = this;
			items.exit()
				.transition().duration(dt)
				.style('opacity', '0')
				.attrTween('transform', function(d, i, a) {
					var dl = d.level - _this.selection.level - 1;	// delta leval
					var r = r0 + ri * dl;							// radius of current ring (in which the item sits)
					return function(t) {
						var a = (d.a1 + da2 - _this.interpolateAngle(1 - t)) / 180 * Math.PI;
						var r1 = _this.interpolateRadius(1 - t, r)
						var x = Math.sin(a) * r1;
						var y = -Math.cos(a) * r1;
						return 'translate(' + x + ',' + y + ')';
					}
				})
				.remove();
		},

		updateItems: function(items) {
			var _this = this;
			items.enter().append('g')
				.style('opacity', '0')
				.transition().duration(dt)
				.style('opacity', '1')
				.attrTween('transform', function(d, i, a) {
					var dl = d.level - _this.selection.level - 1;	// delta leval
					var r = r0 + ri * dl;							// radius of current ring (in which the item sits)
					d.ai = r0 / r * ai0;							// angle interval, i.e. angle between adjacent items in the same ring
					d.a1 = d.parent.a1 - d.ai * (d.parent.children.length - 1) / 2 + d.ai * i;
					var a0 = d.a1 - da2;
					return function(t) {
						var a = (a0 + _this.interpolateAngle(t)) / 180 * Math.PI;
						var r1 = _this.interpolateRadius(t, r)
						var x = Math.sin(a) * r1;
						var y = -Math.cos(a) * r1;
						return 'translate(' + x + ',' + y + ')';
					}
				})
				.each(function(d) {
					var item = d3.select(this);
					var circle = item.append('circle')
						.style('pointer-events', 'all')
						.style('fill', '#282828')
						.style('stroke', '#fff')
						.style('stroke-width', 6)
						.style('opacity', 0.45)
//						.attr("filter", "url(#ui-wheel-blur)")
						.attr('r', 20.5)
						.on('mouseover', function(d) {
							var x = 60 * Math.sin(d.a1 / 180 * Math.PI);
							var y = -60 * Math.cos(d.a1 / 180 * Math.PI);
							d3.select(this)
								.style('opacity', 1)
								.transition().duration(100)
								.style('stroke-width', 10)
							d3.select(this.parentNode)
								.append('g')
								.attr('transform', 'translate(' + x + ',' + y + ')')
								.style('fill', '#2591ff')
								.append('text')
								.style('font-family', 'Calibri')
								.style('font-size', '12px')
								.style('font-weight', 'bold')
								.style('color', '#fff')
								.text(d.text);
						})
						.on('mouseout', function(d) {
							d3.select(this)
								.style('opacity', 0.45)
								.transition().duration(50)
								.style('stroke-width', 6)
							d3.select(this.parentNode)
								.select('g').remove();
						})
						.on('mousedown', function(d) {
							switch(d3.event.button) {
								case 2:
									_this.hide();
									_this.selection = d;
									_this.showExplode({x: d3.event.x, y: d3.event.y});
									break;
							}
						});

					var hammer = new Hammer(circle[0][0], {
						tap_max_interval: 700 // seems to bee needed for IE8
					});
					hammer.ontap = function(e) {
						var d = circle[0][0].__data__;
						if(d.children && d.children.length > 0){
							circle.transition().duration(50)
							.style('opacity', 1)
							.style('stroke', '#fdd97e')
							_this.updateRing(d);
						}else if (d.nameTag){
							_this.showPanel(d.nameTag);
						}
					};
					hammer.ondoubletap = function(e) {
//						var d = circle[0][0].__data__;
//						circle.transition().duration(50)
//						.style('opacity', 1)
//						.style('stroke', '#fdd97e')
//						_this.updateRing(d);
					};
					hammer.ontransformstart = function(e) {
						_this.hide();
						_this.selection = circle[0][0].__data__;
						_this.showExplode({x: e.originalEvent.pageX, y: e.originalEvent.pageY});
					};

					item.append('image')
						.attr('x', -18)
						.attr('y', -18)
						.attr('width', 36)
						.attr('height', 36)
						.attr('xlink:href', d.icon);
				});
		},

		updateRing: function(item) {
			var dl = item.level - this.selection.level;			// delta leval

			this.selection.a1 = a1;
			this.selection.ai = ai0;

			var ring = d3.select('#ui-wheel-rings').selectAll('.ui-wheel-ring')
				.data(d3.range(dl + 1), function(d) { return d; });

			this.removeItems(ring);

			var items = ring.enter().append('g')
				.attr('class', 'ui-wheel-ring')
				.selectAll('g')
				.data(function(d) { return item.getChildren(dl - d); }, function(d) { return d.id; });
			this.updateItems(items);

			items = ring.selectAll('g')
				.data(function(d) { return item.getChildren(dl - d); }, function(d) { return d.id; });

			this.removeItems(items);

			this.updateItems(items);
		},

		showExplode: function(p) {
			var el = Ext.get('ui-wheel');

			var radius = Math.min(el.getWidth(), el.getHeight()) / 2 * 1.1;
			
			var tree = d3.layout.tree()
				.size([360, radius - 120])
				.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

			var diagonal = d3.svg.diagonal.radial()
				.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

			var drag = d3.behavior.drag()
				.on('drag', function() {
					_this.left += d3.event.dx;
					_this.top += d3.event.dy;
					d3.select(this).attr('transform', 'translate(' + _this.left + ',' + _this.top + ')');
				});

			this.left = p.x;
			this.top = p.y;

			d3.select('#ui-wheel-svg').remove();
			d3.select("#ui-wheel")
				.append('div')
				.style('top', '10px')
				.style('left', '10px')
				.style('bottom', '10px')
				.style('right', '10px')
				.style('background-color', '#000')
				.style('opacity', 0.4)
				.style('position', 'absolute');

			var vis = d3.select("#ui-wheel")
				.append('div')
				.style('top', '10px')
				.style('left', '10px')
				.style('bottom', '10px')
				.style('right', '10px')
				.style('position', 'absolute')
				.append("svg")
				.append("g")
				.style('background-color', 'white')
				.attr("transform", "translate(" + (this.left - 10) + "," + (this.top - 10) + ")")
				.call(drag);

			var rx, ry;
			if (el.getWidth() > el.getHeight()) {
				rx = radius;
				ry = radius / 1.2;
			}
			else {
				rx = radius / 1.2;
				ry = radius;
			}
//			vis.append('rect')
//				.attr('x', -rx)
//				.attr('y', -ry)
//				.attr('width', rx * 2)
//				.attr('height', ry * 2)
//				.style('fill', 'white')
//				.style('fill-opacity', '1');

			var nodes = tree.nodes(this.selection);

			var link = vis.selectAll("path.link")
				.data(tree.links(nodes))
				.enter().append("path")
				.attr("class", "link")
				.attr("d", diagonal);

			var node = vis.selectAll("g.node")
				.data(nodes)
				.enter().append("g")
				.attr("class", "node")
				.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

			var _this = this;
			var circle = node.append("circle")
				.style('pointer-events', 'all')
				.attr("r", 4.5)
				.on('mouseover', function(d) {
					d3.select(this)
						.style('stroke', '#f00');
				})
				.on('mouseout', function(d) {
					d3.select(this)
						.style('stroke', 'steelblue');
				});

			var hammer = new Hammer(circle[0][0], {
				tap_max_interval: 700 // seems to bee needed for IE8
			});

			hammer.ontap = function(e) {
				_this.selection = circle[0][0].__data__;
				d3.select("#ui-wheel").selectAll("div").remove();
				_this.show([e.originalEvent.pageX, e.originalEvent.pageY]);
			};


			node.append("text")
				.attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
				.attr("dy", ".31em")
				.attr('fill', '#eeeeee')
				.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
				.attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
				.style('font-weight', 'bold')
				.style('font-size', '14')
				.text(function(d) { return d.text; });
		},

		panelOut: false,

		showPanel: function(nameTag) {
			if(!this.panelOut) {
				d3.select('#obj-exp').transition().duration(1000).style('left', '0px');
			}
			else {
//				d3.select('#obj-exp').transition().duration(1000).style('left', '-500px');
			}		
			this.panelOut = !this.panelOut;
			Ext.getCmp('obj-cat').setVisible(false);
			Ext.getCmp('obj-cat').removeAll();
			
			
			Ext.getCmp('objExtBtnSearchFieldId').setValue();
			var objExpPanel = Ext.getCmp('obj-exp');
			if(objExpPanel){
				//移除组建
				objExpPanel.show();
				objExpPanel.removeAll();				
			}
			var objExpPanel = Ext.getCmp('obj-details');
			if(objExpPanel){
				objExpPanel.show();
				 objExpPanel.removeAll();
			}
			//查询Scenario
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			try{				
				eval("fn_menu_"+nameTag+"()");
			}catch(e){
				console.log(e.message,e.stack)
				cometdfn.publish({MODULE_TYPE : nameTag,COMMAND : 'COMMAND_QUERY_LIST',queryParam:queryParam });
			}
			return;
			if(nameTag == 'STRATEGY_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					//移除组建
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				//查询Scenario
				var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
				DigiCompass.Web.UI.CometdPublish.scenarioPublish(queryParam);
				
				 
			}else if(nameTag == 'PORTFOLIO_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					//移除组建
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				//查询Portfolio
				DigiCompass.Web.UI.CometdPublish.portfolioPublish();
			}else if(nameTag == 'BUG_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					//移除组建
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				//查询bug
				DigiCompass.Web.UI.CometdPublish.bugPublish();
				
			}else if(nameTag == 'SITEGROUP_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.siteGroupPublish();
			}else if(nameTag == 'PLANNING_CYCLE_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.planningCyclePublish();
			}else if(nameTag == 'SNAPSHOT_VERSION_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.SnapshotVersioinPublish();
			}else if(nameTag == 'PLANNED_SITEGROUP_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.plannedSiteGroupPublish();
			}else if(nameTag == 'PLANNED_SITE_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.plannedSitePublish();
			}else if(nameTag == 'SPECTRUMREGION_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.spectrumRegionPublish();
			}else if(nameTag == 'FINANCIAL_CATEGORY_TYPE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.financialCategoryType();
			}else if(nameTag == 'FINANCIAL_CATEGORY'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.financialCategory();
			}else if(nameTag == 'TECHNOLOGY'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.technologyPublish();
			}else if(nameTag == 'WORKFLOW_CATEGORY'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.workFlowCategory();
			}else if(nameTag == 'WORKFLOW_CATEGORY_TYPE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.workFlowCategoryType();
			}else if(nameTag == 'RESOURCE_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.resourcePublish();
			}else if(nameTag == 'RESOURCE_GROUP_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.resourceTypePublish();
			}else if(nameTag == 'POLYGON_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.polygonPublish();
			}else if(nameTag == 'STATE_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.statePublish();
			}else if(nameTag == 'FINANCIAL_COST_DISTRIBUTION'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.financialCostDistribution();
			}else if(nameTag == 'MSA_ID'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.resourceMSA();
			}else if(nameTag == 'WORKFLOW_TEMPLATE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.workFlowTemplate();
			}else if(nameTag === 'EQUIPMENT_TEMPLATE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.equipmentTemplatePublish();
			}else if(nameTag === 'EQUIPMENT_TEMPLATEV2'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.equipmentTemplateV2Publish();
			}else if(nameTag === 'EQUIPMENT_RELATION'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.equipmentRelationPublish();
			}else if(nameTag === 'EQUIPMENT_TYPE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.equipmentType();
			}else if(nameTag === 'CHANGE_REQUEST'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.changeRequest();
			} else if(nameTag === "VENDOR_MGT"){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.vendorMgtPublish();
			} else if(nameTag === "VENDOR_OPERATION"){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.vendorOperationPublish();
			} else if(nameTag === 'CHANGE_APPROVAL'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.changeApprove();
			} else if(nameTag === 'CHANGE_CANCEL'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.changeCancel();
			}else if(nameTag === 'CHANGE_RELEASE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.changeRelease();
			}else if(nameTag === 'CHANGE_ACCEPT'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.changeAccept();
			}else if(nameTag === 'RELEASE_MANAGER'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.releaseManager();
			}else if(nameTag === 'RELEASE_OPERATION_APPROVE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.releaseOperationApprove();
			}else if(nameTag === 'COMPETE_APPROVE'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.completeApprove();
			}else if(nameTag === 'CHANGEREQUEST_COUNT_REPORT'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.changeRequestCountReport();
			}else if(nameTag === 'SERVICE_COUNT_REPORT'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.serviceCountReport();
			}else if(nameTag === 'SITE_CR_HISTORY_REPORT'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.crSiteHistoryReport();
			}else if(nameTag === 'SITE_CR_ACTIVE_REPORT'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.crSiteActiveReport();
			}else if(nameTag === 'PROJECT_CR_ACTIVE_REPORT'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.crProjectActiveReport();
			}else if(nameTag === 'PROJECT_CR_FINANCIAL_REPORT'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.crProjectFinalcialReport();
			} else if(nameTag == "REFERENCE_SAP_ORDER"){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.sapOrderPublish();
			} else if(nameTag == "REFERENCE_BORIS_ORDER"){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.borisOrderPublish();
			} else if(nameTag == "ROLE_DEFINITION_ID"){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.rolePublish();
			}else if(nameTag === 'NOTIFICATION_MANAGER'){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.app.notificationManager.show();
			}else if(nameTag == "LOG_OUT"){
				window.location.href = "/j_spring_security_logout";
			}else if(nameTag == "CHANGE_PASSWORD"){
				DigiCompass.password.changePassword(true);
			}else if(nameTag == "USER_MGT"){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.userMgtPublish();
			} else if(nameTag == "USER_GROUP_MGT"){
				Ext.getCmp('objExtBtnSearchFieldId').setValue();
				var objExpPanel = Ext.getCmp('obj-exp');
				if(objExpPanel){
					objExpPanel.removeAll();
				}
				var objExpPanel = Ext.getCmp('obj-details');
				if(objExpPanel){
					 objExpPanel.removeAll();
				}
				DigiCompass.Web.UI.CometdPublish.userGroupMgtPublish();
			} else if(nameTag == "MAIL_SETTING"){
				DigiCompass.sys.settings();
			} else if(nameTag == "SYSTEM_SETTINGS"){
				DigiCompass.sys.systemSettings();
			} else if(nameTag == "SYSTEM_ABOUT"){
				DigiCompass.sys.about();
			}
		},

		reportOut: false,
		
		showDetail: function(){

			
			if(this.reportOut) {
				//d3.select('#obj-details').transition().duration(1000).style('left', '-1000px');
//				this.reportOut = false;
				return;
			}
//			d3.select("#obj-details").select(".x-panel-body")
			d3.select("#obj-details").select(".x-panel-body")
				.style('width', null)
				.style('height', null)
				.style('top', 0)
				.style('left', 0)
				.style('bottom', 0)
				.style('right', 0)
				.select("svg").remove();

			if(!this.reportOut) {
		    	var el = document.getElementsByClassName('ui-workbench')[0];
		    	var w = el.clientWidth - 290;
		    	var h = el.clientHeight;
//		    	d3.select('#obj-details')
		    	d3.select('#obj-details')
						.style('position', 'absolute')
		    		.style('left', '-1000px')
		    		.style('width',  w + 'px')
		    		.style('height', h + 'px')
						.classed('x-hide-display', null)
		    	    .transition().duration(1000).style('left', parseInt(d3.select("#obj-exp").style('width'), 10) + 5 + 'px');
					this.reportOut = true;
			}
		},

		showReport: function(data) {
			if(!data.length && this.reportOut) {
//				d3.select('#obj-details').transition().duration(1000).style('left', '-1000px');
				d3.select('#obj-details').transition().duration(1000).style('left', '-1000px');
				
				this.reportOut = false;
				return;
			}

//			d3.select("#obj-details").select(".x-panel-body")
			d3.select("#obj-details").select(".x-panel-body")
				.style('width', null)
				.style('height', null)
				.style('top', 0)
				.style('left', 0)
				.style('bottom', 0)
				.style('right', 0)
				.select("svg").remove();

			if(data.length && !this.reportOut) {
		    	var el = document.getElementsByClassName('ui-workbench')[0];
		    	var w = el.clientWidth - 290;
		    	var h = el.clientHeight;
//		    	d3.select('#obj-details')
		    	d3.select('#obj-details')
						.style('position', 'absolute')
		    		.style('left', '-1000px')
		    		.style('width',  w + 'px')
		    		.style('height', h + 'px')
						.classed('x-hide-display', null)
		    		.transition().duration(1000).style('left', '280px');
					this.reportOut = true;
			}

			function x(d) { return d.income; }
			function y(d) { return d.lifeExpectancy; }
			function radius(d) { return d.population; }
			function color(d) { return d.region; }
			function key(d) { return d.name; }
			
//			// Chart dimensions.
//			var el = Ext.get('obj-details');
//			var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
//				width = el.getWidth() - 40 - margin.right,
//				height = el.getHeight() - 13 - margin.top - margin.bottom;
//			
//			// Various scales. These domains make assumptions of data, naturally.
//			var xScale = d3.scale.log().domain([300, 1e5]).range([0, width]),
//				yScale = d3.scale.linear().domain([10, 85]).range([height, 0]),
//				radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]),
//				colorScale = d3.scale.category10();
//			
//			// The x & y axes.
//			var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
//				yAxis = d3.svg.axis().scale(yScale).orient("left");
//			
//			// Create the SVG container and set the origin.
//			var svg = d3.select("#obj-details").select(".x-panel-body").append("svg")
//				.attr("width", width + margin.left + margin.right)
//				.attr("height", height + margin.top + margin.bottom)
//			  .append("g")
//				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//			
//			// Add the x-axis.
//			svg.append("g")
//				.attr("class", "x axis")
//				.attr("transform", "translate(0," + height + ")")
//				.call(xAxis);
//			
//			// Add the y-axis.
//			svg.append("g")
//				.attr("class", "y axis")
//				.call(yAxis);
//			
//			// Add an x-axis label.
//			svg.append("text")
//				.attr("class", "x label")
//				.attr("text-anchor", "end")
//				.attr("x", width)
//				.attr("y", height - 6)
//				.text("income per capita, inflation-adjusted (dollars)");
//			
//			// Add a y-axis label.
//			svg.append("text")
//				.attr("class", "y label")
//				.attr("text-anchor", "end")
//				.attr("y", 6)
//				.attr("dy", ".75em")
//				.attr("transform", "rotate(-90)")
//				.text("life expectancy (years)");
//			
//			// Add the year label; the value is set on transition.
//			var label = svg.append("text")
//				.attr("class", "year label")
//				.attr("text-anchor", "end")
//				.attr("y", height - 24)
//				.attr("x", width);
//			
//			// Load the data.
//
//			
//			  // A bisector since many nation's data is sparsely-defined.
//			  var bisect = d3.bisector(function(d) { return d[0]; });
//			
//			  // Add a dot per nation. Initialize the data at 1800, and set the colors.
//			  var dot = svg.append("g")
//				  .attr("class", "dots")
//				.selectAll(".dot")
//				  .data(interpolateData(1800))
//				.enter().append("circle")
//				  .attr("class", "dot")
//				  .style("fill", function(d) { return colorScale(color(d)); })
//				  .call(position)
//				  .sort(order);
//			
//			  // Add a title.
//			  dot.append("title")
//				  .text(function(d) { return d.name; });
//			
//			  // Start a transition that interpolates the data based on year.
//			  svg.transition()
//				  .duration(30000)
//				  .ease("linear")
//				  .tween("year", tweenYear)
//				  .each("end", enableInteraction);
//			
//			  // Positions the dots based on data.
//			  function position(dot) {
//				dot .attr("cx", function(d) { return xScale(x(d)); })
//					.attr("cy", function(d) { return yScale(y(d)); })
//					.attr("r", function(d) { return radiusScale(radius(d)); });
//			  }
//			
//			  // Defines a sort order so that the smallest dots are drawn on top.
//			  function order(a, b) {
//				return radius(b) - radius(a);
//			  }
//			
//			  // After the transition finishes, you can mouseover to change the year.
//			  function enableInteraction() {
//				var box = label.node().getBBox();
//			
//				var yearScale = d3.scale.linear()
//					.domain([1800, 2009])
//					.range([box.x + 10, box.x + box.width - 10])
//					.clamp(true);
//			
//				svg.append("rect")
//					.attr("class", "overlay")
//					.attr("x", box.x)
//					.attr("y", box.y)
//					.attr("width", box.width)
//					.attr("height", box.height)
//					.style("pointer-events", "all")
//					.on("mouseover", mouseover)
//					.on("mouseout", mouseout)
//					.on("mousemove", mousemove)
//					.on("touchmove", mousemove);
//			
//				function mouseover() {
//				  label.classed("active", true);
//				}
//			
//				function mouseout() {
//				  label.classed("active", false);
//				}
//			
//				function mousemove() {
//				  displayYear(yearScale.invert(d3.mouse(this)[0]));
//				}
//			  }
//			
//			  // Tweens the entire chart by first tweening the year, and then the data.
//			  // For the interpolated data, the dots and label are redrawn.
//			  function tweenYear() {
//				var year = d3.interpolateNumber(1800, 2009);
//				return function(t) { displayYear(year(t)); };
//			  }
//			
//			  // Updates the display to show the specified year.
//			  function displayYear(year) {
//				dot.data(interpolateData(year), key).call(position).sort(order);
//				label.text(Math.round(year));
//			  }
//			
//			  // Interpolates the dataset for the given (fractional) year.
//			  function interpolateData(year) {
//				return data.map(function(d) {
//				  return {
//					name: d.name,
//					region: d.region,
//					income: interpolateValues(d.income, year),
//					population: interpolateValues(d.population, year),
//					lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
//				  };
//				});
//			  }
//			
//			  // Finds (and possibly interpolates) the value for the specified year.
//			  function interpolateValues(values, year) {
//				var i = bisect.left(values, year, 0, values.length - 1),
//					a = values[i];
//				if (i > 0) {
//				  var b = values[i - 1],
//					  t = (year - a[0]) / (b[0] - a[0]);
//				  return a[1] * (1 - t) + b[1] * t;
//				}
//				return a[1];
//			  }
		}
	};
	
function fn_menu_NotificationModule(){
	DigiCompass.Web.app.notificationManager.show();
};
function fn_menu_USER_SETTINGS_MODULE(){
	DigiCompass.sys.settings();
};
function fn_menu_SYSTEM_SETTINGS_MODULE(){
	DigiCompass.sys.systemSettings();
};
function fn_menu_MOD_EQUIPMENT_TEMPLATEV2(){
	DigiCompass.Web.UI.CometdPublish.equipmentTemplateV2Publish();
};
function fn_menu_CHANGE_PASSWORD(){
	DigiCompass.password.changePassword(true);
};
function fn_menu_LOG_OUT(){
	window.location.href = "/j_spring_security_logout";
};
function fn_menu_SYSTEM_ABOUT(){
	DigiCompass.sys.about();
};

function fn_menu_MOD_CHANGE_REQUEST(){
	DigiCompass.Web.app.changeRequest.show(null, null, 'MOD_CHANGE_REQUEST');
};
function fn_menu_MOD_CHANGE_REQUEST_APPROVE(){
	DigiCompass.Web.app.changeRequest.show('STATUS_CHANGEREQUEST', null, 'MOD_CHANGE_REQUEST_APPROVE');
};
function fn_menu_MOD_CHANGE_REQUEST_CANCEL(){
	DigiCompass.Web.app.changeRequest.show('STATUS_CHANGE_CANCEL', null, 'MOD_CHANGE_REQUEST_CANCEL');
};
function fn_menu_MOD_CHANGE_REQUEST_RELEASE(){
	DigiCompass.Web.app.changeRequest.show('STATUS_APPROVED', null, 'MOD_CHANGE_REQUEST_RELEASE');
};
function fn_menu_MOD_CHANGE_REQUEST_ACCEPT(){
	DigiCompass.Web.app.changeRequest.show('STATUS_VENDERED', null, 'MOD_CHANGE_REQUEST_ACCEPT');
};
function fn_menu_MOD_CHANGE_REQUEST_ACCPET_APPROVE(){
	DigiCompass.Web.app.changeRequest.show('STATUS_COMPLATED', null, 'MOD_CHANGE_REQUEST_ACCPET_APPROVE');
};
function fn_menu_MOD_CHANGE_REQUEST_RELEASE_OPERATION_APPROVE(){
	DigiCompass.Web.app.changeRequest.show('STATUS_CANCEL', null, 'MOD_CHANGE_REQUEST_RELEASE_OPERATION_APPROVE','COMMAND_QUERY_LIST','cancel');
};
function fn_menu_MOD_CHANGE_REQUEST_RELEASE_OPERATION(){
	DigiCompass.Web.app.changeRequest.show('STATUS_CHANGE_RELEASEMANAGER', null, 'MOD_CHANGE_REQUEST_RELEASE_OPERATION');
};
function fn_menu_MOD_FINANCIAL_CATEGORY(){
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_COMBOX_LIST'});
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_TECHNOLOGY_LIST'});
	//cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_PORTFOLIO_LIST'});
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_SITE_TYPE_LIST'});
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_REGION_LIST'});
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_POLYGON_LIST'});
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_STATE_LIST'});
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_LIST',queryParam:null});
};
function fn_menu_SERVICE_TEMPLATE_MODULE(){
	cometdfn.publish({MODULE_TYPE : 'SERVICE_TEMPLATE_MODULE',COMMAND : 'COMMAND_QUERY_LIST',queryParam:null });
	cometdfn.publish({MODULE_TYPE : 'MOD_FINANCIAL_CATEGORY',COMMAND : 'COMMAND_QUERY_COMBOX_LIST'});	
};
function fn_menu_MOD_REPORT_CHANGE_REQUEST(){
	DigiCompass.Web.app.planning.grid.ChangeRequestReport.buildSiteReport();
};
function fn_menu_FcReportsWbs(){
	var wbsReport = new WbsReport();
	wbsReport.render();
};
function fn_menu_FcReportsPo(){
	var poReport = new DigiCompass.Web.app.PoReport();
	poReport.render();
}
function fn_menu_FcReportsAvac(){
	var avacReport = new DigiCompass.Web.app.AvacReport();
	avacReport.render();
}
function fn_menu_IvReportsPlannedCells(){
	var cellReport = new DigiCompass.Web.app.CellReport();
	cellReport.render();
}
function fn_menu_IvReportsActiveCells(){
	var cellReport = new DigiCompass.Web.app.ActiveCellReport();
	cellReport.render();
}
function fn_menu_IvReportsExcludedCells(){
	var cellReport = new DigiCompass.Web.app.ExcludedCellReport();
	cellReport.render();
}
function fn_menu_IvReportsHardwareConf(){	
	var hardConfReport = new DigiCompass.Web.app.HardConfReport();
	hardConfReport.render();
}
function fn_menu_TRIGGERING_MODULE(){
	var objExpPanel = Ext.getCmp('obj-exp');
	if(objExpPanel){
		//移除组建
		objExpPanel.hide();					
	}
	var objExpPanel = Ext.getCmp('obj-details');
	if(objExpPanel){
		objExpPanel.hide();			
	}
	DigiCompass.Web.app.triggering.showGSBView();
};
function fn_menu_KPI_DEFINE_MODULE(){
	var objExpPanel = Ext.getCmp('obj-exp');
	if(objExpPanel){
		//移除组建
		objExpPanel.hide();					
	}
	var objExpPanel = Ext.getCmp('obj-details');
	if(objExpPanel){
		objExpPanel.hide();			
	}
	DigiCompass.Web.app.triggering.showKpiDefineView();
};
function fn_menu_NETWORK_OBJECT_HIERARCHY_MODULE(){
	var objExpPanel = Ext.getCmp('obj-exp');
	if(objExpPanel){
		//移除组建
		objExpPanel.hide();					
	}
	var objExpPanel = Ext.getCmp('obj-details');
	if(objExpPanel){
		objExpPanel.hide();			
	}
	DigiCompass.Web.app.triggering.showNetworkObjHierarchyView();
}
function fn_menu_TRIGGER_CONDITION_MODULE(){
	var objExpPanel = Ext.getCmp('obj-exp');
	if(objExpPanel){
		//移除组建
		objExpPanel.hide();					
	}
	var objExpPanel = Ext.getCmp('obj-details');
	if(objExpPanel){
		objExpPanel.hide();			
	}
	DigiCompass.Web.app.triggering.showTriggerConditionView();
}
function fn_menu_EFORM_MODULE(){
	DigiCompass.Web.app.eform.showEformView();
}
function fn_menu_EFORM_CATALOGUE_MODULE(){
	DigiCompass.Web.app.eform.showEformCatExp();
}
function fn_menu_MOD_TRIGGER_CHANGE_REQUEST(){
	//cometdfn.publish({MODULE_TYPE : 'MOD_TRIGGER_CHANGE_REQUEST',COMMAND : 'COMMAND_QUERY_LIST',queryParam:null });
	DigiCompass.Web.app.triggering.TriggerCr.showView();
};
function fn_menu_SITE_TYPE(){
	var siteType = new DigiCompass.Web.app.SiteType();
	siteType.showObjExp();
};
function fn_menu_TECH_MODULE(){
	var tech = new DigiCompass.Web.app.Tech();
	tech.showObjExp();
};
function fn_menu_BAND_MODULE(){
	var band = new DigiCompass.Web.app.Band();
	band.showObjExp();
};
})());











