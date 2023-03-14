import {Request, Response, Service} from "./Network";
import {StorageValue} from "./Storage";
const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')


export interface IAcceptor {
    prepare(aid: string, pid: string,
        service: { handle: Function; ctx?: any; handler?: any; } ,
        key: any, ballot: typeof BallotNumber, extra: any):  Promise<{response: Response}>

    accept(aid: string, pid: string,
                             service: Service, key: any,
                             ballot: any,
                             state: any,
                             promise: any,
                             extra: any): Promise<{response: Response}>

}

export class AcceptorMock  {
    aid: string
    storage: Map<string, StorageValue>
    constructor(id: string) {
        this.aid = id;
        this.storage = new Map();
    }

    // создать клиента "наверх"
    createClient(pid: string, serviceWrapper: (arg0: this) => Service): IAcceptor {
        return new AcceptorClientMock(this.aid, pid, serviceWrapper(this));
    }

    handler(request: Request) {
        let response = null;
        if (request.cmd == "prepare") {
            response = this.prepare(request.key, request.ballot);
        } else if (request.cmd == "accept") {
            response = this.accept(request.key, request.ballot, request.state, request.promise);
        } else {
            throw new Error();
        }
        return Promise.resolve({
            id: request.id,
            response: response
        });
    }

    prepare(key: string, ballot: any) {
        if (!this.storage.has(key)) {
            this.storage.set(key, {
                promise: BallotNumber.zero(),
                ballot: BallotNumber.zero(),
                value: null
            });
        }

        let info: StorageValue | undefined = this.storage.get(key);
        if(!info)
            return { isConflict: true, isKeyNotFound: true  };
        else {
            if (info.promise.compareTo(ballot) >= 0) {
                return {isConflict: true, ballot: info.promise};
            }

            if (info.ballot.compareTo(ballot) >= 0) {
                return {isConflict: true, ballot: info.ballot};
            }

            info.promise = ballot;
            return {isPrepared: true, ballot: info.ballot, value: info.value};
        }
    }

    accept(key: string, ballot: any, state: any, promise: any) {
        if (!this.storage.has(key)) {
            this.storage.set(key, {
                promise: BallotNumber.zero(),
                ballot: BallotNumber.zero(),
                value: null
            });
        }

        let info: StorageValue | undefined = this.storage.get(key);
        if(!info)
            return { isConflict: true, isKeyNotFound: true };
        else {
            if (info.promise.compareTo(ballot) > 0) {
                return {isConflict: true, ballot: info.promise};
            }

            if (info.ballot.compareTo(ballot) >= 0) {
                return {isConflict: true, ballot: info.ballot};
            }

            info.promise = promise;
            info.ballot = ballot;
            info.value = state;

            return {isOk: true};
        }
    }


    // static
    static async sendPrepare (aid: string, pid: string,
                              service: { handle: Function; ctx?: any; handler?: any; } ,
                              key: any, ballot: typeof BallotNumber, extra: any):  Promise<{response: Response}>
    {
        const outgoing = {
            id: service.ctx.uuid() as string,
            aid: aid as string ,
            pid: pid as string ,
            cmd: "prepare",
            key: key as string ,
            ballot: ballot,
            extra: extra
        };
        return (await service.handler(outgoing)).response;
    }
    // static
    static async sendAccept (aid: string, pid: string,
                             service: Service, key: any,
                             ballot: any,
                             state: any,
                             promise: any,
                             extra: any): Promise<{response: Response}> {
        const outgoing = {
            id: service.ctx.uuid(),
            aid: aid,
            pid: pid,
            cmd: "accept",
            key: key,
            ballot: ballot,
            state: state,
            promise: promise,
            extra: extra
        };
        return (await service.handler(outgoing)).response;
    }
}




// implementation
export class AcceptorClientMock implements IAcceptor{
    aid : string
    pid : string
    service : Service

    constructor(aid: string, pid: string, service: Service) {
        this.aid = aid;
        this.pid = pid;
        this.service = service;
    }

    async prepare(key: any, ballot: any, extra: any) {
        return await AcceptorMock.sendPrepare(this.aid, this.pid, this.service, key, ballot, extra);
    }

    async accept(key: any, ballot: any, state: any, promise: any, extra: any) {
        return await AcceptorMock.sendAccept(this.aid, this.pid, this.service, key, ballot, state, promise, extra);
    }
}


