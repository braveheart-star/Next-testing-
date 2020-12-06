import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import theme from 'styles/theme'
import { ThemeProvider } from '@material-ui/core';
import { ApolloProvider } from '@apollo/client';
import "styles/app.scss"
import { client } from 'graph_ql';

export default function App({
    Component, pageProps
}) {


    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            </Head>
            <ApolloProvider client={client}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </ApolloProvider>

        </>
    )
}
