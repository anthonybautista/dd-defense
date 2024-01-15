import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v13-pagesRouter'; // or `v14-pagesRouter` if you are using Next.js v14
import type { DocumentHeadTagsProps } from '@mui/material-nextjs/v13-pagesRouter';
import {DocumentProps, Html, Head, Main, NextScript} from "next/document"; // or `v14-pagesRouter` if you are using Next.js v14

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = documentGetInitialProps;
