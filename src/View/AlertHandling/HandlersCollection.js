let handlers = [];

export const addHandler = (handlerCall) => handlers.push(handlerCall);
export const freeHandler = () => handlers.pop();
export const callTopHandler = (alertMessage, alertType) => handlers.at(-1)({message: alertMessage, type: alertType});

window.electron.setAlertHandler(callTopHandler);