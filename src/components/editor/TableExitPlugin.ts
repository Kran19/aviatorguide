"use client"

import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"

/**
 * TableStructurePlugin enforces the document-level invariant:
 * - Every top-level table has a real ProseMirror paragraph before it (if at doc start or preceded by another table)
 * - Every top-level table has a real ProseMirror paragraph after it (if at doc end or followed by another table)
 * - Returns null when the invariant is already satisfied, strictly avoiding infinite loops.
 */
export const TableExitPlugin = Extension.create({
  name: "tableStructurePlugin",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("tableStructurePlugin"),
        appendTransaction(transactions, oldState, newState) {
          // Only evaluate when document content has actually changed
          const docChanged = transactions.some((tr) => tr.docChanged)
          if (!docChanged) return null

          const { doc, schema } = newState
          let tr: any = null

          // Iterate top-level children backwards so insertions don't alter earlier offsets
          for (let i = doc.childCount - 1; i >= 0; i--) {
            const child = doc.child(i)
            if (child.type.name === "table") {
              // Calculate offset of this table child in the doc
              let offset = 0
              for (let j = 0; j < i; j++) {
                offset += doc.child(j).nodeSize
              }
              const endPos = offset + child.nodeSize

              // 1. Ensure an independent paragraph AFTER the table
              // If table is last top-level node OR next node is NOT a paragraph
              const isLast = i === doc.childCount - 1
              const nextSibling = !isLast ? doc.child(i + 1) : null
              if (isLast || (nextSibling && nextSibling.type.name !== "paragraph")) {
                tr = tr || newState.tr
                tr.insert(endPos, schema.nodes.paragraph.create())
              }

              // 2. Ensure an independent paragraph BEFORE the table
              // If table is first top-level node OR previous node is another table
              const isFirst = i === 0
              const prevSibling = !isFirst ? doc.child(i - 1) : null
              if (isFirst || (prevSibling && prevSibling.type.name === "table")) {
                tr = tr || newState.tr
                tr.insert(offset, schema.nodes.paragraph.create())
              }
            }
          }

          // Returns null if no changes were needed (idempotent, no repeated transactions)
          return tr
        },
      }),
    ]
  },
})
