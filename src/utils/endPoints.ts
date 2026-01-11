import * as http from 'http';
import { StatusCode } from '../@types/headWriter';

function debuggerEndPoints(
    StatusC: number,
    debug: boolean,
    info?: string
) {
    if(debug) console.log('');

    switch (StatusC) {
        case StatusCode.NotFound:
            if(debug) console.log('!>--------!> NotFound <!---------<!');
            break;

        case StatusCode.Conflict:
            if(debug) console.log('!>--------!> Conflict <!---------<!');
            break;

        case StatusCode.Unauthorized:
            if(debug) console.log('!>------!> Unauthorized <!-------<!');
            break;
        
        case StatusCode.BadRequest:
            if(debug) console.log('!>-------!> BadRequest <!--------<!');
            break;
        
        case StatusCode.MethodNotAllowed:
            if(debug) console.log('!>----!> MethodNotAllowed <!-----<!');
            break;
        
        case StatusCode.OK:
            if(debug) console.log('<>---------<> Sucess <>----------<>');
            break;
        default:
            break;
    };

    if(debug && info) console.log(`Information | ${info}`);
    if(debug) console.log(`StatusCode  | ${StatusC}`);
    if(debug) console.log('');
    let endSymbolOne = '!';
    let endSymbolTwo = '!';

    if(StatusC === StatusCode.OK) {
        endSymbolOne = '<';
        endSymbolTwo = '>';
    };

    if(debug) console.log(`${endSymbolOne}>-----------${endSymbolOne}> End <${endSymbolTwo}-----------<${endSymbolTwo}`);
};

function errorNotFound(
    res: http.ServerResponse,
    info: string,
    message: string,
    debug: boolean,
    step: number
) {
    debuggerEndPoints(StatusCode.NotFound, debug);

    res.writeHead(StatusCode.NotFound, { "content-type": "application/json" });
    res.write(JSON.stringify({
        status: "error",
        code: `${StatusCode.NotFound}, NotFound`,
        message: {
            step: `NotFound at | step ${step}`,
            info: `${info}`,
            more_info: `${message}`
        }
    }))
    res.end();
    return;
};

function errorUnauthorized(
    res: http.ServerResponse,
    info: string,
    message: string,
    debug: boolean,
    step: number
) {
    debuggerEndPoints(StatusCode.Unauthorized, debug, info);
    
    res.writeHead(StatusCode.Unauthorized, { 'content-type': 'application/json' });
    res.write(JSON.stringify({
        status: "error",
        code: `${StatusCode.Unauthorized}, Unauthorized`,
        message: {
            step: `Unauthorized at | step ${step}`,
            info: `${info}`,
            more_info: `${message}`
        }
    }));
    res.end();
    return;
}

function errorBadRequest(
    res: http.ServerResponse,
    info: string,
    message: string,
    debug: boolean,
    step: number
) {
    debuggerEndPoints(StatusCode.BadRequest, debug, info);

    res.writeHead(StatusCode.BadRequest, { 'content-type': 'application/json' });
    res.write(JSON.stringify({
        status: 'error',
        code: `${StatusCode.BadRequest}, BadRequest`,
        message: {
            step: `BadRequest at | step ${step}`,
            info: `${info}`,
            more_info: `${message}`
        }
    }));
    res.end();
    return;
};

function errorConflict(
    res: http.ServerResponse,
    info: string,
    message: string,
    debug: boolean,
    step: number
) {
    debuggerEndPoints(StatusCode.Conflict, debug, info);

    res.writeHead(StatusCode.Conflict, { "content-type": "application/json" });
    res.write(JSON.stringify({
        status: 'error',
        code: `${StatusCode.Conflict}, Conflict`,
        message: {
            step: `Conflict at | step ${step}`,
            info: `${info}`,
            more_info: `${message}`
        }
    }));
    res.end();
    return;
};

function errorMethodNotAllowed(
    res: http.ServerResponse,
    info: string,
    message: string,
    debug: boolean,
    step: number
) {
    debuggerEndPoints(StatusCode.MethodNotAllowed, debug, info);

    res.writeHead(StatusCode.MethodNotAllowed, { "content-type": "application/json" });
    res.write(JSON.stringify({
        status: 'error',
        code: `${StatusCode.MethodNotAllowed}, MethodNotAllowed`,
        message: {
            step: `NotAllowed at | step ${step}`,
            info: `${info}`,
            more_info: `${message}`
        }
    }));
    res.end();
    return;
};

function sucess(
    res: http.ServerResponse,
    info: string,
    message: string,
    debug: boolean,
    step: number
) {
    debuggerEndPoints(StatusCode.OK, debug, info);

    res.writeHead(StatusCode.OK, { "content-type": "application/json" });
    res.write(JSON.stringify({
        status: "Sucess",
        code: `${StatusCode.OK}, OK`,
        message: {
            step: `Sucess at | step ${step}`,
            info: `${info}`,
            more_info: `${message}`
        }
    }));
    res.end();
    return;
};
function created(
    res: http.ServerResponse,
    info: string,
    message: string,
    debug: boolean,
    step: number
) {
    debuggerEndPoints(StatusCode.Created, debug, info);

    res.writeHead(StatusCode.Created, { "content-type": "application/json" });
    res.write(JSON.stringify({
        status: "Sucess",
        code: `${StatusCode.Created}, Created`,
        message: {
            step: `Created at | step ${step}`,
            info: `${info}`,
            more_info: `${message}`
        }
    }));
    res.end();
    return;
};

const code = {
    AUTH_001: 'AUTH_001'
} as const;

function codeCase(
    res: http.ServerResponse,
    code: string,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('!>------!> endPoints.ts <!-------<!');
    if(debug) console.log(`function | codeCase()`);
    if(debug) console.log(`at step  | ${step}`);
    if(debug) console.log(`code     | > ${code} <`);
    
    
    switch (code) {
        case 'AUTH_001': {      // BADREQUEST       // 400
            const info = 'Missing important information';
            const more_info = 'email OR password doesn\'t exist';
            res.writeHead(StatusCode.BadRequest, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.BadRequest}, BadRequest`,
                type: code,
                message: {
                    step: `BadRequest at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_002': {      // UNAUTHORIZED     // 401
            const info = 'Incorrect email password';
            const more_info = 'Password sended doesn\'t match with the password in the database';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_003': {      // UNAUTHORIZED     // 401
            const info = 'Email wasn\'t verified';
            const more_info = 'Email need to be verified!';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_004': {      // UNAUTHORIZED     // 401
            const info = 'Refresh_cookie does not exist!';
            const more_info = 'Cookie de refresh não existe. necessário o login';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_005': {      // UNAUTHORIZED     // 401
            const info = 'refresh token doesn\'t match!';
            const more_info = 'refresh token sended doesn\'t match with the one in the database';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_006': {      // UNAUTHORIZED     // 401
            const info = 'Token missing';
            const more_info = 'Authorization header not provided';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_007': {      // UNAUTHORIZED     // 401
            const info = 'JWT expired';
            const more_info = 'JWT não autorizado no middleware';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_008': {      // UNAUTHORIZED     // 401
            const info = 'Verification Token expired!';
            const more_info = 'Token sended does not work anymore!';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_009': {      // UNAUTHORIZED     // 401
            const info = 'Verification Token invalid!';
            const more_info = 'Email token verification does not match!';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_010': {      // UNAUTHORIZED     // 401
            const info = '';
            const more_info = '';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_011': {      // UNAUTHORIZED     // 401
            const info = '';
            const more_info = '';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'AUTH_01': {       // NOT FOUND        // 404
            const info = '';
            const more_info = '';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        
        case 'PROD_001': {      // BADREQUEST       // 400
            const info = 'Missing important information';
            const more_info = 'title AND price are required';
            res.writeHead(StatusCode.BadRequest, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.BadRequest}, BadRequest`,
                type: code,
                message: {
                    step: `BadRequest at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'PROD_002': {      // BADREQUEST       // 400
            const info = 'Missing important information';
            const more_info = 'tenant_id not provided / Tenant_id required!';
            res.writeHead(StatusCode.BadRequest, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.BadRequest}, BadRequest`,
                type: code,
                message: {
                    step: `BadRequest at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
        case 'PROD_003': {      // UNAUTHORIZED     // 401
            const info = 'Missing important information';
            const more_info = 'userID was not provided / user_id required!';
            res.writeHead(StatusCode.Unauthorized, { "content-type": "application/json" });
            res.write(JSON.stringify({
                status: 'error',
                code: `${StatusCode.Unauthorized}, Unauthorized`,
                type: code,
                message: {
                    step: `Unauthorized at | step ${step}`,
                    info: `${info}`,
                    more_info: `${more_info}`
                }
            }));
            res.end();
            break;
        };
    
        default:
            console.log('--- Erro dentro de codeCase()');
            console.log('--- at | endPoint.ts');
            break;
    };
};

export { codeCase };

export { errorNotFound, errorConflict, errorMethodNotAllowed, sucess, created } 