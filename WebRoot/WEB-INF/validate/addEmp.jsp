<%@ page contentType="text/html; charset=gb2312" language="java" %>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>增加新员工</title>
<s:head/>
</head>
<body>
<table width=780 align="center">
<tr>
<td>
请您输入新员工的资料：<br>
<s:form action="processAdd">
	<s:textfield name="empName" label="员工用户名"/>
	<s:textfield name="empPass" label="员工密码"/>
	<s:textfield name="empSal" label="员工月薪"/>
	<s:token/>
	<tr><td colspan="2">
	<s:submit value="添加新员工" theme="simple"/><s:reset  theme="simple" value="重新输入"/>
	</td></tr>
</s:form>
</td>
</tr>
</table>
</body>
</html>
