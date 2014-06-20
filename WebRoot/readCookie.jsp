<%@ page contentType="text/html; charset=gb2312" language="java" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
<HEAD>
<TITLE>读取Cookie</TITLE>
</HEAD>
<BODY>
<%
//获取本站在客户端上保留的所有Cookie
Cookie[] cookies = request.getCookies();
//遍历客户端上的每个Cookie
for (Cookie c : cookies)
 {
	//如果Cookie的名为username，表明该Cookie是我们需要访问的Cookie
	if(c.getName().equals("user"))
		
	{
		out.println(c.getValue());
	}
}  
%>
</BODY>
</HTML>
