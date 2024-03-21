import type { PropsWithChildren } from "hono/jsx/types.ts";

export const HomeLayout = (
	{ children }: PropsWithChildren,
) => (
	<>
		<header class="container">
			<nav>
				<ul>
					<li>
						<strong>
							<a class="contrast" hx-boost href="/">Acme Corp</a>
						</strong>
					</li>
				</ul>
				<ul hx-target=".content" hx-boost hx-trigger="load">
					<li>
						<a href="/top-10">top-10</a>
					</li>
					<li>
						<a href="/read-list">Read List</a>
					</li>
				</ul>
			</nav>
		</header>
		<main class="container content">
			{children}
		</main>
		<footer></footer>
	</>
);
