<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-doubleselect ��ǩ</title>
</head>
<body>
<s:set name="bs" value="#{'���':{'���Java ����','head first','���ģʽ'}, 
'David':{'JavaScript: the Defineitive guide'}, 
'Johnson':{'Exper one-in-one J2EE Desing'} }"/>

<%-- <s:set name="bs" value="#{'���': {'Struts2Ȩ��ָ��', 
	'������J2EE��ҵӦ��ʵս','����J2EE��Ajax����'},
	'David': {'JavaScript: The Definitive Guide'},
	'Johnson': {'Expert One-on-One J2EE Design and Development'}}"/> --%>

<s:form action="login2">
<s:doubleselect 
label="��ѡ����ϲ����ͼ��"
size="3"
name="author" list="#bs.keySet()"
doubleList="#bs[top]"
doubleSize="3"
doubleName="book"/>

</s:form>


</body>
</html>