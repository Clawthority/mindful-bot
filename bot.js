#!/usr/bin/env node
/**
 * MindfulBot — Screen Addiction Replacement System
 * 
 * Not a blocker. Not a nag. A better alternative.
 * Built on behavioral science:
 * - Replace routine, don't remove (Duhigg)
 * - Variable rewards (Schüll)
 * - Accountability partner (ASTD: 65% goal achievement)
 * - Self-determination theory (Deci & Ryan)
 * - Habit stacking (James Clear)
 * - Implementation intentions (Gollwitzer)
 * - Traction over focus (Nir Eyal)
 */

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// --- Config ---
const TOKEN = process.env.MINDFUL_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const bot = new TelegramBot(TOKEN, { polling: true });
console.log('🧠 MindfulBot started');

// --- User Data ---
function getUser(userId) {
  const file = path.join(DATA_DIR, `${userId}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch(e) {
    return {
      id: userId,
      startedAt: new Date().toISOString(),
      screenTimeLog: [],
      streak: 0,
      bestStreak: 0,
      totalDays: 0,
      points: 0,
      level: 1,
      achievements: [],
      checkInTime: '08:00',
      lastCheckIn: null,
      mood: [],
      challengesCompleted: [],
      implementationIntentions: [],
      state: 'new' // new, active, paused
    };
  }
}

function saveUser(user) {
  fs.writeFileSync(path.join(DATA_DIR, `${user.id}.json`), JSON.stringify(user, null, 2));
}

// --- Challenges (Variable Rewards) ---
const CHALLENGES = [
  { id: 'breathing', name: '🌬️ Box Breathing', desc: 'Breathe in 4s, hold 4s, out 4s, hold 4s. 3 rounds.', points: 10, duration: '60s' },
  { id: 'gratitude', name: '🙏 Gratitude 3', desc: 'Name 3 things you\'re grateful for right now.', points: 10, duration: '30s' },
  { id: 'stretch', name: '🧘 Micro Stretch', desc: 'Stretch your neck, shoulders, and wrists for 30 seconds.', points: 10, duration: '30s' },
  { id: 'water', name: '💧 Drink Water', desc: 'Go get a glass of water and drink it mindfully.', points: 10, duration: '60s' },
  { id: 'look', name: '👀 20-20-20', desc: 'Look at something 20 feet away for 20 seconds.', points: 10, duration: '20s' },
  { id: 'walk', name: '🚶 Mini Walk', desc: 'Walk to another room and back. Notice 3 things.', points: 15, duration: '120s' },
  { id: 'journal', name: '📝 Brain Dump', desc: 'Write down everything on your mind. Don\'t filter.', points: 15, duration: '120s' },
  { id: 'cold', name: '🥶 Cold Water', desc: 'Splash cold water on your face or wrists.', points: 10, duration: '30s' },
  { id: 'grounding', name: '🌍 5-4-3-2-1', desc: 'Name: 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.', points: 15, duration: '120s' },
  { id: 'pushup', name: '💪 10 Push-ups', desc: 'Do 10 push-ups (or wall push-ups). Any variation counts.', points: 20, duration: '60s' },
  { id: 'compliment', name: '💬 Text Someone', desc: 'Send a genuine compliment to someone you care about.', points: 15, duration: '60s' },
  { id: 'draw', name: '🎨 Doodle 60s', desc: 'Draw anything for 60 seconds. Quality doesn\'t matter.', points: 15, duration: '60s' },
  { id: 'music', name: '🎵 Song Break', desc: 'Listen to one full song with your eyes closed.', points: 15, duration: '180s' },
  { id: 'clean', name: '🧹 Tidy Up', desc: 'Clean or organize one small area around you.', points: 15, duration: '120s' },
  { id: 'photo', name: '📸 Capture Beauty', desc: 'Take a photo of something beautiful near you.', points: 10, duration: '60s' },
];

// --- Achievements ---
const ACHIEVEMENTS = [
  { id: 'first_checkin', name: '🌱 First Step', desc: 'Completed first check-in', condition: (u) => u.totalDays >= 1 },
  { id: 'streak_3', name: '🔥 On Fire', desc: '3-day streak', condition: (u) => u.streak >= 3 },
  { id: 'streak_7', name: '⚡ Unstoppable', desc: '7-day streak', condition: (u) => u.streak >= 7 },
  { id: 'streak_30', name: '🏆 Champion', desc: '30-day streak', condition: (u) => u.streak >= 30 },
  { id: 'challenges_10', name: '🎯 Challenger', desc: 'Completed 10 challenges', condition: (u) => u.challengesCompleted.length >= 10 },
  { id: 'challenges_50', name: '💎 Master', desc: 'Completed 50 challenges', condition: (u) => u.challengesCompleted.length >= 50 },
  { id: 'points_100', name: '⭐ Rising Star', desc: 'Earned 100 points', condition: (u) => u.points >= 100 },
  { id: 'points_500', name: '🌟 Superstar', desc: 'Earned 500 points', condition: (u) => u.points >= 500 },
  { id: 'improvement', name: '📉 Screen Time Drop', desc: 'Reduced screen time by 30%+ from first week', condition: (u) => checkScreenImprovement(u) },
];

function checkScreenImprovement(user) {
  if (user.screenTimeLog.length < 7) return false;
  const firstWeek = user.screenTimeLog.slice(0, 7).map(s => s.hours);
  const recent = user.screenTimeLog.slice(-7).map(s => s.hours);
  const avgFirst = firstWeek.reduce((a, b) => a + b, 0) / firstWeek.length;
  const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
  return avgRecent < avgFirst * 0.7;
}

function checkAchievements(user) {
  const newAchievements = [];
  for (const a of ACHIEVEMENTS) {
    if (!user.achievements.includes(a.id) && a.condition(user)) {
      user.achievements.push(a.id);
      newAchievements.push(a);
    }
  }
  return newAchievements;
}

function getLevel(points) {
  if (points >= 500) return 5;
  if (points >= 200) return 4;
  if (points >= 100) return 3;
  if (points >= 50) return 2;
  return 1;
}

// --- Motivational Messages ---
const MORNING_GREETINGS = [
  "Good morning! 🌅 Another day to choose differently.",
  "Rise and shine! ☀️ Let's make today count.",
  "Morning! 🌄 Ready to build a better day?",
  "Hey! 🌞 New day, new choices.",
];

const STREAK_MESSAGES = {
  1: "Day 1! Every journey starts here. 🌱",
  3: "3 days! You're building momentum. 🔥",
  7: "A whole week! You're proving something to yourself. ⚡",
  14: "Two weeks! This is becoming who you are. 💪",
  30: "30 days! You've rewired a habit. 🏆",
};

const ENCOURAGEMENTS = [
  "You showed up. That matters more than you think.",
  "Progress, not perfection. You're doing great.",
  "Small steps. Big changes. Keep going.",
  "The fact that you're here means you're winning.",
  "You're building something. One day at a time.",
];

// --- Bot Commands ---

// Start
bot.onText(/\/start/, (msg) => {
  const user = getUser(msg.from.id);
  user.state = 'active';
  saveUser(user);

  bot.sendMessage(msg.chat.id,
    `🧠 *Welcome to MindfulBot*\n\n` +
    `I'm not here to block your phone. I'm here to give you something better.\n\n` +
    `📱 *The Problem:* Your phone gives you dopamine hits every 3 seconds. That's addictive.\n` +
    `🧠 *The Solution:* I give you dopamine hits from completing challenges, building streaks, and feeling proud.\n\n` +
    `Same device. Different outcome.\n\n` +
    `Here's how it works:\n` +
    `• I check in with you daily\n` +
    `• You log your screen time\n` +
    `• I give you micro-challenges when cravings hit\n` +
    `• We track your progress together\n\n` +
    `Ready? Let's start.\n\n` +
    `Use /checkin to log today\n` +
    `Use /challenge when you want to scroll\n` +
    `Use /status to see your progress`,
    { parse_mode: 'Markdown' }
  );
});

// Check-in
bot.onText(/\/checkin/, (msg) => {
  const user = getUser(msg.from.id);
  if (user.state === 'new') {
    return bot.sendMessage(msg.chat.id, "Use /start first to set up!");
  }

  const today = new Date().toISOString().slice(0, 10);
  const alreadyCheckedIn = user.screenTimeLog.some(s => s.date === today);

  if (alreadyCheckedIn) {
    return bot.sendMessage(msg.chat.id,
      "You already checked in today! 💪\nUse /challenge for a quick activity."
    );
  }

  user.state = 'awaiting_screentime';
  saveUser(user);

  const greeting = MORNING_GREETINGS[Math.floor(Math.random() * MORNING_GREETINGS.length)];
  bot.sendMessage(msg.chat.id,
    `${greeting}\n\n` +
    `How many hours did you spend on your phone yesterday?\n\n` +
    `Just type the number (e.g., "5" or "5.5")\n` +
    `Or check your Screen Time / Digital Wellbeing and tell me.`,
    { reply_markup: { force_reply: true } }
  );
});

// Handle screen time input
bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
  const user = getUser(msg.from.id);
  if (user.state !== 'awaiting_screentime') return;

  const hours = parseFloat(msg.text.replace(',', '.'));
  if (isNaN(hours) || hours < 0 || hours > 24) {
    return bot.sendMessage(msg.chat.id, "Please enter a number between 0 and 24 (e.g., 5 or 5.5)");
  }

  const today = new Date().toISOString().slice(0, 10);
  user.screenTimeLog.push({ date: today, hours });
  user.lastCheckIn = today;
  user.totalDays++;

  // Update streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const checkedInYesterday = user.screenTimeLog.some(s => s.date === yesterday);
  if (checkedInYesterday || user.totalDays === 1) {
    user.streak++;
  } else {
    user.streak = 1;
  }
  user.bestStreak = Math.max(user.bestStreak, user.streak);

  // Calculate average
  const recent7 = user.screenTimeLog.slice(-7).map(s => s.hours);
  const avg = (recent7.reduce((a, b) => a + b, 0) / recent7.length).toFixed(1);

  // Points
  user.points += 5; // Base check-in points
  user.level = getLevel(user.points);

  // Streak bonus
  const streakMsg = STREAK_MESSAGES[user.streak] || `${user.streak} days! You're on fire! 🔥`;
  if (user.streak > 1) user.points += user.streak;

  // Check achievements
  const newAchievements = checkAchievements(user);
  saveUser(user);

  // Build response
  let response = `✅ Logged: ${hours}h screen time\n\n`;
  response += `${streakMsg}\n\n`;
  response += `📊 Your 7-day average: ${avg}h\n`;
  response += `🔥 Current streak: ${user.streak} days\n`;
  response += `⭐ Points: ${user.points} (Level ${user.level})\n`;

  if (newAchievements.length > 0) {
    response += `\n🎉 *NEW ACHIEVEMENTS:*\n`;
    for (const a of newAchievements) {
      response += `${a.name} — ${a.desc}\n`;
    }
  }

  // Trend
  if (user.screenTimeLog.length >= 2) {
    const prev = user.screenTimeLog[user.screenTimeLog.length - 2].hours;
    if (hours < prev) {
      response += `\n📉 Down ${(prev - hours).toFixed(1)}h from yesterday! 🎉`;
    } else if (hours > prev) {
      response += `\n📈 Up ${(hours - prev).toFixed(1)}h from yesterday. Tomorrow we try again.`;
    } else {
      response += `\n➡️ Same as yesterday. Consistency is progress.`;
    }
  }

  response += `\n\n💡 *Today's intention:* When you feel the urge to scroll, use /challenge instead.`;

  user.state = 'active';
  saveUser(user);

  bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
});

// Challenge
bot.onText(/\/challenge/, (msg) => {
  const user = getUser(msg.from.id);
  const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];

  bot.sendMessage(msg.chat.id,
    `🎯 *Challenge: ${challenge.name}*\n\n` +
    `${challenge.desc}\n\n` +
    `⏱️ Takes: ${challenge.duration}\n` +
    `⭐ Reward: ${challenge.points} points\n\n` +
    `When you're done, tap ✅ Done!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Done!', callback_data: `done_${challenge.id}_${challenge.points}` },
          { text: '🔄 Different challenge', callback_data: 'new_challenge' }
        ]]
      }
    }
  );
});

// Handle challenge completion
bot.on('callback_query', (query) => {
  const data = query.data;
  const userId = query.from.id;
  const user = getUser(userId);

  if (data === 'new_challenge') {
    const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    return bot.editMessageText(
      `🎯 *Challenge: ${challenge.name}*\n\n` +
      `${challenge.desc}\n\n` +
      `⏱️ Takes: ${challenge.duration}\n` +
      `⭐ Reward: ${challenge.points} points`,
      {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Done!', callback_data: `done_${challenge.id}_${challenge.points}` },
            { text: '🔄 Different challenge', callback_data: 'new_challenge' }
          ]]
        }
      }
    );
  }

  if (data.startsWith('done_')) {
    const [, challengeId, points] = data.split('_');
    user.points += parseInt(points);
    user.challengesCompleted.push({ id: challengeId, date: new Date().toISOString() });
    user.level = getLevel(user.points);

    const newAchievements = checkAchievements(user);
    saveUser(user);

    const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

    let response = `✅ Nice work! +${points} points\n\n`;
    response += `${enc}\n\n`;
    response += `⭐ Total: ${user.points} points | 🔥 Streak: ${user.streak} days\n`;
    response += `🎯 Challenges completed: ${user.challengesCompleted.length}`;

    if (newAchievements.length > 0) {
      response += `\n\n🎉 *ACHIEVEMENT UNLOCKED:*\n`;
      for (const a of newAchievements) {
        response += `${a.name} — ${a.desc}\n`;
      }
    }

    bot.answerQuery(query.id);
    bot.editMessageText(response, {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      parse_mode: 'Markdown'
    });
  }
});

// Status
bot.onText(/\/status/, (msg) => {
  const user = getUser(msg.from.id);
  if (user.state === 'new') {
    return bot.sendMessage(msg.chat.id, "Use /start first!");
  }

  const recent7 = user.screenTimeLog.slice(-7);
  const avg = recent7.length > 0
    ? (recent7.map(s => s.hours).reduce((a, b) => a + b, 0) / recent7.length).toFixed(1)
    : 'N/A';

  const chart = recent7.map(s => {
    const bar = '█'.repeat(Math.round(s.hours));
    return `${s.date.slice(5)} ${bar} ${s.hours}h`;
  }).join('\n');

  let response = `📊 *Your Progress*\n\n`;
  response += `🔥 Streak: ${user.streak} days (Best: ${user.bestStreak})\n`;
  response += `⭐ Points: ${user.points} (Level ${user.level})\n`;
  response += `📅 Total check-ins: ${user.totalDays}\n`;
  response += `🎯 Challenges completed: ${user.challengesCompleted.length}\n`;
  response += `📉 7-day average: ${avg}h\n\n`;

  if (chart) {
    response += `*Screen Time (last 7 days):*\n\`\`\`\n${chart}\n\`\`\`\n`;
  }

  if (user.achievements.length > 0) {
    response += `\n🏆 *Achievements:* ${user.achievements.length}/${ACHIEVEMENTS.length}\n`;
    const earned = ACHIEVEMENTS.filter(a => user.achievements.includes(a.id));
    response += earned.map(a => `${a.name}`).join(' ');
  }

  bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
});

// Grounding exercise
bot.onText(/\/ground/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `🌍 *5-4-3-2-1 Grounding Exercise*\n\n` +
    `When anxiety hits, ground yourself:\n\n` +
    `👀 **5** things you can SEE\n` +
    `👂 **4** things you can HEAR\n` +
    `✋ **3** things you can TOUCH\n` +
    `👃 **2** things you can SMELL\n` +
    `👅 **1** thing you can TASTE\n\n` +
    `Go through each one. Say them out loud or in your head.\n\n` +
    `This takes 60 seconds and brings you back to the present.\n\n` +
    `Reply with your answers when you're done. 💙`,
    { parse_mode: 'Markdown' }
  );
});

// Help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `🧠 *MindfulBot Commands*\n\n` +
    `/start — Set up your profile\n` +
    `/checkin — Log today's screen time\n` +
    `/challenge — Get a micro-challenge\n` +
    `/status — See your progress\n` +
    `/ground — 5-4-3-2-1 grounding exercise\n` +
    `/intention — Set an if-then plan\n` +
    `/help — This message\n\n` +
    `💡 *Philosophy:*\n` +
    `I don't block your phone. I give you something better to do with it.\n\n` +
    `Same device. Different dopamine. Better life.`,
    { parse_mode: 'Markdown' }
  );
});

// Implementation intention
bot.onText(/\/intention/, (msg) => {
  const user = getUser(msg.from.id);
  user.state = 'awaiting_intention';
  saveUser(user);

  bot.sendMessage(msg.chat.id,
    `🧠 *Implementation Intention*\n\n` +
    `Research shows: "If X, then Y" plans increase follow-through by 2-3x.\n\n` +
    `Complete this sentence:\n\n` +
    `"When I feel [TRIGGER], I will [ACTION]"\n\n` +
    `Example: "When I feel bored, I will use /challenge"\n` +
    `Example: "When I reach for my phone at night, I will do box breathing"\n\n` +
    `Write your intention:`,
    { parse_mode: 'Markdown', reply_markup: { force_reply: true } }
  );
});

// Handle intention input
bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
  const user = getUser(msg.from.id);
  if (user.state !== 'awaiting_intention') return;

  user.implementationIntentions.push({
    text: msg.text,
    createdAt: new Date().toISOString()
  });
  user.points += 10;
  user.state = 'active';
  saveUser(user);

  bot.sendMessage(msg.chat.id,
    `✅ Intention saved! +10 points\n\n` +
    `"${msg.text}"\n\n` +
    `I'll remind you of this when it's relevant. 💡\n\n` +
    `Research says you're now 2-3x more likely to follow through. 🧠`,
    { parse_mode: 'Markdown' }
  );
});

// Daily check-in reminder (run via cron)
// Export for cron usage
module.exports = { bot, getUser, saveUser, CHALLENGES, ACHIEVEMENTS };

console.log('MindfulBot is running. Press Ctrl+C to stop.');
