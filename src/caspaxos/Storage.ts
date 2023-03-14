const {BallotNumber} = require('../gryadka-core/src/BallotNumber.js')

export type StorageValue = {
    promise: { compareTo: Function },
    ballot: typeof BallotNumber,
    value: any
}


