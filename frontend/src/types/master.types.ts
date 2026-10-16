export interface Taluka {
  id: number;
  nameGu: string;
  nameEn: string;
  district: string;
  districtGu: string;
  state: string;
  stateGu: string;
  orderNo?: number;
  gams?: Gam[];
}

export interface Gam {
  id: number;
  talukaId: number;
  nameGu: string;
  nameEn: string;
  orderNo?: number;
  taluka?: Taluka;
}
