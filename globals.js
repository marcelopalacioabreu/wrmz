// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */
var g_diagnosticsOn_KEY1 = 'N'.charCodeAt(0);
var g_diagnosticsOn_KEY2 = 'M'.charCodeAt(0);
var g_diagnosticsOn = false;

// Offset parameters for scrolling
var OFFSET_X = 0;
var OFFSET_Y = 0;

var bg_canvas = document.getElementById("bg_canvas");
var bg_ctx = bg_canvas.getContext("2d");
var g_canvas = document.getElementById("g_canvas");
var g_ctx = g_canvas.getContext("2d");

var FULL_WIDTH = g_canvas.width;
var FULL_HEIGHT = g_canvas.height;

//var bg_canvas = document.getElementById("bg_canvas");
//var bg_ctx = bg_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

var NOMINAL_GRAVITY = -0.12;

var g_infoScreen = false;
var g_hoverMap;
var g_selectedMap = 'space';	// default map
