import { Store } from '@reduxjs/toolkit';
export type RootState = {
  cart: {
    items: any[];
    total: number;
    loading: boolean;
    error: any;
  };
  orders: {
    orders: any[];
    loading: boolean;
    error: any;
  };
}

export type AppDispatch = Store['dispatch'];
