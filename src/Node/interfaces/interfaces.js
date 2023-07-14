import kknightsUnify from './kknightsUnify';
import dtfUnify from './dtfUnify';

export const interfaces = {
    kknights: async (data, loadParams) => await kknightsUnify(data, loadParams),
    dtf: async (data, loadParams) => await dtfUnify(data, loadParams),
    vc: async (data, loadParams) => await dtfUnify(data, loadParams) //the same API (•ᴗ•,,)
};



