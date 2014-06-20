<%@page language="java" contentType="text/html; charset=GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib prefix="s" uri="/struts-tags" %>

<html>
<head>
<title>控制表达式</title>
</head>
<body>
<s:set name="age" value="36"/>
<s:if test="#age>60">
老年人
</s:if>

<s:elseif test="#age>35">
中年人
</s:elseif>

<s:elseif test="#age>15">
亲年人
</s:elseif>
<s:else>
少年
</s:else>

</body>
</html>