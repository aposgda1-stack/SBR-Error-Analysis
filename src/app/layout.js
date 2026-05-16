import './globals.css';

export const metadata = {
  title: 'SBR Academy: Error Analysis Rescue',
  description: 'كبسولة ليلة الامتحان - منصة تفاعلية لمادة Error Analysis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
