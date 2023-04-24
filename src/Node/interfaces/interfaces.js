import kknightsUnify from './kknightsUnify';
import dtfUnify from './dtfUnify';

export const interfaces = {
    kknights: async (data) => await kknightsUnify(data),
    dtf: async (data) => await dtfUnify(data)
};



