import './Manifesto.css';
import { ShootingStars } from '../components/ui/ShootingStars';
import { StarsBackground } from '../components/ui/StarsBackground';

export default function Manifesto() {
  return (
    <div className="manifesto-page">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShootingStars />
        <StarsBackground />
      </div>
      
      <div className="manifesto-container">
        <h1 className="manifesto-title">The Future, Decoded</h1>
        <div className="manifesto-content">
          <p className="manifesto-text">
            In a world drowning in noise, the ability to see what's coming isn't just an advantage—it's survival.
          </p>
          <p className="manifesto-text">
            At Probable, we believe the future isn't random. It's a signal waiting to be heard. 
            Prediction markets are the world's most honest mechanism for uncovering that signal, 
            cutting through the bias, the hype, and the fear.
          </p>
          <p className="manifesto-text">
            We are building the tools to harness this intelligence. Not just to watch the future unfold, 
            but to <strong>forecast</strong> it with precision, <strong>hedge</strong> against its risks, and <strong>plan</strong> for its opportunities.
          </p>
          <p className="manifesto-text">
            Whether you're protecting a business from economic shifts, seizing a market trend before it breaks, 
            or simply trying to understand a complex world, Probable is your lens.
          </p>
          <p className="manifesto-text highlight-text">
            Don't just predict the future. Own it.
          </p>
        </div>
      </div>
    </div>
  );
}
