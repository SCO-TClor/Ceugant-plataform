import * as http from 'http';
import { debuggerController } from '../../utils/debuggers';
import { findProduct, getProductById, readProducts } from '../../data/databaseProducts';
import { tenants } from '../../data/database/databaseEnum';
import { insertInterface, productInterface } from '../../@types/payload';
import { dataDrain } from '../../utils/dataDrainer';
import { codeCase } from '../../utils/endPoints';
import { insertService } from '../services/products/create.service';
import { HttpError } from '../../utils/ThrowError';
import { StatusCode } from '../../@types/headWriter';
import { updateService } from '../services/products/update.service';
import { deleteService } from '../services/products/delete.service';

async function createProd(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>---> products.controller.ts <----<');
    debuggerController('createProd()', req, debug, step);
    
    try {
        const { title, price, description, image_src, seo } = JSON.parse(await dataDrain(req));
        console.log('titulo: ', title);

        if(!title || !price) {
            codeCase(res, 'PROD_001', debug, step);
            return;
        };

        const data: insertInterface = {
            title: title.trim(),
            price: price,
            description: description ? description.trim() : null,
            image_src: image_src ? image_src.trim() : null,
            seo: seo ? seo.trim() : null
        };

        const inserted = await insertService(data, req.user, debug, step);

        if(inserted) {
            codeCase(res, 'PROD_005', debug, step);
        } else {
            codeCase(res, 'MAIN_002', debug, step);
        };

    } catch (error) {
        if(debug) console.log('!-!> product.controller / Erro <!-!');
        if(debug) console.log(`Failed at | step ${step}`);
        if(error instanceof HttpError) {
            if(error.statuscode === StatusCode.Conflict) {
                if(debug) console.log('Catched   | Product already inserted in the database!');
                codeCase(res, 'PROD_004', debug, step);
                return;
            };
            if(error.statuscode === StatusCode.BadRequest) {
                if(debug) console.log('Catched   | Tenant not provided!');
                codeCase(res, 'PROD_002', debug, step);
                return;
            };
        };
    };
};

async function readProd(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>---> products.controller.ts <----<');
    debuggerController('readProd()', req, debug, step);


    try {
        if(!req.user) {
            codeCase(res, 'PROD_003', debug, step);
            return;
        };

        if(!req.user?.tenant_id) {
            codeCase(res, 'PROD_002', debug, step);
            return;
        };

        const products = await readProducts(req.user.tenant_id, debug, step);

        console.log(products);
        
        codeCase(res, 'PROD_006', debug, step, products);

    } catch (error) {
        
    }
};

async function updateProd(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>---> products.controller.ts <----<');
    debuggerController('updateProd()', req, debug, step);
    
    try {
        if(!req.user) {
            codeCase(res, 'PROD_003', debug, step);
            return;
        };

        if(!req.user?.tenant_id) {
            codeCase(res, 'PROD_002', debug, step);
            return;
        };

        const { title, price, description, image_src, seo, id } = JSON.parse(await dataDrain(req));
        if(!(id && (title || price || description|| image_src|| seo))) {
            codeCase(res, 'PROD_007', debug, step);
            return;
        };

        const data: productInterface = {
            id: id,
            title: title,
            price: price,
            description: description,
            image_src: image_src,
            seo: seo
        };

        const updateData: Record<string, any> = {};

        for (const field of Object.keys(data) as Array<keyof productInterface>) {
            if(data[field] !== null && data[field] !== undefined) {
                updateData[field] = data[field];
            };
        };

        console.log('update data: ---------------');
        console.log(updateData);
        console.log('update data: end -----------');
        

        const update = await updateService(updateData, req.user.tenant_id, debug, step);

        codeCase(res, 'PROD_008', debug, step, update);
        return;
        
    } catch (error) {
        if(debug) console.log('-!> products.controller.ts Erro <!-');
        if(error instanceof HttpError) {
            if(debug) console.log(`Failed at function | ${error.at}`);
            if(debug) console.log(`Failed at step     | ${error.step}`);
            if(error.statuscode === StatusCode.BadRequest) {
                codeCase(res, 'PROD_007', debug, step);
                return;
            };
            codeCase(res, 'MAIN_002', debug, step);
            return;
        };
    };
};

async function deleteProd(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>---> products.controller.ts <----<');
    debuggerController('deleteProd()', req, debug, step);
    
    try {
        if(!req.user) {
            codeCase(res, 'PROD_003', debug, step);
            return;
        };

        if(!req.user?.tenant_id) {
            codeCase(res, 'PROD_002', debug, step);
            return;
        };

        const { id } = JSON.parse(await dataDrain(req));

        const product: productInterface = await getProductById(id, req.user.tenant_id, debug, step);
        console.log(product);

        if(!product) {
            codeCase(res, 'PROD_009', debug, step);
            return;
        };

        const deleted = await deleteService(product.id, req.user.tenant_id, debug, step);
        console.log(deleted);        

        codeCase(res, 'PROD_010', debug, step);
        return;

    } catch (error) {
        if(debug) console.log('-!> products.controller.ts Erro <!-');
        if(error instanceof HttpError) {
            if(debug) console.log(`Failed at function | ${error.at}`);
            if(debug) console.log(`Failed at step     | ${error.step}`);
            if(error.statuscode === StatusCode.BadRequest) {
                codeCase(res, 'PROD_006', debug, step);
                return;
            };
            codeCase(res, 'MAIN_002', debug, step);
            return;
        };
    };
};

export { createProd, readProd, updateProd, deleteProd };