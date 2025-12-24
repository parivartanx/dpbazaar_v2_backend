// Main entry point for all cron jobs
import { initializeCronJob as initializeSubscriptionRewardsCron } from './subscription-rewards-cron';

/**
 * Initialize all cron jobs for the application
 */
export function initializeCronJobs() {
  console.log('Initializing all cron jobs...');
  
  // Initialize subscription rewards cron job
  initializeSubscriptionRewardsCron();
  
  console.log('All cron jobs initialized successfully');
}

// If running this file directly, initialize all cron jobs
if (require.main === module) {
  initializeCronJobs();
  console.log('Cron jobs started. Press Ctrl+C to stop.');
}

export default initializeCronJobs;