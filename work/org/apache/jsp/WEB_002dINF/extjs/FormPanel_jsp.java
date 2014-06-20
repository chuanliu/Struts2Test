package org.apache.jsp.WEB_002dINF.extjs;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class FormPanel_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("<script>\r\n");
      out.write("Ext.require([  \r\n");
      out.write("             'Ext.data.*',  \r\n");
      out.write("             'Ext.grid.*'  \r\n");
      out.write("         ]);  \r\n");
      out.write("           \r\n");
      out.write("         Ext.onReady(function(){  \r\n");
      out.write("             Ext.define('Book',{  \r\n");
      out.write("                 extend: 'Ext.data.Model',  \r\n");
      out.write("                 proxy: {  \r\n");
      out.write("                     type: 'ajax',  \r\n");
      out.write("                     reader: 'xml'  \r\n");
      out.write("                 },  \r\n");
      out.write("                 fields: [  \r\n");
      out.write("                     // set up the fields mapping into the xml doc  \r\n");
      out.write("                     // The first needs mapping, the others are very basic  \r\n");
      out.write("                     {name: 'Author', mapping: '@author.name'},  \r\n");
      out.write("                     'Title', 'Manufacturer', 'ProductGroup'  \r\n");
      out.write("                 ]  \r\n");
      out.write("             });  \r\n");
      out.write("           \r\n");
      out.write("             // create the Data Store  \r\n");
      out.write("             var store = Ext.create('Ext.data.Store', {  \r\n");
      out.write("                 model: 'Book',  \r\n");
      out.write("                 autoLoad: true,  \r\n");
      out.write("                 proxy: {  \r\n");
      out.write("                     // load using HTTP  \r\n");
      out.write("                     type: 'ajax',  \r\n");
      out.write("                     url: 'sampledata-sheldon.xml',  \r\n");
      out.write("                     // the return will be XML, so lets set up a reader  \r\n");
      out.write("                     reader: {  \r\n");
      out.write("                         type: 'xml',  \r\n");
      out.write("                         // records will have an \"Item\" tag  \r\n");
      out.write("                         record: 'Item',  \r\n");
      out.write("                         idProperty: 'ASIN',  \r\n");
      out.write("                         totalRecords: '@total'  \r\n");
      out.write("                     }  \r\n");
      out.write("                 }  \r\n");
      out.write("             });  \r\n");
      out.write("           \r\n");
      out.write("             // create the grid  \r\n");
      out.write("             Ext.create('Ext.grid.Panel', {  \r\n");
      out.write("                 store: store,  \r\n");
      out.write("                 columns: [  \r\n");
      out.write("                     {text: \"Author\", flex: 1, dataIndex: 'Author'},  \r\n");
      out.write("                     {text: \"Title\", width: 180, dataIndex: 'Title'},  \r\n");
      out.write("                     {text: \"Manufacturer\", width: 115, dataIndex: 'Manufacturer'},  \r\n");
      out.write("                     {text: \"Product Group\", width: 100, dataIndex: 'ProductGroup'}  \r\n");
      out.write("                 ],  \r\n");
      out.write("                 renderTo:'example-grid',  \r\n");
      out.write("                 width: 540,  \r\n");
      out.write("                 height: 200  \r\n");
      out.write("             });  \r\n");
      out.write("         });  \r\n");
      out.write("</script>\r\n");
      out.write("\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write(" <div id=\"example-grid\"></div>\r\n");
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
