export interface IAdminRepository {
  getTotalRevenue(): Promise<number>;
  getTotalOrders(): Promise<number>;
  getTotalCustomers(): Promise<number>;
  getWeeklySales(): Promise<any[]>;
  getSalesByCategory(): Promise<any[]>;
  getRecentOrders(): Promise<any[]>;
}
