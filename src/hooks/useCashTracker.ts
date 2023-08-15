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

    const getGroupedTransactions = async () => {
        const transactions = await getTransactions();

        const resultObject: any = {};

        for (const trans of transactions) {
            if (resultObject[trans.category]) {
                resultObject[trans.category].push(trans);
            } else {
                resultObject[trans.category] = [trans];
            }
        }

        // {
        //   "rent": [{}, {}],
        //   "travel": [{}, {}]
        // }

        const result: { category: string; transactions: Transaction[] }[] = [];

        Object.keys(resultObject).forEach((cat) => {
            result.push({
                category: cat,
                transactions: resultObject[cat]
            });
        });
        // [
        //   {category: 'travel', transactions: [{}, {}]},
        //   {category: 'food', transactions: [{}, {}]}
        // ]
        return result;
    };

    const deleteTransaction = async (transaction: Transaction): Promise<Transaction[]> => {
        const current = await getTransactions();
        const filtered = current.filter((trans) => trans.id !== transaction.id);
        await saveTransactions(filtered);
        return filtered;
    }

    const updateTransaction = async (transaction: Transaction): Promise<Transaction[]> => {
        const filtered = await deleteTransaction(transaction);
        filtered.push(transaction);
        await saveTransactions(filtered);
        return filtered;
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
        getGroupedTransactions,
        deleteTransaction,
        updateTransaction,
        getIconForCategory,
        getCategories
    };
}