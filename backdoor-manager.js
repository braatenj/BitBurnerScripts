// the purpose of this is to backdoor the servers needed for factions

var serversToBackdoor = [];
var addedServers = [];
var listOfNodes = [];

export async function main(ns) {
    serversToBackdoor = [];
    serversToBackdoor.push(buildServerObject(ns, "CSEC"));
    serversToBackdoor.push(buildServerObject(ns, "avmnite-02h"));
    serversToBackdoor.push(buildServerObject(ns, "I.I.I.I"));
    serversToBackdoor.push(buildServerObject(ns, "run4theh111z"));
    addedServers = [];
    listOfNodes = [];

    await buildServerList(ns);



}

function buildServerObject(ns, node) {
    var server = {
        instance: ns,
        name: node,
        hackingRequired: ns.getServerRequiredHackingLevel(node),
        portsRequired: ns.getServerNumPortsRequired(node),
        canHack: function() { return this.instance.getHackingLevel() > this.hackingRequired; },
        canCrack: function() { return  getPortCrackers(this.instance) > this.portsRequired; },
        hasRoot: function() { return this.instance.hasRootAccess(this.name); },
    }
}

function getPortCrackers(ns) {
    var crackers = ["BruteSSH.exe","FTPCrack.exe","relaySMTP.exe","HTTPWorm.exe","SQLInject.exe"];
    var count = 0;
    for(var i = 0; i < crackers.length; i++) {
        if(ns.fileExists(crackers[i], "home")) {
            count++;
        }
    }
    return count;
}






function buildNode(p, n) {
    var node = {
        parent: p,
        name: n
    };

    return node;
}

async function buildServerList(ns) {
    var rootNode = ["home", null];
    
    var hostsToScan = [];
    hostsToScan.push(rootNode);
    
    while (hostsToScan.length > 0) {
        var host = hostsToScan.pop();
        var hostName = host[0];
        var hostParent = host[1];
        if (!addedServers.includes(hostName])) {
            var connectedHosts = ns.scan(hostName);
            for (var i = 0; i < connectedHosts.length; i++) {
                hostsToScan.push([connectedHosts[i], hostParent]);
            }
            addServer(buildNode(hostParent, hostName));
        }
        await ns.sleep(10);
    }
}


function addServer(node) {
    addedServers.push(node.name);
    listOfNodes.push(node);
}

function findConnectSequence(hostName) {
    var connectSequence = [];
    var currentHost = hostName;
    while (currentHost !== "home") {
        var index = getHostNodeIndex(hostName);
        var node = listOfNodes[index];
        connectSequence.push(node.name);
        currentHost = node.parent;
    }

    connectSequence.push("home");
    return connectSequence;
}

function getHostNodeIndex(hostName) {
    for(var i = 0; i < listOfNodes.length; i++) {
        if(listOfNodes[i].name == hostName) {
            return i;
        }
    }
}
