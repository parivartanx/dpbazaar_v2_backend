import { Request, Response } from "express";
import { AnalyticsRepository } from "../repositories/prisma/AnalyticsRepository";
import { ApiResponse } from "../types/common";

export class AnalyticsController {
  private repo: AnalyticsRepository;

  constructor() {
    this.repo = new AnalyticsRepository();
  }

  public getAnalyticsDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const rangeStr = req.query.range as string;
      const range = rangeStr ? Number(rangeStr) : 30; // default: 30 days

      const [
        kpis,
        dailyRevenue,
        salesByCategory,
        monthlyPerformance
      ] = await Promise.all([
        this.repo.getKPIs(range),
        this.repo.getDailyRevenue(range),
        this.repo.getSalesByCategory(range),
        this.repo.getMonthlyPerformance(range)
      ]);

      const response: ApiResponse = {
        success: true,
        message: "Analytics dashboard fetched successfully",
        data: {
          kpis,
          dailyRevenue,
          salesByCategory,
          monthlyPerformance
        },
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics data",
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };
}


// import { Request, Response } from "express";
// import { AnalyticsRepository } from "../repositories/prisma/AnalyticsRepository";
// import { ApiResponse } from "../types/common";

// export class AnalyticsController {
//   private repo: AnalyticsRepository;

//   constructor() {
//     this.repo = new AnalyticsRepository();
//   }

//   public getAnalyticsDashboard = async (_: Request, res: Response): Promise<void> => {
//     try {
//       const [
//         kpis,
//         dailyRevenue,
//         salesByCategory,
//         monthlyPerformance
//       ] = await Promise.all([
//         this.repo.getKPIs(),
//         this.repo.getDailyRevenue(),
//         this.repo.getSalesByCategory(),
//         this.repo.getMonthlyPerformance()
//       ]);

//       const response: ApiResponse = {
//         success: true,
//         message: "Analytics dashboard data fetched successfully",
//         data: {
//           kpis,
//           dailyRevenue,
//           salesByCategory,
//           monthlyPerformance
//         },
//         timestamp: new Date().toISOString()
//       };

//       res.status(200).json(response);

//     } catch (error: any) {
//       const response: ApiResponse = {
//         success: false,
//         message: "Failed to fetch analytics data",
//         error: error.message,
//         timestamp: new Date().toISOString()
//       };
//       res.status(500).json(response);
//     }
//   };
// }
