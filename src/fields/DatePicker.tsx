'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { forwardRef, useState } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { BaseSchemaField } from './Field'

export interface DatePickerSchemaField<V extends FieldValues = FieldValues>
  extends BaseSchemaField<V> {
  type: 'date'
  pattern?: string
}

interface Props extends ControllerRenderProps, Pick<DatePickerSchemaField, 'pattern'> {}

export const DatePicker = forwardRef<HTMLDivElement, Props>(
  ({ value, disabled, pattern = 'dd-MM-Y', onChange }, ref) => {
    const [open, setOpen] = useState<boolean>(false)
    const onSelect = (date: Date | undefined) => {
      if (!date) return

      onChange(format(date, pattern))
      setOpen(false)
    }

    return (
      <div ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !value && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value || <span>Chọn ngày</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={value} onSelect={onSelect} />
          </PopoverContent>
        </Popover>
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
