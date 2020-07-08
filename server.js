"use strict";
const app = require("./app");
const log = require("./src/utils/Logger");

const port = process.env.PORT || 8000;

app.listen(port, () => {
  log.debug("Server running on port", port);
});
