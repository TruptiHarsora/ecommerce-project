const NodeClam = require("clamscan");

let clamScan;

const init = async () => {
    clamScan = await new NodeClam().init({
        removeInfected: true,
        quarantineInfected: false,
    });
};

const scanFile = async (buffer) => {
    if (!clamScan) await init();

    const { isInfected } = await clamScan.isInfected(buffer);

    if (isInfected) {
        throw new Error("malicious file detected");
    }
    return true;
}

module.exports = scanFile;
