export interface IReportRepository {
  getSalesReport(): Promise<any>;
  getBestSellers(): Promise<any>;
  getCategorySales(): Promise<any>;
  getReturnsReport(): Promise<any>;
}
