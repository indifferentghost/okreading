import { Hono } from "hono/mod.ts";
import { Layout } from "./src/Layout.tsx";

const app = new Hono();

app.get("/", (c) => {
	return c.html(
		<Layout>hello world</Layout>,
	);
});

Deno.serve(app.fetch);
