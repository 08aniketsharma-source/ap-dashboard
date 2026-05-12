/**
 * GMI API proxy — keeps the GetMyInvoices API key out of the browser.
 *
 * Browser calls: /.netlify/functions/gmi-proxy?path=accounts/v3/documents&pageNumber=1&perPage=500&...
 * The function attaches X-API-Key from process.env.GMI_API_KEY and forwards
 * the request to GetMyInvoices.
 *
 * Allowed paths are hardcoded so this can't be abused as a generic proxy.
 *
 * Access control: this function is gated by the same Netlify site-level
 * password protection that gates the static UI — direct external requests
 * receive Netlify's 401 password page, while authenticated browsers in the
 * dashboard pass through via the session cookie. The GMI key itself never
 * leaves the server and is rotatable via:
 *   netlify env:set GMI_API_KEY <new-value> --context production
 */

const GMI_BASE = "https://api.getmyinvoices.com";

const ALLOWED_PATHS = new Set([
  "accounts/v3/documents",
  "accounts/v3/workflowApprovals",
  "accounts/v3/companies",
  "accounts/v3/apiStatus"
]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.GMI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "GMI_API_KEY not configured on Netlify" }) };
  }

  const params = event.queryStringParameters || {};
  const path = params.path;
  if (!path || !ALLOWED_PATHS.has(path)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Path not allowed", got: path || null }) };
  }

  // Forward all query params except `path` to GMI
  const forwarded = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k !== "path") forwarded.append(k, v);
  }
  const qs = forwarded.toString();
  const url = `${GMI_BASE}/${path}${qs ? `?${qs}` : ""}`;

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" }
    });
    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: CORS,
      body: text
    };
  } catch (err) {
    console.error("gmi-proxy upstream error:", err);
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: "Upstream fetch failed", details: err.message }) };
  }
};
