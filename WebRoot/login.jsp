<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><s:text name="loginPage"></s:text></title>
</head>
<body>

	<s:form action="login">
		<s:textfield name="username" key="user" />
		<s:password name="password" key="pass" />
		<s:submit key="login"/>
	</s:form>
</body>
</html>