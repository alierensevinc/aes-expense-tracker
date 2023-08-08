import {
    airplaneOutline,
    businessOutline,
    cartOutline,
    fitnessOutline,
    pizzaOutline,
    schoolOutline
} from "ionicons/icons";
import transactions from './transactions.json';

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
    const getTransactions = async (): Promise<Transaction[]> => {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            resolve(transactions);
        })
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
        getIconForCategory,
        getCategories,
        getTransactions
    };
}