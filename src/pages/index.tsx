import Link from 'next/link';

export default function Home() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <img src="https://i.ibb.co/1T3Jd3m/banner.jpg" alt="Motema Banner" />
      <div>
        <Link href="/" style={{ display: 'inline-block', margin: '10px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
        <Link href="/create-miner" style={{ display: 'inline-block', margin: '10px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>Create Miner</Link>
        <Link href="/verify-miner" style={{ display: 'inline-block', margin: '10px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>Verify Miner</Link>
      </div>
    </div>
  );
}