/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-04-24
 */
(function (az, q) {
  var F, l, v, Q, T, af, aF, R, ai, K, w, ar, am, aA, k, O, au = "sizzle" + -(new Date()), S = az.document, aC = {}, aD = 0, an = 0, d = I(), at = I(), P = I(), ag = false, M = function () {
    return 0
  }, ay = typeof q, aa = 1 << 31, X = aC.hasOwnProperty, aw = [], ax = aw.pop, V = aw.push, b = aw.push, u = aw.slice, j = aw.indexOf || function (aH) {
        var aG = 0, e = this.length;
        for (; aG < e; aG++) {
          if (this[aG] === aH) {
            return aG
          }
        }
        return -1
      }, c = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", x = "[\\x20\\t\\r\\n\\f]", a = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", U = a.replace("w", "w#"), ap = "\\[" + x + "*(" + a + ")" + x + "*(?:([*^$|!~]?=)" + x + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + U + ")|)|)" + x + "*\\]", s = ":(" + a + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ap.replace(3, 8) + ")*)|.*)\\)|)", z = new RegExp("^" + x + "+|((?:^|[^\\\\])(?:\\\\.)*)" + x + "+$", "g"), C = new RegExp("^" + x + "*," + x + "*"), J = new RegExp("^" + x + "*([>+~]|" + x + ")" + x + "*"), ak = new RegExp(x + "*[+~]"), B = new RegExp("=" + x + "*([^\\]'\"]*)" + x + "*\\]", "g"), ac = new RegExp(s), ad = new RegExp("^" + U + "$"), al = {
    ID: new RegExp("^#(" + a + ")"),
    CLASS: new RegExp("^\\.(" + a + ")"),
    TAG: new RegExp("^(" + a.replace("w", "w*") + ")"),
    ATTR: new RegExp("^" + ap),
    PSEUDO: new RegExp("^" + s),
    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + x + "*(even|odd|(([+-]|)(\\d*)n|)" + x + "*(?:([+-]|)" + x + "*(\\d+)|))" + x + "*\\)|)", "i"),
    bool: new RegExp("^(?:" + c + ")$", "i"),
    needsContext: new RegExp("^" + x + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + x + "*((?:-\\d)?\\d*)" + x + "*\\)|)(?=[^-]|$)", "i")
  }, Z = /^[^{]+\{\s*\[native \w/, ab = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, h = /^(?:input|select|textarea|button)$/i, t = /^h\d$/i, W = /'|\\/g, A = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g, ao = function (e, aG) {
    var i = "0x" + aG - 65536;
    return i !== i ? aG : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, i & 1023 | 56320)
  };
  try {
    b.apply((aw = u.call(S.childNodes)), S.childNodes);
    aw[S.childNodes.length].nodeType
  } catch (L) {
    b = {
      apply: aw.length ? function (i, e) {
        V.apply(i, u.call(e))
      } : function (aI, aH) {
        var e = aI.length, aG = 0;
        while ((aI[e++] = aH[aG++])) {
        }
        aI.length = e - 1
      }
    }
  }
  function N(e) {
    return Z.test(e + "")
  }

  function I() {
    var e, i = [];
    return (e = function (aG, aH) {
      if (i.push(aG += " ") > v.cacheLength) {
        delete e[i.shift()]
      }
      return (e[aG] = aH)
    })
  }

  function r(e) {
    e[au] = true;
    return e
  }

  function m(i) {
    var aH = K.createElement("div");
    try {
      return !!i(aH)
    } catch (aG) {
      return false
    } finally {
      if (aH.parentNode) {
        aH.parentNode.removeChild(aH)
      }
      aH = null
    }
  }

  function D(aN, aG, aR, aT) {
    var aS, aK, aL, aP, aQ, aJ, aI, e, aH, aO;
    if ((aG ? aG.ownerDocument || aG : S) !== K) {
      ai(aG)
    }
    aG = aG || K;
    aR = aR || [];
    if (!aN || typeof aN !== "string") {
      return aR
    }
    if ((aP = aG.nodeType) !== 1 && aP !== 9) {
      return []
    }
    if (ar && !aT) {
      if ((aS = ab.exec(aN))) {
        if ((aL = aS[1])) {
          if (aP === 9) {
            aK = aG.getElementById(aL);
            if (aK && aK.parentNode) {
              if (aK.id === aL) {
                aR.push(aK);
                return aR
              }
            } else {
              return aR
            }
          } else {
            if (aG.ownerDocument && (aK = aG.ownerDocument.getElementById(aL)) && O(aG, aK) && aK.id === aL) {
              aR.push(aK);
              return aR
            }
          }
        } else {
          if (aS[2]) {
            b.apply(aR, aG.getElementsByTagName(aN));
            return aR
          } else {
            if ((aL = aS[3]) && aC.getElementsByClassName && aG.getElementsByClassName) {
              b.apply(aR, aG.getElementsByClassName(aL));
              return aR
            }
          }
        }
      }
      if (aC.qsa && (!am || !am.test(aN))) {
        e = aI = au;
        aH = aG;
        aO = aP === 9 && aN;
        if (aP === 1 && aG.nodeName.toLowerCase() !== "object") {
          aJ = p(aN);
          if ((aI = aG.getAttribute("id"))) {
            e = aI.replace(W, "\\$&")
          } else {
            aG.setAttribute("id", e)
          }
          e = "[id='" + e + "'] ";
          aQ = aJ.length;
          while (aQ--) {
            aJ[aQ] = e + o(aJ[aQ])
          }
          aH = ak.test(aN) && aG.parentNode || aG;
          aO = aJ.join(",")
        }
        if (aO) {
          try {
            b.apply(aR, aH.querySelectorAll(aO));
            return aR
          } catch (aM) {
          } finally {
            if (!aI) {
              aG.removeAttribute("id")
            }
          }
        }
      }
    }
    return aB(aN.replace(z, "$1"), aG, aR, aT)
  }

  T = D.isXML = function (e) {
    var i = e && (e.ownerDocument || e).documentElement;
    return i ? i.nodeName !== "HTML" : false
  };
  ai = D.setDocument = function (e) {
    var i = e ? e.ownerDocument || e : S;
    if (i === K || i.nodeType !== 9 || !i.documentElement) {
      return K
    }
    K = i;
    w = i.documentElement;
    ar = !T(i);
    aC.getElementsByTagName = m(function (aG) {
      aG.appendChild(i.createComment(""));
      return !aG.getElementsByTagName("*").length
    });
    aC.attributes = m(function (aG) {
      aG.className = "i";
      return !aG.getAttribute("className")
    });
    aC.getElementsByClassName = m(function (aG) {
      aG.innerHTML = "<div class='a'></div><div class='a i'></div>";
      aG.firstChild.className = "i";
      return aG.getElementsByClassName("i").length === 2
    });
    aC.sortDetached = m(function (aG) {
      return aG.compareDocumentPosition(K.createElement("div")) & 1
    });
    aC.getById = m(function (aG) {
      w.appendChild(aG).id = au;
      return !i.getElementsByName || !i.getElementsByName(au).length
    });
    if (aC.getById) {
      v.find.ID = function (aI, aH) {
        if (typeof aH.getElementById !== ay && ar) {
          var aG = aH.getElementById(aI);
          return aG && aG.parentNode ? [aG] : []
        }
      };
      v.filter.ID = function (aH) {
        var aG = aH.replace(A, ao);
        return function (aI) {
          return aI.getAttribute("id") === aG
        }
      }
    } else {
      v.find.ID = function (aI, aH) {
        if (typeof aH.getElementById !== ay && ar) {
          var aG = aH.getElementById(aI);
          return aG ? aG.id === aI || typeof aG.getAttributeNode !== ay && aG.getAttributeNode("id").value === aI ? [aG] : q : []
        }
      };
      v.filter.ID = function (aH) {
        var aG = aH.replace(A, ao);
        return function (aJ) {
          var aI = typeof aJ.getAttributeNode !== ay && aJ.getAttributeNode("id");
          return aI && aI.value === aG
        }
      }
    }
    v.find.TAG = aC.getElementsByTagName ? function (aG, aH) {
      if (typeof aH.getElementsByTagName !== ay) {
        return aH.getElementsByTagName(aG)
      }
    } : function (aG, aK) {
      var aL, aJ = [], aI = 0, aH = aK.getElementsByTagName(aG);
      if (aG === "*") {
        while ((aL = aH[aI++])) {
          if (aL.nodeType === 1) {
            aJ.push(aL)
          }
        }
        return aJ
      }
      return aH
    };
    v.find.CLASS = aC.getElementsByClassName && function (aH, aG) {
      if (typeof aG.getElementsByClassName !== ay && ar) {
        return aG.getElementsByClassName(aH)
      }
    };
    aA = [];
    am = [];
    if ((aC.qsa = N(i.querySelectorAll))) {
      m(function (aG) {
        aG.innerHTML = "<select><option selected=''></option></select>";
        if (!aG.querySelectorAll("[selected]").length) {
          am.push("\\[" + x + "*(?:value|" + c + ")")
        }
        if (!aG.querySelectorAll(":checked").length) {
          am.push(":checked")
        }
      });
      m(function (aH) {
        var aG = K.createElement("input");
        aG.setAttribute("type", "hidden");
        aH.appendChild(aG).setAttribute("t", "");
        if (aH.querySelectorAll("[t^='']").length) {
          am.push("[*^$]=" + x + "*(?:''|\"\")")
        }
        if (!aH.querySelectorAll(":enabled").length) {
          am.push(":enabled", ":disabled")
        }
        aH.querySelectorAll("*,:x");
        am.push(",.*:")
      })
    }
    if ((aC.matchesSelector = N((k = w.webkitMatchesSelector || w.mozMatchesSelector || w.oMatchesSelector || w.msMatchesSelector)))) {
      m(function (aG) {
        aC.disconnectedMatch = k.call(aG, "div");
        k.call(aG, "[s!='']:x");
        aA.push("!=", s)
      })
    }
    am = am.length && new RegExp(am.join("|"));
    aA = aA.length && new RegExp(aA.join("|"));
    O = N(w.contains) || w.compareDocumentPosition ? function (aH, aG) {
      var aJ = aH.nodeType === 9 ? aH.documentElement : aH, aI = aG && aG.parentNode;
      return aH === aI || !!(aI && aI.nodeType === 1 && (aJ.contains ? aJ.contains(aI) : aH.compareDocumentPosition && aH.compareDocumentPosition(aI) & 16))
    } : function (aH, aG) {
      if (aG) {
        while ((aG = aG.parentNode)) {
          if (aG === aH) {
            return true
          }
        }
      }
      return false
    };
    M = w.compareDocumentPosition ? function (aH, aG) {
      if (aH === aG) {
        ag = true;
        return 0
      }
      var aI = aG.compareDocumentPosition && aH.compareDocumentPosition && aH.compareDocumentPosition(aG);
      if (aI) {
        if (aI & 1 || (!aC.sortDetached && aG.compareDocumentPosition(aH) === aI)) {
          if (aH === i || O(S, aH)) {
            return -1
          }
          if (aG === i || O(S, aG)) {
            return 1
          }
          return R ? (j.call(R, aH) - j.call(R, aG)) : 0
        }
        return aI & 4 ? -1 : 1
      }
      return aH.compareDocumentPosition ? -1 : 1
    } : function (aH, aG) {
      var aN, aK = 0, aM = aH.parentNode, aJ = aG.parentNode, aI = [aH], aL = [aG];
      if (aH === aG) {
        ag = true;
        return 0
      } else {
        if (!aM || !aJ) {
          return aH === i ? -1 : aG === i ? 1 : aM ? -1 : aJ ? 1 : R ? (j.call(R, aH) - j.call(R, aG)) : 0
        } else {
          if (aM === aJ) {
            return f(aH, aG)
          }
        }
      }
      aN = aH;
      while ((aN = aN.parentNode)) {
        aI.unshift(aN)
      }
      aN = aG;
      while ((aN = aN.parentNode)) {
        aL.unshift(aN)
      }
      while (aI[aK] === aL[aK]) {
        aK++
      }
      return aK ? f(aI[aK], aL[aK]) : aI[aK] === S ? -1 : aL[aK] === S ? 1 : 0
    };
    return K
  };
  D.matches = function (i, e) {
    return D(i, null, null, e)
  };
  D.matchesSelector = function (aG, aI) {
    if ((aG.ownerDocument || aG) !== K) {
      ai(aG)
    }
    aI = aI.replace(B, "='$1']");
    if (aC.matchesSelector && ar && (!aA || !aA.test(aI)) && (!am || !am.test(aI))) {
      try {
        var i = k.call(aG, aI);
        if (i || aC.disconnectedMatch || aG.document && aG.document.nodeType !== 11) {
          return i
        }
      } catch (aH) {
      }
    }
    return D(aI, K, null, [aG]).length > 0
  };
  D.contains = function (e, i) {
    if ((e.ownerDocument || e) !== K) {
      ai(e)
    }
    return O(e, i)
  };
  D.attr = function (aG, e) {
    if ((aG.ownerDocument || aG) !== K) {
      ai(aG)
    }
    var i = v.attrHandle[e.toLowerCase()], aH = i && (X.call(v.attrHandle, e.toLowerCase()) ? i(aG, e, !ar) : q);
    return aH === q ? aC.attributes || !ar ? aG.getAttribute(e) : (aH = aG.getAttributeNode(e)) && aH.specified ? aH.value : null : aH
  };
  D.error = function (e) {
    throw new Error("Syntax error, unrecognized expression: " + e)
  };
  D.uniqueSort = function (aH) {
    var aI, aJ = [], e = 0, aG = 0;
    ag = !aC.detectDuplicates;
    R = !aC.sortStable && aH.slice(0);
    aH.sort(M);
    if (ag) {
      while ((aI = aH[aG++])) {
        if (aI === aH[aG]) {
          e = aJ.push(aG)
        }
      }
      while (e--) {
        aH.splice(aJ[e], 1)
      }
    }
    return aH
  };
  function f(i, e) {
    var aH = e && i, aG = aH && (~e.sourceIndex || aa) - (~i.sourceIndex || aa);
    if (aG) {
      return aG
    }
    if (aH) {
      while ((aH = aH.nextSibling)) {
        if (aH === e) {
          return -1
        }
      }
    }
    return i ? 1 : -1
  }

  function Y(i, e, aH) {
    var aG;
    return aH ? q : (aG = i.getAttributeNode(e)) && aG.specified ? aG.value : i[e] === true ? e.toLowerCase() : null
  }

  function G(i, e, aH) {
    var aG;
    return aH ? q : (aG = i.getAttribute(e, e.toLowerCase() === "type" ? 1 : 2))
  }

  function E(e) {
    return function (aG) {
      var i = aG.nodeName.toLowerCase();
      return i === "input" && aG.type === e
    }
  }

  function g(e) {
    return function (aG) {
      var i = aG.nodeName.toLowerCase();
      return (i === "input" || i === "button") && aG.type === e
    }
  }

  function aq(e) {
    return r(function (i) {
      i = +i;
      return r(function (aG, aK) {
        var aI, aH = e([], aG.length, i), aJ = aH.length;
        while (aJ--) {
          if (aG[(aI = aH[aJ])]) {
            aG[aI] = !(aK[aI] = aG[aI])
          }
        }
      })
    })
  }

  Q = D.getText = function (aJ) {
    var aI, aG = "", aH = 0, e = aJ.nodeType;
    if (!e) {
      for (; (aI = aJ[aH]); aH++) {
        aG += Q(aI)
      }
    } else {
      if (e === 1 || e === 9 || e === 11) {
        if (typeof aJ.textContent === "string") {
          return aJ.textContent
        } else {
          for (aJ = aJ.firstChild; aJ; aJ = aJ.nextSibling) {
            aG += Q(aJ)
          }
        }
      } else {
        if (e === 3 || e === 4) {
          return aJ.nodeValue
        }
      }
    }
    return aG
  };
  v = D.selectors = {
    cacheLength: 50,
    createPseudo: r,
    match: al,
    attrHandle: {},
    find: {},
    relative: {
      ">": {dir: "parentNode", first: true},
      " ": {dir: "parentNode"},
      "+": {dir: "previousSibling", first: true},
      "~": {dir: "previousSibling"}
    },
    preFilter: {
      ATTR: function (e) {
        e[1] = e[1].replace(A, ao);
        e[3] = (e[4] || e[5] || "").replace(A, ao);
        if (e[2] === "~=") {
          e[3] = " " + e[3] + " "
        }
        return e.slice(0, 4)
      }, CHILD: function (e) {
        e[1] = e[1].toLowerCase();
        if (e[1].slice(0, 3) === "nth") {
          if (!e[3]) {
            D.error(e[0])
          }
          e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd"));
          e[5] = +((e[7] + e[8]) || e[3] === "odd")
        } else {
          if (e[3]) {
            D.error(e[0])
          }
        }
        return e
      }, PSEUDO: function (i) {
        var e, aG = !i[5] && i[2];
        if (al.CHILD.test(i[0])) {
          return null
        }
        if (i[4]) {
          i[2] = i[4]
        } else {
          if (aG && ac.test(aG) && (e = p(aG, true)) && (e = aG.indexOf(")", aG.length - e) - aG.length)) {
            i[0] = i[0].slice(0, e);
            i[2] = aG.slice(0, e)
          }
        }
        return i.slice(0, 3)
      }
    },
    filter: {
      TAG: function (i) {
        var e = i.replace(A, ao).toLowerCase();
        return i === "*" ? function () {
          return true
        } : function (aG) {
          return aG.nodeName && aG.nodeName.toLowerCase() === e
        }
      }, CLASS: function (e) {
        var i = d[e + " "];
        return i || (i = new RegExp("(^|" + x + ")" + e + "(" + x + "|$)")) && d(e, function (aG) {
              return i.test(typeof aG.className === "string" && aG.className || typeof aG.getAttribute !== ay && aG.getAttribute("class") || "")
            })
      }, ATTR: function (aG, i, e) {
        return function (aI) {
          var aH = D.attr(aI, aG);
          if (aH == null) {
            return i === "!="
          }
          if (!i) {
            return true
          }
          aH += "";
          return i === "=" ? aH === e : i === "!=" ? aH !== e : i === "^=" ? e && aH.indexOf(e) === 0 : i === "*=" ? e && aH.indexOf(e) > -1 : i === "$=" ? e && aH.slice(-e.length) === e : i === "~=" ? (" " + aH + " ").indexOf(e) > -1 : i === "|=" ? aH === e || aH.slice(0, e.length + 1) === e + "-" : false
        }
      }, CHILD: function (i, aI, aH, aJ, aG) {
        var aL = i.slice(0, 3) !== "nth", e = i.slice(-4) !== "last", aK = aI === "of-type";
        return aJ === 1 && aG === 0 ? function (aM) {
          return !!aM.parentNode
        } : function (aS, aQ, aV) {
          var aM, aY, aT, aX, aU, aP, aR = aL !== e ? "nextSibling" : "previousSibling", aW = aS.parentNode, aO = aK && aS.nodeName.toLowerCase(), aN = !aV && !aK;
          if (aW) {
            if (aL) {
              while (aR) {
                aT = aS;
                while ((aT = aT[aR])) {
                  if (aK ? aT.nodeName.toLowerCase() === aO : aT.nodeType === 1) {
                    return false
                  }
                }
                aP = aR = i === "only" && !aP && "nextSibling"
              }
              return true
            }
            aP = [e ? aW.firstChild : aW.lastChild];
            if (e && aN) {
              aY = aW[au] || (aW[au] = {});
              aM = aY[i] || [];
              aU = aM[0] === aD && aM[1];
              aX = aM[0] === aD && aM[2];
              aT = aU && aW.childNodes[aU];
              while ((aT = ++aU && aT && aT[aR] || (aX = aU = 0) || aP.pop())) {
                if (aT.nodeType === 1 && ++aX && aT === aS) {
                  aY[i] = [aD, aU, aX];
                  break
                }
              }
            } else {
              if (aN && (aM = (aS[au] || (aS[au] = {}))[i]) && aM[0] === aD) {
                aX = aM[1]
              } else {
                while ((aT = ++aU && aT && aT[aR] || (aX = aU = 0) || aP.pop())) {
                  if ((aK ? aT.nodeName.toLowerCase() === aO : aT.nodeType === 1) && ++aX) {
                    if (aN) {
                      (aT[au] || (aT[au] = {}))[i] = [aD, aX]
                    }
                    if (aT === aS) {
                      break
                    }
                  }
                }
              }
            }
            aX -= aG;
            return aX === aJ || (aX % aJ === 0 && aX / aJ >= 0)
          }
        }
      }, PSEUDO: function (aH, aG) {
        var e, i = v.pseudos[aH] || v.setFilters[aH.toLowerCase()] || D.error("unsupported pseudo: " + aH);
        if (i[au]) {
          return i(aG)
        }
        if (i.length > 1) {
          e = [aH, aH, "", aG];
          return v.setFilters.hasOwnProperty(aH.toLowerCase()) ? r(function (aK, aM) {
            var aJ, aI = i(aK, aG), aL = aI.length;
            while (aL--) {
              aJ = j.call(aK, aI[aL]);
              aK[aJ] = !(aM[aJ] = aI[aL])
            }
          }) : function (aI) {
            return i(aI, 0, e)
          }
        }
        return i
      }
    },
    pseudos: {
      not: r(function (e) {
        var i = [], aG = [], aH = af(e.replace(z, "$1"));
        return aH[au] ? r(function (aJ, aO, aM, aK) {
          var aN, aI = aH(aJ, null, aK, []), aL = aJ.length;
          while (aL--) {
            if ((aN = aI[aL])) {
              aJ[aL] = !(aO[aL] = aN)
            }
          }
        }) : function (aK, aJ, aI) {
          i[0] = aK;
          aH(i, null, aI, aG);
          return !aG.pop()
        }
      }), has: r(function (e) {
        return function (i) {
          return D(e, i).length > 0
        }
      }), contains: r(function (e) {
        return function (i) {
          return (i.textContent || i.innerText || Q(i)).indexOf(e) > -1
        }
      }), lang: r(function (e) {
        if (!ad.test(e || "")) {
          D.error("unsupported lang: " + e)
        }
        e = e.replace(A, ao).toLowerCase();
        return function (aG) {
          var i;
          do {
            if ((i = ar ? aG.lang : aG.getAttribute("xml:lang") || aG.getAttribute("lang"))) {
              i = i.toLowerCase();
              return i === e || i.indexOf(e + "-") === 0
            }
          } while ((aG = aG.parentNode) && aG.nodeType === 1);
          return false
        }
      }), target: function (e) {
        var i = az.location && az.location.hash;
        return i && i.slice(1) === e.id
      }, root: function (e) {
        return e === w
      }, focus: function (e) {
        return e === K.activeElement && (!K.hasFocus || K.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
      }, enabled: function (e) {
        return e.disabled === false
      }, disabled: function (e) {
        return e.disabled === true
      }, checked: function (e) {
        var i = e.nodeName.toLowerCase();
        return (i === "input" && !!e.checked) || (i === "option" && !!e.selected)
      }, selected: function (e) {
        if (e.parentNode) {
          e.parentNode.selectedIndex
        }
        return e.selected === true
      }, empty: function (e) {
        for (e = e.firstChild; e; e = e.nextSibling) {
          if (e.nodeName > "@" || e.nodeType === 3 || e.nodeType === 4) {
            return false
          }
        }
        return true
      }, parent: function (e) {
        return !v.pseudos.empty(e)
      }, header: function (e) {
        return t.test(e.nodeName)
      }, input: function (e) {
        return h.test(e.nodeName)
      }, button: function (i) {
        var e = i.nodeName.toLowerCase();
        return e === "input" && i.type === "button" || e === "button"
      }, text: function (i) {
        var e;
        return i.nodeName.toLowerCase() === "input" && i.type === "text" && ((e = i.getAttribute("type")) == null || e.toLowerCase() === i.type)
      }, first: aq(function () {
        return [0]
      }), last: aq(function (e, i) {
        return [i - 1]
      }), eq: aq(function (e, aG, i) {
        return [i < 0 ? i + aG : i]
      }), even: aq(function (e, aH) {
        var aG = 0;
        for (; aG < aH; aG += 2) {
          e.push(aG)
        }
        return e
      }), odd: aq(function (e, aH) {
        var aG = 1;
        for (; aG < aH; aG += 2) {
          e.push(aG)
        }
        return e
      }), lt: aq(function (e, aI, aH) {
        var aG = aH < 0 ? aH + aI : aH;
        for (; --aG >= 0;) {
          e.push(aG)
        }
        return e
      }), gt: aq(function (e, aI, aH) {
        var aG = aH < 0 ? aH + aI : aH;
        for (; ++aG < aI;) {
          e.push(aG)
        }
        return e
      })
    }
  };
  for (F in {radio: true, checkbox: true, file: true, password: true, image: true}) {
    v.pseudos[F] = E(F)
  }
  for (F in {submit: true, reset: true}) {
    v.pseudos[F] = g(F)
  }
  function p(aI, aN) {
    var i, aJ, aL, aM, aK, aG, e, aH = at[aI + " "];
    if (aH) {
      return aN ? 0 : aH.slice(0)
    }
    aK = aI;
    aG = [];
    e = v.preFilter;
    while (aK) {
      if (!i || (aJ = C.exec(aK))) {
        if (aJ) {
          aK = aK.slice(aJ[0].length) || aK
        }
        aG.push(aL = [])
      }
      i = false;
      if ((aJ = J.exec(aK))) {
        i = aJ.shift();
        aL.push({value: i, type: aJ[0].replace(z, " ")});
        aK = aK.slice(i.length)
      }
      for (aM in v.filter) {
        if ((aJ = al[aM].exec(aK)) && (!e[aM] || (aJ = e[aM](aJ)))) {
          i = aJ.shift();
          aL.push({value: i, type: aM, matches: aJ});
          aK = aK.slice(i.length)
        }
      }
      if (!i) {
        break
      }
    }
    return aN ? aK.length : aK ? D.error(aI) : at(aI, aG).slice(0)
  }

  function o(aI) {
    var aH = 0, aG = aI.length, e = "";
    for (; aH < aG; aH++) {
      e += aI[aH].value
    }
    return e
  }

  function y(aI, aG, aH) {
    var e = aG.dir, aJ = aH && e === "parentNode", i = an++;
    return aG.first ? function (aM, aL, aK) {
      while ((aM = aM[e])) {
        if (aM.nodeType === 1 || aJ) {
          return aI(aM, aL, aK)
        }
      }
    } : function (aO, aM, aL) {
      var aQ, aK, aN, aP = aD + " " + i;
      if (aL) {
        while ((aO = aO[e])) {
          if (aO.nodeType === 1 || aJ) {
            if (aI(aO, aM, aL)) {
              return true
            }
          }
        }
      } else {
        while ((aO = aO[e])) {
          if (aO.nodeType === 1 || aJ) {
            aN = aO[au] || (aO[au] = {});
            if ((aK = aN[e]) && aK[0] === aP) {
              if ((aQ = aK[1]) === true || aQ === l) {
                return aQ === true
              }
            } else {
              aK = aN[e] = [aP];
              aK[1] = aI(aO, aM, aL) || l;
              if (aK[1] === true) {
                return true
              }
            }
          }
        }
      }
    }
  }

  function aE(e) {
    return e.length > 1 ? function (aJ, aI, aG) {
      var aH = e.length;
      while (aH--) {
        if (!e[aH](aJ, aI, aG)) {
          return false
        }
      }
      return true
    } : e[0]
  }

  function aj(e, aG, aH, aI, aL) {
    var aJ, aO = [], aK = 0, aM = e.length, aN = aG != null;
    for (; aK < aM; aK++) {
      if ((aJ = e[aK])) {
        if (!aH || aH(aJ, aI, aL)) {
          aO.push(aJ);
          if (aN) {
            aG.push(aK)
          }
        }
      }
    }
    return aO
  }

  function n(aG, i, aI, aH, aJ, e) {
    if (aH && !aH[au]) {
      aH = n(aH)
    }
    if (aJ && !aJ[au]) {
      aJ = n(aJ, e)
    }
    return r(function (aU, aR, aM, aT) {
      var aW, aS, aO, aN = [], aV = [], aL = aR.length, aK = aU || H(i || "*", aM.nodeType ? [aM] : aM, []), aP = aG && (aU || !i) ? aj(aK, aN, aG, aM, aT) : aK, aQ = aI ? aJ || (aU ? aG : aL || aH) ? [] : aR : aP;
      if (aI) {
        aI(aP, aQ, aM, aT)
      }
      if (aH) {
        aW = aj(aQ, aV);
        aH(aW, [], aM, aT);
        aS = aW.length;
        while (aS--) {
          if ((aO = aW[aS])) {
            aQ[aV[aS]] = !(aP[aV[aS]] = aO)
          }
        }
      }
      if (aU) {
        if (aJ || aG) {
          if (aJ) {
            aW = [];
            aS = aQ.length;
            while (aS--) {
              if ((aO = aQ[aS])) {
                aW.push((aP[aS] = aO))
              }
            }
            aJ(null, (aQ = []), aW, aT)
          }
          aS = aQ.length;
          while (aS--) {
            if ((aO = aQ[aS]) && (aW = aJ ? j.call(aU, aO) : aN[aS]) > -1) {
              aU[aW] = !(aR[aW] = aO)
            }
          }
        }
      } else {
        aQ = aj(aQ === aR ? aQ.splice(aL, aQ.length) : aQ);
        if (aJ) {
          aJ(null, aR, aQ, aT)
        } else {
          b.apply(aR, aQ)
        }
      }
    })
  }

  function av(aL) {
    var aG, aJ, aH, aK = aL.length, aO = v.relative[aL[0].type], aP = aO || v.relative[" "], aI = aO ? 1 : 0, aM = y(function (i) {
      return i === aG
    }, aP, true), aN = y(function (i) {
      return j.call(aG, i) > -1
    }, aP, true), e = [function (aR, aQ, i) {
      return (!aO && (i || aQ !== aF)) || ((aG = aQ).nodeType ? aM(aR, aQ, i) : aN(aR, aQ, i))
    }];
    for (; aI < aK; aI++) {
      if ((aJ = v.relative[aL[aI].type])) {
        e = [y(aE(e), aJ)]
      } else {
        aJ = v.filter[aL[aI].type].apply(null, aL[aI].matches);
        if (aJ[au]) {
          aH = ++aI;
          for (; aH < aK; aH++) {
            if (v.relative[aL[aH].type]) {
              break
            }
          }
          return n(aI > 1 && aE(e), aI > 1 && o(aL.slice(0, aI - 1)).replace(z, "$1"), aJ, aI < aH && av(aL.slice(aI, aH)), aH < aK && av((aL = aL.slice(aH))), aH < aK && o(aL))
        }
        e.push(aJ)
      }
    }
    return aE(e)
  }

  function ah(aH, aG) {
    var aJ = 0, e = aG.length > 0, aI = aH.length > 0, i = function (aT, aN, aS, aR, aZ) {
      var aO, aP, aU, aY = [], aX = 0, aQ = "0", aK = aT && [], aV = aZ != null, aW = aF, aM = aT || aI && v.find.TAG("*", aZ && aN.parentNode || aN), aL = (aD += aW == null ? 1 : Math.random() || 0.1);
      if (aV) {
        aF = aN !== K && aN;
        l = aJ
      }
      for (; (aO = aM[aQ]) != null; aQ++) {
        if (aI && aO) {
          aP = 0;
          while ((aU = aH[aP++])) {
            if (aU(aO, aN, aS)) {
              aR.push(aO);
              break
            }
          }
          if (aV) {
            aD = aL;
            l = ++aJ
          }
        }
        if (e) {
          if ((aO = !aU && aO)) {
            aX--
          }
          if (aT) {
            aK.push(aO)
          }
        }
      }
      aX += aQ;
      if (e && aQ !== aX) {
        aP = 0;
        while ((aU = aG[aP++])) {
          aU(aK, aY, aN, aS)
        }
        if (aT) {
          if (aX > 0) {
            while (aQ--) {
              if (!(aK[aQ] || aY[aQ])) {
                aY[aQ] = ax.call(aR)
              }
            }
          }
          aY = aj(aY)
        }
        b.apply(aR, aY);
        if (aV && !aT && aY.length > 0 && (aX + aG.length) > 1) {
          D.uniqueSort(aR)
        }
      }
      if (aV) {
        aD = aL;
        aF = aW
      }
      return aK
    };
    return e ? r(i) : i
  }

  af = D.compile = function (e, aK) {
    var aH, aG = [], aJ = [], aI = P[e + " "];
    if (!aI) {
      if (!aK) {
        aK = p(e)
      }
      aH = aK.length;
      while (aH--) {
        aI = av(aK[aH]);
        if (aI[au]) {
          aG.push(aI)
        } else {
          aJ.push(aI)
        }
      }
      aI = P(e, ah(aJ, aG))
    }
    return aI
  };
  function H(aG, aJ, aI) {
    var aH = 0, e = aJ.length;
    for (; aH < e; aH++) {
      D(aG, aJ[aH], aI)
    }
    return aI
  }

  function aB(aH, e, aI, aL) {
    var aJ, aN, aG, aO, aM, aK = p(aH);
    if (!aL) {
      if (aK.length === 1) {
        aN = aK[0] = aK[0].slice(0);
        if (aN.length > 2 && (aG = aN[0]).type === "ID" && e.nodeType === 9 && ar && v.relative[aN[1].type]) {
          e = (v.find.ID(aG.matches[0].replace(A, ao), e) || [])[0];
          if (!e) {
            return aI
          }
          aH = aH.slice(aN.shift().value.length)
        }
        aJ = al.needsContext.test(aH) ? 0 : aN.length;
        while (aJ--) {
          aG = aN[aJ];
          if (v.relative[(aO = aG.type)]) {
            break
          }
          if ((aM = v.find[aO])) {
            if ((aL = aM(aG.matches[0].replace(A, ao), ak.test(aN[0].type) && e.parentNode || e))) {
              aN.splice(aJ, 1);
              aH = aL.length && o(aN);
              if (!aH) {
                b.apply(aI, aL);
                return aI
              }
              break
            }
          }
        }
      }
    }
    af(aH, aK)(aL, e, !ar, aI, ak.test(aH));
    return aI
  }

  v.pseudos.nth = v.pseudos.eq;
  function ae() {
  }

  ae.prototype = v.filters = v.pseudos;
  v.setFilters = new ae();
  aC.sortStable = au.split("").sort(M).join("") === au;
  ai();
  [0, 0].sort(M);
  aC.detectDuplicates = ag;
  m(function (aH) {
    aH.innerHTML = "<a href='#'></a>";
    if (aH.firstChild.getAttribute("href") !== "#") {
      var e = "type|href|height|width".split("|"), aG = e.length;
      while (aG--) {
        v.attrHandle[e[aG]] = G
      }
    }
  });
  m(function (aH) {
    if (aH.getAttribute("disabled") != null) {
      var e = c.split("|"), aG = e.length;
      while (aG--) {
        v.attrHandle[e[aG]] = Y
      }
    }
  });
  az.Sizzle = D
})(window);
var _AT = _AT || {};
(function () {
  _AT.config = extend({
    atServer: "cdn.tt.omtrdc.net",
    atLocation: "/cdn",
    trackingTimeout: 500,
    loadSizzle: true,
    debug: false,
    minified: false,
    pollDOM: true,
    pollTime: 50,
    cdqConnectTimeout: 50,
    fallbackTimeOut: 3000,
    tryAfterLoadMaxCount: (15 * 60 * 1000) / 50,
    numAttmptsToPreventFlicker: 8
  }, _AT.config);
  var lastActions = null;
  var minStr = _AT.config.minified ? ".min" : "";
  _AT.shouldDelayLoad = false;
  _AT.pollingIntervalId = null;
  _AT.actions = [];
  var admin = ~window.location.toString().indexOf("_AT_Admin=1");
  var debugWindow = ~window.location.search.indexOf("_AT_Debug=window");
  var debugConsole = ~window.location.search.indexOf("_AT_Debug=console");
  var getCurrentTime = _AT.getCurrentTime = function () {
    var d = new Date();
    return d.toString() + " " + d.getMilliseconds() + " ms"
  };
  _AT.config.debug = (debugConsole || debugWindow);
  if (debugWindow) {
    _AT.debugWindow = window.open("about:blank");
    _AT.debugWindowDocument = _AT.debugWindow.document;
    _AT.debugWindowDocument.write(_AT.getCurrentTime());
    _AT.debugWindowDocument.write("<hr/>")
  }
  if (!admin && typeof mboxFactoryDefault !== "undefined") {
    var redirectCookie = mboxFactoryDefault.getCookieManager().getCookie("at-redirect-offer");
    _AT.isRedirectedPage = false;
    if (redirectCookie !== null) {
      _AT.isRedirectedPage = (redirectCookie !== window.location.toString())
    }
    mboxFactoryDefault.getCookieManager().deleteCookie("at-redirect-offer")
  }
  (typeof window.Sizzle === "function" && typeof window.Sizzle.matches === "function" && typeof window.Sizzle.matchesSelector === "function") ? (_AT.querySelectorAll = Sizzle) : (_AT.querySelectorAll = document.querySelectorAll);
  function extend() {
    var target = {};
    for (var i = 0; i < arguments.length; i++) {
      var obj = arguments[i];
      for (var prop in obj) {
        target[prop] = obj[prop]
      }
    }
    return target
  }

  var querySelectorAll = function (selector) {
    if (_AT.querySelectorAll) {
      return _AT.querySelectorAll.call(document, selector)
    } else {
      error("No query selector engine available")
    }
  };
  var onReady = _AT.onReady = function (fn) {
    var doc = window.document;
    if (doc.readyState === "complete") {
      fn.call(window, "lazy");
      return
    }
    var done = false;
    var top = true;
    var root = doc.documentElement;
    var add, rem, pre;
    if (doc.addEventListener) {
      add = "addEventListener";
      rem = "removeEventListener";
      pre = ""
    } else {
      add = "attachEvent";
      rem = "detachEvent";
      pre = "on"
    }
    var init = function (e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return
      }
      (e.type === "load" ? window : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        fn.call(window, e.type || e)
      }
    };
    var poll = function () {
      try {
        root.doScroll("left")
      } catch (e) {
        setTimeout(poll, 50);
        return
      }
      init("poll")
    };
    if (doc.createEventObject && root.doScroll) {
      try {
        top = !window.frameElement
      } catch (e) {
      }
      if (top) {
        poll()
      }
    }
    doc[add](pre + "DOMContentLoaded", init, false);
    doc[add](pre + "readystatechange", init, false);
    window[add](pre + "load", init, false)
  };
  var addListener = _AT.addListener = function (el, type, handler) {
    var eventHandler = handler;
    if (el.attachEvent) {
      eventHandler = function () {
        handler.call(el, window.event)
      };
      el.attachEvent("on" + type, handler)
    } else {
      if (el.addEventListener) {
        el.addEventListener(type, eventHandler, false)
      }
    }
    return eventHandler
  };
  var removeListener = _AT.removeListener = function (el, type, fn) {
    if (el.detachEvent) {
      el.detachEvent("on" + type, fn)
    } else {
      el.removeEventListener(type, fn, false)
    }
  };
  var stopEvent = _AT.stopEvent = function (evt) {
    if (evt.preventDefault) {
      evt.preventDefault()
    } else {
      evt.returnValue = false
    }
    return false
  };

  function htmlEntities(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }

  var log = _AT.log = function () {
    var args = Array.prototype.slice.call(arguments), index, prepend = false, tempDiv, DOCUMENT_FRAGMENT_NODE = 11;
    if (_AT.config.debug) {
      if (typeof args[0] === "string") {
        args[0] = "AT: " + args[0]
      }
      args[args.length] = "| Executed at " + getCurrentTime();
      if ((typeof args[0] === "object") && (typeof args[0].options === "object")) {
        if (debugWindow) {
          if (args[0].options.prepend === true) {
            prepend = true
          }
          if (args[0].options.style === "error") {
            args.splice(1, 0, "<div style='color: red'>");
            args.push("</div>")
          }
        }
        args.shift()
      }
      if (debugWindow) {
        for (index = 0; index < args.length; index += 1) {
          if (args[index].nodeType === DOCUMENT_FRAGMENT_NODE) {
            tempDiv = document.createElement("div");
            tempDiv.appendChild(args[index]);
            args[index] = tempDiv
          }
          if (args[index] && args[index].outerHTML) {
            args[index] = htmlEntities(args[index].outerHTML)
          }
          if (typeof args[index] == "object") {
            args[index] = "<pre>" + htmlEntities(JSON.stringify(args[index], null, "  ")) + "</pre>"
          }
        }
        if (prepend) {
          tempDiv = _AT.debugWindowDocument.createElement("div");
          tempDiv.innerHTML = args.join(" ") + "<hr/>";
          _AT.debugWindowDocument.body.insertBefore(tempDiv, _AT.debugWindowDocument.body.childNodes[2])
        } else {
          _AT.debugWindowDocument.write(args.join(" ") + "<hr/>")
        }
        return
      }
      if (typeof console !== "undefined") {
        console.log.apply(console, args)
      }
    }
  };
  var error = _AT.error = function () {
    if (typeof console !== "undefined") {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === "string") {
        args[0] = "AT: " + args[0]
      }
      console.error.apply(console, args)
    }
  };

  function applyAction(action, supressDebug) {
    var type = action.action, initialHeight, imageSrc, initialWidth;
    action.numAttempts++;
    if (type === "trackLoad") {
      trackLoad(action.mboxName);
      return
    }
    var elems = querySelectorAll(action.selector);
    if (elems && elems.length === 1) {
      if (!supressDebug) {
        log("Will " + type + " on " + elems.length + " elements")
      }
      for (var i = 0, n = elems.length, elem; i < n; i++) {
        elem = elems[i];
        if (type === "setContent") {
          log("Setting content to ", getFragment(action.content), "on", elem);
          elem.innerHTML = action.content;
          if (action.recsClickTrackId) {
            elem.children[0].id = action.recsClickTrackId
          }
          executeScript(elem)
        } else {
          if (type === "remove") {
            log("Removing ", elem);
            if (elem.parentNode) {
              elem.parentNode.removeChild(elem)
            }
          } else {
            if (type === "setAttribute") {
              log("Setting attribute", action.attribute, "to", action.value, "on", elem);
              if (actionIsToChangeImageSrc(action)) {
                hideImageUntilIsLoaded({element: elem, src: action.value});
                return true
              }
              elem.setAttribute(action.attribute, action.value)
            } else {
              if (type === "setStyle") {
                log("Setting style", action.property, "to", action.value, "on", elem);
                elem.style[action.property] = action.value
              } else {
                if (type === "trackSubmit") {
                  log("Adding submit tracker on", elem, "with mbox", action.mboxName);
                  addSubmitTracker(elem, action.mboxName)
                } else {
                  if (type === "trackClick") {
                    log("Adding click tracker on", elem, "with selector", action.selector);
                    addClickTracker(elem, action)
                  } else {
                    if (type === "rearrange") {
                      log("Rearraning item from", action.from, "to", action.to, "in", elem);
                      return rearrange(action, elem)
                    } else {
                      if (type === "resize") {
                        log("Resizing item", elem);
                        resize(action, elem)
                      } else {
                        if (type === "move") {
                          log("Moving element", elem, "top:", action.finalTopPosition, "left:", action.finalLeftPosition);
                          move(action, elem)
                        } else {
                          if (type === "insertBefore" || type === "insertAfter") {
                            log("Inserting ", (type === "insertBefore" ? "before " : "after "), getFragment(action.content), "to element ", elem);
                            insertElement(action, elem)
                          } else {
                            if (type === "prependContent") {
                              log("Prepending content ", action.content, "to element ", elem);
                              elem.insertBefore(getFragment(action.content), elem.firstChild)
                            } else {
                              if (type === "redirect") {
                                if (!_AT.isRedirectedPage && typeof mboxFactoryDefault !== "undefined") {
                                  mboxFactoryDefault.getCookieManager().setCookie("at-redirect-offer", window.location.toString(), 30);
                                  log("Redirecting page to ", action.url, action.includeAllUrlParameters ? "with query parameters" : "without query parameters", action.passMboxSession ? "with mbox session" : "without mbox session");
                                  redirectPage(action, elem)
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return elems.length
    } else {
      if (!supressDebug) {
        log("Skipping " + type + ", No element or More than 1 elements matched: " + action.selector)
      }
    }
  }

  var executeScript = function (element) {
    var scripts = element.getElementsByTagName("script"), index, scriptSrc, async;
    for (index = 0; index < scripts.length; index += 1) {
      scriptSrc = scripts[index].src;
      async = scripts[index].getAttribute("async");
      try {
        if (scriptSrc) {
          (async === "false") ? loadScriptSynchronously(scriptSrc) : loadScript(scriptSrc)
        } else {
          eval(scripts[index].innerHTML)
        }
      } catch (exception) {
        log("Error occurred executing script: ", scripts[index], exception.message)
      }
    }
  };
  var actionIsToChangeImageSrc = function (actionJson) {
    return actionJson.action == "setAttribute" && actionJson.attribute == "src"
  };
  var preloadImage = function (actionJson) {
    var cacheImage = document.createElement("img");
    cacheImage.src = actionJson.value
  };

  function hideImageUntilIsLoaded(imageObj) {
    var image = imageObj.element, hasClass = (" " + image.className + " ").indexOf(" mboxDefault ") > -1;
    if (!hasClass) {
      image.className += " mboxDefault"
    }
    image.onload = function () {
      removeClassName(image, "mboxDefault");
      image.onload = ""
    };
    image.src = imageObj.src
  }

  var removeClassName = function (elem, className) {
    if (elem) {
      elem.className = elem.className.replace(new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)", "g"), "")
    }
  };
  var applyActions = _AT.applyActions = function (actions, removeWhenApplied) {
    if (actions && actions.length) {
      lastActions = removeWhenApplied ? [] : actions;
      for (var i = 0, ni = actions.length; i < ni; i++) {
        var applied = applyAction(actions[i], removeWhenApplied);
        if (applied) {
          showElementForAction(actions[i])
        }
        if (actions[i].numAttempts >= _AT.config.numAttmptsToPreventFlicker) {
          log("Allowed Unsuccessful Polling Attempts reached - Showing element: ", actions[i]);
          showElementForAction(actions[i])
        }
        if (removeWhenApplied && applied) {
          lastActions.push(actions[i]);
          actions.splice(i, 1);
          i--;
          ni--
        }
      }
    } else {
      log("No actions found")
    }
  };
  var prepareBeforeApplyingActions = function (actions) {
    var index, actionJson, selector;
    log("Prepare Stage - Hiding Elements before applying actions: ", actions);
    for (index = 0; index <= (actions.length - 1); index++) {
      actionJson = actions[index];
      actionJson.numAttempts = 0;
      selector = actionJson.selector;
      if (actionIsToChangeImageSrc(actionJson)) {
        preloadImage(actionJson)
      }
      if (selector.indexOf("CLKTRK#") === 0) {
        var firstSpaceIndex = selector.indexOf(" "), clickTrackId;
        clickTrackId = selector.substring(7, firstSpaceIndex);
        actionJson.selector = selector.substring(firstSpaceIndex + 1);
        actionJson.recsClickTrackId = clickTrackId;
        actions.push({action: "trackClick", selector: "#" + clickTrackId})
      }
      if (actions[index].action !== "trackClick") {
        hideElementBeforeApplyingAction(actionJson)
      }
    }
  };
  var applyWhenReady = _AT.applyWhenReady = function (actions) {
    prepareBeforeApplyingActions(actions);
    if (_AT.config.pollDOM) {
      applyWithPolling(actions)
    } else {
      applyOnDOMReady(actions)
    }
  };
  var applyWithPolling = _AT.applyWithPolling = function (actions) {
    log("Preparing to apply " + actions.length + " actions with polling...");
    log("Actions to be applied :", actions);
    var doApply = function () {
      if (_AT.actions.length) {
        applyActions(_AT.actions, true)
      } else {
        clearPolling()
      }
      log(_AT.actions.length + " actions remaining")
    };
    _AT.actions = _AT.actions.concat(actions);
    if (!_AT.pollingIntervalId) {
      _AT.pollingIntervalId = setInterval(doApply, _AT.config.pollTime);
      onReady(function () {
        clearPolling();
        if (_AT.actions.length) {
          applyActions(_AT.actions, true)
        }
        showAllHiddenElements(_AT.actions);
        applyRemainingActionsWithCounter(_AT.actions)
      })
    }
  };
  var clearPolling = function () {
    clearInterval(_AT.pollingIntervalId);
    _AT.pollingIntervalId = null
  };
  var applyRemainingActionsWithCounter = function (actions) {
    var counter = 0, applyRemainingActionsInterval, logErrorConfig = {
      options: {
        style: "error",
        prepend: true
      }
    }, applyRemainingActions = function () {
      if (actions.length && counter < _AT.config.tryAfterLoadMaxCount) {
        applyActions(actions, true)
      } else {
        clearInterval(applyRemainingActionsInterval);
        if (actions.length) {
          log(logErrorConfig, "Could not apply actions: ", actions);
          log(logErrorConfig, actions.length + " actions not applied after DOM load and polling!")
        }
      }
      counter += 1
    };
    if (actions.length) {
      applyRemainingActionsInterval = setInterval(applyRemainingActions, _AT.config.pollTime);
      return
    }
  };
  var applyOnDOMReady = _AT.applyOnDOMReady = function (actions) {
    log("Waiting to apply " + actions.length + " actions until DOM ready...");
    onReady(function () {
      applyActions(actions, true);
      applyRemainingActionsWithCounter(actions)
    })
  };
  var reapply = _AT.reapply = function () {
    applyActions(lastActions)
  };
  var getGlobalMboxName = _AT.getGlobalMboxName = function () {
    if (typeof TNT !== "undefined" && typeof TNT.getGlobalMboxName === "function") {
      return TNT.getGlobalMboxName()
    }
    return "target-global-mbox"
  };
  var trackClick = _AT.trackClick = function (selector, parameters) {
    var trackingUrl = getTrackingUrl(selector, parameters), onBeforeUnloadHandler = function () {
      var request = new XMLHttpRequest();
      request.open("GET", trackingUrl, false);
      request.send()
    };
    addListener(window, "beforeunload", onBeforeUnloadHandler);
    setTimeout(function () {
      var element = document.createElement("img");
      element.height = 1;
      element.width = 1;
      element.src = trackingUrl;
      removeListener(window, "beforeunload", onBeforeUnloadHandler)
    }, _AT.config.trackingTimeout)
  };
  var getTrackingUrl = function (selector, parameters) {
    var factory, mboxName, urlBuilder;
    if (!selector) {
      log("Can't track click, no mbox name provided");
      return
    }
    factory = mboxFactories.get("default");
    mboxName = getGlobalMboxName();
    if (!factory.isEnabled()) {
      log("Won't track click for " + mboxName + ", default mbox is disabled");
      return
    }
    parameters = parameters || [];
    parameters.push("mbox=" + mboxName + "-clicked");
    urlBuilder = factory.getUrlBuilder();
    urlBuilder.addParameters(parameters);
    urlBuilder.setServerType("ajax");
    return urlBuilder.buildUrl()
  };
  var trackLoad = function (mboxName) {
    trackClick(mboxName)
  };
  var addSubmitTracker = function (elem, mboxName) {
    if (elem.tagName !== "FORM") {
      log("Can't add submit tracking, element is not a form tag");
      return
    }
    var handler = function (evt) {
      trackClick(mboxName, function () {
        removeListener(elem, "submit", handler);
        elem.submit()
      });
      return stopEvent(evt)
    };
    addListener(elem, "submit", handler);
    return false
  };
  var addClickTracker = function (elem, action) {
    var selector = action.selector, clickTrackId = action.clickTrackId, params, handler;
    if (clickTrackId) {
      params = ["clickTrackId=" + clickTrackId]
    } else {
      params = ["target-click-url=" + selector]
    }
    handler = function () {
      removeListener(elem, "click", handler);
      trackClick(selector, params)
    };
    addListener(elem, "click", handler);
    return false
  };
  var addInclude = function (el) {
    var parent = (document.getElementsByTagName("head") || document.getElementsByTagName("body"))[0];
    parent.appendChild(el)
  };
  var getNextElementSibling = function (element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling
    }
    do {
      element = element.nextSibling
    } while (element && element.nodeType !== 1);
    return element
  };
  var getPreviousElementSibling = function (element) {
    if (element.previousElementSibling) {
      return element.previousElementSibling
    }
    do {
      element = element.previousSibling
    } while (element && element.nodeType !== 1);
    return element
  };
  var rearrange = function (actionjson, elem) {
    var containerElement = elem, draggedElement, droppedPositionElement, fromIndex = actionjson.from, toIndex = actionjson.to, childElements = containerElement.children, childElementsLength = childElements.length, newChildElements = [], index;
    for (index = 0; index < childElementsLength; index++) {
      if (childElements[index].nodeType !== 8) {
        newChildElements.push(childElements[index])
      }
    }
    draggedElement = newChildElements[fromIndex];
    droppedPositionElement = newChildElements[toIndex];
    if (fromIndex < toIndex) {
      droppedPositionElement = getNextElementSibling(droppedPositionElement)
    }
    try {
      if (droppedPositionElement) {
        containerElement.insertBefore(draggedElement, droppedPositionElement)
      } else {
        containerElement.appendChild(draggedElement)
      }
    } catch (e) {
      return false
    }
    return true
  };
  var resize = function (actionjson, elem) {
    var resizedElement = elem;
    resizedElement.style.height = actionjson.finalHeight;
    resizedElement.style.width = actionjson.finalWidth
  };
  var move = function (actionjson, elem) {
    var movedElement = elem;
    if (actionjson.position) {
      movedElement.style.position = actionjson.position
    }
    movedElement.style.left = actionjson.finalLeftPosition + "px";
    movedElement.style.top = actionjson.finalTopPosition + "px"
  };
  var insertElement = function (actionJson, elem) {
    var content = actionJson.content, wrapperElement = document.createElement("div"), isInsertBefore = actionJson.action === "insertBefore", refElement = (isInsertBefore ? elem : getNextElementSibling(elem));
    if (typeof actionJson.asset !== "undefined") {
      content = '<img src="' + actionJson.value + '"></img>'
    }
    elem.parentNode.insertBefore(getFragment(content), refElement);
    if (actionJson.recsClickTrackId) {
      (isInsertBefore ? getPreviousElementSibling(elem) : getNextElementSibling(elem)).id = actionJson.recsClickTrackId
    }
    wrapperElement.appendChild(getFragment(content));
    executeScript(wrapperElement)
  };
  var redirectPage = function (action, elem) {
    var searchString = window.location.search, redirectUrl = action.url;
    if (action.includeAllUrlParameters) {
      redirectUrl = addParametersToURL(redirectUrl, searchString.substring(1))
    }
    if (action.passMboxSession) {
      redirectUrl = addParametersToURL(redirectUrl, "mboxSession=" + mboxFactoryDefault.getSessionId().getId())
    }
    elem.style.display = "none";
    window.location.replace(redirectUrl)
  };
  var addParametersToURL = _AT.addParametersToURL = function (url, params) {
    var urlParts = url.split("#"), urlWithoutHash = urlParts[0], urlHash = urlParts[1];
    if (params && !~urlWithoutHash.indexOf(params)) {
      if (~urlWithoutHash.indexOf("?")) {
        urlWithoutHash += "&" + params
      } else {
        urlWithoutHash += "?" + params
      }
    }
    return urlHash ? urlWithoutHash + "#" + urlHash : urlWithoutHash
  };
  var getFragment = function (content) {
    var container = document.createElement("div"), fragment = document.createDocumentFragment();
    container.innerHTML = content;
    for (var i = container.childNodes.length - 1; i >= 0; i--) {
      fragment.insertBefore(container.childNodes[i], fragment.firstChild)
    }
    return fragment
  };
  var appendStyle = function (cssRule, id) {
    var head = document.getElementsByTagName("head")[0], style = document.createElement("style");
    style.type = "text/css";
    style.id = id;
    if (style.styleSheet) {
      style.styleSheet.cssText = cssRule
    } else {
      style.appendChild(document.createTextNode(cssRule))
    }
    head.appendChild(style);
    return style
  };
  var removeElement = function (element) {
    return (element && element.parentNode && element.parentNode.removeChild(element))
  };
  var generateIdFromSelector = function (selector) {
    var id = selector;
    id = id.replace("#", "AT_");
    id = id.replace("HTML", "AT_");
    id = id.replace(/[\s()>]/g, "");
    id = id.replace(/[.:]/g, "_");
    return id
  };
  var hideElementBeforeApplyingAction = function (actionJson) {
    var cssSelector = actionJson.cssSelector, styleTagId, cssRule;
    cssSelector = cssSelector || (actionJson.selector.indexOf("eq") === -1 ? actionJson.selector : "");
    if (cssSelector) {
      styleTagId = generateIdFromSelector(actionJson.selector);
      cssRule = cssSelector + " { visibility: hidden }";
      if (!document.getElementById(styleTagId)) {
        appendStyle(cssRule, styleTagId)
      }
    }
  };
  var showAllHiddenElements = function (actions) {
    for (var index = actions.length - 1; index >= 0; index--) {
      showElementForAction(actions[index])
    }
  };
  var showElementForAction = function (actionJson) {
    var styleTagId = generateIdFromSelector(actionJson.selector), styleElement = document.getElementById(styleTagId);
    removeElement(styleElement)
  };
  var loadScriptSynchronously = function (scriptURL) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    try {
      script.text = getSyncScriptContent(scriptURL);
      addInclude(script)
    } catch (exception) {
      throw exception
    }
  };
  var getSyncScriptContent = function (url) {
    var request = new XMLHttpRequest(), type;
    request.open("GET", url, false);
    request.send(null);
    if (request.status !== 200) {
      throw new Error(request.statusText)
    }
    type = request.getResponseHeader("Content-Type");
    if (type && !type.match(/javascript/)) {
      throw new Error("Expected JavaScript content type, Got: " + type)
    }
    return request.responseText
  };
  var loadScript = function (scriptURL, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptURL;
    if (typeof callback === "function") {
      script.onload = callback
    }
    addInclude(script)
  };
  var loadATScript = function (url, callback) {
    loadScript("//" + _AT.config.atServer + _AT.config.atLocation + url + minStr + ".js", callback)
  };
  var loadCSS = function (cssURL, callback) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = cssURL;
    if (typeof callback === "function") {
      link.onload = callback
    }
    addInclude(link)
  };
  var loadATCSS = function (url, callback) {
    loadCSS("//" + _AT.config.atServer + _AT.config.atLocation + url + minStr + ".css", callback)
  };
  var setDebug = _AT.setDebug = function (_debug) {
    _AT.config.debug = !!_debug
  };
  var connectToCDQ = function (evt) {
    log("trying to connect");
    if (!_AT.shouldDelayLoad) {
      log("Dependencies loaded!");
      cdq.host.connect(evt);
      clearTimeout(_AT.cdqConnectTimeoutId)
    } else {
      _AT.cdqConnectTimeoutId = setTimeout(connectToCDQ, _AT.config.cdqConnectTimeout)
    }
  };
  var connectToCDQAction = function () {
    connectToCDQ(_AT.connectEvent);
    removeListener(window, "message", loadCDQLibs)
  };
  var loadHTML2Canvas = function () {
    loadATScript("/adobetarget/html2canvas", connectToCDQAction)
  };
  var loadAdminScript = function () {
    loadATScript("/adobetarget/admin", loadHTML2Canvas)
  };
  var loadCDQHostScript = function () {
    loadATScript("/cdq.Host", loadAdminScript)
  };
  var loadCDQBaseScript = function () {
    loadATScript("/cdq.Base", loadCDQHostScript)
  };
  var loadJqueryUI = function () {
    loadATScript("/jquery-ui-1.10.3", loadCDQBaseScript)
  };
  var loadCDQLibs = function (evt) {
    if (typeof evt.data !== "string") {
      return
    }
    try {
      message = (_AT.JSON || JSON).parse(evt.data)
    } catch (err) {
      log("Invalid JSON in message data, ignored");
      return
    }
    if (message.action === "targetjsHandShakeAck") {
      processHandShakeAcknowledgment(message.config)
    }
    if (message.action === "connect") {
      loadATCSS("/adobetarget/admin");
      _AT.connectEvent = {};
      _AT.cdqConfig = {};
      for (var key in evt) {
        _AT.connectEvent[key] = evt[key]
      }
      for (var key in message.config) {
        _AT.cdqConfig[key] = message.config[key]
      }
      loadATScript("/jquery-1.10.2", loadJqueryUI)
    }
  };
  if (typeof _AT.eventListenerAdded == "undefined") {
    addListener(window, "message", loadCDQLibs);
    _AT.eventListenerAdded = true
  }
  if (admin) {
    if (typeof mboxCreate == "function") {
      var mboxToLoad = 0, __mboxCreate;
      __mboxCreate = mboxCreate;
      mboxCreate = function (name) {
        var mbox = __mboxCreate.apply(undefined, arguments);
        if (mbox) {
          _AT.shouldDelayLoad = true;
          mboxToLoad++;
          mbox.setOnLoad(function () {
            var target, mbox;
            mboxToLoad--;
            mbox = mboxFactoryDefault.get(name);
            if (mbox) {
              target = mbox.getDiv()
            }
            if (target) {
              target.setAttribute("data-mboxName", name);
              if (!~target.className.indexOf("mboxDefault")) {
                target.className += " mboxDefault"
              }
            }
            if (mboxToLoad === 0) {
              _AT.shouldDelayLoad = false
            }
          })
        }
      }
    }
    var frame = document.createElement("iframe");
    addListener(frame, "load", function () {
      if (_AT.JSON) {
        return
      }
      _AT.JSON = frame.contentWindow.JSON;
      document.head.removeChild(frame)
    });
    frame.style.display = "none";
    if (document.domain !== window.location.host) {
      frame.src = "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\"" + document.domain + "\\\";<\\\\/script>\\');document.close();};<\/script>'"
    }
    document.head.appendChild(frame)
  }
  var processHandShakeAcknowledgment = function (config) {
    if (config.updatePageURL) {
      window.location.href = config.pageURL
    }
  };
  if (window != top) {
    var jsonParser = _AT.JSON || JSON;
    if (typeof jsonParser !== "undefined") {
      window.parent.postMessage(jsonParser.stringify({
        action: "targetjsHandShake",
        pageURL: window.location.toString(),
        isAdmin: admin
      }), "*")
    }
  }
  _AT.targetJSLoaded = true
}());
(function () {
  if (typeof mboxVersion != "undefined" && mboxVersion < 47) {
    var b = mboxVizTargetUrl("target-global-mbox");
    if (b) {
      var a = '<script src="' + b + '"><\/script>';
      document.write(a)
    }
  }
})();
