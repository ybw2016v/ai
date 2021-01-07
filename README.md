<h1><p align="center"><img src="./ai.svg" alt="藍" height="200"></p></h1>
<p align="center">An Ai for Misskey. <a href="使用教程.md">About Ai</a></p>

## 这是什么？
这是方便Misskey使用的日语（本repo为中文优化）Bot。

## 安装
> 您需要安装Node.js、npm和MeCab（可选）。

首先，做一个`git clone`到一个合适的目录。
接下来，在该目录下创建一个`config.json`文件。 内容应如下：
``` json
{
	"host": "https:// + 您的实例的URL（最后不加/）",
	"i": "您要运行的账户的访问令牌",
	"master": "管理员的用户名（可选）",
	"notingEnabled": "如果您希望禁用随机帖文功能，请输入false",
	"keywordEnabled": "如果您想启用关键字记忆（MeCab是必需的），则为true（如果你想禁用它，则为false）",
	"chartEnabled": "如果您希望禁用图表功能，请输入false",
	"reversiEnabled": "如果您希望藍能下黑白棋，则请设为true（如果您想禁用它，就请设为false）",
	"serverMonitoring": "如果您希望启用服务器监控功能，则请为true（如果您想禁用它，就请设为false）",
	"mecab": "MeCab的安装路径（如果你从源码安装，通常是 /usr/local/bin/mecab） ",
	"mecabDic": "MeCab字典文件路径（可选）"
}
```
您可以通过运行`npm install`、`npm run build`和`npm start`来启动。

## 字体
有些功能需要字体。 艾姬不附带字体，所以你应该自己在安装目录下安装字体，名称为`font.ttf`。

## 记忆
藍使用内存数据库来保存记忆，它以`memory.json`为名持久地保存在藍的安装目录中。

## 开源许可证
MIT

## Awards
<img src="./WorksOnMyMachine.png" alt="Works on my machine" height="120">
