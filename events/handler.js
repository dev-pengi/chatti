
//Project error handler
process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at: " + promise)
    console.log("🟥 Reason: " + reason)
})
process.on("uncaughtException", (err, origin) => {
    console.log("Caught exception: " + err)
    console.log("🟥 Origin: " + origin)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err);
    console.log("🟥 Origin: " + origin)
});
process.on('multipleResolves', (type, promise, reason) => {
    console.log(type, promise);
});
