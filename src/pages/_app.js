import '../styles/globals.css'
import Head from 'next/head';

import { Provider } from 'react-redux';
import user from '../reducers/user';
import city from '../reducers/city';

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";


const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(value) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const reducers = combineReducers({ user, city });
const persistConfig = { key: 'UnderTheWeather', storage };

const store = configureStore({
    reducer: persistReducer(persistConfig, reducers),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);


function App({ Component, pageProps }) {
    return (
        <>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <Head>
                        <title>Under the weather</title>
                        <link rel="icon" href="/cloudicon.ico" />
                        <meta name="description" content="Yet Another Weather App" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    </Head>
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        </>
    );
}

export default App;
