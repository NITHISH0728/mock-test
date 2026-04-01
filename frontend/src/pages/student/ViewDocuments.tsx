import { useState, useEffect } from 'react';

const ViewDocuments = () => {
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        const storedDocs = localStorage.getItem('teacher_documents');
        if (storedDocs) {
            setDocuments(JSON.parse(storedDocs));
        }
    }, []);

    return (
        <div style={{ animation: "fadeIn 0.6s ease-out", maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1E293B', margin: 0 }}>Reading Materials & Documents</h1>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>View and download documents uploaded by your teachers.</p>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F8FAFC' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Document Title</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Description</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Posted Timestamp</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length === 0 ? (
                            <tr>
                                <td style={{ padding: '32px 24px', fontSize: '14px', color: '#64748B', textAlign: 'center' }} colSpan={4}>
                                    No documents have been posted yet.
                                </td>
                            </tr>
                        ) : (
                            documents.map(doc => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: 600, color: '#1E293B' }}>{doc.title}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B' }}>{doc.description}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#94A3B8' }}>{new Date(doc.timestamp).toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button style={{ 
                                            background: '#EFF6FF', 
                                            color: '#3B82F6', 
                                            border: '1px solid #BFDBFE', 
                                            padding: '8px 16px', 
                                            borderRadius: '4px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            alert(`Initiating download for ${doc.fileName}...`);
                                        }}>
                                            View / Download
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewDocuments;
