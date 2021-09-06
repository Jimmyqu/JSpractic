import { get, postJSON } from '@/utils/request';

export async function queryCategoryTreeListBySales(params) {
  return get('/item/queryCategoryBySalesId.do', params);
}

export async function queryCategoryTreeListByParent(params) {
  return get('/item/queryCategoryByParentId.do', params);
}

export async function queryGoodsListByCategory(params) {
  return get('/itemStock/queryItemStockByCategory.do', params);
}

export async function searchGoodsListByKeyword(params) {
  return get('/itemStock/queryItemStockByObject.do', params);
}

export async function queryGoodsListByIds(params) {
  return postJSON('/itemStock/queryItemStockByIds.do', params);
}

export async function deleteSomeItemByIds(params) {
  return postJSON('/item/delete.do', params);
}

export async function inboundItem(params) {
  return postJSON('/item/saveItemInStock.do', params);
}

export async function transferItem(params) {
  return postJSON('/itemStock/stockMove.do', params);
}

export async function updateItemPrice(params) {
  return postJSON('/itemStock/updateItemStockPrice.do', params);
}

export async function breakItem(params) {
  return postJSON('/itemStock/breakage.do', params);
}

export async function purchaseItem(params) {
  return postJSON('/itemStock/purchase.do', params);
}

export async function editItem(params) {
  return postJSON('/item/save.do', params);
}

export async function queryInfoByCode(params) {
  return get('/matrix/qrItemCodeQuery.do', params);
}

export async function editItemRank(params) {
  return postJSON('/itemStock/rank/value.do', params);
}

export async function queryStateResult(params) {
  return get('/item/queryByStateResult.do', params);
}

export async function postAnInventory(params) {
  return postJSON('/itemStock/stockTaking.do', params);
}

export async function correctStock(params) {
  return postJSON('/itemStock/correctStock.do', params);
}
