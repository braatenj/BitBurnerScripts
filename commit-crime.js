export async function main(ns) {
    let shouldCommitCrime = true;
    let threshold = 250000000;

    while(shouldCommitCrime) {
        if(!ns.isBusy()) {
            ns.commitCrime("Shoplift");
            await ns.sleep(500);
        }
        if(ns.getServerMoneyAvailable("home") > threshold) {
            shouldCommitCrime = false;
        }
        
    }
}