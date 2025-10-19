function Diary() {
  return (
    <div className="content">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '40px'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '20px'
        }}>
          📔
        </div>
        <h1 style={{
          fontSize: '32px',
          color: '#e91e63',
          marginBottom: '15px',
          fontWeight: 700
        }}>
          Diary
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#999',
          marginBottom: '10px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          Coming soon!
        </p>
        <p style={{
          fontSize: '14px',
          color: '#bbb',
          textAlign: 'center',
          maxWidth: '500px',
          lineHeight: '1.6'
        }}>
          A place to reflect on your wins, track your progress over time, and celebrate how far you've come. 💕
        </p>
      </div>

      <div className="footer">
        <span>💕 you're doing amazing babe! even tiny steps count! 🌸</span>
      </div>
    </div>
  );
}

export default Diary;
