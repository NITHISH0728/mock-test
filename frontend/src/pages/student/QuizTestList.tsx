import { API_BASE_URL } from '../../config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestInstructionsModal from './TestInstructionsModal';
import emptyStateImg from '../../assets/empty-bee.png';

const QuizTestList: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [myResults, setMyResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
    fetchMyResults();
  }, []);

  const fetchMyResults = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        try {
            const res = await fetch(`${API_BASE_URL}/api/results?student_id=${user._id}`);
            if (res.ok) {
                const data = await res.json();
                setMyResults(data);
            }
        } catch (e) { console.error(e); }
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tests`);
      const data = await response.json();
      if (response.ok) {
        setTests(data.filter((t: any) => t.test_type === 'quiz' && t.is_published));
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (passKey?: string) => {
    if (selectedTest) {
      if (selectedTest.pass_key) {
          try {
              const res = await fetch(`${API_BASE_URL}/api/tests/${selectedTest.id}/verify-passkey`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ passKey })
              });
              const data = await res.json();
              if (res.ok && data.valid) {
                  navigate(`/student/take-quiz/${selectedTest.id}`);
              } else {
                  alert(data.message || 'Incorrect pass key');
              }
          } catch (e) {
              alert('Error verifying pass key');
          }
      } else {
          navigate(`/student/take-quiz/${selectedTest.id}`);
      }
    }
  };

  if (loading) return <div style={{color: 'var(--student-text)'}}>Loading Quizzes...</div>;

  return (
    <div style={{ animation: "fadeIn 0.6s ease" }}>
      <div style={{ position: 'relative', marginBottom: '40px', display: 'inline-block' }}>
        <h1 style={{fontSize: '46px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-1.5px'}}>Quiz Arenas</h1>
        <div style={{ height: '6px', width: '100%', background: 'linear-gradient(90deg, #FFC107 0%, rgba(255, 193, 7, 0) 100%)', borderRadius: '4px' }}></div>
      </div>
      
      {tests.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '60px 40px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          maxWidth: '600px',
          margin: '40px auto 0',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <img 
            src={emptyStateImg} 
            alt="No quizzes" 
            style={{ width: '180px', height: 'auto', marginBottom: '32px' }} 
          />
          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.5px',
            margin: 0
          }}>
            No quizzes are currently available.
          </h2>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map(test => (
            <div key={test.id} className="test-card">
              <h3>{test.title}</h3>
              <p style={{color: '#a0a5b5', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px'}}>{test.description}</p>
              
              <div className="test-meta">
                <span>⏱ {test.duration_minutes} mins</span>
                <span>📝 {test.question_count || 10} Questions</span>
              </div>
              
              {myResults.some(r => String(r.test_id) === String(test.id)) ? (
                <button className="btn-accent" style={{ background: '#10B981', cursor: 'default' }} disabled>
                  Completed
                </button>
              ) : (
                <button className="btn-accent" onClick={() => setSelectedTest(test)}>
                  Take Test
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTest && (
        <TestInstructionsModal 
          testType="Quiz" 
          testTitle={selectedTest.title} 
          hasPassKey={!!selectedTest.pass_key}
          onStart={handleStartTest} 
          onClose={() => setSelectedTest(null)} 
        />
      )}
    </div>
  );
};

export default QuizTestList;
