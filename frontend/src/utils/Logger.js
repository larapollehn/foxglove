import prefix from "loglevel-plugin-prefix";
import log from "loglevel";
import chalk from "chalk";

const colors = {
    TRACE: chalk.hex("#0022ff"),
    DEBUG: chalk.hex("#19ff00"),
    INFO: chalk.hex("#ffffff"),
    WARN: chalk.hex("#ff8100"),
    ERROR: chalk.hex("#ff0000"),
};

prefix.reg(log);

prefix.apply(log, {
    format(level, name, timestamp) {
        // @ts-ignore
        return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${name}:`)}`;
    },
});

prefix.apply(log.getLogger('critical'), {
    format(level, name, timestamp) {
        return chalk.red.bold(`[${timestamp}] ${level} ${name}:`);
    },
});

log.setLevel(process.env.REACT_APP_LOG_LEVEL || "debug");
log.info("Current logging level", log.getLevel());
export default log;


