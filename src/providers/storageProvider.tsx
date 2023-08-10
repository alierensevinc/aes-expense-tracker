import {Transaction} from "../hooks/useCashTracker";
import {createContext, useContext, useEffect, useState} from "react";
import {Drivers, Storage} from "@ionic/storage";
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const TRANSACTION_KEY = 'transactions';

interface StorageProps {
    saveTransactions: (transactions: Transaction[]) => void;
    loadTransactions: () => Promise<Transaction[]>;
}

export const StorageContext = createContext<StorageProps>({} as StorageProps);

export const StorageProvider = ({children}: any) => {
    const [store, setStore] = useState<Storage>();

    const init = async () => {
        const newStore = new Storage({
            name: 'expense-tracker',
            driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
        })
        await newStore.defineDriver(CordovaSQLiteDriver);
        const store = await newStore.create();
        setStore(store);
    }

    const saveTransactions = (transactions: Transaction[]) => {
        store?.set(TRANSACTION_KEY, transactions);
    }

    const loadTransactions = async (): Promise<Transaction[]> => {
        const value = await store?.get(TRANSACTION_KEY);
        return value || [];
    };

    useEffect(() => {
        init();
    }, []);

    const value = {
        saveTransactions,
        loadTransactions
    }

    return store ? <StorageContext.Provider value={value}>{children}</StorageContext.Provider> : <></>;
}

export const useStorage = () => {
    return useContext(StorageContext);
}