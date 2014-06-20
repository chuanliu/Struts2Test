package org.jack.app.action;

//å¤„ç�†ç”¨æˆ·è¯·æ±‚çš„ç±»å�¯ä»¥æ˜¯ä¸€ä¸ªPIJOç±»ï¼Œæ— éœ€ç»§æ‰¿ä»»ä½•åŸºç±»å’ŒæŽ¥å�£ï¼›
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.lang.*;
import java.util.Arrays;
import java.util.List;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.interceptor.PreResultListener;

/**
 * @author Jack
 * 2014/4/22
 */
public class LoginRegistAction extends ActionSupport{
	private String username;
	private String password;
	private List<String> listtest;

	public List<String> getListtest() {
		return listtest;
	}

	/**
	 * @param listtest
	 */
	public void setListtest(List<String> listtest) {
		this.listtest = listtest;
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
		
		ActionInvocation invocation = ActionContext.getContext().getActionInvocation();
		
		// invocation è¿™æ˜¯ä¸€ä¸ªæ–¹æ³•å›žè°ƒ..
		invocation.addPreResultListener(new PreResultListener()
		{

			@Override
			public void beforeResult(ActionInvocation invocation, String resultCode) {
				System.out.println("è¿”å›žçš„é€»è¾‘è§†å›¾å��ï¼š " + resultCode);
				//åœ¨è¿”å›žResultä¹‹å‰�åŠ å…¥ä¸€ä¸ªé¢�å¤–çš„æ•°æ�®ï¼›
				invocation.getInvocationContext().put("extra", new java.util.Date() + 
						"ç”±" + resultCode + "é€»è¾‘è§†å›¾å��è½¬å…¥");
			}
			
		});
		
		if(getUsername().equals("user")){
			throw new MyException("è‡ªå®šä¹‰å¼‚å¸¸");
		}
		if(getUsername().equals("sql")){
			throw new java.sql.SQLException("ç”¨æˆ·å��ä¸�èƒ½ä¸º SQL");
		}
		
		if (username.equals("Jack") && password.equals("123456")) {
			
			//é€šè¿‡ActionContext è®¾ç½® request èŒƒå›´çš„å±žæ€§ã€‚
			ActionContext.getContext().put("tip", "æœ�åŠ¡å™¨æ��ç¤ºï¼šæ‚¨å·²ç»�æˆ�åŠŸç™»é™†");
			listtest=Arrays.asList("æ°´æµ’", "è¥¿æ¸¸è®°", "çº¢æ¥¼æ¢¦");
			return SUCCESS;
			
		} else {
			//é€šè¿‡ActionContext è®¾ç½® request èŒƒå›´çš„å±žæ€§ã€‚
			ActionContext.getContext().put("tip", getText("failTip"));
			return ERROR;
		}
	}
	
	public String regist() throws Exception{
		
		ActionContext.getContext().getSession().put("user", getUsername());
		ActionContext.getContext().put("tip", getUsername() + "ï¼Œ æ‚¨å·²ç»�æ³¨å†Œæˆ�åŠŸï¼�");
		return SUCCESS;
	}

}
