/**
 * @author Barret Lee<barret.china@gmail.com>
 * @date 2015-10-15 14:48:36
 * @example
 *   npm install
 *   node migrate ./example/duoshuoExport.json ./example/disqus.xml
 */

var fs = require('fs');
try{
var ejs = require('ejs');
} catch(e) {
  console.log('\n    Try `npm install` before start program.\n');
  process.exit(1);
}

var argv = process.argv;

var duoshuoPath = argv[2];
var disqusPath = argv[3];
if(argv.length !== 4) {
  console.log('\nUsage Example: \n\n    node migrate ./example/duoshuoExport.json ./example/disqus.xml\n');
  console.log('Any other Problem, you can contact the author:\n\n    小胡子哥<http://www.barretlee.com>\n    Barret Lee<barret.china@gmail.com>\n');
  process.exit(0);
}
if(!fs.existsSync(duoshuoPath)) {
  console.log("\n    The duoshuo Path `" + duoshuoPath + "` is not exsits!\n");
  process.exit(1);
}

try {
  var duoshuoJSON = JSON.parse(fs.readFileSync(duoshuoPath));
} catch(e) {
  console.log("\n    duoshuo JSON is not valid! Have you ever changed it?\n    Please export from `http://{YOUR_DUOSHUO_NAME}.duoshuo.com/admin/tools/export/` again!\n");
  process.exit(2);
}

/**
  threads是文章记录，属性如下；
    thread_id 多说文章ID。
    thread_key 文章在当前站点中的唯一表示符，例如文章ID。
    title 文章的标题。
    url 文章链接。
    author_key 文章作者在本站的ID。
    author_id 文章作者的多说ID，如果为空，说明发表文章时没有登陆多说账号。
    likes 文章被点【赞】的次数。
    views 文章浏览数。
    posts是来自多说的评论，不包括微博、以删除评论、垃圾评论；

  post_id 多说评论ID。
    thread_id 这条评论对应的文章记录。
    message 评论内容。
    created_at 评论发表时间。
    author_id 作者在多说的id。空表示匿名用户。
    author_name 作者显示名。有可能为空。
    author_email 作者邮箱。有可能为空。
    author_url 作者填写的URL。有可能为空。
    ip 作者的IP地址。
 */

/*
threads:
  site_id: 1111292,
  thread_id: 1221878475854446600,
  created_at: "2013-10-31T00:07:41+08:00",
  updated_at: "2013-10-31T00:07:41+08:00",
  likes: 0,
  views: 0,
  title: "突然犯2了，整个页面只剩下百度统计 | BarretLee's Blog—关注互联网，热爱生活!",
  url: "http://barret.cc/document-flow/",
  author_id: 0
posts
  post_id: 1221878475854446600,
  thread_id: 1221878475854446600,
  message: "对浏览器兼容问题的解决么",
  site_id: 1111292,
  created_at: "2013-10-31T18:08:22+08:00",
  updated_at: "1970-01-01T08:00:00+08:00",
  likes: 0,
  ip: "183.129.151.66",
  parents: [ ],
  author_id: 3063182,
  author_email: "",
  author_name: "DINO",
  author_url: "http://t.qq.com/a904591031",
  author_key: "0"
 */
var disqusXML = fs.readFileSync("./disqus.ejs").toString();
var disqusCtt = ejs.render(disqusXML, duoshuoJSON);

if(disqusCtt) {
  fs.writeFileSync(disqusPath, disqusCtt);
}


