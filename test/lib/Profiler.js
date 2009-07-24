function profile(objectNames, run) {

	var loader = new YAHOO.util.YUILoader({
		require: ["logger", "profiler"],
		onSuccess: function(){
			YAHOO.util.Event.onDOMReady(function(){

				// Define logger source
				var logger = new YAHOO.widget.LogWriter(objectNames[0]);

				// Create log console
				var reader = new YAHOO.widget.LogReader();

				// Customize console
				reader.verboseOutput = false;
				reader.newestOnTop = false;
				reader.formatMsg = function (oLogMsg) {
					var category = oLogMsg.category;
					return '<pre class="yui-log-entry"><p><span class="' + category + '">' +
					       category.toUpperCase() + '</span> ' + oLogMsg.msg + '</p></pre>';
				};
				reader.hideSource("global");
				reader.hideSource("LogReader");

				// Register objects to profile
				for (var i = 0; i < objectNames.length; i++)
					YAHOO.tool.Profiler.registerObject(objectNames[i]);

				// Run the application
				run();

				// Get report
				var report = YAHOO.tool.Profiler.getFullReport(function(report){
					return report.calls > 0;
				});

				// Display profiler results
				for (var func in report) {
					logger.log(func + "(): " +
					           "Called " + report[func].calls + " times. " +
					           "Avg: "   + report[func].avg   + "ms, " +
					           "Min: "   + report[func].min   + "ms, " +
					           "Max: "   + report[func].max   + "ms");
				}

			});
		}
	});

	// CSS customizations
	loader.addModule({
		name: "cssmod",
		type: "css",
		fullpath: "lib/profiler.css"
	});
	loader.require("cssmod");

	// Load everything in
	loader.insert();

}
