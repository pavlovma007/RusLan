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
exports.AcceptorClientMock = void 0;
const p = console.error;
const { BallotNumber } = require('../gryadka-core/src/BallotNumber.js');
const Acceptor_1 = require("./Acceptor");
class AcceptorClientMock {
    constructor(aid, pid, service) {
        this.aid = aid;
        this.pid = pid;
        this.service = service;
    }
    prepare(key, ballot, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            //p('AcceptorClientMock args=', key, ballot, extra)
            return yield Acceptor_1.AcceptorMock.sendPrepare(this.aid, this.pid, this.service, key, ballot, extra);
        });
    }
    accept(aid, pid, service, key, ballot, stateValue, promise, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Acceptor_1.AcceptorMock.sendAccept(this.aid, this.pid, this.service, key, ballot, stateValue, promise, extra);
        });
    }
}
exports.AcceptorClientMock = AcceptorClientMock;
