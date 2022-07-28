function formatMessage(content, library) {
  let m = Object.keys(library);
  let final = content;

  for (let i = 0; i < m.length; i++) {
    const key = m[i];
    const val = library[key];
    final = final.replace(`$${key}`, val);
  }

  return final;
}

function parseTypeValue(i, value) {
  let type = i.replace(/ /gi, "");
  switch (type) {
    case "string": {
      return value?.toString();
    }
    case "float": {
      return parseFloat(value);
    }
    case "int": {
      return parseInt(value);
    }
    default: {
      throw new Error(`Unknown type: ${type}`);
    }
  }
}

module.exports = function main(content) {
  const variables = {};
  const lines = content.split("\n");

  // Parse variables
  lines.forEach((line) => {
    if (line == "") return;
    const [name, value] = line.split("=");
    if (name && value) {
      if (name.startsWith("meth")) {
        var token = name.slice("meth ".length);
      } else if (name.startsWith("meff")) {
        var token = name.slice("meff ".length);
      }

      const key = token.split(":")[0];
      const isConstant = name.startsWith("meth");
      const type = token.split(":")[1].replace(" ", "");
      const valu = parseTypeValue(type, value.replace(/'*'/gims, ""));
      console.log(valu);
      const val = valu.toString().startsWith(" ") ? valu.slice(1) : valu;

      console.log(key);
      console.log(type);

      if (val) {
        if (val.length <= 0 || !val.length) return;
        const out = val.startsWith(" ") ? val.slice(1) : val;

        if (variables[key] && variables[key].isConstant === true) {
          console.warn(
            `Variable '${key}' is a Constant(Meth) variable and cannot be reassigned. Please use 'meff' instead`
          );
        }

        variables[key] = {
          name: key,
          type: type,
          isConstant: isConstant,
          value: out.replace(/\r/gi, ""),
        };
      } else {
      }
    }
  });

  // Parse Operators
  lines.forEach((line) => {
    if (line.includes("++")) {
      const key = line.split("++")[0];
      const variable = variables[key];
      if (variable) {
        if (variable.type === "int") {
          variable.value++;
        } else {
          console.log(
            `You tried to incerment a non-int variable: ${variable.name}`
          );
        }
      } else {
        console.log(`Yo Mr.White, I can't find the variable '${key}'`);
      }
    } else if (line.includes("--")) {
      const variable = variables[line.split("--")[0]];
      if (typeof variable === "int") {
        variable.value++;
      } else {
        console.warn(
          `You tried to decerment a non-int variable: ${variable.name}`
        );
      }
    }
  });

  // Print stuff
  lines.forEach((line) => {
    if (line.toLowerCase().startsWith("jesse:")) {
      const value = line.split(":")[1];
      const hasQuotes = new RegExp(/'*'/, "gi").test(value);

      const library = {};

      Object.keys(variables).map((key) => {
        const variable = variables[key];
        library[key] = variable.value;
      });

      if (hasQuotes) {
        const val = value.replace(/'*'/gi, "");
        const output = val.startsWith(" ") ? val.slice(1) : val;
        console.log(`${formatMessage(output, library)}`);
      } else {
        const key = value.replace("$", "").slice(" ".length);
        if (variables[key]) {
          console.log(variables[key].value);
        } else {
          console.log(`Yo Mr.White, I can't find the variable '${key}'`);
        }
      }
    }
  });

  console.log(variables);
};
