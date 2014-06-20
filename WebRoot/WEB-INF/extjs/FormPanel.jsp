<%@ page contentType="text/html; charset=gb2312" language="java"%>
<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>
<script>
Ext.require([  
             'Ext.data.*',  
             'Ext.grid.*'  
         ]);  
           
         Ext.onReady(function(){  
             Ext.define('Book',{  
                 extend: 'Ext.data.Model',  
                 proxy: {  
                     type: 'ajax',  
                     reader: 'xml'  
                 },  
                 fields: [  
                     // set up the fields mapping into the xml doc  
                     // The first needs mapping, the others are very basic  
                     {name: 'Author', mapping: '@author.name'},  
                     'Title', 'Manufacturer', 'ProductGroup'  
                 ]  
             });  
           
             // create the Data Store  
             var store = Ext.create('Ext.data.Store', {  
                 model: 'Book',  
                 autoLoad: true,  
                 proxy: {  
                     // load using HTTP  
                     type: 'ajax',  
                     url: 'sampledata-sheldon.xml',  
                     // the return will be XML, so lets set up a reader  
                     reader: {  
                         type: 'xml',  
                         // records will have an "Item" tag  
                         record: 'Item',  
                         idProperty: 'ASIN',  
                         totalRecords: '@total'  
                     }  
                 }  
             });  
           
             // create the grid  
             Ext.create('Ext.grid.Panel', {  
                 store: store,  
                 columns: [  
                     {text: "Author", flex: 1, dataIndex: 'Author'},  
                     {text: "Title", width: 180, dataIndex: 'Title'},  
                     {text: "Manufacturer", width: 115, dataIndex: 'Manufacturer'},  
                     {text: "Product Group", width: 100, dataIndex: 'ProductGroup'}  
                 ],  
                 renderTo:'example-grid',  
                 width: 540,  
                 height: 200  
             });  
         });  
</script>

</head>
<body>
 <div id="example-grid"></div>
</body>
</html>