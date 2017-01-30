/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

var assign = require('./assign');
var EventEmitter = require('tiny-emitter');

EventEmitter.mixin = function(obj) {
  assign(typeof obj === 'function' ? obj.prototype : obj, EventEmitter.prototype);
};

// Event emitter based on `tiny-emitter` library. It supports the following methods: `on`, `off`,
// `once`, `emit` and `mixin`. The `mixin` method can be used to add event emitter functionality to
// functions or existing instances.
module.exports = EventEmitter;
