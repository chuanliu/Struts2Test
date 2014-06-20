<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-url 标签</title>
</head>
<body>
<h2>s:url 来生成一个URL 地址</h2>
只指定value 属性的形式.<br/>
<s:url value="editGadgen.action"/>
<hr/>
指定action属性，且使用param传入参数的形式. <br/>
<s:url action="showBook">
<s:param name="author">Jack</s:param>
</s:url>
<hr/>
只使用param 传入参数的形式。<br/>
<s:url includeParams="get">
<s:param name="id" value="%{'22'}"/>
</s:url>
<hr/>
同时使用action value, param.<br/>
<s:url action="showBook" value="xxxx">
<s:param name="author">Jack</s:param>
</s:url>

</body>
</html>