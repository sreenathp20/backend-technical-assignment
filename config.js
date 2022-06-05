config = {
    HOST: "cluster0.yqyus.mongodb.net",
    USERNAME: "admin",
    PASSWORD: "admin",
    PORT: 3000,
    indegoApi: "https://kiosks.bicycletransit.workers.dev/phl",
    collection: {
        indego: "indego",
        weather: "weather"
    },
    weather: {
        url: "https://api.openweathermap.org/data/2.5/weather",
        apiKey: "cbb0cff5be72f12b6aa029cf168751a9",
        location: "Philadelphia"
    }
}


module.exports = config