<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-url ��ǩ</title>
</head>
<body>
<h2>s:url ������һ��URL ��ַ</h2>
ָֻ��value ���Ե���ʽ.<br/>
<s:url value="editGadgen.action"/>
<hr/>
ָ��action���ԣ���ʹ��param�����������ʽ. <br/>
<s:url action="showBook">
<s:param name="author">Jack</s:param>
</s:url>
<hr/>
ֻʹ��param �����������ʽ��<br/>
<s:url includeParams="get">
<s:param name="id" value="%{'22'}"/>
</s:url>
<hr/>
ͬʱʹ��action value, param.<br/>
<s:url action="showBook" value="xxxx">
<s:param name="author">Jack</s:param>
</s:url>

</body>
</html>