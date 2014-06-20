(function(){
	setTimeout(function(){
		cometdfn.publish({
			MODULE_TYPE : 'MOD_BAND_FORMULA_PARAMETER',
			COMMAND : 'COMMAND_QUERY_LIST',
			callbackfn : DigiCompass.Web.app.cost.Grid.loadRTParameter
		});
		console.log('MOD_BAND_FORMULA_PARAMETER');
	}, 10000)
})();
