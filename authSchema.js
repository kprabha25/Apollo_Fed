import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    extend type Mutation {
        login(email: String!, password: String!): AccessToken
    }

    type AccessToken {
        accessToken: ID
    }
`;

export const resolvers = {
    Mutation: {
        login: async(_, { email, password }, context) => {
            const accessToken = process.env.SIGNED_ACCESS_TOKEN; //fakeSignedAccessToken
            const cookieName = process.env.SIGNED_ACCESS_NAME; // x-fake-signed-cookie
            const cookieDomain = "localhost";
            const cookieToken = process.env.SIGNED_COOKIE_TOKEN ;//fakeSignedCookieToken
            const cookieExpiration = new Date(new Date().getTime() + 10 * 60000);

            context.res.cookie(cookieName, cookieToken, {
                domain: cookieDomain,
                secure: false,
                httpOnly: false,
                expires: cookieExpiration,
                maxAge: cookieExpiration.getTime()
            });

            context.res.status(200);
            return { accessToken }
        }
    }
}