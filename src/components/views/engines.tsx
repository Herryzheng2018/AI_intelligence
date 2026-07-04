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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { mockEngines, engineMeta } from '@/lib/mock-data'
import type { EngineConfig } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function EnginesView() {
  const [engines, setEngines] = useState<EngineConfig[]>(mockEngines)
  const [modelProvider, setModelProvider] = useState('siliconflow')
  const [modelName, setModelName] = useState('Qwen2.5-72B-Instruct')
  const [apiKey, setApiKey] = useState('sk-••••••••••••••••')
  const [storageMode, setStorageMode] = useState('sqlite_wal')
  const [autoWeekly, setAutoWeekly] = useState(true)
  const [scoreThreshold, setScoreThreshold] = useState(70)

  const handleToggleEngine = (type: string) => {
    setEngines((prev) =>
      prev.map((e) => (e.type === type ? { ...e, enabled: !e.enabled } : e))
    )
    const engine = engines.find((e) => e.type === type)
    toast.success(`${engine?.name} 已${engine?.enabled ? '禁用' : '启用'}`)
  }

  const handleSaveSettings = () => {
    toast.success('设置已保存')
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <DynamicIcon name="Settings" className="h-6 w-6 text-primary" />
          引擎与模型设置
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          采集引擎调度 · LLM 模型配置 · 存储方案 · 自动化策略
        </p>
      </div>

      <Tabs defaultValue="engines">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto">
          <TabsTrigger value="engines">采集引擎</TabsTrigger>
          <TabsTrigger value="model">LLM 模型</TabsTrigger>
          <TabsTrigger value="storage">存储方案</TabsTrigger>
          <TabsTrigger value="automation">自动化</TabsTrigger>
        </TabsList>

        {/* 采集引擎 */}
        <TabsContent value="engines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name="Cpu" className="h-4 w-4 text-primary" />
                混合引擎调度策略
              </CardTitle>
              <CardDescription className="text-xs">
                根据信息源特征自动选择最优采集引擎，支持四种引擎类型协同工作
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {engines.map((engine) => (
                <EngineCard
                  key={engine.type}
                  engine={engine}
                  onToggle={() => handleToggleEngine(engine.type)}
                />
              ))}
            </CardContent>
          </Card>

          {/* 引擎对比表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">引擎性能对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {engines.map((e) => (
                  <div key={e.type} className="p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{e.name}</span>
                      <DynamicIcon
                        name={engineMeta[e.type].icon}
                        className={cn('h-4 w-4', engineMeta[e.type].color)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">总请求</span>
                        <span className="font-mono">{e.stats.requests.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">成功率</span>
                        <span className="font-mono text-emerald-400">{e.stats.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">平均延迟</span>
                        <span className="font-mono">{e.stats.avgLatency}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LLM 模型 */}
        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name="Brain" className="h-4 w-4 text-primary" />
                大语言模型配置
              </CardTitle>
              <CardDescription className="text-xs">
                用于语义筛选、摘要生成、周报综述。支持本地部署与云端 API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>模型提供商</Label>
                  <Select value={modelProvider} onValueChange={setModelProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="siliconflow">SiliconFlow (硅基流动)</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
                      <SelectItem value="local">本地部署 (Ollama)</SelectItem>
                      <SelectItem value="openai">OpenAI 兼容</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>模型名称</Label>
                  <Select value={modelName} onValueChange={setModelName}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Qwen2.5-72B-Instruct">Qwen2.5-72B-Instruct</SelectItem>
                      <SelectItem value="Qwen2.5-7B-Instruct">Qwen2.5-7B-Instruct</SelectItem>
                      <SelectItem value="deepseek-v3">DeepSeek-V3</SelectItem>
                      <SelectItem value="deepseek-r1">DeepSeek-R1 (推理增强)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>语义评分阈值</Label>
                  <Input
                    type="number"
                    value={scoreThreshold}
                    onChange={(e) => setScoreThreshold(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <p className="text-[11px] text-muted-foreground">≥ 此分数标记为高价值</p>
                </div>
                <div className="space-y-2">
                  <Label>最大 Token</Label>
                  <Input type="number" defaultValue={4096} />
                </div>
                <div className="space-y-2">
                  <Label>温度 (Temperature)</Label>
                  <Input type="number" defaultValue={0.3} step={0.1} min={0} max={2} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <DynamicIcon name="Info" className="h-3 w-3 inline mr-1" />
                  认知层采用 GNE 算法 + LLM 双重处理：GNE 负责正文提取，LLM 负责语义理解与评分。
                  建议使用 Qwen2.5-72B 获得最佳语义筛选效果，本地部署可选用 7B 版本降低成本。
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>保存配置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 存储方案 */}
        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name="Database" className="h-4 w-4 text-primary" />
                信息存储方案
              </CardTitle>
              <CardDescription className="text-xs">
                轻量化、实时化数据存储，单机环境处理高并发写入
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>存储模式</Label>
                <Select value={storageMode} onValueChange={setStorageMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqlite_wal">SQLite WAL 模式 (推荐)</SelectItem>
                    <SelectItem value="sqlite_default">SQLite 默认模式</SelectItem>
                    <SelectItem value="pocketbase">PocketBase (内置实时订阅)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <StorageFeature
                  icon="Package"
                  title="单文件部署"
                  desc="Python + SQLite，业务易于备份和迁移"
                />
                <StorageFeature
                  icon="Zap"
                  title="实时订阅"
                  desc="内置 real-time subscription，秒级推送"
                />
                <StorageFeature
                  icon="Shield"
                  title="WAL 模式"
                  desc="高并发写入，读写不互锁"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">存储使用情况</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">已用空间</span>
                    <span className="font-mono">1.2 GB / 10 GB</span>
                  </div>
                  <Progress value={12} className="h-2" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">情报数据</span>
                      <span className="font-mono">856 MB</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">索引</span>
                      <span className="font-mono">234 MB</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">周报</span>
                      <span className="font-mono">89 MB</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground">日志</span>
                      <span className="font-mono">21 MB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>保存配置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 自动化 */}
        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name="Workflow" className="h-4 w-4 text-primary" />
                自动化策略
              </CardTitle>
              <CardDescription className="text-xs">
                自动闭环：采集 → 清洗 → 分析 → AI 周报生成
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <DynamicIcon name="Calendar" className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">自动周报生成</p>
                    <p className="text-xs text-muted-foreground">每周五 18:00 自动生成周报</p>
                  </div>
                </div>
                <Switch checked={autoWeekly} onCheckedChange={setAutoWeekly} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <DynamicIcon name="Zap" className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium">实时语义筛选</p>
                    <p className="text-xs text-muted-foreground">采集后立即调用 LLM 评分</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <DynamicIcon name="Bell" className="h-5 w-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-medium">高价值情报推送</p>
                    <p className="text-xs text-muted-foreground">评分 ≥ 90 时实时通知</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <DynamicIcon name="RefreshCw" className="h-5 w-5 text-sky-400" />
                  <div>
                    <p className="text-sm font-medium">失败自动重试</p>
                    <p className="text-xs text-muted-foreground">采集失败自动加入重试队列</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>采集并发数</Label>
                <Input type="number" defaultValue={5} min={1} max={20} />
                <p className="text-[11px] text-muted-foreground">同时进行的采集任务数量</p>
              </div>

              <div className="space-y-2">
                <Label>重试次数</Label>
                <Input type="number" defaultValue={3} min={0} max={10} />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>保存配置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EngineCard({
  engine,
  onToggle,
}: {
  engine: EngineConfig
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all',
        engine.enabled ? 'border-primary/30 bg-primary/5' : 'border-border bg-card/50 opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border shrink-0',
              engine.enabled
                ? cn('border-current', engineMeta[engine.type].color, 'bg-current/10')
                : 'border-border text-muted-foreground'
            )}
          >
            <DynamicIcon name={engineMeta[engine.type].icon} className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium">{engine.name}</h4>
              <Badge variant="outline" className="text-[10px] h-5">
                {engine.enabled ? '已启用' : '已禁用'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{engine.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {engine.suitableFor.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-muted/50 text-muted-foreground border border-border"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Switch checked={engine.enabled} onCheckedChange={onToggle} />
      </div>
    </div>
  )
}

function StorageFeature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-card/50">
      <DynamicIcon name={icon} className="h-5 w-5 text-primary mb-2" />
      <h5 className="text-sm font-medium mb-1">{title}</h5>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

