import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

function MarkdownReader({ mdPath, title, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch(mdPath);
        if (!response.ok) {
          throw new Error('Failed to load story');
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mdPath) {
      fetchMarkdown();
    }
  }, [mdPath]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff9f0',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          border: '4px solid #e91e63',
          boxShadow: '0 10px 40px rgba(233,30,99,0.3)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#e91e63',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(233,30,99,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c2185b';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#e91e63';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #fce4ec'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📖</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#e91e63',
            marginBottom: '5px'
          }}>
            Rules Don't Apply
          </h2>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#666',
            margin: 0
          }}>
            {title}
          </h3>
        </div>

        {/* Content */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📚</div>
            <div>Loading story...</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#e91e63' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
            <div>{error}</div>
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              fontSize: '16px',
              lineHeight: '1.9',
              color: '#333',
              fontFamily: 'Georgia, serif'
            }}
            className="markdown-content"
          >
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>

      <style>{`
        .markdown-content p {
          margin-bottom: 1.2em;
          text-indent: 2em;
        }

        .markdown-content hr {
          border: none;
          border-top: 1px solid #fce4ec;
          margin: 2em 0;
        }

        .markdown-content em {
          font-style: italic;
          color: #666;
        }

        .markdown-content strong {
          font-weight: 700;
          color: #e91e63;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3 {
          color: #e91e63;
          margin-top: 1.5em;
          margin-bottom: 0.8em;
          font-weight: 700;
        }

        .markdown-content blockquote {
          border-left: 4px solid #fce4ec;
          padding-left: 20px;
          margin: 1.5em 0;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default MarkdownReader;
