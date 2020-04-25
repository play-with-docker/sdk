(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.PWD = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var EventEmitter_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var EventEmitter = (function () {
	    function EventEmitter() {
	        this._events = this._events || {};
	    }
	    EventEmitter.prototype.on = function (type, listener) {
	        this._events[type] = this._events[type] || [];
	        this._events[type].push(listener);
	    };
	    EventEmitter.prototype.off = function (type, listener) {
	        if (!this._events[type]) {
	            return;
	        }
	        var obj = this._events[type];
	        var i = obj.length;
	        while (i--) {
	            if (obj[i] === listener || obj[i].listener === listener) {
	                obj.splice(i, 1);
	                return;
	            }
	        }
	    };
	    EventEmitter.prototype.removeAllListeners = function (type) {
	        if (this._events[type]) {
	            delete this._events[type];
	        }
	    };
	    EventEmitter.prototype.once = function (type, listener) {
	        function on() {
	            var args = Array.prototype.slice.call(arguments);
	            this.off(type, on);
	            return listener.apply(this, args);
	        }
	        on.listener = listener;
	        return this.on(type, on);
	    };
	    EventEmitter.prototype.emit = function (type) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        if (!this._events[type]) {
	            return;
	        }
	        var obj = this._events[type];
	        for (var i = 0; i < obj.length; i++) {
	            obj[i].apply(this, args);
	        }
	    };
	    EventEmitter.prototype.listeners = function (type) {
	        return this._events[type] || [];
	    };
	    return EventEmitter;
	}());
	exports.EventEmitter = EventEmitter;


	});

	unwrapExports(EventEmitter_1);
	var EventEmitter_2 = EventEmitter_1.EventEmitter;

	var CircularList_1 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });

	var CircularList = (function (_super) {
	    __extends(CircularList, _super);
	    function CircularList(maxLength) {
	        var _this = _super.call(this) || this;
	        _this._array = new Array(maxLength);
	        _this._startIndex = 0;
	        _this._length = 0;
	        return _this;
	    }
	    Object.defineProperty(CircularList.prototype, "maxLength", {
	        get: function () {
	            return this._array.length;
	        },
	        set: function (newMaxLength) {
	            var newArray = new Array(newMaxLength);
	            for (var i = 0; i < Math.min(newMaxLength, this.length); i++) {
	                newArray[i] = this._array[this._getCyclicIndex(i)];
	            }
	            this._array = newArray;
	            this._startIndex = 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CircularList.prototype, "length", {
	        get: function () {
	            return this._length;
	        },
	        set: function (newLength) {
	            if (newLength > this._length) {
	                for (var i = this._length; i < newLength; i++) {
	                    this._array[i] = undefined;
	                }
	            }
	            this._length = newLength;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CircularList.prototype, "forEach", {
	        get: function () {
	            var _this = this;
	            return function (callbackfn) {
	                var length = _this.length;
	                for (var i_1 = 0; i_1 < length; i_1++) {
	                    callbackfn(_this.get(i_1), i_1);
	                }
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    CircularList.prototype.get = function (index) {
	        return this._array[this._getCyclicIndex(index)];
	    };
	    CircularList.prototype.set = function (index, value) {
	        this._array[this._getCyclicIndex(index)] = value;
	    };
	    CircularList.prototype.push = function (value) {
	        this._array[this._getCyclicIndex(this._length)] = value;
	        if (this._length === this.maxLength) {
	            this._startIndex++;
	            if (this._startIndex === this.maxLength) {
	                this._startIndex = 0;
	            }
	            this.emit('trim', 1);
	        }
	        else {
	            this._length++;
	        }
	    };
	    CircularList.prototype.pop = function () {
	        return this._array[this._getCyclicIndex(this._length-- - 1)];
	    };
	    CircularList.prototype.splice = function (start, deleteCount) {
	        var items = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            items[_i - 2] = arguments[_i];
	        }
	        if (deleteCount) {
	            for (var i = start; i < this._length - deleteCount; i++) {
	                this._array[this._getCyclicIndex(i)] = this._array[this._getCyclicIndex(i + deleteCount)];
	            }
	            this._length -= deleteCount;
	        }
	        if (items && items.length) {
	            for (var i = this._length - 1; i >= start; i--) {
	                this._array[this._getCyclicIndex(i + items.length)] = this._array[this._getCyclicIndex(i)];
	            }
	            for (var i = 0; i < items.length; i++) {
	                this._array[this._getCyclicIndex(start + i)] = items[i];
	            }
	            if (this._length + items.length > this.maxLength) {
	                var countToTrim = (this._length + items.length) - this.maxLength;
	                this._startIndex += countToTrim;
	                this._length = this.maxLength;
	                this.emit('trim', countToTrim);
	            }
	            else {
	                this._length += items.length;
	            }
	        }
	    };
	    CircularList.prototype.trimStart = function (count) {
	        if (count > this._length) {
	            count = this._length;
	        }
	        this._startIndex += count;
	        this._length -= count;
	        this.emit('trim', count);
	    };
	    CircularList.prototype.shiftElements = function (start, count, offset) {
	        if (count <= 0) {
	            return;
	        }
	        if (start < 0 || start >= this._length) {
	            throw new Error('start argument out of range');
	        }
	        if (start + offset < 0) {
	            throw new Error('Cannot shift elements in list beyond index 0');
	        }
	        if (offset > 0) {
	            for (var i = count - 1; i >= 0; i--) {
	                this.set(start + i + offset, this.get(start + i));
	            }
	            var expandListBy = (start + count + offset) - this._length;
	            if (expandListBy > 0) {
	                this._length += expandListBy;
	                while (this._length > this.maxLength) {
	                    this._length--;
	                    this._startIndex++;
	                    this.emit('trim', 1);
	                }
	            }
	        }
	        else {
	            for (var i = 0; i < count; i++) {
	                this.set(start + i + offset, this.get(start + i));
	            }
	        }
	    };
	    CircularList.prototype._getCyclicIndex = function (index) {
	        return (this._startIndex + index) % this.maxLength;
	    };
	    return CircularList;
	}(EventEmitter_1.EventEmitter));
	exports.CircularList = CircularList;


	});

	unwrapExports(CircularList_1);
	var CircularList_2 = CircularList_1.CircularList;

	var Buffer_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var Buffer = (function () {
	    function Buffer(_terminal) {
	        this._terminal = _terminal;
	        this.clear();
	    }
	    Object.defineProperty(Buffer.prototype, "lines", {
	        get: function () {
	            return this._lines;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Buffer.prototype.fillViewportRows = function () {
	        if (this._lines.length === 0) {
	            var i = this._terminal.rows;
	            while (i--) {
	                this.lines.push(this._terminal.blankLine());
	            }
	        }
	    };
	    Buffer.prototype.clear = function () {
	        this.ydisp = 0;
	        this.ybase = 0;
	        this.y = 0;
	        this.x = 0;
	        this.scrollBottom = 0;
	        this.scrollTop = 0;
	        this.tabs = {};
	        this._lines = new CircularList_1.CircularList(this._terminal.scrollback);
	        this.scrollBottom = this._terminal.rows - 1;
	    };
	    Buffer.prototype.resize = function (newCols, newRows) {
	        if (this._lines.length === 0) {
	            return;
	        }
	        if (this._terminal.cols < newCols) {
	            var ch = [this._terminal.defAttr, ' ', 1];
	            for (var i = 0; i < this._lines.length; i++) {
	                if (this._lines.get(i) === undefined) {
	                    this._lines.set(i, this._terminal.blankLine(undefined, undefined, newCols));
	                }
	                while (this._lines.get(i).length < newCols) {
	                    this._lines.get(i).push(ch);
	                }
	            }
	        }
	        var addToY = 0;
	        if (this._terminal.rows < newRows) {
	            for (var y = this._terminal.rows; y < newRows; y++) {
	                if (this._lines.length < newRows + this.ybase) {
	                    if (this.ybase > 0 && this._lines.length <= this.ybase + this.y + addToY + 1) {
	                        this.ybase--;
	                        addToY++;
	                        if (this.ydisp > 0) {
	                            this.ydisp--;
	                        }
	                    }
	                    else {
	                        this._lines.push(this._terminal.blankLine(undefined, undefined, newCols));
	                    }
	                }
	            }
	        }
	        else {
	            for (var y = this._terminal.rows; y > newRows; y--) {
	                if (this._lines.length > newRows + this.ybase) {
	                    if (this._lines.length > this.ybase + this.y + 1) {
	                        this._lines.pop();
	                    }
	                    else {
	                        this.ybase++;
	                        this.ydisp++;
	                    }
	                }
	            }
	        }
	        if (this.y >= newRows) {
	            this.y = newRows - 1;
	        }
	        if (addToY) {
	            this.y += addToY;
	        }
	        if (this.x >= newCols) {
	            this.x = newCols - 1;
	        }
	        this.scrollTop = 0;
	        this.scrollBottom = newRows - 1;
	    };
	    return Buffer;
	}());
	exports.Buffer = Buffer;


	});

	unwrapExports(Buffer_1);
	var Buffer_2 = Buffer_1.Buffer;

	var BufferSet_1 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });


	var BufferSet = (function (_super) {
	    __extends(BufferSet, _super);
	    function BufferSet(_terminal) {
	        var _this = _super.call(this) || this;
	        _this._terminal = _terminal;
	        _this._normal = new Buffer_1.Buffer(_this._terminal);
	        _this._normal.fillViewportRows();
	        _this._alt = new Buffer_1.Buffer(_this._terminal);
	        _this._activeBuffer = _this._normal;
	        return _this;
	    }
	    Object.defineProperty(BufferSet.prototype, "alt", {
	        get: function () {
	            return this._alt;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BufferSet.prototype, "active", {
	        get: function () {
	            return this._activeBuffer;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BufferSet.prototype, "normal", {
	        get: function () {
	            return this._normal;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BufferSet.prototype.activateNormalBuffer = function () {
	        this._alt.clear();
	        this._activeBuffer = this._normal;
	        this.emit('activate', this._normal);
	    };
	    BufferSet.prototype.activateAltBuffer = function () {
	        this._alt.fillViewportRows();
	        this._activeBuffer = this._alt;
	        this.emit('activate', this._alt);
	    };
	    BufferSet.prototype.resize = function (newCols, newRows) {
	        this._normal.resize(newCols, newRows);
	        this._alt.resize(newCols, newRows);
	    };
	    return BufferSet;
	}(EventEmitter_1.EventEmitter));
	exports.BufferSet = BufferSet;


	});

	unwrapExports(BufferSet_1);
	var BufferSet_2 = BufferSet_1.BufferSet;

	var CompositionHelper_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var CompositionHelper = (function () {
	    function CompositionHelper(textarea, compositionView, terminal) {
	        this.textarea = textarea;
	        this.compositionView = compositionView;
	        this.terminal = terminal;
	        this.isComposing = false;
	        this.isSendingComposition = false;
	        this.compositionPosition = { start: null, end: null };
	    }
	    CompositionHelper.prototype.compositionstart = function () {
	        this.isComposing = true;
	        this.compositionPosition.start = this.textarea.value.length;
	        this.compositionView.textContent = '';
	        this.compositionView.classList.add('active');
	    };
	    CompositionHelper.prototype.compositionupdate = function (ev) {
	        var _this = this;
	        this.compositionView.textContent = ev.data;
	        this.updateCompositionElements();
	        setTimeout(function () {
	            _this.compositionPosition.end = _this.textarea.value.length;
	        }, 0);
	    };
	    CompositionHelper.prototype.compositionend = function () {
	        this.finalizeComposition(true);
	    };
	    CompositionHelper.prototype.keydown = function (ev) {
	        if (this.isComposing || this.isSendingComposition) {
	            if (ev.keyCode === 229) {
	                return false;
	            }
	            else if (ev.keyCode === 16 || ev.keyCode === 17 || ev.keyCode === 18) {
	                return false;
	            }
	            else {
	                this.finalizeComposition(false);
	            }
	        }
	        if (ev.keyCode === 229) {
	            this.handleAnyTextareaChanges();
	            return false;
	        }
	        return true;
	    };
	    CompositionHelper.prototype.finalizeComposition = function (waitForPropogation) {
	        var _this = this;
	        this.compositionView.classList.remove('active');
	        this.isComposing = false;
	        this.clearTextareaPosition();
	        if (!waitForPropogation) {
	            this.isSendingComposition = false;
	            var input = this.textarea.value.substring(this.compositionPosition.start, this.compositionPosition.end);
	            this.terminal.handler(input);
	        }
	        else {
	            var currentCompositionPosition_1 = {
	                start: this.compositionPosition.start,
	                end: this.compositionPosition.end,
	            };
	            this.isSendingComposition = true;
	            setTimeout(function () {
	                if (_this.isSendingComposition) {
	                    _this.isSendingComposition = false;
	                    var input = void 0;
	                    if (_this.isComposing) {
	                        input = _this.textarea.value.substring(currentCompositionPosition_1.start, currentCompositionPosition_1.end);
	                    }
	                    else {
	                        input = _this.textarea.value.substring(currentCompositionPosition_1.start);
	                    }
	                    _this.terminal.handler(input);
	                }
	            }, 0);
	        }
	    };
	    CompositionHelper.prototype.handleAnyTextareaChanges = function () {
	        var _this = this;
	        var oldValue = this.textarea.value;
	        setTimeout(function () {
	            if (!_this.isComposing) {
	                var newValue = _this.textarea.value;
	                var diff = newValue.replace(oldValue, '');
	                if (diff.length > 0) {
	                    _this.terminal.handler(diff);
	                }
	            }
	        }, 0);
	    };
	    CompositionHelper.prototype.updateCompositionElements = function (dontRecurse) {
	        var _this = this;
	        if (!this.isComposing) {
	            return;
	        }
	        var cursor = this.terminal.element.querySelector('.terminal-cursor');
	        if (cursor) {
	            var xtermRows = this.terminal.element.querySelector('.xterm-rows');
	            var cursorTop = xtermRows.offsetTop + cursor.offsetTop;
	            this.compositionView.style.left = cursor.offsetLeft + 'px';
	            this.compositionView.style.top = cursorTop + 'px';
	            this.compositionView.style.height = cursor.offsetHeight + 'px';
	            this.compositionView.style.lineHeight = cursor.offsetHeight + 'px';
	            var compositionViewBounds = this.compositionView.getBoundingClientRect();
	            this.textarea.style.left = cursor.offsetLeft + 'px';
	            this.textarea.style.top = cursorTop + 'px';
	            this.textarea.style.width = compositionViewBounds.width + 'px';
	            this.textarea.style.height = compositionViewBounds.height + 'px';
	            this.textarea.style.lineHeight = compositionViewBounds.height + 'px';
	        }
	        if (!dontRecurse) {
	            setTimeout(function () { return _this.updateCompositionElements(true); }, 0);
	        }
	    };
	    CompositionHelper.prototype.clearTextareaPosition = function () {
	        this.textarea.style.left = '';
	        this.textarea.style.top = '';
	    };
	    return CompositionHelper;
	}());
	exports.CompositionHelper = CompositionHelper;


	});

	unwrapExports(CompositionHelper_1);
	var CompositionHelper_2 = CompositionHelper_1.CompositionHelper;

	var Viewport_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var Viewport = (function () {
	    function Viewport(terminal, viewportElement, scrollArea, charMeasure) {
	        var _this = this;
	        this.terminal = terminal;
	        this.viewportElement = viewportElement;
	        this.scrollArea = scrollArea;
	        this.charMeasure = charMeasure;
	        this.currentRowHeight = 0;
	        this.lastRecordedBufferLength = 0;
	        this.lastRecordedViewportHeight = 0;
	        this.terminal.on('scroll', this.syncScrollArea.bind(this));
	        this.terminal.on('resize', this.syncScrollArea.bind(this));
	        this.viewportElement.addEventListener('scroll', this.onScroll.bind(this));
	        setTimeout(function () { return _this.syncScrollArea(); }, 0);
	    }
	    Viewport.prototype.refresh = function () {
	        if (this.charMeasure.height > 0) {
	            var rowHeightChanged = this.charMeasure.height !== this.currentRowHeight;
	            if (rowHeightChanged) {
	                this.currentRowHeight = this.charMeasure.height;
	                this.viewportElement.style.lineHeight = this.charMeasure.height + 'px';
	                this.terminal.rowContainer.style.lineHeight = this.charMeasure.height + 'px';
	            }
	            var viewportHeightChanged = this.lastRecordedViewportHeight !== this.terminal.rows;
	            if (rowHeightChanged || viewportHeightChanged) {
	                this.lastRecordedViewportHeight = this.terminal.rows;
	                this.viewportElement.style.height = this.charMeasure.height * this.terminal.rows + 'px';
	                this.terminal.selectionContainer.style.height = this.viewportElement.style.height;
	            }
	            this.scrollArea.style.height = (this.charMeasure.height * this.lastRecordedBufferLength) + 'px';
	        }
	    };
	    Viewport.prototype.syncScrollArea = function () {
	        if (this.lastRecordedBufferLength !== this.terminal.buffer.lines.length) {
	            this.lastRecordedBufferLength = this.terminal.buffer.lines.length;
	            this.refresh();
	        }
	        else if (this.lastRecordedViewportHeight !== this.terminal.rows) {
	            this.refresh();
	        }
	        else {
	            if (this.charMeasure.height !== this.currentRowHeight) {
	                this.refresh();
	            }
	        }
	        var scrollTop = this.terminal.buffer.ydisp * this.currentRowHeight;
	        if (this.viewportElement.scrollTop !== scrollTop) {
	            this.viewportElement.scrollTop = scrollTop;
	        }
	    };
	    Viewport.prototype.onScroll = function (ev) {
	        var newRow = Math.round(this.viewportElement.scrollTop / this.currentRowHeight);
	        var diff = newRow - this.terminal.buffer.ydisp;
	        this.terminal.scrollDisp(diff, true);
	    };
	    Viewport.prototype.onWheel = function (ev) {
	        if (ev.deltaY === 0) {
	            return;
	        }
	        var multiplier = 1;
	        if (ev.deltaMode === WheelEvent.DOM_DELTA_LINE) {
	            multiplier = this.currentRowHeight;
	        }
	        else if (ev.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
	            multiplier = this.currentRowHeight * this.terminal.rows;
	        }
	        this.viewportElement.scrollTop += ev.deltaY * multiplier;
	        ev.preventDefault();
	    };
	    Viewport.prototype.onTouchStart = function (ev) {
	        this.lastTouchY = ev.touches[0].pageY;
	    };
	    Viewport.prototype.onTouchMove = function (ev) {
	        var deltaY = this.lastTouchY - ev.touches[0].pageY;
	        this.lastTouchY = ev.touches[0].pageY;
	        if (deltaY === 0) {
	            return;
	        }
	        this.viewportElement.scrollTop += deltaY;
	        ev.preventDefault();
	    };
	    return Viewport;
	}());
	exports.Viewport = Viewport;


	});

	unwrapExports(Viewport_1);
	var Viewport_2 = Viewport_1.Viewport;

	var Clipboard = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	function prepareTextForTerminal(text, isMSWindows) {
	    if (isMSWindows) {
	        return text.replace(/\r?\n/g, '\r');
	    }
	    return text;
	}
	exports.prepareTextForTerminal = prepareTextForTerminal;
	function copyHandler(ev, term, selectionManager) {
	    if (term.browser.isMSIE) {
	        window.clipboardData.setData('Text', selectionManager.selectionText);
	    }
	    else {
	        ev.clipboardData.setData('text/plain', selectionManager.selectionText);
	    }
	    ev.preventDefault();
	}
	exports.copyHandler = copyHandler;
	function pasteHandler(ev, term) {
	    ev.stopPropagation();
	    var text;
	    var dispatchPaste = function (text) {
	        text = prepareTextForTerminal(text, term.browser.isMSWindows);
	        term.handler(text);
	        term.textarea.value = '';
	        term.emit('paste', text);
	        return term.cancel(ev);
	    };
	    if (term.browser.isMSIE) {
	        if (window.clipboardData) {
	            text = window.clipboardData.getData('Text');
	            dispatchPaste(text);
	        }
	    }
	    else {
	        if (ev.clipboardData) {
	            text = ev.clipboardData.getData('text/plain');
	            dispatchPaste(text);
	        }
	    }
	}
	exports.pasteHandler = pasteHandler;
	function moveTextAreaUnderMouseCursor(ev, textarea) {
	    textarea.style.position = 'fixed';
	    textarea.style.width = '20px';
	    textarea.style.height = '20px';
	    textarea.style.left = (ev.clientX - 10) + 'px';
	    textarea.style.top = (ev.clientY - 10) + 'px';
	    textarea.style.zIndex = '1000';
	    textarea.focus();
	    setTimeout(function () {
	        textarea.style.position = null;
	        textarea.style.width = null;
	        textarea.style.height = null;
	        textarea.style.left = null;
	        textarea.style.top = null;
	        textarea.style.zIndex = null;
	    }, 4);
	}
	exports.moveTextAreaUnderMouseCursor = moveTextAreaUnderMouseCursor;
	function rightClickHandler(ev, textarea, selectionManager) {
	    moveTextAreaUnderMouseCursor(ev, textarea);
	    textarea.value = selectionManager.selectionText;
	    textarea.select();
	}
	exports.rightClickHandler = rightClickHandler;


	});

	unwrapExports(Clipboard);
	var Clipboard_1 = Clipboard.prepareTextForTerminal;
	var Clipboard_2 = Clipboard.copyHandler;
	var Clipboard_3 = Clipboard.pasteHandler;
	var Clipboard_4 = Clipboard.moveTextAreaUnderMouseCursor;
	var Clipboard_5 = Clipboard.rightClickHandler;

	var EscapeSequences = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var C0;
	(function (C0) {
	    C0.NUL = '\x00';
	    C0.SOH = '\x01';
	    C0.STX = '\x02';
	    C0.ETX = '\x03';
	    C0.EOT = '\x04';
	    C0.ENQ = '\x05';
	    C0.ACK = '\x06';
	    C0.BEL = '\x07';
	    C0.BS = '\x08';
	    C0.HT = '\x09';
	    C0.LF = '\x0a';
	    C0.VT = '\x0b';
	    C0.FF = '\x0c';
	    C0.CR = '\x0d';
	    C0.SO = '\x0e';
	    C0.SI = '\x0f';
	    C0.DLE = '\x10';
	    C0.DC1 = '\x11';
	    C0.DC2 = '\x12';
	    C0.DC3 = '\x13';
	    C0.DC4 = '\x14';
	    C0.NAK = '\x15';
	    C0.SYN = '\x16';
	    C0.ETB = '\x17';
	    C0.CAN = '\x18';
	    C0.EM = '\x19';
	    C0.SUB = '\x1a';
	    C0.ESC = '\x1b';
	    C0.FS = '\x1c';
	    C0.GS = '\x1d';
	    C0.RS = '\x1e';
	    C0.US = '\x1f';
	    C0.SP = '\x20';
	    C0.DEL = '\x7f';
	})(C0 = exports.C0 || (exports.C0 = {}));


	});

	unwrapExports(EscapeSequences);
	var EscapeSequences_1 = EscapeSequences.C0;

	var Charsets = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CHARSETS = {};
	exports.DEFAULT_CHARSET = exports.CHARSETS['B'];
	exports.CHARSETS['0'] = {
	    '`': '\u25c6',
	    'a': '\u2592',
	    'b': '\u0009',
	    'c': '\u000c',
	    'd': '\u000d',
	    'e': '\u000a',
	    'f': '\u00b0',
	    'g': '\u00b1',
	    'h': '\u2424',
	    'i': '\u000b',
	    'j': '\u2518',
	    'k': '\u2510',
	    'l': '\u250c',
	    'm': '\u2514',
	    'n': '\u253c',
	    'o': '\u23ba',
	    'p': '\u23bb',
	    'q': '\u2500',
	    'r': '\u23bc',
	    's': '\u23bd',
	    't': '\u251c',
	    'u': '\u2524',
	    'v': '\u2534',
	    'w': '\u252c',
	    'x': '\u2502',
	    'y': '\u2264',
	    'z': '\u2265',
	    '{': '\u03c0',
	    '|': '\u2260',
	    '}': '\u00a3',
	    '~': '\u00b7'
	};
	exports.CHARSETS['A'] = {
	    '#': '£'
	};
	exports.CHARSETS['B'] = null;
	exports.CHARSETS['4'] = {
	    '#': '£',
	    '@': '¾',
	    '[': 'ij',
	    '\\': '½',
	    ']': '|',
	    '{': '¨',
	    '|': 'f',
	    '}': '¼',
	    '~': '´'
	};
	exports.CHARSETS['C'] =
	    exports.CHARSETS['5'] = {
	        '[': 'Ä',
	        '\\': 'Ö',
	        ']': 'Å',
	        '^': 'Ü',
	        '`': 'é',
	        '{': 'ä',
	        '|': 'ö',
	        '}': 'å',
	        '~': 'ü'
	    };
	exports.CHARSETS['R'] = {
	    '#': '£',
	    '@': 'à',
	    '[': '°',
	    '\\': 'ç',
	    ']': '§',
	    '{': 'é',
	    '|': 'ù',
	    '}': 'è',
	    '~': '¨'
	};
	exports.CHARSETS['Q'] = {
	    '@': 'à',
	    '[': 'â',
	    '\\': 'ç',
	    ']': 'ê',
	    '^': 'î',
	    '`': 'ô',
	    '{': 'é',
	    '|': 'ù',
	    '}': 'è',
	    '~': 'û'
	};
	exports.CHARSETS['K'] = {
	    '@': '§',
	    '[': 'Ä',
	    '\\': 'Ö',
	    ']': 'Ü',
	    '{': 'ä',
	    '|': 'ö',
	    '}': 'ü',
	    '~': 'ß'
	};
	exports.CHARSETS['Y'] = {
	    '#': '£',
	    '@': '§',
	    '[': '°',
	    '\\': 'ç',
	    ']': 'é',
	    '`': 'ù',
	    '{': 'à',
	    '|': 'ò',
	    '}': 'è',
	    '~': 'ì'
	};
	exports.CHARSETS['E'] =
	    exports.CHARSETS['6'] = {
	        '@': 'Ä',
	        '[': 'Æ',
	        '\\': 'Ø',
	        ']': 'Å',
	        '^': 'Ü',
	        '`': 'ä',
	        '{': 'æ',
	        '|': 'ø',
	        '}': 'å',
	        '~': 'ü'
	    };
	exports.CHARSETS['Z'] = {
	    '#': '£',
	    '@': '§',
	    '[': '¡',
	    '\\': 'Ñ',
	    ']': '¿',
	    '{': '°',
	    '|': 'ñ',
	    '}': 'ç'
	};
	exports.CHARSETS['H'] =
	    exports.CHARSETS['7'] = {
	        '@': 'É',
	        '[': 'Ä',
	        '\\': 'Ö',
	        ']': 'Å',
	        '^': 'Ü',
	        '`': 'é',
	        '{': 'ä',
	        '|': 'ö',
	        '}': 'å',
	        '~': 'ü'
	    };
	exports.CHARSETS['='] = {
	    '#': 'ù',
	    '@': 'à',
	    '[': 'é',
	    '\\': 'ç',
	    ']': 'ê',
	    '^': 'î',
	    '_': 'è',
	    '`': 'ô',
	    '{': 'ä',
	    '|': 'ö',
	    '}': 'ü',
	    '~': 'û'
	};


	});

	unwrapExports(Charsets);
	var Charsets_1 = Charsets.CHARSETS;
	var Charsets_2 = Charsets.DEFAULT_CHARSET;

	var InputHandler_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	var InputHandler = (function () {
	    function InputHandler(_terminal) {
	        this._terminal = _terminal;
	    }
	    InputHandler.prototype.addChar = function (char, code) {
	        if (char >= ' ') {
	            var ch_width = exports.wcwidth(code);
	            if (this._terminal.charset && this._terminal.charset[char]) {
	                char = this._terminal.charset[char];
	            }
	            var row = this._terminal.buffer.y + this._terminal.buffer.ybase;
	            if (!ch_width && this._terminal.buffer.x) {
	                if (this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 1]) {
	                    if (!this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 1][2]) {
	                        if (this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 2])
	                            this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 2][1] += char;
	                    }
	                    else {
	                        this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 1][1] += char;
	                    }
	                    this._terminal.updateRange(this._terminal.buffer.y);
	                }
	                return;
	            }
	            if (this._terminal.buffer.x + ch_width - 1 >= this._terminal.cols) {
	                if (this._terminal.wraparoundMode) {
	                    this._terminal.buffer.x = 0;
	                    this._terminal.buffer.y++;
	                    if (this._terminal.buffer.y > this._terminal.buffer.scrollBottom) {
	                        this._terminal.buffer.y--;
	                        this._terminal.scroll(true);
	                    }
	                    else {
	                        this._terminal.buffer.lines.get(this._terminal.buffer.y).isWrapped = true;
	                    }
	                }
	                else {
	                    if (ch_width === 2)
	                        return;
	                }
	            }
	            row = this._terminal.buffer.y + this._terminal.buffer.ybase;
	            if (this._terminal.insertMode) {
	                for (var moves = 0; moves < ch_width; ++moves) {
	                    var removed = this._terminal.buffer.lines.get(this._terminal.buffer.y + this._terminal.buffer.ybase).pop();
	                    if (removed[2] === 0
	                        && this._terminal.buffer.lines.get(row)[this._terminal.cols - 2]
	                        && this._terminal.buffer.lines.get(row)[this._terminal.cols - 2][2] === 2) {
	                        this._terminal.buffer.lines.get(row)[this._terminal.cols - 2] = [this._terminal.curAttr, ' ', 1];
	                    }
	                    this._terminal.buffer.lines.get(row).splice(this._terminal.buffer.x, 0, [this._terminal.curAttr, ' ', 1]);
	                }
	            }
	            this._terminal.buffer.lines.get(row)[this._terminal.buffer.x] = [this._terminal.curAttr, char, ch_width];
	            this._terminal.buffer.x++;
	            this._terminal.updateRange(this._terminal.buffer.y);
	            if (ch_width === 2) {
	                this._terminal.buffer.lines.get(row)[this._terminal.buffer.x] = [this._terminal.curAttr, '', 0];
	                this._terminal.buffer.x++;
	            }
	        }
	    };
	    InputHandler.prototype.bell = function () {
	        var _this = this;
	        if (!this._terminal.visualBell) {
	            return;
	        }
	        this._terminal.element.style.borderColor = 'white';
	        setTimeout(function () { return _this._terminal.element.style.borderColor = ''; }, 10);
	        if (this._terminal.popOnBell) {
	            this._terminal.focus();
	        }
	    };
	    InputHandler.prototype.lineFeed = function () {
	        if (this._terminal.convertEol) {
	            this._terminal.buffer.x = 0;
	        }
	        this._terminal.buffer.y++;
	        if (this._terminal.buffer.y > this._terminal.buffer.scrollBottom) {
	            this._terminal.buffer.y--;
	            this._terminal.scroll();
	        }
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x--;
	        }
	        this._terminal.emit('lineFeed');
	    };
	    InputHandler.prototype.carriageReturn = function () {
	        this._terminal.buffer.x = 0;
	    };
	    InputHandler.prototype.backspace = function () {
	        if (this._terminal.buffer.x > 0) {
	            this._terminal.buffer.x--;
	        }
	    };
	    InputHandler.prototype.tab = function () {
	        this._terminal.buffer.x = this._terminal.nextStop();
	    };
	    InputHandler.prototype.shiftOut = function () {
	        this._terminal.setgLevel(1);
	    };
	    InputHandler.prototype.shiftIn = function () {
	        this._terminal.setgLevel(0);
	    };
	    InputHandler.prototype.insertChars = function (params) {
	        var param, row, j, ch;
	        param = params[0];
	        if (param < 1)
	            param = 1;
	        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
	        j = this._terminal.buffer.x;
	        ch = [this._terminal.eraseAttr(), ' ', 1];
	        while (param-- && j < this._terminal.cols) {
	            this._terminal.buffer.lines.get(row).splice(j++, 0, ch);
	            this._terminal.buffer.lines.get(row).pop();
	        }
	    };
	    InputHandler.prototype.cursorUp = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.y -= param;
	        if (this._terminal.buffer.y < 0) {
	            this._terminal.buffer.y = 0;
	        }
	    };
	    InputHandler.prototype.cursorDown = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.y += param;
	        if (this._terminal.buffer.y >= this._terminal.rows) {
	            this._terminal.buffer.y = this._terminal.rows - 1;
	        }
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x--;
	        }
	    };
	    InputHandler.prototype.cursorForward = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.x += param;
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x = this._terminal.cols - 1;
	        }
	    };
	    InputHandler.prototype.cursorBackward = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x--;
	        }
	        this._terminal.buffer.x -= param;
	        if (this._terminal.buffer.x < 0) {
	            this._terminal.buffer.x = 0;
	        }
	    };
	    InputHandler.prototype.cursorNextLine = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.y += param;
	        if (this._terminal.buffer.y >= this._terminal.rows) {
	            this._terminal.buffer.y = this._terminal.rows - 1;
	        }
	        this._terminal.buffer.x = 0;
	    };
	    InputHandler.prototype.cursorPrecedingLine = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.y -= param;
	        if (this._terminal.buffer.y < 0) {
	            this._terminal.buffer.y = 0;
	        }
	        this._terminal.buffer.x = 0;
	    };
	    InputHandler.prototype.cursorCharAbsolute = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.x = param - 1;
	    };
	    InputHandler.prototype.cursorPosition = function (params) {
	        var row, col;
	        row = params[0] - 1;
	        if (params.length >= 2) {
	            col = params[1] - 1;
	        }
	        else {
	            col = 0;
	        }
	        if (row < 0) {
	            row = 0;
	        }
	        else if (row >= this._terminal.rows) {
	            row = this._terminal.rows - 1;
	        }
	        if (col < 0) {
	            col = 0;
	        }
	        else if (col >= this._terminal.cols) {
	            col = this._terminal.cols - 1;
	        }
	        this._terminal.buffer.x = col;
	        this._terminal.buffer.y = row;
	    };
	    InputHandler.prototype.cursorForwardTab = function (params) {
	        var param = params[0] || 1;
	        while (param--) {
	            this._terminal.buffer.x = this._terminal.nextStop();
	        }
	    };
	    InputHandler.prototype.eraseInDisplay = function (params) {
	        var j;
	        switch (params[0]) {
	            case 0:
	                this._terminal.eraseRight(this._terminal.buffer.x, this._terminal.buffer.y);
	                j = this._terminal.buffer.y + 1;
	                for (; j < this._terminal.rows; j++) {
	                    this._terminal.eraseLine(j);
	                }
	                break;
	            case 1:
	                this._terminal.eraseLeft(this._terminal.buffer.x, this._terminal.buffer.y);
	                j = this._terminal.buffer.y;
	                while (j--) {
	                    this._terminal.eraseLine(j);
	                }
	                break;
	            case 2:
	                j = this._terminal.rows;
	                while (j--)
	                    this._terminal.eraseLine(j);
	                break;
	            case 3:
	                var scrollBackSize = this._terminal.buffer.lines.length - this._terminal.rows;
	                if (scrollBackSize > 0) {
	                    this._terminal.buffer.lines.trimStart(scrollBackSize);
	                    this._terminal.buffer.ybase = Math.max(this._terminal.buffer.ybase - scrollBackSize, 0);
	                    this._terminal.buffer.ydisp = Math.max(this._terminal.buffer.ydisp - scrollBackSize, 0);
	                    this._terminal.emit('scroll', 0);
	                }
	                break;
	        }
	    };
	    InputHandler.prototype.eraseInLine = function (params) {
	        switch (params[0]) {
	            case 0:
	                this._terminal.eraseRight(this._terminal.buffer.x, this._terminal.buffer.y);
	                break;
	            case 1:
	                this._terminal.eraseLeft(this._terminal.buffer.x, this._terminal.buffer.y);
	                break;
	            case 2:
	                this._terminal.eraseLine(this._terminal.buffer.y);
	                break;
	        }
	    };
	    InputHandler.prototype.insertLines = function (params) {
	        var param, row, j;
	        param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
	        j = this._terminal.rows - 1 - this._terminal.buffer.scrollBottom;
	        j = this._terminal.rows - 1 + this._terminal.buffer.ybase - j + 1;
	        while (param--) {
	            if (this._terminal.buffer.lines.length === this._terminal.buffer.lines.maxLength) {
	                this._terminal.buffer.lines.trimStart(1);
	                this._terminal.buffer.ybase--;
	                this._terminal.buffer.ydisp--;
	                row--;
	                j--;
	            }
	            this._terminal.buffer.lines.splice(row, 0, this._terminal.blankLine(true));
	            this._terminal.buffer.lines.splice(j, 1);
	        }
	        this._terminal.updateRange(this._terminal.buffer.y);
	        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
	    };
	    InputHandler.prototype.deleteLines = function (params) {
	        var param, row, j;
	        param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
	        j = this._terminal.rows - 1 - this._terminal.buffer.scrollBottom;
	        j = this._terminal.rows - 1 + this._terminal.buffer.ybase - j;
	        while (param--) {
	            if (this._terminal.buffer.lines.length === this._terminal.buffer.lines.maxLength) {
	                this._terminal.buffer.lines.trimStart(1);
	                this._terminal.buffer.ybase -= 1;
	                this._terminal.buffer.ydisp -= 1;
	            }
	            this._terminal.buffer.lines.splice(j + 1, 0, this._terminal.blankLine(true));
	            this._terminal.buffer.lines.splice(row, 1);
	        }
	        this._terminal.updateRange(this._terminal.buffer.y);
	        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
	    };
	    InputHandler.prototype.deleteChars = function (params) {
	        var param, row, ch;
	        param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
	        ch = [this._terminal.eraseAttr(), ' ', 1];
	        while (param--) {
	            this._terminal.buffer.lines.get(row).splice(this._terminal.buffer.x, 1);
	            this._terminal.buffer.lines.get(row).push(ch);
	        }
	    };
	    InputHandler.prototype.scrollUp = function (params) {
	        var param = params[0] || 1;
	        while (param--) {
	            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollTop, 1);
	            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollBottom, 0, this._terminal.blankLine());
	        }
	        this._terminal.updateRange(this._terminal.buffer.scrollTop);
	        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
	    };
	    InputHandler.prototype.scrollDown = function (params) {
	        var param = params[0] || 1;
	        while (param--) {
	            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollBottom, 1);
	            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollTop, 0, this._terminal.blankLine());
	        }
	        this._terminal.updateRange(this._terminal.buffer.scrollTop);
	        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
	    };
	    InputHandler.prototype.eraseChars = function (params) {
	        var param, row, j, ch;
	        param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
	        j = this._terminal.buffer.x;
	        ch = [this._terminal.eraseAttr(), ' ', 1];
	        while (param-- && j < this._terminal.cols) {
	            this._terminal.buffer.lines.get(row)[j++] = ch;
	        }
	    };
	    InputHandler.prototype.cursorBackwardTab = function (params) {
	        var param = params[0] || 1;
	        while (param--) {
	            this._terminal.buffer.x = this._terminal.prevStop();
	        }
	    };
	    InputHandler.prototype.charPosAbsolute = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.x = param - 1;
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x = this._terminal.cols - 1;
	        }
	    };
	    InputHandler.prototype.HPositionRelative = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.x += param;
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x = this._terminal.cols - 1;
	        }
	    };
	    InputHandler.prototype.repeatPrecedingCharacter = function (params) {
	        var param = params[0] || 1, line = this._terminal.buffer.lines.get(this._terminal.buffer.ybase + this._terminal.buffer.y), ch = line[this._terminal.buffer.x - 1] || [this._terminal.defAttr, ' ', 1];
	        while (param--) {
	            line[this._terminal.buffer.x++] = ch;
	        }
	    };
	    InputHandler.prototype.sendDeviceAttributes = function (params) {
	        if (params[0] > 0) {
	            return;
	        }
	        if (!this._terminal.prefix) {
	            if (this._terminal.is('xterm') || this._terminal.is('rxvt-unicode') || this._terminal.is('screen')) {
	                this._terminal.send(EscapeSequences.C0.ESC + '[?1;2c');
	            }
	            else if (this._terminal.is('linux')) {
	                this._terminal.send(EscapeSequences.C0.ESC + '[?6c');
	            }
	        }
	        else if (this._terminal.prefix === '>') {
	            if (this._terminal.is('xterm')) {
	                this._terminal.send(EscapeSequences.C0.ESC + '[>0;276;0c');
	            }
	            else if (this._terminal.is('rxvt-unicode')) {
	                this._terminal.send(EscapeSequences.C0.ESC + '[>85;95;0c');
	            }
	            else if (this._terminal.is('linux')) {
	                this._terminal.send(params[0] + 'c');
	            }
	            else if (this._terminal.is('screen')) {
	                this._terminal.send(EscapeSequences.C0.ESC + '[>83;40003;0c');
	            }
	        }
	    };
	    InputHandler.prototype.linePosAbsolute = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.y = param - 1;
	        if (this._terminal.buffer.y >= this._terminal.rows) {
	            this._terminal.buffer.y = this._terminal.rows - 1;
	        }
	    };
	    InputHandler.prototype.VPositionRelative = function (params) {
	        var param = params[0];
	        if (param < 1) {
	            param = 1;
	        }
	        this._terminal.buffer.y += param;
	        if (this._terminal.buffer.y >= this._terminal.rows) {
	            this._terminal.buffer.y = this._terminal.rows - 1;
	        }
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x--;
	        }
	    };
	    InputHandler.prototype.HVPosition = function (params) {
	        if (params[0] < 1)
	            params[0] = 1;
	        if (params[1] < 1)
	            params[1] = 1;
	        this._terminal.buffer.y = params[0] - 1;
	        if (this._terminal.buffer.y >= this._terminal.rows) {
	            this._terminal.buffer.y = this._terminal.rows - 1;
	        }
	        this._terminal.buffer.x = params[1] - 1;
	        if (this._terminal.buffer.x >= this._terminal.cols) {
	            this._terminal.buffer.x = this._terminal.cols - 1;
	        }
	    };
	    InputHandler.prototype.tabClear = function (params) {
	        var param = params[0];
	        if (param <= 0) {
	            delete this._terminal.buffer.tabs[this._terminal.buffer.x];
	        }
	        else if (param === 3) {
	            this._terminal.buffer.tabs = {};
	        }
	    };
	    InputHandler.prototype.setMode = function (params) {
	        if (params.length > 1) {
	            for (var i = 0; i < params.length; i++) {
	                this.setMode([params[i]]);
	            }
	            return;
	        }
	        if (!this._terminal.prefix) {
	            switch (params[0]) {
	                case 4:
	                    this._terminal.insertMode = true;
	                    break;
	            }
	        }
	        else if (this._terminal.prefix === '?') {
	            switch (params[0]) {
	                case 1:
	                    this._terminal.applicationCursor = true;
	                    break;
	                case 2:
	                    this._terminal.setgCharset(0, Charsets.DEFAULT_CHARSET);
	                    this._terminal.setgCharset(1, Charsets.DEFAULT_CHARSET);
	                    this._terminal.setgCharset(2, Charsets.DEFAULT_CHARSET);
	                    this._terminal.setgCharset(3, Charsets.DEFAULT_CHARSET);
	                    break;
	                case 3:
	                    this._terminal.savedCols = this._terminal.cols;
	                    this._terminal.resize(132, this._terminal.rows);
	                    break;
	                case 6:
	                    this._terminal.originMode = true;
	                    break;
	                case 7:
	                    this._terminal.wraparoundMode = true;
	                    break;
	                case 12:
	                    break;
	                case 66:
	                    this._terminal.log('Serial port requested application keypad.');
	                    this._terminal.applicationKeypad = true;
	                    this._terminal.viewport.syncScrollArea();
	                    break;
	                case 9:
	                case 1000:
	                case 1002:
	                case 1003:
	                    this._terminal.x10Mouse = params[0] === 9;
	                    this._terminal.vt200Mouse = params[0] === 1000;
	                    this._terminal.normalMouse = params[0] > 1000;
	                    this._terminal.mouseEvents = true;
	                    this._terminal.element.classList.add('enable-mouse-events');
	                    this._terminal.selectionManager.disable();
	                    this._terminal.log('Binding to mouse events.');
	                    break;
	                case 1004:
	                    this._terminal.sendFocus = true;
	                    break;
	                case 1005:
	                    this._terminal.utfMouse = true;
	                    break;
	                case 1006:
	                    this._terminal.sgrMouse = true;
	                    break;
	                case 1015:
	                    this._terminal.urxvtMouse = true;
	                    break;
	                case 25:
	                    this._terminal.cursorHidden = false;
	                    break;
	                case 1049:
	                case 47:
	                case 1047:
	                    this._terminal.buffers.activateAltBuffer();
	                    this._terminal.viewport.syncScrollArea();
	                    this._terminal.showCursor();
	                    break;
	            }
	        }
	    };
	    InputHandler.prototype.resetMode = function (params) {
	        if (params.length > 1) {
	            for (var i = 0; i < params.length; i++) {
	                this.resetMode([params[i]]);
	            }
	            return;
	        }
	        if (!this._terminal.prefix) {
	            switch (params[0]) {
	                case 4:
	                    this._terminal.insertMode = false;
	                    break;
	            }
	        }
	        else if (this._terminal.prefix === '?') {
	            switch (params[0]) {
	                case 1:
	                    this._terminal.applicationCursor = false;
	                    break;
	                case 3:
	                    if (this._terminal.cols === 132 && this._terminal.savedCols) {
	                        this._terminal.resize(this._terminal.savedCols, this._terminal.rows);
	                    }
	                    delete this._terminal.savedCols;
	                    break;
	                case 6:
	                    this._terminal.originMode = false;
	                    break;
	                case 7:
	                    this._terminal.wraparoundMode = false;
	                    break;
	                case 12:
	                    break;
	                case 66:
	                    this._terminal.log('Switching back to normal keypad.');
	                    this._terminal.applicationKeypad = false;
	                    this._terminal.viewport.syncScrollArea();
	                    break;
	                case 9:
	                case 1000:
	                case 1002:
	                case 1003:
	                    this._terminal.x10Mouse = false;
	                    this._terminal.vt200Mouse = false;
	                    this._terminal.normalMouse = false;
	                    this._terminal.mouseEvents = false;
	                    this._terminal.element.classList.remove('enable-mouse-events');
	                    this._terminal.selectionManager.enable();
	                    break;
	                case 1004:
	                    this._terminal.sendFocus = false;
	                    break;
	                case 1005:
	                    this._terminal.utfMouse = false;
	                    break;
	                case 1006:
	                    this._terminal.sgrMouse = false;
	                    break;
	                case 1015:
	                    this._terminal.urxvtMouse = false;
	                    break;
	                case 25:
	                    this._terminal.cursorHidden = true;
	                    break;
	                case 1049:
	                case 47:
	                case 1047:
	                    this._terminal.buffers.activateNormalBuffer();
	                    this._terminal.selectionManager.setBuffer(this._terminal.buffer.lines);
	                    this._terminal.refresh(0, this._terminal.rows - 1);
	                    this._terminal.viewport.syncScrollArea();
	                    this._terminal.showCursor();
	                    break;
	            }
	        }
	    };
	    InputHandler.prototype.charAttributes = function (params) {
	        if (params.length === 1 && params[0] === 0) {
	            this._terminal.curAttr = this._terminal.defAttr;
	            return;
	        }
	        var l = params.length, i = 0, flags = this._terminal.curAttr >> 18, fg = (this._terminal.curAttr >> 9) & 0x1ff, bg = this._terminal.curAttr & 0x1ff, p;
	        for (; i < l; i++) {
	            p = params[i];
	            if (p >= 30 && p <= 37) {
	                fg = p - 30;
	            }
	            else if (p >= 40 && p <= 47) {
	                bg = p - 40;
	            }
	            else if (p >= 90 && p <= 97) {
	                p += 8;
	                fg = p - 90;
	            }
	            else if (p >= 100 && p <= 107) {
	                p += 8;
	                bg = p - 100;
	            }
	            else if (p === 0) {
	                flags = this._terminal.defAttr >> 18;
	                fg = (this._terminal.defAttr >> 9) & 0x1ff;
	                bg = this._terminal.defAttr & 0x1ff;
	            }
	            else if (p === 1) {
	                flags |= 1;
	            }
	            else if (p === 4) {
	                flags |= 2;
	            }
	            else if (p === 5) {
	                flags |= 4;
	            }
	            else if (p === 7) {
	                flags |= 8;
	            }
	            else if (p === 8) {
	                flags |= 16;
	            }
	            else if (p === 22) {
	                flags &= ~1;
	            }
	            else if (p === 24) {
	                flags &= ~2;
	            }
	            else if (p === 25) {
	                flags &= ~4;
	            }
	            else if (p === 27) {
	                flags &= ~8;
	            }
	            else if (p === 28) {
	                flags &= ~16;
	            }
	            else if (p === 39) {
	                fg = (this._terminal.defAttr >> 9) & 0x1ff;
	            }
	            else if (p === 49) {
	                bg = this._terminal.defAttr & 0x1ff;
	            }
	            else if (p === 38) {
	                if (params[i + 1] === 2) {
	                    i += 2;
	                    fg = this._terminal.matchColor(params[i] & 0xff, params[i + 1] & 0xff, params[i + 2] & 0xff);
	                    if (fg === -1)
	                        fg = 0x1ff;
	                    i += 2;
	                }
	                else if (params[i + 1] === 5) {
	                    i += 2;
	                    p = params[i] & 0xff;
	                    fg = p;
	                }
	            }
	            else if (p === 48) {
	                if (params[i + 1] === 2) {
	                    i += 2;
	                    bg = this._terminal.matchColor(params[i] & 0xff, params[i + 1] & 0xff, params[i + 2] & 0xff);
	                    if (bg === -1)
	                        bg = 0x1ff;
	                    i += 2;
	                }
	                else if (params[i + 1] === 5) {
	                    i += 2;
	                    p = params[i] & 0xff;
	                    bg = p;
	                }
	            }
	            else if (p === 100) {
	                fg = (this._terminal.defAttr >> 9) & 0x1ff;
	                bg = this._terminal.defAttr & 0x1ff;
	            }
	            else {
	                this._terminal.error('Unknown SGR attribute: %d.', p);
	            }
	        }
	        this._terminal.curAttr = (flags << 18) | (fg << 9) | bg;
	    };
	    InputHandler.prototype.deviceStatus = function (params) {
	        if (!this._terminal.prefix) {
	            switch (params[0]) {
	                case 5:
	                    this._terminal.send(EscapeSequences.C0.ESC + '[0n');
	                    break;
	                case 6:
	                    this._terminal.send(EscapeSequences.C0.ESC + '['
	                        + (this._terminal.buffer.y + 1)
	                        + ';'
	                        + (this._terminal.buffer.x + 1)
	                        + 'R');
	                    break;
	            }
	        }
	        else if (this._terminal.prefix === '?') {
	            switch (params[0]) {
	                case 6:
	                    this._terminal.send(EscapeSequences.C0.ESC + '[?'
	                        + (this._terminal.buffer.y + 1)
	                        + ';'
	                        + (this._terminal.buffer.x + 1)
	                        + 'R');
	                    break;
	            }
	        }
	    };
	    InputHandler.prototype.softReset = function (params) {
	        this._terminal.cursorHidden = false;
	        this._terminal.insertMode = false;
	        this._terminal.originMode = false;
	        this._terminal.wraparoundMode = true;
	        this._terminal.applicationKeypad = false;
	        this._terminal.viewport.syncScrollArea();
	        this._terminal.applicationCursor = false;
	        this._terminal.buffer.scrollTop = 0;
	        this._terminal.buffer.scrollBottom = this._terminal.rows - 1;
	        this._terminal.curAttr = this._terminal.defAttr;
	        this._terminal.buffer.x = this._terminal.buffer.y = 0;
	        this._terminal.charset = null;
	        this._terminal.glevel = 0;
	        this._terminal.charsets = [null];
	    };
	    InputHandler.prototype.setCursorStyle = function (params) {
	        var param = params[0] < 1 ? 1 : params[0];
	        switch (param) {
	            case 1:
	            case 2:
	                this._terminal.setOption('cursorStyle', 'block');
	                break;
	            case 3:
	            case 4:
	                this._terminal.setOption('cursorStyle', 'underline');
	                break;
	            case 5:
	            case 6:
	                this._terminal.setOption('cursorStyle', 'bar');
	                break;
	        }
	        var isBlinking = param % 2 === 1;
	        this._terminal.setOption('cursorBlink', isBlinking);
	    };
	    InputHandler.prototype.setScrollRegion = function (params) {
	        if (this._terminal.prefix)
	            return;
	        this._terminal.buffer.scrollTop = (params[0] || 1) - 1;
	        this._terminal.buffer.scrollBottom = (params[1] && params[1] <= this._terminal.rows ? params[1] : this._terminal.rows) - 1;
	        this._terminal.buffer.x = 0;
	        this._terminal.buffer.y = 0;
	    };
	    InputHandler.prototype.saveCursor = function (params) {
	        this._terminal.buffer.savedX = this._terminal.buffer.x;
	        this._terminal.buffer.savedY = this._terminal.buffer.y;
	    };
	    InputHandler.prototype.restoreCursor = function (params) {
	        this._terminal.buffer.x = this._terminal.buffer.savedX || 0;
	        this._terminal.buffer.y = this._terminal.buffer.savedY || 0;
	    };
	    return InputHandler;
	}());
	exports.InputHandler = InputHandler;
	exports.wcwidth = (function (opts) {
	    var COMBINING_BMP = [
	        [0x0300, 0x036F], [0x0483, 0x0486], [0x0488, 0x0489],
	        [0x0591, 0x05BD], [0x05BF, 0x05BF], [0x05C1, 0x05C2],
	        [0x05C4, 0x05C5], [0x05C7, 0x05C7], [0x0600, 0x0603],
	        [0x0610, 0x0615], [0x064B, 0x065E], [0x0670, 0x0670],
	        [0x06D6, 0x06E4], [0x06E7, 0x06E8], [0x06EA, 0x06ED],
	        [0x070F, 0x070F], [0x0711, 0x0711], [0x0730, 0x074A],
	        [0x07A6, 0x07B0], [0x07EB, 0x07F3], [0x0901, 0x0902],
	        [0x093C, 0x093C], [0x0941, 0x0948], [0x094D, 0x094D],
	        [0x0951, 0x0954], [0x0962, 0x0963], [0x0981, 0x0981],
	        [0x09BC, 0x09BC], [0x09C1, 0x09C4], [0x09CD, 0x09CD],
	        [0x09E2, 0x09E3], [0x0A01, 0x0A02], [0x0A3C, 0x0A3C],
	        [0x0A41, 0x0A42], [0x0A47, 0x0A48], [0x0A4B, 0x0A4D],
	        [0x0A70, 0x0A71], [0x0A81, 0x0A82], [0x0ABC, 0x0ABC],
	        [0x0AC1, 0x0AC5], [0x0AC7, 0x0AC8], [0x0ACD, 0x0ACD],
	        [0x0AE2, 0x0AE3], [0x0B01, 0x0B01], [0x0B3C, 0x0B3C],
	        [0x0B3F, 0x0B3F], [0x0B41, 0x0B43], [0x0B4D, 0x0B4D],
	        [0x0B56, 0x0B56], [0x0B82, 0x0B82], [0x0BC0, 0x0BC0],
	        [0x0BCD, 0x0BCD], [0x0C3E, 0x0C40], [0x0C46, 0x0C48],
	        [0x0C4A, 0x0C4D], [0x0C55, 0x0C56], [0x0CBC, 0x0CBC],
	        [0x0CBF, 0x0CBF], [0x0CC6, 0x0CC6], [0x0CCC, 0x0CCD],
	        [0x0CE2, 0x0CE3], [0x0D41, 0x0D43], [0x0D4D, 0x0D4D],
	        [0x0DCA, 0x0DCA], [0x0DD2, 0x0DD4], [0x0DD6, 0x0DD6],
	        [0x0E31, 0x0E31], [0x0E34, 0x0E3A], [0x0E47, 0x0E4E],
	        [0x0EB1, 0x0EB1], [0x0EB4, 0x0EB9], [0x0EBB, 0x0EBC],
	        [0x0EC8, 0x0ECD], [0x0F18, 0x0F19], [0x0F35, 0x0F35],
	        [0x0F37, 0x0F37], [0x0F39, 0x0F39], [0x0F71, 0x0F7E],
	        [0x0F80, 0x0F84], [0x0F86, 0x0F87], [0x0F90, 0x0F97],
	        [0x0F99, 0x0FBC], [0x0FC6, 0x0FC6], [0x102D, 0x1030],
	        [0x1032, 0x1032], [0x1036, 0x1037], [0x1039, 0x1039],
	        [0x1058, 0x1059], [0x1160, 0x11FF], [0x135F, 0x135F],
	        [0x1712, 0x1714], [0x1732, 0x1734], [0x1752, 0x1753],
	        [0x1772, 0x1773], [0x17B4, 0x17B5], [0x17B7, 0x17BD],
	        [0x17C6, 0x17C6], [0x17C9, 0x17D3], [0x17DD, 0x17DD],
	        [0x180B, 0x180D], [0x18A9, 0x18A9], [0x1920, 0x1922],
	        [0x1927, 0x1928], [0x1932, 0x1932], [0x1939, 0x193B],
	        [0x1A17, 0x1A18], [0x1B00, 0x1B03], [0x1B34, 0x1B34],
	        [0x1B36, 0x1B3A], [0x1B3C, 0x1B3C], [0x1B42, 0x1B42],
	        [0x1B6B, 0x1B73], [0x1DC0, 0x1DCA], [0x1DFE, 0x1DFF],
	        [0x200B, 0x200F], [0x202A, 0x202E], [0x2060, 0x2063],
	        [0x206A, 0x206F], [0x20D0, 0x20EF], [0x302A, 0x302F],
	        [0x3099, 0x309A], [0xA806, 0xA806], [0xA80B, 0xA80B],
	        [0xA825, 0xA826], [0xFB1E, 0xFB1E], [0xFE00, 0xFE0F],
	        [0xFE20, 0xFE23], [0xFEFF, 0xFEFF], [0xFFF9, 0xFFFB],
	    ];
	    var COMBINING_HIGH = [
	        [0x10A01, 0x10A03], [0x10A05, 0x10A06], [0x10A0C, 0x10A0F],
	        [0x10A38, 0x10A3A], [0x10A3F, 0x10A3F], [0x1D167, 0x1D169],
	        [0x1D173, 0x1D182], [0x1D185, 0x1D18B], [0x1D1AA, 0x1D1AD],
	        [0x1D242, 0x1D244], [0xE0001, 0xE0001], [0xE0020, 0xE007F],
	        [0xE0100, 0xE01EF]
	    ];
	    function bisearch(ucs, data) {
	        var min = 0;
	        var max = data.length - 1;
	        var mid;
	        if (ucs < data[0][0] || ucs > data[max][1])
	            return false;
	        while (max >= min) {
	            mid = (min + max) >> 1;
	            if (ucs > data[mid][1])
	                min = mid + 1;
	            else if (ucs < data[mid][0])
	                max = mid - 1;
	            else
	                return true;
	        }
	        return false;
	    }
	    function wcwidthBMP(ucs) {
	        if (ucs === 0)
	            return opts.nul;
	        if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0))
	            return opts.control;
	        if (bisearch(ucs, COMBINING_BMP))
	            return 0;
	        if (isWideBMP(ucs)) {
	            return 2;
	        }
	        return 1;
	    }
	    function isWideBMP(ucs) {
	        return (ucs >= 0x1100 && (ucs <= 0x115f ||
	            ucs === 0x2329 ||
	            ucs === 0x232a ||
	            (ucs >= 0x2e80 && ucs <= 0xa4cf && ucs !== 0x303f) ||
	            (ucs >= 0xac00 && ucs <= 0xd7a3) ||
	            (ucs >= 0xf900 && ucs <= 0xfaff) ||
	            (ucs >= 0xfe10 && ucs <= 0xfe19) ||
	            (ucs >= 0xfe30 && ucs <= 0xfe6f) ||
	            (ucs >= 0xff00 && ucs <= 0xff60) ||
	            (ucs >= 0xffe0 && ucs <= 0xffe6)));
	    }
	    function wcwidthHigh(ucs) {
	        if (bisearch(ucs, COMBINING_HIGH))
	            return 0;
	        if ((ucs >= 0x20000 && ucs <= 0x2fffd) || (ucs >= 0x30000 && ucs <= 0x3fffd)) {
	            return 2;
	        }
	        return 1;
	    }
	    var control = opts.control | 0;
	    var table = null;
	    function init_table() {
	        var CODEPOINTS = 65536;
	        var BITWIDTH = 2;
	        var ITEMSIZE = 32;
	        var CONTAINERSIZE = CODEPOINTS * BITWIDTH / ITEMSIZE;
	        var CODEPOINTS_PER_ITEM = ITEMSIZE / BITWIDTH;
	        table = (typeof Uint32Array === 'undefined')
	            ? new Array(CONTAINERSIZE)
	            : new Uint32Array(CONTAINERSIZE);
	        for (var i = 0; i < CONTAINERSIZE; ++i) {
	            var num = 0;
	            var pos = CODEPOINTS_PER_ITEM;
	            while (pos--)
	                num = (num << 2) | wcwidthBMP(CODEPOINTS_PER_ITEM * i + pos);
	            table[i] = num;
	        }
	        return table;
	    }
	    return function (num) {
	        num = num | 0;
	        if (num < 32)
	            return control | 0;
	        if (num < 127)
	            return 1;
	        var t = table || init_table();
	        if (num < 65536)
	            return t[num >> 4] >> ((num & 15) << 1) & 3;
	        return wcwidthHigh(num);
	    };
	})({ nul: 0, control: 0 });


	});

	unwrapExports(InputHandler_1);
	var InputHandler_2 = InputHandler_1.InputHandler;
	var InputHandler_3 = InputHandler_1.wcwidth;

	var Parser_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	var normalStateHandler = {};
	normalStateHandler[EscapeSequences.C0.BEL] = function (parser, handler) { return handler.bell(); };
	normalStateHandler[EscapeSequences.C0.LF] = function (parser, handler) { return handler.lineFeed(); };
	normalStateHandler[EscapeSequences.C0.VT] = normalStateHandler[EscapeSequences.C0.LF];
	normalStateHandler[EscapeSequences.C0.FF] = normalStateHandler[EscapeSequences.C0.LF];
	normalStateHandler[EscapeSequences.C0.CR] = function (parser, handler) { return handler.carriageReturn(); };
	normalStateHandler[EscapeSequences.C0.BS] = function (parser, handler) { return handler.backspace(); };
	normalStateHandler[EscapeSequences.C0.HT] = function (parser, handler) { return handler.tab(); };
	normalStateHandler[EscapeSequences.C0.SO] = function (parser, handler) { return handler.shiftOut(); };
	normalStateHandler[EscapeSequences.C0.SI] = function (parser, handler) { return handler.shiftIn(); };
	normalStateHandler[EscapeSequences.C0.ESC] = function (parser, handler) { return parser.setState(ParserState.ESCAPED); };
	var escapedStateHandler = {};
	escapedStateHandler['['] = function (parser, terminal) {
	    terminal.params = [];
	    terminal.currentParam = 0;
	    parser.setState(ParserState.CSI_PARAM);
	};
	escapedStateHandler[']'] = function (parser, terminal) {
	    terminal.params = [];
	    terminal.currentParam = 0;
	    parser.setState(ParserState.OSC);
	};
	escapedStateHandler['P'] = function (parser, terminal) {
	    terminal.params = [];
	    terminal.currentParam = 0;
	    parser.setState(ParserState.DCS);
	};
	escapedStateHandler['_'] = function (parser, terminal) {
	    parser.setState(ParserState.IGNORE);
	};
	escapedStateHandler['^'] = function (parser, terminal) {
	    parser.setState(ParserState.IGNORE);
	};
	escapedStateHandler['c'] = function (parser, terminal) {
	    terminal.reset();
	};
	escapedStateHandler['E'] = function (parser, terminal) {
	    terminal.buffer.x = 0;
	    terminal.index();
	    parser.setState(ParserState.NORMAL);
	};
	escapedStateHandler['D'] = function (parser, terminal) {
	    terminal.index();
	    parser.setState(ParserState.NORMAL);
	};
	escapedStateHandler['M'] = function (parser, terminal) {
	    terminal.reverseIndex();
	    parser.setState(ParserState.NORMAL);
	};
	escapedStateHandler['%'] = function (parser, terminal) {
	    terminal.setgLevel(0);
	    terminal.setgCharset(0, Charsets.DEFAULT_CHARSET);
	    parser.setState(ParserState.NORMAL);
	    parser.skipNextChar();
	};
	escapedStateHandler[EscapeSequences.C0.CAN] = function (parser) { return parser.setState(ParserState.NORMAL); };
	var csiParamStateHandler = {};
	csiParamStateHandler['?'] = function (parser) { return parser.setPrefix('?'); };
	csiParamStateHandler['>'] = function (parser) { return parser.setPrefix('>'); };
	csiParamStateHandler['!'] = function (parser) { return parser.setPrefix('!'); };
	csiParamStateHandler['0'] = function (parser) { return parser.setParam(parser.getParam() * 10); };
	csiParamStateHandler['1'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 1); };
	csiParamStateHandler['2'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 2); };
	csiParamStateHandler['3'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 3); };
	csiParamStateHandler['4'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 4); };
	csiParamStateHandler['5'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 5); };
	csiParamStateHandler['6'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 6); };
	csiParamStateHandler['7'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 7); };
	csiParamStateHandler['8'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 8); };
	csiParamStateHandler['9'] = function (parser) { return parser.setParam(parser.getParam() * 10 + 9); };
	csiParamStateHandler['$'] = function (parser) { return parser.setPostfix('$'); };
	csiParamStateHandler['"'] = function (parser) { return parser.setPostfix('"'); };
	csiParamStateHandler[' '] = function (parser) { return parser.setPostfix(' '); };
	csiParamStateHandler['\''] = function (parser) { return parser.setPostfix('\''); };
	csiParamStateHandler[';'] = function (parser) { return parser.finalizeParam(); };
	csiParamStateHandler[EscapeSequences.C0.CAN] = function (parser) { return parser.setState(ParserState.NORMAL); };
	var csiStateHandler = {};
	csiStateHandler['@'] = function (handler, params, prefix) { return handler.insertChars(params); };
	csiStateHandler['A'] = function (handler, params, prefix) { return handler.cursorUp(params); };
	csiStateHandler['B'] = function (handler, params, prefix) { return handler.cursorDown(params); };
	csiStateHandler['C'] = function (handler, params, prefix) { return handler.cursorForward(params); };
	csiStateHandler['D'] = function (handler, params, prefix) { return handler.cursorBackward(params); };
	csiStateHandler['E'] = function (handler, params, prefix) { return handler.cursorNextLine(params); };
	csiStateHandler['F'] = function (handler, params, prefix) { return handler.cursorPrecedingLine(params); };
	csiStateHandler['G'] = function (handler, params, prefix) { return handler.cursorCharAbsolute(params); };
	csiStateHandler['H'] = function (handler, params, prefix) { return handler.cursorPosition(params); };
	csiStateHandler['I'] = function (handler, params, prefix) { return handler.cursorForwardTab(params); };
	csiStateHandler['J'] = function (handler, params, prefix) { return handler.eraseInDisplay(params); };
	csiStateHandler['K'] = function (handler, params, prefix) { return handler.eraseInLine(params); };
	csiStateHandler['L'] = function (handler, params, prefix) { return handler.insertLines(params); };
	csiStateHandler['M'] = function (handler, params, prefix) { return handler.deleteLines(params); };
	csiStateHandler['P'] = function (handler, params, prefix) { return handler.deleteChars(params); };
	csiStateHandler['S'] = function (handler, params, prefix) { return handler.scrollUp(params); };
	csiStateHandler['T'] = function (handler, params, prefix) {
	    if (params.length < 2 && !prefix) {
	        handler.scrollDown(params);
	    }
	};
	csiStateHandler['X'] = function (handler, params, prefix) { return handler.eraseChars(params); };
	csiStateHandler['Z'] = function (handler, params, prefix) { return handler.cursorBackwardTab(params); };
	csiStateHandler['`'] = function (handler, params, prefix) { return handler.charPosAbsolute(params); };
	csiStateHandler['a'] = function (handler, params, prefix) { return handler.HPositionRelative(params); };
	csiStateHandler['b'] = function (handler, params, prefix) { return handler.repeatPrecedingCharacter(params); };
	csiStateHandler['c'] = function (handler, params, prefix) { return handler.sendDeviceAttributes(params); };
	csiStateHandler['d'] = function (handler, params, prefix) { return handler.linePosAbsolute(params); };
	csiStateHandler['e'] = function (handler, params, prefix) { return handler.VPositionRelative(params); };
	csiStateHandler['f'] = function (handler, params, prefix) { return handler.HVPosition(params); };
	csiStateHandler['g'] = function (handler, params, prefix) { return handler.tabClear(params); };
	csiStateHandler['h'] = function (handler, params, prefix) { return handler.setMode(params); };
	csiStateHandler['l'] = function (handler, params, prefix) { return handler.resetMode(params); };
	csiStateHandler['m'] = function (handler, params, prefix) { return handler.charAttributes(params); };
	csiStateHandler['n'] = function (handler, params, prefix) { return handler.deviceStatus(params); };
	csiStateHandler['p'] = function (handler, params, prefix) {
	    switch (prefix) {
	        case '!':
	            handler.softReset(params);
	            break;
	    }
	};
	csiStateHandler['q'] = function (handler, params, prefix, postfix) {
	    if (postfix === ' ') {
	        handler.setCursorStyle(params);
	    }
	};
	csiStateHandler['r'] = function (handler, params) { return handler.setScrollRegion(params); };
	csiStateHandler['s'] = function (handler, params) { return handler.saveCursor(params); };
	csiStateHandler['u'] = function (handler, params) { return handler.restoreCursor(params); };
	csiStateHandler[EscapeSequences.C0.CAN] = function (handler, params, prefix, postfix, parser) { return parser.setState(ParserState.NORMAL); };
	var ParserState;
	(function (ParserState) {
	    ParserState[ParserState["NORMAL"] = 0] = "NORMAL";
	    ParserState[ParserState["ESCAPED"] = 1] = "ESCAPED";
	    ParserState[ParserState["CSI_PARAM"] = 2] = "CSI_PARAM";
	    ParserState[ParserState["CSI"] = 3] = "CSI";
	    ParserState[ParserState["OSC"] = 4] = "OSC";
	    ParserState[ParserState["CHARSET"] = 5] = "CHARSET";
	    ParserState[ParserState["DCS"] = 6] = "DCS";
	    ParserState[ParserState["IGNORE"] = 7] = "IGNORE";
	})(ParserState || (ParserState = {}));
	var Parser = (function () {
	    function Parser(_inputHandler, _terminal) {
	        this._inputHandler = _inputHandler;
	        this._terminal = _terminal;
	        this._state = ParserState.NORMAL;
	    }
	    Parser.prototype.parse = function (data) {
	        var l = data.length, cs, ch, code, low;
	        if (this._terminal.debug) {
	            this._terminal.log('data: ' + data);
	        }
	        this._position = 0;
	        if (this._terminal.surrogate_high) {
	            data = this._terminal.surrogate_high + data;
	            this._terminal.surrogate_high = '';
	        }
	        for (; this._position < l; this._position++) {
	            ch = data[this._position];
	            code = data.charCodeAt(this._position);
	            if (0xD800 <= code && code <= 0xDBFF) {
	                low = data.charCodeAt(this._position + 1);
	                if (isNaN(low)) {
	                    this._terminal.surrogate_high = ch;
	                    continue;
	                }
	                code = ((code - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	                ch += data.charAt(this._position + 1);
	            }
	            if (0xDC00 <= code && code <= 0xDFFF)
	                continue;
	            switch (this._state) {
	                case ParserState.NORMAL:
	                    if (ch in normalStateHandler) {
	                        normalStateHandler[ch](this, this._inputHandler);
	                    }
	                    else {
	                        this._inputHandler.addChar(ch, code);
	                    }
	                    break;
	                case ParserState.ESCAPED:
	                    if (ch in escapedStateHandler) {
	                        escapedStateHandler[ch](this, this._terminal);
	                        break;
	                    }
	                    switch (ch) {
	                        case '(':
	                        case ')':
	                        case '*':
	                        case '+':
	                        case '-':
	                        case '.':
	                            switch (ch) {
	                                case '(':
	                                    this._terminal.gcharset = 0;
	                                    break;
	                                case ')':
	                                    this._terminal.gcharset = 1;
	                                    break;
	                                case '*':
	                                    this._terminal.gcharset = 2;
	                                    break;
	                                case '+':
	                                    this._terminal.gcharset = 3;
	                                    break;
	                                case '-':
	                                    this._terminal.gcharset = 1;
	                                    break;
	                                case '.':
	                                    this._terminal.gcharset = 2;
	                                    break;
	                            }
	                            this._state = ParserState.CHARSET;
	                            break;
	                        case '/':
	                            this._terminal.gcharset = 3;
	                            this._state = ParserState.CHARSET;
	                            this._position--;
	                            break;
	                        case 'N':
	                            break;
	                        case 'O':
	                            break;
	                        case 'n':
	                            this._terminal.setgLevel(2);
	                            break;
	                        case 'o':
	                            this._terminal.setgLevel(3);
	                            break;
	                        case '|':
	                            this._terminal.setgLevel(3);
	                            break;
	                        case '}':
	                            this._terminal.setgLevel(2);
	                            break;
	                        case '~':
	                            this._terminal.setgLevel(1);
	                            break;
	                        case '7':
	                            this._inputHandler.saveCursor();
	                            this._state = ParserState.NORMAL;
	                            break;
	                        case '8':
	                            this._inputHandler.restoreCursor();
	                            this._state = ParserState.NORMAL;
	                            break;
	                        case '#':
	                            this._state = ParserState.NORMAL;
	                            this._position++;
	                            break;
	                        case 'H':
	                            this._terminal.tabSet();
	                            this._state = ParserState.NORMAL;
	                            break;
	                        case '=':
	                            this._terminal.log('Serial port requested application keypad.');
	                            this._terminal.applicationKeypad = true;
	                            this._terminal.viewport.syncScrollArea();
	                            this._state = ParserState.NORMAL;
	                            break;
	                        case '>':
	                            this._terminal.log('Switching back to normal keypad.');
	                            this._terminal.applicationKeypad = false;
	                            this._terminal.viewport.syncScrollArea();
	                            this._state = ParserState.NORMAL;
	                            break;
	                        default:
	                            this._state = ParserState.NORMAL;
	                            this._terminal.error('Unknown ESC control: %s.', ch);
	                            break;
	                    }
	                    break;
	                case ParserState.CHARSET:
	                    if (ch in Charsets.CHARSETS) {
	                        cs = Charsets.CHARSETS[ch];
	                        if (ch === '/') {
	                            this.skipNextChar();
	                        }
	                    }
	                    else {
	                        cs = Charsets.DEFAULT_CHARSET;
	                    }
	                    this._terminal.setgCharset(this._terminal.gcharset, cs);
	                    this._terminal.gcharset = null;
	                    this._state = ParserState.NORMAL;
	                    break;
	                case ParserState.OSC:
	                    if (ch === EscapeSequences.C0.ESC || ch === EscapeSequences.C0.BEL) {
	                        if (ch === EscapeSequences.C0.ESC)
	                            this._position++;
	                        this._terminal.params.push(this._terminal.currentParam);
	                        switch (this._terminal.params[0]) {
	                            case 0:
	                            case 1:
	                            case 2:
	                                if (this._terminal.params[1]) {
	                                    this._terminal.title = this._terminal.params[1];
	                                    this._terminal.handleTitle(this._terminal.title);
	                                }
	                                break;
	                        }
	                        this._terminal.params = [];
	                        this._terminal.currentParam = 0;
	                        this._state = ParserState.NORMAL;
	                    }
	                    else {
	                        if (!this._terminal.params.length) {
	                            if (ch >= '0' && ch <= '9') {
	                                this._terminal.currentParam =
	                                    this._terminal.currentParam * 10 + ch.charCodeAt(0) - 48;
	                            }
	                            else if (ch === ';') {
	                                this._terminal.params.push(this._terminal.currentParam);
	                                this._terminal.currentParam = '';
	                            }
	                        }
	                        else {
	                            this._terminal.currentParam += ch;
	                        }
	                    }
	                    break;
	                case ParserState.CSI_PARAM:
	                    if (ch in csiParamStateHandler) {
	                        csiParamStateHandler[ch](this);
	                        break;
	                    }
	                    this.finalizeParam();
	                    this._state = ParserState.CSI;
	                case ParserState.CSI:
	                    if (ch in csiStateHandler) {
	                        if (this._terminal.debug) {
	                            this._terminal.log("CSI " + (this._terminal.prefix ? this._terminal.prefix : '') + " " + (this._terminal.params ? this._terminal.params.join(';') : '') + " " + (this._terminal.postfix ? this._terminal.postfix : '') + " " + ch);
	                        }
	                        csiStateHandler[ch](this._inputHandler, this._terminal.params, this._terminal.prefix, this._terminal.postfix, this);
	                    }
	                    else {
	                        this._terminal.error('Unknown CSI code: %s.', ch);
	                    }
	                    this._state = ParserState.NORMAL;
	                    this._terminal.prefix = '';
	                    this._terminal.postfix = '';
	                    break;
	                case ParserState.DCS:
	                    if (ch === EscapeSequences.C0.ESC || ch === EscapeSequences.C0.BEL) {
	                        if (ch === EscapeSequences.C0.ESC)
	                            this._position++;
	                        var pt = void 0;
	                        var valid = void 0;
	                        switch (this._terminal.prefix) {
	                            case '':
	                                break;
	                            case '$q':
	                                pt = this._terminal.currentParam;
	                                valid = false;
	                                switch (pt) {
	                                    case '"q':
	                                        pt = '0"q';
	                                        break;
	                                    case '"p':
	                                        pt = '61"p';
	                                        break;
	                                    case 'r':
	                                        pt = ''
	                                            + (this._terminal.buffer.scrollTop + 1)
	                                            + ';'
	                                            + (this._terminal.buffer.scrollBottom + 1)
	                                            + 'r';
	                                        break;
	                                    case 'm':
	                                        pt = '0m';
	                                        break;
	                                    default:
	                                        this._terminal.error('Unknown DCS Pt: %s.', pt);
	                                        pt = '';
	                                        break;
	                                }
	                                this._terminal.send(EscapeSequences.C0.ESC + 'P' + +valid + '$r' + pt + EscapeSequences.C0.ESC + '\\');
	                                break;
	                            case '+p':
	                                break;
	                            case '+q':
	                                pt = this._terminal.currentParam;
	                                valid = false;
	                                this._terminal.send(EscapeSequences.C0.ESC + 'P' + +valid + '+r' + pt + EscapeSequences.C0.ESC + '\\');
	                                break;
	                            default:
	                                this._terminal.error('Unknown DCS prefix: %s.', this._terminal.prefix);
	                                break;
	                        }
	                        this._terminal.currentParam = 0;
	                        this._terminal.prefix = '';
	                        this._state = ParserState.NORMAL;
	                    }
	                    else if (!this._terminal.currentParam) {
	                        if (!this._terminal.prefix && ch !== '$' && ch !== '+') {
	                            this._terminal.currentParam = ch;
	                        }
	                        else if (this._terminal.prefix.length === 2) {
	                            this._terminal.currentParam = ch;
	                        }
	                        else {
	                            this._terminal.prefix += ch;
	                        }
	                    }
	                    else {
	                        this._terminal.currentParam += ch;
	                    }
	                    break;
	                case ParserState.IGNORE:
	                    if (ch === EscapeSequences.C0.ESC || ch === EscapeSequences.C0.BEL) {
	                        if (ch === EscapeSequences.C0.ESC)
	                            this._position++;
	                        this._state = ParserState.NORMAL;
	                    }
	                    break;
	            }
	        }
	        return this._state;
	    };
	    Parser.prototype.setState = function (state) {
	        this._state = state;
	    };
	    Parser.prototype.setPrefix = function (prefix) {
	        this._terminal.prefix = prefix;
	    };
	    Parser.prototype.setPostfix = function (postfix) {
	        this._terminal.postfix = postfix;
	    };
	    Parser.prototype.setParam = function (param) {
	        this._terminal.currentParam = param;
	    };
	    Parser.prototype.getParam = function () {
	        return this._terminal.currentParam;
	    };
	    Parser.prototype.finalizeParam = function () {
	        this._terminal.params.push(this._terminal.currentParam);
	        this._terminal.currentParam = 0;
	    };
	    Parser.prototype.skipNextChar = function () {
	        this._position++;
	    };
	    return Parser;
	}());
	exports.Parser = Parser;


	});

	unwrapExports(Parser_1);
	var Parser_2 = Parser_1.Parser;

	var DomElementObjectPool_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var DomElementObjectPool = (function () {
	    function DomElementObjectPool(type) {
	        this.type = type;
	        this._type = type;
	        this._pool = [];
	        this._inUse = {};
	    }
	    DomElementObjectPool.prototype.acquire = function () {
	        var element;
	        if (this._pool.length === 0) {
	            element = this._createNew();
	        }
	        else {
	            element = this._pool.pop();
	        }
	        this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)] = element;
	        return element;
	    };
	    DomElementObjectPool.prototype.release = function (element) {
	        if (!this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)]) {
	            throw new Error('Could not release an element not yet acquired');
	        }
	        delete this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)];
	        this._cleanElement(element);
	        this._pool.push(element);
	    };
	    DomElementObjectPool.prototype._createNew = function () {
	        var element = document.createElement(this._type);
	        var id = DomElementObjectPool._objectCount++;
	        element.setAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE, id.toString(10));
	        return element;
	    };
	    DomElementObjectPool.prototype._cleanElement = function (element) {
	        element.className = '';
	        element.innerHTML = '';
	    };
	    return DomElementObjectPool;
	}());
	DomElementObjectPool.OBJECT_ID_ATTRIBUTE = 'data-obj-id';
	DomElementObjectPool._objectCount = 0;
	exports.DomElementObjectPool = DomElementObjectPool;


	});

	unwrapExports(DomElementObjectPool_1);
	var DomElementObjectPool_2 = DomElementObjectPool_1.DomElementObjectPool;

	var Renderer_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var MAX_REFRESH_FRAME_SKIP = 5;
	var FLAGS;
	(function (FLAGS) {
	    FLAGS[FLAGS["BOLD"] = 1] = "BOLD";
	    FLAGS[FLAGS["UNDERLINE"] = 2] = "UNDERLINE";
	    FLAGS[FLAGS["BLINK"] = 4] = "BLINK";
	    FLAGS[FLAGS["INVERSE"] = 8] = "INVERSE";
	    FLAGS[FLAGS["INVISIBLE"] = 16] = "INVISIBLE";
	})(FLAGS || (FLAGS = {}));
	var brokenBold = null;
	var Renderer = (function () {
	    function Renderer(_terminal) {
	        this._terminal = _terminal;
	        this._refreshRowsQueue = [];
	        this._refreshFramesSkipped = 0;
	        this._refreshAnimationFrame = null;
	        this._spanElementObjectPool = new DomElementObjectPool_1.DomElementObjectPool('span');
	        if (brokenBold === null) {
	            brokenBold = checkBoldBroken(this._terminal.element);
	        }
	        this._spanElementObjectPool = new DomElementObjectPool_1.DomElementObjectPool('span');
	    }
	    Renderer.prototype.queueRefresh = function (start, end) {
	        this._refreshRowsQueue.push({ start: start, end: end });
	        if (!this._refreshAnimationFrame) {
	            this._refreshAnimationFrame = window.requestAnimationFrame(this._refreshLoop.bind(this));
	        }
	    };
	    Renderer.prototype._refreshLoop = function () {
	        var skipFrame = this._terminal.writeBuffer.length > 0 && this._refreshFramesSkipped++ <= MAX_REFRESH_FRAME_SKIP;
	        if (skipFrame) {
	            this._refreshAnimationFrame = window.requestAnimationFrame(this._refreshLoop.bind(this));
	            return;
	        }
	        this._refreshFramesSkipped = 0;
	        var start;
	        var end;
	        if (this._refreshRowsQueue.length > 4) {
	            start = 0;
	            end = this._terminal.rows - 1;
	        }
	        else {
	            start = this._refreshRowsQueue[0].start;
	            end = this._refreshRowsQueue[0].end;
	            for (var i = 1; i < this._refreshRowsQueue.length; i++) {
	                if (this._refreshRowsQueue[i].start < start) {
	                    start = this._refreshRowsQueue[i].start;
	                }
	                if (this._refreshRowsQueue[i].end > end) {
	                    end = this._refreshRowsQueue[i].end;
	                }
	            }
	        }
	        this._refreshRowsQueue = [];
	        this._refreshAnimationFrame = null;
	        this._refresh(start, end);
	    };
	    Renderer.prototype._refresh = function (start, end) {
	        var parent;
	        if (end - start >= this._terminal.rows / 2) {
	            parent = this._terminal.element.parentNode;
	            if (parent) {
	                this._terminal.element.removeChild(this._terminal.rowContainer);
	            }
	        }
	        var width = this._terminal.cols;
	        var y = start;
	        if (end >= this._terminal.rows) {
	            this._terminal.log('`end` is too large. Most likely a bad CSR.');
	            end = this._terminal.rows - 1;
	        }
	        for (; y <= end; y++) {
	            var row = y + this._terminal.buffer.ydisp;
	            var line = this._terminal.buffer.lines.get(row);
	            var x = void 0;
	            if (this._terminal.buffer.y === y - (this._terminal.buffer.ybase - this._terminal.buffer.ydisp) &&
	                this._terminal.cursorState &&
	                !this._terminal.cursorHidden) {
	                x = this._terminal.buffer.x;
	            }
	            else {
	                x = -1;
	            }
	            var attr = this._terminal.defAttr;
	            var documentFragment = document.createDocumentFragment();
	            var innerHTML = '';
	            var currentElement = void 0;
	            while (this._terminal.children[y].children.length) {
	                var child = this._terminal.children[y].children[0];
	                this._terminal.children[y].removeChild(child);
	                this._spanElementObjectPool.release(child);
	            }
	            for (var i = 0; i < width; i++) {
	                var data = line[i][0];
	                var ch = line[i][1];
	                var ch_width = line[i][2];
	                var isCursor = i === x;
	                if (!ch_width) {
	                    continue;
	                }
	                if (data !== attr || isCursor) {
	                    if (attr !== this._terminal.defAttr && !isCursor) {
	                        if (innerHTML) {
	                            currentElement.innerHTML = innerHTML;
	                            innerHTML = '';
	                        }
	                        documentFragment.appendChild(currentElement);
	                        currentElement = null;
	                    }
	                    if (data !== this._terminal.defAttr || isCursor) {
	                        if (innerHTML && !currentElement) {
	                            currentElement = this._spanElementObjectPool.acquire();
	                        }
	                        if (currentElement) {
	                            if (innerHTML) {
	                                currentElement.innerHTML = innerHTML;
	                                innerHTML = '';
	                            }
	                            documentFragment.appendChild(currentElement);
	                        }
	                        currentElement = this._spanElementObjectPool.acquire();
	                        var bg = data & 0x1ff;
	                        var fg = (data >> 9) & 0x1ff;
	                        var flags = data >> 18;
	                        if (isCursor) {
	                            currentElement.classList.add('reverse-video');
	                            currentElement.classList.add('terminal-cursor');
	                        }
	                        if (flags & FLAGS.BOLD) {
	                            if (!brokenBold) {
	                                currentElement.classList.add('xterm-bold');
	                            }
	                            if (fg < 8) {
	                                fg += 8;
	                            }
	                        }
	                        if (flags & FLAGS.UNDERLINE) {
	                            currentElement.classList.add('xterm-underline');
	                        }
	                        if (flags & FLAGS.BLINK) {
	                            currentElement.classList.add('xterm-blink');
	                        }
	                        if (flags & FLAGS.INVERSE) {
	                            var temp = bg;
	                            bg = fg;
	                            fg = temp;
	                            if ((flags & 1) && fg < 8) {
	                                fg += 8;
	                            }
	                        }
	                        if (flags & FLAGS.INVISIBLE && !isCursor) {
	                            currentElement.classList.add('xterm-hidden');
	                        }
	                        if (flags & FLAGS.INVERSE) {
	                            if (bg === 257) {
	                                bg = 15;
	                            }
	                            if (fg === 256) {
	                                fg = 0;
	                            }
	                        }
	                        if (bg < 256) {
	                            currentElement.classList.add("xterm-bg-color-" + bg);
	                        }
	                        if (fg < 256) {
	                            currentElement.classList.add("xterm-color-" + fg);
	                        }
	                    }
	                }
	                if (ch_width === 2) {
	                    innerHTML += "<span class=\"xterm-wide-char\">" + ch + "</span>";
	                }
	                else if (ch.charCodeAt(0) > 255) {
	                    innerHTML += "<span class=\"xterm-normal-char\">" + ch + "</span>";
	                }
	                else {
	                    switch (ch) {
	                        case '&':
	                            innerHTML += '&amp;';
	                            break;
	                        case '<':
	                            innerHTML += '&lt;';
	                            break;
	                        case '>':
	                            innerHTML += '&gt;';
	                            break;
	                        default:
	                            if (ch <= ' ') {
	                                innerHTML += '&nbsp;';
	                            }
	                            else {
	                                innerHTML += ch;
	                            }
	                            break;
	                    }
	                }
	                attr = isCursor ? -1 : data;
	            }
	            if (innerHTML && !currentElement) {
	                currentElement = this._spanElementObjectPool.acquire();
	            }
	            if (currentElement) {
	                if (innerHTML) {
	                    currentElement.innerHTML = innerHTML;
	                    innerHTML = '';
	                }
	                documentFragment.appendChild(currentElement);
	                currentElement = null;
	            }
	            this._terminal.children[y].appendChild(documentFragment);
	        }
	        if (parent) {
	            this._terminal.element.appendChild(this._terminal.rowContainer);
	        }
	        this._terminal.emit('refresh', { element: this._terminal.element, start: start, end: end });
	    };
	    Renderer.prototype.refreshSelection = function (start, end) {
	        while (this._terminal.selectionContainer.children.length) {
	            this._terminal.selectionContainer.removeChild(this._terminal.selectionContainer.children[0]);
	        }
	        if (!start || !end) {
	            return;
	        }
	        var viewportStartRow = start[1] - this._terminal.buffer.ydisp;
	        var viewportEndRow = end[1] - this._terminal.buffer.ydisp;
	        var viewportCappedStartRow = Math.max(viewportStartRow, 0);
	        var viewportCappedEndRow = Math.min(viewportEndRow, this._terminal.rows - 1);
	        if (viewportCappedStartRow >= this._terminal.rows || viewportCappedEndRow < 0) {
	            return;
	        }
	        var documentFragment = document.createDocumentFragment();
	        var startCol = viewportStartRow === viewportCappedStartRow ? start[0] : 0;
	        var endCol = viewportCappedStartRow === viewportCappedEndRow ? end[0] : this._terminal.cols;
	        documentFragment.appendChild(this._createSelectionElement(viewportCappedStartRow, startCol, endCol));
	        var middleRowsCount = viewportCappedEndRow - viewportCappedStartRow - 1;
	        documentFragment.appendChild(this._createSelectionElement(viewportCappedStartRow + 1, 0, this._terminal.cols, middleRowsCount));
	        if (viewportCappedStartRow !== viewportCappedEndRow) {
	            var endCol_1 = viewportEndRow === viewportCappedEndRow ? end[0] : this._terminal.cols;
	            documentFragment.appendChild(this._createSelectionElement(viewportCappedEndRow, 0, endCol_1));
	        }
	        this._terminal.selectionContainer.appendChild(documentFragment);
	    };
	    Renderer.prototype._createSelectionElement = function (row, colStart, colEnd, rowCount) {
	        if (rowCount === void 0) { rowCount = 1; }
	        var element = document.createElement('div');
	        element.style.height = rowCount * this._terminal.charMeasure.height + "px";
	        element.style.top = row * this._terminal.charMeasure.height + "px";
	        element.style.left = colStart * this._terminal.charMeasure.width + "px";
	        element.style.width = this._terminal.charMeasure.width * (colEnd - colStart) + "px";
	        return element;
	    };
	    return Renderer;
	}());
	exports.Renderer = Renderer;
	function checkBoldBroken(terminal) {
	    var document = terminal.ownerDocument;
	    var el = document.createElement('span');
	    el.innerHTML = 'hello world';
	    terminal.appendChild(el);
	    var w1 = el.offsetWidth;
	    var h1 = el.offsetHeight;
	    el.style.fontWeight = 'bold';
	    var w2 = el.offsetWidth;
	    var h2 = el.offsetHeight;
	    terminal.removeChild(el);
	    return w1 !== w2 || h1 !== h2;
	}


	});

	unwrapExports(Renderer_1);
	var Renderer_2 = Renderer_1.Renderer;

	var Linkifier_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var INVALID_LINK_CLASS = 'xterm-invalid-link';
	var protocolClause = '(https?:\\/\\/)';
	var domainCharacterSet = '[\\da-z\\.-]+';
	var negatedDomainCharacterSet = '[^\\da-z\\.-]+';
	var domainBodyClause = '(' + domainCharacterSet + ')';
	var tldClause = '([a-z\\.]{2,6})';
	var ipClause = '((\\d{1,3}\\.){3}\\d{1,3})';
	var localHostClause = '(localhost)';
	var portClause = '(:\\d{1,5})';
	var hostClause = '((' + domainBodyClause + '\\.' + tldClause + ')|' + ipClause + '|' + localHostClause + ')' + portClause + '?';
	var pathClause = '(\\/[\\/\\w\\.\\-%~]*)*';
	var queryStringHashFragmentCharacterSet = '[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&\'*+,:;~\\=\\.\\-]*';
	var queryStringClause = '(\\?' + queryStringHashFragmentCharacterSet + ')?';
	var hashFragmentClause = '(#' + queryStringHashFragmentCharacterSet + ')?';
	var negatedPathCharacterSet = '[^\\/\\w\\.\\-%]+';
	var bodyClause = hostClause + pathClause + queryStringClause + hashFragmentClause;
	var start = '(?:^|' + negatedDomainCharacterSet + ')(';
	var end = ')($|' + negatedPathCharacterSet + ')';
	var strictUrlRegex = new RegExp(start + protocolClause + bodyClause + end);
	var HYPERTEXT_LINK_MATCHER_ID = 0;
	var Linkifier = (function () {
	    function Linkifier() {
	        this._nextLinkMatcherId = HYPERTEXT_LINK_MATCHER_ID;
	        this._rowTimeoutIds = [];
	        this._linkMatchers = [];
	        this.registerLinkMatcher(strictUrlRegex, null, { matchIndex: 1 });
	    }
	    Linkifier.prototype.attachToDom = function (document, rows) {
	        this._document = document;
	        this._rows = rows;
	    };
	    Linkifier.prototype.linkifyRow = function (rowIndex) {
	        if (!this._document) {
	            return;
	        }
	        var timeoutId = this._rowTimeoutIds[rowIndex];
	        if (timeoutId) {
	            clearTimeout(timeoutId);
	        }
	        this._rowTimeoutIds[rowIndex] = setTimeout(this._linkifyRow.bind(this, rowIndex), Linkifier.TIME_BEFORE_LINKIFY);
	    };
	    Linkifier.prototype.setHypertextLinkHandler = function (handler) {
	        this._linkMatchers[HYPERTEXT_LINK_MATCHER_ID].handler = handler;
	    };
	    Linkifier.prototype.setHypertextValidationCallback = function (callback) {
	        this._linkMatchers[HYPERTEXT_LINK_MATCHER_ID].validationCallback = callback;
	    };
	    Linkifier.prototype.registerLinkMatcher = function (regex, handler, options) {
	        if (options === void 0) { options = {}; }
	        if (this._nextLinkMatcherId !== HYPERTEXT_LINK_MATCHER_ID && !handler) {
	            throw new Error('handler must be defined');
	        }
	        var matcher = {
	            id: this._nextLinkMatcherId++,
	            regex: regex,
	            handler: handler,
	            matchIndex: options.matchIndex,
	            validationCallback: options.validationCallback,
	            priority: options.priority || 0
	        };
	        this._addLinkMatcherToList(matcher);
	        return matcher.id;
	    };
	    Linkifier.prototype._addLinkMatcherToList = function (matcher) {
	        if (this._linkMatchers.length === 0) {
	            this._linkMatchers.push(matcher);
	            return;
	        }
	        for (var i = this._linkMatchers.length - 1; i >= 0; i--) {
	            if (matcher.priority <= this._linkMatchers[i].priority) {
	                this._linkMatchers.splice(i + 1, 0, matcher);
	                return;
	            }
	        }
	        this._linkMatchers.splice(0, 0, matcher);
	    };
	    Linkifier.prototype.deregisterLinkMatcher = function (matcherId) {
	        for (var i = 1; i < this._linkMatchers.length; i++) {
	            if (this._linkMatchers[i].id === matcherId) {
	                this._linkMatchers.splice(i, 1);
	                return true;
	            }
	        }
	        return false;
	    };
	    Linkifier.prototype._linkifyRow = function (rowIndex) {
	        var row = this._rows[rowIndex];
	        if (!row) {
	            return;
	        }
	        var text = row.textContent;
	        for (var i = 0; i < this._linkMatchers.length; i++) {
	            var matcher = this._linkMatchers[i];
	            var linkElements = this._doLinkifyRow(row, matcher);
	            if (linkElements.length > 0) {
	                if (matcher.validationCallback) {
	                    var _loop_1 = function (j) {
	                        var element = linkElements[j];
	                        matcher.validationCallback(element.textContent, element, function (isValid) {
	                            if (!isValid) {
	                                element.classList.add(INVALID_LINK_CLASS);
	                            }
	                        });
	                    };
	                    for (var j = 0; j < linkElements.length; j++) {
	                        _loop_1(j);
	                    }
	                }
	                return;
	            }
	        }
	    };
	    Linkifier.prototype._doLinkifyRow = function (row, matcher) {
	        var result = [];
	        var isHttpLinkMatcher = matcher.id === HYPERTEXT_LINK_MATCHER_ID;
	        var nodes = row.childNodes;
	        var match = row.textContent.match(matcher.regex);
	        if (!match || match.length === 0) {
	            return result;
	        }
	        var uri = match[typeof matcher.matchIndex !== 'number' ? 0 : matcher.matchIndex];
	        var rowStartIndex = match.index + uri.length;
	        for (var i = 0; i < nodes.length; i++) {
	            var node = nodes[i];
	            var searchIndex = node.textContent.indexOf(uri);
	            if (searchIndex >= 0) {
	                var linkElement = this._createAnchorElement(uri, matcher.handler, isHttpLinkMatcher);
	                if (node.textContent.length === uri.length) {
	                    if (node.nodeType === 3) {
	                        this._replaceNode(node, linkElement);
	                    }
	                    else {
	                        var element = node;
	                        if (element.nodeName === 'A') {
	                            return result;
	                        }
	                        element.innerHTML = '';
	                        element.appendChild(linkElement);
	                    }
	                }
	                else if (node.childNodes.length > 1) {
	                    for (var j = 0; j < node.childNodes.length; j++) {
	                        var childNode = node.childNodes[j];
	                        var childSearchIndex = childNode.textContent.indexOf(uri);
	                        if (childSearchIndex !== -1) {
	                            this._replaceNodeSubstringWithNode(childNode, linkElement, uri, childSearchIndex);
	                            break;
	                        }
	                    }
	                }
	                else {
	                    var nodesAdded = this._replaceNodeSubstringWithNode(node, linkElement, uri, searchIndex);
	                    i += nodesAdded;
	                }
	                result.push(linkElement);
	                match = row.textContent.substring(rowStartIndex).match(matcher.regex);
	                if (!match || match.length === 0) {
	                    return result;
	                }
	                uri = match[typeof matcher.matchIndex !== 'number' ? 0 : matcher.matchIndex];
	                rowStartIndex += match.index + uri.length;
	            }
	        }
	        return result;
	    };
	    Linkifier.prototype._createAnchorElement = function (uri, handler, isHypertextLinkHandler) {
	        var element = this._document.createElement('a');
	        element.textContent = uri;
	        element.draggable = false;
	        if (isHypertextLinkHandler) {
	            element.href = uri;
	            element.target = '_blank';
	            element.addEventListener('click', function (event) {
	                if (handler) {
	                    return handler(event, uri);
	                }
	            });
	        }
	        else {
	            element.addEventListener('click', function (event) {
	                if (element.classList.contains(INVALID_LINK_CLASS)) {
	                    return;
	                }
	                return handler(event, uri);
	            });
	        }
	        return element;
	    };
	    Linkifier.prototype._replaceNode = function (oldNode) {
	        var newNodes = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            newNodes[_i - 1] = arguments[_i];
	        }
	        var parent = oldNode.parentNode;
	        for (var i = 0; i < newNodes.length; i++) {
	            parent.insertBefore(newNodes[i], oldNode);
	        }
	        parent.removeChild(oldNode);
	    };
	    Linkifier.prototype._replaceNodeSubstringWithNode = function (targetNode, newNode, substring, substringIndex) {
	        if (targetNode.childNodes.length === 1) {
	            targetNode = targetNode.childNodes[0];
	        }
	        if (targetNode.nodeType !== 3) {
	            throw new Error('targetNode must be a text node or only contain a single text node');
	        }
	        var fullText = targetNode.textContent;
	        if (substringIndex === 0) {
	            var rightText_1 = fullText.substring(substring.length);
	            var rightTextNode_1 = this._document.createTextNode(rightText_1);
	            this._replaceNode(targetNode, newNode, rightTextNode_1);
	            return 0;
	        }
	        if (substringIndex === targetNode.textContent.length - substring.length) {
	            var leftText_1 = fullText.substring(0, substringIndex);
	            var leftTextNode_1 = this._document.createTextNode(leftText_1);
	            this._replaceNode(targetNode, leftTextNode_1, newNode);
	            return 0;
	        }
	        var leftText = fullText.substring(0, substringIndex);
	        var leftTextNode = this._document.createTextNode(leftText);
	        var rightText = fullText.substring(substringIndex + substring.length);
	        var rightTextNode = this._document.createTextNode(rightText);
	        this._replaceNode(targetNode, leftTextNode, newNode, rightTextNode);
	        return 1;
	    };
	    return Linkifier;
	}());
	Linkifier.TIME_BEFORE_LINKIFY = 200;
	exports.Linkifier = Linkifier;


	});

	unwrapExports(Linkifier_1);
	var Linkifier_2 = Linkifier_1.Linkifier;

	var Mouse = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	function getCoordsRelativeToElement(event, element) {
	    if (event.pageX == null) {
	        return null;
	    }
	    var x = event.pageX;
	    var y = event.pageY;
	    while (element && element !== self.document.documentElement) {
	        x -= element.offsetLeft;
	        y -= element.offsetTop;
	        element = 'offsetParent' in element ? element.offsetParent : element.parentElement;
	    }
	    return [x, y];
	}
	exports.getCoordsRelativeToElement = getCoordsRelativeToElement;
	function getCoords(event, rowContainer, charMeasure, colCount, rowCount, isSelection) {
	    if (!charMeasure.width || !charMeasure.height) {
	        return null;
	    }
	    var coords = getCoordsRelativeToElement(event, rowContainer);
	    if (!coords) {
	        return null;
	    }
	    coords[0] = Math.ceil((coords[0] + (isSelection ? charMeasure.width / 2 : 0)) / charMeasure.width);
	    coords[1] = Math.ceil(coords[1] / charMeasure.height);
	    coords[0] = Math.min(Math.max(coords[0], 1), colCount + 1);
	    coords[1] = Math.min(Math.max(coords[1], 1), rowCount + 1);
	    return coords;
	}
	exports.getCoords = getCoords;
	function getRawByteCoords(event, rowContainer, charMeasure, colCount, rowCount) {
	    var coords = getCoords(event, rowContainer, charMeasure, colCount, rowCount);
	    var x = coords[0];
	    var y = coords[1];
	    x += 32;
	    y += 32;
	    return { x: x, y: y };
	}
	exports.getRawByteCoords = getRawByteCoords;


	});

	unwrapExports(Mouse);
	var Mouse_1 = Mouse.getCoordsRelativeToElement;
	var Mouse_2 = Mouse.getCoords;
	var Mouse_3 = Mouse.getRawByteCoords;

	var Generic = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	function contains(arr, el) {
	    return arr.indexOf(el) >= 0;
	}
	exports.contains = contains;


	});

	unwrapExports(Generic);
	var Generic_1 = Generic.contains;

	var Browser = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var isNode = (typeof navigator === 'undefined') ? true : false;
	var userAgent = (isNode) ? 'node' : navigator.userAgent;
	var platform = (isNode) ? 'node' : navigator.platform;
	exports.isFirefox = !!~userAgent.indexOf('Firefox');
	exports.isMSIE = !!~userAgent.indexOf('MSIE') || !!~userAgent.indexOf('Trident');
	exports.isMac = Generic.contains(['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'], platform);
	exports.isIpad = platform === 'iPad';
	exports.isIphone = platform === 'iPhone';
	exports.isMSWindows = Generic.contains(['Windows', 'Win16', 'Win32', 'WinCE'], platform);
	exports.isLinux = platform.indexOf('Linux') >= 0;


	});

	unwrapExports(Browser);
	var Browser_1 = Browser.isFirefox;
	var Browser_2 = Browser.isMSIE;
	var Browser_3 = Browser.isMac;
	var Browser_4 = Browser.isIpad;
	var Browser_5 = Browser.isIphone;
	var Browser_6 = Browser.isMSWindows;
	var Browser_7 = Browser.isLinux;

	var SelectionModel_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var SelectionModel = (function () {
	    function SelectionModel(_terminal) {
	        this._terminal = _terminal;
	        this.clearSelection();
	    }
	    SelectionModel.prototype.clearSelection = function () {
	        this.selectionStart = null;
	        this.selectionEnd = null;
	        this.isSelectAllActive = false;
	        this.selectionStartLength = 0;
	    };
	    Object.defineProperty(SelectionModel.prototype, "finalSelectionStart", {
	        get: function () {
	            if (this.isSelectAllActive) {
	                return [0, 0];
	            }
	            if (!this.selectionEnd || !this.selectionStart) {
	                return this.selectionStart;
	            }
	            return this.areSelectionValuesReversed() ? this.selectionEnd : this.selectionStart;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SelectionModel.prototype, "finalSelectionEnd", {
	        get: function () {
	            if (this.isSelectAllActive) {
	                return [this._terminal.cols, this._terminal.buffer.ybase + this._terminal.rows - 1];
	            }
	            if (!this.selectionStart) {
	                return null;
	            }
	            if (!this.selectionEnd || this.areSelectionValuesReversed()) {
	                return [this.selectionStart[0] + this.selectionStartLength, this.selectionStart[1]];
	            }
	            if (this.selectionStartLength) {
	                if (this.selectionEnd[1] === this.selectionStart[1]) {
	                    return [Math.max(this.selectionStart[0] + this.selectionStartLength, this.selectionEnd[0]), this.selectionEnd[1]];
	                }
	            }
	            return this.selectionEnd;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SelectionModel.prototype.areSelectionValuesReversed = function () {
	        var start = this.selectionStart;
	        var end = this.selectionEnd;
	        return start[1] > end[1] || (start[1] === end[1] && start[0] > end[0]);
	    };
	    SelectionModel.prototype.onTrim = function (amount) {
	        if (this.selectionStart) {
	            this.selectionStart[1] -= amount;
	        }
	        if (this.selectionEnd) {
	            this.selectionEnd[1] -= amount;
	        }
	        if (this.selectionEnd && this.selectionEnd[1] < 0) {
	            this.clearSelection();
	            return true;
	        }
	        if (this.selectionStart && this.selectionStart[1] < 0) {
	            this.selectionStart[1] = 0;
	        }
	        return false;
	    };
	    return SelectionModel;
	}());
	exports.SelectionModel = SelectionModel;


	});

	unwrapExports(SelectionModel_1);
	var SelectionModel_2 = SelectionModel_1.SelectionModel;

	var BufferLine = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var LINE_DATA_CHAR_INDEX = 1;
	var LINE_DATA_WIDTH_INDEX = 2;
	function translateBufferLineToString(line, trimRight, startCol, endCol) {
	    if (startCol === void 0) { startCol = 0; }
	    if (endCol === void 0) { endCol = null; }
	    var lineString = '';
	    var widthAdjustedStartCol = startCol;
	    var widthAdjustedEndCol = endCol;
	    for (var i = 0; i < line.length; i++) {
	        var char = line[i];
	        lineString += char[LINE_DATA_CHAR_INDEX];
	        if (char[LINE_DATA_WIDTH_INDEX] === 0) {
	            if (startCol >= i) {
	                widthAdjustedStartCol--;
	            }
	            if (endCol >= i) {
	                widthAdjustedEndCol--;
	            }
	        }
	    }
	    var finalEndCol = widthAdjustedEndCol || line.length;
	    if (trimRight) {
	        var rightWhitespaceIndex = lineString.search(/\s+$/);
	        if (rightWhitespaceIndex !== -1) {
	            finalEndCol = Math.min(finalEndCol, rightWhitespaceIndex);
	        }
	        if (finalEndCol <= widthAdjustedStartCol) {
	            return '';
	        }
	    }
	    return lineString.substring(widthAdjustedStartCol, finalEndCol);
	}
	exports.translateBufferLineToString = translateBufferLineToString;


	});

	unwrapExports(BufferLine);
	var BufferLine_1 = BufferLine.translateBufferLineToString;

	var SelectionManager_1 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });





	var DRAG_SCROLL_MAX_THRESHOLD = 50;
	var DRAG_SCROLL_MAX_SPEED = 15;
	var DRAG_SCROLL_INTERVAL = 50;
	var WORD_SEPARATORS = ' ()[]{}\'"';
	var LINE_DATA_WIDTH_INDEX = 2;
	var NON_BREAKING_SPACE_CHAR = String.fromCharCode(160);
	var ALL_NON_BREAKING_SPACE_REGEX = new RegExp(NON_BREAKING_SPACE_CHAR, 'g');
	var SelectionMode;
	(function (SelectionMode) {
	    SelectionMode[SelectionMode["NORMAL"] = 0] = "NORMAL";
	    SelectionMode[SelectionMode["WORD"] = 1] = "WORD";
	    SelectionMode[SelectionMode["LINE"] = 2] = "LINE";
	})(SelectionMode || (SelectionMode = {}));
	var SelectionManager = (function (_super) {
	    __extends(SelectionManager, _super);
	    function SelectionManager(_terminal, _buffer, _rowContainer, _charMeasure) {
	        var _this = _super.call(this) || this;
	        _this._terminal = _terminal;
	        _this._buffer = _buffer;
	        _this._rowContainer = _rowContainer;
	        _this._charMeasure = _charMeasure;
	        _this._enabled = true;
	        _this._initListeners();
	        _this.enable();
	        _this._model = new SelectionModel_1.SelectionModel(_terminal);
	        _this._activeSelectionMode = SelectionMode.NORMAL;
	        return _this;
	    }
	    SelectionManager.prototype._initListeners = function () {
	        var _this = this;
	        this._mouseMoveListener = function (event) { return _this._onMouseMove(event); };
	        this._mouseUpListener = function (event) { return _this._onMouseUp(event); };
	        this._rowContainer.addEventListener('mousedown', function (event) { return _this._onMouseDown(event); });
	        this._buffer.on('trim', function (amount) { return _this._onTrim(amount); });
	    };
	    SelectionManager.prototype.disable = function () {
	        this.clearSelection();
	        this._enabled = false;
	    };
	    SelectionManager.prototype.enable = function () {
	        this._enabled = true;
	    };
	    SelectionManager.prototype.setBuffer = function (buffer) {
	        this._buffer = buffer;
	        this.clearSelection();
	    };
	    Object.defineProperty(SelectionManager.prototype, "selectionStart", {
	        get: function () { return this._model.finalSelectionStart; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SelectionManager.prototype, "selectionEnd", {
	        get: function () { return this._model.finalSelectionEnd; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SelectionManager.prototype, "hasSelection", {
	        get: function () {
	            var start = this._model.finalSelectionStart;
	            var end = this._model.finalSelectionEnd;
	            if (!start || !end) {
	                return false;
	            }
	            return start[0] !== end[0] || start[1] !== end[1];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SelectionManager.prototype, "selectionText", {
	        get: function () {
	            var start = this._model.finalSelectionStart;
	            var end = this._model.finalSelectionEnd;
	            if (!start || !end) {
	                return '';
	            }
	            var startRowEndCol = start[1] === end[1] ? end[0] : null;
	            var result = [];
	            result.push(BufferLine.translateBufferLineToString(this._buffer.get(start[1]), true, start[0], startRowEndCol));
	            for (var i = start[1] + 1; i <= end[1] - 1; i++) {
	                var bufferLine = this._buffer.get(i);
	                var lineText = BufferLine.translateBufferLineToString(bufferLine, true);
	                if (bufferLine.isWrapped) {
	                    result[result.length - 1] += lineText;
	                }
	                else {
	                    result.push(lineText);
	                }
	            }
	            if (start[1] !== end[1]) {
	                var bufferLine = this._buffer.get(end[1]);
	                var lineText = BufferLine.translateBufferLineToString(bufferLine, true, 0, end[0]);
	                if (bufferLine.isWrapped) {
	                    result[result.length - 1] += lineText;
	                }
	                else {
	                    result.push(lineText);
	                }
	            }
	            var formattedResult = result.map(function (line) {
	                return line.replace(ALL_NON_BREAKING_SPACE_REGEX, ' ');
	            }).join(Browser.isMSWindows ? '\r\n' : '\n');
	            return formattedResult;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SelectionManager.prototype.clearSelection = function () {
	        this._model.clearSelection();
	        this._removeMouseDownListeners();
	        this.refresh();
	    };
	    SelectionManager.prototype.refresh = function (isNewSelection) {
	        var _this = this;
	        if (!this._refreshAnimationFrame) {
	            this._refreshAnimationFrame = window.requestAnimationFrame(function () { return _this._refresh(); });
	        }
	        if (Browser.isLinux && isNewSelection) {
	            var selectionText = this.selectionText;
	            if (selectionText.length) {
	                this.emit('newselection', this.selectionText);
	            }
	        }
	    };
	    SelectionManager.prototype._refresh = function () {
	        this._refreshAnimationFrame = null;
	        this.emit('refresh', { start: this._model.finalSelectionStart, end: this._model.finalSelectionEnd });
	    };
	    SelectionManager.prototype.selectAll = function () {
	        this._model.isSelectAllActive = true;
	        this.refresh();
	    };
	    SelectionManager.prototype._onTrim = function (amount) {
	        var needsRefresh = this._model.onTrim(amount);
	        if (needsRefresh) {
	            this.refresh();
	        }
	    };
	    SelectionManager.prototype._getMouseBufferCoords = function (event) {
	        var coords = Mouse.getCoords(event, this._rowContainer, this._charMeasure, this._terminal.cols, this._terminal.rows, true);
	        if (!coords) {
	            return null;
	        }
	        coords[0]--;
	        coords[1]--;
	        coords[1] += this._terminal.buffer.ydisp;
	        return coords;
	    };
	    SelectionManager.prototype._getMouseEventScrollAmount = function (event) {
	        var offset = Mouse.getCoordsRelativeToElement(event, this._rowContainer)[1];
	        var terminalHeight = this._terminal.rows * this._charMeasure.height;
	        if (offset >= 0 && offset <= terminalHeight) {
	            return 0;
	        }
	        if (offset > terminalHeight) {
	            offset -= terminalHeight;
	        }
	        offset = Math.min(Math.max(offset, -DRAG_SCROLL_MAX_THRESHOLD), DRAG_SCROLL_MAX_THRESHOLD);
	        offset /= DRAG_SCROLL_MAX_THRESHOLD;
	        return (offset / Math.abs(offset)) + Math.round(offset * (DRAG_SCROLL_MAX_SPEED - 1));
	    };
	    SelectionManager.prototype._onMouseDown = function (event) {
	        if (event.button === 2 && this.hasSelection) {
	            event.stopPropagation();
	            return;
	        }
	        if (event.button !== 0) {
	            return;
	        }
	        if (!this._enabled) {
	            var shouldForceSelection = Browser.isMac && event.altKey;
	            if (!shouldForceSelection) {
	                return;
	            }
	            event.stopPropagation();
	        }
	        event.preventDefault();
	        this._dragScrollAmount = 0;
	        if (this._enabled && event.shiftKey) {
	            this._onIncrementalClick(event);
	        }
	        else {
	            if (event.detail === 1) {
	                this._onSingleClick(event);
	            }
	            else if (event.detail === 2) {
	                this._onDoubleClick(event);
	            }
	            else if (event.detail === 3) {
	                this._onTripleClick(event);
	            }
	        }
	        this._addMouseDownListeners();
	        this.refresh(true);
	    };
	    SelectionManager.prototype._addMouseDownListeners = function () {
	        var _this = this;
	        this._rowContainer.ownerDocument.addEventListener('mousemove', this._mouseMoveListener);
	        this._rowContainer.ownerDocument.addEventListener('mouseup', this._mouseUpListener);
	        this._dragScrollIntervalTimer = setInterval(function () { return _this._dragScroll(); }, DRAG_SCROLL_INTERVAL);
	    };
	    SelectionManager.prototype._removeMouseDownListeners = function () {
	        this._rowContainer.ownerDocument.removeEventListener('mousemove', this._mouseMoveListener);
	        this._rowContainer.ownerDocument.removeEventListener('mouseup', this._mouseUpListener);
	        clearInterval(this._dragScrollIntervalTimer);
	        this._dragScrollIntervalTimer = null;
	    };
	    SelectionManager.prototype._onIncrementalClick = function (event) {
	        if (this._model.selectionStart) {
	            this._model.selectionEnd = this._getMouseBufferCoords(event);
	        }
	    };
	    SelectionManager.prototype._onSingleClick = function (event) {
	        this._model.selectionStartLength = 0;
	        this._model.isSelectAllActive = false;
	        this._activeSelectionMode = SelectionMode.NORMAL;
	        this._model.selectionStart = this._getMouseBufferCoords(event);
	        if (!this._model.selectionStart) {
	            return;
	        }
	        this._model.selectionEnd = null;
	        var line = this._buffer.get(this._model.selectionStart[1]);
	        if (!line) {
	            return;
	        }
	        var char = line[this._model.selectionStart[0]];
	        if (char[LINE_DATA_WIDTH_INDEX] === 0) {
	            this._model.selectionStart[0]++;
	        }
	    };
	    SelectionManager.prototype._onDoubleClick = function (event) {
	        var coords = this._getMouseBufferCoords(event);
	        if (coords) {
	            this._activeSelectionMode = SelectionMode.WORD;
	            this._selectWordAt(coords);
	        }
	    };
	    SelectionManager.prototype._onTripleClick = function (event) {
	        var coords = this._getMouseBufferCoords(event);
	        if (coords) {
	            this._activeSelectionMode = SelectionMode.LINE;
	            this._selectLineAt(coords[1]);
	        }
	    };
	    SelectionManager.prototype._onMouseMove = function (event) {
	        var previousSelectionEnd = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
	        this._model.selectionEnd = this._getMouseBufferCoords(event);
	        if (!this._model.selectionEnd) {
	            this.refresh(true);
	            return;
	        }
	        if (this._activeSelectionMode === SelectionMode.LINE) {
	            if (this._model.selectionEnd[1] < this._model.selectionStart[1]) {
	                this._model.selectionEnd[0] = 0;
	            }
	            else {
	                this._model.selectionEnd[0] = this._terminal.cols;
	            }
	        }
	        else if (this._activeSelectionMode === SelectionMode.WORD) {
	            this._selectToWordAt(this._model.selectionEnd);
	        }
	        this._dragScrollAmount = this._getMouseEventScrollAmount(event);
	        if (this._dragScrollAmount > 0) {
	            this._model.selectionEnd[0] = this._terminal.cols - 1;
	        }
	        else if (this._dragScrollAmount < 0) {
	            this._model.selectionEnd[0] = 0;
	        }
	        if (this._model.selectionEnd[1] < this._buffer.length) {
	            var char = this._buffer.get(this._model.selectionEnd[1])[this._model.selectionEnd[0]];
	            if (char && char[2] === 0) {
	                this._model.selectionEnd[0]++;
	            }
	        }
	        if (!previousSelectionEnd ||
	            previousSelectionEnd[0] !== this._model.selectionEnd[0] ||
	            previousSelectionEnd[1] !== this._model.selectionEnd[1]) {
	            this.refresh(true);
	        }
	    };
	    SelectionManager.prototype._dragScroll = function () {
	        if (this._dragScrollAmount) {
	            this._terminal.scrollDisp(this._dragScrollAmount, false);
	            if (this._dragScrollAmount > 0) {
	                this._model.selectionEnd = [this._terminal.cols - 1, this._terminal.buffer.ydisp + this._terminal.rows];
	            }
	            else {
	                this._model.selectionEnd = [0, this._terminal.buffer.ydisp];
	            }
	            this.refresh();
	        }
	    };
	    SelectionManager.prototype._onMouseUp = function (event) {
	        this._removeMouseDownListeners();
	    };
	    SelectionManager.prototype._convertViewportColToCharacterIndex = function (bufferLine, coords) {
	        var charIndex = coords[0];
	        for (var i = 0; coords[0] >= i; i++) {
	            var char = bufferLine[i];
	            if (char[LINE_DATA_WIDTH_INDEX] === 0) {
	                charIndex--;
	            }
	        }
	        return charIndex;
	    };
	    SelectionManager.prototype.setSelection = function (col, row, length) {
	        this._model.clearSelection();
	        this._removeMouseDownListeners();
	        this._model.selectionStart = [col, row];
	        this._model.selectionStartLength = length;
	        this.refresh();
	    };
	    SelectionManager.prototype._getWordAt = function (coords) {
	        var bufferLine = this._buffer.get(coords[1]);
	        if (!bufferLine) {
	            return null;
	        }
	        var line = BufferLine.translateBufferLineToString(bufferLine, false);
	        var endIndex = this._convertViewportColToCharacterIndex(bufferLine, coords);
	        var startIndex = endIndex;
	        var charOffset = coords[0] - startIndex;
	        var leftWideCharCount = 0;
	        var rightWideCharCount = 0;
	        if (line.charAt(startIndex) === ' ') {
	            while (startIndex > 0 && line.charAt(startIndex - 1) === ' ') {
	                startIndex--;
	            }
	            while (endIndex < line.length && line.charAt(endIndex + 1) === ' ') {
	                endIndex++;
	            }
	        }
	        else {
	            var startCol = coords[0];
	            var endCol = coords[0];
	            if (bufferLine[startCol][LINE_DATA_WIDTH_INDEX] === 0) {
	                leftWideCharCount++;
	                startCol--;
	            }
	            if (bufferLine[endCol][LINE_DATA_WIDTH_INDEX] === 2) {
	                rightWideCharCount++;
	                endCol++;
	            }
	            while (startIndex > 0 && !this._isCharWordSeparator(line.charAt(startIndex - 1))) {
	                if (bufferLine[startCol - 1][LINE_DATA_WIDTH_INDEX] === 0) {
	                    leftWideCharCount++;
	                    startCol--;
	                }
	                startIndex--;
	                startCol--;
	            }
	            while (endIndex + 1 < line.length && !this._isCharWordSeparator(line.charAt(endIndex + 1))) {
	                if (bufferLine[endCol + 1][LINE_DATA_WIDTH_INDEX] === 2) {
	                    rightWideCharCount++;
	                    endCol++;
	                }
	                endIndex++;
	                endCol++;
	            }
	        }
	        var start = startIndex + charOffset - leftWideCharCount;
	        var length = Math.min(endIndex - startIndex + leftWideCharCount + rightWideCharCount + 1, this._terminal.cols);
	        return { start: start, length: length };
	    };
	    SelectionManager.prototype._selectWordAt = function (coords) {
	        var wordPosition = this._getWordAt(coords);
	        if (wordPosition) {
	            this._model.selectionStart = [wordPosition.start, coords[1]];
	            this._model.selectionStartLength = wordPosition.length;
	        }
	    };
	    SelectionManager.prototype._selectToWordAt = function (coords) {
	        var wordPosition = this._getWordAt(coords);
	        if (wordPosition) {
	            this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? wordPosition.start : (wordPosition.start + wordPosition.length), coords[1]];
	        }
	    };
	    SelectionManager.prototype._isCharWordSeparator = function (char) {
	        return WORD_SEPARATORS.indexOf(char) >= 0;
	    };
	    SelectionManager.prototype._selectLineAt = function (line) {
	        this._model.selectionStart = [0, line];
	        this._model.selectionStartLength = this._terminal.cols;
	    };
	    return SelectionManager;
	}(EventEmitter_1.EventEmitter));
	exports.SelectionManager = SelectionManager;


	});

	unwrapExports(SelectionManager_1);
	var SelectionManager_2 = SelectionManager_1.SelectionManager;

	var CharMeasure_1 = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });

	var CharMeasure = (function (_super) {
	    __extends(CharMeasure, _super);
	    function CharMeasure(document, parentElement) {
	        var _this = _super.call(this) || this;
	        _this._document = document;
	        _this._parentElement = parentElement;
	        return _this;
	    }
	    Object.defineProperty(CharMeasure.prototype, "width", {
	        get: function () {
	            return this._width;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CharMeasure.prototype, "height", {
	        get: function () {
	            return this._height;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    CharMeasure.prototype.measure = function () {
	        var _this = this;
	        if (!this._measureElement) {
	            this._measureElement = this._document.createElement('span');
	            this._measureElement.style.position = 'absolute';
	            this._measureElement.style.top = '0';
	            this._measureElement.style.left = '-9999em';
	            this._measureElement.textContent = 'W';
	            this._measureElement.setAttribute('aria-hidden', 'true');
	            this._parentElement.appendChild(this._measureElement);
	            setTimeout(function () { return _this._doMeasure(); }, 0);
	        }
	        else {
	            this._doMeasure();
	        }
	    };
	    CharMeasure.prototype._doMeasure = function () {
	        var geometry = this._measureElement.getBoundingClientRect();
	        if (geometry.width === 0 || geometry.height === 0) {
	            return;
	        }
	        if (this._width !== geometry.width || this._height !== geometry.height) {
	            this._width = geometry.width;
	            this._height = geometry.height;
	            this.emit('charsizechanged');
	        }
	    };
	    return CharMeasure;
	}(EventEmitter_1.EventEmitter));
	exports.CharMeasure = CharMeasure;


	});

	unwrapExports(CharMeasure_1);
	var CharMeasure_2 = CharMeasure_1.CharMeasure;

	var xterm = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });















	var document = (typeof window != 'undefined') ? window.document : null;
	var WRITE_BUFFER_PAUSE_THRESHOLD = 5;
	var WRITE_BATCH_SIZE = 300;
	var CURSOR_BLINK_INTERVAL = 600;
	function Terminal(options) {
	    var self = this;
	    if (!(this instanceof Terminal)) {
	        return new Terminal(arguments[0], arguments[1], arguments[2]);
	    }
	    self.browser = Browser;
	    self.cancel = Terminal.cancel;
	    EventEmitter_1.EventEmitter.call(this);
	    if (typeof options === 'number') {
	        options = {
	            cols: arguments[0],
	            rows: arguments[1],
	            handler: arguments[2]
	        };
	    }
	    options = options || {};
	    Object.keys(Terminal.defaults).forEach(function (key) {
	        if (options[key] == null) {
	            options[key] = Terminal.options[key];
	            if (Terminal[key] !== Terminal.defaults[key]) {
	                options[key] = Terminal[key];
	            }
	        }
	        self[key] = options[key];
	    });
	    if (options.colors.length === 8) {
	        options.colors = options.colors.concat(Terminal._colors.slice(8));
	    }
	    else if (options.colors.length === 16) {
	        options.colors = options.colors.concat(Terminal._colors.slice(16));
	    }
	    else if (options.colors.length === 10) {
	        options.colors = options.colors.slice(0, -2).concat(Terminal._colors.slice(8, -2), options.colors.slice(-2));
	    }
	    else if (options.colors.length === 18) {
	        options.colors = options.colors.concat(Terminal._colors.slice(16, -2), options.colors.slice(-2));
	    }
	    this.colors = options.colors;
	    this.options = options;
	    this.parent = options.body || options.parent || (document ? document.getElementsByTagName('body')[0] : null);
	    this.cols = options.cols || options.geometry[0];
	    this.rows = options.rows || options.geometry[1];
	    this.geometry = [this.cols, this.rows];
	    if (options.handler) {
	        this.on('data', options.handler);
	    }
	    this.cursorState = 0;
	    this.cursorHidden = false;
	    this.convertEol;
	    this.queue = '';
	    this.customKeyEventHandler = null;
	    this.cursorBlinkInterval = null;
	    this.applicationKeypad = false;
	    this.applicationCursor = false;
	    this.originMode = false;
	    this.insertMode = false;
	    this.wraparoundMode = true;
	    this.charset = null;
	    this.gcharset = null;
	    this.glevel = 0;
	    this.charsets = [null];
	    this.decLocator;
	    this.x10Mouse;
	    this.vt200Mouse;
	    this.vt300Mouse;
	    this.normalMouse;
	    this.mouseEvents;
	    this.sendFocus;
	    this.utfMouse;
	    this.sgrMouse;
	    this.urxvtMouse;
	    this.element;
	    this.children;
	    this.refreshStart;
	    this.refreshEnd;
	    this.savedX;
	    this.savedY;
	    this.savedCols;
	    this.readable = true;
	    this.writable = true;
	    this.defAttr = (0 << 18) | (257 << 9) | (256 << 0);
	    this.curAttr = this.defAttr;
	    this.params = [];
	    this.currentParam = 0;
	    this.prefix = '';
	    this.postfix = '';
	    this.inputHandler = new InputHandler_1.InputHandler(this);
	    this.parser = new Parser_1.Parser(this.inputHandler, this);
	    this.renderer = this.renderer || null;
	    this.selectionManager = this.selectionManager || null;
	    this.linkifier = this.linkifier || new Linkifier_1.Linkifier();
	    this.writeBuffer = [];
	    this.writeInProgress = false;
	    this.xoffSentToCatchUp = false;
	    this.writeStopped = false;
	    this.surrogate_high = '';
	    this.buffers = new BufferSet_1.BufferSet(this);
	    this.buffer = this.buffers.active;
	    this.buffers.on('activate', function (buffer) {
	        this._terminal.buffer = buffer;
	    });
	    if (this.selectionManager) {
	        this.selectionManager.setBuffer(this.buffer.lines);
	    }
	    this.setupStops();
	    this.userScrolling = false;
	}
	inherits(Terminal, EventEmitter_1.EventEmitter);
	Terminal.prototype.eraseAttr = function () {
	    return (this.defAttr & ~0x1ff) | (this.curAttr & 0x1ff);
	};
	Terminal.tangoColors = [
	    '#2e3436',
	    '#cc0000',
	    '#4e9a06',
	    '#c4a000',
	    '#3465a4',
	    '#75507b',
	    '#06989a',
	    '#d3d7cf',
	    '#555753',
	    '#ef2929',
	    '#8ae234',
	    '#fce94f',
	    '#729fcf',
	    '#ad7fa8',
	    '#34e2e2',
	    '#eeeeec'
	];
	Terminal.colors = (function () {
	    var colors = Terminal.tangoColors.slice(), r = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff], i;
	    i = 0;
	    for (; i < 216; i++) {
	        out(r[(i / 36) % 6 | 0], r[(i / 6) % 6 | 0], r[i % 6]);
	    }
	    i = 0;
	    for (; i < 24; i++) {
	        r = 8 + i * 10;
	        out(r, r, r);
	    }
	    function out(r, g, b) {
	        colors.push('#' + hex(r) + hex(g) + hex(b));
	    }
	    function hex(c) {
	        c = c.toString(16);
	        return c.length < 2 ? '0' + c : c;
	    }
	    return colors;
	})();
	Terminal._colors = Terminal.colors.slice();
	Terminal.vcolors = (function () {
	    var out = [], colors = Terminal.colors, i = 0, color;
	    for (; i < 256; i++) {
	        color = parseInt(colors[i].substring(1), 16);
	        out.push([
	            (color >> 16) & 0xff,
	            (color >> 8) & 0xff,
	            color & 0xff
	        ]);
	    }
	    return out;
	})();
	Terminal.defaults = {
	    colors: Terminal.colors,
	    theme: 'default',
	    convertEol: false,
	    termName: 'xterm',
	    geometry: [80, 24],
	    cursorBlink: false,
	    cursorStyle: 'block',
	    visualBell: false,
	    popOnBell: false,
	    scrollback: 1000,
	    screenKeys: false,
	    debug: false,
	    cancelEvents: false,
	    disableStdin: false,
	    useFlowControl: false,
	    tabStopWidth: 8
	};
	Terminal.options = {};
	Terminal.focus = null;
	each(keys(Terminal.defaults), function (key) {
	    Terminal[key] = Terminal.defaults[key];
	    Terminal.options[key] = Terminal.defaults[key];
	});
	Terminal.prototype.focus = function () {
	    return this.textarea.focus();
	};
	Terminal.prototype.getOption = function (key) {
	    if (!(key in Terminal.defaults)) {
	        throw new Error('No option with key "' + key + '"');
	    }
	    if (typeof this.options[key] !== 'undefined') {
	        return this.options[key];
	    }
	    return this[key];
	};
	Terminal.prototype.setOption = function (key, value) {
	    if (!(key in Terminal.defaults)) {
	        throw new Error('No option with key "' + key + '"');
	    }
	    switch (key) {
	        case 'scrollback':
	            if (value < this.rows) {
	                var msg = 'Setting the scrollback value less than the number of rows ';
	                msg += "(" + this.rows + ") is not allowed.";
	                console.warn(msg);
	                return false;
	            }
	            if (this.options[key] !== value) {
	                if (this.buffer.lines.length > value) {
	                    var amountToTrim = this.buffer.lines.length - value;
	                    var needsRefresh = (this.buffer.ydisp - amountToTrim < 0);
	                    this.buffer.lines.trimStart(amountToTrim);
	                    this.buffer.ybase = Math.max(this.buffer.ybase - amountToTrim, 0);
	                    this.buffer.ydisp = Math.max(this.buffer.ydisp - amountToTrim, 0);
	                    if (needsRefresh) {
	                        this.refresh(0, this.rows - 1);
	                    }
	                }
	                this.buffer.lines.maxLength = value;
	                this.viewport.syncScrollArea();
	            }
	            break;
	    }
	    this[key] = value;
	    this.options[key] = value;
	    switch (key) {
	        case 'cursorBlink':
	            this.setCursorBlinking(value);
	            break;
	        case 'cursorStyle':
	            this.element.classList.toggle("xterm-cursor-style-block", value === 'block');
	            this.element.classList.toggle("xterm-cursor-style-underline", value === 'underline');
	            this.element.classList.toggle("xterm-cursor-style-bar", value === 'bar');
	            break;
	        case 'tabStopWidth':
	            this.setupStops();
	            break;
	    }
	};
	Terminal.prototype.restartCursorBlinking = function () {
	    this.setCursorBlinking(this.options.cursorBlink);
	};
	Terminal.prototype.setCursorBlinking = function (enabled) {
	    this.element.classList.toggle('xterm-cursor-blink', enabled);
	    this.clearCursorBlinkingInterval();
	    if (enabled) {
	        var self = this;
	        this.cursorBlinkInterval = setInterval(function () {
	            self.element.classList.toggle('xterm-cursor-blink-on');
	        }, CURSOR_BLINK_INTERVAL);
	    }
	};
	Terminal.prototype.clearCursorBlinkingInterval = function () {
	    this.element.classList.remove('xterm-cursor-blink-on');
	    if (this.cursorBlinkInterval) {
	        clearInterval(this.cursorBlinkInterval);
	        this.cursorBlinkInterval = null;
	    }
	};
	Terminal.bindFocus = function (term) {
	    on(term.textarea, 'focus', function (ev) {
	        if (term.sendFocus) {
	            term.send(EscapeSequences.C0.ESC + '[I');
	        }
	        term.element.classList.add('focus');
	        term.showCursor();
	        term.restartCursorBlinking.apply(term);
	        Terminal.focus = term;
	        term.emit('focus', { terminal: term });
	    });
	};
	Terminal.prototype.blur = function () {
	    return this.textarea.blur();
	};
	Terminal.bindBlur = function (term) {
	    on(term.textarea, 'blur', function (ev) {
	        term.refresh(term.buffer.y, term.buffer.y);
	        if (term.sendFocus) {
	            term.send(EscapeSequences.C0.ESC + '[O');
	        }
	        term.element.classList.remove('focus');
	        term.clearCursorBlinkingInterval.apply(term);
	        Terminal.focus = null;
	        term.emit('blur', { terminal: term });
	    });
	};
	Terminal.prototype.initGlobal = function () {
	    var _this = this;
	    var term = this;
	    Terminal.bindKeys(this);
	    Terminal.bindFocus(this);
	    Terminal.bindBlur(this);
	    on(this.element, 'copy', function (event) {
	        if (!term.hasSelection()) {
	            return;
	        }
	        Clipboard.copyHandler(event, term, _this.selectionManager);
	    });
	    var pasteHandlerWrapper = function (event) { return Clipboard.pasteHandler(event, term); };
	    on(this.textarea, 'paste', pasteHandlerWrapper);
	    on(this.element, 'paste', pasteHandlerWrapper);
	    if (term.browser.isFirefox) {
	        on(this.element, 'mousedown', function (event) {
	            if (event.button == 2) {
	                Clipboard.rightClickHandler(event, _this.textarea, _this.selectionManager);
	            }
	        });
	    }
	    else {
	        on(this.element, 'contextmenu', function (event) {
	            Clipboard.rightClickHandler(event, _this.textarea, _this.selectionManager);
	        });
	    }
	    if (term.browser.isLinux) {
	        on(this.element, 'auxclick', function (event) {
	            if (event.button === 1) {
	                Clipboard.moveTextAreaUnderMouseCursor(event, _this.textarea, _this.selectionManager);
	            }
	        });
	    }
	};
	Terminal.bindKeys = function (term) {
	    on(term.element, 'keydown', function (ev) {
	        if (document.activeElement != this) {
	            return;
	        }
	        term.keyDown(ev);
	    }, true);
	    on(term.element, 'keypress', function (ev) {
	        if (document.activeElement != this) {
	            return;
	        }
	        term.keyPress(ev);
	    }, true);
	    on(term.element, 'keyup', function (ev) {
	        if (!wasMondifierKeyOnlyEvent(ev)) {
	            term.focus(term);
	        }
	    }, true);
	    on(term.textarea, 'keydown', function (ev) {
	        term.keyDown(ev);
	    }, true);
	    on(term.textarea, 'keypress', function (ev) {
	        term.keyPress(ev);
	        this.value = '';
	    }, true);
	    on(term.textarea, 'compositionstart', term.compositionHelper.compositionstart.bind(term.compositionHelper));
	    on(term.textarea, 'compositionupdate', term.compositionHelper.compositionupdate.bind(term.compositionHelper));
	    on(term.textarea, 'compositionend', term.compositionHelper.compositionend.bind(term.compositionHelper));
	    term.on('refresh', term.compositionHelper.updateCompositionElements.bind(term.compositionHelper));
	    term.on('refresh', function (data) {
	        term.queueLinkification(data.start, data.end);
	    });
	};
	Terminal.prototype.insertRow = function (row) {
	    if (typeof row != 'object') {
	        row = document.createElement('div');
	    }
	    this.rowContainer.appendChild(row);
	    this.children.push(row);
	    return row;
	};
	Terminal.prototype.open = function (parent, focus) {
	    var _this = this;
	    var self = this, i = 0;
	    this.parent = parent || this.parent;
	    if (!this.parent) {
	        throw new Error('Terminal requires a parent element.');
	    }
	    this.context = this.parent.ownerDocument.defaultView;
	    this.document = this.parent.ownerDocument;
	    this.body = this.document.getElementsByTagName('body')[0];
	    this.element = this.document.createElement('div');
	    this.element.classList.add('terminal');
	    this.element.classList.add('xterm');
	    this.element.classList.add('xterm-theme-' + this.theme);
	    this.element.classList.add("xterm-cursor-style-" + this.options.cursorStyle);
	    this.setCursorBlinking(this.options.cursorBlink);
	    this.element.setAttribute('tabindex', 0);
	    this.viewportElement = document.createElement('div');
	    this.viewportElement.classList.add('xterm-viewport');
	    this.element.appendChild(this.viewportElement);
	    this.viewportScrollArea = document.createElement('div');
	    this.viewportScrollArea.classList.add('xterm-scroll-area');
	    this.viewportElement.appendChild(this.viewportScrollArea);
	    this.selectionContainer = document.createElement('div');
	    this.selectionContainer.classList.add('xterm-selection');
	    this.element.appendChild(this.selectionContainer);
	    this.rowContainer = document.createElement('div');
	    this.rowContainer.classList.add('xterm-rows');
	    this.element.appendChild(this.rowContainer);
	    this.children = [];
	    this.linkifier.attachToDom(document, this.children);
	    this.helperContainer = document.createElement('div');
	    this.helperContainer.classList.add('xterm-helpers');
	    this.element.appendChild(this.helperContainer);
	    this.textarea = document.createElement('textarea');
	    this.textarea.classList.add('xterm-helper-textarea');
	    this.textarea.setAttribute('autocorrect', 'off');
	    this.textarea.setAttribute('autocapitalize', 'off');
	    this.textarea.setAttribute('spellcheck', 'false');
	    this.textarea.tabIndex = 0;
	    this.textarea.addEventListener('focus', function () {
	        self.emit('focus', { terminal: self });
	    });
	    this.textarea.addEventListener('blur', function () {
	        self.emit('blur', { terminal: self });
	    });
	    this.helperContainer.appendChild(this.textarea);
	    this.compositionView = document.createElement('div');
	    this.compositionView.classList.add('composition-view');
	    this.compositionHelper = new CompositionHelper_1.CompositionHelper(this.textarea, this.compositionView, this);
	    this.helperContainer.appendChild(this.compositionView);
	    this.charSizeStyleElement = document.createElement('style');
	    this.helperContainer.appendChild(this.charSizeStyleElement);
	    for (; i < this.rows; i++) {
	        this.insertRow();
	    }
	    this.parent.appendChild(this.element);
	    this.charMeasure = new CharMeasure_1.CharMeasure(document, this.helperContainer);
	    this.charMeasure.on('charsizechanged', function () {
	        self.updateCharSizeStyles();
	    });
	    this.charMeasure.measure();
	    this.viewport = new Viewport_1.Viewport(this, this.viewportElement, this.viewportScrollArea, this.charMeasure);
	    this.renderer = new Renderer_1.Renderer(this);
	    this.selectionManager = new SelectionManager_1.SelectionManager(this, this.buffer.lines, this.rowContainer, this.charMeasure);
	    this.selectionManager.on('refresh', function (data) {
	        _this.renderer.refreshSelection(data.start, data.end);
	    });
	    this.selectionManager.on('newselection', function (text) {
	        _this.textarea.value = text;
	        _this.textarea.focus();
	        _this.textarea.select();
	    });
	    this.on('scroll', function () { return _this.selectionManager.refresh(); });
	    this.viewportElement.addEventListener('scroll', function () { return _this.selectionManager.refresh(); });
	    this.refresh(0, this.rows - 1);
	    this.initGlobal();
	    if (typeof focus == 'undefined') {
	        var message = 'You did not pass the `focus` argument in `Terminal.prototype.open()`.\n';
	        message += 'The `focus` argument now defaults to `true` but starting with xterm.js 3.0 ';
	        message += 'it will default to `false`.';
	        console.warn(message);
	        focus = true;
	    }
	    if (focus) {
	        this.focus();
	    }
	    this.bindMouse();
	    this.emit('open');
	};
	Terminal.loadAddon = function (addon, callback) {
	    {
	        return commonjsRequire();
	    }
	};
	Terminal.prototype.updateCharSizeStyles = function () {
	    this.charSizeStyleElement.textContent =
	        ".xterm-wide-char{width:" + this.charMeasure.width * 2 + "px;}" +
	            (".xterm-normal-char{width:" + this.charMeasure.width + "px;}") +
	            (".xterm-rows > div{height:" + this.charMeasure.height + "px;}");
	};
	Terminal.prototype.bindMouse = function () {
	    var el = this.element, self = this, pressed = 32;
	    function sendButton(ev) {
	        var button, pos;
	        button = getButton(ev);
	        pos = Mouse.getRawByteCoords(ev, self.rowContainer, self.charMeasure, self.cols, self.rows);
	        if (!pos)
	            return;
	        sendEvent(button, pos);
	        switch (ev.overrideType || ev.type) {
	            case 'mousedown':
	                pressed = button;
	                break;
	            case 'mouseup':
	                pressed = 32;
	                break;
	        }
	    }
	    function sendMove(ev) {
	        var button = pressed, pos;
	        pos = Mouse.getRawByteCoords(ev, self.rowContainer, self.charMeasure, self.cols, self.rows);
	        if (!pos)
	            return;
	        button += 32;
	        sendEvent(button, pos);
	    }
	    function encode(data, ch) {
	        if (!self.utfMouse) {
	            if (ch === 255)
	                return data.push(0);
	            if (ch > 127)
	                ch = 127;
	            data.push(ch);
	        }
	        else {
	            if (ch === 2047)
	                return data.push(0);
	            if (ch < 127) {
	                data.push(ch);
	            }
	            else {
	                if (ch > 2047)
	                    ch = 2047;
	                data.push(0xC0 | (ch >> 6));
	                data.push(0x80 | (ch & 0x3F));
	            }
	        }
	    }
	    function sendEvent(button, pos) {
	        if (self.vt300Mouse) {
	            button &= 3;
	            pos.x -= 32;
	            pos.y -= 32;
	            var data = EscapeSequences.C0.ESC + '[24';
	            if (button === 0)
	                data += '1';
	            else if (button === 1)
	                data += '3';
	            else if (button === 2)
	                data += '5';
	            else if (button === 3)
	                return;
	            else
	                data += '0';
	            data += '~[' + pos.x + ',' + pos.y + ']\r';
	            self.send(data);
	            return;
	        }
	        if (self.decLocator) {
	            button &= 3;
	            pos.x -= 32;
	            pos.y -= 32;
	            if (button === 0)
	                button = 2;
	            else if (button === 1)
	                button = 4;
	            else if (button === 2)
	                button = 6;
	            else if (button === 3)
	                button = 3;
	            self.send(EscapeSequences.C0.ESC + '['
	                + button
	                + ';'
	                + (button === 3 ? 4 : 0)
	                + ';'
	                + pos.y
	                + ';'
	                + pos.x
	                + ';'
	                + (pos.page || 0)
	                + '&w');
	            return;
	        }
	        if (self.urxvtMouse) {
	            pos.x -= 32;
	            pos.y -= 32;
	            pos.x++;
	            pos.y++;
	            self.send(EscapeSequences.C0.ESC + '[' + button + ';' + pos.x + ';' + pos.y + 'M');
	            return;
	        }
	        if (self.sgrMouse) {
	            pos.x -= 32;
	            pos.y -= 32;
	            self.send(EscapeSequences.C0.ESC + '[<'
	                + (((button & 3) === 3 ? button & ~3 : button) - 32)
	                + ';'
	                + pos.x
	                + ';'
	                + pos.y
	                + ((button & 3) === 3 ? 'm' : 'M'));
	            return;
	        }
	        var data = [];
	        encode(data, button);
	        encode(data, pos.x);
	        encode(data, pos.y);
	        self.send(EscapeSequences.C0.ESC + '[M' + String.fromCharCode.apply(String, data));
	    }
	    function getButton(ev) {
	        var button, shift, meta, ctrl, mod;
	        switch (ev.overrideType || ev.type) {
	            case 'mousedown':
	                button = ev.button != null
	                    ? +ev.button
	                    : ev.which != null
	                        ? ev.which - 1
	                        : null;
	                if (self.browser.isMSIE) {
	                    button = button === 1 ? 0 : button === 4 ? 1 : button;
	                }
	                break;
	            case 'mouseup':
	                button = 3;
	                break;
	            case 'DOMMouseScroll':
	                button = ev.detail < 0
	                    ? 64
	                    : 65;
	                break;
	            case 'wheel':
	                button = ev.wheelDeltaY > 0
	                    ? 64
	                    : 65;
	                break;
	        }
	        shift = ev.shiftKey ? 4 : 0;
	        meta = ev.metaKey ? 8 : 0;
	        ctrl = ev.ctrlKey ? 16 : 0;
	        mod = shift | meta | ctrl;
	        if (self.vt200Mouse) {
	            mod &= ctrl;
	        }
	        else if (!self.normalMouse) {
	            mod = 0;
	        }
	        button = (32 + (mod << 2)) + button;
	        return button;
	    }
	    on(el, 'mousedown', function (ev) {
	        ev.preventDefault();
	        self.focus();
	        if (!self.mouseEvents)
	            return;
	        sendButton(ev);
	        if (self.vt200Mouse) {
	            ev.overrideType = 'mouseup';
	            sendButton(ev);
	            return self.cancel(ev);
	        }
	        if (self.normalMouse)
	            on(self.document, 'mousemove', sendMove);
	        if (!self.x10Mouse) {
	            on(self.document, 'mouseup', function up(ev) {
	                sendButton(ev);
	                if (self.normalMouse)
	                    off(self.document, 'mousemove', sendMove);
	                off(self.document, 'mouseup', up);
	                return self.cancel(ev);
	            });
	        }
	        return self.cancel(ev);
	    });
	    on(el, 'wheel', function (ev) {
	        if (!self.mouseEvents)
	            return;
	        if (self.x10Mouse
	            || self.vt300Mouse
	            || self.decLocator)
	            return;
	        sendButton(ev);
	        return self.cancel(ev);
	    });
	    on(el, 'wheel', function (ev) {
	        if (self.mouseEvents)
	            return;
	        self.viewport.onWheel(ev);
	        return self.cancel(ev);
	    });
	    on(el, 'touchstart', function (ev) {
	        if (self.mouseEvents)
	            return;
	        self.viewport.onTouchStart(ev);
	        return self.cancel(ev);
	    });
	    on(el, 'touchmove', function (ev) {
	        if (self.mouseEvents)
	            return;
	        self.viewport.onTouchMove(ev);
	        return self.cancel(ev);
	    });
	};
	Terminal.prototype.destroy = function () {
	    this.readable = false;
	    this.writable = false;
	    this._events = {};
	    this.handler = function () { };
	    this.write = function () { };
	    if (this.element && this.element.parentNode) {
	        this.element.parentNode.removeChild(this.element);
	    }
	};
	Terminal.prototype.refresh = function (start, end) {
	    if (this.renderer) {
	        this.renderer.queueRefresh(start, end);
	    }
	};
	Terminal.prototype.queueLinkification = function (start, end) {
	    if (this.linkifier) {
	        for (var i = start; i <= end; i++) {
	            this.linkifier.linkifyRow(i);
	        }
	    }
	};
	Terminal.prototype.showCursor = function () {
	    if (!this.cursorState) {
	        this.cursorState = 1;
	        this.refresh(this.buffer.y, this.buffer.y);
	    }
	};
	Terminal.prototype.scroll = function (isWrapped) {
	    var row;
	    if (this.buffer.lines.length === this.buffer.lines.maxLength) {
	        this.buffer.lines.trimStart(1);
	        this.buffer.ybase--;
	        if (this.buffer.ydisp !== 0) {
	            this.buffer.ydisp--;
	        }
	    }
	    this.buffer.ybase++;
	    if (!this.userScrolling) {
	        this.buffer.ydisp = this.buffer.ybase;
	    }
	    row = this.buffer.ybase + this.rows - 1;
	    row -= this.rows - 1 - this.buffer.scrollBottom;
	    if (row === this.buffer.lines.length) {
	        this.buffer.lines.push(this.blankLine(undefined, isWrapped));
	    }
	    else {
	        this.buffer.lines.splice(row, 0, this.blankLine(undefined, isWrapped));
	    }
	    if (this.buffer.scrollTop !== 0) {
	        if (this.buffer.ybase !== 0) {
	            this.buffer.ybase--;
	            if (!this.userScrolling) {
	                this.buffer.ydisp = this.buffer.ybase;
	            }
	        }
	        this.buffer.lines.splice(this.buffer.ybase + this.buffer.scrollTop, 1);
	    }
	    this.updateRange(this.buffer.scrollTop);
	    this.updateRange(this.buffer.scrollBottom);
	    this.emit('scroll', this.buffer.ydisp);
	};
	Terminal.prototype.scrollDisp = function (disp, suppressScrollEvent) {
	    if (disp < 0) {
	        if (this.buffer.ydisp === 0) {
	            return;
	        }
	        this.userScrolling = true;
	    }
	    else if (disp + this.buffer.ydisp >= this.buffer.ybase) {
	        this.userScrolling = false;
	    }
	    var oldYdisp = this.buffer.ydisp;
	    this.buffer.ydisp = Math.max(Math.min(this.buffer.ydisp + disp, this.buffer.ybase), 0);
	    if (oldYdisp === this.buffer.ydisp) {
	        return;
	    }
	    if (!suppressScrollEvent) {
	        this.emit('scroll', this.buffer.ydisp);
	    }
	    this.refresh(0, this.rows - 1);
	};
	Terminal.prototype.scrollPages = function (pageCount) {
	    this.scrollDisp(pageCount * (this.rows - 1));
	};
	Terminal.prototype.scrollToTop = function () {
	    this.scrollDisp(-this.buffer.ydisp);
	};
	Terminal.prototype.scrollToBottom = function () {
	    this.scrollDisp(this.buffer.ybase - this.buffer.ydisp);
	};
	Terminal.prototype.write = function (data) {
	    this.writeBuffer.push(data);
	    if (this.options.useFlowControl && !this.xoffSentToCatchUp && this.writeBuffer.length >= WRITE_BUFFER_PAUSE_THRESHOLD) {
	        this.send(EscapeSequences.C0.DC3);
	        this.xoffSentToCatchUp = true;
	    }
	    if (!this.writeInProgress && this.writeBuffer.length > 0) {
	        this.writeInProgress = true;
	        var self = this;
	        setTimeout(function () {
	            self.innerWrite();
	        });
	    }
	};
	Terminal.prototype.innerWrite = function () {
	    var writeBatch = this.writeBuffer.splice(0, WRITE_BATCH_SIZE);
	    while (writeBatch.length > 0) {
	        var data = writeBatch.shift();
	        var l = data.length;
	        if (this.xoffSentToCatchUp && writeBatch.length === 0 && this.writeBuffer.length === 0) {
	            this.send(EscapeSequences.C0.DC1);
	            this.xoffSentToCatchUp = false;
	        }
	        this.refreshStart = this.buffer.y;
	        this.refreshEnd = this.buffer.y;
	        var state = this.parser.parse(data);
	        this.parser.setState(state);
	        this.updateRange(this.buffer.y);
	        this.refresh(this.refreshStart, this.refreshEnd);
	    }
	    if (this.writeBuffer.length > 0) {
	        var self = this;
	        setTimeout(function () {
	            self.innerWrite();
	        }, 0);
	    }
	    else {
	        this.writeInProgress = false;
	    }
	};
	Terminal.prototype.writeln = function (data) {
	    this.write(data + '\r\n');
	};
	Terminal.prototype.attachCustomKeydownHandler = function (customKeydownHandler) {
	    var message = 'attachCustomKeydownHandler() is DEPRECATED and will be removed soon. Please use attachCustomKeyEventHandler() instead.';
	    console.warn(message);
	    this.attachCustomKeyEventHandler(customKeydownHandler);
	};
	Terminal.prototype.attachCustomKeyEventHandler = function (customKeyEventHandler) {
	    this.customKeyEventHandler = customKeyEventHandler;
	};
	Terminal.prototype.setHypertextLinkHandler = function (handler) {
	    if (!this.linkifier) {
	        throw new Error('Cannot attach a hypertext link handler before Terminal.open is called');
	    }
	    this.linkifier.setHypertextLinkHandler(handler);
	    this.refresh(0, this.rows - 1);
	};
	Terminal.prototype.setHypertextValidationCallback = function (callback) {
	    if (!this.linkifier) {
	        throw new Error('Cannot attach a hypertext validation callback before Terminal.open is called');
	    }
	    this.linkifier.setHypertextValidationCallback(callback);
	    this.refresh(0, this.rows - 1);
	};
	Terminal.prototype.registerLinkMatcher = function (regex, handler, options) {
	    if (this.linkifier) {
	        var matcherId = this.linkifier.registerLinkMatcher(regex, handler, options);
	        this.refresh(0, this.rows - 1);
	        return matcherId;
	    }
	};
	Terminal.prototype.deregisterLinkMatcher = function (matcherId) {
	    if (this.linkifier) {
	        if (this.linkifier.deregisterLinkMatcher(matcherId)) {
	            this.refresh(0, this.rows - 1);
	        }
	    }
	};
	Terminal.prototype.hasSelection = function () {
	    return this.selectionManager ? this.selectionManager.hasSelection : false;
	};
	Terminal.prototype.getSelection = function () {
	    return this.selectionManager ? this.selectionManager.selectionText : '';
	};
	Terminal.prototype.clearSelection = function () {
	    if (this.selectionManager) {
	        this.selectionManager.clearSelection();
	    }
	};
	Terminal.prototype.selectAll = function () {
	    if (this.selectionManager) {
	        this.selectionManager.selectAll();
	    }
	};
	Terminal.prototype.keyDown = function (ev) {
	    if (this.customKeyEventHandler && this.customKeyEventHandler(ev) === false) {
	        return false;
	    }
	    this.restartCursorBlinking();
	    if (!this.compositionHelper.keydown.bind(this.compositionHelper)(ev)) {
	        if (this.buffer.ybase !== this.buffer.ydisp) {
	            this.scrollToBottom();
	        }
	        return false;
	    }
	    var result = this.evaluateKeyEscapeSequence(ev);
	    if (result.key === EscapeSequences.C0.DC3) {
	        this.writeStopped = true;
	    }
	    else if (result.key === EscapeSequences.C0.DC1) {
	        this.writeStopped = false;
	    }
	    if (result.scrollDisp) {
	        this.scrollDisp(result.scrollDisp);
	        return this.cancel(ev, true);
	    }
	    if (isThirdLevelShift(this, ev)) {
	        return true;
	    }
	    if (result.cancel) {
	        this.cancel(ev, true);
	    }
	    if (!result.key) {
	        return true;
	    }
	    this.emit('keydown', ev);
	    this.emit('key', result.key, ev);
	    this.showCursor();
	    this.handler(result.key);
	    return this.cancel(ev, true);
	};
	Terminal.prototype.evaluateKeyEscapeSequence = function (ev) {
	    var result = {
	        cancel: false,
	        key: undefined,
	        scrollDisp: undefined
	    };
	    var modifiers = ev.shiftKey << 0 | ev.altKey << 1 | ev.ctrlKey << 2 | ev.metaKey << 3;
	    switch (ev.keyCode) {
	        case 8:
	            if (ev.shiftKey) {
	                result.key = EscapeSequences.C0.BS;
	                break;
	            }
	            result.key = EscapeSequences.C0.DEL;
	            break;
	        case 9:
	            if (ev.shiftKey) {
	                result.key = EscapeSequences.C0.ESC + '[Z';
	                break;
	            }
	            result.key = EscapeSequences.C0.HT;
	            result.cancel = true;
	            break;
	        case 13:
	            result.key = EscapeSequences.C0.CR;
	            result.cancel = true;
	            break;
	        case 27:
	            result.key = EscapeSequences.C0.ESC;
	            result.cancel = true;
	            break;
	        case 37:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'D';
	                if (result.key == EscapeSequences.C0.ESC + '[1;3D') {
	                    result.key = (this.browser.isMac) ? EscapeSequences.C0.ESC + 'b' : EscapeSequences.C0.ESC + '[1;5D';
	                }
	            }
	            else if (this.applicationCursor) {
	                result.key = EscapeSequences.C0.ESC + 'OD';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[D';
	            }
	            break;
	        case 39:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'C';
	                if (result.key == EscapeSequences.C0.ESC + '[1;3C') {
	                    result.key = (this.browser.isMac) ? EscapeSequences.C0.ESC + 'f' : EscapeSequences.C0.ESC + '[1;5C';
	                }
	            }
	            else if (this.applicationCursor) {
	                result.key = EscapeSequences.C0.ESC + 'OC';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[C';
	            }
	            break;
	        case 38:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'A';
	                if (result.key == EscapeSequences.C0.ESC + '[1;3A') {
	                    result.key = EscapeSequences.C0.ESC + '[1;5A';
	                }
	            }
	            else if (this.applicationCursor) {
	                result.key = EscapeSequences.C0.ESC + 'OA';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[A';
	            }
	            break;
	        case 40:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'B';
	                if (result.key == EscapeSequences.C0.ESC + '[1;3B') {
	                    result.key = EscapeSequences.C0.ESC + '[1;5B';
	                }
	            }
	            else if (this.applicationCursor) {
	                result.key = EscapeSequences.C0.ESC + 'OB';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[B';
	            }
	            break;
	        case 45:
	            if (!ev.shiftKey && !ev.ctrlKey) {
	                result.key = EscapeSequences.C0.ESC + '[2~';
	            }
	            break;
	        case 46:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[3;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[3~';
	            }
	            break;
	        case 36:
	            if (modifiers)
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'H';
	            else if (this.applicationCursor)
	                result.key = EscapeSequences.C0.ESC + 'OH';
	            else
	                result.key = EscapeSequences.C0.ESC + '[H';
	            break;
	        case 35:
	            if (modifiers)
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'F';
	            else if (this.applicationCursor)
	                result.key = EscapeSequences.C0.ESC + 'OF';
	            else
	                result.key = EscapeSequences.C0.ESC + '[F';
	            break;
	        case 33:
	            if (ev.shiftKey) {
	                result.scrollDisp = -(this.rows - 1);
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[5~';
	            }
	            break;
	        case 34:
	            if (ev.shiftKey) {
	                result.scrollDisp = this.rows - 1;
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[6~';
	            }
	            break;
	        case 112:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'P';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + 'OP';
	            }
	            break;
	        case 113:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'Q';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + 'OQ';
	            }
	            break;
	        case 114:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'R';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + 'OR';
	            }
	            break;
	        case 115:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[1;' + (modifiers + 1) + 'S';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + 'OS';
	            }
	            break;
	        case 116:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[15;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[15~';
	            }
	            break;
	        case 117:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[17;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[17~';
	            }
	            break;
	        case 118:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[18;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[18~';
	            }
	            break;
	        case 119:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[19;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[19~';
	            }
	            break;
	        case 120:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[20;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[20~';
	            }
	            break;
	        case 121:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[21;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[21~';
	            }
	            break;
	        case 122:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[23;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[23~';
	            }
	            break;
	        case 123:
	            if (modifiers) {
	                result.key = EscapeSequences.C0.ESC + '[24;' + (modifiers + 1) + '~';
	            }
	            else {
	                result.key = EscapeSequences.C0.ESC + '[24~';
	            }
	            break;
	        default:
	            if (ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey) {
	                if (ev.keyCode >= 65 && ev.keyCode <= 90) {
	                    result.key = String.fromCharCode(ev.keyCode - 64);
	                }
	                else if (ev.keyCode === 32) {
	                    result.key = String.fromCharCode(0);
	                }
	                else if (ev.keyCode >= 51 && ev.keyCode <= 55) {
	                    result.key = String.fromCharCode(ev.keyCode - 51 + 27);
	                }
	                else if (ev.keyCode === 56) {
	                    result.key = String.fromCharCode(127);
	                }
	                else if (ev.keyCode === 219) {
	                    result.key = String.fromCharCode(27);
	                }
	                else if (ev.keyCode === 220) {
	                    result.key = String.fromCharCode(28);
	                }
	                else if (ev.keyCode === 221) {
	                    result.key = String.fromCharCode(29);
	                }
	            }
	            else if (!this.browser.isMac && ev.altKey && !ev.ctrlKey && !ev.metaKey) {
	                if (ev.keyCode >= 65 && ev.keyCode <= 90) {
	                    result.key = EscapeSequences.C0.ESC + String.fromCharCode(ev.keyCode + 32);
	                }
	                else if (ev.keyCode === 192) {
	                    result.key = EscapeSequences.C0.ESC + '`';
	                }
	                else if (ev.keyCode >= 48 && ev.keyCode <= 57) {
	                    result.key = EscapeSequences.C0.ESC + (ev.keyCode - 48);
	                }
	            }
	            else if (this.browser.isMac && !ev.altKey && !ev.ctrlKey && ev.metaKey) {
	                if (ev.keyCode === 65) {
	                    this.selectAll();
	                }
	            }
	            break;
	    }
	    return result;
	};
	Terminal.prototype.setgLevel = function (g) {
	    this.glevel = g;
	    this.charset = this.charsets[g];
	};
	Terminal.prototype.setgCharset = function (g, charset) {
	    this.charsets[g] = charset;
	    if (this.glevel === g) {
	        this.charset = charset;
	    }
	};
	Terminal.prototype.keyPress = function (ev) {
	    var key;
	    if (this.customKeyEventHandler && this.customKeyEventHandler(ev) === false) {
	        return false;
	    }
	    this.cancel(ev);
	    if (ev.charCode) {
	        key = ev.charCode;
	    }
	    else if (ev.which == null) {
	        key = ev.keyCode;
	    }
	    else if (ev.which !== 0 && ev.charCode !== 0) {
	        key = ev.which;
	    }
	    else {
	        return false;
	    }
	    if (!key || ((ev.altKey || ev.ctrlKey || ev.metaKey) && !isThirdLevelShift(this, ev))) {
	        return false;
	    }
	    key = String.fromCharCode(key);
	    this.emit('keypress', key, ev);
	    this.emit('key', key, ev);
	    this.showCursor();
	    this.handler(key);
	    return true;
	};
	Terminal.prototype.send = function (data) {
	    var self = this;
	    if (!this.queue) {
	        setTimeout(function () {
	            self.handler(self.queue);
	            self.queue = '';
	        }, 1);
	    }
	    this.queue += data;
	};
	Terminal.prototype.bell = function () {
	    if (!this.visualBell)
	        return;
	    var self = this;
	    this.element.style.borderColor = 'white';
	    setTimeout(function () {
	        self.element.style.borderColor = '';
	    }, 10);
	    if (this.popOnBell)
	        this.focus();
	};
	Terminal.prototype.log = function () {
	    if (!this.debug)
	        return;
	    if (!this.context.console || !this.context.console.log)
	        return;
	    var args = Array.prototype.slice.call(arguments);
	    this.context.console.log.apply(this.context.console, args);
	};
	Terminal.prototype.error = function () {
	    if (!this.debug)
	        return;
	    if (!this.context.console || !this.context.console.error)
	        return;
	    var args = Array.prototype.slice.call(arguments);
	    this.context.console.error.apply(this.context.console, args);
	};
	Terminal.prototype.resize = function (x, y) {
	    if (isNaN(x) || isNaN(y)) {
	        return;
	    }
	    if (y > this.getOption('scrollback')) {
	        this.setOption('scrollback', y);
	    }
	    var el;
	    if (x === this.cols && y === this.rows) {
	        if (!this.charMeasure.width || !this.charMeasure.height) {
	            this.charMeasure.measure();
	        }
	        return;
	    }
	    if (x < 1)
	        x = 1;
	    if (y < 1)
	        y = 1;
	    this.buffers.resize(x, y);
	    while (this.children.length < y) {
	        this.insertRow();
	    }
	    while (this.children.length > y) {
	        el = this.children.shift();
	        if (!el)
	            continue;
	        el.parentNode.removeChild(el);
	    }
	    this.cols = x;
	    this.rows = y;
	    this.setupStops(this.cols);
	    this.charMeasure.measure();
	    this.refresh(0, this.rows - 1);
	    this.geometry = [this.cols, this.rows];
	    this.emit('resize', { terminal: this, cols: x, rows: y });
	};
	Terminal.prototype.updateRange = function (y) {
	    if (y < this.refreshStart)
	        this.refreshStart = y;
	    if (y > this.refreshEnd)
	        this.refreshEnd = y;
	};
	Terminal.prototype.maxRange = function () {
	    this.refreshStart = 0;
	    this.refreshEnd = this.rows - 1;
	};
	Terminal.prototype.setupStops = function (i) {
	    if (i != null) {
	        if (!this.buffer.tabs[i]) {
	            i = this.prevStop(i);
	        }
	    }
	    else {
	        this.buffer.tabs = {};
	        i = 0;
	    }
	    for (; i < this.cols; i += this.getOption('tabStopWidth')) {
	        this.buffer.tabs[i] = true;
	    }
	};
	Terminal.prototype.prevStop = function (x) {
	    if (x == null)
	        x = this.buffer.x;
	    while (!this.buffer.tabs[--x] && x > 0)
	        ;
	    return x >= this.cols
	        ? this.cols - 1
	        : x < 0 ? 0 : x;
	};
	Terminal.prototype.nextStop = function (x) {
	    if (x == null)
	        x = this.buffer.x;
	    while (!this.buffer.tabs[++x] && x < this.cols)
	        ;
	    return x >= this.cols
	        ? this.cols - 1
	        : x < 0 ? 0 : x;
	};
	Terminal.prototype.eraseRight = function (x, y) {
	    var line = this.buffer.lines.get(this.buffer.ybase + y);
	    if (!line) {
	        return;
	    }
	    var ch = [this.eraseAttr(), ' ', 1];
	    for (; x < this.cols; x++) {
	        line[x] = ch;
	    }
	    this.updateRange(y);
	};
	Terminal.prototype.eraseLeft = function (x, y) {
	    var line = this.buffer.lines.get(this.buffer.ybase + y);
	    if (!line) {
	        return;
	    }
	    var ch = [this.eraseAttr(), ' ', 1];
	    x++;
	    while (x--) {
	        line[x] = ch;
	    }
	    this.updateRange(y);
	};
	Terminal.prototype.clear = function () {
	    if (this.buffer.ybase === 0 && this.buffer.y === 0) {
	        return;
	    }
	    this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y));
	    this.buffer.lines.length = 1;
	    this.buffer.ydisp = 0;
	    this.buffer.ybase = 0;
	    this.buffer.y = 0;
	    for (var i = 1; i < this.rows; i++) {
	        this.buffer.lines.push(this.blankLine());
	    }
	    this.refresh(0, this.rows - 1);
	    this.emit('scroll', this.buffer.ydisp);
	};
	Terminal.prototype.eraseLine = function (y) {
	    this.eraseRight(0, y);
	};
	Terminal.prototype.blankLine = function (cur, isWrapped, cols) {
	    var attr = cur
	        ? this.eraseAttr()
	        : this.defAttr;
	    var ch = [attr, ' ', 1], line = [], i = 0;
	    if (isWrapped) {
	        line.isWrapped = isWrapped;
	    }
	    cols = cols || this.cols;
	    for (; i < cols; i++) {
	        line[i] = ch;
	    }
	    return line;
	};
	Terminal.prototype.ch = function (cur) {
	    return cur
	        ? [this.eraseAttr(), ' ', 1]
	        : [this.defAttr, ' ', 1];
	};
	Terminal.prototype.is = function (term) {
	    var name = this.termName;
	    return (name + '').indexOf(term) === 0;
	};
	Terminal.prototype.handler = function (data) {
	    if (this.options.disableStdin) {
	        return;
	    }
	    if (this.selectionManager && this.selectionManager.hasSelection) {
	        this.selectionManager.clearSelection();
	    }
	    if (this.buffer.ybase !== this.buffer.ydisp) {
	        this.scrollToBottom();
	    }
	    this.emit('data', data);
	};
	Terminal.prototype.handleTitle = function (title) {
	    this.emit('title', title);
	};
	Terminal.prototype.index = function () {
	    this.buffer.y++;
	    if (this.buffer.y > this.buffer.scrollBottom) {
	        this.buffer.y--;
	        this.scroll();
	    }
	    if (this.buffer.x >= this.cols) {
	        this.buffer.x--;
	    }
	};
	Terminal.prototype.reverseIndex = function () {
	    if (this.buffer.y === this.buffer.scrollTop) {
	        this.buffer.lines.shiftElements(this.buffer.y + this.buffer.ybase, this.rows - 1, 1);
	        this.buffer.lines.set(this.buffer.y + this.buffer.ybase, this.blankLine(true));
	        this.updateRange(this.buffer.scrollTop);
	        this.updateRange(this.buffer.scrollBottom);
	    }
	    else {
	        this.buffer.y--;
	    }
	};
	Terminal.prototype.reset = function () {
	    this.options.rows = this.rows;
	    this.options.cols = this.cols;
	    var customKeyEventHandler = this.customKeyEventHandler;
	    var cursorBlinkInterval = this.cursorBlinkInterval;
	    var inputHandler = this.inputHandler;
	    Terminal.call(this, this.options);
	    this.customKeyEventHandler = customKeyEventHandler;
	    this.cursorBlinkInterval = cursorBlinkInterval;
	    this.inputHandler = inputHandler;
	    this.refresh(0, this.rows - 1);
	    this.viewport.syncScrollArea();
	};
	Terminal.prototype.tabSet = function () {
	    this.buffer.tabs[this.buffer.x] = true;
	};
	function on(el, type, handler, capture) {
	    if (!Array.isArray(el)) {
	        el = [el];
	    }
	    el.forEach(function (element) {
	        element.addEventListener(type, handler, capture || false);
	    });
	}
	function off(el, type, handler, capture) {
	    el.removeEventListener(type, handler, capture || false);
	}
	function cancel(ev, force) {
	    if (!this.cancelEvents && !force) {
	        return;
	    }
	    ev.preventDefault();
	    ev.stopPropagation();
	    return false;
	}
	function inherits(child, parent) {
	    function f() {
	        this.constructor = child;
	    }
	    f.prototype = parent.prototype;
	    child.prototype = new f;
	}
	function isThirdLevelShift(term, ev) {
	    var thirdLevelKey = (term.browser.isMac && ev.altKey && !ev.ctrlKey && !ev.metaKey) ||
	        (term.browser.isMSWindows && ev.altKey && ev.ctrlKey && !ev.metaKey);
	    if (ev.type == 'keypress') {
	        return thirdLevelKey;
	    }
	    return thirdLevelKey && (!ev.keyCode || ev.keyCode > 47);
	}
	Terminal.prototype.matchColor = matchColor;
	function matchColor(r1, g1, b1) {
	    var hash = (r1 << 16) | (g1 << 8) | b1;
	    if (matchColor._cache[hash] != null) {
	        return matchColor._cache[hash];
	    }
	    var ldiff = Infinity, li = -1, i = 0, c, r2, g2, b2, diff;
	    for (; i < Terminal.vcolors.length; i++) {
	        c = Terminal.vcolors[i];
	        r2 = c[0];
	        g2 = c[1];
	        b2 = c[2];
	        diff = matchColor.distance(r1, g1, b1, r2, g2, b2);
	        if (diff === 0) {
	            li = i;
	            break;
	        }
	        if (diff < ldiff) {
	            ldiff = diff;
	            li = i;
	        }
	    }
	    return matchColor._cache[hash] = li;
	}
	matchColor._cache = {};
	matchColor.distance = function (r1, g1, b1, r2, g2, b2) {
	    return Math.pow(30 * (r1 - r2), 2)
	        + Math.pow(59 * (g1 - g2), 2)
	        + Math.pow(11 * (b1 - b2), 2);
	};
	function each(obj, iter, con) {
	    if (obj.forEach)
	        return obj.forEach(iter, con);
	    for (var i = 0; i < obj.length; i++) {
	        iter.call(con, obj[i], i, obj);
	    }
	}
	function wasMondifierKeyOnlyEvent(ev) {
	    return ev.keyCode === 16 ||
	        ev.keyCode === 17 ||
	        ev.keyCode === 18;
	}
	function keys(obj) {
	    if (Object.keys)
	        return Object.keys(obj);
	    var key, keys = [];
	    for (key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	}
	Terminal.translateBufferLineToString = BufferLine.translateBufferLineToString;
	Terminal.EventEmitter = EventEmitter_1.EventEmitter;
	Terminal.inherits = inherits;
	Terminal.on = on;
	Terminal.off = off;
	Terminal.cancel = cancel;
	module.exports = Terminal;


	});

	var Terminal = unwrapExports(xterm);

	var isWebSocket = function (constructor) {
	    return constructor && constructor.CLOSING === 2;
	};
	var isGlobalWebSocket = function () {
	    return typeof WebSocket !== 'undefined' && isWebSocket(WebSocket);
	};
	var getDefaultOptions = function () { return ({
	    constructor: isGlobalWebSocket() ? WebSocket : null,
	    maxReconnectionDelay: 10000,
	    minReconnectionDelay: 1500,
	    reconnectionDelayGrowFactor: 1.3,
	    connectionTimeout: 4000,
	    maxRetries: Infinity,
	    debug: false,
	}); };
	var bypassProperty = function (src, dst, name) {
	    Object.defineProperty(dst, name, {
	        get: function () { return src[name]; },
	        set: function (value) { src[name] = value; },
	        enumerable: true,
	        configurable: true,
	    });
	};
	var initReconnectionDelay = function (config) {
	    return (config.minReconnectionDelay + Math.random() * config.minReconnectionDelay);
	};
	var updateReconnectionDelay = function (config, previousDelay) {
	    var newDelay = previousDelay * config.reconnectionDelayGrowFactor;
	    return (newDelay > config.maxReconnectionDelay)
	        ? config.maxReconnectionDelay
	        : newDelay;
	};
	var LEVEL_0_EVENTS = ['onopen', 'onclose', 'onmessage', 'onerror'];
	var reassignEventListeners = function (ws, oldWs, listeners) {
	    Object.keys(listeners).forEach(function (type) {
	        listeners[type].forEach(function (_a) {
	            var listener = _a[0], options = _a[1];
	            ws.addEventListener(type, listener, options);
	        });
	    });
	    if (oldWs) {
	        LEVEL_0_EVENTS.forEach(function (name) {
	            ws[name] = oldWs[name];
	        });
	    }
	};
	var ReconnectingWebsocket = function (url, protocols, options) {
	    var _this = this;
	    if (options === void 0) { options = {}; }
	    var ws;
	    var connectingTimeout;
	    var reconnectDelay = 0;
	    var retriesCount = 0;
	    var shouldRetry = true;
	    var savedOnClose = null;
	    var listeners = {};
	    // require new to construct
	    if (!(this instanceof ReconnectingWebsocket)) {
	        throw new TypeError("Failed to construct 'ReconnectingWebSocket': Please use the 'new' operator");
	    }
	    // Set config. Not using `Object.assign` because of IE11
	    var config = getDefaultOptions();
	    Object.keys(config)
	        .filter(function (key) { return options.hasOwnProperty(key); })
	        .forEach(function (key) { return config[key] = options[key]; });
	    if (!isWebSocket(config.constructor)) {
	        throw new TypeError('Invalid WebSocket constructor. Set `options.constructor`');
	    }
	    var log = config.debug ? function () {
	        var params = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            params[_i] = arguments[_i];
	        }
	        return console.log.apply(console, ['RWS:'].concat(params));
	    } : function () { };
	    /**
	     * Not using dispatchEvent, otherwise we must use a DOM Event object
	     * Deferred because we want to handle the close event before this
	     */
	    var emitError = function (code, msg) { return setTimeout(function () {
	        var err = new Error(msg);
	        err.code = code;
	        if (Array.isArray(listeners.error)) {
	            listeners.error.forEach(function (_a) {
	                var fn = _a[0];
	                return fn(err);
	            });
	        }
	        if (ws.onerror) {
	            ws.onerror(err);
	        }
	    }, 0); };
	    var handleClose = function () {
	        log('handleClose', { shouldRetry: shouldRetry });
	        retriesCount++;
	        log('retries count:', retriesCount);
	        if (retriesCount > config.maxRetries) {
	            emitError('EHOSTDOWN', 'Too many failed connection attempts');
	            return;
	        }
	        if (!reconnectDelay) {
	            reconnectDelay = initReconnectionDelay(config);
	        }
	        else {
	            reconnectDelay = updateReconnectionDelay(config, reconnectDelay);
	        }
	        log('handleClose - reconnectDelay:', reconnectDelay);
	        if (shouldRetry) {
	            setTimeout(connect, reconnectDelay);
	        }
	    };
	    var connect = function () {
	        if (!shouldRetry) {
	            return;
	        }
	        log('connect');
	        var oldWs = ws;
	        var wsUrl = (typeof url === 'function') ? url() : url;
	        ws = new config.constructor(wsUrl, protocols);
	        connectingTimeout = setTimeout(function () {
	            log('timeout');
	            ws.close();
	            emitError('ETIMEDOUT', 'Connection timeout');
	        }, config.connectionTimeout);
	        log('bypass properties');
	        for (var key in ws) {
	            // @todo move to constant
	            if (['addEventListener', 'removeEventListener', 'close', 'send'].indexOf(key) < 0) {
	                bypassProperty(ws, _this, key);
	            }
	        }
	        ws.addEventListener('open', function () {
	            clearTimeout(connectingTimeout);
	            log('open');
	            reconnectDelay = initReconnectionDelay(config);
	            log('reconnectDelay:', reconnectDelay);
	            retriesCount = 0;
	        });
	        ws.addEventListener('close', handleClose);
	        reassignEventListeners(ws, oldWs, listeners);
	        // because when closing with fastClose=true, it is saved and set to null to avoid double calls
	        ws.onclose = ws.onclose || savedOnClose;
	        savedOnClose = null;
	    };
	    log('init');
	    connect();
	    this.close = function (code, reason, _a) {
	        if (code === void 0) { code = 1000; }
	        if (reason === void 0) { reason = ''; }
	        var _b = _a === void 0 ? {} : _a, _c = _b.keepClosed, keepClosed = _c === void 0 ? false : _c, _d = _b.fastClose, fastClose = _d === void 0 ? true : _d, _e = _b.delay, delay = _e === void 0 ? 0 : _e;
	        log('close - params:', { reason: reason, keepClosed: keepClosed, fastClose: fastClose, delay: delay, retriesCount: retriesCount, maxRetries: config.maxRetries });
	        shouldRetry = !keepClosed && retriesCount <= config.maxRetries;
	        if (delay) {
	            reconnectDelay = delay;
	        }
	        ws.close(code, reason);
	        if (fastClose) {
	            var fakeCloseEvent_1 = {
	                code: code,
	                reason: reason,
	                wasClean: true,
	            };
	            // execute close listeners soon with a fake closeEvent
	            // and remove them from the WS instance so they
	            // don't get fired on the real close.
	            handleClose();
	            ws.removeEventListener('close', handleClose);
	            // run and remove level2
	            if (Array.isArray(listeners.close)) {
	                listeners.close.forEach(function (_a) {
	                    var listener = _a[0], options = _a[1];
	                    listener(fakeCloseEvent_1);
	                    ws.removeEventListener('close', listener, options);
	                });
	            }
	            // run and remove level0
	            if (ws.onclose) {
	                savedOnClose = ws.onclose;
	                ws.onclose(fakeCloseEvent_1);
	                ws.onclose = null;
	            }
	        }
	    };
	    this.send = function (data) {
	        ws.send(data);
	    };
	    this.addEventListener = function (type, listener, options) {
	        if (Array.isArray(listeners[type])) {
	            if (!listeners[type].some(function (_a) {
	                var l = _a[0];
	                return l === listener;
	            })) {
	                listeners[type].push([listener, options]);
	            }
	        }
	        else {
	            listeners[type] = [[listener, options]];
	        }
	        ws.addEventListener(type, listener, options);
	    };
	    this.removeEventListener = function (type, listener, options) {
	        if (Array.isArray(listeners[type])) {
	            listeners[type] = listeners[type].filter(function (_a) {
	                var l = _a[0];
	                return l !== listener;
	            });
	        }
	        ws.removeEventListener(type, listener, options);
	    };
	};
	var dist = ReconnectingWebsocket;

	var EventEmitter = createCommonjsModule(function (module) {
	(function (exports) {

	    /**
	     * Class for managing events.
	     * Can be extended to provide event functionality in other classes.
	     *
	     * @class EventEmitter Manages event registering and emitting.
	     */
	    function EventEmitter() {}

	    // Shortcuts to improve speed and size
	    var proto = EventEmitter.prototype;
	    var originalGlobalValue = exports.EventEmitter;

	    /**
	     * Finds the index of the listener for the event in its storage array.
	     *
	     * @param {Function[]} listeners Array of listeners to search through.
	     * @param {Function} listener Method to look for.
	     * @return {Number} Index of the specified listener, -1 if not found
	     * @api private
	     */
	    function indexOfListener(listeners, listener) {
	        var i = listeners.length;
	        while (i--) {
	            if (listeners[i].listener === listener) {
	                return i;
	            }
	        }

	        return -1;
	    }

	    /**
	     * Alias a method while keeping the context correct, to allow for overwriting of target method.
	     *
	     * @param {String} name The name of the target method.
	     * @return {Function} The aliased method
	     * @api private
	     */
	    function alias(name) {
	        return function aliasClosure() {
	            return this[name].apply(this, arguments);
	        };
	    }

	    /**
	     * Returns the listener array for the specified event.
	     * Will initialise the event object and listener arrays if required.
	     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	     * Each property in the object response is an array of listener functions.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Function[]|Object} All listener functions for the event.
	     */
	    proto.getListeners = function getListeners(evt) {
	        var events = this._getEvents();
	        var response;
	        var key;

	        // Return a concatenated array of all matching events if
	        // the selector is a regular expression.
	        if (evt instanceof RegExp) {
	            response = {};
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    response[key] = events[key];
	                }
	            }
	        }
	        else {
	            response = events[evt] || (events[evt] = []);
	        }

	        return response;
	    };

	    /**
	     * Takes a list of listener objects and flattens it into a list of listener functions.
	     *
	     * @param {Object[]} listeners Raw listener objects.
	     * @return {Function[]} Just the listener functions.
	     */
	    proto.flattenListeners = function flattenListeners(listeners) {
	        var flatListeners = [];
	        var i;

	        for (i = 0; i < listeners.length; i += 1) {
	            flatListeners.push(listeners[i].listener);
	        }

	        return flatListeners;
	    };

	    /**
	     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Object} All listener functions for an event in an object.
	     */
	    proto.getListenersAsObject = function getListenersAsObject(evt) {
	        var listeners = this.getListeners(evt);
	        var response;

	        if (listeners instanceof Array) {
	            response = {};
	            response[evt] = listeners;
	        }

	        return response || listeners;
	    };

	    function isValidListener (listener) {
	        if (typeof listener === 'function' || listener instanceof RegExp) {
	            return true
	        } else if (listener && typeof listener === 'object') {
	            return isValidListener(listener.listener)
	        } else {
	            return false
	        }
	    }

	    /**
	     * Adds a listener function to the specified event.
	     * The listener will not be added if it is a duplicate.
	     * If the listener returns true then it will be removed after it is called.
	     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListener = function addListener(evt, listener) {
	        if (!isValidListener(listener)) {
	            throw new TypeError('listener must be a function');
	        }

	        var listeners = this.getListenersAsObject(evt);
	        var listenerIsWrapped = typeof listener === 'object';
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
	                listeners[key].push(listenerIsWrapped ? listener : {
	                    listener: listener,
	                    once: false
	                });
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of addListener
	     */
	    proto.on = alias('addListener');

	    /**
	     * Semi-alias of addListener. It will add a listener that will be
	     * automatically removed after its first execution.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addOnceListener = function addOnceListener(evt, listener) {
	        return this.addListener(evt, {
	            listener: listener,
	            once: true
	        });
	    };

	    /**
	     * Alias of addOnceListener.
	     */
	    proto.once = alias('addOnceListener');

	    /**
	     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	     * You need to tell it what event names should be matched by a regex.
	     *
	     * @param {String} evt Name of the event to create.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvent = function defineEvent(evt) {
	        this.getListeners(evt);
	        return this;
	    };

	    /**
	     * Uses defineEvent to define multiple events.
	     *
	     * @param {String[]} evts An array of event names to define.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvents = function defineEvents(evts) {
	        for (var i = 0; i < evts.length; i += 1) {
	            this.defineEvent(evts[i]);
	        }
	        return this;
	    };

	    /**
	     * Removes a listener function from the specified event.
	     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to remove the listener from.
	     * @param {Function} listener Method to remove from the event.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListener = function removeListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var index;
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key)) {
	                index = indexOfListener(listeners[key], listener);

	                if (index !== -1) {
	                    listeners[key].splice(index, 1);
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of removeListener
	     */
	    proto.off = alias('removeListener');

	    /**
	     * Adds listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the first argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	     * You can also pass it a regular expression to add the array of listeners to all events that match it.
	     * Yeah, this function does quite a bit. That's probably a bad thing.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListeners = function addListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(false, evt, listeners);
	    };

	    /**
	     * Removes listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the first argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be removed.
	     * You can also pass it a regular expression to remove the listeners from all events that match it.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListeners = function removeListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(true, evt, listeners);
	    };

	    /**
	     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	     * The first argument will determine if the listeners are removed (true) or added (false).
	     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added/removed.
	     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	     *
	     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
	        var i;
	        var value;
	        var single = remove ? this.removeListener : this.addListener;
	        var multiple = remove ? this.removeListeners : this.addListeners;

	        // If evt is an object then pass each of its properties to this method
	        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
	            for (i in evt) {
	                if (evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if (typeof value === 'function') {
	                        single.call(this, i, value);
	                    }
	                    else {
	                        // Otherwise pass back to the multiple function
	                        multiple.call(this, i, value);
	                    }
	                }
	            }
	        }
	        else {
	            // So evt must be a string
	            // And listeners must be an array of listeners
	            // Loop over it and pass each one to the multiple method
	            i = listeners.length;
	            while (i--) {
	                single.call(this, evt, listeners[i]);
	            }
	        }

	        return this;
	    };

	    /**
	     * Removes all listeners from a specified event.
	     * If you do not specify an event then all listeners will be removed.
	     * That means every event will be emptied.
	     * You can also pass a regex to remove all events that match it.
	     *
	     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeEvent = function removeEvent(evt) {
	        var type = typeof evt;
	        var events = this._getEvents();
	        var key;

	        // Remove different things depending on the state of evt
	        if (type === 'string') {
	            // Remove all listeners for the specified event
	            delete events[evt];
	        }
	        else if (evt instanceof RegExp) {
	            // Remove all events matching the regex.
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    delete events[key];
	                }
	            }
	        }
	        else {
	            // Remove all listeners in all events
	            delete this._events;
	        }

	        return this;
	    };

	    /**
	     * Alias of removeEvent.
	     *
	     * Added to mirror the node API.
	     */
	    proto.removeAllListeners = alias('removeEvent');

	    /**
	     * Emits an event of your choice.
	     * When emitted, every listener attached to that event will be executed.
	     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	     * So they will not arrive within the array on the other side, they will be separate.
	     * You can also pass a regular expression to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {Array} [args] Optional array of arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emitEvent = function emitEvent(evt, args) {
	        var listenersMap = this.getListenersAsObject(evt);
	        var listeners;
	        var listener;
	        var i;
	        var key;
	        var response;

	        for (key in listenersMap) {
	            if (listenersMap.hasOwnProperty(key)) {
	                listeners = listenersMap[key].slice(0);

	                for (i = 0; i < listeners.length; i++) {
	                    // If the listener returns true then it shall be removed from the event
	                    // The function is executed either with a basic call or an apply if there is an args array
	                    listener = listeners[i];

	                    if (listener.once === true) {
	                        this.removeListener(evt, listener.listener);
	                    }

	                    response = listener.listener.apply(this, args || []);

	                    if (response === this._getOnceReturnValue()) {
	                        this.removeListener(evt, listener.listener);
	                    }
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of emitEvent
	     */
	    proto.trigger = alias('emitEvent');

	    /**
	     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {...*} Optional additional arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emit = function emit(evt) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return this.emitEvent(evt, args);
	    };

	    /**
	     * Sets the current value to check against when executing listeners. If a
	     * listeners return value matches the one set here then it will be removed
	     * after execution. This value defaults to true.
	     *
	     * @param {*} value The new value to check for when executing listeners.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.setOnceReturnValue = function setOnceReturnValue(value) {
	        this._onceReturnValue = value;
	        return this;
	    };

	    /**
	     * Fetches the current value to check against when executing listeners. If
	     * the listeners return value matches this one then it should be removed
	     * automatically. It will return true by default.
	     *
	     * @return {*|Boolean} The current value to check for or the default, true.
	     * @api private
	     */
	    proto._getOnceReturnValue = function _getOnceReturnValue() {
	        if (this.hasOwnProperty('_onceReturnValue')) {
	            return this._onceReturnValue;
	        }
	        else {
	            return true;
	        }
	    };

	    /**
	     * Fetches the events object and creates one if required.
	     *
	     * @return {Object} The events storage object.
	     * @api private
	     */
	    proto._getEvents = function _getEvents() {
	        return this._events || (this._events = {});
	    };

	    /**
	     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	     *
	     * @return {Function} Non conflicting EventEmitter class.
	     */
	    EventEmitter.noConflict = function noConflict() {
	        exports.EventEmitter = originalGlobalValue;
	        return EventEmitter;
	    };

	    // Expose the class either via AMD, CommonJS or the global object
	    if ( module.exports){
	        module.exports = EventEmitter;
	    }
	    else {
	        exports.EventEmitter = EventEmitter;
	    }
	}(typeof window !== 'undefined' ? window : commonjsGlobal || {}));
	});

	// Process recaptcha input and inits SDK
	var verifyCallback = function (response) {
	};
	// register Recaptcha global onload callback
	window.addEventListener("load", function () {
	    verifyCallback.call(window.pwd);
	});
	function registerInputHandlers(termName, instance) {
	    var _this = this;
	    var self = this;
	    // Attach block actions
	    var actions = document.querySelectorAll('code[class*="' + termName + '"]');
	    for (var n = 0; n < actions.length; ++n) {
	        actions[n].addEventListener("click", function () {
	            self.socket.emit("instance terminal in", instance.name, _this.innerText);
	        });
	    }
	}
	function registerPortHandlers(termName, instance) {
	    var _this = this;
	    var self = this;
	    // Attach block actions
	    var actions = document.querySelectorAll('[data-term*="' + termName + '"]');
	    for (var n = 0; n < actions.length; ++n) {
	        var anchor = actions[n];
	        var port = anchor.getAttribute("data-port");
	        var protocol = anchor.getAttribute("data-protocol") || "http:";
	        var link;
	        if (port) {
	            link =
	                protocol +
	                    "//" +
	                    instance.proxy_host +
	                    "-" +
	                    port +
	                    ".direct." +
	                    self.opts.baseUrl.split("/")[2] +
	                    anchor.getAttribute("href");
	        }
	        var openFn = function (link) {
	            return function (evt) {
	                evt.preventDefault();
	                if (link) {
	                    window.open(link, "_blank");
	                }
	            };
	        };
	        anchor.addEventListener("click", function () { return openFn(link); });
	        // anchor.onauxclick = openFn(link);
	        anchor.addEventListener("contextmenu", function () {
	            if (link) {
	                _this.setAttribute("href", link);
	            }
	        });
	    }
	}
	// PWD instance
	var pwd = function () {
	    this.instances = {};
	    this.instanceBuffer = {};
	    return;
	};
	pwd.prototype = Object.create(EventEmitter.prototype);
	pwd.prototype.constructor = pwd;
	function setOpts(opts) {
	    var opts = opts || {};
	    this.opts = opts;
	    this.opts.baseUrl = this.opts.baseUrl || "https://labs.play-with-docker.com";
	    this.opts.ports = this.opts.ports || [];
	    this.opts.ImageName = this.opts.ImageName || "";
	    this.opts.oauthProvider = this.opts.oauthProvider || "docker";
	}
	pwd.prototype.login = function (cb) {
	    var self = this;
	    var width = screen.width * 0.6;
	    var height = screen.height * 0.6;
	    var x = screen.width / 2 - width / 2;
	    var y = screen.height / 2 - height / 2;
	    // display login btn in 1st terminal only
	    var term = window.pwd.terms[0];
	    var els = document.querySelectorAll(term.selector);
	    var loginBtn = document.createElement("input");
	    loginBtn.type = "button";
	    loginBtn.value = "Log-in to access";
	    loginBtn.className = "btn btn-lg btn-primary";
	    loginBtn.onclick = function () {
	        window.open(self.opts.baseUrl +
	            "/oauth/providers/" +
	            self.opts.oauthProvider +
	            "/login", "PWDLogin", "width=" + width + ",height=" + height + ",left=" + x + ",top=" + y);
	        var eventMethod = window.addEventListener
	            ? "addEventListener"
	            : "attachEvent";
	        var eventer = window[eventMethod];
	        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	        // Listen to message from child window
	        eventer(messageEvent, function (e) {
	            if (e.data === "done") {
	                els[0].removeChild(loginBtn);
	                cb();
	            }
	        }, false);
	    };
	    els[0].appendChild(loginBtn);
	};
	pwd.prototype.createSession = function (cb) {
	    var self = this;
	    sendRequest({
	        method: "POST",
	        url: this.opts.baseUrl + "/",
	        opts: {
	            headers: { "Content-type": "application/x-www-form-urlencoded" }
	        },
	        data: encodeURIComponent("session-duration") +
	            "=" +
	            encodeURIComponent("90m")
	    }, function (resp) {
	        //TODO handle errors
	        if (resp.status == 200) {
	            self.emitEvent("init");
	            var sessionData = JSON.parse(resp.responseText);
	            // fetch current scheme from opts to use in the new session hostname
	            self.opts.baseUrl =
	                self.opts.baseUrl.split("/")[0] + "//" + sessionData.hostname;
	            self.init(sessionData.session_id, self.opts, function () {
	                self.terms.forEach(function (term) {
	                    // Create terminals only for those elements that exist at least once in the DOM
	                    if (document.querySelector(term.selector)) {
	                        self.terminal(term);
	                    }
	                });
	                cb();
	            });
	        }
	        else if (resp.status == 403) {
	            //TODO login should return error and handle it
	            self.login(function () {
	                self.createSession(cb);
	            });
	        }
	    });
	};
	pwd.prototype.closeSession = function (callback) {
	    if (this.sessionId) {
	        sendRequest({
	            method: "DELETE",
	            url: this.opts.baseUrl + "/sessions/" + this.sessionId,
	            opts: { headers: { "Content-type": "application/json" } },
	            sync: true
	        }, function (response) {
	            if (response.status == 200) {
	                callback();
	            }
	            else {
	                callback(new Error("Error deleting session"));
	            }
	        });
	    }
	};
	pwd.prototype.getUserInfo = function (callback) {
	    sendRequest({
	        method: "GET",
	        url: this.opts.baseUrl + "/users/me",
	        opts: { headers: { "Content-type": "application/json" } }
	    }, function (response) {
	        if (response.status == 200) {
	            var u = JSON.parse(response.responseText);
	            callback(u);
	        }
	        else {
	            callback(undefined);
	        }
	    });
	};
	pwd.prototype.newSession = function (terms, opts, callback) {
	    setOpts.call(this, opts);
	    terms = terms || [];
	    if (terms.length > 0) {
	        this.terms = terms;
	        this.createSession(function (err) {
	            if (err) {
	                console.warn("Could not create session");
	            }
	            !callback || callback();
	        });
	    }
	    else {
	        console.warn("No terms specified, nothing to do.");
	    }
	};
	// your sdk init function
	pwd.prototype.init = function (sessionId, opts, callback) {
	    var self = this;
	    setOpts.call(this, opts);
	    this.sessionId = sessionId;
	    var l = document.createElement("a");
	    l.href = this.opts.baseUrl;
	    this.socket = new dist((l.protocol === "http:" ? "ws://" : "wss://") +
	        l.host +
	        "/sessions/" +
	        sessionId +
	        "/ws/");
	    this.socket.listeners = {};
	    this.socket.on = function (name, cb) {
	        if (!self.socket.listeners[name]) {
	            self.socket.listeners[name] = [];
	        }
	        self.socket.listeners[name].push(cb);
	    };
	    this.socket.emit = function () {
	        var name = arguments[0];
	        var args = [];
	        for (var i = 1; i < arguments.length; i++) {
	            args.push(arguments[i]);
	        }
	        self.socket.send(JSON.stringify({ name: name, args: args }));
	    };
	    this.socket.addEventListener("message", function (event) {
	        var m = JSON.parse(event.data);
	        var ls = self.socket.listeners[m.name];
	        if (ls) {
	            for (var i = 0; i < ls.length; i++) {
	                var l = ls[i];
	                l.apply(l, m.args);
	            }
	        }
	    });
	    this.socket.on("instance terminal out", function (name, data) {
	        var instance = self.instances[name];
	        if (instance && instance.terms) {
	            instance.terms.forEach(function (term) {
	                term.write(data);
	            });
	        }
	        else {
	            //Buffer the data if term is not ready
	            if (self.instanceBuffer[name] == undefined)
	                self.instanceBuffer[name] = "";
	            self.instanceBuffer[name] += data;
	        }
	    });
	    // Resize all terminals
	    this.socket.on("instance viewport resize", function (cols, rows) {
	        // Resize all terminals
	        for (var name in self.instances) {
	            self.instances[name].terms.forEach(function (term) {
	                term.resize(cols, rows);
	            });
	        }
	    });
	    // Handle window resizing
	    window.onresize = function () {
	        self.resize();
	    };
	    sendRequest({
	        method: "GET",
	        url: this.opts.baseUrl + "/sessions/" + sessionId
	    }, function (response) {
	        var session = JSON.parse(response.responseText);
	        for (var name in session.instances) {
	            var i = session.instances[name];
	            // Setup empty terms
	            i.terms = [];
	            self.instances[name] = i;
	        }
	        !callback || callback();
	    });
	};
	pwd.prototype.resize = function () {
	    var name = Object.keys(this.instances)[0];
	    for (var n in this.instances) {
	        // there might be some instances without terminals
	        if (this.instances[n].terms) {
	            for (var i = 0; i < this.instances[n].terms.length; i++) {
	                var term = this.instances[n].terms[i];
	                var size = term.proposeGeometry();
	                if (size.cols && size.rows) {
	                    return this.socket.emit("instance viewport resize", size.cols, size.rows);
	                }
	            }
	        }
	    }
	};
	// I know, opts and data can be ommited. I'm not a JS developer =(
	// Data needs to be sent encoded appropriately
	function sendRequest(req, callback) {
	    var request = new XMLHttpRequest();
	    var asyncReq = !req.sync;
	    request.open(req.method, req.url, asyncReq);
	    if (req.opts && req.opts.headers) {
	        for (var key in req.opts.headers) {
	            request.setRequestHeader(key, req.opts.headers[key]);
	        }
	    }
	    request.withCredentials = true;
	    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	    request.onload = function () {
	        callback(request);
	    };
	    if (typeof req.data === "object" && req.data.constructor.name != "FormData") {
	        request.send(JSON.stringify(req.data));
	    }
	    else {
	        request.send(req.data);
	    }
	}
	pwd.prototype.createInstance = function (opts, callback) {
	    var self = this;
	    opts.ImageName = opts.ImageName || self.opts.ImageName;
	    //TODO handle http connection errors
	    sendRequest({
	        method: "POST",
	        url: self.opts.baseUrl + "/sessions/" + this.sessionId + "/instances",
	        opts: { headers: { "Content-type": "application/json" } },
	        data: opts
	    }, function (response) {
	        if (response.status == 200) {
	            var i = JSON.parse(response.responseText);
	            i.terms = [];
	            self.instances[i.name] = i;
	            callback(undefined, i);
	        }
	        else if (response.status == 409) {
	            var err = new Error();
	            err.max = true;
	            callback(err);
	        }
	        else {
	            callback(new Error());
	        }
	    });
	};
	pwd.prototype.upload = function (name, data, callback) {
	    var self = this;
	    sendRequest({
	        method: "POST",
	        url: self.opts.baseUrl +
	            "/sessions/" +
	            this.sessionId +
	            "/instances/" +
	            name +
	            "/uploads",
	        opts: {},
	        data: data
	    }, function (response) {
	        if (response.status == 200) {
	            if (callback) {
	                callback(undefined);
	            }
	        }
	        else {
	            if (callback) {
	                callback(new Error());
	            }
	        }
	    });
	};
	pwd.prototype.setup = function (data, callback) {
	    var self = this;
	    sendRequest({
	        method: "POST",
	        url: self.opts.baseUrl + "/sessions/" + this.sessionId + "/setup",
	        opts: { headers: { "Content-type": "application/json" } },
	        data: data
	    }, function (response) {
	        if (response.status == 200) {
	            if (callback) {
	                callback(undefined);
	            }
	        }
	        else {
	            if (callback) {
	                callback(new Error());
	            }
	        }
	    });
	};
	pwd.prototype.exec = function (name, data, callback) {
	    var self = this;
	    sendRequest({
	        method: "POST",
	        url: self.opts.baseUrl +
	            "/sessions/" +
	            this.sessionId +
	            "/instances/" +
	            name +
	            "/exec",
	        opts: { headers: { "Content-type": "application/json" } },
	        data: { command: data }
	    }, function (response) {
	        if (response.status == 200) {
	            if (callback) {
	                callback(undefined);
	            }
	        }
	        else {
	            if (callback) {
	                callback(new Error());
	            }
	        }
	    });
	};
	pwd.prototype.createTerminal = function (term, name) {
	    var self = this;
	    var i = this.instances[name];
	    term.name = term.name || term.selector;
	    var elements = document.querySelectorAll(term.selector);
	    for (var n = 0; n < elements.length; ++n) {
	        var t = new Terminal({ cursorBlink: false });
	        t.open(elements[n], { focus: true });
	        t.on("data", function (d) {
	            self.socket.emit("instance terminal in", i.name, d);
	        });
	        if (!i.terms) {
	            i.terms = [];
	        }
	        i.terms.push(t);
	        self.resize();
	    }
	    registerPortHandlers.call(self, term.selector, i);
	    registerInputHandlers.call(self, term.selector, i);
	    if (self.instanceBuffer[name]) {
	        //Flush buffer and clear it
	        i.terms.forEach(function (term) {
	            term.write(self.instanceBuffer[name]);
	        });
	        self.instanceBuffer[name] = "";
	    }
	    return i.terms;
	};
	pwd.prototype.terminal = function (term, callback) {
	    var self = this;
	    var hostname = "node" + (this.terms.indexOf(term) + 1);
	    this.createInstance({ type: term.type, Hostname: hostname }, function (err, instance) {
	        if (err && err.max) {
	            !callback || callback(new Error("Max instances reached"));
	            return;
	        }
	        else if (err) {
	            !callback || callback(new Error("Error creating instance"));
	            return;
	        }
	        self.createTerminal(term, instance.name);
	        !callback || callback(undefined, instance);
	    });
	};

	return pwd;

})));
