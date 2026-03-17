
import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact - Board Game Campaign Tracker</title>
        <meta name="description" content="Contact us or report a bug." />
      </Head>

      <div className="container">
        <h1>Contact Form</h1>
        <p>If you have any comments, suggestion or want to report a bug, please fill the following form</p>
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeA1NJvND-kXmskXCecEv0I4e7B3wX-6T5v1aN_IhtYDg53gw/viewform?embedded=true" width="100%" height="800" frameBorder="0" marginHeight="0" marginWidth="0">Carregando…</iframe>
      </div>
    </>
  );
}
