import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import AppSource from './gatewaySource';

const gateway = new ApolloGateway({
    serviceList: [
        {
            name: "auth",
            url: `${process.env.AUTH_DOMAIN}${process.env.GRAPHQL_PATH}`,
            //http://localhost:4001/graphql
        },
        {
            name: "course",
            url: `${process.env.COURSE_DOMAIN}${process.env.GRAPHQL_PATH}`,
            //http://localhost:4002/graphql
        },
        {
            name: "student",
            url: `${process.env.STUDENT_DOMAIN}${process.env.GRAPHQL_PATH}`,
            //http://localhost:4003/graphql
        }
    ],
    buildService({name, url}){
        return new AppSource({url})
    }
});

const apolloServer = new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req }) => ({ req: req, res: req.res })
});

const app = express();
apolloServer.applyMiddleware({app, cors: false});

app.listen(process.env.GRAPHQL_PORT);
console.log(`Gateway server started at domain : ${process.env.GRAPHQL_DOMAIN}`)