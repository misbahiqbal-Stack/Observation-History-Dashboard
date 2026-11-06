# Voiceover Script — Observation History Dashboard walkthrough

**Teaching style.** Explains *why*, not just *what's on screen*. Written to be read aloud.

**Assumed footage:** a screen recording of the app — login, the dashboards, the Ask tool.
Sections are independent, so cut any that don't match your footage.

**Delivery notes**
- Target pace is ~140 words/minute. Each section shows its spoken length at that pace.
- `[BRACKETS]` are stage directions — don't read them aloud.
- Em-dashes mark a breath. Short sentences are deliberate; resist smoothing them together.
- Read the questions as real questions, with a beat of silence after. That beat is what makes
  it feel like teaching rather than narrating.

> ⚠️ **Before you record:** the app's real credentials will be visible on screen when you log in,
> and `.env` values appear if you open that file on camera. Either change them to throwaway
> values for the recording, or blur those frames in the edit.

---

## 1 · Cold open (~25s)

> [FOOTAGE: the login screen, static]
>
> This is a classroom observation dashboard. Coaches visit teachers, score them against four
> indicators, and this is where that data turns into something you can actually read.
>
> But I don't want to just show you the features. I want to show you *how it's put together* —
> because the interesting part isn't the charts. It's what sits behind them.
>
> Let's start where every user starts. The login screen.

---

## 2 · The login — and why it exists (~70s)

> [FOOTAGE: typing username, then password, then Sign in]
>
> Username, password. Nothing unusual to look at. The question worth asking is: where do those
> credentials actually live?
>
> The naive answer is "in the code." And that's exactly what you want to avoid — because code
> goes into version control, and version control is forever. Commit a password once, and it's
> in the history even after you delete it.
>
> So instead, these come from **environment variables** — values handed to the program from
> outside it, when it starts. The code says "give me the password," and the environment answers.
> The code itself never knows what the answer is going to be.
>
> [FOOTAGE: optional — the .env.example file, NOT the real .env]
>
> That's the difference between these two files. `.env.example` is committed — it shows the
> *shape*, the list of names, with fake values. The real `.env` sits next to it, holds the real
> values, and is ignored by git so it never gets committed at all.
>
> One file documents what's needed. The other supplies it. Only one of them is ever shared.

---

## 3 · What the server does with a login attempt (~65s)

> [FOOTAGE: optional — deliberately type a wrong password, show the error]
>
> Watch the error message. "Incorrect username or password." Not "wrong password" — *either*.
>
> That vagueness is on purpose. If the app said "no such user" for a bad username, and
> "wrong password" for a bad password, it would be telling a stranger which usernames are real.
> That's a free hint you don't need to give away. One message for every failure means a guesser
> learns nothing.
>
> There's a subtler version of the same problem. If the server stopped checking the moment it
> saw a bad username, it would answer *faster* for a wrong username than a right one — and that
> timing difference is itself a hint. So it always checks both fields, every time, and compares
> them in a way that takes the same amount of time regardless.
>
> Small detail. But security is mostly small details that nobody notices when they're right.

---

## 4 · The dashboard (~80s)

> [FOOTAGE: dashboard after login — school view, then click into a teacher]
>
> Now we're in. This is the school view — every teacher at one school, with their average
> observation score and a trend arrow.
>
> The arrow is doing real work here. A single score tells you where a teacher is. The arrow
> tells you which direction they're *moving* — and for coaching, direction matters more than
> position. A teacher at sixty and climbing needs something very different from a teacher at
> seventy and sliding.
>
> [FOOTAGE: click a teacher]
>
> Click through, and you get that teacher's story over time. Six visits, September through
> February.
>
> Two things to notice. The lowest point on the line is marked in red — because when you're
> scanning twenty teachers, you want the weak spot to find *you*, not the other way round.
> And the dashed line is the school average, so you can always see whether a dip is this
> teacher struggling, or the whole school having a hard month. Context, not just a number.
>
> [FOOTAGE: click a visit tile]
>
> Each visit opens up too — what subject was observed, and the indicator breakdown for that day.

---

## 5 · The Ask tool (~55s)

> [FOOTAGE: the Ask page — type a question, click Ask, answer appears]
>
> Last piece. This is a question box wired to Claude.
>
> Type a question, press the button, and the answer comes back in the page. Simple enough. But
> there's one thing happening here that's worth slowing down for.
>
> The API key — the thing that costs money if someone steals it — is **never in this page.**
>
> When you click Ask, the browser doesn't call Claude. It calls *this* app's own server. The
> server adds the key and makes the real call, then passes back just the answer. The key never
> leaves the machine it's stored on.
>
> That's the rule worth taking away: anything secret belongs on the server. If a value reaches
> the browser, treat it as public — because anyone can open View Source and read it.

---

## 6 · Close (~30s)

> [FOOTAGE: back to the dashboard, or a static end frame]
>
> So — a dashboard, a login, and a question box. Three simple pieces.
>
> But the ideas underneath them travel: keep secrets out of your code, keep them out of the
> browser, and don't let your error messages volunteer information.
>
> None of that is visible on screen. That's rather the point.

---

**Total: ~5 min 40 s** at 140 wpm (791 spoken words).

**If you need a shorter cut:** sections 1, 2, 4 and 6 stand alone at about three minutes — drop
3 and 5, which are the deepest ones.
