<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%-- <html>
<head>
<title>Upload File</title>
<s:head theme="simple"/>
</head>

<body>
	<s:form action="uploadPro" enctype="multipart/form-data">
	<s:textfield name="title" label="�ļ�����"/>
	<s:file contenteditable="false" name="upload"  label="ѡ���ļ�"/>
	<s:submit value="�ϴ�"/>
	</s:form>

</body>
</html> --%>

<html>
<head>
<style type="text/css">
#oPut0{
        width:200px; border:1px solid #11586E;
}
#oPut1{
        display:none;
}
#oPut2{
        width:60px;
        border:0;
        height:20px;
        color:#FFF;
        padding-top:2px;
        background-color:green;        
}
</style>
<script type="text/javascript">
function setValue(){
var oForm=document.getElementsByTagName("form")[0];
oForm.elements[2].click();
}
function setPath(){
	var oForm=document.getElementsByTagName("form")[0];
	oForm.elements[1].value=oForm.elements[2].value;
	}
</script>
</head>
<body>
<s:fielderror/>
<form action="uploadPro" enctype="multipart/form-data" method="post">
�ļ�����: <input id="oPut0" type="text" name="title"/><br/>
ѡ���ļ�: <input id="oPut0" type="text" name="path"/>
<input id="oPut1" type="file" name="upload" onchange="setPath()"/>
<input id="oPut2" type="button" value="���..." onclick="setValue()" />
<input type="submit" value="�ϴ�" />
</form>

<%-- <s:form action="uploadPro" enctype="multipart/form-data">
	<s:textfield name="title" label="�ļ�����"/>
	<s:file name="upload" id="oPut1"/>
	<s:textfield name="title2" label="ѡ���ļ�"/>
	<input id="oPut2" type="button" value="���..." onclick="setValue()" />
</s:form> --%>

</body>
</html>