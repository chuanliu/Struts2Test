<%@ page language="java" contentType="text/html; charset=GBK"
	pageEncoding="GBK"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title><s:text name="succPage"></s:text></title>
</head>
<body>
<s:text name="succTip">
<s:param>${sessionScope.user}</s:param>
</s:text><br>
<s:text name="counter">
<s:param>${applicationScope.counter}</s:param>
</s:text><br/>
${requestScope.tip}<br/>
${requestScope.extra}<br/>
从系统读取Cookie值为： ${cookie.user.value}<br/>

<table border="1" width="200">
<tr>
<td>序列</td>
<td>书名</td>
</tr>
<s:iterator value="listtest" status="st" id="ele">
<tr <s:if test="#st.odd">
style="background-color:#bbbbbb" </s:if>>
<td><s:property value="#st.count"/></td>
<td><s:property value="ele"/></td>
</tr>
</s:iterator>
</table>
<s:debug></s:debug>
</body>
</html>