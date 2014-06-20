package org.apache.jsp.WEB_002dINF.extjs;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class FormPanel3_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<script>\r\n");
      out.write("\t\tExt.onReady(function() {\r\n");
      out.write("\t\t\t// refer to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/\r\n");
      out.write("\t\t\t'use strict';\r\n");
      out.write("\t\t\tvar genres = new Ext.data.SimpleStore({\r\n");
      out.write("\t\t\t\tfields : [ 'id', 'genre' ],\r\n");
      out.write("\t\t\t\tdata : [ [ '0', 'New genres' ], [ '1', 'Comedy' ], [ '2', 'Drama' ],\r\n");
      out.write("\t\t\t\t\t\t[ '3', 'Action' ] ]\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\tvar test = new Ext.form.TextField({\r\n");
      out.write("\t\t\t\tfieldLabel : 'Title2',\r\n");
      out.write("\t\t\t\tname : 'title2',\r\n");
      out.write("\t\t\t\tallowBlank : false\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\tvar movie_form = new Ext.FormPanel({\r\n");
      out.write("\t\t\t\turl : 'movie��orm��ubmit.php',\r\n");
      out.write("\t\t\t\trenderTo : document.body,\r\n");
      out.write("\t\t\t\tframe : true,\r\n");
      out.write("\t\t\t\ttitle : 'Movie Information Form',\r\n");
      out.write("\t\t\t\twidth : 350,\r\n");
      out.write("\t\t\t\titems : [ {\r\n");
      out.write("\t\t\t\t\txtype : 'textfield',\r\n");
      out.write("\t\t\t\t\tfieldLabel : 'Title',\r\n");
      out.write("\t\t\t\t\tname : 'title',\r\n");
      out.write("\t\t\t\t\tallowBlank : false,\r\n");
      out.write("\t\t\t\t\tlisteners : {\r\n");
      out.write("\t\t\t\t\t\tspecialkey : function(f, e) {\r\n");
      out.write("\t\t\t\t\t\t\tif (e.getKey() == e.ENTER) {\r\n");
      out.write("\t\t\t\t\t\t\t\tmovie_form.getForm().submit();\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t}, test, {\r\n");
      out.write("\t\t\t\t\txtype : 'textfield',\r\n");
      out.write("\t\t\t\t\tfieldLabel : 'Director',\r\n");
      out.write("\t\t\t\t\tname : 'director',\r\n");
      out.write("\t\t\t\t\tvtype : 'alpha'\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\txtype : 'datefield',\r\n");
      out.write("\t\t\t\t\tfieldLabel : 'Released',\r\n");
      out.write("\t\t\t\t\tname : 'released',\r\n");
      out.write("\t\t\t\t\tdisabledDays : [ 0, 6 ]\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\txtype : 'radio',\r\n");
      out.write("\t\t\t\t\tfieldLabel : 'Filmed In',\r\n");
      out.write("\t\t\t\t\tname : 'filmed_in',\r\n");
      out.write("\t\t\t\t\tboxLabel : 'Color'\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\txtype : 'radio',\r\n");
      out.write("\t\t\t\t\thideLabel : true,\r\n");
      out.write("\t\t\t\t\tlabelSeparator : '',\r\n");
      out.write("\t\t\t\t\tname : 'filmed_in',\r\n");
      out.write("\t\t\t\t\tboxLabel : 'Black & White'\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\txtype : 'checkbox',\r\n");
      out.write("\t\t\t\t\tfieldLabel : 'Bad Movie',\r\n");
      out.write("\t\t\t\t\tname : 'bad_movie'\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\txtype : 'combo',\r\n");
      out.write("\t\t\t\t\tname : 'genre',\r\n");
      out.write("\t\t\t\t\tfieldLabel : 'Genre',\r\n");
      out.write("\t\t\t\t\tmode : 'local',\r\n");
      out.write("\t\t\t\t\tstore : genres,\r\n");
      out.write("\t\t\t\t\tdisplayField : 'genre',\r\n");
      out.write("\t\t\t\t\t// width : 200\r\n");
      out.write("\t\t\t\t\tlisteners : {\r\n");
      out.write("\t\t\t\t\t\tselect : function(f, r, i) {\r\n");
      out.write("\t\t\t\t\t\t\tif (i == 0) {\r\n");
      out.write("\t\t\t\t\t\t\t\tExt.Msg.prompt('New Genre', 'Name', Ext.emptyFn);\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\txtype : 'htmleditor',\r\n");
      out.write("\t\t\t\t\tname : 'description',\r\n");
      out.write("\t\t\t\t\thideLabel : true,\r\n");
      out.write("\t\t\t\t\tlabelSeparator : '',\r\n");
      out.write("\t\t\t\t\theight : 100,\r\n");
      out.write("\t\t\t\t\tanchor : '100%'\r\n");
      out.write("\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\tbuttons : [ {\r\n");
      out.write("\t\t\t\t\t\ttext : 'Save',\r\n");
      out.write("\t\t\t\t\t\thandler : function() {\r\n");
      out.write("\t\t\t\t\t\t\tmovie_form.getForm().submit({\r\n");
      out.write("\t\t\t\t\t\t\t\tsuccess : function(f, a) {\r\n");
      out.write("\t\t\t\t\t\t\t\t\tExt.Msg.alert('Success', 'It worked');\r\n");
      out.write("\t\t\t\t\t\t\t\t},\r\n");
      out.write("\t\t\t\t\t\t\t\tfailure : function(f, a) {\r\n");
      out.write("\t\t\t\t\t\t\t\t\tExt.Msg.alert('Warning', 'Error');\r\n");
      out.write("\t\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t}, {\r\n");
      out.write("\t\t\t\t\t\ttext : 'Reset',\r\n");
      out.write("\t\t\t\t\t\thandler : function() {\r\n");
      out.write("\t\t\t\t\t\t\tmovie_form.getForm().reset();\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t} ]\r\n");
      out.write("\t\t\t\t} ]\r\n");
      out.write("\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t\tmovie_form.getForm().findField('title').setValue('Dumb & Dumber');\r\n");
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
