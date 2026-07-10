import { Mark, mergeAttributes } from '@tiptap/core'

export interface InlineHeadingOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineHeading: {
      setInlineHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => ReturnType
      toggleInlineHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => ReturnType
      unsetInlineHeading: () => ReturnType
    }
  }
}

export const InlineHeading = Mark.create<InlineHeadingOptions>({
  name: 'inlineHeading',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      level: {
        default: 1,
        parseHTML: element => parseInt(element.getAttribute('data-heading-level') || '1', 10),
        renderHTML: attributes => {
          if (!attributes.level) {
            return {}
          }
          
          let className = 'font-bold ';
          switch(attributes.level) {
            case 1: className += 'text-[36px] md:text-[48px] leading-tight'; break;
            case 2: className += 'text-[28px] md:text-[36px] leading-tight'; break;
            case 3: className += 'text-[22px] md:text-[28px] leading-snug'; break;
            case 4: className += 'text-[18px] md:text-[22px] leading-snug'; break;
            case 5: className += 'text-[16px] md:text-[18px] leading-normal'; break;
            case 6: className += 'text-[14px] md:text-[16px] leading-normal'; break;
          }

          return {
            'data-heading-level': attributes.level,
            class: className,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-heading-level]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setInlineHeading: level => ({ commands }) => {
        return commands.setMark(this.name, { level })
      },
      toggleInlineHeading: level => ({ commands }) => {
        return commands.toggleMark(this.name, { level })
      },
      unsetInlineHeading: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})
