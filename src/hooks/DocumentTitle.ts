import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} - Infinity Search`;
  }, [title]);
};

export default useDocumentTitle;
