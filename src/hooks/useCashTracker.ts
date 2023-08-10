import {
    airplaneOutline,
    businessOutline,
    cartOutline,
    fitnessOutline,
    pizzaOutline,
    schoolOutline
} from "ionicons/icons";
import {useStorage} from "../providers/storageProvider";

export interface Transaction {
    id: number;
    createdAt: number;
    title: string;
    value: number;
    notes: string;
    category: string;
    image?: string;
}

export const useCashTracker = () => {
    const {saveTransactions, loadTransactions} = useStorage();

    const getTransactions = async (): Promise<Transaction[]> => {
        const transactions = await loadTransactions();
        return transactions.sort((trans: Transaction, trans2: Transaction) =>
            trans2.createdAt - trans.createdAt
        );
    }

    const addTransaction = async (transaction: Transaction) => {
        const current = await getTransactions();
        return saveTransactions([transaction, ...current]);
    }

    const getTransactionById = async (id: number): Promise<Transaction> => {
        const all = await getTransactions();
        return all.filter((trans) => trans.id === id)[0];
    }

    const getIconForCategory = (cat: string) => {
        switch (cat) {
            case 'Food':
                return pizzaOutline;
            case 'Rent':
                return businessOutline;
            case 'Shopping':
                return cartOutline;
            case 'Sports':
                return fitnessOutline;
            case 'Education':
                return schoolOutline;
            case 'Travel':
                return airplaneOutline;
        }
    };

    const getCategories = () => {
        return [
            {name: 'Food', icon: pizzaOutline},
            {name: 'Rent', icon: businessOutline},
            {name: 'Shopping', icon: cartOutline},
            {name: 'Sports', icon: fitnessOutline},
            {name: 'Education', icon: schoolOutline},
            {name: 'Travel', icon: airplaneOutline}
        ];
    };

    return {
        getTransactions,
        addTransaction,
        getTransactionById,
        getIconForCategory,
        getCategories
    };
}