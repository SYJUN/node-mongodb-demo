# node-mongodb-demo
node+mongodb+jade

## 初始化安装包
```bash
npm install
```
如果安装了 `yarn`，则可以执行以下命令
```bash
yarn install
```

## 下载静态资源依赖包
```bash
bower install
```

## 导入 dat 格式文件数据到数据库中(以 movies 表为例)
```bash
mongoimport -d movies -c movies /db/data.dat
```

## 导出数据到文件中(以 movies 表为例)
```bash
mongoexport -d movies -c movies -o /db/data.dat
```

> 参数说明:
> - d: 指明使用的库, 本例中为 `movies`
> - c: 指明要导出的表, 本例中为 `movies`
> - o: 指明要导出的文件名及目录, 本例中为 `/user/mac/document/data/db/data.dat`

## 先启动 mongodb 数据库

1. windows 启动(需要将 mongodb 设置成服务)

```bash
  NET START MongoDB
```

2. mac

> 启动

```bash
// ‘/usr/local/etc/mongod.conf’ 为配置文件路径  --fork 设置为后台执行
sudo mongod --config /usr/local/etc/mongod.conf --fork
```

> 关闭

```
// 先进入命令控制台,输入 use admin,然后输入 db.shutdownServer()
$ mongo
$ use admin
$ db.shutdownServer()
```

## npm 启动
```bash
npm start
```

## grunt 启动
```bash
grunt
```

在浏览器中打开 `localhost:3100`