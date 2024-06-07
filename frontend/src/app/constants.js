export const ITEMS_PER_PAGE = 9;
export const discountPercentage = (product) => {
  return Math.round(product.price * (1 - product.discountPercentage / 100), 2);
};
