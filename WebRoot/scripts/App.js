Ext.namespace('DigiCompass.Web');

DigiCompass.Web.app = function() {
	return {
		init : function() {

			// åœ¨bodyä¸Šç”Ÿæˆ�workspace
			var workspace = Ext.create('DigiCompass.Web.UI.Workspace', {
				renderTo : Ext.getBody(),
				listeners : {
					afterlayout : function(a, b, c, d, e) {
						// èŽ·å�–viewçš„width and height
						var currentH = Ext.Element.getViewHeight() - 20;
						var currentW = Ext.Element.getViewWidth() - 20;

						Ext.getCmp('myWorkbenchId').setHeight(currentH);
						// å®½åº¦è®¾ç½®ä¸�æˆ�åŠŸ
						// Ext.getCmp('myWorkbenchId').setWidth(currentW);
					}
				}
			});
			// éš�è”½å·¦è¾¹çš„ListView
			d3.select('#obj-exp').style('position', 'absolute').style('left',
					'-500px');
			d3.select('#obj-details').style('position', 'absolute').style(
					'left', '-2000px');

			// æ˜¾ç¤ºworkspace
			workspace.show();
		}
	};
}();

Ext.onReady(function() {

	Ext.QuickTips.init();

	DigiCompass.Web.UI.CometdRegistFns.init();

	DigiCompass.Web.app.init();

	if (mustChangePassword == "true" || credentialsExpired == "true") {
		DigiCompass.password.changePassword(false);
	}
});
