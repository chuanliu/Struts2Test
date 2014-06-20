var myParser;

function SiteControl(controlDiv, map) {	
	
	myParser = new geoXML3.parser(
			{
				map : map,
				procStyle : function(doc, polyOptions) {
					if (doc.url == "/mapdata/60_Population.kml") {
						polyOptions.strokeColor = "#FF0000";
						polyOptions.strokeWeight = 2;
						polyOptions.strokeOpacity = 0.8;
						polyOptions.fillColor = "#FF0000";
						polyOptions.fillOpacity = 0.35;
					} else if (doc.url == "/mapdata/80_Population_Contiguous_Areas_VHA_Mod_240311.kml") {
						polyOptions.strokeColor = "#FFFF00";
						polyOptions.strokeWeight = 2;
						polyOptions.strokeOpacity = 0.8;
						polyOptions.fillColor = "#FFFF00";
						polyOptions.fillOpacity = 0.35;
					} else if (doc.url == "/mapdata/96_Pop_Poly_v1.kml") {
						polyOptions.strokeColor = "#0000FF";
						polyOptions.strokeWeight = 2;
						polyOptions.strokeOpacity = 0.8;
						polyOptions.fillColor = "#0000FF";
						polyOptions.fillOpacity = 0.35;
					}
				}
			});
	myParser.parse([ '/mapdata/60_Population.kml',
			'/mapdata/80_Population_Contiguous_Areas_VHA_Mod_240311.kml',
			'/mapdata/96_Pop_Poly_v1.kml' ]);
	
	controlDiv.style.padding = '5px';

	var controlUI = document.createElement('DIV');
	controlUI.style.textAlign = 'center';
	controlDiv.appendChild(controlUI);
	
	var btnDiv = document.createElement('DIV');
	btnDiv.style.zIndex = 1;	
	btnDiv.style.position = "absolute";
	btnDiv.style.width = "20px";
	btnDiv.style.height = "20px";
	btnDiv.style.top = "0px";
	btnDiv.style.right = "0px";
	btnDiv.style.background = "#3b587a";
	btnDiv.style.textAlign = "center";
	btnDiv.style.color = "#FFFFFF";
	//btnDiv.onclick = "slide('treeDiv', this);";
	btnDiv.textContent = "+";
	
	var treeDivId = "treeDiv#"+randomString(); 
	
	var treeDiv = document.createElement('DIV');
	treeDiv.id = treeDivId;
	treeDiv.style.position = "absolute";
	treeDiv.style.width = "20px";
	treeDiv.style.height = "20px";
	treeDiv.style.top = "0px";
	treeDiv.style.left = "1800px";
	treeDiv.style.background = "transparent";	             
	treeDiv.style.overflow = "hidden";	
	
	google.maps.event.addDomListener(btnDiv, 'click', function() {	    
	    createTree(treeDivId, map);
	    slide(treeDivId, btnDiv);
	});
		
	var controlContent = document.createElement('DIV');
	controlContent.style.position = "relative";
	controlContent.style.width = "200px";
	controlContent.style.height = "170px";
	controlContent.style.top = "0px";
	controlContent.style.left = "0px";

	controlContent.appendChild(btnDiv);
	controlContent.appendChild(treeDiv);

	controlUI.appendChild(controlContent);		
}

function slide(elementId, headerElement)
{
   var element = document.getElementById(elementId);
   if(element.down == null || element.up)
   {  
      animate(elementId, 0, 0, 200, 200, 250, null); // 展开
      element.down = true;
      element.up = false;
      headerElement.innerHTML = '-';
   }
   else
   {
      animate(elementId, 180, 0, 20, 20, 250, null); // 收缩
      element.up = true;
      element.down = false;
      headerElement.innerHTML = '+';
      
   }
}

function displayOrHideDoc(node, checked) {
	var docs = myParser.docs;
	for ( var i = 0; i < docs.length; i++) {
		if (docs[i].url == node.raw.url) {
			if (checked) {
				myParser.showDocument(docs[i]);
			} else {
				myParser.hideDocument(docs[i]);
			}
		}
	}
}

function checkchild(map, node, checked) {
	node.eachChild(function(child) {
		if (child.childNodes.length > 0) {
			checkchild(map, child, checked);//递归  
		}
		child.set("checked", checked);
		child.commit();
		processSite(map, child, checked);
		displayOrHideDoc(child, checked);		
	});
}

function checkparent(map, node) {
	if (!node) {
		return;
	}
	var parentNode = node.parentNode;
	if (parentNode !== null) {
		var isall = true;
		parentNode.eachChild(function(n) {
			if (!n.data.checked) {
				isall = false;
			}
		});
		parentNode.set("checked", isall);
		parentNode.commit();
		processSite(map, parentNode, isall);
		displayOrHideDoc(parentNode, isall);		
	}
	checkparent(parentNode);//递归  
}
var markersObj = {
		Planned : [],
		Exists : []
};
function addMarker(type, map, location) {
  marker = new google.maps.Marker({
    position: location,
    map: map
  });
  var markersArray = markersObj[type];
  markersArray.push(marker);
}

// Removes the overlays from the map, but keeps them in the array
function clearOverlays(type) {
  var markersArray = markersObj[type];
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
  }
}
function createTree(renderDivId, map){
	if(!Ext.getCmp(renderDivId)){
		var store = Ext
				.create(
						'Ext.data.TreeStore',
						{
							root : {
								expanded : true,
								children : [ {
									text : "All Layer",
									checked : false,
									expanded : true,
									children : [
											{
												text : "Sites",
												checked : false,
												leaf : false,
												children : [ {
													text : "Planned",
													checked : false,
													leaf : true
												}, {
													text : "Exists",
													checked : false,
													leaf : true
												} ]
											},
											{
												text : "Polygon",
												checked : false,
												leaf : false,
												children : [
														{
															text : "60",
															checked : true,
															url : "/mapdata/60_Population.kml",
															leaf : true
														},
														{
															text : "70",
															checked : false,
															leaf : true
														},
														{
															text : "80",
															url : "/mapdata/80_Population_Contiguous_Areas_VHA_Mod_240311.kml",
															checked : true,
															leaf : true
														},
														{
															text : "96",
															url : "/mapdata/96_Pop_Poly_v1.kml",
															checked : true,
															leaf : true
														} ]
											} ]
								} ]
							}
						});
	
		var treePanel = Ext.create('Ext.tree.Panel', {
			width : '200px',
			height : '200px',
			store : store,
			rootVisible : false,
			renderTo :renderDivId,
			border: false,
			bodyStyle: 'background:transparent;',
			listeners : {
				checkchange : function(node, checked) {
					checkchild(map, node, checked);
					checkparent(map, node);	
					processSite(map, node, checked);
					displayOrHideDoc(node, checked);					
				}
			}
		});
	}
}

function processSite(map, node, checked){
	if(node.get("text") == "Planned"){
		var message = {};						
		message.MODULE_TYPE = 'PLANNED_SITE_MODULE';
		message.COMMAND = 'COMMAND_QUERY_ALL';
		cometdfn.request(message, function(data, Conf) {
			var status = data.STATUS;
			if (status === "success") {							
				var _list = data.BUSINESS_DATA.list;
				var list = Ext.decode(_list);
				if(checked){
					for(var i = 0; i < list.length; i++){
						var title = list[i].name;
						var latlng = new google.maps.LatLng(list[i].latitude, list[i].longitude);
						addMarker("Planned", map, latlng);
					}
				} else {
					clearOverlays("Planned");
				}
			} else if (data.customException) {
				alertError(data.customException);
			}
		});
	} else if(node.get("text") == "Exists"){
		var message = {};						
		message.MODULE_TYPE = 'MOD_SITE_GROUP';
		message.COMMAND = 'COMMAND_QUERY_ALL';
		cometdfn.request(message, function(data, Conf) {
			var status = data.STATUS;
			if (status === "success") {							
				var _list = data.BUSINESS_DATA.list;
				var list = Ext.decode(_list);
				if(checked){
					for(var i = 0; i < list.length; i++){
						var title = list[i].name;
						var latlng = new google.maps.LatLng(list[i].latitude, list[i].longitude);
						addMarker("Exists",map, latlng);
					}
				} else {
					clearOverlays("Exists");
				}
			} else if (data.customException) {
				alertError(data.customException);
			}
		});
	}
}

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}