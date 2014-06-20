<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-doubleselect 标签</title>
</head>
<body>
<s:set name="bs" value="#{'李刚':{'疯狂Java 讲义','head first','设计模式'}, 
'David':{'JavaScript: the Defineitive guide'}, 
'Johnson':{'Exper one-in-one J2EE Desing'} }"/>

<%-- <s:set name="bs" value="#{'李刚': {'Struts2权威指南', 
	'轻量级J2EE企业应用实战','基于J2EE的Ajax宝典'},
	'David': {'JavaScript: The Definitive Guide'},
	'Johnson': {'Expert One-on-One J2EE Design and Development'}}"/> --%>

<s:form action="login2">
<s:doubleselect 
label="请选择您喜欢的图书"
size="3"
name="author" list="#bs.keySet()"
doubleList="#bs[top]"
doubleSize="3"
doubleName="book"/>

</s:form>


</body>
</html>