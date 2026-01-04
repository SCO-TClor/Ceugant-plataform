import * as http from "http";
import app from "./app";
// import { emailVerifier, generateSecureToken } from "./utils/emailSender";
// import { getUsers } from "./data/databaseCtrl";

// nome: Ceugant

const debug = true;
const porta = Number(process.env.SERVER_PORT);
const allowedOrigins = {
    plataform: process.env.ALLOWED_ORIGIN_PLATAFORM || '',
    clients  : process.env.ALLOWED_ORIGIN_CLIENTS || ''
};

 
const server = http.createServer( async (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    let step = 0;
    const request = req.url || '/';
    const routes = request.split('/').filter(Boolean) || [''];

    const data = new Date().toISOString();

    if(debug) console.log('<--------------------------------->');
    if(debug) console.log('<----------< server.ts >---------->');
    if(debug) console.log(`Date    | ${data}`);
    if(debug) console.log(`Step    | ${step}`);
    if(debug) console.log(`Req.url | > ${request} <`);
    if(debug) console.log(`Pieces  | >`, routes ,`<`);
    step++;
    
    await app(req, res, allowedOrigins, routes, debug, step);
});

server.listen(porta, () => {
    console.log(`Servidor iniciado na porta ${porta}`);
});