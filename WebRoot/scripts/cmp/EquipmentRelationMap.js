var com = {};
com.digicompass = {};
com.digicompass.equipment = {};
com.digicompass.equipment.Node = function(/* String */nodeName) {
	return {
		_name : nodeName,
		_count : 1,
		_connectedNode : {},
		// Important, "_relationNode" include all nodes "in_connectedNode"
		________relationNode : {},
		// com.digicompass.equipment.Relation[]
		_relation : {},
		// false if this the "N" node in relation 1:N
		_certain : true,
		// 
		_______certainlessNode : {},

		__debug_relation : function() {
			var result = new Array();
			for (var i in this._relation) {
				result.push(this._relation[i].debug());
			}
			return result;
		},
		__debug_certainlessNodes : function() {
			var result = "";
			var nodes = this.getCertainlessNode();
			for (var i in nodes) {
				result += i + " ";
			}
			return result;
		},
		__debug_certainlessRelation : function() {
			var result = "";
			var r = this.getCertainlessRelation();
			for (var i in r) {
				result += i + " ";
			}
			return result;
		},
		debug : function() {
			return {
				_name : this._name,
				_count : this._count,
				_relation : this.__debug_relation(),
				_certain : this._certain,
				// _getCertainlessNode : this.__debug_certainlessNodes(),
				_getCertainlessRelation : this.__debug_certainlessRelation()
			};
		},

		// true if adjuested it right now, false if aready adjusted before
		__adjustCount : function(processedNode, node, ratio) {
			if (processedNode[node._name])
				return false; // aready adjusted
			node._count *= ratio;
			processedNode[node._name] = node; // mark node has been adjusted.
			return true;
		},

		__adjuestConnectd : function(processedNode, ratio) {
			for (var i in this._relation) {
				var startNode = this._relation[i]._startNode;
				var endNode = this._relation[i]._endNode;
				var adjusted;

				adjusted = this.__adjustCount(processedNode, startNode, ratio);
				if (adjusted)
					startNode.__adjuestConnectd(processedNode, ratio);

				adjusted = this.__adjustCount(processedNode, endNode, ratio);
				if (adjusted)
					endNode.__adjuestConnectd(processedNode, ratio);
			}
		},

		adjustCount : function(ratio) {
			if (ratio == 1)
				return false;

			var processedNode = {};

			var adjusted;
			adjusted = this.__adjustCount(processedNode, this, ratio)

			if (adjusted)
				this.__adjuestConnectd(processedNode, ratio);
		},

		// only add relation to this node. do not deal with the onther node
		addRelation : function(relation) {
			var _name_;
			if (relation._startNode === this)
				_name_ = relation._endNode._name;
			else if (relation._endNode === this)
				_name_ = relation._startNode._name;
			else {
				console.log("Error: node " + this._name
						+ " is not in relation: " + relation._startNode + ", "
						+ relation._endNode);
				return;
			}
			if (this._relation[_name_]) {
				console.log("Error: node " + this._name
						+ " aready connected to" + _name_);
				return;
			}
			this._relation[_name_] = relation;
		},

		removeRelation : function(node) {
			if (!this._relation[node._name]) {
				console.log("Error, there is no line between " + this._name
						+ " and " + node._name);
				return;
			}
			delete this._relation[node._name];
			delete node._relation[this._name];

			this.reCalcCount();
			node.reCalcCount();
		},

		// remove all relation of this nodes
		removeAllRelation : function() {
			for (var i in this._relation) {
				var another = this._relation[i].getAnother(this);
				delete this._relation[another._name];
				delete another._relation[this._name];
				another.reCalcCount();
			}
		},

		// include this, include indirectly connected nodes
		relationNode : function() {
			var nodes = {};
			this.__relationNode(nodes);
			return nodes;
		},

		__relationNode : function(processedNode) {
			if (processedNode[this._name])
				return;
			processedNode[this._name] = this;
			for (var i in this._relation) {
				var startNode = this._relation[i]._startNode;
				var endNode = this._relation[i]._endNode;
				startNode.__relationNode(processedNode);
				endNode.__relationNode(processedNode);
			}

		},

		// adjust Count to min in all chain of this node
		reCalcCount : function() {
			var nodes = this.relationNode();

			var gcd = null;

			for (var i in nodes) {
				if (gcd)
					gcd = GCD(gcd, nodes[i]._count);
				else
					gcd = nodes[i]._count;
			}

			if (gcd > 1)
				for (var i in nodes)
					nodes[i]._count /= gcd;
		},

		__getPath : function(node, processedNode, result) {
			if (this === node) {
				result.v += 1;
				return;
			}
			if (processedNode[this._name])
				return;

			processedNode[this._name] = this;

			for (var i in this._relation) {
				var another = this._relation[i].getAnother(this);
				another.__getPath(node, processedNode, result);
			}
		},
		// int, count of path from this to the node
		del_getPath : function(node) {
			var result = {};
			result.v = 0;
			var processedNode = {};
			this.__getPath(node, processedNode, result);
			return result.v;
		},

		__haveRelation : function(processedNode, node) {
			if (processedNode[this._name])
				return false;
			if (this === node)
				return true;
			processedNode[this._name] = this;

			for (var i in this._relation) {
				var startNode = this._relation[i]._startNode;
				var endNode = this._relation[i]._endNode;
				if (startNode.__haveRelation(processedNode, node))
					return true;
				if (endNode.__haveRelation(processedNode, node))
					return true;
			}
		},

		// boolean
		haveRelation : function(node) {
			if (this === node) {
				console
						.log("Error: Are you sure you wanna find the relation of itself? node: "
								+ node._name);
				return false;
			}

			var processedNode = {};
			return this.__haveRelation(processedNode, node);
		},

		// boolean return true if is directly connect to node
		isConnected : function(node) {
			for (var i in this._relation) {
				var startNode = this._relation[i]._startNode;
				var endNode = this._relation[i]._endNode;
				if (startNode === node || endNode === node)
					return true;
			}
			return false;
		},

		// true if the two nodes have same Certainless Node.
		sameCertainlessNode : function(node) {
			var nodes1 = this.getCertainlessNode();
			var nodes2 = node.getCertainlessNode();

			for (var i in nodes1)
				if (!nodes2[i])
					return false;
			for (var i in nodes2)
				if (!nodes1[i])
					return false;

			return true;
		},

		_getCertainlessNode : function(result, processed) {
			if (processed[this._name])
				return;
			processed[this._name] = this;

			for (var i in this._relation) {
				var relation = this._relation[i];
				var another = relation.getAnother(this);

				//
				if (processed[another._name])
					continue;

				var anotherRatio = relation.getAnotherRatio(this);

				if (anotherRatio !== -1 && !(another._certain))
					result[another._name] = another;
				another._getCertainlessNode(result, processed);
			}
		},

		// certainless nodes effect to this node. include itself
		getCertainlessNode : function() {
			var result = {};
			var processed = {}
			this._getCertainlessNode(result, processed);

			if (!this._certain)
				result[this._name] = this;

			return result;
		},

		_getCertainlessDirectRelation : function(processed) {
			var result = {};
			for (var p in this._relation) {
				var r = this._relation[p];
				var another = r.getAnother(this);
				if (processed[another._name])
					continue;
				var xxx = r.isCertainless(this);
				if (xxx)
					result[r.getId()] = r;
			}
			return result;
		},

		_getCertainlessRelation : function(result, processed) {

			if (processed[this._name])
				return;
			var xx = this._getCertainlessDirectRelation(processed);
			merge(result, xx);

			processed[this._name] = this;

			for (var i in this._relation) {
				var relation = this._relation[i];
				var another = relation.getAnother(this);
				// var xx = another._getCertainlessDirectRelation(processed);
				// merge(result, xx);
				//
				if (processed[another._name])
					continue;
				another._getCertainlessRelation(result, processed);
			}

		},

		getCertainlessRelation : function() {
			var result = {};
			var processed = {}
			this._getCertainlessRelation(result, processed);

			// if (!this._certain)
			// result[this._name] = this;

			return result;
		},

		//
		del_getDisplayCount : function() {
			var result = this._count;
			var nodes = this.getCertainlessNode();
			for (var i in nodes) {
				result += "*N" + nodes[i]._name;
			}
			return result;
		},
		getDisplayCount : function() {
			var result = this._count;
			var nodes = this.getCertainlessRelation();
			for (var i in nodes) {
				result += "*N" + nodes[i]._variableId;
			}
			return result;
		}
	};
};

com.digicompass.equipment.Relation = function(startNode, endNode, startRatio,
		endRatio) {
	var variableId;
	if (startRatio === -1 || endRatio === -1)
		variableId = com.digicompass.equipment.Sequence.next();
	return {
		_startNode : startNode,
		_endNode : endNode,
		_startRatio : startRatio,
		_endRatio : endRatio,
		_variableId : variableId,

		debug : function() {
			return {
				_1_startNode : this._startNode._name,
				_2_endNode : this._endNode._name,
				_3_startRatio : this._startRatio,
				_4_endRatio : this._endRatio,
				_5_variableId : this._variableId
			};
		},

		getId : function() {
			return this._startNode._name + "_" + this._endNode._name;
		},

		// annother node in this relation
		getAnother : function(node) {
			if (this._startNode === node)
				return this._endNode;
			return this._startNode;
		},

		// thie ratio of another node
		getAnotherRatio : function(node) {
			if (this._startNode === node)
				return this._endRatio;
			return this._startRatio;
		},

		// thie ratio of another node
		getRatio : function(node) {
			if (this._startNode === node)
				return this._startRatio;
			return this._endRatio;
		},

		// true if this ratio of this node is Certainless(-1)
		isCertainless : function(node) {
			if (this.getRatio(node) === -1)
				return true;
			return false;
		}
	};
}

com.digicompass.equipment.Sequence = function() {
	var i = 0;
	return {
		next : function() {
			return ++i;
		},
		reset : function() {
			i = 0;
		}
	}
}();

com.digicompass.equipment.Map = function() {
	// com.digicompass.equipment.Node
	var nodes = new Array();
	com.digicompass.equipment.Sequence.reset();
	
	return {
		// addNode: function (/*com.digicompass.equipment.Node*/ node)
		addNode : function(node) {
			nodes.push(node);
		},

		// true if we can draw a line to connect the two nodes
		// an integer value if the ratio is certain between two nodes(they have
		// relation), in this case return the ratio
		// return -1 if there are some diferent CertainlessNode between the two.
		// otherwise return false
		canLine : function(/* com.digicompass.equipment.Node */node1, /* com.digicompass.equipment.Node */
				node2) {
			if (node1.isConnected(node2))
				return false;

			if (node1.haveRelation(node2)) {
				// diferent certainlessNode, line posible
				// TODO
				if (!node1.sameCertainlessNode(node2))
					return -1;

				// have same CertainlessNode(may do not have), but relation can
				// convert to 1:x or x:1
				if (node1._count % node2._count == 0
						|| node2._count % node1._count == 0)
					return Math.max(node1._count, node2._count)
							/ Math.min(node1._count, node2._count);
				return false;
			} else
				return true;
		},

		// n1 n2 其中一个必须为1，另外一个必须为自然数后者-1
		// -1表示没有指定，可以为任意值。
		// return boolean, true if can line.
		line : function(/* com.digicompass.equipment.Node */node1, node2, n1,
				n2) {
			var canLine = this.canLine(node1, node2);
			if (!canLine) {
				console.log("Counld not line between the two nodes");
				return false;
			}

			var relation = new com.digicompass.equipment.Relation(node1, node2,
					n1, n2);

			console.log(" Line from " + node1._name + " to " + node2._name
					+ ", " + n1 + ":" + n2);
			if (canLine === true) {
				// if canLine!==true, means there the two nodes aready have
				// relationship,
				// can not change the ratio between the two nodes and should not
				// execute following

				if (!(n1 == 1 || n2 == 1)) {
					console.log("Error: the rule must 1:x or x:1");
					return false;
				}

				// var __node1NotCertain=false, __node2NotCertain=false;
				if (n1 == -1) {
					node1._certain = false;
					n1 = 1;
				} else if (n2 == -1) {
					node2._certain = false;
					n2 = 1;
				}

				var r = ratio(node1._count, node2._count, n1, n2);
				var r1 = r[0];
				var r2 = r[1];
				node1.adjustCount(r1);
				node2.adjustCount(r2);
			}

			// must after adjuestCount
			node1.addRelation(relation);
			node2.addRelation(relation);

			return true;
		},

		__removeSameProperties : function(nodes1, nodes2) {
			var n1 = {};
			var n2 = {};
			for (var i in nodes1) {
				if (!nodes2[i])
					n1[i] = nodes1[i];
			}
			for (var i in nodes2) {
				if (!nodes1[i])
					n2[i] = nodes2[i]
			}
			return [n1, n2];
		},

		// return null if not connected. else retrun [r1,r2];
		del_getLine : function(node1, node2) {
			if (node1.isConnected(node2)) {
				var gcd = GCD(node1._count, node2._count)
				// return [node1._count/gcd,node2._count/gcd];
				var count1 = node1._count / gcd;
				var count2 = node2._count / gcd;
				var nn = this.__removeSameProperties(node1.getCertainlessNode(),
						node2.getCertainlessNode());

				for (var i in nn[0]) {
					count1 += "*N" + i;
				}
				for (var i in nn[1]) {
					count2 += "*N" + i;
				}
				return [count1, count2];
			}
			return null;
		},
		
				// return null if not connected. else retrun [r1,r2];
		getLine : function(node1, node2) {
			if (node1.isConnected(node2)) {
				var gcd = GCD(node1._count, node2._count)
				// return [node1._count/gcd,node2._count/gcd];
				var count1 = node1._count / gcd;
				var count2 = node2._count / gcd;
				var nn = this.__removeSameProperties(node1.getCertainlessRelation(),
						node2.getCertainlessRelation());

				for (var i in nn[0]) {
					count1 += "*N" + nn[0][i]._variableId;
				}
				for (var i in nn[1]) {
					count2 += "*N" + nn[1][i]._variableId;
				}
				return [count1, count2];
			}
			return null;
		},
		
		

		// not check the line direction
		deleteLine : function(node1, node2) {
			node1.removeRelation(node2);
		},

		// remove all relaiton of node, and then remove itself.
		deleteNode : function(node) {
			node.removeAllRelation();
			nodes.splice(nodes.indexOf(node), 1);
		},

		// false if no connection or more than one conneciton between node1 and node2
		canAdjustRatio : function(node1, node2) {
			var relation = node1._relation[node2._name];
			if (!relation) {
				console.log("There is no line between " + node1._name + " and "
						+ node2._name);
				return false;
			}

			// tempory delete the connection between node1 and node2,
			delete node1._relation[node2._name];
			delete node2._relation[node1._name];

			var haveMoreRelation = node1.haveRelation(node2);

			// restore the connection between node1 and node2;
			node1._relation[node2._name] = relation;
			node2._relation[node1._name] = relation;

			return !haveMoreRelation;
		},

		adjustRatio : function(node1, node2, ratio1, ratio2) {
			if (!this.canAdjustRatio(node1, node2)) {
				console.log("Can not adjust ratio between " + node1._name
						+ " and " + node2._name);
				return;
			}
			// remove line
			this.deleteLine(node1, node2);
			// reLine again;
			this.line(node1, node2, ratio1, ratio2);
		},

		getNodes : function() {
			return nodes;
		},

		removeAllNode : function() {
			for (var i = nodes.length - 1; i >= 0; i--) {
				var temp = nodes[i];
				//console.log('delete ', temp);
				this.deleteNode(temp);
			}
		},

		getNode : function(nodeName) {
			for (var i = 0, len = nodes.length; i < len; i++) {
				var temp = nodes[i];
				if (temp._name === nodeName) {
					return temp;
				}
			}
			return null;
		},

		debug : function() {
			return {
				nodes : nodes
			};
		}
	};

};

// count1: node1.count
// count2: node2.count
// n1:n2 --- node1.count: node2.count
// return [ratio1,ratio2]
function ratio(count1, count2, n1, n2) {
	/* r1 node1放大倍数， r2 node2放大倍数 */
	// (count1*r1) / (count2*r2) = n1 / n2
	// (count1*r1)*n2 = (count2*r2)*n1
	// r1=count2*n1, r2=count1*n2
	var r1 = count2 * n1;
	var r2 = count1 * n2;
	var gcd = GCD(r1, r2);
	r1 /= gcd;
	r2 /= gcd;
	return [r1, r2];
}

// greatest common divsor
function GCD(a, b) {
	var maxV = Math.max(a, b);
	var minV = Math.min(a, b);
	var remainder = maxV % minV;
	while (remainder != 0) {
		maxV = minV;
		minV = remainder;
		remainder = maxV % minV;
	}
	return minV;
}

// Lowest Common Multiple
function LCM(a, b) {
	return a * b / minV;
}

// copy all properties in b to a
function merge(a, b) {
	for (var p in b) {
		a[p] = b[p];
	}
}