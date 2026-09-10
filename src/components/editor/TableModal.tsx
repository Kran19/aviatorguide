"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table2, Plus, Minus, Check } from "lucide-react"

export interface TableModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (rows: number, cols: number, withHeaderRow: boolean) => void
}

const MAX_GRID_ROWS = 8
const MAX_GRID_COLS = 8

export function TableModal({
  isOpen,
  onClose,
  onInsert,
}: TableModalProps) {
  const [rows, setRows] = React.useState(3)
  const [cols, setCols] = React.useState(3)
  const [withHeaderRow, setWithHeaderRow] = React.useState(true)
  const [hoveredGrid, setHoveredGrid] = React.useState<{ rows: number; cols: number } | null>(null)

  const resetAndClose = React.useCallback(() => {
    setRows(3)
    setCols(3)
    setWithHeaderRow(true)
    setHoveredGrid(null)
    onClose()
  }, [onClose])

  const handleInsert = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const validRows = Math.max(1, Math.min(50, Number(rows) || 3))
    const validCols = Math.max(1, Math.min(20, Number(cols) || 3))
    onInsert(validRows, validCols, withHeaderRow)
    resetAndClose()
  }

  const selectGridCell = (r: number, c: number) => {
    onInsert(r, c, withHeaderRow)
    resetAndClose()
  }

  const activeRows = hoveredGrid ? hoveredGrid.rows : rows
  const activeCols = hoveredGrid ? hoveredGrid.cols : cols

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-md bg-card border border-border/80 shadow-2xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Table2 className="h-5 w-5 text-primary" />
            Insert Table
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleInsert} className="space-y-6 pt-2">
          {/* Visual Grid Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quick Grid Selector
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {activeRows} × {activeCols} Table
              </span>
            </div>

            <div
              className="p-3 bg-muted/30 border border-border/50 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer select-none"
              onMouseLeave={() => setHoveredGrid(null)}
            >
              <div className="grid grid-cols-8 gap-1.5">
                {Array.from({ length: MAX_GRID_ROWS }).map((_, rIdx) => {
                  const r = rIdx + 1
                  return Array.from({ length: MAX_GRID_COLS }).map((_, cIdx) => {
                    const c = cIdx + 1
                    const isSelected = r <= activeRows && c <= activeCols
                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        className={`w-6 h-6 rounded-md border transition-all duration-150 ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground shadow-xs scale-105"
                            : "bg-background/60 border-border hover:border-primary/50"
                        }`}
                        onMouseEnter={() => setHoveredGrid({ rows: r, cols: c })}
                        onClick={() => selectGridCell(r, c)}
                        title={`${r} rows × ${c} columns`}
                        aria-label={`${r} rows by ${c} columns`}
                      />
                    )
                  })
                })}
              </div>
              <p className="text-[11px] text-muted-foreground/80 mt-1">
                Hover to select dimensions, click cell to quickly insert
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">Presets:</span>
            {[
              { r: 2, c: 2, label: "2 × 2" },
              { r: 3, c: 3, label: "3 × 3" },
              { r: 4, c: 3, label: "4 × 3" },
              { r: 5, c: 4, label: "5 × 4" },
            ].map((p) => (
              <Button
                key={p.label}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs rounded-lg hover:border-primary hover:text-primary transition-all"
                onClick={() => {
                  setRows(p.r)
                  setCols(p.c)
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>

          {/* Manual Numeric Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Rows Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="table-rows-input"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground block"
              >
                Number of Rows
              </label>
              <div className="flex items-center border border-input rounded-xl bg-background/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-9 rounded-none border-r border-border shrink-0 hover:bg-muted"
                  onClick={() => setRows((prev) => Math.max(1, prev - 1))}
                  disabled={rows <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <input
                  id="table-rows-input"
                  type="number"
                  min="1"
                  max="50"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="h-10 w-full text-center bg-transparent text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-9 rounded-none border-l border-border shrink-0 hover:bg-muted"
                  onClick={() => setRows((prev) => Math.min(50, prev + 1))}
                  disabled={rows >= 50}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Columns Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="table-cols-input"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground block"
              >
                Number of Columns
              </label>
              <div className="flex items-center border border-input rounded-xl bg-background/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-9 rounded-none border-r border-border shrink-0 hover:bg-muted"
                  onClick={() => setCols((prev) => Math.max(1, prev - 1))}
                  disabled={cols <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <input
                  id="table-cols-input"
                  type="number"
                  min="1"
                  max="20"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="h-10 w-full text-center bg-transparent text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-9 rounded-none border-l border-border shrink-0 hover:bg-muted"
                  onClick={() => setCols((prev) => Math.min(20, prev + 1))}
                  disabled={cols >= 20}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Header Row Option */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={withHeaderRow}
              onChange={(e) => setWithHeaderRow(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Include Header Row</span>
              <span className="text-xs text-muted-foreground">Formats the top row as table headers with distinct styling</span>
            </div>
          </label>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={resetAndClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl gap-2 shadow-sm font-medium"
            >
              <Check className="h-4 w-4" />
              Insert Table ({rows} × {cols})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
