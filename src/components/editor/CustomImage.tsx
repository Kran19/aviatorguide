import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'

const ImageNodeView = (props: any) => {
  const { node, updateAttributes, selected } = props
  const { src, alt, caption, width, height, float } = node.attrs

  const [isResizing, setIsResizing] = React.useState(false)
  const [currentWidth, setCurrentWidth] = React.useState(width || '100%')

  /* ── Notify the editor toolbar when this image is selected/deselected ── */
  React.useEffect(() => {
    if (selected) {
      document.dispatchEvent(new CustomEvent('tiptap:imageSelected', {
        detail: { src, alt: alt || '', caption: caption || '', width: currentWidth, height: height || 'auto', float: float || 'none' },
        bubbles: true,
      }))
    } else {
      document.dispatchEvent(new CustomEvent('tiptap:imageDeselected', { bubbles: true }))
    }
  }, [selected, src, alt, caption, currentWidth, height, float])

  /* ── Resize logic ── */
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    const startX = e.pageX
    const startWidth = e.currentTarget.parentElement?.getBoundingClientRect().width || 0

    const onMove = (mv: MouseEvent) => {
      setCurrentWidth(`${Math.max(100, startWidth + (mv.pageX - startX))}px`)
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
    
  const floatValue = float || 'none'
  const isFloating = floatValue !== 'none'

  return (
    <NodeViewWrapper
      className={`my-4 ${selected ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''}`}
      style={{ 
        width: isFloating ? 'auto' : '100%', 
        display: isFloating ? 'block' : 'flex', 
        justifyContent: isFloating ? undefined : outerJustify,
        float: isFloating ? floatValue : undefined,
        margin: floatValue === 'left' ? '0 1.5rem 1rem 0' : floatValue === 'right' ? '0 0 1rem 1.5rem' : undefined,
      }}
    >
      <div style={{ width: currentWidth, maxWidth: '100%' }}>
        <div className="relative group inline-block w-full">
          <img
            src={src}
            alt={alt || ''}
            style={{ height: height || 'auto', objectFit: 'contain' }}
            className="rounded-xl w-full select-none"
            draggable={false}
          />

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
      </div>
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
      height:  { default: 'auto' },
      float:   { default: 'none' },
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
          
          let floatVal = 'none'
          if ((node as HTMLElement).style.float) {
            floatVal = (node as HTMLElement).style.float
          }
          
          return {
            src:     img.getAttribute('src'),
            alt:     img.getAttribute('alt'),
            title:   img.getAttribute('title'),
            width:   img.style.width || '100%',
            height:  img.style.height || 'auto',
            float:   floatVal,
            caption: (node as HTMLElement).querySelector('figcaption')?.innerText || null,
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (node) => {
          let floatVal = 'none'
          if ((node as HTMLElement).style.float) {
            floatVal = (node as HTMLElement).style.float
          }
          
          return {
            src:     (node as HTMLElement).getAttribute('src'),
            alt:     (node as HTMLElement).getAttribute('alt'),
            title:   (node as HTMLElement).getAttribute('title'),
            width:   (node as HTMLElement).style.width || '100%',
            height:  (node as HTMLElement).style.height || 'auto',
            float:   floatVal,
            caption: null,
          }
        }
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const textAlign = HTMLAttributes.style?.includes('text-align: center')
      ? 'center'
      : HTMLAttributes.style?.includes('text-align: right')
      ? 'right'
      : 'left'

    const floatValue = HTMLAttributes.float || 'none'
    const isFloating = floatValue !== 'none'
    
    let wrapperStyle = `width:${isFloating ? 'auto' : '100%'};`
    if (isFloating) {
      wrapperStyle += `display:block;float:${floatValue};margin:${floatValue === 'left' ? '0 1.5rem 1rem 0' : '0 0 1rem 1.5rem'};`
    } else {
      wrapperStyle += `display:flex;justify-content:${textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'};`
    }

    const imgStyle = `height:${HTMLAttributes.height || 'auto'};object-fit:contain;`

    if (HTMLAttributes.caption) {
      return [
        'figure',
        { style: wrapperStyle, class: 'my-4' },
        ['div', { style: `width:${HTMLAttributes.width}` },
          ['img', mergeAttributes(HTMLAttributes, { style: imgStyle, class: 'w-full rounded-xl' })],
          ['figcaption', { class: 'text-center text-sm text-muted-foreground mt-2 italic' }, HTMLAttributes.caption],
        ],
      ]
    }

    return [
      'figure',
      { style: wrapperStyle, class: 'my-4' },
      ['div', { style: `width:${HTMLAttributes.width}` },
        ['img', mergeAttributes(HTMLAttributes, { style: imgStyle, class: 'w-full rounded-xl' })],
      ]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },

  // @ts-ignore
  addCommands() {
    return {
      setImage:
        (options: { src: string; alt?: string; title?: string; caption?: string; width?: string, height?: string, float?: string }) =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name, attrs: options }),
    }
  },
})
