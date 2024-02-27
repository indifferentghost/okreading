import type { PropsWithChildren } from "hono/jsx/types.ts";
import { html } from "hono/helper/html/index.ts";

export type LayoutProps = PropsWithChildren<{ title?: string }>;

export const Layout = ({ title, children }: LayoutProps) => (
	html`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>${title}</title>
				<script src="https://unpkg.com/htmx.org@1.9.10"></script>
			</head>
			<body>${children}</body>
		</html>`
);
