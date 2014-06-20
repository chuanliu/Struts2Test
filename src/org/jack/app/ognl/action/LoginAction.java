package org.jack.app.ognl.action;

import java.util.List;
import java.util.Map;

import com.opensymphony.xwork2.Action;

public class LoginAction implements Action {
	private User user;
	private String tip;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getTip() {
		return tip;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

	@Override
	public String execute() throws Exception {
		if (getUser().getName().equals("Jack")
				&& getUser().getPass().equals("123456")) {

			setTip("登录成功");
			return SUCCESS;
		} else {

			setTip("登录失败");
			return ERROR;
		}
	}

	//use Map
	private Map<String, User> users;

	public Map<String, User> getUsers() {
		return users;
	}

	public void setUsers(Map<String, User> users) {
		this.users = users;
	}

	public String executeMap() throws Exception {
		if (getUsers().get("One").getName().equals("Jack")
				&& getUsers().get("One").getPass().equals("123456")) {

			setTip("登录成功");
			return SUCCESS;
		} else {

			setTip("登录失败");
			return ERROR;
		}

	}
	
	//use List<User>
	private List<User> users2;

	public List<User> getUsers2() {
		return users2;
	}

	public void setUsers2(List<User> users2) {
		this.users2 = users2;
	}
	
	public String executeList() throws Exception {
		if (getUsers2().get(0).getName().equals("Jack")
				&& getUsers2().get(0).getPass().equals("123456")) {
			setTip("登录成功");
			return SUCCESS;
		} else {

			setTip("登录失败");
			return ERROR;
		}

	}
	
	
	
}
