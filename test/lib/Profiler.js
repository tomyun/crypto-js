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
					return '<pre class="yui-log-entry"><p>' + oLogMsg.msg + '</p></pre>';
				};
				reader.hideSource("global");
				reader.hideSource("LogReader");

				// Register objects to profile
				for (var i = 0; i < objectNames.length; i++)
					if (YAHOO.lang.isFunction(objectNames[i])) {
						YAHOO.tool.Profiler.registerConstructor(objectNames[i]);
					} else {
						YAHOO.tool.Profiler.registerObject(objectNames[i]);
					}

				// Run the application
				run();

				// Get report
				var report = YAHOO.tool.Profiler.getFullReport(function(report){
					return report.calls > 0;
				});

				// Create total time spent property
				for (var func in report) {
					report[func].total = report[func].points[0];
					for (var i = 1; i < report[func].points.length; i++)
						report[func].total += report[func].points[i]
				}

				// Change report to an array of reports
				var reports = [];
				for (var func in report) {
					report[func].name = func;
					reports.push(report[func]);
				}

				// Sort by total time
				reports.sort(function(a, b){ return b.total - a.total; });

				// Display profiler results
				for (var i = 0; i < reports.length; i++) {
					logger.log(
						"<span class='info'>" + reports[i].total + "ms</span> " +
						reports[i].name + "(): " +
						"Called " + reports[i].calls + " times. " +
						"Avg: "   + reports[i].avg   + "ms, " +
						"Min: "   + reports[i].min   + "ms, " +
						"Max: "   + reports[i].max   + "ms"
					);
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
