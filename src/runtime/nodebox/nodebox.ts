import { Nodebox } from '@codesandbox/nodebox';

export const initNodebox = async (): Promise<Nodebox> => {
  const iframe = document.createElement('iframe');
  iframe.id = 'nodebox-iframe';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const nodebox = new Nodebox({
    iframe,
  });

  await nodebox.connect();
  return nodebox;
};
