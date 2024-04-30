import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CampaignProvider } from '@/hooks/useCampaign';
import { ReactNode } from 'react';
import './globals.css';
import { FocusedBoardProvider } from '@/hooks/useFocusedBoard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beholder',
  description: 'D&D fun time',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="dark"
        >
          <CampaignProvider>
            <FocusedBoardProvider>{children}</FocusedBoardProvider>
          </CampaignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
