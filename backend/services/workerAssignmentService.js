const User = require("../models/User");

async function assignNearestWorker(latitude, longitude) {
  const workers = await User.find({
    role: "worker",
    isAvailable: true,
  });

  if (workers.length === 0) {
    return null;
  }

  let nearestWorker = workers[0];
  let shortestDistance = Number.MAX_VALUE;

  for (const worker of workers) {
    if (
      !worker.serviceArea ||
      !worker.serviceArea.center.latitude ||
      !worker.serviceArea.center.longitude
    ) {
      continue;
    }

    const distance = calculateDistance(
      latitude,
      longitude,
      worker.serviceArea.center.latitude,
      worker.serviceArea.center.longitude
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestWorker = worker;
    }
  }

  return nearestWorker;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return value * Math.PI / 180;
}

module.exports = assignNearestWorker;