# First Semester CS Assessments

Two Cambridge IGCSE / O Level Computer Science assessments, published with
GitHub Pages from the `gh-pages` branch.

| | |
|---|---|
| **Theory paper** — 100 MCQs | https://cred3cards-svg.github.io/studio/ |
| **Programming task** — write a full program | https://cred3cards-svg.github.io/studio/code/ |

Neither shows the candidate a mark, a tick, or a correct answer.

---

## Theory paper

100 multiple-choice questions (Chapter 7 to 7.5, Chapter 8 to 8.2), taken from
the first-semester question paper.

## How it works

- `index.html` is the whole thing — one self-contained file, no build step, no server.
- Option order is shuffled per attempt. In the source paper the keyed answer was
  option A on all 100 questions, so a fixed order would not have tested anything.
- Nothing is marked on screen. No score, no ticks, no correct answers, at any point.
- Progress is saved in the browser, so the paper can be closed and resumed.
- On submit the candidate gets a **result code**: their answers, base64-encoded.

The question bank is XOR-obfuscated in the page so the answers are not readable
from View Source. That is obfuscation, not security — any client-side quiz ships
its answers to the browser, and a determined reader can recover them.

## Marking a result code

```sh
node quiz/mark.js <resultCode>
```

Prints the score and grade, a topic breakdown weakest-first, and every missed
question with its correct answer. It reads the bank out of `index.html`, so there
is no plaintext answer key anywhere in this repository.


---

## Programming task

The 0478/22/F/M/17 pre-release scenario: reaction times for 650 students aged
12-16 in houses Saturn and Mars, across three tasks (arrays and validated input,
house averages, statistics filtered by age and house).

- `code/index.html` runs real Python in the browser via Pyodide, loaded from a CDN
  on first run. The candidate writes the whole program and runs it against their
  own test inputs, seeing Python's genuine error messages.
- **Pasting into the editor is blocked** and paste attempts are counted in the
  submission, so the program has to be typed.
- `input()` is fed from the Inputs box, `stdout` is captured, and a statement
  counter stops runaway loops rather than hanging the phone.
- On submit the page records the program, an AST analysis (lists, loops,
  branches, built-ins, identifier names, comments) and the result of a final run.

### Marking a programming submission

```sh
node quiz/mark-code.js <resultCode>
```

Prints the automated checks and the numbered source. Syntax and runtime errors
are decided by Python itself; logic is graded by reading the program.
