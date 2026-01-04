import * as http from 'http';
import * as jwt from 'jsonwebtoken';
import { StatusCode } from '../utils/headWriter';
import * as erro from '../utils/endPoints';

function authMiddleware(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> auth.middleware.ts <------<');
    if(debug) console.log(`Step    | ${step}`);
    step++;

    try {
        const Authorization = req.headers.authorization || '';
        const splitted = Authorization.split(' ').filter(Boolean);
        const secret = process.env.JWT_SECRET || '';

        if(Authorization === '') {
            console.log('JWT TOKEN NÃO EXISTE!');
            erro.errorUnauthorized(res, 'Token missing', 'Authorization header not provided', debug, step);
            return null;
        } else if(splitted[0] !== 'Bearer') {
            console.log('Tipo de token inválido!');
            erro.errorUnauthorized(res, 'wrong token typeof', 'Authorization header not provided', debug, step);
            return null;
        };
        if(secret === '') {
            console.log('Secret não capturada pelo .env');
            console.log('Server side erro');
            return null;
        };
        
        const auth = jwt.verify(splitted[1], secret);
        
        return auth;
    } catch (error) {
        console.log('JWT expired');
        erro.errorUnauthorized(res, 'JWT expired', 'JWT não autorizado no middleware', debug, step);
        return null;
    };
};

export { authMiddleware };