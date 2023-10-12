import { cn } from '@/lib/utils'
import React from 'react'

const TitleContent = ({ children, className, ...props }) => {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tight block", className)} {...props}>
      {children}
    </h1>
  )
}

const TitleOption = ({ children, className, ...props }) => {
  return (
    <div className={cn("text-3xl font-bold tracking-tight", className)} {...props}>
      {children}
    </div>
  )
}

const Title = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex w-full justify-between items-center mb-6", className)} {...props}>
      {children}
    </div>
  )
}

export { Title, TitleContent, TitleOption }