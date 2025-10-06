// Gallery milestone visual novel data
// Each milestone unlocks a short visual novel scene showing the couple's progression
// Organized by couple

export const galleryMilestones = {
  // Noah x Yuwon milestones
  noahYuwon: [
    {
      id: 1,
      milestone: 5, // Unlocks at 5 tasks completed
      title: "First Glance",
      thumbnail: "/images/gallery/milestone_1_thumb.png", // You'll add these images
      background: "/images/gallery/milestone_1_bg.png",
      scenes: [
        {
          id: 1,
          background: "/images/gallery/milestone_1_bg.png",
          character: "noah", // Which character sprite to show
          characterImage: "/images/characters/noah_neutral.png", // Character sprite
          characterPosition: "right", // left, center, right
          dialogue: "First day on the job. Let's see who the new intern is...",
          speaker: "Noah"
        },
      {
        id: 2,
        background: "/images/gallery/milestone_1_bg.png",
        character: "yuwon",
        characterImage: "/images/characters/yuwon_nervous.png",
        characterPosition: "left",
        dialogue: "I-I'm Yuwon. Nice to meet you!",
        speaker: "Yuwon"
      },
      {
        id: 3,
        background: "/images/gallery/milestone_1_bg.png",
        character: "noah",
        characterImage: "/images/characters/noah_smile.png",
        characterPosition: "right",
        dialogue: "Welcome to AXIS Corp. I'm Noah, your supervisor.",
        speaker: "Noah"
      }
    ]
  },
  {
    id: 2,
    milestone: 10,
    title: "Coffee Break",
    thumbnail: "/images/gallery/milestone_2_thumb.png",
    background: "/images/gallery/milestone_2_bg.png",
    scenes: [
      {
        id: 1,
        background: "/images/gallery/milestone_2_bg.png",
        character: "noah",
        characterImage: "/images/characters/noah_neutral.png",
        characterPosition: "right",
        dialogue: "You take your coffee black, right?",
        speaker: "Noah"
      },
      {
        id: 2,
        background: "/images/gallery/milestone_2_bg.png",
        character: "yuwon",
        characterImage: "/images/characters/yuwon_surprised.png",
        characterPosition: "left",
        dialogue: "You... remembered?",
        speaker: "Yuwon"
      },
      {
        id: 3,
        background: "/images/gallery/milestone_2_bg.png",
        character: "noah",
        characterImage: "/images/characters/noah_smile.png",
        characterPosition: "right",
        dialogue: "Of course. I pay attention.",
        speaker: "Noah"
      }
    ]
  },
  {
    id: 3,
    milestone: 30,
    title: "Late Night",
    thumbnail: "/images/gallery/milestone_3_thumb.png",
    background: "/images/gallery/milestone_3_bg.png",
    scenes: [
      {
        id: 1,
        background: "/images/gallery/milestone_3_bg.png",
        character: "yuwon",
        characterImage: "/images/characters/yuwon_tired.png",
        characterPosition: "left",
        dialogue: "Everyone's gone home already...",
        speaker: "Yuwon"
      },
      {
        id: 2,
        background: "/images/gallery/milestone_3_bg.png",
        character: "noah",
        characterImage: "/images/characters/noah_neutral.png",
        characterPosition: "right",
        dialogue: "Not everyone. I'm still here.",
        speaker: "Noah"
      },
      {
        id: 3,
        background: "/images/gallery/milestone_3_bg.png",
        character: "both",
        characterImage: "/images/characters/both_office.png",
        characterPosition: "center",
        dialogue: "The office feels different at night. More intimate.",
        speaker: "Narration"
      }
    ]
  },
  {
    id: 4,
    milestone: 50,
    title: "Confession",
    thumbnail: "/images/gallery/milestone_4_thumb.png",
    background: "/images/gallery/milestone_4_bg.png",
    scenes: [
      {
        id: 1,
        background: "/images/gallery/milestone_4_bg.png",
        character: "noah",
        characterImage: "/images/characters/noah_serious.png",
        characterPosition: "right",
        dialogue: "Yuwon, I need to tell you something.",
        speaker: "Noah"
      },
      {
        id: 2,
        background: "/images/gallery/milestone_4_bg.png",
        character: "yuwon",
        characterImage: "/images/characters/yuwon_nervous.png",
        characterPosition: "left",
        dialogue: "What is it?",
        speaker: "Yuwon"
      },
      {
        id: 3,
        background: "/images/gallery/milestone_4_bg.png",
        character: "noah",
        characterImage: "/images/characters/noah_blush.png",
        characterPosition: "right",
        dialogue: "I... I think I'm falling for you.",
        speaker: "Noah"
      },
      {
        id: 4,
        background: "/images/gallery/milestone_4_bg.png",
        character: "yuwon",
        characterImage: "/images/characters/yuwon_blush.png",
        characterPosition: "left",
        dialogue: "Noah...",
        speaker: "Yuwon"
      }
    ]
  },
  {
    id: 5,
    milestone: 100,
    title: "Together",
    thumbnail: "/images/gallery/milestone_5_thumb.png",
    background: "/images/gallery/milestone_5_bg.png",
    scenes: [
      {
        id: 1,
        background: "/images/gallery/milestone_5_bg.png",
        character: "both",
        characterImage: "/images/characters/both_rooftop.png",
        characterPosition: "center",
        dialogue: "100 tasks completed. 100 days together.",
        speaker: "Narration"
      },
      {
        id: 2,
        background: "/images/gallery/milestone_5_bg.png",
        character: "yuwon",
        characterImage: "/images/characters/yuwon_happy.png",
        characterPosition: "left",
        dialogue: "I can't believe how far we've come.",
        speaker: "Yuwon"
      },
      {
        id: 3,
        background: "/images/gallery/milestone_5_bg.png",
        character: "noah",
        characterImage: "/images/characters/noah_smile.png",
        characterPosition: "right",
        dialogue: "And we're just getting started.",
        speaker: "Noah"
      },
      {
        id: 4,
        background: "/images/gallery/milestone_5_bg.png",
        character: "both",
        characterImage: "/images/characters/both_kiss.png",
        characterPosition: "center",
        dialogue: "Their first kiss under the city lights.",
        speaker: "Narration"
      }
    ]
  }
  ],

  // Jaehyun x Minkyu milestones
  jaehyunMinkyu: [
    {
      id: 1,
      milestone: 5,
      title: "Unexpected Encounter",
      thumbnail: "/images/gallery/jm_milestone_1_thumb.png",
      background: "/images/gallery/jm_milestone_1_bg.png",
      scenes: [
        {
          id: 1,
          background: "/images/gallery/jm_milestone_1_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_neutral.png",
          characterPosition: "right",
          dialogue: "Late again, Minkyu?",
          speaker: "Jaehyun"
        },
        {
          id: 2,
          background: "/images/gallery/jm_milestone_1_bg.png",
          character: "minkyu",
          characterImage: "/images/characters/minkyu_sheepish.png",
          characterPosition: "left",
          dialogue: "Traffic was crazy! I swear!",
          speaker: "Minkyu"
        },
        {
          id: 3,
          background: "/images/gallery/jm_milestone_1_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_smile.png",
          characterPosition: "right",
          dialogue: "I saved you a coffee. Just in case.",
          speaker: "Jaehyun"
        }
      ]
    },
    {
      id: 2,
      milestone: 10,
      title: "Lunch Partners",
      thumbnail: "/images/gallery/jm_milestone_2_thumb.png",
      background: "/images/gallery/jm_milestone_2_bg.png",
      scenes: [
        {
          id: 1,
          background: "/images/gallery/jm_milestone_2_bg.png",
          character: "minkyu",
          characterImage: "/images/characters/minkyu_happy.png",
          characterPosition: "left",
          dialogue: "Want to grab lunch together?",
          speaker: "Minkyu"
        },
        {
          id: 2,
          background: "/images/gallery/jm_milestone_2_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_surprised.png",
          characterPosition: "right",
          dialogue: "You... want to eat with me?",
          speaker: "Jaehyun"
        },
        {
          id: 3,
          background: "/images/gallery/jm_milestone_2_bg.png",
          character: "minkyu",
          characterImage: "/images/characters/minkyu_smile.png",
          characterPosition: "left",
          dialogue: "Of course! You're interesting to talk to.",
          speaker: "Minkyu"
        }
      ]
    },
    {
      id: 3,
      milestone: 30,
      title: "Game Night",
      thumbnail: "/images/gallery/jm_milestone_3_thumb.png",
      background: "/images/gallery/jm_milestone_3_bg.png",
      scenes: [
        {
          id: 1,
          background: "/images/gallery/jm_milestone_3_bg.png",
          character: "minkyu",
          characterImage: "/images/characters/minkyu_excited.png",
          characterPosition: "left",
          dialogue: "I brought my Switch! Want to play?",
          speaker: "Minkyu"
        },
        {
          id: 2,
          background: "/images/gallery/jm_milestone_3_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_competitive.png",
          characterPosition: "right",
          dialogue: "Prepare to lose.",
          speaker: "Jaehyun"
        },
        {
          id: 3,
          background: "/images/gallery/jm_milestone_3_bg.png",
          character: "both",
          characterImage: "/images/characters/jm_gaming.png",
          characterPosition: "center",
          dialogue: "Hours pass. Neither willing to admit defeat. Their competitive spirits collide.",
          speaker: "Narration"
        }
      ]
    },
    {
      id: 4,
      milestone: 50,
      title: "Realization",
      thumbnail: "/images/gallery/jm_milestone_4_thumb.png",
      background: "/images/gallery/jm_milestone_4_bg.png",
      scenes: [
        {
          id: 1,
          background: "/images/gallery/jm_milestone_4_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_serious.png",
          characterPosition: "right",
          dialogue: "Why do I look forward to seeing you every day?",
          speaker: "Jaehyun"
        },
        {
          id: 2,
          background: "/images/gallery/jm_milestone_4_bg.png",
          character: "minkyu",
          characterImage: "/images/characters/minkyu_blush.png",
          characterPosition: "left",
          dialogue: "Maybe... because we're friends?",
          speaker: "Minkyu"
        },
        {
          id: 3,
          background: "/images/gallery/jm_milestone_4_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_blush.png",
          characterPosition: "right",
          dialogue: "I think it's more than that.",
          speaker: "Jaehyun"
        }
      ]
    },
    {
      id: 5,
      milestone: 100,
      title: "Player 2",
      thumbnail: "/images/gallery/jm_milestone_5_thumb.png",
      background: "/images/gallery/jm_milestone_5_bg.png",
      scenes: [
        {
          id: 1,
          background: "/images/gallery/jm_milestone_5_bg.png",
          character: "minkyu",
          characterImage: "/images/characters/minkyu_nervous.png",
          characterPosition: "left",
          dialogue: "So... want to be Player 2 in my life?",
          speaker: "Minkyu"
        },
        {
          id: 2,
          background: "/images/gallery/jm_milestone_5_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_smile.png",
          characterPosition: "right",
          dialogue: "That's the corniest thing you've ever said.",
          speaker: "Jaehyun"
        },
        {
          id: 3,
          background: "/images/gallery/jm_milestone_5_bg.png",
          character: "minkyu",
          characterImage: "/images/characters/minkyu_sad.png",
          characterPosition: "left",
          dialogue: "Oh... I thought—",
          speaker: "Minkyu"
        },
        {
          id: 4,
          background: "/images/gallery/jm_milestone_5_bg.png",
          character: "jaehyun",
          characterImage: "/images/characters/jaehyun_happy.png",
          characterPosition: "right",
          dialogue: "But yes. I'd love to.",
          speaker: "Jaehyun"
        }
      ]
    }
  ]
};

// Helper to get all milestones as a flat array
export const getAllMilestones = () => {
  return [
    ...galleryMilestones.noahYuwon.map(m => ({ ...m, couple: 'noahYuwon', coupleName: 'Noah × Yuwon' })),
    ...galleryMilestones.jaehyunMinkyu.map(m => ({ ...m, couple: 'jaehyunMinkyu', coupleName: 'Jaehyun × Minkyu' }))
  ];
};

// Helper to get unlocked milestones based on task completion
export const getUnlockedMilestones = (totalCompleted) => {
  return getAllMilestones().filter(m => totalCompleted >= m.milestone);
};

// Helper to get next milestone
export const getNextMilestone = (totalCompleted) => {
  return getAllMilestones().find(m => totalCompleted < m.milestone);
};
