<%@ page contentType="text/html; charset=gb2312" language="java" %>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>������Ա��</title>
<s:head/>
</head>
<body>
<table width=780 align="center">
<tr>
<td>
����������Ա�������ϣ�<br>
<s:form action="processAdd">
	<s:textfield name="empName" label="Ա���û���"/>
	<s:textfield name="empPass" label="Ա������"/>
	<s:textfield name="empSal" label="Ա����н"/>
	<s:token/>
	<tr><td colspan="2">
	<s:submit value="�����Ա��" theme="simple"/><s:reset  theme="simple" value="��������"/>
	</td></tr>
</s:form>
</td>
</tr>
</table>
</body>
</html>
