import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Share2 } from 'lucide-react';
import "./Home.css"; // Reuse home styles for simplicity or create Guide.css

const guideContent = {
    'choosing-the-right-size': {
        title: "Choosing the Right Size",
        subtitle: "How to prevent leaks by ensuring the perfect fit for your baby.",
        image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        readTime: "5 min read",
        date: "Oct 12, 2023",
        content: (
            <>
                <p>Getting the right fit is the #1 way to prevent leaks and blowouts. Diaper sizes are based on weight, but every baby's shape is different. Here is how to know if you need to size up.</p>
                <h3>Signs simple sizing might be wrong</h3>
                <ul>
                    <li>Red marks on the tummy or thighs (too tight).</li>
                    <li>Gaps at the legs or waist (too loose).</li>
                    <li>Frequent leaks or blowouts.</li>
                    <li>The diaper looks like "low rise" jeans (too small).</li>
                </ul>
                <h3>The Two-Finger Rule</h3>
                <p>You should be able to fit two fingers comfortably under the waistband after fastening the diaper. This ensures it's snug enough to stay on but loose enough for the tummy to expand after feeding.</p>
                <div className="quote-block" style={{ borderLeft: '4px solid #0071e3', paddingLeft: '16px', margin: '24px 0', fontStyle: 'italic', color: '#555' }}>
                    "If you are between sizes, always size up. A slightly larger diaper can be adjusted to be tighter, but a too-small diaper will always leak."
                </div>
            </>
        )
    },
    'preventing-diaper-rash': {
        title: "Preventing Diaper Rash",
        subtitle: "Expert tips from dermatologists to keep sensitive skin healthy.",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        readTime: "4 min read",
        date: "Nov 05, 2023",
        content: (
            <>
                <p>Diaper rash is common but preventable. It is usually caused by prolonged exposure to wetness, friction, or new foods.</p>
                <h3>Top Prevention Tips</h3>
                <ul>
                    <li><strong>Change frequently:</strong> Don't let wet diapers sit for too long.</li>
                    <li><strong>Air time:</strong> Let your baby go diaper-free for 10-15 minutes between changes to let skin breathe.</li>
                    <li><strong>Gentle cleaning:</strong> Use water and a soft cloth or alcohol-free wipes. Avoid vigorous rubbing.</li>
                    <li><strong>Barrier cream:</strong> Use a zinc oxide cream to protect the skin from moisture.</li>
                </ul>
            </>
        )
    },
    'day-vs-night-diapers': {
        title: "Day vs Night Diapers",
        subtitle: "When and why to switch to overnight protection.",
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        readTime: "3 min read",
        date: "Sep 28, 2023",
        content: (
            <>
                <p>Sleep is precious—for you and your baby. Using the right diaper can mean the difference between sleeping through the night and a 3 AM outfit change.</p>
                <h3>What is the difference?</h3>
                <p><strong>Day Diapers:</strong> Designed for flexibility and movement. They are thinner to allow walking and crawling.</p>
                <p><strong>Night Diapers:</strong> Designed for maximum absorbency. They have extra layers of polymer to hold 12 hours of liquid and usually come up higher on the back/waist to prevent leaks while lying down.</p>
                <h3>When to switch?</h3>
                <p>If your baby starts sleeping for stretches longer than 4-5 hours, or if you find them waking up wet, it's time to try a night diaper.</p>
            </>
        )
    }
};

const Guide = () => {
    const { slug } = useParams();
    const data = guideContent[slug];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!data) {
        return (
            <div className="page centered-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Guide Not Found</h2>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Back Home</Link>
            </div>
        );
    }

    return (
        <div className="guide-page page">
            <div className="container-wide" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 80px' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6e6e73', textDecoration: 'none', marginBottom: '32px', fontWeight: '500' }}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <h1 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.1' }}>{data.title}</h1>
                <p style={{ fontSize: '20px', color: '#6e6e73', marginBottom: '32px', lineHeight: '1.5' }}>{data.subtitle}</p>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '40px', fontSize: '14px', color: '#86868b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {data.readTime}</span>
                    <span>{data.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', cursor: 'pointer', color: '#0071e3' }}><Share2 size={16} /> Share</span>
                </div>

                <div className="guide-hero-image" style={{
                    height: '400px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    marginBottom: '40px',
                    backgroundImage: `url('${data.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}></div>

                <div className="guide-content-body" style={{ fontSize: '18px', lineHeight: '1.6', color: '#1d1d1f' }}>
                    {data.content}
                </div>
            </div>
        </div>
    );
};

export default Guide;
