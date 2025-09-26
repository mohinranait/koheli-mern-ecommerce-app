"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { SiteSettings } from "@/lib/site-settings";
import { setCategories } from "@/redux/features/categorySlice";
import { setProducts } from "@/redux/features/productSlice";
import { setSiteConfig } from "@/redux/features/siteConfigSlice";
import { store } from "@/redux/store";
import { ICategory, IProduct } from "@/types";
import React, { useEffect } from "react";
import { Provider } from "react-redux";

type PropTypes = {
  products: IProduct[];
  categories: ICategory[];
  children: React.ReactNode;
  setting: SiteSettings;
};

const ReduxProvider = ({
  children,
  products,
  categories,
  setting,
}: PropTypes) => {
  return (
    <Provider store={store}>
      <SetupReduxData
        products={products}
        categories={categories}
        setting={setting}
      >
        {children}
      </SetupReduxData>
    </Provider>
  );
};

type SetupProps = {
  children: React.ReactNode;
  products: IProduct[];
  categories: ICategory[];
  setting: SiteSettings;
};
const SetupReduxData = ({
  children,
  products,
  categories,
  setting,
}: SetupProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSiteConfig(setting));
    dispatch(setProducts(products));
    dispatch(setCategories(categories));
  }, []);

  return children;
};

export default ReduxProvider;
