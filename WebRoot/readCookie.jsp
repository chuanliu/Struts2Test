<%@ page contentType="text/html; charset=gb2312" language="java" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
<HEAD>
<TITLE>��ȡCookie</TITLE>
</HEAD>
<BODY>
<%
//��ȡ��վ�ڿͻ����ϱ���������Cookie
Cookie[] cookies = request.getCookies();
//�����ͻ����ϵ�ÿ��Cookie
for (Cookie c : cookies)
 {
	//���Cookie����Ϊusername��������Cookie��������Ҫ���ʵ�Cookie
	if(c.getName().equals("user"))
		
	{
		out.println(c.getValue());
	}
}  
%>
</BODY>
</HTML>
