import type { Meta, StoryObj } from '@storybook/react'

import { FormBuilder } from './FormBuilder'
import { z } from 'zod'

const meta: Meta<typeof FormBuilder> = {
  component: FormBuilder,
}

export default meta

type Story = StoryObj<typeof FormBuilder>

export const Basic: Story = {
  args: {
    fields: [
      {
        type: 'text',
        name: 'name',
        label: 'Name',
        placeholder: 'John Doe',
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email',
        placeholder: 'johndoe@gmail.com',
      },
      {
        type: 'password',
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
      },
      {
        type: 'image',
        name: 'avatar',
        label: 'Avatar',
        accept: 'image/*',
        maxFileSize: 1024 * 1024 * 2, // 2MB
        onUpload: async (_file: File) => {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          return 'https://picsum.photos/200'
        },
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        placeholder: 'Enter your description',
      },
      // {
      //   type: 'select',
      //   name: 'gender',
      //   label: 'Gender',
      //   options: [
      //     { label: 'Male', value: 'male' },
      //     { label: 'Female', value: 'female' },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'role',
      //   label: 'Role',
      //   options: ['admin', 'user'],
      // },
      {
        type: 'date',
        name: 'birthday',
        label: 'Birthday',
        pattern: 'yyyy-MM-dd',
      },
      {
        type: 'editor',
        name: 'bio',
        label: 'Your bio',
      },
    ],
    onSubmit: async (values) => {
      console.log(values)
    },
  },
}

export const WithZodResolver: Story = {
  args: {
    resolver: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      avatar: z.string().url(),
      description: z.string().nullable(),
      birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      bio: z.string().nullable(),
    }),
    fields: [
      {
        type: 'text',
        name: 'name',
        label: 'Name',
        placeholder: 'John Doe',
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email',
        placeholder: 'johndoe@gmail.com',
      },
      {
        type: 'password',
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
      },
      {
        type: 'image',
        name: 'avatar',
        label: 'Avatar',
        accept: 'image/*',
        maxFileSize: 1024 * 1024 * 2, // 2MB
        onUpload: async (_file: File) => {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          return 'https://picsum.photos/200'
        },
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        placeholder: 'Enter your description',
      },
      // {
      //   type: 'select',
      //   name: 'gender',
      //   label: 'Gender',
      //   options: [
      //     { label: 'Male', value: 'male' },
      //     { label: 'Female', value: 'female' },
      //   ],
      // },
      // {
      //   type: 'radio',
      //   name: 'role',
      //   label: 'Role',
      //   options: ['admin', 'user'],
      // },
      {
        type: 'date',
        name: 'birthday',
        label: 'Birthday',
        pattern: 'yyyy-MM-dd',
      },
      {
        type: 'editor',
        name: 'bio',
        label: 'Your bio',
      },
    ],
    onSubmit: async (values) => {
      console.log(values)
    },
  },
}