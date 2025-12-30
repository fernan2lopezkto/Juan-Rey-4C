export default function ScoreHandler({ score, lastResult }: { score: number, lastResult: any }) {
  return (
    <div className="stats shadow bg-base-300 w-full border border-primary/10">
      <div className="stat place-items-center">
        <div className="stat-title text-sm uppercase">Puntos acumulados</div>
        <div className={`stat-value transition-all duration-300 ${
          lastResult === 'correct' ? 'text-success scale-110' : 
          lastResult === 'incorrect' ? 'text-error animate-shake' : 'text-primary'
        }`}>
          {score}
        </div>
      </div>
    </div>
  );
}
