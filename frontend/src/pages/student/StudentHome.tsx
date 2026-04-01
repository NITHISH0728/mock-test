import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentHome: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchResults(parsedUser._id);
      } catch (e) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchResults = async (studentId: string) => {
      try {
          const res = await fetch(`${API_BASE_URL}/api/results?student_id=${studentId}`);
          if (res.ok) {
              const data = await res.json();
              setResults(data);
          }
      } catch (e) {
          console.error(e);
      }
  };

  if (!user) return <div style={{padding: '32px'}}>Loading profile...</div>;

  const testsAttended = results.length;
  
  const quizResults = results.filter(r => r.test_type === 'quiz');
  const codingResults = results.filter(r => r.test_type === 'code');
  
  const quizAverage = quizResults.length > 0 
      ? quizResults.reduce((acc, curr) => acc + (curr.score / curr.total_marks), 0) / quizResults.length 
      : 0;
      
  const codeAverage = codingResults.length > 0 
      ? codingResults.reduce((acc, curr) => acc + (curr.score / curr.total_marks), 0) / codingResults.length 
      : 0;

  const overallProgress = testsAttended > 0 
      ? Math.round(((quizAverage * quizResults.length) + (codeAverage * codingResults.length)) / testsAttended * 100) 
      : 0;

  return (
    <div style={{ animation: "fadeIn 0.6s ease-out", maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ position: 'relative', marginBottom: '40px', display: 'inline-block' }}>
        <h1 style={{fontSize: '46px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-1.5px'}}>Student Dashboard</h1>
        <div style={{ height: '6px', width: '100%', background: 'linear-gradient(90deg, #FFC107 0%, rgba(255, 193, 7, 0) 100%)', borderRadius: '4px' }}></div>
      </div>

      <div style={{ marginBottom: '16px' }}>
         <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Students Details</h2>
         
         <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px 16px' }}>
                
                {/* Field 1 */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Name</div>
                  <div style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase' }}>{user.name || 'None'}</div>
                </div>

                {/* Field 2 */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Roll Number</div>
                  <div style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase' }}>{user.rollNumber || 'None'}</div>
                </div>

                {/* Field 3 */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Department</div>
                  <div style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase' }}>{user.department || 'None'}</div>
                </div>

                {/* Field 4 */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Registration Number</div>
                  <div style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase' }}>{user.registrationNumber || 'None'}</div>
                </div>

                {/* Field 5 */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Class / Section</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{user.classSection || 'None'}</div>
                </div>

                {/* Field 6 */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>EmailID</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{user.emailId || user.email || 'None'}</div>
                </div>

            </div>
         </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Performance Analytics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>Tests Attended</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>{testsAttended}</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>Avg. Quiz Score</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>{Math.round(quizAverage * 100)}%</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #8B5CF6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>Avg. Coding Score</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>{Math.round(codeAverage * 100)}%</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>Overall Progress</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>{overallProgress}%</div>
            </div>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Recent Assessments</h2>
        
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead style={{ background: '#F8FAFC' }}>
                  <tr>
                     <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Test Name</th>
                     <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Type</th>
                     <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Score</th>
                     <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Date</th>
                  </tr>
               </thead>
               <tbody>
                  {results.length === 0 ? (
                      <tr>
                         <td style={{ padding: '24px', fontSize: '14px', color: '#64748B' }} colSpan={4} align="center">
                            No assessments taken yet
                         </td>
                      </tr>
                  ) : (
                      results.map(r => (
                          <tr key={r.id}>
                             <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0F172A', borderBottom: '1px solid #F1F5F9' }}>{r.test_title}</td>
                             <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>
                                 <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: r.test_type === 'code' ? '#E0E7FF' : '#FEF3C7', color: r.test_type === 'code' ? '#4338CA' : '#D97706' }}>
                                     {r.test_type.toUpperCase()}
                                 </span>
                             </td>
                             <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0F172A', borderBottom: '1px solid #F1F5F9', fontWeight: 600 }}>{r.score} / {r.total_marks}</td>
                             <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>{new Date(r.submitted_at).toLocaleDateString()}</td>
                          </tr>
                      ))
                  )}
               </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

export default StudentHome;
