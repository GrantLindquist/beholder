import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CampaignProvider } from '@/hooks/useCampaign';
import { ReactNode } from 'react';
import './globals.css';
import { FocusedBoardProvider } from '@/hooks/useFocusedBoard';
import { UserProvider } from '@/hooks/useUser';
import { LoadingProvider } from '@/hooks/useLoader';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FowProvider } from '@/hooks/useFow';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beholder',
  description: 'D&D fun time',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // TODO: Replace most, if not all, await statements with load()
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="dark"
        >
          <LoadingProvider>
            <TooltipProvider delayDuration={500}>
              <UserProvider>
                <CampaignProvider>
                  <FocusedBoardProvider>
                    <FowProvider>{children}</FowProvider>
                  </FocusedBoardProvider>
                </CampaignProvider>
              </UserProvider>
            </TooltipProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
