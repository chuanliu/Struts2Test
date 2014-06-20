package org.apache.jsp.WEB_002dINF.extjs;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class ext_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
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
      response.setContentType("text/html");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("<title>Getting Started Example</title>\r\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\"\r\n");
      out.write("\thref=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/styles/extjs4.1.1/resources/css/ext-all.css\" />\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/scripts/extjs4.1.1/extâbase.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/scripts/extjs4.1.1/ext-all-debug.js\"></script>\r\n");
      out.write("<script>\r\n");
      out.write("\t/*  Ext.onReady(function() {\r\n");
      out.write("\t\tExt.Msg.alert('Hello', 'World');\r\n");
      out.write("\t});  */\r\n");
      out.write("\t/* Crab = function(){\r\n");
      out.write("\t\tthis.legs = 10;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tCrab.prototype = {\r\n");
      out.write("\t\tsay: function(){\r\n");
      out.write("\t\talert(\"I'm a Crab, I hava \" + this.legs + \"legs\");\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t};\r\n");
      out.write("\t\t//æµè¯\r\n");
      out.write("\t\tvar crab = new Crab();\r\n");
      out.write("\t\talert(crab.legs);\r\n");
      out.write("\t\tcrab.say(); */\r\n");
      out.write("\t\textjsCustom = function(){\r\n");
      out.write("\t\t\tvar config = {\r\n");
      out.write("\t\t\ttitle: \"Coustom MessageBox\",\r\n");
      out.write("\t\t\tmsg: \"This is a coustom messageBox\",\r\n");
      out.write("\t\t\twidth: 400,\r\n");
      out.write("\t\t\tmultiline: true,\r\n");
      out.write("\t\t\tclosable: false,\r\n");
      out.write("\t\t\tbuttons: Ext.MessageBox.YESNOCANCEL,\r\n");
      out.write("\t\t\ticon: Ext.MessageBox.QUESTION,\r\n");
      out.write("\t\t\tfn: function(btn, txt){\r\n");
      out.write("\t\t\tExt.MessageBox.alert(\"result\", \" You click 'Yes' button <br>, input value is \" + txt);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\t};\r\n");
      out.write("\t\t\tExt.MessageBox.show(config);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\tExt.onReady(extjsCustom);\r\n");
      out.write("</script>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<!ââ Nothing in the body ââ>\r\n");
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
}
