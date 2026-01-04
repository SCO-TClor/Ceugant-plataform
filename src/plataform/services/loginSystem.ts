import { getProfile } from "../../data/databaseCtrl";
import * as bcrypt from 'bcrypt';
import { LoginData } from "../../utils/httpInterface";
import * as jwt from 'jsonwebtoken';

async function loginService(
    data: LoginData,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-------> loginSystem.ts <--------<');
    if(debug) console.log(`Step   | ${step}`);
    step++;
    
    try {
        // const name = data.name;
        const email = data.email;
        const password = data.password;

        // Usuário:
        const profile = await getProfile(email, debug, step);

        // Validação
        const isValid = await bcrypt.compare(password, profile.password_hash);

        const secret = String(process.env.JWT_SECRET);

        if(!isValid) {
            throw new Error(`Invalid password!`);
        };
        
        console.log(profile);

        const token = jwt.sign(
            { 
                userId: profile.id,
                email: profile.email
            },
            secret,
            { expiresIn: '1h'}
        );

        return {
            token,
            user: {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                verified: profile.email_verified
            }
        };
    } catch (err) {
        if(debug) console.log('!>---!> loginSystem / Error <!---<!');
        if(debug) console.log(`Failed at | step ${step}`);
        throw new Error(`error     | ${err}`);
    };
};

export { loginService };