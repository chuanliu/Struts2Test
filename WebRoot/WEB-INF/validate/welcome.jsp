<%@ page language="java" contentType="text/html; charset=GBK"
	pageEncoding="GBK"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%
String ctx = request.getRealPath("WEB-INF");
%>
<%=ctx%><br/>
<html>
<head>
<title><s:text name="succPage"></s:text></title>
</head>
<body>
�ϴ��ļ��ɹ�!<br/>
�ļ����⣺<s:property value= " + title"/><br/>
�ļ�Ϊ��<img src="<s:property value="'upload/' + uploadFileName"/>"  width="250" height="380" /> <br/>

</body>
</html>