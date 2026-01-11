import * as http from 'http';
import { debuggerController } from '../../utils/debuggers';
import { usersDatabase } from '../../@types/httpInterface';
import { getProfileById } from '../../data/databaseAuth';
import { insertProduct } from '../../data/databaseProducts';
import { dataDrain } from '../../utils/dataDrainer';
import { insertInterface } from '../../@types/payload';
import { codeCase } from '../../utils/endPoints';

async function meController(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    debug: boolean,
    routes: Array<string>,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> priv.controller.ts <------<');
    debuggerController('meController', req, debug, step, routes);

    try {
        if(!req.user?.user_id) {
            codeCase(res, 'PROD_003', debug, step);
            return;
        };
        const userID = req.user.user_id;

        const profile: usersDatabase = await getProfileById(userID, debug, step);

        console.log(profile);
        
    } catch (error) {
        return;
    };
};

export { meController };