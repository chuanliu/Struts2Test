<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Include ҳ��</title>
</head>
<body>
<h2>ʹ�� s:include ��ǩ������Ŀ��ҳ�� </h2>

<s:include value="include-file.jsp"/>
<param name="color">bule</param>

<s:include value="include-file.jsp">
<s:param name="author" value="'Jack'"/>
<s:param name="color">BULE</s:param>
</s:include>
</body>
</html>