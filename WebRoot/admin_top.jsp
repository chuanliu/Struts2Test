<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<script src="js/time.js" type="text/javascript">
</script>
<title>无标题文档</title>
</head>
<body onload="show()" background="images/login_bg.jpg">
<table width="1124">
<tr>
<td width="10%" >
<img src="images/logo.png"/></td>
<td width="60%">
<div align="center">当前时间：<div id="nowDiv"></div>
</div>
</td>
<td width="30%">
<div align="left">
</div>
</td>
<td>
<div align="center">
<a style="COLOR: #333333" onclick="if (confirm('确定要退出吗？')) return true; else return false;" 
   href="login.jsp" target=_top ><img src="images/tuichu.gif" /></a> 
</div>
</td>
</tr>
</table>
</body>
</html>

