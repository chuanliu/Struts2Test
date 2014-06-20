package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class ext3_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("/scripts/extjs4.1.1/extÃÂ¢ÃÂÃÂbase.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/scripts/extjs4.1.1/ext-all-debug.js\"></script>\r\n");
      out.write("<script>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\tvar movie_form = new Ext.FormPanel({\r\n");
      out.write("\turl: 'movieâformâsubmit.php',\r\n");
      out.write("\trenderTo: document.body,\r\n");
      out.write("\tframe: true,\r\n");
      out.write("\ttitle: 'Movie Information Form',\r\n");
      out.write("\twidth: 300,\r\n");
      out.write("\titems: [{\r\n");
      out.write("\txtype: 'textfield',\r\n");
      out.write("\tfieldLabel: 'Title',\r\n");
      out.write("\tname: 'title',\r\n");
      out.write("\tallowBlank: false\r\n");
      out.write("\t},{\r\n");
      out.write("\txtype: 'textfield',\r\n");
      out.write("\tfieldLabel: 'Director',\r\n");
      out.write("\tname: 'director',\r\n");
      out.write("\tvtype: 'alpha'\r\n");
      out.write("\t},{\r\n");
      out.write("\txtype: 'datefield',\r\n");
      out.write("\tfieldLabel: 'Released',\r\n");
      out.write("\tname: 'released',\r\n");
      out.write("\tdisabledDays: [1,2,3,4,5]\r\n");
      out.write("\t}]\r\n");
      out.write("\t});\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t/* function stapler(){\r\n");
      out.write("\t\tExt.Msg.show({\r\n");
      out.write("\t\ttitle: 'Milton',\r\n");
      out.write("\t\tmsg: 'Have you seen my stapler?',\r\n");
      out.write("\t\tbuttons: {\r\n");
      out.write("\t\tyes: true,\r\n");
      out.write("\t\tno: true,\r\n");
      out.write("\t\tcancel: true\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tExt.onReady(stapler()); */\r\n");
      out.write("</script>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<!-- Nothing in the body -->\r\n");
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
