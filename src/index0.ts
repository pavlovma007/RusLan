import Dict = NodeJS.Dict;
import {generateUUID, time} from "./helpers";

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

// TODO not `send` but BUY
function send(from: UserPubKey, to: UserPubKey, count: number){
    const m = new MoneyDoc()
    m.from = from; m.to = to; m.howMuch = count;
    m.sign = from
    m.prevId = ////// тут юзер не может сам написать что то ему надо сослаться на соощество
    insert(m)
}
send(userAlice, userBob, 10)

// computed
const dumpState = ()=>{

    const byUserDict: Dict<number> = {}
    let usersInDocs:Array<UserPubKey> = []
    docs.forEach((d,i,a)=>{
        if(usersInDocs.indexOf(d.to)==-1)
            usersInDocs.push(d.to)
    })
    //p(usersInDocs)

    usersInDocs.map((u)=>byUserDict[u]=0)
    //p(byUserDict)

    p(docs)
}
dumpState()


//setTimeout(()=>p('timeout') && process.exit(0), 3000)

