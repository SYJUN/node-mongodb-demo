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

## 导入 dat 格式文件数据到数据库中
```bash
mongoimport -d movies -c movies /user/mac/document/data/db/data.dat
```

## 导出数据到文件中
```bash
mongoimport -d movies -c movies -o /user/mac/document/data/db/data.dat
```

> 参数说明:
> - d: 指明使用的库, 本例中为 `movies`
> - c: 指明要导出的表, 本例中为 `movies`
> - o: 指明要导出的文件名及目录, 本例中为 `/user/mac/document/data/db/data.dat`

## 启动 
```bash
npm start
```

在浏览器中打开 `localhost:3100`