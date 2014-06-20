package org.apache.jsp.WEB_002dINF.sTag;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class s_002dradio_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fs_005fform;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flist_005flabelposition_005flabel_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fs_005fbean_0026_005fname_005fid_005fnobody;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fs_005fform = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flist_005flabelposition_005flabel_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fs_005fbean_0026_005fname_005fid_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fs_005fform.release();
    _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flist_005flabelposition_005flabel_005fnobody.release();
    _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody.release();
    _005fjspx_005ftagPool_005fs_005fbean_0026_005fname_005fid_005fnobody.release();
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
      out.write("<title>s-radio 标签</title>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      if (_jspx_meth_s_005fform_005f0(_jspx_page_context))
        return;
      out.write("\r\n");
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
        if (_jspx_meth_s_005fradio_005f0(_jspx_th_s_005fform_005f0, _jspx_page_context))
          return true;
        out.write("\r\n");
        out.write("\r\n");
        out.write("<!-- 使用简单Map对象来生成下拉选择框 -->\r\n");
        if (_jspx_meth_s_005fradio_005f1(_jspx_th_s_005fform_005f0, _jspx_page_context))
          return true;
        out.write("\r\n");
        out.write("\r\n");
        out.write("<!-- 使用 Java been 来做为集合 -->\r\n");
        if (_jspx_meth_s_005fbean_005f0(_jspx_th_s_005fform_005f0, _jspx_page_context))
          return true;
        out.write("\r\n");
        out.write("\r\n");
        if (_jspx_meth_s_005fradio_005f2(_jspx_th_s_005fform_005f0, _jspx_page_context))
          return true;
        out.write("\r\n");
        out.write("\r\n");
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

  private boolean _jspx_meth_s_005fradio_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_s_005fform_005f0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  s:radio
    org.apache.struts2.views.jsp.ui.RadioTag _jspx_th_s_005fradio_005f0 = (org.apache.struts2.views.jsp.ui.RadioTag) _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flist_005flabelposition_005flabel_005fnobody.get(org.apache.struts2.views.jsp.ui.RadioTag.class);
    _jspx_th_s_005fradio_005f0.setPageContext(_jspx_page_context);
    _jspx_th_s_005fradio_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_s_005fform_005f0);
    // /WEB-INF/sTag/s-radio.jsp(10,0) name = name type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f0.setName("a");
    // /WEB-INF/sTag/s-radio.jsp(10,0) name = label type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f0.setLabel("请选择您喜欢的图书");
    // /WEB-INF/sTag/s-radio.jsp(10,0) name = labelposition type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f0.setLabelposition("top");
    // /WEB-INF/sTag/s-radio.jsp(10,0) name = list type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f0.setList("{'疯狂Java 讲义', '轻量级Java EE 企业应用实战', 'JavaScript: The Definitive Guide'}");
    int _jspx_eval_s_005fradio_005f0 = _jspx_th_s_005fradio_005f0.doStartTag();
    if (_jspx_th_s_005fradio_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flist_005flabelposition_005flabel_005fnobody.reuse(_jspx_th_s_005fradio_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flist_005flabelposition_005flabel_005fnobody.reuse(_jspx_th_s_005fradio_005f0);
    return false;
  }

  private boolean _jspx_meth_s_005fradio_005f1(javax.servlet.jsp.tagext.JspTag _jspx_th_s_005fform_005f0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  s:radio
    org.apache.struts2.views.jsp.ui.RadioTag _jspx_th_s_005fradio_005f1 = (org.apache.struts2.views.jsp.ui.RadioTag) _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody.get(org.apache.struts2.views.jsp.ui.RadioTag.class);
    _jspx_th_s_005fradio_005f1.setPageContext(_jspx_page_context);
    _jspx_th_s_005fradio_005f1.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_s_005fform_005f0);
    // /WEB-INF/sTag/s-radio.jsp(18,0) name = name type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f1.setName("b");
    // /WEB-INF/sTag/s-radio.jsp(18,0) name = label type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f1.setLabel("请选 择您喜欢的图书");
    // /WEB-INF/sTag/s-radio.jsp(18,0) name = labelposition type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f1.setLabelposition("top");
    // /WEB-INF/sTag/s-radio.jsp(18,0) name = list type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f1.setList("#{'疯狂Java 讲义': '2008年8月', '轻量级Java EE 企业应用实战': '2009年12月', 'JavaScript: The Definitive Guide': '2012年12月'}");
    // /WEB-INF/sTag/s-radio.jsp(18,0) name = listKey type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f1.setListKey("key");
    // /WEB-INF/sTag/s-radio.jsp(18,0) name = listValue type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f1.setListValue("value");
    int _jspx_eval_s_005fradio_005f1 = _jspx_th_s_005fradio_005f1.doStartTag();
    if (_jspx_th_s_005fradio_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody.reuse(_jspx_th_s_005fradio_005f1);
      return true;
    }
    _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody.reuse(_jspx_th_s_005fradio_005f1);
    return false;
  }

  private boolean _jspx_meth_s_005fbean_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_s_005fform_005f0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  s:bean
    org.apache.struts2.views.jsp.BeanTag _jspx_th_s_005fbean_005f0 = (org.apache.struts2.views.jsp.BeanTag) _005fjspx_005ftagPool_005fs_005fbean_0026_005fname_005fid_005fnobody.get(org.apache.struts2.views.jsp.BeanTag.class);
    _jspx_th_s_005fbean_005f0.setPageContext(_jspx_page_context);
    _jspx_th_s_005fbean_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_s_005fform_005f0);
    // /WEB-INF/sTag/s-radio.jsp(28,0) name = name type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fbean_005f0.setName("org.jack.app.po.BookService");
    // /WEB-INF/sTag/s-radio.jsp(28,0) name = id type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fbean_005f0.setId("bs");
    int _jspx_eval_s_005fbean_005f0 = _jspx_th_s_005fbean_005f0.doStartTag();
    if (_jspx_th_s_005fbean_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fs_005fbean_0026_005fname_005fid_005fnobody.reuse(_jspx_th_s_005fbean_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fs_005fbean_0026_005fname_005fid_005fnobody.reuse(_jspx_th_s_005fbean_005f0);
    return false;
  }

  private boolean _jspx_meth_s_005fradio_005f2(javax.servlet.jsp.tagext.JspTag _jspx_th_s_005fform_005f0, PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  s:radio
    org.apache.struts2.views.jsp.ui.RadioTag _jspx_th_s_005fradio_005f2 = (org.apache.struts2.views.jsp.ui.RadioTag) _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody.get(org.apache.struts2.views.jsp.ui.RadioTag.class);
    _jspx_th_s_005fradio_005f2.setPageContext(_jspx_page_context);
    _jspx_th_s_005fradio_005f2.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_s_005fform_005f0);
    // /WEB-INF/sTag/s-radio.jsp(30,0) name = name type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f2.setName("c");
    // /WEB-INF/sTag/s-radio.jsp(30,0) name = label type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f2.setLabel("请选 择您喜欢的图书");
    // /WEB-INF/sTag/s-radio.jsp(30,0) name = labelposition type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f2.setLabelposition("top");
    // /WEB-INF/sTag/s-radio.jsp(30,0) name = list type = java.lang.String reqTime = false required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f2.setList("#bs.books");
    // /WEB-INF/sTag/s-radio.jsp(30,0) name = listKey type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f2.setListKey("author");
    // /WEB-INF/sTag/s-radio.jsp(30,0) name = listValue type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_s_005fradio_005f2.setListValue("name");
    int _jspx_eval_s_005fradio_005f2 = _jspx_th_s_005fradio_005f2.doStartTag();
    if (_jspx_th_s_005fradio_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody.reuse(_jspx_th_s_005fradio_005f2);
      return true;
    }
    _005fjspx_005ftagPool_005fs_005fradio_0026_005fname_005flistValue_005flistKey_005flist_005flabelposition_005flabel_005fnobody.reuse(_jspx_th_s_005fradio_005f2);
    return false;
  }
}
