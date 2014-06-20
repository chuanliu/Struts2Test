<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Include 页面</title>
</head>
<body>
<h2>使用 s:include 标签来包含目标页面 </h2>

<s:include value="include-file.jsp"/>
<param name="color">bule</param>

<s:include value="include-file.jsp">
<s:param name="author" value="'Jack'"/>
<s:param name="color">BULE</s:param>
</s:include>
</body>
</html>