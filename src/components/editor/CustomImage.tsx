import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'

const ImageNodeView = (props: any) => {
  const { node, updateAttributes, selected } = props
  const { src, alt, caption, width, height, float, textAlign } = node.attrs

  const [isResizing, setIsResizing] = React.useState(false)
  const [currentWidth, setCurrentWidth] = React.useState(width || '100%')

  /* ── Notify the editor toolbar when this image is selected/deselected ── */
  React.useEffect(() => {
    if (selected) {
      document.dispatchEvent(new CustomEvent('tiptap:imageSelected', {
        detail: { 
          src, 
          alt: alt || '', 
          caption: caption || '', 
          width: currentWidth, 
          height: height || 'auto', 
          float: float || 'none',
          textAlign: textAlign || 'left'
        },
        bubbles: true,
      }))
    } else {
      document.dispatchEvent(new CustomEvent('tiptap:imageDeselected', { bubbles: true }))
    }
  }, [selected, src, alt, caption, currentWidth, height, float, textAlign])

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

  const align = textAlign || 'left'
  const outerJustify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
  const floatValue = float || 'none'
  const isFloating = floatValue !== 'none'

  return (
    <NodeViewWrapper
      className={`my-6 ${selected ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''}`}
      style={{ 
        width: isFloating ? 'auto' : '100%', 
        display: isFloating ? 'block' : 'flex', 
        justifyContent: isFloating ? undefined : outerJustify,
        float: isFloating ? floatValue : undefined,
        margin: floatValue === 'left' ? '0 1.5rem 1rem 0' : floatValue === 'right' ? '0 0 1rem 1.5rem' : undefined,
      }}
      data-align={align}
    >
      <div style={{ width: currentWidth, maxWidth: '100%', marginLeft: align === 'center' || align === 'right' ? 'auto' : undefined, marginRight: align === 'center' ? 'auto' : undefined }}>
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
      src:       { default: null },
      alt:       { default: null },
      title:     { default: null },
      width:     { default: '100%' },
      height:    { default: 'auto' },
      float:     { default: 'none' },
      caption:   { default: null },
      textAlign: { default: 'left' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (node) => {
          const el = node as HTMLElement
          const img = el.querySelector('img')
          if (!img) return false
          
          let floatVal = el.style.float || 'none'
          let alignVal = el.getAttribute('data-align') || 'left'
          
          if (!alignVal || alignVal === 'left') {
            if (el.style.justifyContent === 'center' || el.style.textAlign === 'center' || el.classList.contains('align-center')) {
              alignVal = 'center'
            } else if (el.style.justifyContent === 'flex-end' || el.style.textAlign === 'right' || el.classList.contains('align-right')) {
              alignVal = 'right'
            }
          }
          
          return {
            src:       img.getAttribute('src'),
            alt:       img.getAttribute('alt'),
            title:     img.getAttribute('title'),
            width:     img.style.width || el.style.width || '100%',
            height:    img.style.height || 'auto',
            float:     floatVal,
            caption:   el.querySelector('figcaption')?.innerText || null,
            textAlign: alignVal,
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (node) => {
          const el = node as HTMLElement
          let floatVal = el.style.float || 'none'
          let alignVal = el.getAttribute('data-align') || 'left'
          if (el.style.textAlign === 'center' || el.classList.contains('align-center')) {
            alignVal = 'center'
          } else if (el.style.textAlign === 'right' || el.classList.contains('align-right')) {
            alignVal = 'right'
          }
          
          return {
            src:       el.getAttribute('src'),
            alt:       el.getAttribute('alt'),
            title:     el.getAttribute('title'),
            width:     el.style.width || '100%',
            height:    el.style.height || 'auto',
            float:     floatVal,
            caption:   null,
            textAlign: alignVal,
          }
        }
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes.textAlign || 'left'
    const floatValue = HTMLAttributes.float || 'none'
    const isFloating = floatValue !== 'none'
    
    let wrapperStyle = `width:${isFloating ? 'auto' : '100%'};`
    if (isFloating) {
      wrapperStyle += `display:block;float:${floatValue};margin:${floatValue === 'left' ? '0 1.5rem 1rem 0' : '0 0 1rem 1.5rem'};`
    } else {
      const justify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
      const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'
      wrapperStyle += `display:flex;justify-content:${justify};text-align:${align};margin:${margin};`
    }

    const imgStyle = `height:${HTMLAttributes.height || 'auto'};object-fit:contain;`
    const alignClass = `align-${align}`

    if (HTMLAttributes.caption) {
      return [
        'figure',
        { 
          style: wrapperStyle, 
          class: `my-6 ${alignClass}`,
          'data-align': align 
        },
        ['div', { style: `width:${HTMLAttributes.width};max-width:100%;margin:${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'};` },
          ['img', mergeAttributes(HTMLAttributes, { style: imgStyle, class: 'w-full rounded-xl' })],
          ['figcaption', { class: 'text-center text-sm text-muted-foreground mt-2 italic' }, HTMLAttributes.caption],
        ],
      ]
    }

    return [
      'figure',
      { 
        style: wrapperStyle, 
        class: `my-6 ${alignClass}`,
        'data-align': align 
      },
      ['div', { style: `width:${HTMLAttributes.width};max-width:100%;margin:${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'};` },
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
        (options: { src: string; alt?: string; title?: string; caption?: string; width?: string, height?: string, float?: string, textAlign?: string }) =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name, attrs: options }),
    }
  },
})
