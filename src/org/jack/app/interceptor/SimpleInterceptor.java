package org.jack.app.interceptor;

import java.util.Date;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class SimpleInterceptor extends AbstractInterceptor{
	private String name;
	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		System.out.println(getName() + "拦截器 " + invocation.getAction() +" 介入---------" + "开始介入时间" + new Date());
		long start=System.currentTimeMillis();
		String result= invocation.invoke();
		System.out.println(getName() + "拦截器结束---------" + "结束时间" + new Date());
		long end=System.currentTimeMillis();
		System.out.println(getName() + "拦截器动作--------" + "执行完action事件事件为" + (end-start) + " 毫秒");
		return result;
	}
	
	

}
