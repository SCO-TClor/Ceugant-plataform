import * as http from "http";
import * as authController from '../controller/auth.controller';
import * as privController from '../controller/priv.controller';
import { codeCase } from "../../utils/endPoints";
import { HttpMethod, StatusCode } from "../../@types/headWriter";
import { authMiddleware } from "../../middleware/auth.middleware";
import { HttpError } from "../../utils/ThrowError";
import { createProd, deleteProd, readProd, updateProd } from "../controller/products.controller";
import { getTenant } from "../../data/products.repository";

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
                            throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                        };
                        break;
                    case 'login':
                        if(req.method === HttpMethod.POST) {
                            await authController.login(req, res, routes, debug, step);
                        } else {
                            throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                        };
                        break;
                    case 'refresh':
                        if(req.method === HttpMethod.POST) {
                            await authController.refresh(req, res, routes, debug, step);
                        } else {
                            throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                        };
                        break;
                    case 'send-verification':
                        if(req.method === HttpMethod.POST) {
                            await authController.sendVerifyEmail(req, res, routes, debug, step);
                        } else {
                            throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                        };
                        break;
                    case 'verify':
                        if(req.method === HttpMethod.GET) {
                            await authController.verifyEmail(req, res, routes, debug, step);
                        } else {
                            throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                        };
                        break;
                    // Para implementar ------------------------------------------------__
                    // case 'logout':
                    //     if(req.method === HttpMethod.GET) {
                    //         await authController.logout(req, res, routes, debug, step);
                    //     } else {
                    //         throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                    //     };
                    //     break;
                    // case 'forgot-p':
                    //     if(req.method === HttpMethod.GET) {
                    //         await authController.forgot_p(req, res, routes, debug, step);
                    //     } else {
                    //         throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                    //     };
                    //     break;
                    // case 'reset-p':
                    //     if(req.method === HttpMethod.GET) {
                    //         await authController.reset_p(req, res, routes, debug, step);
                    //     } else {
                    //         throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                    //     };
                    //     break;
                    // case 'change-p':
                    //     if(req.method === HttpMethod.GET) {
                    //         await authController.change_p(req, res, routes, debug, step);
                    //     } else {
                    //         throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                    //     };
                    //     break;
                    // case 'get-current':
                    //     if(req.method === HttpMethod.GET) {
                    //         await authController.get_current(req, res, routes, debug, step);
                    //     } else {
                    //         throw new HttpError(StatusCode.MethodNotAllowed, 'plataform.route.ts / platformRouter()', 'Method Not Allowed', step);
                    //     };
                    //     break;
                    // default:
                    //     codeCase(res, 'MAIN_005', debug, step)
                    //     break;
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
                        if(req.method === HttpMethod.POST) {
                            await createProd(req, res, debug, step);
                        };
                        if(req.method === HttpMethod.GET) {
                            await readProd(req, res, debug, step, routes.shift());
                        };
                        if(req.method === HttpMethod.PATCH) {
                            await updateProd(req, res, debug, step);
                        };
                        if(req.method === HttpMethod.DELETE) {
                            await deleteProd(req, res, debug, step);
                        };
                        break;
                    default:
                        codeCase(res, 'MAIN_004', debug, step)
                        break;
                };
                break;
            default:
                codeCase(res, 'MAIN_005', debug, step)
                break;
        };
    } catch (erro) {
        if(debug) console.log('!>--!> PlatformRoute / Erro! <!--<!');
        if(erro instanceof HttpError) {
            if(debug) console.log(`Failed at function | ${erro.at}`);
            if(debug) console.log(`Failed at step     | ${erro.step}`);
            if(erro.statuscode === StatusCode.MethodNotAllowed) {
                codeCase(res, 'MAIN_001', debug, step);
                return;
            };
            codeCase(res, 'MAIN_002', debug, step);
            return;
        };
        throw new Error(`
            error | ${erro}
            at    | ${step}`);
    };
};

export default platformRouter;