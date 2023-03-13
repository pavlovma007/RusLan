// import {Node} from "./Node";
const {Node} = require('./Node')
const {nodemgr} = require('NodeMgr')

const log = console.error

/**
 * Singleton class which drives the algorithm-
 */

class Paxos {
    /**
     * Actually start
     */
    go = function(numnodes, quorum/*, updateval*/) {
        this.paused = true;

        this.numnodes = numnodes
        this.quorum = quorum
        //this.ui = {};
        //this.ui.numnodes = {};
        // this.ui.numnodes.input = document.getElementById('numnodes');
        // this.ui.numnodes.submit = document.getElementById('numnodes_update');
        // this.ui.numnodes.submit.onclick = this.reboot;

        //this.ui.updateval = {};
        //this.ui.updateval.input = document.getElementById('update_text');
        //this.ui.updateval.submit = document.getElementById('submit_update');
        //this.ui.updateval.submit.onclick = function(_) { this.submitUpdate(/*this.ui.updateval.input.value*/ updateval); };

        // this.ui.quorumval = {};
        // this.ui.quorumval = document.getElementById('quorum_text');

        // this.ui.pause = document.getElementById('pause');
        // this.ui.pause.onclick = this.pause;

        //let rows = 3;
        //let npr = Math.ceil(/*this.ui.numnodes.input.value*/ numnodes / rows);

        // Place the client node in the first column, middle row
        new Node(/*constants.canvasMargin, constants.canvasMargin + 180 * Math.floor(1 / npr), */
            null, null, ["client"]);

        // Place the rest of the nodes in the rest of the columns
        for (let i = 0, len = /*this.ui.numnodes.input.value*/ numnodes; i < len; i++) {
            // let x = constants.canvasMargin + Math.floor((CanvasMgr.getInstance().canvas.width - 2*constants.canvasMargin) / npr) * ((i % npr) + 1);
            // let y  = constants.canvasMargin + 180 * Math.floor(i / npr);
            new Node(/*x, y, */null, null, ["proposer","acceptor","learner"]);
        }

        nodemgr.quorum = quorum // this.ui.quorumval.value;

        //let n1 = nodemgr.nodess[0];
        //n1.setLeader();

        nodemgr.sendBroadcasts();

        //this.submitUpdate('e0ad33b7');

        // this.timeoutInterval = window.setInterval(this.animateLoop, 6);
    }
    // submitUpdate = function(value) {
    //     nodemgr.resetNodeState();
    //     let leader = nodemgr.leaderNode;
    //     let cli = nodemgr.clientNode;
    //     log('Sending SYSREQUEST to Node #' + leader.id + ' with data ' + value, 1);
    //     cli.sendMessage(leader, Message.Type['SYSREQUEST'], { 'data': value });
    // }

    /**
     * This is a quick and dirty way of learning the value which has been chosen
     * --- until we implement learners properly, this will function as an ad-hoc learner node
     */
    learn = function(value) {
    }
    // TODO: Better memory management with this function
    /*
    reboot = function() {
        log('Restarting simulation...');

        if (this.ui.numnodes.input.value < 3)
            this.ui.numnodes.input.value = 3;

        window.clearInterval(Paxos.instance.timeoutInterval);
        Paxos.instance = null;
        CanvasMgr.instance = null;
        NodeMgr.instance = null;
        MessageMgr.instance = null;
        Node.NextId = 0;

        this.go();
    }*/

    // TODO: a better way to do this would be to clear the timeout, but w/e
    // pause = function() {
    //     let inst = this // Paxos.getInstance();
    //     if (inst.paused) {
    //         if (inst.ui.pause.value == 'Begin Simulation')
    //             log('Simulation started - beginning leader election now');
    //         else
    //             log('Simulation unpaused');
    //         inst.ui.pause.value = 'Pause Simulation';
    //     } else {
    //         inst.ui.pause.value = 'Unpause Simulation';
    //         log('Simulation paused');
    //     }
    //     inst.paused = !inst.paused;
    // }
}

module.exports.Paxos = Paxos
module.exports.paxos = new Paxos()


