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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  mockSources,
  sourceTypeMeta,
  engineMeta,
} from '@/lib/mock-data'
import type { InfoSource, SourceType, EngineType, SourceStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

export function SourcesView() {
  const [sources, setSources] = useState<InfoSource[]>(mockSources)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingSource, setEditingSource] = useState<InfoSource | null>(null)

  const filtered = sources.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false
    if (filterStatus !== 'all' && s.status !== filterStatus) return false
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleToggleStatus = (id: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
          : s
      )
    )
    const src = sources.find((s) => s.id === id)
    toast.success(`信息源「${src?.name}」已${src?.status === 'active' ? '暂停' : '启动'}`)
  }

  const handleDelete = (id: string) => {
    const src = sources.find((s) => s.id === id)
    setSources((prev) => prev.filter((s) => s.id !== id))
    toast.success(`已删除信息源「${src?.name}」`)
  }

  const handleSave = (data: Partial<InfoSource>) => {
    if (editingSource) {
      setSources((prev) =>
        prev.map((s) => (s.id === editingSource.id ? { ...s, ...data } as InfoSource : s))
      )
      toast.success(`已更新信息源「${data.name}」`)
      setEditingSource(null)
    } else {
      const newSource: InfoSource = {
        id: `src-${String(sources.length + 1).padStart(3, '0')}`,
        name: data.name || '未命名',
        type: (data.type as SourceType) || 'rss',
        url: data.url || '',
        engine: (data.engine as EngineType) || 'httpx',
        status: 'active',
        interval: data.interval || 30,
        lastCollect: '刚刚',
        totalCollected: 0,
        highValueCount: 0,
        tags: data.tags || [],
      }
      setSources((prev) => [newSource, ...prev])
      toast.success(`已添加信息源「${newSource.name}」`)
      setAddDialogOpen(false)
    }
  }

  const stats = {
    total: sources.length,
    active: sources.filter((s) => s.status === 'active').length,
    error: sources.filter((s) => s.status === 'error').length,
    totalCollected: sources.reduce((sum, s) => sum + s.totalCollected, 0),
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <DynamicIcon name="Satellite" className="h-6 w-6 text-primary" />
            信息源管理
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            自定义互联网信息源 · RSS / 微信公众号 / 掘金 / 知乎 / 谷歌学术 / GitHub
          </p>
        </div>
        <AddSourceDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSave={handleSave}
        />
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat icon="Satellite" label="信息源总数" value={stats.total} color="text-primary" />
        <MiniStat icon="Activity" label="活跃中" value={stats.active} color="text-emerald-400" />
        <MiniStat icon="AlertTriangle" label="异常" value={stats.error} color="text-rose-400" />
        <MiniStat icon="Database" label="累计采集" value={stats.totalCollected} color="text-amber-400" />
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
                placeholder="搜索信息源名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {Object.entries(sourceTypeMeta).map(([key, meta]) => (
                  <SelectItem key={key} value={key}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">运行中</SelectItem>
                <SelectItem value="idle">空闲</SelectItem>
                <SelectItem value="error">异常</SelectItem>
                <SelectItem value="paused">已暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 信息源列表 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">信息源列表 ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">状态</TableHead>
                  <TableHead>名称 / 类型</TableHead>
                  <TableHead className="hidden md:table-cell">采集引擎</TableHead>
                  <TableHead className="hidden lg:table-cell">采集间隔</TableHead>
                  <TableHead className="hidden lg:table-cell">最近采集</TableHead>
                  <TableHead className="text-right">采集 / 高价值</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((src) => (
                  <TableRow key={src.id} className="group">
                    <TableCell>
                      <StatusBadge status={src.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/50 shrink-0">
                          <DynamicIcon
                            name={sourceTypeMeta[src.type].icon}
                            className={cn('h-4 w-4', sourceTypeMeta[src.type].color)}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{src.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {src.url}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        <DynamicIcon
                          name={engineMeta[src.engine].icon}
                          className={cn('h-3 w-3 mr-1', engineMeta[src.engine].color)}
                        />
                        {engineMeta[src.engine].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {src.interval} 分钟
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {src.lastCollect}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-mono">{src.totalCollected}</span>
                        <span className="text-xs text-amber-400 font-mono">
                          {src.highValueCount} 高价值
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(src.id)}
                          title={src.status === 'active' ? '暂停' : '启动'}
                        >
                          <DynamicIcon
                            name={src.status === 'active' ? 'Pause' : 'Play'}
                            className="h-4 w-4"
                          />
                        </Button>
                        <EditSourceDialog
                          source={src}
                          onSave={handleSave}
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="编辑">
                              <DynamicIcon name="Edit" className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-400 hover:text-rose-300"
                          onClick={() => handleDelete(src.id)}
                          title="删除"
                        >
                          <DynamicIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <DynamicIcon name="Search" className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">未找到匹配的信息源</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 引擎选型建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DynamicIcon name="Workflow" className="h-4 w-4 text-primary" />
            引擎选型指南
          </CardTitle>
          <CardDescription className="text-xs">
            根据信息源特征自动匹配最优采集引擎
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(engineMeta).map(([key, meta]) => (
              <div
                key={key}
                className="p-3 rounded-lg border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <DynamicIcon name={meta.icon} className={cn('h-4 w-4', meta.color)} />
                  <span className="text-sm font-medium">{meta.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{meta.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MiniStat({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: number
  color: string
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <DynamicIcon name={icon} className={cn('h-5 w-5', color)} />
        <div>
          <p className="text-xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: SourceStatus }) {
  const map: Record<SourceStatus, { label: string; color: string; dot: string }> = {
    active: { label: '运行中', color: 'text-emerald-400', dot: 'bg-emerald-400' },
    idle: { label: '空闲', color: 'text-amber-400', dot: 'bg-amber-400' },
    error: { label: '异常', color: 'text-rose-400', dot: 'bg-rose-400' },
    paused: { label: '已暂停', color: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  }
  const m = map[status]
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {status === 'active' && (
          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', m.dot)} />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', m.dot)} />
      </span>
      <span className={cn('text-xs', m.color)}>{m.label}</span>
    </div>
  )
}

// 添加信息源对话框
function AddSourceDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (data: Partial<InfoSource>) => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<SourceType>('rss')
  const [url, setUrl] = useState('')
  const [engine, setEngine] = useState<EngineType>('httpx')
  const [interval, setInterval] = useState(30)

  const handleSubmit = () => {
    if (!name || !url) {
      toast.error('请填写名称和 URL')
      return
    }
    onSave({ name, type, url, engine, interval })
    setName('')
    setUrl('')
    setType('rss')
    setEngine('httpx')
    setInterval(30)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <DynamicIcon name="Plus" className="h-4 w-4 mr-1.5" />
          添加信息源
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加信息源</DialogTitle>
          <DialogDescription>
            配置新的信息采集源，系统将根据引擎类型自动调度
          </DialogDescription>
        </DialogHeader>
        <SourceForm
          name={name}
          setName={setName}
          type={type}
          setType={setType}
          url={url}
          setUrl={setUrl}
          engine={engine}
          setEngine={setEngine}
          interval={interval}
          setInterval={setInterval}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 编辑信息源对话框
function EditSourceDialog({
  source,
  onSave,
  trigger,
}: {
  source: InfoSource
  onSave: (data: Partial<InfoSource>) => void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(source.name)
  const [type, setType] = useState<SourceType>(source.type)
  const [url, setUrl] = useState(source.url)
  const [engine, setEngine] = useState<EngineType>(source.engine)
  const [interval, setInterval] = useState(source.interval)

  const handleSubmit = () => {
    onSave({ name, type, url, engine, interval })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑信息源</DialogTitle>
          <DialogDescription>修改信息源配置</DialogDescription>
        </DialogHeader>
        <SourceForm
          name={name}
          setName={setName}
          type={type}
          setType={setType}
          url={url}
          setUrl={setUrl}
          engine={engine}
          setEngine={setEngine}
          interval={interval}
          setInterval={setInterval}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 共享表单
function SourceForm({
  name,
  setName,
  type,
  setType,
  url,
  setUrl,
  engine,
  setEngine,
  interval,
  setInterval,
}: {
  name: string
  setName: (v: string) => void
  type: SourceType
  setType: (v: SourceType) => void
  url: string
  setUrl: (v: string) => void
  engine: EngineType
  setEngine: (v: EngineType) => void
  interval: number
  setInterval: (v: number) => void
}) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>名称</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：Hacker News" />
      </div>
      <div className="space-y-2">
        <Label>类型</Label>
        <Select value={type} onValueChange={(v) => setType(v as SourceType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sourceTypeMeta).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>URL / RSS 地址</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>采集引擎</Label>
          <Select value={engine} onValueChange={(v) => setEngine(v as EngineType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(engineMeta).map(([key, meta]) => (
                <SelectItem key={key} value={key}>
                  {meta.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>间隔 (分钟)</Label>
          <Input
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            min={5}
          />
        </div>
      </div>
      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <DynamicIcon name="Info" className="h-3 w-3 inline mr-1" />
          {engineMeta[engine].desc}
        </p>
      </div>
    </div>
  )
}
