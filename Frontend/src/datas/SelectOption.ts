export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface DistrictSelectOption extends SelectOption {
    provinceId: string;
}
