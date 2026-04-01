
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const PreciseBeeLogo = ({ className, width, height }: { className?: string; width?: string | number; height?: string | number }) => (
    <svg className={className} width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="abdomenClip">
            <path d="M 80 105 Q 60 140 100 185 Q 140 140 120 105 Z" />
        </clipPath>

        {/* Wings Behind */}
        <g stroke="#000" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" fill="none">
            {/* Right Top Wing Outer */}
            <path d="M 116 48 L 160 35 L 190 55 L 170 85 L 126 85" />
            {/* Right Top Wing Inner Line */}
            <path d="M 116 68 L 190 55" />
            {/* Right Bottom Wing Outer */}
            <path d="M 170 85 L 164 115 L 124 115 L 112 105" />
            {/* Right Bottom Wing Inner Line */}
            <path d="M 115 95 L 150 105" />
            {/* Right Hanging Line */}
            <path d="M 124 115 L 124 140" />

            {/* Left Top Wing Outer */}
            <path d="M 84 48 L 40 35 L 10 55 L 30 85 L 74 85" />
            {/* Left Top Wing Inner Line */}
            <path d="M 84 68 L 10 55" />
            {/* Left Bottom Wing Outer */}
            <path d="M 30 85 L 36 115 L 76 115 L 88 105" />
            {/* Left Bottom Wing Inner Line */}
            <path d="M 85 95 L 50 105" />
            {/* Left Hanging Line */}
            <path d="M 76 115 L 76 140" />
        </g>

        {/* Nodes (Circles) on Wings - Rendered after wings so they cover inner lines */}
        <g stroke="#000" strokeWidth="6" fill="#F4B400">
            {/* Right wing nodes */}
            <circle cx="153" cy="61.5" r="5" />
            <circle cx="190" cy="55" r="5" />
            <circle cx="150" cy="105" r="5" />
            <circle cx="124" cy="140" r="5" />

            {/* Left wing nodes */}
            <circle cx="47" cy="61.5" r="5" />
            <circle cx="10" cy="55" r="5" />
            <circle cx="50" cy="105" r="5" />
            <circle cx="76" cy="140" r="5" />
        </g>

        {/* Antennae */}
        <path d="M 92 36 Q 85 15 70 18" stroke="#000" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M 108 36 Q 115 15 130 18" stroke="#000" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="70" cy="18" r="5" fill="#F4B400" stroke="#000" strokeWidth="6" />
        <circle cx="130" cy="18" r="5" fill="#F4B400" stroke="#000" strokeWidth="6" />

        {/* Abdomen Base Fill */}
        <path d="M 80 105 Q 60 140 100 185 Q 140 140 120 105 Z" fill="#F4B400" />

        {/* Abdomen Stripe clipped to abdomen shape */}
        <rect x="50" y="125" width="100" height="23" fill="#000" clipPath="url(#abdomenClip)" />

        {/* Abdomen Outline */}
        <path d="M 80 105 Q 60 140 100 185 Q 140 140 120 105 Z" fill="none" stroke="#000" strokeWidth="6" strokeLinejoin="round" />

        {/* Head */}
        <circle cx="100" cy="50" r="22" fill="#000" />

        {/* Center Circle */}
        <circle cx="100" cy="85" r="28" fill="#F4B400" stroke="#000" strokeWidth="6" />

        {/* Center Text Paths `</>` */}
        <g stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* `<` */}
            <path d="M 88 77 L 79 85 L 88 93" />
            {/* `/` */}
            <path d="M 102 96 L 98 74" />
            {/* `>` */}
            <path d="M 112 77 L 121 85 L 112 93" />
        </g>
    </svg>
);

const Header = () => (
    <div className="header">
        <div className="brand-logo">
            <div className="logo-icon">
                <PreciseBeeLogo width="50" height="50" />
            </div>
            <div className="logo-text">
                <div className="brand-name">DevBeeZ</div>
                <div className="brand-tagline">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#000">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    The FullStack Hive
                </div>
            </div>
        </div>
    </div>
);

const LeftContent = () => {
    const navigate = useNavigate();

    return (
        <div className="left-section">
            <Header />
            <div className="main-content-wrapper">
                <div className="heading-wrapper animate-fade-in">
                    <h2 className="heading-line-1">Ace Your Next</h2>
                    <h1 className="heading-line-2">
                        FullStack<br />
                        Interview
                    </h1>
                </div>

                <h3 className="subheading animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    Practicing with The Hive
                </h3>

                <p className="description animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Get real-time feedback, detailed performance<br />
                    metrics, and build confidence with industry<br />
                    experts.
                </p>

                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <button className="cta-button" onClick={() => navigate('/login')}>
                        <div className="cta-icon-plus">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                        <span className="cta-text">Get Started</span>
                        <div className="cta-icon-arrow">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
};

const RightVisual = () => (
    <div className="right-section">
        <div className="visual-content">
            <PreciseBeeLogo className="large-bee float-animation" width="450" height="400" />
        </div>

        <div className="bottom-branding">
            <div className="brand-logo small-logo">
                <div className="logo-icon">
                    <PreciseBeeLogo width="30" height="30" />
                </div>
                <div className="logo-text">
                    <div className="brand-name">DevBeeZ</div>
                    <div className="brand-tagline">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="#000">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        The FullStack Hive
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const LandingPage = () => {
    return (
        <div className="landing-container">
            <LeftContent />
            <RightVisual />
        </div>
    );
};

export default LandingPage;
