'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { humanFileSize } from '@/lib/utils'
import { Cross2Icon, ImageIcon, ReloadIcon } from '@radix-ui/react-icons'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form'
import { BaseSchemaField } from './Field'

export interface ImageUploadSchemaField<V extends FieldValues = FieldValues>
  extends BaseSchemaField<V> {
  type: 'image'
  onUpload: (file: File) => Promise<string>
  accept?: string
  maxFileSize?: number // in bytes
}

interface Props extends ControllerRenderProps, Omit<ImageUploadSchemaField, 'name'> {}

export const ImageUpload = forwardRef<HTMLDivElement, Props>(
  ({ name, value, disabled, onChange, accept, maxFileSize, onUpload }, ref) => {
    const { setError } = useFormContext()

    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)

    const uploadFile = useCallback(async () => {
      if (!file) return

      if (maxFileSize && file.size > maxFileSize) {
        setError(name, {
          message: `File quá lớn, dung lượng tối đa là ${humanFileSize(maxFileSize)}`,
        })
        setFile(null)
        return
      }

      setIsUploading(true)

      await onUpload(file)
        .then(onChange)
        .catch((_error) => {
          setError(name, {
            message: 'Upload ảnh thất bại',
          })
          setFile(null)
        })
        .finally(() => {
          setIsUploading(false)
        })
    }, [file])

    useEffect(() => {
      if (isUploading) return

      uploadFile()
    }, [isUploading, uploadFile])

    return (
      <div ref={ref}>
        <Input
          id={name}
          type="file"
          accept={accept}
          name={name}
          disabled={isUploading || disabled}
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0])
            }
          }}
          className="hidden"
        />
        <label
          htmlFor={name}
          className="flex items-center justify-center w-32 h-32 relative rounded-md border border-input bg-background cursor-pointer"
        >
          {value && !isUploading && (
            <>
              {URL.canParse(value) ? (
                <img
                  src={value}
                  alt="thumbnail"
                  className="!object-contain max-w-full max-h-full"
                />
              ) : (
                <small className="text-xs text-center">URL không hợp lệ</small>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 w-8 h-8 rounded-full overflow-hidden"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setFile(null)
                  onChange('')
                }}
              >
                <Cross2Icon />
              </Button>
            </>
          )}
          {isUploading ? <ReloadIcon className="animate-spin" /> : <ImageIcon />}
        </label>
      </div>
    )
  },
)

ImageUpload.displayName = 'ImageUpload'
