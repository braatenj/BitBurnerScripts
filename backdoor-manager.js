// the purpose of this is to backdoor the servers needed for factions

var serversToBackdoor = [];
var addedServers = [];
var listOfNodes = [];

export async function main(ns) {
    ns.disableLog("ALL");
    serversToBackdoor = [];
    serversToBackdoor.push(buildServerObject(ns, "CSEC"));
    serversToBackdoor.push(buildServerObject(ns, "avmnite-02h"));
    serversToBackdoor.push(buildServerObject(ns, "I.I.I.I"));
    serversToBackdoor.push(buildServerObject(ns, "run4theh111z"));
    addedServers = [];
    listOfNodes = [];

    var allServersBackdoored = false;

    await buildServerList(ns);
    ns.tprintf(`serversToBackdoor[]: ${serversToBackdoor.toString()}`);

    while(!allServersBackdoored) {
        allServersBackdoored = true;
        for(var i = 0; serversToBackdoor.length; i++) {
            var server = serversToBackdoor[i];
            server.print();
            if(server.hasRoot() && server.canHack()) {
                await doBackdoor(ns, server);
            } else {
                allServersBackdoored = false;
            }
        }
        await ns.sleep(5000);
    }
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
        shouldBackdoor: function() {
            var desiredServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
            return (desiredServers.includes(this.name) ? true : false);
        },
        getConnectionSequence: function() {
            var hostName = this.name;
            var connectSequence = [];
            var currentHost = hostName;
            while (currentHost !== "home") {
                var index = getHostNodeIndex(currentHost);
                var node = listOfNodes[index];
                connectSequence.push(node.name);
                currentHost = node.parent;
            }

            connectSequence.push("home");
            return connectSequence.reverse();
        },
        print: function() {
            this.instance.tprintf(`****************`);
            this.instance.tprintf(`Server: ${this.name}`);
            this.instance.tprintf(`Connection Sequence: ${this.getConnectionSequence().toString()}`);
            this.instance.tprintf(`Root: ${this.hasRoot()}`);
            this.instance.tprintf(`CanCrack: ${this.canCrack()}`);
            this.instance.tprintf(`CanHack: ${this.canHack()}`);
        }
    };
    return server;
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



async function doBackdoor(ns, server) {
    ns.tprintf(`Attempting to backdoor ${server.name}`);
    var sequence = server.getConnectionSequence();
    ns.tprintf(`Retrieved connection sequence`);
    for(var i = 0; i < sequence.length; i++) {
        ns.connect(sequence[i]);
        ns.tprintf(`...connected to ${sequence[i]}`);
        await ns.sleep(200);
    }
    ns.tprintf(`Installing backdoor on ${server.name}`);
    await ns.installBackdoor();
    await ns.sleep(10000);
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
        if (!addedServers.includes(hostName)) {
            var connectedHosts = ns.scan(hostName);
            for (var i = 0; i < connectedHosts.length; i++) {
                hostsToScan.push([connectedHosts[i], hostName]);
            }
            addServer(buildNode(hostParent, hostName));
        }
        await ns.sleep(100);
    }
}


function addServer(node) {
    addedServers.push(node.name);
    listOfNodes.push(node);
}

function getHostNodeIndex(hostName) {
    for(var i = 0; i < listOfNodes.length; i++) {
        if(listOfNodes[i].name == hostName) {
            return i;
        }
    }
}
