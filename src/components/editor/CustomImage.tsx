import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'

const ImageNodeView = (props: any) => {
  const { node, updateAttributes, selected } = props
  const { src, alt, caption, width } = node.attrs

  const [isResizing, setIsResizing] = React.useState(false)
  const [currentWidth, setCurrentWidth] = React.useState(width || '100%')
  const [showSettings, setShowSettings] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  /* ── Resize logic ── */
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    const startX = e.pageX
    const startWidth = e.currentTarget.parentElement?.getBoundingClientRect().width || 0

    const onMove = (mv: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + (mv.pageX - startX))
      setCurrentWidth(`${newWidth}px`)
    }
    const onUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      updateAttributes({ width: currentWidth })
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  React.useEffect(() => {
    if (!isResizing && currentWidth !== width) {
      updateAttributes({ width: currentWidth })
    }
  }, [isResizing, currentWidth, width, updateAttributes])

  /* ── Auto-open settings on first selection ── */
  React.useEffect(() => {
    if (selected) setShowSettings(true)
  }, [selected])

  /* ── Click-outside: close only when clicking fully outside the whole wrapper ── */
  React.useEffect(() => {
    if (!showSettings) return
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as globalThis.Node)) {
        setShowSettings(false)
      }
    }
    // small delay so the click that opened the panel doesn't immediately close it
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 100)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handler)
    }
  }, [showSettings])

  const textAlign = node.attrs.textAlign
  const outerJustify =
    textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'

  return (
    <NodeViewWrapper
      ref={wrapperRef as any}
      className={`my-4 ${selected ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''}`}
      style={{ width: '100%' }}
    >
      {/* ── Side-by-side container ── */}
      <div
        style={{ justifyContent: showSettings ? 'flex-start' : outerJustify }}
        className={`flex w-full gap-4 ${
          showSettings ? 'flex-col sm:flex-row items-start' : 'flex-row'
        }`}
      >
        {/* ── Image side ── */}
        <div
          className="relative group shrink-0"
          style={{
            width: showSettings ? 'min(60%, 100%)' : currentWidth,
            maxWidth: '100%',
          }}
        >
          <img
            src={src}
            alt={alt || ''}
            className="rounded-xl object-contain w-full h-auto cursor-pointer select-none"
            draggable={false}
            onClick={() => setShowSettings(true)}
          />

          {/* "Click to edit" hint badge */}
          {selected && !showSettings && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap shadow">
              Click to edit
            </div>
          )}

          {/* Resize handle — only when settings are closed */}
          {selected && !showSettings && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-10 bg-primary rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center shadow"
              onMouseDown={handleResizeMouseDown}
            >
              <div className="w-0.5 h-5 bg-primary-foreground rounded-full" />
            </div>
          )}
        </div>

        {/* ── Settings panel side ── */}
        {showSettings && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full sm:w-72 shrink-0 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                🖼 Image Settings
              </span>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-base leading-none"
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {/* Alt Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold flex items-center gap-1">
                  Alt Text
                  <span className="font-normal text-muted-foreground text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    SEO
                  </span>
                </label>
                <input
                  type="text"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={alt || ''}
                  onChange={(e) => updateAttributes({ alt: e.target.value })}
                  placeholder="Describe the image for screen readers…"
                />
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Helps search engines understand the image content.
                </p>
              </div>

              {/* Caption */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Caption</label>
                <input
                  type="text"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={caption || ''}
                  onChange={(e) => updateAttributes({ caption: e.target.value })}
                  placeholder="Optional caption shown below image…"
                />
              </div>

              {/* Current alt preview */}
              {alt && (
                <div className="rounded-lg bg-muted/60 border border-border px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Current alt:</span>{' '}
                  {alt}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Caption below */}
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
          {caption}
        </figcaption>
      )}
    </NodeViewWrapper>
  )
}

export const CustomImage = Node.create({
  name: 'customImage',

  group: 'block',

  inline: false,

  draggable: true,

  addAttributes() {
    return {
      src:     { default: null },
      alt:     { default: null },
      title:   { default: null },
      width:   { default: '100%' },
      caption: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption',
        getAttrs: (node) => {
          const img = (node as HTMLElement).querySelector('img')
          if (!img) return false
          return {
            src:     img.getAttribute('src'),
            alt:     img.getAttribute('alt'),
            title:   img.getAttribute('title'),
            width:   img.style.width || '100%',
            caption: (node as HTMLElement).querySelector('figcaption')?.innerText || null,
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (node) => ({
          src:     (node as HTMLElement).getAttribute('src'),
          alt:     (node as HTMLElement).getAttribute('alt'),
          title:   (node as HTMLElement).getAttribute('title'),
          width:   (node as HTMLElement).style.width || '100%',
          caption: null,
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const textAlign = HTMLAttributes.style?.includes('text-align: center')
      ? 'center'
      : HTMLAttributes.style?.includes('text-align: right')
      ? 'right'
      : 'left'

    const wrapperStyle = `display:flex;justify-content:${
      textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'
    };width:100%;`

    if (HTMLAttributes.caption) {
      return [
        'figure',
        { style: wrapperStyle, class: 'my-4' },
        [
          'div',
          { style: `width:${HTMLAttributes.width}` },
          ['img', mergeAttributes(HTMLAttributes, { style: null, class: 'w-full rounded-xl' })],
          ['figcaption', { class: 'text-center text-sm text-muted-foreground mt-2 italic' }, HTMLAttributes.caption],
        ],
      ]
    }

    return [
      'figure',
      { style: wrapperStyle, class: 'my-4' },
      ['img', mergeAttributes(HTMLAttributes, { class: 'max-w-full rounded-xl' })],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },

  // @ts-ignore
  addCommands() {
    return {
      setImage:
        (options: { src: string; alt?: string; title?: string; caption?: string; width?: string }) =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name, attrs: options }),
    }
  },
})
