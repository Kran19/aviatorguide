"use client"

import * as React from "react"
import { Editor } from "@tiptap/react"
import {
  Columns2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Combine,
  Split,
  Table2,
  Heading
} from "lucide-react"

export interface TableContextMenuProps {
  editor: Editor
  position: { x: number; y: number } | null
  onClose: () => void
}

export function TableContextMenu({
  editor,
  position,
  onClose,
}: TableContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [adjustedPos, setAdjustedPos] = React.useState<{ x: number; y: number } | null>(null)

  // Calculate clamped coordinates once mounted/rendered
  React.useLayoutEffect(() => {
    if (!position) return

    const menuEl = menuRef.current
    const width = menuEl ? menuEl.offsetWidth : 230
    const height = menuEl ? menuEl.offsetHeight : 380

    const padding = 12
    const maxX = window.innerWidth - width - padding
    const maxY = window.innerHeight - height - padding

    const x = Math.max(padding, Math.min(position.x, maxX))
    const y = Math.max(padding, Math.min(position.y, maxY))

    setAdjustedPos({ x, y })
  }, [position])

  // Handle outside click, scroll, and escape
  React.useEffect(() => {
    if (!position) return

    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleScroll = () => {
      onClose()
    }

    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [position, onClose])

  if (!position) return null

  const canMerge = editor.can().mergeCells()
  const canSplit = editor.can().splitCell()

  const runCmd = (fn: () => void) => {
    fn()
    onClose()
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: adjustedPos ? `${adjustedPos.x}px` : `${position.x}px`,
        top: adjustedPos ? `${adjustedPos.y}px` : `${position.y}px`,
        visibility: adjustedPos ? "visible" : "hidden",
      }}
      className="z-50 w-56 rounded-xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-2xl backdrop-blur-md outline-none select-none text-xs animate-in fade-in-0 zoom-in-95 duration-100"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header Label */}
      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 mb-1">
        <Table2 className="h-3.5 w-3.5 text-primary" />
        Table Options
      </div>

      {/* Row Operations */}
      <div className="px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
        Row
      </div>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().addRowBefore().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
      >
        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Insert Row Above</span>
      </button>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().addRowAfter().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
      >
        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Insert Row Below</span>
      </button>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().deleteRow().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete Row</span>
      </button>

      <div className="my-1 h-px bg-border/60" />

      {/* Column Operations */}
      <div className="px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
        Column
      </div>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().addColumnBefore().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Insert Column Left</span>
      </button>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().addColumnAfter().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
      >
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Insert Column Right</span>
      </button>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().deleteColumn().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete Column</span>
      </button>

      <div className="my-1 h-px bg-border/60" />

      {/* Headers & Cell Operations */}
      <div className="px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
        Header & Cells
      </div>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().toggleHeaderRow().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
      >
        <Heading className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Toggle Header Row</span>
      </button>
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().toggleHeaderColumn().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
      >
        <Columns2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Toggle Header Column</span>
      </button>
      {(canMerge || canSplit) && (
        <>
          {canMerge && (
            <button
              type="button"
              onClick={() => runCmd(() => editor.chain().focus().mergeCells().run())}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
            >
              <Combine className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Merge Cells</span>
            </button>
          )}
          {canSplit && (
            <button
              type="button"
              onClick={() => runCmd(() => editor.chain().focus().splitCell().run())}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted focus:bg-muted transition-colors cursor-pointer"
            >
              <Split className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Split Cell</span>
            </button>
          )}
        </>
      )}

      <div className="my-1 h-px bg-border/60" />

      {/* Table Operation */}
      <button
        type="button"
        onClick={() => runCmd(() => editor.chain().focus().deleteTable().run())}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/15 font-semibold transition-colors cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
        <span>Delete Entire Table</span>
      </button>
    </div>
  )
}
