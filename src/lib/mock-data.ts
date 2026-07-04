// AI情报官 - Mock 数据
import type {
  InfoSource,
  Intelligence,
  WeeklyReport,
  EngineConfig,
  ArchitectureLayer,
  SystemStats,
  SourceType,
  EngineType,
} from './types'

// 信息源类型元数据
export const sourceTypeMeta: Record<
  SourceType,
  { label: string; icon: string; color: string }
> = {
  rss: { label: 'RSS', icon: 'Rss', color: 'text-orange-400' },
  wechat: { label: '微信公众号', icon: 'MessageCircle', color: 'text-green-400' },
  juejin: { label: '掘金', icon: 'Code', color: 'text-blue-400' },
  zhihu: { label: '知乎', icon: 'HelpCircle', color: 'text-cyan-400' },
  scholar: { label: '谷歌学术', icon: 'GraduationCap', color: 'text-violet-400' },
  github: { label: 'GitHub', icon: 'Github', color: 'text-purple-400' },
  web: { label: 'Web', icon: 'Globe', color: 'text-sky-400' },
}

// 引擎类型元数据
export const engineMeta: Record<
  EngineType,
  { label: string; icon: string; color: string; desc: string }
> = {
  httpx: {
    label: 'HTTPX 请求',
    icon: 'Zap',
    color: 'text-emerald-400',
    desc: '传统 CMS、静态博客，直诉 HTTP 请求',
  },
  patchright: {
    label: '隐匿渲染',
    icon: 'Eye',
    color: 'text-amber-400',
    desc: '动态网页、新闻门户，CDP 指纹修补',
  },
  cdp: {
    label: '环境接管',
    icon: 'Link',
    color: 'text-rose-400',
    desc: '长身份验证社交媒体，复用本地登录态',
  },
  crawl4ai: {
    label: '智能解析',
    icon: 'Sparkles',
    color: 'text-violet-400',
    desc: '文档、论文，DOM 转 Markdown',
  },
}

// 信息源列表
export const mockSources: InfoSource[] = [
  {
    id: 'src-001',
    name: 'Hacker News',
    type: 'rss',
    url: 'https://news.ycombinator.com/rss',
    engine: 'httpx',
    status: 'active',
    interval: 15,
    lastCollect: '2 分钟前',
    totalCollected: 1284,
    highValueCount: 156,
    tags: ['科技', '创业', '前沿'],
  },
  {
    id: 'src-002',
    name: '机器之心',
    type: 'wechat',
    url: 'mp.weixin.qq.com/机器之心',
    engine: 'cdp',
    status: 'active',
    interval: 30,
    lastCollect: '5 分钟前',
    totalCollected: 892,
    highValueCount: 203,
    tags: ['AI', '深度学习', '行业'],
  },
  {
    id: 'src-003',
    name: '掘金前端',
    type: 'juejin',
    url: 'juejin.cn/frontend',
    engine: 'patchright',
    status: 'active',
    interval: 20,
    lastCollect: '1 分钟前',
    totalCollected: 645,
    highValueCount: 78,
    tags: ['前端', '工程', 'Web'],
  },
  {
    id: 'src-004',
    name: '知乎 AI 话题',
    type: 'zhihu',
    url: 'zhihu.com/topic/ai',
    engine: 'patchright',
    status: 'active',
    interval: 25,
    lastCollect: '8 分钟前',
    totalCollected: 1024,
    highValueCount: 134,
    tags: ['AI', '讨论', '观点'],
  },
  {
    id: 'src-005',
    name: 'arXiv CS.AI',
    type: 'scholar',
    url: 'arxiv.org/list/cs.AI/recent',
    engine: 'crawl4ai',
    status: 'active',
    interval: 60,
    lastCollect: '12 分钟前',
    totalCollected: 458,
    highValueCount: 167,
    tags: ['论文', '学术', '前沿'],
  },
  {
    id: 'src-006',
    name: 'GitHub Trending',
    type: 'github',
    url: 'github.com/trending',
    engine: 'httpx',
    status: 'active',
    interval: 30,
    lastCollect: '3 分钟前',
    totalCollected: 376,
    highValueCount: 89,
    tags: ['开源', '代码', '趋势'],
  },
  {
    id: 'src-007',
    name: '量子位',
    type: 'wechat',
    url: 'mp.weixin.qq.com/量子位',
    engine: 'cdp',
    status: 'active',
    interval: 30,
    lastCollect: '6 分钟前',
    totalCollected: 567,
    highValueCount: 145,
    tags: ['AI', '资讯', '行业'],
  },
  {
    id: 'src-008',
    name: 'TechCrunch',
    type: 'rss',
    url: 'techcrunch.com/feed',
    engine: 'httpx',
    status: 'idle',
    interval: 45,
    lastCollect: '23 分钟前',
    totalCollected: 723,
    highValueCount: 92,
    tags: ['科技', '创投', '国际'],
  },
  {
    id: 'src-009',
    name: 'Papers with Code',
    type: 'scholar',
    url: 'paperswithcode.com/latest',
    engine: 'crawl4ai',
    status: 'active',
    interval: 60,
    lastCollect: '15 分钟前',
    totalCollected: 312,
    highValueCount: 98,
    tags: ['论文', '代码', '复现'],
  },
  {
    id: 'src-010',
    name: 'InfoQ 中文站',
    type: 'web',
    url: 'infoq.cn',
    engine: 'patchright',
    status: 'error',
    interval: 20,
    lastCollect: '1 小时前',
    totalCollected: 489,
    highValueCount: 67,
    tags: ['架构', '技术', '深度'],
  },
]

// 情报项
export const mockIntelligence: Intelligence[] = [
  {
    id: 'intel-001',
    title: 'OpenAI 发布 GPT-5：推理能力提升 40%，支持百万 token 上下文',
    summary:
      'OpenAI 今日正式发布 GPT-5 模型，在数学推理、代码生成和长文档理解方面显著提升，上下文窗口扩展至 100 万 token，并引入了原生多模态推理能力。',
    content:
      'OpenAI 在今日的开发者大会上正式发布了 GPT-5 模型。新模型在 MATH 基准测试上达到 94.3% 的准确率，较 GPT-4o 提升 40%。上下文窗口从 128K 扩展至 100 万 token，可处理整本书籍或大型代码库。GPT-5 还引入了原生多模态推理能力，能够同时理解图像、音频和视频输入。定价方面，输入 token 价格降低 50%，输出 token 价格保持不变。API 已于今日开放，ChatGPT Plus 用户将在下周获得访问权限。',
    sourceId: 'src-002',
    sourceName: '机器之心',
    sourceType: 'wechat',
    url: 'https://mp.weixin.qq.com/s/gpt5-release',
    publishedAt: '2026-07-03 09:30',
    collectedAt: '2 分钟前',
    score: 95,
    tags: ['大模型', 'OpenAI', 'GPT-5', '行业重磅'],
    engine: 'cdp',
    processed: true,
  },
  {
    id: 'intel-002',
    title: 'DeepSeek-V3 开源：671B 参数 MoE 架构，训练成本仅 557 万美元',
    summary:
      'DeepSeek 发布 V3 模型并完全开源，采用 671B 参数的 MoE 架构，激活参数仅 37B，训练成本仅 557 万美元，性能对标 GPT-4o。',
    content:
      'DeepSeek 正式开源 DeepSeek-V3 模型，采用 671B 参数的混合专家（MoE）架构，每个 token 仅激活 37B 参数。模型在 MMLU、HumanEval 等基准测试上达到或超过 GPT-4o 水平。训练仅使用 2048 张 H800 GPU，耗时 2 个月，总成本约 557 万美元，远低于同级别模型。模型权重采用 MIT 协议开源，已发布技术报告和推理代码。',
    sourceId: 'src-005',
    sourceName: 'arXiv CS.AI',
    sourceType: 'scholar',
    url: 'https://arxiv.org/abs/2501.00001',
    publishedAt: '2026-07-03 08:15',
    collectedAt: '5 分钟前',
    score: 93,
    tags: ['开源', 'DeepSeek', 'MoE', '大模型'],
    engine: 'crawl4ai',
    processed: true,
  },
  {
    id: 'intel-003',
    title: 'Anthropic 推出 Claude Computer Use：AI 可直接操作电脑桌面',
    summary:
      'Anthropic 发布 Claude Computer Use 功能，允许 Claude 直接查看屏幕、移动鼠标、点击按钮和输入文字，实现桌面级 AI 自动化。',
    content:
      'Anthropic 为 Claude 模型推出了 Computer Use 功能，使 AI 能够直接操作用户的电脑桌面。Claude 可以截取屏幕截图、识别界面元素、移动鼠标、点击按钮和输入文字。该功能目前处于公测阶段，通过 API 提供给开发者。Anthropic 强调了安全措施，包括用户确认机制和操作日志。早期测试显示，Claude 在 OSWorld 基准测试上完成率达 22%，显著高于 GPT-4o 的 9%。',
    sourceId: 'src-001',
    sourceName: 'Hacker News',
    sourceType: 'rss',
    url: 'https://news.ycombinator.com/item?id=claude-computer-use',
    publishedAt: '2026-07-03 07:45',
    collectedAt: '8 分钟前',
    score: 91,
    tags: ['Anthropic', 'Claude', 'Agent', '自动化'],
    engine: 'httpx',
    processed: true,
  },
  {
    id: 'intel-004',
    title: 'Meta 发布 Llama 4：原生多模态，10M token 超长上下文',
    summary:
      'Meta 发布 Llama 4 系列模型，包含 Scout 和 Maverick 两个版本，支持原生多模态输入和最高 1000 万 token 的上下文窗口。',
    content:
      'Meta 正式发布 Llama 4 系列开源模型。Llama 4 Scout 支持 1000 万 token 上下文窗口，是目前商用模型中最长的；Llama 4 Maverick 采用 17B 激活参数的 MoE 架构，性能对标 GPT-4o。两个模型均原生支持文本和图像输入。Llama 4 在推理效率上较 Llama 3 提升 3 倍，可在单张 H100 上运行。模型权重已发布至 HuggingFace。',
    sourceId: 'src-006',
    sourceName: 'GitHub Trending',
    sourceType: 'github',
    url: 'https://github.com/meta-llama/llama4',
    publishedAt: '2026-07-03 06:20',
    collectedAt: '12 分钟前',
    score: 89,
    tags: ['Meta', 'Llama', '开源', '多模态'],
    engine: 'httpx',
    processed: true,
  },
  {
    id: 'intel-005',
    title: 'Google Gemini 2.0 Flash 实时语音对话：延迟低至 200ms',
    summary:
      'Google 发布 Gemini 2.0 Flash，支持实时语音对话，端到端延迟低至 200ms，可感知用户情绪和背景声音。',
    content:
      'Google 发布 Gemini 2.0 Flash 模型，主打实时多模态交互。模型支持原生音频输入输出，端到端语音对话延迟低至 200ms，可实时感知用户情绪变化和背景环境声音。Gemini 2.0 Flash 还支持实时视频流理解，可用于视频通话场景。API 定价为每百万 token 输入 0.075 美元，输出 0.3 美元。',
    sourceId: 'src-007',
    sourceName: '量子位',
    sourceType: 'wechat',
    url: 'https://mp.weixin.qq.com/s/gemini-2-flash',
    publishedAt: '2026-07-03 05:10',
    collectedAt: '15 分钟前',
    score: 87,
    tags: ['Google', 'Gemini', '语音', '实时'],
    engine: 'cdp',
    processed: true,
  },
  {
    id: 'intel-006',
    title: 'Mistral AI 发布 Pixtral Large：124B 多模态开源模型',
    summary:
      'Mistral AI 发布 Pixtral Large 多模态模型，124B 参数，在 MM-MT-Bench 上超越 GPT-4o，采用 Apache 2.0 协议开源。',
    content:
      'Mistral AI 发布 Pixtral Large 多模态模型，参数规模 124B，其中文本编码器 123B、视觉编码器 1B。模型在 MM-MT-Bench 多模态基准测试上得分 8.62，超越 GPT-4o 的 8.41。Pixtral Large 支持图像理解和文档分析，可处理高达 1M token 的上下文。模型采用 Apache 2.0 协议开源，权重已发布至 HuggingFace 和 Torrent。',
    sourceId: 'src-001',
    sourceName: 'Hacker News',
    sourceType: 'rss',
    url: 'https://news.ycombinator.com/item?id=pixtral-large',
    publishedAt: '2026-07-03 04:30',
    collectedAt: '18 分钟前',
    score: 84,
    tags: ['Mistral', '多模态', '开源'],
    engine: 'httpx',
    processed: true,
  },
  {
    id: 'intel-007',
    title: 'Qwen2.5-Max 登顶 Arena Hard：阿里通义千问刷新 SOTA',
    summary:
      '阿里通义千问发布 Qwen2.5-Max 模型，在 LMSYS Arena Hard 榜单上以 1358 分登顶，超越 GPT-4o 和 Claude 3.5 Sonnet。',
    content:
      '阿里巴巴通义千问团队发布 Qwen2.5-Max 模型，在 LMSYS Chatbot Arena 盲测中以 1358 的 Arena Hard 分数登顶全球第一，超越 GPT-4o（1353 分）和 Claude 3.5 Sonnet（1348 分）。Qwen2.5-Max 采用超大规模 MoE 架构，总参数量超过 480B。模型在中文、编程、数学和硬核推理任务上表现尤为突出。API 已通过阿里云百炼平台开放。',
    sourceId: 'src-002',
    sourceName: '机器之心',
    sourceType: 'wechat',
    url: 'https://mp.weixin.qq.com/s/qwen25-max',
    publishedAt: '2026-07-03 03:15',
    collectedAt: '22 分钟前',
    score: 82,
    tags: ['阿里', 'Qwen', 'SOTA', 'MoE'],
    engine: 'cdp',
    processed: true,
  },
  {
    id: 'intel-008',
    title: 'Browser-Use 1.0 发布：开源 AI 浏览器自动化框架',
    summary:
      'Browser-Use 1.0 正式发布，支持自然语言驱动浏览器操作，集成 Playwright 和 Patchright，GitHub Star 突破 50K。',
    content:
      'Browser-Use 1.0 正式发布，这是一个将大语言模型推理能力映射为浏览器操作的开源 Python 框架。开发者可发出自然语言指令（如"搜索并下载 PDF"），由 LLM 规划点击、输入等动作序列。1.0 版本集成了 Patchright 引擎以规避反爬检测，新增多标签页管理和文件下载支持。项目 GitHub Star 已突破 50K。',
    sourceId: 'src-006',
    sourceName: 'GitHub Trending',
    sourceType: 'github',
    url: 'https://github.com/browser-use/browser-use',
    publishedAt: '2026-07-03 02:00',
    collectedAt: '25 分钟前',
    score: 80,
    tags: ['开源', '浏览器', '自动化', 'Agent'],
    engine: 'httpx',
    processed: true,
  },
  {
    id: 'intel-009',
    title: 'Crawl4AI 0.5 发布：支持自适应爬取树裁剪与智能分块',
    summary:
      'Crawl4AI 0.5 版本发布，新增自适应爬取树裁剪算法和智能分块策略，直接输出大模型友好的 Markdown 和 JSON。',
    content:
      'Crawl4AI 发布 0.5 版本，专为大模型场景优化的开源异步爬虫。新版本引入自适应爬取树裁剪算法，可智能识别内容密度并裁剪无效分支；新增智能分块策略，支持按语义边界切分长文档。输出格式支持 Markdown、JSON 和结构化 schema。性能方面，并发爬取速度提升 2.5 倍，内存占用降低 40%。',
    sourceId: 'src-003',
    sourceName: '掘金前端',
    sourceType: 'juejin',
    url: 'https://juejin.cn/post/crawl4ai-050',
    publishedAt: '2026-07-03 01:20',
    collectedAt: '28 分钟前',
    score: 76,
    tags: ['爬虫', '开源', 'Crawl4AI'],
    engine: 'patchright',
    processed: false,
  },
  {
    id: 'intel-010',
    title: 'Storm：斯坦福推出苏格拉底式研究智能体框架',
    summary:
      '斯坦福大学推出 Storm 框架，通过模拟维基百科编辑与领域专家的对话辩论，主动发现知识盲区并生成深度研究报告。',
    content:
      '斯坦福大学推出 Storm（Synthesis of Topic Outlines through Retrieval and Multi-perspective questioning）框架。Storm 模拟维基百科编辑与领域专家的多轮对话辩论，主动发现知识盲区并生成追问，最终合成深度研究报告。框架支持本地和云端 LLM，已开源至 GitHub。在维基百科级别长文生成任务上，Storm 生成的文章在事实准确性和结构完整性上显著优于基线方法。',
    sourceId: 'src-004',
    sourceName: '知乎 AI 话题',
    sourceType: 'zhihu',
    url: 'https://zhihu.com/question/storm-framework',
    publishedAt: '2026-07-03 00:45',
    collectedAt: '32 分钟前',
    score: 74,
    tags: ['斯坦福', 'Agent', '研究', '开源'],
    engine: 'patchright',
    processed: false,
  },
  {
    id: 'intel-011',
    title: 'Patchright 2.0：彻底修补 CDP 指纹泄漏，通过 Cloudflare 严苛检测',
    summary:
      'Patchright 2.0 发布，在 C++ 层面彻底移除 navigator.webdriver 等自动化特征，通过 Cloudflare Turnstile 等高难度指纹检测。',
    content:
      'Patchright 2.0 发布，作为 Playwright 的硬分叉版本，在源码层面修补了 CDP（Chrome DevTools Protocol）指纹泄漏。2.0 版本在 C++ 层面移除了 navigator.webdriver、Runtime.enable 等自动化特征，并通过 TLS 指纹伪造模拟真实浏览器。测试显示，Patchright 2.0 可通过 Cloudflare Turnstile、DataDome 和 PerimeterX 等主流反爬系统的检测。',
    sourceId: 'src-003',
    sourceName: '掘金前端',
    sourceType: 'juejin',
    url: 'https://juejin.cn/post/patchright-2',
    publishedAt: '2026-07-02 23:30',
    collectedAt: '35 分钟前',
    score: 72,
    tags: ['反爬', 'Patchright', '浏览器'],
    engine: 'patchright',
    processed: false,
  },
  {
    id: 'intel-012',
    title: 'Wiseflow 0.3：端到端情报获取框架，支持本地 7B 模型',
    summary:
      'Wiseflow 0.3 发布，轻量级自托管情报框架，原生支持本地 7B-9B 小模型，数据不出域，集成 Patchright 引擎。',
    content:
      'Wiseflow 0.3 发布，定位为端到端情报获取与分析应用框架。新版本原生支持本地部署的 7B-9B 参数小模型（如 Qwen2.5-7B），实现数据不出域的隐私保护。框架集成 Patchright 隐匿采集引擎和 Crawl4AI 智能解析，支持结构化情报输出和自动周报生成。采用 PocketBase 作为单文件数据库，部署成本接近零。',
    sourceId: 'src-006',
    sourceName: 'GitHub Trending',
    sourceType: 'github',
    url: 'https://github.com/Teamwiseflow/wiseflow',
    publishedAt: '2026-07-02 22:10',
    collectedAt: '40 分钟前',
    score: 70,
    tags: ['Wiseflow', '开源', '情报', '本地化'],
    engine: 'httpx',
    processed: false,
  },
]

// 周报
export const mockReports: WeeklyReport[] = [
  {
    id: 'rpt-2026-w27',
    title: 'AI 情报周报 · 2026 第 27 周',
    period: '2026-06-27 ~ 2026-07-03',
    generatedAt: '2026-07-03 08:00',
    eventGroups: 12,
    totalIntel: 347,
    highValueIntel: 89,
    status: 'completed',
    summary:
      '本周 AI 领域迎来密集发布期：OpenAI GPT-5、DeepSeek-V3 开源、Llama 4 多模态、Gemini 2.0 Flash 实时语音等多款重磅模型集中亮相，标志着大模型进入"百万 token + 原生多模态"新阶段。开源生态持续繁荣，DeepSeek-V3 以 557 万美元训练成本刷新性价比纪录。',
    markdown: `# AI 情报周报 · 2026 第 27 周

**周期**：2026-06-27 ~ 2026-07-03
**情报总量**：347 篇 | **高价值情报**：89 篇 | **事件组**：12 个

---

## 一、大模型密集发布：进入"百万 token + 原生多模态"新阶段

本周是 AI 大模型领域的"超级发布周"，OpenAI、DeepSeek、Meta、Google、Mistral、阿里等头部厂商集中发布新一代模型，呈现出两个显著趋势：

### 1.1 上下文窗口突破百万 token

OpenAI GPT-5 将上下文窗口从 128K 扩展至 **100 万 token**；Meta Llama 4 Scout 更是支持 **1000 万 token** 的超长上下文，成为目前商用/开源模型中最长的。这意味着模型可以一次性处理整本书籍、大型代码库或数小时的音视频内容，长文档理解、代码库级编程助手等应用场景将迎来质变。

### 1.2 原生多模态成为标配

GPT-5、Llama 4、Pixtral Large 等新模型均采用原生多模态架构，文本、图像、音频、视频在模型内部统一表征。Google Gemini 2.0 Flash 进一步实现了 **200ms 端到端实时语音对话**，可感知用户情绪和背景声音，标志着多模态交互从"能处理"迈向"实时流畅"。

---

## 二、开源生态：DeepSeek-V3 以 557 万美元刷新性价比

### 2.1 DeepSeek-V3 开源震撼业界

DeepSeek 发布 V3 模型并完全开源，采用 **671B 参数 MoE 架构**（激活 37B），训练仅使用 2048 张 H800 GPU、耗时 2 个月，总成本约 **557 万美元**——不到 GPT-4 训练成本的 1/20。模型在 MMLU、HumanEval 等基准上达到或超过 GPT-4o 水平，MIT 协议开源。这一发布重新定义了大模型的"性价比天花板"。

### 2.2 国产模型集体突破

阿里 Qwen2.5-Max 在 LMSYS Arena Hard 盲测中以 **1358 分登顶全球第一**，超越 GPT-4o 和 Claude 3.5 Sonnet。结合 DeepSeek-V3 的开源，国产大模型在性能和成本两个维度均达到世界领先水平。

---

## 三、Agent 与自动化：从脚本到意图驱动

### 3.1 桌面级 AI 自动化

Anthropic 推出 **Claude Computer Use**，允许 AI 直接操作电脑桌面（截屏、移动鼠标、点击、输入），在 OSWorld 基准上完成率达 22%。这标志着 AI Agent 从"API 调用"迈向"GUI 操作"的新阶段。

### 3.2 浏览器自动化框架成熟

Browser-Use 1.0 和 Patchright 2.0 同步发布：前者将 LLM 推理映射为浏览器操作，后者在 C++ 层面彻底修补 CDP 指纹泄漏，通过 Cloudflare 等严苛反爬检测。两者结合，为 AI Agent 的网页交互提供了完整的"隐匿 + 智能化"技术栈。

---

## 四、情报采集技术栈演进

本周情报采集领域也有重要进展：Crawl4AI 0.5 引入自适应爬取树裁剪和智能分块；Wiseflow 0.3 实现端到端情报框架的本地化部署，原生支持 7B 小模型；斯坦福 Storm 框架展示了苏格拉底式研究范式。这些工具共同推动数据获取从"自动化抓取"向"智能体编排"演进。

---

## 五、下周关注

1. GPT-5 API 定价策略对开发者生态的影响
2. DeepSeek-V3 开源后的社区复现与微调进展
3. Claude Computer Use 在企业 RPA 场景的落地
4. Llama 4 超长上下文的实际应用案例

---

*本报告由 AI情报官 自动生成 · 基于 map-reduce 流水线 · 语义聚类 12 个事件组*`,
  },
  {
    id: 'rpt-2026-w26',
    title: 'AI 情报周报 · 2026 第 26 周',
    period: '2026-06-20 ~ 2026-06-26',
    generatedAt: '2026-06-26 08:00',
    eventGroups: 9,
    totalIntel: 298,
    highValueIntel: 71,
    status: 'completed',
    summary:
      '本周 AI Agent 框架成为焦点：MCP 协议生态扩张、多智能体协作框架涌现、RAG 技术向 Agentic RAG 演进。同时，端侧大模型部署方案成熟，Apple Intelligence 与高通骁龙 X Elite 展示本地推理能力。',
    markdown: `# AI 情报周报 · 2026 第 26 周

**周期**：2026-06-20 ~ 2026-06-26
**情报总量**：298 篇 | **高价值情报**：71 篇 | **事件组**：9 个

---

## 一、AI Agent 框架生态扩张

本周 AI Agent 领域呈现爆发态势...

## 二、端侧大模型部署成熟

Apple Intelligence 与高通骁龙 X Elite...

---

*本报告由 AI情报官 自动生成*`,
  },
  {
    id: 'rpt-2026-w28',
    title: 'AI 情报周报 · 2026 第 28 周',
    period: '2026-07-04 ~ 2026-07-10',
    generatedAt: '',
    eventGroups: 0,
    totalIntel: 0,
    highValueIntel: 0,
    status: 'scheduled',
    summary: '将于 2026-07-10 08:00 自动生成',
    markdown: '',
  },
]

// 引擎配置
export const mockEngines: EngineConfig[] = [
  {
    type: 'httpx',
    name: 'HTTPX 请求',
    description: '传统 CMS、静态博客，直诉 HTTP 请求，资源消耗低',
    enabled: true,
    suitableFor: ['RSS', '静态博客', 'REST API', '无风控站点'],
    config: {
      timeout: 30,
      maxConnections: 100,
      retryCount: 3,
      userAgent: 'WiseflowBot/0.3',
    },
    stats: { requests: 12453, successRate: 98.7, avgLatency: 245 },
  },
  {
    type: 'patchright',
    name: '隐匿渲染',
    description: '动态网页、新闻门户，CDP 指纹修补，TLS 伪造',
    enabled: true,
    suitableFor: ['动态网页', '新闻门户', 'SPA 应用', '中等风控站点'],
    config: {
      headless: true,
      stealthLevel: 'high',
      proxyRotation: true,
      viewportWidth: 1920,
      viewportHeight: 1080,
    },
    stats: { requests: 5682, successRate: 94.2, avgLatency: 3200 },
  },
  {
    type: 'cdp',
    name: '环境接管',
    description: '长身份验证社交媒体，复用本地登录态，零侵入',
    enabled: true,
    suitableFor: ['微信公众号', '微博', '知乎', '需登录平台'],
    config: {
      cdpPort: 9222,
      sessionPersist: true,
      cookieReuse: true,
      heartbeatInterval: 60,
    },
    stats: { requests: 2104, successRate: 99.1, avgLatency: 1800 },
  },
  {
    type: 'crawl4ai',
    name: '智能解析',
    description: '文档、论文，DOM 转 Markdown，大模型友好输出',
    enabled: true,
    suitableFor: ['学术论文', '技术文档', '结构化站点', 'PDF 文档'],
    config: {
      outputFormat: 'markdown',
      chunkStrategy: 'semantic',
      pruneTree: true,
      maxDepth: 3,
    },
    stats: { requests: 1876, successRate: 96.5, avgLatency: 1500 },
  },
]

// 架构层
export const mockArchitecture: ArchitectureLayer[] = [
  {
    id: 'perception',
    name: '感知层',
    nameEn: 'Perception',
    icon: 'Radar',
    color: 'emerald',
    description: '负责与互联网环境交互，以 Patchright 替代传统 WebDriver，在底层修补 CDP 协议指纹，有效规避 Cloudflare 等 WAF 检测。',
    modules: [
      { name: 'HTTPX 引擎', tech: 'Python + HTTPX', desc: '传统 CMS、静态博客直诉请求' },
      { name: 'Patchright 引擎', tech: 'Playwright 硬分叉', desc: 'CDP 指纹修补，隐匿渲染' },
      { name: 'CDP 接管', tech: 'Chrome DevTools Protocol', desc: '复用本地登录态，零侵入' },
      { name: 'Crawl4AI', tech: '异步爬虫框架', desc: 'DOM 转 Markdown，智能分块' },
    ],
  },
  {
    id: 'cognition',
    name: '认知层',
    nameEn: 'Cognition',
    icon: 'Brain',
    color: 'violet',
    description: '负责信息理解和过滤，利用 GNE 算法去除 HTML 噪声，调用大语言模型进行二分类筛选，精准识别高价值情报。',
    modules: [
      { name: 'GNE 噪声去除', tech: 'GenerelNewsExtractor', desc: 'HTML 主体内容提取' },
      { name: 'LLM 二分类', tech: 'SiliconFlow Qwen/DeepSeek', desc: '语义评分，高价值筛选' },
      { name: '语义去重', tech: '向量相似度', desc: '跨源重复情报合并' },
      { name: '标签提取', tech: 'NER + LLM', desc: '自动打标，主题归类' },
    ],
  },
  {
    id: 'memory',
    name: '记忆层',
    nameEn: 'Memory',
    icon: 'Database',
    color: 'amber',
    description: '负责状态管理与持久化，采用 PocketBase SQLiteWAL 模式作为单文件数据库，存储原始数据、清洗后情报与用户配置。',
    modules: [
      { name: 'PocketBase', tech: 'Go + SQLite WAL', desc: '单文件部署，实时订阅' },
      { name: '原始数据表', tech: 'SQLite', desc: '存储采集原始 HTML/JSON' },
      { name: '情报表', tech: 'SQLite', desc: '清洗后结构化情报' },
      { name: '实时订阅', tech: 'Server-Sent Events', desc: '前端秒级推送' },
    ],
  },
  {
    id: 'expression',
    name: '表达层',
    nameEn: 'Expression',
    icon: 'FileText',
    color: 'rose',
    description: '负责情报再加工，通过 map-reduce 算法对碎片信息进行聚类、去重和深度总结，自动生成 AI 周报。',
    modules: [
      { name: 'Map 原子化', tech: 'LLM 摘要', desc: '每日生成 100 字核心摘要' },
      { name: 'Shuffle 聚类', tech: '语义向量聚类', desc: '合并重复报道为事件组' },
      { name: 'Reduce 综述', tech: 'LLM 深度分析', desc: '生成深度分析段落' },
      { name: 'Markdown 拼接', tech: '模板引擎', desc: '最终拼接为完整报告' },
    ],
  },
]

// 系统状态
export const mockSystemStats: SystemStats = {
  todayCollected: 247,
  highValueToday: 38,
  activeSources: 8,
  totalSources: 10,
  engineLoad: 67,
  storageUsed: 1.2,
  storageTotal: 10,
  modelCalls: 1842,
  uptime: '14天 6小时',
}

// 采集趋势数据（最近7天）
export const collectTrend = [
  { date: '06-27', total: 198, highValue: 32, name: '周六' },
  { date: '06-28', total: 215, highValue: 41, name: '周日' },
  { date: '06-29', total: 187, highValue: 28, name: '周一' },
  { date: '06-30', total: 234, highValue: 45, name: '周二' },
  { date: '07-01', total: 256, highValue: 52, name: '周三' },
  { date: '07-02', total: 289, highValue: 61, name: '周四' },
  { date: '07-03', total: 247, highValue: 38, name: '周五' },
]

// 信息源类型分布
export const sourceDistribution = [
  { name: 'RSS', value: 2, color: '#fb923c' },
  { name: '微信公众号', value: 2, color: '#4ade80' },
  { name: '掘金', value: 1, color: '#60a5fa' },
  { name: '知乎', value: 1, color: '#22d3ee' },
  { name: '谷歌学术', value: 2, color: '#c084fc' },
  { name: 'GitHub', value: 1, color: '#a78bfa' },
  { name: 'Web', value: 1, color: '#38bdf8' },
]

// 引擎调度分布
export const engineDispatch = [
  { engine: 'HTTPX', count: 12453, color: '#34d399' },
  { engine: 'Patchright', count: 5682, color: '#fbbf24' },
  { engine: 'CDP 接管', count: 2104, color: '#fb7185' },
  { engine: 'Crawl4AI', count: 1876, color: '#c084fc' },
]

// 实时活动日志
export const activityLog = [
  { time: '09:32:15', level: 'success', engine: 'CDP', source: '机器之心', message: '采集完成，新增 3 篇情报，1 篇高价值' },
  { time: '09:31:48', level: 'info', engine: 'Crawl4AI', source: 'arXiv CS.AI', message: '解析论文 PDF，输出 Markdown' },
  { time: '09:30:22', level: 'success', engine: 'HTTPX', source: 'Hacker News', message: 'RSS 拉取成功，新增 12 条' },
  { time: '09:29:55', level: 'warning', engine: 'Patchright', source: 'InfoQ 中文站', message: 'Cloudflare 检测，启动隐匿模式重试' },
  { time: '09:28:30', level: 'success', engine: 'LLM', source: '认知层', message: '语义筛选完成，38/247 标记为高价值' },
  { time: '09:27:12', level: 'info', engine: 'CDP', source: '量子位', message: '复用本地登录态，采集 5 篇' },
  { time: '09:26:45', level: 'success', engine: 'Patchright', source: '掘金前端', message: '动态渲染完成，提取 8 篇文章' },
  { time: '09:25:18', level: 'error', engine: 'HTTPX', source: 'TechCrunch', message: '连接超时，已加入重试队列' },
  { time: '09:24:02', level: 'success', engine: 'Crawl4AI', source: 'Papers with Code', message: '智能分块完成，输出 4 篇论文摘要' },
  { time: '09:22:33', level: 'info', engine: 'LLM', source: '表达层', message: 'Map 阶段：生成 12 条原子摘要' },
]
