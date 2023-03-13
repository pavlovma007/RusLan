import Dict = NodeJS.Dict;

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

function time(): number { return Date.parse(new Date())}
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

