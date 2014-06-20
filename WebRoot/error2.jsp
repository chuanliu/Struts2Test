<%@ page language="java" contentType="text/html; charset=GBK"
	pageEncoding="GBK"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title><s:text name="errorPage"></s:text></title>
</head>
<body>
<s:text name="failTip"/><br/>
${requestScope.tip} 
</body>
</html>