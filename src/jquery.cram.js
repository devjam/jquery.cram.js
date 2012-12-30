/*
jQuery.cram.js v0.3.6

Copyright (c) Devjam / SHIFTBRAIN INC.
Licensed under the MIT license.
https://github.com/devjam
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function(jQuery) {
    var $, cram, document;
    document = window.document;
    $ = jQuery;
    cram = (function() {

      cram.defaultConfig = {
        itemSelector: "*",
        cellWidth: 100,
        cellHeight: 10,
        marginWidth: 20,
        marginHeight: 20,
        isWindowResizeUpdate: true,
        isAutoLayout: true,
        isDrawSpace: false,
        animation: {
          delayEach: 0,
          duration: 0,
          ease: null
        }
      };

      function cram(config, width, list, callback) {
        this.getSpace = __bind(this.getSpace, this);

        this.searchPosOnGrid = __bind(this.searchPosOnGrid, this);

        this.setOnGrid = __bind(this.setOnGrid, this);

        this.makeGrids = __bind(this.makeGrids, this);

        this.initList = __bind(this.initList, this);

        this.updated = __bind(this.updated, this);

        this.updateEachItem = __bind(this.updateEachItem, this);

        this.getData = __bind(this.getData, this);

        this.setOptions = __bind(this.setOptions, this);

        var o;
        this.options = $.extend(true, null, cram.defaultConfig, config);
        o = this.options;
        o.eWidth = o.cellWidth + o.marginWidth;
        o.eHeight = o.cellHeight + o.marginHeight;
        this.nowUpdate = false;
        if ((width != null) && (list != null) && (callback != null)) {
          this.getData(width, list, callback);
        }
      }

      cram.prototype.setOptions = function(config) {
        var o;
        this.options = $.extend(true, this.options, config);
        o = this.options;
        o.eWidth = o.cellWidth + o.marginWidth;
        return o.eHeight = o.cellHeight + o.marginHeight;
      };

      cram.prototype.getData = function(width, list, callback) {
        var cols1, cols2, o;
        if ((width != null) && (list != null) && (callback != null)) {
          this.callback = callback;
          if (this.nowUpdate && (this.list != null)) {
            this.updated();
            return;
          }
          o = this.options;
          this.nowUpdate = true;
          this.max_offx = 0;
          this.max_offy = 0;
          this.startRow = 0;
          this.itemNum = 0;
          this.list_temp = [];
          this.map = [];
          this.list_temp = this.initList(list);
          cols1 = ((width + o.marginWidth) / o.eWidth) << 0;
          cols2 = Math.ceil(this.itemWidthMax / o.eWidth);
          this.cols = Math.max(cols1, cols2);
          this.map = this.makeGrids();
          return this.tempTimer = setTimeout(this.updateEachItem, 0);
        }
      };

      cram.prototype.updateEachItem = function() {
        var item;
        clearTimeout(this.tempTimer);
        if (this.itemNum < this.list_temp.length) {
          item = this.list_temp[this.itemNum];
          if ((item.x != null) && (item.y != null)) {
            this.map = this.setOnGrid(this.map, item);
          } else {
            this.map = this.searchPosOnGrid(this.map, item);
          }
          this.itemNum++;
          return this.tempTimer = setTimeout(this.updateEachItem, 0);
        } else {
          this.list = this.list_temp;
          return this.tempTimer = setTimeout(this.updated, 0);
        }
      };

      cram.prototype.updated = function() {
        var areaWidth, data, o;
        clearTimeout(this.tempTimer);
        o = this.options;
        areaWidth = this.cols * o.eWidth - o.marginWidth;
        data = {};
        data.area = {
          width: areaWidth,
          height: this.areaHeight
        };
        data.items = this.list;
        if (o.isDrawSpace) {
          data.spaces = this.getSpace(this.map.slice(0, this.max_offy + 1));
        }
        this.nowUpdate = false;
        return this.callback(data);
      };

      cram.prototype.initList = function(list) {
        var h, i, isListFlg, item, l, new_list, new_list_fix, new_list_free, o, w;
        this.itemWidthMax = 0;
        o = this.options;
        l = list.length;
        if (l <= 0) {
          return [];
        }
        new_list = [];
        new_list_fix = [];
        new_list_free = [];
        isListFlg = false;
        if ((list[0].element != null) || (list[0].width != null)) {
          isListFlg = true;
        }
        i = 0;
        while (i < l) {
          if (isListFlg) {
            item = list[i];
          } else {
            item = {};
            item.element = list[i];
          }
          if (item.width == null) {
            item.width = $(item.element).outerWidth();
          }
          if (item.height == null) {
            item.height = $(item.element).outerHeight();
          }
          w = item.width + o.marginWidth;
          h = item.height + o.marginHeight;
          if (this.itemWidthMax < w) {
            this.itemWidthMax = w;
          }
          item.cols = Math.ceil(w / o.eWidth);
          item.rows = Math.ceil(h / o.cellHeight);
          if ((item.x != null) && (item.y != null)) {
            new_list_fix.push(item);
          } else {
            new_list_free.push(item);
          }
          i++;
        }
        return new_list = new_list_fix.concat(new_list_free);
      };

      cram.prototype.makeGrids = function() {
        var cols, i, j, l, line, matrix, rows;
        this.areaHeight = 0;
        matrix = [];
        cols = this.cols;
        l = this.list_temp.length;
        i = 0;
        rows = 1;
        while (i < l) {
          rows += this.list_temp[i].rows;
          i++;
        }
        l = rows;
        i = 0;
        while (i < l) {
          line = [];
          j = 0;
          while (j < cols) {
            line.push(0);
            j++;
          }
          matrix.push(line);
          i++;
        }
        return matrix;
      };

      cram.prototype.setOnGrid = function(matrix, item) {
        var col_i, col_l, o, offx, offy, row_i, row_l, tmpH;
        o = this.options;
        offx = (item.x / o.eWidth) << 0;
        offy = (item.y / o.cellHeight) << 0;
        row_l = matrix.length - offy;
        if (row_l > item.rows) {
          row_l = item.rows;
        }
        col_l = matrix[0].length - offx;
        if (col_l > item.cols) {
          col_l = item.cols;
        }
        item.rectWidth = item.cols * o.eWidth - o.marginWidth;
        item.rectHeight = item.rows * o.cellHeight - o.marginHeight;
        tmpH = offy * o.cellHeight + o.cellHeight * item.rows;
        if (tmpH > this.areaHeight) {
          this.areaHeight = tmpH;
        }
        row_i = 0;
        while (row_i < row_l) {
          col_i = 0;
          while (col_i < col_l) {
            matrix[offy + row_i][offx + col_i] = 1;
            col_i++;
          }
          row_i++;
        }
        return matrix;
      };

      cram.prototype.searchPosOnGrid = function(matrix, item) {
        var br, col_i, col_l, i, j, l, mcols, mrows, o, offx, offy, row_i, row_l, val;
        o = this.options;
        mcols = matrix[0].length - item.cols + 1;
        mrows = matrix.length;
        offx = 0;
        offy = 0;
        l = mrows;
        i = this.startRow;
        while (i < l) {
          br = matrix[i].join();
          if (br.indexOf("0") > -1) {
            i += l;
          } else {
            this.startRow++;
          }
          i++;
        }
        l = mrows - item.rows;
        i = this.startRow;
        while (i < l) {
          j = 0;
          while (j < mcols) {
            if (matrix[i][j] === 0) {
              row_l = item.rows;
              col_l = item.cols;
              row_i = i + row_l - 1;
              col_i = j + col_l - 1;
              if (matrix[row_i][col_i] === 0) {
                val = 0;
                row_i = 0;
                col_i = 0;
                while (col_i < col_l) {
                  val += matrix[i + row_i][j + col_i];
                  col_i++;
                }
                if (val === 0) {
                  row_i++;
                  while (row_i < row_l) {
                    col_i = 0;
                    while (col_i < col_l) {
                      val += matrix[i + row_i][j + col_i];
                      col_i++;
                    }
                    row_i++;
                  }
                  if (val === 0) {
                    offx = j;
                    offy = i;
                    if (offy > this.max_offy || (offx > this.max_offx && offy >= this.max_offy)) {
                      this.max_offx = offx;
                      this.max_offy = offy;
                    }
                    j += mcols;
                    i += mrows;
                  }
                }
              }
            }
            j++;
          }
          i++;
        }
        item.x = offx * o.eWidth;
        item.y = offy * o.cellHeight;
        return matrix = this.setOnGrid(matrix, item);
      };

      cram.prototype.getSpace = function(matrix) {
        var ary, cols, flg, i, j, m, o, obj, rows, ti, ti_l, tj, tj_l, v;
        o = this.options;
        ary = [];
        m = [];
        if (matrix.length < 1) {
          return ary;
        }
        cols = matrix[0].length;
        rows = matrix.length;
        i = 0;
        while (i < cols) {
          j = rows - 1;
          while (j >= 0) {
            v = matrix[j][i];
            if (v > 0) {
              j = -1;
            } else {
              matrix[j][i] = 1;
              j--;
            }
          }
          i++;
        }
        flg = true;
        while (flg && matrix.length > 0) {
          v = matrix[matrix.length - 1].join("");
          if (v.indexOf("0") !== -1) {
            flg = false;
          } else {
            matrix.pop();
          }
        }
        rows = matrix.length;
        i = 0;
        while (i < rows) {
          j = 0;
          while (j < cols) {
            if (matrix[i][j] === 0) {
              v = this.getSpaceRectSize(matrix, j, i);
              obj = {
                x: j * o.eWidth,
                y: i * o.cellHeight,
                cols: v.cols,
                rows: v.rows,
                width: v.cols * o.eWidth - o.marginWidth,
                height: v.rows * o.cellHeight - o.marginHeight
              };
              if (obj.width > 0 && obj.height > 0) {
                ary.push(obj);
              }
              tj_l = j + v.cols;
              ti_l = i + v.rows;
              ti = i;
              while (ti < ti_l) {
                tj = j;
                while (tj < tj_l) {
                  matrix[ti][tj] = 1;
                  tj++;
                }
                ti++;
              }
            }
            j++;
          }
          i++;
        }
        return ary;
      };

      cram.prototype.getSpaceRectSize = function(matrix, x, y) {
        var flg, h, i, l, tx, ty, w;
        w = 1;
        h = 1;
        i = x + 1;
        l = matrix[0].length;
        while (i < l) {
          if (matrix[y][i] > 0) {
            i += l;
          } else {
            w++;
            i++;
          }
        }
        l = w;
        flg = true;
        while (flg) {
          h++;
          i = 0;
          while (i < l) {
            tx = x + i;
            ty = y + h;
            if (ty >= matrix.length) {
              flg = false;
              i += l;
            } else {
              if (matrix[ty][tx] > 0) {
                flg = false;
                i += l;
              } else {
                i++;
              }
            }
          }
        }
        return {
          cols: w,
          rows: h
        };
      };

      return cram;

    })();
    $.fn.cram = function(config) {
      var options;
      options = $.extend(true, null, cram.defaultConfig, config);
      this.each(function() {
        var drawArea, drawItems, drawSpace, o, resize, startResize, updateDatas, updated,
          _this = this;
        $.fn.cram.setOptions = function(arg) {
          options = $.extend(true, options, arg);
          return null;
        };
        $.fn.cram.update = function() {
          var list, w;
          clearTimeout(_this.tempTimer);
          _this.nowUpdate = true;
          w = $(_this).parent().width();
          list = $(_this).children(options.itemSelector);
          return _this.cr = new cram(options, w, list, updateDatas);
        };
        $.fn.cram.getData = function() {
          return $.data(_this, "cram");
        };
        startResize = function() {
          if (!options.isWindowResizeUpdate || _this.nowUpdate) {
            return;
          }
          if (_this.resizeTimer != null) {
            clearTimeout(_this.resizeTimer);
          }
          return _this.resizeTimer = setTimeout(resize, 200);
        };
        resize = function() {
          var cols, o;
          if (_this.resizeTimer != null) {
            clearTimeout(_this.resizeTimer);
          }
          o = options;
          cols = ($(_this).parent().width() / o.eWidth) << 0;
          $(_this).children(o.itemSelector).each(function(i, el) {
            var c;
            c = Math.ceil($(el).outerWidth() / o.eWidth);
            if (c > cols) {
              return cols = c;
            }
          });
          if (cols === _this.cols) {
            return;
          }
          _this.cols = cols;
          return _this.tempTimer = setTimeout($(_this).cram.update, 0);
        };
        updateDatas = function(data) {
          var o, obj;
          o = options;
          $(".space").remove();
          obj = $.data(_this, "cram");
          obj.items = data.items;
          obj.spaces = data.spaces;
          obj.area = data.area;
          _this.tempTimer = setTimeout(function() {
            clearTimeout(_this.tempTimer);
            if (o.isAutoLayout) {
              drawItems(data.items, data.area.width);
              if (o.isDrawSpace) {
                drawSpace(data.spaces);
              }
              return drawArea(data.area.width, data.area.height);
            } else {
              return updated();
            }
          }, 0);
          return _this.cr = null;
        };
        updated = function() {
          $(_this).trigger("cram.update");
          return _this.tempTimer = setTimeout(function() {
            clearTimeout(_this.tempTimer);
            return _this.nowUpdate = false;
          }, 1);
        };
        drawItems = function(list, width) {
          var a, cols, d, i, item, l, o, style;
          o = options;
          a = o.animation;
          cols = (width / o.eWidth) << 0;
          l = list.length;
          i = 0;
          while (i < l) {
            item = list[i];
            style = {
              "top": item.y + "px",
              "left": item.x + "px"
            };
            d = a.delayEach * (cols * item.rows + item.cols);
            $(item.element).stop().queue([]);
            if (d > 0) {
              if (a.duration > 0) {
                $(item.element).delay(d).animate(style, a.duration, a.ease);
              } else {
                $(item.element).delay(d).css(style);
              }
            } else {
              if (a.duration > 0) {
                $(item.element).animate(style, a.duration, a.ease);
              } else {
                $(item.element).css(style);
              }
            }
            i++;
          }
          return null;
        };
        drawSpace = function(list) {
          var a, i, item, l, style;
          a = options.animation;
          l = list.length;
          i = 0;
          while (i < l) {
            item = list[i];
            $(_this).append('<li class="space"></li>');
            style = {
              "top": item.y + "px",
              "left": item.x + "px",
              "width": item.width + "px",
              "height": item.height + "px"
            };
            $(".space:last").css(style);
            i++;
            if (a.duration > 0) {
              $(".space").css("display", "none");
              $(".space").delay(a.duration * 0.8).fadeIn(a.duration * 0.8, a.ease);
            }
          }
          return null;
        };
        drawArea = function(w, h) {
          var a, style;
          a = options.animation;
          $(_this).stop().queue([]);
          style = {
            "width": w + "px",
            "height": h + "px"
          };
          if (a.duration > 0) {
            $(_this).animate(style, a.duration, a.ease, updated);
          } else {
            $(_this).css(style);
            updated();
          }
          return null;
        };
        $.data(this, "cram", {});
        this.list = [];
        o = options;
        o.eWidth = o.cellWidth + o.marginWidth;
        o.eHeight = o.cellHeight + o.marginHeight;
        this.cols = 0;
        this.resizeTimer = null;
        this.nowUpdate = false;
        return $(window).bind("resize", startResize);
      });
      return this;
    };
    return this.cram = cram;
  })(jQuery);

}).call(this);
