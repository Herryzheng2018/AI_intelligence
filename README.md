# AI情报官 · 7x24 智能信息处理 Agent

> 基于 Wiseflow 框架理念构建的端到端情报获取与分析应用，实现"信息找人"——主动巡航、语义筛选、自动闭环。

## 项目简介

AI情报官是一个 7x24 小时在线的信息处理 Agent，采用"感知·认知·记忆·表达"四层分布式架构，从多源信息采集到 AI 周报生成形成完整闭环。系统支持 RSS、微信公众号、掘金、知乎、谷歌学术、GitHub 等多种信息源，通过四种采集引擎（HTTPX / Patchright / CDP / Crawl4AI）智能调度，结合 LLM 语义筛选与 map-reduce 周报生成流水线，让高价值信息主动找到你。

### 核心能力

| 能力 | 说明 |
|------|------|
| 主动巡航 | 7x24 小时持续监控信息源，按配置间隔自动采集 |
| 语义筛选 | LLM 对每条信息打分（0-100），自动标记高价值情报 |
| 多引擎调度 | 根据信息源类型智能选择 HTTPX / Patchright / CDP / Crawl4AI |
| 自动闭环 | 采集 → 清洗 → 分析 → AI 周报，全流程自动化 |
| 可视化指挥 | 实时仪表盘、情报流监控、引擎状态、架构总览 |

---

## 环境要求

在开始部署前，请确保您的系统满足以下要求：

### 必需环境

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| Node.js | 18.17+ | 20.x LTS | JavaScript 运行时 |
| npm / pnpm / bun | npm 9+ | pnpm 9+ / bun 1.1+ | 包管理器（推荐 pnpm 或 bun） |
| Git | 2.30+ | 最新版 | 版本控制 |

### 操作系统支持

- Windows 10/11（推荐使用 WSL2）
- macOS 12+
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+

### 硬件建议

| 用途 | CPU | 内存 | 磁盘 |
|------|-----|------|------|
| 开发调试 | 2 核 | 4 GB | 5 GB |
| 生产部署 | 4 核 | 8 GB | 20 GB |

### 浏览器要求

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+

---

## 快速开始（5 分钟启动）

### 方式一：使用 pnpm（推荐）

```bash
# 1. 解压项目
unzip ai-intelligence-officer.zip
cd ai-intelligence-officer

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置数据库路径

# 4. 初始化数据库
pnpm db:push

# 5. 启动开发服务器
pnpm dev
```

### 方式二：使用 npm

```bash
# 1. 解压项目
unzip ai-intelligence-officer.zip
cd ai-intelligence-officer

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env

# 4. 初始化数据库
npm run db:push

# 5. 启动开发服务器
npm run dev
```

### 方式三：使用 bun（最快）

```bash
# 1. 解压项目
unzip ai-intelligence-officer.zip
cd ai-intelligence-officer

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp .env.example .env

# 4. 初始化数据库
bun run db:push

# 5. 启动开发服务器
bun run dev
```

启动成功后，在浏览器访问 **http://localhost:3000** 即可看到 AI情报官指挥中心。

---

## 详细安装步骤

### 第 1 步：安装 Node.js

#### Windows
1. 访问 https://nodejs.org/ 下载 LTS 版本安装包
2. 运行安装程序，保持默认选项
3. 打开 PowerShell 验证：`node -v` 和 `npm -v`

#### macOS
```bash
# 使用 Homebrew
brew install node@20
```

#### Linux (Ubuntu/Debian)
```bash
# 使用 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 第 2 步：安装包管理器（可选）

推荐使用 pnpm 以获得更快的安装速度和更小的磁盘占用：

```bash
npm install -g pnpm
```

或使用 bun（速度最快）：

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 第 3 步：解压项目

```bash
# Linux / macOS
unzip ai-intelligence-officer.zip
cd ai-intelligence-officer

# Windows (PowerShell)
Expand-Archive ai-intelligence-officer.zip
cd ai-intelligence-officer
```

### 第 4 步：安装项目依赖

```bash
# pnpm（推荐）
pnpm install

# 或 npm
npm install

# 或 bun（最快）
bun install
```

> 安装过程可能需要 2-5 分钟，取决于网络速度。如果遇到网络问题，可使用国内镜像：
> ```bash
> npm config set registry https://registry.npmmirror.com
> ```

### 第 5 步：配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，根据需要修改配置（详见下文"环境变量说明"）。

### 第 6 步：初始化数据库

```bash
pnpm db:push
# 或 npm run db:push
# 或 bun run db:push
```

此命令会根据 `prisma/schema.prisma` 创建 SQLite 数据库文件。

### 第 7 步：启动开发服务器

```bash
pnpm dev
# 或 npm run dev
# 或 bun run dev
```

看到以下输出表示启动成功：

```
▲ Next.js 16.1.1
- Local:   http://localhost:3000
✓ Ready in 1.2s
```

---

## 环境变量说明

在项目根目录创建 `.env` 文件（可从 `.env.example` 复制），配置以下变量：

```env
# 数据库连接字符串（SQLite）
# Linux/macOS 使用绝对路径
DATABASE_URL=file:/home/z/my-project/db/custom.db
# Windows 示例
# DATABASE_URL=file:C:/ai-intelligence-officer/db/custom.db

# 应用端口（默认 3000）
PORT=3000

# 环境模式
NODE_ENV=development
```

### 数据库路径说明

本项目使用 SQLite 作为默认数据库，无需额外安装数据库服务。`DATABASE_URL` 指向一个本地文件路径：

- **Linux/macOS**：`file:/home/user/ai-intelligence-officer/db/custom.db`
- **Windows**：`file:C:/Users/username/ai-intelligence-officer/db/custom.db`

请确保该路径的父目录存在且有读写权限。

---

## 生产环境部署

### 方式一：Next.js Standalone 模式（推荐）

本项目已配置 `output: "standalone"`，可生成独立可部署的产物。

```bash
# 1. 构建生产版本
pnpm build

# 2. 启动生产服务器
pnpm start
```

构建产物位于 `.next/standalone/` 目录，包含所有必需的 node_modules，可独立部署。

### 方式二：使用 PM2 进程管理（Linux）

```bash
# 1. 安装 PM2
npm install -g pm2

# 2. 构建项目
pnpm build

# 3. 使用 PM2 启动
pm2 start "node .next/standalone/server.js" --name ai-intelligence-officer

# 4. 设置开机自启
pm2 startup
pm2 save
```

### 方式三：Docker 部署

在项目根目录创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

构建并运行：

```bash
docker build -t ai-intelligence-officer .
docker run -p 3000:3000 -v $(pwd)/db:/app/db ai-intelligence-officer
```

### 方式四：Nginx 反向代理

如果需要通过域名或 HTTPS 访问，可配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 项目结构

```
ai-intelligence-officer/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/route.ts              # API 路由
│   │   ├── globals.css               # 全局样式（情报主题）
│   │   ├── layout.tsx                # 根布局
│   │   └── page.tsx                  # 首页入口
│   ├── components/
│   │   ├── views/                    # 六大功能视图
│   │   │   ├── dashboard.tsx         # 指挥中心
│   │   │   ├── sources.tsx           # 信息源管理
│   │   │   ├── stream.tsx            # 情报流
│   │   │   ├── reports.tsx           # AI 周报
│   │   │   ├── engines.tsx           # 引擎设置
│   │   │   └── architecture.tsx      # 系统架构
│   │   ├── ui/                       # shadcn/ui 组件库
│   │   ├── app-shell.tsx             # 应用主框架
│   │   └── icon.tsx                  # 动态图标组件
│   ├── hooks/                        # React Hooks
│   ├── lib/
│   │   ├── types.ts                  # TypeScript 类型定义
│   │   ├── mock-data.ts              # 模拟数据
│   │   ├── db.ts                     # 数据库连接
│   │   └── utils.ts                  # 工具函数
│   └── ...
├── prisma/
│   └── schema.prisma                 # 数据库 Schema
├── public/                           # 静态资源
├── .env.example                      # 环境变量模板
├── package.json                      # 项目依赖与脚本
├── next.config.ts                    # Next.js 配置
├── tsconfig.json                     # TypeScript 配置
├── tailwind.config.ts                # Tailwind CSS 配置
├── postcss.config.mjs                # PostCSS 配置
├── components.json                   # shadcn/ui 配置
├── README.md                         # 本文档（部署指南）
├── OPERATION_GUIDE.md                # 操作指引
└── ARCHITECTURE.md                   # 技术架构文档
```

---

## 可用脚本

在项目根目录执行以下命令：

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（热重载，http://localhost:3000） |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器（需先 build） |
| `pnpm lint` | 运行 ESLint 代码检查 |
| `pnpm db:push` | 同步 Prisma Schema 到数据库 |
| `pnpm db:generate` | 生成 Prisma Client |
| `pnpm db:migrate` | 创建数据库迁移 |
| `pnpm db:reset` | 重置数据库（慎用，会清空数据） |

> 使用 npm 时将 `pnpm` 替换为 `npm run`，使用 bun 时替换为 `bun run`。

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.1+ |
| 语言 | TypeScript | 5.x |
| UI 库 | React | 19.x |
| 样式 | Tailwind CSS | 4.x |
| 组件库 | shadcn/ui (New York) | 最新 |
| 图表 | Recharts | 2.15+ |
| 图标 | Lucide React | 0.525+ |
| 动画 | Framer Motion | 12.x |
| 数据库 | Prisma + SQLite | 6.11+ |
| 状态管理 | Zustand | 5.x |
| 表单 | React Hook Form + Zod | 最新 |
| 通知 | Sonner | 2.x |

---

## 常见问题（FAQ）

### Q1: 启动时报 "Cannot find module" 错误

**原因**：依赖未完整安装。

**解决**：
```bash
rm -rf node_modules
pnpm install   # 或 npm install
```

### Q2: 数据库连接失败

**原因**：`DATABASE_URL` 路径不存在或无权限。

**解决**：
1. 检查 `.env` 文件中的 `DATABASE_URL` 路径
2. 确保父目录存在：`mkdir -p db`
3. 重新执行 `pnpm db:push`

### Q3: 端口 3000 被占用

**解决**：修改启动端口
```bash
pnpm dev -- -p 3001
# 或修改 package.json 中的 dev 脚本
```

### Q4: Windows 下路径格式问题

**解决**：`.env` 文件中的路径使用正斜杠 `/`，例如：
```
DATABASE_URL=file:C:/Users/username/ai-intelligence-officer/db/custom.db
```

### Q5: 安装依赖时网络超时

**解决**：使用国内镜像源
```bash
npm config set registry https://registry.npmmirror.com
# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
```

### Q6: 构建时 TypeScript 报错

**说明**：本项目 `next.config.ts` 中已配置 `ignoreBuildErrors: true`，构建时会跳过类型检查。如需严格检查，可移除该配置并修复类型错误。

### Q7: 页面显示空白或样式丢失

**解决**：
1. 清除浏览器缓存
2. 删除 `.next` 目录后重新构建：
```bash
rm -rf .next
pnpm build
```

### Q8: 如何修改默认端口

编辑 `package.json` 中的 `dev` 和 `start` 脚本：
```json
{
  "scripts": {
    "dev": "next dev -p 8080",
    "start": "NODE_ENV=production node .next/standalone/server.js -p 8080"
  }
}
```

---

## 更新与维护

### 更新依赖

```bash
# 检查可更新的依赖
pnpm outdated

# 更新所有依赖
pnpm update

# 更新特定依赖
pnpm update next react
```

### 数据库备份

SQLite 数据库为单文件，直接复制即可备份：

```bash
cp db/custom.db db/custom.db.backup.$(date +%Y%m%d)
```

### 日志查看

开发模式下日志输出到终端和 `dev.log` 文件；生产模式下输出到 `server.log` 文件。

```bash
# 实时查看日志
tail -f dev.log
tail -f server.log
```

---

## 技术支持

如遇到部署问题，请按以下顺序排查：

1. 查看本 README 的「常见问题」章节
2. 查看 `OPERATION_GUIDE.md` 了解功能使用
3. 查看 `ARCHITECTURE.md` 了解技术架构
4. 检查 Node.js 版本是否符合要求
5. 删除 `node_modules` 和 `.next` 后重新安装构建

---

## 许可证

本项目仅供学习和内部使用。
