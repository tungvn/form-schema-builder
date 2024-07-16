'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons'
import { forwardRef } from 'react'
import { ControllerRenderProps, useFieldArray, useFormContext } from 'react-hook-form'

interface Props extends ControllerRenderProps {}

export const ArrayNameUrl = forwardRef<HTMLDivElement, Props>(({ name }, ref) => {
  const { control, watch, setValue, getFieldState } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const fieldState = getFieldState(name)

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-end -mt-10">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => append({ name: '', url: '' })}
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Input
                value={watch(`${name}.${index}.name`)}
                onChange={(e) =>
                  setValue(`${name}.${index}.name`, e.target.value, {
                    shouldDirty: true,
                  })
                }
                className="flex-1"
                placeholder="Nhập tên"
              />
              {fieldState?.error &&
                Array.isArray(fieldState.error) &&
                fieldState.error?.[index]?.['name']?.message && (
                  <small className="text-destructive">
                    {fieldState.error[index]['name'].message}
                  </small>
                )}
            </div>
            <div className="flex-1">
              <Input
                value={watch(`${name}.${index}.url`)}
                onChange={(e) =>
                  setValue(`${name}.${index}.url`, e.target.value, {
                    shouldDirty: true,
                  })
                }
                className="flex-1"
                placeholder="Nhập đường dẫn"
              />
              {fieldState.error &&
                Array.isArray(fieldState.error) &&
                fieldState.error?.[index]?.['url']?.message && (
                  <small className="text-destructive">
                    {fieldState.error[index]['url'].message}
                  </small>
                )}
            </div>
            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
              <MinusIcon className="w-4 h-4" />
            </Button>
          </div>
        )
      })}
    </div>
  )
})

ArrayNameUrl.displayName = 'ArrayNameUrl'
