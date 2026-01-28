import { app } from "./index";
import { env } from "./lib/env";

app.listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${String(app.server?.hostname)}:${String(app.server?.port)}`,
);
console.log(
  `📚 API docs available at http://localhost:${String(env.PORT)}/docs`,
);
