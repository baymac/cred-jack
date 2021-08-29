import '../styles/global.css';
import AppContextProvider from '../context/AppContextProvider';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </ThemeProvider>
  );
}
