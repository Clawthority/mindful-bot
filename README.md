# 🧠 MindfulBot

**Not a blocker. Not a nag. A better alternative.**

A Telegram bot that helps people reduce screen time by replacing scrolling with micro-challenges, streak tracking, and accountability — all backed by behavioral science.

## Why Existing Solutions Fail

| Solution | Why It Fails |
|----------|-------------|
| Screen Time (Apple) | One tap to "Ignore Limit" |
| App Blockers | Rely on willpower (the thing you lack) |
| Meditation Apps | Wrong solution + another app to check |
| Therapy | $150/week + 6-week wait |

## Why MindfulBot Works

Built on peer-reviewed research:

- **Replace routine, don't remove** *(Duhigg)* — Bot interaction replaces scrolling
- **Variable rewards** *(Schüll)* — Surprising challenges keep it engaging
- **Accountability partner** *(ASTD)* — 65% goal achievement with accountability
- **Self-determination** *(Deci & Ryan)* — Autonomy preserved, never forced
- **Habit stacking** *(James Clear)* — Check-in after existing habits
- **Implementation intentions** *(Gollwitzer)* — "If X then Y" plans
- **Traction over focus** *(Nir Eyal)* — Replace distraction with traction

## Features

- 📊 **Daily check-in** — Log screen time, track trends
- 🎯 **Micro-challenges** — 15 science-backed 30-120s activities
- 🔥 **Streak tracking** — Build momentum, celebrate progress
- ⭐ **Points & levels** — Gamified rewards (variable reinforcement)
- 🏆 **Achievements** — Unlock milestones
- 🌍 **Grounding exercise** — 5-4-3-2-1 for anxiety/panic
- 🧠 **Implementation intentions** — Research-backed "if-then" plans
- 📉 **Trend analysis** — 7-day averages, day-over-day changes
- 👨‍👩‍👧 **Family protection** — Guardian dashboard to track loved ones' progress (Premium)
- 🎨 **Custom challenges** — Create your own micro-challenges
- 🤝 **Accountability partner matching** — Get matched with a partner to stay accountable

## Quick Start

```bash
# Clone
git clone https://github.com/Clawthority/mindful-bot.git
cd mindful-bot

# Install
npm install

# Set your bot token
export MINDFUL_BOT_TOKEN="your-telegram-bot-token"

# Run
npm start
```

### Get a Telegram Bot Token

1. Open Telegram, search for @BotFather
2. Send `/newbot`
3. Name your bot (e.g., "MindfulBot")
4. Copy the token
5. Set it as `MINDFUL_BOT_TOKEN` env var

## Who It's For

- **Heavy scrollers** — You pick up your phone 80+ times a day. MindfulBot gives you something better to do with each unlock.
- **Students** — Replace procrastination habits with micro-challenges that actually stick.
- **Parents** — Model healthy screen habits. Show your kids you're working on it too.
- **Remote workers** — Break the "just checking" cycle that fragments your focus.
- **Anyone in therapy/CBT** — Works alongside treatment as a daily reinforcement tool.

## Commands

| Command | What it does |
|---------|-------------|
| `/start` | Set up your profile |
| `/checkin` | Log today's screen time |
| `/challenge` | Get a random micro-challenge |
| `/status` | See your progress |
| `/ground` | 5-4-3-2-1 grounding exercise |
| `/intention` | Set an if-then plan |
| `/help` | Show all commands |

## Behavioral Science Stack

| Principle | Source | Implementation |
|-----------|--------|----------------|
| Replace routine | Duhigg (2012) | Bot interaction replaces scrolling |
| Variable rewards | Schüll (2012) | Random challenges, surprise encouragement |
| Accountability | ASTD research (2014) | Daily check-ins, streak tracking |
| Autonomy | Deci & Ryan (2000) | User chooses to engage |
| Habit stacking | Clear (2018) | Check-in after existing habit |
| Implementation intentions | Gollwitzer (1999) | /intention command |
| Traction > Focus | Eyal (2014) | Micro-challenges as alternative |
| Friction theory | Fogg (2009) | Bot on Telegram (already on phone) |

### Research References

- **Hooked: How to Build Habit-Forming Products** — Nir Eyal (2014)
- **The Power of Habit** — Charles Duhigg (2012)
- **Addiction by Design** — Natasha Schüll (2012)
- **Self-Determination Theory** — Deci & Ryan (2000)
- **Atomic Habits** — James Clear (2018)
- **The Psychology of Goals** — Gollwitzer (1999)
- **Behavior Model** — BJ Fogg (2009)

## Monetization

- **Free:** Daily check-in, basic challenges, streak tracking
- **Premium ($5/month):** Custom challenges, detailed analytics, accountability partner matching, priority support

## Related Products

- **[Scam Academy](../scam-academy)** — Learn to spot scams with interactive simulations
- **[Scam Shield](../scam-shield)** — Check suspicious messages, links, and crypto addresses

## License

MIT
