"use client"

import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { insertParagraphAfterTable, insertParagraphBeforeTable } from "./TableContextMenu"

export const TableExitPlugin = Extension.create({
  name: "tableExitPlugin",

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        key: new PluginKey("tableExitPlugin"),
        props: {
          decorations(state) {
            const decorations: Decoration[] = []

            state.doc.descendants((node, pos) => {
              if (node.type.name === "table") {
                const endPos = pos + node.nodeSize

                // Helper widget ABOVE table
                decorations.push(
                  Decoration.widget(
                    pos,
                    () => {
                      const container = document.createElement("div")
                      container.className = "table-exit-helper table-exit-above"
                      
                      const btn = document.createElement("button")
                      btn.type = "button"
                      btn.className = "table-exit-btn"
                      btn.title = "Click to write simple text above this table"
                      btn.innerHTML = `
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Click to write text above table</span>
                      `

                      btn.addEventListener("mousedown", (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        insertParagraphBeforeTable(editor, pos)
                      })

                      container.appendChild(btn)
                      return container
                    },
                    { side: -1, stopEvent: () => true }
                  )
                )

                // Helper widget BELOW table
                decorations.push(
                  Decoration.widget(
                    endPos,
                    () => {
                      const container = document.createElement("div")
                      container.className = "table-exit-helper table-exit-below"

                      const btn = document.createElement("button")
                      btn.type = "button"
                      btn.className = "table-exit-btn"
                      btn.title = "Click to write simple text below this table"
                      btn.innerHTML = `
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Click to write text below table</span>
                      `

                      btn.addEventListener("mousedown", (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        insertParagraphAfterTable(editor, pos)
                      })

                      container.appendChild(btn)
                      return container
                    },
                    { side: 1, stopEvent: () => true }
                  )
                )
              }
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})
