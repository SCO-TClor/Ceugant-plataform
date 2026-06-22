import { deleteProduct } from "../../../data/products.repository"

async function deleteService(
    product_id: number,
    tenant_id: string,
    debug: boolean,
    step: number
) {
    const response = await deleteProduct(product_id, tenant_id, debug, step);
    console.log('response:');
    console.log(response);
    
    return response;
};

export { deleteService }