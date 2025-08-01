import React from 'react';
import { CASES } from '../lib/cases';
import styles from '../styles/menu.module.css'; // Import the CSS module

interface LeaderboardProps {
  onBackToMainMenu: () => void;
}

interface ScoreEntry {
  caseId: string;
  score: number;
  timestamp: number;
}

const LOCAL_STORAGE_LEADERBOARD_KEY = 'detectiveGridGameLeaderboard';

const Leaderboard: React.FC<LeaderboardProps> = ({ onBackToMainMenu }) => {
  const [leaderboardData, setLeaderboardData] = React.useState<ScoreEntry[]>([]);

  React.useEffect(() => {
    try {
      const savedLeaderboard = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);
      if (savedLeaderboard) {
        setLeaderboardData(JSON.parse(savedLeaderboard));
      }
    } catch (error) {
      console.error("Failed to load leaderboard from local storage:", error);
    }
  }, []);

  const getCaseTitle = (caseId: string) => {
    return CASES.find(c => c.id === caseId)?.title || 'Unknown Case';
  };

  // Group scores by case and get the best (lowest) score for each
  const bestScoresPerCase = leaderboardData.reduce((acc, entry) => {
    if (!acc[entry.caseId] || entry.score < acc[entry.caseId].score) {
      acc[entry.caseId] = entry;
    }
    return acc;
  }, {} as Record<string, ScoreEntry>);

  const sortedBestScores = Object.values(bestScoresPerCase).sort((a, b) => a.score - b.score);

  return (
    <div className={styles.menuContainer}>
      <h1>Leaderboard</h1>
      {sortedBestScores.length === 0 ? (
        <p style={{ marginTop: '20px' }}>No scores recorded yet. Play a game to set a score!</p>
      ) : (
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Case</th>
              <th className={styles.tableHeader}>Best Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedBestScores.map((entry) => (
              <tr key={entry.caseId}>
                <td className={styles.tableCell}>{getCaseTitle(entry.caseId)}</td>
                <td className={styles.tableCell}>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={onBackToMainMenu}
        className={`${styles.button} ${styles.buttonSecondary}`}
        style={{ marginTop: '30px' }}
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default Leaderboard;