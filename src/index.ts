import Dict = NodeJS.Dict;
import {Service, ServiceImplementation} from "./caspaxos/Network";
import {AcceptorMock} from "./caspaxos/Acceptor";
import {generateUUID, time} from "./common/helper";

const p=console.log
p('===========================================')

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
                                // pidtime?: number  // TODO need ?
                                network: Service,
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

const networkObj = new ServiceImplementation();
// return different network Service to different acceptors when network are splited
const network = (acceptor: AcceptorMock)=>networkObj as Service
//p('network=',network())

const acceptors: AcceptorMock[] = createAcceptors( ["a0", "a1", "a2"]);
//p('acceptors=', acceptors)

const p1 = createProposer({
    network: networkObj,
    pid: "pid-p1",
    // pidtime: 1,
    prepare: {nodes: acceptors, quorum: 2},
    accept: {nodes: acceptors, quorum: 2}
});
// p(p1)
p1.change('value1-key', ()=>'value1-value', {extra: true}).then(
    (a: any)=>p('success a=', a),
    (b: any)=>p('error b=', b)
)
