import * as http from 'http';

function debuggerController(        // Manual debugger!
    funcao: string,
    req: http.IncomingMessage,
    debug: boolean,
    step: number,
    routes?: Array<string>
) {
    if(debug) console.log(`Função | ${funcao}`);
    if(debug) console.log(`Step   | ${step}`);
    if(debug && routes) console.log(`Route  | "${routes}"`);
    if(debug) console.log(`Method | "${req.method}"`);
    step++;
};

export { debuggerController };