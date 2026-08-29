-- ============================================================
-- iRise Litigation Academy — Module 15
-- Parts 7 (Case Law Lab), 8 (Role Play), 9 (Appeals), 10 (Master Simulation)
-- ============================================================

-- ============================================================
-- MODULE 15 — PART 7: Case Law Laboratory
-- ============================================================

INSERT INTO public.modules (id, course_id, title, summary, order_index, is_published)
VALUES (
  'm1507000-0000-0000-0000-000000000007',
  'c1500000-0000-0000-0000-000000000015',
  'Part 7 — Case Law Laboratory',
  'A searchable encyclopedia of real cases. How to read them, what they actually say, what lawyers cite them for, and the truth behind the "13 Supreme Court Cases" list.',
  1,
  true
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1507000-0000-0000-0000-000000000007',
  'Lesson 7.1 — How to Read a Case: The Brief and the Reality',
  1, 'TEXT',
$$# Lesson 7.1 — How to Read a Case: The Brief and the Reality

**iRise Litigation Academy — Module 15**
*Prerequisites: Modules 13 and 14*

---

## The Most Important Skill in Legal Research

The internet is full of legal case summaries. Most of them are wrong — not because the summariser was dishonest, but because legal opinions are long, nuanced, and frequently misunderstood.

A case that "stands for" a proposition in a one-sentence internet summary often contains qualifications, dissenting opinions, subsequent treatment, and jurisdictional limitations that completely change what you can do with it.

This lesson teaches you how to read a real opinion, write a proper case brief, and avoid the most common mistakes in citing authority.

---

## Section 1 — Anatomy of a Legal Opinion

A published court opinion typically contains:

### Heading / Caption
- Court name
- Case name (parties)
- Reporter citation (e.g., 392 U.S. 1 (1968) — volume 392 of United States Reports, page 1, decided 1968)
- Date of decision

### Background / Procedural History
How the case reached this court. Understanding what happened below tells you what issue the court is actually deciding.

### Facts
The specific facts the court found relevant. Cases turn on facts. A case that came out one way on one set of facts may come out differently on slightly different facts.

### Issue(s)
The legal question the court is answering. Often stated explicitly: "The question before us is whether..."

### Holding
The court's answer to the issue. The holding is binding precedent. Everything else is dicta.

### Reasoning
Why the court reached this result. This is where you find the principles you can apply to new situations.

### Disposition
What happened to the case: affirmed, reversed, remanded.

### Concurrences and Dissents
Concurring justices agree with the result but for different reasons. Dissenting justices disagree. Dissents are not binding precedent — but they may foreshadow future changes in the law.

---

## Section 2 — Dicta vs. Holding

This distinction is critical.

**Holding**: The court's decision on the specific issue before it, applied to the specific facts of the case. Binding on lower courts within the jurisdiction (stare decisis).

**Obiter dicta** (dicta): Observations, hypotheticals, or broader statements in the opinion that go beyond what was necessary to decide the case. Not binding, but may be persuasive.

**Common error**: Citing a court's broad statement in dicta as if it were a holding. A court's hypothetical statement about what might happen in a different situation is not a precedent for that situation.

---

## Section 3 — The Case Brief Format

Every case you study should be briefed in this format:

```
CASE: [Name], [Citation], [Court], [Year]

FACTS:
[What happened — only the facts relevant to the issue]

PROCEDURAL HISTORY:
[What happened in the courts below and how the case got here]

ISSUE:
[The precise legal question before the court]

HOLDING:
[The court's answer to the issue — one or two sentences maximum]

REASONING:
[Why the court reached this holding — the key principles]

WHAT IT IS CITED FOR:
[The standard proposition for which this case is cited in practice]

COMMON MISUSE:
[How this case is frequently misrepresented or overextended]

LIMITATIONS:
[The facts that limit this holding; what it does not cover]

SUBSEQUENT TREATMENT:
[Has it been followed, distinguished, narrowed, or overruled?]
```

---

## Section 4 — The "13 Supreme Court Cases" List: A Critical Analysis

Circulated widely in legal self-help communities, this list claims that certain Supreme Court opinions establish specific propositions that can be used to defeat citations, avoid taxation, or challenge government authority.

Some cases on the list are real and cited correctly. Many are real cases cited for propositions they do not support. Some claimed quotations cannot be found in the actual opinion at all.

**iRise Academy's commitment**: We do not tell you what a case says. We show you the actual opinion and compare it to what is claimed.

**How to verify any case**:
1. Find the original opinion on **Google Scholar**, **Justia**, **CourtListener**, or **the official US Supreme Court website** (supremecourt.gov)
2. Read the actual text
3. Compare what is claimed to what the court actually said
4. Identify the issue the case actually decided and whether it applies to your situation

---

## Section 5 — Key Traffic Cases: The Real Briefings

### CASE 1: Terry v. Ohio, 392 U.S. 1 (1968)

**Facts**: An experienced police officer observed Terry and others repeatedly walking back and forth past a store in a manner consistent with casing the store for robbery. The officer stopped them and patted down their outer clothing, finding a concealed weapon.

**Issue**: Whether a police officer may conduct a brief investigatory stop and pat-down based on less than probable cause.

**Holding**: Yes. An officer may briefly detain a person for investigation if the officer has specific, articulable facts creating reasonable suspicion of criminal activity, and may conduct a limited pat-down for weapons if there is reasonable suspicion the person is armed and dangerous.

**What it is cited for**: Authority for the "Terry stop" — brief investigatory detention based on reasonable suspicion, the standard applied to traffic stops.

**Common misuse**: Claimed to support the proposition that any stop requires a warrant. This is backwards — *Terry* held that a warrant is not required for a brief investigatory stop.

**Limitations**: Reasonable suspicion must be based on specific, articulable facts — not a hunch. The scope of the stop must be limited to the purpose that justified it.

**Subsequent treatment**: Extensively applied. The automobile exception to *Terry* was confirmed in subsequent cases including *United States v. Cortez*, 449 U.S. 411 (1981).

---

### CASE 2: Mapp v. Ohio, 367 U.S. 643 (1961)

**Facts**: Cleveland police searched Mapp's home without a valid warrant, looking for a bombing suspect. They found obscene materials and prosecuted Mapp for possession.

**Issue**: Whether evidence obtained through an unconstitutional search by state police must be excluded in state criminal proceedings.

**Holding**: Yes. The exclusionary rule — which had applied to federal proceedings since *Weeks v. United States* (1914) — applies to state proceedings through the Fourteenth Amendment.

**What it is cited for**: The exclusionary rule; illegally obtained evidence must be suppressed.

**Common misuse**: Cited as if any police irregularity — even a minor procedural error — automatically requires exclusion of all evidence. The exclusionary rule has multiple exceptions (good faith, inevitable discovery, independent source, attenuation).

**Limitations**: The exclusionary rule is not a personal constitutional right — it is a judicial remedy designed to deter police misconduct. *United States v. Leon* (1984) created the good faith exception. Evidence that would have been inevitably discovered is not excluded under *Nix v. Williams* (1984).

---

### CASE 3: Miranda v. Arizona, 384 U.S. 436 (1966)

**Facts**: Miranda was arrested and questioned for two hours before confessing. He was not told of his right to counsel or his right to remain silent.

**Issue**: Whether statements obtained through custodial interrogation without prior warnings about the right to counsel and the right to silence are admissible.

**Holding**: No. Prior to custodial interrogation, police must warn suspects of their rights: to remain silent; that anything said can be used against them; to an attorney; to appointed counsel if they cannot afford one.

**What it is cited for**: The Miranda warning requirement; right to silence and counsel in custodial interrogation.

**Common misuse**: (1) Claimed that officers must read Miranda rights at every police encounter — Miranda applies only to custodial interrogation, not casual encounters or traffic stops. (2) Claimed that failure to give Miranda warnings "voids" the arrest — it does not; it may make statements inadmissible, but the arrest itself stands.

**Limitations**: *Berkemer v. McCarty* (1984) held that routine traffic stops are not custodial for Miranda purposes. *Salinas v. Texas* (2013) held that pre-arrest silence (before Miranda applies) is not necessarily protected by the Fifth Amendment.

---

### CASE 4: Whren v. United States, 517 U.S. 806 (1996)

**Facts**: In a high drug-crime area, undercover officers observed a vehicle stopped at a stop sign for an unusually long time, then speed off. Officers stopped the vehicle for traffic violations and observed crack cocaine.

**Issue**: Whether the Fourth Amendment prohibits police from stopping a vehicle based on a pretextual traffic violation if the real purpose is to investigate other crimes.

**Holding**: No. A traffic stop is valid under the Fourth Amendment as long as there is an objective basis for it — a traffic violation actually occurred. The officer's subjective intent is irrelevant.

**What it is cited for**: Pretext stops are constitutionally valid; officers can stop for a minor violation even if their real purpose is something else.

**Common misuse**: Claimed to mean officers can always invent a pretext. The stop still requires an actual traffic violation. *Whren* holds that the officer's motive doesn't matter — not that violations can be fabricated.

**Limitations**: The Equal Protection Clause remains available for racial profiling claims, even if the Fourth Amendment claim fails under *Whren*. Some state constitutions provide stronger protection than the federal Fourth Amendment.

---

### CASE 5: Rodriguez v. United States, 575 U.S. 348 (2015)

**Facts**: Officer stopped Rodriguez for a traffic violation, completed the citation, then continued to detain him for seven to eight minutes to wait for a drug-sniffing dog without independent reasonable suspicion.

**Issue**: Whether the Fourth Amendment allows police to extend a completed traffic stop to conduct a dog sniff.

**Holding**: No. A traffic stop seizure must be limited to the time reasonably necessary to address the traffic violation. Extending the stop beyond that point without independent reasonable suspicion violates the Fourth Amendment.

**What it is cited for**: Officers cannot extend traffic stops beyond the time reasonably necessary to complete the purpose of the stop without independent justification.

**Why this matters for your case**: If the officer delayed your stop unnecessarily — for example, waiting for a supervisor or running additional checks unrelated to the citation — *Rodriguez* is your authority.

---

*This Case Law Laboratory continues with additional cases in subsequent lessons.*

*See Lessons 7.2 — 7.5 for the complete case encyclopedia.*

---

## Morpheus Check-In — Socratic Mode

1. **Someone tells you that *Miranda v. Arizona* means the officer had to read you your rights when they stopped you for speeding, and failure to do so means the citation is void. How do you evaluate this claim? What does *Miranda* actually require?**

2. **An online guide says "*Terry v. Ohio* proves officers need a warrant to stop you." Brief *Terry* for yourself, then explain why this reading of the case is incorrect.**

3. **You find a case from the Ninth Circuit that supports your suppression argument. Your case is in a state court in California. What weight does this Ninth Circuit case have? Is it binding? Persuasive?**

4. **You find a quote attributed to a Supreme Court case online, but when you look up the actual opinion, you cannot find the quote. What should you do before citing it in a motion?**

---

*iRise Litigation Academy — Module 15. For educational purposes only.*
$$,
  false, true, 5400
);

-- ============================================================
-- MODULE 15 — PART 8: Role Play
-- ============================================================

INSERT INTO public.modules (id, course_id, title, summary, order_index, is_published)
VALUES (
  'm1508000-0000-0000-0000-000000000008',
  'c1500000-0000-0000-0000-000000000015',
  'Part 8 — Role Play: Every Seat in the Courtroom',
  'The student plays every role: officer, judge, attorney, witness, court clerk, juror, appellate judge. Learning by doing.',
  2,
  true
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1508000-0000-0000-0000-000000000008',
  'Lesson 8.1 — Role Play: You Are the Officer',
  1, 'TEXT',
$$# Lesson 8.1 — Role Play: You Are the Officer

**iRise Litigation Academy — Module 15**

---

## Why You Play Every Role

Elite advocates understand every perspective in the room. The lawyer who has never thought like a judge misses signals. The litigant who has never thought like an officer does not know what the officer is trained to observe and document.

This series puts you in every seat.

---

## You Are the Officer

**Scenario**: It is 7:45 AM on a weekday. You are stationed on Highway 101 in a marked patrol vehicle. You are operating a handheld LIDAR device. You observe a silver Toyota Camry in the right lane. Your LIDAR reads 78 mph. The posted speed limit is 65 mph.

You activate your emergency lights. The vehicle pulls over.

---

## Section 1 — What the Officer Must Document

As the officer in this scenario, your training requires you to document:

**Before the stop**:
- Your position (exact location, direction facing)
- How far you were from the target vehicle when you took the reading
- Whether the LIDAR beam was angled or perpendicular to the target
- Whether you performed the required pre-shift calibration and self-test of the device
- Weather and visibility conditions
- Traffic density

**During the stop**:
- The driver's licence, registration, and insurance information
- Driver's statements (voluntary, not in response to custodial interrogation)
- Driver's demeanour
- Anything visible in plain view
- Any unusual circumstances

**After the stop**:
- Complete your report accurately and promptly
- Submit calibration records as required by department policy
- Preserve body camera and dashcam footage by flagging the incident

---

## Section 2 — Cross-Examination Preparation

You have now written the officer's report. Now switch roles: you are the defendant's attorney, and you will cross-examine this officer.

**Read your own report as the defence attorney**. Ask:
- Where exactly were you positioned? Is there a sight line issue?
- Did you verify the LIDAR angle? LIDAR requires near-perpendicular angle; at a sharp angle, the reading may be inflated
- Did you perform the calibration self-test at the start of the shift? Do you have documentation?
- How many vehicles were on the road? Could the device have locked onto a different vehicle?
- Did any other vehicles pass between you and the defendant's vehicle?

**The insight**: Playing the officer's role teaches you what evidence they create and what weaknesses exist in that documentation. You learn to look for what is missing, not just what is present.

---

## Section 3 — Morpheus Role Play: You Are the Officer on the Stand

**Morpheus (as Defence Counsel)**: "Officer, you testified that you were operating your LIDAR device 'at a perpendicular angle' to the defendant's vehicle. Can you tell the court how you determined the angle was perpendicular?"

*[Answer as the officer. Morpheus will continue cross-examination based on your response.]*

---

*Next Role Play: 8.2 — You Are the Judge*

*iRise Litigation Academy — Module 15. For educational purposes only.*
$$,
  false, true, 3000
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1508000-0000-0000-0000-000000000008',
  'Lesson 8.2 — Role Play: You Are the Judge, Attorney & Juror',
  2, 'TEXT',
$$# Lesson 8.2 — Role Play: You Are the Judge, Attorney & Juror

**iRise Litigation Academy — Module 15**

---

## You Are the Judge

**Scenario**: You are presiding over the traffic case from Case Study 001. The defendant has filed a Motion to Suppress, arguing the stop lacked reasonable suspicion. The prosecution argues the officer's LIDAR reading is independently sufficient.

**Your task as the judge**:

Consider both sides' arguments and apply the legal standard: Did the officer have reasonable, articulable suspicion — or more precisely, probable cause based on the LIDAR reading — to initiate the stop?

**Morpheus (as defendant, arguing the motion)**: "Your Honour, the prosecution has not produced the pre-shift calibration test results. Without evidence that the device was working properly at the beginning of the officer's shift, there is no reliable foundation for the LIDAR reading."

**As the judge, rule on this argument**:
- What is the legal standard?
- What evidence would you need to deny the motion?
- What would you say from the bench?

**Then Morpheus responds as the prosecution and you rule again.**

---

## You Are the Defence Attorney

You have five minutes to prepare your opening statement for the traffic infraction hearing.

**Your case theory**: The LIDAR device was not properly calibrated, and the officer cannot prove it was functioning accurately on the date of the citation.

**Your task**: Write and deliver a two-minute opening statement that:
1. Tells a coherent story
2. States your theory of the case
3. Tells the judge exactly what you will prove
4. Does NOT argue — it is an opening, not a closing

**Morpheus (as judge) will interrupt with questions**: "Counsel, you say the device wasn't calibrated — do you have evidence of that, or is this merely an allegation?"

*[Answer. Morpheus continues from your response.]*

---

## You Are the Juror

After the simulated trial (which you can run fully in Module 15's Master Simulation), you deliberate as a juror.

**The evidence**:
- Officer testified to LIDAR reading of 78 mph
- Officer did not produce calibration records from that day (device is calibrated monthly; citation was issued mid-month)
- Defendant's dashcam shows speedometer reading of 67 mph
- Defendant testified they were going 67 mph
- Prosecution standard: preponderance of evidence

**As juror, answer**:
1. What convinced you — what evidence was most persuasive?
2. What lost credibility — what weakened the prosecution's case?
3. What is your verdict and why?

**Morpheus (as fellow juror)** may challenge your reasoning:
- "But the officer's word against the defendant's — why would the officer lie?"
- "The speedometer could be miscalibrated too."

*[Debate the verdict. This is how elite advocates understand what actually persuades fact-finders.]*

---

*iRise Litigation Academy — Module 15. For educational purposes only.*
$$,
  false, true, 3600
);

-- ============================================================
-- MODULE 15 — PART 9: Appeals
-- ============================================================

INSERT INTO public.modules (id, course_id, title, summary, order_index, is_published)
VALUES (
  'm1509000-0000-0000-0000-000000000009',
  'c1500000-0000-0000-0000-000000000015',
  'Part 9 — Appeals: Preserving Issues & Moving Up the Chain',
  'Issue preservation, record building, standards of review, harmless error, structural error, and brief writing for the appellate court.',
  3,
  true
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1509000-0000-0000-0000-000000000009',
  'Lesson 9.1 — Issue Preservation: The Golden Rule of Appellate Practice',
  1, 'TEXT',
$$# Lesson 9.1 — Issue Preservation: The Golden Rule of Appellate Practice

**iRise Litigation Academy — Module 15**

---

## The Rule That Determines Everything

The most important rule in appellate practice is not about brief-writing, not about oral argument, not about legal research.

It is this: **If you did not raise it below, you cannot raise it on appeal.**

This principle — issue preservation — determines what issues are available to you on appeal. An argument never made at the trial court level is an argument that is waived.

---

## Section 1 — What Preservation Means

To preserve an issue for appeal, you must:

1. **Raise it** — make the specific argument to the trial court
2. **Obtain a ruling** — the court must have had an opportunity to rule on it
3. **Object to adverse rulings** — if the court rules against you, you must note your objection on the record

### What "The Record" Is

The record on appeal consists of:
- The trial transcript (verbatim account of what was said in court)
- All exhibits admitted into evidence
- All motions filed and the court's rulings on them
- The judgment or verdict

The appellate court reviews the record. If your argument is not in the record, it does not exist on appeal.

---

## Section 2 — Forfeiture vs. Waiver

**Forfeiture**: You failed to raise an issue, but not intentionally. Courts may review forfeited issues for "plain error."

**Waiver**: You intentionally gave up the right to raise the issue. Waived issues typically receive no review on appeal.

### The Plain Error Doctrine

Even forfeited issues may be reviewed if:
1. There was an error
2. The error was plain (clear or obvious)
3. The error affected substantial rights
4. The error seriously affects the fairness, integrity, or public reputation of judicial proceedings

*United States v. Olano*, 507 U.S. 725 (1993)

Plain error review is the most difficult standard — courts rarely reverse on plain error alone. This is why preserving issues at trial matters so much.

---

## Section 3 — Standards of Review on Appeal

Different types of rulings receive different levels of deference on appeal.

| Type of Ruling | Standard of Review | Deference to Trial Court |
|----------------|-------------------|--------------------------|
| Questions of law | De novo | None — appellate court decides anew |
| Factual findings | Clear error | High — reversed only if "clearly erroneous" |
| Discretionary rulings | Abuse of discretion | Very high — reversed only if arbitrary |
| Constitutional issues | De novo (usually) | None |
| Fourth Amendment questions (mixed) | De novo (legal) + Clear error (factual) | Mixed |

**What this means for your traffic case**:
- Whether reasonable suspicion existed is a **mixed question of law and fact**: the officer's observations are reviewed for clear error; whether those observations constitute reasonable suspicion is reviewed de novo
- The trial court's evidentiary rulings (admitting or excluding evidence) are reviewed for abuse of discretion

---

## Section 4 — Harmless Error and Structural Error

### Harmless Error

Even if an error occurred at trial, the appellate court will not reverse if the error was "harmless" — i.e., it did not affect the outcome.

*Chapman v. California*, 386 U.S. 18 (1967): For constitutional errors, the prosecution must prove beyond a reasonable doubt that the error did not contribute to the verdict.

**Your argument on appeal**: Not only did the error occur, but it was not harmless — it contributed to the adverse ruling.

### Structural Error

A small category of errors that automatically require reversal, regardless of whether they actually affected the outcome:
- Denial of counsel at a critical stage
- Biased judge
- Denial of public trial
- Defective reasonable doubt instruction

Structural errors are rare but powerful — you need not show prejudice.

---

## Section 5 — Building the Record at Trial with Appeal in Mind

Elite trial lawyers try cases with one eye on appeal. They:
- Make motions they know may be denied — to preserve the issue
- Object to every piece of inadmissible evidence — to preserve the issue
- Articulate their arguments precisely — so the appellate court knows exactly what was argued
- Request findings of fact from the court — so the record reflects what the court found

**In your traffic case**: When the judge denies your Motion to Suppress, say clearly: "Defendant notes an objection to the Court's ruling and preserves the issue for appeal." This costs you nothing and preserves your right.

---

## Lesson 9.2 — Writing the Appellate Brief

*(Summary lesson — see workbook for full brief template)*

### The Structure of an Appellate Brief

**Cover page**: Court name, case number, parties, brief title

**Table of contents**: Including table of authorities (every case and statute cited)

**Jurisdictional statement**: Why this court has jurisdiction

**Statement of the issues**: One to three questions presented, phrased to suggest the answer you want

**Statement of the case**: Procedural history and relevant facts, citing the record

**Summary of argument**: A one-to-two page condensed version of your argument

**Argument**: Your legal arguments, organised by issue, with headings

**Conclusion**: The precise relief you request

**Certificate of service**

---

## Morpheus Check-In — Socratic Mode

1. **Your Motion to Suppress was denied at trial. You did not object on the record. You want to raise the Fourth Amendment issue on appeal. What standard of review will the appellate court apply? What must you show?**

2. **The trial court admitted the LIDAR reading over your hearsay objection. On appeal, is this a legal question or a factual question? What standard of review applies?**

3. **The appellate court agrees that the trial court erred in admitting the LIDAR reading — but it affirms your conviction. How is this possible? What doctrine allows it?**

4. **You are writing your Statement of the Issues for your appellate brief. Which phrasing is better? Why?
   - "Whether the trial court erred in denying the Motion to Suppress?"
   - "Whether the trial court violated Appellant's Fourth Amendment rights by admitting evidence obtained from an unlawful traffic stop that lacked reasonable suspicion?"**

---

*iRise Litigation Academy — Module 15. For educational purposes only.*
$$,
  false, true, 4200
);

-- ============================================================
-- MODULE 15 — PART 10: Master Simulation
-- ============================================================

INSERT INTO public.modules (id, course_id, title, summary, order_index, is_published)
VALUES (
  'm1510000-0000-0000-0000-000000000010',
  'c1500000-0000-0000-0000-000000000015',
  'Part 10 — Master Simulation: Full Litigation from Ticket to Appeal',
  'The complete end-to-end simulation. Ticket → Discovery → Motions → Hearing → Trial → Verdict → Appeal → Decision. Fully interactive.',
  4,
  true
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1510000-0000-0000-0000-000000000010',
  'Lesson 10.1 — Master Simulation: Introduction and Case Brief',
  1, 'TEXT',
$$# Lesson 10.1 — Master Simulation: Introduction and Case Brief

**iRise Litigation Academy — Module 15**
*The Complete Litigation Experience*

---

## Welcome to the Master Simulation

This is where everything comes together.

You have learned:
- The constitutional foundations (Module 13, Part 1)
- How a traffic stop works (Module 13, Part 2)
- Strategic pathways (Module 13, Part 3)
- Every motion available (Module 14, Part 4)
- Discovery strategy (Module 14, Part 5)
- Rules of evidence (Module 14, Part 6)
- How to read and use cases (Module 15, Part 7)
- Every role in the courtroom (Module 15, Part 8)
- Appeals (Module 15, Part 9)

Now you run the complete case — from the moment you receive the citation to the final appellate decision.

---

## The Case File

**People v. [Your Name]**
Citation No.: LA-2024-001

**The Facts**:
On Tuesday 15 October 2024, at approximately 7:47 AM, Officer J. Martinez (Badge No. 4412) of the [City] Police Department stopped a silver Toyota Camry (licence plate [STATE]-ABC-1234) on State Highway 101 northbound near the Exit 43 interchange.

Officer Martinez used a Kustom Signals Pro Laser III LIDAR device to record a speed of 78 mph in a 65 mph zone. The defendant was driving the vehicle alone.

The defendant provided a valid driver's licence, registration, and insurance. The defendant did not make any statements about their speed. Officer Martinez issued a citation for violation of [State Vehicle Code] § [XXXX] (speeding — exceeding posted limit).

**Your Profile**:
- One prior traffic violation 14 months ago (currently 2 points)
- Conviction here adds 1 point (not close to suspension threshold)
- Insurance cost increase estimated at £180/year for three years = £540
- Fine: £225

**Evidence Available**:
- Your dashcam: shows your speedometer at 67-68 mph throughout the relevant stretch
- Officer's dashcam: captures your vehicle from behind; no speed visible
- Officer's body camera: exists; not yet reviewed
- LIDAR calibration records: unknown — not yet requested

---

## The Simulation Map

You will make decisions at each stage. Each decision leads to a different path.

```
STAGE 1: CITATION RECEIVED (Lesson 10.1)
    → Decision: Pay / Traffic School / Contest

STAGE 2: NOT-GUILTY PLEA + DISCOVERY (Lesson 10.2)
    → Send discovery requests
    → Receive (or be denied) records
    → Analyse what you have

STAGE 3: PRE-TRIAL MOTIONS (Lesson 10.3)
    → Which motions to file?
    → Morpheus as judge — you argue

STAGE 4: NEGOTIATION OPPORTUNITY (Lesson 10.4)
    → Prosecution offers no-contest plea to non-moving violation
    → Accept or proceed to trial?

STAGE 5: TRIAL (Lesson 10.5)
    → Opening statement
    → Cross-examination of Officer Martinez
    → Your evidence
    → Closing argument

STAGE 6: VERDICT (Lesson 10.6)
    → Two paths: Not Guilty / Guilty

STAGE 7: APPEAL (if Guilty) (Lesson 10.7)
    → Notice of appeal
    → Brief writing
    → Oral argument before appellate court

STAGE 8: FINAL DECISION (Lesson 10.8)
    → Analysis of what you did right and wrong throughout
```

---

## Stage 1: Your First Decision

You have received the citation. You have three initial choices:

**Option A — Pay**
You accept the infraction. One point, £225 fine, insurance increase. Process ends.

*If you choose this: your Module 15 simulation is complete. Return to Part 10 and choose a different path for educational purposes.*

**Option B — Traffic School**
You are eligible (first infraction in 18 months). You attend traffic school. Fine: £125 + school fee (£65). No point. No insurance impact.

*This is the optimal financial decision. But you would miss the litigation experience. Return to this path after completing the full contest simulation.*

**Option C — Contest**
You enter a not-guilty plea and begin building your case.

*The Master Simulation continues on Path C.*

---

## Stage 1 Assignment

Before proceeding to Lesson 10.2, complete the following:

1. **Document Preservation Checklist**: Using the template from your Templates Library (Part 10 supplement), list every piece of evidence you have or expect to obtain, and note what action you have taken to preserve it.

2. **Litigation Hold Notice**: Draft a formal preservation notice using the template from Module 14, Part 5. Address it to the [City] Police Department. Send it (in the simulation) by certified mail.

3. **Case Strategy Memo**: Write a one-page memo to yourself identifying:
   - Your theory of the case
   - Your three strongest arguments
   - The prosecution's three strongest arguments
   - Your assessment of the probability of success at trial

*Morpheus will review your Strategy Memo in Litigation Coach mode.*

---

*Proceed to Lesson 10.2 — The Discovery Phase*

*iRise Litigation Academy — Module 15. For educational purposes only.*
$$,
  false, true, 3600
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1510000-0000-0000-0000-000000000010',
  'Lesson 10.2 — Master Simulation: Discovery Phase',
  2, 'TEXT',
$$# Lesson 10.2 — Master Simulation: Discovery Phase

**iRise Litigation Academy — Module 15**

---

## Stage 2: You Enter a Not-Guilty Plea

You have mailed your not-guilty plea to [Traffic Court], [City].

The court has assigned the following:

**Trial Date**: Wednesday 18 December 2024, 9:00 AM
**Courtroom**: Traffic Court, Room 4
**Judge**: The Honourable [Name]

**You now have 12 weeks before trial.** This is when the real work begins.

---

## Week 1: Discovery Requests

Using the discovery request template from Lesson 5.2, you send requests for:

1. Officer Martinez's written report and notes
2. Body-worn camera footage
3. Dashcam footage from Officer Martinez's patrol vehicle
4. CAD records for 15 October 2024
5. Kustom Signals Pro Laser III serial number, calibration records (12 months), and maintenance records
6. Officer Martinez's certification for LIDAR operation
7. Relevant agency policies on LIDAR use

---

## Week 4: Discovery Response Arrives

You receive a partial response. The prosecution produces:

**Produced**:
- Officer Martinez's written report (2 pages)
- Body-worn camera footage (file: BWC-4412-20241015-0747.mp4 — 14 minutes)

**Not produced**:
- Dashcam footage ("no dashcam was active in Officer Martinez's vehicle")
- CAD records (no explanation given)
- LIDAR serial number and calibration records ("officer states device was calibrated; no further records available")
- Officer Martinez's LIDAR certification ("officer is certified; records not producible")

---

## Your Assignment: Analyse the Response

**Question 1**: The prosecution claims no dashcam was active. Is this an acceptable response? What are your next steps?

**Question 2**: The prosecution claims calibration records are "not available." What legal argument does this support? What motion do you file?

**Question 3**: The BWC footage shows Officer Martinez's perspective from chest height as they walk toward and interact with your vehicle. What are you looking for in this footage?

**Question 4**: Officer Martinez's report states: "Target vehicle clocked at 78 mph using Kustom Signals Pro Laser III, serial number [BLANK — not completed]. Device was in calibration."

*What does the blank serial number tell you? How does this affect your ability to challenge the calibration?*

---

## Week 5: What You Find in the BWC Footage

After careful review of the 14-minute BWC footage:

**Key observations**:
- At timestamp 00:12, before leaving the patrol car, Officer Martinez performs what appears to be a self-test on the LIDAR device. You can hear a series of beeps.
- The footage does not clearly show the LIDAR display. You can see the officer holding it.
- At timestamp 04:33, Officer Martinez asks the defendant (you): "Do you know how fast you were going?" In the simulation, the defendant does not respond.
- At timestamp 07:21, Officer Martinez says to dispatch: "Vehicle stop on 101 northbound near Exit 43. One occupant. No issues."
- At timestamp 11:05, Officer Martinez returns to your window with the citation.

**The footage does NOT show**:
- The LIDAR reading itself
- The speedometer of your vehicle
- Any corroboration of the claimed 78 mph

---

## Your Motion Decision

Based on your analysis, you decide to file:

**Motion 1**: Motion to Compel Production of LIDAR Calibration Records and Officer Certification
*(Authority: [State] Penal Code §§ [XXX-XXX]; Brady v. Maryland)*

**Motion 2**: Motion to Compel Production of CAD Records
*(Authority: same)*

**Motion 3** (contingent): If calibration records are not produced, Motion to Suppress the LIDAR reading on grounds that reliability cannot be established
*(Authority: [State] case law requiring foundation for speed detection device evidence)*

**Morpheus (as judge) will hear your Motion to Compel in the next lesson exercise.**

---

*Proceed to Lesson 10.3 — Pre-Trial Motions*

*iRise Litigation Academy — Module 15. For educational purposes only.*
$$,
  false, true, 3600
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1510000-0000-0000-0000-000000000010',
  'Lesson 10.3-10.8 — Trial, Verdict & Appeal',
  3, 'TEXT',
$$# Lessons 10.3–10.8 — Trial, Verdict & Appeal (Condensed Guide)

**iRise Litigation Academy — Module 15**

---

## Stage 3: Pre-Trial Motions Hearing

**Outcome**: The court grants your Motion to Compel. The prosecution is ordered to produce LIDAR calibration records within 10 days.

**Three days later**: Calibration records arrive. Key finding:

*The Kustom Signals Pro Laser III, serial number PRO-2019-4471, was last calibrated on 12 September 2024 — 33 days before the 15 October 2024 citation. The next calibration was on 14 October 2024 — the day BEFORE the citation.*

*Your state requires calibration every 60 days. Both calibrations were within 60 days of each other. There is no gap in calibration coverage.*

**The impact**: The calibration records actually support the prosecution. Your primary argument based on calibration is weakened.

**Your new analysis**: What do you do now?

*Morpheus (Litigation Coach)*: "You thought the calibration records would help you. They didn't. This happens in real litigation. The discovery process sometimes reveals evidence that hurts your case. What do you do with this information? Should you settle? Should you focus on a different argument? What is your next move?"

---

## Stage 4: Negotiation

**Prosecution offer** (day before trial): Reduce the charge to a non-moving violation — same fine (£225) but no points, no insurance impact.

**Your decision framework**:
- Trial prospects: Without the calibration argument, your primary evidence is your dashcam showing 67-68 mph vs. the officer's LIDAR at 78 mph
- Jury/Judge credibility: LIDAR is generally considered reliable evidence; dashcam speedometers can be argued to be miscalibrated
- Cost of going to trial: Your time; the uncertainty of a credibility contest
- Value of the offer: No points (saving £540 in insurance + point-related impact)

*This is a genuine decision. Both choices have merit. Elite litigators often take good settlements.*

---

## Stage 5: Trial (if you proceed)

**Your Opening Statement**:
*"Your Honour, this case turns on a single question: which instrument — the officer's LIDAR device or the defendant's dashcam — gives you a more reliable record of the defendant's speed on the morning of 15 October 2024? The defendant will show that their dashcam, recording continuously, captured a speed of 67 to 68 mph in the 65 mph zone. The officer's LIDAR, operated from a patrol vehicle under morning conditions, gave a single reading of 78 mph. At the end of this case, we ask that you find the defendant not guilty."*

**Cross-Examination of Officer Martinez** (key questions):
1. "Officer, did you observe the defendant's speedometer?"
2. "So your sole basis for the speed allegation is the LIDAR reading?"
3. "Were any other vehicles near the defendant's vehicle when you took the reading?"
4. "Is it possible, based on your training, for a LIDAR beam to 'lock on' to a vehicle other than the one you intended to target?"
5. "You testified you performed a self-test at the start of your shift. What does a self-test verify — the device's general function, or its accuracy at a specific speed?"

**Your Evidence**:
- Your dashcam footage (authenticated by your own testimony)
- Your testimony that the dashcam was functioning normally
- Any research notes on Kustom Signals Pro Laser III accuracy parameters

---

## Stage 6: The Verdict

**Path A — Not Guilty**: The judge found the dashcam evidence credible and concluded the prosecution had not proven the 78 mph reading by a preponderance of the evidence.

**Path B — Guilty**: The judge found the LIDAR evidence more reliable than the dashcam speedometer and entered a conviction.

---

## Stage 7: Appeal (Path B only)

**Issues preserved at trial**:
1. Sufficiency of the evidence (you argued dashcam contradicted LIDAR)
2. Foundation for LIDAR evidence (you argued the prosecution did not prove proper technique)

**Standard of review**: Mixed — factual findings reviewed for clear error; legal questions de novo.

**Your appellate brief argument**: The trial court's finding that the LIDAR reading was more credible than the continuously-recording dashcam was clearly erroneous, where: (a) the dashcam recorded continuously throughout the drive; (b) the LIDAR represents a single reading; (c) the officer could not confirm the angle of the LIDAR beam.

---

## Stage 8: Final Assessment

After the simulation is complete, Morpheus provides a full debrief:

**What you did well**:
- Preserved evidence immediately
- Sent discovery requests early
- Filed motions with legal authority cited
- Used cross-examination to challenge foundation

**What could have been stronger**:
- Consider engaging an expert on LIDAR accuracy
- Earlier investigation of the officer's prior citation history
- Sharper opening statement theory

**The takeaway**: Litigation is not about perfection. It is about systematic preparation, strategic thinking, and knowing how to use every tool available.

---

*Congratulations — you have completed iRise Litigation Academy I, II, and III.*

*The same framework you used in this traffic citation case applies to every dispute you will face: consumer, administrative, family, mortgage, and commercial.*

*The methodology is the same. The facts change. The skills transfer.*

*iRise Litigation Academy — For educational purposes only.*
$$,
  false, true, 5400
);

-- ============================================================
-- MODULE 15 — TEMPLATES LIBRARY
-- ============================================================

INSERT INTO public.modules (id, course_id, title, summary, order_index, is_published)
VALUES (
  'm1511000-0000-0000-0000-000000000011',
  'c1500000-0000-0000-0000-000000000015',
  'Templates Library — Every Document in the Litigation Cycle',
  'Professionally annotated templates for every document used in litigation: discovery checklists, motions, evidence logs, appellate checklists, and more.',
  5,
  true
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1511000-0000-0000-0000-000000000011',
  'Template 1 — Discovery Request Checklist',
  1, 'TEXT',
$$# Template 1 — Discovery Request Checklist

**iRise Litigation Academy — Templates Library**

---

> *"A litigator who does not have a system is a litigator who forgets things. A litigator who forgets things loses cases."*

---

## Why This Template Exists

Discovery is where most traffic cases are won or lost. This checklist ensures you request every record that might exist — systematically, early, and in writing.

**How to use it**: Before sending your discovery request, work through every line. For each item, check the box when requested and again when received.

---

## Part A — Immediate Post-Plea Actions

| Action | Requested | Received | Notes |
|--------|-----------|----------|-------|
| Written not-guilty plea entered | ☐ | ☐ | |
| Trial date confirmed | ☐ | ☐ | |
| Litigation hold notice sent (certified mail + email) | ☐ | ☐ | |
| Discovery request sent | ☐ | ☐ | |
| FOIA/public records request sent (parallel) | ☐ | ☐ | |
| Your dashcam footage preserved (backed up ×3) | ☐ | ☐ | |
| Scene photographs taken | ☐ | ☐ | |

---

## Part B — Officer Records

| Record | Requested | Received | Adequate? |
|--------|-----------|----------|-----------|
| Officer's written report | ☐ | ☐ | ☐ |
| Officer's personal notes | ☐ | ☐ | ☐ |
| Officer's badge number and full name | ☐ | ☐ | ☐ |
| Officer's shift start/end times on citation date | ☐ | ☐ | ☐ |
| Officer's LIDAR/radar certification | ☐ | ☐ | ☐ |
| Officer's training records (speed enforcement) | ☐ | ☐ | ☐ |
| Officer's prior disciplinary/complaint history (Giglio) | ☐ | ☐ | ☐ |
| Officer availability for trial confirmed | ☐ | N/A | ☐ |

---

## Part C — Speed Detection Device Records

| Record | Requested | Received | Adequate? |
|--------|-----------|----------|-----------|
| Device make, model, serial number | ☐ | ☐ | ☐ |
| Last calibration date before citation | ☐ | ☐ | ☐ |
| Next calibration date after citation | ☐ | ☐ | ☐ |
| Full calibration log (12 months) | ☐ | ☐ | ☐ |
| Calibration technician name and certification | ☐ | ☐ | ☐ |
| Maintenance/repair log (12 months) | ☐ | ☐ | ☐ |
| Manufacturer's operating manual | ☐ | ☐ | ☐ |
| State-approved device list (confirm device is on it) | ☐ | ☐ | ☐ |
| Pre-shift self-test log | ☐ | ☐ | ☐ |

---

## Part D — Camera and Audio Records

| Record | Requested | Received | Adequate? |
|--------|-----------|----------|-----------|
| Body-worn camera footage (all officers present) | ☐ | ☐ | ☐ |
| Patrol vehicle dashcam footage (front) | ☐ | ☐ | ☐ |
| Patrol vehicle dashcam footage (rear) | ☐ | ☐ | ☐ |
| Chain of custody documentation for footage | ☐ | ☐ | ☐ |
| Video file metadata (hash values, timestamps) | ☐ | ☐ | ☐ |
| Camera policy (when footage is preserved/deleted) | ☐ | ☐ | ☐ |

---

## Part E — Dispatch and Administrative Records

| Record | Requested | Received | Adequate? |
|--------|-----------|----------|-----------|
| CAD log for incident | ☐ | ☐ | ☐ |
| Radio communication recordings | ☐ | ☐ | ☐ |
| Officer's activity log for that shift | ☐ | ☐ | ☐ |

---

## Part F — Brady/Giglio Material

| Record | Requested | Received | Adequate? |
|--------|-----------|----------|-----------|
| Prior sustained complaints against citing officer | ☐ | ☐ | ☐ |
| Prior dismissals of citations written by this officer | ☐ | ☐ | ☐ |
| Any exculpatory information known to the prosecution | ☐ | ☐ | ☐ |

---

## Annotation: Why Each Section Exists

**Part B — Officer Records**: The officer is the prosecution's primary witness. Everything about their qualifications, training, and credibility matters. Prior disciplinary records may be usable for impeachment.

**Part C — Device Records**: Speed detection devices are not infallible. The foundation for their use requires proof of calibration, proper technique, and approved status. Without these records, the prosecution cannot lay the foundation required for the reading to be admissible.

**Part D — Cameras**: Video evidence may support or undermine the officer's testimony. Chain of custody ensures the footage is authentic. Metadata can reveal edits.

**Part E — Dispatch**: CAD records provide a timestamp and location record independent of the officer's notes. Inconsistencies between the CAD log and the officer's report are fertile ground for cross-examination.

**Part F — Brady/Giglio**: These are constitutional obligations, not courtesy requests. The prosecution must produce them even without a specific request. Asking specifically preserves your right to complain if they are withheld.

---

*This template is annotated for educational purposes. Adapt to your jurisdiction's specific requirements.*

*iRise Litigation Academy — Templates Library. For educational purposes only.*
$$,
  false, true, 2700
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1511000-0000-0000-0000-000000000011',
  'Template 2 — Case Chronology & Evidence Index',
  2, 'TEXT',
$$# Template 2 — Case Chronology & Evidence Index

**iRise Litigation Academy — Templates Library**

---

## Why a Chronology Matters

A clear chronology does three things:
1. **Organises your thinking** — you cannot argue from facts you have not organised
2. **Reveals the timeline issues** — gaps, inconsistencies, suspicious sequences of events
3. **Becomes your most-used tool at trial** — cross-examination follows the timeline

---

## Case Chronology Template

**Case**: People v. [Your Name] — Citation No. [XXXX]

| Date/Time | Event | Source | Notes/Issues |
|-----------|-------|--------|--------------|
| [DATE] 00:00 | Last LIDAR calibration before citation | Calibration log | Within 60-day window? |
| [DATE] 07:00 | Officer Martinez begins shift | Shift log | |
| [DATE] 07:45 | Officer Martinez performs LIDAR self-test | BWC footage | Timestamp accurate? |
| [DATE] 07:47:22 | LIDAR reading: 78 mph (claimed) | Officer report | No device display captured on camera |
| [DATE] 07:47:30 | Emergency lights activated | CAD log | Compare to BWC timestamp |
| [DATE] 07:47:45 | Defendant's vehicle stops | Officer report | |
| [DATE] 07:49:00 | Officer approaches vehicle | BWC footage | |
| [DATE] 07:51:00 | Document exchange | BWC footage | |
| [DATE] 07:57:00 | Citation issued | Citation | Check completeness |
| [DATE] 07:58:10 | Stop ends | BWC/CAD | Duration of stop |
| [DATE+1] | LIDAR calibration (post-citation) | Calibration log | |
| [YOUR TRIAL DATE] | Trial | Court | |

---

## Evidence Index Template

| Exhibit No. | Description | Source | Obtained? | Foundation Witness | Admitted? |
|-------------|-------------|--------|-----------|-------------------|-----------|
| D-1 | Dashcam footage (USB) | Defendant | ✓ | Defendant | |
| D-2 | Dashcam still — speedometer 67 mph | Defendant | ✓ | Defendant | |
| D-3 | Citation (copy) | Defendant | ✓ | Officer Martinez | |
| D-4 | BWC footage | Discovery | ✓ | Officer Martinez | |
| D-5 | LIDAR calibration records | Discovery | ✓ | Calibration technician | |
| D-6 | Officer's written report | Discovery | ✓ | Officer Martinez | |
| D-7 | CAD log | Discovery | ✓ | Dispatch records custodian | |
| D-8 | Kustom Signals Pro Laser III operating manual | Manufacturer website | ✓ | Expert / Judicial notice | |
| D-9 | Photograph: scene on 15 Oct 2024 | Defendant | ✓ | Defendant | |

---

## Annotation

**Why a separate evidence index?** At trial, you need to find exhibits instantly. A pre-numbered index, maintained chronologically as you gather evidence, allows you to say "May I direct the Court to Exhibit D-5" rather than scrambling through papers.

**Foundation Witness column**: Before any exhibit is admitted, you need a witness who can authenticate it. This column ensures you have planned who will authenticate every piece of evidence.

**Admitted column**: Updated during trial. Unadmitted exhibits may still be used for cross-examination purposes in some circumstances.

*iRise Litigation Academy — Templates Library. For educational purposes only.*
$$,
  false, true, 1800
);

INSERT INTO public.lessons (module_id, title, order_index, content_type, content_md, is_free, is_published, duration_seconds)
VALUES (
  'm1511000-0000-0000-0000-000000000011',
  'Template 3 — Cross-Examination Planner & Appellate Checklist',
  3, 'TEXT',
$$# Template 3 — Cross-Examination Planner & Appellate Issue Preservation Checklist

**iRise Litigation Academy — Templates Library**

---

## Cross-Examination Planner

**Purpose**: Cross-examination is not about asking every possible question. It is about asking precisely the questions that advance your theory of the case. Every question should serve one of three purposes: (1) undermine the witness's credibility, (2) elicit a fact that helps your case, or (3) lock in a concession that contradicts the prosecution's narrative.

---

### Cross-Examination of Officer Martinez

**Your theory**: The LIDAR reading is unreliable because (a) proper technique is not proven, and (b) your dashcam records a different speed.

**Part 1 — Establish What the Officer Cannot Say**

| Question | Purpose | Expected Answer | If Different Answer |
|----------|---------|----------------|---------------------|
| "You cannot see the defendant's speedometer from your patrol vehicle, correct?" | Establish limitation | Correct | Ask how they observed it |
| "Your only basis for the alleged speed is the LIDAR reading?" | Limit evidence | Yes | Explore what else they claim |
| "You have no independent visual estimate of the speed?" | Limit evidence | Generally correct | Explore method of estimate |
| "The device gives a single instantaneous reading?" | Device limits | Yes | Explore multiple readings |

**Part 2 — Technique Challenges**

| Question | Purpose | Expected Answer | If Different |
|----------|---------|----------------|--------------|
| "What angle was the LIDAR beam relative to the defendant's vehicle?" | Challenge technique | Perpendicular/approx. | Explore how they determined this |
| "What is the manufacturer's specification for maximum targeting angle?" | Challenge technique | [From manual] | Compare to testimony |
| "Were there other vehicles between your position and the defendant?" | Possible error | No/maybe | Explore possibility of wrong target |
| "Is it possible for LIDAR to track a vehicle other than the intended target?" | Possible error | Theoretically yes | Establish possibility |

**Part 3 — Calibration and Certification**

| Question | Purpose | Expected Answer | If Different |
|----------|---------|----------------|--------------|
| "You performed a self-test before your shift?" | Foundation | Yes | Explore what was tested |
| "A self-test checks whether the device is functioning, not its accuracy at all speeds?" | Limit scope | Yes | Explore what it measures |
| "You are certified to operate this specific model of the Pro Laser III?" | Certification | Yes | Explore training details |
| "When were you last trained on this device?" | Recency | [Date] | Assess whether training was recent |

---

## Appellate Issue Preservation Checklist

**Purpose**: At trial, preserve every issue for appeal. This checklist tracks what you raised, when, and whether you got a ruling.

| Issue | When Raised | How Raised | Court's Ruling | Objection on Record? |
|-------|------------|-----------|----------------|---------------------|
| Foundation for LIDAR evidence | Before trial (Motion in Limine) | Written motion | Denied | ✓ (noted on record) |
| Fourth Amendment (if applicable) | Before trial (Motion to Suppress) | Written motion + hearing | [Ruling] | ✓ |
| Hearsay (if calibration records offered without custodian) | At trial (oral objection) | "Objection: hearsay" | [Ruling] | ✓ |
| Sufficiency of evidence | After prosecution rests (Motion for Directed Verdict/Judgment) | Oral motion | [Ruling] | ✓ |
| Error in closing argument | During closing (immediate objection) | "Objection: misstatement of evidence" | [Ruling] | ✓ |
| Final objection to verdict | After verdict | "Defendant preserves all issues for appeal" | Noted | ✓ |

---

## Opening Statement Framework

```
PART 1 — THE HOOK (one sentence that captures your theory)
"This case turns on a single question: which instrument recorded
the defendant's speed accurately?"

PART 2 — THE EVIDENCE (what you will show)
"The evidence will show:
1. The defendant's dashcam, recording continuously throughout
   the relevant stretch of highway, captured a consistent speed
   of 67 to 68 miles per hour.
2. The officer's LIDAR provided a single instantaneous reading
   under conditions where [specific limitation]."

PART 3 — THE STANDARD
"The prosecution must prove every element by [standard of proof].
We submit that the prosecution cannot do so."

PART 4 — THE REQUEST
"At the conclusion of this case, we ask you to find the defendant
not guilty."
```

---

## Closing Argument Framework

```
PART 1 — RECALL YOUR OPENING PROMISE
"At the outset of this case, I told you the evidence would show...
The evidence has done exactly that."

PART 2 — MARSHAL THE EVIDENCE
[Walk through each key piece of evidence and what it proves]

PART 3 — ATTACK THE PROSECUTION'S CASE
[Identify the specific weaknesses: no corroboration; technique
questions; dashcam contradiction]

PART 4 — APPLY THE STANDARD
"The prosecution bears the burden of proving [element] by
[standard]. They have not met that burden because..."

PART 5 — THE CONCLUSION
"For these reasons, we ask that the Court find the defendant not
guilty."
```

---

*All templates in this library are annotated for educational purposes. Adapt to your specific jurisdiction and circumstances.*

*iRise Litigation Academy — Templates Library. For educational purposes only.*
$$,
  false, true, 2400
);
