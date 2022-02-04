import { toast } from 'react-toastify';

function handleExternal(url: string | undefined) {
  if (url) {
    window.open(url, '_blank');
  } else {
    console.log('No URL found.');
    toast('Unable to connect to URL', { type: 'warning' });
  }
}

export { handleExternal };
