export interface Driver {
    id: string;
    name: string;
    phone: string;
    licensePlate?: string;
    vehicleInfo?: string;
    status: 'available' | 'busy';
    companyId: string;
}
