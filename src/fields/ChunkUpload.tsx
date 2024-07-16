'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { humanFileSize, splitFileToChunks } from '@/lib/utils'
import { CheckIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form'
import { BaseSchemaField } from './Field'

interface OnChunkUploadParams {
  file: File
  chunk: Blob
  index: number
  abortSignal?: AbortSignal
  onProgress: (loaded: number, total: number) => void
}

interface OnChunkUploadPayload {}

export interface ChunkUploadSchemaField<V extends FieldValues = FieldValues>
  extends BaseSchemaField<V> {
  type: 'upload'
  onUploadChunk: (data: OnChunkUploadParams) => Promise<OnChunkUploadPayload>
  accept?: string
  maxFileSize?: number // in bytes
}

interface Props extends ControllerRenderProps, Omit<ChunkUploadSchemaField, 'name'> {}

export const ChunkUpload = forwardRef<HTMLDivElement, Props>(
  ({ name, value, onChange, onUploadChunk, accept = '*', maxFileSize = undefined }, ref) => {
    const { setError, clearErrors } = useFormContext()

    const inputRef = useRef<HTMLInputElement>(null)
    const signal = useRef<AbortController>(new AbortController())

    const [uploadState, setUploadState] = useState<'init' | 'uploading' | 'uploaded' | 'failed'>(
      'init',
    )
    const [file, setFile] = useState<File | null>(null)
    const [chunks, setChunks] = useState<Blob[]>([])
    const [errorChunkIndex, setErrorChunkIndex] = useState<number>(-1)
    const [progress, setProgress] = useState<number>(0)

    const uploadFileHandler = useCallback(async () => {
      if (!file) {
        setError(name, { message: 'Vui lòng chọn tệp tin' })
        return
      }

      if (chunks.length === 0) {
        setError(name, { message: 'Vui lòng không chọn tập tin rỗng' })
        return
      }

      setUploadState('uploading')

      for (const [index, chunk] of Array.from(chunks.entries())) {
        if (index < errorChunkIndex) continue

        const result = await onUploadChunk({
          file,
          chunk,
          index,
          abortSignal: signal.current.signal,
          onProgress: (loaded, total) => {
            const step = 100 / chunks.length
            const currentProgress = step * index

            setProgress(currentProgress + ((loaded + Number.EPSILON) * step) / total)
          },
        })
          .then(async () => {
            if (index === chunks.length - 1) {
              setUploadState('uploaded')
              setProgress(100)
              setChunks([])
            }

            return true
          })
          .catch((error) => {
            if (error === 'canceled') return false

            setError(name, { message: 'Có lỗi xảy ra khi tải lên' })
            setErrorChunkIndex(index)
            setUploadState('failed')

            return false
          })

        if (!result) break
      }
    }, [file, chunks, errorChunkIndex])

    const openFilePicker = () => {
      inputRef.current?.click()
    }

    useEffect(() => {
      if (file) {
        if (maxFileSize && file.size > maxFileSize) {
          setError(name, { message: `Tệp tin phải nhỏ hơn ${humanFileSize(maxFileSize)}` })
          setFile(null)
          return
        }

        if (!accept.includes(file.type)) {
          setError(name, { message: 'Định dạng tệp tin không hợp lệ.' })
          setFile(null)
          return
        }

        clearErrors(name)

        setChunks(splitFileToChunks(file))
      } else {
        setChunks([])
      }
    }, [file])

    useEffect(() => {
      if (uploadState === 'init' && chunks.length > 0) {
        uploadFileHandler()
      }
    }, [uploadState, chunks, uploadFileHandler])

    if (uploadState === 'uploading') {
      return (
        <div className="w-full flex items-start space-x-2">
          <div className="flex-1">
            <Progress value={progress} />
            <p className="text-sm">{file?.name}</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Hủy tải lên</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Huỷ tải lên</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn huỷ tải lên không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">Tiếp tục tải lên</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setUploadState('init')
                      setFile(null)
                      setChunks([])
                      setProgress(0)
                      signal.current?.abort('Người dùng hủy tải lên')
                    }}
                  >
                    Hủy tải lên
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }

    if (uploadState === 'uploaded') {
      return (
        <div className="w-full flex items-start space-x-2">
          <Alert>
            <CheckIcon className="h-4 w-4" />
            <AlertTitle>Tệp tin &quot;{file?.name}&quot; đã tải lên thành công!</AlertTitle>
            <AlertDescription>
              Tệp tin đang được xử lý. Hãy chọn tỉnh, thành phố và ấn &quot;Cập nhật&quot; để tiếp
              tục
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    if (uploadState === 'failed') {
      return (
        <div className="w-full flex items-start space-x-2">
          <Alert variant="destructive">
            <AlertTitle>Tải lên thất bại</AlertTitle>
            <div className="flex gap-2">
              <AlertDescription className="flex-1">
                Đã xảy ra lỗi trong quá trình tải lên tệp tin &quot;{file?.name}&quot;. Ấn{' '}
                <b>Thử lại</b> để tải lên từ tiến trình bị lỗi.
              </AlertDescription>
              <Button
                variant="outline"
                onClick={() => {
                  clearErrors(name)
                  setUploadState('init')
                }}
              >
                Thử lại
              </Button>
            </div>
          </Alert>
        </div>
      )
    }

    return (
      <>
        {value ? (
          <div className="flex items-center gap-2">
            <a href={value} target="_blank" className="text-blue-500 underline text-sm">
              Pointcloud URL
            </a>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1 border border-destructive text-destructive bg-primary-foreground hover:text-primary-foreground"
              onClick={() => {
                onChange('')
              }}
            >
              <TrashIcon className="w-4 h-4" />
              Xoá
            </Button>
          </div>
        ) : (
          <>
            <Input
              ref={inputRef}
              type="file"
              name={name}
              className="hidden"
              accept={accept}
              onChange={(e) => {
                setFile(e.target.files?.[0] || null)
              }}
            />
            <Button type="button" variant="outline" className="gap-1" onClick={openFilePicker}>
              <UploadIcon className="w-4 h-4" />
              <span>Chọn tệp tin</span>
            </Button>
          </>
        )}
      </>
    )
  },
)

ChunkUpload.displayName = 'ChunkUpload'
