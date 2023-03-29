const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')
const p = console.error

import {Response, Service} from "./Network";
import {ValueType} from "./Storage";

export interface IAcceptor {
  prepare(aid: string, pid: string,
          service: Service ,key: string, ballot: typeof BallotNumber, extra: any):  Promise<{response: Response}>

  accept(aid: string, pid: string,
         service: Service, key: string,  ballot: typeof BallotNumber, stateValue: ValueType,
         promise: typeof BallotNumber,extra: any): Promise<{response: Response}>

}
