<%@ page language="java" contentType="text/html; charset=GBK"
	pageEncoding="GBK"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>�쳣����ҳ��</title>
</head>
<body>
�쳣��Ϣ�� <s:property value="exception.message"/><br/>
<!--��ӡ��ϸ��Ϣ-->
<s:property value="exceptionStack"/>
</body>
</html>