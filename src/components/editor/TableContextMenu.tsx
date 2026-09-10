"use client"

import * as React from "react"
import { Editor } from "@tiptap/react"
import { TextSelection } from "@tiptap/pm/state"
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
  Heading,
  Pilcrow
} from "lucide-react"

export interface TableContextMenuProps {
  editor: Editor
  position: { x: number; y: number } | null
  onClose: () => void
}

/**
 * Inserts or focuses a paragraph directly after the active table.
 * Accepts either a TipTap Editor instance or a ProseMirror EditorView.
 * If a paragraph already exists immediately after the table, moves selection to it.
 * Otherwise, creates a new paragraph after the table and moves selection into it.
 */
export const insertParagraphAfterTable = (target: any, customTablePos?: number) => {
  if (!target) return false
  const view = target.view || target
  if (!view || !view.state || !view.dispatch) return false

  const { state, dispatch } = view
  let tableEndPos = -1

  if (typeof customTablePos === 'number') {
    const node = state.doc.nodeAt(customTablePos)
    if (node && node.type.name === 'table') {
      tableEndPos = customTablePos + node.nodeSize
    }
  }

  if (tableEndPos === -1) {
    const { $from } = state.selection
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth)
      if (node.type.name === 'table') {
        tableEndPos = $from.after(depth)
        break
      }
    }
  }

  if (tableEndPos === -1) {
    // Find the last table in the document
    let lastTableEnd = -1
    state.doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'table') {
        lastTableEnd = pos + node.nodeSize
      }
    })
    tableEndPos = lastTableEnd
  }

  if (tableEndPos === -1) {
    tableEndPos = state.doc.content.size
  }

  // Check if a paragraph node already exists right after tableEndPos
  if (tableEndPos < state.doc.content.size) {
    const $after = state.doc.resolve(tableEndPos)
    const nextNode = $after.nodeAfter
    if (nextNode && nextNode.type.name === 'paragraph') {
      const targetPos = tableEndPos + 1
      const tr = state.tr.setSelection(TextSelection.create(state.doc, Math.min(targetPos, state.doc.content.size)))
      dispatch(tr)
      view.focus()
      return true
    }
  }

  // Otherwise, insert a new paragraph after tableEndPos
  const tr = state.tr.insert(tableEndPos, state.schema.nodes.paragraph.create())
  tr.setSelection(TextSelection.create(tr.doc, tableEndPos + 1))
  dispatch(tr)
  view.focus()
  return true
}

/**
 * Inserts or focuses a paragraph directly before the active table.
 * Accepts either a TipTap Editor instance or a ProseMirror EditorView.
 * If a paragraph already exists immediately before the table, moves selection to it.
 * Otherwise, creates a new paragraph before the table and moves selection into it.
 */
export const insertParagraphBeforeTable = (target: any, customTablePos?: number) => {
  if (!target) return false
  const view = target.view || target
  if (!view || !view.state || !view.dispatch) return false

  const { state, dispatch } = view
  let tableBeforePos = -1

  if (typeof customTablePos === 'number') {
    tableBeforePos = customTablePos
  }

  if (tableBeforePos === -1) {
    const { $from } = state.selection
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth)
      if (node.type.name === 'table') {
        tableBeforePos = $from.before(depth)
        break
      }
    }
  }

  if (tableBeforePos === -1) {
    // Find the first table in the document
    state.doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'table' && tableBeforePos === -1) {
        tableBeforePos = pos
        return false
      }
    })
  }

  if (tableBeforePos === -1) {
    tableBeforePos = 0
  }

  // Check if a paragraph node already exists right before tableBeforePos
  if (tableBeforePos > 0) {
    const $before = state.doc.resolve(tableBeforePos)
    const prevNode = $before.nodeBefore
    if (prevNode && prevNode.type.name === 'paragraph') {
      const targetPos = Math.max(1, tableBeforePos - 1)
      const tr = state.tr.setSelection(TextSelection.create(state.doc, targetPos))
      dispatch(tr)
      view.focus()
      return true
    }
  }

  // Otherwise, insert a new paragraph before tableBeforePos
  const tr = state.tr.insert(tableBeforePos, state.schema.nodes.paragraph.create())
  tr.setSelection(TextSelection.create(tr.doc, tableBeforePos + 1))
  dispatch(tr)
  view.focus()
  return true
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

      {/* Write Normal Text Options */}
      <div className="px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
        Write Normal Text
      </div>
      <button
        type="button"
        onClick={() => runCmd(() => insertParagraphBeforeTable(editor))}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-foreground hover:bg-muted font-medium transition-colors cursor-pointer"
      >
        <Pilcrow className="h-3.5 w-3.5 text-primary" />
        <span>Write Text Above Table</span>
      </button>
      <button
        type="button"
        onClick={() => runCmd(() => insertParagraphAfterTable(editor))}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-foreground hover:bg-muted font-medium transition-colors cursor-pointer"
      >
        <Pilcrow className="h-3.5 w-3.5 text-primary" />
        <span>Write Text Below Table</span>
      </button>

      <div className="my-1 h-px bg-border/60" />

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
