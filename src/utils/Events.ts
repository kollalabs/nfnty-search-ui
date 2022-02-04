import { toast } from 'react-toastify';

function handleExternal(url: string | undefined, openInNewTab: boolean = false) {
  if (url) {
    openInNewTab ? window.open(url, '_blank') : (window.location.href = url);
  } else {
    console.log('No URL found.');
    toast('Unable to connect to URL', { type: 'warning' });
  }
}

export { handleExternal };
