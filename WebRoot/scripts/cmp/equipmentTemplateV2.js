Ext.define('DigiCompass.Web.app.equipmentTemplateV2',(function(){
	
	Ext.define("BtnWin",{
	
		statics: {
			instance: null,
			getInstance: function(deskTop) {
				if(this.instance===null)
					this.instance = new this(deskTop);
				return this.instance;
			}
		},
				
		node : null,
				
		btnFold : null,
		
		btnChange : null,
		
		items : [],
		
		window : null,
		
		deskTop : null,
		
		constructor : function(_deskTop){
			this.deskTop = _deskTop;
		},
		
		show : function(node){
			var items = [],
				 deskTop = this.deskTop,
				 win = this;
			var canFolding = !node.isTopRoot && node.isReferenceRoot;
			if(canFolding){
				items.push(Ext.create("Ext.button.Button",{
						text : node.isShow === false ? 'Unfold' : 'Fold',
						icon : node.isShow === false ? equipImg.unfold : equipImg.fold,
						flex : 1,
						width : 50,
						margin: '5px 3px 5px 3px',
						handler : function(){
							deskTop.foldingNode(node);
							win.close();
						}
				}));			
			}
			if(!node.isTopRoot){
				items.push( Ext.create("Ext.button.Button",{
					text : 'Change',
					icon : equipImg.change,
					flex : 1,
					width : 60,
					margin: '5px 3px 5px 3px',
					handler : function(){
						win.close();
						derivedFormWin(node.referenceId,null,function(selected){
							deskTop.changeNode(node,selected);
						})
					}
				}));
			}
			if(this.window){
				this.close();
			}
			if(items.length){
				this.window = Ext.create('Ext.window.Window',{
									id : 'nodeBtnWin',
									x : event.x + 15,
									y : event.y - 75,
									items: items
								});
				this.window.show();
			}
		},
		
		close : function(){
			this.window.close();
		}
	
	});
	
	Ext.define("DigiCompass.Web.app.equipmentTemplateV2.Toolbar",{
		extend : 'Ext.toolbar.Toolbar',
		node : null,
		eskTop : null,
		foldBtn   : null,
		changeBtn : null,
		deleteBtn : null,
		constructor : function(_deskTop){
			this.deskTop = _deskTop;
			var t = this;
			this.foldBtn = Ext.create("Ext.button.Button",{
					text : 'Fold',
					icon : equipImg.fold,
					disabled  : true,
					width : 70,
					handler : function() {
						if(t.foldBtn.el.dom.attributes._needdisabled.value) return t.foldBtn.setDisabled(true);
						_deskTop.foldingNode(t.node);
						this.setText(t.node.isShow === false ? 'Unfold' : 'Fold');
						this.setIcon(t.node.isShow === false ? equipImg.unfold : equipImg.fold)
					}
			}).addClass("_nodeSelectedConfigBtnClass_");
			this.changeBtn = Ext.create("Ext.button.Button",{
					text : 'Change',
					icon : equipImg.change,
					disabled  : true,
					width : 70,
					handler : function(){
						if(t.changeBtn.el.dom.attributes._needdisabled.value) return t.changeBtn.setDisabled(true);
						derivedFormWin(t.node.referenceId,null,function(selected){
							_deskTop.changeNodeV2(t.node, selected);
							t.expandBtn.setDisabled(true);
						}, true)
					}
			}).addClass("_nodeSelectedConfigBtnClass_");
			this.deleteBtn = Ext.create("Ext.button.Button",{
					text : 'Delete',
					iconCls : 'icon-delete',
					disabled  : true,
					width : 70,
					handler : function(){
						if(t.deleteBtn.el.dom.attributes._needdisabled.value) return t.deleteBtn.setDisabled(true);
						_deskTop.deleteNode(t.node);
						t.selectNode(_deskTop.rootNode);
						_properties.setFocused(_deskTop.rootNode);
						t.expandBtn.setDisabled(true);
					}
			}).addClass("_nodeSelectedConfigBtnClass_");
			this.expandBtn = Ext.create("Ext.button.Button", {
				text : 'Expand',
				iconCls : 'icon-add',
				disabled  : true,
				width : 70,
				handler : function(){
					if(!t.expandBtn.el.dom.attributes._needdisabled || t.expandBtn.el.dom.attributes._needdisabled.value) return t.expandBtn.setDisabled(true);
					_ns.expandNode(t.node, [t.expandBtn, t.foldBtn, t.changeBtn, t.deleteBtn]);
				}
			}).addClass("_nodeSelectedConfigBtnClass_");
			this.superclass.constructor.call(this,{
				id : 'etvt',
				width:210,
				items:[this.foldBtn,this.changeBtn,this.deleteBtn,this.expandBtn]
			});
		},
		selectNode : function(node){
			this.node = node;
			var deskTop = this.deskTop;
			
			var canFolding = !node.isTopRoot && node.isReferenceRoot;
			var canChange = !(node.isTopRoot || (node.embedType === 'Reference' && !node.isTemplateRoot));
			var canDelete = !node.isTopRoot && (node.isTemplateRoot || node.embedType ==='Copy');
			var canExpand = !!((node.relationValue + "").indexOf("*") == -1 && !isNaN(node.relationValue));
			
			if(canDelete) this.deleteBtn.el.dom.attributes._needdisabled.value = "";
			if(canChange) this.changeBtn.el.dom.attributes._needdisabled.value = "";
			if(canFolding) this.foldBtn.el.dom.attributes._needdisabled.value = "";
			try{
				if(canExpand) this.expandBtn.el.dom.attributes._needdisabled.value = "";
			}catch(e){}
			
			this.foldBtn.setDisabled(!canFolding);
			this.foldBtn.setText(node.isShow === false ? 'Unfold' : 'Fold');
			this.foldBtn.setIcon(node.isShow === false ? equipImg.unfold : equipImg.fold);
			this.changeBtn.setDisabled(!canChange);
			this.deleteBtn.setDisabled(!canDelete);
			this.expandBtn.setDisabled(!canExpand);
		}		
	});
	
	Ext.define("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop.Node",{
			    constructor : function(_deskTop,_data, _x, _y){
			    	this.deskTop = _deskTop;
			    	var data = _data;
			    	this.x = _x;
			    	this.y = _y;
			    	this.propertiesGrid = this.deskTop ? this.deskTop.propertiesGrid || null : null;
					if (data && data.serialNumber) {
						serialNumber = data.serialNumber;
					} else {
						serialNumber = ++(this.deskTop.lastNodeId);
						serialNumber = "#" + serialNumber;
					}
					this.serialNumber = serialNumber;
					this.referenceId = data.referenceId;
					this.text = data.name || data.text;
					this.embedType = data.embedType;
					this.isReferenceRoot = data.isReferenceRoot || false;
					this.isTemplateRoot = data.isTemplateRoot || false;
					this.rootId = data.rootId;
					this.mcId = data.mcId;
					this.iconFlag = data.iconFlag || "";
					this.iconFlagShow = data.iconFlagShow || "";
					this.icon = (data.iconFlagShow || data.iconFlag) ? getEquipmentIcon(data.iconFlagShow || data.iconFlag, data.isTopRoot ? "root" : "unSel") 
							: (data.isTopRoot ? DigiCompass.Web.app.svgV2.equipImg.root : DigiCompass.Web.app.svgV2.equipImg.unSel);
					this.id = data.id;
					this.isTopRoot = data.isTopRoot || false;
					this.leaf = data.leaf || false; 
					this.groupId = data.groupId;
					this.parentId = data.parentId;
					this.modelNodes = [];
					this.data = data;
			    },
			    
			    //=========== field =================
				serialNumber: null,
				x: null, 
				y: null, 
				text: null, 
				rootId : null,
				referenceId : null,
			    isReferenceRoot : false,
				isTemplateRoot : false,
				embedTyep : null,
				icon :  null,
				id: null,
				isTopRoot : null,
				leaf : null,
				properties: null,
				groupId : null,
				links: {},
				hidden : false,
				parentId : null,
				modelNodes : null,
				deskTop : null,
				propertiesGrid  : null,
				data : null,
	
				
				//============= method =================
				
				loadProperties : function(){
					this.properties = this.propertiesGrid.getData();
				},
				getData : function(){
					return data;
				},
				click : function(){
					try{
						var propertiesGrid = this.propertiesGrid;
						var deskTop = this.deskTop;
						if(!deskTop.isActivate)return ; 
						if(propertiesGrid && propertiesGrid.focuseNode){
							propertiesGrid.focuseNode.properties = propertiesGrid.getData();
						}
						propertiesGrid.setFocused(this,true);
						propertiesGrid.focuseNode = this;
						deskTop.setFocuseNode(this);
						deskTop.redraw();
						var node = this;
						Ext.getCmp("etvt").selectNode(this);
						//BtnWin.getInstance(deskTop).show(node);
					}catch(e){}
				},
				addLink : function(l){
					this.links[l.id] = l;
				},
				clearLinks : function(){
					this.links = {};
				},
				getLinks : function(groupId){
					if(groupId){
						var r = [];
						if(this.links){
							for(var i in this.links){
								var target = this.links[i].target;
								if(target.groupId === groupId){
									r.push(this.links[i]);
								}
							}
						}
						return r;
					}else{
						return this.links;
					}	
				},
				getDeskTop : function(){
					return this.deskTop;
				}
	});
	
	Ext.define("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop.Link",function(){
		//var targetNode = null;
		return {
			constructor : function(source, target, leftRelation, rightRelation, leftDirection, rightDirection){
		    	this.source = source; 
		    	this.target = target;
		    	this.left = leftDirection;
		    	this.right = rightDirection;
		    	this.properties = [{'id': source.serialNumber, 'name': source.text, 'defaultValue': leftRelation}, 
			                       {'id': target.serialNumber, 'name': target.text, 'defaultValue': rightRelation}];
		    	this.id = "link_"+this.properties[0].id+"_"+this.properties[1].id;
			},
	    	source: null, 
	    	target: null,
	    	properties: null,
			left: null,
			right: null,
			hidden : false,
			id : null
		};
	});
	
	//鐎规矮绠�d3 缂佹ê娴樼�纭呰杽鐎圭懓娅�
	Ext.define("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop",{
		
		propertiesGrid : null,
		
		rootNode : null,
		
		isActivate : true,
		
		id : '',  //dom id
		
		focuseNode : null,
		
		constructor : function(id,propertiesGrid,isActivate){
			this.propertiesGrid = propertiesGrid;
			this.isActivate = isActivate||true;
			this.id = id;
		},
		
		setFocuseNode : function(node){
			this.focuseNode = node;
		},
		
		//閸掓稑缂撴潻鐐村复缁撅拷
		createLinks : function(source, target, leftRelation, rightRelation, leftDirection, rightDirection){
			var newLink = Ext.create('DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop.Link',source, target, leftRelation, rightRelation, leftDirection, rightDirection);
			this.links.push(newLink);
			
			var _source = this.nodesMap.getNode(source.serialNumber);
	        var _target = this.nodesMap.getNode(target.serialNumber);
	        //console.log('add line : ' + (leftRelation + ' : ' + convertN2Number(rightRelation)));
	        this.nodesMap.line(_source, _target, leftRelation, convertN2Number(rightRelation));
			
		    return newLink;
		},
		removeLink : function(link){
			this.links.splice(this.links.indexOf(link),1);
		},
		checkNode : function(node){
			for(var i=0, len=this.nodes.length; i<len; i++){
				var temp = this.nodes[i];
				if(temp.serialNumber === node.serialNumber){
					return true;
				}
			}
			return false;
		},
		createNode : function(data, x, y){
			var node = Ext.create("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop.Node",this,data, x, y);
			this.nodes.push(node);
			
			var tempMapNode = this.nodesMap.getNode(node.serialNumber);
			if (!tempMapNode) {
				tempMapNode = new com.digicompass.equipment.Node(node.serialNumber);
				//console.log('add node : ', tempMapNode);
				this.nodesMap.addNode(tempMapNode);
			} 
			return node;
		},
		createRootNode : function(){
			var data = {};
			data.isTopRoot = true;
			data.name = "Root";
			this.focuseNode = this.rootNode = this.createNode(data,0,0);
			this.redraw();
			Ext.getCmp("etvt").selectNode(_ns.rootNode);
			return this.rootNode;
		},
		
		removeNode : function(node){
			for(var i in this.nodes){
				if(this.nodes[i].serialNumber === node.serialNumber){
					this.nodes.splice(i,1);
					break;
				}
			}
		},
		
		deleteNode : function(node){
			this.changeNode(node,null);
		},
		expandNode : function(node, btn){
			var rootNum = node.relationValue;
			var ns = this;
			if(isNaN(rootNum) || parseInt(rootNum) < 1) return btn[0].setDisabled(true);
			if(!ns.isCouldExpand(node)) return btn[0].setDisabled(true);
			var pLinks = [];
			var cLinks = [];
			var oldLinks = ns.getLinksByNode(node);
			for(var i in oldLinks){
				var link = Ext.clone(oldLinks[i]);
				if(link.source == node){
					cLinks.push(link);
				}
				if(link.target == node){
					pLinks.push(link);
				}
			}
			var tree = ns.getTheRelationTree(node);
			if(tree.isCouldnotExpand) return btn[0].setDisabled(true);
			ns._removeExpandNodesAndLinks(node);
			ns._addExpandNodesAndLinks(tree);
			ns.redraw();
			for(var bt=0; bt<btn.length; bt++){
				btn[bt].setDisabled(true);
			}
		},
		_removeExpandNodesAndLinks : function(node){
			var ns = this;
			var links = ns.getLinksByNode(node);
			for(var i in links){
				var link = links[i];
				if(link.source == node && link.target){
					var tmpT = Ext.clone(link.target);
					ns._removeExpandNodesAndLinks(tmpT);
				}
				if(link.target == node){
					ns.removeLink(link);
				}
			}
			if(!node.isTopRoot) ns.removeNode(node);
		},
		_addExpandNodesAndLinks : function(tree){
			var ns = this;
			if(tree.length){
				for(var a=0; a<tree.length; a++){
					ns._addExpandNodesAndLinks(tree[a]);
				}
			}else if(tree.node){
				var qty = tree.qty;
				for(var b=0; b<qty; b++){
					var tmpN = myClone(tree.node.data);
					var newNode = null;
					if(tree.node.isTopRoot){
						newNode = tree.node;
					}else{
						newNode = ns.addNode(tmpN, tmpN.embedType === "Reference", true);
					}
					if(tree.parent){
						var tmpS1 = tree.parent.serialNumber;
						var tmpS2 = newNode.serialNumber;
						var tmpP = ns.nodesMap.getNode(tmpS1);
						var tmpNew = ns.nodesMap.getNode(tmpS2);
						if(tmpP && tmpNew){
							ns.nodesMap.line(tmpP, tmpNew, "1", "1");
							ns.createLinks(tree.parent, newNode, "1", "1", false, true);
						}
					}
					if(tree.children.length){
						for(var j=0; j<tree.children.length; j++){
							tree.children[j].parent = newNode;
							var child = Ext.clone(tree.children[j]);
							ns._addExpandNodesAndLinks(child);
						}
					}
				}
			}
		},
		getTheRelationTree : function(node){
			var ns = this;
			var pLink = null;
			var cLinks = [];
			var oldLinks = ns.getLinksByNode(node);
			for(var i in oldLinks){
				var link = Ext.clone(oldLinks[i]);
				if(link.source == node){
					cLinks.push(link);
				}
				if(link.target == node){
					pLink = link;
				}
			}
			var totleNum = 1;
			try{
				totleNum = parseInt(node.relationValue) / parseInt(pLink.properties[1].defaultValue);
			}catch(e){}
			if(parseInt(totleNum) != +totleNum) return {isCouldnotExpand : true};
			if(!node.data.models) node.data.models = [{}];
			node.data.models[0].properties = Ext.clone(node.properties);
			var tree = {totleNum : totleNum, node : node, children : ns._getTheRelationTree(cLinks, totleNum)};
			if(pLink && pLink.source){
				tree.qty = pLink.properties[1].defaultValue;
				tree.parent = pLink.source;
			}else{
				tree.qty = 1;
			}
			return tree;
		},
		_getTheRelationTree : function(cLinks, totleNum){
			var ns = this;
			var children = [];
			for(var a=0; a<cLinks.length; a++){
				var node = Ext.clone(cLinks[a].target);
				var _cLinks = [];
				var _allLinks = ns.getLinksByNode(node);
				for(var i in _allLinks){
					var link = Ext.clone(_allLinks[i]);
					if(link.source == node){
						_cLinks.push(link);
					}
				}
				if(!node.data.models) node.data.models = [{}];
				node.data.models[0].properties = Ext.clone(node.properties);
				children.push({totleNum : totleNum, node : node, qty : cLinks[a].properties[1].defaultValue, children : ns._getTheRelationTree(_cLinks)})
			}
			return children;
		},
		isCouldExpand : function(node){
			var rootNum = node.relationValue;
			if(isNaN(rootNum) || parseInt(rootNum) < 1) return false;
			var tmp = true;
			var ns = this;
			var oldLinks = ns.getLinksByNode(node);
			var cLinks = [];
			var pLinks = [];
			for(var i in oldLinks){
				var link = Ext.clone(oldLinks[i]);
				if(link.source == node){
					cLinks.push(link);
				}
				if(link.target == node){
					pLinks.push(link);
				}
			}
			if(pLinks.length > 1){
				tmp = false;
			}else if(!ns._isCouldExpand(cLinks)){
				tmp = false;
			}
			return tmp;
		},
		_isCouldExpand : function(cLinks){
			var tmp = true;
			var ns = this;
			for(var a=0; a<cLinks.length; a++){
				if(!ns.isCouldExpand(cLinks[a].target)){
					tmp = false;
				}
			}
			return tmp;
		},
		changeNodeV2 : function(oldNode, newNode){
			var ns = this;
			var _newNode = [];
			if(newNode.length){
				for(var a=0; a<newNode.length; a++){
					var tmp = null;
					if(newNode[a].qty && newNode[a].qty > 1){
						for(var b=0; b<newNode[a].qty; b++){
							var _tmp = myClone(newNode[a].data)
							tmp = this.addNode(_tmp, oldNode.embedType === "Reference")
							if(tmp)	_newNode.push(tmp);
						}
					}else{
						tmp = this.addNode(newNode[a].data, oldNode.embedType === "Reference")
						if(tmp)	_newNode.push(tmp);
					}
				}
				
			}
			
			var removeOldNode = function(oldNode, _newNode){
				changeRelation(oldNode, _newNode)
				if(oldNode.modelNodes){
					for(var i in oldNode.modelNodes){
						removeOldNode(oldNode.modelNodes[i], null);
					}
				}
				ns.removeNode(oldNode);
			}
			var changeRelation = function(oldNode, _newNode){
				var oldLinks = ns.getLinksByNode(oldNode);
				var tmpN, oldN, newN;
				if(oldLinks.length){
					newN = [];
					oldN = ns.nodesMap.getNode(oldNode.serialNumber);
					if(_newNode){
						for(var a=0; a<_newNode.length; a++){
							newN.push(ns.nodesMap.getNode(_newNode[a].serialNumber));
						}
					}
				}
				for(var i in oldLinks){
					var link = oldLinks[i];
					if(oldNode.isTemplateRoot && _newNode !== null){
						for(var a=0; a<newN.length; a++){
							var _link = Ext.clone(link);
							if(link.target.serialNumber == oldNode.serialNumber) {
								tmpN = ns.nodesMap.getNode(_link.source.serialNumber);
								var ddd = _link.properties[1].defaultValue;
								ns.nodesMap.adjustRatio(tmpN, newN[a], "1", "1");
								//ns.nodesMap.adjustRatio(tmpN, newN[a], "1", ddd == "N" ? -1 : ddd);
								tmpN.removeRelation(oldN);
						        ns.nodesMap.line(tmpN, newN[a], "1", "1");
						        //ns.nodesMap.line(tmpN, newN[a], "1", ddd == "N" ? -1 : ddd);
						        
						        ns.createLinks(link.source, _newNode[a], "1", "1", false, true);
								//ns.createLinks(link.source, _newNode[a], "1", link.properties[1].defaultValue == "N" ? -1 : link.properties[1].defaultValue, false, true);
							}
							if(link.source.serialNumber == oldNode.serialNumber){
								tmpN = ns.nodesMap.getNode(_link.target.serialNumber);
								var ddd = _link.properties[1].defaultValue;
								ns.nodesMap.adjustRatio(newN[a], tmpN, "1", ddd == "N" ? -1 : ddd);
								tmpN.removeRelation(oldN);
								ns.nodesMap.line(newN[a], tmpN, "1", ddd == "N" ? -1 : ddd);
								
								ns.createLinks(_newNode[a], link.target, "1", link.properties[1].defaultValue == "N" ? -1 : link.properties[1].defaultValue, false, true);
							}
						}
					}
					ns.removeLink(link)
				}
			}

			removeOldNode(oldNode, _newNode)
			ns.redraw()
		},
		changeNode : function(oldNode, newNode){
			if(newNode) newNode = this.addNode(newNode, oldNode.embedType === "Reference")
			
			var ns = this;
			
			var removeOldNode = function(oldNode,newNode){
				changeRelation(oldNode, newNode)
				if(oldNode.modelNodes){
					for(var i in oldNode.modelNodes){
						removeOldNode(oldNode.modelNodes[i], null);
					}
				}
				ns.removeNode(oldNode);
			}
			var changeRelation = function(oldNode,newNode){
				var oldLinks = ns.getLinksByNode(oldNode);
				var tmpN, oldN, newN;
				if(oldLinks.length){
					oldN = ns.nodesMap.getNode(oldNode.serialNumber);
					if(newNode) newN = ns.nodesMap.getNode(newNode.serialNumber);
				}
				for(var i in oldLinks){
					var link = oldLinks[i]
					if(oldNode.isTemplateRoot && newNode !== null){
						if(link.target === oldNode) {
							tmpN = ns.nodesMap.getNode(link.source.serialNumber);
							var ddd = link.properties[1].defaultValue;
							ns.nodesMap.adjustRatio(tmpN, newN, "1", ddd == "N" ? -1 : ddd);
							tmpN.removeRelation(oldN);
					        ns.nodesMap.line(tmpN, newN, "1", ddd == "N" ? -1 : ddd);
					        
					        link.target = newNode;
					        link.properties[1].id = newNode.seriaNumber;
					        link.properties[1].name = newNode.text;
						}
						if(link.source === oldNode){
							tmpN = ns.nodesMap.getNode(link.target.serialNumber);
							var ddd = link.properties[1].defaultValue;
							ns.nodesMap.adjustRatio(newN, tmpN, "1", ddd == "N" ? -1 : ddd);
							tmpN.removeRelation(oldN);
							ns.nodesMap.line(newN, tmpN, "1", ddd == "N" ? -1 : ddd);
							
							link.source = newNode;
					        link.properties[0].id = newNode.seriaNumber;
					        link.properties[0].name = newNode.text;
						}
						//if(link.source === oldNode) ns.removeLink(link)
					}else{
						ns.removeLink(link)
					}
				}
			}
			removeOldNode(oldNode, newNode)
			ns.redraw()
		},
		
		/**
		 * Init Relation
		 */
		createInitRelation : function(data){
			// delete map 
			//console.log('remove all node!');
			this.nodesMap.removeAllNode();
			for(var i in data.models){
				model = data.models[i];
				if(model.isTopRoot){
					// this.rootNode = model;
					if(data.properties.length)model.properties = data.properties;
					if(data.children.length)model.children = data.children;
					break;
				}
			};
			modelMap = {};
			var ns = this;
			var loadModels = function(node){
			    modelMap[node.mcId] = node;
				var n = ns.createNode(node, node.ponitX, node.pointY);
				if(node.isTopRoot)ns.rootNode = n;
				if(node.models && node.models.length){
					for(var i in node.models){
						 if(i==0)continue;
						 var model = node.models[i];
						 n.modelNodes.push(loadModels(model));
					}
				}
				return n;
			}
			
			 if(data.models){
				for(var i in data.models){
					loadModels(data.models[i]);
				}
			 }

			var relations = data.relations;
			if(relations!=null){
				for(var i=0, len=relations.length; i<len; i++){
					var relation = relations[i];
					var left = modelMap[relation.sourceIndex];
					var right = modelMap[relation.targetIndex];
					var leftRelation = relation.sourceCount;
					var rightRelation = relation.targetCount;
					var leftDirection = false;
					var rightDirection = true;
					var sourceNode = this.getNodeBySerialNumber(left.serialNumber);
					var targetNode = this.getNodeBySerialNumber(right.serialNumber);
					this.createLinks(sourceNode, targetNode, leftRelation, rightRelation,  leftDirection, rightDirection);
				}
			}
			DigiCompass.Web.app.svgV2.redraw(this);
		},
		createInitRelationV2 : function(data){
			this.nodesMap.removeAllNode();
			modelMap = {};
			var ns = this;
			var loadModels = function(node){
			    modelMap[node.mcId] = node;
				var n = ns.createNode(node, node.ponitX, node.pointY);
				if(node.isTopRoot)ns.rootNode = n;
				if(node.models && node.models.length){
					for(var i in node.models){
						 if(i==0)continue;
						 var model = node.models[i];
						 n.modelNodes.push(loadModels(model));
					}
				}
				return n;
			}
			
			if(data.models){
				for(var i in data.models){
					if(!i) data.models.isTopRoot = true;
					loadModels(data.models[i]);
				}
			}

			var relations = data.relations;
			if(relations!=null){
				for(var i=0, len=relations.length; i<len; i++){
					var relation = relations[i];
					var left = modelMap[relation.sourceIndex];
					var right = modelMap[relation.targetIndex];
					var leftRelation = relation.sourceCount;
					var rightRelation = relation.targetCount;
					var leftDirection = false;
					var rightDirection = true;
					var sourceNode = this.getNodeBySerialNumber(left.serialNumber);
					var targetNode = this.getNodeBySerialNumber(right.serialNumber);
					this.createLinks(sourceNode, targetNode, leftRelation, rightRelation,  leftDirection, rightDirection);
				}
			}
			DigiCompass.Web.app.svgV2.redraw(this);
		},
		redraw : function(){
			DigiCompass.Web.app.svgV2.redraw(this);
		},
		hiddenChildNode : function(node){
			DigiCompass.Web.app.svgV2.hiddenChildNode(this,node);
		},
		foldingNode : function(node){
			DigiCompass.Web.app.svgV2.foldingNode(this,node);
		},
		
		setSize : function(width,height){
			DigiCompass.Web.app.svgV2.setSize(this,width,height);
		},
		
		getNodeBySerialNumber : function(serialNumber) {
			for(var i=0, len=this.nodes.length; i<len; i++){
				var node = this.nodes[i];
				if (node.serialNumber === serialNumber) {
					return node;
				}
			}
			return null;
		},
		getLinksByNode : function(node){
			var r = [];
			for(var i in this.links){
				var link = this.links[i];
				if(link.source === node) r.push(link);
				if(link.target === node) r.push(link);
			}
			return r;
		},
		
		addNode : function(datas,isReference, isExpand){
			var ns = this;
						
			var isChildLoopReference = function(node){
				if(ns.rootNode.referenceId && node.referenceId === ns.rootNode.referenceId)return true;
				if(node.children){
					for(var c in node.children){
						if(isChildLoopReference(node.children[c]))return true;
					}
				}
			}
			
			var isModelLoopReference = function(node){
				if(ns.rootNode.referenceId && node.referenceId===ns.rootNode.referenceId)return true;
				if(node.models){
					for(var m in node.models){
						if(isModelLoopReference(node.models[m]))return true;
						if(isChildLoopReference(node.models[m]))return true;
					};
				};
				return false;
			};
			if(isModelLoopReference(datas)){
				Notification.showNotification('Loop Reference!');
				return ;
			};
			
			if(isChildLoopReference(datas)){
				Notification.showNotification('Loop Reference!');
				return ;
			};
			
			var rootNode;
			var rootNodeOldSerialNumber;
			var oldSerialNumberMapping = {};
			var templateRoot = true;
			var _cNode = function(raw){
				var nd = raw;
				nd.isReferenceRoot = isReference ? nd.isReferenceRoot || false : false;
				if(!isReference){
					nd.id = null;
				}
				nd.isTopRoot = nd.isTopRoot || false;
				nd.leaf = nd.leaf || false;
				nd.isTemplateRoot = templateRoot || !isReference;
				templateRoot = false;
				var x = 0, y = 0;
				osn = nd.serialNumber;
				var node;
				if(nd.isTopRoot){
					// nd.rootId = raw.rootId;
					nd.serialNumber = null;  //闁插秵鏌婇悽鐔稿灇serialNumber
					nd.isTopRoot = false;
					nd.isReferenceRoot = false || isReference;
					nd.embedType = isReference ? 'Reference' : 'Copy';
					node = rootNode = _ns.createNode(nd,x,y);
					oldSerialNumberMapping[osn] = node.serialNumber;
				}else{
					if(!rootNode)alert('not have root node');
					if(isReference){
						nd.serialNumber = rootNode.serialNumber + "@" + nd.mcId;
					}else{
						nd.serialNumber = null;
					}
					nd.embedType = isReference ? 'Reference' : 'Copy';
					nd.groupId = rootNode.serialNumber;
					node = _ns.createNode(nd,x,y);
					rootNode.modelNodes.push(node);
					oldSerialNumberMapping[osn] = node.serialNumber;
					if(nd.models){
						node.modelNodes = [];
						for(var i in nd.models){
							if(i==0)continue;
							node.modelNodes.push(_cNode(nd.models[i]));
						}
					}
				}
				return node;
			};
			var _data = datas.models;
			if(_data){
				for(var i=0;i<_data.length;i++){
					if(i==0 && isExpand){
						_data[i].isTopRoot = true;
						_data[i].name = datas.name;
						_data[i].parentId = datas.parentId;
						_data[i].referenceId = datas.referenceId;
						_data[i].rootId = datas.rootId;
						_data[i].embedType = datas.embedType;
					}
					_cNode(_data[i]);
				}
				var relations = datas.relations;
				if(relations!=null){
					for(var i=0, len=relations.length; i<len; i++){
						var relation = relations[i];
						sourceIndex = oldSerialNumberMapping[relation.sourceIndex];
						targetIndex = oldSerialNumberMapping[relation.targetIndex];
						var sourceNode = _ns.getNodeBySerialNumber(sourceIndex);
						var targetNode = _ns.getNodeBySerialNumber(targetIndex);
						_ns.createLinks(sourceNode, targetNode, relation.sourceCount, relation.targetCount,  false, true);
					}
				}
			}else{
				if(isExpand) datas.isTopRoot = true;
				_cNode(datas);
			}
			ns.redraw();
			if(isReference){
				ns.hiddenChildNode(rootNode);
			}
			return rootNode;
		},
		
		dropNode : function(data,isReference){
			var ns = this;
			caller.callService({
				MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
				COMMAND : 'COMMAND_QUERY_INFO',
				KEY : 'DROPNODE',
				BUSINESS_DATA :  data.id
			},function(message){
				var datas = Ext.JSON.decode(message.BUSINESS_DATA)
				ns.addNode(datas,isReference);
			});
		},
		
		getLinkById : function(id){
			for(var i=0, len=this.links.length; i<len; i++){
				var link = this.links[i];
				if (link.id === link) {
					return link;
				}
			}
			return null;
		},
		
		initializeDefaultSvg : function(width,height) {
			//var ns = this;
			DigiCompass.Web.app.svgV2.initializeSvg({
				width: width || Ext.getCmp(this.id).getWidth(),
				height: height || Ext.getCmp(this.id).getHeight(),
				svgId: this.id,
				namespace: this
			});
		},
		clearSvg : function() {
			if (!this.nodes || !this.link) {
				return;
			}
			var nodesLen = this.nodes.length;
			if(nodesLen > 0){
				this.nodes.splice(0, nodesLen);
			}
			var linksLen = this.links.length;
			if(linksLen > 0){
				this.links.splice(0, linksLen);
			}
			this.selected_nodes = [];
			this.current_selected_node = null;
			this.current_selected_link = null;
			
			this.nodesMap.removeAllNode();
			com.digicompass.equipment.Sequence.reset();
			DigiCompass.Web.app.svgV2.redraw(this);
		},
		
		getModels : function(){
			var models = [];
			for(var i in this.nodes){
				var n = this.nodes[i];
				//n.loadProperties();
				models[i] = {
				    name : n.text || n.name || "",
					id : n.id,
					pointX : n.x,
					pointY : n.y,
					serialNumber : n.serialNumber,
					properties : getProperties(n.properties),
					parentId : n.parentId,
					referenceId : n.referenceId,
					embedType : n.embedType,
					mcId : n.mcId,
					isReferenceRoot : n.isReferenceRoot,
					isTemplateRoot : n.isTemplateRoot,
					isTopRoot : n.isTopRoot,
					rootId : n.rootId
				};
			}
			return models;
		},
		
		getRelations : function(){
			var rs = [];
			for(var i in this.links){
				var l = this.links[i];
				rs[i] = {
					sourceIndex : l.source.serialNumber,
					sourceCount : convertN2Number(l.properties[0].defaultValue),
					targetIndex : l.target.serialNumber,
					targetCount : convertN2Number(l.properties[1].defaultValue)
				};
			}
			return rs;
		},
		nodeMouseup : function(d, me) {
			if(Ext.getCmp("changeEquipmentV3WinId")) return;
			var nodeMouseupCallback = function(datas,ns) {
				var sourceValue = datas.sourceValue;
				var targetValue = datas.targetValue;
				var source = datas.source;
				var target = datas.target;
				var _source = datas._source;
				var _target = datas._target;
				var properties = [{'id': source.serialNumber, 'name': source.text, 'defaultValue': sourceValue}, 
				                  {'id': target.serialNumber, 'name': target.text, 'defaultValue': targetValue}];
		        link = {source: source, target: target, left: false, right: true, properties: properties};
		        ns.links.push(link);
		        //console.log('add line : ' + (sourceValue + ' : ' + convertN2Number(targetValue)));
		        ns.nodesMap.line(_source, _target, sourceValue, convertN2Number(targetValue));

			    // select new link
		        ns.current_selected_link = link;
		        ns.current_selected_node = null;
		        ns.selected_nodes = [];
			      
			    // enable zoom
		        ns.svg.call(d3.behavior.zoom().on('zoom'), function(){DigiCompass.Web.app.svgV2.rescale(ns);});
		        DigiCompass.Web.app.svgV2.redraw(ns);	        
		        ns.linkItemClick();	
			}
			
			if (!this.mousedown_node) {
		    	return ;
		    }
		    // needed by FF
		    this.drag_line.classed('hidden', true).style('marker-end', '');

		    // check for drag-to-self
		    this.mouseup_node = d;
		    if (this.mouseup_node === this.mousedown_node) {
		    	DigiCompass.Web.app.svgV2.resetMouseVars(this);
		    	return;
		    }

		    // unenlarge target node
		    d3.select(me).attr('transform', '');
		    
		    if (this.linkHasExist()) {
		    	return;
		    }

		    // add link to graph (update if exists)
		    // NB: links are strictly source < target; arrows separately specified by booleans
		    var source, target, direction;
		    var source = this.mousedown_node;
		    var target = this.mouseup_node;
		    var _source = this.nodesMap.getNode(source.serialNumber);
	        var _target = this.nodesMap.getNode(target.serialNumber);
	        var _canLine = this.nodesMap.canLine(_source, _target);
	        //console.log('map', this.nodesMap.getNodes());
	        //console.log('_canLine', _canLine);
	        if (_canLine === false) {
	        	return Notification.showNotification('Counld not line between the two nodes!');
	        } else if (_canLine === true) {
	        	var args = {
	    	    	source: source,
	    	    	target: target,
	    	    	_source: _source,
	    	    	_target: _target,
	    	    	direction: direction,
	    	    	sourceField: source.text,
	    	    	sourceValue: '1',
	    	    	targetField: target.text,
	    	    	targetValue: '1',
	    	    	fn: nodeMouseupCallback
	    	    }
	        	editLinkWin(null, null, args, true, this);
	        } else {
	        	var tempValue1 = 1;
	        	var tempValue2 = 1;
	        	if (_canLine === -1) {
	        		tempValue2 = 'N';
	        	} else {
	        		tempValue2 = _canLine;
	        	}
	        	var args = {
        	    	source: source,
        	    	target: target,
        	    	_source: _source,
        	    	_target: _target,
        	    	sourceField: source.text,
        	    	sourceValue: tempValue1,
        	    	targetField: target.text,
        	    	targetValue: tempValue2
        	    }
	        	nodeMouseupCallback(args,this);
	        }
		},
		linkHasExist : function(){
			for(var i=0, len=this.links.length; i<len; i++){
				var temp = this.links[i];
				if (temp.source == this.mousedown_node && temp.target == this.mouseup_node) {
					return true;
				}
			}
			return false;
		},
		linkItemClick : function(){
			var gridData = [];
			if(this.current_selected_link.properties){
				gridData = this.current_selected_link.properties;
			}
			if(Ext.getCmp('equipmentRelationProperties')){
				Ext.getCmp('equipmentRelationProperties')[this.HANDLER_TYPE] = this.HANDLER_TYPE_LINK;
				Ext.getCmp('equipmentRelationProperties').getStore().loadData(gridData);
			}
			if(Ext.getCmp('lockHeaderId')) Ext.getCmp('lockHeaderId').setVisible(false);
		}

	});
	
	var selectParent = function(parent){
		Ext.getCmp('equipmentRelationAdd').getForm().setValues({parentId : parent.id,parentName : parent.name});
		caller.callService({
					MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
					COMMAND : 'COMMAND_QUERY_INFO',
					KEY : 'ADDCHILD',
					BUSINESS_DATA :  parent.id
				},function(message){
						var parentNode = Ext.JSON.decode(message.BUSINESS_DATA);
						var rootNode = _ns.createRootNode();
						rootNode.parentId = parentNode.id;
						rootNode.properties = [];
						Ext.each(parentNode.properties,function(d){
							d.belong = d.belong === "System" ? 'System' : 'Parent';
							d.isParentLock = d.isParentLock || d.locked;
							d.locked = false;
							d.isChildModify = d.isChildModify || false;
						});
						rootNode.properties = parentNode.properties;
						_properties.setFocused(_ns.rootNode);
						var oldSerialNumberMapping = {};
						oldSerialNumberMapping[parentNode.models[0].serialNumber] = rootNode.serialNumber;
						var _cNode = function(data) {
							data.isReferenceRoot = data.isReferenceRoot || false;
							osn = data.serialNumber;
							if(!data.isTemplateRoot){
								var ts = data.groupId.split("@")[0];
								var newSerialNumber = oldSerialNumberMapping[ts];
								data.groupId = data.groupId.replace(ts,newSerialNumber);
								data.mcId = data.mcId.replace(ts,newSerialNumber);
								data.serialNumber = data.serialNumber.replace(ts,newSerialNumber);
							}
							var x = data.x, y = data.y;
							var node = _ns.createNode(data,x,y);
							oldSerialNumberMapping[osn] = node.serialNumber;
							if(data.models){
								for(var i in data.models){
									if(i==0)continue;
									_cNode(data.models[i]);
								}
							}
						}
						var _data = parentNode.models;
						if(_data){
							for(var i=1;i<_data.length;i++){
								_cNode(_data[i]);
							}
							var relations =  parentNode.relations;
							if(relations!=null){
								for(var i=0, len=relations.length; i<len; i++){
									var relation = relations[i];
									sourceIndex = oldSerialNumberMapping[relation.sourceIndex];
									targetIndex = oldSerialNumberMapping[relation.targetIndex];
									var sourceNode = _ns.getNodeBySerialNumber(sourceIndex);
									var targetNode = _ns.getNodeBySerialNumber(targetIndex);
									_ns.createLinks(sourceNode, targetNode, relation.sourceCount, relation.targetCount,  false, true);
								}
							}
						}
						_ns.redraw();
				}
		);
	};
	
	//create left panel 
	var createLeftPanel = function(data){
		var fields = ['id', 'name', 'description', 'groupId' , 'referenced'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Name',
						dataIndex : 'name',
						//sortable : false,
						flex: 1
					},{
						header : 'Description',
						dataIndex : 'description',
						//sortable : false,
						flex: 1
					}
					// ,{  
						// flex : 1,
						// width: 40,
						// menuDisabled: true,
						// xtype: 'actioncolumn',
						// tooltip: 'delete',
						// align: 'center',
						// items: [{
							// icon: './styles/cmp/images/add.png',  
							// scope: this,
							// tooltip : 'Add Child Template',
							// getClass: function(value,meta,record,rowIx,colIx, store) {            
								// return 'x-hide-display';  //Hide the action icon
							// },
							// handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
								// DigiCompass.Web.UI.Wheel.showDetail();
								// initForm(_ns);								
								// UiFunction.setTitle('equipmentRelationAdd', 'Equipment Template');
								// selectParent(record.raw);
							// }
						// }]
					// }
					];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA).list;
		if(datas.length) datas = datas.reverse();
		var setChecked = function(node){
			node.checked = false;
			if(node.children){
				for(var i in node.children){
					setChecked(node.children[i])
				}
			}
		}
		for(var n in datas){
			setChecked(datas[n])
		}
		if(!showDeletedEquipment) removeDeletedEquipment(datas);
		if (Ext.getCmp('equipmentRelationListView')) {
			Ext.getCmp('equipmentRelationListView').reconfigData(datas);
			Ext.getCmp('equipmentObjectExplorerId').getStore().sort("name", "ASC");
		} else {
			  var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
				  	id : 'equipmentObjectExplorerId',
					columns: columns,
					fields: fields,
					width: 'fit',
					height: 735,
					data: [],
					listeners : {
						cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts ){
								
						},
						itemclick : function( grid, record, item, index, e, eOpts){
							//For TEST
							if(0){
								changeEquipmentV3Fn(function(list){
									
								}, record.raw.id, {
									'338eaa6e-5bb3-4229-8419-4eaf303ec8c4' : [{id: '338eaa6e-5bb3-4229-8419-4eaf303ec8c4'}]
									,'8ee5e2d6-e971-4676-9770-e46bab713127' : [{id: '8ee5e2d6-e971-4676-9770-e46bab713127'}, {id: '', isInit : true}]
								});
								return;
							}
							//if(cellIndex===2)return ;
							var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
							if(isChecked){
								 return;
							}
							var id = record.raw.id;
							DigiCompass.Web.UI.Wheel.showDetail();
							var formData = {
								MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
								COMMAND : 'COMMAND_QUERY_INFO',
								KEY : 'LOADFORM',
								BUSINESS_DATA :  id
							};
							caller.callService(formData,function(data){
									var data = Ext.JSON.decode(data.BUSINESS_DATA);
									_fillForm(data);
									if(Ext.getCmp("changeIconBtnId")) Ext.getCmp("changeIconBtnId").setIcon(getEquipmentIcon(data.iconFlagShow || data.iconFlag, "unSel"));
									setTimeout(function(){
										changeUploadBtnIconSize();
										setTimeout(function(){
											changeUploadBtnIconSize();
										},700)
									},200)
							})
							if(Ext.getCmp('saveBtnId')){
								Ext.getCmp('saveBtnId').setDisabled(false);
							}
						},
						itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
							DigiCompass.Web.app.financialCategory.showActionImg(record, item, true , true);
						},
						itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
							DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
						},
						checkchange : function(n, c){
							setCheckedInTree(n, c);
							if(!c && n.parentNode){
								var pp = n.parentNode;
								while(pp){
									pp.set("checked", false);
									pp = pp.parentNode;
								}
							}
						},
						render : function(){
							Ext.getCmp('equipmentObjectExplorerId').getStore().sort("name", "ASC");
						}
					}
				});
				
			  	objectExplorer.on('checkchange', function(node, checked) {
			  		fixTreeSelection(objectExplorer.getSelectionModel())
					// // objectExplorer.checkchild(node, checked);  
					// // objectExplorer.checkparent(node);  
		    	});
		    	objectExplorer.on('itemcollapse', function(){
		    		fixTreeSelection(objectExplorer.getSelectionModel())
		    	})
			  	
				var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
					width: 'fit',
					id: 'equipmentCatalogueId',
					height: 722,
					data: [],
					collapsible: true,
					split: true,
					region: 'center',
					hidden: true
				});
				
				var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
					id : 'equipmentRelationListView',
					module: 'MOD_EQUIPMENT_TEMPLATEV2',
					command: 'COMMAND_QUERY_TREE',
					region: 'west',
					otherParam: {"SPACE":'enter'},
					layout: 'border',
					width: 400,
					height: 530,
					objectExplorer: objectExplorer,
					catalogue: catalogue,
					hidden: true
				});
				
				mainPanel.reconfigData(datas);
				
				var objExpPanel = Ext.getCmp('obj-exp');
				if (objExpPanel) {
					objExpPanel.removeAll();
				}
				
				var cataloguePanel = Ext.getCmp('obj-cat');
				if (cataloguePanel) {
					cataloguePanel.removeAll();
				}
				
				var toolBar = Ext.create('Ext.toolbar.Toolbar',{
					width:200,
					items:[{
						xtype : 'button',
						text : 'New',
						iconCls : 'icon-add',
						handler : function() {
							DigiCompass.Web.UI.Wheel.showDetail();
							if(!Ext.getCmp('equipmentRelationAdd')){
								var formPanel = addFormPanel();
								Ext.getCmp('obj-details').removeAll();
								Ext.getCmp('obj-details').add(formPanel);
								_ns.initializeDefaultSvg();
								setDropTarget(_ns.id,_ns);
							}else{
								clearFormData();
								_ns.clearSvg();
								Ext.getCmp("btnSelectParent").setDisabled(false);
							}
							UiFunction.setTitle('equipmentRelationAdd', 'Equipment Template');
							_ns.createRootNode();
							_properties.setFocused(_ns.rootNode);
							Ext.getCmp("exportBtn").setDisabled(true);
							if(Ext.getCmp('saveBtnId')) Ext.getCmp('saveBtnId').setDisabled(false);
							if(Ext.getCmp('changeIconBtnId')) Ext.getCmp('changeIconBtnId').setIcon(getEquipmentIcon("", "unSel"));
						}
					},{
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						id : 'btn_delete',
						handler : function() {
							var checkeds = [];
							if(objectExplorer.store && objectExplorer.store.tree && objectExplorer.store.tree.nodeHash){
								for(var u in objectExplorer.store.tree.nodeHash){
									if(u && objectExplorer.store.tree.nodeHash[u] && objectExplorer.store.tree.nodeHash[u].data
											&& objectExplorer.store.tree.nodeHash[u].data.checked){
										if(objectExplorer.store.tree.nodeHash[u].data.referenced){
											Notification.showNotification(objectExplorer.store.tree.nodeHash[u].data.name
													+ ' is referenced , can\'t delete!');
											return ;
										}
										checkeds.push(u);
									}
								}
							}else{
								return;
							}
							/*var selected = [];
							for(var i = 0 ; i <selected.length ; i++){
								if(selected[i].referenced){
									Notification.showNotification(selected[i].name+' is referenced , can\'t delete!');
									return ;
								}
								checkeds.push(selected[i].id);
							}*/
							if (checkeds.length == 0) {
								Notification.showNotification('Please select a record!');
								return;
							}
							caller.callService({
								BUSINESS_DATA : checkeds,
								MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
								COMMAND : 'COMMAND_DEL',
								KEY : 'DELETE'
							},function(message){
								Notification.showNotification('Delete Equipment Template Successfully!');
								var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
								DigiCompass.Web.UI.CometdPublish.equipmentTemplateV2Publish(queryParam);
								DigiCompass.Web.app.sitegroup.removeDetail();
								Ext.getCmp('btn_delete').setDisabled(false);
							});
							this.setDisabled(true);
						}
					},{
						xtype : 'button',
						text : 'Export',
						iconCls : 'icon-next',
						handler : function(){
							var selected = [];
							if(objectExplorer.store && objectExplorer.store.tree && objectExplorer.store.tree.nodeHash){
								for(var u in objectExplorer.store.tree.nodeHash){
									if(u && objectExplorer.store.tree.nodeHash[u] && objectExplorer.store.tree.nodeHash[u].data
											&& objectExplorer.store.tree.nodeHash[u].data.checked){
										selected.push({id:u, name:objectExplorer.store.tree.nodeHash[u].data.name});
									}
								}
							}else{
								return;
							}
							if(!selected.length) return;
							var id = [];
							var name = [];
							for(var q=0; q<selected.length; q++){
								id.push(selected[q].id);
								if(q<5) name.push(selected[q].name);
							}
							if(selected.length > 5) name.push("etc");
							if(!id || !name) return;
							id = id.join(",");
							name = name.join("_");
							id = encodeURI(id);
							window.open(config.contextPath + "/equipmentXMLServlet?action=COMMAND_EXPORT&id="+id+"&name="+name);
						}
					},{
						xtype : 'button',
						text : 'Import',
						iconCls : 'icon-prev',
						handler : function(){
						var form = Ext.create('Ext.form.Panel', {
							width: 400,
							bodyPadding: 10,
							frame: true,
							renderTo: Ext.getBody(),
							items: [{
								xtype: 'filefield',
								name: 'equipment',
								fieldLabel: 'Equipment',
								labelWidth: 50,
								msgTarget: 'side',
								allowBlank: false,
								anchor: '100%',
								inputType : 'xml',
								buttonText: 'Select Equipment...'
							}],

							buttons: [{
								text: 'Import',
								handler: function() {
									var form = this.up('form').getForm();
									if(form.isValid()){
										form.submit({
											url: '/equipmentXMLServlet?action=COMMAND_IMPORT',
											method : 'POST',
											waitMsg: 'Import Equipment...',
											success: function(fp, o) {
												if(o.response && o.response.responseText){
													var mess = Ext.JSON.decode(o.response.responseText);
													if(mess){
														if(!mess.success){
															Notification.showNotification('Import Equipment Template Failed!');
															return;
														}
													}
												}
												Notification.showNotification('Import Equipment Template Successfully!');
												var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
												DigiCompass.Web.UI.CometdPublish.equipmentTemplateV2Publish(queryParam);
												DigiCompass.Web.app.sitegroup.removeDetail();
												Ext.getCmp("importWin").close();
											},
											failure: function(form, action) {
												switch (action.failureType) {
													case Ext.form.action.Action.CLIENT_INVALID:
														Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
														break;
													case Ext.form.action.Action.CONNECT_FAILURE:
														Ext.Msg.alert('Failure', 'Ajax communication failed');
														break;
													case Ext.form.action.Action.SERVER_INVALID:
													   Ext.Msg.alert('Failure', action.result.msg);
											   }
											}
										});
									}
								}
							}]
						});
						
							var window = Ext.create('Ext.window.Window',{
									id : 'importWin',
									title : 'Import Equipment',
									items: [form]
							});
							window.show();
						}
					}]
				});
				
				objectExplorer.addDocked(toolBar);
				
				objExpPanel.add(objectExplorer);
				cataloguePanel.add(catalogue);
				catalogue.outerPanel = cataloguePanel;
				cataloguePanel.add(mainPanel);
				
				Ext.getCmp("equipmentObjectExplorerId").getDockedItems()[1].add(Ext.button.Button({
						icon : showDeletedEquipment ? '../../styles/cmp/images/checked.gif' 
									: '../../styles/cmp/images/unchecked.gif',
						text : 'show deleted equipment',
						margin: '0 0 0 10',
						handler : function(){
							showDeletedEquipment = !showDeletedEquipment;
							this.setIcon(showDeletedEquipment ? '../../styles/cmp/images/checked.gif' 
									: '../../styles/cmp/images/unchecked.gif');
							var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			                DigiCompass.Web.UI.CometdPublish.equipmentTemplateV2Publish(queryParam);
			                DigiCompass.Web.app.sitegroup.removeDetail();
						}
					}))
		}
	};	
	
	var initForm = function(_ns){
		if(!Ext.getCmp('equipmentRelationAdd')){
			 var formPanel = addFormPanel();
			 Ext.getCmp('obj-details').removeAll();
			 Ext.getCmp('obj-details').add(formPanel);
			 _ns.initializeDefaultSvg();
			 setDropTarget(_ns.id,_ns);
			 if(_properties.grid.couldnotAddOrDel){
				_properties.grid.width = 600;
				_properties.grid.height = 'fit';
				_properties.grid.collapsible = true;
				_properties.grid.couldnotAddOrDel = false;
				
			 }
		 }else{
			 clearFormData();
			 _ns.clearSvg();
		 }
	};
	
	var _fillForm = function(_data) {
		 initForm(_ns);			
		 if(_data.id){
			Ext.getCmp("btnSelectParent").setDisabled(true);
			Ext.getCmp("exportBtn").setDisabled(false);
		 }else{
			Ext.getCmp("btnSelectParent").setDisabled(false);
			Ext.getCmp("exportBtn").setDisabled(true);
		 };
		 Ext.getCmp('equipmentRelationAdd').getForm().setValues(_data);
		 _ns.createInitRelation(_data);
		 _properties.setFocused(_ns.rootNode);
		 _properties.grid.couldnotChangeProType = _data.hasInstances ? true : false;
		 Ext.getCmp('etvt').selectNode(_ns.rootNode);
	}
	
	clearFormData = function() {
		Ext.getCmp('equipmentRelationId').setValue();
		Ext.getCmp('equipmentRelationName').setValue(' ');
		Ext.getCmp('equipmentRelationDes').setValue(' ');
		Ext.getCmp('parentTemplateId').setValue();
		Ext.getCmp('parentTemplateName').setValue('');
	}
	
	var addFormPanel = function(){
		var saveBtn = Ext.create('Ext.Button', {
			id: 'saveBtnId',
			text: 'Save',
			iconCls : 'icon-save',
			handler : function(){
				var equipmentRelationName = Ext.getCmp('equipmentRelationName');
				if(!equipmentRelationName.isValid()){
					return;
				}
				if(!equipmentRelationName.getValue().split(" ").join("")){
					equipmentRelationName.setValue("");
					return;
				}
				var equipmentRelationDes = Ext.getCmp('equipmentRelationDes');
				if (!equipmentRelationDes.isValid()) {
					return;
				}
				var formPanel = Ext.getCmp('equipmentRelationAdd');
				var _formData = formPanel.getForm().getValues();
				_properties.focuseNode.properties = _properties.getData();
				var formData = {
					MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
					COMMAND : 'COMMAND_SAVE',
					BUSINESS_DATA :  Ext.encode({
							id : _formData.id,
							name : _formData.name,
							description : _formData.description,
							iconFlag : _ns.rootNode.iconFlag || "",
							parentId : _formData.parentId,
							serialNumber : _ns.rootNode.serialNumber,
							models : _ns.getModels(),
							relations : _ns.getRelations(),
							properties : getProperties(_ns.rootNode.properties),
							publik : true
					})
				};
				caller.callService(formData,function(data){
					if(data.STATUS === "success"){
						if(data.BUSINESS_DATA && data.BUSINESS_DATA.repeatName && data.BUSINESS_DATA.repeatName == "repeatName"){
							saveBtn.setDisabled(false);
							Notification.showNotification('Equipment name is repeated!');
						}else{
							Notification.showNotification('Save Equipment Template Successfully!');
							var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
							DigiCompass.Web.UI.CometdPublish.equipmentTemplateV2Publish(queryParam);
							DigiCompass.Web.app.sitegroup.removeDetail();
						}
					}else{
						saveBtn.setDisabled(false);
						Notification.showNotification('Save Equipment Template failed!');
					}
					if(Ext.getCmp('saveBtnId')) Ext.getCmp('saveBtnId').setDisabled(false);
				})
				saveBtn.setDisabled(true);
			}
		});
		var exportBtn = Ext.create("Ext.Button",{
			id : 'exportBtn',
			text : 'Export',
			iconCls : 'icon-next',
			handler : function(){
				var pId = Ext.getCmp("equipmentRelationId").getValue();
				var pName = Ext.getCmp("equipmentRelationName").getValue();
				var selected = [];
				function checkIsInParent(obj){
					if(obj.data.id && obj.data.id == pId) return true;
					if(obj.parentNode)
						if(checkIsInParent(obj.parentNode)) return true;
					return false;
				}
				if(objectExplorer.store && objectExplorer.store.tree && objectExplorer.store.tree.nodeHash){
					for(var u in objectExplorer.store.tree.nodeHash){
						if(u && objectExplorer.store.tree.nodeHash[u] && objectExplorer.store.tree.nodeHash[u].data
								&& checkIsInParent(objectExplorer.store.tree.nodeHash[u])){
							if(u == pId){
								selected.unshift({id:u, name:pName});
							}else{
								selected.push({id:u, name:objectExplorer.store.tree.nodeHash[u].data.name});
							}
						}
					}
				}else{
					return;
				}
				if(!selected.length) return;
				var id = [];
				var name = [];
				for(var q=0; q<selected.length; q++){
					id.push(selected[q].id);
					if(q<5) name.push(selected[q].name);
				}
				if(selected.length > 5) name.push("etc");
				if(!id || !name) return;
				id = id.join(",");
				name = name.join("_");
				
				id = encodeURI(id);
				window.open(config.contextPath + "/equipmentXMLServlet?action=COMMAND_EXPORT&id="+id+"&name="+name);
			}
		});
		
		var saveSvgBtn = Ext.create("Ext.Button",{
			id : 'saveSvgBtn',
			text : 'Export Svg',
			iconCls : 'icon-next',
			handler : function(){
				var name = Ext.getCmp("equipmentRelationName").getValue();
				var svg = $("#"+_ns.id);
				var str = svg.html();
				var svg = str.substr(str.indexOf("<svg"),str.indexOf("</svg>"));
				window.open(config.contextPath+"/equipmentXMLServlet?action=COMMAND_SAVESVG&name="+name+"&svg="+escape(svg));
			}
		});
		
		var changeIconBtn = Ext.create("Ext.Button", {
			id : 'changeIconBtnId',
			text : 'Change Icon',
			icon : getEquipmentIcon("", "unSel"),
			handler : function(){
				var f = _ns.rootNode.iconFlagShow || _ns.rootNode.iconFlag || "";
				if(Ext.getCmp("changeIconWinId")) Ext.getCmp("changeIconWinId").remove();
				var changeOkBtn = Ext.create("Ext.button.Button", {
					text : 'OK',
					width : 90,
					margin : '10 0 0 20',
					handler : function(){
						var f = "";
						if(Ext.getCmp("changeIconContainerId") && Ext.getCmp("changeIconContainerId").items.items){
							var tempmodel = Ext.getCmp("changeIconContainerId").items.items;
							for(var i=0; i<tempmodel.length; i++){
								if(tempmodel[i].value){
									f = tempmodel[i].myValueFlag;
									break;
								}
							}
						}
						_ns.rootNode.iconFlag = f;
						_ns.rootNode.icon = getEquipmentIcon(f, "root");
						d3.selectAll('.node_container').selectAll("image")
							.attr('xlink:href', function(d){ return d.icon ? d.icon : getEquipmentIcon(d.iconFlagShow || d.iconFlag, "unSel"); })
						changeIconBtn.setIcon(getEquipmentIcon(f, "unSel"));
						Ext.getCmp("changeIconWinId").close();
					}
				});
				var changeUploadBtn = Ext.create("Ext.button.Button", {
					text : 'Upload icon',
					width : 90,
					margin : '10 0 0 60',
					listeners : {
						'afterrender' : changeUploadBtnIconSize
					},
					handler : function(){
						if(Ext.getCmp("changeIconUploadWinId")) Ext.getCmp("changeIconUploadWinId").close();
						var win = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
							id : 'changeIconUploadWinId',
							title : 'Upload equipment icons',
		            		layout: 'fit',
            		        width: 500,
            		        height: 300,
            		        modal: true,
            		        closeAction: 'destroy',
            		        items: {
            		        	xtype : 'form',
            		            frame: true,
            		            defaults: {
            		            	anchor: '100%',
            		                allowBlank: false,
            		                margin : '5 5 0 10',
            		                msgTarget: 'side',
            		                labelWidth: 100
            		            },
            		            items: [{
            		            	id 		   : 'changeIconUploadNameId',
	        						xtype      : 'textfield',
	        						emptyText  : 'Please input icons\' name!',
	        						fieldLabel : 'Name',
	        						maxLength  : UiProperties.nameMaxLength
            		            },{
            		            	xtype: 'filefield',
	        		                id: 'form-file1',
	        		                emptyText: 'Select an icon',
	        		                fieldLabel: 'root icon',
	        		                name: 'root',
	        		                buttonText: '',
	        		                buttonConfig: {
	        		                   iconCls: 'upload-icon'
	        		                },
	        		                vtype: 'filePngIcon'
            		            },{
            		            	xtype: 'filefield',
	        		                id: 'form-file2',
	        		                emptyText: 'Select an icon',
	        		                fieldLabel: 'unselected icon',
	        		                name: 'unSel',
	        		                buttonText: '',
	        		                buttonConfig: {
	        		                   iconCls: 'upload-icon'
	        		                },
	        		                vtype: 'filePngIcon'
            		            },{
            		            	xtype: 'filefield',
            		                id: 'form-file3',
            		                emptyText: 'Select an icon',
            		                fieldLabel: 'selected icon',
            		                name: 'select',
            		                buttonText: '',
            		                buttonConfig: {
            		                   iconCls: 'upload-icon'
            		                },
            		                vtype: 'filePngIcon'
            		            }],
            		            buttons: [{
            		            	text: 'Upload',
            		                handler: function(){
            		                	var form = this.up('form').getForm();
            		                	var iconName = Ext.getCmp("changeIconUploadNameId").getValue();
            		                    if(form.isValid() && iconName){
    		                            	var con = Ext.getCmp("changeIconContainerId");
    		                            	if(con && con.items && con.items.items && con.items.items.length){
    		                            		var conI = con.items.items;
    		                            		for(var i=0; i<conI.length; i++){
    		                            			if(conI[i].myValueFlag == iconName){
    		                            				Ext.getCmp("changeIconUploadNameId").setValue("");
    		                            				return;
    		                            			}
    		                            		}
    		                            	}
            		                        form.submit({
            		                        	url: 'upload',
            		                            params: {
            		                            	uploadSource : "equipmentIcon",
            		                            	iconName : iconName
            		                            },
            		                            waitMsg: 'Uploading your icons...',
            		                            success: function(fp, o) {
            		                            	Notification.showNotification('Upload icons success!');
	            		                            if(Ext.getCmp("changeIconContainerId")){
	            		                            	con.add(getRadio(iconName));
	            		                            }
            		                            	win.close();
            		                            },
            		                            failure: function(form, action){
            		                            	Ext.Msg.alert('Failure', 'Upload icon failed');
            		                            }
            		                        });
            		                    }
            		                }
            		            },{
            		            	text: 'Cancel',
            		                handler: function() {
            		                	win.close();
            		                }
            		            }]
            		        }
		            	}).show();
					}
				})
				var tmpItems = [];
				function getBoxLabel(fu){
					var str = "style='width:16px;height:16px;'";
					var re = "&nbsp;&nbsp;<label style='width:150;'>" + (fu ? fu : "default icon") + ":</label>";
					re += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='when equipment is the root' " + str + " src='" + getEquipmentIcon(fu, "root") + "' />";
					re += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='when equipment is not the root' " + str + " src='" + getEquipmentIcon(fu, "unSel") + "' />";
					re += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img title='when equipment is selected' " + str + " src='" + getEquipmentIcon(fu, "select") + "' />";
					return re;
				}
				function getRadio(fu){
					return Ext.create("Ext.form.Radio", {
						height : 30,
						boxLabel : getBoxLabel(fu),
						width : 300,
						name : 'changeIconRadioName',
						value : fu,
						myValueFlag : fu,
						margin : '0 0 0 30',
						checked : fu == f
					})
				}
				for(var u=0; u<equipIconF.length; u++){
					tmpItems.push(getRadio(equipIconF[u]))
				}
				var changeIconWinResizeFlag = 0;
				if(Ext.getCmp("changeIconWinId")) Ext.getCmp("changeIconWinId").close();
				Ext.create("DigiCompass.Web.app.AutosizeWindow", {
					id: "changeIconWinId",
					width: 400,
					height: 300,
					title : "Change Equipment Icon",
					modal : true,
					bodyStyle : {
						background : 'white'
					},
					listeners : {
						resize : function(){
							var f = ++changeIconWinResizeFlag;
							setTimeout(function(){
								if(Ext.getCmp("changeIconContainerId") && Ext.getCmp("changeIconWinId") && f == changeIconWinResizeFlag){
									Ext.getCmp("changeIconContainerId").setHeight(Ext.getCmp("changeIconWinId").getHeight() - 95);
								}
							}, 170)
						}
					},
					items : [{
						id: 'changeIconContainerId',
						xtype: 'container',
		                border:false,
		                margin: '10px',
		                autoScroll : true,
		                height : 205,
		                items: tmpItems
					}, changeUploadBtn,changeOkBtn]
				}).show();
				caller.callService({
					MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
					COMMAND : 'COMMAND_QUERY_ICON_LIST'
				},function(message){
					var data = Ext.JSON.decode(message.BUSINESS_DATA);
					if(data && data.length && Ext.getCmp("changeIconContainerId")){
						var contan = Ext.getCmp("changeIconContainerId");
						for(var a=0; a<data.length; a++){
							var da = data[a];
							if(da && equipIconF.indexOf(da) == -1){
								contan.add(getRadio(da));
							}
						}
					}
				});
			}
		})
		
		
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'equipmentRelationAdd',
			defaultType : 'textfield',
			title: UiFunction.getTitle('Equipment'),
			border : false,
			width : '100%',
			frame : false,
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 140	
			},
			tbar: [saveBtn,exportBtn,saveSvgBtn, changeIconBtn],
			items : [{
						id : 'equipmentRelationId',
						xtype : 'hidden',
						name : 'id'
					},{
						id : 'parentTemplateId',
						xtype : 'hidden',
						name : 'parentId'
					},{
						id 		   : 'equipmentRelationName',
						margin 	   : '10px 5px 10px 10px',
						allowBlank : false,
						emptyText  : 'Please input data!',
						fieldLabel : 'Name',
						maxLength  : UiProperties.nameMaxLength,
						width	   : 500,
						msgTarget  : 'side',
						name 	   : 'name',
						listeners : {
							change : function(){
								if(!_ns.rootNode)return ;
								_ns.rootNode.text = this.getValue();
								_ns.redraw();
							}
						}
					},{
						id 		   : 'equipmentRelationDes',
						margin 	   : '10px 5px 10px 10px',
						emptyText  : 'Please input data!',
						fieldLabel : 'Description',
						maxLength  : UiProperties.descMaxLength,
						width 	   : 500,
						msgTarget  : 'side',
						name 	   : 'description'
					},{
		                xtype: 'container',
		                border:false,
		                margin: '10px 5px 10px 10px',
		                layout: 'hbox',
		                items: [{
		                	id: 'parentTemplateName',
		                	xtype: 'textfield',
		                    fieldLabel: 'Parent Equipment',
		                    name: 'parentName',
		    	            readOnly: true,
		    	            width: 500
		                },{
							xtype : 'button',
							text : 'Select',
							id : 'btnSelectParent',
							margin : '0px 0px 0px 10px',
							handler : function(){
								derivedFormWin(null,null,function(selected){
									 var thisNode = _ns.rootNode;
									 var isValidNode = function(node){
										if(node.referenceId === selected.referenceId)return false;
										if(node.data.children){
											for(var child in node.data.children){
												if(!isValidNode(node.data.children[child]))return false;
											}
										}
										return true;
									 };
									 if(!isValidNode(_ns.rootNode)){
										Notification.showNotification('Loop Reference!');
										return ;
									 };
									 _ns.clearSvg();
									selectParent(selected);
								})
							}
						}]
					}]
		});
		
		
		var container = createHasNoParentContainer();
		
		var centerContainer = Ext.create('Ext.container.Container', {
			id: 'centerContainerId',
			flex: 5,
			width: '100%',
			layout: 'border',
			margin :'5px 5px 5px 5px',
			items: [container]
		});
		
		var panel = Ext.create('Ext.panel.Panel', {
			layout: 'vbox',
			items: [formPanel,centerContainer]
		});
		return panel;
	}
	
	var getProperties = function(properties){
		
		var isEmpty = function(str){
			return str === '' || str === undefined;
		};
	
		if(!properties)return ;
		var r = [];
		if(properties.length){
				for(var i in properties){
					var p = properties[i];
					if(p.length)continue;
					if(!isEmpty(p.name)
					    && !isEmpty(p.type)
						&& !isEmpty(p.name)){
						if(p.list==="")p.list = [];
						r.push(p);
					}
			}
		}
		return r;
		  
	}

	
	var createHasNoParentContainer = function(){

		var newParentContainer = Ext.getCmp('newParentContainerId');
		if (newParentContainer) {
			return newParentContainer;
		}
		var store = Ext.create('Ext.data.TreeStore', {
	    	fields: [ 'name', 'level', 'property','typeId' ],
	        root: {},
	        folderSort: true
	    });
		
		var equipmentType = Ext.create('Ext.tree.Panel', {
	        title : 'Existing Equipment',
	        id : 'equipmentTypeTree',
	        //margin : '0px 0px 0px 5px',
	        width: 300,
	        autoScroll: true,
	        region: 'west',
	        collapsible: true,
	        viewConfig: {
	            plugins: {
	                ddGroup: 'dragDropGroup',
	                ptype: 'gridviewdragdrop',
	                enableDrop: false
	            }
	        },
	        rootVisible: false,
	        store: store,
	        columns: [{
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: 'Name',
	            flex: 2,
	            sortable: false,
	            dataIndex: 'name'
	        }],
			listeners : {
	            itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
	            	//focusedEquipment = record;
	            	DigiCompass.Web.app.financialCategory.showActionImg(record, item, true , true);
	            },
	            itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
	            	//focusedEquipment = null;
	            	DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
	            },
	            itemcollapse : function(){
	            	fixTreeSelection(equipmentType.getSelectionModel())
	            }
			}
	    });

		caller.callService({
			MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
			COMMAND : 'COMMAND_QUERY_TREE',
			BUSINESS_DATA : null,
			parentNodeId : equipmentType.getStore().getRootNode().id
		},function(data){
			loadEquipmentTemplateTree('equipmentTypeTree',data);
		});
		
		var toolBar = Ext.create('DigiCompass.Web.app.equipmentTemplateV2.Toolbar',_ns);
		var equipmentRelationSvg = Ext.create('Ext.panel.Panel', {
			id: _ns.id,
			dockedItems : toolBar,
			title: 'Equipment',
			//margin : '0px 0px 0px 5px',
			width: '100%',
			height : '100%',
			region: 'center',
			listeners : {
				resize : function(obj, width, height, oldWidth, oldHeight, eOpts ){
					_ns.setSize(width,height);
				}
			}
		});
		
		var propertyStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'defaultValue', 'id', 'optional', 'requirement', 'type', 'list', 'multiple', 'isLock', 'isParentLock', 'belong', 'isChildModify'],
		    data: [],
		    listeners:{
				update : function(store) {
		    		if(_properties && _properties.focuseNode && _properties.focuseNode.embedType == 'Reference'){
		    			return setFocusedFn(_properties.focuseNode);
		    		}
					ns.updateSelectProperty(store, ns);
				}
			}
		 });
		 
		var equipmentRelationProperties = Ext.create('Ext.grid.Panel', {
	    	id : 'equipmentRelationProperties',
			title : 'Equipment Relation Properties',
			margin : '0px 0px 0px 5px',
			region : 'east',
			selType : 'cellmodel',
			hidden : true,
			store: propertyStore,
			columns:[{
				header : 'Name',
				dataIndex : 'name',
				flex : 1
			},{
				header : 'Value',
				dataIndex : 'defaultValue',
				flex : 1
			}
			,{
			    xtype: 'checkcolumn',
				id: 'lockHeaderId',
				header: 'Lock',
				dataIndex: 'isLock',
				flex: 1,
				renderer: function(value, td, record, rowIndex, cIndex){
					if (record.raw.name === 'Capex' || record.raw.name === 'Opex') {
						return '';
					}
					
					var cssPrefix = Ext.baseCSSPrefix,
			            cls = [cssPrefix + 'grid-checkheader'];
			            
			        if(record.raw.isChildModify){
			        	return "Can\'t lock";
			        }
					
					if (record.raw.isParentLock) {
						//cls.push('self_define_checked');
						return "Locked";
					} else if (value) {
				        cls.push(cssPrefix + 'grid-checkheader-checked');
					}
					return '<div class="' + cls.join(' ') + '">&#160;</div>';
			    }
			}
			],
			listeners : {
				cellclick : function(grid, cellElement, columnNum, record,
					rowElement, rowNum, e) {
					var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
					if (dataIndex !== 'defaultValue') {
						return;
					}
					
					if(dataIndex === 'defaultValue' && record.raw.belong === 'System'){
						//TODO 閿涳拷
						ns.inputNumberWindow(record.raw.name, record.data.defaultValue, function(v){
							record.data['defaultValue'] = v;
							record.commit();
						});
						return;
					}
					
					var handlerType = Ext.getCmp('equipmentRelationProperties')[ns.HANDLER_TYPE];
					if (handlerType === ns.HANDLER_TYPE_NODE) {  //TODO 閿涳拷
						ns.editPropertyWin(grid, ns.propertyWinHandler1);
					} else if(handlerType === ns.HANDLER_TYPE_LINK) { //TODO 閿涳拷
						ns.editLinkWin(grid, ns.linkWinHandler1, null, null, ns);
					}
					
				},
				itemmouseenter: function(view, record, item, rowIndex, e, eOpts ) {
					//console.log('enter');
				},
	            itemmouseleave: function(view, record, item, rowIndex, e, eOpts ) {
	            	//console.log('leave');
	            }
			}
		});
		
		var capexStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'amount', 'id', 'capex', 'opex', 'cost'],
		    data: []
		});

		var newParentContainer = Ext.create('Ext.container.Container', {
			id: 'newParentContainerId',
			flex: 5,
			width: '100%',
			region: 'center',
			layout: 'border',
			//margin :'5px 5px 5px 5px',
			defaults : {
				split : true
			},
			items:[equipmentType, equipmentRelationSvg, _properties.grid]
		});
		return newParentContainer;
	}
	
	/**
	 * 鐟佸懓娴囬崣顖烇拷equipmenttemplate 閺嶏拷
	 */
	var loadEquipmentTemplateTree = function(id, data, selNodeMapQty, isChangeEquipmentV3){
		var equipmentTypeTree = Ext.getCmp(id);
		var _data = Ext.decode(data.BUSINESS_DATA);
		removeDeletedEquipment(_data.list);
		if(selNodeMapQty){
			if(isChangeEquipmentV3){
				_setTreeNodeValueForV3(_data.list, selNodeMapQty);
			}else{
				_setTreeNodeValue(_data.list, selNodeMapQty);
			}
		}
		if(equipmentTypeTree){
			if(equipmentTypeTree.getRootNode()){
				equipmentTypeTree.getRootNode().cascadeBy(function(node){
					if(node.id === _data.parentNodeId){
						node.removeAll();
						if(_data.list && _data.list.length){
							node.appendChild(_data.list.reverse());
							if(_data.list.length == 1) node.expand(true);
						}
					}
				});
			}
			equipmentTypeTree.getStore().sort("name", "ASC");
		}
	};
	
	function _setTreeNodeValue(list, selNodeMapQty){
		if(list && list.length){
			for(var a=0; a<list.length; a++){
				if(selNodeMapQty[list[a].id]){
					list[a].checked = true;
					list[a].qty = selNodeMapQty[list[a].id] || 1;
				}else{
					list[a].checked = false;
					list[a].qty = 1;
				}
				if(list[a].children && list[a].children.length) _setTreeNodeValue(list[a].children, selNodeMapQty);
			}
		}
	}
	function _setTreeNodeValueForV3(list, selNodeMapQty){
		if(list && list.length){
			for(var a=0; a<list.length; a++){
				if(selNodeMapQty[list[a].id] && selNodeMapQty[list[a].id].length){
					list[a].qty = selNodeMapQty[list[a].id].length;
				}else{
					list[a].qty = 0;
				}
				if(list[a].children && list[a].children.length) _setTreeNodeValueForV3(list[a].children, selNodeMapQty);
			}
		}
	}
	
	//==================Properties====================
	
	var editPropertyWin = function(property, fn) {
		property[0].wid = "wid";
		var propertyWin = Ext.getCmp('propertyId');
		if (propertyWin) {
			return propertyWin;
		}
	
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			id: 'propertyId',
		    title: 'Properties',
		    width: 430,
		    height : 150,
		    layout: 'fit',
		    modal : true,
		    resizable: false,
		    items: {
				xtype: 'equipmentform',
				id: 'proForm',
				height: 60,
				buttonAlign: 'center',
				fieldDefaults: {
                    labelAlign: 'right'
                },
                property: property,
                listeners : {
                	buttoncallback:function(datas){
                		if (fn) {
                   			fn(datas);
                		}
                		win.close();
                	}
                }
		    },
		    listeners : {
		    	'beforeclose' : function(){
		    		
		    	}
		    }
		});
		win.show();
	}
	
	var propertiesGrid = function(){
		
		var EmptyProperty = ['','','','','',''];
		var TypeData = ['Regex','Date','Boolean','List','LAC_TAC', 'SAC', 'NodeId', 'CellId', 'Vcid'];
		// var TypeData = ['Regex','Boolean'];
		var FocusedNode = null;
		var Capex = 'Capex';
		var Opex = 'Opex';
		var FocusedPropertyRecord = null;
		var CellEditingFocusNode = null;

		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			listeners : {
				beforeedit: function (me, e) {
					var focused = Ext.getCmp('equipmentTypePropertyGrid').getSelectionModel().getSelection();
					var unEditable = focused[0].data.unEditable;
	    			return !unEditable;
	    		}
			}
		});
				
		var propertyStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['id','name','type','requirement','multiple','optional','list','value','unEditable','belong','locked','isParentLock', 'isChildModify'],
		    data: EmptyProperty,
		    listeners:{
				update:function(store, record, eventType, dataIndex){
		    		if(Ext.getCmp("changeEquipmentV3WinId") && dataIndex == "locked"){
		    			var w = Ext.getCmp("changeEquipmentV3WinId");
		    			if(w.couldnotChangeLocked){
			    			w.couldnotChangeLocked = false;
			    			record.set("locked", !record.data.locked);
			    			w.couldnotChangeLocked = true;
		    			}
		    			return;
		    		}
					var focus = FocusedNode;
					if(Ext.isEmpty(focus)){
						//Notification.showNotification('Please select a record!');
						return;
					}
					if(_properties && _properties.focuseNode && _properties.focuseNode.embedType == 'Reference'){
		    			return setFocusedFn(_properties.focuseNode);
		    		}
					clearAllEmptyRecordInStore(store);
					if(!_properties.grid.couldnotAddOrDel){
						store.insert(store.getCount(),{name : '', type : '', requirement: '', multiValue : '', optional : '', value :'' , belong : 'Self'  });
					}
				}
			}
		 });
		
		var getPropertiesTypeData = function(){
			var data = [];
			var typeData = TypeData;
			for(var i = 0 ; i < typeData.length ; i++){
				data.push({ id : typeData[i], 
				            name : typeData[i] });
			}
			return data;
		};

		var showPropertiesInputWindow = function(record,type,flag){
			var property = {
					type : type
					};
			if(record.data){
				property = record.data;
			}
			if(property.unEditable){
				return;
			}
			var focus = FocusedNode;
			if(Ext.isEmpty(focus)){
				Notification.showNotification('Please select a record!');
				return;
			}
			var propertyWin = Ext.create('Ext.window.Window',{
				width  : 430,
				modal : true,
				layout : 'fit',
				bodyStyle: {
					background: '#ffffff'
				},
				title  : 'Property',
				items  : [{
					xtype : 'equipmenttypeform',
					id 			: 'proForm',
					buttonAlign : 'center',
					fieldDefaults: {
	                    labelAlign: 'right'
	                },
	                property : property,
	                inputType : true,
	                listeners : {
	                	buttoncallback:function(datas){
	                		var record = FocusedPropertyRecord;
							
							record.data.value = datas.defaultValue;
	    					for(var key in datas){
	    						record.data[key] = datas[key];
	    					};
	    					record.commit();
	    					propertyWin.close();
	                	}
	                }
				}]
			});
			propertyWin.show();
		};
		
		var inputNumberWindow = function(name ,defaultValue, callback) {
			var formPanel = Ext.create('Ext.form.Panel', {
				id : 'equipmentTypeAdd',
				defaultType : 'textfield',
				border : false,
				width : '100%',
				frame : false,
				height : 'fit',
				bodyStyle : {
					background : "#ffffff"
				},
				fieldDefaults : {
					labelAlign : 'left',
					msgTarget : 'side',
					labelWidth : 70	
				},
				items : [{
							id 		   : 'defaultValueId',
							xtype      : 'numberfield',
							margin 	   : '10px 5px 10px 10px',
							allowBlank : true,
							emptyText  : 'Please input data!',
							fieldLabel : name,
							maxLength  : UiProperties.nameMaxLength,
							minValue   : 1,
							maxValue   : 10000000000,
							width	   : 300,
							msgTarget  : 'side',
							name 	   : 'value',
							value      : defaultValue
						}],
				buttons: [{
		            text: 'Ok',
		            handler: function() {
		            	var _temp = Ext.getCmp('defaultValueId');
		            	if (!_temp.isValid()) {
		            		Notification.showNotification('Invalid data!');
		        			return;
		            	}
		            	var defaultValue = _temp.getValue();
		            	if (callback) {
		            		callback(defaultValue);
		            	}
		                Ext.getCmp('defaultValueWinId').close();
		            }
		        }],
		        buttonAlign: 'center'
				});
			
			var propertyWin = Ext.create('Ext.window.Window',{
				id: 'defaultValueWinId',
				width  : 400,
				modal : true,
				layout : 'fit',
				title  : 'ValueInput',
				bodyStyle : {
					background : "#ffffff"
				},
				items  : [formPanel]
			});
			propertyWin.show();
		}
		
		var v = Ext.create("Ext.panel.Panel",{
			id : 'equipmentTypePropertyPanel',
			width : 500,
			item : [
			
			]
		});
		
		var capexProperties = {
	    	id : 'equipmentTypePropertyGrid',
			title : 'Properties',
			//margin : '0px 10px 0px 5px',
			region : 'east',
			width : 600,
			height : 'fit',
			xtype : 'grid',
			selType : 'cellmodel',
			plugins : [cellEditing],
			store: propertyStore,
			// tools:[{
				// type:'unpin',
				// tooltip: 'unpin',
				// // hidden:true,
				// handler: function(event, toolEl, panel){
					// var obj = Ext.getCmp("equipmentTypePropertyGrid");
					
					// Ext.create('Ext.window.Window',{	
									// x : event.x + 15,
									// y : event.y - 75,
									// items: myClone(obj)
					// }).show();
					// obj.collapse();
				// }
			// }],
			collapsible: true,
			columns:[{
				header : 'Name',
				dataIndex : 'name',
				align : "center",
				flex : 3,
				editor : {
					allowBlank : false,
					maxLength  : UiProperties.stringValueMaxLength
					//,listeners  : DigiCompass.Web.app.equipmentType.getListeners()
				}
			},{
				header : 'Type',
				dataIndex : 'type',
				flex : 3,
				align : "center",
				editor : {
					xtype : 'combo',
					allowBlank 	 : false,
					editable     : false,
					displayField : 'name',
					valueField	 : 'id',
					store : {
						fields : ['id','name'],
						data   :  getPropertiesTypeData()
					},
					maxLength  : UiProperties.stringValueMaxLength,
					
					listeners  : {
						change : function(combo, newValue, oldValue){
							var records = Ext.getCmp('equipmentTypePropertyGrid').getSelectionModel().getSelection();
							if(records && records[0] && records[0].data.isChildModify){
								return false;
							}
							showPropertiesInputWindow({}, newValue,false);
						}
						// ,beforeselect : function(combo, record, index, eOpts){
							// var data = capexProperties.getStore().data;
							// if(record.raw.belong === 'System')return false;
						// }
					}
				}
			},{
				header : 'Requirement',
				flex : 3,
				align : "center",
				dataIndex : 'requirement'
			},{
				header : 'Multiple',
				align : "center",
				dataIndex : 'multiple',
				flex : 3
			},{
				header : 'Required',
				dataIndex : 'optional',
				align : "center",
				flex : 3
			},{
				header : 'Value',
				dataIndex : 'value',
				align : "center",
				flex : 3
			},{
			    xtype: 'checkcolumn',
				header: 'Lock',
				dataIndex: 'locked',
				align : "center",
				flex: 2,
				renderer: function(value, td, record, rowIndex, cIndex){
					if (record.raw.name === Capex || record.raw.name === Opex) {
						return '';
					}
					
					var cssPrefix = Ext.baseCSSPrefix,
			            cls = [cssPrefix + 'grid-checkheader'];
					if(record.raw.isChildModify){
						return "Can\'t lock";
					}
					
					if (record.raw.isParentLock) {
						//cls.push('self_define_checked');
						return "Locked";
					} else if (value) {
				        cls.push(cssPrefix + 'grid-checkheader-checked');
					}
					cls.push('x-item-disabled');
					return '<div class="' + cls.join(' ') + '">&#160;</div>';
			    }
			},{
				flex : 1,
	            menuDisabled: true,
	            xtype: 'actioncolumn',
	            id: 'equipmentPropertyManiId',
	            header: '',
	            tooltip: 'delete',
	            align: 'center',
	            items: [{
	                icon: './styles/cmp/images/delete.png',  
	                scope: this,
	                getClass: function(value,meta,record,rowIx,colIx, store) {
	                    return 'x-hide-display';  //Hide the action icon
	                },
		            handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
		            	if(rowIndex == grid.getStore().getCount() - 1){
		            		return;
		            	}
		            	var store = grid.getStore();
		            	store.removeAt(rowIndex);
		            	var selecteds = Ext.getCmp('equipmentTypeTree').getSelectionModel().getSelection();
						CellEditingFocusNode =selecteds[0];
		            	store.fireEvent('update', store);
		            },
	                tooltip: 'delete'
	            }]
			}],
			listeners : {
				itemmouseenter: function( view, record, item, rowIndex, e, eOpts ) {
					if(record.data.belong === 'System' || record.data.belong === 'Parent' || _properties.grid.couldnotAddOrDel 
							|| (_properties && _properties.focuseNode && _properties.focuseNode.embedType == 'Reference')){
	            		return;
	            	}
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, true);
				}
				,itemmouseleave: function( view, record, item, rowIndex, e, eOpts ) {
					DigiCompass.Web.app.financialCategory.showActionImg(record, item, false);
				}
				,beforeedit : function(grid, record, item){
					if(_properties.grid.couldnotChangeProType && record.record.data.id && record.field == "type") return false;
					if(record.record.data.belong === 'System' || record.record.data.belong === 'Parent'){
						if(record.field == "name" || record.field == "type")return false;
					}
					if(record.field == "type" && record.record.data.isChildModify) return false;
					if(_properties.focuseNode.embedType === 'Reference')return false;  //瀵洜鏁ょ猾璇茬�娑撳秷鍏樻穱顔芥暭鐏炵偞锟�
					if(Ext.getCmp("changeEquipmentV3WinId") && !record.field) return false;
					return true;
				}
				,cellclick : function(grid, cellElement, columnNum, record, rowElement, rowNum, e) {
					FocusedPropertyRecord = record;
					if(_properties.focuseNode){
						if(_properties.focuseNode.embedType === 'Reference')return ;  //瀵洜鏁ょ猾璇茬�娑撳秷鍏樻穱顔芥暭鐏炵偞锟�
						if(!_properties.focuseNode.isTopRoot && !_properties.focuseNode.isTemplateRoot)return ;  //瀵洜鏁ょ猾璇茬�閻ㄥ嫯濡悙閫涚瑝閼虫垝鎱ㄩ弨鐟扮潣閹嶇礄閺冾枍绗夐弰鐥秓proot 娑旂喍绗夐弰锟絫emplateRoot 鐏忚鲸妲�瀵洜鏁ょ猾璇茬�閻ㄥ嫯濡悙鐧哥礆
					}
					
					//if(record.raw.locked)return ;
					var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
					if(dataIndex == 'name' || dataIndex == 'type' || Ext.isEmpty(record.data.type) || dataIndex === 'locked'){
						return;
					}
					if(record.raw.belong === 'System' && dataIndex){
						inputNumberWindow(record.raw.name, record.data.value, function(v){
							record.data['value'] = v;
							record.commit();
						});
						return ;
					}
					if(record.raw.belong === 'Parent' || (_properties.grid.couldnotChangeProType && record.raw.id && dataIndex)
							|| (record.raw.isChildModify && record.raw.type == "List" && dataIndex && record.raw.id)){
						if(record.raw.isParentLock) return ;
						editPropertyWin([record.data], function(v){
							record.data['value'] = v[0].defaultValue;;
							record.commit();
						});
						return ;
					}
					if(dataIndex) showPropertiesInputWindow(record, record.data.type,true);
				}
				,containerclick : function(g){
					
				}
				,edit : function(editor, e){
					if(e.colIdx == 0){
						var tmpG = Ext.getCmp("equipmentTypePropertyGrid");
						if(!tmpG) return;
						var tmpL = tmpG.getStore().data.items;
						for(var a=0; a<tmpL.length; a++){
							if(e.rowIdx != a && e.value == tmpL[a].data.name){
								e.record.data.name = e.originalValue;
								if(!e.originalValue && !tmpL[e.rowIdx].data.type && !tmpL[e.rowIdx].data.locked && !tmpL[e.rowIdx].data.value){
									tmpG.getStore().removeAt(e.rowIdx)
								}
								break;
							}
						}
						e.record.commit();
					}
				}
				,render : function(g){
					if(_properties.grid.couldnotAddOrDel) clearAllEmptyRecordInStore(g.getStore())
					Ext.getCmp('equipmentPropertyManiId').setVisible(!_properties.grid.couldnotAddOrDel)
				}
			}
		};
		
		var createEmptyProperty = function(name, defaultValue) {
			var p = {};
			p.name = name;
			p.prototype = '';
			p.value = defaultValue;
			p.list = '';
			p.multiple = '';
			p.optional = 'YES';
			p.type = 'Regex';
			p.unEditable = true;
			p.requirement = '';
			p.belong = "System";
			return p;
		};
		
		var setCapexAndOpex = function (gridData, isInit) {
			var hasExists = false;
			for (var i=0, len=gridData.length; i<len; i++) {
				var tempData = gridData[i];
				if (tempData.name === Capex) {
					tempData = createEmptyProperty(Capex,empData.value);
					hasExists = true;
				} else if (tempData.name === Opex) {
					tempData = createEmptyProperty(Opex, tempData.value);
					hasExists = true;
				}
			}
			if (!hasExists || isInit) {
				var capex = createEmptyProperty(Capex, '');
				var opex = createEmptyProperty(Opex, '');
				gridData.splice(gridData.length-1, 0, capex, opex);
			}
		};
		
		var checkedStoreEmptyRecord = function(list){
			var flag = false;
			for(var i = 0 ; i < list.length ; i++){
				var data = list[i];
				flag = false;
				for(var key in data){
					if(!Ext.isEmpty(data[key]) && !(key == 'belong' && data[key] == "Self")){
						flag = true;
						break;
					}
				}
				if(!flag){
					break;
				}
			}
			return flag;
		}
		
		var setFocusedFn = function(node, isInitCapex){
			if(node==null)return ;
			FocusedNode = node;
			this.focuseNode = node;
			var gridData = [EmptyProperty];
			if(node.properties){
				gridData = node.properties;
			}else if(node.data.properties){
				gridData = node.data.properties;
			}else{
				setCapexAndOpex(gridData, isInitCapex);
			}
			if(checkedStoreEmptyRecord(gridData)){
				gridData.push(EmptyProperty);
			}
			var tmpG = Ext.getCmp('equipmentTypePropertyGrid');
			if(tmpG){
				tmpG.focus();
				tmpG.site = node.site;
				tmpG.getStore().loadData(gridData);
				if(_properties.grid.couldnotAddOrDel) clearAllEmptyRecordInStore(tmpG.getStore())
			}
		};
		
		var getDataFn = function(){
			var store = Ext.getCmp('equipmentTypePropertyGrid').getStore();
			var data = [];
			store.each(function(record){
				record.getData().belong = record.getData().belong === '' ? 'Self' : record.getData().belong;
				data.push(record.getData());
			});
			return data;
		};
		
		return {
			//====field
			grid : capexProperties,
			focuseNode : null,
			//===method
			setFocused : setFocusedFn,
			getData : getDataFn
		}
	};

	//==================d3js======
	var setDropTarget = function(id,_ns){
		var dropTargetEl =  Ext.get(id);
	    Ext.create('Ext.dd.DropTarget', dropTargetEl, {
	        ddGroup: 'dragDropGroup',
	        notifyEnter: function(ddSource, e, data) {
	        },
	        notifyDrop  : function(ddSource, e, data){
				var selectedRecord = ddSource.dragData.records[0];   
				var window = Ext.create('Ext.window.Window', {
							x : e.getXY()[0],
							y : e.getXY()[1],
							modal : true,
							items: [{
								xtype : 'button',
								text : 'Copy',
								flex : 1,
								width : 75,
								margin: '5px 3px 5px 3px',
								handler : function(){
									_ns.dropNode(selectedRecord.raw,false);
									window.close();
								}
							},{
								flex : 1,
								xtype : 'button',
								text : 'Reference',
								width : 75,
								margin: '5px 3px 5px 3px',
								handler : function(){
									_ns.dropNode(selectedRecord.raw,true);
									window.close();
								}
							}]
						}).show();
	            return true;
	        }
	    });
	};
	
	//==============open window
	var derivedFormWin = function(parentId,isCatlog,finishCallback, isChange) {
		
		var FocusedNode = null;
		var FocusedNodeMap = {};
		var svgDesktop = Ext.create("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop","derivedFormSvgDiv",null,false);
		var deFormWin = Ext.getCmp('derivedFormWinId'); 
		
		if (!deFormWin){
			var _fields = [ 'currentId', 'name', 'property'];
		    var _cms = [{
	            xtype: 'treecolumn', 
	            text: 'Name',
	            flex: 3,
	            sortable: true,
	            dataIndex: 'name'
	        }];
		    if(isChange){
		    	_fields = _fields.concat(['ckecked', 'qty']);
		    	_cms.push({
					sortable : false,
					flex : 1,
					text : 'Qty',
					dataIndex : 'qty',
					editor : {
						xtype : 'numberfield',
						minValue : 1
					},
					renderer : function(v, re, record){
						return record.data.checked ? (v || "") : "";
					}
				})
		    }
		    if(isCatlog){
		    	_fields = _fields.concat(['description']);
		    	_cms.push({
		    		sortable: false,
		    		flex : 3,
		    		text : 'Description',
		    		dataIndex : 'description'
		    	})
		    }
			var deriedFormStore = Ext.create('Ext.data.TreeStore', {
		    	fields: _fields,
		        root: {},
		        folderSort: true
		    });
			var deriedFormPanel = Ext.create('Ext.tree.Panel', {
		        id : 'deriedFormPanelId',
		        width: 200,
		        height: 500,
		        autoScroll: true,
		        rootVisible: false,
				plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
		        })],
		        store: deriedFormStore,
		        columns: _cms,
		        listeners: {
		        	itemclick : function(current, record, item, index, e, eOpts) {
						
		        	}
		        	,cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
		        		var _tmpId = record.raw.id;
		        		caller.callService({
							MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
							COMMAND : 'COMMAND_QUERY_INFO',
							BUSINESS_DATA : _tmpId
						},function(message){
							var data = Ext.JSON.decode(message.BUSINESS_DATA);
							if(!FocusedNodeMap[_tmpId]){
								FocusedNodeMap[_tmpId] = {data: data, qty : 0};
							}
							FocusedNode = data;
							svgDesktop.clearSvg();
							svgDesktop.createInitRelation(data);
						});
		        	}
		        	,beforeedit : function(grid, obj, item){
						if(obj.field == "qty" && !obj.record.data.checked){
							return false;
						}
					}
					,checkchange : function(){
						try{
							fixTreeSelection(deriedFormPanel.getSelectionModel())
						}catch(e){}
					}
					,itemcollapse : function(){
						try{
							fixTreeSelection(deriedFormPanel.getSelectionModel())
						}catch(e){}
					}
		        }
		    });
			
						
			var derivedFormSvg = Ext.create('Ext.panel.Panel', {
				id: svgDesktop.id,
				margin : '0px 0px 0px 5px',
				width: 600,
				height: 500,
				listeners : {
					resize : function(obj, width, height, oldWidth, oldHeight, eOpts){
						var f = ++deFormWinResizeFlag;
						setTimeout(function(){
							if(f == deFormWinResizeFlag){
								svgDesktop.initializeDefaultSvg(width,height);
								Ext.getCmp("deriedFormPanelId").setHeight(height);
								if(FocusedNode && FocusedNode.id){
									caller.callService({
										MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
										COMMAND : 'COMMAND_QUERY_INFO',
										BUSINESS_DATA : FocusedNode.id
									},function(message){
										var data = Ext.JSON.decode(message.BUSINESS_DATA);
										if(!FocusedNodeMap[FocusedNode.id]){
											FocusedNodeMap[FocusedNode.id] = {data: data, qty : 0};
										}
										FocusedNode = data;
										svgDesktop.clearSvg();
										svgDesktop.createInitRelation(data);
									});
								}
							}
						},170)
					}
				}
			});
			
			var okBtn = Ext.create('Ext.button.Button', {
				text: 'Finish',
			    handler: function(){
			    	if (finishCallback) {
			    		if(isChange && deriedFormStore.tree.nodeHash){
			    			var tmpList = [];
							var ob = deriedFormStore.tree.nodeHash;
							for(var j in ob){
								if(!ob[j] || !ob[j].data || typeof j != "string") continue;
								var dd = ob[j].data;
								if(dd.checked && FocusedNodeMap[dd.id]){
									FocusedNodeMap[dd.id].qty = dd.qty;
									tmpList.push(FocusedNodeMap[dd.id]);
								}
							}
							if(tmpList.length) finishCallback(tmpList);
			    		}else if(!isChange && FocusedNode){
			    			finishCallback(FocusedNode);
			    		}
			    	}
					deFormWin.close();
			    }
			});
			
			deFormWin = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
				id: 'derivedFormWinId',
				title: 'Equipment',
				width: 827,
				height: 569,
				minWidth : 400,
				minHeight: 200,
				modal : true,
				tbar: [okBtn],
				items: [{
	                xtype: 'container',
	                border:false,
	                margin: '5px 5px 5px 5px',
	                layout: 'hbox',
	                items: [deriedFormPanel, derivedFormSvg]
				}],
				listeners: {
					afterlayout : function(){
						svgDesktop.initializeDefaultSvg(600,500);
					},
					resize : function(obj, width, height, oldWidth, oldHeight, eOpts){
						derivedFormSvg.setSize(width-230,height-70);
					}
				}
			});
			caller.callService({
				MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
				COMMAND : 'COMMAND_QUERY_TREE',
				BUSINESS_DATA : isChange ? ("p__" + parentId) : parentId,
				KEY : 'derivedFormWin',
				parentNodeId : deriedFormPanel.getStore().getRootNode().id
			},function(data){
				loadEquipmentTemplateTree('deriedFormPanelId',data, isChange ? {} : null);
			})
		}
		deFormWin.show();
	}
	
	var changeTheEquipment = function(finishCallback, parentId, selectedId, multiSelObj){
		var FocusedNode = null;
		var svgDesktop = Ext.create("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop","changeEquipmentSvgDiv",_properties,false);
		var changeEquipmentWin = Ext.getCmp('changeEquipmentWinId');

		var isMultiSel = false;
		var selNodeMapQty = null;
		if(multiSelObj){
			isMultiSel = true;
			selNodeMapQty = {};
			if(multiSelObj.length){
				for(var v=0; v<multiSelObj.length; v++){
					selNodeMapQty[multiSelObj[v].id] = multiSelObj[v].qty;
				}
			}
		}
		
		if (!changeEquipmentWin){
			var fieldsTmp = ['currentId', 'name', 'property'];
			var _changequipmentTreeCms = [];
			_changequipmentTreeCms.push({
		            xtype: 'treecolumn', 
		            text: 'Name',
		            flex: 3,
		            sortable: false,
		            dataIndex: 'name'
		        });
			if(isMultiSel){
				fieldsTmp = fieldsTmp.concat(['checked', 'qty'])
				_changequipmentTreeCms.push({
					sortable : false,
					flex : 1,
					text : 'Qty',
					dataIndex : 'qty',
					editor : {
						xtype : 'numberfield',
						minValue : 1
					},
					renderer : function(v, re, record){
						return record.data.checked ? (v || "") : "";
					}
				});
			}
			var changeEquipmentStore = Ext.create('Ext.data.TreeStore', {
		    	fields: fieldsTmp,
		        root: {},
		        folderSort: true
		    });
			var changeEquipmentPanel = Ext.create('Ext.tree.Panel', {
		        id : 'changeEquipmentPanelId',
		        width: isMultiSel ? 280 : 200,
		        height: 500,
		        autoScroll: true,
		        rootVisible: false,
		        plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
		        })],
		        store: changeEquipmentStore,
		        columns: _changequipmentTreeCms,
		        listeners: {
		        	itemclick : function(current, record, item, index, e, eOpts) {
		        		//if(!e.target.id) changeEquipmentPanelItemClick(record.raw.id);
		        	}
		        	,cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
		        		changeEquipmentPanelItemClick(record.raw.id);
		        	}
		        	,render : function(){
		        		var tmpG = Ext.getCmp('equipmentTypePropertyGrid');
		    			if(tmpG) tmpG.getStore().loadData([]);
		        	}
					,beforeedit : function(grid, obj, item){
						if(obj.field == "qty" && !obj.record.data.checked){
							return false;
						}
					}
					,checkchange : function(){
						try{
							fixTreeSelection(changeEquipmentPanel.getSelectionModel())
						}catch(e){}
					}
					,itemcollapse : function(){
						try{
							fixTreeSelection(changeEquipmentPanel.getSelectionModel())
						}catch(e){}
					}
		        }
		    });
		    function changeEquipmentPanelItemClick(id){
		    	caller.callService({
					MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
					COMMAND : 'COMMAND_QUERY_INFO',
					BUSINESS_DATA :  id
				},function(message){
					var data = Ext.JSON.decode(message.BUSINESS_DATA);
					FocusedNode = data;
					svgDesktop.clearSvg();
					svgDesktop.createInitRelation(data);
					try{
						_properties.setFocused(svgDesktop.rootNode)
					}catch(e){}
				});
		    }
			
		    var _changequipmentSvgWidth = isMultiSel ? 420 : 500;
			var changeEquipmentSvg = Ext.create('Ext.panel.Panel', {
				id: svgDesktop.id,
				margin : '0px 2px 0px 2px',
				width: _changequipmentSvgWidth,
				height: 500
			});
			
			var okBtn = Ext.create('Ext.button.Button', {
				text: 'Finish',
				//iconCls: 'icon-save',
			    handler: function(){
			    	if (finishCallback) {
			    		var tmp = false;
						if(isMultiSel && changeEquipmentStore.tree.nodeHash){
							var tmpList = [];
							var ob = changeEquipmentStore.tree.nodeHash;
							for(var j in ob){
								if(!ob[j] || !ob[j].data || typeof j != "string") continue;
								var dd = ob[j].data;
								if(dd.checked){
									tmpList.push({id : dd.id, name : dd.name, qty : dd.qty});
								}
							}
							finishCallback(null, tmpList);
							tmp = true;
						}else if(FocusedNode){
							finishCallback(FocusedNode.id, FocusedNode.name);
							tmp = true;
						}
						if(tmp){
				    		addChildWin = null;
				    		changeEquipmentWin.close();
				    		changeEquipmentWin = null;
						}
			    	}
			    }
			});
			
			var savBt = Ext.create('Ext.button.Button', {
				text: 'Save',
				iconCls: 'icon-save',
			    handler: function(){
			    	var formData = {
						MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
						COMMAND : 'COMMAND_SAVE',
						BUSINESS_DATA :  Ext.encode({
								id : FocusedNode.id,
								name : FocusedNode.name,
								description : FocusedNode.description,
								iconFlag : FocusedNode.iconFlag || "",
								parentId : FocusedNode.parentId,
								serialNumber : svgDesktop.rootNode.serialNumber,
								models : svgDesktop.getModels(),
								relations : svgDesktop.getRelations(),
								properties : getProperties(svgDesktop.rootNode.properties),
								publik : false
						})
					};
					caller.callService(formData,function(data){
						if(data.STATUS === "success"){
							Notification.showNotification('Save Equipment success!');
						}else{
							Notification.showNotification('Save Equipment failed!');
						}
					})
				}
			});
			
			
			var okButton = Ext.create('Ext.button.Button', {
				text : 'Ok',
				width : 100,
				margin : '20 10 0 170',
				handler:function(){
					if(!Ext.getCmp("equipmentRelationName_c"+forId).getValue()) return;
					var proper = getProperties(_properties.getData());
					var model = svgDesktop.getModels();
					_properties.focuseNode.properties = proper;
					var tmpPs = getProperties(svgDesktop.rootNode.properties);
					if(tmpPs && tmpPs.length){
						for(var n=0; n<tmpPs.length; n++){
							if(tmpPs[n].belong == "System") continue;
							tmpPs[n].belong = "Parent";
						}
					}
					if(model && model.length){
						for(var n=0; n<model.length; n++){
							if(model[n].isTopRoot){
								model[n].parentId = FocusedNode.id;
								model[n].properties = tmpPs;
								delete model[n].rootId;
								break;
							}
						}
					}
					var formData = {
						MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
						COMMAND : 'COMMAND_SAVE',
						BUSINESS_DATA :  Ext.encode({
								id : "",
								name : Ext.getCmp("equipmentRelationName_c"+forId).getValue(),
								description : Ext.getCmp("equipmentRelationDes_c"+forId).getValue(),
								iconFlag : svgDesktop.rootNode.iconFlag || "",
								parentId : FocusedNode.id,
								serialNumber : svgDesktop.rootNode.serialNumber,
								models : model,
								relations : svgDesktop.getRelations(),
								properties : tmpPs,
								publik : false
						})
					};
					caller.callService(formData,function(data){
						addChildWin.hide();
						Notification.showNotification("Save Equipment Successfully!");
						caller.callService({
							MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
							COMMAND : 'COMMAND_QUERY_TREE',
							BUSINESS_DATA : "p__" + parentId,
							KEY : 'changeEquipmentWin',
							parentNodeId : changeEquipmentPanel.getStore().getRootNode().id
						},function(data){
							loadEquipmentTemplateTree('changeEquipmentPanelId',data, isMultiSel ? selNodeMapQty : null);
						})
					})
				}
			})
			
			var forId = "";
			var addChildWin = null;
			var saveAsBt = Ext.create('Ext.button.Button', {
				text: 'Save As',
				iconCls: 'icon-next',
			    handler: function(){
					if(!FocusedNode) return;
					if(addChildWin){
						Ext.getCmp("equipmentRelationName_c"+forId).setValue("");
						Ext.getCmp("equipmentRelationDes_c"+forId).setValue("");
						Ext.getCmp("parentTemplateName"+forId).setValue(FocusedNode.name);
						addChildWin.show();
						return;
					}
					forId = Math.random();
					addChildWin = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
						title : 'Equipment',
						width: 450,
						height: 230,
						resizable : false,
						modal : true,
						bodyStyle : {
							background : 'white'
						},
						items : [{
							xtype: 'container',
			                border:false,
			                margin: '20px 5px 10px 10px',
			                layout: 'hbox',
			                items: [{
			                	id: 'equipmentRelationName_c'+forId,
			                	xtype: 'textfield',
			                	allowBlank : false,
			                	emptyText  : 'Please input equipment name!',
			                    fieldLabel: 'Name',
								maxLength  : UiProperties.nameMaxLength,
			    	            width: 380,
								msgTarget  : 'side',
								labelAlign : 'left',
								labelWidth : 120
			                }]
						},{
							xtype: 'container',
			                border:false,
			                margin: '20px 5px 10px 10px',
			                layout: 'hbox',
			                items: [{
			                	id: 'equipmentRelationDes_c'+forId,
			                	xtype: 'textfield',
			                	emptyText  : 'Please input description!',
			                    fieldLabel: 'Description',
								maxLength  : UiProperties.descMaxLength,
			    	            width: 380,
								msgTarget  : 'side',
								labelAlign : 'left',
								labelWidth : 120
			                }]
						},{
			                xtype: 'container',
			                border:false,
			                margin: '20px 5px 10px 10px',
			                layout: 'hbox',
			                items: [{
			                	id: 'parentTemplateName'+forId,
			                	xtype: 'textfield',
			                    fieldLabel: 'Parent Equipment',
			                    name: 'parentName',
			    	            readOnly: true,
			    	            width: 380,
				                msgTarget  : 'side',
								labelAlign : 'left',
								labelWidth : 120
			                }]
						},okButton],
						listeners : {
							beforeclose : function(){
								addChildWin.hide();
								return false;
							}
						}
					})
					addChildWin.show();
					Ext.getCmp("parentTemplateName"+forId).setValue(FocusedNode.name);
			    }
			});
			
			_properties.grid.height = 500;
			_properties.grid.width = 330;
			_properties.grid.minWidth = 300;
			_properties.grid.collapsible = false;
			_properties.grid.couldnotAddOrDel = true;
			changeEquipmentWin = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
				id: 'changeEquipmentWinId',
				title: 'Equipment',
				width : 1057,
				height : 569,
				modal : true,
				tbar: [okBtn, savBt, saveAsBt],
				items: [{
	                xtype: 'container',
	                border:false,
	                margin: '5px 5px 5px 5px',
	                layout: 'hbox',
	                items: [changeEquipmentPanel, changeEquipmentSvg, _properties.grid]
				}],
				listeners: {
					afterlayout : function(){
						svgDesktop.initializeDefaultSvg(_changequipmentSvgWidth, 500);
					}
				}
			});
			caller.callService({
				MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
				COMMAND : 'COMMAND_QUERY_TREE',
				BUSINESS_DATA : "p__" + parentId,
				KEY : 'changeEquipmentWin',
				parentNodeId : changeEquipmentPanel.getStore().getRootNode().id
			},function(data){
				loadEquipmentTemplateTree('changeEquipmentPanelId',data, isMultiSel ? selNodeMapQty : null);
				setTimeout(function(){
					var equipmentTypeTree = Ext.getCmp('changeEquipmentPanelId');
					if(selectedId && equipmentTypeTree){
						var tmpNode = equipmentTypeTree.getStore().getNodeById(selectedId);
						if(tmpNode){
							var pp = tmpNode.parentNode;
							while(pp.parentNode && pp.parentNode.parentNode){
								pp = pp.parentNode;
							}
							if(pp) pp.expand(true);
							equipmentTypeTree.getSelectionModel().select(tmpNode, true, true);
							changeEquipmentPanelItemClick(selectedId);
						}
					}
				},300)
			})
		}
		changeEquipmentWin.show();
	}
	
//changeEquipmentV3-tab
	var changeEquipmentV3Fn = function(finishCallback, parentId, multiSelObj, isReadOnly, site){
		var FocusedNode = null;//equipment && instance
		var FocusedEquipment = null;//equipment
		var dontChange = true;
		var svgDesktop = Ext.create("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop","changeEquipmentV3SvgDiv",_properties,false);
		var changeEquipmentV3Win = Ext.getCmp('changeEquipmentV3WinId');
		
		if(false && multiSelObj){
			for(var g in multiSelObj){
				if(multiSelObj[g] && multiSelObj[g].length){
					for(var h=0; h<multiSelObj[g].length; h++){
						multiSelObj[g][h] = {id: multiSelObj[g][h]};
					}
				}
			}
		}

		if (!changeEquipmentV3Win){
			var fieldsTmp = ['currentId', 'name', 'property', 'qty', 'generalled'];
			var _changequipmentTreeCms = [];
			_changequipmentTreeCms.push({
	            xtype: 'treecolumn',
	            text: 'Name',
	            flex: 10,
	            sortable: false,
	            dataIndex: 'name',
	            renderer : function(v, g, record){
					if(record.data.qty){
						return "<b>" + v + "</b>";
					}
					return v;
				}
	        });
	        _changequipmentTreeCms.push({
				sortable : false,
				flex : 3,
				text : 'Generic',
				dataIndex : 'generalled',
				align : 'center',
				renderer : function(v, re, record){
					if(v) return "YES";
					return "NO";
				}
			});
			_changequipmentTreeCms.push({
				sortable : false,
				flex : 1,
				text : 'Qty',
				dataIndex : 'qty',
				align : 'center',
				renderer : function(v, re, record){
					if(!v || typeof v != "number" || v < 0) return 0;
					return v;
				}
			});
			var changeEquipmentStore = Ext.create('Ext.data.TreeStore', {
		    	fields: fieldsTmp,
		        root: {},
		        folderSort: true
		    });
			var isChangeEquipmentItemclick = false;
			var changeEquipmentV3Panel = Ext.create('Ext.tree.Panel', {
		        id : 'changeEquipmentV3PanelId',
		        width: 280,
		        height: 492,
		        autoScroll: true,
		        rootVisible: false,
		        plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
		        })],
		        store: changeEquipmentStore,
		        columns: _changequipmentTreeCms,
		        listeners: {
		        	itemclick : function(current, record, item, index, e, eOpts) {
		        		//if(!e.target.id) changeEquipmentV3PanelItemClick(record.raw.id);
		        	}
		        	,cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
		        		if(e.target.nodeName == "IMG") return;
		        		isChangeEquipmentItemclick = true;
		        		changeEquipmentV3PanelItemClick(record.raw.id);
		        		isChangeEquipmentItemclick = false;
		        	}
		        	,render : function(){
		        		var tmpG = Ext.getCmp('equipmentTypePropertyGrid');
		    			if(tmpG) tmpG.getStore().loadData([]);
		        	}
					,beforeedit : function(grid, obj, item){
						
					}
					,checkchange : function(){
						fixTreeSelection(changeEquipmentV3Panel.getSelectionModel())
					}
					,itemcollapse : function(){
						fixTreeSelection(changeEquipmentV3Panel.getSelectionModel())
					}
		        }
		    });
			
		    var _changequipmentSvgWidth = 420;
			var changeEquipmentV3Svg = Ext.create('Ext.panel.Panel', {
				id: svgDesktop.id,
				margin : '0px 2px 0px 2px',
				width: _changequipmentSvgWidth,
				height: 440
			});
			
			function saveTheLastModifyInstance(isNeed){
				if(!isNeed){
					var tc = new Date().getTime();
					if(tc - tabDeactiveControl < 300){
						tabDeactiveControl = tc;
						return;
					}
					tabDeactiveControl = tc;
				}
				var itemId = "";
	    		if(tabPanel && tabPanel.getActiveTab() && tabPanel.getActiveTab().itemId){
	    			itemId = tabPanel.getActiveTab().itemId;
	    		}
	    		if(itemId && itemId.indexOf("instance") == 0){
					if(!svgDesktop.isActivate) return;
					if(svgDesktop.propertiesGrid && svgDesktop.propertiesGrid.focuseNode){
						svgDesktop.propertiesGrid.focuseNode.properties = getProperties(svgDesktop.propertiesGrid.getData());
					}
					var ss = itemId.split("_");
					var d = ss[1];
					var n = ss[2];
					if(multiSelObj[d][n]){
						multiSelObj[d][n].models = svgDesktop.getModels();
						multiSelObj[d][n].relations = svgDesktop.getRelations();
						multiSelObj[d][n].properties = getProperties(svgDesktop.rootNode.properties);
					}
				}
			}
			
			var okBtn = Ext.create('Ext.button.Button', {
				text: 'Finish',
				iconCls: 'icon-save',
			    handler: function(){
					if(isReadOnly){
						okBtn.setDisabled(true);
						return;
					}
			    	if (finishCallback) {
			    		saveTheLastModifyInstance(true);
			    		var tmpD = myClone(multiSelObj);
			    		for(var a in tmpD){
			    			if(tmpD[a].length){
			    				for(var b=0; b<tmpD[a].length; b++){
			    					//tmpD[a][b].isInit = null;
			    					if(tmpD[a][b].isDeleted){
			    						tmpD[a].splice(b, 1);
			    						b--;
			    					}
			    				}
			    			}
			    		}
						finishCallback(tmpD);
			    		changeEquipmentV3Win.close();
			    		changeEquipmentV3Win = null;
			    		addChildWin = null;
			    	}
			    }
			});
			
			var savBt = Ext.create('Ext.button.Button', {
				text: 'Save Equipment',
				iconCls: 'icon-save',
			    handler: function(){
					if(svgDesktop.propertiesGrid && svgDesktop.propertiesGrid.focuseNode){
						svgDesktop.propertiesGrid.focuseNode.properties = getProperties(svgDesktop.propertiesGrid.getData());
					}
			    	var formData = {
						MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
						COMMAND : 'COMMAND_SAVE',
						BUSINESS_DATA :  Ext.encode({
								id : FocusedEquipment.id,
								name : FocusedEquipment.name,
								description : FocusedEquipment.description,
								iconFlag : FocusedEquipment.iconFlag || "",
								parentId : FocusedEquipment.parentId,
								serialNumber : svgDesktop.rootNode.serialNumber,
								models : svgDesktop.getModels(),
								relations : svgDesktop.getRelations(),
								properties : getProperties(svgDesktop.rootNode.properties),
								publik : false
						})
					};
					caller.callService(formData,function(data){
						if(data.STATUS === "success"){
							Notification.showNotification('Save Equipment success!');
						}else{
							Notification.showNotification('Save Equipment failed!');
						}
					})
				}
			});
			
			var forId = "";
			var addChildWin = null;
			var saveAsBt = Ext.create('Ext.button.Button', {
				text: 'Save As',
				iconCls: 'icon-next',
			    handler: function(){
					if(!FocusedNode) return;
					if(addChildWin){
						Ext.getCmp("equipmentRelationName_c"+forId).setValue("");
						Ext.getCmp("equipmentRelationDes_c"+forId).setValue("");
						Ext.getCmp("parentTemplateName"+forId).setValue(FocusedNode.name);
						addChildWin.show();
						return;
					}
					forId = Math.random();
					addChildWin = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
						title : 'Equipment',
						width: 450,
						height: 230,
						resizable : false,
						modal : true,
						bodyStyle : {
							background : 'white'
						},
						items : [{
							xtype: 'container',
			                border:false,
			                margin: '20px 5px 10px 10px',
			                layout: 'hbox',
			                items: [{
			                	id: 'equipmentRelationName_c'+forId,
			                	xtype: 'textfield',
			                	allowBlank : false,
			                	emptyText  : 'Please input equipment name!',
			                    fieldLabel: 'Name',
								maxLength  : UiProperties.nameMaxLength,
			    	            width: 380,
								msgTarget  : 'side',
								labelAlign : 'left',
								labelWidth : 120
			                }]
						},{
							xtype: 'container',
			                border:false,
			                margin: '20px 5px 10px 10px',
			                layout: 'hbox',
			                items: [{
			                	id: 'equipmentRelationDes_c'+forId,
			                	xtype: 'textfield',
			                	emptyText  : 'Please input description!',
			                    fieldLabel: 'Description',
								maxLength  : UiProperties.descMaxLength,
			    	            width: 380,
								msgTarget  : 'side',
								labelAlign : 'left',
								labelWidth : 120
			                }]
						},{
			                xtype: 'container',
			                border:false,
			                margin: '20px 5px 10px 10px',
			                layout: 'hbox',
			                items: [{
			                	id: 'parentTemplateName'+forId,
			                	xtype: 'textfield',
			                    fieldLabel: 'Parent Equipment',
			                    name: 'parentName',
			    	            readOnly: true,
			    	            width: 380,
				                msgTarget  : 'side',
								labelAlign : 'left',
								labelWidth : 120
			                }]
						},okButton],
						listeners : {
							beforeclose : function(){
								addChildWin.hide();
								return false;
							}
						}
					})
					addChildWin.show();
					Ext.getCmp("parentTemplateName"+forId).setValue(FocusedNode.name);
			    }
			});
			
			var okButton = Ext.create('Ext.button.Button', {
				text : 'Ok',
				width : 100,
				margin : '20 10 0 170',
				handler:function(){
					if(!Ext.getCmp("equipmentRelationName_c"+forId).getValue()) return;
					var model = svgDesktop.getModels();
					if(svgDesktop.propertiesGrid && svgDesktop.propertiesGrid.focuseNode){
						svgDesktop.propertiesGrid.focuseNode.properties = getProperties(svgDesktop.propertiesGrid.getData());
					}
					saveTheLastModifyInstance(true);
					var tmpPs = getProperties(svgDesktop.rootNode.properties);
					if(tmpPs && tmpPs.length){
						for(var n=0; n<tmpPs.length; n++){
							if(tmpPs[n].belong == "System") continue;
							tmpPs[n].belong = "Parent";
						}
					}
					if(model && model.length){
						for(var n=0; n<model.length; n++){
							if(model[n].isTopRoot){
								model[n].parentId = FocusedEquipment.id;
								model[n].properties = tmpPs;
								delete model[n].rootId;
								break;
							}
						}
					}
					var formData = {
						MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
						COMMAND : 'COMMAND_SAVE',
						BUSINESS_DATA :  Ext.encode({
								id : "",
								name : Ext.getCmp("equipmentRelationName_c"+forId).getValue(),
								description : Ext.getCmp("equipmentRelationDes_c"+forId).getValue(),
								iconFlag : svgDesktop.rootNode.iconFlag || "",
								parentId : FocusedNode.id,
								serialNumber : svgDesktop.rootNode.serialNumber,
								models : model,
								relations : svgDesktop.getRelations(),
								properties : tmpPs,
								publik : false
						})
					};
					caller.callService(formData,function(data){
						addChildWin.hide();
						Notification.showNotification("Save Equipment Successfully!");
						caller.callService({
							MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
							COMMAND : 'COMMAND_QUERY_TREE',
							BUSINESS_DATA : "p__" + parentId,
							KEY : 'changeEquipmentV3Win',
							parentNodeId : changeEquipmentV3Panel.getStore().getRootNode().id
						},function(data){
							initTheTreeInChangeEquipmentV3(data);
						})
					})
				}
			})
			function initTheTreeInChangeEquipmentV3(data){
				loadEquipmentTemplateTree('changeEquipmentV3PanelId',data, multiSelObj, true);
				setTimeout(function(){
					var equipmentTypeTree = Ext.getCmp('changeEquipmentV3PanelId');
					if(equipmentTypeTree){
						var tmpS = equipmentTypeTree.getStore();
						var tmpNode = "";
						if(tmpS && parentId) tmpNode = tmpS.getNodeById(parentId);
						if(tmpNode){
							equipmentTypeTree.getSelectionModel().select(tmpNode, true, true);
							changeEquipmentV3PanelItemClick(parentId);
						}
					}
				},300)
			}
			function initTheTreeInChangeEquipmentV3_waste1(data){
				loadEquipmentTemplateTree('changeEquipmentV3PanelId',data, multiSelObj, true);
				setTimeout(function(){
					var equipmentTypeTree = Ext.getCmp('changeEquipmentV3PanelId');
					if(equipmentTypeTree){
						var tmpS = equipmentTypeTree.getStore();
						var nodeHash = tmpS.tree.nodeHash;
						var tmpId = "";
						for(var x in nodeHash){
							if(x != "root" && typeof x == 'string'){
								if(nodeHash[x].raw.qty){
									tmpId = x;
									break;
								}
							}
						}
						var tmpNode = "";
						if(tmpId){
							tmpNode = tmpS.getNodeById(tmpId);
						}else if(parentId){
							tmpNode = tmpS.getNodeById(parentId);
							tmpId = parentId;
						}
						if(tmpNode){
							equipmentTypeTree.getSelectionModel().select(tmpNode, true, true);
							changeEquipmentV3PanelItemClick(tmpId);
						}
					}
				},300)
			}
			function findAllChildren(d){
				var re = [];
				if(d.id && d.name){
					re.push({id: d.id, name: d.name});
					_findAllChildren(re, d);
				}
				return re;
			}
			function _findAllChildren(re, d){
				if(d.children && d.children.length){
					for(var a=0; a<d.children.length; a++){
						var da = d.children[a];
						if(da.id && da.name){
							re.push({id: da.id, name: da.name});
							_findAllChildren(re, da);
						}
					}
				}
			}
			function changeEquipmentV3PanelItemClick(id){
				if(!dontChange) saveTheLastModifyInstance();
				caller.callService({
					MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
					COMMAND : 'COMMAND_QUERY_INFO',
					BUSINESS_DATA :  id
				},function(message){
					dontChange = true;
					var data = Ext.JSON.decode(message.BUSINESS_DATA);
					var tmpEquipmentObj = findAllChildren(data);
					
					tabPanel.removeAll();
					tabPanel.add({
						itemId : 'equipmentTab',
						title : 'Equipment',
						border : false,
						listeners : {
							'deactivate' : equipmentDeactivate
						}
					});
					
					for(var t=0; t<tmpEquipmentObj.length; t++){
						var tmpT = tmpEquipmentObj[t];
						if(multiSelObj[tmpT.id] && multiSelObj[tmpT.id].length){
							for(var w=0; w<multiSelObj[tmpT.id].length; w++){
								if(multiSelObj[tmpT.id][w].isDeleted) continue;
								if(multiSelObj[tmpT.id][w].id || multiSelObj[tmpT.id][w].isInit){
									tabPanel.add({
										itemId : 'instance_' + tmpT.id + "_" + w,
										title : tmpT.name + "(" + (w + 1) + ")",
										border : false,
										closable : isReadOnly ? false : true,
										listeners : {
											'beforeclose' : instanceBeforeclose
											,'deactivate' : instanceDeactivate
										}
									})
								}
							}
						}
					}
					
					if(!isReadOnly){
						tabPanel.add({
							itemId : 'addTab',
							title : 'New',
							iconCls : 'icon-add',
							border : false,
							closable : false
						})
					}
					
					FocusedNode = data;
					FocusedEquipment = data;
					svgDesktop.clearSvg();
					svgDesktop.createInitRelation(data);
					svgDesktop.instanceTabFlag = data.id + "_equipment";
					try{
						_properties.setFocused(svgDesktop.rootNode)
					}catch(e){}
					showGeneralledDiv(!!(data.id), data.generalled);
					
					setTimeout(function(){
						dontChange = false;
						tabPanel.setActiveTab(0);
					},100);
				});
			}
			function changeEquipmentV3PanelItemClick_waste1(id){
		    	caller.callService({
					MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
					COMMAND : 'COMMAND_QUERY_INFO',
					BUSINESS_DATA :  id
				},function(message){
					dontChange = true;
					tabPanel.removeAll();
					tabPanel.add({
						itemId : 'equipmentTab',
						title : 'Equipment',
						border : false,
						listeners : {
							'deactivate' : equipmentDeactivate
						}
					});
					
					if(multiSelObj[id] && multiSelObj[id].length){
						for(var w=0; w<multiSelObj[id].length; w++){
							if(multiSelObj[id][w].isDeleted) continue;
							if(multiSelObj[id][w].id || multiSelObj[id][w].isInit){
								tabPanel.add({
									itemId : 'instance_' + id + "_" + w,
									title : "Instance " + (w + 1),
									border : false,
									closable : isReadOnly ? false : true,
									listeners : {
										'beforeclose' : instanceBeforeclose
										,'deactivate' : instanceDeactivate
									}
								})
							}
						}
					}
					
					if(!isReadOnly){
						tabPanel.add({
							itemId : 'addTab',
							title : 'New',
							iconCls : 'icon-add',
							border : false,
							closable : false
						})
					}
					
					var data = Ext.JSON.decode(message.BUSINESS_DATA);
					FocusedNode = data;
					FocusedEquipment = data;
					svgDesktop.clearSvg();
					svgDesktop.createInitRelation(data);
					try{
						_properties.setFocused(svgDesktop.rootNode)
					}catch(e){}
					
					setTimeout(function(){
						dontChange = false;
						tabPanel.setActiveTab(0);
					},100);
				});
		    }
			function equipmentDeactivate(){
				if(this.itemId == "equipmentTab" && FocusedEquipment){
					try{
						if(!svgDesktop.isActivate)return ; 
						if(svgDesktop.propertiesGrid && svgDesktop.propertiesGrid.focuseNode){
							svgDesktop.propertiesGrid.focuseNode.properties = svgDesktop.propertiesGrid.getData();
						}
					}catch(e){}
					FocusedEquipment.models = svgDesktop.getModels();
					FocusedEquipment.relations = svgDesktop.getRelations();
					FocusedEquipment.properties = getProperties(svgDesktop.rootNode.properties);
				}
			}
			var tabDeactiveControl = 0;
			function instanceDeactivate(){
				if(isChangeEquipmentItemclick) return;
				var tc = new Date().getTime();
				if(tc - tabDeactiveControl < 300){
					tabDeactiveControl = tc;
					return;
				}
				tabDeactiveControl = tc;
				if(this.itemId.indexOf("instance") == 0){
					if(!svgDesktop.isActivate) return;
					if(svgDesktop.propertiesGrid && svgDesktop.propertiesGrid.focuseNode){
						svgDesktop.propertiesGrid.focuseNode.properties = svgDesktop.propertiesGrid.getData();
					}
					var ss = this.itemId.split("_");
					var d = ss[1];
					var n = ss[2];
					if(multiSelObj[d][n] && svgDesktop.instanceTabFlag == d + "_" + n){
						multiSelObj[d][n].models = svgDesktop.getModels();
						multiSelObj[d][n].relations = svgDesktop.getRelations();
						multiSelObj[d][n].properties = getProperties(svgDesktop.rootNode.properties);
					}
				}
			}
			function instanceBeforeclose(){
				if(this.itemId.indexOf("instance") == 0){
					dontChange = true;
					var ss = this.itemId.split("_");
					var d = ss[1];
					var n = ss[2];
					multiSelObj[d][n].isDeleted = true;
					var tmpNode = changeEquipmentV3Panel.getStore().getNodeById(d);
					if(tmpNode){
						var tmpNodeQty = parseInt(tmpNode.get('qty')) - 1;
						tmpNode.raw.qty = tmpNodeQty;
						tmpNode.set('qty', tmpNodeQty);
						fixTreeSelection(changeEquipmentV3Panel.getSelectionModel());
					}
					setTimeout(function(){
						dontChange = false;
						tabPanel.setActiveTab(0);
					},100);
				}
			}			
			
			var tabPanel = Ext.create('Ext.tab.Panel', {
				border : false,
				region : 'north',
				width : 750,
				height : 52,
				margin : '0 0 0 8',
				activeTab : 0,
				bodyStyle : {
					background : 'transparent'
				},
				tbar : [savBt, saveAsBt],
				items : [],
				listeners : {
					'tabchange' : function(){						
						if(dontChange) return;
						dontChange = true;
						var tmpId = tabPanel.getActiveTab().itemId;
						var tmpFlag = !(tmpId == 'equipmentTab');
						savBt.setDisabled(tmpFlag);
						saveAsBt.setDisabled(tmpFlag);
						if(!FocusedEquipment){
							dontChange = false;
							tabPanel.setActiveTab(0);
							return;
						}
						changeEquipmentV3Win.couldnotChangeLocked = true;
						if(tmpFlag){
							if(tmpId == 'addTab'){//addTab
								if(FocusedEquipment){
									if(!multiSelObj[FocusedEquipment.id]){
										multiSelObj[FocusedEquipment.id] = [];
									}
									var tmpNum = tabPanel.items.length - 1;
									var _instanceTabFlag = FocusedEquipment.id + "_" + multiSelObj[FocusedEquipment.id].length;
									var tmpTab = tabPanel.insert(tmpNum, {
										itemId : 'instance_' + _instanceTabFlag,
										title : FocusedEquipment.name + "(" + (multiSelObj[FocusedEquipment.id].length + 1) + ")",
										border : false,
										closable : true,
										listeners : {
											'beforeclose' : instanceBeforeclose
											,'deactivate' : instanceDeactivate
										}
									});
									var tmp = myClone(FocusedEquipment);
									tmp.id = "";
									tmp.isInit = true;
									multiSelObj[FocusedEquipment.id].push(tmp);
									
									var tmpNode = changeEquipmentV3Panel.getStore().getNodeById(FocusedEquipment.id);
									if(tmpNode){
										var tmpNodeQty = parseInt(tmpNode.get('qty')) + 1;
										tmpNode.raw.qty = tmpNodeQty;
										tmpNode.set('qty', tmpNodeQty);
										fixTreeSelection(changeEquipmentV3Panel.getSelectionModel());
									}
									
									tabPanel.setActiveTab(tmpTab);
									
									FocusedNode = tmp;
									svgDesktop.clearSvg();
									svgDesktop.createInitRelation(tmp);
									svgDesktop.instanceTabFlag = _instanceTabFlag;
									svgDesktop.rootNode.site = site;
									_properties.setFocused(svgDesktop.rootNode);
									showGeneralledDiv(!!(tmp.id), tmp.generalled);
								}
							}else if(tmpId.indexOf("instance") == 0){//instanceTab
								var dd = tmpId.split("_")[1];
								var num = tmpId.split("_")[2];
								var ob = multiSelObj[dd][num];
								if(ob){
									if(ob.id && !ob.isDeleted && !ob.isInit){
										caller.callService({
											MODULE_TYPE : 'MOD_CHANGE_REQUEST_ACCEPT',
											COMMAND : 'COMMAND_QUERY_INFO',
											BUSINESS_DATA : ob.id
										},function(message){
											var data = Ext.JSON.decode(message.BUSINESS_DATA);
											FocusedNode = data;
											data.isInit = true;
											ob = data;
											multiSelObj[dd][num] = data;
											svgDesktop.clearSvg();
											svgDesktop.createInitRelation(ob);
											svgDesktop.instanceTabFlag = dd + "_" + num;
											svgDesktop.rootNode.site = site;
											_properties.setFocused(svgDesktop.rootNode)
											showGeneralledDiv(!!(ob.id), ob.generalled);
										});
									}else if(!ob.isDeleted){
										FocusedNode = ob;
										svgDesktop.clearSvg();
										svgDesktop.createInitRelationV2(ob);
										svgDesktop.instanceTabFlag = dd + "_" + num;
										svgDesktop.rootNode.site = site;
										_properties.setFocused(svgDesktop.rootNode);
										showGeneralledDiv(!!(ob.id), ob.generalled);
									}
								}
							}
						}else{//equipmentTab
							FocusedNode = FocusedEquipment;
							svgDesktop.clearSvg();
							svgDesktop.createInitRelationV2(FocusedNode);
							svgDesktop.instanceTabFlag = FocusedEquipment.id + "_equipment";
							svgDesktop.rootNode.site = site;
							_properties.setFocused(svgDesktop.rootNode);
							_properties.grid.couldnotChangeProType = FocusedEquipment.hasInstances ? true : false;
							changeEquipmentV3Win.couldnotChangeLocked = false;
							showGeneralledDiv(!!(FocusedNode.id), FocusedNode.generalled);
						}
						setTimeout(function(){ dontChange = false; },100);
					}
				}
			})
			var equipmentForLayout2 = {
				xtype : 'container',
				border : false,
				region : 'center',
				layout : 'hbox',
				margin : '0 5 0 5',
				bodyStyle : {
					background : 'white'
				},
				items : [changeEquipmentV3Svg, _properties.grid]
			}
			var equipmentForLayout = {
				xtype : 'container',
				border : false,
				bodyStyle : {
					background : 'white'
				},
				items : [tabPanel, equipmentForLayout2]
			}
			
			_properties.grid.height = 440;
			_properties.grid.width = 330;
			_properties.grid.minWidth = 300;
			_properties.grid.collapsible = false;
			_properties.grid.couldnotAddOrDel = true;
			changeEquipmentV3Win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
				id: 'changeEquipmentV3WinId',
				title: 'Equipment',
				width : 1062,
				height : 562,
				modal : true,
				tbar: [okBtn],
				items: [{
	                xtype: 'container',
	                border:false,
	                margin: '5 5 0 5',
	                layout: 'hbox',
	                items: [changeEquipmentV3Panel, equipmentForLayout]
				}],
				listeners: {
					afterlayout : function(){
						svgDesktop.initializeDefaultSvg(_changequipmentSvgWidth, 440);
					}
				}
			});
		}
		caller.callService({
			MODULE_TYPE : 'MOD_EQUIPMENT_TEMPLATEV2',
			COMMAND : 'COMMAND_QUERY_TREE',
			BUSINESS_DATA : "p__" + parentId,
			KEY : 'changeEquipmentV3Win',
			parentNodeId : changeEquipmentV3Panel.getStore().getRootNode().id
		},function(data){
			initTheTreeInChangeEquipmentV3(data);
		})
		changeEquipmentV3Win.show();
		if(isReadOnly) okBtn.setDisabled(true);
		initGeneralledDiv();
		function initGeneralledDiv(){
			d3.selectAll(".equipmentGeneralledDivClass").remove();
			d3.selectAll(".equipmentGeneralledTextClass").remove();
			var g = d3.select("#svgMainchangeEquipmentV3SvgDiv-body").append("g").attr("class", "equipmentGeneralledDivClass").style("display", "none");
			g.append("rect").attr("width", _changequipmentSvgWidth).attr("height", 18).style("opacity", .15).attr("color", "#ccc");
			g.append("text").attr("class", "equipmentGeneralledTextClass").style("font-size", 13).attr("x", 7).attr("y", 12);
		}
		function showGeneralledDiv(f, GOrS){
			d3.selectAll(".equipmentGeneralledDivClass").style("display", f ? "block" : "none");
			d3.select(".equipmentGeneralledTextClass").text(GOrS ? "This equipment is generic" : "This equipment is specialized");
		}
	}
//end of changeEquipmentV3-tab
	
	var editLinkWin = function(grid, fn, args, isUp, namespace) {
		var linkWin = Ext.getCmp('linkWinId');
		if (linkWin) return linkWin;
		
		var sourceField = '';
		var sourceValue = '';
		var targetField = '';
		var targetValue = '';
		var sourceSN, targetSN;
		var callbackFn, source, target, _source, _target, direction;
		var store;
		if (!isUp) {
			store = grid.getStore();
			var tmpDatas = [];
			for(var i = 0, len=store.getCount(); i<len; i++){
				tmpDatas.push(store.getAt(i).data);
			}
			sourceField = store.getAt(0).data.name;
			sourceValue = store.getAt(0).data.defaultValue;
			targetField = store.getAt(1).data.name;
			targetValue = store.getAt(1).data.defaultValue;
			
			sourceSN = store.getAt(0).data.id;
			targetSN = store.getAt(1).data.id;
			var _tempSource = namespace.nodesMap.getNode(sourceSN);
			var _tempTarget = namespace.nodesMap.getNode(targetSN);
			var _adjust = namespace.nodesMap.canAdjustRatio(_tempSource, _tempTarget);
			//console.log('_adjust', _adjust);
			if (!_adjust) return Notification.showNotification("Cann't update the relation!");
		} else {
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
		}
		
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
	                	id: 'sourceFieldId',
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
		                	id: 'targetFieldId',
		                	xtype: 'numberfield',
		    	            fieldLabel: targetField,
		    	            name: 'target',
		    	            minValue: 1,
		    	            anchor:'95%',
		    	            value: targetValue
		                }]
		            }, {
		                xtype: 'container',
		                flex: 1,
		                border: false,
		                layout: 'anchor',
		                margin: '0 0 0 5px',
		                items: [{
		                	id: 'targetNId',
		                	xtype: 'checkbox',
		    	            name: 'targetN',
		    	            allowBlank: false,
		    	            boxLabel: 'N',
		    	            listeners: {
		    	            	change : function(t, newValue, oldValue, eOpts){
		    	            		if (newValue) {
		    	            			Ext.getCmp('targetFieldId').setReadOnly(true);
		    	            			Ext.getCmp('targetFieldId').setValue(1);
		    	            		} else {
		    	            			Ext.getCmp('targetFieldId').setReadOnly(false);
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
	            	var targetFieldValue = Ext.getCmp('targetFieldId').getValue();
	            	var targetN = Ext.getCmp('targetNId').getValue();
	            	var temp = '';
	            	if (targetN) {
	            		temp = 'N';
	            	} else {
	            		temp = targetFieldValue;
	            	}
	            	if (!isUp) {
	            		var datas = [{'id': sourceSN, 'name': sourceField, 'defaultValue': sourceValue}, 
	       		                     {'id': targetSN, 'name': targetField, 'defaultValue': temp}];
	            		
	            		var _tempSource = namespace.nodesMap.getNode(sourceSN);
	            		var _tempTarget = namespace.nodesMap.getNode(targetSN);
	            		if (_tempSource && _tempTarget) {
	            			//console.log('update map relation!', sourceValue, convertN2Number(temp));
	            			namespace.nodesMap.adjustRatio(_tempSource, _tempTarget, sourceValue, convertN2Number(temp));
	            		}
	            		
       	            	if (fn) {
       	            		fn(datas,namespace);
       	            	}
	            	} else {
	            		var datas = {
		            		source: source,
		            		target: target,
		            		_source: _source,
		            		_target: _target,
		            		direction: direction,
		            		sourceValue: sourceValue,
		            		targetValue: temp
		            	}
		            	if (callbackFn) {
		            		callbackFn(datas,namespace);
		            	}
	            	}
	                Ext.getCmp('linkWinId').close();
	            }
	        }],
	        buttonAlign: 'center'
		});
		
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			id: 'linkWinId',
		    title: 'Properties',
		    width: 400,
		    height: 250,
		    layout: 'fit',
		    modal : true,
		    resizable: false,
		    items: [linkForm],
		    bodyStyle : {
				background: 'white'
			},
		    listeners: {
		    	beforeshow : function(t, eopts) {
		    		if (targetValue === 'N') {
		    			Ext.getCmp('targetNId').setValue(true);
		    		}
		    	}
		    }
		});
		win.show();
	}
	
	function fixTreeSelection(sm){
		if(!sm) return
		var s = sm.getSelection()
		if(!s || !s.length) return
		for(var i in s){
			sm.deselect(s[i], true, true)
			sm.select(s[i], true, true)
		}
	}
	function clearAllEmptyRecordInStore(store){
		var ite = store.data.items;
		if(ite && ite.length){
			for(var a=0; a<ite.length; a++){
				if(ite[a] && ite[a].data){
					var da = ite[a].data;
					flag = true;
					for(var b in da){
						if(da[b] && !(b == 'belong' && da[b] == "Self")){
							flag = false;
							break;
						}
					}
					if(flag){
						store.removeAt(a);
						a--;
					}
				}
			}
		}
	}
	
	var convertN2Number = function(value) {
		if (value === 'N') {
			return -1;
		}
		return value;
	}
//===================caller define 
	var caller = (function(){  //閺堝秴濮熼崳銊﹀复閸欙綀鐨熼悽銊ユ珤
		
		var MESSAGE_KEY = "equipment_template_message_client_key";
		
		var fns = {};
		var _callback = function(data){
			callbackFn = fns[data[MESSAGE_KEY]];
			if(callbackFn){
				callbackFn(data);
			}
		};
		return {
			callService : function(cometdConfig,callback){
				cometdfn.request(cometdConfig,callback);
			},
			hasKey : function(data){
				return fns[data[MESSAGE_KEY]] !== undefined;
			}
		}
	})();
	
var showDeletedEquipment = false;
function removeDeletedEquipment(ds){
	if(ds && ds.length){
		for(var a=0; a<ds.length; a++){
			if(ds[a]){
				if(ds[a].isDeleted){
					ds.splice(a, 1);
					a--;
					continue;
				}
				if(ds[a].children && ds[a].children.length) removeDeletedEquipment(ds[a].children);
			}
		}
	}
}
var deFormWinResizeFlag = 0;
function setCheckedInTree(n ,c){
	if(n && n.childNodes && n.childNodes.length){
		for(var i=0; i<n.childNodes.length; i++){
			n.childNodes[i].set("checked", c);
			setCheckedInTree(n.childNodes[i], c);
		}
	}	
}
	
//clone object (object include: {} [] null; typeof include: object string number boolean function undefined)
function myClone(obj) {
	if(obj == null || typeof(obj) != 'object') return obj;
	var temp = new obj.constructor();
	for(var key in obj) temp[key] = myClone(obj[key]);
	return temp;
}
//===================define global var 
	//properties grid
	var _properties = propertiesGrid();
	var _ns = Ext.create("DigiCompass.Web.app.equipmentTemplateV2.NodeDesktop","equipmentRelationSvgDiv",_properties);
	
//===================the img path
	var equipImg = {
		change : '../../styles/cmp/images/yq_equip_change.png'
		,fold : '../../styles/cmp/images/yq_fold.png'
		,unfold : '../../styles/cmp/images/yq_unfold.png'
	}
	//equipment icon
	function getEquipmentIconFlag(icon){
		try{
			var tmp = icon.split("_");
			return tmp[tmp.length - 1].split(".")[0];
		}catch(e){}
		return "";
	}
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
	function changeUploadBtnIconSize(){
		if(d3.select("#changeIconBtnId-btnIconEl")) d3.select("#changeIconBtnId-btnIconEl").style("background-size", "cover");
	}
	var equipIconF = ["", "phone", "laptop", "printer", "square", "server", "monitor", "brick", "drive", "map"];
	
//===================return obj
	return {
		entry : function(message){
			if(message.SPACE ==='enter')
				createLeftPanel(message);
		},
		derivedFormWin : function(callback, isCatelog){
			derivedFormWin(null,isCatelog,function(node){
				callback(node.id,node.name, node.description);
			});
		},
		changeTheEquipment : function(callback, tmpTreeParentId, tmpTheSelectId, multiSelObj){
			changeTheEquipment(function(idOrNull, nameOrList){
				if(idOrNull){
					callback(idOrNull, nameOrList);
				}else{
					callback(nameOrList)
				}
			}, tmpTreeParentId, tmpTheSelectId, multiSelObj);
		},
		changeEquipmentV3 : changeEquipmentV3Fn
	};
})());