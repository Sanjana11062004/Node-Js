const cron = require('node-cron');

// Define the task to be executed
const task = () => {
    console.log('Task running every 10 seconds...');
    console.log('This is an example of cron to schedule tasks');
    console.log('Please wait for next 10 seconds');
};

// Schedule the task to run every 10 seconds
cron.schedule('*/10 * * * * *', task);

//start represents
// */30: Every 30 seconds
// *: Every minute
// *: Every hour
// *: Every day of the month
// *: Every month
// *: Every day of the week

// Stop the cron job after 5 minutes
setTimeout(() => {
    scheduledTask.stop();
    console.log('Cron job stopped after 1 minutes');
}, 1 * 60 * 1000); // 5 minutes in milliseconds

