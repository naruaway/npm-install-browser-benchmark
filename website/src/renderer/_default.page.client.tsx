import ReactDOM from 'react-dom/client';
import React from 'react';
import './style.css';

export async function render(pageContext) {
  const { Page } = pageContext;
  ReactDOM.hydrateRoot(document.getElementById('page-view'), <Page />);
}
