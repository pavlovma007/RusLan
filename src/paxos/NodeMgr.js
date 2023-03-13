/**
 * Singleton class to manage nodes n stuff
 */

class NodeMgr {
    constructor() {
        this.nodess = new Array();
        this.quorum = 0;
        this.clientNode = {};
        this.leaderNode = null;
        this.nodeFlavors = new Array();
        this.leader = -1;
    }
    addNode = function(node, listOfFlavors) {
        this.nodess.push(node);
        for(let i = 0; i < listOfFlavors.length; i++) {
            if(!this.nodeFlavors.hasOwnProperty(listOfFlavors[i])) {
                this.nodeFlavors[listOfFlavors[i]] = new Array();
            }
            this.nodeFlavors[listOfFlavors[i]].push(node);
        }
    }

    getFlavoredNodes = function(flavor) {
        return this.nodeFlavors[flavor];
    }

    getAllNodes = function() {
        return this.nodess;
    }

    /*getAtClick = function(x, y) {
        for(let i = 0; i < this.nodess.length; i++) {
            if (this.nodess[i].containsPoint(x,y)) {
                return this.nodess[i];
            }
        }
    }
    drawNodes = function (context) {
        // draw client
        this.clientNode.draw(context);

        // draw paxos nodes
        for(let i = 0; i < this.nodess.length; i++) {
            this.nodess[i].draw(context);
        }
    }*/

    sendBroadcasts = function() {
        for(let i = 0; i < this.nodess.length; i++) {
            this.nodess[i].initiateElection();
        }
    }

    // TODO: finish this
    resetNodeState = function() {
        for(let i = 0, len = this.nodess.length; i < len; i++) {
            let nd = this.nodess[i];
            nd.acceptsReceived = [];
            nd.promisesReceived = [];
        }
    }
}

module.exports.NodeMgr = NodeMgr
module.exports.nodemgr = new NodeMgr()
