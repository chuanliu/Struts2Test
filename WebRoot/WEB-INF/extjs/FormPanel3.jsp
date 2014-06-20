<%@ page contentType="text/html; charset=gb2312" language="java"%>
<html>
<head>
<title>Getting Started Example</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/styles/extjs4.1.1/resources/css/ext-all.css" />
<script
	src="${pageContext.request.contextPath}/scripts/extjs4.1.1/ext-all-debug.js"></script>
</head>
<body>
	<script>
		Ext.onReady(function() {
			// refer to http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
			'use strict';
			var genres = new Ext.data.SimpleStore({
				fields : [ 'id', 'genre' ],
				data : [ [ '0', 'New genres' ], [ '1', 'Comedy' ], [ '2', 'Drama' ],
						[ '3', 'Action' ] ]
			});
			var test = new Ext.form.TextField({
				fieldLabel : 'Title2',
				name : 'title2',
				allowBlank : false
			});
			var movie_form = new Ext.FormPanel({
				url : 'movie‐form‐submit.php',
				renderTo : document.body,
				frame : true,
				title : 'Movie Information Form',
				width : 350,
				items : [ {
					xtype : 'textfield',
					fieldLabel : 'Title',
					name : 'title',
					allowBlank : false,
					listeners : {
						specialkey : function(f, e) {
							if (e.getKey() == e.ENTER) {
								movie_form.getForm().submit();
							}
						}
					}
				}, test, {
					xtype : 'textfield',
					fieldLabel : 'Director',
					name : 'director',
					vtype : 'alpha'
				}, {
					xtype : 'datefield',
					fieldLabel : 'Released',
					name : 'released',
					disabledDays : [ 0, 6 ]
				}, {
					xtype : 'radio',
					fieldLabel : 'Filmed In',
					name : 'filmed_in',
					boxLabel : 'Color'
				}, {
					xtype : 'radio',
					hideLabel : true,
					labelSeparator : '',
					name : 'filmed_in',
					boxLabel : 'Black & White'
				}, {
					xtype : 'checkbox',
					fieldLabel : 'Bad Movie',
					name : 'bad_movie'
				}, {
					xtype : 'combo',
					name : 'genre',
					fieldLabel : 'Genre',
					mode : 'local',
					store : genres,
					displayField : 'genre',
					// width : 200
					listeners : {
						select : function(f, r, i) {
							if (i == 0) {
								Ext.Msg.prompt('New Genre', 'Name', Ext.emptyFn);
							}
						}
					}

				}, {
					xtype : 'htmleditor',
					name : 'description',
					hideLabel : true,
					labelSeparator : '',
					height : 100,
					anchor : '100%'
				}, {
					buttons : [ {
						text : 'Save',
						handler : function() {
							movie_form.getForm().submit({
								success : function(f, a) {
									Ext.Msg.alert('Success', 'It worked');
								},
								failure : function(f, a) {
									Ext.Msg.alert('Warning', 'Error');
								}
							});
						}
					}, {
						text : 'Reset',
						handler : function() {
							movie_form.getForm().reset();
						}
					} ]
				} ]

			});
			movie_form.getForm().findField('title').setValue('Dumb & Dumber');
		});
	</script>

</body>
</html>