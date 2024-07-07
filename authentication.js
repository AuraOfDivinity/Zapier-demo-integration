"use strict";

const getAccessToken = async (z, bundle) => {
  const response = await z.request({
    url: "https://asana-integration-poc-production.up.railway.app/auth/zapier/token",
    method: "POST",
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: bundle.inputData.code,
      redirect_uri: bundle.inputData.redirect_uri,
    },
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
};

const refreshAccessToken = async (z, bundle) => {
  const response = await z.request({
    url: "https://asana-integration-poc-production.up.railway.app/auth/zapier/token",
    method: "POST",
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: bundle.authData.refresh_token,
    },
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
};

const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }

  return request;
};

const test = (z, bundle) =>
  z.request({
    url: "https://asana-integration-poc-production.up.railway.app/auth/me",
  });

module.exports = {
  config: {
    type: "oauth2",
    oauth2Config: {
      authorizeUrl: {
        url: "https://accounts.google.com/o/oauth2/auth",
        params: {
          client_id: "{{process.env.CLIENT_ID}}",
          state: "{{bundle.inputData.state}}",
          redirect_uri: "{{bundle.inputData.redirect_uri}}",
          response_type: "code",
          scope: "email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
      getAccessToken,
      refreshAccessToken,
      autoRefresh: true,
    },
    fields: [],
    test,
    connectionLabel: "{{json.email}}",
  },
  befores: [includeBearerToken],
  afters: [],
};
