!function(e,t){"use strict";"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&module.exports?module.exports=t():e.pipwerks=t()}(this,(function(){"use strict";var e={UTILS:{},debug:{isActive:!0},SCORM:{version:null,handleCompletionStatus:!0,handleExitMode:!0,API:{handle:null,isFound:!1},connection:{isActive:!1},data:{completionStatus:null,exitStatus:null},debug:{}}};return e.SCORM.isAvailable=function(){return!0},e.SCORM.API.find=function(t){for(var n=null,i=0,a="SCORM.API.find",o=e.UTILS.trace,s=e.SCORM;!t.API&&!t.API_1484_11&&t.parent&&t.parent!=t&&i<=500;)i++,t=t.parent;if(s.version)switch(s.version){case"2004":t.API_1484_11?n=t.API_1484_11:o(a+": SCORM version 2004 was specified by user, but API_1484_11 cannot be found.");break;case"1.2":t.API?n=t.API:o(a+": SCORM version 1.2 was specified by user, but API cannot be found.")}else t.API_1484_11?(s.version="2004",n=t.API_1484_11):t.API&&(s.version="1.2",n=t.API);return n?(o(a+": API found. Version: "+s.version),o("API: "+n)):o(a+": Error finding API. \nFind attempts: "+i+". \nFind attempt limit: 500"),n},e.SCORM.API.get=function(){var t=null,n=window,i=e.SCORM,a=i.API.find,o=e.UTILS.trace;return!(t=a(n))&&n.parent&&n.parent!=n&&(t=a(n.parent)),!t&&n.top&&n.top.opener&&(t=a(n.top.opener)),!t&&n.top&&n.top.opener&&n.top.opener.document&&(t=a(n.top.opener.document)),t?i.API.isFound=!0:o("API.get failed: Can't find the API!"),t},e.SCORM.API.getHandle=function(){var t=e.SCORM.API;return t.handle||t.isFound||(t.handle=t.get()),t.handle},e.SCORM.connection.initialize=function(){var t=!1,n=e.SCORM,i=n.data.completionStatus,a=e.UTILS.trace,o=e.UTILS.StringToBoolean,s=n.debug,r="SCORM.connection.initialize ";if(a("connection.initialize called."),n.connection.isActive)a(r+"aborted: Connection already active.");else{var c=n.API.getHandle(),l=0;if(c){switch(n.version){case"1.2":t=o(c.LMSInitialize(""));break;case"2004":t=o(c.Initialize(""))}if(t)if(null!==(l=s.getCode())&&0===l){if(n.connection.isActive=!0,n.handleCompletionStatus&&(i=n.status("get"))){switch(i){case"not attempted":case"unknown":n.status("set","incomplete")}n.save()}}else t=!1,a(r+"failed. \nError code: "+l+" \nError info: "+s.getInfo(l));else a(null!==(l=s.getCode())&&0!==l?r+"failed. \nError code: "+l+" \nError info: "+s.getInfo(l):r+"failed: No response from server.")}else a(r+"failed: API is null.")}return t},e.SCORM.connection.terminate=function(){var t=!1,n=e.SCORM,i=n.data.exitStatus,a=n.data.completionStatus,o=e.UTILS.trace,s=e.UTILS.StringToBoolean,r=n.debug,c="SCORM.connection.terminate ";if(n.connection.isActive){var l=n.API.getHandle(),d=0;if(l){if(n.handleExitMode&&!i)if("completed"!==a&&"passed"!==a)switch(n.version){case"1.2":t=n.set("cmi.core.exit","suspend");break;case"2004":t=n.set("cmi.exit","suspend")}else switch(n.version){case"1.2":t=n.set("cmi.core.exit","logout");break;case"2004":t=n.set("cmi.exit","normal")}if(t="1.2"!==n.version||n.save()){switch(n.version){case"1.2":t=s(l.LMSFinish(""));break;case"2004":t=s(l.Terminate(""))}t?n.connection.isActive=!1:o(c+"failed. \nError code: "+(d=r.getCode())+" \nError info: "+r.getInfo(d))}}else o(c+"failed: API is null.")}else o(c+"aborted: Connection already terminated.");return t},e.SCORM.data.get=function(t){var n=null,i=e.SCORM,a=e.UTILS.trace,o=i.debug,s="SCORM.data.get('"+t+"') ";if(i.connection.isActive){var r=i.API.getHandle(),c=0;if(r){switch(i.version){case"1.2":n=r.LMSGetValue(t);break;case"2004":n=r.GetValue(t)}if(c=o.getCode(),""!==n||0===c)switch(t){case"cmi.core.lesson_status":case"cmi.completion_status":i.data.completionStatus=n;break;case"cmi.core.exit":case"cmi.exit":i.data.exitStatus=n}else a(s+"failed. \nError code: "+c+"\nError info: "+o.getInfo(c))}else a(s+"failed: API is null.")}else a(s+"failed: API connection is inactive.");return a(s+" value: "+n),String(n)},e.SCORM.data.set=function(t,n){var i=!1,a=e.SCORM,o=e.UTILS.trace,s=e.UTILS.StringToBoolean,r=a.debug,c="SCORM.data.set('"+t+"') ";if(a.connection.isActive){var l=a.API.getHandle(),d=0;if(l){switch(a.version){case"1.2":i=s(l.LMSSetValue(t,n));break;case"2004":i=s(l.SetValue(t,n))}i?"cmi.core.lesson_status"!==t&&"cmi.completion_status"!==t||(a.data.completionStatus=n):o(c+"failed. \nError code: "+(d=r.getCode())+". \nError info: "+r.getInfo(d))}else o(c+"failed: API is null.")}else o(c+"failed: API connection is inactive.");return o(c+" value: "+n),i},e.SCORM.data.save=function(){var t=!1,n=e.SCORM,i=e.UTILS.trace,a=e.UTILS.StringToBoolean,o="SCORM.data.save failed";if(n.connection.isActive){var s=n.API.getHandle();if(s)switch(n.version){case"1.2":t=a(s.LMSCommit(""));break;case"2004":t=a(s.Commit(""))}else i(o+": API is null.")}else i(o+": API connection is inactive.");return t},e.SCORM.status=function(t,n){var i=!1,a=e.SCORM,o=e.UTILS.trace,s="SCORM.getStatus failed",r="";if(null!==t){switch(a.version){case"1.2":r="cmi.core.lesson_status";break;case"2004":r="cmi.completion_status"}switch(t){case"get":i=a.data.get(r);break;case"set":null!==n?i=a.data.set(r,n):(i=!1,o(s+": status was not specified."));break;default:i=!1,o(s+": no valid action was specified.")}}else o(s+": action was not specified.");return i},e.SCORM.debug.getCode=function(){var t=e.SCORM,n=t.API.getHandle(),i=e.UTILS.trace,a=0;if(n)switch(t.version){case"1.2":a=parseInt(n.LMSGetLastError(),10);break;case"2004":a=parseInt(n.GetLastError(),10)}else i("SCORM.debug.getCode failed: API is null.");return a},e.SCORM.debug.getInfo=function(t){var n=e.SCORM,i=n.API.getHandle(),a=e.UTILS.trace,o="";if(i)switch(n.version){case"1.2":o=i.LMSGetErrorString(t.toString());break;case"2004":o=i.GetErrorString(t.toString())}else a("SCORM.debug.getInfo failed: API is null.");return String(o)},e.SCORM.debug.getDiagnosticInfo=function(t){var n=e.SCORM,i=n.API.getHandle(),a=e.UTILS.trace,o="";if(i)switch(n.version){case"1.2":o=i.LMSGetDiagnostic(t);break;case"2004":o=i.GetDiagnostic(t)}else a("SCORM.debug.getDiagnosticInfo failed: API is null.");return String(o)},e.SCORM.init=e.SCORM.connection.initialize,e.SCORM.get=e.SCORM.data.get,e.SCORM.set=e.SCORM.data.set,e.SCORM.save=e.SCORM.data.save,e.SCORM.quit=e.SCORM.connection.terminate,e.UTILS.StringToBoolean=function(e){switch(typeof e){case"object":case"string":return/(true|1)/i.test(e);case"number":return!!e;case"boolean":return e;case"undefined":return null;default:return!1}},e.UTILS.trace=function(t){e.debug.isActive&&window.console&&window.console.log&&window.console.log(t)},e}));
