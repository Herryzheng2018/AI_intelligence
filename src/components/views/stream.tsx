'use client'

import { useState, useMemo } from 'react'
import { DynamicIcon } from '../icon'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { mockIntelligence, sourceTypeMeta, engineMeta } from '@/lib/mock-data'
import type { Intelligence } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StreamView() {
  const [intel, setIntel] = useState<Intelligence[]>(mockIntelligence)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSource, setFilterSource] = useState('all')
  const [filterScore, setFilterScore] = useState('all')
  const [filterEngine, setFilterEngine] = useState('all')
  const [selected, setSelected] = useState<Intelligence | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const filtered = useMemo(() => {
    return intel
      .filter((i) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          if (!i.title.toLowerCase().includes(q) && !i.summary.toLowerCase().includes(q))
            return false
        }
        if (filterSource !== 'all' && i.sourceType !== filterSource) return false
        if (filterEngine !== 'all' && i.engine !== filterEngine) return false
        if (filterScore === 'high' && i.score < 90) return false
        if (filterScore === 'medium' && (i.score < 70 || i.score >= 90)) return false
        if (filterScore === 'low' && i.score >= 70) return false
        return true
      })
      .sort((a, b) => b.score - a.score)
  }, [intel, searchQuery, filterSource, filterScore, filterEngine])

  const handleRefresh = () => {
    // 模拟刷新
    const newIntel: Intelligence = {
      id: `intel-${Date.now()}`,
      title: '【实时】OpenAI 发布 GPT-5 Turbo，推理速度提升 3 倍',
      summary: 'OpenAI 今日发布 GPT-5 Turbo 模型，在保持原有能力的基础上，推理速度提升 3 倍，成本降低 60%。该模型采用新的稀疏注意力机制，支持 128K 上下文窗口。',
      content: '详细内容...',
      sourceId: 'src-001',
      sourceName: 'Hacker News',
      sourceType: 'rss',
      url: 'https://news.ycombinator.com/',
      publishedAt: '刚刚',
      collectedAt: '刚刚',
      score: 95,
      tags: ['AI', 'GPT-5', 'OpenAI'],
      engine: 'httpx',
      processed: true,
    }
    setIntel((prev) => [newIntel, ...prev])
  }

  const stats = {
    total: intel.length,
    high: intel.filter((i) => i.score >= 90).length,
    medium: intel.filter((i) => i.score >= 70 && i.score < 90).length,
    low: intel.filter((i) => i.score < 70).length,
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <DynamicIcon name="Newspaper" className="h-6 w-6 text-primary" />
            情报流
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            语义智能筛选 · LLM 替代关键词匹配 · 精准识别高价值情报
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <span className="relative flex h-2 w-2 mr-1.5">
              {autoRefresh && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75 animate-ping" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
            {autoRefresh ? '实时监听' : '已暂停'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <DynamicIcon name="RefreshCw" className="h-4 w-4 mr-1.5" />
            刷新
          </Button>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreStat label="情报总数" value={stats.total} color="text-primary" />
        <ScoreStat label="高价值 (≥90)" value={stats.high} color="text-rose-400" />
        <ScoreStat label="中价值 (70-89)" value={stats.medium} color="text-amber-400" />
        <ScoreStat label="低价值 (<70)" value={stats.low} color="text-muted-foreground" />
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <DynamicIcon
                name="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                placeholder="搜索情报标题或摘要..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="来源" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部来源</SelectItem>
                {Object.entries(sourceTypeMeta).map(([key, meta]) => (
                  <SelectItem key={key} value={key}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEngine} onValueChange={setFilterEngine}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="引擎" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部引擎</SelectItem>
                {Object.entries(engineMeta).map(([key, meta]) => (
                  <SelectItem key={key} value={key}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterScore} onValueChange={setFilterScore}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="评分" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部评分</SelectItem>
                <SelectItem value="high">高价值 (≥90)</SelectItem>
                <SelectItem value="medium">中价值 (70-89)</SelectItem>
                <SelectItem value="low">低价值 (&lt;70)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 情报列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 列表 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  情报列表 ({filtered.length})
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  按语义评分排序
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-3">
                  {filtered.map((item) => (
                    <IntelCard
                      key={item.id}
                      intel={item}
                      onClick={() => setSelected(item)}
                      selected={selected?.id === item.id}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <DynamicIcon name="Search" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">未找到匹配的情报</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 详情面板 */}
        <div className="hidden lg:block">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name="FileText" className="h-4 w-4 text-primary" />
                情报详情
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <IntelDetail intel={selected} />
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <DynamicIcon name="ChevronRight" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">点击左侧情报查看详情</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 移动端详情 Sheet */}
      <Sheet open={!!selected && window.innerWidth < 1024} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>情报详情</SheetTitle>
          </SheetHeader>
          {selected && <IntelDetail intel={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ScoreStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className={cn('text-2xl font-bold tabular-nums', color)}>{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

function IntelCard({
  intel,
  onClick,
  selected,
}: {
  intel: Intelligence
  onClick: () => void
  selected: boolean
}) {
  const scoreColor =
    intel.score >= 90
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      : intel.score >= 80
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : intel.score >= 70
      ? 'text-primary bg-primary/10 border-primary/20'
      : 'text-muted-foreground bg-muted/30 border-border'

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg border cursor-pointer transition-all',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-accent/30'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex flex-col items-center justify-center w-12 h-12 rounded-lg border shrink-0',
            scoreColor
          )}
        >
          <span className="text-lg font-bold tabular-nums leading-none">{intel.score}</span>
          <span className="text-[9px] mt-0.5">语义分</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium leading-snug line-clamp-2">{intel.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{intel.summary}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] h-5">
              <DynamicIcon
                name={sourceTypeMeta[intel.sourceType].icon}
                className={cn('h-2.5 w-2.5 mr-1', sourceTypeMeta[intel.sourceType].color)}
              />
              {intel.sourceName}
            </Badge>
            <Badge variant="outline" className="text-[10px] h-5">
              <DynamicIcon
                name={engineMeta[intel.engine].icon}
                className={cn('h-2.5 w-2.5 mr-1', engineMeta[intel.engine].color)}
              />
              {engineMeta[intel.engine].label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{intel.collectedAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function IntelDetail({ intel }: { intel: Intelligence }) {
  const scoreColor =
    intel.score >= 90
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      : intel.score >= 80
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : intel.score >= 70
      ? 'text-primary bg-primary/10 border-primary/20'
      : 'text-muted-foreground bg-muted/30 border-border'

  return (
    <div className="space-y-4">
      {/* 评分 */}
      <div className={cn('flex items-center gap-3 p-3 rounded-lg border', scoreColor)}>
        <div className="text-center">
          <p className="text-3xl font-bold tabular-nums leading-none">{intel.score}</p>
          <p className="text-[10px] mt-1">语义评分</p>
        </div>
        <div className="flex-1">
          <p className="text-xs">
            {intel.score >= 90
              ? '高价值情报 · 建议重点关注'
              : intel.score >= 80
              ? '中高价值 · 可纳入周报'
              : intel.score >= 70
              ? '中等价值 · 已归档'
              : '低价值 · 已过滤'}
          </p>
          <p className="text-[10px] opacity-70 mt-1">
            由 LLM 语义分析生成，替代传统关键词匹配
          </p>
        </div>
      </div>

      {/* 标题 */}
      <div>
        <h3 className="text-base font-semibold leading-snug">{intel.title}</h3>
      </div>

      {/* 元信息 */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          <DynamicIcon
            name={sourceTypeMeta[intel.sourceType].icon}
            className={cn('h-3 w-3 mr-1', sourceTypeMeta[intel.sourceType].color)}
          />
          {intel.sourceName}
        </Badge>
        <Badge variant="outline" className="text-xs">
          <DynamicIcon
            name={engineMeta[intel.engine].icon}
            className={cn('h-3 w-3 mr-1', engineMeta[intel.engine].color)}
          />
          {engineMeta[intel.engine].label}
        </Badge>
        <Badge variant="outline" className="text-xs">
          <DynamicIcon name="Clock" className="h-3 w-3 mr-1" />
          {intel.collectedAt}
        </Badge>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5">
        {intel.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary border border-primary/20"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 摘要 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">AI 摘要</p>
        <p className="text-sm leading-relaxed text-foreground/90">{intel.summary}</p>
      </div>

      {/* 原文链接 */}
      <Button variant="outline" size="sm" className="w-full" asChild>
        <a href={intel.url} target="_blank" rel="noopener noreferrer">
          <DynamicIcon name="ExternalLink" className="h-4 w-4 mr-1.5" />
          查看原文
        </a>
      </Button>
    </div>
  )
}
