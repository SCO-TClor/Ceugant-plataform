import { StatusCode as SC } from "../@types/headWriter";

class HttpError extends Error {
    statuscode: number;
    name: string;
    at: string;
    info: string;
    step: number;

    constructor(
        statusC: number, 
        at: string,
        info: string,
        step: number
    ) {
        super(info);

        this.statuscode = statusC;
        this.at = at;
        this.info = info;
        this.step = step;

        switch (statusC) {
            case SC.BadRequest:
                this.name = 'BadRequest';
                break;
        
            case SC.Conflict:
                this.name = 'Conflict';
                break;
        
            case SC.NotFound:
                this.name = 'NotFound';
                break;
        
            case SC.Unauthorized:
                this.name = 'Unauthorized';
                break;
        
            case SC.MethodNotAllowed:
                this.name = 'MethodNotAllowed';
                break;
        
            case SC.Forbidden:
                this.name = 'Forbidden';
                break;
        
            case SC.InternalServerError:
                this.name = 'InternalServerError';
                break;

            default:
                this.name = 'UnknowHttpError';
                break;
        };
    };
};

export { HttpError };