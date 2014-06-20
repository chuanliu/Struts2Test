package org.apache.jsp.WEB_002dINF.extjs;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class Toolbar_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      response.setContentType("text/html; charset=gb2312");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
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
      out.write("/scripts/extjs4.1.1/ext-all-debug.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/scripts/extjs4.1.1/ext-all.js\"></script>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<script>\r\n");
      out.write("\t\tExt.onReady(function() {\r\n");
      out.write("\t\t\tExt.create('Ext.toolbar.Toolbar', {\r\n");
      out.write("\t\t\t\trenderTo : document.body,\r\n");
      out.write("\t\t\t\twidth : 500,\r\n");
      out.write("\t\t\t\titems : [ {\r\n");
      out.write("\t\t\t\t\t// xtype: 'button', // default for Toolbars\r\n");
      out.write("\t\t\t\t\ttext : 'Button'\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\txtype : 'splitbutton',\r\n");
      out.write("\t\t\t\t\ttext : 'Split Button'\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\t// begin using the right-justified button container\r\n");
      out.write("\t\t\t\t'->', // same as { xtype: 'tbfill' }\r\n");
      out.write("\t\t\t\t{\r\n");
      out.write("\t\t\t\t\txtype : 'textfield',\r\n");
      out.write("\t\t\t\t\tname : 'field1',\r\n");
      out.write("\t\t\t\t\temptyText : 'enter search term'\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\t// add a vertical separator bar between toolbar items\r\n");
      out.write("\t\t\t\t'-', // same as {xtype: 'tbseparator'} to create Ext.toolbar.Separator\r\n");
      out.write("\t\t\t\t'text 1', // same as {xtype: 'tbtext', text: 'text1'} to create Ext.toolbar.TextItem\r\n");
      out.write("\t\t\t\t{\r\n");
      out.write("\t\t\t\t\txtype : 'tbspacer'\r\n");
      out.write("\t\t\t\t},// same as ' ' to create Ext.toolbar.Spacer\r\n");
      out.write("\t\t\t\t'text 2', {\r\n");
      out.write("\t\t\t\t\txtype : 'tbspacer',\r\n");
      out.write("\t\t\t\t\twidth : 50\r\n");
      out.write("\t\t\t\t}, // add a 50px space\r\n");
      out.write("\t\t\t\t'text 3' ]\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t});\r\n");
      out.write("\t</script>\r\n");
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
}
