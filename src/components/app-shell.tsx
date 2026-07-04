'use client'

import { useState, useEffect } from 'react'
import { DynamicIcon } from './icon'
import { DashboardView } from './views/dashboard'
import { SourcesView } from './views/sources'
import { StreamView } from './views/stream'
import { ReportsView } from './views/reports'
import { EnginesView } from './views/engines'
import { ArchitectureView } from './views/architecture'
import { mockSystemStats } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type ViewId = 'dashboard' | 'sources' | 'stream' | 'reports' | 'engines' | 'architecture'

const navItems: { id: ViewId; label: string; sublabel: string; icon: string }[] = [
  { id: 'dashboard', label: '指挥中心', sublabel: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'sources', label: '信息源管理', sublabel: 'Sources', icon: 'Satellite' },
  { id: 'stream', label: '情报流', sublabel: 'Intelligence Stream', icon: 'Newspaper' },
  { id: 'reports', label: 'AI 周报', sublabel: 'Weekly Reports', icon: 'FileText' },
  { id: 'engines', label: '引擎设置', sublabel: 'Engines', icon: 'Settings' },
  { id: 'architecture', label: '系统架构', sublabel: 'Architecture', icon: 'Network' },
]

export function AppShell() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard')
  const [currentTime, setCurrentTime] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${h}:${m}:${s}`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveView} />
      case 'sources':
        return <SourcesView />
      case 'stream':
        return <StreamView />
      case 'reports':
        return <ReportsView />
      case 'engines':
        return <EnginesView />
      case 'architecture':
        return <ArchitectureView />
    }
  }

  return (
    <div className="min-h-screen flex bg-background grid-bg">
      {/* 侧边栏 - 桌面端 */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar transition-transform duration-300',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <SidebarContent
          activeView={activeView}
          onNavigate={(v) => {
            setActiveView(v)
            setMobileNavOpen(false)
          }}
        />
      </aside>

      {/* 移动端遮罩 */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center gap-4 px-4 lg:px-6">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="切换导航"
          >
            <DynamicIcon name="Network" className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">系统运行中</span>
            </div>
            <span className="hidden sm:inline text-xs text-muted-foreground">·</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">
              已持续运行 {mockSystemStats.uptime}
            </span>
          </div>

          <div className="flex-1" />

          {/* 顶栏状态指标 */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <DynamicIcon name="Cpu" className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">引擎负载</span>
              <span className="font-mono font-medium text-foreground">
                {mockSystemStats.engineLoad}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DynamicIcon name="Activity" className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-muted-foreground">模型调用</span>
              <span className="font-mono font-medium text-foreground">
                {mockSystemStats.modelCalls.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DynamicIcon name="HardDrive" className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-muted-foreground">存储</span>
              <span className="font-mono font-medium text-foreground">
                {mockSystemStats.storageUsed}/{mockSystemStats.storageTotal}GB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 border border-border">
              <DynamicIcon name="Clock" className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-sm font-medium tabular-nums">{currentTime}</span>
            </div>
            <button className="relative p-2 rounded-md hover:bg-accent transition-colors" aria-label="通知">
              <DynamicIcon name="Bell" className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        {/* 视图内容 */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <div key={activeView} className="fade-in-up">
            {renderView()}
          </div>
        </main>

        {/* 页脚 */}
        <footer className="mt-auto border-t border-border bg-card/50 px-4 lg:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">AI情报官</span>
              <span>v0.3.0</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">基于 Wiseflow 框架</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Patchright · Crawl4AI · PocketBase</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">数据不出域 · 隐私优先</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function SidebarContent({
  activeView,
  onNavigate,
}: {
  activeView: ViewId
  onNavigate: (v: ViewId) => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo 区 */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground">
            <DynamicIcon name="Radar" className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-wide text-foreground">AI 情报官</span>
          <span className="text-[10px] text-muted-foreground tracking-wider">INTELLIGENCE OFFICER</span>
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          导航
        </div>
        {navItems.map((item) => {
          const active = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
              )}
              <DynamicIcon
                name={item.icon}
                className={cn(
                  'h-4.5 w-4.5 shrink-0 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <div className="flex flex-col items-start min-w-0">
                <span className="font-medium leading-tight">{item.label}</span>
                <span className="text-[10px] text-muted-foreground/70 leading-tight">
                  {item.sublabel}
                </span>
              </div>
            </button>
          )
        })}
      </nav>

      {/* 底部状态卡片 */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">7x24 巡航中</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            主动监控 {mockSystemStats.activeSources}/{mockSystemStats.totalSources} 个信息源，今日已采集{' '}
            <span className="text-primary font-semibold">{mockSystemStats.todayCollected}</span> 篇情报
          </p>
        </div>
      </div>
    </div>
  )
}
