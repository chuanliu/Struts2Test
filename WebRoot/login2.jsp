<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<script>
	function regist()
	{
		//获取页面的第一个表单
		targetForm = document.forms[0];
		//动态修改表单的action属性
		targetForm.action = "regist.action";
	}

</script>

<html>
<head>
<title><s:text name="loginPage"></s:text></title>
</head>
<body>
	<s:form action="login">
		<s:textfield name="username" key="user"/>
		<s:password name="password" key="pass" />
		<tr>
		<td><input type="submit" value="登陆"/> </td>
		<td><input type="submit" value="注册" onClick="regist();"/></td>
		</tr>
	</s:form>

</body>
</html>