import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.idToken = token.idToken as string;
            return session;
        },
    },
    events: {
        async signOut({ token }) {
            if (token?.idToken) {
                try {
                    // Construct Keycloak logout URL
                    const issuerUrl = process.env.KEYCLOAK_ISSUER!;
                    const logoutUrl = `${issuerUrl}/protocol/openid-connect/logout`;
                    const params = new URLSearchParams({
                        id_token_hint: token.idToken as string,
                        post_logout_redirect_uri: process.env.NEXTAUTH_URL || "http://localhost:3000"
                    });

                    // This will be called server-side, so we can't redirect directly
                    // The actual redirect will happen in the custom logout page
                    console.log(`Keycloak logout URL: ${logoutUrl}?${params.toString()}`);
                } catch (error) {
                    console.error("Error during Keycloak logout:", error);
                }
            }
        }
    }
};

// Helper function to get Keycloak logout URL
export function getKeycloakLogoutUrl(idToken: string): string {
    const issuerUrl = process.env.KEYCLOAK_ISSUER!;
    const logoutUrl = `${issuerUrl}/protocol/openid-connect/logout`;
    const params = new URLSearchParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: process.env.NEXTAUTH_URL || "http://localhost:3000"
    });
    return `${logoutUrl}?${params.toString()}`;
}
