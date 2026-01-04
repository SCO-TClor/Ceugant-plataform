import * as http from 'http';
import { StatusCode } from './headWriter';


function CORS_validator(
    req: http.IncomingMessage,
    res: http.ServerResponse
) {
    if(req.method === "OPTIONS") {
        console.log(`Barrier | ${req.method}`);
        res.writeHead(StatusCode.OK, {
            "access-control-allow-origin": "http://127.0.0.1:5500",
            "access-control-allow-methods": "GET, POST, OPTIONS",
            "access-control-expose-headers": "Content-Type"
        });
        res.end();
    };
}

function errorNotFound(
    res: http.ServerResponse,
    debug: boolean
) {
    if(debug) console.log('');
    if(debug) console.log('!>--------!> NotFound <!---------<!');
    if(debug) console.log(`StatusCode  | ${StatusCode.NotFound}`);
    if(debug) console.log('');
    if(debug) console.log('!>-----------!> End <!-----------<!');

    res.writeHead(StatusCode.NotFound, { "content-type": "application/json" });
    res.write(JSON.stringify({
        status: "error",
        code: `${StatusCode.NotFound}, NotFound`,
        message: "Url rote designation not founded"
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
    if(debug) console.log('');
    if(debug) console.log('!>------!> Unauthorized <!-------<!');
    if(debug) console.log(`StatusCode  | ${StatusCode.Unauthorized}`);
    if(debug) console.log('');
    if(debug) console.log('!>-----------!> End <!-----------<!');
    
    res.writeHead(StatusCode.Unauthorized, { 'content-type': 'application/json' });
    res.write(JSON.stringify({
        status: 'error',
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
    if(debug) console.log('');
    if(debug) console.log('!>-------!> BadRequest <!--------<!');
    if(debug) console.log(`StatusCode  | ${StatusCode.BadRequest}`);
    if(debug) console.log('');
    if(debug) console.log('!>-----------!> End <!-----------<!');

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

export { CORS_validator, errorNotFound, errorBadRequest, errorUnauthorized } 