// wcc-admin.js

jQuery (function ($) {
	// Change to false when release to public.
	var DEBUG = false;

	var placeholder = 'placeholder';

	$('.chz').each(function (){
		$(this).chosen({
			placeholder_text_multiple: $(this).attr(placeholder),
			search_contains: true,
			allow_single_deselect: true,
			placeholder_text_single: '留空: 随机抽选'
		});
	});

	var ranStr = function () {
		return Math.random ();
	};

	// 问答
	var cqa = $('div[cqa]'),
		tts = $('div[tts]');
	
	var addTTS = function (t, q) {
		if (DEBUG) console.log (t,q);
		t.append(
			$('<div>')
			.append ($('<input>').val(q).attr(placeholder, t.attr('ph')).attr('name', t.attr('name')).addClass('w25em mag-right v'))
			.append ($('<button>').text('移除').addClass('button btn-remove-row'))
		);
	}, addCq = function (cqa, w, e, q, a) {
		if (DEBUG) console.log (arguments);
		cqa.append(
			$('<div>')
			.append (
				$('<label>').text(w[0] + ': ')
				.append (
					$('<input>').val(q).attr(placeholder, e[0]).addClass ('q')
				).addClass('mag-right')
			)

			.append (
				$('<label>').text(w[1] + ': ')
				.append (
					$('<input>').val(a).attr(placeholder, e[1]).addClass ('a')
				).addClass('mag-right')
			)

			.append (
				$('<button>').text('移除')
					.addClass('button btn-remove-row')
			)

			.append ('<br>')
		);
	};

	var addCqW = {
		qa: ['问答', ['问点什么呢?', '怎么回答呢?']],
		fp: ['吃答', ['吃什么好呢?', '然后怎么回应?']],
		fl: [['名', '地址'], ['如: xxx 的博客', '如: http://example.com/']]
	};

	tts.each(function (i, t) {
		t = $(t);
		$.parseJSON(t.attr('tts')).forEach(function (q) { addTTS(t, q); });
	});

	cqa.each(function (i, c) {
		c = $(c);
		var p = c.attr('cqid');
		var cqOpt = $.parseJSON(c.attr('cqa'));
		for (var q in cqOpt)
			addCq (c, addCqW[p][0], addCqW[p][1], q, cqOpt[q]);
	});

	$('body').on ('click', '.btn-remove-row', function (e) {
		e.preventDefault();
		$(this).parent().remove();
	}).on ('click', '.btn-add-cqa', function (e) {
		e.preventDefault();
		addCq.apply({}, [$(this).prev()].concat(addCqW[$(this).prev().attr('cqid')]));
	}).on ('click', '.btn-add-tts', function (e) {
		e.preventDefault();
		addTTS($(this).prev());
	});

	var genJSON = function (cqid) {
		var r = {};
		$('[cqid="' + cqid + '"]>div').each(function () {
			r[$('.q', this).val()] = $('.a', this).val();
		});
		// Bypass PHP Magic Quote.
		return encodeURIComponent(JSON.stringify(r));
	};

	$('#jx_wcc_admin').on('submit', function (e) {
		this.qa.value = genJSON('qa');
		this.feedPlay.value = genJSON('fp');
		this.favLink.value = genJSON('fl');

//		e.preventDefault();
	});
});