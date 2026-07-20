import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'exam_session_v1';
const ExamAuthContext = createContext();

function normTeamKey(name) {
  return (name || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

export function ExamAuthProvider({ children }) {
  const [session, setSession] = useState(null); // { team_name, team_key, isAdmin }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setLoading(false);
  }, []);

  const startSession = (team, isAdmin) => {
    const newSession = {
      team_name: team.team_name,
      team_key: team.team_key || normTeamKey(team.team_name),
      isAdmin: !!isAdmin,
      loggedInAt: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
  };

  const endSession = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  return (
    <ExamAuthContext.Provider value={{ session, loading, startSession, endSession }}>
      {children}
    </ExamAuthContext.Provider>
  );
}

export function useExamAuth() {
  return useContext(ExamAuthContext);
}
