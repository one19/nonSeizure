'use strict';

var expressApp = require('./index');
var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

// app.on('ready', function() {
//   mainWindow = new BrowserWindow({
//     frame: false,
//     height: 480,
//     resizable: false,
//     width: 1080
//   });

//   mainWindow.loadUrl('http://localhost:3002/');
// });

app.on('ready', function() {
  mainWindow = new BrowserWindow({
  "auto-hide-menu-bar": true,
  "frame": false,
  "web-preferences": {
    "node-integration": false
  },
  width: 1080,
  height: 480});

  mainWindow.loadURL('http://localhost:3002/');
  //mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});