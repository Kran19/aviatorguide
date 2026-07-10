import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'

const ImageNodeView = (props: any) => {
  const { node, updateAttributes, selected } = props
  const { src, alt, caption, width } = node.attrs

  const [isResizing, setIsResizing] = React.useState(false)
  const [currentWidth, setCurrentWidth] = React.useState(width || '100%')
  const [showSettings, setShowSettings] = React.useState(false)

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

  return (
    <NodeViewWrapper 
      className={`relative flex my-4 ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{ width: '100%', justifyContent: node.attrs.textAlign === 'center' ? 'center' : node.attrs.textAlign === 'right' ? 'flex-end' : 'flex-start' }}
    >
      <div className="relative group inline-block" style={{ width: currentWidth, maxWidth: '100%' }}>
        <img 
          src={src} 
          alt={alt || ''} 
          className="rounded-lg object-contain w-full h-auto cursor-pointer"
          onClick={() => setShowSettings(!showSettings)}
        />
        
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

      {showSettings && selected && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-popover text-popover-foreground border shadow-xl rounded-lg p-4 w-[300px] z-50 flex flex-col gap-3">
          <div className="space-y-1 flex flex-col items-start">
            <label htmlFor="alt-text" className="text-xs font-semibold">Alt Text (SEO)</label>
            <input 
              id="alt-text"
              type="text"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={alt || ''} 
              onChange={(e) => updateAttributes({ alt: e.target.value })}
              placeholder="Describe the image..."
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
