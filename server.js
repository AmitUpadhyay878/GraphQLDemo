import {ApolloServer} from 'apollo-server'
import mongoose from 'mongoose'


 import express from 'express'

 const app = express();



import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
// Above package is use to enable a GraphQLPlayground


import  typeDefs from './schemaGQL.js'

import { JWT_SEC, MONGO_URI } from './config.js';



mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
})

mongoose.connection.on("connected",()=>{
            console.log("MongoDb is Connected")
})

mongoose.connection.on("error",(err)=>{
    console.log("Error",err)
})

import  './models/User.js';
import './models/Quote.js';
import resolvers from './resolvers.js'
import jwt from 'jsonwebtoken'


// This is Middleware Function
const context =({req})=>{
    const {authorization} = req.headers
    if(authorization){
                const {userId} = jwt.verify(authorization,JWT_SEC)
                    return{userId}
    }
}


const server = new ApolloServer({

    typeDefs:typeDefs,
    resolvers:resolvers,
    // context is like a midleware  -> when resolver request to server that time context come to middle and first exceute its code and then that request would go to server 
     context:context,
    //({req})=>{
    //     const {authorization} = req.headers
    //     if(authorization){
    //                 const {userId} = jwt.verify(authorization,JWT_SEC)
    //                     return{userId}
    //     }
    // },
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

server.listen().then(({url,port})=>{
                console.log(`Server is Ready on Port ${url}`,`And port is ${port}`)
})
