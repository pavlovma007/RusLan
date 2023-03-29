//import Dict = NodeJS.Dict;

const p = console.error
const {BallotNumber} = require('./gryadka-core/src/BallotNumber.js')

p('===========================================')

// ALLOWED update functions (known on acceptors and propasals)
type UpdateFunctionID = 'set-0' | 'set-1000' | 'update-cas-version'
type UpdateFunctionParam = ({ updateFunctionId: UpdateFunctionID, nextValue?: any })
type UpdateFunctionType = (paramObj: UpdateFunctionParam) => Function
const  updateFunctionById: UpdateFunctionType = (paramObj => {
  if(paramObj.updateFunctionId == 'set-0')
    return (curr: any)=> 0;
  if(paramObj.updateFunctionId == 'set-1000')
    return (curr: any)=> 1000;
  if(paramObj.updateFunctionId == 'update-cas-version')
    return (curr: {value:any , version: number}) => paramObj.nextValue.version == (curr.version + 1) ?
                                                                            paramObj.nextValue
                                                                          : curr
  return (curr:any)=>curr
})
// {
//   const testUpdateTo = updateFunctionById({
//     updateFunctionId: 'update-cas-version',
//     nextValue:{value: 123, version:1  }
//   })
//   p(testUpdateTo({value: 1, version: 0}))
// }



///////////////////////////////////////////////////////////////////////////////////// TYPES
// from Proposer to Acceptor
type PrepareRequest = {
  type: string // = 'prepare'
  from: string // node id
  aid: string
  key: string,
  updateFunctionId: UpdateFunctionID
  nextValue: any
  ballot: typeof BallotNumber
}
type AcceptorPrepareResponse = {
  aid: string
  to: string // node id
  key: string
  error?: string
  value: any
  // asign: string  // todo
  ballot: typeof BallotNumber
}


/////////////////////////////////////////////////////////////////////////////////////// DATA | Network
const REQUESTS : Array<PrepareRequest> = []
const RESPONSES : Array<AcceptorPrepareResponse> = []
const ACCEPTORS = ['a1', 'a2', 'a3']
// function networkRequest(req: PrepareRequest){
//   REQUESTS.push(req)
// }
////////////////////////////////////////////////////////////////////////////////////   CLASSES

class Actor {}

class Acceptor extends Actor{
  private intervalH: number // NodeJS.Timeout
  private aid
  private store: NodeJS.Dict<any> = {} // key->value
  private prepared: NodeJS.Dict<typeof BallotNumber> = {} // key->value ??????

  constructor(aid: string){
    super()
    this.intervalH = setInterval(this.runStep, 5000, this)
    this.aid = aid
  }
  runStep(self: Acceptor): void { // not self called from setInterval
    // p('Acceptor', self.aid, 'runStep')
    const requestsForMe = REQUESTS.filter(req=>req.aid==self.aid)
    p('Acceptor', self.aid, 'requestsForMe', requestsForMe)
    requestsForMe.map(req=>{
      self.handlePrepareReq(req)
      // del from list - handled
      const index = REQUESTS.indexOf(req);
      index >= 0   &&  REQUESTS.splice(index, 1);
    })
  }
  handlePrepareReq(req: PrepareRequest){
    // p('this=', this)
    if(req.type!=='prepare')
      return
    if(req.key in this.prepared) {
      const preparedBallot = this.prepared[req.key]
      RESPONSES.push({key: req.key, to: req.from, aid: this.aid,
        error: 'already prepared', ballot:preparedBallot, value: null
      })
    }else{
      const currVal = this.store[req.key]
      const updateF = updateFunctionById({updateFunctionId: req.updateFunctionId, nextValue: req.nextValue})
      this.prepared[req.key] = req.ballot
      const nextVal = updateF(currVal)

      RESPONSES.push({key: req.key, to: req.from, aid: this.aid,
        value: nextVal,
        ballot:req.ballot
      })
    }


  }
}
new Acceptor('a1')

// is a actor
class Proposer extends Actor {
  aid: string = 'p1' // TODO proposer are self also acceptor
  locks = new Set<string /*key*/>();
  ballot = new BallotNumber(321,'100500')
  quorum: number = 3 // TODO configure

  // persist
  private iWaiting :NodeJS.Dict<typeof BallotNumber> = {}

  constructor(){
    super()
    setInterval(this.runStep,5000, this)
  }
  runStep(self: Proposer){
    const prepareResponsesForMe = RESPONSES.filter(resp=>resp.to==self.aid)
    p('Proposer id=', self.aid, 'prepareResponsesForMe=', prepareResponsesForMe)
    prepareResponsesForMe.map(resp=>{
      self.handlePrepareResponse(resp)
      // del from list - handled
      const index = RESPONSES.indexOf(resp);
      index >= 0   &&  RESPONSES.splice(index, 1);
    })
  }
  handlePrepareResponse(resp: AcceptorPrepareResponse){

  }
  tryLock(key: string) {
    if (this.locks.has(key)) {
      return false;
    }
    this.locks.add(key);
    return true;
  }
  unlock(key: string) {
    this.locks.delete(key);
  }
  prepare(key: string, functionId: UpdateFunctionID, nextValue: any, responseReciever: ((resp: AcceptorPrepareResponse)=>void)): void {
    ACCEPTORS.map(aid=>{
      // p('aid=', aid)
      // networkRequest()
      REQUESTS.push({from: this.aid, type: 'prepare', ballot: this.ballot.inc(),
        aid, key, nextValue, updateFunctionId: functionId
      })
    })
  }
  // main interface
  public change(key: string, updateFunctionId: UpdateFunctionID, nextValue: any/*, extra*/){
    if (!this.tryLock(key)) {
      throw Error('ProposerError.ConcurrentRequestError') //ProposerError.ConcurrentRequestError();
    }
    try {
      /*await*/
      this.prepare(key, updateFunctionId, nextValue, (resp: AcceptorPrepareResponse) => {

      })
    } finally {
      this.unlock(key);
    }
  }
}



////////////////////////////////////////////////////////////////////////////////////   USAGE

(function test(){
  const p1 = new Proposer()
  p1.change('cell-1-key', 'set-1000', null)
})()
