"use strict";
const { paxos } = require('paxos/Paxos.js');
const { nodemgr } = require('paxos/NodeMgr.js');
const p = console.log;
p('=================================');
const userBOSS = 'e3b0c4'; //'BOSS-USER'
const userBob = '4298fc1'; //'BOB-USER'
const userAlice = 'c149afbf4c89'; // ''ALICE-USER'
const _users = [userAlice, userBob];
const hashToNumer = (h) => parseInt(h.substr(0, 8), 16);
//p(hashToNumer(userBob), hashToNumer('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'))
//p(parseInt('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'.substr(0, 8), 16))
// operations ///////////////////////////////////
const startOperationIndex = 0;
class SeedOperation {
    constructor(amount) {
        this.index = -1;
        this.type = 'seed';
        this.amount = 0;
        this.amount = amount;
    }
}
class SendOperation {
    constructor(to, amount) {
        this.index = -1;
        this.type = 'send';
        this.amount = 0;
        this.to = '';
        this.amount = amount;
        this.to = to;
    }
}
class Account {
    constructor() {
        this.owner = '';
        this.amount = 0;
        this.pendingLog = [];
        this.comitedLog = [];
    }
}
//p(JSON.stringify(new Account()), JSON.stringify(new SendOperation(userAlice, 100)))
// сеть
// partitions ///////////////////////////////////
const partitionCount = 10; // TODO 1000
const partitionsIds = [];
for (let j = 0; j < partitionCount; j++) { // gen
    partitionsIds.push('partitionId-' + j);
}
//p(partitionsIds)
const partitionId = (u) => 'partitionId-' + hashToNumer(u) % partitionCount;
// p(partitionId(userBob), partitionId(userAlice))
class Partition {
    constructor() {
        // это и есть store данных.
        /// тут должны быть операции
        this.accounts = {};
        this.lastAccountOperation = (u) => { var _a; return (_a = this.accounts[u]) === null || _a === void 0 ? void 0 : _a.comitedLog[-1]; };
    }
}
// p((new Partition()).lastAccountOperation(userAlice))
/**
 * TODO
 * 1. sync 2 patritions
 * 2. seed to account from boss (quorum)
 * 3. send to account
 */
//   ACTORS  PAXOS  ////////////////////////////////////////
/**
 * операция seed для абонента
 * --------------------------
 * 1. клиент ищет узлы\акторы с партициями для счёта абонента
 *           ?? TODO какие-то команды
 * список узлов отправляется им с вопросом : кто лидер, они голосуют за старшего или они уже знают лидера по иной причине
 * получили лидера
 * ?? лидер синхронизирует аккаунты
 * лидеру отправляем операцию в лог (сообщая опять все узлы, которые в ней учавствуют)
 * лидер записывает ее в pending log
 * лидер рассылает операцию узлам
 * узлы подтверждают, что операция принята
 * лидер, если число подтверждений превышает процент, перемещает операцию в comitedLog
 *      и шлет "всем" узлам приказ тоже это сделать
 *
 * Операция транзакционная
 * клиент ищет узлы с партициями для СВОЕГО номера счёта
 * клиент ищет узлы с партициями для ДРУГОГО номера счёта (все участники которые требуются для транзакции)
 * узлы сортируются , выбирается самый младший - он становится лидером для этой операции
 * todo
 * */
const quorumReplicPercent = 0.7; // 70%
// class ActorNode {
//     store:  Dict<Partition> = {} // key - partitionId ; value - Account
//     constructor(partitionsIds: Array<string>){
//         setInterval(()=>{
//             // TODO sync patiotion if
//         }, 1000)
//     }
//     leaderElecttion(partituinId: string)
//     // TODO
//     // pending log
//     // commit
//     lastAccountOperation = ((part: string, u: UserPubKey) : IOperation | undefined =>
//         this.store[part]?.lastAccountOperation(u))
// }
// const actors = []
// const ACTORCOUNT = 100
// for (let i=0; i<ACTORCOUNT ; ++i){
//     const a = new ActorNode()
//     actors.push(a)
// }
paxos.go(10, 7);
p(paxos);
p(nodemgr);
