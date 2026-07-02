import * as http from "http";
import * as https from 'https';
import * as fs from 'fs';
import app from "./app";
import { getProfile, getUsers } from "./data/auth.repository";
import { emailInternalServerError, emailVerifier } from "./utils/emailSender";

// nome: Ceugant

const debug = true;
const porta = Number(process.env.SERVER_PORT);
const allowedOrigins = {
    platform : process.env.ALLOWED_ORIGIN_PLATFORM || '',
    clients  : process.env.ALLOWED_ORIGIN_CLIENTS || ''
};

const useHttps =
    fs.existsSync("./localhost+2-key.pem") &&
    fs.existsSync("./localhost+2.pem");

const serverHandler = async (
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
};

const server = useHttps ? https.createServer({
    key: fs.readFileSync('./localhost+2-key.pem'),
    cert: fs.readFileSync('./localhost+2.pem')
}, serverHandler) : http.createServer(serverHandler);

server.listen(porta, () => {
    console.log(`Servidor ${useHttps ? 'HTTPS' : 'HTTP'} iniciado na porta ${porta}`);
});