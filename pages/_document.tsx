import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Fonts */}
          <link
            rel="preload"
            href="/fonts/Inter-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Inter-Medium.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="prefetch"
            href="/fonts/Roboto-Light.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Meta */}
          <meta name="description" content="Bad cops creation of Cred Jack" />
          <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
