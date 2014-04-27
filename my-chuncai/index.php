<?php defined ('ABSPATH') || exit ;
/*
 * Plugin Name: 自制伪春菜
 * Plugin URI:  https://github.com/JixunMoe/my-chuncai-wp
 * Description: 又一个伪春菜插件, 其项目托管于 <a href="https://github.com/JixunMoe/my-chuncai-wp" target="_blank">GitHub</a>。
 * Version:     1.0-Alpha
 * Author:      Jixun
 * Author URI:  http://jixun.org/
 */

load_plugin_textdomain ('jx-chuncai-plug', false, dirname (plugin_basename (__FILE__)) . '/lang/');

define ('__jx_wcc_min' , WP_DEBUG ? '' : '.min');
define ('__jx_wcc_base', plugin_basename(__FILE__));
function __jx_wcc ($str) { return __($str, 'jx-chuncai-plug'); }
function _jx_wcc ($str) { echo __jx_wcc($str); }

function jx_wcc_options () {
	jx_wcc_reqUpdate ();
	add_options_page(__jx_wcc('伪春菜控制面板'), __jx_wcc('伪春菜控制面板'), 'manage_options', 'jx_wcc_options', 'jx_wcc_options_page');
}

add_action('admin_menu', 'jx_wcc_options');
function jx_wcc_row_meta ($meta, $file) {
	if (__jx_wcc_base === $file) {
		array_splice ($meta, 2, 0, array(
			'<a href="options-general.php?page=jx_wcc_options">' . __jx_wcc('配置春菜') . '</a>'
		));
	}
	return $meta;
}
add_filter('plugin_row_meta', 'jx_wcc_row_meta', 10, 2);

// Init options
$jx_opt_wcc = get_option('jx-plug-wcc');
// 调试模式 oAo
if (!is_array ($jx_opt_wcc) || !$jx_opt_wcc['since'])
	jx_wcc_reset (); // 首次访问

function jx_wcc_reset () {
	global $jx_opt_wcc;
	$jx_opt_wcc = array(
		'announcement' => '这位客官, 欢迎光临小站~~',

		// Default Q&A
		'qa' => array(
			'早上好' => '早上好~',
			'大力'   => '大力出奇迹!!',
			'金坷垃' => '每天一袋金坷拉, 喵喵亩产一千八'
		),

		// 时间戳: 当前的时间戳, 前台计算时间用.
		'since' => time(),

		'wcc_default' => '',
		'wcc_enable' => array ('rakutori'),

		// 喂食 Play
		'feedPlay' => array(
			'小饼干' => '嗷呜~ 多谢款待 >ω<',
			'胡萝卜' => '人家又不是小兔子 QwQ'
		),

		// 自言自语
		'randTalk' => array (
			'咦你想做什么 oAo',
			'「不要啊」你以为我会这么说么噗噗~',
			'一起组团烧烤秋刀鱼',
			'白日依山尽，黄河入海流，欲穷千里目，更上 .. .. 一层楼？'
		),

		'favLink' => array (
			'回到首页' => site_url(),
			'二次元仓库' => 'http://jixun.org/'
		),

		'skin' => plugins_url('/skin/' , __FILE__),

		'defAnswer' => '... 嗯 ?'
	);

	jx_wcc_reqUpdate ();

	jx_chuncai_save_opts ();
}

function jx_wcc_options_page () {
	global $jx_opt_wcc;
	$confUpdated = false;
	if (@$_POST['jx_wcc_conf_token'] && wp_verify_nonce ($_POST['jx_wcc_conf_token'], 'jx_wcc')) {
		$confUpdated = __jx_wcc ('成功更新设定!');

		if (@$_POST['resetConf'] == 'on') {
			jx_wcc_reset ();
		} else {
			// 纯文本, 或原生数组
			foreach (array('announcement', 'skin', 'defAnswer', 'since', 'wcc_default', 'wcc_enable') as $key)
				$jx_opt_wcc[$key] = @$_POST[$key];

			// 解析 json
			foreach (array('qa', 'randTalk', 'feedPlay') as $key) {
				$tmp = json_decode(urldecode(@$_POST[$key]), true);
				// 防止未知问题造成的覆盖原值
				if ($tmp && is_array($tmp)) {
					$jx_opt_wcc[$key] = json_decode(urldecode($_POST[$key]), true);
				}
			}

			jx_chuncai_save_opts ();
		}
	}
	include_once (dirname(__FILE__) . '/options.php');
}


/**
 * Update wcc configs.
 * @return array The configs ->  $jx_opt_wcc['wcc']
 */
function jx_wcc_reqUpdate () {
	global $jx_opt_wcc;

	foreach (glob ( dirname(__FILE__) . '/skin/*.conf') as $conf)
		$jx_opt_wcc['wcc'][basename($conf, '.conf')] = json_decode(file_get_contents($conf));
	
	jx_chuncai_save_opts ();
	return $jx_opt_wcc['wcc'];
}

/**
 * Echo an option.
 * @param  String $optname The name of the option.
 * @param  String $sub     The name of the sub-option (Optional).
 * @return None
 */
function _jx_chuncai_get_opt ($optname, $sub = null) {
	echo (esc_attr(jx_chuncai_get_opt ($optname, $sub)));
}
/**
 * Get an option from config.
 * @param  String $optname The name of the option.
 * @param  String $sub     The name of the sub-option (Optional).
 * @return String/Array    The value of the config requested.
 */
function jx_chuncai_get_opt ($optname, $sub = null) {
	global $jx_opt_wcc;
	$ret = @$jx_opt_wcc[$optname];
	if ($sub) return @$ret[$sub];
	return $ret;
}

/**
 * Save all chuncai options.
 * @return None
 */
function jx_chuncai_save_opts () {
	global $jx_opt_wcc;
	update_option ('jx-plug-wcc', $jx_opt_wcc);
}

/**
 * Enqueue style and script for wcc.
 * @return None
 */
function jx_chuncai_enqueue () {
	global $jx_opt_wcc;
	wp_enqueue_style  ('jx-chuncai-style' , plugins_url('/res/wcc.css', __FILE__));
	wp_enqueue_script ('jx-chuncai-script', plugins_url('/res/wcc' . __jx_wcc_min . '.js' , __FILE__), array ('jquery'));
	wp_localize_script('jx-chuncai-script', 'jx_wcc', array(
		'url' => admin_url('admin-ajax.php'),
		'skin' => plugins_url('/skin/' , __FILE__)
	));
}
add_action ('wp_enqueue_scripts', 'jx_chuncai_enqueue');

/**
 * AJAX: Returns the config of this plugin. 
 * @return None
 */
function jx_ajax_get_chuncai_opts () {
	global $jx_opt_wcc;
	die (json_encode($jx_opt_wcc));
}
add_action ('wp_ajax_jx_ajax_get_chuncai_opts',        'jx_ajax_get_chuncai_opts');
add_action ('wp_ajax_nopriv_jx_ajax_get_chuncai_opts', 'jx_ajax_get_chuncai_opts');

function jx_admin_page_enqueue ($hook) {
	if ($hook != 'settings_page_jx_wcc_options') return ;
	wp_enqueue_script ('jquery-chosen', '//cdnjs.cloudflare.com/ajax/libs/chosen/1.1.0/chosen.jquery.min.js', array ('jquery'));
	wp_enqueue_style  ('jquery-chosen', '//cdnjs.cloudflare.com/ajax/libs/chosen/1.1.0/chosen.min.css');
	
	wp_enqueue_script ('jx-chuncai-admin-script', 
						plugins_url('/res/wcc-admin' . __jx_wcc_min . '.js' , __FILE__), 
						array ('jquery-chosen', 'jquery'));

	wp_enqueue_style  ('jx-chuncai-admin-style', plugins_url('/res/wcc-admin.css', __FILE__));
}
add_action ('admin_enqueue_scripts', 'jx_admin_page_enqueue');