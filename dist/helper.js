'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var is = exports.is = function is(expected, value) {
  return new RegExp(`(${expected})`).test(Object.prototype.toString.call(value));
};

var parsePath = exports.parsePath = function parsePath(property, slug) {
  if (!property) {
    return slug;
  } else if (is('Function', property)) {
    return property(slug);
  }
  return property + slug;
};