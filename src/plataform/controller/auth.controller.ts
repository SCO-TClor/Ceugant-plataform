import * as http from 'http';
import * as erro from '../../utils/endPoints'
import { dataDrain } from '../../utils/dataDrainer';
import { findUser } from '../../data/databaseCtrl';
import { JwtData, LoginData } from '../../utils/httpInterface';
import { loginService } from '../services/loginSystem';
import { StatusCode } from '../../utils/headWriter';

function debuggerController(
    funcao: string,
    req: http.IncomingMessage,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>--> plataform.constroller.ts <---<');
    if(debug) console.log(`Função | ${funcao}`);
    if(debug) console.log(`Step   | ${step}`);
    if(debug) console.log(`Route  | "${routes}"`);
    if(debug) console.log(`Method | "${req.method}"`);
    step++;
};

async function verifyEmail(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    debuggerController('verifyEmail', req, routes, debug, step);

    try {
        
    } catch (error) {
        
    }
}

async function signup(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    debuggerController('signup', req, routes, debug, step);

    try {
        
    } catch (error) {
        if(debug) console.log('!> plataform.controller / Error! <!');
        if(debug) console.log(`Failed at | step ${step}`);
        throw new Error(`error     | ${error}`);
    };
};

async function login(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    debuggerController('login', req, routes, debug, step);

    try {
        const { email, password } = JSON.parse(await dataDrain(req));
        const data: LoginData = {
            email: email.trim(),
            password: password.trim()
        };
        const exist = await findUser(data.email, debug, step);
        if(!email || !password) {
            erro.errorBadRequest(res, 'Missing important information', 'email OR password doesn\'t exist', debug, step);
        } else if(!exist) {
            erro.errorUnauthorized(res, 'email adress notFound', 'Email doesn\'t exist in the database', debug, step);
        };

        // Sucesso:
        const result: JwtData = await loginService(data, debug, step);
        console.log(result);

        res.writeHead(StatusCode.OK, {'content-type': 'application/json'});
        res.write(JSON.stringify({
            status: 'sucess',
            data: result
        }));
        res.end();
        
    } catch (error) {
        if(debug) console.log('!> plataform.controller / Error! <!');
        if(debug) console.log(`Failed at | step ${step}`);
        throw new Error(`error     | ${error}`);
    };
};

async function refresh(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    debuggerController('refresh', req, routes, debug, step);

    try {
        

    } catch (error) {
        if(debug) console.log('!> plataform.controller / Error! <!');
        if(debug) console.log(`Failed at | step ${step}`);
        throw new Error(`error     | ${error}`);
    };
};

export { signup, login, refresh };