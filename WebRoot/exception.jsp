<%@ page language="java" contentType="text/html; charset=GBK"
	pageEncoding="GBK"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>异常处理页面</title>
</head>
<body>
异常信息： <s:property value="exception.message"/><br/>
<!--打印详细信息-->
<s:property value="exceptionStack"/>
</body>
</html>