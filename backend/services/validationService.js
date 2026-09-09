const mongoose = require("mongoose");

const ISSUE_CATEGORIES = ["Road", "Garbage", "Water", "Electricity", "Other"];
const ISSUE_STATUSES = ["Pending", "In Progress", "Resolved"];

function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function requiredText(value, field, { min = 1, max = 200 } = {}) {
  if (typeof value !== "string") return `${field} is required`;
  const text = value.trim();
  if (text.length < min) return `${field} is required`;
  if (text.length > max) return `${field} must be at most ${max} characters`;
  return null;
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.length <= 254;
}

function validatePassword(value) {
  if (typeof value !== "string" || value.length < 8) return "Password must be at least 8 characters";
  if (value.length > 128) return "Password must be at most 128 characters";
  return null;
}

function isValidObjectId(value) {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value) && new mongoose.Types.ObjectId(value).toString() === value.toLowerCase();
}

function validateOptionalCoordinates(latitude, longitude) {
  const latitudeMissing = latitude === undefined || latitude === null || latitude === "";
  const longitudeMissing = longitude === undefined || longitude === null || longitude === "";
  if (latitudeMissing && longitudeMissing) return null;
  if (latitudeMissing || longitudeMissing) return "Latitude and longitude must be provided together";

  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return "Latitude or longitude is invalid";
  }
  return null;
}

function parsePagination(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 5 : Number(query.limit);
  if (!Number.isInteger(page) || page < 1) return { error: "Page must be a positive integer" };
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) return { error: "Limit must be an integer between 1 and 100" };
  return { page, limit };
}

function validateIssueInput(body) {
  if (!isPlainObject(body)) return "Invalid request body";
  return requiredText(body.title, "Title", { max: 160 })
    || requiredText(body.description, "Description", { max: 5000 })
    || (body.category !== undefined && !ISSUE_CATEGORIES.includes(body.category) ? "Invalid category" : null)
    || validateOptionalCoordinates(body.latitude, body.longitude);
}

module.exports = {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  requiredText,
  isValidEmail,
  validatePassword,
  isValidObjectId,
  validateOptionalCoordinates,
  parsePagination,
  validateIssueInput,
};
