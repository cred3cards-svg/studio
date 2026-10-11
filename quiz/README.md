# First Semester CS Paper

A 100-question Cambridge IGCSE / O Level Computer Science multiple-choice paper
(Chapter 7 to 7.5, Chapter 8 to 8.2), taken from the first-semester question paper.

Published with GitHub Pages from the `gh-pages` branch:
**https://cred3cards-svg.github.io/studio/**

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
