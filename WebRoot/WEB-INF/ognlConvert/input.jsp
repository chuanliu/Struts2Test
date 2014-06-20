<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>登录页面</title>
</head>
<body>
使用 user.name 来传参数:<br/>
<s:form action="orglConvertLogin">
<s:textfield name="user.name" label="用户名"/>
<s:textfield name="user.pass" label="密    码"/>
<tr>
<td colspan="2"><s:submit value="转换" theme="simple"/>
<s:reset value="重填" theme="simple"/>
</td>

<tr/>

</s:form>
<br/><br/>

<!-- ------------------------------------------------  -->
使用 Map 来传参数:<br/>
<s:form action="orglConvertLogin" method="executeMap">
<s:textfield name="users['One'].name" label="第one个用户名"/>
<s:textfield name="users['One'].pass" label="第one个密码"/>
<s:textfield name="users['Two'].name" label="第two个用户名"/>
<s:textfield name="users['Two'].pass" label="第two个密码"/>
<tr>
<td colspan="2"><s:submit value="转换" theme="simple"/>
<s:reset value="重填" theme="simple"/>
</td>

<tr/>

</s:form>
<br/><br/>

<!-- ------------------------------------------------  -->
使用 List<?> 来传参数:<br/>
<s:form action="orglConvertLogin" method="executeList">
<s:textfield name="users2[0].name" label="第one个用户名"/>
<s:textfield name="users2[0].pass" label="第one个密码"/>
<s:textfield name="users2[1].name" label="第two个用户名"/>
<s:textfield name="users2[1].pass" label="第two个密码"/>
<tr>
<td colspan="2"><s:submit value="转换" theme="simple"/>
<s:reset value="重填" theme="simple"/>
</td>

<tr/>

</s:form>

</body>
</html>