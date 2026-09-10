"use client"

import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"

/**
 * TableStructurePlugin enforces the document-level invariant:
 * - Every table has a paragraph before it (if at the start of doc or preceded by another table)
 * - Every table has a paragraph after it (if at the end of doc or followed by another table)
 * - Idempotent: returns null if the invariant is already satisfied, preventing infinite loops.
 */
export const TableExitPlugin = Extension.create({
  name: "tableStructurePlugin",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("tableStructurePlugin"),
        appendTransaction(transactions, oldState, newState) {
          // Only evaluate when the document content has actually changed
          const docChanged = transactions.some((tr) => tr.docChanged)
          if (!docChanged) return null

          const { doc, schema } = newState
          let tr: any = null

          // Collect all top-level or descendant table node ranges
          const tables: { pos: number; endPos: number }[] = []
          doc.descendants((node, pos) => {
            if (node.type.name === "table") {
              tables.push({ pos, endPos: pos + node.nodeSize })
            }
          })

          if (tables.length === 0) return null

          // Iterate tables from bottom to top so insertions at the end
          // do not shift positions earlier in the document
          for (let i = tables.length - 1; i >= 0; i--) {
            const { pos, endPos } = tables[i]

            // 1. Ensure a paragraph AFTER the table
            // If the table is at the very end of the document, or immediately followed by another table
            if (endPos === doc.content.size) {
              tr = tr || newState.tr
              tr.insert(endPos, schema.nodes.paragraph.create())
            } else {
              const $after = doc.resolve(endPos)
              const nextNode = $after.nodeAfter
              if (!nextNode || nextNode.type.name === "table") {
                tr = tr || newState.tr
                tr.insert(endPos, schema.nodes.paragraph.create())
              }
            }

            // 2. Ensure a paragraph BEFORE the table
            // If the table is at the very start of the document (pos 0), or immediately preceded by another table
            if (pos === 0) {
              tr = tr || newState.tr
              tr.insert(0, schema.nodes.paragraph.create())
            } else {
              const $before = doc.resolve(pos)
              const prevNode = $before.nodeBefore
              if (!prevNode || prevNode.type.name === "table") {
                tr = tr || newState.tr
                tr.insert(pos, schema.nodes.paragraph.create())
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
