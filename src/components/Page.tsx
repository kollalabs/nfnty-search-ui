import { PropsWithChildren, useEffect } from 'react';

const Page = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  useEffect(() => {
    document.title = title || '';
  }, [title]);
  return children;
};

export default Page;
