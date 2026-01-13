import * as http from 'http';
import platformRouter from './platform/router/platform.route';
import { StatusCode } from './@types/headWriter';
import CORS_validator from './middleware/corsValidation';
import { codeCase } from './utils/endPoints';

async function app(
    req: http.IncomingMessage, 
    res: http.ServerResponse,
    allowedOrigins: {
        platform: string,
        clients: string
    },
    newURL: URL,
    debug: boolean,
    step: number
) {
    const request = newURL.pathname;
    const routes = request.split('/').filter(Boolean);

    if(debug) console.log('');
    if(debug) console.log('>-----------> app.ts <------------<');
    if(debug) console.log(`Step    | ${step}`);
    if(debug) console.log(`Req.url | > ${request} <`);
    if(debug) console.log(`Pieces  | >`, routes ,`<`);
    step++;

    try {
        const keys = Object.keys(allowedOrigins);
        const values = Object.values(allowedOrigins);

        if(CORS_validator(req, res, allowedOrigins, debug)) return;

        switch (routes.shift()) {
            case 'platform':
                if(debug) console.log('Destiny |', keys[0]);
                
                await platformRouter(req, res, routes, debug, step);

                break;
            case 'clients':
                if(debug) console.log('Destiny |', keys[1]);

                break;
            default:
                console.log('Erro    | Origem encontrada!');
                console.log(`Allowed | ${values}`);
                codeCase(res, 'MAIN_003', debug, step)
                break;
        };
    } catch (err) {
        throw new Error(`Erro no app.ts: ${err}`);
    };
}

export default app;