<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-doubleselect ��ǩ</title>
</head>
<body>
<s:form action="login2">
<s:doubleselect 
label="��ѡ����ϲ����ͼ��"
name="author" list="{'���', 'David'}"
doubleList="top=='���' ? {'���Java ����','head first','���ģʽ'}:
{'JavaScript: the Defineitive guide'}"
doubleName="book"/>

</s:form>

</body>
</html>