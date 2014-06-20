(function() {
	Ext.namespace("DigiCompass.Web.Util");
	/**
	 * 循环递归找到树的最子节点
	 */
	function lookIntoArray(convertIndex,deptNodeIndex , datas , leafCheck, treeColumn, allExpand) {
		var children;
		if (datas[0] && datas[0].hasOwnProperty('children')) {
			children = datas[0]["children"];
		}
		if (children && Ext.isArray(children)) {
			var tmpArray = new Array();
			for (var i = 0; i < datas.length; i++) {
				datas[i].children = lookIntoArray(convertIndex,deptNodeIndex , datas[i].children ,leafCheck, treeColumn, allExpand);
				if(allExpand){
					datas[i].expanded = true;
				}
				tmpArray.push(datas[i]);
			}

			return tmpArray;
		} else {
			//对树的最根节点数组进行分组
			return datas = convertDetail(convertIndex,deptNodeIndex, datas , leafCheck, treeColumn, allExpand);
		}
	}
	
	function convertToFolderTreeLookIntoArray(convertIndex,deptNodeIndex , datas , leafCheck) {
		var childrenDataArray;
		if (datas[0] && datas[0].hasOwnProperty('childrenDataArray')) {
			childrenDataArray = datas[0]["childrenDataArray"];
		}
		var children;
		if (datas[0] && datas[0].hasOwnProperty('children')) {
			children = datas[0]["children"];
		}
		if (children && Ext.isArray(children) || childrenDataArray && Ext.isArray(childrenDataArray)) {
			var tmpArray = new Array();
			for (var i = 0; i < datas.length; i++) {
				if(children && Ext.isArray(children)){
					datas[i].children = convertToFolderTreeLookIntoArray(convertIndex,deptNodeIndex , datas[i].children,leafCheck);
				}else{
					var cloneDatas = Ext.clone(datas[i].childrenDataArray);
					datas[i].children = convertToFolderTreeLookIntoArray(convertIndex,deptNodeIndex , cloneDatas,leafCheck);
				}
				tmpArray.push(datas[i]);
			}
			return tmpArray;
		}else {
			//对树的最根节点数组进行分组
			return datas = convertToFolderTreeDetail(convertIndex,deptNodeIndex, datas,leafCheck);
		}
	}
	
	/**
	 * 转换树最底层节点
	 * convertIndex转换的dataIndex
	 * datas 需要转换的数据
	 */
	function convertDetail(convertIndex,deptNodeIndex , datas , leafCheck, treeColumn, allExpand) {
		var tempArray = new Array();
		var rootNode = {};
		var _rootExpand = false;
		var _rootChecked = true;
		while (datas.length !== 0) {
			var tmp = datas[0][convertIndex];
			if (!Ext.isEmpty(tmp, true)) {
				var node = {
					iconCls : 'task-folder'
				};
				var _checked = true;
				if(!Ext.isEmpty(treeColumn)){
					node[treeColumn] = datas[0][convertIndex];
				}
				else{
					node.treeNode = datas[0][convertIndex];
				}
				var _expand = false;
				var tmpArray = new Array();
				for (var i = 0; i < datas.length; i++) {
					if (tmp === datas[i][convertIndex]) {
						datas[i].iconCls = 'task-folder';
						if (datas[i].hasOwnProperty('expanded')
								&& datas[i]['expanded']) {
							_expand = true;
							_rootExpand = true;
						}
						if (!datas[i].hasOwnProperty('checked')) {
							datas[i].checked = false;
							_checked = false;
							_rootChecked = false;
						} else {
							if (!datas[i].checked) {
								_checked = false;
								_rootChecked = false;
							}
						}
						if(Ext.isEmpty(treeColumn)){
							datas[i].treeNode = datas[i][deptNodeIndex];
						}
						datas[i].leaf = true;
						tmpArray.push(datas[i]);
						datas.splice(i, 1);
						i--;
					}
				}
				if(!leafCheck){
					node.checked = _checked;
				}
				node.expanded = _expand;
				node.children = tmpArray;
				if(allExpand){
					node.expanded = true;
				}
				tempArray.push(node);
			} else {
				tempArray.push({
							iconCls : 'task-folder',
							checked : false,
							children : datas[0]
						});
				datas.splice(0, 1);
			}
		}
		var rootNode = {
			checked : _rootChecked,
			expanded : _rootExpand
		};
		return tempArray;
	}
	
	function convertToFolderTreeDetail(convertIndex, deptNodeIndex, datas , leafCheck) {
		var tempArray = new Array();
//		var rootNode = {};
//		var _rootExpand = false;
//		var _rootChecked = false;
		while (datas.length !== 0) {
			var tmp = datas[0][convertIndex];
			if (!Ext.isEmpty(tmp, true)) {
				var node = {
					iconCls : 'task-folder'
				};
				var _checked = true;
//				node.treeNode = datas[0][convertIndex];
				node.text = datas[0][convertIndex];
				var _expand = true;
				var tmpArray = new Array();
				for (var i = 0; i < datas.length; i++) {
					if (tmp === datas[i][convertIndex]) {
//						datas[i].iconCls = 'task-folder';
//						if (datas[i].hasOwnProperty('expanded')
//								&& datas[i]['expanded']) {
//							_expand = true;
//							_rootExpand = true;
//						}
						if (!datas[i].hasOwnProperty('checked')) {
							datas[i].checked = false;
							_checked = false;
						} 
						else {
							if (!datas[i].checked) {
								_checked = false;
							}
						}
//						datas[i].treeNode = datas[i][deptNodeIndex];
//						datas[i].text = datas[i][deptNodeIndex];
//						datas[i].leaf = true;
						tmpArray.push(datas[i]);
						datas.splice(i, 1);
						i--;
					}
				}
				if(!leafCheck){
					node.checked = _checked;
				}
				node.expanded = _expand;
//				node.children = tmpArray;
				node.childrenDataArray = tmpArray;
				tempArray.push(node);
			} else {
				tempArray.push({
							iconCls : 'task-folder',
							checked : false,
							children : datas[0]
						});
				datas.splice(0, 1);
			}
		}
//		var rootNode = {
//			checked : _rootChecked,
//			expanded : _rootExpand
//		};
		return tempArray;
	}
	
	/**
	 * 外部调用接口
	 * 传参类型 convertIndexs 字符串数组或者字符串
	 * 传参类型 datas json数组类型
	 * 返回 json树，可以供treestore使用
	 *  示例 Ext.create('Ext.data.TreeStore', {
		        model: 'Task',
		        root: {
					expanded: false,  
		            children: convert(["address", 'name' , 'cuisine'], datas)
				},
				folderSort: true
		    });
	 */
	DigiCompass.Web.Util.convert = function(convertIndexs,deptNodeIndex, datas, isLeafCheck, treeColumn , allExpand) {
		var leafCheck = false;
		if(isLeafCheck){
			leafCheck  = true;
		}
		if (Ext.isArray(convertIndexs)) {
			for (var i = 0; i < convertIndexs.length; i++) {
				datas = lookIntoArray(convertIndexs[i] , deptNodeIndex ,datas , leafCheck, treeColumn , allExpand);
			}
		} else if (Ext.isString(convertIndexs)) {
			datas = convertDetail(convertIndexs, deptNodeIndex , datas , leafCheck, treeColumn);
		}
		return datas;
	}
	
	
	DigiCompass.Web.Util.convertToFolderTree = function(convertIndexs,deptNodeIndex, datas,leafCheck) {
		if (Ext.isArray(convertIndexs)) {
			for (var i = 0; i < convertIndexs.length; i++) {
				datas = convertToFolderTreeLookIntoArray(convertIndexs[i] , deptNodeIndex ,datas,leafCheck);
			}
		} else if (Ext.isString(convertIndexs)) {
			datas = convertToFolderTreeDetail(convertIndexs, deptNodeIndex , datas,leafCheck);
		}
		return datas;
	}

})();