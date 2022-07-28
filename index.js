require("fs").readFile("./index.breaknglang", "utf8", function (err, data) {
  require("./parser")(data);
});
