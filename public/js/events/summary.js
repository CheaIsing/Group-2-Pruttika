async function getSummary() {
    const {data} = await axiosInstance.get("/events/summary-data/");
    console.log(data);
}
getSummary() 