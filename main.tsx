import { Hono } from "hono/mod.ts";
import { logger, serveStatic } from "hono/middleware.ts";
import { HomeLayout } from "./src/HomeLayout.tsx";
import { CaretUp } from "./src/icons/caret-up.tsx";
import { layoutMiddleware } from "./src/middleware.tsx";
import type { ServeStaticOptions } from "hono/middleware/serve-static/index.ts";

const app = new Hono();

const staticOptions: ServeStaticOptions = {
	root: "./",
};

app.all("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));

app.use("/public/*", serveStatic(staticOptions));

app.use(logger());

app.get(
	"/",
	layoutMiddleware(HomeLayout),
	(c) => c.render(<h1>Hello World</h1>),
);

app.get("/read-list", layoutMiddleware(HomeLayout), (c) => {
	return c.render(
		<>
			<h2>Read List</h2>
			<ol>
				<li>
					<div style="display: flex;">
						<button
							class="outline"
							style="--pico-form-element-spacing-vertical: 0rem; --pico-form-element-spacing-horizontal: 0rem;"
						>
							<CaretUp />
						</button>
						<p>This is the text that never ends</p>
					</div>
				</li>
			</ol>
		</>,
	);
});

app.get("/top-10", layoutMiddleware(HomeLayout), (c) => {
	return c.render(
		<ol hx-boost>
			<li>
				<a href={`/book/{book.id}`}></a>
			</li>
		</ol>,
	);
});

Deno.serve(app.fetch);
