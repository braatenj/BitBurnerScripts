//attempts to upgrade all purchased hosts to maxRam. Will skip ones that have running scripts unless force is provided as first parameter
// use as either 'run upgrade-all-hosts.js' or 'run upgrade-all-hosts.js force'

export async function main(ns) {
    var hosts = ns.getPurchasedServers();
    const ramLimit = 1048576;
    const ramCost = 55000;
    const ramLimitCost = ramLimit * ramCost;


    for(var i = 0; i < hosts.length; i++) {
        var maxRam = ns.getServerMaxRam(hosts[i]);
        if(maxRam < ramLimit) {
            if(ns.getServerMoneyAvailable("home") > ramLimitCost) {
                if(ns.args[0] === 'force') {
                    ns.killall(hosts[i]);
                    await ns.sleep(200);
                }
                ns.deleteServer(hosts[i]);
                await ns.sleep(200);
                ns.purchaseServer("daemon", ramLimit);
            }
        }
    }
}