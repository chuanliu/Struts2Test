(function(){
	var ns = Ext.namespace('DigiCompass.Web.app.svg');
	
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
		
		var oldSvg = d3.select('#' + svgId).select('svg');
		if(oldSvg){
			oldSvg.remove();
		}
		
		// init svg
		namespace.outer = d3.select('#' + svgId)
		  	.append('svg:svg')
		    .attr('width', width)
		    .attr('height', height)
		    .attr('pointer-events', 'all');
		
		namespace.vis = namespace.outer.append('svg:g')
			.attr('class', 'control')
		    .call(d3.behavior.zoom().on('zoom', function(){ns.rescale(namespace);}))
		    .on('dblclick.zoom', null)
		    .append('svg:g')
		    .on('mousemove', function(){mousemove(namespace);})
		    .on('mousedown', function(){mousedown(namespace);})
		    .on('mouseup', function(){mouseup(namespace);});
		
		namespace.vis.append('svg:rect')
		   .attr('width', width)
		   .attr('height', height)
		   .attr('fill', 'white');
		
		// init force layout
		namespace.force = d3.layout.force()
		    .size([width, height])
		    .nodes([]) // initialize with a single node
		    .linkDistance(100)
		    .charge(-200)
		    .on('tick', function(){tick(namespace);});
		
		
		// line displayed when dragging new nodes
		namespace.drag_line = namespace.vis.append('line')
		    .attr('class', 'drag_line')
		    .attr('x1', 0)
		    .attr('y1', 0)
		    .attr('x2', 0)
		    .attr('y2', 0);
		
		namespace.vis.append('svg:g')
		   .attr('class', 'links');
		
		namespace.vis.append('svg:g')
		   .attr('class', 'nodes');
		
		// get layout properties
		namespace.nodes = namespace.force.nodes();
		namespace.links = namespace.force.links();
		namespace.node = namespace.vis.select('.nodes').selectAll('.node');
		namespace.link = namespace.vis.select('.links').selectAll('.link');
		
		// add keyboard callback
		d3.select(window).on('keydown', function(){
			if (namespace.keydown) {
				namespace.keydown();
			} else {
				keydown(namespace);
			}
		});
	}
	
	
	function mousedown(namespace) {
		if (!namespace.mousedown_node && !namespace.mousedown_link) {
			// allow panning if nothing is selected
			namespace.vis.call(d3.behavior.zoom().on('zoom'), namespace.rescale);
			return;
		}
	}
	
	function mousemove(namespace) {
		if (!namespace.mousedown_node) {
			return;
		}
		// update drag line
		namespace.drag_line.attr('x1', namespace.mousedown_node.x)
	      		 .attr('y1', namespace.mousedown_node.y)
	             .attr('x2', function(){
	            	 return d3.svg.mouse(this)[0];
	             })
	             .attr('y2', function(){
	            	 return d3.svg.mouse(this)[1];
	             });
	}
	
	function mouseup(namespace) {
		if (namespace.mousedown_node) {
			// hide drag line
			namespace.drag_line.attr('class', 'drag_line_hidden');
			ns.redraw(namespace);
		}
		// clear mouse event vars
		ns.resetMouseVars(namespace);
	}
	
	ns.resetMouseVars = function(namespace) {
		namespace.mousedown_node = null;
		namespace.mouseup_node = null;
		namespace.mousedown_link = null;
	}
	
	function tick(namespace) {
		namespace.link.select('line')
		   .attr('x1', function(d) { return d.source.x; })
	   	   .attr('y1', function(d) { return d.source.y; })
	   	   .attr('x2', function(d) { return d.target.x; })
	   	   .attr('y2', function(d) { return d.target.y; });
		
		namespace.link.select('.relation').attr("transform", calculateAngle);
		namespace.link.select('.relation').select('.textCls').text(createText);
		
		namespace.node.select('.nodetext').text(function(d) { return d.text; });
		
		namespace.node.attr("transform", function(d) { 
				return "translate(" + d.x + "," + d.y + ")"; });
	}
	
	// rescale g
	ns.rescale = function(namespace) {
	    var trans=d3.event.translate;
	    var scale=d3.event.scale;
	    namespace.vis.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
	}
	
	function calculateAngle(d){
		   var x1 = d.source.x;
		   var y1 = d.source.y;
		   var x2 = d.target.x;
		   var y2 = d.target.y;
		   var xg = (x1 + x2) / 2;
		   var yg = (y1 + y2) / 2;
		   
		   // backup
//		   var angle = Math.atan2(y2-y1, x2-x1) / Math.PI * 180;
//		   if (angle > 90)
//			   angle = angle - 180;
//		   else if (angle < -90)
//			   angle = 180 + angle;
		   
		   var angle = Math.atan((y2-y1)/(x2-x1)) / Math.PI * 180;
		   return 'translate('+ xg +', '+ yg +') rotate('+angle+')';
	}
	
	function createText(d) {
		if(d.properties){
		   return d.properties[0].defaultValue + ' : ' +  d.properties[1].defaultValue;
	    }
	    return '';
	}
	
	function linkMousedown(d, namespace) {
		namespace.mousedown_link = d; 
        if (namespace.mousedown_link == namespace.current_selected_link) {
        	namespace.current_selected_link = null;
        } else {
        	namespace.current_selected_link = namespace.mousedown_link;
        } 
        namespace.current_selected_node = null; 
        namespace.selected_nodes = [];
        ns.redraw(namespace); 
	}
	
	function nodeMousedown(d, namespace) {
		// disable zoom
		namespace.vis.call(d3.behavior.zoom().on('zoom'), null);

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
        namespace.drag_line.attr('class', 'link')
          		 .attr('x1', namespace.mousedown_node.x)
                 .attr('y1', namespace.mousedown_node.y)
                 .attr('x2', namespace.mousedown_node.x)
                 .attr('y2', namespace.mousedown_node.y);
        ns.redraw(namespace);
	}
	
	function nodeMouseup(d, namespace) {
		if (namespace.mousedown_node) {
        	namespace.mouseup_node = d; 
            if (namespace.mouseup_node == namespace.mousedown_node) { 
            	ns.resetMouseVars(namespace); 
            	return; 
            }

            // add link
            var link = {source: namespace.mousedown_node, target: namespace.mouseup_node, x: namespace.mousedown_node.x, y: namespace.mousedown_node.y};
            namespace.links.push(link);

            // select new link
            namespace.current_selected_link = link;
            namespace.current_selected_node = null;
            namespace.selected_nodes = [];

            // enable zoom
            namespace.vis.call(d3.behavior.zoom().on('zoom'), function(){ns.rescale(namespace);});
            ns.redraw(namespace);
      }
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
			if (temp.id === d.id) {
				return true;
			}
		}
		return false;
	}
	
	// redraw force layout
	ns.redraw = function(namespace) {
		namespace.link = namespace.link.data(namespace.links);
	    
	    var g = namespace.link.enter().append('svg:g')
	    		.attr('class', 'link')
	    		.on('mousedown', 
	    		function(d) {
	    			if (namespace.linkMousedown) {
	    				namespace.linkMousedown(d);
	    			} else {
	    				linkMousedown(d, namespace);
	    			}
	    		});
	    
	    g.append('line')
	     .attr('class', 'lineCls')
	     .attr('x1', function(d){return d.source.x;})
	     .attr('y1', function(d){return d.source.y;})
	     .attr('x2', function(d){return d.target.x;})
	     .attr('y2', function(d){return d.target.y;});
	    
	    g.append('svg:g')
	    	   .attr('class', 'relation')
	    	   .attr('transform', calculateAngle)
	    	   .append('svg:text')
	    	   .attr('class', 'textCls')
	    	   .attr('style', 'text-anchor:middle')
	    	   .attr('font-weight', 'normal')
	    	   .text(createText);
	    
	    namespace.link.exit().remove();
	
	    namespace.link.classed('link_selected', 
	    		function(d) { 
	    			return d === namespace.current_selected_link; 
	    		}
	    );
	    
	    namespace.link.classed('link_selected', function(d) { return d === namespace.current_selected_link;});
	    namespace.link.select('line').classed('link_selected', function(d) { return d === namespace.current_selected_link;});
	
	    namespace.node = namespace.node.data(namespace.nodes);
	    
	    g = namespace.node.enter().append('svg:g')
	    	.attr('class', 'node');
	    
	    g.append('svg:image')
//	        .attr('xlink:href', function(d){return d.icon;})
	    	.attr('xlink:href', '../../styles/cmp/images/add.png')
	        .attr('x', '-8px')
	        .attr('y', '-8px')
	        .attr('width', '16px')
	        .attr('height', '16px')
	        .on('mousedown', 
		        function(d) {
		             if (namespace.nodeMousedown) {
		            	 namespace.nodeMousedown(d);
		             } else {
		            	 nodeMousedown(d, namespace);
		             }
		        }
	        )
	        .on('mousedrag',
		        function(d) {
		          // redraw();
		        }
	        )
	        .on('mouseup', 
		        function(d) { 
		             if (namespace.nodeMouseup) {
		            	 namespace.nodeMouseup(d);
		             } else {
		            	 nodeMouseup(d, namespace);
		             }
		        }
	        );

		    g.append('svg:text')
		        .attr('class', 'nodetext')
		        .attr('dx', 12)
		        .attr('dy', '.35em')
		        .text(function(d) { return d.text });
		    
		    namespace.node.exit().remove();
	
		    namespace.node.classed('node_selected', function(d) {
		    	return nodeSelectedFn(d, namespace);
		    });
	    
		    if (d3.event) {
		        // prevent browser's default behavior
		        d3.event.preventDefault();
		    }
	
		    namespace.force.start();
	}
	
	function spliceLinksForNode(node, namespace) {
	    var toSplice = namespace.links.filter(
	      function(l) { 
	        return (l.source === node) || (l.target === node); });
	    toSplice.map(
	      function(l) {
	    	  namespace.links.splice(namespace.links.indexOf(l), 1); 
	      });
	}
	
	function keydown(namespace) {
	  if (namespace.selected_nodes.length === 0 && !namespace.current_selected_link) return;
	  switch (d3.event.keyCode) {
	    case 8: // backspace
	    case 46: { // delete
	    	if (namespace.current_selected_link) {
	    		namespace.links.splice(namespace.links.indexOf(namespace.current_selected_link), 1);
		    } else {
		    	var iLen = namespace.selected_nodes.length;
		    	for (var i=iLen-1; i>=0; i--) {
		    		var temp = namespace.selected_nodes[i];
		    		namespace.nodes.splice(namespace.nodes.indexOf(temp), 1);
			        spliceLinksForNode(temp, namespace);
		    	}
		    }
	    	namespace.current_selected_link = null;
	    	namespace.current_selected_node = null;
	    	namespace.selected_nodes = [];
	    	ns.redraw(namespace);
	    	break;
	    }
	  }
	}
	
})()