import jwt from "@tsndr/cloudflare-worker-jwt";

interface Payload {
  competitionId: number;
  teamId: number;
}

interface GenOptions extends Payload {
  secret: string;
}

export const generateToken = async ({
  secret,
  competitionId,
  teamId,
}: GenOptions) => {
  const payload = {
    competitionId,
    teamId,
  };
  const token = await jwt.sign(payload, secret);

  return token;
};

interface VerifyOptions {
  secret: string;
  token: string;
}

export const verifyToken = async ({ secret, token }: VerifyOptions) => {
  const isValid = await jwt.verify(token, secret);

  if (!isValid) {
    return null;
  }

  const { payload } = jwt.decode(token);

  return payload as Payload;
};
