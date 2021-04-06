/* Copyright (c) 2021, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./share.js";
reserveCodeRange(1000, 1999, "compile");
messages[1001] = "Node ID %1 not found in pool.";
messages[1002] = "Invalid tag in node with Node ID %1.";
messages[1003] = "No async callback provided.";
messages[1004] = "No visitor method defined for '%1'.";

class Visitor {
  constructor(nodePool) {
    this.nodePool = nodePool;
  }
  visit(nid, options, resume) {
    assert(nid);
    let node;
    if (typeof nid === "object") {
      node = nid;
    } else {
      node = this.nodePool[nid];
    }
    assert(node && node.tag && node.elts, "2000: Visitor.visit() tag=" + node.tag + " elts= " + JSON.stringify(node.elts));
    assert(this[node.tag], "2000: Visitor function not defined for: " + node.tag);
    assert(typeof resume === "function", message(1003));
    this[node.tag](node, options, resume);
  }
}

export class Checker extends Visitor {
  constructor(nodePool) {
    super(nodePool);
  }
  check(options, resume) {
    const nid = this.nodePool.root;
    this.visit(nid, options, (err, data) => {
      resume(err, data);
    });
  }
  PROG(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const err = [];
      const val = node;
      resume(err, val);
    });
  }
  EXPRS(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const err = [];
      const val = node;
      resume(err, val);
    });
  }
  NUM(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  LAMBDA(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const err = [];
      const val = node;
      resume(err, val);
    });
  }
  LIST(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const err = [];
      const val = node;
      resume(err, val);
    });
  }
  IDENT(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  STR(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  CONCAT(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const err = [];
      const val = node;
      resume(err, val);
    });
  }
  ADD(node, options, resume) {
    this.visit(node.elts[0], options, function (err1, val1) {
      this.visit(node.elts[1], options, function (err2, val2) {
        if (isNaN(+val1)) {
          err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
        }
        if (isNaN(+val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        const err = [].concat(err1).concat(err2);
        const val = node;
        resume(err, val);
      });
    });
  }
  BOOL(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  RECORD(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  BINDING(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  MUL(node, options, resume) {
    this.visit(node.elts[0], options, function (err1, val1) {
      this.visit(node.elts[1], options, function (err2, val2) {
        if (isNaN(+val1)) {
          err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
        }
        if (isNaN(+val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        const err = [].concat(err1).concat(err2);
        const val = node;
        resume(err, val);
      });
    });
  }
  POW(node, options, resume) {
    this.visit(node.elts[0], options, function (err1, val1) {
      this.visit(node.elts[1], options, function (err2, val2) {
        if (isNaN(+val1)) {
          err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
        }
        if (isNaN(+val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        const err = [].concat(err1).concat(err2);
        const val = node;
        resume(err, val);
      });
    });
  }
  VAL(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  KEY(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  LEN(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  ARG(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  IN(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  DATA(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  PAREN(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  APPLY(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  MAP(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
  STYLE(node, options, resume) {
    const err = [];
    const val = node;
    resume(err, val);
  }
}

function enterEnv(ctx, name, paramc) {
  if (!ctx.env) {
    ctx.env = [];
  }
  // recursion guard
  if (ctx.env.length > 380) {
    //return;  // just stop recursing
    throw new Error("runaway recursion");
  }
  ctx.env.push({
    name: name,
    paramc: paramc,
    lexicon: {},
    pattern: [],
  });
}
function exitEnv(ctx) {
  ctx.env.pop();
}
function findWord(ctx, lexeme) {
  let env = ctx.env;
  if (!env) {
    return null;
  }
  for (var i = env.length-1; i >= 0; i--) {
    var word = env[i].lexicon[lexeme];
    if (word) {
      return word;
    }
  }
  return null;
}
function addWord(ctx, lexeme, entry) {
  topEnv(ctx).lexicon[lexeme] = entry;
  return null;
}
function topEnv(ctx) {
  return ctx.env[ctx.env.length-1]
}

export class Transformer extends Visitor {
  constructor(nodePool) {
    super(nodePool);
  }
  transform(options, resume) {
    const nid = this.nodePool.root;
    this.visit(nid, options, (err, data) => {
      resume(err, data);
    });
  }
  PROG(node, options, resume) {
    if (!options) {
      options = {};
    }
    this.visit(node.elts[0], options, (e0, v0) => {
      const err = e0;
      const val = v0.pop();  // Return the value of the last expression.
      resume(err, val);
    });
  }
  EXPRS(node, options, resume) {
    let err = [];
    let val = [];
    for (let elt of node.elts) {
      this.visit(elt, options, (e0, v0) => {
        err = err.concat(e0);
        val = val.concat(v0);
      });
    }
    resume(err, val);
  }
  NUM(node, options, resume) {
    const err = [];
    const val = +node.elts[0];
    resume(err, val);
  }
  LAMBDA(node, options, resume) {
    // Return a function value.
    this.visit(node.elts[0], options, (err0, params) => {
      let args = [].concat(options.args);
      enterEnv(options, "lambda", params.length);
      params.forEach(function (param, i) {
        let inits = this.nodePool[node.elts[3]].elts;
        if (args[i]) {
          // Got an arg so use it.
          addWord(options, param, {
            name: param,
            val: args[i],
          });
        } else {
          // Don't got an arg so use the init.
          visit(inits[i], options, (err, val) => {
            addWord(options, param, {
              name: param,
              val: val,
            });
          });
        }
      });
      visit(node.elts[1], options, function (err, val) {
        exitEnv(options);
        resume([].concat(err0).concat(err).concat(err), val)
      });
    });
  }
  LIST(node, options, resume) {
    let err = [];
    let val = [];
    for (let elt of node.elts) {
      this.visit(elt, options, (e0, v0) => {
        err = err.concat(e0);
        val = val.concat(v0);
      });
    }
    resume(err, val);
  }
  IDENT(node, options, resume) {
    let word = findWord(options, node.elts[0]);
    const err = [];
    const val = word && word.val || node.elts[0];
    resume(err, val);
  }
  STR(node, options, resume) {
    const err = [];
    const val = node.elts[0];
    resume(err, val);
  }
  CONCAT(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const err = [];
      const val = [].concat(v0).join();
      resume(err, val);
    });
  }
  ADD(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        const err = [].concat(e0).concat(e1);
        const val = +v0 + +v1;
        resume(err, val);
      });
    });
  }
}

export class Renderer {
  constructor(data) {
    this.data = data;
  }
  render(options, resume) {
    // Do some rendering here.
    const err = [];
    const val = this.data;
    resume(err, val);
  }
}

export class Compiler {
  constructor(config) {
    this.langID = config.langID;
    this.version = config.version;
    this.Checker = config.Checker || Checker;
    this.Transformer = config.Transformer || Transformer;
    this.Renderer = config.Renderer || Renderer;
  }
  compile(code, data, config, resume) {
    // Compiler takes an AST in the form of a node pool (code) and transforms it
    // into an object to be rendered on the client by the viewer for this
    // language.
    try {
      let options = {
        data: data,
        config: config,
        result: '',
      };
      const checker = new this.Checker(code);
      checker.check(options, (err, val) => {
        const transformer = new this.Transformer(code);
        transformer.transform(options, (err, val) => {
          if (err && err.length) {
            resume(err, val);
          } else {
            const renderer = new this.Renderer(val);
            renderer.render(options, (err, val) => {
              val = !(val instanceof Array) && [val] || val;
              resume(err, val);
            });
          }
        });
      });
    } catch (x) {
      console.log("ERROR with code");
      console.log(x.stack);
      resume([{
        statusCode: 500,
        error: "Compiler error"
      }]);
    }
  }
}
