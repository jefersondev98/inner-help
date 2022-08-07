import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type TicketFirestoreDTO = {
    title: string;
    patrimony_number?: number;
    description: string;
    status: 'open' | 'closed';
    solution?: string;
    created_at: FirebaseFirestoreTypes.Timestamp;
    closed_at?: FirebaseFirestoreTypes.Timestamp;
}