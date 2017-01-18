import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const props = await Document.getInitialProps(ctx)
    return { ...props, customValue: 'hi there!' }
  }

  render () {
    return (
     <html>
       <Head>
         <style>{`
           *, *:before, *:after { box-sizing: border-box }
           body { 
             margin: 0;
             font-family: -apple-system, BlinkMacSystemFont, 
             Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, 
             Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
             background-color: #23272d;
          } 
        `}</style>
       </Head>
       <body>
         <Main />
         <NextScript />
       </body>
     </html>
    )
  }
}
