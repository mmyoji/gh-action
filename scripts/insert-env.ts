import { parseArgs } from "node:util";

import environments from "../.test/env.json" with { type: "json" };

type App = Record<string, unknown> & { environments: { name: string; value: string }[] };

const { values } = parseArgs({
  args: process.argv,
  options: {
    name: {
      type: "string",
    }
  },
  strict: false,
});

const name = values.name;

const mod = await import(`../.test/test.${name}.json`, { with: { type: "json" } });
const json = mod.default as { apps: App[] };

json.apps.map((app) => {
  if (app.name !== name) return app;

  app.environments = [...app.environments, ...environments];
  return app;
});

console.log(JSON.stringify(json, null, 2));
