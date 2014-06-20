<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%@taglib prefix="sx" uri="/struts-dojo-tags"%> 

<html>
<head>
<title><s:text name="Regist Page" /></title>
<sx:head/>
</head>
<body>
<s:fielderror/>
	<s:form action="validate.regist" validate="true">
		<s:textfield name="name" label="姓名" />
		<s:textfield name="pass" label="密码" />
		<s:textfield name="age" label="年龄" />
		<sx:datetimepicker  name="birth" displayFormat="yyyy-MM-dd" label="生日"/>
		<s:submit Value="注册" />
	</s:form>
</body>
</html>
