import styles from '@components/page/DefaultLayout.module.scss';

import * as React from 'react';

interface DefaultLayoutProps {
  previewPixelSRC?: string;
  children?: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ previewPixelSRC, children }) => {
  return <div className={styles.body}>{children}</div>;
};

export default DefaultLayout;
