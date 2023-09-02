import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { client } from "~/db/client.server";
import { reports } from "~/db/schema";
import { verifyToken } from "~/utils/token";
import { boolean, number, object, safeParse } from "valibot";

const schema = object({
  pass: boolean(),
  score: number(),
});

export const action = async ({ context, request }: LoaderArgs) => {
  if (request.method !== "POST") {
    return json({ error: "メソッドが不正です" }, { status: 400 });
  }
  const token = request.headers.get("Authorization");
  if (!token) {
    return json({ error: "認証トークンがありません" }, { status: 401 });
  }
  const verify = await verifyToken({
    secret: context.env.SECRET,
    token,
  });
  if (!verify) {
    return json({ error: "認証に失敗しました" }, { status: 401 });
  }
  const { teamId, competitionId } = verify;

  const body = await request.json();
  const res = safeParse(schema, body);
  if (!res.success) {
    return json({ error: "リクエストが不正です" }, { status: 400 });
  }
  const { pass, score } = res.output;
  const report = await client(context.env.DB)
    .insert(reports)
    .values({
      teamId,
      competitionId,
      score,
      status: pass ? "pass" : "fail",
      submittedAt: new Date().toISOString(),
    })
    .returning();

  return json({ message: "ok", report });
};

export const loader = async ({ context }: LoaderArgs) => {
  const allReports = await client(context.env.DB)
    .select()
    .from(reports)
    .orderBy(reports.submittedAt)
    .all();

  return json({ reports: allReports });
};
