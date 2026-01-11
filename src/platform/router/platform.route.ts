import * as http from "http";
import { errorNotFound, errorMethodNotAllowed } from "../../utils/endPoints";
import * as authController from '../controller/auth.controller';
import * as privController from '../controller/priv.controller';
import { HttpMethod } from "../../@types/headWriter";
import { authMiddleware } from "../../middleware/auth.middleware";
import { HttpError } from "../../utils/ThrowError";
import { insertProd, getProd } from "../controller/products.controller";
import { getTenant } from "../../data/databaseProducts";

async function platformRouter(
    req: http.IncomingMessage, 
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    try {
        if(debug) console.log('');
        if(debug) console.log('>------> platform.route.ts <------<');
        if(debug) console.log(`Step    | ${step}`);
        if(debug) console.log(`URL     | "${req.url}"`);
        step++;

        const route = routes.shift() || '';
        const authRoute = routes.shift() || '';

        switch (route) {
            case 'auth':
                if(debug) console.log(`Destiny | Authentication`);
                switch (authRoute) {
                    case 'signup':
                        if(req.method === HttpMethod.POST) {
                            await authController.signup(req, res, routes, debug, step);
                        } else {
                            errorMethodNotAllowed(res, 'Method NotFound', 'Method wasn\'t created yet!', debug, step);
                        };
                        break;
                    case 'login':
                        if(req.method === HttpMethod.POST) {
                            await authController.login(req, res, routes, debug, step);
                        } else {
                            errorMethodNotAllowed(res, 'Method NotFound', 'Method wasn\'t created yet!', debug, step);
                        };
                        break;
                    case 'refresh':
                        if(req.method === HttpMethod.POST) {
                            await authController.refresh(req, res, routes, debug, step);
                        } else {
                            errorMethodNotAllowed(res, 'Method NotFound', 'Method wasn\'t created yet!', debug, step);
                        };
                        break;
                    case 'send-verification':
                        if(req.method === HttpMethod.POST) {
                            await authController.sendVerifyEmail(req, res, routes, debug, step);
                        } else {
                            errorMethodNotAllowed(res, 'Method NotFound', 'Method wasn\'t created yet!', debug, step);
                        };
                        break;
                    case 'verify':
                        if(req.method === HttpMethod.GET) {
                            await authController.verifyEmail(req, res, routes, debug, step);
                        } else {
                            errorMethodNotAllowed(res, 'Method NotFound', 'Method wasn\'t created yet!', debug, step);
                        };
                        break;
                    default:
                        errorNotFound(res, 'AuthRoute NotFound', 'authRoute doesn\'t exist!', debug, step);
                        break;
                };
                break;
            case 'private':
                const ok = await authMiddleware(req, res, debug, step);
                if (!ok) return;
                if(debug) console.log(`Destiny | Dashboard`);
                console.log('Informações:', req.user);

                switch (authRoute) {
                    case 'me':
                        await privController.meController(req, res, debug, routes, step);
                        break;
                    case 'products':
                        if(req.method === HttpMethod.GET) {
                            await getProd(req, res, routes, debug, step);
                        };
                        if(req.method === HttpMethod.POST) {
                            await insertProd(req, res, debug, step);
                        };
                        break;
                    default:
                        errorNotFound(res, 'Route NotFound', 'route doesn\'t exist!', debug, step);
                        break;
                };
                break;
            default:
                errorNotFound(res, 'Route NotFound', 'route doesn\'t exist!', debug, step);
                break;
        };
    } catch (erro) {
        if(debug) console.log('!>--!> PlatformRoute / Erro! <!--<!');
        if(erro instanceof HttpError) {
            if(debug) console.log(`Failed at function | ${erro.at}`);
            if(debug) console.log(`Failed at step     | ${erro.step}`);
            return;
        };
        throw new Error(`
            error | ${erro}
            at    | ${step}`);
    };
};

export default platformRouter;