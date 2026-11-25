import wuttLogo from './assets/wutt-logo.png'

function Footer() {
  return (
    <footer className="site-footer" id="depths">
      <div className="site-footer__column site-footer__column--logo">
        <img className="site-footer__logo" src={wuttLogo} alt="Wutt" />
      </div>
      <div className="site-footer__column site-footer__column--address">
        <address className="site-footer__address">
          <div className="site-footer__socials">
            <a className="site-footer__social-link" href="https://www.instagram.com/" aria-label="Instagram">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a className="site-footer__social-link" href="https://www.linkedin.com/" aria-label="LinkedIn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.26Z" />
              </svg>
            </a>
          </div>
          <div className="site-footer__address-text">
            <a className="site-footer__contact-link" href="#contact-us">Contact Us</a>
            University of Waterloo<br />
            200 University Avenue West<br />
            Waterloo, Ontario, N2L 3G1
          </div>
        </address>
      </div>
    </footer>
  )
}

export default Footer
