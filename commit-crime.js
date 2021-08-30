export async function main(ns) {
    let shouldCommitCrime = true;
    let threshold = 250000000;

    while(shouldCommitCrime) {
        if(!ns.isBusy()) {
            ns.commitCrime("shoplift");
            await ns.sleep(1000);
        }
        if(ns.getServerMoneyAvailable("home") > threshold) {
            ns.print("Money has reached threshold, ceasing crimes");
            shouldCommitCrime = false;
        }
        
    }
}