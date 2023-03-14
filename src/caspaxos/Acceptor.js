"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptorClientMock = exports.AcceptorMock = void 0;
const helper_1 = require("../common/helper");
const { BallotNumber } = require('../gryadka-core/src/BallotNumber.js');
const p = console.error;
class AcceptorMock {
    constructor(id) {
        this.aid = id;
        this.storage = new Map();
    }
    // создать клиента "наверх"
    createClient(pid, serviceWrapper) {
        return new AcceptorClientMock(this.aid, pid, serviceWrapper(this));
    }
    handler(request) {
        let response = null;
        if (request.cmd == "prepare") {
            response = this.prepare(request.key, request.ballot);
        }
        else if (request.cmd == "accept") {
            response = this.accept(request.key, request.ballot, request.state, request.promise);
        }
        else {
            throw new Error();
        }
        return Promise.resolve({
            id: request.id,
            response: response
        });
    }
    prepare(key, ballot) {
        if (!this.storage.has(key)) {
            this.storage.set(key, {
                promise: BallotNumber.zero(),
                ballot: BallotNumber.zero(),
                value: null
            });
        }
        let info = this.storage.get(key);
        if (!info)
            return { isConflict: true, isKeyNotFound: true };
        else {
            if (info.promise.compareTo(ballot) >= 0) {
                return { isConflict: true, ballot: info.promise };
            }
            if (info.ballot.compareTo(ballot) >= 0) {
                return { isConflict: true, ballot: info.ballot };
            }
            info.promise = ballot;
            return { isPrepared: true, ballot: info.ballot, value: info.value };
        }
    }
    accept(key, ballot, state, promise) {
        if (!this.storage.has(key)) {
            this.storage.set(key, {
                promise: BallotNumber.zero(),
                ballot: BallotNumber.zero(),
                value: null
            });
        }
        let info = this.storage.get(key);
        if (!info)
            return { isConflict: true, isKeyNotFound: true };
        else {
            if (info.promise.compareTo(ballot) > 0) {
                return { isConflict: true, ballot: info.promise };
            }
            if (info.ballot.compareTo(ballot) >= 0) {
                return { isConflict: true, ballot: info.ballot };
            }
            info.promise = promise;
            info.ballot = ballot;
            info.value = state;
            return { isOk: true };
        }
    }
    // static
    static sendPrepare(aid, pid, service, key, ballot, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            // p('static async sendPrepare=')
            const outgoing = {
                id: (0, helper_1.generateUUID)(),
                aid: aid,
                pid: pid,
                cmd: "prepare",
                key: key,
                ballot: ballot,
                extra: extra
            };
            //p('static async sendPrepare', 'outgoing=', outgoing, ' service=', service)
            return (yield service.handler(outgoing)).response;
        });
    }
    // static
    static sendAccept(aid, pid, service, key, ballot, stateValue, promiseValue, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            const outgoing = {
                id: (0, helper_1.generateUUID)(),
                aid: aid,
                pid: pid,
                cmd: "accept",
                key: key,
                ballot: ballot,
                state: stateValue,
                promise: promiseValue,
                extra: extra
            };
            return (yield service.handler(outgoing)).response;
        });
    }
}
exports.AcceptorMock = AcceptorMock;
// implementation
class AcceptorClientMock {
    constructor(aid, pid, service) {
        this.aid = aid;
        this.pid = pid;
        this.service = service;
    }
    prepare(key, ballot, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            //p('AcceptorClientMock args=', key, ballot, extra)
            return yield AcceptorMock.sendPrepare(this.aid, this.pid, this.service, key, ballot, extra);
        });
    }
    accept(aid, pid, service, key, ballot, stateValue, promise, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AcceptorMock.sendAccept(this.aid, this.pid, this.service, key, ballot, stateValue, promise, extra);
        });
    }
}
exports.AcceptorClientMock = AcceptorClientMock;
