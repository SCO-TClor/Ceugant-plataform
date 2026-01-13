import { insertInterface } from "../../../@types/payload";
import * as http from 'http';
import { findProduct, createProduct } from "../../../data/databaseProducts";
import { HttpError } from "../../../utils/ThrowError";
import { StatusCode } from "../../../@types/headWriter";

async function insertService(
    data: insertInterface,
    user: http.IncomingMessage["user"],
    debug: boolean,
    step: number
) {
    if(!user?.tenant_id) {
        throw new HttpError(StatusCode.BadRequest, 'insertService()', 'Tenant not provided', step);
    };
    const exists = await findProduct(user.tenant_id, data.title, debug, step);

    console.log(exists);

    if(exists) {
        throw new HttpError(StatusCode.Conflict, 'insertService()', 'Product already inserted', step);
    };

    const insert = await createProduct(user.tenant_id, data.title, data.price, debug, step, data.image_src, data.description, data.seo);

    if(!insert) {
        console.log('deu problema inserindo produto');
    };
    console.log(insert);

    return true;
};

export { insertService };