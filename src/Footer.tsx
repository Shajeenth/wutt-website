import wuttLogo from './assets/wutt-logo.png'

function Footer() {
  return (
    <footer className="site-footer" id="depths">
      <div className="site-footer__column site-footer__column--logo">
        <img className="site-footer__logo" src={wuttLogo} alt="Wutt" />
      </div>
      <div className="site-footer__column site-footer__column--address">
        <address className="site-footer__address">
          <a className="site-footer__linktree" href="https://linktr.ee/wutt26">linktree</a>
          <br />
          <br />
          University of Waterloo<br />
          200 University Avenue West<br />
          Waterloo, Ontario, N2L 3G1
        </address>
      </div>
    </footer>
  )
}

export default Footer
