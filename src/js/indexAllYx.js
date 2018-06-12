/**
 * @fileoverview yx editor entry point for editor with all extension included
 * @author Patrick
 */
const Editor = require('./indexYx');

import './extensions/chart/chart';
import './extensions/scrollSync/scrollSync';
import './extensions/table/table';
import './extensions/colorSyntax';
import './extensions/uml';

module.exports = Editor;
