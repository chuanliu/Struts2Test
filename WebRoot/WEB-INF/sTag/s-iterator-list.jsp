<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>��������ǩ</title>
</head>
<body>
<table border="1" width="200">
<tr>
<td>����</td>
<td>����</td>
</tr>
<s:iterator value="{'���Java ����','head first','���ģʽ'}" id="name" status="st">
<tr <s:if test="#st.odd">
style="background-color:#bbbbbb" </s:if>>
<td><s:property value="#st.count"/></td>
<td><s:property value="name"/></td>
</tr>
</s:iterator>
</table>
<br/><br/>
<table border="1" width="300">
<tr>
<td>����</td>
<td>����</td>
<td>����</td>
</tr>
<s:iterator value="#{'���Java ����':'���','head first': 'Jack','���ģʽ':'Jack'}" id="score" status="st">
<tr <s:if test="#st.odd">
style="background-color:#bbbbbb" </s:if>>
<td><s:property value="#st.count"/></td>
<td><s:property value="key"/></td>
<td><s:property value="value"/></td>
</tr>
</s:iterator>
</table>
<br/><br/>
<s:append var="newList">
<s:param value="{'���Java ����','head first','���ģʽ'}"/>
<s:param value="{'Jack','www.test.jack.com'}"/>
</s:append>
<table border="1" width="200">
<tr>
<td>����</td>
<td>����</td>
</tr>
<s:iterator value="#newList" status="st" id="ele">
<tr <s:if test="#st.odd">
style="background-color:#bbbbbb" </s:if>>
<td><s:property value="#st.count"/></td>
<td><s:property value="ele"/></td>
</tr>
</s:iterator>
</table>
<%
String ctx = request.getContextPath();
%>
<link href="<%=ctx%>/images/css.css" rel="stylesheet" type="text/css">
<br/>
��֤�룺<img name="d" src="controlTagAuthImg"><br/><br/>

<s:bean name="org.jack.app.po.BookService" id="bs"/>
<table border="1" width="400">
<s:iterator
value="#bs.books"
status="st"
id="book">
<tr <s:if test="#st.odd">
style="background-color:#bbbbbb" </s:if>>
<td><s:property value="#st.count"/></td>
<td><s:property value="#book.author"/></td>
<td><s:property value="#book.name"/></td>
</tr>
</s:iterator>
</table>
</body>
</html>