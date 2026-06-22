import pool from "./database/databaseConfig";
import { usersDatabase } from "../@types/httpInterface";
import { HttpError } from "../utils/ThrowError";
import { StatusCode } from "../@types/headWriter";
import { JwtPayload } from "jsonwebtoken";
import { tables, tenants } from "./database/databaseEnum";

function debuggerDatabase(
    funcao: string,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-----> databaseProducts.ts <-----<');
    if(debug) console.log(`Step     | ${step}`);
    if(debug) console.log(`Function | ${funcao}`);
    step++;
};

async function getProductById(
    product_id: number,
    tenant_id: string,
    debug: boolean,
    step: number
) {
    debuggerDatabase('getProductById()', debug, step);

    try {
        const response = await pool.query(`
            SELECT * FROM ${tables.products}
            WHERE id = $1 
              AND tenant_id = $2;`,
            [product_id, tenant_id]
        );
        
        return response.rows[0];

    } catch (error) {
        if(debug) console.log('Erro ao procurar produto específico no database:', error);
        const info = 'getProductById()';
        const message = 'Error trying to find product by id in the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

async function findProduct(
    tenant_id: string,
    title: string,
    debug: boolean,
    step: number
) {
    debuggerDatabase('findProduct()', debug, step);

    try {
        console.log(tenant_id, title);
        
        const response = await pool.query(`
            SELECT id FROM ${tables.products}
            WHERE tenant_id = $1
              AND title = $2;`,
            [tenant_id, title]
        );

        if(response.rowCount === 0) {
            return null;
        };

        console.log(response.rows[0]);

        return response.rows[0];
        
    } catch (error) {
        if(debug) console.log('Erro ao procurar produto no database:', error);
        const info = 'findProduct()';
        const message = 'Error trying to find product in the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

async function getTenant(
    userId: string | undefined,
    debug: boolean,
    step: number
) {
    debuggerDatabase('getTenant', debug, step);

    try {
        if(!userId) {
            throw Error('userId doesn\'t exist!');
        };
        
        const response = await pool.query(`
            SELECT * FROM ${tables.tenants}
            WHERE owner_id = $1;
            `,
            [userId]
        );

        if(response.rowCount === 0) {
            throw new Error('No rows finded!!');
        };

        return response.rows[0];
        
    } catch (error) {
        if(debug) console.log('Erro ao procurar tenant no database:', error);
        const info = 'getTenant()';
        const message = 'Error trying to find tenant in the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

async function getTenantUser(
    userId: string | undefined,
    debug: boolean,
    step: number
) {
    debuggerDatabase('getTenantUser()', debug, step);

    try {
        if(!userId) {
            console.log('userId não existe!!! --------------');
            throw Error('userId doesn\'t exist!');
        };

        const response = await pool.query(`
            SELECT * FROM ${tables.tenant_users}
            WHERE user_id = $1;`,
        [userId]
        );

        console.log('Buscou tenant no database');
        

        if(!response.rows[0]) {
            throw new Error();
        };

        return response.rows[0];
    } catch (error) {
        if(debug) console.log('Erro ao procurar tenant user no database:', error);
        const info = 'getTenantUser()';
        const message = 'Error trying to find tenant user in the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

export { getTenant, getTenantUser, findProduct, getProductById };

// Validation:

async function getProductNames(
    product_id: number,
    tenant_id: string,
    title: string,
    debug: boolean,
    step: number
) {
    debuggerDatabase('getProductNames()', debug, step);

    try {
        const response = await pool.query(`
            SELECT id, title 
            FROM ${tables.products}
            WHERE id = $1
            AND tenant_id = $2
            AND title = $3;
            `,
            [product_id, tenant_id, title]
        );

        return response.rows[0];

    } catch (error) {
        if(debug) console.log('Erro ao procurar produto no database:', error);
        const info = 'getProductNames()';
        const message = 'Error trying to find product in the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

export {};

async function createProduct(
    tenant_id: string,
    title: string,
    price: number,
    debug: boolean,
    step: number,
    image_src?: string | null,
    description?: string | null,
    seoT?: string | null,
    statusT?: string | null
) {
    debuggerDatabase('createProduct()', debug, step);

    try {

        const img = image_src ?? null;
        const desc = description ?? null;
        const seo = seoT ?? null;
        const status = statusT ?? 'active';

        const response = await pool.query(`
            INSERT INTO ${tables.products} (tenant_id, title, price, image_src, description, seo, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`,
            [tenant_id, title, price, img, desc, seo, status]
        );

        return response.rows[0];

    } catch (error) {
        if(debug) console.log('Erro ao inserir produto no database:', error);
        const info = 'insertProduct()';
        const message = 'Error trying to insert product into the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

async function readProducts(
    tenant_id: string,
    debug: boolean,
    step: number
) {
    debuggerDatabase('getProducts()', debug, step);

    try {
        const response = await pool.query(`
            SELECT * FROM ${tables.products} 
            WHERE tenant_id = $1;`,
            [tenant_id]
        );

        return response.rows;

    } catch (error) {
        if(debug) console.log('Erro ao procurar produtos no database:', error);
        const info = 'getProducts()';
        const message = 'Error trying to find products in the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

async function updateProduct(
    product_id: number,
    tenant_id: string,
    setClauses: string[],
    values: Array<string | number>,
    debug: boolean,
    step: number
) {
    debuggerDatabase('updateDatabase()', debug, step);

    try {
        if(setClauses.length === 0) {
            throw new HttpError(
                StatusCode.BadRequest,
                'updateProduct()',
                'No fields provided for update',
                step
            );
        };

        const setSql = setClauses.join(', ');
        const idParam = `$${values.length + 1}`;
        const tenantParam = `$${values.length + 2}`;

        const sql = `
            UPDATE ${tables.products}
            SET ${setSql}
            WHERE id = ${idParam}
            AND tenant_id = ${tenantParam}
            RETURNING *;`;

        const response = await pool.query(sql, [...values, product_id, tenant_id]);

        console.log('produto do banco de dados:');

        return response.rows[0];
    } catch (error) {
        if(debug) console.log('Erro ao atualizar produto no database:', error);

        if(error instanceof HttpError) {
            throw error;
        };

        const info = 'updateProduct()';
        const message = 'Error trying to update product into the database';
        throw new HttpError(StatusCode.BadRequest, info, message, step);
    };
};

async function deleteProduct(
    product_id: number,
    tenant_id: string,
    debug: boolean,
    step: number
) {
    debuggerDatabase('deleteProduct()', debug, step);

    try {
        const response = await pool.query(`
            DELETE FROM ${tables.products}
            WHERE id = $1 
            AND tenant_id = $2`,
            [product_id, tenant_id]
        );

        console.log(response);
        console.log(response.rows);
        

        return response;
        
    } catch (error) {
        
    };
};

export { createProduct, readProducts, updateProduct, deleteProduct };