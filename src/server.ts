import * as http from "http";
import app from "./app";
import { getProfile, getUsers } from "./data/databaseAuth";
import { emailInternalServerError } from "./utils/emailSender";

// nome: Ceugant

const debug = true;
const porta = Number(process.env.SERVER_PORT);
const allowedOrigins = {
    platform: process.env.ALLOWED_ORIGIN_PLATFORM || '',
    clients  : process.env.ALLOWED_ORIGIN_CLIENTS || ''
};


const server = http.createServer( async (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {
    let step = 0;
    const newURL = new URL(req.url || '/', process.env.SERVER_ADDRESS);
    const data = new Date().toISOString();
    
    if(debug) console.log('<--------------------------------->');
    if(debug) console.log('<----------< server.ts >---------->');
    if(debug) console.log(`Date    | ${data}`);
    if(debug) console.log(`Method  | ${req.method}`);
    
    step++;
    
    console.log(newURL);
    await app(req, res, allowedOrigins, newURL, debug, step);
    // await getUsers(debug, step); // (isso aqui é para debug meu clark!)
    // await emailInternalServerError('Database users', 'getProfile()', step, debug);
});

server.listen(porta, () => {
    console.log(`Servidor iniciado na porta ${porta}`);
});