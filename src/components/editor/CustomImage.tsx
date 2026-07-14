import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'

const ImageNodeView = (props: any) => {
  const { node, updateAttributes, selected } = props
  const { src, alt, caption, width } = node.attrs

  const [isResizing, setIsResizing] = React.useState(false)
  const [currentWidth, setCurrentWidth] = React.useState(width || '100%')

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

  const textAlign = node.attrs.textAlign
  const outerJustify =
    textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'

  return (
    <NodeViewWrapper
      className={`my-4 ${selected ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''}`}
      style={{ width: '100%', display: 'flex', justifyContent: outerJustify }}
    >
      <div
        className="relative group"
        style={{ width: currentWidth, maxWidth: '100%' }}
      >
        <img
          src={src}
          alt={alt || ''}
          className="rounded-xl object-contain w-full h-auto select-none"
          draggable={false}
        />

        {/* "Click image to edit" hint */}
        {selected && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap shadow">
            ✏️ Edit in toolbar above
          </div>
        )}

        {/* Resize handle */}
        {selected && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-10 bg-primary rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center shadow"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="w-0.5 h-5 bg-primary-foreground rounded-full" />
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2 italic w-full">
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
        ['div', { style: `width:${HTMLAttributes.width}` },
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
