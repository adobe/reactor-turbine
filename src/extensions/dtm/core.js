'use strict';

var getCookie = require('getCookie');
var setCookie = require('setCookie');
var adobeVisitor = require('extensions/adobeVisitor');

//function key(name){
//  return '_sdsat_' + name;
//}
//
//// returns whether this is a new visitor session
//var trackLandingPage = function(){
//  // landing page
//  var landingPageKey = key('landing_page');
//  var existingLanding = SL.readCookie(landingPageKey);
//  if (!existingLanding || existingLanding.split('|').length < 2)
//    SL.setCookie(landingPageKey, location.href + '|' + (new Date().getTime()));
//  return !existingLanding;
//}
//
//var visitorLandingPage = function(){
//  var value = SL.readCookie(key('landing_page'));
//  if (!value) return null;
//  return value.split('|')[0];
//}
//
//var visitorLandingTime = function(){
//  var value = SL.readCookie(key('landing_page'));
//  if (!value) return null;
//  return Number(value.split('|')[1]);
//}
//
//var minutesOnSite = function(){
//  var now = new Date().getTime();
//  return Math.floor((now - visitorLandingTime()) / 1000 / 60);
//}
//
//var trackSessionCount = function(newSession){
//  if (!newSession) return;
//  var session = visitorSessionCount();
//  setCookie(key('session_count'), session + 1, 365 * 2 /* two years */);
//}
//
//var visitorSessionCount = function(){
//  return Number(SL.readCookie(key('session_count')) || '0')
//}
//
//var isNewVisitor = function(){
//  return visitorSessionCount() === 1;
//}
//
//var visitorLifetimePagesViewed = function(){
//  return Number(getCookie(key('lt_pages_viewed')) || 0);
//};
//
//var visitorSessionPagesViewed = function(){
//  return Number(getCookie(key('pages_viewed')) || 0);
//};
//
//var trackSessionPagesViewed = function(){
//  setCookie(key('pages_viewed'), visitorSessionPagesViewed() + 1);
//}
//
//var trackLifetimePagesViewed = function(){
//  setCookie(key('lt_pages_viewed'), visitorLifetimePagesViewed() + 1, 365 * 2);
//};
//
//var newSession = trackLandingPage()
//trackSessionCount(newSession)
//trackLifetimePagesViewed()
//trackSessionPagesViewed()

module.exports = function() {
  return {
    visitor: {
      //isNew: isNewVisitor
    }
  };
};



