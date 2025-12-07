/**
 * UPGRADED settingChartData function
 * This function is now written to be professional and robust.
 * - It intelligently handles 1 or 2 coins (for CoinPage vs ComparePage).
 * - It formats data and labels for Chart.js.
 */
export const settingChartData = (
  setChartData,
  prices1,
  coin1Data,
  coin2Data, // This will be null on CoinPage
  prices2 // This will be null on CoinPage
) => {
  // Default/first dataset (Coin 1)
  const dataset1 = {
    labels: prices1.map((data) => {
      // Convert timestamp to date
      const date = new Date(data[0]);
      // Format as "Jan 1"
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: coin1Data?.name ?? "Data",
        data: prices1.map((data) => data[1]),
        borderColor: "var(--blue)",
        borderWidth: 2,
        fill: true,
        backgroundColor: "rgba(58, 128, 233, 0.1)", // Gradient fill
        pointRadius: 0,
        tension: 0.25,
        yAxisID: "y-axis-1", // Assign to first y-axis
      },
    ],
  };

  // If we have a second coin, add its data
  if (prices2 && coin2Data) {
    dataset1.datasets.push({
      label: coin2Data?.name ?? "Data 2",
      data: prices2.map((data) => data[1]),
      borderColor: "var(--green)", // Use a different color
      borderWidth: 2,
      fill: true,
      backgroundColor: "rgba(97, 201, 111, 0.1)", // Gradient fill
      pointRadius: 0,
      tension: 0.25,
      yAxisID: "y-axis-2", // Assign to second y-axis
    });
  }

  setChartData(dataset1);
};