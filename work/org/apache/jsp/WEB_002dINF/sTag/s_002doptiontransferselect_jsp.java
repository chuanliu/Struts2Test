package org.apache.jsp.WEB_002dINF.sTag;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class s_002doptiontransferselect_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fs_005fform;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fs_005foptiontransferselect_0026_005fselectAllLabel_005frightTitle_005fname_005fmultiple_005flist_005fleftTitle_005flabelposition_005flabel_005fheaderValue_005fheaderKey_005femptyOption_005fdoubleName_005fdoubleMultiple_005fdoubleList_005fdoubleHeaderValue_005fdoubleHeaderKey_005fdoubleEmptyOption_005faddToLeftLabel_005faddAllToRightLabel_005fnobody;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fs_005fform = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fs_005foptiontransferselect_0026_005fselectAllLabel_005frightTitle_005fname_005fmultiple_005flist_005fleftTitle_005flabelposition_005flabel_005fheaderValue_005fheaderKey_005femptyOption_005fdoubleName_005fdoubleMultiple_005fdoubleList_005fdoubleHeaderValue_005fdoubleHeaderKey_005fdoubleEmptyOption_005faddToLeftLabel_005faddAllToRightLabel_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fs_005fform.release();
    _005fjspx_005ftagPool_005fs_005foptiontransferselect_0026_005fselectAllLabel_005frightTitle_005fname_005fmultiple_005flist_005fleftTitle_005flabelposition_005flabel_005fheaderValue_005fheaderKey_005femptyOption_005fdoubleName_005fdoubleMultiple_005fdoubleList_005fdoubleHeaderValue_005fdoubleHeaderKey_005fdoubleEmptyOption_005faddToLeftLabel_005faddAllToRightLabel_005fnobody.release();
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=GBK");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("\r\n");
      out.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("<title>Optiontransfer 标签</title>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\r\n");
      if (_jspx_meth_s_005fform_005f0(_jspx_page_context))
        return;
      out.write("\r\n");
      out.write("</body>\r\n");
      out.write("</html>");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }

  private boolean _jspx_meth_s_005fform_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  s:form
    org.apache.struts2.views.jsp.ui.FormTag _jspx_th_s_005fform_005f0 = (org.apache.struts2.views.jsp.ui.FormTag) _005fjspx_005ftagPool_005fs_005fform.get(org.apache.struts2.views.jsp.ui.FormTag.class);
    _jspx_th_s_005fform_005f0.setPageContext(_jspx_page_context);
    _jspx_th_s_005fform_005f0.setParent(null);
    int _jspx_eval_s_005fform_005f0 = _jspx_th_s_005fform_005f0.doStartTag();
    if (_jspx_eval_s_005fform_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      if (_jspx_eval_s_005fform_005f0 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE) {
        out = _jspx_page_context.pushBody();
        _jspx_th_s_005fform_005f0.setBodyContent((javax.servlet.jsp.tagext.BodyContent) out);
        _jspx_th_s_005fform_005f0.doInitBody();
      }
      do {
        out.write('\r');
        out.write('\n');
        if (_jspx_meth_s_005foptiontransferselect_005f0(_jspx_th_s_005fform_005f0, _jspx_page_context))
          return true;
        out.write('\r');
        out.write('\n');
        int evalDoAfterBody = _jspx_th_s_005fform_005f0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
      if (_jspx_eval_s_005fform_005f0 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE) {
        out = _jspx_page_context.popBody();
      }
    }
    if (_jspx_th_s_005fform_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fs_005fform.reuse(_jspx_th_s_005fform_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fs_005fform.reuse(_jspx_th_s_005fform_005f0);
    return false;
  }

  private boolean _jspx_meth_s_005foptiontransferselect_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_s_005fform_005f0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  s:optiontransferselect
    org.apache.struts2.views.jsp.ui.OptionTransferSelectTag _jspx_th_s_005foptiontransferselect_005f0 = (org.apache.struts2.views.jsp.ui.OptionTransferSelectTag) _005fjspx_005ftagPool_005fs_005foptiontransferselect_0026_005fselectAllLabel_005frightTitle_005fname_005fmultiple_005flist_005fleftTitle_005flabelposition_005flabel_005fheaderValue_005fheaderKey_005femptyOption_005fdoubleName_005fdoubleMultiple_005fdoubleList_005fdoubleHeaderValue_005fdoubleHeaderKey_005fdoubleEmptyOption_005faddToLeftLabel_005faddAllToRightLabel_005fnobody.get(org.apache.struts2.views.jsp.ui.OptionTransferSelectTag.class);
    _jspx_th_s_005foptiontransferselect_005f0.setPageContext(_jspx_page_context);
    _jspx_th_s_005foptiontransferselect_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_s_005fform_005f0);
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = label type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setLabel("请选择您喜欢的图书");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = labelposition type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setLabelposition("top");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = name type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setName("cnbook");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = leftTitle type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setLeftTitle("中文图书：");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = rightTitle type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setRightTitle("外文图书：");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = list type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setList("{'疯狂Java 讲义','head first','设计模式'}");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = multiple type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setMultiple("true");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = addToLeftLabel type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setAddToLeftLabel("向左移动");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = selectAllLabel type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setSelectAllLabel("全部选择");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = addAllToRightLabel type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setAddAllToRightLabel("全部右移");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = headerKey type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setHeaderKey("cnKey");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = headerValue type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setHeaderValue("---选择中文图书---");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = emptyOption type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setEmptyOption("true");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = doubleList type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setDoubleList("{'Expert One-on-One J2EE Design and Develpment', 'JavaScript: The Definitive Guide'}");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = doubleName type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setDoubleName("enBook");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = doubleHeaderKey type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setDoubleHeaderKey("enKey");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = doubleHeaderValue type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setDoubleHeaderValue("---选择外文图书---");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = doubleEmptyOption type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setDoubleEmptyOption("true");
    // /WEB-INF/sTag/s-optiontransferselect.jsp(11,0) name = doubleMultiple type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005foptiontransferselect_005f0.setDoubleMultiple("true");
    int _jspx_eval_s_005foptiontransferselect_005f0 = _jspx_th_s_005foptiontransferselect_005f0.doStartTag();
    if (_jspx_th_s_005foptiontransferselect_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fs_005foptiontransferselect_0026_005fselectAllLabel_005frightTitle_005fname_005fmultiple_005flist_005fleftTitle_005flabelposition_005flabel_005fheaderValue_005fheaderKey_005femptyOption_005fdoubleName_005fdoubleMultiple_005fdoubleList_005fdoubleHeaderValue_005fdoubleHeaderKey_005fdoubleEmptyOption_005faddToLeftLabel_005faddAllToRightLabel_005fnobody.reuse(_jspx_th_s_005foptiontransferselect_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fs_005foptiontransferselect_0026_005fselectAllLabel_005frightTitle_005fname_005fmultiple_005flist_005fleftTitle_005flabelposition_005flabel_005fheaderValue_005fheaderKey_005femptyOption_005fdoubleName_005fdoubleMultiple_005fdoubleList_005fdoubleHeaderValue_005fdoubleHeaderKey_005fdoubleEmptyOption_005faddToLeftLabel_005faddAllToRightLabel_005fnobody.reuse(_jspx_th_s_005foptiontransferselect_005f0);
    return false;
  }
}
