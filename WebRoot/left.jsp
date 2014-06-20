<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>无标题文档</title>
<script language="javascript">
function show(){
if(document.getElementById('div1').style.display=="block"){
document.getElementById('div1').style.display="none";
}
else if(document.getElementById('div1').style.display=="none"){
document.getElementById('div1').style.display="block";
}
}
function showcheck(){
if(document.getElementById('div2').style.display=="block"){
document.getElementById('div2').style.display="none";
}
else if(document.getElementById('div2').style.display=="none"){
document.getElementById('div2').style.display="block";
}
}
</script>
<style type="text/css">

.caidan{
width: 160px;
height: 50px;
border:1px solid #96C2F1;
background-color: #EFF7FF
}
.button{
width:160px;
height:30px;
background-color: #EEFAFF
}
.divstyle{ 
width:160px;
background-color: #F1F7F9
}
.fontstyle{ 
width:160px;
font-size:16px;
font-style:inherit;
border:1px solid #96C2F1;
font-family: Arial, Helvetica, sans-serif;
color: #333333;
}
</style>
</head>
<body bgcolor="#5AA2C8">
<table class="caidan">
<tr>
<td> 
<marquee direction=left scrollamount=3 onmouseover="this.stop()" onmouseout="this.start()">
欢迎访问Jack的网站
</marquee>
</td>
</tr>
</table>

<input type="button" class="button" value="图书管理" onclick="show()"/>
<div id="div1"  class="divstyle" style="display:none">
<div class="fontstyle"><a href="bookmessage.jsp" target="right"><center>查看图书</center></a></div>
<div class="fontstyle"><a href="addbook.jsp" target="right"><center>添加图书</center></a></div>
<div class="fontstyle"><a href="controlTags-iterator-list" target="right"><center>迭代器</center></a></div>
</div>


<input type="button" class="button" value="查找图书" onclick="showcheck()"/>
<div id="div2" class="divstyle" style="display:none">
<div class="fontstyle"><a href="searchauthor.jsp" target="right"><center>作者查询</center></a></div>
<div class="fontstyle"><a href="searchname.jsp" target="right"><center>书名查询</center></a></div>
<div class="fontstyle"><a href="searchtype.jsp" target="right"><center>图书分类查询</center></a></div>
<div class="fontstyle"><a href="searchchuban.jsp" target="right"><center>出版社查询</center></a></div>
<div class="fontstyle"><a href="searchcontent.jsp" target="right"><center>内容查询</center></a></div>
</div>
</body>
</html>
