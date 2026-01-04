import * as http from 'http';
import plataformRouter from './plataform/router/plataform.route';
import { StatusCode } from './utils/headWriter';

async function app(
    req: http.IncomingMessage, 
    res: http.ServerResponse,
    allowedOrigins: {
        plataform: string,
        clients: string
    },
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----------> app.ts <------------<');
    if(debug) console.log(`Step    | ${step}`);
    step++;

    try {
        const keys = Object.keys(allowedOrigins);
        const values = Object.values(allowedOrigins);

        switch (routes.shift()) {
            case keys[0]:
                if(debug) console.log('Destiny |', keys[0]);
                
                await plataformRouter(req, res, routes, debug, step);

                break;
            case keys[1]:
                if(debug) console.log('Destiny |', keys[1]);

                break;
            default:
                console.log('Erro    | Origem não permitida!');
                console.log(`Allowed | ${values}`);
                res.writeHead(StatusCode.Unauthorized, { 'content-type': 'application/json'});
                res.write(JSON.stringify({
                    status: 'error',
                    code: `${StatusCode.Unauthorized}, Unauthorized`,
                    message: 'Unauthorized URL origin!'
                }));
                res.end();
                break;
        };
    } catch (err) {
        throw new Error(`Erro no app.ts: ${err}`);
    };
}

export default app;