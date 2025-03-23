interface Address {
    id: number;
    createdAt: string;
    updatedAt: string;
    line: string;
    ward: Ward;
    district: District;
    province: Province;
    description: string;
    note: string;
    status: number;
}

interface Province {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    code: string;
}

interface District {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    code: string;
    province: Province;
}

interface Ward {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    code: string;
    district: District;
}
