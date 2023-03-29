//import Dict = NodeJS.Dict;
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var p = console.error;
var BallotNumber = require('./gryadka-core/src/BallotNumber.js').BallotNumber;
p('===========================================');
var updateFunctionById = (function (paramObj) {
    if (paramObj.updateFunctionId == 'set-0')
        return function (curr) { return 0; };
    if (paramObj.updateFunctionId == 'set-1000')
        return function (curr) { return 1000; };
    if (paramObj.updateFunctionId == 'update-cas-version')
        return function (curr) { return paramObj.nextValue.version == (curr.version + 1) ?
            paramObj.nextValue
            : curr; };
    return function (curr) { return curr; };
});
/////////////////////////////////////////////////////////////////////////////////////// DATA | Network
var REQUESTS = [];
var RESPONSES = [];
var ACCEPTORS = ['a1', 'a2', 'a3'];
// function networkRequest(req: PrepareRequest){
//   REQUESTS.push(req)
// }
////////////////////////////////////////////////////////////////////////////////////   CLASSES
var Actor = /** @class */ (function () {
    function Actor() {
    }
    return Actor;
}());
var Acceptor = /** @class */ (function (_super) {
    __extends(Acceptor, _super);
    function Acceptor(aid) {
        var _this = _super.call(this) || this;
        _this.store = {}; // key->value
        _this.prepared = {}; // key->value ??????
        _this.intervalH = setInterval(_this.runStep, 5000, _this);
        _this.aid = aid;
        return _this;
    }
    Acceptor.prototype.runStep = function (self) {
        // p('Acceptor', self.aid, 'runStep')
        var requestsForMe = REQUESTS.filter(function (req) { return req.aid == self.aid; });
        p('Acceptor', self.aid, 'requestsForMe', requestsForMe);
        requestsForMe.map(function (req) {
            self.handlePrepareReq(req);
            // del from list - handled
            var index = REQUESTS.indexOf(req);
            index >= 0 && REQUESTS.splice(index, 1);
        });
    };
    Acceptor.prototype.handlePrepareReq = function (req) {
        // p('this=', this)
        if (req.type !== 'prepare')
            return;
        if (req.key in this.prepared) {
            var preparedBallot = this.prepared[req.key];
            RESPONSES.push({ key: req.key, to: req.from, aid: this.aid,
                error: 'already prepared', ballot: preparedBallot, value: null
            });
        }
        else {
            var currVal = this.store[req.key];
            var updateF = updateFunctionById({ updateFunctionId: req.updateFunctionId, nextValue: req.nextValue });
            this.prepared[req.key] = req.ballot;
            var nextVal = updateF(currVal);
            RESPONSES.push({ key: req.key, to: req.from, aid: this.aid,
                value: nextVal,
                ballot: req.ballot
            });
        }
    };
    return Acceptor;
}(Actor));
new Acceptor('a1');
// is a actor
var Proposer = /** @class */ (function (_super) {
    __extends(Proposer, _super);
    function Proposer() {
        var _this = _super.call(this) || this;
        _this.aid = 'p1'; // TODO proposer are self also acceptor
        _this.locks = new Set();
        _this.ballot = new BallotNumber(321, '100500');
        _this.quorum = 3; // TODO configure
        // persist
        _this.iWaiting = {};
        setInterval(_this.runStep, 5000, _this);
        return _this;
    }
    Proposer.prototype.runStep = function (self) {
        var prepareResponsesForMe = RESPONSES.filter(function (resp) { return resp.to == self.aid; });
        p('Proposer id=', self.aid, 'prepareResponsesForMe=', prepareResponsesForMe);
        prepareResponsesForMe.map(function (resp) {
            self.handlePrepareResponse(resp);
            // del from list - handled
            var index = RESPONSES.indexOf(resp);
            index >= 0 && RESPONSES.splice(index, 1);
        });
    };
    Proposer.prototype.handlePrepareResponse = function (resp) {
    };
    Proposer.prototype.tryLock = function (key) {
        if (this.locks.has(key)) {
            return false;
        }
        this.locks.add(key);
        return true;
    };
    Proposer.prototype.unlock = function (key) {
        this.locks["delete"](key);
    };
    Proposer.prototype.prepare = function (key, functionId, nextValue, responseReciever) {
        var _this = this;
        ACCEPTORS.map(function (aid) {
            // p('aid=', aid)
            // networkRequest()
            REQUESTS.push({ from: _this.aid, type: 'prepare', ballot: _this.ballot.inc(), aid: aid, key: key, nextValue: nextValue, updateFunctionId: functionId });
        });
    };
    // main interface
    Proposer.prototype.change = function (key, updateFunctionId, nextValue /*, extra*/) {
        if (!this.tryLock(key)) {
            throw Error('ProposerError.ConcurrentRequestError'); //ProposerError.ConcurrentRequestError();
        }
        try {
            /*await*/
            this.prepare(key, updateFunctionId, nextValue, function (resp) {
            });
        }
        finally {
            this.unlock(key);
        }
    };
    return Proposer;
}(Actor));
////////////////////////////////////////////////////////////////////////////////////   USAGE
(function test() {
    var p1 = new Proposer();
    p1.change('cell-1-key', 'set-1000', null);
})();
