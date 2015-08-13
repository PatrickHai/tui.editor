/**
 * @fileoverview Implements Heading wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Heading
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 */
var Heading = CommandManager.command('wysiwyg',/** @lends Heading */{
    name: 'Heading',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection(),
            foundedHeading = wwe.hasFormatWithRx(/h[\d]/i),
            depth = 1,
            beforeDepth;

        if (foundedHeading) {
            beforeDepth = parseInt(foundedHeading[0].replace(/h/i, ''), 10);
        }

        if (beforeDepth && beforeDepth < 6) {
            depth = beforeDepth + 1;
        }

        sq.modifyBlocks(function(frag) {
            var newHeading, childrens;

            if (beforeDepth) {
                childrens = $(frag).find('h' + beforeDepth).children()[0];
            } else {
                childrens = frag;
            }

            newHeading = this.createElement('H' + depth, null, [childrens]);

            return newHeading;
        });

        sq.focus();
    }
});

module.exports = Heading;