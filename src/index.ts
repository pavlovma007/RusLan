import Dict = NodeJS.Dict;
const {paxos} = require('paxos/Paxos')
const {nodemgr} = require('paxos/NodeMgr')
const p=console.log
p('=================================')
/*
1. счёт человека pubKey.
    * сумма
    * лимит

2. операции изменения (есть id)
    * seed(amount) получение лимита , например: +1000 руб
    * minus(amount)
    * plus(amound)
    * send(to, amount) перевод (может быть отменен = другой перевод на "заблокированный счёт")
        ??? какой ресурс получили взамен
    МЕНЯЕТ ДВЕ ЯЧЕЙКИ
    * block(id перевода) часть операций может быть отменена

3. машина состояний для транзакции перемещения данных со счёта на счёт
4. заблокированные переводы - счёт (часть переводов отменены)

* */

// users ///////////////////////////////////
type UserPubKey = string
const userBOSS = 'e3b0c4'//'BOSS-USER'
const userBob = '4298fc1' //'BOB-USER'
const userAlice = 'c149afbf4c89' // ''ALICE-USER'
const _users = [userAlice, userBob]
const hashToNumer = (h: string): number => parseInt(h.substr(0, 8), 16)
//p(hashToNumer(userBob), hashToNumer('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'))
//p(parseInt('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'.substr(0, 8), 16))



// operations ///////////////////////////////////
const startOperationIndex = 0
interface IOperation {
    index : number
    type: string
    amount: number
}
class SeedOperation implements IOperation {
    index = -1
    type = 'seed'
    amount = 0
    constructor(amount: number) {
        this.amount = amount
    }
}
class SendOperation implements IOperation {
    index = -1
    type='send'
    amount = 0
    to: UserPubKey = ''
    constructor(to: UserPubKey, amount: number) {
        this.amount = amount
        this.to = to
    }
}
class Account{ // счёт
    owner : UserPubKey = ''
    amount : number = 0
    pendingLog: Array<IOperation>  = []
    comitedLog: Array<IOperation>  = []

}
//p(JSON.stringify(new Account()), JSON.stringify(new SendOperation(userAlice, 100)))



// сеть
// partitions ///////////////////////////////////
const partitionCount = 10 // TODO 1000
const partitionsIds = []
for (let j = 0; j < partitionCount; j++) { // gen
    partitionsIds.push('partitionId-' + j)
}
//p(partitionsIds)
const  partitionId = (u: UserPubKey): string => 'partitionId-' + hashToNumer(u) % partitionCount
// p(partitionId(userBob), partitionId(userAlice))
class Partition { // TODO SAVE it and READ it
    // это и есть store данных.
    /// тут должны быть операции
    accounts: Dict<Account> = {}
    constructor() {}
    public lastAccountOperation = (u: UserPubKey) : IOperation | undefined => 
        this.accounts[u]?.comitedLog[-1]
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
const quorumReplicPercent = 0.7 // 70%


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

paxos.go(10, 7)
p(paxos)
p(nodemgr)
