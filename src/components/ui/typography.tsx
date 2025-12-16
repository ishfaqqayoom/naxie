import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode | string;
	className?: string;
}

export function TypographyH1({
	className,
	children,
	...props
}: TypographyProps) {
	return (
		<h1
			className={cn(
				'scroll-m-20 text-4xl font-extrabold tracking-tight',
				className
			)}
			{...props}>
			{children}
		</h1>
	);
}

export function TypographyH2({ className, children }: TypographyProps) {
	return (
		<h2 className={cn('text-3xl font-bold tracking-tight', className)}>
			{children}
		</h2>
	);
}

export function TypographyH3({ className, children }: TypographyProps) {
	return (
		<h3 className={cn('text-2xl font-semibold tracking-tight', className)}>
			{children}
		</h3>
	);
}

export function TypographyH4({ className, children }: TypographyProps) {
	return (
		<h4 className={cn('text-xl font-semibold tracking-tight', className)}>
			{children}
		</h4>
	);
}

export function TypographyP({
	className,
	children,
	...props
}: TypographyProps) {
	return (
		<p className={cn('leading-4', className)} {...props}>
			{children}
		</p>
	);
}

export function TypographySpan({ className, children }: TypographyProps) {
	return <span className={cn('leading-4', className)}>{children}</span>;
}

export function TypographyBlockquote({ className, children }: TypographyProps) {
	return (
		<blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)}>
			{children}
		</blockquote>
	);
}
