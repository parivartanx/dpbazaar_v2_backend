export interface IAnalyticsRepository {
  getKPIs(range: number): Promise<any>;
  getDailyRevenue(range: number): Promise<any[]>;
  getSalesByCategory(range: number): Promise<any[]>;
  getMonthlyPerformance(range: number): Promise<any[]>;
}


// export interface IAnalyticsRepository {
//   getKPIs(): Promise<any>;
//   getDailyRevenue(): Promise<any[]>;
//   getSalesByCategory(): Promise<any[]>;
//   getMonthlyPerformance(): Promise<any[]>;
// }
