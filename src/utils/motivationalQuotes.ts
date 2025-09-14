export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen! 💪",
  "Your body can do it. It's your mind you have to convince! 🧠",
  "Every expert was once a beginner. Every pro was once an amateur! 🌟",
  "The pain you feel today will be the strength you feel tomorrow! 💪",
  "Don't wish for it, work for it! 🏃‍♂️",
  "Success isn't always about greatness. It's about consistency! ⭐",
  "The hardest part of any workout is showing up! 🚪",
  "You are stronger than you think! 💪",
  "Fitness is not about being better than someone else. It's about being better than you used to be! 🎯",
  "The only impossible journey is the one you never begin! 🚀",
  "Your health is an investment, not an expense! 💰",
  "Every step counts, every rep matters! 👟",
  "The body achieves what the mind believes! 🧠",
  "You don't have to be great to get started, but you have to get started to be great! 🌟",
  "Fitness is a journey, not a destination! 🗺️",
  "The only way to do great work is to love what you do! ❤️",
  "Believe you can and you're halfway there! 🎯",
  "Success is the sum of small efforts repeated day in and day out! 📈",
  "The future you depends on the choices you make today! 🔮",
  "You are never too old to set another goal or to dream a new dream! 🌈"
];

export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

export const getWelcomeMessage = (name: string, isFirstTime: boolean): string => {
  if (isFirstTime) {
    return `Welcome to your fitness journey, ${name}! 🎉`;
  } else {
    return `Welcome back, ${name}! 👋`;
  }
};
