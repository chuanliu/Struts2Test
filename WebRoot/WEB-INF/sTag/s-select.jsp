<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-select ��ǩ</title>
</head>
<body>
<s:form>
<!-- ʹ��List��������������ѡ��� -->
<s:select
name="a"
label="��ѡ ����ϲ����ͼ��"
labelposition="top"
mutltiple="true"
list="{'���Java ����', '������Java EE ��ҵӦ��ʵս', 'JavaScript: The Definitive Guide'}"
/>


<!-- ʹ�ü�Map��������������ѡ��� -->
<s:select
name="b"
label="��ѡ ����ϲ����ͼ��"
labelposition="top"
mutltiple="true" 
list="#{'���Java ����': '2008��8��', '������Java EE ��ҵӦ��ʵս': '2009��12��', 'JavaScript: The Definitive Guide': '2012��12��'}"
listKey="key"
listValue="value"
/>

<!-- ʹ�� Java been ����Ϊ���� -->
<s:bean name="org.jack.app.po.BookService" id="bs"/>

<s:select
name="c"
label="��ѡ ����ϲ����ͼ��"
labelposition="top"
mutltiple="true" 
list="#bs.books"
listKey="author"
listValue="name"
/>

</s:form>


</body>
</html>