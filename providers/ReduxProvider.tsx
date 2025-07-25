"use client";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCategories } from "@/redux/features/categorySlice";
import { setProducts } from "@/redux/features/productSlice";
import { store } from "@/redux/store";
import { ICategory, IProduct } from "@/types";
import React, { useEffect } from "react";
import { Provider } from "react-redux";

type PropTypes = {
  products: IProduct[];
  categories: ICategory[];
  children: React.ReactNode;
};

const ReduxProvider = ({ children, products, categories }: PropTypes) => {
  return (
    <Provider store={store}>
      <SetupReduxData products={products} categories={categories}>
        {children}
      </SetupReduxData>
    </Provider>
  );
};

type SetupProps = {
  children: React.ReactNode;
  products: IProduct[];
  categories: ICategory[];
};
const SetupReduxData = ({ children, products, categories }: SetupProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setProducts(products));
    dispatch(setCategories(categories));
  }, []);

  return children;
};

export default ReduxProvider;
