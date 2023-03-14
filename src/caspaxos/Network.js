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
exports.ServiceImplementation = void 0;
const { BallotNumber } = require('../gryadka-core/src/BallotNumber.js');
const p = console.error;
class ServiceImplementation {
    constructor() {
        // handler(req: Request): Promise<{response: Response}> {
        //     // if (this.ctx.random.random() <= this.stability) {
        //     //     return this.service.handler(request);
        //     // } else {
        //     //     return Promise.reject(new Error());
        //     // }
        // }
        this.ctx = null;
    }
    handle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('ServiceImplementation req=', req);
            const resp = this.syncHandlerMock(req);
            if (!!resp)
                return Promise.resolve({ response: resp });
            else
                return Promise.reject(new Error());
        });
    }
    syncHandlerMock(req) {
        p('syncHandlerMock req=', req);
        return null;
    }
}
exports.ServiceImplementation = ServiceImplementation;
