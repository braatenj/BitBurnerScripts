// the purpose of ram-manager is simply to upgrade RAM on
// the "home" machine ASAP whenever enough money is available.

export async function main(ns) {
    ns.disableLog("ALL");
    // this runs forever, it always runs. as long as utilization is high enough, we want more ram.
    while (true) {
        // if our utilization rates are below half, we don't necessarily need more RAM
        if (ns.getUpgradeHomeRamCost() <= ns.getServerMoneyAvailable("home")) {
            ns.print(`[RAM MANAGER:${getTime()}] Upgrading Home Ram`);
            ns.upgradeHomeRam();
        }
        await ns.sleep(2000);
    }
}

function getTime() {
    return new Date().toLocaleTimeString('en-US', {hour12: false, hour: "numeric", minute: "numeric"});
}