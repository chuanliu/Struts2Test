<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-checkboxlist 标签</title>
</head>
<body>
<s:form>
<!--使用简单的集合来生成多个复选框-->
<s:checkboxlist 
name="a"
label="请选择您喜欢的书"
labelposition="top" 
list="{'疯狂Java 讲义','head first','设计模式'}" />
 
 <!--使用简单的Map对象来生成多个复选框
 使用map对象的Key（书名）作为复选框的value，
 使用map对象的value（出版时间）作为复选框的标签  -->
 <s:checkboxlist
 name="b"
 label="请选择您想选择的出版日期"
 labelposition="top"
 list="#{'疯狂Java 讲义':'2008 年 9 月', 'head first':'2009 年 12 月','设计模式':'2005 年 9 月' }"
 listKey="key"
 listValue="value"/>
 <!-- 用实体类来做集合 -->
 <s:bean name="org.jack.app.po.BookService" id="bs"/>
 <s:checkboxlist 
 name="b" 
 label="请选择您喜欢的图书" 
 labelposition="top" 
 list="#bs.books"
 listKey="author"
 listValue="name"/>
 
</s:form>
</body>
</html>