"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const p = console.log;
p('===========================================');
const userBOSS = 'BOSS-USER';
const userBob = 'BOB-USER';
const userAlice = 'ALICE-USER';
const _users = [userAlice, userBob];
// MONEY
class MoneyDoc {
    constructor() {
        this.id = (0, helpers_1.generateUUID)();
        this.from = '';
        this.to = '';
        this.howMuch = 0; // hours
        this.moment = (0, helpers_1.time)();
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
// TODO not `send` but BUY
function send(from, to, count) {
    const m = new MoneyDoc();
    m.from = from;
    m.to = to;
    m.howMuch = count;
    m.sign = from;
    m.prevId = ''; ////// тут юзер не может сам написать что то ему надо сослаться на соощество
    insert(m);
}
send(userAlice, userBob, 10);
// computed
const dumpState = () => {
    const byUserDict = {};
    let usersInDocs = [];
    docs.forEach((d, i, a) => {
        if (usersInDocs.indexOf(d.to) == -1)
            usersInDocs.push(d.to);
    });
    //p(usersInDocs)
    usersInDocs.map((u) => byUserDict[u] = 0);
    //p(byUserDict)
    p(docs);
};
dumpState();
//setTimeout(()=>p('timeout') && process.exit(0), 3000)
