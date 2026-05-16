import './globals.css';

export const metadata = {
  title: 'SBR - Error Analysis',
  description: 'Interactive Error Analysis preparation platform for the final exam.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
