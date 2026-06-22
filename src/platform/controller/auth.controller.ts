import * as http from 'http';
import * as bcrypt from 'bcrypt';
import * as JwT from 'jsonwebtoken';
import { dataDrain } from '../../utils/dataDrainer';
import { findUser, getProfile, getProfileById, insertUser, updateEmail } from '../../data/auth.repository';
import { JwtData, refreshPayload, sendData, SignUpData, usersDatabase } from '../../@types/httpInterface';
import { loginService } from '../services/auth/login.service';
import { StatusCode } from '../../@types/headWriter';
import { HttpError } from '../../utils/ThrowError';
import { verifyService } from '../services/auth/verify.service';
import { debuggerController } from '../../utils/debuggers';
import { codeCase } from '../../utils/endPoints';
import { emailInternalServerError } from '../../utils/emailSender';
import { setCookies } from '../../utils/cookieSetter';

async function sendVerifyEmail(     // Email verify sender
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> auth.constroller.ts <-----<');
    debuggerController('sendVerifyEmail()', req, debug, step, routes);
    
    try {
        const { email } = JSON.parse(await dataDrain(req));

        const response = await verifyService(email, debug, step);

        if(response === true) {
            codeCase(res, 'AUTH_013', debug, step);
        };

        return;
    } catch (error) {
        if(debug) console.log('!--!> auth.controller / Error <!--!');
        if(error instanceof HttpError) {
            if(debug) console.log(`Step     | ${error.step}`);
            if(debug) console.log(`Error at | ${error.at}`);
            if(debug) console.log(`Info     | ${error.info}`);
            if(debug) console.log(`StatusC  | ${error.statuscode}`);

            if(error.statuscode === StatusCode.NotFound && error.at === 'getProfile()') {
                codeCase(res, 'AUTH_011', debug, step);
                return;
            };
            if(error.statuscode === StatusCode.OK) {
                codeCase(res, 'AUTH_014', debug, step);
                return;
            };
        };
    };
};

async function verifyEmail(         // Email verifier
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> auth.constroller.ts <-----<');
    debuggerController('verifyEmail()', req, debug, step, routes);

    try {
        const newURL = new URL(req.url || '/', process.env.SERVER_ADDRESS);
        const verify_combo = {
            email: newURL.searchParams.get('email') || '',
            token: newURL.searchParams.get('token') || ''
        };
        console.log(verify_combo);

        const profile: usersDatabase = await getProfile(verify_combo.email, debug, step);

        if(profile.email_verified === true) {
            codeCase(res, 'AUTH_014', debug, step);
            return;
        };

        if(profile.verification_token === null || profile.verification_expires === null) {
            codeCase(res, 'AUTH_012', debug, step)
            return;
        };

        const now = new Date();
        if(now > profile.verification_expires) {
            codeCase(res, 'AUTH_008', debug, step)
            return;
        };

        const isValid = await bcrypt.compare(verify_combo.token, profile.verification_token);

        if(!isValid) {
            codeCase(res, 'AUTH_009', debug, step);
            return;
        };


        const update = await updateEmail(profile.email, debug, step);

        if(update.rowCount === 0) {
            codeCase(res, 'MAIN_002', debug, step);
            return;
        };

        codeCase(res, 'AUTH_015', debug, step);
        return;

    } catch (error) {
        if(debug) console.log('!--!> auth.controller / Error <!--!');
        if(debug) console.log(`Failed at | step ${step}`);
        if(error instanceof HttpError) {
            if(debug) console.log(`Step     | ${error.step}`);
            if(debug) console.log(`Error at | ${error.at}`);
            if(debug) console.log(`Info     | ${error.info}`);
            if(debug) console.log(`StatusC  | ${error.statuscode}`);
            if(error.statuscode === StatusCode.NotFound && error.info === 'Failed to update email verification') {
                codeCase(res, 'MAIN_002', debug, step);
                await emailInternalServerError('Failed to update email verification at verifyService()', 'setVerifyToken()', step, debug)
                return;
            };
        };
    };
};

async function signup(              // Sign up
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> auth.constroller.ts <-----<');
    debuggerController('signup()', req, debug, step, routes);

    try {
        const { name, email, password } = JSON.parse(await dataDrain(req));
        const data: SignUpData = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim()
        };
        
        const exist = await findUser(data.email, debug, step);

        if(exist) {
            codeCase(res, 'AUTH_010', debug, step);
            return;
        };

        console.log(data)
        console.log('Existe? ', exist);

        await insertUser(name, email, password, debug, step);

        codeCase(res, 'AUTH_018', debug, step);
        return;
        
    } catch (error) {
        if(debug) console.log('!-> platform.controller / Error <-!');
        if(debug) console.log(`Failed at | step ${step}`);
        throw new Error(`error     | ${error}`);
    };
};

async function login(               // Log in
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> auth.constroller.ts <-----<');
    debuggerController('login()', req, debug, step, routes);

    try {
        console.log('tentativa 1');
        
        const { email, password } = JSON.parse(await dataDrain(req));
        const data: sendData = {
            email: email.trim(),
            password: password.trim()
        };

        if(!email || !password) {
            codeCase(res, 'AUTH_001', debug, step);
            return;
        };

        console.log(data);
        

        const exist = await findUser(data.email, debug, step);

        if(!exist) {
            codeCase(res, 'AUTH_011', debug, step)
            return;
        };
        
        const profile: usersDatabase = await getProfile(data.email, debug, step);

        if(profile.email_verified === false) {
            const error = new HttpError(StatusCode.Unauthorized, 'auth.controller.ts / login()', 'Unverified email!', step);
            throw error;
        };

        // Sucesso:
        const result: JwtData = await loginService(data, profile, debug, step);
        console.log('resultado:', result);

        setCookies(res, 'access_cookie', result.token, 'm', 15, '/', true);
        setCookies(res, 'refresh_cookie', result.refresh_token, 'd', 7, '/platform/auth/refresh', true);

        codeCase(res, 'AUTH_016', debug, step)
        return;
        
    } catch (error) {
        if(debug) console.log('!--!> auth.controller / Error <!--!');
        if(debug) console.log(`Failed at | step ${step}`);
        if(error instanceof HttpError) {
            if(error.statuscode === StatusCode.Unauthorized && error.info === 'Email password invalid!') {
                if(debug) console.log('Catched   | Email password error catched!');
                codeCase(res, 'AUTH_002', debug, step);
                return;
            };

            if(error.statuscode === StatusCode.Unauthorized && error.info === 'Unverified email!') {
                if(debug) console.log('Catched   | Unverified email error catched!');
                codeCase(res, 'AUTH_003', debug, step);
                return;
            };
        };
    };
};

async function refresh(             // Refresh token
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> auth.constroller.ts <-----<');
    debuggerController('refresh()', req, debug, step, routes);

    try {
        const cookie = req.headers.cookie || '';
        const secretRefresh = process.env.JWT_REFRESH_SECRET || '';
        const secretAccess = process.env.JWT_SECRET || '';

        let Auth: {
            [key :string]: string
        } = {};

        const m = cookie.split(';');
        Auth = m.reduce((obj, current) => {
            const [ chave, valor ] = current.split('=');
            obj[chave.trim()] = valor.trim();
            return obj;
        }, Auth);

        console.log(Auth);

        if(!Auth.refresh_cookie) {
            codeCase(res, 'AUTH_004', debug, step);
            return;
        };

        const JwtData: refreshPayload = JwT.verify(Auth.refresh_cookie, secretRefresh) as refreshPayload;
        console.log(JwtData);

        const profile = await getProfileById(JwtData.userID, debug, step);

        if(!profile.refresh_token) {
            codeCase(res, 'AUTH_004', debug, step);
            return;
        };

        const isValid = await bcrypt.compare(Auth.refresh_cookie, profile.refresh_token);

        if(!isValid) {
            codeCase(res, 'AUTH_005', debug, step);
            return;
        };

        const token = JwT.sign(
            {
                userId: profile.id,
                email: profile.email
            },
            secretAccess,
            { expiresIn: "15m"}
        );

        setCookies(res, 'access_cookie', token, 'm', 15, '/', true);
        
        codeCase(res, 'AUTH_017', debug, step)
        return;

    } catch (error) {
        if(debug) console.log('!-> platform.controller / Error <-!');
        if(debug) console.log(`Failed at | step ${step}`);
        codeCase(res, 'AUTH_0121', debug, step);
        return;
    };
};

export { sendVerifyEmail, verifyEmail, signup, login, refresh };