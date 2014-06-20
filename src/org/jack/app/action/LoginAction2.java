package org.jack.app.action;

//处理用户请求的类可以是一个PIJO类，无需继承任何基类和接口；
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.interceptor.ServletResponseAware;

import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;

public class LoginAction2 implements Action, ServletResponseAware{
	private String username;
	private String password;
	private HttpServletResponse response;
	@Override
	public void setServletResponse(HttpServletResponse response) {
		this.response=response;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String execute() throws Exception {
		ActionContext ctx = ActionContext.getContext();
		Integer counter = (Integer) ctx.getApplication().get("counter");
		if (counter == null) {
			counter = 1;
		} else {
			counter += 1;
		}
		ctx.getApplication().put("counter", counter);
		ctx.getSession().put("user", username);
		
		
		if (username.equals("Jack") && password.equals("123456")) {
			
			//通过response 添加cookie.
			Cookie c= new Cookie("user", getUsername());
			c.setMaxAge(60*60);
			response.addCookie(c);
			//通过ActionContext 设置 request 范围的属性。
			ctx.put("tip", "服务器提示：您已经成功登陆");
			return SUCCESS;
			
		} else {
			//通过ActionContext 设置 request 范围的属性。
			ctx.put("tip", "服务器提示：登陆失败");
			return ERROR;
		}
	}
	
	public String regist() throws Exception{
		
		ActionContext.getContext().getSession().put("user", getUsername());
		ActionContext.getContext().put("tip", getUsername() + "， 您已经注册成功！");
		return SUCCESS;
	}

}
