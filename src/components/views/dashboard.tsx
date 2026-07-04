'use client'

import { useState, useEffect } from 'react'
import { DynamicIcon } from '../icon'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  mockSystemStats,
  collectTrend,
  sourceDistribution,
  engineDispatch,
  activityLog,
  mockIntelligence,
  mockSources,
  sourceTypeMeta,
  engineMeta,
} from '@/lib/mock-data'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { cn } from '@/lib/utils'

interface DashboardViewProps {
  onNavigate: (v: 'dashboard' | 'sources' | 'stream' | 'reports' | 'engines' | 'architecture') => void
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const [liveLog, setLiveLog] = useState(activityLog)

  // 模拟实时日志更新
  useEffect(() => {
    const messages = [
      { level: 'success', engine: 'HTTPX', source: 'Hacker News', message: 'RSS 拉取成功，新增 8 条' },
      { level: 'info', engine: 'Crawl4AI', source: 'arXiv CS.AI', message: '解析论文完成，输出 Markdown' },
      { level: 'success', engine: 'CDP', source: '机器之心', message: '采集完成，新增 2 篇高价值' },
      { level: 'info', engine: 'LLM', source: '认知层', message: '语义筛选：标记 5 篇高价值' },
      { level: 'warning', engine: 'Patchright', source: '知乎', message: '触发风控，启动隐匿重试' },
      { level: 'success', engine: 'Patchright', source: '掘金前端', message: '动态渲染完成，提取 6 篇' },
    ]
    const timer = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)]
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      setLiveLog((prev) => [{ time, ...msg }, ...prev].slice(0, 12))
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const stats = mockSystemStats
  const topIntel = [...mockIntelligence].sort((a, b) => b.score - a.score).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <DynamicIcon name="LayoutDashboard" className="h-6 w-6 text-primary" />
            指挥中心
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            7x24 小时主动巡航 · 多元异构数据监控 · 语义智能筛选
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('reports')}>
            <DynamicIcon name="FileText" className="h-4 w-4 mr-1.5" />
            查看周报
          </Button>
          <Button size="sm" onClick={() => onNavigate('sources')}>
            <DynamicIcon name="Plus" className="h-4 w-4 mr-1.5" />
            添加信息源
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="Newspaper"
          label="今日采集"
          value={stats.todayCollected}
          suffix="篇"
          trend="+12.5%"
          trendUp
          color="emerald"
        />
        <StatCard
          icon="Target"
          label="高价值情报"
          value={stats.highValueToday}
          suffix="篇"
          trend="+8.2%"
          trendUp
          color="amber"
        />
        <StatCard
          icon="Satellite"
          label="活跃信息源"
          value={`${stats.activeSources}/${stats.totalSources}`}
          suffix=""
          trend="2 个待处理"
          color="violet"
        />
        <StatCard
          icon="Cpu"
          label="引擎负载"
          value={stats.engineLoad}
          suffix="%"
          trend="正常"
          color="sky"
        />
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 采集趋势 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <DynamicIcon name="TrendingUp" className="h-4 w-4 text-primary" />
                  采集趋势 · 近 7 日
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  总采集量 vs 高价值情报量
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                <DynamicIcon name="Activity" className="h-3 w-3 mr-1" />
                实时
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={collectTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20,24,32,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                  name="总采集"
                />
                <Area
                  type="monotone"
                  dataKey="highValue"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  fill="url(#colorHigh)"
                  name="高价值"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 信息源分布 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DynamicIcon name="PieChart" className="h-4 w-4 text-primary" />
              信息源分布
            </CardTitle>
            <CardDescription className="text-xs">按类型统计</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20,24,32,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {sourceDistribution.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-muted-foreground truncate">{s.name}</span>
                  <span className="font-mono ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 引擎调度 + 实时日志 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 引擎调度统计 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DynamicIcon name="Workflow" className="h-4 w-4 text-primary" />
              引擎调度统计
            </CardTitle>
            <CardDescription className="text-xs">混合引擎调度策略</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={engineDispatch} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="engine"
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20,24,32,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {engineDispatch.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 实时活动日志 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name="Activity" className="h-4 w-4 text-primary" />
                实时活动日志
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs text-primary">LIVE</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[220px] pr-4">
              <div className="space-y-1.5">
                {liveLog.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs py-1.5 px-2 rounded hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-mono text-muted-foreground/70 shrink-0 tabular-nums">
                      {log.time}
                    </span>
                    <LogLevelBadge level={log.level} />
                    <span className="font-mono text-primary/80 shrink-0 w-16 truncate">
                      [{log.engine}]
                    </span>
                    <span className="text-muted-foreground shrink-0 max-w-[100px] truncate">
                      {log.source}
                    </span>
                    <span className="text-foreground/90 truncate">{log.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 四层架构状态 + Top 情报 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 四层架构状态 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DynamicIcon name="Layers" className="h-4 w-4 text-primary" />
              四层架构状态
            </CardTitle>
            <CardDescription className="text-xs">感知 · 认知 · 记忆 · 表达</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <LayerStatus
              icon="Radar"
              name="感知层"
              nameEn="Perception"
              status="运行中"
              detail="4 引擎在线 · 8 源活跃"
              color="emerald"
              load={67}
            />
            <LayerStatus
              icon="Brain"
              name="认知层"
              nameEn="Cognition"
              status="运行中"
              detail="GNE + LLM 二分类"
              color="violet"
              load={45}
            />
            <LayerStatus
              icon="Database"
              name="记忆层"
              nameEn="Memory"
              status="运行中"
              detail="PocketBase SQLiteWAL"
              color="amber"
              load={23}
            />
            <LayerStatus
              icon="FileText"
              name="表达层"
              nameEn="Expression"
              status="待命"
              detail="下次周报：07-10 08:00"
              color="rose"
              load={0}
            />
          </CardContent>
        </Card>

        {/* Top 高价值情报 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name="Target" className="h-4 w-4 text-amber-400" />
                今日 Top 高价值情报
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => onNavigate('stream')}
              >
                查看全部
                <DynamicIcon name="ChevronRight" className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topIntel.map((intel, idx) => (
                <div
                  key={intel.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => onNavigate('stream')}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold',
                      intel.score >= 90
                        ? 'bg-rose-500/15 text-rose-400'
                        : intel.score >= 80
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-primary/15 text-primary'
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {intel.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DynamicIcon
                          name={sourceTypeMeta[intel.sourceType].icon}
                          className={cn('h-3 w-3', sourceTypeMeta[intel.sourceType].color)}
                        />
                        {intel.sourceName}
                      </span>
                      <span>·</span>
                      <span>{intel.collectedAt}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end">
                    <span
                      className={cn(
                        'font-mono text-lg font-bold',
                        intel.score >= 90
                          ? 'text-rose-400'
                          : intel.score >= 80
                          ? 'text-amber-400'
                          : 'text-primary'
                      )}
                    >
                      {intel.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground">语义分</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 信息源状态概览 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <DynamicIcon name="Satellite" className="h-4 w-4 text-primary" />
              信息源状态概览
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => onNavigate('sources')}
            >
              管理信息源
              <DynamicIcon name="ChevronRight" className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {mockSources.slice(0, 5).map((src) => (
              <div
                key={src.id}
                className="p-3 rounded-lg border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <DynamicIcon
                    name={sourceTypeMeta[src.type].icon}
                    className={cn('h-4 w-4', sourceTypeMeta[src.type].color)}
                  />
                  <SourceStatusDot status={src.status} />
                </div>
                <p className="text-sm font-medium truncate">{src.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{src.lastCollect}</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-muted-foreground">
                    引擎:{' '}
                    <span className={engineMeta[src.engine].color}>
                      {engineMeta[src.engine].label}
                    </span>
                  </span>
                  <span className="font-mono text-primary">{src.highValueCount}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 统计卡片
function StatCard({
  icon,
  label,
  value,
  suffix,
  trend,
  trendUp,
  color,
}: {
  icon: string
  label: string
  value: string | number
  suffix: string
  trend: string
  trendUp?: boolean
  color: 'emerald' | 'amber' | 'violet' | 'sky'
}) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
    sky: 'text-sky-400 bg-sky-500/10',
  }
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={cn('p-2 rounded-lg', colorMap[color])}>
            <DynamicIcon name={icon} className="h-4 w-4" />
          </div>
          <span
            className={cn(
              'text-xs font-medium',
              trendUp ? 'text-emerald-400' : 'text-muted-foreground'
            )}
          >
            {trend}
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums">{value}</span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// 日志级别徽章
function LogLevelBadge({ level }: { level: string }) {
  const map: Record<string, { color: string; icon: string }> = {
    success: { color: 'text-emerald-400 bg-emerald-500/10', icon: 'CheckCircle2' },
    info: { color: 'text-sky-400 bg-sky-500/10', icon: 'Info' },
    warning: { color: 'text-amber-400 bg-amber-500/10', icon: 'AlertTriangle' },
    error: { color: 'text-rose-400 bg-rose-500/10', icon: 'XCircle' },
  }
  const m = map[level] || map.info
  return (
    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0', m.color)}>
      <DynamicIcon name={m.icon} className="h-2.5 w-2.5" />
      {level}
    </span>
  )
}

// 架构层状态
function LayerStatus({
  icon,
  name,
  nameEn,
  status,
  detail,
  color,
  load,
}: {
  icon: string
  name: string
  nameEn: string
  status: string
  detail: string
  color: 'emerald' | 'violet' | 'amber' | 'rose'
  load: number
}) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }
  return (
    <div className="flex items-center gap-3">
      <div className={cn('p-2 rounded-lg border', colorMap[color])}>
        <DynamicIcon name={icon} className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            {nameEn}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{detail}</p>
      </div>
      <div className="shrink-0 text-right">
        <Badge variant="outline" className="text-[10px] h-5 mb-1">
          {status}
        </Badge>
        <div className="flex items-center gap-1.5">
          <Progress value={load} className="h-1 w-14" />
          <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{load}%</span>
        </div>
      </div>
    </div>
  )
}

// 信息源状态点
function SourceStatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-emerald-400',
    idle: 'bg-amber-400',
    error: 'bg-rose-400',
    paused: 'bg-muted-foreground',
  }
  return (
    <span className="relative flex h-2 w-2">
      {status === 'active' && (
        <span
          className={cn('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', map[status])}
        />
      )}
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', map[status])} />
    </span>
  )
}
