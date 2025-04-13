import os
import json
import torch
import numpy as np
from torch.utils.data import Dataset
from torch_geometric.utils import degree

from ..api import paper_embed
from ..utils import save_matrix


# create edge connection data
def build_edges(data, title_id, data_mode):
    target_id = [title_id[title] for title in data["citation"]]
    source_id = [data["id"]] * len(target_id)
    if data_mode == "citing":
        edges = np.array([
            source_id,
            target_id
        ])
    elif data_mode == "cited":
        edges = np.array([
            target_id,
            source_id
        ])
    return edges


# create normalized adjacency matrix
def build_norm_adj(embeds, edges):
    num_nodes = embeds.size(0)
    row, col = edges
    
    deg = degree(row, num_nodes, dtype=torch.float)
    deg_inv_sqrt = deg.pow(-0.5)
    deg_inv_sqrt[deg_inv_sqrt == float('inf')] = 0

    edge_weight = deg_inv_sqrt[row] * deg_inv_sqrt[col]
    norm_adj = torch.sparse_coo_tensor(edges, edge_weight, (num_nodes, num_nodes))
    return norm_adj


# PaperGraph dataset
class PaperGraph(Dataset):
    def __init__(self, data_path=None, data_mode="citing"):
        if os.path.exists("data/graph/init_embeds.npy") and os.path.exists(f"data/graph/{data_mode}_edges.npy"):
            embeds = torch.from_numpy(np.load(f"data/graph/init_embeds.npy")).float()
            edges = torch.from_numpy(np.load(f"data/graph/{data_mode}_edges.npy")).long()
        else:
            if data_path is None:
                raise Exception("there is no data!")
            else:
                print("create dataset files")
                with open(data_path) as f:
                    papers = json.load(f)
                title_id = {data["title"]: data["id"] for data in papers} 
                embeds = torch.from_numpy(np.stack([paper_embed(data) for data in papers], axis=0)).float()
                edges = torch.from_numpy(np.concatenate([build_edges(data, title_id, data_mode) for data in papers], axis=1)).long()

                save_matrix(f"data/graph/init_embeds.npy", embeds)
                save_matrix(f"data/graph/{data_mode}_edges.npy", edges)

        norm_adj = build_norm_adj(embeds, edges)

        self.embeds = embeds
        self.edges = edges
        self.norm_adj = norm_adj

    def __len__(self):
        return len(self.embeds)
    
    def __getitem__(self, i):
        return self.embeds[i]
    
