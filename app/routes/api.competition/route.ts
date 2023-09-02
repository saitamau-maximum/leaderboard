import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { client } from "~/db/client.server";
import { competitions, teams } from "~/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "~/utils/token";
import { boolean, object, safeParse, string } from "valibot";
import { uuid } from "@cfworker/uuid";

const schema = object({
  name: string(),
  isActive: boolean(),
});

export const action = async ({ context, request }: LoaderArgs) => {
  if (request.method !== "POST") {
    return json({ error: "メソッドが不正です" }, { status: 400 });
  }
  const secret = request.headers.get("SECRET");
  if (!secret || secret !== context.env.SECRET) {
    return json({ error: "許可されていません" }, { status: 401 });
  }
  const body = await request.json();
  const res = safeParse(schema, body);
  if (!res.success) {
    return json({ error: "リクエストが不正です" }, { status: 400 });
  }
  const { name, isActive } = res.output;
  const verificationCode = uuid();
  const competition = await client(context.env.DB)
    .insert(competitions)
    .values({
      name,
      isActive: isActive ? 1 : 0,
      verificationCode,
    })
    .returning();

  return json({ competition });
};
