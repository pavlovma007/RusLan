"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Dict = NodeJS.Dict;
const Network_1 = require("./caspaxos/Network");
const Acceptor_1 = require("./caspaxos/Acceptor");
const helper_1 = require("./common/helper");
const p = console.log;
p('===========================================');
const userBOSS = 'BOSS-USER';
const userBob = 'BOB-USER';
const userAlice = 'ALICE-USER';
const _users = [userAlice, userBob];
// MONEY
class MoneyDoc {
    constructor() {
        this.id = (0, helper_1.generateUUID)();
        this.from = '';
        this.to = '';
        this.howMuch = 0; // hours
        this.moment = (0, helper_1.time)();
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
const networkObj = new Network_1.ServiceImplementation();
// return different network Service to different acceptors when network are splited
const network = (acceptor) => networkObj;
//p('network=',network())
const acceptors = createAcceptors(["a0", "a1", "a2"]);
//p('acceptors=', acceptors)
const p1 = createProposer({
    network: networkObj,
    pid: "pid-p1",
    // pidtime: 1,
    prepare: { nodes: acceptors, quorum: 2 },
    accept: { nodes: acceptors, quorum: 2 }
});
// p(p1)
p1.change('value1-key', () => 'value1-value', { extra: true }).then((a) => p('success a=', a), (b) => p('error b=', b));
