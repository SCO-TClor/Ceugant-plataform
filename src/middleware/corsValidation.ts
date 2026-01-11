import * as http from 'http';
import { StatusCode } from '../@types/headWriter';

function CORS_validator(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    allowedOrigins: {
        platform: string,
        clients: string
    },
    debug: boolean
): boolean {
    if(debug) console.log('');
    if(debug) console.log('>------> corsValidation.ts <------<');
    
    if(req.method === "OPTIONS") {
        console.log(`Barrier | ${req.method}`);

        const origin = req.headers.origin;

        if(origin && (allowedOrigins.clients === origin || allowedOrigins.platform == origin)) {
            res.writeHead(StatusCode.OK, {
                "access-control-allow-origin": `${origin}`,
                "access-control-allow-methods": "GET, POST, OPTIONS",
                "access-control-expose-headers": "Content-Type"
            });
            res.end();
        } else {
            res.writeHead(StatusCode.OK);
            res.end();
        };
        return true;
    };
    return false;
};

export default CORS_validator;