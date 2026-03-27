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
| Replace routine | Duhigg | Bot interaction replaces scrolling |
| Variable rewards | Schüll | Random challenges, surprise encouragement |
| Accountability | ASTD research | Daily check-ins, streak tracking |
| Autonomy | Deci & Ryan | User chooses to engage |
| Habit stacking | James Clear | Check-in after existing habit |
| Implementation intentions | Gollwitzer | /intention command |
| Traction > Focus | Nir Eyal | Micro-challenges as alternative |
| Friction theory | BJ Fogg | Bot on Telegram (already on phone) |

## Monetization

- **Free:** Daily check-in, basic challenges, streak tracking
- **Premium ($5/month):** Custom challenges, detailed analytics, accountability partner matching, priority support

## License

MIT
