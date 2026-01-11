import { getProfile, setVerifyToken } from '../../../data/databaseAuth';
import { emailVerifier } from '../../../utils/emailSender';
import { StatusCode } from '../../../@types/headWriter';
import { sendData, usersDatabase } from '../../../@types/httpInterface';
import * as crypto from 'crypto';
import { HttpError } from '../../../utils/ThrowError';

async function verifyService(
    data: string,
    debug: boolean,
    step: number
) {
    
    if(debug) console.log('');
    if(debug) console.log('>------> verifyService.ts <-------<');
    if(debug) console.log(`Step   | ${step}`);
    step++;

    // Create token:
    const token: string = crypto.randomInt(0,999999).toString().padStart(6, '0');
    const token_splt: string = `${token.slice(0, 3)}-${token.slice(3, 6)}`;

    // Create expire date:
    const expires: Date = new Date(Date.now() + (15 * 60 * 1000));
    
    if(debug) console.log('token: |', token_splt);
    if(debug) console.log('data:  |', data);
    
    const profile: usersDatabase = await getProfile(data, debug, step);
    
    if(!profile) {
        throw new HttpError(StatusCode.NotFound, 'getProfile()', 'Failed to find user in the database', step);
    };
    
    if(profile.email_verified === true) {
        throw new HttpError(StatusCode.OK, 'verifyService()', 'User email has already been verified!', step);
    };
    
    const update = await setVerifyToken(data, token_splt, expires, debug, step);
    
    if(update.rowCount != 1) {
        throw new HttpError(StatusCode.NotFound, 'setVerifyToken()', 'Failed to update email verification', step);
    };
    
    const sended = await emailVerifier(profile.name, data, token_splt, debug);

    return sended;
};

export { verifyService };