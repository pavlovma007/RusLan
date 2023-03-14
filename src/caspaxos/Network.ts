import {ValueType} from "./Storage";

const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')
const p = console.error

// export type Request = {
//     cmd: string;
//     key: string;
//     ballot: typeof BallotNumber;
//     state: any;
//     promise: any;
//     id: any;
// }
export type Response = {
    isPrepared: boolean,
    isConflicted: boolean
    ballot: typeof BallotNumber,
    value: string
};

export type PrepareRequest = {
    id:  string, // uuid
    aid: string ,
    pid: string ,
    cmd: string , // value=="prepare"  must
    key: string ,
    ballot: typeof BallotNumber,
    extra: any
}
export type AcceptRequest = {
    id: string , // uuid
    aid: string,
    pid: string,
    cmd: string , // value=="accept" must
    key: string,
    ballot: typeof BallotNumber,
    state: ValueType,
    promise: Promise<ValueType>,
    extra: any
}

export type Service = {
    handle: (req: PrepareRequest | AcceptRequest)=>Promise<{response: Response}>,
    ctx?: any, // TODO remove depend
    handler?: any
}



export class ServiceImplementation implements Service {
    // handler(req: Request): Promise<{response: Response}> {
    //     // if (this.ctx.random.random() <= this.stability) {
    //     //     return this.service.handler(request);
    //     // } else {
    //     //     return Promise.reject(new Error());
    //     // }
    // }

    ctx: Object | null = null;
    async handle(req: PrepareRequest | AcceptRequest): Promise<{ response: Response }> {
        console.log('ServiceImplementation req=', req)
        const resp = this.syncHandlerMock(req)
        if(!!resp)
            return Promise.resolve({response: resp});
        else
            return Promise.reject(new Error());
    }

    syncHandlerMock(req: PrepareRequest | AcceptRequest) : Response | null {
        p('syncHandlerMock req=', req)
        return null
    }
}
