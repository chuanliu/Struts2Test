<%@ page language="java" contentType="text/html; charset=GBK"
	pageEncoding="GBK"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title><s:text name="succPage"></s:text></title>
</head>
<body>
<s:text name="succTip">
<s:param>${requestScope.user}</s:param>
</s:text><br/>

<s:property value="Tip"/>
<br/>

</body>
</html>