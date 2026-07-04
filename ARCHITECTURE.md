# AI情报官 · 技术架构文档

> 本文档详细说明 AI情报官的技术架构设计、核心模块实现原理和数据流转机制。

## 一、架构总览

AI情报官基于 **Wisefow 框架理念**，采用「感知·认知·记忆·表达」四层分布式智能体架构，实现从信息采集到情报产出的端到端闭环。

```
┌─────────────────────────────────────────────────────────┐
│                    用户交互层（Web UI）                    │
│   指挥中心 · 信息源管理 · 情报流 · AI周报 · 引擎设置 · 架构  │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    表达层（Expression）                    │
│   Map-Reduce 周报生成 · Markdown 渲染 · 实时推送           │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    记忆层（Memory）                        │
│   SQLite WAL · 向量索引 · 元数据管理                      │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    认知层（Cognition）                     │
│   LLM 语义评分 · 关注点匹配 · 去重聚类                     │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    感知层（Perception）                    │
│   HTTPX · Patchright · CDP · Crawl4AI                    │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                    数据源层（Data Sources）                │
│   RSS · 微信公众号 · 掘金 · 知乎 · 谷歌学术 · GitHub · Web │
└─────────────────────────────────────────────────────────┘
```

---

## 二、四层架构详解

### L1 感知层（Perception Layer）

感知层是系统的"眼睛和手"，负责从多种信息源采集原始数据。

#### 2.1.1 HTTPX 请求引擎

**技术栈**：HTTPX + BeautifulSoup4

**工作原理**：
- 直接发起 HTTP/HTTPS 请求获取页面 HTML
- 使用 BeautifulSoup4 解析 HTML DOM
- 提取标题、正文、时间等结构化信息

**适用场景**：
- RSS/Atom 订阅源（如 Hacker News、TechCrunch）
- 静态博客（如 WordPress、Hexo 博客）
- 传统 CMS 网站

**优势**：
- 速度最快（单次请求 < 1s）
- 资源消耗最低
- 支持高并发

**局限**：
- 无法处理 JavaScript 动态渲染内容
- 可能被反爬机制拦截

#### 2.1.2 Patchright 隐匿渲染引擎

**技术栈**：Patchright（Playwright 补丁版）+ CDP

**工作原理**：
- 启动无头浏览器（Chromium）
- 通过 CDP（Chrome DevTools Protocol）修补浏览器指纹
- 绕过 Cloudflare、DataDome 等反爬检测
- 等待页面 JavaScript 渲染完成后提取内容

**适用场景**：
- 动态加载的新闻门户（如 InfoQ、36Kr）
- 单页应用（SPA）网站
- 有反爬检测的站点

**优势**：
- 完整渲染 JavaScript 内容
- 绕过主流反爬机制
- 支持复杂交互

**局限**：
- 速度较慢（单次请求 3-10s）
- 资源消耗较高

#### 2.1.3 CDP 环境接管引擎

**技术栈**：Chrome DevTools Protocol + 本地浏览器

**工作原理**：
- 连接到用户本地已登录的浏览器实例
- 复用浏览器的 Cookie、Session、登录态
- 在已登录环境下采集需要身份验证的页面

**适用场景**：
- 微信公众号文章（需登录）
- 知乎登录态页面
- 其他需要身份验证的社交媒体

**优势**：
- 无需重新登录
- 完整复用用户身份
- 采集内容完整

**局限**：
- 需要本地浏览器保持运行
- 单浏览器实例并发受限

#### 2.1.4 Crawl4AI 智能解析引擎

**技术栈**：Crawl4AI + DOM-to-Markdown

**工作原理**：
- 智能识别页面主内容区域
- 将 HTML DOM 转换为结构化 Markdown
- 自动分块处理长文档
- 保留标题层级、列表、表格等结构

**适用场景**：
- 学术论文（arXiv、Papers with Code）
- 技术文档（官方文档、教程）
- 长篇文章

**优势**：
- 解析精度高
- 输出格式标准化（Markdown）
- 适合后续 LLM 处理

**局限**：
- 解析速度中等
- 对非标准页面兼容性一般

#### 2.1.5 引擎调度策略

系统根据信息源类型和配置自动选择引擎：

```
信息源类型 → 推荐引擎
─────────────────────
RSS          → HTTPX（默认）
微信公众号    → CDP（需登录态）
掘金          → Patchright（动态渲染）
知乎          → CDP（需登录态）
谷歌学术      → Crawl4AI（文档解析）
GitHub       → HTTPX（API 可用）
Web（通用）   → Patchright（兼容性好）
```

用户也可在信息源配置中手动指定引擎。

---

### L2 认知层（Cognition Layer）

认知层是系统的"大脑"，负责理解信息含义并进行筛选。

#### 2.2.1 LLM 语义评分模块

**工作原理**：
- 对每条采集的情报，调用 LLM 生成 100 字核心摘要
- LLM 根据用户关注领域，对情报相关性打分（0-100）
- 评分 ≥ 70 的情报标记为「高价值」

**评分标准**：

| 评分区间 | 等级 | 判定依据 |
|----------|------|----------|
| 80-100 | 极高价值 | 与关注领域高度相关，含突破性信息 |
| 70-79 | 高价值 | 与关注领域相关，值得深入阅读 |
| 50-69 | 中等价值 | 部分相关，可选择性阅读 |
| 0-49 | 普通 | 相关性较低，仅作存档 |

**Prompt 设计**：
```
你是一个情报分析专家。请根据以下关注领域：
{user_interests}

对这条信息进行评分（0-100）并生成 100 字摘要：

标题：{title}
内容：{content}
来源：{source}

输出 JSON：
{
  "score": <0-100>,
  "summary": "<100字摘要>",
  "tags": ["<标签1>", "<标签2>"]
}
```

#### 2.2.2 关注点匹配模块

**技术栈**：Embedding + 余弦相似度

**工作原理**：
- 将用户关注领域转换为向量（Embedding）
- 将情报内容转换为向量
- 计算两者余弦相似度，作为评分参考

#### 2.2.3 去重聚类模块

**工作原理**：
- 对所有情报生成 Embedding 向量
- 使用 DBSCAN 算法聚类相似情报
- 同一聚类内保留信息量最大的一条

---

### L3 记忆层（Memory Layer）

记忆层是系统的"记忆"，负责持久化存储所有数据。

#### 2.3.1 数据库设计

**默认数据库**：SQLite（WAL 模式）

**选择理由**：
- 零配置，无需安装数据库服务
- 单文件部署，便于备份迁移
- WAL 模式支持并发读写
- 性能满足中小规模需求（百万级数据）

**数据表结构**：

```prisma
// 信息源表
model Source {
  id          String   @id @default(cuid())
  name        String
  type        String   // rss, wechat, juejin, zhihu, scholar, github, web
  url         String
  engine      String   // httpx, patchright, cdp, crawl4ai
  status      String   @default("active")
  interval    Int      @default(60) // 采集间隔(分钟)
  tags        String   @default("[]")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  intel       Intelligence[]
}

// 情报表
model Intelligence {
  id           String   @id @default(cuid())
  title        String
  summary      String
  content      String
  sourceId     String
  source       Source   @relation(fields: [sourceId], references: [id])
  url          String
  score        Int      @default(0)
  tags         String   @default("[]")
  engine       String
  processed    Boolean  @default(false)
  publishedAt  DateTime
  collectedAt  DateTime @default(now())
  @@index([score])
  @@index([collectedAt])
  @@index([sourceId])
}

// 周报表
model WeeklyReport {
  id             String   @id @default(cuid())
  title          String
  period         String
  markdown       String
  eventGroups    Int
  totalIntel     Int
  highValueIntel Int
  status         String   @default("completed")
  generatedAt    DateTime @default(now())
}
```

#### 2.3.2 向量索引

用于语义去重和相似度检索，支持：
- 语义去重：避免重复报道
- 相关推荐：查找相似情报
- 历史检索：按语义查询历史情报

---

### L4 表达层（Expression Layer）

表达层是系统的"嘴巴"，负责将处理后的情报以友好形式呈现给用户。

#### 2.4.1 Map-Reduce 周报生成

**核心算法**：Map-Reduce 分布式处理

**阶段 1：Map（原子化）**
- 输入：一周内所有高价值情报（通常 100-300 条）
- 处理：对每条情报调用 LLM，生成 100 字核心摘要
- 输出：原子摘要列表

**阶段 2：Shuffle（聚类）**
- 输入：原子摘要列表
- 处理：使用 Embedding + DBSCAN 聚类，合并重复报道
- 输出：事件分组（通常 10-30 个事件组）

**阶段 3：Reduce（综述）**
- 输入：每个事件组的所有原子摘要
- 处理：对每个事件组调用 LLM，生成深度分析段落
- 输出：事件综述列表

**阶段 4：拼接（Markdown）**
- 输入：事件综述列表
- 处理：按主题分类，组装 Markdown 格式周报
- 输出：完整周报文档

**优势**：
- 分布式处理，支持大规模情报
- LLM 上下文窗口友好（每阶段输入可控）
- 生成质量高（先原子化再综述）

#### 2.4.2 实时推送

- 高价值情报（评分 ≥ 80）即时推送通知
- 支持浏览器通知和 Webhook 通知

---

## 三、技术栈详解

### 3.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.1+ | 全栈框架（App Router） |
| React | 19.x | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 原子化 CSS |
| shadcn/ui | New York | 组件库 |
| Recharts | 2.15+ | 数据可视化图表 |
| Lucide React | 0.525+ | 图标库 |
| Framer Motion | 12.x | 动画 |
| React Hook Form | 7.x | 表单管理 |
| Zod | 3.x | 数据校验 |
| Sonner | 2.x | Toast 通知 |
| Zustand | 5.x | 状态管理 |

### 3.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js API Routes | 16.x | API 接口 |
| Prisma | 6.11+ | ORM |
| SQLite | 3.x | 数据库 |
| Zod | 3.x | 请求校验 |

### 3.3 采集引擎技术栈

| 引擎 | 技术 | 用途 |
|------|------|------|
| HTTPX | HTTPX + BeautifulSoup4 | HTTP 请求 |
| Patchright | Patchright + CDP | 隐匿渲染 |
| CDP | Chrome DevTools Protocol | 环境接管 |
| Crawl4AI | Crawl4AI | 智能解析 |

### 3.4 AI 模型技术栈

| 用途 | 推荐模型 | 备选 |
|------|----------|------|
| 语义评分 | Qwen2.5-72B-Instruct | DeepSeek-V3, GPT-4o-mini |
| 周报生成 | DeepSeek-V3 | GPT-4o, Claude-3.5-Sonnet |
| Embedding | bge-large-zh-v1.5 | text-embedding-3-small |

---

## 四、数据流转

### 4.1 采集流程

```
1. 调度器触发采集任务
   ↓
2. 根据信息源类型选择引擎
   ↓
3. 引擎执行采集（HTTP请求/浏览器渲染/登录态接管/文档解析）
   ↓
4. 提取结构化数据（标题、正文、时间、URL）
   ↓
5. 存入原始情报表（标记 processed=false）
   ↓
6. 推送到认知层处理队列
```

### 4.2 认知处理流程

```
1. 从队列获取未处理情报（processed=false）
   ↓
2. 调用 LLM 生成摘要 + 评分 + 标签
   ↓
3. 生成 Embedding 向量
   ↓
4. 语义去重检查（与近 7 天情报比对）
   ↓
5. 更新情报表（score, summary, tags, processed=true）
   ↓
6. 若评分 ≥ 70，标记为高价值
   ↓
7. 若评分 ≥ 80，触发实时推送
```

### 4.3 周报生成流程

```
1. 用户触发或定时任务触发
   ↓
2. 查询近 7 天高价值情报（score ≥ 70）
   ↓
3. Map 阶段：并行生成原子摘要
   ↓
4. Shuffle 阶段：Embedding 聚类
   ↓
5. Reduce 阶段：并行生成事件综述
   ↓
6. 拼接 Markdown 周报
   ↓
7. 存入周报表
   ↓
8. 通知用户
```

---

## 五、性能优化

### 5.1 采集优化

- **并发控制**：每种引擎独立并发池，避免相互阻塞
- **请求去重**：同一 URL 短时间内不重复采集
- **增量采集**：RSS 类源支持 If-Modified-Since 头
- **失败重试**：指数退避重试机制（最多 3 次）

### 5.2 数据库优化

- **WAL 模式**：支持并发读写，提升吞吐量
- **索引优化**：对 score、collectedAt、sourceId 建立索引
- **分页查询**：情报列表采用游标分页，避免 OFFSET 性能问题
- **定期清理**：自动清理超过保留期的数据

### 5.3 前端优化

- **代码分割**：Next.js 自动按路由分割
- **懒加载**：图表组件按需加载
- **虚拟滚动**：情报流长列表虚拟滚动
- **缓存策略**：静态资源 CDN 缓存

---

## 六、安全设计

### 6.1 数据安全

- API Key 加密存储，不明文显示
- 数据库文件权限控制（600）
- 敏感操作需二次确认

### 6.2 网络安全

- HTTPS 支持（生产环境）
- CORS 配置
- 请求频率限制

### 6.3 采集合规

- 遵守 robots.txt
- 尊重网站版权
- 合理设置采集频率，避免对源站造成压力

---

## 七、扩展性设计

### 7.1 信息源扩展

新增信息源类型只需：
1. 在 `sourceTypeMeta` 中添加类型元数据
2. 实现对应的采集适配器
3. 在信息源管理 UI 中添加选项

### 7.2 引擎扩展

新增采集引擎只需：
1. 实现 `BaseEngine` 接口
2. 在 `engineMeta` 中注册
3. 在引擎设置 UI 中添加配置卡片

### 7.3 模型扩展

支持任意 OpenAI 兼容 API 的模型，只需配置：
- API Base URL
- API Key
- 模型名称

---

## 八、参考项目

| 项目 | 地址 | 说明 |
|------|------|------|
| Wiseflow | https://github.com/TeamWiseFlow/wiseflow | 通用信息提取框架 |
| Crawl4AI | https://github.com/unclecode/crawl4ai | 智能网页爬取 |
| Patchright | https://github.com/Kaliiiizyy/CDP-Patch | 隐匿浏览器自动化 |
| Next.js | https://nextjs.org/ | React 全栈框架 |
| shadcn/ui | https://ui.shadcn.com/ | 组件库 |
| Prisma | https://www.prisma.io/ | TypeScript ORM |
| Recharts | https://recharts.org/ | React 图表库 |

---

## 九、架构决策记录

### 决策 1：为什么选择 SQLite 而非 PostgreSQL？

**背景**：系统需要支持本地部署，降低使用门槛。

**决策**：选择 SQLite（WAL 模式）作为默认数据库。

**理由**：
- 零配置，无需安装数据库服务
- 单文件部署，便于备份和迁移
- WAL 模式支持并发读写，性能满足需求
- 百万级数据量下性能良好

**权衡**：牺牲了分布式部署能力，但符合"本地部署"的核心需求。

### 决策 2：为什么采用四层架构？

**背景**：系统需要处理采集、理解、存储、表达四种不同关注点。

**决策**：采用「感知·认知·记忆·表达」四层架构。

**理由**：
- 关注点分离，各层独立演进
- 层间通过明确接口通信，降低耦合
- 符合信息处理的自然流程
- 便于水平扩展（如多引擎并行采集）

### 决策 3：为什么使用 Map-Reduce 生成周报？

**背景**：一周情报量通常 100-300 条，超出 LLM 上下文窗口。

**决策**：采用 Map-Reduce 分布式处理。

**理由**：
- Map 阶段：每条情报独立处理，可并行
- Shuffle 阶段：聚类合并，减少冗余
- Reduce 阶段：每个事件组独立综述，可并行
- 每阶段输入可控，不超 LLM 上下文窗口
- 生成质量高（先原子化再综述）

---

如需了解更多部署和使用信息，请参阅 `README.md`（部署指南）和 `OPERATION_GUIDE.md`（操作指引）。
