'use client'

import { DynamicIcon } from '../icon'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockArchitecture as architectureLayers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

// 颜色名称到实际颜色值的映射
const colorMap: Record<string, string> = {
  emerald: '#34d399',
  violet: '#c084fc',
  amber: '#fbbf24',
  rose: '#fb7185',
  sky: '#38bdf8',
}

export function ArchitectureView() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <DynamicIcon name="Network" className="h-6 w-6 text-primary" />
          系统架构
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          感知 · 认知 · 记忆 · 表达 — 四层分布式智能体架构
        </p>
      </div>

      {/* 架构概览图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name="Layers" className="h-4 w-4 text-primary" />
            四层架构总览
          </CardTitle>
          <CardDescription className="text-xs">
            基于 Wiseflow 框架，从数据采集到情报产出的端到端流水线
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {architectureLayers.map((layer, idx) => (
              <div key={layer.id}>
                <ArchitectureLayerCard layer={layer} index={idx} />
                {idx < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <DynamicIcon name="ChevronDown" className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 核心特性 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard
          icon="Radar"
          title="主动巡航"
          desc="7x24 小时全天候监控多元异构数据源（web、social、paper、code），从'人找信息'转变为'信息找人'"
          color="emerald"
        />
        <FeatureCard
          icon="Brain"
          title="语义筛选"
          desc="利用大语言模型替代关键词匹配，精准识别高价值情报，GNE 算法 + LLM 双重处理"
          color="violet"
        />
        <FeatureCard
          icon="Workflow"
          title="自动闭环"
          desc="自动完成从采集、清洗、分析到 AI 周报生成的全过程，Map-Reduce 流水线"
          color="amber"
        />
      </div>

      {/* 技术栈对比 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name="Server" className="h-4 w-4 text-primary" />
            业界技术栈对比
          </CardTitle>
          <CardDescription className="text-xs">
            从自动化抓取到智能体 — 摄取、交互、编排与语义四个维度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TechCompareCard
              category="摄取层"
              icon="Download"
              color="emerald"
              tools={[
                { name: 'FireCrawl', desc: '深层采集，网站转 Markdown API' },
                { name: 'Jina Reader', desc: 'Unix 哲学，URL 前缀返回清洗 Markdown' },
                { name: 'Crawl4AI', desc: '大模型优化，智能分块输出 JSON/MD' },
              ]}
            />
            <TechCompareCard
              category="交互层"
              icon="Eye"
              color="amber"
              tools={[
                { name: 'Playwright', desc: '行业标准，但 CDP 特征易被识别' },
                { name: 'Patchright', desc: '硬分叉版本，修补 CDP 泄漏' },
                { name: 'Browser-Use', desc: 'LLM 推理映射为浏览器操作' },
              ]}
            />
            <TechCompareCard
              category="编排层"
              icon="Network"
              color="violet"
              tools={[
                { name: 'Storm (Stanford)', desc: '苏格拉底式研究，多轮追问' },
                { name: 'MCP', desc: '黑盒式智能体 API，跨网站任务' },
                { name: 'Wiseflow', desc: '端到端情报获取与分析应用' },
              ]}
            />
            <TechCompareCard
              category="语义层"
              icon="Brain"
              color="sky"
              tools={[
                { name: 'GNE 算法', desc: '正文提取，去除噪声' },
                { name: 'Qwen2.5-72B', desc: '语义理解与评分' },
                { name: 'DeepSeek-V3', desc: '推理增强，深度分析' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Wiseflow 优势 */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name="Sparkles" className="h-4 w-4 text-primary" />
            Wiseflow 核心优势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <AdvantageItem
              icon="Package"
              title="端到端应用"
              desc="情报获取与分析一体化"
            />
            <AdvantageItem
              icon="Shield"
              title="轻量自托管"
              desc="单文件部署，数据隐私可控"
            />
            <AdvantageItem
              icon="FileText"
              title="结构化输出"
              desc="支持结构化情报与自动周报"
            />
            <AdvantageItem
              icon="Eye"
              title="隐匿采集"
              desc="集成 Patchright，接近零成本"
            />
          </div>
        </CardContent>
      </Card>

      {/* 参考项目 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name="Github" className="h-4 w-4 text-primary" />
            参考项目与工具
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ReferenceItem
              name="Wiseflow"
              role="本项目基础框架"
              desc="专注于轻量级信息提取与本地化大语言模型应用"
              url="https://github.com/Teamwiseflow/wiseflow"
            />
            <ReferenceItem
              name="Crawl4AI"
              role="智能解析引擎"
              desc="专为大模型设计的开源异步爬虫，支持 Markdown 输出与智能分块"
              url="https://github.com/unclecode/crawl4ai"
            />
            <ReferenceItem
              name="Patchright"
              role="隐匿采集核心"
              desc="修复了 CDP 指纹泄露的 Playwright 硬分叉版本"
              url="https://github.com/kaliiiiiiiiii-vinyzu/patchright"
            />
            <ReferenceItem
              name="Browser-Use"
              role="意图驱动自动化"
              desc="将大语言模型思维链转化为浏览器操作指令的 Python 库"
              url="https://github.com/browser-use/browser-use"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ArchitectureLayerCard({
  layer,
  index,
}: {
  layer: (typeof architectureLayers)[0]
  index: number
}) {
  const hexColor = colorMap[layer.color] || '#34d399'
  return (
    <div
      className={cn(
        'relative p-4 rounded-xl border bg-card/50 overflow-hidden',
        'border-l-4'
      )}
      style={{ borderLeftColor: hexColor }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 层信息 */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl shrink-0"
              style={{ backgroundColor: `${hexColor}20`, color: hexColor }}
            >
              <DynamicIcon name={layer.icon} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  L{index + 1}
                </span>
                <h3 className="text-base font-bold">{layer.name}</h3>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {layer.nameEn}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{layer.description}</p>
        </div>

        {/* 模块列表 */}
        <div className="md:col-span-2 space-y-2">
          {layer.modules.map((m) => (
            <div
              key={m.name}
              className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium">{m.name}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 font-mono"
                    style={{ color: hexColor, borderColor: `${hexColor}40` }}
                  >
                    {m.tech}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: string
  title: string
  desc: string
  color: 'emerald' | 'violet' | 'amber'
}) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }
  return (
    <Card>
      <CardContent className="p-5">
        <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg border mb-3', colorMap[color])}>
          <DynamicIcon name={icon} className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  )
}

function TechCompareCard({
  category,
  icon,
  color,
  tools,
}: {
  category: string
  icon: string
  color: 'emerald' | 'amber' | 'violet' | 'sky'
  tools: { name: string; desc: string }[]
}) {
  const colorMap = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400',
    sky: 'text-sky-400',
  }
  return (
    <div className="p-3 rounded-lg border border-border bg-card/50">
      <div className="flex items-center gap-2 mb-3">
        <DynamicIcon name={icon} className={cn('h-4 w-4', colorMap[color])} />
        <h4 className="text-sm font-medium">{category}</h4>
      </div>
      <div className="space-y-2">
        {tools.map((t) => (
          <div key={t.name} className="text-xs">
            <span className="font-medium">{t.name}</span>
            <span className="text-muted-foreground"> — {t.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdvantageItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg border border-primary/20 bg-card/50">
      <DynamicIcon name={icon} className="h-5 w-5 text-primary mb-2" />
      <h5 className="text-sm font-medium mb-1">{title}</h5>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

function ReferenceItem({
  name,
  role,
  desc,
  url,
}: {
  name: string
  role: string
  desc: string
  url: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50 hover:border-primary/30 transition-colors">
      <DynamicIcon name="Github" className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium">{name}</span>
          <Badge variant="secondary" className="text-[10px] h-5">
            {role}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{desc}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
        >
          {url}
          <DynamicIcon name="ExternalLink" className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
