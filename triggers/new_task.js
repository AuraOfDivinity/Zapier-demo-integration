const subscribeHook = async (z, bundle) => {
  const data = {
    url: bundle.targetUrl, // The URL Zapier provides to receive the webhook notifications
  };

  // Log the request object
  z.console.log("Subscribe request data:", data);
  z.console.log("Subscribe request bundle:", bundle);

  const response = await z.request({
    url: "https://asana-integration-poc-production.up.railway.app/webhooks/subscribe",
    method: "POST",
    body: data,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
  });

  return response.data;
};

const unsubscribeHook = async (z, bundle) => {
  const data = {
    url: bundle.targetUrl, // The URL Zapier provided for receiving the webhook notifications
  };

  // Log the request object
  z.console.log("Unsubscribe request data:", data);
  z.console.log("Unsubscribe request bundle:", bundle);

  const response = await z.request({
    url: "https://asana-integration-poc-production.up.railway.app/webhooks/unsubscribe",
    method: "POST",
    body: data,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
  });

  return response.data;
};

const perform = async (z, bundle) => {
  const task = bundle.cleanedRequest; // This will contain the task data sent by your NestJS application
  return [task];
};

module.exports = {
  key: "new_task",
  noun: "Task",
  display: {
    label: "New Task",
    description: "Triggers when a new task is created.",
  },
  operation: {
    inputFields: [],
    type: "hook",
    perform,
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    sample: {
      taskId: 1,
      taskTitle: "Sample Task",
      taskDescription: "This is a sample task",
      taskOwner: "sample@example.com",
    },
    outputFields: [
      { key: "taskId", label: "Task ID" },
      { key: "taskTitle", label: "Task Title" },
      { key: "taskDescription", label: "Task Description" },
      { key: "taskOwner", label: "Task Owner" },
    ],
  },
};
