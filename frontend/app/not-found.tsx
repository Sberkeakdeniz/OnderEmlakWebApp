import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '1rem' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#334155', marginBottom: '1rem' }}>Page Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
          <a href="/en" style={{ color: '#2563eb', textDecoration: 'underline' }}>Go to Home</a>
        </div>
      </body>
    </html>
  );
}
