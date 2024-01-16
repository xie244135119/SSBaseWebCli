### 标准化模板创建

#### 1，环境准备

开发环境：VsCode
预装插件：Eslint， Prettier，Prettier-ESlint ，StyleLint，Vite

#### 2，运行

推荐使用 yarn or pnpm

1），安装依赖：yarn i or npm install

2)，运行项目 yarn start or npm start

#### 3，打包

npm run build or (yarn build)

### 4, 项目目录
    src-总的资源文件
    

### 5，文件说明

| 文件路径                |  文件说明  |
| :---------------------- | :--------: |
| public/files/mysql.xlsx | mysql 映射表 |

### 6, 运行配置

    1，public/env.config.js 文件中新增动态配置
    2，新增动态配置

### 7, 一键部署
#### 7.1 修改文件配置
    1，config文件夹下 server.config.json配置
    
    "host": "0.0.0.0",
    "port": 22,
    "username": "root",
    "password": "****",
    "serverWebPath": "/xx/xx/xx/xx"
#### 7.2 配置
    2，npm run publish


### 注意事项
#### 引入Cesium
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

####    引入 three.js
#####  npm add three
#####  涉及的静态资源 手动拷贝              
    1, node_modules/three/examples/js/libs/draco/
    2, node_modules/three/examples/js/libs/basis/
