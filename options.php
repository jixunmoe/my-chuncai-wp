<?php defined ('ABSPATH') || exit ; ?>
<form method="POST" class="wrap" id="jx_wcc_admin">
	<?php wp_nonce_field('jx_wcc', 'jx_wcc_conf_token'); ?>
	<h2><?php _jx_wcc('伪春菜控制面板'); ?></h2>

<?php if ($confUpdated): ?>
	<div id="message" class="updated below-h2"><p><?php echo $confUpdated; ?></p></div>
<?php endif ?>

	<table class="form-table">
		<tr>
			<th><label for="announcement">站点公告</label></th>
			<td>
				<input type="text" name="announcement" id="announcement" value="<?php _jx_chuncai_get_opt('announcement'); ?>" />
			</td>
		</tr>
		<tr>
			<th><label for="skin">CDN 镜像</label></th>
			<td>
				<input type="text" name="skin" id="skin" value="<?php _jx_chuncai_get_opt('skin'); ?>" />
				<p class="description">如果您希望使用 CDN 托管图片内容请在此填写。<b>请注意</b>: 目录结构、文件必须一致。</p>
			</td>
		</tr>
		<tr>
			<th><label for="wcc_list">启用的伪春菜</label></th>
			<td>
				<select multiple class="chz" id="wcc_list" name="wcc_enable[]" placeholder="怎么没有呢, 快选几个吧w">
					<?php foreach(jx_chuncai_get_opt('wcc') as $wcc => $info): ?>
						<option <?php
							echo (in_array($wcc, jx_chuncai_get_opt('wcc_enable')) ? ' selected' : '');
						?> value="<?php echo esc_attr($wcc); ?>">
							<?php echo esc_html($info -> name . ' (' . $wcc . ')'); ?>
						</option>
					<?php endforeach; ?>
				</select>
				<p class="description">请选择您希望启用的春菜。</p>
			</td>
		</tr>
		<tr>
			<th><label for="wcc_default">默认使用的春菜</label></th>
			<td>
				<select class="chz" id="wcc_default" name="wcc_default" placeholder="选择默认的春菜, 留空则随机。">
					<option value></option>
					<?php foreach(jx_chuncai_get_opt('wcc') as $wcc => $info): ?>
						<option <?php
							echo (in_array(jx_chuncai_get_opt('wcc_default'), jx_chuncai_get_opt('wcc_enable')) ? ' selected' : '');
						?> value="<?php echo esc_attr($wcc); ?>">
							<?php echo esc_html($info -> name . ' (' . $wcc . ')'); ?>
						</option>
					<?php endforeach; ?>
				</select>
				<p class="description">用户初次访问显示的春菜。</p>
			</td>
		</tr>

		<tr>
			<th><label for="btn-add-cpa">春菜问答</label></th>
			<td>
				<input type="hidden" name="qa"/>
				<div class="mar-down" cqid="qa" cqa='<?php echo json_encode(jx_chuncai_get_opt('qa')); ?>'></div>
				<button class="button btn-add-cqa" id="btn-add-cpa">添加</button>
			</td>
		</tr>

		<tr>
			<th><label for="defAnswer">找不到回应时回答</label></th>
			<td>
				<input type="text" name="defAnswer" id="defAnswer" value="<?php _jx_chuncai_get_opt('defAnswer'); ?>" />
				<p class="description">当用户聊天输入了无匹陪的数据应该回应的数据。</p>
			</td>
		</tr>

		<tr>
			<th><label for="btn-add-tts">自言自语</label></th>
			<td>
				<div class="mar-down" ph="说点什么?" ts="rt" name="randTalk[]" tts='<?php echo json_encode(jx_chuncai_get_opt('randTalk')); ?>'></div>
				<button id="btn-add-tts" class="button btn-add-tts">添加</button>
				<p class="description">当无操作的时候自己说的话。TODO: 指定表情?</p>
			</td>
		</tr>

		<tr>
			<th><label for="btn-add-fp">喂食 Play</label></th>
			<td>
				<input type="hidden" name="feedPlay"/>
				<div class="mar-down" cqid="fp" cqa='<?php echo json_encode(jx_chuncai_get_opt('feedPlay')); ?>'></div>
				<button class="button btn-add-cqa" id="btn-add-fp">添加</button>
				<p class="description">喂食列表设定。</p>
			</td>
		</tr>

		<tr>
			<th><label for="btn-add-fl">快速跳转</label></th>
			<td>
				<input type="hidden" name="favLink"/>
				<div class="mar-down" cqid="fl" cqa='<?php echo json_encode(jx_chuncai_get_opt('favLink')); ?>'></div>
				<button class="button btn-add-cqa" id="btn-add-fl">添加</button>
				<p class="description">添加一些常用链接, 建议不超过 8 个否则比较难看。请注意每个链接的文字不应超过 16 个字节。TODO: 改成分页显示?</p>
			</td>
		</tr>

		<tr>
			<th><label for="since">启用时间</label></th>
			<td>
				<input type="text" name="since" id="since" value="<?php _jx_chuncai_get_opt('since'); ?>" />
				<p class="description">如果您因为重装 WordPress 导致时间丢失您可以手动更改时间戳到首次启动时间戳。</p>
			</td>
		</tr>

		<tr>
			<th></th>
			<td>
				<label>
					<input type="checkbox" name="resetConf"> <?php _jx_wcc('恢复默认设定'); ?> (<strong><?php _jx_wcc('不可撤销'); ?></strong>)
				</label>
				<p class="description">如果您在使用插件遇到奇怪的问题不妨恢复默认设定试一试 :3</p>
			</td>
		</tr>
	</table>

	<?php submit_button(); ?>
</form>