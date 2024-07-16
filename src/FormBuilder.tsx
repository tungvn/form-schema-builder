'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { forwardRef } from 'react'
import { FieldValues, useForm, type DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { Field, type SchemaField as BaseSchemaField } from './fields/Field'
import './styles/global.css'

interface Props<V extends FieldValues, TSchema extends BaseSchemaField<V> = BaseSchemaField<V>> {
  fields: TSchema[]
  resolver?: z.ZodType<V>
  defaultValues?: DefaultValues<V>
  onSubmit: (values: V) => PromiseLike<any>
}

const FormBuilderRender = <V extends FieldValues>(
  { fields = [], defaultValues, resolver, onSubmit }: Props<V>,
  ref: React.ForwardedRef<HTMLFormElement>,
) => {
  const form = useForm<V>({
    resolver: resolver ? zodResolver(resolver) : undefined,
    defaultValues,
  })

  return (
    <Form {...form}>
      <form ref={ref} className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((schema, index) => (
          <Field<V, BaseSchemaField<V>> key={index} schema={schema} />
        ))}
        <div className="flex items-center gap-2">
          <Button variant="default" type="submit">
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const FormBuilder = forwardRef(FormBuilderRender) as <V extends FieldValues>(
  props: Props<V> & { ref?: React.ForwardedRef<HTMLFormElement> },
) => ReturnType<typeof FormBuilderRender>
