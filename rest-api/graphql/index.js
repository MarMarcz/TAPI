import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import {resolvers} from './resolvers/resolvers.js';
import {readFileSync} from 'fs';

const app = express();
const typeDefs = readFileSync('./schemas/schema.graphql', {encoding: "utf8"});

const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(apolloServer))
app.listen(8989, ()=>{console.log("Started on 8989")})