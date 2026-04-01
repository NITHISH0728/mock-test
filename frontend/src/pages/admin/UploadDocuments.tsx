import React, { useState, useEffect } from 'react';

const UploadDocuments = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [documents, setDocuments] = useState<any[]>([]);
    const [alert, setAlert] = useState<{type: string, message: string} | null>(null);

    useEffect(() => {
        const storedDocs = localStorage.getItem('teacher_documents');
        if (storedDocs) {
            setDocuments(JSON.parse(storedDocs));
        }
    }, []);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setAlert({ type: 'error', message: 'Title and description are required.' });
            return;
        }

        const newDoc = {
            id: Date.now(),
            title,
            description,
            fileName: fileUrl || 'document.pdf', // dummy file logic
            timestamp: new Date().toISOString(),
        };

        const updatedDocs = [newDoc, ...documents];
        setDocuments(updatedDocs);
        localStorage.setItem('teacher_documents', JSON.stringify(updatedDocs));
        
        setTitle('');
        setDescription('');
        setFileUrl('');
        setAlert({ type: 'success', message: 'Document published successfully!' });

        setTimeout(() => setAlert(null), 3000);
    };

    const handleDelete = (id: number) => {
        const updatedDocs = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocs);
        localStorage.setItem('teacher_documents', JSON.stringify(updatedDocs));
    }

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-greeting">Upload Documents</h1>
                <p className="admin-greeting-sub">Post reading materials, assignments, or reference documents for students.</p>
            </div>

            {alert && (
                <div className={`admin-alert ${alert.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`}>
                    {alert.message}
                </div>
            )}

            <div className="admin-card" style={{ marginBottom: '32px' }}>
                <form onSubmit={handleUpload}>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Document Title</label>
                            <input
                                className="admin-form-input"
                                placeholder="e.g. Chapter 1 Reading Material"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">File Upload Placeholder</label>
                             <input
                                type="file"
                                className="admin-form-input"
                                onChange={(e) => setFileUrl(e.target.files?.[0]?.name || '')}
                            />
                        </div>
                    </div>
                    <div className="admin-form-group full-width">
                        <label className="admin-form-label">Description / Instructions</label>
                         <textarea
                            className="admin-form-textarea"
                            placeholder="Brief description or instructions for this document..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px 32px', fontSize: '15px' }}>
                            Upload Document
                        </button>
                    </div>
                </form>
            </div>

            <h3 className="admin-section-title">Uploaded Documents List</h3>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F8FAFC' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Title</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Description</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>File</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Date Posted</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length === 0 ? (
                            <tr>
                                <td style={{ padding: '24px', fontSize: '14px', color: '#64748B', textAlign: 'center' }} colSpan={5}>
                                    No documents uploaded yet.
                                </td>
                            </tr>
                        ) : (
                            documents.map(doc => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1E293B', fontWeight: 600 }}>{doc.title}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B' }}>{doc.description}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#3B82F6' }}>{doc.fileName}</td>
                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B' }}>{new Date(doc.timestamp).toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button 
                                            onClick={() => handleDelete(doc.id)} 
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#EF4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                        >
                                            Delete
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

export default UploadDocuments;
