import { productInterface } from "../../../@types/payload";
import { readProducts, updateProduct } from "../../../data/databaseProducts";

async function updateService(
    data: Record<string, any> | productInterface,
    tenant_id: string,
    debug: boolean,
    step: number
) {
    let queryCommand = '';

    if(data.title) {
        queryCommand = queryCommand.concat(`title = '${data.title}', `);
    };
    if(data.price) {
        queryCommand = queryCommand.concat(`price = ${data.price}, `);
    };
    if(data.image_src) {
        queryCommand = queryCommand.concat(`image_src = '${data.image_src}', `);
    };
    if(data.description) {
        queryCommand = queryCommand.concat(`description = '${data.description}', `);
    };
    if(data.seo) {
        queryCommand = queryCommand.concat(`seo = '${data.seo}', `);
    };

    const comma = queryCommand.slice(0, -2);

    console.log('queryCommand start');
    console.log(comma);
    console.log('queryCommand end');

    const updated = await updateProduct(data.id, tenant_id, comma, debug, step);

    if(updated) {
        console.log('atualizou!!')
    };

    return updated;
    
};

export { updateService };