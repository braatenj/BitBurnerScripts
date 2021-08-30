export async function main(ns) {
    ns.disableLog("ALL");
    let shouldCommitCrime = true;
    const fastThreshold = 1000000;
    const finalThreshold = 100000000;
    const fast = 1000;
    const slow = 30000;

    while(shouldCommitCrime) {
        if(!ns.isBusy()) {
            ns.commitCrime("shoplift");
        }

        if(ns.getServerMoneyAvailable("home") > fastThreshold) {
            await ns.sleep(slow);
        } else {
            await ns.sleep(fast);
        }

        if(ns.getServerMoneyAvailable("home") > finalThreshold) {
            ns.print("Money has reached threshold, ceasing crimes");
            shouldCommitCrime = false;
        }     
    }
}