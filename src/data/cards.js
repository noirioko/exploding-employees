// Card rarity database with 100 cards
// Rarities: common (60%), rare (25%), super (12%), ultra (3%)

export const cardDatabase = [
  // COMMON CARDS (60 cards) - Simple moments
  { id: 1, title: 'Coffee Break', text: 'Noah brings coffee. Yuwon smiles.', rarity: 'common' },
  { id: 2, title: 'Lunch Time', text: 'Minkyu shares his lunch with everyone.', rarity: 'common' },
  { id: 3, title: 'Morning Greeting', text: 'Jaehyun arrives early. Again.', rarity: 'common' },
  { id: 4, title: 'Printer Jam', text: 'The printer jams. Classic Tuesday.', rarity: 'common' },
  { id: 5, title: 'Email Spam', text: 'Yuwon deletes 50 promotional emails.', rarity: 'common' },
  { id: 6, title: 'Meeting Room', text: 'Someone left the AC on max. Everyone freezes.', rarity: 'common' },
  { id: 7, title: 'Sticky Notes', text: "Noah leaves a sticky note on Yuwon's monitor.", rarity: 'common' },
  { id: 8, title: 'Water Cooler', text: 'Minkyu refills the water dispenser. Hero.', rarity: 'common' },
  { id: 9, title: 'Keyboard Clicks', text: "Jaehyun types aggressively. Something's wrong.", rarity: 'common' },
  { id: 10, title: 'Elevator Wait', text: 'Yuwon and Noah wait for the elevator. Awkward silence.', rarity: 'common' },
  { id: 11, title: 'Stapler', text: "Someone took Minkyu's stapler. Investigation begins.", rarity: 'common' },
  { id: 12, title: 'Window View', text: 'Yuwon stares out the window, daydreaming.', rarity: 'common' },
  { id: 13, title: 'Chair Squeak', text: "Jaehyun's chair squeaks. Every. Single. Time.", rarity: 'common' },
  { id: 14, title: 'Plant Care', text: "Noah waters the office plant. It's plastic.", rarity: 'common' },
  { id: 15, title: 'Pen Thief', text: 'That one good pen? Gone. Vanished.', rarity: 'common' },
  { id: 16, title: 'Microwave Queue', text: 'Three people waiting for the microwave. Tension rises.', rarity: 'common' },
  { id: 17, title: 'Hand Sanitizer', text: 'The pump is empty. Minkyu sighs.', rarity: 'common' },
  { id: 18, title: 'Desk Lamp', text: 'Yuwon adjusts his lamp. Perfect lighting achieved.', rarity: 'common' },
  { id: 19, title: 'Calendar Flip', text: 'Jaehyun flips the calendar. Another month gone.', rarity: 'common' },
  { id: 20, title: 'Tissue Box', text: 'Empty tissue box. Noah takes one from supply closet.', rarity: 'common' },
  { id: 21, title: 'Mouse Click', text: "Yuwon's mouse double-clicks on its own. Frustrating.", rarity: 'common' },
  { id: 22, title: 'Swivel Chair', text: 'Minkyu spins in his chair. Just once.', rarity: 'common' },
  { id: 23, title: 'File Sorting', text: 'Jaehyun reorganizes files alphabetically. Satisfaction.', rarity: 'common' },
  { id: 24, title: 'Headphones On', text: 'Noah puts on headphones. Do not disturb mode.', rarity: 'common' },
  { id: 25, title: 'Stretch Break', text: 'Yuwon stretches. His back cracks. Relief.', rarity: 'common' },
  { id: 26, title: 'Eraser Dust', text: 'Minkyu blows eraser dust off his desk.', rarity: 'common' },
  { id: 27, title: 'Pen Clicking', text: "Click. Click. Click. Jaehyun's thinking.", rarity: 'common' },
  { id: 28, title: 'Screen Brightness', text: 'Noah adjusts his screen brightness. Too bright.', rarity: 'common' },
  { id: 29, title: 'Folder Stack', text: "Yuwon's desk: a mountain of folders. Organized chaos.", rarity: 'common' },
  { id: 30, title: 'Nameplate', text: 'Minkyu straightens his desk nameplate. Perfect.', rarity: 'common' },
  { id: 31, title: 'Door Hold', text: 'Jaehyun holds the door for Noah. Polite.', rarity: 'common' },
  { id: 32, title: 'Trash Bin', text: "Yuwon's trash bin is full. Time to empty it.", rarity: 'common' },
  { id: 33, title: 'Phone Buzz', text: "Minkyu's phone buzzes. He ignores it.", rarity: 'common' },
  { id: 34, title: 'Coat Hanger', text: 'Noah hangs his coat. Professional.', rarity: 'common' },
  { id: 35, title: 'Bookmark', text: 'Jaehyun bookmarks a webpage for later.', rarity: 'common' },
  { id: 36, title: 'Yawn', text: 'Yuwon yawns. Contagious. Noah yawns too.', rarity: 'common' },
  { id: 37, title: 'Snack Drawer', text: "Minkyu's secret snack drawer. Everyone knows.", rarity: 'common' },
  { id: 38, title: 'Glasses Wipe', text: 'Jaehyun wipes his glasses. Crystal clear.', rarity: 'common' },
  { id: 39, title: 'Tie Adjustment', text: 'Noah fixes his tie in the reflection.', rarity: 'common' },
  { id: 40, title: 'Desk Photo', text: 'Yuwon looks at his desk photo. Family.', rarity: 'common' },
  { id: 41, title: 'Calendar Mark', text: 'Minkyu circles a date. Important.', rarity: 'common' },
  { id: 42, title: 'Notebook Flip', text: 'Jaehyun flips through his notebook pages.', rarity: 'common' },
  { id: 43, title: 'Mug Refill', text: 'Noah refills his coffee mug. Third cup.', rarity: 'common' },
  { id: 44, title: 'Doodle', text: 'Yuwon doodles in the margin. Tiny bird.', rarity: 'common' },
  { id: 45, title: 'Drawer Close', text: 'Minkyu closes his drawer with his foot.', rarity: 'common' },
  { id: 46, title: 'Post-it Note', text: 'Jaehyun writes a reminder on a post-it.', rarity: 'common' },
  { id: 47, title: 'Hand Stretch', text: 'Noah stretches his fingers. Typing cramp.', rarity: 'common' },
  { id: 48, title: 'Paper Clip', text: 'Yuwon straightens a paper clip. Fidgeting.', rarity: 'common' },
  { id: 49, title: 'Sigh', text: 'Minkyu sighs deeply. Long day.', rarity: 'common' },
  { id: 50, title: 'Smile', text: 'Jaehyun smiles at his screen. Good news.', rarity: 'common' },
  { id: 51, title: 'Shoulder Roll', text: 'Noah rolls his shoulders. Tension release.', rarity: 'common' },
  { id: 52, title: 'Hair Push', text: 'Yuwon pushes hair out of his eyes.', rarity: 'common' },
  { id: 53, title: 'Knuckle Crack', text: 'Minkyu cracks his knuckles. Ready to work.', rarity: 'common' },
  { id: 54, title: 'Page Turn', text: 'Jaehyun turns a page. Focused.', rarity: 'common' },
  { id: 55, title: 'Whistle', text: 'Noah whistles softly while working.', rarity: 'common' },
  { id: 56, title: 'Glance', text: 'Yuwon glances at Noah. Quickly looks away.', rarity: 'common' },
  { id: 57, title: 'Nod', text: 'Minkyu nods to himself. Plan confirmed.', rarity: 'common' },
  { id: 58, title: 'Wink', text: 'Jaehyun winks at the camera. Confident.', rarity: 'common' },
  { id: 59, title: 'Thumbs Up', text: 'Noah gives a thumbs up. Approved.', rarity: 'common' },
  { id: 60, title: 'Fist Bump', text: 'Yuwon and Minkyu fist bump. Teamwork.', rarity: 'common' },

  // RARE CARDS (25 cards) - Interesting moments
  { id: 61, title: 'Accidental Touch', text: 'Yuwon and Noah reach for the same file. Hands touch. Both freeze.', rarity: 'rare' },
  { id: 62, title: 'Lunch Invitation', text: 'Noah invites Yuwon to lunch. Just the two of them. Yuwon says yes.', rarity: 'rare' },
  { id: 63, title: 'Late Night', text: 'Everyone left. Yuwon and Noah alone in the office. Stars outside.', rarity: 'rare' },
  { id: 64, title: 'Shared Umbrella', text: 'Rain pours. Noah offers to share his umbrella. Very close.', rarity: 'rare' },
  { id: 65, title: 'Tie Fix', text: "Noah's tie is crooked. Yuwon reaches up to fix it. Eye contact.", rarity: 'rare' },
  { id: 66, title: 'Coffee Delivery', text: "Noah places coffee on Yuwon's desk. 'Just how you like it.'", rarity: 'rare' },
  { id: 67, title: 'Elevator Stuck', text: 'Elevator stops. Yuwon and Noah trapped. 20 minutes. Talking.', rarity: 'rare' },
  { id: 68, title: 'Secret Smile', text: "Noah smiles at Yuwon across the room. Yuwon's heart skips.", rarity: 'rare' },
  { id: 69, title: 'Jacket Loan', text: "Yuwon is cold. Noah drapes his jacket over Yuwon's shoulders.", rarity: 'rare' },
  { id: 70, title: 'Praise', text: "Noah: 'Good work today.' Yuwon blushes. Jaehyun notices.", rarity: 'rare' },
  { id: 71, title: 'Desk Visit', text: "Noah stops by Yuwon's desk. No reason. Just... checking.", rarity: 'rare' },
  { id: 72, title: 'Lunch Trade', text: "Yuwon: 'Want to trade?' Noah: 'Sure.' They swap lunches. Indirect kiss?", rarity: 'rare' },
  { id: 73, title: 'Hair Tuck', text: "Noah tucks a strand of Yuwon's hair behind his ear. Casual. Devastating.", rarity: 'rare' },
  { id: 74, title: 'Hand Guide', text: "Noah guides Yuwon's hand on the mouse. 'Like this.' Warmth.", rarity: 'rare' },
  { id: 75, title: 'Stare', text: "Yuwon catches Noah staring. Noah doesn't look away.", rarity: 'rare' },
  { id: 76, title: 'After Work Drinks', text: 'Team drinks. Noah sits next to Yuwon. Thighs touching.', rarity: 'rare' },
  { id: 77, title: 'File Search', text: "Yuwon searches for a file. Noah leans close. 'Need help?'", rarity: 'rare' },
  { id: 78, title: 'Voice Drop', text: 'Noah lowers his voice when talking to Yuwon. Intimate.', rarity: 'rare' },
  { id: 79, title: 'Save', text: 'Yuwon trips. Noah catches him. Arm around waist. Time stops.', rarity: 'rare' },
  { id: 80, title: 'Name Call', text: "Noah calls Yuwon's name softly. Yuwon turns. 'Yes?'", rarity: 'rare' },
  { id: 81, title: 'Shoulder Touch', text: "Noah touches Yuwon's shoulder. Lingering. 'You okay?'", rarity: 'rare' },
  { id: 82, title: 'Lunch Share', text: "Noah: 'I made too much. Want some?' Homemade lunch. For Yuwon.", rarity: 'rare' },
  { id: 83, title: 'Car Ride', text: 'Noah drives Yuwon home. Radio plays. Neither speaks. Content.', rarity: 'rare' },
  { id: 84, title: 'First Name', text: "Noah uses Yuwon's first name. Yuwon's ears turn red.", rarity: 'rare' },
  { id: 85, title: 'Concern', text: "Noah: 'You look tired.' Yuwon: 'I'm fine.' Noah: 'Liar.'", rarity: 'rare' },

  // SUPER RARE CARDS (12 cards) - Significant moments
  { id: 86, title: 'Almost Kiss', text: "Copy room. Door closes. They're alone. Noah steps closer. Yuwon's breath hitches. The door opens. Jaehyun walks in. Moment shattered.", rarity: 'super' },
  { id: 87, title: 'Confession Prep', text: "Minkyu finds Noah practicing what to say. 'I... Yuwon, I...' Noah notices Minkyu. 'Not a word.' Minkyu grins. 'I didn't hear anything.'", rarity: 'super' },
  { id: 88, title: 'Jealousy', text: "New intern flirts with Yuwon. Noah's jaw clenches. He walks over. 'Yuwon, we have a meeting.' They don't have a meeting.", rarity: 'super' },
  { id: 89, title: 'Sick Day', text: "Yuwon calls in sick. Noah shows up at his door with soup. 'You shouldn't be here.' 'I know.' He stays anyway.", rarity: 'super' },
  { id: 90, title: 'Hand Hold', text: "Company dinner. Under the table. Noah's hand finds Yuwon's. Fingers intertwine. No one notices. They don't let go.", rarity: 'super' },
  { id: 91, title: 'Drunk Truth', text: "After-party. Yuwon drunk. 'Noah's really handsome.' Noah carries him home. Yuwon mumbles. 'Don't tell Noah.' Too late.", rarity: 'super' },
  { id: 92, title: 'Morning After', text: "Yuwon wakes up in Noah's apartment. Blanket over him. Coffee on the table. Note: 'You were drunk. I slept on the couch. -N'", rarity: 'super' },
  { id: 93, title: 'Office Kiss', text: "Everyone gone. Yuwon working late. Noah walks in. Locks door. 'Yuwon.' 'Noah?' Noah kisses him. Finally.", rarity: 'super' },
  { id: 94, title: 'First Date', text: "Not a work dinner. Actual date. Noah reserved a table. Candlelight. Yuwon's heart races. 'Is this real?' Noah smiles. 'Very.'", rarity: 'super' },
  { id: 95, title: 'Key Exchange', text: "Noah hands Yuwon a key. 'To my place. Come over anytime.' Yuwon: 'This is...' Noah: 'Too fast?' Yuwon: 'Perfect.'", rarity: 'super' },
  { id: 96, title: 'Public', text: "Company event. Noah's hand on Yuwon's waist. Possessive. Everyone sees. Yuwon doesn't mind. Neither does Noah.", rarity: 'super' },
  { id: 97, title: 'Morning Text', text: "Yuwon's phone: 'Good morning. Coffee on your desk.' Yuwon looks up. Noah across the office. Smiling.", rarity: 'super' },

  // ULTRA RARE CARDS (3 cards) - Legendary moments
  { id: 98, title: 'The Promotion', text: "YUWON GETS PROMOTED TO CREATIVE DIRECTOR.\n\nCelebration dinner. Noah stands. Glass raised. 'To Yuwon. The most talented designer I know. And...' He pauses. Everyone watches. 'The person I love.'\n\nSilence. Gasps. Jaehyun chokes on his drink. Minkyu grins. Yuwon stands. Walks to Noah. 'Say that again.'\n\nNoah: 'I love you.'\n\nYuwon kisses him in front of everyone. The office explodes. Cheers. Applause. Minkyu: 'FINALLY!'\n\nCEO walks in. 'What did I miss?' Jaehyun: 'Everything.'", rarity: 'ultra' },
  { id: 99, title: 'The Proposal', text: "ROOFTOP. SUNSET. CITY LIGHTS BELOW.\n\nNoah: 'Yuwon.' Yuwon turns. Noah is on one knee. Ring box open. Diamond glints.\n\n'We met in this building. You spilled coffee on me. Day one.' Yuwon laughs, tears forming. 'I knew then. I knew.'\n\n'Marry me. Not just my colleague. Not just my boyfriend. My husband.'\n\nYuwon: 'You're crying.' Noah: 'So are you.' Yuwon: 'Yes. Yes. A thousand times yes.'\n\nRing slides on. Perfect fit. They kiss. Fireworks in the distance. Jaehyun films from the doorway. Minkyu sniffles. 'I'm not crying. You're crying.'", rarity: 'ultra' },
  { id: 100, title: 'The Wedding', text: "AXIS CORP ROOFTOP VENUE. WHITE FLOWERS EVERYWHERE. SUNSET CEREMONY.\n\nOfficiant: 'Do you, Noah, take Yuwon...'\nNoah: 'I do.'\n\n'Do you, Yuwon, take Noah...'\nYuwon: 'I do.'\n\n'You may kiss.'\n\nThey kiss. Cheers erupt. Jaehyun throws flowers. Minkyu ugly-cries. CEO: 'This is the best company event ever.'\n\nReception: First dance. Noah whispers: 'How did I get so lucky?' Yuwon: 'We both did.'\n\nCake cutting. Yuwon smashes cake on Noah's face. Noah laughs. Tackles Yuwon. Everyone photographs.\n\nBouquet toss. Single employees scramble. Jaehyun catches it. Minkyu: 'YOU DON'T EVEN WANT TO GET MARRIED!' Jaehyun: 'IT'S THE PRINCIPLE!'\n\nExit: Car with 'JUST MARRIED' sign. Noah carries Yuwon in. Yuwon: 'We did it.' Noah: 'Forever starts now.'\n\nEND CREDITS: Office Monday. Noah and Yuwon's desks: matching nameplates. 'Noah Park-Kim' and 'Yuwon Park-Kim.' Jaehyun gags. Minkyu: 'SHUT UP IT'S ROMANTIC!'", rarity: 'ultra' },
];

// Helper function to get a random card based on rarity drop rates
export const rollCard = () => {
  const rand = Math.random() * 100;
  let rarity;

  // Drop rates: 60% common, 25% rare, 12% super, 3% ultra
  if (rand < 60) rarity = 'common';
  else if (rand < 85) rarity = 'rare';
  else if (rand < 97) rarity = 'super';
  else rarity = 'ultra';

  const cardsOfRarity = cardDatabase.filter(c => c.rarity === rarity);
  return cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
};

export const getRarityColor = (rarity) => {
  switch(rarity) {
    case 'common': return '#9e9e9e';
    case 'rare': return '#2196f3';
    case 'super': return '#ff5722';
    case 'ultra': return '#9c27b0';
    default: return '#9e9e9e';
  }
};
