import * as http from "http";
import app from "./app";
import { emailVerifier, generateSecureToken } from "./utils/emailSender";
import { randomBytes } from "crypto";
import { getUsers } from "./data/databaseCtrl";

// nome: Ceugant

const debug = true;
const porta = Number(process.env.SERVER_PORT);
const allowedOrigins = {
    plataform: "http://127.0.0.1:5500",
    clients  : "http://localhost:4000"
};


const server = http.createServer( async (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    let step = 0;
    const request = req.url || '/';
    const routes = request.split('/').filter(Boolean) || [''];
    
    // generateSecureToken();
    await getUsers(debug, step);

    const data = new Date().toISOString();

    if(debug) console.log('<--------------------------------->');
    if(debug) console.log('<----------< server.ts >---------->');
    if(debug) console.log(`Date    | ${data}`);
    if(debug) console.log(`Step    | ${step}`);
    if(debug) console.log(`Req.url | > ${request} <`);
    if(debug) console.log(`Pieces  | >`, routes ,`<`);
    step++;

    
    // await emailVerifier('Pedro', 'pedrototosinho@gmail.com', '123-983', debug);
    // await emailVerifier('Luan Valente', 'luanvts20@gmail.com', '198-534', debug);
    // await emailVerifier('Maria Clara', 'luanvts20@gmail.com', '198-534', debug);
    
    await app(req, res, allowedOrigins, routes, debug, step);
});

server.listen(porta, () => {
    console.log(`Servidor iniciado na porta ${porta}`);
});