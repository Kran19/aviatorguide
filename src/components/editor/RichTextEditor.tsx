"use client"

import * as React from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { CustomImage } from './CustomImage'
import LinkExtension from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Table, createTable } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Selection, TextSelection } from '@tiptap/pm/state'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
  ImageIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  ArrowUp,
  Table2,
  Rows2,
  Columns2,
  Trash2
} from 'lucide-react'
import { MediaLibraryModal } from './MediaLibraryModal'
import { LinkModal } from './LinkModal'
import { TableModal } from './TableModal'
import { TableContextMenu, insertParagraphAfterTable, insertParagraphBeforeTable } from './TableContextMenu'
import { TableExitPlugin } from './TableExitPlugin'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onImageClick?: () => void
}

/**
 * Custom TipTap Link Extension with full support for href, target, rel, and CSS classes
 */
const CustomLink = LinkExtension.extend({
  priority: 1000,
  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) => element.getAttribute('href'),
        renderHTML: (attributes) => {
          if (!attributes.href) return {}
          return { href: attributes.href }
        },
      },
      target: {
        default: null,
        parseHTML: (element) => element.getAttribute('target'),
        renderHTML: (attributes) => {
          if (!attributes.target) return {}
          return { target: attributes.target }
        },
      },
      rel: {
        default: null,
        parseHTML: (element) => element.getAttribute('rel'),
        renderHTML: (attributes) => {
          if (!attributes.rel) return {}
          return { rel: attributes.rel }
        },
      },
      class: {
        default: 'text-blue-500 cursor-pointer hover:text-blue-600 transition-colors',
      },
    }
  },
})

const rgbToHex = (color: string) => {
  if (!color) return '#000000'
  if (color.startsWith('#')) return color
  const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (!match) return '#000000'
  const r = parseInt(match[1]).toString(16).padStart(2, '0')
  const g = parseInt(match[2]).toString(16).padStart(2, '0')
  const b = parseInt(match[3]).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

const MenuBar = ({
  editor,
  onImageClick,
  onOpenLinkModal,
  onOpenTableModal,
}: {
  editor: any
  onImageClick?: () => void
  onOpenLinkModal: () => void
  onOpenTableModal: () => void
}) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border/50 bg-muted/95 backdrop-blur z-40 sticky top-[64px] rounded-t-xl items-center shadow-sm">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          if (editor.isActive('customImage')) {
            editor.chain().focus().updateAttributes('customImage', { textAlign: 'left', float: 'none' }).run()
          } else {
            editor.chain().focus().setTextAlign('left').run()
          }
        }}
        className={editor.isActive({ textAlign: 'left' }) || editor.isActive('customImage', { textAlign: 'left' }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          if (editor.isActive('customImage')) {
            editor.chain().focus().updateAttributes('customImage', { textAlign: 'center', float: 'none' }).run()
          } else {
            editor.chain().focus().setTextAlign('center').run()
          }
        }}
        className={editor.isActive({ textAlign: 'center' }) || editor.isActive('customImage', { textAlign: 'center' }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          if (editor.isActive('customImage')) {
            editor.chain().focus().updateAttributes('customImage', { textAlign: 'right', float: 'none' }).run()
          } else {
            editor.chain().focus().setTextAlign('right').run()
          }
        }}
        className={editor.isActive({ textAlign: 'right' }) || editor.isActive('customImage', { textAlign: 'right' }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />

      {/* Table Controls */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onOpenTableModal}
        className={editor.isActive('table') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Insert Table (Rows & Columns)"
      >
        <Table2 className="h-4 w-4" />
      </Button>

      {/* Active Table Quick Helpers in MenuBar */}
      {editor.isActive('table') && (
        <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-lg px-1.5 py-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertParagraphBeforeTable(editor)}
            className="h-6 px-1.5 text-[11px] hover:bg-background text-foreground font-medium gap-1"
            title="Write simple text above this table"
          >
            <Pilcrow className="h-3 w-3 text-primary" /> + Text Above
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertParagraphAfterTable(editor)}
            className="h-6 px-1.5 text-[11px] hover:bg-background text-foreground font-medium gap-1"
            title="Write simple text below this table"
          >
            <Pilcrow className="h-3 w-3 text-primary" /> + Text Below
          </Button>
        </div>
      )}

      <div className="w-px h-6 bg-border mx-1" />

      {/* Link Controls */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onOpenLinkModal}
        className={editor.isActive('link') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Insert or Edit Link (Ctrl+K)"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className="hover:bg-muted/80"
        title="Remove Link"
      >
        <Unlink className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Semantic Headings & Paragraph */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') && !editor.isActive('heading') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Heading 2 (H2)"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Heading 3 (H3)"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Heading 4 (H4)"
      >
        <Heading4 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Heading 5 (H5)"
      >
        <Heading5 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Heading 6 (H6)"
      >
        <Heading6 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <div className="flex items-center gap-1 relative">
        <input
          type="color"
          onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={rgbToHex(editor.getAttributes('textStyle').color)}
          className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
          title="Text Color"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()}
          className={editor.isActive('highlight') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
          title="Highlight Text"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      <MediaLibraryModal 
        onInsert={(url) => (editor.chain().focus() as any).setImage({ src: url }).run()}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="hover:bg-muted/80 hover:text-primary transition-colors"
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        }
      />

      <div className="flex-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="hover:bg-muted/80"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="hover:bg-muted/80"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function RichTextEditor({ content, onChange, onImageClick }: RichTextEditorProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const [imageAlt, setImageAlt] = React.useState('')
  const [imageCaption, setImageCaption] = React.useState('')
  const [imageWidth, setImageWidth] = React.useState('100%')
  const [imageHeight, setImageHeight] = React.useState('auto')
  const [imageFloat, setImageFloat] = React.useState('none')

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = React.useState(false)
  const [linkModalData, setLinkModalData] = React.useState<{
    href: string
    target: string | null
    rel: string | null
    isActive: boolean
  }>({
    href: '',
    target: null,
    rel: null,
    isActive: false,
  })

  // Table Modal & Context Menu State
  const [tableModalOpen, setTableModalOpen] = React.useState(false)
  const [tableContextMenu, setTableContextMenu] = React.useState<{ x: number; y: number } | null>(null)

  React.useEffect(() => {
    const handleImageSelect = (e: any) => {
      setSelectedImage(e.detail.src)
      setImageAlt(e.detail.alt)
      setImageCaption(e.detail.caption)
      setImageWidth(e.detail.width || '100%')
      setImageHeight(e.detail.height || 'auto')
      setImageFloat(e.detail.float || 'none')
    }
    const handleImageDeselect = () => {
      setTimeout(() => {
        setSelectedImage((current) => {
          return current ? null : null
        })
      }, 50)
    }
    
    document.addEventListener('tiptap:imageSelected', handleImageSelect)
    document.addEventListener('tiptap:imageDeselected', handleImageDeselect)

    return () => {
      document.removeEventListener('tiptap:imageSelected', handleImageSelect)
      document.removeEventListener('tiptap:imageDeselected', handleImageDeselect)
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false, // Managed by CustomLink
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      CustomImage,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'customImage'],
      }),
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full border border-border',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-border',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border p-2 font-bold bg-muted/50 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border p-2',
        },
      }),
      CustomLink.configure({
        openOnClick: false,
      }),
      TableExitPlugin,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none min-h-[500px] p-6 bg-background w-full max-w-none prose-p:leading-normal prose-p:my-1 prose-headings:font-bold prose-headings:my-1 prose-img:rounded-xl prose-a:text-blue-500 prose-a:no-underline hover:prose-a:text-blue-600 prose-li:my-0 prose-ul:my-1 prose-ol:my-1',
      },
      handleClick: (view, pos, event) => {
        if (event.defaultPrevented) return true

        const target = event.target as HTMLElement | null
        if (target?.closest('td, th, button, input, a, select, [role="menu"], h1, h2, h3, h4, h5, h6, blockquote, ul, ol, li')) {
          return false
        }

        const { state } = view
        const $pos = state.doc.resolve(pos)

        // Check if selection landed inside a tableCell even though click was physically outside the table
        let insideTable = false
        for (let d = $pos.depth; d > 0; d--) {
          if ($pos.node(d).type.name === 'table') {
            insideTable = true
            break
          }
        }

        if (insideTable) {
          const tables = Array.from(view.dom.querySelectorAll('table'))
          for (const tableEl of tables) {
            const rect = tableEl.getBoundingClientRect()
            if (event.clientY >= rect.bottom - 2) {
              insertParagraphAfterTable(view)
              return true
            }
          }
        }

        return false
      },
      handleDOMEvents: {
        mousedown: (view, event) => {
          const target = event.target as HTMLElement | null
          if (!target) return false

          // 1. NEVER intercept clicks inside table cells (td/th), form controls, or popup menus
          if (target.closest('td, th, button, input, a, select, [role="menu"]')) {
            return false
          }

          // 2. Don't intercept clicks on structured blocks (headings, lists, blockquotes)
          if (target.closest('h1, h2, h3, h4, h5, h6, blockquote, ul, ol, li')) {
            return false
          }

          const { state, dispatch } = view
          const { doc, schema } = state
          const clickX = event.clientX
          const clickY = event.clientY

          const tables = Array.from(view.dom.querySelectorAll('table'))
          if (tables.length === 0) return false

          // Test posAtCoords
          const posAtPoint = view.posAtCoords({ left: clickX, top: clickY })
          let isInsideTableCell = false
          let isAtTableBoundary = false

          if (posAtPoint) {
            const $resolved = doc.resolve(posAtPoint.pos)
            for (let d = $resolved.depth; d > 0; d--) {
              if ($resolved.node(d).type.name === 'table') {
                isInsideTableCell = true
                break
              }
            }
            if ($resolved.nodeBefore?.type.name === 'table') {
              isAtTableBoundary = true
            }
          }

          // Iterate tables to check vertical boundaries
          for (let i = 0; i < tables.length; i++) {
            const tableEl = tables[i]
            const wrapperEl = (tableEl.closest('.tableWrapper') as HTMLElement) || tableEl
            const tableRect = tableEl.getBoundingClientRect()
            const wrapperRect = wrapperEl.getBoundingClientRect()
            const tableBottom = Math.max(tableRect.bottom, wrapperRect.bottom)
            const tableTop = Math.min(tableRect.top, wrapperRect.top)

            // Find this table node in ProseMirror doc
            let currentTablePos = -1
            let currentTableEnd = -1
            let tableIndex = 0
            doc.descendants((node, pos) => {
              if (node.type.name === 'table') {
                if (tableIndex === i) {
                  currentTablePos = pos
                  currentTableEnd = pos + node.nodeSize
                }
                tableIndex++
              }
            })
            if (currentTableEnd === -1) continue

            // A) Click is BELOW this table (gap, trailing paragraph, or blank background below)
            if (clickY >= tableBottom - 2) {
              const nextTableEl = tables[i + 1]
              const nextTableTop = nextTableEl
                ? ((nextTableEl.closest('.tableWrapper') as HTMLElement) || nextTableEl).getBoundingClientRect().top
                : Infinity

              if (clickY < nextTableTop) {
                if (currentTableEnd < doc.content.size) {
                  const $after = doc.resolve(currentTableEnd)
                  const nextNode = $after.nodeAfter
                  if (nextNode && nextNode.type.name === 'paragraph') {
                    // If click already naturally resolved into this paragraph's text (and not cell/boundary), let PM handle it
                    if (posAtPoint && !isInsideTableCell && !isAtTableBoundary) {
                      const $p = doc.resolve(posAtPoint.pos)
                      if ($p.parent.type.name === 'paragraph' && $p.node(-1)?.type.name !== 'tableCell') {
                        return false
                      }
                    }

                    // Otherwise (empty paragraph, blank space below, or posAtCoords fell into table):
                    const targetPos = currentTableEnd + 1
                    const tr = state.tr.setSelection(TextSelection.create(doc, Math.min(targetPos, doc.content.size)))
                    dispatch(tr)
                    view.focus()
                    event.preventDefault()
                    return true
                  }
                }

                // If no paragraph exists after table, insert one and focus it
                const tr = state.tr.insert(currentTableEnd, schema.nodes.paragraph.create())
                tr.setSelection(TextSelection.create(tr.doc, currentTableEnd + 1))
                dispatch(tr)
                view.focus()
                event.preventDefault()
                return true
              }
            }

            // B) Click is ABOVE this table (gap or blank area above this table)
            if (clickY <= tableTop + 2) {
              const prevTableEl = tables[i - 1]
              const prevTableBottom = prevTableEl
                ? ((prevTableEl.closest('.tableWrapper') as HTMLElement) || prevTableEl).getBoundingClientRect().bottom
                : -Infinity

              if (clickY > prevTableBottom) {
                if (currentTablePos > 0) {
                  const $before = doc.resolve(currentTablePos)
                  const prevNode = $before.nodeBefore
                  if (prevNode && prevNode.type.name === 'paragraph') {
                    if (posAtPoint && !isInsideTableCell) {
                      const $p = doc.resolve(posAtPoint.pos)
                      if ($p.parent.type.name === 'paragraph' && $p.node(-1)?.type.name !== 'tableCell') {
                        return false
                      }
                    }
                    const targetPos = Math.max(1, currentTablePos - 1)
                    const tr = state.tr.setSelection(TextSelection.create(doc, targetPos))
                    dispatch(tr)
                    view.focus()
                    event.preventDefault()
                    return true
                  }
                }

                // Insert paragraph before table
                const tr = state.tr.insert(currentTablePos, schema.nodes.paragraph.create())
                tr.setSelection(TextSelection.create(tr.doc, currentTablePos + 1))
                dispatch(tr)
                view.focus()
                event.preventDefault()
                return true
              }
            }
          }

          return false
        },
        contextmenu: (view, event) => {
          const target = event.target as HTMLElement | null
          const tableElement = target?.closest('table')
          if (tableElement) {
            event.preventDefault()
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
            if (pos) {
              const tr = view.state.tr
              const resolved = view.state.doc.resolve(pos.pos)
              tr.setSelection(Selection.near(resolved))
              view.dispatch(tr)
              view.focus()
            }
            setTableContextMenu({ x: event.clientX, y: event.clientY })
            return true
          }
          return false
        },
      },
      handleKeyDown: (view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault()
          handleOpenLinkModal()
          return true
        }

        // Table Exit Navigation
        const { state } = view
        const { selection } = state
        const { $from } = selection

        let tableDepth = -1
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'table') {
            tableDepth = d
            break
          }
        }

        if (tableDepth !== -1) {
          const tableNode = $from.node(tableDepth)
          const tablePos = $from.before(tableDepth)
          const tableEndPos = tablePos + tableNode.nodeSize

          // Ctrl+Enter or Cmd+Enter: quickly exit to text below
          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            insertParagraphAfterTable(view)
            return true
          }

          // ArrowDown on the last row of the table
          if (event.key === 'ArrowDown') {
            const rowIndex = $from.index(tableDepth)
            const isLastRow = rowIndex === tableNode.childCount - 1
            if (isLastRow && tableEndPos >= state.doc.content.size) {
              event.preventDefault()
              insertParagraphAfterTable(view)
              return true
            }
          }

          // ArrowUp on the first row of the table
          if (event.key === 'ArrowUp') {
            const rowIndex = $from.index(tableDepth)
            const isFirstRow = rowIndex === 0
            if (isFirstRow && tablePos === 0) {
              event.preventDefault()
              insertParagraphBeforeTable(view)
              return true
            }
          }
        }

        return false
      },
      handlePaste: (view, event) => {
        if (event.clipboardData?.files?.length) {
          return false
        }
        
        const text = event.clipboardData?.getData('text/plain')
        if (text) {
          const normalized = text.replace(/\r\n/g, '\n')
          if (!normalized.includes('\n')) {
            event.preventDefault()
            view.dispatch(view.state.tr.insertText(normalized))
            return true
          }
        }
        
        return false
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  React.useEffect(() => {
    if (editor && typeof window !== 'undefined') {
      (window as any).__tiptapEditor = editor
    }
  }, [editor])

  const handleOpenLinkModal = React.useCallback(() => {
    if (!editor) return
    const attrs = editor.getAttributes('link')
    setLinkModalData({
      href: attrs.href || '',
      target: attrs.target || null,
      rel: attrs.rel || null,
      isActive: editor.isActive('link'),
    })
    setLinkModalOpen(true)
  }, [editor])

  const handleApplyLink = React.useCallback(
    ({ href, target, rel }: { href: string; target: string | null; rel: string | null }) => {
      if (!editor) return
      if (!href) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href, target: target || undefined, rel: rel || undefined })
        .run()
    },
    [editor]
  )

  const handleRemoveLink = React.useCallback(() => {
    if (!editor) return
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
  }, [editor])

  React.useEffect(() => {
    if (editor) {
      // @ts-ignore
      window.insertImageIntoEditor = (url: string) => {
        (editor.chain().focus() as any).setImage({ src: url }).run()
      }
    }
  }, [editor])

  return (
    <div className="border border-border/60 rounded-xl bg-background shadow-sm hover:border-primary/30 transition-colors duration-300 relative w-full h-full flex flex-col">
      <MenuBar
        editor={editor}
        onImageClick={onImageClick}
        onOpenLinkModal={handleOpenLinkModal}
        onOpenTableModal={() => setTableModalOpen(true)}
      />

      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor, state }) => {
            if (selectedImage !== null || editor.isActive('customImage')) return true
            if (editor.isActive('table') || state.selection.empty) return false
            return true
          }}
          className="flex flex-wrap max-w-2xl bg-popover text-popover-foreground shadow-lg border rounded-xl overflow-hidden p-1 gap-1 items-center z-50"
        >
          {selectedImage !== null && (
            <div className="flex flex-col gap-2 pr-2 border-r border-border mr-1 bg-muted/40 rounded-lg p-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0 px-1">🖼 META</span>
                <input
                  type="text"
                  className="h-7 w-24 md:w-28 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      editor.chain().focus().updateAttributes('customImage', { alt: imageAlt, caption: imageCaption, width: imageWidth, height: imageHeight, float: imageFloat }).run()
                    }
                  }}
                  placeholder="Alt Text..."
                  title="Alt Text (SEO)"
                />
                <input
                  type="text"
                  className="h-7 w-24 md:w-28 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      editor.chain().focus().updateAttributes('customImage', { alt: imageAlt, caption: imageCaption, width: imageWidth, height: imageHeight, float: imageFloat }).run()
                    }
                  }}
                  placeholder="Caption..."
                  title="Image Caption"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0 px-1">📏 SIZE</span>
                <input
                  type="text"
                  className="h-7 w-16 md:w-20 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      editor.chain().focus().updateAttributes('customImage', { alt: imageAlt, caption: imageCaption, width: imageWidth, height: imageHeight, float: imageFloat }).run()
                    }
                  }}
                  placeholder="Width"
                  title="Width (e.g. 100%, 300px)"
                />
                <input
                  type="text"
                  className="h-7 w-16 md:w-20 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      editor.chain().focus().updateAttributes('customImage', { alt: imageAlt, caption: imageCaption, width: imageWidth, height: imageHeight, float: imageFloat }).run()
                    }
                  }}
                  placeholder="Height"
                  title="Height (e.g. auto, 300px)"
                />
                <div className="w-px h-5 bg-border mx-1" />
                <Button
                  type="button" variant="ghost" size="sm" className={`h-7 px-2 text-xs ${imageFloat === 'left' ? 'bg-primary/20 text-primary' : ''}`}
                  onClick={() => { setImageFloat('left'); editor.chain().focus().updateAttributes('customImage', { float: 'left' }).run() }}
                  title="Wrap Text Right (Float Left)"
                >
                  Left
                </Button>
                <Button
                  type="button" variant="ghost" size="sm" className={`h-7 px-2 text-xs ${imageFloat === 'none' ? 'bg-primary/20 text-primary' : ''}`}
                  onClick={() => { setImageFloat('none'); editor.chain().focus().updateAttributes('customImage', { float: 'none' }).run() }}
                  title="Inline (No Float)"
                >
                  Center
                </Button>
                <Button
                  type="button" variant="ghost" size="sm" className={`h-7 px-2 text-xs ${imageFloat === 'right' ? 'bg-primary/20 text-primary' : ''}`}
                  onClick={() => { setImageFloat('right'); editor.chain().focus().updateAttributes('customImage', { float: 'right' }).run() }}
                  title="Wrap Text Left (Float Right)"
                >
                  Right
                </Button>
                <div className="flex-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 ml-1"
                  onClick={() => {
                    editor.chain().focus().updateAttributes('customImage', { alt: imageAlt, caption: imageCaption, width: imageWidth, height: imageHeight, float: imageFloat }).run()
                  }}
                  title="Apply Changes"
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor.isActive('customImage')) {
                editor.chain().focus().updateAttributes('customImage', { textAlign: 'left', float: 'none' }).run()
              } else {
                editor.chain().focus().setTextAlign('left').run()
              }
            }}
            className={editor.isActive({ textAlign: 'left' }) || editor.isActive('customImage', { textAlign: 'left' }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor.isActive('customImage')) {
                editor.chain().focus().updateAttributes('customImage', { textAlign: 'center', float: 'none' }).run()
              } else {
                editor.chain().focus().setTextAlign('center').run()
              }
            }}
            className={editor.isActive({ textAlign: 'center' }) || editor.isActive('customImage', { textAlign: 'center' }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor.isActive('customImage')) {
                editor.chain().focus().updateAttributes('customImage', { textAlign: 'right', float: 'none' }).run()
              } else {
                editor.chain().focus().setTextAlign('right').run()
              }
            }}
            className={editor.isActive({ textAlign: 'right' }) || editor.isActive('customImage', { textAlign: 'right' }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <div className="flex items-center gap-1 relative mx-1">
            <input
              type="color"
              onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
              value={rgbToHex(editor.getAttributes('textStyle').color)}
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
              title="Text Color"
            />
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Link in BubbleMenu */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOpenLinkModal}
            className={editor.isActive('link') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Insert or Edit Link (Ctrl+K)"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveLink}
            disabled={!editor.isActive('link')}
            className="hover:bg-muted/80"
            title="Remove Link"
          >
            <Unlink className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Semantic Headings & Paragraph in BubbleMenu */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive('paragraph') && !editor.isActive('heading') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Paragraph"
          >
            <Pilcrow className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Heading 2 (H2)"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Heading 3 (H3)"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editor.isActive('heading', { level: 4 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Heading 4 (H4)"
          >
            <Heading4 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <MediaLibraryModal 
            onInsert={(url) => (editor.chain().focus() as any).setImage({ src: url }).run()}
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="hover:bg-muted/80 hover:text-primary transition-colors"
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()}
            className={editor.isActive('highlight') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Highlight Text"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <div
        className="flex-1 w-full relative min-h-[500px]"
        onClick={(e) => {
          if (!editor) return
          const target = e.target as HTMLElement
          // If clicked inside a cell, link, button, input, or control, ignore
          if (target.closest('td, th, button, input, a, select, [role="menu"]')) return

          const editorEl = editor.view.dom
          const tables = Array.from(editorEl.querySelectorAll('table'))
          if (tables.length > 0) {
            const lastTable = tables[tables.length - 1]
            const lastTableRect = lastTable.getBoundingClientRect()
            if (e.clientY > lastTableRect.bottom) {
              // Clicked in empty editor space below the table!
              e.preventDefault()
              insertParagraphAfterTable(editor)
              return
            }

            const firstTable = tables[0]
            const firstTableRect = firstTable.getBoundingClientRect()
            if (e.clientY < firstTableRect.top) {
              // Clicked in empty editor space above the table!
              e.preventDefault()
              insertParagraphBeforeTable(editor)
              return
            }
          }
        }}
        onContextMenu={(e) => {
          const target = e.target as HTMLElement | null
          const tableElement = target?.closest('table')
          if (tableElement && editor) {
            e.preventDefault()
            const pos = editor.view.posAtCoords({ left: e.clientX, top: e.clientY })
            if (pos) {
              const resolved = editor.state.doc.resolve(pos.pos)
              editor.view.dispatch(editor.state.tr.setSelection(Selection.near(resolved)))
              editor.view.focus()
            }
            setTableContextMenu({ x: e.clientX, y: e.clientY })
          }
        }}
      >
        <EditorContent editor={editor} className="flex-1 w-full" />
      </div>


      {/* Link Edit Dialog */}
      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        initialUrl={linkModalData.href}
        initialTarget={linkModalData.target}
        initialRel={linkModalData.rel}
        isActive={linkModalData.isActive}
        onApply={handleApplyLink}
        onRemove={handleRemoveLink}
      />

      {/* Table Insert Dialog */}
      <TableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onInsert={(rows, cols, withHeaderRow) => {
          if (!editor) return

          const { state, dispatch } = editor.view
          const { schema, selection } = state
          const { $from } = selection

          const tableNode = createTable(schema, rows, cols, withHeaderRow)
          const pNode = schema.nodes.paragraph.create()
          const tr = state.tr

          // Check if cursor is currently inside an existing table to prevent accidental nesting
          let insideTableDepth = -1
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'table') {
              insideTableDepth = d
              break
            }
          }

          let insertPos: number

          if (insideTableDepth !== -1) {
            // Never nest a table inside a table cell!
            // Move insertion position to after the current table
            const tableEndPos = $from.after(insideTableDepth)
            const nextNode = tableEndPos < tr.doc.content.size ? tr.doc.resolve(tableEndPos).nodeAfter : null
            if (nextNode && nextNode.type.name === 'paragraph') {
              insertPos = tableEndPos + nextNode.nodeSize
            } else {
              tr.insert(tableEndPos, schema.nodes.paragraph.create())
              insertPos = tableEndPos + 2
            }
          } else {
            const currentParent = $from.parent
            const isCurrentEmptyTextblock = currentParent.isTextblock && currentParent.content.size === 0
            const isAtDocStart = $from.pos <= 1

            if (isAtDocStart && isCurrentEmptyTextblock) {
              // Document starts with empty paragraph: keep it, insert table after it
              insertPos = 2
            } else if (isCurrentEmptyTextblock) {
              // Empty paragraph in document: replace it with the table
              const blockStart = $from.before()
              const blockEnd = $from.after()
              tr.delete(blockStart, blockEnd)
              insertPos = blockStart
            } else {
              // Existing paragraph with text (e.g. "Hello|"): insert after it
              insertPos = $from.after()
            }
          }

          // Insert table
          tr.insert(insertPos, tableNode)
          const tableEnd = insertPos + tableNode.nodeSize

          // Ensure an independent paragraph immediately after the table
          const afterNode = tableEnd < tr.doc.content.size ? tr.doc.resolve(tableEnd).nodeAfter : null
          if (!afterNode || afterNode.type.name !== 'paragraph') {
            tr.insert(tableEnd, pNode)
          }

          // Move Selection into the independent paragraph outside and below the table
          const targetPos = Math.min(tableEnd + 1, tr.doc.content.size)
          tr.setSelection(TextSelection.create(tr.doc, targetPos))

          dispatch(tr.scrollIntoView())
          editor.view.focus()
        }}
      />

      {/* Table Right-Click Context Menu */}
      {editor && (
        <TableContextMenu
          editor={editor}
          position={tableContextMenu}
          onClose={() => setTableContextMenu(null)}
        />
      )}

      <Button
        type="button"
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 hover:-translate-y-1 bg-primary text-primary-foreground"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Scroll to Top"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
    </div>
  )
}
