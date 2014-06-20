(function(){
	var ns = Ext.namespace('DigiCompass.Web.app.svgV2');
		
	/**
	 * memeber method
	 */
	// init method
	ns.initializeSvg = function(args) {
		// arguments
		var width = args.width,
			height = args.height,
			svgId = getSvgId(args.svgId),
			namespace = args.namespace;
		
		if (!namespace) {
			namespace = ns;
		}
		
		namespace.myWidth = width;
		namespace.myHeight = height;
		namespace.svgId = svgId;
		// mouse event vars
		namespace.selected_nodes = [];
		namespace.current_selected_node = null;
		namespace.current_selected_link = null;
		namespace.mousedown_link = null;
		namespace.mousedown_node = null;
		namespace.mouseup_node = null;
		namespace.isActivate = namespace.isActivate || true;
		
		var _svg = d3.select('#' + svgId).select('svg');
		if (_svg) {
			_svg.remove();
		}
		namespace.svg = d3.select('#' + svgId)
			.append('svg')
		    .attr('width', width)
		    .attr('height', height)
			.attr('id','svgMain'+svgId)
		    .attr('pointer-events', 'all')
		
		namespace.svg = namespace.svg.append('svg:g')
	    	.call(d3.behavior.zoom().on('zoom', function(){ns.rescale(namespace);}))
		    .on('dblclick.zoom', null)
		    .append('svg:g')
		    .attr('class', 'control')
		    .on('mousemove', function(){mousemove(namespace);})
		    .on('mousedown', function(){mousedown(namespace);})
		    .on('mouseup', function(){mouseup(namespace);});

		namespace.svg.append('rect').attr("class", svgId + "svgForceV2DragRectClass").attr("x", 0).attr("y", 0)
		   .attr('width', width).attr('height', height).attr('fill', 'white').style("opacity", 1e-6);

		namespace.lastNodeId = 0;

		// init D3 force layout
		namespace.force = d3.layout.force()
		    .nodes([])
		    .links([])
		    .size([width, height])
		    .linkDistance(150)
		    .charge(-500)
		    .on('tick', function(){tick(namespace);});

		// define arrow markers for graph links
		namespace.svg.append('svg:defs').append('svg:marker')
		    .attr('id', 'end-arrow-'+namespace.id)
		    .attr('viewBox', '0 -5 10 10')
		    .attr('refX', 6)
		    .attr('markerWidth', 3)
		    .attr('markerHeight', 3)
		    .attr('orient', 'auto')
		  .append('svg:path')
		    .attr('d', 'M0,-5L10,0L0,5')
		    .attr('fill', '#000');

		namespace.svg.append('svg:defs').append('svg:marker')
		    .attr('id', 'start-arrow-'+namespace.id)
		    .attr('viewBox', '0 -5 10 10')
		    .attr('refX', 4)
		    .attr('markerWidth', 3)
		    .attr('markerHeight', 3)
		    .attr('orient', 'auto')
		  .append('svg:path')
		    .attr('d', 'M10,-5L0,0L10,5')
		    .attr('fill', '#000');
//		    .attr('fill', '#ff0000');


		// line displayed when dragging new nodes
		namespace.drag_line = namespace.svg.append('svg:path')
		  		 .attr('class', 'link dragline hidden')
		  		 .attr('d', 'M0,0L0,0');

		namespace.svg.append('svg:g').attr('class', 'links');
		namespace.svg.append('svg:g').attr('class', 'nodes');

		// handles to link and node element groups
		namespace.nodes = namespace.force.nodes();
		namespace.links = namespace.force.links();
		namespace.node = namespace.svg.select('.nodes').selectAll('.node_container');
		namespace.link = namespace.svg.select('.links').selectAll('.link_container');
		
		namespace.nodesMap = new com.digicompass.equipment.Map();
		
		d3.select(window)
			.on('keydown.' + svgId, function(){
				if (namespace.keydown) {
					namespace.keydown();
				} else {
					keydown(namespace);
				}
			}).on('keyup.' + svgId, function(){
				if (namespace.keyup) {
					namespace.keyup();
				} else {
					keyup(namespace);
				}
			});
		  
		document.onselectstart = new Function('event.returnValue=false;');
	}
	
	var genaterId = function(node){
		var s = node.serialNumber.replace("#","_");
		for(var i in s.split("@")){
			s = s.replace("@","_");
		}
		return "node_img_" + s;
	};
	
	// redraw force layout
	ns.redraw = function(namespace) {
		var data = initNodesRelation(namespace);
		
		// path (link) group
		namespace.link = namespace.link.data(data.links);
		
     	var g = namespace.link.enter().append('svg:g')
		  	  		     .attr('class', 'link_container')
     					 .attr('id',function(d){return d.id;});
		// add new links
		g.append('svg:path')
		 .attr('class', 'link')
		 .classed('link_selected', function(d) {return d === namespace.current_selected_link; })
		 .style('marker-start', function(d) {
			return d.left ? 'url(#start-arrow-'+namespace.id+')' : ''; })
		 .style('marker-end', function(d) {
			return d.right ? 'url(#end-arrow-'+namespace.id+')' : ''; })
		 .on('mousedown', function(d) {
			 if (namespace.linkMousedown) {
				 namespace.linkMousedown(d);
			 } else {
				 linkMousedown(d, namespace);
			 }
		 }).on('dblclick', function(d){
			 if (namespace.linkDblClick) {
				 namespace.linkDblClick(d);
			 } else {
				 linkDblClick(d, namespace);
			 }
		 })
		  
		g.append('svg:g')
		 .attr('class', 'relation')
		 .attr('transform', calculateAngle)
		 .append('svg:text')
		 .attr('class', 'relation_text')
		 .attr('style', 'text-anchor:middle;font-size:13;')
		 .attr('font-weight', 'normal')
		 .text(function(d){
			 return createText(d, namespace);
		 });
		  
		//update existing links
		namespace.link.select('path')
				 .classed('link_selected', function(d) { return d === namespace.current_selected_link; })
				 .style('marker-start', function(d) { return d.left ? 'url(#start-arrow-'+namespace.id+')' : ''; })
				 .style('marker-end', function(d) { return d.right ? 'url(#end-arrow-'+namespace.id+')' : ''; });
		  
		namespace.link.select('.relation').select('text').classed('link_selected', function(d) { return d === namespace.current_selected_link; });

		// remove old links
		namespace.link.exit().remove();

		// node (node) group
		// NB: the function arg is crucial here! nodes are known by id, not by index!
		namespace.node = namespace.node.data(data.nodes, function(d) { return d.serialNumber; });

	    // update existing nodes (reflexive & selected visual states)
		//  node.selectAll('node')
//		    .style('fill', function(d) { return (d === current_selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
//		    .classed('reflexive', function(d) { return d.reflexive; });

		// add new nodes
		var g = namespace.node.enter().append('svg:g')
		  				 .attr('class', 'node_container')
          				 .attr('id',function(d){return "node_"+d.serialNumber;});
		
		g.append('svg:image')
		  .attr('xlink:href', function(d){return d.icon ? d.icon : ((d.iconFlagShow || d.iconFlag) ? getEquipmentIcon(d.iconFlagShow || d.iconFlag, "unSel") : ns.equipImg.unSel);})
		 .attr('class', 'node')
		 .attr('id',function(d){return genaterId(d); })
		 .attr('x', '-8px')
		 .attr('y', '-8px')
		 .attr('width','16px')
		 .attr('height', '16px');
		 // .attr('width',function(d){
			// var hls = 0;
			// if(d.hiddenLinks){
				// hls = d.hiddenLinks.length;
			// };
			// return ((16 + hls*0)+'px'); })
		 // .attr('height',function(d){
			// var hls = 0;
			// if(d.hiddenLinks){
				// hls = d.hiddenLinks.length;
			// };
			// return ((16 + hls*0)+'px'); });
		if(namespace.isActivate){
			g.on('mouseover', function(d) {
				 	if (namespace.nodeMouseover) {
				 		namespace.nodeMouseover(d);
				 	} else {
				 		nodeMouseover(d, namespace, this);
				 	}
			})
			.on('click',function(d){
			  if(ns.foucseNode!=null){
				d3.select("#"+genaterId(ns.foucseNode)).attr('xlink:href',ns.foucseNode.icon);
			  };
			  d3.select("#"+genaterId(d)).attr('xlink:href', function(d){
				  return (d.iconFlagShow || d.iconFlag) ? getEquipmentIcon(d.iconFlagShow || d.iconFlag, "select") : ns.equipImg.select;
			  });
			  
			  ns.foucseNode = d;
			  d.click();
//	    	  d3.select("#img_"+d.serialNumber).classed('hidden', true);
			})
			.on('mouseout', function(d) {
			 	if (namespace.nodeMouseout) {
			 		namespace.nodeMouseout(d);
			 	} else {
			 		nodeMouseout(d, namespace, this); 
			 	}
			})
			.on('mousedown', function(d) {
			 	if (namespace.nodeMousedown) {
			 		namespace.nodeMousedown(d);
			 	} else {
			 		nodeMousedown(d, namespace, this);	
			 	}
			})
			.on('mouseup', function(d) {
			 	if (namespace.nodeMouseup) {
			 		namespace.nodeMouseup(d);
			 	} else {
			 		nodeMouseup(d, namespace, this);
			 	}
			});
		}
		  // show node IDs
		  
		g.append('svg:text')
		 .attr('class', 'node_text')
		 .attr('dx', 12)
		 .attr('dy', '.35em')
		 .text(createNodeText);
		  
		namespace.node.classed('node_selected', function(d) {
			return nodeSelectedFn(d, namespace);
		});

		// remove old nodes
		namespace.node.exit().remove();
		
		if(namespace.current_selected_link){
			d3.selectAll('.node_container').selectAll("image")
				.attr('xlink:href', function(d){ return d.icon ? d.icon : ((d.iconFlagShow || d.iconFlag) ? getEquipmentIcon(d.iconFlagShow || d.iconFlag, "unSel") : ns.equipImg.unSel); })
		}
		
		//if(d3.event) d3.event.preventDefault();

		// set the graph in motion
		namespace.force.start();
	}
	
	ns.resetMouseVars = function(namespace) {
		namespace.mousedown_node = null;
		namespace.mouseup_node = null;
		namespace.mousedown_link = null;
	}
	
	ns.rescale = function(namespace) {
	    var trans=d3.event.translate;
	    var scale=d3.event.scale;
	    namespace.svg.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
	}
	
	ns.setSize = function(namespace,width,height){
		ns.myWidth = width;
		namespace.myWidth = width;
		ns.myHeight = height;
		namespace.myHeight = height;
		d3.select("#svgMain"+getSvgId(namespace.id)).attr('width',width).attr('height',height);
		d3.select("." + namespace.svgId + "svgForceV2DragRectClass").attr('width',width).attr('height',height);
	}
	
	var getSvgId = function(id){
		return id + "-body";
	};
	
	/**
	 * link private method
	 */
	
	function linkMousedown(d, namespace) {
		if (d3.event.ctrlKey) {
			return ;
		}
	    // select link
		namespace.mousedown_link = d;
	    if (namespace.mousedown_link === namespace.current_selected_link) {
	    	namespace.current_selected_link = null;
	    } else {
	    	namespace.current_selected_link = namespace.mousedown_link;
	    }
	    deSelectAllNodes(namespace)
	    
	    ns.redraw(namespace);
	}
	
	function deSelectAllNodes(namespace, f){
	    if(!f) namespace.selected_nodes = [];
		namespace.current_selected_node = null;
	    d3.selectAll("._nodeSelectedConfigBtnClass_").attr("_needdisabled", true);
	}
	
	function linkDblClick(d, namespace){
		if (d3.event.ctrlKey) return;
		
		namespace.mousedown_link = d;
		var source = d.source,
		    target = d.target,
		    _source = namespace.nodesMap.getNode(source.serialNumber),
	        _target = namespace.nodesMap.getNode(target.serialNumber),
			ar = {
				source: source,
		    	target: target,
		    	_source: _source,
		    	_target: _target,
		    	sourceField: source.text,
		    	sourceValue: d.properties[0].defaultValue,
		    	targetField: target.text,
		    	targetValue: d.properties[1].defaultValue,
		    	fn: function(datas, ns, node1, node2){
			        ns.current_selected_link = ns.mousedown_link;
					var sourceValue_ = datas[0].defaultValue,
						targetValue_ = datas[1].defaultValue,
						source_ = ns.current_selected_link.source,
						target_ = ns.current_selected_link.target,
						properties_ = [{'id': source_.serialNumber, 'name': source_.text, 'defaultValue': sourceValue_},
					                  {'id': target_.serialNumber, 'name': target_.text, 'defaultValue': targetValue_}];
					ns.mousedown_link = {source: source_, target: target_, left: false, right: true, properties: properties_};
					node1.removeRelation(node2);
			        ns.nodesMap.line(node1, node2, sourceValue_, targetValue_ == "N" ? -1 : targetValue_);
	
			        deSelectAllNodes(namespace)
			        
			        d.properties[1].defaultValue = targetValue_;
				      
			        DigiCompass.Web.app.svgV2.redraw(ns);
			        ns.linkItemClick();
				}
			}
		updateLinkWin(ar.fn, ar, namespace);
	}
	
	function updateLinkWin(fn, args, namespace) {
		var linkWin = Ext.getCmp('linkWinId_');
		if (linkWin) return linkWin;
		
		var sourceField = '';
		var sourceValue = '';
		var targetField = '';
		var targetValue = '';
		var sourceSN, targetSN;
		var callbackFn, source, target, _source, _target, direction;
		sourceField = args.sourceField;
		sourceValue = args.sourceValue;
		targetField = args.targetField;
		targetValue = args.targetValue;
		callbackFn = args.fn;
		source = args.source;
		target = args.target;
		_source = args._source;
		_target = args._target;
		direction = args.direction;
		
		var linkForm = Ext.create('Ext.form.Panel', {
			layout: 'form',
			fieldDefaults: {
				labelAlign: 'left',
	            msgTarget: 'side',
	            labelWidth: 100
	        },
	        width: '100%',
	        defaults: {
	            anchor: '100%'
	        },
	        defaultType: 'textfield',
	        items: [{
	            xtype: 'container',
	            layout:'vbox',
	            padding: '5px 5px 0px 5px',
	            items:[{
	                xtype: 'container',
	                flex: 1,
	                border:false,
	                layout: 'anchor',
	                defaultType: 'textfield',
	                items: [{
	                	id: 'sourceFieldId_',
	                    fieldLabel: sourceField,
	                    name: 'source',
	    	            readOnly: true,
	                    anchor: '95%',
	                    value: sourceValue
	                }]
	            },{
		            xtype: 'container',
		            layout:'hbox',
		            items:[{
		                xtype: 'container',
		                flex: 5,
		                border:false,
		                layout: 'anchor',
		                items: [{
		                	id: 'targetFieldId_',
		                	xtype: 'numberfield',
		    	            fieldLabel: targetField,
		    	            name: 'target',
		    	            minValue: 1,
		    	            anchor:'95%',
		    	            value: (targetValue == "N" || targetValue == -1) ? 1 : targetValue
		                }]
		            }, {
		                xtype: 'container',
		                flex: 1,
		                border: false,
		                layout: 'anchor',
		                margin: '0 0 0 5px',
		                items: [{
		                	id: 'targetNId_',
		                	xtype: 'checkbox',
		    	            name: 'targetN',
		    	            allowBlank: false,
		    	            value : targetValue == "N" || targetValue == -1,
		    	            boxLabel: 'N',
		    	            listeners: {
		    	            	change : function(t, newValue, oldValue, eOpts){
		    	            		if (newValue) {
		    	            			Ext.getCmp('targetFieldId_').setReadOnly(true);
		    	            			Ext.getCmp('targetFieldId_').setValue(1);
		    	            		} else {
		    	            			Ext.getCmp('targetFieldId_').setReadOnly(false);
		    	            		}
		    	            	}
		    	            }
		                }]
		            }]
		        }]
	        }],
	        buttons: [{
	            text: 'Ok',
	            handler: function() {
	            	var targetFieldValue = Ext.getCmp('targetFieldId_').getValue();
	            	var targetN = Ext.getCmp('targetNId_').getValue();
	            	var temp = '';
	            	if (targetN) {
	            		temp = 'N';
	            	} else {
	            		temp = targetFieldValue;
	            	}
            		var datas = [{'id': sourceSN, 'name': sourceField, 'defaultValue': sourceValue}, 
       		                     {'id': targetSN, 'name': targetField, 'defaultValue': temp}];
            		
            		var _tempSource = namespace.nodesMap.getNode(namespace.mousedown_link.source.serialNumber);
            		var _tempTarget = namespace.nodesMap.getNode(namespace.mousedown_link.target.serialNumber);
            		if (_tempSource && _tempTarget) {
            			namespace.nodesMap.adjustRatio(_tempSource, _tempTarget, sourceValue, temp == "N" ? -1 : temp);
	   	            	if (fn) fn(datas,namespace, _tempSource, _tempTarget);
            		}
            		
	                Ext.getCmp('linkWinId_').close();
	            }
	        }],
	        buttonAlign: 'center'
		});
		
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			id: 'linkWinId_',
		    title: 'Properties',
		    width: 400,
		    height: 250,
		    layout: 'fit',
		    modal : true,
		    resizable: false,
		    items: [linkForm],
	        bodyStyle : {
	        	background : 'white'
	        },
		    listeners: {
		    	beforeshow : function(t, eopts) {
		    		var tmp = !(targetValue != 'N' && targetValue != -1);
	    			Ext.getCmp('targetNId_').setValue(tmp);
	    			Ext.getCmp("targetFieldId_").setReadOnly(tmp);
	    			Ext.getCmp("targetFieldId_").setValue(tmp ? 1 : targetValue);
		    	}
		    }
		});
		win.show();
	}
	
	/**
	 * node private method
	 */
	function nodeMouseover(d, namespace, me) {
		if (!namespace.mousedown_node || d === namespace.mousedown_node) {
			return ;
		}
	    // enlarge target node
	   // d3.select(me).attr('transform', 'scale(1.3)');
	}
	
	function nodeMouseout(d, namespace, me) {
		if (!namespace.mousedown_node || d === namespace.mousedown_node) {
			return ;
		}
	    // unenlarge target node
	   // d3.select(me).attr('transform', '');
	}
	
	function nodeMousedown(d, namespace, me) {
        if (d3.event.ctrlKey) {
        	return ;
        }
        namespace.svg.call(d3.behavior.zoom().on('zoom'), null);
        // select node
        namespace.mousedown_node = d;
        var index = namespace.selected_nodes.indexOf(namespace.mousedown_node);
        if (index !== - 1) {
        	namespace.selected_nodes.splice(index, 1);
        	deSelectAllNodes(namespace, true)
        } else {
        	namespace.current_selected_node = namespace.mousedown_node; 
        	namespace.selected_nodes.push(namespace.current_selected_node);
        }
        namespace.current_selected_link = null;
        // reposition drag line
        var dValue = 'M' + namespace.mousedown_node.x + ',' 
        				 + namespace.mousedown_node.y + 'L' 
        				 + namespace.mousedown_node.x + ',' 
        				 + namespace.mousedown_node.y;
        namespace.drag_line.style('marker-end', 'url(#end-arrow-'+namespace.id+')')
        		 .classed('hidden', false)
        		 .attr('d', dValue);

        ns.redraw(namespace);
	}
	
	function nodeMouseup(d, namespace, me) {
	    if (!namespace.mousedown_node) {
	    	return ;
	    }
	    // needed by FF
	    namespace.drag_line.classed('hidden', true).style('marker-end', '');

	    // check for drag-to-self
	    namespace.mouseup_node = d;
	    if (namespace.mouseup_node === namespace.mousedown_node) { 
	    	ns.resetMouseVars(namespace); 
	    	return; 
	    }

	    // unenlarge target node
	    d3.select(me).attr('transform', '');

	    // add link to graph (update if exists)
	    // NB: links are strictly source < target; arrows separately specified by booleans
	    var source, target, direction;
	    if (namespace.mousedown_node.serialNumber < namespace.mouseup_node.serialNumber) {
	        source = namespace.mousedown_node;
	        target = namespace.mouseup_node;
	        direction = 'right';
	    } else {
	        source = namespace.mouseup_node;
	        target = namespace.mousedown_node;
	        direction = 'left';
	    }

	    var link;
	    link = namespace.links.filter(function(l) {
	        return (l.source === source && l.target === target);
	    })[0];

	    if(link) {
	        link[direction] = true;
	    } else {
	    	link = Ext.create('DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop.Link',source, target, 0, 0, false, false);
//	        link = {source: source, target: target, left: false, right: false};
	        link[direction] = true;
	        namespace.links.push(link);
	    }

	    // select new link
	    namespace.current_selected_link = link;
	    deSelectAllNodes(namespace)
	      
	    // enable zoom
	    namespace.svg.call(d3.behavior.zoom().on('zoom'), function(){ns.rescale(namespace);});
	    ns.redraw(namespace);
	}
	
	/**
	 * svg mouse event
	 */
	function mousedown(namespace) {
		// because :active only works in WebKit?
		namespace.svg.classed('active', true);
		if (d3.event.ctrlKey || namespace.mousedown_node || namespace.mousedown_link) {
			return;
		}
		if (!namespace.mousedown_node && !namespace.mousedown_link) {
			// allow panning if nothing is selected
			namespace.svg.call(d3.behavior.zoom().on('zoom'), function(){ns.rescale(namespace);});
			return;
		}
	}

	function mousemove(namespace) {
		if (!namespace.mousedown_node) {
			return;
		}
		// update drag line
		namespace.drag_line.attr('d', function(){
			var dValue = 'M' + namespace.mousedown_node.x + ',' + namespace.mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1];
			return dValue;
		});
		ns.redraw(namespace);
	}
	
	function mouseup(namespace) {
		if (namespace.mousedown_node) {
		    // hide drag line
			namespace.drag_line.classed('hidden', true).style('marker-end', '');
		}
		// because :active only works in WebKit?
		namespace.svg.classed('active', false);
   	    // clear mouse event vars
		ns.resetMouseVars(namespace);
		
		resetControlRect(namespace);
	}
	function resetControlRect(namespace){
		try{
			var att = namespace.svg[0][0].attributes,
				tra = att.transform.value,
				loc = tra.split(")")[0].split("(")[1].split(","),
				sc = tra.split("(")[2].split(")")[0],
				w = namespace.myWidth / sc,
				h = namespace.myHeight / sc;
			d3.selectAll("." + namespace.svgId + "svgForceV2DragRectClass").attr("x", -loc[0] / sc).attr("y", -loc[1] / sc).attr("width", w).attr("height", h)
		}catch(e){}
	}
	
	/**
	 * keyboard event
	 */
	function spliceLinksForNode(node, namespace) {
		var toSplice = namespace.links.filter(function(l) {
			return (l.source === node || l.target === node);
		});
		toSplice.map(function(l) {
			namespace.links.splice(namespace.links.indexOf(l), 1);
		});
	}
	
	function keydown(namespace) {
	    // ctrl
	    if (d3.event.keyCode === 17) {
	    	namespace.node.call(namespace.force.drag)
	    	namespace.svg.classed('ctrl', true);
	    	return;
	    }
	    if (namespace.selected_nodes.length === 0 && !namespace.current_selected_link) {
	    	return ;
	    }
	    if(Ext.getCmp("changeEquipmentV3WinId")) return;
	    switch (d3.event.keyCode) {
		    case 46: // delete
		    	if (namespace.current_selected_link) {
					var index = namespace.links.indexOf(namespace.current_selected_link);
					var temp = namespace.links[index];
					var _source = namespace.nodesMap.getNode(temp.source.serialNumber);
			        var _target = namespace.nodesMap.getNode(temp.target.serialNumber);
					namespace.nodesMap.deleteLine(_source, _target);
		    		
		    		namespace.links.splice(namespace.links.indexOf(namespace.current_selected_link), 1);
			    } else {
			    	var iLen = namespace.selected_nodes.length;
			    	for (var i=iLen-1; i>=0; i--) {
			    		var temp = namespace.selected_nodes[i];
			    		var _index = namespace.nodes.indexOf(temp);
			    		var _temp = namespace.nodes[_index];
			    		var _node = namespace.nodesMap.getNode(_temp.serialNumber);
			    		namespace.nodesMap.deleteNode(_node);
			    		
			    		namespace.nodes.splice(namespace.nodes.indexOf(temp), 1);
				        spliceLinksForNode(temp, namespace);
			    	}
			   }
		       namespace.current_selected_link = null;
		       deSelectAllNodes(namespace)
		       
		       ns.redraw(namespace);
		       break;
		    case 66: // B
		    break;
		       if (namespace.current_selected_link) {
		        // set link direction to both left and right
		    	   namespace.current_selected_link.left = true;
		    	   namespace.current_selected_link.right = true;
		       }
		       ns.redraw(namespace);
		       break;
		    case 76: // L
		    break;
		       if (namespace.current_selected_link) {
		    	  // set link direction to left only
		    	  namespace.current_selected_link.left = true;
		    	  namespace.current_selected_link.right = false;
		       }
		       ns.redraw(namespace);
		       break;
		    case 82: // R
		    break;
		       if (namespace.current_selected_node) {
		          // toggle node reflexivity
		    	   namespace.current_selected_node.reflexive = !namespace.current_selected_node.reflexive;
		       } else if(namespace.current_selected_link) {
		          // set link direction to right only
		    	  namespace.current_selected_link.left = false;
		    	  namespace.current_selected_link.right = true;
		       }
		       ns.redraw(namespace);
		       break;
	    }
	}

	function keyup(namespace) {
	    // ctrl
	    if (d3.event.keyCode === 17) {
	    	namespace.node.on('mousedown.drag', null).on('touchstart.drag', null)
	    	namespace.svg.classed('ctrl', false);
	    }
	}
	
	/**
	 * svg method
	 */
	// update force layout (called automatically each iteration)
	function tick(namespace) {
	    // draw directed edges with proper padding from node centers
	    namespace.link.select('path').attr('d', function(d) {
		    var deltaX = d.target.x - d.source.x,
		        deltaY = d.target.y - d.source.y,
		        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
		        normX = deltaX / dist,
		        normY = deltaY / dist,
		        sourcePadding = d.left ? 12 : 9,
		        targetPadding = d.right ? 12 : 9,
		        sourceX = d.source.x + (sourcePadding * normX),
		        sourceY = d.source.y + (sourcePadding * normY),
		        targetX = d.target.x - (targetPadding * normX),
		        targetY = d.target.y - (targetPadding * normY);
	        if(isNaN(sourceX) || isNaN(sourceY) || isNaN(targetX) || isNaN(targetY)){
	        	d.isNotShow = true;
	        	return '';
	        }else{
	        	d.isNotShow = false;
	        }
		    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	    });

	    namespace.node.attr('transform', function(d) {
	    	return 'translate(' + d.x + ',' + d.y + ')';
	    });
	    namespace.node.select('.node_text').text(createNodeText);
	  
	    namespace.link.select('.relation').attr("transform", calculateAngle);
	    namespace.link.select('.relation').select('.relation_text').text(function(d){
			 return createText(d, namespace);
		}).attr("display", function(d){
			return d.isNotShow ? "none" : "block";
		})
	    if(namespace.isActivate){
	    namespace.node.select('image')
	      .on('click',function(d){
			
//	    	  d3.select("#img_"+d.serialNumber).classed('hidden', true);
	      })
	      .on('dblclick',function(d){
	      })
	      .on('mouseover', function(d) {
			 	if (namespace.nodeMouseover) {
			 		namespace.nodeMouseover(d);
			 	} else {
			 		nodeMouseover(d, namespace, this);
			 	}
			})
		 .on('mouseout', function(d) {
			 	if (namespace.nodeMouseout) {
			 		namespace.nodeMouseout(d);
			 	} else {
			 		nodeMouseout(d, namespace, this); 
			 	}
			})
		 .on('mousedown', function(d) {
			 	if (namespace.nodeMousedown) {
			 		namespace.nodeMousedown(d);
			 	} else {
			 		nodeMousedown(d, namespace, this);	
			 	}
			})
		 .on('mouseup', function(d) {
			 	if (namespace.nodeMouseup) {
			 		namespace.nodeMouseup(d);
			 	} else {
			 		nodeMouseup(d, namespace, this);
			 	}
		 	});
	    }
	}
	
	var linkIsGroup = function(link,otherNode,serialNumber){
		var target = link.target;
		var source = link.source;
		if(target.groupId === source.groupId)return true;
		if(source.serialNumber === target.groupId)return true;
		if(otherNode.groupId){
			if(otherNode.groupId.indexOf(serialNumber)=== 0)return true;
		}
		return false;
	}
	
	ns.hiddenChildNode = function(namespace,d){
		hiddenChildrenNode(namespace,d,d,d.serialNumber);
	}
	
	ns.foldingNode = function(namespace,d){
			if(d.isTopRoot)return ;
			 if(!d.isReferenceRoot)return ;
	    	 d.isShow === false
	    	 	?	showChildrenNode(namespace,d)
	    	 	:	hiddenChildrenNode(namespace,d,d,d.serialNumber); 
	    	// d.isShow = (d.isShow === false ? true : false);
	}

	function hiddenChildrenNode(/* Desktop */namespace,/* Node */d,eventNode,serialNumber) {
		if(!eventNode.falseLinks)eventNode.falseLinks = [];
		var hLinks = [];
		var links = d.serialNumber === serialNumber ? d.getLinks(serialNumber) : namespace.getLinksByNode(d);   //如果遍历的是根节点(点击的节点)，只操作它指出去的节点，否则 指出指入的节点都要处理

		if (links) {
			for ( var l in links) {
				var link = links[l];
				var target = link.target;
				link.hidden = true;
				hLinks.push(link);
				var otherNode = target===d ? link.source : target;
//				if(target.groupId === groupId){
				if(linkIsGroup(link,otherNode,serialNumber)){
					if(link.target.hidden && link.source.hidden)continue;
					if(d.mcId === link.target.mcId)continue;
					link.target.hidden = true;
					hiddenChildrenNode(namespace, link.target,eventNode ,serialNumber);
				}else{ //不是同一个组， 隐藏link ， 显示target, 并且创造一根root与target的 falselink
					var falseLink = Ext.create('DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop.Link',
							link.source, 
							link.target, 
							link.properties[0].defaultValue, 
							link.properties[1].defaultValue, 
							link.left, 
							link.right);
					
					falseLink.isSource = link.source.serialNumber === d.serialNumber;
					eventNode.falseLinks.push(falseLink);					
				}
				ns.redraw(namespace);
			};
		};
		d.hiddenLinks = hLinks;
		d.isShow = false;
	};
	
	
	function showChildrenNode(namespace,d,groupId){
		var links = d.id === groupId ? d.getLinks() : namespace.getLinksByNode(d);   //如果遍历的是根节点(点击的节点)，只操作它指出去的节点，否则 指出指入的节点都要处理
		if(d.falseLinks){
			d.falseLinks = [];
		}
		if (d.hiddenLinks) {
			for ( var l in d.hiddenLinks) {
				var link = d.hiddenLinks[l];
				var temp = link.target;
				if(!link.hidden)continue;
				temp.hidden = false;
				link.hidden = false;
				ns.redraw(namespace);
				showChildrenNode(namespace, link.target);
			};
			d.hiddenLins = [];
		}
		d.isShow = true;
	};
	
	function calculateAngle(d){
		var x1 = d.source.x,
	    	y1 = d.source.y,
	    	x2 = d.target.x,
	    	y2 = d.target.y,
	    	xg = (x1 + x2) / 2,
	    	yg = (y1 + y2) / 2,
	    	angle = Math.atan((y2-y1)/(x2-x1)) / Math.PI * 180,
	    	tmpX = Math.sqrt((yg*yg / (xg*xg + yg*yg)) * 45),
	    	tmpY = Math.sqrt(45 - tmpX*tmpX) - 2;
	    xg = (x1 > x2 && y1 > y2) || (x1 < x2 && y1 < y2) ? xg + tmpX : xg - tmpX;
	    yg -= tmpY;
	    return 'translate('+ xg +', '+ yg +') rotate('+angle+')';
	}
	
	function nodeSelectedFn(d, namespace) {
		var index = namespace.selected_nodes.indexOf(d);
	    if (index != -1 || nodeSelectedCheckId(d, namespace)) {
		    return true;
	    } else {
		   return false;
	    }
	}
	
	function nodeSelectedCheckId(d, namespace) {
		for (var i=0, len=namespace.selected_nodes.length; i<len; i++) {
			var temp = namespace.selected_nodes[i];
			if (temp.id === d.id && temp.tempId === d.tempId) {
				return true;
			}
		}
		return false;
	}
	
	function createText(d, namespace) {
		if (!d.properties) {
			return '';
		}
		var source = d.source;
		var target = d.target;
		var _source = namespace.nodesMap.getNode(source.serialNumber);
	    var _target = namespace.nodesMap.getNode(target.serialNumber);
	    if (!_source || !_target) {
	    	return '';
	    }
		var line = namespace.nodesMap.getLine(_source, _target);
		if (!line || line.length < 2) {
			return '';
		}
		
		if (target.x > source.x) {
			return line[0] + ' : ' + line[1];
		} else {
			return line[1] + ' : ' + line[0];
		}
		
		
//		if (target.x >= source.x) {
//			return d.properties[0].defaultValue + ' : ' +  d.properties[1].defaultValue;
//		} else {
//			return d.properties[1].defaultValue + ' : ' +  d.properties[0].defaultValue;
//		}
	}
	
	function createNodeText(d) {
		if (d.relationValue) {
			return d.text + '(' + d.relationValue + ')';
		}
		return d.text ; 
	}
	
	function initNodesRelation(namespace) {
		var showNodes = [];
		var showLinks = [];
		for (var i=0, len=namespace.nodes.length; i<len; i++) {
			var node = namespace.nodes[i];
			if(!node.hidden)showNodes.push(node);
			node.clearLinks();
			var nodes = namespace.nodesMap.getNodes();
			for (var j=0, jLen=nodes.length; j<jLen; j++) {
				var _temp = nodes[j];
				if (_temp._name === node.serialNumber) {
					node.relationValue = _temp.getDisplayCount();
				}
			}
			if(node.falseLinks){
				for(var l in node.falseLinks){
					falseLink = node.falseLinks[l];
					if(falseLink.isSource){
						falseLink.source = node;
					}else{
						falseLink.target = node;
					}
					showLinks.push(falseLink);
				}
			}
		}
		Ext.each(namespace.links,function(link){
			if(!link.hidden)showLinks.push(link);
			var source = link.source;
			source.addLink(link);
		});
		return {links:showLinks,nodes:showNodes};
	}
	
	//equipment icon
	function getEquipmentIcon(f, type){//type: root,unSel,select
		var re = "../../styles/cmp/images/equipment/yq_equip_";
		if(type == "root" || type == "select" || type == "unSel"){
			re += type;
			if(f){
				return re + "_" + f + ".png"
			}
			return re + ".png";
		}
		return re + "root.png";
	}
	
	ns.equipImg = {
		root : '../../styles/cmp/images/equipment/yq_equip_root.png'
		,select : '../../styles/cmp/images/equipment/yq_equip_select.png'
		,unSel : '../../styles/cmp/images/equipment/yq_equip_unSel.png'
	}
	
	
})()