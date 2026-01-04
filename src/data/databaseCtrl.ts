import pool, { table } from "./database/databaseConfig";
import * as bcrypt from 'bcrypt';
import { usersDatabase } from "../utils/DBInterface";

async function getUsers(
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-------> databaseCtrl.ts <-------<');
    if(debug) console.log(`Step     | ${step}`);
    if(debug) console.log(`Function | getUsers()`);
    
    try {
        const response = await pool.query('SELECT * FROM plataform.users;');
        console.log(response.rows);
        return response.rows;

    } catch (error) {
        console.log('Erro ao buscar users no database:', error);
        throw error;
    };
};

export async function getProfile(
    email: string,
    debug: boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-------> databaseCtrl.ts <-------<');
    if(debug) console.log(`Step     | ${step}`);
    if(debug) console.log(`Function | getProfile()`);
    step++;
    try {
        const response = await pool.query<usersDatabase>
        (
            `SELECT * FROM ${table.users} WHERE email = $1`,
            [email]
        );
        return response.rows[0];
    } catch (error) {
        console.log('Erro ao buscar users no database:', error);
        throw error;
    }
};

async function findUser(
    email: string,
    debug: boolean,
    step: number,
) {
    if(debug) console.log('');
    if(debug) console.log('>-------> databaseCtrl.ts <-------<');
    if(debug) console.log(`Step     | ${step}`);
    if(debug) console.log(`Function | findUser()`);
    step++;

    try {
        const response = await pool.query<usersDatabase>
        (
            `SELECT * FROM ${table.users} WHERE email = $1;`,
            [email]
        );
        if(response.rowCount == 1) {
            const exist = true;
            if(debug) console.log(`Email    | ${exist}`);
            return exist;
        }
        else {
            const exist = false
            if(debug) console.log(`Email    | ${exist}`);
            return exist;
        };
    } catch (error) {
        if(debug) console.log('!>---!> dataBaseCrl / Error <!---<!');
        if(debug) console.log(`Failed at:`);
        if(debug) console.log(`Function  | findUser()`);
        if(debug) console.log(`Step      | ${step}`);
        throw new Error(`error     | ${error}`);
    };
};

async function insertUser(
    name    : string, 
    email   : string, 
    password: string,
    debug   : boolean,
    step: number
) {
    if(debug) console.log('');
    if(debug) console.log('>-------> databaseCtrl.ts <-------<');
    if(debug) console.log(`Step     | ${step}`);
    if(debug) console.log(`Function | insertUser()`);
    step++;

    try {
        const status = 'active';
        const hash = await bcrypt.hash(password, 10);

        const insert = await pool.query<usersDatabase>
        (
            `INSERT INTO plataform.users (name, email, password_hash, status) VALUES ($1, $2, $3, $4);`,
            [name, email, hash, status]
        );


        const response = await pool.query<usersDatabase>
        (
            `SELECT * FROM plataform.users WHERE email = $1;`,
            [email]
        );
        console.log(insert.rows);
        console.log(response.rows);

    } catch (error) {
        console.log('Erro ao inserir usuário no database:', error);
        throw error;
    };
};

export { getUsers, insertUser, findUser };