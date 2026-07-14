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
import { Button } from '@/components/ui/button'
import { Bold, Italic, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Pilcrow, ImageIcon, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Unlink, Highlighter, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { MediaLibraryModal } from './MediaLibraryModal'
import { InlineHeading } from './InlineHeading'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onImageClick?: () => void
}

const MenuBar = ({ editor, onImageClick }: { editor: any, onImageClick?: () => void }) => {
  if (!editor) {
    return null
  }

  const setLink = React.useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border/50 bg-muted/95 backdrop-blur z-40 sticky top-[64px] rounded-t-xl items-center shadow-sm">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={editor.isActive('link') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Add Link"
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

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setParagraph().unsetInlineHeading().run()}
        className={editor.isActive('paragraph') && !editor.isActive('inlineHeading') && !editor.isActive('heading') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
        title="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleInlineHeading(1).run()}
        className={editor.isActive('inlineHeading', { level: 1 }) || editor.isActive('heading', { level: 1 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleInlineHeading(2).run()}
        className={editor.isActive('inlineHeading', { level: 2 }) || editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleInlineHeading(3).run()}
        className={editor.isActive('inlineHeading', { level: 3 }) || editor.isActive('heading', { level: 3 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleInlineHeading(4).run()}
        className={editor.isActive('inlineHeading', { level: 4 }) || editor.isActive('heading', { level: 4 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Heading4 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleInlineHeading(5).run()}
        className={editor.isActive('inlineHeading', { level: 5 }) || editor.isActive('heading', { level: 5 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Heading5 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleInlineHeading(6).run()}
        className={editor.isActive('inlineHeading', { level: 6 }) || editor.isActive('heading', { level: 6 }) ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
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
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-muted text-primary shadow-sm' : 'hover:bg-muted/80'}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <div className="flex items-center gap-1 relative">
        <input
          type="color"
          onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
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
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function RichTextEditor({ content, onChange, onImageClick }: RichTextEditorProps) {
  // Track selected image attrs for the Image Settings bar
  const [isClient, setIsClient] = React.useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false, // disabled — we register LinkExtension below with custom options
      }),
      InlineHeading,
      CustomImage,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'inlineHeading', 'customImage'],
      }),
      Highlight.configure({ multicolor: true }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 cursor-pointer hover:text-blue-600 transition-colors',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none min-h-[500px] p-6 bg-background w-full max-w-none prose-p:leading-normal prose-p:my-1 prose-headings:font-bold prose-headings:my-1 prose-img:rounded-xl prose-a:text-blue-500 prose-a:no-underline hover:prose-a:text-blue-600 prose-li:my-0 prose-ul:my-1 prose-ol:my-1',
      },
      handlePaste: (view, event) => {
        // Allow default behavior for images/files
        if (event.clipboardData?.files?.length) {
          return false;
        }
        
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          // Normalize line endings
          const normalized = text.replace(/\r\n/g, '\n');
          
          // If the pasted content is a single line, force it to be inserted as plain text.
          // This prevents HTML block tags (like <p>) from splitting the current line and adding spaces.
          if (!normalized.includes('\n')) {
            event.preventDefault();
            view.dispatch(view.state.tr.insertText(normalized));
            return true;
          }
        }
        
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

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
      <MenuBar editor={editor} onImageClick={onImageClick} />



      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor, state }) => {
            const hasImage = !!editor.getAttributes('customImage').src
            return !state.selection.empty || hasImage
          }}
          className="flex flex-wrap max-w-2xl bg-popover text-popover-foreground shadow-lg border rounded-xl overflow-hidden p-1 gap-1 items-center z-50"
        >
          {(() => {
            const attrs = editor.getAttributes('customImage')
            const isImage = !!attrs.src
            
            if (!isImage) return null

            return (
              <div className="flex items-center gap-1.5 pr-2 border-r border-border mr-1 bg-muted/40 rounded-lg p-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0 px-1">🖼</span>
                <input
                  type="text"
                  className="h-7 w-24 md:w-32 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={attrs.alt || ''}
                  onChange={(e) => {
                    editor.chain().focus().updateAttributes('customImage', { alt: e.target.value }).run()
                  }}
                  placeholder="Alt Text..."
                  title="Alt Text (SEO)"
                />
                <input
                  type="text"
                  className="h-7 w-24 md:w-32 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={attrs.caption || ''}
                  onChange={(e) => {
                    editor.chain().focus().updateAttributes('customImage', { caption: e.target.value }).run()
                  }}
                  placeholder="Caption..."
                  title="Image Caption"
                />
              </div>
            )
          })()}
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
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <div className="flex items-center gap-1 relative mx-1">
            <input
              type="color"
              onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0"
              title="Text Color"
            />
          </div>

          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href
              const url = window.prompt('URL', previousUrl)
              if (url === null) return
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run()
                return
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }}
            className={editor.isActive('link') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Link"
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().unsetInlineHeading().run()}
            className={editor.isActive('paragraph') && !editor.isActive('inlineHeading') && !editor.isActive('heading') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
            title="Paragraph"
          >
            <Pilcrow className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleInlineHeading(1).run()}
            className={editor.isActive('inlineHeading', { level: 1 }) || editor.isActive('heading', { level: 1 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleInlineHeading(2).run()}
            className={editor.isActive('inlineHeading', { level: 2 }) || editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleInlineHeading(3).run()}
            className={editor.isActive('inlineHeading', { level: 3 }) || editor.isActive('heading', { level: 3 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleInlineHeading(4).run()}
            className={editor.isActive('inlineHeading', { level: 4 }) || editor.isActive('heading', { level: 4 }) ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
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
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-muted text-primary' : 'hover:bg-muted/80'}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
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
      <EditorContent editor={editor} className="flex-1 w-full" />
    </div>
  )
}
