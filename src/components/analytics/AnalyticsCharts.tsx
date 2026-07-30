"use client"

import React from "react"
import { Users, MousePointer, Globe, Monitor, Smartphone, Compass } from "lucide-react"

interface AnalyticsChartsProps {
  hourlyTraffic: { hour: string; visitors: number; clicks: number }[]
  countryDistribution: { name: string; count: number; percentage: number }[]
  deviceDistribution: { name: string; count: number; percentage: number }[]
  browserDistribution: { name: string; count: number; percentage: number }[]
}

export function AnalyticsCharts({
  hourlyTraffic,
  countryDistribution,
  deviceDistribution,
  browserDistribution,
}: AnalyticsChartsProps) {
  const maxVisitors = Math.max(...hourlyTraffic.map((h) => h.visitors), 1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Chart 1: Traffic & Clicks Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Visitors & Clicks Timeline</h3>
          </div>
          <span className="text-xs text-slate-400">24-Hour Distribution</span>
        </div>

        {/* Bar Visualization */}
        <div className="h-64 flex items-end space-x-2 border-b border-slate-800 pb-2">
          {hourlyTraffic.map((item, idx) => {
            const heightPercent = Math.round((item.visitors / maxVisitors) * 100)
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow pointer-events-none transition-opacity z-10 whitespace-nowrap">
                  {item.hour}: {item.visitors} Vis / {item.clicks} Clicks
                </div>

                <div className="w-full bg-slate-800 rounded-t relative overflow-hidden flex flex-col justify-end" style={{ height: "100%" }}>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-500 rounded-t"
                    style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">{item.hour}</span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Page Views</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-sky-400" />
            <span className="text-slate-300">Redirect Clicks</span>
          </div>
        </div>
      </div>

      {/* Chart 2: Top Countries */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Top Visitor Countries</h3>
        </div>

        <div className="space-y-4">
          {countryDistribution.slice(0, 5).map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>{item.name}</span>
                <span>
                  {item.count} visits ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 3: Device Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Device Breakdown</h3>
        </div>

        <div className="space-y-4">
          {deviceDistribution.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center space-x-2">
                  {item.name === "Mobile" ? <Smartphone className="w-3.5 h-3.5 text-sky-400" /> : <Monitor className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{item.name}</span>
                </span>
                <span>{item.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 4: Browser Distribution */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Top Browsers</h3>
        </div>

        <div className="space-y-4">
          {browserDistribution.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>{item.name}</span>
                <span>{item.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
