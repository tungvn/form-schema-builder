'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { forwardRef } from 'react'
import { ControllerRenderProps, FieldValues, useFieldArray, useFormContext } from 'react-hook-form'
import { ImageUpload, ImageUploadSchemaField } from './ImageUpload'

export interface ImagesUploadSchemaField<V extends FieldValues = FieldValues>
  extends Omit<ImageUploadSchemaField<V>, 'type'> {
  type: 'images'
  maxImages?: number
}

interface Props extends ControllerRenderProps, ImagesUploadSchemaField {}

export const ImagesUpload = forwardRef<HTMLDivElement, Props>(
  ({ maxImages = Number.MAX_SAFE_INTEGER, type, name, value, onChange, ...props }, ref) => {
    const { control, watch, setValue } = useFormContext()
    const { fields, append } = useFieldArray({
      control,
      name,
    })

    return (
      <div ref={ref} className="flex gap-2">
        {fields.map((field, index) => (
          <ImageUpload
            key={field.id}
            type="image"
            name={`${name}.${index}.url`}
            value={watch(`${name}.${index}.url`)}
            onChange={(url) => setValue(`${name}.${index}.url`, url)}
            {...props}
          />
        ))}
        {fields.length < maxImages && (
          <div
            className="flex items-center justify-center w-32 h-32 relative rounded-md border border-input bg-background cursor-pointer"
            onClick={() => append({ url: '' })}
          >
            <PlusIcon className="w-8 h-8" />
          </div>
        )}
      </div>
    )
  },
)

ImagesUpload.displayName = 'ImagesUpload'
