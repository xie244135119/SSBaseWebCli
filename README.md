### 标准化模板创建

#### 1，运行

推荐使用 yarn or pnpm

1），安装依赖：yarn i or npm install

2)，运行项目 yarn start or npm start

#### 2，部署

npm run build or (yarn build)

### 3,项目目录

### 4，Mock 服务

1，api 请求正常处理
2，在 src/services/mock 增加 url 监听
3，config/env.config.js 开启 mock 开关

### 5，文件说明

| 文件路径                |  文件说明  |
| :---------------------- | :--------: |
| public/files/mysql.xlsx | mysql 映射表 |

### 6, 运行配置

    1，public/env.config.js 文件中新增动态配置
    2，新增动态配置


### 6，引入Cesium.js 
##### 1，npm add cesium 
##### 2, CopyWebpackPlugin 引入
                <!-- {
                    from: 'node_modules/cesium/Build/Cesium/Workers',
                    to: 'static/cesium/Workers'
                },
                {
                    from: 'node_modules/cesium/Build/Cesium/ThirdParty',
                    to: 'static/cesium/ThirdParty'
                },
                {
                    from: 'node_modules/cesium/Build/Cesium/Assets',
                    to: 'static/cesium/Assets'
                },
                {
                    from: 'node_modules/cesium/Build/Cesium/Widgets',
                    to: 'static/cesium/Widgets'
                }, -->

### 7，引入THREE
#####  npm add three
#####                 
<!-- {
                    from: 'node_modules/three/examples/js/libs/draco/',
                    to: 'static/three/draco',
                },
                {
                    from: 'node_modules/three/examples/js/libs/basis/',
                    to: 'static/three/basis',
                } -->

### 8, 一键部署
#### 8.1 修改文件配置
    1，config文件夹下 server.config.json配置
    
    "host": "0.0.0.0",
    "port": 22,
    "username": "root",
    "password": "****",
    "serverWebPath": "/xx/xx/xx/xx"

    2，npm run publish
