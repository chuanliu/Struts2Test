<%@ page language="java" contentType="text/html; charset=GBK"
	pageEncoding="GBK"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%
String ctx = request.getRealPath("WEB-INF");
%>
<%=ctx%><br/>
<html>
<head>
<title><s:text name="succPage"></s:text></title>
</head>
<body>
上传文件成功!<br/>
文件标题：<s:property value= " + title"/><br/>
文件为：<img src="<s:property value="'upload/' + uploadFileName"/>"  width="250" height="380" /> <br/>

</body>
</html>