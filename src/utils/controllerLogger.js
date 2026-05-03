const COLORS = {
    reset: '\x1b[0m',
    brightYellow: '\x1b[93m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    bold: '\x1b[1m'
};

const logControllerEntry = (funcName, controllerName = 'controller') => {
    const now = new Date();
    const isoTime = now.toISOString();
    
    console.log(`\n${COLORS.brightYellow}${COLORS.bold}************* ${controllerName.toUpperCase()} CTL *************${COLORS.reset}`);
    console.log(`${COLORS.cyan}${isoTime} ${COLORS.yellow}${funcName}() from views ${controllerName}.controller${COLORS.reset}`);
};

export default logControllerEntry;