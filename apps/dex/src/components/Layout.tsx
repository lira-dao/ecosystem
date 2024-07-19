import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { x } from '@xstyled/styled-components';
import { Header } from './Header';
import { Footer } from './Footer';


export function Layout() {
  const [isFooterFixed, setIsFooterFixed] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkContentHeight = () => {
      if (contentRef.current) {
        const contentHeight = (contentRef.current as any).clientHeight;
        const viewportHeight = window.innerHeight;
        setIsFooterFixed(contentHeight <= viewportHeight);
      }
    };

    checkContentHeight();
    window.addEventListener('resize', checkContentHeight);

    return () => window.removeEventListener('resize', checkContentHeight);
  }, []);

  return (
    <x.div display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
      <Header />
      <x.div ref={contentRef} w="100%" flexGrow={1} display="flex" justifyContent="center" paddingBottom={isFooterFixed ? '24px' : '0px'}>
        <Outlet />
      </x.div>
      <Footer isFixed={isFooterFixed} />
    </x.div>
  );
}
