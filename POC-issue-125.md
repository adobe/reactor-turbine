# POC: deferred data-element evaluation (issue #125)

**Status: proof-of-concept for discussion — NOT a merge-ready fix.**

## The problem (from #125)

Turbine resolves `%data element%` tokens **eagerly**, at the moment a delegate
module runs (`createExecuteDelegateModule.js` → `replaceTokens(moduleSettings)`,
and `createGetExtensionSettings.js` → `replaceTokens(settings)`). When a *dynamic*
data element (e.g. Core > Random Number) is used in an **extension/component
configuration**, its value is frozen to whatever it was when that configuration
module first ran — not when the action (e.g. an Analytics beacon) actually fires.
The Launch author expects the value to be evaluated at fire-time.

## What this POC changes

A single, self-contained change in `src/createReplaceTokens.js`: a token may opt
**out** of eager evaluation by prefixing its name with `~`.

| Input token   | Behavior                                                        |
| ------------- | -------------------------------------------------------------- |
| `%foo%`       | unchanged — resolved eagerly, exactly as today                 |
| `%~foo%`      | emitted as the still-unresolved token `%foo%` (one `~` stripped) |

The delegate module then receives the literal `%foo%` in its settings and can
resolve it *itself*, at the real action-time, via `turbine.replaceTokens(...)`.
Calling `replaceTokens` again on the emitted `%foo%` resolves it normally, so
"defer once, resolve later" composes cleanly (verified by the added unit tests).

Verified locally against the real module:

```
PASS | eager single token          | %foo%              -> value-of-foo
PASS | eager inline                 | a %foo% b          -> a value-of-foo b
PASS | deferred single -> unresolved| %~foo%             -> %foo%
PASS | deferred inline mixed        | %~foo% and %bar%   -> %foo% and value-of-bar
PASS | pass1 defers                 | %~random number%   -> %random number%
PASS | pass2 resolves               | %random number%    -> value-of-random number
```

## Why this is a POC and not the whole fix

The #125 discussion asks for a **component-level "Evaluate data element at
runtime" setting**. That is a platform feature that turbine alone cannot deliver:

1. **No component-level settings exist for extensions** — the flag has to be
   modeled and stored somewhere the extension SDK and Launch UI can expose it.
2. **Extensions must cooperate** — each extension has to actually call
   `turbine.replaceTokens` at action-time on the fields it wants to defer. This
   POC only provides the turbine-side capability; it does not make any extension
   use it.
3. **Token-syntax choice is provisional** — `~` is convenient for a POC but the
   escape/marker (and its interaction with data-element names that could
   legitimately start with `~`) needs a design decision by the maintainers.
4. **Docs / backward-compat** — the "single token returns raw value" contract and
   the developer docs on token replacement would need updating.

In other words: this demonstrates a *mechanism* the feature could build on, and
gives the maintainers something concrete to react to — it is not a drive-by
implementation of the feature. It intentionally has **not** been opened as a PR
against `adobe/reactor-turbine`.
