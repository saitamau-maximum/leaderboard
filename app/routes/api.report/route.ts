import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { client } from "~/db/client.server";
import { competitions, reports } from "~/db/schema";
import { verifyToken } from "~/utils/token";
import { boolean, number, object, safeParse } from "valibot";
import { eq } from "drizzle-orm";

const schema = object({
  pass: boolean(),
  score: number(),
});

export const action = async ({ context, request }: LoaderFunctionArgs) => {
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
  const [competition] = await client(context.env.DB)
    .select({
      id: competitions.id,
      name: competitions.name,
      startedAt: competitions.startedAt,
      endedAt: competitions.endedAt,
    })
    .from(competitions)
    .where(eq(competitions.id, competitionId));

  if (!competition) {
    return json({ error: "大会が見つかりません" }, { status: 404 });
  }

  const startedAt = new Date(competition.startedAt);
  const endedAt = new Date(competition.endedAt);
  const now = new Date();

  if (now < startedAt) {
    return json({ error: "大会はまだ開始されていません" }, { status: 400 });
  }

  if (now > endedAt) {
    return json({ error: "大会はすでに終了しました" }, { status: 400 });
  }

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

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const allReports = await client(context.env.DB)
    .select()
    .from(reports)
    .orderBy(reports.submittedAt)
    .all();

  return json({ reports: allReports });
};
