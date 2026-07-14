import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'

const ImageNodeView = (props: any) => {
  const { node, updateAttributes, selected } = props
  const { src, alt, caption, width } = node.attrs

  const [isResizing, setIsResizing] = React.useState(false)
  const [currentWidth, setCurrentWidth] = React.useState(width || '100%')
  const [showSettings, setShowSettings] = React.useState(false)
  const settingsRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    const startX = e.pageX
    const startWidth = e.currentTarget.parentElement?.getBoundingClientRect().width || 0

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.pageX
      const diff = currentX - startX
      const newWidth = Math.max(100, startWidth + diff) // Min width 100px
      setCurrentWidth(`${newWidth}px`)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      updateAttributes({ width: currentWidth })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Update width attribute when currentWidth changes
  React.useEffect(() => {
    if (!isResizing && currentWidth !== width) {
      updateAttributes({ width: currentWidth })
    }
  }, [isResizing, currentWidth, width, updateAttributes])

  // Close settings when clicking outside
  React.useEffect(() => {
    if (!showSettings) return
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettings])

  // Close settings when image is deselected
  React.useEffect(() => {
    if (!selected) setShowSettings(false)
  }, [selected])

  return (
    <NodeViewWrapper 
      className={`relative flex flex-col my-4 ${selected ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : ''}`}
      style={{ width: '100%', alignItems: node.attrs.textAlign === 'center' ? 'center' : node.attrs.textAlign === 'right' ? 'flex-end' : 'flex-start' }}
    >
      <div className="relative group inline-block" style={{ width: currentWidth, maxWidth: '100%' }}>
        <img 
          src={src} 
          alt={alt || ''} 
          className="rounded-lg object-contain w-full h-auto cursor-pointer"
          onClick={() => setShowSettings(!showSettings)}
        />
        
        {/* Click-to-edit hint badge */}
        {selected && !showSettings && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
            Click to edit alt text
          </div>
        )}

        {/* Resize Handle */}
        {selected && (
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-8 bg-primary rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center shadow-sm"
            onMouseDown={handleMouseDown}
          >
            <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
          {caption}
        </figcaption>
      )}

      {/* Settings panel — rendered in normal flow, BELOW the image, never overlapping */}
      {showSettings && selected && (
        <div 
          ref={settingsRef}
          className="w-full max-w-sm mt-3 bg-popover text-popover-foreground border border-border shadow-lg rounded-xl p-4 flex flex-col gap-3"
          style={{ alignSelf: 'flex-start' }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Image Settings</span>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
              title="Close"
            >
              ×
            </button>
          </div>
          <div className="space-y-1 flex flex-col items-start">
            <label htmlFor="alt-text" className="text-xs font-semibold">Alt Text <span className="text-muted-foreground font-normal">(SEO)</span></label>
            <input 
              id="alt-text"
              type="text"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={alt || ''} 
              onChange={(e) => updateAttributes({ alt: e.target.value })}
              placeholder="Describe the image..."
              autoFocus
            />
          </div>
          <div className="space-y-1 flex flex-col items-start">
            <label htmlFor="caption" className="text-xs font-semibold">Caption</label>
            <input 
              id="caption"
              type="text"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={caption || ''} 
              onChange={(e) => updateAttributes({ caption: e.target.value })}
              placeholder="Image caption..."
            />
          </div>
        </div>
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
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
      },
      caption: {
        default: null,
      },
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
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.style.width || '100%',
            caption: (node as HTMLElement).querySelector('figcaption')?.innerText || null
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
          alt: (node as HTMLElement).getAttribute('alt'),
          title: (node as HTMLElement).getAttribute('title'),
          width: (node as HTMLElement).style.width || '100%',
          caption: null
        }),
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const textAlign = HTMLAttributes.style?.includes('text-align: center') ? 'center' 
      : HTMLAttributes.style?.includes('text-align: right') ? 'right' : 'left'
      
    const wrapperStyle = `display: flex; justify-content: ${textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'}; width: 100%;`

    if (HTMLAttributes.caption) {
      return [
        'figure', 
        { style: wrapperStyle, class: 'my-4' },
        ['div', { style: `width: ${HTMLAttributes.width}` },
          ['img', mergeAttributes(HTMLAttributes, { style: null, class: 'w-full' })],
          ['figcaption', { class: 'text-center text-sm text-muted-foreground mt-2 italic' }, HTMLAttributes.caption]
        ]
      ]
    }

    return [
      'figure',
      { style: wrapperStyle, class: 'my-4 m-0' },
      ['img', mergeAttributes(HTMLAttributes, { class: 'max-w-full' })]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },

  // @ts-ignore
  addCommands() {
    return {
      setImage: (options: { src: string, alt?: string, title?: string, caption?: string, width?: string }) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
