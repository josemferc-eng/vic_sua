import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Variant = 'solid' | 'outline'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
  }
>

export function Button({ variant = 'solid', className = '', ...props }: Props) {
  const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')
  return <button {...props} className={classes} />
}
