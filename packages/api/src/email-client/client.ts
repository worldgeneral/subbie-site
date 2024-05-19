import { SESv2Client } from "@aws-sdk/client-sesv2";

export const ses = new SESv2Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.SES_REGION,
});
