export interface Driver {
    id: string;
    name: string;
    phone: string;
    status: 'available' | 'busy';
    companyId: string;
}