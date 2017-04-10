## 爬取盘多多数据

0-390425

五台机器

0-50000
50000-100000

## 抓取时间

 error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5

+ 抓取总耗时 warn
+ 抓取每一页的总时间（包括60条数据）  --> 判断爬虫是否进行 info
+ 抓取每条数据的时间  --> 判断爬虫是否进行debug
+ 抓取了多少页 --> 从 mongodb 的 urlCurrentPage 可以获得
+ 抓取错误 error
+ 其他 silly --> 装载数据silly


## mongodb

```
db.getCollection('resources').find({}).sort({_id:-1})
db.getCollection('resources').remove({})

```
