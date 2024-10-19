import { ISUCON_ID } from "./route";

const COMPETITIONS = [
  "MAXISU Private ISU",
  "MAXISU ISUCON10 予選",
  "MAXISU ISUCON10 本戦",
  "MAXISU ISUCON11 予選",
  "MAXISU ISUCON11 本戦",
  "MAXISU ISUCON12 予選",
  "MAXISU ISUCON12 本戦",
];

const now = new Date();
now.setHours(0, 0, 0, 0);

const COMPETITION_DURATION = 8; // 八時間

export const DUMMY_COMPETITIONS = COMPETITIONS.reverse().map((name, index) => ({
  id: index + 1,
  name,
  startedAt: new Date(
    now.getTime() -
      (COMPETITION_DURATION / 2) * 60 * 60 * 1000 -
      index * 24 * 60 * 60 * 1000
  ).toISOString(),
  endedAt: new Date(
    now.getTime() +
      (COMPETITION_DURATION / 2) * 60 * 60 * 1000 -
      index * 24 * 60 * 60 * 1000
  ).toISOString(),
  verificationCode: Math.random().toString(36).slice(-8),
  competitionTypeId: ISUCON_ID,
}));

const TEAMS = ["Maxif.", "Maximum.mum", "Maximum.baby"];

export const DUMMY_TEAMS = DUMMY_COMPETITIONS.flatMap((competition, i) =>
  TEAMS.map((teamName, j) => ({
    id: i * TEAMS.length + j + 1,
    competitionId: competition.id,
    name: teamName,
  }))
);

const REPORTS_PER_TEAM = 30;

// ちょうどいい感じに増えてくけど揺らぎが少しあるスコアをindexとlengthとスコアの最大値から生成する
const generateNiceScore = (index: number, length: number, max: number) => {
  const base = Math.floor(max / length) * index;
  // indexが増えるにつれて振れ幅がおおきくなる
  const diff = (index / length) * max * REPORTS_PER_TEAM;
  return base + Math.floor(Math.random() * diff);
};

const generateDateBetweenByIndex = (start: Date, end: Date, index: number) => {
  const diff = end.getTime() - start.getTime();
  const chunkSize = diff / REPORTS_PER_TEAM;
  const chunkStart = start.getTime() + chunkSize * index;
  const chunkEnd = chunkStart + chunkSize;
  return new Date(
    chunkStart + Math.floor(Math.random() * (chunkEnd - chunkStart))
  );
};

export const DUMMY_REPORTS = DUMMY_COMPETITIONS.flatMap((competition) =>
  DUMMY_TEAMS.flatMap((team) =>
    [...Array(REPORTS_PER_TEAM).keys()].map((index) => ({
      competitionId: competition.id,
      teamId: team.id,
      score: generateNiceScore(index, REPORTS_PER_TEAM, 10000),
      submittedAt: generateDateBetweenByIndex(
        new Date(new Date(competition.startedAt).getTime() + 1000 * 60 * 60),
        new Date(new Date(competition.endedAt).getTime() - 1000 * 60 * 60),
        index
      ).toISOString(),
      status: ["pass", "failed"][Math.floor(Math.random() * 2)],
    }))
  )
);
