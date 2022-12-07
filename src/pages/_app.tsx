import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '../utils/trpc';
import { UserContextProvider } from '../context/user';
import styles from '../styles/Home.module.css';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
    const user = trpc.user.me.useQuery();
    if (!user.data) {
        return <>Loading user...</>
    }
    return (
        <UserContextProvider value={user.data}>
            <div className={styles.container}>
                <Head>
                    <title>Test T3 App</title>
                    <meta name="description" content="Test T3 app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className={styles.main}>
                    <Component {...pageProps} />
                </main>
            </div>
        </UserContextProvider>
    );
}

export default trpc.withTRPC(App)