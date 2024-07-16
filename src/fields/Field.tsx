'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type ForwardRefExoticComponent } from 'react'
import { ControllerRenderProps, FieldPath, FieldValues, useFormContext } from 'react-hook-form'
import { ChunkUpload, type ChunkUploadSchemaField } from './ChunkUpload'
import { DatePicker, type DatePickerSchemaField } from './DatePicker'
import { Editor } from './Editor'
import { ImageUpload, type ImageUploadSchemaField } from './ImageUpload'
import { ImagesUpload, ImagesUploadSchemaField } from './ImagesUpload'

interface PossibleOptionItem {
  label: string
  value: string
}

export interface BaseSchemaField<V extends FieldValues = FieldValues> {
  name: ControllerRenderProps<V, FieldPath<V>>['name']
  label: string
  type: string
  description?: string
}

interface InputSchemaField<V extends FieldValues = FieldValues> extends BaseSchemaField<V> {
  type: 'text' | 'number' | 'email' | 'password' | 'textarea'
  placeholder?: string
}

interface HasOptionsSchemaField<V extends FieldValues = FieldValues> extends BaseSchemaField<V> {
  type: 'select' | 'radio'
  options: PossibleOptionItem[] | string[]
}

export type SchemaField<V extends FieldValues = FieldValues> =
  | BaseSchemaField<V>
  | InputSchemaField<V>
  | HasOptionsSchemaField<V>
  | DatePickerSchemaField<V>
  | ChunkUploadSchemaField<V>
  | ImageUploadSchemaField<V>
  | ImagesUploadSchemaField<V>

interface Props<
  V extends FieldValues = FieldValues,
  TSchema extends BaseSchemaField<V> = BaseSchemaField<V>,
> {
  schema: TSchema
}

const FIELD_MAPS: Record<string, ForwardRefExoticComponent<any>> = {
  text: Input,
  number: Input,
  email: Input,
  password: Input,
  textarea: Textarea,
  checkbox: Checkbox,
  // select
  // radio: RadioGroup,
  editor: Editor,
  image: ImageUpload,
  images: ImagesUpload,
  date: DatePicker,
  upload: ChunkUpload,
}

export const Field = <
  V extends FieldValues = FieldValues,
  TSchema extends BaseSchemaField<V> = BaseSchemaField<V>,
>({
  schema,
}: Props<V, TSchema>) => {
  const { control } = useFormContext<V>()
  const Comp = Object.keys(FIELD_MAPS).includes(schema.type) ? FIELD_MAPS[schema.type] : null
  if (!Comp) {
    console.error(`Field type ${schema.type} is not supported`)
    return null
  }

  return (
    <FormField<V>
      control={control}
      name={schema.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{schema.label}</FormLabel>
          <FormControl>
            <Comp {...schema} {...field} />
          </FormControl>
          {schema.description && <FormDescription>{schema.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
