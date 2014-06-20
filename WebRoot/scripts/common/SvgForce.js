(function(){
	var ns = Ext.namespace('DigiCompass.Web.app.svg');
	
	/**
	 * memeber method
	 */
	// init method
	ns.initializeSvg = function(args) {
		// arguments
		var width = args.width,
			height = args.height,
			svgId = args.svgId,
			namespace = args.namespace;
		
		if (!namespace) {
			namespace = ns;
		}
		// mouse event vars
		namespace.selected_nodes = [];
		namespace.current_selected_node = null;
		namespace.current_selected_link = null;
		namespace.mousedown_link = null;
		namespace.mousedown_node = null;
		namespace.mouseup_node = null;
		
		var _svg = d3.select('#' + svgId).select('svg');
		if (_svg) {
			_svg.remove();
		}
		namespace.svg = d3.select('#' + svgId)
			.append('svg')
		    .attr('width', width)
		    .attr('height', height)
		    .attr('pointer-events', 'all');
		
		namespace.svg = namespace.svg.append('svg:g')
	    	.call(d3.behavior.zoom().on('zoom', function(){ns.rescale(namespace);}))
		    .on('dblclick.zoom', null)
		    .append('svg:g')
		    .attr('class', 'control')
		    .on('mousemove', function(){mousemove(namespace);})
		    .on('mousedown', function(){mousedown(namespace);})
		    .on('mouseup', function(){mouseup(namespace);});

		namespace.svg.append('svg:rect')
		   .attr('width', width)
		   .attr('height', height)
		   .attr('fill', 'white');

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
		    .attr('id', 'end-arrow')
		    .attr('viewBox', '0 -5 10 10')
		    .attr('refX', 6)
		    .attr('markerWidth', 3)
		    .attr('markerHeight', 3)
		    .attr('orient', 'auto')
		  .append('svg:path')
		    .attr('d', 'M0,-5L10,0L0,5')
		    .attr('fill', '#000');

		namespace.svg.append('svg:defs').append('svg:marker')
		    .attr('id', 'start-arrow')
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
		
		d3.select(window).on('keydown', function(){
				if (namespace.keydown) {
					namespace.keydown();
				} else {
					keydown(namespace);
				}
			})
		  .on('keyup', function(){
			  if (namespace.keyup) {
				  namespace.keyup();
			  } else {
				  keyup(namespace);
			  }
		    });
	}
	
	// redraw force layout
	ns.redraw = function(namespace) {
		initNodesRelation(namespace);
		
		// path (link) group
		namespace.link = namespace.link.data(namespace.links);
		
     	var g = namespace.link.enter().append('svg:g')
		  	  		     .attr('class', 'link_container');
		// add new links
		g.append('svg:path')
		 .attr('class', 'link')
		 .classed('link_selected', function(d) { return d === namespace.current_selected_link; })
		 .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
		 .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
		 .on('mousedown', function(d) {
			 if (namespace.linkMousedown) {
				 namespace.linkMousedown(d);
			 } else {
				 linkMousedown(d, namespace);
			 }
		 });
		  
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
				 .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
				 .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });
		  
		namespace.link.select('.relation').select('text').classed('link_selected', function(d) { return d === namespace.current_selected_link; });

		// remove old links
		namespace.link.exit().remove();

		// node (node) group
		// NB: the function arg is crucial here! nodes are known by id, not by index!
		namespace.node = namespace.node.data(namespace.nodes, function(d) { return d.serialNumber; });

	    // update existing nodes (reflexive & selected visual states)
		//  node.selectAll('node')
//		    .style('fill', function(d) { return (d === current_selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
//		    .classed('reflexive', function(d) { return d.reflexive; });

		// add new nodes
		var g = namespace.node.enter().append('svg:g')
		  				 .attr('class', 'node_container');
		  
		g.append('svg:image')
		//  .attr('xlink:href', function(d){return d.icon;})
		 .attr('xlink:href', '../../styles/cmp/images/add.png')
		 .attr('class', 'node')
		 .attr('x', '-8px')
		 .attr('y', '-8px')
		 .attr('width', '16px')
		 .attr('height', '16px')
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
	    namespace.current_selected_node = null;
	    namespace.selected_nodes = [];
	    ns.redraw(namespace);
	}
	
	/**
	 * node private method
	 */
	function nodeMouseover(d, namespace, me) {
		if (!namespace.mousedown_node || d === namespace.mousedown_node) {
			return ;
		}
	    // enlarge target node
	    d3.select(me).attr('transform', 'scale(1.1)');
	}
	
	function nodeMouseout(d, namespace, me) {
		if (!namespace.mousedown_node || d === namespace.mousedown_node) {
			return ;
		}
	    // unenlarge target node
	    d3.select(me).attr('transform', '');
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
        	namespace.current_selected_node = null;		                
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
        namespace.drag_line.style('marker-end', 'url(#end-arrow)')
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
	        link = {source: source, target: target, left: false, right: false};
	        link[direction] = true;
	        namespace.links.push(link);
	    }

	    // select new link
	    namespace.current_selected_link = link;
	    namespace.current_selected_node = null;
	    namespace.selected_nodes = [];
	      
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
	    	namespace.node.call(namespace.force.drag);
	    	namespace.svg.classed('ctrl', true);
	    }
	    if (namespace.selected_nodes.length === 0 && !namespace.current_selected_link) {
	    	return ;
	    }
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
		       namespace.current_selected_node = null;
		       namespace.selected_nodes = [];
		       ns.redraw(namespace);
		       break;
		    case 66: // B
		       if (namespace.current_selected_link) {
		        // set link direction to both left and right
		    	   namespace.current_selected_link.left = true;
		    	   namespace.current_selected_link.right = true;
		       }
		       ns.redraw(namespace);
		       break;
		    case 76: // L
		       if (namespace.current_selected_link) {
		    	  // set link direction to left only
		    	  namespace.current_selected_link.left = true;
		    	  namespace.current_selected_link.right = false;
		       }
		       ns.redraw(namespace);
		       break;
		    case 82: // R
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
	    	namespace.node.on('mousedown.drag', null)
	            	 .on('touchstart.drag', null);
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
		        sourcePadding = d.left ? 17 : 12,
		        targetPadding = d.right ? 17 : 12,
		        sourceX = d.source.x + (sourcePadding * normX),
		        sourceY = d.source.y + (sourcePadding * normY),
		        targetX = d.target.x - (targetPadding * normX),
		        targetY = d.target.y - (targetPadding * normY);
		    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	    });

	    namespace.node.attr('transform', function(d) {
	    	return 'translate(' + d.x + ',' + d.y + ')';
	    });
	    namespace.node.select('.node_text').text(createNodeText);
	  
	    namespace.link.select('.relation').attr("transform", calculateAngle);
	    namespace.link.select('.relation').select('.relation_text').text(function(d){
			 return createText(d, namespace);
		});
	    
	    namespace.node.select('image')
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
	
	function calculateAngle(d){
		var x1 = d.source.x;
	    var y1 = d.source.y;
	    var x2 = d.target.x;
	    var y2 = d.target.y;
	    var xg = (x1 + x2) / 2;
	    var yg = (y1 + y2) / 2;
	    var angle = Math.atan((y2-y1)/(x2-x1)) / Math.PI * 180;
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
		for (var i=0, len=namespace.nodes.length; i<len; i++) {
			var node = namespace.nodes[i];
			var nodes = namespace.nodesMap.getNodes();
			for (var j=0, jLen=nodes.length; j<jLen; j++) {
				var _temp = nodes[j];
				if (_temp._name === node.serialNumber) {
					node.relationValue = _temp.getDisplayCount();
				}
			}
		}
	}
	
	
})()