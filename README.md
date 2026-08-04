# projectname — 标准化前端模板

React 18 + TypeScript + Vite + Ant Design 5 的可视化大屏 / 后台管理双形态脚手架，内置约定式路由、统一请求层、Mock、可编辑表格、一键 SSH 部署与回滚。

## 技术栈

| 类别 | 选型                                                        |
| :--- | :---------------------------------------------------------- |
| 构建 | Vite 4 + @vitejs/plugin-react-swc + @vitejs/plugin-legacy   |
| 框架 | React 18 + TypeScript 5 + react-router-dom 6                |
| UI   | Ant Design 5 + echarts 5                                    |
| 状态 | Recoil                                                      |
| 请求 | axios                                                       |
| 样式 | less / scss + CSS Modules                                   |
| 规范 | ESLint(airbnb) + Prettier + Stylelint + husky + lint-staged |
| 部署 | node-ssh（一键发布 / 回滚）                                 |

## 1. 环境准备

- Node.js ≥ 18
- 包管理器：**pnpm**（推荐，仓库已锁定 `pnpm-lock.yaml`）
- 开发工具：VSCode，建议安装 ESLint / Prettier / Stylelint 插件

## 2. 安装与运行

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器（等同 pnpm start）
pnpm build        # 生产构建
pnpm preview      # 本地预览构建产物
```

## 3. 质量检查

```bash
pnpm lint         # ESLint 修复
pnpm lint:check   # ESLint 只检查（CI 用）
pnpm type-check   # tsc 类型检查
```

提交代码时会自动触发 `husky` + `lint-staged`，对暂存文件执行 eslint / prettier / stylelint 修复。

## 4. 项目目录

```
├─ .github/workflows/ci.yml   —— CI：lint + type-check + build
├─ .husky/pre-commit          —— 提交钩子
├─ config
│  ├─ project.config.ts       —— 项目配置（标题、大屏分辨率、请求忽略类型）
│  ├─ router.config.ts        —— 约定式路由配置
│  └─ server.config.json      —— 一键部署配置（含凭据，已 gitignore，需自行复制 example）
├─ index.html
├─ tsconfig.json              —— TS 编译配置
├─ vite.config.js
├─ public
│  ├─ env.config.js           —— 运行时动态配置（不参与构建，可部署后修改）
│  ├─ files/mysql.xlsx        —— 本地 excel 配置
│  └─ rem/rem.js
├─ scripts
│  ├─ publish.cjs             —— 一键部署
│  └─ rollback.cjs            —— 一键回滚
└─ src
   ├─ index.ts                —— 入口
   ├─ routeIndex.tsx          —— 路由渲染
   ├─ layouts                 —— 布局：AuthLayout / Screen / Background
   ├─ pages                   —— 页面（约定式，按目录自动识别）
   ├─ services                —— 请求层：request / api / mock / socket
   ├─ hooks                   —— useTable / useForm / useChart / useAntdData
   ├─ components              —— 通用组件
   ├─ js                      —— SSCache 缓存、SSEventBus 事件总线
   ├─ store                   —— Recoil 常量
   ├─ static                  —— echarts 图表配置模板
   ├─ styles                  —— 全局样式变量
   ├─ types                   —— 全局类型声明
   └─ utils
```

## 5. 运行时配置

`public/env.config.js` 在运行时通过 `window.ENV` 注入配置，**不参与构建**，可在部署后直接修改：

```js
window.ENV = {
  console: true, // 是否开启 console
  checkToken: true, // 是否需要登录，false 则跳过登录
  requestBaseUrl: '' // 网络请求前缀（统一网关或二级目录部署）
};
```

## 6. 路由约定

在 `config/router.config.ts` 中按目录约定配置路由，`component` 字段指向 `src` 下的相对路径，路由层会通过 `import.meta.glob` 自动匹配 `.tsx/.jsx` 文件（支持 `./pages/xxx`、`./pages/xxx.tsx`、`./pages/xxx/index.tsx` 等形式，嵌套层级不限）。匹配不到时会在控制台 `warn`。

## 7. 一键部署

### 7.1 配置

复制部署配置模板并填写：

```bash
cp config/server.config.example.json config/server.config.json
```

`server.config.json` 已被 gitignore，不会入库。支持两种认证方式：

```jsonc
{
  "deploy": {
    "host": "1.2.3.4",
    "port": 22,
    "username": "root",
    "authMode": "password", // 或 "privateKey"
    "password": "your-password", // authMode=password 时使用
    "privateKey": {
      // authMode=privateKey 时使用
      "privateKeyPath": "~/.ssh/id_rsa",
      "passphrase": ""
    },
    "serverWebPath": "/data/web/your-project",
    "serverWebDist": "dist",
    "preview": "http://your-host",
    "splitIncludes": [], // 需要单独拆分上传的子目录
    "splitUpload": true
  }
}
```

> 也可通过命令行临时指定秘钥：`npm run publish -- --key ~/.ssh/id_rsa`

### 7.2 执行

```bash
pnpm publish      # 正式环境部署
pnpm publishs     # 沙盒环境部署（--env sandbox）
pnpm rollback     # 回滚到上一版本
pnpm rollback -- --env sandbox   # 回滚沙盒环境
```

部署脚本会对所有拼入 shell 命令的路径做白名单校验（仅允许字母/数字/`_`/`-`/`.`/`/`），防止命令注入。

## 8. 引入 Cesium / three.js

引入后需手动拷贝对应的静态资源（Workers / ThirdParty / Assets / Widgets 等）到 `public` 目录。

## 注意事项

- 部署 / 登录相关接口在 `src/services/api/user.ts` 中为占位 Mock 实现，**接入真实后端前必须重写** `login` / `isLogin` / `ssoLogin` / `getInfo`。
- `Login` 页面默认填了 `admin` / `123456`，仅为演示，请删除。
