import * as http from "http";
import { CORS_validator, errorNotFound } from "../../utils/endPoints";
import * as authController from '../controller/auth.controller';
import { HttpMethod } from "../../utils/headWriter";
import { authMiddleware } from "../../middleware/auth.middleware";

async function plataformRouter(
    req: http.IncomingMessage, 
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    try {
        if(debug) console.log('');
        if(debug) console.log('>-----> plataform.route.ts <------<');
        if(debug) console.log(`Step    | ${step}`);
        if(debug) console.log(`URL     | "${req.url}"`);
        step++;
        
        CORS_validator(req, res);

        const route = routes.shift();
        const authRoute = routes.shift() || '';

        switch (route) {
            case 'auth':
                if(debug) console.log(`Destiny | Authentication`);
                if(authRoute === 'signup' && req.method === HttpMethod.POST) {
                    
                };
                if(authRoute === 'login' && req.method === HttpMethod.POST) {
                    await authController.login(req, res, routes, debug, step);
                };
                if(authRoute === 'refresh' && req.method === HttpMethod.GET) {
                    await authController.refresh(req, res, routes, debug, step);
                };
                if(authRoute === 'verify-email' && req.method === HttpMethod.POST) {

                };
                break;
            case 'private':
                const token = authMiddleware(req, res, debug, step);
                if (!token) {
                    console.log('token é null');
                    return;
                };
                console.log('JsonWebToken | ', token);
                if(debug) console.log(`Destiny | Dashboard`);

                break;
            default:
                errorNotFound(res, debug);
                break;
        };
    } catch (err) {
        if(debug) console.log('!>--!> PlataformRoute / Erro <!--<!');
        if(debug) console.log('ro-Erro-Erro-Erro-Erro-Erro-Erro-Er');
        if(debug) console.log(`Failed at | step ${step}`);
        throw new Error(`error     | ${err}`);
    };
};

export default plataformRouter;