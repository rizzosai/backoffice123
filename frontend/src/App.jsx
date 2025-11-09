import { useState } from 'react';
import CoeyCustomAnswers from './components/CoeyCustomAnswers';
import DeployToRender from './components/DeployToRender';
import './App.css';
import Leaderboard from './components/Leaderboard';
import LiveFeed from './components/LiveFeed';
import UserForm from './components/UserForm';
import CoeyChat from './components/CoeyChat';

const navStyle = {
  background: 'linear-gradient(90deg, #e63946 0%, #fff 50%, #457b9d 100%)',
  color: '#fff', // Make nav text white for contrast
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '4px solid #e63946',
};

const navButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#fff', // Make nav button text white for contrast
  fontWeight: 'bold',
  fontSize: '1.1rem',
  margin: '0 1rem',
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  transition: 'background 0.2s',
};

function App() {
  const [page, setPage] = useState('leaderboard');
  const [customAnswers, setCustomAnswers] = useState(() => {
    // Try to load from localStorage for now
    try {
      return JSON.parse(localStorage.getItem('coeyCustomAnswers') || '[]');
    } catch {
      return [];
    }
  });

  function handleSaveCustomAnswers(list) {
    setCustomAnswers(list);
    localStorage.setItem('coeyCustomAnswers', JSON.stringify(list));
    alert('Custom answers saved! (Backend integration coming soon)');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      <nav style={navStyle}>
        <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#fff', letterSpacing: '2px', textShadow: '1px 1px 4px #e63946' }}>
          RizzosAI Backoffice
        </span>
        <div>
          <button style={navButtonStyle} onClick={() => setPage('leaderboard')}>
            Leaderboard
          </button>
          <button style={navButtonStyle} onClick={() => setPage('livefeed')}>
            Live Feed
          </button>
          <button style={navButtonStyle} onClick={() => setPage('forms')}>
            Forms
          </button>
          <button style={navButtonStyle} onClick={() => setPage('custom-answers')}>
            Coey Custom Answers
          </button>
          <button style={navButtonStyle} onClick={() => setPage('deploy')}>
            Deploy to Render
          </button>
        </div>
      </nav>
      <div
        style={{
          background: '#fff',
          padding: '0.5rem 1rem',
          borderBottom: '2px solid #e63946',
          color: '#e63946',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        <span>Coey: Welcome to your affiliate dashboard!</span>
      </div>
      {/* Always-visible guides: Stripe, domain masking, and ad platforms */}
      <div style={{ background: '#f1faee', padding: '1rem', borderRadius: 8, margin: '1rem 0', boxShadow: '0 1px 6px #0001', color: '#222', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ color: '#e63946', marginBottom: 8 }}>How to Get Paid: Stripe Setup Guide</h3>
        <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
          <li><b>Go to Stripe:</b> Click <a href="https://connect.stripe.com/d/setup/s/_TNu1343ssxnKRGsBlYk9zeSxpG/YWNjdF8xU1I4REhJVUZPRDNoOGpF/878c5d96ca7c2df55" target="_blank" rel="noopener noreferrer" style={{ color: '#457b9d', textDecoration: 'underline', fontWeight: 'bold' }}>this link</a> to open Stripe’s sign-up page in a new tab.</li>
          <li><b>Sign up for a Stripe account:</b> Enter your email, full name, and create a strong password. Click “Continue.”
            <ul><li>If you already have a Stripe account, just log in instead.</li></ul>
          </li>
          <li><b>Verify your email:</b> Stripe will send you a confirmation email. Open it and click the verification link.</li>
          <li><b>Enter your business details:</b> Stripe will ask for your business type (individual/sole proprietor is fine if you’re just starting), your legal name, date of birth, address, and phone number. <b>Use your real information</b> so you can get paid.</li>
          <li><b>Add your bank account:</b> Enter your bank account number and routing number. This is where Stripe will send your payouts.</li>
          <li><b>Set up two-step authentication:</b> For security, Stripe will ask you to set up two-step authentication (usually with your phone).</li>
          <li><b>Finish and connect:</b> Once you’ve completed all steps, your Stripe account is ready! Go back to your affiliate dashboard and connect your Stripe account if needed, or contact support for help.</li>
        </ol>
        <p style={{ color: '#e63946', fontWeight: 'bold', marginTop: 8 }}>Tips:</p>
        <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
          <li>Stripe is safe and used by millions of businesses worldwide.</li>
          <li>Keep your login details secure and never share your password.</li>
          <li>If you get stuck, visit <a href="https://support.stripe.com/" target="_blank" rel="noopener noreferrer">Stripe Support</a> or ask our support team for help.</li>
        </ul>
      </div>
      <div style={{ background: '#f1faee', padding: '1rem', borderRadius: 8, margin: '1rem 0', boxShadow: '0 1px 6px #0001', color: '#222', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ color: '#457b9d', marginBottom: 8 }}>How to Mask Your Domain Name (Domain Forwarding with Masking)</h3>
        <p style={{ marginBottom: 8 }}><b>Why mask your domain?</b> Masking your domain name protects your affiliate links, keeps your brand consistent, and makes your links look more professional and trustworthy. It also helps prevent your links from being blocked or flagged on social media and ad platforms.</p>
        <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
          <li><b>Log in to your domain registrar:</b> (e.g., Namecheap, GoDaddy, Google Domains). If you don’t know your registrar, search your email for “domain registration.”</li>
          <li><b>Find your domain:</b> Go to your list of domains and select the one you want to use for your affiliate link.</li>
          <li><b>Open DNS or Forwarding settings:</b> Look for a section called “DNS,” “Domain Forwarding,” or “URL Forwarding.”</li>
          <li><b>Set up forwarding:</b> Find the option to forward your domain. Enter your affiliate link or landing page as the destination URL.</li>
          <li><b>Enable Masking or Cloaking:</b> Make sure to turn on “Masking” or “Cloaking” so your domain name stays in the browser address bar (not all registrars support this—if you don’t see it, check their help docs).</li>
          <li><b>Save your changes:</b> It may take a few minutes to a few hours for changes to take effect.</li>
        </ol>
        <p style={{ color: '#e63946', fontWeight: 'bold', marginTop: 8 }}>Tips:</p>
        <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
          <li>If you’re stuck, search “how to forward domain with masking on [your registrar]” on Google or YouTube.</li>
          <li>Masking helps keep your links looking clean and professional, and can help avoid blocks on social media.</li>
          <li>Contact your registrar’s support if you can’t find the option.</li>
        </ul>
      </div>
      <div style={{ background: '#f1faee', padding: '1rem', borderRadius: 8, margin: '1rem 0', boxShadow: '0 1px 6px #0001', color: '#222', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ color: '#2a9d8f', marginBottom: 8 }}>Level Up: Facebook, Instagram, Twitter, TikTok Ads (Beginner Friendly)</h3>
        {/* Facebook Ads Guide */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#1877f3' }}>Facebook Ads: Step-by-Step Beginner Guide</h4>
          <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li><b>Create a Facebook account:</b> Go to <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">facebook.com</a> and sign up with your real name and email. You’ll need this to run ads.</li>
            <li><b>Set up Facebook Business Manager:</b> Visit <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer">business.facebook.com</a> and click “Create Account.” Enter your business name, your name, and your email. Confirm your email address.</li>
            <li><b>Create an Ad Account:</b> In Business Manager, go to “Business Settings” &gt; “Accounts” &gt; “Ad Accounts.” Click “Add” &gt; “Create a New Ad Account.” Name it, set your time zone and currency, and assign yourself as the admin.</li>
            <li><b>Add a Payment Method:</b> In Business Settings, go to “Payments” and add your credit/debit card or PayPal. This is required to run ads.</li>
            <li><b>Go to Facebook Ads Manager:</b> Visit <a href="https://facebook.com/adsmanager" target="_blank" rel="noopener noreferrer">facebook.com/adsmanager</a>. This is where you’ll create and manage your ads.</li>
            <li><b>Create Your First Campaign:</b> Click the green “Create” button. Choose your campaign objective (for beginners, “Traffic” or “Leads” is a good start). Name your campaign and click “Continue.”</li>
            <li><b>Set Up Your Ad Set:</b> 
              <ul>
                <li><b>Audience:</b> Choose your target location, age, gender, and interests. For example, “United States, 18-65+, interested in fitness.”</li>
                <li><b>Budget & Schedule:</b> Set a daily or lifetime budget. Start small (e.g., $5/day).</li>
                <li><b>Placements:</b> Choose “Automatic Placements” for now.</li>
              </ul>
            </li>
            <li><b>Create Your Ad:</b>
              <ul>
                <li><b>Identity:</b> Select your Facebook Page (create one if you don’t have it).</li>
                <li><b>Format:</b> Choose “Single Image or Video” for simplicity.</li>
                <li><b>Media:</b> Upload a clear, eye-catching image or video. Use free tools like <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer">Canva</a> to design your ad.</li>
                <li><b>Primary Text:</b> Write a short, clear message. Example: “Get fit at home! Try our free workout plan.”</li>
                <li><b>Headline:</b> A catchy title, e.g., “Start Today!”</li>
                <li><b>Call to Action:</b> Pick a button like “Learn More” or “Sign Up.”</li>
                <li><b>Destination:</b> Enter your affiliate or landing page link.</li>
              </ul>
            </li>
            <li><b>Review and Publish:</b> Double-check everything, then click “Publish.” Your ad will be reviewed by Facebook (usually within an hour).</li>
            <li><b>Track Results:</b> In Ads Manager, you’ll see how many people saw, clicked, or signed up from your ad. Adjust your budget or audience as you learn what works.</li>
          </ol>
          <p style={{ color: '#e63946', fontWeight: 'bold', marginTop: 8 }}>Tips for Beginners:</p>
          <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li>Use real photos or videos, not stock images, for better results.</li>
            <li>Keep your message simple and direct.</li>
            <li>Start with a small budget and scale up as you see results.</li>
            <li>Don’t worry if your first ad isn’t perfect—test and learn!</li>
            <li>Need help? Search “Facebook Ads tutorial for beginners” on YouTube for video walkthroughs.</li>
          </ul>
        </div>
        {/* Instagram Ads Guide */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#E1306C' }}>Instagram Ads: Step-by-Step Beginner Guide</h4>
          <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li><b>Set up an Instagram account:</b> Download the Instagram app or go to <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">instagram.com</a> and sign up with your email or phone number.</li>
            <li><b>Switch to a Professional Account:</b> In the Instagram app, go to your profile, tap the menu (≡), then “Settings” &gt; “Account” &gt; “Switch to Professional Account.” Choose “Business.”</li>
            <li><b>Connect to a Facebook Page:</b> Instagram ads are managed through Facebook Ads Manager. Link your Instagram account to a Facebook Page (you can create one if you don’t have it).</li>
            <li><b>Go to Facebook Ads Manager:</b> Visit <a href="https://facebook.com/adsmanager" target="_blank" rel="noopener noreferrer">facebook.com/adsmanager</a>. Click “Create” to start a new campaign.</li>
            <li><b>Choose your objective:</b> For beginners, “Traffic” or “Engagement” is a good start.</li>
            <li><b>Set your audience, budget, and schedule:</b> Just like with Facebook ads, pick your target location, age, interests, and set a daily budget.</li>
            <li><b>Choose Instagram placements:</b> In the “Placements” section, select “Manual Placements” and check “Instagram Feed” and/or “Instagram Stories.”</li>
            <li><b>Create your ad:</b> Upload a high-quality image or video, write a catchy caption, and add a call-to-action button (like “Shop Now” or “Learn More”).</li>
            <li><b>Review and publish:</b> Double-check your ad and click “Publish.”</li>
            <li><b>Track your results:</b> Use Ads Manager to see how your ad is performing and make changes as needed.</li>
          </ol>
          <p style={{ color: '#e63946', fontWeight: 'bold', marginTop: 8 }}>Tips for Instagram:</p>
          <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li>Use bright, eye-catching images or videos.</li>
            <li>Keep text short and to the point—Instagram is visual!</li>
            <li>Try Instagram Stories for more engagement.</li>
            <li>Check out <a href="https://business.instagram.com/advertising" target="_blank" rel="noopener noreferrer">Instagram’s official ad guide</a> for more help.</li>
          </ul>
        </div>
        {/* Twitter Ads Guide */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#1DA1F2' }}>Twitter Ads: Step-by-Step Beginner Guide</h4>
          <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li><b>Create a Twitter account:</b> Go to <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">twitter.com</a> and sign up with your email or phone number.</li>
            <li><b>Go to Twitter Ads:</b> Visit <a href="https://ads.twitter.com/" target="_blank" rel="noopener noreferrer">ads.twitter.com</a> and log in.</li>
            <li><b>Set up your account:</b> Enter your country and time zone, then click “Let’s go.”</li>
            <li><b>Choose your campaign objective:</b> For beginners, “Website Traffic” or “Followers” is a good start.</li>
            <li><b>Set your budget:</b> Decide how much you want to spend per day or for the whole campaign.</li>
            <li><b>Define your audience:</b> Pick your target location, age, gender, and interests.</li>
            <li><b>Create your ad:</b> Write a short, catchy tweet, add an image or video, and include your link. Preview your ad.</li>
            <li><b>Launch your campaign:</b> Review everything and click “Launch campaign.”</li>
            <li><b>Track your results:</b> Use Twitter Ads dashboard to see clicks, impressions, and engagement.</li>
          </ol>
          <p style={{ color: '#e63946', fontWeight: 'bold', marginTop: 8 }}>Tips for Twitter:</p>
          <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li>Keep tweets short and direct.</li>
            <li>Use relevant hashtags to reach more people.</li>
            <li>Images and videos get more attention than plain text.</li>
            <li>Check out <a href="https://business.twitter.com/en/advertising.html" target="_blank" rel="noopener noreferrer">Twitter’s ad guide</a> for more help.</li>
          </ul>
        </div>
        {/* TikTok Ads Guide */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#010101' }}>TikTok Ads: Step-by-Step Beginner Guide</h4>
          <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li><b>Create a TikTok account:</b> Download the TikTok app or go to <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">tiktok.com</a> and sign up.</li>
            <li><b>Go to TikTok Ads Manager:</b> Visit <a href="https://ads.tiktok.com/" target="_blank" rel="noopener noreferrer">ads.tiktok.com</a> and sign up for an advertiser account.</li>
            <li><b>Set up your business info:</b> Enter your business name, industry, and contact info.</li>
            <li><b>Add a payment method:</b> Enter your credit/debit card or PayPal.</li>
            <li><b>Create your first campaign:</b> Click “Campaign” &gt; “Create.” Choose your objective (e.g., “Traffic” or “Conversions”).</li>
            <li><b>Set your ad group:</b> Pick your audience, budget, and schedule. Choose “Automatic Placement” for now.</li>
            <li><b>Create your ad:</b> Upload a vertical video (9:16), write a short description, and add your link.</li>
            <li><b>Review and submit:</b> Double-check your ad and click “Submit.”</li>
            <li><b>Track your results:</b> Use TikTok Ads Manager to see views, clicks, and conversions.</li>
          </ol>
          <p style={{ color: '#e63946', fontWeight: 'bold', marginTop: 8 }}>Tips for TikTok:</p>
          <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 700 }}>
            <li>Use fun, creative videos—TikTok is all about entertainment!</li>
            <li>Keep videos short (15-30 seconds is best).</li>
            <li>Use trending music and hashtags for more reach.</li>
            <li>Check out <a href="https://ads.tiktok.com/business/en/resources" target="_blank" rel="noopener noreferrer">TikTok’s ad resources</a> for more help.</li>
          </ul>
        </div>
      </div>
      <main style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '2rem' }}>
        {page === 'leaderboard' && (
          <div>
            <h2 style={{ color: '#457b9d' }}>Leaderboard</h2>
            <Leaderboard />
          </div>
        )}
        {page === 'livefeed' && (
          <div>
            <h2 style={{ color: '#457b9d' }}>Live Feed</h2>
            <LiveFeed />
          </div>
        )}
        {page === 'forms' && (
          <div>
            <h2 style={{ color: '#457b9d' }}>Submit Email or Payment</h2>
            <p>Fill out the form below to submit your info.</p>
            <UserForm />
          </div>
        )}
        {page === 'custom-answers' && (
          <CoeyCustomAnswers />
        )}
        {page === 'deploy' && (
          <DeployToRender />
        )}
      </main>
  {/* CoeyChat is always visible and starts open for immediate interaction */}
  <CoeyChat />
    </div>
  );
}

export default App;
