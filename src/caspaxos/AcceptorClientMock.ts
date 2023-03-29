import {IAcceptor} from "./IAcceptor";

const p = console.error
const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')

// implementation
import {Response, Service} from "./Network";
import {ValueType} from "./Storage";
import {AcceptorMock} from "./Acceptor";

export class AcceptorClientMock implements IAcceptor {
  aid : string
  pid : string
  service : Service

  constructor(aid: string, pid: string, service: Service) {
    this.aid = aid;
    this.pid = pid;
    this.service = service;
  }

  async prepare(key: any, ballot: any, extra: any) {
    //p('AcceptorClientMock args=', key, ballot, extra)
    return await AcceptorMock.sendPrepare(this.aid, this.pid, this.service, key, ballot, extra);
  }

  async accept(aid: string, pid: string,
               service: Service, key: string,  ballot: typeof BallotNumber, stateValue: ValueType,
               promise: typeof BallotNumber,extra: any): Promise<{response: Response}>
  {
    return await AcceptorMock.sendAccept(this.aid, this.pid, this.service, key, ballot, stateValue, promise, extra);
  }
  // async _accept(key: string, ballot: typeof BallotNumber, stateValue: ValueType, promise: typeof BallotNumber, extra: any) {
  //     return await AcceptorMock.sendAccept(this.aid, this.pid, this.service, key, ballot, stateValue, promise, extra);
  // }
}


