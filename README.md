# 三步，将多说评论迁移到 disqus

#### 第一步

进入到你的多说后台，导出多说数据

```
http://{YOUR_DUOSHUO_NAME}.duoshuo.com/admin/tools/export/
```

#### 第二步

```
git clone https://github.com/barretlee/duoshuo-migrate-to-disqus.git
cd duoshuo-migrate-to-disqus
npm install
node migrate
```

#### 第三步

进入你的 disqus 后台，将数据导入

```
https://{YOUR_DISQUS_NAME}.disqus.com/admin/discussions/import/platform/generic/
```

### 备注

如果操作失败，可以看看 <https://github.com/barretlee/duoshuo-migrate-to-disqus/tree/v2> 这个分支的代码。