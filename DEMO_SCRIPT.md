# Torka - Hackathon Demo Script

**Total Duration: 2-5 minutes**

---

## 1. Team Introduction (15 seconds)

**[Camera on team]**

> "Hi! We're Team Torka. I'm Rob Reinold, and this is [team member name]. During this hackathon, we tackled one of the biggest challenges in education: making textbook learning actually work for how students individually learn."

---

## 2. Elevator Pitch (30 seconds)

**[Switch to landing page at torka.com or localhost]**

> "We built **Torka** - an AI-powered adaptive learning platform that transforms static textbooks into personalized, multimedia learning experiences.
>
> **What we built:** An intelligent reading app that analyzes your learning style in real-time and automatically generates custom content - whether that's visual diagrams or audio narrations - based on what helps YOU learn best.
>
> **Who it's for:** Students drowning in dense textbooks who learn differently from their peers.
>
> **Why it matters:** Because a visual learner shouldn't be forced to learn physics the same way as an auditory learner. Torka adapts the textbook to you, not the other way around."

---

## 3. Core Demo Flow (3-4 minutes)

### A. Show the Reader Interface (20 seconds)

**[Navigate to /reader]**

> "Let me show you how it works. This is our reader interface - it looks familiar, like a PDF reader, but with AI superpowers.
>
> We're reading a physics chapter about Torque. Notice the toolbar with annotation tools, search, and navigation controls."

### B. Demonstrate Search & Annotation (25 seconds)

**[Press Ctrl+F, search for "lever arm"]**

> "I can search the document - let's find 'lever arm' - and it highlights all matches across all sections.
>
> **[Select some text, click highlight button]**
>
> I can also annotate just like any PDF reader - highlighting key concepts, adding notes, creating bookmarks."

### C. The Magic: AI Format Recommendation (40 seconds)

**[Scroll to show the AI recommendation section appearing]**

> "But here's where Torka gets interesting. Watch the right sidebar.
>
> **[Wait for recommendation to load]**
>
> Torka's AI just analyzed this section - looking at the content complexity, the physics concepts involved, and my personal learning history. It's recommending I use **VISUAL** format because diagrams work better for understanding rotational mechanics.
>
> This isn't random - it's using the Nvidia Nemotron LLM to make an intelligent decision based on what actually helps students retain information."

### D. Generate Multimedia Content (45 seconds)

**[Click to generate visual content]**

> "Let's generate that visual aid.
>
> **[Show loading state]**
>
> Behind the scenes, Torka is calling Google's Gemini AI to create an educational diagram specifically for this torque explanation.
>
> **[Generated image appears]**
>
> And there it is - a custom diagram showing exactly how torque works with force, lever arm, and rotation. This was generated on the fly, tailored to this specific section.
>
> If the AI had recommended audio instead, I'd get a narration from ElevenLabs text-to-speech. The platform adapts to what works best for each concept."

### E. Show Learning Analytics (35 seconds)

**[Navigate to /profile]**

> "And here's the real power: Torka tracks everything.
>
> **[Show profile dashboard]**
>
> This is my learning profile. It shows my learning style breakdown - I'm 42% visual, 28% auditory, 20% reading/writing, 10% kinesthetic.
>
> It tracks my comprehension speed by media type, my retention scores over time, and even my optimal study hours.
>
> All of this data feeds back into the AI's recommendations, creating a virtuous cycle where Torka gets better at helping me learn the more I use it."

### F. Close with Impact (20 seconds)

**[Camera back on team or show landing page]**

> "So that's Torka - we took static textbooks and made them dynamic, personalized, and actually effective.
>
> We combined React, Node.js, Google Gemini, ElevenLabs, and Nvidia's Nemotron AI to build something that genuinely helps students learn better.
>
> Education shouldn't be one-size-fits-all. With Torka, it isn't."

---

## 4. How We Built It - Technical Deep Dive (45-60 seconds)

**[Weave this throughout the demo or deliver as a standalone section]**

### Technical Architecture & Decisions

**During multimedia generation (while waiting for content to load):**

> "Let me talk about how we built this in just [X hours/days]. Our architecture has three layers working together:
>
> **Frontend:** We chose React with TypeScript and Vite for fast development and type safety. We're using React Query for server state management - it automatically syncs all your annotations, bookmarks, and learning data with the backend.
>
> **Backend:** Express.js API with a PostgreSQL database using Drizzle ORM. We designed it to scale - right now you're seeing in-memory storage, but we built abstraction layers so we can flip to production Postgres without changing any frontend code.
>
> **AI Integration:** This is where it gets interesting. We're orchestrating three different AI services:
> - **Nvidia Nemotron** (via OpenRouter) analyzes content and makes learning format recommendations
> - **Google Gemini 2.0** generates educational diagrams on-demand
> - **ElevenLabs** creates natural-sounding narration when audio format is recommended"

### System Flow Under the Hood

**During the recommendation display:**

> "Here's what just happened behind the scenes: When you navigated to this section, the frontend sent the content metadata - complexity level, topic type, word count - along with your past interaction history to our backend.
>
> The backend calls Nemotron with a carefully crafted prompt that includes learning science principles. The LLM evaluates whether visual or auditory learning would be more effective for THIS specific content and YOUR specific learning pattern.
>
> It returns a JSON response with the recommendation and reasoning, which we display here in real-time."

### Challenges We Solved

**During or after the demo:**

> "We hit some interesting challenges:
>
> **Challenge 1 - API Latency:** AI image generation can take 10-15 seconds. We solved this with optimistic UI updates and streaming responses - the interface stays responsive while content generates in the background.
>
> **Challenge 2 - Tracking Accuracy:** We needed to accurately measure time-on-section without tracking every mouse movement. We built a smart session tracker that flushes data only on meaningful interactions - page changes, quiz submissions, content generation.
>
> **Challenge 3 - Recommendation Quality:** Early on, Nemotron was recommending visual content for everything. We refined our prompts to include the content's reading level and complexity score, which dramatically improved recommendation accuracy.
>
> **Challenge 4 - State Synchronization:** With annotations, bookmarks, notes, and learning analytics all being created client-side, we needed bulletproof sync logic. React Query's mutation and invalidation system solved this elegantly."

### Technical Decisions That Made It Possible

> "A few key decisions unlocked this project:
>
> **1. Zod Schemas Everywhere:** We defined shared validation schemas between frontend and backend. One source of truth for data structures meant fewer bugs and better type safety.
>
> **2. Component Library (shadcn/ui):** Instead of building UI from scratch, we used Radix UI primitives with Tailwind. This gave us accessibility and polish in a fraction of the time.
>
> **3. Drizzle ORM:** Type-safe database queries that feel like TypeScript objects. We can refactor the database schema and immediately see what breaks in the code.
>
> **4. Wouter for Routing:** React Router would've been overkill. Wouter is 1KB and does everything we need - saved bundle size and complexity.
>
> **5. Modular AI Strategy:** We didn't lock into one AI provider. Each service (Gemini, ElevenLabs, Nemotron) has an abstraction layer, so we can swap providers if pricing or quality changes."

---

## 5. Why This Matters - The "So What?" (30-45 seconds)

**[Deliver this as your closing statement]**

### The Problem We're Solving

> "Let's talk about why this matters. Right now, if you're a student taking Physics 101, you get the same textbook as everyone else in your class. Same dense paragraphs, same static diagrams, same one-size-fits-all approach.
>
> But we know from learning science that people process information differently. Some students see a torque equation and immediately get it. Others need to hear it explained. Others need to see it visualized.
>
> **The problem:** Traditional textbooks force everyone to learn the same way, leaving millions of students behind."

### Who This Is For

> "Torka is for:
> - **Visual learners** drowning in text-heavy physics and engineering textbooks
> - **Auditory learners** who could ace the exam if they could just hear the content explained
> - **Students with ADHD** who need interactive, adaptive content to stay engaged
> - **Non-native English speakers** who benefit from multi-modal explanations
> - **Educators** who want data on how their students actually learn best"

### The "So What?" - Impact & Vision

> "Here's the 'so what':
>
> **Immediate Impact:** Students using Torka could see measurably better comprehension and retention because the content adapts to how they learn, not how the textbook author wrote.
>
> **Bigger Vision:** Imagine this scales to every textbook in every subject. Imagine a calculus student getting real-time graphing animations for visual concepts but audio explanations for theoretical proofs. Imagine a biology student seeing 3D protein folding animations because the AI knows they retain visual information better.
>
> **What's Next:** If we keep building, here's where we'd go:
> 1. **Expand content library** - Partner with publishers to bring this to real textbooks
> 2. **Improve recommendation engine** - Add eye-tracking or quiz performance to refine learning style detection
> 3. **Collaborative learning** - Let students share their custom-generated content with classmates
> 4. **Teacher dashboard** - Give educators aggregate analytics on class learning patterns
> 5. **Accessibility features** - Screen reader optimization, dyslexia-friendly fonts, ADHD focus modes"

### Final Impact Statement

> "Education technology has spent 20 years trying to digitize the textbook. We're going one step further - we're personalizing it.
>
> Every student deserves content that works for their brain, not just the average brain. That's what Torka does. That's why it matters."

---

## Technical Stack Quick Mention (Optional - 10 seconds)

**[If time permits - use this as a shortened version of section 4]**

> "Quick tech note: We built this with React and TypeScript on the frontend, Express backend, and integrated three AI services - Gemini for images, ElevenLabs for speech, and OpenRouter's Nemotron for learning analysis."

---

## Timing Breakdown

### Option A: Standard Demo (3-4 minutes)
- Team Introduction: **15s**
- Elevator Pitch: **30s**
- Reader Interface: **20s**
- Search & Annotation: **25s**
- AI Recommendation: **40s**
- Multimedia Generation: **45s**
- Learning Analytics: **35s**
- Closing: **20s**

**Total: ~3 minutes 50 seconds** (with buffer for transitions)

### Option B: Extended Demo with Technical Deep Dive (4-5 minutes)
- Team Introduction: **15s**
- Elevator Pitch: **30s**
- Reader Interface: **20s**
- Search & Annotation: **25s**
- AI Recommendation: **40s**
- Multimedia Generation + **How We Built It**: **60s** (weave technical details during loading)
- Learning Analytics: **35s**
- **Why This Matters + "So What?"**: **45s** (replacing standard closing)

**Total: ~4 minutes 30 seconds**

### Option C: Maximum Impact Demo (5 minutes)
Include all sections from Option B, plus:
- Challenges We Solved: **30s** (as separate callout)
- What's Next Vision: **20s** (expanded future roadmap)

**Total: ~5 minutes 20 seconds** (trim as needed to hit 5:00)

---

## Pre-Demo Checklist

- [ ] Have sample document loaded in reader
- [ ] Ensure AI APIs are configured (Google Gemini, ElevenLabs, OpenRouter)
- [ ] Clear any existing annotations/bookmarks for clean demo
- [ ] Pre-load profile page with mock analytics data
- [ ] Test all transitions and page loads
- [ ] Prepare backup screen recording in case live demo fails
- [ ] Have localhost or deployed URL ready
- [ ] Practice the script at least twice for smooth delivery

---

## Demo Tips

1. **Speak with energy** - You're excited about solving a real problem
2. **Show, don't just tell** - Let the AI recommendation load live to build anticipation
3. **Highlight the "wow" moment** - The AI-generated diagram is your showstopper
4. **Connect to the judges** - Everyone has struggled with textbooks; make it relatable
5. **Keep it moving** - No dead air; have a backup plan if API calls are slow
6. **End with impact** - Remind them why personalized learning matters
7. **Narrate during loading** - Use API wait times to explain technical architecture (fills dead air productively)
8. **Show engineering depth** - When discussing challenges, be specific (e.g., "React Query's mutation system" not "state management")
9. **Paint the vision** - Make judges see the future: "Imagine every calculus student getting personalized animations"
10. **Answer "So What?" preemptively** - Don't make judges wonder why it matters; tell them explicitly
11. **Use concrete examples** - "A visual learner struggling with torque equations" beats "students who learn differently"
12. **Demonstrate teamwork** - If presenting as a team, have different members handle technical vs. impact sections

---

## Backup Talking Points

If you have extra time or Q&A:

- **Privacy**: "Student learning data stays private and is used only to improve their own experience"
- **Scalability**: "Built with PostgreSQL and Drizzle ORM for production-ready data handling"
- **Accessibility**: "Used Radix UI primitives for screen reader support and keyboard navigation"
- **Cost efficiency**: "AI recommendations are smart about when to generate content vs. reuse existing materials"

---

## Key Differentiators to Emphasize

1. **Real-time adaptation** - Not a quiz you take once; it learns continuously
2. **Multi-modal content generation** - Text, images, and audio all from one source
3. **Evidence-based recommendations** - Uses actual learning science (visual vs. auditory processing)
4. **Seamless UX** - Feels like a familiar PDF reader, not a clunky ed-tech product

---

## How to Integrate "How We Built It" & "So What?" Into Your Demo

### Strategy 1: Weave Technical Details During Natural Pauses

**Best for:** Keeping the demo flowing without breaking momentum

**When to use:**
- **During image generation loading** (30-45s wait): Explain the AI integration architecture
- **During page transitions**: Mention quick technical decisions ("We're using React Query for this sync")
- **While zooming/navigating**: Brief mentions of UI framework choices

**Example flow:**
```
[Click "Generate Visual"]
> "While Gemini creates this diagram, let me explain what's happening under the hood..."
[Deliver Technical Architecture subsection]
> "And there's our diagram! Generated in real-time."
```

### Strategy 2: Dedicated Technical Section After Demo

**Best for:** Judges who care deeply about engineering choices

**When to use:**
- After showing all features, before closing
- When you have 4.5-5 minutes available
- When presenting to technical judges

**Example flow:**
```
[Finish showing learning analytics]
> "That's the product. Now let me show you how we built it in [X hours]..."
[Deliver full Technical Deep Dive section]
> "Those decisions let us ship this in a hackathon timeline. Now, why does this matter?"
[Transition to "So What?" section]
```

### Strategy 3: Call-and-Response with Co-Presenter

**Best for:** Team presentations with 2+ people

**When to use:**
- You want to show collaboration
- Different team members have different expertise (frontend vs. backend vs. AI)

**Example flow:**
```
Presenter 1: [Shows demo of AI recommendation]
Presenter 2: "Let me jump in here - that recommendation came from Nvidia's Nemotron model. Here's how we integrated it..."
[Delivers System Flow subsection]
Presenter 1: "Thanks! Now watch what happens when we generate content..."
```

### Strategy 4: Bookend Structure (Problem → Demo → Solution)

**Best for:** Maximum narrative impact

**When to use:**
- You want judges to remember the WHY
- Presenting to non-technical or business-focused judges

**Flow:**
1. **Open with "Why This Matters"** (30s) - Establish the problem
2. **Demo the solution** (3 min) - Show product
3. **Technical validation** (45s) - Prove you can build it (abbreviated "How We Built It")
4. **Close with "So What?"** (30s) - Future vision and impact

### Recommended Approach for Your Team

**For a 4-minute demo (recommended):**

```
0:00-0:15   Team Introduction
0:15-0:45   Elevator Pitch (includes brief problem statement)
0:45-1:05   Show Reader Interface
1:05-1:30   Search & Annotation
1:30-2:10   AI Recommendation (explain Nemotron integration while showing)
2:10-3:10   Multimedia Generation (explain architecture during 60s wait/load)
            → Technical Architecture subsection
            → System Flow subsection
3:10-3:45   Learning Analytics
3:45-4:30   "So What?" Section (full version)
            → Problem recap
            → Target users
            → Impact & vision
            → Final statement
```

**Key moments to emphasize:**
- **Challenge solved during generation wait:** "API latency was tough - here's our solution"
- **Technical decision during recommendation:** "We chose Nemotron over GPT because..."
- **Vision during final 45s:** "Imagine this scales to every textbook..."

### Quick Adaptation Guide

**If you're running SHORT on time:**
- Skip "Challenges We Solved" subsection
- Use abbreviated "Technical Stack Quick Mention" instead of full section 4
- Shorten "So What?" to just "Impact Statement" (15s)

**If you have EXTRA time:**
- Expand on one specific challenge in detail
- Show code snippet of the Nemotron prompt
- Discuss edge cases you handled (non-English text, network failures)
- Go deeper on future roadmap (pricing model, publisher partnerships)

**If technical demo FAILS:**
- Immediately pivot to "How We Built It" to show competence
- Use backup screen recording
- Emphasize the engineering challenges you solved
- Lean heavily into "So What?" to maintain impact

---

Good luck with your demo! 🚀
