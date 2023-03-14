const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')
export type Request = {
    cmd: string;
    key: string;
    ballot: typeof BallotNumber;
    state: any;
    promise: any;
    id: any;
}
export type Response = {
    isPrepared: boolean,
    isConflicted: boolean
    ballot: typeof BallotNumber,
    value: string
};


export type Service = {
    handle: (req: Request)=>Promise<{response: Response}>,
    ctx?: any, // TODO remove depend
    handler?: any
}
