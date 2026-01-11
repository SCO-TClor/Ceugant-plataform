import * as http from 'http';
import { debuggerController } from '../../utils/debuggers';
import { findProduct, getProducts, getTenant, insertProduct } from '../../data/databaseProducts';
import { created, errorConflict, sucess } from '../../utils/endPoints';
import { tenants } from '../../data/database/databaseEnum';
import { insertInterface } from '../../@types/payload';
import { dataDrain } from '../../utils/dataDrainer';
import { codeCase } from '../../utils/endPoints';

async function getProd(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    routes: Array<string>,
    debug: boolean,
    step: number
) {
    debuggerController('productsGET', req, debug, step, routes);

    try {
        if(!req.user) {
            codeCase(res, 'PROD_003', debug, step);
            return;
        };
        
        const user = req.user;
        console.log(req.user.user_id)

        const tenant: tenants = await getTenant(user.user_id, debug, step);

        if(debug) console.log(tenant);
        if(debug) console.log('id       |', tenant.id);
        if(debug) console.log('owner_id |', tenant.owner_id);
        if(debug) console.log('name     |', tenant.name);
        if(debug) console.log('slug     |', tenant.slug);
        

        // const response = await getProducts()

    } catch (error) {
        
    };
};

async function insertProd(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> priv.controller.ts <------<');
    debuggerController('insertProd()', req, debug, step);
    
    try {

        
        const { title, price, description, image_src, seo } = JSON.parse(await dataDrain(req));
        console.log('titulo: ', title);

        if(!title || !price) {
            codeCase(res, 'PROD_001', debug, step);
            return;
        };
        console.log('entrou');
        const data: insertInterface = {
            title: title.trim(),
            price: price,
            description: description ? description.trim() : null,
            image_src: image_src ? image_src.trim() : null,
            seo: seo ? seo.trim() : null
        };

        if(!req.user?.tenant_id) {
            codeCase(res, 'PROD_002', debug, step);
            return;
        };

        const exists = await findProduct(req.user.tenant_id, data.title, debug, step);

        console.log(exists);
        
        if(exists) {
            errorConflict(res, 'Product already exist!', 'Produto já existe no banco de dados', debug, step);
            return;
        };

        const insert = await insertProduct(req.user.tenant_id, data.title, data.price, debug, step, data.image_src, data.description, data.seo);

        if(!insert) {
            console.log('deu problema inserindo produto');
        };
        console.log(insert);

        created(res, 'Product created!', 'produto foi criado com sucesso!', debug, step);

    } catch (error) {
        
    };
};

export { getProd, insertProd };