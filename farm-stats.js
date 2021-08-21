// the purpose of farm-stats is to return a list of our server farm capabilities
// it just prints a list of purchased servers, their value in money, and the ram they
// are using vs the total ram available.

const ramCostConstant = 55000;

export async function main(ns) {
    var serverNameList = ns.getPurchasedServers();
    var totalRam = 0;
    var totalRamUsed = 0;
    var totalRamFree = 0;
    var ramUtilization = 0;

    ns.tprint("--==-- Server Farm Stats --==--");
    for (var s = 0; s < serverNameList.length; s++) {
        var box = serverNameList[s];
        var ram = ns.getServerRam(box);
        var maxRam = ram[0];
        totalRam += maxRam;
        var currentRam = ram[0] - ram[1];
        totalRamUsed += ram[1];
        var cost = maxRam * ramCostConstant;
        ns.tprint(box + " Ram: " + currentRam + " / " + maxRam + " --==-- Cost: $" + cost);
    }
    totalRamFree = totalRam - totalRamUsed;
    ramUtilization = (totalRamUsed / totalRam) * 100
    ns.tprint("Total Ram: " + totalRam + "GB");
    ns.tprint("Total Ram Used: " + totalRamUsed + "GB");
    ns.tprint("Total Ram Free: " + totalRamFree + "GB");
    ns.tprint("Ram Utilization: " + ramUtilization + "%");
}
