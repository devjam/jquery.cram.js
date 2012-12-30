###
jQuery.cram.js v0.3.6

Copyright (c) Devjam / SHIFTBRAIN INC.
Licensed under the MIT license.
https://github.com/devjam
###
do (jQuery) ->
	document = window.document
	$ = jQuery

	class cram
		@defaultConfig :
			itemSelector : "*"
			cellWidth : 100
			cellHeight : 10
			marginWidth : 20 
			marginHeight : 20
			isWindowResizeUpdate : true
			isAutoLayout : true
			isDrawSpace : false
			animation :
				delayEach : 0
				duration : 0
				ease : null

		constructor: (config, width, list, callback)->
			@options = $.extend true, null, cram.defaultConfig, config
			o = @options
			o.eWidth = o.cellWidth + o.marginWidth
			o.eHeight = o.cellHeight + o.marginHeight
			@nowUpdate = false

			if width? and list? and callback?
				@getData width, list, callback

		setOptions: (config)=>
			@options = $.extend true, @options, config
			o = @options
			o.eWidth = o.cellWidth + o.marginWidth
			o.eHeight = o.cellHeight + o.marginHeight

		getData: (width, list, callback)=>
			if width? and list? and callback?
				@callback = callback
				if @nowUpdate and @list?
					@updated()
					return

				o = @options
				@nowUpdate = true
				@max_offx = 0
				@max_offy = 0
				@startRow = 0
				@itemNum = 0
				#
				@list_temp = []
				@map = []
				@list_temp = @initList list
				cols1 = ((width + o.marginWidth) / o.eWidth)<<0
				cols2 = Math.ceil @itemWidthMax / o.eWidth
				@cols = Math.max cols1, cols2

				@map = @makeGrids()
				@tempTimer = setTimeout @updateEachItem, 0

		updateEachItem: =>
			clearTimeout @tempTimer
			if @itemNum < @list_temp.length
				item = @list_temp[@itemNum]
				if item.x? and item.y?
					@map = @setOnGrid @map, item
				else
					@map = @searchPosOnGrid @map, item
				@itemNum++
				@tempTimer = setTimeout @updateEachItem, 0
			else
				@list = @list_temp
				@tempTimer = setTimeout @updated, 0

		updated: =>
			clearTimeout @tempTimer
			o = @options
			areaWidth = @cols * o.eWidth - o.marginWidth
			data = {}
			data.area = 
				width: areaWidth
				height:@areaHeight
			data.items = @list
			if o.isDrawSpace
				data.spaces = @getSpace @map.slice(0, @max_offy+1)

			@nowUpdate = false
			@callback(data)

		#-------------------------------------------
		initList: (list)=>
			@itemWidthMax = 0
			o = @options
			l = list.length
			if l <= 0
				return []

			new_list = []
			new_list_fix = []
			new_list_free = []
			isListFlg = false
			if list[0].element? or list[0].width?
				isListFlg = true

			i = 0
			while i < l
				if isListFlg
					item = list[i]
				else
					item = {}
					item.element = list[i]

				unless item.width?
					item.width = $(item.element).outerWidth()
				unless item.height?
					item.height = $(item.element).outerHeight()

				w = item.width + o.marginWidth
				h = item.height + o.marginHeight
				if @itemWidthMax < w
					@itemWidthMax = w
				item.cols = Math.ceil w / o.eWidth
				item.rows = Math.ceil h / o.cellHeight
				if item.x? and item.y?
					new_list_fix.push item
				else
					new_list_free.push item
				i++

			new_list = new_list_fix.concat(new_list_free)

		makeGrids: =>
			@areaHeight = 0
			matrix = []
			cols = @cols

			l = @list_temp.length
			i = 0
			rows = 1
			while i < l
				rows += @list_temp[i].rows
				i++

			l = rows
			i = 0
			while i < l
				line = []
				j = 0
				while j < cols
					line.push 0
					j++
				matrix.push line
				i++
			matrix

		setOnGrid: (matrix, item)=>
			o = @options
			offx = (item.x / o.eWidth)<<0
			offy = (item.y / o.cellHeight)<<0
			row_l = matrix.length - offy
			if row_l > item.rows
				row_l = item.rows
			col_l = matrix[0].length - offx
			if col_l > item.cols
				col_l = item.cols
			item.rectWidth = item.cols * o.eWidth - o.marginWidth
			item.rectHeight = item.rows * o.cellHeight - o.marginHeight

			tmpH = offy * o.cellHeight + o.cellHeight * item.rows
			if tmpH > @areaHeight
				@areaHeight = tmpH

			row_i = 0
			while row_i < row_l
				col_i = 0
				while col_i < col_l
					matrix[offy + row_i][offx + col_i] = 1
					col_i++
				row_i++

			matrix

		searchPosOnGrid: (matrix, item)=>
			o = @options
			mcols = matrix[0].length - item.cols + 1
			mrows = matrix.length
			offx = 0
			offy = 0
			l = mrows
			i = @startRow
			while i < l
				br = matrix[i].join()
				if br.indexOf("0") > -1
					i += l
				else
					@startRow++
				i++

			l = mrows - item.rows
			i = @startRow
			while i < l
				j = 0
				while j < mcols
					#左上1マス空き確認
					if matrix[i][j] == 0
						#右下1マス空き確認
						row_l = item.rows
						col_l = item.cols
						row_i = i + row_l - 1
						col_i = j + col_l - 1
						if matrix[row_i][col_i] == 0
							val = 0
							#コンテンツ分の空きがあるか確認
							row_i = 0
							col_i = 0
							while col_i < col_l
								val += matrix[i + row_i][j + col_i]
								col_i++
							if val == 0
								row_i++
								while row_i < row_l
									col_i = 0
									while col_i < col_l
										val += matrix[i + row_i][j + col_i]
										col_i++
									row_i++

								if val == 0
									#空き領域あり
									#位置決定
									offx = j
									offy = i

									if offy > @max_offy or (offx > @max_offx and offy >= @max_offy)
										@max_offx = offx
										@max_offy = offy

									j += mcols
									i += mrows

					j++
				i++

			item.x = offx * o.eWidth
			item.y = offy * o.cellHeight
			matrix = @setOnGrid(matrix, item)

		getSpace: (matrix)=>
			o = @options
			ary = []
			m = []
			if matrix.length < 1
				return ary

			cols = matrix[0].length

			# 計算の必要ないエリアを削除
			# trim whitespace
			rows = matrix.length
			i = 0
			while i < cols
				j = rows - 1
				while j >= 0
					v = matrix[j][i]
					if v > 0
						j = -1
					else
						matrix[j][i] = 1
						j--
				i++

			flg = true
			while flg and matrix.length > 0
				v = matrix[matrix.length-1].join("")
				if(v.indexOf("0") != -1)
					flg = false
				else
					matrix.pop()

			rows = matrix.length
			i = 0
			while i < rows
				j = 0
				while j < cols
					# 左上1マス空き確認
					# check white space left top
					if matrix[i][j] == 0
						v = @getSpaceRectSize(matrix, j, i)

						# スペース追加
						# add white space
						obj=
							x: j * o.eWidth
							y: i * o.cellHeight
							cols: v.cols
							rows: v.rows
							width: v.cols * o.eWidth - o.marginWidth
							height: v.rows * o.cellHeight - o.marginHeight
						if obj.width > 0 and obj.height > 0
							ary.push obj

						# 空き塗りつぶし
						# change cell from white to filled	
						tj_l = j + v.cols
						ti_l = i + v.rows
						ti = i
						while ti < ti_l
							tj = j
							while tj < tj_l
								matrix[ti][tj] = 1
								tj++
							ti++

					j++
				i++
			ary

		getSpaceRectSize: (matrix, x, y)->
			w = 1
			h = 1
			# 何列空きか確認
			# check white space colums
			i = x + 1
			l = matrix[0].length
			while i < l
				if( matrix[y][i] > 0 )
					i += l
				else
					w++
					i++

			# 何行空きか確認
			# check white space rows
			l = w
			flg = true
			while flg
				h++
				i = 0
				while i < l
					tx = x + i
					ty = y + h
					if ty >= matrix.length
						flg = false
						i += l
					else
						if matrix[ty][tx] > 0
							flg = false
							i += l
						else
							i++

			{ cols:w, rows:h }

	#-------------------------------------------
	# plugin
	$.fn.cram = (config) ->
		options = $.extend(true, null, cram.defaultConfig, config);
		@each () ->
			#-------------------------------------------
			# plugin method
			$.fn.cram.setOptions = (arg) =>
				options = $.extend(true, options, arg)
				null

			$.fn.cram.update = =>
				clearTimeout @tempTimer
				@nowUpdate = true
				w = $(@).parent().width()
				list = $(@).children(options.itemSelector)
				@cr = new cram options, w, list, updateDatas

			$.fn.cram.getData = =>
				$.data(@, "cram")

			#-------------------------------------------
			# onResize action
			startResize = =>
				if !options.isWindowResizeUpdate or @nowUpdate
					return
				if @resizeTimer?
					clearTimeout @resizeTimer
				@resizeTimer = setTimeout resize, 200

			resize = =>
				if @resizeTimer?
					clearTimeout @resizeTimer
				o = options
				cols = ( $(@).parent().width()/o.eWidth )<<0
				$(@).children(o.itemSelector).each (i, el)=>
					c = Math.ceil $(el).outerWidth()/o.eWidth
					if c > cols
						cols = c
				if cols == @cols
					return
				@cols = cols
				@tempTimer = setTimeout $(@).cram.update, 0

			#-------------------------------------------
			# update action
			updateDatas = (data)=>
				o = options
				$(".space").remove()
				obj = $.data(@, "cram")
				obj.items = data.items
				obj.spaces = data.spaces
				obj.area = data.area
				@tempTimer = setTimeout =>
					clearTimeout @tempTimer
					if o.isAutoLayout
						drawItems data.items, data.area.width
						if o.isDrawSpace
							drawSpace data.spaces
						drawArea data.area.width, data.area.height
					else
						updated()
				, 0
				@cr = null

			updated = =>
				$(@).trigger("cram.update")
				@tempTimer = setTimeout =>
					clearTimeout @tempTimer
					@nowUpdate = false
				, 1

			#-------------------------------------------
			# draw action
			drawItems = (list, width)=>
				o = options
				a = o.animation
				cols = ( width/o.eWidth )<<0
				l = list.length
				i = 0
				while i < l
					item = list[i]
					style = 
						"top": item.y + "px",
						"left": item.x + "px",
						#"width": item.width + "px",
						#"height": item.height + "px",

					d = a.delayEach * (cols * item.rows + item.cols)
					$(item.element).stop().queue([])
					if d > 0
						if a.duration > 0
							$(item.element).delay(d).animate(style, a.duration, a.ease)
						else
							$(item.element).delay(d).css(style)
					else
						if a.duration > 0
							$(item.element).animate style, a.duration, a.ease
						else
							$(item.element).css style
					i++
				null

			drawSpace = (list)=>
				a = options.animation
				l = list.length
				i = 0
				while i < l
					item = list[i]
					$(@).append '<li class="space"></li>'
					style = 
						"top": item.y + "px",
						"left": item.x + "px",
						"width": item.width + "px",
						"height": item.height + "px",
					$(".space:last").css style
					i++
					if a.duration > 0
						$(".space").css "display", "none"
						$(".space").delay(a.duration*0.8).fadeIn(a.duration*0.8, a.ease)
				null

			drawArea = (w, h)=>
				a = options.animation
				$(@).stop().queue([])
				style = 
					"width": w + "px",
					"height": h + "px",
				if a.duration > 0
					$(@).animate style, a.duration, a.ease, updated
				else
					$(@).css style
					updated()
				null

			#-------------------------------------------
			# init
			$.data(@, "cram", {});
			@list = []
			o = options
			o.eWidth = o.cellWidth + o.marginWidth
			o.eHeight = o.cellHeight + o.marginHeight
			@cols = 0
			@resizeTimer = null
			@nowUpdate = false

			$(window).bind("resize", startResize)

		@

	@.cram = cram