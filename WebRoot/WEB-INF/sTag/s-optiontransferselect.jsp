<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Optiontransfer ��ǩ</title>
</head>
<body>

<s:form>
<s:optiontransferselect
label="��ѡ����ϲ����ͼ��"
labelposition="top"
name="cnbook"
leftTitle="����ͼ�飺"
rightTitle="����ͼ�飺"
list="{'���Java ����','head first','���ģʽ'}"
multiple="true"
addToLeftLabel="�����ƶ�"
selectAllLabel="ȫ��ѡ��"
addAllToRightLabel="ȫ������"
headerKey="cnKey"
headerValue="---ѡ������ͼ��---"
emptyOption="true"

doubleList="{'Expert One-on-One J2EE Design and Develpment', 'JavaScript: The Definitive Guide'}"
doubleName="enBook"
doubleHeaderKey="enKey"
doubleHeaderValue="---ѡ������ͼ��---"
doubleEmptyOption="true"
doubleMultiple="true"/>
</s:form>
</body>
</html>