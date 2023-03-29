import {AcceptRequest, PrepareRequest, Response, Service} from "./Network";
import {Storage, StorageValue, ValueType} from "./Storage";
import {generateUUID} from "../common/helper";
import {AcceptorClientMock} from "./AcceptorClientMock";
import {IAcceptor} from "./IAcceptor";

const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')
const p = console.error

// implementation
export class AcceptorMock  {
    aid: string
    storage: Storage // Map<string, StorageValue>
    constructor(id: string) {
        this.aid = id;
        this.storage = new Map();
    }

    // создать клиента "наверх"
    createClient(pid: string, serviceWrapper: (arg0: this) => Service): IAcceptor {
        return new AcceptorClientMock(this.aid, pid, serviceWrapper(this)) as IAcceptor;
    }

    handler(request: PrepareRequest | AcceptRequest) {
        let response = null;
        if (request.cmd == "prepare") {
            response = this.prepare(request.key, request.ballot);
        } else if (request.cmd == "accept") {
            response = this.accept(request.key, request.ballot, (request as AcceptRequest).state, (request as AcceptRequest).promise);
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
                              service: Service ,
                              key: any, ballot: typeof BallotNumber, extra: any):  Promise<{response: Response}>
    {
        // p('static async sendPrepare=')
        const outgoing: PrepareRequest = {
            id: generateUUID() as string,
            aid: aid as string ,
            pid: pid as string ,
            cmd: "prepare",
            key: key as string ,
            ballot: ballot,
            extra: extra
        };
        //p('static async sendPrepare', 'outgoing=', outgoing, ' service=', service)
        return (await service.handler(outgoing)).response;
    }
    // static
    static async sendAccept (aid: string, pid: string,
                             service: Service, key: any,
                             ballot: any,
                             stateValue: ValueType,
                             promiseValue: any,
                             extra: any): Promise<{response: Response}> {
        const outgoing = {
            id: generateUUID(),
            aid: aid,
            pid: pid,
            cmd: "accept",
            key: key,
            ballot: ballot,
            state: stateValue,
            promise: promiseValue,
            extra: extra
        };
        return (await service.handler(outgoing)).response;
    }
}



