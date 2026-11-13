import { Game } from "@/components/game";
import { DeskScene } from "@/components/desk-scene";

export default function Home() {
  return (
    <main className="game-room">
      <header className="room-header">
        <h1 id="game-title" className="room-title">Tic-Tac-<span>Toe</span></h1>
      </header>
      <DeskScene>
        <Game />
      </DeskScene>
    </main>
  );
}
