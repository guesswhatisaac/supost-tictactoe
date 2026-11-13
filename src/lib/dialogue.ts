type Lines = { polite: readonly string[]; weary: readonly string[] };

export const dialogue = {
  welcome: {
    polite: ["Go ahead. I'm sure you have a method.", "You may begin. I'll keep an eye on things."],
    weary: ["We're still here, then.", "Whenever you're ready. Again."],
  },
  center: {
    polite: ["Yes, the middle. We'll proceed from there.", "The middle. Sensible enough."],
    weary: ["The middle. I'll contain my surprise.", "The middle again. Of course."],
  },
  corner: {
    polite: ["A corner. I'll leave you to develop that thought.", "A corner. Very well, proceed."],
    weary: ["A corner. I suppose we had to start somewhere.", "A corner. I'll amend my notes."],
  },
  edge: {
    polite: ["An edge. I'll assume there's a reason.", "An edge. Let's see where you're going with this."],
    weary: ["An edge. You needn't explain. Not yet.", "An edge. I'll reserve judgment. Briefly."],
  },
  repeat: {
    polite: ["The {opening} again. You seem comfortable there.", "Same opening. I'll keep my notes."],
    weary: ["I'll stop asking the other squares to prepare.", "Same opening. We can skip my initial optimism."],
  },
  block: {
    polite: ["I would have preferred you leave that open.", "That complicates things."],
    weary: ["We were one move from being finished.", "Good. We can put off the conclusion a little longer."],
  },
  xWin: {
    polite: ["X wins. I'll put that in the little box.", "Three Xs. I checked."],
    weary: ["X wins. The box has been updated. Again.", "Three Xs. Still the requirement, apparently."],
  },
  oWin: {
    polite: ["O wins. A good day for the circle.", "Three Os. That will suffice."],
    weary: ["O wins. I trust we can leave it at three.", "Another point for O. I'll make room."],
  },
  draw: {
    polite: ["Nothing settled, then.", "Let's try again. With a conclusion this time."],
    weary: ["Nine moves. I was here for all of them.", "All nine squares, and still no agreement."],
  },
  next: {
    polite: ["Another round. We'll proceed as before.", "A fresh board. The scores are staying."],
    weary: ["Again. I'll adjust my expectations.", "Another round. I'll remain cautiously available."],
  },
  reset: {
    polite: ["Starting over. I'll forget the numbers, as requested.", "The scores are gone. We may proceed."],
    weary: ["The scores are gone. A very thorough rebuttal.", "Starting over. I'll try to look surprised."],
  },
} as const satisfies Record<string, Lines>;

export type DialogueCategory = keyof typeof dialogue;
