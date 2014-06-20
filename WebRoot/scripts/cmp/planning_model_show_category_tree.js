(function(){
	Ext.namespace('DigiCompass.Web.app.planningModelTree');
	

		// Toggle children.
		function toggle(d) {
		  if (d.children) {
		    d._children = d.children;
		    d.children = null;
		  } else {
		    d.children = d._children;
		    d._children = null;
		  }
		}
	  function toggleAll(d) {
		    if (d.children) {
		      d.children.forEach(toggleAll);
		      toggle(d);
		    }
		  }
	  function toggleAllTree(children){
		  for(var i = 0 ; i<children.length ; i++){
			  if(!Ext.isEmpty(children[i]._children) && children[i]._children.length > 0){
				  toggle(children[i]);
				  toggleAllTree(children[i].children);
			  }
		  }
	  }
	  
	  function getMaxDepth(root, depth, obj){			
			if (depth > obj.maxdepth) {
				obj.maxdepth = depth;
			}
			if (root.children) {
				for(var i = 0; i < root.children.length; i++){
					getMaxDepth(root.children[i], depth+1, obj);
				};
			}
	  }
	DigiCompass.Web.app.planningModelTree.showTree = function(treeData, id , name){
		var obj = {
				maxdepth : 1
			};
		getMaxDepth(treeData, 1, obj);
		console.log(obj.maxdepth);
		var treeId = 'categoryTree',
			title = 'Category Tree';
	var m = [20, 120, 20, 120],
	    w = 1000 - m[1] - m[3],
	    h = 800 - m[0] - m[2],
	    i = 0,
	    root = treeData;		
		if(!!id){
			treeId = id;
		}
		if(!!name){
			title = name; 
		}
		var DivWidth=function(){
			if(obj.maxdepth*180>w){
	    		return obj.maxdepth*180+m[1] + m[3];
	    	}else{
	    		return w + m[1] + m[3];
	    	}
		}
		var window = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
		    title  : title,
		    modal  : true, 
		    height : 800,
		    width  : 1000,
		    html   : '<div style="background-color:#FFF;width:'+DivWidth()+'px;"id = "'+ treeId+'"></div>'
		}); 
		window.show();
	var tree = d3.layout.tree()
	    .size([h, w]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var vis = d3.select('#' + treeId).append("svg:svg")
	    .attr("width", DivWidth)
	    .attr("height", h + m[0] + m[2])
	  .append("svg:g")
	    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
		 root.x0 = h / 2;
		  root.y0 = 0;


		  // Initialize the display to show a few nodes.
		  root.children.forEach(toggleAll);
		  toggleAllTree(root.children);
		  update(root);

		function update(source) {
		  var duration = d3.event && d3.event.altKey ? 5000 : 500;

		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse();

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes鈥�
		  var node = vis.selectAll("g.node")
		      .data(nodes, function(d) { return d.id || (d.id = ++i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("svg:g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		      .on("click", function(d) { toggle(d); update(d); });

		  nodeEnter.append("svg:circle")
		      .attr("r", 1e-6)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeEnter.append("svg:text")
		      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		      .text(function(d) { return d.name; })
		      .style("fill-opacity", 1e-6);

		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		  nodeUpdate.select("circle")
		      .attr("r", 4.5)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeUpdate.select("text")
		      .style("fill-opacity", 1);

		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		      .remove();

		  nodeExit.select("circle")
		      .attr("r", 1e-6);

		  nodeExit.select("text")
		      .style("fill-opacity", 1e-6);

		  // Update the links鈥�
		  var link = vis.selectAll("path.link")
		      .data(tree.links(nodes), function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("svg:path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return diagonal({source: o, target: o});
		      })
		    .transition()
		      .duration(duration)
		      .attr("d", diagonal);

		  // Transition links to their new position.
		  link.transition()
		      .duration(duration)
		      .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		      .duration(duration)
		      .attr("d", function(d) {
		        var o = {x: source.x, y: source.y};
		        return diagonal({source: o, target: o});
		      })
		      .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });
		}
	}
	DigiCompass.Web.app.planningModelTree.showChart = function(treeData, id , name){
		var treeId = 'SowTree',
		title = 'Sow Tree';
		if(!!id){
			treeId = id;
		}
		if(!!name){
			title = name; 
		}
		var window = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
		    title  : title,
		    modal  : true, 
		    height : 800,
		    width  : 1000,
		    html   : '<div style="background-color:#FFF" id = ' + treeId + '></div>'
		}); 
		window.show();
		var w = 980,
	    h = 760,
	    i = 0,
	    barHeight = 20,
	    barWidth = w * .8,
	    duration = 400,
	    root;

	var tree = d3.layout.tree()
	    .size([h, 100]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var vis = d3.select("#"+ treeId).append("svg:svg")
	    .attr("width", w)
	    .attr("height", h)
	  .append("svg:g")
	    .attr("transform", "translate(20,30)");

	var json = treeData;
	  json.x0 = 0;
	  json.y0 = 0;
	  update(root = json);

	function update(source) {

	  // Compute the flattened node list. TODO use d3.layout.hierarchy.
	  var nodes = tree.nodes(root);
	  
	  // Compute the "layout".
	  nodes.forEach(function(n, i) {
	    n.x = i * barHeight;
	  });
	  
	  // Update the nodes鈥�
	  var node = vis.selectAll("g.node")
	      .data(nodes, function(d) { return d.id || (d.id = ++i); });
	  
	  var nodeEnter = node.enter().append("svg:g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	      .style("opacity", 1e-6);

	  // Enter any new nodes at the parent's previous position.
	  nodeEnter.append("svg:rect")
	      .attr("y", -barHeight / 2)
	      .attr("height", barHeight)
	      .attr("width", barWidth)
	      .style("fill", color)
	      .on("click", click);
	  
	  nodeEnter.append("svg:text")
	      .attr("dy", 3.5)
	      .attr("dx", 5.5)
	      .text(function(d) { 
	    	  var str = d.name;
	    	  if(d.description){
	    		  str = str + '\t\|\t' + d.description;
	    	  }
	    	  if(d.requirement && d.requirement.name && d.requirement.type && d.requirement.ext){
	    		  str = str + '\t\|\t' + d.requirement.name + '\t\|\t' + d.requirement.type + '\t\|\t' + d.requirement.ext
	    	  }
	    	  return  str;
	      });
	  
	  // Transition nodes to their new position.
	  nodeEnter.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
	      .style("opacity", 1);
	  
	  node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
	      .style("opacity", 1)
	    .select("rect")
	      .style("fill", color);
	  
	  // Transition exiting nodes to the parent's new position.
	  node.exit().transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	      .style("opacity", 1e-6)
	      .remove();
	  
	  // Update the links鈥�
	  var link = vis.selectAll("path.link")
	      .data(tree.links(nodes), function(d) { return d.target.id; });
	  
	  // Enter any new links at the parent's previous position.
	  link.enter().insert("svg:path", "g")
	      .attr("class", "link")
	      .attr("d", function(d) {
	        var o = {x: source.x0, y: source.y0};
	        return diagonal({source: o, target: o});
	      })
	    .transition()
	      .duration(duration)
	      .attr("d", diagonal);
	  
	  // Transition links to their new position.
	  link.transition()
	      .duration(duration)
	      .attr("d", diagonal);
	  
	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
	      .duration(duration)
	      .attr("d", function(d) {
	        var o = {x: source.x, y: source.y};
	        return diagonal({source: o, target: o});
	      })
	      .remove();
	  
	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update(d);
	}

	function color(d) {
	  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
	}
	}
})();