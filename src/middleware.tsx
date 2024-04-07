import type { FC, PropsWithChildren } from "hono/middleware.ts";
import { createMiddleware, html, raw } from "hono/helper.ts";
import { metapatcher, type MetapatcherProjectParams } from "metapatcher";
import {
	hexColor,
	minLength,
	object,
	optional,
	type Output,
	parse,
	startsWith,
	string,
	toLowerCase,
	url,
} from "valibot/mod.ts";
import { env } from "./env.ts";

const MetaSchema = object({
	FAVICON_PATH: string([startsWith("/"), minLength(2)]),
	META_URL: string([
		toLowerCase(),
		minLength(3),
		url("META_URL must be a valid url"),
	]),
	PRIMARY_COLOR: optional(
		string([hexColor("PRIMARY_COLOR hex color badly formatted")]),
	),
	BACKGROUND_COLOR: optional(
		string([hexColor("BACKGROUND_COLOR hex badly formatted")]),
	),
	APP_NAME: string([minLength(1, "APP_NAME can't be an empty string")]),
});

export type Meta = Output<typeof MetaSchema>;

const generateMeta = (options: Meta) => {
	const meta = parse(MetaSchema, options);

	metapatcher.setFavicon(meta.FAVICON_PATH);
	const projectMeta: MetapatcherProjectParams = {
		name: meta.APP_NAME,
		url: meta.META_URL,
	};
	if (meta.PRIMARY_COLOR) {
		projectMeta.primaryColor = meta.PRIMARY_COLOR;
	}
	if (meta.BACKGROUND_COLOR) {
		projectMeta.backgroundColor = meta.BACKGROUND_COLOR;
	}
	metapatcher.set("meta", {
		id: "charset",
		name: "charset",
		content: "charset=UTF-8",
	});
	metapatcher.set("meta", {
		id: "viewport",
		name: "viewport",
		content: "width=device-width, initial-scale=1, viewport-fit=cover",
	});
	metapatcher.setProjectDetails(projectMeta);
	/** @todo 05-03-2024 TD serve these from my CDN */
	metapatcher.setStylesheet({
		id: "pico",
		href:
			"https://cdn.jsdelivr.net/npm/@picocss/pico@2.0.6/css/pico.jade.min.css",
	});
	metapatcher.setScript({
		id: "htmx",
		src: "https://unpkg.com/htmx.org@1.9.11",
		integrity:
			"sha384-0gxUXCCR8yv9FM2b+U3FDbsKthCI66oH5IA9fHppQq9DDMHuMauqq1ZHBpJxQ0J0",
		crossorigin: "anonymous",
	});

	return metapatcher.dump();
};

const defaultMeta = {
	FAVICON_PATH: "/favicon.ico",
	META_URL: env.URL,
	APP_NAME: "OK Reading",
} as const satisfies Meta;

const getLayout = (options?: Partial<Meta>) => {
	const optionsWithDefaults = Object.assign(defaultMeta, options);
	const meta = generateMeta(optionsWithDefaults);

	return ({ children }: PropsWithChildren) =>
		html`<!DOCTYPE html>${(
			/** @todo 05-03-2024 TD direction and intl */
			<html lang="en" /*dir="ltr"*/>
				<head>{html`${raw(meta)}`}</head>
				<body>{children}</body>
			</html>
		)}`;
};

export const layoutMiddleware = (InnerLayout: FC, options?: Partial<Meta>) => {
	const Layout = getLayout(options);

	return createMiddleware(async (c, next) => {
		if (!c.req.header("hx-request")) {
			c.setRenderer((content) =>
				c.html(
					<Layout>
						<InnerLayout>{content}</InnerLayout>
					</Layout>,
				)
			);
		}
		await next();
	});
};
