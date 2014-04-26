/**
 * @preserve Copyright 2014+, Jixun.Org
 * WeiChunCai Plugin for WordPress:
 *   https://github.com/JixunMoe/my-chuncai-wp
 */

// wcc.js
;jQuery (function ($) {
	// Change to false when release to public.
	var DEBUG = false;

	var w = window;
	var jx_wcc = w.jx_wcc;
	var localStorage = w.localStorage;

	$.fn.clickEx = function (sel, foo) {
		return $(this).on('click', sel, foo);
	};

	if (!localStorage)
		// IE, just go hell.
		return ;

	var createCallback = function (that, foo) {
		that = that || this;
		for (var i=2, args = []; i<arguments.length; i++) {
			args.push (arguments[i]);
		}

		return function () {
			for (var i=0, newArgs = args; i<arguments.length; i++)
				newArgs.push (arguments[i]);

			return foo.apply (that, newArgs);
		}
	};

// http://jixun.org/p/2583
var jDrag = function (dragElement, resultElement, canMoveCB, updateMoveCB) {
    if (!canMoveCB) canMoveCB = function () {return true};
    var _that = this;
    var _that_q = dragElement;
    var _that_p = resultElement || dragElement;
    var _that_b = _that_p.parentNode;
 
    var _that_getPos = function (ele) {
        var addOn = ele.offsetParent != _that_b && ele.offsetParent
            ? _that_getPos (ele.offsetParent)
            : {x: 0, y: 0};
 
        return {
            x: ele.offsetLeft + addOn.x,
            y: ele.offsetTop + addOn.y
        };
    };
 
    var _that_isDrag = false;
    var _that_bind = function (event, cb, isDoc) {
        (isDoc ? document : _that_q).addEventListener (event, cb, false);
    };
    _that_unbind = function (event, cb, isDoc) {
        (isDoc ? document : _that_q).removeEventListener (event, cb, false);
    };
    
    var _that_offset = {x: 0, y: 0};
    var _that_baseOffset = {x: 0, y: 0};
    var isOurEvent = function (e) {
    	return e && e.parentNode
		    	? _that_p == e
		    		? true
		    		: isOurEvent (e.parentNode)
		    	: false;
    };
    var _that_mousedown = function (e) {
        if (!isOurEvent(e.target) || !canMoveCB(e)) return;

        _that_baseOffset = _that_getPos (_that_p);
        _that_offset.x = e.pageX;
        _that_offset.y = e.pageY;
 
        _that_isDrag = true;
        _that_q.style.cursor = '-webkit-grabbing';
        _that_q.style.cursor = 'grabbing';
    };
    var _that_mouseup = function (e) {
        _that_q.style.cursor = '-webkit-grab';
        _that_q.style.cursor = 'grab';
        if (_that_isDrag && e) updateMoveCB(_that_getPos(_that_q));
        _that_isDrag = false;
    };
    var _that_mousemove = function (e) {
        if (!_that_isDrag || !canMoveCB(e)) return;
 
        _that_p.style.left = _that_baseOffset.x + e.pageX - _that_offset.x + 'px';
        _that_p.style.top  = _that_baseOffset.y + e.pageY - _that_offset.y + 'px';
        e.preventDefault();
    };
    var _that_init = function () {
        _that_bind ('mousedown', _that_mousedown);
        _that_bind ('mouseup', _that_mouseup, true);
        _that_bind ('mousemove', _that_mousemove, true);
    };
    _that_init ();
    _that_mouseup ({});
};

	var newDiv  = '<div>',
		newLink = '<a>';

	var rand = function (a, b, m) {
		return (m || 1) * ((Math.random() * (b - a)) + a);
	};

	var getRanArr = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
	var clsWCC = function (opts) {
		DEBUG && console.log (opts);
		var conf = opts.c;
		var _getBody = function () {
			if (opts.wcc_enable.indexOf(conf.body) !== -1)
				return conf.body;

			// 找不到, 随机抽取一只
			return (function (wcc) {
				if (wcc.length) return getRanArr(wcc);

				// 后台没配置好可用的春菜, 报错 :<
				throw new Error ('请通知管理员进入后台配置春菜 :<');
			})(opts.wcc_enable);
		};
		// 首先, 读取设定
		var wccName, _wcc;

		var _bootup = function () {
			_shutdown (); // Clean up
			DEBUG && console.log ('Booting up...');
			// Shoukan btn
			_btn_shoukan.stop().fadeOut (600);
			_main.fadeIn ();

			wccName = _getBody();
			_wcc    = opts.wcc[wccName];

			_hideMenu ();
			_reloadFace (true);
		};
		var _shutdown = function (spd) {
			DEBUG && console.log ('Shutting down...');
			_main.hide ();
			clearTimeout (_expThread);
			clearTimeout (_thdReloadFace);
			_btn_shoukan.stop().fadeIn (600);
		};

		var _save = function () {
			localStorage.jx_wcc_conf = JSON.stringify(conf);
			DEBUG && console.log ('Save config: %s', localStorage.jx_wcc_conf);
		};
		var _curFace = 0;
		// 随机抽取一只表情
		var _reFace = function () {
			_curFace = getRanArr(_wcc.faces);
			// _curFace = _wcc.faces[0];
		};

		// 获取配置
		var _main = $(newDiv).appendTo('body').addClass('jx_wcc_main').css({
			left: conf.pos.x,
			top:  conf.pos.y
		});
		var _btn_shoukan = $(newLink).appendTo('body').addClass('jx_wcc_btn_shoukan').text('召唤春菜').hide().click(function () {
			_bootup ();
			conf.hide = false;
			_save ();
		});

		var _face = $(newDiv).appendTo(_main).addClass ('jx_wcc_face');

		var _extendDelay = 0;

		var _chat = $(newDiv).appendTo(_main).addClass ('jx_wcc_chat');
		var _chat_content = $(newDiv).appendTo(_chat).addClass ('jx_wcc_cat_con');

		var _addDelay = function (numToAdd) { _extendDelay += numToAdd; };
		var _setDelay = function (newDelay) { _extendDelay = newDelay; };

		var _hideMenu = function (bKeepDelay) {
			if (!bKeepDelay) _extendDelay = 0;

			_menu
				.add(_menu_links)
				.add(_menu_feedPlay)
				.add(_menu_change)
					.stop().slideUp();
		};

		var _shoukanBtn   = $(newLink).text();
		var _closeChunCai = function () {
			_hideMenu ();
			_setDelay (10000);
			// Save [HIDE] state of ChunCai
			conf.hide = true;
			_save();
			doTypeWords ('记得再叫我出来哦~', function () {
				setTimeout (function () {
					$(_main).fadeOut (600, function () {
						// Now display the button
						_shutdown ();
						conf.hide = true;
						_save();
					});
				}, 2000);
			});
		};

		var _menus = [
			$(newLink).text('显示公告').click(function () {
				// Display notice for at least 5s.
				_hideMenu ();
				_addDelay (5000);
				doTypeWords(opts.announcement);
			}),
			$(newLink).text('你问我答').click(function () {
				// TODO
			}),
			$(newLink).text('存活时间').click(function () {
				_hideMenu ();
				_addDelay (5000);
				doTypeWords('咱已经和主人共同度过 ' + Math.floor((new Date() / 1000 - opts.since) / 86400) + '天 了哦～');
			}),
			$(newLink).text('拍打喂食').click(function () {
				// TODO
				_addDelay(15000);
				doTypeWords('要来点什么呢~');
				_menu.slideToggle ();
				_menu_feedPlay.slideToggle ();
			}),
			$(newLink).text('换 一 只').click(function () {
				_hideMenu ();
				doTypeWords ('你想要哪一只呢?');
				_menu_change.slideDown ();
			}),
			$(newLink).text('传 送 门').click(function () {
				_addDelay(15000);
				_hideMenu ();
				_menu_links.slideDown ();
			}),
			$(newLink).text('关闭春菜').click(_closeChunCai),
			$(newLink).text('返回').click(function () {
				// 强制刷新
				_reloadChat (true);
				_reloadFace ();
			})
		];

		var _feedCount = 0,
			_feedClrThd = function () {
				// 每 7 分钟消化一个食物
				// 7 * 60 * 1000 = 420000
				
				if (_feedCount > 0)
					_feedCount--;

				setTimeout (_feedClrThd, 420000);
			}

		// 菜单
		var _menu = $(newDiv).appendTo(_chat).append(_menus).addClass('jx_wcc_chat_m').hide();
		var _menu_feedPlay = $(newDiv).appendTo(_chat).addClass('jx_wcc_chat_m').hide().clickEx('a', function () {
			// 当链接(食物)被点击
			// 检查春菜的肚子实现不同回应。
			_addDelay(3000);
			
			var pre = '';
			if (_feedCount > 9) {
				doTypeWords('主人 .. ..  我已经吃不下了 QwQ');
				return;
			} else if (_feedCount > 5) {
				pre = '快吃不下了…';
			} else if (_feedCount < 3) {
				pre = '多谢主人~';
			}

			_feedCount ++;
			doTypeWords((pre + ' ' + $(this).attr('r')).trim());
		});
		var _menu_change = $(newDiv).appendTo(_chat).addClass('jx_wcc_chat_m').hide().clickEx('a', function () {
			conf.body = $(this).attr('m');
			_save ();
			_bootup ();
		});
		var _menu_links = $(newDiv).appendTo(_chat).addClass('jx_wcc_chat_m').hide();

		var _chatLock = false;
		var _menu_btn = $(newDiv).appendTo(_chat).click(function () {
			// Menu Button click event
			if (_menu.is(':hidden')) {
				_hideMenu ();
				doTypeWords('需要做点什么吗?');
				_addDelay(15000);
				_menu.slideToggle();
			} else {
				// Hide Menu.
				_reloadChat(true);
				// _hideMenu ();
			}
		}).text('menu').addClass ('jx_wcc_ment_btn');

		// _timg: 用来测量图片大小
		var _timg = $('<img>').appendTo (_face).hide();

		var _exp  = $('<img>').appendTo (_face).hide();

		var _drag = new jDrag (_face[0], _main[0], null, function (newPos) {
			DEBUG && console.log ('Save new pos:', newPos);
			conf.pos = newPos;
			_save ();
		});

		var _hasExpression = false;

		var setFaceAndSize = function (s, srcImg) {
			_face.css({
				width:  s.w,
				height: s.h,
				backgroundImage: 'url(' + srcImg + ')'
			});
		};
		var imgCache = {};
		var getImgSize = function (srcImg, cb) {
			if (imgCache[srcImg] && imgCache[srcImg].h) {
				cb (imgCache[srcImg], srcImg);
				return ;
			}
			_timg[0].onload = function () {
				imgCache[srcImg] = {
					w: _timg.width(),
					h: _timg.height()
				};
				cb (imgCache[srcImg], srcImg);
			};
			_timg.attr('src', srcImg);
		};

		var _expThread = 0,
			_expIndex  = 0;
    
		var __typeClass = 'jx-jqfx-type';
		var doTypeWords = function (str, cb, delay) {
			DEBUG && console.log ('doTypeWords: %s', str);
			// Destory previous session if present.
			clearTimeout (_chat_content.data(__typeClass));

			// Init. variable.
			var strPos = 0,
				strLen = str.length,
				typeStrCallback = function () {
                _chat_content.append(str[strPos] == '\n' ? '<br>' : str[strPos]);

				if (++strPos < strLen) {
					// This effect isn't done yet.
					_chat_content.data (__typeClass, setTimeout(typeStrCallback, delay || 20));
				} else if (cb) {
					cb ();
				}
			};

			// Init. type effect.
			_chat_content.text('').data (__typeClass, setTimeout(typeStrCallback, 1));
		};

		var _lastChat = 0;
		var _reloadChat = function (bForce) {
			// If last chat was 4s ago
			if (bForce || new Date() - _lastChat > 4000) {
				_hideMenu (true);
				_lastChat = new Date();
				doTypeWords (getRanArr(opts.randTalk));
			}
		};

		var _buildImg = function (_curFace, exp) {
			return opts.skin + wccName + _curFace + (exp ? '.' + exp : '') + '.png';
		};

		var _expFaces = [];
		var _thdExp = function () {
			/* _curFace: 
			{
				// rakutori00.00.png
				base: "00",
				// Expression list
				face: [
					// rakutori00.01.png
					["01",14,49]
				]
			}
			*/
			if (_expIndex == _expFaces.length) {
				_expIndex = 0;
				_exp.hide ();
				_expThread = setTimeout(_thdExp, rand (_curFace.time[0], _curFace.time[1], 1000));
			} else {
				var _curExp = _expFaces[_expIndex++];
				_exp.attr ('src', _buildImg(_curFace.base, _curExp[0])).css({
					left: _curExp[1],
					top : _curExp[2],
					position: 'absolute'
				}).show();

				_expThread = setTimeout(_thdExp, _curExp[3] * 1000);
			}
		};

		var _loadExp = function (bForce) {
			getImgSize(_buildImg(_curFace.base), function (baseImgSize, baseImgSrc) {
				setFaceAndSize (baseImgSize, baseImgSrc);

				_expIndex = _expFaces.length;
				_expThread = setTimeout (_thdExp, 1);
				_thdReloadFace = setTimeout  (_reloadFace, _nextReloadTime);
				_reloadChat (bForce);
			});
		};
		var _nextReloadTime = 0,
			_thdReloadFace  = 0;
		var _reloadFace = function (bForce) {
			// Remove old thread if there is any.
			clearTimeout (_thdReloadFace);
			DEBUG && console.log('_extendDelay: %s', _extendDelay);
			if (!bForce && _extendDelay) {
				_thdReloadFace = setTimeout(_reloadFace, _extendDelay);
				_extendDelay = 0;
				return;
			}

			_nextReloadTime = rand(_wcc.time[0] || 10, _wcc.time[1] || 15, 1000);

			_reFace ();
			_hasExpression = typeof _curFace != 'string';
			clearTimeout (_expThread);
			_exp.hide ();

			if (_hasExpression) {
				_expIndex = 0;
				_expFaces = _curFace.face;
				_loadExp (bForce);
			} else {
				// 没有表情, 测量图片大小
				getImgSize(_buildImg(_curFace), function (size, srcImg) {
					setFaceAndSize (size, srcImg);
					_thdReloadFace = setTimeout  (_reloadFace, _nextReloadTime);
					_reloadChat ();
				});
			}
		};

		// 初始化喂食选项
		for (var x in opts.feedPlay) {
			var f = opts.feedPlay[x];
			_menu_feedPlay.append ($(newLink).text(x).attr({
				f: x,
				r: f
			}));
		}

		// 初始化春菜更换选项
		for (var i = opts.wcc_enable.length; i--; ) {
			_menu_change.append($(newLink).text(opts.wcc[opts.wcc_enable[i]].name).attr('m', opts.wcc_enable[i]));
		}

		// 初始化友情链接
		for (var x in opts.favLink) {
			_menu_links.append($(newLink).text(x).attr('href', opts.favLink[x]));
		}

		_bootup ();

		// 清理饥饿度
		_feedClrThd ();

		// 重载人偶
		_reloadFace ();

		if (conf.hide)
			_shutdown (true);

		//:EOF
	};

	// Get global config
	$.ajax ({
		url: jx_wcc.url,
		method: 'POST',
		data: {
			action: 'jx_ajax_get_chuncai_opts'
		},
		dataType: 'json',
		cache: true
	}).success (function (r) {
		clsWCC ($.extend({c: $.parseJSON(localStorage.jx_wcc_conf) || {
			pos: {
				x: $(w).width()  - 120,
				y: $(w).height() - 200
			},
			hide: false
		}}, r));
	});
});