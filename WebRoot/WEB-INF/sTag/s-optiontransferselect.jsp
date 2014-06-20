<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Optiontransfer 标签</title>
</head>
<body>

<s:form>
<s:optiontransferselect
label="请选择您喜欢的图书"
labelposition="top"
name="cnbook"
leftTitle="中文图书："
rightTitle="外文图书："
list="{'疯狂Java 讲义','head first','设计模式'}"
multiple="true"
addToLeftLabel="向左移动"
selectAllLabel="全部选择"
addAllToRightLabel="全部右移"
headerKey="cnKey"
headerValue="---选择中文图书---"
emptyOption="true"

doubleList="{'Expert One-on-One J2EE Design and Develpment', 'JavaScript: The Definitive Guide'}"
doubleName="enBook"
doubleHeaderKey="enKey"
doubleHeaderValue="---选择外文图书---"
doubleEmptyOption="true"
doubleMultiple="true"/>
</s:form>
</body>
</html>