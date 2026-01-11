import { setRefreshToken } from "../../../data/databaseAuth";
import { HttpError } from "../../../utils/ThrowError";
import { StatusCode } from "../../../@types/headWriter";
import { sendData, usersDatabase } from "../../../@types/httpInterface";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

async function loginService(
    data: sendData,
    profile: usersDatabase,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-------> loginService.ts <-------<');
    if(debug) console.log(`Step   | ${step}`);
    step++;
    
    // const name = data.name;
    const password = data.password;
        
    // Usuário:
    console.log(profile);
    
    // Validação de senha e afins:
    const isValid = await bcrypt.compare(password, profile.password_hash);
    if(!isValid) throw new HttpError(StatusCode.Unauthorized, 'loginService()', 'Email password invalid!', step);

    // Captação do JWT SECRET
    const secretToken = String(process.env.JWT_SECRET);
    const secretRefreshToken = String(process.env.JWT_REFRESH_SECRET);

    // Agora implementar salvamento no database do refreshtoken por aqui!
    const refresh_token = jwt.sign({
            userID: profile.id,
        },
        secretRefreshToken,
        { expiresIn: '7d'}
    );

    const response = await setRefreshToken(profile.email, refresh_token, debug, step);

    if(response.rowCount != 0) {
        console.log('REFRESH TOKEN SETTADO COM SUCESSO!!');
    } else {
        console.log('DEU PROBLEMA AO SETTAR REFRESH TOKEN!!');
    };

    const token = jwt.sign(
        { 
            userId: profile.id,
            email: profile.email
        },
        secretToken,
        { expiresIn: '15m'}
    );

    return {
        refresh_token,
        token,
        user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            verified: profile.email_verified
        }
    };
};

export { loginService };