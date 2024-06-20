import * as tf from "@tensorflow/tfjs";

export const trainModel = async (data) => {
  const featureData = data.map((d) => [
    d.open,
    d.high,
    d.low,
    d.close,
    d.volume,
    d.price_change,
    d.price_range,
    d.daily_return,
    d.volatility,
    d.moving_average_20,
    d.moving_average_50,
  ]);
  const targetData = data.map((d) => d.close).slice(1);

  // Ensure all arrays are of the same length and not empty
  if (featureData.length === 0 || targetData.length === 0) {
    throw new Error("Insufficient data for training.");
  }

  const inputTensor = tf.tensor2d(featureData.slice(0, -1));
  const labelTensor = tf.tensor2d(targetData, [targetData.length, 1]);

  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 64, inputShape: [11], activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  await model.fit(inputTensor, labelTensor, { epochs: 50 });

  return model;
};
