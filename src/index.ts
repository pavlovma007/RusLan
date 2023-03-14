import Dict = NodeJS.Dict;
import {Request, Response, Service} from "./caspaxos/Network";
import {AcceptorMock} from "./caspaxos/Acceptor";

const p=console.log
p('===========================================')
// helpers
///////////////////////////////////////////////////////////////////
export function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let  d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function time(): number { return Date.parse(''+new Date())}
//p(time())


// users
type UserPubKey = string
const userBOSS = 'BOSS-USER'
const userBob = 'BOB-USER'
const userAlice = 'ALICE-USER'
const _users = [userAlice, userBob]

// MONEY
class MoneyDoc {
    id = generateUUID()
    from: UserPubKey = ''
    to: UserPubKey = ''
    howMuch: number = 0  // hours
    moment: number= time()

    sign: UserPubKey | null = null // verified signs
    prevId: string | null = null
}

// global storage
const docs: Array<MoneyDoc>=[]
const insert = (d: MoneyDoc) =>{
    docs.push(d)
}


// init
const seed = (u: UserPubKey, amount: number) => {
    const m = new MoneyDoc()
    m.from = userBOSS; m.to = u; m.howMuch = amount
    m.sign = userBOSS
    m.prevId = null
    insert(m)
};
seed(userBob, 100)
seed(userAlice, 100)


const {Proposer, ProposerError} = require('./gryadka-core/src/Proposer.js')
const {BallotNumber} = require('./gryadka-core/src/BallotNumber.js')
// learn BallotNumber
const bn = new BallotNumber(1,100)
//p(bn, bn.isZero(), bn.inc(), bn.next(), bn)
// out:
// BallotNumber { counter: 2, id: 100 } false BallotNumber { counter: 2, id: 100 } BallotNumber { counter: 3, id: 100 } BallotNumber { counter: 2, id: 100 }
// lear Proposer









function createAcceptors(ids: Array<string>): AcceptorMock[] {
    return ids.map(aid => new AcceptorMock( aid));
}

function createProposer({pid, network: Service, prepare, accept}:
                            {
                                pid: string,
                                pidtime?: number  // TODO need ?
                                network: Object,
                                prepare: { nodes: AcceptorMock[], quorum: number },
                                accept:  { nodes: AcceptorMock[], quorum: number }
                            }): typeof Proposer
{
    const ballot = new BallotNumber(0, pid);

    let prepare2 = {
        nodes: prepare.nodes.map(
            (x: AcceptorMock) => x.createClient(pid, network)),
        quorum: prepare.quorum
    };
    let accept2 = {
        nodes: accept.nodes.map((x: AcceptorMock) => x.createClient(pid, network)),
        quorum: accept.quorum
    };

    const proposer = new Proposer(ballot, prepare2, accept2);

    return proposer;
}

const ctx = {
    timer : null , // new Timer(max_time_delay),
    random : null , // new Random(seedrandom(seed)),
    id : 0
}

class ServiceImplementation implements Service {
    // handler(req: Request): Promise<{response: Response}> {
    //     // if (this.ctx.random.random() <= this.stability) {
    //     //     return this.service.handler(request);
    //     // } else {
    //     //     return Promise.reject(new Error());
    //     // }
    // }

    ctx: any;
    handle(req: Request): Promise<{ response: Response }> {
        // return Promise.resolve({response: undefined});
        return Promise.reject(new Error());
    }
}
const networkObj = new ServiceImplementation();
// return different network Service to different acceptors when network are splited
const network = (acceptor: AcceptorMock)=>networkObj as Service

const acceptors: AcceptorMock[] = createAcceptors( ["a0", "a1", "a2"]);

const p1 = createProposer({
    network: network,
    pid: "p1",
    pidtime: 1,
    prepare: {nodes: acceptors, quorum: 2},
    accept: {nodes: acceptors, quorum: 2}
});

