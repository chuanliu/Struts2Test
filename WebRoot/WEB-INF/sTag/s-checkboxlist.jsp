<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>s-checkboxlist ��ǩ</title>
</head>
<body>
<s:form>
<!--ʹ�ü򵥵ļ��������ɶ����ѡ��-->
<s:checkboxlist 
name="a"
label="��ѡ����ϲ������"
labelposition="top" 
list="{'���Java ����','head first','���ģʽ'}" />
 
 <!--ʹ�ü򵥵�Map���������ɶ����ѡ��
 ʹ��map�����Key����������Ϊ��ѡ���value��
 ʹ��map�����value������ʱ�䣩��Ϊ��ѡ��ı�ǩ  -->
 <s:checkboxlist
 name="b"
 label="��ѡ������ѡ��ĳ�������"
 labelposition="top"
 list="#{'���Java ����':'2008 �� 9 ��', 'head first':'2009 �� 12 ��','���ģʽ':'2005 �� 9 ��' }"
 listKey="key"
 listValue="value"/>
 <!-- ��ʵ������������ -->
 <s:bean name="org.jack.app.po.BookService" id="bs"/>
 <s:checkboxlist 
 name="b" 
 label="��ѡ����ϲ����ͼ��" 
 labelposition="top" 
 list="#bs.books"
 listKey="author"
 listValue="name"/>
 
</s:form>
</body>
</html>