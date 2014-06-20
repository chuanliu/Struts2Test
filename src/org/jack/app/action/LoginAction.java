package org.jack.app.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class LoginAction extends ActionSupport{
	private String username;
	private String password;
	private String Tip;
	
	public String getTip() {
		return Tip;
	}
	public void setTip(String tip) {
		Tip = tip;
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
		if(username.equals("Jack") && password.equals("123456")){
			ActionContext.getContext().put("user", getUsername());
			setTip("SUCCESS");
			return SUCCESS;
		}
		else{
			setTip("ERROR");
			return ERROR;
		}
	}
	

}
