<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>��¼ҳ��</title>
</head>
<body>
ʹ�� user.name ��������:<br/>
<s:form action="orglConvertLogin">
<s:textfield name="user.name" label="�û���"/>
<s:textfield name="user.pass" label="��    ��"/>
<tr>
<td colspan="2"><s:submit value="ת��" theme="simple"/>
<s:reset value="����" theme="simple"/>
</td>

<tr/>

</s:form>
<br/><br/>

<!-- ------------------------------------------------  -->
ʹ�� Map ��������:<br/>
<s:form action="orglConvertLogin" method="executeMap">
<s:textfield name="users['One'].name" label="��one���û���"/>
<s:textfield name="users['One'].pass" label="��one������"/>
<s:textfield name="users['Two'].name" label="��two���û���"/>
<s:textfield name="users['Two'].pass" label="��two������"/>
<tr>
<td colspan="2"><s:submit value="ת��" theme="simple"/>
<s:reset value="����" theme="simple"/>
</td>

<tr/>

</s:form>
<br/><br/>

<!-- ------------------------------------------------  -->
ʹ�� List<?> ��������:<br/>
<s:form action="orglConvertLogin" method="executeList">
<s:textfield name="users2[0].name" label="��one���û���"/>
<s:textfield name="users2[0].pass" label="��one������"/>
<s:textfield name="users2[1].name" label="��two���û���"/>
<s:textfield name="users2[1].pass" label="��two������"/>
<tr>
<td colspan="2"><s:submit value="ת��" theme="simple"/>
<s:reset value="����" theme="simple"/>
</td>

<tr/>

</s:form>

</body>
</html>