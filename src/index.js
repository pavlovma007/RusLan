"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = void 0;
const Acceptor_1 = require("./caspaxos/Acceptor");
const p = console.log;
p('===========================================');
// helpers
///////////////////////////////////////////////////////////////////
function generateUUID() {
    let d = new Date().getTime(); //Timestamp
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) { //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        }
        else { //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
exports.generateUUID = generateUUID;
function time() { return Date.parse('' + new Date()); }
const userBOSS = 'BOSS-USER';
const userBob = 'BOB-USER';
const userAlice = 'ALICE-USER';
const _users = [userAlice, userBob];
// MONEY
class MoneyDoc {
    constructor() {
        this.id = generateUUID();
        this.from = '';
        this.to = '';
        this.howMuch = 0; // hours
        this.moment = time();
        this.sign = null; // verified signs
        this.prevId = null;
    }
}
// global storage
const docs = [];
const insert = (d) => {
    docs.push(d);
};
// init
const seed = (u, amount) => {
    const m = new MoneyDoc();
    m.from = userBOSS;
    m.to = u;
    m.howMuch = amount;
    m.sign = userBOSS;
    m.prevId = null;
    insert(m);
};
seed(userBob, 100);
seed(userAlice, 100);
const { Proposer, ProposerError } = require('./gryadka-core/src/Proposer.js');
const { BallotNumber } = require('./gryadka-core/src/BallotNumber.js');
// learn BallotNumber
const bn = new BallotNumber(1, 100);
//p(bn, bn.isZero(), bn.inc(), bn.next(), bn)
// out:
// BallotNumber { counter: 2, id: 100 } false BallotNumber { counter: 2, id: 100 } BallotNumber { counter: 3, id: 100 } BallotNumber { counter: 2, id: 100 }
// lear Proposer
function createAcceptors(ids) {
    return ids.map(aid => new Acceptor_1.AcceptorMock(aid));
}
function createProposer({ pid, network: Service, prepare, accept }) {
    const ballot = new BallotNumber(0, pid);
    let prepare2 = {
        nodes: prepare.nodes.map((x) => x.createClient(pid, network)),
        quorum: prepare.quorum
    };
    let accept2 = {
        nodes: accept.nodes.map((x) => x.createClient(pid, network)),
        quorum: accept.quorum
    };
    const proposer = new Proposer(ballot, prepare2, accept2);
    return proposer;
}
const ctx = {
    timer: null,
    random: null,
    id: 0
};
class ServiceImplementation {
    handle(req) {
        // return Promise.resolve({response: undefined});
        return Promise.reject(new Error());
    }
}
const networkObj = new ServiceImplementation();
// return different network Service to different acceptors when network are splited
const network = (acceptor) => networkObj;
const acceptors = createAcceptors(["a0", "a1", "a2"]);
const p1 = createProposer({
    network: network,
    pid: "p1",
    pidtime: 1,
    prepare: { nodes: acceptors, quorum: 2 },
    accept: { nodes: acceptors, quorum: 2 }
});
