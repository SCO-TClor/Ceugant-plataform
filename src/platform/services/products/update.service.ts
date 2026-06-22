import { productInterface } from "../../../@types/payload";
import { updateProduct } from "../../../data/products.repository";
import { HttpError } from "../../../utils/ThrowError";
import { StatusCode } from "../../../@types/headWriter";

async function updateService(
    data: Record<string, any> | productInterface,
    tenant_id: string,
    debug: boolean,
    step: number
) {
    const allowedFields = ["title", "price", "image_src", "description", "seo", "status"] as const;

    const setClauses: string[] = [];
    const values: Array<string | number> = [];

    for (const field of allowedFields) {
        const value = data[field];
        if (value !== undefined && value !== null) {
            values.push(value);
            setClauses.push(field + " = $" + values.length);
        }
    }

    if (!data.id || setClauses.length === 0) {
        throw new HttpError(
            StatusCode.BadRequest,
            "updateService()",
            "No valid fields to update",
            step
        );
    }

    const updated = await updateProduct(data.id, tenant_id, setClauses, values, debug, step);

    if(updated && debug) {
        console.log('atualizou!!');
    }

    return updated;
    
};

export { updateService };