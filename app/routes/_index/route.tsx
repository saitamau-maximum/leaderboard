import {
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { Register } from "./register";
import { SITE_TITLE } from "~/constants/config";
import { Hero } from "./hero";
import { Description } from "./description";
import { client } from "~/db/client.server";
import { competitions, teams } from "~/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "~/utils/token";
import { useActionData } from "@remix-run/react";

export const action = async ({ context, request }: LoaderArgs) => {
  const body = await request.formData();
  const teamName = body.get("team_name");
  const verificationCode = body.get("verification_code");
  if (
    !teamName ||
    !verificationCode ||
    typeof teamName !== "string" ||
    typeof verificationCode !== "string"
  ) {
    return json(
      {
        type: "error",
        error: "チーム名と認証コードを入力してください",
      },
      {
        status: 400,
      }
    );
  }

  const [selectedCompetition, ..._1] = await client(context.env.DB)
    .select()
    .from(competitions)
    .where(eq(competitions.verificationCode, verificationCode));

  if (!selectedCompetition) {
    return json(
      {
        type: "error",
        error: "認証コードが間違っています",
      },
      {
        status: 400,
      }
    );
  }

  const [newTeam, ..._2] = await client(context.env.DB)
    .insert(teams)
    .values({
      name: teamName,
      competitionId: selectedCompetition.id,
    })
    .returning({
      insertedId: teams.id,
    });

  if (!newTeam) {
    return json(
      {
        type: "error",
        error: "チームの登録に失敗しました",
      },
      {
        status: 400,
      }
    );
  }

  const token = await generateToken({
    secret: context.env.SECRET,
    teamId: newTeam.insertedId,
    competitionId: selectedCompetition.id,
  });

  return json(
    {
      type: "success",
      token,
    },
    {
      status: 200,
    }
  );
};

export default function HomePage() {
  const data = useActionData<typeof action>();

  return (
    <MaxWidthCenterLayout>
      <Hero />
      <Description />
      <Register {...data} />
    </MaxWidthCenterLayout>
  );
}
