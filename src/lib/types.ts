// AI情报官 - 类型定义

// 信息源类型
export type SourceType =
  | 'rss'
  | 'wechat'
  | 'juejin'
  | 'zhihu'
  | 'scholar'
  | 'github'
  | 'web'

// 采集引擎类型
export type EngineType =
  | 'httpx'      // HTTPX/requests 传统请求
  | 'patchright' // 隐匿渲染
  | 'cdp'        // 环境接管
  | 'crawl4ai'   // 智能解析

// 信息源状态
export type SourceStatus = 'active' | 'idle' | 'error' | 'paused'

// 信息源
export interface InfoSource {
  id: string
  name: string
  type: SourceType
  url: string
  engine: EngineType
  status: SourceStatus
  interval: number // 采集间隔(分钟)
  lastCollect: string
  totalCollected: number
  highValueCount: number
  tags: string[]
  favicon?: string
}

// 情报项
export interface Intelligence {
  id: string
  title: string
  summary: string
  content: string
  sourceId: string
  sourceName: string
  sourceType: SourceType
  url: string
  publishedAt: string
  collectedAt: string
  score: number // 语义评分 0-100
  tags: string[]
  engine: EngineType
  processed: boolean
}

// 周报
export interface WeeklyReport {
  id: string
  title: string
  period: string
  generatedAt: string
  eventGroups: number
  totalIntel: number
  highValueIntel: number
  status: 'completed' | 'generating' | 'scheduled'
  markdown: string
  summary: string
}

// 引擎配置
export interface EngineConfig {
  type: EngineType
  name: string
  description: string
  enabled: boolean
  suitableFor: string[]
  config: Record<string, string | number | boolean>
  stats: {
    requests: number
    successRate: number
    avgLatency: number
  }
}

// 架构层
export interface ArchitectureLayer {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
  description: string
  modules: { name: string; tech: string; desc: string }[]
}

// 系统状态
export interface SystemStats {
  todayCollected: number
  highValueToday: number
  activeSources: number
  totalSources: number
  engineLoad: number
  storageUsed: number
  storageTotal: number
  modelCalls: number
  uptime: string
}
