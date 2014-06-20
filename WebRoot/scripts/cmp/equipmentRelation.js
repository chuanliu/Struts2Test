(function(){
	var ns = Ext.namespace('DigiCompass.Web.app.equipmentRelation');
	var svgA = Ext.namespace('DigiCompass.Web.app.equipmentRelation.svg.a');
	var svgB = Ext.namespace('DigiCompass.Web.app.equipmentRelation.svg.b');
	var svgC = Ext.namespace('DigiCompass.Web.app.equipmentRelation.svg.c');
	
	ns.HANDLER_TYPE = 'HANDLER_TYPE';
	ns.HANDLER_TYPE_NODE = 'NODE';
	ns.HANDLER_TYPE_LINK = 'LINK';
	
	ns.getList = function(data, config) {
		var fields = ['id', 'name', 'description', 'groupId', 'relation'];
		var columns = [{
						xtype : 'treecolumn',
						header : 'Name',
						dataIndex : 'name',
						sortable : false,
						flex: 1
					},{
						header : 'Description',
						dataIndex : 'description',
						sortable : false,
						flex: 1
					}];
		var datas = Ext.JSON.decode(data.BUSINESS_DATA.list);
		if (Ext.getCmp('equipmentRelationListView')) {
			Ext.getCmp('equipmentRelationListView').reconfigData(datas);
		} else {
			  var objectExplorer = Ext.create('DigiCompass.Web.ux.objectExplorer',{
					columns: columns,
					fields: fields,
					width: 'fit',
					height: 735,
					data: [],
					listeners : {
						itemclick : ns.clickFunction
					}
				});
			  
			  	objectExplorer.on('checkchange', function(node, checked) {      
					objectExplorer.checkchild(node, checked);  
					objectExplorer.checkparent(node);  
		    	});  
			  	
				var catalogue = Ext.create('DigiCompass.Web.ux.catalogue',{
					width: 'fit',
					height: 722,
					data: [],
					collapsible: true,
					split: true,
					region: 'center',
					hidden: true
				});
				
				var mainPanel = Ext.create('DigiCompass.Web.ux.outerPanel',{
					id : 'equipmentRelationListView',
					module: 'MOD_SITE_GROUP',
					command: 'COMMAND_QUERY_LIST',
					region: 'west',
					otherParam: {},
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
								var formPanel = ns.addFormPanel(null, false);
								Ext.getCmp('obj-details').removeAll();
								Ext.getCmp('obj-details').add(formPanel);
								
								ns.initializeDefaultSvg();
								ns.setDropTarget('equipmentRelationSvg');
							}else{
								ns.changeContainer(false);
								ns.clearFormData();
								ns.clearCenterData();
							}
							UiFunction.setTitle('equipmentRelationAdd', 'Equipment Relation');
						}
					},{
						xtype : 'button',
						text : 'Delete',
						iconCls : 'icon-delete',
						handler : function() {
							var checkeds = new Array();
							var selected = objectExplorer.getChecked();
							for(var i = 0 ; i <selected.length ; i++){
								checkeds.push(selected[i].id);
							}
							if (checkeds.length == 0) {
								alertWarring('Please select a record!');
								return;
							}
							var param = {
								ids : checkeds,
								MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',
								COMMAND : 'COMMAND_DEL'
							};
							cometdfn.publish(param);
						}
					}]
				});
				
				objectExplorer.addDocked(toolBar);
				
				objExpPanel.add(objectExplorer);
				cataloguePanel.add(catalogue);
				catalogue.outerPanel = cataloguePanel;
				cataloguePanel.add(mainPanel);
			    // 展示右边面板
//			    DigiCompass.Web.UI.Wheel.showDetail();
			    // 创建自己的Panel
//				DigiCompass.Web.app.sitegroup.leftPanel = DigiCompass.Web.app.sitegroup.rightPanel();
		}
	}
	
	ns.createEquipmentTemplateWin = function() {
		var win = Ext.getCmp('equipmentTemplateWinId');
		if (win) {
			return win;
		}
		var formPanel = ns.addFormPanel(null, false);
		win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			id: 'equipmentTemplateWinId',
		    width: 1200,
		    height: 750,
		    layout: 'fit',
		    modal : true,
		    resizable: false,
		    items: [formPanel]
		});
		win.show();
		ns.initializeDefaultSvg();
		ns.setDropTarget('equipmentRelationSvg');
	}
	
	/**
	 * Init Relation
	 */
	ns.createInitRelation = function(relations, namespace){
		// delete map 
		console.log('remove all node!');
		namespace.nodesMap.removeAllNode();
		
		if (!namespace) {
			namespace = ns;
		}
		for(var i=0, len=relations.length; i<len; i++){
			var relation = relations[i];
			var left = relation.left;
			var right = relation.right;
			var leftRelation = relation.leftRelation;
			var rightRelation = relation.rightRelation;
			var leftX = relation.leftX;
			var leftY = relation.leftY;
			var rightX = relation.rightX;
			var rightY = relation.rightY;
			var leftDirection = relation.leftDirection;
			var rightDirection = relation.rightDirection;
			
			ns.createNode(left, leftX, leftY, namespace);
			ns.createNode(right, rightX, rightY, namespace);
			
			var sourceNode = ns.getNodeById(left.id, namespace);
			var targetNode = ns.getNodeById(right.id, namespace);
			ns.createLinks(sourceNode, targetNode, leftRelation, rightRelation, namespace, leftDirection, rightDirection);
		}
		DigiCompass.Web.app.svg.redraw(namespace);
	}
	
	ns.getNodeById = function(id, namespace) {
		for(var i=0, len=namespace.nodes.length; i<len; i++){
			var node = namespace.nodes[i];
			if (node.id === id) {
				return node;
			}
		}
		return null;
	}
	
	ns.createNode = function(node, x, y, namespace, lockProperties){
		// validate  检查 node 是否已经存在
		var check = ns.checkNode(node, namespace);
		if (check) {
			return;
		}
		var properties = ns.createProperties(node.properties, lockProperties);
		
		var serialNumber ;
		if (node.serialNumber) {
			serialNumber = node.serialNumber;
		} else {
			serialNumber = ++(namespace.lastNodeId);
		}
		
		// create
		var node = {
				serialNumber: serialNumber,
				x: Number(x), 
				y: Number(y), 
				text: node.name, 
				icon: node.icon,
				id: node.id,
				properties: properties,
				genicTypeId: node.genicTypeId,
				oringnalId: node.oringnalId
		};
		namespace.nodes.push(node);
		
		var tempMapNode = namespace.nodesMap.getNode(node.serialNumber);
		if (!tempMapNode) {
			tempMapNode = new com.digicompass.equipment.Node(node.serialNumber);
			console.log('add node : ', tempMapNode);
			namespace.nodesMap.addNode(tempMapNode);
		} 
		return node;
	}
	
	ns.checkNode = function(node, namespace){
		for(var i=0, len=namespace.nodes.length; i<len; i++){
			var temp = namespace.nodes[i];
			if(temp.id === node.id){
				return true;
			}
		}
		return false;
	}
	
	ns.createProperties = function(properties, lockProperties){
		var result = [];
		for (var i=0, len=properties.length; i<len; i++) {
			var property = properties[i];
			
			var temp = {
					name: property.name,
					id: property.id,
					optional: property.optional,
					requirement: property.requirement,
					type: property.type,
					defaultValue: property.defaultValue,
					list: property.list,
					multiple: property.multiple,
					isLock: property.isLock,
					systemProperty: property.systemProperty
				};
			if (lockProperties) {
				var _isParentLock = ns.checkIsLockProperties(lockProperties, property.name);
				temp.isParentLock = _isParentLock;
			} else {
				temp.isParentLock = property.isParentLock;
			}
			result.push(temp);
		}
		return result;
	}
	
	ns.createLinks = function(source, target, leftRelation, rightRelation, namespace, leftDirection, rightDirection){
		var properties = [{'id': source.serialNumber, 'name': source.text, 'defaultValue': leftRelation}, 
		                  {'id': target.serialNumber, 'name': target.text, 'defaultValue': rightRelation}];
		var newLink = {
	    	source: source, 
	    	target: target,
	    	properties: properties,
			left: leftDirection,
			right: rightDirection
	    };
		namespace.links.push(newLink);
		
		var _source = namespace.nodesMap.getNode(source.serialNumber);
        var _target = namespace.nodesMap.getNode(target.serialNumber);
        console.log('add line : ' + (leftRelation + ' : ' + ns.convertN2Number(rightRelation)));
		namespace.nodesMap.line(_source, _target, leftRelation, ns.convertN2Number(rightRelation));
		
	    return newLink;
	}
	
	ns.checkLinksFromSelectedNodes = function(selectedNodes, links) {
		var tag = false;
		var _tempLinks = [];
		for (var i=0, len=links.length; i<len; i++) {
			var link = links[i];
			var sourceCheck = ns.checkNodeIsInSelectedNode(selectedNodes, link.source);
			var targetCheck = ns.checkNodeIsInSelectedNode(selectedNodes, link.target);
			if (sourceCheck && targetCheck) {
				tag = true;
				_tempLinks.push(link);
			}
		}
		if (!tag) {
			return false;
		}
		for (var j=0, jLen=selectedNodes.length; j<jLen; j++) {
			var _temp = selectedNodes[j];
			var er = false;
			for (var k=0, kLen=_tempLinks.length; k<kLen; k++) {
				var _link = _tempLinks[k];
				if (_temp === _link.source || _temp === _link.target) {
					er = true;
					break;
				}
			}
			if (!er) {
				return false;
			}
		}
		return true;
	}
	
	ns.createLinksFromSelectedNodes = function(selectedNodes, links) {
		for (var j=0, len=selectedNodes.length; j<len; j++) {
			var serialNumber = ++(svgC.lastNodeId);
			var temp = selectedNodes[j];
			temp.oringnalId = temp.id;
			temp.serialNumber = serialNumber;
			svgC.nodes.push(temp);
			
			ns.addIsParentLockTag(temp.properties);
			
			var tempMapNode = new com.digicompass.equipment.Node(serialNumber);
			tempMapNode.id = temp.id;
			console.log('add node : ', tempMapNode);
			svgC.nodesMap.addNode(tempMapNode);
		}
		
		for (var i=0, len=links.length; i<len; i++) {
			var link = links[i];
			var sourceCheck = ns.checkNodeIsInSelectedNode(selectedNodes, link.source);
			var targetCheck = ns.checkNodeIsInSelectedNode(selectedNodes, link.target);
			if (sourceCheck && targetCheck) {
				link.properties[0].id = link.source.serialNumber;
				link.properties[1].id = link.target.serialNumber;
				svgC.links.push(link);
				
				var _source = ns.getNodeFromNodes(link.source);
//				link.source.serialNumber = _source._name;
				var _target = ns.getNodeFromNodes(link.target);
//				link.target.serialNumber = _target._name;
				var properties = link.properties;
				console.log('add line from1 ', link.source, link.target);
				console.log('add line from ',_source,_target);
				if (_source && _target) {
					console.log('add line : ' + (properties[0].defaultValue + ' : ' + ns.convertN2Number(properties[1].defaultValue)));
					svgC.nodesMap.line(_source, _target, properties[0].defaultValue, ns.convertN2Number(properties[1].defaultValue));
				}
			}
		}
	}
	
	ns.getNodeFromNodes = function(node) {
		var nodes = svgC.nodesMap.getNodes();
		for (var i=0, len=nodes.length; i<len; i++) {
			var _node = nodes[i];
			if (_node.id === node.id) {
				return _node;
			}
		}
		return null;
	}
	
	ns.addIsParentLockTag = function(arr) {
		for (var i=0, len=arr.length; i<len; i++) {
			var temp = arr[i];
			if (temp.isLock || temp.isParentLock) {
				temp.isParentLock = true;
				temp.isLock = false;
			} else {
				temp.isParentLock = false;
			}
		}
	}
	
	ns.getLockProperties = function(properties) {
		var lockProperties = [];
		for (var i=0, len=properties.length; i<len; i++) {
			var p = properties[i];
			if (p.isLock || p.isParentLock) {
				lockProperties.push(p);
			}
		}
		return lockProperties;
	}
	
	ns.checkIsLockProperties = function(lockProperties, name) {
		for (var i=0, len=lockProperties.length; i<len; i++) {
			var p = lockProperties[i];
			if (p.name === name) {
				return true;
			}
		}
		return false;
	}
	
	ns.checkNodeIsInSelectedNode = function(selectedNodes, node) {
		for (var i=0, len=selectedNodes.length; i<len; i++) {
			var temp = selectedNodes[i];
			if (temp === node) {
				return true;
			}
		}
		return false;
	}
	
	ns.replaceNodes = function(namespace, node, newNode) {
		for (var i=0, len=namespace.links.length; i<len; i++) {
			var temp = namespace.links[i];
			if (node === temp.source) {
				temp.source = newNode;
			} else if (node === temp.target) {
				temp.target = newNode;
			}
		}
		namespace.nodes.splice(namespace.nodes.indexOf(node), 1);
	}
	
	
	/**
	 * click function
	 */
	
	ns.handlerHasParent = function(record) {
		if(!Ext.getCmp('equipmentRelationAdd')){
			 var formPanel = ns.addFormPanel(null, true);
			 Ext.getCmp('obj-details').removeAll();
			 Ext.getCmp('obj-details').add(formPanel);
			 Ext.getCmp('equipmentType').setVisible(false);
			 ns.initializeSvgB();
	    	 ns.initializeSvgC();
		}else{
			ns.changeContainer(true);
			ns.clearFormData();
			ns.clearHasParentCenterData();
		}
		UiFunction.setTitle('equipmentRelationAdd', 'Equipment Template', record.raw.name);
		Ext.getCmp('equipmentRelationAdd').getForm().setValues(record.raw);
		// init parent
		var selectedItem = {
			currentId: record.raw.parentRelationId,
			name: record.raw.parentName
		};
		svgA.selectedItem = selectedItem;
		Ext.getCmp('derivedFromId').setValue(record.raw.parentName);
		
		// init svgB
		ns.initParentContainerSvgFromClick(record);
		// init  svgC
		var relation = record.raw.relation;
		ns.createInitRelation(relation, svgC);
		// init capex opex
		ns.showCapexOpex('capexPropertiesId2', 'etRelationProperties', svgC);
	} 
	
	ns.handlerHasNoParent = function(record) {
		 if(!Ext.getCmp('equipmentRelationAdd')){
			 var formPanel = ns.addFormPanel(null, false);
			 Ext.getCmp('obj-details').removeAll();
			 Ext.getCmp('obj-details').add(formPanel);
			 ns.initializeDefaultSvg();
			 ns.setDropTarget('equipmentRelationSvg');
		 }else{
			 ns.changeContainer(false);
			 ns.clearFormData();
			 ns.clearCenterData();
		 }
			
		 Ext.getCmp('equipmentRelationAdd').getForm().setValues(record.raw);
		 selectedRecord = record.raw;
		 var equipmentType = Ext.getCmp('equipmentType');
		 equipmentType.setValue(record.raw.groupId);
		 UiFunction.setTitle('equipmentRelationAdd', 'Equipment Template', record.raw.name);
		 cometdfn.publish({
			 MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',
			 COMMAND : 'COMMAND_QUERY_ALL_TREE',
			 id : record.raw.groupId
		 });
		 
		 // init SVG
		 var relation = record.raw.relation;
		 ns.createInitRelation(relation, ns);
		 
		 // init Capex Opex
		 ns.showCapexOpex('capexPropertiesId', 'equipmentRelationProperties', ns);
	}
	
	ns.clickFunction = function(grid, record, rowEl){
//		ns.derivedFormWin(null, null, ns.derivedFormFinishCallback);
//		DigiCompass.Web.UI.CometdPublish.equipmentTemplateTreePublish();
		 var isChecked = DigiCompass.Web.TreeUtil.isCheckChange(event);
		 if(isChecked){
			 return;
		 }
		 var id = record.raw.id;
		 if(Ext.isEmpty(id)){
			 return;
		 }
		 DigiCompass.Web.UI.Wheel.showDetail();
		 
		 var parentId = record.raw.parentRelationId;
		 if (parentId) {
			 // handler has parent
			 ns.handlerHasParent(record);
		 } else {
			 // handler has no parent
			 ns.handlerHasNoParent(record);
		 }
	}
	
	ns.equipmentTemplateTreeClickFunction = function(current, record, item, index, e, eOpts){
		// clear svg
		ns.clearSvg(svgA);
		// init svg
		var relation = record.raw.relation;
		svgA.selectedItem = record.raw;
		ns.createInitRelation(relation, svgA);
	}
	
	ns.initParentContainerSvg = function() {
		var selectedNodes = svgA.selected_nodes;
    	var selectedItem = svgA.selectedItem;
    	svgB.selected_nodes = selectedNodes;
    	ns.createInitRelation(selectedItem.relation, svgB);
	}
	
	ns.initParentContainerSvgFromClick = function(record) {
		var selectedNodes = record.raw.selectedNodes;
		if (!selectedNodes) {
//			return;
		}
		var parentRelation = record.raw.parentRelation;
		ns.createInitRelation(parentRelation, svgB);
//		for (var i=0, len=selectedNodes.length; i<len; i++) {
//			var tempId = selectedNodes[i];
//			var sourceNode = ns.getNodeById(tempId, svgB);
//			svgB.selected_nodes.push(sourceNode);
//		}
		DigiCompass.Web.app.svg.redraw(svgB);
	}
	
	ns.initCurrentContainerSvg = function() {
		var selectedNodes = svgA.selected_nodes;
    	var links = svgA.links;
    	ns.createLinksFromSelectedNodes(selectedNodes, links);
    	DigiCompass.Web.app.svg.redraw(svgC);
	}
	
	ns.createRelation = function(namespace) {
		var result = [];
		for(var i=0, len=namespace.links.length; i<len; i++){
			var link = namespace.links[i];
			console.log('link.source.oringnalId = ' + link.source.oringnalId);
			var temp = {
				id: link.id,
				sourceOringnalId: link.source.oringnalId,
				sourceId: link.source.id,
				sourcePro: link.source.properties,
				sourceRelationValue: ns.convertN2Number(link.properties[0].defaultValue),
				sourceX: link.source.x,
				sourceY: link.source.y,
				targetOringnalId: link.target.oringnalId,
				targetId: link.target.id,
				targetPro: link.target.properties,
				targetRelationValue: ns.convertN2Number(link.properties[1].defaultValue),
				targetX: link.target.x,
				targetY: link.target.y,
				leftDirection: link.left,
				rightDirection: link.right
			}
			result.push(temp);
		}
		return result;
	}
	
	ns.clearFormData = function() {
		Ext.getCmp('equipmentRelationId').setValue();
		Ext.getCmp('equipmentRelationName').setValue(' ');
		Ext.getCmp('equipmentRelationDes').setValue(' ');
		Ext.getCmp('equipmentType').clearValue();
	}
	
	ns.clearSvg = function(namespace) {
		if (!namespace.nodes || !namespace.link) {
			return;
		}
		if (!namespace) {
			namespace = ns;
		}
		var nodesLen = namespace.nodes.length;
		if(nodesLen > 0){
			namespace.nodes.splice(0, nodesLen);
		}
		var linksLen = namespace.links.length;
		if(linksLen > 0){
			namespace.links.splice(0, linksLen);
		}
		namespace.selected_nodes = [];
		namespace.current_selected_node = null;
		namespace.current_selected_link = null;
		
		namespace.nodesMap.removeAllNode();
		DigiCompass.Web.app.svg.redraw(namespace);
	}
	
	ns.clearCenterData = function() {
		ns.clearSvg(ns);
		var t = Ext.getCmp('equipmentRelationProperties');
		if (t) {
			t.getStore().loadData([]);
		}
		var p = Ext.getCmp('equipmentTypeTree');
		if (p) {
			p.setRootNode({});
		}
	}
	
	ns.clearHasParentCenterData = function() {
		ns.clearSvg(svgB);
		ns.clearSvg(svgC);
		var temp = Ext.getCmp('etRelationProperties');
		if (temp) {
			temp.getStore().loadData([]);
		}
	}
	
	ns.changeContainer = function(hasParent) {
//		Ext.getCmp('centerContainerId').removeAll(false);
		Ext.getCmp('centerContainerId').removeAll();
		if (hasParent) {
			// disable field
    		Ext.getCmp('equipmentType').setVisible(false);
    		// change container
    		var hasParentContainer = Ext.getCmp('hasParentContainerId');
    		if (!hasParentContainer) {
    			hasParentContainer = ns.createHasParentContainer();
    		}
    		Ext.getCmp('centerContainerId').add(hasParentContainer);
    		ns.initializeSvgB();
    		ns.initializeSvgC();
		} else {
			// enable field
    		Ext.getCmp('equipmentType').setVisible(true);
    		// init value
    		Ext.getCmp('derivedFromId').setValue();
    		var newParentContainer = Ext.getCmp('newParentContainerId');
    		if (!newParentContainer) {
    			newParentContainer = ns.createHasNoParentContainer();
    		}
    		Ext.getCmp('centerContainerId').add(newParentContainer);
    		ns.initializeDefaultSvg();
    		ns.setDropTarget('equipmentRelationSvg');
		}
	}
	
	ns.createEditNumWin = function(grid) {
		var fieldLabel = 'Test';
		var fieldValue = 22;
		
		var form = Ext.create('Ext.form.Panel', {
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
	            layout:'hbox',
	            items:[{
	                xtype: 'container',
	                flex: 5,
	                border:false,
	                layout: 'anchor',
	                items: [{
	                	id: 'fieldId',
	                	xtype: 'numberfield',
	    	            fieldLabel: fieldLabel,
	    	            name: 'target',
	    	            minValue: 1,
	    	            anchor:'95%',
	    	            value: fieldValue
	                }]
	            }, {
	                xtype: 'container',
	                flex: 1,
	                border: false,
	                layout: 'anchor',
	                margin: '0 0 0 5px',
	                items: [{
	                	id: 'fieldNId',
	                	xtype: 'checkbox',
	    	            name: 'fieldN',
	    	            allowBlank: false,
	    	            boxLabel: 'N',
	    	            listeners: {
	    	            	change : function(t, newValue, oldValue, eOpts){
	    	            		if (newValue) {
	    	            			Ext.getCmp('fieldId').setReadOnly(true);
	    	            		} else {
	    	            			Ext.getCmp('fieldId').setReadOnly(false);
	    	            			Ext.getCmp('fieldId').setValue(1);
	    	            		}
	    	            	}
	    	            }
	                }]
	            }]
	        }],
	        buttons: [{
	            text: 'Ok',
	            handler: function() {
	            	var targetFieldValue = Ext.getCmp('fieldId').getValue();
	            	var targetN = Ext.getCmp('fieldNId').getValue();
	            	var temp = '';
	            	if (targetN) {
	            		temp = 'N';
	            	} else {
	            		temp = targetFieldValue;
	            	}
	            	var datas = [{'name': sourceField, 'defaultValue': sourceValue}, 
		                  {'name': targetField, 'defaultValue': temp}];
//	            	if (fn) {
//	            		fn(datas);
//	            	}
	                Ext.getCmp('fieldWinId').close();
	            }
	        }],
	        buttonAlign: 'center'
		});
		
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			id: 'fieldWinId',
		    title: 'Properties',
		    width: 400,
		    height: 250,
		    layout: 'fit',
		    modal : true,
		    resizable: false,
		    items: [form],
		    listeners: {
		    	beforeshow : function(t, eopts) {
		    		if (fieldValue === 'N') {
		    			Ext.getCmp('fieldNId').setValue(true);
		    		}
		    	}
		    }
		});
		win.show();
	}
	
	ns.editLinkNumberWin = function(node) {
		alert();
		var linkWin = Ext.getCmp('linkNumberWinId');
		if (linkWin) {
			return linkWin;
		}
		
		var targetField = node.raw.name;
		var targetValue = node.raw.defaultValue;
		if (Ext.isEmpty(targetValue)) {
			targetValue = 1;
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
		            layout:'hbox',
		            items:[{
		                xtype: 'container',
		                flex: 5,
		                border:false,
		                layout: 'anchor',
		                items: [{
		                	id: '_targetFieldId',
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
		                	id: '_targetNId',
		                	xtype: 'checkbox',
		    	            name: 'targetN',
		    	            hidden: true,
		    	            allowBlank: false,
		    	            boxLabel: 'N',
		    	            listeners: {
		    	            	change : function(t, newValue, oldValue, eOpts){
		    	            		if (newValue) {
		    	            			Ext.getCmp('_targetFieldId').setReadOnly(true);
		    	            		} else {
		    	            			Ext.getCmp('_targetFieldId').setReadOnly(false);
		    	            			Ext.getCmp('_targetFieldId').setValue(1);
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
	            	var targetFieldValue = Ext.getCmp('_targetFieldId').getValue();
	            	var targetN = Ext.getCmp('_targetNId').getValue();
	            	var temp = '';
	            	if (targetN) {
	            		temp = 'N';
	            	} else {
	            		temp = targetFieldValue;
	            	}
	            	
	            	var checks = Ext.getCmp('targetTreePanelId').getChecked();
	        		var firstCheck = checks[0];
	        		var firstDefaultValue = firstCheck.getData().defaultValue;
	        		if (firstDefaultValue === 0 || Ext.isEmpty(firstDefaultValue)) {
	        			firstCheck = checks[1];
	        			firstDefaultValue = firstCheck.getData().defaultValue;
	        		}
	        		
	        		if (temp >= firstDefaultValue) {
	        			temp = firstDefaultValue;
	        		} 
	        		node.set('defaultValue', temp);
    				node.commit();
    				
    				if (Number(firstDefaultValue) - temp === 0) {
    					firstCheck.set('checked', false);
    					firstCheck.set('defaultValue', '');
    				} else {
    					firstCheck.set('defaultValue', Number(firstDefaultValue) - temp);
    				}
    				firstCheck.commit();
	            	
	                Ext.getCmp('linkNumberWinId').close();
	            }
	        }],
	        buttonAlign: 'center'
		});
		
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			id: 'linkNumberWinId',
		    title: 'Properties',
		    width: 400,
		    height: 250,
		    layout: 'fit',
		    modal : true,
		    resizable: false,
		    items: [linkForm],
		    listeners: {
		    	beforeshow : function(t, eopts) {
		    		if (targetValue === 'N') {
		    			Ext.getCmp('_targetNId').setValue(true);
		    		}
		    	}
		    }
		});
		win.show();
	}
	
	ns.editLinkWin = function(grid, fn, args, isUp, namespace) {
		var linkWin = Ext.getCmp('linkWinId');
		if (linkWin) {
			return linkWin;
		}
		
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
			console.log('_adjust', _adjust);
			if (!_adjust) {
				Notification.showNotification("Cann't update the relation!");
				return;
			}
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
		    	            		} else {
		    	            			Ext.getCmp('targetFieldId').setReadOnly(false);
		    	            			Ext.getCmp('targetFieldId').setValue(1);
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
	            			console.log('update map relation!', sourceValue, ns.convertN2Number(temp));
	            			namespace.nodesMap.adjustRatio(_tempSource, _tempTarget, sourceValue, ns.convertN2Number(temp));
	            		}
	            		
       	            	if (fn) {
       	            		fn(datas);
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
			            	};
		            	if (callbackFn) {
		            		callbackFn(datas);
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
	
	/**
	 * property handler function
	 */
	
	ns.propertyWinHandler1 = function(datas) {
		Ext.getCmp('equipmentRelationProperties').getStore().loadData(datas);
		ns.updateSelectProperty(Ext.getCmp('equipmentRelationProperties').getStore(), ns);
	}
	
	ns.propertyWinHandler2 = function(datas) {
		Ext.getCmp('etRelationProperties').getStore().loadData(datas);
		ns.updateSelectProperty(Ext.getCmp('etRelationProperties').getStore(), svgC);
	}
	
	/**
	 * link handler function
	 */
	ns.linkWinHandler1 = function(datas) {
//		if (datas.length !== 2) {
//			return ;
//		}
//		var sourceValue = datas[0].defaultValue;
//		var targetValue = datas[1].defaultValue;
//		
//		var sourceSN = datas[0].id;
//		var targetSN = datas[1].id;
//		var _tempSource = ns.nodesMap.getNode(sourceSN);
//		var _tempTarget = ns.nodesMap.getNode(targetSN);
//		if (_tempSource && _tempTarget) {
//			console.log('update map relation!', sourceValue, ns.convertN2Number(targetValue));
//			ns.nodesMap.adjustRatio(_tempSource, _tempTarget, sourceValue, ns.convertN2Number(targetValue));
//		}
		
		Ext.getCmp('equipmentRelationProperties').getStore().loadData(datas);
    	ns.updateSelectProperty(Ext.getCmp('equipmentRelationProperties').getStore(), ns);
	}
	
	ns.linkWinHandler2 = function(datas) {
		Ext.getCmp('etRelationProperties').getStore().loadData(datas);
    	ns.updateSelectProperty(Ext.getCmp('etRelationProperties').getStore(), svgC);
	}
	
	ns.editPropertyWin = function(grid, fn) {
		var propertyWin = Ext.getCmp('propertyId');
		if (propertyWin) {
			return propertyWin;
		}
		var store = grid.getStore();
		var tmpDatas = [];
		var lockDatas = [];
		for(var i = 0, len=store.getCount(); i<len; i++){
			var _data = store.getAt(i).data;
			if (_data.isLock 
					|| _data.isParentLock
					|| _data.name === 'Capex'
					|| _data.name === 'Opex') {
				lockDatas.push(_data);
		    } else {
		    	tmpDatas.push(_data);    
		    }
		}
		if (tmpDatas.length == 0) {
			return;
		}
		
		var win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
			id: 'propertyId',
		    title: 'Properties',
		    height: 400,
		    width: 400,
		    layout: 'fit',
		    modal : true,
		    resizable: false,
		    items: {
				xtype: 'equipmentform',
				id: 'proForm',
				height: 300,
				buttonAlign: 'center',
				fieldDefaults: {
                    labelAlign: 'right'
                },
                property: tmpDatas,
                listeners : {
                	buttoncallback:function(datas){
                		if (fn) {
                			for (var i=0, len=lockDatas.length; i<len; i++) {
                				var temp = lockDatas[i];
                				datas.splice(i, 0, temp);
                			}
                			fn(datas);
                		}
                		win.close();
                	}
                }
			
		    }
		});
		win.show();
	}
	
	ns.updateTypeFinishFn2 = function() {
	}
	
	ns.nodeUpdateTypeFinishFn = function() {
		 var proGrid = Ext.getCmp('etRelationProperties');
    	 var currentNode = proGrid.currentNode;
		 var oldSourceId = currentNode.id;
		 var oldSGenicTypeId = currentNode.genicTypeId;
		 var treePanelId = Ext.getCmp('treePanelId');
		 var sChecked = treePanelId.getChecked();
		 
		 if(sChecked.length > 0) {
			 var isChange = false;
			 var newSource = sChecked[0].raw;
			 if (newSource.genicTypeId != oldSGenicTypeId) {
				 var tempMap;
				 if (currentNode._isNew) {
					 tempMap = svgC.relationMap[oldSourceId];
				 }
				 
				 newSource.id = newSource.currentId;
				 newSource.serialNumber = currentNode.serialNumber;
				 var lockProperties = ns.getLockProperties(currentNode.properties);
				 ns.createNode(newSource, currentNode.x, currentNode.y, svgC, lockProperties);
				 var newNode = ns.getNodeById(newSource.currentId, svgC);
				 newNode.oringnalId = currentNode.oringnalId;
				 newNode._isNew = true;
				 ns.replaceNodes(svgC, currentNode, newNode);
				 svgC.current_selected_node = newNode;
				 svgC.selected_nodes.push(newNode);
				 
				 var tempObj = {};
				 if (tempMap) {
					 tempObj.id = tempMap.id;
				 } else {
					 tempObj.id = oldSourceId;
				 }
				 tempObj.tempGenicTypeId = newSource.genicTypeId;
				 if (!svgC.relationMap) {
					 svgC.relationMap = {};
				 }
				 svgC.relationMap[newSource.id] = tempObj;
				 isChange = true;
			 }
			 if (isChange) {
				 Ext.getCmp('etRelationProperties').currentNode = svgC.current_selected_node;
				 svgC.nodeItemClick();
				 DigiCompass.Web.app.svg.redraw(svgC);
			 }
		 }
		 Ext.getCmp('nodeUpdateTypeWinId').close();
	 }
	
	 ns.createSingleUpdateTypeWin = function() {
			var updateTypeWin = Ext.getCmp('singleUpdateTypeWinId'); 
			if (updateTypeWin) {
//				 init data
			} else {
				var targetStore = Ext.create('Ext.data.TreeStore', {
			    	fields: ['name', 'defaultValue'],
			        root: {},
			        folderSort: true
			    });
				
				var targetTreePanel = Ext.create('Ext.tree.Panel', {
//			        title : 'Equipment Type',
			        id : 'targetTreePanelId',
			        margin : '0px 0px 0px 5px',
			        width: 600,
			        height: 500,
			        autoScroll: true,
			        region: 'center',
			        rootVisible: false,
			        border: false,
			        store: targetStore,
			        columns: [{
			            xtype: 'treecolumn', 
			            text: 'Name',
			            flex: 1,
			            sortable: false,
			            dataIndex: 'name'
			        }, {
			        	text: 'Value',
			        	sortable: false,
			        	flex: 1,
			        	dataIndex: 'defaultValue'
			        }],
			        listeners: {
			        	checkchange : function(node, checked, eOpts) {
			        		var raw = node.raw;
			        		var checks = Ext.getCmp('targetTreePanelId').getChecked();
			        		if (checks.length <= 0) {
			        			DigiCompass.Web.TreeUtil.checkChange(node, true);
			        			return;
			        		}
			        		var firstCheck = checks[0];
			        		var firstDefaultValue = firstCheck.getData().defaultValue;
			        		if (!checked) {
			        			var _tempValue = node.getData().defaultValue;
		        				node.set('defaultValue', '');
		        				node.commit();
		        				
		        				firstCheck.set('defaultValue', Number(firstDefaultValue) + Number(_tempValue));
		        				firstCheck.commit();
			        		} else {
				        		ns.editLinkNumberWin(node);
			        		}
			        	}
			        }
			    });
//				
				var okBtn = Ext.create('Ext.button.Button', {
					text: 'Finish',
				    handler: ns.updateTypeFinishFn2
				});
				
//				var container = Ext.create('Ext.container.Container', {
//					id: 'containerId',
//					flex: 5,
//					width: '100%',
//					region: 'center',
//					layout: 'border',
//					margin :'5px 5px 5px 5px',
//					items: [sourceTreePanel, targetTreePanel]
//				});
				
				updateTypeWin = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
					id: 'updateTypeWinId',
					title: 'Equipment Type',
					resizable: false,
					modal : true,
					layout: 'hbox',
					width: 600,
					height: 500,
					tbar: [okBtn],
					items: [targetTreePanel]
				});
			}
			updateTypeWin.show();
	 }
	
	 ns.createNodeUpdateTypeWin = function() {
			var win = Ext.getCmp('nodeUpdateTypeWinId'); 
			if (win) {
				return win; 
			}
			var sourceStore = Ext.create('Ext.data.TreeStore', {
		    	fields: ['name'],
		        root: {},
		        folderSort: true
		    });
			var sourceTreePanel = Ext.create('Ext.tree.Panel', {
		        id : 'treePanelId',
//		        margin : '0px 0px 0px 5px',
		        width: 400,
		        height: 500,
		        autoScroll: true,
		        region: 'west',
		        rootVisible: false,
		        border: false,
		        store: sourceStore,
		        columns: [{
		            xtype: 'treecolumn', 
		            text: 'Name',
		            flex: 1,
		            sortable: false,
		            dataIndex: 'name'
		        }],
		        listeners: {
		        	checkchange : function(node, checked, eOpts) {
		        	    var raw = node.raw;
		        	    var currentId = raw.currentId;
		        	    var temp = Ext.getCmp('treePanelId').getChecked();
		        	    if (temp.length <= 1) {
		        	    	DigiCompass.Web.TreeUtil.checkChange(node, true);
		        	    } else {
		        	    	for (var i=0, len=temp.length; i<len; i++) {
		        	    		var checkNode = temp[i];
		        	    		if (checkNode.raw.currentId !== currentId) {
		        	    			DigiCompass.Web.TreeUtil.checkChange(checkNode, false);
		        	    		}
		        	    	}
		        	    }
		        	}
		        }
		    });
			
			var okBtn = Ext.create('Ext.button.Button', {
				text: 'Finish',
			    handler: ns.nodeUpdateTypeFinishFn
			});
			
			win = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
				id: 'nodeUpdateTypeWinId',
				title: 'Equipment Type',
				resizable: false,
				modal : true,
				layout: 'fit',
				width: 400,
				height: 500,
				tbar: [okBtn],
				items: [sourceTreePanel]
			});
			win.show();
	 }
	 
	ns.createHasNoParentContainer = function() {
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
	        title : 'Equipment Type',
	        id : 'equipmentTypeTree',
	        margin : '0px 0px 0px 5px',
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
	        }]
	    });
		
		var svgDiv = '<div id="equipmentRelationSvgDiv" style="height: 550px;margin: 5px 5px 0px 5px;border: 1px solid gray;"></div>';
		
		var equipmentRelationSvg = Ext.create('Ext.panel.Panel', {
			id: 'equipmentRelationSvg',
			title: 'Equipment Relation',
			margin : '0px 0px 0px 5px',
			width: 600,
			region: 'west',
			html: svgDiv
		});
		
		var propertyStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'defaultValue', 'id', 'optional', 'requirement', 'type', 'list', 'multiple', 'isLock', 'isParentLock', 'systemProperty'],
		    data: [],
		    listeners:{
				update : function(store) {
					ns.updateSelectProperty(store, ns);
				}
			}
		 });
		 
		var equipmentRelationProperties = Ext.create('Ext.grid.Panel', {
	    	id : 'equipmentRelationProperties',
			title : 'Equipment Relation Properties',
			margin : '0px 0px 0px 5px',
			region : 'center',
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
					
					if (record.raw.isParentLock) {
						cls.push('self_define_checked');
					} else {
						if (value) {
				            cls.push(cssPrefix + 'grid-checkheader-checked');
				        }
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
					
					if(dataIndex === 'defaultValue' && record.raw.systemProperty){
						ns.inputNumberWindow(record.raw.name, record.data.defaultValue, function(v){
							record.data['defaultValue'] = v;
							record.commit();
						});
						return;
					}
					
					var handlerType = Ext.getCmp('equipmentRelationProperties')[ns.HANDLER_TYPE];
					if (handlerType === ns.HANDLER_TYPE_NODE) {
						ns.editPropertyWin(grid, ns.propertyWinHandler1);
					} else if(handlerType === ns.HANDLER_TYPE_LINK) {
						ns.editLinkWin(grid, ns.linkWinHandler1, null, null, ns);
					}
					
				},
				itemmouseenter: function(view, record, item, rowIndex, e, eOpts ) {
					console.log('enter');
				},
	            itemmouseleave: function(view, record, item, rowIndex, e, eOpts ) {
	            	console.log('leave');
	            }
			}
		});
		
		var capexStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'amount', 'id', 'capex', 'opex', 'cost'],
		    data: []
		});
		 
		var capexProperties = Ext.create('Ext.grid.Panel', {
	    	id : 'capexPropertiesId',
			title : 'Equipment Template Cost',
			margin : '0px 0px 0px 5px',
			region : 'center',
			selType : 'rowmodel',
			store: capexStore,
			columns:[{
					header : 'Name',
					dataIndex : 'name',
					flex : 1
				},{
					header : 'Amount',
					dataIndex : 'amount',
					flex : 1
				},{
					header : 'Capex',
					dataIndex : 'capex',
					flex : 1
				},{
					header : 'Opex',
					dataIndex : 'opex',
					flex : 1
				},{
					header : 'Cost',
					dataIndex : 'cost',
					flex : 1
				}
			]
		});
		
		var newParentContainer = Ext.create('Ext.container.Container', {
			id: 'newParentContainerId',
			flex: 5,
			width: '100%',
			region: 'center',
			layout: 'border',
			margin :'5px 5px 5px 5px',
			items:[equipmentType, equipmentRelationSvg, equipmentRelationProperties, capexProperties]
		});
		return newParentContainer;
	}
	
	ns.inputNumberWindow = function(name, defaultValue, callback) {
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'equipmentTypeAdd',
			defaultType : 'textfield',
			border : false,
			width : '100%',
			frame : false,
			height : 'fit',
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 70	
			},
			items : [{
						id 		   : 'defaultValueId',
						xtype      : 'numberfield',
						margin 	   : '10px 5px 10px 10px',
						allowBlank : false,
						emptyText  : 'Please input data!',
						fieldLabel : name,
						maxLength  : UiProperties.nameMaxLength,
						minValue   : 1,
						maxValue   : 10000000000,
						width	   : 300,
						msgTarget  : 'side',
						name 	   : 'defaultValue',
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
		
		var propertyWin = Ext.create('DigiCompass.Web.app.AutosizeWindow',{
			id: 'defaultValueWinId',
			width  : 400,
			height : 200,
			modal : true,
			layout : 'fit',
			title  : 'DefaultValueInput',
			items  : [formPanel]
		});
		propertyWin.show();
	}
	
	ns.createHasParentContainer = function() {
		var hasParentContainer = Ext.getCmp('hasParentContainerId');
		if (hasParentContainer) {
			return hasParentContainer;
		}
		var etParentSvgDiv = '<div id="etParentSvgDiv" style="height: 550px;margin: 5px 5px 0px 5px;border: 1px solid gray;"></div>';
		var etParentSvg = Ext.create('Ext.panel.Panel', {
			id: 'etParentSvg',
			title: 'Equipment Template',
			margin : '0px 0px 0px 5px',
			width: 380,
			region: 'west',
//			collapsible: true,
			html: etParentSvgDiv
		});
		
		var etCurrentSvgDiv = '<div id="etCurrentSvgDiv" style="height: 550px;margin: 5px 5px 0px 5px;border: 1px solid gray;"></div>';
		var etCurrentSvg = Ext.create('Ext.panel.Panel', {
			id: 'etCurrentSvg',
			title: 'Equipment Template',
			margin : '0px 0px 0px 5px',
			width: 500,
			region: 'west',
			html: etCurrentSvgDiv
		});
		
		var etPropertyStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'defaultValue', 'id', 'optional', 'requirement', 'type', 'list', 'multiple', 'isLock', 'isParentLock', 'systemProperty'],
		    data: [],
		    listeners:{
				update : function(store) {
					ns.updateSelectProperty(store, svgC);
				}
			}
		 });
		
		var updateType = Ext.create('Ext.button.Button', {
			id: 'updateTypeId',
//			hidden: true,
			text: 'UpdateType',
		    handler: function() {
//		    	var proGrid = Ext.getCmp('etRelationProperties');
//		    	var currentNode = proGrid.currentNode;
//		    	
//		    	if (currentNode.relationValue.toString().indexOf('N') !== -1) {
//		    		Notification.showNotification("Cann't update current type!");
//		    		return;
//		    	}
//		    	
//		    	var handlerType = proGrid[ns.HANDLER_TYPE];
//		    	if (handlerType === ns.HANDLER_TYPE_NODE) {
//		    		ns.createSingleUpdateTypeWin();
//		    		var args = {
//	    				id: currentNode.id,
//	    				parentId: svgA.selectedItem.currentId
//	    				,
////	    				HANDLER_TYPE: 'source',
//	    				_isNew: currentNode.genicTypeId,
//	    				_defaultValue: currentNode.relationValue
//	    			};
//	    			DigiCompass.Web.UI.CometdPublish.equipmentTypeTreePublish(args);
//		    	}
		    	
		    	var proGrid = Ext.getCmp('etRelationProperties');
		    	var currentNode = proGrid.currentNode;
		    	
		    	var handlerType = proGrid[ns.HANDLER_TYPE];
		    	if (handlerType === ns.HANDLER_TYPE_NODE) {
		    		var sTempId = null, 
						sTempGenicTypeId = null;
					
					if (!currentNode._isNew) {
						sTempId = currentNode.id;
						sTempGenicTypeId = currentNode.genicTypeId;
					} else {
						var temp = svgC.relationMap[currentNode.id];
						if (temp) {
							sTempId = temp.id;
							sTempGenicTypeId = temp.tempGenicTypeId;
						}
					}
		    		ns.createNodeUpdateTypeWin();
		    		var args = {
		    				id: sTempId,
		    				parentId: svgA.selectedItem.currentId,
		    				_isNew: sTempGenicTypeId
		    		};
//		    		var args = {
//	    				id: currentNode.id,
//	    				parentId: svgA.selectedItem.currentId,
//	    				_isNew: currentNode.genicTypeId
//	    			};
	    			DigiCompass.Web.UI.CometdPublish.equipmentTypeTreePublish(args);
		    	}
		    	
		    	
		    }
		});
		
		var etRelationProperties = Ext.create('Ext.grid.Panel', {
	    	id : 'etRelationProperties',
			title : 'Equipment Relation Properties',
			margin : '0px 0px 0px 5px',
			region : 'center',
			selType : 'cellmodel',
			store: etPropertyStore,
			tbar: [updateType],
			columns:[{
				header : 'Name',
				dataIndex : 'name',
				flex : 1
			},{
				header : 'Value',
				dataIndex : 'defaultValue',
				flex : 1
			},{
			    id: 'etLockHeaderId',
			    xtype: 'checkcolumn',
				header: 'Lock',
				dataIndex: 'isLock',
				flex: 1,
				renderer: function(value, td, record, rowIndex, cIndex){
					if (record.raw.name === 'Capex' || record.raw.name === 'Opex') {
						return '';
					}
					
					var cssPrefix = Ext.baseCSSPrefix,
			            cls = [cssPrefix + 'grid-checkheader'];
					
					if (record.raw.isParentLock) {
						cls.push('self_define_checked');
					} else {
						if (value) {
				            cls.push(cssPrefix + 'grid-checkheader-checked');
				        }
					}
					return '<div class="' + cls.join(' ') + '">&#160;</div>';
			    }
			}],
			listeners : {
				cellclick : function(grid, cellElement, columnNum, record,
					rowElement, rowNum, e) {
					var dataIndex = grid.getHeaderCt().getHeaderAtIndex(columnNum).dataIndex;
					if (dataIndex !== 'defaultValue') {
						return;
					}
					
					if(dataIndex === 'defaultValue' && record.raw.systemProperty){
						ns.inputNumberWindow(record.raw.name, record.data.defaultValue, function(v){
							record.data['defaultValue'] = v;
							record.commit();
						});
						return;
					}
					
					var handlerType = Ext.getCmp('etRelationProperties')[ns.HANDLER_TYPE];
					if (handlerType === ns.HANDLER_TYPE_NODE) {
						ns.editPropertyWin(grid, ns.propertyWinHandler2);
					} else if(handlerType === ns.HANDLER_TYPE_LINK) {
						ns.editLinkWin(grid, ns.linkWinHandler2, null, null, svgC);
					}
					
				}
			}
		});
		
		var capexStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'amount', 'id', 'capex', 'opex', 'cost'],
		    data: []
		});
		 
		var capexProperties = Ext.create('Ext.grid.Panel', {
	    	id : 'capexPropertiesId2',
			title : 'Equipment Template Cost',
			margin : '0px 0px 0px 5px',
			region : 'center',
			selType : 'rowmodel',
			store: capexStore,
			columns:[{
					header : 'Name',
					dataIndex : 'name',
					flex : 1
				},{
					header : 'Amount',
					dataIndex : 'amount',
					flex : 1
				},{
					header : 'Capex',
					dataIndex : 'capex',
					flex : 1
				},{
					header : 'Opex',
					dataIndex : 'opex',
					flex : 1
				},{
					header : 'Cost',
					dataIndex : 'cost',
					flex : 1
				}
			]
		});
		
		hasParentContainer = Ext.create('Ext.container.Container', {
			id: 'hasParentContainerId',
			flex: 5,
			width: '100%',
			region: 'center',
			layout: 'border',
			margin :'5px 5px 5px 5px',
			items:[etParentSvg, etCurrentSvg, etRelationProperties, capexProperties]
		});
		return hasParentContainer;
	}
	
	ns.derivedFormFinish = function() {
		var selectedNodes = svgA.selected_nodes;
    	var selectedItem = svgA.selectedItem;
    	if (selectedItem && selectedNodes.length === 0) {
    		Notification.showNotification('Please select a node!');
			return;
    	}
    	
    	if (selectedItem || selectedNodes.length > 0) {
    		var links = svgA.links;
        	if (!ns.checkLinksFromSelectedNodes(selectedNodes, links)) {
    			Notification.showNotification('Invalid node!');
    			return;
    		}
        	
    		ns.changeContainer(true);
//    		// disable field
//    		Ext.getCmp('equipmentType').setVisible(false);
    		// init value
    		Ext.getCmp('derivedFromId').setValue(selectedItem.name);
//    		// change container
//    		var hasParentContainer = Ext.getCmp('hasParentContainerId');
//    		if (!hasParentContainer) {
//    			hasParentContainer = ns.createHasParentContainer();
//    		}
//    		Ext.getCmp('centerContainerId').add(hasParentContainer);
    		ns.clearHasParentCenterData();
    		// init svg data
    		ns.initParentContainerSvg();
    		ns.initCurrentContainerSvg();
    	} else {
    		ns.changeContainer(false);
//    		// enable field
//    		Ext.getCmp('equipmentType').setVisible(true);
//    		// init value
//    		Ext.getCmp('derivedFromId').setValue();
//    		var newParentContainer = Ext.getCmp('newParentContainerId');
//    		Ext.getCmp('centerContainerId').add(newParentContainer);
//    		// clear data
    	}
    	Ext.getCmp('derivedFormWinId').hide();
	}
	
	ns.derivedFormFinishCallback = function(callback) {
		var raw = Ext.getCmp('deriedFormPanelId').currentRaw;
		if (!raw) {
			Notification.showNotification('Please select a template!');
			return;
		}
		var currentId = raw.currentId;
		if (raw.certain) {
			Ext.getCmp('derivedFormWinId').hide();
			// TODO
			if (callback) {
				callback(currentId);
			}
			console.log('currentId = ' + currentId);
		} else {
			var selectedNodes = svgA.selected_nodes;
	    	if (selectedNodes.length === 0) {
	    		Notification.showNotification('Please select a node!');
				return;
	    	}
	    	var links = svgA.links;
        	if (!ns.checkLinksFromSelectedNodes(selectedNodes, links)) {
    			Notification.showNotification('Invalid node!');
    			return;
    		}
        	Ext.getCmp('derivedFormWinId').hide();
        	ns.createEquipmentTemplateWin();
        	Ext.getCmp('derivedFromId').setValue(raw.name);
        	ns.changeContainer(true);
        	ns.clearHasParentCenterData();
    		ns.initParentContainerSvg();
    		ns.initCurrentContainerSvg();
		}
	}
	
	ns.derivedFormWin = function(args, itemClickCallback, finishCallback, callback) {
//		var id = args.id;
		
		var deFormWin = Ext.getCmp('derivedFormWinId'); 
		if (deFormWin) {
//			 init data
		} else {
			var deriedFormStore = Ext.create('Ext.data.TreeStore', {
		    	fields: [ 'currentId', 'name', 'property'],
		        root: {},
		        folderSort: true
		    });
			
			var deriedFormPanel = Ext.create('Ext.tree.Panel', {
		        title : 'Equipment Template',
		        id : 'deriedFormPanelId',
//		        margin : '0px 0px 0px 5px',
		        width: 200,
		        height: 500,
		        autoScroll: true,
//		        region: 'west',
//		        collapsible: true,
		        rootVisible: false,
		        store: deriedFormStore,
		        columns: [{
		            xtype: 'treecolumn', 
		            text: 'Name',
		            flex: 2,
		            sortable: false,
		            dataIndex: 'name'
		        }],
		        listeners: {
//		        	itemclick : ns.equipmentTemplateTreeClickFunction
		        	itemclick : function(current, record, item, index, e, eOpts) {
//		        		if (itemClickCallback) {
//		        			itemClickCallback();
//		        		}
		        		ns.equipmentTemplateTreeClickFunction(current, record, item, index, e, eOpts);
		        		Ext.getCmp('deriedFormPanelId').currentRaw = record.raw;
		        	}
		        }
		    });
			
			var derivedFormSvgDiv = '<div id="derivedFormSvgDiv" style="height: 470px;margin: 5px 5px 0px 5px;border: 1px solid gray;"></div>';
			
			var derivedFormSvg = Ext.create('Ext.panel.Panel', {
				id: 'derivedFormSvgId',
				title: 'Equipment Template',
				margin : '0px 0px 0px 5px',
//				region: 'center',
				width: 600,
				height: 500,
				html: derivedFormSvgDiv
			});
			
			var okBtn = Ext.create('Ext.button.Button', {
				text: 'Finish',
			    handler: function(){
			    	var deFormWin = Ext.getCmp('derivedFormWinId');
			    	if (finishCallback) {
			    		deFormWin.finishCallback(deFormWin.callback);
			    	}
			    }
			});
			
			var clearBtn = Ext.create('Ext.button.Button', {
				text: 'Clear',
			    handler: function() {
			    	svgA.selectedItem = null;
			    	ns.clearSvg(svgA);
			    	DigiCompass.Web.UI.CometdPublish.equipmentTemplateTreePublish();
			    	
			    	Ext.getCmp('deriedFormPanelId').currentRaw = null;
			    }
			});
			
			deFormWin = Ext.create('DigiCompass.Web.app.AutosizeWindow', {
				id: 'derivedFormWinId',
				title: 'Equipment Template',
				resizable: false,
				modal : true,
//				layout: 'border',
				tbar: [okBtn, clearBtn],
				items: [{
	                xtype: 'container',
	                border:false,
	                margin: '5px 5px 5px 5px',
	                layout: 'hbox',
	                items: [deriedFormPanel, derivedFormSvg]
				}],
				listeners: {
					afterlayout : function(){
						ns.initializeSvgA();
					}
				}
			});
		}
		deFormWin.callback = callback;
		deFormWin.finishCallback = finishCallback;
		deFormWin.show();
	}
	
	ns.addFormPanel = function(id, hasParent){
		var saveBtn = Ext.create('Ext.Button', {
			id: 'saveBtnId',
			text: 'Save',
			iconCls : 'icon-save',
			handler : function(){
				/**
				 * check data
				 */
				var equipmentRelationName = Ext.getCmp('equipmentRelationName');
				if(!equipmentRelationName.isValid()){
					return;
				}
				var equipmentRelationDes = Ext.getCmp('equipmentRelationDes');
				if (!equipmentRelationDes.isValid()) {
					return;
				}
				var derivedFromValue = Ext.getCmp('derivedFromId').getValue();
				if (Ext.isEmpty(derivedFromValue)) {
					var equipmentType = Ext.getCmp('equipmentType');
					if(!equipmentType.isValid()){
						return;
					}
					if(ns.links.length === 0){
						Notification.showNotification('Equipment relation is null!');
						return;
					}
				}
				
				/**
				 * save data
				 */
				var formPanel = Ext.getCmp('equipmentRelationAdd');
				var _formData = formPanel.getForm().getValues();
				var formData = {
					id : _formData.id,
					name : _formData.name,
					description : _formData.description
				};
				if (Ext.isEmpty(derivedFromValue)) {
					formData.groupId = Ext.getCmp('equipmentType').getValue();
					formData.relation = ns.createRelation(ns);
				} else {
					formData.parentId = svgA.selectedItem.currentId;
					formData.selectedNodes = svgA.selected_nodes;
					formData.relation = ns.createRelation(svgC);
				}
				
				formData.MODULE_TYPE = 'MOD_EQUIPMENT_RELATION';
				formData.COMMAND = 'COMMAND_SAVE';
				cometdfn.publish(formData);
				
				/**
				 * disable save button
				 */
//				Ext.getCmp('saveBtnId').setDisabled(true);
			}
		});
		
		var formPanel = Ext.create('Ext.form.Panel', {
			id : 'equipmentRelationAdd',
			defaultType : 'textfield',
			title: UiFunction.getTitle('Equipment Relation'),
			border : false,
			width : '100%',
			frame : false,
			fieldDefaults : {
				labelAlign : 'left',
				msgTarget : 'side',
				labelWidth : 140	
			},
			tbar: [saveBtn],
			items : [{
						id : 'equipmentRelationId',
						xtype : 'hidden',
						name : 'id'
					},{
						id 		   : 'equipmentRelationName',
						margin 	   : '10px 5px 10px 10px',
						allowBlank : false,
						emptyText  : 'Please input data!',
						fieldLabel : 'Name',
						maxLength  : UiProperties.nameMaxLength,
						width	   : 500,
						msgTarget  : 'side',
						name 	   : 'name'
					},{
						id 		   : 'equipmentRelationDes',
						margin 	   : '10px 5px 10px 10px',
						emptyText  : 'Please input data!',
						fieldLabel : 'Description ',
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
		                	id: 'derivedFromId',
		                	xtype: 'textfield',
		                    fieldLabel: 'Derived From',
		                    name: 'derivedFrom',
		    	            readOnly: true,
		    	            width: 500
		                },{
		                	id: 'selectedId',
		                	xtype: 'button',
		                	margin: '0 0 0 5px',
		                	text: 'Select',
		                	listeners: {
		                		click : function(c, e, eOpts) {
		                			ns.derivedFormWin(null, ns.equipmentTemplateTreeClickFunction, ns.derivedFormFinish);
		                			DigiCompass.Web.UI.CometdPublish.equipmentTemplateTreePublish();
		                		}
		                	}
		                }]
		            
					},{
						id			 : 'equipmentType',
						margin 		 : '10px 5px 10px 10px',
						xtype		 : 'combo',
						fieldLabel 	 : 'Equipment Type',
						allowBlank 	 : false,
						width 		 : 500,
						displayField : 'name',
						valueField	 : 'id',
						editable	 : false,
						store	 	 : {
							fields : ['id','name'],
							data   : ns.comboData
						},
						listeners : {
							change : function(){
								if(Ext.isEmpty(this.value)){
									return;
								}
								cometdfn.publish({
									MODULE_TYPE : 'MOD_EQUIPMENT_RELATION',
									COMMAND : 'COMMAND_QUERY_ALL_TREE',
									id : this.value
								});
								// clear data
								ns.clearCenterData();
							}
						}
					}]
			});
		
		
		var container = null;
		if (hasParent) {
			container = ns.createHasParentContainer();
		} else {
			container = ns.createHasNoParentContainer();
		}
		
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
	
	ns.updateSelectProperty = function(store, namespace) {
		if (!namespace) {
			namespace = ns;
		}
		var focusNode = namespace.current_selected_node;
		var focusLink = namespace.current_selected_link;
		if(Ext.isEmpty(focusNode) && Ext.isEmpty(focusLink)){
			Notification.showNotification('Please select a record!');
			return;
		}
		if(Ext.isEmpty(focusNode)){
			ns.changeProperties(store, focusLink, false, namespace);
		}else{
			ns.changeProperties(store, focusNode, true, namespace);
		}
	}
	
	ns.changeProperties = function(store, focusedNode, isNode, namespace){
		if(Ext.isEmpty(focusedNode)){
			return;
		}
		var tmpDatas = [];
		for(var i = 0, len=store.getCount(); i<len; i++){
			tmpDatas.push(store.getAt(i).data);
		}
		if(isNode){
			namespace.current_selected_node.properties = tmpDatas;
		}else{
			var index = namespace.links.indexOf(namespace.current_selected_link);
			namespace.links[index].properties = tmpDatas;
			
//			namespace.links[namespace.links.indexOf(namespace.current_selected_link)].properties = tmpDatas;
			DigiCompass.Web.app.svg.redraw(namespace);
		}
	}
	
	/**
	 * CometD Data Handler 
	 */
	ns.loadComboData = function(data){
		var comboData = data.BUSINESS_DATA.comboList;
		ns.comboData = Ext.decode(comboData);
	}
	
	ns.saveSuccess = function(data){
		 if(data.STATUS == 'success'){
			Notification.showNotification('Sava successfully!');
			var win = Ext.getCmp('equipmentTemplateWinId');
			if (win) {
				win.close();
			} else {
				var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
				DigiCompass.Web.UI.CometdPublish.equipmentRelationPublish(queryParam);
				Ext.getCmp('obj-details').removeAll();
			}
		} else if(data.customException){
			alertError(data.customException);
		}
	}
	
	ns.delSuccess = function(data){
		 if(data.STATUS == 'success'){
			Notification.showNotification('Delete Successfully!');
			var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
			DigiCompass.Web.UI.CometdPublish.equipmentRelationPublish(queryParam);
			Ext.getCmp('obj-details').removeAll();
		} else if(data.customException){
			Notification.showNotification(data.customException);
		}
	}
	
	ns.loadEquipmentData = function(data){
		
//		var addDataParam = function(obj){
//			obj._data = [obj];
//			if(obj.children){
//				for(var i = 0 ; i<obj.children.length; i++){
//					addDataParam(obj.children[i]);
//				}
//			}
//		}
		
		var equipmentTypeTree = Ext.getCmp('equipmentTypeTree');
		if(equipmentTypeTree){
			var treeData = data.BUSINESS_DATA.list;
			treeData = Ext.decode(treeData);
			//addDataParam(treeData);  //临时试验调试用。
			equipmentTypeTree.setRootNode(treeData);
		}
	}
	
	
	
	ns.loadTemplateTree = function(data) {
		var deriedFormPanel = Ext.getCmp('deriedFormPanelId');
		if(deriedFormPanel){
			var treeData = data.BUSINESS_DATA.list;
			treeData = Ext.decode(treeData);
			var root = {
		        expanded: true,
		        children: treeData
		    };
			deriedFormPanel.setRootNode(root);
		}
	}
	
	ns.loadTypeTree = function(data) {
		var treeData = data.BUSINESS_DATA.list;
		treeData = Ext.decode(treeData);
		// add checked
		DigiCompass.Web.TreeUtil.addChecked(treeData, data._isNew);
		var root = {
	        expanded: true,
	        children: treeData
	    };
//		var HANDLER_TYPE = data.HANDLER_TYPE;
//		if (HANDLER_TYPE === 'source') {
//			Ext.getCmp('sourceTreePanelId').setRootNode(root);
//		} else if (HANDLER_TYPE === 'target'){
//			Ext.getCmp('targetTreePanelId').setRootNode(root);
//		}
		
		Ext.getCmp('treePanelId').setRootNode(root);
		
//		ns.addEquipmentValue(treeData, data._isNew, data._defaultValue);
//		Ext.getCmp('targetTreePanelId').setRootNode(root);
	}
	
	ns.addEquipmentValue = function(node, id, value) {
		if (node.currentId === id) {
    		node.defaultValue = value;
    		node.checked = true;
			return;
    	}
    	var children = node.children;
    	if (!children) {
    		return;
    	}
    	var len = children.length;
		if (len > 0) {
			for (var i=0; i<len; i++) {
				ns.addEquipmentValue(children[i], id);//递归  
			}
	    }
	}
	
	/**
	 * set drop target
	 */
	
	ns.setDropTarget = function(id){
		var dropTargetEl =  Ext.get(id);
	    Ext.create('Ext.dd.DropTarget', dropTargetEl, {
	        ddGroup: 'dragDropGroup',
	        notifyEnter: function(ddSource, e, data) {
	        },
	        notifyDrop  : function(ddSource, e, data){
	        	// 图标操作区 拖放释放处理
	            // Reference the record (single selection) for readability
	            var selectedRecord = ddSource.dragData.records[0];
	            var _data = selectedRecord.raw._data;
	            
	            //for(var i=0;i<_data.length;i++){
				var raw = selectedRecord.raw;
		         //   var raw = _data[i];
					
					var id = raw.currentId;
					var properties = raw.property;
					var text = raw.name;
					var iconCls = raw.iconCls;
					
					var icon = 'task.gif';
					if (iconCls === 'drag') {
						icon = 'task.gif';
					} else if (iconCls === 'not_drag') {
						icon = 'no_task.gif';
					}
					
					var xy0 = Ext.get('equipmentRelationSvgDiv').getXY();
					var xy1 = e.getXY();
					var node = {
						serialNumber: ++ns.lastNodeId,
						x: xy1[0] - xy0[0], 
						y: xy1[1] - xy0[1], 
						text: text, 
						icon: icon,
						id: id,
						properties: properties,
						tempId: new Date().getTime()
					};
					ns.nodes.push(node);
					
					var tempMapNode = new com.digicompass.equipment.Node(node.serialNumber);
					console.log('add node to map!');
					ns.nodesMap.addNode(tempMapNode);
            	
	           // }

					
				DigiCompass.Web.app.svg.redraw(ns);
	            return true;
	        }
	    });
	}
	
	/**
	 * init svgA
	 */
	
	svgA.keydown = function() {
		// ctrl
	    if (d3.event.keyCode === 17) {
	    	svgA.node.call(svgA.force.drag);
	    	svgA.svg.classed('ctrl', true);
	    }
	}
	
	svgA.nodeMousedown = function(d) {
        if (d3.event.ctrlKey) {
        	return ;
        }
		// disable zoom
		svgA.svg.call(d3.behavior.zoom().on('zoom'), null);
		svgA.mousedown_node = d;
        
		var index = svgA.selected_nodes.indexOf(svgA.mousedown_node);
        if (index !== - 1) {
        	svgA.selected_nodes.splice(index, 1);
        	svgA.current_selected_node = null;		                
        } else {
        	svgA.current_selected_node = svgA.mousedown_node; 
        	svgA.selected_nodes.push(svgA.current_selected_node);
        }
        svgA.current_selected_link = null; 
        DigiCompass.Web.app.svg.redraw(svgA);
	}
	
	svgA.nodeMouseup = function(d, me) {
		if (!svgA.mousedown_node) {
        	return ;
		}
		// needed by FF
	    svgA.drag_line.classed('hidden', true).style('marker-end', '');
	    
		svgA.mouseup_node = d; 
        if (svgA.mouseup_node == svgA.mousedown_node) { 
        	DigiCompass.Web.app.svg.resetMouseVars(svgA); 
        	return; 
        }
        // unenlarge target node
	    d3.select(me).attr('transform', '');
	    
        // enable zoom
        svgA.svg.call(d3.behavior.zoom().on('zoom'), function(){DigiCompass.Web.app.svg.rescale(svgA);});
        DigiCompass.Web.app.svg.redraw(svgA);
	}
	
	ns.initializeSvgA = function() {
		var args = {
			width: 580,
			height: 460,
			svgId: 'derivedFormSvgDiv',
			namespace: svgA
		};
		DigiCompass.Web.app.svg.initializeSvg(args);
	}
	
	/**
	 * init ns svg
	 */
	 
	 
	ns.linkMousedown = function(d) {
		if (d3.event.ctrlKey) {
			return ;
		}
	    // select link
		ns.mousedown_link = d; 
        if (ns.mousedown_link == ns.current_selected_link) {
        	ns.current_selected_link = null;
        	Ext.getCmp('equipmentRelationProperties').getStore().loadData([]);
        } else {
        	ns.current_selected_link = ns.mousedown_link;
            ns.linkItemClick();
        } 
        ns.current_selected_node = null; 
        ns.selected_nodes = [];
        DigiCompass.Web.app.svg.redraw(ns);
        
        ns.showCapexOpex('capexPropertiesId', 'equipmentRelationProperties', ns);
	}
	
	ns.nodeMousedown = function(d) {
		if (d3.event.ctrlKey) {
        	return ;
        }
		ns.svg.call(d3.behavior.zoom().on('zoom'), null);
		
		ns.mousedown_node = d;
		var index = ns.selected_nodes.indexOf(ns.mousedown_node);
		if (index !== - 1) {
        	ns.selected_nodes = [];
        	ns.current_selected_node = null;	
        	Ext.getCmp('equipmentRelationProperties').getStore().loadData([]);
        } else {
        	ns.current_selected_node = ns.mousedown_node; 
        	ns.selected_nodes = [];
        	ns.selected_nodes.push(ns.current_selected_node);
        	ns.nodeItemClick();
        }
        ns.current_selected_link = null; 

        // reposition drag line
        var dValue = 'M' + ns.mousedown_node.x + ',' 
        				 + ns.mousedown_node.y + 'L' 
        				 + ns.mousedown_node.x + ',' 
        				 + ns.mousedown_node.y;
        ns.drag_line.style('marker-end', 'url(#end-arrow)')
        		 .classed('hidden', false)
        		 .attr('d', dValue);
        DigiCompass.Web.app.svg.redraw(ns);
        
        ns.showCapexOpex('capexPropertiesId', 'equipmentRelationProperties', ns);
	}
	
	
	ns.showCapexOpex = function(id1, id2, namespace) {
		var capexProperties = Ext.getCmp(id1);
		var equipmentRelationProperties = Ext.getCmp(id2);
		
		if (!capexProperties || !equipmentRelationProperties) {
			return;
		}
		if (namespace.selected_nodes.length === 0 && !namespace.current_selected_link) {
			capexProperties.show();
			equipmentRelationProperties.hide();

			var datas = ns.initCapexPropertiesGrid(namespace);
			capexProperties.getStore().loadData(datas);
        } else {
        	capexProperties.hide();
			equipmentRelationProperties.show();
        }
	}
	
	ns.initNodesRelation = function(namespace, node) {
		var nodes = namespace.nodesMap.getNodes();
		for (var j=0, jLen=nodes.length; j<jLen; j++) {
			var _temp = nodes[j];
			if (_temp._name === node.serialNumber) {
				node.relationValue = _temp.getDisplayCount();
				break;
			}
		}
	}
	
	ns.getCapexOrOpex = function(properties, name) {
		for (var i=0, len=properties.length; i<len; i++) {
			var p = properties[i];
			if (p.name === name) {
				return p.defaultValue;
			}
		}
		return '';
	}
	
	ns.initCapexPropertiesGrid = function(namespace) {
		var datas = [];
		var nodes = namespace.nodes;
		for (var i=0, len=nodes.length; i<len; i++) {
			var node = nodes[i];
			var data = {};
			data.id = node.id;
			data.name = node.text;
			ns.initNodesRelation(namespace, node);
			data.amount = node.relationValue;
			var _capex = ns.getCapexOrOpex(node.properties, 'Capex');
			var _opex = ns.getCapexOrOpex(node.properties, 'Opex');
			data.capex = _capex;
			data.opex = _opex;
			if (data.amount && data.amount.toString().indexOf('N') != -1) {
				if (data.capex && data.opex) {
					data.cost = data.amount + '*' + _capex + '+' + data.amount + '*' + _opex;
				}
			} else {
				if (data.capex && data.opex) {
					data.cost = Number(data.amount * _capex) + Number(data.amount * _opex);
				}
			}
			datas.push(data);
		}
		var allCapex = 0,
			_allCapex = '', 
			allOpex = 0,
			_allOpex = '',
			allCost = 0,
			_allCost = '';
		for (var j=0, jLen=datas.length; j<jLen; j++) {
			var temp = datas[j];
			if (temp.amount && temp.amount.toString().indexOf('N') != -1) {
				_allCapex += temp.amount + '*' + temp.capex + '+';
				_allOpex += temp.amount + '*' + temp.opex + '+';
				_allCost += temp.cost + '+';
			} else {
				allCapex += Number(temp.amount) * Number(temp.capex);
				allOpex  += Number(temp.amount) * Number(temp.opex);
				allCost  += Number(temp.cost);
			}
		}
		var tempData = {};
		if (_allCapex.length > 0) {
			tempData.capex = allCapex + '+' + _allCapex.substring(0,_allCapex.length-1);
		} else {
			tempData.capex = allCapex;
		}
		if (_allOpex.length > 0) {
			tempData.opex = allOpex + '+' + _allOpex.substring(0,_allOpex.length-1);
		} else {
			tempData.opex = allOpex;
		}
		if (_allCost.length > 0) {
			tempData.cost = allCost + '+' + _allCost.substring(0,_allCost.length-1);
		} else {
			tempData.cost = allCost;
		}
		datas.push(tempData);
		return datas;
	}
	
	ns.convertN2Number = function(value) {
		if (value === 'N') {
			return -1;
		}
		return value;
	}
	
	ns.nodeMouseupCallback = function(datas) {
		var sourceValue = datas.sourceValue;
		var targetValue = datas.targetValue;
		var source = datas.source;
		var target = datas.target;
		var _source = datas._source;
		var _target = datas._target;
//		var direction = datas.direction;
		
		var properties = [{'id': source.serialNumber, 'name': source.text, 'defaultValue': sourceValue}, 
		                  {'id': target.serialNumber, 'name': target.text, 'defaultValue': targetValue}];
        link = {source: source, target: target, left: false, right: true, properties: properties};
//        link[direction] = true;
        
        ns.links.push(link);
        
        console.log('add line : ' + (sourceValue + ' : ' + ns.convertN2Number(targetValue)));
        ns.nodesMap.line(_source, _target, sourceValue, ns.convertN2Number(targetValue));

	    // select new link
	    ns.current_selected_link = link;
	    ns.current_selected_node = null;
	    ns.selected_nodes = [];
	      
	    // enable zoom
	    // enable zoom
        ns.svg.call(d3.behavior.zoom().on('zoom'), function(){DigiCompass.Web.app.svg.rescale(ns);});
        DigiCompass.Web.app.svg.redraw(ns);
        
        ns.linkItemClick();	
	}
	
	ns.nodeMouseup = function(d, me) {
		if (!ns.mousedown_node) {
	    	return ;
	    }
	    // needed by FF
	    ns.drag_line.classed('hidden', true).style('marker-end', '');

	    // check for drag-to-self
	    ns.mouseup_node = d;
	    if (ns.mouseup_node === ns.mousedown_node) {
	    	DigiCompass.Web.app.svg.resetMouseVars(ns);
	    	return;
	    }

	    // unenlarge target node
	    d3.select(me).attr('transform', '');
	    
	    if (ns.linkHasExist()) {
	    	return;
	    }

	    // add link to graph (update if exists)
	    // NB: links are strictly source < target; arrows separately specified by booleans
	    var source, target, direction;
	    
	    var source = ns.mousedown_node;
	    var target = ns.mouseup_node;
	    
//	    if (ns.mousedown_node.serialNumber < ns.mouseup_node.serialNumber) {
//	        source = ns.mousedown_node;
//	        target = ns.mouseup_node;
//	        direction = 'right';
//	    } else {
//	        source = ns.mouseup_node;
//	        target = ns.mousedown_node;
//	        direction = 'left';
//	    }
//	    
//	    var link;
//	    link = ns.links.filter(function(l) {
//	        return (l.source === source && l.target === target);
//	    })[0];
//	    
//	    if (link) {
//	    	return;
//	    }
	    
	    var _source = ns.nodesMap.getNode(source.serialNumber);
        var _target = ns.nodesMap.getNode(target.serialNumber);
        var _canLine = ns.nodesMap.canLine(_source, _target);
        console.log('map', ns.nodesMap.getNodes());
        console.log('_canLine', _canLine);
        if (_canLine === false) {
        	Notification.showNotification('Counld not line between the two nodes!');
			return;
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
    	    	fn: ns.nodeMouseupCallback
    	    };
        	ns.editLinkWin(null, null, args, true, ns);
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
        	    };
        	ns.nodeMouseupCallback(args);
        }
        
        
//        var _getLine = ns.nodesMap.getLine(_source, _target);
	    
	    
	    
	    

//	    if(link) {
//	        link[direction] = true;
//	    } else {
//			var properties = [{'name': ns.mousedown_node.text, 'defaultValue': '1'}, {'name': ns.mouseup_node.text, 'defaultValue': '1'}];
//	        link = {source: source, target: target, left: false, right: false, properties: properties};
//	        link[direction] = true;
//	        
//	        var _source = ns.nodesMap.getNode(source.serialNumber);
//	        var _target = ns.nodesMap.getNode(target.serialNumber);
//	        var _canLine = ns.nodesMap.canLine(_source, _target);
//	        if (!_canLine) {
//	        	Notification.showNotification('Counld not line between the two nodes!');
//				return;
//	        }
//	        
//	        
//	        ns.links.push(link);
//	        
//	        ns.nodesMap.line(_source, _target, 1, 1);
//	    }
//
//	    // select new link
//	    ns.current_selected_link = link;
//	    ns.current_selected_node = null;
//	    ns.selected_nodes = [];
//	      
//	    // enable zoom
//	    // enable zoom
//        ns.svg.call(d3.behavior.zoom().on('zoom'), function(){DigiCompass.Web.app.svg.rescale(ns);});
//        DigiCompass.Web.app.svg.redraw(ns);
//        
//        ns.linkItemClick();	
	}
	
	ns.linkHasExist = function(){
		for(var i=0, len=ns.links.length; i<len; i++){
			var temp = ns.links[i];
			if (temp.source == ns.mousedown_node && temp.target == ns.mouseup_node) {
				return true;
			}
		}
		return false;
	}
	
	ns.nodeItemClick = function(){
		var gridData = [];
		if(ns.current_selected_node.properties){
			gridData = ns.current_selected_node.properties;
		}
		Ext.getCmp('equipmentRelationProperties')[ns.HANDLER_TYPE] = ns.HANDLER_TYPE_NODE;
		Ext.getCmp('equipmentRelationProperties').getStore().loadData(gridData);
		Ext.getCmp('lockHeaderId').setVisible(true);
	}
	
	ns.linkItemClick = function(){
		var gridData = [];
		if(ns.current_selected_link.properties){
			gridData = ns.current_selected_link.properties;
		}
		Ext.getCmp('equipmentRelationProperties')[ns.HANDLER_TYPE] = ns.HANDLER_TYPE_LINK;
		Ext.getCmp('equipmentRelationProperties').getStore().loadData(gridData);
		Ext.getCmp('lockHeaderId').setVisible(false);
	}
	
	ns.initializeDefaultSvg = function() {
		var args = {
			width: 580,
			height: 530,
			svgId: 'equipmentRelationSvgDiv',
			namespace: ns
		};
		DigiCompass.Web.app.svg.initializeSvg(args);
	}
	
	/**
	 * init svgB
	 */
	 
	svgB.keydown = function() {
		// ctrl
	    if (d3.event.keyCode === 17) {
	    	svgB.node.call(svgB.force.drag);
	    	svgB.svg.classed('ctrl', true);
	    }
	}
	
	svgB.nodeMousedown = function(d) {}
	
	svgB.nodeMouseup = function(d) {}
	
	svgB.linkMousedown = function(d) {}
	
	ns.initializeSvgB = function() {
		var args = {
			width: 360,
			height: 530,
			svgId: 'etParentSvgDiv',
			namespace: svgB
		};
		DigiCompass.Web.app.svg.initializeSvg(args);
	}
	
	/**
	 * init svgC
	 */
	 
	svgC.keydown = function() {
		// ctrl
	    if (d3.event.keyCode === 17) {
	    	svgC.node.call(svgC.force.drag);
	    	svgC.svg.classed('ctrl', true);
	    }
	}
	
	svgC.linkMousedown = function(d) {
		if (d3.event.ctrlKey) {
			return ;
		}
	    // select link
		svgC.mousedown_link = d; 
        if (svgC.mousedown_link == svgC.current_selected_link) {
        	svgC.current_selected_link = null;
        	Ext.getCmp('etRelationProperties').getStore().loadData([]);
        } else {
        	svgC.current_selected_link = svgC.mousedown_link;
//            svgC.linkItemClick();
        	svgC.linkItemClick();
        } 
        svgC.current_selected_node = null; 
        svgC.selected_nodes = [];
        DigiCompass.Web.app.svg.redraw(svgC);
        
        ns.showCapexOpex('capexPropertiesId2', 'etRelationProperties', svgC);
	}
	
	svgC.nodeMousedown = function(d) {
        if (d3.event.ctrlKey) {
        	return ;
        }
		svgC.svg.call(d3.behavior.zoom().on('zoom'), null);
		
		svgC.mousedown_node = d;
		var index = svgC.selected_nodes.indexOf(svgC.mousedown_node);
        if (index !== -1) {
        	svgC.selected_nodes = [];
        	svgC.current_selected_node = null;	
        	Ext.getCmp('etRelationProperties').getStore().loadData([]);
        } else {
        	svgC.current_selected_node = svgC.mousedown_node; 
        	svgC.selected_nodes = [];
        	svgC.selected_nodes.push(svgC.current_selected_node);
        	svgC.nodeItemClick();
        }
		
        svgC.current_selected_link = null; 

        // reposition drag line
		/**
        var dValue = 'M' + svgC.mousedown_node.x + ',' 
        				 + svgC.mousedown_node.y + 'L' 
        				 + svgC.mousedown_node.x + ',' 
        				 + svgC.mousedown_node.y;
        svgC.drag_line.style('marker-end', 'url(#end-arrow)')
        		 .classed('hidden', false)
        		 .attr('d', dValue);*/
        DigiCompass.Web.app.svg.redraw(svgC);
        
        ns.showCapexOpex('capexPropertiesId2', 'etRelationProperties', svgC);
	}
	
	
	
	svgC.nodeMouseup = function(d) {}
	
//	svgC.linkHasExist = function(){
//		for(var i=0, len=svgC.links.length; i<len; i++){
//			var temp = svgC.links[i];
//			if (temp.source == svgC.mousedown_node && temp.target == svgC.mouseup_node) {
//				return true;
//			}
//		}
//		return false;
//	}
	
	svgC.nodeItemClick = function(){
		var gridData = [];
		if(svgC.current_selected_node.properties){
			gridData = svgC.current_selected_node.properties;
		}
		Ext.getCmp('etRelationProperties')[ns.HANDLER_TYPE] = ns.HANDLER_TYPE_NODE;
		Ext.getCmp('etRelationProperties').currentNode = svgC.current_selected_node;
		Ext.getCmp('etRelationProperties').getStore().loadData(gridData);
		Ext.getCmp('etLockHeaderId').setVisible(true);
		Ext.getCmp('updateTypeId').setVisible(true);
	}
	
	svgC.linkItemClick = function(){
		var gridData = [];
		if(svgC.current_selected_link.properties){
			gridData = svgC.current_selected_link.properties;
		}
		Ext.getCmp('etRelationProperties')[ns.HANDLER_TYPE] = ns.HANDLER_TYPE_LINK;
		Ext.getCmp('etRelationProperties').getStore().loadData(gridData);
		Ext.getCmp('etLockHeaderId').setVisible(false);
		Ext.getCmp('updateTypeId').setVisible(false);
	}
	
	ns.initializeSvgC = function() {
		var args = {
			width: 480,
			height: 530,
			svgId: 'etCurrentSvgDiv',
			namespace: svgC
		};
		DigiCompass.Web.app.svg.initializeSvg(args);
	}
	
	ns.comboData = [];
})();