// the purpose of farm-stats is to return a list of our server farm capabilities
// it just prints a list of purchased servers, their value in money, and the ram they
// are using vs the total ram available.

const ramCostConstant = 55000;

export async function main(ns) {
    var serverNameList = ns.getPurchasedServers();
    var totalRam = 0;
    var totalRamUsed = 0;
    var totalRamFree = 0;
<<<<<<< Updated upstream
    var ramUtilization = 0;

=======
>>>>>>> Stashed changes
    ns.tprint("--==-- Server Farm Stats --==--");
    for (var s = 0; s < serverNameList.length; s++) {
        var box = serverNameList[s];
        var ram = ns.getServerRam(box);
        var maxRam = ram[0];
        totalRam += maxRam;
        var currentRam = ram[0] - ram[1];
        totalRamUsed += ram[1];
        var cost = maxRam * ramCostConstant;
        totalRam += maxRam;
        totalRamUsed += ram[1];
        ns.tprint(box + " Ram: " + currentRam + " / " + maxRam + " --==-- Cost: $" + cost);
    }
    totalRamFree = totalRam - totalRamUsed;
    ns.tprint("--==-- Server Farm Ram Utilization --==--");
    ns.tprint("Total Ram: " + totalRam);
    ns.tprint("Total Ram Used: " + totalRamUsed);
    ns.tprint("Total Ram Free: " + totalRamFree);
    ns.tprint("Ram Utilization (%): " + (totalRamUsed/totalRam)*100);
}
