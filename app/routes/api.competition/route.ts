import { uuid } from "@cfworker/uuid";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { object, safeParse, string } from "valibot";

import { client } from "~/db/client.server";
import { competitions } from "~/db/schema";

const schema = object({
  name: string(),
  startedAt: string(),
  endedAt: string(),
});

export const action = async ({ context, request }: LoaderFunctionArgs) => {
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
  const { name, startedAt, endedAt } = res.output;
  const dateStartedAt = new Date(startedAt);
  const dateEndedAt = new Date(endedAt);

  if (dateStartedAt > dateEndedAt) {
    return json(
      { error: "開始日時が終了日時よりも後になっています" },
      { status: 400 },
    );
  }
  if (isNaN(dateStartedAt.getTime()) || isNaN(dateEndedAt.getTime())) {
    return json({ error: "日付が不正です" }, { status: 400 });
  }
  const verificationCode = uuid();
  const competition = await client(context.env.DB)
    .insert(competitions)
    .values({
      name,
      startedAt: dateStartedAt.toISOString(),
      endedAt: dateEndedAt.toISOString(),
      verificationCode,
    })
    .returning();

  return json({ competition });
};
