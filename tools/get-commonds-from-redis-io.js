
const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");

jsdom.JSDOM.fromURL("https://redis.io/commands").then(dom => {  
  const code = buildCommandsCodeFromHtml(dom.window.document);
  const absPath = path.resolve(process.cwd(), "src/commands.ts")
  fs.writeFileSync(absPath, code);
  console.log(`Done! File is saved to "${absPath}"`);
});

const buildCommandsCodeFromHtml = (doc) => {
  var lis = doc.querySelectorAll("div.container ul li");

  var dict = {};
  var cats = [];

  lis.forEach(li => {
    var cat = li.dataset.group.toLowerCase();
    var name = li.dataset.name.toUpperCase();
    var usage = li.children[0].children[0].textContent
      .replace(/\\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    var explanation = li.children[0].children[1].textContent
      .trim();
    
    if (!dict[cat]) {
      dict[cat] = [];
    }
    if (!cats.includes(cat)) {
      cats.push(cat);
    }
    var cmd = {
      name: name.split(" "),
      usage: usage,
      explanation: explanation,
    }
    dict[cat].push(cmd)
  // console.log(`CAT: ${cat}, command: ${name}`);
  // console.log(`Usage: ${usage}\nExplanation: ${explanation}`);
  });

  var cmds = cats.map(cat => {
    const catCmds = dict[cat];
    const codeCmds = catCmds.map(c => {
      const nameAsKey = c.name.map(n => n.trim().replace(/-/g, "_")).join("_");
      const nameAsArray = c.name.map(n => `"${n.trim()}"`).join(", ");
      
      return `
    /**
     * @Usage ${c.usage}
     * @Purpose ${c.explanation}
     */
    ${nameAsKey}: [${nameAsArray}],`;
    }).join("\n");
    const catWithoutHyphen = cat.replace(/-([a-zA-Z])/g, (match, p1) => {
      return p1.toUpperCase();
    })
    return `  ${catWithoutHyphen}: {${codeCmds}\n  },\n`
  }).join("\n")

  var cmdsInCode = `/**
 * The redis commands recognized in categories. 
 */

export default {

${cmds}
};
`;

  return cmdsInCode;
}


//console.log(cmdsInCode);
