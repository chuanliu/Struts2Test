package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.*;

public final class login3_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write('\r');
      out.write('\n');

String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

      out.write("\r\n");
      out.write("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\r\n");
      out.write("<title>图书管理系统登录</title>\r\n");
      out.write("<style type=\"text/css\">\r\n");
      out.write("<!--\r\n");
      out.write("body {\r\n");
      out.write("\tmargin-left: 0px;\r\n");
      out.write("\tmargin-top: 0px;\r\n");
      out.write("\tmargin-right: 0px;\r\n");
      out.write("\tmargin-bottom: 0px;\r\n");
      out.write("\tbackground-color: #1D3647;\r\n");
      out.write("}\r\n");
      out.write("-->\r\n");
      out.write("</style>\r\n");
      out.write("<script language=\"JavaScript\">\r\n");
      out.write("function correctPNG()\r\n");
      out.write("{\r\n");
      out.write("    var arVersion = navigator.appVersion.split(\"MSIE\")\r\n");
      out.write("    var version = parseFloat(arVersion[1])\r\n");
      out.write("    if ((version >= 5.5) && (document.body.filters)) \r\n");
      out.write("    {\r\n");
      out.write("       for(var j=0; j<document.images.length; j++)\r\n");
      out.write("       {\r\n");
      out.write("          var img = document.images[j]\r\n");
      out.write("          var imgName = img.src.toUpperCase()\r\n");
      out.write("          if (imgName.substring(imgName.length-3, imgName.length) == \"PNG\")\r\n");
      out.write("          {\r\n");
      out.write("             var imgID = (img.id) ? \"id='\" + img.id + \"' \" : \"\"\r\n");
      out.write("             var imgClass = (img.className) ? \"class='\" + img.className + \"' \" : \"\"\r\n");
      out.write("             var imgTitle = (img.title) ? \"title='\" + img.title + \"' \" : \"title='\" + img.alt + \"' \"\r\n");
      out.write("             var imgStyle = \"display:inline-block;\" + img.style.cssText \r\n");
      out.write("             if (img.align == \"left\") imgStyle = \"float:left;\" + imgStyle\r\n");
      out.write("             if (img.align == \"right\") imgStyle = \"float:right;\" + imgStyle\r\n");
      out.write("             if (img.parentElement.href) imgStyle = \"cursor:hand;\" + imgStyle\r\n");
      out.write("             var strNewHTML = \"<span \" + imgID + imgClass + imgTitle\r\n");
      out.write("             + \" style=\\\"\" + \"width:\" + img.width + \"px; height:\" + img.height + \"px;\" + imgStyle + \";\"\r\n");
      out.write("             + \"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader\"\r\n");
      out.write("             + \"(src=\\'\" + img.src + \"\\', sizingMethod='scale');\\\"></span>\" \r\n");
      out.write("             img.outerHTML = strNewHTML\r\n");
      out.write("             j = j-1\r\n");
      out.write("          }\r\n");
      out.write("       }\r\n");
      out.write("    }    \r\n");
      out.write("}\r\n");
      out.write("window.attachEvent(\"onload\", correctPNG);\r\n");
      out.write("</script>\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<link href=\"images/skin.css\" rel=\"stylesheet\" type=\"text/css\">\r\n");
      out.write("<body>\r\n");
      out.write("<table width=\"100%\" height=\"166\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\">\r\n");
      out.write("  <tr>\r\n");
      out.write("    <td height=\"42\" valign=\"top\"><table width=\"100%\" height=\"42\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"login_top_bg\">\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td width=\"1%\" height=\"21\">&nbsp;</td>\r\n");
      out.write("        <td height=\"42\">&nbsp;</td>\r\n");
      out.write("        <td width=\"17%\">&nbsp;</td>\r\n");
      out.write("      </tr>\r\n");
      out.write("    </table></td>\r\n");
      out.write("  </tr>\r\n");
      out.write("  <tr>\r\n");
      out.write("    <td valign=\"top\"><table width=\"100%\" height=\"532\" border=\"2\" cellpadding=\"0\" cellspacing=\"0\" class=\"login_bg\">\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td width=\"49%\" align=\"right\"><table width=\"91%\" height=\"532\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"login_bg2\">\r\n");
      out.write("            <tr>\r\n");
      out.write("              <td height=\"138\" valign=\"top\"><table width=\"89%\" height=\"427\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\r\n");
      out.write("                <tr>\r\n");
      out.write("                  <td height=\"149\">&nbsp;</td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                  <td height=\"80\" align=\"right\" valign=\"top\"><img src=\"images/logo.png\" width=\"279\" height=\"68\"></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                  <td height=\"198\" align=\"right\" valign=\"top\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\r\n");
      out.write("                    <tr>\r\n");
      out.write("                      <td width=\"35%\">&nbsp;</td>\r\n");
      out.write("                      <td height=\"25\" colspan=\"2\" class=\"left_txt\"><p>路漫漫其修道远，吾将上下而求索——屈原 </p></td>\r\n");
      out.write("                    </tr>\r\n");
      out.write("                    <tr>\r\n");
      out.write("                      <td>&nbsp;</td>\r\n");
      out.write("                      <td height=\"25\" colspan=\"2\" class=\"left_txt\"><p>读过一本好书，像交了一个益友——藏克家</p></td>\r\n");
      out.write("                    </tr>\r\n");
      out.write("                    <tr>\r\n");
      out.write("                      <td>&nbsp;</td>\r\n");
      out.write("                      <td height=\"25\" colspan=\"2\" class=\"left_txt\"><p>时间就像海绵里的水，只要愿挤，总还是有的—鲁迅\r\n");
      out.write("\t\t\t\t\t  </p></td>\r\n");
      out.write("                    </tr>\r\n");
      out.write("                    <tr>\r\n");
      out.write("                      <td>&nbsp;</td>\r\n");
      out.write("                    </tr>\r\n");
      out.write("                  </table></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("              </table></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            \r\n");
      out.write("        </table></td>\r\n");
      out.write("        <td width=\"1%\" >&nbsp;</td>\r\n");
      out.write("        <td width=\"50%\" valign=\"bottom\"><table width=\"100%\" height=\"59\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\r\n");
      out.write("            <tr>\r\n");
      out.write("              <td width=\"4%\">&nbsp;</td>\r\n");
      out.write("              <td width=\"96%\" height=\"38\"><span class=\"login_txt_bt\">登录图书管理系统</span></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("              <td>&nbsp;</td>\r\n");
      out.write("              <td height=\"21\"><table cellSpacing=\"0\" cellPadding=\"0\" width=\"100%\" border=\"0\" id=\"table211\" height=\"328\">\r\n");
      out.write("                  <tr>\r\n");
      out.write("                    <td height=\"164\" colspan=\"2\" align=\"middle\">\r\n");
      out.write("                    <form name=\"myform\" action=\"login.action\" method=\"post\">\r\n");
      out.write("                        <table cellSpacing=\"0\" cellPadding=\"0\" width=\"100%\" border=\"0\" height=\"143\" id=\"table212\">\r\n");
      out.write("                          <tr>\r\n");
      out.write("                            <td width=\"13%\" height=\"38\" class=\"top_hui_text\"><span class=\"login_txt\">管理员：&nbsp;&nbsp; </span></td>\r\n");
      out.write("                            <td height=\"38\" colspan=\"2\" class=\"top_hui_text\"><input name=\"username\" class=\"editbox4\" value=\"\" size=\"20\">                            </td>\r\n");
      out.write("                          </tr>\r\n");
      out.write("                          <tr>\r\n");
      out.write("                            <td width=\"13%\" height=\"35\" class=\"top_hui_text\"><span class=\"login_txt\"> 密 码： &nbsp;&nbsp; </span></td>\r\n");
      out.write("                            <td height=\"35\" colspan=\"2\" class=\"top_hui_text\"><input class=\"editbox4\" type=\"password\" size=\"20\" name=\"password\">\r\n");
      out.write("                              <img src=\"images/luck.gif\" width=\"19\" height=\"18\"> </td>\r\n");
      out.write("                          </tr>\r\n");
      out.write("                          <tr>\r\n");
      out.write("                            <td width=\"13%\" height=\"35\" ></td>\r\n");
      out.write("                            <td height=\"35\" colspan=\"2\" class=\"top_hui_text\">\r\n");
      out.write("\t\t\t\t\t\t\t<a href=\"userlogin.jsp\"><span class=\"login_txt\">如果您不是管理员请点击</span></a>\t\t\t\t  \r\n");
      out.write("                              </td>\r\n");
      out.write("                          </tr>\r\n");
      out.write("                          <tr>\r\n");
      out.write("                            <td height=\"35\" >&nbsp;</td>\r\n");
      out.write("                            <td width=\"20%\" height=\"35\" ><input name=\"Submit\" type=\"submit\" class=\"button\" id=\"Submit\" value=\"登 陆\"> </td>\r\n");
      out.write("                            <td width=\"67%\" class=\"top_hui_text\"><input name=\"cs\" type=\"button\" class=\"button\" id=\"cs\" value=\"取 消\" onClick=\"showConfirmMsg1()\"></td>\r\n");
      out.write("                          </tr>\r\n");
      out.write("                        </table>\r\n");
      out.write("                        <br>\r\n");
      out.write("                    </form></td>\r\n");
      out.write("                  </tr>\r\n");
      out.write("                  <tr>\r\n");
      out.write("                    <td width=\"433\" height=\"164\" align=\"right\" valign=\"bottom\"><img src=\"images/login-wel.gif\" width=\"242\" height=\"138\"></td>\r\n");
      out.write("                    <td width=\"57\" align=\"right\" valign=\"bottom\">&nbsp;</td>\r\n");
      out.write("                  </tr>\r\n");
      out.write("              </table></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("          </table>\r\n");
      out.write("          </td>\r\n");
      out.write("      </tr>\r\n");
      out.write("    </table></td>\r\n");
      out.write("  </tr>\r\n");
      out.write("  <tr>\r\n");
      out.write("    <td height=\"20\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"login-buttom-bg\">\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td align=\"center\"><span class=\"login-buttom-txt\">Copyright &copy; 2011-2012 made by ainmind</span></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("    </table></td>\r\n");
      out.write("  </tr>\r\n");
      out.write("</table>\r\n");
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
