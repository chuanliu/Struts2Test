<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-radio 标签</title>
</head>
<body>
<s:form>
<s:radio 
name="a"
label="请选择您喜欢的图书"
labelposition="top"
list="{'疯狂Java 讲义', '轻量级Java EE 企业应用实战', 'JavaScript: The Definitive Guide'}"
/>

<!-- 使用简单Map对象来生成下拉选择框 -->
<s:radio
name="b"
label="请选 择您喜欢的图书"
labelposition="top"
list="#{'疯狂Java 讲义': '2008年8月', '轻量级Java EE 企业应用实战': '2009年12月', 'JavaScript: The Definitive Guide': '2012年12月'}"
listKey="key"
listValue="value"
/>

<!-- 使用 Java been 来做为集合 -->
<s:bean name="org.jack.app.po.BookService" id="bs"/>

<s:radio
name="c"
label="请选 择您喜欢的图书"
labelposition="top"
list="#bs.books"
listKey="author"
listValue="name"
/>

</s:form>

</body>
</html>