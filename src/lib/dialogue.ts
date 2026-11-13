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
  emptyRestart: {
    polite: ["A new empty board. Do compare it with the previous empty board."],
    weary: ["We are becoming exceptionally good at preparing to begin."],
  },
  abandonEarly: {
    polite: ["One move. Apparently the opening was the entire proposal."],
    weary: ["Another promising square, dismissed before it could have colleagues."],
  },
  abandonThreat: {
    polite: ["Someone was one move from an answer. You've withdrawn the question."],
    weary: ["The ending approached, so you removed the board. A robust defense."],
  },
  abandonRepeat: {
    polite: ["You keep starting rounds and declining their conclusions."],
    weary: ["I see. We're collecting beginnings. I'll stop preparing endings."],
  },
  abandon: {
    polite: ["That round was still using those squares. Never mind, carry on."],
    weary: ["Unfinished. I'll put it with the others."],
  },
  returnToPlay: {
    polite: ["An actual move. I'll cautiously reopen the file."],
    weary: ["We've returned to playing. Do let me know if that's temporary."],
  },
  resetEmpty: {
    polite: ["No marks. No scores. A very preventative reset."],
    weary: ["You have erased a blank board. Not a trace of nothing remains."],
  },
  resetLeader: {
    polite: ["{leader} was ahead. The new scoreboard takes no position on that."],
    weary: ["The lead belonged to {leader}. It now belongs to nobody. Convenient."],
  },
  resetDraws: {
    polite: ["The evidence of those draws has been removed. The technique remains."],
    weary: ["Even the draws have been erased. Thoroughly inconclusive."],
  },
  repeatMoves: {
    polite: ["The same moves, in the same order. Are we rehearsing?"],
    weary: ["I already have notes for this part. Please signal any new material."],
  },
  breakPattern: {
    polite: ["A different third move. I'll leave room in the notes."],
    weary: ["You've changed the sequence. I'll have to pay attention again."],
  },
  missedWin: {
    polite: ["There was a win available. You've chosen to keep us employed."],
    weary: ["You could have finished. I take it we're enjoying the furniture."],
  },
  missedBlock: {
    polite: ["That leaves the other player a rather short route to the conclusion."],
    weary: ["A winning square left open. I'll prepare the small announcement."],
  },
  fork: {
    polite: ["Two winning squares. The other player still gets only one move."],
    weary: ["Two ways to finish. Surely one of them will be acceptable."],
  },
  recoveredWin: {
    polite: ["{winner} found the win eventually. I'll record only the ending."],
    weary: ["{winner} wins. After declining an earlier appointment with victory."],
  },
  fullBoardWin: {
    polite: ["{winner} wins on the last square. The board was about to run out."],
    weary: ["The ninth square settled it for {winner}. Eight were apparently insufficient."],
  },
  winnerStreak: {
    polite: ["{winner} has won {streak} rounds running. This is becoming a regular arrangement."],
    weary: ["{streak} consecutive wins for {winner}. Shall I stop changing the announcement?"],
  },
  firstPoint: {
    polite: ["A first point for {winner}. The scoreboard is accepting new contributors."],
    weary: ["{winner} finally has a point. I'll try not to make an occasion of it."],
  },
  comeback: {
    polite: ["{winner} has brought the scores level. We may need to keep going."],
    weary: ["Level again, thanks to {winner}. All that work to restore uncertainty."],
  },
  repeatedDraw: {
    polite: ["Another draw. You are agreeing on an outcome, just not a winner."],
    weary: ["{draws} draws in succession. Shall we call this a meeting instead?"],
  },
  drawAfterStreak: {
    polite: ["A draw ends the winning streak. Finally, a change in the paperwork."],
    weary: ["The streak is over. Nobody won, but at least something happened."],
  },
  oppositeCorner: {
    polite: ["Opposite corners. Very balanced, until someone has to win."],
    weary: ["Both ends of the diagonal occupied. The middle remains a discussion."],
  },
  centerTaken: {
    polite: ["You left the middle unattended. Someone has moved in."],
    weary: ["The middle has been claimed. The opening's omission is now official."],
  },
  occupied: {
    polite: ["That square already contains {mark}. It does not accept amendments."],
    weary: ["Still occupied. Persistence is not a fourth rule."],
  },
  finished: {
    polite: ["The round is over. You may admire the board, but not edit it."],
    weary: ["We've reached a conclusion. Clicking it won't make it more conclusive."],
  },
  idleStart: {
    polite: ["I'm ready when you are. The empty board has no further instructions."],
    weary: ["Nine available squares. I'll leave you with the shortlist."],
  },
  idleThreat: {
    polite: ["There is an ending available. No rush; I've already prepared the sentence."],
    weary: ["One move could conclude this. I'll keep the announcement warm."],
  },
  idle: {
    polite: ["Take your time. The other player may also be you, after all."],
    weary: ["A thoughtful pause. I'll assume the thought is still in progress."],
  },
  idleReturn: {
    polite: ["There we are. The board survived the deliberation."],
    weary: ["A move. I had begun to regard the arrangement as permanent."],
  },
  soundMuted: {
    polite: ["You've muted the beeps. The commentary is still in writing."],
    weary: ["The machine is quiet. I remain regrettably legible."],
  },
  soundRestored: {
    polite: ["Sound restored. The squares can announce themselves again."],
    weary: ["The beeps are back. A modest contribution to the conversation."],
  },
  soundFidget: {
    polite: ["We've given the speaker switch its own little game."],
    weary: ["The speaker switch is doing well. The board awaits its turn."],
  },
  keyboard: {
    polite: ["More keys than squares. Please don't encourage it."],
    weary: ["The keyboard. Still an impressive way not to select a square."],
  },
  mug: {
    polite: ["The mug isn't taking a turn. It has enough on its plate."],
    weary: ["Coffee. Yes. Perhaps the board would like some as well."],
  },
  lamp: {
    polite: ["The lamp has done its part. The board is still waiting."],
    weary: ["Still a lamp. I admire its commitment to its one responsibility."],
  },
  wall: {
    polite: ["A wall. No hidden fourth row, I'm afraid."],
    weary: ["The wall has declined to play. I'd hoped for more from you."],
  },
  desk: {
    polite: ["A perfectly serviceable desk. Shall we use what's on it?"],
    weary: ["The desk supports the game. Perhaps you might do the same."],
  },
  objectAgain: {
    polite: ["The {object} has received your attention. The board would like some."],
    weary: ["Yes, the {object}. Your interest in it has been thoroughly documented."],
  },
  distractionBored: {
    polite: ["We've inspected the surroundings. I had also prepared a game."],
    weary: ["The board is unchanged. Your tour of the room is extensive."],
  },
  distractionResigned: {
    polite: ["Very well. I'll describe the room. It has no additional rules."],
    weary: ["I can describe the furniture. I cannot make it take a turn."],
  },
  backFromObjects: {
    polite: ["A square. Excellent. The furniture will manage without us."],
    weary: ["Back to the board. I'll inform the furniture that the interview is over."],
  },
  buttonSpam: {
    polite: ["The button works. It has worked on every attempt."],
    weary: ["Several presses. One function. An ambitious exchange rate."],
  },
  buttonSpamAgain: {
    polite: ["Shall I narrate the buttons instead? They seem to have the leading role."],
    weary: ["I'll stop waiting for a move. We're apparently operating a control panel."],
  },
  occupiedAgain: {
    polite: ["The square cannot become more occupied. We have reached its limit."],
    weary: ["You've made your case. The square remains unmoved."],
  },
  finishedAgain: {
    polite: ["We're now replaying the part where the round has ended."],
    weary: ["I can repeat the result. I cannot improve it by counting your clicks."],
  },
} as const satisfies Record<string, Lines>;

export type DialogueCategory = keyof typeof dialogue;
