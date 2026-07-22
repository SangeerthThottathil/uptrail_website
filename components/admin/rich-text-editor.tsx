'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import { uploadFile } from '@/app/admin/actions/content'
import { Underline } from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import { Image as ImageExt } from '@tiptap/extension-image'
import { Youtube } from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { FontFamily } from '@tiptap/extension-font-family'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Quote,
  Smile,
  Type,
  RemoveFormatting,
  Scissors,
  Copy,
  Clipboard,
  Search,
  Link as LinkIcon,
  Unlink,
  Table as TableIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Paperclip,
  Code as CodeIcon,
  Maximize,
  Minimize,
  Undo,
  Redo,
  X,
  Sparkles,
  Columns,
  Rows,
  Trash2,
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

const EMOJIS = ['😀', '😃', '😄', '🚀', '💡', '🔥', '👍', '❤️', '✨', '🎯', '📊', '📈', '🎓', '💼', '⭐', '🎉', '🧠', '💻', '📢', '✅']

const SPECIAL_CHARS = ['©', '®', '™', '€', '£', '$', '¥', '•', '—', '–', '→', '←', '↑', '↓', '±', '≠', '≤', '≥', '½', '¼', '¾', '°', '¶', '§']

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#d9d9d9', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff',
  '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#276749', '#0056d2'
]

const HIGHLIGHT_COLORS = [
  'transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#e9d5ff'
]

const CustomImage = ImageExt.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left',
        renderHTML: (attributes) => {
          if (attributes.align === 'center') {
            return {
              align: 'center',
              style: 'display: block; margin-left: auto; margin-right: auto;',
              class: 'mx-auto block rounded-lg max-w-full h-auto my-4 shadow-sm border border-border',
            }
          }
          if (attributes.align === 'right') {
            return {
              align: 'right',
              style: 'display: block; margin-left: auto; margin-right: 0;',
              class: 'ml-auto block mr-0 rounded-lg max-w-full h-auto my-4 shadow-sm border border-border',
            }
          }
          // Default left
          return {
            align: 'left',
            style: 'display: block; margin-right: auto; margin-left: 0;',
            class: 'mr-auto block ml-0 rounded-lg max-w-full h-auto my-4 shadow-sm border border-border',
          }
        },
        parseHTML: (element) => element.getAttribute('align') || 'left',
      },
    }
  },
})

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false)
  const [sourceCode, setSourceCode] = useState(value || '')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Dialog states
  const [showImageModal, setShowImageModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showEmojiPopover, setShowEmojiPopover] = useState(false)
  const [showCharPopover, setShowCharPopover] = useState(false)
  const [showColorPopover, setShowColorPopover] = useState(false)
  const [showHighlightPopover, setShowHighlightPopover] = useState(false)

  // Inputs
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileTitle, setFileTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMatches, setSearchMatches] = useState<number>(0)

  // Upload status
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [fileUploading, setFileUploading] = useState(false)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CustomImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 shadow-sm border border-border',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl overflow-hidden my-6 shadow-md',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4 text-sm border border-border',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted/60 p-2 font-semibold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border p-2',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent underline hover:text-accent/80 transition-colors cursor-pointer',
        },
      }),
      FontFamily,
      Subscript,
      Superscript,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setSourceCode(html)
      onChange(html)
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none text-foreground bg-background',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML() && !isSourceMode) {
      editor.commands.setContent(value || '')
      setSourceCode(value || '')
    }
  }, [value, editor, isSourceMode])

  if (!editor) {
    return (
      <div className="min-h-[320px] w-full rounded-md border border-border bg-muted/20 animate-pulse p-4 text-xs text-muted-foreground flex items-center justify-center">
        Loading rich text editor...
      </div>
    )
  }

  const handleSourceChange = (newHtml: string) => {
    setSourceCode(newHtml)
    onChange(newHtml)
    if (editor) {
      editor.commands.setContent(newHtml)
    }
  }

  const toggleSourceMode = () => {
    if (isSourceMode) {
      editor.commands.setContent(sourceCode)
    } else {
      setSourceCode(editor.getHTML())
    }
    setIsSourceMode(!isSourceMode)
  }

  // Link helper
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter link URL:', previousUrl || 'https://')
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  // Insert image handler
  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
      setImageUrl('')
      setImageUploadError(null)
      setShowImageModal(false)
    }
  }

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    setImageUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadFile(formData)
      if (res.error) {
        setImageUploadError(res.error)
      } else if (res.url) {
        editor.chain().focus().setImage({ src: res.url }).run()
        setImageUrl('')
        setImageUploadError(null)
        setShowImageModal(false)
      } else {
        setImageUploadError('Upload failed')
      }
    } catch (err: any) {
      setImageUploadError(err.message || 'Upload failed')
    } finally {
      setImageUploading(false)
    }
  }

  // Insert Video handler
  const handleInsertVideo = () => {
    if (videoUrl.trim()) {
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        editor.chain().focus().setYoutubeVideo({ src: videoUrl.trim() }).run()
      } else {
        // Fallback HTML iframe block inside content
        const iframeHtml = `<iframe src="${videoUrl.trim()}" class="w-full aspect-video rounded-xl my-4" allowfullscreen></iframe>`
        editor.chain().focus().insertContent(iframeHtml).run()
      }
      setVideoUrl('')
      setShowVideoModal(false)
    }
  }

  // Insert File attachment helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileUploading(true)
    setFileUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadFile(formData)
      if (res.error) {
        setFileUploadError(res.error)
      } else if (res.url) {
        setFileUrl(res.url)
        if (!fileTitle.trim()) {
          setFileTitle(file.name)
        }
        setFileUploadError(null)
      } else {
        setFileUploadError('Upload failed')
      }
    } catch (err: any) {
      setFileUploadError(err.message || 'Upload failed')
    } finally {
      setFileUploading(false)
    }
  }

  const handleInsertFile = () => {
    if (fileUrl.trim()) {
      const title = fileTitle.trim() || 'Download File Attachment'
      const fileLinkHtml = `<a href="${fileUrl.trim()}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground font-medium text-xs border border-border my-2 hover:bg-secondary/80">📎 ${title}</a>`
      editor.chain().focus().insertContent(fileLinkHtml).run()
      setFileUrl('')
      setFileTitle('')
      setFileUploadError(null)
      setShowFileModal(false)
    }
  }

  // Clipboard actions
  const handleCut = () => {
    document.execCommand('cut')
  }

  const handleCopy = () => {
    document.execCommand('copy')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      editor.chain().focus().insertContent(text).run()
    } catch {
      window.alert('Paste permission denied. Please use Ctrl+V / Cmd+V.')
    }
  }

  // Search in text helper
  const handleSearch = () => {
    if (!searchTerm.trim()) return
    const text = editor.getText()
    const regex = new RegExp(searchTerm.trim(), 'gi')
    const matches = (text.match(regex) || []).length
    setSearchMatches(matches)
  }

  // Headings change
  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === 'p') {
      editor.chain().focus().setParagraph().run()
    } else if (val === 'code') {
      editor.chain().focus().toggleCodeBlock().run()
    } else if (val.startsWith('h')) {
      const level = parseInt(val.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6
      editor.chain().focus().toggleHeading({ level }).run()
    }
  }

  const getCurrentStyleValue = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1'
    if (editor.isActive('heading', { level: 2 })) return 'h2'
    if (editor.isActive('heading', { level: 3 })) return 'h3'
    if (editor.isActive('heading', { level: 4 })) return 'h4'
    if (editor.isActive('heading', { level: 5 })) return 'h5'
    if (editor.isActive('heading', { level: 6 })) return 'h6'
    if (editor.isActive('codeBlock')) return 'code'
    return 'p'
  }

  return (
    <div
      ref={bodyRef}
      className={`w-full rounded-md border border-border shadow-sm bg-card text-foreground transition-all duration-200 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen flex flex-col' : 'relative'
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2 text-foreground select-none">
        
        {/* Style / Heading Dropdown */}
        <select
          value={getCurrentStyleValue()}
          onChange={handleHeadingChange}
          disabled={isSourceMode}
          className="h-8 rounded border border-border bg-background px-2 text-xs font-medium text-foreground outline-none hover:bg-muted focus:ring-1 focus:ring-accent disabled:opacity-40 cursor-pointer"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="code">Code Block</option>
        </select>

        {/* Font Family Dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value === 'default') editor.chain().focus().unsetFontFamily().run()
            else editor.chain().focus().setFontFamily(e.target.value).run()
          }}
          disabled={isSourceMode}
          className="h-8 rounded border border-border bg-background px-2 text-xs font-medium text-foreground outline-none hover:bg-muted focus:ring-1 focus:ring-accent disabled:opacity-40 cursor-pointer"
        >
          <option value="default">Font: Default</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Space Grotesk, sans-serif">Space Grotesk</option>
          <option value="Georgia, serif">Serif</option>
          <option value="Courier New, monospace">Monospace</option>
        </select>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Formatting Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('bold') ? 'bg-muted text-accent font-bold' : ''
          }`}
          title="Bold (Ctrl+B)"
        >
          <BoldIcon className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('italic') ? 'bg-muted text-accent italic' : ''
          }`}
          title="Italic (Ctrl+I)"
        >
          <ItalicIcon className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('underline') ? 'bg-muted text-accent underline' : ''
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('strike') ? 'bg-muted text-accent line-through' : ''
          }`}
          title="Strikethrough"
        >
          <StrikethroughIcon className="size-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Color Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowColorPopover(!showColorPopover)
              setShowHighlightPopover(false)
            }}
            disabled={isSourceMode}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 flex items-center gap-1"
            title="Text Color"
          >
            <Palette className="size-4" />
          </button>
          {showColorPopover && (
            <div className="absolute left-0 mt-2 z-50 p-2 rounded-lg border border-border bg-card shadow-lg grid grid-cols-6 gap-1 w-44">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(c).run()
                    setShowColorPopover(false)
                  }}
                  className="size-5 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run()
                  setShowColorPopover(false)
                }}
                className="col-span-6 text-[10px] text-muted-foreground hover:text-foreground text-center pt-1"
              >
                Reset color
              </button>
            </div>
          )}
        </div>

        {/* Highlight Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowHighlightPopover(!showHighlightPopover)
              setShowColorPopover(false)
            }}
            disabled={isSourceMode}
            className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
              editor.isActive('highlight') ? 'bg-muted text-accent' : ''
            }`}
            title="Highlight / Background Color"
          >
            <Highlighter className="size-4" />
          </button>
          {showHighlightPopover && (
            <div className="absolute left-0 mt-2 z-50 p-2 rounded-lg border border-border bg-card shadow-lg grid grid-cols-4 gap-1.5 w-40">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    if (c === 'transparent') editor.chain().focus().unsetHighlight().run()
                    else editor.chain().focus().toggleHighlight({ color: c }).run()
                    setShowHighlightPopover(false)
                  }}
                  className="size-6 rounded border border-border hover:scale-110 transition-transform flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                  title={c}
                >
                  {c === 'transparent' ? '✕' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => {
            if (editor.isActive('image')) {
              editor.commands.updateAttributes('image', { align: 'left' })
            } else {
              editor.chain().focus().setTextAlign('left').run()
            }
          }}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            (editor.isActive('image') && editor.isActive('image', { align: 'left' })) || (!editor.isActive('image') && editor.isActive({ textAlign: 'left' })) ? 'bg-muted text-accent' : ''
          }`}
          title="Align Left"
        >
          <AlignLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (editor.isActive('image')) {
              editor.commands.updateAttributes('image', { align: 'center' })
            } else {
              editor.chain().focus().setTextAlign('center').run()
            }
          }}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            (editor.isActive('image') && editor.isActive('image', { align: 'center' })) || (!editor.isActive('image') && editor.isActive({ textAlign: 'center' })) ? 'bg-muted text-accent' : ''
          }`}
          title="Align Center"
        >
          <AlignCenter className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (editor.isActive('image')) {
              editor.commands.updateAttributes('image', { align: 'right' })
            } else {
              editor.chain().focus().setTextAlign('right').run()
            }
          }}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            (editor.isActive('image') && editor.isActive('image', { align: 'right' })) || (!editor.isActive('image') && editor.isActive({ textAlign: 'right' })) ? 'bg-muted text-accent' : ''
          }`}
          title="Align Right"
        >
          <AlignRight className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (!editor.isActive('image')) {
              editor.chain().focus().setTextAlign('justify').run()
            }
          }}
          disabled={isSourceMode || editor.isActive('image')}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            !editor.isActive('image') && editor.isActive({ textAlign: 'justify' }) ? 'bg-muted text-accent' : ''
          }`}
          title="Justify"
        >
          <AlignJustify className="size-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Lists & Indentation */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('bulletList') ? 'bg-muted text-accent' : ''
          }`}
          title="Bullet List"
        >
          <List className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('orderedList') ? 'bg-muted text-accent' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          disabled={isSourceMode || !editor.can().sinkListItem('listItem')}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-30"
          title="Indent List Item"
        >
          <Indent className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          disabled={isSourceMode || !editor.can().liftListItem('listItem')}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-30"
          title="Outdent List Item"
        >
          <Outdent className="size-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('blockquote') ? 'bg-muted text-accent' : ''
          }`}
          title="Blockquote"
        >
          <Quote className="size-4" />
        </button>

        {/* Emoji Picker Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowEmojiPopover(!showEmojiPopover)
              setShowCharPopover(false)
            }}
            disabled={isSourceMode}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
            title="Emoji Picker"
          >
            <Smile className="size-4" />
          </button>
          {showEmojiPopover && (
            <div className="absolute left-0 mt-2 z-50 p-2.5 rounded-lg border border-border bg-card shadow-lg grid grid-cols-5 gap-1.5 w-48">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().insertContent(e).run()
                    setShowEmojiPopover(false)
                  }}
                  className="size-7 flex items-center justify-center rounded hover:bg-muted text-lg transition-transform hover:scale-125"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Special Characters Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowCharPopover(!showCharPopover)
              setShowEmojiPopover(false)
            }}
            disabled={isSourceMode}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 text-xs font-semibold px-2"
            title="Special Characters"
          >
            Ω
          </button>
          {showCharPopover && (
            <div className="absolute left-0 mt-2 z-50 p-2.5 rounded-lg border border-border bg-card shadow-lg grid grid-cols-6 gap-1 w-52">
              {SPECIAL_CHARS.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().insertContent(char).run()
                    setShowCharPopover(false)
                  }}
                  className="size-7 flex items-center justify-center rounded border border-border/50 hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors"
                >
                  {char}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Clear Formatting"
        >
          <RemoveFormatting className="size-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Cut / Copy / Paste */}
        <button
          type="button"
          onClick={handleCut}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Cut Selection"
        >
          <Scissors className="size-4" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Copy Selection"
        >
          <Copy className="size-4" />
        </button>
        <button
          type="button"
          onClick={handlePaste}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Paste from Clipboard"
        >
          <Clipboard className="size-4" />
        </button>

        {/* Find / Search Modal trigger */}
        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Find within Content"
        >
          <Search className="size-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Link / Unlink */}
        <button
          type="button"
          onClick={setLink}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('link') ? 'bg-muted text-accent' : ''
          }`}
          title="Insert Link"
        >
          <LinkIcon className="size-4" />
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={isSourceMode}
            className="p-1.5 rounded hover:bg-muted text-destructive transition-colors disabled:opacity-40"
            title="Remove Link"
          >
            <Unlink className="size-4" />
          </button>
        )}

        {/* Table insertion & Controls */}
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          disabled={isSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
            editor.isActive('table') ? 'bg-muted text-accent' : ''
          }`}
          title="Insert Table (3x3)"
        >
          <TableIcon className="size-4" />
        </button>

        {/* Media: Inline Image */}
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Insert Inline Image (Body Content)"
        >
          <ImageIcon className="size-4" />
        </button>

        {/* Media: Video Embed */}
        <button
          type="button"
          onClick={() => setShowVideoModal(true)}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Insert Video Embed (YouTube / Vimeo)"
        >
          <VideoIcon className="size-4" />
        </button>

        {/* Attachment Link */}
        <button
          type="button"
          onClick={() => setShowFileModal(true)}
          disabled={isSourceMode}
          className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40"
          title="Insert File Attachment Link"
        >
          <Paperclip className="size-4" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        {/* Code View / Source Toggle */}
        <button
          type="button"
          onClick={toggleSourceMode}
          className={`p-1.5 rounded hover:bg-muted transition-colors font-mono text-xs flex items-center gap-1 ${
            isSourceMode ? 'bg-accent text-accent-foreground font-bold' : ''
          }`}
          title="View / Edit HTML Source Code"
        >
          <CodeIcon className="size-4" />
          <span>HTML</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
        >
          {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
        </button>

        {/* Undo / Redo */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={isSourceMode || !editor.can().undo()}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-30"
            title="Undo"
          >
            <Undo className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={isSourceMode || !editor.can().redo()}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-30"
            title="Redo"
          >
            <Redo className="size-4" />
          </button>
        </div>
      </div>

      {/* Table Helper Context Sub-bar when cursor is in a table */}
      {editor.isActive('table') && !isSourceMode && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground flex items-center gap-1">
            <TableIcon className="size-3.5" /> Table Controls:
          </span>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-foreground flex items-center gap-1"
          >
            <Rows className="size-3" /> Add Row
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-foreground flex items-center gap-1"
          >
            <Columns className="size-3" /> Add Column
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-destructive"
          >
            Delete Row
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-destructive"
          >
            Delete Column
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="ml-auto px-2 py-0.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium flex items-center gap-1"
          >
            <Trash2 className="size-3" /> Remove Table
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`relative ${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
        {isSourceMode ? (
          <textarea
            value={sourceCode}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="w-full h-full min-h-[300px] p-4 font-mono text-xs text-foreground bg-background focus:outline-none resize-y border-0"
            placeholder="Enter or paste HTML source code..."
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ImageIcon className="size-5 text-accent" /> Insert Inline Article Image
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false)
                  setImageUploadError(null)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {imageUploadError && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded">
                  {imageUploadError}
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={imageUploading}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-2 text-xs text-muted-foreground">OR UPLOAD</span>
                <div className="flex-grow border-t border-border"></div>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  disabled={imageUploading}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-accent-foreground hover:file:opacity-90 cursor-pointer"
                />
              </div>
              {imageUploading && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center py-2 bg-muted/20 rounded">
                  <span className="animate-spin text-accent">⏳</span> Uploading image to storage...
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false)
                  setImageUploadError(null)
                }}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim() || imageUploading}
                className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <VideoIcon className="size-5 text-accent" /> Embed Video
              </h3>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-medium text-muted-foreground">YouTube, Vimeo, or Video URL</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
              <p className="text-[11px] text-muted-foreground">
                Paste a YouTube watch link, Vimeo link, or direct MP4 URL to embed it directly into the article body.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertVideo}
                disabled={!videoUrl.trim()}
                className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                Embed Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Paperclip className="size-5 text-accent" /> Insert File Attachment Link
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowFileModal(false)
                  setFileUploadError(null)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {fileUploadError && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded">
                  {fileUploadError}
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Attachment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Download Course Syllabus (PDF)"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  disabled={fileUploading}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">File URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/files/document.pdf"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  disabled={fileUploading}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-2 text-xs text-muted-foreground">OR UPLOAD</span>
                <div className="flex-grow border-t border-border"></div>
              </div>
              <div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={fileUploading}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-accent-foreground hover:file:opacity-90 cursor-pointer"
                />
              </div>
              {fileUploading && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center py-2 bg-muted/20 rounded">
                  <span className="animate-spin text-accent">⏳</span> Uploading file to storage...
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowFileModal(false)
                  setFileUploadError(null)
                }}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertFile}
                disabled={!fileUrl.trim() || fileUploading}
                className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                Insert Attachment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Find / Search Dialog */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Search className="size-4 text-accent" /> Search within Article
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowSearchModal(false)
                  setSearchTerm('')
                  setSearchMatches(0)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-xs font-medium shrink-0"
                >
                  Find
                </button>
              </div>
              {searchTerm && (
                <p className="text-xs text-muted-foreground">
                  Found <span className="font-bold text-accent">{searchMatches}</span> occurrence(s).
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
