(function() {
  var Emitter, LanguageMode, OnigRegExp, Range, ScopeDescriptor, Subscriber, _, _ref;

  Range = require('text-buffer').Range;

  _ = require('underscore-plus');

  OnigRegExp = require('oniguruma').OnigRegExp;

  _ref = require('emissary'), Emitter = _ref.Emitter, Subscriber = _ref.Subscriber;

  ScopeDescriptor = require('./scope-descriptor');

  module.exports = LanguageMode = (function() {
    Emitter.includeInto(LanguageMode);

    Subscriber.includeInto(LanguageMode);

    function LanguageMode(editor) {
      this.editor = editor;
      this.buffer = this.editor.buffer;
    }

    LanguageMode.prototype.destroy = function() {
      return this.unsubscribe();
    };

    LanguageMode.prototype.toggleLineCommentForBufferRow = function(row) {
      return this.toggleLineCommentsForBufferRows(row, row);
    };

    LanguageMode.prototype.toggleLineCommentsForBufferRows = function(start, end) {
      var allBlank, allBlankOrCommented, blank, buffer, columnEnd, columnStart, commentEndEntry, commentEndRegex, commentEndRegexString, commentEndString, commentStartEntry, commentStartRegex, commentStartRegexString, commentStartString, endMatch, indent, indentLength, indentRegex, indentString, line, match, row, scope, shouldUncomment, startMatch, tabLength, _i, _j, _k, _ref1;
      scope = this.editor.scopeDescriptorForBufferPosition([start, 0]);
      commentStartEntry = atom.config.getAll('editor.commentStart', {
        scope: scope
      })[0];
      if (commentStartEntry == null) {
        return;
      }
      commentEndEntry = _.find(atom.config.getAll('editor.commentEnd', {
        scope: scope
      }), function(entry) {
        return entry.scopeSelector === commentStartEntry.scopeSelector;
      });
      commentStartString = commentStartEntry != null ? commentStartEntry.value : void 0;
      commentEndString = commentEndEntry != null ? commentEndEntry.value : void 0;
      buffer = this.editor.buffer;
      commentStartRegexString = _.escapeRegExp(commentStartString).replace(/(\s+)$/, '(?:$1)?');
      commentStartRegex = new OnigRegExp("^(\\s*)(" + commentStartRegexString + ")");
      if (commentEndString) {
        shouldUncomment = commentStartRegex.testSync(buffer.lineForRow(start));
        if (shouldUncomment) {
          commentEndRegexString = _.escapeRegExp(commentEndString).replace(/^(\s+)/, '(?:$1)?');
          commentEndRegex = new OnigRegExp("(" + commentEndRegexString + ")(\\s*)$");
          startMatch = commentStartRegex.searchSync(buffer.lineForRow(start));
          endMatch = commentEndRegex.searchSync(buffer.lineForRow(end));
          if (startMatch && endMatch) {
            buffer.transact(function() {
              var columnEnd, columnStart, endColumn, endLength;
              columnStart = startMatch[1].length;
              columnEnd = columnStart + startMatch[2].length;
              buffer.setTextInRange([[start, columnStart], [start, columnEnd]], "");
              endLength = buffer.lineLengthForRow(end) - endMatch[2].length;
              endColumn = endLength - endMatch[1].length;
              return buffer.setTextInRange([[end, endColumn], [end, endLength]], "");
            });
          }
        } else {
          buffer.transact(function() {
            var indentLength, _ref1, _ref2;
            indentLength = (_ref1 = (_ref2 = buffer.lineForRow(start).match(/^\s*/)) != null ? _ref2[0].length : void 0) != null ? _ref1 : 0;
            buffer.insert([start, indentLength], commentStartString);
            return buffer.insert([end, buffer.lineLengthForRow(end)], commentEndString);
          });
        }
      } else {
        allBlank = true;
        allBlankOrCommented = true;
        for (row = _i = start; start <= end ? _i <= end : _i >= end; row = start <= end ? ++_i : --_i) {
          line = buffer.lineForRow(row);
          blank = line != null ? line.match(/^\s*$/) : void 0;
          if (!blank) {
            allBlank = false;
          }
          if (!(blank || commentStartRegex.testSync(line))) {
            allBlankOrCommented = false;
          }
        }
        shouldUncomment = allBlankOrCommented && !allBlank;
        if (shouldUncomment) {
          for (row = _j = start; start <= end ? _j <= end : _j >= end; row = start <= end ? ++_j : --_j) {
            if (match = commentStartRegex.searchSync(buffer.lineForRow(row))) {
              columnStart = match[1].length;
              columnEnd = columnStart + match[2].length;
              buffer.setTextInRange([[row, columnStart], [row, columnEnd]], "");
            }
          }
        } else {
          if (start === end) {
            indent = this.editor.indentationForBufferRow(start);
          } else {
            indent = this.minIndentLevelForRowRange(start, end);
          }
          indentString = this.editor.buildIndentString(indent);
          tabLength = this.editor.getTabLength();
          indentRegex = new RegExp("(\t|[ ]{" + tabLength + "}){" + (Math.floor(indent)) + "}");
          for (row = _k = start; start <= end ? _k <= end : _k >= end; row = start <= end ? ++_k : --_k) {
            line = buffer.lineForRow(row);
            if (indentLength = (_ref1 = line.match(indentRegex)) != null ? _ref1[0].length : void 0) {
              buffer.insert([row, indentLength], commentStartString);
            } else {
              buffer.setTextInRange([[row, 0], [row, indentString.length]], indentString + commentStartString);
            }
          }
        }
      }
    };

    LanguageMode.prototype.foldAll = function() {
      var currentRow, endRow, startRow, _i, _ref1, _ref2, _ref3, _results;
      _results = [];
      for (currentRow = _i = 0, _ref1 = this.buffer.getLastRow(); 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; currentRow = 0 <= _ref1 ? ++_i : --_i) {
        _ref3 = (_ref2 = this.rowRangeForFoldAtBufferRow(currentRow)) != null ? _ref2 : [], startRow = _ref3[0], endRow = _ref3[1];
        if (startRow == null) {
          continue;
        }
        _results.push(this.editor.createFold(startRow, endRow));
      }
      return _results;
    };

    LanguageMode.prototype.unfoldAll = function() {
      var fold, row, _i, _ref1, _results;
      _results = [];
      for (row = _i = _ref1 = this.buffer.getLastRow(); _ref1 <= 0 ? _i <= 0 : _i >= 0; row = _ref1 <= 0 ? ++_i : --_i) {
        _results.push((function() {
          var _j, _len, _ref2, _results1;
          _ref2 = this.editor.displayBuffer.foldsStartingAtBufferRow(row);
          _results1 = [];
          for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
            fold = _ref2[_j];
            _results1.push(fold.destroy());
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    LanguageMode.prototype.foldAllAtIndentLevel = function(indentLevel) {
      var currentRow, endRow, startRow, _i, _ref1, _ref2, _ref3, _results;
      this.unfoldAll();
      _results = [];
      for (currentRow = _i = 0, _ref1 = this.buffer.getLastRow(); 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; currentRow = 0 <= _ref1 ? ++_i : --_i) {
        _ref3 = (_ref2 = this.rowRangeForFoldAtBufferRow(currentRow)) != null ? _ref2 : [], startRow = _ref3[0], endRow = _ref3[1];
        if (startRow == null) {
          continue;
        }
        if (this.editor.indentationForBufferRow(startRow) === indentLevel) {
          _results.push(this.editor.createFold(startRow, endRow));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LanguageMode.prototype.foldBufferRow = function(bufferRow) {
      var currentRow, endRow, fold, startRow, _i, _ref1, _ref2;
      for (currentRow = _i = bufferRow; bufferRow <= 0 ? _i <= 0 : _i >= 0; currentRow = bufferRow <= 0 ? ++_i : --_i) {
        _ref2 = (_ref1 = this.rowRangeForFoldAtBufferRow(currentRow)) != null ? _ref1 : [], startRow = _ref2[0], endRow = _ref2[1];
        if (!((startRow != null) && (startRow <= bufferRow && bufferRow <= endRow))) {
          continue;
        }
        fold = this.editor.displayBuffer.largestFoldStartingAtBufferRow(startRow);
        if (!fold) {
          return this.editor.createFold(startRow, endRow);
        }
      }
    };

    LanguageMode.prototype.rowRangeForFoldAtBufferRow = function(bufferRow) {
      var rowRange;
      rowRange = this.rowRangeForCommentAtBufferRow(bufferRow);
      if (rowRange == null) {
        rowRange = this.rowRangeForCodeFoldAtBufferRow(bufferRow);
      }
      return rowRange;
    };

    LanguageMode.prototype.rowRangeForCommentAtBufferRow = function(bufferRow) {
      var currentRow, endRow, startRow, _i, _j, _ref1, _ref2, _ref3;
      if (!this.editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(bufferRow).isComment()) {
        return;
      }
      startRow = bufferRow;
      endRow = bufferRow;
      if (bufferRow > 0) {
        for (currentRow = _i = _ref1 = bufferRow - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; currentRow = _ref1 <= 0 ? ++_i : --_i) {
          if (this.buffer.isRowBlank(currentRow)) {
            break;
          }
          if (!this.editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(currentRow).isComment()) {
            break;
          }
          startRow = currentRow;
        }
      }
      if (bufferRow < this.buffer.getLastRow()) {
        for (currentRow = _j = _ref2 = bufferRow + 1, _ref3 = this.buffer.getLastRow(); _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; currentRow = _ref2 <= _ref3 ? ++_j : --_j) {
          if (this.buffer.isRowBlank(currentRow)) {
            break;
          }
          if (!this.editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(currentRow).isComment()) {
            break;
          }
          endRow = currentRow;
        }
      }
      if (startRow !== endRow) {
        return [startRow, endRow];
      }
    };

    LanguageMode.prototype.rowRangeForCodeFoldAtBufferRow = function(bufferRow) {
      var foldEndRow, includeRowInFold, indentation, row, scopeDescriptor, startIndentLevel, _i, _ref1, _ref2, _ref3;
      if (!this.isFoldableAtBufferRow(bufferRow)) {
        return null;
      }
      startIndentLevel = this.editor.indentationForBufferRow(bufferRow);
      scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
      for (row = _i = _ref1 = bufferRow + 1, _ref2 = this.editor.getLastBufferRow(); _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; row = _ref1 <= _ref2 ? ++_i : --_i) {
        if (this.editor.isBufferRowBlank(row)) {
          continue;
        }
        indentation = this.editor.indentationForBufferRow(row);
        if (indentation <= startIndentLevel) {
          includeRowInFold = indentation === startIndentLevel && ((_ref3 = this.foldEndRegexForScopeDescriptor(scopeDescriptor)) != null ? _ref3.searchSync(this.editor.lineTextForBufferRow(row)) : void 0);
          if (includeRowInFold) {
            foldEndRow = row;
          }
          break;
        }
        foldEndRow = row;
      }
      return [bufferRow, foldEndRow];
    };

    LanguageMode.prototype.isFoldableAtBufferRow = function(bufferRow) {
      return this.editor.displayBuffer.tokenizedBuffer.isFoldableAtRow(bufferRow);
    };

    LanguageMode.prototype.isLineCommentedAtBufferRow = function(bufferRow) {
      if (!((0 <= bufferRow && bufferRow <= this.editor.getLastBufferRow()))) {
        return false;
      }
      return this.editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(bufferRow).isComment();
    };

    LanguageMode.prototype.rowRangeForParagraphAtBufferRow = function(bufferRow) {
      var endRow, firstRow, isOriginalRowComment, lastRow, range, startRow, _ref1, _ref2;
      if (!/\w/.test(this.editor.lineTextForBufferRow(bufferRow))) {
        return;
      }
      if (this.isLineCommentedAtBufferRow(bufferRow)) {
        isOriginalRowComment = true;
        range = this.rowRangeForCommentAtBufferRow(bufferRow);
        _ref1 = range || [bufferRow, bufferRow], firstRow = _ref1[0], lastRow = _ref1[1];
      } else {
        isOriginalRowComment = false;
        _ref2 = [0, this.editor.getLastBufferRow() - 1], firstRow = _ref2[0], lastRow = _ref2[1];
      }
      startRow = bufferRow;
      while (startRow > firstRow) {
        if (this.isLineCommentedAtBufferRow(startRow - 1) !== isOriginalRowComment) {
          break;
        }
        if (!/\w/.test(this.editor.lineTextForBufferRow(startRow - 1))) {
          break;
        }
        startRow--;
      }
      endRow = bufferRow;
      lastRow = this.editor.getLastBufferRow();
      while (endRow < lastRow) {
        if (this.isLineCommentedAtBufferRow(endRow + 1) !== isOriginalRowComment) {
          break;
        }
        if (!/\w/.test(this.editor.lineTextForBufferRow(endRow + 1))) {
          break;
        }
        endRow++;
      }
      return new Range([startRow, 0], [endRow, this.editor.lineTextForBufferRow(endRow).length]);
    };

    LanguageMode.prototype.suggestedIndentForBufferRow = function(bufferRow, options) {
      var tokenizedLine;
      tokenizedLine = this.editor.displayBuffer.tokenizedBuffer.tokenizedLineForRow(bufferRow);
      return this.suggestedIndentForTokenizedLineAtBufferRow(bufferRow, tokenizedLine, options);
    };

    LanguageMode.prototype.suggestedIndentForLineAtBufferRow = function(bufferRow, line, options) {
      var tokenizedLine;
      tokenizedLine = this.editor.displayBuffer.tokenizedBuffer.buildTokenizedLineForRowWithText(bufferRow, line);
      return this.suggestedIndentForTokenizedLineAtBufferRow(bufferRow, tokenizedLine, options);
    };

    LanguageMode.prototype.suggestedIndentForTokenizedLineAtBufferRow = function(bufferRow, tokenizedLine, options) {
      var currentIndentLevel, decreaseIndentRegex, desiredIndentLevel, increaseIndentRegex, precedingLine, precedingRow, scopeDescriptor, scopes, _ref1;
      scopes = tokenizedLine.tokens[0].scopes;
      scopeDescriptor = new ScopeDescriptor({
        scopes: scopes
      });
      currentIndentLevel = this.editor.indentationForBufferRow(bufferRow);
      if (!(increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor))) {
        return currentIndentLevel;
      }
      if ((_ref1 = options != null ? options.skipBlankLines : void 0) != null ? _ref1 : true) {
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow == null) {
          return 0;
        }
      } else {
        precedingRow = bufferRow - 1;
        if (precedingRow < 0) {
          return currentIndentLevel;
        }
      }
      precedingLine = this.buffer.lineForRow(precedingRow);
      desiredIndentLevel = this.editor.indentationForBufferRow(precedingRow);
      if (increaseIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
        desiredIndentLevel += 1;
      }
      if (!(decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor))) {
        return desiredIndentLevel;
      }
      if (decreaseIndentRegex.testSync(tokenizedLine.text)) {
        desiredIndentLevel -= 1;
      }
      return Math.max(desiredIndentLevel, 0);
    };

    LanguageMode.prototype.minIndentLevelForRowRange = function(startRow, endRow) {
      var indents, row;
      indents = (function() {
        var _i, _results;
        _results = [];
        for (row = _i = startRow; startRow <= endRow ? _i <= endRow : _i >= endRow; row = startRow <= endRow ? ++_i : --_i) {
          if (!this.editor.isBufferRowBlank(row)) {
            _results.push(this.editor.indentationForBufferRow(row));
          }
        }
        return _results;
      }).call(this);
      if (!indents.length) {
        indents = [0];
      }
      return Math.min.apply(Math, indents);
    };

    LanguageMode.prototype.autoIndentBufferRows = function(startRow, endRow) {
      var row, _i, _results;
      _results = [];
      for (row = _i = startRow; startRow <= endRow ? _i <= endRow : _i >= endRow; row = startRow <= endRow ? ++_i : --_i) {
        _results.push(this.autoIndentBufferRow(row));
      }
      return _results;
    };

    LanguageMode.prototype.autoIndentBufferRow = function(bufferRow, options) {
      var indentLevel;
      indentLevel = this.suggestedIndentForBufferRow(bufferRow, options);
      return this.editor.setIndentationForBufferRow(bufferRow, indentLevel, options);
    };

    LanguageMode.prototype.autoDecreaseIndentForBufferRow = function(bufferRow) {
      var currentIndentLevel, decreaseIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
      scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
      increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
      decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
      if (!(increaseIndentRegex && decreaseIndentRegex)) {
        return;
      }
      line = this.buffer.lineForRow(bufferRow);
      if (!decreaseIndentRegex.testSync(line)) {
        return;
      }
      currentIndentLevel = this.editor.indentationForBufferRow(bufferRow);
      if (currentIndentLevel === 0) {
        return;
      }
      precedingRow = this.buffer.previousNonBlankRow(bufferRow);
      if (precedingRow == null) {
        return;
      }
      precedingLine = this.buffer.lineForRow(precedingRow);
      desiredIndentLevel = this.editor.indentationForBufferRow(precedingRow);
      if (!increaseIndentRegex.testSync(precedingLine)) {
        desiredIndentLevel -= 1;
      }
      if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
        return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
      }
    };

    LanguageMode.prototype.getRegexForProperty = function(scopeDescriptor, property) {
      var pattern;
      if (pattern = atom.config.get(property, {
        scope: scopeDescriptor
      })) {
        return new OnigRegExp(pattern);
      }
    };

    LanguageMode.prototype.increaseIndentRegexForScopeDescriptor = function(scopeDescriptor) {
      return this.getRegexForProperty(scopeDescriptor, 'editor.increaseIndentPattern');
    };

    LanguageMode.prototype.decreaseIndentRegexForScopeDescriptor = function(scopeDescriptor) {
      return this.getRegexForProperty(scopeDescriptor, 'editor.decreaseIndentPattern');
    };

    LanguageMode.prototype.foldEndRegexForScopeDescriptor = function(scopeDescriptor) {
      return this.getRegexForProperty(scopeDescriptor, 'editor.foldEndPattern');
    };

    return LanguageMode;

  })();

}).call(this);
