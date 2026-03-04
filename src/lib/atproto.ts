import { NodeOAuthClient } from "@atproto/oauth-client-node";
import type { PrismaClient } from "@/generated/prisma/client";
import { SessionStore, StateStore } from "@/lib/storage";

const createBlueskyClient = async (prisma: PrismaClient): Promise<NodeOAuthClient> => {
  const baseUrl: string = process.env.NEXT_PUBLIC_URL as string;

  return new NodeOAuthClient({
    clientMetadata: {
      client_name: "Skycle.app",
      client_id: `${baseUrl}/client-metadata.json`,
      client_uri: baseUrl,
      redirect_uris: [`${baseUrl}/oauth/callback`],
      policy_uri: `${baseUrl}/privacy`,
      tos_uri: `${baseUrl}/tos`,
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    stateStore: new StateStore(prisma),
    sessionStore: new SessionStore(prisma),
  });
};

export default createBlueskyClient;
