<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-doubleselect 标签</title>
</head>
<body>
<s:form action="login2">
<s:doubleselect 
label="请选择您喜欢的图书"
name="author" list="{'李刚', 'David'}"
doubleList="top=='李刚' ? {'疯狂Java 讲义','head first','设计模式'}:
{'JavaScript: the Defineitive guide'}"
doubleName="book"/>

</s:form>

</body>
</html>