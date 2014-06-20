package org.apache.jsp.WEB_002dINF.extjs;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class DatePicker_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("/scripts/extjs4.1.1/extÃ¢ÂÂbase.js\"></script>\r\n");
      out.write("<script\r\n");
      out.write("\tsrc=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${pageContext.request.contextPath}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/scripts/extjs4.1.1/ext-all-debug.js\"></script>\r\n");
      out.write("\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<script>\r\n");
      out.write("\tExt.onReady(function(){\r\n");
      out.write("\t\tvar cities = [\r\n");
      out.write("\t\t[1, \"é¿æ²å¸\"],\r\n");
      out.write("\t\t[2, \"æ ªæ´²å¸\"],\r\n");
      out.write("\t\t[3, \"æ¹æ½­å¸\"],\r\n");
      out.write("\t\t[4, \"éµé³å¸\"]\r\n");
      out.write("\t\t];\r\n");
      out.write("\t\tvar proxy = new Ext.data.MemoryProxy(cities);\r\n");
      out.write("\t\tvar City = Ext.data.Record.create([\r\n");
      out.write("\t\t{name: \"cid\", type: \"int\", mapping: 0},\r\n");
      out.write("\t\t{name: \"cname\", type: \"string\", mapping: 1}\r\n");
      out.write("\t\t]);\r\n");
      out.write("\t\t//var reader = new Ext.data.ArrayReader({}, City);\r\n");
      out.write("\t\tvar reader = new Ext.data.ArrayReader({}, [\r\n");
      out.write("\t\t{name: \"cid\", type: \"int\", mapping: 0},\r\n");
      out.write("\t\t{name: \"cname\", type: \"string\", mapping: 1}\r\n");
      out.write("\t\t]);\r\n");
      out.write("\t\t\r\n");
      out.write("\t\tvar store = new Ext.data.Store({\r\n");
      out.write("\t\t\tproxy: proxy,\r\n");
      out.write("\t\t\treader: reader,\r\n");
      out.write("\t\t\tautoLoad: true //å³æ¶å è½½æ°æ®\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\t//store.load();\r\n");
      out.write("\t\t\tvar combobox = new Ext.form.ComboBox({\r\n");
      out.write("\t\t\trenderTo: Ext.getBody(),\r\n");
      out.write("\t\t\ttriggerAction: \"all\",\r\n");
      out.write("\t\t\tstore: store,\r\n");
      out.write("\t\t\tdisplayField: \"cname\",\r\n");
      out.write("\t\t\tvalueField: \"cid\",\r\n");
      out.write("\t\t\tmode: \"local\",\r\n");
      out.write("\t\t\temptyText: \"è¯·éæ©æ¹ååå¸\"\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\tvar btn = new Ext.Button({\r\n");
      out.write("\t\t\ttext: \"åè¡¨æ¡çå¼\",\r\n");
      out.write("\t\t\trenderTo: Ext.getBody(),\r\n");
      out.write("\t\t\thandler: function(){\r\n");
      out.write("\t\t\tExt.Msg.alert(\"å¼\", \"å®éå¼ï¼\" + combobox.getValue() + \"ï¼æ¾ç¤ºå¼ï¼\" +\r\n");
      out.write("\t\t\tcombobox.getRawValue());\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\t})\r\n");
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
