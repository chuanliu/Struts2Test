<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>���ڱ�ǩ</title>
</head>
<body>
<s:bean var="now" name="java.util.Date"/>
nice="false", ����ָ�� format="dd/MM/yyy" <br/>
<s:date name="#now" format="dd/MM/yyyy" nice="false"/><hr/>
nice="true", ����ָ�� format="dd/MM/yyy" <br/>
<s:date name="#now" format="dd/MM/yyyy" nice="true"/><hr/>
 ָ�� nice="true" <br/>
<s:date name="#now" nice="true"/><hr/>
nice="false", ��ָ�� format<br/>
<s:date name="#now"  nice="false"/><hr/>
nice="false", ��ָ�� format ָ�� var <br/>
<s:date name="#now" nice="false" var="abc"/><hr/>
${requestScope.abc}<s:property value="#abc"/>
</body>
</html>