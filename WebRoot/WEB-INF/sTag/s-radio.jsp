<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-radio ��ǩ</title>
</head>
<body>
<s:form>
<s:radio 
name="a"
label="��ѡ����ϲ����ͼ��"
labelposition="top"
list="{'���Java ����', '������Java EE ��ҵӦ��ʵս', 'JavaScript: The Definitive Guide'}"
/>

<!-- ʹ�ü�Map��������������ѡ��� -->
<s:radio
name="b"
label="��ѡ ����ϲ����ͼ��"
labelposition="top"
list="#{'���Java ����': '2008��8��', '������Java EE ��ҵӦ��ʵս': '2009��12��', 'JavaScript: The Definitive Guide': '2012��12��'}"
listKey="key"
listValue="value"
/>

<!-- ʹ�� Java been ����Ϊ���� -->
<s:bean name="org.jack.app.po.BookService" id="bs"/>

<s:radio
name="c"
label="��ѡ ����ϲ����ͼ��"
labelposition="top"
list="#bs.books"
listKey="author"
listValue="name"
/>

</s:form>

</body>
</html>