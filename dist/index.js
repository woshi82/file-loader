'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.raw = undefined;
exports.default = fileLoader;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fileLoader(content) {
  if (!this.emitFile) throw new Error('emitFile is required from module system');

  var query = _loaderUtils2.default.getOptions(this) || {};
  var configKey = query.config || 'fileLoader';
  var options = this.options[configKey] || {};
  var config = Object.assign({
    regExp: undefined,
    context: undefined,
    useRelativePath: false,
    publicPath: undefined,
    cssOutputPath: '',
    outputPath: '',
    name: '[hash].[ext]'
  }, options, query);

  var context = config.context || this.options.context || process.cwd();
  var issuer = this._module && this._module.issuer || {}; // eslint-disable-line no-underscore-dangle
  var url = _loaderUtils2.default.interpolateName(this, config.name, {
    regExp: config.regExp,
    context,
    content
  });

  if (config.outputPath) {
    // support functions as outputPath to generate them dynamically
    config.outputPath = (0, _helper.parsePath)(config.outputPath, url);
  }

  if (config.useRelativePath) {
    // Only the dirname is needed in this case.
    config.outputPath = config.outputPath.replace(url, '');

    // We have access only to entry point relationships. So we work with this relations.
    issuer.context = issuer.context || context;
    var relation = { path: issuer.context && _path2.default.relative(issuer.context, this.resourcePath) };
    relation.path = relation.path ? _path2.default.dirname(relation.path) : config.outputPath;

    // Output path
    // If the `output.dirname` is pointing to up in relation to the `config.outputPath`.
    // We forced him to the webpack output path config. Even though it is empty.
    var output = this.options.output || {};
    output.dirname = relation.path.replace(/^(\.\.(\/|\\))+/g, '').split(_path2.default.sep).join('/');
    if (output.dirname.indexOf(config.outputPath) !== 0) output.dirname = config.outputPath;
    config.outputPath = _path2.default.join(output.dirname, url).split(_path2.default.sep).join('/');

    // Public path
    // Entry files doesn't pass through the `file-loader`.
    // So we haven't access to the files context to compare with your assets context
    // then we need to create and the same way, force the `relation.path` to bundled files
    // on the webpack output path config folder and manually the same with CSS file.
    if (output.filename && _path2.default.extname(output.filename)) {
      relation.path = output.dirname;
    } else if (output.path && (0, _helper.is)('String', config.cssOutputPath)) {
      output.bundle = output.path.replace(this.options.context + _path2.default.sep, '');
      output.issuer = _path2.default.join(context, output.bundle, config.cssOutputPath);
      output.asset = _path2.default.join(context, output.bundle, output.dirname);
      relation.path = _path2.default.relative(output.issuer, output.asset);
    }
    url = _path2.default.join(relation.path, url).split(_path2.default.sep).join('/');
  } else if (config.outputPath) {
    url = config.outputPath;
  } else {
    config.outputPath = url;
  }

  if ((0, _helper.is)('String|Function', config.publicPath)) {
    // support functions as publicPath to generate them dynamically
    config.publicPath = JSON.stringify((0, _helper.parsePath)(config.publicPath, url));
  } else {
    config.publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;
  }

  if (query.emitFile === undefined || query.emitFile) {
    this.emitFile(config.outputPath, content);
  }

  return `export default = ${config.publicPath};`;
} /*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
  */
var raw = exports.raw = true;