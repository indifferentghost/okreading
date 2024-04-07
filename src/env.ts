import {
	flatten,
	literal,
	minLength,
	object,
	regex,
	safeParse,
	string,
	toLowerCase,
	union,
	url,
} from "valibot/mod.ts";
import { load } from "dotenv/mod.ts";

const LocalEnvSchema = object({
	NODE_ENV: literal("development"),
	URL: string([
		url("URL must be a valid url"),
		regex(
			/^(https?:\/\/localhost)(:[0-9]+)?(\/.*)?$/i,
			"URL should be on localhost",
		),
	]),
});

const ProdEnvSchema = object({
	NODE_ENV: literal("production"),
	URL: string([
		toLowerCase(),
		minLength(3),
		url("URL must be a valid url"),
		regex(
			/^(https?:\/\/(?!localhost)[a-zA-Z0-9-_.]+)(:[0-9]+)?(\/.*)?$/i,
			"URL should NOT be on localhost",
		),
	]),
});

const EnvSchema = union([LocalEnvSchema, ProdEnvSchema]);

const parsedEnv = safeParse(EnvSchema, await load());

if (!parsedEnv.success) {
	console.error(flatten<typeof EnvSchema>(parsedEnv.issues));
	/** @todo 06-03-2024 TD do better */
	throw new Error("failed parse");
}

export const { output: env } = parsedEnv;
