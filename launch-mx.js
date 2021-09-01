// copy the contents into a script named 'launch-mx.js' and then do 'run launch-mx.js' everything else will be taken care of

export async function main(ns) {
    ns.disableLog("ALL");
    let filesToDownload = ["agency-manager.js", "aug-manager.js", "cascade-kill.js", "hack-target.js", "daemon.js", "farm-stats.js", "grow-target.js", "host-manager.js", "node-manager.js", "program-manager.js", "ram-manager.js", "tor-manager.js", "weak-target.js", "commit-crime.js", "backdoor-manager.js"];
    let rootURL = "https://raw.githubusercontent.com/braatenj/BitBurnerScripts/master/";


    for(var i = 0; i < filesToDownload.length; i++) {
        await ns.wget(rootURL + filesToDownload[i], filesToDownload[i]);
        ns.print(`[LAUNCHER:${getTime()}] File Downloaded: ${filesToDownload[i]}`);
        await ns.sleep(200);
    }
    ns.print(`[LAUNCHER:${getTime()}] Spawning Daemon`);
    ns.spawn("daemon.js", 1);
}

function getTime() {
    return new Date().toLocaleTimeString('en-US', {hour12: false, hour: "numeric", minute: "numeric"});
}