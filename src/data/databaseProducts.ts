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

async function getProducts(
    tenant_id: string,
    debug: boolean,
    step: number
) {
    debuggerDatabase('getProducts()', debug, step);

    try {
        const response = await pool.query(`SELECT * FROM ${tables.products} WHERE tenant_id = $1;`,
            [tenant_id]
        );
        
        if(response.rowCount === 0) {
            throw new Error('No rows finded!!');
        };

        return response.rows[0];

    } catch (error) {
        if(debug) console.log('Erro ao procurar produtos no database:', error);
        const info = 'getProducts()';
        const message = 'Error trying to find products into the database';
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

async function insertProduct(
    tenant_id: string,
    title: string,
    price: number,
    debug: boolean,
    step: number,
    image_src?: string | null,
    description?: string | null,
    seoT?: string | null,
) {
    debuggerDatabase('insertProduct()', debug, step);

    try {

        const img = image_src ?? null;
        const desc = description ?? null;
        const seo = seoT ?? null;

        const response = await pool.query(`
            INSERT INTO ${tables.products} (tenant_id, title, price, image_src, description, seo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`,
            [tenant_id, title, price, img, desc, seo]
        );

        return response.rows[0];

    } catch (error) {
        if(debug) console.log('Erro ao inserir produto no database:', error);
        const info = 'insertProduct()';
        const message = 'Error trying to insert product into the database';
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
        return response.rows[0];
    } catch (error) {
        if(debug) console.log('Erro ao procurar tenant user no database:', error);
        const info = 'getTenantUser()';
        const message = 'Error trying to find tenant user in the database';
        throw new HttpError(StatusCode.NotFound, info, message, step);
    };
};

export { getProducts, insertProduct, getTenant, getTenantUser, findProduct }