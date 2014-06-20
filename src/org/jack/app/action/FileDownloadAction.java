package org.jack.app.action;

import java.io.InputStream;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

/**
 * @author Jack
 *
 */
public class FileDownloadAction extends ActionSupport {

	private String inputPath;

	
	/**
	 * @param inputPath
	 */
	public void setInputPath(String inputPath) {
		this.inputPath = inputPath;
	}

	
	/**
	 * @return
	 * @throws Exception
	 */
	public InputStream getTargetFile() throws Exception {
		return ServletActionContext.getServletContext().getResourceAsStream(
				inputPath);

	}

}
