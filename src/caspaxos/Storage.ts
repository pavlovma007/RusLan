const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')

export type ValueType = string | null

export type StorageValue = {
    promise: typeof  BallotNumber, // { compareTo: Function }
    ballot: typeof BallotNumber,
    value: ValueType
}


export type Storage = Map<string , StorageValue>
