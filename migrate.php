<?php 
ini_set('memory_limit', '1024M');
header('content-type:text/html; charset=utf-8');
ini_set('date.timezone', 'Asia/Shanghai');

/**
 * 获取多说评论
 * @var json
 */
$export = file_get_contents('./data/merge.json');

/**
 * 转化为数组
 * @var array 
 */
$threadsAndPosts = json_decode($export, true, 512, JSON_BIGINT_AS_STRING);

/**
 * 获取有评论的文章id
 * @var array
 */
$postsID = array();
foreach ($threadsAndPosts['posts'] as $v) {
	$postsID[] = $v['thread_id'];
}

/**
 * 根据条件删除文章
 */
foreach ($threadsAndPosts['threads'] as $threadsKey => $threadsValue) {
	if (empty($threadsValue['thread_key']) || !in_array($threadsValue['thread_id'], $postsID)) {
		unset($threadsAndPosts['threads'][$threadsKey]);
	}
}

/**
 * 处理评论关系
 */
foreach ($threadsAndPosts['posts'] as $k => $v) {
	if (!empty($v['parents'])) {
		$threadsAndPosts['posts'][$k]['parents'] = end($v['parents']);
	}
	if (empty($v['avatar_url'])) {
		$threadsAndPosts['posts'][$k]['avatar_url'] = "";
	}
}

$xml = new XMLWriter();
$xml->openMemory();
$xml->setIndent(true);
$xml->setIndentString('  ');
$xml->startDocument('1.0', 'UTF-8', 'yes');

	/**
	 * 根据Disqus官方文档生成xml节点
	 */
	$xml->startElement('rss');
		$xml->writeAttribute('version', '2.0');
		$xml->writeAttributeNS('xmlns', 'content', null, 'http://purl.org/rss/1.0/modules/content/');
		$xml->writeAttributeNS('xmlns', 'dsq', null, 'http://www.disqus.com');
		$xml->writeAttributeNS('xmlns', 'dc', null, 'http://purl.org/dc/elements/1.1/');
		$xml->writeAttributeNS('xmlns', 'wp', null, 'http://wordpress.org/export/1.0/');

		$xml->startElement('channel');
			
			foreach($threadsAndPosts['threads'] as $threadsKey => $threadsValue) {
				$xml->startElement('item');
					$xml->writeElement('title', $threadsValue['title']);
					$xml->writeElement('link', $threadsValue['url']);
					$xml->writeElement('wp:content');
					$xml->writeElement('dsq:thread_identifier', $threadsValue['thread_key']);
					$xml->writeElement('wp:post_date_gmt', date('Y-m-d H:i:s', strtotime($threadsValue['created_at'])));
					$xml->writeElement('comment_status', 'open');
		
					foreach($threadsAndPosts['posts'] as $postsKey => $postValue) {
						if ($threadsValue['thread_id'] == $postValue['thread_id']) {
							$xml->startElement('wp:comment');
								// $xml->startElement('dsq:remote');
								// 		$xml->writeElement('dsq:id', $postValue['post_id']);
								// 		$xml->writeElement('dsq:avatar', $postValue['avatar_url']);
								// $xml->endElement();
								$xml->writeElement('wp:comment_id', $postValue['post_id']);
								$xml->writeElement('wp:comment_author', $postValue['author_name']);
								$xml->writeElement('wp:comment_author_email', $postValue['author_email']);
								$xml->writeElement('wp:comment_author_url', $postValue['author_url']);
								$xml->writeElement('wp:comment_author_IP', $postValue['ip']);
								$xml->writeElement('wp:comment_date_gmt', date('Y-m-d H:i:s',strtotime($postValue['created_at'])));
								$xml->startElement('wp:comment_content');
										$xml->writeCData($postValue['message']);
								$xml->endElement();
								$xml->writeElement('wp:comment_approved', 1);
									$parents = (empty($postValue['parents'])) ? '' : $postValue['parents'];
								$xml->writeElement('wp:comment_parent', $parents);
							$xml->endElement();
						}
					}
		
				$xml->endElement();
			}
		$xml->endElement();

	$xml->endElement();

$xml->endDocument();
$output = $xml->outputMemory();
file_put_contents('./dist/disqus.xml', $output);

?>
