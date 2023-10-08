import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import * as constants from '../constants.js';

export { render };


async function render(pageContext) {
  const { Page, pageProps } = pageContext;
  const viewHtml = ReactDOMServer.renderToString(<Page {...pageProps} />);
  const openGraphImageUrl = `${constants.url}/opengraph-image.png`

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${constants.title}</title>
        <link rel="icon" href="data:image/x-icon;base64,AA">
        <meta property="og:url" content="${constants.url}">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta property="og:title" content="${constants.title}">
        <meta property="og:description" content="${constants.description}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image:type" content="image/png">
        <meta name="twitter:image:width" content="1200">
        <meta name="twitter:image:height" content="630">
        <meta name="twitter:image" content="${openGraphImageUrl}">
        <meta property="og:site_name" content="${constants.title}">
        <meta property="og:image" content="${openGraphImageUrl}">
        <meta name="twitter:card" content="summary_large_image">
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(viewHtml)}</div>
      </body>
    </html>`;
}
