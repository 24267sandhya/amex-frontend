export const featureEngineering = (data) => {
  const prices = data.map((d) => d.close);
  const volatilities = prices.map((p, i, arr) => {
    if (i < 20) return 0;
    const slice = arr.slice(i - 20, i);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    return Math.sqrt(
      slice.map((x) => (x - mean) ** 2).reduce((a, b) => a + b, 0) /
        slice.length
    );
  });

  return data.map((d, i) => ({
    ...d,
    price_change: d.close - d.open,
    price_range: d.high - d.low,
    daily_return: (d.close - d.open) / d.open,
    volatility: volatilities[i],
    moving_average_20:
      i < 20 ? 0 : prices.slice(i - 20, i).reduce((a, b) => a + b, 0) / 20,
    moving_average_50:
      i < 50 ? 0 : prices.slice(i - 50, i).reduce((a, b) => a + b, 0) / 50,
  }));
};
