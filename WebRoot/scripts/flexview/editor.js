Ext.define('DigiCompass.Web.app.form.field.Percent', {
    extend:'Ext.form.field.Number',
    alias: 'widget.percentfield',
    alternateClassName: ['DigiCompass.Web.app.form.PercentField', 'DigiCompass.Web.app.form.Percent'],
    minValue : 0,
    maxValue : 100
});