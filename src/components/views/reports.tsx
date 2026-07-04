'use client'

import { useState } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { mockReports } from '@/lib/mock-data'
import type { WeeklyReport } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ReportsView() {
  const [reports, setReports] = useState<WeeklyReport[]>(mockReports)
  const [selected, setSelected] = useState<WeeklyReport | null>(mockReports[0])
  const [generating, setGenerating] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(0)

  const handleGenerate = async () => {
    setGenerating(true)
    setPipelineStep(0)

    // 模拟 map-reduce 流水线
    const steps = [
      { step: 1, label: 'Map 原子化', desc: '调用 LLM 生成 100 字核心摘要', delay: 1500 },
      { step: 2, label: 'Shuffle 聚类', desc: '语义聚类，合并重复报道', delay: 1500 },
      { step: 3, label: 'Reduce 综述', desc: '生成深度分析段落', delay: 1500 },
      { step: 4, label: '拼接 Markdown', desc: '组装最终周报', delay: 1000 },
    ]

    for (const s of steps) {
      setPipelineStep(s.step)
      await new Promise((r) => setTimeout(r, s.delay))
    }

    const newReport: WeeklyReport = {
      id: `rpt-${Date.now()}`,
      title: `AI 情报周报 · 第 ${reports.length + 1} 期`,
      period: '2026.06.27 - 2026.07.03',
      generatedAt: '刚刚',
      eventGroups: 8,
      totalIntel: 247,
      highValueIntel: 38,
      status: 'completed',
      summary: '本周 AI 领域呈现多线并进态势：大模型推理能力持续突破，Agent 框架走向成熟，开源生态活跃度创新高。',
      markdown: `# AI 情报周报 · 第 ${reports.length + 1} 期\n\n**周期**: 2026.06.27 - 2026.07.03\n\n## 本周概览\n\n本周共采集情报 247 篇，经语义筛选标记高价值情报 38 篇，聚类为 8 个事件组。\n\n## 重点事件\n\n### 1. 大模型推理能力突破\n\n多家厂商发布新一代推理模型，在数学、代码等任务上表现显著提升。稀疏注意力机制成为主流方向，在保持性能的同时大幅降低推理成本。\n\n### 2. Agent 框架走向成熟\n\n多智能体协作框架迎来爆发期，Browser-Use、Storm 等项目展示了从脚本自动化向意图驱动自动化的跨越。MCP 协议逐步成为智能体间通信标准。\n\n### 3. 开源生态持续活跃\n\nCrawl4AI、Patchright 等基础设施项目获得广泛关注，为大模型场景优化的数据采集工具链日趋完善。\n\n## 趋势分析\n\n- **技术方向**: 推理优化、多模态融合、Agent 编排\n- **产业动态**: 开源与闭源路线并行，端侧部署成为新焦点\n- **值得关注**: MCP 协议标准化进程、浏览器自动化反检测技术\n\n## 下周展望\n\n预计 Agent 协作与浏览器自动化将持续升温，建议关注 MCP 生态进展及 Patchright 等隐匿采集技术的演进。`,
    }

    setReports((prev) => [newReport, ...prev])
    setSelected(newReport)
    setGenerating(false)
    setPipelineStep(0)
    toast.success('周报生成完成！')
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <DynamicIcon name="FileText" className="h-6 w-6 text-primary" />
            AI 周报
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Map-Reduce 自动化流水线 · 原子化 → 语义聚类 → 深度综述
          </p>
        </div>
        <Button size="sm" onClick={handleGenerate} disabled={generating}>
          <DynamicIcon
            name={generating ? 'RefreshCw' : 'Sparkles'}
            className={cn('h-4 w-4 mr-1.5', generating && 'animate-spin')}
          />
          {generating ? '生成中...' : '立即生成周报'}
        </Button>
      </div>

      {/* Map-Reduce 流水线可视化 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name="Workflow" className="h-4 w-4 text-primary" />
            Map-Reduce 自动化流水线
          </CardTitle>
          <CardDescription className="text-xs">
            系统按"原子化处理 → 语义聚类 → 深度综述"流水线自动生成简报
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <PipelineStep
              step={1}
              icon="Zap"
              title="Map 原子化"
              desc="每日对新入内容调用 LLM 生成 100 字核心摘要"
              active={generating && pipelineStep >= 1}
              done={generating && pipelineStep > 1}
              color="emerald"
            />
            <PipelineStep
              step={2}
              icon="Layers"
              title="Shuffle 聚类"
              desc="每周五汇总高分情报，语义聚类合并重复报道"
              active={generating && pipelineStep >= 2}
              done={generating && pipelineStep > 2}
              color="violet"
            />
            <PipelineStep
              step={3}
              icon="Brain"
              title="Reduce 综述"
              desc="针对每个事件组，综合用户关注点生成深度分析"
              active={generating && pipelineStep >= 3}
              done={generating && pipelineStep > 3}
              color="amber"
            />
            <PipelineStep
              step={4}
              icon="FileText"
              title="拼接 Markdown"
              desc="最终拼接成 Markdown 报告"
              active={generating && pipelineStep >= 4}
              done={generating && pipelineStep > 4}
              color="sky"
            />
          </div>
          {generating && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {pipelineStep === 1 && '正在生成原子摘要...'}
                  {pipelineStep === 2 && '正在语义聚类...'}
                  {pipelineStep === 3 && '正在生成深度综述...'}
                  {pipelineStep === 4 && '正在拼接 Markdown...'}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {pipelineStep * 25}%
                </span>
              </div>
              <Progress value={pipelineStep * 25} className="h-1.5" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 周报列表 + 详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 周报列表 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">历史周报 ({reports.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 p-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all',
                      selected?.id === r.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30 hover:bg-accent/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-medium leading-snug flex-1">{r.title}</h4>
                      <ReportStatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{r.period}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DynamicIcon name="Layers" className="h-3 w-3" />
                        {r.eventGroups} 事件组
                      </span>
                      <span className="flex items-center gap-1">
                        <DynamicIcon name="Target" className="h-3 w-3" />
                        {r.highValueIntel} 高价值
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/70 mt-1.5">
                      生成于 {r.generatedAt}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 周报详情 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{selected?.title}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {selected?.period} · 生成于 {selected?.generatedAt}
                </CardDescription>
              </div>
              {selected && (
                <Button variant="outline" size="sm">
                  <DynamicIcon name="Download" className="h-4 w-4 mr-1.5" />
                  导出
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selected ? (
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {/* 概览统计 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-xl font-bold text-primary tabular-nums">
                        {selected.totalIntel}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">总情报数</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-xl font-bold text-amber-400 tabular-nums">
                        {selected.highValueIntel}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">高价值情报</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <p className="text-xl font-bold text-violet-400 tabular-nums">
                        {selected.eventGroups}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">事件组</p>
                    </div>
                  </div>

                  {/* 摘要 */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-primary mb-1.5 flex items-center gap-1.5">
                      <DynamicIcon name="Sparkles" className="h-3.5 w-3.5" />
                      AI 综述摘要
                    </p>
                    <p className="text-sm leading-relaxed">{selected.summary}</p>
                  </div>

                  {/* Markdown 内容 */}
                  <div className="prose prose-invert prose-sm max-w-none">
                    <MarkdownRenderer content={selected.markdown} />
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <DynamicIcon name="FileText" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">选择一份周报查看详情</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PipelineStep({
  step,
  icon,
  title,
  desc,
  active,
  done,
  color,
}: {
  step: number
  icon: string
  title: string
  desc: string
  active: boolean
  done: boolean
  color: 'emerald' | 'violet' | 'amber' | 'sky'
}) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  }
  return (
    <div
      className={cn(
        'relative p-3 rounded-lg border transition-all',
        done
          ? colorMap[color]
          : active
          ? 'border-primary bg-primary/5 pulse-glow'
          : 'border-border bg-card/50'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold',
            done ? colorMap[color] : active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          {done ? <DynamicIcon name="CheckCircle2" className="h-4 w-4" /> : step}
        </div>
        <DynamicIcon
          name={icon}
          className={cn('h-4 w-4', done ? '' : active ? 'text-primary' : 'text-muted-foreground')}
        />
      </div>
      <h4 className="text-sm font-medium mb-1">{title}</h4>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

function ReportStatusBadge({ status }: { status: WeeklyReport['status'] }) {
  const map = {
    completed: { label: '已完成', color: 'text-emerald-400 bg-emerald-500/10' },
    generating: { label: '生成中', color: 'text-amber-400 bg-amber-500/10' },
    scheduled: { label: '已排期', color: 'text-sky-400 bg-sky-500/10' },
  }
  const m = map[status]
  return (
    <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0', m.color)}>
      {m.label}
    </span>
  )
}

// 简易 Markdown 渲染
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-1 my-3 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed flex gap-2">
              <span className="text-primary shrink-0">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  lines.forEach((line, idx) => {
    if (line.startsWith('# ')) {
      flushList()
      elements.push(
        <h1 key={idx} className="text-lg font-bold mt-4 mb-2">
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={idx} className="text-base font-semibold mt-4 mb-2 text-primary flex items-center gap-2">
          <DynamicIcon name="ChevronRight" className="h-4 w-4" />
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={idx} className="text-sm font-semibold mt-3 mb-1.5 text-foreground">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2))
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      elements.push(
        <p key={idx} className="text-sm leading-relaxed text-foreground/90 my-1.5">
          {renderInline(line)}
        </p>
      )
    }
  })
  flushList()

  return <div>{elements}</div>
}

function renderInline(text: string): React.ReactNode {
  // 处理 **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}
