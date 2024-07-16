'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PilcrowIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
} from 'lucide-react'
import { forwardRef } from 'react'

interface Props {
  name: string
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
}

export const Editor = forwardRef<HTMLDivElement, Props>(
  ({ value = '<p></p>', onChange, onBlur, disabled }, ref) => (
    <div ref={ref}>
      <EditorProvider
        content={value}
        extensions={[
          StarterKit.configure({
            heading: {
              levels: [2, 3],
            },
          }),
        ]}
        editable={!disabled}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML())
        }}
        onBlur={onBlur}
        editorProps={{
          attributes: {
            class:
              '!max-w-none prose prose-headings:font-semibold prose-h2:text-xl prose-h3:text-lg prose-p:m-0 prose-p:mb-2 min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          },
        }}
        slotBefore={<MenuBar />}
      />
    </div>
  ),
)

Editor.displayName = 'Editor'

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="flex gap-1 mb-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''}
      >
        <BoldIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}
      >
        <ItalicIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-accent text-accent-foreground' : ''}
      >
        <StrikethroughIcon className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''
        }
      >
        <Heading1Icon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        className={
          editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''
        }
      >
        <Heading2Icon className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''}
      >
        <ListIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''}
      >
        <ListOrderedIcon className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <MinusIcon className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <PilcrowIcon className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <UndoIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <RedoIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}
