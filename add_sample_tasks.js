const sampleTasks = [
  // Daily tasks
  { id: 'sample-daily-1', text: 'Review emails and respond to urgent ones', category: 'business', deadline: '2025-10-15', energy: 'med', taskType: 'daily', createdAt: new Date().toISOString() },
  { id: 'sample-daily-2', text: 'Sketch character design concepts', category: 'art', deadline: '2025-10-12', energy: 'high', taskType: 'daily', createdAt: new Date().toISOString() },
  { id: 'sample-daily-3', text: 'Work on webtoon episode 12', category: 'webtoon', deadline: '2025-10-14', energy: 'high', taskType: 'daily', createdAt: new Date().toISOString() },
  
  // Habits
  { id: 'sample-habit-1', text: 'Drink water 💧', taskType: 'habit', energy: 'low', category: 'life', createdAt: new Date().toISOString() },
  { id: 'sample-habit-2', text: 'Practice drawing for 30 minutes', taskType: 'habit', energy: 'med', category: 'art', createdAt: new Date().toISOString() },
  { id: 'sample-habit-3', text: 'Read for 20 minutes', taskType: 'habit', energy: 'low', category: 'life', createdAt: new Date().toISOString() },
  
  // Recurring tasks
  { id: 'sample-recurring-1', text: 'Weekly planning session', category: 'business', recurrence: 'weekly', recurDay: 'sunday', energy: 'med', taskType: 'recurring', createdAt: new Date().toISOString() },
  { id: 'sample-recurring-2', text: 'Monthly budget review', category: 'life', recurrence: 'monthly', recurDate: '1', energy: 'med', taskType: 'recurring', createdAt: new Date().toISOString() },
  { id: 'sample-recurring-3', text: 'Social media content planning', category: 'business', recurrence: 'weekly', recurDay: 'monday', energy: 'high', taskType: 'recurring', createdAt: new Date().toISOString() },
  
  // Impossible tasks
  { id: 'sample-impossible-1', text: 'Launch my own art exhibition', category: 'art', energy: 'high', taskType: 'impossible', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'sample-impossible-2', text: 'Publish my first webtoon series', category: 'webtoon', energy: 'high', taskType: 'impossible', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'sample-impossible-3', text: 'Learn 3D modeling software', category: 'art', energy: 'high', taskType: 'impossible', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  
  // Finance tasks
  { id: 'sample-finance-1', text: 'Freelance project payment', amount: 500000, deadline: '2025-10-09', taskType: 'finance', energy: 'low', financeType: 'income', financeCategory: 'freelance', createdAt: new Date().toISOString() },
  { id: 'sample-finance-2', text: 'Art supplies shopping', amount: -85000, deadline: '2025-10-08', taskType: 'finance', energy: 'low', financeType: 'outcome', financeCategory: 'impulse', createdAt: new Date().toISOString() },
  { id: 'sample-finance-3', text: 'Monthly rent', amount: -900000, deadline: '2025-10-01', taskType: 'finance', energy: 'low', financeType: 'outcome', financeCategory: 'life', createdAt: new Date().toISOString() },
];

console.log(JSON.stringify(sampleTasks));
